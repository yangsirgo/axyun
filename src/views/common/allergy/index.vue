<template>
  <div class="box_container clearfix" ref="page">
    <el-tabs tabPosition="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="药物过敏" name="drug">
        <drug ref="drug"></drug>
      </el-tab-pane>
      <el-tab-pane label="食物过敏" name="food">
        <food ref="food"></food>
      </el-tab-pane>
      <el-tab-pane label="造影剂过敏" name="contrastMedium"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import drug from "./components/drugAllergyManagement";
  import food from "./components/foodAllergyManagement";
  export default {
    components: {drug,food},
    data() {
      return {
        activeName: 'drug'
      };
    },
    methods: {
      handleClick(tab, event) {

      }
    }
  }
</script>
