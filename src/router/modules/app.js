const componentsRouter = {

  demoshow: () => import("@/views/demo/demo"),

  //这俩谁的模块,求求你别放我那行吗,别放admin
  /*
  baseData: () =>
      import ("@/views/admin/baseData/BaseData"),
  dataManage: () =>
      import ("@/views/admin/dataManage/DataManage"),
  valueDomainRegister: () =>
      import ("@/views/admin/dataManage/ValueDomainRegister"),
  moduleRegister: () =>
      import ("@/views/admin/dataManage/ModuleRegister"),
      */

  // ipnw: () => import("@/views/ipnw/accessManager"),
  //  accessmanager: () => import("@/views/ipnw/accessManager"),
  //  entry: () => import("@/views/ipnw/accessManager/components/entry"),
  //  leave: () => import("@/views/ipnw/accessManager/components/leave"),
  //  elRecord: () => import("@/views/ipnw/accessManager/components/elRecord"),
  //  drAdvicemanage: () => import("@/views/ipnw/drAdviceManage/index"),
  //  drAdviceEdit: () =>
  //    import("@/views/ipnw/drAdviceManage/components/drAdviceEdit"),
  //  drAdviceExamine: () =>
  //    import("@/views/ipnw/drAdviceManage/components/drAdviceExamine"),
  //  patientList: () => import("@/views/ipnw/patientsList"),
  //  patientsList: () =>
  //    import("@/views/ipnw/patientsList/components/patientlist"),
  //
  //  // 退费处理
  //  returnProcess: () => import("@/views/ipnw/refundProcess/index"),
  //  // 退药处理
  //  returnDrug: () => import("@/views/ipnw/returnDrug/index"),
  //  // 一日清单
  // /* dailyInventory: () => import("@/views/ipnw/dailyInventory/index"),*/
  //  // 预交金查询
  //  queryDeposit: () => import("@/views/ipnw/queryDeposit/index"),
  //  // 费用管理
  //  expenseManager: () => import("@/views/ipnw/expenseManager/index"),
  //  // 催费查询
  //  queryArrearage: () => import("@/views/ipnw/queryArrearage/index"),


  // prescription: () => import("@/views/cis/order/index"),
  //patients: () => import("@/views/cis/visit/index"),


  finance: () =>
    import("@/views/outpatientCharge/finance/index"),
  files: () =>
    import("@/views/outpatientCharge/finance/files/index"),
  registration: () =>
    import("@/views/outpatientCharge/finance/registration/index"),
  appt: () =>
    import("@/views/outpatientCharge/finance/index"),
  outpCharge: () =>
    import("@/views/outpatientCharge/finance/outpCharge/index"),
  returnCharge: () =>
    import("@/views/outpatientCharge/finance/returnCharge/index"),
  retreat: () =>
    import("@/views/outpatientCharge/finance/retreat/index"),

  // 门诊护士站  START
  // 二级菜单 预约签到
  orderSign: () =>
    import("@/views/outpatientNurse/orderSign/index.vue"),
  // 三级菜单 签到分诊
  signtriage: () =>
    import("@/views/outpatientNurse/orderSign/signtriage/index.vue"),
  // 二级菜单 费用管理
  expenseManagement: () =>
    import("@/views/outpatientNurse/expenseManage/index.vue"),
  // 二级菜单 预检分诊
  // precheckTriage: () =>
  //   import("@/views/outpatientNurse/precheckTriage/index.vue"),
  // 门诊护士站  END

  //系统管理 START
  //排班系统二级菜单
  schedule: () =>
    import("@/views/systemManagement/schedule/index.vue"),
  //三级菜单 排班管理 and 排班列表
  scheduleManagement: () =>
    import("@/views/systemManagement/schedule/scheduleManagement"),
  scheduleList: () =>
    import("@/views/systemManagement/schedule/scheduleList"),
  scheduleByWeek: () =>
    import("@/views/systemManagement/schedule/scheduleManagement/indexNew.vue"),
  newScheduleByWeek: () =>
    import("@/views/systemManagement/schedule/scheduleManagement/indexNew2.vue"),
  scheduleMaintain: () =>
    import("@/views/systemManagement/schedule/scheduleManagement/schedulsParams.vue"),
  // 排班发布
  scheduleRelease: () => import("@/views/systemManagement/scheduleNew/scheduleRelease/indexNew.vue"),
  // 排班模板维护
  schedulingTemplate: () => import("@/views/systemManagement/schedule/scheduleManagement/schedulingTemplate.vue"),
  // 签到分诊
  signAndTriage: () => import("@/views/systemManagement/schedule/scheduleManagement/signAndTriage.vue"),
  //模板系统二级菜单
  templateSystem: () =>
    import("@/views/systemManagement/templateSystem/index.vue"),
  //三级菜单 处方模板 and 医嘱模板 and 诊断模板
  prescriptionTemplate: () =>
    import("@/views/systemManagement/templateSystem/prescriptionTemplate"),
  doctorAdviceTemplate: () =>
    import("@/views/systemManagement/templateSystem/doctorAdviceTemplate"),
  diagnosisTemplate: () =>
    import("@/views/systemManagement/templateSystem/diagnosisTemplate"),
  //系统管理 END

  // liya
  // 基本信息
  baseInfo: () =>
    import("@/views/patientManage/patientManage"),
  // EHR
  ehrSystem: () =>
    import("@/views/patientManage/ehrSystem"),
  // 诊疗闭环
  treatClosed: () =>
    import("@/views/patientManage/treatClosedLoop"),
  // 费用记录
  chargeManage: () =>
    import("@/views/patientManage/patientCharge"),
  // 卡档信息
  recordMessage: () =>
    import("@/views/patientManage/recordMessage"),
  //patientListPage: () => import("@/views/cis/visit/component/patientsList"),
  // ============================

  // ==================健康档案与公共维护管理===========================start
  // 公共卫生指标展示
  dashboard: () => import("@/views/phss/dashboard/"),
  //档案迁移
  docMigration: () => import("@/views/phss/doc_migration/doc_migration"),
  // 健康档案综合管理
  healthRecord: () => import("@/views/phss/IntegratedManagement/IMList"),
  IntegratedManagementInfo: () => import("@/views/phss/IntegratedManagement/IMInfo"),
  //家庭关系维护
  fmList: () => import("@/views/phss/familyMaintenance/FMList"),
  //行政列表首页
  regionList: () => import("@/views/phss/region/region_list"),
  // 医院管辖的行政区
  hosDistrict: () => import("@/views/phss/hos_district/hos_district"),
  //网格维护界面
  gridInformation: () => import("@/views/phss/grid_information/grid_information"),
  //慢性常用药品库管理
  drugManagementList: () => import("@/views/phss/drug_management/drug_management_list"),
  // 健康档案删除与恢复
  healthFileDeleteRecovery: () => import("@/views/phss/health_file_delete_recovery/health_file_delete_recovery"),
  // 责任医生变更
  changeResponsibleDoctor: () => import("@/views/phss/change_responsible_doctor/change_responsible_doctor"),
  // 签约协议模板管理
  signingAgreementTemplate: () => import("@/views/phss/signing_agreement_template/signing_agreement_template"),
  // 签约服务包管理
  signingService: () => import("@/views/phss/signing_service/signing_service"),
  // 签约医生团队管理
  signingDoctorGroup: () => import("@/views/phss/signing_doctor_group/signing_doctor_group"),
  // 分组人员管理
  groupManagement: () => import("@/views/phss/group_management/group_management"),




  // ==================健康档案与公共维护管理===========================end

  // 建档与变更
  filingAndChangeIndex: () =>
    import("@/views/filingAndChange/filingAndChangeindex/index.vue"),
  // EHR 健康档案  start======================
  eHrArchivesindex: () =>
    import("@/views/eHrArchives/eHrArchivesindex/index.vue"),
  // EHR 健康档案 end ====================


  /*患者主索引 start*/
  patientMaster: () =>
    import("@/views/patientMaster/index.vue"),

  //创建档案（三级）
  // recordCreate: () =>
  //   import("@/views/patientMaster/recordManage/recordCreate/index.vue"),
  recordCreate: () =>
    import("@/views/filingAndChange/filingAndChangeindex/index.vue"),
  //卡档信息（三级）
  cardsRecord: () =>
    import("@/views/patientMaster/cardsRecord/index.vue"),
  //费用信息（三级）
  costs: () =>
    import("@/views/patientMaster/costs/index.vue"),
  //ehr（三级）
  ehr: () =>
    import("@/views/patientMaster/ehr/index.vue"),
  //诊疗信息
  treatmentInfo: () =>
    import("@/views/patientMaster/treatmentInfor/index.vue"),
  //账户信息
  account: () =>
    import("@/views/patientMaster/account/index.vue"),
  /*患者主索引 end*/



  /********************************* 门急诊 START ***********************************/
  //  一级路由
  cisOne: () =>
    import("@/views/cis/index.vue"), //一级菜单

  //二级菜单
  cisSecond: () =>
    import("@/views/cis/prescriptionRecor/newVist/index.vue"), //二级菜单
  cisSecondList: () =>
    import("@/views/cis/prescriptionRecor/newVist/components/vistMain.vue"), //患者列表
  outpatientThree: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/index.vue"), //患者列表
  appointTriage: () =>
    import("@/views/cis/appointTriage/index.vue"), //预约分诊
  treatment: () =>
    import("@/views/cis/treatment/index.vue"), //治疗
  admApplication: () =>
    import("@/views/cis/admApplication/apply/index.vue"), //登记申请
  settleAccount: () =>
    import("@/views/cis/settleAccount/index.vue"), // 结算
  chargeReport: () =>
    import("@/views/report/charge/index.vue"), // 收费统计
  //三级菜单
  cisThree: () =>
    import("@/views/cis/prescriptionRecor/index.vue"), //病历处方
  // 患者列表取消
  //cis_patientsList: () => import("@/views/cis/prescriptionRecor/newVist/components/vistMain.vue"), //病历处方
  record: () =>
    import("@/views/cis/prescriptionRecor/index.vue"), //电子病历
  order: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/order/index.vue"), //医嘱
  elecApplications: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/elecApplications/index.vue"), //电子申请
  diagnosis: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/diagnosis/index.vue"), //诊断录入
  reportCenter: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/reportCenter/index.vue"), //报告中心
  leaveApplication: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/leaveApplication/index.vue"), //请假
  refund: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/refund/index2.vue"), //退费
  criticalValue: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/criticalValue/index.vue"), //危急值
  cis_allergy: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/allergy/index.vue"), //过敏
  groupConsultation: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/groupConsultation/index.vue"), //会诊

  opIntegratedEmr: () =>
    import("@/views/cis/integratedEmr/index.vue"),
  opIntroduction: () =>
    import("@/views/cis/integratedEmr/opEmr/introduction/index.vue"),
  opExamReport: () =>
    import("@/views/cis/integratedEmr/opEmr/examReport/index.vue"),
  opTestReport: () =>
    import("@/views/cis/integratedEmr/opEmr/testReport/index.vue"),
  opMedicalRec: () =>
    import("@/views/cis/integratedEmr/opEmr/medicalRec/index.vue"),
  opMedicalOrder: () =>
    import("@/views/cis/integratedEmr/opEmr/medicalOrder/index.vue"),

  apptdoctor: () =>
    import("@/views/cis/appointTriage/apptdoctor/index.vue"), //预约
  referral: () =>
    import("@/views/cis/appointTriage/referral/index.vue"), //转诊
  daySurgery: () =>
    import("@/views/cis/treatment/daySurgery/index.vue"), //日间手术
  infusion: () =>
    import("@/views/cis/treatment/infusion/index.vue"), //输液
  skinTest: () =>
    import("@/views/cis/treatment/outpatientNurse/skinTestExecution/index.vue"), //皮试执行
  infusionExec: () =>
    import("@/views/cis/treatment/outpatientNurse/infusionExecution/index.vue"), //输液执行
  injectionExec: () =>
    import("@/views/cis/treatment/outpatientNurse/InjectionExecution/index.vue"), //肌注执行
  treatmentExec: () =>
    import("@/views/cis/treatment/outpatientNurse/treatExecution/index.vue"), //治疗执行
  InspectionSampling: () =>
    import("@/views/cis/treatment/outpatientNurse/InspectionSampling/index.vue"), //检验采样
  registrationOne: () =>
    import('@/views/cis/appointTriage/registrationOne/index.vue'), // 挂号
  signIn: () =>
    import('@/views/cis/appointTriage/signIn/index.vue'), // 签到
  precheckTriage: () =>
    import('@/views/cis/appointTriage/precheckTriage/index.vue'), //预检
  triage: () =>
    import('@/views/cis/appointTriage/triage/index.vue'), // 分诊

  registered: () =>
    import("@/views/report/registered/index.vue"), //挂号统计
  cisOutpCharge: () =>
    import("@/views/cis/settleAccount/outpCharge/index"), //收费
  acceptsTheRegistration: () =>
    import("@/views/cis/acceptsTheRegistration/index"), //接诊登记
  ownMedicineReport: () =>
    import("@/views//cis/reports/ownMedicineReport.vue"), //自备药报表
  pstInquiry: () =>
    import("@/views/cis/pstInquiry/mainPage.vue"), //处方查询
  cisRetreat: () =>
    import("@/views/cis/settleAccount/retreat/index"), //退号
  cisReturnCharge: () =>
    import("@/views/cis/settleAccount/returnCharge/index"), //退费
  cisAdditionCost: () =>
    import("@/views/cis/settleAccount/additionCost/index"), //补费 手工划价
  baiDu: () =>
    import("@/views/cis/prescriptionRecor/newPatientsManage/baidu/baiduPage.vue"),
  // infectious: () =>
  //   import('@/views/public/infectious'),
  baokaReport: () => import("@/views/public/infectious/baokaReport.vue"), //报卡查漏界面
  reportForms: () => import('@/views/finance/reportForms/index'), //报表
  outQuantityReport: () => import('@/views/finance/reportForms/components/outQuantityReport'),
  medicalScreen: () => import("@/views/cis/medicalScreen/index.vue"), //诊前筛查界面
  /********************************* 门急诊 END ***********************************/

  /*
   *   ******************************家床 start***********************
   * */
  ipnw: () =>
    import("@/views/ipnw"),
  hosMange: () =>
    import("@/views/ipnw/etHospital"), // 家床管理 二级菜单
  patientlistentry: () =>
    import("@/views/ipnw/etHospital/components/patientsList"), // 家床管理(患者视图)
  arrangebed: () =>
    import("@/views/ipnw/etHospital/components/arrangeBed"), // 排床
  contractbed: () =>
    import("@/views/ipnw/etHospital/components/contractBed"), // 包床
  admRegistration: () =>
    import('@/views/ipnw/etHospital/admRegistration/index.vue'), // 家床登记
  createBedApply: () =>
    import('@/views/ipnw/etHospital/createBedApply/newIndex.vue'), // 建床申请
  changeBed: () =>
    import("@/views/ipnw/etHospital/components/changeBed"), // 转床
  leavehos: () =>
    import("@/views/ipnw/leaveHospital"), // 出院管理 二级菜单
  patientlistleave: () =>
    import("@/views/ipnw/leaveHospital/components/patientsList"), // 出院管理(患者视图)
  preDischarged: () =>
    import("@/views/ipnw/leaveHospital/components/preDischarged"), // 预出院
  inpatientarealeave: () =>
    import("@/views/ipnw/leaveHospital/components/inpatientArea"), // 病区出院
  patientrecall: () =>
    import("@/views/ipnw/leaveHospital/components/recall"), // 患者召回
  leavePay: () =>
    import("@/views/ipnw/leaveHospital/components/dischargeSettle/index.vue"), // 出院结算
  settlementList: () =>
    import("@/views/ipnw/leaveHospital/components/settlementList.vue"), // 结算清单

  nursing: () =>
    import("@/views/ipnw/nursing"), // 护理 二级菜单
  patientlistnursing: () =>
    import("@/views/ipnw/nursing/components/patientsList"), // 护理 (患者视图)
  temperature: () =>
    import("@/views/ipnw/nursing/temperatureList"), // 体温单
  temperatureMulti: () =>
    import("@/views/ipnw/nursing/temperatureList/temperatureMain.vue"), // 批量体温单
  nursingdoc: () =>
    import("@/views/ipnw/nursing/components/nursingDocuments"), // 护理文书
  advexamine: () =>
    import("@/views/ipnw/nursing/components/advExamine"), // 医嘱审核
  advedit: () =>
    import("@/views/ipnw/nursing/components/advEditing"), // 医嘱编辑
  drugapply: () =>
    import("@/views/ipnw/nursing/components/drugApply"), // 药品申请
  drAdvexecute: () =>
    import("@/views/ipnw/nursing/components/drAdvExecute"), // 医嘱执行
  changeshifts: () =>
    import("@/views/ipnw/nursing/components/changeShifts"), // 交接班
  transferbed: () =>
    import("@/views/ipnw/nursing/components/transferBedNew"), // 转科转床
  retreatMedcine: () =>
    import("@/views/ipnw/nursing/components/retreatMedcine.vue"), // 退药申请
  costCheck: () =>
    import("@/views/ipnw/nursing/components/costCheck.vue"), // 医嘱费用核对
  allergy: () =>
    import("@/views/ipnw/nursing/components/allergy"), // 过敏
  crisisval: () =>
    import("@/views/ipnw/nursing/components/crisisVal"), // 危急值
  constManagement: () =>
    import("@/views/ipnw/nursing/components/constManagement"), // 费用管理
  ipIntegratedEmr: () =>
    import("@/views/ipnw/IntegratedEmr/index.vue"),
  ipIntroduction: () =>
    import("@/views/ipnw/IntegratedEmr/introduction/index.vue"),
  ipMedicalRecord: () =>
    import("@/views/ipnw/IntegratedEmr/mecicalRecord/index.vue"),
  ipTestReport: () =>
    import("@/views/ipnw/IntegratedEmr/testReport/index.vue"),
  ipExamReport: () =>
    import("@/views/ipnw/IntegratedEmr/examReport/index.vue"),
  ipMedicalOrder: () =>
    import("@/views/ipnw/IntegratedEmr/medicalOrder/index.vue"),

  //病历医嘱 部分
  ipnw_patientList: () =>
    import("@/views/ipnw/medicalAdvice/patientList/index.vue"), // 患者列表
  orderRecord: () =>
    import("@/views/ipnw/medicalAdvice/index.vue"), // 病历医嘱 二级路由
  ipnw_diagnosis: () =>
    import("@/views/ipnw/medicalAdvice/diagnosis/index.vue"), // 诊断 三级路由
  ipnw_elecAppli: () =>
    import("@/views/ipnw/medicalAdvice/elecApplications/index.vue"), // 电子申请 三级路由
  ipnw_order: () =>
    import("@/views/ipnw/medicalAdvice/order/index.vue"), // 医嘱 三级路由
  ipnw_record: () =>
    import("@/views/ipnw/medicalAdvice/record/index.vue"), // 病历 三级路由
  ipnw_criticalValue: () =>
    import("@/views/ipnw/medicalAdvice/criticalValue/index.vue"), // 危急值管理 三级路由
  ipnw_groupConsultation: () =>
    import("@/views/ipnw/medicalAdvice/groupConsultation/index.vue"), // 会诊管理 三级路由
  ipnw_allergy: () =>
    import("@/views/ipnw/medicalAdvice/allergy/index.vue"), // 过敏管理 三级路由
  // 临床路径
  clinicalPath: () =>
    import('@/views/clinicalPath/index.vue'),
  // 家床报表
  inpReport: () =>
    import('@/views/finance/inp/report/index.vue'),


  //报卡
  // inpatientsInfectious: () =>
  //   import('@/views/public/infectious/inpatientsIndex'),
  /*
   *   *******************************家床 end***********************
   * */

  /*
   *   *******************************财务 start***********************
   * */
  // 财务一级菜单
  // finance: () => import("@/views/finance/index.vue"),
  finance_outpManager: () => import("@/views/finance/outpManager/index.vue"), // 门诊财务管理
  fin_pub: () => import("@/views/finance/pub/index.vue"), // 财务公共

  // 财务二级菜单
  finance_outp: () => import("@/views/finance/outp/index.vue"), // 门诊财务
  finance_inp: () => import("@/views/finance/inp/index.vue"), // 家床财务
  chargeAndRefund: () => import("@/views/finance/outp/chargeAndRefund/index.vue"), // 家床财务
  fin_receipt: () => import("@/views/finance/receiptManager/receiptParams.vue"), // 票据管理
  fin_receiptPrint: () => import("@/views/finance/receiptPrint/index.vue"), // 票据打印
  fin_receiptSelect: () => import("@/views/finance/receiptSelect/index.vue"), // 票据查询
  transactionFlow: () => import("@/views/finance/outp/transactionFlow/index.vue"), // 交易流水
  regFeeDetailEnquiry: () => import("@/views/finance/regFeeDetailEnquiry/index.vue"), // 挂号费明细查询
  finDictionary: () => import("@/views/finance/finDictionary/index.vue"), // 字典目录
  finItem: () => import("@/views/systemManagement/dataMaintain/index.vue"), // 基础数据财务项目二级菜单
  finPayType: () => import("@/views/finance/payType/index.vue"), //支付方式
  finChannelInfo: () => import("@/views/finance/channelInfo/index.vue"), //渠道信息
  orderRefundManage: () => import("@/views/finance/orderRefundManage/index.vue"), //医嘱类型
  prestoreCode: () => import("@/views/finance/outp/prestoreCode/index.vue"), // 预约代码
  prestore: () => import("@/views/finance/outp/prestore/index.vue"), // 预存账户
  grant: () => import("@/views/finance/outp/grant/index.vue"), // 绿色通道
  onlinePaySettlementDetail: () => import("@/views/finance/onlinePaySettlementDetail/index.vue"), // 线上支付结算明细
  errorLog: () => import("@/views/finance/errorLog/index.vue"), // 财务异常信息
  authPayType: () => import("@/views/finance/authPayType/index.vue"), // 支付方式授权

  // 财务三级菜单
  prestoreGrent: () => import("@/views/finance/outp/prestoreGrant/index.vue"), // 门诊绿色通道授权
  prestoreSel: () => import("@/views/finance/outp/prestoreGrantSel/index.vue"), // 门诊绿色通道授权查询
  inpGrant: () => import("@/views/finance/inp/grantOverdraw/index.vue"), // 家床绿色通道授权
  inpOrderItemChargeDetail: () => import("@/views/finance/inp/inpOrderItemChargeDetail/index.vue"), // 家床医嘱项目收费明细
  inpChargeItemChargeDetail: () => import("@/views/finance/inp/inpChargeItemChargeDetail/index.vue"), // 家床收费项目收费明细表
  inpPatientSel: () => import("@/views/finance/inp/inpPatientSel/index.vue"), // 家床 家床患者查询
  inpPrepay: () => import("@/views/finance/inp/inpPrepay/index.vue"), // 家床 家床预缴金
  inpPrepayRefund: () => import("@/views/finance/inp/inpPrepayRefund/index.vue"), // 家床 家床预缴金退款
  inpPrepayDetail: () => import("@/views/finance/inp/inpPrepayDetail/index.vue"), // 家床 家床预缴金明细查询
  finOut_receiptPrint: () => import("@/views/finance/inp/inBills/index.vue"), // 家床票据打印

  finClassCode: () => import("@/views/systemManagement/dataMaintain/module/financeCode/index.vue"), // 财务分类码
  finChargeItem: () => import("@/views/systemManagement/dataMaintain/module/payItems/index.vue"), // 财务收费项目维护
  payItemsGroup: () => import("@/views/systemManagement/dataMaintain/module/payItemsGroup/index.vue"), // 集团财务收费项目维护
  // 门诊财务
  outpChargeNew: () => import("@/views/finance/outp/outpCharge/index.vue"), // 门诊-结算（独立页面）
  outpOrderChargeDetail: () => import("@/views/finance/outp/outpOrderChargeDetail/index.vue"), //门诊医嘱费用明细表(新增）
  thirdPayment: () => import("@/views/finance/outp/thirdPayment/index.vue"), //第三方支付
  outpChargeDetailNew: () => import("@/views/finance/outp/outpChargeDetailNew/index.vue"), //门诊交易明细（新增)
  sumOutpChargeDetailNew: () => import("@/views/finance/outp/sumOutpChargeDetailNew/index.vue"), //诊疗门诊交易明细（新增)
  prestoreDetail: () => import("@/views/finance/outp/prestore/prestoreDetail/index.vue"), //预存明细
  prestoreConsumeDetail: () => import("@/views/finance/outp/prestore/prestoreConsumeDetail/index.vue"), //预存消费明细
  prestoreAccount: () => import("@/views/finance/outp/prestore/prestoreAccount/index.vue"), //预存账户信息
  prestoreFreezeDetail: () => import("@/views/finance/outp/prestore/prestoreFreezeDetail/index.vue"), // 预存冻结
  /*
   *   *******************************财务 end***********************
   * */

  // 预约业务 --start
  appointment: () => import("@/views/appointment/index.vue"), //管理预约
  outpatientAppointment: () => import("@/views/appointment/outpatientAppointment/index.vue"), //门诊预约
  appointmentList: () => import("@/views/appointment/outpatientAppointment/appointmentList.vue"),
  appointmentOrder: () => import("@/views/appointment/outpatientAppointment/appointmentOrderNew"),
  // 预约业务 --end

  // 预约管理 --start
  appt_manager: () => import("@/views/appointment/apptManager/index.vue"), // 预约管理
  registrationItem: () => import('@/views/appointment/apptManager/registrationItem/index.vue'), // 挂号项目维护
  apptDict: () => import('@/views/appointment/apptManager/apptDict/index.vue'), // 预约字典管理
  crossDeptChgTriage: () => import('@/views/appointment/apptManager/crossDeptChgTriage/index.vue'), // 跨部门换诊配置信息维护
  rediagSetting: () => import('@/views/appointment/apptManager/rediagSetting/index.vue'), // 回诊配置信息维护
  queueChangeLog: () => import('@/views/appointment/apptManager/queueChangeLog/index.vue'), // 门诊预约队列 日志表
  rediagLogInfo: () => import('@/views/appointment/apptManager/rediagLogInfo/index.vue'), // 回诊日志表


  // 预约管理 --end

  /*********************************药房药库 start************************/
  // 一级路由
  drugManagement: () =>
    import("@/views/drugManagement/index.vue"),

  // 药库库存管理
  drugstock: () =>
    import("@/views/drugManagement/drugstock/index.vue"),
  // 药库采购
  drugPurchase: () =>
    import("@/views/drugManagement/drugstock/purchase/index.vue"),
  // 药库入库
  drugWarehousing: () =>
    import("@/views/drugManagement/drugstock/warehousing/index.vue"),
  // 药库出库
  drugOutStock: () =>
    import("@/views/drugManagement/drugstock/outStock/index.vue"),
  // 药库退回
  drugRenturn: () =>
    import("@/views/drugManagement/drugstock/renturn/index.vue"),
  // 药房退货处理
  drugReturnDispose: () =>
    import("@/views/drugManagement/drugstock/returnDispose/index.vue"),
  // 库房调价
  adjustPrice: () =>
    import("@/views/drugManagement/drugstock/adjustPrice/index.vue"),


  //药房库存管理
  pharmacyStock: () =>
    import("@/views/drugManagement/pharmacyStock/index.vue"),
  // 药品申请
  pharmacyAppliy: () =>
    import("@/views/drugManagement/pharmacyStock/drugAppliy/index.vue"),
  // 药房入库
  phdrugWarehousing: () =>
    import("@/views/drugManagement/pharmacyStock/warehousing/index.vue"),
  // 药房出库
  phdrugOutStock: () =>
    import("@/views/drugManagement/pharmacyStock/outStock/index.vue"),
  // 药房采购
  phdrugPurchase: () =>
    import("@/views/drugManagement/pharmacyStock/purchase/index.vue"),
  // 入库确认
  wareConfirm: () =>
    import("@/views/drugManagement/pharmacyStock/wareConfirm/index.vue"),
  // 药房出库
  outPharmacy: () =>
    import("@/views/drugManagement/pharmacyStock/outPharmacy/index.vue"),

  // 门诊发药管理
  prescriptionDispensing: () =>
    import("@/views/drugManagement/prescriptionDispensing/index.vue"),
  // 处方预配方
  prePrescription: () =>
    import("@/views/drugManagement/prescriptionDispensing/prePrescription/index.vue"),
  // 处方发药
  preDrugs: () =>
    import("@/views/drugManagement/prescriptionDispensing/preDrugs/index.vue"),
  // 处方查询
  preQuery: () =>
    import("@/views/drugManagement/prescriptionDispensing/preQuery/index.vue"),
  // 处方申请退药
  preDrugReturn: () =>
    import("@/views/drugManagement/prescriptionDispensing/preDrugReturn/index.vue"),
  // 处方审核
  preReview: () =>
    import("@/views/drugManagement/prescriptionDispensing/preReview/index.vue"),
  // 审核反馈
  preFeedback: () =>
    import("@/views/drugManagement/prescriptionDispensing/preFeedback/index.vue"),
  // 审核工作量统计
  reviewWorkload: () => import("@/views/drugManagement/prescriptionDispensing/reviewWorkload/index.vue"),
  // 处方抽查
  preCheck: () =>
    import("@/views/drugManagement/prescriptionDispensing/preCheck/index.vue"),
  // 家床发药管理
  hospitalDispensing: () =>
    import("@/views/drugManagement/hospitalDispensing/index.vue"),
  //家床医嘱发药
  hospitalPills: () =>
    import("@/views/drugManagement/hospitalDispensing/hospitalPills/index.vue"),
  //家床发药查询
  hospitalList: () =>
    import("@/views/drugManagement/hospitalDispensing/hospitalList/index.vue"),
  //家床发药退药
  hospitalReturn: () =>
    import("@/views/drugManagement/hospitalDispensing/hospitalReturn/index.vue"),

  // 盘存管理
  takeInventory: () =>
    import("@/views/drugManagement/takeInventory/index.vue"),
  // 盘存模板维护
  inventoryTemplate: () =>
    import("@/views/drugManagement/takeInventory/inventoryTemplate/index.vue"),
  // 盘存设定
  inventorySet: () =>
    import("@/views/drugManagement/takeInventory/inventorySet/index.vue"),
  // 盘存窗口输入
  inventoryWindow: () =>
    import("@/views/drugManagement/takeInventory/inventoryWindow/index.vue"),
  // 盘存汇总输入
  inventoryCollect: () =>
    import("@/views/drugManagement/takeInventory/inventoryCollect/index.vue"),
  // 盘存结果查询
  inventoryResult: () =>
    import("@/views/drugManagement/takeInventory/inventoryResult/index.vue"),


  // 基础数据维护
  drugData: () =>
    import("@/views/drugManagement/drugData/index.vue"),
  // 药品信息维护
  drugInfoMaintain: () =>
    import("@/views/drugManagement/drugData/drugInfoMaintain/index.vue"),
  // 集团（租户）药品信息维护
  GroupDrug: () =>
    import("@/views/drugManagement/drugData/GroupDrug/index.vue"),
  // 库存查询维护
  maintain: () =>
    import("@/views/drugManagement/drugData/maintain/index.vue"),
  //招标药品维护
  tender: () =>
    import("@/views/drugManagement/drugData/tender/index"),
  //库房对照
  warehouseControl: () =>
    import("@/views/drugManagement/drugData/warehouseControl/index"),
  //皮试药品维护
  STdrug: () =>
    import("@/views/drugManagement/drugData/STdrug/index"),
  // 用药频率维护
  medicationFrequency: () => import('@/views/drugManagement/drugData/medicationFrequency/index'),
  //药品位置信息
  location: () =>
    import("@/views/drugManagement/drugData/location/index"),
  //药库信息
  stockMaintenance: () =>
    import("@/views/drugManagement/drugData/stockMaintenance/index"),
  //药房信息维护
  pharmacyMaintenance: () => import("@/views/drugManagement/drugData/pharmacyMaintenance/index"),
  // 附加属性维护
  additionalAttrMaintenance: () => import("@/views/drugManagement/drugData/additionalAttrMaintenance/index"),
  //工作时间维护
  workTime: () =>
    import("@/views/drugManagement/drugData/workTime/index"),
  // 库房品种维护
  drugMaintenance: () => import("@/views/drugManagement/drugData/drugMaintenance/index"),
  // 剂型维护
  dosageMaintain: () => import("@/views/drugManagement/drugData/dosageMaintain/index"),
  // 位置大类维护
  locationCategory: () => import("@/views/drugManagement/drugData/locationCategory/index"),
  // 机器药品维护
  machineMedicine: () => import("@/views/drugManagement/drugData/machineMedicine/index"),
  /**
   * 查询统计start
   */
  // 查询统计
  queryStatistics: () => import("@/views/drugManagement/queryStatistics/index"),
  // 库存汇总统计
  stockStats: () => import('@/views/drugManagement/queryStatistics/stockStats/index'),
  // 药房库存统计
  queryStats: () => import('@/views/drugManagement/queryStatistics/queryStats/index'),
  // 台账查询
  ledgerInquiry: () => import('@/views/drugManagement/queryStatistics/ledgerInquiry/index'),
  // 近效期药品查询
  nearEffective: () => import("@/views/drugManagement/queryStatistics/nearEffective/index"),
  // 高低储
  stockMaxMin: () => import('@/views/drugManagement/queryStatistics/stockMaxMin/index'),
  // 各类出库明细查询
  outStorageList: () => import("@/views/drugManagement/queryStatistics/outStorageList/index"),
  // 各类入库明细查询
  inStorageList: () => import("@/views/drugManagement/queryStatistics/inStorageList/index"),
  // 药库月明细报表
  pharmacyMonthly: () => import("@/views/drugManagement/queryStatistics/pharmacyMonthly/index"),

  // 2020/11/16/
  // 特殊药品使用情况统计   specialDrugs
  specialDrugs: () => import("@/views/drugManagement/queryStatistics/specialDrugs/index"),
  // 药品阶段性销售统计   specialDrugs
  pssOfDrugs: () => import("@/views/drugManagement/queryStatistics/pssOfDrugs/index"),
  // 门诊基本药物使用情况统计   outpatient clinics
  outpatientClinics: () => import("@/views/drugManagement/queryStatistics/outpatientClinics/index"),
  // 门诊配送药品金额统计 (配送药品统计)
  odDdrugsAmo: () => import("@/views/drugManagement/queryStatistics/odDdrugsAmo/index"),
  // 4+7药品使用情况统计
  sonDrugUse: () => import("@/views/drugManagement/queryStatistics/sonDrugUse/index"),
  // 处方费别统计  prescriptionFeeStat
  prescriptionFeeStat: () => import("@/views/drugManagement/queryStatistics/prescriptionFeeStat/index"),
  // 免费“4+7”药品发放量统计表   Statistical table of drug distribution  staisTableDrugDistribution
  staisTableDrugDis: () => import("@/views/drugManagement/queryStatistics/staisTableDrugDis/index"),
  //  长处方统计表 （汇总）
  staOfDisDrugs: () => import("@/views/drugManagement/queryStatistics/staOfDisDrugs/index"),
  //  长处方统计表 （明细）
  staOfDisDrugsDetail: () => import("@/views/drugManagement/queryStatistics/staOfDisDrugsDetail/index"),
  //药品发药情况统计
  drugDistributionStatistics: () => import("@/views/drugManagement/queryStatistics/drugDistributionStatistics/index"),

  // 2020/11/16/

  /**
   * end
   */
  /* *******************************药房药库 end*************************/

  /* *******************************护理文书 start*************************/
  //一级菜单
  nursingRecord: () => import("@/views/nursingRecord/nursingDocuments"),
  //二级菜单
  //文书权限维护
  authorityMaintain: () => import("@/views/nursingRecord/authorityMaintain/index"),
  //文书分类维护
  classifyMaintain: () => import("@/views/nursingRecord/classifyMaintain/index"),
  //文书维护
  docInfoMaintain: () => import("@/views/nursingRecord/docInfoMaintain/index"),
  //元素维护
  elementMaintain: () => import("@/views/nursingRecord/elementMaintain/index"),
  //文书预览
  maintenanceDocument: () => import("@/views/nursingRecord/maintenanceDocument/index"),
  //文书列表
  documentOperate: () => import("@/views/nursingRecord/documentOperate/index"),
  //文书录入
  docRecord: () => import("@/views/nursingRecord/docRecord"),

  //文书模板
  docTemplate: () => import("@/views/nursingRecord/docTemplate/docTemplate"),
  //特殊字符维护
  characterMaintain: () => import("@/views/nursingRecord/characterMaintain/index"),
  /* *******************************护理文书 end*************************/
  /* *******************************体温单 start*************************/
  //一级菜单
  tempMaintain: () => import("@/views/public/temperature/indexMaintain"),
  //二级菜单
  //体温单项目维护
  tempPro: () => import("@/views/public/temperature/item"),
  //体温单样式维护
  tempStyle: () => import("@/views/public/temperature/index"),
  //体温单项目样式关系维护
  tempRelation: () => import("@/views/public/temperature/relation"),
  //体温单图章维护
  tempStamp: () => import("@/views/public/temperature/seal"),
  //体温单科室关系维护
  depRelation: () => import("@/views/public/temperature/depRelation"),
  //体温单选项维护
  tempOption: () => import("@/views/public/temperature/option"),
  //体温单选项项目关系维护
  tempItemOption: () => import("@/views/public/temperature/itemOptionRelation"),
  //体温单样式配置维护
  allocatStyle: () => import("@/views/public/temperature/allocatStyle"),
  /* *******************************体温单 end*************************/

  /**
   * 医保管理 -start*/
  medicalInsurance: () => import('@/views/medicalInsurance/index.vue'),
  // 基础数据管理
  basicData: () => import('@/views/medicalInsurance/basicData/index.vue'),
  // 疾病信息查询
  diseaseInfo: () => import('@/views/medicalInsurance/basicData/diseaseInfo/index.vue'),
  // 医保项目查询
  itemInfo: () => import('@/views/medicalInsurance/basicData/itemInfo/index.vue'),
  // 诊疗项目查询
  clinicItems: () => import('@/views/medicalInsurance/basicData/clinicItems/index.vue'),
  // 行政区划查询
  administrativeDivision: () => import('@/views/medicalInsurance/basicData/administrativeDivision/index.vue'),
  // 医师信息查询
  physicianInfo: () => import('@/views/medicalInsurance/basicData/physicianInfo/index.vue'),
  // 基础数据下载
  basicDataDownload: () => import('@/views/medicalInsurance/basicData/basicDataDownload/index.vue'),
  // 三大目录对照
  directoryComparison: () => import('@/views/medicalInsurance/basicData/directoryComparison/index.vue'),
  // 医师信息查询/上传
  physicianInfoUpload: () => import('@/views/medicalInsurance/basicData/physicianInfoUpload/index.vue'),
  // 业务管理
  business: () => import('@/views/medicalInsurance/business/index.vue'),
  // 签到数据
  checkInData: () => import('@/views/medicalInsurance/business/checkInData/index.vue'),
  // 签到/签退
  signInCheckOut: () => import('@/views/medicalInsurance/business/signInCheckOut/index.vue'),
  // 门诊结算
  outpatientSettlement: () => import('@/views/medicalInsurance/business/outpatientSettlement/index.vue'),
  // 家床明细上传
  hospitalizationDetails: () => import('@/views/medicalInsurance/business/hospitalizationDetails/index.vue'),
  // 两定机构对账
  institutionalReconciliation: () => import('@/views/medicalInsurance/business/institutionalReconciliation/index.vue'),
  // 操作员对账
  operatorReconciliation: () => import('@/views/medicalInsurance/business/operatorReconciliation/index.vue'),
  // 医保交易查询
  transactionInquiry: () => import('@/views/medicalInsurance/business/transactionInquiry/index.vue'),
  // 医保对账
  healthCheck: () => import('@/views/medicalInsurance/business/healthCheck/index.vue'),
  // 家床费用明细上传
  detailsUpload: () => import('@/views/medicalInsurance/business/detailsUpload/index.vue'),
  // 医保字典维护
  dictionaryManage: () => import('@/views/medicalInsurance/dictionaryManage/index.vue'),
  // 医保字典目录
  catalog: () => import('@/views/medicalInsurance/dictionaryManage/catalog/index.vue'),
  // 医保字典
  dictionary: () => import('@/views/medicalInsurance/dictionaryManage/dictionary/index.vue'),
  // 医保字典对照
  dictContrast: () => import('@/views/medicalInsurance/dictionaryManage/dictContrast/index.vue'),
  // 上传明细查询
  uploadDetails: () => import('@/views/medicalInsurance/uploadDetails/index.vue'),
  // 门诊上传明细查询
  outPatient: () => import('@/views/medicalInsurance/uploadDetails/outPatient/index.vue'),// 门诊上传明细查询
  patientHealthInfo: () => import('@/views/medicalInsurance/patientHealthInfo/index.vue'),//患者医保信息查询
  // 日志数据
  siLogData: () => import('@/views/medicalInsurance/business/siLogData/index.vue'),

  // 新医保
  medicalInsuranceNew: () => import('@/views/medicalInsurance/index.vue'),
  // 医保患者信息查询
  patientHealthInfoNew: () => import("@/views/medicalInsuranceNew/patientHealthInfo/index.vue"),
  // 基础数据管理
  basicDataNew: () => import('@/views/medicalInsurance/basicData/index.vue'),
  // 基础数据下载
  basicDataDownloadNew: () => import('@/views/medicalInsurance/basicData/basicDataDownload/index.vue'),
  // 医保签到管理
  signInManagementNew: () => import('@/views/medicalInsuranceNew/signInManagement/index.vue'),
  // 特慢病备案
  slowDiseaseNew: () => import('@/views/medicalInsuranceNew/slowDisease/index.vue'),
  // 医保特慢病备案
  slowDiseaseQuery: () => import('@/views/medicalInsuranceNew/slowDiseaseQuery/index.vue'),
  // 医保人员定点信息
  personnelFixedPointInfo: () => import('@/views/medicalInsuranceNew/personnelFixedPointInfo/index.vue'),
  // 科室信息上传
  departInfo: () => import('@/views/medicalInsuranceNew/departInfo/index.vue'),
  // 人员转院备案
  personnelTransfer: () => import('@/views/medicalInsuranceNew/personnelTransfer/index.vue'),
  // 人员定点备案
  personnelFixedPoint: () => import('@/views/medicalInsuranceNew/personnelFixedPoint/index.vue'),
  // 业务管理
  businessNew: () => import('@/views/medicalInsurance/business/index.vue'),
  // 医保对账
  accountCheck: () => import('@/views/medicalInsuranceNew/accountCheck/index.vue'),
  // 第三方对账
  thirdAccountCheck: () => import('@/views/medicalInsuranceNew/thirdAccountCheck/index.vue'),
  /**
   * 医保管理 -end*/

  /* *******************************基础数据 start*************************/
  // 基础数据一级菜单
  dataMaintain: () => import("@/views/systemManagement/dataMaintain/index.vue"),

  // 医嘱目录维护二级菜单
  dataOrderList: () => import("@/views/systemManagement/dataMaintain/module/orderList/index.vue"),

  // 医嘱项目 三级菜单
  dataOrderItem: () => import("@/views/systemManagement/dataMaintain/module/orderList/oderItem/index.vue"),
  // 医嘱大类 三级菜单
  dataOrderBig: () => import("@/views/systemManagement/dataMaintain/module/orderList/odersBig/index.vue"),
  // 医嘱子类 三级菜单
  dataOrderSubclass: () => import("@/views/systemManagement/dataMaintain/module/orderList/OrderSubclass/index.vue"),
  //用法关联附加医嘱
  dataRelationModule: () => import(
    "@/views/systemManagement/dataMaintain/module/orderList/relationModule/indexView.vue"),
  //角色医嘱授权
  dataRoleAuthorization: () => import(
    "@/views/systemManagement/dataMaintain/module/orderList/roleAuthorization/indexView.vue"),

  // 电子申请目录维护 二级菜单
  secondElectronicList: () => import("@/views/systemManagement/dataMaintain/module/electronicList/index.vue"),
  // 检查检验目录维护
  thirdCheckModule: () => import(
    "@/views/systemManagement/dataMaintain/module/electronicList/checkModule/indexView.vue"),

  //疾病诊断与手术 二级菜单
  secondDiseaseList: () => import("@/views/systemManagement/dataMaintain/module/diseaseDicList/index.vue"),
  //疾病字典维护  三级菜单
  thirdDiseaseDictionary: () => import(
    "@/views/systemManagement/dataMaintain/module/diseaseDicList/diseaseDictionaryModule/indexView.vue"),
  //中医症候 三级菜单
  TCMSyndrome: () => import("@/views/systemManagement/dataMaintain/module/diseaseDicList/TCMmodule/indexView.vue"),
  //疾病字典维护 三级菜单
  thirdDiseaseRelation: () => import(
    "@/views/systemManagement/dataMaintain/module/diseaseDicList/diseaseDictRelation/indexView.vue"),
  /* *******************************基础数据 end*************************/

  /* ******************************* 业务管理与配置 start*************************/
  // 业务管理与配置一级菜单
  oneManageConfig: () => import("@/views/systemManagement/manageConfig/index.vue"),

  // 业务管理与配置二级菜单
  //医生站管理
  secondDoctorManage: () => import("@/views/systemManagement/manageConfig/doctorManage/index.vue"),
  //药房药库管理
  secondDrugRoomManage: () => import("@/views/systemManagement/manageConfig/drugRoomManage/index.vue"),
  //病区管理
  secondWardManage: () => import("@/views/systemManagement/manageConfig/wardManage/index.vue"),
  //排班管理
  secondWorkForceManage: () => import("@/views/systemManagement/manageConfig/workForceManage/index.vue"),

  /* ******************************* 业务管理与配置 end*************************/

  /* ******************************* 文书模板维护 start*************************/
  mrMgr: () =>
    import("@/views/cis/index.vue"),
  //电子病历-片段模板管理
  sectionTmplMgr: () => import("@/views/emrRecord/DocTempMaintenance/sectionTmplMgr.vue"),
  //电子病历-模板管理
  mrTmplMgr: () => import("@/views/emrRecord/DocTempMaintenance/mrTmplMgr.vue"),
  //文书类型组维护
  mrTpMgr: () => import("@/views/emrRecord/DocTempMaintenance/mrTpMgr.vue"),
  //电子病历-元素管理
  elementMgr: () => import("@/views/emrRecord/DocTempMaintenance/elementMgr.vue"),
  //电子病历-数据元管理
  dataELementMgr: () => import("@/views/emrRecord/DocTempMaintenance/dataELementMgr.vue"),
  //电子病历-基础模板管理
  baseMrTmplMgr: () => import("@/views/emrRecord/DocTempMaintenance/baseMrTmplMgr.vue"),
  //可替换文书类型维护
  mrTpReplaceableMgr: () => import("@/views/emrRecord/DocTempMaintenance/mrTpReplaceableMgr.vue"),
  // 管理计划维护
  managePlan: () => import("@/views/emrRecord/DocTempMaintenance/managePlan.vue"),
  // 健康处方维护
  healthPrescribe: () => import("@/views/emrRecord/DocTempMaintenance/healthPrescribe.vue"),

  // 历史就诊
  historyVisit: () => import("@/views/emrRecord/DocTempMaintenance/historyVisit.vue"),
  /* ******************************* 文书模板维护 end*************************/

  /* ******************************* 字典维护  START*************************/
  dictionaryManagement: () =>
    import("@/views/emrRecord/dictionary/index.vue"),
  // 特殊字符管理
  specialSymbolManagement: () =>
    import("@/views/emrRecord/dictionary/specialSymbol/index.vue"),
  //  敏感词维护
  sensitiveWordsManagement: () =>
    import("@/views/emrRecord/dictionary/sensitiveWordsManagement/index.vue"),
  // 图片维护
  imageManagement: () =>
    import("@/views/emrRecord/dictionary/imageManagement/index.vue"),
  // 病种维护
  diseaseManagement: () =>
    import("@/views/emrRecord/dictionary/diseaseManagement/index.vue"),
  mrGrade: () =>
    import("@/views/emrRecord/dictionary/MedRecLvl.vue"),
  //  知识库维护
  knowledgeBaseMaintenance: () =>
    import("@/views/emrRecord/dictionary/knowledgeBase/index.vue"),
  // 系统参数配偶
  systemParams: () =>
    import("@/views/emrRecord/dictionary/SystemParam.vue"),
  /* ******************************* 字典维护  END*************************/

  /******************************** 物资管理  START*************************/
  /*一级*/
  materialManagement: () => import("@/views/materialManagement/index.vue"),
  /*二级*/
  materialDictionary: () => import("@/views/materialManagement/materialDictionary/index.vue"),
  materielStorage: () => import("@/views/materialManagement/materielStorage/index.vue"),
  /*三级*/
  materialItem: () => import("@/views/materialManagement/materialDictionary/materialItem/index.vue"),
  stockCheck: () => import("@/views/materialManagement/materielStorage/stockCheck/index.vue"),
  materielPutIn: () => import("@/views/materialManagement/materielStorage/materielPutIn/index.vue"),
  materialDeliver: () => import("@/views/materialManagement/materielStorage/materialDeliver/index.vue"),
  /******************************** 物资管理  END*************************/

  /* ******************************* 家庭病床  START*************************/

  //家床诊疗
  hsDiagTreat: () => import("@/views/homeSickbeds/hsDiagTreat/index.vue"),
  // 家床发药
  bedMedicine: () => import("@/views/drugManagement/bedMedicine/index.vue"),
  // 家床退药
  bedWithdrawal: () => import("@/views/drugManagement/bedWithdrawal/index.vue"),
  // 病人管理
  patientManagement: () => import("@/views/homeSickbeds/hsPatientManagement/index.vue"),
  // 遗嘱执行
  hsWillperform: () => import("@/views/homeSickbeds/hsWillperform/index.vue"),
  // 护理工作站-发热登记
  temperatureMeasure: () => import("@/views/homeSickbeds/temperatureMeasure/index.vue"),
  // 家床病历
  homeBedRecord: () => import("@/views/emrRecord/index.vue"),
  homeBedRecordPage: () => import("@/views/emrRecord/emr/homeBedRecord/index.vue"),
  // 待书写文书列表
  waitWriteRecord: () => import("@/views/emrRecord/emr/waitWriteRecordList/index.vue"),
  // 住院病历维护申请
  inRecordMaintenanceApply: () => import("@/views/emrRecord/emr/recordMaintenanceApply/index.vue"),
  // 住院病历维护审核
  inRecordMaintenanceApplyApprove: () => import("@/views/emrRecord/emr/recordMaintenanceApply/index.vue"),
  // 门诊病历维护申请
  outRecordMaintenanceApply: () => import("@/views/emrRecord/emr/recordMaintenanceApply/index.vue"),
  // 门诊病历维护审核
  outRecordMaintenanceApplyApprove: () => import("@/views/emrRecord/emr/recordMaintenanceApply/index.vue"),
  /* ******************************* 家庭病床  END*************************/

}

export default componentsRouter
