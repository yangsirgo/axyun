<template>
  <div class="height100 width100">
    <div class="out_box height100">
      <el-table
        :data="diagHistory"
        border
        width="100%"
        height="100%"
        ref="singleTable"
        highlight-current-row
        v-loadmore="loadNextPage"
        v-loading="tlm_isLoading"
      >
        <el-table-column fixed="left" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="blue-color"
              @click="quoteFunc(scope.row)"
              >引用</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableParamsZ"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          header-align="center"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              v-if="item.prop === 'clinicType'"
              v-codeTransform
              :val="scope.row[item.prop]"
              code="VisitingCategoryCode"
            ></span>
            <span
              v-else-if="item.prop === 'diagType'"
              v-codeTransform
              :val="scope.row[item.prop]"
              code="DiseaseDiagnosisCategoryCode"
            ></span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getDiagList } from "@/api/tools/historicalDiagnosis";
import { mapGetters } from "vuex";
import { updateDiag, addDiag, getCardByICD } from "@/api/common/diagnosis";
import { deepClone } from "@/utils/index.js";
export default {
  name: "timeLine",
  data() {
    return {
      load: false,
      diagHistory: [],
      tableParamsZ: [
        {
          prop: "diagTime",
          label: "诊断日期",
          align: "center",
          fixed: false
        },
        {
          prop: "clinicType",
          label: "就诊类型",
          align: "center",
          fixed: false
        },
        {
          prop: "diagType",
          label: "诊断类型",
          align: "center",
          fixed: false
        },
        {
          prop: "diagName",
          label: "诊断名称",
          align: "center",
          fixed: false
        },
        {
          prop: "deptName",
          label: "诊断科室",
          align: "center",
          fixed: false
        },
        {
          prop: "diagDoctorName",
          label: "诊断医生",
          align: "center",
          fixed: false
        }
      ],
      // 分页控制参数
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // table 分页加载必须定义字段
      tlm_isLoading: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("diagnosis", ["diagTemRefresh"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.loadTable();
  },
  watch: {
    receivePatientData: {
      handler(n) {
        this.loadTable();
      },
      deep: true
    },
    diagTemRefresh() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    }
  },
  methods: {
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 加载列表数据 CLINIC_TYPE
    async loadTable() {
      if (!this.receivePatientData.patientId) {
        this.tableData = [];
        return;
      }
      try {
        this.tlm_isLoading = true;
        let params = {
          patientId: this.receivePatientData.patientId,
          ...this.pageParams
        };

        let response = await getDiagList(params);
        // let tableData = [];
        if (response.code == "1") {
          if (this.pageParams.pageNo === 1) {
            this.diagHistory = response.data;
          } else {
            this.diagHistory = this.diagHistory.concat(response.data);
          }
          this.pageParams = { ...response.pageParams };
        }
        // this.tableData = tableData;
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    quoteFunc(row) {
      this.$confirm("您确定要引用此诊断吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = deepClone(row);
          data.diagMain = "0";
          data.status = '1';
          if (this.receivePatientData.visitCode) {
            data.visitCode = this.receivePatientData.visitCode;
            this.hosType="1"
            this.$delete(data, "inpCode");
            this.$delete(data, "treatNo");
          } else if (this.receivePatientData.inpCode) {
            data.inpCode = this.receivePatientData.inpCode;
            this.hosType="2"
            this.$delete(data, "visitCode");
          }
          this.$delete(data, "id");
          addDiag(data)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("引用成功");
                // this.$emit("load-diag-table");
                this.$emit("message");
                if (this.hosType === "1") {
                    this.goBaoka(data);
                  }
              } else {
                this.$message.error(res.msg || "引用失败");
              }
            })
            .catch(err => {
              this.$message.error(err || "引用失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消引用");
        });
    },
    goBaoka(data) {
      // this.loadSwitch(true);
      let paths ="";
     if(this.hosType=="1"){
       paths="/cisOne/infectious";
     }else{
       this.hosType="2"
       paths="/ipnw/inpatientsInfectious";

     }
     console.log("goBaoka(data)------------",data)
      getCardByICD({
        diagCode: data.diagCode,
        cardSource: this.hosType,
        pid: this.receivePatientData.patientId
      })

        .then(result => {
          // this.loadSwitch(false);
          if (result.result !== 0) {
            this.$confirm("确认跳转到填写报卡页面吗？")
              .then(_ => {
                this.$router.push({
                  path: paths,
                  query: {
                    diagName: data.diagName,
                    diagCode: data.diagCode,
                    cardSource: this.hosType,
                    pid: this.receivePatientData.patientId
                  }
                });
              })
              .catch(_ => {});
          }
        })
        .catch(error => {
          // this.loadSwitch(false);
          this.$message.error(error.msg || "报卡接口错误!");
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-button {
  width: 45px;
  text-align: left;
  color: #3d7dfb;
}
</style>
