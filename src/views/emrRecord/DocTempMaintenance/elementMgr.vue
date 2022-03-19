<template>
  <div class="hd-container height100">
    <flow-menu>
      <el-card class="left">
        <div style="margin: 10px; overflow: auto">
          <el-tree
            :data="tree1"
            :props="defaultProps"
            @node-click="handleNodeClick1"
          ></el-tree>
        </div>
      </el-card>
      <el-card class="right" id="rightCard">
        <div class="height100">
          <div style="overflow: hidden; padding: 10px 20px">
            <div class="search-con clearfix">
              <div class="search-main float-left">
                <div class="common-width margin-top-10">
                  <l-formt-title label="元素编码">
                    <el-input class="my-input" v-model="eleCode"></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="元素名称">
                    <el-input class="my-input" v-model="eleName"></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="占位文本">
                    <el-input
                      class="my-input"
                      v-model="placeHolderTxt"
                    ></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="提示文本">
                    <el-input class="my-input" v-model="promptTxt"></el-input>
                  </l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="元素类型">
                    <el-select
                      v-model="eleTypeVal"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in eleTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </div>
              </div>
              <div class="float-right margin-top-10">
                <el-button
                  class="myBtn el-button--primary"
                  @click="elementQuery"
                  >查询
                </el-button>
                <el-button
                  class="myBtn el-button--default"
                  @click="clearCondition"
                  >重置
                </el-button>
              </div>
            </div>
          </div>
          <div
            style="
              padding: 10px 20px;
              border-top: 1px solid #dcdfe6;
              margin-top: 10px;
              height: calc(100% - 80px);
            "
          >
            <div class="clearfix">
              <div class="float-right">
                <el-button class="my-btn" @click="create" icon="el-icon-plus"
                  >新建
                </el-button>
                <el-button
                  class="my-btn"
                  icon="el-icon-edit-outline"
                  @click="modify"
                  >修改
                </el-button>
                <el-button
                  class="my-btn"
                  icon="el-icon-remove-outline"
                  @click="deleteEle"
                  >删除
                </el-button>
                <el-button class="my-btn" icon="el-icon-setting" @click="prop"
                  >属性
                </el-button>
                <el-button class="my-btn" icon="el-icon-document" @click="copy"
                  >复制
                </el-button>
              </div>
            </div>
            <div style="height: calc(100% - 40px); margin-top: 10px">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                :layout="layout"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  class="my-table"
                  :data="eleTable"
                  v-loading="tlm_isLoading"
                  ref="eleTable"
                  border
                  height="100%"
                  style="width: 100%"
                  @row-click="handleRowClick"
                >
                  <el-table-column
                    type="selection"
                    width="45px"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    :index="indexMethod"
                    width="50px"
                  ></el-table-column>
                  <el-table-column
                    prop="elementBaseName"
                    label="元素类型"
                    width="100px"
                  ></el-table-column>
                  <el-table-column
                    prop="dataElementName"
                    label="数据元"
                    width="100px"
                  ></el-table-column>
                  <el-table-column
                    prop="elementCode"
                    label="元素编码"
                    width="200px"
                  ></el-table-column>
                  <el-table-column
                    prop="elementName"
                    label="元素名称"
                    width="200px"
                  ></el-table-column>
                  <el-table-column
                    prop="placeholderText"
                    label="占位文本"
                    width="150px"
                  ></el-table-column>
                  <el-table-column
                    prop="tooltipText"
                    label="提示文本"
                    width="150px"
                  ></el-table-column>
                  <el-table-column
                    prop="defaultValues"
                    label="默认值"
                  ></el-table-column>
                </el-table>
              </l-table>
            </div>
          </div>
          <ModifyEleAttr
            ref="modifyEleAttr"
            :changeEleTypeVal="changeEleTypeVal"
            :createDialogVisible="createDialogVisible"
            :dialogVisible.sync="dialogVisible"
            :modifyDialogVisible="modifyDialogVisible"
            :propDialogVisible="propDialogVisible"
            @dialogClose="dialogClose"
            @handleDetermineZhuhe="handleDetermineZhuhe"
            @updateElementList="updateElementList"
          />
        </div>
        <el-card
          class="height-bottom"
          :style="{ bottom: bottom }"
          v-loading="templateLoading"
        >
          <div class="top">
            <el-button class="btn-position" @click="handleClick"
              >关闭
            </el-button>
          </div>
          <div class="axEditor-demo">
            <div class="tool-right">
              <tools
                boxName="StructureTree"
                :modules="modules"
                :treeData="treeData"
                :recordName="recordName"
                :editor="editor"
                :open.sync="open"
                @addParagraph="addParagraph"
                @addSymbol="addSymbol"
                @refreshTree="getTreeData"
                @clickNode="clickNode"
                @updateNode="updateNode"
                @delNode="delNode"
                @showExpression="showExpression"
              />
            </div>
            <div class="editor-left">
              <l-editor
                ref="axEditor"
                @save="save"
                @saveAsTempl="saveAsTempl"
                @ready="editorReady"
                :configs="editorConfigs"
              >
              </l-editor>
            </div>
          </div>
        </el-card>
      </el-card>
    </flow-menu>
  </div>
</template>

<script>
import {
  getPageByCondition,
  getAll,
  insertEle,
  detailQuery,
  modifyEle,
  removeEle,
  getUuid,
  getSeqNo
} from "@/api/emrRecord/emr/element";
import { listToTree } from "@/utils/util";

import LEditor from "@/components/LEditor";
import ModifyEleAttr from "./component/modifyEleAttr";
import Tools from "@/views/public/tools/emrTools";
import FlowMenu from "@/components/FlowMenu";

import {
  getDataElePageByCondition,
  getDataElementValueSingleLst,
  getDataElementValueMutiLst
} from "@/api/emr/contrast.js";

export default {
  components: {
    LEditor,
    Tools,
    FlowMenu,
    ModifyEleAttr
  },
  data() {
    return {
      changeEleTypeVal: false,
      bottom: "-100%",
      templateLoading: false,
      tlm_isLoading: false,
      activeName: "mainTab",
      open: true,
      editor: {},
      editorConfigs: {
        editorModel: "design",
        initialFrameHeight: 500,
        tabToolbars: [
          {
            id: "edit",
            name: "编辑",
            widgets: [
              [
                {
                  id: "save",
                  name: "保存"
                },
                {
                  id: "savetempl",
                  name: "另存为模板"
                },
                {
                  id: "undo",
                  name: "撤销"
                },
                {
                  id: "redo",
                  name: "恢复"
                },
                {
                  id: "drafts",
                  name: "草稿箱"
                }
              ],
              [
                {
                  id: "copy",
                  name: "复制"
                },
                {
                  id: "cut",
                  name: "剪切"
                },
                {
                  id: "paste",
                  name: "粘贴"
                }
              ],
              [
                {
                  type: "select",
                  iconOnly: true,
                  id: "fontfamily",
                  name: "字体格式"
                },
                {
                  type: "select",
                  iconOnly: true,
                  id: "fontsize",
                  name: "字号"
                },
                {
                  iconOnly: true,
                  hasBorder: true,
                  id: "removeformat",
                  name: "清除样式"
                },
                {
                  iconOnly: true,
                  hasBorder: true,
                  id: "formatmatch",
                  name: "格式刷"
                },
                {
                  iconOnly: true,
                  hasBorder: true,
                  id: "autotypeset",
                  name: "自动格式化"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "sizeplus",
                  name: "增大字号"
                },
                {
                  iconOnly: true,
                  id: "sizeminus",
                  name: "缩小字号"
                },
                {
                  iconOnly: true,
                  id: "fontborder",
                  name: "字体边框"
                },
                {
                  iconOnly: true,
                  id: "superscript",
                  name: "上标"
                },
                {
                  iconOnly: true,
                  id: "subscript",
                  name: "下标"
                },
                {
                  iconOnly: true,
                  id: "bold",
                  name: "加粗"
                },
                {
                  iconOnly: true,
                  id: "italic",
                  name: "倾斜"
                },
                {
                  iconOnly: true,
                  id: "underline",
                  name: "下划线"
                },
                {
                  iconOnly: true,
                  id: "strikethrough",
                  name: "删除线"
                },
                {
                  iconOnly: true,
                  id: "forecolor",
                  name: "文字颜色"
                },
                {
                  iconOnly: true,
                  id: "backcolor",
                  name: "背景颜色"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "justifyleft",
                  name: "向左对齐"
                },
                {
                  iconOnly: true,
                  id: "justifycenter",
                  name: "居中对齐"
                },
                {
                  iconOnly: true,
                  id: "justifyright",
                  name: "向右对齐"
                },
                {
                  iconOnly: true,
                  id: "justifyjustify",
                  name: "两端对齐"
                },
                {
                  iconOnly: true,
                  id: "blockquote",
                  name: "引用"
                },
                {
                  iconOnly: true,
                  id: "indent",
                  name: "首行缩进"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "insertorderedlist",
                  name: "有序列表"
                },
                {
                  iconOnly: true,
                  id: "insertunorderedlist",
                  name: "无序列表"
                },
                {
                  iconOnly: true,
                  id: "rowspacingtop",
                  name: "段前距"
                },
                {
                  iconOnly: true,
                  id: "rowspacingbottom",
                  name: "段后距"
                },
                {
                  iconOnly: true,
                  id: "lineheight",
                  name: "行间距"
                }
              ] /* ,
        [{
          id: 'structureTree',
          name: '文档结构树'
        }] */
            ]
          },
          {
            id: "insert",
            name: "插入",
            widgets: [
              [
                {
                  id: "spechars",
                  name: "特殊字符"
                }
              ],
              [
                {
                  id: "link",
                  name: "添加链接"
                },
                {
                  id: "unlink",
                  name: "取消链接"
                }
              ],
              [
                {
                  id: "insertimage",
                  name: "图片"
                },
                {
                  id: "insertvideo",
                  name: "视频"
                },
                {
                  id: "barcode",
                  name: "条形码"
                },
                {
                  id: "qrcode",
                  name: "二维码"
                }
              ],
              [
                {
                  id: "insertcode",
                  name: "代码"
                }
              ],
              [
                {
                  id: "medical",
                  name: "医学表达式"
                }
              ]
            ]
          },
          {
            id: "table",
            name: "表格",
            widgets: [
              [
                {
                  id: "inserttable",
                  name: "插入表格"
                },
                {
                  id: "deletetable",
                  name: "删除表格"
                }
              ],
              [
                {
                  id: "insertrow",
                  iconOnly: true,
                  name: "插入行"
                },
                {
                  id: "insertcol",
                  iconOnly: true,
                  name: "插入列"
                },
                {
                  id: "breakLine"
                },
                {
                  id: "deleterow",
                  iconOnly: true,
                  name: "删除行"
                },
                {
                  id: "deletecol",
                  iconOnly: true,
                  name: "删除列"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "mergecells",
                  name: "合并单元格"
                },
                {
                  iconOnly: true,
                  id: "mergedown",
                  name: "向下合并单元格"
                },
                {
                  iconOnly: true,
                  id: "mergeright",
                  name: "向右合并单元格"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "splittocells",
                  name: "拆分单元格"
                },
                {
                  iconOnly: true,
                  id: "splittocols",
                  name: "单元格拆分成列"
                },
                {
                  iconOnly: true,
                  id: "splittorows",
                  name: "单元格拆分成行"
                }
              ],
              [
                {
                  iconOnly: true,
                  id: "tablelowerframeline",
                  name: "下框线"
                },
                {
                  iconOnly: true,
                  id: "tableupperframeline",
                  name: "上框线"
                },
                {
                  iconOnly: true,
                  id: "tableleftframeline",
                  name: "左框线"
                },
                {
                  id: "breakLine"
                },
                {
                  iconOnly: true,
                  id: "tablerightframeline",
                  name: "右框线"
                },
                {
                  iconOnly: true,
                  id: "tablenoborder",
                  name: "无框线"
                },
                {
                  iconOnly: true,
                  id: "tableallborder",
                  name: "全框线"
                }
              ],
              [
                {
                  // iconOnly: true,
                  id: "tb-hide",
                  name: "隐藏表格线"
                },
                {
                  // iconOnly: true,
                  id: "tb-solid",
                  name: "表格线设为实线"
                },
                {
                  // iconOnly: true,
                  id: "tb-dotted",
                  name: "表格线设为虚线"
                }
              ]
            ]
          },
          {
            id: "structure",
            name: "结构化",
            widgets: [
              [
                /*{
                      id: 'macro',
                      name: '基本元素'
                    }, */ {
                  id: "text",
                  name: "文本元素"
                },
                {
                  id: "tagelement",
                  name: "标签元素"
                },
                {
                  id: "numberelement",
                  name: "数字元素"
                },
                {
                  id: "select",
                  name: "单选下拉元素"
                },
                {
                  id: "selectmulti",
                  name: "多选下拉元素"
                },
                {
                  id: "datedomain",
                  name: "日期元素"
                },
                {
                  id: "haveornot",
                  name: "有无元素"
                }
              ],
              [
                {
                  id: "radio",
                  name: "单选元素"
                },
                {
                  id: "checkbox",
                  name: "复选元素"
                }
              ],
              [
                {
                  id: "paragraphele",
                  name: "段落元素"
                },
                {
                  id: "parasetter",
                  name: "段落设置"
                }
              ],
              [
                {
                  id: "combine",
                  name: "组合元素"
                }
              ]
            ]
          }
        ]
      },
      modules: [
        "StructureTree",
        "ElementLibrary",
        "Macros",
        "MedicalExpression",
        "SpecialSymbol"
      ],
      treeData: [],
      recordName: "入院记录",
      tree1: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      //元素编码
      eleCode: "",
      //元素名称
      eleName: "",
      //占位文本
      placeHolderTxt: "",
      //提示文本
      promptTxt: "",
      //元素类型
      eleTypeVal: "",
      layout: "total,prev,pager,next,jumper",
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      //元素表
      eleTable: [],
      //窗口可见
      dialogVisible: false,
      createDialogVisible: false,
      modifyDialogVisible: false,
      propDialogVisible: false,
      //显示病历编辑器
      // showEmrEditor: false,
      createMode: false,
      modifyMode: false,
      eleTypeOptions: []
    };
  },
  methods: {
    editorReady(instance) {
      this.editor = instance;
    },
    addParagraph(params) {
      let { type, template, actionType } = params;
      if (template == undefined || template == "") {
        this.$message({
          type: "info",
          message: "片语内容为空，请检查！"
        });
        return;
      }
      if (actionType == 0) {
        this.$refs.axEditor.execCommand("appendparagraphcontent", {
          type: type,
          content: template
        });
      } else {
        this.$refs.axEditor.execCommand("replaceparagraph", {
          type: type,
          content: template
        });
      }
    },
    addSymbol(symbol) {
      this.$refs.axEditor.execCommand("inserthtml", symbol);
    },
    getTreeData() {
      this.treeData = listToTree(
        this.$refs.axEditor.execCommand("structuretree"),
        "id",
        "pId"
      ).list;
      if (this.treeData.length > 0) {
        this.treeData = this.treeData[0].children;
      }
    },
    clickNode(id) {
      this.$refs.axEditor.execCommand("structuretreeclick", id);
    },
    updateNode(id) {
      this.$refs.axEditor.execCommand("structuretreeedit", id);
    },
    delNode(id) {
      this.$refs.axEditor.execCommand("structuretreedel", id);
      this.getTreeData();
    },
    showExpression(type) {
      this.$refs.axEditor.execCommand(type);
    },
    handleClick(tab, event) {
      this.$confirm("当前修改尚未保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs.axEditor.save();
          this.hiddenTemplate();
        })
        .catch(() => {
          this.activeName = "editTab";
        });
    },
    handleRowClick(row, event, column) {
      this.$refs.eleTable.toggleRowSelection(row);
    },
    //组合元素保存
    save(content) {
      // 将content保存至后台
      if (this.createMode) {
        this.$refs.modifyEleAttr.combinationSave(content);
      } else {
        this.$refs.modifyEleAttr.combinationModifySave(content);
      }
      this.createMode = false;
      this.modifyMode = false;
    },
    saveAsTempl(content) {
      // 将content保存至后台
      alert("已存为模板！");
    },
    // 加载更多table数据
    loadTableData() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.eleQuery(true);
    },

    //点击树节点
    handleNodeClick1(data) {
      this.eleTypeVal = data.id;
      this.elementQuery();
    },
    //属性
    prop() {
      if (this.$refs.eleTable.selection.length == 0) {
        this.$message({
          message: "请先选择元素!",
          type: "warning"
        });
        return;
      }
      this.propDialogVisible = true;
      this.modify();
    },
    //对话框关闭
    dialogClose() {
      this.createDialogVisible = false;
      this.modifyDialogVisible = false;
      this.propDialogVisible = false;
    },
    //复制
    copy() {
      if (this.$refs.eleTable.selection.length == 0) {
        this.$message({
          message: "请先选择元素!",
          type: "warning"
        });
        return;
      }
      let index = 0;
      this.$refs.eleTable.selection.forEach(item => {
        let req = {
          id: item.id
        };
        detailQuery(req).then(res => {
          if (res.code == 1) {
            delete res.data.dataVersion;
            delete res.data.id;
            delete res.data.commonAttributeDto.id;
            delete res.data.commonAttributeDto.dataVersion;
            delete res.data.commonAttributeDto.elementId;
            res.data.proprietaryAttributeVoLst.forEach(prop => {
              delete prop.id;
              delete prop.elementId;
              delete prop.dataVersion;
            });
            getSeqNo().then(resu => {
              if (resu.code === 1) {
                res.data.elementCode = resu.data;
                res.data.elementName += "_副本";
                insertEle(res.data).then(res => {
                  if (res.code === 1) {
                    this.$message({
                      message: "复制成功!",
                      type: "success"
                    });
                    if (index == this.$refs.eleTable.selection.length - 1) {
                      this.elementQuery();
                    }
                    index++;
                  } else {
                    this.$message.error("复制失败!");
                  }
                });
              } else {
                this.$message.error("复制失败!");
              }
            });
          } else {
            this.$message.error("复制失败!");
          }
        });
      });
    },
    //新建元素
    create() {
      this.changeEleTypeVal = false;

      this.$refs.modifyEleAttr.asycCreate().then(res => {
        this.dialogVisible = true;
        this.createDialogVisible = true;
        this.createMode = true;
      });
    },
    //编辑元素
    modify() {
      if (this.$refs.eleTable.selection.length == 0) {
        this.$message({
          message: "请先选择元素!",
          type: "warning"
        });
        return;
      }
      if (this.$refs.eleTable.selection.length > 1) {
        this.$message({
          message: "只能选择一个元素!",
          type: "warning"
        });
        return;
      }
      let req = {
        id: this.$refs.eleTable.selection[0].id
      };
      // 重要！！！
      // this.changeEleTypeVal = true;
      this.$refs.modifyEleAttr.asycModify(req).then(res => {
        if (res) {
          if (!this.propDialogVisible) {
            this.modifyDialogVisible = true;
            this.modifyMode = true;
          }
        }
      });
    },
    showTemplate() {
      this.bottom = "0";
    },
    hiddenTemplate() {
      this.bottom = "-100%";
    },
    handleDetermineZhuhe(data) {
      this.showTemplate();
      this.editorConfigs.initialFrameHeight = document.getElementById(
        "rightCard"
      ).offsetHeight;
      this.$refs.axEditor.setContent(data);
    },
    updateElementList() {
      this.elementQuery();
    },
    //查询
    elementQuery() {
      this.pageParams.pageNo = 1;
      this.eleQuery();
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.eleQuery();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    eleQuery() {
      let data = {
        elementBaseId: this.eleTypeVal,
        elementCode: this.eleCode,
        elementName: this.eleName,
        ...this.pageParams,
        placeholderText: this.placeHolderTxt,
        tooltipText: this.promptTxt,
        ...this.pageParams
      };
      this.tlm_isLoading = true;
      getPageByCondition(data)
        .then(res => {
          if (res.code === 1) {
            this.eleTable = res.data.elementPageContentDtoLst;
            this.pageParams.total = res.data.total;
          } else {
            this.$message.error("查询失败!");
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
          this.$message("查询失败");
        });
    },
    orgDbClick(row, event) {
      this.dataOrgVal = row.dataElementName;
      this.dataElementId = row.id;
      this.dataElementName = row.dataElementName;
      let data = { id: row.valueId, storageType: row.storageType };
      this.dateElementValueSearch(data);
      this.popoverShow = false;
    },
    //重置查询条件
    clearCondition() {
      this.eleCode = "";
      this.eleName = "";
      this.eleTypeVal = "";
      this.placeHolderTxt = "";
      this.promptTxt = "";
    },
    eleTypeChange() {
      this.eleTypeOptions.find(item => {
        if (item.value == this.addEleTypeVal) {
          this.addEleTypeLal = item.label;
        }
      });
      this.clearAddData();
    },

    //删除元素(可批量删除)
    deleteEle() {
      if (this.$refs.eleTable.selection.length == 0) {
        this.$message({
          message: "请先选择元素!",
          type: "warning"
        });
        return;
      }
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let delArr = [];

          this.$refs.eleTable.selection.forEach(item => {
            let del = {
              id: item.id,
              dataVersion: item.dataVersion
            };
            delArr.push(del);
          });
          removeEle(delArr).then(res => {
            if (res.code === 1) {
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.elementQuery();
            } else {
              this.$message.error("删除失败!");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //生成唯一标识
    getUUID() {
      let d = new Date().getTime();
      let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          let r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }
  },
  mounted() {
    //初始化options
    getAll({}).then(res => {
      if (res.code === 1) {
        res.data.forEach(item => {
          if (item.baseElementName == "基本元素") {
            // 不要基本元素
            return true;
          }
          let option = {
            value: item.id,
            label: item.baseElementName
          };
          this.eleTypeOptions.push(option);

          let node = {
            id: item.id,
            label: item.baseElementName,
            children: []
          };
          this.tree1.push(node);
        });
      } else {
        this.$message.error(res.msg || "接口失败！");
        return;
      }
    });
    this.elementQuery();
  }
};
</script>

<style lang="scss">
.hd-container {
  overflow: hidden;

  .left {
    height: 100%;
    width: 245px;
    float: left;
    background-color: #ffffff;
  }

  .right {
    height: 100%;
    margin-left: 255px;
    background-color: #ffffff;
    position: relative;

    .search-con {
      width: 100%;

      .search-main {
        width: calc(100% - 160px);
      }
    }

    .common-width {
      margin-right: 10px;
      display: inline-block;
      width: 200px;
    }

    .height-bottom {
      background: #ffffff;
      position: absolute;
      left: 0px;
      z-index: 100;
      width: 100%;
      height: 100%;
      transition: all 0.5s;

      .top {
        height: 60px;
        padding: 0 10px;
        position: relative;

        .btn-position {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }
    }
  }

  .axEditor-demo {
    width: 100%;
    height: calc(100% - 60px);

    .editor-left {
      height: 100%;
      margin-right: 320px;
    }

    .tool-right {
      float: right;
      width: 300px;
      height: 100%;
    }
  }

  #hTabs {
    margin: 10px;

    .el-tabs__nav-scroll {
      margin-left: 10px;
    }
  }

  .margin-top-10 {
    margin-top: 10px;
  }

  .my-input {
    width: 120px;
  }

  .my-btn {
    width: 75px;
    height: 33px;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    color: #605d5a;
  }

  /deep/ [class^="el-icon-"] {
    margin-left: -5px;
    line-height: 0px;
  }
}
</style>
