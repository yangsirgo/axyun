<template>
  <div class="outpOperatorDailyReport height100" v-loading="loading">
    <div class="outpatientDailyReport-cont">
      <div class="nav-bar">
        <el-row :gutter="10">
          <el-col :span="9">
            <l-formt-title label="日期">
              <el-date-picker
                clearable
                v-model="searchValue.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="操作人员">
              <l-value-domain
                clearable
                :value.sync="searchValue.chargeUserId"
                remoteUrl="/user/page"
                :remoteParams="remoteParams"
                remoteShowKey="name"
                remoteValueKey="id"
                placeholder="请选择操作人员"
                @change="roleChange"
              />
            </l-formt-title>
          </el-col>
          <el-col :span="9">
            <div class="float-right">
              <el-button type="primary" @click="getData">查询</el-button>
              <el-button
                type="primary"
                class="plain-btn"
                plain
                @click="printData"
                >打印</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-html="conts"></div>
    </div>
  </div>
</template>
<script>
import service from "@/api/financeManagement/reportForms.js";
import { onPreview, onPreviewStr } from "@/utils/print";
export default {
  name: "outpOperatorDailyReport",
  props: {
    reportData: {
      type: Object,
      defalut: {
        inpCode: "1",
        flag: "1", // 1 住院费用日清单报表 2 住院费用汇总
      },
    },
  },

  data() {
    return {
      remoteParams: {
        pageSize: 210,
        page: 1,
        orderBy: "updated_at desc",
      },
      searchValue: {
        date: [
          new Date().format("yyyy-MM-dd"),
          new Date().format("yyyy-MM-dd"),
        ],
        userId: ""
      },
      loading: false,
      printObj: {},
      conts: "",
      receiptContent: {},
    };
  },
  async mounted() {
    let obj = await onPreviewStr(
      { title: "门诊收费员日报表" },
      "门诊收费员日报表"
    );
    this.conts = obj.str;
  },
  methods: {
    roleChange(data, obj) {
      console.info(obj);
      console.info(data);
      if (obj) {
        this.searchValue.userId = obj.id;
      } else {
        this.searchValue.userId = "";
      }
    },
    async getData() {
      try {
        this.$showLoading();
        let startTime = this.searchValue.date.length
          ? this.searchValue.date[0] + " 00:00:00"
          : "";
        let endTime = this.searchValue.date.length
          ? this.searchValue.date[1] + " 23:59:59"
          : "";
        let params = {
          startTime: startTime,
          endTime: endTime,
          userId: this.searchValue.userId
        };
        let res = await service.getOutpOperatorDailyReport(params);
        if (res.code == 1) {
          let printData = await this.handleData(res.data);
          console.log("门诊收费员日报表",printData);
          printData.title = "门诊收费员日报表";
          let obj = await onPreviewStr(printData, "门诊收费员日报表");
          this.conts = obj.str;
        } else {
          this.$message.error(res.msg);
        }
        this.$hideLoading();
      } catch (e) {
        console.info(e);
        this.$hideLoading();
        this.$message.error(e.msg);
      }
    },
    changeRMB(n) {
      var fraction = ["角", "分"];
      var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      var unit = [
        ["元", "万", "亿"],
        ["", "拾", "佰", "仟"]
      ];
      var IsNum = Number(n);
      if (!isNaN(IsNum)) {
        var head = n < 0 ? "欠" : "";
        n = Math.abs(n);
        var s = "";
        for (let i = 0; i < fraction.length; i++) {
          s += (
            digit[Math.floor(((n * 100) / 10) * Math.pow(10, i)) % 10] +
            fraction[i]
          ).replace(/零./, "");
        }
        s = s || "整";
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
          var p = "";
          for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
        }
        return (
          head +
          s
            .replace(/(零.)*零元/, "元")
            .replace(/(零.)+/g, "零")
            .replace(/^整$/, "零元整")
        );
      }
      return "";
    },
    // 整理数据
    handleData(obj) {
      let objStr = {};
      objStr.startDate = obj.startDate;
      objStr.endDate = obj.endDate;
      objStr.chargeUserNames = obj.chargeUserNames;
      objStr.invoiceNumberInfos = obj.invoiceNumberInfos;
      objStr.invoiceQuantity = obj.invoiceQuantity;
      objStr.listTime = obj.listTime;
      objStr.lister = obj.lister;
      objStr.orgName = obj.orgName;
      objStr.reCheckUserName = obj.reCheckUserName;
      objStr.reCheckUserName = obj.reCheckUserName;
      objStr.siPayInfos = obj.siPayInfos;
      objStr.cancelInvoiceNum = obj.cancelInvoiceNum;
      objStr.cancelInvoiceNumberInfos = obj.cancelInvoiceNumberInfos;
      objStr.cancelInvoiceAmt = this.outputmoney(obj.cancelInvoiceAmt);
      objStr.RMB = this.changeRMB(obj.totalMoney) || "零";
      objStr.totalFeeAmt = this.outputmoney(obj.totalFeeAmt);
      objStr.totalPayAmt = this.outputmoney(obj.totalMoney);
      let chargeDetailSumInfos = obj.lenderList;
      objStr.payName0 = "";
      objStr.payName1 = "";
      objStr.payName2 = "";
      objStr.payName3 = "";
      objStr.payName4 = "";
      objStr.payName5 = "";
      objStr.payName6 = "";
      objStr.payName7 = "";
      objStr.payName8 = "";
      objStr.payName9 = "";
      objStr.payName10 = "";
      objStr.payName11 = "";
      objStr.payName12 = "";
      objStr.payName13 = "";
      objStr.payName14 = "";
      objStr.payAmt0 = "";
      objStr.payAmt1 = "";
      objStr.payAmt2 = "";
      objStr.payAmt3 = "";
      objStr.payAmt4 = "";
      objStr.payAmt5 = "";
      objStr.payAmt6 = "";
      objStr.payAmt7 = "";
      objStr.payAmt8 = "";
      objStr.payAmt9 = "";
      objStr.payAmt10 = "";
      objStr.payAmt11 = "";
      objStr.payAmt12 = "";
      objStr.payAmt13 = "";
      objStr.payAmt14 = "";
      if(typeof chargeDetailSumInfos !== "undefined") {
        for (let i = 0; i < chargeDetailSumInfos.length; i++) {
          let name = chargeDetailSumInfos[i].className;
          let totalAmt = this.outputmoney(chargeDetailSumInfos[i].totalMoney);
          let vname = "payName" + i.toString();
          let vpayAmt = "payAmt" + i.toString();
          objStr[vname] = name;
          objStr[vpayAmt] = totalAmt;
        }
      }


      let settleAmountInfos = obj.debitList;
      objStr.wxpayBarcode = "0.00";
      objStr.alipayBarcode = "0.00";
      objStr.cash = "0.00";
      objStr.cheque = "0.00";
      objStr.pos = "0.00";
      objStr.currencyChange = "0.00";
      objStr.si = "0.00";
      objStr.account = "0.00";
      objStr.mobilePayment = "0.00";

      if(typeof settleAmountInfos !== "undefined") {
        for (let i = 0; i < settleAmountInfos.length; i++) {
          let code = settleAmountInfos[i].classCode;
          let payAmount = this.outputmoney(settleAmountInfos[i].totalMoney);
          switch (code) {
            case "wxpay":
              objStr.wxpayBarcode = payAmount;
              break;
            case "alipay":
              objStr.alipayBarcode = payAmount;
              break;
            case "cash":
              objStr.cash = payAmount;
              break;
            case "cheque":
              objStr.cheque = payAmount;
              break;
            case "pos":
              objStr.pos = payAmount;
              break;
            case "CurrencyChange":
              objStr.currencyChange = payAmount;
              break;
            case "Si":
              objStr.si = payAmount;
              break;
            case "Account":
              objStr.account = payAmount;
              break;
            case "mobilePayment":
              objStr.mobilePayment = payAmount;
              break;
            default:
              break;
          }
        }
      }

      console.info("OBJ",objStr);
      return objStr;
    },
    async printData() {
      try {
        this.$showLoading();
        let startDate = this.searchValue.date.length
          ? this.searchValue.date[0] + " 00:00:00"
          : "";
        let endDate = this.searchValue.date.length
          ? this.searchValue.date[1] + " 23:59:59"
          : "";
        let params = {
          startDate: startDate,
          endDate: endDate,
          chargeUserId: this.searchValue.chargeUserId,
        };
        let res = await service.getOutpOperatorDailyReport(params);
        if (res.code == 1) {
          let printData = await this.handleData(res.data);
          printData.title = "门诊收费员日报表";
          onPreview(printData, "门诊收费员日报表");
          let obj = await onPreviewStr(printData, "门诊收费员日报表");
          this.conts = obj.str;
        } else {
          this.$message.error(res.msg);
        }
        this.$hideLoading();
      } catch (e) {
        console.info(e);
        this.$hideLoading();
        this.$message.error(e.msg);
      }
    },
    //格式化金额
    outputmoney(number) {
      // number = number.replace(/\,/g, "");
      if (isNaN(number) || number == "") {
        return "0.00";
      }
      number = Math.round(number * 100) / 100;
      if (number < 0) {
        return (
          "-" +
          this.outputdollars(Math.floor(Math.abs(number) - 0) + "") +
          this.outputcents(Math.abs(number) - 0)
        );
      } else {
        return (
          this.outputdollars(Math.floor(number - 0) + "") +
          this.outputcents(number - 0)
        );
      }
    },
    outputdollars(number) {
      if (number.length <= 3) return number == "" ? "0" : number;
      else {
        var mod = number.length % 3;
        var output = mod == 0 ? "" : number.substring(0, mod);
        for (var i = 0; i < Math.floor(number.length / 3); i++) {
          if (mod == 0 && i == 0)
            output += number.substring(mod + 3 * i, mod + 3 * i + 3);
          else output += "," + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return output;
      }
    },
    outputcents(amount) {
      amount = Math.round((amount - Math.floor(amount)) * 100);
      return amount < 10 ? ".0" + amount : "." + amount;
    },
  },
};
</script>
<style lang="scss" scoped>
.outpOperatorDailyReport {
  padding: 10px;
  overflow-y: auto;
  .outpatientDailyReport-cont {
    width: 800px;
    margin-left: calc(50% - 400px);
  }
  .nav-bar {
    margin-bottom: 10px;
  }
  .receipt-cont {
    height: calc(100% - 431px);
    margin-top: 10px;
    overflow-y: auto;
    .receipt-item {
      border: 1px solid $l-color-bgcolor-11;
      margin-top: 10px;
      .border-bottom {
        border-bottom: 1px solid $l-color-bgcolor-11;
      }
      .border-left {
        border-left: 1px solid $l-color-bgcolor-11;
      }
      .receipt-item-top {
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
      }
      .padding-10 {
        padding: 0 10px;
      }
      .receipt-item-bottom {
        height: 100px;
        padding: 0 10px;
      }
    }
  }
  .plain-btn {
    width: 66px;
  }
}
</style>
