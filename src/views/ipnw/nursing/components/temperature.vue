<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"

      @message="messageHandler"
    >
      <template #list>
        <l-side-tabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          hosp-state
          :form-list="formParams">
          <template #firstBottom>
            <patients ref="patients" :form="patientsSearchForm"></patients>
          </template>
          <template #second>
            第二卡片内容
          </template>
          <template #third>
            第三卡片内容
          </template>
        </l-side-tabs>
      </template>
      <template #content>
        <div>
          体温单
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import patients from '../../components/PatientList'
  export default {
    name: "temperature", // 体温单
    components: {
      patients
    },
    data (){
      return {
        formParams: ['technicalOffices', 'illnessArea','patientsType','patientsState', 'search'], // 左侧搜索条件
        // 患者列表查询条件
        patientsSearchForm: {},
        toolBoxs: ["AuxiliaryDiagnosis"],
      }
    },
    methods: {
      handleClick() {// tab 的切换方法

      },
      search(form) {// 查询方法
        this.patientsSearchForm = form
        this.$refs.patients.search(form)
      },
      readCard() {// 读卡方法

      },
      toolBoxMessage(moduleName, data) {
        if (moduleName != "PreviousPrescriptions") {
          return;
        }
      }
    },
    watch: {
      "receivePatientData":{//深度监听，可监听到对象、数组的变化
        handler(val){
          console.log(val); // 监听 患者 ID 变化 触发事件
        },
        immediate: true,
        deep:true
      }
    }
  }
</script>

<style scoped>

</style>
