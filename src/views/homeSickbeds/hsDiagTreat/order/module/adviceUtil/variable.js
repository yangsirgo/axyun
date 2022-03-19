// export const defSelectedphar = "121"; // 默认门诊

export const defaultAddStatusValue = 0; // 新增医嘱 status 默认的值
export const zanCunStatusValue = "1";
export const relationDisabledList = ["useWay", "freqCode", "firstDayUse", "useDay", "urgent"];
export const maxKeyText = "max";// correntRow 设置可编辑元素最大值 的 目标字段
export const minKeyText = "min";// correntRow 设置可编辑元素最小值 的 目标字段
export const lInputTableDefautText = "请输入项目名称关键字";// 药品下拉组件默认placeholder
export const freqStObj = { //频次 立即 数据
  freqCode: "st",
  freqId: "17",
  freqTimes: 1,
  freqUnit: "天"
}

export const tableColumn = [{
    prop: "no",
    label: "序号",
    width: 35,
    align: "center",
    fixed: "left",
    max: "",// 可编辑框的最大值
    min: "",// 可编辑框的最小值
    input: false, // disabled 相关
    edit: true, // dom元素隐藏
    required: false, // 必填项
    shotcut: false, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  }, {
    prop: "status",
    label: "状态",
    width: 35,
    align: "center",
    fixed: "left",
    input: false, // disabled 相关
    edit: false, // dom元素隐藏
    required: false, // 必填项
    shotcut: false, //enter 跳转标识
    endSubmit: false // 末尾提交标识
  },
  {
    prop: "type",
    align: "center",
    label: "属性",
    width: 35,
    fixed: "left",
    input: false,
    edit: false,
    required: false
  },
  {
    prop: "expectStartTime",
    label: "开始时间",
    align: "center",
    width: 140,
    input: true,
    edit: true,
    required: false
  },
  {
    prop: "itemName",
    label: "医嘱名称",
    align: "left",
    width: 180,
    fixed: "left",
    input: true,
    edit: false,
    required: true,
    shotcut: true, //医嘱名称是必须跳转的
    endSubmit: false
  },
  {
    prop: "spec",
    label: "规格",
    align: "left",
    width: 100,
    input: false,
    edit: false,
    required: false
  },
  {
    prop: "onceDosage",
    label: "一次用量",
    align: "center",
    width: 50,
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "dosageUnit",
    label: "剂量单位",
    align: "center",
    width: 40,
    input: false,
    edit: false,
    required: false
  },
  {
    prop: "groupNoCls",
    label: "组",
    align: "center",
    width: 25,
    input: false,
    edit: false,
    required: false
  },
  {
    prop: "relation",
    label: "关联成组",
    align: "center",
    width: 35,
    input: true,
    edit: true,
    shotcut: false,
    required: false
  },
  {
    prop: "useWay",
    label: "用法",
    align: "center",
    width: 80,
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },

  {
    prop: "freqCode",
    label: "频次",
    align: "center",
    width: 90,
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "firstDayUse",
    label: "首日次数",
    align: "center",
    width: 35,
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "useDay",
    label: "用药天数",
    align: "center",
    width: 35,
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "quantity",
    align: "center",
    label: "数量",
    width: 45,
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },

  {
    prop: "unit",
    label: "数量单位",
    align: "center",
    width: 40,
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "expectStopTime",
    label: "预停时间",
    align: "center",
    width: 130,
    input: false,
    edit: false,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "price",
    label: "单价",
    width: 65,
    input: false,
    align: "right",
    edit: false,
    required: false
  },
  {
    prop: "stSolutionType",
    label: "皮试",
    width: 50,
    input: true,
    align: "center",
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  // {
  //   prop: "free",
  //   label: "免费",
  //   width: 50,
  //   input: true,
  //   edit: true,
  //   required: false
  // },
  {
    prop: "selfProvided",
    label: "自备",
    width: 35,
    input: true,
    align: "center",
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "urgent",
    label: "紧急",
    width: 35,
    align: "center",
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "execDept",
    label: "接收科室",
    width: 80,
    align: "center",
    input: false,
    edit: false,
    required: false
  },
  {
    prop: "limitResultCode",
    label: "医保限制",
    width: 80,
    align: "center",
    input: false,
    edit: false,
    required: false
  },
  {
    prop: "specialNote",
    label: "特殊说明",
    width: 100,
    align: "center",
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "selfPay",
    label: "自费",
    width: 35,
    align: "center",
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "remark",
    label: "备注",
    width: 100,
    align: "center",
    input: true,
    edit: true,
    required: false,
    shotcut: false,
    endSubmit: false
  },
  {
    prop: "amt",
    label: "金额（元）",
    width: 70,
    align: "right",
    input: false,
    edit: false,
    required: false
  },
  {
    prop: "deptId",
    label: "开嘱科室",
    width: 100,
    align: "center",
    input: false,
    edit: false,
    required: false
  }
];


export const dropColumn = [{
    prop: "name",
    label: "医嘱名称",
    headerAlign: "left",
    width: 200
  },
  {
    prop: "spec",
    label: "规格",
    headerAlign: "left",
    width: 100
  },
  {
    prop: "majorClassName",
    label: "医嘱分类",
    headerAlign: "left",
    width: 80
  },
  {
    prop: "price",
    label: "价格",
    headerAlign: "left",
    width: 80
  },
  {
    prop: "dosageunit",
    label: "计价单位",
    headerAlign: "left",
    width: 80,
    codeTransform: true,
    codeTransformCode: "DrugUnit"
  },
  {
    prop: "drugStock",
    headerAlign: "left",
    label: "库存数",
    width: 80
  },
  {
    prop: "availableQuantity",
    headerAlign: "left",
    label: "可用数量",
    width: 80
  },
  {
    prop: "stock",
    label: "商品名",
    headerAlign: "left",
    width: 80
  },
  // {
  //   prop: "itemType",
  //   label: "医保类型",
  //   width: 70,
  //   tableTransformType: "cnf_doctors_advice",
  //   tableTransform: true
  // },
  {
    prop: "basicType",
    label: "基本药物",
    headerAlign: "left",
    width: 70,
    codeTransform: true,
    codeTransformCode: "BasicDrugType"
  },
  {
    prop: "pharmacyName",
    headerAlign: "left",
    label: "药房",
    width: 100
  }
];

export const commonValidRules = [];
