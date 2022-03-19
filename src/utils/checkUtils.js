// 判断是否为空
var notNullData = {
  HealthChecklistPage1: [
    { key: "checkup_date", desc: "体检日期" },
    { key: "responsibility_doctor", desc: "责任医生" }
  ],
  ResidentHealthRecordPage1: [
    { key: "exec_dr", desc: "执行医生" },
    { key: "pap_doc_no", desc: "纸质档案编号" },
    { key: "rsdt_name", desc: "姓名" },
    { key: "current_address", desc: "现住地址" },
    { key: "hshd_rgst_addr", desc: "户籍地址" },
    { key: "orgGrid", desc: "村(居)委会-网格"},
    { key: "responsible_dr_id", desc: "责任医生"},
    { key: "create_doc_date", desc: "建档时间"}
  ],
  ResidentHealthRecordPage2: [
    { key: "gender", desc: "性 别"},
    { key: "birthday", desc: "出生日期"},
    { key: "id_no", desc: "身份证号"}
 ],
 // 糖尿病随访服务记录
 DocFlpDiabetesPage1: [
    { key: "follow_up_date", desc: "随访日期"},
    { key: "follow_up_type", desc: "随访方式"},
    { key: "next_follow_up_date", desc: "下次随访日期"},
    { key: "follow_up_doctor", desc: "随访医生签名"}
 ],
 // 高血压患者随访服务记录
 HypertensionFlpPage1: [
    { key: "follow_up_date", desc: "随访日期"},
    { key: "follow_up_type", desc: "随访方式"},
    { key: "next_follow_up_date", desc: "下次随访日期"},
    { key: "follow_up_doctor", desc: "随访医生签名"}
 ],
 //老年人生活自理能力评估
 DocSelfcarePage1: [
   { key: "dining_score", desc: "进餐评分"},
   { key: "grooming_score", desc: "梳洗评分"},
   { key: "dressing_score", desc: "穿衣评分"},
   { key: "toileting_score", desc: "如厕评分"},
   { key: "movement_score", desc: "活动评分"}
 ],
 // 老年人中医药健康管理服务记录
 DocCmHlthMngmtPage1: [
  { key: "question_1", desc: "(1)项"},
  { key: "question_2", desc: "(2)项"},
  { key: "question_3", desc: "(3)项"},
  { key: "question_4", desc: "(4)项"},
  { key: "question_5", desc: "(5)项"},
  { key: "question_6", desc: "(6)项"},
  { key: "question_7", desc: "(7)项"},
  { key: "question_8", desc: "(8)项"},
  { key: "question_9", desc: "(9)项"},
  { key: "question_10", desc: "(10)项"},
  { key: "question_11", desc: "(11)项"},
  { key: "question_12", desc: "(12)项"},
  { key: "question_13", desc: "(13)项"}
 ],
 DocCmHlthMngmtPage2: [
  { key: "question_14", desc: "(14)项"},
  { key: "question_15", desc: "(15)项"},
  { key: "question_16", desc: "(16)项"},
  { key: "question_17", desc: "(17)项"},
  { key: "question_18", desc: "(18)项"},
  { key: "question_19", desc: "(19)项"},
  { key: "question_20", desc: "(20)项"},
  { key: "question_21", desc: "(21)项"},
  { key: "question_22", desc: "(22)项"},
  { key: "question_23", desc: "(23)项"},
  { key: "question_24", desc: "(24)项"},
  { key: "question_25", desc: "(25)项"},
  { key: "question_26", desc: "(26)项"},
  { key: "question_27", desc: "(27)项"},
  { key: "question_28", desc: "(28)项"}
 ],
 DocCmHlthMngmtPage3: [
  { key: "question_29", desc: "(29)项"},
  { key: "question_30", desc: "(30)项"},
  { key: "question_31", desc: "(31)项"},
  { key: "question_32", desc: "(32)项"},
  { key: "question_33", desc: "(33)项"},
  { key: "responsibility_doctor", desc: "医生签名"},
  { key: "checkup_date", desc: "填表日期"}
 ],
 //肺结核患者第一次入户随访记录表1
 DocFlpTbclssFirstPage1: [
   { key: "follow_up_date", desc: "随访时间"},
   { key: "follow_up_type", desc: "随访方式"},
   { key: "next_follow_up_date", desc: "下次随访日期"},
   { key: "follow_up_doctor", desc: "随访医生签名"}
 ],
 //肺结核患者第一次入户随访记录表1
 DocFlpTbclssFollowPage1: [
   { key: "follow_up_date", desc: "随访时间"},
   { key: "follow_up_type", desc: "随访方式"},
   { key: "next_follow_up_date", desc: "下次随访日期"},
   { key: "follow_up_doctor", desc: "随访医生签名"}
 ],
 //严重精神障碍患者随访服务记录表
 DocFlpMentalFollowPage1: [
   { key: "follow_up_date", desc: "随访时间"},
   { key: "follow_up_type", desc: "随访方式"},
   { key: "next_follow_up_date", desc: "下次随访日期"},
   { key: "follow_up_doctor", desc: "随访医生签名"}
 ],
 //严重精神障碍患者个人信息补充表
 DocFlpMentalPersonalpage1: [
   { key: "fill_date", desc: "填表日期"},
   { key: "doctor_name", desc: "医生签字"}
 ]
};
export function checkNotNull(TableForm, key) {
  console.log('---------------------',key)
  var message = "";
  if (notNullData[key] == null || notNullData[key] == "") {
    return "";
  }
  for (let i = 0; i < notNullData[key].length; i++) {
    if (
      TableForm[notNullData[key][i].key] == "" ||
      TableForm[notNullData[key][i].key] == null
    ) {
      if (message == "") {
        message = notNullData[key][i].desc;
      } else {
        message += "," + notNullData[key][i].desc;
      }
    }
  }
  if (message) {
    message += "不能为空";
  }
  return message;
}
