<template>
  <div class="return-premium" v-loading="loading">
    <el-row class="return-top" :gutter="80">
      <el-col :span="12">
        <l-card-title>
          <template slot="left">原结算情况</template>
        </l-card-title>
        <div class="price-box">
          <p>
            <span>合计金额：</span>
            {{ formatPrice(info.originalTradeOutpPreSettlementResultVO2.feeAmount) }}
          </p>
          <p>
            <span>记账金额：</span>
            {{ formatPrice(info.originalTradeOutpPreSettlementResultVO2.freePayMoney) }}
          </p>
          <p>
            <span>减免金额：</span>
            {{ formatPrice(info.originalTradeOutpPreSettlementResultVO2.derateAmount) }}
          </p>
          <p>
            <span>自付金额：</span>
            {{ formatPrice(info.originalTradeOutpPreSettlementResultVO2.selfPayMoney) }}
          </p>
          <p>
            <span>实际自付金额：</span>
            {{ formatPrice(info.originalTradeOutpPreSettlementResultVO2.actualSelfPayMoney||0.00) }}
          </p>
          <p
            style="padding-left:45px;"
            v-for="(item,index) in info.originalTradeOutpPreSettlementResultVO2.originalOutpTradeSettleAmtSumVOS"
            :key="index"
          >
            <span>{{ item.payTypePO.payTypeName }}：</span>
            {{ formatPrice(item.payAmt) }}
          </p>
        </div>
      </el-col>
      <el-col :span="12">
        <l-card-title>
          <template slot="left">现结算情况</template>
        </l-card-title>
        <div class="price-box">
          <p>
            <span>合计金额：</span>
            {{ formatPrice(info.rechargeTradeoutpPreSettlementResultVO2 && info.rechargeTradeoutpPreSettlementResultVO2.feeAmount || 0) }}
          </p>
          <p>
            <span>记账金额：</span>
            {{ formatPrice(info.rechargeTradeoutpPreSettlementResultVO2 && info.rechargeTradeoutpPreSettlementResultVO2.freePayMoney || 0) }}
          </p>
          <p>
            <span>减免金额：</span>
            {{ formatPrice(info.rechargeTradeoutpPreSettlementResultVO2 && info.rechargeTradeoutpPreSettlementResultVO2.derateAmount || 0) }}
          </p>
          <p>
            <span>自付金额：</span>
            {{ formatPrice(info.rechargeTradeoutpPreSettlementResultVO2 && info.rechargeTradeoutpPreSettlementResultVO2.selfPayMoney || 0) }}
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col
        :span="8"
      >应{{ info.totalAlreadySelfPayBalance > 0 ? '缴款' : '退款' }}总额：{{ formatPrice(Math.abs(info.totalSelfPayBalance)) }}</el-col>
      <el-col
        :span="8"
      >已{{ info.totalAlreadySelfPayBalance > 0 ? '缴款' : '退款' }}金额：{{ formatPrice(Math.abs(info.totalAlreadySelfPayBalance)) }}</el-col>
      <el-col
        :span="8"
      >待{{ info.totalWaitSelfPayBalance > 0 ? '缴款' : '退款' }}金额：{{ formatPrice(Math.abs(info.totalWaitSelfPayBalance)) }}</el-col>
    </el-row>
    <div class="pay-type">
      <div class="pay-type-title">支付方式：</div>
      <div class="pay-type-cont">
        <div class="pay-type-item" v-for="(item, index) in payType" :key="index">
          <span>{{ item.payTypePO.payTypeName }}</span>
          {{ info.totalWaitSelfPayBalance > 0 ? '缴款' : '退款' }}金额(元)：
          <el-input
            v-model="item.defaultRefundAmt"
            type="number"
            min="0"
            @change="priceChange($event,index,item.maxRefundAmt)"
            :disabled="info.originalTradeCancelFlag === '0'||true"
          ></el-input>
          <span style="margin-left:24px;" v-if="item.payTypePO.permitChangeFlag === '1'">抹零金额：{{Math.abs(unChargeSmallChange)}}</span>
          <span
            v-if="typeof item.maxRefundAmt === 'number'"
            class="max-amt"
          >上限{{ formatPrice(item.maxRefundAmt) }}元</span>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button
        type="primary"
        @click="cancelSettlement"
        v-if="info.originalTradeCancelFlag === '0'"
      >撤销结算</el-button>
      <el-button type="primary" @click="returnPremium" v-if="info.originalTradeCancelFlag !== '0' && info.originalTradeCancelFlag !== ''">退费结算</el-button>
      <el-button plain @click="cancelHandle">取消</el-button>
    </div>
  </div>
</template>

<script>
import service from "@/api/cis/settleAccount/index.js";
import appointment from "@/api/appointment/appointment.js";
import formatNum from "@/utils/formatPrice.js";
import NP from 'number-precision';

export default {
  name: "returnPreDialog",
  props: {
    refundApplyData: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      info: {
        originalTradeOutpPreSettlementResultVO2: {},
        originalOutpTradeSettleAmtSumVOS: {},
        outpRefundSettlementAmtChannelVOS: [],
        rechargeTradeoutpPreSettlementResultVO2: {}
      },
      payType: [],
      unChargeSmallChange:0
    };
  },
  mounted() {
    this.getSettlement();
  },
  methods: {
    // 金额格式化，千位分割，小数点2位
    formatPrice(a) {
      if (!a && a !== 0) {
        return "";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    getSettlement() {
      // 退费申请预结算
      this.loading = true;
      service
        .refundPreSettlement(this.refundApplyData)
        .then(res => {
          if (res.code === 1) {
            this.$message.success(res.msg || "退费预结算成功!");
            this.info = res.data;
            if (res.data && res.data.originalTradeCancelFlag !== "0") {
              // 收费0元的时候没有支付方式
              const list =
                res.data && res.data.outpRefundSettlementAmtChannelVOS
                  ? res.data.outpRefundSettlementAmtChannelVOS
                  : [];
              //预结算成功后进行抹零
              for(let i = 0;i<list.length;i++){
                if(list[i].payTypePO.permitChangeFlag==='1'){
                  this.unChargeSmallChange = NP.minus(list[i].defaultRefundAmt,this.doMl(list[i].defaultRefundAmt));
                  list[i].defaultRefundAmt = this.doMl(list[i].defaultRefundAmt);
                }
              }
              this.payType = list.map(item => {
                return {
                  ...item,
                  defaultRefundAmt: Math.abs(item.defaultRefundAmt)
                };
              });
            }
          } else {
            this.$message.error(res.msg || "退费预结算失败!");
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.msg || "退费预结算失败!");
        });
    },
    cancelSettlement() {
      this.loading = true;
      // 撤销结算
      service
        .refundCancelSettlement(this.refundApplyData)
        .then(res => {
          if (res.code === 1) {
            this.info.originalTradeCancelFlag = "";
            this.getSettlement();
            this.loading = false;
            this.$message.success(res.msg || "撤销成功!");
          } else {
            this.loading = false;
            this.$message.error(res.msg || "撤销失败!");
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.msg || "撤销失败!");
        });
    },
    returnPremium() {
      // 退费
      const priceAmt = this.payType.reduce((total, cur) => {
        return (cur.defaultRefundAmt * 100 + total * 100) / 100;
      }, 0);
      // 所有支付方式的金额之和             待退款金额
      // if (priceAmt !== Math.abs(this.info.totalWaitSelfPayBalance)) {
      //   const msg = this.info.totalWaitSelfPayBalance > 0 ? "支付" : "退费";
      //   this.$message.warning(`找还金额不等于待${msg}自付差额!`);
      //   return;
      // }
      let flag = false;
      if (this.info.totalWaitSelfPayBalance < 0) {
        flag = true;
      }
      // let maxML =  Math.abs(this.info.totalWaitSelfPayBalance) - Number(parseInt(Math.abs(this.info.totalWaitSelfPayBalance) * 10) / 10);
      // let unChargeSmallChange = 0;
      // this.payType.forEach(item => {
      //   if(item.payTypePO.permitChangeFlag == '1'){
      //     // 抹零金额
      //     unChargeSmallChange = NP.minus(item.defaultRefundAmt,Number(parseInt(item.defaultRefundAmt * 10) / 10));
      //     item.defaultRefundAmt = Number(parseInt(item.defaultRefundAmt * 10) / 10);
      //   }
      // });
      // if(unChargeSmallChange>maxML){
      //   this.$message.error('各支付方式抹零金额总和不得超过待退款抹零金额，请修改退款值');
      //   return false;
      // }
      const list = this.payType.map(item => {
        const obj = {};
        if (item.payTypePO.checkNum) {
          obj.companyName = item.payTypePO.companyName;
          obj.bankName = item.payTypePO.bankName;
          obj.bankAccount = item.payTypePO.bankAccount;
          obj.checkNum = item.payTypePO.checkNum;
          obj.deposiBank = item.payTypePO.deposiBank;
          obj.companyName = item.payTypePO.companyName;
          obj.recordRemark = item.payTypePO.recordRemark;
        }
        return {
          ...obj,
          //抹零金额
          unChargeSmallChange:this.unChargeSmallChange,
          payTypeId: item.payTypePO.payTypeId,
          settleAmt: flag ? -item.defaultRefundAmt : item.defaultRefundAmt
        };
      });
      const params = {
        tradeId: this.info.settleTradeId,
        appCode: this.info.appCode || "",
        outTradeSettleAmtDetailVO2s: list
      };
      this.$showLoading();
      appointment
        .settlementNew(params)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            this.$emit("close", { refresh: true });
            this.$message.success(res.msg || "退费成功!");
            this.$emit("message");
          } else {
            this.$message.error(res.msg || "退费失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "退费失败!");
        });
    },
    cancelHandle() {
      if(this.info.originalTradeCancelFlag !== '0'){
        this.$confirm('该笔费用尚未完成退费结算, 请确认是否取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit("close");
        }).catch(() => {

        });
      }else{
        this.$emit("close");
      }
    },
    priceChange(e, idx, maxFlag, balPrice) {
      if (typeof maxFlag !== "number") {
        return;
      }
      // 支付金额
      // 修改一个金额时，自动改变他下一个值，保持总金额等于待支付自付差额
      if (idx > this.payType.length - 1 || this.payType.length === 1) {
        return;
      }
      const price = Number(e);
      if (price > maxFlagt) {
        this.$message.warning("输入金额不能超过最大金额!");
        return;
      }
      let nextIdx;
      // 如果修改的是最后一个，则改变第一个的值
      if (idx === this.payType.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
      const nextPrice = this.payType[nextIdx].settleAmt;
      let bal;
      // 判断是否是递归调用
      if (balPrice) {
        bal = balPrice;
      } else {
        const oPrice = this.payType.reduce((total, cur) => {
          return total + Number(cur.settleAmt);
        }, 0);
        bal = oPrice - Math.abs(this.info.totalWaitSelfPayBalance);
      }
      let newPrice = nextPrice - bal;
      // 如果要修改的值大于0则直接修改，小于0则需要继续向后修改
      if (newPrice < 0) {
        this.$set(this.payType, nextIdx, {
          ...this.payType[nextIdx],
          settleAmt: 0
        });
        // 如果修改下一个值后输入金额还是大于上限则递归往下修改
        this.priceChange(e, nextIdx, maxFlag, Math.abs(Number(newPrice)));
      } else {
        this.$set(this.payType, nextIdx, {
          ...this.payType[nextIdx],
          settleAmt: Number(newPrice)
        });
      }
    },
    doMl(num){
      return Number(parseInt((num) * 10) / 10)
    },
  }
};
</script>

<style lang="scss" scoped>
.return-premium {
  position: relative;
  padding: 20px;
  min-height: 434.4px;
  padding-bottom: 76px;
}
.return-top {
  margin-bottom: 20px;
  /deep/ .cardtitle {
    height: 20px;
    line-height: 20px;
    margin-bottom: 10px;
    .titleleft::before {
      margin-top: 0;
    }
  }
  .el-col:first-child {
    border-right: 1px solid $l-color-primary;
  }
  .price-box {
    span {
      display: inline-block;
      width: 110px;
      text-align: right;
    }
  }
}
.price-box {
  line-height: 25px;
}
.btn-box {
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
.pay-type {
  margin-top: 20px;
}
.pay-type-title {
  font-weight: bold;
  font-size: $l-font-size-max;
}
.pay-type-item {
  padding-left: 40px;
  margin-top: 10px;
  span {
    display: inline-block;
    width: 120px;
  }
  .el-input {
    width: 200px;
  }
}
.max-amt {
  color: $l-color-fontcolor-5;
}
</style>
