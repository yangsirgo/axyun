<template>
  <div class="contain width100 height100">
    <div class="top-container">
      <!-- 检索 -->
      <el-checkbox v-model="checked">个人</el-checkbox>
      <el-input
        class="margin-top-8 margin-left-8"
        placeholder="请输入主诊断"
        type="text"
        v-model="keyword"
        @keyup.enter.native="handleSearch"
      >
        <el-button
          class="append-button"
          slot="append"
          size="mini"
          icon="el-icon-search"
          @click.native="handleSearch"
        ></el-button>
      </el-input>
    </div>
    <div class="margin-top-8 height100">
      <l-table
        layout="pager"
        class="height100"
        paginationAlign="center"
        :total="total"
        :pageSize.sync="pageParams.pageSize"
        :page.sync="pageParams.pageNo"
        :singlePageShow="true"
        @changeSize="changeSize"
      >
        <el-table
          :data="tableData"
          border
          stripe
          height="100%"
          class="tableData"
          v-loading="isLoading"
          @row-click="showPop"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
            :index="indexMethod"
          >
          </el-table-column>
          <el-table-column prop="recordName" label="病历数据">
          </el-table-column>
        </el-table>
      </l-table>
    </div>

    <el-dialog
      :visible.sync="oldRecordDialogFlag"
      :append-to-body="true"
      width="860px"
    >
      <p slot="title">
        <span>病历详情</span>
        <span class="old-title" :title="currentData.recordName">{{
          currentData.recordName | handleText
        }}</span>
      </p>
      <div class="center">
        <oldRecordShow :oldSysData="currentData" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="copyOldSysHandler">复制</el-button>
        <el-button @click="closeOldSysHandler">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSysDataList } from "@/api/emrRecord/tools/oldSysRecord.js";

import oldRecordShow from "@/views/emrRecord/emr/component/oldRecordShow.vue";
import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";
import { getDefaultTempNOPatient } from "@/api/emrRecord/emr/template";
import { getUId, getUN } from "@/utils/crypto";
import { getRole, getPamars } from "@/utils/auth";
import { checkQcDepend } from "@/api/emrRecord/qc";
import { receiveVisitRecord } from "@/api/cis/visit/visit.js";

export default {
  name: "",
  components: { oldRecordShow },
  props: {
    //编辑器示例
    editor: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      checked: false,
      keyword: "",
      total: 0, // 总共页数
      pageParams: {
        pageNo: 1, // 当前页数
        pageSize: 20 // 每页数据条数
      },
      isLoading: false,
      tableData: [],
      currentData: { recordName: "" },
      oldRecordDialogFlag: false,
      modeType: 'menzhen',
      superDoctorVal: '',
      defaultEmrTemp: null
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    // ...mapGetters("homeSickbeds", {
    //   homeSickbedsPatient: "receivePatientData"
    // }),
    identificationNum() {
      return this.receivePatientData.identificationNum
        ? this.receivePatientData.identificationNum
        : "";
    },
    patientId() {
      return this.receivePatientData.patientId
    },
    modeNumCode() {
      return this.receivePatientData.visitCode;
    }
  },
  filters: {
    handleText(text) {
      if (!text) return "";
      return text.length > 50 ? text.substr(0, 50) + "..." : text;
    }
  },
  watch: {
    "receivePatientData.identificationNum": {
      handler(newVal) {
        if (newVal) {
          this.request();
        } else {
          this.tableData = [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    setOldSysDataHandler(oldSysData) {
      this.oldSysData = oldSysData;
    },
    // 复制老系统文书
    async copyOldSysHandler() {
      console.log('recContent===', this.receivePatientData);
      const result  = await getParamsByKey({ key: ['HCHisEmrUseTypeCode'] });
      const typeCode = result.data.HCHisEmrUseTypeCode;
      const emrTemRes = await getDefaultTempNOPatient(typeCode);
      if (emrTemRes.code !== 1) {
        this.$message.error(emrTemRes.msg);
        return;
      }
      this.defaultEmrTemp = emrTemRes.data;

      this.editor.setContent(this.defaultEmrTemp.content);
      this.editor.execCommand("setmodel", {
        modelType: "edit",
        showToolbar: true
      });
      // 段落处理
      // 主诉处理
      // if (this.editor.options.editorModel !== "edit") {
      //   this.$message.warning("非编辑模式，不能引入病历数据!");
      //   return;
      // }
      this.editor.execCommand("replaceparagraph", {
        type: "PT_zs",
        content: this.currentData.zsxx || "",
        name: "主诉"
      });

      // 现病史处理
      let xbsStr = this.currentData.xbs || "";
      let xbsList = xbsStr.split("/r/n").filter(item => item != "");
      let xbsHtml = "";
      xbsList.forEach((xbs, index) => {
        xbsHtml += `<p>${index + 1}. ${xbs};</p>`;
      });

      this.editor.execCommand("replaceparagraph", {
        type: "PT_xbs",
        content: xbsHtml,
        name: "现病史"
      });

      // 既往史处理
      this.editor.execCommand("replaceparagraph", {
        type: "PT_jws",
        content: this.currentData.jws || "",
        name: "既往史"
      });

      // 体格检查描述处理
      this.editor.execCommand("replaceparagraph", {
        type: "PT_tgjcnr",
        content: this.currentData.tgjc || "",
        name: ""
      });

      // 处方处理
      // let preStr = this.currentData.ypmc || "";
      // let preList = preStr.split("/r/n").filter(item => item != "");
      // let preHtml = "";
      // preList.forEach((pre, index) => {
      //   preHtml += `<p>${index + 1}. ${pre};</p>`;
      // });

      // this.editor.execCommand("replaceparagraph", {
      //   type: "PT_20100014",
      //   content: preHtml,
      //   name: "处方"
      // });

      // 健康教育
      let healthStr = this.currentData.healthteach || "";
      let healthList = healthStr.split("/r/n").filter(item => item != "");
      let healthHtml = "";
      healthList.forEach((health, index) => {
        healthHtml += `<p>${index + 1}. ${health};</p>`;
      });

      this.editor.execCommand("replaceparagraph", {
        type: "PT_jkjy",
        content: healthHtml,
        name: "健康教育"
      });

      let manageStr = this.currentData.gljh || "";
      let manageList = manageStr.split("/r/n").filter(item => item != "");
      let manageHtml = "";
      manageList.forEach((manage, index) => {
        manageHtml += `<p>${index + 1}. ${manage};</p>`;
      });

      // 管理计划处理
      this.editor.execCommand("replaceparagraph", {
        type: "PT_gljh",
        content: manageHtml,
        name: "管理计划"
      });

      // 元素处理
      this.editor.execCommand("insertelecontent", {
        height: this.currentData.h || "",
        weight: this.currentData.w || ""
      });
      // 身高处理
      // 体重处理

      this.closeOldSysHandler();
      // 如果被其他医生接诊 则不创建文书
      const flag = await this.judgeCallVisitInteFace();
      if (!flag) {
        return
      }
      const param = {
        templateName: this.defaultEmrTemp.templateName,
        businessTime: new Date(),
        supDctId: this.superDoctorVal,
        typeCode: this.defaultEmrTemp.typeCode,
        templateCode: this.defaultEmrTemp.templateCode,
        signLevel: this.defaultEmrTemp.signLevel,
        templateVersion: this.defaultEmrTemp.templateVersion,
        // createType: 'byTemp'
      }
      this.checkQcDependHandle({
        docType: param.typeCode,
        enNo: this.modeNumCode
      }).then(res => {
        if (res) {
          this.$emit("createEmrByDefaultTemp", { param: param, activeTab: 'oldSystemRecord' });
        }
      });

    },
    async getDefaultTempNOPatient(typeCode, age) {
      const defaultEmrTemp = await getDefaultTempNOPatient({
        typeCode: typeCode,
        visitType: '01',
        dnFlag: '1',
        age: this.receivePatientData.patientAge,
        sex: this.receivePatientData.patientGender,
        currTenant: '1',
        currHos: '1',
        currDept: '1',
        currUser: '1',
        level0: '0',
        level1: '1',
        level2: '2',
        level9: '9'
      });
      return defaultEmrTemp;
    },
    openOldSysHandler() {
      this.oldRecordDialogFlag = true;
    },
    // 关闭老系统文书
    closeOldSysHandler() {
      this.oldRecordDialogFlag = false;
    },
    handleSearch() {
      this.request();
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.request();
    },
    showPop(row) {
      this.currentData = row;
      this.openOldSysHandler();
    },
    request() {
      if (this.isLoading) return;
      this.isLoading = true;
      let params = {
        ...this.pageParams,
        curDocFlag: this.checked ? 1 : 0,
        keyword: this.keyword,
        sfzh: this.identificationNum
      };
      getSysDataList(params)
        .then(resData => {
          const { code, data, msg = "", pageNo, pageSize, total } = resData;
          if (code === 1) {
            this.pageParams.pageNo = pageNo;
            this.pageParams.pageSize = pageSize;
            this.total = total;
            this.tableData = data.map(item => {
              return {
                ...item,
                recordName: `${item.kssj || ""}-${item.zyzd ||
                  ""}-${item.ysxm || "无"}-${item.jzks || ""}`
              };
            });
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
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
    checkQcDependHandle(paramCheck) {
      // 检验当前选中文书是否有依赖的文书 先写另外一个
      return (
        checkQcDepend(paramCheck, true)
          // eslint-disable-next-line consistent-return
          .then(res => {
            if (res.code === 1) {
              return true;
            } else if (res.code === 0) {
              // 取toDocTypes 进行查询选择重新选择文书
              if (res.data.continus) {
                return true;
              }
              this.$confirm(`${res.msg}`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  let typeCode = res.data.toDocTypes[0];
                  this.classVal = typeCode;
                  this.tempVal = "";
                  this.queryTemplate();
                })
                .catch(() => {});
            } else {
              this.$message.error(res.msg || "有依赖文书未完成！");
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "检查文书依赖接口异常");
          })
      );
    },
  }
};
</script>
<style>
.old-title {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 600;
}
.center {
  max-height: 500px;
  overflow: auto;
}
</style>
<style lang='scss' scoped>
.append-button {
  box-sizing: border-box;
}
.contain {
  display: flex;
  flex-direction: column;
  .top-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
