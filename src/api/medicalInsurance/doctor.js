import {
  get,
  post,
  put,
  del,
  patch
} from '@/utils/request';
// 从本地获取医保字典数据方法
export function getDataFromLocal(obj) {
  return new Promise((resolve, reject) => {
    let dictInfo = JSON.parse(localStorage.getItem("dictInfo"));
    let arr = [];
    dictInfo.map(item => {
      if (item.dictCatalogCode == obj.siDictCatalogCode) {
        arr = item.dictVOS;
        return;
      }
    });
    if (arr.length) {
      resolve({
        code: 1,
        data: arr
      });
    } else {
      resolve(get(`/finance-si/dict/getDictListBySiDictCatalogId?medicareType=01&siDictCatalogCode=${obj.siDictCatalogCode}`))
    }
  });
}

// 获取医保类别
export function getPagemd() {
  return get('/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000')
}
// 根据条件查询医保医师信息接口
export function getPageDoctorRegList(params) {
  return get('/finance-si/doctorReg/getPageDoctorRegList', params)
}
// 新增医保医师信息接口
export function addDoctorReg(params) {
  return post('/finance-si/doctorReg/addDoctorReg', params)
}
// 更新医保医师信息接口-本地
export function updateDoctorReg(params) {
  return post('/finance-si/doctorReg/updateDoctorReg', params)
}
// 更新医保医师信息接口-医保
export function updateDoctorRegSi(params) {
  return post('/finance-si/doctorReg/updateDoctorRegSi', params)
}
// 变更医保医师信息接口-医保
export function changeDoctorRegSi(params) {
  return post('/finance-si/doctorReg/statusChangeDoctorReg', params)
}
// 变更医保医师信息接口-医保
export function statusChangeDoctorReg(params) {
  return post('/finance-si/doctorReg/statusChangeDoctorReg', params)
}
// 上传医保医师信息接口
export function uploadDoctorRegList(params) {
  return post('/finance-si/doctorReg/uploadDoctorRegList', params)
}
//获取院内医师信息
export function getDoctors(parms) {
  return post('/finance-pub/sys-info/user-info', parms);
}

//获取证件类型
export function getIdentificationType() {
  return getDataFromLocal({siDictCatalogCode: "AAC058"});
}
//获取民族
export function getNationCode() {
  return getDataFromLocal({siDictCatalogCode: "AAC005"});
}
//获取学历
export function getEducation() {
  return getDataFromLocal({siDictCatalogCode: "AAC011"});
}
//获取执业范围
export function getPracticeRange() {
  return getDataFromLocal({siDictCatalogCode: "AKC055"});
}
//获取医师级别
export function getPhysicianLevel() {
  return getDataFromLocal({siDictCatalogCode: "BCC950"});
}
//获取执业类别
export function getPracticeType() {
  return getDataFromLocal({siDictCatalogCode: "BCC955"});
}
//获取药师类别
export function getPharmacistType() {
  return getDataFromLocal({siDictCatalogCode: "BKC332"});
}
//获取药师执业类别
export function getPharmacistPracticeType() {
  return getDataFromLocal({siDictCatalogCode: "BKC333"});
}
//获取药师执业范围
export function getPharmacistPracticeRange() {
  return getDataFromLocal({siDictCatalogCode: "BKC334"});
}
//获科室代码
export function getDeptCode() {
  return getDataFromLocal({siDictCatalogCode: "AKF001"});
}
//获取专业技术职务级别编码
export function getJobLevel() {
  return getDataFromLocal({siDictCatalogCode: "AAF009"});
}
//获取门诊大病类别
export function getSeriousIllnessType() {
  return getDataFromLocal({siDictCatalogCode: "CKA303"});
}

//删除医师信息
export function deleteDoctor(params) {
  return patch('/finance-si/doctorReg/doctor-info/' + params.id)
}
