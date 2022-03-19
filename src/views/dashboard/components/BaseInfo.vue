<template>
  <div class="height100">
    <el-card class="height100">
      <div class="head width100">
        <div class="head-info">{{this.date}}</div>
        <div class="head-info">{{this.week}}</div>
        <div>{{this.time}}</div>
      </div>
      <div class="main width100">
        <div class="main-left height100">
          <img class="l-center" src="@/assets/doctImg.png" alt=""/>
        </div>
        <div class="main-right height100">
          <div class="l-center-vertical">
            <div class="wel">欢迎</div>
            <div class="docName">{{this.role.roleName}}</div>
            <div class="introduce">主任医师 、教授 、博士生导师</div>
            <div class="dept">{{this.role.deptName}}</div>
          </div>
        </div>
      </div>
      <div class="tabs width100">
        <el-tabs v-model="activeName">
          <el-tab-pane label="通知公告" name="first">
            <div class="tabInfo">
              <div class="float-left">系统升级通知</div>
              <div class="float-right">2019-10-13 11:02</div>
            </div>
            <div class="tabInfo">
              <div class="float-left">外科专病门诊时间调整</div>
              <div class="float-right">2019-10-02 09:02</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="待办事项" name="second">
            <div class="tabInfo">
              <div class="float-left">天津站踝关节专题会</div>
              <div class="float-right">2019-10-08 10:10</div>
            </div>
            <div class="tabInfo">
              <div class="float-left">髋部骨折新技术国际交流</div>
              <div class="float-right">2019-10-06 10:02</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="院内制度" name="third">
            <div class="tabInfo">
              <div class="float-left">医院行政管理制度</div>
              <div class="float-right">2019-09-02 10:02</div>
            </div>
            <div class="tabInfo">
              <div class="float-left">医院党群组织管理制度</div>
              <div class="float-right">2019-08-02 10:02</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      date: new Date().format("yyyy-MM-dd"),
      week: "星期" + "日一二三四五六".charAt(new Date().getDay()),
      time: "",
      activeName: "second"
    };
  },
  created() {
    this.getTime();
  },
  beforeDestroy() {
    this.stopTime();
  },
  computed: {
    ...mapGetters("user", ["name", "role"])
  },
  mounted() {
    // console.log("------" , this.name, this.role);
    // console.log("----name-----", this.name);
  },
  methods: {
    getTime() {
      // let _this = this;
      // var time = setInterval(function() {
      //   _this.time = new Date().format("hh:mm");
      // }, 1000);
    },
    stopTime() {
      clearInterval(this.time);
    }
  }
};
</script>
<style lang="scss" scoped>
.head {
  height: 44px;
  background: rgba(246, 246, 246, 1);
  border-radius: 4px 4px 2px 2px;
  padding: 0 20px;
  line-height: 44px;
  text-align: center;
  font-size: 20px;
 
  font-weight: bold;
  color: rgba(46, 50, 58, 1);
  position: relative;
  div {
    float: left;
  }
  .head-info {
    position: relative;
    &::before {
      content: "";
      float: right;
      width: 1px;
      height: 16px;
      background: #e4e4e4;
      margin-left: 12px;
      margin-right: 12px;
      margin-top: 15px;
    }
  }
}
.main {
  position: relative;
  height: 162px;
  border-bottom: 1px solid #e4e4e4;
  .main-left {
    width: 120px;
    position: relative;
    float: left;
    img {
      width: 80px;
      height: 102px;
    }
  }
  .main-right {
    position: relative;
    float: left;
    div {
      margin-bottom: 10px;
    }
    .wel {
      font-size: 14px;
      
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
    }
    .docName {
      font-size: 18px;
      
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
    }
    .introduce {
      font-size: 14px;
      
      font-weight: 400;
      color: rgba(148, 157, 163, 1);
    }
    .dept {
      font-size: 14px;
      
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
    }
  }
}
.tabs {
  padding: 20px;
  /deep/ .el-tabs__item {
    &.is-active {
      font-weight: bold !important;
    }
  }
  .tabInfo {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    border-bottom: 1px solid #e4e4e4;
  }
}
</style>