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
        <el-col :span="6"
          ><LFormtTitle label="就诊日期">
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
          ><LFormtTitle label="姓名"
            ><el-input v-model="searchValue.keyword"></el-input></LFormtTitle
        ></el-col>
        <el-col :span="4"
          ><LFormtTitle label="状态"
            ><el-select v-model="searchValue.state">
              <el-option
                v-for="(item, index) in statesOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> </LFormtTitle
        ></el-col>
        <el-col :span="6">
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="setOut">导出</el-button>
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
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
          show-overflow-tooltip
          :sortable="item.prop !== 'oprate' && item.prop !== 'state'"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'oprate'">
              <el-button type="text" @click="showBaoka(scope.row)">{{
                scope.row.state == "2" ? "查看" : "编辑"
              }}</el-button>
              <el-button
                type="text"
                @click="deleteInfectiousDiseaseCard(scope.row)"
                :disabled="scope.row.state == '2'"
                >删除</el-button
              >
            </template>
            <template v-else-if="item.prop === 'sex'">
              <span
                :val="scope.row[item.prop] || ''"
                code="GENDER_CODE"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'state'">
              {{ stateOptions[scope.row[item.prop]] || "" }}
            </template>
            <template v-else-if="item.prop === 'type'">
              传染性疾病报卡
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
        :current-page="pageParams.pageNum"
        :page-sizes="[50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        :pager-count="5"
      ></el-pagination>
    </div>
    <el-dialog
      width="80%"
      top="10px"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="handleClose"
      title="传染性疾病报卡"
      :visible.sync="dialogVisibleBK"
    >
      <baokaForm
        ref="infectiousCard"
        :baokaFormData="baokaFormData"
        @submitBK="submitBK"
      ></baokaForm>
    </el-dialog>
  </el-card>
</template>
<script>
import infectiousCard from "@/views/public/infectious/dialogMain.vue";
import baokaForm from "@/views/public/infectious/module/baokaForm.vue";
import {
  queryInfectiousDiseaseCard,
  deleteInfectiousDiseaseCard,
  excelInfectiousDiseaseCard
} from "@/api/common/report.js";
import { deepClone } from "@/utils/index.js";
import { mapGetters, mapActions } from "vuex";
import baokaMixin from "@/views/public/infectious/mixins/baokaMixin.js";

export default {
  name: "baokaReport",
  mixins: [baokaMixin],
  components: {
    infectiousCard,
    baokaForm,
  },
  data() {
    return {
      searchValue: {
        state: "",
        date: [],
      },
      pageParams: {
        pageNum: 1,
        pageSize: 50,
        total: 0,
      },
      loading: false,
      columns: [
        {
          label: "操作",
          prop: "oprate",
          width: 120,
        },
        {
          label: "状态",
          prop: "state",
          width: 80,
        },
        {
          label: "类型",
          prop: "type",
          width: 80,
        },
        {
          label: "就诊日期",
          prop: "diagDate",
          width: 120,
        },
        {
          label: "姓名",
          prop: "patientName",
          width: 100,
        },
        {
          label: "性别",
          prop: "sex",
          width: 70,
        },
        /* {
          label: "结算类型",
          prop: "",
          width: 80,
        }, */
        {
          label: "身份证号",
          prop: "paperwork",
          width: 200,
        },
        {
          label: "诊断",
          prop: "diagName",
          width: 120,
        },
        {
          label: "就诊科室",
          prop: "keshi",
          width: 100,
        },
        {
          label: "就诊医生",
          prop: "fillCardDoctorName",
          width: 100,
        },
        {
          label: "就诊机构",
          prop: "reportUnit",
          width: 120,
        },
      ],
      stateOptions: {
        1: "暂存",
        2: "待审",
      },
      statesOptions: [
        {
          label: "漏报（待上报）",
          value: "1",
        },
        {
          label: "待审",
          value: "2",
        },
        {
          label: "已审",
          value: "3",
        },
        {
          label: "全部",
          value: "",
        },
      ],
      tableData: [],
      dialogVisibleBK: false,
      baokaData: {},
    };
  },
  created() {
    this.searchValue.hosName = JSON.parse(
      localStorage.getItem("pamars")
    ).hosName;
    let date = [
      this.dayjs(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format(
        "YYYY-MM-DD"
      ),
      this.dayjs(new Date()).format("YYYY-MM-DD"),
    ];
    this.searchValue.date = date;
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    async search() {
      this.pageParams.pageNum = 1;
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        let diagnoseStartDate =
          this.searchValue.date.length === 2 ? this.searchValue.date[0] : "";
        let diagnoseEndDate =
          this.searchValue.date.length === 2 ? this.searchValue.date[1] : "";
        let param = {
          ...this.searchValue,
          diagnoseStartDate,
          diagnoseEndDate,
          // hosId: JSON.parse(localStorage.getItem("pamars")).hosId,
          ...this.pageParams,
        };
        delete param.date;
        delete param.hosName;
        let res = await queryInfectiousDiseaseCard(param);
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
    changePage(pageNum) {
      this.pageParams.pageNum = pageNum;
      this.getList();
    },
    async setOut() {
      try {
        let diagnoseStartDate =
          this.searchValue.date.length === 2 ? this.searchValue.date[0] : "";
        let diagnoseEndDate =
          this.searchValue.date.length === 2 ? this.searchValue.date[1] : "";
        let param = {
          diagnoseStartDate,
          diagnoseEndDate,
          diagMain: "1",
          exportType:"1"
        };
        let res = await excelInfectiousDiseaseCard(param);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName("baokaReport")[0];
          var a = document.createElement('a');
          a.setAttribute("id","billHref");
          a.download = '传染病未上报(漏报)查询.xls';
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
      }
      } catch (error) {}
    },
    showBaoka(row) {
      if (!row.state) {
        this.assignmentFun(
          {
            ...row,
            cardSource: "",
            patientName: row.patientName,
            pid: row.pid,
            paperwork: row.paperwork,
            inpNo: row.inpNo,
            diagTime: row.diagDate,
            diagName: row.diagName,
          },
          true
        );
        return;
      }
      this.baokaFormData = this.handleData(row);
      this.dialogVisibleBK = true;
    },
    submitBK(data, flag) {
      this.search();
      if (!flag) {
        this.dialogVisibleBK = false;
      }
    },
    deleteInfectiousDiseaseCard(row) {
      this.$confirm("是否确认删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        try {
          let res = await deleteInfectiousDiseaseCard(row);
          if (res.code === 1) {
            this.$message.success("删除成功！");
            await this.search();
          } else {
            this.$message.error(res.msg || "删除失败！");
          }
        } catch (error) {}
      });
    },
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
    /deep/.el-table .cell{
     line-height: 40px !important;
     font-size: 16px;
    }
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
