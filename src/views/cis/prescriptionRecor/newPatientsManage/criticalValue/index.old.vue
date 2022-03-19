<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      pageName="criticalValue"
      @message="messageHandler"
      hosType="1"
    >
      <template #topSlot>
        <l-patient-details></l-patient-details>
      </template>
      <template #list>
        <left-bar :pSetterForm="cVSearchParams" ref="leftBar"></left-bar>
      </template>
      <template #content>
        <main-card hosType="1"></main-card>

      </template>
    </l-layout>
  </div>
</template>

<script>

  import leftBar from "../../../components/leftBar.vue";
  import mainCard from "@/views/public/criticalValue/index.vue";
  import { mapGetters } from 'vuex'

  export default {
    name: "",
    components: {
      leftBar,mainCard
    },
    data() {
      return {
        tableLoading : false,
        searchForm : '',//包含 类型checkType和 状态docState
        cVSearchParams : ['technicalOffices', 'checkType', 'docState','timeRange', 'search'],
        toolBoxs: ['AuxiliaryDiagnosis','patientFullAngle','InspectionResults','CheckResult','HistoricalDiagnosis',"commonDiag",'PreviousPrescriptions',"Hotkey"],
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
        handler(val){
          console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
        },
        immediate: true,
        deep:true
      },
      "$refs.leftBar.form" (n,o) {
        console.log(n,o);
        this.searchForm = n;
      }
    }
  };
</script>

<style lang='scss' scoped>

</style>


