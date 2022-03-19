<template>
  <div class="wrapper">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{'margin-left': toolBarExpanded ? '298px' : '56px', 'margin-right': toolBoxExpanded ? '298px' : '56px'}"
      >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <advDis :selectId="selectId" ></advDis>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left" :style="{'width': toolBarExpanded ? '287px' : '46px'}">
      <left-list :timer="isOpen" :open.sync="toolBarExpanded" @selectIdChange="selectIdChange"></left-list>
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
import Sidebar from "@/views/public/sidebar";
import LeftList from "./components/leftList";
import advDis from "./components/advReyurn";
export default {
  components: { FlowMenu, ToolBox, Sidebar, LeftList, advDis },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String
    },
    // 工具箱默认是否展开状态
    boxExpanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectId: 0,
      isOpen: false, // 是否显示定时器
      boxs: [], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false,
      toolBarExpanded: true
    };
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true
    }
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(selectId) {
      this.selectId = selectId;
      console.log(this.selectId);
    }
  }
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
      margin: 0 297px 0 297px;
      height: 100%;
    }
  }
  .left {
    width: 287px;
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
