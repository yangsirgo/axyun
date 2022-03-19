<template>
  <el-card class="height100">
    <el-row style="padding:8px;">
      <!-- 左侧title -->
      <!-- <el-col :span="24"> -->
      <l-card-title>
        <span slot="left">入库单号列表</span>
      </l-card-title>
      <!-- </el-col> -->
    </el-row>
    <!-- 左侧搜索条件 -->
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
        <l-formt-title label="入库类型" labelWidth="64">
          <el-select clearable v-model="formSearch.inType" placeholder="请选择">
            <el-option v-for="item in storageTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="单据状态" labelWidth="64">
          <el-select clearable v-model="formSearch.status" placeholder="请选择">
            <el-option v-for="item in recordStatusList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="入库单号" labelWidth="64">
          <el-input v-model="formSearch.inInventoryNum"></el-input>
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px;display:flex;">
      <!-- 查询按钮 -->
      <!-- <el-col :span="6"> -->
      <el-button type="primary" size="small" @click="search" style="width:calc(33% - 4px)">查询</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="6"> -->
      <el-button type="primary" size="small" plain @click="formSearchReset" style="width:calc(33% - 4px)">重置</el-button>
      <!-- </el-col> -->
      <!-- <el-col :span="12" style="text-align: right;"> -->
      <el-button style="width:calc(34% - 4px)" type="primary" size="small" @click="newAdd" v-hotKey="{ func: 'func_add1' }">新建入库单</el-button>
      <!-- </el-col> -->
    </el-row>

    <!--排序-->
    <div class="sorttitle">
      <l-sort-label class="inline-block" label="入库单号" state="2" @click="listsort('IN_INVENTORY_NUM')"></l-sort-label>
      <!-- <l-sort-label class="inline-block" label="供应商" state="2" @click="listsort('key2')"></l-sort-label>
      <l-sort-label class="inline-block" label="提交状态" state="2" @click="listsort('key3')"></l-sort-label>-->
      <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('ENTRY_TIME')"></l-sort-label>
      <l-sort-label class="inline-block" label="提交时间" state="2" @click="listsort('SUBMIT_PERSON_TIME')"></l-sort-label>
    </div>

    <!--左侧表单-->
    <div class="infinite-list-wrapper" v-loading="loading">
      <div class="list-container overflow-scroll-vertical" v-infinite-scroll="loadNextPage" :infinite-scroll-disabled="listDisabled">
        <div :class="curSelectedIndex == i ? 'list-item active' : 'list-item'" v-for="(item, i) in wareList" :key="i"
          @click="handleSelectedItem(i, item)">
          <!--申请单状态-->
          <div :class="item.status == 1 ? 'status' : 'status status-active'">
            {{ item.status == 0 ? "未提交" : "已提交" }}
            <span class="delicon" v-show="item.status == 0" style="font-size:14px;">&nbsp; | &nbsp;</span>
            <span class="delicon" v-show="item.status == 0" @click="delItem(item, i)">
              <i class="filter-item iconfont iconshanchu"></i>
            </span>
          </div>

          <el-row class="item-label">
            <el-col :span="24">
              <span class="rep">{{ item.inInventoryNum }}</span>
            </el-col>
          </el-row>

          <!-- <el-row class="item-label">
            <el-col :span="24">
              <span class="label margin-right-6">供 应 商:</span>
              <span class="label2 overflow-point" :val="item.supplierCode" code="DrugSupplier" v-codeTransform></span>
            </el-col>
          </el-row> -->

          <el-row class="item-label">
            <el-col :span="10">
              <span class="label margin-right-6">入库药房:</span>
              <span columns="STORAGE_NAME" :conditionMap="{ STORAGE_CODE: item.storageCode }" tableName="hrp_drgstrg"
                v-tableTransform></span>
            </el-col>
            <el-col :span="14">
              <span class="label margin-right-6">总金额:</span>
              <span>{{ formatNum(item.totalAmt) }}元</span>
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
          <el-row class="item-label"></el-row>

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
  </el-card>
</template>

<script>
  import stockWarehousingAPI from "@/api/drugStorage/stock/warehousing";
  import {
    localCodeTransform
  } from "@/utils/util";
  import listSort from "@/mixins/drugLeftChange.js";
  import formatNum from "@/utils/formatPrice.js";
  import Supplier from "@/views/drugManagement/drugstock/purchase/component/supplier.vue";
  import {
    mapGetters
  } from "vuex";

  export default {
    mixins: [listSort],
    components: {
      Supplier
    },
    props: {
      // 单据状态列表
      recordStatusList: {
        type: Array
      },
      // 入库类型数据源
      storageTypeList: {
        type: Array
      },
      // 工具箱默认是否展开状态
      supplierList: {
        type: Array
      }
    },
    data() {
      return {
        formSearch: {
          inType: "", //入库类型
          entryTime: [], //录入时间
          subTime: [],
          status: "", //单据状态id
          supplierCode: "", //供应商名称
          inInventoryNum: ""
        },
        curSelectedIndex: 0, // 当前选择单号下标
        wareList: [], // 申请列表
        loading: false, //左侧申请列表滑动加载状态
        pageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共条数
          pageSize: 20 // 每页数据条数
        },
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
      ...mapGetters("drugManagement", ["currentStorageCode"]),
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
      this.loadTable();
    },
    methods: {
      formatNum(num) {
        return formatNum(num);
      },
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
      codeToText(code, list) {
        return localCodeTransform(code, list);
      },
      // 左侧边栏操作
      search() {
        if (this.findStylefun()) {
          this.$confirm('还有数据未保存是否继续？？', '请确认', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              // 确定
              window.sessionStorage.setItem("findStyle", false);
              // 搜索
              this.pageParams.pageNo = 1;
              this.wareList = this.$options.data().wareList;
              this.loadTable();
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
          // 搜索
          this.pageParams.pageNo = 1;
          this.wareList = this.$options.data().wareList;
          this.loadTable();
        }
      },

      handleSelectedItem(i, item) {

        if (this.findStylefun()) {
          this.$confirm('还有数据未保存是否继续？？', '请确认', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              window.sessionStorage.setItem("findStyle", false);
              if (!item) {
                return;
              }
              this.curSelectedIndex = i;
              this.$emit("selectIdChange", item);
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
          if (!item) {
            return;
          }
          this.curSelectedIndex = i;
          this.$emit("selectIdChange", item);
        }
      },
      // 筛选条件重置
      formSearchReset() {
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
              this.curSelectedIndex = null;
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
          this.$emit("newAdd");
          this.curSelectedIndex = null;
        }
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
        let queryParam = { ...this.pageParams
        };
        queryParam.orderBy = this.orderBy;
        queryParam.sDate =
          this.formSearch.entryTime && this.formSearch.entryTime[0] ?
          this.formSearch.entryTime[0] + " 00:00:00" :
          ""; //开始日期
        queryParam.eDate =
          this.formSearch.entryTime && this.formSearch.entryTime[1] ?
          this.formSearch.entryTime[1] + " 23:59:59" : ""; //结束日期
        queryParam.sSubmitPersonTime = this.formSearch.subTime && this.formSearch.subTime[0] ?
          this.formSearch.subTime[0] + " 00:00:00" : "";
        queryParam.eSubmitPersonTime = this.formSearch.subTime && this.formSearch.subTime[1] ?
          this.formSearch.subTime[1] + " 23:59:59" : "";
        queryParam.type = this.formSearch.inType || ""; //结束日期
        queryParam.status = this.formSearch.status;
        queryParam.supplierCode = this.formSearch.supplierCode;
        queryParam.num = this.formSearch.inInventoryNum;
        queryParam.storageCode = this.currentStorageCode;
        queryParam.types = "4,1,5,6,3";

        stockWarehousingAPI
          .getWarehousingList(queryParam)
          .then(res => {
            this.loading = false;
            if (res.code == 1) {
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
                this.wareList = list;
                this.handleSelectedItem(0, this.wareList[0] || {});
              } else {
                this.wareList = this.wareList.concat(list);
              }
              this.pageParams = res.pageParams;
            } else {
              this.$message.error(res.msg || "获取入库单数据失败");
            }
            this.pageParams = res.pageParams;
          })
          .catch(err => {
            this.loading = false;
          });
      },

      //左侧入库单删除
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
      delItem1(item, index) {
        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否删除当前入库单?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            stockWarehousingAPI
              .deleteWarehousingList(item.id)
              .then(res => {
                done();
                this.$hideLoading();
                if (res.code === 1) {
                  this.search();
                  this.$message.success(res.msg || "删除入库单成功!");
                } else {
                  this.$message.error(res.msg || "删除入库单失败");
                }
              })
              .catch(err => {
                done();
                this.$hideLoading();
                this.$message.error(err.msg || "删除入库单失败");
              });
          }
        });

      },
      //获取默认当前时间
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
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
          color: $l-color-fontcolor-4;
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
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
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
