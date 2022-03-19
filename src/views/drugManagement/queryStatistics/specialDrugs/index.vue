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
              <el-col :span="3">
                <LFormtTitle label="药品类型">
                  <el-select v-model="searchData.manageType" clearable placeholder="请选择" @change="manageTypeFun">
                    <el-option v-for="item in storageTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="药房名称" labelWidth="76">
                  <el-select v-model="searchData.storageCode" clearable placeholder="请选择" @change="storageChange">
                    <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="6" style="display: flex;justify-content: space-around;align-items: center;">
                <LFormtTitle label="收费日期" labelWidth="76">
                  <el-date-picker v-model="dateObj" type="datetimerange" align="right" unlink-panels range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00','23:59:59']"  value-format="yyyy-MM-dd HH:mm:ss"
           @change="dateObjFun"></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="9" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset" plain>重置</el-button>
                <el-button type="primary" plain @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
                <el-button type="primary" plain @click="exportExcel">导出</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-col>
              <h2 style="text-align: center;margin: 0px;">特殊药品使用情况统计</h2>
              <el-col>
                <el-col :span="6">
                  <el-col>机构：<span>{{hosName}}</span></el-col>
                </el-col>
                <el-col :span="4">
                  <el-col>药房名称：<span>{{curStorage}}</span></el-col>
                </el-col>
              </el-col>
              <el-col>
                <el-col :span="6">
                  <el-col>药品类型：<span>{{manageTypeName}}</span></el-col>
                </el-col>
                <el-col :span="6">
                  <el-col :span="12">开始时间：{{dateObj[0]}}</el-col>
                  <el-col :span="12">结束时间：{{dateObj[1]}}</el-col>
                </el-col>
              </el-col>
            </el-col>
            <el-table ref="singleTable" :data="drugData" border width="100%" height="100%" highlight-current-row
              v-loading="tlm_isLoading" element-loading-text="加载中..." @header-dragend="headerDragend" id="out-table">
              <el-table-column v-for="(item,index) in tableParams" :key="index" :prop="item.prop" :label="item.label" sortable
                :min-width="item.width" :align="item.align || 'left'" header-align="center" :fixed="item.fixed"
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
                :current-page="searchData.pageNo" :page-sizes="[10, 20, 30, 40, 100, 200, 1000]" :page-size="searchData.pageSize"
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
  import XLSX from "xlsx";
  import FileSaver from "file-saver";
  import {
    blukToOutfit,
    outfitToBluk
  } from "@/utils/drugManagement.js";
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
        searchData: {
          hosId: "", //机构列表
          manageType: '', //药品类型
          manageTypeList: 'W, 1, 2, D, M, Z',
          storageCode: "", //药品名称
          eDate: "", //结束时间
          sDate: '', //开始时间
          pageNo: 1,
          pageSize: 20,
        },
        total: 0,
        dateObj: [],
        manageTypeName: '',
        curStorage: '',
        myDate: this.getNowFormatDate(),
        drugStorageList: [],
        storageTypeList: [{
            "wubi": "FUYSA",
            "GBCode": "no has",
            "code": "W",
            "pinyin": "WTMZY",
            "name": "无痛麻醉药",
            "_id": "084975549e2f4cbda6f550ba9f5fbda9"
          },

          {
            "wubi": "GOOA",
            "GBCode": "no has",
            "code": "1",
            "pinyin": "YLJY",
            "name": "一类精药",
            "_id": "282f91eaa7cd42b5a1876d3b25a4508d"
          },
          {
            "wubi": "GNAK",
            "GBCode": "no has",
            "code": "D",
            "pinyin": "DXYP",
            "name": "毒性药品",
            "_id": "367a22cc869840daa0c06836dd8b58e1"
          },
          {
            "wubi": "FOOA",
            "GBCode": "no has",
            "code": "2",
            "pinyin": "ELJY",
            "name": "二类精药",
            "_id": "568eea3045944192b29943b06a17fadf"
          },
          {
            "wubi": "KTAK",
            "GBCode": "no has",
            "code": "Z",
            "pinyin": "GZYP",
            "name": "贵重药品",
            "_id": "908d0488860244cb8ef07145eba3426f"
          },
          {
            "wubi": "YSAK",
            "GBCode": "no has",
            "code": "M",
            "pinyin": "MZYP",
            "name": "麻醉药品",
            "_id": "e9c69de0390146cc88316265758e129c"
          }
        ],
        tlm_isLoading: false,
        drugData: [],
        tableParams: [{
            prop: "patientName",
            label: "姓名",
            width: 120
          },
          {
            prop: "patientGenderName",
            label: "性别",
            width: 80
          },
          {
            prop: "patientBirthDate",
            label: "出生日期",
            width: 100
          },
          {
            prop: "drugName",
            label: "药品名称",
            width: 120
          },
          {
            prop: "spec",
            label: "规格",
            width: 200
          },
          {
            prop: "expiryDate",
            label: "有效期",
            width: 100
          },
          {
            prop: "batchNum",
            label: "批号",
            width: 120
          },
          {
            prop: "drugQuantityDisplay",
            label: "数量",
            width: 160
          },
          {
            prop: "doctorUserName",
            label: "开单医生",
            width: 160
          },
          {
            prop: "chargeTime",
            label: "收费时间",
            width: 160
          }
        ],
        operationOfName: '',
        hosName: '', //机构名称
      };
    },
    created() {
      this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
      this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
      this.listForPhaList();
      this.getDrugStorageList("0,1,2");
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
          manageType: '', //药品类型
          manageTypeList: 'W, 1, 2, D, M, Z',
          storageCode: "", //药品名称
          eDate: "", //结束时间
          sDate: '', //开始时间
          pageNo: 1,
          pageSize: 20,
        };
        this.dateObj = [];
        this.manageTypeName = "";
        this.curStorage = "";
        this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
        this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
      },
      print() {
        let data = {};
        data.title = "特殊药品使用情况统计";
        data.detailList = this.drugData;
        onPreview(data, "特殊药品使用情况统计");
      },
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
            '特殊药品使用情况统计.xlsx'
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
        }
        console.log(this.dateObj);
      },
      manageTypeFun(val) {
        console.log(val);
        if(val){
          for (let i = 0; i < this.storageTypeList.length; i++) {
            if (val == this.storageTypeList[i].code) {
              this.manageTypeName = this.storageTypeList[i].name;
              break
            }
          }
        }else{
          this.manageTypeName = ''
        }

      },
      storageChange(val) {
        if(val === undefined || val === ""){
          this.curStorage = '';
          return;
        }
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
       var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate ;
       // + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
       return currentdate;
     },
      //获取药库数据
      getDrugStorageList(params) {
        hmmBaseApi
          .getDrugStorage(params)
          .then(res => {
            if (res.code == 1) {
              this.drugStorageList = this.drugStorageList.concat(res.data);
              if (this.drugStorageList.length) {
                this.searchData.storageCode = this.drugStorageList[0].code;
                this.curStorage = this.drugStorageList[0].name;
              }
            } else {
              this.$message.error(res.msg || "获取药房数据失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药房数据");
            }
          })
          .catch(res => {
            this.$message.error(res.msg || "获取药房数据失败");
          });
      },
      //获取列表数据
      async listForPhaList() {
         this.$showLoading();
        this.searchData.sDate = this.dateObj[0] ? this.dateObj[0] : '';
        this.searchData.eDate = this.dateObj[1] ? this.dateObj[1] : '';
        hmmBaseApi.listForPha(this.searchData).then(res => {
            if (res.code == 1) {
              this.drugData = res.data;
              this.total = res.total;
               this.$hideLoading();
            } else {
              this.$hideLoading();
              this.$message.error(res.msg || "获取数据失败");
            }
            if (res.data.length === 0) {
              // this.$message.error("暂无数据");
            }
            this.$hideLoading();
          })
          .catch(res => {
            this.$hideLoading();
            this.$message.error(res.msg || "获取数据失败");
          });
      },
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
