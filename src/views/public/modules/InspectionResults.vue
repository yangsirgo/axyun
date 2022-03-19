<template>
  <div class="width100 height100" v-loading="loading">
    <div class="top-container">
      <!-- 类型下拉 -->
      <l-value-domain
        :code="code"
        :value.sync="typeVal"
        @change="typeChange"
        class="select-container"
        :placeholder="$t('base.placeholder')"
      />
      <!-- 时间选择 -->
      <time-tab class="float-right" :val.sync="timeVal" @change="timeChanage" />
    </div>
    <div
      class="content overflow-scroll-vertical"
      v-infinite-scroll="loadNextPage"
      infinite-scroll-disabled="listDisabled"
    >
      <div class="diag-list" v-for="(item, index) in diagList" :key="index">
        <p
          class="desc-text"
          @click="changeDiag(item)"
        >{{ item.diagName }} {{ item.diagTime && item.diagTime.split(" ")[0] }}</p>
        <el-collapse v-model="activeNames" v-show="activeId === item.id" v-loading="activeLoading">
          <p class="noData" v-if="!activeLoading && listData.length === 0">暂无数据</p>
          <l-collapse-item
            sty="3"
            v-for="(item, index) in listData"
            :key="'list' + index"
            :name="index"
          >
            <template slot="title">
              <div class="width100">
                <div
                  v-if="activeNames.indexOf(index) != -1 && quoteState"
                  @click.stop="quote(item)"
                  class="float-right quote-button sbj-btn mini-button"
                  type="primary"
                >{{ $t("base.quote") }}</div>
                <div class="sbj">{{ item.assayApplyItemName }}</div>
                <!-- 引用按钮 -->
              </div>
            </template>
            <template slot="content">
              <el-table
                :data="item.assayPublishResultPOs"
                @selection-change="handleSelectionChange"
                border
                style="width: 100%"
              >
                <el-table-column v-if="quoteState" type="selection"></el-table-column>
                <el-table-column prop="assayName" label="检验项目"></el-table-column>
                <el-table-column prop="assayResult" label="测定结果"></el-table-column>
                <el-table-column prop="assayUnit" label="单位"></el-table-column>
                <el-table-column prop="referenceValue" label="参考范围"></el-table-column>
              </el-table>
            </template>
          </l-collapse-item>
        </el-collapse>
      </div>
      <p v-if="loading" class="load-list-bottom">{{ $t("base.loading") }}</p>
      <p v-if="noMore" class="load-list-bottom">{{ $t("base.noMore") }}</p>
    </div>
  </div>
</template>
<script>
import TimeTab from "../component/TimeTab";
import InfiniteList from "../component/InfiniteList";
import { getAssayList } from "@/api/tools/InspectionResults.js";
import { getDiagList } from "@/api/tools/historicalDiagnosis";
import { mapGetters } from "vuex";

// 检验结果
export default {
  components: {
    TimeTab,
    InfiniteList
  },
  props: {
    quoteState: false
  },
  data() {
    return {
      // 类型数据code
      code: "VisitingCategoryCode",
      // 类型值
      typeVal: this.$attrs.hosType,

      // 时间值
      // [0](半年)
      // [1](一年)
      // [2019-1-1,2019-2-1](自定义)
      timeVal: [0],

      activeNames: [],

      // 检验检查的结果文描
      resultDesc: "肾功能不全，2019-9-9",
      // 主诊断列表
      diagList: [],
      // 某个诊断列表数据
      listData: [],
      // 分页控制参数
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 20 // 每页数据条数
      },

      // 列表状态控制
      loading: false,
      // 报告详情loading
      activeLoading: false,
      // 当前点击的主诊断id
      activeId: "",
      multipleSelection: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    listDisabled() {
      return this.loading || this.noMore;
    },
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    hType() {
      // 1，门诊 3，家床
      console.log(this.$attrs.hosType);
      return this.$attrs.hosType;
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler() {
        this.$set(this.pageParams, "pageNo", 1);
        this.loadTable();
      }
    }
  },
  methods: {
    // 选中行时触发的事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 加载列表数据
    loadTable() {
      if (!this.receivePatientData.patientId) {
        this.diagList = [];
        return;
      }
      this.loading = true;
      let params = {
        clinicType: this.typeVal,
        timeVal: this.timeVal[0],
        patientId: this.receivePatientData.patientId,
        diagMain: "1",
        ...this.pageParams
      };
      if (this.timeVal.length > 1) {
        params.timeVal = "3";
        params["createdAtStart"] = this.timeVal[0];
        params["createdAtEnd"] = this.timeVal[1];
      }
      getDiagList(params)
        .then(res => {
          if (res.code === 1) {
            if (this.pageParams.pageNo === 1) {
              this.diagList = res.data;
            } else {
              this.diagList = this.diagList.concat(res.data);
            }

            this.pageParams = { ...res.pageParams };
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 时间范围切换
    timeChanage() {
      this.$set(this.pageParams, "pageNo", 1);
      this.loadTable();
    },
    // 类型切换
    typeChange() {
      this.$set(this.pageParams, "pageNo", 1);
      this.loadTable();
    },
    // 引用
    quote(data) {
      let res = {
        multipleSelection: this.multipleSelection,
        data: data
      };
      this.$emit("message", "insertCheckRes", res);
      // this.editor.execCommand('insertmacros', {id:macro.mrShareEleId,code:macro.mrShareEleCd,name:macro.mrShareEleNm,isSecret:macro.securityF == 1});
    },
    // 加载详情
    loadDetail(data) {
      this.activeLoading = true;
      let ndata;
      if (this.hType === "1") {
        ndata = {
          visitCode: data.visitCode
        };
      } else if (this.hType === "3") {
        ndata = {
          inpCode: data.inpCode
        };
      }
      let params = {
        ...ndata,
        clinicType: this.typeVal,
        timeVal: this.timeVal[0],
        patientId: this.receivePatientData.patientId,
        diagMain: "1",
        pageNo: 1,
        pageSize: 1000,
        total: 0
      };
      if (this.timeVal.length > 1) {
        params.timeVal = "3";
        params["createdAtStart"] = this.timeVal[0];
        params["createdAtEnd"] = this.timeVal[1];
      }
      getAssayList(params)
        .then(res => {
          if (res.code === 1) {
            console.log(res);
            this.listData = res.data;
          }
          this.activeLoading = false;
        })
        .catch(err => {
          this.activeLoading = false;
          this.$message.error(err);
        });
    },
    // 点击主诊断
    changeDiag(data) {
      this.listData = [];
      this.loadDetail(data);
      this.activeId = data.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.top-container {
  height: 60;
}
.select-container {
  width: 80px;
}
.content {
  position: absolute;
  top: 51px;
  bottom: 0px;
  left: 10px;
  right: 10px;
}
.act-word {
  color: $l-color-fontcolor-2;
}
.desc-text {
  margin: 20px 0 10px 0;
  color: $l-color-fontcolor-4;
  cursor: pointer;
}
.quote-button {
  margin-top: 10px;
}
.noData {
  text-align: center;
  padding: 5px 0;
}
.sbj {
  margin-right: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sbj-btn {
  display: block;
}
</style>
