<template>
  <div class="width100 height100">
    <!--<hr style="border:1 dashed #E4E4E4" width="100%" color="#E4E4E4" size="1" />-->
    <div style="padding: 20px">
      <el-tag class="top-tag" color="#D5E8FF">退费时，收费员记得回收发票</el-tag>
      <!-- 基本信息 -->
      <el-row class="mar-top-20">
        <el-col :span="2">
          <span class="label">姓名</span>
        </el-col>
        <el-col :span="3">
          <span class="content">{{currentCharge.patientName}}</span>
        </el-col>
        <el-col :span="2">
          <span class="label">真实姓名</span>
        </el-col>
        <el-col :span="3">
          <span class="content">{{currentCharge.patientName}}</span>
        </el-col>
        <el-col :span="1">
          <span class="label">性别</span>
        </el-col>
        <el-col :span="2">
          <span class="content">{{currentCharge.patientGender}}</span>
        </el-col>
        <el-col :span="2">
          <span class="label">出生日期</span>
        </el-col>
        <el-col :span="3">
          <span class="content">{{currentCharge.birthDay || ' '}}</span>
        </el-col>
        <el-col :span="1">
          <span class="label">年龄</span>
        </el-col>
        <el-col :span="2">
          <span class="content">{{currentCharge.patientAge}}</span>
        </el-col>
      </el-row>
      <el-row class="mar-top-20">
        <el-col :span="2">
          <span class="label">就诊科室</span>
        </el-col>
        <el-col :span="3">
          <span class="content">{{currentCharge.ouptDeptId}}</span>
        </el-col>
        <el-col :span="2">
          <span class="label">就诊医生</span>
        </el-col>
        <el-col :span="3">
          <span class="content">{{currentCharge.doctorName}}</span>
        </el-col>
        <el-col :span="3">
          <span class="label">申请退费时间</span>
        </el-col>
        <el-col :span="4">
          <span class="content">{{new Date().toLocaleString()}}</span>
        </el-col>
      </el-row>
      <el-table :data="currentCharge.tableList" border stripe class="mar-top-20">
        <el-table-column
          v-for="(item, index) in tableParamsThree"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <!--操作部分自定义-->
            <template>
              <span class="overflow-point">{{ scope.row[item.prop]}}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="div-bottom mar-top-20">
        <el-row :gutter="20">
          <el-col :span="16">
            <LFormtTitle label="退费原因" labelWidth="76">
              <el-input v-model="currentCharge.refundReason" style="line-height: 34px;"></el-input>
            </LFormtTitle>
            <span class="rules font" v-if="!currentCharge.refundReason">{{'退费原因不能为空'}}</span>
          </el-col>
          <el-col :span="8">
            <LFormtTitle label="退费方式" labelWidth="76">
              <el-select v-model="currentCharge.refundType">
                <el-option key="1" label = '账户充值' value = '1'></el-option>
              </el-select>
            </LFormtTitle>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--<hr style="border:1 dashed #E4E4E4" width="100%" color="#E4E4E4" size="1" />-->
  </div>
</template>
<script>
// 重写date 格式化方法
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};

export default {
  props: {
    currentCharge: {
      type: Object,
      default: {
        refundApplyDetailList: []
      }
    }
  },
  data() {
    return {
      tableParamsThree: [
        {
          label: "执行状态",
          prop: "status",
          width: "100",
          align: "left"
        },
        {
          label: "项目类型",
          prop: "orderType",
          width: "100",
          align: "left"
        },
        {
          label: "项目名称",
          prop: "itemName",
          width: "300",
          align: "left"
        },
        {
          label: "规格",
          prop: "chargeUnit",
          width: "80",
          align: "left"
        },
        {
          label: "单位",
          prop: "chargeUnit",
          width: "100",
          align: "left"
        },
        {
          label: "单价",
          prop: "chargePrice",
          width: "100",
          align: "right"
        },
        {
          label: "实退数量",
          prop: "confirmQuantity",
          width: "100",
          align: "left"
        },
        {
          label: "金额",
          prop: "totalMoney",
          width: "100",
          align: "right"
        },
        {
          label: "执行科室",
          prop: "ouptDeptId",
          width: "90",
          align: "left"
        }
      ],
      tableDataThree: []
    };
  },
  watch: {
    currentCharge(val) {
      this.currentCharge = val;
      this.$emit("update:currentCharge", val);
    }
  },
};
</script>
<style lang="scss" scoped>
.top-tag {
  width: 100%;
  text-align: center;
  color: #3d7dfb;
  margin-top: 10px;
}
.mar-top-20 {
  margin-top: 20px;
}
.label {
  color: #949da3;
}
.content {
  color: #2e323a;
}
.div-bottom {
  height: 76px;
  background: rgba(246, 246, 246, 1);
  border-radius: 2px;
  padding: 20px;
}
.input-with {
  width: 100%;
}
.rules{
  color: $l-color-primary;
  font-size: 12px;
  margin-left: 76px;
}
</style>
