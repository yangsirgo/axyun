<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="8">
              <LFormtTitle label="预存代码">
                <el-input v-model="prestoreCode" placeholder="请输入预存代码" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="预存代码名称">
                <el-input v-model="prestoreName" placeholder="请输入预存代码名称" clearable></el-input>
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
            :hidden="item.hidden"
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
              <template v-else-if="item.prop == 'outpEnable'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'phyExamEnable'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'prestoreCollection'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'canRefund'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'permitPrintReceipt'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'windowHandle'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'prestoreType'">
                <span >{{ prestoreTypeShow[scope.row[item.prop]] }}</span>
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
         <LFormtTitle label="预存代码ID" :required="true" class="margin-top-20" :disabled="true" style="display:none">
          <el-form-item prop="prestoreId">
            <el-input
              v-model="form.prestoreId"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="预存代码" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="prestoreCode">
            <el-input
              v-model="form.prestoreCode"
              placeholder="请输入预存代码"
              clearable
              :disabled="!addStatus"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="预存代码名称" :required="true" class="margin-top-20" >
          <el-form-item prop="prestoreName">
            <el-input
              v-model="form.prestoreName"
              placeholder="请输入预存代码名称"
              clearable
              :disabled="false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="预存类型" :required="false" class="margin-top-20">
          <el-form-item>
            <l-value-domain
                  :value.sync="form.prestoreType"
                  remoteUrl="/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0008"
                  remoteShowKey="dictionaryName"
                  remoteValueKey="dictionaryValue"
                  placeholder="请选择"
            ></l-value-domain>
          </el-form-item> 
          </LFormtTitle>
        <LFormtTitle label="门诊是否可用" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.outpEnable" label="1">是</el-radio>
            <el-radio v-model="form.outpEnable" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
          <LFormtTitle label="体检是否可用" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.phyExamEnable" label="1">是</el-radio>
            <el-radio v-model="form.phyExamEnable" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
          <LFormtTitle label="是否托收" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.prestoreCollection" label="1">是</el-radio>
            <el-radio v-model="form.prestoreCollection" label="0">否</el-radio>
          </el-form-item> 
          </LFormtTitle>
           <LFormtTitle label="是否可退" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.canRefund" label="1">是</el-radio>
            <el-radio v-model="form.canRefund" label="0">否</el-radio>
          </el-form-item> 
          </LFormtTitle>
          <LFormtTitle label="是否允许打印收据" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.permitPrintReceipt" label="1">是</el-radio>
            <el-radio v-model="form.permitPrintReceipt" label="0">否</el-radio>
          </el-form-item> 
          </LFormtTitle>
          <LFormtTitle label="窗口办理" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.windowHandle" label="1">是</el-radio>
            <el-radio v-model="form.windowHandle" label="0">否</el-radio>
          </el-form-item> 
          </LFormtTitle>
          <LFormtTitle label="优先级" :required="false" class="margin-top-20">
            <el-form-item prop="prestorePriority">
            <el-input-number
              v-model="form.prestorePriority"
              placeholder="请输入优先级"
              clearable
              :disabled="false"
            ></el-input-number>
          </el-form-item>
          </LFormtTitle>
          <LFormtTitle label="排序" :required="true" class="margin-top-20" >
          <el-form-item prop="sortNum">
            <el-input-number
              v-model="form.sortNum"
              placeholder="请输入排序"
              clearable
              :disabled="false"
            ></el-input-number>
          </el-form-item>
        </LFormtTitle>
           <LFormtTitle label="状态" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.recordStatus" label="1">启用</el-radio>
            <el-radio v-model="form.recordStatus" label="0">未启用</el-radio>
          </el-form-item>
        </LFormtTitle>
           <LFormtTitle label="备注" :required="false" class="margin-top-20">
          <el-form-item>
            <el-input v-model="form.recordRemark" placeholder="请输入备注" clearable :disabled="false"></el-input>
          </el-form-item>
        </LFormtTitle>
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
import service from "@/api/financeManagement/prestoreCode";
export default {
  components: {},
  data() {
   
    return {
      addStatus: false,
      loading: false,
      prestoreCode: "",
      prestoreName: "",
      prestoreTypeShow:{},
      tableData: [],
       isTrue :{
        "0":"否",
        "1":"是"
      },
      // 表格列
      tableParams: [
        
        {
          prop: "prestoreCode",
          label: "预存代码",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "prestoreName",
          label: "预存代码名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "prestoreType",
          label: "预存类型",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "outpEnable",
          label: "门诊是否可用",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "phyExamEnable",
          label: "体检是否可用",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "prestoreCollection",
          label: "是否托收",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "canRefund",
          label: "是否可退",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "permitPrintReceipt",
          label: "是否允许打印收据",
          align: "left",
          headerAlign: "center",
          width: "150"
        }, {
          prop: "windowHandle",
          label: "窗口办理",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "prestorePriority",
          label: "优先级",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "sortNum",
          label: "排序",
          align: "right",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "recordRemark",
          label: "备注",
          align: "left",
          headerAlign: "center",
          width: "120"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        prestoreId: "",
        prestoreCode: "",
        prestoreName: "",
        outpEnable: "1",
        phyExamEnable: "1",
        prestoreCollection:"1",
        canRefund:"1",
        permitPrintReceipt:"1",
        windowHandle:"1",
        prestoreType:"1",
        prestorePriority:"1",
        sortNum:"1",
        recordStatus:"1",
        recordRemark:""
      },
      rules: {
        orderTypeCode: [
          { required: true, message: "请输入预存代码", trigger: "blur" }
        ],
        orderTypeName: [
          { required: true, message: "请输入预存代码名称", trigger: "blur" }
         
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
  
created: function() {
   
    this.getPrestorType();
   
  },
  mounted() {
    this.getPrestoreCodeByPage();
  },
  methods: {
    async getPrestorType(){
      //获取预存类型
      let res = await service.getPrestorType();
      if (res.code === 1) {
          res.data.forEach(item => {
            this.prestoreTypeShow[item.dictionaryValue] = item.dictionaryName;
          });
        } 
    },
    async getPrestoreCodeByPage() {
      this.loading = true;
      let res = await service.listPagePrestoreCode({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        prestoreCode: this.prestoreCode, // 预存代码
        prestoreName: this.prestoreName // 预存代码名称
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
      this.getPrestoreCodeByPage();
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
        prestoreCode: "",
        prestoreName: "",
        outpEnable: "1",
        phyExamEnable: "1",
        prestoreCollection:"1",
        canRefund:"1",
        permitPrintReceipt:"1",
        windowHandle:"1",
        prestoreType:"1",
        prestorePriority:"1",
        sortNum:"1",
        recordStatus:"1",
        recordRemark:""
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.prestoreId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delPrestoreCodeById(this.form.prestoreId);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getPrestoreCodeByPage();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    async save() {
      if (this.addStatus) {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            try {
              this.$showLoading();
              let res = await service.addPrestoreCode(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.search();
              }else{
                 this.$message({ type: "flag", message: "新增失败" });
              }
             
              
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "新增失败");
            }
          }
        });
      } else {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            try {
              this.$showLoading();
              let res = await service.updatePrestoreCode(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.search();
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "请重新选择要修改的数据！");
            }
          }
        });
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getPrestoreCodeByPage();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPrestoreCodeByPage();
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
      height: calc(100% - 156px);
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