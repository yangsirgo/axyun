<template>
  <div class="clinical-path height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
      hosType="3"
    >
      <template #list>
        <l-side-tabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          :tabs-name="tabsName"
          :form-list="formParams"
        >
          <template #first>
            <!--填入 第一个 tabs 的 搜索条件下部 内容-->
            <div class="botton-cont height100">
              <div class="table height100">
                <el-table
                  v-loading="tlm_isLoading"
                  :data="tableLeftData"
                  width="100%"
                  height="100%"
                  element-loading-text="加载中..."
                  border
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
        <div class="clinical-path-con">
          <div class="title">
            <l-card-title>
              <template slot="left">路径表单编辑</template>
            </l-card-title>
          </div>
          <div class="tain-con">
            <el-tabs
              tab-position="left"
              v-model="activeNameTwo"
              class="contleft"
              @tab-click="changeTab"
            >
              <el-tab-pane class="pannel-con" label="基本信息" name="baseInfo">
                <base-info />
              </el-tab-pane>
              <el-tab-pane class="pannel-con" label="治疗方案" name="treatPlan"></el-tab-pane>
              <el-tab-pane class="pannel-con" label="评估标准" name="evaluationStandard"></el-tab-pane>
              <el-tab-pane class="pannel-con" label="理由维护" name="reasonMaintain"></el-tab-pane>
              <el-tab-pane class="pannel-con" label="阶段信息" name="costTemplate">
                <jieduanPart />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import baseInfo from "./components/baseInfo";
import jieduanPart from "./components/jieduanPart";
export default {
  name: "",
  methods: {
    changeTab(index) {
      console.log(index);
    },
    messageHandler() {},
    handleClick() {},
    readCard() {},
    search() {}
  },
  components: {
    baseInfo,
    jieduanPart
  },
  data() {
    return {
      tabsName: [
        {
          label: "患者列表",
          value: "first"
        },
        {
          label: "科室列表",
          value: "second"
        }
      ],
      activeName: "first",
      toolBoxs: [
        "AuxiliaryDiagnosis",
        "patientFullAngle",
        "InspectionResults",
        "CheckResult",
        "HistoricalDiagnosis",
        "commonDiag",
        "PreviousPrescriptions"
      ],
      searchValue: "",
      searchReasult: "",
      activeNameTwo: "baseInfo",
      tlm_isLoading: false,
      // toolBoxs: ["triage"],
      formParams: ["technicalOffices", "timeRange", "channelWay", "search"],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
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
  }
};
</script>

<style lang='scss' scoped>
.clinical-path {
  .clinical-path-con {
    height: 100%;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: #fff;
    .title {
      padding-left: 20px;
      border-bottom: 1px solid #e4e4e4;
    }
    .tain-con {
      height: 100%;
    }
  }
}

/deep/ .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0;
}
/deep/ .el-tabs {
  height: 100%;
}
/deep/ .el-tabs__nav-wrap.is-left {
  //  background-color: $l-color-bgcolor-18;
}
</style>
