<template>
  <div class="finance height100">
    <div
      class="finance-right el-card height100 float-right"
      v-loading="formLoad"
    >
      <l-card-title class="card-title">
        <span slot="left">收费项目</span>
      </l-card-title>
      <div class="form">
        <el-form :model="form" :rules="rules" ref="form" label-width="0">
          <el-form-item prop="finClassCode">
            <l-formt-title label="财务分类码" required>
              <!-- <el-input v-model="form.finClassCode" placeholder="请输入"></el-input> -->
              <l-value-domain
                :value.sync="form.finClassCode"
                remoteUrl="/finance-pub/classCode/getClassCodePO?pageSize=1000"
                remoteShowKey="classCodeName"
                remoteValueKey="finClassCode"
                clearable
                placeholder="请选择"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="provincialLevelCode">
            <l-formt-title label="省级编码">
              <el-input
                v-model="form.provincialLevelCode"
                placeholder="请输入"
              ></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="medicalRecordClassCode">
            <l-formt-title label="病案分类码" required>
              <!-- <el-input v-model="form.medicalRecordClassCode" placeholder="请输入"></el-input> -->
              <l-value-domain
                :value.sync="form.medicalRecordClassCode"
                remoteUrl="/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0007"
                remoteShowKey="dictionaryName"
                remoteValueKey="dictionaryCode"
                clearable
                placeholder="请选择"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>

          <el-form-item label label-width prop="adviceMajorClass">
            <l-formt-title label="医嘱大类" labelWidth="76" required>
              <l-value-domain
                clearable
                remoteUrl="/doctorsAdvice/getListOn"
                type="select"
                :remoteParams="remoteParams"
                :value.sync="form.adviceMajorClass"
                remoteShowKey="doctorsAdviceName"
                remoteValueKey="doctorsAdviceCode"
                @change="doctorsAdviceChange"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item label label-width prop="adviceSubClass">
            <l-formt-title
              label="医嘱子类"
              :disabled="!form.adviceMajorClass"
              labelWidth="76"
              required
            >
              <l-value-domain
                :disabled="!form.adviceMajorClass"
                clearable
                remoteUrl="/doctorsAdvice/list"
                type="select"
                :remoteParams="remoteSonParams"
                :value.sync="form.adviceSubClass"
                remoteShowKey="doctorsAdviceName"
                remoteValueKey="doctorsAdviceCode"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="chargeItemName">
            <l-formt-title label="收费项目名称" required :disabled="!isNewAdd && !form.update">
              <el-input
                v-model="form.chargeItemName"
                placeholder="请输入"
                :disabled="!isNewAdd && !form.update"
              ></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="chargeItemCode">
            <l-formt-title label="收费项目编码" required :disabled="!isNewAdd && !form.update">
              <el-input
                v-model="form.chargeItemCode"
                placeholder="请输入内容"
                style="width: 100%"
                :disabled="!isNewAdd && !form.update"
              ></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="namePy" v-if="!isNewAdd">
            <l-formt-title label="拼音" required>
              <el-input v-model="form.namePy" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="nameWb" v-if="!isNewAdd">
            <l-formt-title label="五笔" required>
              <el-input v-model="form.nameWb" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="chargeUnitId">
            <l-formt-title label="收费单位" required>
              <l-value-domain
                clearable
                code="DrugUnit"
                type="select"
                :remoteParams="remoteUnitParams"
                :value.sync="form.chargeUnitId"
                remoteShowKey="name"
                remoteValueKey="code"
                @change="chargeUnitIdChange"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="chargePrice">
            <l-formt-title label="单价" required>
              <el-input
                v-model="form.chargePrice"
                @change="priceChange"
                placeholder="请输入"
                @
              ></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="hosPurchasePrice">
            <l-formt-title label="进价">
              <el-input
                v-model="form.hosPurchasePrice"
                placeholder="请输入"
              ></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="miControlLevel">
            <l-formt-title label="医保控制级别" required>
              <l-value-domain
                :value.sync="form.miControlLevel"
                remoteUrl="/finance-pub/dictionary/getDictionaryPOsByPage?cataCode=F0003&pageSize=1000"
                remoteShowKey="dictionaryName"
                remoteValueKey="dictionaryValue"
                placeholder="请选择"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="outpEnable">
            <l-formt-title label="门诊可用" required>
              <el-select v-model="form.outpEnable" placeholder="请选择">
                <el-option
                  v-for="item in enableOpions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="inpEnable">
            <l-formt-title label="家床可用" required>
              <el-select v-model="form.inpEnable" placeholder="请选择">
                <el-option
                  v-for="item in enableOpions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="recordStatus">
            <l-formt-title label="状态标识" required>
              <el-select v-model="form.recordStatus" placeholder="请选择">
                <el-option
                  v-for="item in recordStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="spec">
            <l-formt-title label="规格">
              <el-input
                v-model="form.spec"
                placeholder="请输入内容"
                style="width: 100%"
              ></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="drugBasedCode">
            <l-formt-title label="本位码">
              <el-input
                v-model="form.drugBasedCode"
                placeholder="请输入内容"
              ></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="orginCode">
            <l-formt-title label="产地">
              <el-select
                v-model="form.orginCode"
                v-selectLoadMore="loadMore">
                <el-option
                  v-for="item in test"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option></el-select>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="dosageTypeId">
            <l-formt-title label="剂型">
              <l-value-domain
                code="ClassificationCodeOfChinese"
                :value.sync="form.dosageTypeId"
                remoteValueKey="code"
                placeholder="请选择剂型选择"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="specialMedicalMaterialFlag">
            特殊医用材料标志
            <el-radio-group v-model="form.specialMedicalMaterialFlag">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="show">
            隐藏
            <el-radio-group v-model="form.show" class="displayInline">
              <el-radio label="0">门诊可用</el-radio>
              <el-radio label="1">住院可用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-btn align-right">
        <el-button @click="newAdd">新增</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="finance-left el-card height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="10">
            <el-col :span="6">
              <l-formt-title label="财务分类码">
                <!-- <el-input v-model="searchParams.finClassCode" clearable placeholder="请输入"></el-input> -->
                <l-value-domain
                  :value.sync="searchParams.finClassCode"
                  remoteUrl="/finance-pub/classCode/getClassCodePO?pageSize=1000"
                  remoteShowKey="classCodeName"
                  remoteValueKey="finClassCode"
                  clearable
                  placeholder="请选择"
                ></l-value-domain>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="收费项目名称">
                <el-input
                  v-model="searchParams.chargeItemName"
                  clearable
                  placeholder="名称/拼音/五笔"
                ></el-input>
              </l-formt-title>
            </el-col>
            <!-- <el-col :span="6">
              <l-formt-title label="拼音">
                <el-input v-model="searchParams.namePy" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="五笔">
                <el-input v-model="searchParams.nameWb" clearable placeholder="请输入"></el-input>
              </l-formt-title>
            </el-col> -->
            <el-col :span="6">
              <l-formt-title label="门诊可用">
                <el-select
                  v-model="searchParams.outpEnable"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in enableOpions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="住院可用">
                <el-select
                  v-model="searchParams.inpEnable"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in enableOpions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <l-formt-title label="医保控制级别">
                <l-value-domain
                  :value.sync="searchParams.miControlLevel"
                  remoteUrl="/finance-pub/dictionary/getDictionaryPOsByPage?cataCode=F0003&pageSize=1000"
                  remoteShowKey="dictionaryName"
                  remoteValueKey="dictionaryValue"
                  clearable
                  placeholder="请选择"
                ></l-value-domain>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title label="状态标识">
                <el-select
                  v-model="searchParams.recordStatus"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in recordStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          ref="singleTable"
          highlight-current-row
          @row-click="rowClick"
          :data="tableData"
          border
          width="100%"
          height="100%"
          v-loading="loading"
        >
          <!-- 需要列 -->
          <el-table-column
            key="no"
            type="index"
            label="序号"
            width="80"
            fixed="left"
            header-align="center"
            align="center"
          ></el-table-column>
          <!-- 业务列 -->
          <el-table-column
            v-for="item in tableParams"
            :key="item.prop"
            sortable
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <span v-if="item.prop === 'outpEnable'">{{
                enableShow[scope.row[item.prop]]
              }}</span>
              <span v-else-if="item.prop === 'inpEnable'">{{
                enableShow[scope.row[item.prop]]
              }}</span>
              <template v-else-if="item.prop === 'miControlLevel'">
                <span
                  tableName="fin_dictionary"
                  :conditionMap="{
                    dictionary_value: scope.row[item.prop] || '',
                    cata_code: 'F0003',
                  }"
                  columns="dictionary_name"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'medicalRecordClassCode'">
                <span
                  tableName="fin_dictionary"
                  :conditionMap="{
                    dictionary_code: scope.row[item.prop] || '',
                    cata_code: 'F0007',
                  }"
                  columns="dictionary_name"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'finClassCode'">
                <span
                  tableName="fin_class_code"
                  :conditionMap="{
                    fin_class_code: scope.row[item.prop] || '',
                  }"
                  columns="class_code_name"
                  v-tableTransform
                ></span>
              </template>
              <span v-else-if="item.prop === 'recordStatus'">{{
                recordStatusShow[scope.row[item.prop]]
              }}</span>
              <template v-else-if="item.prop === 'specialMedicalMaterialFlag'">
                <span v-if="scope.row[item.prop] == 1">是</span>
                <span v-else-if="scope.row[item.prop] == 0">否</span>
              </template>
              <template v-else-if="item.prop === 'show'">
                <span v-if="scope.row[item.prop] == 1">住院可用</span>
                <span v-else-if="scope.row[item.prop] == 0">门诊可用</span>
              </template>
              <template v-else-if="item.prop === 'spec'">{{
                scope.row[item.prop]
              }}</template>
              <template v-else-if="item.prop === 'drugBasedCode'">{{
                scope.row[item.prop]
              }}</template>
              <template v-else-if="item.prop === 'orginCode'">
                <span
                  :val="scope.row[item.prop]"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'dosageTypeId'">
                <span
                  :val="scope.row[item.prop]"
                  code="ClassificationCodeOfChinese"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'chargePrice'">
                {{ Number(scope.row[item.prop] || 0).toFixed(4) }}
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <!-- <el-table-column
            key="handlercol"
            type="index"
            label="操作"
            width="100"
            header-align="center"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="delItem(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="page align-right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getGroupChargeItemList,
  getGroupChargeItemById,
  addGroupChargeItem,
  updateGroupChargeItem,
  deleteGroupChargeItem
} from "@/api/systemManagement/dataMaintain/payItemsGroup.js";
import base from "@/api/hmm/base";
import {selectLoadMore} from '@/utils/directives.js'
export default {
  name: "payItemsGroup",
  data() {
    return {
      remoteUnitParams: {
        page: 1,
        pageSize: 100,
        id: 4078,
      },
      searchParams: {
        finClassCode: "",
        chargeItemName: "",
        namePy: "",
        nameWb: "",
        miControlLevel: "",
        outpEnable: "",
        inpEnable: "",
        recordStatus: "1",
      },
      enableOpions: [
        {
          label: "否",
          value: "0",
        },
        {
          label: "是",
          value: "1",
        },
      ],
      test:[],
      recordStatusOptions: [
        {
          label: "暂停",
          value: "0",
        },
        {
          label: "在用",
          value: "1",
        },
      ],
      enableShow: {
        0: "否",
        1: "是",
      },
      recordStatusShow: {
        0: "暂停",
        1: "在用",
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      pageParamsOrgin: {
        pageNo: 1,
        pageSize: 100,
        total: 0,
      },
      loading: false,
      tableParams: [
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          width: 150,
          fixed: "left",
        },
        {
          prop: "chargeItemCode",
          label: "收费项目编码",
          width: 150,
        },
        {
          prop: "finClassCode",
          label: "财务分类码",
          width: 150,
        },
        {
          prop: "provincialLevelCode",
          label: "省级编码",
          width: 140,
        },
        {
          prop: "medicalRecordClassCode",
          label: "病案分类码",
          width: 150,
        },
        {
          prop: "namePy",
          label: "拼音",
          width: 100,
        },
        {
          prop: "nameWb",
          label: "五笔",
          width: 100,
        },
        {
          prop: "chargeUnit",
          label: "收费单位",
          width: 140,
        },
        {
          prop: "chargePrice",
          label: "单价",
          width: 100,
        },
        {
          prop: "miControlLevel",
          label: "医保控制级别",
          width: 150,
        },
        {
          prop: "outpEnable",
          label: "门诊可用",
          width: 120,
        },
        {
          prop: "inpEnable",
          label: "住院可用",
          width: 120,
        },
        {
          prop: "recordStatus",
          label: "状态标识",
          width: 120,
        },
        {
          prop: "spec",
          label: "规格",
          width: 100,
        },
        {
          prop: "drugBasedCode",
          label: "本位码",
          width: 120,
        },
        {
          prop: "orginCode",
          label: "产地",
          width: 100,
        },
        {
          prop: "dosageTypeId",
          label: "剂型",
          width: 100,
        },
        {
          prop: "specialMedicalMaterialFlag",
          label: "特殊医用材料标志",
          width: 200,
        },
        {
          prop: "show",
          label: "隐藏",
          width: 100,
        },
      ],
      tableData: [],
      // 是否是新增，true：是；false：否
      isNewAdd: false,
      form: {
        finClassCode: "",
        adviceMajorClass: "",
        adviceSubClass: "",
        provincialLevelCode: "",
        medicalRecordClassCode: "",
        chargeItemName: "",
        chargeUnitId: "",
        chargePrice: "",
        miControlLevel: "",
        outpEnable: "",
        inpEnable: "",
        recordStatus: "",
      },
      remoteParams: { pageSize: 100, status: "0", parentId: "0" }, // 分页参数
      remoteSonParams: { pageSize: 100, status: "0", parentCode: "-1" }, // 分页参数
      rules: {
        finClassCode: [{ required: true, message: "请输入", trigger: "blur" }],
        adviceMajorClass: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        adviceSubClass: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        // provincialLevelCode: [
        //   { required: true, message: "请输入", trigger: "blur" },
        //   { min: 1, max: 30, message: '长度最多30个字符', trigger: 'blur' }
        // ],
        medicalRecordClassCode: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        chargeItemName: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        chargeUnitId: [{ required: true, message: "请输入", trigger: "blur" }],
        chargePrice: [{ required: true, message: "请输入", trigger: "blur" }],
        miControlLevel: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        namePy: [{ required: true, message: "请输入", trigger: "blur" }],
        nameWb: [{ required: true, message: "请输入", trigger: "blur" }],
        outpEnable: [{ required: true, message: "请选择", trigger: "change" }],
        inpEnable: [{ required: true, message: "请选择", trigger: "change" }],
        recordStatus: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        chargeItemCode: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
      },
      formLoad: false,
    };
  },
  methods: {
    loadMore () {
      this.pageParamsOrgin.pageNo++;
      this.getOrginCode()
    },
    search() {
      this.pageParams.pageNo = 1;
      this.loadTable();
      this.getOrginCode()
    },
    getOrginCode(){
      const params = {
        pageNo: this.pageParamsOrgin.pageNo,
        pageSize: this.pageParamsOrgin.pageSize,
        id:'4080'
      };
      base.getOrginCode(params)
        .then((res) => {
          if (res.code === 1) {
            this.test = this.test.concat(res.data)
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    reset() {
      this.searchParams = this.$options.data().searchParams;
    },
    async rowClick(row) {
      this.$refs.form.resetFields();
      this.isNewAdd = false;
      this.getGroupChargeItemById(row);
      /* this.form = {
        ...row,
      chargePrice: Number(row.chargePrice || 0).toFixed(4)
      }; */
      this.remoteSonParams = {
        pageSize: 100,
        status: "0",
        parentCode: row.adviceMajorClass,
      };
    },
    async getGroupChargeItemById(row) {
      try {
        let { code, data, msg } = await getGroupChargeItemById(row);
        if (code == 1) {
          this.form = {
            ...data,
            chargePrice: Number(data.chargePrice || 0).toFixed(4),
          };
        }
      } catch (error) {}
    },
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      };
      this.loading = true;
      getGroupChargeItemList(params)
        .then((res) => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
            // 默认选中第一个
            if (res.data.length > 0) {
              this.rowClick(res.data[0]);
              this.$refs.singleTable &&
                this.$refs.singleTable.setCurrentRow(res.data[0]);
            } else {
              this.newAdd();
            }
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    delItem(data) {
      this.$confirm("此操作将永久删除该收费项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "pay-item-cancel-btn",
        type: "warning",
        beforeClose: (action, instance, done) => {
          instance.confirmButtonLoading = false;
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "删除中...";
            deleteGroupChargeItem(data)
              .then((res) => {
                instance.confirmButtonLoading = false;
                done();
                if (res.code === 1) {
                  this.search();
                  this.$message({
                    type: "success",
                    message: res.msg || "删除成功!",
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: res.msg || "删除失败!",
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  type: "error",
                  message: err.msg || "删除失败!",
                });
                instance.confirmButtonLoading = false;
              });
          } else {
            done();
          }
        },
      });
    },
    newAdd() {
      this.isNewAdd = true;
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
      this.$refs.form.resetFields();
      this.form = this.$options.data().form;
    },
    doctorsAdviceChange(value) {
      console.log(value);
      this.$set(this.form, "adviceSubClass", "");
      this.remoteSonParams = { pageSize: 100, status: "0", parentCode: value };
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoad = true;
          if (this.isNewAdd) {
            addGroupChargeItem(this.form)
              .then((res) => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.search();
                  this.$message.success(res.msg || "新增成功!");
                } else {
                  this.$message.error(res.msg || "新增失败!");
                }
              })
              .catch((err) => {
                this.formLoad = false;
              });
          } else {
            updateGroupChargeItem(this.form)
              .then((res) => {
                if (res.code === 1) {
                  this.formLoad = false;
                  this.search();
                  this.$message.success(res.msg || "修改成功!");
                } else {
                  this.$message.error(res.msg || "修改失败!");
                }
              })
              .catch((err) => {
                this.formLoad = false;
              });
          }
        }
      });
    },
    // 单价正则校验大于等于0，最多2位小数
    priceChange(val) {
      const valid = /^(\d*)(\d*)(\.\d{1,4})?$/;
      if (!valid.test(Number(val))) {
        this.$message.warning("请输入大等于0且最多4位小数的数字!");
        this.$set(this.form, "chargePrice", "");
      }
    },
    chargeUnitIdChange(val, obj) {
      this.form.chargeUnit = "";
      if (obj && obj.hasOwnProperty("name")) {
        this.form.chargeUnit = obj.name;
      }
    },
  },
  created() {
    this.search();
  },
};
</script>

<style lang="scss" scoped>
.finance {
  overflow: hidden;
}
.finance-left {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-right: 310px;
}
.finance-right {
  width: 300px;
  padding: 10px;
}
.search {
  display: flex;
  overflow: hidden;
  .search-input {
    flex: 1;
    overflow: hidden;
  }
  .search-btn {
    margin-left: 10px;
  }
}
.align-right {
  text-align: right;
}
.search {
  .el-row {
    margin-bottom: 10px;
    /deep/ .l-input-wrap {
      vertical-align: top;
    }
  }
}
.table {
  flex: 1;
  overflow: hidden;
  margin-bottom: 10px;
}
.page {
  .el-pagination {
    padding: 0;
  }
  /deep/ .el-input--medium .el-input__inner {
    height: 100% !important;
  }
}
.card-title {
  height: 20px;
  line-height: 20px;
  margin-bottom: 10px;
  /deep/ .titleleft::before {
    margin-top: 0;
  }
}

.form {
  height: calc(100% - 76px);
  margin-bottom: 10px;
  overflow: hidden;
  overflow-y: auto;
  /deep/ .el-form-item__content {
    height: 36px;
    margin-bottom: 6px;
  }
}
</style>
<style>
.pay-item-cancel-btn {
  float: right;
  margin-left: 10px;
}
</style>
