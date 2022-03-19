<template>
  <div class="height100 position-relative PLBed">
    <div class="height100" style="padding-top: 20px">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="当前在院" name="1">
          <l-table
            :total="pageParams1.total"
            :pageSize.sync="pageParams1.pageSize"
            :page.sync="pageParams1.pageNo"
            layout="pager"
            :pagerCount="5"
            paginationAlign="center"
            :singlePageShow="true"
            @changeSize="changeSize1"
          >
            <el-table
              ref="singleTable1"
              :data="tableData1"
              border
              stripe
              height="386px"
              width="100%"
              highlight-current-row
              @row-click="rowClick"
              v-loading="loading1"
            >
              <el-table-column
                v-for="(item, index) in tableParams1"
                :key="index"
                :prop="item.prop"
                :min-width="item.width"
                :label="item.label"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'bedNum'">
                    <span>{{ scope.row.bedNum || "--" }}</span> 床
                  </template>
                  <template v-else-if="item.prop === 'patientGender'">
                    <span
                      :val="scope.row[item.prop]"
                      code="GENDER_CODE"
                      v-codeTransform
                    ></span>
                  </template>
                  <div v-else>{{ scope.row[item.prop] }}</div>
                </template>
              </el-table-column>
            </el-table>
          </l-table>
        </el-collapse-item>
        <el-collapse-item title="等候区" name="2">
          <l-table
            :total="pageParams2.total"
            :pageSize.sync="pageParams2.pageSize"
            :page.sync="pageParams2.pageNo"
            layout="pager"
            :pagerCount="5"
            paginationAlign="center"
            :singlePageShow="true"
            @changeSize="changeSize2"
          >
            <el-table
              ref="singleTable2"
              :data="tableData2"
              border
              stripe
              height="386px"
              width="100%"
              highlight-current-row
              v-loading="loading2"
            >
              <el-table-column
                v-for="(item, index) in tableParams2"
                :key="index"
                :prop="item.prop"
                :min-width="item.width"
                :label="item.label"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'bedNum'">
                    <span>{{ scope.row.bedNum || "--" }}</span> 床
                  </template>
                  <template v-else-if="item.prop === 'patientGender'">
                    <span
                      :val="scope.row[item.prop]"
                      code="GENDER_CODE"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop === 'operation'">
                    <el-button type="text" @click="cancelApply(scope.row)"
                      >撤销</el-button
                    >
                  </template>
                  <div v-else>{{ scope.row[item.prop] }}</div>
                </template>
              </el-table-column>
            </el-table>
          </l-table>
        </el-collapse-item>
        <el-collapse-item title="转出区" name="3">
          <l-table
            :total="pageParams3.total"
            :pageSize.sync="pageParams3.pageSize"
            :page.sync="pageParams3.pageNo"
            layout="pager"
            :pagerCount="5"
            paginationAlign="center"
            :singlePageShow="true"
            @changeSize="changeSize3"
          >
            <el-table
              ref="singleTable3"
              :data="tableData3"
              border
              stripe
              height="386px"
              width="100%"
              highlight-current-row
              v-loading="loading3"
            >
              <el-table-column
                v-for="(item, index) in tableParams1"
                :key="index"
                :prop="item.prop"
                :min-width="item.width"
                :label="item.label"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'bedNum'">
                    <span>{{ scope.row.bedNum || "--" }}</span> 床
                  </template>
                  <template v-else-if="item.prop === 'patientGender'">
                    <span
                      :val="scope.row[item.prop]"
                      code="GENDER_CODE"
                      v-codeTransform
                    ></span>
                  </template>
                  <div v-else>{{ scope.row[item.prop] }}</div>
                </template>
              </el-table-column>
            </el-table>
          </l-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import {
  fetchPatientsList,
  getApplyDeptWardMes,
  cancelApplyDeptWard
} from "@/api/ipnw/etHospital";

export default {
  data() {
    return {
      searchParams: {},
      activeName: "1",
      pageParams1: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      pageParams2: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      pageParams3: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      loading1: false,
      loading2: false,
      loading3: false,
      tableParams1: [
        {
          prop: "bedCode",
          label: "床号",
          fixed: false,
          width: "80"
        },
        {
          prop: "patientName",
          label: "姓名",
          fixed: false,
          width: "80"
        },
        {
          prop: "patientGender",
          label: "性别",
          fixed: false,
          width: "60"
        }
      ],
      tableParams2: [
        {
          prop: "bedCode",
          label: "床号",
          fixed: false,
          width: "80"
        },
        {
          prop: "patientName",
          label: "姓名",
          align: "center",
          fixed: false,
          width: "70"
        },
        {
          prop: "patientGender",
          label: "性别",
          align: "center",
          fixed: false,
          width: "70"
        },
        {
          prop: "operation",
          label: "操作",
          fixed: false,
          width: "60"
        }
      ],
      tableData1: [],
      tableData2: [],
      tableData3: []
    };
  },
  computed: {
    ...mapGetters(["receivePatientData", "receivePatientDatas", "entryHosId"])
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    async search(searchParams) {
      this.searchParams = searchParams;
      await this.getList1(searchParams);
      this.$refs.singleTable1.setCurrentRow(this.tableData1[0]);
      this.changeRecPatientData(this.tableData1[0]);
      await this.getList2(searchParams);
      await this.getList3(searchParams);
    },
    async getList1(searchParams) {
      this.loading1 = true;
      try {
        let params = {
          isNurse: 1,
          ...this.pageParams1,
          ...searchParams,
          keyword: searchParams.search
        };
        let res = await fetchPatientsList(params);
        if (res.code === 1) {
          this.tableData1 = res.data;
          this.pageParams1.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
        this.loading1 = false;
      } catch (e) {
        this.loading1 = false;
        this.$message.error(e.msg);
      }
    },
    async getList2(searchParams) {
      this.loading2 = true;
      try {
        let params = {
          ...this.pageParams2,
          beforeWardId: searchParams.illnessArea,
          keyValue: searchParams.search || "",
          status: 0
        };
        this.$delete(params, "total");
        let res = await getApplyDeptWardMes(params);
        if (res.code === 1) {
          this.tableData2 = res.data;
          this.pageParams2.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
        this.loading2 = false;
      } catch (e) {
        this.loading2 = false;
        this.$message.error(e.msg);
      }
    },
    async getList3(searchParams) {
      this.loading3 = true;
      try {
        let params = {
          ...this.pageParams3,
          beforeWardId: searchParams.illnessArea,
          keyValue: searchParams.search || "",
          status: 2
        };
        this.$delete(params, "total");
        let res = await getApplyDeptWardMes(params);
        if (res.code === 1) {
          this.tableData3 = res.data;
          this.pageParams1.tota3 = res.total;
        } else {
          this.$message.error(res.msg);
        }
        this.loading3 = false;
      } catch (e) {
        this.loading3 = false;
        this.$message.error(e.msg);
      }
    },
    changeSize1(val) {
      this.pageParams1.pageNo = val.page;
      this.pageParams1.pageSize = val.pageSize;
      this.getList1(this.searchParams);
    },
    changeSize2(val) {
      this.pageParams2.pageNo = val.page;
      this.pageParams2.pageSize = val.pageSize;
      this.getList2(this.searchParams);
    },
    changeSiz3(val) {
      this.pageParams3.pageNo = val.page;
      this.pageParams3.pageSize = val.pageSize;
      this.getList3(this.searchParams);
    },
    rowClick(row) {
      this.changeRecPatientData(row);
    },
    //撤销
    async cancelApply(row) {
      this.loading2 = true;
      try {
        let params = { ...row };
        let res = await cancelApplyDeptWard(params);
        if (res.code === 1) {
          this.$message.success("撤销成功");
          await this.search(this.searchParams);
        } else {
          this.$message.error(res.msg);
        }
        this.loading2 = false;
      } catch (e) {
        this.loading2 = false;
        this.$message.error(e.msg);
      }
    }
  }
};
</script>
<style lang="scss">
.PLBed {
  .el-collapse-item__content {
    padding: 0;
  }
}
</style>
