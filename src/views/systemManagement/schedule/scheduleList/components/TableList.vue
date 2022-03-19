<template>
  <div class="tableList">
    <div class="table-out">
      <el-table
        ref="multipleTable"
        style="width: 100%"
        height="100%"
        :data="scheduleList"
        border
        stripe
        v-loadmore="load"
        v-loading="tlm_isLoading"
        @selection-change="handleSelectionChange"
        element-loading-text="加载中..."
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="classId" fixed="left" label="班次ID" min-width="182"></el-table-column>
        <el-table-column prop="department" label="科室" min-width="221"></el-table-column>
        <el-table-column prop="doctor" label="医生" min-width="168"></el-table-column>
        <el-table-column prop="serviceLevel" label="出诊级别" min-width="196">
          <!-- <template v-slot="scope"></template> -->
        </el-table-column>
        <el-table-column prop="serviceTime" label="出诊时间" min-width="201"></el-table-column>
        <el-table-column prop="afternoon" label="上下午" min-width="166"></el-table-column>
        <el-table-column prop="serviceStatus" label="状态" min-width="148"></el-table-column>
        <el-table-column prop="addTime" label="添加时间" min-width="208">
          <!-- <template v-slot="scope"></template> -->
        </el-table-column>
        <el-table-column prop="addPerson" label="添加人" min-width="165"></el-table-column>
        <el-table-column label="操作" min-width="179" fixed="right">
          <template v-slot="scope">
            <el-button class="out-button" @click="handleOut(scope.row.id)">出诊</el-button>
            <el-button type="primary" class="stop-button" @click="handleStop(scope.row.id)">停诊</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <success-message ref="success" :message="message" />
    <stop-service :doctorinfo="doctorinfo" ref="stop"></stop-service>
  </div>
</template>

<script>
import successMessage from "@/views/systemManagement/components/SuccessMessage";
import stopService from "./StopService";
export default {
  name: "tableList",
  components: {
    successMessage,
    stopService
  },
  data() {
    return {
      curSelectTableList: [], // 当前已经选中的item
      curSelectTableIdList:[], // 当前已经选中的item的Id列表
      page: 1,
      tlm_noMore: false, // 没有更多数据， 禁用加载
      tlm_isLoading: false, // 请求数据中，
      message: "医生出诊已恢复",
      doctorinfo: "泌尿外科，王新安，2019-05-07，周二，上午",
      scheduleList: [
        {
          classId: "21321",
          department: "泌尿外科",
          doctor: "罗恒",
          serviceLevel: "主任号",
          serviceTime: "2019-05-06",
          afternoon: "上午",
          serviceStatus: "停诊",
          addTime: "2019-04-20 13:50",
          addPerson: "刘明"
        },
        {
          classId: "21321",
          department: "泌尿外科",
          doctor: "罗恒",
          serviceLevel: "主任号",
          serviceTime: "2019-05-06",
          afternoon: "下午",
          serviceStatus: "停诊",
          addTime: "2019-04-20 13:50",
          addPerson: "刘明"
        }
      ],
      tableParams:[
        {
          prop:'classId',
          label:'班次ID',
          fixed: 'left',
          width:'182'
        },
        {
          prop:'department',
          label:'科室',
          fixed: '',
          width:'221'
        },
        {
          prop:'doctor',
          label:'医生',
          fixed: '',
          width:'168'
        },
        {
          prop:'serviceLevel',
          label:'出诊级别',
          fixed: '',
          width:'196'
        },
        {
          prop:'serviceTime',
          label:'出诊时间',
          fixed: '',
          width:'201'
        },
        {
          prop:'afternoon',
          label:'上下午',
          fixed: '',
          width:'166'
        },
        {
          prop:' serviceStatus',
          label:'状态',
          fixed: '',
          width:'148'
        },
        {
          prop:'addTime',
          label:'添加时间',
          fixed: '',
          width:'208'
        },
        {
          prop:'addPerson',
          label:'添加人',
          fixed: '',
          width:'165'
        }

      ]
    };
  },
  methods: {
    // 中间模块操作
    handleSelectionChange(list) {
      // 选中表格
      this.curSelectTableList = list;

      console.log(this.curSelectTableList);
    },
    //滑动加载更多信息
    load() {
      const _this = this;
      this.page++;
      setTimeout(function() {
        // let tableData = [..._this.tableData];
        // //获取分页列表
        // this.getList(this.page, this.pageSize);
        // if (_this.page >= _this.total) {
        //   _this.tlm_noMore = true;
        // }
        // _this.tableData = [...tableData.concat(this.data)];
        // _this.tlm_isLoading = false;
      }, 2000);
    },
    handleOut() {
      this.$refs.success.isOpen = true;
      setTimeout(() => {
        this.$refs.success.isOpen = false;
      }, 1000);
    },
    handleStop() {
      this.$refs.stop.isVisible = true;
    }
  }
};
</script>
<style lang='scss' scoped>
.tableList {
  height: 100%;
  .table-out {
    height: calc(100% - 76px);
    .out-button,
    .stop-button {
      width: 68px;
      height: 28px;
      border-radius: 2px;
    }
    .out-button {
      border: 1px solid $l-color-bgcolor-11;
      background-color: $l-color-bgcolor-14;
      color: $l-color-fontcolor-3;
      
    }
  }
}
</style>
