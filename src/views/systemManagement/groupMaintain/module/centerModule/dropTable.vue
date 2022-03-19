<template>
  <div class="height100">
    <el-table
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
        :align="item.align || 'center'"
        :fixed="item.fixed"
      >

        <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <span>{{ scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "dropTable",
    props:{
      data:{
        default:[]
      }
    },
    components: {},
    data() {
      return {
        tableData:this.data,
        tableParams:[ {
          prop: 'itemName',
          label: '医嘱项目',
        },  {
          prop: '',
          label: '',
          type:"expand"
        },{
          prop: 'status',
          label: '状态'
        }, {
          prop: 'amount',
          label: '金额'
        }, {
          prop: 'checkType',
          label: '检查类型'
        }, {
          prop: 'checkWay',
          label: '检查方法'
        }, {
          prop: 'checkTarget',
          label: '检查部位/标本'
        }],
      };
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
