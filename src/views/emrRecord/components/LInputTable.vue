<template>
  <el-popover
    placement="bottom"
    trigger="manual"
    :width="popoverWidth"
    :value="popverVisbile"
  >
    <el-table
      ref="singleTable"
      :data="tableData"
      height="300"
      highlight-current-row
      style="width: 100%"
      v-loading="tableLoading"
      element-loading-text="列表正在加载中"
      @row-click="selectHandler"
      @keyup.enter="test"
    >
      <el-table-column
        class="overflow-point"
        border
        v-for="(item, index) in tableParams"
        :key="index"
        :header-align="item.headerAlign || 'center'"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'center'"
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
            <!--医嘱子类返显-->
            <span
              v-else-if="item.prop === 'subclassOrders'"
              columns="doctors_advice_name"
              :conditionMap="{ doctors_advice_code: scope.row.subclassOrders }"
              tableName="cnf_doctors_advice"
              v-tableTransform
            ></span>
            <!--单位返显-->
            <span
              v-else-if="item.prop === 'unit'"
              :val="scope.row.unit"
              code="DrugDoseUnit"
              v-codeTransform
            ></span>
          </template>
          <span v-else-if="item.prop === 'selected'">
            <span v-if="scope.row[item.prop]" class="el-icon-check"></span>
          </span>
          <span v-else class="overflow-point" :title="scope.row[item.prop]">{{
            scope.row[item.prop]
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="reference">
      <el-input
        ref="singleInput"
        v-model="inputValue"
        class="input-common"
        :placeholder="placeholder"
        @blur="hidePopover"
        @focus="focus"
        @input="inputChangeHandler"
        @keyup.native="keyupHandler"
        @keydown.native="keydownHandler"
      ></el-input>

      <template>
        <l-tags-del
          v-if="deptList.length >= 1"
          size="small"
          closable
          effect="plain"
          @close="closeHandler(deptList[0])"
          @click="tagClickHandler"
          >{{ deptList[0].orgNm }}</l-tags-del
        >
        <span
          class="num-text"
          @click="showPopover"
          v-show="deptList.length > 1"
        >
          + {{ number }}
        </span>
      </template>
    </div>
  </el-popover>
</template>
<script>
import LTagsDel from "./LTagsDel";
export default {
  name: "LInputTable",
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
    deptList: {
      type: Array,
      default: () => {
        return [];
      },
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
    inputName: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请输入内容"
    },
    // 选中table下的某一条数据后
    // 输入框中的值更新为这条数据的某个key
    valueKey: {
      type: String,
      default: ""
    }
  },
  components: {
    LTagsDel
  },
  data() {
    return {
      popverVisbile: false,
      searchTimer: null,
      inputValue: "",
      agreeSearch: true,
      curIdx: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      //dom 加载 初始化分页数据
      this.$emit("mounted");
    });
  },
  computed: {
    number() {
      return this.deptList.length - 1;
    }
  },
  watch: {
    tableData() {
      if (this.tableData.length && this.curIdx === null) {
        this.tableKeyDown(1);
      }
      this.$nextTick(() => {
        //数据更新之后  对table 选中 curIdx
        this.setTableCur();
      });
    },
    inputName: {
      immediate: true,
      handler() {
        // 为解决bug33907、33843：删除该行，但医嘱项目没有被删除问题
        //console.log('this.inputName',this.inputName)
        // console.log('this.inputValue',this.inputValue)
        this.agreeSearch = false;
        this.inputValue = this.inputName;
      }
    },
    inputValue(newValue, oldValue) {
      // console.log('newValue',newValue)
      // console.log('oldValue',oldValue)
      if (newValue === oldValue) {
        return;
      }
      console.log(newValue, "newValue");
      this.curIdx = null;
      if (this.agreeSearch) {
        this.$emit("inputTableValChange", "");
        this.searchHandler();
      }
    }
  },
  methods: {
    inputChangeHandler() {
      this.searchHandler();
    },
    closeHandler(value) {
      console.log(value, "value");
      this.$emit("delDeptHandler", value);
    },
    tagClickHandler(value) {
      console.log(value, "value");
      this.showPopover();
    },
    keyupHandler(event) {
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

      if (this.inputValue !== event.target.value) {
        this.inputValue = event.target.value;
      }
    },
    keydownHandler(event) {
      this.agreeSearch = true;
    },
    searchHandler() {
      this.debounce(this.query, 300)();
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
    query(isPage = false) {
      this.$emit("query", this.inputValue, isPage);
      if (!this.popverVisbile) {
        this.showPopover();
      }
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
        // this.curIdx = 0;
        if (!this.tableLoading) {
          // 非loading 状态下 分页
          this.query(true);
        }
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
        // this.$emit("select", this.tableData[this.curIdx]);
        this.selectHandler(this.tableData[this.curIdx]);
      } else {
        this.hidePopover();
      }
    },
    selectHandler(row) {
      try {
        this.$emit("select", row);
      } catch (error) {}

      if (this.valueKey) {
        try {
          this.agreeSearch = false;
          this.inputValue = row[this.valueKey];
        } catch (error) {
          this.agreeSearch = true;
        }

        this.$nextTick(() => {
          this.agreeSearch = true;
        });
      }
      this.hidePopover();
    },
    clear() {
      this.agreeSearch = false;
      this.inputValue = "";
      this.$nextTick(() => {
        this.agreeSearch = true;
      });
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
        this.showPopover();
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

<style lang="scss">
.el-popper {
  padding: 8px;
}
</style>

<style land="scss" scoped>
.input-common {
  width: 150px;
}
.num-text {
  display: inline-block;
  box-sizing: border-box;
  color: #2b4583;
  height: 24px;
  padding: 0 8px;
  line-height: 22px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
</style>
