let personnelFixedPointColumns = [{
  "prop": "operate",
  "label": "操作",
  "width": 180
}, {
  "prop": "psnNo",
  "label": "人员编号",
  "width": 120
}, {
  "prop": "psnName",
  "label": "人员姓名",
  "width": 80
}, {
  "prop": "tel",
  "label": "联系电话",
  "width": 80
}, {
  "prop": "addr",
  "label": "联系地址",
  "width": 80
}, {
  "prop": "bizAppyType",
  "label": "业务申请类型",
  "width": 130
}, {
  "prop": "agnterName",
  "label": "代办人姓名",
  "width": 100
}, {
  "prop": "agnterCertType",
  "label": "代办人证件类型",
  "width": 130
}, {
  "prop": "agnterCertno",
  "label": "代办人证件号码",
  "width": 130
}, {
  "prop": "agnterTel",
  "label": "代办人联系方式",
  "width": 130
}, {
  "prop": "agnterAddr",
  "label": "代办人联系地址",
  "width": 130
}, {
  "prop": "agnterRlts",
  "label": "代办人关系",
  "width": 100
}, {
  "prop": "fixSrtNo",
  "label": "定点排序号",
  "width": 100
}, {
  "prop": "fixmedinsCode",
  "label": "定点医药机构编号",
  "width": 140
}, {
  "prop": "fixmedinsName",
  "label": "定点医药机构名称",
  "width": 140
}, {
  "prop": "memo",
  "label": "备注",
  "width": 80
}, {
  "prop": "begndatetime",
  "label": "开始日期",
  "width": 80
}, {
  "prop": "enddatetime",
  "label": "结束日期",
  "width": 80
}];
let formList = [{
  "span": 6,
  "type": "input",
  "label": "人员编号",
  "prop": "psnNo",
  "required": true,
  "disabled": true
}, {
  "span": 6,
  "type": "input",
  "label": "人员姓名",
  "prop": "psnName",
  "required": true,
  "disabled": true
}, {
  "span": 6,
  "type": "input",
  "label": "联系电话",
  "prop": "tel",
  "required": true,
  "disabled": false
}, {
  "span": 6,
  "type": "input",
  "label": "联系地址",
  "prop": "addr",
  "required": true,
  "disabled": false
}, {
  "span": 6,
  "type": "select",
  "label": "业务申请类型",
  "prop": "bizAppyType",
  "required": true,
  "disabled": false
}, {
  "span": 6,
  "type": "input",
  "label": "代办人姓名",
  "prop": "agnterName",
  "required": false,
  "disabled": false
}, {
  "span": 6,
  "type": "select",
  "label": "代办人证件类型",
  "prop": "agnterCertType",
  "required": false,
  "disabled": false
}, {
  "span": 6,
  "type": "input",
  "label": "代办人证件号码",
  "prop": "agnterCertno",
  "required": false,
  "disabled": false
}, {
  "span": 6,
  "type": "input",
  "label": "代办人联系方式",
  "prop": "agnterTel",
  "required": false,
  "disabled": false
}, {
  "span": 6,
  "type": "input",
  "label": "代办人联系地址",
  "prop": "agnterAddr",
  "required": false,
  "disabled": false
}, {
  "span": 6,
  "type": "select",
  "label": "代办人关系",
  "prop": "agnterRlts",
  "required": false,
  "disabled": false
}, {
  "span": 6,
  "type": "input",
  "label": "定点排序号",
  "prop": "fixSrtNo",
  "required": true,
  "disabled": false
}, {
  "span": 6,
  "type": "select",
  "label": "定点医药机构类型",
  "prop": "fixmedinsType",
  "required": true,
  "disabled": false
}, {
  "span": 6,
  "type": "select",
  "label": "定点医药机构",
  "prop": "fixmedinsCode",
  "name": "fixmedinsName",
  "required": true,
  "disabled": false
}, {
  "span": 6,
  "type": "input",
  "label": "备注",
  "prop": "memo",
  "required": false,
  "disabled": false
}, {
  "span": 6,
  "type": "date",
  "label": "开始日期",
  "prop": "begndatetime",
  "required": true,
  "disabled": false
}, {
  "span": 6,
  "type": "date",
  "label": "结束日期",
  "prop": "enddatetime",
  "required": true,
  "disabled": false
}];
let rules = {
  psnNo: [{
    required: true,
    message: '请输入',
    trigger: 'blur'
  }],
  psnName: [{
    required: true,
    message: '请输入',
    trigger: 'blur'
  }],
  tel: [{
    required: true,
    message: '请输入',
    trigger: 'blur'
  }],
  addr: [{
    required: true,
    message: '请输入',
    trigger: 'blur'
  }],
  bizAppyType: [{
    required: true,
    message: '请输入',
    trigger: 'change'
  }],
  fixSrtNo: [{
    required: true,
    message: '请输入',
    trigger: 'blur'
  }],
  fixmedinsCode: [{
    required: true,
    message: '请输入',
    trigger: 'change'
  }],
  begndatetime: [{
    required: true,
    message: '请输入',
    trigger: 'change'
  }],
  enddatetime: [{
    required: true,
    message: '请输入',
    trigger: 'change'
  }]
};

export {
  personnelFixedPointColumns,
  formList,
  rules
}