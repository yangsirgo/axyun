<template>
  <div class="cls height100">
    <div class="utilCls">
        <l-formt-title label="搜索"  style="width: 75%;margin-top: 5px">
          <el-input v-model="itemFilter.keyword" @keyup.native.enter="search" placeholder="抗菌药物级别/医生职称/限制范围/审核路径" style="width: 100%"></el-input>
        </l-formt-title>
      <span style="float: right;margin: 5px 0;">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="handleAdd">新增</el-button>
      </span>
    </div>
    <div style="height:calc(100% - 160px)" v-loading="loading">
      <el-table
        highlight-current-row
        @row-click="rowClick"
        :data="tableData"
        border
        height="100%">
        <!-- 需要列 -->
        <el-table-column
          type="index"
          label="序号"
          width="50px"
          header-align="center"
          align="center"
        ></el-table-column>
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
            <span>{{ scope.row[item.prop] || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
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
  export default {
    name: "itemCenter",
    components: {},
    data() {
      return {
        itemFilter : {
          keyword: ''
        },
        tableData: [],
        tableParams:[{
          prop: 'level',
          label: '抗菌药物级别'
        },   {
          prop: 'doctorTitle',
          label: '医师职称'
        },{
          prop: 'ranges',
          label: '限制范围'
        }, {
          prop: 'reviewPath',
          label: '审核路径'
        }, {
          prop: 'status',
          label: '使用状态'
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
      this.search();
    },
    methods: {
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
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .cls {
    .utilCls {
      padding: 10px;

      > span {
        display: inline-block;
      }

      > span + span {
        margin-left: 10px;
      }
    }
  }
</style>
