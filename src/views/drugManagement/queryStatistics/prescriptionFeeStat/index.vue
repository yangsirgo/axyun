<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="3">
                <LFormtTitle label="机构列表">
                  <el-input :value="hosName" disabled></el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="6" style="display: flex;justify-content: space-around;align-items: center;">
                <LFormtTitle label="操作日期" labelWidth="76">
                  <el-date-picker v-model="dateObj" type="datetimerange" align="right" unlink-panels range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00','23:59:59']" @change="dateObjFun"></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="9" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset" plain>重置</el-button>
               <!-- <el-button type="primary" plain @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
                <el-button type="primary" plain @click="exportExcel">导出</el-button> -->
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-col>
              <h2 style="text-align: center;margin: 0px;">{{listName}}</h2>
              <el-col>
                <el-col :span="6">
                  <el-col>机构：<span>{{hosName}}</span></el-col>
                </el-col>
                <el-col :span="18">
                  <el-col :span="8">开始时间：{{dateObj[0]}}</el-col>
                  <el-col :span="8">结束时间：{{dateObj[1]}}</el-col>
                  <el-col :span="8">统计时间：{{myDate}}</el-col>
                </el-col>
              </el-col>
            </el-col>
            <el-table ref="singleTable" :data="drugData" border  height='450px' style="width:'100%';" highlight-current-row
              v-loading="tlm_isLoading" element-loading-text="加载中..." @header-dragend="headerDragend" show-summary @summary-method="getSummaries">
              <el-table-column type="index" width="70" label="序号"></el-table-column>
              <el-table-column v-for="(item,index) in tableParams" :key="index" :prop="item.prop" :label="item.label" sortable
                :min-width="item.width" :align="item.align || 'left'" header-align="center" :fixed="item.fixed" :type="item.type"
                show-overflow-tooltip>
                <template slot-scope='scope'>
                  <template>
                    <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                  </template>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
  import FlowMenu from "@/components/FlowMenu";
  import hmmBaseApi from "@/api/hmm/base";
  import stock from "@/api/hmm/stock";
  import {
    blukToOutfit,
    outfitToBluk
  } from "@/utils/drugManagement.js";
  import formatNum from "@/utils/formatPrice.js";
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
  export default {
    name: "inStorageList",
    components: {
      FlowMenu
    },
    data() {
      return {
        // 配置代码  开始
        // 列表名字
        listName:'处方费别统计',

        // 配置代码结束
        searchData: {
          hosId: "", //机构列表
         eDeliveryTime: "", //结束时间
         sDeliveryTime: '' //开始时间
        },
        total: 0,
        dateObj: [],
        manageTypeName: '',
        curStorage: '',
        myDate: this.getNowFormatDate(),
        drugStorageList: [],
        tlm_isLoading: false,
        drugData: [],
        tableParams: [
          {
            prop: "companyName",
            label: "参保类型",
            align:'center',
            // width: 160
          },
          {
            prop: "recipeCount",
            label: "处方数",
            align:'right',
            // width: 160
          },
          {
            prop: "wDrugAmt",
            label: "西药金额（元）",
            align:'right',
            // width: 160
          },
          {
            prop: "cDrugAmt",
            label: "中成药金额（元）",
            align:'right',
            // width: 160
          },
          {
            prop: "hDrugAmt",
            label: "草药金额（元）",
            align:'right',
            // width: 160
          },
          {
            prop: "recipeAmt",
            label: "处方金额（元）",
            align:'right',
            // width: 160
          }
        ],
        operationOfName: '',
        hosName: '', //机构名称
      };
    },
    created() {
      this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
      this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
      this.listForCompany();
      this.operationOfName = Base64.decode(getUserName());
      this.hosName = JSON.parse(this.getPamars()).hosName;
    },
    updated(){
      this.$nextTick(() => {
         this.$refs['singleTable'].doLayout();
      })
    },
    methods: {
      getPamars() {
        const Pamars = "pamars";
        return localStorage.getItem(Pamars);
      },
      search() {
        this.listForCompany()
      },
      reset() {
        this.searchData = {
          hosId: "", //机构列表
          eDeliveryTime: "", //结束时间
          sDeliveryTime: '' //开始时间
        };
       this.dateObj = [];
       this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
       this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
      },
      print() {},
      exportExcel() {},
      // 分页
      changeSize(val) {
        this.searchData.pageSize = val;
        this.listForCompany();
      },
      changePage(val) {
        this.searchData.pageNo = val;
        this.listForCompany();
      },
      // 分页

      headerDragend() {
        this.$refs.singleTable.doLayout();
      },
      dateObjFun() {
       if(!this.dateObj){
         this.dateObj = [];
       }
       console.log(this.dateObj);
      },
      storageChange(val) {
        let item = this.drugStorageList.find(item => item.code === val);
        this.curStorage = item.name;
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
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
         // +" " + date.getHours() + seperator2 + date.getMinutes() +seperator2 + date.getSeconds();
        return currentdate;
      },
      //获取列表数据
      async listForCompany() {
        this.$showLoading();
        this.searchData.sDeliveryTime = this.dateObj[0] ? this.dateObj[0] : '';
        this.searchData.eDeliveryTime = this.dateObj[1] ? this.dateObj[1] : '';
        hmmBaseApi.listForCompany(this.searchData).then(res => {
            if (res.code == 1) {
              this.drugData = res.data;
              this.total = res.total;
              this.$hideLoading();
            } else {
              this.$hideLoading();
              this.$message.error(res.msg || "获取数据失败");
            }
            if (res.data.length === 0) {
              this.$hideLoading();
              // this.$message.error("暂无数据");
            }
          })
          .catch(res => {
            this.$hideLoading();
            this.$message.error(res.msg || "获取数据失败");
          });
      },
      getSummaries(param) {
              const { columns, data } = param;
              const sums = [];
              columns.forEach((column, index) => {
                if (index === 0) {
                  sums[index] = '合计';
                  return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                  sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                      return prev + curr;
                    } else {
                      return prev;
                    }
                  }, 0);
                  sums[index] += ' 元';
                } else {
                  sums[index] = 'N/A';
                }
              });

              return sums;
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
