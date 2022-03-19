<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="(item,index) in tabParams"
                   :key="index"
                   :label="item.label"
      >
        <div v-if="item.cont==='1'">
          <drug-varieties></drug-varieties>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import drugVarieties from './components/drugVarieties';

  export default {
    name: "index",
    components: {
      drugVarieties
    },
    data() {
      return {
        //标签页数据
        tabParams: [
          {label: '药品品种', cont: '1'},
          {label: '药库信息', cont: '2'},
          {label: '药房信息', cont: '3'},
          {label: '入库信息', cont: '4'},
          {label: '出库信息', cont: '5'}
        ]
      }
    }
  }
</script>

<style scoped>

</style>
