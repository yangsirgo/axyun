<template>
  <el-card class="width100 height100 padding10">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="width100 height100">
      <el-tab-pane label="家庭病床患者情况统计表" name="first" class="width100 height100">
        <inpPatient></inpPatient>
      </el-tab-pane>
      <el-tab-pane label="家庭病床结床患者查询" name="second"  class="width100 height100">
        <outPatinet></outPatinet>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import inpPatient from './components/inpPatient';
import outPatinet from './components/outPatient';
export default {
  components: {
    inpPatient,
    outPatinet
  },
  data() {
    return {
      //
      activeName: 'first'
    }
  },
  methods: {
    handleClick(){

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
