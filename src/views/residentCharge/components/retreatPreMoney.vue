<template>
  <div class="retreatPreMoney">
    <div class="patient-info">
      <div class="title">{{patientInfo.patientName}} {{patientInfo.patientGender}} {{patientInfo.patientAge}}</div>
      <div class="cont">
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">住院号</el-col>
              <el-col :span="17">{{patientInfo.patientCode}}</el-col>
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
              <el-col :span="7" class="cont-key">患者类型</el-col>
              <el-col :span="17">{{patientInfo.patientType}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">科室</el-col>
              <el-col :span="17">{{patientInfo.depart}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">病区</el-col>
              <el-col :span="17">{{patientInfo.inpatientWard}}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">床号</el-col>
              <el-col :span="17">{{patientInfo.bedNum}}</el-col>
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
              <el-col :span="7" class="cont-key">联系电话</el-col>
              <el-col :span="17">{{patientInfo.phone}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 14px">
          <el-col :span="6">
            <el-row>
              <el-col :span="7" class="cont-key">住院号</el-col>
              <el-col :span="17">{{patientInfo.totalMoney}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="preMoner-cont">
      <l-card-title>
        <template slot="left">已交预交金</template>
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
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="retreat-cont">
      <l-card-title>
        <template slot="left">退费信息</template>
      </l-card-title>
      <div class="cont">
        <el-form ref="retreatPayMoneyForm" :model="retreatPayMoneyForm" :rules="rules">
          <div class="inputs">
            <el-row style="margin-bottom: 20px">可退金额 <i>{{patientInfo.refundAmount}}</i></el-row>
            <el-row :gutter="10">
              <el-col :span="6">
                <LFormtTitle label="实退金额" required>
                  <el-form-item label="" label-width="" prop="refundAmount">
                    <el-input v-model.number="retreatPayMoneyForm.refundAmount" style="line-height: 34px;"
                              placeholder="单位：元"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="7">
                <LFormtTitle label="退款原因">
                  <el-form-item label="" label-width="" prop="refundReason">
                    <el-select v-model="retreatPayMoneyForm.refundReason" style="line-height: 34px;">
                      <el-option label="撤床" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-row>
          </div>
          <div class="refund-type-table">
            <el-table
              :data="refundTypeData"
              border
              stripe
              width="100%"
              height="215"
              highlight-current-row
            >
              <el-table-column
                v-for="(item,index) in refundTypeParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                header-align="item.headerAlign || 'left'"
                :fixed="item.fixed"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'operation'">
                    <el-radio v-model="retreatPayMoneyForm.radio" :label="scope.row.radio"
                              @change="radioChange"></el-radio>
                  </template>
                  <template v-else>
                    {{scope.row[item.prop]}}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
    </div>
    <div class="buttons clearfix">
      <el-button class="plain-button float-right" style="margin-left: 10px" @click="cancel">取消</el-button>
      <el-button class="primary-button float-right" @click="refund">退款</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "retreatPreMoney",
    props: ['isClose4'],
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
        //表单
        retreatPayMoneyForm: {
          refundAmount: '',//实退金额
          refundReason: '',//退款原因
          /*radio: 0,//退款方式
          refundType: '',//退款方式
          ditchDefundAmount: 0,//渠道可退金额
          ditchDefundAmount1: 0//渠道退款金额*/
        },
        //规则
        rules: {
          refundAmount: [
            {required: true, message: '请输入实退金额', trigger: 'blur'},
            {validator: this.checkMaxVal, trigger: 'blur'}
          ]
        },
        //退款方式表格表头
        refundTypeParams: [
          {
            prop: "operation",
            label: "",
            align: "center",
            headerAlign: 'center',
            width: "47",
            fixed: "left"
          }, {
            prop: "refundType",
            label: "退款方式",
            align: "left",
            headerAlign: 'left',
            width: "260",
            fixed: "left"
          }, {
            prop: "ditchDefundAmount",
            label: "渠道可退金额",
            align: "right",
            headerAlign: 'left',
            width: "310",
            fixed: false
          }, {
            prop: "ditchDefundAmount1",
            label: "渠道退款金额",
            align: "right",
            headerAlign: 'left',
            width: "310",
            fixed: false
          }
        ],
        refundTypeData: [
          {
            radio: 0,
            refundType: '现金',
            ditchDefundAmount: 5000,
            ditchDefundAmount1: 5000
          }, {
            radio: 1,
            refundType: '微信',
            ditchDefundAmount: 1500,
            ditchDefundAmount1: 1500
          }, {
            radio: 2,
            refundType: '支付宝',
            ditchDefundAmount: 2000,
            ditchDefundAmount1: 2000
          }, {
            radio: 3,
            refundType: '账户',
            ditchDefundAmount: 1000,
            ditchDefundAmount1: 1000
          }
        ]
      }
    },
    created() {
      this.getPatientInfo();
      this.getPreMoneyData();
      this.retreatPayMoneyForm = {
        ...this.retreatPayMoneyForm,
        ...this.refundTypeData[0]
      };
      console.log(this.retreatPayMoneyForm)
    },
    watch: {
      isClose4() {
        if (this.isClose4 == false) {
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
            patientCode: '12',//住院号
            nedRecNo: '47577',//病案号
            patientType: '1',//患者类型
            depart: '泌尿外科',
            inpatientWard: '1',//病区
            bedNum: '142727',//床号
            inDate: '2019-06-06', // 入院时间
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
      //表格单选按钮改变
      radioChange(index) {
        this.retreatPayMoneyForm = {
          ...this.retreatPayMoneyForm,
          ...this.refundTypeData[index]
        };
      }, //重置表单
      reset() {
        this.$refs['retreatPayMoneyForm'].resetFields();
      },
      //退款
      async refund() {
        this.$refs['retreatPayMoneyForm'].validate(async (valid) => {
          console.log(this.retreatPayMoneyForm);
          if (valid) {
            this.$showLoading();
            try {
              // 退费接口
              // let res = await register(this.retreatPayMoneyForm);
              this.$message({message: '退款成功', type: 'success'});
              this.$hideLoading();
              await this.reset();
              this.$emit('changeDialog', false);
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "标准错误提示");
            }
          } else {
            this.$message.error("标准错误提示");
          }
        });
      },
      //取消接口
      cancel() {
        this.$emit('changeDialog', false);
        this.reset();
      },
      //校验可退金额
      checkMaxVal(rule, value, callback) {
        if (value < 0) {
          this.$message({message: '退费金额应大于0', type: 'warning'});
          callback(new Error('退费金额应大于0'));
        } else if (value == 0) {
          this.$message({message: '退费金额不能为0', type: 'warning'});
          callback(new Error('退费金额不能为0'));
        } else if (value < 0 || value > this.retreatPayMoneyForm.ditchDefundAmount) {
          this.$message({message: '退费金额应小于可退金额', type: 'warning'});
          callback(new Error('退费金额应小于可退金额'));
        } else {
          callback();
        }
      }
    }
  }
</script>

<style lang="scss">
  .retreatPreMoney {
    max-height: 700px;
    padding: 30px 20px 20px 20px;
    overflow-y: auto;

    .patient-info {
      margin: 0 14px 20px 14px;

      .title {
        margin-bottom: 20px;
        font-size: $l-font-size-max;

        font-weight: $l-font-weight;
        color: $l-color-fontcolor-3;
      }

      .cont {
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

        .refund-type-table {
          .el-radio__label {
            display: none;
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
