<template>
  <div class="width100 height100">
    <!-- 历次诊断 -->
    <div class="top-container">
      <!-- 类型下拉 -->
      <l-value-domain
        :code="code"
        :value.sync="typeVal"
        @change="typeChange"
        class="select-container"
        :placeholder="$t('base.placeholder')"
      />
      <!-- <l-value-domain
        code="AntimicrobialRanges"
        multiple
        :value.sync="form.recordType"
        placeholder="请选择使用范围"
        @change="recordTypeChange"
      ></l-value-domain> -->
      <!-- <l-value-domain
        :code="code"
        :value.sync="typeVal"
        remoteUrl="http://192.168.198.244:8762/patDiag/getIcd10Dictionary"
        remoteShowKey="icd10Encoding"
        remoteValueKey="dictionaryName"
        @change="typeChange"
        class="select-container"
        placeholder="请选择"
      />-->
      <!-- 时间选择 -->
      <time-tab class="float-right" :val.sync="timeVal" @change="timeChanage" />
    </div>
    <div class="content">
      <el-table
        ref="tableElem"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        height="100%"
        v-loadmore="loadNextPage"
        element-loading-text="加载中..."
      >
        <el-table-column
          prop="name"
          label="诊断名称"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="act-word cursor-pointer" @click="showDetail(scope.row)">
              {{ scope.row.diagName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="就诊时间"
          min-width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.diagTime }}</template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="传染性疾病报卡"
      width="80%"
      :visible.sync="dialogVisibleBK"
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
      :before-close="handleCloseStyle"
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
          :diagName="currentRow.diagName"
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
import TimeTab from "../component/TimeTab";
import InfiniteList from "../component/InfiniteList";
import { getDiagList } from "@/api/tools/historicalDiagnosis";
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/index.js";
import {
  updateDiag,
  addDiag,
  getCardByICD,
  getDiaTypeList,
  getCardByICDNew
} from "@/api/common/diagnosis";

import infectiousCard from "@/views/public/infectious/dialogMain.vue"; //报卡弹窗
import { getPatientInfo, savePatientInfo } from "@/api/common/report";
import diagTypeSelect from "@/views/public/modules/diagTypeSelect.vue";
import mainA from "@/views/public/infectious/mainA.vue"; //食原型报卡弹窗

// 历史诊断
export default {
  components: {
    TimeTab,
    InfiniteList,
    infectiousCard,
    diagTypeSelect,
    mainA
  },
  data() {
    return {
      //诊断类型弹框
      dialogVisibleDT: false,
      currentRow: {},

      dialogVisibleBK: false, // 报卡dialog
      dialogVisibleBKStyle: false, //食源性报卡
      baokaData: {},

      // 类型数据code
      code: "AntimicrobialRanges", // VisitingCategoryCode 20200618之前用的这个
      // 类型值
      typeVal: "",

      // 时间值
      // [0](半年)
      // [1](一年)
      // [2019-1-1,2019-2-1](自定义)
      timeVal: [0],

      // 列表数据
      tableData: [],
      // 分页控制参数
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // table 分页加载必须定义字段
      tlm_isLoading: false,
      receivePatientData: {} //当前患者
    };
  },
  computed: {
    ...mapGetters("base", { cisPatient: "receivePatientData" }),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    ...mapGetters("diagnosis", ["diagTemRefresh"]),
    ...mapGetters("cis", ["leaveAppLoadKey"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.loadTable();
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
        this.receivePatientData = { ...val };
        this.hosType = "1";
        this.loadTable();
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
        this.receivePatientData = { ...val };
        this.hosType = "3";
        this.loadTable();
      }
    },
    eaveAppLoadKey(n) {
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    diagTemRefresh() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    }
  },
  /**
   * 时间范围切换方法（timeChanage）：
   * 1. 时间范围切换，刷新历次诊断列表
   * 类型切换方法（typeChange）：
   * 1. 类型切换，刷新历次诊断列表
   * 点击选中当前行方法（showDetail）：
   * 1. 点击选中当前行，将当前行的诊断数据放入currentRow变量中，弹出弹框
   * 引用诊断按钮（saveDelive）：
   * 1. 引用诊断接口
   * 取消引用诊断按钮（cancelDelive）：
   * 1. 关闭弹框
   * * */

  methods: {
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 加载列表数据 CLINIC_TYPE
    async loadTable() {
      if (!this.receivePatientData.patientId) {
        this.tableData = [];
        return;
      }
      try {
        this.tlm_isLoading = true;
        let params = {
          clinicType: this.typeVal,
          timeVal: this.timeVal[0],
          patientId: this.receivePatientData.patientId,
          ...this.pageParams
        };
        if (this.typeVal == 90) {
          delete params.clinicType;
        }
        if (this.timeVal.length > 1) {
          params.timeVal = "3";
          params["createdAtStart"] = this.timeVal[0];
          params["createdAtEnd"] = this.timeVal[1];
        }

        let response = await getDiagList(params);
        let tableData = [];
        if (response.code == "1") {
          tableData = response.data;
          this.pageParams = { ...response.pageParams };
        }
        this.tableData = tableData;
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
      }
    },
    // 时间范围切换
    timeChanage() {
      this.loadTable();
    },
    // 类型切换
    typeChange() {
      this.loadTable();
    },
    //点击选中当前行
    showDetail(row) {
      this.currentRow = row;
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择患者");
        return;
      }
      this.dialogVisibleDT = true;
    },
    // 引用诊断方法
    saveDelive() {
      let row = this.currentRow;
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
      data.clinicType = this.hosType;
      data.diagMain = "0";
      data.patientId = this.receivePatientData.patientId;
      data.status = "1";
      data.diagType = diagType;
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
            if (this.hosType === "1") {
              this.goBaoka(data);
            }
          } else {
            this.$message.error(res.msg || "引用失败");
          }
        })
        .catch(err => {});
    },
    cancelDelive() {
      this.dialogVisibleDT = false;
    },
    async goBaoka(data) {
      try {
        let res = await getCardByICDNew({
          diagName: data.diagName,
          keyword: data.diagCode,
          cwFlag: data.cwFlag,
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
              diagName: data.diagName,
              diagCode: data.diagCode,
              cardSource: this.hosType,
              pid: this.receivePatientData.patientId
              // onsetDate:this.onsetDate
            });
          } else if (res.data[0].diseaseReportCard == 1) {
            //食源性报卡
            this.dialogVisibleBKShowStyle({
              diagName: data.diagName,
              diagCode: data.diagCode,
              cardSource: this.hosType,
              pid: this.receivePatientData.patientId
            });
          }
        }
      } catch (e) {}
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
    handleCloseStyle(done) {
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
.top-container {
  height: 60;
}

.select-container {
  width: 80px;
}

.content {
  position: absolute;
  top: 51px;
  bottom: 0px;
  left: 10px;
  right: 10px;
  overflow: hidden;
}

.act-word {
  color: $l-color-fontcolor-2;
}
</style>
