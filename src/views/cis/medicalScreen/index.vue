<template>
  <el-card class="baokaReport height100">
    <div class="search-cont">
      <el-row :gutter="10">
        <el-col :span="4"
          ><LFormtTitle label="机构" disabled
            ><el-input
              v-model="searchValue.hosName"
              disabled
            ></el-input></LFormtTitle
        ></el-col>
        <el-col :span="4"
          ><LFormtTitle label="挂号日期">
            <el-date-picker
              v-model="searchValue.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker></LFormtTitle
        ></el-col>
        <el-col :span="4"
          ><LFormtTitle label="录入日期">
            <el-date-picker
              v-model="searchValue.date1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker></LFormtTitle
        ></el-col>
        <el-col :span="5"
          ><LFormtTitle label="关键字"
            ><el-input
              v-model="searchValue.searchValue"
              placeholder="姓名/证件号"
            ></el-input></LFormtTitle
        ></el-col>
        <el-col :span="4">
          <el-checkbox
            v-model="searchValue.firstVisit"
            @change="search"
            style="margin: 8px 0 0 15px"
          >仅显示首诊</el-checkbox
          >
        </el-col>
        <el-col :span="3">
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-cont">
      <el-table
        ref="tableData"
        :data="tableData"
        height="100%"
        v-loading="loading"
        border
        @row-dblclick="editFuc"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'center'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'oprate'">
              <el-button type="text" @click="editFuc(scope.row)"
                >录入</el-button
              >
            </template>
            <template v-else-if="item.prop === 'state'">
              <div class="flag-class">
                <span
                  :class="{
                    'flag-class-item': true,
                    height100: true,
                    'green-item': scope.row.needMeasureFlag == '1',
                  }"
                ></span>
                <span
                  :class="{
                    'flag-class-item': true,
                    height100: true,
                    'orange-item': scope.row.hypertensionCdId,
                  }"
                ></span>
                <!-- <span
                  :class="{
                    'flag-class-item': true,
                    height100: true,
                    'yellow-item': true,
                  }"
                ></span> -->
              </div>
            </template>
            <template v-else-if="item.prop === 'recordStatus'">
              <span>{{ recordStatusObj[scope.row[item.prop]] || "" }}</span>
            </template>
            <template v-else-if="item.prop === 'patientGender'">
              <span
                :val="scope.row[item.prop] || ''"
                code="GENDER_CODE"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'firstVisit'">
              <span>{{ scope.row[item.prop] == 1?'首诊':'' }}</span>
            </template>
            <template v-else-if="item.prop === 'manageOrgCode'">
              <span v-if="scope.row[item.prop]">{{ treansferHosCode("H0000000000000000000" + scope.row[item.prop])}}</span>
            </template>
            <template v-else-if="item.prop === 'hosId'">
              <span>{{ treansferHosCode(scope.row[item.prop]) || "" }}</span>
            </template>
            <template
              v-else-if="
                item.prop === 'birthDate' ||
                item.prop === 'recordOperatorTime' ||
                item.prop === 'appointmentTime'
              "
            >
              <span>{{ (scope.row[item.prop] || "").split(" ")[0] }}</span>
            </template>
            <template v-else-if="item.prop === 'crisisFlag'">
              <span>{{ crisisFlagObj[scope.row[item.prop]] || "" }}</span>
            </template>
            <template v-else-if="item.prop === 'bloodPressureLowLast'">
              {{ scope.row[item.prop] || "-" }} / {{ scope.row["bloodPressureHighLast"] || "-" }}
            </template>
            <template v-else-if="item.prop === 'personTypeName'">
              <span>{{ personTypeNameShow(scope.row) }}</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page align-right">
      <div class="notes">
        <div class="flag-class">
          <span class="flag-class-item height100 green-item"></span>
          <span class="flag-class-item height100 orange-item"></span>
          <!-- <span class="flag-class-item height100 yellow-item"></span> -->
        </div>
        <div class="notes-cont">
          绿色标识需要测量血压的患者，橙色表示已建立高血压专案的患者
          <!-- ，黄色表示高血压筛查对象。 -->
        </div>
      </div>
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
      width="1400px"
      top="10px"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="测量结果录入"
      :visible.sync="dialogVisible"
    >
      <editForm
        ref="editForm"
        v-if="dialogVisible"
        :editFormData="editFormData"
        :personTypeNameOptions="personTypeNameOptions"
        @submitFuc="submitFuc"
        @closeDialog="closeDialog"
      ></editForm>
    </el-dialog>
  </el-card>
</template>
<script>
import editForm from "@/views/cis/medicalScreen/editForm.vue";
import service from "@/api/cis/medicalScreen/index.js";
import { single } from "@/api/cis/order/order.js";
import { deepClone } from "@/utils/index.js";

export default {
  name: "baokaReport",
  components: {
    editForm,
  },
  data() {
    return {
      searchValue: {
        hosName: JSON.parse(localStorage.getItem("pamars")).hosName,
        date: [
          this.dayjs(new Date()).format("YYYY-MM-DD"),
          this.dayjs(new Date()).format("YYYY-MM-DD"),
        ],
        date1: [],
        searchValue: "",
        firstVisit:false
      },
      pageParams: {
        pageNo: 1,
        pageSize: 50,
        total: 0,
      },
      loading: false,
      columns: [
        {
          label: "筛查标记",
          prop: "state",
          width: 85,
          align: "center",
        },
        {
          label: "初复诊",
          prop: "firstVisit",
          width: 90,
        },
        {
          label: "状态",
          prop: "recordStatus",
          width: 100,
        },
        {
          label: "患者姓名",
          prop: "patientName",
          width: 100,
        },
        {
          label: "性别",
          prop: "patientGender",
          width: 70,
        },
        {
          label: "证号号码",
          prop: "identificationNum",
          width: 200,
        },
        {
          label: "出生日期",
          prop: "birthDate",
          width: 140,
        },
        {
          label: "年龄",
          prop: "age",
          width: 80,
        },
        {
          label: "收缩压/舒张压(mmHg)",
          prop: "bloodPressureLowLast",
          width: 170,
        },
        {
          label: "心率(次/分)",
          prop: "heartRateLast",
          width: 100,
        },
        {
          label: "体重(kg)",
          prop: "weight",
          width: 100,
        },
        {
          label: "身高(cm)",
          prop: "height",
          width: 100,
        },
        {
          label: "腰围(cm)",
          prop: "waistline",
          width: 100,
        },
        {
          label: "人群分类",
          prop: "personTypeName",
          width: 200,
        },
        {
          label: "是否危急",
          prop: "crisisFlag",
          width: 100,
        },
        {
          label: "管辖机构",
          prop: "manageOrgCode",
          width: 150,
        },
        {
          label: "挂号日期",
          prop: "appointmentTime",
          width: 120,
        },
        {
          label: "录入日期",
          prop: "recordOperatorTime",
          width: 120,
        },
        {
          label: "录入人员",
          prop: "recordOperatorName",
          width: 100,
        },
        {
          label: "录入机构",
          prop: "hosId",
          width: 120,
        },
        {
          label: "操作",
          prop: "oprate",
          width: 90,
          fixed: "right",
        },
      ],
      tableData: [],
      recordStatusObj: {
        1: "提交",
        0: "暂存",
      },
      crisisFlagObj: {
        1: "是",
        0: "否",
      },
      dialogVisible: false,
      editFormData: {},
      personTypeNameOptions: [],
      hosList: [],
      height:'',
      weight:'',
      waistline:''
    };
  },
  created() {
    this.getHosList();
    this.getPersonTypeNames();
    this.search();
  },
  methods: {
    async search() {
      this.pageParams.pageNo = 1;
      this.getList();
    },
    async reset() {
      this.searchValue = {
        ...this.searchValue,
        date: [],
        date1: [],
        searchValue: "",
        firstVisit:false
      };
      this.search();
    },
    async getList() {
      try {
        this.loading = true;
        let startRegTime =
          this.searchValue.date && this.searchValue.date.length === 2
            ? this.searchValue.date[0] + " 00:00:00"
            : "";
        let endRegTime =
          this.searchValue.date && this.searchValue.date.length === 2
            ? this.searchValue.date[1] + " 23:59:59"
            : "";
        let startRecordTime =
          this.searchValue.date1 && this.searchValue.date1.length === 2
            ? this.searchValue.date1[0] + " 00:00:00"
            : "";
        let endRecordTime =
          this.searchValue.date1 && this.searchValue.date1.length === 2
            ? this.searchValue.date1[1] + " 23:59:59"
            : "";
        let param = {
          searchValue: this.searchValue.searchValue,
          firstVisit:this.searchValue.firstVisit ? '1' : '',
          startRegTime,
          endRegTime,
          startRecordTime,
          endRecordTime,
          ...this.pageParams,
        };

        let res = await service.listHighBloodScreen(param);
        if (res.code === 1) {
          this.tableData = res.data;
          this.pageParams.total = res.total;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    changeSize(pageSize) {
      this.pageParams.pageSize = pageSize;
      this.getList();
    },
    changePage(pageNo) {
      this.pageParams.pageNo = pageNo;
      this.getList();
    },
    editFuc(row) {
      if(!row.recordStatus){
        this.getRecentRecordByPatientId(row).then(()=>{
          this.getDetail(row);
        })
      }else{
        this.getDetail(row);
      }
    },
    async getRecentRecordByPatientId(row) {
      let res = await service.getRecentRecordByPatientId(
        row.patientId
      );
      if (res.code === 1 && res.data) {
        this.height = res.data.height;
        this.weight = res.data.weight;
        this.waistline = res.data.waistline;
      } else {
      }
    },
    async getDetail(row) {
      if (!row.identificationNum) {
        this.$message.error("该患者无证件号，无法查询！");
        return;
      }
      try {
        let res = await service.getDetailRecord({
          identificationType: row.identificationType || "",
          identificationNum: row.identificationNum || "",
        });
        if (res.code === "SUCCESS" && res.data) {
          this.editFormData = deepClone({
            ...row,
            ...res.data,
            height:row.height ? row.height : this.height,
            weight:row.weight ? row.weight : this.weight,
            waistline:row.waistline ? row.waistline : this.waistline,
            patientId: row.patientId || "",
            personTypeCode: row.personTypeCode
              ? row.personTypeCode.split(",")
              : [],
            personTypeName: row.personTypeName
              ? row.personTypeName.split(",")
              : [],
          });

          this.dialogVisible = true;
        } else {
          this.editFormData = deepClone({
            ...row,
            height:row.height ? row.height : this.height,
            weight:row.weight ? row.weight : this.weight,
            waistline:row.waistline ? row.waistline : this.waistline,
            personTypeCode: row.personTypeCode
              ? row.personTypeCode.split(",")
              : [],
            personTypeName: row.personTypeName
              ? row.personTypeName.split(",")
              : [],
          });

          this.dialogVisible = true;

        }
      } catch (error) {}
    },
    submitFuc() {
      this.dialogVisible = false;
      this.search();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    // 获取人群分类主数据
    async getPersonTypeNames() {
      try {
        let { code, data } = await single("HypertensionClass");
        if (code === 1) {
          this.personTypeNameOptions = data;
        }
      } catch (error) {}
    },
    // 获取所有机构
    async getHosList() {
      try {
        let { code, data } = await service.getHosList("HypertensionClass");
        if (code === 1) {
          this.hosList = data;
        }
      } catch (error) {}
    },
    // 反显机构方法
    treansferHosCode(val) {
      let arr = this.hosList.filter((item) => {
        return item.id === val;
      });
      if (arr.length) {
        return arr[0].hosName || "";
      }
      return val || "";
    },
    // 人群分类
    personTypeNameShow(row) {
      let personTypeName = row.personTypeName || "";
      if(row.personTypeCode && row.personTypeOtherName && row.personTypeCode.indexOf("99") > -1) {
        return personTypeName.replace("其他", row.personTypeOtherName);
      }
      return personTypeName;
    }
  },
};
</script>
<style scoped lang="scss">
.baokaReport {
  padding: 6px;
  .search-cont {
  }
  .table-cont {
    margin: 10px 0;
    height: calc(100% - 100px);
  }
  .page {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .notes {
      display: flex;

      .notes-cont {
        height: 25px;
        margin-left: 8px;
        line-height: 25px;
        font-size: 14px;
      }
    }
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
  .flag-class {
    width: 50px;
    height: 25px;
    border-top: 1px solid #0033;
    border-left: 1px solid #0033;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .flag-class-item {
      width: 25px;
      border-right: 1px solid #0033;
      border-bottom: 1px solid #0033;
    }
    .green-item {
      background-color: #5df511b3;
    }
    .orange-item {
      background-color: #f9c55a;
    }
    .yellow-item {
      background-color: #f5fd40;
    }
  }
  .align-right {
    text-align: right;
  }
}
</style>
