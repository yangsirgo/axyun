<template>
 <el-col class="summaryinfo-top-style">
      <el-card>
          <div class="patient-card">
            <l-patient-card :patientName="patientInfo.patientName" :patientAge="patientInfo.age" :patientGender="patientInfo.patientGender">
              <patient-basic-info :patientInfo="patientInfo"></patient-basic-info>
            </l-patient-card>
          </div>
      </el-card>
    </el-col>
</template>

<script>
  // import {mapActions, mapGetters} from 'vuex';
  export default {
    name: "top",
    props: ["patientArchiveInfoVO"],
    data() {
      return {
        patientInfo: {}
      }
    },
    computed: {
      // ...mapGetters("patientMaster", ["receivePatientData"])
    },
    watch: {
      "patientArchiveInfoVO": function(){
          this.patientInfo = this.patientArchiveInfoVO;
          this.patientInfo.medicareCard = this.patientInfo.patientCode;
          console.log(this.patientInfo,"this.patientInfo====topshushujv")
      }
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  // .summaryinfo-top-style{
  //   margin-bottom: 10px;
  // }
  .summaryinfo-top-listA{
     display: inline-block;
    height: 60px;
    width: 60px;
    font-size: 34px;
    color: #f7a820;
    min-width: 60px;
    background-color: #fef6e8;
    line-height: 60px;
    text-align: center;
  }
  .summaryinfo-top-listB{
     display: inline-block;
    height: 100%;
    width: auto;
    color: rgba(78,137,250,1);
    font-size: 20px;
    font-weight: 600;
    line-height: 60px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .summaryinfo-top-listC{
     display: inline-block;
    font-size: 20px;
    color: #000000;
    line-height: 60px;
  }
  .summaryinfo-top-listC span{
    display: inline-block;
    margin-right: 10px;

  }
  .verticalRight-span{
    display: inline-block;
    margin-right: 10px;
  }
  .verticalRight-span-red{
    color: red;
  }
</style>
