<template>
  <l-layout
    :toolBoxs="toolBoxs"
    :boxExpanded="false"
    :isToolBox="true"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
    displayMode="expand"
    @message="messageHandler"
  >
    <template #list>
      <PatientListFinance
        @listItemClick="listItemClickHandle"
      ></PatientListFinance>
    </template>
    <template #content>
      <div class="bg-contain width100 height100">
        <div class="patient-card">
          <l-patient-card
            :patientName="
              selectedPatientInfo && selectedPatientInfo.patientName
            "
            :patientAge="selectedPatientInfo && selectedPatientInfo.patientAge"
            :patientGender="
              selectedPatientInfo && selectedPatientInfo.patientGender
            "
          >
            <patient-basic-info
              :patientInfo="selectedPatientInfo"
            ></patient-basic-info>
          </l-patient-card>
        </div>
        <div class="m-contain">
          <el-card class="width100 height100 padding10">
            <el-row class="width100">
              <el-col :span="12">
                <span style="font-size: 14px; margin-right: 16px"
                  >下一张票据号:
                  <span
                    style="min-width: 60px; display: inline-block"
                    v-loading="btuLoading"
                    >{{ nextReceiptNumOutPO.receiptNum || "无" }}</span
                  ></span
                >
                <el-button ref="btuJump" type="primary" @click="jumpNum"
                  >跳号</el-button
                >
                <el-button type="primary" plain @click="getNextReceiptNum"
                  >刷新</el-button
                >
              </el-col>
              <el-col :span="12">
                <el-button
                  ref="btuRefund"
                  type="primary"
                  class="float-right"
                  style="margin-left: 8px"
                  :disabled="activeName == 'first' || btuDisable == false"
                  @click="retreatReceiptRrint"
                  >退发票</el-button
                >
                <!-- <el-button
                  type="primary"
                  class="float-right"
                  :disabled="activeName == 'first' || btuDisable == false"
                  @click="getPrintReceiptInfo"
                  >白纸重打</el-button
                > -->
                <el-button
                  ref="btuNewPrint"
                  type="primary"
                  class="float-right"
                  :disabled="activeName == 'first' || btuDisable == false"
                  @click="newReceiptprint"
                  >新票重打</el-button
                >
                <el-button
                  type="primary"
                  class="float-right"
                  :disabled="activeName == 'first' || btuDisable == false"
                  @click="getPrintReceiptInfo"
                  >原票重打</el-button
                >
                <el-button
                  ref="btuPrint"
                  type="primary"
                  class="float-right"
                  :disabled="activeName == 'second'"
                  @click="printReceipt"
                  >票据打印</el-button
                >
              </el-col>
            </el-row>
            <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="handleClick"
              class="width100 elTab"
            >
              <el-tab-pane label="未打印" name="first">
                <unPrint
                  v-if="activeName === 'first'"
                  :patientId="selectedPatientInfo.patientId"
                  ref="unPrint"
                  @selectTradeDetail="selectTradeDetail"
                ></unPrint>
              </el-tab-pane>
              <el-tab-pane label="已打印" name="second">
                <printed
                  v-if="activeName === 'second'"
                  ref="printed"
                  :patientId="selectedPatientInfo.patientId"
                  @selectReceiptDetail="selectReceiptDetail"
                ></printed>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </div>
    </template>
  </l-layout>
</template>
<script>
import { mapGetters } from "vuex";
import printed from "./components/printed";
import unPrint from "./components/unPrint";
import service from "@/api/cis/receiptPrint/receiptPrint";
// import {onPreview, onPrint} from '@/utils/print';
import { onPreview, getMacLoaction } from "@/utils/print";
import { getDatas } from "@/api/wconf/wparam";
import { transformCode } from "@/api/directive/directiveRequest";
import PatientList from "@/components/PatientList.vue";
import serviceReceiptPrint from "@/api/cis/receiptPrint/receiptPrint";

import { print, getPrinterList } from "@/utils/print_new";
import { getPrintTpl } from "@/api/admin/print/print";
import { createData } from "@/printTemplete/module/financeLodopTpl.js";
import codes from "@/printTemplete/code.js";
export default {
  components: {
    printed,
    unPrint,
    PatientList,
  },
  data() {
    return {
      // 读卡
      patientId: "",
      // 下一张票据号 出库对象
      nextReceiptNumOutPO: "",
      // tab
      activeName: "first",
      // 要打印的交易
      tradeList: [],
      // 当前票据明细
      currentReceiptDetail: {},
      btuLoading: false,
      receiptContent: {},
      //反显数据
      codeTransformList: {},
      //当前选中患者的信息
      selectedPatientInfo: {},
      toolBoxs: [],
      // btu disable
      btuDisable: false,
      // 本机主MAC地址
      currentMac: "",
      receiptNum: "",
      receiptType: "", //票据类型
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
  },
  async mounted() {
    // this.getMac();
    await this.getDictionaryPO();
    this.getNextReceiptNum();
  },
  methods: {
    async getDictionaryPO() {
      try {
        let res = await serviceReceiptPrint.getDictionaryPO({
          itemCode: "F0016",
          valueCode: "00",
        });
        if (res.code == 1) {
          this.receiptType = res.data.dictionaryValue;
        }
      } catch (error) {
        this.$message.error(error.msg || "获取票据类型失败");
      }
    },
    messageHandler(data) {},
    handleClick(tab, event) {
      this.select();
    },
    // 获取本机主mac地址
    getMac() {
      try {
        let mac = {
          value: "",
        };
        getMacLoaction(mac).then((res) => {
          this.currentMac = res;
        });
      } catch (error) {
        this.$message.error(error.message || "获取本机主MAC地址失败");
      }
    },
    // 读卡
    readCard(data) {
      this.patientId = data.patientId;
    },
    // 获取下一张票据号
    async getNextReceiptNum() {
      try {
        this.nextReceiptNumOutPO = {};
        this.btuLoading = true;
        if (!this.currentMac) {
          let mac = {
            value: "",
          };
          getMacLoaction(mac)
            .then(async (res2) => {
              this.currentMac = res2;
              let res = await service.getNextReceiptNum({
                receiptType: this.receiptType,
                useMacLoaction: this.currentMac || undefined,
              });
              if (!res.data) {
                this.$message.error("未找到当前登录人的领用票据信息");
                this.btuLoading = false;
                return;
              }
              this.nextReceiptNumOutPO = res.data;
              this.btuLoading = false;
            })
            .catch(() => {
              this.btuLoading = false;
            });
        } else {
          let res = await service.getNextReceiptNum({
            receiptType: this.receiptType,
            useMacLoaction: this.currentMac || undefined,
          });
          if (!res.data) {
            this.$message.error("未找到当前登录人的领用票据信息");
            this.btuLoading = false;
            return;
          }
          this.nextReceiptNumOutPO = res.data;
          this.btuLoading = false;
        }
      } catch (error) {
        this.btuLoading = false;
        console.info(error);
        this.$message.error(error.msg || "获取下一张票据号失败");
      }
    },
    select() {
      if (this.activeName == "first") {
        setTimeout(() => {
          this.$refs.unPrint.getTradeDetailQuery();
        }, 10);
      } else {
        setTimeout(() => {
          this.$refs.printed.getReceiptDetail();
        }, 10);
      }
    },
    selectTradeDetail(data) {
      this.tradeList = data;
    },
    // 票据打印
    async printReceipt() {
      this.$refs.btuPrint.disabled = true;
      try {
        if (this.tradeList.length <= 0) {
          this.$message.error("请选择要打印的交易明细");
          this.$refs.btuPrint.disabled = false;
          return;
        }
        if (!this.nextReceiptNumOutPO.receiptNum) {
          this.$message.error("当前票据号为空");
          this.$refs.btuPrint.disabled = false;
          return;
        }
        this.receiptNum = this.nextReceiptNumOutPO.receiptNum;
        this.$showLoading();
        let obj = {
          receiptNum: this.nextReceiptNumOutPO.nextReceiptNum,
          outId: this.nextReceiptNumOutPO.outId,
          inId: this.nextReceiptNumOutPO.intId,
          outpTradeDetailIds: this.tradeList,
        };
        let res = await service.printReceipt(obj);

        if (res.code === 1) {
          this.$message({
            message: "票据数据保存成功",
            type: "success",
          });
          this.getNextReceiptNum();
          this.select();
          // 打印机。。
          this.receiptContent = res.data;
        }
        // onPreview(res.data, "门诊收费票据");
        this.$refs.btuPrint.disabled = false;
        this.$hideLoading();
        this.handlePrintData();
      } catch (error) {
        console.info(error);
        this.$refs.btuPrint.disabled = false;
        this.$hideLoading();
        // this.$message.error(error.msg || "打印票据失败");
      }
    },
    selectReceiptDetail(data) {
      this.currentReceiptDetail = data;
      this.checkReceipt();
    },
    // 验证票据状态
    checkReceipt() {
      if (
        !this.currentReceiptDetail ||
        this.currentReceiptDetail.recordStatus != "1"
      ) {
        this.btuDisable = false;
      } else {
        this.btuDisable = true;
      }
    },
    // 原票重打
    async getPrintReceiptInfo() {
      try {
        if (JSON.stringify(this.currentReceiptDetail) == "{}") {
          this.$message.error("请选择要打印的票据");
          return;
        }
        this.$showLoading();
        this.receiptNum = this.currentReceiptDetail.receiptNum;
        let res = await service.getPrintReceiptInfo(this.currentReceiptDetail);
        this.receiptContent = res.data;
        this.handlePrintData();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },
    // 新票重打
    async newReceiptprint() {
      this.$refs.btuNewPrint.disabled = true;
      try {
        if (JSON.stringify(this.currentReceiptDetail) == "{}") {
          this.$message.error("请选择要打印的票据");
          this.$refs.btuNewPrint.disabled = false;
          return;
        }
        this.receiptNum = this.currentReceiptDetail.receiptNum;
        this.$showLoading();
        let obj = {
          ...this.currentReceiptDetail,
        };
        // 下一张新的票据号
        obj.receiptNum = this.nextReceiptNumOutPO.nextReceiptNum;
        obj.outId = this.nextReceiptNumOutPO.outId;
        let res = await service.newPrintReceipt(obj);
        if (res.code === 1) {
          this.$message({
            message: "新票据数据保存成功",
            type: "success",
          });
          // 打印机
          // onPreview(res.data, "票据");
          this.receiptContent = res.data;
          this.handlePrintData();
          this.getNextReceiptNum();
        }
        this.select();
        this.$refs.btuNewPrint.disabled = false;
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$refs.btuNewPrint.disabled = false;
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },
    // 退发票
    async retreatReceiptRrint() {
      this.$refs.btuRefund.disabled = true;
      try {
        if (JSON.stringify(this.currentReceiptDetail) == "{}") {
          this.$message.error("请选择要退的票据");
          this.$refs.btuRefund.disabled = false;
          return;
        }
        this.receiptNum = this.currentReceiptDetail.receiptNum;
        if (this.currentReceiptDetail.recordStatus != "1") {
          this.$refs.btuRefund.disabled = false;
          this.$message.error("此票据已经退票");
          return;
        }
        this.$showLoading();
        let params = {
          receiptId: this.currentReceiptDetail.receiptId,
        };
        let res = await service.retreatReceiptRrint(params);
        if (res.code == 1) {
          this.btuDisable = false;
          this.$message({
            message: "退发票成功",
            type: "success",
          });
        } else {
          this.$message.error("退发票失败");
        }
        // 打印机
        // onPreview(res.data,"票据");
        // this.getNextReceiptNum();
        this.select();
        this.$refs.btuRefund.disabled = false;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$refs.btuRefund.disabled = false;
        this.$message.error(error.msg || "退发票失败");
      }
    },
    // 跳号
    async jumpNum() {
      this.$refs.btuJump.disabled = true;
      try {
        this.btuLoading = true;
        let obj = {
          outId: this.nextReceiptNumOutPO.outId,
          receiptStartNum: this.nextReceiptNumOutPO.nextReceiptNum,
          receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1, // 匹配后台计算加1
        };
        let res = await service.receiptJumpNum(obj);
        this.getNextReceiptNum();
        this.btuLoading = false;
        if (res.code == "1") {
          this.$message({
            type: "success",
            message: "跳号成功",
          });
          this.$refs.btuJump.disabled = false;
        } else {
          this.$message.error(error.msg || "跳号失败");
          this.$refs.btuJump.disabled = false;
        }
      } catch (error) {
        this.btuLoading = false;
        this.$refs.btuJump.disabled = false;
        this.$message.error(error.msg || "跳号失败");
      }
    },
    //处理打印数据
    async handlePrintData() {
      let index = getPrinterList();
      index = 3;
      let obj = createData(this.receiptContent, this.dayjs);
      let {code, data} = await getPrintTpl(codes.financeTpl);
      if(code != 1) return;
      print(index, data.value, {}, obj, true);
    },
    /**
     * 来自Soujer新算法
     * @param amount
     * @returns {string}
     */
    changeRMB(amount) {
      if (isNaN(amount) || amount >= 1000000) return "无效金额！"; //数值最大不超过100万
      let sPrefix = amount < 0 ? "(负)" : ""; //将负号‘-’显示成汉字‘(负)’
      let sAmount = Math.abs(amount).toFixed(2); //格式化成两位小数格式（两位小数对应“'角”和“分”）
      let sUnit = "拾万仟佰拾元角分";
      let sCapital = "零壹贰叁肆伍陆柒捌玖"; //10个大写数字
      sAmount = sAmount.replace(".", ""); //去除小数点（使数字与权位对应）
      let str = "";
      if (sAmount.length < sUnit.length) {
        for (let i = 0, len = sUnit.length - sAmount.length; i < len; i++) {
          //拼接数字与权位单位
          str += "" + "0";
        }
      }
      sAmount = str + sAmount;
      console.info(sAmount);
      let sOutput = "";
      for (let i = 0, len = sAmount.length; i < len; i++) {
        //拼接数字与权位单位
        sOutput +=
          sCapital.substr(sAmount.substr(i, 1), 1);//  + sUnit.substr(i, 1);
      }
      return sPrefix + sOutput;
    },

    // 处理打印数据
    async handlePrintData1() {
      // 年月日 时间
      let printTimeYear = this.receiptContent.printTime
        ? this.receiptContent.printTime.split("-")[0]
        : "";
      let printTimeMon = this.receiptContent.printTime
        ? this.receiptContent.printTime.split("-")[1]
        : "";
      let printTimeDay = this.receiptContent.printTime
        ? this.receiptContent.printTime.split("-")[2].split(" ")[0]
        : "";

      // 打印数据
      let printData = {
        bussessTradeCode: this.receiptContent.serialNumber || "",
        orgType: this.receiptContent.hospitalType || "",
        receiptNum: this.receiptContent.receiptNum || "",
        name: this.receiptContent.patientName || "",
        sex: this.receiptContent.patientGender || "",
        companyName: this.receiptContent.companyName || "", //?医保类型
        socialSecurityNum: this.receiptContent.socialSecurityNum || "", //?社会保障号码
        capitalizedAmount: this.receiptContent.capitalizedAmount || "零",
        totalAmount:
          this.formatNumber(this.receiptContent.totalAmount) || "0.00",
        paymentAmount: this.receiptContent.selfPrestoreMoney || "0.00",
        selfPayMoney:
          this.formatNumber(this.receiptContent.selfPayMoney) || "0.00",
        totalPrepayAmt: "0.00", //?医保统筹支付
        otherAmount: "0.00", //?其他医保支付
        unit: this.receiptContent.unit || "", //?收款单位
        userName: this.receiptContent.printUserName || "",
        printTimeYear: printTimeYear,
        printTimeMon: printTimeMon,
        printTimeDay: printTimeDay,
      };
      let inpFeeClassSumDTOS = this.receiptContent.outpChargeDetailNewPOs;
      let arr = [];
      for (let i = 0; i < inpFeeClassSumDTOS.length; i++) {
        let item = inpFeeClassSumDTOS[i];
        let item1 = inpFeeClassSumDTOS[Number(i + 1)];
        if (Number(i) % 2 === 0) {
          let obj = {
            num1: item.chargeQuantity || 0,
            price1: this.formatNumber(item.totalMoney) || "0.00",
            selfPrice1: this.formatNumber(item.totalMoney) || "0.00",
          };
          // if (item.pharmacyExecFlag != 1) {
          if (item.classCode >= 4) {
            obj.product1 =
              (item.chargeItemName || "") + "/" + (item.chargeUnit || "");
          } else {
            await this.codeTransform([
              {
                field: "name",
                code: "DrugUnit",
                val: item.chargeUnit || "",
              },
            ]);
            obj.product1 =
              (item.chargeItemName || "") +
              "/" +
              (this.codeTransformList["DrugUnit"][item.chargeUnit] || "");
          }
          if (Number(i + 1) < inpFeeClassSumDTOS.length) {
            obj.num2 = item1.chargeQuantity || "0";
            obj.price2 = this.formatNumber(item1.totalMoney) || "0.00";
            obj.selfPrice2 = this.formatNumber(item1.totalMoney) || "0.00";
            // if (item1.pharmacyExecFlag != 1) {
            if (item1.classCode >= 4) {
              obj.product2 =
                (item1.chargeItemName || "") + "/" + (item1.chargeUnit || "");
            } else {
              this.codeTransform([
                {
                  field: "name",
                  code: "DrugUnit",
                  val: item1.chargeUnit || "",
                },
              ]);
              obj.product2 =
                (item1.chargeItemName || "") +
                "/" +
                (this.codeTransformList["DrugUnit"][item1.chargeUnit] || "");
            }
          }
          arr.push(obj);
        }
      }
      printData.inBillsData = arr;
      await this.codeTransform([
        {
          field: "name",
          code: "GENDER_CODE",
          val: this.receiptContent.patientGender || "",
        },
      ]);
      printData.sex =
        this.codeTransformList["GENDER_CODE"][
          this.receiptContent.patientGender
        ] || "";
      // console.log(printData);
      onPreview(printData, "门诊收费票据");
    },
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    //code transform
    async codeTransform(params) {
      let codeList = this.codeTransformList[params[0].code];
      if (codeList !== undefined && codeList[params[0].val] !== undefined) {
        return;
      } else {
        try {
          let res = await transformCode(params);
          if (!codeList) {
            this.codeTransformList[params[0].code] = {};
          }
          this.codeTransformList[params[0].code][params[0].val] =
            res.data[params[0].code] || undefined;
        } catch (e) {
          return;
        }
      }
    },
    //lhd
    listItemClickHandle(data) {
      this.selectedPatientInfo = data;
      // this.getRegisteredList();
    },
  },
};
</script>
<style lang="scss" scoped>
.receiptPrint {
  height: 100%;
  display: flex;

  .left {
    width: 333px;
    height: 100%;
    padding: 0 10px;
    margin-right: 10px;
  }

  .numSpan {
    height: 36px;
    line-height: 36px;
    font-size: $l-font-size-max;
    color: $l-color-text-primary;
    font-weight: $l-font-weight;
  }
}

.elTab {
  height: calc(100% - 56px) !important;
  margin-top: 20px;
}

/deep/.elTab > .el-tabs__content {
  height: calc(100% - 28px);
}

.patient-list {
  height: calc(100% - 63px);
}

.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  .m-contain {
    height: calc(100% - 40px);
    box-sizing: border-box;
  }
}

/deep/ .el-tabs__item {
  padding: 0 8px !important;
}
</style>
