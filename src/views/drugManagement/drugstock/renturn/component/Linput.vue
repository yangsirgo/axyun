<template>
  <div ref="drugBox" @click.stop>
    <el-popover placement="bottom" :width="popoverWidth" trigger="manual" v-model="popverVisbile">
      <el-table
        ref="drugInfoListTable"
        :data="tableData"
        v-loading="tableLoading"
        border
        highlight-current-row
        element-loading-text="列表正在加载中"
        @row-click="selectHandler"
        width="100%"
        height="300"
      >
        <el-table-column
          class="overflow-point"
          header-align="center"
          v-for="item in tableParams"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'left'"
          :fixed="item.fixed === true"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <template v-if="item.prop === 'drugStock'">
              <span>{{ row.kcOut }}</span>
              <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="row.kcBl !== 0">
                <span>{{ row.kcBl }}</span>
                <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
              </template>
            </template>
            <template v-else-if="item.prop === 'formCode'">
              <span
                tableName="hrp_form"
                :conditionMap="{form_code: row.formCode}"
                columns="form_name"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'purchasePrice'">
              <span>{{ formatNum(row.purchasePrice) }}</span>
            </template>
            <template v-else-if="item.prop === 'price'">
              <span>{{ formatNum(row.price) }}</span>
            </template>
            <span v-else class="overflow-point">{{ row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-input
        slot="reference"
        ref="singleInput"
        v-model="inputValue"
        placeholder="请输入内容"
        @click.native="showPopover"
        @keyup.native="searchHandler"
        @change="searchHandler"
      ></el-input>
    </el-popover>
  </div>
</template>
<script>
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import hmmBaseApi from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";

export default {
  props: {
    // 弹出表格宽度
    popoverWidth: {
      type: Number,
      default: 800
    },
    // 库房code
    storageCode: {
      type: String,
      default: ""
    },
    // 药品名称
    name: {
      type: String,
      default: ""
    },
    // 供应商
    supplierCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      popverVisbile: false,
      searchTimer: null,
      inputValue: "",
      curIdx: null,
      tableParams: [
        {
          prop: "drugName",
          label: "药品名称"
        },
        {
          prop: "spec",
          label: "规格",
          width: 120
        },

        {
          prop: "formCode",
          label: "剂型",
          width: 100
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: 100
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: 100
        },
        {
          prop: "drugStock",
          label: "库存",
          width: 140
        }
      ],
      tableData: [],
      tableLoading: false
    };
  },
  watch: {
    name(val) {
      if (val) {
        this.inputValue = val;
      }
    }
  },
  mounted() {
    // 点击其他地方隐藏搜索药品弹窗
    document.addEventListener("click", this.hideInfo, false);
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    searchHandler(event) {
      if (this.tableLoading && this.popverVisbile) {
        return;
      }
      // 按键下
      if (event.keyCode === 40) {
        this.tableKeyDown(1);
        return;
      }
      // 按键上
      if (event.keyCode === 38) {
        this.tableKeyDown(-1);
        return;
      }
      // 确认键
      if (event.keyCode === 13) {
        if (this.curIdx !== null) {
          this.tableKeyEnter();
        } else {
          this.search();
        }
        return;
      }

      // 过滤非值的按键
      if (!this.isValueKey(event.keyCode)) {
        return;
      }
      this.search();
    },
    search() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        this.query();
      }, 500);
    },
    isValueKey(code) {
      return (
        code >= 48 && code <= 57 ||
        code >= 65 && code <= 90 ||
        code >= 96 && code <= 111 ||
        code >= 186 && code <= 192 ||
        code == 8
      );
    },
    query() {
      if (!this.popverVisbile) {
        this.showPopover();
      }
      this.curIdx = null;
      const params = {
        pageNo: 1,
        pageSize: 10000,
        drugName: this.inputValue,
        //当前角色或者知道的库房
        storageCode: this.storageCode,
        supplierCode: this.supplierCode
      };
      this.tableLoading = true;
      hmmBaseApi
        .getDrugListFormSupplier(params)
        .then(res => {
          this.tableData = [];
          if (res.code === 1) {
            if (res.data.length == 0) {
              this.tableLoading = false;
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
                kcBl: bl
              };
            });
            this.tableData = list;
          } else {
            this.$message.error(res.msg || "药品查询失败");
          }
          this.tableLoading = false;
        })
        .catch(res => {
          this.tableData = [];
          this.tableLoading = false;
          this.$message.error(res.msg || "药品查询失败");
        });
    },
    showPopover() {
      this.popverVisbile = true;
      if (this.tableData.length === 0) {
        this.query();
      }
    },
    hideInfo() {
      this.popverVisbile = false;
      this.curIdx = null;
    },
    hidePopover() {
      this.popverVisbile = false;
      this.curIdx = null;
    },
    tableKeyDown(val) {
      if (this.curIdx === null) {
        this.curIdx = 0;
      } else if (val > 0 && this.curIdx >= this.tableData.length - 1) {
        return;
      } else if (val < 0 && this.curIdx <= 0) {
        return;
      } else {
        this.curIdx += val;
      }
      this.setTableCur();
    },
    tableKeyEnter() {
      if (this.tableData.length > 0 && this.curIdx > -1) {
        this.inputValue = this.tableData[this.curIdx].drugName;
        this.selectHandler(this.tableData[this.curIdx]);
      }
      this.hidePopover();
    },
    selectHandler(row, index) {
      this.$emit("send-data", row);
      this.inputValue = row.drugName;
      this.hidePopover();
    },
    setTableCur() {
      if (this.$refs.drugInfoListTable) {
        this.$refs.drugInfoListTable.setCurrentRow(this.tableData[this.curIdx]);
      }
      this.scrollToRight();
    },
    focus() {
      if (this.$refs.singleInput) {
        this.$refs.singleInput.focus();
      }
    },
    scrollToRight() {
      if (this.$refs.drugInfoListTable) {
        if (this.curIdx <= 2 || this.curIdx >= this.tableData.length - 3) {
          return;
        }
        this.$refs.drugInfoListTable.bodyWrapper.scrollTop =
          (this.curIdx - 2) * 45;
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.hideInfo);
  }
};
</script>
