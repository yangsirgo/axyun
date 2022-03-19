import Layout from "../../node_modules/axcommon/src/layout";
import componentsRouter from "./modules/app";

export const constantRoutes = [{
  path: "/login",
  component: () =>
    import("@/views/login/index"),
  hidden: true
},
{
  path: "/sso/uclogin",
  component: () =>
    import("@/views/sso/verifyCode/index"),
  hidden: true
},
{
  path: "/sso/ucredirect",
  component: () =>
    import("@/views/sso/redirect/index"),
  hidden: true
},
{
  path: "/404",
  component: () =>
    import("@/views/404"),
  hidden: true
},
{
  path: "/500",
  component: () =>
    import("@/views/500.vue"),
  hidden: true
},
{
  path: "/WxOrZfb",
  component: () =>
    import("@/components/WxOrZfb.vue"),
  hidden: true
},

{
  path: "/",
  component: Layout,
  redirect: "/dashboard",
  name: "首页",
  children: [{
    // path: "scheduleManagement",
    path: "s",
    name: "排班",
    component: () =>
      import("@/views/systemManagement/schedule"),
    children: [{
      path: "m",
      name: "排班管理",
      component: () =>
        import("@/views/systemManagement/schedule/scheduleManagement")
    },
    {
      path: "l",
      name: "排班列表",
      component: () =>
        import("@/views/systemManagement/schedule/scheduleList")
    }
    ]
  },
  {
    // path: "scheduleManagement",
    path: "t",
    name: "模板",
    component: () =>
      import("@/views/systemManagement/templateSystem"),
    children: [{
      path: "p",
      name: "处方模板",
      component: () =>
        import("@/views/systemManagement/templateSystem/prescriptionTemplate")
    },
    {
      path: "a",
      name: "医嘱模板",
      component: () =>
        import("@/views/systemManagement/templateSystem/doctorAdviceTemplate")
    },
    {
      path: "d",
      name: "诊断模板",
      component: () =>
        import("@/views/systemManagement/templateSystem/diagnosisTemplate")
    }
    ]
  },
  {
    path: "dashboard",
    name: "dashboard",
    component: () =>
      import("@/components/adviceCommon/modules/analysisModule/multAnalysis.vue"),
    meta: {
      title: "dashboard",
      icon: "dashboard",
      affix: true
    }
  },
  {
    path: "report",
    component: () =>
      import("@/views/public/reportCenter/insReport.vue"),
    meta: {
      title: "检验报告"
    }
  },
  {
    path: "depRelation",
    name: "科室关系维护",
    component: () =>
      import("@/views/public/temperature/depRelation")
  },
  {
    path: "option",
    name: "选项维护",
    component: () =>
      import("@/views/public/temperature/option")
  },
  {
    path: "tempItemOption",
    name: "项目选项维护",
    component: () =>
      import("@/views/public/temperature/itemOptionRelation")
  },
  {
    path: "temperatureMain",
    name: "体温单录入",
    component: () =>
      import("@/views/ipnw/nursing/temperatureList/temperatureMain")
  },
  {
    path: "phrase",
    name: "短语维护",
    component: () =>
      import("@/views/nursingRecord/docPhrase/phrase")
  },
  // 临时
  {
    path: "gra",
    name: "sss",
    component: () =>
      import("@/views/finance/outp/prestoreGrant/index")
  },
  {
    path: "sel",
    name: "sel",
    component: () =>
      import("@/views/finance/outp/prestoreGrantSel/index")
  },
  {
    path: "inp",
    name: "inp",
    component: () =>
      import("@/views/finance/inp/grantOverdraw/index")
  },
  {
    path: "inpPrepay",
    name: "inpPrepay",
    component: () =>
      import("@/views/finance/inp/inpPrepay/index")
  },
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/dashboard",
  //   name: "首页首页",
  //   children: [{
  //     path: "dashboard",
  //     name: "首页首页首页",
  //     component: () => import("@/views/dashboard/index"),
  //     meta: {
  //       title: "首页",
  //       icon: "dashboard",
  //       affix: true
  //     }
  //   },
  //   ]
  // },
  {
    path: "demo-editor",
    name: "编辑器测试",
    component: () =>
      import("@/views/demo/editor")
  },
  {
    path: "tableForm",
    name: "表单页demo",
    component: () =>
      import("@/views/demo/tableForm")
  },
  {
    path: "testFormTable",
    name: "表单页demo",
    component: () =>
      import("@/views/demo/testFormTable/vxeTable.vue")
  },
  {
    path: "testSortTable",
    name: "表单搜索排序",
    component: () =>
      import("@/views/demo/testFormTable/sort.vue")
  },
  {
    path: "shotcut",
    name: "表单页demo",
    component: () =>
      import("@/views/demo/shotCutTable/index.vue")
  },
  {
    path: "opEmr",
    name: "门诊集成病历",
    component: () =>
      import("@/views/cis/integratedEmr/opEmr.vue")
  },
  {
    path: "patientList",
    name: "住院集成病历",
    component: () =>
      import("@/views/cis/prescriptionRecor/newVist/components/vistMain.vue")
  },
  {
    path: "patientList_",
    name: "住院集成病历",
    component: () =>
      import("@/views/ipnw/medicalAdvice/patientList/index.vue")
  },
  // 综合管理详情页
  {
    name: "IntegratedManagementInfo",
    path: "/IntegratedManagementInfo",
    component: () =>
      import("@/views/phss/IntegratedManagement/IMInfo"),
    hidden: false
  }
  ]
},
];

export const asyncRoutes = {
  //勿动-打屁股
  user: () =>
    import("@/views/admin/user/index"),
  menu: () =>
    import("@/views/admin/menu/index"),
  authResource: () =>
    import("@/views/admin/resource/authResource"),
  role: () =>
    import("@/views/admin/role/index"),
  //菜单资源管理 被合并到其他了
  //resource: () => import("@/views/admin/resource/index"),
  relevance: () =>
    import("@/views/admin/auth/deptrole/index"),
  userInfo: () =>
    import("@/views/admin/auth/deptuser/index"),
  ward: () =>
    import("@/views/admin/whis/ward/index"),
  bed: () =>
    import("@/views/admin/whis/bed/index"),
  room: () =>
    import("@/views/admin/whis/room/index"),
  print: () =>
    import("@/views/admin/print/index"),
  // ureport: () => import("@/views/admin/ureport/index"),
  scheduler: () =>
    import("@/views/wtask/scheduler/index"),
  taskMonitoring: () =>
    import("@/views/wtask/taskMonitoring/index"),
  bizdir: () =>
    import("@/views/wconf/bizdir/index"),

  organ: () =>
    import("@/views/admin/organ/index"),
  type: () =>
    import("@/views/admin/organParam/index"),
  organType: () =>
    import("@/views/admin/organType/index"),
  tenant: () =>
    import("@/views/admin/tenant/index"),
  tenantRole: () =>
    import("@/views/admin/tenantRole/index"),

  setting: () =>
    import("@/views/admin/setting/index"),
  //模板维护
  templMaintain: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/order/templateMaintenance/index.vue"),
  //抗菌药品权限维护
  drugAccessMaintain: () =>
    import("@/views/systemManagement/drugAccessMaintain/index.vue"),
  //检验检查组套维护
  groupMaintain: () =>
    import("@/views/systemManagement/groupMaintain/index.vue"),
  // wcnf: () => import("@/views/wconf/wcnf/index"),
  wparam: () =>
    import("@/views/wconf/wparam/index"),
  wcnfType: () =>
    import("@/views/wconf/wcnfType/index"),
  wcnfList: () =>
    import("@/views/wconf/wpList/index"),
  wcnfViewList: () =>
    import("@/views/wconf/wpViewList/index"),
  sequence: () =>
    import("@/views/wconf/sequence/index"),
  mutuallyorder: () =>
    import("@/views/wconf/mutuallyorder/index"),

  com: () =>
    import("@/views/com/index"),
  ...componentsRouter
};
