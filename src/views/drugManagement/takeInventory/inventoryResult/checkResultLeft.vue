<template>
  <el-card class="height100">
    <div ref="top" style="padding:8px;">
      <!--标题-->
      <l-card-title style="padding-bottom:8px;">
        <span slot="left">盘存单查询</span>
      </l-card-title>
      <!--筛选条件-->
      <l-formt-title label="开始时间" labelWidth="64" style="margin-bottom:8px;">
        <el-date-picker
          style="width:100%"
          clearable
          v-model="formSearch.entryTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </l-formt-title>
      <l-formt-title label="盘存状态" labelWidth="64">
        <el-select v-model="formSearch.recordStatus" clearable placeholder="请选择">
          <el-option
            v-for="item in Loptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </l-formt-title>
      <l-formt-title label="盘存库房" labelWidth="64" style=";margin-top: 8px">
        <el-select v-model="formSearch.storageCode" clearable placeholder="请选择">
          <el-option
            v-for="item in drugStorageList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </l-formt-title>
      <l-formt-title label="盘存单号" labelWidth="64" style=";margin-top: 8px">
        <el-input placeholder="请输入内容" v-model="formSearch.takeStockNo" clearable></el-input>
      </l-formt-title>
      <div class="clearFloat">
        <div class="float-left" style="font-size:0;">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
          <el-button type="primary" plain @click="del">删除</el-button>
        </div>
      </div>
    </div>
    <!--排序-->
    <div class="sort-container">
      <l-sort-label class="inline-block" label="盘存单号" state="2" @click="listsort('TAKE_STOCK_NO')"></l-sort-label>
      <l-sort-label class="inline-block" label="开始时间" state="2" @click="listsort('START_TIME')"></l-sort-label>
      <l-sort-label class="inline-block" label="结束时间" state="2" @click="listsort('STOP_TIME')"></l-sort-label>
    </div>
    <!--列表-->
    <div class="infinite-list-wrapper">
      <div
        v-loading="loading"
        class="list-container overflow-scroll-vertical"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <div
          :class="curSelectedIndex == i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in applyList"
          :key="i"
          @click="clickItemHandle(item, i)"
        >
          <div class="drugName">{{ item.drugName }}</div>
          <div class="item-label">
            <div class="status">{{ recordStatusObj[item.recordStatus] }}</div>
            <el-row>
              <el-col :span="24">
                <span class="label">盘存单号</span>
                <span>{{ item.takeStockNo }}</span>
              </el-col>
              <!-- <el-col :span="12">
                <span class="label margin-left-6">盘亏金额</span>
                <span>{{ item.money }}</span>
              </el-col>-->
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="label">开始时间</span>
                <span>{{ item.startTime }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="label">结束时间</span>
                <span>{{ item.stopTime }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="label">盘存设置人员</span>
                <span>{{ item.startUserName }}</span>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="24">
                <span class="label">盘存状态</span>
                <span>{{ recordStatusObj[item.recordStatus] }}</span>
              </el-col>
            </el-row>-->
          </div>
        </div>
        <!-- <p v-if="loading" class="bottom-container">加载中...</p> -->
        <p v-if="!loading && noMore" class="bottom-container">没有更多了</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import stockApi from "@/api/hmm/stock";
import mixin from "@/mixins/drugTools.js";
import listSort from "@/mixins/drugLeftChange.js";

export default {
  name: "left",
  mixins: [mixin, listSort],
  data() {
    return {
      selectId: "",
      Lvalue: "0",
      Nvalue: "0",
      Loptions: [
        {
          value: "0",
          label: "盘存开始"
        },
        {
          value: "1",
          label: "盘存锁定"
        },
        {
          value: "2",
          label: "作废"
        },
        {
          value: "3",
          label: "结束"
        }
      ],
      recordStatusObj: {
        "0": "盘存开始",
        "1": "盘存锁定",
        "2": "作废",
        "3": "结束"
      },
      formSearch: {
        takeStockNo: "", // 单号
        entryTime: [],
        storageCode: "", // 药库
        recordStatus: "" // 提交状态
      },
      curSelectedIndex: 0, // 当前选择单号下标
      applyList: [], // 申请列表
      loading: false, //左侧申请列表滑动加载状态
      pageParams: {
        pageNo: 0,
        pageSize: 10,
        total: 5
      },
      // 排序
      orderBy: "TAKE_STOCK_NO DESC"
    };
  },
  computed: {
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    disabled() {
      // 滑动加载组件禁用状态
      return this.loading || this.noMore;
    }
  },
  methods: {
    clickItemHandle(item, i) {
      this.curSelectedIndex = i;
      this.selectId = item;
      this.$emit("selectIdChange", this.selectId);
    },
    starsHandleClick(item) {
      item.isStartOn = !item.isStartOn;
    },
    starsCls(isStartOn) {
      return {
        normal: true,
        "el-icon-star-on": Boolean(isStartOn),
        selected: Boolean(isStartOn),
        "el-icon-star-off": !isStartOn
      };
    },
    load() {
      this.loading = true;
      this.pageParams.pageNo++;
      stockApi
        .getInventoryList({
          ...this.pageParams,
          ...this.formSearch,
          sDate:
            this.formSearch.entryTime && this.formSearch.entryTime[0]
              ? this.formSearch.entryTime[0] + " 00:00:00"
              : "",
          eDate:
            this.formSearch.entryTime && this.formSearch.entryTime[1]
              ? this.formSearch.entryTime[1] + " 23:59:59"
              : "",
          orderBy: this.orderBy
        })
        .then(res => {
          if (res.code === 1) {
            if (this.pageParams.pageNo === 1) {
              this.clickItemHandle(res.data[0], 0);
              this.applyList = res.data;
            } else {
              this.applyList = this.applyList.concat(res.data);
            }
            this.pageParams = res.pageParams;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 查询
    search() {
      this.pageParams.pageNo = 0;
      this.load();
    },
    // 清空查询条件
    reset() {
      for (let i in this.formSearch) {
        this.$set(this.formSearch, i, "");
      }
    },
    async del() {
      try {
        this.$showLoading();
        if (this.selectId && !this.selectId.id) {
          this.$message.error("请选择盘存单");
          this.$hideLoading();
          return;
        }
        if (this.selectId.recordStatus !== '2') {
          this.$message.error("只有作废记录才能删除");
          this.$hideLoading();
          return;
        }
        let {
          data
        } = await stockApi.inventoryDel(this.selectId.id);
        this.$message.success(data);
        this.search();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.el-card {
  position: relative;
  .padding20 {
    padding: 10px 20px;
  }

  .clearFloat {
    margin-top: 7px;
    overflow: hidden;

    & > div {
      width: 295px;
    }

    .button {
      width: 80px;
      height: 36px;
      margin-left: 10px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 500;
      color: $l-color-white;
    }

    .reset {
      background: $l-color-white;
      color: $l-color-primary;
      border-color: $l-color-primary;
    }
  }

  .sort-container {
    background: $l-color-bgcolor-18;
    padding: 0 16px;

    .inline-block {
      margin-right: 2px;
    }
  }

  .list-container {
    position: absolute;
    top: 275px;
    left: 0;
    width: 100%;
    bottom: 0;
    overflow-y: auto;

    .list-item {
      padding: 6px 14px;
      position: relative;

      .state {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .item-label {
        position: relative;
        line-height: 28px;
        font-weight: 400;
        font-size: 14px;
        color: $l-color-fontcolor-3;
        .el-row {
          width: calc(100% - 65px);
          .el-col {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .status {
          position: absolute;
          right: 0;
          top: 0;
          font-weight: bold;
        }
        .label {
          font-size: $l-font-size;
          font-weight: 400;
          color: $l-color-fontcolor-4;
          line-height: 20px;
        }
      }

      .selected {
        color: $l-color-primary !important;

        font-size: 20px;
      }

      .normal {
        color: $l-color-bgcolor-11;
        font-size: 20px;
        cursor: pointer;
      }

      .drugName {
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        line-height: 32px;
      }
    }

    .list-item:nth-child(even) {
      background: $l-color-bgcolor-18;
    }

    .active {
      background-color: $l-color-bgcolor-12 !important;
    }
  }
  .bottom-container {
    text-align: center;
    padding: 10px 0;
  }
}
</style>
