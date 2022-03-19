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
      <div class="patient-info">
        <div class="patient-item">
          <span>会诊时间</span>
          <em class="isometric">2019-04-12 09:00</em>
        </div>
        <div class="patient-item">
          <span>会诊类型</span>
          <em>平诊</em>
        </div>
        <div class="patient-item">
          <span>会诊范围</span>
          <em>院内</em>
        </div>
        <div class="patient-item">
          <span>会诊地点</span>
          <em>泌尿外科医生办公室</em>
        </div>
        <div class="patient-item">
          <span>申请科室</span>
          <em class="isometric">泌尿外科</em>
        </div>
        <div class="patient-item">
          <span>申请医生</span>
          <em>张杨</em>
        </div>
      </div>
      <l-card-title>
        <div slot="left" class="report-cont-title">会诊科室及医生</div>
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
      <p class="text-box">患者病情复杂，继续会诊。</p>
      <l-card-title>
        <div slot="left" class="report-cont-title">会诊目的</div>
      </l-card-title>
      <p class="text-box">通过会诊，治愈病人病情，降低患者病情恶化风险！</p>
      <el-dialog
        class="receive-apply"
        title="接收会诊"
        :visible.sync="receiveVisible"
        :append-to-body="true"
        width="470px"
      >
        <receive-apply />
      </el-dialog>
      <el-dialog
        class="receive-apply"
        title="拒绝会诊"
        :visible.sync="refuseVisible"
        :append-to-body="true"
        width="470px"
      >
        <refuse-apply @close-dialog="refuseVisible = false" />
      </el-dialog>
    </div>
    <div slot="bottom">
      <el-button type="primary" @click="receiveVisible = true">确认接收会诊</el-button>
      <el-button class="plain-button" @click="refuseVisible = true">拒绝申请</el-button>
    </div>
  </layout>
</template>

<script>
import layout from "./layout";
import receiveApply from "./receiveApply";
import refuseApply from "./refuseApply";

export default {
  name: "applyForm",
  components: { layout, receiveApply, refuseApply },
  data() {
    return {
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
      tableData: [],
      receiveVisible: false,
      refuseVisible: false
    };
  }
};
</script>

<style lang="scss" scoped>
.isometric {
  display: inline-block;
  width: 113px;
}
</style>
