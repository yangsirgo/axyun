<template>
  <div class="PTitleList">
    <div class="title_group">
      <div class="decorative_strip"></div>
      <div class="title">查询列表</div>
    </div>
    <div class="btn">
      <el-button @click="newMethod()" v-if="!healthDR" type="primary">新建</el-button>
      <el-button @click="restoreMethod()" v-if="healthDR" type="primary">档案恢复</el-button>
      <el-button @click="deleteMethod()" v-if="healthDR" type="primary">档案删除</el-button>
      <p-svg class="pl-10" name="vertical_bar" width="24" height="24" />
      <el-tooltip class="item" effect="dark" content="全屏" placement="top">
        <div @click="buttoncli()" class="cursor">
          <p-svg class="plr-10" name="full_screen" width="24" height="24" />
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <div @click="refresh()" class="cursor">
          <p-svg name="refresh" width="24" height="24" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
// import screenfull from "screenfull";
export default {
  name: "PTitleList",
  props: {
    healthDR: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { fullscreen: false };
  },
  mounted() {},
  methods: {
    newMethod() {
      this.$emit("new-method");
    },
    restoreMethod() {
      this.$emit("restore-method");
    },
    deleteMethod() {
      this.$emit("delete-method");
    },
    refresh() {
      this.$emit("refresh-method");
    },
    // 全屏
    buttoncli() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
      setTimeout(() => {
        console.log("document.body.offsetHeight", document.body.offsetHeight);
      }, 50);
    }
  },
  updated() {},
  watch: {}
};
</script>

<style scoped lang="scss">
.PTitleList {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 0 30px 0;
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
    align-items: center;
  }
}
</style>
