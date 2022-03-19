import { getTableDatas } from "@/api/emrRecord/directive/directiveRequest";

// 筛选入参
let httpRequestObj = {};
// 缓存请求参数集合
let paramsList = [];
// 元素缓存集合
let eleList = [];

export default (Vue) => {
  Vue.directive("tableTransformEmr", {
    bind(el, binding, vnode) { },
    inserted: function (el, binding, vnode) {
      getTransFormCode(el, vnode);
    },
    componentUpdated: function () { },
    unbind: function () { },
    update(el, binding, vnode, oldVnode) {
      // 对比两次虚拟dom中挂载的入参有没有变化
      let codeNew = vnode.data.attrs.columns;
      let tableNameNew = vnode.data.attrs.tableName;
      let valNew = JSON.stringify(vnode.data.attrs.conditionMap);

      let codeOld = oldVnode.data.attrs.columns;
      let valOld = JSON.stringify(oldVnode.data.attrs.conditionMap);
      let tableNameOld = oldVnode.data.attrs.tableName;

      if (
        codeNew === codeOld &&
        valNew === valOld &&
        tableNameNew === tableNameOld
      ) {
        return;
      }
      getTransFormCode(el, vnode);
    },
  });
};

function getTransFormCode(el, vnode) {
  let columns = el.getAttribute("columns").split(",") || "";
  let conditionMap = vnode.data.attrs.conditionMap || {};
  let tableName = el.getAttribute("tableName") || "";

  let data = {
    key: `${tableName}_${columns[0]}_${JSON.stringify(conditionMap)}`,
    tableName,
    columns,
    conditionMap,
    "deleted_status": "0"
  };

  el.specialId = data.key;

  eleList.push(el);

  uniqueList(data, (resData) => {
    for (let i in resData) {
      eleList.forEach((item) => {
        if (item.specialId === i) {
          if (resData[i].length > 0) {
            let key = Object.keys(resData[i][0] || {}) || "";
            let obj = resData[i][0];
            item.innerText = obj[key] || "";
            item.title = obj[key] || "";
          } else {
            item.innerText = "--";
            item.title = "";
          }
        }
      });
    }
  });
}

function uniqueList(propsObj, cb) {
  let key = propsObj.key;

  if (!httpRequestObj[key]) {
    httpRequestObj[key] = key;
    paramsList.push(propsObj);
  }
  let cbFn = debounce((paramsList, cb) => {
    getTableDatas(paramsList)
      .then((resData) => {
        if (resData.code === 1 && resData.data instanceof Object) {
          let respond = resData.data;
          cb(respond);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, 400);

  cbFn(paramsList, cb);
}

let timer = null;

// 防抖函数实现
function debounce(fn, wait = 50) {
  // 通过闭包缓存一个定时器 id
  // 将 debounce 处理结果当作函数返回
  // 触发事件回调时执行这个返回函数
  return function (...args) {
    // 如果已经设定过定时器就清空上一次的定时器
    if (timer) {
      // 清空数据
      clearTimeout(timer);
    }

    // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
