<template>
  <div class="height100">
    <div class="nav-bar clearfix">
      <el-date-picker
        class="float-left"
        v-if="
          docStyleData.length &&
          isLook &&
          juageDocType == '02' &&
          docStyleData[0].mrModelCd != '2'
        "
        v-model="recordDate"
        type="datetime"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyyMMdd HHmm"
        placeholder="选择记录"
      ></el-date-picker>
      <el-button
        class="float-left"
        style="margin-left: 8px"
        type="primary"
        @click="addStatistics"
        v-if="
          docStyleData.length &&
          isLook &&
          juageDocType == '02' &&
          docStyleData[0].mrModelCd == '2' &&
          isStatistics
        "
        >统计</el-button
      >
      <el-button
        class="float-left"
        style="margin-left: 8px"
        type="primary"
        @click="addConclusion('minConclusion')"
        v-if="
          docStyleData.length &&
          isLook &&
          juageDocType == '02' &&
          docStyleData[0].mrModelCd == '2' &&
          isConclusionShow
        "
        >小结</el-button
      >
      <el-button
        class="float-left"
        style="margin-left: 8px"
        type="primary"
        @click="addConclusion('maxConclusion')"
        v-if="
          docStyleData.length &&
          isLook &&
          juageDocType == '02' &&
          docStyleData[0].mrModelCd == '2' &&
          isConclusionShow
        "
        >总结</el-button
      >
      <el-button
        class="float-left"
        style="margin-left: 8px"
        type="primary"
        @click="tableCopy"
        v-if="
          docStyleData.length &&
          isLook &&
          juageDocType == '02' &&
          docStyleData[0].mrModelCd == '2'
        "
        >复制</el-button
      >
      <el-button
        class="float-right"
        style="margin-left: 8px"
        type="primary"
        :disabled="!isLook || recordData.level == 2"
        @click="updateRecord(1)"
        >删除</el-button
      >
      <el-button
        class="float-right"
        type="primary"
        :disabled="!isLook || isNodeLevelThree"
        @click="updateRecord(0)"
        >保存</el-button
      >
      <el-button
        class="float-right"
        type="primary"
        v-if="
          docStyleData.length &&
          isLook &&
          juageDocType === '02' &&
          docStyleData[0].mrModelCd == '2'
        "
        @click="addTableItem"
        >新增</el-button
      >
      <!-- <el-button
        class="float-right"
        type="primary"
        v-if="docStyleData.length && isLook"
        @click="printData"
        >打印</el-button
      > -->
    </div>
    <div
      class="doc-content width100"
      v-if="docStyleData.length && isLook && juageDocType === '02'"
    >
      <!--混合类型文书-->
      <div
        :style="{
          width: (toolValue.widthAll || 100) + '%',
          height: (toolValue.heightAll || 100) + '%',
        }"
      >
        <tableCol
          ref="tableCol"
          class="width100"
          style="padding-right: 20px"
          v-if="docStyleData[0].mrModelCd != '2'"
          :treeData="docStyleData[0]"
          :toolsQuote="toolsQuote"
        ></tableCol>
        <!-- 表格类型文书 -->
        <tableType
          ref="tableType"
          class="width100"
          style="padding-right: 20px"
          v-if="docStyleData[0].mrModelCd == '2'"
          :treeData="docStyleData[0]"
          :toolsQuote="toolsQuote"
          :conclusionDialogProp="conclusionDialogProp"
          :statisticsDialogProp="statisticsDialogProp"
          :nursingList="nursingList"
          :isBasicEleValue="isBasicEleValue"
          @updateRecordList="updateRecordList"
        ></tableType>
      </div>
    </div>
    <!-- 文书模式渲染 -->
    <recordEditorRander
      @updateRecordList="updateRecordList"
      ref="recordEditorRander"
      v-on="$listeners"
      :recordData="recordData"
      class="height100"
      v-if="isLook && juageDocType === '01'"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import tableCol from "./tableCol";
import tableType from "./tableType";
import recordEditorRander from "./recordEditorRander";

import {
  getDocInfoNoPage,
  getDocVersionInfo,
  getDocVersionInfoGZ
} from "@/api/emrRecord/nursingRecord/docInfoMaintain";

import {
  saveOrUpdateDocClass,
  getDocRecord,
  getDocRecordByDateTime,
  getDocRecordGZ,
  getDocRecordByTimeGZ,
  selectUserRoleByDeptId
} from "@/api/emrRecord/nursingRecord/docRecord";
import { initDocEle } from "@/api/emrRecord/nursingRecord/docToolInteraction";
import {
  transformCode,
  getTableData,
  getTableDatas
} from "@/api/directive/directiveRequest";
import { getDocPrintTemplateList } from "@/api/emrRecord/nursingRecord/printTemp";
import { getMacroValues } from "@/api/emrRecord/emr/element";


import {
  getPamars,
  getUserName,
  getRoles,
  getRole,
  setRole
} from "@/utils/auth";
import Base64 from "@/utils/base64";

import { deepClone } from "@/utils/index";
import { onPreview } from "@/utils/print";

import { dateFormatDatas } from "./retrieveSelect";



let printTempData = {
  dataVersion: "",
  deletedStatus: "",
  id: "",
  printTemplateAttribute: "",
  printTemplateContent: ""
};
export default {
  name: "analyComponent",
  components: {
    tableCol,
    tableType,
    recordEditorRander
  },
  props: {
    toolsQuote: {
      type: Object,
      default() {
        return {
          current: "",
          data: {}
        };
      }
    },
    juageDocType: {
      type: String,
      default: "02"
    },
    currentDoc: {
      type: Object,
      default() {
        return {};
      }
    },
    currentDocRecord: {
      type: Object,
      default() {
        return {};
      }
    },
    docStyleDataInit: {
      type: Object,
      default() {
        return {};
      }
    },
    recordData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      //解析结构数据
      docStyleData: [],
      isLook: false,
      nursingTreeDataSave: [],
      //记录保存时间
      recordDate: "",
      //添加小结弹框
      conclusionDialogProp: {
        flag: false
      },
      statisticsDialogProp: {
        flag: false
      },
      //数值引用数据映射
      quoteMatch: {
        baseInfo: "1",
        docEle: "2",
        tempPro: "3",
        tableData: "4"
      },
      //单表格文书数据引用
      isQuote: {
        flag: false,
        quoteValue: []
      },
      //基本元素以及值
      basicEleValue: [],
      isBasicEleValue: {
        flag: false,
        basicEleValue: []
      },
      //文书样式控制
      checkedElement: false,
      toolValue: {
        layoutStyle: false,
        widthAll: "100",
        heightAll: "100",
        col: 5,
        lineHeight: 35,
        widthEle: "",
        heightEle: ""
      },
      isNodeLevelThree: false,
      nursingList: [],
      isStatistics: false, //统计按钮是否显示（根据交互）
      //模板内容
      printTempData: {},
      //是否维护了出入量交互
      isConclusionShow: false
    };
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData"]),
    ...mapGetters("homeSickbeds", [ "receivePatientData"]),
    ...mapGetters("user", ["role"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    receivePatientData: {
      async handler(val) {
        this.isLook = false;
        if (JSON.stringify(val) != "{}") {
          await this.getBasicEle();
        }
      },
      immediate: true,
      deep: true
    },
    nursingTreeData: {
      handler(val) {
        if (val && val.length) {
          this.nursingTreeDataSave = [...val];
        }
      },
      immediate: true,
      deep: true
    },
    docStyleDataInit: {
      async handler(val) {
        // console.log("vallllllllllllllll",val)
        this.isLook = false;
        this.docStyleData = [];
        this.conclusionDialogProp = {
          flag: false
        };
        this.statisticsDialogProp = {
          flag: false
        };
        if (val.data) {
          await this.handleDocStyleData(deepClone(val));
        }
      },
      immediate: true,
      deep: true
    },
    currentDocRecord: {
      handler(val) {
        this.isNodeLevelThree =
          val.nodeLevel && val.nodeLevel === 3 && val.editor === "01";
      }
    },
    juageDocType: {
      handler(val) {
        if (val) {
          //传入vuex：changeEditor数据，片语模板引用
          this.changeEditor(val);
        }
      },
      immediate: true,
      deep: true
    }
  },
  provide() {
    return {
      toolValue: () => this.toolValue,
      checkedElement: () => this.checkedElement
    };
  },
  async created() {
    await this.getNursingList();
  },
  methods: {
    ...mapActions({
      changeNursingTreeData: "nurseDocument/changeNursingTreeData",
      changeEditor: "nurseDocument/changeEditor"
    }),
    async handleDocStyleData(data) {
      if (this.currentDoc.docId) {
        if (this.currentDoc.docType == "2") {
          let docStyleData = [{}];
          if (data.data.lstDocRecords && data.data.lstDocRecords.length) {
            let res = data.data.lstDocRecords[0].recordContent
              ? JSON.parse(data.data.lstDocRecords[0].recordContent)
              : { eleList: [], eleEventList: [] };
            //处理单表格数据
            let arr = data.data.lstDocRecords;
            let recordId = [];
            let recordValueJson = [];
            let dataVersion = [];
            let deletedStatus = [];
            for (let i in arr) {
              let value = JSON.parse(arr[i].recordValueJson);
              for (let j in value) {
                value[j].recordId = arr[i].recordId;
                value[j].isModify = false;
              }
              recordId = recordId.concat(arr[i].recordId);
              dataVersion = dataVersion.concat(arr[i].dataVersion);
              deletedStatus = deletedStatus.concat(arr[i].deletedStatus);
              recordValueJson = recordValueJson.concat(value);
            }
            this.$set(docStyleData, 0, {
              ...res,
              docTypeCode: this.currentDoc.docTypeCode,
              docVersion: this.currentDoc.docVersion,
              elementName: this.currentDoc.docName,
              docCode: this.currentDoc.docCode || "",
              recordDate: "",
              recordTime: "",
              mrModelCd: "2",
              level: 1,
              recordId: recordId,
              dataVersion: dataVersion,
              deletedStatus: deletedStatus,
              recordValueJson: recordValueJson
            });
            // this.toolValue = {...res.docStyles} || this.toolValue;
            this.toolValue = {
              ...res.docStyles,
              widthAll: res.docStyles.widthAll || "100",
              heightAll: res.docStyles.heightAll || "100",
              col: res.docStyles.col || 5,
              lineHeight: res.docStyles.lineHeight || 35,
              widthEle: "",
              heightEle: ""
            };
            await this.digui(docStyleData[0], 1);
            this.docStyleData = deepClone(docStyleData);
            await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
            // console.log("单表格数据", docStyleData);
          } else {
            let res = JSON.parse(data.data.docContent);
            this.$set(docStyleData, 0, {
              ...res,
              docTypeCode: this.currentDoc.docTypeCode,
              docVersion: this.currentDoc.docVersion,
              elementName: this.currentDoc.label,
              docCode: this.currentDoc.docCode || "",
              recordDate: "",
              recordTime: "",
              mrModelCd: "2",
              level: 1,
              recordId: "",
              dataVersion: "",
              deletedStatus: "",
              recordValueJson: [{}]
            });
            // this.toolValue = {...res.docStyles} || this.toolValue;
            this.toolValue = {
              ...res.docStyles,
              widthAll: res.docStyles.widthAll || "100",
              heightAll: res.docStyles.heightAll || "100",
              col: res.docStyles.col || 5,
              lineHeight: res.docStyles.lineHeight || 35,
              widthEle: "",
              heightEle: ""
            };
            await this.digui(docStyleData[0], 1);
            this.docStyleData = deepClone(docStyleData);
            //获取引用元素值
            await this.getQuoteEveList(this.docStyleData[0], "1");
            //获取基本元素值
            await this.setBasicEle(this.docStyleData[0], "1");
            await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
          }
          this.getStatisticsState();
        } else if (this.currentDoc.docType != "2") {
          this.recordDate = new Date().format("yyyyMMdd HHmm");
          let res = data.data.content
            ? JSON.parse(data.data.content)
            : { eleList: [], eleEventList: [], docStyles: {} };
          let list = res.eleList;
          if (list.length) {
            let docStyleData = [{}];
            this.$set(docStyleData, 0, {
              docTypeCode: this.currentDoc.docTypeCode,
              templateCode: data.data.templateCode,
              elementName: data.data.templateName,
              docVersion: this.currentDoc.docVersion,
              id: data.data.id,
              templateVersion: data.data.templateVersion,
              templateStatus: data.data.templateStatus,
              mrModelCd: data.data.mrModelCd || 1,
              deletedStatus: data.data.deletedStatus,
              dataVersion: data.data.dataVersion,
              level: 1,
              ...res
            });
            // this.toolValue = { ...res.docStyles } || this.toolValue;
            this.toolValue = {
              ...res.docStyles,
              widthAll: res.docStyles.widthAll || "100",
              heightAll: res.docStyles.heightAll || "100",
              col: res.docStyles.col || 5,
              lineHeight: res.docStyles.lineHeight || 35,
              widthEle: "",
              heightEle: ""
            };
            await this.digui(docStyleData[0], 1);
            this.docStyleData = deepClone(docStyleData);
            //获取引用元素值
            await this.getQuoteEveList(this.docStyleData[0], "0");
            //获取基本元素值
            await this.setBasicEle(this.docStyleData[0], "0");
            await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
          } else {
            this.$message(data.msg || "文书结构为空");
          }
        }
      }
      if (this.currentDocRecord.recordId) {
        let docStyleData = [{}];
        if (data.data.lstDocRecords && data.data.lstDocRecords.length) {
          let res = data.data.lstDocRecords[0].recordContent
            ? JSON.parse(data.data.lstDocRecords[0].recordContent)
            : { eleList: [], eleEventList: [] };
          if (this.currentDocRecord.docType != "2") {
            //处理混合类型数据
            this.$set(docStyleData, 0, {
              ...res,
              docTypeCode: this.currentDocRecord.docTypeCode,
              docCode: data.data.lstDocRecords[0].docCode,
              elementName: this.currentDocRecord.label,
              mrModelCd: this.currentDocRecord.docType || "",
              deletedStatus: data.data.lstDocRecords[0].deletedStatus,
              // docVersion: data.data.lstDocRecords[0].docVersion,
              docVersion: this.currentDocRecord.docVersion,
              dataVersion: data.data.lstDocRecords[0].dataVersion,
              level: 1
            });
            // this.toolValue = {...res.docStyles} || this.toolValue;
            this.toolValue = {
              ...res.docStyles,
              widthAll: res.docStyles.widthAll || "100",
              heightAll: res.docStyles.heightAll || "100",
              col: res.docStyles.col || 5,
              lineHeight: res.docStyles.lineHeight || 35,
              widthEle: "",
              heightEle: ""
            };
            await this.digui(docStyleData[0], 1);
            this.docStyleData = deepClone(docStyleData);
            await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
            // console.log("记录数据-混合:", docStyleData[0]);

            this.recordDate = "";
            let name = this.docStyleData[0].elementName;
            let recordDate = name.split(" ")[0];
            let recordTime = name.split(" ")[1];
            let dateTime =
              recordDate.split("-")[0] +
              recordDate.split("-")[1] +
              recordDate.split("-")[2] +
              " " +
              recordTime.split(":")[0] +
              recordTime.split(":")[1];
            this.recordDate = dateTime;
          } else if (this.currentDocRecord.docType == "2") {
            //处理单表格数据
            let arr = data.data.lstDocRecords;
            let recordId = [];
            let recordValueJson = [];
            let dataVersion = [];
            let deletedStatus = [];
            for (let i in arr) {
              let value = JSON.parse(arr[i].recordValueJson);
              for (let j in value) {
                value[j].recordId = arr[i].recordId;
                value[j].isModify = false;
              }

              recordId = recordId.concat(arr[i].recordId);
              dataVersion = dataVersion.concat(arr[i].dataVersion);
              deletedStatus = deletedStatus.concat(arr[i].deletedStatus);
              recordValueJson = recordValueJson.concat(value);
            }

            this.$set(docStyleData, 0, {
              ...res,
              docTypeCode: this.currentDocRecord.docTypeCode,
              elementName: this.currentDocRecord.recordShowName,
              docVersion: this.currentDocRecord.docVersion,
              recordDate: "",
              recordTime: "",
              mrModelCd: "2",
              level: 1,
              recordId: recordId,
              dataVersion: dataVersion,
              deletedStatus: deletedStatus,
              recordValueJson: recordValueJson
            });
            // this.toolValue = {...res.docStyles} || this.toolValue;
            this.toolValue = {
              ...res.docStyles,
              widthAll: res.docStyles.widthAll || "100",
              heightAll: res.docStyles.heightAll || "100",
              col: res.docStyles.col || 5,
              lineHeight: res.docStyles.lineHeight || 35,
              widthEle: "",
              heightEle: ""
            };
            await this.digui(docStyleData[0], 1);
            this.docStyleData = deepClone(docStyleData);
            await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
            this.getStatisticsState();
            // console.log("记录数据-单表格:", docStyleData[0]);
          }
        } else {
          this.$message(data.msg || "记录为空");
        }
      }
      //监测是否维护了出入量交互
      this.isConclusionShow = false;
      let eleEventList = this.docStyleData[0].eleEventList;
       for (let i in eleEventList) {
          let item = eleEventList[i];
          if (item.EveCode == "CDEE_Quantity"){
            this.isConclusionShow = true;
          }
       }

    },
    //统计按钮
    getStatisticsState() {
      this.isStatistics = false;
      let eleEventList = this.nursingTreeDataSave[0].eleEventList;
      for (let i in eleEventList) {
        let item = eleEventList[i];
        if (item.EveCode == "CDEE_Quantity") {
          this.isStatistics = item.allObj.quantity.isStatistics;
        }
      }
    },
    //获取本科室下的护士列表
    async getNursingList() {
      try {
        let params = {
          deptId: JSON.parse(getRole()).deptId,
          roleCode: "ZY0002" //护士编码
        };
        let res = await selectUserRoleByDeptId(params);
        if (res.code == 1) {
          let data = res.data;
          let nursingList = [];
          for (let i in data) {
            nursingList.push({
              label: data[i].userName,
              value: data[i].userName,
              ...data[i]
            });
          }
          this.nursingList = nursingList;
        } else {
          this.nursingList = [];
        }
      } catch (e) {
        this.nursingList = [];
      }
    },
    async updateRecordList(mrId, docType, isSave) {
      this.isLook = false;
      await this.$emit("updateRecordList", mrId, docType, isSave);
    },
    forCircleTable(tableItem, eleValue, tableDataItem) {
      let list = tableItem.eleList;
      for (let i in list) {
        if (Number(list[i].width) <= 0) {
          list[i].width = 80;
        }
        if (list[i].eleList && list[i].eleList.length > 0) {
          this.forCircleTable(list[i], eleValue, tableDataItem);
        } else {
          //渲染表格值
          for (let k in eleValue) {
            let obj = {};
            obj = {
              ...list[i],
              parentId: tableItem.eleId
              // eleValue: ''
            };
            //默认值
            let defaultValues = list[i]["commonAttributeDto"]["defaultValues"];
            if (list[i].elementBaseName == "多选下拉元素") {
              obj.eleValue = [];
            } else if (list[i].elementBaseName == "多选元素") {
              if (list[i].valueLst.length) {
                let eleValues = [];
                for (let j in list[i].valueLst) {
                  if (list[i].valueLst[j].defaultSelection === "1") {
                    eleValues.push(list[i].valueLst[j].vMean);
                  }
                }
                obj.eleValue = eleValues;
              } else {
                obj.eleValue = false;
              }
            } else if (list[i].elementBaseName == "单选元素") {
              if (list[i].valueLst.length) {
                for (let j in list[i].valueLst) {
                  if (list[i].valueLst[j].defaultSelection === "1") {
                    obj.eleValue = list[i].valueLst[j].vMean;
                  }
                }
              } else {
                obj.eleValue = "";
              }
            } else if (list[i].elementBaseName == "数字元素") {
              let attr = list[i].proprietaryAttributeVoLst;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "0304") {
                  list[i].maxLengthText =
                    attr[j].proprietaryContent === ""
                      ? Infinity
                      : Number(attr[j].proprietaryContent);
                }
                if (attr[j].proprietaryCode == "0303") {
                  list[i].minLengthText =
                    attr[j].proprietaryContent === ""
                      ? -Infinity
                      : Number(attr[j].proprietaryContent);
                }
                if (attr[j].proprietaryCode == "0302") {
                  list[i].precision =
                    attr[j].proprietaryContent === ""
                      ? ""
                      : Number(attr[j].proprietaryContent);
                }
                if (attr[j].proprietaryCode == "0300") {
                  list[i].unit = attr[j].proprietaryContent;
                }
                if (attr[j].proprietaryCode == "0301") {
                  list[i].unitShow = attr[j].proprietaryContent;
                }
              }
              obj.eleValue = defaultValues || undefined;
            } else if (list[i].elementBaseName == "文本元素") {
              let attr = list[i].proprietaryAttributeVoLst;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "0100") {
                  list[i].maxLengthText = attr[j].proprietaryContent;
                }
                if (attr[j].proprietaryCode == "0101") {
                  list[i].minLengthText = attr[j].proprietaryContent;
                }
              }
              obj.eleValue = defaultValues || "";
            } else if (list[i].elementBaseName == "日期元素") {
              list[i].eleValue = list[i].commonAttributeDto.defaultValues || "";
              list[i].dateFormatType = "0";
              let attr = list[i].proprietaryAttributeVoLst;
              let flag = 0;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "0700") {
                  if (attr[j].proprietaryContent === "1") {
                    flag = 1;
                  }
                } else if (attr[j].proprietaryCode == "0701") {
                  list[i].dateFormat = attr[j].proprietaryContent;
                  let datas = dateFormatDatas();
                  for (let k in datas) {
                    if (datas[k]["value"] === attr[j].proprietaryContent) {
                      list[i].dateFormatType = datas[k]["type"];
                    }
                  }
                }
              }
              if (flag === 1) {
                obj.eleValue = new Date().format(list[i].dateFormat);
              } else {
                obj.eleValue = defaultValues || "";
              }
            } else if (list[i].elementBaseName == "签名元素") {
              list[i].nursingList = this.nursingList;
              obj.eleValue = defaultValues || "";
              let attr = list[i].proprietaryAttributeVoLst;
              for (let j in attr) {
                if (attr[j].proprietaryCode == "1101") {
                  if (attr[j].proprietaryContent == "1") {
                    obj.eleValue = Base64.decode(getUserName());
                  }
                }
              }
            } else {
              obj.eleValue = defaultValues || "";
            }
            // if (!tableDataItem[list[i].eleId] && list[i].eleId) {
            if (list[i].eleId) {
              this.$set(tableDataItem, list[i].eleId, deepClone(obj));
            }
            //}

            if (eleValue[k][list[i].eleId]) {
              //文书有值（记录）
              let objs = {};
              objs = eleValue[k][list[i].eleId];
              this.$set(eleValue[k], list[i].eleId, deepClone(objs));
            } else {
              //文书无值（文书结构）
              this.$set(eleValue[k], list[i].eleId, deepClone(obj));
            }
          }
        }
      }
    },
    // eslint-disable-next-line complexity
    digui(item, level) {
      let list = item.eleList;
      for (let i in list) {
        list[i].level = Number(level) + 1;
        list[i].eleId =
          list[i].eleId ||
          list[i].elementCode +
            Math.random()
              .toString()
              .substr(3, 7);
        list[i].resizable = false;
        list[i].enable = list[i].enable || list[i].enable === undefined ? true : false;
        list[i].visible = list[i].visible || list[i].visible === undefined ? true : false;
        //默认值
        let defaultValues = list[i]["commonAttributeDto"]["defaultValues"];
        if (list[i].elementBaseName == "表格元素") {
          if (list[i].eleValue && list[i].eleValue.length) {
            list[i].eleValue = list[i].eleValue || [];
          } else {
            list[i].eleValue = [];
            list[i].basicEleValue = this.basicEleValue;
            let elementAttribute = list[i].proprietaryAttributeVoLst;
            let num = 1;
            for (let j in elementAttribute) {
              if (elementAttribute[j].proprietaryCode == "1401") {
                num = elementAttribute[j].proprietaryContent || 1;
              }
            }
            for (let k = 0; k < num; k++) {
              list[i].eleValue.push({});
            }
          }
          list[i].tableDataItem = list[i].tableDataItem || {};
          this.forCircleTable(
            list[i],
            list[i].eleValue,
            list[i].tableDataItem
          );
        } else if (list[i].elementBaseName == "数字元素") {
          let attr = list[i].proprietaryAttributeVoLst;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "0304") {
              list[i].maxLengthText =
                attr[j].proprietaryContent === ""
                  ? Infinity
                  : Number(attr[j].proprietaryContent);
            }
            if (attr[j].proprietaryCode == "0303") {
              list[i].minLengthText =
                attr[j].proprietaryContent === ""
                  ? -Infinity
                  : Number(attr[j].proprietaryContent);
            }
            if (attr[j].proprietaryCode == "0302") {
              list[i].precision =
                attr[j].proprietaryContent === ""
                  ? ""
                  : Number(attr[j].proprietaryContent);
            }
            if (attr[j].proprietaryCode == "0300") {
              list[i].unit = attr[j].proprietaryContent;
            }
            if (attr[j].proprietaryCode == "0301") {
              list[i].unitShow = attr[j].proprietaryContent;
            }
          }
          list[i].eleValue =
            list[i].eleValue !== undefined
              ? list[i].eleValue
              : defaultValues || undefined;
        } else if (list[i].elementBaseName == "文本元素") {
          let attr = list[i].proprietaryAttributeVoLst;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "0100") {
              list[i].maxLengthText = attr[j].proprietaryContent;
            } else if (attr[j].proprietaryCode == "0101") {
              list[i].minLengthText = attr[j].proprietaryContent;
            }
          }
          list[i].eleValue =
            list[i].eleValue !== undefined
              ? list[i].eleValue
              : defaultValues || "";
        } else if (list[i].elementBaseName == "日期元素") {
          list[i].dateFormatType = "0";
          let attr = list[i].proprietaryAttributeVoLst;
          let flag = 0;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "0701") {
              list[i].dateFormat = attr[j].proprietaryContent;
              let datas = dateFormatDatas();
              for (let k in datas) {
                if (datas[k]["value"] === attr[j].proprietaryContent) {
                  list[i].dateFormatType = datas[k]["type"];
                }
              }
            }
            if (attr[j].proprietaryCode == "0700") {
              if (attr[j].proprietaryContent === "1") {
                flag = 1;
              }
            }
          }
          if (flag === 1) {
            list[i].eleValue =
              list[i].eleValue !== undefined
                ? list[i].eleValue
                : new Date().format(list[i].dateFormat);
          } else {
            list[i].eleValue =
              list[i].eleValue !== undefined
                ? list[i].eleValue
                : defaultValues || "";
          }
        } else if (list[i].elementBaseName == "多选下拉元素") {
          list[i].eleValue =
            list[i].eleValue !== undefined ? list[i].eleValue : [];
        } else if (list[i].elementBaseName == "多选元素") {
          if (list[i].eleValue === undefined || list[i].eleValue === "") {
            if (list[i].valueLst.length) {
              let eleValues = [];
              for (let j in list[i].valueLst) {
                if (list[i].valueLst[j].defaultSelection === "1") {
                  eleValues.push(list[i].valueLst[j].vMean);
                }
              }
              list[i].eleValue = eleValues;
            } else {
              list[i].eleValue = false;
            }
          }
        } else if (list[i].elementBaseName == "单选元素") {
          if (list[i].eleValue === undefined) {
            if (list[i].valueLst.length) {
              for (let j in list[i].valueLst) {
                if (list[i].valueLst[j].defaultSelection === "1") {
                  list[i].eleValue = list[i].valueLst[j].vMean;
                }
              }
            } else {
              list[i].eleValue = "";
            }
          }
        } else if (list[i].elementBaseName == "签名元素") {
          let attr = list[i].proprietaryAttributeVoLst;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "1101") {
              if (attr[j].proprietaryContent == "1") {
                list[i].eleValue =
                  list[i].eleValue || Base64.decode(getUserName());
              }
            }
          }
        } else {
          list[i].eleValue =
            list[i].eleValue !== undefined
              ? list[i].eleValue
              : defaultValues || "";
        }
        if (list[i].eleList && list[i].eleList.length) {
          this.digui(list[i], list[i].level, [], 1);
        }
      }
    },
    /*4.处理更新数据*/
    //更新接口
    // eslint-disable-next-line complexity
    async updateRecord(isSave) {
      if (this.juageDocType === "01") {
        //病历编辑器
        if (isSave === 0) {
          // 调用编辑器内部保存功能
          this.$refs.recordEditorRander.savePassParent();
        } else if (isSave === 1) {
          // 调用编辑器内部删除功能
          let flag = await this.$refs.recordEditorRander.delete();
          // 重新刷新树结构
          flag && (await this.updateRecordList(false));
        }
        return;
      }
      //文书编辑器
      if (isSave === 1) {
        if (this.docStyleData[0].mrModelCd != "2") {
          //混合类型删除
          if (this.currentDocRecord && this.currentDocRecord.recordId) {
            this.$confirm("是否删除本条记录?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {
              this.saveRecord(isSave);
            });
          } else {
            this.$message("请选中一条记录再进行操作!");
          }
        } else if (this.docStyleData[0].mrModelCd == "2") {
          //单表格删除
          await this.$refs.tableType.updateRecord(isSave);
        }
      } else {
        if (this.docStyleData[0].mrModelCd != "2") {
          //混合类型保存
          if (this.recordDate) {
            this.saveRecord(isSave);
          } else {
            this.$message("请填写记录日期在进行保存!");
          }
        } else if (this.docStyleData[0].mrModelCd == "2") {
          //单表格保存
          await this.$refs.tableType.updateRecord(isSave);
        }
      }
    },
    //混合类型更新
    async saveRecord(isSave) {
      let docStyleData = deepClone(this.docStyleData);
      // console.log(docStyleData)
      // 校验文书是否为单次书写
      if (isSave === 0 && this.currentDoc.docId) {
        if (
          this.currentDoc.templatePO.writeNum === "03" &&
          this.currentDoc.lstDocRecords.length === 1
        ) {
          this.$message.error(
            "本篇文书仅支持单次书写，并且文书下已经有一条文书记录，不可重复书写！"
          );
          return;
        }
      }
      let flag = "0";
      let arr = [];
      let rulesFlag = await this.forCircle(
        docStyleData[0].eleList,
        arr,
        flag,
        isSave
      );
      if (rulesFlag === false) {
        return;
      }
      this.$showLoading();
      try {
        let params = await this.handleData(docStyleData, isSave);
        // console.log("保存的数据", params);
        let data = await saveOrUpdateDocClass(params);
        if (data.code == "1") {
          this.$message.success("更新成功");
          this.$hideLoading();
          if (isSave === 0 && this.currentDocRecord.recordId) {
            //混类类型-保存-编辑
            await this.updateRecordList(
              this.currentDocRecord.nodeKey,
              3,
              isSave
            );
            return;
          }
          if (isSave === 0 && this.currentDoc.docId) {
            //混类类型-保存-新增
            await this.updateRecordList(false, 3, isSave);
            return;
          }
          //混类类型-删除
          await this.updateRecordList(false, 3, isSave);
        } else {
          this.$message.error(data.msg || "更新失败");
          this.$hideLoading();
        }
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "更新失败");
      }
    },
    // eslint-disable-next-line complexity
    forCircle(list, tableValue, flag, isSave) {
      for (let i in list) {
        if (!list[i].eleId) {
          this.$delete(list, i);
          if (!this.forCircle(list, tableValue, flag, isSave)) {
            return false;
          }
          return true;
        }
        this.$delete(list[i], "idNew");
        this.$delete(list[i], "level");
        // this.$delete(list[i], "width");
        // this.$delete(list[i], "colNum");
        // this.$delete(list[i], "col");
        this.$delete(list[i], "resizable");
        this.$delete(list[i], "index");
        // this.$delete(list[i], "enable");
        // this.$delete(list[i], "visible");
        this.$delete(list[i], "basicEleValue");
        // console.log(list[i]);

        if (list[i].elementBaseName == "表格元素") {
          // this.$delete(list[i], "tableDataItem");
          let arr = list[i].eleValue;
          console.log(list[i].eleValue);
          if (list[i].eleList && list[i].eleList.length > 0) {
            let flag = "1";
            if (!this.forCircle(list[i].eleList, arr, flag, isSave)) {
              return false;
            }
          }
        } else if (flag == "1") {
          if (tableValue.length > 0) {
            list[i].eleValue = [];
            for (let j in tableValue) {
              for (let k in tableValue[j]) {
                // 判断是否可为空属性
                let isNull =
                  tableValue[j][k].hasOwnProperty("commonAttributeDto") &&
                  tableValue[j][k].commonAttributeDto.checkEmpty === "1";
                if (
                  tableValue[j][k].elementCode &&
                  (tableValue[j][k].elementBaseName == "文本元素" ||
                    tableValue[j][k].elementBaseName == "数字元素" ||
                    tableValue[j][k].elementBaseName == "签名元素" ||
                    tableValue[j][k].elementBaseName == "日期元素") &&
                  tableValue[j][k].commonAttributeDto.checkEmpty === "0" &&
                  tableValue[j][k].eleValue === "" &&
                  isSave === 0
                ) {
                  this.$message.error(
                    "【" + tableValue[j][k].elementName + "】不可为空"
                  );
                  return false;
                }
                if (
                  tableValue[j][k].elementCode &&
                  (tableValue[j][k].elementBaseName == "多选元素" ||
                    tableValue[j][k].elementBaseName == "多选下拉元素") &&
                  tableValue[j][k].commonAttributeDto.checkEmpty === "0" &&
                  (!tableValue[j][k].eleValue ||
                    !tableValue[j][k].eleValue.length) &&
                  isSave === 0
                ) {
                  this.$message.error(
                    "【" + tableValue[j][k].elementName + "】不可为空"
                  );
                  return false;
                }
                if (
                  tableValue[j][k].elementCode &&
                  (tableValue[j][k].elementBaseName == "单选元素" ||
                    tableValue[j][k].elementBaseName == "单选下拉元素") &&
                  tableValue[j][k].commonAttributeDto.checkEmpty === "0" &&
                  (tableValue[j][k].eleValue === "" ||
                    tableValue[j][k].eleValue === undefined) &&
                  isSave === 0
                ) {
                  this.$message.error(
                    "【" + tableValue[j][k].elementName + "】不可为空"
                  );
                  return false;
                }
                if (
                  tableValue[j][k].elementCode &&
                  tableValue[j][k].elementBaseName == "文本元素" &&
                  tableValue[j][k].minLengthText !== undefined &&
                  tableValue[j][k].minLengthText !== "" &&
                  tableValue[j][k].eleValue !== undefined &&
                  tableValue[j][k].eleValue.length <
                    tableValue[j][k].minLengthText &&
                  isSave === 0 &&
                  !isNull
                ) {
                  this.$message.error(
                    "【" +
                      tableValue[j][k].elementName +
                      "】值的长度不可小于" +
                      tableValue[j][k].minLengthText
                  );
                  return false;
                }
                if (
                  tableValue[j][k].elementCode &&
                  tableValue[j][k].elementBaseName == "数字元素" &&
                  tableValue[j][k].minLengthText !== undefined &&
                  tableValue[j][k].minLengthText !== "" &&
                  tableValue[j][k].eleValue !== undefined &&
                  Number(tableValue[j][k].eleValue) <
                    Number(tableValue[j][k].minLengthText) &&
                  isSave === 0 &&
                  !isNull
                ) {
                  this.$message.error(
                    "【" +
                      tableValue[j][k].elementName +
                      "】值不可小于" +
                      tableValue[j][k].minLengthText
                  );
                  return false;
                }
                if (
                  tableValue[j][k].elementCode &&
                  tableValue[j][k].elementBaseName == "数字元素" &&
                  tableValue[j][k].maxLengthText !== undefined &&
                  tableValue[j][k].maxLengthText !== "" &&
                  tableValue[j][k].eleValue !== undefined &&
                  Number(tableValue[j][k].eleValue) >
                    Number(tableValue[j][k].maxLengthText) &&
                  isSave === 0 &&
                  !isNull
                ) {
                  this.$message.error(
                    "【" +
                      tableValue[j][k].elementName +
                      "】值不可大于" +
                      tableValue[j][k].maxLengthText
                  );
                  return false;
                }
                if (list[i].eleId == k) {
                  //将表格数据循环填入元素树的eleValue中
                  list[i].eleValue.push(tableValue[j][k].eleValue);
                }
              }
            }
            // return true;
          }
          if (list[i].eleList && list[i].eleList.length > 0) {
            let flag = "1";
            if (!this.forCircle(list[i].eleList, tableValue, flag, isSave)) {
              return false;
            }
            return true;
          }
        } else if (list[i].eleList && list[i].eleList.length > 0) {
          let flag = "0";
          let arr = [];
          if (!this.forCircle(list[i].eleList, arr, flag, isSave)) {
            return false;
          }
        } else if (
          list[i].elementCode &&
          (list[i].elementBaseName == "文本元素" ||
            list[i].elementBaseName == "数字元素" ||
            list[i].elementBaseName == "签名元素" ||
            list[i].elementBaseName == "日期元素") &&
          list[i].commonAttributeDto.checkEmpty === "0" &&
          (list[i].eleValue === "" || list[i].eleValue === undefined) &&
          isSave === 0
        ) {
          this.$message.error("【" + list[i].elementName + "】不可为空");
          return false;
        } else if (
          list[i].elementCode &&
          (list[i].elementBaseName == "多选元素" ||
            list[i].elementBaseName == "多选下拉元素") &&
          list[i].commonAttributeDto.checkEmpty === "0" &&
          (!list[i].eleValue || !list[i].eleValue.length) &&
          isSave === 0
        ) {
          this.$message.error("【" + list[i].elementName + "】不可为空");
          return false;
        } else if (
          list[i].elementCode &&
          (list[i].elementBaseName == "单选元素" ||
            list[i].elementBaseName == "单选下拉元素") &&
          list[i].commonAttributeDto.checkEmpty === "0" &&
          (list[i].eleValue === "" || list[i].eleValue === undefined) &&
          isSave === 0
        ) {
          this.$message.error("【" + list[i].elementName + "】不可为空");
          return false;
        } else if (
          list[i].elementCode &&
          list[i].elementBaseName == "文本元素" &&
          list[i].minLengthText !== undefined &&
          list[i].minLengthText !== "" &&
          list[i].eleValue !== undefined &&
          list[i].eleValue.length < list[i].minLengthText &&
          isSave === 0 &&
          list[i].commonAttributeDto.checkEmpty !== "1"
        ) {
          this.$message.error(
            "【" +
              list[i].elementName +
              "】值的长度不可小于" +
              list[i].minLengthText
          );
          return false;
        } else if (
          list[i].elementCode &&
          list[i].elementBaseName == "数字元素" &&
          list[i].minLengthText !== undefined &&
          list[i].minLengthText !== "" &&
          // list[i].eleValue !== undefined &&
          Number(list[i].eleValue) < Number(list[i].minLengthText) &&
          isSave === 0 &&
          list[i].commonAttributeDto.checkEmpty !== "1"
        ) {
          this.$message.error(
            "【" + list[i].elementName + "】值不可小于" + list[i].minLengthText
          );
          return false;
        } else if (
          list[i].elementCode &&
          list[i].elementBaseName == "数字元素" &&
          list[i].maxLengthText !== undefined &&
          list[i].maxLengthText !== "" &&
          // list[i].eleValue !== undefined &&
          Number(list[i].eleValue) > Number(list[i].maxLengthText) &&
          isSave === 0 &&
          list[i].commonAttributeDto.checkEmpty !== "1"
        ) {
          this.$message.error(
            "【" + list[i].elementName + "】值不可大于" + list[i].maxLengthText
          );
          return false;
        }
      }
      return true;
    },
    // eslint-disable-next-line complexity
    handleData(data, isSave) {
      let params;
      if (this.currentDoc.nodeLevel === 2 && this.currentDoc.docType != "2") {
        //混合文书
        params = [
          {
            dataVersion: data[0].dataVersion,
            docCode: data[0].templateCode || "",
            // docVersion: data[0].templateVersion,
            docVersion: data[0].docVersion,
            docType: this.currentDoc.docType || "1",
            deptCode: this.role.deptCode,
            inpCode: this.receivePatientData.treatNo,
            recordDate: this.recordDate.split(" ")[0],
            recordTime: this.recordDate.split(" ")[1],
            deletedStatus: isSave === 0 ? data[0].deletedStatus : "1",
            recordContent: {
              docCode: data[0].templateCode || "",
              // docVersion: data[0].templateVersion,
              docVersion: data[0].docVersion,
              eleList: data[0].eleList,
              eleEventList: data[0].eleEventList,
              docStyles: data[0].docStyles || this.toolValue
            }
          }
        ];
      } else {
        params = [
          {
            dataVersion: data[0].dataVersion,
            recordId: this.currentDocRecord.recordId || "",
            docCode: data[0].docCode || "",
            docVersion: data[0].docVersion || "",
            docType: this.currentDocRecord.docType || "",
            deptCode: this.role.deptCode,
            // deptCode: '92',
            inpCode: this.receivePatientData.treatNo,
            // inpCode: 'INP191113001',
            recordDate: this.recordDate.split(" ")[0],
            recordTime: this.recordDate.split(" ")[1],
            deletedStatus: isSave === 0 ? data[0].deletedStatus : "1",
            recordContent: {
              docCode: data[0].docCode || "",
              docVersion: data[0].docVersion || "",
              eleList: data[0].eleList,
              eleEventList: data[0].eleEventList,
              docStyles: data[0].docStyles || this.toolValue
            }
          }
        ];
      }
      return params;
    },
    //添加小结
    addConclusion(name) {
      this.conclusionDialogProp = {
        flag: true,
        date: new Date(),
        name: name
      };
    },
    //添加统计
    addStatistics() {
      this.statisticsDialogProp = {
        flag: true,
        date: new Date()
      };
    },
    //获取数据引用
    async getQuoteEveList(data, flag) {
      let eleEventList = data.eleEventList ? data.eleEventList : [];
      let QuoteList = {};
      eleEventList.forEach(item => {
        if (item.EveCode == "CDEE_QUOTE") {
          QuoteList = item.QuoteList;
        }
      });
      let eleTypeNodes = [];
      for (let i in QuoteList) {
        let nodes = [];
        if (QuoteList[i].length) {
          for (let j in QuoteList[i]) {
            nodes.push({
              eleId: QuoteList[i][j].eleId,
              eleColumn: QuoteList[i][j].value
            });
          }
          eleTypeNodes.push({
            type: this.quoteMatch[i],
            nodes: nodes
          });
        }
      }
      if (eleTypeNodes.length) {
        await this.getInitDocEle(eleTypeNodes, data.eleList, flag);
      }
    },
    //获取数据引用的值
    async getInitDocEle(eleTypeNodes, data, flag) {
      try {
        let params = {
          inpCode: this.receivePatientData.treatNo || "",
          eleTypeNodes: eleTypeNodes
        };
        let res = await initDocEle(params);
        if (res.code == "1") {
          if (flag == "0") {
            await this.setQuoteValue(res.data, data);
          } else if (flag == "1") {
            this.isQuote = {
              flag: true,
              quoteValue: res.data
            };
          }
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    //将值赋给文书中
    async setQuoteValue(data, docData) {
      for (let i in data) {
        for (let j in data[i].nodes) {
          await this.findCircle(docData, data[i].nodes[j].eleId, function(
            item
          ) {
            item.eleValue = data[i].nodes[j].eleValue;
          });
        }
      }
    },
    //寻找要计算的元素的值
    findCircle(eleList, eleId, fn) {
      for (let i in eleList) {
        if (eleList[i].eleId == eleId) {
          fn(eleList[i]);
        }
        if (eleList[i].eleList && eleList[i].eleList.length) {
          this.findCircle(eleList[i].eleList, eleId, fn);
        }
      }
    },
    //基本元素赋值
    async getBasicEle() {
      let response = await getMacroValues({
        patientId: this.receivePatientData.patientId,
        enId: this.receivePatientData.treatNo,
        enTpCd: '04',
        isHome: '1'
      });
      if (response.code == 1) {
        this.basicEleValue = response.data;
        this.handleBasicEle();
      } else {
        this.basicEleValue = [];
      }
    },
    //基本元素反显
    async handleBasicEle() {
      let data = this.basicEleValue;
      let params = {
        code: [],
        table: []
      };
      for (let i in data) {
        if (data[i].elementCode === "M0002") {
          //性别
          params.code.push({
            field: "name",
            code: "GENDER_CODE",
            val: data[i].elementValue
          });
        } else if (data[i].elementCode === "M0023") {
          //诊断
          let tableName = "fin_icd10_dictionary";
          let conditionMap = {
            icd10_encoding: data[i].elementValue
          };
          let columns = "dictionary_name";
          let key = `${tableName}_${columns}_${JSON.stringify(conditionMap)}`;
          data[i].keyCode = key;
          data[i].columns = columns;
          params.table.push({
            tableName,
            conditionMap,
            columns,
            key
          });
        } else if (data[i].elementCode === "M0019") {
          //科室
          let tableName = "sys_org";
          let conditionMap = {
            org_type: "_DEPT_",
            id: data[i].elementValue
          };
          let columns = "org_nm";
          let key = `${tableName}_${columns}_${JSON.stringify(conditionMap)}`;
          data[i].keyCode = key;
          data[i].columns = columns;
          params.table.push({
            tableName,
            conditionMap,
            columns,
            key
          });
        }
      }

      let res = await transformCode(params.code);
      if (res.code === 1) {
        for (let i in data) {
          if (data[i].elementCode === "M0002") {
            data[i].elementValueCode = data[i].elementValue;
            data[i].elementValue = res.data["GENDER_CODE"];
          }
        }
      }
      let res1 = await this.transformTables(params.table);
      for (let i in data) {
        if (
          data[i].elementCode === "M0023" ||
          data[i].elementCode === "M0019"
        ) {
          data[i].elementValueCode = data[i].elementValue;
          data[i].elementValue =
            res1[data[i]["keyCode"]][0][data[i]["columns"]];
        }
      }
    },
    //表反显
    async transformTable({ columns, conditionMap, tableName }) {
      try {
        let data = {
          tableName: tableName || "",
          columns: columns || "",
          conditionMap: conditionMap || {}
        };
        let resData = await getTableData(data);
        if (resData.code === 1 && resData.data != []) {
          return Promise.resolve(resData.data[0][columns]);
        }
        return "";
      } catch (error) {
        return "";
      }
    },
    async transformTables(data) {
      try {
        let resData = await getTableDatas(data);
        if (resData.code === 1) {
          return Promise.resolve(resData.data);
        }
        return {};
      } catch (error) {
        return {};
      }
    },
    setBasicEle(data, flag) {
      let _this = this;
      let basicEleValue = this.basicEleValue;
      if (flag === "0") {
        for (let i in basicEleValue) {
          _this.findCircleBasic(
            data.eleList,
            basicEleValue[i].elementCode,
            function(item) {
              item.eleValue = basicEleValue[i].elementValue;
            }
          );
        }
      } else if (flag === "1") {
        this.isBasicEleValue = {
          flag: true,
          basicEleValue: basicEleValue
        };
      }
    },
    //寻找要计算的元素的值
    findCircleBasic(eleList, elementCode, fn) {
      for (let i in eleList) {
        if (eleList[i].elementCode == elementCode) {
          fn(eleList[i]);
        }
        if (eleList[i].eleList && eleList[i].eleList.length) {
          this.findCircleBasic(eleList[i].eleList, elementCode, fn);
        }
      }
    },
    //复制表格文书单行或多行
    tableCopy() {
      this.$refs.tableType && this.$refs.tableType.tableCopy();
    },
    //单表格文书
    addTableItem() {
      //校验是否单次书写
      if (this.currentDocRecord) {
        if (
          this.currentDocRecord.templatePO &&
          this.currentDocRecord.templatePO.writeNum === "03" &&
          this.$refs.tableType.tableData.length === 1
        ) {
          this.$message.error(
            "本篇文书仅支持单次书写，并且文书下已经有一条文书记录，不可重复书写！"
          );
          return;
        }
      }
      if (this.currentDoc) {
        if (
          this.currentDoc.templatePO &&
          this.currentDoc.templatePO.writeNum === "03" &&
          this.$refs.tableType.tableData.length === 1
        ) {
          this.$message.error(
            "本篇文书仅支持单次书写，并且文书下已经有一条文书记录，不可重复书写！"
          );
          return;
        }
      }
      this.$refs.tableType && this.$refs.tableType.addTableItem();
    },
    //打印
    async printData() {
      await this.getPrintTemp();
      // console.log(this.printTempData.printTemplateContent)
      let printData = {};
      if (this.docStyleData[0].mrModelCd != "2") {
        //混合文书打印
        await this.printForCircle(
          this.nursingTreeDataSave[0].eleList,
          printData
        );
        printData.recordDate = "";
        printData.recordTime = "";
      } else {
        //单表格文书打印
        await this.printForCircleTable(this.nursingTreeDataSave[0], printData);
      }
      let printBasicEle = this.handlePrintBasicEle();
      printData = {
        ...printData,
        ...printBasicEle
      };
      console.log("printData", printData);
      await onPreview(deepClone(printData), {
        editorContent: this.printTempData.printTemplateContent,
        tpicked: "one",
        title: "打印模板预览"
      });
    },
    //处理打印数据(混合)
    async printForCircle(list, printData) {
      for (let i in list) {
        if (list[i].elementCode && list[i].elementBaseName == "表格元素") {
          printData[list[i].eleId] = [];
          for (let j in list[i].eleValue) {
            let dataItem = list[i].eleValue[j];
            let obj = {};
            for (let k in dataItem) {
              obj[k] = await this.handlePrintValue(dataItem[k], 0);
            }
            printData[list[i].eleId].push({ ...obj });
          }
        } else if (
          list[i].elementCode &&
          list[i].eleList &&
          list[i].eleList.length > 0
        ) {
          await this.printForCircle(list[i].eleList, printData);
        } else if (list[i].elementCode) {
          printData[list[i].eleId] = await this.handlePrintValue(list[i], 1);
        }
      }
    },
    //处理打印数据(表格)
    async printForCircleTable(list, printData) {
      let recordValueJson = list.recordValueJson;
      printData[list.docCode] = [];
      for (let i in recordValueJson) {
        let dataItem = recordValueJson[i];
        let obj = {};
        for (let k in dataItem) {
          obj[k] = await this.handlePrintValue(dataItem[k]);
        }
        printData[list.docCode].push({ ...obj });
      }
    },
    //元素值转变为打印值(type:0为表格里的元素，1为平铺元素)
    handlePrintValue(item, type) {
      let value = "";
      if (
        item.elementBaseName == "多选元素" ||
        item.elementBaseName == "多选下拉元素"
      ) {
        if (item.elementBaseName == "多选下拉元素" || type === 0) {
          let arr = [];
          for (let i in item.eleValue) {
            if (item.hasOwnProperty("valueLst") && item.valueLst.length) {
              for (let j in item.valueLst) {
                if (
                  item.eleValue[i] === item.valueLst[j].vMean ||
                  item.eleValue[i] === item.valueLst[j].vCode
                ) {
                  let printVal =
                    item.valueLst[j].printVal === undefined ||
                    item.valueLst[j].printVal === "";
                  !printVal && arr.push(item.valueLst[j].printVal);
                }
              }
            }
          }
          for (let i in arr) {
            if (i == 0) {
              value = arr[i];
            } else {
              value = value + "," + arr[i];
            }
          }
        } else if (item.elementBaseName == "多选元素" && type === 1) {
          value = [];
          if (item.hasOwnProperty("valueLst") && item.valueLst.length) {
            for (let i in item.valueLst) {
              value.push({
                content: item.valueLst[i].vMean,
                check:
                  item.eleValue.indexOf(item.valueLst[i].vMean) > -1
                    ? "checked"
                    : "ch"
              });
            }
          }
        }
      } else if (
        item.elementBaseName == "单选元素" ||
        item.elementBaseName == "单选下拉元素"
      ) {
        if (item.elementBaseName == "单选下拉元素" || type === 0) {
          if (item.hasOwnProperty("valueLst") && item.valueLst.length) {
            for (let j in item.valueLst) {
              if (
                item.eleValue === item.valueLst[j].vMean ||
                item.eleValue === item.valueLst[j].vCode
              ) {
                value = item.valueLst[j].printVal;
              }
            }
          }
        } else if (item.elementBaseName == "单选元素" && type === 1) {
          value = [];
          if (item.hasOwnProperty("valueLst") && item.valueLst.length) {
            for (let i in item.valueLst) {
              value.push({
                content: item.valueLst[i].vMean,
                // select: item.eleValue == item.valueLst[i].vMean ? "checked" : "ch"
                check:
                  item.eleValue == item.valueLst[i].vMean ? "checked" : "ch"
              });
            }
          }
        }
      } else {
        value = item.eleValue;
      }
      return value;
    },
    //设置基本元素为打印格式
    handlePrintBasicEle() {
      let data = this.basicEleValue;
      if (!data.length) {
        return {};
      }
      let printData = {};
      for (let i in data) {
        printData[data[i].elementCode] = data[i].elementValue;
      }
      return printData;
    },
    //获取打印模板
    async getPrintTemp() {
      let params = {
        docCode: this.currentDocRecord.docCode || this.currentDoc.docCode,
        docVersion:
          this.currentDocRecord.docVersion || this.currentDoc.docVersion
      };
      try {
        let res = await getDocPrintTemplateList(params);
        if (res.code === 1) {
          this.printTempData = {
            ...printTempData,
            ...res.data
          };
        } else {
          this.$message.error(res.msg || "查询打印模板失败!");
        }
      } catch (e) {
        this.$message.error(e.msg || "查询打印模板失败!");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.docRecord {
  .left-bar {
    width: 250px;
    padding: 20px;
    padding-top: 0;
    border-right: 1px solid $l-color-bgcolor-11;

    .tree-cont {
      height: calc(100% - 114px);
      margin-top: 15px;
      overflow: scroll;
      /deep/.el-tree-node {
        white-space: normal;
        min-width: 100%;
        display: inline-block;
      }
      /deep/.el-tree-node__content {
        white-space: nowrap;
      }
    }
  }

  .right-content {
    width: calc(100% - 250px);
    padding: 20px 0 20px 20px;

    .nav-bar {
      margin-right: 20px;
      margin-bottom: 20px;
    }

    .doc-content {
      /*width: calc(100% - 20px);*/
      height: calc(100% - 56px);
      /*margin-right: 20px;*/
    }
  }
}
</style>
