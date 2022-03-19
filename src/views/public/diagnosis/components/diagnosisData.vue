<template>
  <div class="height100">
    <el-table
      border
      stripe
      ref="multipleTable"
      width="100%"
      height="100%"
      highlight-current-row
      v-loadmore="{
        noMoreVar: tlm_noMore,
        loadingVar: tableLoading,
        value: loadNextPage,
      }"
      v-hotKey="{
        func: ['table_row', 'table_checkbox', 'table_choose'],
        deClass: 'el-table__row',
        curClass: 'current-row',
      }"
      :data="diagAdd"
      @selection-change="handleSelectionChange"
      @row-click="editTableRow"
    >
      <el-table-column
        prop="m"
        type="selection"
        min-width="48"
        align="center"
        fixed="left"
      ></el-table-column>

      <el-table-column
        v-for="(item, index) in mainTableHead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'left'"
        header-align="left"
        :fixed="item.fixed"
        show-overflow-tooltip
      >
        <template slot-scope="scope0">
          <template v-if="item.prop == 'diagCode'">
            <span class="blue-color">{{ scope0.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop == 'diagType'">
            <span
              code="DiseaseDiagnosisCategoryCode"
              v-codeTransform
              :val="scope0.row[item.prop]"
            ></span>
          </template>
          <template v-else-if="item.prop == 'cwFlag'">
            <span
              code="DIAGCWM"
              v-codeTransform
              :val="scope0.row[item.prop]"
            ></span>
          </template>
          <template v-else-if="item.prop == 'diagMain'">
            <span
              code="YesOrNo"
              v-codeTransform
              :val="scope0.row[item.prop]"
            ></span>
          </template>
          <template v-else-if="item.prop == 'diagName'">
            <span class="blue-color">{{ scope0.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop == 'isFirst'">
            <span
              code="FirstOrNo"
              v-codeTransform
              :val="scope0.row[item.prop]"
            ></span>
          </template>
          <template v-else-if="item.prop == 'status'">
            <span
              code="DiagStatus"
              v-codeTransform
              :val="scope0.row[item.prop]"
            ></span>
          </template>
          <template v-else-if="item.prop == 'diagResults'">
            <span
              code="EntranceCode"
              v-codeTransform
              :val="scope0.row[item.prop]"
            ></span>
          </template>
          <template v-else>{{ scope0.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions } from "vuex";

import diagnosisData from "../mixins/diagnosisData";

export default {
  name: "diagnosisData",
  mixins: [diagnosisData],
  props: {
    receivePatientData: {
      type: Object,
      default() {
        return {};
      }
    },
    hosType: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      diagAdd: [], //当前诊断表格数据
      asd: {}, //编辑表格数据
      tableLoading: false, // 表格loading
      //分页信息
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  /**
   * 表格多选框change事件（handleSelectionChange）：
   * 1. 将选中数据通过emit事件handleSelectionChange导出给父组件
   * 点击当前列（editTableRow）：
   * 1. 将选中数据通过emit事件editTableRow导出给父组件
   * * */ methods: {
    ...mapActions({
      changeRef: "diagnosis/changeRef", //刷新工具箱历次诊断
      setDiaName: "cis/setDiaName"
    }),
    //表格多选框change事件
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    // 点击当前列
    editTableRow(row) {
      this.$refs.multipleTable.setCurrentRow(row);
      this.setDiaName({
        ...row
      });
      this.$emit("editTableRow", row);
    }
  }
};
</script>
<style lang="scss" scoped>
.blue-color {
  color: $l-color-fontcolor-2;
}
</style>
