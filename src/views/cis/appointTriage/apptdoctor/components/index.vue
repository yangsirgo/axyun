<template>
  <div class="height-width width100 height100">
    <!-- 左侧挂号 -->
    <el-card class="box-card-left" style="overflow-y: auto;">
      <div class="height-button-main">
        <div style="margin-left:20px">
          <l-card-title>
            <template slot="left">预约信息</template>
          </l-card-title>
        </div>
        <el-row>
          <el-form ref="searchForm" :model="searchForm">
            <div style="margin-left: 20px">
              <el-row :gutter="10" class="margin-left-10 l-clearfix:after">
                <el-col :span="5">
                  <LFormtTitle label="挂号科室" labelWidth="76">
                    <span
                      style="display: inline-block;padding-top: 8px;"
                      tableName="sys_org"
                      :conditionMap="{
                        org_type: '_DEPT_',
                        id: deptId
                      }"
                      columns="org_nm"
                      v-tableTransform
                    ></span>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="挂号类别" labelWidth="76">
                    <el-select
                      v-model="reInfo.diagTreatType"
                      clearable
                      placeholder="请选择"
                      @change="changType"
                    >
                      <el-option
                        v-for="(item, index) in docTypes"
                        :key="index"
                        :label="item.diagTreatTypeName"
                        :value="item.diagTreatType"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="挂号医生" labelWidth="76">
                    <el-select clearable v-model="reInfo.doctorId" @change="changeDoc">
                      <el-option
                        v-for="item in doctors"
                        :key="item.scheduleId"
                        :label="item.doctorName"
                        :value="item.doctorId"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-row>
        <el-row>
          <div style="height:150px" class="width100 mar-top-10">
            <apptdoctor :reInfo="reInfo" :ouptDeptId="deptId" @selectTime="pushTableData"></apptdoctor>
          </div>
        </el-row>
        <div class="margin-left-20 mar-top-20">
          <l-card-title>
            <template slot="left">确认预约信息</template>
          </l-card-title>
        </div>
        <div style="margin: 0 20px 20px 20px;">
          <el-row>
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column
                v-for="(item, index) in tableParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                header-align="left"
                :align="item.align || 'left'"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'ouptDeptId'">
                    <span
                      style="display: inline-block;padding-top: 8px;"
                      tableName="sys_org"
                      :conditionMap="{
                        org_type: '_DEPT_',
                        id: scope.row[item.prop]
                      }"
                      columns="org_nm"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'diagTreatType'">
                    <span
                      style="display: inline-block;padding-top: 8px;"
                      :val="scope.row[item.prop]"
                      code="DIAG_TREAT_TYPE"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'chargePrice'">
                    <span>{{ scope.row[item.prop].toFixed(2) }}</span>
                  </template>
                  <template v-else>
                    <span class="overflow-point">
                      {{
                      scope.row[item.prop]
                      }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
      </div>

      <div class="height-button-bottom">
        <el-button
          v-hotKey="{ func: 'func_submit' }"
          type="primary"
          @click="confirmOrder"
          class="float-right mar-top-20 mar-right-20"
        >确认预约</el-button>
        <el-button
          type="primary"
          @click="openNoCardAppt"
          class="float-right mar-top-20 mar-right-20"
        >无卡预约登记</el-button>
      </div>
    </el-card>
    <el-dialog
      title="患者信息"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose">
      <div class="width100 padding10">
        <el-form :model="noCardForm" :rules="noCardFormRules" ref="noCardForm">
          <el-row :gutter="10">
            <el-col :span="12">
              <LFormtTitle label="患者姓名" required>
                <el-form-item prop="patientName">
                  <el-input v-model="noCardForm.patientName"  placeholder="请输入姓名" clearable></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="12">
              <LFormtTitle label="患者性别" required>
                <el-form-item prop="patientGender">
                  <l-value-domain
                    clearable
                    code="GENDER_CODE"
                    :value.sync="noCardForm.patientGender"
                    placeholder="请选择性别"
                  />
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="margin-top-20">
            <el-col :span="12">
              <LFormtTitle label="身份证号" required >
                <el-form-item prop="identificationNum">
                  <el-input v-model="noCardForm.identificationNum" placeholder="请输入身份证号" clearable></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="12">
              <LFormtTitle label="联系方式" required>
                <el-form-item prop="phoneNum">
                  <el-input v-model="noCardForm.phoneNum" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="margin-top-20">
            <el-col :span="12">
              <LFormtTitle label="出生日期" >
                <el-form-item prop="birthDate">
                  <!-- <el-input v-model="noCardForm.birthDate" clearable></el-input> -->
                  <el-date-picker
                    class="width100"
                    v-model="noCardForm.birthDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="12">
              <LFormtTitle label="联系地址">
                <el-form-item prop="patientAddr">
                  <el-input v-model="noCardForm.patientAddr" placeholder="请输入联系地址" clearable></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="setNoCardPatient">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import apptdoctor from "./ApptDoctor.vue";
import service from "@/api/appointment/appointment";
import { mapActions, mapGetters } from "vuex";
import { transformCode, getTableData } from "@/api/directive/directiveRequest";

export default {
  components: {
    apptdoctor
  },
  props: {
    deptId: {
      type: [String, Number],
      required: true
    }
  },
  data() {

    var validateIdNum = (rule, value, callback) => {
      let rules = /\d{17}[\d|x]|\d{15}/;
        if (value === '') {
          callback(new Error('请输入身份证号'));
        } else if (rules.test(value) === false) {
          callback(new Error('身份证号非法'));
        } else {
          callback();
        }
      };

      var validatePhoneNum = (rule, value, callback) => {
      let rules = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (rules.test(value) === false) {
          callback(new Error('手机号非法'));
        } else {
          callback();
        }
      };

    return {
      patientInfo: {},
      // 患者信息表单对象
      patientForm: {},
      // 搜索表单
      searchForm: {},
      // 挂号科室集合
      ouptDeptIds: [],
      // 诊疗类型
      docTypes: [],
      // 挂号医生
      doctors: [],
      // 排班列表
      scheduleList: [],
      // 预约信息表格数据
      tableData: [],
      // 表格表头
      tableParams: [
        {
          prop: "ouptDeptId",
          label: "科室",
          width: "100",
          align: "left"
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          width: "200",
          align: "left"
        },
        {
          prop: "diagTreatType",
          label: "挂号类别",
          width: "200",
          align: "left"
        },
        {
          prop: "apptTime",
          label: "预约时间",
          width: "150",
          align: "left"
        },
        {
          prop: "chargePrice",
          label: "挂号费(元)",
          width: "100",
          align: "right"
        }
      ],
      // 患者档案信息
      patientRecord: {},
      // 挂号信息
      reInfo: {
        diagTreatType: "",
        doctorId: ""
      },
      //反显数据缓存
      codeTransformObj: {},
      //无卡预约
      dialogVisible: false,
      // 无卡患者信息
      noCardForm: {
        patientName: '',
        patientGender: '',
        identificationNum: '',
        phoneNum: '',
        birthDate: '',
        patientAddr: ''
      },
      // 表单校验
      noCardFormRules: {
        patientName: [
            { required: true, message: '请输入患者姓名', trigger: 'blur' }
        ],
        patientGender: [
            { required: true, message: '请选择患者性别', trigger: 'blur' }
        ],
        identificationNum: [
            { required: true, message: '请输入患者身份证号', trigger: 'blur' },
            { validator: validateIdNum, trigger: 'blur' }
        ],
        phoneNum: [
            { required: true, message: '请输入患者联系方式', trigger: 'blur' },
            { validator: validatePhoneNum, trigger: 'blur'}
        ]
      },
      // 全部诊疗类型
      allDiagTreatType: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.patientInfo = value;
        this.resetData();
      },
      deep: true,
      immediate: true
    },
    deptId: {
      handler(val) {
        this.changOffice();
      },
      immediate: true
    }
  },
  async mounted() {
    // 清除visitCodo
    this.patientInfo = {...this.receivePatientData};
    this.$delete(this.patientInfo,"visitCode");
    this.changeRecPatientData(this.patientInfo);
    // 拿到诊疗类型 回显用
    await this.getDiagTreatType();
    await this.getSchedule();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    // 更新页面数据
    async updatePageData() {
      // 清空数据
      this.resetAll();
      // 更新患者列表数据
      this.$emit("updatePatient", {});
    },
    async confirmOrder() {
      if (
        this.tableData.length < 1 ||
        Object.keys(this.reInfo).length == 0 ||
        Object.keys(this.patientInfo).length == 0
      ) {
        this.$message.error("请选择患者并预约");
        return;
      }
      // 确认预约
      try {
        this.$showLoading();
        const res = await service.createOutp(this.tableData[0]);
        this.$message({
          message: "预约成功",
          type: "success"
        });
        this.updatePageData();
        this.resetAll();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    resetAll() {
      this.tableData = [];
      this.reInfo.diagTreatType = "";
      this.reInfo.doctorId = "";
    },
    resetData() {
      this.tableData = [];
    },
    // 确认信息表格
    // eslint-disable-next-line complexity
    async pushTableData(item) {
      let time = item.time.substr(0, 16);
      let date = new Date(Date.parse(time.replace(/-/g, "/")));
      if (date.getTime() + 60 * 60 * 1000 < new Date().getTime()) {
        this.$message.error("该时间已过号");
        return;
      }
      let list = await this.getToChargeItem();
      let price = 0;
      list.forEach(function(item, index) {
        price = item.chargePrice + price;
      });
      let patient = { ...this.patientInfo };
      this.$delete(patient, "visitCode");

      if(patient.birthDate.indexOf(' ') && patient.birthDate.indexOf(' ') != -1){
        patient.birthDate = patient.birthDate.substring(0,patient.birthDate.indexOf(' '))
      }

      let appt = {
        ...this.reInfo,
        patientId: patient.patientId,
        patientName: patient.patientName,
        patientCode: patient.patientCode || "",
        patientGender: patient.patientGender,
        patientAddr: patient.patientAddr || "",
        identificationNum: patient.identificationNum || '',
        birthDate:
          patient.birthDate +
          (patient.birthTime ? " " + patient.birthTime : " 00:00:00"),
        phoneNum: patient.phoneNum,
        ouptDeptId: this.deptId,
        appointmentMode: "7", // 门诊预约
        recodeStatus: "1",
        appointmentTime: time + ":00", // 预约时间
        scheduleSerialId: item.scheduleId || "", //排班id
        chargePrice: price,
        apptTime: item.time // 选择的预约时间段，回显用
      };
      // 无卡预约出生日期
      if(patient.isNoCard && patient.isNoCard == '1'){
        appt.birthDate = this.patientInfo.birthDate || '';
      }
      
      this.tableData = [];
      this.tableData.push(appt);
    },
    async changOffice() {
      let list = [];
      // 清空数据
      this.reInfo.diagTreatType = null;
      this.reInfo.doctorId = null;

      // 拿到 当前科室 下的诊疗类型
      this.scheduleList.forEach(item => {
        if (item.ouptDeptId == this.deptId) {
          list.push(item);
        }
      });
      // 去重 拿到 当前科室 下的诊疗类型
      let obj = {};
      this.docTypes = [];
      for (let i = 0; i < list.length; i++) {
        if (!obj[list[i].diagTreatType]) {
          // let diagTreatTypeName = await this.transformCode(
          //   "name",
          //   "DIAG_TREAT_TYPE",
          //   list[i].diagTreatType
          // );
           this.allDiagTreatType.forEach(val=>{
            if(val.diagTreatTypeCode == list[i].diagTreatType){
              this.$set(list[i], "diagTreatTypeName", val.diagTreatTypeName);
            }
          })
          this.docTypes.push(list[i]);
          obj[list[i].diagTreatType] = true;
        }
      }
      this.resetData();
    },
    // 查询全部诊疗类型
    async getDiagTreatType(){
      try {
        this.$showLoading();
        let res = await service.getDiagTreatType();
        this.allDiagTreatType = res.data; 
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "查询诊疗类型失败");
      }
    },
    changType() {
      let list = [];
      this.reInfo.doctorId = null;
      // 拿到当前科室下所有医生
      this.scheduleList.forEach(item => {
        if (
          item.diagTreatType == this.reInfo.diagTreatType &&
          item.ouptDeptId == this.deptId
        ) {
          list.push(item);
        }
      });
      let obj = {};
      this.doctors = [];
      for (let i = 0; i < list.length; i++) {
        if (!obj[list[i].doctorId]) {
          this.doctors.push(list[i]);
          obj[list[i].doctorId] = true;
        }
      }

      this.resetData();
    },
    changeDoc() {
      this.doctors.forEach(item => {
        if (item.doctorId == this.reInfo.doctorId) {
          this.reInfo.doctorName = item.doctorName;
        }
        if (item.diagTreatType == this.reInfo.diagTreatType) {
          this.reInfo.diagTreatTypeName = item.diagTreatTypeName;
        }
        if (item.ouptDeptId == this.deptId) {
          this.reInfo.ouptDeptName = item.ouptDeptName;
        }
      });
      this.resetData();
    },
    // 拿到当前排班
    async getSchedule() {
      this.$showLoading();
      const hour = new Date().getHours();
      let sDate = "";
      let eDate = "";
      let a = new Date().getDay();
      // 周一的时间
      // let date = new Date() - (a - 1) * 60 * 60 * 24 * 1000;
      let date = new Date();
      let date2 = date + 6 * 60 * 60 * 24 * 1000;
      let dateStr =
        new Date(date).getFullYear() +
        "-" +
        (new Date(date).getMonth() + 1) +
        "-" +
        new Date(date).getDate();
      let dateStr2 =
        new Date(date2).getFullYear() +
        "-" +
        (new Date(date2).getMonth() + 1) +
        "-" +
        new Date(date2).getDate();

      sDate = `${dateStr} 00:00:00`;
      eDate = `${dateStr2} 23:59:59`;
      const { data } = await service.getScheduleList({
        ouptDeptId: this.deptId || "",
        startDate: sDate,
        stopDate: eDate
      });

      // 去重 拿到所有科室
      let obj = {};
      for (let i = 0; i < data.length; i++) {
        if (!obj[data[i].ouptDeptId]) {
          this.ouptDeptIds.push(data[i]);
          obj[data[i].ouptDeptId] = true;
        }
      }

      this.scheduleList = data;
      console.info(this.scheduleList,data,"this.scheduleList")
      this.changOffice();
      this.$hideLoading();
    },

    // 查询待收费项目(签到，只收挂号费))
    async getToChargeItem() {
      const { data } = await service.getChargesItem({
        diagTreatType: this.reInfo.diagTreatType
      });
      return data;
    },
    // 无卡预约
    openNoCardAppt(){
      this.dialogVisible = true;
    },
    // 无卡预约弹窗
    handleClose(done){
      this.$refs["noCardForm"].resetFields();
      this.dialogVisible = false;
    },
    setNoCardPatient(){
       this.$refs["noCardForm"].validate((valid) => {
          if (valid) {
            this.patientInfo = {
              ...this.noCardForm,
              isNoCard: '1' // 是无卡预约
            };
            this.handleClose();
          } else {
            return false;
          }
        });
    },


    //主数据反显  (诊疗类型用)
    async transformCode(field, code, val) {
      let params = [{ field, code, val }];
      // debugger
      if (this.codeTransformObj[`${code}+${val}`]) {
        el.innerText = this.codeTransformObj[`${code}+${val}`];
        return this.codeTransformObj[`${code}+${val}`];
      }
      try {
        let resData = await transformCode(params);
        if (resData.code === 1) {
          this.codeTransformObj[`${code}${val}`] = resData.data[code];
          return Promise.resolve(resData.data[code]);
        }
        return "--";
      } catch (err) {
        return "--";
      }
    },
    //表数据反显 （科室用）
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
        return "默认";
      } catch (error) {
        return "默认";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.blue-color {
  color: $l-color-fontcolor-2;
}

.height-width {
  /*min-width: 1920px;*/
  /*margin-top: 30px;*/
  /*padding: 0 20px;*/

  .float-left-30 {
    margin-left: 30px;
  }

  .mar-top-10 {
    margin-top: 10px;
  }

  .form-height {
    height: 40px;
  }

  .form-width {
    width: 162px;
  }

  .input-width {
    width: 100%;
  }

  .float-right {
    float: right;
  }

  .mar-right-10 {
    margin-right: 10px;
  }
  .mar-right-20 {
    margin-right: 20px;
  }

  .mar-top-20 {
    margin-top: 20px;
  }

  .box-card-left {
    height: 100%;
    // padding-bottom: 20px;
    .is-always-shadow {
      border: 0;
      // box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .box-card-right {
    float: right;
    margin-left: 10px;
    width: 500px;
    height: 100%;
  }

  .img {
    width: 80px;
    height: 102px;
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    margin-left: 20px;
  }

  .account {
    width: 100%;
    height: 82px;
    margin-top: 10px;
    text-align: center;
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
    padding-top: 10px;

    span:not(.font) {
      line-height: 20px;
    }

    .font {
      color: $l-color-primary;
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
    }
  }
}
.dis-wid {
  display: inline-block;
  width: 60px;
}
.text-title {
  font-size: 14px;
  font-weight: 400;
  color: rgba(148, 157, 163, 1);
  line-height: 20px;
}
.text-contain {
  font-size: 14px;
  font-weight: 400;
  color: rgba(46, 50, 58, 1);
  line-height: 20px;
}
.duka-button {
  width: 200px;
  height: 38px;
  margin-left: 10px;
  border: none;
  border-radius: 2px;
  float: left;

  i {
    display: inline-block;
    margin-right: 10px;
  }
}
.margin-top-20{
  margin-top: 20px;
}
</style>
