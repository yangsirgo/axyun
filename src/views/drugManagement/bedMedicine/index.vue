<template>
  <div class="width100 height100 indexStylezhezhao">
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
        <left-bar ref="leftBar" sign=">" />
      </template>
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <!-- <l-patient-card
              :patientName="receivePatientData.patientName"
              :patientAge="receivePatientData.patientAge"
              :patientGender="receivePatientData.patientGender"
            >
              <hsPatientInfo :patientInfo="patientInfoShow"></hsPatientInfo>
              <div class="patientInfo-left padding-left-16">
                <div class="patientInfo-left-a">
                  <span
                    class="diagName overflowEllipsis"
                    :title="patientInfoShow.diagName"
                    >{{ patientInfoShow.diagName }}</span
                  >
                  <span
                    class="allergyName margin-left-8 overflowEllipsis"
                    :title="patientInfoShow.allergyName"
                    >{{ patientInfoShow.allergyName }}</span
                  >
                </div>
              </div>
            </l-patient-card> -->
            <patientDetail
              :patientData="patientInfoShow"
              :detailList="detailList"
            ></patientDetail>
          </div>
          <div class="m-contain">
            <div class="table-box">
              <!-- <l-card-title>
                <template slot="left">按医嘱汇总</template>
              </l-card-title> -->
              <div class="radio-box">
                <el-radio-group v-model="radio" @change="getTableList">
                  <el-radio label="0">未发药</el-radio>
                  <el-radio label="4">已发药</el-radio>
                </el-radio-group>
              </div>
              <div class="radio-box">
                <el-checkbox-group v-model="order" @change="getTableList">
                  <el-checkbox label="1">长期医嘱</el-checkbox>
                  <el-checkbox label="2">临时医嘱</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="main-table">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  v-if="tableDataStyle"
                  width="100%"
                  height="100%"
                  border
                  @selection-change="handleSelectionChange"
                  v-loading="tableLoad"
                >
                  <el-table-column type="selection" align="center" width="45">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    align="center"
                    label="序号"
                    width="50"
                  >
                  </el-table-column>
                  <el-table-column
                    v-for="item in tableColunm"
                    v-if="radio == '0'"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :fixed="item.fixed"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'oneDosage'">
                        <span v-if="!scope.row.recipeId">{{
                          scope.row[item.prop]
                        }}</span>
                        <span
                          v-if="!scope.row.recipeId"
                          :val="scope.row.dosageUnit"
                          code="DrugDoseUnit"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'status'">
                        <span>{{
                          statusShow[scope.row[item.prop]] || ""
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'originCode'">
                        <span
                          :val="scope.row.originCode"
                          code="Manufacturer"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'decoctType'">
                        <span
                          :val="scope.row.decoctType"
                          code="productionMethod"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop == 'orderType'">
                        <span v-if="scope.row.orderType == '1'">长期</span>
                        <span v-if="scope.row.orderType == '2'">临时</span>
                      </template>
                      <template v-else-if="item.prop == 'displayQuantity'">
                        <span>{{ scope.row.displayQuantity }}</span>
                        <span
                          :val="scope.row.displayUnit"
                          code="DrugUnit"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop == 'quantity'">
                        <span v-if="scope.row.quantity">
                          <span>{{ scope.row.quantity }}</span>
                          <span
                            :val="scope.row.packageUnit"
                            code="DrugUnit"
                            v-codeTransform
                          ></span>
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'frequencyCode'">
                        <span
                          columns="FREQUENCY_NAME"
                          :conditionMap="{
                            FREQUENCY_CODE: scope.row.frequencyCode
                          }"
                          tableName="hrp_frequency"
                          v-tableTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'useWay'">
                        <span
                          v-if="!scope.row.recipeId"
                          :val="scope.row.useWay"
                          code="MedicationRouteCode"
                          v-codeTransform
                        ></span>
                        <span
                          v-if="scope.row.recipeId"
                          :val="scope.row.useWay"
                          code="usage"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'herbalUseWay'">
                        <span
                          :val="scope.row.herbalUseWay"
                          code="fryingRemark"
                          v-codeTransform
                        ></span>
                      </template>

                      <template v-else>
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="item in tableColunm1"
                    v-if="radio == '4'"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :fixed="item.fixed"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'oneDosage'">
                        <span v-if="!scope.row.recipeId">{{
                          scope.row[item.prop]
                        }}</span>
                        <span
                          v-if="!scope.row.recipeId"
                          :val="scope.row.dosageUnit"
                          code="DrugDoseUnit"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'status'">
                        <span>{{
                          statusShow[scope.row[item.prop]] || ""
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'originCode'">
                        <span
                          :val="scope.row.originCode"
                          code="Manufacturer"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'decoctType'">
                        <span
                          :val="scope.row.decoctType"
                          code="productionMethod"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop == 'orderType'">
                        <span v-if="scope.row.orderType == '1'">长期</span>
                        <span v-if="scope.row.orderType == '2'">临时</span>
                      </template>
                      <template v-else-if="item.prop == 'displayQuantity'">
                        <span>{{ scope.row.displayQuantity }}</span>
                        <span
                          :val="scope.row.displayUnit"
                          code="DrugUnit"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop == 'quantity'">
                        <span v-if="scope.row.quantity">
                          <span>{{ scope.row.quantity }}</span>
                          <span
                            :val="scope.row.packageUnit"
                            code="DrugUnit"
                            v-codeTransform
                          ></span>
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'frequencyCode'">
                        <span
                          columns="FREQUENCY_NAME"
                          :conditionMap="{
                            FREQUENCY_CODE: scope.row.frequencyCode
                          }"
                          tableName="hrp_frequency"
                          v-tableTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'useWay'">
                        <span
                          v-if="!scope.row.recipeId"
                          :val="scope.row.useWay"
                          code="MedicationRouteCode"
                          v-codeTransform
                        ></span>
                        <span
                          v-if="scope.row.recipeId"
                          :val="scope.row.useWay"
                          code="usage"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'herbalUseWay'">
                        <span
                          :val="scope.row.herbalUseWay"
                          code="fryingRemark"
                          v-codeTransform
                        ></span>
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
              <el-button type="primary" v-if="radio === '0'" @click="medicine"
                >发药</el-button
              >
              <el-button plain v-if="radio === '0'" @click="returnDrug"
                >退回</el-button
              >
              <el-button plain @click="print">打印</el-button>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
    <div class="zhezhao" v-if="percentageStyle">
      <div class="width100 height100 div-wrap">
        <!-- <el-progress type="dashboard" :percentage="percentage" status="success"></el-progress> -->
        <div>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="percentage"
            status="success"
            style="width: 500px;"
            >20/100</el-progress
          >
          <p style="width: 100%;text-align: center;color: #FFFFFF;">
            {{ hairNum }}/{{ nohairNum }}发药进行中请稍后...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail";
import leftBar from "@/views/drugManagement/components/bedLeftBar";
import hsPatientInfo from "@/views/drugManagement/components/hsPatBasicInfo.vue";
import { deepClone } from "@/utils";
import ipha from "@/api/hmm/ipha";
import { delivery, reject } from "@/api/hmm/bed.js";
import { onPreview, onPrint, onPreviewData } from "@/utils/print";
import {
  transformCode,
  transformCodeList
} from "@/api/directive/directiveRequest";
import { tiemDiff } from "@/utils/drugManagement.js";

export default {
  name: "BedMedicine",
  components: {
    hsPatientInfo,
    leftBar,
    patientDetail
  },
  data() {
    return {
      // 加载
      hairNum: 0,
      nohairNum: 0,
      percentage: 0,
      percentageStyle: false,
      // percentageColors: []
      // 加载
      tableDataStyle: true,
      patientInfoShow: {},
      detailList: [],
      layoutObjec: {
        //默认 诊断病历页面
        toolBoxs: [],
        pageName: "bedMedicine",
        boxExpanded: false,
        isToolBox: false
      },
      temType: "",
      radio: "0",
      order: ["1", "2"],
      tableColunm: [
        {
          prop: "status",
          label: "状态"
          // fixed: "left",
        },
        {
          prop: "drugName",
          label: "药品名称",
          width: 200
          // fixed: "left",
        },
        {
          prop: "spec",
          label: "规格",
          width: 120
        },
        {
          prop: "displayQuantity",
          label: "数量"
        },
        /* {
            prop: "drugStock",
            label: "当前库存",
          }, */
        {
          prop: "originCode",
          label: "厂商",
          width: 200
        },
        {
          prop: "frequencyCode",
          label: "频次",
          width: 160
        },
        {
          prop: "useWay",
          label: "用法",
          width: 150
        },
        {
          prop: "oneDosage",
          label: "一次用量 "
        },
        {
          prop: "useDay",
          label: "天数"
        },
        {
          prop: "quantity",
          label: "草药单剂用量"
        },
        {
          prop: "herbalUseWay",
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
          prop: "orderType",
          label: "属性"
        },
        // {
        //   prop:'deliveryUserName',
        //   label:'发药人'
        // },
        // {
        //   prop:'deliveryTime',
        //   label:'发药时间'
        // },
        {
          prop: "doctorUserName",
          label: "开嘱人"
        },
        {
          prop: "setExeTime",
          label: "要求执行时间",
          width: 170
        }
      ],

      tableColunm1: [
        {
          prop: "status",
          label: "状态"
          // fixed: "left",
        },
        {
          prop: "drugName",
          label: "药品名称",
          width: 200
          // fixed: "left",
        },
        {
          prop: "spec",
          label: "规格",
          width: 120
        },
        {
          prop: "displayQuantity",
          label: "数量"
        },
        /* {
            prop: "drugStock",
            label: "当前库存",
          }, */
        {
          prop: "originCode",
          label: "厂商",
          width: 200
        },
        {
          prop: "frequencyCode",
          label: "频次",
          width: 160
        },
        {
          prop: "useWay",
          label: "用法",
          width: 150
        },
        {
          prop: "oneDosage",
          label: "一次用量 "
        },
        {
          prop: "useDay",
          label: "天数"
        },
        {
          prop: "quantity",
          label: "草药单剂用量"
        },
        {
          prop: "herbalUseWay",
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
          prop: "orderType",
          label: "属性"
        },
        {
          prop: "deliveryUserName",
          label: "发药人"
        },
        {
          prop: "deliveryTime",
          label: "发药时间"
        },
        {
          prop: "doctorUserName",
          label: "开嘱人"
        },
        {
          prop: "setExeTime",
          label: "要求执行时间",
          width: 170
        }
      ],

      tableData: [],
      tableDataCache: [],
      statusShow: {
        0: "未发药",
        4: "已发药"
      },
      multipleSelection: [],
      tableLoad: false
    };
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    // 计算列表内的钱数总和
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
        console.log(`a99999999999999`, JSON.parse(JSON.stringify(a)));
        if (Object.keys(a).length !== 0) {
          this.patientInfoShow = {};
          this.detailList = [];
          let data = deepClone(a);
          this.patientInfoShow = {
            ...data,
            responsibleDoctor: data.manageDoctorName,
            responsibleNurse: data.manageNurseName,
            balance: data.selfPayPrepay - data.selfPayAmount, //余额
            pay: data.selfPayPrepay, //预交
            // bedBuildingDate: `${data.predictTreatStartTime.split(' ')[0]}至${data.predictTreatEndTime.split(' ')[0]}`,
            settlementType: data.settlementType,
            prepayBalance: data.selfPayPrepay - data.selfPayAmount,
            selfPayPrepay: data.selfPayPrepay,
            predictTreatStartTime: data.predictTreatStartTime
              ? data.predictTreatStartTime.split(" ")[0]
              : "",
            predictTreatEndTime: data.predictTreatEndTime
              ? data.predictTreatEndTime.split(" ")[0]
              : "",
            doctorUserName: data.manageDoctorName,
            nurseName: data.manageNurseName,
            phoneNum: data.mobileNum,
            address: data.patientAddr
          };
          // if (data.admissionDiag) {
          //   this.$set(this.detailList, this.detailList.length, {
          //     name: data.admissionDiag,
          //     style: {}
          //   })
          // }
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
  /**
   * 1、渲染发药的列表（getTableList）:获取发药数据渲染
   * 2、取到选中的数据（handleSelectionChange）:选中复选框并取到数据放在数组里
   * 3、刷新数据（refresh）:1、清空发药列表数据 2、重新获取发药列表数据
   * 4、发药方法(medicine):1、把选中数据提交到后台2、分十条一个批次的进行往后台传送
   * 5、退药方法（returnDrug）:1、选中的药品进行退药
   * 6、打印方法 （print）:1、单次打印药品单
   *
   * */

  methods: {
    // 获取数据列表
    getTableList() {
      console.log(JSON.stringify(this.order));
      if (!this.receivePatientData.inpCode) {
        return;
      }
      const data = {};
      if (this.order.length > 0) {
        data.orderType = this.order.join(",");
      } else {
        data.orderType = "0";
      }
      this.tableData = [];
      this.tableDataStyle = false;
      this.tableLoad = true;
      ipha
        .list(
          {
            inpCode: this.receivePatientData.inpCode,
            status: this.radio,
            sign: ">",
            ...data
          },
          false
        )
        .then(res => {
          if (res.code === 1) {
            this.multipleSelection = [];
            this.tableData = res.data;
          } else {
            this.$message.error(res.msg || "获取发药列表失败");
          }
        })
        .catch(err => {
          this.$message.error(res.msg || "获取发药列表失败");
        });
      this.tableLoad = false;
      this.tableDataStyle = true;
      this.$hideLoading();
    },
    // 获取列表选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 刷新数据
    refresh() {
      this.tableData = [];
      this.getTableList();
      // this.$refs.leftBar && this.$refs.leftBar.getList();
    },
    // 发药
    async medicine() {
      this.nohairNum = 0;
      this.hairNum = 0;
      this.percentage = 0;
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择发药明细!");
        return;
      }
      this.percentageStyle = true;
      let newArr = [];
      let newArrHtml = "";
      let arrLength = this.multipleSelection.length; // 数组长度
      let num = 10; // 每页显示 10 条
      let index = 0;
      for (let i = 0; i < arrLength; i++) {
        if (i % num === 0 && i !== 0) {
          // 可以被 10 整除
          newArr.push(this.multipleSelection.slice(index, i));
          index = i;
        }
        if (i + 1 === arrLength) {
          newArr.push(this.multipleSelection.slice(index, i + 1));
        }
      }
      console.log(newArr, "打印切割后的数组");
      this.percentageColors = []; //清空缓存
      // let percentageNum= Number(100 / this.multipleSelection);
      this.nohairNum = arrLength;
      console.log(Date.parse(new Date()), "调接口开始");
      for (let i = 0; i < newArr.length; i++) {
        let htmlText = "";
        // let msgText = this.medicineFun(newArr[i]);
        console.log(Date.parse(new Date()), "每次调接口开始");
        await delivery(newArr[i])
          .then(res => {
            if (res.code === 1) {
              // this.$message.success("发药成功!");
              htmlText = "";
              this.$refs.leftBar.query(); //
            } else {
              // this.$message.error(res.msg || "发药失败!");
              console.log(res.msg);
              htmlText = res.msg;
            }
          })
          .catch(err => {
            // console.log(err);
            htmlText = err.data.msg;
            // this.$message.error(err.msg || "发药失败!");
            console.log(Date.parse(new Date()), "每次调接口结束");
          });
        if (arrLength <= 10) {
          this.hairNum = arrLength;
        } else {
          this.hairNum = 10 * (i + 1);
          let mun = arrLength - this.hairNum;
          // this.hairNum = this.hairNum + ();
          if (mun < 10) {
            this.hairNum = this.hairNum + mun;
          }
        }
        let percentageNum = this.hairNum / this.nohairNum;
        this.percentage = percentageNum.toFixed(2) * 100;

        newArrHtml += htmlText;
      }
      let that = this;
      this.$nextTick(function() {
        setTimeout(function() {
          that.refresh();
          that.percentageStyle = false;
          console.log(Date.parse(new Date()), "发药完成调接口结束");
          that.$message.success("发药操作完成!");
        }, 1000);
      });
    },
    //退药
    returnDrug() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择发药明细!");
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
    // 打印
    async print() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要打印的药品");
        return;
      }
      this.$showLoading();
      await ipha
        .printLabel(this.multipleSelection)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            onPreviewData(res.data, "莲塘社康家床");
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.indexStylezhezhao {
  .zhezhao {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.5);
    // opacity: 0.4;
  }

  .div-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

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
</style>
