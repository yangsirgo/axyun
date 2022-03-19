<template>
  <div class="retreatMedLeftBar height100" v-loading="loading">
    <el-tabs
      type="border-card"
      v-model="activeName"
      class="height100 LSideTab-tabs"
      @tab-click="tabsClick"
    >
      <el-tab-pane label="未申请" name="first">
        <div
          class="height100"
          v-if="activeName === 'first'"
          style="padding: 10px"
        >
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
              :data="tableData1"
              ref="table1"
              border
              stripe
              height="calc(100% - 10px)"
              @selection-change="selectChange1"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                v-for="(item, index) in tableParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                header-align="center"
                :align="item.align || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'sex'">
                    <span
                      :val="scope.row['sex']"
                      code="GENDER_CODE"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </l-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已申请" name="second">
        <div class="height100" v-if="activeName === 'second'">
          <div style="padding: 10px 20px 20px 20px">
            <LFormtTitle label="患者信息">
              <el-input
                v-model="form.keywords"
                class="width100"
                placeholder="姓名/床号/住院号"
              ></el-input>
            </LFormtTitle>
            <el-date-picker
              class="width100"
              style="margin-top: 10px"
              v-model="form.date"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <div style="margin-top: 10px" class="clearfix">
              <el-button
                style="width: 116px"
                class="float-left"
                type="primary"
                plain
                @click="reset"
                >重置</el-button
              >
              <el-button
                style="width: 116px"
                class="float-right"
                type="primary"
                @click="getList2"
                >查询</el-button
              >
            </div>
          </div>
          <div style="height: calc(100% - 160px); padding: 10px">
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
                :data="tableData2"
                ref="table2"
                border
                stripe
                height="100%"
                @selection-change="selectChange2"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  align="center"
                ></el-table-column>
                <el-table-column
                  v-for="(item, index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'sex'">
                      <span
                        :val="scope.row['sex']"
                        code="GENDER_CODE"
                        v-codeTransform
                      ></span>
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </l-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { getApplyPatientList } from "@/api/ipnw/retreatMedcine";

export default {
  name: "retreatMedLeftBar",
  data() {
    return {
      form: {
        keyword: "",
        date: []
      },
      activeName: "first",
      tableParams: [
        {
          prop: "bedCode",
          label: "床位",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "patientName",
          label: "姓名",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "sex",
          label: "性别",
          width: "70",
          align: "left",
          fixed: false
        },
        {
          prop: "inpCode",
          label: "住院号",
          width: "80",
          align: "left",
          fixed: false
        }
      ],
      loading: false,
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
      tableData1: [],
      tableData2: [],
      selection1: [],
      selection2: []
    };
  },
  created() {
    this.getList1();
  },
  methods: {
    reset() {
      this.form = {
        keyword: "",
        date: []
      };
      this.getList2();
    },
    tabsClick() {
      this.$emit("updateActiveName", this.activeName);
      if (this.activeName === "first") {
        this.getList1();
      } else if (this.activeName === "second") {
        this.getList2();
      }
    },
    async getList1() {
      this.tableData1 = [];
      this.selection1 = [];
      this.loading = true;
      try {
        let params = {
          status: "0,3",
          ...this.pageParams1
        };
        this.$delete(params, "total");
        let res = await getApplyPatientList(params);
        if (res.code === 1) {
          this.pageParams1.total = res.total;
          this.tableData1 = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error(e.msg);
      }
    },
    async getList2() {
      this.tableData2 = [];
      this.selection2 = [];
      this.loading = true;
      try {
        let params = {
          status: 1,
          ...this.pageParams2
        };
        if (this.form.date.length) {
          params.startApplyDate = this.form.date[0];
          params.endApplyDate = this.form.date[1];
        }
        if (this.form.keyword) {
          params.keyword = this.form.keyword;
        }
        this.$delete(params, "total");
        let res = await getApplyPatientList(params);
        if (res.code === 1) {
          this.pageParams2.total = res.total;
          this.tableData2 = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error(e.msg);
      }
    },
    changeSize1(val) {
      this.pageParams1.pageNo = val.page;
      this.pageParams1.pageSize = val.pageSize;
      this.getList2();
    },
    changeSize2(val) {
      this.pageParams2.pageNo = val.page;
      this.pageParams2.pageSize = val.pageSize;
      this.getList2();
    },
    selectChange1(selection) {
      this.selection1 = selection;
      this.$emit("updateSelection1", selection);
    },
    selectChange2(selection) {
      this.selection2 = selection;
      this.$emit("updateSelection2", selection);
    }
  }
};
</script>
<style scoped lang="scss">
.retreatMedLeftBar {
  /* /deep/ .el-tabs,
  .el-tabs--top {
    height: 100%;
  }

  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  } */

  /deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__nav {
    width: 100%;
  }

  /deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__item {
    width: 50% !important;
    text-align: center !important;
    height: 30px !important;
    font-size: $l-font-size !important;

    font-weight: $l-font-weight !important;
    line-height: 30px !important;
  }

  /deep/ .LSideTab-tabs > .el-tabs__header .el-tabs__item.is-active {
    color: $l-color-white !important;
  }

  /deep/ .LSideTab-tabs > .el-tabs__content {
    padding: 0;
    height: calc(100% - 29px);
  }
}
</style>
