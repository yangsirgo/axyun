// 判断元素是否在数组内
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

// 元素是否有class
export function hasClass(element, cls) {
  return element.classList.contains(cls);
}

// 元素是新增class
export function addClass(element, new_name) {
  if (!element || !new_name) {
    return false;
  }
  if (element.className) {
    var old_class_name = element.className;
    element.className = old_class_name + " " + new_name;
  } else {
    element.className = new_name;
  }
  return true;
}

// 元素是移出class
export function removeClass(obj, cls, removeChild) {
  if (hasClass(obj, cls)) {
    var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    obj.className = obj.className.replace(reg, " ");
  }
  if (removeChild) {
    for (let i = 0; i < obj.children.length; i++) {
      removeClass(obj.children[i], cls, false);
    }
  }
}

//获取元素
export function getEleByTagName(parent, tagName) {
  parent = parent || document;
  return parent.getElementsByTagName(tagName);
}

//获取元素
export function getEleByCls(parent, clsName) {
  parent = parent || document;
  return parent.getElementsByClassName(clsName);
}

// 设置当前窗口url中param的值
function set_param(param, value) {
  var query = location.search.substring(1);
  var p = new RegExp("(^|&" + param + ")=[^&]*");
  if (p.test(query)) {
    query = query.replace(p, "$1=" + value);
    location.search = "?" + query;
  } else {
    if (query == "") {
      location.search = "?" + param + "=" + value;
    } else {
      location.search = "?" + query + "&" + param + "=" + value;
    }
  }
}

// 获取菜单路由、配置中心自定义路由透传的参数
export function getRouterParams(paramString) {
  let params = {};
  if (paramString) {
    paramString = paramString.toString();
    let ps = paramString.split(";");
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (p.indexOf(":") === -1) {
        continue;
      }
      let kv = p.split(":");
      params[kv[0]] = kv[1];
    }
  }
  return params;
}

/**
 * 根据主键值（通常都是id）父子关系（通常是parentId）来将
 * list数据机构转换成，以children字段为关联的树状结构
 * 场景：菜单树
 * @export
 * @param {*} datas
 * @param {string} [mainKey="id"]
 * @param {string} [parentKey="parentId"]
 * @returns
 */
export function listToTree(datas, mainKey = "id", parentKey = "parentId") {
  let ret = [];
  let map = {};
  datas.forEach(item => {
    map[item[mainKey]] = item;
    if (!item[parentKey]) {
      ret.push(item);
    }
  });
  datas.forEach(item => {
    let key = item[parentKey];
    if (map[key]) {
      map[key].children = map[key].children || [];
      map[key].children.push(item);
    }
  });
  return {
    list: ret,
    map: map
  };
}

/**
 * 和上面的区别在于，下面方法可再上面的基础上，再通过根节点的
 * concatKey 字段 再次整合
 * 场景：单级、多级值域解析
 *
 * @export
 * @param {*} datas 元数据，单级list
 * @param {string} [mainKey='id'] 主键
 * @param {string} [concatKey='parentId'] 关联键值
 * @returns [{id: , children: {}}]
 */
export function listToObjTree(
  datas,
  mainKey = "id",
  concatKey = "itemId",
  parentKey = "parentId"
) {
  let ret = {};
  let map = {};
  datas.forEach(item => {
    map[item[mainKey]] = item;
    if (!item[parentKey]) {
      ret[item[concatKey]] = ret[item[concatKey]] || [];
      ret[item[concatKey]].push(item);
    }
  });
  datas.forEach(item => {
    let key = item[parentKey];
    if (map[key]) {
      map[key].children = map[key].children || [];
      map[key].children.push(item);
    }
  });
  return ret;
}

/*
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * */
export function toMoney(number, decimals) {
  var dec = ".";
  var sep = ",";
  number = (number + "").replace(/[^0-9+-Ee.]/g, "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

export function moneyToNumber(e) {
  return parseFloat(e.replace(/[^\d\.-]/g, ""));
}

/**
 * 提取分页请求中的分页参数，合并到一个对象
 * 为了便于前端的分页参数更新
 * @export
 * @param {*} response
 * @returns
 */
export function extractPageParams(response) {
  if (
    response &&
    typeof response.pageNo == "number" &&
    !isNaN(response.pageNo)
  ) {
    return {
      pageNo: response.pageNo,
      pageSize: response.pageSize,
      total: response.total
    };
  }
  return null;
}

/*
 * 本地key value转换
 *
 * @param code code值
 * @param list list数据集
 * @returns  name值
 */
export function localCodeTransform(code, list) {
  for (let item in list) {
    if (list[item].code == code) {
      return list[item].name;
    }
  }

  return code;
}

/*
 * 获取 data-id 的dom 元素
 *
 * @param code code值
 * @param list list数据集
 * @returns  name值
 */
export function getDataIdDom(tagName, name, value) {
  var selectDom = [];
  var dom = document.getElementsByTagName(tagName);
  for (var i = 0; i < dom.length; i++) {
    if (value === dom[i].getAttribute(name)) {
      selectDom.push(dom[i]);
    }
  }
  return selectDom;
}

export function getQueryString(name, strURL) {
  strURL = strURL || window.location.search;
  let val = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i").test(
      strURL
    ) ?
    decodeURIComponent(RegExp.$2.replace(/\+/g, " ")) :
    "";
  return val ? val.split("#")[0] : val;
}

export function getQueryStringFromHash(name, search) {
  search = search || window.location.search.substr(1) || window.location.hash.split("?")[1] || "";
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = search.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}


// 进入全屏
export function requestFullScreen(element) {
  var requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

// 退出全屏
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

//根据传入的表格ref返回表格内容的二维数组,入参为表格的ref实例,例如 this.$refs.tableName
export function refToArr(tableRef) {
  console.log(tableRef.bodyWrapper.children[0].children[1].children);
  let arr = [];
  for (
    let i = 0; i < tableRef.bodyWrapper.children[0].children[1].children.length; i++
  ) {
    arr.push([]);
    for (
      let j = 0; j <
      tableRef.bodyWrapper.children[0].children[1].children[i].children.length; j++
    ) {
      arr[i].push(
        tableRef.bodyWrapper.children[0].children[1].children[i].children[j]
        .innerText
      );
    }
  }
  return arr;
}
