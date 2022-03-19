<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="5">
              <LFormtTitle label="业务名称">
                <el-input v-model="businessName" placeholder="请输入业务名称" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="角色名称">
                <el-input v-model="roleName" placeholder="请输入角色名称" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="支付方式名称">
                <el-input v-model="payTypeName" placeholder="请输入支付方式名称" clearable></el-input>
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
         <LFormtTitle label="ID" :required="true" class="margin-top-20" :disabled="true" style="display:none">
          <el-form-item prop="id">
            <el-input
              v-model="form.id"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="角色代码" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="roleCode">
            <el-input
              v-model="form.roleCode"
              placeholder="请输入角色代码"
              :disabled="true"
              clearable
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="角色名称" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="roleName">
            <l-value-domain
              :value.sync="form.roleName"
              remoteUrl="/admin/role/page"
              remoteShowKey="name"
              remoteValueKey="name"
              clearable
              placeholder="请选择角色名称"
              @change="roleChange"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="业务代码" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="businessCode">
            <el-input
              v-model="form.businessCode"
              placeholder="请输入业务代码"
              :disabled="true"
              clearable
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="业务名称" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="businessName">
            <l-value-domain
              :value.sync="form.businessName"
              remoteUrl="/finance-pub/dictionary/getBusinessType"
              remoteShowKey="dictionaryName"
              remoteValueKey="dictionaryName"
              clearable
              placeholder="请选择"
              @change="businessTypeChange"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付方式ID" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="payTypeId">
            <el-input
              v-model="form.payTypeId"
              placeholder="请输入支付方式ID"
              clearable
              :disabled="true"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付方式名称" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="payTypeName">
            <l-value-domain
              :value.sync="form.payTypeName"
              remoteUrl="/finance-pub/payType/getPayTypeByPayAmtClass"
              remoteShowKey="payTypeName"
              remoteValueKey="payTypeName"
              clearable
              placeholder="请选择"
              @change="payTypeChange"
            ></l-value-domain>
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
import service from "@/api/financeManagement/authPayType";
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      roleName: "",
      payTypeName: "",
      businessName: "",
      deptList:{},
      deptTypeList:{},
      tableData: [],
      // 表格列
      tableParams: [

        {
          prop: "roleCode",
          label: "角色代码",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },
        {
          prop: "roleName",
          label: "角色名称",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "businessCode",
          label: "业务代码",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "businessName",
          label: "业务名称",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "payTypeId",
          label: "支付方式ID",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "payTypeName",
          label: "支付方式名称",
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
        roleCode: "",
        businessName: "",
        businessCode: "",
        roleName: "",
        payTypeId: "",
        payTypeName: ""
      },
      rules: {
        roleCode: [
          { required: true, message: "请输入角色代码", trigger: "blur" }
        ],
        businessCode: [
          { required: true, message: "请输入业务代码", trigger: "blur" }

        ],
        payTypeId: [
          { required: true, message: "请输入支付方式ID", trigger: "blur" }
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
    this.getAuthPayTypeByPage();
  },
  methods: {
    async getAuthPayTypeByPage() {
      this.loading = true;
      let res = await service.listPageAuthPayType({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        payTypeName: this.payTypeName,
        roleName: this.roleName,
        businessName: this.businessName
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

    roleChange(val, item) {
      console.info(item);
      console.info(val);
      this.form.roleCode = item.code;
    },
    businessTypeChange(val, item) {
      console.info(item);
      console.info(val);
      this.form.businessCode = item.dictionaryCode;
    },
    payTypeChange(val, item) {
      console.info(item);
      console.info(val);
      this.form.payTypeId = item.payTypeId;
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getAuthPayTypeByPage();
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
          roleCode: "",
          businessName: "",
          businessCode: "",
          roleName: "",
          payTypeId: "",
          payTypeName: ""
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.id) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delAuthPayTypeById(this.form.id);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getAuthPayTypeByPage();
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
              let res = await service.addAuthPayType(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.getAuthPayTypeByPage();
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
              let res = await service.updateAuthPayType(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.getAuthPayTypeByPage();
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
      this.getAuthPayTypeByPage();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getAuthPayTypeByPage();
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
