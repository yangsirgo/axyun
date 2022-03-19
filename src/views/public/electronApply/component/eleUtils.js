import {
  checkLimit
} from "@/api/electronApply/chargeTemplate";
import { doctorPsReviewLimit } from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/presModule/modules/adviceUtils.js";

import vueObj from "vue";
let newVueObj = new vueObj();

export async function beforeLeaveConfirm() {
  return new Promise((resolve, reject) => {
    newVueObj.$confirm('当前页面有未提交项目，不提交将清除，是否提交？', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      distinguishCancelAndClose: true,
      type: 'warning'
    }).then(async () => {
      resolve({
        action: "confirm"
      });
    }).catch(action => {
      // console.log(action);
      if (action === "cancel") {
        resolve({
          action: "action"
        });
      } else {
        // 停留在当前页面
        reject(false);
      }

    })
  })
}


// 医保审核 接口 
function checkLimitFunc(itemData) {
  let {
    itemId
  } = itemData;

  // console.log(itemId, itemData);
  return new Promise(async (resolve, reject) => {
    try {
      let {
        code,
        data,
        msg
      } = await checkLimit(itemId);
      if (code == 1) {
        //赋值给表格选中行
        let row = {
          ...itemData,
          ...{
            limitMsgData: data,
            alertCode: data.length > 0 ? 1 : 0
          }
        };
        // console.log(row, row);
        resolve({
          ...row
        });
      } else {
        newVueObj.$message.error(msg || "医保审批接口报错");
        reject(false);
      }
    } catch (error) {
      newVueObj.$message.error(msg || "医保审批接口报错");
      reject(false);
    }
  });
}


// 医保审核 弹窗 
export function medicalInsuranceAudit(data) {
  return new Promise(async (resolve, reject) => {
    try {
      let itemData = await checkLimitFunc(data);
      // 医生审核弹窗
      let {
        limitMsgData,
        alertCode,
        catalogName
      } = itemData;
      // console.log(catalogName, catalogName);
      if (alertCode == 1) {
        // 弹窗
        try {
          let {
            confirmCode
          } = await doctorPsReviewLimit(limitMsgData, catalogName);
          if (confirmCode == 1) {
            //审批通过
            console.log("是 审批通过");
          } else if (confirmCode == 0) {
            // 否（自费使用）
            console.log("否 自费使用");
          }
          newVueObj.$set(itemData, "limitResultCode", confirmCode);
          console.log(itemData);
          resolve(itemData);
        } catch (error) {
          console.log("清空当前行");
          reject(false);
        }
      } else {
        //重置 limitResultCode
        newVueObj.$set(itemData, "limitResultCode", null);
        console.log(itemData);
        resolve(itemData);
      }
    } catch (error) {
      reject(false);
    }
  })
}
