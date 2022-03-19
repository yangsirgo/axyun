<template>
  <el-card class="height100">
    <div style="padding:0 20px 10px 20px" ref="top">
      <!--标题-->
      <el-col class="cardTitleStyle">
        <l-card-title>
            <span slot="left">出库单号列表</span>
        </l-card-title>
      </el-col>
      <!--筛选条件-->
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="录入日期" labelWidth="64">
            <el-date-picker
              style="width:100%"
              clearable
              v-model="formSearch.entryTime"
              format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="出库部门">
            <el-select clearable v-model="formSearch.storageCode" placeholder>
              <el-option
                v-for="item in drugStorageList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="出库方式">
            <el-select clearable v-model="formSearch.outType" placeholder>
              <el-option
                v-for="item in outTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="出库单号" labelWidth="64">
            <el-input v-model="formSearch.outInventoryNum" placeholder></el-input>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="确认状态">
            <el-select v-model="formSearch.statuses" placeholder>
              <el-option label="全部" value="1,2"></el-option>
              <el-option label="待确认" value="1"></el-option>
              <el-option label="已确认" value="2"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:5px">
        <el-col>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="formSearchReset">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <!--排序-->
    <div class="sort-container">
      <l-sort-label
        class="inline-block"
        label="出库单号"
        state="2"
        @click="listsort('OUT_INVENTORY_NUM')"
      ></l-sort-label>
      <l-sort-label class="inline-block" label="提交状态" state="2" @click="listsort('STATUS')"></l-sort-label>
      <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('ENTRY_TIME')"></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="提交时间"
        state="2"
        @click="listsort('SUBMIT_PERSON_TIME')"
      ></l-sort-label>
    </div>

    <!--列表-->
    <div class="infinite-list-wrapper" v-loading="loading">
      <div
        class="list-container overflow-scroll-vertical"
        v-infinite-scroll="loadNextPage"
        :infinite-scroll-disabled="listDisabled"
      >
        <div
          :class="curSelectedIndex == i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in wareConfimList"
          :key="i"
          @click="curSelectedWareConfim(i, item)"
        >
          <div class="item-label">
            <span class="rep">{{ item.outInventoryNum}}</span>
            <div class="status">{{ statusShow[item.status] }}</div>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">类型</span>
            <span
              class="float-left margin-right-10 minwidth"
            >{{codeToText(item.outType, outTypeList)}}</span>
            <span class="label margin-right-10">总金额</span>
            <span>{{ formatNum(item.totalAmt) }}元</span>
          </div>
          <div class="item-label">
            <el-row>
              <el-col :span="12">
                <span class="label margin-right-6">录入人员</span>
                <span class="margin-right-10 minwidth">{{ item.entryPersonName }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label margin-right-6">时间</span>
                <span>{{ item.entryTimeShow }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="item-label">
            <el-row>
              <el-col :span="12">
                <span class="label margin-right-6">提交人员</span>
                <span class="margin-right-10 minwidth">{{ item.submitPersonName }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label margin-right-6">时间</span>
                <span>{{ item.submitPersonTimeShow }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- <p v-if="loading" class="load-list-bottom">{{ $t("base.loading") }}</p> -->
        <p v-if="!loading && noMore" class="load-list-bottom">{{ $t("base.noMore") }}</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import stock from "@/api/hmm/stock";
import { localCodeTransform } from "@/utils/util";
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins/drugGetStorage.js";
import listSort from "@/mixins/drugLeftChange.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  props: {
    drugStorageList: {
      type: Array
    },
    outTypeList: {
      type: Array
    }
  },
  mixins: [mixin, listSort],
  data() {
    return {
      formSearch: {
        entryTime: "", //
        storageCode: "", // 出库部门
        outType: "", // 出库方式
        outInventoryNum: "", // 单号
        statuses: "1,2"
      },
      statusShow: {
        "1": "待确认",
        "2": "已确认"
      },
      curSelectedIndex: 0, // 当前选择单号下标
      wareConfimList: [], // 申请列表
      loading: false, //左侧申请列表滑动加载状态
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 10 // 每页数据条数
      },
      orderBy: "UPDATED_AT DESC",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    listDisabled() {
      return this.loading || this.noMore;
    },
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    getLeftlist() {
      this.loading = true;
      let queryData = { ...this.pageParams };
      queryData.orderBy = this.orderBy;
      queryData.sDate =
        this.formSearch.entryTime && this.formSearch.entryTime[0]
          ? this.formSearch.entryTime[0] + " 00:00:00"
          : ""; //开始日期
      queryData.eDate =
        this.formSearch.entryTime && this.formSearch.entryTime[1]
          ? this.formSearch.entryTime[1] + " 23:59:59"
          : ""; //结束日期
      queryData.storageCode = this.formSearch.storageCode; //采购药库
      queryData.type = this.formSearch.outType || ""; //单据状态
      queryData.num = this.formSearch.outInventoryNum; //采购单号
      queryData.types = "0,1";
      queryData.statuses = this.formSearch.statuses;
      queryData.deptCode = this.Params_storageCode;
      stock
        .getWareConfimList(queryData)
        .then(res => {
          this.loading = false;
          if (res.code == 1) {
            let leftData = { ...res };
            this.pageParams.total = leftData.total;
            this.pageParams.pageNo = leftData.pageNo;
            this.pageParams.pageSize = leftData.pageSize;
            let list = res.data.map(item => {
              let estr = item.entryTime ? item.entryTime.split(":") : "";
              let sstr = item.submitPersonTime
                ? item.submitPersonTime.split(":")
                : "";
              return {
                ...item,
                entryTimeShow: estr ? estr[0] + ":" + estr[1] : estr,
                submitPersonTimeShow: sstr ? sstr[0] + ":" + sstr[1] : sstr
              };
            });
            if (this.pageParams.pageNo === 1) {
              this.wareConfimList = list;
              this.curSelectedWareConfim(0, this.wareConfimList[0] || {});
            } else {
              this.wareConfimList = this.wareConfimList.concat(list);
            }
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "出库单查询失败");
        });
    },
    search() {
      // 搜索;
      this.wareConfimList = this.$options.data().wareConfimList;
      this.pageParams.pageNo = 1;
      this.getLeftlist();
    },

    // 筛选条件重置
    formSearchReset() {
      this.formSearch = this.$options.data().formSearch;
    },
    //默认左侧第一项选择右侧渲染数据
    curSelectedWareConfim(i, item) {
      if (!item) {
        return;
      }
      this.changeLeftItemData(item);
      this.curSelectedIndex = i;
      this.$emit("selectIdChange", item);
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getLeftlist();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  position: relative;
  .cardTitleStyle{
    padding: 8px 0px;
  }
  .padding20 {
    padding: 10px 20px;
  }

  .sort-container {
    background: $l-color-bgcolor-18;
    padding: 0 5px;

    .inline-block {
      margin-right: 2px;
    }
  }

  .infinite-list-wrapper {
    position: absolute;
    top: 316px;
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
        position: relative;
        line-height: 28px;
        color: $l-color-fontcolor-3;
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
        .status {
          position: absolute;
          right: 0;
          top: 0;
          color: $l-color-primary;
        }
        .label {
          float: left;
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
</style>
