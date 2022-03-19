<template>
  <div class="main-card">
    <div class="top-con">
      <l-card-title class="clearfix card-header" ref="header">
        <span slot="left">已签到患者</span>
      </l-card-title>
      <div class="datepicker-con">
        <LFormtTitle label="签到日期" labelWidth="64">
          <el-date-picker
            v-model="chooseDate"
            type="daterange"
            prefix-icon="icon iconfont iconriqi"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </LFormtTitle>
      </div>
      <div class="input-con">
        <LFormtTitle label="姓名" labelWidth="40">
          <el-input v-model="inputValue" style="line-height: 34px;"> </el-input>
        </LFormtTitle>
      </div>
      <div class="button-con">
        <el-button type="primary" class="btn" @click="queryDataFunc"
          >查询</el-button
        >
        <el-button type="primary" class="btn-not" @click="resetFormFunc"
          >重置</el-button
        >
      </div>
    </div>
    <div class="box-card-con">
      <div class="box-card">
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-tab-pane
            :label="item.labelName"
            :key="index"
            :name="item.labelName"
            v-for="(item, index) in tabDataList"
          >
            <el-table
              header-cell-class-name="headerCls"
              row-class-name="rowStyleCls"
              ref="singleTable"
              :data="item.tabsList"
              highlight-current-row
              style="width: 100%"
              v-loadmore="load"
              stripe
              border
              v-loading="item.isLoading"
              element-loading-text="加载中..."
            >
              <el-table-column
                v-for="item in tableColumn"
                :key="item.label"
                :label="item.label"
                :prop="item.prop"
                align="left"
                show-overflow-tooltip
                header-align="left"
                :min-width="item.width"
              >
                <!-- 状态列 处理 -->
                <template slot-scope="scope">
                  <template v-if="item.prop === 'status'">
                    <span v-if="scope.row[item.prop] === 0">待诊</span>
                    <span
                      v-if="scope.row[item.prop] === 1"
                      class="status-active"
                      >已诊</span
                    >
                  </template>
                  <!-- 门诊号列 处理 -->
                  <template v-else-if="item.prop === 'outPatientNum'">
                    <span class="outPatientNum-color">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <!-- 患者列  处理 -->
                  <template v-else-if="item.prop === 'patientInfo'">
                    <span>{{ scope.row[item.prop].name }}</span>
                    <span>{{
                      scope.row[item.prop].sex === 0 ? "男" : "女"
                    }}</span>
                    <span>{{ scope.row[item.prop].age + "岁" }}</span>
                  </template>
                  <template v-else-if="item.prop === 'operate'">
                    <span
                      class="operate-name"
                      @click="showReturnModel(scope.row.id)"
                      >回诊</span
                    >
                  </template>
                  <template v-else>
                    <span>{{ scope.row[item.prop] }}</span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 回诊弹窗 -->
    <return-comfirm-model
      :is-show="returnComfirmFlag"
      :patientid="returnPatientId"
      @closeReturnModel="closeReturnModel"
    ></return-comfirm-model>
  </div>
</template>

<script>
import returnComfirmModel from "./returnComfirmModel";
import {getArrivedList} from "@/api/appointment/appointment";

export default {
  data() {
    return {
      activeName: "10诊室(10)", // 默认选中的tab TODO: 需要处理

      returnPatientId: "", // 传入回诊弹窗的ID
      returnComfirmFlag: false, // 控制回诊弹窗显示变量
      tableColumn: [
        {
          prop: "queueNum",
          label: "排队号",
          width: "20"
        },
        {
          prop: "status",
          label: "状态",
          width: "15"
        },
        {
          prop: "doctorName",
          label: "接诊医生",
          width: "30"
        },
        {
          prop: "outPatientNum",
          label: "门诊号",
          width: "35"
        },
        {
          prop: "patientInfo",
          label: "患者",
          width: "50"
        },
        {
          prop: "orderTime",
          label: "预约时间",
          width: "30"
        },
        {
          prop: "signOperator",
          label: "签到操作人",
          width: "60"
        },
        {
          prop: "signTime",
          label: "签到时间",
          width: "40"
        },
        {
          prop: "operate",
          label: "操作",
          width: "20"
        }
      ],
      tlm_isLoading: false,
      inputValue: "", // 获取输入框值
      chooseDate: [], // 默认选择的时间
      // 模拟数据
      tabDataList: [
        {
          labelName: "10诊室(10)",
          patientNumber: 10,
          isLoading: false, // 控制每个table 加载的
          tabsList: [
            {
              id: 1,
              queueNum: 56,
              status: 0, // 待诊
              doctorName: "林浩然", // 接诊医生
              outPatientNum: "00000564371", // 门诊号
              patientInfo: {
                name: "吴兰",
                sex: 1, // 0 男 1 女
                age: 23 // 年龄
              },
              orderTime: "08:30", // 预约时间
              signOperator: "王立明", // 签到操作人
              signTime: "2019-06-29 08:20" // 签到时间
            },
            {
              id: 2,
              queueNum: 76,
              status: 1, // 待诊
              doctorName: "陈普利", // 接诊医生
              outPatientNum: "00000234392", // 门诊号
              patientInfo: {
                name: "李秀丽",
                sex: 1, // 0 男 1 女
                age: 51 // 年龄
              },
              orderTime: "08:45", // 预约时间
              signOperator: "（自助）泌外护士站5号机器", // 签到操作人
              signTime: "2019-06-29 08:30" // 签到时间
            },
            {
              id: 3,
              queueNum: 96,
              status: 0, // 待诊
              doctorName: "张家盛", // 接诊医生
              outPatientNum: "00000234268", // 门诊号
              patientInfo: {
                name: "秦海明",
                sex: 0, // 0 男 1 女
                age: 56 // 年龄
              },
              orderTime: "09:00", // 预约时间
              signOperator: "（自助）扫码签到", // 签到操作人
              signTime: "2019-06-29 08:50" // 签到时间
            }
          ]
        },
        {
          labelName: "3诊室(5)",
          patientNumber: 5,
          isLoading: false, // 控制每个table 加载的
          tabsList: [
            {
              id: 2,
              queueNum: 76,
              status: 1, // 待诊
              doctorName: "陈普利", // 接诊医生
              outPatientNum: "00000234392", // 门诊号
              patientInfo: {
                name: "李秀丽",
                sex: 1, // 0 男 1 女
                age: 51 // 年龄
              },
              orderTime: "08:45", // 预约时间
              signOperator: "（自助）泌外护士站5号机器", // 签到操作人
              signTime: "2019-06-29 08:30" // 签到时间
            },
            {
              id: 3,
              queueNum: 746,
              status: 0, // 待诊
              doctorName: "张家盛", // 接诊医生
              outPatientNum: "00000234268", // 门诊号
              patientInfo: {
                name: "秦海明",
                sex: 0, // 0 男 1 女
                age: 56 // 年龄
              },
              orderTime: "09:00", // 预约时间
              signOperator: "（自助）扫码签到", // 签到操作人
              signTime: "2019-06-29 08:50" // 签到时间
            }
          ]
        },
        {
          labelName: "8诊室(7)",
          patientNumber: 7,
          isLoading: false, // 控制每个table 加载的
          tabsList: [
            {
              id: 1,
              queueNum: 56,
              status: 0, // 待诊
              doctorName: "林浩然", // 接诊医生
              outPatientNum: "00000564371", // 门诊号
              patientInfo: {
                name: "吴兰",
                sex: 1, // 0 男 1 女
                age: 23 // 年龄
              },
              orderTime: "08:30", // 预约时间
              signOperator: "王立明", // 签到操作人
              signTime: "2019-06-29 08:20" // 签到时间
            },
            {
              id: 2,
              queueNum: 376,
              status: 1, // 待诊
              doctorName: "陈普利", // 接诊医生
              outPatientNum: "00000234392", // 门诊号
              patientInfo: {
                name: "李秀丽",
                sex: 1, // 0 男 1 女
                age: 51 // 年龄
              },
              orderTime: "08:45", // 预约时间
              signOperator: "（自助）泌外护士站5号机器", // 签到操作人
              signTime: "2019-06-29 08:30" // 签到时间
            },
            {
              id: 3,
              queueNum: 20,
              status: 0, // 待诊
              doctorName: "张家盛", // 接诊医生
              outPatientNum: "00000234268", // 门诊号
              patientInfo: {
                name: "秦海明",
                sex: 0, // 0 男 1 女
                age: 56 // 年龄
              },
              orderTime: "09:00", // 预约时间
              signOperator: "（自助）扫码签到", // 签到操作人
              signTime: "2019-06-29 08:50" // 签到时间
            }
          ]
        }
      ]
    };
  },
  components: {
    returnComfirmModel
  },
  mounted() {
    this.loadTable();
  },
  methods: {
    // 监听 回诊弹窗 发布的事件closeReturnModel
    closeReturnModel() {
      this.returnComfirmFlag = false;
    },
    // 点击查询按钮触发的事件
    queryDataFunc() {
      // 异步请求数据  获取 数据后渲染到页面上
      // TODO: request
      try {
      } catch (error) {}
    },
    // 清空输入框中的数据
    resetFormFunc() {
      // console.log(this.chooseDate);
      // console.log(this.inputValue);
      this.chooseDate = [];
      this.inputValue = "";
    },
    // 加载table数据
    async loadTable() {
      console.log("loadTable");
      try {
        this.tlm_isLoading = true;
        // TODO await request 请求列表数据
        let res = getArrivedList({hosId : "1"}).then(result => {
          console.log(result);

        });
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    // table加载事件
    load() {
      const _this = this;
      this.page++;
      // TODO:  异步处理 async 加载更多数据
    },
    // 点击tab 事件
    handleClickTab() {},
    // 点击回诊 调起弹窗
    showReturnModel(id) {
      this.returnComfirmFlag = true;
      // 传入 patientId
      this.returnPatientId = id;
    }
  }
};
</script>

<style lang="scss" scoped>
.main-card {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .top-con {
    font-size: 0;
    .datepicker-con {
      display: inline-block;
      width: 320px;
      font-size: 14px;
      vertical-align: top;
    }
    .input-con {
      margin-left: 10px;
      display: inline-block;
      width: 300px;
      font-size: 14px;
      vertical-align: top;
    }
    .button-con {
      margin-left: 10px;
      display: inline-block;

      vertical-align: top;
      .btn {
        height: 36px;
        font-size: 14px;
        background: $l-color-primary;
        border-radius: 2px;
      }

      .btn-not {
        margin-left: 10px;
        height: 36px;
        border-radius: 2px;
        background: #fff;
        border: 1px solid $l-color-primary;
        font-size: 14px;
        font-weight: 400;
        color: $l-color-primary;
      }
    }
  }
  .box-card-con {
    margin-top: 20px;

    .status-active {
      color: $l-color-primary;
    }
    .outPatientNum-color {
      color: #3d7dfb;
    }
    .operate-name {
      display: inline-block;
      width: 100%;
      height: 28px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
    }
  }
}
</style>
