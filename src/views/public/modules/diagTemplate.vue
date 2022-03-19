<template>
  <div class="common">
    <!-- 诊断模板 -->
    <div class="sort">
      <div class="search">
        <el-input
          v-model="temName"
          placeholder="请输入模板名称"
          @keyup.enter.native="search"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="loadData"
          ></el-button>
        </el-input>
      </div>
      <el-radio-group v-model="sortType" @change="loadData">
        <el-radio label="1">个人</el-radio>
        <el-radio label="2">科室</el-radio>
      </el-radio-group>
      <!-- <el-button-group>
        <el-button size="mini">使用次数</el-button>
        <el-button size="mini">最近使用</el-button>
      </el-button-group>-->
    </div>
    <div class="content" v-loading="loading">
      <div
        class="elCollapseWrap"
        sty="2"
        v-for="(item, index) in curList"
        :key="'list' + index"
        :name="index"
      >
        <div
          class="fontblue"
          @click.stop="quote(item)"
          v-if="changeTabsShowQuote == 'diagnosis'"
        >
          {{ item.diagName }}
        </div>
        <div v-else>
          {{ item.diagName }}
        </div>
      </div>
      <p class="align-center" v-if="!loading">没有更多了</p>
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
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="handleCloseStyle"
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
import { mapGetters } from "vuex";
import {
  getTempNameList,
  getTempDoctorDiagByTempId
} from "@/api/tools/diagTemplate.js";
import { deepClone } from "@/utils/index.js";
import {
  updateDiag,
  addDiag,
  getCardByICD,
  getCardByICDNew
} from "@/api/common/diagnosis";
import { getPatientInfo, savePatientInfo } from "@/api/common/report";
import diagTypeSelect from "@/views/public/modules/diagTypeSelect.vue";
import infectiousCard from "@/views/public/infectious/dialogMain.vue"; //传染病报卡
import mainA from "@/views/public/infectious/mainA.vue"; //食原型报卡弹窗

export default {
  name: "diagTemplate",
  components: {
    infectiousCard,
    diagTypeSelect,
    mainA
  },
  data() {
    return {
      hosType: "",
      sortType: "1",
      temName: "",
      loading: false,
      listData: [],
      curList: [],
      currentRow: {},
      receivePatientData: {},
      dialogVisibleDT: false, //诊断类型弹框
      dialogVisibleBK: false, // 传染病报卡
      dialogVisibleBKStyle: false, //食源性报卡
      baokaData: {}
    };
  },
  computed: {
    ...mapGetters("base", {
      cisPatient: "receivePatientData"
    }),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    ...mapGetters("cis", ["changeTabsShowQuote"]),
    ...mapGetters("user", ["role"])
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
    this.$root.eventHub.$on("saveTemRefresh", () => {
      this.loadData();
    });
  },
  /* *
   * 查询方法（loadData）：
   * 1.刷新诊断模板列表
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
    loadData() {
      this.loading = true;
      let params = {
        useRange: this.sortType,
        tempName: this.temName
      };
      this.curList = [];
      if (this.sortType === "1") {
        params.doctorId = this.role.userId;
      } else {
        params.deptId = this.role.deptId;
      }
      getTempNameList(params)
        .then(res => {
          if (res.code === 1) {
            this.listData = res.data;
            for (let i = 0; i < this.listData.length; i++) {
              this.loadItemData(this.listData[i].id);
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    loadItemData(id) {
      getTempDoctorDiagByTempId({
        tempId: id
      }).then(res => {
        if (res.code === 1) {
          this.curList.push(...res.data);
        }
      });
    },
    quote(row) {
      this.currentRow = row;
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择患者！");
        return;
      }
      this.dialogVisibleDT = true;
    },
    cancelDelive() {
      this.dialogVisibleDT = false;
    },
    // 引用
    saveDelive() {
      let row = this.currentRow;
      const data = deepClone(row);
      let diagType =
        this.$refs.diagTypeSelect && this.$refs.diagTypeSelect.diagType.code;
      if (diagType === "" || diagType === undefined) {
        this.$message.warning("请选择诊断类型");
        return;
      }
      data.clinicType = this.hosType;
      data.diagMain = "0";
      data.patientId = this.receivePatientData.patientId;
      data.status = "1";
      data.diagType = diagType;
      data.startTime = this.dayjs().format("YYYY-MM-DD HH:mm:ss");
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
          haveMoney: this.receivePatientData.haveMoney,
          deptId: this.receivePatientData.ouptDeptId,
          deptName: this.receivePatientData.outpDeptName
        };
      }
      addDiag({
        ...data,
        ...receiveData
      })
        .then(res => {
          if (res.code === 1) {
            this.$message.success("引用成功");
            this.dialogVisibleDT = false;
            // this.$emit("load-diag-table");
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
      } catch (e) {
        console.log(e);
      }
    },
    // 报卡dialog
    dialogVisibleBKShow(data) {
      console.log("dialogVisibleBKShow", data);
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
  },
  beforeDestroy() {
    this.$root.eventHub.$off("saveTemRefresh");
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
    overflow: hidden;
    font-size: $l-font-size;

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

  .elCollapseWrap {
    height: 40px;
    width: 100%;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    line-height: 40px;
    background-color: #f1f4f6;
    margin-top: 5px;
    font-size: 14px;
    color: #3d7dfb;
    box-sizing: border-box;
  }
  .fontblue {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /deep/ .el-collapse-item .el-collapse-item__content {
    padding-left: 0px !important;
  }

  /deep/ .el-collapse-item__wrap {
    display: block !important;
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

  .fontblue {
    color: #3d7dfb;
  }

  .content {
    position: absolute;
    top: 84px;
    bottom: 0;
    left: 10px;
    right: 10px;
  }
}

.align-center {
  padding: 5px 0;
  text-align: center;
}
</style>
