<template>
  <div
    :class="[
      'bdr4',
      'height100',
      open ? 'container' : 'mini-container',
      'overflow-hidden'
    ]"
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
            item.component == componentName ? 'title-item-activite' : ''
          ]"
          @click="updateComponentName(item.component,true)"
        >
          <div>
            <i :class="[item.icon, 'title-item-icon', 'iconfont']"></i>
          </div>
          <p class="title-item-name">{{ item.name }}</p>
        </div>
      </div>
      <div class="toggle width100 cursor-pointer" ref="openBtn" @click="handleOpen">
        <i class="el-icon-arrow-right" :class="open ? '' : 'flip'"></i>
      </div>
    </div>
    <!-- <l-card-title class="toolboxs-title" v-if="modules.length === 1">
      <template #left>
        <div v-text="'智能助手 - '+boxTopTitle"></div>
      </template>
    </l-card-title>-->
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
  </div>
</template>
<script>
import Vue from "vue";
import CONFIG from "./config";

export default {
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
    open: {
      type: Boolean,
      default: false
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
  computed: {
    isIpnw() {
      return this.$route.path.split("/")[1] === "ipnw";
    }
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
              /* 
              let obj;
              if (item.aliasName && this.isIpnw) {
                obj = { ...item, name: item.aliasName };
              } else {
                obj = item;
              } */
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
  mounted() {},
  methods: {
    handleOpen() {
      this.$emit("update:open", !this.open);
      this.$emit("show", this.open);
      this.$nextTick(() => {
        // 检验报告页面，触发echart的resize事件
        this.$root.eventHub.$emit("chartResize");
      });
    },
    async initBox() {
      this.componentLoaded = false;
      this.loading = true;
      for (let i = 0; i < this.func.length; i++) {
        const item = this.func[i];
        await this.registerComponent(item);
      }
      this.loading = false;
      this.componentLoaded = true;
      this.updateComponentName(this.boxName);
    },
    updateComponentName(name, flag) {
      if (this.func.length == 0 || !this.componentLoaded) {
        this.componentName = "";
        return;
      }
      let boxTopTitle = this.func[0].name || "";

      if (!this.boxName && !this.componentName && this.func.length) {
        name = this.func[0].component;
      }
      this.componentName = name;
      this.boxTopTitle = boxTopTitle;

      // 未开启情况下，手动开启
      /**
       * 点击智能助手列表，如果智能助手是关闭的则展开
       * 初始加载的时候不强制展开
       */
      if (flag && !this.open) {
        this.$refs.openBtn.click();
      }
    },
    async registerComponent(cmpCfg) {
      //修改懒加载通配导致的打包文件过大问题-xia
      const { regist, component } = cmpCfg || {};
      var key = component.replace(/\//g, "_");
      // 组件已经注册
      if (this.$root.$options.components[key]) {
        return;
      }
      try {
        let comp = await regist();
        Vue.component(key, comp.default);
      } catch (error) {
        this.$message.error("工具箱自定义组件加载失败");
      }
    }
    // async registerComponent(dir, path) {
    //   var key = path.replace(/\//g, "_");
    //   // 组件已经注册
    //   if (this.$root.$options.components[key]) {
    //     return;
    //   }
    //   try {
    //     let comp = await import(`@/${dir}${path}.vue`);
    //     Vue.component(key, comp.default);
    //   } catch (error) {
    //     this.$message.error("自定义值域组件加载失败");
    //   }
    // }
  }
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
.right-container {
  height: 100%;
  margin-left: 46px;
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
  text-align: center;
  line-height: 25px;
  font-size: 10px;
  white-space: nowrap;
  color: $l-color-fontcolor-4;
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
    font-weight: bold;
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
  top: 25px;
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
