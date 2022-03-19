<template>
  <el-card class="box-card height100">
    <div slot="header" class="clearfix">
      <el-button class="fl" type="text">列表视图</el-button>
      <el-button class="fr" type="text">操作患者</el-button>
    </div>
    <div class="body">
      <el-tree :data="data"
               :props="defaultProps"
               default-expand-all
               @node-click="handleNodeClick"></el-tree>
    </div>
  </el-card>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: "patientsTree",
    data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData'
      }),
      handleNodeClick(data) {
        console.log(data);
        //vuex 里面存数据 患者数据
        this.changeRecPatientData (data);
      }
    }
  }
</script>

<style scoped lang="scss">
  .box-card {

    /deep/ .el-card__body {
      height: calc(100% - 73px);
      overflow: auto;
    }

    .body {


    }
  }
</style>
