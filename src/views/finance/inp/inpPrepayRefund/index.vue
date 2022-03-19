<template>
  <div class="height100 width100">
    <l-patient-fin class="width100" viewReadCard :type="'inp'"></l-patient-fin>
    <div class="body-div">
      <el-row :gutter="10" class="width100 height100">
        <el-col :span="5" class="height100">
          <el-card class="width100 height100 padding10 overflow-scroll">
            <!-- <l-card-title>
              <span slot="left">退款信息</span>
            </l-card-title>
            <LFormtTitle label="患者姓名" :required="true">
              <el-input v-model="patient.patientName" placeholder="患者姓名" disabled></el-input>
            </LFormtTitle>
            <LFormtTitle label="住院号" :required="true" class="margin-top-10">
              <el-input v-model="patient.inpCode" placeholder="住院号" disabled></el-input>
            </LFormtTitle> -->
            <l-card-title>
              <span slot="left">退款方式</span>
            </l-card-title>
            <div class="payType-div">
              <el-row
                class="radio-item margin-top-10"
                v-for=" item in payTypeList"
                :key="item.payTypeId"
              >
                <el-col :span="22">
                  <span style="display:inline-block;vertical-align: sub;margin-right:10px">
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
                  {{item.payTypeName}}
                </el-col>
                <el-col :span="2">
                  <el-radio
                    v-model="form.payTypeId"
                    :label="item.payTypeId"
                    @change="payTypeChange"
                    style="width:100%;"
                  >{{""}}</el-radio>
                </el-col>
              </el-row>
            </div>
            <LFormtTitle label="可退金额" :required="true" class="margin-top-10">
              <el-input v-model="form.ableMoney" placeholder="可退金额" disabled></el-input>
            </LFormtTitle>
            <LFormtTitle label="退款金额" :required="true" class="margin-top-10">
              <el-input v-model="form.prepayMoney" placeholder="退款金额" clearable></el-input>
            </LFormtTitle>
            <el-button type="primary" class="float-right margin-top-10" @click="inpPrepayRefund">退款</el-button>
          </el-card>
        </el-col>
        <el-col :span="19" class="height100">
          <el-card class="width100 height100 padding10">
            <el-row :gutter="10" class="width100">
              <el-col :span="8">
                <el-button type="primary" @click="printReceipt">票据打印</el-button>
                <el-button type="primary" @click="getPrintReceiptInfo">原票重打</el-button>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" class="float-right" @click="jumpNum">跳号</el-button>
                <el-button
                  type="primary"
                  class="float-right margin-right-10"
                  @click="getNextReceiptNum"
                >刷新</el-button>
                <span
                  class="float-right numSpan"
                  v-loading="btuLoading"
                >下一张票据号: &#12288;{{nextReceiptNumOutPO.receiptNum || '00000000'}}</span>
              </el-col>
            </el-row>
            <l-card-title>
              <span slot="left">个人预缴明细</span>
              <span slot="right">总预缴：{{formatNumber(totalPrepay) }}</span>
            </l-card-title>
            <el-table
              :data="tableData"
              width="100%"
              height="calc(43% - 50px)"
              stripe
              border
              v-loading="loading"
              :element-loading-text="$t('retreat.loadInfo')"
              highlight-current-row
              @row-click="rowClick"
            >
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column
                v-for="(item, index) in tableParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'arrivalAccountStatus'">
                    <span v-if="scope.row[item.prop] == '0'">未到账</span>
                    <span v-if="scope.row[item.prop] == '1'">已到账</span>
                  </template>
                  <template v-else-if="item.prop == 'recordStatus'">
                    <span v-if="scope.row[item.prop] == '1'">普通</span>
                    <span v-if="scope.row[item.prop] == '2'">已退</span>
                    <span v-if="scope.row[item.prop] == '9'">退费</span>
                  </template>
                  <template v-else-if="item.prop == 'prepayMoney'">
                    <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                    <span v-if="!scope.row[item.prop]">0.00</span>
                  </template>
                  <template v-else>
                    <span class="overflow-point">{{ scope.row[item.prop] }}</span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <l-card-title>
              <span slot="left">第三方支付</span>
              <span slot="right">总第三方支付：0.00</span>
            </l-card-title>
            <el-table
              :data="tableDataTwo"
              width="100%"
              height="calc(44% - 50px)"
              stripe
              border
              v-loading="loading"
              :element-loading-text="$t('retreat.loadInfo')"
              highlight-current-row
              @row-click="rowClick"
            >
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column
                v-for="(item, index) in tableParamsTwo"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'arrivalAccountStatus'">
                    <span v-if="scope.row[item.prop] == '0'">未到账</span>
                    <span v-if="scope.row[item.prop] == '1'">已到账</span>
                  </template>
                  <template v-else-if="item.prop == 'recordStatus'">
                    <span v-if="scope.row[item.prop] == '1'">普通</span>
                    <span v-if="scope.row[item.prop] == '2'">已退</span>
                    <span v-if="scope.row[item.prop] == '9'">退费</span>
                  </template>
                  <template v-else-if="item.prop == 'prepayMoney'">
                    <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                    <span v-if="!scope.row[item.prop]">0.00</span>
                  </template>
                  <template v-else>
                    <span class="overflow-point">{{ scope.row[item.prop] }}</span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import service from "@/api/financeManagement/inp.js";
import printService from "@/api/cis/receiptPrint/receiptPrint";
// import { onPreview, onPrint } from "@/utils/print";
  import {print,preview,onPreview} from '@/utils/print';
export default {
  data() {
    return {
      // 退款表单
      form: {
        patientName: "",
        inpCode: "",
        prepayMoney: 0,
        ableMoney: 0
      },
      //
      loading: false,
      // 预缴明细
      tableData: [],
      tableParams: [
        {
          prop: "receiptNum",
          label: "票据号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "prepayTime",
          label: "预缴时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "payTypeName",
          label: "充值方式",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "prepayMoney",
          label: "预缴金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "arrivalAccountStatus",
          label: "到账状态",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "thirdPartyPrepayName",
          label: "代办人",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "thirdPartyPrepayIdNum",
          label: "代办人身份证",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "prepayUserName",
          label: "操作者",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "prepayTime",
          label: "操作时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "depositBank",
          label: "开户银行",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "companyName",
          label: "单位名称",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "bankAccount",
          label: "银行账号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "checkNum",
          label: "票号",
          align: "left",
          headerAlign: "center",
          width: "100"
        }
      ],
      // 预缴总额
      totalPrepay: 0,
      // 第三方
      tableDataTwo: [],
      tableParamsTwo: [
        {
          prop: "receiptNum",
          label: "结算记录号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "交易时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "receiptNum",
          label: "交易金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "可退金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "业务类型",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "支付类型",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "付款人",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "付款人账户",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "receiptNum",
          label: "付款人账户银行",
          align: "left",
          headerAlign: "center",
          width: "140"
        },
        {
          prop: "receiptNum",
          label: "手机号码",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "收款人",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNum",
          label: "收款人账号",
          align: "left",
          headerAlign: "center",
          width: "100"
        }
      ],
      // 支付方式集合
      payTypeList: [],
      // 当前患者信息
      patient: {},
      // 当前预缴明细
      currentDetail: {},
      // 票据PO
      nextReceiptNumOutPO: {},
      //
      btuLoading: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.patient = value;
        this.getPrepayDetail();
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getPayTypeByAuth();
    this.getNextReceiptNum();
  },
  methods: {
    rowClick(row) {
      this.currentDetail = row;
      // 计算可退金额
      if(row.payTypeCode == 'wxpay_barcode' || row.payTypeCode == 'alipay_barcode'){
         this.form.ableMoney = row.prepayMoney
      }
    },
    // 选择支付方式
    payTypeChange(data){
      this.payTypeList.forEach(val => {
        if (data == val.payTypeId) {
          this.form.payTypeCode = val.payTypeCode;
          this.form.payTypeName = val.payTypeName;
        }
      });
      // 可退金额
      this.form.ableMoney = 0;
      if(this.form.payTypeCode == 'wxpay_barcode' || this.form.payTypeCode == 'alipay_barcode'){
        this.tableData.forEach(val =>{
          if(val.recordStatus == '1' && val.arrivalAccountStatus == '1' && val.payTypeCode == this.form.payTypeCode){
            this.form.ableMoney = this.form.ableMoney + val.prepayMoney;
          }
        })
      }else{
        this.tableData.forEach(val =>{
          if(val.recordStatus == '1' && val.arrivalAccountStatus == '1'){
            this.form.ableMoney = this.form.ableMoney + val.prepayMoney;
          }
        })
      }
    },
    // 查询支付方式
    async getPayTypeByAuth() {
      try {
        this.$showLoading();
        let res = await service.getPayTypeByAuth({});
        this.payTypeList = res.data;
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "获取支付方式失败");
      }
    },
    // 查询预缴金充值明细
    async getPrepayDetail() {
      try {
        if (!this.patient.inpCode) {
          this.tableData = [];
          return;
        }
        this.loading = true;
        let res = await service.getPrepayDetail({
          inpCode: this.patient.inpCode
        });
        this.tableData = res.data;
        this.totalPrepay = 0;
        this.tableData.forEach(val =>{
          if(val.recordStatus == '1' && val.arrivalAccountStatus == '1'){
            this.totalPrepay = this.totalPrepay + val.prepayMoney;
          }
        })
        this.form.ableMoney = this.totalPrepay;
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "获取预缴金充值明细失败");
      }
    },
    // 预缴金退款
    // eslint-disable-next-line complexity
    async inpPrepayRefund(){
      try {
        if(!this.form.payTypeId){
          this.$message.error("请选择支付方式");
          return;
        }if((this.form.payTypeCode == 'wxpay_barcode' || this.form.payTypeCode == 'alipay_barcode') && !this.currentDetail.prepayId){
          this.$message.error("请选择对应要退款的预缴明细");
          return;
        }if(!this.form.prepayMoney || this.form.prepayMoney <= 0){
          this.$message.error("请输入退款金额");
          return;
        }
        let rules = /^[0-9]*$/;
        if(rules.test(this.form.prepayMoney) === false){
          this.$message.error("退款金额只能为数字");
          return;
        }
        if(this.form.prepayMoney > this.form.ableMoney){
          this.$message.error("退款金额不能大于可退金额");
          return;
        }
        if (!this.patient.inpCode) {
          this.$message.error("请查询患者信息");
          return;
        }
        this.$showLoading();
        this.form.prepayMoney = -this.form.prepayMoney;
        let res = await service.prepay({
          ...this.form,
          finAdId: this.patient.finAdId,
          inpCode: this.patient.inpCode,
          businessType: "0" // 普通预缴
        });
        if (res.code == "1") {
          this.$message({ type: "success", message: "退款成功" });
        }
        this.getPrepayDetail();
        // 清除金额数据
        this.form.prepayMoney = 0;
        this.form.ableMoney = 0;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        console.info(error)
        this.$message.error(error.msg || "预缴金退款失败")
      }
    },
    // 获取下一张票据号
    async getNextReceiptNum() {
      try {
        this.btuLoading = true;
        let res = await printService.getNextReceiptNum({
          receiptType: "2" // 住院预缴款
        });
        if (!res.data) {
          this.$message("未找到当前登录人的领用票据信息");
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
    // 跳号
    async jumpNum() {
      try {
        this.btuLoading = true;
        if(!this.nextReceiptNumOutPO.outId){
          this.$message.error("当前无有效票据");
          return ;
        }
        let obj = {
          outId: this.nextReceiptNumOutPO.outId,
          receiptStartNum: this.nextReceiptNumOutPO.nextReceiptNum,
          receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1
        };
        let res = await printService.receiptJumpNum(obj);
        this.getNextReceiptNum();
        this.btuLoading = false;
        if (res.code == "1") {
          this.$message({ type: "success", message: "跳号成功" });
        } else {
          this.$message.error(error.msg || "跳号失败");
        }
      } catch (error) {
        this.btuLoading = false;
        console.info(error);
        this.$message.error(error.msg || "跳号失败");
      }
    },
    // 票据打印
    async printReceipt() {
      try {
        // if (!this.currentPrepayPO.prepayId) {
        //   this.$message.error("请选择要打印的预缴明细");
        //   return;
        // }
        // if (!this.nextReceiptNumOutPO.receiptNum) {
        //   this.$message.error("当前票据号为空");
        //   return;
        // }
        // let list = [];
        // list.push(this.currentPrepayPO.prepayId);
        // this.$showLoading();
        // let obj = {
        //   receiptNum: this.nextReceiptNumOutPO.nextReceiptNum,
        //   outId: this.nextReceiptNumOutPO.outId,
        //   inId: this.nextReceiptNumOutPO.intId,
        //   outpTradeDetailIds: list
        // };
        // let res = await printService.printReceipt(obj);
        // this.$message({ message: "票据数据保存成功", type: "success" });
        // this.getNextReceiptNum();
        // this.select();
        // 打印机。。
        let res = {
          data: {
            receiptNum : this.nextReceiptNumOutPO.receiptNum,
            patientName: this.patient.patientName
          }
        }
        onPreview(res.data, "票据");
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },

    // 原票重打
    async getPrintReceiptInfo(){
      try {
        // if(!this.currentPrepayPO.prepayId){
        //    this.$message.error("请选择要打印的预缴明细");
        //   return ;
        // }
        // this.$showLoading();
        // let res = await service.getPrintReceiptInfo(this.currentReceiptDetail);
        let res = {
          data: {
            receiptNum : this.nextReceiptNumOutPO.receiptNum,
            patientName: this.patient.patientName
          }
        }
        // 打印机
        onPreview(res.data,"票据");
        this.$hideLoading();
      } catch (error) {
        console.info(error)
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
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
    }
  }
};
</script>
<style lang="scss" scoped>
.body-div {
  width: 100%;
  height: calc(100% - 80px);
}
.margin-top-10 {
  margin-top: 10px;
}
.radio-item {
  background-color: $l-color-bgcolor-18;
  height: 48px;
  padding: 0 20px;
  border-radius: 2px;
  border: 1px solid $l-color-bgcolor-11;
  line-height: 48px;

  .balance {
    font-style: normal;
    font-size: $l-font-size;

    font-weight: 400;
    color: $l-color-fontcolor-4;
  }

  .el-radio__label {
    display: none;
  }
}
.numSpan {
  line-height: 36px;
  color: $l-color-text-primary;
  font-weight: $l-font-weight;
}
</style>
