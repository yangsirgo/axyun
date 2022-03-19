<template>
  <el-card class="width100 height100 padding10 regfreedetail-enquiry">
    <el-form class="search-area" :model="form" ref="form">
      <el-row :gutter="10" class="width100 margin-top-10">
        <el-col :span="3">
          <LFormtTitle label="收费人员">
            <el-form-item prop="regUserName">
              <!-- <el-input v-model="form.regUserName" placeholder="请输入" clearable></el-input> -->
              <el-select
                v-model="form.regUserName"
                filterable
                remote
                reserve-keyword
                placeholder="姓名/拼音/五笔"
                :remote-method="selectFinUser"
                :loading="finSelLoading"
                clearable
              >
                <el-option
                  v-for="item in finOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="患者姓名">
            <el-form-item prop="doctorName">
              <el-input
                v-model="form.patientName"
                placeholder="请输入"
                clearable
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="挂号科室">
            <el-form-item prop="regDoctorDeptId">
              <!-- <l-value-domain
                remoteUrl="/appointment/doctorSchedule/getDept"
                :value.sync="form.regDoctorDeptId"
                remoteShowKey="deptName"
                remoteValueKey="deptId"
                placeholder="请选择"
                clearable
                class="width100"
              />-->
              <el-select v-model="form.regDoctorDeptId" placeholder="请选择">
                <el-option
                  v-for="item in getDeptInfo"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="挂号类型">
            <el-form-item prop="regType">
              <!-- <l-value-domain
                clearable
                style="width: 100%"
                :value.sync="form.regType"
                remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO"
                type="select"
                remoteShowKey="diagTreatTypeName"
                remoteValueKey="diagTreatTypeCode"
                placeholder
              ></l-value-domain>-->
              <el-select v-model="form.regType" placeholder="请选择">
                <el-option
                  v-for="item in selectDiagTreatTypePOInfo"
                  :key="item.diagTreatTypeCode"
                  :label="item.diagTreatTypeName"
                  :value="item.diagTreatTypeCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="挂号医生">
            <el-form-item prop="regDoctorId">
              <el-select
                v-model="form.regDoctorId"
                filterable
                remote
                reserve-keyword
                placeholder="姓名/拼音/五笔"
                :remote-method="selectAllUser"
                :loading="selLoading"
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="5">
          <LFormtTitle label="收费时间">
            <el-date-picker
              width="100%"
              class="chargeTimePicker"
              v-model="date"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </LFormtTitle>
        </el-col>
        <el-col :span="4" class="text-align-right">
          <div class="float-right">
            <el-button
              type="primary"
              @click="select"
              >查询</el-button
            >
            <el-button type="primary" plain  @click="reset"
              >重置</el-button
            >
            <el-button
              type="primary" plain
              @click="setOut"
              >导出</el-button
            >
          </div>
        </el-col>
      </el-row>

    </el-form>
    <div class="table-height">
      <el-table
        :data="tableData"
        width="100%"
        height="100%"
        stripe
        border
        v-loading="loading"
        :element-loading-text="$t('retreat.loadInfo')"
        highlight-current-row
        ref="leftTable"
      >
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
            <template v-if="item.prop == 'settlementType'">
              <span
                :val="scope.row['settlementType']"
                code="settlementType"
                v-codeTransform
                class="units settlementType"
              ></span>
            </template>
            <template v-else-if="item.prop == 'regDiagTreatType'">
              <!-- <span :val="scope.row.regDiagTreatType" code="DIAG_TREAT_TYPE" v-codeTransform></span> -->
              <span
                tableName="appt_diag_treat_type"
                :conditionMap="{
                  DIAG_TREAT_TYPE_CODE: scope.row[item.prop] || '',
                  hos_id: hosId,
                }"
                columns="DIAG_TREAT_TYPE_NAME"
                v-tableTransform
                class="units regDiagTreatType"
              ></span>
            </template>
            <template v-else-if="item.prop == 'recordStatus'">{{
              showObj[scope.row.recordStatus]
            }}</template>
            <template v-else-if="item.prop == 'derateAmount'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'amt'">
              <span v-if="scope.row[item.prop]">{{
                NumtoFixed(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
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
        :page-sizes="[50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      ></el-pagination>
    </div>
  </el-card>
</template>
<script>
import service from "@/api/financeManagement/prestoreGrant.js";
import services from "@/api/cis/receiptPrint/receiptPrint";
import inpApi from "@/api/financeManagement/inp.js";
import { onPreview, onPrint } from "@/utils/print";
import { onExcel } from "@/utils/excel/excel";

// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};
export default {
  name: "regFeeDetailEnquiry",
  data() {
    return {
      hosId: "",
      getDeptInfo: [], //科室列表
      selectDiagTreatTypePOInfo: [], //挂号类型列表--下拉框
      showObj: {
        "0": "未结算",
        "1": "已结算",
        "2": "退号",
        "9": "已退号"
      },
      loading: false,
      // 表格数据
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        /*  {
          prop: "settlementType",
          label: "患者费别",
          align: "left",
          headerAlign: "center",
          width: "90"
        }, */
        {
          prop: "regDoctorDept",
          label: "挂号科室",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "regDoctorName",
          label: "挂号医生",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "regUserName",
          label: "收费人员",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "regTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "appointmentTime",
          label: "预约时间",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "regDiagTreatType",
          label: "挂号类型",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "amt",
          label: "诊疗费",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "90"
        }
      ],
      // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 100,
        total: 0
      },
      statusShow: {
        "0": "未用",
        "1": "正常",
        "2": "已退费",
        "9": "退费"
      },
      // 查询表单
      form: {
        regUserName: "",
        patientName: "",
        startRegTime: "",
        endRegTime: "",
        regDoctorId: "",
        regDoctorDeptId: "",
        regType: ""
      },
      // 时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      selLoading: false,
      options: [
        {
          name: "全部",
          id: ""
        }
      ],
      finSelLoading: false,
      finOptions: []
    };
  },
  computed: {
    // tlm_noMore() {
    //   return (
    //     Math.ceil(this.total / this.pageParams.pageSize) <=
    //     this.pageParams.pageNo
    //   );
    // }
  },
  created() {
    this.select();
    this.getDept();
    this.selectDiagTreatTypePO();
  },
  methods: {
    //查询科室列表--下拉框
    async getDept() {
      try {
        let res = await service.getDept();
        this.getDeptInfo = [
          {
            deptId: "",
            deptName: "全部"
          }
        ];
        this.getDeptInfo = this.getDeptInfo.concat(res.data);
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取科室列表报错");
      }
    },
    //查询科室列表--下拉框
    async selectDiagTreatTypePO() {
      try {
        let res = await service.selectDiagTreatTypePO({ recordStatus: 1 });
        this.selectDiagTreatTypePOInfo = [
          {
            diagTreatTypeCode: "",
            diagTreatTypeName: "全部"
          }
        ];
        this.selectDiagTreatTypePOInfo = this.selectDiagTreatTypePOInfo.concat(
          res.data
        );
        // console.log("hosId", res.data);
        try {
          this.hosId = res.data[0].hosId;
        } catch (error) {}
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取挂号类型列表报错");
      }
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await inpApi.getAllUser({
          userName: val || ""
        });
        let headInfo = [
          {
            name: "全部",
            id: ""
          }
        ];
        this.options = headInfo.concat(res.data);
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    //查询收费人员
    async selectFinUser(val) {
      try {
        this.finSelLoading = true;
        let res = await service.queryUsers({
          page: 1,
          pageSize: 10000,
          name: val || ""
        });
        this.finOptions = res.data || [];
        this.finSelLoading = false;
      } catch (error) {
        this.finSelLoading = false;
      }
    },
    // 列表数据
    getDataInfo() {
      this.loading = true;
      let obj = {
        ...this.form,
        ...this.pageParams
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.date[0];
        obj.endChargeTime = this.date[1];
      }
      service
        .getFrequencyList(obj)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.msg || "查询失败");
        });
    },
    // // load
    // load() {
    //   if (this.tlm_noMore) {
    //     return;
    //   }
    //   this.pageParams.pageNo++;
    //   this.getDataInfo();
    // },
    // 查询
    select() {
      this.tableData = [];
      this.pageParams.pageNo = 1;
      this.getDataInfo();
    },
    // 重置
    reset() {
      // this.$nextTick(() => {
      //   this.$refs["form"].resetFields();
      // });
      this.form = {
        regUserName: "",
        patientName: "",
        startRegTime: "",
        endRegTime: "",
        regDoctorId: "",
        regDoctorDeptId: "",
        regType: ""
      };
      this.date = [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ];
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
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getDataInfo();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getDataInfo();
    },
    //保留两位小数
    NumtoFixed(num) {
      num = Number(num);
      return num.toFixed(2);
    },
    async setOut() {
      let obj = {
        ...this.form,
        ...this.pageParams,
        exportType: 5
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.date[0];
        obj.endChargeTime = this.date[1];
      }
      let res = await services.exportChargeExcel(obj);
      var blob = res;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("regfreedetail-enquiry")[0];

        var a = document.createElement('a');
        a.setAttribute("id","billHref");
        a.download = '挂号费明细.xls';
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      }
      return;
      if(!this.tableData.length) {
        return;
      }
      let elTableRow = this.$refs.leftTable.bodyWrapper.querySelectorAll(
        ".el-table__row"
      );
      let tHeader = this.tableParams.map(item => {
        return item.label;
      });
      let filterVal = this.tableParams.map(item => {
        return item.prop;
      });
      let tableData_new = this.tableData.map((item, i) => {
        let obj = {
          ...item,
          recordStatus: this.showObj[item.recordStatus],
          derateAmount: this.formatNumber(item.derateAmount || 0),
          amt: this.NumtoFixed(item.amt || 0)
        };
        let elTableRowItem = elTableRow[i];
        let units = elTableRowItem.querySelectorAll(
          ".units"
        );
        for(let j in units) {
          let items = units[j];
          if(items.className && items.className.indexOf(" ") > -1) {
            obj[items.className.split(" ")[1]] = items.innerText;
          }
        }
        return obj;
      });
      console.log(tableData_new);
      // return;
      let excelData = {
        title: "挂号费明细",
        tHeader,
        filterVal,
        listDate: tableData_new
      };
      onExcel(excelData);
    }
  }
};
</script>
<style lang="scss" scoped>
.regfreedetail-enquiry {
  .margin-top-10 {
    margin-top: 10px;
  }
  .table-height {
    width: 100%;
    height: calc(100% - 120px);
    margin: 10px 0;
  }
  .text-align-right {
    text-align: right;
  }
  .tableThree {
    height: 400px;
  }
  .page {
    text-align: right;
    margin-top: 20px;
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
