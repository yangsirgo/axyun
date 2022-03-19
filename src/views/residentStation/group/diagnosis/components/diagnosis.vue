<template>
  <diagnosis-com :patientId="diagnosisData.patientId"
                 :inpCode="diagnosisData.patientCode"
                 :visitId="diagnosisData.visitId"></diagnosis-com>

</template>

<script>
  import diagnosisCom from "@/views/public/diagnosis/index.vue";

  export default {
    name: "diagnosis",
    components: {
      diagnosisCom
    },
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {
      diagnosisData() {
        return {
          patientId: this.$store.state.cis.receivePatientData['patientNum'],//患者id patientId
          patientCode: "",//住院号 patientCode
          visitId: this.$store.state.cis.receivePatientData['triageAppointmentId']//visitId 门诊号
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
