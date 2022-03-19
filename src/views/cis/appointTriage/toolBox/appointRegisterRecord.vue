<template>
  <div class="register" v-loading="loading">
    <l-card-title>
        <template #left>
        {{patientInfo.patientName}}预约挂号记录
        </template>
    </l-card-title>

    <div class="date-pick">
        <LFormtTitle label="科室">
          <!--  defaultFirst -->
            <!-- <l-value-domain
                remoteUrl="/wadmin/hos/dept"
                type="select"
                :value.sync="form.ouptDeptId"
                remoteShowKey="orgNm"
                remoteValueKey="id"
                placeholder
                clearable
                filterable
                @change="deptChange"
            ></l-value-domain> -->
           <el-select
              filterable
              clearable
              v-model="form.ouptDeptId"
              @change="deptChange"
            >
              <el-option
                v-for="item in deptIdOptions"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
        </LFormtTitle>
    </div>
    <!-- <div class="date-pick" v-if="form.ouptDeptId">
        <l-formt-title label="医生">
            <l-value-domain
                clearable
                :remoteUrl="'/wadmin/dept-doctor/'+ form.ouptDeptId"
                type="select"
                :value.sync="form.doctorId"
                remoteShowKey="uname"
                remoteValueKey="uid"
                placeholder
                style="width:100%"
                @change="docChange"
            ></l-value-domain>
        </l-formt-title>
    </div> -->
    <div class="date-pick" v-if="form.ouptDeptId">
        <l-formt-title label="医生">
            <el-select clearable v-model="form.doctorId" placeholder="请选择" @change="docChange">
              <el-option
                v-for="(item,index) in deptDoctorList"
                :key="index"
                :label="item.uname"
                :value="item.uid"
              ></el-option>
            </el-select>
        </l-formt-title>
    </div>

    <div class="date-pick">
        <l-formt-title label="拟就诊日期">
            <el-date-picker
                v-model="form.nitime"
                type="date"
                :picker-options="pickerOptions0"
                value-format="yyyy-MM-dd"
                placeholder="请选择就诊日期"
                @change="timeChange"
            ></el-date-picker>
        </l-formt-title>
    </div>

    <div class="table-box">
      <div style="width: 100%;height:152px;border: 1px solid #f1f4f6;border-radius: 4px;margin-bottom:8px;" v-for="(item, index) in tableData" :key="index">
        <div style="width: 100%;height: 36px;background-color:#F1F4F6;padding: 6px 8px;display:flex;align-items: center;justify-content: space-between;">
          <span style="font-size: 14px;color: #2e323a;"
              v-tableTransform
              tableName="sys_org"
              :conditionMap="{
                org_type: '_DEPT_',
                id: item.ouptDeptId
              }"
              columns="org_nm"
            ></span>
            <div style="font-size: 14px;color: #f05a23;">
              <span :val="item.recordStatus" code="APPT_STATUS" v-codeTransform></span>
            </div>
          <!-- <span :val="item.recordStatus" code="APPT_STATUS" v-codeTransform></span> -->
        </div>
        <div style="width: 100%;padding: 8px;">
           <div style="display:flex;align-items: center;margin-bottom: 8px;">
              <div style="font-size: 14px;color: #2e323a;margin-right:4px;">{{item.doctorName}}</div>
              <div style="background-color:rgba(43,69,131,0.1);padding: 1px 4px;display:flex;align-items: center;justify-content: center;">
                  <div style="color:#2B4583;font-size: 10px;">
                      <!-- <span
                      :val="item.diagTreatType"
                      code="DIAG_TREAT_TYPE"
                      v-codeTransform
                      ></span> -->
                      <span>{{item.diagTreatTypeName}}</span>
                  </div>

              </div>
          </div>
          <div style="margin-bottom: 4px;color: #949da3;line-height: 15px;font-size: 10px;">
            拟就诊时间
          </div>
          <div style="margin-bottom: 8px;color: #949da3;line-height: 15px;font-size: 12px;">
            {{item.appointmentTime}}
          </div>
          <div style="display:flex;align-items: center;justify-content: space-between;">
              <div style="color: #949da3;line-height: 15px;font-size: 12px;">
                <span v-if="item.regStatus=='0'">未收费</span>
                <span v-if="item.regStatus=='1'">已收费</span>
                <span v-if="item.regStatus=='2'">已退费</span>
                <span v-if="item.regStatus=='3'">免收费</span>
              </div>
              <div class="btns float-right" v-if="item.regStatus=='0' && item.recordStatus != 9">
                  <!-- <el-button type="primary" @click="payClick(item)">收费</el-button> -->
                  <el-button type="primary" @click="appointCancelClick(item)" plain>取消</el-button>
              </div>
              <div class="btns float-right" v-if="item.regStatus=='1' || item.regStatus=='3' && item.recordStatus != 9 " >
                  <el-button type="primary" @click="appointCancelClick(item)" plain>退号</el-button>
              </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="收费"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="700px"
      @close="closeDialog"
    >
      <l-charge :charge="newLchrage" :isApptointment="true" @close="close"></l-charge>
    </el-dialog>
    <el-dialog title="退费结算" :visible.sync="returnVis">
      <ReturnPreDialog
        v-if="returnVis"
        :refundApplyData="currentRegisteredData.tradeId"
        @close="returnClose"
        @message="messageHandler"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import service from "@/api/appointment/appointment";
import outpatientAppointment from "@/api/appointmentNew/outpatientAppointment.js";
import scheManagement from "@/api/schedule/scheduleManagement.js";
import ReturnPreDialog from "@/views/cis/settleAccount/returnCharge/components/returnPreDialog.vue";
export default {
  components: {
    ReturnPreDialog
  },
  name: "register",
  data() {
    return {
      form:{
        ouptDeptId: '',
        deptName:'',
        doctorId: '',
        nitime:'',
      },
      pickerOptions0: {
      //   disabledDate(time) {
      //     return time.getTime() <= Date.now() - 86400000;
      //   }
      },
      deptDoctorList: [],
      deptIdOptions: [],
      // 缴费弹窗
      dialogVisible: false,
      newLchrage: {
          appointment: {}, // 预约明细
          chargePrescriptions: [], // 待收费明细，
          accountInfo: {} // 账户数据
      },

      returnVis: false,
      // 退费结算数据
      currentRegisteredData: {},


      patientInfo: {},
      searchDate: [],
      tableData: [],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // 局部loading
      loading: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  mounted() {
    // this.form.ouptDeptId = '';
    this.selectAllDept();
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.patientInfo = value;
        console.log(this.patientInfo)
        value.patientId && this.getOutpApptList();
        this.form.ouptDeptId = '';
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    messageHandler(){
      this.$emit("message");
    },
    async selectAllDept(val) {
      try {
        let res = await scheManagement.queryDept({
          deptName: "",
        });
        this.deptIdOptions = res.data;
        // this.searchValue.deptId = res.data.length?res.data[0].deptId:'';
      } catch (error) {
        this.$message.error(error.msg || "查询科室失败");
      }
    },
    deptChange(data){
      this.form.doctorId = '';
        // this.form.ouptDeptId = ''
        console.log('deptChange',data)
        // this.form.ouptDeptId = data
        if(this.form.ouptDeptId && this.form.ouptDeptId.length != 0){
          this.getDeptDoctor()
        }
        this.getOutpApptList()
    },
    docChange(){
        console.log('docChange')
        this.getOutpApptList()
    },
    timeChange(){
        console.log('timeChange')
        this.getOutpApptList()
    },

    paddingLeftNum(s) {
      return s < 10 ? "0" + s : s;
    },
    timeTransform(time) {
      const d = new Date(time);
      console.log(d)
      const resDate =
        d.getFullYear() +
        "-" +
        this.paddingLeftNum(d.getMonth() + 1) +
        "-" +
        this.paddingLeftNum(d.getDate());


      console.log(resDate)
      return `${resDate}`;
    },
    // 获取科室的医生
    async getDeptDoctor() {
      // /wadmin/dept-doctor/
      const response = await service.getDoctorListByDeptId(this.form.ouptDeptId);
      this.deptDoctorList = response.data;
    },
    // 获取历史挂号记录
    async getOutpApptList() {
      try {
        if (!this.patientInfo.patientId) {
            this.$message("请先选择患者！");
          return;
        }
        this.loading = true;
        let sDate = "";
        let eDate = "";
        if (this.form.nitime) {
          sDate = this.timeTransform(this.form.nitime) + ' 00:00:00';
          eDate = this.timeTransform(this.form.nitime) + ' 23:59:59';;
        }
        console.log(sDate, eDate);
        const response = await service.getApptByTime({
            patientId: this.patientInfo.patientId,
            startDate: sDate,
            stopDate:eDate,
            ouptDeptId: this.form.ouptDeptId,
            doctorId: this.form.doctorId,
        });
        this.tableData = response.data;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.$message.error(error.msg || "获取预约挂号记录报错");
      }
    },

    async payClick(item) {
      // if (!item.appointmentId) {
      //   this.$message.error("请选择一条预约记录");
      //   return;
      // }
      //当前选中的预约数据
      this.newLchrage.appointment = item;
      //获取收费明细
      let ChargeRegDetail = this.getChargeRegDetail();
      // 待收费对象转换
      this.changeObj(ChargeRegDetail);
      //获取患者的充值信息 （组件内部已集成此方法）
      // const { data } = await service.getAccountInfo(
      //   this.selectedPatientInfo.patientId
      // );
      // this.newLchrage.accountInfo = data;
      this.dialogVisible = true;
    },
    async getChargeRegDetail() {
      let { data } = await service.getChargeRegDetail({
        birthDate: "",
        regDiagTreatType: this.newLchrage.appointment.diagTreatType,
        regWorkCode: this.newLchrage.appointment.workCode
      });
      return data;
    },
    // 对象转换
    changeObj(ChargeRegDetail) {
      let chargePrescriptions = [];
      for (let i = 0; i < ChargeRegDetail.length; i++) {
        let item = ChargeRegDetail[i];
        let obj = {
          orderName: item.chargeItemName,
          dosageUnit: item.chargeUnit,
          quantity: "1",
          price: item.chargePrice,
          orderItemId: item.chargeItemId,
          orderItemCat: item.statisticsCode,
          prescriptionSource: "9",
          num: "1",
          visitId: this.newLchrage.appointment.appointmentId,
          ouptDeptId: this.newLchrage.appointment.ouptDeptId, // 专科id
          groupId: item.groupNo, // 组号
          groupNo: item.groupNo
        };
        chargePrescriptions.push(obj);
      }
      this.newLchrage.chargePrescriptions = chargePrescriptions;
    },
    close() {
        this.dialogVisible = false;
        this.newLchrage = {
            appointment: {}, // 预约明细
            chargePrescriptions: [], // 待收费明细，
            accountInfo: {} // 账户数据
        };
        // this.getRegisteredList();

          this.getOutpApptList();
    },
    closeDialog() {
        // this.getRegisteredList();

          this.getOutpApptList();
    },


    //取消预约
    async appointCancelClick(item) {

      if (item.regStatus == "0") {
        //未收费
        try {
          // this.$showLoading();
          let res = await outpatientAppointment.appointCancel({
            appointmentId: item.appointmentId,
            channel: 1
          });
          // this.$hideLoading();
          this.$message.success(res.msg);
          this.getOutpApptList();
          // await this.getRegisteredList();
          // this.getDeptAndNum();
          // this.getScheduleByApptDept();
          this.$emit("message");
        } catch (error) {
          // this.$hideLoading();
          this.$message.error(error.msg);
        }
      } else if (item.regStatus == "1" || item.regStatus == "3") {
        this.currentRegisteredData = item
        this.returnVis = true;
      }
    },
    // 退费结算弹出框关闭按钮
    returnClose(val) {
      if (val && val.refresh) {
        this.getOutpApptList();
        // this.getRegisteredList();
        // this.getApptByScheduleId();
        // this.getDeptAndNum();
        // this.getScheduleByApptDept();
      }
      this.returnVis = false;
    },
  }
};
</script>

<style lang='scss' scoped>
// body .el-time-panel {
//   width: 149px !important;
// }
.register {
  // width: 298px;
  width: 100%;
  height: 100%;
  // padding: 10px;
  background-color: #fff;

  .date-pick {
    margin: 8px 0px;
  }
  .table-box {
    width: 100%;
    margin-top: 16px;
    height: calc(100% - 149px);
  }
}
</style>
