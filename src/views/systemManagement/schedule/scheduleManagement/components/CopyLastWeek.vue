<template>
  <div class="copyweek">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="copytitle"
      :visible.sync="isShowCopy"
    >
      <div class="choose-main">
        <p>请选择周次复制排班</p>

        <div v-if="copyType=='lastweek'" class="calendar-box"><!-- 复制上周 -->
          <el-date-picker
            style="width:272px"
            v-model="appointStartWeek"
            type="week"
            disabled
            format="yyyy年第WW周"
            value-format="yyyy-MM-dd"
            :picker-options="pickoptions"
            placeholder="请选择周"
          ></el-date-picker>
          <i style="font-size:36px" class="el-icon-right"></i>
          <el-date-picker
            style="float:right;width:272px"
            v-model="appointEndWeek"
            type="week"
            disabled
            format="yyyy年第WW周"
            value-format="yyyy-MM-dd"
            :picker-options="pickoptions"
            placeholder="请选择周"
          ></el-date-picker>
        </div>
        <div v-if="copyType=='appointweek'" class="calendar-box"><!-- 复制指定周次 -->
          <el-date-picker
            style="width:272px"
            v-model="startWeek"
            type="week"
            format="yyyy年第WW周"
            value-format="yyyy-MM-dd"
            :picker-options="pickoptions"
            placeholder="请选择周"
          ></el-date-picker>
          <i style="font-size:36px" class="el-icon-right"></i>
          <el-date-picker
            style="float:right;width:272px"
            v-model="endWeek"
            type="week"
            format="yyyy年第WW周"
            value-format="yyyy-MM-dd"
            :picker-options="pickoptions"
            placeholder="请选择周"
          ></el-date-picker>
        </div>
        <div class="tips-box">
          <span>提示：</span>
          <br />
          <span>不支持对已排班项的替换，如本周二上午已有排班，复制的上周二上午未排班，将不会替换本周。</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="sure-button" type="primary" @click="sureCopy">确定复制</el-button>
        <el-button class="cancle-button" @click="cancleCopy">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "copyLastWeek",
  props: {
    copytitle: {
      type: String,
      default: "复制上周排班"
    },
    copyType: {
      type: String,
      default: "lastweek"
    },
    appointEndWeek: String
  },
  data() {
    return {
      // appointStartWeek:'',
      isShowCopy: false,
      pickoptions: {
        firstDayOfWeek: 1
      },
      startWeek:'',//复制指定周次开始时间
      endWeek:''//复制指定周次结束时间
    };
  },
  watch: {
    endWeek(newval, oldval) {
      console.log(newval);
    }
  },
  created() {
    // console.log(this.getMinusDate(this.appointEndWeek,-7))
  },
  computed: {
    appointStartWeek() {
      return this.getMinusDate(this.appointEndWeek, -7);
    }
  },
  methods: {
    getMinusDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var val = d.getFullYear() + "-" + month + "-" + day;
      return val;
    },
    sureCopy() {
      this.isShowCopy = false;
      if(this.copyType == "lastweek"){
        this.$emit("copyWeekSchedule",this.appointStartWeek);
      }else if(this.copyType == "appointweek"){
        this.$emit("copyWeekSchedule",this.startWeek);
        this.$emit("initData",this.endWeek)
      }
    },
    cancleCopy() {
      this.isShowCopy = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.is-selected {
  color: #1989fa;
}
/deep/.copyweek {
  .el-dialog {
    border-radius: 4px;
    .el-dialog__body {
      padding: 20px;
      .choose-main {
        p:first-of-type {
          font-size: $l-font-size-max;
          font-weight: $l-font-weight;
          line-height: 24px;
          color: $l-color-fontcolor-3;
        }
        .calendar-box {
          position: relative;
          width: 100%;
          height: 80px;
          line-height: 80px;
          .el-input--medium {
            .el-input__inner {
              padding: 0 40px;
            }
          }
          .el-icon-right {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -18px;
            margin-top: -18px;
            width: 36px;
            height: 36px;
            vertical-align: middle;
          }
        }
        .tips-box {
          width: 100%;
          height: 76px;
          padding: 15px 20px;
          background: $l-color-bgcolor-18;
          font-size: $l-font-size;
          font-weight: 400;
          line-height: 20px;
        }
      }
    }
    .el-dialog__footer {
      border-top: 1px solid $l-color-bgcolor-11;
      height: 76px;
      padding: 20px;
      .dialog-footer {
        .sure-button,
        .cancle-button {
          width: 80px;
          height: 36px;
          border-radius: 2px;
          font-size: $l-font-size;
          border: 1px solid $l-color-primary;
          color: $l-color-primary;
        }
        .sure-button {
          color: #fff;
          padding: 0;
        }
      }
    }
  }
}
</style>
