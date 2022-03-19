<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main
              ref="main"
              :selectId="selectId"
              :leftText="leftText"
              :leftTextObj="leftTextObj"
              @searchCB="searchCB"
              @unlock="unlockLeft"
            ></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left">
      <left
        ref="left"
        @selectIdChange="selectIdChange"
        :searchCBData="searchCBData"
        :refreshIndex = "refreshIndex"
      ></left>
    </div>
    <div
      class="float-left right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
    >
      <tool-box
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        :boxName="defaultBoxName"
        :modules="boxs"
      />
    </div>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import left from "./left.vue";
import lMain from "./ophaDelivery.vue";
import { mapGetters } from "vuex";

export default {
  components: { FlowMenu, ToolBox, left, lMain },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String,
    },
    // 工具箱默认是否展开状态
    boxExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectId: "",
      leftText: {}, //窗口和配药人信息
      leftTextObj:{},//左侧传过来数据
      searchCBData: 0,
      boxs: ["drugCheck", "otherPrescription", "skinTest", "decoctionReg"], //工具箱
      defaultBoxName: "drugCheck",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      // 判断是否 可以刷新左侧列表
      refreshIndex:""
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["isBatchManagement"]),
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true,
    },
    isBatchManagement: {
      immediate: true,
      handler(v) {
        if (v) {
          this.boxs = [
            "drugCheck",
            "otherPrescription",
            "skinTest",
            "decoctionReg",
            "drugBatch",
          ];
        } else {
          this.boxs = [
            "drugCheck",
            "otherPrescription",
            "skinTest",
            "decoctionReg",
          ];
        }
      },
    },
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(data,obj) {
      this.leftText = data;
      this.leftTextObj = obj;
      this.$nextTick(function(){
          this.$refs.main.autoSendDrugFun();
      })
    },
    searchCB(a) {
      // this.refreshIndex = a;//0是可以全部刷新1是不可以
      if(a == '0'){
        this.$refs.left.search();
      }else{
        this.$refs.left.search("old");
      }
    },
    // 允许左侧列表切换处方
    unlockLeft() {
      this.$refs.main && this.$refs.left.unlockLeftList();
    },
  },
};
</script>
<style lang="scss" scoped>
.patient-card-container {
  margin-bottom: 20px;
  height: 66px;
  width: 100%;
}

.wrapper {
  padding: 0;
  height: 100%;
  overflow: hidden;

  .main {
    width: 100%;
    height: 100%;

    .main_wrap {
      margin: 0 297px 0 350px;
      height: 100%;
    }
  }

  .left {
    width: 340px;
    height: 100%;
    margin-left: -100%;
  }

  .right {
    width: 287px;
    height: 100%;
    margin-left: -287px;
  }
}
</style>
