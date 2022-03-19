<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="layoutObjec.toolBoxs"
      :defaultToolName="layoutObjec.toolBoxs[0]"
      :isToolBox="layoutObjec.isToolBox"
      :boxExpanded="false"
      patientCardType="default"
      :pageName="layoutObjec.pageName"
      :templateType="temType"
      :ele-type="1"
      hosType="1"
      class="container"
    >
      <template #list>
        <left-bar ref="leftBar" sign="<" />
      </template>
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <patientDetail
              :patientData="patientInfoShow"
              :detailList="detailList"
            ></patientDetail>
          </div>
          <div class="m-contain">
            <div class="table-box">
              <div class="radio-box">
                <el-radio-group v-model="radio" @change="getTableList">
                  <el-radio label="0">待退药</el-radio>
                  <el-radio label="4">已退药</el-radio>
                </el-radio-group>
              </div>
              <l-card-title class="radio-box">
                <template slot="left"
                  >退药明细</template
                >
              </l-card-title>
              <div class="main-table">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  width="100%"
                  height="100%"
                  border
                  @selection-change="handleSelectionChange"
                  v-loading="tableLoad"
                >
                  <el-table-column type="selection" width="45" fixed="left">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                    fixed="left"
                  >
                  </el-table-column>
                  <el-table-column
                    v-for="item in tableColunm"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :align="item.align || 'left'"
                    :width="item.width"
                    :fixed="item.fixed"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'originCode'">
                        <span
                          :val="scope.row.originCode"
                          code="Manufacturer"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'status'">
                        <span>{{
                          statusShow[scope.row[item.prop]] || ""
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'displayUnit'">
                        <span
                          :val="scope.row.displayUnit"
                          code="DrugUnit"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'decoctType'">
                        <span
                          v-if="scope.row.decoctType"
                          :val="scope.row.decoctType"
                          code="productionMethod"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'amt'">
                        <span>{{
                          scope.row.amt ? scope.row.amt.toFixed(2) : ""
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'price'">
                        <span>{{
                          scope.row.price ? scope.row.price.toFixed(4) : ""
                        }}</span>
                      </template>
                      <template v-else>
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="bottom-box">
              <span class="totalMoney"
                >合计: &nbsp;&nbsp;<span class="color-red"
                  >{{ totalMoney }}元</span
                ></span
              >
              <el-button type="primary" @click="returnDrug" v-if="radio == 0"
                >退药</el-button
              >
              <el-button @click="returnDrugs" v-if="radio == 0">退回</el-button>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "@/views/drugManagement/components/bedLeftBar";
import hsPatientInfo from "@/views/drugManagement/components/hsPatBasicInfo.vue";
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils";
import ipha from "@/api/hmm/ipha";
import { delivery, reject } from "@/api/hmm/bed.js";
import { tiemDiff } from "@/utils/drugManagement.js";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail";

export default {
  name: "BedWithdrawal",
  components: {
    hsPatientInfo,
    leftBar,
    patientDetail
  },
  data() {
    return {
      patientInfoShow: {},
      detailList: [],
      layoutObjec: {
        //默认 诊断病历页面
        toolBoxs: [],
        pageName: "bedWithdrawal",
        boxExpanded: false,
        isToolBox: false
      },
      temType: "",
      radio: "0",
      order: [],
      applicant: {
        name: "张三",
        time: "2020-09-06"
      },
      statusShow: {
        0: "未退药",
        4: "已退药"
      },
      tableColunm: [
        {
          prop: "status",
          label: "状态",
          width: 80,
          fixed: "left"
        },
        {
          prop: "drugName",
          label: "药品名称",
          width: 200,
          fixed: "left"
        },
        {
          prop: "spec",
          label: "规格",
          width: 200
        },
        {
          prop: "displayQuantity",
          label: "数量"
          // align: "right"
        },
        {
          prop: "displayUnit",
          label: "单位"
        },
        {
          prop: "price",
          label: "单价",
          width: 80,
          align: "right"
        },
        {
          prop: "amt",
          label: "金额",
          align: "right",
          width: "120"
        },
        {
          prop: "quantity",
          label: "草药单剂用量"
        },
        {
          prop: "useDemandName",
          label: "煎服法"
        },
        {
          prop: "useQty",
          label: "用药剂数"
        },
        {
          prop: "decoctType",
          label: "制药方法"
        },
        {
          prop: "originCode",
          label: "厂商",
          width: 200
        },

        {
          prop: "deliveryTime",
          label: "确认退药时间",
          width: 170
        },
        {
          prop: "setExeTime",
          label: "要求执行时间",
          width: 170
        }
      ],
      tableData: [],
      multipleSelection: [],
      tableLoad: false
    };
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    totalMoney() {
      let money = 0;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let str = Number(this.multipleSelection[i].amt.toFixed(2)) * 100;
        money = Number(money) + str;
      }
      money = money / 100;
      money = money.toFixed(2);
      return money;
    }
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(a) {
        if (Object.keys(a).length !== 0) {
          let data = deepClone(a);
          this.patientInfoShow = {};
          this.detailList = [];
          this.patientInfoShow = {
            ...data,
            responsibleDoctor: data.manageDoctorName,
            responsibleNurse: data.manageNurseName,
            balance: data.selfPayPrepay - data.selfPayAmount,
            pay: data.selfPayPrepay,
            bedBuildingDate: tiemDiff(
              data.predictTreatStartTime,
              data.predictTreatEndTime
            ),
            settlementType: data.settlementType,
            prepayBalance: data.selfPayPrepay - data.selfPayAmount,
            selfPayPrepay: data.selfPayPrepay,
            predictTreatStartTime: data.predictTreatStartTime
              ? data.predictTreatStartTime.split(" ")[0]
              : "",
            predictTreatEndTime: data.predictTreatEndTime
              ? data.predictTreatEndTime.split(" ")[0]
              : "",
            doctorName: data.manageDoctorName,
            nurseName: data.manageNurseName,
            phoneNum: data.mobileNum,
            address: data.patientAddr
          };
          /* if (data.admissionDiag) {
              this.$set(this.detailList, this.detailList.length, {
                name: data.admissionDiag,
                style: {}
              })
            } */
          if (data.allergyName) {
            this.$set(this.detailList, this.detailList.length, {
              name: data.allergyName,
              style: {
                background: "rgba(241, 47, 47, 0.1)",
                borderRadius: "4px",
                display: "inline-block",
                fontSize: "12px",
                fontFamily: "SourceHanSansSC-Regular",
                fontWeight: 400,
                textAlign: "center",
                color: "#ef0f0f",
                margiLeft: "8px",
                paddingTop: "2px",
                paddingLeft: "4px",
                paddingRight: "4px"
              }
            });
          }
          this.getTableList();
        }
      }
    }
  },
  methods: {
    getTableList() {
      if (!this.receivePatientData.inpCode) {
        return;
      }
      this.tableLoad = true;
      ipha
        .list(
          {
            inpCode: this.receivePatientData.inpCode,
            sign: "<",
            status: this.radio
          },
          false
        )
        .then(res => {
          this.tableLoad = false;
          if (res.code === 1) {
            this.multipleSelection = [];
            this.tableData = res.data;
            console.log(`res.data`, res.data);
          } else {
            this.$message.error(res.msg || "获取发药列表失败");
          }
        })
        .catch(err => {
          this.tableLoad = false;
          this.$message.error(res.msg || "获取发药列表失败");
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    refresh() {
      this.tableData = [];
      this.$refs.leftBar && this.$refs.leftBar.getList();
    },
    returnDrug() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择退药明细!");
        return;
      }
      this.$showLoading();
      delivery(this.multipleSelection)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            this.$message.success("退药成功!");
            this.refresh();
          } else {
            this.$message.error(res.msg || "退药失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "退药失败!");
        });
    },
    returnDrugs() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择退药明细!");
        return;
      }
      this.$showLoading();
      reject(this.multipleSelection)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            this.$message.success("退回成功!");
            this.refresh();
          } else {
            this.$message.error(res.msg || "退回失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "退回失败!");
        });
    },
    print() {}
  }
};
</script>

<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

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
          color: $l-color-fontcolor-3;
          display: inline-block;
          max-width: 210px;
        }

        .allergyName {
          background: rgba(241, 47, 47, 0.1);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 400;
          color: $l-color-fontcolor-5;
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
    height: calc(100% - 56px);
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

.radio-box {
  margin-bottom: 12px;
}

.applicant {
  float: left;
  font-size: 14px;
  line-height: 32px;
}

.applicant-color {
  color: #949da3;
  margin-right: 8px;
}
</style>
