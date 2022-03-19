<template>
  <div class="wrapper">
    <!-- 中间展示区域 -->
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{
          'margin-right':
            toolBoxShow === true
              ? toolBoxExpanded && displayMode === 'expand'
                ? `${containerWidth + 11}px`
                : '56px'
              : '0',
        }"
      >
        <slot name="content"></slot>
      </div>
    </div>
    <!-- 右侧工具箱区域 -->
    <div
      class="float-left right"
      v-if="toolBoxShow"
      :style="{
        width:
          toolBoxExpanded && displayMode === 'expand'
            ? `${containerWidth}px`
            : '46px',
        'margin-left':
          toolBoxExpanded && displayMode === 'expand'
            ? `-${containerWidth}px`
            : '-46px',
      }"
    >
      <tool-box
        :containerWidth="containerWidth"
        :isHome="isHome"
        :boxName="defaultToolName"
        :modules="toolBoxs"
        :visitType="visitType"
        :displayMode="displayMode"
        :open.sync="toolBoxExpanded"
        :editor="editor"
        :editorType="editorType"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>
  </div>
</template>
<script>
import ToolBox from "@/views/public/tools/emrTools";

export default {
  name: "LIframe",
  components: {
    ToolBox
  },
  props: {
    // 工具箱配置
    toolBoxs: {
      type: Array
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
    // 工具箱详情展示模式 两种模式  expand  伸缩式  float  悬浮式
    displayMode: {
      type: String,
      default: "expand"
    },
    // 控制右侧工具箱是否可用
    toolBoxShow: {
      type: Boolean,
      default: true
    },
    editor: {
      type: Object,
      default: null
    },
    visitType: {
      type: String,
      default: "01"
    },
    isHome: {
      type: String,
      default: "0"
    },
    editorType: {
      // 编辑器类型
      type: String,
      default: "01"
    }
  },
  data() {
    return {
      toolBoxExpanded: false,
      toolBarExpanded: true,
      leftToolBoxFloatShow: false,
      containerWidth: 360
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
  mounted() {},
  methods: {
    query(data) {
      this.$emit("query", data);
    }
  }
};
</script>
<style lang="scss" scoped>
.patient-card-container {
  margin-bottom: 10px;
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
      margin: 0 297px 0 0;
      height: 100%;
    }
  }
  .right {
    // width: 287px;
    height: 100%;
    // margin-left: -287px;
  }
}
</style>
