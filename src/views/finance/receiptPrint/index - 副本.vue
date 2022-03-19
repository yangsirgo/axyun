<template>
  <!--<div class="receiptPrint">
    <el-card class="left">
      <l-card-title>
        <span slot="left">患者列表</span>
      </l-card-title>
      <div :style="{height:'calc(100% - 63px)'}">
        <PatientList @listItemClick="listItemClickHandle"></PatientList>
      </div>
    </el-card>
    <el-card class="width100 height100 padding10" style="position:relative;">
      <PatientInfoTop :patientInfo="selectedPatientInfo"></PatientInfoTop>
      <el-row class="width100" :style="{position:'absolute',right:'10px',top:'115px',width:'calc(100% - 300px)'}">
        <el-col :span="12">
          <el-row :gutter="10" class="width100">
            <el-col :span="0">
              &lt;!&ndash; <el-input v-model="patientName" placeholder="姓名/卡号" class="float-left" clearable></el-input>
          </el-col>
          <el-col :span="3">
              <el-button type="primary" class="float-left" @click="select">查询</el-button>&ndash;&gt;
              &lt;!&ndash; <l-read-card @readCard="readCard"></l-read-card> &ndash;&gt;
              &lt;!&ndash; <l-patient-fin class="width100" viewReadCard widthMin></l-patient-fin> &ndash;&gt;
            </el-col>
            <el-col :span="12" v-loading="btuLoading">
              <span class="float-left numSpan">下一张票据号: &#12288;{{nextReceiptNumOutPO.receiptNum}}</span>
            </el-col>
            <el-col :span="12">
              <el-button ref="btuJump" type="primary" class="float-left" @click="jumpNum">跳号</el-button>
              <el-button
                type="primary"
                plain
                class="float-left margin-left-10"
                @click="getNextReceiptNum"
              >刷新
              </el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-button
            ref="btuRefund"
            type="primary"
            class="float-right"
            :disabled="this.activeName == 'first'"
            @click="retreatReceiptRrint"
          >退发票
          </el-button>
          <el-button
            type="primary"
            class="float-right margin-right-10"
            :disabled="this.activeName == 'first'"
            @click="getPrintReceiptInfo"
          >白纸重打
          </el-button>
          <el-button
            ref="btuNewPrint"
            type="primary"
            class="float-right margin-right-10"
            :disabled="this.activeName == 'first'"
            @click="newReceiptprint"
          >新票重打
          </el-button>
          <el-button
            type="primary"
            class="float-right"
            :disabled="this.activeName == 'first'"
            @click="getPrintReceiptInfo"
          >原票重打
          </el-button>
          <el-button
            ref="btuPrint"
            type="primary"
            class="float-right"
            :disabled="this.activeName == 'second'"
            @click="printReceipt"
          >票据打印
          </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="width100 elTab">
        <el-tab-pane label="未打印" name="first">
          <unPrint
            v-if="activeName==='first'"
            :patientId="selectedPatientInfo.patientId"
            ref="unPrint"
            @selectTradeDetail="selectTradeDetail"
          ></unPrint>
        </el-tab-pane>
        <el-tab-pane label="已打印" name="second">
          <printed
            v-if="activeName==='second'"
            ref="printed"
            :patientId="selectedPatientInfo.patientId"
            @selectReceiptDetail="selectReceiptDetail"
          ></printed>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>-->
  <l-layout
    :toolBoxs="toolBoxs"
    :boxExpanded="false"
    :isToolBox="true"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
    displayMode="expand"
    @message="messageHandler"
  >
    <template #topSlot>
      <PatientInfoTop :patientInfo="selectedPatientInfo"/>
    </template>
    <template #list>
      <el-card style="padding:0 10px" class="height100">
        <l-card-title>
          <span slot="left">患者列表</span>
        </l-card-title>
        <div class="patient-list">
          <PatientList @listItemClick="listItemClickHandle"></PatientList>
        </div>
      </el-card>
    </template>
    <template #content>
      <el-card class="width100 height100 padding10">
        <el-row class="width100">
          <el-col :span="12">
            <el-row :gutter="10" class="width100">
              <el-col :span="0">
                <!-- <el-input v-model="patientName" placeholder="姓名/卡号" class="float-left" clearable></el-input>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" class="float-left" @click="select">查询</el-button>-->
                <!-- <l-read-card @readCard="readCard"></l-read-card> -->
                <!-- <l-patient-fin class="width100" viewReadCard widthMin></l-patient-fin> -->
              </el-col>
              <el-col :span="12" v-loading="btuLoading">
                <span class="float-left numSpan">下一张票据号: {{nextReceiptNumOutPO.receiptNum}}</span>
              </el-col>
              <el-col :span="12">
                <el-button ref="btuJump" type="primary" class="float-left" @click="jumpNum">跳号</el-button>
                <el-button
                  type="primary"
                  plain
                  class="float-left margin-left-10"
                  @click="getNextReceiptNum"
                >刷新
                </el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-button
              ref="btuRefund"
              type="primary"
              class="float-right"
              :disabled="activeName == 'first'"
              @click="retreatReceiptRrint"
            >退发票
            </el-button>
            <el-button
              type="primary"
              class="float-right margin-right-10"
              :disabled="activeName == 'first'"
              @click="getPrintReceiptInfo"
            >白纸重打
            </el-button>
            <el-button
              ref="btuNewPrint"
              type="primary"
              class="float-right margin-right-10"
              :disabled="activeName == 'first'"
              @click="newReceiptprint"
            >新票重打
            </el-button>
            <el-button
              type="primary"
              class="float-right"
              :disabled="activeName == 'first'"
              @click="getPrintReceiptInfo"
            >原票重打
            </el-button>
            <el-button
              ref="btuPrint"
              type="primary"
              class="float-right"
              :disabled="activeName == 'second'"
              @click="printReceipt"
            >票据打印
            </el-button>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="width100 elTab">
          <el-tab-pane label="未打印" name="first">
            <unPrint
              v-if="activeName==='first'"
              :patientId="selectedPatientInfo.patientId"
              ref="unPrint"
              @selectTradeDetail="selectTradeDetail"
            ></unPrint>
          </el-tab-pane>
          <el-tab-pane label="已打印" name="second">
            <printed
              v-if="activeName==='second'"
              ref="printed"
              :patientId="selectedPatientInfo.patientId"
              @selectReceiptDetail="selectReceiptDetail"
            ></printed>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </template>
  </l-layout>
</template>
<script>
  import {mapGetters} from "vuex";
  import printed from "./components/printed";
  import unPrint from "./components/unPrint";
  import service from "@/api/cis/receiptPrint/receiptPrint";
  // import {onPreview, onPrint} from '@/utils/print';
  import {print, preview, onPreview} from "@/utils/print";
  import {getDatas} from "@/api/wconf/wparam";
  import {transformCode} from "@/api/directive/directiveRequest";
  import PatientList from "@/components/PatientList.vue";

  export default {
    components: {
      printed,
      unPrint,
      PatientList
    },
    data() {
      return {
        // 读卡
        patientId: "",
        // 下一张票据号 出库对象
        nextReceiptNumOutPO: "00000000",
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
        toolBoxs: []
      };
    },
    computed: {
      ...mapGetters("user", ["role"])
    },
    async mounted() {
      await this.getNextReceiptNum();
    },
    methods: {
      messageHandler(data) {

      },
      handleClick(tab, event) {
        this.select();
      },
      // 读卡
      readCard(data) {
        this.patientId = data.patientId;
      },
      // 获取下一张票据号
      async getNextReceiptNum() {
        try {
          this.btuLoading = true;
          let res = await service.getNextReceiptNum({
            receiptType: "1"
          });
          if (!res.data) {
            this.$message.error("未找到当前登录人的领用票据信息");
            return;
          }
          this.nextReceiptNumOutPO = res.data;
          this.btuLoading = false;
        } catch (error) {
          this.btuLoading = false;
          console.info(error);
          this.$message.error(error.msg || "获取下一张票据号失败");
        }
      },
      select() {
        if (this.activeName == "first") {
          this.$refs.unPrint.getTradeDetail();
        } else {
          this.$refs.printed.getReceiptDetail();
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
          this.$showLoading();
          let obj = {
            receiptNum: this.nextReceiptNumOutPO.nextReceiptNum,
            outId: this.nextReceiptNumOutPO.outId,
            inId: this.nextReceiptNumOutPO.intId,
            outpTradeDetailIds: this.tradeList
          };
          let res = await service.printReceipt(obj);
          this.$message({message: "票据数据保存成功", type: "success"});
          this.getNextReceiptNum();
          this.select();
          // 打印机。。
          onPreview(res.data, "门诊收费票据");
          this.$refs.btuPrint.disabled = false;
          this.$hideLoading();
        } catch (error) {
          console.info(error);
          this.$refs.btuPrint.disabled = false;
          this.$hideLoading();
          this.$message.error(error.msg || "打印票据失败");
        }
      },
      selectReceiptDetail(data) {
        this.currentReceiptDetail = data;
      },
      // 原票重打
      async getPrintReceiptInfo() {
        try {
          if (JSON.stringify(this.currentReceiptDetail)=="{}") {
            this.$message.error("请选择要打印的票据");
            return;
          }
          this.$showLoading();
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
          if (JSON.stringify(this.currentReceiptDetail)=="{}") {
            this.$message.error("请选择要打印的票据");
            this.$refs.btuNewPrint.disabled = false;
            return;
          }
          this.$showLoading();
          let obj = {
            ...this.currentReceiptDetail
          };
          // 下一张新的票据号
          obj.receiptNum = this.nextReceiptNumOutPO.nextReceiptNum;
          obj.outId = this.nextReceiptNumOutPO.outId;
          let res = await service.newPrintReceipt(obj);
          this.$message({message: "新票据数据保存成功", type: "success"});
          // 打印机
          // onPreview(res.data, "票据");
          this.receiptContent = res.data;
          this.handlePrintData();
          this.getNextReceiptNum();
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
          if (JSON.stringify(this.currentReceiptDetail)=="{}") {
            this.$message.error("请选择要退的票据");
            this.$refs.btuRefund.disabled = false;
            return;
          }
          if (this.currentReceiptDetail.recordStatus != "1") {
            this.$refs.btuRefund.disabled = false;
            this.$message.error("此票据已经退票");
            return;
          }
          this.$showLoading();
          let params = {
            receiptId: this.currentReceiptDetail.receiptId
          };
          let res = await service.retreatReceiptRrint(params);
          if (res.code == 1) {
            this.$message({message: "退发票成功", type: "success"});
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
            receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1
          };
          let res = await service.receiptJumpNum(obj);
          this.getNextReceiptNum();
          this.btuLoading = false;
          if (res.code == "1") {
            this.$message({type: "success", message: "跳号成功"});
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
      // 处理打印数据
      async handlePrintData() {
        let printTimeYear = this.receiptContent.printTime
          ? this.receiptContent.printTime.split("-")[0]
          : "";
        let printTimeMon = this.receiptContent.printTime
          ? this.receiptContent.printTime.split("-")[1]
          : "";
        let printTimeDay = this.receiptContent.printTime
          ? this.receiptContent.printTime.split("-")[2].split(" ")[0]
          : "";
        let printData = {
          bussessTradeCode: this.receiptContent.serialNumber || "",
          orgType: this.receiptContent.hospitalType || "",
          receiptNum: this.receiptContent.receiptNum || "",
          name: this.receiptContent.patientName || "",
          sex: this.receiptContent.patientGender || "",
          companyName: this.receiptContent.companyName || "", //?医保类型
          socialSecurityNum: this.receiptContent.socialSecurityNum || "", //?社会保障号码
          RMB: this.receiptContent.capitalizedAmount || "零",
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
          printTimeDay: printTimeDay
        };
        let inpFeeClassSumDTOS = this.receiptContent.outpChargeDetailNewPOs;
        let arr = [];
        for (let i in inpFeeClassSumDTOS) {
          let item = inpFeeClassSumDTOS[i];
          let item1 = inpFeeClassSumDTOS[Number(i + 1)];
          if (Number(i) % 2 === 0) {
            let obj = {
              num1: item.chargeQuantity || 0,
              price1: this.formatNumber(item.chargePrice) || "0.00",
              selfPrice1: this.formatNumber(item.chargePrice) || "0.00"
            };
            if (item.pharmacyExecFlag != 1) {
              obj.product1 =
                (item.chargeItemName || "") + "/" + (item.chargeUnit || "");
            } else {
              await this.codeTransform([
                {
                  field: "name",
                  code: "DrugUnit",
                  val: item.chargeUnit || ""
                }
              ]);
              obj.product1 =
                (item.chargeItemName || "") +
                "/" +
                (this.codeTransformList["DrugUnit"][item.chargeUnit] || "");
            }
            if (Number(i + 1) < inpFeeClassSumDTOS.length) {
              obj.num2 = item1.chargeQuantity || "0";
              obj.price2 = this.formatNumber(item1.chargePrice) || "0.00";
              obj.selfPrice1 = this.formatNumber(item1.chargePrice) || "0.00";
              if (item1.pharmacyExecFlag != 1) {
                obj.product2 =
                  (item1.chargeItemName || "") + "/" + (item1.chargeUnit || "");
              } else {
                this.codeTransform([
                  {
                    field: "name",
                    code: "DrugUnit",
                    val: item1.chargeUnit || ""
                  }
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
            val: this.receiptContent.patientGender || ""
          }
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
      }
    }
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
    height: calc(100% - 56px);
  }

  .patient-list {
    height: calc(100% - 63px);
  }
</style>
