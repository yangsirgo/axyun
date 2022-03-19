<template>
  <el-card class="height100">
    <div class="table-top">
      <el-row>
        <el-radio-group
          v-model="searchparam.searchType"
          @change="searchTypeFun"
          style="width: 100%"
        >
          <el-col :span="7">
            <el-radio label="0">收费日期</el-radio>
          </el-col>
          <el-col :span="5">
            <el-radio label="1">读卡</el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio label="2">收据号</el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio label="3">处方号</el-radio>
          </el-col>
        </el-radio-group>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-date-picker
            v-model="searchparam.date"
            v-show="searchparam.searchType === '0'"
            style="width:100%"
            type="daterange"
            value-format="yyyy-MM-dd"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="true"
          ></el-date-picker>
          <el-input
            v-model="searchparam.queryValue"
            v-show="searchparam.searchType !== '0'"
            :class="{ cardInput: searchparam.searchType === '1' }"
          ></el-input>
          <el-button
            style="width:38%"
            type="primary"
            class="ic"
            v-show="searchparam.searchType === '1'"
            @click="search(3)"
          >
            <i class="iconfont iconduka"></i> 读卡
          </el-button>
          <!-- <el-button v-show="searchparam.icShow" @click="search(3)" class="ic" type="success">读卡</el-button> -->
        </el-col>
        <!-- <el-col :span="8">
          <el-select
            v-model="searchparam.refundState"
            clearable
            placeholder="请选择"
            class="refundState"
          >
            <el-option value="0" label="未退药"></el-option>
            <el-option value="2" label="已退药"></el-option>
          </el-select>
        </el-col>-->
      </el-row>

      <el-row class="search-btn" :gutter="8">
        <el-col :span="9">
          <el-button @click="search(2)" type="primary">往日处方查询</el-button>
        </el-col>
        <el-col :span="9">
          <el-button @click="search(1)">本日处方查询</el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="search(0)">查询</el-button>
        </el-col>
      </el-row>
    </div>

    <!--排序-->
    <div class="sorttitle">
      <l-sort-label
        class="inline-block"
        label="处方号"
        state="2"
        @click="listsort('RECIPE_CODE')"
      ></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="科室"
        state="2"
        @click="listsort('DEPT_NAME')"
      ></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="总金额"
        state="2"
        @click="listsort('PRESCRIPTION_AMT')"
      ></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="收费时间"
        state="2"
        @click="listsort('r.CHARGE_TIME')"
      ></l-sort-label>
    </div>
    <!--表单-->
    <div class="infinite-list-wrapper" v-loading="tlm_isLoading">
      <div
        class="list-container overflow-scroll-vertical"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <div
          ref="recipeTable"
          :class="curSelectnub == i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in recipeTable"
          :key="i"
          @click="handleSelectedItem(i, item)"
        >
          <div class="item-label">
            <div class="repice-status">{{ showState[item.refundState] }}</div>
            <div class="repice-code" :title="item.recipeCode">
              {{ item.recipeCode }}
            </div>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">病人姓名</span>
            <span class="margin-right-10 minwidth">{{ item.patientName }}</span>
            <span class="label margin-right-6">性别</span>
            <span
              :val="item.patientGender"
              code="GENDER_CODE"
              v-codeTransform
            ></span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">年龄</span>
            <span class="margin-right-10 minwidth">{{ item.patientAge }}</span>
            <span class="label margin-right-6">总金额</span>
            <span>{{ formatNum(item.prescriptionAmt) }}元</span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">科室</span>
            <span class="margin-right-10 minwidth">{{ item.deptName }}</span>
            <span class="label margin-right-6">开单医生</span>
            <span>{{ item.doctorUserName }}</span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">收费人员</span>
            <span class="margin-right-10 minwidth">
              {{ item.chargeUserName }}
            </span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">收费时间</span>
            <span>{{ item.chargeTime }}</span>
          </div>
        </div>
        <p class="align-center" v-if="!tlm_isLoading && noMore">没有更多了</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";
import listSort from "@/mixins/drugLeftChange.js";
import mixin from "@/mixins/drugManagement.js";
import drugReadCard from "@/mixins/drugReadCard.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  mixins: [mixin, listSort, drugReadCard],
  data() {
    return {
      // 读卡返回的数据
      readCardData: {},
      showState: {
        "0": "申请未处理",
        "1": "申请已处理"
      },
      //定义搜索条件
      searchparam: {
        searchType: "",
        dispenseUserId: "",
        windowCode: "",
        date: "",
        queryValue: "",
        dateShow: false,
        inputShow: true,
        icShow: true,
        refundState: ""
      },

      //左侧表格数据源
      recipeTable: [],
      recipeUnit: [], //单页数据
      // 申请列表
      tlm_noMore: false,
      tlm_isLoading: false,
      loading: false, //左侧申请列表滑动加载状态
      curSelectnub: 0, // 当前选择单号下标
      selectData: {}, //传递给父组件 当前选中的id
      // 表格分页数据
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      orderBy: "r.CHARGE_TIME DESC"
    };
  },
  mounted() {
    this.searchparam.searchType = "0";
    this.search(0);
  },
  computed: {
    totalAll: function() {
      return Math.ceil(this.pagination.total / this.pagination.pageSize);
    },
    noMore() {
      return (
        Math.ceil(this.pagination.total / this.pagination.pageSize) <=
        this.pagination.pageNo
      );
    },
    disabled() {
      return this.tlm_isLoading || this.noMore;
    }
  },
  methods: {
    searchTypeFun() {
      this.searchparam.date = [];
      this.searchparam.queryValue = "";
    },
    formatNum(num) {
      return formatNum(num);
    },
    search(val) {
      // if (val !== 0) {
      //   this.searchparam.date = [];
      // }
      this.pagination.pageNo = 1;
      this.pagination.total = 0;
      if (val === 3) {
        this.CardReaderFetchData();
      } else {
        this.fetchData(val);
      }
    },
    async CardReaderFetchData() {
      try {
        this.tlm_isLoading = true;
        let param = {
          ...this.pagination,
          orderBy: this.orderBy
        };
        let dataParam = {};
        await this.readCard(async res => {
          console.log(`res-------`, res);
          if (!res.cardNum) {
            return;
          }
          param.patientCode = res.patientCode;
          this.searchparam.queryValue = res.cardNum;

        param = {
          ...param,
          ...dataParam
        };
        let response = await opha.listForRefund(param);
        console.log(`response-----------`, response);
        let { data } = response;
        if (response.code === 1) {
          if (this.pagination.pageNo === 1) {
            this.recipeTable = data;
            if (this.recipeTable[0]) {
              this.handleSelectedItem(0, this.recipeTable[0]);
            } else {
              this.handleSelectedItem(null, {});
            }
          } else {
            this.recipeTable = this.recipeTable.concat(data);
          }
          this.pagination = response.pageParams;
        }
        this.tlm_isLoading = false;
        });
      } catch (error) {
        console.log(error);
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    // eslint-disable-next-line complexity
    async fetchData(val) {
      try {
        this.tlm_isLoading = true;
        let param = {
          ...this.pagination,
          orderBy: this.orderBy
        };
        let dataParam = {};
        const nowTimeDate = new Date();
        if (val === 0) {
          // 查询
          if (this.searchparam.searchType === "0") {
            // 收费日期
            console.log(this.searchparam, "打印你好的册数数据");
            this.searchparam.date = this.searchparam.date
              ? this.searchparam.date
              : [];
            dataParam = {
              sChargeDate: this.searchparam.date[0]
                ? this.searchparam.date[0] + " 00:00:00"
                : "",
              eChargeDate: this.searchparam.date[1]
                ? this.searchparam.date[1] + " 23:59:59"
                : "",
              refundState: this.searchparam.refundState
            };
          } else if (this.searchparam.searchType === "1") {
            // 读卡
            if (this.searchparam.queryValue === "") {
              this.$message.warning("请输入患者卡号");
              this.tlm_isLoading = false;
              return;
            }
            let { data } = await opha.swipe({
              cardNum: this.searchparam.queryValue
            });
            if (typeof data === "undefined") {
              this.$message.error("查无此人");
              this.tlm_isLoading = false;
              return;
            }
            param.visitCodeList = data.visitCode;
          } else if (this.searchparam.searchType === "2") {
            // 收据号
            dataParam = {
              receiptNum: this.searchparam.queryValue,
              refundState: this.searchparam.refundState
            };
          } else if (this.searchparam.searchType === "3") {
            // 处方号
            dataParam = {
              recipeCode: this.searchparam.queryValue,
              refundState: this.searchparam.refundState
            };
          }
        } else if (val === 1) {
          // 本日
          param.sChargeDate = nowTimeDate.format("yyyy-MM-dd") + " 00:00:00";
          param.eChargeDate = nowTimeDate.format("yyyy-MM-dd") + " 23:59:59";
        } else if (val === 2) {
          // 往日
          param.eChargeDate =
            new Date(nowTimeDate.getTime() - 24 * 60 * 60 * 1000).format(
              "yyyy-MM-dd"
            ) + " 23:59:59";
        }
        param = {
          ...param,
          ...dataParam
        };
        let response = await opha.listForRefund(param);
        let { data } = response;
        if (response.code === 1) {
          if (this.pagination.pageNo === 1) {
            this.recipeTable = data;
            if (this.recipeTable[0]) {
              this.handleSelectedItem(0, this.recipeTable[0]);
            } else {
              this.handleSelectedItem(null, {});
            }
          } else {
            this.recipeTable = this.recipeTable.concat(data);
          }
          this.pagination = response.pageParams;
        }
        this.tlm_isLoading = false;
      } catch (error) {
        console.log(error);
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    //滑动加载更多信息
    load() {
      this.pagination.pageNo++;
      //获取分页列表
      this.fetchData(0);
    },

    //默认左侧第一项选择右侧渲染数据
    handleSelectedItem(i, item) {
      this.handleCurrentChange(item);
      this.curSelectnub = i;
      this.selectData = item;
      this.$emit("selectIdChange", this.selectData);
    }
  }
};
</script>
<style lang="scss" scoped>
.repice-code {
  font-size: 16px;
  font-weight: bold;
  margin-right: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.repice-status {
  float: right;
  color: $l-color-primary;
}
.el-card {
  position: relative;

  .padding20 {
    padding: 10px 20px;
  }

  .table-top {
    width: 100%;
    padding: 10px 10px 0;

    /deep/ .el-row {
      height: 36px;
    }

    .cardInput {
      width: 60%;
    }

    .refundState {
      margin-left: 3px;
    }

    .item-btn {
      color: $l-color-primary;
      border-color: $l-color-primary;
    }

    .ic {
      background-color: $l-color-fontcolor-1;
      border-color: $l-color-fontcolor-1;
    }

    .search-btn {
      .el-button {
        width: 100%;
      }

      .width150 {
        width: 159px;
        padding-right: 9px;

        .el-button {
          color: $l-color-primary;
          border-color: $l-color-primary;
        }
      }

      .width80 {
        width: 80px;
      }
    }
  }

  .sorttitle {
    background: $l-color-bgcolor-18;
    padding: 0 16px;

    .inline-block {
      margin-right: 5px;
    }
  }
  .infinite-list-wrapper {
    position: absolute;
    top: 153px;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  .list-container {
    height: 100%;

    .list-item {
      padding: 6px 14px;
      position: relative;

      .state {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .item-label {
        line-height: 28px;
        color: $l-color-fontcolor-3;
        overflow: hidden;
        .label {
          width: 56px;
          display: inline-block;
          color: $l-color-fontcolor-4;
          font-size: $l-font-size;
          white-space: nowrap;
        }

        .minwidth {
          min-width: 80px;
          display: inline-block;
        }
      }
    }

    .list-item:nth-child(even) {
      background: $l-color-bgcolor-18;
    }

    .active {
      background-color: $l-color-bgcolor-12 !important;
    }
  }
}
.align-center {
  text-align: center;
  padding: 5px 0;
}
</style>
