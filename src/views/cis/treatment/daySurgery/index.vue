<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      @message="messageHandler"
    >
      <template #topSlot>
        <l-patient-details></l-patient-details>
      </template>
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <l-main></l-main>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftBar from "./components/leftBar.vue";
  import { mapGetters } from 'vuex'
  import lMain from "./components/main.vue";

  export default {
    name: "",
    components: {
      leftBar,
      lMain
    },
    data() {
      return {
        tableLoading : false,
        toolBoxs: ["AuxiliaryDiagnosis"]
      };
    },
    methods: {
      messageHandler() {
      }
    },
    computed : {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      "receivePatientData":{
        handler(n){

        },
        immediate: true,
        deep: true
      }
    },
    mounted() {

    }
  };
</script>

<style lang='scss' scoped>

</style>
