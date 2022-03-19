window.onSupplySubmitFunc = null;

import { getDiaByPatientCode } from "@/api/emrRecord/common/diagnosis.js";

export default {
  methods: {
    supplySubmitFunc(editor, mode, receivePatientData) {

      window.onSupplySubmitFunc = async () => {

        let data = editor.execCommand('getparagraphelecontent');
        const EmrContentObj = {};

        if (Array.isArray(data)) {
          data.forEach(item => {
            switch (item.name) {
              case '主诉':
                EmrContentObj.ChiefComplaint = item.content;
                break;
              case '现病史':
                EmrContentObj.PresentIllness = item.content;
                break;
              case '既往史':
                EmrContentObj.PastHistory = item.content;
                break;
              case '体格检查':
                EmrContentObj.PhysicalExamination = item.content;
                break;
              case '辅助检查':
                EmrContentObj.AuxiliaryExamination = item.content;
                break;
              default:
                break
            }
          })
        }

        let resData = null;

        this.submit().then(async res => {
          resData = {
            "Code": "1",
            "Message": "保存成功 ",
            "Object": {
              "EmrContent": {
                "EmrId": res.data.mrId,
                ...EmrContentObj
              },
              "Diagnosis": [
                // {
                //   "前缀": "value",
                //   "诊断代码": "value",
                //   "诊断名称": "value",
                //   "后缀": "value",
                //   "类型": "value"
                // }
              ]
            }
          }
          if (res) {
            let Diagnosis = [];
            try {
              let params = {};
              if (mode === 'menzhen') {
                params.visitCode = receivePatientData.visitCode;
              } else {
                params.inpCode = receivePatientData.visitCode;
              }
              let list = await getDiaByPatientCode(params);

              if (list.code === 1 && list.data.length > 0) {
                console.log(list, 'kskskssk')
                Diagnosis = list.data.map(item => {
                  return {
                    // 诊断唯一ID
                    "SerialId": item.id,
                    //诊断前缀
                    "Prefix": item.beforeDiag,
                    //诊断编码
                    "Code": item.diagCode,
                    // 诊断名称
                    "Name": item.diagName,
                    //诊断后缀
                    "Suffix": item.laterDiag,
                    // 诊断类型（西医=0 中医=1）
                    "DiagType": item.cwFlag === "1" ? 0 : 1,
                    //中医症名代码
                    "SymptomCode": item.tcmSyndromeCode,
                    //中医症名名称
                    "SymptomName": item.tcmSyndrome
                  }
                })
              }
            } catch (error) {
              this.$message.error(error || '获取诊断信息失败')
            }
            resData.Object.Diagnosis = Diagnosis;

          } else {
            resData = {
              "Code": `${res.code}`,
              "Message": `${res.msg || '保存失败'}`,
              "Object": {}
            }
          }

          // 调用 cs 方法
          jscall.SpecialFunc("RightMenuClickHandler", JSON.stringify(resData), "");

        });
      };
    }
  },
  beforeDestroy() {
    window.onSupplySubmitFunc = null;
  },
}
