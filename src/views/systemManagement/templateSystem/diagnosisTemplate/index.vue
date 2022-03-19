<template>
  <div class="diagnosis">
    <public-tabs>
        <template #person>
          <diagnosis-detail />
        </template>
        <template #department>
          <d-dia-detail />
        </template>
        <template #hospital></template>
    </public-tabs>
  </div>
</template>

<script>
import publicTabs from "@/views/systemManagement/templateSystem/components/PublicTabs";
import diagnosisDetail from "./components/DiagnosisDetail"
import dDiaDetail from "./components/DDiaDetail" 
export default {
  name: 'diagnosis',
  components:{
      publicTabs,
      diagnosisDetail,//个人模板
      dDiaDetail//科室模板
  },
  data () {
    return {

    }
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.diagnosis{
  height: 100%;
}
</style>
