<template>
  <!-- v-click-outside="onClickOutside" -->
  <div
    :class="[
      'bdr4',
      'height100',
      'position-relative',
      open ? 'container' : 'mini-container',
      displayMode !== 'float' ? 'overflow-hidden' : ''
    ]"
    :style="{ width: open ? `${containerWidth}px` : '50px' }"
  >
    <div class="left-container position-relative">
      <div class="title">
        <span>智能助手</span>
      </div>
      <div class="func-container scroll_content width100">
        <div
          v-for="(item, index) in func"
          :key="'func' + index"
          :class="[
            'title-item',
            'width100',
            'cursor-pointer',
            item.component === componentName ? 'title-item-activite' : ''
          ]"
          @click="updateComponentName(item.component, 'click')"
        >
          <div>
            <i :class="[item.icon, 'title-item-icon', 'iconfont']"></i>
          </div>
          <p class="title-item-name">{{ item.name }}</p>
        </div>
      </div>
      <div
        v-if="displayMode == 'expand'"
        class="toggle width100 cursor-pointer"
        ref="openBtn"
        id="emrToolsToggle"
        @click="handleOpen"
      >
        <i class="el-icon-arrow-right" :class="open ? '' : 'flip'"></i>
      </div>
    </div>
    <!-- float悬浮部分 -->
    <div
      :class="['float-container', 'scroll_content', open ? '' : 'dispaly-none']"
      ref="floatContainer"
      v-if="displayMode === 'float'"
    >
      <div class="icon-close" @click="closeFloatToolBox">
        <i class="el-icon-close"></i>
      </div>
      <component
        v-loading="loading"
        v-if="componentName"
        :is="componentName"
        class="toolboxs-content width100 height100 padding10 position-relative"
        v-bind="$attrs"
        v-on="$listeners"
      ></component>
      <div class="no-toolbox" v-else>请选择工具箱模块</div>
    </div>
    <template v-else-if="displayMode == 'expand'">
      <div class="right-container position-relative scroll_content" v-if="open">
        <component
          v-loading="loading"
          v-if="componentName"
          :is="componentName"
          class="toolboxs-content width100 height100 padding10 position-relative"
          v-bind="$attrs"
          v-on="$listeners"
        ></component>
        <div class="no-toolbox" v-else>请选择工具箱模块</div>
      </div>
    </template>
  </div>
</template>
<script>
import Vue from "vue";
import CONFIG from "./emrConfig";
let AllComponents = {};
for (let i = 0; i < CONFIG.length; i++) {
  const item = CONFIG[i];
  AllComponents[item.component] = item.regist;
}

export default {
  components: {
    ...AllComponents
  },
  props: {
    // 当前显示的工具名
    boxName: {
      type: String,
      default: ""
    },
    boxParams: {
      type: [Number, String, Object, Array, Boolean]
    },
    // 工具箱显示哪些模块
    modules: {
      type: Array,
      default: []
    },
    displayMode: {
      type: String,
      default: "expand"
    },
    // 工具箱是否展开
    open: {
      type: Boolean,
      default: false
    },
    // 当前文书 typecode
    typeCode: {
      type: String,
      default: ""
    },
    containerWidth: {
      type: [String, Number],
      default: "287"
    }
  },
  data() {
    return {
      func: [],
      loading: false,
      componentLoaded: false,
      componentName: "",
      boxTopTitle: ""
    };
  },
  watch: {
    boxName: {
      immediate: true,
      handler: function(val) {
        this.updateComponentName(val);
      }
    },
    modules: {
      immediate: true,
      handler: function(modules) {
        if (!modules) {
          return;
        }
        let func = [];
        for (let i = 0; i < modules.length; i++) {
          const name = modules[i];
          for (let j = 0; j < CONFIG.length; j++) {
            const item = CONFIG[j];
            if (item.component == name) {
              func.push(item);
              break;
            }
          }
        }
        this.func = func;
        this.initBox();
      }
    }
  },
  // mounted() {
  //   this.addEventListenerIframe();
  // },
  methods: {
    // 监听iframe中的点击事件，模拟成页面的点击事件
    addEventListenerIframe() {
      this.$nextTick(() => {
        let iframeList = document.getElementsByClassName(
          "ax-editor-content-iframe"
        )[0];
        let paranthtml = document.getElementsByTagName("body")[0];
        if (!iframeList) {
          return;
        }

        let iframe = iframeList.contentWindow;

        let iframeDocument = iframe.document;
        iframeDocument.addEventListener(
          "click",
          function() {
            paranthtml.click();
            paranthtml.focus();
          },
          false
        );
      });
    },
    onClickOutside(event, el) {
      if (this.displayMode === "expand") {
        return;
      }
      this.closeFloatToolBox();
    },
    handleOpen() {
      $("body>[class^='cdss-']").remove();
      this.$emit("update:open", !this.open);
      this.$emit("show", this.open);
      this.$nextTick(() => {
        // 检验报告页面，触发echart的resize事件
        this.$root.eventHub.$emit("chartResize");
      });
      this.$root.eventHub.$emit("editorResize", !this.open); // 编辑器下全屏修改位置
    },
    initBox() {
      this.componentLoaded = true;
      this.updateComponentName(this.boxName);
    },
    updateComponentName(name, tab = "") {
      if (tab === "click" && !this.open) {
        // 关闭工具箱内容是 点击工具箱模块展示
        this.$emit("update:open", true);
      }
      if (this.func.length == 0 || !this.componentLoaded) {
        this.componentName = "";
        return;
      }
      let boxTopTitle = this.func[0].name || "";

      if (!this.boxName && !this.componentName && this.func.length) {
        name = this.func[0].regist;
      }
      this.componentName = name;
      this.boxTopTitle = boxTopTitle;

      // 未开启情况下，手动开启
      // if (!this.open && this.displayMode === "expand") {
      //   this.$refs.openBtn.click();
      // }
    },
    // 关闭浮窗
    closeFloatToolBox() {
      this.$emit("update:open", false);
    }
  }
  // updated() {
  //   this.addEventListenerIframe();
  // }
};
</script>
<style lang="scss" scoped>
.container {
  width: 287px;
  font-size: 12px;
}
.bdr4 {
  border-radius: 4px;
}
.mini-container {
  width: 50px;
  font-size: 12px;
  background-color: $l-color-white;
}
.left-container {
  width: 46px;
  height: 100%;
  float: left;
  background: #f5f5f5;
}
.float-container {
  padding-top: 20px;
  // width: 204px;
  width: 240px;
  height: 100%;
  position: absolute;
  // left: -213px;
  left: -250px;
  top: 0;
  z-index: 2000;
  background: #fff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .icon-close {
    width: 16px;
    height: 16px;
    padding: 2px;
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    i {
      display: inline-block;
      font-size: 16px;
      color: #949da3;
      border-radius: 50%;
      background: #f6f6f6;
    }
  }
}
.dispaly-none {
  display: none;
}
.right-container {
  height: 100%;
  margin-left: 46px;
  width: calc(100% - 46px);
  background: white;
  &.has-title {
    height: calc(100% - 54px);
  }
}
.toolboxs-title {
  height: 54px;
  line-height: 64px;
  padding: 0 10px;
  font-size: $l-font-size-max;
  background-color: $l-color-white;
  overflow: hidden;

  /deep/ .titleleft::before {
    height: 20px;
    margin-top: 22px;
  }
}
.title {
  // text-align: center;
  // line-height: 25px;
  // font-size: 10px;
  // white-space: nowrap;
  // color: $l-color-fontcolor-4;
  padding: $l-padding-default-4;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  font-weight: 700;
  word-wrap: break-word;
  word-break: normal;
  color: $l-color-fontcolor-3;
}
.title-item {
  padding: 4px 0px;
  text-align: center;
  border-bottom: 1px solid #e4e4e4;
}
.title-item:hover {
  color: $l-color-primary;
}
.title-item-activite {
  color: $l-color-primary;
  .title-item-name {
    font-weight: 900;
  }
}
.title-item-icon {
  width: 24px;
  font-size: 20px;
  margin-bottom: 5px;
}
.title-item-name {
  text-align: center;
  padding: 0px 6px;
  margin-top: 1px;
}
.func-container {
  position: absolute;
  top: 56px;
  bottom: 36px;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
}
.toggle {
  height: 36px;
  bottom: 0px;
  position: absolute;
  text-align: center;
  line-height: 36px;
  box-sizing: border-box;
  border-right: 1px solid #e4e4e4;
  background: white;
}
.toggle:hover {
  color: $l-color-primary;
}
.flip {
  transform: rotate(180deg);
}
.no-left {
  .left-container {
    width: 0px;
    .title {
      display: none;
    }
    .func-container {
      display: none;
    }
  }
  &.mini-container {
    .left-container {
      width: 46px;
      .title {
        display: block;
        width: 46px;
      }
      .func-container {
        display: block;
      }
    }
    .toolboxs-content {
      height: 100%;
    }
  }
  .right-container {
    margin-left: 0;
  }
  .toggle {
    width: 46px;
    z-index: 10;
  }
}
.no-toolbox {
  text-align: center;
  line-height: 30px;
}
</style>
