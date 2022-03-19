<template>
  <div class="height100">
    <el-card class="height100">
      <allergy-manage></allergy-manage>
    </el-card>
  </div>
</template>

<script>
  import AllergyManage from '../../../public/allergy'
  export default {
    name: "allergy",
    components: {
      AllergyManage
    }
  }
</script>

<style scoped>

</style>
