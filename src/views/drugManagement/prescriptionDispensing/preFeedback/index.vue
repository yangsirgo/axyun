<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
    >
      <template #list>
        <el-card class="height100">
          <div class="table-top">
            <div class="clearFloat">
              <l-card-title>
                <span slot="left">处方列表</span>
              </l-card-title>
              <l-formt-title class="margin-bottom10" label="反馈状态">
                <el-select
                  v-model="searchParam.feedbackState"
                  placeholder="请选择"
                >
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
                layout="pager"
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
                  v-loadmore="{
                    noMoreVar: 'tlm_noMore',
                    loadingVar: 'tlm_isLoading',
                    value: loadNextPage,
                  }"
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
      </template>
      <template #content>
        <el-card class="height100 pre-main" v-loading="deLoading">
          <!-- 处方信息 -->
          <div class="cftitle no-wrap">
            <el-row style="padding: 5px 0">
              <el-col :span="14">
                <span class="label">处方号：</span>
                <span class="title">{{ recipeForm.recipeCode }}</span>
                <span class="pre">
                  (
                  <span
                    :val="recipeForm.feeType"
                    code="MedicalPaymentMethod"
                    v-codeTransform
                  ></span
                  >)
                </span>
              </el-col>
              <el-col :span="10">
                <div class="float-right">
                  <span class="label">反馈状态：</span>
                  <span class="check-state">{{
                    showStatus[recipeForm.feedbackState]
                  }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row style="padding: 5px 0" :gutter="20">
              <el-col :span="6">
                <span class="label">患者姓名：</span>
                <span>{{ recipeForm.patientName }}</span>
              </el-col>
              <el-col :span="6">
                <span class="label">性别：</span>
                <span
                  :val="recipeForm.patientGender"
                  code="GENDER_CODE"
                  v-codeTransform
                ></span>
              </el-col>
              <el-col :span="6">
                <span class="label">年龄：</span>
                <span :title="recipeForm.patientAge">{{
                  recipeForm.patientAge
                }}</span>
              </el-col>
              <el-col :span="6">
                <span class="label">门诊号:</span>
                <span :title="recipeForm.visitCode">{{
                  recipeForm.visitCode
                }}</span>
              </el-col>
            </el-row>
            <el-row style="padding: 5px 0" :gutter="20">
              <el-col :span="6">
                <span class="label">开单科室：</span>
                <span :title="recipeForm.deptName">{{
                  recipeForm.deptName
                }}</span>
              </el-col>
              <el-col :span="6">
                <span class="label">开单医生：</span>
                <span :title="recipeForm.doctorUserName">{{
                  recipeForm.doctorUserName
                }}</span>
              </el-col>
              <el-col :span="6">
                <span class="label">总金额：</span>
                <span>
                  {{ formatNum(recipeForm.prescriptionAmt) }}
                  <span>元</span>
                </span>
              </el-col>
              <el-col :span="6">
                <span class="label">医嘱时间：</span>
                <span :title="recipeForm.orderTime">{{
                  recipeForm.orderTime
                }}</span>
              </el-col>
            </el-row>
            <el-row style="padding: 5px 0" :gutter="20">
              <el-col :span="6">
                <span class="label">取药药房：</span>
                <span>{{
                  codeToText(recipeForm.billPharCode, drugStorageList)
                }}</span>
              </el-col>
              <el-col :span="18">
                <span class="label">临床诊断：</span>
                <span :title="recipeForm.clinicDiag">{{
                  recipeForm.clinicDiag
                }}</span>
              </el-col>
            </el-row>
            <el-row style="padding: 5px 0" :gutter="20">
              <el-col :span="12">
                <span class="label">联系方式：</span>
                <span :title="recipeForm.phoneNum">{{
                  recipeForm.phoneNum
                }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label">地址：</span>
                <span :title="recipeForm.patientAddr">{{
                  recipeForm.patientAddr
                }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="pre-main-table">
            <el-table
              :data="tableData"
              stripe
              border
              style="width: 100%"
              height="100%"
            >
              <el-table-column
                prop="drugName"
                label="药品名称"
              ></el-table-column>
              <el-table-column prop="spec" label="规格"></el-table-column>
              <el-table-column prop="price" label="单价">
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.price) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="originCode" label="生产厂家">
                <template slot-scope="scope">
                  <span
                    :val="scope.row.originCode"
                    code="Manufacturer"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="drugQuantity"
                label="数量"
              ></el-table-column>
              <el-table-column prop="frequencyCode" label="频率">
                <template slot-scope="scope">
                  <span
                    columns="FREQUENCY_NAME"
                    :conditionMap="{ FREQUENCY_CODE: scope.row.frequencyCode }"
                    tableName="hrp_frequency"
                    v-tableTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column prop="medicationCode" label="用法">
                <template slot-scope="scope">
                  <span
                    :val="scope.row.medicationCode"
                    code="MedicationRouteCode"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column prop="oneDosage" label="用量"></el-table-column>
            </el-table>
          </div>
          <div class="pre-drug-feed margin-bottom10">
            <p>审核意见：{{ checkStateShow[recipeForm.checkState] }}</p>
            <p class="text-ellipsis" v-if="recipeForm.checkState === '2'">
              不合格原因：{{ recipeForm.unqualifiedComment }}
            </p>
          </div>
          <div class="pre-bottom">
            <div class="pre-state">
              <el-radio-group
                v-model="reviewData.feedbackState"
                :disabled="recipeForm.feedbackState !== '0'"
              >
                <el-radio label="1">接受审核意见</el-radio>
                <el-radio label="2">不接受审核意见</el-radio>
              </el-radio-group>
              <span
                class="pre-state-reason"
                v-show="reviewData.feedbackState === '2'"
              >
                <el-input
                  v-model="reviewData.feedbackComment"
                  placeholder="请输入不接受审核意见原因"
                  :disabled="recipeForm.feedbackState !== '0'"
                ></el-input>
              </span>
            </div>
            <el-row>
              <el-col style="text-align: right">
                <el-button
                  class="filter-item"
                  type="primary"
                  @click="reviewRp"
                  :disabled="recipeForm.feedbackState !== '0'"
                  >反馈完成</el-button
                >
              </el-col>
            </el-row>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import leftList from "./module/leftList.vue";
import { mapActions, mapGetters } from "vuex";
import LSideTab from "@/views/components/LSideTab";
import LSideList from "@/views/components/LSideList";
import opha from "@/api/hmm/opha";
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import mixin from "@/mixins/drugManagement.js";
import Sidebar from "@/views/public/sidebar";
import { localCodeTransform } from "@/utils/util";
import hmmBaseApi from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "",
  mixins: [mixin],
  components: {
    leftList,
    LSideTab,
    LSideList
  },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String
    },
    // 工具箱默认是否展开状态
    boxExpanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      toolBoxs: ["otherPrescription", "drugCheck"],
      patientInfo: {},
      patientInfoList: [],
      form: {
        feedbackState: 0
      },
      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      recipeFormid: "",
      boxs: ["otherPrescription", "drugCheck"], //工具箱
      defaultBoxName: "otherPrescription",
      toolBoxExpanded: false,
      toolBarExpanded: true,
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
      ],
      showStatus: {
        "0": "未反馈",
        "1": "已反馈",
        "2": "已反馈"
      },
      checkStateShow: {
        "1": "合格处方",
        "2": "不合格处方"
      },
      searchParam: {
        feedbackState: ""
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      listData: [],
      recipeForm: {},
      tableData: [],
      reviewData: {
        feedbackState: "1",
        feedbackComment: ""
      },
      tlm_isLoading: false,
      deLoading: false,
      drugStorageList: []
    };
  },
  provide() {
    return {
      getIsCreatRecordBtn: () => 0, // 是否建档按钮:1为有;0为无
      getPatientInfoTitle: () => "", // 患者信息名称
      getPatientInfos: () => this.patientInfo,
      getPatientInfoList: () => this.patientInfoList
    };
  },
  computed: {
    ...mapGetters("patientMaster", ["patientListData"]),
    ...mapGetters("patientMaster", ["receivePatientData"])
  },
  watch: {
    mixinsCurrentDrugItem: {
      deep: true,
      handler(v) {
        if (v && v.id) {
          this.getDetails(v.id);
        }
      }
    },
    receivePatientData: {
      async handler(n) {
        this.patientInfo = {};
        this.patientInfoList = [];
        if (n.patientId) {
          this.handleData(n);
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.search();
    this.getDrugStorageList("0,1");
  },
  methods: {
    ...mapActions({
      changeSimilarRecordData: "patientMaster/changeSimilarRecordData"
    }),
    changeSize(val) {
      this.pagination.currentPage = val.page;
      this.pagination.pageSize = val.pageSize;
      this.load();
    },
    formatNum(num) {
      return formatNum(num);
    },
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    search() {
      this.pageParams.pageNo = 1;
      this.load();
    },
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.load();
    },
    load() {
      this.tlm_isLoading = true;
      let params = {
        checkState: "2",
        feedbackState:
          this.searchParam.feedbackState === ""
            ? ""
            : this.searchParam.feedbackState === "0"
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
            this.pageParams = res.pageParams;
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
        });
    },
    reset() {
      this.searchParam = this.$options.data().searchParam;
    },
    chooseRpItem(data = {}) {
      this.$refs.rpTable.setCurrentRow(data);
      this.handleCurrentChange(data);
    },
    getDetails(params) {
      this.deLoading = true;
      opha
        .rpCheckGet(params)
        .then(res => {
          if (res.code === 1) {
            this.recipeForm = res.data;
            this.tableData = res.data.recipeDVOList;
            this.reviewData.feedbackState =
              res.data.feedbackState === "0" ? "1" : res.data.feedbackState;
            this.reviewData.feedbackComment = res.data.feedbackComment || "";
          }
          this.deLoading = false;
        })
        .catch(err => {
          this.deLoading = false;
        });
    },
    reviewRp() {
      let params = {
        feedbackState: this.reviewData.feedbackState
      };
      if (this.reviewData.feedbackState === "2") {
        if (this.reviewData.feedbackComment === "") {
          this.$message.warning("请填写不接受审核意见原因");
          return;
        } else {
          params = {
            ...params,
            feedbackComment: this.reviewData.feedbackComment
          };
        }
      }
      this.$showLoading();
      opha
        .rpFeedback(this.mixinsCurrentDrugItem.id, params)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("反馈成功");
            this.search();
          } else {
            this.$message.error(res.msg || "反馈失败");
          }
          this.$hideLoading();
        })
        .catch(err => {
          this.$message.error(err.msg || "反馈失败");
          this.$hideLoading();
        });
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = res.data;
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药库数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药库数据失败");
        });
    },
    //子组件抛出的方法
    sideEvent(sideEvent) {
      this.$nextTick(() => {
        this.$refs.leftList[obj[sideEvent]](this.form);
      });
    },
    //getPatientInfos,getPatientInfoList数据
    handleData(n) {
      this.patientInfo = {
        patientName: n.patientName,
        patientGender: n.patientGender,
        patientAge: n.patientAge,
        birthDate: n.birthDate,
        imgSrc: require("@/assets/pojehjdz.jpeg")
      };
      this.patientInfoList = [
        {
          key: "身份证号",
          value: n.identificationNum || "--"
        },
        {
          key: "联系方式",
          value: n.mobileNum || "--"
        }
      ];
    },
    //工具箱
    messageHandler() {
      console.log("工具箱");
    },
    //左侧列表转换tab
    handleClick(tabs) {},
    changeParam(data) {
      this.sideEvent("query");
      this.changeSimilarRecordData({});
    }
    /*
      // 查询方法
      search(form) {
        delete form["startTimeRange"];
        delete form["endTimeRange"];
        if (form.timeRange != null && form.timeRange.length > 1) {
          form["startTimeRange"] = form.timeRange[0];
          form["endTimeRange"] = form.timeRange[1];
        }
        this.param = {
          ...form,
          date: new Date()
        };
        this.searchType = 'searchButton';
      },
      // 读卡方法
      readCard(form) {
        let clearData = '1';
        if (this.patientListData.patientList.length > 0 && this.patientListData.clear == '2') {
          clearData = '2';//不清
        }
        this.param = {
          cardId: form.search,
          date: new Date(),
          clearData: clearData
        };
        this.searchType = 'readCard';
      },*/
  }
};
</script>

<style lang="scss" scoped>
.pre-main {
  padding: 20px;
  position: relative;
}
.cftitle {
  .title {
    font-size: 20px;
    font-weight: bold;
    color: $l-color-fontcolor-3;
  }

  .label {
    color: $l-color-fontcolor-4;
    margin-right: 10px;
  }

  .pre {
    font-size: 16px;
    color: $l-color-fontcolor-3;
  }
}
.pre-bottom {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
.table-top {
  position: relative;
  height: 100%;
  padding: 0 10px;
}
.table-list {
  position: absolute;
  top: 158px;
  left: 10px;
  right: 10px;
  bottom: 0px;
}

.pre-main-table {
  height: calc(100% - 332px);
  margin-top: 10px;
}
.margin-bottom10 {
  margin-bottom: 10px;
}
.pre-drug-item {
  line-height: 30px;
}
.title-name {
  display: inline-block;
  width: 80px;
}
.drug-name {
  margin-right: 20px;
}
.no-wrap {
  /deep/ .el-col {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.pre-state {
  height: 36px;
  line-height: 36px;
}
.pre-state-reason {
  display: inline-block;
  width: 400px;
  margin-left: 20px;
}
.pre-drug-feed {
  line-height: 30px;
  margin-top: 10px;
}
.text-ellipsis {
  // text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.check-state {
  font-weight: bold;
  font-size: $l-font-size-max;
}
</style>
