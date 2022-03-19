<template>
  <div class="width100 height100">
    <div class="editor-con">
      <l-editor
        ref="axEditor"
        @save="saveFunc"
        @ready="editorReady"
        @setContentReady="changeModel"
        :configs="editorConfigs"
        :defaultMsg="defaultMsg"
      ></l-editor>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { getUId } from "@/utils/crypto";
import { getUserId } from "@/utils/auth.js";
import {
  refreshMacros,
  insertDiagnose,
  showDiagnoseInfo,
  handlerDiagnoseInfo,
  insertPrescription,
  showPrescriptionInfo,
  saveMarks,
  getMarks
} from "@/utils/axeditor";
import { signConfig } from "@/utils/emrConfig.js";

import {
  contentQuery,
  modifyContent,
  modifyAttribute,
  save,
  checkMrCreatedBy,
  checkCancelStatus,
  removeMr,
  cancelSubmit
} from "@/api/emrRecord/emr/instrument";
import { getContent } from "@/api/emrRecord/emr/template";
import { checkQcDepend } from "@/api/emrRecord/qc";

import { getHistoryDiagList } from "@/api/emrRecord/tools/historicalDiagnosis.js";
import { previousOrderList } from "@/api/emrRecord/tools/PreviousOrder.js";

let widgets = [
  [
    {
      id: "save",
      iconOnly: false,
      name: "暂存"
    },
    {
      id: "submit",
      iconOnly: false,
      name: "提交"
    },
    {
      id: "recall",
      iconOnly: false,
      name: "撤回"
    }
  ],
  [
    {
      id: "refreshMacros",
      iconOnly: false,
      name: "刷新基本信息"
    },
    {
      id: "refreshDiagnose",
      iconOnly: false,
      name: "刷新诊断"
    },
    {
      id: "refreshprescription_out",
      iconOnly: false,
      name: "刷新医嘱"
    }
  ],
  [
    {
      id: "continueprint",
      iconOnly: false,
      name: "续打"
    },
    {
      id: "print",
      iconOnly: false,
      name: "打印文档"
    }
  ]
];
export default {
  name: "recordEditorRander",
  components: {},
  props: {
    recordData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      axeditor: null,
      defaultMsg: "",
      insInfo: {},
      isDoneRquest: false,
      isSaveDoneRequest: false,
      visitType: "04",
      editorConfigs: {
        id: this.openId,
        editorModel: "edit",
        defaultModel: "edit",
        showTabBar: false,
        saveTemplMethod: this.saveFunc, // 暂存方法
        submitMethod: this.submit, // 提交病历方法
        recallMethod: this.recall, // 撤回方法
        printMethod: this.print, // 打印方法
        refreshPrescriptionMethod: this.refreshPrescription1,
        refreshDiagnoseMethod: this.refreshDiagnose,
        refreshMacrosMethod: this.refreshMacros,
        tabToolbars: [
          {
            id: "edit",
            name: "编辑",
            widgets: this.recordData.nodeLevel === 2 ? [] : widgets
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  watch: {
    recordData: {
      handler(val) {
        if (val) {
          console.log(val, "valval");
          if (val.nodeLevel === 2) {
            // 第二级 加载 模板
            // 获取文本信息
            this.getTemplateContentQuery();
          } else if (val.nodeLevel === 3) {
            // 第三级 加载 已有文书
            this.getContentQuery();
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    console.log(this.recordData, "recordData");
  },
  methods: {
    messageHandler(name, value) {
      console.log(name, value, "val");

      // 特殊字符
      if (name === "symbol") {
        this.axeditor.execCommand("insertspecialsymbol", value);
      } else if (name === "insertCheckRes") {
        // 检验
        this.insertinspection(value);
      } else if (name === "insertCheck") {
        // 检查
        this.insertCheckRes(value);
      }
    },
    //编辑器初始化完成
    editorReady(instance) {
      if (this.recordData.nodeLevel === 2) {
        // 第二级 加载 模板
        // 获取文本信息
        this.getTemplateContentQuery();
      } else if (this.recordData.nodeLevel === 3) {
        // 第二级 加载 已有文书
        this.getContentQuery();
      }
      this.axeditor = instance;
      this.$emit("showStructureTree", instance);
    },
    async submit() {
      let content = this.axeditor.getContent();

      // 添加防重复点击功能
      if (this.isDoneRquest) {
        return false;
      }

      this.isDoneRquest = true;

      return this.saveSubmit(content, "03").then(() => {
        console.log("提交成功！");
        let param = {
          dataVersion: this.insInfo.mrDataVersion,
          mrId: this.insInfo.mrId,
          mrStaCd: "02",
          submitCd: getUId(),
          submitDate: new Date(),
          submitDeptCd: this.role.deptId,
          submitRoleCd: this.role.roleId,
          opTp: "04"
        };
        modifyAttribute(param)
          .then(res => {
            if (res.code == 1) {
              saveMarks({
                editor: this.axeditor,
                mrId: this.insInfo.mrId,
                opLogId: res.data.opLogId
              }).then(() => {
                getMarks({ editor: this.axeditor, mrId: this.insInfo.mrId });

                //保存留痕信息
                this.$message({
                  message: "提交成功!",
                  type: "success"
                });
              });

              if (this.axeditor.options.editorModel !== "pure") {
                this.axeditor.execCommand("setmodel", {
                  modelType: "pure",
                  showToolbar: true
                });
              }

              this.updateInsInfo({
                mrId: res.data.mrId
              });
              return true;
            }
            this.$message.error("提交失败!");
            return false;
          })
          .catch(res => {
            this.$message.error(res.msg);
            return false;
          })
          .finally(() => {
            // 防止重复点击
            this.isDoneRquest = false;
          });
      });
    },
    async saveSubmit(content, opTp) {
      let param = {
        docDataVersion: this.insInfo.docDataVersion,
        docId: this.insInfo.docId,
        docMongoContent: content,
        docMongoId: this.insInfo.docMongoId,
        mrDataVersion: this.insInfo.mrDataVersion,
        mrId: this.insInfo.mrId,
        mrStaCd: this.insInfo.mrStaCd,
        opTp: opTp
      };

      // 添加防重复提交逻辑
      if (this.isSaveDoneRequest) {
        return false;
      }

      this.isSaveDoneRequest = true;

      return modifyContent(param)
        .then(res => {
          if (res.code == 1) {
            this.$message({
              message: "保存文书成功!",
              type: "success"
            });

            this.axeditor.execCommand("recordinitcontent");
            this.updateInsInfo({
              mrId: res.data.mrId
            });
          } else {
            this.$message.error("保存文书失败!");
          }
        })
        .catch(error => {
          if (error.code == 98) {
            this.$message.error(
              error.msg ||
                "文书/模板内容已更新，请重新打开文书/模板进行书写/维护!"
            );
          }
        })
        .finally(() => {
          this.isSaveDoneRequest = false;
        });
    },
    print() {
      console.log(this.recordData, "this.recordData.mrStaCd");
      if (this.recordData.mrStaCd === "01") {
        this.submit().then(res => {
          console.log(res, "debugger");
          if (res) {
            this.axeditor.execCommand("doprint");
            this.$root.eventHub.$emit("top-list-change");
          }
        });
      } else {
        this.axeditor.execCommand("doprint");
        this.$root.eventHub.$emit("top-list-change");
      }
    },
    async delete() {
      return await checkMrCreatedBy({
        mrId: this.insInfo.mrId,
        createdBy: getUserId()
      })
        .then(res => {
          if (res.code == 1 && res.data == "true") {
            let param = {
              mrId: this.insInfo.mrId,
              dataVersion: this.insInfo.mrDataVersion
            };
            return removeMr(param)
              .then(res => {
                if (res.code == 1) {
                  this.insInfo = {};
                  this.defaultMsg = "";
                  return true;
                }

                this.$message.error(res.msg);
                return false;
              })
              .catch(res => {
                this.$message.error(res.msg);
                return false;
              });
          }
          this.$message.warning("您没有删除当前文书的权限!");
          return false;
        })
        .catch(res => {
          this.$message.error(res.msg);
          return false;
        });
    },
    judgePrescriptionOrDiagnoseHas(editor, type) {
      return editor.execCommand("checkelementcontent", type);
    },
    refreshPrescription() {
      return previousOrderList({
        paId: this.receivePatientData.patientId,
        visitType: this.visitType,
        enNo: this.receivePatientData.treatNo
      })
        .then(res => {
          if (res.code == 1) {
            let medicineTypeList = ["1", "2", "3"];
            let _map = new Map();
            res.data.forEach(item => {
              if (!item.parOrPk) {
                let rejection = {
                  medicines: [],
                  usageMode: ""
                };
                let medicine = {
                  name: item.svNm,
                  spec: item.spec || "--",
                  qty: `${item.dosage || "--"}  ${item.dosageUnitNm || "--"}`
                };
                rejection.medicines.push(medicine);
                rejection.usageMode = item.freqNm
                  ? (item.routeNm || "") + "x" + item.freqNm
                  : "--";
                _map.set(item.orId, rejection);
              } else {
                _map.get(item.parOrPk).medicines.push({
                  name: item.svNm,
                  spec: item.spec || "--",
                  qty: `${item.dosage || "--"}  ${item.dosageUnitNm || "--"}`
                });
              }
            });
            let medicines = {
              rejections: [],
              orals: []
            };
            _map.forEach((value, key) => {
              if (medicineTypeList.includes(value.medicines[0].orTpCd)) {
                medicines.rejections.push(value);
              } else {
                medicines.orals.push(value);
              }
            });
            console.log("medicines", medicines);
            let previousEleFlag = this.judgePrescriptionOrDiagnoseHas(
              this.axeditor,
              "prescription"
            );
            if (previousEleFlag) {
              this.insertPrevious(medicines);
            }
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    // 工具箱插入诊断信息,可编辑
    insertDiagnoses(val) {
      insertDiagnose(this.axeditor, val);
    },
    // 工具箱插入医嘱信息,普通样式可编辑
    insertPreviousFunc(val) {
      insertPrescription(this.axeditor, val);
    },
    // 工具箱插入医嘱信息
    insertPrevious(val) {
      showPrescriptionInfo(this.axeditor, val);
    },
    // 工具箱插入诊断信息
    insertHistorical(val) {
      showDiagnoseInfo(this.axeditor, val);
    },
    //刷新处方
    refreshPrescription1() {
      let previousEleFlag = this.judgePrescriptionOrDiagnoseHas(
        this.axeditor,
        "prescription"
      );

      if (previousEleFlag) {
        this.refreshPrescription()
          .then(res => {
            this.$message.success("刷新处方成功");
          })
          .catch(error => {
            console.log(error);
            this.$message.error(error.msg || "刷新处方失败");
          });
      } else {
        this.$message.warning("当前文书无处方元素");
      }
    },
    insertinspection(val) {
      val.data.isSecret = false;
      this.axeditor.execCommand(
        "insertinspection",
        val.multipleSelection,
        val.data
      );
    },
    insertCheckRes(val) {
      val.isSecret = false;
      this.axeditor.execCommand("insertcheckres", val);
    },
    refreshDiagnose1() {
      let content = this.axeditor.getContent();
      let diagnoseFlag = this.judgePrescriptionOrDiagnoseHas(
        this.axeditor,
        "diagnose"
      );
      if (diagnoseFlag) {
        this.refreshDiagnose()
          .then(res => {
            this.$message.success("刷新诊断成功");
          })
          .catch(error => {
            console.error(error);
            this.$message.error(
              error || "当前文书中暂无诊断信息，请联系管理员"
            );
          });
      } else {
        this.$message.warning("当前文书中无诊断元素");
      }
    },
    refreshDiagnose() {
      return getHistoryDiagList({
        paId: this.receivePatientData.patientId,
        visitType: this.visitType,
        enNo: this.receivePatientData.treatNo
      }).then(res => {
        if (res.code == 1) {
          let diagnoseInfo = handlerDiagnoseInfo(res.data);
          // 判断是否含有诊断元素
          let diagnoseEleFlag = this.judgePrescriptionOrDiagnoseHas(
            this.axeditor,
            "diagnose"
          );
          if (diagnoseEleFlag) {
            this.insertHistorical(diagnoseInfo);
          }
        }
      });
    },
    savePassParent() {
      let content = this.axeditor.execCommand("getcontent");
      let opTp = "02";
      this.saveFunc(content, opTp);
    },
    saveFunc(content, opTp) {
      if (this.recordData.nodeLevel === 2) {
        // 第二级 加载 模板
        this.save(content, opTp);
      } else if (this.recordData.nodeLevel === 3) {
        // 第二级 加载 已有文书
        console.log(this.insInfo, "this.insInfo");
        let param = {
          docDataVersion: this.insInfo.docDataVersion,
          docId: this.insInfo.docId,
          docMongoContent: content,
          docMongoId: this.insInfo.docMongoId,
          mrDataVersion: this.insInfo.mrDataVersion,
          mrId: this.insInfo.mrId,
          mrStaCd: this.insInfo.mrStaCd,
          opTp: opTp
        };

        modifyContent(param)
          .then(res => {
            if (res.code == 1) {
              this.$message({
                message: "保存文书成功!",
                type: "success"
              });

              this.axeditor.execCommand("recordinitcontent");
              this.updateInsInfo({
                mrId: res.data.mrId
              });
            } else {
              this.$message.error("保存文书失败!");
            }
          })
          .catch(error => {
            if (error.code == 98) {
              this.$message.error(
                error.msg ||
                  "文书/模板内容已更新，请重新打开文书/模板进行书写/维护!"
              );
            }
          });
      }
    },
    save(content, opTp) {
      console.log(this.recordData, "templatePO");
      let templatePO = this.recordData.templatePO;
      let saveParam = {
        bizTime: new Date(),
        enCnt: 0,
        enId: this.receivePatientData.treatNo,
        enStaCd: "01",
        enTpCd: "04",
        mrAmrGroupId: "",
        mrId: "",
        mrMainId: "",
        mrTpCd: templatePO.typeCode,
        mrTplCd: templatePO.templateCode,
        nm: templatePO.templateName,
        pastEnId: "",
        pastMrF: "0",
        pastMrId: "",
        patientId: this.receivePatientData.patientId,
        signLvlCd: templatePO.signLevel,
        supDctId: "",
        templateVersion: templatePO.templateVersion
      };

      save(saveParam)
        .then(res => {
          if (res.code == 1) {
            console.log(res, "rereres");
            let param = {
              mrId: res.data.mrId,
              mrStaCd: res.data.mrStaCd
            };
            contentQuery(param)
              .then(res => {
                if (res.code == 1) {
                  this.insInfo = res.data;

                  let data = {
                    docDataVersion: this.insInfo.docDataVersion,
                    docId: this.insInfo.docId,
                    docMongoContent: content,
                    docMongoId: this.insInfo.docMongoId,
                    mrDataVersion: this.insInfo.mrDataVersion,
                    mrId: this.insInfo.mrId,
                    mrStaCd: this.insInfo.mrStaCd,
                    opTp: opTp
                  };

                  modifyContent(data)
                    .then(res => {
                      if (res.code == 1) {
                        console.log(res, "res");
                        this.$message({
                          message: "保存文书成功!",
                          type: "success"
                        });

                        // this.axeditor.execCommand("recordinitcontent");

                        this.$emit("updateRecordList", res.data.mrId);
                      } else {
                        this.$message.error("保存文书失败!");
                      }
                    })
                    .catch(error => {
                      if (error.code == 98) {
                        this.$message.error(
                          error.msg ||
                            "文书/模板内容已更新，请重新打开文书/模板进行书写/维护!"
                        );
                      }
                    });
                } else {
                  this.$message.error("查询失败!");
                }
              })
              .catch(res => {
                this.$message.error(res.msg);
              });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });

      return;
    },
    updateInsInfo(param) {
      this.getContentQuery(param);
    },
    // 刷新宏元素
    async refreshMacros() {
      refreshMacros({
        editor: this.axeditor,
        patientId: this.receivePatientData.patientId,
        enId: this.receivePatientData.treatNo,
        enTpCd: "04",
        hideConfirmTip: false,
        isHome: "1",
        mrId: this.recordData.mrId
      });
    },
    // 获取已创建文书内容
    getContentQuery(params = {}) {
      let param = {
        mrId: this.recordData.mrId
      };
      contentQuery(Object.keys(params).length ? params : param)
        .then(res => {
          this.defaultMsg = res.data.docMongoContent
            ? res.data.docMongoContent
            : "";
          this.insInfo = res.data;
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error.msg);
        });
    },
    changeModel() {
      if (!this.insInfo.mrStaCd) return;
      if (this.insInfo.mrStaCd === "02") {
        if (this.axeditor.options.editorModel !== "pure") {
          this.axeditor.execCommand("setmodel", {
            modelType: "pure",
            showToolbar: true
          });
        }
      } else if (this.insInfo.mrStaCd === "01") {
        if (this.axeditor.options.editorModel !== "edit") {
          this.axeditor.execCommand("setmodel", {
            modelType: "edit",
            showToolbar: true
          });
        }
      } else {
        if (this.axeditor.options.editorModel !== "pure") {
          this.axeditor.execCommand("setmodel", {
            modelType: "pure",
            diabledBtns: ["recall"],
            showToolbar: true
          });
        }
      }
    },
    recall() {
      if (this.insInfo.mrStaCd === "01") {
        this.$message.warning("当前文书为编辑状态，无需撤回操作");
        return;
      }

      let data = {
        patientId: this.receivePatientData.patientId,
        enId: this.receivePatientData.treatNo,
        mrId: this.insInfo.mrId
      };

      checkCancelStatus(data).then(res => {
        if (res.code == 1) {
          let paramsObj = {
            patientId: data.patientId,
            enId: data.enId,
            mrId: this.insInfo.mrId,
            dataVersion: this.insInfo.mrDataVersion
          };

          cancelSubmit(paramsObj)
            .then(resp => {
              console.log(resp, "resp");
              if (resp.code === 1) {
                this.$message({
                  message: "撤回成功!",
                  type: "success"
                });

                // 更新文书数据
                this.updateInsInfo({
                  mrId: this.insInfo.mrId
                });

                if (this.axeditor.options.editorModel !== "edit") {
                  this.axeditor.execCommand("setmodel", {
                    modelType: "edit",
                    showToolbar: true
                  });
                }
              }
            })
            .catch(error => {
              this.$message.error(error.msg || "撤回失败");
            });
        } else {
          this.$message.warning("不可撤回!");
        }
      });
    },
    // 获取模板内容
    getTemplateContentQuery() {
      getContent(this.recordData.docId)
        .then(res => {
          if (res.code == 1) {
            this.defaultMsg = res.data.content ? res.data.content : "";
            this.insInfo = {};
            // 设置文书工具栏功能
            if (this.axeditor.options.editorModel !== "edit") {
              this.axeditor.execCommand("setmodel", {
                modelType: "edit",
                showToolbar: true
              });
            }

            if (res.data.mrStaCd != "02") {
              this.refreshMacros();
            }
          } else {
            this.$message.error("查询失败!");
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    checkQcDependHandle(paramCheck) {
      // 检验当前选中文书是否有依赖的文书 先写另外一个
      return checkQcDepend(paramCheck, true)
        .then(res => {
          if (res.code === 1) {
            return true;
          } else if (res.code === 0) {
            // 取toDocTypes 进行查询选择重新选择文书
            if (res.data.continus) {
              return true;
            }
            this.$confirm(`${res.msg}`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {})
              .catch(() => {});
          } else {
            this.$message.error(res.msg || "有依赖文书未完成！");
          }
        })
        .catch(error => {
          this.$message.error(error.msg || "有依赖文书未完成！");
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.editor-con {
  width: 100%;
  height: 100%;
}
</style>
