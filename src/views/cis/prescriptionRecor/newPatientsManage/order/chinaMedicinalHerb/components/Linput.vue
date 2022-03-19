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
            <span
              v-if="item.codeTransform"
              v-codeTransform
              :code="item.codeTransformCode"
              :val="scope.row[item.prop]"
            ></span>
            <template v-else-if="item.tableTransform">
              <!--科室 药房 返显-->
              <span
                v-if="item.tableTransformType === 'sys_org'"
                v-tableTransform
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: scope.row[item.prop],
                }"
                columns="org_nm"
              ></span>
              <!--项目类别返显-->
              <span
                v-else-if="item.tableTransformType === 'cnf_doctors_advice'"
                v-tableTransform
                tableName="cnf_doctors_advice"
                columns="doctors_advice_name"
                :conditionMap="{
                  doctors_advice_code: scope.row[item.prop],
                }"
              ></span>
            </template>
            <span v-else class="overflow-point">{{
              scope.row[item.prop]
            }}</span>
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
      >
        <i
          slot="suffix"
          v-if="showClear"
          style="cursor: pointer"
          class="el-input__icon el-icon-circle-close"
          @click.stop="clear"
        ></i>
      </el-input>
    </el-popover>
  </div>
</template>
<script>
  export default {
    props: {
      showClear: {
        type: Boolean,
        default: false
      },
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
      placeholder: {
        type: String,
        default: "请输入内容"
      },
      backDrugName: {
        type: String
      }
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
      inputValue() {
        this.curIdx = null; //重置
      },
      tableData:{
        handler() {
          if (this.tableData.length && this.curIdx === null) {
            this.tableKeyDown(1);
          }
          this.$nextTick(() => { //数据更新之后  对table 选中 curIdx
            this.setTableCur();
          });

        },
        deep: true
      },
      backDrugName: {
        handler(val) {
          if (this.inputValue == val) {
            return;
          }
          this.inputValue = val;
        },
        immediate: true
      }
    },
    methods: {
      clear() {
        this.$emit("clear");
      },
      clearInputValue() {
        this.inputValue = "";
      },
      searchHandler(event) {

        let tarValue = event.target.value;
        // 按键下
        if (event.keyCode === 40) {
          // this.tableKeyDown(1);
          console.log("tarValuetarValuetarValuetarValue",tarValue)
          this.tableKeyDown(tarValue, 1);
          return;
        }
        // 按键上
        if (event.keyCode === 38) {
          // this.tableKeyDown(-1);
          this.tableKeyDown(tarValue, -1);
          return;
        }
        // 确认键
        if (event.keyCode === 13) {
          this.tableKeyEnter();
          return;
        }
        // 过滤非值的按键
        // if (!this.isValueKey(event.keyCode)) {
        //   return;
        // }

        this.debounce(this.query, 800)(tarValue, false, 0);
      },
      // 防抖函数实现
      debounce(fn, wait = 50) {
        let _this = this;
        // 通过闭包缓存一个定时器 id
        // 将 debounce 处理结果当作函数返回
        // 触发事件回调时执行这个返回函数
        return function (...args) {
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
      //value:检索值；flag:是否清空选择的药品业务数据；keyDirection：按键上下键
      query(value, flag, keyDirection) {
        if (typeof value === "undefined") {
          value = this.inputValue;
        }

        // this.$emit("update:backDrugName", value);
        this.$emit("query", value, flag || false, keyDirection);
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
      tableKeyDown(val, keyDirection) {
        if (this.curIdx === null) {
          this.curIdx = 0;
        } else if (keyDirection > 0 && this.curIdx >= this.tableData.length - 1) {
          // this.curIdx = 0;
          this.query(val, true, keyDirection);
        } else if (keyDirection < 0 && this.curIdx <= 0) {
          // this.curIdx = this.tableData.length - 1;
          return;
        } else {
          this.curIdx += keyDirection;
        }
        this.setTableCur();
      },
      tableKeyEnter() {
        if (this.tableData.length > 0) {
          // debugger
          this.inputValue = this.tableData[this.curIdx].drugName;
          this.$emit("select", this.tableData[this.curIdx]);
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
          if (this.curIdx > 2 || this.curIdx < this.tableData.length - 3) {
            this.$refs.singleTable.bodyWrapper.scrollTop = (this.curIdx - 2) * 32;
          } else if (this.curIdx <= 2) {
            this.$refs.singleTable.bodyWrapper.scrollTop = 0;
          }
        }
      }
    }
  };
</script>
