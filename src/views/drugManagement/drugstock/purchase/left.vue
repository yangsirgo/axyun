<template>
  <el-card class="height100">
    <el-row style="padding:8px;">
      <!-- <el-col :span="24"> -->
        <l-card-title>
          <span slot="left">采购单号列表</span>
        </l-card-title>
      <!-- </el-col> -->
    </el-row>

    <!--搜索条件 -->
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
        <!-- 录入日期 -->
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
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
        <!--采购药库  -->
        <l-formt-title label="采购药库" labelWidth="64" >
          <el-select clearable v-model="formSearch.storageCode" disabled placeholder="请选择">
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
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
        <!-- 单据状态 -->
        <l-formt-title label="单据状态" labelWidth="64">
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
      <el-col :span="24">
        <!--供应商  -->
        <l-formt-title label="供应商" labelWidth="64">
          <Supplier clearable :value.sync="formSearch.supplierCode" />
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
        <!-- 采购单号 -->
        <l-formt-title label="采购单号" labelWidth="64">
          <el-input v-model="formSearch.purchaserNum"></el-input>
        </l-formt-title>
      </el-col>
    </el-row>

    <!-- 搜索按钮 重置按钮 -->
    <el-row style="padding:0 8px;margin-bottom:8px;display:flex;">
      <!-- <el-col :span="6"> -->
        <el-button type="primary" size="small" @click="search('manual')" style="width:calc(33% - 4px)">查询</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="6"> -->
        <el-button type="primary" size="small" plain @click="formSearchReset" style="width:calc(33% - 4px)">重置</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="12" style="text-align: right;"> -->
        <el-button style="width:calc(34% - 4px)"
          type="primary"
          size="small"
          @click="newAdd"
          v-hotKey="{ func: 'func_add1' }"
        >新建采购单</el-button>
      <!-- </el-col> -->
    </el-row>
    <!--排序-->
    <div class="sorttitle">
      <l-sort-label class="inline-block" label="单号" state="2" @click="listsort('PURCHASE_NUM')"></l-sort-label>
      <!-- <l-sort-label class="inline-block" label="供应商" state="2" @click="listsort('key2')"></l-sort-label>
      <l-sort-label class="inline-block" label="采购药库" state="2" @click="listsort('key3')"></l-sort-label>
      <l-sort-label class="inline-block" label="单据状态" state="2" @click="listsort('key4')"></l-sort-label>-->
      <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('ENTRY_TIME')"></l-sort-label>
      <l-sort-label
        class="inline-block"
        label="提交时间"
        state="2"
        @click="listsort('SUBMIT_PERSON_TIME')"
      ></l-sort-label>
    </div>

    <!--表单-->
    <div class="infinite-list-wrapper" v-loading="loading">
      <div
        class="list-container overflow-scroll-vertical"
        v-infinite-scroll="loadNextPage"
        :infinite-scroll-disabled="listDisabled"
      >
        <div
          :class="curSelectedIndex === i ? 'list-item active' : 'list-item'"
          v-for="(item, i) in purchaseList"
          :key="i"
          @click="handleSelectedItem(i, item)"
        >
          <!--申请单状态-->
          <div :class="item.status == 2 ? 'status' : 'status status-active'">
            <span>{{ item.status == 0 ? "未提交" : item.status == 2 ? "已审核 " : '已提交' }}</span>
            <span class="delicon" v-show="item.status == 0">
              &nbsp; | &nbsp;
              <i
                class="filter-item iconfont iconshanchu"
                title="删除"
                @click.stop="delItem(item, i)"
              ></i>
            </span>
            <span class="delicon">
              &nbsp; | &nbsp;
              <i
                class="filter-item iconfont iconzancun"
                title="新增采购模板"
                @click.stop="saveTem(item)"
              ></i>
            </span>
          </div>

          <el-row class="item-label">
            <el-col :span="24">
              <span class="rep">{{ item.purchaseNum }}</span>
            </el-col>
          </el-row>

          <el-row class="item-label">
            <el-col :span="24">
              <span class="label margin-right-6">供应商:</span>
              <span
                class="label2 overflow-point"
                :val="item.supplierCode"
                code="DrugSupplier"
                v-codeTransform
              ></span>
            </el-col>
          </el-row>

          <el-row class="item-label">
            <el-col :span="10">
              <span class="label margin-right-6">采购药库:</span>
              <span
                columns="STORAGE_NAME"
                :conditionMap="{ STORAGE_CODE: item.storageCode }"
                tableName="hrp_drgstrg"
                v-tableTransform
              ></span>
            </el-col>
            <el-col :span="14">
              <span class="label margin-right-6">总进价:</span>
              <span>{{ formatNum(item.totalAmount) }}元</span>
            </el-col>
          </el-row>
          <el-row class="item-label">
            <el-col :span="10">
              <span class="label margin-right-6">录入人员:</span>
              <span class="margin-right-10">{{ item.entryPersonName }}</span>
            </el-col>
            <el-col :span="14">
              <span class="label margin-right-6">时间:</span>
              <span>{{ item.entryTimeShow }}</span>
            </el-col>
          </el-row>
          <el-row class="item-label">
            <el-col :span="10">
              <span class="label margin-right-6">提交人员:</span>
              <span class="margin-right-10">{{ item.submitPersonName }}</span>
            </el-col>
            <el-col :span="14">
              <span class="label margin-right-6">时间:</span>
              <span>{{ item.submitPersonTimeShow }}</span>
            </el-col>
          </el-row>
        </div>
        <p v-if="!loading && noMore" class="load-list-bottom">{{ $t("base.noMore") }}</p>
      </div>
    </div>
    <l-dialog
      title="新增采购模板"
      :visible.sync="modelVisible"
      width="400px"
      @confirm="saveTemName"
      @cancel="modelVisible = false"
    >
      <template #content>
        <div class="padding20">
          <l-formt-title label="模板名称">
            <el-input v-model="templateName" :maxlength="50" placeholder="请输入"></el-input>
          </l-formt-title>
        </div>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
import stockPurchaseAPI from "@/api/drugStorage/stock/purchase";
import { localCodeTransform } from "@/utils/util";
import listSort from "@/mixins/drugLeftChange.js";
import Supplier from "./component/supplier";
import formatNum from "@/utils/formatPrice.js";
import { mapGetters, mapActions } from "vuex";
import hmmBaseApi from "@/api/hmm/base";

export default {
  mixins: [listSort],
  props: {
    recordStatusList: {
      type: Array
    },
    drugStorageList: {
      type: Array
    },
    supplierList: {
      type: Array
    }
  },
  components: { Supplier },
  data() {
    return {
      formSearch: {
        entryTime: [], //录入时间
        storageCode: "", // 采购药库id
        supplierCode: "", //供应商名称
        purchaserNum: "", // 采购单号
        status: "" //单据状态id
      },
      curSelectedIndex: 0, // 当前选择单号下标
      purchaseList: [], //采购列表
      loading: false, //左侧申请列表滑动加载状态
      pageParams: {
        pageNo: 1, // 当前页数
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
      },
      templateName: "",
      modelVisible: false,
      curItem: {}
    };
  },
  computed: {
    ...mapGetters("drugPurchase", ["newPurchaseData"]),
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
  watch: {
    newPurchaseData: {
      deep: true,
      handler() {
        this.curSelectedIndex = null;
      }
    }
  },
  mounted() {
    this.getUserStorage();
  },
  methods: {
    ...mapActions({
      reLoadList: "drugPurchase/reLoadList"
    }),
    formatNum(num) {
      return formatNum(num);
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    // 左侧边栏操作
    search(type) {
      // 搜索;
      this.pageParams.pageNo = 1;
      this.purchaseList = this.$options.data().purchaseList;
      this.loadTable();
    },
    // 筛选条件重置
    formSearchReset() {
      this.formSearch = this.$options.data().formSearch;
    },
    newAdd() {
      this.curSelectedIndex = null;
      this.$emit("newAdd");
    },
    //默认左侧第一项选择右侧渲染数据
    handleSelectedItem(i, item) {
      if (!item) {
        return;
      }
      this.curSelectedIndex = i;
      this.$emit("selectIdChange", item);
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    async loadTable() {
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
      queryData.status = this.formSearch.status || ""; //单据状态
      queryData.num = this.formSearch.purchaserNum; //采购单号
      queryData.supplierCode = this.formSearch.supplierCode; //供应商
      queryData.storageCode = this.formSearch.storageCode; //采购药库
      stockPurchaseAPI
        .getPurchaseList(queryData)
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
              this.purchaseList = list;
              this.handleSelectedItem(0, this.purchaseList[0] || {});
            } else {
              this.purchaseList = this.purchaseList.concat(list);
            }
            this.pageParams = res.pageParams;
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
          this.pageParams = res.pageParams;
        })
        .catch(res => {
          this.loading = false;
          this.$message.error(res.msg || "查询失败");
        });
    },
    //左侧采购单删除
    delItem(item, index) {
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前采购单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stockPurchaseAPI
            .deletePurchaseList(item.id)
            .then(res => {
              this.$hideLoading();
              done();
              if (res.code == 1) {
                this.search();
                this.$message({
                  type: "success",
                  message: "删除采购单成功!"
                });
              } else {
                this.$message.error(res.msg || "删除采购单失败");
              }
            })
            .catch(res => {
              this.$hideLoading();
              done();
              this.$message.error(res.msg || "删除采购单失败");
            });
        }
      });
    },
    saveTemName(data) {
      if (this.templateName === "") {
        this.$message.warning("请输入模板名称!");
        return;
      }
      stockPurchaseAPI
        .savePurchaseTem({
          id: this.curItem.id,
          templateName: this.templateName
        })
        .then(res => {
          if (res.code === 1) {
            this.modelVisible = false;
            this.$message.success(res.msg || "保存成功");
            this.reLoadList();
          } else {
            this.$message.error(res.msg || "保存失败");
          }
        })
        .catch(err => {
          this.$message.error(err.msg || "保存失败");
        });
    },
    // 新增采购模板
    saveTem(data) {
      this.templateName = "";
      this.modelVisible = true;
      this.curItem = data;
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            this.formSearch.storageCode = res.data.storageCode;
            this.search();
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch(err => {
          this.$message.error("获取当前库房失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  position: relative;

  .sorttitle {
    background: $l-color-bgcolor-18;
    padding: 0 16px;

    .inline-block {
      margin-right: 5px;
    }
  }
  .infinite-list-wrapper {
    position: absolute;
    top: 322px;
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
      i {
        color: $l-color-primary;
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
