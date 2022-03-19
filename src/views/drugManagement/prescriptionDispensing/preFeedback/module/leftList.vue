<template>
  <div class="leftList height100">
    <el-card class="height100">
      <div class="table-top">
        <div class="clearFloat">
          <l-card-title>
            <span slot="left">处方列表</span>
          </l-card-title>
          <l-formt-title class="margin-bottom10" label="反馈状态">
            <el-select v-model="searchParam.feedbackState" placeholder="请选择">
              <el-option
                v-for="item in sfStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </l-formt-title>
          <div class="clearFloat">
            <!--查询按钮-->
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
          </div>
        </div>
        <div class="table-list">
          <l-table
            :total="pagination.total"
            :pageSize.sync="pagination.pageSize"
            :page.sync="pagination.currentPage"
            :layout="layout"
            :pagerCount="5"
            paginationAlign="center"
            :singlePageShow="true"
            @changeSize="changeSize"
          >
            <el-table
              ref="rpTable"
              :data="listData"
              stripe
              border
              style="width: 100%"
              height="100%"
              highlight-current-row
              @current-change="handleCurrentChange"
              v-loading="tlm_isLoading"
            >
              <el-table-column prop="feedbackState" label="反馈状态">
                <template slot-scope="scope">{{
                  showStatus[scope.row.feedbackState]
                }}</template>
              </el-table-column>
              <el-table-column
                prop="patientName"
                label="患者姓名"
              ></el-table-column>
              <el-table-column
                prop="recipeCode"
                label="处方号"
                width="160"
              ></el-table-column>
              <el-table-column
                prop="chargeTime"
                label="收费时间"
                width="180"
              ></el-table-column>
            </el-table>
          </l-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import opha from "@/api/hmm/opha";
export default {
  name: "leftList",
  props: ["param"],
  components: {},
  data() {
    return {
      tlm_isLoading: false,
      listData: [],
      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      layout: "pager",
      searchParam: {
        feedbackState: ""
      },
      sfStatus: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "未反馈"
        },
        {
          value: "1",
          label: "已反馈"
        }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    search() {
      this.pageParams.pageNo = 1;
      this.load();
    },
    reset() {
      this.searchParam = this.$options.data().searchParam;
    },
    load() {
      this.tlm_isLoading = true;
      let params = {
        checkState: "2",
        feedbackState:
          this.param.feedbackState === ""
            ? ""
            : this.param.feedbackState === "0"
            ? "0"
            : "1,2",
        ...this.pagination
      };
      opha
        .list(params)
        .then(res => {
          if (res.code === 1) {
            if (this.pageParams.pageNo === 1) {
              this.listData = res.data;
              this.chooseRpItem(this.listData[0]);
            } else {
              this.listData = this.listData.concat(res.data);
            }
            this.pagination = res.pageParams;
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
        });
    },
    changeSize(val) {
      this.pagination.currentPage = val.page;
      this.pagination.pageSize = val.pageSize;
      this.load();
    }
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang="scss">
.table-top {
  position: relative;
  height: 100%;
  padding: 0 10px;
}
.table-list {
  position: absolute;
  top: 158px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
