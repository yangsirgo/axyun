<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true" top="5vh">
    <div class="dialog-content">
      <el-table
        :data="tableData"
        highlight-current-row
        border
        width="100%"
        height="100%"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="40"
        >
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'siPayUpLimit'">{{
              (scope.row[item.prop] || 0).toFixed(4)
            }}</template>
            <template v-else-if="item.align === 'right'">{{
              (scope.row[item.prop] || 0).toFixed(2)
            }}</template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import appointment from "@/api/appointment/appointment";

export default {
  name: "LSidetailTable",
   props: {
    hisTradeId: {
      type: Object,
      defalut: ""
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      columns: [
        {
          label: "费用序号",
          prop: "hisChargeDetailId",
          width: 80,
        },
        {
          label: "医院项目编码",
          prop: "hisChargeItemCode",
          width: 110,
        },
        {
          label: "医院项目名称",
          prop: "hisChargeItemName",
          width: 150,
        },
        {
          label: "超限价自负金额",
          prop: "overSiLimitSelfPayAmt",
          width: 100,
          align: "right",
        },
        {
          label: "单价",
          prop: "price",
          width: 60,
          align: "right",
        },
        {
          label: "医保项目编码",
          prop: "siChargeItemCode",
          width: 130,
        },
        {
          label: "医保项目名称",
          prop: "siChargeItemName",
          width: 150,
        },
        {
          label: "限价",
          prop: "siPayUpLimit",
          width: 60,
          align: "right",
        },
        {
          label: "报销范围金额",
          prop: "withSiReimburseAmt",
          width: 100,
          align: "right",
        },
      ],
    };
  },
  created() {
    this.getSiDetail();
  },
  methods: {
    async getSiDetail() {
      this.tableData = [];
      this.loading = true;
      try {
        let res = await appointment.getFullTradeChargeDetailList({
          hisTradeId: this.hisTradeId
        });
        if (res.code == 1) {
          this.tableData = res.data;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-content {
  padding: 8px;
  height: 500px;
}
</style>