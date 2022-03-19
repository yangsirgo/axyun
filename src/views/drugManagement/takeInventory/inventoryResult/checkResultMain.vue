<template>
  <el-card class="padding16 height100 width100">
    <div class="info-part">
      <div class="title">盘点单</div>
      <div class="info">
        <div class="display-list line-height34">
          <div>
            <div
              v-for="item in displayList1"
              class="display-list-item"
              :key="item.title"
            >
              <span class="title">{{ item.title }}</span>
              <span class="value" v-if="item.prop === 'spec'">{{
                tableData.length
              }}</span>
              <span class="value" v-else>{{
                selectId && selectId[item.prop] ? selectId[item.prop] : "--"
              }}</span>
            </div>
          </div>
          <div>
            <div
              v-for="item in displayList2"
              tableLoading="true"
              class="display-list-item"
              :key="item.title"
            >
              <span class="title">{{ item.title }}</span>
              <span class="value" v-if="item.prop === 'recordStatus'">{{
                selectId && selectId[item.prop]
                  ? recordStatusObj[selectId[item.prop]]
                  : "--"
              }}</span>
              <span class="value" v-else-if="item.prop === 'storageCode'">{{
                selectId && selectId[item.prop]
                  ? drugStorageData[selectId[item.prop]]
                  : "--"
              }}</span>
              <span class="value" v-else>{{
                selectId && selectId[item.prop] ? selectId[item.prop] : "--"
              }}</span>
            </div>
          </div>
        </div>
        <div class="display-list bottom-border">
          <div
            v-for="item in displayList3"
            class="display-list-item"
            :key="item.title"
          >
            <template v-if="item.prop === 'surplus' || item.prop === 'loss'">
              <span class="title">{{ item.title }}</span>
              <span class="value">{{ d3Value[item.prop] }}</span>
            </template>
            <template v-else>
              <span class="title">{{ item.title }}</span>
              <span class="value">{{ formatNum(d3Value[item.prop]) }}元</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="utils-part">
      <Linput
        class="drug-box"
        :popoverWidth="800"
        suffix-icon="el-icon-search"
        :tableData="selectOptions"
        @query="elsearch($event)"
        @select="select"
        :tableParams="dropColumn"
        :backDrugName="drugName"
        placeholder="按药品名称定位药品"
      ></Linput>
      <el-button type="primary" class="vertical" @click="position"
        >定位</el-button
      >
      <el-button type="primary" plain @click="exportExcel">导出</el-button>
    </div>
    <div class="bottom-table">
      <el-table
        ref="singleTable"
        :data="tableData"
        border
        height="100%"
        style="width: 100%"
        v-loading="loading"
        highlight-current-row
        @current-change="handleCurrentChange"
        id="out-table"
        :row-style="tableRowClassName"
      >
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          header-align="center"
          show-overflow-tooltip
          :align="item.align || 'left'"
          :sortable="item.sortable ? item.sortable : false"
        >
          <template slot-scope="scope">
            <!-- 药品名称 -->
            <span v-if="item.prop === 'drugName'">
              {{ scope.row.drugName }}
            </span>
            <!-- 盘盈盘亏数量 -->
            <span v-else-if="item.prop === 'inOutNo'">
              <!-- v-if="selectId.recordStatus == '2'"  此处判断是否为  作废的盘存  作废的盘存做另外的处理 -->
              <span v-if="selectId.recordStatus == '2'">
                0
              </span>
              <span v-if="selectId.recordStatus !== '2'">
                <span>{{
                  parseInt(
                    (scope.row.takeStock - scope.row.drugStock) /
                      scope.row.packQuantity
                  )
                }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <span
                  v-if="
                    (scope.row.takeStock - scope.row.drugStock) %
                      scope.row.packQuantity !==
                      0
                  "
                >
                  {{
                    (scope.row.takeStock - scope.row.drugStock) %
                      scope.row.packQuantity
                  }}
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </span>
              </span>
            </span>
            <!-- 参考进价(元) -->
            <span v-else-if="item.prop === 'purchasePrice'">{{
              formatNum(scope.row.purchasePrice)
            }}</span>
            <!-- 参考售价(元) -->
            <span v-else-if="item.prop === 'price'">{{
              formatNum(scope.row.price)
            }}</span>
            <!-- 盘盈盘亏进价金额(元) -->

            <span v-else-if="item.prop === 'inOutImportNo'">
              <span v-if="selectId.recordStatus == '2'">0</span>
              <span v-if="selectId.recordStatus !== '2'">
                {{
                  formatNum(
                    Math.round(
                      (scope.row.purchasePrice *
                        100 *
                        (scope.row.takeStock - scope.row.drugStock)) /
                        scope.row.packQuantity
                    ) / 100
                  )
                }}
              </span>
            </span>
            <!-- "盘盈盘亏售价金额(元)" -->
            <span v-else-if="item.prop === 'inOutExportNo'">
              <span v-if="selectId.recordStatus == '2'">0</span>
              <span v-if="selectId.recordStatus !== '2'">
                {{
                  formatNum(
                    Math.round(
                      (scope.row.price *
                        100 *
                        (scope.row.takeStock - scope.row.drugStock)) /
                        scope.row.packQuantity
                    ) / 100
                  )
                }}
              </span>
            </span>
            <!-- 当前库存 -->
            <template v-else-if="item.prop === 'drugStock'">
              <span>{{
                parseInt(scope.row.drugStock / scope.row.packQuantity)
              }}</span>
              <span
                :val="scope.row.drugUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <span v-if="scope.row.drugStock % scope.row.packQuantity !== 0">
                {{ scope.row.drugStock % scope.row.packQuantity }}
                <span
                  :val="scope.row.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </span>
            </template>
            <!-- 盘存数量 -->
            <template v-else-if="item.prop === 'takeStock'">
              <span v-if="selectId.recordStatus == '2'">
                <span>{{
                  parseInt(scope.row.drugStock / scope.row.packQuantity)
                }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <span v-if="scope.row.drugStock % scope.row.packQuantity !== 0">
                  {{ scope.row.drugStock % scope.row.packQuantity }}
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </span>
              </span>
              <span v-if="selectId.recordStatus !== '2'">
                <span>{{
                  parseInt(scope.row.takeStock / scope.row.packQuantity)
                }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <span v-if="scope.row.takeStock % scope.row.packQuantity !== 0">
                  {{ scope.row.takeStock % scope.row.packQuantity }}
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </span>
              </span>
            </template>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import base from "@/api/hmm/base";
import stockApi from "@/api/hmm/stock";
import mixin from "@/mixins/drugTools.js";
import drug from "@/mixins/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import Linput from "@/views/drugManagement/prescriptionDispensing/preCheck/component/Linput.vue";
import XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  name: "checkResultMain",
  props: ["selectId"],
  mixins: [mixin, drug],
  components: {
    Linput
  },
  data() {
    return {
      drugName: "",
      tableData: [],
      displayList1: [
        {
          title: "盘存单号",
          prop: "takeStockNo"
        },
        {
          title: "盘存药品种类",
          prop: "spec"
        },
        {
          prop: "startTime",
          title: "盘点开始时间"
        },
        {
          prop: "startUserName",
          title: "盘存设置人员"
        }
      ],
      displayList2: [
        {
          title: "盘存库房",
          prop: "storageCode"
        },
        {
          title: "盘存状态",
          prop: "recordStatus"
        },
        {
          prop: "stopTime",
          title: "盘存结束时间"
        }
      ],
      displayList3: [
        {
          title: "盘盈药品数量",
          prop: "surplus"
        },
        {
          title: "盘亏药品数量",
          prop: "loss"
        },
        {
          prop: "surplusPrice",
          title: "盘盈进价金额"
        },
        {
          prop: "lossPrice",
          title: "盘亏进价金额"
        },
        {
          prop: "sumPrice",
          title: "总盈亏进价金额"
        }
      ],
      d3Value: {
        surplus: 0,
        loss: 0,
        surplusPrice: 0,
        lossPrice: 0,
        sumPrice: 0
      },
      recordStatusObj: {
        "0": "盘存开始",
        "1": "盘存锁定",
        "2": "作废",
        "3": "结束"
      },
      tableColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          sortable: true
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "drugLocations",
          label: "货位号"
        },
        {
          prop: "purchasePrice",
          label: "参考进价(元)",
          align: "right",
          width: 120
        },
        {
          prop: "price",
          label: "参考售价(元)",
          align: "right",
          width: 120
        },
        {
          prop: "drugStock",
          label: "当前库存"
        },
        {
          prop: "takeStock",
          label: "盘存数量"
        },
        {
          prop: "inOutNo",
          align: "right",
          label: "盘盈盘亏数量"
        },
        {
          prop: "inOutImportNo",
          label: "盘盈盘亏进价金额(元)",
          align: "right",
          width: 240
        },
        {
          prop: "inOutExportNo",
          label: "盘盈盘亏售价金额(元)",
          align: "right",
          width: 240
        }
      ],
      loading: false,
      dropColumn: [
        {
          prop: "drugName",
          label: "药品名称"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "originCode",
          label: "生产厂商"
        },
        {
          prop: "drugStock",
          label: "库存",
          width: 80
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          width: 100
        },
        {
          prop: "price",
          label: "售价(元)",
          width: 100
        },
        {
          prop: "formCode",
          label: "剂型"
        }
      ],
      selectOptions: [],
      // 定位
      drugArr: [],
      drugTempIndex: -1,
      drugMark: -1
    };
  },

  watch: {
    selectId: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.id) {
          console.log(val, "打印selectId");
          this.drugArr = [];
          this.drugTempIndex = -1;
          this.drugMark = -1;
          this.drugName = "";
          this.getTempData();
        } else {
          this.d3Value = this.$options.data().d3Value;
          this.tableData = [];
        }
      }
    },
    tableData: {
      deep: true,
      handler(val) {
        this.$refs.singleTable && this.$refs.singleTable.setCurrentRow(val[0]);
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    getTempData() {
      this.loading = true;
      this.d3Value = this.$options.data().d3Value;
      stockApi
        .getSumDataList(this.selectId.id)
        .then(res => {
          if (res.code === 1) {
            this.tableData = res.data;
            this.computedNum(this.tableData);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(`drugMark`, this.drugMark);
      // console.log(`rowIndex`, rowIndex)
      let styleJson = {};
      if (rowIndex === this.drugMark) {
        styleJson = {
          background: "yellow"
        };
      } else {
        styleJson = {};
      }

      return styleJson; // 返回对象
    },
    position() {
      if (this.drugName === "") {
        return;
      }
      this.drugTempIndex++;
      console.log(`this.drugTempIndex`, this.drugTempIndex);
      console.log(`this.drugArr.length`, this.drugArr.length);
      if (this.drugTempIndex === this.drugArr.length) {
        this.drugTempIndex = 0;
      }
      console.log(`this.drugArr`, this.drugArr);
      console.log(
        `this.drugArr[this.drugTempIndex]`,
        this.drugArr[this.drugTempIndex]
      );
      this.drugMark = this.drugArr[this.drugTempIndex].i;
      let drugIndex = this.drugArr[this.drugTempIndex].i;
      // let drugIndex = this.tableData.findIndex(
      //   item => item.drugName.indexOf(this.drugName) > -1
      // );
      console.log(`drugIndex`, drugIndex);
      if (typeof drugIndex !== "number") {
        return;
      }
      let drugItem = this.tableData.find(
        item =>
          item.drugName.indexOf(
            this.drugArr[this.drugTempIndex].item.drugName
          ) > -1
      );
      console.log(`drugItem`, drugItem);
      // 选择高亮定位药品
      // drugItem && this.$refs.singleTable.setCurrentRow(drugItem);

      // 滚动条滚动到定位药品位置
      let dom = document.getElementsByClassName("bottom-table")[0];
      let scrollParent = dom.getElementsByClassName(
        "el-table--scrollable-y"
      )[0];
      if (scrollParent) {
        let scrollDom = scrollParent.getElementsByClassName(
          "el-table__body-wrapper"
        )[0];
        scrollDom && (scrollDom.scrollTop = 24 * drugIndex);
      }
    },
    // 计算盘盈盘亏总数量跟金额
    computedNum(data) {
      let py = [];
      let pk = [];
      data.forEach(element => {
        let num = element.takeStock - element.drugStock;
        if (num > 0) {
          py.push({
            packQuantity: element.packQuantity,
            price: element.purchasePrice,
            num: num
          });
        } else if (num < 0) {
          pk.push({
            packQuantity: element.packQuantity,
            price: element.purchasePrice,
            num: Math.abs(num)
          });
        }
      });
      let surplus = py.length;
      let loss = pk.length;
      let surplusPrice = py
        .reduce(
          (cur, next) =>
            (cur * 100 +
              Math.round((next.price * 100 * next.num) / next.packQuantity)) /
            100,
          0
        )
        .toFixed(2);
      let lossPrice = pk
        .reduce(
          (cur, next) =>
            (cur * 100 +
              Math.round((next.price * 100 * next.num) / next.packQuantity)) /
            100,
          0
        )
        .toFixed(2);
      let sumPrice = surplusPrice - lossPrice;
      this.d3Value = {
        surplus,
        loss,
        surplusPrice: surplusPrice,
        lossPrice: lossPrice,
        sumPrice: sumPrice.toFixed ? sumPrice.toFixed(2) : sumPrice
      };
    },
    elsearch(drugName) {
      //搜索联想
      let searchParams = {
        drugName: drugName
      };
      this.selectOptions = [];
      this.getDrugList(searchParams);
    },
    getDrugList(params, id) {
      base
        .getAssociation(params)
        .then(res => {
          if (res.code != 1) {
            this.$message.error(res.msg || "药品查询失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药品数据");
            return;
          }
          let list = res.data.map(drugWapper => {
            // 库存量转化
            const { out, bl } = blukToOutfit(
              drugWapper.drugStock,
              drugWapper.packQuantity
            );
            return {
              ...drugWapper,
              kcOut: out,
              kcBl: bl,
              drugStock: drugWapper.drugStock || 0,
              purchasePrice: drugWapper.purchasePrice || 0,
              price: drugWapper.price || 0
            };
          });
          this.selectOptions = list;
        })
        .catch(res => {
          this.$message.error(res.msg || "药品查询失败");
        });
    },
    select(row) {
      console.log(`row`, row);
      this.drugName = row.drugName;
      this.change(row);
    },
    change(row) {
      this.drugArr = [];
      this.drugTempIndex = -1;
      this.drugMark = -1;
      this.tableData.forEach((item, i) => {
        if (item.drugName === row.drugName) {
          this.drugArr.push({
            i: i,
            item: item
          });
        }
      });
    },
    // 导出
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message.warning("暂无要导出数据!");
        return;
      }
      /* generate workbook object from table */
      // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
      let fix = document.querySelector(".el-table__fixed");
      let wb;
      if (fix) {
        wb = XLSX.utils.table_to_sheet(
          document.querySelector("#out-table").removeChild(fix)
        );
        document.querySelector("#out-table").appendChild(fix);
      } else {
        wb = XLSX.utils.table_to_sheet(document.querySelector("#out-table"));
      }
      console.log(wb);
      console.log(
        `this.this.selectId`,
        JSON.parse(JSON.stringify(this.selectId))
      );
      console.log(
        `this.drugStorageData`,
        JSON.parse(JSON.stringify(this.drugStorageData))
      );

      let tempData = [
        [
          "盘存单号",
          "盘存药品种类",
          "盘点开始时间",
          "盘存设置人员",
          "盘存库房",
          "盘存状态",
          "盘存结束时间",
          "盘盈药品数量",
          "盘亏药品数量",
          "盘盈进价金额",
          "盘亏进价金额",
          "总盈亏进价金额"
        ],
        [
          this.selectId.takeStockNo,
          this.tableData.length,
          this.selectId.startTime,
          this.selectId.startUserName,
          this.selectId && this.selectId.storageCode
            ? this.drugStorageData[this.selectId.storageCode]
            : "--",
          this.selectId && this.selectId.recordStatus
            ? this.recordStatusObj[this.selectId.recordStatus]
            : "--",
          this.selectId && this.selectId.stopTime
            ? this.selectId.stopTime
            : "--",
          this.d3Value.surplus,
          this.d3Value.loss,
          this.d3Value.surplusPrice,
          this.d3Value.lossPrice,
          this.d3Value.sumPrice
        ]
      ];
      let worksheet = XLSX.utils.aoa_to_sheet(tempData);
      let workbook = XLSX.utils.book_new();
      worksheet["!cols"] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 }
      ];
      wb["!cols"] = [
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 },
        { wch: 18 }
      ];
      XLSX.utils.book_append_sheet(workbook, worksheet, "盘点单总计");

      XLSX.utils.book_append_sheet(workbook, wb, "盘点单详情");

      XLSX.writeFile(workbook, "盘点单.xlsx");
    }
  }
};
</script>

<style scoped lang="scss">
$l-font-weight: 400;
.info-part {
  background: #f6f6f6;
  border-radius: 2px;
  padding: 16px 16px 0;
}

.title {
  text-align: center;
  font-weight: $l-font-weight;
  font-size: 20px;
  padding-bottom: 10px;
}

.line-height34 {
  .display-list-item {
    line-height: 34px !important;
  }
}

.display-list {
  border-bottom: 1px solid $l-color-bgcolor-11;

  .display-list-item {
    line-height: 40px;
    display: inline-block;

    .title {
      font-size: 14px;

      font-weight: 400;
      color: $l-color-fontcolor-4;
      line-height: 20px;
    }

    .value {
      padding-left: 10px;
      font-size: 14px;

      font-weight: 400;
      color: $l-color-fontcolor-3;
      line-height: 20px;
    }
  }

  .display-list-item {
    margin-right: 60px;
  }
}

.margin-bottom {
  margin-bottom: 10px;
}

.bottom-border {
  border-bottom: 0;
}

.noPaddingBottom {
  padding-bottom: 0;
}

.utils-part {
  padding: 16px 0;
}

.drug-box {
  display: inline-block;
  vertical-align: top;
  width: 200px;
  margin-right: 6px;
}

.vertical {
  vertical-align: top;
}

.position-absolute {
  /deep/ .el-table__body {
    table-layout: fixed !important;
  }
}

.bottom-table {
  flex: 1;
}

/deep/ .el-card__body {
  display: flex;
  flex-direction: column;
}
</style>
