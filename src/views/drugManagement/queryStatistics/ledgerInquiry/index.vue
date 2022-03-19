<template>
  <div class="wrapper height100">
    <div class="main height100">
      <div class="main_wrap height100">
        <flow-menu>
          <slot name="content">
            <div class="ledger width100 height100">
              <div class="search-input">
                <el-row :gutter="10">
                  <el-col :span="6">
                    <LFormtTitle label="操作日期" labelWidth="80">
                      <el-date-picker
                        v-model="dateObj"
                        type="datetimerange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                      ></el-date-picker>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="3">
                    <LFormtTitle label="药房" labelWidth="76">
                      <el-select
                        v-model="searchData.storageCode"
                        clearable
                        placeholder="请选择"
                        @change="storageChange"
                      >
                        <el-option
                          v-for="item in drugStorageList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="4">
                    <LFormtTitle
                      class="drug-box"
                      label="药品名称"
                      labelWidth="76"
                    >
                      <drug-info-list
                        suffix-icon="el-icon-search"
                        @send-data="getSearchData"
                        :storageCode="searchData.storageCode"
                      ></drug-info-list>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="3">
                    <LFormtTitle label="方式">
                      <el-select v-model="searchData.type" clearable placeholder="请选择">
                        <el-option
                          v-for="item in storageTypeList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="6" style="text-align: right">
                    <el-button type="primary" @click="search">查询</el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="drug-info">
                <el-row :gutter="20">
                  <el-col :span="5">{{ drugInfo.drugName }}</el-col>
                  <el-col :span="5">
                    生产厂家：
                    <span
                      :val="drugInfo.originCode"
                      code="Manufacturer"
                      v-codeTransform
                    ></span>
                  </el-col>
                  <el-col :span="5">药房：{{ curStorage }}</el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="5">{{ drugInfo.spec }}</el-col>
                  <el-col :span="5"
                    >开始日期：{{ (dateObj && dateObj[0]) || "" }}</el-col
                  >
                  <el-col :span="5"
                    >结束日期：{{ (dateObj && dateObj[1]) || "" }}</el-col
                  >
                </el-row>
              </div>
              <div class="drug-list-cont">
                <el-table
                  ref="singleTable"
                  :data="drugData"
                  border
                  width="100%"
                  height="100%"
                  highlight-current-row
                  v-loading="tlm_isLoading"
                  element-loading-text="加载中..."
                  @header-dragend="headerDragend"
                  id="out-table"
                >
                  <el-table-column
                    v-for="(item, index) in tableParams"
                    :key="index"
                    sortable
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :header-align="item.align || 'center'"
                    :align="item.align || 'left'"
                    :fixed="item.fixed"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <!-- 可自定义内容 -->
                      <template v-if="item.prop === 'type'">
                        <span>{{ wayShowObj[scope.row.type] }}</span>
                      </template>
                      <template v-else-if="item.prop == 'inAmt'">
                        <span :class="{ green: scope.row.inQuantity > 0 }">{{
                          formatNum(scope.row.inAmt)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop == 'outAmt'">
                        <span :class="{ red: scope.row.outQuantity > 0 }">{{
                          formatNum(scope.row.outAmt)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop == 'purchasePrice'">
                        <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                      </template>
                      <template v-else-if="item.prop == 'price'">
                        <span>{{ formatNum(scope.row.price) }}</span>
                      </template>
                      <template v-else>
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page">
                <el-button
                  class="less-btn float-left"
                  type="primary"
                  plain
                  @click="print"
                  v-hotKey="{ func: 'func_print' }"
                  >打印</el-button
                >
                <el-button
                  class="less-btn float-left"
                  type="primary"
                  plain
                  @click="exportExcel"
                  >导出</el-button
                >
                <el-pagination
                  background
                  @size-change="changeSize"
                  @current-change="changePage"
                  :current-page="pageParams.pageNo"
                  :page-sizes="[10, 20, 40, 500, 1000]"
                  :page-size="pageParams.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pageParams.total"
                ></el-pagination>
              </div>
            </div>
          </slot>
        </flow-menu>
      </div>
    </div>
  </div>
</template>

<script>
import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
import FlowMenu from "@/components/FlowMenu";
import hmmBaseApi from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";
import { print, preview, onPreview } from "@/utils/print";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  name: "ledgerInquiry",
  components: { FlowMenu, drugInfoList },
  data() {
    return {
      searchData: {
        date: [],
        storageCode: "",
        type : ""
      },
      dateObj: [],
      tableParams: [
        {
          prop: "time",
          label: "日期",
          width: 170,
          fixed: "left",
        },
        {
          prop: "type",
          label: "方式",
          width: 120,
          fixed: "left",
        },
        {
          prop: "num",
          label: "单号",
          width: 160,
          fixed: "left",
        },
        {
          prop: "sourceName",
          label: "出库方",
          width: 120,
        },
        {
          prop: "targetName",
          label: "接受方",
          width: 100,
        },
        {
          prop: "inQuantityDisplay",
          label: "收入数量",
          width: 120,
        },
        {
          prop: "inAmt",
          align: "right",
          label: "收入金额(元)",
          width: 150,
        },
        {
          prop: "outQuantityDisplay",
          label: "发出数量",
          width: 120,
        },
        {
          prop: "doctorUserName",
          label: "开单医生",
          width: 120,
        },
        {
          prop: "outAmt",
          align: "right",
          label: "发出金额(元)",
          width: 150,
        },
        {
          prop: "lastQuantityDisplay",
          label: "结存数量",
          width: 120,
        },
        {
          prop: "lastAmt",
          align: "right",
          label: "结存金额(元)",
          width: 150,
        },
        {
          prop: "batchNum",
          label: "生产批号",
          width: 140,
        },
        {
          prop: "expiryDate",
          label: "有效期",
          width: 120,
        },
        {
          prop: "purchasePrice",
          align: "right",
          label: "进价(元)",
          width: 100,
        },
        {
          prop: "price",
          align: "right",
          label: "售价(元)",
          width: 100,
        },
      ],
      drugData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      drugStorageList: [],
      storageTypeList: [],
      drugInfo: {},
      curStorage: "",
      tlm_isLoading: false,
      wayShowObj: {}
    };
  },
  created() {
    this.dateObj[0] = this.getNowFormatDate() + " 00:00:00";
    this.dateObj[1] = this.getNowFormatDate() + " 23:59:59";
    console.log(this.dateObj, "时间");
    // this.$set(this.searchData,this.searchData.data[0],this.getNowFormatDate()+ " 00:00:00")
    // this.$set(this.searchData,this.searchData.data[1],this.getNowFormatDate()+ " 23:59:59")
    this.getDrugStorageList("0,1,2");
    this.getWayShow();
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    search() {
      this.pageParams.pageNo = 1;
      this.loadTable();
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
      var currentdate =
        date.getFullYear() + seperator1 + month + seperator1 + strDate;
      // + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
      return currentdate;
    },
    loadTable() {
      if (this.dateObj === null || this.dateObj.length === 0) {
        this.$message.warning("请选择操作日期!");
        return;
      } else if (!this.searchData.storageCode) {
        this.$message.warning("请选择药房!");
        return;
      } else if (!this.drugInfo.drugId) {
        this.$message.warning("请选择药品!");
        return;
      }
      let sc = {};
      if (this.searchData.storageCode !== "") {
        sc.storageCode = this.searchData.storageCode;
      }
      let params = {
        drugId: this.drugInfo.drugId,
        type: this.searchData.type,
        sDate: this.dateObj[0],
        eDate: this.dateObj[1],
        ...sc,
        ...this.pageParams
      };
      this.tlm_isLoading = true;
      hmmBaseApi
        .forLedger(params)
        .then((res) => {
          if (res.code === 1) {
            this.pageParams = res.pageParams;
            this.drugData = res.data;
          }
          this.tlm_isLoading = false;
        })
        .catch((err) => {
          this.tlm_isLoading = false;
        });
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    headerDragend() {
      this.$refs.singleTable && this.$refs.singleTable.doLayout();
    },
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then((res) => {
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
        .catch((res) => {
          this.$message.error(res.msg || "获取药房数据失败");
        });
    },
    storageChange(val) {
      if(val === undefined || val === ""){
        this.curStorage = '';
        return;
      }
      let item = this.drugStorageList.find((item) => item.code === val);
      this.curStorage = item.name;
    },
    getDrugList(params) {
      hmmBaseApi
        .getAssociation(params)
        .then((res) => {
          if (res.code != 1) {
            this.$message.error(res.msg || "药品查询失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药品数据");
            return;
          }
          let list = res.data.map((drugWapper) => ({
            ...drugWapper,
            drugStock: drugWapper.drugStock || 0,
            purchasePrice: drugWapper.purchasePrice || 0,
            price: drugWapper.price || 0,
          }));
          this.selectOptions = list;
        })
        .catch((res) => {
          this.$message.error(res.msg || "药品查询失败");
        });
    },
    getWayShow() {
      hmmBaseApi.getlistForDropDown().then((res) => {
        if (res.code === 1) {
          const list = [];
          res.data.forEach((item) => {
            for (let i in item) {
              list.push({
                code: i,
                name: item[i]
              });
              this.wayShowObj[i] = item[i];
            }
          });
          this.storageTypeList = list;
        }
      });
    },
    getSearchData(row) {
      this.drugInfo = row;
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
          '台账查询.xlsx'
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    // 打印
    print() {
      if (this.drugData.length === 0) {
        this.$message.warning("暂无要打印数据!");
        return;
      }
      let data = {};
      data.title = "台账查询";
      let detailList = this.drugData.map((item) => {
        const dataItem = {};
        for (let i in item) {
          dataItem[i] = item[i].toString();
        }
        return dataItem;
      });
      data.detailList = detailList;
      onPreview(data, "台账查询");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
.ledger {
  padding: 20px;
  background-color: $l-color-white;
}
.drug-info {
  line-height: 24px;
  margin-top: 5px;
}
.search-input {
  height: 38px;
}
.drug-list-cont {
  height: calc(100% - 152px);
  margin-top: 5px;
  margin-bottom: 20px;
}
.drug-box {
  /deep/ .l-input-body-main > div {
    width: 100% !important;
  }
}
.green {
  color: $l-color-success;
}
.red {
  color: $l-color-error;
}
/deep/.el-table .cell{

  font-size: 16px;
}
.page {
  text-align: right;
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }

}
</style>
