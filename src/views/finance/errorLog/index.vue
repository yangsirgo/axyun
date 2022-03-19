<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="5">
              <LFormtTitle label="业务数据表名">
                <el-input v-model="dataTable" placeholder="请输入业务数据表名" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="业务类名">
                <el-input v-model="dataClassName" placeholder="请输入业务类名" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="业务方法名">
                <el-input v-model="dataMethodName" placeholder="请输入业务方法名" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="异常类型">
                <el-input v-model="exceptionType" placeholder="请输入异常类型" clearable></el-input>
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
import service from "@/api/financeManagement/errorLog";
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      dataTable: "",
      dataClassName: "",
      dataMethodName: "",
      exceptionType: "",
      deptList:{},
      prestoreCodeShow:{},
      tableData: [],
      // 表格列
      tableParams: [
        // {
        //   prop: "dataId",
        //   label: "业务数据ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "100",
        //   fixed: false
        // },
        {
          prop: "dataTable",
          label: "业务数据表名",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "dataClassName",
          label: "业务类名",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "dataMethodName",
          label: "业务方法名",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "exceptionType",
          label: "异常类型",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "exceptionLocation",
          label: "异常位置",
          align: "left",
          headerAlign: "center",
          width: "300"
        },
        {
          prop: "remark",
          label: "备注",
          align: "left",
          headerAlign: "center",
          width: "150"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        errorLogId: "",
        dataId: "",
        dataTable: "",
        dataClassName: "",
        dataMethodName: "",
        exceptionType: "",
        exceptionLocation: "",
        remark: ""
      },
      rules: {
        dataTable: [
          { required: true, message: "请输入业务数据表", trigger: "blur" }
        ],
        dataClassName: [
          { required: true, message: "请输入业务类名", trigger: "blur" }
        
        ]
       
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
  this.getListPageErrorLog();
  },
  methods: {
   
    async getListPageErrorLog() {
      this.loading = true;
      let res = await service.getListPageErrorLog({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        dataTable: this.dataTable, 
        dataClassName: this.dataClassName, 
        exceptionType: this.exceptionType, 
        dataMethodName: this.dataMethodName 
      });
      this.loading = false;
      this.tableData = res.data;
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
      this.getListPageErrorLog();
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
        errorLogId: "",
        dataId: "",
        dataTable: "",
        dataClassName: "",
        dataMethodName: "",
        exceptionType: "",
        exceptionLocation: "",
        remark: ""
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.PrestoreFreezeDetailId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delPrestoreFreezeDetailById(this.form.PrestoreFreezeDetailId);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getListPageErrorLog();
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
              let res = await service.addPrestoreFreezeDetail(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.getListPageErrorLog();
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
              let res = await service.updatePrestoreFreezeDetail(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.getListPageErrorLog();
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
      this.getListPageErrorLog();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPageErrorLog();
    }
  }
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