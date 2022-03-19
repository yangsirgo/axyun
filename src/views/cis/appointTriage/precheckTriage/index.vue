<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      @message="messageHandler"
      pageName="precheckTriage"
    >
      <template #list>
        <el-card class="form-list height100">
          <l-card-title>
            <template #left>患者列表</template>
          </l-card-title>
          <div>
            <div class="margin-bottom-6">
              <l-value-domain
                clearable
                remoteUrl="/wadmin/hos/dept"
                type="select"
                :value.sync="form.technicalOffices"
                remoteShowKey="orgNm"
                remoteValueKey="id"
                placeholder="请选择科室"
              ></l-value-domain>
            </div>
            <div class="margin-bottom-6">
              <l-value-domain
                clearable
                style="width: 100%"
                :value.sync="form.channelWay"
                :remoteParams="{}"
                remoteUrl="/appointment/numPercentageDict/selectNumPercentageDict"
                type="select"
                remoteShowKey="channelName"
                remoteValueKey="channelCode"
                placeholder="请选择预约渠道"
              ></l-value-domain>
            </div>
            <div class="margin-bottom-6">
              <el-date-picker
                v-model="form.timeRange"
                type="daterange"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="预约开始日期"
                end-placeholder="预约结束日期"
              ></el-date-picker>
            </div>
            <div class="margin-bottom-6">
              <el-input
                @keyup.native.enter="search"
                v-model="form.search"
                placeholder="患者关键信息"
                style="width: 100%"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="search"
                ></i>
              </el-input>
            </div>
            <div class="button-list clearfix">
              <el-button
                class="float-left"
                style="width: 120px; margin-right: 10px"
                type="primary"
                @click="readCard"
              >
                <em class="iconfont iconduka"></em> 读卡
              </el-button>
              <el-button
                class="float-right"
                style="width: 120px; margin-left: 0"
                type="primary"
                plain
                @click="search"
                >查询
              </el-button>
            </div>
          </div>
          <div class="listContent">
            <l-table
              :total="pageParams.total"
              :pageSize.sync="pageParams.pageSize"
              :page.sync="pageParams.pageNo"
              layout="pager"
              :pagerCount="5"
              paginationAlign="center"
              :singlePageShow="true"
              @changeSize="handleSizeChange"
            >
              <div class="table-wrap" v-loading="tableLoading">
                <el-card v-for="(item, index) in listData" :key="index">
                  <div class="listItem" @click="listItemClick(item)">
                    <div class="one">
                      <div>{{ item.patientName }}</div>
                      <div class="patientCode">{{ item.patientCode }}</div>
                    </div>
                    <div class="two">
                      <div>{{ item.patientGender == "1" ? "男" : "女" }}</div>
                      <div>{{ item.birthDate }}</div>
                      <div>{{ item.mobileNum }}</div>
                    </div>
                    <div class="three">
                      身份证号：{{ item.identificationNum }}
                    </div>
                  </div>
                  <div class="noData" v-if="!listData.length">暂无数据</div>
                </el-card>
              </div>
            </l-table>
          </div>
        </el-card>
        <!--<l-side-tabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          :form-list="formParams"
        >
          <template #firstBottom>
            &lt;!&ndash;填入 第一个 tabs 的 搜索条件下部 内容&ndash;&gt;
            <div class="botton-cont height100">
              <div class="table height100">
                <el-table
                  :data="tableLeftData"
                  width="100%"
                  element-loading-text="加载中..."
                  height="100%"
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
                      <template v-if="item.prop === 'hospitalnum'">
                        <span class="color-hospital">{{
                          scope.row[item.prop]
                        }}</span>
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
        </l-side-tabs>-->
      </template>
      <template #content>
        <div class="height100">
          <mainCon></mainCon>
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
import { mapGetters } from "vuex";

export default {
  name: "leftBar",
  data() {
    return {
      tableLoading: false,
      toolBoxs: ["preDiagnosisRecord", "Hotkey"],
      // formParams: ["technicalOffices", "timeRange", "channelWay", "search"],
      /*tableLeftData: [
          {
            id: 12,
            office: "普外科",
            date: "10-11 16:45",
            source: "平安",
            name: "张大伟"
          }
        ],
        tableLeftParams: [
          {
            prop: "office",
            label: "科室",
            width: "100",
            align: "left",
            fixed: true
          },
          {
            prop: "name",
            label: "姓名",
            width: "100",
            align: "left",
            fixed: false
          },
          {
            prop: "source",
            label: "来源",
            width: "80",
            align: "left",
            fixed: false
          },
          {
            prop: "date",
            label: "时间",
            width: "100",
            align: "left",
            fixed: false
          }
        ],*/
      form: {},
      listData: [],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  methods: {
    messageHandler() {},
    async search() {},
    readCard() {},
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.search();
    }
  },
  components: {
    mainCon
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(n) {},
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.listContent {
  height: calc(100% - 277px);
  overflow: auto;
  margin-top: 10px;
  border: 1px solid #e4e4e4;
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

.form-list {
  padding: 10px;
}

.button-list {
  /deep/ .el-button--primary {
    height: 36px;
    font-size: 14px;
    padding: 0;
  }
}

.margin-bottom-6 {
  margin-bottom: 6px;
}

.listItem {
  padding: 10px;

  .one {
    line-height: 2;
    display: flex;
    justify-content: space-between;

    .patientCode {
      color: #0000ff;
      text-decoration: underline;
    }
  }

  .two {
    line-height: 2;
    display: flex;
    justify-content: space-between;
  }

  .three {
    line-height: 2;
  }
}

.noData {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.table-wrap {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>
