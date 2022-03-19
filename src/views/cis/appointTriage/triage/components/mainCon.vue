<template>
  <div class="height100 width100 div-cont">
    <el-form class="height100" ref="ruleForm" :model="ruleForm" :rules="rules">
      <div class="order-list-contain height-button-main">
        <div class="row-con mar-right-20">
          <div class="top">
            <l-card-title>
              <template slot="left"
                >预约信息</template
              >
            </l-card-title>
            <el-row :gutter="20">
              <el-col :span="4">
                <p>
                  <span class="text-title">预约科室</span>
                  <span
                    class="text-contain"
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: patientObj.ouptDeptId
                    }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                  <span></span>
                </p>
              </el-col>
              <el-col :span="4"
                ><p>
                  <span class="text-title">门诊类型</span>
                  <span class="text-contain">{{
                    returnDiagTreatType(patientObj.diagTreatType)
                  }}</span>
                </p></el-col
              >
              <el-col :span="6"
                ><p>
                  <span class="text-title">医生名称</span>
                  <span class="text-contain">{{ patientObj.doctorName }}</span>
                </p>
              </el-col>
              <el-col :span="6">
                <p>
                  <span class="text-title">付费状态</span>
                  <span class="text-contain">{{
                    patientObj.regId ? "已付费" : "未付费"
                  }}</span>
                </p>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mar-top-10">
              <el-col :span="4">
                <p>
                  <span class="text-title">支付方式</span>
                  <span class="text-contain">{{
                    moneyTransform(patientObj.dataSource)
                  }}</span>
                </p>
              </el-col>
              <el-col :span="4"></el-col>
              <el-col :span="6"
                ><p>
                  <span class="text-title">预约时间</span>
                  <span class="text-contain">{{
                    patientObj.appointmentTime
                  }}</span>
                </p>
              </el-col>
              <el-col :span="6">
                <p>
                  <span class="text-title">签到状态</span>
                  <span class="text-contain">{{
                    returnSignStatus(patientObj.recordStatus)
                  }}</span>
                </p>
              </el-col>
            </el-row>
          </div>
          <div class="middle mar-top-20">
            <l-card-title>
              <template slot="left"
                >接诊信息</template
              >
            </l-card-title>
            <div class="jiezhen-info detail-text-show">
              <LSelectRequireWithTitle
                class="common-select-item"
                :title="titleFirst"
                @change="changePriority"
                prop="priority"
                :rules="rules.priority"
              >
                <template>
                  <el-option
                    v-for="item in optionsOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </template>
              </LSelectRequireWithTitle>
              <LSelectRequireWithTitle
                class="common-select-item"
                :title="titleSecond"
                prop="office"
                @change="changeOffice"
                :rules="rules.office"
              >
                <template>
                  <el-option
                    v-for="item in optionsTwo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </template>
              </LSelectRequireWithTitle>
              <LSelectRequireWithTitle
                class="common-select-item"
                :title="titleThree"
                prop="doc"
                @change="changeDocname"
                :rules="rules.doc"
              >
                <template>
                  <el-option
                    v-for="item in optionsThree"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </template>
              </LSelectRequireWithTitle>
              <LSelectRequireWithTitle
                class="common-select-item"
                :title="titleFour"
                prop="reason"
                @change="changeReason"
                :rules="rules.reason"
              >
                <template>
                  <el-option
                    v-for="item in optionsFour"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </template>
              </LSelectRequireWithTitle>
            </div>
          </div>
        </div>
      </div>
      <div class="buttom-down height-button-bottom">
        <el-button
          class="float-right mar-top-20 mar-right-20"
          @click="cancelOrder('ruleForm')"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="confirmOrder('ruleForm')"
          class="float-right mar-top-20 mar-right-10"
          >确认</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import LSelectRequireWithTitle from "./LSelectRequireWithTitle";
import { getDocList, postConfirm } from "@/api/cis/appointTriage/index.js";

export default {
  name: "",
  props: {
    patientObj: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isLoading: false,
      orderInfo: {
        office: "泌尿外科",
        menzhenType: "专家门诊",
        docName: "顾海学",
        payStatus: "已付费",
        payWay: "微信",
        cost: "150.00",
        orderTime: "2019-05-20 06:25",
        signStatus: "已签到"
      },
      titleFirst: "优先就诊",
      titleSecond: "接诊诊室",
      titleThree: "接诊医生",
      titleFour: "原因",
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
      optionsTwo: [],
      optionsThree: [],
      optionsFour: [
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
      rules: {
        priority: [
          { required: true, message: "请选择优先原因", trigger: "change" }
        ],
        office: [
          { required: true, message: "请选择接诊诊室", trigger: "change" }
        ],
        doc: [{ required: true, message: "请选择接诊医生", trigger: "change" }],
        reason: [{ required: true, message: "请选择原因", trigger: "change" }]
      },
      ruleForm: {
        priority: "",
        office: "",
        doc: "",
        reason: ""
      },
      returnInfo: {
        number: "3881231",
        name: "泌尿外科",
        visitTime: "2019-05-20 06:25",
        payTime: "2019-05-20 06:25"
      }
    };
  },
  mounted() {},
  methods: {
    changePriority(data) {
      this.ruleForm.priority = data;
    },
    changeOffice(data) {
      this.ruleForm.office = data;
      let obj = this.optionsTwo.find((item, index) => {
        return this.ruleForm.office === item.value;
      });
      let listArray = obj ? obj.doctorList : "";
      if (Array.isArray(listArray)) {
        this.optionsThree = listArray.map((item, index) => {
          return {
            value: Object.keys(item)[0],
            label: Object.values(item)[0]
          };
        });
      }
    },
    changeDocname(data) {
      this.ruleForm.doc = data;
    },
    changeReason(data) {
      this.ruleForm.reason = this.optionsFour.find(
        item => item.value === data
      ).label;
    },
    cancelOrder(formName) {
      // 取消分诊
      this.$refs[formName].resetFields();
    },
    moneyTransform(dataSource) {
      let proxyObj = {
        "1": "窗口现金",
        "2": "银行代码",
        "3": "自助机现金",
        "4": "微信",
        "5": "支付宝",
        "6": "APP"
      };
      return proxyObj[dataSource] ? proxyObj[dataSource] : "--";
    },
    returnSignStatus(signStatus) {
      let proxyObj = {
        "1": "预留",
        "2": "预约",
        "3": "已签到",
        "4": "等待",
        "5": "已呼叫",
        "6": "诊中",
        "7": "完成",
        "8": "患者自己取消",
        "9": "过号"
      };
      return proxyObj[signStatus] ? proxyObj[signStatus] : "";
    },
    returnDiagTreatType(diagTreatType) {
      let proxy = {
        "01": "平诊",
        "02": "急诊",
        "03": "方便",
        "04": "专家",
        "05": "特需"
      };
      return proxy[diagTreatType] ? proxy[diagTreatType] : "";
    },
    async getDocList() {
      let resData = await getDocList({
        ouptDeptId: this.patientObj.ouptDeptId || "",
        startDate: "",
        endDate: ""
      });
      if (resData.code === 1 && resData.data) {
        let responseData = resData.data;
        this.optionsTwo = [];
        for (let k in responseData) {
          this.optionsTwo.push({
            value: k,
            label: responseData[k].roomName,
            doctorList: responseData[k].doctors
          });
        }
      } else {
        this.$message.error("接口返回错误");
      }
    },
    confirmOrder(formName) {
      // 确认分诊
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            id: this.patientObj.id,
            recordRemark: this.ruleForm.reason,
            doctorId: this.ruleForm.doc,
            doctorName: this.optionsThree.find(
              item => this.ruleForm.doc === item.value
            ).label,
            dataVersion: this.patientObj.dataVersion,
            priority: this.ruleForm.priority
          };

          try {
            postConfirm(params).then(resData => {
              console.log(resData, "resData");
              if (resData.code === 1) {
                this.$message.success("分诊成功!!!");
                this.$refs[formName].resetFields();
              }
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    patientObj: {
      handler: function(val, oldVal) {
        this.getDocList();
      },
      immediate: true
    }
  },
  components: {
    LSelectRequireWithTitle
  }
};
</script>

<style lang='scss' scoped>
.div-cont {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  .order-list-contain {
    padding-left: 20px;
    overflow: auto;
  }
  .mar-top-20 {
    margin-top: 20px;
  }
  .mar-top-10 {
    margin-top: 10px;
  }
  .mar-right-10 {
    margin-right: 10px;
  }
  .mar-right-20 {
    margin-right: 20px;
  }
  .table-con {
    line-height: 24px;
    font-size: 16px;

    font-weight: bold;
    color: rgba(46, 50, 58, 1);

    .status-active {
      color: $l-color-primary;
    }
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
  .return-msg {
    .title {
      font-size: 14px;

      font-weight: bold;
      color: rgba(46, 50, 58, 1);
      line-height: 20px;
    }
    .return-detail {
      font-size: 20px;

      font-weight: 500;
      color: rgba(61, 125, 251, 1);
      line-height: 29px;
    }
  }

  .buttom-down {
    border-top: 1px solid #e4e4e4;
  }
  /deep/ .l-select-wrap {
    width: 250px;
  }
}
</style>
