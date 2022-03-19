<template>
  <div class="width100 height100 maintenbance-document">
    <div
      class="height100 maintenbance-list float-left"
      :style="{
        width: toolBoxExpanded ? 'calc(100% - 287px)' : 'calc(100% - 46px)',
      }"
    >
      <div class="left-bar height100">
        <div
          class="document-operate-con height100"
          v-show="
            activityName === 'elementList' ||
            activityName === 'isLook' ||
            activityName === 'printTemp'
          "
        >
          <l-card-title style="padding: 15px 0">
            <template slot="left">文书内容维护</template>
            <template slot="right">
              <!-- <el-button type="primary" @click="saveGZ(false, $event)">保存</el-button> -->
            </template>
          </l-card-title>
          <div>
            <el-input
              v-model="filterText"
              placeholder="输入关键词搜索"
              class="width"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="search"
              ></i>
            </el-input>
            <!--  <el-button
              type="primary"
              class="float-right margin-right-20"
              :disabled="isLook"
              @click="preView(treeData)"
              >预览</el-button> -->
          </div>
          <div class="tree-cont">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              node-key="eleId"
              :highlight-current="true"
              default-expand-all
              :expand-on-click-node="false"
              :draggable="activityName === 'elementList'"
              :indent="8"
              @node-click="treeClick"
              @node-drop="nodeDropCom"
              :filter-node-method="filterNode"
            >
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <template v-if="node.level == '1'">
                  <div class="tree-label-cont">
                    <div class="tree-label width100">{{ node.label }}</div>
                  </div>
                </template>
                <template v-else>
                  <div class="tree-label-cont clearfix">
                    <div
                      class="tree-label float-left"
                      style="width: calc(100% - 52px)"
                      :title="
                        data.elementCode
                          ? data.commonAttributeDto.placeholderText ||
                            data.elementName
                          : ''
                      "
                    >
                      {{ node.label }}
                    </div>
                    <div
                      class="float-right"
                      style="margin-left: 10px"
                      @click.stop="deleteItem(node, data)"
                      v-if="activityName === 'elementList'"
                    >
                      <i class="iconfont iconshanchu"></i>
                    </div>
                  </div>
                </template>
              </div>
            </el-tree>
          </div>
        </div>
        <div class="document-operate-con height100">
          <el-tabs
            type="card"
            v-model="basicTempName"
            :before-leave="basicBeforeLeave"
          >
            <el-tab-pane label="当前" name="currentDoc"></el-tab-pane>
            <el-tab-pane label="全部" name="allDoc">
              <el-tree
                ref="basicTempAllTree"
                node-key="nodeId"
                :data="basicTempAllTreeData"
                :props="basicTempProps"
                :highlight-current="true"
                default-expand-all
                :expand-on-click-node="false"
                :indent="8"
                @node-click="basicTempTreeClick"
              ></el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="right-com">
        <el-tabs
          type="card"
          v-model="activityName"
          @tab-click="tabClick"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="文书内容维护" name="elementList">
            <div class="width100 height100">
              <elementList
                @update="update"
                :activityName="activityName"
              ></elementList>
            </div>
          </el-tab-pane>
          <el-tab-pane label="预览调整维护" name="isLook">
            <div class="width100 height100 analy-cont">
              <div class="tool-cont">
                <div class="tool-cont-left float-left height100">
                  <span class="tool-title height100">全局</span>
                  <LFormtTitle
                    label="总宽"
                    style="width: 100px; margin-right: 5px"
                  >
                    <el-input
                      v-model="toolValue.widthAll"
                      size="mini"
                      type="text"
                      @blur="updateStyleWidthAll"
                    >
                      <i slot="suffix" class="el-input__icon">%</i>
                    </el-input>
                  </LFormtTitle>
                  <LFormtTitle
                    label="总高"
                    style="width: 100px; margin-right: 5px"
                  >
                    <el-input
                      v-model="toolValue.heightAll"
                      size="mini"
                      type="text"
                      @blur="updateStyleHeightAll"
                    >
                      <i slot="suffix" class="el-input__icon">%</i>
                    </el-input>
                  </LFormtTitle>
                  <LFormtTitle
                    label="列数"
                    style="width: 90px; margin-right: 5px"
                  >
                    <el-input
                      v-model="toolValue.col"
                      size="mini"
                      type="text"
                      @blur="updateStyleCol"
                    ></el-input>
                  </LFormtTitle>
                  <LFormtTitle
                    label="行高"
                    style="width: 110px; margin-right: 5px"
                  >
                    <el-input
                      v-model="toolValue.lineHeight"
                      size="mini"
                      type="text"
                      @blur="updateStyleLineHeight"
                    >
                      <i slot="suffix" class="el-input__icon">px</i>
                    </el-input>
                  </LFormtTitle>
                  <el-checkbox
                    v-model="toolValue.layoutStyle"
                    @change="updateStyle(treeData)"
                    >横向布局</el-checkbox
                  >
                  <span class="tool-title height100">元素</span>
                  <LFormtTitle
                    label="宽"
                    style="width: 100px; margin-right: 5px"
                  >
                    <el-select
                      v-model="toolValue.widthEle"
                      @change="updateStyleWidthEle"
                    >
                      <el-option
                        v-for="(item, index) in widthEleOptions"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                  <LFormtTitle
                    label="高"
                    style="width: 100px; margin-right: 5px"
                  >
                    <el-input
                      v-model="toolValue.heightEle"
                      size="mini"
                      type="text"
                      @blur="updateStyleHeightEle"
                    >
                      <i slot="suffix" class="el-input__icon">px</i>
                    </el-input>
                  </LFormtTitle>
                  <el-checkbox v-model="checkedElement">调整元素</el-checkbox>
                </div>
                <div class="tool-cont-right float-right height100">
                  <el-button type="primary" @click="saveGZ(false, $event)"
                    >保存</el-button
                  >
                </div>
              </div>
              <div class="main-cont" v-if="isLook && activityName === 'isLook'">
                <div
                  :style="{
                    width: widthAll + '%',
                    height: heightAll + '%',
                  }"
                >
                  <tableCol
                    class="width100 height100"
                    v-if="treeData[0].mrModelCd != '2'"
                    :treeData="treeDataCopy"
                    :styleEle="styleEle"
                    @saveFunc="saveGZ(true)"
                  ></tableCol>
                  <tableType
                    class="width100 height100"
                    v-if="treeData[0].mrModelCd == '2'"
                    :treeData="treeDataCopy"
                    :nursingList="nursingList"
                    @saveFunc="saveGZ(true)"
                  ></tableType>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="打印模板维护" name="printTemp">
            <printTemp
              :currentData="currentData"
              v-if="activityName === 'printTemp'"
              :treeData="treeData[0]"
            ></printTemp>
          </el-tab-pane>
          <el-tab-pane label="业务模板维护" name="basicTemp">
            <div class="width100 height100" v-if="activityName === 'basicTemp'">
              <basicTemp
                ref="basicTempRef"
                :treeData="treeDataBasicCopy"
                :basicTempName="basicTempName"
                @updateLeftTree="updateLeftTree"
              ></basicTemp>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div
      class="tool-box float-right height100"
      :style="{ width: toolBoxExpanded ? '287px' : '46px' }"
    >
      <tool-box
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        :boxName="defaultBoxName"
        :modules="boxs"
        :nursingTreeDatas="treeData"
      ></tool-box>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import tableCol from "./components/tableCol";
import tableType from "./components/tableType";
import elementList from "./components/elementList";
import printTemp from "./components/printTemp";
import basicTemp from "./components/basicTemp";
import toolBox from "@/views/public/tools/emrTools";

import { upVersion } from "@/api/emrRecord/emr/template";
import {
  getDocVersionInfoGZ,
  saveOrUpdateDocVersionInfoGZ
} from "@/api/emrRecord/nursingRecord/docInfoMaintain";
import { selectUserRoleByDeptId } from "@/api/emrRecord/nursingRecord/docRecord";
import {
  getDocBasicTreeList,
  getDocBasicTemplateList
} from "@/api/emrRecord/nursingRecord/basicTemp";

import { dateFormatDatas } from "./components/retrieveSelect";


import Base64 from "@/utils/base64";
import {
  getPamars,
  getUserName,
  getRoles,
  getRole,
  setRole
} from "@/utils/auth";
import { deepClone } from "@/utils/index";

export default {
  name: "",
  components: {
    tableCol,
    tableType,
    elementList,
    toolBox,
    printTemp,
    basicTemp
  },
  props: ["templateId"],
  data() {
    return {
      templateIdInit: "",
      activityName: "elementList",
      filterText: "",
      defaultProps: {
        children: "eleList",
        label: "elementName"
      },
      basicTempProps: {
        children: "children",
        label: "label"
      },
      //树数据
      treeData: [],
      openStatus: "",
      uDataVersion: "",
      treeDataCopy: {},
      data: "",
      currentData: {},
      // currentNode: {},
      isLook: false,
      //保存的时候提交的数据(最新的)
      nursingTreeDataSave: [],
      //工具箱
      boxs: ["docToolInteraction", "docToolBasicElement"],
      defaultBoxName: "docToolInteraction",
      toolBoxExpanded: false,
      //本科室下的护士列表
      nursingList: [],
      //文书样式控制
      checkedElement: false,
      toolValue: {
        isChanged: false, //全局：true,局部：false
        layoutStyle: false,
        widthAll: "100",
        heightAll: "100",
        col: 5,
        lineHeight: 35,
        widthEle: "",
        heightEle: ""
      },
      widthEleOptions: ["20%", "40%", "60%", "80%", "100%"],
      styleEle: {
        attr: "",
        flag: false
      },
      widthAll: 100,
      heightAll: 100,
      isModify: false,
      basicTempName: "currentDoc",
      //全部业务模板树数据
      basicTempAllTreeData: [],
      //当前业务模板树数据
      basicTempCurrentTreeData: [],
      //传给业务模板的数据
      treeDataBasicCopy: {}
    };
  },
  watch: {
    templateId: {
      handler(val) {
        if (val) {
          this.templateIdInit = val;
        }
      },
      immediate: true,
      deep: true
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    nursingTreeData: {
      async handler(val) {
        if (val && val.length > 0) {
          // await this.syncTreeData();
          this.nursingTreeDataSave = [...val];
          this.isModify = !this.isModify
            ? this.nursingTreeDataSave[0].isModify || false
            : true;
        }
      },
      immediate: true,
      deep: true
    },
    currentCtr: {
      handler(val) {
        this.toolValue = {
          ...this.toolValue,
          widthEle: val.currentControl.colNum ? val.currentControl.colNum : "",
          heightEle: val.currentControl.lineHeight
            ? val.currentControl.lineHeight
            : ""
        };
      },
      immediate: true,
      deep: true
    },
    isLook: {
      handler(val) {
        if (!val) {
          //关闭预览界面，清除当前选择的元素
          this.changeCurrentCtr({
            currentControl: {},
            currentIndex: -1
          });
        }
      }
    }
  },
  provide() {
    return {
      toolValue: () => this.toolValue,
      checkedElement: () => this.checkedElement
    };
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData", "currentCtr"])
  },
  async created() {
    await this.getNursingList();
    await this.search();
  },
  methods: {
    ...mapActions({
      changeNursingTreeData: "nurseDocument/changeNursingTreeData",
      changeCurrentCtr: "nurseDocument/changeCurrentCtr"
    }),
    async basicBeforeLeave(activeName, oldActiveName) {
      this.treeDataBasicCopy = {};
      if (activeName === "currentDoc") {
      } else if (activeName === "allDoc") {
        await this.getBasicTreeAll();
      }
    },
    //获取业务模板左侧树（全部）
    async getBasicTreeAll() {
      try {
        let res = await getDocBasicTreeList();
        if (res.code === 1) {
          // console.log("全部业务模板数据", res.data);
          // this.basicTempAllTreeData = res.data;
          let list = res.data;
          await this.handleBasicTreeOne(list);
          this.basicTempAllTreeData = list;
        } else {
          this.$message.error(res.msg || "获取全部业务模板失败");
        }
      } catch (e) {
        this.$message.error(e.msg || "获取全部业务模板失败");
      }
    },
    async handleBasicTreeOne(list) {
      for (let i in list) {
        list[i].nodeId = list[i].id;
        if (list[i].children && list[i].children.length) {
          await this.handleBasicTreeTwo(list[i].children);
        }
      }
    },
    async handleBasicTreeTwo(list) {
      for (let i in list) {
        list[i].nodeId = list[i].exts.keyId;
      }
    },
    //点击业务模板左侧树
    basicTempTreeClick(data, node) {
      this.$refs.basicTempRef.isNewCreat = true;
      this.$refs.basicTempRef.basicTempLook = false;
      this.$refs.basicTempRef.docStyleData = {};
      this.$refs.basicTempRef.paramsData = {};
      if (node.level === 2) {
        this.$refs.basicTempRef.isNewCreat = false;
        this.getBasicTemp(data);
      }
    },
    //获取业务模板
    async getBasicTemp(node) {
      let params = {
        docCode: node.id,
        id: node.exts.keyId,
        scopeLevel: "",
        ownerId: "",
        templateName: ""
      };
      try {
        let res = await getDocBasicTemplateList(params);
        if (res.code === 1) {
          let treeData = {
            dataVersion: res.data[0].dataVersion,
            deletedStatus: res.data[0].deletedStatus,
            diseaseCode: res.data[0].diseaseCode,
            docCode: res.data[0].docCode,
            docVersion: res.data[0].docVersion,
            hosId: res.data[0].hosId,
            id: res.data[0].id,
            orgId: res.data[0].orgId,
            ownerId: res.data[0].ownerId,
            scopeLevel: res.data[0].scopeLevel,
            templateName: res.data[0].templateName,
            level: 1,
            ...JSON.parse(res.data[0].templateContent)
          };
          let treeDataBasicCopy = {};
          await this.deepCopy(treeData, treeDataBasicCopy);
          // console.log("treeDataBasicCopy", treeDataBasicCopy);
          this.treeDataBasicCopy = treeDataBasicCopy;
        } else {
          this.$message.error(res.msg || "获取全部业务模板失败");
        }
      } catch (e) {
        this.$message.error(e.msg || "获取全部业务模板失败");
      }
    },
    //刷新左侧业务模板
    async updateLeftTree(id) {
      await this.getBasicTreeAll();
      await this.$refs.basicTempAllTree.setCurrentKey(id);
      if (id) {
        this.$refs.basicTempRef.isNewCreat = false;
        let data = { id };
        await this.getBasicTemp(data);
      } else {
        this.$refs.basicTempRef.isNewCreat = true;
        this.$refs.basicTempRef.basicTempLook = false;
        this.$refs.basicTempRef.paramsData = {};
        this.$refs.basicTempRef.docStyleData = {};
      }
    },
    updateStyleWidthAll() {
      this.isModify = true;
      this.widthAll = Number(this.toolValue.widthAll) || 100;
    },
    updateStyleHeightAll() {
      this.isModify = true;
      this.heightAll = Number(this.toolValue.heightAll) || 100;
    },
    //改变列宽（全局）
    async updateStyleCol() {
      this.isModify = true;
      let col = Number(this.toolValue.col);
      if (col > 0) {
        this.widthEleOptions = [];
        for (var i = 1; i <= col; i++) {
          if (i < col) {
            this.$set(
              this.widthEleOptions,
              this.widthEleOptions.length,
              Math.floor((1 / Number(col)) * i * 100) + "%"
            );
          } else if (i == col) {
            this.$set(
              this.widthEleOptions,
              this.widthEleOptions.length,
              "100%"
            );
          }
        }
        this.toolValue.isChanged = true;
        await this.syncTreeData();
        this.styleEle = { attr: "lineWidth", flag: true, date: new Date() };
        await this.updateStyle(this.treeData);
      }
    },
    //改变行高（全局）
    async updateStyleLineHeight() {
      this.isModify = true;
      await this.syncTreeData();
      this.styleEle = { attr: "lineHeight", flag: true, date: new Date() };
      this.toolValue.isChanged = true;
      this.updateStyle(this.treeData);
    },
    //改变某个元素的宽度
    async updateStyleWidthEle() {
      this.isModify = true;
      await this.syncTreeData();
      this.styleEle = { attr: "width", flag: true, date: new Date() };
      if (this.currentCtr.currentControl.eleId) {
        this.toolValue.isChanged = false;
      }
    },
    //改变某个元素的高
    async updateStyleHeightEle() {
      this.isModify = true;
      await this.syncTreeData();
      this.styleEle = { attr: "height", flag: true, date: new Date() };
      if (this.currentCtr.currentControl.eleId) {
        this.toolValue.isChanged = false;
      }
    },
    //更新预览
    updateStyle(treeData) {
      this.isModify = true;
      this.isLook = false;
      this.preView(treeData);
    },
    //寻找要计算的元素的值
    findCircle(eleList, eleId, fn) {
      for (let i in eleList) {
        if (eleList[i].eleId == eleId) {
          fn(eleList[i], i);
        } else if (eleList[i].eleList && eleList[i].eleList.length) {
          this.findCircle(eleList[i].eleList, eleId, fn);
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
    filterNode(value, data) {
      if (!data.eleId) {
        return false;
      }
      if (!value) {
        return true;
      }
      return data.elementName.indexOf(value) !== -1;
    },
    async search() {
      this.treeDataCopy = {};
      this.isLook = false;
      this.activityName = "elementList";
      await this.getDocVersionInfoGZ();
    },
    async search1() {
      this.treeDataCopy = {};
      this.isLook = false;
      // this.activityName = "elementList";
      await this.getDocVersionInfoGZ();
    },
    async deepCopy(o1, o2) {
      for (let key in o1) {
        if (o1[key] instanceof Array) {
          o2[key] = [];
          this.deepCopy(o1[key], o2[key]);
        } else if (o1[key] instanceof Object) {
          o2[key] = {};
          this.deepCopy(o1[key], o2[key]);
        } else {
          o2[key] = o1[key];
        }
      }
    },
    async tabClick(tabs) {},
    //在tabs跳转之前
    async beforeLeave(activeName, oldActiveName) {
      if (activeName === "isLook") {
        await this.preView(this.treeData);
      } else if (activeName === "elementList") {
        await this.syncTreeData();
      } else if (activeName === "basicTemp") {
        this.treeDataBasicCopy = {};
        // await this.getBasicTreeAll();
      }
    },
    //同步treeData数据
    async syncTreeData() {
      let treeDataCopy = {};
      await this.deepCopy(this.nursingTreeDataSave[0], treeDataCopy);
      await this.handleNursingData(treeDataCopy.eleList);
      this.treeData = [treeDataCopy];
      await this.digui(this.treeData[0], 1);
      // 默认选中树结构根节点
      this.$refs.tree.setCurrentKey(this.treeData[0].id);
      this.currentData = this.treeData[0];
      // await this.changeNursingTreeData(this.treeData);
    },
    handleNursingData(list) {
      for (let i in list) {
        if (!list[i].eleId) {
          this.$delete(list, i);
          this.forCircle(list);
        } else {
          if (list[i].eleList && list[i].eleList.length > 0) {
            this.forCircle(list[i].eleList);
          }
        }
      }
    },
    //预览
    async preView(treeData) {
      //预览数据
      let treeDataCopy = {};
      await this.deepCopy(treeData[0], treeDataCopy);
      this.treeDataCopy = treeDataCopy;
      // console.log(this.treeData[0], "this.treeDataCopy");
      await this.changeNursingTreeData([treeDataCopy]);
      this.isLook = true;
    },
    /*改造---获取文书所有元素数据*/
    async getDocVersionInfoGZ() {
      this.$showLoading();
      try {
        let params = {
          id: this.templateIdInit
        };
        let res = await getDocVersionInfoGZ(params);
        // console.log("res====",res);
        if (res.code == "1") {
          let list = {};
          if (res.data.dnFlag == "1") {
            list = { eleList: [], eleEventList: [], docStyles: {} };
          } else {
            list = res.data.content
              ? JSON.parse(res.data.content)
              : { eleList: [], eleEventList: [], docStyles: {} };
          }
          // 记录文书状态
          this.openStatus = res.data.templateStatus;
          this.uDataVersion = res.data.dataVersion;

          this.$set(this.treeData, 0, {
            templateCode: res.data.templateCode,
            elementName: res.data.templateName,
            id: res.data.id,
            eleId: res.data.id,
            templateVersion: res.data.templateVersion,
            templateStatus: res.data.templateStatus,
            mrModelCd: res.data.mrModelCd,
            deletedStatus: res.data.deletedStatus,
            dataVersion: res.data.dataVersion,
            level: 1,
            eleList: list.eleList || [],
            eleEventList: list.eleEventList || [],
            docStyles: list.docStyles || this.toolValue,
            isModify: false
          });
          this.toolValue = {
            ...list.docStyles,
            widthAll: list.docStyles.widthAll || "100",
            heightAll: list.docStyles.heightAll || "100",
            col: list.docStyles.col || 5,
            lineHeight: list.docStyles.lineHeight || 35,
            widthEle: "",
            heightEle: ""
          };

          // console.log("文书数据", this.treeData[0].eleList);
          await this.digui(this.treeData[0], 1);
          // 默认选中树结构根节点
          this.$refs.tree.setCurrentKey(res.data.id);
          this.currentData = this.treeData[0];
          await this.changeNursingTreeData(this.treeData);
          this.isModify = false;
        } else {
          this.$message.error(res.msg || "文书元素树获取失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "文书元素树获取失败");
      }
    },
    //递归循环nursingTreeData，更改数据
    async digui(item, level) {
      let list = item.eleList;
      for (let i in list) {
        list[i].index = i;
        list[i].level = Number(level) + 1;
        list[i].eleId =
          list[i].eleId ||
          list[i].elementCode +
            Math.random()
              .toString()
              .substr(3, 7);
        list[i].resizable = true;
        list[i].enable = true;
        list[i].visible = true;
        //默认值
        let defaultValues = list[i]["commonAttributeDto"]["defaultValues"];
        if (list[i].elementBaseName == "多选下拉元素") {
          list[i].eleValue = [];
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
          list[i].eleValue = defaultValues || undefined;
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
          list[i].eleValue = defaultValues || "";
        } else if (list[i].elementBaseName == "日期元素") {
          list[i].dateFormatType = "0";
          let attr = list[i].proprietaryAttributeVoLst;
          let flag = 0;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "0700") {
              if (attr[j].proprietaryContent === "1") {
                flag = 1;
              }
            }
            if (attr[j].proprietaryCode == "0701") {
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
            list[i].eleValue = new Date().format(list[i].dateFormat);
          } else {
            list[i].eleValue = defaultValues || "";
          }
        } else if (list[i].elementBaseName == "多选元素") {
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
        } else if (list[i].elementBaseName == "单选元素") {
          if (list[i].valueLst.length) {
            for (let j in list[i].valueLst) {
              if (list[i].valueLst[j].defaultSelection === "1") {
                list[i].eleValue = list[i].valueLst[j].vMean;
              }
            }
          } else {
            list[i].eleValue = "";
          }
        } else if (list[i].elementBaseName == "签名元素") {
          list[i].nursingList = this.nursingList;
          list[i].eleValue = defaultValues || "";
          let attr = list[i].proprietaryAttributeVoLst;
          for (let j in attr) {
            if (attr[j].proprietaryCode == "1101") {
              if (attr[j].proprietaryContent == "1") {
                list[i].eleValue = Base64.decode(getUserName());
              }
            }
          }
        } else {
          list[i].eleValue = defaultValues || "";
        }
        if (list[i].eleList && list[i].eleList.length) {
          await this.digui(list[i], list[i].level);
        }
        if (list[i].elementBaseName == "表格元素") {
          if (list[i].eleValue && list[i].eleValue.length) {
            list[i].eleValue = list[i].eleValue || [];
          } else {
            list[i].eleValue = [];
            let elementAttribute = list[i].proprietaryAttributeVoLst;
            let num = 1;
            for (let j in elementAttribute) {
              if (elementAttribute[j].proprietaryCode == "1401") {
                num = Number(elementAttribute[j].proprietaryContent) || 1;
              }
            }
            for (let k = 0; k < num; k++) {
              list[i].eleValue.push({});
            }
          }
          list[i].tableDataItem =
            // list[i].tableDataItem ||
            {};
          await this.forCircleTable(
            list[i],
            list[i].eleValue,
            list[i].tableDataItem
          );
        }
      }
    },
    forCircleTable(tableItem, eleValue, tableDataItem) {
      let list = tableItem.eleList;
      // debugger
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
            // if (eleValue[k][list[i].eleId]) {
            //文书有值（记录）
            // obj = eleValue[k][list[i].eleId];
            // } else {
            //文书无值（文书结构）
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
              obj.nursingList = this.nursingList;
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
            // }
            this.$set(eleValue[k], list[i].eleId, deepClone(obj));
          }
        }
      }
    },
    /*点击树*/
    async treeClick(data, node) {
      // console.log(data);
      // console.log(node);
      this.currentData = data;
      // this.currentNode = node;
    },
    /*从元素列表增加元素*/
    async update(data) {
      this.isModify = true;
      if (this.currentData.eleList) {
        this.currentData.eleList = this.currentData.eleList.concat(data);
      } else {
        this.$set(this.currentData, "eleList", data);
      }
      await this.digui(this.treeData[0], 1);
      await this.changeNursingTreeData(this.treeData);
      await this.saveGZ();
    },
    /*处理更新数据*/
    forCircle(list) {
      for (let i in list) {
        if (!list[i].eleId) {
          this.$delete(list, i);
          this.forCircle(list);
        } else {
          this.$delete(list[i], "eleValue");
          if (list[i].elementBaseName == "表格元素") {
            // this.$delete(list[i], "tableDataItem");
          }
          this.$delete(list[i], "idNew");
          this.$delete(list[i], "level");
          // this.$delete(list[i], "width");
          // this.$delete(list[i], "colNum");
          // this.$delete(list[i], "col");
          this.$delete(list[i], "resizable");
          this.$delete(list[i], "index");
          this.$delete(list[i], "enable");
          this.$delete(list[i], "visible");
          this.$delete(list[i], "currentControl");
          if (list[i].eleList && list[i].eleList.length > 0) {
            this.forCircle(list[i].eleList);
          }
        }
      }
    },
    // 升级版本逻辑

    //保存数据
    async saveGZ(isResfrush = false) {
      let data;
      // if (this.isLook) {
      data = deepClone(this.nursingTreeDataSave);
      // } else {
      // data = deepClone(this.treeData);
      // }
      this.forCircle(data[0].eleList);
      this.$showLoading();
      try {
        let params = {
          id: data[0].id,
          templateCode: data[0].templateCode,
          content: {
            eleList: data[0].eleList,
            eleEventList: data[0].eleEventList,
            docStyles: data[0].eleList.length
              ? {
                  layoutStyle: this.toolValue.layoutStyle,
                  widthAll: this.toolValue.widthAll || 100,
                  heightAll: this.toolValue.heightAll || 100,
                  col: this.toolValue.col,
                  lineHeight: this.toolValue.lineHeight,
                  isChanged: false,
                  widthEle: "",
                  heightEle: ""
                }
              : {}
          },
          templateVersion: data[0].templateVersion,
          templateStatus: data[0].templateStatus,
          dataVersion: data[0].dataVersion,
          dnFlag: "2",
          editor: "02"
        };

        let dataParams = {
          id: this.templateIdInit,
          dataVersion: this.uDataVersion,
          content: {
            eleList: data[0].eleList,
            eleEventList: data[0].eleList.length ? data[0].eleEventList : [],
            docStyles: data[0].eleList.length
              ? {
                  layoutStyle: this.toolValue.layoutStyle,
                  widthAll: this.toolValue.widthAll || 100,
                  heightAll: this.toolValue.heightAll || 100,
                  col: this.toolValue.col,
                  lineHeight: this.toolValue.lineHeight,
                  isChanged: false,
                  widthEle: "",
                  heightEle: ""
                }
              : {}
          },
          dnFlag: "2",
          editor: "02"
        };

        // console.log(this.openStatus, dataParams, "dataParamsdataParams");
        if (this.openStatus === 1 || this.openStatus === 2) {
          dataParams.flag = "false";
          upVersion(dataParams)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("保存成功，已新建升级版本！");
                this.isLook = false;
                // this.$emit("queryListData");
                this.search();
                return;
              }
              if (res.code === 60101) {
                this.$confirm(
                  "当前模板存在新建状态的升级版本，是否覆盖?",
                  "提示",
                  {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }
                )
                  .then(() => {
                    dataParams.flag = "true";
                    upVersion(dataParams).then(res => {
                      if (res.code === 1) {
                        this.isLook = false;
                        // this.$emit("queryListData");
                        this.search();
                        this.$message.success("保存成功，已覆盖已有升级版本！");
                      } else {
                        this.$message.error("保存失败!" + res.msg);
                      }
                    });
                  })
                  .catch(action => {});
              } else {
                this.$message.error("保存失败!" + res.msg);
                return;
              }
            })
            .catch(error => {
              this.$message.error("保存失败!" + error.msg);
            });
        }
        if (this.openStatus === 0) {
          let res = await saveOrUpdateDocVersionInfoGZ(params);
          if (res.code == "1") {
            // this.$emit("queryListData");
            this.$message("更新成功");
          } else {
            this.$message.error("更新失败");
          }

          // 搜索
          await this.search1();
          this.isModify = false;
          // 预览
          if (this.activityName === "isLook") {
            // console.log(isResfrush);
            await this.preView(this.treeData);
          }
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "更新失败");
      }
    },
    //删除树节点
    deleteItem(node, data) {
      this.isModify = true;
      this.isLook = false;
      for (let i in node.parent.data.eleList) {
        let item = node.parent.data.eleList[i];
        if (!node.data.id) {
          if (node.data.idNew == item.idNew) {
            this.$delete(node.parent.data.eleList, i);
            if (this.activityName === "isLook") {
              this.preView(this.treeData);
            }
            return;
          }
        } else {
          if (node.data.eleId == item.eleId) {
            this.$delete(node.parent.data.eleList, i);
            if (this.activityName === "isLook") {
              this.preView(this.treeData);
            }
            return;
          }
        }
      }
    },
    //拖拽成功触发
    nodeDropCom() {
      this.isModify = true;
      this.isLook = false;
      this.preView(this.treeData);
    },
    //工具箱
    toolBoxMessage() {}
    //获取业务模板左侧树（全部）
  }
};
</script>

<style lang="scss" scoped>
.maintenbance-document {
  padding-left: 10px;
  overflow: hidden;
  .maintenbance-list {
    display: flex;
    flex-direction: row;

    .left-bar {
      width: 287px;
      // background-color: #fff;
      // box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;

      .document-operate-con {
        .tree-cont {
          height: calc(100% - 120px);
          margin-top: 20px;
          padding-right: 20px;
          overflow: auto;

          .custom-tree-node {
            width: calc(100% - 24px);
            height: 100%;

            .tree-label-cont {
              width: 100%;
              height: 100%;

              .tree-label {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }

    .right-com {
      width: calc(100% - 847px);
      flex: 1;
      margin-left: 10px;
      // background-color: #fff;
      // box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border-left: 1px solid $l-color-bgcolor-11;
      .analy-cont {
        padding: 10px;
        .tool-cont {
          height: 50px;
          border: 1px solid $l-color-bgcolor-11;
          border-left: none;
          margin-bottom: 10px;
          padding-right: 5px;
          overflow: auto;

          .tool-cont-left {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .tool-cont-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .tool-title {
            padding: 0 5px;
            margin-right: 5px;
            text-align: center;
            line-height: 50px;
            border-right: 1px solid $l-color-bgcolor-11;
            border-left: 1px solid $l-color-bgcolor-11;
            background-color: $l-color-bgcolor-18;
            text-align: center;
            font-size: 14px;
            font-family: $l-font-familySC-regular;
            font-weight: 400;
            color: $l-color-fontcolor-4;
          }
        }
        .main-cont {
          height: calc(100% - 60px);
        }
      }
    }
  }
  /deep/ .el-tabs--card {
    height: 100%;
  }
  /deep/ .el-tree-node__content {
    width: 100%;
    height: 44px;
    line-height: 44px;
  }

  /deep/ .el-tree-node__label {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /deep/ .special-el-dropdown {
    width: 100%;
  }

  /deep/
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: $l-color-bgcolor-11;
  }

  /deep/ .el-tree-node__content:hover {
    background-color: $l-color-bgcolor-11;
  }
}
</style>
