<template>
  <div class="width100 height100">
    <el-tabs v-model="activeName" type="border-card" class="width100 elTab">
      <el-tab-pane label="字典目录" name="first">
        <catalogue @currentData="currentDataHandle" ></catalogue>
      </el-tab-pane>
      <el-tab-pane :label="'字典'+ title" name="second">
        <dictionaries v-if="activeName=='second'" :currentCataData="currentCataData" :key="activeName"></dictionaries>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import catalogue from './components/catalogue'
import dictionaries from './components/dictionaries'
export default {
  components: {
    catalogue,
    dictionaries
  },
  data() {
    return {
      activeName:'first',
      title :"",
      currentCataData:{
        cataName:""
      }
    };
  },
  mounted(){

  },
  methods: {
    currentDataHandle(data){
      if(typeof data !== "undefined"){
        this.currentCataData = {...data};
        this.title = "-" + this.currentCataData.cataName;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.elTab {
  height: 100%;
  /deep/.el-tabs__content {
    height: calc(100% - 55px);
    padding: 0;
}
}
</style>
