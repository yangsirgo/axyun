<template>
  <diagnosis
    hosType="1"
    :patientId="receivePatientData.patientId"
    :inpCode="receivePatientData.patientCode"
    :visitId="receivePatientData.visitId"
    :diagReloadData="diagReload"
    @loadPatientData="loadPatientData"
  ></diagnosis>
</template>

<script>
  import { mapGetters } from "vuex";
  import diagnosis from "@/views/public/diagnosis/index.vue";

  export default {
    name: "",
    components: {
      diagnosis
    },
    data() {
      return {
        // 诊断表格重新请求数据
        diagReload: true
      };
    },
    methods: {
      messageHandler() {
        this.diagReload = !this.diagReload;
      },
      loadPatientData() {
        this.$emit("loadPatientData");
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        //深度监听，可监听到对象、数组的变化
        handler(n) {
          //数据变化 回调
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {}
  };
</script>

<style scoped lang="scss">

</style>
