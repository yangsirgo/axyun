<template>
  <div class="outpatientDailyReport height100" v-loading="loading">
    <div class="outpatientDailyReport-cont">
      <!-- <l-card-title>
      <span slot="left">住院费用日清单报表</span>
      </l-card-title>-->
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
            <LFormtTitle label="住院号">
              <el-input v-model="searchValue.inpCode" placeholder="住院号" clearable></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="9">
            <div class="float-right">
              <el-button type="primary" @click="getData">查询</el-button>
              <el-button type="primary" class="plain-btn" plain @click="printData">打印</el-button>
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
  props: {
    reportData: {
      type: Object,
      defalut: {
        inpCode: '',
        flag: '1'  // 1 住院费用日清单报表 2 住院费用汇总
      }
    }
  },
  data() {
    return {
      searchValue: {
        date: [
          new Date().format("yyyy-MM-dd"),
          new Date().format("yyyy-MM-dd")
        ],
        inpCode :""
      },
      loading: false,
      printObj: {},
      conts: ''
    };
  },
  async mounted() {
    let obj = await onPreviewStr({title:'住院费用日清单报表'}, "住院费用日清单报表");
    this.conts = obj.str;
  },
  methods: {
    async getData() {
      try {
        if(!this.reportData.inpCode && !this.searchValue.inpCode){
          this.$message.error("请选择住院患者");
          return;
        }
        this.$showLoading();
        let startDate = this.searchValue.date.length
          ? this.searchValue.date[0] + " 00:00:00"
          : "";
        let stopDate = this.searchValue.date.length
          ? this.searchValue.date[1] + " 23:59:59"
          : "";
        let params = {
          startDate: startDate,
          stopDate: stopDate,
          inpCode: this.searchValue.inpCode || this.reportData.inpCode  || ""
        };
        let res = await service.getInpChargeDayReport(params);
        if (res.code == 1) {
          let printData = await this.handleData(res.data);
          if(this.reportData.flag == '1'){
            printData.title = "住院费用日清单报表";
          }else{
            printData.title = "住院费用汇总报表";
          }
          let obj = await onPreviewStr(printData, "住院费用日清单报表");
          this.conts = obj.str;
        } else {
          this.$message.error(res.msg);
        }
        this.$hideLoading();
      } catch (e) {
        console.info(e)
        this.$hideLoading();
        this.$message.error(e.msg);
      }
    },
    // 整理数据
    handleData(obj) {
      let list = obj.inpChargeByClassVOS;
      let res = [];
      if(!list){
        return obj;
      }
      for(let i = 0 ;i < list.length;i++){
        if(i % 2 == 0){
          let val = {
            className1: list[i].className || '',
            itemName1: list[i].itemName || '',
            price1: this.outputmoney(list[i].price) || '',
            quantity1: list[i].quantity || '',
            totalMoney1: this.outputmoney(list[i].totalMoney) || '',
            className2: list[i + 1].className || '',
            itemName2: list[i + 1].itemName || '',
            price2: this.outputmoney(list[i + 1].price) || '',
            quantity2: list[i + 1].quantity || '',
            totalMoney2: this.outputmoney(list[i + 1].totalMoney) || ''
          }
          res.push(val);
        }
      }
      obj.inpChargeByClassVOS = res;
      if(obj.wdeptAdmissionTime){
        obj.wdeptAdmissionTime = new Date(obj.WdeptAdmissionTime).format("yyyy-MM-dd");
      }
      this.printObj = obj;
      return obj;
    },
    async printData() {

      onPreview(this.printObj, "住院费用日清单报表");
    },
    //格式化金额
    outputmoney(number) {
      // number = number.replace(/\,/g, "");
      if (isNaN(number) || number == "") {
        return "";
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
