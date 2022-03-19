<template>
  <div class="patientHealthInfo">
    <div class="between" style="margin-bottom:16px;">
      <div class="title">个人医保信息</div>
      <SZReadCard @cardInfo="cardInfoHandler" :showCardNum="false" :showPassword="true"></SZReadCard>
    </div>
    <SZPatientInfo :colNum="4" :siPatientDto="siPatientDto" :tableData="tableData" style="flex: 1;"></SZPatientInfo>
  </div>
</template>

<script>
  import SZReadCard from "@/components/SZReadCard.vue";
  import SZPatientInfo from "@/components/SZPatientInfo.vue";
  import healthInsuranceService from "@/api/healthInsurance/index.js";
  export default {
    components: {
      SZReadCard,
      SZPatientInfo,
    },
    computed:{
      tableData(){
        return [this.tableData1,this.tableData2,this.tableData3,this.tableData4]
      }
    },
    data() {
      return {
        siPatientDto: {},
        tableData1: [],
        tableData2: [],
        tableData3: [],
        tableData4: [],
      }
    },
    methods:{
      cardInfoHandler(data) {
        this.cardInfo = data;

        this.getPatientInfo({
          siCardNum: data.siPatientCode,
          password: data.passward,
          medicareType: "01",
          accidentWorkInjuryCode: "",
        });
      },
      //获取医保患者信息
      async getPatientInfo(param) {
        let res = await healthInsuranceService.patientInfo(param);
        this.siPatientDto = res.data.siPatientDto;
        this.tableData1 = res.data.insuranceInfos;
        this.tableData2 = res.data.guardianInfos;
        this.tableData3 = res.data.bigDiseaseInfos;
        this.tableData4 = res.data.siSumInfos;
        //判断糖尿病和高血压标志，赋值慢病options
        // this.mbOption = [];
        // if (res.data.siPatientDto.hypertensionFlag) {
        //   this.mbOption.push({
        //     dictName: "高血压",
        //     dictCode: "01",
        //   });
        // }
        // if (res.data.siPatientDto.diabetesFlag) {
        //   this.mbOption.push({
        //     dictName: "糖尿病",
        //     dictCode: "02",
        //   });
        // }
        // //根据患者信息的大病种类关联全部大病种类，赋值大病options
        // res.data.bigDiseaseInfos.forEach((item1) => {
        //   this.allDbInfo.forEach((item2) => {
        //     if (item2.dictCode === item1.bigDiseaseCode) {
        //       this.dbOption.push({
        //         dictName: item2.dictName,
        //         dictCode: item2.dictCode,
        //       });
        //     }
        //   });
        // });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .patientHealthInfo {
    background-color: #fff;
    height:100%;
    padding:16px;
    display: flex;
    flex-direction: column;

    .between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .l-input-wrap {
      margin-bottom: 8px;
    }

    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
