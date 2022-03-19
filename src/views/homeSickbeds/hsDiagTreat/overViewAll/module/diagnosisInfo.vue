<template>
  <div class="page" ref="cardWrapper">
    <div class="pre" @click.stop="pre" v-if="btnShow">
      <span class="icon-botton">
        <i class="el-icon-arrow-left"></i>
      </span>
    </div>
    <div class="card-item-wrapper" ref="cardBox">
      <div v-if="list.length === 0" class="emptyCardBox">暂无</div>
      <div
        v-else
        class="card-item"
        v-for="(item, index) in list"
        :key="index"
        ref="cardItem"
      >
        <p class="card-item-title">{{ item.message }}</p>
        <div class="card-item-content">
          <span
            class="no"
            @click="pushAxEditor(item)"
            v-if="item.remindType === '-1'"
            >{{ item.count }} 份</span
          >
          <el-button type="primary" @click="pushPath(item.url)" v-else>{{
            item.buttonContent
          }}</el-button>
          <!-- <span class="unit">{{ item.unit }}</span> -->
        </div>
      </div>
    </div>
    <div class="next" @click.stop="next" v-if="btnShow">
      <span class="icon-botton">
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getListAlert } from "@/api/third/third.js";
import { getTaskSum } from "@/api/emrRecord/ipnw/third.js";
import { mapActions, mapGetters } from "vuex";
let remindTypes = {
  "1": {
    defines: "年度未体检提醒",
    buttonContent: "去体检"
  },
  "2": {
    defines: "高血压随访提醒",
    buttonContent: "去随访"
  },
  "3": {
    defines: "其它重点人群（老、糖）随访提醒",
    buttonContent: "去随访"
  },
  "4": {
    defines: "签约/续约提醒",
    buttonContent: "去签约"
  }
};
export default {
  name: "diagnosisInfo",
  components: {},
  data() {
    return {
      btnShow: false,
      list: [
        {
          no: 1,
          title: "书写首日病程剩余",
          unit: "h"
        },
        {
          no: 2,
          title: "书写建床记录剩余",
          unit: "h"
        },
        {
          no: 3,
          title: "未读检验报告",
          unit: "篇"
        },
        {
          no: 4,
          title: "高血压随访时间",
          unit: ""
        },
        {
          no: 5,
          title: "待体检时间",
          unit: "年度"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      async handler() {
        this.list = [];
        await this.getTaskSum();
        await this.getListAlert();
      }
    },
    list: {
      deep: true,
      // immediate: true,
      handler() {
        this.setBtnShow();
      }
    }
  },
  methods: {
    // 获取电子病历待书写
    async getTaskSum() {
      if (
        !this.receivePatientData.patientId ||
        !this.receivePatientData.treatNo
      ) {
        return;
      }
      let params = {
        paId: this.receivePatientData.patientId,
        enNo: this.receivePatientData.treatNo
      };
      try {
        let res = await getTaskSum(params);
        if (res.count) {
          let obj = {
            count: res.count,
            remindType: "-1",
            message: "待书写病历"
          };
          this.$set(this.list, this.list.length, obj);
        }
      } catch (error) {}
    },
    // 获取公卫待办事项
    async getListAlert() {
      if (!this.receivePatientData.identificationNum) {
        return;
      }
      let params = {
        identificationType: this.receivePatientData.identificationType,
        identificationNum: this.receivePatientData.identificationNum
      };
      try {
        let res = await getListAlert(params);
        // let res = {"code":"SUCCESS","data":[{"message":"签约即将到期","url":"https://lhysk.medcaastest.city.pingan.com/phos/publicHealth?type=signContract&identificationType=1&identificationNum=110101194003073973","remindType":"4"}],"msg":"成功","success":true}
        if (res.code === "SUCCESS" && res.data.length) {
          let data = res.data;
          let list = [];
          for (let i in data) {
            list.push({
              ...data[i],
              buttonContent: remindTypes[data[i].remindType].buttonContent
            });
          }
          this.list = this.list.concat(list);
        }
      } catch (error) {}
    },
    //跳转方法
    pushPath(urls) {
      window.open(urls);
    },
    pushAxEditor(item) {
      // if (parseFloat(item.count) !== 1) {
      //   this.$router.push({
      //     path: "/hsDiagTreat/homeBedRecord/homeBedRecordPage",
      //     query: {
      //       paId: this.receivePatientData.patientId,
      //       enId: this.receivePatientData.treatNo
      //     }
      //   });
      // } else {
      //   this.$router.push({
      //     path: "/hsDiagTreat/homeBedRecord/waitWriteRecord",
      //     query: {
      //       patientId: this.receivePatientData.patientId,
      //       enId: this.receivePatientData.treatNo,
      //       patientName: this.receivePatientData.patientName
      //     }
      //   });
      // }
      // TODO: 默认跳转到待书写列表
      this.$router.push({
        path: "/hsDiagTreat/homeBedRecord/waitWriteRecord",
        query: {
          patientId: this.receivePatientData.patientId,
          enId: this.receivePatientData.treatNo,
          patientName: this.receivePatientData.patientName
        }
      });
    },
    // 左右箭头显示与功能
    setBtnShow() {
      this.$nextTick(() => {
        try {
          let cardWrapper = this.$refs.cardWrapper.clientWidth;
          let cardItem = this.$refs.cardItem[0].clientWidth;
          if (cardItem * this.list.length > cardWrapper) {
            this.btnShow = true;
          } else {
            this.btnShow = false;
          }
        } catch (error) {}
      });
    },
    pre() {
      this.$nextTick(() => {
        console.log("dianjile");
        this.$refs.cardBox.scrollLeft = 0;
      });
    },
    next() {
      this.$nextTick(() => {
        console.log("dianjile");
        this.$refs.cardBox.scrollLeft = this.$refs.cardBox.clientWidth;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  height: 62px;
  // overflow: hidden;
  flex-wrap: nowrap;
  display: flex;
  margin: 8px 0px;
  font-size: 0;
  .pre,
  .next {
    // width: 24px;
    display: inline-flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    .icon-botton {
      width: 24px;
      height: 24px;
      display: flex;
      font-size: 20px;
      align-items: center;
      justify-content: center;
    }
    .disabled-icon-botton {
      color: #f5f7fa;
      cursor: not-allowed;
    }
  }

  .pre {
    padding-right: 20px;
  }
  .next {
    padding-left: 20px;
  }
  .card-item-wrapper {
    flex: 1;
    display: inline-flex;
    height: 100%;
    scroll-behavior: smooth;
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
    }
    .card-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 0 0 181px;
      border-left: 1px solid #e4e4e4;
      padding: 0 4px;
      .card-item-title {
        font-size: 14px;
        font-weight: 400;
        color: #949da3;
        line-height: 17px;
        flex: 1;
      }
      .card-item-content {
        flex: 1;
        .no {
          font-size: 20px;
          font-weight: 500;
          margin-right: 4px;
          font-family: DINPro-Regular;
          text-align: left;
          padding: 3px;
          color: #4f80ff !important;
          border-bottom: 1px solid #4f80ff;
          line-height: 20px;
          cursor: pointer;
        }
        .unit {
          font-size: 14px;
          font-weight: 400;
          color: #2e323a;
          // line-height: 18px;
          vertical-align: super;
        }
      }
    }
  }
}

.emptyCardBox {
  font-size: 14px;
  text-align: center;
  flex: 1;
  line-height: 42px;
}
</style>
