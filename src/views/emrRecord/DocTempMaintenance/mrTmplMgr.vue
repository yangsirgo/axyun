<template>
  <div class="hd-container height100">
    <flow-menu>
      <div class="left" :style="{ width: showTree ? '245px' : '40px' }">
        <div style="padding: 10px; height: 100%" v-show="showTree">
          <div style="height: calc(100% - 30px); overflow-y: auto">
            <el-tree
              node-key="id"
              :data="tree1"
              :props="defaultProps"
              :default-expanded-keys="expandedKey"
              @node-click="handleNodeClick1"
            ></el-tree>
          </div>
          <div style="height: 30px; padding: 10px 0 0 10px" @click="closeTree">
            <i class="special-icon el-icon-arrow-left"></i>
            <span class="text">关闭文书树</span>
          </div>
        </div>
        <div
          style="width: 20px; margin: 10px"
          @click="openTree"
          v-show="!showTree"
        >
          <i class="special-icon el-icon-arrow-right">展开文书树</i>
          <span class="text" style="float: left"></span>
        </div>
      </div>
      <div
        class="right right-containter"
        :style="{ 'margin-left': showTree ? '255px' : '50px' }"
      >
        <div
          style="
            display: inline-block;
            padding: 10px 20px;
            box-sizing: border-box;
          "
        >
          <div class="search-con clearfix width100">
            <div class="search-main clearfix">
              <div class="common-width margin-top-10">
                <l-formt-title label="关键字">
                  <el-input class="my-input" v-model="key" clearable></el-input>
                </l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="适用病种">
                  <l-value-domain-emr
                    type="noselect"
                    clearable
                    filterable
                    placeholder="请选择病种"
                    remoteUrl="/diseases/params"
                    remoteShowKey="diseasesName"
                    remoteValueKey="diseasesId"
                    :value.sync="diseaseId"
                    :remoteParams="diseaseParams"
                    :localFilterKeys="['diseasesName']"
                  ></l-value-domain-emr
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="模板编码">
                  <el-input
                    style="width: 160px"
                    v-model="templateCode"
                    clearable
                  ></el-input
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="文书类型">
                  <el-select
                    clearable
                    filterable
                    v-model="typeCode"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </el-select
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="模板状态">
                  <l-value-domain-emr
                    clearable
                    code="ModelStatus"
                    :value.sync="templateStatus"
                    placeholder="请选择"
                  ></l-value-domain-emr
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="审签等级">
                  <l-value-domain-emr
                    clearable
                    filterable
                    code="AuditType"
                    :value.sync="signLevel"
                    placeholder="请选择"
                  ></l-value-domain-emr
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="文书类型组">
                  <el-select
                    v-model="typeGroupCode"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in typeGroupOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </el-select
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="就诊类型">
                  <l-value-domain-emr
                    clearable
                    filterable
                    code="MedicalRecordType"
                    :value.sync="visitType"
                    placeholder="请选择"
                    @change="handleChangeVisitType"
                  ></l-value-domain-emr
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="医护标识">
                  <l-value-domain-emr
                    clearable
                    filterable
                    code="EmployeeMark"
                    :value.sync="dnFlag"
                    placeholder="请选择"
                  ></l-value-domain-emr
                ></l-formt-title>
              </div>
              <div class="common-width margin-top-10 special-item">
                <l-org-operate
                  ref="lOrgOperateRef"
                  @choosePerson="choosePerson"
                />
              </div>
            </div>
            <div class="search-btns margin-top-10">
              <el-button
                class="el-button--primary"
                style="width: 68px; height: 30px"
                @click="btnQuery"
                >查询
              </el-button>
              <el-button
                class="el-button--default"
                style="width: 68px; height: 30px"
                @click="clearCondition"
                >重置
              </el-button>
            </div>
          </div>
        </div>
        <div class="table-area">
          <div class="clearfix">
            <div class="float-right">
              <el-button @click="create" icon="el-icon-plus">新建</el-button>
              <el-button icon="el-icon-edit-outline" @click="openV"
                >打开
              </el-button>
              <el-button icon="el-icon-remove-outline" @click="handleRemove"
                >删除
              </el-button>
              <el-button icon="el-icon-setting" @click="showProp"
                >属性
              </el-button>
              <el-button icon="el-icon-check" @click="enable">启用</el-button>
              <el-button icon="el-icon-close" @click="disable">停用 </el-button>
              <el-button icon="el-icon-copy" @click="copy">复制</el-button>
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
                ref="tempTable"
                border
                style="width: 100%"
                height="100%"
                v-loading="tlm_isLoading"
                :data="tempTable"
                @selection-change="handleSelectionChange"
                @row-dblclick="dblclickOpen"
                @row-click="selectRow"
              >
                <el-table-column
                  fixed
                  type="selection"
                  width="40px"
                ></el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  :index="indexMethod"
                  width="60px"
                ></el-table-column>
                <el-table-column
                  prop="templateCode"
                  label="模板编码"
                  width="150px"
                ></el-table-column>
                <el-table-column
                  prop="templateName"
                  label="模板名称"
                  width="200px"
                ></el-table-column>

                <el-table-column
                  prop="diseaseId"
                  label="适用病种"
                  width="150px"
                >
                  <template slot-scope="scope">
                    <span
                      tableName="md_diseases"
                      :conditionMap="{ diseases_id: scope.row.diseaseId }"
                      columns="diseases_name"
                      v-tableTransformEmr
                    ></span
                  ></template>
                </el-table-column>
                <el-table-column label="文书类型" width="150px">
                  <template slot-scope="scope">
                    <span
                      tableName="mr_type"
                      :conditionMap="{ type_code: scope.row.typeCode }"
                      columns="type_name"
                      v-tableTransformEmr
                    ></span>
                  </template>
                </el-table-column>

                <el-table-column prop="editor" label="编辑器" width="100px">
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.editor"
                      code="EditorType"
                      v-codeTransformEmr
                    ></span> </template
                ></el-table-column>
                <el-table-column
                  prop="scopeLevel"
                  label="所属级别"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.scopeLevel"
                      code="LevelType"
                      v-codeTransformEmr
                    ></span>
                    <template v-if="scope.row.scopeLevel === '1'">
                      (
                      <span
                        tableName="sys_org"
                        :conditionMap="{
                          org_type: '_HOS_',
                          id: scope.row.hosId,
                        }"
                        columns="org_nm"
                        v-tableTransform
                      ></span>
                      )
                    </template>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ownerName"
                  label="所属名称"
                  width="180px"
                >
                </el-table-column>
                <el-table-column label="医护标识" width="100px">
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.dnFlag"
                      code="EmployeeMark"
                      v-codeTransformEmr
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column label="模板状态" width="100px">
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.templateStatus"
                      code="ModelStatus"
                      v-codeTransformEmr
                    ></span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="signLevel"
                  label="审签级别"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.signLevel"
                      :val="scope.row.signLevel"
                      code="AuditType"
                      v-codeTransformEmr
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column prop="visitType" label="就诊类型" width="60px">
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.visitType"
                      code="MedicalRecordType"
                      v-codeTransformEmr
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="templateVersion"
                  label="版本号"
                  width="50px"
                ></el-table-column>

                <el-table-column prop="description" label="描述" width="150px">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top-start"
                      title="详情"
                      width="200"
                      trigger="hover"
                      :content="
                        scope.row.description ? scope.row.description : ''
                      "
                    >
                      <span slot="reference">{{
                        scope.row.description
                          ? scope.row.description.substr(0, 10)
                          : "--"
                      }}</span>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createdAt"
                  label="创建时间"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="updatedAt"
                  label="修改时间"
                  width="160px"
                ></el-table-column>
              </el-table>
            </l-table>
          </div>
        </div>

        <!-- 新建病历模板 -->
        <el-dialog
          width="880px"
          :title="dialogText"
          :visible.sync="dialogVisible"
          @close="dialogClose"
        >
          <div style="margin: 15px 40px 15px 40px">
            <create-temp
              ref="createTemp"
              :docType="docType"
              :isNewBuilt="isNewBuilt"
              :disabledFlag="disabledFlag"
            ></create-temp>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleDetermine">确定 </el-button>
            <el-button v-if="editModel" @click="handleCancel">取消</el-button>
            <el-button
              v-if="viewModel"
              @click="handleCancel"
              style="margin-right: 18px"
              >关闭
            </el-button>
          </div>
        </el-dialog>
        <div
          v-if="bottom === '0'"
          class="height-bottom"
          v-loading="templateLoading"
          :style="{ bottom: bottom }"
        >
          <div class="top">
            <l-card-title>
              <span slot="left">{{ editTemplate }}</span>
            </l-card-title>
            <el-button class="btn-position" @click="handleClick"
              >关闭
            </el-button>
          </div>
          <div class="axEditor-demo" v-if="showEditorFlag">
            <div
              class="tool-right"
              :style="open ? ' width: 300px;' : ' width: 50px;'"
            >
              <tools
                v-if="showToolBox"
                boxName="StructureTree"
                :refrehTree.sync="refrehTree"
                :modules="modules"
                :treeData="treeData"
                :recordName="recordName"
                :open.sync="open"
                :editor="axeditor"
              />
            </div>
            <div
              class="editor-left"
              :style="open ? ' margin-right: 300px;' : ' margin-right: 50px;'"
            >
              <l-editor
                ref="axEditor"
                :configs="editorConfigs"
                :defaultMsg="defaultMsg"
                @save="saveHandler"
                @ready="editorReady"
              ></l-editor>
            </div>
            <div
              v-if="this.chooseSelectionData.visitType === '01'"
              class="position-relative slideBar"
            >
              <diagnostic
                ref="diagnostic"
                class="diagnosticCls"
                saveMode="editor"
                :diagnosticData="diagnosticData"
                :hosType="1"
                @insertDataToEditor="saveDiagnosticHandler"
                @updateDataToEditor="updateDataToEditor"
                @delDataToEditor="delDataToEditor"
                @setDiagMianToEditor="setDiagMianToEditor"
                @openDiagnosticComponent="openDiagnosticComponent"
              ></diagnostic>
            </div>
          </div>
          <div class="axEditor-demo" v-if="!showEditorFlag">
            <nursing-record
              ref="formEditor"
              :templateId="getTemplateId"
              @queryListData="btnQuery"
            ></nursing-record>
          </div>
        </div>
      </div>
    </flow-menu>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import LEditor from "@/components/LEditor";
import Tools from "@/views/public/tools/emrTools";
import FlowMenu from "@/components/FlowMenu";
import createTemp from "../emr/component/createTemp";
import diagnostic from "@/views/cis/prescriptionRecor/newPatientsManage/record/components/diagnostic.vue";
import nursingRecord from "@/views/nursingRecord/maintenanceDocument/index.vue";

import {
  getTree,
  save,
  update,
  getByParams,
  removeTemplate,
  setEnable,
  setDisable,
  getDetail,
  getContent,
  saveContent,
  copyTemplates,
  upVersion,
  getNextSeq
} from "@/api/emrRecord/emr/template";

import { getIcd10DictionaryByKey } from "@/api/emrRecord/emr/paragraphType";
import { getPamars } from "@/utils/auth";
import { showDiagnoseInfo, handlerDiagnoseInfo } from "@/utils/axeditor";
import { getUId } from "@/utils/crypto";
import { listToTree } from "@/utils/util";

import LOrgOperate from "../components/LOrgOperate";
import commonMixins from "./mixins/common.js";

export default {
  name: "templateManager",
  components: {
    LEditor,
    Tools,
    FlowMenu,
    createTemp,
    diagnostic,
    nursingRecord,
    LOrgOperate
  },
  data() {
    return {
      diagnosticData: {},
      diagnosticList: null,
      controlSaveFlag: false,
      showTree: true,
      diseaseParams: {
        deletedStatus: "0",
        enabled: "1"
      },
      deptLocalFilterKeys: ["orgNm"],
      localFilterKeys: ["diseasesName"],
      tCode: "",
      bottom: "-100%",
      tlm_isLoading: false,
      open: false,
      defaultMsg: "",
      expandedKey: [],
      viewModel: false,
      editModel: true,
      valEditorModel: "",
      activeName: "mainTab",
      showEditorFlag: false,
      editorConfigs: {
        id: this.openId,
        editorModel: "design",
        defaultModel: "design",
        refreshPrescriptionMethod: this.refreshPrescription,
        refreshDiagnoseMethod: this.refreshDiagnose,
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
              /*[
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
                ],*/
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
                // {
                //   id: "macro",
                //   name: "基本元素"
                // },
                {
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
              ],
              [
                {
                  id: "diagnose",
                  name: "诊断元素"
                },
                {
                  id: "prescription",
                  name: "处方元素"
                }
              ],
              [
                {
                  id: "signature",
                  name: "签名元素"
                }
              ]
            ]
          },
          {
            id: "viewcheck",
            name: "视图审阅",
            widgets: [
              [
                {
                  id: "source",
                  name: "源码模式"
                },
                {
                  id: "mark",
                  name: "留痕模式"
                },
                {
                  id: "design",
                  name: "设计模式"
                },
                {
                  id: "edit",
                  name: "编辑模式"
                },
                {
                  id: "pure",
                  name: "清洁浏览"
                },
                {
                  id: "dirty",
                  name: "非清洁浏览"
                },
                {
                  id: "secret",
                  name: "保密浏览"
                }
              ],
              [
                {
                  id: "note",
                  name: "批注"
                }
              ]
            ]
          },
          {
            id: "tool",
            name: "工具",
            widgets: [
              [
                {
                  id: "pagemargin",
                  name: "页边距"
                } /* ,
          {
            id: 'paperdirect',
            name: '纸张方向'
          } */,
                {
                  id: "papersize",
                  name: "纸张大小"
                }
              ],
              [
                {
                  id: "pageheader",
                  name: "页眉"
                },
                {
                  id: "pagefooter",
                  name: "页脚"
                } /* ,
          {
            id: 'pages',
            name: '页码'
          } */
              ],
              [
                {
                  id: "watermark",
                  name: "水印"
                }
              ],
              [
                {
                  id: "continueprint",
                  name: "续打"
                },
                {
                  id: "print",
                  name: "打印文档"
                }
              ],
              [
                {
                  id: "printpreview",
                  iconOnly: false,
                  name: "打印预览"
                }
              ],
              [
                {
                  id: "searchreplace",
                  name: "查找替换"
                }
              ],
              [
                {
                  id: "numcount",
                  name: "字数统计"
                }
              ],
              // [
              //   {
              //     id: "refreshmacros",
              //     name: "刷新基本信息"
              //   },
              //   {
              //     id: "refreshdiagnose",
              //     name: "刷新诊断"
              //   },
              //   {
              //     id: "refreshprescription",
              //     name: "刷新处方"
              //   }
              // ],
              [
                {
                  id: "hidemarktag",
                  name: "清除留痕"
                }
              ],
              [
                {
                  id: "editlock",
                  name: "文书锁定"
                }
              ],
              [
                {
                  id: "medicalformula",
                  name: "医学公式"
                }
              ]
            ]
          }
        ]
      },
      modules: [
        "StructureTree",
        "Phrase",
        "ElementLibrary",
        "Macros",
        "MedicalExpression",
        "SpecialSymbol",
        "ManagePlan",
        "HealthPrescribe"
      ],
      refrehTree: false,
      recordName: "",
      treeData: "",
      editTemplate: "",
      tree1: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      //标记码
      key: "",
      //适用病种
      diseaseId: "",
      //模板编码
      templateCode: "",
      //文书类型
      typeCode: "",
      //医护标识
      dnFlag: "",
      //文书类型组
      typeGroupCode: "",
      //模板状态
      templateStatus: "",
      //审签登记
      signLevel: "",
      visitType: "", // 门诊visitType=01，住院传visitType=04 空为全部
      persId: "",
      hosId: "",
      //模板表格
      tempTable: [],
      templateLoading: false,
      layout: "total,prev,pager,next,jumper",
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      //对话框可见
      dialogVisible: false,
      selection: [],
      axeditor: null,
      openId: "",
      openStatus: null,
      editReadOnly: false,
      typeRemoteParams: {},
      basicRemoteParams: { basicTemplateStatus: "1" },
      model: "all",
      diseaseOpt: [],
      typeGroupOptions: [],
      typeOptions: [],
      showToolBox: false,
      docType: "create", //  create  edit
      dialogText: "新建病历模板",
      levelNoRequest: ["0", "1", "2"],
      chooseSelectionData: null,
      newDnFlag: "1",
      isNewBuilt: true,
      authControlFlag: false, // 文书模板权限控制
      disabledFlag: false,
      isDicDeptAdmin: false
    };
  },
  mixins: [commonMixins],
  watch: {
    diagnosticList: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          // 赋值给 诊断组件
          this.$refs.diagnostic.setDiagAddList(newVal);
        }
      }
    },
    recordModelFlag: {
      deep: true,
      handler(val) {
        if (!val) {
          this.axeditor.execCommand("setmodel", {
            modelType: "pure",
            showToolbar: false
          });
        } else {
          this.axeditor.execCommand("setmodel", {
            modelType: "design",
            showToolbar: true
          });
        }
      }
    }
  },
  created() {
    //住院
    if (this.$route.path == "/ipnw/orderRecord/template") {
      //住院
      this.model = "inPatient";
    } else if (this.$route.path == "/cis/cisThree/template") {
      //门诊
      this.model = "outPatient";
    } else {
      this.model = "all";
    }

    this.getManageTree();
  },
  mounted() {
    //  监听 管理计划 添加方法
    this.$root.eventHub.$on("managePlanInsert", domStr => {
      this.axeditor &&
        this.axeditor.execCommand("insertappointparagraph", "PT_gljh", domStr);
    });
    // 监听健康处方 添加 方法
    this.$root.eventHub.$on("insertRecordHander", domStr => {
      this.axeditor && this.axeditor.execCommand("inserthtml", domStr);
    });
    // 监听健康处方 删除 方法
    this.$root.eventHub.$on("deleteglHandler", id => {
      this.axeditor && this.axeditor.execCommand("deletegl", id);
    });
    this.query();
  },
  methods: {
    ...mapActions({
      setDocTypeCode: "cis/setDocTypeCode"
    }),
    // 处理诊断保存问题
    saveDiagnosticHandler(row) {
      if (this.diagnosticList) {
        // 是否有存在的数据
        let findIndex = this.diagnosticList.findIndex(
          item => item.diagCode === row.diagCode && item.cwFlag === row.cwFlag
        );
        if (findIndex >= 0) {
          this.$message.warning("已有诊断，不能重复提交！");
        } else {
          // 主诊断不能设置多个
          let findMainIndex = this.diagnosticList.findIndex(
            item => item.diagMain === "1"
          );
          if (findMainIndex >= 0 && row.diagMain === "1") {
            this.$message.warning("只能维护一个主诊断！");
            return;
          } else {
            this.diagnosticList.push(row);
          }
        }
      } else {
        this.diagnosticList = [{ ...row }];
      }
      this.updateDiagnoseInfo();
    },
    updateDataToEditor(row) {
      if (this.diagnosticList) {
        let findMainIndex = this.diagnosticList.findIndex(
          item => item.diagMain === "1"
        );

        if (row.diagMain === "1" && findMainIndex >= 0) {
          this.$message.warning("只能维护一个主诊断！");
          return;
        }

        let findIndex = this.diagnosticList.findIndex(
          item => item.randomId === row.randomId
        );

        if (findIndex > -1) {
          this.diagnosticList.splice(findIndex, 1, row);
        }
        this.updateDiagnoseInfo();
      }
    },
    delDataToEditor(row) {
      if (this.diagnosticList) {
        this.diagnosticList = this.diagnosticList.filter(item => {
          return item.randomId !== row.randomId;
        });
        if (this.diagnosticList.length) {
          this.updateDiagnoseInfo();
        } else {
          this.updateDiagnoseInfo(row.diagType);
        }
      }
    },
    setDiagMianToEditor(row) {
      if (this.diagnosticList) {
        this.diagnosticList.forEach(item => {
          if (item.diagMain === "1") {
            this.$set(item, "diagMain", "0");
          }
        });

        this.diagnosticList.forEach(item => {
          if (item.randomId === row.randomId) {
            this.$set(item, "diagMain", "1");
          }
        });
        this.updateDiagnoseInfo();
      }
    },
    openDiagnosticComponent() {
      // 监听诊断录入组件弹出
      this.diagnosticList = this.getDiagnoseInfo();
    },
    updateDiagnoseInfo(type = null) {
      // 更新病历维护中的文书诊断
      let diagnoseInfo = handlerDiagnoseInfo(this.diagnosticList);
      showDiagnoseInfo(this.axeditor, diagnoseInfo);
      this.axeditor.execCommand("setdiagnoseinfo", this.diagnosticList, type);
    },
    getDiagnoseInfo() {
      // 获取病历维护中的诊断信息
      if (this.axeditor) {
        return this.axeditor.execCommand("getdiagnoseinfo");
      } else {
        return [];
      }
    },
    openTree() {
      this.showTree = true;
    },
    closeTree() {
      this.showTree = false;
    },
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then(resData => {
        if (resData.code === 1 && resData.data) {
          this.diseaseOpt = resData.data;
        } else {
          this.$message.error("接口报错");
          return;
        }
      });
    },
    //编辑器初始化完成
    editorReady(instance) {
      this.axeditor = instance;

      if (this.axeditor != null) {
        this.showToolBox = true;
        this.refrehTree = true;
      }
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
    //刷新处方
    refreshPrescription() {
      this.$message.error({
        type: "success",
        message: "处方已刷新！"
      });
      // 弹窗配置结束后，返回处方信息，拼接成html代码串（或自定义样式，可将样式写在行内，也可将样式写在style标签内传入），传入编辑区
      var str =
        '<div class="prescription"><table cellspacing="0" cellpadding="0"><tr><td width="20"><span class="cirleNum">1</span></td><td width="230">葡萄糖注射液</td><td width="160" align="right">5% 500.0ml/袋</td><td width="100" align="right">1.0袋</td><td width="20" class="topCombine"></td><td width="150" rowspan="3">静滴 qdx1天</td></tr><tr><td></td><td>丹参注射液</td><td align="right">10ml/支</td><td align="right">1.0袋</td><td class="middleCombine"></td></tr><tr><td></td><td>乳糖酸阿奇霉素注射液</td><td align="right">0.125g 2.5ml/支</td><td align="right">1.0支</td><td class="bottomCombine"></td></tr><tr><td><span class="cirleNum">2</span></td><td>葡萄糖氯化钠注射液</td><td align="right">5% 500.0ml/袋</td><td align="right">1.0袋</td><td class="topCombine"></td><td rowspan="2">静滴 qdx1天</td></tr><tr><td></td><td>注射用头孢曲松钠粉针剂</td><td align="right">2g/瓶</td><td align="right">2.0瓶</td><td class="bottomCombine"></td></tr><tr><td><span class="cirleNum">3</span></td><td>23价肺炎球菌多糖疫苗(进口)</td><td align="right">0.5ml/支</td><td align="right">1.0支</td><td class="singleCombine"></td><td>肌注 alwaysx1天</td></tr><tr><td width="20"><span class="cirleNum">4</span></td><td width="231">三金片(薄衣片)</td><td colspan="4">3.5gx72片/盒x1盒</td></tr><tr><td></td><td align="right">用法：</td><td colspan="4">10.5g tidx1天 口服</td></tr><tr><td><span class="cirleNum">5</span></td><td>云南白药胶囊</td><td colspan="4">0.25gx16粒/盒x1盒</td></tr><tr><td></td><td align="right">用法：</td><td colspan="4">0.25g qidx1天 口服</td></tr></table></div>';
      this.execCommand("showprescription", str);
    },
    async handleClick(tab, event) {
      let modifyFLag = false;
      let item = this.tempTable.find(val => {
        return val.templateId == this.openId;
      });

      if (item && item.editor === "01") {
        modifyFLag = this.axeditor.execCommand("ismodified");
      } else {
        //护理编辑器判断是否修改
        modifyFLag = this.$refs.formEditor && this.$refs.formEditor.isModify;
      }

      if (modifyFLag && this.recordModelFlag) {
        this.$confirm("当前模板存在修改，是否保存?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(async () => {
            if (item && item.editor === "01") {
              this.saveContent(this.axeditor.getContent(), item.dnFlag)
                .then(() => {
                  this.hiddenTemplate();
                })
                .catch(error => {
                  this.$message.error(error.msg || "保存失败");
                });
              await this.query();
            } else {
              //护理编辑器保存
              this.$refs.formEditor &&
                (await this.$refs.formEditor.saveGZ(false));
              this.hiddenTemplate();
              return;
            }
          })
          .catch(async action => {
            if (action === "cancel") {
              //取消，放弃保存，离开页面
              this.defaultMsg = "";
              await this.hiddenTemplate();
              await this.query();
            }
          });
      } else {
        this.hiddenTemplate();
        await this.query();
      }
    },
    dgTree(node) {
      if (node.label != "全院通用") {
        if (node.id.indexOf("G_") === 0) {
          this.typeGroupOptions.push({
            value: node.id,
            label: node.label
          });
        }
        if (node.id.indexOf("T_") === 0) {
          this.typeOptions.push({
            value: node.id,
            label: node.label
          });
        }
      }
      if (node.children) {
        node.children.forEach(item => {
          this.dgTree(item);
        });
      }
    },
    getManageTree() {
      let visitType = "";
      if (this.model == "inPatient") {
        visitType = "04";
      } else if (this.model == "outPatient") {
        visitType = "01";
      }

      let params = {
        visitType: visitType
      };
      getTree(params).then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.AddExpandItem(item);
          });
          this.tree1 = res.data;

          this.typeGroupOptions = [];
          this.typeOptions = [];
          res.data.forEach(item => {
            this.dgTree(item);
          });
        } else {
          this.$message.error("请求数据失败");
          return;
        }
      });
    },
    // 更新 左侧菜单
    handleChangeVisitType() {
      if (this.model === "inPatient" && this.visitType == "01") {
        this.visitType = "04";
        this.$message.error("没有权限");
        return;
      }
      if (this.model === "outPatient" && this.visitType == "04") {
        this.visitType = "01";
        this.$message.error("没有权限");
        return;
      }
    },
    AddExpandItem(item) {
      if (item.exts.level == "0") {
        this.expandedKey.push(item.id);
        if (item.children != null && item.children != undefined) {
          item.children.forEach(data => {
            this.AddExpandItem(data);
          });
        }
      }
    },
    choosePerson(val) {
      this.persId = val ? getUId() : "";
    },
    handleNodeClick1(data) {
      // 如果护理维护界面打开，则关闭界面
      if (this.bottom === "0") {
        this.handleClick();
      }
      // 删选掉 不是文书类型组的数据
      if (this.levelNoRequest.includes(data.id)) {
        return;
      }
      if (data.id.startsWith("T_")) {
        this.clearCondition();
        this.typeCode = data.id;
      } else {
        this.clearCondition();
        this.typeGroupCode = data.id;
      }
      this.query();
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.query();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    btnQuery() {
      this.pageParams.pageNo = 1;
      this.pageParams.total = 0;
      this.query();
    },
    //查询
    async query() {
      this.tlm_isLoading = true;
      const lOrgOperateRef = this.$refs.lOrgOperateRef;
      const {
        flagTenant,
        flagHos,
        flagDept,
        flagUser
      } = lOrgOperateRef.judgeFlag();
      const currUserRole = this.getCurrRoleCodeHandler();

      let data = {
        key: this.key,
        templateCode: this.templateCode,
        diseaseId: this.diseaseId,
        typeCode: this.typeCode,
        dnFlag: this.dnFlag,
        typeGroupCode: this.typeGroupCode,
        templateStatus: this.templateStatus,
        signLevel: this.signLevel,
        visitType: this.visitType,
        hosIds: lOrgOperateRef.hosValHandler(),
        currTenant: flagTenant ? 1 : null,
        currHos: flagHos ? 1 : null,
        currDept:
          flagDept && (currUserRole === "other" || currUserRole === "dept")
            ? 1
            : null,
        currUser: flagUser && currUserRole === "other" ? 1 : null,
        level9: flagTenant ? 9 : null,
        level0: flagHos ? 0 : null,
        level1: flagDept ? 1 : null,
        level2: flagUser ? 2 : null,
        deptIds: flagDept ? lOrgOperateRef.deptsHandler() : "",
        persId: this.persId,
        ...this.pageParams
      };
      await getByParams(data)
        .then(res => {
          if (res.code === 1) {
            this.tempTable = res.data;
            this.pageParams.total = res.total;
          } else {
            this.$message.error("获取数据失败");
            return;
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    //重置查询条件
    clearCondition() {
      this.key = "";
      this.templateCode = "";
      this.diseaseId = "";
      this.typeCode = "";
      this.typeGroupCode = "";
      this.templateStatus = "";
      this.signLevel = "";
      this.visitType = "";
      this.dnFlag = "";

      this.$refs.lOrgOperateRef.resetData();
    },
    clearAdd() {
      //初始化文本框
      this.$refs.createTemp.initTemplateData();
      this.viewModel = false;
      this.editModel = true;
    },
    //新建
    create() {
      this.docType = "create";
      this.isNewBuilt = true;
      this.dialogText = "新建病历模板";
      this.dialogVisible = true;
      this.disabledFlag = false;
      setTimeout(() => {
        this.clearAdd();
        getNextSeq().then(res => {
          if (res.code === 1) {
            this.$refs.createTemp.getParamsByKey(res.data);
            // this.$refs.createTemp.setTemplateObj(res.data);
            // this.$refs.createTemp.switchFuncHandler();
            // this.$refs.createTemp.changeOwner();
            // this.$refs.createTemp.initFirstVisit();
          } else {
            this.$message.error("获取模板编码流水号失败");
            return;
          }
        }, 200);
      });
    },
    dblclickOpen(row, column, event) {
      this.$refs.tempTable.clearSelection();
      this.$refs.tempTable.toggleRowSelection(row, true);
      this.openV();
    },
    selectRow(row, column, event) {
      this.$refs.tempTable.toggleRowSelection(row);
    },
    //打开
    async openV() {
      if (this.selection.length <= 0) {
        this.$message.error("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message.error("只能选择一条数据");
        return;
      }

      this.chooseSelectionData = this.selection[0];
      this.editTemplate = this.chooseSelectionData.templateName;

      this.newDnFlag = this.chooseSelectionData.dnFlag;

      this.showEditorFlag =
        this.chooseSelectionData.editor === "02" ? false : true;

      this.openId = this.chooseSelectionData.templateId;

      const params = this.paramsArrHandler([this.selection[0]]);
      this.authControlFlag = await this.authorityHandler(params);

      this.showTemplate();
      if (this.showEditorFlag) {
        this.setDocTypeCode(this.chooseSelectionData.typeCode);
        this.showContent(
          this.chooseSelectionData.templateId,
          this.editTemplate
        );
      }
    },
    showTemplate() {
      this.bottom = "0";
    },
    hiddenTemplate() {
      this.bottom = "-100%";
    },
    //展示病历模板内容
    showContent(templateId, templateName) {
      this.templateLoading = true;
      getContent(templateId)
        .then(res => {
          if (res.code === 1) {
            this.uDataVersion = res.data.dataVersion;
            let content = res.data.content;
            if (content == undefined) {
              content = "";
            }
            //工具栏
            this.recordName = templateName;
            this.valEditorModel = res.data.model;

            // if(this.axeditor != null){
            //   if (this.valEditorModel === "2") {
            //     this.axeditor.execCommand('setmodel',{modelType: 'dirty'});
            //   }else{
            //     this.axeditor.execCommand('setmodel',{modelType: 'design'});
            //   }
            // }

            this.defaultMsg = content;
            this.openId = res.data.id;
            this.openStatus = res.data.templateStatus;

            setTimeout(() => {
              this.refrehTree = true;
            }, 200);
          } else {
            this.$message.error("打开失败!");
            return;
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.templateLoading = false;
        });
    },
    // 判断文书中是否是 审签文书但 没有审签元素
    // eslint-disable-next-line complexity
    isSignRecordButSignLabel() {
      let allSignArr = this.axeditor.execCommand("checksign");
      let lengths = allSignArr.length;
      let signArr = ["02", "03", "04"];

      let flag = true;
      // 无审签处理
      // if (this.chooseSelectionData.signLevel == "01") {
      //   let idx = allSignArr.every(sign => sign.type === "normal");
      //   if (lengths >= 1 && !idx) {
      //     this.$message.error("无审签文书不能设置审签元素");
      //     flag = false;
      //     return flag;
      //   }
      // }

      // 有审签元素
      if (signArr.includes(this.chooseSelectionData.signLevel)) {
        let oneIdx = allSignArr.findIndex(sign => sign.type === "oneLevel");
        let twoIdx = allSignArr.findIndex(sign => sign.type === "twoLevel");
        let threeIdx = allSignArr.findIndex(sign => sign.type === "threeLevel");
        // 一级审签相应逻辑
        if (this.chooseSelectionData.signLevel === "02") {
          // 不包含 2级和3级 审签元素
          if (!(oneIdx >= 0 && twoIdx === -1 && threeIdx === -1)) {
            this.$message.error("请设置对应级别的签名元素");
            flag = false;
            return flag;
          }
        }
        // 二级审签相应逻辑
        if (this.chooseSelectionData.signLevel === "03") {
          // 不包含 3级 审签元素
          if (!(oneIdx >= 0 && twoIdx >= 0 && threeIdx === -1)) {
            this.$message.error("请设置对应级别的签名元素");
            flag = false;
            return flag;
          }
        }

        // 三级审签相应逻辑
        if (this.chooseSelectionData.signLevel === "04") {
          // 不包含 3级 审签元素
          if (!(oneIdx >= 0 && twoIdx >= 0 && threeIdx >= 0)) {
            this.$message.error("请设置对应级别的签名元素");
            flag = false;
            return flag;
          }
        }
      }

      return flag;
    },
    saveHandler(content, opTp) {
      this.saveContent(content, this.newDnFlag);
    },
    saveContent(content, dnFlag) {
      if (this.controlSaveFlag) return;
      this.controlSaveFlag = true;

      let data = {
        id: this.openId,
        content: content,
        dataVersion: this.uDataVersion,
        dnFlag: dnFlag,
        editor: "01"
      };

      // 文书审签元素相关逻辑判断
      if (!this.isSignRecordButSignLabel()) {
        return;
      }
      //编辑启用或停用状态的模板时
      if (this.openStatus === 1 || this.openStatus === 2) {
        data.flag = "false";
        upVersion(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("保存成功，已新建升级版本！");
              this.defaultMsg = "";
              this.hiddenTemplate();
              this.query();
              return;
            } else if (res.code === 60101) {
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
                  data.flag = "true";
                  upVersion(data).then(res => {
                    if (res.code === 1) {
                      this.$message.success("保存成功，已覆盖已有升级版本！");
                      this.hiddenTemplate();
                      this.query();
                    } else {
                      this.$message.error("保存失败!" + res.msg);
                      return;
                    }
                  });
                })
                .catch(action => {
                  if (action === "cancel") {
                    this.defaultMsg = "";
                    this.query();
                  }
                });
            } else {
              this.$message.error("新增失败!");
              return;
            }
          })
          .catch(res => {
            this.$message.error("保存失败!" + res.msg);
          })
          .finally(() => {
            this.controlSaveFlag = false;
          });
      } else if (this.openStatus === 0) {
        //编辑新建状态的模板时
        return saveContent(data)
          .then(res => {
            if (res.code === 1) {
              this.defaultMsg = content;
              this.$message.success("保存成功");
              this.uDataVersion = res.data.dataVersion;
              this.query();
              return;
            } else {
              this.$message.error(res.msg || "保存失败!");
              return;
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "保存失败!");
          })
          .finally(() => {
            this.controlSaveFlag = false;
          });
      }

      return false;
    },
    //删除
    delete(delArr) {
      removeTemplate(delArr).then(res => {
        if (res.code === 1) {
          this.$message.success("删除成功!");
          this.query();
        } else {
          this.$message.error("删除失败!");
          return;
        }
      });
    },

    //属性
    async showProp() {
      this.isNewBuilt = false;
      if (this.selection.length <= 0) {
        this.$message.error("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message.error("只能选择一条数据");
        return;
      }

      this.docType = "edit";
      this.dialogText = "编辑病历模板";
      let data = {};
      this.dialogVisible = true;

      const params = this.paramsArrHandler([this.selection[0]]);
      const flag = await this.authorityHandler(params);

      this.disabledFlag = !flag;

      getDetail(this.selection[0].templateId, data).then(res => {
        if (res.code === 1) {
          this.clearAdd();
          let temp = res.data;
          temp.templateCode = temp.templateCode.replace(
            this.$refs.createTemp.prefix,
            ""
          );
          temp.templateStatus = temp.templateStatus.toString();
          this.$refs.createTemp.templatePO = temp;
          this.$refs.createTemp.switchFuncHandler();
          this.$refs.createTemp.changeOwner();
          // this.$refs.createTemp.initFirstVisit();
          //所属范围为全院时因为取不到真正的hosId,
          if (this.$refs.createTemp.templatePO.scopeLevel === "0") {
            this.$refs.createTemp.templatePO.ownerId = JSON.parse(
              getPamars()
            ).hosId;
          } else {
            this.$refs.createTemp.templatePO.ownerId = res.data.ownerId;
          }
          if (res.data.templateStatus != "0") {
            this.viewModel = true;
            this.editModel = false;
          } else if (
            res.data.templateStatus == "0" &&
            res.data.templateVersion > 0
          ) {
            this.$message.info("模板的升级版本不能修改模板基本信息！");
            this.viewModel = true;
            this.editModel = false;
          } else {
            this.viewModel = false;
            this.editModel = true;
          }
        } else {
          this.$message.error("获取明细失败!");
          return;
        }
      });
    },
    //启用
    async enable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message.error("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.templateStatus;
        if (status == "1") {
          this.$message.error(index.templateName + "已启用，不能再次启用!");
          return;
        } else if (status != "0" && status != "2") {
          this.$message.error(index.templateName + "状态不正确不能启用!");
          return;
        }
        let data = {
          templateId: index.templateId,
          templateCode: index.templateCode,
          templateName: index.templateName,
          templateStatus: index.templateStatus,
          dataVersion: index.dataVersion
        };
        arr.push(data);
      }
      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) {
        return;
      }

      setEnable(arr)
        .then(res => {
          if (res.code === 1) {
            this.$message.success({
              message: "启用成功!",
              type: "success"
            });
            this.query();
          } else {
            this.$message.error("启用失败!" + res.message);
            return;
          }
        })
        .catch(res => {
          this.$message.error({
            type: "error",
            message: res.msg
          });
        });
    },
    //停用
    async disable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message.error("请您先选中数据");
        return;
      }
      let arr = [];
      let defaultArr = [];
      for (let index of this.selection) {
        let status = index.templateStatus;
        if (status == "2") {
          this.$message.error(index.templateName + "已停用，不能再次停用!");
          return;
        } else if (status != "1") {
          this.$message.error(index.templateName + "状态不正确，不能停用!");
          return;
        }

        //门诊的默认模板停用时要提示，必须重新设置默认模板
        if (index.isDefault === "1" && index.visitType === "01") {
          defaultArr.push(index.templateCode);
        }
        let data = {
          templateId: index.templateId,
          templateCode: index.templateCode,
          templateName: index.templateName,
          templateStatus: index.templateStatus,
          dataVersion: index.dataVersion
        };
        arr.push(data);
      }
      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) {
        return;
      }

      setDisable(arr)
        .then(res => {
          if (res.code === 1) {
            this.$message.success({
              message: "停用成功!",
              type: "success"
            });
            setTimeout(() => {
              if (defaultArr.length > 0) {
                this.$message.error({
                  message:
                    "门诊模板:" +
                    defaultArr +
                    "为默认模板，停用后需重新设置相应的默认模板，否则门诊对应功能将无法使用！",
                  type: "warning",
                  duration: 3000
                });
              }
            }, 200);
            setTimeout(() => {
              this.query();
            }, 3000);
          } else {
            this.$message.error("停用失败!" + res.message);
            return;
          }
        })
        .catch(res => {
          this.$message.error({
            type: "error",
            message: res.msg
          });
        });
    },
    //对话框关闭
    dialogClose() {
      this.dialogVisible = false;
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    async handleRemove() {
      if (this.selection.length <= 0) {
        this.$message.error("请您先选中数据");
        return;
      }
      let arr = [];

      for (let index of this.selection) {
        if (index.templateStatus != "0") {
          this.$message.error(index.templateName + "不是新建状态，不能删除！");
          return;
        }
        arr.push(index.templateId);
      }
      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) {
        return;
      }
      this.handleDelete(arr);
    },
    paramsArrHandler(arr = []) {
      let list = [];
      list = arr.map(item => {
        return {
          id: item.templateId,
          code: item.templateCode,
          scopeLevel: item.scopeLevel,
          ownerId: item.ownerId,
          oprRoleLevel: item.oprRoleLevel
        };
      });
      return list;
    },
    async handleDelete(arr) {
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete(arr);
        })
        .catch(() => {
          this.$message.error({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleDetermine() {
      if (
        this.$refs.createTemp.templatePO.templateCode === "" ||
        !this.$refs.createTemp.templatePO.templateCode
      ) {
        this.$message.error("文书编码不可为空！");
        return;
      }

      if (
        this.$refs.createTemp.templatePO.templateName === "" ||
        !this.$refs.createTemp.templatePO.templateName
      ) {
        this.$message.error("文书名称不可为空！");
        return;
      }
      if (
        this.$refs.createTemp.templatePO.typeCode === "" ||
        !this.$refs.createTemp.templatePO.typeCode
      ) {
        this.$message.error("文书类型不可为空！");
        return;
      }

      // 护士 不需要填写基础模板 1 医生 2 护士
      if (
        this.$refs.createTemp.templatePO.editor === "01" &&
        (this.$refs.createTemp.templatePO.basicCode === "" ||
          !this.$refs.createTemp.templatePO.basicCode)
      ) {
        this.$message.error("基础模版为必填选项，请选择基础模版！");
        return;
      }

      if (this.$refs.createTemp.templatePO.ageParam1) {
        let value = this.$refs.createTemp.templatePO.ageParam1;
        if (!Number.isInteger(value)) {
          this.$message.error("请输入数字值");
          return;
        } else if (value >= 200 || value < 0) {
          this.$message.error("年龄必须大于0小于200");
          return;
        }
      }
      if (this.$refs.createTemp.templatePO.ageParam2) {
        let value = this.$refs.createTemp.templatePO.ageParam2;
        if (!Number.isInteger(value)) {
          this.$message.error("请输入数字值");
          return;
        } else if (value >= 200 || value < 0) {
          this.$message.error("年龄必须大于0小于200");
          return;
        }
      }

      let data = { ...this.$refs.createTemp.mergerData() };

      if (!data.editor) {
        this.$message.error("请选择编辑器模式");
        return;
      }
      data.templateCode = this.$refs.createTemp.prefix + data.templateCode;
      if (
        data.templateId == undefined ||
        data.templateId == null ||
        data.templateId == ""
      ) {
        save(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.clearCondition();

              // 重置分页数据
              this.pageParams.pageNo = 1;
              this.newDnFlag = res.data.dnFlag;
              let data1 = this.pageParams;
              // 获取列表数据
              getByParams(data1).then(res => {
                if (res.code === 1) {
                  this.dialogVisible = false;
                  this.tempTable = res.data;
                  this.setSelectRow(data);
                  this.openV();
                } else {
                  this.$message.error("获取数据失败");
                  return;
                }
              });
            } else {
              this.$message.error("操作失败!" + res.msg);
              return;
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error(error || "创建失败");
          });
      } else {
        update(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.clearCondition();
              this.query();
              this.dialogVisible = false;
            } else {
              this.$message.error("操作失败：" + res.msg);
              // return;
            }
          })
          .catch(res => {
            this.$message.error({
              type: "error",
              message: res.msg
            });
          });
      }
    },
    setSelectRow(data) {
      this.tempTable.forEach((item, index) => {
        if (
          item.templateCode == data.templateCode &&
          item.templateStatus === 0
        ) {
          this.$refs.tempTable.clearSelection();

          //this.$refs.tempTable.setCurrentRow(item);
          // this.$refs.tempTable.toggleRowSelection(this.tempTable[index], true);

          this.selection = [this.tempTable[index]];
        }
      });
    },
    //取消
    handleCancel() {
      this.dialogVisible = false;
      this.btnQuery();
    },
    //复制模板
    copy() {
      if (this.selection.length <= 0) {
        this.$message.error("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        if (index.templateName.length > 90) {
          this.$message.error("模板名称过长！");
          return;
        }
        arr.push(index.templateId);
      }
      copyTemplates(arr).then(res => {
        if (res.code === 1) {
          this.$message.success("操作成功");
          this.clearCondition();
          this.query();
        } else {
          this.$message.error("复制失败");
          return;
        }
      });
    }
  },
  computed: {
    getTemplateId() {
      if (this.selection != null && this.selection.length > 0) {
        let templateId = this.selection[0].templateId;
        return templateId;
      }
      return "";
    },
    recordModelFlag() {
      return !!this.axeditor && this.authControlFlag;
    }
  },
  async beforeRouteLeave(to, from, next) {
    next(false);

    this.$root.eventHub.$off("managePlanInsert");
    this.$root.eventHub.$off("insertRecordHander");
    this.$root.eventHub.$off("deleteglHandler");

    let modifyFLag = false;
    let item = this.tempTable.find(val => {
      return val.templateId == this.openId;
    });
    if (item && item.editor === "01") {
      modifyFLag = this.axeditor.execCommand("ismodified");
    } else {
      //护理编辑器判断是否修改
      modifyFLag = this.$refs.formEditor && this.$refs.formEditor.isModify;
    }

    if (modifyFLag) {
      this.$confirm("当前模板存在修改，是否保存?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(async () => {
          if (item && item.editor === "01") {
            this.saveContent(this.axeditor.getContent(), item.dnFlag)
              .then(() => {
                next();
              })
              .catch(error => {
                this.$message.error(error.msg || "保存失败");
              });
          } else {
            //护理编辑器保存
            (await this.$refs.formEditor) &&
              this.$refs.formEditor.saveGZ(false);
            this.hiddenTemplate();
            return;
          }
        })
        .catch(async action => {
          if (action === "cancel") {
            //取消，放弃保存，离开页面
            this.defaultMsg = "";
            this.hiddenTemplate();
            await this.query();
          }
        });
    } else {
      next();
    }

    // if (this.axeditor.execCommand("ismodified")) {
    //   //let content = this.editor.getContent()
    //   if (this.receivePatientData.patientId) {
    //     this.$confirm("病历未保存，是否继续?", "提示", {
    //       confirmButtonText: "是",
    //       cancelButtonText: "否",
    //       type: "warning"
    //     }).then(() => {
    //       //this.save(content)
    //       next();
    //     });
    //   } else {
    //     next();
    //   }
    // } else {
    //   next();
    // }
  }
};
</script>

<style scoped lang="scss">
.hd-container {
  overflow: hidden;
  /deep/ .wrapper {
    overflow: hidden;
  }

  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }

  .el-tabs {
    height: 100%;
  }

  .left {
    height: 100%;
    /*width: 245px;*/
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
        float: left;
        width: calc(100% - 150px);
      }
      .search-btns {
        width: auto;
        float: right;
        font-size: 0;
      }
    }

    .common-width {
      margin-right: 10px;
      float: left;
      width: 240px;
    }

    .special-item {
      width: 900px;
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
        padding: 10px 10px;
        position: relative;
        height: 44px;

        .btn-position {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }
    }
  }

  .right-containter {
    display: flex;
    flex-direction: column;

    .table-area {
      flex: 1;
      overflow: hidden;
      padding: 10px 20px;
      border-top: 1px solid #dcdfe6;
    }
  }

  .axEditor-demo {
    width: 100%;
    height: calc(100% - 44px);

    .editor-left {
      height: 100%;
      /*flex:1;*/
      /*margin-right: 320px;*/
    }
    /*.editor-left-min {*/
    /*  height: 100%;*/
    /*  flex:1;*/
    /*  margin-right: 320px;*/
    /*}*/

    .tool-right {
      float: right;
      /*width: 300px;*/
      height: 100%;
    }
    /*.tool-right-min {*/
    /*  float: right;*/
    /*  width: 50px;*/
    /*  height: 100%;*/
    /*}*/
  }

  .margin-top-10 {
    margin-top: 10px;
  }
}
</style>
