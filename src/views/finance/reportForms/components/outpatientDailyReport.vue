<template>
  <div class="outpatientDailyReport height100" v-loading="loading">
    <div class="outpatientDailyReport-cont">
      <!-- <l-card-title>
      <span slot="left">门诊收费员现金日报表</span>
      </l-card-title>-->
      <div class="nav-bar">
        <el-row :gutter="10">
          <el-col :span="9">
            <l-formt-title label="日期">
              <el-date-picker
                :clearable="false"
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
                :value.sync="searchValue.roleId"
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
              <el-button type="primary" class="plain-btn" plain @click="printData">打印</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-html="conts" class="print-cont"></div>
      <!-- <el-table
      ref="multiTable"
      :data="multiData"
      width="100%"
      height="302px"
      border
      :span-method="arraySpanMethod"
    >
      <el-table-column
        v-for="(item, index) in multiParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'left'"
        :header-align="item.headerAlign || 'left'"
        :fixed="item.fixed"
      ></el-table-column>
    </el-table>
    <div class="receipt-cont">
      <div class="receipt-item" v-for="(item,index) in receiptVOList" :key="index">
        <el-row class="border-bottom receipt-item-top">
          <el-col
            :span="4"
            class="padding-10 height100"
            style="line-height: 50px"
          >{{receiptVOListName[item.receiptType].name}}张数</el-col>
          <el-col
            :span="receiptVOListName[item.receiptType].isMoney?8:20"
            class="border-left padding-10 height100"
            style="line-height: 50px"
          >{{item.receiptCount}}</el-col>
          <el-col
            v-if="receiptVOListName[item.receiptType].isMoney"
            :span="12"
            class="border-left padding-10 height100"
            style="line-height: 50px"
          >发票金额：{{item.receiptMoney || "0.00"}}</el-col>
        </el-row>
        <el-row class="receipt-item-bottom">
          <el-col
            :span="4"
            class="padding-10 height100"
            style="line-height: 100px"
          >{{receiptVOListName[item.receiptType].num}}号</el-col>
          <el-col
            :span="20"
            class="border-left height100"
            style="padding:10px;word-break:break-all"
          >{{item.receiptNum}}</el-col>
        </el-row>
      </div>
      </div>-->
    </div>
  </div>
</template>
<script>
import service from "@/api/financeManagement/reportForms.js";
import { onPreview, onPreviewStr } from "@/utils/print";
export default {
  name: "outpatientDailyReport",
  data() {
    return {
      remoteParams: {
        pageSize: 210,
        page: 1,
        orderBy: "updated_at desc"
      },
      searchValue: {
        date: [
          new Date().format("yyyy-MM-dd"),
          new Date().format("yyyy-MM-dd")
        ],
        roleId: ""
      },
      loading: false,
      multiData: [],
      multiParams: [],
      receiptVOList: [],
      receiptVOListName: {
        normal: {
          name: "发票",
          num: "发票",
          isMoney: true
        },
        refund: {
          name: "退票",
          num: "退票",
          isMoney: true
        },
        jump: {
          name: "作废发票",
          num: "发票",
          isMoney: false
        },
        print: {
          name: "续打发票",
          num: "发票",
          isMoney: false
        }
      },
      resData: {},
      totalAll: "0.00",
      roleInfo: {},
      conts: "",
      typeDatas: [
        {
          payAmt: 0,
          payTypeCode: "cash",
          payTypeName: "现金",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "wxpayBarcode",
          payTypeName: "微信",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "alipayBarcode",
          payTypeName: "支付宝",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "bankCard",
          payTypeName: "银行卡",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "coupon",
          payTypeName: "优惠券",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "other",
          payTypeName: "其他",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "freePay",
          payTypeName: "记账金额",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "prestore",
          payTypeName: "预存消费",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        },
        {
          payAmt: 0,
          payTypeCode: "derate",
          payTypeName: "减免消费",
          prestoreCharge: 0,
          prestoreRefund: 0,
          prestoreTotal: 0,
          total: 0
        }
      ],
      multiDatas: [
        {
          types: "门诊收费",
          typesCode: "payAmt",
          name: "PayAmt"
        },
        {
          types: "预存充值",
          typesCode: "prestoreCharge",
          name: "PrestoreCharge"
        },
        {
          types: "预存退款",
          typesCode: "prestoreRefund",
          name: "PrestoreRefund"
        },
        {
          types: "预存合计",
          typesCode: "prestoreTotal",
          name: "PrestoreTotal"
        },
        {
          types: "合计",
          typesCode: "total",
          name: "Total"
        },
        {
          types: "合计",
          typesCode: "totalAll",
          name: "TotalAll"
        }
      ]
    };
  },
  async mounted() {
    let obj = await onPreviewStr({}, "门诊收费员现金日报表");
    this.conts = obj.str;
  },
  methods: {
    //合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 5) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else if (columnIndex === 1) {
          // return [1, this.multiParams.length - 2];
          return {
            rowspan: 1,
            colspan: this.multiParams.length - 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    roleChange(data, obj) {
      this.roleInfo = obj;
    },
    async getData() {
      try {
        this.$showLoading();
        let startTime ,endTime;
        if (this.searchValue.date && this.searchValue.date.length > 1) {
          startTime = this.searchValue.date.length
            ? this.searchValue.date[0] + " 00:00:00"
            : "";
          endTime = this.searchValue.date.length
            ? this.searchValue.date[1] + " 23:59:59"
            : "";
        }else{
          this.$message.error('日期不能为空！');
          this.$hideLoading();
          return;
        }

        let params = {
          userId: this.searchValue.roleId || "",
          startTime: startTime,
          endTime: endTime
        };
        // let params = {
        //   userId: "2c9180866df7dd21016dfdd6b690036a",
        //   startTime: "2001-01-10 00:00:00",
        //   endTime: "2021-01-10 00:00:00"
        // };
        let res = await service.getStatementOfDailyCash(params);
        if (res.code == 1) {
          this.resData = res.data;
          await this.handleData(
            res.data.outpCashVOList,
            res.data.receiptVOList
          );
          let printData = await this.handlePrintData();
          let obj = await onPreviewStr(printData, "门诊收费员现金日报表");
          this.conts = obj.str;
        } else {
          this.$message.error(res.msg);
        }
        this.$hideLoading();
      } catch (e) {
        this.$hideLoading();
        this.$message.error(e.msg);
      }
    },
    handleData(outpCashVOList, receiptVOList) {
      let multiParams = [
        {
          prop: "types",
          label: "类别",
          width: "120",
          align: "left",
          headerAlign: "left",
          fixed: false
        }
      ];
      this.receiptVOList = receiptVOList;
      let multiData = this.multiDatas;
      let totalAll = 0;
      let colomsItem = {
        prop: "",
        label: "",
        width: "120",
        align: "left",
        headerAlign: "left",
        fixed: false
      };
      for (let i in outpCashVOList) {
        if(outpCashVOList[i]["payTypeCode"] != 'prestore' && outpCashVOList[i]["payTypeCode"] != 'derate' && outpCashVOList[i]["payTypeCode"] != 'freePay'){
          totalAll += Number(outpCashVOList[i]["total"]);
        }
      }
      this.totalAll = totalAll;
      for (let i in outpCashVOList) {
        outpCashVOList[i]["totalAll"] = totalAll;
        let item = {
          ...colomsItem,
          prop: outpCashVOList[i].payTypeCode,
          label: outpCashVOList[i].payTypeName
        };
        multiParams.push(item);

        for (let j in multiData) {
          multiData[j][outpCashVOList[i].payTypeCode] =
            outpCashVOList[i][multiData[j].typesCode] || "0.00";
        }
      }
      this.multiParams = multiParams;
      this.multiData = multiData;
    },
    handlePrintData() {
      let tollName;
      if(this.roleInfo){
        tollName = this.roleInfo.name;
      }
      let printData = {
        tollName: tollName,
        tollDate: new Date().format("yyyy-MM-dd"),
        dates:
          this.searchValue.date[0] +
          " 00:00:00 到 " +
          this.searchValue.date[1] +
          " 23:59:59"
      };
      debugger;
      let outpCashVOList = this.resData.outpCashVOList;
      let receiptVOList = this.resData.receiptVOList;
      let multiData = this.multiDatas;
      // printData.reports = outpCashVOList;
      //总金额
      printData.totalAll = this.outputmoney(this.totalAll || 0) || "0.00";
      printData['chequePayAmt'] = "0.0";
      let typeDatas = this.typeDatas;
      for (let i in typeDatas) {
        let name1 = typeDatas[i]["payTypeCode"];
        for (let j in multiData) {
          let type1 = multiData[j]["name"];
          let code = multiData[j]["typesCode"];
          printData[name1 + type1] =
            this.outputmoney(typeDatas[i][code] || 0) || "0.00";
        }
      }
      for (let i in outpCashVOList) {
        let name = outpCashVOList[i]["payTypeCode"];
        for (let j in multiData) {
          let type = multiData[j]["name"];
          let code = multiData[j]["typesCode"];
          printData[name + type] =
            this.outputmoney(outpCashVOList[i][code] || 0) || "0.00";
        }
      }
      printData['otherPayAmt'] =  this.outputmoney(Number(printData['otherPayAmt']) + Number(printData['chequePayAmt']));
      printData['otherPrestoreCharge'] =  this.outputmoney(Number(printData['otherPrestoreCharge']) + Number(printData['chequePrestoreCharge']));
      printData['otherPrestoreRefund'] = this.outputmoney(Number( printData['otherPrestoreRefund']) + Number(printData['chequePrestoreRefund']));
      printData['otherPrestoreTotal'] = this.outputmoney(Number( printData['otherPrestoreTotal']) +  Number(printData['chequePrestoreTotal']));
      printData['otherTotal'] = this.outputmoney(Number( printData['otherTotal']) + Number(printData['chequeTotal']));
      //发票信息
      for (let i in receiptVOList) {
        printData[receiptVOList[i]["receiptType"] + "ReceiptCount"] =
          receiptVOList[i]["receiptCount"] || 0;
        printData[receiptVOList[i]["receiptType"] + "ReceiptMoney"] =
          this.outputmoney(receiptVOList[i]["receiptMoney"] || 0) || "0.00";
        printData[receiptVOList[i]["receiptType"] + "ReceiptNum"] =
          receiptVOList[i]["receiptNum"] || "";
      }
      return printData;
    },
    async printData() {
      let printData = await this.handlePrintData();
      onPreview(printData, "门诊收费员现金日报表");
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
    }
  }
};
</script>
<style lang="scss" scoped>
.outpatientDailyReport {
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
