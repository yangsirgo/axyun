<template>
  <div class="critical">
    <div class="allergy-list">
      <l-card-title class="patient-info" v-show="receivePatientData.patientName">
        <div slot="left" class="info-box">
          {{ receivePatientData.patientName }}&nbsp;
          <span
            code="GENDER_CODE"
            :val="receivePatientData.patientGender"
            v-codeTransform
          ></span>
          &nbsp;
          <span v-if="receivePatientData.age">{{ receivePatientData.age }}岁</span>
          <span v-else-if="receivePatientData.patientAge">
            {{
            receivePatientData.patientAge
            }}
          </span>
          &nbsp;危急值情况
        </div>
      </l-card-title>
      <l-card-title class="patient-info" v-if="!receivePatientData.patientName">
        <div slot="left" class="info-box">
          <span style="padding: 0 5px">姓名</span>
          <span style="padding: 0 5px">性别</span>
          <span style="padding: 0 5px">年龄</span>
        </div>
      </l-card-title>
      <div class="patient-tree" v-loading="loading">
        <el-menu
          :default-openeds="defaultOpen"
          :default-active="defaultActive"
          :unique-opened="true"
          class="el-menu-vertical-demo type-list-menu"
        >
          <el-submenu v-for="(tab, index) in list" :index="'' + index" :key="index">
            <template slot="title">
              <i class="filter-item iconfont icondaohangxialajiantou"></i>
              <span>{{ tab.title }}</span>
              <span>({{ tab.children.length }})</span>
            </template>
            <el-menu-item
              v-for="(it, index2) in tab.children"
              :key="it.id"
              :index="`${index}-${index2}`"
              @click="loadDetail(it)"
            >{{ `${it.itemName}(${it.result})` }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="allergy-form">
      <l-card-title class="margin-bottom8">
        <div slot="left" class="report-cont-title">危急值处理</div>
      </l-card-title>
      <div class="allergy-form-scroll">
        <div class="report-sub-title">患者信息</div>
        <div class="patient-info">
          <div class="patient-item" v-if="hosType == '1'">
            <span>门诊号</span>
            <em>{{ receivePatientData.visitCode || "--" }}</em>
          </div>
          <div class="patient-item" v-else-if="hosType == '3'">
            <span>住院号</span>
            <em>{{ receivePatientData.inpCode || "--" }}</em>
          </div>
          <div class="patient-item">
            <span>患者</span>
            <em>{{ receivePatientData.patientName || "--" }}</em>
          </div>
          <div class="patient-item">
            <span>性别</span>
            <em code="GENDER_CODE" :val="receivePatientData.patientGender" v-codeTransform>--</em>
          </div>
          <div class="patient-item">
            <span>年龄</span>
            <em v-if="receivePatientData.age">{{ receivePatientData.age }}岁</em>
            <em v-else-if="receivePatientData.patientAge">
              {{
              receivePatientData.patientAge || "--"
              }}
            </em>
            <em v-else>--</em>
          </div>

          <template v-if="hosType == '1'">
            <div class="patient-item">
              <span>当前科室</span>
              <em
                v-show="receivePatientData.patientId"
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: receivePatientData.ouptDeptId
                }"
                columns="org_nm"
                v-tableTransform
              >--</em>
              <em v-show="!receivePatientData.patientId">--</em>
            </div>
          </template>
          <template v-else-if="hosType == '3'">
            <div class="patient-item">
              <span>床号</span>
              <em>
                {{
                receivePatientData.bedCode
                ? receivePatientData.bedCode + "床"
                : "--"
                }}
              </em>
            </div>
            <div class="patient-item">
              <span>当前科室</span>
              <em
                v-show="receivePatientData.patientId"
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: receivePatientData.admissionSdeptId
                }"
                columns="org_nm"
                v-tableTransform
              >--</em>
              <em v-show="!receivePatientData.patientId">--</em>
            </div>
          </template>

          <div class="patient-item">
            <span>主诊断</span>
            <em>{{ (topDiagInfo && topDiagInfo.diagName) || "--" }}</em>
          </div>
        </div>
        <div class="report-sub-title">危急值信息</div>
        <el-table class="margin-bottom8" :data="wjzData" border stripe>
          <!-- 业务列 -->
          <el-table-column
            v-for="(item, index) in wjzParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <template v-if="item.prop === 't2'">
                <span>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop === 't3'">
                <span>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="report-sub-title">历史处理记录</div>
        <el-table class="margin-bottom8" :data="hisData" v-loading="hisLoad" border stripe>
          <!-- 业务列 -->
          <el-table-column
            v-for="(item, index) in hisParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <template>
                <span v-if="item.prop === 'replyType'">
                  {{
                  criType[scope.row[item.prop]]
                  }}
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <template v-if="role.nurseId">
          <l-card-title>
            <div slot="left" class="report-cont-title">已通知医生列表</div>
          </l-card-title>
          <el-table class="margin-bottom8" :data="notifyTableData" v-loading="hisLoad" border>
            <!-- 业务列 -->
            <el-table-column
              v-for="(item, index) in notifyTableHead"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              :align="item.align || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <!-- 可自定义内容 -->
                <template>
                  <span v-if="item.prop === 'replyType'">
                    {{
                    criType[scope.row[item.prop]]
                    }}
                  </span>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="report-sub-title">危急值处理</div>
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
          v-if="true"
        >
          <el-form-item prop="replyType">
            <span class="allergy-form-title">
              处理类型
              <em class="required-txt">*</em>
            </span>
            <el-radio v-model="form.replyType" label="1">处理</el-radio>
            <el-radio v-model="form.replyType" label="2">不处理</el-radio>
          </el-form-item>
          <el-form-item prop="replyWay">
            <el-row>
              <!-- <el-button class="float-right">引用</el-button> -->
              <div class="form-item-left">
                <l-formt-title :required="true" label="处理意见">
                  <el-input v-model="form.replyWay" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </div>
            </el-row>
          </el-form-item>
          <el-form-item prop="replyResult">
            <div class="form-item-left">
              <l-formt-title :required="true" label="处理后结果">
                <el-input v-model="form.replyResult" placeholder="请输入内容"></el-input>
              </l-formt-title>
            </div>
          </el-form-item>
        </el-form>
        <el-form
          :model="nurseForm"
          :rules="nurseRules"
          ref="nurseRuleForm"
          label-width="0"
          class="demo-ruleForm"
          v-else
        >
          <el-form-item prop="list">
            <l-formt-title :required="true" label="选择通知医生">
              <el-select v-model="nurseForm.list" multiple placeholder="请选择">
                <el-option
                  v-for="item in cDoctor"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <!--  <l-value-domain :multiple="rue"></l-value-domain> -->
            </l-formt-title>
          </el-form-item>
        </el-form>
      </div>
      <div class="allergy-form-btn">
        <el-button
          type="primary"
          :loading="submitLoad"
          @click="submit"
          v-hotKey="{ func: 'func_submit', flag: 'submitLoad' }"
        >确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getUId, getUN } from "@/utils/crypto";
import {
  getTree,
  getCriDetail,
  submitForm,
  assayHaveRead,
  examHaveRead,
  getDiagName,
} from "@/api/criticalValue/index.js";
import Base64 from "@/utils/base64.js";
import { getPamars } from "@/utils/auth";
export default {
  props: {
    // 危急值类型
    checkType: String,
    hosType: String,
  },
  computed: {
    // 病患信息
    ...mapGetters("base", ["receivePatientData"]),
    // 登录用户信息
    ...mapGetters("user", ["name", "role"]),
    cvType() {
      return this.checkType;
    },
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.loadData();
        this.getTopDiagInfo();
      },
    },
    checkType: {
      deep: true,
      immediate: true,
      handler(val) {
        this.loadData();
      },
    },
  },
  data() {
    return {
      // 患者信息
      info: {},
      // 左侧列表loading
      loading: false,
      list: [
        { title: "未读", type: "1", children: [] },
        { title: "已读", type: "2", children: [] },
        { title: "已处理", type: "3", children: [] },
      ],
      // 默认展开的列表
      defaultOpen: [],
      // 列表默认选中项
      defaultActive: "",
      // 危急值信息表头
      wjzParams: [
        {
          prop: "executeDeptName",
          label: "执行科室",
          fixed: "left",
        },
        {
          prop: "itemName",
          label: "项目",
          fixed: "left",
        },
        {
          prop: "t3",
          label: "测定结果",
        },
        {
          prop: "assayUnit",
          label: "单位",
        },
        {
          prop: "result",
          label: "结果",
        },
        {
          prop: "referenceValue",
          label: "参考范围",
        },
        {
          prop: "reportDate",
          label: "报告时间",
        },
        {
          prop: "applyDeptName",
          label: "申请科室",
        },
        {
          prop: "applyDoctorName",
          label: "申请人",
        },
      ],
      // 危急值信息表格数据
      wjzData: [],
      // 历史处理次数loading
      hisLoad: false,
      // 历史处理次数表头
      hisParams: [
        {
          prop: "replyType",
          label: "处理类型",
        },
        {
          prop: "replyWay",
          label: "处理方式",
        },
        {
          prop: "replyDoctorDate",
          label: "操作时间",
        },
        {
          prop: "replyDoctorName",
          label: "操作人",
        },
      ],
      // 历史处理次数表格数据
      hisData: [],
      // 危急值处理表单数据
      form: {
        replyType: "",
        replyWay: "",
        replyResult: "",
      },
      // 危急值处理表单验证
      rules: {
        replyType: [{ required: true, message: "请选择", trigger: "change" }],
        replyWay: [{ required: true, message: "请输入", trigger: "blur" }],
        replyResult: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      // 危急值处理类型
      criType: {
        "1": "处理",
        "2": "不处理",
      },
      // 危急值处理状态
      readType: {
        "1": "未读",
        "2": "已读",
        "3": "已处理",
      },
      // 当前选中危急值的信息
      activeCri: {},
      // 提交表单loading
      submitLoad: false,
      notifyTableHead: [
        {
          prop: "t1",
          label: "医生",
        },
        {
          prop: "t2",
          lable: "状态",
        },
        {
          prop: "t3",
          label: "报告时间",
        },
        {
          prop: "t4",
          lable: "通知人",
        },
      ],
      notifyTableData: [],
      // 医生列表
      cDoctor: [
        {
          label: "张医生",
          value: "1",
        },
        {
          label: "李医生",
          value: "2",
        },
      ],
      nurseForm: {
        list: [],
      },
      nurseRules: {
        list: [
          {
            type: "array",
            required: true,
            message: "请选择通知医生",
            trggier: "change",
          },
        ],
      },
      processed: [],
      workTypeKey: "",
      topDiagInfo: {
        diagName: "",
      },
    };
  },
  created() {
    const work = JSON.parse(getPamars()).workType;
    const workType = Base64.decode(work);
    if (workType === "1") {
      this.workTypeKey = "crisisValueDoctorHandle";
    } else if (workType === "2") {
      this.workTypeKey = "crisisValueNurseHandle";
    }
  },
  methods: {
    // 获取左侧树
    loadData() {
      if (!this.receivePatientData.patientId) {
        return;
      }
      this.loading = true;
      getTree({
        type: "3",
        patientId: this.receivePatientData.patientId,
      })
        .then((res) => {
          if (res.code === 1) {
            if (res.data) {
              const dataObj = {
                "1": [],
                "2": [],
                "3": [],
              };
              res.data.forEach((element) => {
                if (dataObj[element[this.workTypeKey]]) {
                  dataObj[element[this.workTypeKey]].push(element);
                }
              });
              const arr = this.list.map((item) => {
                return {
                  ...item,
                  children: dataObj[item.type],
                };
              });
              this.list = arr;
              let index1 = -1;
              for (let i = 0; i < this.list.length; i++) {
                const item = this.list[i];
                index1 += 1;
                if (item.children.length > 0) {
                  this.loadDetail(item.children[0]);
                  this.activeCri = item.children[0];
                  this.defaultOpen = [`${index1}`];
                  this.defaultActive = `${index1}-0`;
                  break;
                }
              }
            }
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    // 获取诊断信息
    getTopDiagInfo() {
      if (!this.receivePatientData.patientId) {
        return;
      }
      let paramsCode = {};
      if (this.hosType === "1") {
        paramsCode.visitCode = this.receivePatientData.visitCode;
      } else if (this.hosType === "3") {
        paramsCode.inpCode = this.receivePatientData.inpCode;
      }
      getDiagName({
        patientId: this.receivePatientData.patientId,
        ...paramsCode,
      }).then((res) => {
        if (res.code == 1) {
          const curDiag = res.data.find((item) => item.diagMain == "1");
          this.topDiagInfo = curDiag;
        }
      });
    },
    // 获取右侧数据
    loadDetail(data) {
      if (data.crisisvalueId !== this.activeCri.crisisvalueId) {
        this.activeCri = data;
        this.wjzData = [data];
        this.loadHisTable(data.crisisvalueId);
        this.setRead(data);
      }
    },
    // 点击未读的请求接口标记为已读
    setRead(data) {
      if (data[this.workTypeKey] !== "1") {
        return;
      }
      let flag = this.processed.some(
        (item) => data.crisisvalueId === item.crisisvalueId
      );
      const subData = { ...data };
      // 标记已读
      subData[this.workTypeKey] = "2";
      if (!flag) {
        if (data.type === "1") {
          examHaveRead(subData).then((res) => {
            if (res.code === 1) {
              this.processed.push(data);
            }
          });
        } else if (data.type === "2") {
          assayHaveRead(subData).then((res) => {
            if (res.code === 1) {
              this.processed.push(data);
            }
          });
        }
      }
    },
    // 获取历史处理次数表格数据
    loadHisTable(id) {
      this.hisLoad = true;
      getCriDetail({
        crisisvalueId: id,
      })
        .then((res) => {
          if (res.code === 1) {
            this.hisData = res.data;
          }
          this.hisLoad = false;
        })
        .catch((err) => {
          this.hisLoad = false;
          this.$message.error(err);
        });
    },
    // 医生提交
    submitDoctor() {
      if (!this.activeCri.crisisvalueId) {
        this.$message.warning("请选择要处理的危急值!");
        return;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitLoad = true;
          const od = { ...this.activeCri };
          // 标记已处理
          od[this.workTypeKey] = "3";
          submitForm({
            ...this.form,
            ...{ crisisvalueType: this.activeCri.examResultId ? "1" : "2" },
            // crisisvalueId: this.activeCri.crisisvalueId,
            replyDoctorId: this.role.userId,
            replyDoctorName: this.name,
            examCrisisvaluePo: od,
            crisisvalueId: od.crisisvalueId,
            itemName: od.itemName,
            executeDeptName: od.executeDeptName,
            result: od.result,
          })
            .then((res) => {
              if (res.code === 1) {
                this.loadData();
                this.$refs.ruleForm.resetFields();
                this.$message.success("处理成功！");
              } else {
                this.$message.error(res.msg || "处理失败");
              }
              this.submitLoad = false;
            })
            .catch((err) => {
              this.submitLoad = false;
              this.$message.error(err || "处理失败");
            });
        }
      });
    },
    // 护士提交
    // 提交
    submitNurse() {
      this.$refs.nurseRuleForm.validate((valid) => {
        if (valid) {
        }
      });
    },
    submit() {
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择一个患者");
        return;
      }
      this.submitDoctor();
    },
  },
};
</script>

<style lang="scss" scoped>
.critical {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $l-color-white;
  .his-red {
    color: $l-color-fontcolor-5;
  }
}
.content {
  overflow-y: auto;
}
.allergy-list {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 287px;
  height: 100%;
  border-right: 1px solid $l-color-bgcolor-11;
  padding: 16px;
  .cardtitle {
    margin-bottom: 8px;
  }
  .patient-info {
    /deep/ .titleleft {
      float: none;
      .info-box {
        float: none;
        margin-left: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .patient-tree {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
  }
  /deep/ .el-submenu__title {
    position: relative;
    margin-bottom: 1px;
  }
  .type-menu-num {
    position: absolute;
    right: 8px;
    top: 50%;
    width: 18px;
    height: 18px;
    line-height: 18px;
    margin-top: -9px;
    border-radius: 50%;
    background-color: $l-color-primary;
    color: $l-color-white;
    text-align: center;
  }
  /deep/ .el-submenu__title {
    height: 44px;
    line-height: 44px;
  }
}
.type-list-menu {
  border-right: 0;
  /deep/ .el-submenu__title {
    background-color: $l-color-bgcolor-14;
    .el-submenu__icon-arrow {
      display: none;
    }
    .type-menu-num {
      margin-left: 10px;
    }
  }
  /deep/ .el-submenu {
    margin-bottom: 1px;
    .iconfont {
      display: inline-block;
    }
    .filter-item {
      font-size: 12px;
      color: $l-color-fontcolor-3;
    }
    &.is-opened > .el-submenu__title {
      .iconfont {
        transform: rotate(90deg);
      }
      span {
        font-weight: $l-font-weight;
      }
    }
  }
  /deep/ .el-menu-item.is-active {
    background-color: $l-color-bgcolor-12;
  }
  /deep/ .el-badge__content.is-fixed.is-dot {
    top: 10px;
  }
}
.report-top-title {
  font-size: 20px;
  text-align: center;
}
.allergy-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  width: 0;
  .allergy-form-scroll {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    .cardtitle {
      margin-bottom: 20px;
    }
  }
  .bdrtop {
    border-top: 1px solid $l-color-bgcolor-11;
    margin: 20px 0;
  }
  .allergy-form-col {
    .allergy-form-item {
      float: left;
      width: 49%;

      &:first-child {
        margin-right: 2%;
      }

      &.long {
        width: 100%;
        margin-right: 0;
      }
    }
  }

  /deep/ .allergy-date {
    .el-input__inner {
      padding-left: 30px;
    }
  }
  .allergy-form-btn {
    padding-top: 16px;
    border-top: 1px solid $l-color-bgcolor-11;
    text-align: right;
  }
  .allergy-form-title {
    display: inline-block;
    margin-right: 10px;
    color: $l-color-fontcolor-4;
  }
  .el-form-item--medium .el-form-item__content {
    height: 36px;
  }
  .patient-info {
    .patient-item {
      display: inline-block;
      margin-right: 50px;
      margin-bottom: 8px;
      &:last-child {
        margin-right: 0;
      }
      span {
        color: $l-color-fontcolor-4;
      }
      em {
        font-style: normal;
        color: $l-color-fontcolor-3;
      }
    }
  }
  .allergy-form-title {
    display: inline-block;
    margin-right: 10px;
    color: $l-color-fontcolor-4;
  }

  .form-item-left {
    margin-right: 0;
  }
  .required-txt {
    font-size: 14px;
    font-style: normal;

    vertical-align: middle;
    font-weight: bolder;
    color: $l-color-fontcolor-5;
  }
  .report-sub-title {
    margin-bottom: 8px;
    color: $l-color-fontcolor-3;
    font-size: $l-font-size;
    font-weight: bold;
  }
}
.margin-bottom8 {
  margin-bottom: 8px;
}
</style>
