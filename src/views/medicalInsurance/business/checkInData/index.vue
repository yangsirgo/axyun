<template>
   <div class="catalogue width100 height100 clearfix">
      <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="8">
              <l-formt-title label="医保类别" required>
                <l-value-domain
                  :value.sync="medicareType"
                  remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                  remoteShowKey="dictName"
                  remoteValueKey="dictCode"
                  placeholder="请选择"
                ></l-value-domain>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="对账流水号">
                <el-input v-model="checkBillSerialNum" placeholder="请输入对账流水号" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="用户名称">
                <el-input v-model="userName" placeholder="请输入用户名称" clearable></el-input>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row  :gutter="10">
            <el-col :span="8">
              <LFormtTitle label="签到时间">
                <el-date-picker
                            v-model="signInDate"
                            type="datetimerange"
                            @input="signInDateUpdate"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                  </el-date-picker>
                </LFormtTitle>
              </el-col>
               <el-col :span="8">
              <LFormtTitle label="签退时间">
                <el-date-picker
                            v-model="signOutDate"
                            type="datetimerange"
                            @input="signOutDateUpdate"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                  </el-date-picker>
                </LFormtTitle>
              </el-col>
            
          </el-row>
        </div>
         <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
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
                <span v-if="scope.row[item.prop] == '1'">已签到</span>
                <span v-else-if="scope.row[item.prop] == '2'">已签退</span>
              </template>
               <template v-else-if="item.prop === 'medicareType'">
                <span>{{ mtShow[scope.row[item.prop]] }}</span>
              </template>
               <span  v-else class="overflow-point">{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click.native.prevent="signOutEdit(scope.row)" type="text" size="small">签退</el-button>
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
       <el-dialog title="请输入签退失败原因！" :visible.sync="dialogVisible" width="50%" class="dialog">
      <el-form :model="dialogForm">
        <el-form-item label="签退失败原因:" >
          <el-input v-model="dialogForm.signOutErrorMessage" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="signOutEditSub()">确 定</el-button>
      </div>

    </el-dialog>
   </div>
  </div>
</template>
<script>
import service from "@/api/medicalInsurance/checkInData";
import {dateFtt} from '@/utils';
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      dialogVisible:false,
      userName: "",
      checkBillSerialNum:"",
      medicareType:"",
      signInTimeStrat:"",
      signInTimeStop:"",
      signOutTimeStrat:"",
      signOutTimeStop:"",
      signInDate:[],
      signOutDate:[],
      deptList:{},
      mtShow:{},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "medicareType",
          label: "医保类型",
          align: "center",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "checkBillSerialNum",
          label: "对账流水号",
          align: "center",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "userName",
          label: "用户名称",
          align: "center",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "userCode",
          label: "用户编码",
          align: "center",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "signInTime",
          label: "签到时间",
          align: "center",
          headerAlign: "center",
          width: "150"
        },{
          prop: "signOutTime",
          label: "签退时间",
          align: "center",
          headerAlign: "center",
          width: "150"
        },{
          prop: "signOutErrorMessage",
          label: "签退失败原因",
          align: "center",
          headerAlign: "center",
          width: "150"
        },{
          prop: "recordStatus",
          label: "状态",
          align: "center",
          headerAlign: "center",
          width: "150"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        siSignId: "",
        medicareType: "",
        checkBillSerialNum: "",
        userId: "",
        userName: "",
        userCode: "",
        signInTime: "",
        signOutTime: "",
        signOutErrorMessage: "",
        recordStatus: "1"
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100
      },
      dialogForm:{
        signOutErrorMessage:"",
        siSignId:"",
        status:""
      }
    };
  },
  created() {
    this.getMedicareType();
  },
  mounted() {
    this.listPageCheckInData();
  },
  methods: {
    async signOutEdit(row){
      this.dialogForm.siSignId = row.siSignId;
      this.dialogForm.status = "1";
      try {
        let res = await service.signOut(this.dialogForm);
        this.$message({ type: "success", message: "签退成功！" });
        this.listPageCheckInData();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "签退失败！");
      }
      return;

      if (row.recordStatus =='2') {
        this.$message.error("该数据状态为已签退！无需再次填写！");
        return;
      }
      this.dialogVisible = true;
      this.dialogForm.signOutErrorMessage = row.signOutErrorMessage;
      this.dialogForm.siSignId = row.siSignId;
    },
   async signOutEditSub(){
      if (!this.dialogForm.signOutErrorMessage) {
        this.$message.error("请填写签退失败原因");
        return;
      }
      this.dialogVisible = false;
      let res = await service.signOut(this.dialogForm);
      
    },
    async getMedicareType() {
      let res = await service.getPagemd();
      if (res.code === 1) {
          res.data.forEach(item => {
             this.mtShow[item.dictCode] = item.dictName;
          });
        } 
    },
    signInDateUpdate(e) {
      this.$nextTick(() => {
          if(e==null){
              this.signInTimeStrat='';
              this.signInTimeStop='';
           }else{
              this.$set(this,"signInDate", [e[0], e[1]]);
              this.signInTimeStrat=dateFtt(this.signInDate[0]);
              this.signInTimeStop=dateFtt(this.signInDate[1]);                        
          }

      });
  },
signOutDateUpdate(e) {
      this.$nextTick(() => {
          if(e==null){
              this.signOutTimeStrat='';
              this.signOutTimeStop='';
           }else{
              this.$set(this,"signOutDate", [e[0], e[1]]);
              this.signOutTimeStrat=dateFtt(this.signOutDate[0]);
              this.signOutTimeStop=dateFtt(this.signOutDate[1]);                        
          }
      });
  },
    async listPageCheckInData() {
      this.loading = true;
      let res = await service.listPageCheckInData({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        userName: this.userName, 
        checkBillSerialNum: this.checkBillSerialNum,
        medicareType:this.medicareType,
        signInTimeStrat:this.signInTimeStrat,
        signInTimeStop:this.signInTimeStop,
        signOutTimeStrat:this.signOutTimeStrat,
        signOutTimeStop:this.signOutTimeStop
      });
      this.loading = false;
       this.tableData =  res.data;
      if(typeof(tableData) !=="undefined" ){
        this.currentData = this.tableData[0];
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
        this.pageParams.total = res.total;
      }else{
        this.currentData = [];
      }
     
      
    },
    search() {
      this.pageParams.pageNo = 1;
      this.listPageCheckInData();
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
        siSignId: "",
        medicareType: "",
        checkBillSerialNum: "",
        userId: "",
        userName: "",
        userCode: "",
        signInTime: "",
        signOutTime: "",
        signOutErrorMessage: "",
        recordStatus: "1"
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.siSignId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delOnlinePaySettlementDetailById(this.form.OnlinePaySettlementDetailId);
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.listPageCheckInData();
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
                this.listPageCheckInData();
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
              this.listPageCheckInData();
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
      this.listPageCheckInData();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.listPageCheckInData();
    }
  },
  
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
    display: flex;
    flex-direction: column;
    padding: 10px;
    overflow: hidden;
    border-right: 1px solid $l-color-bgcolor-11;
    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      flex: 1;
      overflow: hidden;
      margin-bottom: 10px;
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