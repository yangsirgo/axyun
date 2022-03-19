<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="8">
              <LFormtTitle label="医嘱类型代码">
                <el-input v-model="orderTypeCode" placeholder="请输入医嘱类型代码" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="医嘱类型名称">
                <el-input v-model="orderTypeName" placeholder="请输入医嘱类型名称" clearable></el-input>
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
            :v-show="!item.hidden"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '0'">未启用</span>
                <span v-else-if="scope.row[item.prop] == '1'">启用</span>
              </template>
              <template v-else-if="item.prop == 'splitRefundFlag'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'autoCheckFlag'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>  
               <template v-else-if="item.prop == 'refundApplyFlag'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
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
         <LFormtTitle label="医嘱类型ID" :required="true" class="margin-top-20" :disabled="true" style="display:none">
          <el-form-item prop="orderId">
            <el-input
              v-model="form.orderId"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="医嘱类型代码" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="orderTypeCode">
            <el-input
              v-model="form.orderTypeCode"
              placeholder="请输入医嘱类型代码"
              clearable
              :disabled="!addStatus"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="医嘱类型名称" :required="true" class="margin-top-20" >
          <el-form-item prop="orderTypeName">
            <el-input
              v-model="form.orderTypeName"
              placeholder="请输入医嘱类型名称"
              clearable
              :disabled="false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="可拆分退费标志" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.splitRefundFlag" label="1">是</el-radio>
            <el-radio v-model="form.splitRefundFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
          <LFormtTitle label="自动审核标志" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.autoCheckFlag" label="1">是</el-radio>
            <el-radio v-model="form.autoCheckFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
          <LFormtTitle label="退款需申请标志" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.refundApplyFlag" label="1">是</el-radio>
            <el-radio v-model="form.refundApplyFlag" label="0">否</el-radio>
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
import service from "@/api/financeManagement/finOrderRefundManage";
export default {
  components: {},
  data() {
   
    return {
      addStatus: false,
      loading: false,
      orderTypeCode: "",
      orderTypeName: "",
      tableData: [],
       isTrue :{
        "0":"否",
        "1":"是"
      },
      // 表格列
      tableParams: [
       
        {
          prop: "orderTypeCode",
          label: "医嘱类型代码",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "orderTypeName",
          label: "医嘱类型名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "splitRefundFlag",
          label: "可拆分退费标志",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "autoCheckFlag",
          label: "自动审核标志",
          align: "left",
          headerAlign: "center",
          width: "120"
        }, {
          prop: "refundApplyFlag",
          label: "退款需申请标志",
          align: "left",
          headerAlign: "center",
          width: "120"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        orderId: "",
        orderTypeCode: "",
        orderTypeName: "",
        splitRefundFlag: "1",
        autoCheckFlag: "1",
        refundApplyFlag:"1"
      },
      rules: {
        orderTypeCode: [
          { required: true, message: "请输入医嘱类型代码", trigger: "blur" }
        ],
        orderTypeName: [
          { required: true, message: "请输入医嘱类型名称", trigger: "blur" }
         
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
    this.getOrderRefundManageByPage();
  },
  methods: {
    async getOrderRefundManageByPage() {
      this.loading = true;
      let res = await service.listPageOrderRefundManage({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        orderTypeCode: this.orderTypeCode, // 医嘱类型代码
        orderTypeName: this.orderTypeName // 医嘱类型名称
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
      this.pageParams.total = res.total;
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getOrderRefundManageByPage();
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
        orderId: "",
        orderTypeCode: "",
        orderTypeName: "",
        splitRefundFlag: "1",
        autoCheckFlag: "1",
        refundApplyFlag: "1"
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.orderId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delOrderRefundManageById(this.form.orderId);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getOrderRefundManageByPage();
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
              let res = await service.addOrderRefundManage(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.getOrderRefundManageByPage();
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
              let res = await service.updateOrderRefundManage(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.getOrderRefundManageByPage();
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
          }
        });
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getOrderRefundManageByPage();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getOrderRefundManageByPage();
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