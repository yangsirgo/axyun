<template>
  <el-card class="wrapperCls height100">
    <el-tabs class="height100 rootTabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in shareLevel"
        :key="index"
        :name="item.value"
        :label="item.label"
        lazy
      >
        <editableTabs v-if="activeName === item.value" :active-tab="activeName"></editableTabs>
      </el-tab-pane>
    </el-tabs>
  </el-card>

</template>

<script>
  import editableTabs from "./editableTabs.vue";

  export default {
    name: "index",
    components: { editableTabs },
    data() {
      return {
        activeName:'2',
        shareLevel: [{
          value: '2',
          label: '个人模板'
        },{
          value: '1',
          label: '科室模板'
        },{
          value: '0',
          label: '全院模板'
        }],
      };
    },
    mounted() {

    },
    methods: {
      handleClick (){

      },
      onSubmit (){

      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss" scoped>
  .wrapperCls {
    padding: 10px;
  }
</style>
