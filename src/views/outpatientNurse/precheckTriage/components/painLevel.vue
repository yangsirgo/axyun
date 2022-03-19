<template>
  <div class="pain-level-con">
    <el-dialog
      title="疼痛分级表"
      :visible.sync="dialogVisible"
      width="716px"
      :before-close="handleClose"
    >
      <div class="sign-confirm-middle">
        <div class="level-con">
          <div class="con">
            <div
              class="inline-block level"
              v-for="(item, index) in lineData"
              :key="index"
              :style="item.style"
            >
              <span class="level-num">{{ item.num }}</span>
            </div>
          </div>
          <div class="emjo emjo-list">
            <div
              class="emjo-con"
              v-for="(item, index) in emjoList"
              :key="index"
              @click="choosePainLevel(index)"
            >
              <i
                class="emjo-block iconfont"
                :class="[item.icon]"
                :style="item.style"
              ></i>
              <p class="emjo-text">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="sign-confirm-footer">
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClose">关闭</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "painLevel",
  props: ["show"],
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit("closeModel");
    },
    // 选择疼痛等级
    choosePainLevel(index) {
      let text = this.emjoList[index].text;
      this.$emit("choosePainLevel", { text: text });
      this.handleClose();
    }
  },
  components: {},
  data() {
    return {
      lineData: [
        {
          num: 0,
          style: {
            backgroundColor: "#74B451"
          }
        },
        {
          num: 1,
          style: {
            backgroundColor: "#80BA53"
          }
        },
        {
          num: 2,
          style: {
            backgroundColor: "#88BC50"
          }
        },
        {
          num: 3,
          style: {
            backgroundColor: "#98C34D"
          }
        },
        {
          num: 4,
          style: {
            backgroundColor: "#C0CA43"
          }
        },
        {
          num: 5,
          style: {
            backgroundColor: "#F1CA2D"
          }
        },
        {
          num: 6,
          style: {
            backgroundColor: "#EBB231"
          }
        },
        {
          num: 7,
          style: {
            backgroundColor: "#E19831"
          }
        },
        {
          num: 8,
          style: {
            backgroundColor: "#DC802D"
          }
        },
        {
          num: 9,
          style: {
            backgroundColor: "#D6682D"
          }
        },
        {
          num: 10,
          style: {
            backgroundColor: "#D04C2B"
          }
        },
        {
          num: "",
          style: {
            backgroundColor: "#CC2F2C"
          }
        }
      ],
      emjoList: [
        {
          icon: "iconwutong",
          text: "无痛",
          style: {
            color: "#6bab4c"
          }
        },
        {
          icon: "iconqingwei",
          text: "轻微疼痛",
          style: {
            color: "#8dba49"
          }
        },
        {
          icon: "iconqingdu",
          text: "轻度疼痛",
          style: {
            color: "#eec337"
          }
        },
        {
          icon: "iconzhongdu",
          text: "中度疼痛",
          style: {
            color: "#dc8e36"
          }
        },
        {
          icon: "iconzhongdu1",
          text: "重度疼痛",
          style: {
            color: "#cf5f30"
          }
        },
        {
          icon: "iconjulie",
          text: "剧烈疼痛",
          style: {
            color: "#c42e2d"
          }
        }
      ]
    };
  },
  computed: {
    dialogVisible() {
      return this.show;
    }
  }
};
</script>

<style lang='scss' scoped>
$bgc: #2e323a;
.pain-level-con {
  .sign-confirm-middle {
    width: 100%;
    padding: 100px 40px 80px 40px;
    .level-con {
      .level {
        position: relative;
        width: 50px;
        height: 30px;
        .level-num {
          position: absolute;
          top: -40px;
          right: -3px;
        }
      }
      .level:nth-child(odd) {
        &::after {
          position: absolute;
          top: -20px;
          right: 0px;
          content: "";
          display: inline-block;
          width: 2px;
          height: 50px;
          background-color: $bgc;
        }
      }
      .level:nth-child(even) {
        &::after {
          position: absolute;
          top: -20px;
          right: 0px;
          content: "";
          display: inline-block;
          width: 2px;
          height: 138px;
          background-color: $bgc;
        }
      }
      .level:nth-last-child(1) {
        &::after {
          content: "";
          display: inline-block;
          width: 0px;
          height: 138px;
          background-color: $bgc;
        }
      }
      .emjo-list {
        .emjo-con {
          position: relative;
          display: inline-block;
          width: 100px;
          height: 100px;
          text-align: center;
          cursor: pointer;
          .emjo-block {
            font-size: 5.5em;
          }
          .emjo-text {
            margin-top: 5px;
            text-align: center;
            
            font-weight: 400;
            color: rgba(46, 50, 58, 1);
            line-height: 20px;
          }
        }
      }
    }
  }
  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
}
</style>
