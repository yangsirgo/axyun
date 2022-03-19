<template>
  <div class="DEM-container height100">
    <flow-menu>
      <el-card class="left">
        <div style="width: 100%; margin: 10px" class="icon-btn">
          <el-row style="margin-top: 8px">
            <el-input
              placeholder="请输入内容"
              suffix-icon="el-icon-search"
              v-model="searchTxt"
              style="width: 226px"
            >
            </el-input>
          </el-row>
        </div>
        <div style="margin: 10px; overflow: auto">
          <el-tree
            :data="tree"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :default-expand-all="true"
          ></el-tree>
        </div>
      </el-card>
      <el-card class="right height100">
        <div style="padding: 10px 20px">
          <div class="search-con clearfix">
            <div class="search-main float-left">
              <div class="common-width margin-top-10">
                <l-formt-title label="数据元编码">
                  <el-input
                    style="width: 180px"
                    v-model="dataEleQueryParam.dataEleCode"
                  ></el-input>
                </l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="名称">
                  <el-input
                    style="width: 180px"
                    v-model="dataEleQueryParam.name"
                  ></el-input>
                </l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="数据类型">
                  <l-value-domain-emr
                    clearable
                    filterable
                    style="width: 180px"
                    code="DataElementValueType"
                    :value.sync="dataEleQueryParam.valType"
                    placeholder="请选择"
                  ></l-value-domain-emr>
                </l-formt-title>
              </div>
              <div class="common-width margin-top-10">
                <l-formt-title label="状态">
                  <el-radio
                    v-model="dataEleQueryParam.status"
                    label="1"
                    style="margin-left: 8px; margin-top: 7px"
                    >已启用
                  </el-radio>
                  <el-radio v-model="dataEleQueryParam.status" label="2"
                    >已停用
                  </el-radio></l-formt-title
                >
              </div>
            </div>
            <div class="float-right margin-top-10">
              <el-button class="el-button--primary" @click="btnClickQuery"
                >查询
              </el-button>
              <el-button class="el-button--default" @click="clearCondition"
                >重置
              </el-button>
            </div>
          </div>
        </div>
        <div
          style="
            margin-top: 10px;
            padding: 10px 20px;
            border-top: 1px solid #dcdfe6;
            height: calc(100% - 70px);
          "
        >
          <div class="icon-txt-Btn clearfix">
            <div class="float-right">
              <el-button @click="createData" icon="el-icon-plus"
                >新建</el-button
              >
              <el-button icon="el-icon-edit-outline" @click="modify"
                >修改
              </el-button>
              <el-button icon="el-icon-remove-outline" @click="delete2"
                >删除
              </el-button>
              <el-button icon="el-icon-check" @click="start">启用</el-button>
              <el-button icon="el-icon-close" @click="stop">停用</el-button>
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
                :data="dataEleTable"
                ref="dataEleTable"
                v-loading="tlm_isLoading"
                border
                height="100%"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
              >
                <el-table-column
                  type="selection"
                  width="45px"
                ></el-table-column>
                <el-table-column
                  type="index"
                  :index="indexMethod"
                  label="序号"
                  width="50px"
                ></el-table-column>
                <el-table-column
                  prop="dataElementCode"
                  label="数据元编码"
                  width="160px"
                ></el-table-column>
                <el-table-column
                  prop="dataElementName"
                  label="名称"
                  width="180px"
                ></el-table-column>
                <el-table-column
                  prop="dataElementValueType"
                  label="卫生部数据类型"
                  width="140px"
                >
                </el-table-column>
                <el-table-column
                  prop="dataElementValueFormat"
                  label="卫生部数据长度"
                  width="140x"
                ></el-table-column>
                <el-table-column prop="valueId" label="值域编码" width="180px">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        scope.row.valueCode != null && scope.row.valueCode != ''
                      "
                      tableName="mr_data_element_value_catalog"
                      :conditionMap="{ value_code: scope.row.valueCode }"
                      columns="value_code"
                      v-tableTransform
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="dataElementDefinition"
                  label="说明"
                  width="130px"
                ></el-table-column>
                <el-table-column
                  prop="standardName"
                  label="数据元标准名称"
                  width="180px"
                ></el-table-column>
                <el-table-column
                  prop="standardYear"
                  label="标准年份"
                  width="180px"
                ></el-table-column>
                <el-table-column label="状态" width="180px">
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.dataElementStatus"
                      code="ModelStatus"
                      v-codeTransform
                    ></span>
                  </template>
                </el-table-column>
              </el-table>
            </l-table>
          </div>
        </div>

        <el-form
          :model="dataEleInfo"
          :rules="rules"
          ref="dataEleInfo"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-dialog
            title="数据元维护"
            :visible.sync="dataEleDialog"
            :close-on-click-modal="false"
            width="880px"
          >
            <div style="padding: 16px 26px">
              <span style="font-weight: bold">数据元属性</span>
              <el-row style="margin-top: 16px">
                <el-col :span="12">
                  <el-form-item label="数据元编码" prop="dataElementCode">
                    <el-input
                      disabled
                      v-model="dataEleInfo.dataElementCode"
                      style="width: 298px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item label="拼音码" prop="phoneticCode">
                    <el-input
                      :disabled="isNew"
                      v-model="dataEleInfo.phoneticCode"
                      style="width: 298px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top: 16px">
                <el-col :span="12">
                  <el-form-item label="数据元名称" prop="dataElementName">
                    <el-input
                      :disabled="isNew"
                      v-model="dataEleInfo.dataElementName"
                      style="width: 298px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item label="五笔码" prop="fiveStrokeCode">
                    <el-input
                      :disabled="isNew"
                      v-model="dataEleInfo.fiveStrokeCode"
                      style="width: 298px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top: 16px">
                <el-col :span="12">
                  <el-form-item label="数据类型" prop="dataElementValueType">
                    <l-value-domain-emr
                      clearable
                      :disabled="isNew"
                      filterable
                      style="width: 298px"
                      code="DataElementValueType"
                      :value.sync="dataEleInfo.dataElementValueType"
                      placeholder="请选择"
                    ></l-value-domain-emr>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item label="自定义码" prop="customizeCode">
                    <el-input
                      :disabled="isNew"
                      v-model="dataEleInfo.customizeCode"
                      style="width: 298px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top: 16px">
                <el-col :span="12">
                  <el-form-item label="格式" prop="dataElementValueFormat">
                    <el-input
                      :disabled="isNew"
                      v-model="dataEleInfo.dataElementValueFormat"
                      style="width: 298px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item label="值域" prop="valueId">
                    <el-select
                      :disabled="isNew"
                      v-model="dataEleInfo.valueId"
                      placeholder="请选择"
                      clearable
                      style="width: 298px"
                      @change="handleChange"
                    >
                      <el-option
                        v-for="item in valueCatalogOpt"
                        :key="item.id"
                        :label="item.valueName"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top: 16px">
                <el-col :span="12">
                  <el-form-item label="数据元标准" prop="standardId">
                    <el-select
                      :disabled="isNew"
                      v-model="dataEleInfo.standardId"
                      placeholder="请选择"
                      clearable
                      filterable
                      style="width: 298px"
                    >
                      <el-option
                        v-for="item in standardOpt"
                        :key="item.id"
                        :label="item.standardName"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-form-item label="数据元状态" prop="dataElementStatus">
                    <l-value-domain-emr
                      :disabled="true"
                      style="width: 298px"
                      code="modelStatus"
                      :value.sync="dataEleInfo.dataElementStatus"
                      placeholder="请选择"
                    ></l-value-domain-emr>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top: 16px">
                <el-col :span="24">
                  <el-form-item label="定义" prop="dataElementDefinition">
                    <el-input
                      :disabled="isNew"
                      type="textarea"
                      v-model="dataEleInfo.dataElementDefinition"
                      style="width: 740px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-if="valueCatalogView">
                <div style="margin-top: 20px">
                  <span style="font-weight: bold">值域列表</span>
                </div>
                <div class="small-table">
                  <div style="margin: 9px 12px" class="icon-txt-Btn">
                    <el-row>
                      <el-col :span="6">
                        <span>编码</span>
                        <el-input
                          v-model="newValueCode"
                          :disabled="vDisabled || isNew"
                          style="width: 120px"
                        ></el-input>
                      </el-col>
                      <el-col :span="9">
                        <span>名称</span>
                        <el-input
                          v-model="newValueName"
                          :disabled="vDisabled || isNew"
                          style="width: 180px"
                        ></el-input>
                      </el-col>
                      <el-col :span="3">
                        <el-button
                          @click="createValues"
                          icon="el-icon-plus"
                          :disabled="isNew"
                          >新建
                        </el-button>
                      </el-col>
                      <el-col :span="3">
                        <el-button
                          :disabled="isNew"
                          icon="el-icon-remove-outline"
                          @click="delete3"
                          >删除
                        </el-button>
                      </el-col>
                      <el-col :span="3">
                        <el-button icon="el-icon-refresh" @click="refresh1"
                          >刷新
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <el-table
                    :data="valSingleStageTable"
                    ref="valSingleStageTable"
                    border
                    height="144"
                    @row-click="handleRowClick1"
                    :row-class-name="tableRowClassName"
                    style="width: 100%; margin-top: 10px"
                  >
                    <el-table-column prop="vMean" label="名称" width="298px">
                      <template slot-scope="scope">
                        <el-input
                          size="mini"
                          :disabled="isNew"
                          v-model="valSingleStageTable[scope.$index].vMean"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="vCode" label="编码" width="220px">
                      <template slot-scope="scope">
                        <el-input
                          :disabled="isNew"
                          size="mini"
                          v-model="valSingleStageTable[scope.$index].vCode"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sortNo" label="排序" width="220px">
                      <template slot-scope="scope">
                        <el-input
                          size="mini"
                          :disabled="isNew"
                          v-model="valSingleStageTable[scope.$index].sortNo"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <!--<el-table-column  prop="use" label="启用">-->
                    <!--<template slot-scope="scope">-->
                    <!--<el-checkbox v-model="valSingleStageTable[scope.$index].use" true-label="1" false-label="0"></el-checkbox>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                  </el-table>
                </div>
              </div>
            </div>

            <div slot="footer">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handlerDetermine('dataEleInfo')"
                  :disabled="isNew"
                  >确定
                </el-button>
                <el-button @click="dataEleDialog = false" :disabled="isNew"
                  >取消</el-button
                >
              </el-form-item>
            </div>
          </el-dialog>
        </el-form>
      </el-card>
    </flow-menu>
  </div>
</template>

<script>
import {
  getPageByCondition,
  batchRemove,
  startupShutdown,
  getDataElementStandard,
  getDetail,
  getDataElementValueCatelog,
  saveDateElement,
  getValueSingleStages,
  modifyDateElement,
  valueChange,
  getCustomizeValue,
  getSeq
} from "@/api/emrRecord/emr/dataElement";

import FlowMenu from "@/components/FlowMenu";

export default {
  name: "dataEleMt",
  components: {
    FlowMenu
  },
  data() {
    return {
      tlm_isLoading: false,
      searchTxt: "",
      tree: [
        {
          id: 0,
          label: "全部",
          children: [
            {
              id: 1,
              label: "标识",
              parentId: 0
            },
            {
              id: 2,
              label: "人口及社会经济学特征",
              parentId: 0
            },
            {
              id: 3,
              label: "健康史",
              parentId: 0
            },
            {
              id: 4,
              label: "健康危险因素",
              parentId: 0
            },
            {
              id: 5,
              label: "主诉与症状",
              parentId: 0
            },
            {
              id: 6,
              label: "体格检查",
              parentId: 0
            },
            {
              id: 7,
              label: "临床辅助检查",
              parentId: 0
            },
            {
              id: 8,
              label: "实验室检查",
              parentId: 0
            },
            {
              id: 9,
              label: "医学诊断",
              parentId: 0
            },
            {
              id: 10,
              label: "医学评估",
              parentId: 0
            },
            {
              id: 11,
              label: "计划与干预",
              parentId: 0
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      dataEleQueryParam: {
        dataEleCode: "",
        name: "",
        valType: "",
        globalCode: ""
      },
      dataEleTable: [],
      selection: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },

      layout: "total,prev,pager,next,jumper",
      dataEleDialog: false,
      nValueCatalog: "",
      dataEleInfo: {
        dataElementCode: "",
        phoneticCode: "",
        dataElementName: "",
        fiveStrokeCode: "",
        customizeCode: "",
        dataElementValueType: "",
        dataElementValueFormat: "",
        dataElementDefinition: "",
        dataElementStatus: "",
        standardId: "",
        standardCode: "",
        standardName: "",
        standardType: "",
        standardTypeName: "",
        standardYear: "",
        valueId: "",
        valueCode: "",
        valueName: "",
        customSource: "",
        id: ""
      },
      dataEleClassOpts: [],
      mnemonicCodeOpts: [],
      dataEleTable1: [],
      curRow: {},
      isNew: false,
      valTypeOpt: [
        { value: "S", label: "字符型" },
        { value: "L", label: "布尔型" },
        { value: "N", label: "数值型" },
        { value: "D", label: "日期型" },
        { value: "DT", label: "日期时间型" },
        { value: "T", label: "时间型" }
      ],
      nCustomeSource: "",
      sourceOpt: [
        { value: 1, label: "主数据" },
        { value: 2, label: "emr" },
        { value: 3, label: "其他" }
      ],
      standardOpt: [],
      nDataEleStandard: "",
      valueCatalogOpt: [],
      valueCatalog: {},
      nStandardId: "",
      standard: {},
      valueCatalogView: false,
      valSingleStageTable: [],
      oldDataEleInfo: {},
      oldValSingleStageTable: {},
      oldValueCatalog: {},
      newValueCode: "",
      newValueName: "",
      vDisabled: true,
      hasChecked: false,
      rules: {
        dataElementCode: [
          { required: true, message: "请输入数据元编码", trigger: ["blur"] }
        ],
        dataElementName: [
          { required: true, message: "请输入数据元名称", trigger: ["blur"] }
        ],
        standardId: [
          {
            required: true,
            message: "数据元标准不能为空",
            trigger: ["blur"]
          }
        ],
        dataElementValueType: [
          {
            required: true,
            message: "数据类型不能为空",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  mounted() {
    this.query();
    this.getDataElementStandard();
    this.getDataElementValueCatelogs();
  },
  methods: {
    handleChange() {
      //如果是修改，之前没有值域，不能修改成有值域的；如果之前有值域，不能修改成没有值域；如果之前有值域，不能跨多类值域修改
      if (this.dataEleInfo.id != "") {
        console.log(
          "this.oldDataEleInfo.valueId===",
          this.oldDataEleInfo.valueId
        );
        console.log("this.dataEleInfo.valueId===", this.dataEleInfo.valueId);
        console.log(
          "this.valueCatalog.storageType===",
          this.valueCatalog.storageType
        );
        console.log(
          "this.oldValueCatalog.storageType===",
          this.oldValueCatalog.storageType
        );
        console.log("this.valueCatalogOpt===", this.valueCatalogOpt);

        if (
          (this.oldDataEleInfo.valueId == null ||
            this.oldDataEleInfo.valueId == "") &&
          this.dataEleInfo.valueId != null &&
          this.dataEleInfo.valueId != ""
        ) {
          this.$message.error("原数据元没有值域，不能修改成有值域!");
          this.dataEleInfo.valueId = this.oldDataEleInfo.valueId;
          return;
        } else if (
          this.oldDataEleInfo.valueId != null &&
          this.oldDataEleInfo.valueId != "" &&
          (this.dataEleInfo.valueId == null || this.dataEleInfo.valueId == "")
        ) {
          this.$message.error("原数据元有值域，不能修改成没有值域!");
          this.dataEleInfo.valueId = this.oldDataEleInfo.valueId;
          return;
        } else if (
          this.oldDataEleInfo.valueId != null &&
          this.oldDataEleInfo.valueId != "" &&
          this.dataEleInfo.valueId != null &&
          this.dataEleInfo.valueId != "" &&
          this.oldValueCatalog.storageType &&
          this.oldValueCatalog.storageType != this.valueCatalog.storageType
        ) {
          this.$message.error("不能修改成不同存储类型的值域!");
          this.dataEleInfo.valueId = this.oldDataEleInfo.valueId;
          return;
        }
      }

      this.valueCatalogOpt.find(item => {
        if (item.id == this.dataEleInfo.valueId) {
          this.valueCatalog = item;
        }
      });
      let storageType = this.valueCatalog.storageType || "";
      let valueCode = this.valueCatalog.valueCode || "";
      //单级
      if (storageType == "1") {
        this.valueCatalogView = true;
        this.getValueSingleStages(valueCode);
      }
      //如果清空值域，隐藏列表
      if (this.dataEleInfo.valueId == null || this.dataEleInfo.valueId == "") {
        this.valueCatalogView = false;
        this.valSingleStageTable = [];
      } else {
        //显示值域的code和name
        this.newValueCode = this.valueCatalog.valueCode;
        this.newValueName = this.valueCatalog.valueName;
      }
    },
    //获取某个值域的单级列表
    getValueSingleStages(valueCode) {
      let data1 = { valueCode: valueCode, deletedStatus: "0" };
      getValueSingleStages(data1).then(res => {
        if (res.code === 1) {
          this.valSingleStageTable = res.data;
          console.log(this.valSingleStageTable, "this.valSingleStageTable");
        } else {
          this.$message.error("获取单级值域失败!");
        }
      });
    },
    // handChangeStandard(){
    //   this.standardOpt.find(item=>{
    //     if (item.id == this.nStandardId){
    //       this.standard = item;
    //     }
    //   })
    // },
    handleNodeClick(node) {},
    handleSelectionChange(val) {
      this.selection = val;
    },
    getDataElementStandard() {
      getDataElementStandard({}).then(res => {
        if (res.code === 1) {
          this.standardOpt = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    //获取数据元值域列表
    getDataElementValueCatelogs() {
      let data = {
        storageType: 1
      };
      getDataElementValueCatelog(data).then(res => {
        if (res.code === 1) {
          this.valueCatalogOpt = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    btnClickQuery() {
      this.pageParams.pageNo = 1;
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
    query() {
      console.log("query=========", this.dataEleQueryParam);
      let data = {
        dataElementCode: this.dataEleQueryParam.dataEleCode,
        dataElementName: this.dataEleQueryParam.name,
        dataElementValueType: this.dataEleQueryParam.valType,
        dataElementStatus: this.dataEleQueryParam.status,
        ...this.pageParams
      };
      getPageByCondition(data).then(res => {
        if (res.code === 1 && res.data) {
          this.pageParams.total = res.data.total;

          this.dataEleTable = res.data.dataElementPageDto;

          this.tlm_isLoading = false;
        } else {
          this.tlm_isLoading = false;
          this.$message("获取数据失败");
        }
      });
    },
    clearCondition() {
      this.dataEleQueryParam.dataEleCode = "";
      this.dataEleQueryParam.name = "";
      this.dataEleQueryParam.valType = "";
      this.dataEleQueryParam.status = "";
    },
    resetDataEleInfo() {
      this.$refs.dataEleInfo.clearValidate();
      for (let key in this.dataEleInfo) {
        // this.dataEleInfo[key] = "";
        this.$set(this.dataEleInfo, key, "");
      }
      this.valSingleStageTable = [];
      this.valueCatalog = {};
      this.valueCatalogView = false;
      this.newValueCode = "";
      this.newValueName = "";
    },
    getSeq() {
      getSeq()
        .then(res => {
          if (res.code === 1) {
            this.dataEleInfo.dataElementCode = res.data;
          } else {
            this.dataEleInfo.dataElementCode = "";
            this.$message.error("获取接口失败!");
            this.dataEleDialog = true;
            return;
          }
        })
        .catch(error => {
          this.dataEleInfo.dataElementCode = "";
          this.$message.error("获取接口失败!");
          this.dataEleDialog = true;
        });
    },
    //
    createData() {
      this.resetDataEleInfo();
      this.getSeq();
      this.dataEleDialog = true;
      this.vDisabled = true;
      this.isNew = false;
      this.hasChecked = false;
      console.log("this.dataEleInfo", this.dataEleInfo);
    },
    clearNew() {
      this.dataEleInfo.dataElementCode = "";
      this.dataEleInfo.phoneticCode = "";
      this.dataEleInfo.dataElementName = "";
      this.dataEleInfo.fiveStrokeCode = "";
      this.dataEleInfo.customizeCode = "";
      this.dataEleInfo.dataElementValueType = "";
      this.dataEleInfo.dataElementValueFormat = "";
      this.dataEleInfo.dataElementStauts = "0";
      this.dataEleInfo.dataElementDefinition = "";
      this.dataEleInfo.standardId = "";
      this.dataEleInfo.valueId = "";
      this.dataEleInfo.id = "";
      this.valueCatalog = {};
      this.valSingleStageTable = [];
      this.valueCatalogView = false;
    },
    modify() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      if (this.selection.length > 1) {
        this.$message("只能选择一条数据");
        return;
      }
      this.resetDataEleInfo();
      let data = { id: this.selection[0].id };
      getDetail(data).then(res => {
        if (res.code === 1) {
          // 启用状态不可编辑
          if (res.data.dataElementPO.dataElementStatus == "1") {
            this.isNew = false;
          }
          this.dataEleInfo = res.data.dataElementPO;
          this.oldDataEleInfo = { ...this.dataEleInfo };

          this.valueCatalog = res.data.dataElementValueCatalogPO || [];
          this.oldValueCatalog = { ...this.valueCatalog };

          this.valSingleStageTable = res.data.valueSingleStagePOLst || [];
          this.oldValSingleStageTable = { ...this.valSingleStageTable };
          this.handleChange();
          this.dataEleDialog = true;
        } else {
          this.isNew = false;
          this.$message.error("获取明细失败!");
        }
      });
    },
    // this.$refs.ruleForm.clearValidate()''

    delete2() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      try {
        this.selection.forEach(item => {
          if (item.customSource === "1") {
            throw Error(item.dataElementName + "是主数据，不能修改或删除！");
          }

          let data = {
            id: item.id,
            customSource: item.customSource,
            dataVersion: item.dataVersion
          };
          arr.push(data);
        });
      } catch (err) {
        this.$message.error(err);
        return;
      }
      this.delete(arr);
    },
    //删除
    delete(delArr) {
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batchRemove(delArr).then(res => {
            if (res.code === 1) {
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.query();
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
    start() {
      this.startupShutdown(1);
    },
    stop() {
      this.startupShutdown(2);
    },
    startupShutdown(flag) {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      try {
        this.selection.forEach(item => {
          if (item.dataElementStatus === "1" && flag === 1) {
            throw Error(item.dataElementName + "已启用，不能再次启用！");
          } else if (
            item.dataElementStatus != "0" &&
            item.dataElementStatus != "2" &&
            flag === 1
          ) {
            throw Error(item.dataElementName + "状态错误！");
          } else if (item.dataElementStatus === "2" && flag === 0) {
            throw Error(item.dataElementName + "已停用，不能再次停用！");
          } else if (item.dataElementStatus != "1" && flag === 0) {
            throw Error(item.dataElementName + "状态错误！");
          }
          let data = {
            id: item.id,
            dataVersion: item.dataVersion
          };
          arr.push(data);
        });
      } catch (err) {
        this.$message.error(err.message);
        return;
      }
      startupShutdown(arr, flag).then(res => {
        if (res.code === 1) {
          if (flag === 1) {
            this.$message.success("启用成功！");
          } else {
            this.$message.success("停用成功！");
          }

          this.query();
        } else {
          this.$message.error("操作失败!");
        }
      });
    },
    handleRowClick(row, column, event) {
      this.$refs.dataEleTable.toggleRowSelection(row);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.query();
    },
    async handlerDetermine(formName) {
      let result = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          result = true;
        }
      });

      if (result) {
        let saveFlag = false;
        if (
          this.valSingleStageTable.length > 0 &&
          this.dataEleInfo.valueId != null &&
          this.dataEleInfo.valueId != undefined &&
          this.dataEleInfo.valueId != ""
        ) {
          //未进行数据元值域修改检查
          if (this.hasChecked === false) {
            //检查数据元值域是否修改
            let checkData = {
              id: this.dataEleInfo.valueId,
              valueSingleStagePOLst: this.valSingleStageTable
            };
            let result = false;
            await valueChange(checkData).then(res => {
              if (res.code === 1) {
                result = res.data;
                console.log("valueChange", result);
              } else {
                this.$message.error("检查数据元值域是否修改失败!" + res.msg);
              }
            });
            //有修改
            if (result) {
              //获取自定义值域code和name
              await getCustomizeValue({
                name: this.valueCatalog.valueName
              }).then(res => {
                if (res.code === 1) {
                  console.log("getCustomizeValue", res.data);
                  this.newValueCode = res.data.valueCode;
                  this.newValueName = res.data.valueName;
                  this.vDisabled = false;
                  this.hasChecked = true;
                  this.$message.info(
                    "请确认自定义值域的编码和名称，确认无误请提交!"
                  );
                  return;
                } else {
                  this.$message.error(
                    "获取自定义值域code和name失败!" + res.msg
                  );
                  return;
                }
              });
            } else {
              saveFlag = true;
            }
          } else {
            saveFlag = true;
          }
        } else {
          saveFlag = true;
          this.vDisabled = true;
        }

        //标准值域无修改或者已修改确认为自定义值域
        if (saveFlag) {
          //如果自定义值域code和name存在
          if (this.vDisabled === false) {
            this.dataEleInfo.valueCode = this.newValueCode;
            this.dataEleInfo.valueName = this.newValueName;
          }
          this.dataEleInfo.customSource = 2;
          let data = {
            dataElementPO: this.dataEleInfo,
            dataElementValueCatalogPO: this.valueCatalog,
            valueSingleStagePOLst: this.valSingleStageTable
          };
          if (this.dataEleInfo.id == null || this.dataEleInfo.id == "") {
            saveDateElement(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message.success("保存成功！");
                  this.getDataElementValueCatelogs();
                  this.vDisabled = true;
                  this.hasChecked = false;
                  this.dataEleDialog = false;
                  this.query();
                } else {
                  this.$message.error("保存失败!" + res.msg);
                }
              })
              .catch(res => {
                this.$message.error("保存失败!" + res.msg);
              });
          } else {
            modifyDateElement(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message.success("操作成功！");
                  this.getDataElementValueCatelogs();
                  this.vDisabled = true;
                  this.hasChecked = false;
                  this.dataEleDialog = false;
                  this.query();
                } else {
                  this.$message.error("修改失败!" + res.msg);
                }
              })
              .catch(res => {
                this.$message.error("修改失败!" + res.msg);
              });
          }
        }
      } else {
        return;
      }
    },
    createValues() {
      var row = {
        vMean: "",
        vCode: "",
        sortNo: "0"
      };
      this.valSingleStageTable.push(row);
    },
    delete3() {
      if (this.curRow.index === undefined) {
        return;
      }
      console.log(
        "删了：" + this.valSingleStageTable.splice(this.curRow.index, 1)
      );
    },
    refresh1() {},
    handleRowClick1(row, event, column) {
      this.curRow = row;
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
      if (this.curRow.index == rowIndex) {
        return "selected-row";
      }
      return "";
    }
  }
};
</script>

<style lang="scss">
.DEM-container {
  overflow: hidden;

  .left {
    width: 246px;
    height: 100%;
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
      width: 260px;
    }
  }

  .icon-btn {
    .el-button {
      height: 32px;
      width: 32px;
      padding-left: 8px;
    }
  }

  .el-input--medium .el-input__inner {
    height: 30px !important;
  }

  .el-input--medium .el-input__icon {
    line-height: 30px;
  }

  .query-btn {
    .el-button--primary,
    .el-button--default {
      height: 30px;
      width: 68px;
    }
  }

  .icon-txt-Btn {
    .el-button--primary,
    .el-button--default {
      height: 33px;
      width: 75px;
      padding-left: 11px;
    }
  }

  textarea {
    height: 60px;
  }

  .el-textarea {
    vertical-align: top;
  }

  .small-table {
    margin-left: 5em;
    border: 1px solid #dcdfe6;
    margin-top: 16px;

    .el-table .cell {
      text-align: center;
    }

    .el-table .selected-row {
      background: #f9cea4;
    }
  }

  .margin-top-10 {
    margin-top: 10px;
  }
}
</style>
