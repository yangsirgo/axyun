<template>
  <div class="width100 height100" style="padding-top:10px">
    <el-row :gutter="10" class="rowClass">
      <el-col :span="4">
        <LFormtTitle label="家床号">
          <el-input v-model="form.inpCode" placeholder="家床号" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="4">
        <LFormtTitle label="床位号">
          <el-input v-model="form.bedCode" placeholder="床位号" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="4">
        <LFormtTitle label="姓名">
          <el-input v-model="form.patientName" placeholder="姓名" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="4">
        <LFormtTitle label="登记操作人">
          <!-- <el-input v-model="form.finAdmissionUserName" placeholder="请输入" clearable></el-input> -->
          <el-select
            v-model="form.finAdmissionUserId"
            filterable
            remote
            reserve-keyword
            placeholder="姓名/拼音/五笔"
            :remote-method="selectAllUser"
            :loading="selLoading">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
      <el-col :span="4">
        <LFormtTitle label="家床状态">
          <l-value-domain
            clearable
            code="InpStatus"
            :value.sync="form.recordStatus"
            placeholder="请选择"
            style="width:100%"
          ></l-value-domain>
        </LFormtTitle>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="rowClass margin-top-10">
      <el-col :span="4">
        <LFormtTitle label="审批状态">
            <el-select v-model="form.dischargeCheckStatus" clearable placeholder="请选择">
              <el-option
                v-for="item in dischargeCheckStatusMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </LFormtTitle>
      </el-col>
      <el-col :span="5">
        <LFormtTitle label="建床时间">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          ></el-date-picker>
        </LFormtTitle>
      </el-col>
      <el-col :span="15" class="float-right">

        <el-button type="primary" plain class="float-right" @click="cancal">重置</el-button>
        <el-button type="primary" plain class="float-right margin-right-10" @click="setOut">导出</el-button>
        <el-button type="primary" class="float-right margin-right-10" @click="select">查询</el-button>
        <el-button type="primary" plain :disabled="typeof currentData.dischargeCheckStatus === 'undefined' || currentData.dischargeCheckStatus !== '0'" class="float-right margin-right-10" @click="updateStatus('1')">通过审批</el-button>
        <el-button type="primary" plain :disabled="typeof currentData.dischargeCheckStatus === 'undefined' || currentData.dischargeCheckStatus !== '1'" class="float-right margin-right-10" @click="updateStatus('0')">取消审批</el-button>
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
            <template v-else-if="item.prop == 'recordStatus'">
              <span :val="scope.row[item.prop]" code="InpStatus" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'freePayOverdrawAmount'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'useBlance'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'dischargeCheckStatus'">
              <span v-if="scope.row[item.prop] == '0'">{{'未审批'}}</span>
              <span v-else-if="scope.row[item.prop] == '1'">{{'已审批'}}</span>
              <template v-else>{{'未审批'}}</template>
            </template>
            <template v-else-if="item.prop == 'prepayBlance'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'selfPayAmount'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'freePayAmount'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'allAmt'">
              <span>{{ allAmt(scope.row)}}</span>
            </template>
            <template v-else-if="item.prop == 'admitTypeCode'">
              <span :val="scope.row[item.prop]" code="AdmitHosType" v-codeTransform></span>
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
            <template v-else-if="item.prop == 'admissionSituation'">
              <span :val="scope.row[item.prop]" code="EntranceCode" v-codeTransform></span>
            </template>
            <template v-else class="overflow-point">{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="10" class="margin-top-10 rowClass">
        <!--<el-col :span="6">-->
          <!--<el-button type="primary">打印</el-button>-->
          <!--<el-button type="primary" @click="setOut">导出</el-button>-->
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
  </div>
</template>
<script>
import { getTableDatas,transformCodeList } from "@/api/directive/directiveRequest";
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
  data() {
    return {
      dischargeCheckStatusMap: [
        {
          label: "未审批",
          value: "0"
        },
        {
          label: "已审批",
          value: "1"
        }
      ],
      // 表格loading
      loading: false,
      currentData:{},
    // 下拉框loading
      selLoading: false,
      codeTransformList: {},
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
          prop: "inHosTimes",
          label: "建床次数",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "patientName",
          label: "姓名",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },{
          prop: "patientGender",
          label: "性别",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },  {
          prop: "patientAge",
          label: "年龄",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "admissionDiag",
          label: "建床诊断",
          align: "left",
          headerAlign: "center",
          width: "180",
          fixed: false
        }, {
          prop: "manageDoctorName",
          label: "责任医生",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "admissionTime",
          label: "建床时间",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        },  {
          prop: "wdeptDischargeTime",
          label: "撤床时间",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        }, {
          prop: "inpDays",
          label: "天数",
          align: "right",
          headerAlign: "center",
          width: "90",
          fixed: false
        },{
          prop: "doctorCheckNum",
          label: "巡检次数",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "finAdmissionUserName",
          label: "登记操作人",
          align: "left",
          headerAlign: "center",
          width: "140",
          fixed: false
        },
        {
          prop: "settlementType",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "recordStatus",
          label: "家床状态",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "companyName",
          label: "人员性质",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },


        {
          prop: "birthDate",
          label: "出生年月",
          align: "left",
          headerAlign: "center",
          width: "160",
          fixed: false
        },
       {
          prop: "allAmt",
          label: "费用总额",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "prepayBlance",
          label: "预交款余额",
          align: "right",
          headerAlign: "center",
          width: "140",
          fixed: false
        },
        {
          prop: "freePayAmount",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "selfPayAmount",
          label: "自付金额",
          align: "right",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "manageNurseName",
          label: "责任护士",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },{
          prop: "dischargeCheckStatus",
          label: "审批状态",
          align: "left",
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
        },
        {
          prop: "siPatientCode",
          label: "社保编号",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "phoneNum",
          label: "联系电话",
          align: "left",
          headerAlign: "center",
          width: "130",
          fixed: false
        }
      ],
      // 查询对象
      form: {
        inpSdeptId: "",
        patientName: "",
        inpCode: "",
        bedCode: "",
        dischargeCheckStatus: "",
        finAdmissionUserId: "",
        recordStatus: "",
        wardId: "",
        startDate: "",
        stopDate: "",
        inpStatus: null
      },
      // 登记时间
      // 时间
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
      // 下拉选项
      options: []
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
      if(!this.currentData.dischargeCheckStatus){
        this.currentData.dischargeCheckStatus = '0';
      }
      console.info(this.currentData);
    },
    async updateStatus(s) {
      if (!s) {
        this.$message.error("修改审批状态不能为空")
      }
      try {
        this.selLoading = true;
        let res = await service.updateStatus({
          inpCode: this.currentData.inpCode || '',
          dischargeCheckStatus: s
        })
        this.currentData = {};
        this.$message.success("操作成功");
        this.getInpPatien();
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "修改审批状态失败")
      }
    },
    select(){
      this.pageParams.pageNo = 1;
      this.getInpPatien();
    },
    forListFun(a,b){
      let str = "";
      if(a && a.length !== 0){
        for(let i = 0;i < a.length;i++){
            str += a[i][b] + ",";
        }
      }else{
        str = ""
      }
      return str;
    },
    load() {},
    // 查询住院患者
    async getInpPatien() {
      try {
        this.loading = true;
        let obj = {
          ...this.form,
          ...this.pageParams,
          startDate: "",
          stopDate: ""
        };
        if (this.date && this.date.length > 1) {
          obj.startDate = this.date[0];
          obj.stopDate = this.date[1];
        }
        let res = await service.getAllInpPatientInfos(obj);
        let arr = [];
        for(let i in res.data) {
          arr.push({
            ...res.data[i],
            allAmt: this.formatNumber(res.data[i]['selfPayAmount'] + res.data[i]['freePayAmount'] + res.data[i]['derateAmount']),
            admissionDiag:this.forListFun(res.data[i]['inpDiagInfoDTOS'],"diagName")
          })
        }
        this.tableData = arr;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    // 重置
    cancal(){
      this.form = {
        inpSdeptId: "",
        patientName: "",
        inpCode: "",
        bedCode: "",
        finAdmissionUserId: "",
        recordStatus: "",
        wardId: "",
        startDate: "",
        stopDate: "",
        inpStatus: null
      };
      this.date = [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ]
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
    allAmt(row){
      return this.formatNumber(row['selfPayAmount'] + row['freePayAmount'] + row['derateAmount']);
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
    //导出
     setOut() {
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
        title: ["家庭病床结算情况统计表", "", "", "", ""],
        tHeader,
        filterVal,
        listDate: data ,
        fileName: "家庭病床结算情况统计表",
        merges: ["A1:U1"]
      };
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
