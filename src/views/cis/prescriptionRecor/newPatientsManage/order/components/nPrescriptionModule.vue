<template>
  <el-card class="height100 wrapper-tabs">
    <el-tabs
      tab-position="left"
      type="border-card"
      class="height100 inner el-tabs-new-style fixed-shanshuo"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="医嘱开立" name="adviceTable">
        <!-- <keep-alive> -->
        <advice-table
          ref="adviceTable"
          v-if="activeName === 'adviceTable'"
        ></advice-table>
        <!-- </keep-alive> -->
      </el-tab-pane>
      <el-tab-pane label="中草药" name="chmMedicine">
        <!-- <keep-alive> -->
        <chm-medicine
          v-if="activeName === 'chmMedicine'"
          moduleType="cis"
        ></chm-medicine>
        <!-- </keep-alive> -->
      </el-tab-pane>
      <!--<el-tab-pane label="中草药clone" name="chmMedicineClone">-->
      <!--<cloneChmMedicine  v-if="activeName === 'chmMedicineClone'" moduleType="cis"></cloneChmMedicine>-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="治疗医嘱" name="treatMedicine">
        <!-- <keep-alive> -->
        <advice-table
          tabsName="treatMedicine"
          v-if="activeName === 'treatMedicine'"
        ></advice-table>
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import adviceTable from "./presModule/doctorAdviceTable.vue";
import chmMedicine from "@/views/cis/prescriptionRecor/newPatientsManage/order/chinaMedicinalHerb/components/chmMedicine.vue";
import cloneChmMedicine from "@/views/ipnw/medicalAdvice/order/components/cloneChmMedicine.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "prescriptionModule",
  components: { adviceTable, chmMedicine, cloneChmMedicine },
  data() {
    return {
      activeName: "adviceTable"
    };
  },
  created() {},
  mounted() {
    this.handleClick();
  },
  methods: {
    ...mapActions({
      setPsRegorActiveTabName: "cis/setPsRegorActiveTabName",
      setMultipleSelections: "cis/setMultipleSelections"
    }),
    saveHandle() {
      this.$refs.adviceTable && this.$refs.adviceTable.saveHandle();
    },
    handleClick() {
      this.setPsRegorActiveTabName(this.activeName);
      this.setMultipleSelections([]);
      let boxsList = [];
      switch (this.activeName) {
        case "adviceTable":
          boxsList = [
            // "drugInfo",
            "commonDrug",
            "prescriptionTemp",
            // "PreviousPrescriptions",
            // "HistoricalDiagnosis",
            "Hotkey"
          ];
          let flagTemp = false;
          if (this.CdssCode == 0) {
            return;
          }
          for (let i = 0; i < boxsList.length; i++) {
            const el = boxsList[i];
            if (el === "CDSSComponent") {
              flagTemp = false;
              break;
            } else {
              flagTemp = true;
            }
          }
          if (flagTemp) {
            if (this.CdssCode == 1) {
              boxsList.unshift("CDSSComponent");
            } else {
              boxsList.splice(1, 0, "CDSSComponent");
            }
          }
          break;
        case "chmMedicine":
          boxsList = [
            // "drugInfo",
            "commonDrug",
            "prescriptionTemp",
            // "PreviousPrescriptions",
            // "HistoricalDiagnosis",
            "Hotkey"
          ];
          break;
        case "treatMedicine":
          boxsList = [
            // "drugInfo",
            "prescriptionTemp",
            // "PreviousPrescriptions",
            // "HistoricalDiagnosis",
            "Hotkey"
          ];
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
          break;
      }
      this.$emit("toolBoxsChange", boxsList);
    }
  },
  watch: {},
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cdss", ["CdssCode"])
  }
};
</script>

<style scoped lang="scss">
.wrapper-tabs {
  // /deep/.el-tabs__header {
  //   height: auto;
  // }
  // /deep/.el-tabs--left .el-tabs__header.is-left {
  //   margin-right: 0px;
  // }
  // /deep/.el-tabs--left > .el-tabs__content {
  //   /*overflow: unset;*/
  // }
  // .inner {
  //   /deep/.is-left.el-tabs__header {
  //     height: 60%;
  //     background-color: #F1F4F6;
  //   }
  // }
  // /deep/.el-tabs--left .el-tabs__nav-wrap.is-left {
  //   margin-right: 0px;
  // }
  .inner {
    /deep/.el-tabs__nav {
      // z-index: 1000;
    }
  }
}

//修复  el-tabs-new-style  新的样式造成的闪烁
.fixed-shanshuo {
  /deep/.el-tabs__header {
    overflow: unset !important;
  }
}
</style>
