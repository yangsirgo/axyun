<template>
  <div class="height100 width100 main-con">
    <div class="button-main">
      <div class="top">
        <l-card-title>
          <template slot="left">诊室列表</template>
        </l-card-title>
        <div class="office-info">
          <div class="list-con">
            <div
              class="list-con-item"
              :class="{ active: rowData.scheduleSerialId === item.scheduleId }"
              v-for="(item, index) in officeInfoList"
              :key="index"
            >
              <p class="room">
                <span class="room-name">
                  {{ item.roomName }}
                  <i>({{item.dutyStartTime}}-{{item.dutyStopTime}})</i>
                </span>
                <span
                  class="office-name float-right"
                  tableName="sys_org"
                  :conditionMap="{ org_type: '_DEPT_', id: item.deptId || '' }"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </p>
              <p class="doc-info mar-top-20">
                <span class="doc-name">{{ item.doctorName }}</span>
                <span class="doc-title">{{ item.title }}</span>
                <span class="num float-right">{{ item.currentNum }}/{{ item.totalNum }}</span>
              </p>
              <div class="contains">
                <p class="up-patient">
                  上一位
                  <span class="patient-name">
                    <template v-if="item.upPatientNum">
                      {{ item.upPatientNum }}号,{{
                      item.upPatientName
                      }}
                    </template>
                    <template v-else>无</template>
                  </span>
                </p>
                <p class="current-patient">
                  当前就诊
                  <span class="patient-name">
                    <template v-if="item.currentPatientNum > -1">
                      {{ item.currentPatientNum }}号,{{
                      item.currentPatientName
                      }}
                    </template>
                    <template v-else>无</template>
                  </span>
                </p>
                <p class="next-patient">
                  下一位
                  <span class="patient-name">
                    <template v-if="item.nextPatientNum">
                      {{ item.nextPatientNum }}号,{{
                      item.nextPatientName
                      }}
                    </template>
                    <template v-else>无</template>
                  </span>
                </p>
                <p class="next-patient">
                  等待
                  <span class="patient-name">
                    <template v-if="item.nextPatientNum">
                      {{ item.nextPatientNum }}号,{{
                      item.nextPatientName
                      }}
                    </template>
                    <template v-else>无</template>
                  </span>
                </p>
              </div>
              <div class="jiuzhen-numcom">
                <p class="visit-patient">
                  已就诊
                  <span class="down-visit float-right">{{ item.doneVisitNum }}位</span>
                </p>
                <p class="visit-patient">
                  待就诊
                  <span class="await-visit float-right">{{ item.awaitVisitNum }}位</span>
                </p>
              </div>

              <p class="button-con">
                <el-button
                  v-if="isFenzhenFlag"
                  class="fenzhen-button"
                  type="primary"
                  plain
                  @click="fenzhenFunc(index)"
                >分诊</el-button>
                <el-button
                  v-else
                  class="fenzhen-button"
                  :type="
                    rowData.doctorId === item.doctorId ? 'primary' : 'info'
                  "
                  plain
                  :disabled="rowData.scheduleSerialId != item.scheduleId"
                  @click="signFenzhen(index)"
                >
                  {{
                  rowData.recordStatus > 2 ? "回诊签到" : "签到"
                  }}
                </el-button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 收费弹窗 -->
    <el-dialog
      title="收费"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="700px"
      :before-close="handleClose"
    >
      <l-charge :charge="charge" :isApptointment="true" @close="close"></l-charge>
    </el-dialog>

    <div class="bottom-con">
      <div class="center">
        <l-card-title>
          <template slot="left">更换信息</template>
        </l-card-title>
        <div class="fenzhen-info">
          <div class="box-left">
            <p class="common-title">变更医生</p>
            <el-row class="mar-top-10">
              <el-col :span="8">
                <LFormtTitle label="接诊医生" labelWidth="76" :disabled="selectFlag || isOnlyDoc">
                  <el-select
                    clearable
                    v-model="doctorId"
                    :placeholder="placeholderText"
                    @change="changDoc"
                    :disabled="selectFlag || isOnlyDoc"
                  >
                    <el-option
                      v-for="(item, index) in doctorList"
                      :key="index"
                      :label="item.doctorName"
                      :value="item.doctorId"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="8" class="padding-left-10">
                <LFormtTitle class="office" label="所属科室" labelWidth="76">
                  <span
                    class="office-name"
                    tableName="sys_org"
                    :conditionMap="{ org_type: '_DEPT_', id: deptId }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </LFormtTitle>
              </el-col>
              <el-col :span="8" class="padding-left-10">
                <LFormtTitle
                  width="300px"
                  label="更换原因"
                  labelWidth="76"
                  :disabled="selectFlag || isOnlyDoc"
                >
                  <el-select
                    clearable
                    v-model="reasonId"
                    placeholder="请选择"
                    @change="changReason"
                    :disabled="selectFlag || isOnlyDoc"
                  >
                    <el-option
                      v-for="(item, index) in reasonList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
            </el-row>
          </div>
          <div class="box-right">
            <p class="common-title">队列优先</p>
            <el-row class="mar-top-10">
              <el-col :span="24">
                <LFormtTitle label="优先原因" labelWidth="76" :disabled="selectFlag">
                  <el-select
                    clearable
                    v-model="queneId"
                    placeholder="请选择"
                    @change="changQuene"
                    :disabled="selectFlag"
                  >
                    <el-option
                      v-for="(item, index) in optionsOne"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <p class="float-right mar-top-20 button-coms">
        <el-button v-hotKey="{ func: 'func_delete' }" @click="cancelHandle" type="primary" plain>取消</el-button>
        <el-button v-hotKey="{ func: 'func_submit' }" type="primary" @click="confirmOrder">确认</el-button>
        <el-button @click="openDialog" type="primary">收费</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import {
  getDeptDetailInfo,
  postConfirm
} from "@/api/cis/appointTriage/index.js";
import service from "@/api/appointment/appointment";

export default {
  name: "",
  data() {
    return {
      titleOne: "更换医生",
      titleTwo: "队列优先",
      doctorId: "",
      queneId: "",
      reasonId: "",
      placeholderText: "请选择",
      doctorList: [],
      reasonList: [
        {
          value: "1",
          label: "医生下班"
        },
        {
          value: "2",
          label: "医生请假"
        },
        {
          value: "3",
          label: "其他原因"
        }
      ],
      optionsOne: [
        {
          value: "1",
          label: "军人"
        },
        {
          value: "2",
          label: "老年人"
        },
        {
          value: "3",
          label: "危重病人"
        }
      ],
      // 科室具体信息列表
      officeInfoList: [],
      selectFlag: true,
      isOnlyDoc: false,
      // 收费弹窗
      dialogVisible: false,
      // 收费数据
      charge: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      }
    };
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({
        ouptDeptId: "",
        doctorId: ""
      })
    },
    deptIdFrom: {
      type: [String, Number],
      default: ""
    },
    appointmentTime: {
      type: [String, Number],
      default: ""
    }
  },
  computed: {
    deptId() {
      return this.rowData.ouptDeptId || "";
    },
    isFenzhenFlag() {
      return this.rowData.doctorId ? false : true;
    }
  },
  watch: {
    deptIdFrom(val) {
      this.doctorList = [];
      if (val) {
        this.initData(val);
      }
    },
    appointmentTime(val) {
      if (val) {
      }
    },
    rowData: {
      handler: function(val, oldVal) {
        let flag = typeof oldVal === "undefined";

        if (val.ouptDeptId) {
          this.initData(val.ouptDeptId);
        }

        this.doctorList = [];

        if (val.recordStatus == 6) {
          this.selectFlag = false;
        } else {
          this.selectFlag = true;
        }

        if (val.patientId) {
          // 不同患者情况数据
          this.resetData();
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 关闭收费弹窗
    handleClose() {
      this.dialogVisible = false;
      this.charge = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      };
    },
    close() {
      this.dialogVisible = false;
      // this.getApptList(this.currentData.patientId);
      this.charge = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      };
      this.$emit("updatePatient", {});
    },
    // 收费
    async openDialog() {
      if (
        this.rowData &&
        !this.rowData.patientId &&
        this.rowData.identificationNum
      ) {
        this.$message("该预约为无卡预约，请建档关联");
        return;
      }
      if (this.rowData && this.rowData.regId) {
        this.$message("该预约已收取挂号费");
        return;
      }
      if (!this.rowData.patientId) {
        this.$message("请选择预约信息");
        return;
      }
      this.charge.appointment = { ...this.rowData };
      await this.getToChargeItem();
      await this.getPatientAccount(this.rowData.patientId);
      this.dialogVisible = true;
    },
    // 查询待收费项目(签到，只收挂号费))
    async getToChargeItem() {
      const { data } = await service.getChargesItem({
        diagTreatType: this.rowData.diagTreatType
      });
      this.charge.chargePrescriptions = []; //置空
      // 转换待收费项目
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let obj = {
          orderName: item.chargeItemName,
          dosageUnit: item.chargeUnit,
          quantity: "1",
          price: item.chargePrice,
          orderItemId: item.chargeItemId,
          orderItemCat: item.statisticsCode,
          prescriptionSource: "9",
          visitId: this.rowData.appointmentId,
          ouptDeptId: this.rowData.ouptDeptId // 专科id
        };
        this.charge.chargePrescriptions.push(obj);
      }
    },
    // 查询患者账户信息
    async getPatientAccount(patientId) {
      try {
        this.$showLoading();
        const accountInfo = await service.getAccountInfo(patientId);
        this.charge.accountInfo = accountInfo.data;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "查询患者账户信息接口报错");
      }
    },

    changDoc(data) {
      this.reasonId = "";
    },
    changReason(data) {
      console.log(data);
    },
    changQuene(data) {
      console.log(data);
    },
    confirmOrder() {
      try {
        let doctorObj = this.doctorList.find(item => {
          return item.doctorId === this.doctorId;
        });
        let recordObj = this.reasonList.find(item => {
          return item.value == this.reasonId;
        });

        let params = {
          recordRemark: doctorObj
            ? recordObj
              ? recordObj.recordRemark
              : ""
            : "",
          appointmentId: this.rowData.appointmentId,
          doctorId: this.doctorId,
          doctorName: doctorObj ? doctorObj.doctorName : "",
          dataVersion: this.rowData.dataVersion,
          priority: this.queneId,
          scheduleId: doctorObj ? doctorObj.scheduleId : ""
        };

        if (!params.doctorId && !params.priority) {
          this.$message.info("请选择更换信息");
          return;
        }
        postConfirm(params)
          .then(resData => {
            if (resData.code === 1) {
              this.$message.success("操作成功");
              // 更新数据
              this.resetData();
              this.$emit("updatePatient", {});
            }
          })
          .catch(error => {
            this.$message.error(error.msg || "更新信息接口报错");
          });
      } catch (error) {
        this.$message.error(error.msg || "更换医生接口报错");
      }
    },
    resetData() {
      this.doctorId = "";
      this.queneId = "";
      this.reasonId = "";
    },
    getDeptList(ouptDeptId) {
      let data = {
        deptId: ouptDeptId
      };
      this.$showLoading();
      getDeptDetailInfo(data, true)
        .then(resData => {
          this.$hideLoading();
          if (resData.code === 1) {
            let list = resData.data;
            if (list.length === 1) {
              this.isOnlyDoc = true;
              this.placeholderText = "只有当前医生，不能更换医生";
            } else {
              this.isOnlyDoc = false;
              this.placeholderText = "请选择";
            }
            this.officeInfoList = [];
            this.doctorList = [];
            // eslint-disable-next-line complexity
            this.officeInfoList = list.map(item => {
              let current = false;
              // 更新医生列表数据
              if (item.doctorId !== this.rowData.doctorId) {
                let appointmentTime = this.appointmentTime.split(" ")[1];
                let appointmentTimeNew =
                  appointmentTime.split(":")[0] +
                  appointmentTime.split(":")[1] +
                  appointmentTime.split(":")[2];
                let dutyStartTime =
                  item.dutyStartTime.split(":")[0] +
                  item.dutyStartTime.split(":")[1] +
                  item.dutyStartTime.split(":")[2];
                let dutyStopTime =
                  item.dutyStopTime.split(":")[0] +
                  item.dutyStopTime.split(":")[1] +
                  item.dutyStopTime.split(":")[2];
                if (
                  Number(appointmentTimeNew) >= Number(dutyStartTime) &&
                  Number(appointmentTimeNew) <= Number(dutyStopTime)
                ) {
                  this.doctorList.push({
                    deptId: item.ouptDeptId,
                    doctorName: item.doctorName,
                    doctorId: item.doctorId,
                    scheduleId: item.scheduleId
                  });
                }
              }
              // 当前就诊患者索引
              let itemIndex = -1;
              for (let j = item.queuePOS.length - 1; j >= 0; j--) {
                if (item.queuePOS[j].recordStatus == 4) {
                  itemIndex = j;
                  break;
                }
              }

              // 没有当前就诊的患者
              if (itemIndex === -1) {
                itemIndex = item.queuePOS.findIndex((it, index) => {
                  return it.recordStatus == 6;
                });
              } else {
                current = true;
              }
              let obj = null;
              if (current) {
                obj = {
                  roomName: item.roomName,
                  dutyStartTime: item.dutyStartTime,
                  dutyStopTime: item.dutyStopTime,
                  deptId: item.deptId,
                  doctorName: item.doctorName,
                  doctorId: item.doctorId,
                  workCode: item.workCode,
                  title: "主任医师",
                  scheduleId: item.scheduleId,
                  totalNum: item.totalNumber,
                  currentNum: item.hasNumber,
                  upPatientNum:
                    itemIndex > -1
                      ? itemIndex - 1 > -1
                        ? item.queuePOS[itemIndex - 1].appointmentCode
                        : 0
                      : 0,
                  upPatientName:
                    itemIndex > -1
                      ? item.queuePOS[itemIndex - 1]
                        ? item.queuePOS[itemIndex - 1].patientName
                        : ""
                      : "",
                  currentPatientNum:
                    itemIndex > -1
                      ? item.queuePOS[itemIndex].appointmentCode
                      : -1,
                  currentPatientName:
                    itemIndex > -1 ? item.queuePOS[itemIndex].patientName : "",
                  nextPatientNum:
                    itemIndex > -1
                      ? item.queuePOS[itemIndex + 1]
                        ? item.queuePOS[itemIndex + 1].appointmentCode
                        : 0
                      : 0,
                  nextPatientName:
                    itemIndex > -1
                      ? item.queuePOS[itemIndex + 1]
                        ? item.queuePOS[itemIndex + 1].patientName
                        : ""
                      : "",
                  doneVisitNum: item.completeDiagnoseCount,
                  awaitVisitNum: item.waitDiagnoseCount
                };
              } else {
                obj = {
                  roomName: item.roomName,
                  dutyStartTime: item.dutyStartTime,
                  dutyStopTime: item.dutyStopTime,
                  deptId: item.deptId,
                  doctorName: item.doctorName,
                  doctorId: item.doctorId,
                  workCode: item.workCode,
                  title: "主任医师",
                  scheduleId: item.scheduleId,
                  totalNum: item.totalNumber,
                  currentNum: item.hasNumber,
                  upPatientNum: 0,
                  upPatientName: "",
                  currentPatientNum: -1,
                  currentPatientName: "",
                  nextPatientNum:
                    itemIndex > -1
                      ? item.queuePOS[itemIndex]
                        ? item.queuePOS[itemIndex].appointmentCode
                        : 0
                      : 0,
                  nextPatientName:
                    itemIndex > -1
                      ? item.queuePOS[itemIndex]
                        ? item.queuePOS[itemIndex].patientName
                        : ""
                      : "",
                  doneVisitNum: item.completeDiagnoseCount,
                  awaitVisitNum: item.waitDiagnoseCount
                };
              }

              return obj;
            });
          }
        })
        .catch(error => {
          this.$hideLoading();
          this.$message.error(error.msg || "查询科室及患者信息接口报错");
        });
    },
    cancelHandle() {
      this.resetData();
    },
    // eslint-disable-next-line complexity
    async signFenzhen(index) {
      if (this.rowData.doctorId !== this.officeInfoList[index].doctorId) {
        return;
      }
      // 确认签到
      try {
        if (
          this.rowData &&
          !this.rowData.patientId &&
          this.rowData.identificationNum
        ) {
          this.$message("该预约为无卡预约，请建档关联");
          return;
        }
        if (this.rowData && !this.rowData.regId) {
          this.$message.error("该预约未收费，请收费");
          return;
        }
        this.$showLoading();

        let appt = {
          appointmentId: this.rowData.appointmentId,
          visitCode: this.rowData.visitCode || '',
          rediagStatus: "",
          recordStatus: "",
          dataVersion: this.rowData.dataVersion,
          scheduleSerialId: this.rowData.scheduleSerialId
        };
        if (
          this.rowData.recordStatus >= 2 &&
            this.rowData.rediagStatus != "1" ||
          this.rowData.recordStatus >= 2 && !this.rowData.rediagStatus
        ) {
          appt.rediagStatus = "1";
        } else if (this.rowData.recordStatus == "1") {
          appt.recordStatus = "6";
        } else if (
          this.rowData.recordStatus >= 2 &&
          this.rowData.rediagStatus == "1"
        ) {
          this.$message.error("患者已签到");
          return;
        }

        const res = await service.signIn(appt);

        if (res.code === 1) {
          this.$message({ message: "签到成功", type: "success" });
          this.selectFlag = false;
          let ouptDeptId = this.deptIdFrom || this.rowData.ouptDeptId;
          this.$emit("updatePatient", {});
        }

        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "签到分诊接口报错");
      }
    },
    async fenzhenFunc(index) {
      this.$showLoading();
      try {
        if (this.rowData && !this.rowData.regId) {
          this.$hideLoading();
          this.$message.error("该预约未收费，请收费");
          return;
        }
        this.$showLoading();
        // 老接口参数
        let params_old = {
          recordStatus: "6",
          attendTime: new Date(),
          scheduleSerialId: this.officeInfoList[index].scheduleId,
          workCode: this.officeInfoList[index].workCode,
          doctorId: this.officeInfoList[index].doctorId,
          doctorName: this.officeInfoList[index].doctorName,
          appointmentId: this.rowData.appointmentId,
          dataVersion: this.rowData.dataVersion
        };
        const res = await service.apptTriage({ 
          appointmentId: this.rowData.appointmentId
        });
        if (res.code === 1) {
          this.$message({ message: "分诊成功", type: "success" });
          this.selectFlag = false;
          let ouptDeptId = this.deptIdFrom || this.rowData.ouptDeptId;
          this.$emit("updatePatient", {});
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "签到分诊接口报错");
      }
    },
    initData(ouptDeptId) {
      this.getDeptList(ouptDeptId);
    }
  },
  mounted() {},
  components: {}
};
</script>

<style lang='scss' scoped>
.main-con {
  padding: 0 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  .button-main {
    height: calc(100% - 240px);
    overflow-y: auto;
  }
  .mar-top-10 {
    margin-top: 10px;
  }
  .top {
    .office-info {
      .list-con {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .list-con-item {
          margin-right: 20px;
          margin-bottom: 20px;
          padding: 20px;
          width: 286px;
          height: 411px;
          box-sizing: border-box;
          background-color: $l-color-bgcolor-18;
          border-radius: 2px;
          .room {
            line-height: 20px;
            color: #2e323a;
            font-weight: bold;
            .room-name {
              font-size: 14px;
              i {
                font-style: normal;
                font-weight: 400;
              }
            }
            .office-name {
              font-size: 14px;
            }
          }
          .doc-info {
            padding-bottom: 20px;
            border-bottom: 1px solid #e4e4e4;
            .doc-name {
              font-size: 16px;
              line-height: 24px;
              font-weight: bold;
              color: #2e323a;
            }
            .doc-title {
              margin-left: 5px;
              font-size: 14px;
              color: #949da3;
            }
            .num {
              color: #2e323a;
              font-size: 16px;
              line-height: 21px;
              font-weight: bold;
            }
          }
          .patient-name {
            float: right;
          }
          .contains {
            width: 100%;
            padding-bottom: 20px;
            border-bottom: 1px solid #e4e4e4;
            .up-patient {
              margin-top: 20px;
              line-height: 20px;
              font-size: 14px;
              color: #949da3;
            }
            .current-patient {
              margin-top: 10px;
              line-height: 20px;
              font-weight: bold;
              font-size: 14px;
              color: #3d7dfb;
            }
            .next-patient {
              margin-top: 10px;
              line-height: 20px;
              font-size: 14px;
              color: #2e323a;
            }
          }
          .jiuzhen-numcom {
            padding: 20px 0;
            .visit-patient {
              margin-top: 10px;
              line-height: 20px;
              font-size: 14px;
              color: #949da3;
              span {
                color: #2e323a;
                line-height: 21px;
                font-weight: bold;
              }
            }
          }

          .button-con {
            .fenzhen-button {
              width: 100%;
              float: right;
            }
          }
        }
        .active {
          border: 2px solid $l-color-primary;
          box-sizing: border-box;
        }
      }
    }
  }
  .center {
    .fenzhen-info {
      font-size: 0;
      .box-left {
        display: inline-block;
        width: 70%;
        height: 100px;

        .office {
          background-color: #f3f6f9;
        }
        .office-name {
          display: inline-block;
          margin-top: 10px;
        }

        .bottom-item {
          width: 300px;
          margin-top: 10px;
        }
      }
      .common-title {
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(148, 157, 163, 1);
        line-height: 20px;
      }

      .box-right {
        display: inline-block;
        margin-left: 40px;
        width: calc(30% - 40px);
        height: 100px;
      }
    }
  }
  .bottom-con {
    height: 240px;
    border-top: 1px solid #e4e4e4;
  }
  .mar-top-20 {
    margin-top: 20px;
  }
  .mar-right-10 {
    margin-right: 10px;
  }
  .button-coms {
    font-size: 0;
  }
}
</style>
