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
        <l-main class="height100"></l-main>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftBar from "../../../components/leftBar.vue";
  import { mapGetters } from 'vuex'
  import lMain from "./components/main.vue";


  export default {
    name: "",
    components: {
      leftBar,lMain
    },
    data() {
      return {
        tableLoading : false,
        toolBoxs: ["historicalSickLeave"]
      };
    },
    methods: {
      messageHandler() {
        console.log("工具箱消息")
      }
    },
    computed : {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      "receivePatientData":{//深度监听，可监听到对象、数组的变化
        handler(n){

        },
        immediate: true,
        deep:true
      }
    },
    mounted() {

    }
  };
</script>

<style lang='scss' scoped>

</style>


