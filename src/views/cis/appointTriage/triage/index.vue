<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      @message="messageHandler"
      pageName="referral"
    >
      <template #list>
        <l-side-tabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          :form-list="formParams"
        >
          <template #firstBottom>
            <!--填入 第一个 tabs 的 搜索条件下部 内容-->
            <div class="botton-cont height100">
              <div class="table height100">
                <el-table
                  v-loading="tlm_isLoading"
                  v-loadmore="loadNextPage"
                  :data="tableLeftData"
                  width="100%"
                  height="100%"
                  element-loading-text="加载中..."
                  border
                  @row-click="rowClick"
                >
                  <el-table-column
                    v-for="(item, index) in tableLeftParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :fixed="item.fixed"
                    :min-width="item.width"
                    header-align="left"
                    :align="item.align || 'left'"
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'appointmentMode'">
                        <span>{{ returnMode(scope.row[item.prop]) }}</span>
                      </template>
                      <template v-else>
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </template>
          <template #second>
            <!--填入 第二个 tabs 的  内容-->
            第二卡片内容
          </template>
          <template #third>
            <!--填入 第三个 tabs 的 内容-->
            第三卡片内容
          </template>
        </l-side-tabs>
      </template>
      <template #content>
        <div class="height100">
          <mainCon :patientObj="patientObj"></mainCon>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
// 备注： hosp-state  属性 增加住院的人员状态包括 新入院 在院 预撤床 撤床 。 目前默认选择在院状态
// 目前form 表单有
// 院区：CourtyardArea
// 科室：technicalOffices
// 渠道：channelWay
// 时间：timeRange
// 搜索：search

import LSideTabs from "@/components/LSideTabs.vue";
import mainCon from "./components/mainCon.vue";
import { mapActions, mapGetters } from "vuex";
import { getTableList } from "@/api/cis/appointTriage/index.js";
import {
  getPatients,
  receive,
  findAllergy,
  selectPatientBySth
} from "@/api/cis/visit/visit";
// 重写date 格式化方法
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};
export default {
  name: "leftBar",
  data() {
    return {
      searchValue: "",
      searchReasult: "",
      activeName: "first",
      tlm_isLoading: false,
      toolBoxs: ["triage", "Hotkey"],
      formParams: ["technicalOffices", "timeRange", "channelWay", "search"],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      patientObj: {},
      // 左侧列表查询条件
      searchParams: {
        ouptDeptId: "",
        appointmentMode: "",
        startDate: "",
        stopDate: "",
        queryString: ""
      },
      tableLeftData: [],
      tableLeftParams: [
        {
          prop: "ouptDeptId",
          label: "科室",
          width: "100",
          align: "left",
          fixed: true
        },
        {
          prop: "patientName",
          label: "姓名",
          width: "100",
          align: "left",
          fixed: false
        },
        {
          prop: "appointmentMode",
          label: "预约渠道",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "appointmentTime",
          label: "时间",
          width: "180",
          align: "left",
          fixed: false
        }
      ]
    };
  },
  mounted() {
    // 获取列表数据
    this.getDataList();
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    // table 下滑加载更多
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getDataList();
    },
    // 获取 列表数据
    async getDataList() {
      this.tlm_isLoading = true;

      let params = {
        ...this.searchParams,
        ...this.pageParams
      };
      try {
        let tableLeftData = await getTableList(params);
        this.tlm_isLoading = false;
        if (tableLeftData.code === 1 && tableLeftData.data) {
          this.pageParams.total = tableLeftData.total;
          if (
            Array.isArray(tableLeftData.data) &&
            tableLeftData.data.length > 0
          ) {
            let data = tableLeftData.data;
            if (Array.isArray(data) && data.length > 0) {
              this.patientObj = data[0];
              this.tableLeftData.push(...data);
            }
          }
        }
      } catch (error) {
        this.tlm_isLoading = false;
        console.log(error);
        this.$message.error(error.msg);
      }
    },
    returnMode(code) {
      let sourceCode = {
        "1": "现场预约",
        "2": "绿色通道",
        "3": "医生站复诊",
        "4": "电话",
        "5": "内网预留",
        "6": "外网预留",
        "7": "挂号预约",
        "8": "短信"
      };
      return sourceCode[code] || "默认";
    },
    messageHandler() {},
    handleClick() {
      // tab 的切换方法
    },
    search(form) {
      // 查询方法
      this.searchParams.ouptDeptId = form.technicalOffices;
      this.searchParams.queryString = form.search;
      this.searchParams.appointmentMode = form.channelWay;

      this.searchParams.startDate = Array.isArray(form.timeRange)
        ? form.timeRange[0].toLocaleString()
        : "";
      this.searchParams.stopDate = Array.isArray(form.timeRange)
        ? form.timeRange[1].toLocaleString()
        : "";

      // 清空列表数据
      this.tableLeftData = [];
      this.getDataList();
    },
    readCard(form) {
      // 读卡方法
      try {
        if (!form.search) {
          this.$message.warning("请输入卡号");
          return;
        }
        this.searchParams.ouptDeptId = "";
        this.searchParams.queryString = form.search;
        this.searchParams.appointmentMode = "";
        this.searchParams.startDate = "";
        this.searchParams.stopDate = "";
        // 清空列表数据
        this.tableLeftData = [];
        this.getDataList();
      } catch (error) {
        console.log(error, "error");
      }
    },
    rowClick(row, index) {
      // 患者列表选择 选择患者存储到 vuex 目前vuex 仅存储单个患者需完善
      this.changeRecPatientData(row);
      // 给中间展示区 传入对象
      console.log(row, "row");
      this.patientObj = row;
    }
  },
  components: {
    mainCon
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {},
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.botton-cont {
  margin: 0 20px;
}
.mar-top-10 {
  margin-top: 10px;
}
.color-hospital {
  color: #3d7dfb;
}
/deep/ .content-150 {
  height: calc(100% - 170px);
}
</style>
