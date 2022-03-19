<template>
  <div class="prescription">
    <public-tabs>
        <template #person>
          <!-- <name-list /> -->
          <proscription-detail />
        </template>
        <template #department>
          <d-pro-detail />
        </template>
        <template #hospital></template>
    </public-tabs>
  </div>
</template>

<script>
import publicTabs from "@/views/systemManagement/templateSystem/components/PublicTabs" 
import proscriptionDetail from "./components/ProscriptionDetail" 
import dProDetail from "./components/DProDetail" 
export default {
  name: 'prescription',
  components:{
      publicTabs,
      proscriptionDetail,
      dProDetail
  },
  data () {
    return {

    }
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
  .prescription{
    height: 100%;
  }
</style>
