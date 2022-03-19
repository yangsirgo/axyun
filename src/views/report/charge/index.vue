<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      @message="messageHandler"
      pageName="cisOutpCharge"
    >
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <reportList></reportList>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftBar from "./components/leftBar";
import reportList from "./components/reportList";

export default {
  name: "",
  components: {
    leftBar,
    reportList
  },
  data() {
    return {
      tableLoading: false,
      toolBoxs: ["billManage", "receiptJump", "Hotkey"],
      num: { count: 1 }
    };
  },
  provide() {
    return {
      updatePatCom: this.num
    };
  },
  mounted() {},
  methods: {
    messageHandler() {}
    /*updatePatientList(data) {
        ++this.num.count;
      }*/
  }
};
</script>

<style lang='scss' scoped>
</style>

