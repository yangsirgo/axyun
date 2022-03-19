<template>
  <div class="width100 height100" style="padding-top:10px">
    <el-row :gutter="10" class="rowClass">
      <el-col :span="6">
        <LFormtTitle label="结算时间">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable = "false"
          ></el-date-picker>
        </LFormtTitle>
      </el-col>
      <el-col :span="5">
        <LFormtTitle label="姓名">
          <el-input v-model="form.patientName" placeholder="姓名" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="5">
        <LFormtTitle label="家床号">
          <el-input v-model="form.inpCode" placeholder="家床号" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="4">
        <LFormtTitle label="病案号">
          <el-input v-model="form.mrCode" placeholder="病案号" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="4">
        <LFormtTitle label="结算类型">
          <l-value-domain
            code="settlementType"
            :value.sync="form.settlementType"
            placeholder="请选择"
            clearable
          />
        </LFormtTitle>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="rowClass margin-top-10">
      <el-col :span="5">
        <LFormtTitle label="结算人员">
          <!-- <el-input v-model="form.finDischargeUserName" placeholder="姓名" clearable></el-input> -->
          <el-select
            v-model="form.finDischargeUserId"
            filterable
            remote
            reserve-keyword
            placeholder="姓名/拼音/五笔"
            :remote-method="selectAllUser"
            :loading="selLoading"
            clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </LFormtTitle>
      </el-col>
      <el-col :span="5">
        <LFormtTitle label="发票号码">
          <el-input v-model="form.receiptNum" placeholder="发票号码" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <!--<el-col :span="4">
       <LFormtTitle label="医保结算状态">
         <el-input v-model="form.inpCode" placeholder="住院号" clearable></el-input>
       </LFormtTitle>
      </el-col>-->

      <el-col :span="14" class="float-right">
        <el-button type="primary" plain class="float-right" @click="cancal">重置</el-button>
        <el-button type="primary" plain class="float-right margin-right-10" @click="setOut">导出</el-button>
        <el-button type="primary" class="float-right margin-right-10" @click="select">查询</el-button>
        <el-button type="primary" class="float-right" @click="inpChargeCollectShow('1')">费用清单</el-button>
      </el-col>
    </el-row>

    <div class="margin-top-10 table">
      <el-table
        :data="tableData"
        width="100%"
        height="100%"
        stripe
        border
        v-loadmore="load"
        highlight-current-row
        v-loading="loading"
        @row-click="rowClick"
        :element-loading-text="$t('retreat.loadInfo')"
      >
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'patientGender'">
              <span :val="scope.row['patientGender']" code="GENDER_CODE" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'freezePrepayAmount' || item.prop == 'nonMedicalAmount' || item.prop == 'prepayBalance' || item.prop == 'cashSettleAmount'
               || item.prop == 'checkSettleAmount' || item.prop == 'totalFeeAmount' || item.prop == 'inHosDays'|| item.prop == 'siPersonAccountPayAmt'|| item.prop == 'doctorCheckNum'
              || item.prop == 'drugMoney'|| item.prop == 'singleDiseaseMoney'|| item.prop == 'derateAmount'|| item.prop == 'freePayAmount'|| item.prop == 'selfPayAmount'|| item.prop == 'selfPayOverdrawAmount'
              || item.prop == 'freePayOverdrawAmount'|| item.prop == 'selfPayPrepay'|| item.prop == 'freePayLimitMoney'|| item.prop == 'settleAmount'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'recordStatus'">
              <span v-if="scope.row[item.prop] == '1'">财务出院</span>
              <span v-if="scope.row[item.prop] == '2'">撤销撤床</span>
              <span v-if="scope.row[item.prop] == '9'">回归</span>
            </template>
            <template v-else-if="item.prop == 'admitTypeCode'">
              <span :val="scope.row[item.prop]" code="AdmitHosType" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'companyCode'">
              <span :val="scope.row[item.prop]" code="settlementCompany" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'siRegDiseaseCode'">
              <span :val="scope.row[item.prop]" code="SiDiseaseType" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'admissionSituation'">
              <span :val="scope.row[item.prop]" code="EntranceCode" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'settlementType'">
              <span
                v-if="scope.row[item.prop]"
                :val="scope.row[item.prop]"
                code="settlementType"
                v-codeTransform
              ></span>
              <span v-if="!scope.row[item.prop]">自费</span>
            </template>
            <template v-else class="overflow-point">{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="10" class="margin-top-10 rowClass">
        <!--<el-col :span="6">-->
          <!--&lt;!&ndash;<el-button type="primary">打印</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button type="primary" @click="setOut">导出</el-button>&ndash;&gt;-->
        <!--</el-col>-->
        <el-col :span="24" class="height100">
          <el-pagination
            class="float-right page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-dialog
        v-if="inpChargeCollectVisiable"
        :title="this.flag == '1' ? '费用清单' : '费用汇总'"
        :visible.sync="inpChargeCollectVisiable"
        width="1200px"
      >
        <div>
          <inpChargeCollect :reportData="reportData"></inpChargeCollect>
        </div>
        <!--<span slot="footer" class="dialog-footer">
          <el-button @click="inpChargeCollectVisiable = false">取 消</el-button>
          <el-button type="primary" @click="inpChargeCollectVisiable = false">关 闭</el-button>
        </span>-->
      </el-dialog></div>
</div>
</template>
<script>
  import { getTableDatas,transformCodeList } from "@/api/directive/directiveRequest";
  import inpChargeCollect from "@/views/finance/inp/report/components/inpChargeCollect.vue";
 import { mapActions, mapGetters } from "vuex";
import service from "@/api/financeManagement/inp.js";
import { jsonToExcel } from "@/utils/excel/excel";
// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};
export default {
  props: {
    sendData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    sendData: function (val) {
      console.log(val);
      this.getTotalItemDetails();
      this.reportData = {
        ...val,
        flag: this.flag // 1 住院费用日清单报表 2 住院费用汇总
      };
      this.userInfoData = {
        ...val
      };
    }
  },
  components: {
    inpChargeCollect
  },
  data() {
    return {
      currentData :{},
      flag: "1",
      reportData: {},
      codeTransformList: {},
      inpChargeCollectVisiable: false, //费用清单弹窗显示
      loading: false,
      // 下拉框loading
      // 表格
      tableData: [],
      tableParams: [
        {
          prop: "inpCode",
          label: "家床号",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "bedCode",
          label: "床位号",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "mrCode",
          label: "病案号",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        }, {
          prop: "inHosTimes",
          label: "建床次数",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "patientName",
          label: "姓名",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "patientGender",
          label: "性别",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        }, {
          prop: "patientAge",
          label: "年龄",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "dischargeDiagName",
          label: "出院诊断",
          align: "left",
          headerAlign: "center",
          width: "180",
          fixed: false
        },{
          prop: "manageDoctorName",
          label: "责任医生",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },  {
          prop: "wdeptAdmissionTime",
          label: "建床日期",
          align: "left",
          headerAlign: "center",
          width: "160",
          fixed: false
        }, {
          prop: "wdeptDischargeTime",
          label: "撤床日期",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        }, {
          prop: "inHosDays",
          label: "建床天数",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "doctorCheckNum",
          label: "巡检次数",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "totalFeeAmount",
          label: "总费用",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "admitTypeCode",
          label: "家床类型",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "phoneNum",
          label: "联系电话",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "dischargeTime",
          label: "结算时间",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "receiptNum",
          label: "发票号码",
          align: "left",
          headerAlign: "center",
          width: "140",
          fixed: false
        },{
          prop: "identificationNum",
          label: "证件号",
          align: "left",
          headerAlign: "center",
          width: "160",
          fixed: false
        },

        {
          prop: "settlementType",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          width: "140",
          fixed: false
        },
        {
          prop: "companyName",
          label: "结算单位",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "finDischargeUserName",
          label: "结算人员",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },

        {
          prop: "selfPayPrepay",
          label: "预交款",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "settleAmount",
          label: "结算金额",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "cashSettleAmount",
          label: "现金结算",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120"
        },{
          prop: "checkSettleAmount",
          label: "支票结算",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "120"
        },{
          prop: "freePayAmount",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "siPersonAccountPayAmt",
          label: "个人账户金额",
          align: "right",
          headerAlign: "center",
          width: "150",
          fixed: false
        },

       {
          prop: "siRegDiseaseCode",
          label: "社保登记病种",
          align: "left",
          headerAlign: "center",
          width: "220",
          fixed: false
        },{
          prop: "manageNurseName",
          label: "责任护士",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },


          {
          prop: "recordStatus",
          label: "家床状态",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "patientAddr",
          label: "地址",
          align: "left",
          headerAlign: "center",
          width: "290",
          fixed: false
        }
      ],
      // 查询对象
      form: {
        inpCode: "",
        mrCode: "",
        patientName: "",
        // startDischargeTime: "",
        // endDischargeTime: "",
        patientCode: "",
        receiptNum: "",
        settlementType: ""
      },
      // 登记时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100
      },
      // 人员集合
      options: [],
      selLoading: false
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
    // 病区url
    illnessAreaUrl() {
      return "/wadmin/ward-hos?hosId=" + 91;
    }
  },
  mounted() {
    this.getInpPatien();
  },
  methods: {
    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
    },
    inpChargeCollectShow(val) {
      if (!this.currentData.inpCode) {
        this.$message.error("请选择患者");
        return;
      }
      this.reportData = this.currentData;
      this.reportData.flag = val;
      this.flag = val;
      this.inpChargeCollectVisiable = true;
    },
    select(){
      this.pageParams.pageNo = 1;
      this.getInpPatien();
    },
    load() {},
    // 查询住院患者
    async getInpPatien() {
      try {
        this.loading = true;
        let obj = {
          ...this.form,
          ...this.pageParams
        };
        if (this.date && this.date.length > 1) {
          obj.startDischargeTime = this.dayjs(this.date[0]).format("YYYY-MM-DD HH:mm:ss");
          obj.endDischargeTime = this.dayjs(this.date[1]).format("YYYY-MM-DD HH:mm:ss");
        }else{
          this.$message.error('结算时间不能为空！');
          this.loading = false;
          return;
        }
        let res = await service.getDisChargePatientInfo(obj);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    // 重置
    cancal() {
      this.form = {
        inpSdeptId: "",
        patientName: "",
        recordStatus: "",
        wardId: "",
        startDate: "",
        stopDate: "",
        receiptNum: "",
        finDischargeUserId: '',
        settlementType: ""
      };
    },
    // 查询用户
    async selectAllUser(val){
      try {
        this.selLoading = true;
        let res = await service.getAllUser({
          userName: val || ''
        })
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败")
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getInpPatien();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getInpPatien();
    },
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 住院天数
    getInpDays( data){
      let nowDate = new Date().getTime();
      let inpDate = new Date(data.wdeptAdmissionTime).getTime();
      let dayNo = Math.floor((nowDate - inpDate) / (60 * 60 * 24 * 1000)) || 0; // 向下取整
      if(dayNo == 0){
        dayNo = 1;
      }
      return dayNo;
    },
    setOut(){
      let tHeader = this.tableParams.map((item)=>{
          return item.label
      });
      let filterVal = this.tableParams.map((item)=>{
        return item.prop
      });

      const data = this.tableData.map(item => {
        let  datas = [
          {
            field: "name",
            key:"patientGender",
            code: "GENDER_CODE",
            val:item.patientGender || ""
          },{
            field: "name",
            key: "recordStatus",
            code: "InpStatus",
            val:item.recordStatus || ""
          },{
            field: "name",
            key: "admitTypeCode",
            code: "AdmitHosType",
            val:item.admitTypeCode || ""
          },{
            field: "name",
            key: "settlementType",
            code: "settlementType",
            val:item.settlementType || ""
          },{
            field: "name",
            key: "admissionSituation",
            code: "EntranceCode",
            val:item.admissionSituation || ""
          }
        ];
        const dataItem = {};
        transformCodeList(datas).then(resData => {
          this.codeTransformList = resData.data;
          // 业务逻辑代码

          for (let i in item) {
            if (
              i === "selfPayAmt" ||
              i === "packingNum" ||
              i === "totalAmt" ||
              i === "useLevel" ||
              i === "derateAmt" ||
              i === "drugDosage" ||
              i === "chargeQuantity" ||
              i === "freePayAmt"
            ) {
              dataItem[i] = !item[i]
                ? "0.00"
                : this.formatNumber(item[i]).toString();
            } else if (
              i === "chargePrice"
            ) {
              dataItem[i] = !item[i]
                ? "0.0000"
                : this.formatNumber(item[i],4).toString();
            } else if (
              i === "dischargeCheckStatus"
            ) {
              dataItem[i] = item[i] === "0"
                ? "未审批"
                : item[i] === "1" ? "已审批" : "未审批";
            }else if (
              i === "admissionSituation" || i === "admitTypeCode" || i === "settlementType" || i === "recordStatus" || i === "patientGender"
            ) {
              dataItem[i] =  this.codeTransformList[i] ;
            }else {
              dataItem[i] = item[i].toString();
            }
          }

        });
        return dataItem;
      });
      let excelData = {
        title: ["家庭病床结床患者表", "", "", "", ""],
        tHeader,
        filterVal,
        listDate: data,
        fileName: "家庭病床结床患者表",
        merges: ["A1:AE1"]
      };
      console.info(excelData);
      jsonToExcel(excelData);
    }
  }
};
</script>
<style lang="scss" scoped>
  .margin-top-10 {
    margin-top: 10px;
  }
  .table {
    width: 100%;
    height: calc(100% - 140px);
    /deep/.el-table .cell{
     line-height: 40px !important;
     font-size: 16px;
    }
  }
  .rowClass {
    width: 100%;
    height: 36px;
  }
  .page{
    line-height: 28px;
    height: 28px;
  }
</style>
