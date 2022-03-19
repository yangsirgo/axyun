<template>
  <div class="page  patient-penetrate-container style='overflow:auto'">
  <!-- <div class="page height100" style="overflow:auto"> -->
    <div class="patient-penetrate-box">

      <l-patient-info-item
        v-for="(item, index) in currentPatientsList"
        :key="'click'+index"
        :class="{
          'l-c-penetrate':true,
          'is-active': currentPenetrate === `${index}` && (receivePatientData.patientId == item.patientId) && (receivePatientData.nameFlag == name),
          }"
        @click.native="choosePenetrateItemWrapper(index, item)"
      >
        <template #top>
          <div class="patientBar">
            <div class="patientBar-left">
              <span
                class="code overflowEllipsis"
                :title="item.appointmentCode"
              >{{index + 1}}</span>
              <span
                :title="item.patientName"
                class="name overflowEllipsis margin-left-4"
              >{{ item.patientName }}</span>
              <span
                :val="item.patientGender"
                code="GENDER_CODE"
                v-codeTransform
                class="gender margin-left-4"
                v-if="item.patientGender"
              ></span>
              <span
                v-if="item.patientAge"
                class="gender margin-left-4"
              >
                {{ isNaN(item.patientAge) ? item.patientAge : item.patientAge + "岁" }}
              </span>
            </div>
          </div>
        </template>
        <template #bottom>
          <div
            class="show-patient-detail"
            v-if="type === 'top'"
          >
            <span>患者编号</span>
            <!--<span class="margin-left-4">{{ item.visitCode? item.visitCode : "&#45;&#45;" }}</span>-->
            <span class="margin-left-4">{{ item.patientCode? item.patientCode : "--" }}</span>
          </div>
          <div
            class="show-patient-detail"
            v-else-if="type === 'bottom'"
          >
            <count-down :start-time="countDownFun(item.scheduledTime,item.executedQuantity)"></count-down>
          </div>
        </template>
      </l-patient-info-item>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import countDown from "./Countdown.vue";

export default {
  props: ["data", "type", "radio", "name"],
  data() {
    return {
      currentPatientsList: [],
      currentPenetrate: ""
    };
  },
  components: { countDown },
  computed: {
    ...mapGetters("cis", ["dispTreatmentActiveTab"]),
    ...mapGetters("base", ["receivePatientData"])
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    countDownFun(startTime,theLength){
      let  remainTime = "";
      // 开始时间 +皮试时长 - 当前时间 = 剩下的去倒计时
      // 获取当前时间的时间戳   * 60 * 1000
      let timestamp=new Date().getTime();
      // 开始时间
      let start = Date.parse(startTime);
      let theLengthNum = Number(theLength) * 60 * 1000;
      remainTime = start + theLengthNum - timestamp;
      return remainTime

    },
    choosePenetrateItemWrapper(index, item) {
      this.currentPenetrate = `${index}`;
      if (this.radio == "first") {
        item.execType = "0";
      }
      if (this.radio == "second") {
        item.execType = "1";
      }
      this.changeRecPatientData({
        ...item,
        phoneNum: item.phoneNum || "",
        identificationNum: item.identificationNum || "",
        visitCode: item.visitCode || "",
        medicareCard: item.patientCode || "",//患者编码
        nameFlag: this.name
      });
    }
  },
  created() {},
  watch: {
    data(nVal) {
      this.currentPatientsList = nVal;
    }
  }
};
</script>

<style scoped lang="scss">
.patientBar {
  display: flex;
  align-items: center;
  .patientBar-left {
    flex: 1;
    width: 0;
    font-size: 0;
    > span {
      font-size: 14px;
    }
    > .code {
      font-weight: 700;
      text-align: center;
      color: #f05a23;
      max-width: 24px;
      display: inline-block;
      vertical-align: top;
    }
    .endBtn {
      float: right;
      top: calc(-100% + 3px);
      right: -26px;
      position: relative;
    }
    > .name {
      max-width: 42px;
      display: inline-block;
      vertical-align: top;
    }
  }
}

.patient-penetrate-box {
  padding-top: 8px;
  height: calc(100% - 8px);
  overflow: hidden;
  overflow-y: auto;
  .is-actiive {
    > .code {
      font-weight: 700;
      text-align: center;
      color: #f05a23;
    }

    > .name {
      font-weight: 400;
      text-align: center;
      color: #ffffff;
    }

    > .gender {
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      opacity: 0.8;
    }
  }
}
.l-c-penetrate {
  &.is-active {
    .code {
      font-weight: 700;
      text-align: center;
      color: #f05a23;
    }

    .name {
      font-weight: 400;
      text-align: center;
      color: #ffffff;
    }

    .gender {
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      opacity: 0.8;
    }

    .endBtn {
      right: -32px;
    }
  }

  .show-patient-detail {
    line-height: 1;
    font-size: 12px;
    color: #666c70;
  }
}
.has-penetrate {
  position: relative;
  z-index: 5;
  &.is-active {
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.l-c-penetrate-clone {
  position: absolute;
  right: $l-layout-space-max-;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  z-index: 4;
  .top,
  .bottom {
    * {
      opacity: 0;
    }
  }
}
.tooltip-content {
  line-height: $l-height-common-2;
  font-size: $l-font-size;
}

.overflowEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.margin-left-4 {
  margin-left: 4px;
}
</style>
