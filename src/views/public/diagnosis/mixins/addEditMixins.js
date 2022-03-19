import {
  getCardByICDNew
  // getDiaTypeList
} from "@/api/common/diagnosis";

import {
  saveDiagRelation,
  deleteDiagRelation
} from "@/api/emrRecord/common/diagnosis"; // 维护诊断关系

import { deepClone } from "@/utils/index";
export default {
  data() {
    return {};
  },
  /**

   *
   *  rest
   *  1.表单校验状态复原
   *
   *  loadSwitch
   *  1.设置相应父组件的加载状态
   *
   *  getDiaTypeList
   *  1.通过接口获取诊断列表
   *
   *  handleDiaTypeList
   *  1.对获取的诊断类型处理后缓存
   *
   *  changekeyValueHandler
   *  1. 中西医诊断切换后 设置 相应的数据
   *  2. 设置诊断名称接口的入参
   *
   *  setDiagMain
   *  1.设置主诊断相应的数据
   *
   *  dialogVisibleBKShow
   *  1.传染性疾病报卡 弹窗展示相应逻辑处理
   *
   *  dialogVisibleBKShowStyle
   *  1.食源性疾病报卡 弹窗展示相应逻辑处理
   *
   *  goBaoka
   *  1.报卡相关逻辑处理
   *
   *  saveDiagRelationHandler
   *  1.通过接口 保存诊断关系
   *
   *  deleteDiagRelationHandler
   *  1.通过接口删除已删除的诊断关系
   *
   *  handleHosType
   *  1.设置诊断名称入参属性值
   */
  methods: {
    // 重置表单校验状态
    rest() {
      this.$refs["formElem"] && this.$refs["formElem"].resetFields();
    },
    loadSwitch(val) {
      this.$parent.cardLoading = val;
    },
    changekeyValueHandler(flag) {
      if (flag === "1") {
        this.remoteShowKey = "dictionaryName";
        this.remoteValueKey = "icd10DictionaryId";
        this.remoteShowCode = "icd10Encoding";
      } else {
        this.remoteShowKey = "tcdName";
        this.remoteValueKey = "id";
        this.remoteShowCode = "tcdCode";
      }
      // 重置诊断名称搜索项
      this.remoteParams = {
        keyword: "",
        type: this.handleHosType(),
        cwFlag: flag
      };
    },
    handleHosType() {
      return this.hosType == "1" ? 1 : this.hosType === "3" ? 2 : "";
    },
    // 设置主诊断
    setDiagMain(data, val) {
      console.log(`data.tcmSyndromeCode`, data.tcmSyndromeCode);
      if (data.tcmSyndromeCode) { 
        data.tcmSyndrome2 = data.tcmSyndromeCode.split(",");
        data.tcmSyndrome3 = data.tcmSyndromeCode.split(",");
      } else if (data.tcmSyndrome) { 
        data.tcmSyndrome2 = data.tcmSyndrome.split(",");
        data.tcmSyndrome3 = data.tcmSyndromeCode.split(",");
      } else { 
        data.tcmSyndrome2 = [];
        data.tcmSyndrome3 = [];
      }

      this.accountRechargeForm = deepClone(data);

      this.remoteParams1 = {
        diagCodes: Array.isArray(data.tcmSyndrome2)
          ? data.tcmSyndrome2.join(",")
          : "",
        keyword: "",
        pageNo: 1,
        pageSize: 20
      };

      this.accountRechargeForm.diagName = data.diagName;

      this.$nextTick(() => {
        const flag = val === "1";
        this.$set(this.accountRechargeForm, "diagMain", flag);
      });
    },
    // 报卡dialog
    dialogVisibleBKShow(data) {
      this.baokaData = data;
      this.dialogVisibleBK = true;
    },
    dialogVisibleBKShowStyle(data) {
      this.baokaData = data;
      this.dialogVisibleBKStyle = true;
    },
    // 报卡相关逻辑处理
    async goBaoka(baokaData) {
      this.loadSwitch(true);
      try {
        let { code, data } = await getCardByICDNew({
          diagName: baokaData.diagName,
          keyword: baokaData.diagCode,
          cwFlag: this.accountRechargeForm.cwFlag,
          type: this.hosType
        });

        if (code === 1) {
          if (data.length !== 1) {
            return;
          }

          console.log(data, "data---data---data");
          let diseaseReportCard = data[0].diseaseReportCard || "";
          if (diseaseReportCard.length != 0 && diseaseReportCard == 0) {
            //传染病报卡
            /* this.dialogVisibleBKShow({
              diagName: baokaData.diagName,
              diagCode: baokaData.diagCode,
              cardSource: this.hosType,
              pid: this.patientId,
              onsetDate: this.onsetDate
            }); */
            this.assignmentFun({
              cardSource: this.hosType,
              patientName: this.receivePatientData.patientName,
              pid: this.receivePatientData.patientId,
              inpNo: this.receivePatientData.visitCode,
              diagName: baokaData.diagName,
              diagCode: baokaData.diagCode,
              onsetDate: this.onsetDate
            }, true);
          } else if (diseaseReportCard == 1) {
            //食源性报卡
            this.dialogVisibleBKShowStyle({
              diagName: baokaData.diagName,
              diagCode: baokaData.diagCode,
              cardSource: this.hosType,
              pid: this.patientId,
              onsetDate: this.onsetDate
            });
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loadSwitch(false);
      }
    },
    async saveDiagRelationHandler(params) {
      try {
        const { code, msg } = await saveDiagRelation(params);
        if (code !== 1) {
          this.$message.error(msg || "保存诊断关系操作失败！");
        }
      } catch (error) {
        this.$message.error(JSON.parse(JSON.stringify(error)));
      }
    },
    async deleteDiagRelationHandler(params) {
      try {
        const { code, msg } = await deleteDiagRelation(params);
        if (code !== 1) {
          this.$message.error(msg || "删除诊断关系操作失败");
        }
      } catch (error) {
        this.$message.error(JSON.parse(JSON.stringify(error)));
      }
    }
  }
};
