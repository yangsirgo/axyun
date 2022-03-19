<template>
  <div class="width100 height100 chare-box" v-loading="loading">
    <div class="chare-box-content">
      <div class="top">
        <div style="font-size: 16px; font-weight: bold">发票类型
          <el-radio v-model="billType" label="1">电子</el-radio>
          <el-radio v-model="billType" label="2">纸质</el-radio>
        </div>
        <div>
          <span style="font-size: 16px; font-weight: bold" v-if="billType==='2'">下一张票据号
            <span
              style="
                font-size: 16px;
                font-weight: bold;
                color: rgb(240, 90, 35);
                margin-right: 16px;
                display: inline-block;
                min-width: 80px;
              "
              v-loading="btuLoading"
              >{{ nextReceiptNumOutPO.receiptNum || "无" }}</span
            >
          </span>
          <el-button type="primary" :disabled="billType==='1'" @click="jumpCode">跳号</el-button>
          <el-button type="primary" :disabled="billType==='1'" @click="getNextReceiptNum">刷新</el-button>
          <el-button type="primary" :disabled="billType==='1'" @click="billsUse">票据启用</el-button>
          <el-button type="primary" @click="sidetailTableVisible = true" :disabled="siDetailDisabled">医保明细</el-button>
          <el-button type="primary" @click="printNameseterVisible = true">打印机</el-button>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="title">预结算信息</div>
          <div class="item">
            合计金额
            <div>{{ chargeObj.feeAmount.toFixed(2) || "0.00" }}</div>
          </div>
          <div class="item">
            记账金额
            <div>{{ chargeObj.freePayMoney.toFixed(2) || "0.00" }}</div>
          </div>
          <div class="item">
            减免金额
            <div>{{ chargeObj.derateAmount.toFixed(2) || "0.00" }}</div>
          </div>
          <div class="item self-charge">
            个人自付
            <div>{{ chargeObj.selfPayMoney.toFixed(2) || "0.00" }}</div>
          </div>
        </div>
        <div class="right">
          <div class="title">记账金额明细</div>
          <div v-if="chargeObj.siSettlementInfoDto">
            <div
              v-for="(item, index) in chargeObj.siSettlementInfoDto
                .siTradeAmtDetailDtos"
              :key="index"
              class="item"
            >
              <!-- <div v-if="item.tradeAmtName">{{ item.tradeAmtName }}</div> -->
              <div v-if="item.tradeAmtCode">{{ transformNew("fund_pay_type", item.tradeAmtCode) }}：</div>
              <div class="valueArea">
                {{ item.tradeAmt.toFixed(2) || "0.00" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span class="payTitle">请选择支付方式</span>
      <div class="pay-type-list">
      <el-form class="mar-top-10" :model="form" ref="ruleForm">
        <el-form-item label-width="0">
          <el-row :gutter="10" class="pay-type">
            <el-col
              :span="12"
              v-for="item in payTypeListShow"
              :key="item.payTypeId"
            >
              <el-row class="radio-item">
                <el-radio
                    class="pay-radio"
                    v-model="payType"
                    :label="item.payTypeId"
                    style="width: 100%"
                    @change="payTypeChange"
                    :disabled="moneyEnough || radioDisabled"
                  >
                    <span
                      style="
                        display: inline-block;
                        vertical-align: sub;
                        margin-right: 10px;
                      "
                    >
                      <svg
                        t="1568712240954"
                        class="icon"
                        viewBox="0 0 1137 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="8446"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M113.777778 0h910.222222a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m512 341.333333H512V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777778H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777777a56.888889 56.888889 0 0 0 113.777778 0v-113.777777h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-170.666666V455.111111h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-56.888888V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777z"
                          fill="#38A79C"
                          p-id="8447"
                        />
                      </svg>
                    </span>
                    {{ item.payTypeName }}
                </el-radio>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row class="pay-zp pay-type" :gutter="10" v-if="isBank">
          <el-col :span="12">
            <el-form-item
              prop="companyName"
              :rules="{ required: true, message: '请输入', trigger: 'blur' }"
            >
              <LFormtTitle label="单位名称" :required="true">
                <el-input
                  v-model="form.companyName"
                  placeholder="请输入内容"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="bankName"
              :rules="{ required: true, message: '请输入', trigger: 'blur' }"
            >
              <LFormtTitle label="开户银行" :required="true">
                <el-input
                  v-model="form.bankName"
                  placeholder="请输入内容"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="no-bottom">
            <el-form-item
              prop="bankAccount"
              :rules="{ required: true, message: '请输入', trigger: 'blur' }"
            >
              <LFormtTitle label="银行账号" :required="true">
                <el-input
                  v-model="form.bankAccount"
                  placeholder="请输入内容"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="checkNum"
              :rules="{ required: true, message: '请输入', trigger: 'blur' }"
            >
              <LFormtTitle label="票号" :required="true">
                <el-input
                  v-model="form.checkNum"
                  placeholder="请输入内容"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <LFormtTitle label="付款码">
          <el-input
            v-model="authCode"
            ref="inputVal"
            :disabled="inputValStyle"
            @blur="authCodeBlur(authCode)"
            @keyup.enter.native="blurSubmit(authCode)"
          ></el-input>
        </LFormtTitle>
      </div>
      <div class="bottom-info">
        <el-row>
          <el-col :span="8" class="mar-top-10">
            <span >实收金额</span>
            <el-input
              v-model="realGet"
              class="margin-left-6 "
              @change="getBackMoney"
              :disabled="
                permitChargeFlag === '1'
                  ? chargeObj.selfPayMoney <= accountInfo.prestoreUseMoney
                  : true
              "
            ></el-input>
            <!-- 可用余额比自付金额多时，不用编辑实收金额 -->
            <p style="color: #f05a23; padding-left: 78px">{{ warning }}</p>
          </el-col>
          <el-col :span="8" class="mar-top-10" v-if="permitChangeFlag == '1'">
            <span
              >抹零金额
              <span class="font" style="color: #f05a23">{{
                unChargeSmallChange
              }}</span>
            </span>
          </el-col>
          <el-col :span="8" class="mar-top-10" v-if="permitChargeFlag === '1'">
            <span>
              找零金额
              <span class="font" style="color: #f05a23">{{
                this.backMoney.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
        </el-row>
      </div>
    </div>
    </div>
    <div class="button-footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        type="primary"
        :disabled="warning != ''"
        @click="submitRegister"
        >确定收费</el-button
      >
    </div>
    <el-dialog
      :append-to-body="true"
      title="票据启用"
      :visible.sync="dialogVisible"
      width="1500px"
      :before-close="getNextReceiptNum"
    >
      <div class="width100 padding10">
        <useSelect :inBillForm="inBillForm" style="height: 600px"></useSelect>
      </div>
    </el-dialog>
    <LSidetailTable
      :hisTradeId="chargeObj.tradeId"
      v-if="sidetailTableVisible"
      title="医保明细"
      width="1300px"
      :visible.sync="sidetailTableVisible"
      @cancel="sidetailTableClose"
    ></LSidetailTable>
    <printNameseter
      v-if="printNameseterVisible"
      title="打印机设置"
      width="800px"
      :visible.sync="printNameseterVisible"
      :requiredName="requiredName"
      @closePrintSeterFuc="closePrintSeterFuc"
    ></printNameseter>
  </div>
</template>
<script>
import appointment from "@/api/appointment/appointment";
import service from "@/api/financeManagement/inp.js";
import NP from "number-precision";
import { preview, onPreview, getMacLoaction } from "@/utils/print";
import service2 from "@/api/cis/receiptPrint/receiptPrint";
import finDictionaryService from "@/api/financeManagement/finDictionary.js";

import useSelect from "@/views/finance/receiptManager/components/useSelect";

import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";
import { print, getPrinterList } from "@/utils/print_new";
import { createData } from "@/printTemplete/module/financeLodopTpl.js";
import { PrintLabel } from "@/printTemplete/module/printLabel.js";
import { thermosensitiveTpl, thermosensitiveErrorTpl, handleThermosensiPrintData } from "@/printTemplete/module/thermosensitiveTpl.js";
import { deepClone } from "@/utils/index.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";
export default {
  name: "LCharge",
  mixins: [getDictInfoNew],
  components: {
    useSelect
  },
  props: {
    // 收费信息
    charge: {
      type: Object,
      defalut() {
        return {
          confirmInfo: {
            settlementType: ""
          }
        }
      }
    },
    // 结算类型。true 预约预结算， false 门诊预结算
    isApptointment: {
      type: Boolean,
      required: true
    },
    // 是否在页面上显示收费框。
    notMs: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 发票类型
      billType: "",
      inputValStyle: false,
      radioDisabled: true,
      // loading
      loading: false,
      // 实收提示
      warning: "",
      // 实收金额
      realGet: 0,
      // 找零
      backMoney: 0,
      // 支付方式列表
      payTypeList: [],
      // 支付方式列表（过滤掉余额支付）
      // 因为预存账户里面如果有余额的话，肯定是要用的，不需要用户选择。如果预存账户余额不足，才需要选择其他的支付方式
      payTypeListShow: [],
      // 支付方式(默认卡余额)
      payType: "",
      payTypeClassCode: "",
      payTypeName: "",
      // 支票交易需要填写的信息
      form: {
        companyName: "",
        bankName: "",
        bankAccount: "",
        checkNum: "",
        depositBank: "",
        recordRemark: ""
      },
      // 预结算返回对象
      chargeObj: {
        tradeId: "", // 交易id
        // balanceMoney: 0,
        feeAmount: 0, // 总费用
        // cashPay: 0,
        derateAmount: 0, // 减免金额
        selfPayMoney: 0, // 自付金额
        freePayMoney: 0, // 记账金额
        // prestoreBalance: 0,
        finClassVOs: []
      },
      // 患者账户信息
      accountInfo: {
        balanceMoney: 0, // 预存账户金额
        grantOverdrawMoney: 0, // 授权透支金额
        prestoreUseMoney: 0 // 预存账户可用金额
      }, // 此处结算是否计算 账户余额+授权透支金额 = 可用余额 用于支付
      isBank: false,
      permitChargeFlag: "0",
      permitChangeFlag: "0", //当前支付方式抹零标志
      unChargeSmallChange: 0, //抹零金额
      authCode: "", //付款码
      // 新功能-收费成功自动打印
      nextReceiptNumOutPO: {},
      // 本机主MAC地址
      currentMac: "",
      receiptContent: {}, //打印数据
      receiptType: "", //票据类型
      btuLoading: false, //票号loading
      //票据启用
      dialogVisible: false,
      inBillForm: {
        outType: "1", //出库类型
        receiveUserId: "", //领用人员
        receiptType: "", //票据类型
        abortStatus: "0" //终止标识
      },
      sidetailTableVisible: false,
      printNameseterVisible: false,
      requiredName: ""
    };
  },
  computed: {
    hasAcc() {
      // 支付列表中是否含有余额支付
      const item = this.payTypeList.find(
        item => item.payTypeClassCode === "prestore"
      );
      return item;
    },
    moneyEnough() {
      // 如果余额充足，直接使用余额支付，不用选择其他支付方式
      // const money =
      //   (this.accountInfo.prestoreUseMoney * 100 -
      //     this.chargeObj.selfPayMoney * 100) /
      //   100;
      const money = NP.minus(
        this.accountInfo.prestoreUseMoney,
        this.chargeObj.selfPayMoney
      );
      return this.hasAcc && money >= 0;
    },
    hasPreMoney() {
      return this.accountInfo.prestoreUseMoney > 0
        ? this.accountInfo.prestoreUseMoney
        : 0;
    },
    siDetailDisabled() {
      let flag = this.charge.confirmInfo.settlementType === "3" ? false : true;
      return flag;
    }
  },
  watch: {
    realGet: {
      handler(val) {
        this.realGet = val;
        if (this.permitChangeFlag == "1") {
          this.getBackMoney();
        }
      }
    },
    billType(val) {
      if(val === "2" && JSON.stringify(this.nextReceiptNumOutPO) === "{}") {
        this.getNextReceiptNum();
      }
    }
  },
  created() {
    // this.printElectronicReceipt("Microsoft Print to PDF");
    this.getCurrentBillType({pageNo: 1, pageSize: 1000});
  },
  async mounted() {
    if (!this.notMs) {
      await this.preSettlementNew();
      await this.submitRegister();
      return;
    }
    // this.getPatientAccount();
    await this.getDictionaryPO();
    // this.getNextReceiptNum();
    this.preSettlementNew();
    this.getPayTypeByAuth();
    this.$refs.inputVal.focus();
  },
  methods: {
    async getDictionaryPO() {
      try {
        let res = await service2.getDictionaryPO({
          itemCode: "F0016",
          valueCode: "00"
        });
        if (res.code == 1) {
          this.receiptType = res.data.dictionaryValue;
          this.inBillForm.receiptType = res.data.dictionaryValue;
        }
      } catch (error) {
        this.$message.error(error.msg || "获取票据类型失败");
      }
    },
    // 获取下一张票据号
    async getNextReceiptNum(done) {
      try {
        this.nextReceiptNumOutPO = {};
        this.btuLoading = true;
        if (!this.currentMac) {
          let mac = {
            value: ""
          };
          getMacLoaction(mac)
            .then(async res2 => {
              this.currentMac = res2;
              let res = await service2.getNextReceiptNum({
                receiptType: this.receiptType,
                useMacLoaction: this.currentMac || undefined
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
          let res = await service2.getNextReceiptNum({
            receiptType: this.receiptType,
            useMacLoaction: this.currentMac || undefined
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
        console.info(error);
        this.btuLoading = false;
        this.$message.error(error.msg || "获取下一张票据号失败");
      }
      if (done) {
        done();
      }
    },
    //跳号
    async jumpCode() {
      this.$confirm('是否进行跳号操作?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(async() => {
        try {
          this.btuLoading = true;
          let obj = {
            outId: this.nextReceiptNumOutPO.outId,
            receiptStartNum: this.nextReceiptNumOutPO.nextReceiptNum,
            receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1
          };
          let res = await service2.receiptJumpNum(obj);
          this.btuLoading = false;
          if (res.code == "1") {
            this.getNextReceiptNum();
            this.$message({
              type: "success",
              message: "跳号成功"
            });
          } else {
            this.$message.error(res.msg || "跳号失败");
          }
        } catch (error) {
          this.btuLoading = false;
          this.$message.error(error.msg || "跳号失败");
        }
      })
    },
    //票据启用
    billsUse() {
      this.dialogVisible = true;
    },
    printLabelValied() {
      let list = this.chargeObj.outpOrderChargeDetailInfoVOS;
      let listArr = list.filter((item)=> {
        return item.pharmacyExecFlag == "1" && (item.orderType == "10" || item.orderType == "12");
      });
      if(!listArr.length) {
        this.$emit("close", {refresh: true});
        return;
      }
      let printerName = "";
      // 选择标签打印机
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      let arr = tableData.filter((item) => {
        return item.name === "用药标签";
      });
      if(arr.length) {
        printerName = arr[0].printerName;
        this.printLabelFuc(printerName);
        return;
      }
      this.printNameseterVisible = true;
      this.requiredName = "用药标签";
    },
    // 打印用药标签
    async printLabelFuc(printerName) {
      let list = this.chargeObj.outpOrderChargeDetailInfoVOS;
      try {
        for(let i in list) {
          let item = list[i];
          if(item.pharmacyExecFlag == "1" && (item.orderType == "10" || item.orderType == "12")) {
            let res = await appointment.printLabelByRecipeId(item.orderBillId);
            if(res.code == 1) {
              for(let j in res.data) {
                let obj = {
                hosName: "",
                patientName: "",
                patientGenderName: "",
                patientAge: "",
                recipeCode: "",
                basicTypeName: "",
                drugName: "",
                spec: "",
                display: "",
                frequencyName: "",
                oneDosage: "",
                medicationCode: "",
                cautions: ""
                }
                let val = res.data[j];
                let hosName = val.hosName || JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团";
                obj = {
                  ...obj,
                  ...val,
                  hosName
                }
                print("", PrintLabel, {printerName}, obj, true);
              }
            }
          }
        }
        this.$emit("close", {refresh: true});
      } catch (error) {
        this.$emit("close", {refresh: true});
      }
    },
    // 票据打印校验
    async printReceiptValied() {
      if(this.chargeObj.feeAmount - this.chargeObj.derateAmount <= 0) {
        if (this.chargeObj.settleDrugPrintFlag == "1") {
          //添加新功能，打印用药标签
          await this.printLabelValied();
          return;
        }
        this.$emit("close", {refresh: true});
        return;
      }
      if (!this.nextReceiptNumOutPO.receiptNum && this.billType === "2") {
        this.$message.error("当前票据号为空");
        if (this.chargeObj.settleDrugPrintFlag == "1") {
          //添加新功能，打印用药标签
          await this.printLabelValied();
          return;
        }
        this.$emit("close", {refresh: true});
        return;
      }
      let printerName = "";
      // 选择发票打印机
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      if(this.billType === "2") {
        // 纸质发票
        let arr = tableData.filter((item) => {
        return item.name === "收费发票";
        });
        if(arr.length) {
          printerName = arr[0].printerName;
          await this.printReceipt(printerName);
          return;
        }
        this.printNameseterVisible = true;
        this.requiredName = "收费发票";
        return;
      }
      // 电子发票热敏凭条
      let arr = tableData.filter((item) => {
      return item.name === "热敏凭证";
      });
      if(arr.length) {
        printerName = arr[0].printerName;
        await this.printElectronicReceipt(printerName);
        return;
      }
      this.printNameseterVisible = true;
      this.requiredName = "热敏凭证";
      return;
    },
    // 票据打印-纸质
    async printReceipt(printerName) {
      try {
        // this.$showLoading();
        let obj = {
          receiptNum: this.nextReceiptNumOutPO.nextReceiptNum,
          outId: this.nextReceiptNumOutPO.outId,
          inId: this.nextReceiptNumOutPO.intId,
          outpTradeDetailIds: [this.chargeObj.tradeId]
        };
        let res = await service2.printReceipt(obj);
        this.$message({
          message: "票据数据保存成功",
          type: "success"
        });
        // 打印机。。
        this.receiptContent = res.data;
        let printObj = createData(this.receiptContent, this.dayjs);
        let { code, data } = await getPrintTpl(codes.financeTpl);
        if (code != 1) return;
        print("", data.value, {printerName}, printObj, true);
      } catch (error) {} finally {
        this.$hideLoading();
        if (this.chargeObj.settleDrugPrintFlag == "1") {
          //添加新功能，打印用药标签
          await this.printLabelValied();
        } else {
          this.$emit("close", {refresh: true});
        }
      }
    },
    // 票据打印-电子发票热敏凭条
    async printElectronicReceipt(printerName) {
      try {
        let res = await service2.printInvoiceEBill({
          tradeId: this.chargeObj.tradeId || ""
          // tradeId: "8ae451047ca594ed017ca67197e100df"
        });
        if (res.code === 1) {
          let obj = handleThermosensiPrintData(res.data);
          print("", thermosensitiveTpl, {printerName}, obj, true);
        } else if (res.code === 1001) {
          this.$message.error(res.msg || "开具电子发票失败！");
          let obj = handleThermosensiPrintData(res.data || {});
          print("", thermosensitiveErrorTpl, {printerName}, obj, true);
        } else {
          this.$message.error(res.msg || "开具电子发票失败！");
        }
      } catch (error) {} finally {
        if (this.chargeObj.settleDrugPrintFlag == "1") {
          //添加新功能，打印用药标签
          await this.printLabelValied();
        } else {
          this.$emit("close", {refresh: true});
        }
      }
    },
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
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
          sCapital.substr(sAmount.substr(i, 1), 1) + sUnit.substr(i, 1);
      }
      return sPrefix + sOutput;
    },
    // 新功能：收费成功后自动打印-end
    // 查询支付方式
    getPayTypeByAuth() {
      this.$showLoading();
      service
        .getPayTypeByAuth({
          businessCode: "00"
        })
        .then(res => {
          if (res.code === 1) {
            this.payTypeList = res.data;
            // 支付方式列表（过滤掉余额支付）
            // 因为预存账户里面如果有余额的话，肯定是要用的，不需要用户选择。如果预存账户余额不足，才需要选择其他的支付方式
            const list = res.data.filter(
              item => item.payTypeClassCode !== "prestore"
            );
            this.payTypeListShow = list;
          } else {
            this.$message.error(res.msg || "获取支付方式失败");
          }
          this.$hideLoading();
        })
        .catch(error => {
          this.$hideLoading();
          this.$message.error(error.msg || "获取支付方式失败");
        });
    },

    // 计算找零
    getBackMoney() {
      // 验证
      let rule = /^(\d*)(\d*)(\.\d{1})?$/;
      if (this.permitChangeFlag == "1") {
        if (rule.test(this.realGet) === false) {
          this.warning = "输入到小数点后一位";
          return;
        }
      }
      this.warning = "";
      //可用预存余额-自付金额的差是否等于自付金额，校验
      const comPrice = NP.plus(
        Number(
          parseInt(
            NP.minus(this.hasPreMoney, this.chargeObj.selfPayMoney) * 10
          ) / 10
        ),
        this.realGet
      );
      if (comPrice < 0) {
        this.warning = "金额不足";
        this.backMoney = 0;
      } else {
        //找零金额=实收金额-抹零后的应收金额
        this.backMoney = comPrice;
      }
    },
    // 选择支付方式
    payTypeChange(data) {
      console.log(data);
      this.backMoney = 0;
      this.payTypeList.forEach(val => {
        if (data == val.payTypeId) {
          if (
            val.payTypeCode == "alipay_barcode" ||
            val.payTypeCode == "wxpay_barcode"
          ) {
            this.inputValStyle = false;
            this.$nextTick(function() {
              this.$refs.inputVal.focus();
            });
          } else {
            this.inputValStyle = true;
            this.authCode = ''
            this.$refs.inputVal.focus();
          }
          this.payTypeClassCode = val.payTypeClassCode;
          this.payTypeName = val.payTypeName;
          // 当前支付方式支持抹零的话,将实付金额默认值抹零
          if (val.permitChangeFlag == "1") {
            this.permitChangeFlag = "1";
            //计算抹零金额
            // this.unChargeSmallChange = NP.minus(this.realGet,Number(parseInt(this.realGet * 10)/10));
            this.unChargeSmallChange = NP.minus(
              NP.minus(this.chargeObj.selfPayMoney, this.hasPreMoney),
              Number(
                parseInt(
                  NP.minus(this.chargeObj.selfPayMoney, this.hasPreMoney) * 10
                ) / 10
              )
            );

            this.realGet = Number(
              parseInt(
                NP.minus(this.chargeObj.selfPayMoney, this.hasPreMoney) * 10
              ) / 10
            );
          } else {
            this.permitChangeFlag = "0";
            this.unChargeSmallChange = 0;
            this.warning = "";
            this.realGet = NP.minus(
              this.chargeObj.selfPayMoney,
              this.hasPreMoney
            );
          }
        }
      });
      // 是否允许找零
      this.permitChargeFlag = this.payTypeClassCode === "cash" ? "1" : "0";
      // 支付方式
      this.isBank = this.payTypeClassCode === "cheque";
    },
    // 查询患者账户信息
    async getPatientAccount() {
      try {
        this.loading = true;
        const res = await appointment.getAccountInfo(
          this.charge.appointment.patientId
        );
        if (res.code === 1) {
          this.accountInfo = res.data;
          this.accountInfo.prestoreUseMoney = 0; //罗湖医院没有预存账户，此处写死为0
          this.preSettlementNew();
          this.getPayTypeByAuth();
        } else {
          this.$message.error(res.msg || "查询患者账户信息失败");
          this.close();
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.close();
        this.$message.error(error.msg || "查询患者账户信息失败");
      }
    },
    // 确认收费
    // eslint-disable-next-line complexity
    submitRegister() {
      if(!this.billType) {
        this.$message.warning("请选择【发票类型】");
        return;
      }
      if (!this.moneyEnough) {
        if (this.realGet !== 0 && this.payType === "") {
          this.$message.warning("请选择支付方式");
          return;
        }
        if (
          (this.payTypeClassCode === "alipay" ||
            this.payTypeClassCode === "wxpay") &&
          this.authCode == "" &&
          (this.realGet != "" && this.realGet != "0")
        ) {
          this.$message.warning("付款码不能为空");
          return;
        }
        const payMoney = NP.minus(
          this.chargeObj.selfPayMoney,
          this.hasPreMoney
        );

        if (this.realGet < Number(parseInt(payMoney * 10) / 10)) {
          this.$message.warning("请填写正确的实收金额");
          return;
        }
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // 付款金额大于余额时需要选择支付方式，并支付扣除余额部分的钱。小于等于时直接用余额里的钱支付
          const flag =
            this.chargeObj.selfPayMoney > this.accountInfo.prestoreUseMoney;
          let list = [];
          if (this.hasAcc && this.accountInfo.prestoreUseMoney > 0) {
            list.push({
              payTypeId: this.hasAcc.payTypeId,
              settleAmt: flag
                ? this.accountInfo.prestoreUseMoney
                : this.chargeObj.selfPayMoney
            });
          }
          if (flag) {
            let item = {
              payTypeId: this.payType,
              authCode: this.authCode
            };
            if (this.permitChangeFlag == "1") {
              item.unChargeSmallChange = this.unChargeSmallChange;
              item.settleAmt = Number(
                parseInt(
                  NP.minus(this.chargeObj.selfPayMoney, this.hasPreMoney) * 10
                ) / 10
              );
            } else {
              item.settleAmt = NP.minus(
                this.chargeObj.selfPayMoney,
                this.hasPreMoney
              );
            }
            // 选择支票支付时需要传递支票参数
            if (this.payTypeClassCode === "cheque") {
              item = {
                ...item,
                ...this.form
              };
            }
            list.push(item);
          }
          const params = {
            tradeId: this.chargeObj.tradeId,
            appCode: this.chargeObj.appCode,
            outTradeSettleAmtDetailVO2s: list,
            channelId: "898a0d3cba3d4f4faeecf113e67a47e9"
          };
          appointment
            .settlementNew(params)
            .then(async res => {
              if (res.code === 1) {
                this.$message.success("结算成功");
                await this.printReceiptValied();
              } else {
                this.$message.error(res.msg || "收费失败");
                if (!this.notMs) {
                  this.$emit("close", {refresh: true});
                }
              }
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
              if (!this.notMs) {
                this.$emit("close", {refresh: true});
              }
              // this.$message.error(err.msg || "收费失败");
            });
        }
      });
    },//
    // 关闭弹窗
    close() {
      this.$emit("close", {});
    },

    // 结算
    async settlementNew() {
      try {
        this.$showLoading();
        let res = await appointment.settlementNew(this.outpPreSettlementResult);
        if (res.code == "1") {
          this.$message({
            message: "结算成功",
            type: "success"
          });
        } else {
          this.$message.error(res.msg || "结算失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
      }
    },
    // 门诊预结算
    async outpatientSettlement() {
      try {
        const params = {
          // 患者id
          patientId: this.charge.appointment.patientId,
          // 结算类型
          settlementType: this.charge.confirmInfo.settlementType,
          // 单位代码
          companyCode: this.charge.appointment.companyCode,
          // 人员类别
          hisPersonType: "",
          // 诊疗活动id
          diagTreatActivityId: this.charge.appointment.diagTreatActivityId,
          // 部门id
          deptId: this.charge.appointment.deptId,
          // 专科id
          ouptDeptId: this.charge.appointment.ouptDeptId,
          // 医师id
          doctorId: this.charge.appointment.doctorId,
          // 应用代码
          appCode: "",
          // 医疗类别（医保）
          medicalType: "",
          // 病种代码
          diseaseCode: "",
          // 病种名称
          diseaseName: "",
          // 病种分类代码
          diseaseTypeCode: "",
          // 门诊预收费用明细
          outpOrderChargeDetailVO2s: this.charge.chargePrescriptions,
          siSettlementInfoDto: this.charge.confirmInfo
        };
        if (!params.diagTreatActivityId) {
          params.diagTreatActivityId = this.charge.appointment.visitCode;
        }
        this.$showLoading();
        let res = await appointment.preSettlementNew(params);
        this.$hideLoading();
        if (res.code === 1) {
          // 预结算返回对象赋值
          this.chargeObj = { ...res.data };
          this.radioDisabled = false;
          // 计算实收金额
          // const m =
          //   (res.data.selfPayMoney * 100 - this.hasPreMoney * 100) / 100;
          // 将医保的相同明细合并
          if(this.chargeObj.siSettlementInfoDto) {
            this.handleSiSettlementInfoDto();
          }

          let m = NP.minus(res.data.selfPayMoney, this.hasPreMoney);
          this.realGet = m > 0 ? m : 0;
          this.$message({
            message: "预结算成功",
            type: "success"
          });
        } else {
          this.close();
          this.$message.error(res.msg || "预结算失败");
        }
      } catch (error) {
        this.$hideLoading();
        this.close();
        this.$message.error(error.msg || "预结算失败");
        console.log(error);
      }
    },
    // 预约预结算
    // eslint-disable-next-line complexity
    async appointmentSettlement() {
      try {
        const params = {
          // 患者id
          patientId: this.charge.appointment.patientId || "",
          // 结算类型
          // settlementType: this.charge.appointment.settlementType || "",
          settlementType: this.charge.confirmInfo.settlementType,
          // 诊疗类型
          regDiagTreatType: this.charge.appointment.diagTreatType || "",
          // 挂号专科
          regSdeptId: this.charge.appointment.ouptDeptId || "",
          // 挂号医生
          regDoctorId: this.charge.appointment.doctorId || "",
          // 挂号工种代码
          regWorkCode: this.charge.appointment.workCode,
          // 预约id
          appointmentId: this.charge.appointment.appointmentId || "",
          // 单位代码
          companyCode: this.charge.appointment.companyCode || "",
          // 人员类别
          hisPersonType: "",
          // 诊疗活动id
          diagTreatActivityId: "",
          // 应用代码
          appCode: "",
          // 医疗类别（医保）
          medicalType: "",
          haveMoney:
            this.charge.haveMoney === undefined ? "" : this.charge.haveMoney,
          freeCode:
            this.charge.freeCode === undefined ? "" : this.charge.freeCode,
          siSettlementInfoDto: this.charge.confirmInfo
        };

        this.$showLoading();
        let res = await appointment.regPresettlement(params);
        this.$hideLoading();
        if (res.code === 1) {
          // 预结算返回对象赋值
          this.chargeObj = res.data;
          this.radioDisabled = false;
          // 计算实收金额
          // const m =
          //   (res.data.selfPayMoney * 100 - this.hasPreMoney * 100) / 100;
          // 将医保的相同明细合并
          if(this.chargeObj.siSettlementInfoDto) {
            this.handleSiSettlementInfoDto();
          }

          let m = NP.minus(res.data.selfPayMoney, this.hasPreMoney);
          this.realGet = m > 0 ? m : 0;
          this.$message.success(res.msg || "预结算成功!");
        } else {
          this.close();
          this.$message.error(res.msg || "预结算失败");
        }
      } catch (error) {
        this.$hideLoading();
        this.close();
        this.$message.error(error.msg || "预结算失败");
      }
    },
    handleSiSettlementInfoDto() {
      /* let arr = [{
					"hosId":"H0000000000000000000440303004005",
					"orgId":"",
					"recordStatus":"0",
					"siTradeAmtDetailId":"8ae4513a7bf84e8b017bf8559b540024",
					"siTradeId":"8ae4513a7bf84e8b017bf8559ae40014",
					"tradeAmt":16.26,
					"tradeAmtCode":"310100",
					"tradeAmtName":"城镇职工基本医疗保险统筹基金",
					"withinMedicareFundAmt":59.33
				},
        {
					"hosId":"H0000000000000000000440303004005",
					"orgId":"",
					"recordStatus":"0",
					"siTradeAmtDetailId":"8ae4513a7bf84e8b017bf8559b540024",
					"siTradeId":"8ae4513a7bf84e8b017bf8559ae40014",
					"tradeAmt":75.69,
					"tradeAmtCode":"310100",
					"tradeAmtName":"城镇职工基本医疗保险统筹基金",
					"withinMedicareFundAmt":59.33
				},
				{
					"hosId":"H0000000000000000000440303004005",
					"orgId":"",
					"recordStatus":"0",
					"siTradeAmtDetailId":"8ae4513a7bf84e8b017bf8559b580025",
					"siTradeId":"8ae4513a7bf84e8b017bf8559ae40014",
					"tradeAmt":43.07,
					"tradeAmtCode":"310200",
					"tradeAmtName":"城镇职工基本医疗保险个人账户基金",
					"withinMedicareFundAmt":59.33
				},
        {
					"hosId":"H0000000000000000000440303004005",
					"orgId":"",
					"recordStatus":"0",
					"siTradeAmtDetailId":"8ae4513a7bf84e8b017bf8559b580025",
					"siTradeId":"8ae4513a7bf84e8b017bf8559ae40014",
					"tradeAmt":22.01,
					"tradeAmtCode":"310200",
					"tradeAmtName":"城镇职工基本医疗保险个人账户基金",
					"withinMedicareFundAmt":59.33
				}
        ]; */
      let arr = deepClone(this.chargeObj.siSettlementInfoDto);
      if(!arr || !arr.length) {
        return;
      }
      let map = {};
      let dest = [];
      for(let i in arr) {
        let ai = arr[i];
        if (!map[ai.tradeAmtCode]) {
          dest.push({...ai});
          this.$set(map, ai.tradeAmtCode, ai);
        } else {
          for(let j in dest) {
            let dj = dest[j];
            if(dj.tradeAmtCode == ai.tradeAmtCode) {
              dj.tradeAmt = Number(dj.tradeAmt) + Number(ai.tradeAmt);
              break;
            }
          }
        }
      }
      console.log("destdestdestdest:", dest);
      this.$set(this.chargeObj, "siSettlementInfoDto", dest);
    },
    // 预结算
    async preSettlementNew() {
      if (this.isApptointment) {
        // 预约预结算
        await this.appointmentSettlement();
      } else {
        // 门诊预结算
        await this.outpatientSettlement();
      }
    },
    // 根据待收费明细得到 门诊医嘱明细   （小问题 待解决 20200413）
    getOutpOrderChargeDetailVO2(chargePrescriptions) {
      let obj = {};
      let list = [];
      chargePrescriptions.forEach(val => {
        // 处方来源为4: 电子申请
        if (val.prescriptionSource && val.prescriptionSource == "4") {
          if (!obj[val.id]) {
            list.push({
              orderType: val.orderItemCat, // 医嘱类型
              orderId: val.id, // 医嘱ID
              orderItemId: val.orderItemId, // 医嘱项目ID
              orderCode: "", // 医嘱项目CODE
              orderName: val.orderItemName, // 医嘱项目名称
              orderQuantity: val.quantity, // 医嘱数量
              orderSource: val.prescriptionSource, // 医嘱来源     /* 1 门诊处方 2 手工划价 4 电子申请单  */
              orderTime: null /* 医嘱时间 */,
              orderBillId: val.recipeId /* 申请单ID/处方ID */,
              orderBillNum: val.recipeCode /* 申请单号/处方号 */,
              executeDeptId: val.receiveDept /* 执行部门 代码（发药药房） */,
              additionalFeeFlag: null /* 附加费标志（譬如说煎药费，耗材费） */,
              relOrderChargeDetailId: null, // 关联医嘱费用明细ID
              thirdPartyOrderChargeTradeSerialNum: null, // 第三方医嘱费用交易序列号
              pharmacyExecFlag: null
            });
            obj[val.recipeId] = true;
          }
        } else if (val.prescriptionSource && val.prescriptionSource == "1") {
          // 医嘱
          if (!obj[val.recipeId]) {
            list.push({
              orderType: val.orderItemCat, // 医嘱类型
              orderId: val.id, // 医嘱ID
              orderItemId: val.orderItemId, // 医嘱项目ID
              orderCode: "", // 医嘱项目CODE
              orderName: val.orderItemName, // 医嘱项目名称
              orderQuantity: val.quantity, // 医嘱数量
              orderSource: val.prescriptionSource, // 医嘱来源     /* 1 门诊处方 2 手工划价 4 电子申请单  */
              orderTime: null /* 医嘱时间 */,
              orderBillId: val.recipeId /* 申请单ID/处方ID */,
              orderBillNum: val.recipeCode /* 申请单号/处方号 */,
              executeDeptId: val.receiveDept /* 执行部门 代码（发药药房） */,
              additionalFeeFlag: null /* 附加费标志（譬如说煎药费，耗材费） */,
              relOrderChargeDetailId: null, // 关联医嘱费用明细ID
              thirdPartyOrderChargeTradeSerialNum: null, // 第三方医嘱费用交易序列号
              pharmacyExecFlag: null
            });
            obj[val.recipeId] = true;
          }
        } else {
          // 手工划价
          // 医嘱
          if (!obj[val.recipeId]) {
            list.push({
              orderType: val.orderItemCat, // 医嘱类型
              orderId: val.id, // 医嘱ID
              orderItemId: val.orderItemId, // 医嘱项目ID
              orderCode: "", // 医嘱项目CODE
              orderName: val.orderItemName, // 医嘱项目名称
              orderQuantity: val.quantity, // 医嘱数量
              orderSource: val.prescriptionSource, // 医嘱来源     /* 1 门诊处方 2 手工划价 4 电子申请单  */
              orderTime: null /* 医嘱时间 */,
              orderBillId: val.recipeId /* 申请单ID/处方ID */,
              orderBillNum: val.recipeCode /* 申请单号/处方号 */,
              executeDeptId: val.receiveDept /* 执行部门 代码（发药药房） */,
              additionalFeeFlag: null /* 附加费标志（譬如说煎药费，耗材费） */,
              relOrderChargeDetailId: null, // 关联医嘱费用明细ID
              thirdPartyOrderChargeTradeSerialNum: null, // 第三方医嘱费用交易序列号
              pharmacyExecFlag: null
            });
            obj[val.recipeId] = true;
          }
        }
      });
    },
    authCodeBlur(val) {
      if (!val) {
        return;
      }
      let zfbTestStr = /^(28)\d{16}$/;
      if (zfbTestStr.test(val)) {
        // this.payType = 'a306c0f787a34a44969e5e3309e8f04f';
        let data = this.payTypeListShow.filter(item => {
          return item.payTypeCode == "alipay_barcode";
        });
        if (data.length) {
          this.payType = data[0].payTypeId;
        }
        return;
      }
      let wxTestStr = /^(10|11|12|13|14|15)\d{16}$/;
      if (wxTestStr.test(val)) {
        // this.payType = '23ab052f2be14fafb88859ae4e6bd5a6';
        let data = this.payTypeListShow.filter(item => {
          return item.payTypeCode == "wxpay_barcode";
        });
        if (data.length) {
          this.payType = data[0].payTypeId;
        }
        return;
      }
    },
    blurSubmit(val) {
      this.authCodeBlur(val);
      this.submitRegister();
    },
    sidetailTableClose() {
      this.sidetailTableVisible = false;
    },
    // 
    closePrintSeterFuc(name) {
      this.printNameseterVisible = false;
      if(name === "用药标签") {
        this.printLabelFuc(name);
      } else if(name === "收费发票") {
        this.printReceipt(name);
      } else if(name === "热敏凭证") {
        this.printElectronicReceipt(name);
      }
    },
    async getCurrentBillType(paramData) {
      try {
        let params = {
          pageNo: paramData.pageNo,
          pageSize: paramData.pageSize,
          cataCode: '0000'
        }
        let res = await finDictionaryService.getDictionaryPOsByPage(params);
        if(res.code == 1) {
          let finData = res.data;
          let total = res.total;
          let flag = false;
          for(let i in finData) {
            if(finData[i].dictionaryCode === "0013") {
              this.billType = finData[i].dictionaryValue;
              flag = true;
              return;
            }
          }
          if(paramData.pageNo * paramData.pageSize >= total) {
            flag = true;
          }
          if (!flag) {
            await this.getCurrentBillType({pageNo: paramData.pageNo + 1, pageSize: paramData.pageSize});
          }
        }
      } catch (error) {

      }
    },
  }
};
</script>
<style lang="scss" scoped>
.chare-box {
  position: relative;
  // min-height: 372.6px;
  padding: 16px;
  // padding-bottom: 56px;

  .chare-box-content{
   height: calc(100% - 46px);
   overflow-y: auto;
  }
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom:36px;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .bottom {
    display: flex;
    margin-top: 8px;
    margin-bottom:20px;
    .title {
      font-size: 16px;
      font-weight: bold;
    }

    .left {
      flex: 1;
      border-right: 1px solid #ccc;
      padding: 16px;
      padding-left: 0;
      padding-top: 0;
      .self-charge {
        font-size: 16px;
      }
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        div {
          flex: 1;
          height: 32px;
          margin-left: 16px;
          background-color: #f5f7fa;
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          color: #c0c4cc;
          padding: 0 8px;
          display: flex;
          align-items: center;
          color: rgb(240, 90, 35);
          font-weight: bold;
        }
      }
    }

    .right {
      flex: 1;
      padding: 16px;
      padding-top: 0;

      .item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .valueArea {
          flex: 1;
          height: 32px;
          margin-left: 16px;
          background-color: #f5f7fa;
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          color: #c0c4cc;
          padding: 0 8px;
          display: flex;
          align-items: center;
          color: rgb(240, 90, 35);
          font-weight: bold;
        }
      }
    }
  }
}

.bottom-info {
  width: 100%;
  background: rgba(246, 246, 246, 1);
  border-radius: 2px;
  margin-top: 10px;
  font-size: $l-font-size;
  // color: #949da3;
  color: #606266;
  font-weight: 700;
  text-align: left;
  padding-bottom: 10px;

  .el-col {
    line-height: 36px;
  }

  span {
    margin-left: 10px;

    .font {
      font-weight: $l-font-weight;
      color: #2e323a;
      // font-family: DINPro-Bold;
      font-size: 16px;
      margin-left: 5px;
    }
  }

  /deep/ .el-input {
    width: 100px;
    color: black;
  }
}

.payTitle {
  font-weight: $l-font-weight;
  font-size: 16px;
  font-weight: bold;
}

.payType {
  width: 100%;
}

.mar-top-10 {
  margin-top: 10px;
}

.mar-top-20 {
  margin-top: 20px;
}

.button-footer {
  position: absolute;
  bottom: 16px;
  left: 0;
  width: 100%;
  padding-right: 16px;
  text-align: right;
}

.radio-item {
  height: 48px;
  padding: 0 20px;
  border-radius: 2px;
  border: 1px solid $l-color-bgcolor-11;
  line-height: 48px;
  margin-bottom: 10px;
  .balance {
    font-style: normal;
    font-size: $l-font-size;
    font-family: $l-font-familySC-regular;
    font-weight: 400;
    color: $l-color-fontcolor-4;
  }

  .el-radio__label {
    display: none;
  }
}

.pay-type {
  margin-right: 0 !important;
}

.pay-zp {
  margin-bottom: -10px;
  .no-bottom .l-input-wrap{
    margin-bottom: 0;
  }
  .l-input-wrap {
    margin-bottom: 10px;
  }
}

.pay-radio {
  /deep/ .el-radio__input {
    float: right;
    margin-top: 4px;
  }
}
</style>
