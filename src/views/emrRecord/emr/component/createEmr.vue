<template>
  <div class="emr-mainDiv height100 width100">
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="选择模板" name="template">
        <div class="top-search">
          <l-common-search rightAreaWidth="150">
            <template slot="leftCon">
              <div class="common-item item-width">
                <l-formt-title label="文书类型组">
                  <el-select
                    filterable
                    clearable
                    v-model="calVal"
                    placeholder="请选择"
                    @change="calChange"
                  >
                    <el-option
                      v-for="(item, index) in calOptions"
                      :key="item.value + index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="common-item item-width">
                <l-formt-title label="文书类型">
                  <el-select
                    filterable
                    clearable
                    v-model="classVal"
                    @change="changeRecordType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in classOptions"
                      :key="item.value + index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="模板名称">
                  <el-select
                    filterable
                    clearable
                    v-model="tempVal"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in tempOptions"
                      :key="item.value + index"
                      :label="item.label"
                      :value="item.label"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div
                class="common-item"
                style="
                  width: 240px;
                  display: flex;
                  font-size: 14px;
                  line-height: 32px;
                "
              >
                <span
                  style="
                    margin-right: 8px;
                    display: inline-block;
                    width: 100px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  "
                  :title="patientName"
                  >患者: {{ patientName }}</span
                >
                <span
                  >性别:<span
                    :val="patientGender"
                    code="GENDER_CODE"
                    v-codeTransform
                  ></span
                ></span>
                <span>年龄:{{ patientAge }}</span>
              </div>
              <div class="common-item" style="width: 530px">
                <l-formt-title>
                  <el-checkbox v-model="isTenant">通用</el-checkbox>
                  <el-checkbox v-model="isAll">本机构</el-checkbox>
                  <el-checkbox @change="isDeptHandle" v-model="isDept">
                    科室
                  </el-checkbox>
                  <l-value-domain
                    multiple
                    filterable
                    collapse-tags
                    :localFilterKeys="deptLocalFilterKeys"
                    clearable
                    style="width: 220px"
                    :value.sync="deptVal"
                    remoteUrl="/admin/wadmin/hos/dept"
                    remoteShowKey="orgNm"
                    remoteValueKey="id"
                    placeholder="请选择所属科室"
                    @change="deptValChangeHandle"
                  ></l-value-domain>
                  <el-checkbox v-model="isPersonal">个人</el-checkbox>
                </l-formt-title>
              </div>
              <div class="common-item" style="width: 214px">
                <l-formt-title label="适用病种">
                  <l-value-domain-emr
                    type="noselect"
                    clearable
                    filterable
                    :value.sync="appDisVal"
                    remoteUrl="/diseases/params"
                    remoteShowKey="diseasesName"
                    remoteValueKey="diseasesId"
                    :remoteParams="diseaseParams"
                    :localFilterKeys="['diseasesName']"
                    placeholder="请选择病种"
                  ></l-value-domain-emr>
                </l-formt-title>
              </div>
              <div class="common-item"></div>
            </template>

            <template slot="rightCon">
              <div class="btns-contain">
                <el-button
                  class="myBtn el-button--primary"
                  @click="queryFirstNo"
                  >查询</el-button
                >
                <el-button
                  class="myBtn el-button--default"
                  @click="clearCondtion"
                  >重置</el-button
                >
              </div></template
            >
          </l-common-search>
        </div>

        <div style="height: 340px">
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
              ref="elTable"
              class="my-table"
              :data="tableData"
              border
              height="100%"
              highlight-current-row
              v-loading="tableLoading"
              @row-click="rowClick"
              @row-dblclick="rowDbClick"
              style="width: 100%"
            >
              <el-table-column
                class="my-col"
                type="index"
                label="序号"
                :index="indexMethod"
                width="55px"
              ></el-table-column>
              <el-table-column
                prop="templateName"
                label="病历模板名称"
                width="400px"
              ></el-table-column>
              <el-table-column
                prop="typeName"
                label="文书类型"
                width="200px"
              ></el-table-column>
              <el-table-column prop="diseaseId" label="适用病种" width="200px">
                <template slot-scope="scope">
                  <span
                    tableName="md_diseases"
                    :conditionMap="{ diseases_id: scope.row.diseaseId }"
                    columns="diseases_name"
                    v-tableTransformEmr
                  ></span
                ></template>
              </el-table-column>
              <el-table-column
                prop="scopeLevelName"
                label="所属级别"
                width="100px"
              ></el-table-column>
              <el-table-column label="审签级别">
                <template slot-scope="scope">
                  <span
                    :val="scope.row.signLevel || ''"
                    code="AuditType"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
            </el-table>
          </l-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="选择既往病历" name="historyRecord">
        <div class="top-search">
          <l-common-search rightAreaWidth="160">
            <template slot="leftCon">
              <div class="common-item" style="width: 400px">
                <l-formt-title label="既往就诊">
                  <el-select
                    v-model="treatHistoryVal"
                    placeholder="请选择"
                    clearable
                    filterable
                    reserve-keyword
                    style="width: 100%"
                    @change="treatHistoryValChange"
                  >
                    <el-option
                      v-for="item in treatHistoryOptions"
                      :key="item.value + item.diagId"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="common-item" style="width: 300px">
                <l-formt-title label="文书名称">
                  <el-input
                    class="my-input"
                    v-model="instrumentName"
                    placeholder="请输入内容"
                  ></el-input>
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="文书类型组">
                  <el-select
                    filterable
                    clearable
                    v-model="typeGroupStr"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in calOptions"
                      :key="item.value + index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
            </template>
            <template slot="rightCon">
              <div class="btns-contain">
                <el-button class="myBtn el-button--primary" @click="initTree"
                  >查询</el-button
                >
                <el-button @click="resetData" class="myBtn el-button--default"
                  >重置</el-button
                >
              </div></template
            >
          </l-common-search>
        </div>

        <el-row>
          <el-col :span="6">
            <div style="height: 380px; margin-top: 8px">
              <el-tree
                style="overflow: auto; height: 100%"
                default-expand-all
                :data="tree"
                :props="defaultProps"
                :render-content="renderContent"
                @node-click="handleNodeClick"
              ></el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <div
              style="height: 380px; border: 1px solid #dcdfe6; margin-top: 8px"
            >
              <l-editor
                ref="axEditor"
                :isScrollBar="false"
                :isFullFlag="false"
                :configs="editorConfigs"
                :defaultMsg="defaultMsg"
                @ready="editorReady"
              >
              </l-editor>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div style="padding: 8px">
      <div class="common-item" style="width: 340px">
        <l-formt-title label="病历名称">
          <el-input
            class="my-input"
            v-model="nEmrName"
            placeholder="请输入内容"
          ></el-input>
        </l-formt-title>
      </div>
      <div class="common-item">
        <l-formt-title label="业务时间">
          <el-date-picker
            v-model="businessTime"
            :clearable="false"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            style="width: 190px"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </l-formt-title>
      </div>
      <div class="common-item" v-show="upDoctorShow">
        <l-formt-title label="上级查房医师"
          ><el-select v-model="superDoctorVal" placeholder="请选择" clearable>
            <el-option
              v-for="item in superDoctorOptions"
              :key="item.uid"
              :label="item.uname"
              :value="item.uid"
            >
            </el-option> </el-select
        ></l-formt-title>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  getUsableList,
  getDiagnosisMes,
  getTypeGroupSelectByCondition,
  getTypeSelectByCondition,
  getDeptDoctor
} from "@/api/emrRecord/emr/template";

import { getIcd10DictionaryByKey } from "@/api/emrRecord/emr/paragraphType";
import { getTree, contentQuery, save } from "@/api/emrRecord/emr/instrument";
import { getTypeGroups } from "@/api/emrRecord/emr/typeGroup";
import { getHistoryVisitViEn } from "@/api/emrRecord/tools/historicalDiagnosis";

import { getPamars } from "@/utils/auth";
import { getUId } from "@/utils/crypto";

export default {
  name: "createEmr",
  components: {},
  props: {
    visitType: String,
    dnFlag: String,
    classValMsg: {
      type: String,
      default: ""
    },
    isHome: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      typeGroupStr: "",
      diseaseParams: {
        deletedStatus: "0",
        enabled: "1"
      },
      localFilterKeys: ["diseasesName"],
      deptLocalFilterKeys: ["orgNm"],
      editorConfigs: {
        editorModel: "preview",
        defaultModel: "preview",
        showTabBar: false,
        initialFrameHeight: 380,
        tabToolbars: []
      },
      upDoctorShow: false,
      editor: null,
      activeName: "template",
      //文书类型组
      calVal: "",
      calOptions: [],
      //文书类型
      classVal: "",
      classOptions: [],
      //模板名称
      tempVal: "",
      tempOptions: [],
      //适用病种
      appDisVal: "",
      appDisOptions: [],
      //所属科室
      deptVal: [],
      // 通用
      isTenant: false,
      //全院
      isAll: false,
      //科室
      isDept: false,
      //个人
      isPersonal: false,
      //病历模板列表
      tableData: [],
      superDoctorVal: "",
      treatHistoryVal: "",
      superDoctorOptions: [],
      treatHistoryOptions: [],
      selectloading: false,
      nEmrName: "",
      businessTime: "",
      instrumentName: "",
      tree: [],
      defaultProps: {
        children: "children",
        label: "text"
      },
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 10 // 每页数据条数
      },
      layout: "total,prev,pager,next,jumper",
      curData: {},
      defaultMsg: "",
      isSex: true,
      isAge: true,
      loading: false,
      diseaseOpt: [],
      roleNameList: ["系统管理员", "超级管理员"],
      tableLoading: false
    };
  },
  watch: {
    classValMsg: {
      handler(val) {
        if (val) {
          this.classVal = val;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initTable();
    this.initOptions();
    this.renderSelectorData(this.role.deptId);
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("user", ["role"]),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    patientId() {
      let patientId =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.patientId
          : this.receivePatientData.patientId;
      return patientId;
    },
    patientName() {
      let patientName =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.patientName
          : this.receivePatientData.patientName;
      return patientName;
    },
    patientAge() {
      let patientAge =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.age
          : this.receivePatientData.patientAge;
      return patientAge;
    },
    patientGender() {
      let patientGender =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.gender
          : this.receivePatientData.patientGender;
      return patientGender;
    }
  },
  methods: {
    deptValChangeHandle(data) {
      if (data) {
        this.isDept = true;
      } else {
        this.isDept = false;
      }
    },
    isDeptHandle(data) {
      if (data) {
        this.deptVal = [this.role.deptId || ""];
      } else {
        this.deptVal = [];
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
    resetData() {
      this.instrumentName = "";
      this.treatHistoryVal = "";
    },
    treatHistoryValChange(val) {
      this.initTree();
    },
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then(resData => {
        if (resData.code === 1 && resData.data) {
          this.diseaseOpt = resData.data;
        } else {
          this.$message.error("获取接口失败!");
          return;
        }
      });
    },
    clearCondtion() {
      this.calVal = "";
      this.classVal = "";
      this.tempVal = "";
      this.appDisVal = "";
      this.deptVal = [];
      this.isAll = false;
      this.isDept = false;
      this.isPersonal = false;
      // 重新获取 文书类型 模板的数据
      this.recordTypeDataRequest();
      this.initTable();
    },
    editorReady(instance) {
      this.editor = instance;
      this.editor.execCommand("setmodel", {
        modelType: "preview",
        showToolbar: false
      });
    },
    renderContent(h, { node, data, store }) {
      let time = this.handleTime(data.exts.bizTime);
      if (!data.exts) {
        return <p>{data.text}</p>;
      }
      return (
        <div class="el-tree-node__content">
          <p>
            {data.text}
          </p>
        </div>
      );
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.queryTemplate();
    },
    queryFirstNo() {
      this.pageParams.pageNo = 1;
      this.queryTemplate();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    //查询模板
    queryTemplate() {
      let params = {
        templateName: this.tempVal,
        diseaseId: this.appDisVal,
        typeCode: this.classVal,
        typeGroupCode: this.calVal,
        visitType: this.visitType,
        dnFlag: this.dnFlag,
        age: this.isAge ? this.patientAge : "",
        sex: this.isSex ? this.patientGender : "",
        ...this.pageParams
      };

      this.handlerParams(params);
      this.tableLoading = true;
      getUsableList(params)
        .then(res => {
          if (res.code === 1) {
            this.tableData = res.data;
            this.pageParams.total = res.total;

            this.$nextTick(() => {
              if (this.classValMsg) {
                this.rowClick(this.tableData[0]);
              }
            });
          } else {
            this.$message.error(res.msg || "查询失败!");
            return;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlerParams(params) {
      if (!this.isTenant && !this.isAll && !this.isDept && !this.isPersonal) {
        params.currTenant = 1;
        params.currHos = 1;
        params.currDept = 1;
        params.currUser = 1;
        params.level0 = 0;
        params.level1 = 1;
        params.level2 = 2;
        params.level9 = 9;
      } else {
        if (this.isTenant) {
          params.currTenant = 1;
          params.level9 = 9;
        }
        if (this.isAll) {
          params.currHos = 1;
          params.level0 = 0;
        }
        if (this.isDept) {
          params.currDept = 1;
          params.level1 = 1;
          params.deptIds = this.deptVal.join(",");
        }
        if (this.isPersonal) {
          params.persId = getUId();
          params.currUser = 1;
          params.level2 = 2;
        }
      }
    },
    initTable() {
      let params = {
        age: this.isAge ? this.patientAge : "",
        sex: this.isSex ? this.patientGender : "",
        ...this.pageParams,
        currHos: 1,
        typeGroupCode: this.calVal,
        typeCode: this.classVal,
        visitType: this.visitType,
        dnFlag: this.dnFlag /*"hospitalId": JSON.parse(getPamars()).hosId*/,
        pageNo: 1, // 当前页数
        pageSize: 1000 // 每页数据条数
      };

      this.handlerParams(params);
      getUsableList(params).then(res => {
        if (res.code === 1) {
          this.tableData =
            res.data.length > this.pageParams.pageSize
              ? res.data.slice(0, this.pageParams.pageSize)
              : res.data;
          this.pageParams.total = res.total;
          let arr = [];
          res.data.forEach(item => {
            let opt = {
              value: item.templateCode,
              label: item.templateName
            };
            arr.push(opt);
          });
          this.tempOptions = arr;
          this.$nextTick(() => {
            if (this.classValMsg) {
              this.rowClick(this.tableData[0]);
            }
          });
        } else {
          this.$message.error("获取接口失败!");
          return;
        }
      });
    },
    //单击行
    rowClick(row) {
      this.nEmrName = row.templateName;
      this.businessTime = new Date();
      this.curData = row;
      // 只有上级医师查房才展示
      if (row.typeCode === "T_qy_sjyscfjl_001") {
        this.upDoctorShow = true;
      } else {
        this.upDoctorShow = false;
      }
    },
    renderSelectorData(id) {
      getDeptDoctor(id)
        .then(resp => {
          console.log(resp);
          if (resp.code === 1) {
            this.superDoctorOptions = resp.data;
          } else {
            this.$message.error("获取接口失败!");
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    rowDbClick(row) {
      this.nEmrName = row.templateName;
      this.businessTime = new Date();
      this.curData = row;
      this.$emit("rowDbClick");
    },
    handlerVisitTypeList() {
      let list = [];
      if (this.visitType === "01") {
        list = [{ visitType: "01", isHome: "0" }];
      } else if (this.visitType === "04") {
        list = [{ visitType: "04", isHome: "1" }];
      }
      return list;
    },
    getHistoryVisit() {
      if (this.selectloading) return;

      this.selectloading = true;

      let visitTypeList = this.handlerVisitTypeList();
      let paId = this.patientId;
      let params = {
        onlyHisFlag: "1",
        diagNm: "",
        visitTypeList: visitTypeList
      };

      getHistoryVisitViEn(paId, params)
        .then(res => {
          if (res.code === 1) {
            this.treatHistoryOptions = res.data.map((item, index) => {
              let codeShowString = item.curMainDiNm
                ? `-${item.curMainDiNm}`
                : "";

              return {
                value: item.enNo,
                label: item.visitingTime + "_" + item.enTpNm + codeShowString
              };
            });
            if (this.treatHistoryOptions.length > 0) {
              this.$nextTick(() => {
                this.treatHistoryVal = this.treatHistoryOptions[0].value;
                this.initTree();
              });
            }
          } else {
            this.$message.error("获取接口失败!");
            return;
          }
        })
        .finally(() => {
          this.selectloading = false;
        });
    },
    initOptions() {
      this.getHistoryVisit();
      //文书类型组
      let param = {
        typeGroupStatus: "1",
        visitType: this.visitType,
        dnFlag: this.dnFlag
      };
      getTypeGroups(param).then(res => {
        if (res.code === 1) {
          this.calOptions = res.data.map(item => {
            return {
              value: item.typeGroupCode,
              label: item.typeGroupName
            };
          });
        } else {
          this.$message.error("获取接口失败!");
          return;
        }
      });

      this.recordTypeDataRequest();
    },
    calChange() {
      this.classVal = "";
      this.tempVal = "";
      this.classOptions = [];
      this.tempOptions = [];
      // 更新文书类型
      this.recordTypeDataRequest();
      // 更新模板
      this.initTable();
    },
    recordTypeDataRequest() {
      let data = {
        typeGroupCode: this.calVal,
        visitType: this.visitType,
        dnFlag: this.dnFlag
      };
      //文书类型
      getTypeSelectByCondition(data).then(res => {
        if (res.code === 1) {
          let arr = [];
          res.data.forEach(item => {
            let opt = {
              value: item.code,
              label: item.name
            };
            arr.push(opt);
          });
          this.classOptions = arr;
        } else {
          this.$message.error("获取接口失败!");
          return;
        }
      });
    },
    changeRecordType() {
      this.tempVal = "";
      // 更新模板
      this.initTable();
    },
    //查询树
    initTree() {
      let data = {
        patientId: this.patientId,
        enId: this.treatHistoryVal,
        nm: this.instrumentName,
        visitType: this.visitType,
        typeGroup: this.typeGroupStr,
        isHome: this.isHome,
        onlyHisFlag: 1,
        mrFlag: "02"
      };
      getTree(data).then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.addTextAttr(item);
          });
          this.tree = res.data;
        } else {
          // this.$message.error("获取接口失败!");
          return;
        }
      });
    },
    //添加text属性，方便树加载
    addTextAttr(data) {
      data.text = data.label ? data.label : data.exts.mrName;
      if (data.children) {
        data.children.forEach(item => {
          this.addTextAttr(item);
        });
      }
    },
    handleNodeClick(data) {
      if (!data.exts.mrId) {
        return;
      }
      this.curData = data;
      let val = {
        mrId: data.exts.mrId,
        mrStaCd: data.exts.mrStaCd
      };

      contentQuery(val).then(res => {
        if (res.code === 1) {
          this.defaultMsg = res.data.docMongoContent;
          this.nEmrName = data.text;
          this.businessTime = new Date();
        } else {
          this.$message.error("查询失败!");
          return;
        }
      });
    },
    handleTabClick() {
      this.nEmrName = "";
      this.businessTime = "";
    },
    //创建病案或者病历
    createInsAndEmr() {
      let param = {
        templateName: this.nEmrName,
        businessTime: this.businessTime,
        supDctId: this.superDoctorVal
      };
      if (this.activeName === "template") {
        param = {
          ...param,
          typeCode: this.curData.typeCode,
          templateCode: this.curData.templateCode,
          signLevel: this.curData.signLevel,
          templateVersion: this.curData.templateVersion,
          createType: "byTemp"
        };
      } else {
        param = {
          ...param,
          typeCode: this.curData.exts.typeCode,
          templateCode: this.curData.exts.templateCode,
          pastMrId: this.curData.exts.mrId,
          signLevel: this.curData.exts.signLvlCd,
          templateVersion: this.curData.exts.templateVersion,
          createType: "byPast"
        };
      }
      return { param, activeTab: this.activeName };
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: inherit !important;
}
/deep/ .el-tabs--border-card > .el-tabs__content {
  padding: 8px 8px 0 8px;
}
/deep/ .el-tabs--top .el-tabs__content {
  height: auto;
}
/deep/ .el-tabs--top .el-tabs__content .el-tab-pane {
  height: auto;
}
.emr-mainDiv {
  display: flex;
  flex-direction: column;
  .top-search {
    .item-width {
      width: 240px !important;
    }
  }
  /deep/ .el-tabs {
    flex: 1;
  }

  .el-checkbox__label {
    line-height: 32px;
  }
  .el-select {
    width: 140px;
  }
  .my-input {
    width: 140px;
  }
  /deep/.el-icon-time:before {
    content: "";
  }
  .el-button--primary,
  .el-button--default {
    height: 30px;
  }
  .common-item {
    display: inline-block;
    width: 240px;
    margin-right: 8px;
  }
}
</style>
