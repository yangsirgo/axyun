import {
    post,
    get,
    put,
    del,
    patch
  } from '@/utils/request'


  export default {
    async getStatementOfDailyCash(data) {
      return await get('/finance-outp/outpTradeDetailNew/getStatementOfDailyCash', data, false);
    },
    async getOutpPrestoreBalanceReport(data) {
      return await get('/finance-outp/outpTradeDetailNew/getOutpPrestoreBalanceReport', data, false);
    },
    async getOutpIncomeReport(data) {
      return await get('/finance-outp/outpTradeDetailNew/getOutpIncomeReport', data, false);
    },
    // 住院患者费用日清单
    async getInpChargeDayReport(data){
      return await get('/finance-inp/inpOrderItemChargeDetail/inpChargeDayReports', data, false);
    },
    // 住院患者费用 汇总
    async getInpChargeCollect(data){
      return await get('/finance-inp/inpOrderItemChargeDetail/inpChargeCollects', data, false);
    },
    // 住院患者费用日清单
    async getInpOperatorDailyReport(data){
      return await post('/finance-inp/inp-report/inpOperatorDailyReport', data, false);
    },
    // 门诊工作量统计报表
    async getOutpWorkLoadInfo(data){
      return await post('/finance-outp/outpReport/getOutpWorkLoadInfo', data, false);
    },
    // 门诊收费员费用日清单
    async getOutpOperatorDailyReport(data){
      return await get('/finance-outp/outpTradeDetailNew/getOutpIncomeReport', data, false);
    },
    // 门诊医保日报结账
    async uploadTurnInRecord(data){
      return await post('/finance-pub/turnInRecord/upload-turnInRecord', data, false);
    },
    // 门诊医保日报结账查询
    async turnInRecordQuery(data){
      return await post('/finance-pub/turnInRecord/turnInRecord-query', data, false);
    },
    // 门诊医保日报结账撤销
    async cancelTurnInRecord(data){
      return await post('/finance-pub/turnInRecord/cancel-turnInRecord?turnInRecordId=' + data.turnInRecordId, data, false);
    },
    // 门诊收费员费用日清单(新)
    async getDailyReportNew(data){
      return await post('/finance-outp/outpReport/cash-daily', data, false);
    }
  }
