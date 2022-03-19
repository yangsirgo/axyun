<template>
  <div class="width100 height100">
  <l-layout
    :toolBoxs="toolBoxs"
    :defaultToolName="toolBoxs[0]"
    :boxExpanded="true"
    patientCardType="hospital"
    @message="messageHandler"
  >
    <template #list>
      <left-bar></left-bar>
    </template>
    <template #content>
      <medical-order-list></medical-order-list>
    </template>
  </l-layout>
</div>
</template>

<script>

  import leftBar from "@/views/ipnw/medicalAdvice/components/leftBar.vue";
  import { mapGetters } from 'vuex'
  import medicalOrderList from '@/views/ipnw/IntegratedEmr/medicalOrder/component/medicalOrderList.vue'

  export default {
    name: "",
    components: {
      leftBar,
      medicalOrderList
    },
    data() {
      return {
        tableLoading : false,
        toolBoxs: ['reportExplain','drugInfo'],
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
      }
    }
  };
</script>

<style lang='scss' scoped>

</style>


