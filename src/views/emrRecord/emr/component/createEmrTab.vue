<template>
  <div class="emr-mainDiv height100 width100">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="tab-contain"
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
              <div class="common-item" style="width: 240px">
                <l-formt-title label="模板名称" style="overflow: inherit;">
                  <el-autocomplete v-model="tempVal" :fetch-suggestions="querySearch" clearable @clear="setBlur" :popper-append-to-body="false"></el-autocomplete>
                  <!-- <el-select
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
                  </el-select> -->
                </l-formt-title>
              </div>
              <div
                class="common-item"
                style="
                  width: 360px;
                  display: flex;
                  font-size: 14px;
                  line-height: 32px;
                "
              >
                <span
                  :title="patientName"
                  style="
                    margin-right: 8px;
                    display: inline-block;
                    width: 120px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  "
                >
                  患者: {{ patientName }}
                </span>
                <span
                  style="
                    margin-right: 8px;
                    display: inline-block;
                    width: 90px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  "
                >
                  性别:
                  <span :val="patientGender" code="GENDER_CODE" v-codeTransform>
                  </span>
                </span>
                <span
                  style="
                    margin-right: 8px;
                    display: inline-block;
                    width: 150px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                  "
                  >年龄:{{ patientAge }}</span
                >
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
        <l-table
          :total="pageParams.total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          :layout="layout"
          :singlePageShow="true"
          class="table-list-con"
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
        <div class="table-list-tree" style="padding-top: 8px">
          <div class="left-tree height100">
            <el-tree
              style="overflow: auto; height: 100%"
              default-expand-all
              :data="tree"
              :props="defaultProps"
              :render-content="renderContent"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
          <div class="right-editor height100">
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
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="table-list">
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
    <div class="button-contain">
      <el-button class="myBtn" type="primary" @click="handleDetermine"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  getUsableList,
  getTypeSelectByCondition,
  getDeptDoctor
} from "@/api/emrRecord/emr/template";
import { checkQcDepend } from "@/api/emrRecord/qc";
import { receiveVisitRecord } from "@/api/cis/visit/visit.js";

import { getIcd10DictionaryByKey } from "@/api/emrRecord/emr/paragraphType";
import { getTree, contentQuery } from "@/api/emrRecord/emr/instrument";
import { getTypeGroups } from "@/api/emrRecord/emr/typeGroup";
import { getHistoryVisitViEn } from "@/api/emrRecord/tools/historicalDiagnosis";

import { getUId, getUN } from "@/utils/crypto";
import { getRole, getPamars } from "@/utils/auth";

export default {
  name: "createEmrTab",
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
        initialFrameHeight: 200,
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
      tableLoading: false,
      modeType: "menzhen"
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
  mounted() {
    this.initTable();
    this.renderSelectorData(this.role.deptId);
  },
  // eslint-disable-next-line no-dupe-keys
  watch: {
    receivePatientData: {
      handler(val) {
        console.log(`receivePatientData-change`, val);
        this.defaultMsg = "";
        this.resetData();
        if (val.patientId) {
          this.initOptions();
        }
      },
      immediate: true,
      deep: true
    }
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
    },
    modeNumCode() {
      return this.modeType === "zhuyuan" && this.isHome === "1"
        ? this.homeSickbedsPatient.treatNo
        : this.receivePatientData.visitCode;
    }
  },
  methods: {
    setBlur() {
      document.activeElement.blur()
    },
    async handleDetermine() {
      let { param = {}, activeTab = "" } = this.createInsAndEmr();

      if (!param.typeCode) {
        this.$message.warning("请选择模板");
        return;
      }

      if (!this.patientId) {
        this.$message.warning("请选择患者");
        return;
      }
      // 如果被其他医生接诊 则不创建文书
      const flag = await this.judgeCallVisitInteFace();
      if (!flag) return;

      let paramCheck = {
        docType: param.typeCode,
        enNo: this.modeNumCode
      };

      this.checkQcDependHandle(paramCheck).then(res => {
        if (res) {
          this.$emit("updateEditor", { param, activeTab });
        }
      });
    },
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
      this.typeGroupStr = '';
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
        templateNameLike: this.tempVal,
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
        dnFlag: this.dnFlag,
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
              value: item.templateName,
              label: item.templateCode
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
      // this.$emit("rowDbClick");
      this.handleRowDbClick();
    },
    // 判断是否调用接诊接口
    async judgeCallVisitInteFace() {
      if (
        this.modeType === "menzhen" &&
        this.receivePatientData.recordStatus === "2"
      ) {
        let { hosId = "", orgId = "" } = JSON.parse(getPamars());
        let { deptId = "", deptName = "" } = JSON.parse(getRole());
        let doctorIdStr = getUId();
        let params = {
          visitCode: this.receivePatientData.visitCode,
          patientId: this.patientId,
          patientName: this.receivePatientData.patientName,
          visitType: "1",
          outpDeptId: deptId,
          outpDeptName: deptName,
          diagTime: this.dayjs().format(""),
          doctorId: doctorIdStr,
          doctorName: getUN(),
          isRtnVisit: "1",
          hosId: hosId,
          orgId: orgId,
          freeCode: this.receivePatientData.freeCode,
          haveMoney: this.receivePatientData.haveMoney,
          appointmentId: this.receivePatientData.appointmentId
        };

        try {
          const { code, data, msg = "" } = await receiveVisitRecord(params);
          // 刷新左侧待诊患者列表
          this.$root.eventHub.$emit("refresh-wait-patientList", 'third');
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return true;
      }
    },
    async handleRowDbClick() {
      if (!this.patientId) {
        this.$message.warning("请选择患者");
        return;
      }
      // 如果被其他医生接诊 则不创建文书
      const flag = await this.judgeCallVisitInteFace();
      if (!flag) return;

      let { param = {} } = this.createInsAndEmr();

      let paramCheck = {
        docType: param.typeCode,
        enNo: this.modeNumCode
      };

      this.checkQcDependHandle(paramCheck).then(res => {
        if (res) {
          this.$emit("updateEditor", { param: param });
        }
      });
    },
    checkQcDependHandle(paramCheck) {
      // 检验当前选中文书是否有依赖的文书 先写另外一个
      return (
        checkQcDepend(paramCheck, true)
          // eslint-disable-next-line consistent-return
          .then(res => {
            if (res.code === 1) {
              return true;
            } else if (res.code === 0) {
              // 取toDocTypes 进行查询选择重新选择文书
              if (res.data.continus) {
                return true;
              }
              this.$confirm(`${res.msg}`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  let typeCode = res.data.toDocTypes[0];
                  this.classVal = typeCode;
                  this.tempVal = "";
                  this.queryTemplate();
                })
                .catch(() => {});
            } else {
              this.$message.error(res.msg || "有依赖文书未完成！");
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "检查文书依赖接口异常");
          })
      );
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
        visitTypeList: visitTypeList,
        noDiagViewFlag: '1'
      };
      getHistoryVisitViEn(paId, params)
        .then(res => {
          if (res.code === 1) {
            if (res.data.length === 0) {
              this.initTree();
            }
            this.treatHistoryOptions = res.data.map((item, index) => {
              let codeShowString = item.curMainDiNm
                ? `-${item.curMainDiNm}`
                : "";

              return {
                value: item.enNo,
                label: item.visitingTime + "_" + item.enTpNm + codeShowString + '-' + item.hosNm
              };
            });

            console.log(`this.treatHistoryOptions`, this.treatHistoryOptions);
            if (this.treatHistoryOptions.length > 0) {
              this.$nextTick(() => {
                console.log(`!!!!!!!!!!!!!!!!!!!!`);
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
      console.log(`查询树initTree`, JSON.parse(JSON.stringify(data)));
      getTree(data).then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.addTextAttr(item);
          });
          console.log(res.data)
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
      if (this.activeName === "historyRecord") {
        this.$nextTick(() => {
          this.editorConfigs.initialFrameHeight = document
            .getElementsByClassName("right-editor")[0]
            .getBoundingClientRect().height;
        });
      }
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
    },
    querySearch(queryStr, cb) {
      const results = this.tempOptions.filter(item => item.value.indexOf(queryStr) > -1);
      cb(results)
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

  .tab-contain {
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    /deep/ .el-tabs__content {
      flex: 1;
      .el-tab-pane {
        height: 100%;
        display: flex;
        flex-direction: column;
        .table-list-con {
          flex: 1;
        }
        .table-list-tree {
          flex: 1;
          display: flex;
          flex-direction: row;
          .left-tree {
            width: 280px;
          }
          .right-editor {
            flex: 1;
            border: 1px solid #dcdfe6;
          }
        }
      }
    }
  }

  .table-list {
    padding: 8px;
  }
  .button-contain {
    padding: 8px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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
/deep/ .el-autocomplete-suggestion{
  width: auto!important;
}
</style>
