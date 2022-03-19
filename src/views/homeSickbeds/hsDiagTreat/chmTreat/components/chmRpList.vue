<template>
  <div class="page height100">
    <div class="pageTitle"> 处方列表 </div>
    <div
      class="pageContent"
      ref="pageContent"
    >
      <template v-if="rpList.length > 0">
        <div
          :class="itemCls(item, index)"
          v-for="(item, index) in rpList"
          :key="index"
        >
          <div
            class="itemInner"
            @click="chmDetails($event,item, index)"
          >
            <span
              :val="item.status"
              code="adviceStatus"
              v-codeTransform
            ></span>
            <span>&nbsp;&nbsp;</span>
            <span>{{ item.no || "--" }}</span>
          </div>
        </div>
      </template>
      <div class="emptyShow" v-else> 暂无处方数据 </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    rpList: {
      type: Array,
      default() {
        return [];
      }
    },
    beforeLeave: Function
  },
  data() {
    return {
      currentIndex: -1
    };
  },
  methods: {
    async chmDetails(event, item, index) {
      if (this.beforeLeave) {
        const before = this.beforeLeave(item);
        if (before && before.then) {
          before.then(
            () => {
              this.setCurrent(item, index);
            },
            () => {}
          );
        } else if (before !== false) {
          this.setCurrent(item, index);
        }
      } else {
        this.setCurrent(item, index);
      }
    },
    setCurrent(item, index) {
      this.currentIndex = index;
      this.$emit("chmDetails", item);
    },
    clearCurrent() {
      this.currentIndex = -1;
    },
    setHighLight(index) {
      this.currentIndex = index;
    },
    scrollBottom() {
      this.$nextTick(() => {
        this.$refs.pageContent.scrollTop = this.$refs.pageContent.scrollHeight;
      });
    },
    itemCls(item, index) {
      return {
        item: true,
        activeItem: index == this.currentIndex
      };
    }
  },
  components: {},
  watch: {
    // rpList() {
    //   // this.currentIndex = -1;
    // }
  }
};
</script>

<style scoped lang="scss">
.item {
  line-height: 24px;
  display: flex;
  text-align: center;
  // padding: 8px;
  font-size: 0;
  border-bottom: 1px solid #ccc;
  .itemInner {
    flex: 1;
    justify-items: center;
    font-size: 14px;
  }
  .icon {
    font-size: 24px;
    padding-left: 4px;
    vertical-align: bottom;
    font-size: 14px;
  }

  .message,
  .index {
    padding-right: 4px;
    font-size: 14px;
  }

  // .btn {
  //   display: inline-block;
  // }
  &.activeItem {
    background-color: rgba(43, 69, 131, 0.25);
  }
}

.page {
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.pageContent {
  overflow: auto;
  flex: 1;
}

.pageTitle {
  line-height: 40px;
  text-align: center;
  color: #fff;
  background: #808fb5;
  font-weight: 400 !important;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
}

.emptyShow {
  text-align: center;
  padding: 10px;
}
</style>
