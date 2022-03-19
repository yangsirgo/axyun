import {
  getOrder
} from "@/api/cis/order/order";



/**
 * 需要调API接口获取状态
 * @param visitCode
 * @param vue
 */
export async function getRecipeStatus(visitCode, vue) {
  //获取处方状态
  let data = {
    ...{
      pageNo: 1,
      pageSize: 100,
      visitCode: visitCode
    }
  };

  let status = {
    label: "处方未填写",
    status: "0"
  };
  let reps = await getOrder(data, false);
  if (reps.code === 1) {
    status = getStatus(reps.data, vue);
  }
  return status;
}

/**
 * 需要调API接口修改状态
 * @param visitCode
 * @param vue
 */
export function updateRecipeStatus(visitCode, vue) {
  //获取处方状态
  let data = {
    ...{
      pageNo: 1,
      pageSize: 100,
      visitCode: visitCode
    }
  };

  getOrder(data, false).then(res => {
    if (res.code === 1) {
      let {
        data
      } = res;
      let status = getStatus(data, vue);
      // 更新诊疗状态
      let topList = vue.$store.state.navBarMsg["$_topList"];
      topList.splice(topList.findIndex(v => v.label === '处方'), 1);
      topList.push(status);
    }
  });
}

/**
 * 不需要调API接口获取状态
 * @param data
 * @param vue
 */
export function getStatus(data, vue) {
  let recipeStatus = {};
  let flag = 0;
  if (data === null || data.length === 0) {
    recipeStatus = {
      label: "处方未填写",
      status: "0"
    }; //未填写
  } else {
    data.forEach((item) => {
      if (typeof item.chargeStatus !== "undefined" &&
        item.chargeStatus !== "0") {
        flag++;
      }
    });

    if (flag === 0) {
      recipeStatus = {
        label: "处方未收费",
        status: "1"
      }; // 未收费
    } else if (flag !== data.length) {
      recipeStatus = {
        label: "处方部分收费",
        status: "2"
      }; // 部分收费
    } else if (flag === data.length) {
      recipeStatus = {
        label: "处方已收费",
        status: "3"
      }; // 已收费
    }
  }


  return recipeStatus;

}

/**
 * 不需要调API接口修改状态
 * @param data
 * @param vue
 */
export function updateStatus(data, vue) {
  let recipeStatus = {};
  let flag = 0;
  if (data === null || data.length === 0) {
    recipeStatus = {
      label: "处方未填写",
      status: "0"
    }; //未填写
  } else {
    data.forEach((item) => {
      if (typeof item.chargeStatus !== "undefined" &&
        item.chargeStatus !== "0") {
        flag++;
      }
    });
    if (flag === 0) {
      recipeStatus = {
        label: "处方未收费",
        status: "1"
      }; // 未收费
    } else if (flag !== data.length) {
      recipeStatus = {
        label: "处方部分收费",
        status: "2"
      }; // 部分收费
    } else if (flag === data.length) {
      recipeStatus = {
        label: "处方已收费",
        status: "3"
      }; // 已收费
    }
  }

  // 更新诊疗状态
  let topList = vue.$store.state.navBarMsg["$_topList"];
  topList.splice(topList.findIndex(v => v.label === '处方'), 1);
  topList.push(recipeStatus);

}
