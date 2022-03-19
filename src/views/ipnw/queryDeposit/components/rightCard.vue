<template>
  <div class="right-card">
    <p class="icon">
      <LDatePickerwithTitle
        @change="changeDate"
        :title="title"
        :value="selectValue"
      >
      </LDatePickerwithTitle>
    </p>
    <div class="table-con">
      <el-table
        header-cell-class-name="headerCls"
        row-class-name="rowStyleCls"
        ref="singleTable"
        :data="tabsList"
        highlight-current-row
        style="width: 100%"
        height="100%"
        v-loadmore="load"
        stripe
        border
        v-loading="isLoading"
        element-loading-text="加载中..."
      >
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          align="left"
          show-overflow-tooltip
          header-align="left"
          :min-width="item.width"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import LDatePickerwithTitle from "../../returnDrug/components/LDatePickerwithTitle";
export default {
  name: "",
  methods: {
    queryTableData(id) {
      // 查询表格数据
    },
    // 切换日期 更新数据
    changeDate() {
      console.log(this.selectValue);
      let id = 0;
      this.queryTableData(id);
    }
  },
  components: {
    LDatePickerwithTitle
  },
  mounted() {
    // 初始化表格数据
    this.queryTableData();
  },
  data() {
    return {
      title: "交款日期",
      selectValue: ["2019-09-11T16:00:00.000Z", "2019-10-17T15:59:59.000Z"],
      load: true,
      isLoading: false,
      // 分页控制参数
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      tabsList: [
        {
          id: 1,
          paymentDate: "2019-06-12 17:00",
          payment: "3000.00",
          payWay: "现金",
          recordNum: "00000000671",
          payWindow: "住院收费",
          payType: "收预交金",
          operator: "李浩"
        },
        {
          id: 2,
          paymentDate: "2019-06-12 17:00",
          payment: "3000.00",
          payWay: "现金",
          recordNum: "00000000690",
          payWindow: "住院收费",
          payType: "收预交金",
          operator: "李浩"
        }
      ],
      tableColumn: [
        {
          prop: "paymentDate",
          label: "交款日期",
          width: "40"
        },
        {
          prop: "payment",
          label: "交费金额",
          width: "30"
        },
        {
          prop: "payWay",
          label: "支付方式",
          width: "30"
        },
        {
          prop: "recordNum",
          label: "收据号",
          width: "30"
        },
        {
          prop: "payWindow",
          label: "交款窗口",
          width: "30"
        },
        {
          prop: "payType",
          label: "交款类型",
          width: "30"
        },
        {
          prop: "operator",
          label: "操作员",
          width: "30"
        }
      ]
    };
  }
};
</script>

<style lang='scss' scoped>
.right-card {
  padding: 20px;
  .table-con {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
