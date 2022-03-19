<template>
  <div class="height100 cls-right">
    <el-row class="height100">
      <el-col :span="8" class="height100">
        <el-card class="height100">
          <div class="utils">
            <el-input v-model="utils.adviceItemName" placeholder="输入关键字进行检索" style="width: 70%"></el-input>
            <el-button class="fr" type="primary" @click="search">查询</el-button>
          </div>
          <div class="centerTable">
            <el-table
              ref="singleTable"
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
          <!--<el-pagination-->
            <!--class=""-->
            <!--@size-change="handleSizeChange"-->
            <!--@current-change="handleCurrentChange"-->
            <!--:current-page.sync="currentPage"-->
            <!--:page-sizes="[10, 20, 50, 100]"-->
            <!--:page-size="pageSize"-->
            <!--layout="total, sizes, prev, pager, next"-->
            <!--:total="totalPage">-->
          <!--</el-pagination>-->
        </el-card>
      </el-col>
      <el-col :span="16" class="height100" style="padding-left: 10px">
        <el-card class="height100">
          <l-card-title style="margin-left: 15px;">
            <span slot="left">关联医嘱项目</span>
          </l-card-title>
          <relationItem ref="relationItem" @save="findFieldList" style="height: calc(100% - 63px);"></relationItem>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import relationItem from "./relationItem.vue"
  import { adviceItemListPage } from '@/api/systemManagement/dataMaintain/adviceItem'
  import { getDoctorsAdviceList } from '@/api/systemManagement/dataMaintain/doctorsAdvice'
  import {findFieldList} from '@/api/systemManagement/dataMaintain/adviceItem'

  export default {
    name: "index",
    components: { relationItem },
    data() {
      return {
        utils: {
          adviceItemName:''
        },
        tableParams:[{
          prop: 'name',
          label: '用法'
        }
        // ,
        //   {
        //   prop: 'remark',
        //   label: '说明'
        // }
        ],
        tableData : [],
        pageSize:10,
        totalPage: 50,
        currentPage: 1,
        loading:false
      };
    },
    created() {
      // this.search();
      //查询字典项
      this.findFieldList();


    },
    mounted() {

    },
    methods: {
      rowClick(row) {
        console.log("row" + JSON.stringify(row))
        this.$refs.relationItem && this.$refs.relationItem.loadData(row)
      },
      search() {
        // this.getAdviceItemFun(this.getParams());
        let json = {};
        json.val = this.utils.adviceItemName;
        this.findFieldList(json);
      },
      getParams (){
        let obj = {
          pageNo:this.currentPage,
          pageSize:this.pageSize
        };
        return {...obj,...this.itemFilter};
      },
      // getAdviceItemFun(obj) {
      //   adviceItemListPage(obj)
      //     .then(res => {
      //       if (res.code === 1) {
      //         // this.tableData = resData;
      //         this.tableData = res.data;
      //         for(let i = 0; i < this.tableData.length; i++) {
      //           let row = this.tableData[i];
      //           this.tableData[i].status = row.status == "0" ? "激活" : "禁用";
      //         }
      //         this.totalPage = res.total;
      //         this.pageNo = res.pageNo;
      //         this.pageSize = res.pageSize;
      //       } else {
      //         this.$message('查询失败')
      //       }
      //     })
      // },
      handleSizeChange(val) {
        this.search();
      },
      handleCurrentChange(val) {
        this.search();
      },


      findFieldList(obj) {
        findFieldList(obj)
          .then(res => {
            if (res.code === 1) {
              console.log("res.data" + JSON.stringify(res.data));
              this.tableData = res.data || [];
              this.rowClick(this.tableData[0] || []);
              setTimeout(()=>{
                this.$refs.singleTable.setCurrentRow(this.tableData[0] || []);
              },0);
            } else {
              this.$message('查询失败')
            }
          })
      },


    },
    filters: {
      rounding(value) {
        value = value !== "" ? new Number(value) : 0;
        return value.toFixed(4);
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .cls-right {
    /*margin-left: 360px;*/
    .utils {
      padding: 10px;
    }
    .centerTable {
      height: calc(100% - 96px);
    }
    .cls-right-center {
      margin-right: 750px;
      position: relative;
    }
    .cls-right-right {
      width: 740px;
      float: right;
    }
    .pagination {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
</style>
