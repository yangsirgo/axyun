import { historyList } from "@/api/electronApply/chargeTemplate";
import { saveApply } from "@/api/electronApply/inspectionApply";
import { medicalInsuranceAudit } from "@/views/public/electronApply/component/eleUtils.js";
import { deepClone } from "@/utils";
import { mapActions } from "vuex";
export default {

  methods: {
    ...mapActions("cdss", ["setTestList"]),
    async addPro(data) {
      if (!this.patientParam.patientId) {
        this.$message.warning("请先选择患者再进行添加！");
        return;
      }
      console.log(`addPro:>>>>>`);


      //医保审批 弹窗 START
      let itemData = null;
      try {
        itemData = await medicalInsuranceAudit(deepClone(data[0]));
      } catch (error) {
        return;
      }
      data = [itemData];
      //医保审批 弹窗 END

      this.selectedList = this.selectedList.concat(deepClone(data));
      this.setTestList(deepClone(this.selectedList));
      this.getRpRowArr();
      //取消表格勾选框
      this.$refs.rigTableyApply.clearSelection();
      this.applyList = [];
    },
    // 处理 row 的样式（免费申请显示绿色）
    rowStyleCls(a) {
      return {
        freeRpRow: a.row.freeFlag !== "" && a.row.freeFlag !== undefined
      };
    },
    //提交申请接口
    saveApplyFunc(data) {
      return new Promise(async (resolve, reject) => {
      this.submitLoad = true;
      saveApply(data)
        .then(result => {
          if (result.code == 1) {
            //获取已申请数据列表
            this.$message.success("提交申请成功");
            this.getHistoryApplyList();
            this.diagformdata.advicePrompt = "";
            resolve(true);
          } else {
            this.$message.error(result.msg || "提交申请失败");
            reject(false);
          }
          this.submitLoad = false;
        })
        .catch(error => {
          reject(false);
          this.submitLoad = false;
        });
      })
    },
    //查询已申请单
    async getHistoryApplyList() {
      this.$refs.rigTableyApply && this.$refs.rigTableyApply.clearSelection();
      this.selectedList = [];
      this.applyList = [];
      this.currentLeftRow = {};
      if (!this.patientParam.patientId) {
        // this.$message.warning("请选择患者!");
        return;
      }
      try {
        this.rightTableLoad = true;
        let params = {};

        params["patientId"] = this.patientParam.patientId;
        params["visitCode"] = this.patientParam.visitCode;
        params["patientType"] = "1"; //this.patientParam.patientSource;
        params["pageSize"] = "300";
        params["pageNo"] = "1";
        let result = await historyList(params);
        if (result.code == "1") {
          let newData = result.data.map(item => {
            return {
              ...item,
              chargeStatus: item.chargeStatus.toString() //费用状态
            };
          });
          this.selectedList = newData;
          this.getRpRowArr();
        }
        this.rightTableLoad = false;
      } catch (error) {
        this.rightTableLoad = false;
      }
    },
    //计算合计(仅算未申请的)
    sumMoney() {
      this.totalMoney = 0;
      this.applyList.forEach(item => {
        if (
          item.freeFlag === "" ||
          item.freeFlag === undefined ||
          item.freeFlag === null
        ) {
          this.totalMoney = (this.totalMoney * 1 + Number(item.amt) * Number(item.quantity)).toFixed(4);
        }
      });
    },
    //设置当前患者
    async setPatientInfo(type, params) {
      this.patientParam = {
        ...params,
        patientId: params.patientId, // 患者id
        patientSource: params.type, //患者来源 0门诊 1住院
        id: params.id, //门诊号or住院号
        type //申请检验检查类型
      };
    },



  }
};
