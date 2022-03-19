<template>
  <el-card class="height100">
    <div class="table-top">
      <div class="clearFloat">
        <l-card-title style="margin:8px 0;">
          <span slot="left">处方查询</span>
        </l-card-title>
      </div>
      <el-row :gutter="6" class="margin-bottom10">
        <el-col :span="12">
          <l-formt-title label="处方号">
            <el-input v-model="searchparam.recipeCode" placeholder></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="12">
          <l-formt-title label="姓名">
            <el-input v-model="searchparam.patientName" placeholder></el-input>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row :gutter="6" class="margin-bottom10">
        <el-col :span="12">
          <l-formt-title label="科室">
            <l-value-domain :value.sync="searchparam.deptId" remoteUrl="/wadmin/hos/dept" remoteShowKey="orgNm"
              remoteValueKey="id" placeholder="请选择"></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="12" class="margin-bottom10">
          <l-formt-title label="药房">
            <el-select v-model="searchparam.deliveryPhCode" placeholder>
              <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>

      <el-row :gutter="6" class="margin-bottom10">
        <el-col :span="12">
          <l-formt-title label="发药窗口" labelWidth="64">
            <el-select v-model="searchparam.deliveryWindowCode" placeholder>
              <el-option v-for="item in pharWindowList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="12">
          <l-formt-title label="发药方式" labelWidth="64">
            <el-select v-model="searchparam.dispendingMethod" placeholder>
              <el-option v-for="item in dispendingList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <!-- <el-col :span="12">
          <l-formt-title label="收费状态" labelWidth="64">
            <el-select v-model="searchparam.chargeState" placeholder>
              <el-option
                v-for="item in chargeStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-col>-->
      </el-row>
      <el-row :gutter="6" class="margin-bottom10">
        <el-col :span="24">
          <l-formt-title label="处方类型" labelWidth="64">
            <el-select v-model="searchparam.orderType">
              <el-option label="西药" value="10"></el-option>
              <el-option label="中成药" value="12"></el-option>
              <el-option label="中草药" value="11"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row :gutter="6" class="margin-bottom10">
        <el-col :span="12">
          <l-formt-title label="发药状态" labelWidth="64">
            <el-select v-model="searchparam.deliveryState" placeholder>
              <el-option v-for="item in deliveryStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="12">
          <l-formt-title label="配方状态" labelWidth="64">
            <el-select v-model="searchparam.dispenseState" placeholder>
              <el-option v-for="item in dispenseStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>
      <l-formt-title label="收费时间" labelWidth="64" class="margin-bottom10">
        <div>
          <el-date-picker v-model="searchparam.chargeTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"
            start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
        </div>
      </l-formt-title>
      <l-formt-title label="发药时间" labelWidth="64" class="margin-bottom10">
        <div>
          <el-date-picker v-model="searchparam.deliveryTime" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"
            start-placeholder="开始日期" end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
        </div>
      </l-formt-title>
      <div class="clearFloat" style="margin-top:4px;">
        <!--查询按钮-->
        <el-row :gutter="8">
          <el-col :span="12">
            <el-button class="button width100" type="primary" @click="search">查询</el-button>
          </el-col>
          <el-col :span="12">
            <el-button class="button reset width100" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--排序-->
    <div class="sorttitle">
      <l-sort-label class="inline-block" label="处方号" state="2" @click="listsort('RECIPE_CODE')"></l-sort-label>
      <l-sort-label class="inline-block" label="科室" state="2" @click="listsort('DEPT_NAME')"></l-sort-label>
      <l-sort-label class="inline-block" label="总金额" state="2" @click="listsort('PRESCRIPTION_AMT')"></l-sort-label>
      <l-sort-label class="inline-block" label="收费时间" state="2" @click="listsort('CHARGE_TIME')"></l-sort-label>
    </div>
    <!--表单-->
    <div class="infinite-list-wrapper" v-loading="tlm_isLoading">
      <div class="list-container overflow-scroll-vertical" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
        <div ref="recipeTable" :class="curSelectindex == i ? 'list-item active' : 'list-item'" v-for="(item, i) in recipeTable"
          :key="i" @click="handleSelectedItem(i, item)">
          <div class="item-label">
            <span class="margin-right-6 minwidth" style="font-size: 16px;font-weight: bold">{{ item.recipeCode }}</span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">病人姓名</span>
            <span class="margin-right-10 minwidth">{{ item.patientName }}</span>
            <span class="label margin-right-6">性别</span>
            <span :val="item.patientGender" code="GENDER_CODE" v-codeTransform></span>
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
            <span class="label margin-right-6">收费人</span>
            <span class="margin-right-10 minwidth">
              {{
              item.chargeUserName
              }}
            </span>
          </div>
          <div class="item-label">
            <span class="label margin-right-6">收费时间</span>
            <span>{{ item.chargeTime }}</span>
          </div>
        </div>
        <!-- <p class="align-center" v-if="tlm_isLoading">加载中...</p> -->
        <p class="align-center" v-if="!tlm_isLoading && noMore">没有更多了</p>
      </div>
    </div>
    <div class="collect">
      <p>
        当前共
        <span>{{ patient }}</span> 名患者
      </p>
      <p>
        共
        <span>{{ recipe }}</span> 张处方
      </p>
    </div>
  </el-card>
</template>
<script>
  import opha from "@/api/hmm/opha";
  import base from "@/api/hmm/base";
  import listSort from "@/mixins/drugLeftChange.js";
  import mixin from "@/mixins/drugManagement.js";
  import formatNum from "@/utils/formatPrice.js";

  export default {
    mixins: [listSort, mixin],
    props: {
      drugStorageList: {
        type: Array,
      },
      pharWindowList: {
        type: Array,
      },
    },
    data() {
      return {
        // pharWindowList: [],
        //定义搜索条件
        searchparam: {
          recipeCode: "", // 处方号
          patientName: "", // 患者姓名
          dispendingMethod:'',//发药方式
          deptId: "", // 开单科室
          deliveryWindowCode: "", // 发药窗口
          chargeState: "", // 收费状态
          deliveryState: "", // 发药状态
          dispenseState: "", // 配方状态
          chargeTime: "", // 收费时间
          deliveryTime: "", // 发药时间
          orderType:'',//处方类型
          currDrugStorage:this.getLocationFun() //区分财务和药房
        },
        patient: "", //患者人数
        recipe: "", //处方数
        dispendingList: [
          {
            label: "全部",
            value: "",
          },
          {
            label: "自取",
            value:1,
          },
          {
            label: "配送",
            value:2,
          },
        ],
        chargeStateList: [{
            label: "已收费",
            value: 1,
          },
          {
            label: "全部",
            value: "",
          },
        ],
        deliveryStateList: [{
            label: "已发药",
            value: 1,
          },
          {
            label: "未发药",
            value: 0,
          },
          {
            label: "全部",
            value: "",
          },
        ],
        dispenseStateList: [{
            label: "已配药",
            value: 1,
          },
          {
            label: "未配药",
            value: 0,
          },
          {
            label: "全部",
            value: "",
          },
        ],
        recipeFormid: "", //向父组件传递当前选择的数据信息
        tlm_noMore: false,
        tlm_isLoading: false,
        recipeTable: [],
        recipeUnit: [], //单页数据
        curSelectindex: 0, // 当前选择单号下标
        pageParams: {
          pageNo: 0,
          pageSize: 10,
          total: 0,
        },
        orderBy: "CHARGE_TIME DESC",
      };
    },
    computed: {
      totalAll: function() {
        return Math.ceil(this.pageParams.total / this.pageParams.pageSize);
      },
      noMore() {
        return (
          Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo
        );
      },
      disabled() {
        return this.tlm_isLoading || this.noMore;
      },
    },
    watch: {
      recipeTable: {
        deep: true,
        handler(val) {
          if (val.length > 0) {
            this.changeCurDrug(val[0]);
          }
        },
      },
    },
    created() {
      this.search();
    },
    methods: {
      // 获取地址栏的信息
      getLocationFun(){
        let num = 1;
        let url = window.location.href;
        let urlList = url.split("/");
        for(let i=0;i<urlList.length;i++){
          if(urlList[i] == "finance_inp"){
            num = 0;
            break;
          }
        }
        return num;
      },
      formatNum(num) {
        return formatNum(num);
      },
      // 左侧边栏操作
      // eslint-disable-next-line complexity
      async seachdata(val) {
        try {
          this.tlm_isLoading = true;
          this.searchparam.orderBy = this.orderBy;
          this.searchparam.sChargeDate =
            (this.searchparam.chargeTime && this.searchparam.chargeTime[0]) || "";
          this.searchparam.eChargeDate =
            (this.searchparam.chargeTime && this.searchparam.chargeTime[1]) || "";
          this.searchparam.sDeliveryTime =
            (this.searchparam.deliveryTime && this.searchparam.deliveryTime[0]) ||
            "";
          this.searchparam.eDeliveryTime =
            (this.searchparam.deliveryTime && this.searchparam.deliveryTime[1]) ||
            "";
          let response = await opha.list({
            ...this.searchparam,
            ...this.pageParams,
          });
          let result = await opha.listForRecipe({
            ...this.searchparam,
            ...this.pageParams,
          });
          this.patient = result.data.patient;
          this.recipe = result.data.recipe;
          let {
            code,
            data
          } = response;
          if (code === 1) {
            if (this.pageParams.pageNo === 1) {
              this.recipeTable = data;
              if (this.recipeTable[0]) {
                this.handleSelectedItem(0, this.recipeTable[0]);
              } else {
                this.handleSelectedItem(null, {});
              }
            } else {
              this.recipeTable = this.recipeTable.concat(data);
            }
          }
          this.tlm_isLoading = false;
          this.pageParams = response.pageParams;
        } catch (error) {
          this.tlm_isLoading = false;
        }
      },

      search() {
        // 搜索
        this.pageParams.pageNo = 1;
        this.pageParams.total = 0;
        this.seachdata();
      },

      reset() {
        this.searchparam = {
          recipeCode: "", // 处方号
          patientName: "", // 患者姓名
          deptId: "", // 开单科室
          deliveryWindowCode: "", // 发药窗口
          chargeState: "", // 收费状态
          deliveryState: "", // 发药状态
          dispenseState: "", // 配方状态
          chargeTime: "", // 收费时间
          deliveryTime: "", // 发药时间
        };
      },
      //默认左侧第一项选择右侧渲染数据
      handleSelectedItem(i, item) {
        this.curSelectindex = i;
        this.recipeFormid = item.id;
        this.changeCurDrug(item);
        this.$emit("selectIdChange", this.recipeFormid);
      },

      //滑动加载更多信息
      load() {
        this.pageParams.pageNo++;
        //获取分页列表
        this.seachdata();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .el-card {
    position: relative;

    .padding20 {
      padding: 0 20px;

      .clearFloat {
        overflow: hidden;

        &>div {
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
          margin-left: 0;
        }
      }
    }

    .table-top {
      width: 100%;
      padding: 0 8px;

      /deep/ .el-row {
        height: 36px;
      }

      .cardInput {
        width: 75%;
      }

      .deliveryState {
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
      top: 375px;
      left: 0;
      width: 100%;
      bottom: 50px;
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

    .collect {
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 15px 20px;

      p {
        display: inline-block;
      }

      p:first-child {
        padding-right: 10px;
        margin-right: 10px;
        border-right: 1px solid $l-color-bgcolor-11;
      }

      span {
        color: $l-color-primary;
      }
    }
  }

  .align-center {
    text-align: center;
    padding: 5px 0;
  }

  .margin-bottom10 {
    margin-bottom: 2px;
  }
</style>
