<template>
  <el-card class="height100">
    <el-row style="padding:8px;">
      <!-- 左侧title -->
      <!-- <el-col :span="24"> -->
      <l-card-title>
        <span slot="left">出库单号列表</span>
      </l-card-title>
      <!-- </el-col> -->
    </el-row>

    <!-- 搜索条件 -->
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
        <l-formt-title label="录入日期" labelWidth="64">
          <el-date-picker style="width:100%" clearable v-model="formSearch.entryTime" format="yyyy-MM-dd" type="daterange"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
        <l-formt-title label="提交日期" labelWidth="64">
          <el-date-picker style="width:100%" clearable v-model="formSearch.subTime" format="yyyy-MM-dd" type="daterange"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="类型" labelWidth="64">
          <el-select clearable v-model="formSearch.outType" placeholder="请选择">
            <el-option v-for="item in outTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </l-formt-title>
      </el-col>
    </el-row>

    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="状态" labelWidth="64">
          <el-select clearable v-model="formSearch.status" placeholder="请选择">
            <el-option v-for="item in recordStatusList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </l-formt-title>
      </el-col>
    </el-row>

    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="出库单号" labelWidth="64">
          <el-input v-model="formSearch.outInventoryNum"></el-input>
        </l-formt-title>
      </el-col>
    </el-row>

    <el-row style="padding:0 8px;margin-bottom:8px;display:flex;">
      <!-- 搜索按钮 -->
      <!-- <el-col :span="6"> -->
      <el-button type="primary" size="small" @click="search" style="width:calc(33% - 4px)">查询</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="6"> -->
      <el-button type="primary" size="small" plain @click="reset" style="width:calc(33% - 4px)">重置</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="12" style="text-align: right;"> -->
      <el-button style="width:calc(34% - 4px)" type="primary" size="small" @click="newAdd" v-hotKey="{ func: 'func_add1' }">新建出库单</el-button>
      <!-- </el-col> -->
    </el-row>

    <!--排序-->
    <div class="sorttitle">
      <l-sort-label class="inline-block" label="出库单号" state="2" @click="listsort('OUT_INVENTORY_NUM')"></l-sort-label>
      <!-- <l-sort-label class="inline-block" label="类型" state="2" @click="listsort('key2')"></l-sort-label>
      <l-sort-label class="inline-block" label="提交状态" state="2" @click="listsort('key3')"></l-sort-label>-->
      <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('ENTRY_TIME')"></l-sort-label>
      <l-sort-label class="inline-block" label="提交时间" state="2" @click="listsort('SUBMIT_PERSON_TIME')"></l-sort-label>
    </div>

    <!--左侧表单-->
    <div class="infinite-list-wrapper" v-loading="loading">
      <div class="list-container overflow-scroll-vertical" v-infinite-scroll="loadNextPage" :infinite-scroll-disabled="listDisabled">
        <div :class="curSelectedIndex === i ? 'list-item active' : 'list-item'" v-for="(item, i) in outStocklist" :key="i"
          @click="handleSelectedItem(i, item)">
          <!--申请单状态-->
          <div :class="item.status == 1 ? 'status' : 'status status-active'">
            {{ statusCodeToText(item.status) }}
            <span class="delicon" v-show="item.status == 0" style="font-size:14px;">&nbsp; | &nbsp;</span>
            <span class="delicon" v-show="item.status == 0" @click="delItem(item, i)">
              <i class="filter-item iconfont iconshanchu"></i>
            </span>
          </div>

          <el-row class="item-label">
            <el-col :span="24">
              <span class="rep">{{ item.outInventoryNum }}</span>
            </el-col>
          </el-row>

          <el-row class="item-label">
            <el-col :span="12">
              <span class="label margin-right-6">出库类型:</span>
              <span>{{ codeToText(item.outType, outTypeList) }}</span>
            </el-col>
            <el-col :span="12">
              <span class="label margin-right-6">总金额:</span>
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
  import stock from "@/api/hmm/stock";
  import hmmBaseApi from "@/api/hmm/base";
  import {
    localCodeTransform
  } from "@/utils/util";
  import {
    mapGetters
  } from "vuex";
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
      },
      recordStatusList: {
        type: Array
      },
      supplierList: {
        type: Array
      }
    },
    mixins: [mixin, listSort],
    data() {
      return {
        //搜索条件
        formSearch: {
          entryTime: [], //录入时间
          subTime: [], //提交日期
          outType: "", //出库类型
          status: "", //单据状态
          outInventoryNum: "" //单号
        },
        pageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共页数
          pageSize: 10 // 每页数据条数
        },
        outStocklist: [], // 申请列表
        curSelectedIndex: 0, // 当前选择单号下标
        id: "", //当前选择单号id
        status: "", //当前选择单号状态
        loading: false, //左侧申请列表滑动加载状态
        orderBy: "UPDATED_AT DESC",
        pickerOptions: {
          shortcuts: [{
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
    methods: {
      // 使用右侧列表储存的信息来判断的是否有未编辑数据
      findStylefun() {
        let findStyle = window.sessionStorage.getItem("findStyle");
        if (findStyle == "false") {
          findStyle = false;
        } else {
          findStyle = true;
        }
        return findStyle;
      },
      formatNum(num) {
        return formatNum(num);
      },
      codeToText(code, list) {
        return localCodeTransform(code, list);
      },
      statusCodeToText(code) {
        if (code == 0) {
          return "未提交";
        } else if (code == 1) {
          return "已提交";
        } 
        else if (code == 2) {
          return "目标库房已确认";
        }
        return "";
      },
      numSearch(data) {
        this.formSearch.outInventoryNum = data.outInventoryNum;
        this.search();
      },
      //页面初始化搜索
      getLeftlist() {
        // 搜索;
        this.loading = true;
        let queryData = {
          ...this.pageParams,
          orderBy: this.orderBy,
          sDate: this.formSearch.entryTime && this.formSearch.entryTime[0] ?
            this.formSearch.entryTime[0] + " 00:00:00" : "",
          eDate: this.formSearch.entryTime && this.formSearch.entryTime[1] ?
            this.formSearch.entryTime[1] + " 23:59:59" : "",
          sSubmitPersonTime: this.formSearch.subTime && this.formSearch.subTime[0] ?
            this.formSearch.subTime[0] + " 00:00:00" : "",
          eSubmitPersonTime: this.formSearch.subTime && this.formSearch.subTime[1] ?
            this.formSearch.subTime[1] + " 23:59:59" : "",
          status: this.formSearch.status,
          type: this.formSearch.outType || "",
          num: this.formSearch.outInventoryNum,
          storageCode: this.Params_storageCode,
          types: "9,2,7,8",
          currDrugStorage: '1'
        };
        stock
          .getOutStockList(queryData)
          .then(res => {
            this.loading = false;
            let leftData = { ...res
            };
            this.pageParams.total = leftData.total;
            this.pageParams.pageNo = leftData.pageNo;
            this.pageParams.pageSize = leftData.pageSize;
            let list = res.data.map(item => {
              let estr = item.entryTime ? item.entryTime.split(":") : "";
              let sstr = item.submitPersonTime ?
                item.submitPersonTime.split(":") :
                "";
              return {
                ...item,
                entryTimeShow: estr ? estr[0] + ":" + estr[1] : estr,
                submitPersonTimeShow: sstr ? sstr[0] + ":" + sstr[1] : sstr
              };
            });
            if (this.pageParams.pageNo === 1) {
              this.outStocklist = list;
              this.handleSelectedItem(0, this.outStocklist[0] || {});
            } else {
              this.outStocklist = this.outStocklist.concat(list);
            }
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.msg || "出库单查询失败");
          });
      },
      search() {
        if (this.findStylefun()) {
          this.$confirm('还有数据未保存是否继续？？', '请确认', {
            confirmButtonText: '确定',
             cancelButtonText: '取消',
          }).then(() => {
             window.sessionStorage.setItem("findStyle", false);
             // 搜索;
             this.outStocklist = this.$options.data().outStocklist;
             this.pageParams.pageNo = 1;
             this.getLeftlist();
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
          // 搜索;
          this.outStocklist = this.$options.data().outStocklist;
          this.pageParams.pageNo = 1;
          this.getLeftlist();
        }

      },

      //左侧采购单删除
      delItem(item, index) {
        if (this.findStylefun()) {
          this.$confirm('还有数据未保存是否继续？？', '请确认', {
            confirmButtonText: '确定',
             cancelButtonText: '取消',
          }).then(() => {
             window.sessionStorage.setItem("findStyle", false);
             this.delItem1(item, index);
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
          this.delItem1(item, index);
        }

      },
      delItem1(item, index){
        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否删除当前出库单?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            stock
              .deleteOutStockList(item.id)
              .then(res => {
                this.$hideLoading();
                done();
                if (res.code === 1) {
                  this.$message.success(res.msg || "删除出库单成功!");
                  this.search();
                } else {
                  this.$message.error(res.msg || "删除出库单失败");
                }
              })
              .catch(res => {
                this.$hideLoading();
                this.$message.error(res.msg || "删除出库单失败");
              });
          }
        });
      },
      //默认左侧第一项选择右侧渲染数据
      handleSelectedItem(i, item) {
        if (this.findStylefun()) {
          this.$confirm('还有数据未保存是否继续？？', '请确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
             window.sessionStorage.setItem("findStyle", false);
             this.curSelectedIndex = i;
             this.$emit("selectIdChange", item);
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
          this.curSelectedIndex = i;
          this.$emit("selectIdChange", item);
        }

      },
      reset() {
        // 筛选条件重置
        this.formSearch = this.$options.data().formSearch;
      },
      newAdd() {
        if (this.findStylefun()) {
          this.$confirm('还有数据未保存是否继续？？', '请确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
             window.sessionStorage.setItem("findStyle", false);
             this.$emit("newAdd");
             this.$emit("selectIdChange", {});
             this.curSelectedIndex = null;
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
         this.$emit("newAdd");
         this.$emit("selectIdChange", {});
         this.curSelectedIndex = null;
        }

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
      top: 324px;
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
                  display: block; //ie下需设未block
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
