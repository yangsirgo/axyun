<template>
  <div class="width100 height100 wrapper">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      pageName="cis_order"
      patientCardType="default"
      @message="messageHandler"
    >
      <template #topSlot>
        <l-patient-details></l-patient-details>
      </template>
      <template #list>
        <left-bar executionType="injection"></left-bar>
      </template>
      <template #content>
        <order ref="order"></order>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftBar from "../components/leftBar.vue";
  import order from "./module/main.vue";
  import { mapGetters } from "vuex";

  export default {
    name: "",
    components: {
      leftBar,
      order
    },
    data() {
      return {
        tableLoading: false,
        toolBoxs: []
      };
    },
    methods: {
      messageHandler() {
        this.$refs.order.saveHandle();
        // console.log('chufalalalal');
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        //深度监听，可监听到对象、数组的变化
        handler(val) {
          console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
        },
        immediate: true,
        deep: true
      }
    }
  };
</script>

<style lang='scss' scoped>
  .wrapper {
  }
</style>


