<template>
  <!--<div class="skinTest" v-if="isShow">-->
  <div class="skinTest">
     <span class="time">
         剩余时间
         <span class="timeOnline">{{showTimeText}}</span>
     </span>
  </div>
</template>

<script>

  export default {
    name: "LSkinTestCounter",
    props: {
      startTime: {
        require: true,
        type: String
      }
    },
    data() {
      return {
        isShow: this.startTime !== 0,//显示倒计时 字段
        timeNo: this.startTime,
        showTimeText: '00:00',// 显示的文本
        percentage: 100,
        timer: null,
        timeNoCopy: this.startTime // 控制进度条的时间
      }
    },
    methods: {
      //不够10 补0
      addZero(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      },
      //皮试倒计时
      showTime() {
        // console.log("this.timeNoCopy",this.timeNoCopy)
        let me = this;
        this.timeNo = this.timeNo - 1000;
        let leftTime = parseInt(this.timeNo / 1000);
        
        // let h = parseInt(leftTime / 60 % 60);
        // console.log("leftTime",leftTime)
        let m = parseInt(leftTime / 60);
        // console.log("m",m)
        let s = parseInt(leftTime % 60);
        m = me.addZero(m);
        s = me.addZero(s);
        me.percentage = this.timeNo / this.timeNoCopy * 100;
        if (leftTime <= 0) {
          me.showTimeText = '00:00';
          me.percentage = 0;
          this.isShow = false;
          me.$emit('time-end');
          return;
        } else {
          // console.log("me.showTimeText",me.showTimeText)
          me.showTimeText = m + ':' + s;
        }
        this.timer = setTimeout(me.showTime, 1000);
      },
      timeEnd() {
        clearTimeout(this.timer);
      },
      getAppleForm() {
        this.$emit('btn-click');
      }
    },
    mounted() {
      clearTimeout(this.timer);
      if (this.isShow) { //显示倒计时
        this.showTime();
      }
    },
    watch: {
      startTime(n) {
        // console.log("startTime-n",n)
        // if (n > 0) {//时间是0 不显示倒计时
          this.timeNo = n;
          this.timeNoCopy = n;
          // this.isShow = true;
          this.timeEnd();//清除定时器
          this.showTime();// 重启定时器
        // } else {
        //   this.isShow = false;
        // }
      }
    },
    destroyed() {
      //销毁事件
      this.showTime = null;
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="scss">

  .skinTest {
    /*width:218px;*/
    /*height:36px;*/
    /*background:rgba(245,245,245,1);*/
    /*border-radius:2px;*/
    /*line-height: 1;*/
    /*position: relative;*/
    /*padding: 0 5px;*/

    line-height: 36px;
    > .icon {
      color: rgba(240, 90, 35, 1);
    }

    .skinTestInner {
      line-height: 12px;
      position: absolute;
      left: 48px;
      top: calc(50% - 11px);
      right: 10px;

      .skinTestInner-text {
        display: inline-block;
        font-size: 12px;
        width: 100%;
        padding-right: 2px;
      }

      /deep/ .el-progress__text {
        display: none;
      }

      /deep/ .el-progress-bar__outer {
        background-color: #fff;
      }

      /deep/ .el-progress-bar {
        width: 124%;
        margin-right: -26px;
        padding-right: 40px;
      }
    }

    > div {
      display: inline-block;
      float: left;
    }

    .icon {
      line-height: 38px;
      font-size: 20px;
      width: 28px;
      height: 28px;
      text-align: center;
    }


    .nav-gap {
      position: relative;
      width: 1px;
      height: inherit;
      padding: 0 10px 0 5px;

      &:before {
        content: "";
        position: absolute;
        top: calc(50% - 10px);
        width: 1px;
        height: 20px;
        background: #ebebeb;
      }
    }

    .text {
      text-align: left;
      font-size: 12px;
      
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
    }

    .time {
      text-align: right;
    }
  }
</style>
