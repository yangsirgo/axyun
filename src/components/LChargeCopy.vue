<template>
  <div class="width100 height100 chare-box" v-loading="loading">
    <el-table :data="newTable" style="width: 100%" border>
      <el-table-column prop="classCode" label="收费项目" header-align="center">
        <template slot-scope="scope">
           <span>{{scope.row['className']}}</span>
          <!-- <span :val="scope.row['classCode']" code="FinClassCode" v-codeTransform v-if="scope.row['classCode'] !== ''"></span>
          <span v-else>{{ scope.row["classCode"] }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="totalMoney" label="金额（元）" header-align="center" align="right">
        <template slot-scope="scope">
          <span>{{
            typeof scope.row["totalMoney"] === "number"
              ? scope.row["totalMoney"].toFixed(2)
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="classCode" label="收费项目" header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row['classCode2']}}</span>
         <!-- <span :val="scope.row['classCode2']" code="FinClassCode" v-codeTransform v-if="scope.row['classCode2'] !== ''"></span>
          <span v-else>{{ scope.row["classCode2"] }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="totalMoney" label="金额（元）" header-align="center" align="right">
        <template slot-scope="scope">
          <span>{{
            typeof scope.row["totalMoney2"] === "number"
              ? scope.row["totalMoney2"].toFixed(2)
              : ""
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <span class="payTitle">请选择支付方式</span>
    <div class="pay-type-list">
      <el-form class="mar-top-10" :model="form" ref="ruleForm">
        <el-form-item label-width="0">
          <el-row class="pay-type">
            <el-col :span="12" class="margin10" v-for="item in payTypeListShow" :key="item.payTypeId">
              <el-row class="radio-item">
                <el-col :span="24">
                  <el-radio class="pay-radio" v-model="payType" :label="item.payTypeId" style="width: 100%" @change="payTypeChange"
                    :disabled="moneyEnough||radioDisabled">
                    <span style="
                        display: inline-block;
                        vertical-align: sub;
                        margin-right: 10px;
                      ">
                      <svg t="1568712240954" class="icon" viewBox="0 0 1137 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="8446" width="20" height="20">
                        <path d="M113.777778 0h910.222222a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m512 341.333333H512V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777778H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777777a56.888889 56.888889 0 0 0 113.777778 0v-113.777777h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-170.666666V455.111111h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-56.888888V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777z"
                          fill="#38A79C" p-id="8447" />
                      </svg>
                    </span>
                    {{ item.payTypeName }}
                  </el-radio>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row class="pay-zp" :span="10" v-if="isBank">
          <el-col>
            <el-form-item prop="companyName" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
              <LFormtTitle label="单位名称" :required="true">
                <el-input v-model="form.companyName" placeholder="请输入内容" clearable></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="bankName" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
              <LFormtTitle label="开户银行" :required="true">
                <el-input v-model="form.bankName" placeholder="请输入内容" clearable></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="bankAccount" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
              <LFormtTitle label="银行账号" :required="true">
                <el-input v-model="form.bankAccount" placeholder="请输入内容" clearable></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="checkNum" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
              <LFormtTitle label="票号" :required="true">
                <el-input v-model="form.checkNum" placeholder="请输入内容" clearable></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 10px">
        <LFormtTitle label="付款码">
          <el-input v-model="authCode"></el-input>
        </LFormtTitle>
      </div>
      <div class="bottom-info">
        <el-row>
          <el-col :span="6" class="mar-top-10">
            <span>
              总费用
              <span class="font">{{
                chargeObj.feeAmount.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              记账金额
              <span class="font">{{
                chargeObj.freePayMoney.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              减免金额
              <span class="font">{{
                chargeObj.derateAmount.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
          <el-col :span="6" class="mar-top-10">
            <span>
              自付金额
              <span class="font">{{
                chargeObj.selfPayMoney.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
        </el-row>
        <!-- <el-row v-if="hasAcc">
          <el-col :span="8" class="mar-top-10">
            <span>
              预存账户余额
              <span class="font">{{
                accountInfo.balanceMoney.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
          <el-col :span="8" class="mar-top-10">
            <span>
              授权透支金额
              <span class="font">{{
                accountInfo.grantOverdrawMoney.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
          <el-col :span="8" class="mar-top-10">
            <span>
              预存账户可用金额
              <span class="font">{{
                accountInfo.prestoreUseMoney.toFixed(2) || "0.00"
              }}</span>
            </span>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="8" class="mar-top-10">
            <span>实收金额</span>
            <el-input v-model="realGet" class="margin-left-6" @change="getBackMoney" :disabled="
                permitChargeFlag === '1'
                  ? chargeObj.selfPayMoney <= accountInfo.prestoreUseMoney
                  : true
              "></el-input>
            <!-- 可用余额比自付金额多时，不用编辑实收金额 -->
            <p style="color: #f05a23; padding-left: 78px">{{ warning }}</p>
          </el-col>
          <el-col :span="8" class="mar-top-10" v-if="permitChangeFlag == '1'">
            <span>抹零金额
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
    <div class="button-footer">
      <el-button type="primary" :disabled="warning != ''" @click="submitRegister">确定收费</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </div>
</template>
<script>
  import appointment from "@/api/appointment/appointment";
  import service from "@/api/financeManagement/inp.js";
  import NP from "number-precision";
  import {
    print,
    preview,
    onPreview,
    getMacLoaction
  } from "@/utils/print";
  import service2 from "@/api/cis/receiptPrint/receiptPrint";

  export default {
    name: "LCharge",
    props: {
      charge: {
        type: Object,
        defalut: {},
      },
      // true 预约预结算， false 门诊预结算
      isApptointment: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        radioDisabled:true,
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
        // obj: {
        //   appointment: {}, // 预约明细
        //   chargePrescriptions: [], // 待收费明细，
        //   accountDataVersion: "" // 账户dataVersion
        // },
        // 支票交易需要填写的信息
        form: {
          companyName: "",
          bankName: "",
          bankAccount: "",
          checkNum: "",
          depositBank: "",
          recordRemark: "",
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
          finClassVOs: [],
        },
        // 患者账户信息
        accountInfo: {
          balanceMoney: 0, // 预存账户金额
          grantOverdrawMoney: 0, // 授权透支金额
          prestoreUseMoney: 0, // 预存账户可用金额
        }, // 此处结算是否计算 账户余额+授权透支金额 = 可用余额 用于支付
        isBank: false,
        permitChargeFlag: "0",
        permitChangeFlag: "0", //当前支付方式抹零标志
        unChargeSmallChange: 0, //抹零金额
        authCode: "", //付款码
        // 新功能-收费成功自动打印
        nextReceiptNumOutPO: {},
        // 本机主MAC地址
        currentMac: '',
        receiptContent: {}, //打印数据
        receiptType:'',//票据类型
      };
    },
    computed: {
      newTable() {
        let list = [];
        // 明细表格展示修改，一行显示2列数据，偶数行左侧，奇数在右侧
        this.chargeObj.finClassVOs.forEach((item, index) => {
          if (index % 2 === 0) {
            let spanInfo = {
              ...this.chargeObj.finClassVOs[index],
              classCode2: "",
              totalMoney2: "",
            };
            let nextInfo = this.chargeObj.finClassVOs[index + 1];
            if (nextInfo) {
              spanInfo.classCode2 = nextInfo.className;
              spanInfo.totalMoney2 = nextInfo.totalMoney;
            }
            list.push(spanInfo);
          }
        });
        console.log(list,"打印收费的表格的数据")
        return list;
      },
      hasAcc() {
        // 支付列表中是否含有余额支付
        const item = this.payTypeList.find(
          (item) => item.payTypeClassCode === "prestore"
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
        return this.accountInfo.prestoreUseMoney > 0 ?
          this.accountInfo.prestoreUseMoney :
          0;
      },
    },
    watch: {
      // realGet: {
      //   handler(val) {
      //     this.realGet = val;
      //     this.getBackMoney();
      //     if(this.payType !== "" || this.payType !== undefined) {
      //       this.payTypeChange(this.payType);
      //     }
      //   },
      // },
    },
    mounted() {
      // this.getPatientAccount();
      this.preSettlementNew();
      this.getPayTypeByAuth();
      this.getDictionaryPO();
    },
    methods: {
      async getDictionaryPO() {
        try {
          let res = await service2.getDictionaryPO({
            itemCode:'F0016',
            valueCode:'00'
          });
          if(res.code == 1){
            this.receiptType = res.data.dictionaryValue;
          }
        }catch(error){
          this.$message.error(error.msg || '获取票据类型失败');
        }
      },
      // 获取下一张票据号
      async getNextReceiptNum() {
        try {
          this.nextReceiptNumOutPO = {};

          if (!this.currentMac) {
            let mac = {
              value: ''
            };
            getMacLoaction(mac).then(async (res2) => {
              this.currentMac = res2;
              let res = await service2.getNextReceiptNum({
                receiptType: this.receiptType,
                useMacLoaction: this.currentMac || undefined
              });
              if (!res.data) {
                this.$message.error("未找到当前登录人的领用票据信息");
                return;
              }
              this.nextReceiptNumOutPO = res.data;
              this.printReceipt();
            }).catch(() => {

            });
          } else {
            let res = await service2.getNextReceiptNum({
              receiptType: this.receiptType,
              useMacLoaction: this.currentMac || undefined
            });
            if (!res.data) {
              this.$message.error("未找到当前登录人的领用票据信息");
              return;
            }
            this.nextReceiptNumOutPO = res.data;
          }
        } catch (error) {
          console.info(error);
          this.$message.error(error.msg || "获取下一张票据号失败");
        }
      },
      // 票据打印
      async printReceipt() {
        try {
          if (!this.nextReceiptNumOutPO.receiptNum) {
            this.$message.error("当前票据号为空");
            return;
          }
          this.$showLoading();
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
          // debugger;
          this.handlePrintData();
          this.$hideLoading();
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "打印票据失败");
        }
      },
      //处理打印数据
      async handlePrintData() {
        let printTimeYear = this.receiptContent.printTime ?
          this.receiptContent.printTime.split("-")[0] :
          "";
        let printTimeMon = this.receiptContent.printTime ?
          this.receiptContent.printTime.split("-")[1] :
          "";
        let printTimeDay = this.receiptContent.printTime ?
          this.receiptContent.printTime.split("-")[2].split(" ")[0] :
          "";
        let printData = {
          siCardNum: this.receiptContent.siCardNum || "",
          businessTradeCode: this.receiptContent.businessTradeCode || this.receiptContent.serialNumber || "",
          orgType: this.receiptContent.orgType || "",
          inpCode: this.receiptContent.inpCode || "",
          emrCode: this.receiptContent.emrCode || "",
          inDays: this.receiptContent.inDays || "",
          receiptNum: this.receiptContent.receiptNum || this.receiptNum || "",
          patientName: this.receiptContent.patientName || "",
          companyName: this.receiptContent.companyName || this.receiptContent.settlementTypeName || "",
          socialSecurityNum: this.receiptContent.socialSecurityNum || "",
          createdBy: this.receiptContent.createdBy || "",
          createdByName: this.receiptContent.createdByName || "",
          sdeptName: this.receiptContent.sdeptName || "",
          hospitalType: this.receiptContent.hospitalType || "",
          createdAt: this.receiptContent.createdAt || "",
          prepayReceiptCount: this.receiptContent.prepayReceiptCount || "0",
          reCheckUserName: this.receiptContent.reCheckUserName || "0",
          chargeUserName: this.receiptContent.chargeUserName || "0",
          chargeUnitName: this.receiptContent.chargeUnitName || "0",
          settlementTypeName: this.receiptContent.settlementTypeName || this.receiptContent.companyName || "",
          totalAmt: this.formatNumber(this.receiptContent.actualTotalPayMoney) || this.formatNumber(this.receiptContent.totalAmount) || this.formatNumber(this.receiptContent.totalAmt) || "0.00",
          selfPayPrepay: this.formatNumber(this.receiptContent.selfPayMoney) || "0.00",
          paymentAmount: this.formatNumber(this.receiptContent.paymentAmount) || "0.00",
          refundAmount: this.formatNumber(this.receiptContent.refundAmount) || "0.00",
          freePayAmount: this.formatNumber(this.receiptContent.freePayAmount) || "0.00",
          selfPayAmount: this.formatNumber(this.receiptContent.actualSelfPayMoney) || this.formatNumber(this.receiptContent.selfPayAmount) || "0.00",
          deratePayAmount: this.formatNumber(this.receiptContent.deratePayAmount) || "0.00",
          cashChangeAmt: this.formatNumber(this.receiptContent.cashChangeAmt) || "0.00",
          RMB: this.changeRMB(this.receiptContent.actualTotalPayMoney) || this.changeRMB(this.receiptContent.totalAmount) || this.changeRMB(this.receiptContent.totalAmt) || "零拾零万零仟零佰零拾零元零角零分",
          remainedDepositAmt: this.formatNumber(this.receiptContent.remainedDepositAmt) || "0.00",
          remainedCreditAmt: this.formatNumber(this.receiptContent.remainedCreditAmt) || "0.00",
          printTimeYear: printTimeYear,
          printTimeMon: printTimeMon,
          printTimeDay: printTimeDay
        };
        if (this.receiptContent.patientGenderCode === "1") {
          printData.patientGender = [{
            "content": "男",
            "check": "checked"
          }, {
            "content": "女"
          }];
        }
        if (this.receiptContent.patientGenderCode === "2") {
          printData.patientGender = [{
            "content": "男"
          }, {
            "content": "女",
            "check": "checked"
          }];
        }
        if (this.receiptContent.clinicType === "1") {
          printData.clinicType = [{
            "content": "门诊",
            "check": "checked"
          }, {
            "content": "急诊"
          }, {
            "content": "住院"
          }];
        } else if (this.receiptContent.clinicType === "3") {
          printData.clinicType = [{
            "content": "门诊"
          }, {
            "content": "急诊"
          }, {
            "content": "住院",
            "check": "checked"
          }];
          printData.startTime = this.dayjs(this.receiptContent.startTime).format("YYYY-MM-DD") || "";
          printData.stopTime = this.dayjs(this.receiptContent.stopTime).format("YYYY-MM-DD") || "";
        } else if (this.receiptContent.clinicType === "2") {
          printData.clinicType = [{
            "content": "门诊"
          }, {
            "content": "急诊",
            "check": "checked"
          }, {
            "content": "住院"
          }];
        }

        let drugFeeClassInfos = this.receiptContent.drugOutpFeeClassSumInfo || [];
        let examFeeClassInfos = this.receiptContent.examOutpFeeClassSumInfo || [];
        let treatFeeClassInfos = this.receiptContent.treatOutpFeeClassSumInfo || [];
        let otherFeeClassInfos = this.receiptContent.otherOutpFeeClassSumInfo || [];
        let arr = [];
        let len = Math.max(drugFeeClassInfos.length, examFeeClassInfos.length, treatFeeClassInfos.length,
          otherFeeClassInfos.length);
        for (let i = 0; i < len; i++) {
          let obj = {};
          obj = {
            className1: "",
            chargeAmount1: "",
            className2: "",
            chargeAmount2: "",
            className3: "",
            chargeAmount3: "",
            className4: "",
            chargeAmount4: ""
          }
          if (typeof drugFeeClassInfos !== "undefined" && typeof drugFeeClassInfos[i] !== "undefined") {
            obj.className1 = drugFeeClassInfos[i].finClassName || "";
            obj.chargeAmount1 = this.formatNumber(drugFeeClassInfos[i].totalAmt) || "0.00";

          }
          if (typeof examFeeClassInfos !== "undefined" && typeof examFeeClassInfos[i] !== "undefined") {
            obj.className2 = examFeeClassInfos[i].finClassName || "";
            obj.chargeAmount2 = this.formatNumber(examFeeClassInfos[i].totalAmt) || "0.00";
          }
          if (typeof treatFeeClassInfos !== "undefined" && typeof treatFeeClassInfos[i] !== "undefined") {
            obj.className3 = treatFeeClassInfos[i].finClassName || "";
            obj.chargeAmount3 = this.formatNumber(treatFeeClassInfos[i].totalAmt) || "0.00";
          }
          if (typeof otherFeeClassInfos !== "undefined" && typeof otherFeeClassInfos[i] !== "undefined") {
            obj.className4 = otherFeeClassInfos[i].finClassName || "";
            obj.chargeAmount4 = this.formatNumber(otherFeeClassInfos[i].totalAmt) || "0.00";
          }
          arr.push(obj);
        }
        printData.inBillsData = arr;
        console.info(printData);
        if(this.receiptContent.clinicType === "1"){
          if(printData.cashChangeAmt === "0.00"){
            onPreview(printData, "广东省医疗收费票据1");
          }else{
            onPreview(printData, "广东省医疗收费票据");
          }
        }else{
          onPreview(printData, "广东省医疗收费票据住院专用");
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
        if (isNaN(amount) || amount >= 1000000) return "无效金额！";  //数值最大不超过100万
        let sPrefix = amount < 0 ? "(负)" : "";                             //将负号‘-’显示成汉字‘(负)’
        let sAmount = Math.abs(amount).toFixed(2);                          //格式化成两位小数格式（两位小数对应“'角”和“分”）
        let sUnit = '拾万仟佰拾元角分';
        let sCapital = '零壹贰叁肆伍陆柒捌玖';                              //10个大写数字
        sAmount = sAmount.replace(".", "");                                 //去除小数点（使数字与权位对应）
        let str = '';
        if(sAmount.length < sUnit.length){
          for(let i = 0, len = sUnit.length - sAmount.length; i < len; i++) {               //拼接数字与权位单位
            str += "" + "0";
          }
        }
        sAmount = str + sAmount;
        console.info(sAmount);
        let sOutput = "";
        for (let i = 0, len = sAmount.length; i < len; i++) {               //拼接数字与权位单位
          sOutput += sCapital.substr(sAmount.substr(i, 1), 1) + sUnit.substr(i, 1);
        }
        return sPrefix + sOutput;
      },
      // 新功能：收费成功后自动打印-end
      // 查询支付方式
      getPayTypeByAuth() {
        this.$showLoading();
        service
          .getPayTypeByAuth({
            businessCode: "00",
          })
          .then((res) => {
            if (res.code === 1) {
              this.payTypeList = res.data;
              // 支付方式列表（过滤掉余额支付）
              // 因为预存账户里面如果有余额的话，肯定是要用的，不需要用户选择。如果预存账户余额不足，才需要选择其他的支付方式
              const list = res.data.filter(
                (item) => item.payTypeClassCode !== "prestore"
              );
              this.payTypeListShow = list;
            } else {
              this.$message.error(res.msg || "获取支付方式失败");
            }
            this.$hideLoading();
          })
          .catch((error) => {
            this.$hideLoading();
            this.$message.error(error.msg || "获取支付方式失败");
          });
      },


      // 计算找零
      getBackMoney() {
        // 验证
        let rule = /^(\d*)(\d*)(\.\d{1,2})?$/;
        if (rule.test(this.realGet) === false) {
          this.warning = "只能输入数字或两位小数";
          return;
        } else if (this.realGet && this.realGet.toString().indexOf(".") == 0) {
          this.warning = "只能输入数字或两位小数";
          return;
        } else if (this.realGet.toString().length > 10) {
          this.warning = "只能输入十位数字";
          return;
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
        // 现金支付的时候实付金额只能输入到小数点后一位数
        if(this.permitChargeFlag === '1'){
          let  len  = this.realGet.length == '1' ? 0:this.realGet.split(".")[1].length;
          if(len >1){
            this.realGet = this.realGet.substr(0,this.realGet.length-1);
          }
        }
      },
      // 选择支付方式
      payTypeChange(data) {
        console.log(data);
        this.payTypeList.forEach((val) => {
          if (data == val.payTypeId) {
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
        if (!this.moneyEnough) {
          if (this.payType === "") {
            this.$message.warning("请选择支付方式");
            return;
          }
          if ((this.payTypeClassCode === "alipay" || this.payTypeClassCode === "wxpay") && this.authCode == "") {
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
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            // 付款金额大于余额时需要选择支付方式，并支付扣除余额部分的钱。小于等于时直接用余额里的钱支付
            const flag =
              this.chargeObj.selfPayMoney > this.accountInfo.prestoreUseMoney;
            let list = [];
            if (this.hasAcc && this.accountInfo.prestoreUseMoney > 0) {
              list.push({
                payTypeId: this.hasAcc.payTypeId,
                settleAmt: flag ?
                  this.accountInfo.prestoreUseMoney :
                  this.chargeObj.selfPayMoney,
              });
            }
            if (flag) {
              let item = {
                payTypeId: this.payType,
                authCode: this.authCode,
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
                  ...this.form,
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
            appointment.settlementNew(params).then(async (res) => {
                if (res.code === 1) {
                  this.$message({
                    message: "收费成功",
                    type: "success"
                  });
                  this.$emit("close", {
                    refresh: true
                  });
                  if (params.outTradeSettleAmtDetailVO2s.length !== 0) {
                    //添加新功能，收费成功后自动打印
                    await this.getNextReceiptNum();
                  }
                  //添加新功能，收费成功后自动打印-end
                } else {
                  this.$message.error(res.msg || "收费失败");
                }
                this.loading = false;
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.msg || "收费失败");
              });
          }
        });
      },
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
          this.$message.error(error.msg || "结算失败");
        }
      },
      // 门诊预结算
      async outpatientSettlement() {
        try {
          /* const list = this.charge.chargePrescriptions.map(item => ({
            // 医嘱id
            orderId: item.orderId,
            //收费项目id
            chargeItemId: item.chargeItemId,
            // 单位
            chargeUnit: item.chargeUnit,
            // 单价
            chargePrice: item.chargePrice,
            // 审批标志
            chargeApprove: item.chargeApprove,
            // 组号 如果是申请单，则为申请单id；如果是处方，则为处方中药品组id。 其他为空
            groupNum: item.groupNum,
            // 医嘱项目编号
            orderItemNum: item.orderItemNum,
            // 第三方提供，用于表示某一具体费用明细
            thirdPartyChargeTradeSerialNum: item.thirdPartyChargeTradeSerialNum,
            // 医嘱天数
            orderDay: item.orderDay,
            // 是否自愿自费。 0 否。 1 是。
            willingSelfPay: item.willingSelfPay,
            //
            producePlaceId: item.producePlaceId,
            // 规格
            spec: item.spec,
            // 包装量
            packQuantity: item.packQuantity,
            // 包装单位
            packUnit: item.packUnit,
            // 频次
            drugFrequency: item.drugFrequency,
            // 途径
            drugApproach: item.drugApproach,
            // 剂量
            drugDosage: item.drugDosage,
            // 剂量单位
            dosageUnit: item.dosageUnit,
            // 用量
            useLevel: item.useLevel,
            // 用量单位
            useLevelUnit: item.useLevelUnit,
            // 剂型
            dosageType: item.dosageType,
            // 用法
            drugUsage: item.drugUsage,
            // 皮试
            skinTest: item.skinTest,
            // 可用天数
            enableDay: item.enableDay,
            // 控制级别（甲乙丙类）
            controlLevel: item.controlLevel,
            // 药品是否可拆分 1 是。 2 否。
            unitSaleFlg: item.unitSaleFlg,
            // 医嘱收费项目数量 * 医嘱数量 = 收费数量
            orderChargeItemQuantity: item.orderChargeItemQuantity,
            pharmacyExecFlag: item.pharmacyExecFlag
          })); */
          const params = {
            // 患者id
            patientId: this.charge.appointment.patientId,
            // 结算类型
            // settlementType: this.charge.appointment.settlementType,暂时都传1
            settlementType: '1',
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
          };
          if (!params.diagTreatActivityId) {
            params.diagTreatActivityId = this.charge.appointment.visitCode;
          }
          this.$showLoading();
          let res = await appointment.preSettlementNew(params);
          this.$hideLoading();
          if (res.code === 1) {
            // 预结算返回对象赋值
            this.chargeObj = { ...res.data
            };
            this.radioDisabled = false;
            // 计算实收金额
            // const m =
            //   (res.data.selfPayMoney * 100 - this.hasPreMoney * 100) / 100;

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
            settlementType: '1',
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
            haveMoney: this.charge.haveMoney === undefined ? "" : this.charge.haveMoney,
            freeCode: this.charge.freeCode === undefined ? "" : this.charge.freeCode,
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
      // 预结算
      preSettlementNew() {
        if (this.isApptointment) {
          // 预约预结算
          this.appointmentSettlement();
        } else {
          // 门诊预结算
          this.outpatientSettlement();
        }
      },
      // 根据待收费明细得到 门诊医嘱明细   （小问题 待解决 20200413）
      getOutpOrderChargeDetailVO2(chargePrescriptions) {
        let obj = {};
        let list = [];
        chargePrescriptions.forEach((val) => {
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
                orderTime: null /* 医嘱时间 */ ,
                orderBillId: val.recipeId /* 申请单ID/处方ID */ ,
                orderBillNum: val.recipeCode /* 申请单号/处方号 */ ,
                executeDeptId: val.receiveDept /* 执行部门 代码（发药药房） */ ,
                additionalFeeFlag: null /* 附加费标志（譬如说煎药费，耗材费） */ ,
                relOrderChargeDetailId: null, // 关联医嘱费用明细ID
                thirdPartyOrderChargeTradeSerialNum: null, // 第三方医嘱费用交易序列号
                pharmacyExecFlag: null,
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
                orderTime: null /* 医嘱时间 */ ,
                orderBillId: val.recipeId /* 申请单ID/处方ID */ ,
                orderBillNum: val.recipeCode /* 申请单号/处方号 */ ,
                executeDeptId: val.receiveDept /* 执行部门 代码（发药药房） */ ,
                additionalFeeFlag: null /* 附加费标志（譬如说煎药费，耗材费） */ ,
                relOrderChargeDetailId: null, // 关联医嘱费用明细ID
                thirdPartyOrderChargeTradeSerialNum: null, // 第三方医嘱费用交易序列号
                pharmacyExecFlag: null,
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
                orderTime: null /* 医嘱时间 */ ,
                orderBillId: val.recipeId /* 申请单ID/处方ID */ ,
                orderBillNum: val.recipeCode /* 申请单号/处方号 */ ,
                executeDeptId: val.receiveDept /* 执行部门 代码（发药药房） */ ,
                additionalFeeFlag: null /* 附加费标志（譬如说煎药费，耗材费） */ ,
                relOrderChargeDetailId: null, // 关联医嘱费用明细ID
                thirdPartyOrderChargeTradeSerialNum: null, // 第三方医嘱费用交易序列号
                pharmacyExecFlag: null,
              });
              obj[val.recipeId] = true;
            }
          }
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .chare-box {
    position: relative;
    min-height: 372.6px;
    padding: 10px;
    padding-bottom: 56px;
  }

  .bottom-info {
    width: 100%;
    background: rgba(246, 246, 246, 1);
    border-radius: 2px;
    margin-top: 10px;
    font-size: $l-font-size;
    color: #949da3;
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

    .el-input {
      width: 100px;
    }
  }

  .payTitle {
    font-weight: $l-font-weight;
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
    bottom: 10px;
    left: 0;
    width: 100%;
    padding-right: 10px;
    text-align: right;
  }

  .radio-item {
    height: 48px;
    padding: 0 20px;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;
    line-height: 48px;

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
    .el-col {
      padding: 0 5px !important;
    }
  }

  .pay-zp {
    margin-top: 10px;

    .l-input-wrap {
      margin-bottom: 20px;
    }
  }

  .pay-radio {
    /deep/ .el-radio__input {
      float: right;
      margin-top: 4px;
    }
  }
</style>
