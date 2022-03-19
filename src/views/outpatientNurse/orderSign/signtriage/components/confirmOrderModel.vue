<template>
  <div v-show="show" class="sign-confirm-model">
    <el-dialog
      title="预约签到确认"
      :visible.sync="dialogVisible"
      width="620px"
      :before-close="handleClose"
    >
      <div class="sign-confirm-middle">
        <div class="patient-info-con common-show">
          <p class="common">患者信息</p>
          <div class="patient-info detail-text-show">
            <p class="line-common">
              <span class="patient-item  first">
                <span class="name">姓名</span>
                <span
                  >{{ currentPatientInfo.patientInfo.patientName }}（{{
                    currentPatientInfo.patientInfo.sex === 0 ? "女" : "男"
                  }}，{{ currentPatientInfo.patientInfo.age }}岁）</span
                >
              </span>
              <span class="patient-item  second">
                <span class="name">门诊号</span>
                <span>{{ currentPatientInfo.patientInfo.outPNum }}</span>
              </span>
              <span class="patient-item  three">
                <span class="name">手机号</span>
                <span>{{ currentPatientInfo.patientInfo.phoneNum }}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="patient-order-con common-show">
          <p class="common">预约信息</p>
          <div class="order-info detail-text-show">
            <p class="line-common">
              <span class="patient-item  first">
                <span class="name">门诊名称</span>
                <span>{{ currentPatientInfo.orderInfo.outPName }}</span>
              </span>
              <span class="patient-item  second">
                <span class="name">门诊类型</span>
                <span>{{ currentPatientInfo.orderInfo.outPType }}</span>
              </span>
              <span class="patient-item  three">
                <span class="name">专家名称</span>
                <span>{{ currentPatientInfo.orderInfo.expertName }}</span>
              </span>
            </p>
            <p class="line-common">
              <span class="patient-item  first">
                <span class="name">付费状态</span>
                <span class="pay-status">{{
                  currentPatientInfo.orderInfo.payStatus === 1
                    ? "已付费"
                    : "未付费"
                }}</span>
              </span>
              <span class="patient-item  second">
                <span class="name">预约时间</span>
                <span>{{ currentPatientInfo.orderInfo.signTime }}</span>
              </span>
              <span class="patient-item  three">
                <span class="name">签到状态</span>
                <span class="sign-status">{{
                  currentPatientInfo.orderInfo.signStatus === 1
                    ? "已签到"
                    : "未签到"
                }}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="patient-order-con common-show">
          <p class="common">接诊信息</p>
          <div class="jiezhen-info detail-text-show">
            <LSelectRequireWithTitle
              class="common-select-item"
              :title="titleFirst"
              :value="optionFirst"
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
              :value="optionSecond"
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
              :value="optionThree"
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
          </div>
        </div>
      </div>
      <div slot="footer" class="sign-confirm-footer">
        <span class="sign-consult-msg">
          回诊信息: 患者在{{ nextPatientInfo.queueNum }}号
          {{ nextPatientInfo.nextPatientName }} ({{
            nextPatientInfo.nextSex === 1 ? "男" : "女"
          }}, {{ nextPatientInfo.nextAge + "岁" }}) 后一位
        </span>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">签到</el-button>
          <el-button @click="handleCancelOrder">取消预约</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import LSelectRequireWithTitle from "./LSelectRequireWithTitle";

export default {
  components: {
    LSelectRequireWithTitle
  },
  props: {
    show: Boolean,
    patientid: Number
  },
  computed: {
    dialogVisible() {
      return this.show;
    }
  },
  data() {
    return {
      // 下一位患者信息
      nextPatientInfo: {
        nextPatientName: "刘新宇", // 下一位患者姓名
        queueNum: "78", // 排队号
        nextSex: 1, // 1  男 0 女
        nextAge: 29
      },
      // 当前患者信息
      currentPatientInfo: {
        patientInfo: {
          patientName: "张海军",
          sex: 1,
          age: 31,
          outPNum: "00256543", //门诊号
          phoneNum: "15210584911" //手机号
        },
        // 预约信息
        orderInfo: {
          outPName: "泌尿外科", // 门诊名称
          outPType: "专家门诊", // 门诊类型
          expertName: "5210512", // 专家名称
          payStatus: 1, // 已付费  1， 未付费 0
          signTime: "08:30", // 签到时间
          signStatus: 0 // 签到状态： 0 未签到 1 已签到
        }
      },
      titleFirst: "优先就诊",
      optionFirst: "",
      titleSecond: "接诊诊室",
      optionSecond: "",
      titleThree: "接诊医生",
      optionThree: "",
      optionsOne: [
        {
          value: "选项1",
          label: "军人优先"
        }
      ],
      optionsTwo: [
        {
          value: "选项1",
          label: "诊室一"
        }
      ],
      optionsThree: [
        {
          value: "选项1",
          label: "林浩然"
        }
      ]
    };
  },
  updated() {
    this.getPatientOrderInfo();
  },
  methods: {
    handleClose() {
      this.$emit("closeConfirmSign", {
        flag: false
      });
    },
    // 获取患者预约信息接口
    getPatientOrderInfo() {
      // TODO: 获取患者预约信息接口
      try {
        let patientId = this.patientid;
      } catch (error) {}
    },
    // 点击 取消按钮
    handleCancelOrder() {
      // 获取签到时间
      let signTime = this.currentPatientInfo.orderInfo.signTime;
      this.$confirm(
        `<p style='position:rerelative;padding-top :60px;'><span style='color: rgba(61, 125, 251, 1);position:absolute;top:28px;'> <span>取消预约</span><br/>取消【预约时间：${signTime}】的预约？</span></p>`,
        {
          customClass: "freedom-set-confirm",
          dangerouslyUseHTMLString: true,
          cancelButtonText: "再看看",
          confirmButtonText: "取消预约",
          showClose: false,
          type: "warning"
        }
      )
        .then(() => {
          // TODO: 取消预约相关逻辑 调用后台接口

          // 弹窗显示
          this.$notify({
            type: "success",
            title: "取消预约成功",
            showClose: false,
            position: "bottom-right"
          });
        })
        .catch(() => {
          // 关闭弹窗
        });
      // 关闭弹窗
      this.handleClose();
    },
    // 点击 确认按钮
    handleConfirm() {
      // 关闭弹窗
      this.handleClose();
      // 两种情况  签到成功  或者 是 重复签到
      // 异步请求接口 async  request 后根据返回的值进行处理
      let flag = false;
      if (flag) {
        this.$notify({
          type: "success",
          title: "签到成功",
          showClose: false,
          position: "bottom-right"
        });
      } else {
        this.$confirm("【刘明，序号：23】签到重复", "提示", {
          customClass: "repeatTips",
          confirmButtonText: "知道了",
          showCancelButton: false,
          showClose: false,
          type: "warning",
          center: false
        }).then(() => {});
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.sign-confirm-model {
  .sign-confirm-middle {
    padding: 20px;
    .common-show {
      .common {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
      }
    }
    .patient-order-con {
      margin-top: 40px;
    }
    .detail-text-show {
      font-size: 0;
      .line-common {
        margin-top: 20px;
        
        font-weight: 400;
        .patient-item {
          font-size: 14px;
          color: rgba(46, 50, 58, 1);
          line-height: 20px;
          .name {
            
            font-weight: 400;
            color: rgba(148, 157, 163, 1);
          }
        }
        .first {
          display: inline-block;
          width: 244px;
          .pay-status {
            color: #3d7dfb;
          }
        }
        .second {
          display: inline-block;
          width: 201px;
        }
        .three {
          .sign-status {
            color: $l-color-primary;
          }
        }
      }
    }
    .jiezhen-info {
      margin-top: 20px;
      .common-select-item {
        width: 186px;
      }
      .common-select-item:nth-child(n + 2) {
        margin-left: 10px;
      }
    }
  }
  .sign-confirm-footer {
    .sign-consult-msg {
      float: left;
      line-height: 36px;
      font-size: 14px;
      
      font-weight: 500;
      color: #949da3;
    }
  }

  /deep/ .l-select-wrap {
    width: 100px;
  }
  /deep/ .el-select {
    width: 100px;
  }
  /deep/ .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }
  /deep/ .el-message-box {
    padding: 30px;
  }
  /deep/ .el-message-box__btns {
    padding-top: 50px;
  }
}
</style>
