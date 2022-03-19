<template>
  <layout>
    <div slot="top">
      <l-card-title>
        <div slot="left" class="report-cont-title">患者信息</div>
      </l-card-title>
      <div class="patient-info">
        <div class="patient-item">
          <span>门诊号</span>
          <em>000062854</em>
        </div>
        <div class="patient-item">
          <span>患者</span>
          <em>张俊杰 男 32岁</em>
        </div>
        <div class="patient-item">
          <span>当前科室</span>
          <em>呼吸外科</em>
        </div>
        <div class="patient-item">
          <span>主诊断</span>
          <em>呼吸性相关肺炎</em>
        </div>
      </div>
      <l-card-title>
        <div slot="left" class="report-cont-title">会诊信息</div>
      </l-card-title>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="consulatation-ruleForm mb20">
        <el-form-item prop="date" style="width: 300px;">
          <LFormtTitle label="会诊时间">
            <el-date-picker v-model="ruleForm.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </LFormtTitle>
        </el-form-item>
        <div class="item-box">
          <el-form-item prop="type">
            <LFormtTitle label="会诊类型">
              <el-select v-model="ruleForm.type" placeholder="请选择">
                <el-option
                  v-for="item in typeSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </LFormtTitle>
          </el-form-item>
          <el-form-item prop="range">
            <LFormtTitle label="会诊范围">
              <el-select v-model="ruleForm.range" placeholder="请选择">
                <el-option
                  v-for="item in typeSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </LFormtTitle>
          </el-form-item>
          <el-form-item prop="place" style="width:350px;">
            <LFormtTitle label="会诊地点">
              <el-input v-model="ruleForm.place" placeholder="请输入内容"></el-input>
            </LFormtTitle>
          </el-form-item>
        </div>
        <l-card-title>
          <div slot="left" class="report-cont-title">会诊科室及医生</div>
          <div slot="right">
            <button class="ana-add" @click.prevent>
              <i class="iconfont iconxinzeng"></i>添加
            </button>
          </div>
        </l-card-title>
        <el-table :data="tableData" border class="mb20">
          <el-table-column
            v-for="(item,index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <l-card-title>
          <div slot="left" class="report-cont-title">简要病情</div>
        </l-card-title>
        <el-form-item prop="condition" class="mb20">
          <el-input
            type="textarea"
            :rows="2"
            resize="none"
            placeholder="请输入患者简要病情"
            v-model="ruleForm.condition"
          ></el-input>
        </el-form-item>
        <l-card-title>
          <div slot="left" class="report-cont-title">会诊目的</div>
        </l-card-title>
        <el-form-item prop="purpose" class="mb20">
          <el-input
            type="textarea"
            :rows="2"
            resize="none"
            placeholder="请输入患者会诊目的"
            v-model="ruleForm.purpose"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="bottom">
      <el-button type="primary">提交</el-button>
      <el-button class="plain-button">保存</el-button>
    </div>
  </layout>
</template>

<script>
import LFormtTitle from "@/components/LFormtTitle";
import layout from "./layout";
import LCardTitle from "@/components/LCardTitle";

export default {
  name: "addNewApply",
  components: { LFormtTitle, layout, LCardTitle },
  data() {
    return {
      // 会诊信息、简要病情、会诊目的
      ruleForm: {
        date: "",
        type: "",
        range: "",
        place: "",
        condition: "",
        purpose: ""
      },
      // 会诊信息、简要病情、会诊目的-校验规则
      rules: {},
      typeSel: [],
      tableParams: [
        {
          prop: "t1",
          label: "会诊科室"
        },
        {
          prop: "t2",
          label: "会诊医生"
        },
        {
          prop: "t3",
          label: "备注"
        }
      ],
      // 会诊科室及医生
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped>
.contain {
  .ana-add {
    height: 14px;
    line-height: 14px;
    padding: 0;
    border: 0;
    background-color: transparent;
    outline: medium;
    vertical-align: top;
    font-size: 14px;
    cursor: pointer;
    .iconfont {
      margin-right: 10px;
      font-size: 14px;
    }
  }
}
</style>
