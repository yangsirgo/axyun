<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      patientCardType="hospital"
      @message="messageHandler"
      :loadListFlag="loadlistflag"
      @send-value="getTemValue"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card class="height100 manage">
          <div class="padding20" style="height: 300px;padding-top: 0;">
            <l-card-title>
              <span slot="left">交接班</span>
            </l-card-title>
            <div class="top">
              <LFormtTitle label="日期" style="width: 280px;">
                <el-date-picker
                  v-model="date"
                  prefix-icon="iconfont iconriqi"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  @change="handleDateChange"
                ></el-date-picker>
              </LFormtTitle>
            </div>
            <div class="top-table" style="margin-top: 12px;">
              <el-table
                :data="shiftsTable.data"
                highlight-current-row
                height="100%"
                border
                v-loading="shiftsLoading"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, index) in shiftsTable.column"
                  :key="index"
                  :label="item.label"
                  :min-width="item.width"
                >
                  <template slot-scope="scope">
                    <div v-if="item.prop == 'operation' && buttonVisibity">
                      <el-button
                        type="primary"
                        v-if="!scope.row.updUserName && scope.row.recUserName"
                        @click="showDetail(scope.row, 0)"
                      >接班</el-button>
                      <el-button
                        type="primary"
                        v-if="!scope.row.updUserName && !scope.row.recUserName"
                        @click="showDetail(scope.row, 1)"
                      >交班</el-button>
                    </div>
                    <div v-else-if="item.prop === 'shifts'">
                      <span v-if="scope.row.recType == 3">夜班</span>
                      <span v-else-if="scope.row.recType == 1">白班</span>
                      <span v-else>晚班</span>
                    </div>
                    <div v-else-if="item.prop == 'updDate'">
                      <span>
                        {{
                        !scope.row.updUserName && scope.row.recUserName
                        ? ""
                        : scope.row[item.prop]
                        }}
                      </span>
                    </div>
                    <div
                      v-else-if="
                        item.prop === 'newHosNum' ||
                          item.prop === 'intoHosNum' ||
                          item.prop === 'outOfHosNum' ||
                          item.prop === 'criticalNum'
                      "
                      @click="handleSelect(item.prop, index)"
                      class="color2"
                    >{{ scope.row[item.prop] }}</div>

                    <div v-else>{{ scope.row[item.prop] }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div
            class="padding20 bottom-box manage"
            :class="{ hasSaveTem: showSaveTem }"
            style="padding-top: 0;"
            v-if="editingAreaShow"
          >
            <div class="left height100 position-relative padding10">
              <!-- <div
                class="overflow-hidden position-absolute"
                style="top: 10px;left:10px;right:10px;z-index: 1000;background: #fff;"
              >
                <el-input
                  class="float-left"
                  v-model="keyWord"
                  style="width: 172px"
                  placeholder="搜索"
                >
                  <i
                    slot="suffix"
                    @click="searchPatient"
                    class="el-input__icon el-icon-search cursor-pointer"
                  ></i>
                </el-input>
                <el-button class="float-right" type="primary" style="width: 65px">添加</el-button>
              </div>-->
              <div class="height100 overflow-scroll-vertical">
                <el-collapse
                  v-loading="loadingPatient"
                  v-model="activeNames"
                  style="height: auto;"
                  accordion
                  @change="getPatientList"
                >
                  <el-collapse-item
                    v-for="(item, index) in collapseConfig"
                    :key="index"
                    :name="item.activeName"
                  >
                    <template slot="title">
                      <i
                        :class="
                          activeNames.includes(item.activeName)
                            ? 'head-icon-active el-icon-caret-bottom head-icon'
                            : 'el-icon-caret-bottom head-icon'
                        "
                      ></i>
                      <el-checkbox
                        class="margin-right-6 margin-left-6"
                        v-model="item.isSelectAll"
                        :disabled="currentStatus == 0 ? true : false"
                        @change="selectAll(item, index)"
                      ></el-checkbox>
                      {{ item.name }}({{ item.patientNum }})
                    </template>
                    <div
                      v-for="(val, i) in item.list"
                      :key="`a${i}`"
                      style="padding-left: 20px;line-height: 32px;"
                    >
                      <el-checkbox
                        class="margin-right-6 margin-left-6"
                        v-model="val.isSelect"
                        :disabled="currentStatus == 0 ? true : false"
                        @change="selectItem(item, val)"
                      >
                        {{ `${val.bedCode}床 ${val.patientName}` }}
                        <span
                          class="black em"
                          :val="val.patientGender"
                          code="GENDER_CODE"
                          v-codeTransform
                        ></span>
                        {{ `${val.remark}` }}
                      </el-checkbox>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="right rightCont height100 position-relative">
              <div class="position-absolute save-btn">
                <el-button type="primary" @click="saveTemHandler">保存为模板</el-button>
                <el-button type="primary" v-if="currentStatus == 0" @click="saveData">保存并接班</el-button>
                <el-button type="primary" v-else @click="saveData">保存并交班</el-button>
              </div>
              <div class="height100" style="overflow-y: auto;padding-bottom: 80px;">
                <l-card-title>
                  <span slot="left">交班内容总览</span>
                </l-card-title>
                <div>
                  <el-input
                    type="textarea"
                    style="height: 50px;"
                    resize="none"
                    :disabled="currentStatus == 0 ? true : false"
                    :autosize="{ minRows: 2, maxRows: 2 }"
                    placeholder="请输入内容"
                    v-model="specialInstructions"
                  ></el-input>
                </div>
                <l-card-title>
                  <span slot="left">交接患者</span>
                </l-card-title>
                <div class="bottom-table">
                  <el-table
                    :data="patientsListTable.data"
                    border
                    stripe
                    style="width: 100%"
                    @row-click="rowClick"
                  >
                    <el-table-column
                      v-for="(item, index) in patientsListTable.column"
                      :key="index"
                      :label="item.label"
                      :min-width="item.width"
                    >
                      <template slot-scope="scope">
                        <div v-if="item.prop === 'patient'">
                          {{ scope.row.patientName }}
                          <span
                            :val="scope.row.patientGender"
                            code="GENDER_CODE"
                            v-codeTransform
                          ></span>
                          {{ scope.row.remark }}
                        </div>
                        <div style="padding: 10px 0" v-else-if="item.prop === 'recContent'">
                          <el-input
                            type="textarea"
                            :rows="2"
                            resize="none"
                            :disabled="currentStatus != 1"
                            placeholder="请输入内容"
                            v-model="scope.row[item.prop]"
                          ></el-input>
                        </div>
                        <div style="padding: 10px 0" v-else-if="item.prop === 'updContent'">
                          <el-input
                            type="textarea"
                            :rows="2"
                            resize="none"
                            :disabled="currentStatus != 0"
                            placeholder="请输入内容"
                            v-model="scope.row[item.prop]"
                          ></el-input>
                        </div>
                        <div
                          v-else
                          :class="item.prop === 'hosNum' ? 'color2' : ''"
                        >{{ scope.row[item.prop] }}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <div class="temBox" v-if="showSaveTem">
            <l-card-title>
              <template #left>
                <div>存为模板</div>
              </template>
            </l-card-title>
            <el-form
              :model="temForm"
              :rules="temRules"
              ref="temForm"
              label-width="0"
              class="demo-ruleForm"
            >
              <el-row :gutter="10">
                <el-col :span="8">
                  <l-formt-title label="模板类型" :required="true">
                    <el-form-item prop="recTYpe">
                      <el-select v-model="temForm.recTYpe" placeholder="请选择">
                        <el-option
                          v-for="item in recObj"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </l-formt-title>
                </el-col>
                <el-col :span="8">
                  <l-formt-title label="内容类型" :required="true">
                    <el-form-item prop="contentRange">
                      <el-select v-model="temForm.contentRange" placeholder="请选择">
                        <el-option
                          v-for="item in contentObj"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </l-formt-title>
                </el-col>
                <el-col :span="8">
                  <l-formt-title label="模板名称" :required="true">
                    <el-form-item prop="templateName">
                      <el-input v-model="temForm.templateName"></el-input>
                    </el-form-item>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <l-formt-title label="内容" :required="true">
                    <el-form-item prop="templateValue">
                      <el-input v-model="temForm.templateValue"></el-input>
                    </el-form-item>
                  </l-formt-title>
                </el-col>
              </el-row>
            </el-form>
            <div class="bottom-handler">
              <el-button type="primary" @click="saveTem">保存</el-button>
              <el-button @click="closeSaveTem" type="primary" plain>关闭</el-button>
            </div>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LeftBar from "../../components/nursingLeftBar";
import {
  fetchShiftsMessage,
  fetchShiftsDetail,
  fetchPatientMessage,
  handOverShifts,
  succession,
  addTemp
} from "@/api/ipnw/nursing";
import base64 from "@/utils/base64.js";

export default {
  name: "changeShifts", // 交接班
  components: {
    LeftBar
  },
  data() {
    return {
      currentStatus: 0, // 当前状态 0 接班 1 交班
      recType: 1, // 1： 白班 2： 晚班 3： 夜班
      editingAreaShow: false, // 下方编辑区域显示
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      toolBoxs: ["handoverTem"],
      shiftsLoading: false, // 交接班总览 加载状态
      activeNames: "",
      keyWord: "", // 搜索患者关键词
      specialInstructions: "", // 交班内容总览
      loadingPatient: false, // 请求患者列表状态
      collapseConfig: [
        {
          activeName: "1",
          name: "在院患者",
          status: 0,
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        },
        {
          activeName: "2",
          name: "今日入院",
          status: 2,
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        },
        {
          activeName: "3",
          name: "转科",
          status: 6,
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        },
        {
          activeName: "5",
          name: "撤床",
          status: 3,
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        },
        {
          activeName: "6",
          name: "手术",
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        },
        {
          activeName: "7",
          name: "危重",
          status: 9,
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        },
        {
          activeName: "8",
          name: "会诊",
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        },
        {
          activeName: "9",
          name: "输血",
          isSelectAll: false,
          fromDate: "",
          toDate: "",
          patientNum: 0,
          list: []
        }
      ],
      currentShiftsId: "", // 当前所选 交接班 班次ID
      /*
       * 交接管理
       * */
      date: new Date().format("yyyy-MM-dd"), // 默认当天
      buttonVisibity: true,
      shiftsTable: {
        column: [
          {
            prop: "shifts",
            label: "班次",
            width: 60
          },
          {
            prop: "newHosNum",
            label: "新入院",
            width: 80
          },
          {
            prop: "intoHosNum",
            label: "转入",
            width: 80
          },
          {
            prop: "outOfHosNum",
            label: "撤床",
            width: 80
          },
          {
            prop: "criticalNum",
            label: "危重",
            width: 80
          },
          {
            prop: "recDate",
            label: "交接起",
            width: 80
          },
          {
            prop: "updDate",
            label: "交接止",
            width: 80
          },
          {
            prop: "recUserName",
            label: "交班人",
            width: 80
          },
          {
            prop: "updUserName",
            label: "接班人",
            width: 80
          },
          {
            prop: "operation",
            label: "交接班",
            width: 100
          }
        ],
        data: []
      },
      patientsListTable: {
        column: [
          {
            prop: "bedCode",
            label: "床号",
            width: 80
          },
          {
            prop: "inpCode",
            label: "住院号",
            width: 120
          },
          {
            prop: "patient",
            label: "患者",
            width: 150
          },
          {
            prop: "admissionDiag",
            label: "主诊断",
            width: 80
          },
          {
            prop: "manageDoctorName",
            label: "主管医生",
            width: 80
          },
          {
            prop: "manageNurseName",
            label: "责任护士",
            width: 80
          },
          {
            prop: "recContent",
            label: "交班内容",
            width: 180
          },
          {
            prop: "updContent",
            label: "接班内容",
            width: 180
          }
        ],
        data: []
      },
      showSaveTem: false,
      recObj: [
        {
          label: "个人",
          value: "1"
        },
        {
          label: "科室",
          value: "2"
        }
      ],
      contentObj: [
        {
          label: "总览",
          value: "1"
        },
        {
          label: "交班",
          value: "2"
        },
        {
          label: "接班",
          value: "3"
        }
      ],
      temForm: {
        recTYpe: "",
        contentRange: "",
        templateName: "",
        templateValue: ""
      },
      temRules: {
        recTYpe: [
          { required: true, message: "请选择模板类型", trigger: "change" }
        ],
        contentRange: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ],
        templateValue: [
          { required: true, message: "请输入模板内容", trigger: "blur" }
        ]
      },
      // 刷新工具线模板
      loadlistflag: false,
      // 当前选择需要引用的列
      curIn: ""
    };
  },
  computed: {
    ...mapGetters(["role", "name"])
  },
  created() {
    this.getAllShiftsMessage();
  },
  methods: {
    messageHandler(val) {
      // 工具箱回调函数
    },
    handleDateChange() {
      // 选择日期
      this.editingAreaShow = false;
      this.activeNames = "";
      let nowDate = new Date();
      if (
        this.date < nowDate.format("yyyy-MM-dd") ||
        this.date >
          new Date(nowDate.setDate(nowDate.getDate() + 1)).format("yyyy-MM-dd")
      ) {
        this.buttonVisibity = false;
      } else {
        this.buttonVisibity = true;
      }
      this.getAllShiftsMessage();
    },
    showDetail(obj, type) {
      this.collapseConfig.map(item => {
        switch (item.status) {
          case 0:
            item.patientNum = obj.inHosNum;
            item.fromDate = obj.fromDate;
            item.toDate = obj.toDate;
            break;
          case 2:
            item.patientNum = obj.newHosNum;
            item.fromDate = obj.fromDate;
            item.toDate = obj.toDate;
            break;
          case 3:
            item.patientNum = obj.outOfHosNum;
            item.fromDate = obj.fromDate;
            item.toDate = obj.toDate;
            break;
          case 6:
            item.patientNum = obj.intoHosNum;
            item.fromDate = obj.fromDate;
            item.toDate = obj.toDate;
            break;
          case 9:
            item.patientNum = obj.criticalNum;
            item.fromDate = obj.fromDate;
            item.toDate = obj.toDate;
            break;
        }
      });
      this.currentStatus = type;
      this.recType = obj.recType;
      this.editingAreaShow = true;
      this.specialInstructions = obj.specialInstructions;
      if (this.currentStatus == 0) {
        this.recId = obj.recId;
        fetchShiftsDetail({
          recId: obj.recId
        })
          .then(res => {
            let { code, data, msg } = res;
            if (code == 1) {
              data = data.map(v => {
                return Object.assign(v, {
                  bedCode: v.roomNameBedNo,
                  admissionDiag: v.diagName,
                  updContent: ""
                });
              });
              this.patientsListTable.data = data;
            } else {
              this.$message.error(msg);
            }
          })
          .catch(e => {
            this.$message.error("网络错误！");
          });
      }
    },
    getPatientList(activeName) {
      if (this.activeNames == "") {
        return;
      }
      this.loadingPatient = true;
      let item = this.collapseConfig.filter(
        val => val.activeName == activeName
      );
      if (item[0].patientNum == 0) {
        this.loadingPatient = false;
        return;
      }
      let params = {
        recordStatus: item[0].status,
        fromDate: item[0].fromDate,
        toDate: item[0].toDate
      };
      fetchPatientMessage(params)
        .then(res => {
          let { code, data, msg } = res;
          if (code === 1) {
            this.collapseConfig.forEach(val => {
              if (val.status === item[0].status) {
                data = data.map(t => {
                  return Object.assign(t, { isSelect: false });
                });
                val.list = data;
              }
            });
          } else {
            this.$message.error(msg);
          }
          this.loadingPatient = false;
        })
        .catch(e => {
          this.loadingPatient = false;
        });
    },
    getAllShiftsMessage() {
      // 查询新入院，撤床人数等及交接班信息接口
      this.shiftsLoading = true;
      fetchShiftsMessage({
        date: this.date,
        type: 0
      }).then(res => {
        let { code, data, msg } = res;
        if (code === 1) {
          this.shiftsLoading = false;
          let arr = [];
          this.shiftsTable.data = data.map(item => {
            if (item.recUserName && item.updUserName) {
              return Object.assign(item, { add: false });
            } else {
              return Object.assign(item, { add: true });
            }
          });
          // this.$set(this.shiftsTable, 'data', arr)
        } else {
          this.shiftsLoading = false;
          this.$message.error(msg);
        }
      });
    },
    getDetailByShiftsId(id) {
      this.currentShiftsId = id;
    },
    selectItem(val, childVal) {
      this.checkAll(val);
    },
    selectAll(val, index) {
      val.list.map(item => {
        item.isSelect = val.isSelectAll;
      });
      this.checkAll(val);
    },
    checkAll(item, index) {
      // 检测是否全选
      let isAll = true;
      item.list.map(val => {
        if (!val.isSelect) {
          isAll = false;
        }
      });
      item.isSelectAll = isAll;
      this.checkData();
    },
    checkData() {
      // 将选中患者 移入右侧编辑列表
      let data = [];
      this.collapseConfig.map(v => {
        if (v.isSelectAll) {
          data = data.concat(v.list);
        } else {
          v.list.map(t => {
            if (t.isSelect) data.push(t);
          });
        }
      });
      this.patientsListTable.data = data;
    },
    async saveData() {
      if (this.currentStatus == 1) {
        // 交班
        let params = {
          type: this.recType,
          reliefRecordPO: {
            wardId: this.role.deptId,
            recDate: this.date,
            specialInstructions: this.specialInstructions
          },
          reliefRecordDetailPO: []
        };
        let list = this.patientsListTable.data.map(item => {
          if (item.isSelect) {
            let obj = {
              patientId: item.patientId,
              inpCode: item.inpCode,
              patientName: item.patientName,
              diagCode: item.admissionDiagCode,
              diagName: item.admissionDiag,
              roomNameBedNo: item.bedCode,
              manageDoctorName: item.manageDoctorName,
              manageDoctorId: item.manageDoctorId,
              manageNurseName: item.manageNurseName,
              manageNurseId: item.manageNurseId,
              recContent: item.recContent,
              updContent: item.updContent
            };
            params.reliefRecordDetailPO.push(obj);
          }
        });
        handOverShifts(params)
          .then(res => {
            let { code, msg } = res;
            if (code == 1) {
              this.$message.success(msg);
              this.editingAreaShow = false;
              this.activeNames = "";
              this.patientsListTable.data = [];
              this.specialInstructions = "";
              this.getAllShiftsMessage();
            } else {
              this.$message.success(msg);
            }
          })
          .catch(e => {
            this.$message.error("网络错误！");
          });
      } else {
        // 接班
        let params = {
          type: this.recType,
          recId: this.recId,
          reliefRecordDetailPO: this.patientsListTable.data
        };
        succession(params)
          .then(res => {
            let { code, msg } = res;
            if (code == 1) {
              this.$message.success(msg);
              this.editingAreaShow = false;
              this.activeNames = "";
              this.specialInstructions = "";
              this.patientsListTable.data = [];
              this.getAllShiftsMessage();
            } else {
              this.$message.success(msg);
            }
          })
          .catch(e => {
            this.$message.error("网络错误！");
          });
      }
    },
    refeshPage() {},
    toolBoxMessage(moduleName, data) {
      if (moduleName != "PreviousPrescriptions") {
        return;
      }
    },
    /*
     * 交接管理
     * */
    handleSelect(prop, index) {
      // 选择左侧新入院、转入、撤床、危重
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.add) {
        if (columnIndex === 1) {
          return [1, 10];
        } else if (columnIndex > 1) {
          return [0, 0];
        }
      }
    },
    saveTemHandler() {
      this.showSaveTem = true;
    },
    // 保存模板
    saveTem() {
      this.$refs.temForm.validate(valid => {
        if (valid) {
          this.$showLoading();
          addTemp({
            ...this.temForm,
            operatorId: this.role.userId,
            operatorName: base64.decode(this.name),
            deptId: this.role.deptId
          })
            .then(res => {
              if (res.code === 1) {
                this.$message.success("保存模板成功");
                this.loadlistflag = !this.loadlistflag;
                this.closeSaveTem();
              } else {
                this.$message.error(res.msg || "保存模板失败");
              }
              this.$hideLoading();
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存模板失败");
            });
        }
      });
    },
    // 关闭保存为模板
    closeSaveTem() {
      this.showSaveTem = false;
      this.$refs.temForm.resetFields();
    },
    // 获取引用的内容
    getTemValue(val, type) {
      if (type !== "1" && !this.curIn) {
        this.$message.warning("请选择要引用的交接患者");
        return;
      }
      if (type === "1" && this.currentStatus !== 0) {
        this.specialInstructions = val;
      }
      for (let i = 0; i < this.patientsListTable.data.length; i++) {
        let item = this.patientsListTable.data[i];
        if (item.patientId === this.curIn) {
          if (this.currentStatus === 1 && type === "2") {
            this.$set(this.patientsListTable.data, i, {
              ...item,
              recContent: val
            });
          } else if (this.currentStatus === 0 && type === "3") {
            console.log(val);
            this.$set(this.patientsListTable.data, i, {
              ...item,
              updContent: val
            });
          }
          break;
        }
      }
    },
    rowClick(row) {
      this.curIn = row.patientId;
    }
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {},
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
/*.main-content{*/
/*height: calc(100% - 50px);*/
/*}*/
/deep/ .el-collapse-item__content {
  padding-right: 10px;
}
/deep/ .el-collapse-item__arrow {
  display: none;
}
/deep/ .el-tabs__content {
  height: calc(100% - 60px);
}

.head-icon {
  transition: all 0.5s;
  transform: rotate(-90deg);
}
.head-icon-active {
  transform: rotate(0deg);
}
.save-btn {
  right: 10px;
  bottom: -10px;
  left: 20px;
  background: $l-color-white;
  text-align: right;
  z-index: 1000;
}
.color2 {
  color: $l-color-fontcolor-2;
}
.left {
  float: left;
  height: 100%;
  overflow-y: auto;
  width: 267px;
  border: 1px solid $l-color-bgcolor-11;
  /*transition: all 0.3s;*/
}
.bottom-box {
  .label {
    margin-right: 10px;
    color: $l-color-fontcolor-4;
  }
}
.top-table {
  height: 167px;
}
.bottom-table {
  height: calc(100% - 160px);
}
.bottom-box {
  height: calc(100% - 300px);
}
.rightCont {
  margin-left: 287px;
  padding-top: 0;
  padding-bottom: 40px;
}
.hasSaveTem {
  height: calc(100% - 450px);
}
.temBox {
  height: 150px;
  padding: 20px;
  padding-top: 0;
  overflow: auto;
  border-top: 1px solid $l-color-bgcolor-11;
  .el-select {
    width: 100%;
  }
  .l-input-wrap {
    margin-bottom: 20px;
  }
}
.bottom-handler {
  text-align: right;
}
</style>
