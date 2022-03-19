<template>
  <div class="basicTemp height100">
    <div class="basicTemp-top">
      <div class="tool-left height100">
        <LFormtTitle label="模板名称" style="width: 180px; margin-right: 3px">
          <el-input v-model="paramsData.templateName" size="mini" type="text">
          </el-input>
        </LFormtTitle>
        <LFormtTitle label="所属级别" style="width: 180px; margin-right: 3px">
          <l-value-domain-emr
            style="width: 100%"
            code="LevelType"
            :value.sync="paramsData.scopeLevel"
            placeholder="请选择"
            @change="changeOwner"
          ></l-value-domain-emr>
        </LFormtTitle>
        <LFormtTitle label="所属名称" style="width: 180px; margin-right: 3px">
          <el-select
            v-model="paramsData.ownerId"
            filterable
            clearable
            collapse-tags
            multiple
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in nOwnNameOpt"
              :key="item.id"
              :label="item.orgNm"
              :value="item.id"
            ></el-option>
          </el-select>
        </LFormtTitle>
        <LFormtTitle
          label="所属文书"
          style="width: 180px; margin-right: 3px"
          :disabled="!this.isNewCreat"
        >
          <l-value-domain-emr
            type="noselect"
            style="width: 100%"
            clearable
            filterable
            :value.sync="paramsData.docCode"
            remoteUrl="/template/hos-page"
            remoteShowKey="templateName"
            remoteValueKey="templateCode"
            :remoteParams="{
              pageSize: 1000000,
              pageNo: 1,
              templateStatus: 1,
              dnFlag: 2,
            }"
            :localFilterKeys="['templateName']"
            placeholder="请选择文书"
            :disabled="!this.isNewCreat"
            @change="docChange"
          ></l-value-domain-emr>
        </LFormtTitle>
        <LFormtTitle label="适用病种" style="width: 180px; margin-right: 3px">
          <l-value-domain-emr
            type="noselect"
            style="width: 100%"
            clearable
            filterable
            :value.sync="paramsData.diseaseCode"
            remoteUrl="/diseases/params"
            remoteShowKey="diseasesName"
            remoteValueKey="diseasesId"
            :remoteParams="{
              deletedStatus: '0',
              enabled: '1',
            }"
            :localFilterKeys="['diseasesName']"
            placeholder="请选择病种"
          ></l-value-domain-emr>
        </LFormtTitle>
      </div>
      <div class="tool-right height100">
        <el-button type="primary" @click="addBasicTemp">新建</el-button>
        <el-button type="primary" @click="saveBasicTemp">保存</el-button>
        <el-button type="primary" plain @click="deleteBasicTemp"
          >删除</el-button
        >
      </div>
    </div>
    <div class="basicTemp-content" v-if="basicTempLook">
      <div class="height100">
        <tableCol
          class="width100 height100"
          v-if="
            docStyleData.mrModelCd !== undefined &&
            docStyleData.mrModelCd != '2'
          "
          :treeData="docStyleData"
        ></tableCol>
        <tableType
          ref="tableType"
          class="width100 height100"
          v-if="
            docStyleData.mrModelCd !== undefined &&
            docStyleData.mrModelCd == '2'
          "
          :treeData="docStyleData"
          :nursingList="nursingList"
        ></tableType>
      </div>
    </div>
  </div>
</template>
<script>
import tableCol from "./tableCol";
import tableType from "./tableType";


import { deepClone } from "@/utils/index";
import Base64 from "@/utils/base64";
import {
  getPamars,
  getUserName,
  getRoles,
  getRole,
  setRole
} from "@/utils/auth";
import { getUId, getUN } from "@/utils/crypto.js";

import {
  getDocBasicTreeList,
  getDocBasicTemplateList,
  addOrUpDocBasicTemplate,
  deleteDocBasicTemplate
} from "@/api/emrRecord/nursingRecord/basicTemp";

import { getOrgDeptList } from "@/api/admin/user";
import { getDocVersionInfoGZ } from "@/api/emrRecord/nursingRecord/docInfoMaintain";
import { dateFormatDatas } from "./retrieveSelect";

export default {
  name: "basicTemp",
  props: {
    treeData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    tableCol,
    tableType
  },
  data() {
    return {
      //控制视图是否显示
      basicTempLook: false,
      //业务模板参数
      paramsData: {},
      docStyleData: {},
      toolValue: {},
      isLook: false,
      //所属名称
      nOwnNameOpt: [],
      docInfoData: [],
      //是否为新建
      isNewCreat: true,
      nursingList: []
    };
  },
  watch: {
    treeData: {
      handler(val) {
        this.docStyleData = {};
        if (val && val.hasOwnProperty("id") && !this.isNewCreat) {
          this.docStyleData = val;
          this.paramsData = {
            templateName: val.templateName,
            scopeLevel: val.scopeLevel,
            ownerId: val.ownerId,
            docCode: val.docCode,
            diseaseCode: val.diseaseCode
          };
          this.basicTempLook = true;
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    //获取当前科室下的护士列表（当前科室改变的时候）
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
    changeOwner() {
      if (this.paramsData.scopeLevel === "0") {
        // 全院的情况
        let hosId = JSON.parse(getPamars()).hosId;
        let hosName = JSON.parse(getPamars()).hosName;
        this.nOwnNameOpt = [{ id: hosId, orgNm: hosName }];
        this.ownerId = hosId.split(",");

        this.paramsData.ownerId = this.ownerId;
        this.multipleFlag = false;
      } else if (this.paramsData.scopeLevel === "1") {
        // 选择科室的情况
        getOrgDeptList({ id: getUId() }).then(res => {
          if (res.code === 1) {
            this.nOwnNameOpt = res.data.map(item => {
              item.id += "";
              return item;
            });
            this.paramsData.ownerId = "";
            // 非新建状态
            /* if (this.isNewBuilt) {
              this.ownerId = this.paramsData.ownerId.split(",");
            } else {
              // 新建
              this.ownerId = [this.nOwnNameOpt[0].id];
            } */
          } else {
            this.$message.error("请求数据失败");
            return;
          }
        });
      } else {
        // 选择个人的情况
        this.nOwnNameOpt = [{ id: getUId(), orgNm: getUN() }];
        this.paramsData.ownerId = "";
        // this.paramsData.ownerId = getUId().split(",");
      }
    },
    //获取当前模板数据
    getBasicTempData() {},
    //处理模板数据
    /* recordDate: "",recordTime: "",currentDoc: "",currentDocRecord:"" */
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
            // await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
            // console.log("单表格数据", docStyleData);
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
            // await this.getQuoteEveList(this.docStyleData[0], "1");
            //获取基本元素值
            // await this.setBasicEle(this.docStyleData[0], "1");
            // await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
          }
          // this.getStatisticsState();
        } else if (this.currentDoc.docType != "2") {
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
              id: data.data.id,
              templateVersion: data.data.templateVersion,
              templateStatus: data.data.templateStatus,
              mrModelCd: data.data.mrModelCd || 1,
              deletedStatus: data.data.deletedStatus,
              dataVersion: data.data.dataVersion,
              level: 1,
              ...res
            });
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
            // await this.getQuoteEveList(this.docStyleData[0], "0");
            //获取基本元素值
            // await this.setBasicEle(this.docStyleData[0], "0");
            // await this.changeNursingTreeData(this.docStyleData);
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
              docVersion: data.data.lstDocRecords[0].docVersion,
              dataVersion: data.data.lstDocRecords[0].dataVersion,
              level: 1
            });
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
            // await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
            // console.log("记录数据-混合:", docStyleData[0]);

            /* this.recordDate = "";
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
            this.recordDate = dateTime; */
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
              recordDate: "",
              recordTime: "",
              mrModelCd: "2",
              level: 1,
              recordId: recordId,
              dataVersion: dataVersion,
              deletedStatus: deletedStatus,
              recordValueJson: recordValueJson
            });
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
            // await this.changeNursingTreeData(this.docStyleData);
            this.isLook = true;
            // this.getStatisticsState();
            // console.log("记录数据-单表格:", docStyleData[0]);
          }
        } else {
          this.$message(data.msg || "记录为空");
        }
      }
    },
    async digui(item, level) {
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
        //默认值
        let defaultValues = list[i]["commonAttributeDto"]["defaultValues"];
        if (list[i].elementBaseName == "表格元素") {
          if (list[i].eleValue && list[i].eleValue.length) {
            list[i].eleValue = list[i].eleValue || [];
          } else {
            list[i].eleValue = [];
            // list[i].basicEleValue = this.basicEleValue;
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
          await this.forCircleTable(
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
          await this.digui(list[i], list[i].level);
        }
      }
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
    //保存
    async saveBasicTemp() {
      let docStyleData = deepClone([this.docStyleData]);
      let params = await this.handleData(docStyleData);
      console.log("params", params);
      try {
        let res = await addOrUpDocBasicTemplate(params);
        if (res.code === 1) {
          this.$message.success("更新成功");
          this.updateLeftTree(res.data.id);
        } else {
          this.$message.error(res.msg || "更新失败");
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    forCircle(list, tableValue, flag) {
      for (let i in list) {
        if (!list[i].eleId) {
          this.$delete(list, i);
          if (!this.forCircle(list, tableValue, flag)) {
            return false;
          }
          return true;
        }
        this.$delete(list[i], "idNew");
        // this.$delete(list[i], "level");
        // this.$delete(list[i], "width");
        // this.$delete(list[i], "colNum");
        // this.$delete(list[i], "col");
        this.$delete(list[i], "resizable");
        this.$delete(list[i], "index");
        this.$delete(list[i], "enable");
        this.$delete(list[i], "visible");
        this.$delete(list[i], "basicEleValue");

        if (list[i].elementBaseName == "表格元素") {
          let arr = list[i].eleValue;
          if (list[i].eleList && list[i].eleList.length > 0) {
            let flag = "1";
            if (!this.forCircle(list[i].eleList, arr, flag)) {
              return false;
            }
          }
        } else if (flag == "1") {
          if (tableValue.length > 0) {
            list[i].eleValue = [];
            for (let j in tableValue) {
              for (let k in tableValue[j]) {
                if (list[i].eleId == k) {
                  //将表格数据循环填入元素树的eleValue中
                  list[i].eleValue.push(tableValue[j][k].eleValue);
                }
              }
            }
          }
          if (list[i].eleList && list[i].eleList.length > 0) {
            let flag = "1";
            if (!this.forCircle(list[i].eleList, tableValue, flag)) {
              return false;
            }
            return true;
          }
        } else if (list[i].eleList && list[i].eleList.length > 0) {
          let flag = "0";
          let arr = [];
          if (!this.forCircle(list[i].eleList, arr, flag)) {
            return false;
          }
        }
      }
      return true;
    },
    async handleData(data) {
      let params = {
        id: data[0].id === undefined ? "" : data[0].id,
        dataVersion:
          data[0].dataVersion === undefined ? "" : data[0].dataVersion,
        docCode: this.paramsData.docCode || "",
        docVersion:
          data[0].docVersion === undefined
            ? data[0].templateVersion
            : data[0].docVersion,
        docType: this.paramsData.mrModelCd || "1",
        templateName: this.paramsData.templateName,
        diseaseCode: this.paramsData.diseaseCode,
        scopeLevel: this.paramsData.scopeLevel,
        ownerId: this.paramsData.ownerId,
        templateContent: {
          docCode: this.paramsData.docCode || "",
          docVersion:
            data[0].docVersion === undefined
              ? data[0].templateVersion
              : data[0].docVersion,
          eleList: data[0].eleList,
          eleEventList: data[0].eleEventList,
          docStyles: data[0].docStyles,
          mrModelCd: data[0].mrModelCd
        }
      };
      if (data[0].mrModelCd == 2) {
        //表格文书
        let tableData = this.$refs.tableType.tableData;
        params.recordValueJson = tableData;
        let list = data[0].eleList;
        await this.firCicleData(list, tableData);
        params.templateContent.eleList = list;
        params.templateContent.recordValueJson = tableData;
      }
      return params;
    },
    async firCicleData(list, value) {
      for (let i in list) {
        for (let j in value) {
          for (let k in value[j]) {
            if (list[i].eleId == k) {
              list[i].eleValue = value[j][k].eleValue;
            }
          }
        }
        if (list[i].eleList && list[i].eleList.length) {
          await this.firCicleData(list[i].eleList, value);
        }
      }
    },
    //新建
    addBasicTemp() {
      this.isNewCreat = true;
      this.basicTempLook = false;
      this.paramsData = {};
      this.docStyleData = {};
      this.updateLeftTree("");
    },
    //文书change：获取文书数据
    async docChange(value, obj) {
      if (!value) {
        return;
      }
      this.docStyleData = {};
      this.basicTempLook = false;
      await this.getDocVersionInfoGZ(obj.templateId);
      this.basicTempLook = true;
    },
    //获取文书所有元素数据
    async getDocVersionInfoGZ(id) {
      this.$showLoading();
      try {
        let params = { id };
        let res = await getDocVersionInfoGZ(params);
        if (res.code == "1") {
          let list = {};
          if (res.data.dnFlag == "1") {
            this.$message.error("文书数据为空，请先维护文书再进行操作");
            return;
          } else {
            list = res.data.content
              ? JSON.parse(res.data.content)
              : { eleList: [], eleEventList: [], docStyles: {} };
          }
          let docStyleData = {};
          docStyleData = {
            docCode: res.data.templateCode,
            docVersion: res.data.templateVersion,
            mrModelCd: res.data.mrModelCd,
            level: 1,
            ...list
          };
          await this.digui(docStyleData, 1);
          this.docStyleData = docStyleData;
        } else {
          this.$message.error(res.msg || "文书元素树获取失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "文书元素树获取失败");
      }
    },
    //删除
    async deleteBasicTemp() {
      if (this.docStyleData.id === undefined) {
        this.$message.error("请先选择一条文书模板！");
        return;
      }
      this.isNewCreat = true;
      try {
        let params = { id: this.docStyleData.id };
        let res = await deleteDocBasicTemplate(params);
        if (res.code === 1) {
          this.$message.success("更新成功");
          this.updateLeftTree("");
        } else {
          this.$message.error(res.msg || "更新失败");
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    updateLeftTree(id) {
      this.$emit("updateLeftTree", id);
    }
  }
};
</script>
<style scoped lang="scss">
.basicTemp {
  padding: 10px;
  .basicTemp-top {
    height: 50px;
    border: 1px solid $l-color-bgcolor-11;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .tool-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 10px;
    }
    .tool-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 10px;
    }
  }

  .basicTemp-content {
    height: 600px;
  }
  width200: {
  }
}
</style>
