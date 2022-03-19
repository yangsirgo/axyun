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
              <LFormtTitle label="患者姓名">
                <el-input v-model="patientName" placeholder="请输入患者姓名" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="消费时间">
                <el-date-picker
                            v-model="rangeDate"
                            @input="immediUpdate"
                            type="datetimerange"
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
                <span v-if="scope.row[item.prop] == '0'">暂停</span>
                <span v-else-if="scope.row[item.prop] == '1'">启用</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'prestoreCode'">
                <span >{{ prestoreCodeShow[scope.row[item.prop]] }}</span>
              </template>
               <template v-else-if="item.prop == 'chargeType'">
                <span :val="scope.row['chargeType']" code="charge_type" v-codeTransform></span>
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
import service from "@/api/financeManagement/prestoreConsumeDetail";
import {dateFtt} from '@/utils';
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      prestoreCode: "",
      patientName:"",
      patientId:"",
      recordStatus:"",
      deptList:{},
      prestoreCodeShow:{},
      tableData: [],
      // 表格列
      tableParams: [
        
        // {
        //   prop: "tradeId",
        //   label: "交易ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "100"
        // },
        {
          prop: "prestoreCode",
          label: "预存代码",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "patientCode",
          label: "患者编号",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "170"
        },{
          prop: "consumeMoney",
          label: "消费金额",
          align: "right",
          headerAlign: "center",
          width: "150"
        },{
          prop: "prestoreBalance",
          label: "预存余额",
          align: "right",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "ouptDeptId",
        //   label: "科室ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },{
        //   prop: "doctorId",
        //   label: "医生ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "170"
        // },
        {
          prop: "doctorName",
          label: "医生姓名",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "chargeType",
          label: "收费类型",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "chargeUserName",
          label: "收费人员",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "chargeUserId",
        //   label: "收费人员ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "180"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        prestoreConsumeId: "",
        tradeId: "",
        prestoreCode: "",
        patientCode: "",
        patientId: "",
        patientName: "",
        consumeMoney: "",
        prestoreBalance: "",
        doctorId: "",
        ouptDeptId: "",
        doctorName: "",
        chargeType: "",
        chargeUserId: "",
        chargeUserName: "",
        chargeTime: ""
      },
      rangeDate: [
        new Date().format("yyyy-MM-dd")+ " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      startDate : new Date().format("yyyy-MM-dd")+ " 00:00:00",
      endDate : new Date().format("yyyy-MM-dd") + " 23:59:59",  
      cardInfo: {},
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
    this.getListPrestoreConsumeDetail();
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
    async getListPrestoreConsumeDetail() {
      this.loading = true;
      let res = await service.getListPrestoreConsumeDetail({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        startDate: this.startDate, 
        endDate: this.endDate,
        patientId: this.cardInfo.patientId,
        patientName:this.patientName
      });
      this.loading = false;
      this.tableData =  res.data.map((item) => {
                    item.consumeMoney =  item.consumeMoney.toFixed(2);
                    item.prestoreBalance = item.prestoreBalance.toFixed(2);
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
      this.getListPrestoreConsumeDetail();
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
        prestoreConsumeId: "",
        tradeId: "",
        prestoreCode: "",
        patientCode: "",
        patientId: "",
        patientName: "",
        consumeMoney: "",
        prestoreBalance: "",
        doctorId: "",
        ouptDeptId: "",
        doctorName: "",
        chargeType: "",
        chargeUserId: "",
        chargeUserName: "",
        chargeTime: ""
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
        this.getListPrestoreConsumeDetail();
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
                this.getListPrestoreConsumeDetail();
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
              this.getListPrestoreConsumeDetail();
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
      this.getListPrestoreConsumeDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPrestoreConsumeDetail();
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