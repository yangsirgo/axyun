<template>
  <div>
    <el-popover placement="bottom" :width="popoverWidth" trigger="manual" :value="popverVisbile">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        v-loading="tableLoading"
        element-loading-text="列表正在加载中"
        @row-click="selectHandler"
        height="300"
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
          <template slot-scope="scope">
            <span class="overflow-point">{{ scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
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
export default {
  props: {
    popoverWidth: {
      type: Number,
      default: 400
    },
    tableData: {
      type: Array,
      default: [],
      required: true
    },
    tableParams: {
      type: Array,
      default: [],
      required: true
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    placeholder : {
      type: String,
      default: '请输入内容'
    },
  },
  data() {
    return {
      popverVisbile: false,
      searchTimer: null,
      inputValue: "",
      curIdx: null
    };
  },
  watch: {
    tableData() {
      if (this.tableData.length && this.curIdx === null) {
        this.tableKeyDown(1);
      }
    }
  },
  methods: {
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
    query() {
      this.$emit("query", this.inputValue);
      this.showPopover();
    },
    showPopover() {
      this.popverVisbile = true;
    },
    hidePopover() {
      this.popverVisbile = false;
      this.curIdx = null;
      this.$emit('blur');
    },
    tableKeyDown(val) {
      if (this.curIdx === null) {
        this.curIdx = 0;
      } else if (val > 0 && this.curIdx >= this.tableData.length - 1) {
        // this.curIdx = 0;
        this.query();
      } else if (val < 0 && this.curIdx <= 0) {
        // this.curIdx = this.tableData.length - 1;
        return;
      } else {
        this.curIdx += val;
      }
      this.setTableCur();
    },
    tableKeyEnter() {
      if (this.tableData.length > 0) {
        this.$emit("select", this.tableData[this.curIdx]);
        this.inputValue= this.tableData[this.curIdx].drugName;
      }
      this.hidePopover();
    },
    selectHandler(row, index) {
      this.$emit("select", row);
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
