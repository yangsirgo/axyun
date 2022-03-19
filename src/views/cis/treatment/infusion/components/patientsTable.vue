<template>
  <div class="height100">
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      v-loading="tl_isLoading"
      stripe
      border
      height="100%"
      style="width: 100%"
      @row-click="handleSelectPatient"
    >
      <el-table-column label="排队" type="index" width="50" align="center"></el-table-column>
      <el-table-column
        v-for="(item,index) in tableParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        header-align="center"
        :align="item.align || 'left'"
      >
        <template slot-scope="scope">
          <span>{{ scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPatientList } from "@/api/cis/treatment/infusion.js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "patientInfo",
  data() {
    return {
      tl_isLoading: false,
      tableData: [],
      tableParams: [
        {
          prop: "patientCode",
          label: "档案编号",
          align: "center"
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "center"
        }
      ],
      searchParams: {}
    };
  },
  computed: {
    ...mapGetters("user", ["role"])
  },
  mounted() {
    console.info(this.role);
    this.loadData();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    loadData(queryData = {}) {
      this.searchParams = queryData;
      this.tl_isLoading = true;
      getPatientList({
        patientName: queryData.search || null,
        deptId: queryData.technicalOffices || this.role.deptId,
        startTime: (queryData.timeRange && queryData.timeRange[0]) || null,
        endTime: (queryData.timeRange && queryData.timeRange[1]) || null
      })
        .then(res => {
          if (res.code === 1) {
            this.tableData = res.data;
            if (res.data.length > 0) {
              this.$refs.singleTable &&
                this.$refs.singleTable.setCurrentRow(this.tableData[0]);
              this.changeRecPatientData(this.tableData[0]);
            } else {
              this.$refs.singleTable && this.$refs.singleTable.setCurrentRow();
              this.changeRecPatientData({});
            }
            this.tl_isLoading = false;
          }
        })
        .catch(err => {
          this.tl_isLoading = false;
          this.$message({
            type: "error",
            message: err
          });
        });
    },
    handleSelectPatient(row, index) {
      // 患者列表选择
      this.changeRecPatientData(row); // 选择患者存储到 vuex 目前vuex
    }
  }
};
</script>

<style scoped lang="scss">
</style>
