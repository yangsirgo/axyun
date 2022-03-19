<template>
  <div class="common">
    <!-- 常用诊断 -->
    <div class="sort">
      <el-radio-group v-model="sortType" @change="sortChange">
        <el-radio label="1">个人</el-radio>
        <el-radio label="2">科室</el-radio>
      </el-radio-group>
      <!-- <el-button-group>
        <el-button size="mini">使用次数</el-button>
        <el-button size="mini">最近使用</el-button>
      </el-button-group>-->
    </div>
    <div class="content" v-loading="loading">
      <ul>
        <li class="commonItem" v-for="(item, index) in listData" :key="index">
          <div
            class="commonName fontblue"
            v-if="changeTabsShowQuote == 'diagnosis'"
            @click.stop="quote(item)"
            :title="item.diag_name"
          >
            {{ item.diag_name }}
          </div>
          <div class="commonName" v-else :title="item.diag_name">
            {{ item.diag_name }}
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      title="传染性疾病报卡"
      :visible.sync="dialogVisibleBK"
      width="80%"
      :before-close="handleClose"
      :modal-append-to-body="true"
      :append-to-body="true"
    >
      <infectious-card
        :baokaData="baokaData"
        @submitBK="submitBK"
        ref="infectiousCard"
      ></infectious-card>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>

    <el-dialog
      title="食源性疾病报卡"
      :visible.sync="dialogVisibleBKStyle"
      width="80%"
      :before-close="handleClose"
      :modal-append-to-body="true"
      :append-to-body="true"
    >
      <mainA
        :baokaData="baokaData"
        @submitBK="submitBKStyle"
        ref="mainA"
        style="height: 600px"
      ></mainA>
    </el-dialog>

    <el-dialog
      title="提示"
      width="450px"
      :visible.sync="dialogVisibleDT"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <template>
        <diagTypeSelect
          :hosType="hosType"
          :diagName="currentRow.diag_name"
          ref="diagTypeSelect"
        ></diagTypeSelect>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDelive">引用</el-button>
        <el-button @click="cancelDelive">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getUId } from "@/utils/crypto";
import {
  getCountCommonUseDiag,
  getCommonUseDiag
} from "@/api/tools/commonDiag.js";
import { deepClone } from "@/utils/index.js";
import {
  updateDiag,
  addDiag,
  getCardByICD,
  getDiaTypeList,
  getCardByICDNew
} from "@/api/common/diagnosis";
import { receive } from "@/api/cis/visit/visit";
import { getPatientInfo, savePatientInfo } from "@/api/common/report";
import diagTypeSelect from "@/views/public/modules/diagTypeSelect.vue";
import infectiousCard from "@/views/public/infectious/dialogMain.vue"; //传染病报卡
import mainA from "@/views/public/infectious/mainA.vue"; //食原型报卡弹窗

export default {
  name: "commonDiag",
  components: {
    infectiousCard,
    diagTypeSelect,
    mainA
  },
  data() {
    return {
      hosType: "", // 1 是门诊模块  3 是家床模块
      loading: false,
      sortType: "1",
      listData: [], // 列表数据
      currentRow: {}, // 当前诊断
      // 分页控制参数
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      dialogVisibleDT: false, //诊断类型弹框
      receivePatientData: {}, //当前患者
      dialogVisibleBK: false, // 报卡dialog
      dialogVisibleBKStyle: false, //食源性报卡
      baokaData: {}
    };
  },
  computed: {
    ...mapGetters("base", { cisPatient: "receivePatientData" }),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    ...mapGetters("cis", ["changeTabsShowQuote"]),
    // 获取登录用户信息
    ...mapGetters("user", ["name", "role"]),
    listDisabled() {
      return this.loading || this.noMore;
    },
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  watch: {
    //门诊患者
    cisPatient: {
      deep: true,
      immediate: true,
      handler(val, old) {
        if (!val.appointmentId) {
          return;
        }
        let oldId =
          old !== undefined && old.hasOwnProperty("appointmentId")
            ? old.appointmentId
            : "";
        if (val.appointmentId && val.appointmentId == oldId) {
          return;
        }
        if (val && val.patientId) {
          this.hosType = "1";
          this.receivePatientData = { ...val };
        }
      }
    },
    //家床患者
    homeSickbedsPatient: {
      deep: true,
      immediate: true,
      handler(val, old) {
        if (!val.treatNo) {
          return;
        }
        let oldId =
          old !== undefined && old.hasOwnProperty("treatNo") ? old.treatNo : "";
        if (val.treatNo && val.treatNo == oldId) {
          return;
        }
        if (val && val.patientId) {
          this.hosType = "3";
          this.receivePatientData = { ...val };
        }
      }
    }
  },
  created() {
    this.loadData();
  },
  /* *
   * 类型切换方法（sortChange）：
   * 1.类型切换，刷新常用诊断列表
   * 类型切换方法（typeChange）：
   * 1.类型切换，刷新历次诊断列表
   * 点击选中诊断方法（quote）：
   * 1.点击选中当前行，将当前行的诊断数据放入currentRow变量中，弹出弹框
   * 引用诊断按钮（saveDelive）：
   * 1.引用诊断接口
   * 取消引用诊断按钮（cancelDelive）：
   * 1.关闭弹框
   * * */
  methods: {
    // 类型切换
    sortChange() {
      this.loadData();
    },
    // 加载常用诊断列表
    loadData() {
      this.loading = true;
      let params;
      if (this.sortType === "1") {
        params = {
          doctorId: getUId()
        };
      } else {
        params = {
          deptId: this.role.deptId
        };
      }
      getCountCommonUseDiag(params)
        .then(res => {
          if (res.code === 1) {
            this.listData = res.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 点击选中诊断方法
    quote(row) {
      this.currentRow = row;
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择患者");
        return;
      }
      this.dialogVisibleDT = true;
    },
    // 取消引用诊断按钮
    cancelDelive() {
      this.dialogVisibleDT = false;
    },
    // 引用
    saveDelive() {
      let row = this.currentRow;
      if (
        !this.receivePatientData.treatNo &&
        !this.receivePatientData.visitCode
      ) {
        return;
      }
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择患者");
        return;
      }

      let diagType =
        this.$refs.diagTypeSelect && this.$refs.diagTypeSelect.diagType.code;
      if (diagType === "" || diagType === undefined) {
        this.$message.warning("请选择诊断类型");
        return;
      }

      const data = deepClone(row);
      data.isFirst = "1";
      if (this.hosType == "1") {
        data.visitCode = this.receivePatientData.visitCode;
        this.$delete(data, "treatNo");
        this.$delete(data, "inpCode");
        let isFirst =
          this.$refs.diagTypeSelect && this.$refs.diagTypeSelect.isFirst;
        if (isFirst === "" || isFirst === undefined) {
          this.$message.warning("请选择初复诊");
          return;
        }
        data.isFirst = isFirst || "1";
      } else if (this.hosType == "3") {
        data.inpCode = this.receivePatientData.treatNo;
        this.$delete(data, "visitCode");
      }
      this.$delete(data, "id");

      data.diagMain = "0";
      data.patientId = this.receivePatientData.patientId;
      data.status = "1";
      data.diagDoctorId = this.role.userId;
      data.diagDoctorName = this.name;
      data.diagType = diagType;
      data.startTime = this.dayjs().format("YYYY-MM-DD HH:mm:ss");
      data.patientBirthday = this.receivePatientData.birthDate;
      data.patientAge = this.receivePatientData.patientAge;
      data.patientName = this.receivePatientData.patientName;
      data.patientSex = this.receivePatientData.patientGender;
      data.deptId = this.receivePatientData.ouptDeptId;
      data.deptName = this.receivePatientData.outpDeptName;
      data.clinicType = this.hosType;

      // 患者是2、3、6状态才需要调接诊接口
      /* if (
        this.receivePatientData.recordStatus == "2" ||
        this.receivePatientData.recordStatus == "3" ||
        this.receivePatientData.recordStatus == "6"
      ) {
        // 1、单击一下患者即变为“诊中”了，建议以下诊断为标志事件，改变病人状态，初次登记改变接诊状态
        receive({...this.receivePatientData,triageStatus: data.isFirst}).then(res => {
          // console.info("======res", res)
          if (res.code === 1) {
            // let data = res.data;
          } else {
            this.$message.error("接诊失败，请联系管理员");
          }
        });
      } */

      let receiveData = {};
      if (this.hosType == "1") {
        receiveData = {
          appointmentId: this.receivePatientData.appointmentId,
          freeCode: this.receivePatientData.freeCode,
          haveMoney: this.receivePatientData.haveMoney
        };
      }
      addDiag({
        ...data,
        ...receiveData
      })
        .then(res => {
          if (res.code === 1) {
            this.$message.success("引用成功");
            // this.$emit("load-diag-table");
            this.dialogVisibleDT = false;
            this.$emit("message");
            if (this.hosType == "1") {
              this.goBaoka(data);
            }
          } else {
            this.$message.error(res.msg || "引用失败");
          }
        })
        .catch(err => {
          // this.$message.error(err || "引用失败");
        });
    },

    async goBaoka(data) {
      try {
        let res = await getCardByICDNew({
          diagName: data.diag_name,
          keyword: data.diag_code,
          cwFlag: data.cw_flag,
          type: this.hosType
        });
        if (res.code === 1) {
          if (res.data.length !== 1) {
            return;
          }
          if (
            res.data[0].diseaseReportCard === "" ||
            res.data[0].diseaseReportCard === undefined
          ) {
            return;
          }
          if (res.data[0].diseaseReportCard == 0) {
            //传染病报卡
            this.dialogVisibleBKShow({
              diagName: data.diag_name,
              diagCode: data.diag_code,
              cardSource: this.hosType,
              pid: this.receivePatientData.patientId
              // onsetDate:this.onsetDate
            });
          } else if (res.data[0].diseaseReportCard == 1) {
            //食源性报卡
            this.dialogVisibleBKShowStyle({
              diagName: data.diag_name,
              diagCode: data.diag_code,
              cardSource: this.hosType,
              pid: this.receivePatientData.patientId
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 报卡dialog
    dialogVisibleBKShow(data) {
      this.baokaData = data;
      this.dialogVisibleBK = true;
    },
    dialogVisibleBKShowStyle(data) {
      this.baokaData = data;
      this.dialogVisibleBKStyle = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 提交报卡
    submitBK(data) {
      this.dialogVisibleBK = false;
    },
    submitBKStyle(data) {
      this.dialogVisibleBKStyle = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.common {
  position: relative;
  // width: 100%;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .sort {
    width: 100%;
    line-height: 36px;
    overflow: hidden;
    font-size: $l-font-size;
    margin-bottom: 10px;
    .el-button {
      padding: 2px 5px !important;
      border-radius: 0;
    }
    .el-radio-group {
      display: block;
      .el-radio {
        margin-right: 0;
        margin-top: 11px;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  .table-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: $l-color-bgcolor-11;
    padding: 0 20px;
  }
  .line-container {
    line-height: 30px;
    width: 100%;
    height: 30px;
    padding: 0 20px;
    border-bottom: 1px solid #e4e4e4;
  }
  .list-wrapper {
    overflow: scroll;
    height: calc(100% - 76px);
    .list-item {
      line-height: 30px;
      width: 100%;
      height: 30px;
      padding: 0 20px;
      border-bottom: 1px solid #e4e4e4;
    }
    .list-item:hover {
      background-color: $l-color-bgcolor-12;
    }
  }
  .listLi {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    .quote-button {
      height: 20px;
      line-height: 20px;
      margin-top: 5px;
      padding: 0 4px;
      border-radius: 3px;
      cursor: pointer;
      float: right;
      color: #fff;
    }
  }
  .listReamrks {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 50px;
  }
  .cdiagTitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .content {
    position: absolute;
    top: 48px;
    bottom: 0;
    left: 10px;
    right: 10px;
  }
  .commonItem {
    height: 40px;
    line-height: 40px;
    background-color: $l-color-bgcolor-18;
    margin-top: 5px;
    font-size: $l-font-size;
    &:first-child {
      margin-top: 0;
    }
    .commonName {
      padding: 0 10px;
      margin-right: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fontblue {
      color: #3d7dfb;
    }
    .quote-button {
      display: block;
      margin-top: 9px;
      margin-right: 10px;
    }
  }
}
</style>
