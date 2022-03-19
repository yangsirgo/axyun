<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="8">
              <LFormtTitle label="源名称">
                <el-input v-model="sourceName" placeholder="请输入源名称" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="目标名称">
                <el-input v-model="targetName" placeholder="请输入目标名称" clearable></el-input>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn" style="margin-left:20px">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="add">新增</el-button>
          <!--暂时隐藏掉-->
          <!-- <el-button type="primary" plain @click="cancel">重置</el-button>
          <el-button type="primary" plain>导出</el-button>-->
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
              <template v-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '0'">未启用</span>
                <span v-else-if="scope.row[item.prop] == '1'">启用</span>
              </template>
              <template v-else-if="item.prop == 'type'">
                   <span code="rediagDept" :val=" scope.row[item.prop]" v-codeTransform></span>
              </template>
               <span v-else class="overflow-point">{{ scope.row[item.prop] }}</span>
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
    <div class="catalogue-right height100 float-right" >
      <el-form :model="form" :rules="rules" ref="form" class="catalogue-right-form">
         <LFormtTitle label="回诊配置ID" :required="true" class="margin-top-20" :disabled="true"  style="display:none">
          <el-form-item prop="rediagSettingId">
            <el-input
              v-model="form.rediagSettingId"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="科室类型" :required="false" class="margin-top-20">
          <el-form-item prop="type">
            <l-value-domain
                  :value.sync="form.type"
                  remoteUrl="/appointment/dictValue/getPageDictValueList?dictItemCode=A0006"
                  remoteShowKey="dictName"
                  remoteValueKey="dictValue"
                  placeholder="请选择"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="源名称" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="sourceId">
             <l-value-domain
                  :value.sync="form.sourceId"
                  remoteUrl="/wadmin/hos/dept"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  placeholder="请选择科室"
                  @change="sourceChange"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="目标名称" :required="true" class="margin-top-20" >
          <el-form-item prop="targetId">
           <l-value-domain
                  :value.sync="form.targetId"
                  remoteUrl="/wadmin/hos/dept"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  placeholder="请选择科室"
                  @change="targetChange"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="状态" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.recordStatus" label="1">启用</el-radio>
            <el-radio v-model="form.recordStatus" label="0">未启用</el-radio>
          </el-form-item>
        </LFormtTitle>
       
            <el-input style="display:none"
              v-model="form.targetName"
              :disabled="true"
              :hidden="true"
            ></el-input>
        
       
            <el-input  style="display:none"
              v-model="form.sourceName"
              :disabled="true"
              :hidden="true"
            ></el-input>
          
      </el-form>
      <div class="width100 clearfix catalogue-right-btn">
        <el-button
          class="float-right"
          style="margin-left:10px"
          type="primary"
          plain
          @click="dele"
        >删除</el-button>
        <el-button class="float-right" type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/appointmentNew/rediagSetting";
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      sourceName: "",
      targetName: "",
      deptList:{},
      deptTypeList:{},
      tableData: [],
      // 表格列
      tableParams: [
        
        {
          prop: "type",
          label: "科室类型",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },
        {
          prop: "sourceId",
          label: "源ID",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "sourceName",
          label: "源名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "targetId",
          label: "目标ID",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "targetName",
          label: "目标名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "150"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        rediagSettingId: "",
        type:"",
        sourceId:"",
        sourceName: "",
        targetId:"",
        targetName: "",
        recordStatus: "1"
      },
      rules: {
        sourceId: [
          { required: true, message: "请选择源科室ID", trigger: "blur" }
        ],
        targetId: [
          { required: true, message: "请选择新科室ID", trigger: "blur" }
        
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
  
  created() {
  this.getDeptType();
  
  },
  beforeMount(){
   
      this.getDeptList();
  },
  mounted() {
    this.getRediagSettingByPage();
  },
  methods: {
    async sourceChange() {
     
        this.form.sourceName = this.form.sourceId!==""?this.deptList[this.form.sourceId]:"";
      
    },
    async targetChange() {
      
        this.form.targetName = this.form.targetId!==""?this.deptList[this.form.targetId]:"";
        
    },
    async getDeptType() {
        let res = await service.getDeptType();
         if (res.code === 1) {
         res.data.forEach(item => {
           this.deptTypeList[item.dictValue] = item.dictName
          });
        } 
    },
    async getDeptList() {
        let res = await service.getDeptList();
         if (res.code === 1) {
         res.data.forEach(item => {
           
            this.deptList[item.id] = item.orgNm
          });
         
        } 
    },
    async getRediagSettingByPage() {
      this.loading = true;
      let res = await service.listPageRediagSetting({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        sourceName: this.sourceName, //源部门名称
        targetName: this.targetName //目标部门名称
      });
      this.loading = false;
      this.tableData = res.data;
      this.pageParams.total = res.total;
      if(typeof(tableData) !=="undefined" ){
        this.currentData = this.tableData[0];
         this.currentData.sourceId = parseInt(this.currentData.sourceId);
        this.currentData.targetId = parseInt(this.currentData.targetId);
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
        
      }else{
        this.currentData = [];
      }
     
      
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getRediagSettingByPage();
    },
    rowClick(row) {
      this.currentData = row;
      this.currentData.sourceId = parseInt(this.currentData.sourceId);
      this.currentData.targetId = parseInt(this.currentData.targetId);
      this.$emit("currentData", this.currentData);
      this.form = { ...this.currentData };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        rediagSettingId: "",
        type:"",
        sourceId:"",
        sourceName: "",
        targetId:"",
        targetName: "",
        recordStatus: "1"
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.rediagSettingId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delRediagSettingById(this.form.rediagSettingId);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getRediagSettingByPage();
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
              let res = await service.addRediagSetting(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.getRediagSettingByPage();
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
              let res = await service.updateRediagSetting(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.getRediagSettingByPage();
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
      this.getRediagSettingByPage();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getRediagSettingByPage();
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
    width: calc(100% - 300px);
    padding: 10px;
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