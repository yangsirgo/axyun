<template>
  <div class="preDiagnosis">
    <l-card-title>
      <template #left>
        <div>{{ patientInfo.patientName }}的预检记录</div>
      </template>
    </l-card-title>
    <div class="table-box">
      <el-table :data="tableData" border height='100%' style="width: 100%">
        <el-table-column :show-overflow-tooltip="true" prop="times" label="预检次数" min-width="80"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="previewTime"
          label="预检时间"
          min-width="120"
        ></el-table-column>
        <el-table-column prop="prejudge" label="预检人" min-width="80"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "preDiagnosis",
  data() {
    return {
      patientInfo: {
        patientName:'',
      },
      tableData: [],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      }
    };
  },
  computed : {
    ...mapGetters("base", ["receivePatientData"])
  },
  mounted(){
    this.getAppotRecord();
  },
  watch: {
    "receivePatientData":{//深度监听，可监听到对象、数组的变化
      handler(val){
        console.log(val,'val'); // 监听 患者 ID 变化 触发事件 reload table 数据
        this.patientInfo = val;
        this.getAppotRecord();
      },
      immediate: true,
      deep:true
    }
  },
  methods: {
    getAppotRecord(){//获取患者预约记录
        let params={
          patientId: this.patientInfo.patientId,
          recordStatus: '1'
        }

    }
  }
};
</script>

<style lang='scss' scoped>
.preDiagnosis {
  width: 100%;
  height: 100%;
  padding: 0 10px 10px;
  background-color: #fff;
  .table-box{
    width: 100%;
    height: calc(100% - 63px);
  }
}
</style>
