<template>
  <div class="height100 three-column">
    <!--center-->
    <div id="center" class="column">
      <div class="box">
        <el-card class="height100">
          <div class="top-card">
            <el-row :gutter="20" style="padding:0 20px;">
              <el-col :span="4">
                <LFormtTitle label="配药人" labelWidth="50">
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
              <el-col :span="4">
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

              <el-col :span="16" style="text-align: right">
                <el-button
                  @click="dispense"
                  class="filter-item"
                  type="text"
                  icon="el-icon-collection"
                >配药确认</el-button>
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
          </div>
          <el-card class="middle">
            <el-form :inline="true">
              <el-row :gutter="20" style="padding:10px 20px;">
                <el-col :span="1">
                  <el-button @click="search(0)" type="primary" size="small">刷新</el-button>
                </el-col>

                <el-col :span="6">
                  <LFormtTitle label="收费时间" labelWidth="64">
                    <el-date-picker
                      v-model="date"
                      class
                      type="datetimerange"
                      align="right"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :default-time="['12:00:00', '08:00:00']"
                    ></el-date-picker>
                  </LFormtTitle>
                </el-col>
                <el-col :span="4">
                  <LFormtTitle label="配药类型" labelWidth="64">
                    <el-select v-model="dispenseState" placeholder="请选择">
                      <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="4">
                  <LFormtTitle label="处方号" labelWidth="50">
                    <el-input v-model="recipeCode" style="line-height: 34px;">
                      <template slot="append">请输入</template>
                    </el-input>
                  </LFormtTitle>
                </el-col>

                <el-col :span="3">
                  <el-button @click="search(1)" type="primary" size="small">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-row class="tables" style="padding:0 20px;">
              <div v-infinite-scroll="load" infinite-scroll-disabled="disabled" class="ullist overflow-scroll-vertical">
                <el-table
                  ref="recipeTable"
                  :data="recipeTable"
                  highlight-current-row
                  style="width: 100%"
                  max-height="450px"
                  @row-click="findDetail"
                  header-align="center"
                  border
                >
                  <el-table-column prop="recipeCode" label="处方号" min-width="80"></el-table-column>
                  <el-table-column prop="patientCode" label="病人编号" min-width="65"></el-table-column>
                  <el-table-column
                    prop="patientName"
                    label="病人姓名"
                    min-width="65"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="patientGender"
                    label="性别"
                    min-width="30"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column prop="patientAge" label="年龄" min-width="30"></el-table-column>
                  <el-table-column
                    prop="doctorDeptName"
                    label="科室"
                    min-width="40"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column prop="unit" label="诊断" min-width="35" show-overflow-tooltip></el-table-column>
                  <el-table-column
                    prop="preWindowCode"
                    label="指定窗口"
                    min-width="50"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column prop="chargeState" label="收费状态" min-width="50">
                    <template slot-scope="scope">
                      <span v-if="scope.row.chargeState=='0'">未收费</span>
                      <span v-if="scope.row.chargeState=='1'">已收费</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="chargeTime" label="收费时间" min-width="120"></el-table-column>
                  <el-table-column prop="dispenseState" min-width="50" label="配方状态">
                    <template slot-scope="scope">
                      <span v-if="scope.row.dispenseState=='0'">未配药</span>
                      <span v-if="scope.row.dispenseState=='1'">已配药</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="dispenseUserName"
                    min-width="60"
                    label="配方人员"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column prop="dispenseTime" min-width="120" label="配方时间"></el-table-column>
                  <el-table-column prop="printState" label="是否打印" min-width="50">
                    <template slot-scope="scope">
                      <span v-if="scope.row.printState=='0'">未打印</span>
                      <span v-if="scope.row.printState=='1'">已打印</span>
                    </template>
                  </el-table-column>
                </el-table>
                <p v-if="loading" class="bottom-container">加载中...</p>
                <p v-if="noMore" class="bottom-container">没有更多了</p>
              </div>
            </el-row>
          </el-card>
          <el-card class="bottom" style="padding:0 20px;">
            <el-table
              ref="orderTable"
              :data="orderTable"
              tooltip-effect="dark"
              border
              style="min-width: 100%"
            >
              <el-table-column prop="drugName" label="药品名称" min-width="65"></el-table-column>
              <el-table-column prop="spec" label="规格" min-width="100"></el-table-column>
              <el-table-column prop="spac" label="进价" min-width="65" show-overflow-tooltip></el-table-column>
              <el-table-column prop="price" label="售价" min-width="65" show-overflow-tooltip></el-table-column>
              <el-table-column prop="oneDosage" label="一次用量" min-width="40" show-overflow-tooltip></el-table-column>
              <el-table-column prop="dosageUnit" label="剂量单位" min-width="40" show-overflow-tooltip></el-table-column>
              <el-table-column prop="drugQuantity" label="数量" min-width="40" show-overflow-tooltip></el-table-column>
              <el-table-column prop="drugUnit" label="单位" min-width="40" show-overflow-tooltip></el-table-column>
              <el-table-column prop="frequencyCode" label="频率" min-width="40" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="medicationCode"
                label="用法"
                min-width="40"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="specialUsage"
                min-width="60"
                label="特殊用法"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </el-card>
        </el-card>
      </div>
    </div>

    <!--right工具箱-->
    <div id="right" class="column" ref="right">
      <div class="box">我是right</div>
    </div>
  </div>
</template>

<script>
import LFormtTitle from "@/components/LFormtTitle.vue";
import LTimeLineLoadMore from "@/components/LTimeLineLoadMore";
import adHeight from "@/mixins/adHeight";
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";
export default {
  mixins: [adHeight],
  data() {
    return {
      id: "",
      dispenseUserId: "",
      windowCode: "",
      date: "",
      recipeCode: "",
      dispenseState: "",
      pharWindowList: [],

      loading: false, //左侧申请列表滑动加载状态
      noMore: false, // 左侧申请列表没有更多数据
      recipeTable: [],
      orderTable: []
    };
  },
  mounted() {
    this.listForDropDown();
  },
  methods: {
    async listForDropDown() {
      this.pharWindowList = await base.pharWindowForDropDown({
        pharCode: "001"
      });
    },
    async search(type) {
      try {
        this.$showLoading();
        let param = {};
        if (type) {
          param = {
            orderBy: "dispense",
            sDate: this.date[0],
            eDate: this.date[1],
            dispenseState: this.dispenseState,
            recipeCode: this.recipeCode
          };
        } else {
          param = {
            orderBy: "dispense",
            sDate: this.date[0],
            eDate: this.date[1],
            dispenseState: 0,
            chargeState: 1
          };
        }
        let response = await opha.list(param);
        let { data } = response;
        let table = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          table.push(item);
        }
        this.recipeTable = table;
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
        let response = await opha.listD({
          recipeCode: row.recipeCode
        });
        let { data } = response;
        let table = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          table.push(item);
        }
        this.orderTable = table;
        this.id = row.id;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async dispense() {
      try {
        this.$showLoading();
        if (!this.id) {
          return;
        }
        let { data } = await opha.dispense(this.id);
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
            recipeCode: "00001", // 处方号
            patientCode: "病人编号", //病人编号
            patientName: "病人姓名", // 病人姓名
            patientGender: "女", //性别
            patientAge: "18", // 年龄
            doctorDeptName: "科室", // 科室
            unit: "诊断", // 诊断
            preWindowCode: "指定窗口", // 指定窗口
            chargeState: "1" ,// 收费状态
            chargeTime:"",//收费时间
            dispenseState:"",//配方状态
            dispenseUserName:"",//配方人员
            dispenseTime:"",//配方时间
            printState:"",//printState
          });
          // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
          _this.loading = false;
          // 通常异步操作完成后会根据返回值设定noMore
          _this.noMore = this.count >= 20;
        }, 5000);
      } catch (e) {
        console.log("报错了");
      }
    },
  }
};
</script>

<style lang="scss" scoped>
$rightWidth: 287px;
.three-column {
  min-width: 1024px;
  padding-right: $rightWidth;
  .column {
    float: left;
    height: 100%;
    .box {
      height: 100%;
      box-sizing: border-box;
      border-radius: 4px;
    }
  }
  #center {
    width: 100%;
    .top-card {
      padding-top: 10px;
      margin-bottom: 10px;
      height: 50px;
    }
    .middle {
      position: relative;
      margin-bottom: 10px;
      height: calc(100% - 250px - 70px);
      .btn-loadMore {
        padding: 0;
        text-align: center;
      }
    }
    .bottom {
      margin-bottom: 10px;
      width: 100%;
      height: 250px;
    }
  }
  #right {
    margin-right: -$rightWidth;
    width: $rightWidth;
    padding-right: 0;
  }
}
.bottom-container {
  text-align: center;
  padding: 20px 0px;
}
</style>
