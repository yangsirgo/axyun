<!--<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      :editor="editor"
      patientCardType="hospital"
      visitType="04"
      dnFlag="2"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <div style="width: 100%;height: 100%;">
          <op-emr @showStructureTree="showStructureTree" dnFlag="2" :showTree="true" ref="emr"></op-emr>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LeftBar from '../../components/nursingLeftBar'
  import opEmr from "@/views/emr/opEmr.vue"

  export default {
    name: "nursingDocuments", // 护理文书
    components: {
      LeftBar,
      opEmr
    },
    data (){
      return {
        formParams: ['technicalOffices', 'illnessArea','patientsType','patientsState', 'search'], // 左侧搜索条件
        toolBoxs: [],
        editor: {},
        showTreeFlag: true,
      }
    },
    methods: {
      handleClick() {// tab 的切换方法

      },
      save(){

      },
      saveAsTempl(){

      },
      editorReady(instance){
        this.editor = instance
      },
      handleSelectTemplate(data){
        this.editor.setContent(data.content)
      },
      search(form) {// 查询方法
        this.$refs.patients.search(form)
      },
      readCard() {// 读卡方法

      },
      toolBoxMessage(moduleName, data) {
        if (moduleName != "PreviousPrescriptions") {
          return;
        }
      },
      messageHandler() {
        console.log("工具箱消息")
      },
      showStructureTree(instance){
        this.editor = instance;
        this.showTreeFlag = false;
        this.showTreeFlag = true;
        this.toolBoxs = ['Phrase','StructureTree', 'MedicalExpression','SpecialSymbol'];
      },
    },
    watch: {
      "receivePatientData": {//深度监听，可监听到对象、数组的变化
        handler(val){
          console.log(val); // 监听 患者 ID 变化 触发事件
        },
        immediate: true,
        deep: true
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>-->
<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      patientCardType="hospital"
      visitType="04"
      dnFlag="2"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
          <docRecord class="width100 height100"></docRecord>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import LeftBar from '../../components/nursingLeftBar';
  import docRecord from '@/views/nursingRecord/docRecord';

  export default {
    name: "nursingDocuments",
    components: {
      LeftBar,
      docRecord
    },
    data() {
      return {
        formParams: ['technicalOffices', 'illnessArea', 'patientsType', 'patientsState', 'search'], // 左侧搜索条件
        toolBoxs: ['abnormal','character','inpwPhrase','inpwAdvice','CheckResult','InspectionResults']
      }
    },
    computed: {
      ...mapGetters('base', ['receivePatientData'])
    },
    watch: {
      "receivePatientData": {
        handler(val) {
          console.log('val', val);
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {

    },
    methods: {
      handleClick() {// tab 的切换方法

      },
      search(form) {// 查询方法
        this.$refs.patients.search(form)
      },
      readCard() {// 读卡方法

      },
      toolBoxMessage(moduleName, data) {
        if (moduleName != "PreviousPrescriptions") {
          return;
        }
      },
      messageHandler() {
        console.log("工具箱消息")
      }
    }
  }
</script>

<style scoped>

</style>
