<template>
  <div class="outpIncomeReport height100" v-loading="loading">
    <div class="outpIncomeReport-cont">
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
          <el-col :span="15">
            <div class="float-right">
              <el-button type="primary" @click="getData">查询</el-button>
              <el-button type="primary" class="plain-btn" plain @click="printData">打印</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-html="conts" class="print-cont"></div>
    </div>
  </div>
</template>
<script>
import service from "@/api/financeManagement/reportForms.js";
import { onPreview } from "@/utils/print";

export default {
  name: "outpIncomeReport",
  data() {
    return {
      loading: false,
      searchValue: {
        date: [new Date().format("yyyy-MM-dd"), new Date().format("yyyy-MM-dd")]
      },
      conts: "",
      tableData: {}
    };
  },
  async created() {
    let printData = {
     /*  date:
        this.searchValue.date[0] +
        " 00:00:00 到" +
        this.searchValue.date[1] +
        " 23:59:59",
      begBalance: "10.00",
      chargeBalance: "20.00",
      prestore: "30.00",
      prestoreChargeMone: "40.00",
      total: "50.00",
      chargeList: [
        {
          payTypeName: "chargeList现金",
          payAmt: "10.00"
        }
      ],
      refundList: [
        {
          payTypeName: "refundList现金",
          payAmt: "20.00"
        }
      ],
      lenderList: [
        {
          payTypeName: "预存消费",
          payAmt: "30.00"
        }
      ] */
    };
    let datas = await onPreviewStr(printData, "门诊预存款平衡报表新");
    // let datas = await onPreviewStr(printData, "门诊日报表");
    this.conts = datas.str;
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        let params = {
          startTime: this.searchValue.date.length
            ? this.searchValue.date[0] + " 00:00:00"
            : "",
          endTime: this.searchValue.date.length
            ? this.searchValue.date[1] + " 23:59:59"
            : ""
        }; 
        // let params = {
        //   startTime: "2018-01-01 00:00:00",
        //   endTime: "2020-07-02 00:00:00"
        // };
        let res = await service.getOutpPrestoreBalanceReport(params);
        /* let res = {
          code: 1,
          data: {
            debit: {
              begBalance: 1000.0,
              chargeBalance: 114939.01,
              chargeList: [
                {
                  payAmt: 114939.01,
                  payTypeCode: "cash",
                  payTypeName: "现金"
                }
              ],
              refundBalance: -7996.84,
              refundList: [
                {
                  payAmt: -7996.84,
                  payTypeCode: "cash",
                  payTypeName: "现金"
                }
              ],
              total: 107942.17
            },
            lenderList: {
              endBalance: 2000.0,
              prestore: 72631.45,
              prestoreChargeMoney: 80298.91,
              prestoreRefundMoney: -7667.46,
              total: 74631.45
            }
          }
        }; */
        if (res.code === 1) {
          let aaa = this.getAccountData(res.data);
          let printData = { 
            ...aaa,
            date: this.searchValue.date[0] +
            " 00:00:00 到" +
            this.searchValue.date[1] +
            " 23:59:59"};
          this.tableData = {...printData};
          let datas = await onPreviewStr(printData, "门诊预存款平衡报表新");
          this.conts = datas.str;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      } catch (e) {
        console.info(e);
        this.loading = false;
        this.$message.error(e);
      }
    },
    printData() {
      
      onPreview(this.tableData, "门诊预存款平衡报表新");
    },
    // 数据转换 
    // eslint-disable-next-line complexity
    getAccountData(data){
      let res = {
        date: '', //统计时间
        begBalance: '0.00',  // 期初余额
        chargeBalance: '0.00', // 总充值金额
        cashRecharge: '0.00',  // 现金充值
        posRecharge: '0.00',  // pos充值
        inpRecharge: '0.00',  // 住院转门诊
        wxpayRecharge: '0.00',  // 微信充值
        alipayRecharge: '0.00',  // 支付宝充值
        otherpayRecharge: '0.00',  // 其他方式
        refundBalance: '0.00',  //总退款金额
        refundCash: '0.00',  // 退现金
        refundPos: '0.00',  // 退pos
        refundInp: '0.00',  // 退住院转门诊
        refundWxpay: '0.00',  // 退微信
        refundAlipay: '0.00',  // 退支付宝
        refundOther: '0.00',  // 退其他
        grantOverDraw: '0.00', // 总授权透支
        total: '0.00', // 借方  合计
        cunsumeToday: '0.00', // 当日总消费
        prestoreCunsume: '0.00', // 预存消费
        refundPrestoreCunsume: '0.00', // 退预存消费
        deposit: '0.00', // 本期存款
        totalCunsume: '0.00', // 贷方合计
        createUser: data.userName, // 制表人
        createTime: new Date().format("yyyy-MM-dd HH:mm:ss") // 制表时间
      };
      // 借方
      if(data.debit){
        res.begBalance = this.NumtoFixed(data.debit.begBalance) || '0.00';
        res.chargeBalance = this.NumtoFixed(data.debit.chargeBalance) || '0.00';
        res.refundBalance = this.NumtoFixed(data.debit.refundBalance) || '0.00';
        res.total = this.NumtoFixed(data.debit.total) || '0.00';
        res.grantOverDraw = this.NumtoFixed(data.debit.grantOverDraw) || '0.00';
        // 充值
        let chargeList = this.getObject(data.debit.chargeList);
        res.cashRecharge = this.NumtoFixed(chargeList.cash) || '0.00';
        res.wxpayRecharge = this.NumtoFixed(chargeList.wxpay_barcode) || '0.00';
        res.alipayRecharge = this.NumtoFixed(chargeList.alipay_barcode) || '0.00';
        // 退款
        let refundList = this.getObject(data.debit.refundList);
        res.refundCash = this.NumtoFixed(refundList.cash) || '0.00';
        res.refundWxpay = this.NumtoFixed(refundList.wxpay_barcode) || '0.00';
        res.refundAlipay = this.NumtoFixed(refundList.alipay_barcode) || '0.00';
      };
      // 贷方
      if(data.lenderList){
        res.cunsumeToday = this.NumtoFixed(data.lenderList.prestore) || '0.00';
        res.prestoreCunsume = this.NumtoFixed(data.lenderList.prestoreChargeMoney) || '0.00';
        res.refundPrestoreCunsume = this.NumtoFixed(data.lenderList.prestoreRefundMoney) || '0.00';
        res.deposit = this.NumtoFixed(data.lenderList.endBalance) || '0.00';
        res.totalCunsume = this.NumtoFixed(data.lenderList.total) || '0.00';
      };
      return res;
    },
    // 集合转成对象
    getObject(data){
      let obj = {};
      for(let i = 0;i < data.length;i++){
        obj[data[i].payTypeCode] = data[i].payAmt
      }
      return obj;
    },
    //格式化金额
    NumtoFixed(num) {
      if(!num || num == 0){
        return "0.00"
      }
      num = Number(num);
      return num.toFixed(2);
    }

  }
};
</script>
<style lang="scss" scoped>
.outpIncomeReport {
  padding: 10px;
  overflow-y: auto;
  .outpIncomeReport-cont {
    width: 800px;
    margin-left: calc(50% - 400px);
    .nav-bar {
      margin-bottom: 10px;
    }
    .plain-btn {
      width: 66px;
    }
  }
}
</style>