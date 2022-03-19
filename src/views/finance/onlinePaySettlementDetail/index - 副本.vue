<template>
   <div class="catalogue width100 height100 clearfix">
      <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="5">
              <LFormtTitle label="支付交易流水号">
                <el-input v-model="payTradeSerialNum" placeholder="请输入支付交易流水号" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="业务类型">
                <el-input v-model="bizType" placeholder="请输入业务类型" clearable></el-input>
              </LFormtTitle>
            </el-col>
              <el-col :span="5">
              <LFormtTitle label="业务编号">
                <el-input v-model="bizNum" placeholder="请输入业务编号" clearable></el-input>
              </LFormtTitle>
            </el-col>
              <el-col :span="5">
              <LFormtTitle label="状态标志">
                <el-input v-model="recordStatus" placeholder="请输入状态标志" clearable></el-input>
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
              <template v-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '0'">初始状态</span>
                <span v-else-if="scope.row[item.prop] == '1'">正常</span>
                <span v-else-if="scope.row[item.prop] == '2'">已撤销</span>
                <span v-else-if="scope.row[item.prop] == '3'">冲销</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'platformPayStatus' || item.prop == 'bizCallbackStatus'">
                <span v-if="scope.row[item.prop] == '0'">未返回</span>
                <span v-else-if="scope.row[item.prop] == '1'">成功</span>
                <span v-else-if="scope.row[item.prop] == '2'">失败</span>
                <span v-else-if="scope.row[item.prop] == '9'">异常</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
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
     <!--<div class="catalogue-right height100 float-right" > 
      <el-form :model="form" :rules="rules" ref="form" class="catalogue-right-form">
         <LFormtTitle label="跨部门换诊配置ID" :required="true" class="margin-top-20" :disabled="true" style="display:none">
          <el-form-item prop="OnlinePaySettlementDetailId">
            <el-input
              v-model="form.OnlinePaySettlementDetailId"
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
        <LFormtTitle label="源部门名称" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="sourceDeptId">
             <l-value-domain
                  :value.sync="form.sourceDeptId"
                  remoteUrl="/wadmin/hos/dept"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  placeholder="请选择科室"
                  @change="sourceDeptChange"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="目标部门名称" :required="true" class="margin-top-20" >
          <el-form-item prop="targetDeptId">
           <l-value-domain
                  :value.sync="form.targetDeptId"
                  remoteUrl="/wadmin/hos/dept"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  placeholder="请选择科室"
                  @change="targetDeptChange"
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
              v-model="form.patientNum"
              :disabled="true"
              :hidden="true"
            ></el-input>
        
       
            <el-input  style="display:none"
              v-model="form.sourceDeptName"
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
    </div>-->
  </div>
</template>
<script>
import service from "@/api/financeManagement/onlinePaySettlementDetail";
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      payTradeSerialNum: "",
      bizType: "",
      bizNum: "",
      recordStatus: "",
      deptList:{},
      prestoreCodeShow:{},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "payTradeSerialNum",
          label: "支付交易流水号",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "bizType",
          label: "业务类型",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "bizNum",
          label: "业务编号",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "bizTime",
          label: "业务时间",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "payAmt",
          label: "支付金额",
          align: "right",
          headerAlign: "center",
          width: "150"
        },{
          prop: "requestePayerId",
          label: "请求支付人员ID",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "requestePayerName",
          label: "请求支付人员名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "requestePayTime",
          label: "请求支付时间",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        // {
        //   prop: "payTypeId",
        //   label: "支付方式ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "payTypeCode",
          label: "支付方式代码",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "payTypeName",
          label: "支付方式名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "recordStatus",
          label: "状态标志",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "appCode",
          label: "应用代码",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "appType",
          label: "应用类型",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "payerAccount",
          label: "付款人账户",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "refundedMoney",
          label: "已退金额",
          align: "right",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "oldPaySettlementDetailId",
          label: "原支付结算明细ID",
          align: "left",
          headerAlign: "center",
          width: "290"
        },
        {
          prop: "oldPayTradeSerialNum",
          label: "原支付交易流水号",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "checkStatus",
          label: "对账状态",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "checkTime",
          label: "对账时间",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "platformPayStatus",
          label: "平台支付结果",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "platformPayMsg",
          label: "平台支付信息",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "bizCallbackUrl",
          label: "业务回调地址",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "bizCallbackStatus",
          label: "业务回调状态",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "bizCallbackMsg",
          label: "业务回调反馈信息",
          align: "left",
          headerAlign: "center",
          width: "150"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        paySettlementDetailId: "",
        payTradeSerialNum: "",
        bizType: "",
        bizNum: "",
        bizTime: "",
        payAmt: "",
        requestePayerId: "",
        requestePayerName: "",
        requestePayTime: "",
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        recordStatus: "1",
        appCode: "",
        appType: "",
        payerAccount: "",
        refundedMoney: "",
        oldPaySettlementDetailId: "",
        oldPayTradeSerialNum: "",
        checkStatus: "",
        checkTime: "",
        platformPayStatus: "",
        platformPayMsg: "",
        bizCallbackUrl: "",
        bizCallbackStatus: "",
        bizCallbackMsg: ""
      },
      rules: {
        payTradeSerialNum: [
          { required: true, message: "请输入支付交易流水号", trigger: "blur" }
        ],
        bizType: [
          { required: true, message: "请输入业务类型", trigger: "blur" }
        
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
    this.getListPageOnlinePaySettlementDetail();
  },
  methods: {
    async getListPageOnlinePaySettlementDetail() {
      this.loading = true;
      let res = await service.getListPageOnlinePaySettlementDetail({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        payTradeSerialNum: this.payTradeSerialNum, 
        bizNum: this.bizNum, 
        recordStatus: this.recordStatus, 
        bizType: this.bizType 
      });
      this.loading = false;
      this.tableData =  res.data.map((item) => {
                    item.payAmt = item.payAmt.toFixed(2);
                    item.refundedMoney = item.refundedMoney.toFixed(2);
                    return item;
                  });
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
      this.getListPageOnlinePaySettlementDetail();
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
        paySettlementDetailId: "",
        payTradeSerialNum: "",
        bizType: "",
        bizNum: "",
        bizTime: "",
        payAmt: "",
        requestePayerId: "",
        requestePayerName: "",
        requestePayTime: "",
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        recordStatus: "1",
        appCode: "",
        appType: "",
        payerAccount: "",
        refundedMoney: "",
        oldPaySettlementDetailId: "",
        oldPayTradeSerialNum: "",
        checkStatus: "",
        checkTime: "",
        platformPayStatus: "",
        platformPayMsg: "",
        bizCallbackUrl: "",
        bizCallbackStatus: "",
        bizCallbackMsg: ""
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
        this.getListPageOnlinePaySettlementDetail();
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
                this.getListPageOnlinePaySettlementDetail();
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
              this.getListPageOnlinePaySettlementDetail();
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
      this.getListPageOnlinePaySettlementDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPageOnlinePaySettlementDetail();
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