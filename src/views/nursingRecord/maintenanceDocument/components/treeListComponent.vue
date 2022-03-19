<template>
  <div class="treeListComponent height100">
    <el-card class="docRecord width100 height100">
      <div
        class="height100 float-left"
        :style="{ width: isExpend ? '250px' : '30px' }"
      >
        <div class="left-bar width100 height100" v-show="isExpend">
          <l-card-title style="padding: 25px 0">
            <template slot="left">护理文书</template>
            <template slot="right">
              <el-tooltip effect="light" content="收起" placement="right">
                <el-button
                  icon="iconfont el-icon-arrow-left"
                  class="little-button"
                  @click="pickUp"
                ></el-button>
              </el-tooltip>
            </template>
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
        <div class="left-mini height100" v-show="!isExpend" @click="pickUp">
          <i class="special-icon el-icon-arrow-right"></i>
          <p class="text">展开文书树</p>
        </div>
      </div>
      <div
        class="right-content height100 float-right"
        :style="{
          width: isExpend ? 'calc(100% - 250px)' : 'calc(100% - 30px)',
        }"
      >
        <!-- 渲染区域 -->
        <analyComponent
          ref="analyComponent"
          :docStyleDataInit="docStyleData"
          :currentDoc="currentDoc"
          :currentDocRecord="currentDocRecord"
          :juageDocType="juageDocType"
          :toolsQuote="toolsQuote"
          :recordData="recordData"
          @updateRecordList="updateRecordList"
        ></analyComponent>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import analyComponent from "./analyComponent";

import {
  getDocInfoNoPage,
  getDocVersionInfo,
  getDocVersionInfoGZ
} from "@/api/emrRecord/nursingRecord/docInfoMaintain";

import {
  getDocRecord,
  getDocRecordByDateTime,
  getDocRecordGZ,
  getDocRecordByTimeGZ
} from "@/api/emrRecord/nursingRecord/docRecord";
import { initDocEle } from "@/api/emrRecord/nursingRecord/docToolInteraction";

import Base64 from "@/utils/base64";
import { getPamars, getUserName } from "@/utils/auth";
import { deepClone } from "@/utils/index";

export default {
  name: "treeListComponent",
  components: { analyComponent },
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
      docStyleData: {},
      //当前选中的某一个文书
      currentDoc: {},
      //当前选中的某一个记录数据
      currentDocRecord: {},
      // 默认是护理文书类型
      juageDocType: "02",
      recordData: {},
      nursingTreeDataSave: [],
      //控制左侧树结构收起与展开
      isExpend: true
    };
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData"]),
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("user", ["role"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    receivePatientData: {
      async handler(val) {
        this.filterText = "";
        if (JSON.stringify(val) != "{}") {
          await this.searchGZ();
          //   await this.getBasicEle();
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
    //控制左侧树结构收起与展开
    pickUp() {
      this.isExpend = !this.isExpend;
    },
    filterNode(value, data, node) {
      /* if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1; */

      if (!value) return true;
      let if_one = data.label.indexOf(value) !== -1;
      let if_two =
        node.parent &&
        node.parent.data &&
        node.parent.data.label &&
        node.parent.data.label.indexOf(value) !== -1;
      let if_three =
        node.parent &&
        node.parent.parent &&
        node.parent.parent.data &&
        node.parent.parent.data.label &&
        node.parent.parent.data.label.indexOf(value) !== -1;
      let result_one = false;
      let result_two = false;
      let result_three = false;
      if (node.level === 1) {
        result_one = if_one;
      } else if (node.level === 2) {
        result_two = if_one || if_two;
      } else if (node.level === 3) {
        result_three = if_one || if_two || if_three;
      }
      return result_one || result_two || result_three;
    },
    //1.获取文书列表
    async searchGZ() {
      this.leftTreeData = [];
      this.docStyleData = {};
      this.$refs.analyComponent && (this.$refs.analyComponent.isLook = false);
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
          this.leftTreeData = list;
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
        // +
        // Math.random()
        //   .toString()
        //   .substr(3, 7);
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
        // +
        // Math.random()
        //   .toString()
        //   .substr(3, 7);
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
          // +
          // Math.random()
          //   .toString()
          //   .substr(3, 7);
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
          // +
          // Math.random()
          //   .toString()
          //   .substr(3, 7);
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
          this.docStyleData = data;
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
          this.docStyleData = data;
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
          this.docStyleData = data;
        } else {
          this.$message.error(data.msg || "获取记录失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取记录失败");
      }
    },
    //3.点击树
    // eslint-disable-next-line complexity
    async treeClick(data, node) {
      this.$refs.analyComponent && (this.$refs.analyComponent.isLook = false);
      this.juageDocType = "";
      this.recordData = {};
      this.$refs.analyComponent &&
        (this.$refs.conclusionDialogProp = {
          flag: false,
          date: new Date()
        });

      // console.log("点击左侧树数据node:", data, node);
      this.docStyleData = {};
      this.$refs.analyComponent && (this.$refs.analyComponent.recordDate = "");

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
        }
      } else if (this.juageDocType === "01") {
        let nodeLevel = node.level;
        let flag = await this.handleJuageDoc(data, node);
        this.recordData = Object.assign(data, { nodeLevel });
        if (flag) {
          this.$refs.analyComponent &&
            (this.$refs.analyComponent.isLook = true);
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
    //文书记录更新、删除。保存完成刷新
    async updateRecordList(mrId, docType, isSave) {
      let _this = this;
      // 更新左侧列表
      await this.searchGZ();
      if (mrId) {
        await this.$refs.tree.setCurrentKey(mrId);
        await this.$nextTick(async () => {
          const firstNode = document.querySelector(
            "div.el-tree-node.is-current"
          );
          await firstNode.click();
        });
      } else {
        if (docType !== 2) {
          if (isSave === 0) {
            //混合类型新增
            await _this.forCircleTree(
              _this.leftTreeData,
              3,
              "docId",
              _this.currentDoc.docId,
              async item => {
                await _this.$refs.tree.setCurrentKey(item.nodeKey);
                await _this.$nextTick(async () => {
                  const firstNode = document.querySelector(
                    "div.el-tree-node.is-current"
                  );
                  await firstNode.click();
                });
              }
            );
            return;
          }
          if (isSave === 1) {
            //混合类型删除
            await _this.forCircleTree(
              _this.leftTreeData,
              2,
              "docId",
              _this.currentDocRecord.docId,
              async item => {
                await _this.$refs.tree.setCurrentKey(item.nodeKey);
                await _this.$nextTick(async () => {
                  const firstNode = document.querySelector(
                    "div.el-tree-node.is-current"
                  );
                  await firstNode.click();
                });
              }
            );
            return;
          }
        } else {
          //表格类型
          let docId = _this.currentDoc.docId || _this.currentDocRecord.docId;
          await _this.forCircleTree(
            _this.leftTreeData,
            2,
            "docId",
            docId,
            async item => {
              await _this.$refs.tree.setCurrentKey(item.nodeKey);
              await _this.$nextTick(async () => {
                const firstNode = document.querySelector(
                  "div.el-tree-node.is-current"
                );
                await firstNode.click();
              });
            }
          );
          return;
        }
      }
    },
    async forCircleTree(list, level, name, docId, fn) {
      for (let i in list) {
        if (list[i].level === level) {
          if (level === 3 && name == "docId") {
            let time = list[i]["recordDate"] + " " + list[i]["recordTime"];
            if (
              list[i][name] == docId &&
              time == this.$refs.analyComponent.recordDate
            ) {
              fn(list[i]);
            }
          } else if (list[i][name] == docId) {
            fn(list[i]);
          }
        } else if (list[i].children && list[i].children.length > 0) {
          await this.forCircleTree(list[i].children, level, name, docId, fn);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.treeListComponent {
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
        height: calc(100% - 56px);
      }
    }

    .little-button {
      width: 24px;
      height: 24px;
      padding-left: 0px;
      padding-right: 0px;
      padding-top: 0px;
      padding-bottom: 0px;
      margin-left: 0px;
      .el-button--default {
        padding: 5px 20px 5px 14px;
      }
    }
    .el-button {
      border-color: transparent;
    }
    .little-button:hover {
      background-color: transparent;
    }

    .left-mini {
      width: 30px;
      background-color: #f5f5f5;
      cursor: pointer;
      .special-icon {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        text-align: center;
        border-bottom: 1px solid #e4e4e4;
      }
      .text {
        margin-top: 10px;
        width: 30px;
        text-align: center;
        font-size: 16px;
        word-wrap: break-word;
      }
    }
  }
}
</style>
