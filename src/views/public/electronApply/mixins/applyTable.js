import {
  saveApplyExam,
} from "@/api/electronApply/inspectionApply";

export default {
  created() {

  },
  /**
   * saveApplyFunc (提交申请接口处理逻辑)
   *
   * rowStyleCls （表格样式处理）
   *
   * sumMoney （计算合计逻辑）
   *
   * resetFields （重置表单校验状态）
   *

   */
  methods: {
    //提交申请接口
    saveApplyFunc(data) {
      return new Promise(async (resolve, reject) => {
      this.submitLoad = true;
      saveApplyExam(data)
        .then(result => {
          const { code, msg } = result;
          if (code == 1) {
            //获取已申请数据列表
            this.$message.success("提交申请成功");
            this.getHistoryApplyList();
            this.diagformdata.advicePrompt = "";
            resolve(true);
          } else {
            this.$message.error(msg || "提交申请失败");
            reject(false);
          }
        })
        .catch(error => {
          console.log(error);
          reject(false);
        })
        .finally(() => {
          this.submitLoad = false;
        });
      })
    },
    //zhengyawen 处理 row 的样式
    rowStyleCls(a) {
      return {
        freeRpRow: a.row.freeFlag !== "" && a.row.freeFlag !== undefined
      };
    },
    //计算合计(仅算未申请的)
    sumMoney() {
      this.totalMoney = 0;
      this.applyList.forEach(item => {
        if (item.freeFlag === "" || item.freeFlag === undefined || item.freeFlag === null) {
          this.totalMoney = (this.totalMoney * 1 +  Number(item.amt) * Number(item.quantity)).toFixed(4);
        }
      });
    },
    resetFields() {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
    },
    //设置当前患者
    async setPatientInfo(type, params) {
      this.patientParam = {
        ...params,
        patientId: params.patientId, // 患者id
        patientSource: params.type, //患者来源 0门诊 1住院
        id: params.id, //门诊号or住院号
        type: type //申请检验检查类型
      };
      this.$refs.orderTable && this.$refs.orderTable.clearSelection();
    },

  }
}
