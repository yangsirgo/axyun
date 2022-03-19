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
                  <!-- <el-select v-model="searchData.hosId" clearable placeholder="请选择">
                    <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select> -->
                </LFormtTitle>
              </el-col>
              <!-- <el-col :span="3">
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
              </el-col> -->
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
              <el-col style="text-align: right;">
                <span>日期：</span>
                <span>{{dateObj[0]}} —— {{dateObj[1]}}</span>
                <!-- <el-col :span="6">
                  <el-col>机构：<span>洋房</span></el-col>
                </el-col>
                <el-col :span="4"> -->
                <!-- <el-col>药房名称：<span>{{curStorage}}</span></el-col> -->
                <!-- <el-col :span="12">开始时间：{{dateObj[0]}}</el-col>
                  <el-col :span="12">结束时间：{{dateObj[1]}}</el-col>
                </el-col> -->
              </el-col>
              <!-- <el-col>
                <el-col :span="6">
                  <el-col>药品类型：<span>{{manageTypeName}}</span></el-col>
                </el-col>
                <el-col :span="4">
                  <el-col :span="12">开始时间：{{dateObj[0]}}</el-col>
                  <el-col :span="12">结束时间：{{dateObj[1]}}</el-col>
                </el-col>
              </el-col> -->
            </el-col>
            <el-col style="height: 600px;">
              <el-table ref="singleTable" v-if="singleTableStyle" :data="drugData" border height="600px" width="100%"  highlight-current-row
                v-loading="tlm_isLoading" element-loading-text="加载中..." @header-dragend="headerDragend" show-summary
                :summary-method="getSummaries">
                <!-- <-- show-summary summary-method="getSummaries" --> -->
                <!-- <el-table-column type="index" width="50" label="序号"></el-table-column> -->
                <el-table-column v-for="(item,index) in tableParams" :key="index" :prop="item.prop" :label="item.label" sortable
                  :min-width="item.width" :align="item.align || 'left'" header-align="center" :fixed="item.fixed" :type="item.type"
                  show-overflow-tooltip>
                  <!-- span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span> -->
                  <template slot-scope='scope'>
                    <template v-if="item.prop == 'hosId'">
                      <span>{{hosName}}</span>
                    </template>
                    <template v-else-if="item.prop == 'medicationCode'">
                      <span :val="scope.row.medicationCode" code="MedicationRouteCode" v-codeTransform></span>
                    </template>
                    <template v-else-if="item.prop == 'frequencyCode'">
                      <span columns="FREQUENCY_NAME" :conditionMap="{ FREQUENCY_CODE: scope.row.frequencyCode }"
                        tableName="hrp_frequency" v-tableTransform></span>
                    </template>
                    <template v-else>
                      <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>

            </el-col>
            <el-col>
              <el-col :span="12">
                <el-col>制表人：<span>{{operationOfName}}</span></el-col>
              </el-col>
              <el-col :span="12">
                <el-col>制表时间：<span>{{myDate}}</span></el-col>
              </el-col>
            </el-col>
            <el-col style="color: #000000;font-weight: 600;">注：长处方指使用时间超过28天的药品</el-col>
            <!-- <el-col>
              <el-pagination style="float: right;" background @size-change="changeSize" @current-change="changePage"
                :current-page="searchData.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="this.total"></el-pagination>
            </el-col> -->
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
        tlm_isLoading:false,
        listName: '长处方统计(明细)',
        singleTableStyle:true,
        // 配置代码结束
        searchData: {
          hosId: "", //机构列表
          // manageType: '', //药品类型
          // storageCode: "", //药品名称
          // eDate: "", //结束时间
          // sDate: '', //开始时间
          eDeliveryTime: "", //结束时间
          sDeliveryTime: '', //开始时间
          pageNo: 1,
          pageSize:10000,
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
        drugData: [],
        tableParams: [{
            prop: "hosId",
            label: "社康名称",
            align: 'center',
            width: 120
          },
          {
            prop: "deliveryTime",
            label: "日期",
            align: 'center',
            width: 120
          },
          {
            prop: "visitCode",
            label: "患者就诊号",
            align: 'center',
            width: 160
          },
          {
            prop: "patientName",
            label: "患者姓名",
            align: 'center',
            width: 140
          },
          {
            prop: "recipeCode",
            label: "处方唯一识别号",
            align: 'center',
            width: 180
          },
          {
            prop: "clinicDiag",
            label: "诊断",
            align: 'center',
            width: 140
          },
          {
            prop: "drugName",
            label: "药品名称",
            width: 120
          },
          {
            prop: "spec",
            label: "规格",
            width: 100
          },
          {
            prop: "oneDosageDisplay",
            label: "用量",
            align: 'center',
            width: 120  //dosageUnit单位
          },
          {
            prop: "frequencyCode",
            label: "频次",
            align: 'center',
            width: 120
          },
          {
            prop: "medicationCode",
            label: "用法",
            align: 'center',
            width: 120
          },
          {
            prop: "drugQuantityDisplay",
            label: "药品数量(单位)",
            align: 'center',
            width: 160
          },
          {
            prop: "amt",
            label: "药品金额(元)",
            align: 'center',
            width: 160
          },
          {
            prop: "longDrug",
            label: "是否长处方药品",
            align: 'center',
            width: 180
          },
          {
            prop: "controlDrug",
            label: "是否医保药品",
            align: 'center',
            width: 180
          },
          {
            prop: "basicDrug",
            label: "是否国家基本药物",
            align: 'center',
            width: 180
          },
          {
            prop: "negotiateDrug",
            label: "是否国家谈判药品",
            align: 'center',
            width: 180
          },
          {
            prop: "centralizedPurchasingDrug",
            label: "是否国家集采药品",
            align: 'center',
            width: 200
          },

        ],
        operationOfName: '',
        hosName: '', //机构名称
      };
    },
    created() {
      this.getDrugStorageList("0,1,2");
      this.operationOfName = Base64.decode(getUserName());
      this.hosName = JSON.parse(this.getPamars()).hosName;
     this.dateObj[0] = this.getNowFormatDate()+ " 00:00:00";
     this.dateObj[1] = this.getNowFormatDate()+ " 23:59:59";
      this.listForPhaList();
      console.log(new Date(),"获取当前时间");
    },
    methods: {
      // 默认一天时间
      getSummaries(param) {
        console.log(param);
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
           const values = data.map(function(item, index, arr) {
             return item
           });
          if (column.property == 'longDrug' || column.property == 'controlDrug'  || column.property == 'controlDrug' || column.property == 'basicDrug' || column.property == 'negotiateDrug' || column.property == 'centralizedPurchasingDrug') {
            let result = [];
            let result1 = [];
            let obj = {};
            for (var i = 0; i < values.length; i++) {
              if (values[i][column.property] == "是" && !obj[values[i].drugId]) {
                result.push(1);
                obj[values[i].drugId] = true;
              }
            }
            sums[index] = result.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 元';
          }
        });

        return sums;
        let result = [];
      },
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
         // manageType: '', //药品类型
         // storageCode: "", //药品名称
         // eDate: "", //结束时间
         // sDate: '', //开始时间
         eDeliveryTime: "", //结束时间
         sDeliveryTime: '', //开始时间
         pageNo: 1,
         pageSize:10000,
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
        console.log(this.dateObj);
      },
      manageTypeFun(val) {
        console.log(val);
        for (let i = 0; i < this.storageTypeList.length; i++) {
          if (val == this.storageTypeList[i].code) {
            this.manageTypeName = this.storageTypeList[i].name;
            break
          }
        }
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
            } else {
              this.$message.error(res.msg || "获取药库数据失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药库数据");
            }
          })
          .catch(res => {
            this.$message.error(res.msg || "获取药库数据失败");
          });
      },
      //获取列表数据
      async listForPhaList() {
        this.tlm_isLoading = true;
        this.$showLoading();
        this.singleTableStyle = false;
        this.searchData.sDeliveryTime = this.dateObj[0] ? this.dateObj[0] : '';
        this.searchData.eDeliveryTime = this.dateObj[1] ? this.dateObj[1] : '';
        hmmBaseApi.listForLongRecipeD(this.searchData).then(res => {
            if (res.code == 1) {
              console.log(res.data, '打印报表的数据');
              this.drugData = res.data;
              this.total = res.total;
              this.singleTableStyle = true;
              this.tlm_isLoading = false;
              this.$hideLoading();
            } else {
              this.$hideLoading();
              this.$message.error(res.msg || "获取统计数据失败");
            }
            if (res.data.length === 0) {
              this.$message.error("暂无统计数据");
            }
          })
          .catch(res => {
            this.$hideLoading();
            this.$message.error(res.msg || "获取统计数据失败");
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
