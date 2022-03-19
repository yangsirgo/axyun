// 人员基本信息项
let siPatientDtoList = [{
  label: "人员编号",
  prop: "patientCode",
  value: "",
}, {
  label: "人员证件类型",
  prop: "identificationType",
  value: "",
}, {
  label: "证件号码",
  prop: "identificationNum",
  value: "",
}, {
  label: "人员姓名",
  prop: "patientName",
  value: "",
}, {
  label: "性别",
  prop: "gender",
  value: "",
}, {
  label: "民族",
  prop: "nation",
  value: "",
}, {
  label: "出生日期",
  prop: "birthDate",
  value: "",
}, {
  label: "年龄",
  prop: "age",
  value: "",
}, {
  label: "费别",
  prop: "personPropertyType",
  value: "",
}, {
  label: "绑定社康",
  prop: "bindingSocialHealthName",
  value: "",
}];
// 人员身份信息项
let siPatientIdentifyDtosList = [{
  label: "人员身份类别",
  prop: "psnIdetType",
  width: 100,
  code: "psn_idet_type"
}, {
  label: "人员类别等级",
  prop: "psnTypeLv",
  width: 130,
  code: "disa_lv"
}, {
  label: "备注",
  prop: "memo",
  width: 100,
}, {
  label: "开始时间",
  prop: "begntime",
  width: 120,
}, {
  label: "结束时间",
  prop: "endtime",
  width: 120,
}];
// 人员参保信息项
let siPatientInsuranceInfoDtosList = [{
  label: "余额",
  prop: "balc",
  width: 70,
}, {
  label: "险种类型",
  prop: "insuranceType",
  width: 80,
  code: "insutype"
}, {
  label: "人员类别",
  prop: "personType",
  width: 80,
  code: "psn_type"
}, {
  label: "参保类型",
  prop: "insuranceType",
  width: 80,
  code: "insutype"
}, {
  label: "人员参保状态",
  prop: "chargeStatus",
  width: 100,
  code: "psn_insu_stas"
}, {
  label: "个人参保日期",
  prop: "beginDate",
  width: 120,
}, {
  label: "暂停参保日期",
  prop: "endDate",
  width: 120,
}, {
  label: "公务员标志",
  prop: "cvlservFlag",
  width: 90,
  code: "cvlserv_flag"
}, {
  label: "参保地医保区划",
  prop: "insuplcAdmdvs",
  width: 110,
  code: "yb_area"
}, {
  label: "单位名称",
  prop: "companyName",
  width: 120,
}];
// 定点医药机构
let siPatientHosDtosList = [
  {
    label: "定点医药机构名称",
    prop: "fixmedins_name",
    width: 170
  },
  {
    label: "开始日期",
    prop: "begndate",
    width: 100
  },
  {
    label: "结束日期",
    prop: "enddate",
    width: 100
  },
  {
    label: "险种类型",
    prop: "insutype",
    code: "insutype",
    width: 100
  },
  {
    label: "定点医药机构编码",
    prop: "fixmedins_code",
    width: 100
  },
  {
    label: "人员编号",
    prop: "psn_no",
    width: 100
  },
  {
    label: "定点排序号",
    prop: "fix_srt_no",
    width: 80
  },
  {
    label: "备注",
    prop: "memo",
    width: 100
  },
];
// 人员缴费信息
let siPatientChargeInfoDtosList = [{
  label: "缴费档次",
  prop: "clctstdCrtfRuleCodg",
  width: 80,
  code: "clctstd_crtf_rule_codg"
}, {
  label: "险种类型名称",
  prop: "insutype",
  width: 110,
  code: "insutype"
}, {
  label: "统筹区名称",
  prop: "poolareaNoName",
  width: 70,
}, {
  label: "缴费类型",
  prop: "clctType",
  width: 70,
  code: "clct_type"
}, {
  label: "到账类型",
  prop: "clctFlag",
  width: 70,
  code: "clct_flag"
  
}, {
  label: "费款所属期开始日期",
  prop: "accrymBegn",
  width: 130,
}, {
  label: "费款所属期结束日期",
  prop: "accrymEnd",
  width: 130,
}, {
  label: "到账时间",
  prop: "clctTime",
  width: 70,
}, {
  label: "统筹区代码",
  prop: "poolareaNo",
  width: 70,
}, {
  label: "险种类型代码",
  prop: "insutype",
  width: 90
}];
// 待遇查询入参项
let salaryCheckInfoForm = [{
  label: "人员编号",
  prop: "psn_no",
  span: 8,
  type: "input",
  disabled: true,
  required: true
}, {
  label: "险种类型",
  prop: "insutype",
  span: 8,
  type: "select",
  required: true
}, {
  label: "医疗类别",
  prop: "med_type",
  span: 8,
  type: "select",
  disabled: false,
  required: true
}, {
  label: "定点医药机构类型",
  prop: "fixmedinsType",
  span: 8,
  type: "select",
  required: true
}, {
  label: "定点医药机构",
  prop: "fixmedins_code",
  span: 16,
  type: "select",
  required: true
}, {
  label: "开始时间",
  prop: "begntime",
  span: 8,
  type: "datetime",
  required: true
}, {
  label: "结束时间",
  prop: "endtime",
  span: 8,
  type: "datetime",
  required: true
}, {
  label: "手术操作",
  prop: "oprn_oprt_code",
  name: "oprn_oprt_name",
  span: 8,
  type: "select",
  required: false
}, {
  label: "病种类型",
  prop: "dise_type",
  span: 8,
  type: "select",
  required: false
}, {
  label: "病种编码",
  prop: "dise_codg",
  name: "dise_name",
  span: 8,
  type: "select",
  required: false
}, {
  label: "生育类别",
  prop: "matn_type",
  span: 8,
  type: "select",
  required: false
}, {
  label: "计划生育手术类别",
  prop: "birctrl_type",
  span: 16,
  type: "select",
  required: false
}];
// 待遇查询表格
let salaryCheckInfoColumns = [{
  label: "人员编号",
  prop: "psn_no",
  width: 120,
}, {
  label: "待遇检查类型",
  prop: "trt_chk_type",
  code: "trt_chk_type",
  width: 150,
}, {
  label: "基金支付类型",
  prop: "fund_pay_type",
  code: "fund_pay_type",
  width: 150,
}, {
  label: "基金款项待遇享受标志",
  prop: "trt_enjymnt_flag",
  code: "trt_enjymnt_flag",
  width: 180,
}, {
  label: "开始日期",
  prop: "begndate",
  width: 180,
}, {
  label: "结束日期",
  prop: "enddate",
  width: 180,
}, {
  label: "待遇检查结果",
  prop: "trt_chk_rslt",
  width: 150,
}];
export {
  siPatientDtoList,
  siPatientIdentifyDtosList,
  siPatientInsuranceInfoDtosList,
  siPatientHosDtosList,
  siPatientChargeInfoDtosList,
  salaryCheckInfoForm,
  salaryCheckInfoColumns
}
