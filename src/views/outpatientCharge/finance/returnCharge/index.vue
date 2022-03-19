<template>
  <div class="div-body" ref="page">
    <!-- 上部 -->
    <el-card class="box-card-top padding10">
      <el-row class="width100" :gutter="10">
        <el-col :span="3">
          <el-input placeholder="请读取医保卡、身份证、就诊卡" suffix-icon="el-icon-ali-sousuo" v-model="cardNum"></el-input>
        </el-col>
        <el-col :span="2">
          <!--<el-button type="primary" class="margin-left-10">读卡</el-button>-->
          <el-button type="primary" class="duka-button" @click="readCard"><i class="iconfont iconduka"></i>读卡
          </el-button>
        </el-col>
        <el-col :span="15" class="float-right">
          <el-button class="float-right plain-button" @click="resetSearch">重置</el-button>
          <el-button type="primary" class="float-right margin-right-6" @click="search">查询</el-button>
          <l-select-with-title
            :title="'状态'"
            multiple
            class="float-right margin-right-6"
            style="width:350px;"
            v-model="searchForm.status">
            <el-option :key="'1'" :label="'可退'" value="1"></el-option>
            <el-option :key="'2'" :label="'已退'" value="2"></el-option>
          </l-select-with-title>
          <l-inputwith-title :title="'姓名'" class="float-right margin-right-6" v-model="searchForm.patientName"></l-inputwith-title>
          <el-date-picker
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="float-right margin-right-6"
            v-model="dateTime"
          ></el-date-picker>
        </el-col>
      </el-row>
      <br/>
      <el-dropdown>
        <span class="table-top">
          <!-- <i class="el-icon-ali-fuhao-dayin"></i> -->
          重打发票
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>重打发票</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <br/>
      <br/>
      <el-table :data="tableData" border stripe @current-change="currentChange">
        <!-- <el-table-column type="selection" width="35px" header-align="center" align="center"></el-table-column> -->
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'left'"
          :fixed="item.fixed === true"
        >
          <template slot-scope="scope">
            <!--操作部分自定义-->
            <template v-if="item.prop == 'recordStatus'">
              <span class="overflow-point">{{scope.row[item.prop]=='1'?'可退':'已退' }}</span>
            </template>
            <template v-else>
              <span class="overflow-point">{{ scope.row[item.prop]}}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 下部 -->
    <el-card class="box-card-bottom padding10" style="overflow-y: auto">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待申请" name="first">
          <el-button type="primary" @click="openDialog">申请退费</el-button>
        </el-tab-pane>
        <el-tab-pane label="已申请" name="second">
          <el-button type="primary" @click="submitRefund" >确认退费</el-button>
          <el-button type="primary plain-button">撤销退费</el-button>
        </el-tab-pane>
      </el-tabs>
      <el-table :data="tableDataTwo" border stripe class="table-bottom">
        <el-table-column
          v-for="(item, index) in tableParamsTwo"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'left'"
          :fixed="item.fixed === true"
        >
          <template slot-scope="scope">
            <!--操作部分自定义-->
            <template v-if="item.prop == 'orderQuantity' && activeName == 'first'">
              <el-input-number v-model="scope.row.refundQuantity" controls-position="right"  :min="0" :max="scope.row[item.prop]"></el-input-number>
            </template>
            <template v-else>
              <span class="overflow-point">{{ scope.row[item.prop]}}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 退费弹窗 -->
    <el-dialog
      title="门诊退费"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <return-dialog :currentCharge.sync="currentCharge"></return-dialog>
      <el-row style="padding: 20px;border:1px solid #E4E4E4">
        <el-col :span="24">
          <el-button class="float-right">取消</el-button>
          <el-button type="primary" class="float-right margin-right-10" @click="apply">确认申请</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import returnDialog from './components/returnDialog';
  import adHeight from "@/mixins/adHeight";
  import service from "@/api/appointment/retreat";
  import appointment from '@/api/appointment/appointment';
  // 重写date 格式化方法
  Date.prototype.toLocaleString = function () {
    return (
      this.getFullYear() +
      "-" +
      (this.getMonth() + 1) +
      "-" +
      this.getDate() +
      " " +
      this.getHours() +
      ":" +
      this.getMinutes() +
      ":" +
      this.getSeconds() +
      ""
    );
  };

  export default {
    components: {
      returnDialog
    },
    mixins: [adHeight],
    data() {
      return {
        // 卡号
        cardNum:'',
        // 弹窗
        dialogVisible: false,
        // 表格数据
        tableData: [],
        // 表头
        tableParams: [
          {
            label: "发票凭证号",
            prop: "receiptNo",
            width: "120",
            align: "left"
          },
          {
            label: "门诊号",
            prop: "visitCode",
            width: "100",
            align: "left"
          },
          {
            label: "患者",
            prop: "patientName",
            width: "100",
            align: "left"
          },
          {
            label: "就诊科室",
            prop: "ouptDeptId",
            align: "left"
          },
          {
            label: "就诊医生",
            prop: "doctorName",
            width: "100",
            align: "left"
          },
          {
            label: "挂号时间",
            prop: "chargeTime",
            width: "120",
            align: "left"
          },
          {
            label: "收费时间",
            prop: "chargeTime",
            width: "120",
            align: "left"
          },
          {
            label: "金额",
            prop: "totalMoney",
            width: "100",
            align: "right"
          },
          {
            label: "收费人",
            prop: "chargeUserName",
            width: "100",
            align: "left"
          },
          {
            label: "状态",
            prop: "recordStatus",
            width: "80",
            align: "left"
          },
          {
            label: "重打次数",
            prop: "no",
            width: "80",
            align: "left"
          }
        ],
        // 默认卡片
        activeName: "first",
        tableParamsTwo: [
          {
            label: "执行状态",
            prop: "status",
            width: "100",
            align: "left"
          },
          {
            label: "项目类型",
            prop: "orderType",
            width: "100",
            align: "left"
          },
          {
            label: "项目名称",
            prop: "itemName",
            width: "300",
            align: "left"
          },
          {
            label: "规格",
            prop: "chargeUnit",
            width: "80",
            align: "left"
          },
          {
            label: "单位",
            prop: "chargeUnit",
            width: "100",
            align: "left"
          },
          {
            label: "单价",
            prop: "chargePrice",
            width: "100",
            align: "right"
          },
          {
            label: "实退数量",
            prop: "orderQuantity",
            width: "100",
            align: "left"
          },
          {
            label: "金额",
            prop: "totalMoney",
            width: "100",
            align: "right"
          }
        ],
        tableDataTwo: [],
        // 时间
        dateTime:[],
        // 搜索对象
        searchForm:{},
        // 患者对象
        patientInfo:{},
        // 待申请明细
        applyList:[],
        // 已申请
        appliedList:[],
        // 当前交易数据
        currentCharge:{},
        // 退费明细集合(传后台用)
        reChargeList:[],
        // 退费明细集合（传组件用）
        reChargeListTwo:[],
        
      };
    },
     watch: {
      currentCharge(val) {
        this.currentCharge = val;
      }
    },
    mounted(){
      // 拿到收费列表
      this.search();
    },
    methods: {
      handleClick() {
        if(this.activeName === 'first'){
          this.tableDataTwo = this.applyList;
        }else if(this.activeName === 'second'){
          this.tableDataTwo = this.appliedList;
        }
      },
      // 打开对话框
      openDialog() {
        // 拿到退费明细列表
        this.getReChargeList();
        this.getApplyData();
        this.dialogVisible = true;
      },
      // 关闭对话框
      handleClose() {
        this.dialogVisible = false;
      },
      async readCard(){
        try {
          this.$showLoading();
          const response = await appointment.getPatientInfo({
            cardNum:this.cardNum
          });
          this.patientInfo = response.data;
          this.dateTime = [];
          this.searchForm = {};
          this.search();
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 搜索
      async search(){
       try {
         this.$showLoading();
          let sDate = '';
          let eDate = '';
          if (this.dateTime && this.dateTime.length > 1) {
            sDate = this.dateTime[0].toLocaleString();
            eDate = this.dateTime[1].toLocaleString();
          }
          const response = await service.getReturnCharge({
            ...this.searchForm,
            sDate:sDate,
            eDate:eDate,
            patientId:this.patientInfo.patientId,
            pageNo:1,
            pageSize:10
          });
          this.tableData = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 点击退费列表
      async currentChange(row){
        try {
          if(row.recordStatus == '9'){
            return;
          }
          this.$showLoading();
          this.currentCharge = {...row};
          // 未申请
          const response = await service.getReChargeInfo({
            tradeId:row.tradeId
          });
          this.tableDataTwo = response.data;
          this.applyList = response.data;
          // 查询已申请
          const res = await service.getRefundInfo({
            tradeId:row.tradeId
          })
          this.appliedList = res.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 申请退费
      async apply(){
        try {
          this.$showLoading();
          const response = await service.reChargeApply({
            ...this.currentCharge,
            refundReasonCode:'1',
            recordStatus:"0"
          });
          this.dialogVisible = false;
          this.resetAll();
          this.$hideLoading();
          this.$message({message: '退费申请成功',type: 'success'});
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 筛选退费明细
      getReChargeList(){
        let list = this.tableDataTwo;
        for(let i=0;i<list.length;i++){
          if(list[i].refundQuantity && list[i].refundQuantity > 0){
            let obj = {
              chargeDetailId: list[i].chargeDetailId,
              groupId: list[i].groupId,
              chargeItemId: list[i].chargeItemId,
              chargeQuantity: list[i].chargeQuantity,
              refundQuantity: list[i].refundQuantity,
              recordStatus:"0",
            }
            this.reChargeList.push(obj);
            this.reChargeListTwo.push(list[i])
          }
        }
      },
      // 拼装退费申请对象
      getApplyData(){
        this.$delete(this.currentCharge,"recordStatus");
        this.$set(this.currentCharge,'refundApplyDetailList',this.reChargeList);
        this.$set(this.currentCharge,'tableList',this.reChargeListTwo);
      },
      // 确认退费
      async submitRefund(){
        try {
          this.$showLoading();
          const res = await service.refundCharge({
            applyDataVersion: this.appliedList[0].applyDataVersion,
            refundApplyId: this.appliedList[0].refundApplyId
          });
          this.resetAll();
          this.search();
          this.$hideLoading();
          this.$message({message: '退费成功',type: 'success'});
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 重置
      resetAll(){
        this.currentCharge = {};
        this.tableDataTwo = [];
        this.reChargeList = [];
        this.reChargeListTwo = [];
        this.applyList = [];
        this.appliedList = [];
      },
      // 重置搜索
      resetSearch(){
        this.cardNum = '';
        this.patientInfo = {};
        this.dateTime = [];
        this.searchForm = {};
        this.search();
      }

    }
  };
</script>
<style lang="scss" scoped>
  .div-body {
    /*margin-top: 30px;*/
    /*padding: 0 20px;*/
    width: 100%;
    height: 100%;
    /*min-width: 1024px;*/

    .box-card-top {
      width: 100%;
      height: 60%;

      .input-width {
        width: 100%;
      }

      .table-top {
        color: rgba(46, 50, 58, 1);
        line-height: 21px;
      }
    }

    .box-card-bottom {
      width: 100%;
      height: calc(40% - 20px);
      margin-top: 20px;

      .table-bottom {
        margin-top: 10px;
      }
    }
  }

  .duka-button {
    width: 200px;
    height: 38px;
    margin-left: 10px;
    border: none;
    border-radius: 2px;
    float: left;

    i {
      display: inline-block;
      margin-right: 10px;
    }
  }

  .plain-button {
    height: 36px;
    border-radius: 2px;
    background-color: $l-color-white;
    border: 1px solid $l-color-primary;
    font-size: $l-font-size;
    
    font-weight: 500;
    color: $l-color-primary;
  }

</style>
