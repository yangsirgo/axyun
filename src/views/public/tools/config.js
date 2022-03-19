export default [

  // 患者主索引
  {
    icon: "iconmenzhenchufang",
    name: "辅助内容",
    component: "TreatmentInfoBox",
    regist: () => import("@/views/patientMaster/treatmentInfor/components/TreatmentInfoBox"),
    dir: 'views/patientMaster/treatmentInfor/components/',
    children: [],
  },
  {
    icon: "iconmenzhenchufang",
    name: "相似档案",
    component: "silimarRecord",
    regist: () => import("@/views/patientMaster/recordManage/recordCreate/components/silimarRecord"),
    dir: "views/patientMaster/recordManage/recordCreate/components/",
    children: []
  }, {
    icon: "iconmenzhenchufang",
    name: "档案来源信息",
    component: "recordSource",
    regist: () => import("@/views/patientMaster/cardsRecord/components/recordSource"),
    dir: "views/patientMaster/cardsRecord/components/",
    children: []
  }, {
    icon: "iconmenzhenchufang",
    name: "家床执行",
    component: "inpatientTimeLine",
    regist: () => import("@/views/patientMaster/costs/components/inpatientTimeLine"),
    dir: "views/patientMaster/costs/components/",
    children: []
  }, {
    icon: "iconmenzhenchufang",
    name: "就诊记录",
    component: "visitTimeLine",
    regist: () => import("@/views/patientMaster/costs/components/visitTimeLine"),
    dir: "views/patientMaster/costs/components/",
    children: []
  }, {
    icon: "iconmenzhenchufang",
    name: "患者诊疗信息",
    component: "treatmentPlan",
    regist: () => import("@/views/patientMaster/treatmentInfor/components/treatmentPlan"),
    dir: "views/patientMaster/treatmentInfor/components/",
    children: []
  }, {
    icon: "iconmenzhenchufang",
    name: "历史就诊列表",
    component: "hisRecord",
    regist: () => import("@/views/patientMaster/treatmentInfor/components/hisRecord"),
    dir: "views/patientMaster/treatmentInfor/components/",
    children: []
  },
  // 建档与变更start
  {
    icon: "iconmenzhenchufang",
    name: "实名认证",
    component: "RealName",
    regist: () => import("@/views/filingAndChange/filingAndChangeindex/components/RealName"),
    dir: "views/filingAndChange/filingAndChangeindex/components/",
    children: []
  },
  {
    icon: "iconmenzhenchufang",
    name: "相似档案",
    component: "similarFiles",
    regist: () => import("@/views/filingAndChange/filingAndChangeindex/components/similarFiles"),
    dir: "views/filingAndChange/filingAndChangeindex/components/",
    children: []
  },
  {
    icon: "iconmenzhenchufang",
    name: "人脸识别",
    component: "FaceRecognition",
    regist: () => import("@/views/filingAndChange/filingAndChangeindex/components/FaceRecognition"),
    dir: "views/filingAndChange/filingAndChangeindex/components/",
    children: []
  },
  {
    icon: "iconmenzhenchufang",
    name: "就医指南",
    component: "edicalreatmentGuide",
    regist: () => import("@/views/filingAndChange/filingAndChangeindex/components/edicalreatmentGuide"),
    dir: "views/filingAndChange/filingAndChangeindex/components/",
    children: []
  },
  // 建档与变更end

  // 公共模块
  {
    icon: "iconmenzhenchufang",
    name: "诊断信息",
    component: "PrescriptionTemplete",
    regist: () => import("@/views/public/modules/PrescriptionTemplete"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconlicichufang",
    name: "历次处方",
    component: "PreviousPrescriptions",
    regist: () => import("@/views/public/modules/PreviousPrescriptions"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconlicichufang",
    name: "历次医嘱",
    component: "PreviousOrder",
    regist: () => import("@/views/public/modules/PreviousOrder"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconjianyanjieguo",
    name: "检验结果",
    component: "InspectionResults",
    regist: () => import("@/views/public/modules/InspectionResults"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconjianchajieguo",
    name: "检查结果",
    component: "CheckResult",
    regist: () => import("@/views/public/modules/CheckResult"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconlicizhenduan",
    name: "历次诊断",
    component: "HistoricalDiagnosis",
    regist: () => import("@/views/public/modules/HistoricalDiagnosis"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "icondianzibingli2",
    name: "知识库",
    component: "Knowledge",
    regist: () => import("@/views/public/modules/Knowledge"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconpianyu",
    name: "片语",
    component: "Phrase",
    regist: () => import("@/views/public/modules/Phrase"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconjiegoushu",
    name: "结构树",
    component: "StructureTree",
    regist: () => import("@/views/public/modules/StructureTree"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconteshuzifu",
    name: "特殊字符",
    component: "SpecialSymbol",
    regist: () => import("@/views/public/modules/SpecialSymbol"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconyixuebiaodashi",
    name: "医学表达式",
    component: "MedicalExpression",
    regist: () => import("@/views/public/modules/MedicalExpression"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconyuansuku",
    name: "元素库",
    component: "ElementLibrary",
    regist: () => import("@/views/public/modules/ElementLibrary"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "icongongxiangyuansu",
    name: "基本元素",
    component: "Macros",
    regist: () => import("@/views/public/modules/Macros"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "辅助诊断",
    component: "AuxiliaryDiagnosis",
    regist: () => import("@/views/public/modules/AuxiliaryDiagnosis"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconzhibiaojiedu",
    name: "指标解读",
    component: "StandardAnalysis",
    regist: () => import("@/views/public/modules/StandardAnalysis"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconbinglimoban",
    name: "病历模板",
    component: "MrTemplate",
    regist: () => import("@/views/public/modules/MrTemplate"),
    dir: "views/public/modules/",
    children: []
  },
  //门急诊--预约分诊START
  {
    icon: "iconfuzhuzhenduan",
    name: "预约挂号统计",
    component: "doctorOverview",
    regist: () => import("@/views/cis/appointTriage/toolBox/doctorOverview"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "挂号记录",
    component: "registerRecord",
    regist: () => import("@/views/cis/appointTriage/toolBox/registerRecord"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "预约挂号记录",
    component: "appointRegisterRecord",
    regist: () => import("@/views/cis/appointTriage/toolBox/appointRegisterRecord"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "预约记录",
    component: "appointRecord",
    regist: () => import("@/views/cis/appointTriage/toolBox/appointRecord"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "分诊科室",
    component: "triage",
    regist: () => import("@/views/cis/appointTriage/toolBox/triage"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "预检记录",
    component: "preDiagnosisRecord",
    regist: () => import("@/views/cis/appointTriage/toolBox/preDiagnosisRecord"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  //门急诊--预约分诊END
  //门急诊--结算START
  {
    icon: "iconfuzhuzhenduan",
    name: "票据管理",
    component: "billManage",
    regist: () => import("@/views/cis/settleAccount/toolBox/billManage"),
    dir: "views/cis/settleAccount/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "发票跳号",
    component: "receiptJump",
    regist: () => import("@/views/public/modules/receiptJump"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "排班情况",
    component: "scheduling",
    regist: () => import("@/views/cis/settleAccount/toolBox/scheduling"),
    dir: "views/cis/settleAccount/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "退费进度",
    component: "refundProgress",
    regist: () => import("@/views/cis/settleAccount/toolBox/refundProgress"),
    dir: "views/cis/settleAccount/toolBox/",
    children: []
  },
  //门急诊--结算END

  //门急诊--病历处方START
  {
    icon: "iconfuzhuzhenduan",
    name: "患者信息",
    component: "patientInfo",
    regist: () => import("@/views/cis/prescriptionRecor/toolBox/patientInfo"),
    dir: "views/cis/prescriptionRecor/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "患者360",
    component: "patientFullAngle",
    regist: () => import("@/views/cis/prescriptionRecor/toolBox/patientFullAngle"),
    dir: "views/cis/prescriptionRecor/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "处方模板",
    component: "prescriptionTemp",
    regist: () => import("@/views/cis/prescriptionRecor/toolBox/prescriptionTemp"),
    dir: "views/cis/prescriptionRecor/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "常用药",
    component: "commonDrug",
    regist: () => import("@/views/cis/prescriptionRecor/toolBox/commonDrug"),
    dir: "views/cis/prescriptionRecor/toolBox/",
    children: []
  },
  /* 电子申请的模板 */
  {
    icon: "iconfuzhuzhenduan",
    name: "申请模板",
    component: "checkTemp",
    regist: () => import("@/views/cis/prescriptionRecor/toolBox/checkTemp"),
    dir: "views/cis/prescriptionRecor/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "常用诊断",
    component: "commonDiag",
    regist: () => import("@/views/cis/prescriptionRecor/toolBox/commonDiag"),
    dir: "views/cis/prescriptionRecor/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "历史病假证明单",
    component: "historicalSickLeave",
    regist: () => import("@/views/cis/prescriptionRecor/toolBox/historicalSickLeave"),
    dir: "views/cis/prescriptionRecor/toolBox/",
    children: []
  },
  //门急诊--病历处方END
  //门急诊--集成病历START
  {
    icon: "iconfuzhuzhenduan",
    name: "指标解读",
    component: "indexInterpretation",
    regist: () => import("@/views/cis/integratedEmr/toolBox/indexInterpretation"),
    dir: "views/cis/integratedEmr/toolBox/",
    children: []
  },
  //门急诊--集成病历END
  //门急诊--入院申请START
  {
    icon: "iconfuzhuzhenduan",
    name: "历史申请+特殊说明模板",
    component: "previousApply",
    regist: () => import("@/views/cis/admApplication/toolBox/previousApply"),
    dir: "views/cis/admApplication/toolBox/",
    children: []
  },
  //门急诊--入院申请END
  // 门急诊预约记录
  {
    icon: "iconfuzhuzhenduan",
    name: "预约记录",
    component: "orderList",
    regist: () => import("@/views/cis/appointTriage/toolBox/orderList"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  //家床--家床管理
  //排床，包床
  {
    icon: "iconfuzhuzhenduan",
    name: "历史家床信息",
    component: "historyHosi",
    regist: () => import("@/views/ipnw/components/historyHosi"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "全科问题总览",
    component: "allDepartOverview",
    regist: () => import("@/views/ipnw/components/allDepartOverview"),
    dir: "views/ipnw/components/",
    children: []
  },
  //家床--护理
  // {
  //   icon: "iconfuzhuzhenduan",
  //   name: "全科问题总览",
  //   component: "nursingOverView",
  //   regist: () => import("@/views/ipnw/components/nursingOverView"),
  // dir: "views/ipnw/components/",
  // children: []
  // },
  {
    icon: "iconfuzhuzhenduan",
    name: "医嘱执行明细",
    component: "implementDetail",
    regist: () => import("@/views/ipnw/components/implementDetail"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "模板引用",
    component: "templateQuote",
    regist: () => import("@/views/ipnw/components/templateQuote"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "NANDA",
    component: "nanda",
    regist: () => import("@/views/ipnw/components/nanda"),
    dir: "views/ipnw/components/",
    children: []
  },
  //护理文书工具箱
  {
    icon: "iconfuzhuzhenduan",
    name: "异常值",
    component: "abnormal",
    regist: () => import("@/views/ipnw/components/abnormal"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "特殊字符",
    component: "character",
    regist: () => import("@/views/ipnw/components/character"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconpianyu",
    name: "短语模板",
    component: "inpwPhrase",
    regist: () => import("@/views/ipnw/components/inpwPhrase"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconpianyu",
    name: "医嘱引用",
    component: "inpwAdvice",
    regist: () => import("@/views/ipnw/components/inpwAdvice"),
    dir: "views/ipnw/components/",
    children: []
  },
  //家床--撤床
  {
    icon: "iconfuzhuzhenduan",
    name: "撤床费用",
    component: "leaveCost",
    regist: () => import("@/views/ipnw/components/leaveCost"),
    dir: "views/ipnw/components/",
    children: []
  },
  //住院--病历医嘱
  {
    icon: "iconfuzhuzhenduan",
    name: "患者信息",
    component: "inpwPatientInfo",
    regist: () => import("@/views/ipnw/components/inpwPatientInfo"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "药品信息",
    component: "drugInfo",
    regist: () => import("@/views/ipnw/components/drugInfo"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "历次诊断",
    component: "historyDiagnosis",
    regist: () => import("@/views/ipnw/components/historyDiagnosis"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "病历模板",
    component: "medRecordTemplate",
    regist: () => import("@/views/ipnw/components/medRecordTemplate"),
    dir: "views/ipnw/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "诊断模板",
    component: "diagTemplate",
    regist: () => import("@/views/public/modules/diagTemplate"),
    dir: "views/public/modules/",
    children: []
  },
  //住院--集成病历
  {
    icon: "iconfuzhuzhenduan",
    name: "指标解读",
    component: "reportExplain",
    regist: () => import("@/views/ipnw/IntegratedEmr/component/reportExplain"),
    dir: "views/ipnw/IntegratedEmr/component/",
    children: []
  },
  // 药房药库
  {
    icon: "iconfuzhuzhenduan",
    name: "历史入库明细",
    component: "historyWarehousing",
    regist: () => import("@/views/drugManagement/components/historyWarehousing"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "历史出库明细",
    component: "historyOutStock",
    regist: () => import("@/views/drugManagement/components/historyOutStock"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "申请流程",
    component: "applyProcess",
    regist: () => import("@/views/drugManagement/components/applyProcess"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "销售情况",
    component: "saleSituation",
    regist: () => import("@/views/drugManagement/components/saleSituation"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "其他处方",
    component: "otherPrescription",
    regist: () => import("@/views/drugManagement/components/otherPrescription"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "药品审方",
    component: "drugCheck",
    regist: () => import("@/views/drugManagement/components/drugCheck"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "目标药房库存",
    component: "targetDrugstoreStock",
    regist: () => import("@/views/drugManagement/components/targetDrugstoreStock"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "药库库存情况",
    component: "drugstoreStock",
    regist: () => import("@/views/drugManagement/components/drugstoreStock"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "退货流程",
    component: "returnGoodsProcess",
    regist: () => import("@/views/drugManagement/components/returnGoodsProcess"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "历史采购情况",
    component: "historyPurchase",
    regist: () => import("@/views/drugManagement/components/historyPurchase"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "历史出库情况",
    component: "historyOutProcess",
    regist: () => import("@/views/drugManagement/components/historyOutProcess"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "退药流程",
    component: "returnDrugProcess",
    regist: () => import("@/views/drugManagement/components/returnDrugProcess"),
    dir: "views/drugManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "价格走向",
    component: "priceTrend",
    regist: () => import("@/views/drugManagement/components/priceTrend"),
    dir: "views/drugManagement/components/",
    children: []
  },
  // 快捷键
  {
    icon: "iconfuzhuzhenduan",
    name: "快捷键",
    component: "Hotkey",
    regist: () => import("@/views/public/modules/Hotkey"),
    dir: "views/public/modules/",
    children: []
  },
  // 家床
  {
    icon: "iconfuzhuzhenduan",
    name: "家床登记情况",
    component: "admitRegistrState",
    regist: () => import("@/views/cis/appointTriage/toolBox/admitRegistrState"),
    dir: "views/cis/appointTriage/toolBox/",
    children: []
  },
  // 排班工具箱
  {
    icon: "iconfuzhuzhenduan",
    name: "本科室周排班模版",
    component: "scheTemps",
    regist: () => import("@/views/systemManagement/schedule/scheduleManagement/components/scheTemps"),
    dir: "views/systemManagement/schedule/scheduleManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "发布记录",
    component: "schePublish",
    regist: () => import("@/views/systemManagement/schedule/scheduleManagement/components/schePublish"),
    dir: "views/systemManagement/schedule/scheduleManagement/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "交接班模板",
    component: "handoverTem",
    regist: () => import("@/views/public/modules/handoverTem"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "过敏药品信息",
    component: "allergyDrugInfo",
    regist: () => import("@/views/public/modules/allergyDrugInfo"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "过敏处理",
    component: "handleAllergy",
    regist: () => import("@/views/public/modules/handleAllergy"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "过敏记录",
    component: "recordsAllergy",
    regist: () => import("@/views/public/modules/recordsAllergy"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "护理文书",
    component: "docTools",
    regist: () => import("@/views/nursingRecord/maintenanceDocument/components/docTools"),
    dir: "views/nursingRecord/maintenanceDocument/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "采购模板",
    component: "purchaseTemplate",
    regist: () => import("@/views/drugManagement/drugstock/purchase/toolBox/purchaseTemplate"),
    dir: "views/drugManagement/drugstock/purchase/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "皮试结果",
    component: "skinTest",
    regist: () => import("@/views/public/modules/skinTest"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "煎药登记",
    component: "decoctionReg",
    regist: () => import("@/views/public/modules/decoctionReg"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "毒麻处方登记",
    component: "dmPreReg",
    regist: () => import("@/views/public/modules/dmPreReg"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "盘存详细信息",
    component: "inventoryDetails",
    regist: () => import("@/views/public/modules/inventoryDetails"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "不合格处方",
    component: "substandardPre",
    regist: () => import("@/views/public/modules/substandardPre"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "处方发药批次明细",
    component: "drugBatch",
    regist: () => import("@/views/public/modules/drugBatch"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "家床医嘱汇总批次明细",
    component: "orderDetails",
    regist: () => import("@/views/public/modules/orderDetails"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "家床病人医嘱药品批次明细",
    component: "patientBatchDetails",
    regist: () => import("@/views/public/modules/patientBatchDetails"),
    dir: "views/public/modules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "盘存流程",
    component: "inventoryProcess",
    regist: () => import("@/views/drugManagement/components/inventoryProcess"),
    dir: "views/drugManagement/components/",
    children: []
  },
  //家庭病床 家庭诊疗 工具箱  adviceTemplate
  {
    icon: "iconfuzhuzhenduan",
    name: "医嘱执行记录",
    component: "hsOrderExecRecord",
    regist: () => import("@/views/homeSickbeds/hsDiagTreat/toolBox/hsOrderExecRecord.vue"),
    dir: "views/homeSickbeds/hsDiagTreat/toolBox/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "医嘱模板",
    component: "adviceTemplate",
    regist: () => import("@/views/homeSickbeds/hsDiagTreat/toolBox/adviceTemplate.vue"),
    dir: "views/homeSickbeds/hsDiagTreat/toolBox/",
    children: []
  },
  // 家庭病床 家庭诊疗 常用药
  {
    icon: "iconfuzhuzhenduan",
    name: "常用药",
    component: "homeSickCommonDrug",
    regist: () => import("@/views/homeSickbeds/hsDiagTreat/toolBox/homeSickCommonDrug.vue"),
    dir: "views/homeSickbeds/hsDiagTreat/toolBox/",
    children: []
  },
  // 平安 CDSS 平台
  {
    icon: "iconfuzhuzhenduan",
    name: "CDSS",
    component: "CDSSComponent",
    regist: () => import("@/views/homeSickbeds/hsDiagTreat/toolBox/CDSSComponent.vue"),
    dir: "views/homeSickbeds/hsDiagTreat/toolBox/",
    children: []
  }
];
