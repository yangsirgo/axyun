<template>
  <div class="jieduan-con height100">
    <div class="top-con">
      <div class="button-list">
        <el-button type="primary" icon="el-icon-back">向前添加阶段</el-button>
        <el-button type="primary" icon="el-icon-right">向后添加阶段</el-button>
        <el-button type="primary">
          <i class="icontianjiayizhu iconfont"></i>
          添加分支阶段</el-button
        >
        <el-button>
          <i class="iconzhenduanluru iconfont"></i>修改阶段名称</el-button
        >
        <el-button>删除</el-button>
      </div>
      <div class="process-list">
        <img class="img" src="@/assets/process.png" alt="" />
      </div>
    </div>
    <div class="contain-con">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主要诊疗工作" name="one">
          <div class="btn-con">
            <el-button type="primary" icon="el-icon-plus"
              >添加项目分类</el-button
            >
            <el-button type="primary">新增包</el-button>
            <el-button type="primary">新增组</el-button>
            <el-button type="primary">新增互斥</el-button>
            <el-button type="primary">新增可选</el-button>
          </div>

          <div class="eduit">
            <div class="eduit-detail">
              <div class="import-one">
                <i class="iconfont  el-icon-caret-bottom mar-left-10"></i>
                <span>入院处理</span>
              </div>
              <div class="fold">
                <i class="iconfont el-icon-s-fold"></i>
              </div>
              <div class="wirter">
                <i class="iconfont el-icon-edit"></i>
              </div>
              <div class="del">
                <i class="iconfont iconshanchu"></i>
              </div>
            </div>
            <div class="eduit-detail pad-left-35 mar-top-10">
              <div class="import-one">
                <span>书写病程录</span>
              </div>
              <div class="fold">
                <i class="iconfont el-icon-s-fold"></i>
              </div>
              <div class="wirter">
                <i class="iconfont el-icon-edit"></i>
              </div>
              <div class="del">
                <i class="iconfont iconshanchu"></i>
              </div>
            </div>
            <div class="eduit-detail pad-left-35 mar-top-10">
              <div class="import-one">
                <span>书写病案首页</span>
              </div>
              <div class="fold">
                <i class="iconfont el-icon-s-fold"></i>
              </div>
              <div class="wirter">
                <i class="iconfont el-icon-edit"></i>
              </div>
              <div class="del">
                <i class="iconfont iconshanchu"></i>
              </div>
            </div>
            <div class="line">
              <img src="@/assets/line.png" alt=""  alt=""/>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="长期医嘱" name="two"></el-tab-pane>
        <el-tab-pane label="临时医嘱" name="three"></el-tab-pane>
        <el-tab-pane label="出院带药" name="four"></el-tab-pane>
        <el-tab-pane label="主要护理工作" name="five"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  methods: {
    handleClick() {}
  },
  components: {},
  data() {
    return {
      activeName: "one"
    };
  }
};
</script>

<style lang='scss' scoped>
.jieduan-con {
  .top-con {
    margin: 20px;
    .button-list {
    }
    .process-list {
      margin-top: 20px;
      width: 100%;
      height: 200px;
      background: #ffffff;
      border: 1px solid #e4e4e4;
      border-radius: 2px;
      .img {
        margin: 20px;
        width: 560px;
        height: 100px;
      }
    }
  }
  .mar-left-10 {
    margin-left: 10px;
  }
  .mar-top-10 {
    margin-top: 10px;
  }
  .pad-left-35 {
    padding-left: 35px;
  }
  .contain-con {
    .btn-con {
      margin-left: 20px;
    }
    .eduit {
      margin: 10px 20px;
      position: relative;
      .line {
        width: 28px;
        height: 140px;
        position: absolute;
        left: 0;
        top: 40px;
        img {
          width: 100%;
        }
      }
      .eduit-detail {
        width: 100%;
        display: flex;
        line-height: 30px;
        height: 30px;
        flex-direction: row;
        .import-one {
          flex: 1;

          background: $l-color-bgcolor-18;
        }

        .fold {
          position: relative;
          width: 30px;
          text-align: center;
          background: $l-color-bgcolor-18;
        }
        .fold::before {
          content: "";
          width: 1px;
          height: 20px;
          background-color: #e4e4e4;
          position: absolute;
          left: 0;
          top: 5px;
        }
        .wirter {
          margin-left: 5px;
          width: 30px;
          text-align: center;
          background: $l-color-bgcolor-18;
        }
        .del {
          margin-left: 5px;
          width: 30px;
          text-align: center;
          background: $l-color-bgcolor-18;
        }
      }
    }
  }
}

/deep/ .el-tabs__nav-scroll {
  padding-left: 20px;
  border-bottom: 1px solid #e4e4e4;
}
</style>

