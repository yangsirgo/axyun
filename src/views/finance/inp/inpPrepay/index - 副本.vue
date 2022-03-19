<template>
  <div class="width100 height100">
    <l-patient-fin class="width100" viewReadCard :type="'inp'"></l-patient-fin>
    <div class="body-div">
      <el-row :gutter="10" class="width100 height100">
        <el-col :span="5" class="height100">
          <el-card class="width100 height100 padding10 overflow-scroll">
            <el-form :model="form" :rules="rules" ref="ruleForm">
              <l-card-title>
                <span slot="left">付款方式</span>
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

              <LFormtTitle label="预缴金额" :required="true" class="margin-top-10">
                <el-form-item prop="prepayMoney">
                  <el-input v-model="form.prepayMoney" placeholder="预缴金额" clearable></el-input>
                </el-form-item>
              </LFormtTitle>
              <LFormtTitle label="授权码" :required="true" class="margin-top-20">
                <el-form-item prop="code">
                  <el-input v-model="form.code" placeholder="授权码" clearable disabled></el-input>
                </el-form-item>
              </LFormtTitle>
              <LFormtTitle label="备注" class="margin-top-20">
                <el-input v-model="form.remark" placeholder="请输入内容" clearable></el-input>
              </LFormtTitle>
              <el-collapse
                v-model="activeNames"
                class="width100 margin-top-20"
                style="clear: both;"
              >
                <el-collapse-item title="其他信息" name="1" style="padding:0px">
                  <LFormtTitle label="代理人身份证号" class="margin-top-20" style="width:100%">
                    <el-input placeholder="请输入内容" v-model="form.thirdPartyPrepayIdNum" clearable></el-input>
                    <!-- <el-button type="primary">读取</el-button> -->
                  </LFormtTitle>
                  <LFormtTitle label="代理人姓名" class="margin-top-20">
                    <el-form-item prop="thirdPartyPrepayName">
                      <el-input v-model="form.thirdPartyPrepayName" placeholder="请输入内容" clearable></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle label="单位名称" class="margin-top-20" :required="true">
                    <el-form-item prop="companyName" >
                      <el-input v-model="form.companyName" placeholder="请输入内容" clearable :disabled="isBank"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle label="开户银行" :required="true" class="margin-top-20">
                    <el-form-item prop="depositBank">
                      <el-input v-model="form.depositBank" placeholder="请输入内容" clearable :disabled="isBank"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle label="银行账号" :required="true" class="margin-top-20">
                    <el-form-item prop="bankAccount">
                      <el-input v-model="form.bankAccount" placeholder="请输入内容" clearable :disabled="isBank"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                  <LFormtTitle label="票号" :required="true" class="margin-top-20">
                    <el-form-item prop="checkNum">
                      <el-input v-model="form.checkNum" placeholder="请输入内容" clearable :disabled="isBank"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-collapse-item>
              </el-collapse>
            </el-form>
            <el-button type="primary" class="float-right margin-top-10" @click="prepay">充值</el-button>
          </el-card>
        </el-col>
        <el-col :span="19" class="height100">
          <el-card class="width100 height100 padding10">
            <el-row :ghtter="10" class="width100">
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
              height="80%"
              stripe
              border
              v-loading="loading"
              :element-loading-text="$t('retreat.loadInfo')"
              highlight-current-row
              @row-click="rowClick"
            >
              <el-table-column label="序号" type="index" width="50"></el-table-column>
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
                  <template v-if="item.prop == 'operate'">
                    <el-button
                      type="text"
                      @click="repealPrepay(scope.row)"
                      :disabled="scope.row['recordStatus'] != '1'"
                    >撤销</el-button>
                  </template>
                  <template v-else-if="item.prop == 'arrivalAccountStatus'">
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
              <el-pagination
                class="float-right page margin-top-20"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageParams.pageNo"
                :page-sizes="[20, 40, 60, 100,300,500,1000,3000,5000,10000]"
                :page-size="pageParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageParams.total"
              ></el-pagination>
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
    var valPrepayMoney = (rule, value, callback) => {
      console.info("sss", value);
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback(new Error("请输入预缴金额"));
      } else if (rules.test(value) === false) {
        callback(new Error("预缴金额只能为数字"));
      } else if (value <= 0) {
        callback(new Error("预缴金额不能为负或等于0"));
      } else if (value > 1000000) {
        callback(new Error("最大额度:1000000"));
      } else {
        callback();
      }
    };

    return {
      form: {
        prepayMoney: 0,
        code: "",
        thirdPartyPrepayIdNum: "",
        thirdPartyPrepayName: "",
        companyName: "",
        depositBank: "",
        bankAccount: "",
        checkNum: "",
        remark: "",
        payTypeCode: "",
        payTypeId: "",
        payTypeName: ""
      },
      // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0
      },
      // 预缴明细
      tableData: [],
      tableParams: [
        {
          prop: "operate",
          label: "操作",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
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
        },
        {
          prop: "remark",
          label: "备注",
          align: "left",
          headerAlign: "center",
          width: "150"
        }
      ],
      //
      loading: false,
      // 当前患者
      patient: {},
      // 支付方式集合
      payTypeList: [],
      payType: "",
      // 折叠面板
      activeNames: ["0"],
      // 下一张票据号
      nextReceiptNumOutPO: {},
      // 跳号loading
      btuLoading: false,
      // 当前预缴对象
      currentPrepayPO: {},
      // 预缴总额
      totalPrepay: 0,
      rules: {
        prepayMoney: [
          { validator: valPrepayMoney, trigger: "blur" }
        ]
      },
      rulesTwo: {
        prepayMoney: [
          { validator: valPrepayMoney, trigger: "blur" }
        ],
        depositBank: [
          { required: true, message: "开户银行不能为空", trigger: "blur" }
        ],
        bankAccount: [
          { required: true, message: "银行账号不能为空", trigger: "blur" }
        ],
        checkNum: [{ required: true, message: "票号不能为空", trigger: "blur" }]
      },
      // 是否银行
      isBank: true,
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
    this.getPrepayDetail();
    this.getNextReceiptNum();
  },
  methods: {
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

        let obj = {
          inpCode: this.patient.inpCode,
          ...this.pageParams
        };

        let res = await service.getPrepayDetailtInfo(obj);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.totalPrepay = 0;
        this.tableData.forEach(val => {
          if (val.recordStatus == "1" && val.arrivalAccountStatus == "1") {
            this.totalPrepay = this.totalPrepay + val.prepayMoney;
          }
        });
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "获取预缴金充值明细失败");
      }
    },
    // 充值
    async prepay() {
      if (!this.patient.inpCode) {
        this.$message.error("请查询患者信息");
        return;
      }
      if (!this.form.payTypeId) {
        this.$message.error("请选择支付方式");
        return;
      }
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          try {
            this.$showLoading();
            let res = await service.prepay({
              ...this.form,
              finAdId: this.patient.finAdId,
              inpCode: this.patient.inpCode,
              businessType: "0" // 普通预缴
            });
            this.cancal();
            if (res.code == "1") {
              this.$message({ type: "success", message: "充值成功" });
            }
            this.getPrepayDetail();
            this.$hideLoading();
          } catch (error) {
            console.info(error);
            this.$hideLoading();
            this.$message.error(error.msg || "预缴金充值失败");
          }
        }
      });
    },
    // 点击明细
    rowClick(row) {
      this.currentPrepayPO = { ...row };
    },
    // 选择支付方式
    payTypeChange(data) {
      this.payTypeList.forEach(val => {
        if (data == val.payTypeId) {
          this.form.payTypeCode = val.payTypeCode;
          this.form.payTypeName = val.payTypeName;
        }
      });
      // 支付方式
      if (this.form.payTypeCode == "cheque") {
        this.rules = { ...this.rulesTwo };
        this.isBank = false;
      } else {
        this.isBank = true;
        this.rules = {
          prepayMoney: [{ validator: valPrepayMoney, trigger: "blur" }]
        };
        
      }
    },
    // 撤销
    async repealPrepay(row) {
      try {
        this.$showLoading();
        let res = await service.repealPrepay({
          prepayId: row.prepayId
        });
        if (res.code == "1") {
          this.$message({ type: "success", message: "撤销成功" });
        }
        this.getPrepayDetail();
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "预缴金撤销失败");
      }
    },
    // 清空
    cancal() {
      this.form = {
        prepayMoney: 0,
        code: "",
        thirdPartyPrepayIdNum: "",
        thirdPartyPrepayName: "",
        companyName: "",
        depositBank: "",
        bankAccount: "",
        checkNum: "",
        remark: "",
        payTypeCode: "",
        payTypeId: "",
        payTypeName: ""
      };
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
    },
     // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getPrepayDetail();
    },
     handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPrepayDetail();
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
.margin-top-20 {
  margin-top: 20px;
}
.payType-div {
  width: 100%;
  // background-color: $l-color-bgcolor-18;
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
// 重写折叠面板样式
/deep/.el-collapse-item__content {
  padding: 0px 0px !important;
}
.numSpan {
  line-height: 36px;
  color: $l-color-text-primary;
  font-weight: $l-font-weight;
}
</style>