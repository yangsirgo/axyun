<template>
  <div>
    <div class="l-table-handle-box">
      <slot name="table-top-bar"></slot>
    </div>
    <div class="l-table">
      <div :class="[title?'l-table-content':'l-table-content-nottitle']">
        <slot name="table-body"></slot>
      </div>
      <div class="l-table-page" v-if="paginationShow">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="prevClick"
          @next-click="nextClick"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :layout="layout"
          :total="total"
          :background="background"
          :small="small"
          :disabled="disabled"
          :prev-text="prevText"
          :next-text="nextText"
          :hide-on-single-page="hideOnSinglePage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LTable',
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    paginationShow: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Object
    },
    tableboxPosition: {
      type: Object,
      validator(value) {
        var postionList = Object.keys(value);
        const defaultPosition = ['left', 'right', 'top', 'bottom'];
        return postionList.every(item => {
          return defaultPosition.indexOf(item) > -1;
        });
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const defaultPagination = {
      small: false,
      pageSize: 10, // 当前一页显示多少条数据
      pageSizes: [10, 20, 30, 40, 50, 100], // 分页规则
      currentPage: 1, // 当前所在页
      background: false, // 分页背景调整
      total: 0, // 总的数量
      disabled: false, // 是否禁用
      prevText: '', // 替代图标显示的上一页文字
      nextText: '', // 替代图标显示的下一页文字
      hideOnSinglePage: false, // 只有一页时是否隐藏
      layout: 'prev, pager, next'
    }
    const defaultTableboxPosition = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
    const pagination = Object.assign(defaultPagination, this.pagination);
    let tableboxPosition = Object.assign(
      defaultTableboxPosition,
      this.tableboxPosition
    );
    tableboxPosition = this.handlTableboxPosition(tableboxPosition);
    return {
      pageSizes: pagination.pageSizes,
      pageSize: pagination.pageSize,
      layout: pagination.layout,
      total: pagination.total,
      background: pagination.background,
      small: pagination.small,
      disabled: pagination.disabled,
      hideOnSinglePage: pagination.hideOnSinglePage,
      currentPage: pagination.currentPage, // 页数索引
      prevText: pagination.prevText,
      nextText: pagination.nextText,
      positionObject: {
        // table box 的 位置
        top: tableboxPosition.top,
        left: tableboxPosition.left,
        right: tableboxPosition.right,
        bottom: tableboxPosition.bottom
      }
    }
  },
  methods: {
    handlTableboxPosition(pObject) {
      // 对位置数据加单位px
      for (const key in pObject) {
        const value = parseInt(pObject[key]);
        pObject[key] = value + 'px';
      }
      return pObject;
    },
    getAjaxParam() {
      return {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
    },
    // 点击每页显示数量时触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit('size-change', val, this.getAjaxParam());
    },
    // 翻页的时候触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit('current-change', val, this.getAjaxParam());
    },
    // 用户点击上一页按钮改变当前页后触发
    prevClick(currentPage) {
      this.$emit('prev-click', currentPage, this.getAjaxParam());
    },
    // 用户点击下一页按钮改变当前页后触发
    nextClick(currentPage) {
      this.$emit('next-click', currentPage, this.getAjaxParam());
    }
  },
  mounted() {
    const pagination = this.pagination;
    this.$set(pagination, 'currentPage', this.currentPage);
    this.$set(pagination, 'pageSize', this.pageSize);
  },
  computed: {},
  watch: {
    pagination: {
      // 监听pagination，数据变化实时更新
      handler(pagObject) {
        this.currentPage = pagObject.currentPage;
        this.pageSize = pagObject.pageSize;
        this.total = pagObject.total;
      },
      deep: true
    },
    currentPage(val) {
      // 监听currentPage，数据变化实时更新
      this.pagination.currentPage = val;
    },
    pageSize(val) {
      // 监听pageSize，数据变化实时更新
      this.pagination.pageSize = val;
    }
  }
};
</script>

<style scoped lang="scss">
.l-table-wrapper {
  .l-table-handle-box {
    padding: 10px 0;
    height: 56px;
    > div {
      width: auto;
    }
    > button {
      width: auto;
    }
  }
  .l-table {
    width: 100%;
    position: relative;
    &-title {
      color: #fff;
      background: #42a2f5;
      padding: 0;
      font-size: 15px;
      height: 40px;
      line-height: 40px;
      text-indent: 8px;
    }
    &-content {
      width: 100%;
      height: calc(100% - 40px - 52px);
    }
    &-content-nottitle {
      width: 100%;
      height: calc(100% - 52px);
    }
    &-page {
      .el-pagination {
        margin: 10px 0;
        text-align: right;
      }

    }
  }
}
/deep/.el-pagination__total{
    float: left;
}
/deep/.el-pagination{
    float: right;
    margin-top:20px;
    display: inline-block;
}

</style>
