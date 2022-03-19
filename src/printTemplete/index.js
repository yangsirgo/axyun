import {
  chmLodopTpl,
  hChmLodopTpl
} from "@/printTemplete/module/chmLodopTpl.js";
import {
  westLodopTpl
} from "@/printTemplete/module/westLodopTpl.js";

// 电子申请-检查申请单
import {checkTpl} from "./module/checkApplyLodopTpl"
// 电子申请-检验申请单
import {testTpl} from "./module/testApplyLodopTpl"
// 电子申请-治疗单
import {prescriptionTpl} from "./module/prescriptionLodopTpl"
// 财务发票打印
import {financeTpl} from "./module/financeLodopTpl"
// 财务住院发票打印
import {inFinanceTpl} from "./module/inpFinanceLodopTpl"
// console.log("chmLodopTpl", chmLodopTpl);
import {outDailyReportStr} from "./module/outDailyReportTp"
// 费用清单
import {t3} from "./module/t3"
// 家庭病床取药单
import {t4} from "./module/t4"
// 家庭病床长期医嘱单
import {t5} from "./module/t5"
export default {
  checkTpl,
  testTpl,
  prescriptionTpl,
  financeTpl,
  inFinanceTpl,
  hChmLodopTpl,
  outDailyReportStr,
  t1: westLodopTpl,
  t2: chmLodopTpl,
  t3,
  t4,
  t5
}
