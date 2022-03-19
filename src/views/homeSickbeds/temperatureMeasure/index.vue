<template>
  <el-card class="temMeasure height100">
    <div class="search-cont">
      <el-form :model="searchValue"  ref="searchValue"  >
        <el-row :gutter="24">
          <el-col :span="3"
          ><el-form-item >
            <LFormtTitle label="管辖机构" disabled
          ><el-input
            v-model="hosName"
            disabled
          ></el-input></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="3"
          ><el-form-item prop="dataSource"><LFormtTitle label="数据来源"
          ><el-select v-model="searchValue.dataSource" placeholder="请选择"><el-option
            v-for="item in dataSourcesList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option></el-select></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="6"
          ><el-form-item prop="date"><LFormtTitle label="登记日期">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="searchValue.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="3"
          ><el-form-item prop="exception"><LFormtTitle label="是否异常"
          ><el-select v-model="searchValue.exception" placeholder="请选择"><el-option
            v-for="item in ifUnusualList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option></el-select></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="2"
          ><el-form-item prop="status"><LFormtTitle label="状态"
          ><el-select v-model="searchValue.status" placeholder="请选择"><el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option></el-select></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="3"
          ><el-form-item prop="patientName"><LFormtTitle label="患者姓名"
          ><el-input v-model="searchValue.patientName"></el-input></LFormtTitle
          ></el-form-item></el-col>
          <el-col :span="4">
            <div class="float-right">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="" @click="resetForm('searchValue')">重置</el-button>
              <el-button type="" @click="setOut">导出</el-button>
              <el-button type=""  @click="showBaoka">新增</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-cont">
      <el-table
        ref="tableData"
        :data="tableData"
        height="100%"
        v-loading="loading"
        border
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'oprate'">
              <el-button type="text" @click="showBaoka(scope.row)"
              >查看</el-button
              >
            </template>
            <template v-else-if="item.prop === 'dataSource'">
              <span>{{scope.row.dataSource==='1'?'社康':'社康APP'}}</span>
            </template>
            <template v-else-if="item.prop === 'address'">
              <span v-if="scope.row.currentAddress.length>0"><span code="AdministrativDivision" :val="scope.row.currentAddress" break="/" v-codeTransform></span>{{scope.row.currentDetail}}</span>
            </template>
            <template v-else-if="item.prop === 'exception'">
              <span>{{scope.row.exception?scope.row.exception==='1'?'是':'否':''}}</span>
            </template>
            <template v-else-if="item.prop === 'status'">
              <span>{{scope.row.status==='1'?'提交':'暂存'}}</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page align-right">
      <el-pagination
        background
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="pageParams.pageNo"
        :page-sizes="[50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        :pager-count="5"
      ></el-pagination>
    </div>
    <el-dialog
      width="80%"
      top="4vh"
      :title="title"
      :visible.sync="dialogVisibleBK"
      :modal-append-to-body="true"
      :append-to-body="true"
    >
      <dialogTemperatureMeasure
        v-if="dialogVisibleBK"
        @cancelstyle="cancelstyle"
        ref="dialogTemperatureMeasure"
        :baokaData="baokaData"
        @submitBK="submitBK"
      ></dialogTemperatureMeasure>
    </el-dialog>
  </el-card>
</template>
<script>
import dialogTemperatureMeasure from "@/views/homeSickbeds/temperatureMeasure/components/dialogTemperatureMeasure.vue";
import { getTemperatureList, exportTemperatureExcel } from "@/api/ipnw/temperatureMeasure.js";
import { deepClone } from "@/utils/index.js";
export default {
  name: "temMeasure",
  components: {
    dialogTemperatureMeasure,
  },
  data() {
    return {
      title:'',
      searchValue: {
        date: [this.makeDate(3, new Date()), this.makeDate(0, new Date())],
        dataSource:'1',
        status:'',
        exception:'',
        patientName:'',
      },
      hosName:'',
      pageParams: {
        pageNo: 1,
        pageSize: 100,
      },
      dataSourcesList:[
        {
          value: '1',
          label: '社康'
        },
        {
          value: '2',
          label: '社康APP'
        }
      ],
      ifUnusualList:[
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      statusList:[
        {
          value: '0',
          label: '暂存'
        },
        {
          value: '1',
          label: '提交'
        }
      ],
      loading: false,
      columns: [
        {
          label: "患者姓名",
          prop: "patientName",
          width: 110,
        },
        {
          label: "证件号码",
          prop: "identificationNum",
          width: 170,
        },
        {
          label: "数据来源",
          prop: "dataSource",
          width: 110,
        },
        {
          label: "状态",
          prop: "status",
          width: 80,
        },
        {
          label: "是否异常",
          prop: "exception",
          width:110,
        },
        {
          label: "患者体温",
          prop: "temperature",
          width: 110,
        },
        {
          label: "患者手机号码",
          prop: "mobileNum",
          width: 130,
        },
        {
          label: "患者居住地址",
          prop: "address",
          width: 320,
        },
        {
          label: "登记时间",
          prop: "entryTime",
          width: 150,
        },
        {
          label: "登记机构",
          prop: "hosNm",
          width: 120,
        },
        {
          label: "登记人姓名",
          prop: "entryPersonName",
          width: 120,
        },{
          label: "登记人手机号",
          prop: "entryMobileNum",
          width: 130,
        },{
          label: "提交机构",
          prop: "hosNm",
          width: 120,
        },{
          label: "提交人",
          prop: "submitPersonName",
          width: 120,
        },{
          label: "提交时间",
          prop: "submitPersonTime",
          width: 150,
        },{
          label: "操作",
          prop: "oprate",
          width: 120,
          fixed:"right"
        }
      ],
      tableData: [],
      dialogVisibleBK: false,
      baokaData: '',
    };
  },
  created() {
    this.hosName = JSON.parse(
      localStorage.getItem("pamars")
    ).hosName;
    this.search()
  },
  methods: {
    cancelstyle() {
      this.dialogVisibleBK = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.search();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.search();
    },
    async search() {
      try {
        this.loading = true;
        let param = {
          patientName:this.searchValue.patientName,
          dataSource:this.searchValue.dataSource,
          status:this.searchValue.status,
          exception:this.searchValue.exception,
          ...this.pageParams,
          startTime:this.searchValue.date[0] + ' 00:00:00',
          endTime:this.searchValue.date[1] + ' 23:59:59',
        };
        let res = await getTemperatureList(param);
        if (res.code === 1) {
          this.tableData = res.data;
          this.pageParams.total = res.total;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },

    //导出
    async setOut() {
      try {
        let param = {
          patientName:this.searchValue.patientName,
          dataSource:this.searchValue.dataSource,
          status:this.searchValue.status,
          exception:this.searchValue.exception,
          startTime:this.searchValue.date[0] + ' 00:00:00',
          endTime:this.searchValue.date[1] + ' 23:59:59',
          exportType:'1'
        };
        let res = await exportTemperatureExcel(param);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName("temMeasure")[0];
          var a = document.createElement('a');
          a.setAttribute("id","billHref");
          a.download = '发热登记.xls';
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
        }
      } catch (error) {}
    },

    showBaoka(row) {
      /*this.changeRecPatientData({
        ...row,
        patientName: row.name,
        patientId: row.patientId,
        identificationNum: row.cardNo
      });
      this.baokaData = deepClone(row);*/
      this.baokaData = row.id
      if(this.baokaData){
        this.title = '发热登记-查看'
      }else{
        this.title = '发热登记-新建'
      }
      this.dialogVisibleBK = true;
    },
    submitBK(data) {
      this.dialogVisibleBK = false;
      this.search()
    },

    makeDate(n, datePoint) {
      var now = datePoint ? new Date(datePoint) : new Date();
      var year = now.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      var month = now.getMonth() + 1;
      var day = now.getDate();
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中月的天数
      var year2 = year;
      var month2 = parseInt(month) - n;
      if (month2 <=0) {
        year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
        month2 = 12 - (Math.abs(month2) % 12);
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = '0' + month2;
      }
      var t2 = year2 + '-' + month2 + '-' + (day2 < 10 ? "0" + day2 : day2);;
      return t2;
    },
  },
};
</script>
<style scoped lang="scss">
.temMeasure {
  padding: 6px;
  .search-cont {
  }
  .table-cont {
    margin-top: 10px;
    height: calc(100% - 100px);
  }
  .page {
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
      /deep/ .el-pager .number {
        width: auto;
      }
      /deep/ .el-pagination__editor.el-input {
        width: auto;
      }
    }
  }
  .align-right {
    text-align: right;
  }
}
</style>
