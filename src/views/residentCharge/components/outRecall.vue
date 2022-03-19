<template>
  <div class="outRecall">
    <div class="patient-info">
      <l-card-title>
        <template slot="left">患者信息</template>
        <template slot="right">
          <el-button class="plain-button">费用清单</el-button>
        </template>
      </l-card-title>
      <div class="cont">
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">姓名</el-col>
              <el-col :span="17">{{patientInfo.patientName}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">性别</el-col>
              <el-col :span="17">{{patientInfo.patientGender}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">年龄</el-col>
              <el-col :span="17">{{patientInfo.patientAge}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">卡号</el-col>
              <el-col :span="17">{{patientInfo.patientCardNo}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">登记号</el-col>
              <el-col :span="17">{{patientInfo.registerNo}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">病案号</el-col>
              <el-col :span="17">{{patientInfo.nedRecNo}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">科室</el-col>
              <el-col :span="17">{{patientInfo.depart}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">病区</el-col>
              <el-col :span="17">{{patientInfo.inpatientWard}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">天数</el-col>
              <el-col :span="17">{{patientInfo.days}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">入院日期</el-col>
              <el-col :span="17">{{patientInfo.inDate}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">结算日期</el-col>
              <el-col :span="17">{{patientInfo.clearingDate}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">结算类型</el-col>
              <el-col :span="17">{{patientInfo.clearingType}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">撤床结果</el-col>
              <el-col :span="17">{{patientInfo.outRes}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="preMoner-cont">
      <l-card-title>
        <template slot="left">预交金信息</template>
      </l-card-title>
      <div class="cont">
        <el-table
          :data="preMoneyData"
          border
          stripe
          width="100%"
          height="150"
          highlight-current-row
          show-summary
        >
          <el-table-column
            v-for="(item,index) in preMoneyParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="retreat-cont">
      <l-card-title>
        <template slot="left">费用信息</template>
      </l-card-title>
      <div class="cont">
        <div class="cost-table">
          <el-table
            :data="costData"
            border
            stripe
            width="100%"
            highlight-current-row
            show-summary
          >
            <el-table-column
              type="index"
              min-width="200"
              align="center"
              header-align="center"
              fixed="left">
            </el-table-column>
            <el-table-column
              v-for="(item,index) in costParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="inputs">
          <el-row style="margin-bottom: 20px">
            <el-col :span="6">
              <el-row>
                <el-col :span="9">总金额</el-col>
                <el-col :span="15">{{costInfo.sum}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="5">
              <el-row>
                <el-col :span="9">预交金</el-col>
                <el-col :span="15">{{costInfo.preMoney}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="5">
              <el-row>
                <el-col :span="12">医保报销金额</el-col>
                <el-col :span="12">{{costInfo.medicareReimbursement}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="9">医保垫付金额</el-col>
                <el-col :span="15">{{costInfo.medicarePayment}}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 20px">
            <el-col :span="6">
              <el-row>
                <el-col :span="9">个人账户支出</el-col>
                <el-col :span="15">{{costInfo.accountExpend}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="5">
              <el-row>
                <el-col :span="9">自付金额</el-col>
                <el-col :span="15">{{costInfo.selfPayment}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="5">
              <el-row>
                <el-col :span="12">实交金额</el-col>
                <el-col :span="12"><i>{{costInfo.actualMoney}}</i></el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <LFormtTitle label="召回原因" required>
                <el-select v-model="outRecallReason" style="line-height: 34px;">
                  <el-option label="撤床" value="0"></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="buttons clearfix">
      <el-button class="plain-button float-right" style="margin-left: 10px" @click="cancel">取消</el-button>
      <el-button class="primary-button float-right" @click="refund">撤床召回</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "outRecall",
    props: ['isClose5'],
    data() {
      return {
        //患者基本信息
        patientInfo: {},

        preMoneyParams: [
          {
            prop: "receiptNum",
            label: "收据号",
            align: "left",
            width: "195",
            fixed: 'left'
          }, {
            prop: "money",
            label: "金额",
            align: "right",
            headerAlign: 'right',
            width: "200",
            fixed: false
          }, {
            prop: "payType",
            label: "支付方式",
            align: "left",
            width: "215",
            fixed: false
          }, {
            prop: "chargeDate",
            label: "交费时间",
            align: "left",
            width: "225",
            fixed: false
          }, {
            prop: "operateHuman",
            label: "操作人",
            align: "left",
            width: "95",
            fixed: false
          }
        ],
        //表单
        preMoneyData: [],
        //召回原因
        outRecallReason: '',
        //费用信息表格表头
        costParams: [
          {
            prop: "costType",
            label: "费用类型",
            align: "left",
            headerAlign: 'left',
            width: "400",
            fixed: false
          }, {
            prop: "money",
            label: "金额",
            align: "left",
            headerAlign: 'left',
            width: "300",
            fixed: false
          }
        ],
        //费用信息数据
        costData: [],
        costInfo: {}
      }
    },
    created() {
      this.getPatientInfo();
      this.getPreMoneyData();
      this.getCostInfo();
    },
    watch: {
      isClose5() {
        if (this.isClose5 == false) {
          this.reset();
        }
      }
    },
    methods: {
      //获取患者信息
      getPatientInfo() {
        this.$showLoading();
        try {
          //获取数据接口
          let res = {
            patientName: '111',
            patientGender: 1,
            patientAge: '23岁',
            patientCardNo: '123654',
            registerNo: '698542',//登记号
            patientCode: '12',//住院号
            nedRecNo: '47577',//病案号
            patientType: '1',//患者类型
            depart: '泌尿外科',
            inpatientWard: '1',//病区
            days: '1',//天数
            bedNum: '142727',//床号
            inDate: '2019-06-06', // 入院时间
            clearingDate: '2019-06-06', // 结算日期
            clearingType: '本市医保', // 结算类型
            outRes: '治愈', // 撤床结果
            phone: '123569874',//联系电话
            totalMoney: '52437',//费用总额
            accountBalance: '100',//账户余额
            refundAmount: '26543'//可退金额
          };
          this.patientInfo = {...res};
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //获取患者缴存预交金记录信息
      getPreMoneyData() {
        this.$showLoading();
        try {
          //获取数据接口
          let res = [
            {
              receiptNum: '4356875',
              money: '1090.30',
              payType: '现金',
              chargeDate: '2019-03-23 10:20:34',
              operateHuman: '李坤'
            }, {
              receiptNum: '4356875',
              money: '1090.30',
              payType: '现金',
              chargeDate: '2019-03-23 10:20:34',
              operateHuman: '李坤'
            }
          ];
          this.preMoneyData = [...res];
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //获取费用信息数据
      getCostInfo() {
        this.$showLoading();
        try {
          //获取数据接口
          let res = {
            sum: '456',
            preMoney: '546',
            medicareReimbursement: '156',
            medicarePayment: '968',
            accountExpend: '598',
            selfPayment: '897',
            actualMoney: '8974',
            costData: [
              {
                costType: '床位费',
                money: '123'
              }
            ]
          };
          this.costInfo = {...res};
          this.costData = [...res.costData];
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //重置表单
      reset() {
        this.outRecallReason = '';
      },
      //召回
      async refund() {
        this.$showLoading();
        if (this.outRecallReason) {
          try {
            // 召回接口
            // let res = await register(this.outRecallReason);
            this.$message({message: '召回成功', type: 'success'});
            this.$hideLoading();
            await this.reset();
            this.$emit('changeDialog', false);
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "标准错误提示");
          }
        } else {
          this.$hideLoading();
          this.$message.error('召回原因不能为空');
        }
      },
      //取消
      cancel() {
        this.reset();
        this.$emit('changeDialog', false);
      }
    }
  }
</script>

<style lang="scss">
  .outRecall {
    max-height: 700px;
    padding: 10px 20px 20px 20px;
    overflow-y: auto;

    .patient-info {
      margin: 0 14px 20px 0;

      .cont {
        margin: 10px 0 0 14px;
        font-size: $l-font-size;

        font-weight: 400;
        color: $l-color-fontcolor-3;

        .cont-key {
          color: $l-color-fontcolor-4;
        }
      }
    }

    .preMoner-cont {
      .cont {
        margin: 0 0 20px 14px;
      }
    }

    .retreat-cont {
      margin: 20px 0 30px 0;

      .cont {
        .cost-table {
          margin: 0 0 20px 14px;
        }

        .inputs {
          margin-bottom: 20px;
          padding: 20px 0 20px 20px;
          background: $l-color-bgcolor-18;
          border-radius: 2px;

          i {
            margin-left: 10px;
            font-style: normal;
            font-size: $l-font-size;

            font-weight: $l-font-weight;
            color: $l-color-primary;
            display: inline-block;
          }
        }
      }
    }

    .buttons {
      padding: 20px 20px 0 0;
      border-top: 1px solid $l-color-bgcolor-11;
    }

    .primary-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;

      font-weight: 400;
      color: $l-color-white;
      border: none;
    }

    .plain-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      background: $l-color-white;
      border-radius: 2px;
      font-size: $l-font-size;

      font-weight: 400;
      color: $l-color-primary;
      border: 1px solid $l-color-primary;
    }
  }
</style>
