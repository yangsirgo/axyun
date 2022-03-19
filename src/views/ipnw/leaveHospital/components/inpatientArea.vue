<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false" :hospState="false" code="3"></left-bar>
      </template>
      <template #content>
        <el-card class="height100">
          <div class="recall-content-box height100">
            <div class="height-button-main">
              <ul>
                <li>
                  <p>
                    <span class="black em">{{receivePatientData.bedCode || '--'}}床</span>
                    <span class="black em">{{receivePatientData.patientName || '--'}}</span>
                    <span v-if="receivePatientData.patientGender"
                      class="black em"
                      :val="receivePatientData.patientGender"
                      code="GENDER_CODE"
                      v-codeTransform
                    >--</span>
                    <span class="black em">{{receivePatientData.patientAge || '--'}}</span>
                    <span class="blue em">{{receivePatientData.inpCode || '--'}}</span>
                  </p>
                </li>
              </ul>

              <div class="user-info">
                <div class="title">
                  <i></i>
                  <b>患者信息</b>
                </div>
                <div class="info">
                  <div>
                    <p v-for="(item, i) in patientInfoKey" :key="i">
                      <span class="babel">{{item.label}}</span>
                      <span
                        v-if="item.key === 'patientGender'"
                        :val="patientInfo[item.key]"
                        code="GENDER_CODE"
                        v-codeTransform
                      ></span>
                      <span v-else-if="item.key == 'prepayBalance'" class="color2">{{patientInfo[item.key]}}</span>
                      <span v-else-if="item.key == 'inpCode'" class="color1">{{patientInfo[item.key]}}</span>
                      <span
                        v-else-if="item.key === 'settlementType'"
                        :val="patientInfo[item.key]"
                        code="MEDICAL_INSURANCE_CODE"
                        v-codeTransform
                      ></span>
                      <span v-else-if="item.key == 'patientAge'">{{receivePatientData.patientAge}}</span>
                      <template v-else-if="item.key === 'inpSdeptId'">
                        <span
                          v-if="patientInfo[item.key]"
                          tableName="sys_org"
                          :conditionMap="{org_type: '_DEPT_', id: patientInfo[item.key]}"
                          columns="org_nm"
                          v-tableTransform
                          ></span>
                        <span v-else>--</span>
                      </template>
                      <span v-else-if="item.key === 'selfPayAmount'">{{patientInfo[item.key] || '0.00'}}</span>
                      <span v-else :style="item.style">{{patientInfo[item.key] || '--'}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="out-info">
                <div class="title">
                  <i></i>
                  <b>出院信息</b>
                </div>
                <div class="info" style="margin-bottom: 0;">
                  <p>
                    <l-formt-title label="出院日期" required>
                      <el-date-picker
                        v-model="form.wdeptDischargeTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间"
                      ></el-date-picker>
                    </l-formt-title>
                  </p>
                  <p style="background-color:white">
                    <l-formt-title label="出院病情" required>
                      <l-value-domain
                        code="dischargeSituation"
                        :value.sync="form.dischargeSituation"
                        class="select-container"
                        placeholder
                        :disabled="true"
                      />
                    </l-formt-title>
                  </p>
                </div>
              </div>
              <div class="out-info">
                <l-formt-title label="出院说明" style="width: 490px" required>
                  <el-input v-model="form.dischargeInstructions" placeholder readonly="true"></el-input>
                </l-formt-title>
              </div>
            </div>
          </div>
          <div class="height-button-bottom text-align-right">
            <!-- <el-button type="primary" style="border-radius: 2px;" @click="check">预出院检查</el-button> -->
            <el-button
              type="primary"
              style="border-radius: 2px;"
              v-hotKey="{func: 'func_submit', flag: 'isLoading'}"
              @click="confirm"
            >确认出院</el-button>
            <!-- <el-button type="primary" plain @click="cancel ">取 消</el-button> -->
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getPatientInfo, confirmLeaveHos ,patientLeaveInfo} from "@/api/ipnw/leaveHos";
import LeftBar from "../leftBar/inpatientAreaLeftBar";
export default {
  name: "inpatientArea",
  components: {
    LeftBar
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  data() {
    return {
      isLoading: false,
      formParams: [
        "CourtyardArea",
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      form: {
        wdeptDischargeTime: null,
        dischargeSituation: "",
        dischargeInstructions: ""
      },
      patientInfo: {
        status: "--"
      },
      patientInfoKey: [
        {
          label: "住院号",
          key: "inpCode",
          style: {
            color: "#3D7DFB"
          }
        },
        {
          label: "姓名",
          key: "patientName",
          style: {}
        },
        {
          label: "性别",
          key: "patientGender",
          style: {}
        },
        {
          label: "年龄",
          key: "patientAge",
          style: {}
        },
        {
          label: "床号",
          key: "bedCode",
          style: {}
        },
        {
          label: "当前科室",
          key: "inpSdeptId",
          style: {}
        },
        {
          label: "结算类型",
          key: "settlementType",
          style: {}
        },
        {
          label: "身份证号",
          key: "identificationNum",
          style: {}
        },
        {
          label: "入院日期",
          key: "wdeptAdmissionTime",
          style: {}
        },
        {
          label: "出院日期",
          key: "wdeptDischargeTime",
          style: {}
        },
        // {
        //   label: "住院状态",
        //   key: "status",
        //   style: {}
        // },
        {
          label: "费用总额",
          key: "selfPayAmount",
          style: {
            fontWeight: "bold"
          }
        },
        {
          label: "预交金",
          key: "selfPayPrepay",
          style: {
            fontWeight: "bold"
          }
        },
        {
          label: "余额",
          key: "prepayBalance",
          style: {
            color: '#2B4583FF',
            fontWeight: "bold"
          }
        }
      ],
      toolBoxs: ["leaveCost"]
    };
  },
  methods: {
    ...mapActions({
      changeSearchAgainKey: "base/changeSearchAgainKey"
    }),

    dischargedInfo(){
      this.form={
        wdeptDischargeTime: null,
          dischargeSituation: "",
        dischargeInstructions: ""
      }
    },
    async getInfo(info) {
      this.dischargedInfo();
      if (!info.inpCode) {
				this.patientInfo = {
					status: '',
					inpSdeptId: '',
					settlementType: '',
					patientGender: ''
				}
				return false;
			}
      try {
        let { code, data, msg } = await getPatientInfo(info.inpCode);
        if (code === 1) {
          this.patientInfo = {
            ...this.patientInfo,
            ...data
          };
        } else {
          this.$message.error(msg);
        }
      } catch (error) {}
    },
      //病人出院信息，同步医生填写的出院医嘱
    async getpatientLeaveInfo(){
        try{
          let params = {
            inpCode: this.receivePatientData.inpCode,
            patientId: this.receivePatientData.patientId
          };
          let {code,data,msg}=await patientLeaveInfo(params);
          if (code===1){
            this.form={
              dischargeSituation: data.leaveExplain,
              dischargeInstructions: data.leaveNillness
            }
          }else{
            this.$message.error(msg)
          }
        }catch (error) {}
    },

    async confirm() {
      // 确认操作按钮
      if (!this.receivePatientData.inpCode) {
        this.$message.warning("请选择患者！");
        return false;
      }
      if (
        !this.form.wdeptDischargeTime
      ) {
        this.$message.warning("请选择出院时间！");
        return false;
      }
      if(!this.form.dischargeSituation) {
        this.$message.warning("请选择出院病情！");
        return false;
      }
      if(!this.form.dischargeInstructions){
        this.$message.warning("请输入出院说明！");
        return false;
      }
      let params = {
        inpCode: this.receivePatientData.inpCode,
        ...this.form
      };
      let { code, data, msg } = await confirmLeaveHos(params);
      if (code === 1) {
        this.changeSearchAgainKey(+new Date());
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    cancel() {
      // 取消操作按钮
    },
    check() {
      // 预出院检查按钮
    },
    messageHandler() {
      consle.log("工具箱消息");
    }
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        console.log(val); // 监听 患者 ID 变化 触发事件
        this.getInfo(val);
        this.getpatientLeaveInfo();
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.color1{
  color: $l-color-primary;
}
.color2{
  color: $l-color-fontcolor-2
}
.height-button-bottom {
  border-top: 1px solid $l-color-bgcolor-18;
  padding: 19px 20px 0;
}
.recall-content-box {
  // border-top: 1px solid #E4E4E4;
  height: calc(100% - 75px);
  padding: 0 20px;
  .title {
    font-size: 16px;
    
    font-weight: 500;
    color: $l-color-fontcolor-3;
    i {
      display: inline-block;
      width: 4px;
      height: 20px;
      background: $l-color-primary1;
      margin-right: 5px;
      position: relative;
      top: 4px;
    }
  }
  ul {
    li {
      height: 60px;
      font-size: 16px;
      
      font-weight: bold;
      color: $l-color-fontcolor-3;
      line-height: 24px;
      p {
        margin: 0;
        line-height: 60px;
        span {
          padding: 0 5px;
        }
        .black {
          color: $l-color-fontcolor-3;
        }
        .blue {
          color: $l-color-fontcolor-2;
        }
        .gray {
          color: $l-color-fontcolor-4;
        }
        .em {
          font-weight: 600;
        }
        img {
          width: 60px;
        }
      }
    }
  }
  .user-info {
    .info {
      margin: 10px 0;
      & > div {
        overflow: hidden;
        p {
          width: 240px;
          font-size: 14px;
          line-height: 20px;
          margin: 10px 0;
          float: left;
          .babel {
            color: $l-color-fontcolor-4;
            display: inline-block;
            width: 56px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .out-info {
    .info {
      margin: 20px 0;
      overflow: hidden;
      & > p {
        width: 240px;
        height: 36px;
        line-height: 36px;
        /*border: 1px solid #e4e4e4;*/
        border-radius: 2px;
        margin-right: 10px;
        margin-bottom: 10px;
        float: left;
        color: $l-color-fontcolor-3;
        background: $l-color-bgcolor-14;
        .babel {
          color: $l-color-fontcolor-4;
          margin-left: 10px;
          margin-right: 10px;
          padding-right: 10px;
          border-right: 1px solid $l-color-bgcolor-11;
        }
      }
      & > p:first-child {
        margin-left: 0px;
      }
    }
  }
}
</style>
