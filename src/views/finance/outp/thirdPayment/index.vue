<template>
  <div class="thirdPayment padding16 height100">
    <div class="searchArea">

      <LFormtTitle label="患者姓名">
        <el-input v-model="searchForm.patientName" placeholder="请输入患者姓名" clearable></el-input>
      </LFormtTitle>
      <LFormtTitle label="患者ID">
        <el-input v-model="searchForm.patientId" placeholder="请输入患者ID" clearable></el-input>
      </LFormtTitle>
      <LFormtTitle label="患者编码">
        <el-input v-model="searchForm.patientCode" placeholder="请输入患者编码" clearable></el-input>
      </LFormtTitle>
      <LFormtTitle label="渠道ID">
        <el-input v-model="searchForm.channelId" placeholder="请输入渠道ID" clearable></el-input>
      </LFormtTitle>
      <LFormtTitle label="渠道名称">
        <el-input v-model="searchForm.channelName" placeholder="请输入渠道名称" clearable></el-input>
      </LFormtTitle>
      <LFormtTitle label="渠道编码">
        <el-input v-model="searchForm.channelCode" placeholder="请输入渠道编码" clearable></el-input>
      </LFormtTitle>
      <LFormtTitle label="门诊号">
        <el-input v-model="searchForm.visitCode" placeholder="请输入门诊号" clearable></el-input>
      </LFormtTitle>
      <LFormtTitle label="交易ID">
        <el-input v-model="searchForm.tradeId" placeholder="请输入交易ID" clearable></el-input>
      </LFormtTitle>

      <el-button type="primary" @click="getListInfo" style="margin-left: 16px;">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
    <div class="tableArea">
      <el-table :data="tableData" highlight-current-row border style="height: calc(100% - 40px);">
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width"
          :align="item.align || 'center'" :header-align="item.headerAlign || 'center'">
          <template slot-scope="scope">
            <template v-if="item.prop == 'bizType'">
              <span v-if="scope.row[item.prop] == '00'">门诊预存</span>
              <span v-else-if="scope.row[item.prop] == '01'">门诊结算</span>
              <span v-else-if="scope.row[item.prop] == '02'">住院预缴</span>
              <span v-else="scope.row[item.prop] == '03'">住院结算</span>
            </template>
            <template v-else-if="item.prop == 'recordStatus'">
              <span v-if="scope.row[item.prop] == '0'">初始状态</span>
              <span v-if="scope.row[item.prop] == '1'">正常</span>
              <span v-if="scope.row[item.prop] == '2'">已撤销</span>
              <span v-if="scope.row[item.prop] == '3'">冲销</span>
            </template>
            <template v-else-if="item.prop == 'checkStatus'">
              <span v-if="scope.row[item.prop] == '0'">未对账</span>
              <span v-if="scope.row[item.prop] == '1'">已对账</span>
            </template>
            <template v-else-if="item.prop == 'operate'">
              <el-button type="text" @click="returnMoney(scope.row)">退款</el-button>
            </template>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top:8px;text-align:right;" background @size-change="changeSize" @current-change="handleCurrentChange"
        :current-page="pageParams.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="pageParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import service from "@/api/financeManagement/thirdPayment";
  export default {
    data() {
      return {
        searchForm: {
          patientName: '',
          patientId: '',
          patientCode: '',
          channelId: '',
          channelName: '',
          channelCode: '',
          visitCode: '',
          tradeId: '',
        },
        tableData: [],
        columns: [{
            prop: "patientCode",
            label: "患者编码",
            width: "150",
            fixed: false
          },
          {
            prop: "patientName",
            label: "患者姓名",
            width: "80",
            fixed: false
          },
          {
            prop: "bizType",
            label: "业务类型",
            width: "80"
          },
          // {
          //   prop: "bizNum",
          //   label: "业务id",
          //   width: "200"
          // },
          {
            prop: "bizTime",
            label: "业务时间",
            width: "200"
          },
          {
            prop: "payAmt",
            label: "支付金额",
            width: "100"
          }, {
            prop: "requestePayerName",
            label: "请求支付人员名称",
            width: "150"
          }, {
            prop: "requestePayTime",
            label: "请求支付时间",
            width: "200"
          },
          {
            prop: "payTypeName",
            label: "支付方式名称",
            width: "150"
          }, {
            prop: "recordStatus",
            label: "状态",
            width: "80"
          },
          // {
          //   prop: "payerAccount",
          //   label: "付款人账户",
          //   width: "150"
          // },
          {
            prop: "refundedMoney",
            label: "已退金额",
            width: "90"
          },
          {
            prop: "checkStatus",
            label: "是否对账",
            width: "80"
          }, {
            prop: "tradeId",
            label: "交易ID",
            width: "290"
          },
          {
            prop:"operate",
            label:"操作",
            width:"80"
          }
        ],
        pageParams: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },

      }
    },
    mounted() {
      this.getListInfo();
    },
    methods: {
      async getListInfo() {
        let res = await service.payManageController({
          ...this.searchForm,
          ...this.pageParams
        });
        if (res.code == 1) {
          this.tableData = res.data;
        }
      },
      reset() {
        this.searchForm = {
          patientName: '',
          patientId: '',
          patientCode: '',
          channelId: '',
          channelName: '',
          channelCode: '',
          visitCode: '',
          tradeId: '',
        };
        this.pageParams = {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        };
        this.getListInfo();
      },
      // 退款
      returnMoney(row){

      },
      changeSize(val) {
        this.pageParams.pageSize = val;
        this.getListInfo();
      },
      handleCurrentChange(val) {
        this.pageParams.pageNo = val;
        this.getListInfo();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .thirdPayment {
    background: #fff;
    display: flex;
    flex-direction: column;

    >>>.el-table__body-wrapper {
      height: calc(100% - 24px);
    }

    .searchArea {
      display: flex;
      flex-wrap: wrap;
      .l-input-wrap {
        width: 190px;
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }

    .tableArea {
      flex: 1;
    }
  }
</style>
