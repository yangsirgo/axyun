<template>
  <div class="height100 three-column">
    <!--中间内容-->
    <div id="center" class="column">
      <div class="box">
        <el-card class="height100">
          <el-row :gutter="6" class="padding20 titleinput">
            <el-col :span="4">
              <LFormtTitle label="发药人" labelWidth="50">
                <el-select v-model="dispenseUserId" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="窗口设置" labelWidth="64">
                <el-select v-model="windowCode" placeholder="请选择">
                  <el-option
                    v-for="item in pharWindowList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>

            <el-col :span="15" style="text-align: right">
              <el-button
                @click="cancelDelivery"
                class="filter-item"
                type="text"
                icon="el-icon-collection"
              >取消发药</el-button>
              <el-button
                @click="delivery"
                class="filter-item"
                type="text"
                icon="el-icon-collection"
              >发药确认</el-button>
              <el-button class="filter-item" type="text" icon="el-icon-printer">打印配药单</el-button>
              <el-button class="filter-item" type="text" icon="el-icon-printer">处方打印</el-button>
              <el-button class="filter-item" type="text" icon="el-icon-printer">用药说明书打印</el-button>
              <el-button class="filter-item" type="text" icon="el-icon-printer">打印标签贴</el-button>
              <el-button
                @click="pause"
                class="filter-item"
                type="text"
                icon="el-icon-document-add"
              >窗口暂停</el-button>
            </el-col>
          </el-row>

          <el-form label-width="90px" :model="recipeForm">
            <el-row class="cftitle">
              <el-col :span="8" :offset="8">
                <span class="title">门诊处方</span>
              </el-col>
              <el-col :span="4" class="bfcolor">
                <el-form-item label="费别:" class="float-left">
                  <span>{{recipeForm.feeType}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="bfcolor">
                <el-form-item label="处方号:" class="float-left">
                  <span>{{recipeForm.recipeCode}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="8">
                <LFormtTitle label="姓名" class="disabled">
                  <el-input v-model="recipeForm.patientNamee" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col :span="8">
                <LFormtTitle label="性别" class="disabled">
                  <el-input v-model="recipeForm.patientGender" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col :span="8">
                <LFormtTitle label="年龄" class="disabled">
                  <el-input v-model="recipeForm.patientAge" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="病人编号" class="disabled" labelWidth="64">
                  <el-input v-model="recipeForm.patientCode" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="科室" class="disabled">
                  <el-input v-model="recipeForm.doctorDeptName" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="地址" class="disabled">
                  <el-input v-model="recipeForm.patientAddr" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col :span="12">
                <LFormtTitle label="联系电话" class="disabled" labelWidth="64">
                  <el-input v-model="recipeForm.phoneNum" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="临床医嘱" class="disabled" labelWidth="64">
                  <el-input v-model="recipeForm.clinicDiag" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="医嘱时间" class="disabled" labelWidth="64">
                  <el-input v-model="recipeForm.orderTime" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="8">
                <LFormtTitle label="开单医生" class="disabled" labelWidth="64">
                  <el-input v-model="recipeForm.doctorUserName" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle label="收费人员" class="disabled" labelWidth="64">
                  <el-input v-model="recipeForm.chargeUserName" disabled style="line-height: 34px;">
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <LFormtTitle label="总金额" class="disabled" labelWidth="64">
                  <el-input
                    v-model="recipeForm.prescriptionAmt"
                    disabled
                    style="line-height: 34px;"
                  >
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>
            <el-row style="padding:5px 10px;" :gutter="20">
              <el-col :span="12">
                <LFormtTitle label="配方人员" class="disabled" labelWidth="64">
                  <el-input
                    v-model="recipeForm.dispenseUserName"
                    disabled
                    style="line-height: 34px;"
                  >
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
              <el-col :span="12">
                <LFormtTitle label="发药人员" class="disabled" labelWidth="64">
                  <el-input
                    v-model="recipeForm.deliveryUserName"
                    disabled
                    style="line-height: 34px;"
                  >
                    <template slot="append"></template>
                  </el-input>
                </LFormtTitle>
              </el-col>
            </el-row>

            <el-row style="padding:5px 10px;height:300px;">
              <!-- 详细药品表格 -->
              <el-table :data="orderTable" border height="300">
                <el-table-column prop="drugName" label="药品名称" min-width="100"></el-table-column>
                <el-table-column prop="spec" label="规格" min-width="150"></el-table-column>
                <el-table-column prop="price" label="单价" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="originCode"
                  label="生产厂家"
                  min-width="180"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="drugQuantity" label="数量" min-width="50"></el-table-column>
                <el-table-column prop="dosageUnit" label="单位" min-width="60" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="medicationCode"
                  label="用法"
                  min-width="150"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </el-row>
          </el-form>

          <div class="bottom-div">
            <p>
              该处方在
              <span>{{ }}</span>已预配方,当前为
              <span>{{ }}</span>
            </p>
          </div>
        </el-card>
      </div>
    </div>

    <!--左侧边栏-->
    <div id="left" class="column" ref="left">
      <div class="box">
        <el-card class="height100 padding20">
          <div class="table-top">
            <el-row >
              <el-radio-group v-model="searchType" @change="radioChange" style="width: 100%">
                <el-col :span="6">
                  <el-radio label="0">收费日期</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="1">读卡</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="2">收据号</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="3">处方号</el-radio>
                </el-col>
              </el-radio-group>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-date-picker
                  v-model="date"
                  v-show="dateShow"
                  style="width:100%"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']"
                ></el-date-picker>
                <el-input
                  v-model="queryValue"
                  v-show="inputShow"
                  :class="{cardInput: searchType === '1'}"
                ></el-input>
                <el-button v-show="icShow" class type="success" style="width:0px;">IC</el-button>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="deliveryState"
                  clearable
                  placeholder="请选择"
                  class="deliveryState"
                >
                  <el-option value="0" label="未发药"></el-option>
                  <el-option value="1" label="已发药"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row style="margin-top:10px">
              <el-col :span="9">
                <el-button @click="search(2)" class type="primary" plain>往日处方查询</el-button>
              </el-col>
              <el-col :span="9">
                <el-button @click="search(1)" class type="primary" plain>本日处方查询</el-button>
              </el-col>
              <el-col :span="6">
                <el-button @click="search(0)" class type="primary">查询</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table-page">
            <div
              class="overflow-scroll-vertical"
              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled"
            >
              <el-table
                ref="recipeTable"
                :data="recipeTable"
                highlight-current-row
                @row-click="findDetail"
                tooltip-effect="dark"
                style="width: 100%;"
                max-height="500px"
              >
                <el-table-column
                  prop="patientName"
                  label="病人姓名"
                  min-width="80"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="patientGender"
                  label="性别"
                  min-width="30"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="recipeCode" label="处方号" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="deliveryState"
                  min-width="60"
                  label="状态"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.deliveryState=='0'">未发药</span>
                    <span v-if="scope.row.deliveryState=='1'">已发药</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="chargeTime"
                  min-width="120"
                  label="收费时间"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">{{ scope.row.chargeTime }}</template>
                </el-table-column>
              </el-table>
              <p v-if="loading" class="bottom-container">加载中...</p>
              <p v-if="noMore" class="bottom-container">没有更多了</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!--右侧工具箱-->
    <div id="right" class="column" ref="right">
      <div class="box">我是right</div>
    </div>
  </div>
</template>

<script>
import adHeight from "@/mixins/adHeight";
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";

export default {
  mixins: [adHeight],
  data() {
    return {
      searchType: "",
      dispenseUserId: "",
      windowCode: "",
      date: "",
      queryValue: "",
      dateShow: false,
      inputShow: true,
      icShow: true,
      deliveryState: "",
      pharWindowList: [],
      recipeForm: {},

      loading: false, //左侧申请列表滑动加载状态
      noMore: false, // 左侧申请列表没有更多数据
      recipeTable: [],

      orderTable: [],
      // 表格分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: "sizes,prev,pager,next,jumper,total"
      }
    };
  },
  mounted() {
    this.searchType = "1";
    this.listForDropDown();
  },
  methods: {
    async listForDropDown() {
      this.pharWindowList = await base.pharWindowForDropDown({
        pharCode: "001"
      });
    },
    radioChange(val) {
      if (val == 0) {
        this.dateShow = true;
        this.inputShow = false;
        this.icShow = false;
      } else if (val == 1) {
        this.dateShow = false;
        this.inputShow = true;
        this.icShow = true;
      } else {
        this.dateShow = false;
        this.inputShow = true;
        this.icShow = false;
      }
    },
    async search(val) {
      try {
        this.$showLoading();
        let param = { orderBy: "delivery" };
        const nowTimeDate = new Date();
        if (val == 0) {
          // 查询
          if (this.searchType == 0) {
            Object.assign(param, {
              sChargeDate: this.date[0],
              eChargeDate: this.date[1],
              deliveryState: this.deliveryState
            });
          } else {
            Object.assign(param, {
              recipeCode: this.queryValue,
              deliveryState: this.deliveryState
            });
          }
        } else if (val == 1) {
          Object.assign(param, {
            sChargeDate: new Date(nowTimeDate.setHours(0, 0, 0, 0)).format(
              "yyyy-MM-dd hh:mm:ss"
            ),
            eChargeDate: new Date(nowTimeDate.setHours(23, 59, 59, 999)).format(
              "yyyy-MM-dd hh:mm:ss"
            )
          });
        } else if (val == 2) {
          Object.assign(param, {
            eChargeDate: new Date(nowTimeDate.setHours(0, 0, 0, 0)).format(
              "yyyy-MM-dd hh:mm:ss"
            )
          });
        }
        console.log(param);
        let response = await opha.list(param);
        let { data } = response;
        let table = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          table.push(item);
        }
        this.recipeTable = table;
        this.recipeForm = {};
        this.orderTable = [];
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    async pause() {
      try {
        this.$showLoading();
        let response = await base.pausePharWindow({
          pharCode: "001",
          windowCode: this.windowCode,
          isPause: 1
        });
        let data = response;
        this.$message.success(data);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async findDetail(row) {
      try {
        this.$showLoading();
        let response = await opha.get(row.id);
        let { data } = response;
        this.recipeForm = {
          id: data.id,
          feeType: data.feeType,
          recipeCode: data.recipeCode,
          patientName: data.patientName,
          patientGender: data.patientGender,
          patientAge: data.patientAge,
          patientCode: data.patientCode,
          doctorDeptName: data.doctorDeptName,
          patientAddr: data.patientAddr,
          phoneNum: data.phoneNum,
          clinicDiag: data.clinicDiag,
          orderTime: new Date(data.orderTime).format("yyyy-MM-dd hh:mm:ss"),
          doctorUserName: data.doctorUserName,
          chargeUserName: data.chargeUserName,
          prescriptionAmt: data.prescriptionAmt
        };
        this.orderTable = [...data["recipeDVOList"]];
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async cancelDelivery() {
      try {
        this.$showLoading();
        if (!this.recipeForm.id) {
          this.$message.error("id不能为空");
          this.$hideLoading();
          return;
        }
        let { data } = await opha.cancelDelivery(this.recipeForm.id);
        this.$message.success(data);
        this.search(0);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async delivery() {
      try {
        this.$showLoading();
        if (!this.recipeForm.id) {
          this.$message.error("id不能为空");
          this.$hideLoading();
          return;
        }
        let { data } = await opha.delivery(this.recipeForm.id);
        this.$message.success(data);
        this.search(0);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },

    // // 滑动加载
    async load() {
      try {
        this.page++;
        this.loading = true;
        const _this = this;
        setTimeout(function() {
          _this.recipeTable.push({
            patientName: "病人姓名", // 病人姓名
            recipeCode: "", //处方号
            patientGender: "女", //性别
            deliveryState: "状态", // 状态
            chargeTime: "" //收费时间
          });
          // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
          _this.loading = false;
          // 通常异步操作完成后会根据返回值设定noMore
          _this.noMore = this.count >= 20;
        }, 5000);
      } catch (e) {
        console.log("报错了");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$leftWidth: 440px;
$rightWidth: 287px;
.three-column {
  min-width: 1024px;
  padding-left: $leftWidth;
  padding-right: $rightWidth;
  .column {
    float: left;
    height: 100%;
    .box {
      height: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      .top {
        padding: 10px;
      }
      .bottom {
        padding: 10px;
      }
    }
  }
  #left {
    width: $leftWidth;
    margin-left: -100%;
    position: relative;
    right: $leftWidth;
    padding-left: 0;
    .table-top {
      width: 100%;
      height: 110px;
      /deep/ .el-row {
        height: 36px;
      }
      .cardInput {
        width: 75%;
      }
      .deliveryState {
        margin-left: 3px;
      }
    }
    .table-page {
      margin-top: 20px;
      width: 100%;
      height: calc(100% - 130px);
      overflow: hidden;
      bottom: 5px;
      .ullist {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }
  #center {
    width: 100%;
    /deep/ .el-form-item {
      margin-bottom: 15px;
    }
    /deep/ .el-form-item--medium .el-form-item__label {
      line-height: 20px;
    }
    /deep/ .el-form-item__content {
      line-height: 20px;
    }
    .titleinput{
        margin-bottom: 10px;
        border-bottom: 1px solid $l-color-bgcolor-18;
    }
    .el-row {
      .disabled {
        background: $l-color-bgcolor-18;
      }
    }
    .bottom-div {
      width: 100%;
      height: 60px;
      line-height: 60px;
      p {
        padding: 0 20px;
        span {
          color: #2e323a;
        }
      }
    }
    .el-button + .el-button {
      margin-left: 0px;
    }
    .cftitle {
      .bfcolor {
        color: #949da3;
        font-size: 12px;
      }
      .title {
        font-size: 20px;
        color: #2e323a;
        display: block;
        text-align: center;
      }
    }
  }
}
#right {
  margin-right: -$rightWidth;
  width: $rightWidth;
  padding-right: 0;
}
.bottom-container {
  text-align: center;
  padding: 20px 0px;
}
</style>
