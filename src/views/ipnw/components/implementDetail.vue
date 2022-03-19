<template>
  <div class="height100 width100">
    <div class="detail-table" ref="bottomForm">
      <div class="title position-relative">
        七叶皂苷钠注射液，10mg/支，执行明细
      </div>
      <el-table :data="tableData" border style="width: 100%;margin-top: 20px;">
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.state}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="执行预计时间" min-width="120"></el-table-column>
        <el-table-column prop="address" label="执行时间"></el-table-column>
        <el-table-column prop="address" label="执行人"></el-table-column>
        <el-table-column prop="address" label="执行科室"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  data(){
    return {
      tableData: [],
    }
  },
  computed: {
    ...mapGetters(["currentPrescription"])
  },
  created (){
    // 
    console.log(this.currentPrescription)
    this.fetchDetail(this.currentPrescription)
  },
  methods: {
    fetchDetail (id){ // 请求医嘱明细数据

    }
  },
  watch: {
    currentPrescription: {
      handler(id){
        // 更新数据
        this.fetchDetail(id)
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
  .title{
    background-color: $l-color-bgcolor-18;
    padding-left: 10px;
    line-height: 30px;
    color: $l-color-fontcolor-3;
    font-size: 14px;
  }
</style>