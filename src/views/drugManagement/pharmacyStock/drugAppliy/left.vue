<template>
  <el-card class="height100" ref="page1">
    <div style="padding:0 20px 10px 20px" ref="top">
      <!--标题-->
      <el-col class="cardTitleStyle">
        <l-card-title>
          <span slot="left">申请单号列表</span>
        </l-card-title>
      </el-col>
      <!--查询条件-->
      <!--录入日期-->
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
      <el-row style="margin-bottom:5px;">
        <el-col>
          <l-formt-title label="申请类型">
            <el-select v-model="formSearch.type" placeholder="请选择">
              <el-option
                v-for="item in applyTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>
      <!--目标药库-->
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="目标药库">
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
      <!-- 提交状态 -->
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="提交状态" labelWidth="64">
            <el-select clearable v-model="formSearch.status" placeholder>
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
      <!-- 申请单号 -->
      <el-row style="margin-bottom:5px">
        <el-col>
          <l-formt-title label="申请单号" labelWidth="64">
            <el-input v-model="formSearch.applyNum" placeholder></el-input>
          </l-formt-title>
        </el-col>
      </el-row>
      <!-- 查询，重置按钮 -->
      <el-row style="margin-bottom:5px">
        <el-col :span="6">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" plain @click="formSearchReset">重置</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button @click="newAdd" type="primary" v-hotKey="{ func: 'func_add1' }">新增申请单</el-button>
        </el-col>
      </el-row>
    </div>

    <!--排序-->
    <div class="sort-container">
      <l-sort-label class="inline-block" label="申请单号" state="2" @click="listsort('APPLY_NUM')"></l-sort-label>
      <l-sort-label class="inline-block" label="提交状态" state="2" @click="listsort('STATUS')"></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="录入时间"
        state="2"
        @click="listsort('SUBMIT_PERSON_TIME')"
      ></l-sort-label>
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
          :class="curSelectedIndex === i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in applyList"
          :key="i"
          @click="handleSelectedItem(i, item)"
        >
          <!--申请单状态-->
          <div :class="item.status == 1 ? 'status' : 'status status-active'">
            <!-- {{item.status == 0?'未提交':'已提交'}} -->
            {{ statusCodeToText(item.status) }}
            <span
              v-show="item.status == 0"
              style="font-size:14px;color:#949da3;"
            >&nbsp; | &nbsp;</span>

            <span class="delicon" v-show="item.status == 0" @click="delItem(item, i)">
              <i class="filter-item iconfont iconshanchu"></i>
            </span>
          </div>
          <div class="item-label">
            <!--<span class="label margin-right-6">申请单号:</span>-->
            <span class="rep">{{item.applyNum}}</span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">申请药库</span>
            <span>{{ codeToText(item.storageCode, drugStorageList) }}</span>
          </div>
          <div class="item-label">
            <el-row>
              <el-col :span="12">
                <span class="label margin-right-6">录入人员</span>
                <span class="margin-right-10 minwidth">{{item.entryPersonName}}</span>
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
                <span class="margin-right-10 minwidth">{{item.submitPersonName}}</span>
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
import { localCodeTransform } from "@/utils/util";
import stock from "@/api/hmm/stock";
import listSort from "@/mixins/drugLeftChange.js";

export default {
  mixins: [listSort],
  props: {
    recordStatusList: {
      type: Array
    },
    applyTypeList: {
      type: Array
    },
    drugStorageList: {
      type: Array
    }
  },
  data() {
    return {
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 10 // 每页数据条数
      },
      formSearch: {
        applyNum: "", // 单号
        entryTime: "",
        status: "", // 提交状态
        storageCode: "", // 药库
        type: "" // 申请类型
      },
      curSelectedIndex: 0, // 当前选择单号下标:
      newStatus: "",
      applyList: [], // 申请列表
      loading: false, //左侧申请列表滑动加载状态
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
  created() {
    this.search();
  },
  updated() {
    this.$nextTick(() => {
      this.maxHeight = this.$refs.page1.clientHeight - 270;
    });
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
        return "药库已保存";
      } else if (code == 3) {
        return "药库已提交";
      }
      return "";
    },
    //页面初始化搜索
    getApplyList() {
      this.loading = true;
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
        num: this.formSearch.applyNum,
        status: this.formSearch.status,
        storageCode: this.formSearch.storageCode,
        type: this.formSearch.type
      };

      stock
        .getApplyList(queryData)
        .then(res => {
          this.loading = false;
          if (res.code == 1) {
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
              this.applyList = list;
              this.handleSelectedItem(0, this.applyList[0] || {});
            } else {
              this.applyList = this.applyList.concat(list);
            }
          } else {
            this.$message.error(res.msg || "获取申请单数据失败");
          }
          this.pageParams = res.pageParams;
        })
        .catch(res => {
          this.loading = false;
          this.$message.error(res.msg || "申请单查询失败");
        });
    },
    // 筛选条件重置
    formSearchReset() {
      this.formSearch = this.$options.data().formSearch;
      this.pageParams.pageNo = 1;
      this.pageParams.pageSize = 10;
      this.getApplyList();
    },
    search() {
      this.applyList = this.$options.data().applyList;
      this.pageParams.pageNo = 1;
      this.getApplyList();
    },
    newAdd() {
      stock
        .getCurrPharmacy()
        .then(res => {
          if (res.code === 1) {
            if (res.data.applyPermit === "1") {
              this.curSelectedIndex = "";
              this.$emit("newAdd");
              this.$emit("selectIdChange", {});
            } else {
              this.$message.warning("当前药房不能申请药品!");
            }
          } else {
            this.$message.error(res.msg || "获取药房申请药品权限失败!");
          }
        })
        .catch(err => {
          this.$message.error(err.msg || "获取药房申请药品权限失败!");
        });
    },
    //默认左侧第一项选择右侧渲染数据
    handleSelectedItem(index, item) {
      this.curSelectedIndex = index;
      this.$emit("selectIdChange", item);
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getApplyList();
    },

    //左侧申请单删除
    delItem(item, index) {
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前申请单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stock
            .delApply(item.id)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code == 1) {
                this.search();
                this.$message.success(res.msg || "删除申请单成功!");
              } else {
                this.$message.error(res.msg || "删除申请单失败");
              }
            })
            .catch(res => {
              done();
              this.$hideLoading();
              this.$message.error(res.msg || "删除申请单失败");
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
  .sort-container {
    background: $l-color-bgcolor-18;
    padding: 0 5px;

    .inline-block {
      margin-right: 2px;
    }
  }
  .infinite-list-wrapper {
    position: absolute;
    top:316px;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  .list-container {
    height: 100%;

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
