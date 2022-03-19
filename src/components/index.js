import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

export function initComponent() {
  // 挂载全局基础组件
  const requireComponent = require.context(
    // 其组件目录的相对路径
    "./",
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /[A-Z]\w+\.(vue|js)$/
  );

  requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName);

    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
      camelCase(
        // 获取和目录深度无关的文件名
        fileName
          .split("/")
          .pop()
          .replace(/\.\w+$/, "")
      )
    );

    // 全局注册组件
    Vue.component(componentName, componentConfig.default || componentConfig);
  });
}
