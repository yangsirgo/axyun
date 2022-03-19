<template>
  <div class="width100 height100">
    <el-tabs v-model="activeName" type="border-card" class="width100 elTab">
      <el-tab-pane label="字典目录" name="first">
        <catalogue @currentData="currentDataHandle" ></catalogue>
      </el-tab-pane>
      <el-tab-pane :label="'字典—'+(currentCataData.cataName||'')" name="second">
        <dictionaries v-if="activeName=='second'" :currentCataData="currentCataData" :key="activeName"></dictionaries>  
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import catalogue from './catalogue'
import dictionaries from './dictionaries'
export default {
  components: {
    catalogue,
    dictionaries
  },
  data() {
    return {
      activeName:'first',
      currentCataData:{}
    };
  },
  mounted(){
  },
  methods: {
    currentDataHandle(data){
      this.currentCataData = {...data};
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
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    color: #949da3;
}
</style>