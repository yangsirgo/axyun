<template>
   <div class="catalogue width100 height100 clearfix">
      <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="8">
              <LFormtTitle label="患者姓名">
                <el-input v-model="patientName" placeholder="请输入患者姓名" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="回诊时间">
                <el-date-picker
                            v-model="rangeDate"
                            type="datetimerange"
                            @input="immediUpdate"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                  </el-date-picker>
                </LFormtTitle>
              </el-col>
            <el-col :span="4" class="float-right">
              <!-- <el-button type="primary" plain class="float-right">导出</el-button> -->
              <!--暂时隐藏掉-->
             <el-button type="primary" @click="search">查询</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="table-cont">
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width|| (item.label.length * 18 + 24)"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
             
               <span  class="overflow-point">{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[20, 40, 60, 100,300,500,1000,3000,5000,10000]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
   </div>
  </div>
</template>
<script>
import service from "@/api/appointmentNew/rediagLogInfo";
import {dateFtt} from '@/utils';
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      patientName: "",
      startDate:"",
      endDate:"",
      rangeDate:[],
      deptList:{},
      prestoreCodeShow:{},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "appointmentId",
          label: "预约ID",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "oldSuperScheduleId",
          label: "原排班ID",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "targetSuperscheduleId",
          label: "目标排班ID",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "oldSonScheduleId",
          label: "原子排班ID",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "targetSonScheduleId",
          label: "目标子排班ID",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "rediagTime",
          label: "回诊时间",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "rediagUserName",
          label: "回诊人员姓名",
          align: "left",
          headerAlign: "center",
          width: "150"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        id: "",
        appointmentId: "",
        patientId: "",
        patientName: "",
        oldSuperScheduleId: "",
        targetSuperscheduleId: "",
        oldSonScheduleId: "",
        targetSonScheduleId: "",
        rediagTime: "",
        rediagUserId: "",
        rediagUserName: ""
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100
      }
    };
  },
  
  mounted() {
    this.getListPageRediagLogInfo();
  },
  methods: {
    immediUpdate(e) {
      this.$nextTick(() => {
          if(e==null){
              this.startDate='';
              this.endDate='';
           }else{
              this.$set(this,"rangeDate", [e[0], e[1]]);
              this.startDate=dateFtt(this.rangeDate[0]);
              this.endDate=dateFtt(this.rangeDate[1]);                        
          }

      });
  },

    async getListPageRediagLogInfo() {
      this.loading = true;
      let res = await service.getListPageRediagLogInfo({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        startDate: this.startDate, 
        endDate: this.endDate,
        patientName:this.patientName
      });
      this.loading = false;
      this.tableData =  res.data;
      this.pageParams.total = res.total;
      if(typeof(tableData) !=="undefined" ){
        this.currentData = this.tableData[0];
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
      
      }else{
        this.currentData = [];
      }
     
      
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getListPageRediagLogInfo();
    },
    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
      this.form = { ...this.currentData };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        id: "",
        appointmentId: "",
        patientId: "",
        patientName: "",
        oldSuperScheduleId: "",
        targetSuperscheduleId: "",
        oldSonScheduleId: "",
        targetSonScheduleId: "",
        rediagTime: "",
        rediagUserId: "",
        rediagUserName: ""
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.OnlinePaySettlementDetailId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delOnlinePaySettlementDetailById(this.form.OnlinePaySettlementDetailId);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getListPageRediagLogInfo();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    async save() {
      if (this.addStatus) {
        
            try {
              this.$showLoading();
               console.log(this.form);
              let res = await service.addOnlinePaySettlementDetail(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.getListPageRediagLogInfo();
              }else{
                 this.$message({ type: "flag", message: "新增失败" });
              }
             
              
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "新增失败");
            }
      } else {
            try {
              this.$showLoading();
              let res = await service.updateOnlinePaySettlementDetail(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.getListPageRediagLogInfo();
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getListPageRediagLogInfo();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPageRediagLogInfo();
    }
  },
  // watch:{
  //     rangeDate: function (newVal, oldVal) {
  //       console.log(newVal)
  //       if (newVal.length>0) {
  //         this.startDate = dateFtt(newVal[0])
  //         this.endDate = dateFtt(newVal[1])
  //       } else {
  //         this.startDate = null
  //         this.endDate = null
  //       }
  //     }
  //   }
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.catalogue {
  background-color:#fff;
  .catalogue-left {
    width: 100%;
  
    border-right: 1px solid $l-color-bgcolor-11;
    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      height: calc(100% - 106px);
      margin: 20px 0;
    }
    .page {
      text-align: right;
      .el-pagination {
        padding: 0;
        /deep/ .el-pagination__editor.el-input .el-input__inner {
          height: 100% !important;
        }
      }
    }
  }
  .catalogue-right {
    width: 300px;
    padding: 10px;
    overflow-y:scroll; 
    .catalogue-right-form {
     // height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
    .catalogue-right-btn {
      margin-top: 10px;
    }
  }
}
</style>