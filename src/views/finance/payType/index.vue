<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="8">
              <LFormtTitle label="支付方式代码">
                <el-input v-model="payTypeCode" placeholder="请输入支付方式代码" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
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
              <template v-else-if="item.prop == 'optionalFlag'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'bankBillFlag'">
                 <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'chargeMediumFlag'">
                 <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'refundAmtLimitFlag'">
                 <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'permitChangeFlag'">
                <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'directPayFlag'">
                 <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'isSpecialTradeFlag'">
                 <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'refundMediumFlag'">
                 <span >{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop == 'payAmtClass'">
                <span >{{ payAmtClassShow[scope.row[item.prop]] }}</span>
              </template>
               <template v-else-if="item.prop == 'payChannelCode'">
                <span >{{ payChannelCodeShow[scope.row[item.prop]] }}</span>
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
         <LFormtTitle label="支付方式ID" :required="true" class="margin-top-20" :disabled="true" style="display:none">
          <el-form-item prop="payTypeId">
            <el-input
              v-model="form.payTypeId"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="支付方式代码" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="payTypeCode">
            <el-input
              v-model="form.payTypeCode"
              placeholder="请输入支付方式代码"
              clearable
              :disabled="!addStatus"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="支付方式名称" :required="true" class="margin-top-20" >
          <el-form-item prop="payTypeName">
            <el-input
              v-model="form.payTypeName"
              placeholder="请输入支付方式名称"
              clearable
              :disabled="false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付方式别名" :required="true" class="margin-top-20" >
          <el-form-item prop="payTypeAlias">
            <el-input
              v-model="form.payTypeAlias"
              placeholder="请输入支付方式别名"
              clearable
              :disabled="false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付方式类别代码" :required="true" :disabled="!addStatus" class="margin-top-20" >
          <el-form-item prop="payTypeClassCode">
            <el-input
              v-model="form.payTypeClassCode"
              clearable
              :disabled="!addStatus"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付方式类别名称" :required="true" class="margin-top-20" >
          <el-form-item prop="payTypeClassName">
            <l-value-domain
              :value.sync="form.payTypeClassName"
              remoteUrl="/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0018"
              clearable := "false"
              remoteShowKey="dictionaryName"
              remoteValueKey="dictionaryName"
              placeholder="请选择支付方式类别"
              @change="payTypeClassChange"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付平台支付方式编码" class="margin-top-20" >
          <el-form-item prop="payPlatformPayTypeCode">
            <el-input
              v-model="form.payPlatformPayTypeCode"
              placeholder="请输入支付平台支付方式编码"
              clearable
              :disabled="false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付平台支付账户"  class="margin-top-20" >
          <el-form-item prop="payPlatformAccount">
            <el-input
              v-model="form.payPlatformAccount"
              placeholder="请输入支付平台支付账户"
              clearable
              :disabled="false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="支付平台支付密码"  class="margin-top-20" >
          <el-form-item prop="payPlatformPassword">
            <el-input
              v-model="form.payPlatformPassword"
              placeholder="请输入支付平台支付密码"
              clearable
              :disabled="false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <!--<LFormtTitle label="图标" :required="true" class="margin-top-20" >-->
          <!--<el-form-item prop="icon">-->
            <!--<el-input-->
              <!--v-model="form.icon"-->
              <!--placeholder="请输入图标"-->
              <!--clearable-->
              <!--:disabled="false"-->
            <!--&gt;</el-input>-->
          <!--</el-form-item>-->
        <!--</LFormtTitle>-->
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
         <LFormtTitle label="支付金额类别" :required="true" class="margin-top-20">
          <el-form-item>
            <l-value-domain
                  :value.sync="form.payAmtClass"
                  remoteUrl="/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0001"
                  remoteShowKey="dictionaryName"
                  remoteValueKey="dictionaryValue"
                  placeholder="请选择"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="支付渠道" :required="true" class="margin-top-20">
          <el-form-item>
            <l-value-domain
                  :value.sync="form.payChannelCode"
                  remoteUrl="/finance-pub/dictionary/listDictionaryByCataCode?cataCode=F0004"
                  remoteShowKey="dictionaryName"
                  remoteValueKey="dictionaryCode"
                  placeholder="请选择"
            ></l-value-domain>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="状态" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.recordStatus" label="1">启用</el-radio>
            <el-radio v-model="form.recordStatus" label="0">未启用</el-radio>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="可选标志" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.optionalFlag" label="1">是</el-radio>
            <el-radio v-model="form.optionalFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="退款是否需要介质" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.refundMediumFlag" label="1">是</el-radio>
            <el-radio v-model="form.refundMediumFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
         <LFormtTitle label="是否为特定交易支付" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.isSpecialTradeFlag" label="1">是</el-radio>
            <el-radio v-model="form.isSpecialTradeFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="直接支付标志" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.directPayFlag" label="1">是</el-radio>
            <el-radio v-model="form.directPayFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="是否允许找零" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.permitChangeFlag" label="1">是</el-radio>
            <el-radio v-model="form.permitChangeFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="退款金额限制标志" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.refundAmtLimitFlag" label="1">是</el-radio>
            <el-radio v-model="form.refundAmtLimitFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="收费是否需要介质" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.chargeMediumFlag" label="1">是</el-radio>
            <el-radio v-model="form.chargeMediumFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="银行票据标志" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.bankBillFlag" label="1">是</el-radio>
            <el-radio v-model="form.bankBillFlag" label="0">否</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="线下支付标志" :required="true" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.offlinePayFlag" label="1">是</el-radio>
            <el-radio v-model="form.offlinePayFlag" label="0">否</el-radio>
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
import service from "@/api/financeManagement/finPayType";
import channelInfoService from "@/api/financeManagement/channelInfo";
export default {
  components: {},
  data() {

    return {
      addStatus: false,
      loading: false,
      payTypeCode: "",
      payChannelCodeShow : {},
      payAmtClassShow : {},
      payTypeName: "",
      isTrue :{
        "0":"否",
        "1":"是"
      },
      tableData: [],
      // 表格列
      tableParams: [

        {
          prop: "payTypeCode",
          label: "支付方式代码",
          align: "left",
          headerAlign: "center",
          width: "170",
          fixed: false
        },
        {
          prop: "payTypeName",
          label: "支付方式名称",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "payTypeAlias",
          label: "支付方式别名",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "payTypeClassCode",
          label: "支付方式类别代码",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "payTypeClassName",
          label: "支付方式类别名称",
          align: "left",
          headerAlign: "center",
          width: "170"
        },{
          prop: "sortNum",
          label: "排序",
          align: "right",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "150"
        },

        {
          prop: "optionalFlag",
          label: "可选标志",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "payAmtClass",
          label: "支付金额类别",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "refundMediumFlag",
          label: "退款是否需要介质",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "isSpecialTradeFlag",
          label: "是否为特定交易支付",
          align: "left",
          headerAlign: "center",
          width: "180"
        },
        {
          prop: "payChannelCode",
          label: "支付渠道",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "directPayFlag",
          label: "直接支付标志",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "permitChangeFlag",
          label: "是否允许找零",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "refundAmtLimitFlag",
          label: "退款金额限制标志",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "chargeMediumFlag",
          label: "收费是否需要介质",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "bankBillFlag",
          label: "银行票据标志",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "offlinePayFlag",
          label: "线下支付标志",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "payPlatformPayTypeCode",
          label: "支付平台支付方式编码",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "payPlatformAccount",
          label: "支付平台支付账户",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "payPlatformPassword",
          label: "支付平台支付密码",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "icon",
        //   label: "图标",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "120"
        // },
        {
          prop: "recordRemark",
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
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        payTypeAlias:"",
        payTypeClassCode:"",
        payTypeClassName:"",
        payPlatformPayTypeCode:"",
        payPlatformAccount:"",
        payPlatformPassword:"",
        icon:"",
        sortNum:"",
        optionalFlag:"",
        payAmtClass:"",
        refundMediumFlag:"",
        isSpecialTradeFlag:"",
        payChannelCode:"",
        directPayFlag:"",
        permitChangeFlag:"",
        refundAmtLimitFlag:"",
        chargeMediumFlag:"",
        bankBillFlag:"",
        offlinePayFlag:"",
        recordStatus: "1",
        recordRemark: ""
      },
      rules: {
        payTypeCode: [
          { required: true, message: "请输入支付方式代码", trigger: "blur" }
        ],
        payTypeName: [
          { required: true, message: "请输入支付方式名称", trigger: "blur" }

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

    this.getPayChannelCode();

  },
  beforeMount: function() {
     this.getPayAmtClass();
    },
  mounted() {
    this.getPayTypeByPage();
  },
  methods: {
    payTypeClassChange(val, item) {
      console.info(item);
      console.info(val);
      this.form.payTypeClassCode = item.dictionaryValue;
    },
   async getPayChannelCode(){
      //支付渠道
      let res = await service.getPayChannelCode();
      if (res.code === 1) {
          res.data.forEach(item => {
            this.payChannelCodeShow[item.dictionaryValue] = item.dictionaryName;
          });
        }
  },
 async getPayAmtClass(){

      //支付金额类别
      let ress = await service.getPayAmtClass();
       if (ress.code === 1) {
          ress.data.forEach(item => {
            this.payAmtClassShow[item.dictionaryValue] = item.dictionaryName;
          });
        }

  },

    async getPayTypeByPage() {
      this.loading = true;
      let res = await service.listPagePayType({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        payTypeCode: this.payTypeCode, // 支付方式代码
        payTypeName: this.payTypeName // 支付方式名称
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
      this.getPayTypeByPage();
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
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        payTypeAlias:"",
        payTypeClassCode:"",
        payTypeClassName:"",
        payPlatformPayTypeCode:"",
        payPlatformAccount:"",
        payPlatformPassword:"",
        icon:"",
        sortNum:"1",
        optionalFlag:"1",
        payAmtClass:"",
        refundMediumFlag:"1",
        isSpecialTradeFlag:"1",
        payChannelCode:"",
        directPayFlag:"1",
        permitChangeFlag:"1",
        refundAmtLimitFlag:"1",
        chargeMediumFlag:"1",
        bankBillFlag:"1",
        offlinePayFlag:"1",
        recordStatus: "1",
        recordRemark: ""
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.payTypeId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delPayTypeById(this.form.payTypeId);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getPayTypeByPage();
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
              let res = await service.addPayType(this.form);
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({ type: "success", message: "新增成功" });
                this.getPayTypeByPage();
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
              let res = await service.updatePayType(this.form);
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.getPayTypeByPage();
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
      this.getPayTypeByPage();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPayTypeByPage();
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
