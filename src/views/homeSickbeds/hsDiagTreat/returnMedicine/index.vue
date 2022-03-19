<template>
  <div class="returnMedicine width100 height100">
    <div class="bg-contain width100 height100">
      <div class="m-contain">
        <div class="table-box">
          <diV class="topBoxStyle main-table">
            <div class="topTree height100 topTreeStyle">
              <el-form
                ref="form"
                :model="form"
                label-width="0px"
                class="height100"
              >
                <el-col class="elFormWrap">
                  <el-col style="width: 160px" class="margin8">
                    <el-form-item>
                      <el-radio-group v-model="resource" @change="resourceFun">
                        <el-radio label="1">可退药</el-radio>
                        <el-radio label="2">已申请</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" class="margin8">
                    <l-formt-title label="医嘱">
                      <!-- :picker-options="expireTimeOption" 时间限制的数据 -->
                      <el-date-picker
                        v-model="value1"
                        type="daterange"
                        :default-time="['00:00:00', '23:59:59']"
                        @change="datePicker"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                      >
                      </el-date-picker>
                    </l-formt-title>
                  </el-col>
                  <el-col :span="4" class="margin8">
                    <l-formt-title>
                      <el-input
                        v-model="form.orderItemName"
                        placeholder="医嘱关键字"
                      ></el-input>
                    </l-formt-title>
                  </el-col>
                  <el-col :span="4" class="margin8">
                    <el-button type="primary" @click="theQuery">查询</el-button>
                    <el-button @click="resetFun">重置</el-button>
                  </el-col>
                </el-col>
                <el-col style="height: calc(100% - 42px)">
                  <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    height="100%"
                    @selection-change="handleSelectionChange"
                    @select="selectFun"
                    @select-all="selectFunAll"
                  >
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column
                      label="执行时间"
                      show-overflow-tooltip
                      width="120"
                    >
                      <template slot-scope="scope">{{
                        scope.row.scheduledTime
                      }}</template>
                    </el-table-column>
                    <el-table-column label="医嘱状态">
                      <template slot-scope="scope">{{
                        scope.row.execStatus == "0"
                          ? "待执行"
                          : scope.row.execStatus == "1"
                          ? "执行中"
                          : scope.row.execStatus == "2"
                          ? "已执行"
                          : scope.row.execStatus == "3"
                          ? "取消"
                          : "终止"
                      }}</template>
                    </el-table-column>
                    <el-table-column label="发药状态" width="120">
                      <template slot-scope="scope">{{
                        myFun(scope.row.drugRecordStatus)
                      }}</template>
                    </el-table-column>
                    <el-table-column label="属性" show-overflow-tooltip>
                      <template slot-scope="scope">{{
                        scope.row.orderCat == "1"
                          ? "长期"
                          : scope.row.orderCat == "2"
                          ? "临时"
                          : scope.row.orderCat == "3"
                          ? "带药出院"
                          : "--"
                      }}</template>
                    </el-table-column>
                    <el-table-column prop="orderItemName" label="属性名称">
                    </el-table-column>
                    <el-table-column prop="spec" label="规格">
                    </el-table-column>
                    <el-table-column prop="sendMeasure" label="数量">
                    </el-table-column>
                    <el-table-column prop="dosageUnit" label="单位">
                      <template slot-scope="scope">
                        <span
                          :val="scope.row.unit || '--'"
                          code="DrugUnit"
                          v-codeTransform
                        ></span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sendMeasure" label="可申请数量">
                    </el-table-column>
                    <!--  <el-table-column prop="onceDosage" label="申请数量"  >
                    </el-table-column> -->
                    <el-table-column prop="name" label="退药退费原因">
                      <template slot-scope="scope">
                        <el-form-item prop="socialSecurity">
                          <l-value-domain
                            :disabled="resource == '2'"
                            :code="refundReasonIdCode"
                            :value.sync="scope.row.refundReasonId"
                            class="select-container"
                            @change="refundReasonId(scope.row)"
                            :placeholder="$t('base.placeholder')"
                            key="key7"
                          ></l-value-domain>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ouptDeptName" label="执行科室">
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-form>
            </div>
          </diV>
        </div>
        <div class="bottom-box">
          <el-button type="primary" v-if="resource == 1" @click="saveFun"
            >提交</el-button
          >
          <el-button type="primary" v-if="resource == 2" @click="cancal"
            >撤销</el-button
          >
          <!--
          <el-button @click="cancal">取消</el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  execGetList,
  drugRefundCancel,
  drugRefund
} from "@/api/homeSickbeds/hsPatientManagement/hsPatientManagement";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      value1: [],
      resource: "1",
      refundReasonIdCode: "refundReason",
      // 右侧列表
      form: {
        patientIds: [],
        startTime: "",
        endTime: "",
        execType: "0",
        execStatus: ["0", "2", "4"],
        drugRecordStatus: ["1", "3", "7", "9"],
        orderItemName: "",
        OrderCat: [],
        treatNos: []
      },
      // 选择
      chooseTableIdList: [],
      chooseTableIdListId: [],
      chooseTableIdListStyle: [],

      value: "",
      tableData: [],
      multipleSelection: []
    };
  },
  components: {},
  computed: {
    timeDefault() {
      var date = new Date();
      var s1 =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return s1;
    },
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  created() {
    this.form.startTime = this.timeDefault + " 00:00:00";
    this.form.endTime = this.timeDefault + " 23:59:59";
    this.value1[0] = this.form.startTime;
    this.value1[1] = this.form.endTime;
  },
  methods: {
    myFun(a) {
      // 0未申领 1已申领未发 2申请拒绝 3已发 4发药拒绝 5自备药物 6.退药申请成功 7.退药申请拒绝 8.退药成功 9.退药拒绝
      let x = "--";
      switch (a) {
        case "0":
          x = "未申领";
          break;
        case "1":
          x = "已申领未发";
          break;
        case "2":
          x = "申请拒绝";
          break;
        case "3":
          x = "已发";
          break;
        case "4":
          x = "发药拒绝";
          break;
        case "5":
          x = "自备药物";
          break;
        case "6":
          x = "退药申请成功";
          break;
        case "7":
          x = "退药申请拒绝";
          break;
        case "8":
          x = "退药成功";
          break;
        case "9":
          x = "退药拒绝";
          break;
      }
      return x;
    },

    refundReasonId(val) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          val.recipeId == this.tableData[i].recipeId && val.recipeId &&
          val.scheduledTime == this.tableData[i].scheduledTime
        ) {
          this.tableData[i].refundReasonId = val.refundReasonId;
        }
      }
      let valBox = this.$refs.multipleTable.selection;
      this.chooseTableIdListStyle = valBox;
      this.chooseTableIdListId = [];
      this.chooseTableIdList = [];
      for (let i = 0; i < valBox.length; i++) {
        this.chooseTableIdListId.push(valBox[i].id);
        this.chooseTableIdList.push({
          execId: valBox[i].id,
          refundReasonId: valBox[i].refundReasonId
            ? valBox[i].refundReasonId
            : ""
        });
      }
      console.log(this.chooseTableIdList, "this.chooseTableIdList");
    },
    saveFun() {
      if (this.chooseTableIdList.length == "0") {
        this.$message.error("选择至少一条数据");
        return false;
      }
      if (this.validateChoose(this.chooseTableIdList)) {
        this.$message.error("选择的项目退药退费原因必须填写！");
        return false;
      }
      this.drugRefund(this.chooseTableIdList);
    },
    // 退费 必须填写 推要退费原因
    validateChoose(list = []) {
      let vResult = list.some(item => {
        return (
          item.refundReasonId == "" ||
          item.refundReasonId == undefined ||
          item.refundReasonId == null
        );
      });
      return vResult;
    },
    cancal() {
      if (this.chooseTableIdList.length == "0") {
        this.$message.error("选择至少一条数据");
        return false;
      }
      this.drugRefundCancel(this.chooseTableIdListId);
    },
    async drugRefund(data) {
      try {
        let res = await drugRefund(data);
        if (res.code == "1") {
          if (this.resource == "1") {
            //可退药
            this.$message.success("申请退药成功");
          } else {
            this.$message.success("撤销成功");
          }
        } else {
          if (this.resource == "1") {
            //可退要状态
            this.$message.error(res.msg || "申请退药失败");
          } else {
            this.$message.error(res.msg || "撤销失败");
          }
        }
      } catch (error) {}
      this.execGetList();
      this.chooseTableIdList = [];
    },
    async drugRefundCancel(data) {
      try {
        let res = await drugRefundCancel(data);
        if (res.code == "1") {
          this.$message.success("取消退费成功");
        } else {
          this.$message.error(res.msg || "取消退药失败");
        }
      } catch (error) {}
      this.execGetList();
      this.chooseTableIdList = [];
    },
    // 查询
    theQuery() {
      this.execGetList();
    },
    // 重置
    resetFun() {
      this.form.orderItemName = "";
      this.value1 = [
        this.timeDefault,this.timeDefault
      ];
      this.form.startTime = this.timeDefault + " 00:00:00";
      this.form.endTime = this.timeDefault + " 23:59:59";
      // this.execGetList();
    },
    // 全选/全不选
    selectFunAll(selection) {
      if (selection.length === 0) {
        this.chooseTableIdListStyle = [];
        this.chooseTableIdListId = [];
        this.chooseTableIdList = [];
      } else {
        this.tableData.forEach(item => {
          this.selectFun(selection, item);
        });
      }
    },
    selectFun(selection, row) {
      console.log(selection, "selection");
      let selected = selection.length && selection.indexOf(row) !== -1; //为true时选中，为 0 时（false）未选中
      // 选中  符合   this.$refs.multipleTable.toggleRowSelection(row,true)

      for (let i = 0; i < this.tableData.length; i++) {
        if (
          row.recipeId == this.tableData[i].recipeId && row.recipeId &&
          row.scheduledTime == this.tableData[i].scheduledTime
        ) {
          if (selected) {
            this.$refs.multipleTable.toggleRowSelection(
              this.tableData[i],
              true
            );
          } else {
            this.$refs.multipleTable.toggleRowSelection(
              this.tableData[i],
              false
            );
          }
        }
      }
      // 获取所有的  复选框选中的数据时
      let val = this.$refs.multipleTable.selection;
      this.chooseTableIdListStyle = val;
      this.chooseTableIdListId = [];
      this.chooseTableIdList = [];
      for (let i = 0; i < val.length; i++) {
        this.chooseTableIdListId.push(val[i].id);
        this.chooseTableIdList.push({
          execId: val[i].id,
          refundReasonId: val[i].refundReasonId ? val[i].refundReasonId : ""
        });
      }
    },

    // 选择退药记录
    handleSelectionChange(val) {
      // console.log(this.chooseTableIdList,"获取数据chooseTableIdList");
    },
    // 截取时间
    interception(data) {
      let str = "";
      if (data) {
        str = data.substring(-1, 11);
      } else {
        str = "--:--";
      }
      return str;
    },
    // 单选框
    resourceFun() {
      if (this.resource == "1") {
        this.form.drugRecordStatus = ["1", "3", "7", "9"];
      } else {
        this.form.drugRecordStatus = ["6", "8"];
      }
      this.execGetList();
    },
    // 树形接口的节点
    async execGetList() {
      console.log(this.form.patientIds);
      this.tableData = [];
      if (this.form.patientIds.length == "0") {
        this.$message.error("请选择患者");
        return;
      }
      try {
        let res = await execGetList(this.form);
        console.log(res, "遗嘱执行记录");
        if (res.code == "1") {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < res.data[i].execList.length; j++) {
              this.tableData.push(res.data[i].execList[j]);
            }
          }
          // this.tableData = res.data.execList;
          console.log("调试添加后的数据", this.tableData);
        }
      } catch (error) {}
      this.$refs.multipleTable.clearSelection();
    },

    // 不可以选择之前的时间
    disabledDate(date) {
      return date.getTime() <= Date.now() - 86400000;
    },
    //切换时间
    datePicker() {
      console.log(this.value1);
      this.form.startTime =
        this.value1 && this.value1.length ? this.value1[0] + " 00:00:00" : "";
      this.form.endTime =
        this.value1 && this.value1.length ? this.value1[1] + " 23:59:59" : "";
      console.log(this.form);
    }
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(a) {
        console.log(this.receivePatientData, "左侧传出数据");
        if (this.receivePatientData.patientId) {
          this.form.patientIds = [];
          this.form.treatNos = [];
          this.form.patientIds.push(this.receivePatientData.patientId);
          this.form.treatNos.push(this.receivePatientData.treatNo);
          this.execGetList();
        } else {
          this.$message.error("请选择患者！！！");
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.returnMedicine {
  .elFormWrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 8px;
  }

  .margin8 {
    margin-left: 8px;
  }

  // 框架样式引入
  .bg-contain {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: $l-bg-radius-max;
    font-size: 0;
    box-sizing: border-box;

    /deep/ .el-collapse-item .el-collapse-item__content {
      padding-left: 0px;
    }

    // new class
    .patient-top {
      background-color: #ffffff;
      height: 60px;
      width: 100%;
      border-radius: 10px;
      padding: 0px 5px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      float: inherit;

      .patient-border {
        width: auto;
        border-right: 1px solid #cccccc;
        padding-right: 10px;
        padding-left: 10px;
        line-height: 30px;
      }

      .patient-borderA {
        width: auto;
        margin: 0px 15px;
      }
    }

    .patientList {
      width: 260px;
      height: 195px;
      background-color: #ffffff;
      padding: 5px;
      box-sizing: border-box;
      margin: 5px;
      border-radius: 8px;
      float: left;

      .patientList-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #cccccc;
        padding: 5px 0px;

        .patientList-top-Rt {
          color: #2b4583;
          font-size: 22px;
        }
      }

      .patientList-bottom {
        display: flex;
        // align-items: center;
        justify-content: center;
        padding-top: 10px;

        .patientList-b-l {
          padding-top: 4px;
        }
      }
    }

    // new class

    .patient-card {
      font-size: 16px;

      /deep/.patient-card-right {
        display: flex;
      }

      .patientInfo-left {
        display: inline-flex;
        vertical-align: top;
        text-align: center;
        height: 100%;
        align-items: center;
        justify-content: space-between;
        flex: 1;

        .patientInfo-left-a {
          .diagName {
            font-size: 16px;
            font-weight: 500;
            color: #2e323a;
            display: inline-block;
            max-width: 210px;
          }

          .allergyName {
            background: rgba(241, 47, 47, 0.1);
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #ef0f0f;
            display: inline-block;
            max-width: 150px;
          }
        }

        .patientInfo-left-b {
          .button + .button {
            margin-left: 8px;
          }
        }
      }
    }

    .m-contain {
      display: flex;
      flex-direction: column;
      // height: calc(100% - 56px);
      height: 100%;
      box-sizing: border-box;

      .table-box {
        padding: $l-padding-default-6;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .main-table {
          flex: 1;
          overflow: hidden;
        }
      }

      .topTreeStyle {
        overflow: auto;
      }

      .bottom-box {
        text-align: right;
        padding: 16px;
        border-top: 1px solid $l-color-bgcolor-11;

        .totalMoney {
          font-size: 16px;
          margin-right: 32px;
        }

        .color-red {
          color: $l-color-fontcolor-5;
        }
      }
    }
  }

  .overflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
