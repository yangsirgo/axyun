<template>
  <div class="main-contain height100">
    <el-tabs
      class="tabsWrapper"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="item.label"
        :name="item.name"
        :key="index"
        v-for="(item, index) in datas"
        lazy
      >
      </el-tab-pane>
    </el-tabs>
    <div class="com-live">
      <!-- <keep-alive> -->
      <!-- <div class="height100">
          <component
            :is="item.component"
            ref="component"
            :name="item.name"
            @toolBoxsChange="toolBoxsChange"
            :class="item.name"
          ></component>
        </div> -->
      <div
        class="height100"
        v-if="tabComponent.name === activeName"
      >
        <component
          ref="component"
          :is="tabComponent.component"
          :name="tabComponent.name"
          :class="tabComponent.name"
          hosType=3
          @toolBoxsChange="toolBoxsChange"
          @setWrapperActiveName="setWrapperActiveName"
        ></component>
      </div>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// import diagnosisCard from "./diagnosis/index.vue"; //诊断
import diagnosisCard from "@/views/public/diagnosis/index.vue"; //诊断管理
import orderCard from "./order/index.vue"; //医嘱录入
import overViewAll from "./overViewAll/index.vue"; //总览
import returnMedicine from "./returnMedicine/index.vue"; //退药申请
import fromThebed from "./fromThebed/index.vue"; //撤床
import chmMedicine from './chmTreat/chmMedicine'; //中草药

export default {
  name: "tabWrapper",
  components: {
    diagnosisCard,
    orderCard,
    overViewAll,
    returnMedicine,
    fromThebed,
    chmMedicine
  },
  data() {
    let datas = [
      {
        name: "overViewAll",
        label: "总览",
        component: "overViewAll",
        resources: []
      },
      {
        name: "diagnosis",
        label: "诊断管理",
        component: "diagnosisCard",
        resources: []
      },
      {
        name: "order",
        label: "医嘱录入",
        component: "orderCard",
        resources: []
      },
      {
        name: "chmMedicine",
        label: "中草药",
        component: "chmMedicine",
        resources: []
      },
      {
        name: "returnMedicine",
        label: "退药申请",
        component: "returnMedicine",
        resources: []
      },
      {
        name: "fromThebed",
        label: "撤床",
        component: "fromThebed",
        resources: []
      }
      // {
      //   name: "electronApply",
      //   label: "电子申请",
      //   component: "electronApplyCard",
      //   resources: []
      // },
      // {
      //   name: "consultation",
      //   label: "会诊",
      //   component: "consultationCard",
      //   resources: []
      // },
      // {
      //   name: "allergy",
      //   label: "过敏",
      //   component: "allergyCard",
      //   resources: []
      // },
      // {
      //   name: "critical",
      //   label: "危急值",
      //   component: "criticalCard",
      //   resources: []
      // },
      // {
      //   name: "leaveCard",
      //   label: "病假单",
      //   component: "leaveCard",
      //   resources: []
      // },
      // {
      //   name: "baoKa",
      //   label: "报卡",
      //   component: "infectiousCard",
      //   resources: []
      // }
    ];
    return {
      // cisPageParam:{},//页面跳转携带的参数
      activeName: "overViewAll",
      tabComponent: datas[0],
      datas
    };
  },
  created() {
    // this.tabComponent = this.datas[0];
    this.handleClick(this.datas[0]);
  },
  mounted() {},
  methods: {
    ...mapActions({
      changeCurrentTabsWrapper: "homeSickbeds/changeCurrentTabsWrapper"
    }),
    toolBoxsChange(boxsList,activeName) {
      console.log(activeName,"nihao ");
      if(activeName == 'overViewAll'){
        this.activeName = "overViewAll";
        this.tabComponent = this.datas[0];
      }
      if(activeName == 'orderCard'){
        this.activeName = "order";
        this.tabComponent = this.datas[2];
      }
      if(activeName == 'returnMedicine'){
        this.activeName = "returnMedicine";
        this.tabComponent = this.datas[3];
      }
      if(activeName == 'diagnosisCard'){
        this.activeName = "diagnosis";
        this.tabComponent = this.datas[1];
      }
      // console.log(this.activeName,"nihao ");
      this.$emit("toolBoxsChange", this.activeName, boxsList);
    },
    messageHandler(val) {
      //工具箱的透传数据
      let targetRef = this.$refs.component;
      //   // console.log(targetRef);
      //   switch (this.activeName) {
      //     case "order":
      //       this.$nextTick(() => {
      //         try {
      //           targetRef.saveHandle();
      //         } catch (e) {}
      //       });
      //       break;
      //     case "diagnosis": //诊断页面
      //       this.$nextTick(() => {
      //         try {
      //           targetRef.messageHandler(val);
      //         } catch (e) {}
      //       });
      //       break;
      //     case "electronApply": //电子申请
      //       this.$nextTick(() => {
      //         try {
      //           targetRef.messageHandler(val);
      //         } catch (e) {}
      //       });
      //       break;
      //   }
      switch (this.activeName) {
        case "diagnosis": //诊断页面
          this.$nextTick(() => {
            try {
              targetRef.messageHandler(val);
            } catch (e) {}
          });
          break;
        case "order": //诊断页面
          this.$nextTick(() => {
            try {
              targetRef.messageHandler(val);
            } catch (e) {}
          });
          break;
      }
    },
    handleClick(tab) {
      console.log(tab);
      this.tabComponent = this.datas.find(item => {
        return item.name === tab.name;
      });
      console.log(this.tabComponent);
      this.$emit("tab-change", tab);
    },
    // pageObj 数据格式  { name: "oder", addition: [{ adviceType }] }
    //addition  附加功能，比如说长期医嘱 跳医嘱页面 默认选中长期医嘱
    setWrapperActiveName({ name, addition }) {
      console.log(name, addition);
      this.activeName = name;
      this.handleClick({ name });
      // tabs 页面的跳转逻辑
      this.pageLogic({ name, addition });
    },
    // 页面跳转的业务逻辑
    pageLogic({ name, addition }) {
      switch (name) {
        case "order":
          this.$nextTick(() => {
            console.log(this.$refs);
            console.log(this.$refs.component);
            this.$refs.component.additionHandler(addition);
          });
          break;

        default:
          break;
      }
    }
  },
  watch: {
    // cisPageData : {
    //   deep:true,
    //   handler (obj){
    //     this.cisPageParam = obj.pageParams;
    //     this.activeName = obj.toPageName;
    //   }
    // }
    activeName: {
      immediate: true,
      handler (){
        this.changeCurrentTabsWrapper(this.activeName);
      }
    }
  },
  computed: {
    // ...mapGetters("cis", ["cisPageData"]),
  }
};
</script>

<style scoped lang="scss">
.main-contain {
  display: flex;
  flex-direction: column;
  .com-live {
    flex: 1;
    height: 0;
  }
}
.tabsWrapper {
  > /deep/.el-tabs__header {
    padding-left: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>
