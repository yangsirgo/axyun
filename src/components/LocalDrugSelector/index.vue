<template>
  <div ref="drugBox" @click.stop>
    <el-popover
      placement="bottom"
      :width="popoverWidth"
      trigger="manual"
      v-model="popverVisbile"
    >
      <el-table
        ref="drugInfoListTable"
        :data="tableData"
        v-loading="tableLoading"
        border
        highlight-current-row
        element-loading-text="列表正在加载中"
        @row-click="selectHandler"
        width="100%"
        height="362"
        :row-class-name="tableRowClassName"
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
                <span
                  :val="row.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </template>
            <template v-else-if="item.prop === 'originCode'">
              <span
                :val="row.originCode"
                code="Manufacturer"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'formCode'">
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
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-col style="display: flex;align-items: flex-end;">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="currentChange"
          :current-page="pageNo"
          :page-size="14"
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
        placeholder="请输入内容"
        @keyup.native="searchHandler"
        @input="query"
      ></el-input>
    </el-popover>
  </div>
</template>
<script>
import formatNum from "@/utils/formatPrice.js";
import { getPamars } from "@/utils/auth";
import localForage from "localforage";
import { debounce } from "lodash/function";

export default {
  props: {
    // 弹出表格宽度
    popoverWidth: {
      type: Number,
      default: 800
    },
    // 药品名称
    name: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      popverVisbile: false,
      searchTimer: null,
      inputValue: "",
      total: 0,
      curIdx: null,
      pageNo: 1,
      tableParams: [
        {
          prop: "drugName",
          label: "药品名称"
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "right"
          // width: 100
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
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: 100
        }
        // {
        //   prop: "drugStock",
        //   label: "库存",
        //   width: 140
        // }
      ],
      tableData: [],
      searchTimer: null,
      tableLoading: false,
      DrugData: [],
      PagingData: []
    };
  },
  mounted() {
    this.getDrugData();
    // 点击其他地方隐藏搜索药品弹窗
    document.addEventListener("click", this.hideInfo, false);
    // 初始化默认打开加载数据，并聚焦
    this.$refs.singleInput.$refs.input &&
      this.$refs.singleInput.$refs.input.focus();
  },
  methods: {
    getHosId() {
      let pamars = JSON.parse(getPamars());
      let hosID = "";
      if (pamars.hosId.slice(0, 1) === "H") {
        hosID = pamars.hosId;
      } else {
        hosID = pamars.hosIdNum;
      }
      return hosID;
    },
    // 获取indexdb 药品数据 通过hosId 拆分
    async getDrugData() {
      try {
        this.DrugData = [];
        const res = await localForage.getItem("AllDrugData");
        console.log(`res`, res);
        console.log(`getPamars()`, getPamars());
        let hosId = this.getHosId();
        this.DrugData = res.reduce((acc, v) => {
          v.hosVOList.forEach(el => {
            if (el.hosId === hosId) {
              acc.push({ ...v, ...el });
            }
          });
          return acc;
        }, []);
        console.log(`this.DrugData`, this.DrugData);
      } catch (err) {
        console.log("getDrugData失败", err);
        console.log(err);
      }
    },
    query: debounce(function() {
      if (!this.popverVisbile) {
        if (this.inputValue === "") {
          return;
        }
        this.popverVisbile = true;
      }
      let tempData = [];
      this.curIdx = null;
      this.tableData = [];
      this.PagingData = [];
      this.DrugData.forEach((item, i) => {
        if (
          item.searchValue &&
          item.searchValue
            .toLowerCase()
            .indexOf(this.inputValue.toLowerCase()) != -1
        ) {
          tempData.push(item);
        }
      });
      this.total = tempData.length;
      let len = Math.ceil(tempData.length / 14);
      let start = 0;
      let end = 14;
      for (let i = 0; i < len; i++) {
        this.PagingData.push(tempData.slice(start, end));
        start += 14;
        end += 14;
      }
      this.tableData = this.PagingData[this.pageNo - 1];
      this.$nextTick(() => {
        this.curIdx = 0;
        this.setTableCur();
      });
    }, 100),
    searchHandler(event) {
      console.log('asjwudhwsidhwudhewshdfeudhwudhwudhwudhwudhwudhw',event)
      if (this.inputValue !== event.target.value) {
        this.pageNo = 1;
        this.inputValue = event.target.value;
      }
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
      if (event.keyCode === 13 ) {
        if (this.curIdx !== null) {
          this.tableKeyEnter();
        } else {
          this.search();
        }
        return;
      }
      // 过滤非值的按键
      if (event.keyCode !== 32 && !this.isValueKey(event.keyCode)) {
        return;
      }
      this.query();
    },
    isValueKey(code) {
      return (
        (code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 96 && code <= 111) ||
        (code >= 186 && code <= 192) ||
        code == 8
      );
    },
    prevClick() {
      this.pageNo--;
      if (this.pageNo < 1) {
        this.pageNo = 1;
      }
      this.query();
    },
    nextClick() {
      this.pageNo++;
      this.query();
    },
    currentChange(num) {
      this.pageNo = num;
      this.query();
    },
    tableRowClassName(row) {
      if (row.row.status == "0") {
        return "disabledRow";
      } else {
        return "";
      }
    },
    formatNum(num) {
      return formatNum(num);
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
    selectHandler(row) {
      if (row.status == "0") {
        this.$message.error("该药品不可选");
        return false;
      }
      this.$emit("send-data", row);
      this.inputValue = row.drugName;
      this.hidePopover();
    },
    setTableCur() {
      if (this.$refs.drugInfoListTable) {
        this.$refs.drugInfoListTable.setCurrentRow(this.tableData[this.curIdx]);
      }
      // this.scrollToRight();
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
<style lang="scss">
.el-table .disabledRow {
  cursor: no-drop;
  color: #83868d !important;
}
</style>
