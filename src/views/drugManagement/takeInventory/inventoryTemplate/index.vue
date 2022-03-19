<template>
  <div class="wrapper">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{
          'margin-right': toolBoxExpanded ? '298px' : '56px'
        }"
      >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main ref="main" :selectId="selectId" @tem-list-change="temListChange"></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left">
      <left ref="leftList" @newAdd="newAdd" @selectIdChange="selectIdChange"></left>
    </div>
    <div
      class="float-left right"
      :style="{
        width: toolBoxExpanded ? '287px' : '46px',
        'margin-left': toolBoxExpanded ? '-287px' : '-46px'
      }"
    >
      <tool-box
        :boxName="defaultBoxName"
        :modules="boxs"
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        pageName="inventoryTemplate"
      />
    </div>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import left from "./left.vue";
import lMain from "./main.vue";

export default {
  components: { FlowMenu, ToolBox, left, lMain },
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
      boxs: ["Hotkey"], //工具箱
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
    },
    newAdd() {
      this.selectId = "";
      this.$refs.main.newAdd();
    },
    // main组件保存模板成功，通知左侧列表刷新
    temListChange() {
      this.$refs.leftList.reList();
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
