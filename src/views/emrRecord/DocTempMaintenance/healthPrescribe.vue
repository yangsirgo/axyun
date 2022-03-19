<template>
  <div class="height100 width100 bg-center">
    <l-layout
      :toolBoxShow="false"
      :patientListShow="false"
      pageName="docSubmit"
    >
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="m-contain height100">
            <div class="top-search">
              <l-common-search rightAreaWidth="210">
                <template slot="leftCon">
                  <div class="common-item lg-width">
                    <l-formt-title label="关键词">
                      <el-input
                        placeholder="请输入编码、名称、拼音、五笔或助记码"
                        v-model="queryParam.key"
                      ></el-input>
                    </l-formt-title>
                  </div>
                </template>
                <template slot="rightCon">
                  <div class="btns-contain">
                    <el-button class="el-button--primary" @click="btnQuare"
                      >查询</el-button
                    >
                    <el-button
                      class="el-button--default"
                      @click="clearCondition"
                      >重置</el-button
                    >
                  </div>
                </template>
              </l-common-search>
            </div>

            <!-- 表格部分 -->
            <div class="table-con margin-top-10">
              <div
                style="
                  padding: 8px 0;
                  border-top: 1px solid #dcdfe6;
                  margin-top: 8px;
                "
                class="height100"
              >
                <div class="iconBtn">
                  <l-card-title>
                    <template slot="left">健康处方列表</template>
                    <div slot="right">
                      <el-button @click="createType" icon="el-icon-plus"
                        >新建</el-button
                      >
                      <el-button icon="el-icon-edit-outline" @click="modifyType"
                        >编辑</el-button
                      >
                      <el-button icon="el-icon-remove-outline" @click="delType"
                        >删除</el-button
                      >
                    </div>
                  </l-card-title>
                </div>
                <div
                  class=""
                  style="height: calc(100% - 40px); margin-top: 8px"
                >
                  <l-table
                    :total="pageParams.total"
                    :pageSize.sync="pageParams.pageSize"
                    :page.sync="pageParams.pageNo"
                    :layout="layout"
                    :singlePageShow="true"
                    @changeSize="changeSize"
                  >
                    <el-table
                      :data="typeTable"
                      ref="typeTable"
                      border
                      height="100%"
                      style="width: 100%"
                      v-loading="tlm_isLoading"
                      element-loading-background="rgba(255, 255, 255, 0.5)"
                      @row-click="handleRowClick"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column
                        type="selection"
                        width="50px"
                      ></el-table-column>
                      <el-table-column
                        type="index"
                        label="序号"
                        :index="indexMethod"
                        width="50px"
                      ></el-table-column>
                      <el-table-column
                        prop="hpCd"
                        label="健康处方编码"
                        width="150px"
                      ></el-table-column>
                      <el-table-column
                        prop="hpNm"
                        label="健康处方名称"
                        width="200px"
                      ></el-table-column>
                      <el-table-column
                        prop="icdDic"
                        label="疾病名称"
                        min-width="200px"
                      >
                        <template slot-scope="scope">
                          <span>{{ parseICDDic(scope.row.icdDic) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="diseaseIds"
                        label="疾病编码"
                        min-width="100px"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="scopeLevel"
                        label="所属类别"
                        min-width="50px"
                      >
                        <template slot-scope="scope">
                          <span
                            :val="scope.row.scopeLevel"
                            code="LevelType"
                            v-codeTransformEmr
                          ></span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="ownerName" label="所属名称">
                      </el-table-column>
                      <el-table-column
                        prop="sortNo"
                        label="排序"
                        min-width="40px"
                      ></el-table-column>
                    </el-table>
                  </l-table>
                </div>
                <el-dialog
                  :title="tDialogMode"
                  :visible.sync="createTypeDialog"
                  :close-on-click-modal="false"
                  :before-close="handleDialogClose"
                  width="740px"
                >
                  <div style="width: 100%; padding: 8px 16px">
                    <el-row style="margin-top: 12px" :gutter="12">
                      <el-col :span="4">
                        <p
                          style="line-height: 30px; text-align: right"
                          class="necessary-control"
                        >
                          健康处方编码
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          :disabled="disabledFlag || tpCdFlag"
                          v-model="createTypeData.hpCd"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <p
                          style="line-height: 30px; text-align: right"
                          class="necessary-control"
                        >
                          健康处方名称
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          :disabled="disabledFlag"
                          v-model="createTypeData.hpNm"
                        ></el-input>
                      </el-col>
                    </el-row>

                    <el-row style="margin-top: 12px" :gutter="12">
                      <el-col :span="4">
                        <p
                          style="line-height: 30px; text-align: right"
                          class="necessary-control"
                        >
                          所属级别
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <!-- <l-value-domain
                          code="LevelType"
                          placeholder="请选择"
                          :value.sync="createTypeData.scopeLevel"
                          @change="changeOwner"
                        ></l-value-domain> -->
                        <el-select
                          v-model="createTypeData.scopeLevel"
                          @change="changeOwner"
                          :disabled="disabledFlag"
                          placeholder="请选择"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in orgOptions"
                            :key="item._id"
                            :label="item.name"
                            :value="item.code"
                          >
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="4">
                        <p
                          style="line-height: 30px; text-align: right"
                          class="necessary-control"
                        >
                          所属名称
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <el-select
                          class="width100"
                          v-model="ownerId"
                          :disabled="nOwnNameDisabled || disabledFlag"
                          filterable
                          clearable
                          collapse-tags
                          multiple
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in nOwnNameOpt"
                            :key="item.id"
                            :label="item.orgNm"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 12px" :gutter="12">
                      <el-col :span="4">
                        <p
                          style="line-height: 30px; text-align: right"
                          class="necessary-control"
                        >
                          疾病名称
                        </p>
                      </el-col>
                      <el-col :span="20">
                        <i
                          class="el-icon-plus"
                          style="
                            font-size: 25px;
                            margin: 0px 10px;
                            float: right;
                            cursor: pointer;
                          "
                          v-popover:popover
                        ></i>
                        <div
                          style="
                            float: left;
                            border: 1px solid #e4e4e4;
                            overflow: auto;
                            width: 90%;
                            height: 100px;
                          "
                        >
                          <el-tag
                            v-for="tag in createTypeData.icdDic"
                            :key="tag.ICD10_ENCODING"
                            closable
                            type="info"
                            style="margin-left: 10px; margin-top: 10px"
                            @close="handleClose(tag)"
                          >
                            {{ tag.DICTIONARY_NAME }}
                          </el-tag>
                        </div>
                        <el-popover
                          ref="popover"
                          placement="bottom"
                          :offset="100"
                          width="400"
                          trigger="click"
                          @show="icdSelectPop"
                          v-model="popoverShow"
                        >
                          <div class="dialog-footer" style="margin: 8px">
                            <el-input
                              placeholder="输入关键字,回车进行过滤"
                              style="width: calc(100% - 60px)"
                              v-model="filterText"
                              @change="filterTextChanged"
                            ></el-input>
                            <el-button
                              size="small"
                              type="primary"
                              @click="handleClosePop"
                              >关闭</el-button
                            >
                          </div>

                          <el-table
                            stripe
                            :data="listData"
                            ref="icdTable"
                            @row-dblclick="dblclick"
                            border
                            height="360px"
                            v-loading="tlm_isLoading"
                            v-loadmore="{
                              noMoreVar: 'tlm_noMore',
                              loadingVar: 'tlm_isLoading',
                              value: loadNextPage,
                            }"
                            style="width: 100%; margin-top: 10px"
                          >
                            <el-table-column
                              prop="dictionaryName"
                              min-width="60%"
                              label="名称"
                            ></el-table-column>
                            <el-table-column
                              prop="icd10Encoding"
                              min-width="40%"
                              label="编码"
                            ></el-table-column>
                          </el-table>
                        </el-popover>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 12px" :gutter="12">
                      <el-col :span="4">
                        <p
                          style="line-height: 30px; text-align: right"
                          class="necessary-control"
                        >
                          健康处方内容
                        </p>
                      </el-col>
                      <el-col :span="20">
                        <el-input
                          v-model="createTypeData.hpContent"
                          :disabled="disabledFlag"
                          type="textarea"
                          :autosize="{ minRows: 4, maxRows: 8 }"
                          placeholder="请输入内容"
                        ></el-input>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 12px" :gutter="12">
                      <el-col :span="4">
                        <p style="line-height: 30px; text-align: right">
                          拼音码
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          disabled
                          v-model="createTypeData.pinyinCd"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <p style="line-height: 30px; text-align: right">
                          五笔码
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          disabled
                          v-model="createTypeData.wubiCd"
                        ></el-input>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 12px" :gutter="12">
                      <el-col :span="4">
                        <p style="line-height: 30px; text-align: right">
                          助记码
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          :disabled="disabledFlag"
                          v-model="createTypeData.customCd"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <p
                          style="line-height: 30px; text-align: right"
                          class="necessary-control"
                        >
                          排序码
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          :disabled="disabledFlag"
                          v-model="createTypeData.sortNo"
                        ></el-input>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 12px" :gutter="12">
                      <el-col :span="4">
                        <p style="line-height: 30px; text-align: right">描述</p>
                      </el-col>
                      <el-col :span="20">
                        <el-input
                          type="textarea"
                          :disabled="disabledFlag"
                          v-model="createTypeData.description"
                          :autosize="{ minRows: 3, maxRows: 6 }"
                          placeholder="请输入内容"
                        ></el-input
                      ></el-col>
                    </el-row>
                  </div>
                  <div slot="footer">
                    <el-button type="primary" @click="submitForm"
                      >确定</el-button
                    >
                    <el-button @click="closeManageDialog">取消</el-button>
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { getPamars } from "@/utils/auth";
import { getUId, getUN } from "@/utils/crypto.js";

import hmm from "@/api/hmm/base.js";
import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";
import { getDeptList } from "@/api/admin/role";
import {
  getIcd10DictionaryByKey,
  getIcd10DictionaryPage
} from "@/api/emrRecord/emr/paragraphType";
import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";

import {
  postHealthPrescription,
  putHealthPrescription,
  delHealthPrescription,
  getHealthPrescription,
  gethealthPrescriptionSeq_no
} from "@/api/emrRecord/emr/healthPrescribe.js";

export default {
  name: "rpTypeGroupMt",
  components: {},
  mixins: [commonMixins],
  data() {
    return {
      queryParam: {
        key: ""
      },
      typeTable: [],
      tlm_isLoading: false,
      listData: [],
      createTypeDialog: false,
      tDialogMode: "新建健康处方",
      layout: "total,prev,pager,next,jumper",
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      pageParamsKey: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tag: {},
      createTypeData: {
        sortNo: "",
        hpCd: "",
        icdDic: [],
        diseaseIds: "",
        diseaseNameArr: "",
        hpContent: ""
      },
      mutiSelectData: [],
      nOwnNameOpt: [],
      nOwnNameOptCopy: [],
      ownerId: null,
      isNewBuilt: true,
      filterText: "",
      popoverShow: false,
      createOrModifyFlag: false,
      tpCdFlag: true,
      orgOptions: [],
      disabledFlag: false,
      dictListForCode: [],
      isDicDeptAdmin: false,
      nOwnNameDisabled: false
    };
  },
  watch: {
    createTypeDialog(newVal) {
      if (newVal && this.tDialogMode === "新建健康处方") {
        this.getSeqNo();
      }
    }
  },
  created() {
    this.query();
    this.getDeptListRequest();
    this.handlerOrgList();
  },
  methods: {
    async handlerOrgList() {
      try {
        const { code, data, msg } = await hmm.getDictListForCode(
          "AllLevelType"
        );
        this.dictListForCode = data;
        const adminStr = this.getCurrRoleCodeHandler();
        if (code === 1 && data) {
          this.swithHandler(adminStr, data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    swithHandler(adminStr, data) {
      switch (adminStr) {
        case "tenant":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("9");
          });
          break;
        case "org":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("0");
          });
          break;
        case "dept":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("1");
          });
          break;
        case "other":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("2");
          });
          break;
        default:
          break;
      }
    },
    getSeqNo() {
      gethealthPrescriptionSeq_no()
        .then(res => {
          if (res.code === 1) {
            this.createTypeData.hpCd = res.data;
            this.tpCdFlag = true;
          } else {
            this.tpCdFlag = false;
            this.$message.error(res.message || "获取健康处方编码失败");
          }
        })
        .catch(error => {
          this.tpCdFlag = false;

          this.$message.error(error.message || "获取健康处方编码失败");
        });
    },
    handleClose(tag) {
      if (this.disabledFlag) return;
      this.createTypeData.icdDic = this.createTypeData.icdDic.filter(
        item => item.ICD10_ENCODING !== tag.ICD10_ENCODING
      );

      this.createTypeData.diseaseIds = this.createTypeData.icdDic
        .map(item => item.ICD10_ENCODING)
        .join(",");
      this.createTypeData.diseaseNameArr = this.createTypeData.icdDic.map(
        item => item.DICTIONARY_NAME
      );
    },
    handleClosePop() {
      this.filterText = "";
      this.popoverShow = false;
    },
    filterTextChanged() {
      if (this.filterText === "") {
        this.icdSelectPop();
      } else {
        this.tlm_isLoading = true;
        getIcd10DictionaryByKey(this.filterText)
          .then(res => {
            if (res.code === 1) {
              this.listData = res.data;
            } else {
              this.$message.error("获取接口失败!");
            }
          })
          .catch(error => {
            this.$message.error(error);
          })
          .finally(() => {
            this.tlm_isLoading = false;
          });
      }
    },
    icdSelectPop() {
      this.listData = [];
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      };
      this.loadTable();
    },
    dblclick(data) {
      if (this.disabledFlag) return;
      // 判断是否是已存在疾病
      let flag = this.createTypeData.icdDic.findIndex(
        item => item.ICD10_ENCODING === data.icd10Encoding
      );
      if (flag >= 0) {
        return;
      } else {
        this.createTypeData.icdDic.push({
          ICD10_ENCODING: data.icd10Encoding,
          DICTIONARY_NAME: data.dictionaryName
        });
      }

      this.createTypeData.diseaseIds = this.createTypeData.icdDic
        .map(item => item.ICD10_ENCODING)
        .join(",");
      this.createTypeData.diseaseNameArr = this.createTypeData.icdDic.map(
        item => item.DICTIONARY_NAME
      );
    },
    loadNextPage() {
      if (this.tlm_noMore || this.filterText != "") {
        this.tlm_isLoading = false;
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    loadTable() {
      this.tlm_isLoading = true;
      getIcd10DictionaryPage({
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      })
        .then(res => {
          this.tlm_isLoading = false;

          if (res.code === 1) {
            this.listData = [...this.listData, ...res.data];
            this.pageParamsKey = {
              pageNo: res.pageNo,
              pageSize: res.pageSize,
              total: res.total
            };
          } else {
            this.$message.error("获取接口失败!");
            return;
          }
        })
        .catch(error => {
          this.$message.error(error);
          this.tlm_isLoading = false;
        });
    },
    handleSelectionChange(data) {
      this.mutiSelectData = data;
    },
    closeManageDialog() {
      this.createTypeDialog = false;
      this.createTypeData = {
        hpCd: "",
        icdDic: [],
        diseaseIds: "",
        diseaseNameArr: ""
      };
      this.ownerId = null;
    },
    createType() {
      getParamsByKey({
        key: ['deptDictionaryAdminRoles']
      }).then(resp => {
        const curRoleId = JSON.parse(window.localStorage.getItem('role')).roleCode
        const rolesList = resp.data.deptDictionaryAdminRoles.split(',')
        this.isDicDeptAdmin = rolesList.includes(curRoleId);

        this.createTypeDialog = true;
        this.isNewBuilt = true;
        this.disabledFlag = false;
        this.tDialogMode = "新建健康处方";
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
        // this.changeOwner();
      })
      
    },
    paramsArrHandler(arr = []) {
      let list = [];
      list = arr.map(item => {
        return {
          id: item.hpId,
          code: item.hpCd,
          scopeLevel: item.scopeLevel,
          ownerId: item.ownerId,
          oprRoleLevel: item.oprRoleLevel
        };
      });
      return list;
    },
    async modifyType() {
      if (this.mutiSelectData.length !== 1) {
        this.$message({
          message: "请选择一条数据!",
          type: "warning"
        });
        return;
      }

      this.createTypeDialog = true;
      this.tDialogMode = "编辑健康处方";
      this.isNewBuilt = false;
      this.createTypeData = {
        ...this.mutiSelectData[0],
        diseaseNameArr: this.mutiSelectData[0].icdDic.map(
          data => data.DICTIONARY_NAME
        )
      };

      const params = this.paramsArrHandler(this.mutiSelectData);
      const flag = await this.authorityHandler(params);

      this.disabledFlag = !flag;
      if (this.disabledFlag) {
        this.swithHandler(
          this.roleRevereMap[this.createTypeData.scopeLevel],
          this.dictListForCode
        );
      } else {
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      }

      // 初始化所属类型和所属名称 的数据
      this.changeOwner();
    },
    async delType() {
      if (this.mutiSelectData.length === 0) {
        this.$message({
          message: "请选择删除项!",
          type: "warning"
        });
        return;
      }

      let params = [];
      params = this.mutiSelectData.map(item => item.hpId);

      const list = this.paramsArrHandler(this.mutiSelectData);
      const flag = await this.authorityHandler(list);

      if (!flag) {
        return;
      }

      this.$confirm("此操作将删除当前数据, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delHealthPrescription(params)
            .then(res => {
              if (res.code == 1) {
                this.query();
                this.$message.success("删除成功");
              } else {
                this.$message.error(res.msg || "接口报错");
                return;
              }
            })
            .catch(res => {
              this.$message.error(res.msg);
            });
        })
        .catch(() => {});
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
    handleDialogClose(done) {
      this.closeManageDialog();
      done();
    },
    btnQuare() {
      this.pageParams.pageNo = 1;
      this.query();
    },
    query() {
      if (this.tlm_isLoading) return;
      this.tlm_isLoading = true;
      let param = { ...this.queryParam, ...this.pageParams };

      getHealthPrescription(param)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.typeTable = res.data;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    getDeptListRequest() {
      getDeptList()
        .then(res => {
          const { code, data, msg } = res;
          if (code === 1) {
            this.nOwnNameOptCopy = data;
          } else {
            this.$message.error(msg || "请求数据失败");
            return;
          }
        })
        .catch(err => {
          this.$message.error(JSON.stringify(err) || "获取科室列表数据失败");
        });
    },
    changeOwner(sLevel = "") {
      this.nOwnNameDisabled = false;
      let orgMsg = JSON.parse(getPamars());
      let scopeLevel = sLevel
        ? sLevel
        : !this.isNewBuilt
        ? this.createTypeData.scopeLevel
        : this.roleMap[this.getCurrRoleCodeHandler()];
      let hosId = this.createTypeData.ownerId;

      switch (scopeLevel) {
        case "0":
          // 全院的情况
          let hosName = orgMsg.hosName;

          this.nOwnNameOpt = [{ id: hosId, orgNm: hosName }];
          this.ownerId = [hosId];

          break;
        case "1":
          // 选择科室的情况
          this.nOwnNameOpt = this.nOwnNameOptCopy;
          // 科室情况
          if (!this.isNewBuilt && this.mutiSelectData[0].scopeLevel === "1") {
            // 非新建状态
            this.ownerId = hosId.split(",").map(item => Number(item));
          } else {
            // 新建
            this.ownerId = [this.nOwnNameOpt[0].id];
          }
          if (this.isDicDeptAdmin) {
            this.nOwnNameDisabled = true
            const deptId = JSON.parse(window.localStorage.getItem('role')).deptId
            this.ownerId = [this.nOwnNameOpt.find(item => item.id === deptId).id]
          }
          break;
        case "2":
          // 选择个人的情况
          this.nOwnNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.ownerId = [getUId()];
          break;
        case "9":
          // 选择租户的情况
          this.nOwnNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerId = [orgMsg.orgId];
          break;
        default:
          break;
      }
    },
    clearCondition() {
      this.queryParam = {
        key: ""
      };
    },
    parseICDDic(dic) {
      let str = "";
      let list = Object.keys(dic);
      list.forEach((key, index) => {
        if (index < list.length - 1) {
          str += `${dic[key].DICTIONARY_NAME}、`;
        } else {
          str += `${dic[key].DICTIONARY_NAME}`;
        }
      });
      return str;
    },
    handleRowClick(row, event, column) {
      this.$refs.typeTable.toggleRowSelection(row);
    },
    submitForm() {
      let noInportantKey = [
        "pinyinCd",
        "wubiCd",
        "customCd",
        "description",
        "dataVersion",
        "diseaseNames",
        "icdDic",
        "ownerId"
      ];

      // 必填项判断
      for (let k in this.createTypeData) {
        if (k === "ownerId" && this.ownerId.length === 0) {
          this.$message.error("请填写必填项!");
          return false;
        } else if (!noInportantKey.includes(k)) {
          let keyVal = this.createTypeData[k];

          if (keyVal === "") {
            this.$message.error("请填写必填项!");
            return false;
          }
        }
      }

      let params = {
        hpCd: this.createTypeData.hpCd,
        hpNm: this.createTypeData.hpNm,
        scopeLevel: this.createTypeData.scopeLevel,
        ownerId: this.ownerId.join(","),
        diseaseIds: this.createTypeData.diseaseIds,
        diseaseNameArr: this.createTypeData.diseaseNameArr,
        pinyinCd: this.createTypeData.pinyinCd,
        hpContent: this.createTypeData.hpContent,
        sortNo: this.createTypeData.sortNo,
        wubiCd: this.createTypeData.wubiCd,
        customCd: this.createTypeData.customCd,
        description: this.createTypeData.description
      };

      if (this.createOrModifyFlag) return;
      this.createOrModifyFlag = true;

      if (this.tDialogMode === "新建健康处方") {
        postHealthPrescription(params)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("新增数据成功！");
              this.btnQuare();
            } else {
              this.$message.error(res.msg || "修改数据失败");
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "修改数据接口错误");
          })
          .finally(() => {
            this.createOrModifyFlag = false;
            this.closeManageDialog();
          });
      } else {
        params = Object.assign(params, {
          hpId: this.createTypeData.hpId,
          dataVersion: this.createTypeData.dataVersion
        });
        putHealthPrescription(params)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("修改数据成功！");
              this.btnQuare();
            } else {
              this.$message.error(res.msg || "修改数据失败");
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "修改数据接口错误");
          })
          .finally(() => {
            this.createOrModifyFlag = false;
            this.closeManageDialog();
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .m-contain {
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 0;
    .top-search {
      padding-top: 20px;
      .lg-width {
        width: 380px;
      }
    }
    .table-con {
      height: calc(100% - 70px);
    }
  }
}
.iconBtn {
  .el-button--primary,
  .el-button--default {
    padding: 5px 20px 5px 10px;
  }
}
.necessary-control:before {
  content: "*";
  color: #f56c6c;
  top: 2px;
  left: -8px;
}
/deep/ .el-col {
  padding-left: 0 !important;
}
/deep/ .el-tabs {
  height: calc(100% + 50px);
}
/deep/ .el-tabs__content {
  height: calc(100% + 50px);
}
</style>
