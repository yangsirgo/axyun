<template>
  <div>
    <div class="l-table-handle-box">
      <slot name="table-top-bar"></slot>
    </div>
    <div class="l-table">
      <div :class="[title?'l-table-content':'l-table-content-nottitle']">
        <slot name="table-body"></slot>
      </div>
      <div class="l-table-page" >
            <pagination
              v-show="total>0"
              :total="total"
              :pageSize.sync="limit"
              :page.sync="currentPage"
              @pagination="changeSize"
              :refresh="refresh"
              :background="background"
              :pageSizes='pageSizes'
              :layout='layout'
              :autoScroll='autoScroll'
              :hidden='hidden'
            />
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
     total: {
      required: true,
      type: Number
    },
    pageSize: {
      type: Number,
      default: 20
    },
    page: {
      type: Number,
      default: 1
    },
    refresh: {
      type: Boolean,
      default:true
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      }
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
    changeSize(val){
      console.log('val', val)
       this.$emit('changeSize', val);
    },

  },
  mounted() {
    
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      }
    },
    limit: {
      get() {
        return this.pageSize;
      },
      set(val) {
        this.$emit("update:pageSize", val);
      }
    }
  },

  
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


</style>
