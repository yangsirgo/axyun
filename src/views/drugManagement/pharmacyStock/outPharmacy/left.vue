<template>
  <el-card class="height100">
    <div class="padding20" ref="top">
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
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row :gutter="6" style="margin-bottom:5px">
        <el-col :span="12">
          <l-formt-title label="类型">
            <el-select clearable v-model="formSearch.outType" placeholder="请选择">
              <el-option
                v-for="item in outTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="12">
          <l-formt-title label="状态">
            <el-select v-model="formSearch.status" placeholder="请选择">
              <el-option
                v-for="item in recordStatusList"
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
          <l-formt-title label="出库目标" labelWidth="64">
            <el-select v-model="formSearch.deptCode" placeholder="请选择">
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
          <l-formt-title label="申请单号" labelWidth="64">
            <el-input v-model="formSearch.outInventoryNum" placeholder="请输入"></el-input>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:5px">
        <el-col>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
          <el-button @click="newAdd" type="primary">新增出库单</el-button>
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
      <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('ENTRY_TIME')"></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="提交时间"
        state="2"
        @click="listsort('SUBMIT_PERSON_TIME')"
      ></l-sort-label>
    </div>

    <!--列表-->
    <div class="infinite-list-wrapper">
      <div
        class="list-container overflow-scroll-vertical"
        v-loading="loading"
        v-infinite-scroll="loadNextPage"
        :infinite-scroll-disabled="listDisabled"
      >
        <div
          :class="curSelectedIndex === i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in outPharmacyList"
          :key="i"
          @click="handleChange(i, item)"
        >
          <div :class="item.status == 1 ? 'status' : 'status status-active'">
            <!-- {{item.status == 0?'未提交':'已提交'}} -->
            {{ statusCodeToText(item.status) }}
            <span
              v-show="item.status == 0"
              style="font-size:14px;color:#949da3;"
            >&nbsp; | &nbsp;</span>
            <span
              class="delicon"
              v-show="item.status == 0"
              @click="delItem(item)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </div>
          <div class="item-label">
            <span class="req">{{ item.outInventoryNum }}</span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">出库类型</span>
            <span
              class="margin-right-10 float-left minwidth"
            >{{ codeToText(item.outType, outTypeList) }}</span>
            <template v-if="item.outType !== '2'">
              <span class="label margin-right-6">出库目标</span>
              <span>{{ item.deptName || "--"}}</span>
            </template>
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
import listSort from "@/mixins/drugLeftChange.js";
import mixin from "@/mixins/drugGetStorage.js";

export default {
  mixins: [mixin, listSort],
  props: {
    drugStorageList: {
      type: Array
    },
    outTypeList: {
      type: Array
    },
    recordStatusList: {
      type: Array
    }
  },
  data() {
    return {
      formSearch: {
        outInventoryNum: "", // 单号
        entryTime: "", //
        outType: "", // 药库
        status: "", // 提交状态
        deptCode: "" // 出库目标
      },
      pageParams: {
        pageNo: 0, // 当前页数
        total: 0, // 总共条数
        pageSize: 20 // 每页数据条数
      },
      curSelectedIndex: 0, // 当前选择单号下标
      outPharmacyList: [], // 申请列表
      loading: false, //左侧申请列表滑动加载状态
      orderBy: "UPDATED_AT DESC", //按时间倒序
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
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    statusCodeToText(code) {
      if (code == 0) {
        return "未提交";
      } else if (code == 1) {
        return "已提交";
      } else if (code == 2) {
        return "目标库房已确认";
      }
      return "";
    },
    //页面初始化搜索
    getLeftlist() {
      // 搜索;
      let queryData = {
        ...this.pageParams,
        orderBy: this.orderBy,
        sDate:
          this.formSearch.entryTime && this.formSearch.entryTime[0]
            ? this.formSearch.entryTime[0] + " 00:00:00"
            : "",
        eDate:
          this.formSearch.entryTime && this.formSearch.entryTime[1]
            ? this.formSearch.entryTime[1] + " 23:59:59"
            : "",
        status: this.formSearch.status,
        type: this.formSearch.outType || "",
        num: this.formSearch.outInventoryNum,
        storageCode: this.Params_storageCode,
        deptCode: this.formSearch.deptCode
      };
      this.loading = true;
      stock
        .getOutStockList(queryData)
        .then(res => {
          this.loading = false;
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
            this.outPharmacyList = list;
            this.handleSelectedItem(0, this.outPharmacyList[0] || {});
          } else {
            this.outPharmacyList = this.outPharmacyList.concat(list);
          }
        })
        .catch(res => {
          this.loading = false;
          this.$message.error(res.msg || "出库单查询失败");
        });
    },
    // 左侧边栏操作
    search() {
      // 搜索;
      this.outPharmacyList = this.$options.data().outPharmacyList;
      this.pageParams.pageNo = 1;
      this.getLeftlist();
    },
    reset() {
      // 筛选条件重置
      this.formSearch = {
        outInventoryNum: "", // 单号
        startDate: "", // 开始日期
        endDate: "", // 结束日期
        outType: "", // 药库
        status: "", // 提交状态
        deptCode: "" // 出库目标
      };
    },
    //默认左侧第一项选择右侧渲染数据
    handleSelectedItem(i, item) {
      this.curSelectedIndex = i;
      this.$emit("selectIdChange", item);
    },
    newAdd() {
      this.$emit("newAdd");
      this.curSelectedIndex = null;
    },
    handleChange(index, item) {
      this.curSelectedIndex = index;
      this.$emit("selectIdChange", item);
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getLeftlist();
    },
    delItem(item, index) {
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前出库单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stock
            .deleteOutStockList(item.id)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.search();
                this.$message.success(res.msg || "删除出库单成功!");
              } else {
                this.$message.error(res.msg || "删除出库单失败");
              }
            })
            .catch(res => {
              done();
              this.$hideLoading();
              this.$message.error(res.msg || "删除出库单失败");
            });
        }
      });
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

  .clearFloat {
    margin-top: 7px;
    overflow: hidden;

    & > div {
      width: 195px;
    }

    .button {
      width: 80px;
      height: 36px;
      margin-right: 10px;
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
      margin-left: 0px;
    }
  }

  .sort-container {
    background: $l-color-bgcolor-18;
    padding: 0 16px;

    .inline-block {
      margin-right: 2px;
    }
  }

  .infinite-list-wrapper {
    position: absolute;
    top: 290px;
    left: 0;
    width: 100%;
    bottom: 0;
    .list-container {
      height: 100%;
    }
    .list-item {
      padding: 6px 14px;
      position: relative;

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
        .label {
          float: left;
          white-space: nowrap;
          color: $l-color-fontcolor-4;
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
}
</style>
