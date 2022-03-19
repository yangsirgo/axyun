let formList = [{
    span: 6,
    type: "select",
    label: "医疗类别",
    prop: "medicalTypeCode",
    required: true,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "险种类型",
    prop: "insuranceTypeCode",
    required: true,
    disabled: false,
  },
  {
    span: 6,
    type: "input",
    label: "联系人姓名",
    prop: "conerName",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "input",
    label: "电话",
    prop: "conerTel",
    required: false,
    disabled: false,
  },
  {
    span: 24,
    type: "textArea",
    label: "入院诊断描述",
    prop: "admDiagDscr",
    required: true,
    disabled: false,
    minlength: 200,
    minRows: 1
  },
  {
    span: 24,
    type: "textArea",
    label: "主要病情",
    prop: "mainPatientConditionDescription",
    required: false,
    disabled: false,
    maxlength: 1000,
    minRows: 1
  },
  {
    span: 6,
    type: "select",
    label: "结算病种",
    prop: "singleDiseaseCode",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "日间手术病种",
    prop: "daysrgDiseListCode",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "手术操作",
    prop: "oprnOprtCode",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "并发症标志",
    prop: "copFlag",
    required: false,
    disabled: false,
  },
  /* {
    span: 6,
    type: "select",
    label: "主诊断中西医标志",
    prop: "mainDiagTwFlag",
    required: true,
    disabled: false,
  }, */
  {
    span: 6,
    type: "select",
    label: "主诊断",
    prop: "mainDiagCode",
    name: "mainDiagName",
    list: "mainDiagList",
    required: true,
    disabled: false,
  },
  /* {
    span: 6,
    type: "select",
    label: "第一副诊断中西医标志",
    prop: "firstDiagTwFlag",
    required: false,
    disabled: false,
  }, */
  {
    span: 6,
    type: "select",
    label: "第一副诊断",
    prop: "firstDiagCode",
    name: "firstDiagName",
    list: "firstDiagList",
    required: false,
    disabled: false,
  },
  /* {
    span: 6,
    type: "select",
    label: "第二副诊断中西医标志",
    prop: "secondDiagTwFlag",
    required: false,
    disabled: false,
  }, */
  {
    span: 6,
    type: "select",
    label: "第二副诊断",
    prop: "secondDiagCode",
    name: "secondDiagName",
    list: "secondDiagList",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "离院方式",
    prop: "dischargeStatusCode",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "出院主诊断",
    prop: "dischargeDiagCode",
    name: "dischargeDiagName",
    list: "dischargeDiagList",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "第一出院副诊断",
    prop: "dischargeDiag1Code",
    name: "dischargeDiag1Name",
    list: "discharge1DiagList",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "第二出院副诊断",
    prop: "dischargeDiag2Code",
    name: "dischargeDiag2Name",
    list: "discharge2DiagList",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "date",
    label: "死亡日期",
    prop: "dieDate",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "input",
    label: "计生证号",
    prop: "",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "生育类别",
    prop: "matnTypeCode",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "计生手术类别",
    prop: "birctrlType",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "select",
    label: "晚育标志",
    prop: "latechbFlag",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "inputNumber",
    label: "孕周数",
    prop: "gesoVal",
    required: false,
    disabled: false,
    min: 0,
    max: 99
  },
  {
    span: 6,
    type: "inputNumber",
    label: "胎次",
    prop: "fetts",
    required: false,
    disabled: false,
    min: 0,
    max: 999
  },
  {
    span: 6,
    type: "inputNumber",
    label: "胎儿数",
    prop: "retusCount",
    required: false,
    disabled: false,
    min: 0,
    max: 999
  },
  {
    span: 6,
    type: "select",
    label: "早产标志",
    prop: "pretFlag",
    required: false,
    disabled: false,
  },
  {
    span: 6,
    type: "date",
    label: "计划生育手术日期",
    prop: "birctrlMatnDate",
    required: false,
    disabled: false,
  },
];
let rules = {
    medicalTypeCode: [{required: true,message: '请填写',trigger: 'change'}],
    insuranceTypeCode: [{required: true,message: '请填写',trigger: 'change'}],
    admDiagDscr: [{required: true,message: '请填写',trigger: 'blur'}],
    mainDiagTwFlag: [{required: true,message: '请填写',trigger: 'change'}],
    mainDiagCode: [{required: true,message: '请填写',trigger: 'change'}],
}
export {
  formList,
  rules
}