<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <component :is="bodyMain" :selectData="selectData" @refresh-left="refreshLeft"></component>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left">
      <left ref="left" @selectIdChange="selectIdChange"></left>
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
import lMain from "./ophaWithdrawal.vue";
import lMainBatch from "./ophaWithdrawalBatch.vue";
import { mapGetters } from "vuex";
export default {
  components: { FlowMenu, ToolBox, left },
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
      selectData: {},
      boxs: ["returnDrugProcess", "otherPrescription"], //工具箱
      defaultBoxName: "returnDrugProcess",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      bodyMain: lMainBatch
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["isBatchManagement"])
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true
    },
    isBatchManagement: {
      immediate: true,
      handler(v) {
        if (v) {
          this.bodyMain = lMainBatch;
        } else {
          this.bodyMain = lMain;
        }
      }
    }
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(selectData) {
      this.selectData = selectData;
    },
    refreshLeft() {
      this.$refs.left.search();
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
