<template>
  <div class="outpPrestoreBalanceReport height100" v-loading="loading">
    <div class="outpPrestoreBalanceReport-cont">
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
import { onPreview, onPreviewStr } from "@/utils/print";

export default {
  name: "outpPrestoreBalanceReport",
  data() {
    return {
      loading: false,
      searchValue: {
        date: [new Date().format("yyyy-MM-dd"), new Date().format("yyyy-MM-dd")]
      },
      conts: "",
      tableData: {
        
      }
    };
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
        let res = await service.getOutpIncomeReport(params);
        if (res.code === 1) {
          let obj = this.getObject(res.data.debitList,'1');
          let obj2 = this.getObject(res.data.lenderList,'2');
          let printData = {
            ...res.data,
            ...obj,
            ...obj2,
            date: this.searchValue.date[0] +
            " 00:00:00 到" +
            this.searchValue.date[1] +
            " 23:59:59",
            createTime: new Date().format("yyyy-MM-dd HH:mm:ss"),
            createUser: res.data.userName
          }
          printData.totalMoney = res.data.totalMoney || '0.00';
          this.tableData = {...printData};
          let datas = await onPreviewStr(printData, "门诊收入报表");
          this.conts = datas.str;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.info(e);
        this.$message.error(e);
      }
    },
    printData() {
      onPreview(this.tableData, "门诊收入报表");
    },
    getObject(data,flag){
      let obj = {};
      for(let i = 0;i < data.length;i++){
        obj[data[i].classCode] = this.NumtoFixed(data[i].totalMoney) 
      }
      if(flag == '1'){
        if(!obj.hi){
          obj.hi = '0.00';
        }
        if(!obj.cash){
          obj.cash = '0.00';
        }
        if(!obj.cheque){
          obj.cheque = '0.00';
        }
        if(!obj.coupon){
          obj.coupon = '0.00';
        }
        if(!obj.prestore){
          obj.prestore = '0.00';
        }
        if(!obj.totalMoney){
          obj.totalMoney = '0.00';
        }
        if(!obj.hos_staff_account){
          obj.hos_staff_account = '0.00';
        }
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
.outpPrestoreBalanceReport {
  padding: 10px;
  overflow-y: auto;
  .outpPrestoreBalanceReport-cont {
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