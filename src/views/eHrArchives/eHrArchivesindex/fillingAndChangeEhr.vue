<template>
  <div class="width100 height100 eHrArchivesindexStyle">
    <div class="recordCreate width100 height100">
      <el-card class="card-cont1 width100">
        <!-- 左边的大的table -->
        <div class="eHrArchivesLeft">
          <el-tabs
            :tab-position="tabPosition"
            @tab-click="eHrArchivesLeftFun"
            style="height: auto"
            v-model="activeName"
          >
            <el-tab-pane label="概要信息" name="first">
              <div class="summaryinfo">
                <summaryinfo
                  @drawerrue="drawerrue"
                  :patientArchiveInfoVO="patientArchiveInfoVO"
                ></summaryinfo>
              </div>
            </el-tab-pane>

            <el-tab-pane label="历次就诊" v-if="displayStyle" name="second">
              <el-col class="eHrArchivesLeftA">
                <eHrArchivesLeft
                  @eHrArchivesRightDataFun="eHrArchivesRightDataFun"
                ></eHrArchivesLeft>
              </el-col>
              <el-col class="eHrArchivesRightA">
                <eHrArchivesRight ref="eHrArchivesRight"></eHrArchivesRight>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="健康主题" v-if="displayStyle" name="third">
              <healthTheme></healthTheme>
            </el-tab-pane>
            <el-tab-pane label="费用情况" v-if="displayStyle" name="fourth"
              >费用情况</el-tab-pane
            >
          </el-tabs>

          <!-- 抽屉 start -->
          <transition name="fades">
            <summaryinfoDrawer
              @drawerrue="drawerrue"
              :drawerrueData="drawerrueData"
              class="summaryinfo-drawer"
              v-if="drawer"
            ></summaryinfoDrawer>
          </transition>

          <!-- 抽屉 end-->
        </div>
      </el-card>
      <div class="zhezhao width100" v-if="isVisible"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 概要信息 start
import summaryinfo from "@/views/eHrArchives/eHrArchivesindex/components/summaryinfo/summaryinfo.vue";
import summaryinfoDrawer from "@/views/eHrArchives/eHrArchivesindex/components/summaryinfo/components/summaryinfoDrawer.vue";
// 概要信息 end
// 历次就诊左右
import eHrArchivesLeft from "@/views/eHrArchives/eHrArchivesindex/components/eHrArchivesLeft/eHrArchivesLeft.vue";
import eHrArchivesRight from "@/views/eHrArchives/eHrArchivesindex/components/eHrArchivesRight/eHrArchivesRight.vue";
// 健康主题
import healthTheme from "@/views/eHrArchives/eHrArchivesindex/components/healthTheme/healthTheme.vue";
// 左侧列表
import LSideTabsNew from "@/components/LSideTabsNew.vue";
// top 部分
import top from "./components/summaryinfo/components/top.vue";

export default {
  name: "index",
  components: {
    LSideTabsNew,
    eHrArchivesLeft,
    eHrArchivesRight,
    healthTheme,
    summaryinfo,
    summaryinfoDrawer,
    top
  },
  data() {
    return {
      readTheDataListObj: "",
      // 控制标签的显示和隐藏
      displayStyle: false,

      // 从侧面往top传输的字段
      patientArchiveInfoVO: {},
      // 往抽屉里传参数据
      drawerrueData: {},
      // 控制左侧的切换的
      tabPosition: "left",
      // 主体左侧默认显示
      activeName: "first",
      // 配合信息概要显示抽屉的字段
      summaryinfoSign: false,
      //表单只读
      isVisible: false,
      timer: null, //定时器
      form: {
        //查询右侧列表数据
        reservation: 0,
        recordStatus: "",
        timeRange: []
      },
      // 抽屉
      drawer: false
    };
  },
  props: ["readTheDataList"],
  computed: {
    ...mapGetters("ehr", ["eHrleftData"])
  },
  watch: {
    patientArchiveInfoVO: {
      handler(newVal) {
        this.patientArchiveInfoVO = this.eHrleftData.patientArchiveInfoVO;
      },
      deep: true
    }
  },
  created() {
    this.patientArchiveInfoVO = {};
  },
  methods: {
    htmlShowStyleFunData(a) {},
    addnewFun(inputnum, a) {
      console.log("不可以新鲜劲");
    },
    // 抽屉传过来的值
    drawerrue(a, b) {
      // 接受summaryinfo传过来的数据并传给抽屉
      if (b) {
        this.drawerrueData = b;
      }
      this.drawer = a;
    },
    // new fun start
    eHrArchivesLeftFun(a, b) {
      console.log(a, b);
    },
    // 获取左边传过来的值
    eHrArchivesRightDataFun(a) {
      console.log("左边传过来的值", a);
      // 改变在右边的值
      this.$refs.eHrArchivesRight.eHrArchivesRightData = a;
    },
    // new fun end
    //工具箱
    messageHandler() {
      console.log("工具箱");
    },
    //element组件input无法输入问题
    inputChange(e) {
      this.$forceUpdate();
    },
    //格式化日期
    getFormatDate(d) {
      let year = d.getFullYear();
      let month = this.change(d.getMonth() + 1);
      let day = this.change(d.getDate());
      return year + "-" + month + "-" + day;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      }
      return t;
    }
  }
};
</script>

<style scoped lang="scss">
.display-style {
  display: none;
}
.eHrArchivesLeft {
  position: relative;
  overflow: hidden;
  z-index: 1;
  background-color: #ffffff;
}
.summaryinfo-drawer {
  width: 100%;
  height: 100%;
  position: absolute;
  // left: 100%;
  top: 0;
  z-index: 10;
}
/deep/ .el-tabs--left .el-tabs__nav-wrap.is-left {
  margin-right: -2px;
}
.fades-enter-active,
.fades-leave-active {
  transition: all ease 0.5s;
}
.fades-enter,
.fades-leave-to {
  left: 100%;
}
.fades-leave,
.fades-enter-to {
  left: 0%;
}
.top-enter-active,
.top-leave-active {
  transition: all ease 0.5s;
}
.top-enter,
.top-leave-to {
  height: 0px;
}
.top-leave,
.top-enter-to {
  height: 60px;
}

//信息概要是否显示
.summaryinfoSign /deep/ .el-tabs--left .el-tabs__header.is-left {
  padding: 0px !important;
  width: 0px !important;
  margin: 0px !important;
}

.recordCreate {
  overflow-y: auto;
  .eHrArchivesLeftA {
    width: 25%;
    height: 100%;
  }
  .eHrArchivesRightA {
    width: 75%;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .card-cont1 {
    height: 100%;
    padding: 0px;
  }

  .card-cont2 {
    height: 130px;
    padding: 20px;
    margin-top: 20px;
  }

  .zhezhao {
    height: 100%;
    background-color: $l-color-black;
    opacity: 0.05;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 2s;
  }
}

.margin-top-10 {
  margin-top: 10px;
}

.margin-bottom-20 {
  margin-bottom: 20px;
}

.padding-bottom-30 {
  padding-bottom: 30px;
}

.margin-bottom-30 {
  margin-bottom: 30px;
}

.border-bottom {
  border-bottom: 1px solid $l-color-bgcolor-11;
}

.margin-bottom-6 {
  margin-bottom: 6px;
}
</style>
