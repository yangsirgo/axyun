<template>
  <div class="height100">
    <div
      class="bottom-center height100"
      :style="{ paddingRight: rightWidth + 'px' }"
    >
      <medical-order></medical-order>
    </div>
    <div class="bottom-tool fr height100">
      <tools
        boxName="PrescriptionTemplete"
        @show="toolToggle"
        :modules="modules"
        style="border: none"
      />
    </div>
  </div>
</template>

<script>
import Tools from "@/views/public/tools/index";
import medicalOrder from "./components/medicalOrderMain.vue";
import { mapGetters } from "vuex";

export default {
  name: "diagnosis",
  components: {
    Tools,
    medicalOrder
  },
  data() {
    return {
      rightWidth: "72", // 工具栏收起显示, 工具栏收起宽度：52 放出宽度： 289
      modules: [
        "PrescriptionTemplete",
        "PreviousPrescriptions",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "Knowledge"
      ]
    };
  },
  methods: {
    toolToggle(val) {
      this.rightWidth = val ? "309" : "72";
    }
  },
  computed: {
    ...mapGetters("residentStation", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(n) {
        console.log("ad:", n);
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.bottom-center {
  padding-right: 62px;
  width: 100%;
}

.bottom-tool {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
