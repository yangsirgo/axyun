<template>
  <div class="big-box">
    <div class="title-box">历史申请</div>
    <el-date-picker
      class="apply-time"
      v-model="applyTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="getTime"
    ></el-date-picker>
    <div class="apply">
      <el-tabs v-model="activeName" class="apply-content-tabs" @tab-click="tabsClick">
        <el-tab-pane label="科室" tips="1" name="first"></el-tab-pane>
        <el-tab-pane label="个人" tips="2" name="second"></el-tab-pane>
      </el-tabs>
      <div class="apply-table">
        <el-table
          :data="tableData"
          border
          stripe
          tooltip-effect="dark"
          style="width: 100%;"
          height="100%"
          v-loading="tlm_isLoading"
          v-loadmore="{noMoreVar:tlm_noMore, loadingVar: tlm_isLoading, value: loadNextPage}"
          element-loading-text="加载中..."
          @row-click="getTableRowInfo"
        >
          <el-table-column
            :prop="item.prop"
            v-for="(item,index) in tableParams"
            :min-width="item.width"
            :key="index"
            :label="item.label"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'billStatus'">
                <span class="his-status">{{status[scope.row[item.prop]]}}</span>
              </template>
              <template v-else>
                <span>{{scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="title-box">特殊说明模版</div>
    <div class="spec">
      <el-table
        :data="speTableData"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%;"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="32"></el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <el-button class="quote" @click="sendMsg">引 用</el-button>
  </div>
</template>

<script>
import { getHistoryTable } from "@/api/cis/admApplication/index.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "previousApply",
  data() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const now = `${year}-${month}-${day}`;
    const oldTimes = date.getTime() - 3600 * 1000 * 24 * 3;
    const oldDate = new Date(oldTimes)
      .toLocaleString()
      .split(" ")[0]
      .replace(/\//g, "-");
    return {
      // 列表数据
      tableData: [],
      tableParams: [
        {
          label: "状态",
          prop: "billStatus",
          width: "80"
        },
        {
          label: "患者姓名",
          prop: "patientName"
        },
        {
          label: "就诊科室",
          prop: "applyDeptName"
        },
        {
          label: "就诊医生",
          prop: "applyDoctorName"
        },
        {
          label: "拟入院日期",
          prop: "admDate",
          width: "100"
        },
        /* {
          label: "就诊时间",
          prop: "applyDate"
        }, */
        {
          label: "登记时间",
          prop: "applyDate",
          width: "100"
        }
      ],
      speTableData: [
        {
          id: "1243",
          content: "建议卧床休息，不要吃辛辣"
        },
        {
          id: "2321",
          content: "建议保持良好作息"
        }
      ],
      // 历史申请分页
      tlm_isLoading: false, // 控制table loading
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共条数
        pageSize: 20 // 每页数据条数
      },
      // 状态码
      status: {
        "1": "申请",
        "2": "已预约",
        "3": "已排床",
        "4": "财务入院",
        "5": "财务出院",
        "9": "拒绝",
        "99": "作废"
      },
      multipleSelection: [],
      activeName: "first",
      applyTime: [oldDate, now],
      isQueryDept: true
    };
  },
  computed: {
    // 获取患者信息
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("user", ["role"]),
    // 控制是否还可以继续加载
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageSize) <=
        this.pageParams.pageNo
      );
    },
    refreshFlag() {
      return this.$attrs.loadFlag;
    }
  },
  watch: {
    refreshFlag: {
      handler(val) {
        this.pageParams.pageNo = 1;
        this.loadData();
      }
    },
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.pageParams.pageNo = 1;
        this.loadData();
      }
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    loadData() {
      this.tlm_isLoading = true;
      getHistoryTable({
        startTimeString: this.applyTime && this.applyTime[0],
        endTimeString: this.applyTime && this.applyTime[1],
        queryString: this.isQueryDept
          ? null
          : this.receivePatientData.patientId,
        applyDeptId: this.isQueryDept ? this.role.deptId : null,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      })
        .then(res => {
          if (res.code === 1) {
            const newData = res.data.map(item => ({
              ...item,
              admDate: item.admDate.split(" ")[0],
              applyDate: item.applyDate.split(" ")[0]
            }));
            if (this.pageParams.pageNo === 1) {
              this.tableData = newData;
            } else {
              this.tableData = this.tableData.concat(newData);
            }
            this.pageParams = { ...res.pageParams };
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.$message.error(err);
          this.tlm_isLoading = false;
        });
    },
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sendMsg() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选中要引用的模板!");
        return;
      }
      let list = this.multipleSelection.map(item => item.content);
      const data = list.join(",");
      this.$emit("send-quote", data);
    },
    getTableRowInfo(row) {
      this.changeRecPatientData({
        ...row,
        age: parseInt(row.patientAge),
        diagName: row.opDiagnoses
      }); // 选择患者存储到 vuex 目前vuex
      if (this.receivePatientData.patientId) {
        this.$emit("send-apply-info", row);
      }
    },
    getTime(val) {
      this.pageParams.pageNo = 1;
      this.loadData();
    },
    tabsClick(tab) {
      if (tab.$attrs.tips === "1") {
        this.isQueryDept = true;
      } else {
        this.isQueryDept = false;
      }
      this.pageParams.pageNo = 1;
      this.loadData();
    }
  }
};
</script>
<style lang='scss' scoped>
.big-box {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  background-color: $l-color-white;
  .apply {
    width: 100%;
    height: 32%;
  }
  .spec {
    width: 100%;
    height: 32%;
    margin-bottom: 5px;
  }
  .quote {
    width: 100%;
    background: $l-color-bgcolor-18;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;
    &:hover {
      background: $l-color-bgcolor-12;
    }
  }
  .his-status {
    color: $l-color-primary;
  }
  .title-box {
    line-height: 40px;
    font-weight: bold;
    font-size: $l-font-size;
  }
}
.apply-time {
  width: 100%;
}
.apply-content-tabs {
  height: 55px;
  /deep/ .el-tabs__item {
    padding: 0 10px;
  }
}
.apply-table {
  height: calc(100% - 55px);
}
</style>
