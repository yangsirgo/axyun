<template>
  <electron-apply
    :choose="temShowData"
    ref="electronApply"
    :ele-type="1"
    hosType="1"
  ></electron-apply>
</template>

<script>
import { mapGetters } from "vuex";
import electronApply from "@/views/public/electronApply/applyindex.vue";

export default {
  name: "",
  components: {
    electronApply
  },
  data() {
    return {
      temShowData: ""
    };
  },
  methods: {
    messageHandler(val) {
      this.temShowData = val;
    },
    getTestApplyApplicatNSlectList() {
      let aaa = [];
      try {
        // 检验申请 未提交的数据
        aaa = this.$refs.electronApply.getTestApplyApplicatNSlectList();
      } catch (error) {}
      return aaa;
    },
    getInspectApplyNSlectList() {
      let bbb = [];
      try {
        // 检查申请 未提交的数据
        bbb = this.$refs.electronApply.getInspectApplyNSlectList();
      } catch (error) {}
      return bbb;
    },
    hasNewSlectList() {
      console.log("执行了1");

      let aaa = this.getTestApplyApplicatNSlectList();
      let bbb = this.getInspectApplyNSlectList();

      return aaa.length > 0 || bbb.length > 0;
    },
    // 未提交的项目 进行提交
    applicationSub() {
      return new Promise(async (resolve, reject) => {
        let aaa = this.getTestApplyApplicatNSlectList();
        let bbb = this.getInspectApplyNSlectList();

        //  检验申请提交方法
        if (aaa.length > 0) {
          try {
            await this.$refs.electronApply.applicationSub();
            resolve(true);
          } catch (error) {
            reject(false);
          }
        }

        if (bbb.length > 0) {
          try {
            //  检查申请提交方法
            await this.$refs.electronApply.applicationInspectSub();
            resolve(true);
          } catch (error) {
            console.log("报错了3");
            reject(false);
          }
        }
      });
    }
  },
  computed: {
    ...mapGetters("eleApply", ["eleTemType"]),
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cdss", ["CdssCode"])
  },
  watch: {
    eleTemType: {
      handler(n) {
        console.log(`n---------`, n);
        // type:0 表示门诊
        // console.log("eleTemType", n);
        // 动态设置右侧智能助手显示的条目
        if (n == 1 || n == 4) {
          let boxsList = ["Hotkey"];
          let flagTemp1 = false;
          if (this.CdssCode == 0) {
            return;
          }
          for (let i = 0; i < boxsList.length; i++) {
            const el = boxsList[i];
            if (el === "CDSSComponent") {
              flagTemp1 = false;
              break;
            } else {
              flagTemp1 = true;
            }
          }
          if (flagTemp1) {
            if (this.CdssCode == 1) {
              boxsList.unshift("CDSSComponent");
            } else {
              boxsList.splice(1, 0, "CDSSComponent");
            }
          }
          this.$emit("toolBoxsChange", boxsList);
          // this.toolBoxs = ["HistoricalDiagnosis", "Hotkey"]
        } else {
          // this.toolBoxs = ["checkTemp", "HistoricalDiagnosis", "Hotkey"]
          this.$emit("toolBoxsChange", ["checkTemp", "Hotkey"]);
        }
        // console.log("this.toolBoxs", this.toolBoxs);
        // let applyParams = {
        //   id: n.triageAppointmentId,
        //   type: "0",
        //   patientId: n.patientId
        // };
        // if (
        //   this.$refs.electronApply &&
        //   this.$refs.electronApply.setPatientInfo
        // ) {
        //   this.$refs.electronApply.setPatientInfo(applyParams);
        // }
      },
      immediate: true,
      deep: true
    }
    // receivePatientData: {
    //   //深度监听，可监听到对象、数组的变化
    //   handler(n) {
    //     // type:0 表示门诊
    //     console.log("triageAppointmentId", n.triageAppointmentId);
    //     let applyParams = {
    //       id: n.triageAppointmentId,
    //       type: "0",
    //       patientId: n.patientId
    //     };
    //     if (
    //       this.$refs.electronApply &&
    //       this.$refs.electronApply.setPatientInfo
    //     ) {
    //       this.$refs.electronApply.setPatientInfo(applyParams);
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  mounted() {
    /* type:0 表示门诊*/
    /*  let applyParams = { id: "", type: "0" };
      this.$refs.electronApply.initApply(applyParams); */
  }
};
</script>

<style scoped lang="scss"></style>
