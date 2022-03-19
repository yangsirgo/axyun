<template>
  <div class="wrapper width100 height100">
    <div
      class="float-right right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
    >
      <tool-box
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        :boxName="defaultBoxName"
        :modules="boxs"
      />
    </div>
    <div class="workload" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
      <flow-menu>
        <slot name="content">
          <div class="ledger width100 height100">
            <div class="search-input">
              <el-row :gutter="5">
                <el-col :span="6">
                  <LFormtTitle label="处方审核日期" labelWidth="76">
                    <el-date-picker
                      v-model="searchData.date"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']"
                    ></el-date-picker>
                  </LFormtTitle>
                </el-col>
                <el-col :span="4">
                  <LFormtTitle label="审核人员" labelWidth="76">
                    <el-select v-model="searchData.checkUserIdList" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.uid"
                        :label="item.uname"
                        :value="item.uid"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="14" style="text-align:right;font-size:0;">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button type="primary" plain @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="drug-list-cont">
              <el-table
                ref="singleTable"
                :data="drugData"
                border
                width="100%"
                height="100%"
                v-loading="loading"
                element-loading-text="加载中..."
              >
                <el-table-column
                  v-for="(item,index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <!-- 可自定义内容 -->
                    <span>{{ scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="btn-box" style="font-size:0;">
              <el-button
                style="margin-right:8px;"
                class="less-btn float-left"
                type="primary"
                plain
                @click="print"
                v-hotKey="{ func: 'func_print' }"
              >打印</el-button>
              <el-button class="less-btn float-left" type="primary" plain @click="exportExcel">导出</el-button>
            </div>
          </div>
        </slot>
      </flow-menu>
    </div>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";
import { mapGetters } from "vuex";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";

export default {
  name: "reviewWorkload",
  components: { FlowMenu, ToolBox },
  data() {
    return {
      boxs: ["substandardPre"], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false,
      searchData: {
        checkUserIdList: "",
        date: "",
      },
      options: [
        {
          uid: "",
          uname: "全部",
        },
      ],
      tableParams: [
        {
          prop: "userNo",
          label: "工号",
        },
        {
          prop: "checkUserName",
          label: "姓名",
        },
        {
          prop: "checkQuantity",
          label: "处方审核总数",
        },
        {
          prop: "checkSuccessQuantity",
          label: "审核通过数",
        },
        {
          prop: "checkFailureQuantity",
          label: "审核不通过数",
        },
        {
          prop: "checkSuccessRate",
          label: "审核合格率",
        },
        {
          prop: "drugVarietyQuantity",
          label: "审核处方总味数",
        },
        {
          prop: "feedbackSuccessQuantity",
          label: "反馈通过数",
        },
        {
          prop: "feedbackFailureQuantity",
          label: "反馈不通过数",
        },
      ],
      drugData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
  },
  watch: {
    role: {
      immediate: true,
      deep: true,
      handler(v) {
        if (v && v.deptId) {
          this.getuserList(v.deptId);
        }
      },
    },
  },
  created() {
    this.getList();
  },
  methods: {
    toolBoxMessage() {},
    search() {
      this.getList();
    },
    reset() {
      this.searchData = this.$options.data().searchData;
    },
    getList() {
      let params = {
        sCheckTime: (this.searchData.date && this.searchData.date[0]) || "",
        eCheckTime: (this.searchData.date && this.searchData.date[1]) || "",
      };
      if (this.searchData.checkUserIdList !== "") {
        params = {
          ...params,
          checkUserIdList: this.searchData.checkUserIdList,
        };
      }
      this.loading = true;
      opha
        .listForCheck(params)
        .then((res) => {
          if (res.code === 1) {
            this.drugData = res.data;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getuserList(id) {
      base.getuserList(id).then((res) => {
        if (res.code === 1) {
          this.options = this.$options.data().options.concat(res.data);
        }
      });
    },
    // 导出
    exportExcel() {
      if (this.drugData.length === 0) {
        this.$message.warning("暂无要导出数据!");
        return;
      }
      const data = this.drugData.map((item) => {
        const dataItem = {};
        for (let i in item) {
          dataItem[i] = item[i].toString();
        }
        return dataItem;
      });
      let excelData = {
        title: ["审核工作量统计", "", "", "", "", "", "", "", ""],
        tHeader: [
          "工号",
          "姓名",
          "处方审核总数",
          "审核通过数",
          "审核不通过数",
          "审核合格率",
          "审核处方总味数",
          "反馈通过数",
          "反馈不通过数",
        ],
        filterVal: [
          "userNo",
          "checkUserName",
          "checkQuantity",
          "checkSuccessQuantity",
          "checkFailureQuantity",
          "checkSuccessRate",
          "drugVarietyQuantity",
          "feedbackSuccessQuantity",
          "feedbackFailureQuantity",
        ],
        listDate: data,
        fileName: "审核工作量统计",
        merges: ["A1:I1"],
      };
      jsonToExcel(excelData);
    },
    // 打印
    print() {
      if (this.drugData.length === 0) {
        this.$message.warning("暂无要打印数据!");
        return;
      }
      let data = {};
      data.title = "审核工作量统计";
      let detailList = this.drugData.map((item) => {
        const dataItem = {};
        for (let i in item) {
          dataItem[i] = item[i].toString();
        }
        return dataItem;
      });
      data.detailList = detailList;
      onPreview(data, "审核工作量统计");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
.workload {
  height: 100%;
}
.search-input {
  height: 38px;
}
.right {
  width: 287px;
  height: 100%;
  margin-left: -287px;
}
.ledger {
  padding: 16px;
  background-color: $l-color-white;
  display: flex;
  flex-direction: column;
}
.drug-info {
  line-height: 24px;
  margin-top: 5px;
}
.drug-list-cont {
  // top: 78px;
  // bottom: 75px;
  // left: 20px;
  // right: 20px;
  margin-top: 8px;
  margin-bottom: 16px;
  flex: 1;
}
.btn-box {
  height: 34px;
}

</style>