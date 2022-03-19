<template>

  <div class="app-container" style="height: 100%;overflow-y: auto">
    <!-- 此页面已经停用 -->
    <div style="text-align: right;">
      <el-button size="mini" @click="handleClear">清屏</el-button>
      <!--      <el-button   size="mini"  @click="onPrintShow">打印预览</el-button>-->
      <!--      <el-button   size="mini"  @click="onPrint">静默打印</el-button>-->
    </div>
    <iframe
      onload="this.height=800"
      width="100%"
      scrolling="yes"
      style="border:0;"  title="内嵌页面"
      src
      name="commentIFrame"
      id="commentIFrame"
    ></iframe>
  </div>
</template>
<script>
import $ from "jquery";
import { pdfShow, onPrint } from "@/utils/ureport";
import { getServerConfig } from "@/utils/config";

export default {
  mounted() {
    // $("#commentIFrame").attr("src",  process.env.VUE_APP_BASE_API+"/ureport/designer");
    this.handleClear();
    // process.env.VUE_APP_UREPORT_API
    // console.log("api",process.env.VUE_APP_UREPORT_API)
  },
  methods: {
    handleClear() {
      // $("#commentIFrame").attr("src",  "http://localhost:8887/ureport/designer");
      $("#commentIFrame").attr(
        "src",
        getServerConfig("UREPORT_API") + "/ureport/designer"
      );
    },
    onPrint() {
      let map = new Object();
      map["age"] = 50;

      let data = {};
      data.name = "用户信息";
      data.map = map;

      //可以忽略不写，默认为A4纸宽度
      //上边距
      data.tmargins = 10;
      //左边距
      data.lmargins = 10;
      //纸张的宽度
      data.pageWidth = 749;
      //纸张的高度
      data.pageHeight = 1123;

      onPrint(data);
    },
    onPrintShow() {
      let map = new Object();
      map["age"] = 50;

      let data = {};
      data.name = "用户信息";
      data.map = map;

      pdfShow(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.header-button {
  padding: 7px 0;
}
.app-container {
  // background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding-top: 0;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}
</style>

