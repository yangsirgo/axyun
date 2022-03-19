<template>
  <div class="three-column" ref="page">
    <div class="trigger" ref="triggerBtn" @click="shrinkHandler">
      <i class="el-icon-arrow-left"></i>
    </div>

    <div id="left" v-show="show" ref="left" class="column">
      <div class="box">
        <patient :isMultiple="isMultiple"></patient>
      </div>
    </div>
    <div id="center" :class="{ 'right-con-left': show }" class="column">
      <div class="box">
        <div class="top">
          <p class="top-msg">
            <span>05床 刘明海 男 22岁 </span>
            <span class="hospital-num">000098746</span>
          </p>
          <div class="top-patient-con">
            <el-row>
              <el-col :span="5">
                <p>
                  <span class="text-title">当前科室</span>
                  <span class="text-contain">泌尿外科</span>
                </p>
              </el-col>
              <el-col :span="5"
                ><p>
                  <span class="text-title">结算类型</span>
                  <span class="text-contain">本地自费</span>
                </p></el-col
              >
              <el-col :span="5"
                ><p>
                  <span class="text-title">身份证号</span>
                  <span class="text-contain">430822199802190823</span>
                </p></el-col
              >
            </el-row>
            <el-row class="marign-top-row">
              <el-col :span="5">
                <p>
                  <span class="text-title">入院日期</span>
                  <span class="text-contain">2019-06-11</span>
                </p>
              </el-col>
              <el-col :span="5"
                ><p>
                  <span class="text-title">出院日期</span>
                  <span class="text-contain">2019-07-20</span>
                </p></el-col
              >
              <el-col :span="5"
                ><p>
                  <span class="text-title">住院状态</span>
                  <span class="text-contain">预出院</span>
                </p></el-col
              >
            </el-row>
            <el-row class="marign-top-row">
              <el-col :span="5">
                <p>
                  <span class="text-title">费用总额</span>
                  <span class="text-contain">2500.00</span>
                </p>
              </el-col>
              <el-col :span="5"
                ><p>
                  <span class="text-title">预交金</span>
                  <span class="text-contain">1000.00</span>
                </p></el-col
              >
              <el-col :span="5"
                ><p>
                  <span class="text-title">余额</span>
                  <span class="text-contain special-color">-1500.00</span>
                </p></el-col
              >
            </el-row>
          </div>
        </div>
        <div class="middle">
          <TCardTitle style="margin-left: 20px;">
            <span slot="left">出院结算</span>
          </TCardTitle>
          <p class="out-hospital-msg">
            2019-07-20（种类：2，总数量：5，¥90.00）
          </p>
          <div class="middle-table-con">
            <el-table
              border
              ref="singleTable"
              highlight-current-row
              style="width: 100%"
              class="middle-table-single"
              :data="outHospitalList"
              v-loading="tableLoading"
              element-loading-text="列表正在加载中"
              height="300"
            >
              <el-table-column
                class="overflow-point"
                v-for="(item, index) in table_middle_column"
                :key="index"
                :prop="item.prop"
                :min-width="item.width"
                :label="item.label"
                :fixed="item.fixed === true"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="bottom">
          <p class="column-list">
            <LInputwithTitle
              class="input-bg-color"
              disabled
              :title="outHospitalTitle"
              :value="outHospitalValue"
            >
            </LInputwithTitle>
            <LSelectWithTitle
              class="ml-distance"
              :title="returnTypeTitle"
              :value="returnTypeValue"
            >
              <el-option
                v-for="item in returnTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </LSelectWithTitle>
            <LInputwithTitle
              class="ml-distance"
              :title="returnRealTitle"
              :value="returnRealValue"
            >
            </LInputwithTitle>
            <LInputwithTitle
              class="ml-distance"
              :title="changeTitle"
              :value="changeValue"
            >
            </LInputwithTitle>
            <el-button
              class="ml-distance"
              @click="outHospitalChange"
              type="primary"
              >出院结算</el-button
            >
          </p>
          <p class="bottom-tips">
            * 发票打印，请到住院结算窗口进行打印
          </p>
        </div>
      </div>
    </div>
    <div id="right" class="column" ref="right">
      <div class="box">
        <TCardTitle style="margin-left: 20px;">
          <span slot="left">项目类别</span>
        </TCardTitle>
        <el-table
          class="middle-table-singleTable"
          ref="singleTable"
          border
          :data="projectList"
          highlight-current-row
          height="300px"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, index) in table_project_column"
            :key="index"
            :prop="item.prop"
            :min-width="item.width"
            :label="item.label"
            :fixed="item.fixed === true"
          >
          </el-table-column>
        </el-table>
        <TCardTitle style="margin-left: 20px;">
          <span slot="left">预交金信息</span>
        </TCardTitle>
        <el-table
          border
          :data="messageList"
          highlight-current-row
          height="500px"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, index) in table_message_column"
            :key="index"
            :prop="item.prop"
            :min-width="item.width"
            :label="item.label"
            :fixed="item.fixed === true"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import patient from "../components/Patient";
import { addClass, removeClass, hasClass, getEleByCls } from "@/utils/util";

export default {
  data() {
    return {
      outHospitalTitle: "出院退补",
      outHospitalValue: "3500.00",
      returnTypeTitle: "退补方式",
      returnTypeValue: "手机支付",
      returnRealTitle: "实退",
      returnRealValue: 1234.0,
      changeTitle: "找零",
      changeValue: "2266.00",
      isMultiple: true,
      show: true,
      tableLoading: false,
      returnTypeOption: [
        {
          value: 1,
          label: "手机支付"
        },
        {
          value: 2,
          label: "现金支付"
        }
      ],
      table_middle_column: [
        {
          prop: "projectType",
          label: "项目类别",
          width: "20"
        },
        {
          prop: "projectCode",
          label: "项目代码",
          width: "20"
        },
        {
          prop: "projectName",
          label: "项目名称",
          width: "60"
        },
        {
          prop: "specification",
          label: "规格",
          width: "20"
        },
        {
          prop: "price",
          label: "单价",
          width: "20"
        },
        {
          prop: "amount",
          label: "数量",
          width: "20"
        },
        {
          prop: "cost",
          label: "金额",
          width: "20"
        },
        {
          prop: "execDate",
          label: "执行时间",
          width: "40"
        }
      ],
      outHospitalList: [
        {
          id: 1,
          projectType: "西药",
          projectCode: "1102",
          projectName: "0.9%氯化钠注射液",
          specification: "500ml*1",
          price: "20.00",
          amount: 4,
          cost: "80.00",
          execDate: "2019-07-20 17:31"
        }
      ],
      table_project_column: [
        {
          prop: "type",
          label: "类别",
          width: "60"
        },
        {
          prop: "cost",
          label: "金额",
          width: "60"
        }
      ],
      projectList: [
        {
          id: 1,
          type: "西药类",
          cost: "500.00"
        },
        {
          id: 2,
          type: "检查费",
          cost: "200.00"
        },
        {
          id: 3,
          type: "监护费",
          cost: "900.00"
        },
        {
          id: 4,
          type: "床位费",
          cost: "900.00"
        }
      ],
      table_message_column: [
        {
          prop: "payDate",
          label: "交款日期",
          width: "70"
        },
        {
          prop: "cost",
          label: "金额",
          width: "40"
        },
        {
          prop: "paymentWay",
          label: "支付方式",
          width: "40"
        }
      ],
      messageList: [
        {
          id: 1,
          payDate: "2019-06-23 17:00",
          cost: "3000.00",
          paymentWay: "现金"
        },
        {
          id: 2,
          payDate: "2019-06-23 17:00",
          cost: "3000.00",
          paymentWay: "支付宝"
        },
        {
          id: 3,
          payDate: "2019-06-12 09:12",
          cost: "3000.00",
          paymentWay: "微信"
        }
      ]
    };
  },
  created() {},
  components: {
    patient
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 点击伸缩按钮
    shrinkHandler() {
      let tigerBen = this.$refs.triggerBtn;
      let box_content = this.$refs.page;
      if (hasClass(tigerBen, "triggerClosed")) {
        this.show = true;
        removeClass(tigerBen, "triggerClosed");
        removeClass(box_content, "centerShrieked");
      } else {
        this.show = false;
        addClass(tigerBen, "triggerClosed");
        addClass(box_content, "centerShrieked");
      }
    },
    initData() {
      // 初始化table数据
    },
    // 出院结算
    outHospitalChange() {
      //
    }
  }
};
</script>
<style lang="scss" scoped>
$leftWidth: 287px;
$rightWidth: 287px;
$bgc: rgba(255, 255, 255, 1);
.three-column {
  min-width: 1024px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;

  .trigger {
    position: absolute;
    top: calc(50% - 40px);
    height: 80px;
    left: 270px;
    width: 18px;
    z-index: 1000;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 2px 0px 0px 2px;
    cursor: pointer;

    > i {
      position: relative;
      color: $l-color-primary;
      top: 40%;
      left: 1px;
    }
  }
  .triggerClosed {
    left: 0px;

    > i {
      transform: rotate(180deg);
    }
  }
  .centerShrieked {
    padding-left: 0;
    margin-left: 0;

    > .left {
      display: none;
    }
  }

  .column {
    height: 100%;
    .box {
      position: relative;
      height: 100%;
      box-sizing: border-box;
      // border-radius: 4px;
      background-color: $bgc;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      .top {
        padding: 20px;
        .top-msg {
          font-size: 14px;
          
          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          line-height: 20px;
          .hospital-num {
            margin-left: 10px;
            color: #3d7dfb;
          }
        }
        .top-patient-con {
          margin-top: 20px;
          font-size: 14px;
          
          font-weight: 400;
          line-height: 20px;
          .marign-top-row {
            margin-top: 21px;
          }
          .text-title {
            display: inline-block;
            width: 60px;
            color: rgba(148, 157, 163, 1);
          }
          .text-contain {
            color: rgba(46, 50, 58, 1);
          }
          .special-color {
            color: #e1140a;
          }
        }
      }
      .middle {
        .out-hospital-msg {
          margin: 0 20px;
          padding-left: 20px;
          height: 40px;
          line-height: 40px;
          background: rgba(246, 246, 246, 1);
          font-size: 14px;
          
          font-weight: 400;
        }
        .middle-table-con {
          margin: 10px 20px 20px 20px;
          .middle-table-single {
          }
        }
      }
      .bottom {
        padding: 20px;
        width: 100%;
        height: 116px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e4e4e4;
        font-size: 0;
        .column-list {
          .input-bg-color {
            background-color: #f5f5f5;
          }
          .ml-distance {
            margin-left: 40px;
          }
        }
        .bottom-tips {
          margin-top: 20px;
          font-size: 14px;
          
          font-weight: 400;
          color: $l-color-primary;
          line-height: 20px;
        }
      }
    }
  }
  #left {
    margin-right: 20px;
    width: $leftWidth;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    // border-radius: 4px;
    background-color: $bgc;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  #center {
    flex: 1;
    width: 100%;
  }

  #right {
    margin-left: 20px;
    width: $rightWidth;
  }

  #center.right-con-left {
    margin-left: 0px;
  }
  /deep/ .cardtitle {
    background-color: rgba(255, 255, 255, 0);
  }
  /deep/ .l-input-wrap {
    width: 200px;
  }
}
</style>
