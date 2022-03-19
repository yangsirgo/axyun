<template>
   <div class="catalogue width100 height100 clearfix">
     <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="4">
              <l-read-card ref="readCard" @readCard="getReadCard"></l-read-card>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="病人姓名">
                <el-input v-model="patientName" placeholder="请输入病人姓名" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="病人编号">
                <el-input v-model="patientNum" placeholder="请输入病人编号" clearable></el-input>
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
                <span v-if="scope.row[item.prop] == '2'">已冻结</span>
                <span v-else-if="scope.row[item.prop] == '1'">已解冻</span>
                <span v-else-if="scope.row[item.prop] == '9'">解冻</span>
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
import service from "@/api/financeManagement/prestoreFreezeDetail";
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      patientName: "",
      patientId:"",
      patientNum: "",
      deptList:{},
      prestoreCodeShow:{},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "patientNum",
          label: "病人编号",
          align: "left",
          headerAlign: "center",
          width: "140",
          fixed: false
        },
        {
          prop: "patientName",
          label: "病人姓名",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "prestoreCode",
          label: "预存代码",
          align: "left",
          headerAlign: "center",
          width: "140"
        },
        {
          prop: "freezeMoney",
          label: "冻结金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "freezeReasonCode",
          label: "冻结原因编码",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "freezeReason",
          label: "冻结原因",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "freezeUserCode",
        //   label: "冻结人员编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "freezeUserName",
          label: "冻结人员名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "freezeTime",
          label: "冻结时间",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "unfreezeUserCode",
        //   label: "解冻人员编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "unfreezeUserName",
          label: "解冻人员名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "unfreezeTime",
          label: "解冻时间",
          align: "left",
          headerAlign: "center",
          width: "150"
        },{
          prop: "thirdPartySerialNum",
          label: "第三方流水号",
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
        prestoreFreezeId: "",
        oldPrestoreFreezeId: "",
        patientId: "",
        patientNum: "",
        patientName: "",
        prestoreCode: "",
        freezeMoney: "",
        freezeReasonCode: "",
        freezeReason: "",
        freezeUserId: "",
        freezeUserCode: "",
        freezeUserName: "",
        freezeTime: "",
        unfreezeUserId: "",
        unfreezeUserCode: "",
        unfreezeUserName: "",
        unfreezeTime: "",
        thirdPartySerialNum: "",
        recordStatus: "1"
      },
      rules: {
        patientName: [
          { required: true, message: "请输入病人姓名", trigger: "blur" }
        ],
        patientCode: [
          { required: true, message: "请输入病人代码", trigger: "blur" }
        
        ]
       
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100
      },
      cardInfo:{}
    };
  },
  created: function(){
    this.getPrestorCode();
  },
  mounted() {
    this.getPrestorCode();
    this.getPrestoreFreezeDetailByPage();
  },
  methods: {
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.search();
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
    async getPrestoreFreezeDetailByPage() {
      this.loading = true;
      let res = await service.listPagePrestoreFreezeDetail({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        patientName: this.patientName, 
        patientId:this.cardInfo.patientId,
        patientNum: this.patientNum 
      });
      this.loading = false;
      this.tableData =  res.data.map((item) => {
                    item.freezeMoney =  item.freezeMoney.toFixed(2);
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
      this.getPrestoreFreezeDetailByPage();
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
        prestoreFreezeId: "",
        oldPrestoreFreezeId: "",
        patientId: "",
        patientNum: "",
        patientName: "",
        prestoreCode: "",
        freezeMoney: "",
        freezeReasonCode: "",
        freezeReason: "",
        freezeUserId: "",
        freezeUserCode: "",
        freezeUserName: "",
        freezeTime: "",
        unfreezeUserId: "",
        unfreezeUserCode: "",
        unfreezeUserName: "",
        unfreezeTime: "",
        thirdPartySerialNum: "",
        recordStatus: "1"
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
        this.getPrestoreFreezeDetailByPage();
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
                this.getPrestoreFreezeDetailByPage();
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
              this.getPrestoreFreezeDetailByPage();
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
      this.getPrestoreFreezeDetailByPage();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPrestoreFreezeDetailByPage();
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