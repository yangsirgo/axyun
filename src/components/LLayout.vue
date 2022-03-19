<template>
  <div class="wrapper width100 height100" v-if="update">
    <!-- 左侧 -->
    <div
      class="left"
      v-if="patientListShow"
      :style="{
        width: widthConfig.largeWidth + 'px'
      }"
    >
      <slot name="list"></slot>
    </div>
    <!-- 中间展示区域 -->
    <div
      :class="['main', isChoosedPatient ? 'is-choosed-patient' : '']"
      :style="{
        'margin-right':
          toolBoxShowFlag && isToolBox && displayMode === 'float' ? '60px' : '0'
      }"
    >
      <div class="main_wrap">
        <div v-if="$slots.topSlot" ref="topSlot" style="margin-bottom: 10px">
          <slot name="topSlot"></slot>
        </div>
        <div :style="{ height: contentHeight }">
          <slot name="content"></slot>
        </div>
      </div>
    </div>

    <!-- 右侧 -->
    <div
      v-if="toolBoxShowFlag"
      :class="[
        'right',
        'height100',
        displayMode === 'float' ? 'display-position' : ''
      ]"
      :style="{
        width: toolBoxExpanded
          ? widthConfig.largeRightWidth + 'px'
          : widthConfig.minWidth + 'px'
      }"
    >
      <keep-alive>
        <tool-box
          v-if="toolBoxName === 'yun'"
          :boxName="defaultToolName"
          :modules="toolBoxs"
          :open.sync="toolBoxExpanded"
          :displayMode="displayMode"
          v-bind="$attrs"
          v-on="$listeners"
        />
        <emr-tool-box
          v-else-if="toolBoxName === 'emr'"
          :boxName="defaultToolName"
          :modules="toolBoxs"
          :open.sync="toolBoxExpanded"
          :displayMode="displayMode"
          v-bind="$attrs"
          v-on="$listeners"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import ToolBox from "@/views/public/tools/tools";
import EmrToolBox from "@/views/public/tools/emrTools";

export default {
  name: "LLayout",
  components: { ToolBox, EmrToolBox },
  props: {
    // 工具箱配置
    toolBoxs: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 默认显示哪个工具箱
    defaultToolName: {
      type: String
    },
    // 工具箱默认是否展开状态
    boxExpanded: {
      type: Boolean,
      default: false
    },
    // 控制左侧区域是否存在
    patientListShow: {
      type: Boolean,
      default: true
    },
    // 是否有工具箱
    isToolBox: {
      type: Boolean,
      default: true
    },
    // 工具箱详情展示模式 两种模式  expand  伸缩式  float  悬浮式
    displayMode: {
      type: String,
      default: "float"
    },
    // 是否有三级路由
    hasThreeRouterFlag: {
      type: Boolean,
      default: false
    },
    // 使用哪种工具箱
    toolBoxName: {
      type: String,
      default: "yun"
    }
  },
  data() {
    return {
      update: true,
      toolBoxExpanded: false,
      leftToolBoxFloatShow: false,
      widthConfig: {
        largeWidth: 264,
        largeRightWidth: 348,
        minWidth: 44
      },
      contentHeight: "100%",
      isChoosedPatient: false,
      queryIsChoosedPatient: null
    };
  },
  computed: {
    toolBoxShowFlag() {
      return this.toolBoxs.length !== 0 && this.isToolBox;
    }
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true
    },
    patientListShow: {
      handler(v) {
        this.leftToolBoxFloatShow = v;
      },
      deep: true,
      immediate: true
    },
    "$slots.topSlot": {
      handler() {
        this.contentHeight = this.getContentHeight();
      }
    },
    "$store.getters.role"(newValue, oldValue) {
      if (this.$route.name === "门诊诊疗") {
        this.update = false;
        this.$nextTick(() => {
          this.update = true;
        });
      }
    }
  },
  mounted() {
    this.contentHeight = this.getContentHeight();
    this.queryIsChoosedPatient = setInterval(() => {
      let patientList = document.getElementsByClassName("l-c-penetrate");
      if (patientList && patientList.length > 0) {
        this.isChoosedPatient = false;
        for (let index = 0; index < patientList.length; index++) {
          const element = patientList[index];
          if (element.classList.contains("is-active")) {
            this.isChoosedPatient = true;
            break;
          }
        }
      }
    }, 50);
  },
  methods: {
    getContentHeight() {
      let elem = this.$refs["topSlot"];
      if (!elem) {
        return "100%";
      }
      const height = window
        .getComputedStyle(elem)
        .getPropertyValue("height")
        .slice(0, -2);
      return "calc(100% - " + (height - 0 + 10) + "px)";
    }
  },
  beforeDestroy() {
    window.clearInterval(this.queryIsChoosedPatient);
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  position: relative;
  .main {
    flex: 1;
    height: 100%;
    border-radius: $l-bg-radius-max;
    overflow: hidden;
    border: 1px solid transparent;
    .main_wrap {
      height: 100%;
    }
  }

  .is-choosed-patient {
    border: 1px solid #2b4583;
  }

  .left {
    width: 224px;
    height: 100%;
    margin-right: 16px;
    border-radius: $l-bg-radius-max;
    background-color: $l-color-white;
  }
  .right {
    width: 288px;
    border-radius: 8px;
    margin-left: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: #f1f4f6;
  }
  .display-position {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2000;
  }
}
</style>
