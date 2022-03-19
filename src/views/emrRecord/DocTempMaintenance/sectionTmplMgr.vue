<template>
  <div class="hd-container height100">
    <flow-menu>
      <el-card class="left height100">
        <div style="padding: 10px; overflow: auto" class="height100">
          <el-row>
            <el-col :span="8">
              <el-button @click="createGroup">新建</el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="editGroup">编辑</el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="handleDeleteG">删除</el-button>
            </el-col>
          </el-row>

          <el-dialog
            :title="tgDialogMode"
            :visible.sync="createTypeGroupDialog"
            :close-on-click-modal="false"
            width="480px"
          >
            <div style="width: 480px; padding: 20px 40px">
              <div
                style="
                  height: 14px;
                  width: 3px;
                  background-color: #f05a23;
                  float: left;
                "
              ></div>
              <span style="float: left; margin-left: 8px">基本属性</span>
              <div style="clear: both"></div>
              <el-row style="margin-top: 20px">
                <el-col :span="5"
                  ><span
                    style="line-height: 30px; margin-left: 2em"
                    class="necessary-control"
                    >编码</span
                  ></el-col
                >
                <el-col :span="19"
                  >{{ gPrefix
                  }}<el-input
                    disabled
                    v-model="gCode"
                    style="width: 278px"
                    @change="handleChageGCode"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px" class="necessary-control"
                    >上级编码</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-select
                    v-model="createTypeGroupData.parentId"
                    @change="getNextNumber"
                    clearable
                    placeholder="请选择"
                    style="width: 298px"
                    default-first-option
                  >
                    <el-option
                      v-for="item in typeGroupOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span
                    style="line-height: 30px; margin-left: 2em"
                    class="necessary-control"
                    >名称</span
                  >
                </el-col>
                <el-col :span="19"
                  ><el-input
                    maxlength="200"
                    v-model="createTypeGroupData.paragraphTypeName"
                    style="width: 298px"
                  ></el-input
                ></el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px">就诊类型</span></el-col
                >
                <el-col :span="19">
                  <l-value-domain-emr
                    clearable
                    filterable
                    style="width: 298px"
                    code="MedicalRecordType"
                    :value.sync="createTypeGroupData.visitType"
                    placeholder="请选择"
                  ></l-value-domain-emr>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px" class="necessary-control"
                    >医护标识</span
                  ></el-col
                >
                <el-col :span="19">
                  <l-value-domain-emr
                    clearable
                    filterable
                    style="width: 298px"
                    code="EmployeeMark"
                    :value.sync="createTypeGroupData.dnFlag"
                    placeholder="请选择"
                    @change="dnFlagChange"
                  ></l-value-domain-emr>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px">
                <el-col :span="5">
                  <span style="line-height: 30px" class="necessary-control"
                    >文书类型</span
                  >
                </el-col>
                <el-col :span="19">
                  <el-select
                    multiple
                    collapse-tags
                    filterable
                    v-model="codeList"
                    clearable
                    placeholder="请选择"
                    style="width: 298px"
                  >
                    <el-option
                      v-for="item in ownNameOpt"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <el-row style="margin-top: 18px">
                <el-col :span="5"
                  ><span style="line-height: 30px; margin-left: 2em"
                    >顺序</span
                  ></el-col
                >
                <el-col :span="19">
                  <el-input-number
                    v-model="createTypeGroupData.number"
                    controls-position="right"
                    :min="1"
                    style="width: 298px"
                  ></el-input-number>
                </el-col>
              </el-row>
              <el-row style="margin-top: 18px; height: 142px">
                <el-col :span="5"
                  ><span style="line-height: 30px; margin-left: 2em"
                    >描述</span
                  ></el-col
                >
                <el-col :span="19"
                  ><el-input
                    type="textarea"
                    v-model="createTypeGroupData.description"
                    style="width: 298px"
                  ></el-input
                ></el-col>
              </el-row>
            </div>
            <div slot="footer">
              <el-button type="primary" @click="paragraphTyepSbimt">
                确定
              </el-button>
              <el-button @click="createTypeGroupDialog = false">取消</el-button>
            </div>
          </el-dialog>
          <el-tree
            :expand-on-click-node="false"
            :data="data"
            default-expand-all
            node-key="id"
            ref="tree"
            @node-click="handleChange"
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </div>
      </el-card>
      <el-card class="right">
        <div class="height100">
          <div style="display: inline-block; margin: 10px 20px">
            <div class="search-con clearfix">
              <div class="search-main float-left">
                <div class="common-width margin-top-10">
                  <l-formt-title label="关键字">
                    <el-input v-model="form.key"></el-input
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="片语编码">
                    <el-input v-model="form.sectionTemplateCode"></el-input
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="适用病种">
                    <l-value-domain-emr
                      type="noselect"
                      clearable
                      filterable
                      :value.sync="form.diseaseId"
                      remoteUrl="/diseases/params"
                      remoteShowKey="diseasesName"
                      remoteValueKey="diseasesId"
                      :remoteParams="diseaseParams"
                      :localFilterKeys="['diseasesName']"
                      placeholder="请选择病种"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="文书类型">
                    <l-value-domain-emr
                      clearable
                      filterable
                      :value.sync="form.docTypeCode"
                      remoteUrl="/type/getTypeSelectByCondition"
                      remoteShowKey="name"
                      remoteValueKey="code"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="片语类型">
                    <l-value-domain-emr
                      clearable
                      filterable
                      ref="typeCodeRequest"
                      :value.sync="form.typeCode"
                      remoteUrl="/paragraphType/list"
                      remoteShowKey="paragraphTypeName"
                      remoteValueKey="paragraphTypeCode"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="片语状态">
                    <l-value-domain-emr
                      clearable
                      code="ModelStatus"
                      :value.sync="form.sectionTemplateStatus"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="医护标识">
                    <l-value-domain-emr
                      clearable
                      code="EmployeeMark"
                      :value.sync="form.dnFlag"
                      placeholder="请选择"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10">
                  <l-formt-title label="就诊类型">
                    <l-value-domain-emr
                      clearable
                      filterable
                      code="MedicalRecordType"
                      :value.sync="form.visitType"
                      placeholder="请选择"
                      @change="handleVisitTypeChange"
                    ></l-value-domain-emr
                  ></l-formt-title>
                </div>
                <div class="common-width margin-top-10 special-item">
                  <l-formt-title>
                    <el-checkbox v-model="level0">全院</el-checkbox>
                    <el-checkbox v-model="level1">科室</el-checkbox>
                    <l-value-domain
                      multiple
                      collapse-tags
                      clearable
                      filterable
                      :localFilterKeys="['orgNm']"
                      style="width: 210px"
                      :value.sync="deptVal"
                      remoteUrl="/wadmin/hos/dept"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder="请选择所属科室"
                      @change="changeDept"
                    ></l-value-domain>
                    <el-checkbox v-model="level2"
                      >个人</el-checkbox
                    ></l-formt-title
                  >
                </div>
              </div>
              <div class="float-right margin-top-10">
                <el-button
                  class="el-button--primary"
                  style="height: 30px"
                  @click="handleQuery"
                  >查询
                </el-button>
                <el-button
                  class="el-button--default"
                  style="height: 30px"
                  @click="handleReset"
                  >重置
                </el-button>
              </div>
            </div>
          </div>
          <div
            style="
              padding: 10px 20px;
              border-top: 1px solid #dcdfe6;
              height: calc(100% - 160px);
            "
          >
            <div class="clearfix">
              <div class="float-right">
                <el-button @click="create" icon="el-icon-plus">新建</el-button>
                <el-button
                  icon="el-icon-edit-outline"
                  :disabled="openDisabled"
                  @click="openV"
                  >打开
                </el-button>
                <el-button icon="el-icon-remove-outline" @click="handleRemove"
                  >删除
                </el-button>
                <el-button icon="el-icon-setting" @click="propOnClick"
                  >属性</el-button
                >
                <el-button icon="el-icon-check" @click="enable">启用</el-button>
                <el-button icon="el-icon-close" @click="disable"
                  >停用
                </el-button>
                <el-button icon="el-icon-copy" @click="copy">复制</el-button>
              </div>
            </div>
            <div class="" style="height: calc(100% - 40px); margin-top: 10px">
              <l-table
                :total="pageParams.total"
                :pageSize.sync="pageParams.pageSize"
                :page.sync="pageParams.pageNo"
                :layout="layout"
                :singlePageShow="true"
                @changeSize="changeSize"
              >
                <el-table
                  stripe
                  class="my-table"
                  :data="sectionTemplateData"
                  ref="sectionTempTable"
                  v-loading="tlm_isLoading"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="dblclickOpen"
                  @row-click="selectRow"
                  border
                  height="100%"
                  style="width: 100%"
                >
                  <el-table-column
                    fixed
                    type="selection"
                    width="40"
                  ></el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    :index="indexMethod"
                    fixed
                    width="50"
                  ></el-table-column>
                  <el-table-column
                    prop="sectionTemplateCode"
                    label="片语编码"
                    width="200"
                  ></el-table-column>
                  <el-table-column
                    prop="sectionTemplateName"
                    label="片语名称"
                    width="200"
                  ></el-table-column>
                  <el-table-column
                    prop="diseaseId"
                    label="适用病种"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.diseaseId != ''"
                        tableName="md_diseases"
                        :conditionMap="{ diseases_id: scope.row.diseaseId }"
                        columns="diseases_name"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="typeCode" label="片语类型" width="100">
                    <template slot-scope="scope">
                      <span
                        tableName="mr_paragraph_type"
                        :conditionMap="{
                          paragraph_type_code: scope.row.typeCode,
                        }"
                        columns="paragraph_type_name"
                        v-tableTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="typeCode" label="医护标识" width="100">
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.dnFlag"
                        code="EmployeeMark"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sectionTemplateStatus"
                    label="片语状态"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.sectionTemplateStatus"
                        code="ModelStatus"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="scopeLevel"
                    label="所属级别"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.scopeLevel"
                        code="LevelType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ownerName"
                    label="所属名称"
                    width="160"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="visitType"
                    label="就诊类型"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.visitType != ''"
                        :val="scope.row.visitType"
                        code="MedicalRecordType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="editor" label="编辑器">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.editor != ''"
                        :val="scope.row.editor"
                        code="PhraseEditorType"
                        v-codeTransformEmr
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="描述"
                  ></el-table-column>
                </el-table>
              </l-table>
            </div>
          </div>
          <edit-section
            ref="createSection"
            :isShow.sync="dialogVisible"
            :template="sTemplate"
            :isNewBuilt="isNewBuilt"
            :disabledFlag="disabledFlag"
            @handle-save="handleSave"
            @handle-update="handleUpdate"
          ></edit-section>
        </div>
        <el-card
          class="height-bottom"
          :style="{ bottom: bottom }"
          v-loading="templateLoading"
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
                :currentTypeCode="currentTypeCode"
                :open.sync="open"
                :editor="axeditor"
              />
            </div>
            <div
              class="editor-left"
              :style="open ? ' margin-right: 320px;' : ' margin-right: 70px;'"
            >
              <l-editor
                ref="axEditor"
                @save="saveContent"
                @ready="editorReady"
                :configs="editorConfigs"
                :defaultMsg="defaultMsg"
              >
              </l-editor>
            </div>
          </div>
          <!-- TODO: 暂时不用下面结构来修改内容 -->
          <!-- <div class="axEditor-demo" v-if="!showEditorFlag">
            <div
              style="
                width: 100%;
                height: 100%;
                text-align: center;
                margin-top: 20px;
              "
              id="textarea"
            >
              <el-input
                type="textarea"
                :rows="rows"
                style="width: calc(100% - 40px)"
                v-model="careContent"
              ></el-input>
              <el-button
                type="primary"
                style="margin: 20px; float: right"
                @click="saveCareContent"
                >保存
              </el-button>
            </div>
          </div> -->
        </el-card>
      </el-card>
    </flow-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import LEditor from "@/components/LEditor";
import Tools from "@/views/public/tools/emrTools";
import FlowMenu from "@/components/FlowMenu";
import EditSection from "./component/editSection";

import commonMixins from "./mixins/common.js";

import {
  getManageList,
  getTree,
  getContent,
  saveContent,
  getDetail,
  removeSectionTemplate,
  setEnable,
  setDisable,
  copyTemplates,
  getNextSeqNo
} from "@/api/emrRecord/emr/sectionTemplate";

import { getTypes } from "@/api/emrRecord/emr/type";
import {
  getParagraphTypeOpt,
  getIcd10DictionaryByKey,
  getParagraphTypeNextSeqNo,
  create,
  deleteByParagraphType
} from "@/api/emrRecord/emr/paragraphType";
import { getPamars } from "@/utils/auth";

import { getUId } from "@/utils/crypto";
import { listToTree } from "@/utils/util";

export default {
  name: "sectionTemplateManagement",
  components: {
    LEditor,
    Tools,
    FlowMenu,
    EditSection
  },
  data() {
    return {
      prefix: "MT_",
      gPrefix: "PT_",
      bottom: "-100%",
      openDisabled: false,
      tree: [],
      codeList: [],
      ownNameOpt: [],
      tgDialogMode: "新建片语类型组",
      createTypeGroupDialog: false,
      gCode: "",
      delPT: {
        paragraphTypeCode: "",
        paragraphTypeId: ""
      },
      vParentId: "qy",
      createTypeGroupData: {
        paragraphTypeCode: "",
        paragraphTypeName: "",
        visitType: "",
        dnFlag: "",
        number: "",
        description: "",
        paragraphTypeStatus: "",
        parentId: "",
        typeAndParagraph: []
      },
      // typeGroupOptions: [],
      typeGroupOptions: [
        {
          key: "qy",
          label: "全院通用",
          value: "qy"
        }
        // {
        //   key: "ks",
        //   label: "科室通用",
        //   value: "ks"
        // },
        // {
        //   key: "gr",
        //   label: "个人",
        //   value: "gr"
        // }
      ],

      diseaseParams: {
        deletedStatus: "0",
        enabled: "1"
      },
      open: false,
      defaultMsg: "",
      editModel: true,
      viewModel: false,
      templateLoading: false,
      tlm_isLoading: false,
      valEditorModel: "design",
      showEditorFlag: false,
      editorConfigs: {
        id: this.openId,
        editorModel: "design",
        defaultModel: "design",
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
              /* [{
                    id: 'copy',
                    name: '复制'
                  },
                    {
                      id: 'cut',
                      name: '剪切'
                    },
                    {
                      id: 'paste',
                      name: '粘贴'
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
                // id: 'macro',
                // name: '基本元素'
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
        "SpecialSymbol"
      ],
      refrehTree: false,
      recordName: "",
      treeData: "",
      editTemplate: "",
      //显示病历编辑器
      showEmrEditor: false,
      data: [],
      vNumArr: [],
      sectionTemplateData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        key: "",
        sectionTemplateCode: "",
        sectionTemplateStatus: "",
        diseaseId: "",
        typeCode: "",
        dnFlag: "",
        docTypeCode: "",
        visitType: ""
      },
      level0: false,
      level1: false,
      level2: false,
      hosId: "",
      persId: "",
      deptVal: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      layout: "total,prev,pager,next,jumper",
      dialogVisible: false,
      selectOptions: [],
      selection: [],
      axeditor: null,
      openId: "",
      sTemplate: {},
      sTemplateOldEditor: "",
      model: "all",
      loading: false,
      diseaseOpt: [],
      rows: 10,
      careContent: "",
      oCareContent: "",
      showToolBox: false,
      currentTypeCode: "",
      isNewBuilt: true, // 是否是新建
      disabledFlag: false
    };
  },
  mixins: [commonMixins],
  watch: {
    gCode(val) {
      this.createTypeGroupData.paragraphTypeCode = this.gPrefix + val;
    },
    "createTypeGroupData.visitType": {
      handler(val) {
        this.getMrTyppe(val, this.createTypeGroupData.dnFlag || "");
      }
    },
    "createTypeGroupData.dnFlag": {
      handler(val) {
        this.getMrTyppe(this.createTypeGroupData.visitType || "", val);
      }
    },
    selection: {
      handler(value) {
        if (value && value.length === 1) {
          if (value[0].editor !== "01") {
            this.openDisabled = true;
          } else {
            this.openDisabled = false;
          }
        } else {
          this.openDisabled = false;
        }
      },
      deep: true
    }
  },
  created() {
    //住院
    if (this.$route.path == "/ipnw/orderRecord/sectionTemplate") {
      //住院
      this.model = "inPatient";
    } else if (this.$route.path == "/cis/cisThree/sectionTemplate") {
      //门诊
      this.model = "outPatient";
    } else {
      this.model = "all";
    }
    this.getManageTree();
    this.handleQuery();
    this.getMrTyppe();
  },
  methods: {
    dnFlagChange(val) {
      console.log(val, "valvalval");
      switch (val) {
        case "":
          this.createTypeGroupData.dnFlagName = "";
          break;
        case "1":
          this.createTypeGroupData.dnFlagName = "医生";
          break;
        case "2":
          this.createTypeGroupData.dnFlagName = "护士";
          break;
        default:
          break;
      }
    },
    saveCareContent() {
      let item = this.sectionTemplateData.find(val => {
        return val.sectionTemplateId == this.openId;
      });
      this.saveContent(this.careContent, item.dnFlag, this.selection[0].editor);
      // this.hiddenTemplate();
      // this.careContent = "";
      this.oCareContent = this.careContent;
    },
    calRows() {
      let height = document.getElementById("textarea").offsetHeight;
      this.rows = parseInt(height / 30);
    },
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then(resData => {
        if (resData.code === 1 && resData.data) {
          this.diseaseOpt = resData.data;
        } else {
          this.$message("接口失败1");
          return;
        }
      });
    },

    async transformTable(columns, conditionMap, tableName) {
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
        return "未知";
      } catch (error) {
        return "未知";
      }
    },
    //编辑器初始化完成
    editorReady(instance) {
      this.axeditor = instance;
      if (this.axeditor != null) {
        this.showToolBox = true;
        this.refrehTree = true;
        if (this.valEditorModel === "2") {
          this.axeditor.execCommand("setmodel", { modelType: "dirty" });
        }
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
    handleClick() {
      let modifyFLag = false;
      let item = this.sectionTemplateData.find(val => {
        return val.sectionTemplateId == this.openId;
      });

      if (item.editor === "01") {
        modifyFLag = this.axeditor.execCommand("ismodified");
      } else {
        modifyFLag = this.oCareContent != this.careContent;
      }

      if (modifyFLag) {
        this.$confirm("当前片语模板存在修改, 是否保存?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(() => {
            if (item.editor === "01") {
              this.saveContent(this.axeditor.getContent(), item.dnFlag);
            } else {
              this.saveContent(this.careContent, item.dnFlag, item.editor);
            }
            this.hiddenTemplate();
            this.defaultMsg = "";
            this.careContent = "";
            this.oCareContent = "";
            // this.handleQuery();
          })
          .catch(action => {
            if (action === "cancel") {
              this.defaultMsg = "";
              this.hiddenTemplate();
              this.handleQuery();
            }
          });
      } else {
        this.hiddenTemplate();
      }
    },
    getManageTree() {
      let visitType = "";
      if (this.model === "outPatient") {
        visitType = "01";
      } else if (this.model === "inPatient") {
        visitType = "04";
      }

      // 门诊传 01
      let params = { visitType };
      getTree(params).then(res => {
        if (res.code === 1) {
          this.data = res.data;
        } else {
          this.$message("请求数据失败");
          return;
        }
      });
    },
    //对话框关闭
    handleClose(val) {
      this.dialogVisible = val;
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.fetchData();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    handleChageGCode() {
      if (this.gCode == "") {
        this.$message.error("编码不可为空！");
      }
    },
    // 列表请求数据
    fetchData() {
      let form = Object.assign(this.form, this.pageParams);
      getManageList(form)
        .then(res => {
          this.tlm_isLoading = false;
          if (res.code === 1 && res.data) {
            this.pageParams.total = res.total;
            this.sectionTemplateData = res.data;
          } else {
            this.$message("获取数据失败");
            return;
          }
        })
        .catch(err => {
          this.tlm_isLoading = false;
          this.$message("获取数据失败");
        });
    },
    //新建按钮
    create() {
      this.isNewBuilt = true;
      this.disabledFlag = false;
      getNextSeqNo().then(res => {
        if (res.code === 1) {
          this.sTemplate = {
            sectionTemplateStatus: "0",
            scopeLevel: "",
            sectionTemplateCode: res.data
          };
          setTimeout(() => {
            this.dialogVisible = true;
          }, 200);
        } else {
          this.$message.error("获取片语模板流水号失败！");
          return;
        }
      });
    },
    //打开编辑器编辑模板内容
    dblclickOpen(row, column, event) {
      this.$refs.sectionTempTable.clearSelection();
      this.$refs.sectionTempTable.toggleRowSelection(row, true);
      if (row.editor === "01") {
        this.openV();
      } else {
        this.propOnOneClick();
      }
    },
    selectRow(row, column, event) {
      this.$refs.sectionTempTable.toggleRowSelection(row);
    },
    handleVisitTypeChange() {
      if (this.model === "inPatient" && this.form.visitType == "01") {
        this.form.visitType = "04";
        this.$message("没有权限");
        return;
      }
      if (this.model === "outPatient" && this.form.visitType == "04") {
        this.form.visitType = "01";
        this.$message("没有权限");
        return;
      }
    },
    //打开
    async openV() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }
      this.editTemplate = this.selection[0].sectionTemplateName;

      this.showEditorFlag = this.selection[0].editor === "01" ? true : false;
      this.sTemplateOldEditor = this.selection[0].editor;
      this.sTemplate = this.selection[0];
      this.openId = this.selection[0].sectionTemplateId;
      if (!this.showEditorFlag) {
        setTimeout(() => {
          this.calRows();
        });
      }
      await this.transformTable(
        "paragraph_type_name",
        {
          paragraph_type_code: this.selection[0].typeCode
        },
        "mr_paragraph_type"
      ).then(res => {
        this.currentTypeCode = res;
      });
      this.showTemplate();
      this.showContent(
        this.selection[0].sectionTemplateId,
        this.editTemplate,
        this.selection[0].editor
      );
    },
    showTemplate() {
      this.bottom = "0";
    },
    hiddenTemplate() {
      this.bottom = "-100%";
    },
    //展示病历模板内容
    showContent(templateId, templateName, editor) {
      this.templateLoading = true;
      getContent(templateId)
        .then(res => {
          this.templateLoading = false;
          if (res.code === 1) {
            let content = res.data.content || "";
            let sectionTemplateContext = res.data.sectionTemplateContext || "";
            //工具栏
            this.recordName = templateName;

            this.valEditorModel = res.data.model;

            if (editor === "01") {
              //医
              if (this.axeditor != null) {
                this.refrehTree = true;
                if (this.valEditorModel === "2") {
                  if (this.axeditor.options.editorModel != "dirty") {
                    this.axeditor.execCommand("setmodel", {
                      modelType: "dirty"
                    });
                  }
                } else {
                  this.axeditor.execCommand("setmodel", {
                    modelType: "design"
                  });
                }
              }
              this.defaultMsg = content;
              this.careContent = "";
              this.oCareContent = "";
            } else if (editor === "03") {
              // text 护理文书格式暂时不实现
              this.defaultMsg = "";
              if (this.sTemplate.editor != this.sTemplateOldEditor) {
                this.careContent = "";
                this.oCareContent = "";
              } else {
                this.careContent = sectionTemplateContext;
                this.oCareContent = sectionTemplateContext;
              }
            } else {
              this.careContent = content;
              this.oCareContent = content;
              this.defaultMsg = "";
            }

            this.openId = res.data.id;
          } else {
            this.$message.error("打开失败!");
            return;
          }
        })
        .catch(err => {
          this.templateLoading = false;
        });
    },
    async saveContent(content, dnFlag, editor = "01") {
      let data = {
        id: this.openId,
        content: editor !== "03" ? content : "",
        sectionTemplateContext: editor === "03" ? content : "",
        dnFlag: dnFlag
      };
      await saveContent(data).then(res => {
        if (res.code === 1) {
          this.defaultMsg = content;
          this.handleQuery();
          this.$message("保存成功");
        } else {
          this.$message.error("打开失败!");
          return;
        }
      });
    },
    propOnOneClick() {
      this.isNewBuilt = false;
      let data = {};
      getDetail(this.selection[0].sectionTemplateId, data).then(res => {
        if (res.code === 1) {
          let temp = res.data;
          let code = temp.sectionTemplateCode;
          temp.sectionTemplateCode = code.replace(
            this.$refs.createSection.prefix,
            ""
          );
          this.sTemplate = temp;
          this.sTemplateOldEditor = temp.editor;
          this.$nextTick(() => {
            this.dialogVisible = true;
          });
        } else {
          this.$message.error("获取明细失败!");
          return;
        }
      });
    },
    paramsArrHandler(arr = []) {
      let list = [];
      list = arr.map(item => {
        return {
          id: item.sectionTemplateId,
          code: item.sectionTemplateCode,
          scopeLevel: item.scopeLevel,
          ownerId: item.ownerId,
          oprRoleLevel: item.oprRoleLevel
        };
      });
      return list;
    },
    //修改或查看
    async propOnClick() {
      this.isNewBuilt = false;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }

      const params = this.paramsArrHandler([this.selection[0]]);
      const flag = await this.authorityHandler(params);

      this.disabledFlag = !flag;

      let data = {};
      getDetail(this.selection[0].sectionTemplateId, data).then(res => {
        if (res.code === 1) {
          let temp = res.data;
          let code = temp.sectionTemplateCode;
          temp.sectionTemplateCode = code.replace(
            this.$refs.createSection.prefix,
            ""
          );
          this.sTemplate = temp;
          this.sTemplateOldEditor = temp.editor;
          this.$nextTick(() => {
            this.dialogVisible = true;
          });
        } else {
          this.$message.error("获取明细失败!");
          return;
        }
      });
    },
    //检查是否可修改，全院模板管理员可以修改通用模板，科室模板管理员可以修改科模板，普通医生只能修改自己的模板
    checkAuth(data) {
      let curRoleName = this.$store.getters.role.roleName;
      let curDeptId = this.$store.getters.role.deptId;
      this.hosId = JSON.parse(getPamars()).hosId;
      this.persId = getUId();
      if (
        data.scopeLevel === "0" &&
        data.ownerId == this.hosId &&
        data.hospitalId == this.hosId &&
        curRoleName == "全院病历模板管理员"
      ) {
        return true;
      } else if (
        data.scopeLevel === "1" &&
        data.ownerId == curDeptId &&
        data.hospitalId == this.hosId &&
        curRoleName == "科室病历模板管理员"
      ) {
        return true;
      } else if (
        data.scopeLevel === "2" &&
        data.ownerId == this.persId &&
        data.hospitalId == this.hosId &&
        curRoleName == "住院医生"
      ) {
        return true;
      }
      return false;
    },
    //删除
    async handleRemove() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];

      for (let index of this.selection) {
        if (index.sectionTemplateStatus != "0") {
          this.$message.error(
            index.sectionTemplateName + "不是新建状态，不能删除！"
          );
          return;
        }
        arr.push(index.sectionTemplateId);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) {
        return;
      }
      this.handleDelete(arr);
    },
    handleDelete(arr) {
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
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除
    delete(delArr) {
      removeSectionTemplate(delArr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "删除成功!",
            type: "success"
          });

          this.handleQuery();
        } else {
          this.$message.error("删除失败!");
          return;
        }
      });
    },
    //启用
    async enable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.sectionTemplateStatus;
        if (status == "1") {
          this.$message.error(
            index.sectionTemplateName + "已启用，不能再次启用!"
          );
          return;
        } else if (status != "0" && status != "2") {
          this.$message.error(
            index.sectionTemplateName + "状态不正确不能启用!"
          );
          return;
        }
        let data = {
          sectionTemplateId: index.sectionTemplateId,
          sectionTemplateStatus: index.sectionTemplateStatus,
          dataVersion: index.dataVersion
        };
        arr.push(data);
      }
      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) {
        return;
      }

      setEnable(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "启用成功!",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("启用失败!" + res.message);
          return;
        }
      });
    },
    //停用
    async disable() {
      let temps = this.selection;
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        let status = index.sectionTemplateStatus;
        if (status == "2") {
          this.$message.error(
            index.sectionTemplateName + "已停用，不能再次停用!"
          );
          return;
        } else if (status != "1") {
          this.$message.error(
            index.sectionTemplateName + "状态不正确，不能停用!"
          );
          return;
        }
        let data = {
          sectionTemplateId: index.sectionTemplateId,
          sectionTemplateStatus: index.sectionTemplateStatus,
          dataVersion: index.dataVersion
        };
        arr.push(data);
      }

      const params = this.paramsArrHandler(this.selection);
      const flag = await this.authorityHandler(params);
      if (!flag) {
        return;
      }

      setDisable(arr).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "停用成功!",
            type: "success"
          });
          this.handleQuery();
        } else {
          this.$message.error("停用失败!" + res.message);
          return;
        }
      });
    },
    handleSave(template) {
      this.handleReset();
      let data1 = {
        ...this.pageParams
      };
      getManageList(data1).then(res => {
        if (res.code === 1) {
          this.sectionTemplateData = res.data;
          this.dataTotal = res.total;
          this.setSelectRow(template);
          this.careContent = "";
          this.defaultMsg = "";
          if (template.editor === "01") {
            this.openV();
          }
        } else {
          this.$message("获取数据失败");
          return;
        }
      });
    },
    handleUpdate(template) {
      // 如果修改了医护类型 需要重新修改编辑内容
      this.sTemplate = template;
      this.selection[0] = template;
      if (this.sTemplateOldEditor != template.editor) {
        this.openV();
      }
      this.handleReset();
      this.handleQuery();
    },
    setSelectRow(data) {
      this.sectionTemplateData.forEach((item, index) => {
        if (item.sectionTemplateCode == data.sectionTemplateCode) {
          this.$refs.sectionTempTable.clearSelection();
          this.$refs.sectionTempTable.toggleRowSelection(
            this.sectionTemplateData[index],
            true
          );
        }
      });
    },
    handleChange(data, node) {
      console.log(node);
      // 如果未关闭，
      if (this.bottom == "0") {
        this.handleClick();
      }

      if (node.level > 1) {
        this.delPT.paragraphTypeCode = data.exts.code;
        this.delPT.paragraphTypeId = data.id;

        this.form.typeCode = data.exts.code;
        this.fetchData();
      }
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleQuery() {
      if (this.level1 == false) {
        this.deptVal = [];
      }
      this.persId = getUId();

      let obj = {
        orderBy: "number",
        level0: this.level0 == true ? 0 : null,
        level1: this.level1 == true ? 1 : null,
        level2: this.level2 == true ? 2 : null,
        hospitalId: this.hosId,
        persId: this.level2 == true ? this.persId : "",
        deptIds: this.level1 == true ? this.deptVal.toString() : ""
        // visitType:this.mode ==="outPatient" ? ""
      };
      this.form = { ...this.form, ...obj };
      this.pageParams.pageNo = 1;
      this.fetchData();
    },
    handleReset() {
      this.form.key = "";
      this.form.sectionTemplateCode = "";
      this.form.sectionTemplateStatus = ""; // 片语状态字段
      this.form.diseaseId = "";
      this.form.typeCode = "";
      this.form.docTypeCode = "";
      this.form.visitType = ""; // 就诊类型
      this.level0 = false;
      this.level1 = false;
      this.level2 = false;
      this.deptVal = [];
      this.form.dnFlag = "";
    },
    //复制模板
    copy() {
      if (this.selection.length <= 0) {
        this.$message.warning("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        arr.push(index.sectionTemplateId);
      }
      copyTemplates(arr).then(res => {
        if (res.code === 1) {
          this.$message.success("操作成功");
          this.handleReset();
          this.handleQuery();
        } else {
          this.$message.error("复制失败");
          return;
        }
      });
    },
    changeDept() {
      if (this.deptVal.length > 0) {
        if (this.level1 == false) {
          this.level1 = true;
        }
      }
    },
    createGroup() {
      getParagraphTypeNextSeqNo().then(res => {
        if (res.code === 1) {
          this.createTypeGroupData = {
            paragraphTypeCode: "",
            paragraphTypeName: "",
            visitType: "",
            dnFlag: "",
            dnFlagName: "",
            number: "",
            description: "",
            paragraphTypeStatus: "",
            parentId: "",
            typeAndParagraph: []
          };

          this.codeList = [];
          // let curKey = this.$refs.tree.getCurrentKey();
          // if (curKey) {
          //   this.createTypeGroupData.parentId = curKey;
          // } else {
          this.createTypeGroupData.parentId = "qy";
          // }
          this.getNextNumber();
          this.gCode = res.data;
          this.tgDialogMode = "新建片语类型组";
          this.createTypeGroupDialog = true;
        } else {
          this.$message.error("获取类型组流水号失败！");
        }
      });
    },
    getNextNumber() {
      this.vNumArr = [];
      this.vParentId = this.createTypeGroupData.parentId;
      this.getNextNumByParentId(this.tree);
      this.createTypeGroupData.number = Math.max(...this.vNumArr) + 1;
    },
    /*
     * 获取树形某个节点下所有直接子节点的最大顺序号+1
     * @returns {number}
     */
    getNextNumByParentId(arr) {
      arr.forEach(item => {
        if (item.id == this.vParentId) {
          if (item.children) {
            item.children.forEach(item2 => {
              this.vNumArr.push(item2.exts.number);
            });
          }
        } else {
          if (item.children) {
            this.getNextNumByParentId(item.children);
          }
        }
      });
    },

    editGroup() {
      this.tgDialogMode = "编辑片语类型组";
      getParagraphTypeOpt({ paragraphTypeId: this.delPT.paragraphTypeId }).then(
        res => {
          if (res.code == 1) {
            this.createTypeGroupData = { ...res.data[0] };
            let temp = this.createTypeGroupData.paragraphTypeCode;
            this.gCode = temp.replace(this.gPrefix, "");
            if (this.createTypeGroupData.parentId == null) {
              if (this.createTypeGroupData.scopeLevel === "0") {
                this.createTypeGroupData.parentId = "qy";
              }
            }
            this.codeList = this.createTypeGroupData.typeAndParagraph;
            if (res.data.visitType) {
              this.createTypeData.visitType = res.data.visitType;
              this.vDisabled = true;
            } else {
              this.vDisabled = false;
            }
            if (res.data.dnFlag) {
              this.createTypeData.dnFlag = res.data.dnFlag;
              this.nDisabled = true;
            } else {
              this.nDisabled = false;
            }
            this.createTypeGroupDialog = true;
          } else {
            this.$message.error(res.msg || "接口失败!");
          }
        }
      );
    },
    handleDeleteG() {
      if (!this.delPT.paragraphTypeId) {
        this.$message.warning("请先选择删除项");
        return;
      }
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delGroup();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    resetDelPT() {
      this.delPT = {
        paragraphTypeCode: "",
        paragraphTypeId: ""
      };
    },
    delGroup() {
      deleteByParagraphType({ ...this.delPT }).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "删除成功!",
            type: "success"
          });
          this.resetDelPT();
          this.getManageTree();
        } else {
          this.$message.error("删除失败!");
        }
      });
    },
    async paragraphTyepSbimt() {
      if (this.createTypeGroupData.paragraphTypeName === "") {
        this.$message.error("名称不可为空!");
        return;
      }
      if (this.createTypeGroupData.parentId === "") {
        this.$message.error("上级编码不可为空!");
        return;
      }
      if (this.createTypeGroupData.dnFlag === "") {
        this.$message.error("医护标识不可为空!");
        return;
      }
      if (this.createTypeGroupData.parentId === "qy") {
        this.createTypeGroupData.parentId = null;
      }

      if (this.tgDialogMode == "新建片语类型组") {
        await create({
          ...this.createTypeGroupData,
          typeAndParagraph: this.codeList
        }).then(res => {
          if (res.code === 1) {
            this.$message({
              message: "新增成功!",
              type: "success"
            });
            this.createTypeGroupDialog = false;

            // 更新片语类型数据
            this.$refs.typeCodeRequest.request();
          } else {
            this.$message.error(res.msg || "新增失败!");
          }
        });
        this.getManageTree();
      } else {
        await create({
          ...this.createTypeGroupData,
          typeAndParagraph: this.codeList
        }).then(res => {
          if (res.code === 1) {
            this.$message({
              message: "修改成功!",
              type: "success"
            });
            this.createTypeGroupDialog = false;
          } else {
            this.$message.error(res.msg || "修改失败!");
          }
        });
        this.getManageTree();
      }
    },
    //根据所属级别变更所属名称可选项
    getMrTyppe(visitType = "", dnFlag = "") {
      const params = {
        visitType,
        dnFlag
      };
      getTypes(params).then(res => {
        if (res.code === 1) {
          this.ownNameOpt = res.data.map(item => {
            item.id += "";
            return item;
          });
        } else {
          this.$message("请求数据失败");
          return;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.hd-container {
  overflow: hidden;

  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }

  .el-tabs {
    height: 100%;
  }

  .left {
    height: 100%;
    width: 246px;
    float: left;
    background-color: #ffffff;
  }

  .right {
    height: 100%;
    margin-left: 254px;
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
      width: 250px;
    }

    .special-item {
      width: 460px;
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

  .axEditor-demo {
    width: 100%;
    height: calc(100% - 44px);

    .editor-left {
      height: 100%;
      /*margin-right: 320px;*/
    }

    .tool-right {
      float: right;
      /*width: 300px;*/
      height: 100%;
    }
  }

  .margin-top-10 {
    margin-top: 10px;
  }
}
</style>
