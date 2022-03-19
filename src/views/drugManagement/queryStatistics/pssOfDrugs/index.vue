<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="3">
                <LFormtTitle label="机构列表">
                      <el-input :value="hosName" disabled=""></el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="6" style="display: flex;justify-content: space-around;align-items: center;">
                <LFormtTitle label="日期" labelWidth="76">
                  <el-date-picker v-model="dateObj" type="datetimerange" :clearable="falseStya" align="right" unlink-panels range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="dateObjFun"></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="9" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset" plain>重置</el-button>
                <el-button type="primary" plain @click="exportExcel">导出</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-col>
              <h2 style="text-align: center;margin: 0px;">{{listName}}</h2>
              <el-col>
                <el-col :span="6">
                  <el-col>机构：{{hosName}}</el-col>
                </el-col>
                <el-col :span="6">
                  <!-- <el-col>药房名称：<span>{{curStorage}}</span></el-col> -->
                  <el-col :span="12">开始时间：{{dateObj[0]}}</el-col>
                  <el-col :span="12">结束时间：{{dateObj[1]}}</el-col>
                </el-col>
              </el-col>
            </el-col>
            <el-table ref="singleTable" :data="drugData" border width="100%" height="100%" highlight-current-row
              v-loading="tlm_isLoading" element-loading-text="加载中..." @header-dragend="headerDragend" id="out-table">
              <el-table-column type="index" width="70" label="序号" show-overflow-tooltip></el-table-column>
              <el-table-column v-for="(item,index) in tableParams" :key="index" :prop="item.prop" :label="item.label" sortable
                :min-width="item.width" :align="item.align || 'left'" header-align="center" :fixed="item.fixed" :type="item.type"
                show-overflow-tooltip>
                <template slot-scope='scope'>
                    <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-col>
              <el-col :span="12">
                <el-col>制表人：<span>{{operationOfName}}</span></el-col>
              </el-col>
              <el-col :span="12">
                <el-col>制表时间：<span>{{myDate}}</span></el-col>
              </el-col>
            </el-col>
            <el-col>
              <el-pagination style="float: right;" background @size-change="changeSize" @current-change="changePage"
                :current-page="searchData.pageNo" :page-sizes="[10, 20, 500, 1000]" :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="this.total"></el-pagination>
            </el-col>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
  import FlowMenu from "@/components/FlowMenu";
  import hmmBaseApi from "@/api/hmm/base";
  import {
    print,
    preview,
    onPreview
  } from "@/utils/print";
  import {
    jsonToExcel
  } from "@/utils/excel/excel";
  import {
    getRoles,
    getRole,
    setRole,
    getUserName
  } from "@/utils/auth";
  import Base64 from "@/utils/base64";
  import XLSX from "xlsx";
  import FileSaver from "file-saver";

  export default {
    name: "inStorageList",
    components: {
      FlowMenu
    },
    data() {
      return {
        // 配置代码  开始
        // 列表名字
        listName:'药品阶段性销售统计',
        falseStya:false,
        // 配置代码结束
        searchData: {
          hosId: "", //机构列表
          storageCode: "", //药品名称
          eDate: "", //结束时间
          sDate: '', //开始时间
          pageNo: 1,
          pageSize: 20,
        },
        total: 0,
        dateObj: [],
        curStorage: '',
        myDate: this.getNowFormatDate(),
        tlm_isLoading: false,
        drugData: [],
        tableParams: [
          {
            prop: "drugName",
            label: "药品名称",
            align:'center',
            // width: 160
          },
          {
            prop: "spec",
            label: "规格",
            align:'center',
            // width: 160
          },
          {
            prop: "originName",
            label: "生产厂商",
            align:'center',
            // width: 160
          },
          {
            prop: "price",
            label: "单价（元）",
            align:'center',
          },
          {
            prop: "drugStockDisplay",
            label: "当前库存量",
            align:'center',
            // width: 160
          },
          {
            prop: "quantityDisplay",
            label: "销售量",
            align:'center',
            // width: 160
          },
          {
            prop: "amt",
            label: "销售金额（元）",
            align:'center',
            // width: 160
          },
        ],
        operationOfName:'',
        hosName:'',
      };
    },
    created() {
      this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
      this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
      this.listForPhaList();
      this.hosName = JSON.parse(this.getPamars()).hosName;
      this.operationOfName =Base64.decode(getUserName());
    },
    methods: {
      getPamars() {
        const Pamars = "pamars";
        return localStorage.getItem(Pamars);
      },
      search() {
        this.listForPhaList()
      },

      reset() {
        this.searchData = {
          hosId: "", //机构列表
          storageCode: "", //药品名称
          eDate: "", //结束时间
          sDate: '', //开始时间
          pageNo: 1,
          pageSize: 20,
        };
        this.dateObj = [];
        this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
        this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
      },
      // 导出
      exportExcel() {
        if (this.drugData.length === 0) {
          this.$message.warning("暂无要导出数据!");
          return;
        }
        /* generate workbook object from table */
        // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
        let fix = document.querySelector(".el-table__fixed");
        let wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(
            document.querySelector("#out-table").removeChild(fix)
          );
          document.querySelector("#out-table").appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
        }
        /* get binary string as output */
        let wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], {
              type: "application/octet-stream"
            }),
            this.listName + '.xlsx'
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
      },
      // 分页
      changeSize(val) {
        this.searchData.pageSize = val;
        this.listForPhaList();
      },
      changePage(val) {
        this.searchData.pageNo = val;
        this.listForPhaList();
      },
      // 分页
      headerDragend() {
        this.$refs.singleTable.doLayout();
      },
      dateObjFun() {
        if(!this.dateObj){
           this.dateObj = [];
           this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
           this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
        }
        console.log(this.dateObj);
      },
     getNowFormatDate() {
       var date = new Date();
       var seperator1 = "-";
       var seperator2 = ":";
       var month = date.getMonth() + 1;
       var strDate = date.getDate();
       if (month >= 1 && month <= 9) {
         month = "0" + month;
       }
       if (strDate >= 0 && strDate <= 9) {
         strDate = "0" + strDate;
       }
       var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate ;
       // + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
       return currentdate;
     },
      //获取列表数据
      async listForPhaList() {
        this.searchData.sDate = this.dateObj[0] ? this.dateObj[0] : '';
        this.searchData.eDate = this.dateObj[1] ? this.dateObj[1] : '';
        hmmBaseApi.listForOutIn(this.searchData).then(res => {
            if (res.code == 1) {
              this.drugData = res.data;
              this.total = res.total;
            } else {

              this.$message.error(res.msg || "获取数据失败");
            }
            if (res.data.length === 0) {
              this.$message.error("暂无数据");
            }
          })
          .catch(res => {
            this.$message.error(res.msg || "获取数据失败");
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    overflow: hidden;
  }

  .main {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: $l-color-white;
  }

  .align-right {
    text-align: right;
  }

  .near-input {
    line-height: 32px;
  }

  .table {
    height: calc(100% - 200px);
    margin: 20px 0;
    /deep/ .el-table .cell.el-tooltip{
      width: 100% !important;
    }
    /deep/.el-table .cell{
     line-height: 40px !important;
     font-size: 16px;
    }
  }

  .page {
    .el-pagination {
      padding: 0;

      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
</style>
