<template>
  <div class="wrapper">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{ 'margin-right': toolBoxExpanded ? '298px' : '56px' }"
      >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div
      class="float-left right"
      :style="{
        width: toolBoxExpanded ? '287px' : '46px',
        'margin-left': toolBoxExpanded ? '-287px' : '-46px'
      }"
    >
      <tool-box
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        :boxName="defaultBoxName"
        :modules="boxs"
        pageName="inventoryWindow"
      />
    </div>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import lMain from "./windowInput.vue";
export default {
  components: { FlowMenu, lMain, ToolBox },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String
    }
  },
  data() {
    return {
      boxs: ["Hotkey"], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false
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
