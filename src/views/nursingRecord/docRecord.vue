<template>
  <el-card class="docRecord width100 height100">
    <div class="left-bar width100 height100 float-left">
      <l-card-title>
        <template slot="left">护理文书</template>
      </l-card-title>
      <el-input v-model="filterText" placeholder="输入关键词搜索">
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="searchGZ"
        ></i>
      </el-input>
      <div class="tree-cont width100">
        <el-tree
          ref="tree"
          :data="leftTreeData"
          :props="defaultProps"
          :highlight-current="highlightFlag"
          node-key="nodeKey"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="treeClick"
          :filter-node-method="filterNode"
        ></el-tree>
      </div>
    </div>
    <div class="right-content height100 float-right">
      <div class="nav-bar clearfix">
        <el-date-picker
          class="float-left"
          v-if="
            isLook && juageDocType == '02' && docStyleData[0].mrModelCd != '2'
          "
          v-model="recordDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyyMMdd HHmm"
          placeholder="选择记录"
        ></el-date-picker>
        <el-button
          class="float-left"
          style="margin-left: 20px"
          type="primary"
          @click="addConclusion"
          v-if="
            isLook && juageDocType == '02' && docStyleData[0].mrModelCd == '2'
          "
          >添加小结</el-button
        >
        <el-button
          class="float-right"
          style="margin-left: 20px"
          type="primary"
          plain
          :disabled="!isLook || recordData.level == 2"
          @click="updateRecord(1)"
          >删除</el-button
        >
        <el-button
          class="float-right"
          type="primary"
          :disabled="!isLook"
          @click="updateRecord(0)"
          >保存</el-button
        >
      </div>
      <div class="doc-content width100" v-if="isLook && juageDocType === '02'">
        <!--混合类型文书-->
        <tableCol
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
          :conclusionDialogProp="conclusionDialogProp"
          :isQuote="isQuote"
          :isBasicEleValue="isBasicEleValue"
          :toolsQuote="toolsQuote"
          @updateSuccess="updateSuccess"
        ></tableType>
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
  </el-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import tableCol from "./maintenanceDocument/components/tableCol";
import tableType from "./maintenanceDocument/components/tableType";
import recordEditorRander from "./maintenanceDocument/components/recordEditorRander";
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
  getDocRecordByTimeGZ
} from "@/api/emrRecord/nursingRecord/docRecord";
import { getMacroValues } from "@/api/emrRecord/emr/element";
import { initDocEle } from "@/api/emrRecord/nursingRecord/docToolInteraction";

import Base64 from "@/utils/base64";
import { getPamars, getUserName } from "@/utils/auth";
import { deepClone } from "@/utils/index";

export default {
  name: "docRecord",
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
    }
  },
  data() {
    return {
      filterText: "",
      highlightFlag: true,
      defaultProps: {
        label: "label",
        children: "children"
      },
      //树数据
      leftTreeData: [],
      //解析结构数据
      docStyleData: [],
      //当前选中的某一个文书
      currentDoc: {},
      //当前选中的某一个记录数据
      currentDocRecord: {},
      isLook: false,
      nursingTreeDataSave: [],
      //记录保存时间
      recordDate: "",
      //添加小结弹框
      conclusionDialogProp: false,
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
      juageDocType: "02", // 默认是护理文书类型
      recordData: {}
    };
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData"]),
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    // 角色数据
    ...mapGetters("user", ["role"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    receivePatientData: {
      async handler(val) {
        this.isLook = false;

        this.leftTreeData = [];
        this.filterText = "";
        if (JSON.stringify(val) != "{}") {
          await this.searchGZ();
          await this.getBasicEle();
        }
      },
      immediate: true,
      deep: true
    },
    nursingTreeData: {
      handler(val) {
        if (val && val.length > 0) {
          this.nursingTreeDataSave = [...val];
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions({
      changeNursingTreeData: "nurseDocument/changeNursingTreeData"
    }),
    async updateRecordList(mrId) {
      // 更新左侧列表
      await this.searchGZ();
      // 设置选中的文书
      this.$refs.tree.setCurrentKey(mrId);
      // 左侧被选中树结构
      this.$nextTick(() => {
        const firstNode = document.querySelector("div.el-tree-node.is-current");
        // 模拟点击
        firstNode.click();
      });
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    //1.获取文书列表
    async searchGZ() {
      this.$showLoading();
      try {
        let params = {
          deptCode: this.role.deptId,
          inpCode: this.receivePatientData.treatNo,
          sex: this.receivePatientData.gender,
          age: this.receivePatientData.age
        };
        let data = await getDocRecordGZ(params);
        if (data.code == "1") {
          let list = data.data;
          await this.handleLeftTreeData1(list);
          // console.log("左侧树数据", list);
          this.leftTreeData = list;
          this.isLook = false;
        } else {
          this.$message.error(data.msg || "获取文书信息数据失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取文书信息数据失败");
      }
    },
    handleLeftTreeData1(list) {
      for (let i in list) {
        list[i].label = list[i].className;
        list[i].children = list[i].lstDocRecordsVO;
        list[i].nodeKey = list[i].classId;

        list[i].level = 1;
        if (list[i].lstDocRecordsVO && list[i].lstDocRecordsVO.length > 0) {
          this.handleLeftTreeData2(list[i]);
        }
      }
    },
    handleLeftTreeData2(item) {
      let list = item.children;

      for (let i in list) {
        let editor = list[i].editor || item[i].templatePO.editor;
        list[i].label = list[i].docName;
        list[i].docTypeCode = item.classCode;
        // 处理护理文书和 病历文书数据
        if (editor === "01") {
          list[i].children = list[i].mrPOList;
        } else if (editor === "02") {
          list[i].children = list[i].lstDocRecords;
        }

        list[i].nodeKey = list[i].docId;

        list[i].level = 2;
        if (list[i].children && list[i].children.length > 0) {
          this.handleLeftTreeData3(list[i], editor);
        }
      }
    },
    handleLeftTreeData3(item, editor) {
      let list = item.children;
      for (let i in list) {
        list[i].docId = item.docId;
        list[i].docCode = item.docCode;
        list[i].editor = item.editor;
        list[i].docName = item.docName;
        list[i].docTypeCode = item.docTypeCode;
        if (editor === "01") {
          list[i].label = this.handleTime(list[i].bizTime);
          list[i].nodeKey = list[i].mrId;
        } else if (editor === "02") {
          let recordDate =
            list[i].recordDate.slice(0, 4) +
            "-" +
            list[i].recordDate.slice(4, 6) +
            "-" +
            list[i].recordDate.slice(6, 8);
          let recordTime;
          // 时间处理
          if (list[i].recordTime.length === 4) {
            recordTime =
              list[i].recordTime.slice(0, 2) +
              ":" +
              list[i].recordTime.slice(2, 4);
          } else {
            recordTime =
              "0" +
              list[i].recordTime.slice(0, 1) +
              ":" +
              list[i].recordTime.slice(1, 3);
          }

          list[i].label = recordDate + " " + recordTime;
          list[i].nodeKey = list[i].recordId;
        }

        list[i].level = 3;
      }
    },
    handleTime(val) {
      if (val) {
        let timeList = val.split(" ");
        let lastIndx = timeList[1].lastIndexOf(":");
        return `${timeList[0]} ${timeList[1].slice(0, lastIndx)}`;
      }
      return "";
    },
    //2.获取文书所有元素数据
    //混合类型文书
    async getDocVersionInfoMulti() {
      this.$showLoading();
      try {
        let params = {
          id: this.currentDoc.docId
        };
        let data = await getDocVersionInfoGZ(params);
        if (data.code == "1") {
          let res = data.data.content
            ? JSON.parse(data.data.content)
            : { eleList: [] };
          let list = res.eleList;
          if (list.length) {
            let docStyleData = [{}];
            this.$set(docStyleData, 0, {
              docTypeCode: this.currentDoc.docTypeCode,
              templateCode: data.data.templateCode,
              elementName: data.data.templateName,
              id: data.data.id,
              templateVersion: data.data.templateVersion,
              templateStatus: data.data.templateStatus,
              mrModelCd: data.data.mrModelCd || 1,
              deletedStatus: data.data.deletedStatus,
              dataVersion: data.data.dataVersion,
              level: 1,
              ...res
            });
            await this.digui(docStyleData[0], 1);
            //获取引用元素值
            await this.getQuoteEveList(docStyleData[0], "0");
            //获取基本元素值
            await this.setBasicEle(docStyleData[0], "0");
            this.docStyleData = docStyleData;
            // console.log("文书数据:", this.docStyleData[0]);
          } else {
            this.$message(data.msg || "文书结构为空");
          }
        } else {
          this.$message.error(data.msg || "获取文书结构失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取文书结构失败");
      }
    },
    //单表格文书（记录接口）
    // eslint-disable-next-line complexity
    async getDocVersionInfoSing() {
      this.$showLoading();
      try {
        let params = {
          templateId: this.currentDoc.docId,
          docCode: this.currentDoc.docCode || "",
          inpCode: this.receivePatientData.treatNo,
          docType: "2",
          recordDate: "",
          recordTime: ""
        };
        let data = await getDocRecordByTimeGZ(params);

        if (data.code == "1") {
          let docStyleData = [{}];
          if (data.data.lstDocRecords && data.data.lstDocRecords.length) {
            // 转化服务端数据
            let res = data.data.lstDocRecords[0].recordContent
              ? JSON.parse(data.data.lstDocRecords[0].recordContent)
              : { eleList: [] };

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
              }
              recordId = recordId.concat(arr[i].recordId);
              dataVersion = dataVersion.concat(arr[i].dataVersion);
              deletedStatus = deletedStatus.concat(arr[i].deletedStatus);
              recordValueJson = recordValueJson.concat(
                JSON.parse(arr[i].recordValueJson)
              );
            }
            this.$set(docStyleData, 0, {
              ...res,
              docTypeCode: this.currentDoc.docTypeCode,
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
            await this.digui(docStyleData[0], 1);
          } else {
            let res = JSON.parse(data.data.docContent);
            this.$set(docStyleData, 0, {
              ...res,
              docTypeCode: this.currentDoc.docTypeCode,
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

            await this.digui(docStyleData[0], 1);
            //获取引用元素值
            await this.getQuoteEveList(docStyleData[0], "1");
            //获取基本元素值
            await this.setBasicEle(docStyleData[0], "1");
          }
          this.docStyleData = docStyleData;

          // console.log("文书数据111:", this.docStyleData[0]);
        } else {
          this.$message.error(data.msg || "获取文书结构失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取文书结构失败");
      }
    },
    //2.获取记录所有的元素数据以及值
    // eslint-disable-next-line complexity
    async getDocRecord() {
      this.$showLoading();
      try {
        let params;
        if (this.currentDocRecord.docType != "2") {
          params = {
            templateId: this.currentDocRecord.docId,
            docCode: this.currentDocRecord.docCode,
            inpCode: this.currentDocRecord.inpCode,
            docType: this.currentDocRecord.docType,
            recordDate: this.currentDocRecord.recordDate,
            recordTime: this.currentDocRecord.recordTime
          };
        } else if (this.currentDocRecord.docType == "2") {
          params = {
            templateId: this.currentDocRecord.docId,
            docCode: this.currentDocRecord.docCode,
            inpCode: this.currentDocRecord.inpCode,
            docType: this.currentDocRecord.docType,
            recordDate: "",
            recordTime: ""
          };
        }
        let data = await getDocRecordByTimeGZ(params);
        if (data.code == "1") {
          if (data.data.lstDocRecords && data.data.lstDocRecords.length) {
            let res = data.data.lstDocRecords[0].recordContent
              ? JSON.parse(data.data.lstDocRecords[0].recordContent)
              : { eleList: [] };
            if (this.currentDocRecord.docType != "2") {
              //处理混合类型数据
              this.$set(this.docStyleData, 0, {
                ...res,
                docTypeCode: this.currentDocRecord.docTypeCode,
                docCode: data.data.lstDocRecords[0].docCode,
                elementName: this.currentDocRecord.label,
                mrModelCd: this.currentDocRecord.docType || "",
                deletedStatus: data.data.lstDocRecords[0].deletedStatus,
                docVersion: data.data.lstDocRecords[0].docVersion,
                dataVersion: data.data.lstDocRecords[0].dataVersion,
                level: 1
              });
              await this.digui(this.docStyleData[0], 1);
              // console.log("记录数据-混合:", this.docStyleData[0]);
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
                }

                recordId = recordId.concat(arr[i].recordId);
                dataVersion = dataVersion.concat(arr[i].dataVersion);
                deletedStatus = deletedStatus.concat(arr[i].deletedStatus);
                recordValueJson = recordValueJson.concat(
                  JSON.parse(arr[i].recordValueJson)
                );
              }

              this.$set(this.docStyleData, 0, {
                ...res,
                docTypeCode: this.currentDocRecord.docTypeCode,
                elementName: this.currentDocRecord.recordShowName,
                recordDate: "",
                recordTime: "",
                mrModelCd: "2",
                level: 1,
                recordId: recordId,
                dataVersion: dataVersion,
                deletedStatus: deletedStatus,
                recordValueJson: recordValueJson
              });
              await this.digui(this.docStyleData[0], 1);
              // console.log("记录数据-单表格:", this.docStyleData[0]);
            }
          } else {
            this.$message(data.msg || "记录为空");
          }
        } else {
          this.$message.error(data.msg || "获取记录失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取记录失败");
      }
    },
    // 递归循环docStyleData，更改数据
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
        list[i].enable = true;
        list[i].visible = true;
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
          list[i].tableDataItem = {};
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
            list[i].eleValue !== undefined ? list[i].eleValue : "";
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
            list[i].eleValue !== undefined ? list[i].eleValue : "";
        } else if (list[i].elementBaseName == "日期元素") {
          let attr = list[i].proprietaryAttributeVoLst;
          let flag = 0;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "0701") {
              list[i].dateFormat = attr[j].proprietaryContent;
              // console.log(list[i].dateFormat, "list[i].dateFormat");
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
            // console.log(
            //   new Date().format(list[i].dateFormat),
            //   "new Date().format(list[i].dateFormat)"
            // );
          } else {
            list[i].eleValue =
              list[i].eleValue !== undefined ? list[i].eleValue : "";
          }
        } else if (list[i].elementBaseName == "多选下拉元素") {
          list[i].eleValue =
            list[i].eleValue !== undefined ? list[i].eleValue : [];
        } else if (list[i].elementBaseName == "多选元素") {
          if (list[i].eleValue === undefined || list[i].eleValue == "") {
            list[i].eleValue = list[i].valueLst.length ? [] : false;
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
            list[i].eleValue !== undefined ? list[i].eleValue : "";
        }
        if (list[i].eleList && list[i].eleList.length) {
          this.digui(list[i], list[i].level, [], 1);
        }
      }
    },
    //3.点击树
    // eslint-disable-next-line complexity
    async treeClick(data, node) {
      this.isLook = false;
      this.juageDocType = "";
      this.recordData = {};
      this.conclusionDialogProp = {
        flag: false,
        date: new Date()
      };
      // console.log("点击左侧树数据node:", data, node);
      this.docStyleData = [];
      this.recordDate = "";

      if (node.level == 1) {
        return;
      }

      this.juageDocType = data.editor ? data.editor : data.templatePO.editor;
      if (this.juageDocType === "02") {
        // 护理文书渲染逻辑
        if (node.level == 2) {
          this.currentDocRecord = {};
          //点击为文书，渲染录入样式
          this.currentDoc = {
            nodeLevel: 2,
            ...data
          };

          if (data.docType != "2") {
            await this.getDocVersionInfoMulti();
          } else if (data.docType == "2") {
            await this.getDocVersionInfoSing();
          }
          // 存入 vuex
          await this.changeNursingTreeData(this.docStyleData);
          this.isLook = true;
        } else if (node.level == 3) {
          this.currentDoc = {};
          this.currentDocRecord = {
            ...data,
            nodeLevel: 3,
            recordShowName: node.parent.label,
            docType: node.parent.data.docType
          };
          //点击为记录，渲染数据
          await this.getDocRecord();

          // 存入 vuex
          await this.changeNursingTreeData(this.docStyleData);
          this.recordDate = "";
          if (data.docType != "2") {
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
          }
          this.isLook = true;
        }
      } else if (this.juageDocType === "01") {
        let nodeLevel = node.level;

        /* if (node.level == 2) {
          this.currentDocRecord = {};
          //点击为文书，渲染录入样式
          this.currentDoc = {
            nodeLevel: 2,
            ...data
          };
          this.isLook = true;
        } else if (node.level == 3) {
          this.currentDoc = {};
          this.currentDocRecord = {
            ...data,
            nodeLevel: 3,
            recordShowName: node.parent.label
          };
          this.isLook = true;
        } */
        // this.recordData = Object.assign(data, { nodeLevel });

        // console.log(this.recordData, "this.recordData");
        let flag = await this.handleJuageDoc(data, node);
        this.recordData = Object.assign(data, { nodeLevel });
        if (flag) {
          this.isLook = true;
        }
      }
    },
    async handleJuageDoc(data, node) {
      let nodeLevel = node.level;
      if (node.level == 2) {
        this.currentDocRecord = {};
        //点击为文书，渲染录入样式
        this.currentDoc = {
          nodeLevel: 2,
          ...data
        };
        return true;
      } else if (node.level == 3) {
        this.currentDoc = {};
        this.currentDocRecord = {
          ...data,
          nodeLevel: 3,
          recordShowName: node.parent.label
        };
        return true;
      }
      return false;
    },
    /*4.处理更新数据*/
    //更新接口
    // eslint-disable-next-line complexity
    async updateRecord(isSave) {
      if (this.juageDocType === "01") {
        if (isSave === 0) {
          // 调用编辑器内部保存功能
          this.$refs.recordEditorRander.savePassParent();
        } else if (isSave === 1) {
          // 调用编辑器内部删除功能
          let flag = await this.$refs.recordEditorRander.delete();
          // 重新刷新树结构

          flag && (await this.searchGZ());
        }

        return;
      }
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
          this.$message("更新成功");
          await this.searchGZ();
          this.isLook = false;
          if (isSave === 0) {
            await this.showRecord();
          }
        } else {
          this.$message.error(data.msg || "更新失败");
        }
        this.$hideLoading();
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
        this.$delete(list[i], "colNum");
        this.$delete(list[i], "col");
        this.$delete(list[i], "resizable");
        this.$delete(list[i], "index");
        this.$delete(list[i], "enable");
        this.$delete(list[i], "visible");
        this.$delete(list[i], "basicEleValue");
        // console.log(list[i]);

        if (list[i].elementBaseName == "表格元素") {
          this.$delete(list[i], "tableDataItem");
          let arr = list[i].eleValue;
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
                if (
                  tableValue[j][k].elementCode &&
                  (tableValue[j][k].elementBaseName == "文本元素" ||
                    tableValue[j][k].elementBaseName == "数字元素") &&
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
                  tableValue[j][k].elementBaseName == "文本元素" &&
                  tableValue[j][k].minLengthText !== undefined &&
                  tableValue[j][k].minLengthText !== "" &&
                  tableValue[j][k].eleValue !== undefined &&
                  tableValue[j][k].eleValue.length <
                    tableValue[j][k].minLengthText &&
                  isSave === 0
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
                  isSave === 0
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
                  isSave === 0
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
            list[i].elementBaseName == "数字元素") &&
          list[i].commonAttributeDto.checkEmpty === "0" &&
          list[i].eleValue === "" &&
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
          isSave === 0
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
          list[i].eleValue !== undefined &&
          Number(list[i].eleValue) < Number(list[i].minLengthText) &&
          isSave === 0
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
          list[i].eleValue !== undefined &&
          Number(list[i].eleValue) > Number(list[i].maxLengthText) &&
          isSave === 0
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
            docVersion: data[0].templateVersion || "",
            docType: this.currentDoc.docType || "1",
            deptCode: this.role.deptCode,
            inpCode: this.receivePatientData.treatNo,
            recordDate: this.recordDate.split(" ")[0],
            recordTime: this.recordDate.split(" ")[1],
            deletedStatus: isSave === 0 ? data[0].deletedStatus : "1",
            recordContent: {
              docCode: data[0].templateCode || "",
              docVersion: data[0].templateVersion || "",
              eleList: data[0].eleList,
              eleEventList: data[0].eleEventList
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
              eleEventList: data[0].eleEventList
            }
          }
        ];
      }
      return params;
    },
    //更新记录之后渲染之前保存的记录（表格类型）
    async updateSuccess(isSave) {
      await this.searchGZ();
      // console.log(isSave, this.docStyleData, "docStyleData");
      if (isSave === 0) {
        await this.showRecord();
      }
    },
    async showRecord() {
      let _this = this;
      if (this.currentDoc.docId) {
        if (this.currentDoc.docType == "2") {
          this.currentDocRecord = {};
          this.forCircleTree(
            this.leftTreeData,
            2,
            "docId",
            this.currentDoc.docId,
            async item => {
              _this.$refs.tree.setCurrentKey(item.nodeKey);
              await this.getDocVersionInfoSing();
              await this.changeNursingTreeData(this.docStyleData);
              this.isLook = true;
            }
          );
        } else if (this.currentDoc.docType != "2") {
          this.forCircleTree(
            this.leftTreeData,
            3,
            "docId",
            this.currentDoc.docId,
            async item => {
              _this.$refs.tree.setCurrentKey(item.nodeKey);
              let currentDocRecord = {
                ...item,
                nodeLevel: 3,
                recordShowName: _this.currentDoc.label,
                docType: _this.currentDoc.docType
              };
              _this.currentDoc = {};
              _this.currentDocRecord = currentDocRecord;
              await _this.getDocRecord();

              // 存入 vuex
              await _this.changeNursingTreeData(_this.docStyleData);
              let name = _this.docStyleData[0].elementName;
              let recordDate = name.split(" ")[0];
              let recordTime = name.split(" ")[1];
              let dateTime =
                recordDate.split("-")[0] +
                recordDate.split("-")[1] +
                recordDate.split("-")[2] +
                " " +
                recordTime.split(":")[0] +
                recordTime.split(":")[1];
              _this.recordDate = dateTime;
              _this.isLook = true;
            }
          );
        }
      } else if (this.currentDocRecord.recordId) {
        this.currentDoc = {};
        this.forCircleTree(
          this.leftTreeData,
          3,
          "recordId",
          this.currentDocRecord.recordId,
          async item => {
            _this.$refs.tree.setCurrentKey(item.nodeKey);
            let currentDocRecord = {
              ..._this.currentDocRecord,
              ...item
            };
            _this.currentDocRecord = currentDocRecord;
            //点击为记录，渲染数据
            await _this.getDocRecord();
            await _this.changeNursingTreeData(_this.docStyleData);

            let name = _this.docStyleData[0].elementName;
            let recordDate = name.split(" ")[0];
            let recordTime = name.split(" ")[1];
            let dateTime =
              recordDate.split("-")[0] +
              recordDate.split("-")[1] +
              recordDate.split("-")[2] +
              " " +
              recordTime.split(":")[0] +
              recordTime.split(":")[1];
            _this.recordDate = dateTime;
            _this.isLook = true;
          }
        );
      }
    },
    forCircleTree(list, level, name, docId, fn) {
      for (let i in list) {
        if (list[i].level === level) {
          if (level === 3 && name == "docId") {
            let time = list[i]["recordDate"] + " " + list[i]["recordTime"];
            if (list[i][name] == docId && time == this.recordDate) {
              fn(list[i]);
            }
          } else if (list[i][name] == docId) {
            fn(list[i]);
          }
        } else if (list[i].children && list[i].children.length > 0) {
          this.forCircleTree(list[i].children, level, name, docId, fn);
        }
      }
    },
    //添加小结
    addConclusion() {
      this.conclusionDialogProp = {
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
        enTpCd: "04",
        isHome: "1"
      });
      /* let response = {
           "code": 1,
           "data": [
             {
               "elementCode": "M0001",
               "elementId": "297e36f56cf50c4b016cf50c4bbe0000",
               "elementName": "姓名",
               "elementValue": "薇恩",
               "securityF": "1"
             },
             {
               "elementCode": "M0002",
               "elementId": "297e36f56cf50c4b016cf50c531f0001",
               "elementName": "性别",
               "elementValue": "男",
               "securityF": "0"
             },
             {
               "elementCode": "M0003",
               "elementId": "297e36f56cf50c4b016cf50c57730002",
               "elementName": "年龄",
               "elementValue": "20",
               "securityF": "0"
             },
             {
               "elementCode": "M0004",
               "elementId": "297e36f56cf50c4b016cf50c5cd90003",
               "elementName": "婚姻状况",
               "elementValue": "未婚",
               "securityF": "0"
             },
             {
               "elementCode": "M0005",
               "elementId": "297e36f56cf50c4b016cf50c60a60004",
               "elementName": "民族",
               "elementValue": "汉族",
               "securityF": "0"
             },
             {
               "elementCode": "M0006",
               "elementId": "297e36f56cf50c4b016cf50c65430005",
               "elementName": "职业",
               "elementValue": "餐厅服务员",
               "securityF": "0"
             },
             {
               "elementCode": "M0007",
               "elementId": "297e36f56cf50c4b016cf50c6b450006",
               "elementName": "出生地",
               "elementValue": "中国",
               "securityF": "0"
             },
             {
               "elementCode": "M0008",
               "elementId": "297e36f56cf50c4b016cf50c72620007",
               "elementName": "工作单位",
               "elementValue": "工作单位名称",
               "securityF": "1"
             },
             {
               "elementCode": "M0009",
               "elementId": "297e36f56cf50c4b016cf50c773a0008",
               "elementName": "身份证号",
               "elementValue": "130121199103212816",
               "securityF": "1"
             },
             {
               "elementCode": "M0010",
               "elementId": "297e36f56cf50c4b016cf50c7d3e0009",
               "elementName": "现住址",
               "elementValue": "现住址北邵洼",
               "securityF": "0"
             },
             {
               "elementCode": "M0011",
               "elementId": "297e36f56cf50c4b016cf50c8203000a",
               "elementName": "电话",
               "elementValue": "15522117311",
               "securityF": "1"
             },
             {
               "elementCode": "M0012",
               "elementId": "297e36f56cf50c4b016cf50c87ce000b",
               "elementName": "健康卡号",
               "elementValue": "HEALTH_CARD_NUMBER01",
               "securityF": "1"
             },
             {
               "elementCode": "M0013",
               "elementId": "297e36f56cf50c4b016cf50c8cd5000c",
               "elementName": "住院号",
               "elementValue": "10001",
               "securityF": "1"
             },
             {
               "elementCode": "M0014",
               "elementId": "297e36f56cf50c4b016cf50c91ae000d",
               "elementName": "住院次",
               "elementValue": "1",
               "securityF": "0"
             },
             {
               "elementCode": "M0015",
               "elementId": "297e36f56cf50c4b016cf50c966d000e",
               "elementName": "床号",
               "elementValue": "bednumber01",
               "securityF": "0"
             },
             {
               "elementCode": "M0017",
               "elementId": "297e36f56cf50c4b016cf50ca1f10010",
               "elementName": "入院日期",
               "elementValue": "2020-01-14 13:38:54",
               "securityF": "0"
             },
             {
               "elementCode": "M0018",
               "elementId": "297e36f56cf50c4b016cf50ca9130011",
               "elementName": "出院日期",
               "elementValue": "2020-01-14 13:38:57",
               "securityF": "0"
             },
             {
               "elementCode": "M0019",
               "elementId": "297e36f56cf50c4b016cf50cb3960012",
               "elementName": "科室",
               "elementValue": "92",
               "securityF": "0"
             },
             {
               "elementCode": "M0020",
               "elementId": "297e36f56cf50c4b016cf50cc0890013",
               "elementName": "病区",
               "elementValue": "病区1",
               "securityF": "0"
             },
             {
               "elementCode": "M0021",
               "elementId": "297e36f56cf50c4b016cf50cc5fa0014",
               "elementName": "住院目的",
               "elementValue": "入院目的",
               "securityF": "0"
             },
             {
               "elementCode": "M0022",
               "elementId": "297e36f56cf50c4b016cf50cca150015",
               "elementName": "入院情况",
               "elementValue": "1",
               "securityF": "0"
             },
             {
               "elementCode": "M0023",
               "elementId": "297e36f56cf50c4b016cf50ccd430016",
               "elementName": "主要诊断",
               "elementValue": "霍乱",
               "securityF": "0"
             },
             {
               "elementCode": "M0024",
               "elementId": "297e36f56cf50c4b016cf50cd3180017",
               "elementName": "费别",
               "elementValue": "1",
               "securityF": "0"
             },
             {
               "elementCode": "M0025",
               "elementId": "297e36f56cf50c4b016cf50cda110018",
               "elementName": "主任医师",
               "elementValue": "主任医师",
               "securityF": "1"
             },
             {
               "elementCode": "M0026",
               "elementId": "297e36f56cf50c4b016cf50ceebf001a",
               "elementName": "主治医师",
               "elementValue": "主治医师",
               "securityF": "1"
             },
             {
               "elementCode": "M0027",
               "elementId": "297e36f56cf50c4b016cf50cfad4001b",
               "elementName": "主管医师",
               "elementValue": "主管医师",
               "securityF": "1"
             }
           ]
         };*/
      if (response.code == 1) {
        this.basicEleValue = response.data;
      } else {
        this.basicEleValue = [];
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
