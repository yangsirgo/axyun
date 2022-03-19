import {
  transformCodeList,
  multiTransformCodeList,
} from "@/api/emrRecord/directive/directiveRequest";

// 单级存储缓存对象
let codeTransformObj = {};
// 多级存储缓存对象
let mutiCodeTransformObj = {};

// 缓存请求
let httpRequestObj = {};
// 缓存请求参数
let paramsList = [];
let eleList = new Set();
export default (Vue) => {
  Vue.directive("codeTransformEmr", {
    bind(el, binding, vnode) { },
    inserted: function (el, binding, vnode) {
      getTransFormCode(codeTransformObj, el);
    },
    componentUpdated: function () { },
    unbind: function () { },
    update(el, binding, vnode, oldVnode) {
      // 对比两次虚拟dom中挂载的入参有没有变化
      let codeNew = vnode.data.attrs.code;
      let valNew = vnode.data.attrs.val;
      let codeOld = oldVnode.data.attrs.code;
      let valOld = oldVnode.data.attrs.val;

      if (codeNew === codeOld && valNew === valOld) {
        return;
      }
      getTransFormCode(codeTransformObj, el);
    },
  });
};

// eslint-disable-next-line complexity
function getTransFormCode(codeTransformObj, el) {
  let code = el.getAttribute("code") || "";
  let val = el.getAttribute("val");
  let field = el.getAttribute("field") || "name";
  let breakword = el.getAttribute("break") || "-";
  let muti = el.getAttribute("muti") || "";
  el.innerHTML = "";
  el.title = "";
  if (val === null) {
    return;
  }

  let valList = val.split(",");

  if (val === "" || code === "") {
    el.innerText = "--";
    el.innerHTML = "--";
    el.title = "";
    if (eleList.has(el)) {
      eleList.delete(el)
    }
    return;
  }

  if (valList.length === 1 && !muti) {
    let data = {
      key: `${code}-${val}`,
      field,
      code,
      val,
    };

    el.specialId = data.key;

    eleList.add(el);

    if (codeTransformObj[`${code}-${val}`]) {
      el.innerText = codeTransformObj[`${code}-${val}`];
      el.title = codeTransformObj[`${code}-${val}`];
      return;
    }

    uniqueList(data, (resData) => {
      for (let i in resData) {
        eleList.forEach((item) => {
          if (item.specialId === i) {
            item.innerText = resData[i] || "";
            item.title = resData[i] || "";
          }
        });
      }
      // httpRequestObj = {};
      // paramsList = [];
      // 清空元素集合
      // eleList = [];
    });
  } else {
    // 多级
    let data = valList.map((item) => {
      return {
        key: item,
        field,
        code,
        val: item,
      };
    });
    let str = "";
    let signList = [];
    // 从缓存中读取数据
    valList.forEach((it, index) => {
      let key = `${code}-${it}`;
      if (mutiCodeTransformObj.hasOwnProperty(key)) {
        signList.push(true);
        let data = mutiCodeTransformObj[key];
        let outStr = typeof data !== "undefined" ? data : "--";
        str += `${outStr}${index === valList.length - 1 ? "" : breakword}`;
      }
    });

    // 如果缓存中有数据 则不请求
    if (signList.length) {
      el.innerText = str;
      signList.length = 0;
      return;
    }

    multiTransformCodeList(data)
      .then((resData) => {
        if (resData.code === 1) {
          valList.forEach((it) => {
            // 存储待缓存对象中
            mutiCodeTransformObj[`${code}-${it}`] = resData.data[it] || "--"; // 转码失败返回默认值
          });
          str = "";
          let data = resData.data;
          valList.forEach((item, index) => {
            let outStr = typeof data[item] !== "undefined" ? data[item] : "--";
            str += `${outStr}${index === valList.length - 1 ? "" : breakword}`;
          });
          el.innerText = str;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function uniqueList(propsList, cb) {
  let key = propsList.key;

  if (!httpRequestObj[key]) {
    httpRequestObj[key] = key;
    paramsList.push(propsList);
  }

  let cbFn = debounce((paramsList, cb) => {
    transformCodeList(paramsList)
      .then((resData) => {
        if (resData.code === 1 && resData.data instanceof Object) {
          let respond = resData.data;
          cb(respond);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, 100);

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
