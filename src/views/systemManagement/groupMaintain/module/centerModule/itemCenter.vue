<template>
  <div class="cls height100">
    <div class="utilCls">
        <l-formt-title label="医嘱名称">
          <el-input v-model="itemFilter.keyword" placeholder="请输入医嘱名称" style="width: 100%"></el-input>
        </l-formt-title>
      <span style="float: right;margin: 5px 0;">
          <el-button @click="addGroup">新增组套</el-button>
          <el-button @click="editGroup">修改组套</el-button>
          <!--<el-button @click="saveGroup">保存组套</el-button>-->
          <el-button  @click="stopGroup">停用/启用</el-button>
      </span>
    </div>
    <div class="mainTable" style="height:calc(100% - 160px)" v-loading="loading">
      <el-table
        highlight-current-row
        default-expand-all
        @row-click="rowClick"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :cell-class-name="cellStyles"
        @expand-change="expandSelect"
        :data="tableData"
        border
        height="100%">
        <!-- 业务列 -->
        <el-table-column
          v-for="(item,index) in tableParams"
          :type="item.type"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'center'"
          :fixed="item.fixed"
        >

          <template slot-scope="scope">
            <template v-if="item.type === 'expand'">
              <dropTable class="dropTable" :data="scope.row.child"></dropTable>
            </template>
            <template>
              <!-- 可自定义内容 -->
              <span>{{ scope.row[item.prop]}}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>

  import {
    getAntibacterialAuthPage
  } from '@/api/systemManagement/drugAccessMaintain/antibacterialAuth'
  import dropTable from "./dropTable.vue"

  export default {
    name: "itemCenter",
    components: { dropTable },
    data() {
      return {
        itemFilter : {
          keyword: ''
        },
        tableData: [{
          id:1,
          groupName:111,
          itemName:'医嘱项目',
          status:'状态',
          amount:'金额',
          checkType:"检查类型",
          checkWay:'检查方法',
          checkTarget:'检查部位/标本',
          useWay:'111',
          execDep:'222'
        },{
          id:2,
          groupName:111,
          itemName:'医嘱项目',
          status:'状态',
          amount:'金额',
          checkType:"检查类型",
          checkWay:'检查方法',
          checkTarget:'检查部位/标本',
          useWay:'111',
          execDep:'222',
          child:[{
            id:22,
            itemName:'医嘱项目',
            status:'状态',
            amount:'金额',
            checkType:"检查类型",
            checkWay:'检查方法',
            checkTarget:'检查部位/标本',
          }]
        }],
        expands: [],
        getRowKeys(row) {
          return row.id
        },
        tableParams:[{
          prop: 'groupName',
          label: '组套名称'
        },   {
          prop: 'itemName',
          label: '医嘱项目',
        },  {
          prop: 'expand',
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
        }, {
          prop: 'useWay',
          label: '使用范围'
        }, {
          prop: 'execDep',
          label: '执行科室'
        }],
        pageSize:10,
        totalPage: 50,
        currentPage: 1,
        loading:false
      };
    },
    created() {

    },
    mounted() {
      // this.search();
    },
    methods: {
      cellStyles (row, column, rowIndex, columnIndex) {
        console.log(row, column, rowIndex, columnIndex);
        let flag = row.row.child === undefined || row.row.child.length === 0;
        if(row.column.property === "expand" && flag){
          return 'specialCls'
        }else{
          return ''
        }
      },
      // 折叠面板每次只能展开一行
      expandSelect(row, expandedRows) {
        console.log(row, expandedRows);
        let that = this;
        if (expandedRows.length) {
          that.expands = []
          if (row) {
            that.expands.push(row.id)
          }
        } else {
          that.expands = []
        }
      },
      getParams (){
        let obj = {
          pageNo:this.currentPage,
          pageSize:this.pageSize
        };
        return {...obj,...this.itemFilter};
      },
      rowClick(row) {
        //测试数据
        // row.antimicrobialRanges = "1";
        // row.title = "1";
        // row.status = "1";
        // row.level = "1";
        // row.way = "1";
        this.$emit('rowClick', row);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.search();
      },
      search() {
        this.getAdviceItemFun(this.getParams());
      },
      getAdviceItemFun(obj) {
        getAntibacterialAuthPage(obj)
          .then(res => {
            if (res.code === 1) {
              // this.tableData = resData;
              this.tableData = res.data;
              for(let i = 0; i < this.tableData.length; i++) {
                let row = this.tableData[i];
                this.tableData[i].status = row.status == "0" ? "激活" : "禁用";
              }
              this.totalPage = res.total;
              this.pageNo = res.pageNo;
              this.pageSize = res.pageSize;
            } else {
              this.$message('查询失败')
            }
          })
      },
      // 新增 按钮 回调函数
      handleAdd (){
        // 重置 右侧数据
        let row = {};
        this.$emit('rowClick', row);
      },

      addGroup (){
        this.$emit("addGroup");
      },
      editGroup (){
        this.$emit("editGroup");
      },
      saveGroup (){
        this.$emit("saveGroup");
      },
      stopGroup (){
        this.$emit("stopGroup");
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .cls {
    position: relative;
    .pagination {
      position: absolute;
      bottom: 10px;
      right: 0;
    }
    .utilCls {
      padding: 10px;

      > span {
        display: inline-block;
      }

      > span + span {
        margin-left: 10px;
      }
    }

    /deep/ .el-table__expanded-cell[class*=cell] {
      padding: 20px 50px !important;
    }

    .mainTable {
      /deep/ .specialCls .cell{
        display: none;
      }
    }
  }
</style>
