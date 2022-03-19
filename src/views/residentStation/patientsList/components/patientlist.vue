<template>
  <div class="residency clearfix" ref="page">
    <div class="left">
      <left></left>
    </div>
    <div class="middle">
      <list :patients="data.list" @patientInfo="handlePatientInfo" ref="applicat"></list>
    </div>
    <div class="right">
      <right ref="right"></right>
    </div>
  </div>
</template>

<script>
  import list from './list.vue';
  import left from './left.vue';
  import right from './right.vue';
  import adHeight from '@/mixins/adHeight';
  import { getPatients } from "@/api/cis/resident/resident";

  export default {
    name: "patientsList",
    mixins: [adHeight],
    components: {
      list :list,
      left:left,
      right:right
    },
    data(){
      return{
        data: {
          "list": [],
          patientName:''
        }
      }
    },
    methods:{
      async getPatientList(){
        let data = {
          admissionStatus: 1
        }

        let result = await getPatients(data);
        console.log(result);
        if(result.code == 1){
          this.data.list = result.data;
          this.$refs.right.patientInfo = result.data[0]
        }
      },
      handlePatientInfo(patientInfo){
        console.log(patientInfo)
        this.$refs.right.patientInfo = patientInfo
      }

    },
    mounted() {
      this.getPatientList();
    }
  }


</script>

<style scoped lang="scss">
  .residency {
    .left {
      width: 305px;
      /*margin: 20px 0 0 0px;*/
      float: left;
      height: 100%;
      /*padding-top: 20px;*/
    }

    .middle {
      width: calc(100% - 650px);
      margin-left: 20px;
      float: left;
      height: 100%;
    }

    .right {
      width: 305px;
      /*margin: 20px 0 0 20px;*/
      float: right;
      height: 100%;
      /*padding-top: 20px;*/
    }

  }

</style>
