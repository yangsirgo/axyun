import {
  post,
  get,
  put,
  del,
  patch
} from '@/utils/request'

const url = '/common';
const urlA = '/outpatient';
const urlB = '/resident';
const urlD = "/admin";//url+



// 退药申请  start
// 取消退药
  export function drugRefundCancel(data) {
    return post('/ipnws/order/drugRefundCancel', data, true)
  }
  // 申请退药
  export function drugRefund(data) {
    return post('/ipnws/order/drugRefund', data, true)
  }




//退药申请 end

// 撤床  stat
// 撤床校验
  export function leaveCheck(data) {
    return post('/ipnws/bedinfo/leaveCheck', data, true)
  }
// 撤床确认按钮
   export function leave(data) {
     return post('/ipnws/bedinfo/leave', data, true)
   }
// 取消撤床 /finance-inp/inp/cancel-out-ward
   export function cancelOutWard(data) {
     return post('/finance-inp/inp/cancel-out-ward', data, true)
   }

// 医嘱模板  接口stat   /api/advice/advice/templateRef/{treatId}/{type}

  export function templateRef(data) {
    return post('/advice/advice/templateRef/' + data.treatId + "?pharmacyId=" + data.pharmacyId +'&type='+data.type, data.list, true)
  }
  // /advice/advice/saveTotemplate   保存模板接口
export function saveTotemplate(data) {
     return post('/advice/advice/saveTotemplate', data, true)
   }

// 医嘱模板  接口end;

// 撤床  end



 // 获取遗嘱执行记录
  export function execGetList(data) {
    return post('/ipnws/order/exec/getList', data, true)
  }
  // 查询排班科室
  export function queryDept(data) {
    return get("/appointment/doctorSchedule/getDept", data)
  }
 // 查询病区
  export function ward(data) {
    return get("/wadmin/ward-hos", data)
  }
  // 创建床位
  export function newWard(data) {
    return post('/ipnws/bedinfo/new', data, true)
  }
  // 保存  {bedId}
  export function updateWard(data) {
    return post(`/ipnws/bedinfo/update/${data.bedId}`, data, true)
  }
  // 批量修改医嘱状态
  export function execStatus(data) {
    return post("/ipnws/order/exec/execStatus", data, true)
  }
  // 获取医嘱执行-打印信息
  export function getTreatmentPrint(data) {
    return post("/ipnws/order/getTreatmentPrint", data, true)
  }
  // 草药的打印取药单
  export function getChineseDrugPrint(data) {
    return post("/ipnws/order/getChineseDrugPrint", data, true)
  }

  // 获取药品申领-打印信息
  export function getDrugPrint(data) {
    return post("/ipnws/order/getDrugPrint", data, true)
  }

  // 记录打印信息
  export function uploadPrintInfo(data) {
    return post("/ipnws/order/uploadPrintInfo", data, true)
  }
  //发药
  export function drugDispensing(data) {
    return post("/ipnws/order/drugDispensing", data, true)
  }
  //停止执行
  export function execStop(data) {
    return post("/ipnws/order/exec/stop", data, true)
  }
  // 拆分
  export function execFun(data) {
    return post('/ipnws/order/exec', data, false)
  }
/**
 * 获取病人本次就诊处方信息
 * @param data
 * @returns {*}
 */
export function getAllInpPatientInfo(data, flag) {
  return post('/finance-inp/inp/getAllInpPatientInfo', data, flag ? true : flag)
}
/**
 * 床位的接口
 * @param data
 * @returns {*}
 */
export function getList(data) {
  return post('/ipnws/bedinfo/getList', data, true)
}
/**
 * 删除床位
 * @param data
 * @returns {*}
 */
export function deleteStyle(data) {//patch
  return patch(`/ipnws/bedinfo/remove/${data.bedId}`, data, true)
}
// 变更窗口
export function updatePatient(data) {
  return post('/finance-inp/inp/updateInpInfoSelectiveForInHosPatient', data, true)
}
