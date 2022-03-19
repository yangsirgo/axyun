export const relationDisabledList_cis = ["useWay", "frequencyCode", "useDay", "urgent"];
export const colDisabledText = "disabled";
export const frequencyObjKeys = [
  "frequencyTimes",
  "frequencyUnit",
  "frequencyCode"
];
export const zancunStatus = "0";

// 治疗单打印 入参配置
//  皮试 注射 输液等
// 1.门诊皮试单（用法901）、2.门诊注射单（用法4 401 402 403）、3.输液执行单（用法404 40401）、4.门诊治疗单（用法7 或者 空格）  
 
export const zLPrintConfig = [{
  label: "皮试",
  useWayCode: ["901"],
  printGroup: 1,
  
},{
  label: "注射",
  useWayCode: ["4", "401", "402", "403"],
  printGroup: 2
},{
  label: "输液",
  useWayCode: ["404", "40401"],
  printGroup: 3
},{
  label: "治疗",
  useWayCode: ["7"],
  printGroup: 4
}];

export const tableColumn = [{
    prop: "recipeCode",
    label: "处方号",
    width: 120,
    fixed: true
  },
  {
    prop: "no",
    label: "序号",
    width: 50,
    fixed: true
  },
  {
    prop: "selfProvided",
    label: "自备药",
    width: 70,
    fixed: true
  },
  {
    prop: "orderStatus", // 状态
    label: "状态",
    width: 60
  },
  {
    prop: "orderItemName",
    label: "医嘱名称",
    align: "left",
    width: 200,
    fixed: true,
    input: true,
    shotcut: true, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "bunching",
    label: "组",
    align: "center",
    width: 40
  },
  {
    prop: "spec",
    label: "规格",
    width: 120
  },
  {
    prop: "onceDosage",
    label: "一次用量",
    input: true,
    shotcut: true, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "dosageUnit",
    label: "剂量单位",
    width: 80
  },
  {
    prop: "relation",
    label: "关联成组",
    width: 50,
    shotcut: true
  },

  {
    prop: "frequencyCode",
    label: "频次",
    width: 100,
    input: true,
    shotcut: true, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "useWay",
    label: "用法",
    width: 100,
    input: true,
    shotcut: true, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "useDay",
    label: "天数",
    width: 50,
    input: true,
    shotcut: true, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "price",
    label: "单价（元）",
    width: 100
  },
  {
    prop: "qty",
    label: "数量",
    width: 80,
    shotcut: true, //enter 跳转标识
    endSubmit: true // 末尾提交标识
  },
  {
    prop: "unitKey",
    label: "单位",
    width: 70
  },

  {
    prop: "execDeptName",
    label: "接收科室"
  },
  {
    prop: "limitResultCode", // 医保限制审批结果
    label: "医保限制",
    width: 80
  },
  {
    prop: "diseaseType", // 医保限制审批结果
    label: "就诊类别",
    width: 80
  },
  {
    prop: "skinTest",
    label: "皮试",
    width: 50,
    input: true
  },
  {
    prop: "stSolutionType",
    label: "皮试液类型",
    width: 100,
    shotcut: false, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "urgent",
    label: "加急",
    width: 50,
    input: true
  },
  // {
  //   prop: "flowRate",
  //   label: "滴速（滴/分）",
  //   width: 190
  // },
  {
    prop: "excessReason",
    label: "医嘱超量原因",
    width: 140,
    shotcut: false, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "remark",
    label: "备注"
  },
  {
    prop: "amt",
    label: "金额（元）",
    width: 100
  },
  {
    prop: "medicalInsuranceCat",
    label: "医保类别",
    width: 80
  },
  {
    prop: "orderCat",
    label: "医嘱类型",
    width: 80
  },
  {
    prop: "chargeStatus", // 收费状态
    label: "收费状态",
    width: 80
  }
];

export const DrugsRequiredItem = [{
    name: "orderItemName",
    label: "医嘱名称"
  },
  {
    name: "onceDosage",
    label: "一次用量"
  },
  {
    name: "relation",
    label: "关联成组"
  },
  {
    name: "frequencyCode",
    label: "频次"
  },
  {
    name: "useWay",
    label: "用法"
  },
  {
    name: "useDay",
    label: "天数"
  },
  {
    name: "qty",
    label: "数量"
  },
  {
    name: "unitKey",
    label: "单位"
  },
  /* {
    name: "skinTest",
    label: "皮试"
  },
  {
    name: "selfProvided",
    label: "自备药"
  },
  {
    name: "stSolutionType",
    label: "皮试液类型"
  },
  {
    name: "urgent",
    label: "加急"
  }, */
  /* {
    name: "excessReason",
    label: "医嘱超量原因"
  }, */
  {
    name: "remark",
    label: "备注"
  }
];




export const dropColumn = [
  // 下拉 table 配置表头
  {
    prop: "medicalInsuranceCat",
    label: "报销",
    width: 30,
    codeTransform: true,
    codeTransformCode: "DrugReimbursementType"
  },
  {
    prop: "orderItemName",
    label: "名称",
    width: 200
  },
  {
    prop: "spec",
    label: "规格"
  },
  {
    prop: "price",
    label: "单价",
    width: 100
  },
  {
    prop: "execDeptName",
    label: "药房",
    width: 60
  },
  {
    prop: "itemType",
    label: "项目类别",
    width: 60,
    tableTransformType: "cnf_doctors_advice",
    tableTransform: true
  },
  {
    prop: "stockNum",
    label: "库存",
    width: 100
  },
  {
    prop: "basicType",
    label: "基药",
    codeTransform: true,
    codeTransformCode: "BasicDrugType"
  }
]


export const tableRules = {
  orderItemName: [{
    required: true,
    message: "请选择医嘱项目",
    trigger: ["change", "blur"]
  }],
  orderCat: [{
    required: true,
    message: "请选择医保分类",
    trigger: "change"
  }],
  doctorsAdviceCate: [{
    required: true,
    message: "请选择医嘱类型",
    trigger: "change"
  }],
  relation: [],
  onceDosage: [{
      required: true,
      message: "请填写单次剂量",
      trigger: ["blur", "change"]
    },
    {
      pattern: /^[0-9]+([.]{1}[0-9]{1,4})?$/,
      message: "请输入正确的单次计量！"
    }
  ],
  frequencyCode: [{
    required: true,
    message: "请选择频次",
    trigger: "blur"
  }],
  useWay: [{
    required: true,
    message: "请选择用法",
    trigger: "blur"
  }],
  qty: [{
    required: true,
    message: "请填写数量",
    trigger: "blur"
  }],
  unitKey: [{
    required: true,
    message: "请选择单位",
    trigger: "blur"
  }],
  useDay: [{
    required: true,
    message: "请填写用药天数",
    trigger: ["blur", "change"]
  }],
  stSolutionType: [{
    required: true,
    message: "请填写皮试液类型",
    trigger: ["blur"]
  }],
  excessReason: [{
    required: true,
    message: "请填写超量原因",
    trigger: ["blur", "change"]
  }],
  remark: []
};

export const treatRequiredItem = [{
    name: "orderItemName",
    label: "医嘱名称"
  },
  {
    name: "frequencyCode",
    label: "频次"
  },
  {
    name: "useDay",
    label: "天数"
  },
  {
    name: "onceDosage",
    label: "单次数量"
  },
  {
    name: "qty",
    label: "数量"
  },
  {
    name: "unitKey",
    label: "单位"
  },
  {
    name: "remark",
    label: "备注"
  }
];
