<template>
  <div class="page height100">
    <el-card class="height100 padding8">
      <l-card-title>
        <template slot="left">就诊记录</template>
      </l-card-title>
      <div
        style="height: calc(100% - 24px)"
        class="main"
      >
        <el-form
          ref="form"
          class="margin-top-8 margin-bottom-8 main-form"
          :model="form"
          :inline="true"
        >
          <!--<el-form-item label="关键词：">-->
          <!--<el-input v-model="form.name"  style="width: 73%"></el-input>-->
          <!--<el-button type="primary" size="mini" @click="onSubmit">查询</el-button>-->
          <!--</el-form-item>-->
          <el-form-item label="">
            <l-formt-title label="就诊时间">
              <el-date-picker
                style="width: 240px"
                v-model="form.value2"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="datepickerChange"
              >
              </el-date-picker>
            </l-formt-title>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox
              v-model="form.isMe"
              @change="onSubmit"
            >医生本人</el-checkbox>
          </el-form-item>
        </el-form>
        <div
          class="main-table"
          v-loading="loading"
        >
          <el-table
            ref="singleTable"
            highlight-current-row
            @row-click="rowClick"
            :data="tableData"
            border
            height="100%"
          >
            <!-- 业务列 -->
            <el-table-column
              v-for="(item,index) in tableParams"
              :key="index"
              sortable
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              show-overflow-tooltip
              :align="item.align || 'center'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <!-- 可自定义内容 -->
                <template v-if="item.prop === 'ouptDeptId'">
                  <span
                    tableName="sys_org"
                    :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row['ouptDeptId']
                          }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </template>
                <template v-if="item.prop === 'hosId'">
                  <span
                    tableName="sys_org"
                    :conditionMap="{
                          org_type: '_HOS_',
                          id: scope.row[item.prop],
                        }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] || '--'}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          v-if="pageData.currentPage !== 1"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageData.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageData.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="pageData.totalPage"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "historyVisitRecords",
  props: {
    typeModule: {
      type: String,
      default() {
        return "common";
      }
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      form: {
        name: "",
        isMe: false,
        value2: []
      },
      //不允许选择今天之后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: false,
      pageData: {
        pageSize: 10,
        totalPage: 50,
        currentPage: 1
      },
      // 家床 不需要就诊科室
      hTableParams: [
        // {
        //   prop: "visitCode",
        //   label: "诊疗号"
        // },
        {
          prop: "regTime",
          label: "就诊时间",
          width: 120
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          width: 120
        },
        {
          prop: "patientName",
          label: "患者姓名",
          width: 120
        },
        {
          prop: "diagName",
          label: "诊断",
          width: 120
        },
        {
          prop: "hosId",
          label: "所属社康",
          width: 120
        }
      ],
      tableParams: [
        // {
        //   prop: "visitCode",
        //   label: "诊疗号"
        // },
        {
          prop: "regTime",
          label: "就诊时间",
          width: 120
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          width: 120
        },
        {
          prop: "patientName",
          label: "患者姓名",
          width: 120
        },
        {
          prop: "diagName",
          label: "诊断",
          width: 90
        },
        {
          prop: "outpDeptName",
          label: "就诊科室",
          width: 120
        },
        {
          prop: "hosId",
          label: "所属社康",
          width: 120
        }
      ]
    };
  },
  created() {
    this.handleSizeChange();
  },
  components: {},
  methods: {
    typeModuleFunc() {
      // 家庭病床 不存在就诊科室
      if (this.typeModule == "hsick") {
        this.tableParams = this.hTableParams;
      }
    },
    onSubmit(value) {
      this.resetPageData();
      this.$emit("isMeClick", this.pageData, this.form);
    },
    resetPageData() {
      this.pageData = {
        pageSize: 10,
        totalPage: 50,
        currentPage: 1
      };
    },
    rowClick(row) {
      this.$emit("rowClick", row);
    },
    handleSizeChange() {
      this.$emit("pageChange", this.pageData, this.form);
    },
    handleCurrentChange() {
      this.$emit("pageChange", this.pageData, this.form);
    },
    datepickerChange(value) {
      this.$emit("pageChange", this.pageData, this.form);
    },
    setCurrentRow(row) {
      this.$nextTick(() => {
        this.$refs.singleTable.setCurrentRow(row);
      });
    }
  },
  watch: {
    typeModule: {
      deep: true,
      immediate: true,
      handler () {
        this.typeModuleFunc();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  // display: flex;
}
.main {
  display: flex;
  flex-direction: column;
}
.main-table {
  flex: 1;
}
</style>
