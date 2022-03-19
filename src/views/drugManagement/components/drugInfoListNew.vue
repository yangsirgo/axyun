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
        @keyup.native="searchHandler"
      ></el-input>
      <!-- @change="searchHandler" -->
    </el-popover>
  </div>
</template>
<script>
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import hmmBaseApi from "@/api/hmm/base";
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
    // 库房code
    storageCode: {
      type: String,
      default: ""
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
      tableLoading: false
    };
  },
  watch: {
    name(val) {
      if (val) {
        console.log(`val`, val);
        this.inputValue = val;
      }
    }
  },
  computed: {
    curStorageCode() {
      return this.storageCode;
    }
  },
  mounted() {
    // 点击其他地方隐藏搜索药品弹窗
    document.addEventListener("click", this.hideInfo, false);
    // 初始化默认打开加载数据，并聚焦
    this.$refs.singleInput.$refs.input &&
      this.$refs.singleInput.$refs.input.focus();
    /* setTimeout(() => {
      this.$refs.singleInput.$refs.input &&
        this.$refs.singleInput.$refs.input.focus();
      this.showPopover();
    }, 500); */
  },
  methods: {
    // 获取当前的药房code
    storageCodeFun() {
      let storageCode = JSON.parse(getRole()).deptCode;
      return storageCode;
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
    // 防抖函数实现
    debounce(fn, wait = 50) {
      let _this = this;
      // 通过闭包缓存一个定时器 id
      // 将 debounce 处理结果当作函数返回
      // 触发事件回调时执行这个返回函数
      return function(...args) {
        // 如果已经设定过定时器就清空上一次的定时器
        if (_this.searchTimer) {
          // 清空数据
          clearTimeout(_this.searchTimer);
        }

        // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
        _this.searchTimer = setTimeout(() => {
          fn.apply(_this, args);
        }, wait);
      };
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
      this.query();
    },
    query() {
      console.log(`this.inputValue`, this.inputValue);
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
        status: 1,
        drugName: this.inputValue,
        //当前角色或者知道的库房
        storageCode: this.storageCodeFun()
      };
      this.tableLoading = true;
      hmmBaseApi
        .getDrugList(params)
        .then(res => {
          this.tableData = [];
          this.total = res.total;
          console.log(res, "打印弹窗的返回数据");
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
            this.$nextTick(() => {
              this.curIdx = 0;
              this.setTableCur();
            });
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
        this.inputValue = this.tableData[this.curIdx].drugName;
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
<style lang="scss">
.el-table .disabledRow {
  cursor: no-drop;
  color: #cccccc !important;
}
</style>
