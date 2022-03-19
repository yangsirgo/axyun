<template>
  <el-card class="height100">
    <el-row style="padding:8px;">
      <!-- 左侧title -->
      <!-- <el-col :span="24"> -->
        <l-card-title>
          <span slot="left">退货单号列表</span>
        </l-card-title>
      <!-- </el-col> -->
    </el-row>
    <!-- 左侧搜索条件 -->
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
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
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="供应商" labelWidth="64">
          <Supplier clearable :value.sync="formSearch.supplierCode" />
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="状态选择" labelWidth="64">
          <el-select clearable v-model="formSearch.status" placeholder="请选择">
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
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="退货单号" labelWidth="64">
          <el-input v-model="formSearch.num"></el-input>
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px;display:flex;">
      <!-- 搜索及重置按钮 -->
      <!-- <el-col :span="6"> -->
        <el-button type="primary" size="small" @click="search" style="width:calc(33% - 4px)">查询</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="6"> -->
        <el-button type="primary" size="small" plain @click="reset" style="width:calc(33% - 4px)">重置</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="12" style="text-align: right;"> -->
        <el-button style="width:calc(34% - 4px)"
          type="primary"
          size="small"
          @click="newAdd"
          v-hotKey="{ func: 'func_add1' }"
        >新建退货单</el-button>
      <!-- </el-col> -->
    </el-row>

    <!--排序-->
    <div class="sorttitle">
      <l-sort-label class="inline-block" label="退货单号" state="2" @click="listsort('BACK_NUM')"></l-sort-label>
      <!-- <l-sort-label class="inline-block" label="类型" state="2" @click="listsort('key2')"></l-sort-label>
      <l-sort-label class="inline-block" label="提交状态" state="2" @click="listsort('key3')"></l-sort-label>-->
      <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('ENTRY_TIME')"></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="提交时间"
        state="2"
        @click="listsort('SUBMIT_PERSON_TIME')"
      ></l-sort-label>
    </div>
    <!--左侧表单-->
    <div class="infinite-list-wrapper" v-loading="loading">
      <div
        class="list-container overflow-scroll-vertical"
        v-infinite-scroll="loadNextPage"
        infinite-scroll-disabled="listDisabled"
      >
        <div
          :class="curSelectedIndex == i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in returnList"
          :key="i"
          @click="handleSelectedItem(i, item)"
        >
          <!--申请单状态-->
          <div :class="item.status == 1 ? 'status' : 'status status-active'">
            <span>{{ item.status == 0 ? "未提交" : "已提交" }}</span>
            <span class="delicon" v-show="item.status == 0" style="font-size:14px;">&nbsp; | &nbsp;</span>
            <span class="delicon" v-show="item.status == 0" @click="delItem(item, i)">
              <i class="filter-item iconfont iconshanchu"></i>
            </span>
          </div>
          <el-row class="item-label">
            <el-col :span="24">
              <span class="rep">{{ item.backNum }}</span>
            </el-col>
          </el-row>
          <el-row class="item-label">
            <el-col class="overflow-point">
              <span class="label margin-right-6">供 应 商:</span>
              <span
                class="label2 overflow-point"
                :val="item.supplierCode"
                code="DrugSupplier"
                v-codeTransform
              ></span>
            </el-col>
          </el-row>
          <el-row class="item-label">
            <el-col>
              <span class="label margin-right-6">总 金 额:</span>
              <span>{{ formatNum(item.totalAmt) }}元</span>
            </el-col>
          </el-row>
          <el-row class="item-label">
            <el-col :span="12">
              <span class="label margin-right-6">录入人员:</span>
              <span class="margin-right-10">{{ item.entryPersonName }}</span>
            </el-col>
            <el-col :span="12">
              <span class="label margin-right-6">时间:</span>
              <span>{{ item.entryTimeShow }}</span>
            </el-col>
          </el-row>
          <el-row class="item-label">
            <el-col :span="12">
              <span class="label margin-right-6">提交人员:</span>
              <span class="margin-right-10">{{ item.submitPersonName }}</span>
            </el-col>
            <el-col :span="12">
              <span class="label margin-right-6">时间:</span>
              <span>{{ item.submitPersonTimeShow }}</span>
            </el-col>
          </el-row>
        </div>
        <!-- <p v-if="loading" class="load-list-bottom">{{ $t("base.loading") }}</p> -->
        <p v-if="!loading && noMore" class="load-list-bottom">{{ $t("base.noMore") }}</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import stockReturn from "@/api/drugStorage/stock/renturn";
import { localCodeTransform } from "@/utils/util";
import listSort from "@/mixins/drugLeftChange.js";
import formatNum from "@/utils/formatPrice.js";
import Supplier from "@/views/drugManagement/drugstock/purchase/component/supplier.vue";

export default {
  mixins: [listSort],
  components: {
    Supplier
  },
  props: {
    recordStatusList: {
      type: Array
    },
    supplierList: {
      type: Array
    }
  },
  data() {
    return {
      formSearch: {
        num: "", //单号
        entryTime: [], //录入时间
        supplierCode: "", //供应商名称
        status: "" //单据状态
      },
      curSelectedIndex: 0, // 当前选择单号下标
      returnList: [], // 退回单列表
      loading: false, //左侧申请列表滑动加载状态
      pageParams: {
        pageNo: 0, // 当前页数
        total: 0, // 总共条数
        pageSize: 20 // 每页数据条数
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
  mounted() {
    this.search();
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    //左侧列表
    getLeftlist() {
      this.loading = true;
      let params = { ...this.pageParams };
      params.sDate =
        this.formSearch.entryTime && this.formSearch.entryTime[0]
          ? this.formSearch.entryTime[0] + " 00:00:00"
          : ""; //开始日期
      params.eDate =
        this.formSearch.entryTime && this.formSearch.entryTime[1]
          ? this.formSearch.entryTime[1] + " 23:59:59"
          : ""; //结束日期
      params.status = this.formSearch.status || ""; //单据状态
      params.supplierCode = this.formSearch.supplierCode;
      params.num = this.formSearch.num;
      params.orderBy = this.orderBy;
      stockReturn
        .getBackStockList(params)
        .then(res => {
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
            this.returnList = list;
            this.handleSelectedItem(0, this.returnList[0] || {});
          } else {
            this.returnList = this.returnList.concat(list);
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error.msg);
        });
    },

    search() {
      // 搜索;
      this.returnList = this.$options.data().returnList;
      this.pageParams.pageNo = 1;
      this.getLeftlist();
    },
    reset() {
      this.formSearch = this.$options.data().formSearch;
      this.getLeftlist();
    },
    newAdd() {
      this.$emit("newAdd");
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getLeftlist();
    },
    //默认左侧第一项选择右侧渲染数据
    handleSelectedItem(i, item) {
      this.curSelectedIndex = i;
      this.$emit("selectIdChange", item);
    },
    //左侧采购单删除
    delItem(item, index) {
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前退货单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stockReturn
            .deleteBackStockList(item.id)
            .then(res => {
              if (res.code === 1) {
                this.search();
                this.$message({
                  type: "success",
                  message: "删除退货单成功!"
                });
              } else {
                this.$message.error(res.msg || "删除退货单失败");
              }
              this.$hideLoading();
              done();
            })
            .catch(res => {
              this.$hideLoading();
              done();
              this.$message.error(res.msg || "删除退货单失败");
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

  .padding20 {
    padding: 10px 20px;
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
    top: 279px;
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
          color: $l-color-fontcolor-4;
          font-size: $l-font-size;
          white-space: nowrap;
        }
        .label2 {
          float: left;
          width: 230px;
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
