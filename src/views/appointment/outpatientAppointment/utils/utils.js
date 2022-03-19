import { transformCode, getTableData } from "@/api/directive/directiveRequest";
let codeTransformObj = {};
export async function transformCodeFunc(field, code, val) {
  let params = [{
    field,
    code,
    val
  }];
  if (codeTransformObj[`${code}+${val}`]) {
    return codeTransformObj[`${code}+${val}`];
  } else {
    try {
      let resData = await transformCode(params);
      if (resData.code === 1) {
        codeTransformObj[`${code}${val}`] = resData.data[code];
        return Promise.resolve(resData.data[code]);
      } else {
        return "--";
      }
    } catch (err) {
      return "--";
    }
  }
}

//表数据反显 （科室用）
export async function transformTableFunc(columns, conditionMap, tableName) {
  try {
    let data = {
      tableName: tableName || "",
      columns: columns || "",
      conditionMap: conditionMap || {}
    };
    let resData = await getTableData(data);
    if (resData.code === 1 && resData.data != []) {
      return Promise.resolve(resData.data[0][columns]);
    }
    return "";
  } catch (error) {
    return "";
  }
}
