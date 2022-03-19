<template>
  <el-card class="height100 position-relative">
    <el-form label-width="90px" :model="recipeForm" class="height-button-main">
      <div class="cftitle no-wrap">
        <el-row style="padding:5px 0">
          <el-col>
            <span class="label">处方号：</span>
            <span class="title">{{ recipeForm.recipeCode }}</span>
            <span class="pre">
              (
              <span :val="recipeForm.feeType" code="MedicalPaymentMethod" v-codeTransform></span>)
            </span>
          </el-col>
        </el-row>

        <el-row style="padding:5px 0" :gutter="20">
          <el-col :span="6">
            <span class="label">患者姓名：</span>
            <span>{{ recipeForm.patientName }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">性别：</span>
            <span :val="recipeForm.patientGender" code="GENDER_CODE" v-codeTransform></span>
          </el-col>
          <el-col :span="6">
            <span class="label">年龄：</span>
            <span :title="recipeForm.patientAge">{{ recipeForm.patientAge }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">门诊号:</span>
            <span :title="recipeForm.visitCode">{{ recipeForm.visitCode }}</span>
          </el-col>
        </el-row>
        <el-row style="padding:5px 0" :gutter="20">
          <el-col :span="6">
            <span class="label">科室：</span>
            <span :title="recipeForm.deptName">{{ recipeForm.deptName }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">门诊诊断：</span>
            <span :title="recipeForm.clinicDiag">{{ recipeForm.clinicDiag }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">医嘱时间：</span>
            <span :title="recipeForm.orderTime">{{ recipeForm.orderTime }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">联系方式：</span>
            <span :title="recipeForm.phoneNum">{{ recipeForm.phoneNum }}</span>
          </el-col>
        </el-row>
        <el-row style="padding:5px 0" :gutter="20">
          <el-col :span="6">
            <span class="label">总金额：</span>
            <span>{{ formatNum(recipeForm.prescriptionAmt) }}元</span>
          </el-col>

          <el-col :span="12">
            <span class="label">地址：</span>
            <span :title="recipeForm.patientAddr">{{ recipeForm.patientAddr }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">状态：</span>
            <span>{{ showState[selectData.refundState] }}</span>
          </el-col>
        </el-row>
      </div>

      <el-row class="position-absolute" style="padding:0px 20px;left: 0;right: 0;top: 165px;bottom: 165px;">
        <!-- 详细药品表格 -->
        <el-table ref="singleTable" :data="orderTable" stripe border height="100%" highlight-current-row
          @current-change="handleCurrentChange">
          <el-table-column show-overflow-tooltip prop="drugName" label="药品名称" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="spec" label="规格" min-width="150"></el-table-column>
          <el-table-column show-overflow-tooltipCHARGE_TIME prop="purchasePrice" align="right" label="进价(元)" width="120">
            <template slot-scope="scope">
              <span>{{ formatNum(scope.row.purchasePrice) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="price" align="right" label="售价(元)" width="120">
            <template slot-scope="scope">
              <span>{{ formatNum(scope.row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="originCode" label="产地" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
            </template>
          </el-table-column>
          <el-table-column prop="refundQuantity" label="申请数量" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="overflow-point">{{ scope.row.refundQuantity.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="drugUnit" label="单位" min-width="60" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :val="scope.row.chargeUnit" code="DrugUnit" v-codeTransform></span>
            </template>
          </el-table-column>
          <el-table-column prop="chargeQuantity" label="发药数量" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="overflow-point">{{ scope.row.chargeQuantity.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="actualQuantity" label="审核数量" min-width="80">
            <template slot-scope="scope">
              <el-input v-if="selectData.refundState !== '1'" style="width: 100%" v-model="scope.row.actualQuantity"
                controls-position="right" :disabled="recipeForm.orderType == '11'" @blur="actualQuantityFun(scope.row.actualQuantity,scope.$index)" :max="scope.row.refundQuantity"></el-input>
              <span v-else>{{ scope.row.actualQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="备注" min-width="80">
            <template slot-scope="scope">
              <el-input v-if="selectData.refundState !== '1'" v-model="scope.row.remark"></el-input>
              <span v-else>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <div class="position-absolute" style="padding:0px 20px;left: 0;right: 0;bottom: 90px;">
        <el-row class="bottom-div no-wrap" :gutter="6" style="padding:0 5px">
          <el-col :span="4">
            <span class="label">开单医生：</span>
            <span :title="recipeForm.doctorUserName">{{ recipeForm.doctorUserName }}</span>
          </el-col>
          <el-col :span="4">
            <span class="label">收费人员：</span>
            <span :title="recipeForm.chargeUserName">{{ recipeForm.chargeUserName }}</span>
          </el-col>
          <el-col :span="4">
            <span class="label">配方人员：</span>
            <span :title="recipeForm.dispenseUserName">{{ recipeForm.dispenseUserName }}</span>
          </el-col>
          <el-col :span="4">
            <span class="label">发药人员：</span>
            <span :title="recipeForm.deliveryUserName">{{ recipeForm.deliveryUserName }}</span>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="height-button-bottom bottominpt">
      <el-row>
        <!--        <el-col :span="16">
          <el-button
            class="filter-item"
            type="primary"
            plain
            v-hotKey="{ func: 'func_print' }"
            >处方打印</el-button
          >
        </el-col>-->
        <el-col :span="24" style="text-align: right;" v-if="selectData.refundState !== '1'">
          <el-button type="primary" @click="retreat" v-hotKey="{ func: 'func_submit' }">确认退药</el-button>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
  import opha from "@/api/hmm/opha";
  import mixin from "@/mixins/drugManagement.js";
  import formatNum from "@/utils/formatPrice.js";

  export default {
    name: "ophaWithdrawal",
    // mixins: [adHeight],
    props: {
      selectData: {
        type: Object
      }
    },
    mixins: [mixin],
    data() {
      return {
        showState: {
          "0": "申请未处理",
          "1": "申请已处理"
        },
        //右侧表单数据源
        recipeForm: {},
        //右侧列表数据源
        orderTable: [],
        curSelectTableList: [] // 当前已经选中的item
      };
    },
    watch: {
      selectData(newdata) {
        if (
          newdata &&
          newdata.recipeCode &&
          newdata.refundApplyOrderChargeDetailId
        ) {
          this.seachright();
        } else {
          this.orderTable = [];
        }
      },
      orderTable: {
        deep: true,
        handler(val) {}
      }
    },
    methods: {
      actualQuantityFun(a,i){
          if(!isNaN(a)){
            // this.$message.error("请填写正确的数量,已给您默认为1");
            this.orderTable[i].actualQuantity = this.orderTable[i].refundQuantity > Number(a).toFixed(2)?Number(a).toFixed(2):this.orderTable[i].refundQuantity.toFixed(2);
          }
          // console.log(a,i);
      },
      formatNum(num) {
        return formatNum(num);
      },
      async seachright() {
        try {
          this.$showLoading();
          let response = await opha.getRefund({
            id: this.selectData.id,
            refundApplyOrderChargeDetailId: this.selectData
              .refundApplyOrderChargeDetailId
          });
          let {
            data
          } = response;
          this.recipeForm = data;
          this.orderTable = [...data["refundApplyDetailVOList"]];
          this.$refs.singleTable &&
            this.$refs.singleTable.setCurrentRow(this.orderTable[0]);
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg);
        }
      },

      print() {
        // 打印
      },

      retreat() {
        if (this.selectData.refundState == "1") {
          this.$message({
            type: "info",
            message: "该处方已完成退药！"
          });
          return;
        }
        // 确认退药
        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否确认退药?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            opha
              .refund(this.orderTable)
              .then(res => {
                done();
                this.$hideLoading();
                if (res.code == 1) {
                  this.$message.success(res.msg || "退药成功!");
                  this.$emit("refresh-left");
                } else {
                  this.$message.error(res.msg || "退药失败");
                }
              })
              .catch(res => {
                done();
                this.$hideLoading();
                this.$message.error(res.msg || "退药失败");
              });
          }
        });
      }
      // tablast() {
      //   // 键盘Tab 到最后一个 触发回调事件
      //   this.tableData.map(item => {
      //     item.isEditing = false;
      //   });
      //   this.tableData.push({
      //     id: 1,
      //     drugName: "", // 药品名称
      //     spec: "", // 规格
      //     stock: "", // 库存
      //     referencePurchasePrice: "", // 进价
      //     referenceSellPrice: "", // 售价
      //     remark: "", // 备注
      //     packing: "", // 剂量
      //     dosagForm: "", // 剂型单位
      //     rkNumber: "", //数量
      //     batch: "", //生产批号
      //     validity: "", //有效期
      //     supplier: "", //生产厂商
      //     Identification: "", //生产标识
      //     habitat: "", //原产地
      //     isEditing: true // 是否为编辑状态
      //   });
      // }
    }
  };
</script>

<style lang="scss" scoped>
  .el-card {
    position: relative;

    .padding20 {
      padding: 10px 20px;
    }

    .rightinput {
      padding-right: 20px;
      border-bottom: 1px solid $l-color-bgcolor-18;
    }

    .el-row {
      .disabled {
        background: $l-color-bgcolor-18;
      }
    }

    .cftitle {
      overflow: hidden;
      padding: 10px;
      border-bottom: 1px solid $l-color-bgcolor-11;

      .title {
        font-size: 20px;
        font-weight: bold;
        color: $l-color-fontcolor-3;
      }

      .label {
        color: $l-color-fontcolor-4;
        margin-right: 10px;
      }

      .pre {
        font-size: 16px;
        color: $l-color-fontcolor-3;
      }
    }

    .bottom-div {
      background: $l-color-bgcolor-18;
      line-height: 60px;
    }

    .bottominpt {
      border-top: 1px solid $l-color-bgcolor-11;
      padding: 20px;
    }

    .filter-item {
      border-radius: 2px;
      border-color: $l-color-primary;
      color: $l-color-primary;
    }

    .top {
      padding: 10px;
    }

    .bottom {
      padding: 10px;
    }

    .base-info {
      color: $l-color-fontcolor-3;
      margin-bottom: 10px;
      overflow: hidden;

      &>div {
        float: left;
        width: 200px;
      }

      .label {
        min-width: 42px;
        display: inline-block;
        color: $l-color-fontcolor-4;
        margin-right: 10px;
      }
    }

    .address-box {
      width: 100%;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid $l-color-bgcolor-11;

      &>div {
        width: 100%;
      }
    }
  }

  .no-wrap {
    .el-col {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
