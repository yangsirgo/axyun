<template>
  <div class="PTitleSearch">
    <div class="title_group">
      <div class="decorative_strip"></div>
      <div class="title">查询条件</div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="query()">查询</el-button>
      <el-button @click="reset()">重置</el-button>
      <div class="pl-10">
        <!-- <div v-show="boxshow"> -->
        <transition name="el-fade-in">
          <el-button type="text" @click="show()">
            {{boxshow?'收起':'展开'}}
            <i
              :class="boxshow?'el-icon-arrow-up':'el-icon-arrow-down' "
              class="el-icon--right"
            ></i>
          </el-button>
        </transition>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PTitleSearch",
  props: {
    title: {
      type: String,
      require: true
    },
    boxshow: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    query() {
      this.$emit("query-method");
    },
    reset() {
      this.$emit("reset-method");
    },
    show() {
      this.$emit("show");
    }
  },
  updated() {},
  watch: {}
};
</script>

<style scoped lang="scss">
.PTitleSearch {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  .title_group {
    display: flex;
    align-items: center;
    .decorative_strip {
      width: 4px;
      height: 15px;
      background: rgba(44, 69, 131, 1);
      margin-top: -1px;
    }
    .title {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(50, 53, 59, 1);
    }
  }

  .btn {
    display: flex;
    .el-button--text {
      border-color: transparent;
      color: #2e323a;
      background: transparent;
      padding-left: 0;
      padding-right: 0;
    }
    .el-icon-arrow-down {
      color: rgba(212, 212, 212, 1);
    }
    .el-icon-arrow-up {
      color: rgba(212, 212, 212, 1);
    }
  }
}
</style>
