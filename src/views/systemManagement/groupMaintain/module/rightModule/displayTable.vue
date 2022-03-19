<template>
  <el-table
    class="mainTable"
    :data="tableData"
    border
    height="100%">
    <!-- 业务列 -->
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
        <!-- 可自定义内容 -->
        <template v-if="item.prop === 'price' || item.prop === 'amount'">
          <span>{{ scope.row[item.prop] | rounding}}</span>
        </template>
        <template v-else>
          <span>{{ scope.row[item.prop]}}</span>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "displayTable",
    components: {},
    data() {
      return {
        tableData:[],
        tableParams: [{
          prop: 'code',
          label: '收费项目编码',
          width:150
        }, {
          prop: 'itemName',
          label: '收费项目名称',
          width:150
        }, {
          prop: 'price',
          label: '单价'
        }, {
          prop: 'no',
          label: '数量',
        }, {
          prop: 'unit',
          label: '单位'
        },{
          prop: 'amount',
          label: '总金额'
        }],

      };
    },
    filters: {
      rounding(value) {
        value = value !== "" ? new Number(value) : 0;
        return value.toFixed(4);
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {},
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">

</style>
