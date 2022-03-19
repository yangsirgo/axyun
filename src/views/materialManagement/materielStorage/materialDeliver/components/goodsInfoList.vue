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
        height="300"
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
              <template v-if="row.kcBl">
                <span>{{ row.kcBl }}</span>
                <span
                  :val="row.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </template>
            <template v-else-if="item.prop === 'formCode'">
              <span
                tableName="hrp_form"
                :conditionMap="{ form_code: row.formCode }"
                columns="form_name"
                v-tableTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'originCode'">
              <span
                :val="row.originCode"
                code="Manufacturer"
                v-codeTransform
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
        @click.native="showPopover"
        @dblclick.native="stopPropagation($event)"
        @keyup.native="searchHandler"
      ></el-input>
    </el-popover>
  </div>
</template>
<script>
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import warehousingAPI from "@/api/materielStorage/warehousing.js";
import formatNum from "@/utils/formatPrice.js";
import { getRole } from "@/utils/auth";
import { Throttle } from "@/utils/index.js";

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
      total: 0,
      popverVisbile: false,
      searchTimer: null,
      inputValue: "",
      curIdx: null,
      pageNo: 1,
      tableParams: [
        {
          prop: "goodsName",
          label: "物资名称",
          width: 180
        },
        {
          prop: "spec",
          label: "规格",
          width: 120
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "right",
           width: 200
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
          prop: "stockQty",
          label: "库存量",
          align: "right",
        }
      ],
      tableData: [],
      tableLoading: false
    };
  },
  watch: {
    inputValue(val) {
      this.pageNo = 1;
    },
    name(val) {
      if (val) {
        this.inputValue = val;
      }
    }
  },
  computed: {

  },
  mounted() {
    // 点击其他地方隐藏搜索药品弹窗
    document.addEventListener("click", this.hideInfo, true);
    this.popverVisbile = false;
    // 初始化默认打开加载数据，并聚焦
    this.$nextTick(() => {
      this.$refs.singleInput.$refs.input &&
        this.$refs.singleInput.$refs.input.focus();
      // this.showPopover();
    });
  },
  methods: {
    stopPropagation(e) {
      e.stopPropagation();
    },

    tableRowClassName(row, rowIndex) {
      if (row.row.status == "0") {
        return "disabledRow";
      } else {
        return "";
      }
    },
    formatNum(num) {
      return formatNum(num);
    },
    searchHandler(event) {
      if (this.inputValue !== event.target.value) {
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
      if (event.keyCode === 13) {
        if (this.curIdx !== null) {
          this.tableKeyEnter();
        } else {
          this.search();
        }
        return;
      }
      // 空格键
      // if (event.keyCode === 32) {
      // console.log("按下空格键");
      // if (this.curIdx !== null) {
      // this.tableKeyEnter();
      // } else {
      // this.search();
      // }
      // return;
      // }
      // if (event.keyCode === 16) {
      //   if (this.inputValue !== "") {
      //     this.search();
      //   }
      //   return;
      // }
      // 过滤非值的按键
      if (!this.isValueKey(event.keyCode)) {
        return;
      }
      if (this.inputValue === "") {
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
        (code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 96 && code <= 111) ||
        (code >= 186 && code <= 192) ||
        code == 8
      );
    },
    prevClick(a) {
      this.pageNo--;

      if (this.pageNo < 1) {
        this.pageNo = 1;
      }

      this.query();
    },
    nextClick(a) {
      this.pageNo++;
      let num = Math.ceil(this.total / 10);
      if (this.pageNo > num) {
        this.pageNo = num;
      }
      this.query();
    },
    currentChange(a) {
      this.pageNo = a;
      this.query(a);
    },
    query() {
      if (!this.popverVisbile) {
        // this.showPopover();
        if (this.inputValue === "") {
          return;
        }
        this.popverVisbile = true;
      }
      this.curIdx = null;
      const params = {
        pageNo: this.pageNo || 1,
        pageSize: 10,
        goodsName: this.inputValue,
        //当前角色或者知道的库房
        currDrugStorage:'1',
        orderBy:'LENGTH(GOODS_NAME)DESC'
      };
      this.tableLoading = true;
      warehousingAPI
        .getAssociation(params)
        .then(res => {
          this.tableData = [];
          if (res.code === 1) {
            this.total = res.total;
            if (res.data.length == 0) {
              this.tableLoading = false;
              // this.$message.error("暂无药品数据");
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
            console.log(`this.tableData`, this.tableData);
            this.$nextTick(() => {
              this.curIdx = 0;
              this.setTableCur();
            });
          } else {
            this.$message.error(res.msg || "物资查询失败");
          }
          this.tableLoading = false;
        })
        .catch(res => {
          this.tableData = [];
          this.tableLoading = false;
          this.$message.error(res.msg || "物资查询失败");
        });
    },
    showPopover() {
      return;
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
        this.inputValue = this.tableData[this.curIdx].goodsName;
        this.selectHandler(this.tableData[this.curIdx]);
      }
      this.hidePopover();
    },
    selectHandler(row, index) {
      if (row.status == "0") {
        this.$message.error("该药品不可选");
        return false;
      }
      this.$emit("send-data", row);
      this.inputValue = row.goodsName;
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
<style lang="scss">
.el-table .disabledRow {
  cursor: no-drop;
  color: #cccccc !important;
}
</style>
