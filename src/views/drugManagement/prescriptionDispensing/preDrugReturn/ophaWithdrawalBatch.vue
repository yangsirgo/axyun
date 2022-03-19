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
            <span>{{ showState[recipeForm.refundState] }}</span>
          </el-col>
        </el-row>
      </div>

      <el-row
        class="position-absolute"
        style="padding:0px 20px;left: 0;right: 0;top: 165px;bottom: 165px;"
      >
        <!-- 详细药品表格 -->
        <el-table
          ref="singleTable"
          :data="orderTable"
          stripe
          border
          height="100%"
          @current-change="handleCurrentChange"
          :span-method="arraySpanMethod"
        >
          <el-table-column show-overflow-tooltip prop="drugName" label="药品名称" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="spec" label="规格" min-width="150"></el-table-column>
          <el-table-column prop="purchasePrice" align="right" label="进价(元)" width="120">
            <template slot-scope="scope">
              <span>{{ formatNum(scope.row.purchasePrice) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" align="right" label="售价(元)" width="120">
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
              <span class="overflow-point">{{ scope.row.refundQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inId" label="批次号" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="batchNum" label="生产批号" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="drugUnit" label="单位" min-width="60" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :val="scope.row.chargeUnit" code="DrugUnit" v-codeTransform></span>
            </template>
          </el-table-column>
          <el-table-column prop="chargeQuantity" label="发药数量" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="overflow-point">{{ scope.row.chargeQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="actualQuantity" label="审核数量" width="120">
            <template slot-scope="scope">
              <el-input-number
                v-if="recipeForm.refundState !== '2'"
                style="width: 100%"
                v-model="scope.row.actualQuantity"
                controls-position="right"
                :min="1"
                :max="scope.row.refundQuantity"
              ></el-input-number>
              <span v-else>{{ scope.row.actualQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="80">
            <template slot-scope="scope">
              <el-input v-if="recipeForm.refundState !== '2'" v-model="scope.row.remark"></el-input>
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
        <el-col :span="24" style="text-align: right;" v-if="recipeForm.refundState !== '2'">
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
  name: "ophaWithdrawalBatch",
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
        "2": "申请已处理"
      },
      //右侧表单数据源
      recipeForm: {},
      //右侧列表数据源
      orderTable: [],
      curSelectTableList: [] // 当前已经选中的item
    };
  },
  mounted() {
    // this.seachright();
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
        this.recipeForm = {};
        this.orderTable = [];
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    async seachright() {
      try {
        if (!this.selectData) {
          return;
        }
        this.$showLoading();
        let response = await opha.getRefund({
          recipeCode: this.selectData.recipeCode,
          refundApplyOrderChargeDetailId: this.selectData
            .refundApplyOrderChargeDetailId
        });
        let { data } = response;
        this.recipeForm = data;
        this.orderTable = data["refundApplyDetailVOList"];
        this.$refs.singleTable &&
          this.$refs.singleTable.setCurrentRow(this.orderTable[0]);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 找到当前药品在数据中的第一个的index
      let curRowIndex = this.orderTable.findIndex(
        item => item.drugId === row.drugId
      );
      // 筛选出当前药品批次的数量(合并rowspan的数量)
      let spanLength = this.orderTable.filter(
        item => item.drugId === row.drugId
      ).length;
      // 只合并前6行
      if (columnIndex < 6) {
        // 获取当前行的索引是否等于数据药品批次中的第一个（合并时是合并每个药品批次的第一个药品）
        if (curRowIndex === rowIndex) {
          return {
            rowspan: spanLength,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      return {
        rowspan: 1,
        colspan: 1
      };
    },
    print() {
      // 打印
    },

    retreat() {
      if (this.recipeForm.refundState == "2") {
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
              if (res.code === 1) {
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
    & > div {
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
    & > div {
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
