import Vue from "vue";
import ElementUI from "element-ui";
import echarts from "echarts";
import splitPane from 'vue-splitpane';

Vue.component('split-pane', splitPane);
import axcommon from "axcommon";
import { initComponent } from "@/components/index";
import { referenceindex } from "@/views/phss/Table/referenceindex";
import { initAuth } from "@/utils/auth";
import { getQueryString } from "@/utils/util";
import { initIframeMessage } from "@/utils/message";
import { initRequest } from "@/utils/request";

referenceindex();
initComponent();
initRequest(axcommon.utils.request);
initAuth(axcommon.utils.auth);

// 快捷表格相关
import 'xe-utils';
import VXETable from 'vxe-table';
import './styles/vxetable/index.scss';

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import FilterComplex from "@/views/demo/testFormTable/components/FilterComplex.vue"

// 引入全局过滤器
import { handlerName } from "@/filters/index.js"

Vue.use(VXETable);
Vue.component(FilterComplex.name, FilterComplex)

VXETable.use(VXETablePluginElement)

// 注册全局过滤器
Vue.filter('handlerName', handlerName)



// 这两个指令是给电子病历相关页面使用
import codeTransformEmr from "@/directive/codeTransformEmr";
import tableTransformEmr from "@/directive/tableTransformEmr";

import "@/utils/prototypeFunc.js";
// 2020-7-1 new start
import "@/styles/PublicHealth.scss";
// new end
import "swiper/dist/css/swiper.css";
import "@/styles/penetrate.scss";
import "@/styles/common.scss";

//门急诊 电子处方 中草药 搜索药品下拉 被el-tabs 遮住 START
import "@/styles/fixedPopover.scss";

import App from "./App";
import i18n from "./lang";
import confirmFunc from "./utils/confirmFunc";
import onlyNumber from "@/directive/onlyNumber";
import wcommonVue from "wcommon-vue"


// 区域打印
import Print from "vue-print-nb";

// 手写签名
import SignCanvas from "sign-canvas";

import { axueditor } from "axueditor";

Vue.use(SignCanvas);
Vue.use(Print);
Vue.use(onlyNumber); // 输入框上只允许输入范围数字

Vue.use(codeTransformEmr);
Vue.use(tableTransformEmr);

Vue.use(ElementUI, {
  size: "medium",
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(axcommon, {});
Vue.use(axueditor);

// 自定义MessageBox
Vue.prototype.$confirmFunc = confirmFunc;
Vue.prototype.$echarts = echarts;
Vue.prototype.$common = wcommonVue.utils;

import resetMessage from "@/utils/resetMessage"
Vue.prototype.$messageNew = resetMessage;

// select-loadMore加载更多
import directives from '@/utils/directives'
Vue.use(directives)

let router;
let store = axcommon.store();
let params = getQueryString("params", window.location.href);
if (params) {
  try {
    let data = JSON.parse(decodeURIComponent(params));
    if (data.token) {
      router = axcommon.router(true);
    }
  } catch (error) {
    console.log("初始化失败", error);
  }
}
if (!router) {
  router = axcommon.router();
}



// 监听主框架通知路由跳转
window.addEventListener(
  "message",
  e => {
    if (e.data.type === "router-go") {
      router.push(e.data.path);
    }
  },
  false
);

async function main() {
  window.root = new Vue({
    el: "#app",
    router: router,
    store: store,
    i18n,
    render: h => h(App),
    data: {
      eventHub: new Vue()
    }
  });
}
main();
initIframeMessage();
