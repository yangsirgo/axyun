<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <div class="const-body">
          <el-tabs class="height100" v-model="activeName">
            <el-tab-pane label="一日清单" name="first">
              <div class="const-panel">
                <div class="const-search">
                  <l-formt-title class="one-day-time margin-right-10" label="记账日期">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      v-model="searchData.tiemRange"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </l-formt-title>
                  <el-radio-group
                    class="margin-right-10"
                    v-model="searchData.radio"
                    @change="radioChange"
                  >
                    <el-radio label="1">按照日期</el-radio>
                    <el-radio label="2">按照类别</el-radio>
                  </el-radio-group>
                  <el-button type="primary" @click="searchList">查询</el-button>
                  <el-button class="float-right" type="primary" @click="printMoney" >打印</el-button>
                </div>
                <div class="const-table">
                  <el-table
                    :data="tableData"
                    height="100%"
                    border
                    stripe
                    v-show="searchData.radio === '1'"
                    v-loading="loading"
                  >
                    <!-- 业务列 -->
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      header-align="center"
                      :align="item.align || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <!-- 可自定义内容 -->
                        <template v-if="item.prop === 'classCode'">
                          <span
                            v-if="item.prop === 'classCode' && scope.row['classCode'] != '9999'"
                            :val="scope.row['classCode']"
                            code="FinClassCode"
                            v-codeTransform
                          ></span>
                          <span
                            v-else-if="item.prop === 'classCode' && scope.row['classCode'] == '9999'"
                          >{{'小计'}}</span>
                        </template>
                        <template v-else-if="item.prop === 'chargePrice'">
                          <span>{{scope.row['chargePrice'].toFixed(2) || ''}}</span>
                        </template>
                        <template v-else-if="item.prop === 'chargeAmount'">
                          <span>{{scope.row['chargeAmount'].toFixed(2) || ''}}</span>
                        </template>
                        <template v-else>
                          <span>{{ scope.row[item.prop] }}</span>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>

                  <div class="scroll-vertical " v-if="searchData.radio === '2'">
                    <p v-if="!typeTableData">暂无数据</p>
                    <div class="width100 amountClass">
                      <el-row :gutter="5" >
                        <el-col :span="5" v-for="(value,key) in totalAmountByClass" :key="key">
                          <el-row>
                            <el-col :span="11" >
                              <span v-if="key != '9999'" :val="key" code="FinClassCode" v-codeTransform></span>
                              <span v-if="key == '9999'">总计</span>
                              <span>：</span>
                            </el-col>
                            <el-col :span="13">
                              {{value.toFixed(2) + '（元）'}}
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-for="(value,key) in typeTableData" :key="key">
                      <p class="table-title">
                        <span :val="key" code="FinClassCode" v-codeTransform></span>
                      </p>
                      <el-table :data="value" border v-loading="loading">
                        <el-table-column
                          v-for="(item, index) in typeTableParams"
                          :key="index"
                          :prop="item.prop"
                          :label="item.label"
                          :min-width="item.width"
                          header-align="center"
                          :align="item.align || 'left'"
                          :fixed="item.fixed"
                        >
                          <template slot-scope="scope">
                            <template v-if="item.prop === 'chargePrice'">
                              <span>{{scope.row['chargePrice'].toFixed(2) || ''}}</span>
                            </template>
                            <template v-else-if="item.prop === 'chargeAmount'">
                              <span>{{scope.row['chargeAmount'].toFixed(2) || ''}}</span>
                            </template>
                            <template v-else>
                              <span>{{ scope.row[item.prop] }}</span>
                            </template>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="欠费查询" name="second">
              <div class="const-panel">
                <div class="const-search">
                  <el-row :gutter="10">
                    <el-col :span="4">
                      <l-formt-title label="余额">
                        <el-select v-model="rightSearch.s1" placeholder="请选择">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </l-formt-title>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="rightSearch.s2" placeholder="余额"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input
                        v-model="rightSearch.s3"
                        placeholder="住院号、病案号、姓名"
                        suffix-icon="el-icon-search"
                        @keydown.native.enter="searchCost"
                      ></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" @click="searchCost">查询</el-button>
                    </el-col>
                    <el-col :span="7">
                      <el-button class="float-right" type="primary" @click="printInpPO">打款催单</el-button>
                    </el-col>
                  </el-row>
                </div>
                <div class="const-table">
                  <el-table
                    :data="tableData2"
                    @selection-change="getRowsIdx"
                    border
                    stripe
                    height="100%"
                    v-loading="tlm_isLoading"
                    v-loadmore="{
                      noMoreVar: 'tlm_noMore',
                      loadingVar: 'tlm_isLoading',
                      value: loadNextPage
                    }"
                  >
                  <el-table-column type="selection" width="40px" header-align="center" align="center"></el-table-column>
                    <!-- 业务列 -->
                    <el-table-column
                      v-for="(item, index) in tableParams2"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      header-align="center"
                      :align="item.align || 'left'"
                      :fixed="item.fixed"
                    >
                      <template slot-scope="scope">
                        <!-- 可自定义内容 -->
                        <span
                          v-if="item.prop === 'admissionSdeptId'"
                          tableName="sys_org"
                          :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row[item.prop]
                          }"
                          columns="org_nm"
                          v-tableTransform
                        >--</span>
                        <span
                          v-else-if="item.prop === 'admissionMode'"
                          v-codeTransform
                          code="InType"
                          :val="scope.row[item.prop]"
                        ></span>
                        <span
                          v-else-if="item.prop === 'settlementType'"
                          v-codeTransform
                          code="MEDICAL_INSURANCE_CODE"
                          :val="scope.row[item.prop]"
                        ></span>
                        <span
                          v-else-if="item.prop === 'selfPayAmount'"
                         >{{scope.row[item.prop].toFixed(2) || '0.00'}}</span>
                         <span
                          v-else-if="item.prop === 'prepayBalance'"
                         >{{scope.row[item.prop].toFixed(2) || '0.00'}}</span>
                         <span
                          v-else-if="item.prop === 'selfPayPrepay'"
                         >{{scope.row[item.prop].toFixed(2) || '0.00'}}</span>
                        
                        <span v-else>{{ scope.row[item.prop] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>

// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate()
  );
};
import { mapGetters } from "vuex";
import LeftBar from "../../components/nursingLeftBar";
import {
  dailyDetails,
  itemDetails,
  totalItemDetails,
  getInpPatient
} from "@/api/cost/cost.js";
import {
  getInpChargeDetailVOAndNum,
  getInpChargeDetailVOByClass,
  getInpMoneyByFinClass
} from "@/api/ipnw/leaveHos.js";
// import {onPreview,onPrint } from '@/utils/print'; 
  import {print,preview,onPreview} from '@/utils/print';
export default {
  name: "constManagement",
  components: {
    LeftBar
  },
  data() {
    return {
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      toolBoxs: ["templateQuote"],
      activeName: "first",
      searchData: {
        tiemRange: "",
        radio: "1"
      },
      tableParams: [
        {
          prop: "classCode",
          label: "项目类别",
          align: "left",
          headerAlign: "left",
          width: "80",
          fixed: "left"
        },
        // {
        //   prop: "itemCode",
        //   label: "项目代码",
        //   align: "left",
        //   headerAlign: "left",
        //   width: "100",
        //   fixed: false
        // },
        {
          prop: "itemName",
          label: "项目名称",
          align: "left",
          headerAlign: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          headerAlign: "left",
          width: "70",
          fixed: false
        },
        {
          prop: "chargePrice",
          label: "单价（元）",
          align: "right",
          headerAlign: "left",
          width: "70",
          fixed: false
        },
        {
          prop: "itemQuantity",
          label: "数量",
          align: "left",
          headerAlign: "left",
          width: "50",
          fixed: false
        },
        {
          prop: "chargeAmount",
          label: "金额（元）",
          align: "right",
          headerAlign: "left",
          width: "70",
          fixed: false
        },
        {
          prop: "calculateFeeTime",
          label: "计费时间",
          align: "left",
          headerAlign: "left",
          width: "120",
          fixed: false
        }
      ],
      typeTableParams: [
        // {
        //   prop: "chargeItemId",
        //   label: "项目代码",
        //   align: "left",
        //   headerAlign: "left",
        //   width: "80",
        //   fixed: "left"
        // },
        {
          prop: "itemName",
          label: "项目名称",
          align: "left",
          headerAlign: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          headerAlign: "left",
          width: "70",
          fixed: false
        },
        {
          prop: "chargePrice",
          label: "单价（元）",
          align: "right",
          headerAlign: "left",
          width: "70",
          fixed: false
        },
        {
          prop: "itemQuantity",
          label: "数量",
          align: "left",
          headerAlign: "left",
          width: "50",
          fixed: false
        },{
          prop: "chargeUnit",
          label: "单位",
          align: "left",
          headerAlign: "left",
          width: "50",
          fixed: false
        },
        {
          prop: "chargeAmount",
          label: "金额（元）",
          align: "right",
          headerAlign: "left",
          width: "70",
          fixed: false
        },
        {
          prop: "calculateFeeTime",
          label: "计费时间",
          align: "left",
          headerAlign: "left",
          width: "120",
          fixed: false
        }
      ],
      tableData: [],
      // 按照分类表格数据
      typeTableData: {},
      loading: false,
      options: [
        {
          value: "1",
          label: "不足"
        }
      ],
      rightSearch: {
        s1: "1",
        s2: "",
        s3: ""
      },
      tiemRange2: [],
      tableParams2: [
        /* {
          prop: "k1",
          label: "状态"
        }, */
        {
          prop: "inpCode",
          label: "住院号",
          width: "90"
        },
        {
          prop: "patientName",
          label: "患者"
        },
        {
          prop: "bedCode",
          label: "床号",
          width: "60"
        },
        {
          prop: "admissionSdeptId",
          label: "当前科室"
        },
        {
          prop: "finAdmissionTime",
          label: "入院日期",
          width: "120"
        },
        {
          prop: "admissionMode",
          label: "入院方式"
        },
        {
          prop: "selfPayAmount",
          label: "当前费用（元）",
          align: "right",
          width: "90",
          fixed: false
        },
        {
          prop: "selfPayPrepay",
          label: "预缴金（元）",
          align: "right",
          width: "90",
          fixed: false
        },
        {
          prop: "prepayBalance",
          label: "余额（元）",
          align: "right",
          width: "90",
          fixed: false
        },
        {
          prop: "settlementType",
          label: "结算方式"
        }
      ],
      tableData2: [],
      // 控制table loading
      tlm_isLoading: false,
      qfpageParams: {
        pageNo: 1,
        total: 0,
        pageSize: 20
      },
      // 分类金额汇总
      totalAmountByClass: {},
      // 选中打印催款单数据
      printList: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    tlm_noMore() {
      return (
        Math.ceil(this.qfpageParams.total / this.qfpageParams.pageSize) <=
        this.qfpageParams.pageNo
      );
    }
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.searchData.tiemRange = "";
        this.searchData.radio = "1";
        this.clearData();
      }
    },
    searchData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!this.searchData.tiemRange) {
          this.searchData.tiemRange = new Date();
        }
      }
    }
  },
  mounted() {
    // 默认选中日期
    this.searchData.tiemRange = new Date();
  },
  methods: {
    // 拿到选中数据
    getRowsIdx(rows){
      this.printList = [...rows];
    },
    // 打印催款单
    printInpPO(){
      if(!this.printList || this.printList.length <= 0){
        this.$message("请选择打印催款单的患者");
        return ;
      }
      let list = [];
      this.printList.forEach(val=>{
        let obj = {
          ...val,
          nowDate: new Date().toLocaleString(),
          admissionWdeptName: '一病区'
          };
        list.push(obj);
      })
      let data = {
        inpPOList: list
      }
      onPreview(data,"催款单"); 
    },
    // 一日清单查询
    searchList() {
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请选择一个患者!");
        return;
      }
      let param = {
        type: this.searchData.radio,
        startDate: this.searchData.tiemRange.toLocaleString(),
        endDate: this.searchData.tiemRange.toLocaleString()
      };
      if (this.searchData.radio == "1") {
        this.getInpatientInfo(param);
      } else if (this.searchData.radio == "2") {
        this.getInpChargeByClass(param);
      }
    },

    // 一日清单数据获取
    // eslint-disable-next-line complexity
    async getInpatientInfo(data) {
      if (data.startDate == "") {
        this.$message.error("开始日期不能为空");
        return;
      }
      if (data.endDate == "") {
        this.$message.error("结束日期不能为空");
        return;
      }
      if (!this.receivePatientData.inpCode) {
        this.$message.error("inpCode 不能为空");
        return;
      }
      try {
        this.loading = true;
        let res = await getInpChargeDetailVOAndNum({
          startDate: data.startDate + " 00:00:00",
          stopDate: data.endDate + " 23:59:59",
          inpCode: this.receivePatientData.inpCode
        });
        this.tableData = res.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.message || "获取住院收费信息失败");
      }
    },
    // 一日清单数据获取 按分类
    // eslint-disable-next-line complexity
    async getInpChargeByClass(data) {
      if (!this.receivePatientData.inpCode) {
        this.$message.error("inpCode 不能为空");
        return;
      }
      try {
        this.loading = true;
        let res = await getInpChargeDetailVOByClass({
          inpCode: this.receivePatientData.inpCode
        });
        this.typeTableData = res.data;
        this.getFinClassMoney(data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.message || "获取住院收费信息失败");
      }
    },
    // 获取分类汇总金额
    async getFinClassMoney(data){
      try {
        this.loading = true;
        let res = await getInpMoneyByFinClass({
          inpCode: this.receivePatientData.inpCode
        });
        this.totalAmountByClass = res.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.message || "获取住院收费分类金额失败");
      }
    },
    radioChange() {
      // let param = {
      //   type: this.searchData.radio,
      //   startDate:
      //     this.searchData.dates[0] == ""
      //       ? ""
      //       : this.searchData.dates[0] + " 00:00:00",
      //   endDate:
      //     this.searchData.dates[1] == ""
      //       ? ""
      //       : this.searchData.dates[1] + " 23:59:59"
      // };
      // this.getInpatientInfo(param);
    },
    // 欠费查询
    searchCost() {
      this.qfpageParams.pageNo = 1;
      this.qfpageParams.total = 0;
      this.loadCost();
    },
    // 欠费数据获取
    loadCost() {
      this.tlm_isLoading = true;
      getInpPatient({
        ...this.qfpageParams,
        patientName: this.rightSearch.s3,
        prepayBalance: this.rightSearch.s2
      })
        .then(res => {
          if (res.code === 1) {
            if (this.qfpageParams.pageNo === 1) {
              this.tableData2 = res.data;
            } else {
              this.tableData2 = this.tableData2.concat(res.data);
            }
            this.qfpageParams = res.pageParams;
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
        });
    },
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.qfpageParams.pageNo++;
      this.loadCost();
    },
    clearData() {
      this.tableData = [];
      this.typeTableData = [];
    },
    messageHandler() {},
    // 打印一日清单
    printMoney(){
      let list = [];
      if(this.searchData.radio == "1"){
        list = [...this.tableData]
      }else if(this.searchData.radio == "2"){
        this.typeTableData.forEach((key,value)=>{
          list.push(value);
        })
      }
      let data = {
        inpCode: this.receivePatientData.inpCode || "",
        patientName: this.receivePatientData.patientName || '',
        bedCode: this.receivePatientData.bedCode || '',
        a: list
      }
      onPreview(data,"住院一日清单"); 
    }
  }
};
</script>

<style lang="scss" scoped>
.const-body {
  height: 100%;
  padding: 20px;
  padding-top: 0;
  background-color: $l-color-white;
  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }
}
.const-panel {
  height: 100%;
}
.const-search {
  margin-bottom: 10px;
}
.const-table {
  height: calc(100% - 48px);
}
.line36 {
  line-height: 36px;
}
.one-day-time {
  width: 275px;
  vertical-align: top;
}
.table-title {
  margin: 20px 0 10px;
  font-weight: 700;
}
.amountClass {
  font-size:15px;
  font-weight:400;
  color:rgba(148,157,163,1);
  line-height: 30px;
}
</style>
