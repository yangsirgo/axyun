export default [
  // 公共模块
  {
    icon: "iconmenzhenchufang",
    name: "诊断信息",
    component: "PrescriptionTemplete",
    regist: () => import("@/views/public/emrModules/PrescriptionTemplete"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconlicichufang",
    name: "历次处方",
    component: "PreviousPrescriptions",
    regist: () => import("@/views/public/emrModules/PreviousPrescriptions"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconlicichufang",
    name: "处方信息",
    component: "PreviousOrder",
    regist: () => import("@/views/public/emrModules/PreviousOrder"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconjianyanjieguo",
    name: "检验结果",
    component: "InspectionResults",
    regist: () => import("@/views/public/emrModules/InspectionResults"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconjianchajieguo",
    name: "检查结果",
    component: "CheckResult",
    regist: () => import("@/views/public/emrModules/CheckResult"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconlicizhenduan",
    name: "诊断信息",
    component: "HistoricalDiagnosis",
    regist: () => import("@/views/public/emrModules/HistoricalDiagnosis"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "icondianzibingli2",
    name: "知识库",
    component: "Knowledge",
    regist: () => import("@/views/public/emrModules/Knowledge"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconpianyu",
    name: "片语",
    component: "Phrase",
    regist: () => import("@/views/public/emrModules/Phrase"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconjiegoushu",
    name: "结构树",
    component: "StructureTree",
    regist: () => import("@/views/public/emrModules/StructureTree"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconteshuzifu",
    name: "特殊字符",
    component: "SpecialSymbol",
    regist: () => import("@/views/public/emrModules/SpecialSymbol"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconyixuebiaodashi",
    name: "医学表达式",
    component: "MedicalExpression",
    regist: () => import("@/views/public/emrModules/MedicalExpression"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconyuansuku",
    name: "元素库",
    component: "ElementLibrary",
    regist: () => import("@/views/public/emrModules/ElementLibrary"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "icongongxiangyuansu",
    name: "基本元素",
    component: "Macros",
    regist: () => import("@/views/public/emrModules/Macros"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "辅助诊断",
    component: "AuxiliaryDiagnosis",
    regist: () => import("@/views/public/emrModules/AuxiliaryDiagnosis"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconzhibiaojiedu",
    name: "指标解读",
    component: "StandardAnalysis",
    regist: () => import("@/views/public/emrModules/StandardAnalysis"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconbinglimoban",
    name: "病历模板",
    component: "MrTemplate",
    regist: () => import("@/views/public/emrModules/MrTemplate"),
    dir: "views/public/emrModules/",
    children: []
  },
  // 快捷键
  {
    icon: "iconfuzhuzhenduan",
    name: "快捷键",
    component: "Hotkey",
    regist: () => import("@/views/public/emrModules/Hotkey"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconjiwangwenshu",
    name: "既往文书",
    component: "PastDocument",
    regist: () => import("@/views/public/emrModules/PastDocument"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "异常值",
    component: "abnormal",
    regist: () => import("@/views/public/emrModules/abnormal"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "特殊字符",
    component: "character",
    regist: () => import("@/views/public/emrModules/character"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconpianyu",
    name: "短语模板",
    component: "inpwPhrase",
    regist: () => import("@/views/public/emrModules/inpwPhrase"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconpianyu",
    name: "医嘱引用",
    component: "inpwAdvice",
    regist: () => import("@/views/public/emrModules/PreviousOrder"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "文书交互",
    component: "docToolInteraction",
    regist: () =>
      import("@/views/nursingRecord/maintenanceDocument/components/docToolInteraction"),
    dir: "views/nursingRecord/maintenanceDocument/components/",
    children: []
  },
  {
    icon: "iconfuzhuzhenduan",
    name: "基本元素",
    component: "docToolBasicElement",
    regist: () =>
      import("@/views/nursingRecord/maintenanceDocument/components/docToolBasicElement"),
    dir: "views/nursingRecord/maintenanceDocument/components/",
    children: []
  },
  {
    icon: "iconfuzhidaoduanqicopy",
    name: "知识库",
    component: "knowledgeBase",
    regist: () => import("@/views/public/emrModules/knowledgeBase"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconguanlijihua",
    name: "管理计划",
    component: "ManagePlan",
    regist: () => import("@/views/public/emrModules/ManagePlan"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "iconjiankangchufang",
    name: "健康教育",
    component: "HealthPrescribe",
    regist: () => import("@/views/public/emrModules/HealthPrescribe"),
    dir: "views/public/emrModules/",
    children: []
  },
  {
    icon: "",
    name: "老系统病历",
    component: "oldSystemRecord",
    regist: () => import("@/views/public/emrModules/oldSystemRecord"),
    dir: "views/public/emrModules/",
    children: []
  },
  // 平安 CDSS 平台
  {
    icon: "iconfuzhuzhenduan",
    name: "CDSS",
    component: "CDSSComponent",
    regist: () =>
      import("@/views/homeSickbeds/hsDiagTreat/toolBox/CDSSComponent.vue"),
    dir: "views/homeSickbeds/hsDiagTreat/toolBox/",
    children: []
  }
];
