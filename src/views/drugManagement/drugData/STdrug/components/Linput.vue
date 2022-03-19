<template>
  <div>
    <el-popover
      placement="bottom"
      :width="popoverWidth"
      trigger="manual"
      :value="popverVisbile"
    >
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        v-loading="tableLoading"
        element-loading-text="列表正在加载中"
        @row-click="selectHandler"
        height="300"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          class="overflow-point"
          header-align="center"
          v-for="(item, index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          align="center"
          :fixed="item.fixed === true"
        >
          <template slot-scope="{ row }">
            <template v-if="item.prop === 'formCode'">
              <span
                tableName="hrp_form"
                :conditionMap="{ form_code: row.formCode }"
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
            <template v-else-if="item.prop === 'originCode'">
              <span
                :val="row.originCode"
                code="Manufacturer"
                v-codeTransform
              ></span>
            </template>
            <span v-else class="overflow-point">{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-col style="display: flex;align-items: flex-end;">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="currentChange"
          :current-page="pageNo"
          @prev-click="prevClick"
          @next-click="nextClick"
          :total="total"
        >
        </el-pagination>
      </el-col>
      <el-input
        slot="reference"
        ref="singleInput"
        v-model="inputValue"
        :placeholder="placeholder"
        @blur="hidePopover"
        @keyup.native="searchHandler"
      ></el-input>
    </el-popover>
  </div>
</template>
<script>
import formatNum from "@/utils/formatPrice.js";

export default {
  props: {
    popoverWidth: {
      type: Number,
      default: 400
    },
    total: {
      type: Number,
      default: 0
    },
    tableData: {
      type: Array,
      default: () => [],
      required: true
    },
    tableParams: {
      type: Array,
      default: () => [],
      required: true
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "请输入内容"
    }
  },
  data() {
    return {
      // total:0,
      popverVisbile: false,
      searchTimer: null,
      inputValue: "",
      curIdx: null,
      pageNo: 1
    };
  },
  watch: {
    tableData() {
      if (this.tableData.length && this.curIdx === null) {
        this.tableKeyDown(1);
      }
    },
    value(val) {
      if (this.inputValue !== val) {
        this.inputValue = val;
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    searchHandler(event) {
      if (this.tableLoading && this.popverVisbile) {
        return;
      }
      // 安左键分页
      if (event.keyCode === 37) {
        this.prevClick();
        return;
      }
      // 安左键分页
      if (event.keyCode === 39) {
        this.nextClick();
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
        this.tableKeyEnter();
        return;
      }

      // 过滤非值的按键
      if (!this.isValueKey(event.keyCode)) {
        return;
      }

      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.clearTimeout = null;
      }
      this.searchTimer = setTimeout(this.query, 500);
    },
    isValueKey(code) {
      return (
        (code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 96 && code <= 111) ||
        (code >= 186 && code <= 192)
      );
    },
    tableRowClassName(row, rowIndex) {
      if (row.row.status == "0") {
        return "disabledRow";
      } else {
        return "";
      }
    },
    prevClick(a) {
      this.pageNo--;
      this.curIdx = null;
      if (this.pageNo < 1) {
        this.pageNo = 1;
      }
      console.log(`this.pageNo`, this.pageNo);
      this.query();
    },
    nextClick(a) {
      this.curIdx = null;
      this.pageNo++;
      let num = Math.ceil(this.total / 10);
      if (this.pageNo > num) {
        this.pageNo = num;
      }
      console.log(`this.pageNo`, this.pageNo);
      this.query();
    },
    currentChange(a) {
      this.curIdx = null;
      this.pageNo = a;
      this.query(a);
    },
    query() {
      this.$emit("query", {
        inputValue: this.inputValue,
        pageNo: this.pageNo
      });
      this.showPopover();
    },
    showPopover() {
      this.popverVisbile = true;
    },
    hidePopover() {
      this.popverVisbile = false;
      this.curIdx = null;
      this.$emit("blur");
    },
    tableKeyDown(val) {
      if (this.curIdx === null) {
        this.curIdx = 0;
      } else if (val > 0 && this.curIdx >= this.tableData.length - 1) {
        this.query();
      } else if (val < 0 && this.curIdx <= 0) {
        return;
      } else {
        this.curIdx += val;
      }
      this.setTableCur();
    },
    tableKeyEnter() {
      if (this.tableData.length > 0) {
        this.$emit("select", this.tableData[this.curIdx]);
        this.inputValue = this.tableData[this.curIdx].drugName;
      }
      this.hidePopover();
    },
    selectHandler(row, index) {
      this.$emit("select", row);
      this.inputValue = row.drugName;
      this.$emit("update:value", row.drugName);
      this.hidePopover();
    },
    setTableCur() {
      if (this.$refs.singleTable) {
        this.$refs.singleTable.setCurrentRow(this.tableData[this.curIdx]);
      }
      this.scrollToRight();
    },
    focus() {
      if (this.$refs.singleInput) {
        this.$refs.singleInput.focus();
      }
    },
    scrollToRight() {
      if (this.$refs.singleTable) {
        if (this.curIdx <= 2 || this.curIdx >= this.tableData.length - 3) {
          return;
        }
        this.$refs.singleTable.bodyWrapper.scrollTop = (this.curIdx - 2) * 45;
      }
    }
  }
};
</script>
<style lang="scss">
.el-table .disabledRow {
  cursor: no-drop;
  color: #cccccc !important;
}
</style>
