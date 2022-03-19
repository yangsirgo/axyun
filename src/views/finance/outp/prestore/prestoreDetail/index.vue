<template>
   <div class="catalogue width100 height100 clearfix">
      <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="4">
              <l-read-card ref="readCard" @readCard="getReadCard"></l-read-card>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="预存类型">
                <l-value-domain
                      :value.sync="prestoreCode"
                      remoteUrl="/finance-outp/prestoreCode/listPrestoreCode"
                      remoteShowKey="prestoreName"
                      remoteValueKey="prestoreCode"
                      placeholder="请选择"
                ></l-value-domain>
              </LFormtTitle>
           </el-col>
            <el-col :span="6">
              <LFormtTitle label="预存时间">
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
            <el-col :span="1" class="float-right">
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
                <span v-if="scope.row[item.prop] == '0'">初始化</span>
                <span v-else-if="scope.row[item.prop] == '1'">正常</span>
                <span v-else-if="scope.row[item.prop] == '2'">已退</span>
                <span v-else-if="scope.row[item.prop] == '9'">退费</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
               <template v-else-if="item.prop == 'prestoreCode'">
                <span >{{ prestoreCodeShow[scope.row[item.prop]] }}</span>
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
  </div>
</template>
<script>
import service from "@/api/financeManagement/prestoreDetail";
import {dateFtt} from '@/utils';
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      endDate: "",
      startDate: "",
      prestoreCode: "",
      patientId: "",
      recordStatus:"",
      rangeDate: [
        new Date().format("yyyy-MM-dd")+ " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      startDate : new Date().format("yyyy-MM-dd")+ " 00:00:00",
      endDate : new Date().format("yyyy-MM-dd") + " 23:59:59",  
      prestoreCodeShow:{},
      tableData: [],
      // 表格列
      tableParams: [
        // {
        //   prop: "patientId",
        //   label: "患者ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150",
        //   fixed: false
        // },
        {
          prop: "patientCode",
          label: "患者编码",
          align: "left",
          headerAlign: "center",
          width: "140"
        },
        {
          prop: "patientName",
          label: "患者名称",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        // {
        //   prop: "prestoreCode",
        //   label: "预存类型",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "170"
        // },
        {
          prop: "prestoreMoney",
          label: "预存金额",
          align: "right",
          headerAlign: "center",
          width: "110"
        },{
          prop: "prestoreBalance",
          label: "预存余额",
          align: "right",
          headerAlign: "center",
          width: "110"
        },
        // {
        //   prop: "businessType",
        //   label: "业务类型",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "170"
        // },
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
          width: "140"
        },
         {
          prop: "channelName",
          label: "渠道名称",
          align: "left",
          headerAlign: "center",
          width: "140"
        },
        // {
        //   prop: "orgName",
        //   label: "支付平台机构名称",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "orgAccount",
        //   label: "支付平台机构账号",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "checkNum",
          label: "票号",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "companyName",
          label: "单位名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "accountName",
        //   label: "账号名称",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "prestoreUserId",
        //   label: "预存人员ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "prestoreUserName",
          label: "预存人员",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        {
          prop: "prestoreTime",
          label: "预存时间",
          align: "left",
          headerAlign: "center",
          width: "170"
        },
        // {
        //   prop: "thirdPartyPrestoreId",
        //   label: "第三方预存ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "checkUserId",
        //   label: "审核人员ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "checkUserName",
        //   label: "审核人员",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "moneySource",
        //   label: "金额来源",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "divisionCode",
        //   label: "院区代码",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "thirdPartySerialNum",
          label: "第三方支付流水",
          align: "left",
          headerAlign: "center",
          width: "290"
        },
        {
          prop: "recordStatus",
          label: "状态标志",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        {
          prop: "recordRemark",
          label: "备注",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "agentName",
          label: "代办人姓名",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "agentIdentificationNum",
          label: "代办人身份证号",
          align: "left",
          headerAlign: "center",
          width: "200"
        },
        {
          prop: "agentTelNum",
          label: "代办人联系电话",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "appCode",
        //   label: "应用代码",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "appType",
        //   label: "应用类型",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "channel",
        //   label: "渠道",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
       
        
      ],
      // 当前对象
      currentData: {},
      cardInfo : {},
      // 表单
      form: {
        prestoreDetailId: "",
        patientId: "",
        patientCode: "",
        patientName: "",
        prestoreCode: "",
        prestoreType: "",
        prestoreMoney: "",
        prestoreBalance: "",
        businessType: "",
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        presentMoney: "",
        orgName: "",
        orgAccount: "",
        checkNum: "",
        companyName: "",
        accountName: "",
        prestoreUserId: "",
        prestoreUserName: "",
        prestoreTime: "",
        thirdPartyPrestoreId: "",
        checkUserId: "",
        checkUserName: "",
        moneySource: "",
        divisionCode: "",
        thirdPartySerialNum: "",
        recordStatus: "1",
        recordRemark: "",
        agentName: "",
        agentIdentificationNum: "",
        agentTelNum: "",
        appCode: "",
        appType: "",
        channel: ""
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100
      }
    };
  },
  created(){
    this.getPrestorCode();
  },
  mounted() {
    this.getListPagePrestoreDetail();
  },
  methods: {
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.search();
    },
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
     async getPrestorCode(){
      //获取预存类型
      let res = await service.listPrestoreCode();
      if (res.code === 1) {
          res.data.forEach(item => {
            this.prestoreCodeShow[item.prestoreCode] = item.prestoreName;
          });
        } 
    },
    async getListPagePrestoreDetail() {
      this.loading = true;
      let res = await service.getListPagePrestoreDetail({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        patientId: this.cardInfo.patientId, 
        prestoreCode: this.prestoreCode, 
        recordStatus: this.recordStatus, 
        startDate: this.startDate,
        endDate: this.endDate
      });
      this.loading = false;
      this.tableData =  res.data.map((item) => {
                    item.prestoreMoney =  item.prestoreMoney.toFixed(2);
                    //item.presentMoney = item.presentMoney.toFixed(2);
                    item.prestoreBalance = item.prestoreBalance.toFixed(2);
                    return item;
                  });
      if(typeof(tableData) !=="undefined" ){
        this.currentData = this.tableData[0];
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
        this.pageParams.total = res.total;
      }else{
        this.currentData = [];
        this.pageParams.total = res.total;
      }
     
      
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getListPagePrestoreDetail();
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
        prestoreDetailId: "",
        patientId: "",
        patientCode: "",
        patientName: "",
        prestoreCode: "",
        prestoreType: "",
        prestoreMoney: "",
        prestoreBalance: "",
        businessType: "",
        payTypeId: "",
        payTypeCode: "",
        payTypeName: "",
        presentMoney: "",
        orgName: "",
        orgAccount: "",
        checkNum: "",
        companyName: "",
        accountName: "",
        prestoreUserId: "",
        prestoreUserName: "",
        prestoreTime: "",
        thirdPartyPrestoreId: "",
        checkUserId: "",
        checkUserName: "",
        moneySource: "",
        divisionCode: "",
        thirdPartySerialNum: "",
        recordStatus: "1",
        recordRemark: "",
        agentName: "",
        agentIdentificationNum: "",
        agentTelNum: "",
        appCode: "",
        appType: "",
        channel: ""
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
        this.getListPagePrestoreDetail();
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
                this.getListPagePrestoreDetail();
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
              this.getListPagePrestoreDetail();
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
      this.getListPagePrestoreDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPagePrestoreDetail();
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