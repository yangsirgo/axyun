let slowDiseaseColumns = [{
    label: "操作",
    prop: "operate",
    width: 180
  }, {
    label: "患者名称",
    prop: "psnName",
    width: 50
  },
  {
    label: "人员编号",
    prop: "psnNo",
    width: 50
  },
  {
    label: "险种类型",
    prop: "insutype",
    code: "insutype",
    width: 50
  },
  {
    label: "特慢病代码",
    prop: "opspDiseCode",
    width: 50
  },
  {
    label: "特慢病名称",
    prop: "opspDiseName",
    width: 50
  },
  {
    label: "联系电话",
    prop: "tel",
    width: 50
  },
  /* {
    label: "联系地址",
    prop: "",
    width: 50
  },
  {
    label: "参保机构医保区划",
    prop: "",
    width: 50
  },
  {
    label: "诊断代码",
    prop: "",
    width: 50
  },
  {
    label: "诊断名称",
    prop: "",
    width: 50
  },
  {
    label: "疾病病情描述",
    prop: "",
    width: 50
  },
  {
    label: "转往定点医药机构编号",
    prop: "",
    width: 50
  },
  {
    label: "转往医院名称",
    prop: "",
    width: 50
  },
  {
    label: "就医地行政区划",
    prop: "",
    width: 50
  },
  {
    label: "医院同意转院标志",
    prop: "",
    width: 50
  },
  {
    label: "转院类型",
    prop: "",
    width: 50
  },
  {
    label: "转院日期",
    prop: "",
    width: 50
  },
  {
    label: "转院原因",
    prop: "",
    width: 50
  },
  {
    label: "转院意见",
    prop: "",
    width: 50
  },
  {
    label: "开始日期",
    prop: "",
    width: 50
  },
  {
    label: "结束日期",
    prop: "",
    width: 50
  },
  {
    label: "转诊使用标志",
    prop: "",
    width: 50
  } */
];
let formList = [{

  type: "input",
  label: "患者名称",
  prop: "psnName",
  required: true,
  disabled: true
}, {

  type: "input",
  label: "人员编号",
  prop: "psnNo",
  required: true,
  disabled: true
}, {

  type: "input",
  label: "联系电话",
  prop: "tel",
  required: true,
  disabled: false
}, {

  type: "input",
  label: "联系地址",
  prop: "addr",
  required: true,
  disabled: false
}, {

  type: "select",
  label: "险种类型",
  prop: "insutype",
  required: true,
  disabled: false
}, {

  type: "select",
  label: "门慢门特病种",
  prop: "opspDiseCode",
  required: true,
  disabled: false
}, {

  type: "select",
  label: "参保机构医保区划",
  prop: "insuOptins",
  required: true,
  disabled: true
}, {
  type: "select",
  label: "定点医药机构类型",
  prop: "fixmedinsType",
  required: true,
  disabled: false
},{

  type: "select",
  label: "鉴定定点医药机构",
  prop: "ideFixmedinsNo",
  name: "ideFixmedinsName",
  required: true,
  disabled: false
}, {

  type: "select",
  label: "诊断医师",
  prop: "diagDrCodg",
  required: true,
  disabled: false
}, {

  type: "date",
  label: "医院鉴定日期",
  prop: "hospIdeDatetime",
  required: true,
  disabled: false
}, {

  type: "date",
  label: "开始日期",
  prop: "begndatetime",
  required: true,
  disabled: false
}, {

  type: "date",
  label: "结束日期",
  prop: "enddatetime",
  required: true,
  disabled: false
}, {

  type: "input",
  label: "备注",
  prop: "memo",
  required: false,
  disabled: false
}, {

  type: "date",
  label: "登记日期",
  prop: "recordTime",
  required: false,
  disabled: true
}/* , {

  type: "input",
  label: "登记备案运营商",
  prop: "recordOperatorCode",
  required: false,
  disabled: false
} */];
let rules = {
  psnNo: [{
    required: true,
    message: '请刷卡',
    trigger: 'blur'
  }],
  insutype: [{
    required: true,
    message: '请选择险种类型',
    trigger: 'change'
  }],
  tel: [{
    required: true,
    message: '请输入电话',
    trigger: 'blur'
  }],
  addr: [{
    required: true,
    message: '请输入地址',
    trigger: 'blur'
  }],
  opspDiseCode: [{
    required: true,
    message: '请选择门慢门特病种',
    trigger: 'change'
  }],
  insuOptins: [{
    required: true,
    message: '请选择参保机构医保区别',
    trigger: 'change'
  }],
  hospIdeDatetime: [{
    required: true,
    message: '请选择医院鉴定日期',
    trigger: 'change'
  }],
  begndatetime: [{
    required: true,
    message: '请选择开始日期',
    trigger: 'change'
  }],
  ideFixmedinsNo: [{
    required: true,
    message: '请选择鉴定定点医药机构',
    trigger: 'change'
  }],
  diagDrCodg: [{
    required: true,
    message: '请选择诊断医师',
    trigger: 'change'
  }]
};
export {
  slowDiseaseColumns,
  formList,
  rules
}
