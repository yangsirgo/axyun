<template>
  <div class="outQuantityReport height100">
    <div class="search-cont">
      <l-common-search rightAreaWidth="250">
        <template slot="leftCon">
          <l-formt-title label="收费日期" style="width:300px;margin-right:6px">
            <el-date-picker
              clearable
              v-model="searchValue.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </l-formt-title>
          <el-radio-group
            v-model="searchValue.statisticUnitType"
            style="margin-top:9px"
            @change="typeChange"
          >
            <el-radio :label="'1'">按医生</el-radio>
            <el-radio :label="'0'">按科室</el-radio>
          </el-radio-group>
        </template>
        <template slot="rightCon">
          <div class="btns-contain">
            <el-button type="primary" @click="search">查询</el-button>
            <!-- <el-button type="primary" class="plain-btn" plain @click="print"
              >打印</el-button
            > -->
            <el-button type="primary" plain class="float-right" @click="setOut"
              >导出</el-button
            >
          </div>
        </template>
      </l-common-search>
    </div>
    <div class="table-cont">
      <el-table
        ref="multiTable"
        :data="multiData"
        width="100%"
        height="100%"
        border
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          type="index"
          label="序号"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in multiParams"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width || item.label.length * 20 + 24"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
          <template v-if="item.prop==='unChronicDrugRate'">{{(Number(scope.row[item.prop] || 0) * 100).toFixed(2)}}</template>
          <template v-else>{{scope.row[item.prop]}}</template>
        </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import service from "@/api/financeManagement/reportForms.js";
import { onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import NP from "number-precision";

export default {
  name: "outQuantityReport",
  data() {
    return {
      searchValue: {
        date: [],
        statisticUnitType: "1"
      },
      multiParams: [
        {
          prop: "unitName",
          label: "名称",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "recipeNum",
          label: "处方数",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "drugRecipeNum",
          label: "药物处方数",
          width: "150",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "unDrugRecipeNum",
          label: "非药物处方数",
          width: "160",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "servePersonTimes",
          label: "服务人次",
          width: "150",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "averageRecipeValue",
          label: "平均处方值",
          width: "150",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "totalAmt",
          label: "合计",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "medicalFeeAmt",
          label: "医疗费用合计",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "registerFee",
          label: "挂号费合计",
          width: "150",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "drugFeeAmt",
          label: "药品费用合计",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "chronicFeeAmt",
          label: "慢病药品费用合计",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "unChronicDrugRate",
          label: "非慢病用药药品比例(%)",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "rate"
        },
        {
          prop: "drugRate",
          label: "药品比例(%)",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "rate"
        },
        {
          prop: "chronicFeeAmt",
          label: "其中慢病用药费用",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "westernMedicineFee",
          label: "西药费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "chinesePatentMedicineFee",
          label: "中成药费",
          width: "150",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "chineseHerbalMedicineFee",
          label: "中草药费",
          width: "150",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "inspectFee",
          label: "诊查费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "examFee",
          label: "检查费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "treatFee",
          label: "治疗费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "nurseFee",
          label: "护理费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "operateFee",
          label: "手术费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "diagnosticFee",
          label: "化验费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "materialFee",
          label: "材料费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "vaccineFee",
          label: "计免疫苗",
          width: "150",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        /* {
          prop: "",
          label: "凑整费",
          width: "80",
          align: "center",
          headerAlign: "center",
          fixed: false
        }, */
        {
          prop: "otherFee",
          label: "其它费",
          width: "100",
          align: "center",
          headerAlign: "center",
          fixed: false,
          type: "money"
        },
        {
          prop: "ordinaryTreatPersonTimes",
          label: "全科诊疗人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "planVaccineTreatPersonTimes",
          label: "计划免疫人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "planVaccineTreatPersonTimes",
          label: "其中儿童免疫人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "chargePersonTimes",
          label: "收费人次合计",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "ordinaryTreatChargePersonTimes",
          label: "全科诊疗收费人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "planVaccineTreatChargePersonTimes",
          label: "计划免疫收费人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        },{
          prop: "ordinaryTimes",
          label: "挂号收费人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        },{
          prop: "freeTimes",
          label: "挂号免费人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "planVaccineTreatChargePersonTimes",
          label: "其中儿童免疫收费人次",
          align: "center",
          headerAlign: "center",
          fixed: false
        }
      ],
      multiData: [],
      moneyColumn: []
    };
  },
  async created() {
    this.searchValue.date = [
      this.dayjs(new Date()).format("YYYY-MM-DD"),
      this.dayjs(new Date()).format("YYYY-MM-DD")
    ];
    //  this.getList();
  },
  mounted() {
    this.handleMoneyList();
    this.searchValue.date = [
      this.dayjs(new Date()).format("YYYY-MM-DD"),
      this.dayjs(new Date()).format("YYYY-MM-DD")
    ];
    // this.getList();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.multiTable.doLayout();
    })
  },
  methods: {
    handleMoneyList() {
      let arr = [];
      for(let i in this.multiParams){
        if(this.multiParams[i].type === "money") {
          arr.push(this.multiParams[i].prop)
        }
      }
      this.moneyColumn = arr;
    },
    search() {
      this.getList();
    },
    async getList() {
      let startTime = this.searchValue.date && this.searchValue.date.length
        ? this.searchValue.date[0] + " 00:00:00"
        : "";
      let endTime = this.searchValue.date && this.searchValue.date.length
        ? this.searchValue.date[1] + " 23:59:59"
        : "";
      let params = {
        // statisticUnitId: 91,
        statisticUnitType: this.searchValue.statisticUnitType,
        startTime,
        endTime
      };
      this.$showLoading();
      try {
        let res = await service.getOutpWorkLoadInfo(params);
        if (res.code === 1) {
          let data = res.data;
          let multiParams = this.multiParams;
          let arr = [];
          for (let i in data) {
            let obj = {...data[i],drugRate: NP.times(data[i].drugRate,100)};

            for(let j in multiParams) {
              if(multiParams[j].type === "money") {
                obj[multiParams[j].prop] = (Number(obj[multiParams[j].prop]) || 0).toFixed(2);
              }
            }
            arr.push(obj);
          }
          this.multiData = arr;
          this.$forceUpdate()
        } else {
          this.$message.error("请求失败");
        }
        this.$hideLoading();
      } catch (e) {
        console.log(e);
        this.$hideLoading();
      }
    },
    typeChange() {
      this.search();
    },
    print() {},
    //导出
    setOut() {
      let obj = this.getSummarie();
      let multiData = [...this.multiData, obj];
      let tHeader = this.multiParams.map(item => {
        return item.label;
      });
      let filterVal = this.multiParams.map(item => {
        return item.prop;
      });
      let excelData = {
        title: ["门诊工作量报表", "", "", "", ""],
        tHeader: tHeader,
        filterVal,
        listDate: multiData,
        fileName: "门诊工作量报表",
        merges: ["A1:AC1"]
      };
      // debugger
      jsonToExcel(excelData);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (index !== 1) {
          if(column.property == "averageRecipeValue") {
            sums[index] = "";
            return;
          }
          if(column.property == "drugRate") {
            let multiData = this.multiData;
            let data1 = 0;
            let data2 = 0;
            for(let i in multiData) {
              let item = multiData[i];
              data1 = data1 + Number(item.medicalFeeAmt) + Number(item.drugFeeAmt);
              data2 += Number(item.drugFeeAmt);
            }
            if(!data1) {
              sums[index] = "";
              return;
            }
            let sumIndex = (data2 * 100 / data1).toFixed(2);
            sums[index] = sumIndex;
            return;
          }
          if(column.property == "unChronicDrugRate") {
            let multiData = this.multiData;
            let data1 = 0;
            let data2 = 0;
            for(let i in multiData) {
              let item = multiData[i];
              data1 = data1 + Number(item.drugFeeAmt) - Number(item.chronicFeeAmt);
              data2 += Number(item.drugFeeAmt);
            }
            if(!data1) {
              sums[index] = "";
              return;
            }
            let sumIndex = (data1 * 100 / data2).toFixed(2);
            sums[index] = sumIndex;
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            let sumIndexs = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              }
              return prev;
            }, 0);
            if(this.moneyColumn.indexOf(column.property) > -1) {
              sums[index] = sumIndexs.toFixed(2);
            } else {
              sums[index] = sumIndexs;
            }
          } else {
            sums[index] = "";
          }
        }
      });

      return sums;
    },
    // 导出增加合计行
    getSummarie() {
      let obj = {};
      this.multiParams.forEach((column, index) => {
        if(column.prop == "unitName") {
          obj[column.prop] = "合计";
          return;
        }
        if(column.prop == "averageRecipeValue" || column.prop == "drugRate") {
          obj[column.prop] = "";
          return;
        }
        obj[column.prop] = 0;
        this.multiData.forEach((item, i) => {
          if(!isNaN(item[column.prop])) {
            obj[column.prop] += Number(item[column.prop])
          }
        });
        if(this.moneyColumn.indexOf(column.prop) > -1) {
          obj[column.prop] = obj[column.prop].toFixed(2);
        }
      });
      return obj;
    }
  }
};
</script>
<style lang="scss" scoped>
.outQuantityReport {
  background-color: #fff;
  padding: 10px;
  overflow-y: auto;
  .search-cont {
    height: 50px;
    margin-bottom: 10px;
  }
  .table-cont {
    height: calc(100% - 90px);
    margin: 20px 0;
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
