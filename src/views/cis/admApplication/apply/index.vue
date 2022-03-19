<template>
  <div class="app-panel width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      patientCardType="default"
      @send-quote="messageHandler"
      @send-apply-info="getFormInfoHandler"
      :loadFlag="loadHis"
      pageName="admApplication"
    >
      <template #list>
        <new-left-bar></new-left-bar>
      </template>
      <template #content>
        <div class="wrapper-cont">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="0"
            class="form-content width100"
          >
            <l-card-title>
              <template #left>
                <div>个人信息</div>
              </template>
            </l-card-title>
            <div class="basic-info margin-top-8">
              <el-row :gutter="8">
                <el-col :span="8">
                  <div class="bi-box">
                    <span class="bi-left">姓名</span>
                    <span>{{ patientApplyInfo.patientName || "--" }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="bi-box">
                    <span class="bi-left">年龄</span>
                    <span v-if="patientApplyInfo.age">{{ patientApplyInfo.age }} 岁</span>
                    <span v-else-if="patientMsg.patientAge">
                      {{
                      patientMsg.patientAge
                      }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="bi-box">
                    <span class="bi-left">性别</span>
                    <span
                      v-show="patientApplyInfo.patientGender"
                      :val="patientApplyInfo.patientGender"
                      code="GENDER_CODE"
                      v-codeTransform
                    >--</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="8">
                  <div class="bi-box">
                    <span
                      class="bi-left"
                      v-codeTransform
                      v-if="patientMsg.identificationType"
                      code="MARK_TYPE_CODE"
                      :val="patientMsg.identificationType"
                    ></span>
                    <span class="bi-left" v-else>
                    居民身份证
                    </span>
                    <span>
                      {{
                      (receivePatientData.patientId &&
                      patientMsg.identificationNum) ||
                      "--"
                      }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="bi-box">
                    <span class="bi-left">婚姻状况</span>
                    <span
                      code="MARITAL_STATUS_CODE"
                      :val="patientMsg.maritalStatus"
                      v-show="
                        receivePatientData.patientId && patientMsg.maritalStatus
                      "
                      v-codeTransform
                    >--</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="bi-box">
                    <span class="bi-left">电话号码</span>
                    <span>
                      {{
                      (receivePatientData.patientId &&
                      receivePatientData.phoneNum) ||
                      "--"
                      }}
                    </span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="12">
                  <l-formt-title label="联系地址">
                    <l-value-domain
                      type="cascader"
                      code="AdministrativDivision"
                      :value.sync="fAddressCode"
                      class="select-container"
                      remoteValueKey="id"
                      remoteShowKey="label"
                      :multiple="false"
                      :relation="true"
                      :placeholder="$t('base.placeholder')"
                      @change="contactChange"
                      key="key3"
                    ></l-value-domain>
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="具体地址">
                    <el-input v-model="fAddress" placeholder="请输入"></el-input>
                  </l-formt-title>
                </el-col>
              </el-row>
            </div>
            <l-card-title>
              <template #left>
                <div>诊断信息</div>
              </template>
            </l-card-title>
            <div class="diabox margin-top-8 mb20">
              <div class="diabox-left">家床拟诊</div>
              <div class="diabox-right">
                <el-table :data="tableData" v-loading="loading" border stripe>
                  <!-- 业务列 -->
                  <el-table-column
                    v-for="(item, index) in tableParams"
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
                      <span>{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <l-card-title>
              <template #left>
                <div>申请信息</div>
              </template>
            </l-card-title>
            <div class="aoolication-info margin-top-8">
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-form-item prop="admDate">
                    <l-formt-title label="拟家床日期" :required="true">
                      <el-date-picker
                        v-model="ruleForm.admDate"
                        prefix-icon="icon iconfont iconriqi"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                      ></el-date-picker>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="admType">
                    <l-formt-title label="家床登记途径" :required="true">
                      <l-value-domain
                        code="InType"
                        placeholder="请选择"
                        :value.sync="ruleForm.admType"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="criticalLevel">
                    <l-formt-title label="入院病情" :required="true">
                      <l-value-domain
                        code="EntranceCode"
                        placeholder="请选择"
                        :value.sync="ruleForm.criticalLevel"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-form-item prop="admDept">
                    <l-formt-title label="拟入院科室" :required="true">
                      <l-value-domain
                        remoteUrl="/appointment/doctorSchedule/getDept"
                        :value.sync="ruleForm.admDept"
                        remoteShowKey="deptName"
                        remoteValueKey="deptId"
                        placeholder="请选择"
                        @change="getDept"
                      ></l-value-domain>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="admWard">
                    <l-formt-title label="拟入院病区" :required="true">
                      <l-value-domain
                        remoteUrl="/wadmin/ward-hos?hosId=91"
                        :value.sync="ruleForm.admWard"
                        remoteShowKey="wardName"
                        remoteValueKey="wardCode"
                        placeholder="请选择"
                        @change="changeWard"
                      ></l-value-domain>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="admBedno">
                    <l-formt-title label="拟入院床位">
                      <el-select v-model="ruleForm.admBedno" placeholder="请选择">
                        <el-option
                          v-for="item in bedListData"
                          :key="item.bedId"
                          :label="item.bedCode"
                          :value="item.bedCode"
                        ></el-option>
                      </el-select>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-form-item>
                    <l-formt-title label="患者费别" :disabled="true">
                      <l-value-domain
                        code="OutpatientCostClass"
                        placeholder="请选择"
                        :value.sync="ruleForm.expenseType"
                        :disabled="true"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <l-formt-title label="申请科室" :disabled="true">
                      <el-input placeholder="请输入" v-model="ruleForm.applyDeptName" :disabled="true"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <l-formt-title label="申请日期" :disabled="true">
                      <el-date-picker
                        v-model="ruleForm.applyDate"
                        prefix-icon="icon iconfont iconriqi"
                        value-format="yyyy-MM-dd"
                        type="date"
                        disabled
                        placeholder="选择日期"
                      ></el-date-picker>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item prop="advanceGold">
                    <l-formt-title label="预缴金额" :required="true">
                      <el-input v-model="ruleForm.advanceGold" placeholder="请输入内容"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>-->
              </el-row>
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-form-item>
                    <l-formt-title label="申请医生" :disabled="true">
                      <el-input v-model="ruleForm.applyDoctorName" disabled placeholder="请输入"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col></el-col>
                <el-col></el-col>
              </el-row>
            </div>
            <div class="diabox margin-top-8">
              <div class="diabox-left">联系人</div>
              <el-row :gutter="8">
                <el-col :span="4">
                  <el-form-item prop="contactsType">
                    <l-formt-title label="类型">
                      <l-value-domain
                        placeholder="请选择"
                        code="contactType"
                        :value.sync="ruleForm.contactsType"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item prop="contacts">
                    <l-formt-title label="姓名">
                      <el-input v-model="ruleForm.contacts" placeholder="请输入"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item prop="relationShip">
                    <l-formt-title label="关系">
                      <l-value-domain
                        placeholder="请选择"
                        code="RELATION_CODE"
                        :value.sync="ruleForm.relationShip"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item :prop="'contactsPhone'">
                    <l-formt-title label="联系方式">
                      <el-input v-model="ruleForm.contactsPhone" placeholder="请输入"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item prop="contactsIdentificationNum">
                    <l-formt-title label="身份证号">
                      <el-input v-model="ruleForm.contactsIdentificationNum" placeholder="请输入"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="diabox">
              <div class="diabox-left">特殊说明</div>
              <div class="diabox-right">
                <el-form-item prop="remark" class="remark-item">
                  <el-input
                    type="textarea"
                    :rows="4"
                    resize="none"
                    placeholder="请输入"
                    v-model="ruleForm.remark"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="wc-bottom text-align-right">
            <!-- <el-button
              v-hotKey="{func: 'func_add1'}"
              type="primary"
              @click="newAdd"
              :disabled="!receivePatientData.patientId"
            >新建(Alt+C)</el-button>-->
            <el-button
              v-hotKey="{ func: 'func_submit', flag: 'submitLoading' }"
              type="primary"
              @click="confirm"
              :loading="submitLoading"
              :disabled="ruleForm.billStatus && ruleForm.billStatus !== 1"
            >提交</el-button>
            <el-button @click="reset" type="primary" plain>取消</el-button>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import newLeftBar from "@/views/cis/components/newLeftBarNew.vue"
import {
  submitForm,
  diaInfo,
  getPatintInfo,
  queryBed,
  queryApplyInfo,
  getPatientAddress
} from "@/api/cis/admApplication/index";
import Base64 from "@/utils/base64.js";

export default {
  components: { newLeftBar },
  data() {
    return {
      toolBoxs: ["previousApply", "Hotkey"],
      fAddressCode: [],
      fAddress: "",
      // 表单数据
      ruleForm: {
        // 联系地址省市区
        addrProvince: "",
        addrCity: "",
        addrDistrict: "",
        familyAddress: "",
        contacts: "",
        relationShip: "",
        contactsPhone: "",
        remark: "",
        admDate: "",
        admType: "",
        criticalLevel: "",
        admDept: "",
        admWard: "",
        admBedno: "",
        /* advanceGold: "", */
        applyDeptId: "",
        applyDeptName: "",
        applyDoctorName: "",
        applyDate: "",
        expenseType: "4",
        contactsType: "",
        contactsIdentificationNum: "",
        contactsIdentificationType: "1"
      },
      rules: {
        admDate: [{ required: true, message: "请选择日期", trggier: "change" }],
        admType: [{ required: true, message: "请选择", trggier: "change" }],
        criticalLevel: [
          { required: true, message: "请选择", trggier: "change" }
        ],
        admDept: [{ required: true, message: "请选择", trigger: "change" }],
        admWard: [{ required: true, message: "请选择", trggier: "change" }]
        /* advanceGold: [{ required: true, message: "请输入", trggier: "blur" }] */
      },
      // 入院拟诊 loading
      loading: false,
      // 入院拟诊
      tableParams: [
        {
          prop: "diagCode",
          label: "诊断代码"
        },
        {
          prop: "diagName",
          label: "诊断名称"
        }
      ],
      tableData: [],
      // 婚姻状况
      marital: {
        "0": "未婚",
        "1": "已婚"
      },
      // 关系
      relationship: [
        {
          label: "父亲",
          value: "1"
        },
        {
          label: "母亲",
          value: "2"
        }
      ],
      // 更新右侧工具栏历史申请
      loadHis: false,
      // 患者所有信息
      patientMsg: {},
      // 床位列表
      bedListData: [],
      submitLoading: false,
      patientApplyInfo: {},
      // 拟入院日期只允许选择今天之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  computed: {
    // 获取病患信息
    ...mapGetters("base", ["receivePatientData"]),
    //获取登录医生信息
    ...mapGetters("user", ["name", "role"])
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val, 'valvalval')
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
        if (!val.billStatus) {
          this.$delete(this.ruleForm, "billStatus");
        } else {
          this.$set(this.ruleForm, "billStatus", val.billStatus);
        }
        if (!val.applyDate) {
          const nowDate = this.getNowDate();
          this.$set(this.ruleForm, "applyDate", nowDate);
        }
        this.patientApplyInfo = {
          patientGender: ""
        };
        this.fAddressCode = [];
        this.fAddress = "";
        this.patientMsg = {
          maritalStatus: ""
        };
        this.tableData = [];
        if (val.patientId) {
          this.patientApplyInfo = this.receivePatientData;
          this.initTable();
          this.getInfo();
        }
      }
    },
    role: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$set(this.ruleForm, "applyDeptName", val.deptName);
        this.$set(this.ruleForm, "applyDeptId", val.deptId);
      }
    }
  },
  created() {
    const name = Base64.decode(this.name);
    this.$set(this.ruleForm, "applyDoctorName", name);
  },
  methods: {
    getNowDate() {
      // 获取当前日期
      const day = new Date();
      let m = day.getMonth() + 1;
      let d = day.getDate();
      m = m > 9 ? m : "0" + m;
      d = d > 9 ? d : "0" + d;
      const today = `${day.getFullYear()}-${m}-${d}`;
      return today;
    },
    // 获取患者档案信息
    getInfo() {
      if (!this.receivePatientData.patientId) {
        this.patientMsg = {};
        this.fAddressCode.splice(0);
        this.fAddress = "";
        this.clearAddress();
        return;
      }
      getPatientAddress({ patientId: this.receivePatientData.patientId })
        .then(res => {
          if (res.code === 1) {
            console.log("111", res);
            if (!this.receivePatientData.patientId) {
              return;
            }
            this.patientMsg = res.data;
            // 获取病患的联系地址
            const addrList = res.data;
            if (addrList) {
              // 省市区字段为真值
              if (
                addrList.addrProvince &&
                addrList.addrCity &&
                addrList.addrDistrict
              ) {
                const address = [
                  +addrList.addrProvince,
                  +addrList.addrCity,
                  +addrList.addrDistrict
                ];
                this.fAddressCode = address;
                this.setAddress(address);
              } else {
                this.fAddressCode = [];
              }
              this.fAddress = addrList.familyAddress || "";
            }
          }
        })
        .catch(err => {});
    },
    // 获取患者入院申请信息
    getPatientApplyInfo() {
      queryApplyInfo({
        patientId: this.receivePatientData.patientId
      })
        .then(res => {
          if (res.code === 1 && res.data) {
            this.getBedList(res.data.admWard);
            this.ruleForm = {
              ...this.ruleForm,
              ...res.data,
              admDept: +res.data.admDept
            };
          } else {
            this.reset();
          }
        })
        .catch(err => {});
    },
    initTable() {
      if (!this.receivePatientData.visitCode) {
        this.tableData = [];
        return;
      }
      this.loading = true;
      diaInfo({
        visitCode: this.receivePatientData.visitCode
      })
        .then(res => {
          if (res.code === 1) {
            if (!this.receivePatientData.visitCode) return;
            const list = res.data.filter(item => item.diagMain === "1");
            this.tableData = list;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    confirm() {
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择要申请的患者");
        return;
      }
      if (this.tableData.length === 0) {
        this.$message.warning("没有主诊断");
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const data = {
            ...this.ruleForm,
            familyAddress: this.fAddress,
            patientAge: this.receivePatientData.patientAge,
            patientId: this.receivePatientData.patientId,
            patientName: this.receivePatientData.patientName,
            patientGender: this.receivePatientData.patientGender,
            patientBirthDay: this.receivePatientData.birthDate,
            identificationNum: this.patientMsg.identificationNum,
            identificationType: this.patientMsg.identificationType,
            mobileNum: this.receivePatientData.phoneNum,
            maritalStatus: this.patientMsg.maritalStatus,
            visitCode: this.receivePatientData.visitCode,
            opDiagnosesCode: this.tableData[0].diagCode,
            opDiagnoses: this.tableData[0].diagName,
            applyDoctorId: this.role.userId,
            applyOperId: this.role.userId,
            applyDeptName: this.role.deptName,
            billStatus: "1"
          };
          submitForm(data)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("申请成功！");
                this.reset();
                this.loadHis = !this.loadHis;
              } else {
                this.$message.error(res.msg || "申请失败");
              }
              this.submitLoading = false;
            })
            .catch(err => {
              this.submitLoading = false;
              this.$message.error(err.msg || "申请失败");
            });
        }
      });
    },
    messageHandler(data) {
      this.$set(this.ruleForm, "remark", this.ruleForm.remark + data);
    },
    changeWard(val) {
      this.getBedList(val);
    },
    getBedList(id) {
      queryBed({
        wardCode: id
      })
        .then(res => {
          this.bedListData = [];
          if (res.code === 1) {
            this.bedListData = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    getDept(val, cur) {
      // console.log(val, cur, this.ruleForm);
    },
    reset() {
      this.$refs.ruleForm.resetFields();
    },
    // 回显历史申请数据
    getFormInfoHandler(val) {
      this.patientApplyInfo = this.receivePatientData;
      this.initTable();
      /* this.getInfo(); */
      this.getBedList(val.admWard);
      this.ruleForm = { ...val, admDept: +val.admDept };
      if (val.addrProvince && val.addrCity && val.addrDistrict) {
        const address = [+val.addrProvince, +val.addrCity, +val.addrDistrict];
        this.fAddressCode = address;
        this.setAddress(address);
      }
    },
    // 联系地址级联
    contactChange(val, cur) {
      this.setAddress(val);
    },
    // 设置地址名称
    setAddress(val) {
      this.ruleForm.addrProvince = val[0];
      this.ruleForm.addrCity = val[1];
      this.ruleForm.addrDistrict = val[2];
    },
    // 清空地址省市区
    clearAddress() {
      this.ruleForm.addrProvince = "";
      this.ruleForm.addrCity = "";
      this.ruleForm.addrDistrict = "";
    },
    // 新建申请
    newAdd() {
      if (!this.receivePatientData.patientId) {
        this.$message({
          type: "warning",
          message: "请选择患者"
        });
        return;
      }
      this.$refs.ruleForm.resetFields();
      this.patientApplyInfo = this.receivePatientData;
      this.initTable();
      this.getInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
.diabox {
  width: 80%;
  margin-bottom: 8px;
}
.aoolication-info,
.basic-info {
  width: 80%;
}
.aoolication-info {
  margin-bottom: 8px;
}
.basic-info {
  margin-bottom: 15px;
}
/deep/ .el-form-item{
  margin-bottom: 2px;
}
.app-panel {
  .wrapper-cont {
    position: relative;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background-color: $l-color-white;
    display: flex;
    flex-direction: column;
    .form-content {
      flex: 1;
      padding: 8px 16px;
      overflow: hidden;
      overflow-y: auto;
    }
    .remark-item {
      /deep/ .el-form-item__content {
        height: auto;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
    .diabox {
      overflow: hidden;
      .diabox-left {
        margin-bottom: 8px;
        font-weight: bold;
      }
    }
    .bi-box {
      margin-bottom: 16px;
    }
    .bi-left {
      display: inline-block;
      margin-right: 8px;
      color: $l-color-fontcolor-4;
    }
    .mb20 {
      margin-bottom: 16px;
    }
    .wc-bottom {
      font-size: 0;
      padding: 16px;
      border-top: 1px solid $l-color-bgcolor-11;
    }
  }
}
</style>
