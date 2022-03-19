<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <div class="height100">
          <temperature></temperature>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import temperature from "./component/temperature";
import leftBar from "@/views/ipnw/components/nursingLeftBar.vue";

export default {
  components: {
    temperature,
    leftBar
  },
  data() {
    return {
      toolBoxs: ["AuxiliaryDiagnosis"]
    };
  },
  mounted() {},
  methods: {
    messageHandler() {}
  }
};
</script>

<style scoped>
</style>
