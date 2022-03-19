<template>
	<div class="record-history-container">
		<div class="history-list">
			<div class="head">
				<el-radio-group v-model="recordType" @change="getRecordHistoryList(1)">
					<el-radio label="all">全部</el-radio>
					<el-radio label="hos">本机构</el-radio>
					<el-radio label="dept">本科室</el-radio>
				</el-radio-group>
			</div>
			<div class="body">
				<ul>
					<li
            :class="['record-item', {active: activeRecord.enNo === item.enNo}]"
            v-for="(item, index) in recordHistoryList"
            :key="index"
            @click="handleRecordClick(item)"
            :title="`${item.visitingDate || ''}，${item.curMainDiNm || ''}，${item.deptNm || ''}，${item.docName || ''}，${item.hosNm || ''}`"
          >
            {{item.visitingDate || ''}}，{{item.curMainDiNm || ''}}，{{item.deptNm || ''}}，{{item.docName || ''}}，{{item.hosNm || ''}}
          </li>
          <!-- <li>2021-04-01，高血压，全诊科室，张小陈，平沙服务中心</li> -->
				</ul>
        <div style="text-align: center; font-size: 16px;line-height: 40px;" v-show="!total">暂无就诊记录</div>
			</div>
      <div class="footer">
        <el-pagination
          :total="total"
          :pageSize="10"
          :current-page.sync="currentPage"
          layout="prev, pager, next"
          @current-change="getRecordHistoryList"
        />
      </div>
		</div>
		<div class="record-content">
			<div class="head">
				<el-select v-model="activeEmrId" style="width: 300px;" @change="handleEmrChange">
					<el-option v-for="item in emrList" :key="item.mrId" :value="item.mrId" :label="`${item.mrTypeGroup}-${item.mrName}`" />
				</el-select>
				<div class="operation">
					<el-button type="primary" @click="createEmr">复制病历</el-button>
				</div>
			</div>
      <div class="body">
        <l-editor
          ref="axEditor"
          :defaultMsg="defaultMsg"
          :configs="editorConfigs"
          @ready="editorReady"
        >
        </l-editor>
      </div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getHistoryVisitByPage, getHistoryEmrList } from '@/api/emrRecord/cis/patientList';
import { contentQuery } from "@/api/emrRecord/emr/instrument";
import { checkQcDepend } from "@/api/emrRecord/qc";
import { getUId, getUN } from "@/utils/crypto";
import { getRole, getPamars } from "@/utils/auth";
import { receiveVisitRecord } from "@/api/cis/visit/visit.js";
import { getFrameUrlNew } from "@/api/third/third";

export default {
	data() {
		return {
      recordType: 'all',
      recordHistoryList: [],
      currentPage: 1,
      total: 0,
      activeEnNo: 0,
      activeRecord: {},
      emrList: [],
      activeEmrId: '',
      editor: null,
      editorConfigs: {
        editorModel: 'preview',
        defaultModel: 'preview',
        showTabBar: false,
        initialFrameHeight: 200,
        tabToolbars: []
      },
      defaultMsg: '',
      superDoctorVal: '',
      modeType: 'menzhen',
    }
	},
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    patientId() {
      return this.receivePatientData.patientId
    },
    modeNumCode() {
      return this.receivePatientData.visitCode;
    }
  },
  mounted() {
    this.editorConfigs.initialFrameHeight = document.querySelector('.record-content .body').clientHeight;
    this.getRecordHistoryList(1);
  },
  methods: {
    editorReady(instance) {
      this.editor = instance;
      this.editor.execCommand("setmodel", {
        modelType: 'preview',
        showToolbar: false
      });
    },
    async getRecordHistoryList(currentPage) {
      if (!this.receivePatientData.visitCode) {
        this.recordHistoryList = [];
        this.total = 0
        return
      }
      this.currentPage = currentPage;
      const params = {
        onlyHisFlag: '1',
        diagNm: '',
        visitTypeList: [{ visitType: '01', isHome: '0' }],
        noDiagViewFlag: '1',
        pageNo: this.currentPage,
        pageSize: 10,
        scopeFlag: this.recordType,
        excludeCurEn: '1',
        curEnId: this.receivePatientData.visitCode,
        noMrViewFlag: '0'
      };
      const res = await getHistoryVisitByPage(this.patientId, params);
      if (res.code === 1) {
        this.recordHistoryList = res.data.map(item => ({
          ...item,
          visitingDate: item.visitingTime ? item.visitingTime.split(' ')[0] : ''
        }))
        this.total = res.total
      }
    },
    async getHistoryEmrList() {
      const { hosId, enNo: enId } = this.activeRecord;
      const result = await getHistoryEmrList(hosId, enId)
      this.emrList = result.data || [];
    },
    async handleRecordClick(record) {
      this.activeRecord = record;
      await this.getHistoryEmrList();
      this.activeEmrId = this.emrList.length ? this.emrList[0].mrId : '';
      this.handleEmrChange(this.activeEmrId);
    },
    handleEmrChange(mrId) {
      if (!this.activeEmrId) {
        this.editor.setContent('');
        return;
      }
      this.emrInfo = this.emrList.find(item => item.mrId === mrId);
      contentQuery({
        mrId
      }).then(res => {
        if (res.code === 1) {
          const defaultMsg = res.data.docMongoContent;
          this.editor.setContent(defaultMsg);
          const size = this.editor.queryCommandValue("papersize");
          this.editor.execCommand("papersize", size);
        } else {
          this.$message.error("查询失败!");
          return;
        }
      });
    },
    async createEmr() {
      if (this.emrInfo.typeCode === 'T_2104230001') {
        const thirdRes = await getFrameUrlNew({
          identificationType: this.receivePatientData.identificationType || '1',
          identificationNum: this.receivePatientData.identificationNum,
          identificationName: this.receivePatientData.patientName
        });
        const { manageOrgCode, hypertensionCdId } = thirdRes.data.baseInfo ? thirdRes.data.baseInfo : {};

        if (!manageOrgCode) {
          this.$message.error('未查询到居民的健康档案，无需进行高血压随访');
          return;
        }

        let pamars = JSON.parse(getPamars());
        let hosID = '';
        if (pamars.hosId.slice(0, 1) === 'H') {
          hosID = pamars.hosId.slice(20, 33);
        } else {
          hosID = pamars.hosIdNum.slice(20, 33);
        }
        if (manageOrgCode !== hosID) {
          this.$message.error('该居民的健康档案当前不归本中心管理，无需进行高血压随访服务，请另选常规病历继续接诊');
          return;
        }

        if (!hypertensionCdId) {
          this.$message.error('该居民当前未建立高血压专案，如需随访请先建立‘专案’！');
          return;
        }
      }


      if (!this.activeEmrId) {
        this.$message.warning('未选择任何病历');
        return
      }
      // 如果被其他医生接诊 则不创建文书
      const flag = await this.judgeCallVisitInteFace();
      if (!flag) {
        return
      }

      const param = {
        templateName: this.emrInfo.mrName,
        businessTime: new Date(),
        supDctId: this.superDoctorVal || '',
        typeCode: this.emrInfo.typeCode,
        templateCode: this.emrInfo.templateCode,
        pastMrId: this.emrInfo.mrId,
        signLevel: this.emrInfo.signLvlCd,
        templateVersion: this.emrInfo.templateVersion,
        createType: "byPast"
      }
      this.checkQcDependHandle({
        ocType: param.typeCode,
        enNo: this.modeNumCode
      }).then(res => {
        if (res) {
          this.$emit('createEmrByHistory', { param, activeTab: 'historyRecord'});
        }
      });
    },
    checkQcDependHandle(paramCheck) {
      // 检验当前选中文书是否有依赖的文书 先写另外一个
      return (
        checkQcDepend(paramCheck, true)
          // eslint-disable-next-line consistent-return
          .then(res => {
            if (res.code === 1) {
              return true;
            } else if (res.code === 0) {
              // // 取toDocTypes 进行查询选择重新选择文书
              // if (res.data.continus) {
              //   return true;
              // }
              // this.$confirm(`${res.msg}`, "提示", {
              //   confirmButtonText: "确定",
              //   cancelButtonText: "取消",
              //   type: "warning"
              // })
              //   .then(() => {
              //     let typeCode = res.data.toDocTypes[0];
              //     this.classVal = typeCode;
              //     this.tempVal = "";
              //     this.queryTemplate();
              //   })
              //   .catch(() => {});
            } else {
              this.$message.error(res.msg || "有依赖文书未完成！");
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "检查文书依赖接口异常");
          })
      );
    },
    // 判断是否调用接诊接口
    async judgeCallVisitInteFace() {
      if (
        this.modeType === "menzhen" &&
        this.receivePatientData.recordStatus === "2"
      ) {
        let { hosId = "", orgId = "" } = JSON.parse(getPamars());
        let { deptId = "", deptName = "" } = JSON.parse(getRole());
        let doctorIdStr = getUId();
        let params = {
          visitCode: this.receivePatientData.visitCode,
          patientId: this.patientId,
          patientName: this.receivePatientData.patientName,
          visitType: "1",
          outpDeptId: deptId,
          outpDeptName: deptName,
          diagTime: this.dayjs().format(""),
          doctorId: doctorIdStr,
          doctorName: getUN(),
          isRtnVisit: "1",
          hosId: hosId,
          orgId: orgId,
          freeCode: this.receivePatientData.freeCode,
          haveMoney: this.receivePatientData.haveMoney,
          appointmentId: this.receivePatientData.appointmentId
        };

        try {
          const { code, data, msg = "" } = await receiveVisitRecord(params);
          // 刷新左侧待诊患者列表
          this.$root.eventHub.$emit('refresh-wait-patientList', 'third');
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return true;
      }
    },
  },
  watch: {
    async receivePatientData(newVal, oldVal) {
      if (newVal.visitCode === oldVal.visitCode) {
        return;
      }

      this.editor.setContent('');
      this.emrList = [];
      this.activeEmrId = '';
      await this.getRecordHistoryList(1);
      const activeRecord = this.recordHistoryList[0];
      if (activeRecord) {
        this.activeRecord = activeRecord;
        await this.getHistoryEmrList();
        this.activeEmrId = this.emrList.length ? this.emrList[0].mrId : '';
        this.handleEmrChange(this.activeEmrId);
      }
    }
  }
}
</script>

<style lang="scss">
.record-history-container {
  height: 100%;
  box-sizing: border-box;
	display: flex;
	.history-list {
		width: 350px;
    display: flex;
    flex-direction: column;
    .head {
      background: #ddd;
      text-align: center;
      line-height: 40px;
    }
    .body {
      font-size: 14px;
      flex: 1;
      .record-item {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 10px;
        line-height: 30px;
        cursor: pointer;
        &.active {
          background: #2B4583;
          color: #fff;
        }
      }
    }
    .footer {
      text-align: center;
      line-height: 50px
    }
	}
	.record-content {
		flex: 1;
    border-left: 1px solid #ccc;
    padding: 0 8px;
    display: flex;
    flex-direction: column;
    .head {
      height: 40px;
      line-height: 40px;
      .operation {
        float: right;
      }
    }
    .body {
      flex: 1
    }
	}
}
</style>
