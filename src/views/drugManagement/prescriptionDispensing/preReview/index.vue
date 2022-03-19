<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <el-card class="height100 pre-main" v-loading="deLoading">
              <div class="flex-box">
                <!-- 处方信息 -->
                <div class="cftitle no-wrap">
                  <el-row style="padding:5px 0">
                    <el-col :span="14">
                      <span class="label">处方号：</span>
                      <span class="title">{{recipeForm.recipeCode}}</span>
                      <span class="pre" v-if="recipeForm.recipeCode">
                        (
                        <span
                          :val="recipeForm.feeType"
                          code="MedicalPaymentMethod"
                          v-codeTransform
                        ></span>)
                      </span>
                    </el-col>
                    <el-col :span="10">
                      <div class="float-right">
                        <span class="label">审方状态：</span>
                        <span class="check-state">{{showStatus[recipeForm.checkState]}}</span>
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
                      <span v-if="recipeForm.recipeCode">
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
                      <span class="label">门诊诊断：</span>
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
                    <el-table-column show-overflow-tooltip prop="drugName" label="药品名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="spec" label="规格"></el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="price"
                      align="right"
                      label="单价(元)"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <span>{{ formatNum(scope.row.price, 4) }}</span>
                      </template>s
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="originCode" label="生产厂家">
                      <template slot-scope="scope">
                        <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
                      </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="displayQuantity" label="数量"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="displayUnit" label="单位">
                      <template slot-scope="scope">
                        <span :val="scope.row.displayUnit" code="DrugUnit" v-codeTransform></span>
                      </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="frequencyCode" label="频率">
                      <template slot-scope="scope">
                        <span
                          columns="FREQUENCY_NAME"
                          :conditionMap="{ FREQUENCY_CODE: scope.row.frequencyCode }"
                          tableName="hrp_frequency"
                          v-tableTransform
                        ></span>
                      </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="medicationCode" label="用法">
                      <template slot-scope="scope">
                        <span
                          :val="scope.row.medicationCode"
                          code="MedicationRouteCode"
                          v-codeTransform
                        ></span>
                      </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="oneDosage" label="一次用量">
                      <template slot-scope="scope">
                        {{scope.row.oneDosage}}
                        <span
                          :val="scope.row.dosageUnit"
                          code="DrugDoseUnit"
                          v-codeTransform
                        ></span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="pre-drug-list margin-bottom8">
                  <el-row>
                    <el-col :span="12">
                      <div class="pre-drug-box" v-show="drugList.antibacterialDrug.length > 0">
                        <div
                          class="pre-drug-item"
                          v-for="(item,index) in drugList.antibacterialDrug"
                          :key="'kg'+index"
                        >
                          <span class="title-name">{{ index === 0 ? '抗菌药品:' : '' }}</span>
                          <span class="drug-name">{{item.drugName}}</span>
                          <span>{{item.value}}</span>
                        </div>
                        <div class="pre-drug-num">共: {{drugList.antibacterialDrug.length}}种</div>
                      </div>
                      <div class="pre-drug-box" v-show="drugList.injectionDrug.length > 0">
                        <div
                          class="pre-drug-item"
                          v-for="(item,index) in drugList.injectionDrug"
                          :key="'zs'+index"
                        >
                          <span class="title-name">{{ index === 0 ? '注射药品:' : '' }}</span>
                          <span class="drug-name">{{item.drugName}}</span>
                        </div>
                        <div class="pre-drug-num">共: {{drugList.injectionDrug.length}}种</div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="pre-drug-box" v-show="drugList.basicDrug.length > 0">
                        <div
                          class="pre-drug-item"
                          v-for="(item,index) in drugList.basicDrug"
                          :key="'jb'+index"
                          s
                        >
                          <span class="title-name">{{ index === 0 ? '基本药品:' : '' }}</span>
                          <span class="drug-name">{{item.drugName}}</span>
                          <span>{{item.value}}</span>
                        </div>
                        <div class="pre-drug-num">共: {{drugList.basicDrug.length}}种</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="pre-bottom">
                  <div class="pre-state">
                    <el-radio-group
                      v-model="reviewData.checkState"
                      :disabled="recipeForm.checkState !== '0'"
                    >
                      <el-radio label="1">合格处方</el-radio>
                      <el-radio label="2">不合格处方</el-radio>
                    </el-radio-group>
                    <span class="pre-state-reason" v-show="reviewData.checkState === '2'">
                      <el-input
                        v-model="reviewData.unqualifiedComment"
                        :disabled="recipeForm.checkState !== '0'"
                        placeholder="请输入不合格原因"
                      ></el-input>
                    </span>
                  </div>
                  <el-row>
                    <el-col style="text-align: right;font-size:0;">
                      <el-button type="primary" plain @click="getPendingRp">获取待审处方</el-button>
                      <el-button
                        class="filter-item"
                        type="primary"
                        @click="reviewRp"
                        :disabled="recipeForm.checkState !== '0'"
                      >审核完成</el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-card>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left">
      <el-card class="height100">
        <div class="table-top">
          <div class="clearFloat">
            <l-card-title class="margin-bottom8">
              <span slot="left">处方列表</span>
            </l-card-title>
            <l-formt-title class="margin-bottom8" style="margin-bottom:2px;" label="审方状态">
              <el-select multiple collapse-tags v-model="searchParam.checkState" placeholder="请选择">
                <el-option
                  v-for="item in sfStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
            <l-formt-title class="margin-bottom8" label="收费时间" labelWidth="64">
              <div>
                <el-date-picker
                  v-model="searchParam.chargeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                ></el-date-picker>
              </div>
            </l-formt-title>
            <div class="clearFloat">
              <!--查询按钮-->
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-button style="width:100%;" type="primary" @click="search">查询</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button style="width:100%;" @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="table-list">
            <div class="infinite-list-wrapper" v-loading="tlm_isLoading">
              <div
                class="list-container overflow-scroll-vertical"
                v-infinite-scroll="loadNextPage"
                :infinite-scroll-disabled="listDisabled"
              >
                <div
                  :class="curSelectedIndex === i ? 'list-item active' : 'list-item'"
                  v-for="(item, i) in listData"
                  :key="i"
                  @click="handleSelectedItem(i, item)"
                >
                  <div class="item-label">
                    <span class="rep">{{item.recipeCode}}</span>
                    <div class="rep-dept" :title="item.deptName">{{ item.deptName }}</div>
                    <div class="rep-status">{{ showStatus[item.checkState] }}</div>
                  </div>
                  <div class="item-label">
                    <span
                      class="rep-name label margin-right-6"
                      :title="item.patientName"
                    >{{ item.patientName }}</span>
                    <span
                      class="rep-gender label margin-right-6"
                      :val="item.patientGender"
                      code="GENDER_CODE"
                      v-codeTransform
                    ></span>
                    <span class="rep-charge label">收费时间：{{ item.chargeTimeShow }}</span>
                  </div>
                </div>
                <p
                  v-if="!tlm_isLoading && tlm_noMore"
                  class="load-list-bottom"
                >{{ $t("base.noMore") }}</p>
              </div>
            </div>
            <!-- <el-table
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
              <el-table-column show-overflow-tooltip prop="checkState" label="审方状态">
                <template slot-scope="scope">{{showStatus[scope.row.checkState]}}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="patientName" label="患者姓名"></el-table-column>
              <el-table-column show-overflow-tooltip prop="recipeCode" label="处方号" width="160"></el-table-column>
              <el-table-column show-overflow-tooltip prop="deptName" label="科室"></el-table-column>
              <el-table-column show-overflow-tooltip prop="chargeTime" label="收费时间" width="180"></el-table-column>
            </el-table>-->
          </div>
        </div>
      </el-card>
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
import { localCodeTransform } from "@/utils/util";
import hmmBaseApi from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";

export default {
  components: { FlowMenu, ToolBox },
  mixins: [mixin],
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String,
    },
    // 工具箱默认是否展开状态
    boxExpanded: {
      type: Boolean,
      default: false,
    },
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
          value: "0",
          label: "未审方",
        },
        {
          value: "1",
          label: "通过",
        },
        {
          value: "2",
          label: "不通过",
        },
      ],
      showStatus: {
        "0": "未审方",
        "1": "通过",
        "2": "不通过",
      },
      searchParam: {
        checkState: ["0", "1", "2"],
        chargeTime: [],
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      listData: [],
      recipeForm: {},
      tableData: [],
      reviewData: {
        checkState: "1",
        unqualifiedComment: "",
      },
      drugList: {
        // 抗菌
        antibacterialDrug: [],
        // 注射
        injectionDrug: [],
        // 基本
        basicDrug: [],
      },
      tlm_isLoading: false,
      deLoading: false,
      drugStorageList: [],
      curSelectedIndex: null,
    };
  },
  computed: {
    listDisabled() {
      return this.tlm_isLoading || this.tlm_noMore;
    },
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true,
    },
    mixinsCurrentDrugItem: {
      deep: true,
      handler(v) {
        if (v && v.id) {
          this.getDetails(v.id);
        } else {
          this.tableData = [];
          this.recipeForm = this.$options.data().recipeForm;
          this.drugList = this.$options.data().drugList;
          this.reviewData.checkState = "";
        }
      },
    },
  },
  created() {
    this.search();
    this.getDrugStorageList("0,1");
  },
  methods: {
    formatNum(num, l) {
      return formatNum(num, l);
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
        ...this.pageParams,
        orderBy: "charge_time",
        checkState: this.searchParam.checkState.join(","),
        sChargeDate:
          this.searchParam.chargeTime && this.searchParam.chargeTime[0]
            ? this.searchParam.chargeTime[0] + " 00:00:00"
            : "",
        eChargeDate:
          this.searchParam.chargeTime && this.searchParam.chargeTime[1]
            ? this.searchParam.chargeTime[1] + " 23:59:59"
            : "",
      };
      opha
        .list(params)
        .then((res) => {
          if (res.code === 1) {
            this.pageParams = res.pageParams;
            const list = res.data.map((item) => {
              const date = item.chargeTime.split(" ");
              const time = date[1].substring(0, date[1].length - 3);
              return {
                ...item,
                chargeTimeShow: date[0] + " " + time,
              };
            });
            if (this.pageParams.pageNo === 1) {
              this.listData = list;
              if (this.listData.length > 0) {
                this.handleSelectedItem(0, this.listData[0]);
              } else {
                this.handleSelectedItem(null, {});
              }
            } else {
              this.listData = this.listData.concat(list);
            }
          }
          this.tlm_isLoading = false;
        })
        .catch((err) => {
          this.tlm_isLoading = false;
        });
    },
    reset() {
      this.searchParam = this.$options.data().searchParam;
    },
    handleSelectedItem(i, data) {
      this.curSelectedIndex = i;
      // handleCurrentChange是mixins里修改mixinsCurrentDrugItem的函数
      this.handleCurrentChange(data);
    },
    getDetails(params) {
      this.deLoading = true;
      opha
        .rpCheckGet(params)
        .then((res) => {
          if (res.code === 1) {
            this.recipeForm = res.data;
            this.tableData = res.data.recipeDVOList || [];
            this.drugList = res.data.drugVO || this.$options.data().drugList;
            this.reviewData.checkState = res.data.checkState
              ? res.data.checkState === "0"
                ? "1"
                : res.data.checkState
              : "1";
            this.reviewData.unqualifiedComment =
              res.data.unqualifiedComment || "";
          }
          this.deLoading = false;
        })
        .catch((err) => {
          this.deLoading = false;
        });
    },
    getPendingRp() {
      this.deLoading = true;
      opha
        .getFirstRecipe()
        .then((res) => {
          if (res.code === 1) {
            this.$message.success(res.msg || "获取待审处方成功");
            this.recipeForm = res.data;
            this.tableData = res.data.recipeDVOList || [];
            this.drugList = res.data.drugVO || this.$options.data().drugList;
            this.reviewData.checkState = res.data.checkState
              ? res.data.checkState === "0"
                ? "1"
                : res.data.checkState
              : "1";
            this.reviewData.unqualifiedComment =
              res.data.unqualifiedComment || "";
            let item = this.listData.findIndex(
              (it) => it.recipeCode === res.data.recipeCode
            );
            if (item > -1) {
              this.handleSelectedItem(item, this.listData[item]);
            } else {
              this.handleSelectedItem(null, res.data);
            }
          } else {
            this.$message.error(res.msg || "获取待审处方失败");
          }
          this.deLoading = false;
        })
        .catch((err) => {
          this.deLoading = false;
          this.$message.error(err.msg || "获取待审处方失败");
        });
    },
    reviewRp() {
      let params = {
        checkState: this.reviewData.checkState,
      };
      if (this.reviewData.checkState === "2") {
        if (this.reviewData.unqualifiedComment === "") {
          this.$message.warning("请填写不合格原因");
          return;
        }
        params = {
          ...params,
          unqualifiedComment: this.reviewData.unqualifiedComment,
        };
      }
      this.$showLoading();
      opha
        .rpCheck(this.mixinsCurrentDrugItem.id, params)
        .then((res) => {
          if (res.code === 1) {
            this.$message.success("审核成功");
            this.search();
          } else {
            this.$message.error(res.msg || "审核失败");
          }
          this.$hideLoading();
        })
        .catch((err) => {
          this.$message.error(err.msg || "审核失败");
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
        .then((res) => {
          if (res.code == 1) {
            if (res.data.length == 0) {
              this.$message.error("暂无药库数据");
            }
            this.drugStorageList = res.data;
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
        })
        .catch((err) => {
          this.$message.error(err.msg || "获取药库数据失败");
        });
    },
  },
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
      margin: 0 297px 0 350px;
      height: 100%;
      .pre-main {
        padding: 16px;
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
      }
    }
  }

  .left {
    width: 340px;
    height: 100%;
    margin-left: -100%;

    .table-top {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
    }
    .table-list {
      flex: 1;
      height: 0;
      margin-top: 8px;
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
.pre-drug-list{
  height: 400px;
  overflow: auto;
}
.margin-bottom8 {
  margin-bottom: 8px;
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
.check-state {
  font-weight: bold;
  font-size: $l-font-size-max;
}
.infinite-list-wrapper {
  height: 100%;
}
.list-container {
  height: 100%;

  .list-item {
    padding: 6px 14px;
    position: relative;
    overflow: hidden;

    .status {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 999;
    }

    .status-active {
      color: $l-color-primary;
    }

    .item-label {
      position: relative;
      line-height: 28px;
      color: $l-color-fontcolor-3;
      overflow: hidden;
      .el-col {
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.rep {
            width: 100% !important;
            font-weight: bold;
          }
        }
        &:first-child {
          span {
            &:first-child {
              width: 60px;
              text-align-last: justify;
              -moz-text-align-last: justify; //兼容firefox
              text-align: justify;
              text-justify: distribute-all-lines; //兼容ie
              display: block; //ie下需设为block
            }
          }
        }
      }
      .label {
        white-space: nowrap;
        color: $l-color-fontcolor-3;
        font-size: $l-font-size;
      }

      .minwidth {
        min-width: 80px;
        display: inline-block;
      }
    }
  }
  .delicon {
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    color: $l-color-fontcolor-4;
    .el-icon-delete {
      vertical-align: middle;
    }
  }

  .delicon:hover {
    color: $l-color-primary;
  }

  .list-item:nth-child(even) {
    background: $l-color-bgcolor-18;
  }

  .active {
    background-color: $l-color-bgcolor-12 !important;
  }
}
.rep {
  display: block;
  font-weight: bold;
  margin-right: 110px;
}
.rep-status {
  position: absolute;
  right: 0;
  top: 0;
  font-weight: bold;
}
.rep-name {
  display: inline-block;
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rep-gender {
  display: inline-block;
  width: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rep-charge {
  display: block;
  float: right;
}
.rep-dept {
  position: absolute;
  top: 0;
  right: 50px;
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flex-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  .pre-main-table {
    flex: 1;
    height: 0;
  }
}
</style>
