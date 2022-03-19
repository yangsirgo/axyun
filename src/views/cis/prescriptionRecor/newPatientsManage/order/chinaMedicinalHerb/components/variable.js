export const totalTdNum = 4;
export const singleTdNum = 4;
export const newStatus = 0;
export const zancunStatus = 1;
export const totalNoOfJump = 2;
export const dropColumn = [
  // 下拉 table 配置表头
  // {
  //   prop: "expenseLevel",
  //   label: "报销",
  //   width: 60,
  //   codeTransform: true,
  //   codeTransformCode: "DrugReimbursementType"
  // },
  {
    prop: "orderItemName",
    label: "名称",
    align: 'center',
    width: 100
  },
  {
    prop: "spec",
    align: 'center',
    label: "规格"
  },
  {
    prop: "price",
    align: 'center',
    label: "单价",
    width: 100
  },
  // {
  //   prop: "execDeptName",
  //   label: "药房",
  // align: 'center',
  //   width: 100
  // },
  {
    prop: "itemTypeName",
    label: "项目类别",
    width: 100,
    tableTransformType: "cnf_doctors_advice",
    tableTransform: true
  },
  {
    prop: "stockNum",
    label: "库存",
    width: 100
  }
  // {
  //   prop: "basicType",
  //   label: "基药",
  //   width: 110,
  //   codeTransform: true,
  //   codeTransformCode: "BasicDrugType"
  // }
];


export const chmFormKey = [{
  key: "useQty",
  originValue: "undefined"
}, {
  key: "useWay",
  originValue: ""
}, {
  key: "volumeAfterDecoct",
  originValue: ""
}, {
  key: "freqCode",
  originValue: ""
}, {
  key: "freqTimes",
  originValue: ""
}, {
  key: "useDemand",
  originValue: ""
}, {
  key: "decoctType",
  originValue: ""
}, {
  key: "remarks",
  originValue: ""
}];


// 用于 对比数据变化
export const chmDrugsKey = ["orderItemName", "qty", "unitKey", "useWay"];

// 默认频次  默认每日两次
export const defaultFreq = {
  frequencyCode: 'BID',
  frequencyTimes: '2',
  frequencyUnit: '天'
};