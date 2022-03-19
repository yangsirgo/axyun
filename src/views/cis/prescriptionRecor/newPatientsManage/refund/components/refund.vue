<template>
  <div class="three-column" ref="page" id="main">
    <!--<div class="trigger" ref="triggerBtn" @click="shrinkHandler">-->
    <!--<i class="el-icon-arrow-left"></i>-->
    <!--</div>-->
    <div id="center" class="column">
      <div class="top">
        <seek-doctor-info :apptInfo="apptInfo"></seek-doctor-info>
      </div>
      <div class="center">
        <main-card :checkList="checkList" :checkedList="checkedList" @pass="pass"></main-card>
      </div>
    </div>
    <div id="left" class="column" ref="left">
      <patients-diagnosed-list @getApply="getApply"></patients-diagnosed-list>
    </div>
  </div>
</template>

<script>
import adHeight from "@/mixins/adHeight.js";
import patientsDiagnosedList from "./patientsDiagnosedList.vue";
import seekDoctorInfo from "./seekDoctorInfo.vue";
import mainCard from "./mainCard.vue";
import service from "@/api/cis/refund/refund.js";

export default {
  name: "refund.vue",
  mixins: [adHeight],
  components: {
    patientsDiagnosedList,
    seekDoctorInfo,
    mainCard
  },
  data() {
    return {
      apptInfo: {},
      // 待审批
      checkList: [],
      // 已审批
      checkedList: []
    };
  },
  watch: {
    apptInfo(val) {
      this.apptInfo = val;
    }
  },
  methods: {
    async getApply(obj) {
      this.apptInfo = { ...obj };
      // 拿到申请列表
      try {
        this.$showLoading();
        const { data } = await service.getApplyList({
          patientId: obj.patientId
        });
        let a = [];
        let b = [];
        if (data) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].applyRecordStatus == 0) {
              a.push(data[i]);
            } else {
              b.push(data[i]);
            }
          }
        }
        this.checkList = a;
        this.checkedList = b;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 审批
    async pass(obj) {
      try {
        this.$showLoading();
        const res = await service.passApply(obj);
        this.getApply(this.apptInfo);
        this.$hideLoading();
        this.$message({ message: "审批成功", type: "success" });
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    }
  }
};
</script>

<style scoped lang="scss">
$leftWidth: 500px;
$leftPartRight: 510px;
$rightWidth: 0px;
.three-column {
  min-width: 1024px;
  /*margin: 20px;*/
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
        /*overflow: hidden;*/
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
        padding: 246px 0 0;
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

  #right {
    margin-right: -$rightWidth;
    width: $rightWidth;
    padding-right: 0;
  }
}
</style>
