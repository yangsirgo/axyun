<template>
  <div class="wrapper height100">
    <div class="fl left height100">
      <historyVisitRecords
        v-loading="loading"
        typeModule="hsick"
        ref="historyVisitRecords"
        :tableData="tableData"
        @isMeClick="onSubmit"
        @rowClick="rowClick"
        @pageChange="search"
      ></historyVisitRecords>
    </div>
    <chm-history
      ref="history"
      :visitCode="receivePatientData.visitCode"
      :currentPrescriptionData="currentPrescriptionData"
      class="fr right height100"
      @copy="copyHandler"
    ></chm-history>
  </div>
</template>

<script>
import historyVisitRecords from "@/components/adviceCommon/modules/historyVisitRecords.vue";
import { mapActions, mapGetters } from "vuex";
import chmHistory from "./chmHistoryShowWrapper.vue";
import { getHistoryVisit } from "@/api/homeSickbeds/hsDiagTreat/hsChmRecipe.js";

export default {
  name: "index",
  components: { historyVisitRecords, chmHistory },
  props: {
    adviceType: {
      default: "西药"
    },
    currentPrescriptionData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        isMe: false,
        value2: []
      },
      tableData: [],
      tableParams: [
        {
          prop: "visitCode",
          label: "诊疗号"
        },
        {
          prop: "patientName",
          label: "患者姓名"
        },
        {
          prop: "diagName",
          label: "诊断"
        },
        {
          prop: "outpDeptName",
          label: "就诊科室"
        },
        {
          prop: "hosId",
          label: "所属社康"
        }
      ],
      pageSize: 10,
      totalPage: 50,
      currentPage: 1,
      loading: false
    };
  },
  created() {

  },
  mounted() {
    this.getAdviceItemFun();
  },
  methods: {
    copyHandler(mult) {
      this.$emit("copy", mult);
    },
    datepickerChange(value) {
      this.getAdviceItemFun();
    },
    onSubmit(pageData, value) {
      this.getAdviceItemFun(pageData, value);
    },
    rowClick(row) {
      this.$refs.history && this.$refs.history.reloadTableData(row);
    },
    handleCurrentChange(val) {
      this.search();
    },
    search(pageData, formData) {
      this.getAdviceItemFun(pageData, formData);
    },
    getParams(pageData = {}, formData = {}) {
      console.log("入参：：：：", pageData, formData);
      let { currentPage = 1, pageSize = 10, totalPage } = pageData ;
      
      let obj = {
        pageNo: currentPage,
        pageSize: pageSize
      };

      let datePicker = {
        startDate: "",
        stopDate: ""
      };
      if (formData.value2 && formData.value2.length > 0) {
        datePicker = {
          startDate: formData.value2[0] + " 00:00:00",
          stopDate: formData.value2[1] + " 23:59:59"
        };
      }

      return { ...obj, ...formData, ...datePicker };
    },
    handleSizeChange(val) {
      this.search();
    },
    // 获取就诊列表
    getAdviceItemFun(pageData, formData) {
      let obj = this.getParams(pageData, formData);
      let { patientId } = this.receivePatientData;
      if (!patientId) {
        return;
      }
      obj = { ...obj, patientId};

      obj = {
        ...obj,
        ...{
          pageNo: 1,
          pageSize: 10
        }
      };

      this.loading = true;
      getHistoryVisit(obj)
        .then(res => {
          if (res.code === 1) {
            // this.tableData = resData;
            this.tableData = [];
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i];
              item = {
                ...item,
                ...{
                  visitCode: item.id,
                  diagName: item.firstDiagnosisContent,
                  regTime: item.treatStartTime,
                  outpDeptName: item.deptName
                }
              }
              this.tableData.push(item);
            }

            this.$refs.historyVisitRecords.setCurrentRow(this.tableData[0]);
            try {
              this.rowClick(this.tableData[0]);
            } catch (error) {
              
            }

            // for(let i = 0; i < this.tableData.length; i++) {
            //   let row = this.tableData[i];
            //   this.tableData[i].status = row.status == "0" ? "激活" : "禁用";
            // }
            // this.totalPage = res.total;
            // this.pageNo = res.pageNo;
            // this.pageSize = res.pageSize;
          } else {
            this.$message.error("查询失败");
          }
          this.loading = false;
        })
        .catch(e => {
          this.$message.error("查询失败");
          this.loading = false;
        });
    }
  },
  watch: {},
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  padding: 10px;
  .left {
    width: 35%;
    padding-right: 10px;
    .main {
      display: flex;
      flex-direction: column;
    }
    .main-table {
      flex: 1;
    }
  }

  .right {
    width: 65%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    .utils {
      display: flex;
      justify-content: flex-end;
    }
    .content {
      flex: 1;
    }
  }
}
</style>
