<template>
  <div class="wrapper">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{'margin-left': toolBarExpanded ? '360px' : '56px', 'margin-right': toolBoxExpanded ? '298px' : '56px'}"
      >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <el-card class="height100 pre-main" v-loading="deLoading">
              <!-- 处方信息 -->
              <div class="cftitle no-wrap">
                <el-row style="padding:5px 0">
                  <el-col :span="14">
                    <span class="label">处方号：</span>
                    <span class="title">{{recipeForm.recipeCode}}</span>
                    <span class="pre">
                      (
                      <span :val="recipeForm.feeType" code="MedicalPaymentMethod" v-codeTransform></span>)
                    </span>
                  </el-col>
                  <el-col :span="10">
                    <div class="float-right">
                      <span class="label">反馈状态：</span>
                      <span class="check-state">{{showStatus[recipeForm.feedbackState]}}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row style="padding:5px 0" :gutter="20">
                  <el-col :span="6">
                    <span class="label">患者姓名：</span>
                    <span>{{recipeForm.patientName}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="label">性别：</span>
                    <span :val="recipeForm.patientGender" code="GENDER_CODE" v-codeTransform></span>
                  </el-col>
                  <el-col :span="6">
                    <span class="label">年龄：</span>
                    <span :title="recipeForm.patientAge">{{recipeForm.patientAge}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="label">门诊号:</span>
                    <span :title="recipeForm.visitCode">{{recipeForm.visitCode}}</span>
                  </el-col>
                </el-row>
                <el-row style="padding:5px 0" :gutter="20">
                  <el-col :span="6">
                    <span class="label">开单科室：</span>
                    <span :title="recipeForm.deptName">{{recipeForm.deptName}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="label">开单医生：</span>
                    <span :title="recipeForm.doctorUserName">{{recipeForm.doctorUserName}}</span>
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
                    <span :title="recipeForm.orderTime">{{recipeForm.orderTime}}</span>
                  </el-col>
                </el-row>
                <el-row style="padding:5px 0" :gutter="20">
                  <el-col :span="6">
                    <span class="label">取药药房：</span>
                    <span>{{codeToText(recipeForm.billPharCode, drugStorageList)}}</span>
                  </el-col>
                  <el-col :span="18">
                    <span class="label">临床诊断：</span>
                    <span :title="recipeForm.clinicDiag">{{recipeForm.clinicDiag}}</span>
                  </el-col>
                </el-row>
                <el-row style="padding:5px 0" :gutter="20">
                  <el-col :span="12">
                    <span class="label">联系方式：</span>
                    <span :title="recipeForm.phoneNum">{{recipeForm.phoneNum}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span class="label">地址：</span>
                    <span :title="recipeForm.patientAddr">{{recipeForm.patientAddr}}</span>
                  </el-col>
                </el-row>
              </div>
              <div class="pre-main-table">
                <el-table :data="tableData" stripe border style="width: 100%" height="100%">
                  <el-table-column prop="drugName" label="药品名称"></el-table-column>
                  <el-table-column prop="spec" label="规格"></el-table-column>
                  <el-table-column prop="price" label="单价">
                    <template slot-scope="scope">
                      <span>{{ formatNum(scope.row.price) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="originCode" label="生产厂家">
                    <template slot-scope="scope">
                      <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drugQuantity" label="数量"></el-table-column>
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
                <p
                  class="text-ellipsis"
                  v-if="recipeForm.checkState === '2'"
                >不合格原因：{{ recipeForm.unqualifiedComment }}</p>
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
                  <span class="pre-state-reason" v-show="reviewData.feedbackState === '2'">
                    <el-input
                      v-model="reviewData.feedbackComment"
                      placeholder="请输入不接受审核意见原因"
                      :disabled="recipeForm.feedbackState !== '0'"
                    ></el-input>
                  </span>
                </div>
                <el-row>
                  <el-col style="text-align: right;">
                    <el-button
                      class="filter-item"
                      type="primary"
                      @click="reviewRp"
                      :disabled="recipeForm.feedbackState !== '0'"
                    >反馈完成</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left">
      <sidebar :open.sync="toolBarExpanded">
        <slot name="list">
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
                  v-loadmore="{noMoreVar:'tlm_noMore', loadingVar: 'tlm_isLoading', value: loadNextPage}"
                >
                  <el-table-column prop="feedbackState" label="反馈状态">
                    <template slot-scope="scope">{{showStatus[scope.row.feedbackState]}}</template>
                  </el-table-column>
                  <el-table-column prop="patientName" label="患者姓名"></el-table-column>
                  <el-table-column prop="recipeCode" label="处方号" width="160"></el-table-column>
                  <el-table-column prop="chargeTime" label="收费时间" width="180"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </slot>
      </sidebar>
    </div>
    <div
      class="float-left right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
    >
      <tool-box
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        :boxName="defaultBoxName"
        :modules="boxs"
      />
    </div>
  </div>
</template>
<script>
import opha from "@/api/hmm/opha";
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import mixin from "@/mixins/drugManagement.js";
import Sidebar from "@/views/public/sidebar";
import { localCodeTransform } from "@/utils/util";
import hmmBaseApi from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";

export default {
  components: { FlowMenu, ToolBox, Sidebar },
  mixins: [mixin],
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
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true
    },
    mixinsCurrentDrugItem: {
      deep: true,
      handler(v) {
        if (v && v.id) {
          this.getDetails(v.id);
        }
      }
    }
  },
  created() {
    this.search();
    this.getDrugStorageList("0,1");
  },
  methods: {
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
        checkState : "2",
        feedbackState:
          this.searchParam.feedbackState === ""
            ? ""
            : this.searchParam.feedbackState === "0"
            ? "0"
            : "1,2",
        ...this.pageParams
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
    }
  }
};
</script>
<style lang="scss" scoped>
.patient-card-container {
  margin-bottom: 20px;
  height: 66px;
  width: 100%;
}

.wrapper {
  padding: 0;
  height: 100%;
  overflow: hidden;

  .main {
    width: 100%;
    height: 100%;

    .main_wrap {
      margin: 0 297px 0 360px;
      height: 100%;
      .pre-main {
        padding: 20px;
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
    }
  }

  .left {
    width: 340px;
    height: 100%;
    margin-left: -100%;

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
  }

  .right {
    width: 287px;
    height: 100%;
    margin-left: -287px;
  }
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
