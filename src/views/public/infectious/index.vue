<template>
  <div class="infectionwrap width100 height100">
    <div class="infectionLeft">
      <infectionLeft
        ref="infectionLeft"
        @contentListFunRightData='contentListFunRightData'
        @addFun="addFun"
      ></infectionLeft>
    </div>
    <div class="infectionRight">
      <!-- <infectionMain
        ref='infectionMain'
        :contentListFunRight='contentListFunRight'
        @saveFoodBorneCard="saveFoodBorneCard"
        v-if='rightindex === "a"'
      ></infectionMain> -->
      <baokaForm
        ref="infectiousCard"
        :baokaFormData="baokaFormData"
        @submitBK="submitBK"
        v-if='rightindex === "a"'
      ></baokaForm>
      <infectionMainA
        ref="infectionMainA"
        :contentListFunRight='contentListFunRight'
        v-if='rightindex === "b"'
        @saveFoodBorneCard="saveFoodBorneCard"
      ></infectionMainA>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import infectionLeft from "./module/infectionLeft.vue";
import infectionMain from "./main.vue";
import infectionMainA from "./mainA.vue";
import baokaForm from "@/views/public/infectious/module/baokaForm.vue";
import baokaMixin from "@/views/public/infectious/mixins/baokaMixin.js";
import { mapGetters } from "vuex";
export default {
  mixins: [baokaMixin],
  components: {
    infectionLeft,
    infectionMain,
    infectionMainA,
    baokaForm
  },
  data() {
    return {
      // 右边组件显示和隐藏
      rightindex: "",
      // 食源性报卡数据
      contentListFunRight: {}
    };
  },
  computed: {
    ...mapGetters(["name", "receivePatientData"])
  },
  created() {},
  methods: {
    addFun(a) {
      this.rightindex = "";
      if (a == "a") {
        /* this.$nextTick(function() {
          this.$refs.infectionMain.refresh();
        }); */
        this.assignmentFun({
          cardSource: "",
          patientName: this.receivePatientData.patientName,
          pid: this.receivePatientData.patientId,
          inpNo: this.receivePatientData.visitCode,
          diagName: this.receivePatientData.diagName || "",
          diagTime: this.receivePatientData.diagTime || ""
        }, false);
      } else {
        this.$nextTick(() => {
          this.$refs.infectionMainA.restFun();
        });
        this.contentListFunRight = {};
      }
      this.rightindex = a;
    },
    contentListFunRightData(a, b) {
      this.rightindex = "";
      if (a == "a") {
        this.baokaFormData = this.handleData(b);
        /* this.$nextTick(function() {
          this.$refs.infectionMain.contentListFunRightFun();
        }); */
      } else {
        this.contentListFunRight = b;
        this.$nextTick(()=> {
          this.$refs.infectionMainA.contentListFunRightFun();
        });
      }
      this.rightindex = a;
    },
    submitBK(data) {
      this.refreshLeftList({
        ...data,
        activeName: "a"
      })
    },
    saveFoodBorneCard(data) {
      this.refreshLeftList({
        ...data,
        activeName: "b"
      })
    },
    // 左侧刷新
    refreshLeftList(data) {
      this.$refs.infectionLeft.reportCardInfoByPIdRefresh(data);
    }
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.rightindex = "";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.infectionwrap {
  display: flex;
  // align-items: center;
  justify-content: center;
  .infectionLeft {
    width: 20%;
  }
  .infectionRight {
    width: 80%;
  }
}
</style>
