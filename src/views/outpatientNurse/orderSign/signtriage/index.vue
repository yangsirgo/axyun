<template>
  <div class="three-column">
    <div id="center" class="column">
      <div class="center">
        <main-card></main-card>
      </div>
    </div>
    <div id="left" class="column" ref="left">
      <today-wait-sign-patient
        @showSignmodel="showSignmodel"
      ></today-wait-sign-patient>
    </div>
  </div>
</template>
<script>
import todayWaitSignPatient from "./components/todayWaitSignPatient";

import mainCard from "./components/mainCard";

export default {
  components: {
    todayWaitSignPatient,
    mainCard
  },
  name: "index",
  data() {
    return {
      // mock 患者数据
      patientInfo: {
        patientMsg: {
          name: "张海军",
          sex: 0, // 男
          age: 31,
          outPatientNumber: "00256543",
          phoneNumber: "15210584911"
        },
        orderInfo: {
          outPatientOffice: "泌尿外科",
          outPatientType: "专家门诊",
          doctorName: "顾海学",
          ifCost: true,
          signTime: "08:30",
          signType: 0 // 未签到
        }
      }
    };
  },
  methods: {
    // 展示确认预约弹窗，异步获取数据
    showSignmodel(data) {
      const patientId = data.patientId;
      // TODO async request 异步获取患者数据

      this.isSignModelShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
$leftWidth: 500px;
$leftPartRight: 510px;
$rightWidth: 0px;
.three-column {
  min-width: 1024px;
  height: 100%;
  padding-left: $leftPartRight;
  padding-right: 0;

  .column {
    position: relative;
    float: left;
    height: 100%;
    padding: 0 0 0 10px;

    &#center {
      .top,
      .bottom {
        position: absolute;
        left: 0;
        width: 100%;
        padding: 0 0 0 10px;
        box-sizing: border-box;
      }

      .top {
        top: 0;
        height: 226px;
      }

      .center {
        height: 100%;
      }

      .bottom {
        bottom: 0;
        height: 233px;
      }
    }
  }

  #left {
    width: $leftWidth;
    margin-left: -100%;
    position: relative;
    right: $leftPartRight;
    padding-left: 0;
    display: block;
    box-sizing: content-box;
  }

  #center {
    width: 100%;
  }
}
</style>
