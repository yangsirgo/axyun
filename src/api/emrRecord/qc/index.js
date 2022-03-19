import {
  post,
  get,
  patch
} from '@/utils/requestEmr'


// 获取患者一览列表数据
export function getChkMainList(data) {
  return get('/chk/mr-main-list', data, false);
}

export function getChkMainListPage(data) {
  return get('/chk/mr-main-page', data, false);
}


// 进入质控
export function getChkStart(data, loading = false) {
  return post('/chk/start', data, loading)
}

// 获取所有的标准组
export function getQcSycGroup(data, loading = false) {
  return get('/qcSysGroup/all', data, loading)

}
// 获取所有的标准组
export function getQcSycGroupByParams(data, loading = false) {
  return get('/qcSysGroup/params', data, loading)

}
// 获取评分项目列表
export function getScoreProjectList(data, loading = false) {
  return get('/qcSysItm/all', data, loading)
}


// 新建缺陷
export function postChkfitNew(data, loading = false) {
  return post('/chkFlt/new', data, loading)
}


// 获取缺陷列表数据
export function getFitList(data, loading = false) {
  return get('/chkFlt/flt-list-param', data, loading)
}

// 删除缺陷接口
export function delFaults(data, loading = false) {
  return patch('/chkFlt/del', data, loading)
}

// 获取整改人信息
export function getChkAndRfm(data, loading = false) {
  return get('/chkRectify/chk-and-rfm', data, loading)
}

// 发送整改通知单
export function postNotive(data, loading = false) {
  return post('/chkRectify/new', data, loading)
}

// 质控未发现缺陷
export function doneQcWorkNoFit(data, loading = false) {
  return post('/chk/no-flt', data, loading)
}

// 完成本次质控工作
export function doneQcWork(data, loading = false) {
  return post('/chk/comp', data, loading)
}


// 整改通知单列表
export function getRectifyList(data, loading = false) {
  return get('/chkRectify/rectify-list', data, loading)
}


// 整改通知单 开始整改
export function getChkRectifyStart(id, loading = false) {
  return post(`/chkRectify/start/${id}`, {}, loading)
}


// 查询整改通知单对应的缺陷列表接口
export function getFltList(Id, type, loading = false) {
  return get(`/chkFlt/flt-list-by-rfm/${Id}/${type}`, {}, loading)
}


// 检查通知单中是否有已整改的（相同质控级别，不同通知单中）重复缺陷：
export function checkRepeat(id, loading = false) {
  return get(`/chkRectify/check-repeat/${id}`, {}, loading)
}


// 缺陷已整改接口
export function putCompRfm(data, loading = false) {
  return post(`/chkFlt/comp-rfm`, data, loading)
}

// 完成本次整改
export function chkRectifyComp(id, loading = false) {
  return post(`/chkRectify/comp/${id}`, {}, loading)
}

// 缺陷审核通过接口
export function chkFltPass(data, loading = false) {
  return post(`/chkFlt/pass`, data, loading)
}

// 缺陷审核扣分接口
export function chkFltDeductPoint(data, loading = false) {
  return post(`/chkFlt/deduct-point`, data, loading)
}

// 再整改接口
export function chkFltReturnVrf(data, loading = false) {
  return post(`/chkFlt/return-vrf`, data, loading)
}

// 完成通知单审核接口
export function chkRectifyCompVrf(id, qcChkId, loading = false) {
  return post(`/chkRectify/comp-vrf/${id}/${qcChkId}`, {}, loading)
}

// 获取查询质控工作列表第一级
export function getChkList(data, loading = false) {
  return get(`/chk/chk-list`, data, loading)
}

// 获取查询质控工作列表第二级
export function getChkRectifyListByChk(id, loading = false) {
  return get(`/chkRectify/list-by-chk/${id}`, {}, loading)
}

// 获取查询质控工作列表
export function getChkRectifyListAll(data, loading = false) {
  return get(`/chk/chk-page-all`, data, loading)
}

// 获取点击缺陷列表进入时显示的缺陷列表信息
export function getChkFltRectifyListByChk(id, loading = false) {
  return get(`/chkFltRectify/flt-list-by-rectify/${id}`, {}, loading)
}

// 完成病案质控
export function getCompMain(data, loading = false) {
  return post(`/chk/comp-for-main`, data, loading)
}

// 撤回完成质控
export function recallCompForMain(data, loading = false) {
  return post(`/chk/recall-comp-for-main`, data, loading)
}

// 科室质控接收/终末质控签收接口
export function putReceive(data, loading = false) {
  return post(`/chk/receive`, data, loading)
}

// 终末归档接口
export function terminalArchive(data, loading = false) {
  return post(`/chk/terminal-archive`, data, loading)
}

// 撤销归档接口
export function recallArchive(data, loading = false) {
  return post(`/chk/recall-archive`, data, loading)
}

// 终末质控打回接口
export function terminalReject(data, loading = false) {
  return post(`/chk/terminal-reject`, data, loading)
}


// 检查质控依赖
export function checkQcDepend(data, loading = false) {
  return get('/qcSysItm/checkQcDepend', data, loading)
}


// 质控医师查询
export function checkQcEmpList(id, loading = false) {
  return get(`/chk/chk-emp-list/${id}`, {}, loading)
}

// 查询匹配的标准组
export function fingGroupByDocType(data, loading = false) {
  return get(`/qcSysItm/fingGroupByDocType`, data, loading)
}

// 检查质控项目对应的文书类型和打开的文书是否一致接口
export function chkDocType(data, loading = false) {
  return get(`/chkFlt/chk-doc-type`, data, loading)
}

// 获取系统参数
// paramKey = isAutoItemForManual  入参
export function getSysParams(data, loading = false) {
  return get(`/param/params`, data, loading)
}

///qcTask/page 待书写文书列表
export function getWaitWriteDocList(data, loading = false) {
  return get(`/qcTask/page`, data, loading)
}
///查询指定文书类型是否已经创建
export function getMrExist(data, loading = false) {
  return get(`/mr/getMrExist`, data, loading)
}
///弹窗回显信息
export function getTaskMr(data, loading = false) {
  return get(`/qcTask/getTaskMr`, data, loading)
}
///点击完成
export function relationMr(data, loading = false) {
  return post(`/qcTask/relationMr`, data, loading)
}

// 更新单条缺陷接口
export function updateChkFit(data, loading = false) {
  return post('/chkFlt/upd-new', data, loading)
}
