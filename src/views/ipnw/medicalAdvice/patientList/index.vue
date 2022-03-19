<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      @message="messageHandler"
    >
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

  import leftBar from "../components/leftBar.vue";
  import lMain from './components/main.vue';
  import { mapGetters } from 'vuex'

  export default {
    name: "",
    components: {
      leftBar,lMain
    },
    data() {
      return {
        tableLoading: false,
        toolBoxs: ["admitRegistrState"]
      };
    },
    methods: {
      messageHandler() {
        console.log("工具箱消息")
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      "receivePatientData": {//深度监听，可监听到对象、数组的变化
        handler(val){
          console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
        },
        immediate: true,
        deep: true
      }
    }
  };
</script>

<style lang='scss' scoped>

</style>


