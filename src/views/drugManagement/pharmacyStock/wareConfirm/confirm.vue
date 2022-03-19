<template>
  <el-card class="height100 position-relative width100">
    <div class="height-button-main">
      <div class="apply-info">
        <div>
          <div class="item">
            <span class="label">出库单号：</span>
            {{ wareConfimInfo_main.outInventoryNum || "--" }}
          </div>
          <div class="item">
            <span class="label">出库类型：</span>
            {{ codeToText(wareConfimInfo_main.outType, outTypeList) }}
          </div>
          <div class="item">
            <span class="label">总金额：</span>
            {{ formatNum(wareConfimInfo_main.totalAmt) }}元
          </div>
        </div>
        <div>
          <div class="item">
            <span class="label">录入人员：</span>
            {{ wareConfimInfo_main.entryPersonName || "--" }}
          </div>
          <div class="item">
            <span class="label">录入时间：</span>
            {{ wareConfimInfo_main.entryTime || "--" }}
          </div>
          <div class="item">
            <span class="label">提交人员：</span>
            {{ wareConfimInfo_main.submitPersonName || "--" }}
          </div>
          <div class="item">
            <span class="label">提交时间：</span>
            {{ wareConfimInfo_main.submitPersonTime || "--" }}
          </div>
        </div>
        <div class="position-absolute" style="top: 70px;bottom: 80px;left: 20px;right: 20px;">
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            height="100%"
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            style="width: 100%"
            v-loading="tableLoad"
          >
            <el-table-column min-width="200" show-overflow-tooltip label="药品名称">
              <template slot-scope="scope">
                <span>{{ scope.row.drugName }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="150" show-overflow-tooltip label="规格">
              <template slot-scope="scope">
                <span>{{ scope.row.spec }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="120px" show-overflow-tooltip label="生产批号">
              <template slot-scope="scope">
                <span>{{ scope.row.batchNum }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="160px" label="批次">
              <template slot-scope="scope">
                <span>{{ scope.row.inId }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="150" label="厂家">
              <template slot-scope="scope">
                <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
              </template>
            </el-table-column>
            <el-table-column width="120" align="right" show-overflow-tooltip label="进价(元)">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" align="right" show-overflow-tooltip label="售价(元)">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="200" show-overflow-tooltip label="有效期">
              <template slot-scope="scope">
                <span>{{ scope.row.expDate }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="150" show-overflow-tooltip label="库发数量">
              <template slot-scope="scope">
                <span>{{ parseInt(scope.row.outQuantity / scope.row.packQuantity) }}</span>
                <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                <template v-if="scope.row.outQuantity % scope.row.packQuantity !== 0">
                  <span>{{ scope.row.outQuantity % scope.row.packQuantity }}</span>
                  <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column min-width="150" show-overflow-tooltip label="库发备注">
              <template slot-scope="scope">
                <span>{{ scope.row.recordRemark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="bottom-btn height-button-bottom">
      <el-button class="less-btn" @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
      <el-button class="less-btn" @click="exportExcel">导出</el-button>
      <el-button
        v-if="this.wareConfimInfo_main.status == '1'"
        class="main-btn float-right"
        @click="confirmData"
        type="primary"
        style="margin-top:15px"
        v-hotKey="{ func: 'func_submit' }"
      >确认入库</el-button>
    </div>
  </el-card>
</template>

<script>
import stock from "@/api/hmm/stock";
import { localCodeTransform } from "@/utils/util";
import mixin from "@/mixins/drugManagement.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "confirm",
  mixins: [mixin],
  props: {
    wareConfimInfo: {
      type: Object
    },
    drugStorageList: {
      type: Array
    },
    outTypeList: {
      type: Array
    }
  },
  data() {
    return {
      maxHeight: "", // table 最大高度
      wareConfimInfo_main: {
        // 申请单头部详情
        outInventoryNum: "", // 单号
        outType: "", // 出库类型
        totalAmt: "", // 总金额
        entryPersonName: "", // 录入人员
        entryTime: "", // 录入时间
        submitPersonName: "", // 提交人员
        submitTime: "" // 提交时间
      },
      tableData: [], // 申请表格详情
      curSelectTableList: [], // 当前已经选中的item
      tableLoad: false
    };
  },
  watch: {
    wareConfimInfo: {
      handler(val) {
        this.wareConfimInfo_main = val;
        if (val) {
          this.getWareConfimD(val.id);
        }
      },
      deep: true
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    //查询明细
    getWareConfimD(id) {
      this.tableLoad = true;
      stock
        .getWareConfimDetail(id)
        .then(res => {
          if (res.code == 1) {
            this.tableData = res.data;
            this.$refs.singleTable &&
              this.$refs.singleTable.setCurrentRow(res.data[0]);
          } else {
            this.$message.error(res.msg || "获取入库单明细数据失败");
          }
          this.tableLoad = false;
        })
        .catch(res => {
          this.tableLoad = false;
          this.$message.error(res.msg || "获取入库单明细数据失败");
        });
    },
    // 中间模块操作
    handleSelectionChange(list) {
      // 选中表格
      this.curSelectTableList = list;
    },
    exportExcel() {
      let excelData = {
        title: ["入库单", "", "", "", ""],
        where: [
          "入库单号:" + this.wareConfimInfo_main.outInventoryNum,
          "",
          "",
          "",
          ""
        ],
        tHeader: ["药品名称", "规格", "进价", "售价", "数量"],
        filterVal: [
          "drugName",
          "spec",
          "purchasePrice",
          "price",
          "outQuantity"
        ],
        listDate: this.tableData,
        fileName: "入库单",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },
    print() {
      let data = {};
      data.title = "入库单";
      data.num = this.wareConfimInfo_main.outInventoryNum;
      let detailList = this.tableData.map(data => {
        return {
          ...data,
          qty: data.outQuantity
        };
      });
      data.detailList = detailList;
      onPreview(data, "药库药房单据");
    },
    confirmData() {
      // 提交
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否确认?",
        confirm: (action, instance, done) => {
          let confirmId = this.wareConfimInfo_main.id;
          this.$showLoading();
          stock
            .putConfirm(confirmId)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.fullReset();
                this.$emit("search");
                this.$message.success(res.msg || "确认入库成功!");
              } else {
                this.$message.error(res.msg || "确认入库失败");
              }
            })
            .catch(res => {
              done();
              this.$hideLoading();
              this.$message.error(res.msg || "确认入库失败");
            });
        }
      });
    },
    fullReset() {
      this.wareConfimInfo_main = this.$options.data().wareConfimInfo_main;
      this.tableData = this.$options.data().tableData;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  padding: 0 20px;

  .bottom-btn {
    height: 68px;
    line-height: 68px;
    overflow: hidden;

    .main-btn {
      border-radius: 2px;
    }

    .less-btn {
      border-radius: 2px;
      border-color: $l-color-primary;
      color: $l-color-primary;
      margin-top: 16px;
    }

    .btn-label {
      font-size: $l-font-size;
      cursor: pointer;

      i {
        font-size: 18px;
        margin-left: 30px;
        margin-right: 5px;
        position: relative;
        top: 2px;
      }
    }
  }

  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .apply-info {
    color: $l-color-fontcolor-3;
    margin-top: 20px;

    .label {
      color: $l-color-fontcolor-4;
    }

    & > div {
      margin-top: 10px;
      overflow: hidden;

      .item {
        min-width: 220px;
        float: left;
      }

      .disabled {
        background: $l-color-bgcolor-18;
      }

      .form-item {
        width: 257px;
        margin-right: 6px;
      }

      .form-item:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
