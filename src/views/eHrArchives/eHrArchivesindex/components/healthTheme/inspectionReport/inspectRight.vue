<template>
  <div class="eHrArchivesRight">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClickWrap">
      <el-tab-pane label="报告" name="first">
        <div class="diagnosisBox heightmin400">
          <h3 class="diagnosish3">CT诊断报告单</h3>

          <el-col :span="24" class="attributeBox">
            <el-col class="attributeelCol">
              <span class="attributeSpan">姓名</span>
              <span class="valueSpan">张三</span>
            </el-col>
            <el-col class="attributeelCol">
              <span class="attributeSpan">性别</span>
              <span class="valueSpan">男</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">年龄</span>
              <span class="valueSpan">23</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">影像号</span>
              <span class="valueSpan">内科</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">科室</span>
              <span class="valueSpan">03</span>
            </el-col>



          </el-col>

          <el-col :span="24" class="attributeBox">
            <el-col class="attributeelCol">
              <span class="attributeSpan">住院号</span>
              <span class="valueSpan">03</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">床号</span>
              <span class="valueSpan">12312</span>
            </el-col>
            <el-col class="attributeelCol">
              <span class="attributeSpan">检查类型</span>
              <span class="valueSpan">CT</span>
            </el-col>
            <el-col class="attributeelCol">
              <span class="attributeSpan">检查时间</span>
              <span class="valueSpan">12312</span>
            </el-col>
            <el-col class="attributeelCol">
              <span class="attributeSpan">检查部位</span>
              <span class="valueSpan">12312</span>
            </el-col>
          </el-col>

          <el-col>
            <span class="imagePresentation">影像表现</span>
            <div class="imagePresentation-text">
              脑实质密度正常，未见异常密度影及占位病变。脑室、脑池及脑沟的大小、形态和位置未见异常，中线结构无移位。顶部皮下可见软组织增厚影，枕骨右侧局限性可见多发条带透亮影。

            </div>
          </el-col>
          <el-col>
            <span class="imagePresentation">

            </span>
            <div class="imagePresentation-text">
              脑实质密度正常，未见异常密度影及占位病变。脑室、脑池及脑沟的大小、形态和位置未见异常，中线结构无移位。顶部皮下可见软组织增厚影，枕骨右侧局限性可见多发条带透亮影。

            </div>
          </el-col>
        </div>

      </el-tab-pane>
      <el-tab-pane label="图像" name="second">
          <div class="heightmin400"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  // import {eventBus} from '@/api/eHrArchives/eventBus';
  export default {
    data() {
      return {
        // 检查的左侧的for 数据
        // 左侧传回来的值
        eHrArchivesRightData: "",
        activeName: 'first'
        // 表格假数据
      }
    },

    created() {

    },
    methods: {
      handleClickWrap(tab, event) {
        console.log(tab, event);
      }

    },
    watch: {
      // "eHrArchivesRightData":{
      //   handler(newVal){
      //       alert(this.eHrArchivesRightData.eHrArchivesRight,"获取父组件的值");
      //   },
      //   deep: true
      // }
    }
  };
</script>

<style scoped lang="scss">
  .eHrArchivesRight {
    width: 100%;
    height: 100%;
    min-height: 400px;

    /deep/ .el-tabs--border-card>.el-tabs__content {
      padding: 0;
    }
    .heightmin400{
      min-height: 400px;
    }

    .inspectFiveLeftList-top {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .inspectFiveLeft {
      overflow: auto;
      height: 100%;
      border-right: 1px solid rgba(228, 228, 228, 1);
    }

    .inspectFiveLeftList {
      cursor: pointer;
      box-sizing: border-box;
      padding: 5px;

    }

    .diagnosisBox {
      min-height: 400px;
    }

    .diagnosish3 {
      text-align: center;
    }

    .attributeBox {
      height: auto;
      overflow: auto;

    }

    .attributeelCol {
      width: 20%;
      display: inline-block;
      padding: 3px;
      box-sizing: border-box;
      float: left;
    }

    .attributeelColwidth {
      width: 25%;
    }

    .attributeSpan {
      display: inline-block;
      margin-right: 5px;
      font-size: 14px;
      color: rgba(148, 157, 163, 1);
      line-height: 20px;
    }

    .valueSpan {
      display: inline-block;
      font-size: 14px;
      color: rgba(46, 50, 58, 1);
      line-height: 20px;
    }

    // healthThemeRight
    .imagePresentation {
      font-size: 14px;
      color: rgba(46, 50, 58, 1);
      line-height: 20px;
      display: block;
      margin: 15px;
    }

    .imagePresentation-text {
      padding: 8px;
      font-size: 14px;
      color: rgba(46, 50, 58, 1);
      line-height: 20px;
    }

  }
</style>
