<template>
  <el-card class="height100">
    <el-row style="padding:8px;">
      <!-- 左侧title -->
      <!-- <el-col :span="24"> -->
      <l-card-title>
        <span slot="left">入库记录</span>
      </l-card-title>
      <!-- </el-col> -->
    </el-row>
    <!-- 左侧搜索条件 -->
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="入库库房" labelWidth="64" disabled>
          <el-select clearable v-model="formSearch.deptId"  disabled>
            <el-option v-for="item in storageNameList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
          </el-select>
        </l-formt-title>
      </el-col>
    </el-row>
    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col :span="24">
        <l-formt-title label="录入日期" labelWidth="64">
          <el-date-picker style="width:100%"  v-model="formSearch.entryTime"  type="daterange"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        </l-formt-title>
      </el-col>
    </el-row>

    <el-row style="padding:0 8px;margin-bottom:8px">
      <el-col>
        <l-formt-title label="入库类型" labelWidth="64">
          <el-select clearable v-model="formSearch.type" placeholder="请选择">
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
          <el-input v-model="formSearch.num"></el-input>
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
      <l-sort-label class="inline-block" label="入库单号" state="2" @click="listsort('INBOUND_NUM')"></l-sort-label>
      <!-- <l-sort-label class="inline-block" label="供应商" state="2" @click="listsort('key2')"></l-sort-label>
      <l-sort-label class="inline-block" label="提交状态" state="2" @click="listsort('key3')"></l-sort-label>-->
      <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('ENTRY_TIME')"></l-sort-label>
<!--      <l-sort-label class="inline-block" label="提交时间" state="2" @click="listsort('SUBMIT_PERSON_TIME')"></l-sort-label>-->
    </div>

    <!--左侧表单-->
    <div class="infinite-list-wrapper" v-loading="loading">
      <div class="list-container overflow-scroll-vertical"  >
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
              <span class="rep">{{ item.inboundNum }}</span>
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
              <span class="label margin-right-6">入库库房:</span>
              <el-tooltip :content="deptName" placement="top"><span >{{deptName}}</span></el-tooltip>
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
              <span>{{ item.entryTime }}</span>
            </el-col>
          </el-row>
          <el-row class="item-label"></el-row>
        </div>
      </div>
    </div>
    <div class="page">
      <el-pagination
        @current-change="changePage"
        :current-page="pageParams.pageNo"
        :page-sizes="[20, 50, 100]"
        :page-size="pageParams.pageSize"
        layout="total, prev, pager, next"
        :total="pageParams.total"
        :pager-count="5"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
  import WarehousingAPI from "@/api/materielStorage/warehousing";
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
      },
      //
      storageNameList: {
        type: Array
      },
    },
    data() {
      return {
        formSearch: {
          type: "", //入库类型
          entryTime: [this.makeDate(1, new Date()), this.makeDate(0, new Date())], //录入时间
          deptId:JSON.parse(window.localStorage.getItem('role')).deptId,
          status: "", //单据状态id
          num: ""
        },
        deptName:'',
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

    },
    created() {
      this.deptName = JSON.parse(window.localStorage.getItem('role')).deptName
    },
    mounted() {
      this.loadTable();
    },
    methods: {
      changePage(val) {
        this.pageParams.pageNo = val;
        this.loadTable();
      },
      makeDate(n, datePoint) {
        var now = datePoint ? new Date(datePoint) : new Date();
        var year = now.getFullYear();
        //因为月份是从0开始的,所以获取这个月的月份数要加1才行
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - n;
        if (month2 <=0) {
          year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
          month2 = 12 - (Math.abs(month2) % 12);
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + (day2 < 10 ? "0" + day2 : day2);;
        return t2;
      },
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
              /*this.wareList = this.$options.data().wareList;
              console.log(this.wareList)*/
              this.loadTable();
            })
            .catch(action => {
              // 取消
              console.log("取消");
              return false;
            });
        } else {
          // 搜索
         /* this.pageParams.pageNo = 1;
          this.wareList = this.$options.data().wareList;*/
          console.log(11);
          Object.assign(this.wareList, this.$options.data.call(this).wareList)
          console.log(this.wareList);
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
        Object.assign(this.formSearch, this.$options.data.call(this).formSearch)
        //this.formSearch = this.$options.data().formSearch;
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

      async loadTable() {
        this.loading = true;
        let queryParam = { ...this.pageParams
        };
        queryParam.orderBy = this.orderBy;
        queryParam.startTime =
          this.formSearch.entryTime && this.formSearch.entryTime[0] ?
          this.formSearch.entryTime[0] + " 00:00:00" :
          ""; //开始日期
        queryParam.endTime =
          this.formSearch.entryTime && this.formSearch.entryTime[1] ?
          this.formSearch.entryTime[1] + " 23:59:59" : ""; //结束日期
        queryParam.type = this.formSearch.type || ""; //结束日期
        queryParam.status = this.formSearch.status;
        queryParam.num = this.formSearch.num;
        WarehousingAPI
          .getWarehousingList(queryParam)
          .then(res => {
            this.loading = false;
            if (res.code == 1) {
              let list = res.data.map(item => {
                return {
                  ...item,
                };
              });

                this.wareList = list;
                this.handleSelectedItem(0, this.wareList[0] || {});

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
        let param = {
          id:item.id,
          dataVersion:item.dataVersion
        }
        console.log(param)
        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否删除当前入库单?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            WarehousingAPI
              .deleteWarehousingList(param)
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
      bottom: 68px;
    }
    .page{
      position: absolute;
      bottom: 0;
      z-index: 999;
      background:#FFF;
      width: 100%;
    }
    /deep/.el-pagination{
      text-align: center;
    }
    /deep/.el-pagination__total{
      display: block;
      text-align: center;
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
