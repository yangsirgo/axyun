<template>
  <div class="height100 width100 div-cont">
    <div class="order-list-contain height-button-main">
      <div class="middle">
        <div class="middle-left">
          <div class="middle-con">
            <l-card-title class="clearfix card-header" ref="header">
              <span slot="left">患者信息</span>
            </l-card-title>
            <div class="visit-msg-con">
              <div class="visit-msg">
                <div class="width100">
                  <el-row :gutter="24">
                    <el-col :span="2">
                      <p>
                        <span class="text-title">患者状态</span>
                      </p>
                    </el-col>
                    <el-col :span="12">
                      <el-radio
                        v-for="(item, index) in radioList"
                        v-model="radioOne"
                        :key="index"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      >
                    </el-col>
                    <el-col :span="2">
                      <p>
                        <span class="text-title">病人来源</span>
                      </p>
                    </el-col>
                    <el-col :span="8">
                      <el-radio
                        v-for="(item, index) in radioListTwo"
                        :key="index"
                        v-model="radioTwo"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      >
                    </el-col>
                  </el-row>
                  <el-row :gutter="14" class="mar-top-20">
                    <el-col :span="2">
                      <p>
                        <span class="text-title">既往史 </span>
                      </p>
                    </el-col>
                    <el-col :span="12">
                      <el-radio
                        v-for="(item, index) in radioListThree"
                        v-model="radioThree"
                        :key="index"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      >
                    </el-col>
                    <el-col :span="2">
                      <p>
                        <span class="text-title">来诊方式</span>
                      </p>
                    </el-col>
                    <el-col :span="8">
                      <el-radio
                        v-for="(item, index) in radioListFour"
                        v-model="radioFour"
                        :key="index"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      >
                    </el-col>
                  </el-row>

                  <el-row :gutter="10"> </el-row>

                  <!-- <div class="colOne col-style-special">
                    <el-row class="width50 con-left-text top-distance"
                      >特殊人群</el-row
                    >
                    <el-row
                      :gutter="20"
                      class="width50 con-left-text top-distance"
                    >
                      病人来源
                    </el-row>
                  </div> -->
                  <!-- <div class="colOne">
                    <el-row class="width100 con-right-text top-distance">
                      <el-radio
                        v-for="(item, index) in radioList"
                        v-model="radioOne"
                        :key="index"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      >
                    </el-row>
                    <el-row class="width100 con-right-text top-distance">
                      <el-radio
                        v-for="(item, index) in radioListTwo"
                        :key="index"
                        v-model="radioTwo"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      >
                    </el-row>
                  </div>
                  <div class="colOne col-style-special">
                    <el-row class="con-left-text top-distance"></el-row>
                    <el-row class="con-left-text top-distance">
                      来诊方式
                    </el-row>
                  </div>
                  <div class="colOne">
                    <el-row class="width100 con-right-text top-distance">
                      <el-radio
                        v-for="(item, index) in radioListThree"
                        v-model="radioThree"
                        :key="index"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      ></el-row
                    >

                    <el-row class="width100 con-right-text top-distance">
                      <el-radio
                        v-for="(item, index) in radioListFour"
                        v-model="radioFour"
                        :key="index"
                        :label="item.radioKey"
                        >{{ item.radioName }}</el-radio
                      ></el-row
                    >
                  </div> -->
                </div>
              </div>
            </div>
          </div>
          <div class="middle-center">
            <l-card-title class="clearfix card-header" ref="header">
              <span slot="left">体征信息</span>
            </l-card-title>
            <div class="body-con">
              <el-row class="width100"
                ><LInputwithTitle
                  :title="titleBody"
                  :appendUnit="unitOne"
                  :value="valueBody"
                  placeholder="请输入"
                ></LInputwithTitle>
                <LInputwithTitle
                  class="input-con"
                  :title="titleWeight"
                  :appendUnit="unitTwo"
                  :value="valueWeight"
                  placeholder="请输入"
                ></LInputwithTitle>
                <LInputwithTitle
                  class="input-con"
                  :title="titleHeat"
                  :appendUnit="unitThree"
                  :value="valueHeat"
                  placeholder="请输入"
                ></LInputwithTitle
              ></el-row>
              <el-row class="width100 mt10"
                ><LInputwithTitle
                  :title="titleBreathe"
                  :appendUnit="unitFour"
                  :value="valueBreathe"
                  placeholder="请输入"
                ></LInputwithTitle>
                <LInputwithTitle
                  class="input-con"
                  :title="titleHeartRate"
                  :appendUnit="unitFive"
                  :value="valueHeartRate"
                  placeholder="请输入"
                ></LInputwithTitle>
                <LInputwithTitle
                  class="input-con"
                  :title="titleBloodPressure"
                  :appendUnit="unitSix"
                  :value="valueBloodPressure"
                  placeholder="请输入 / 请输入"
                ></LInputwithTitle
              ></el-row>
              <el-row class="width100 mt10"
                ><LInputwithTitle
                  class="oxyhemoglobin "
                  :title="titleOxyhemoglobin"
                  :appendUnit="unitSeven"
                  :value="valueOxyhemoglobin"
                  placeholder="请输入"
                ></LInputwithTitle>
                <LSelectWithTitle
                  class="input-con"
                  :title="titleStatus"
                  :value="valueStatus"
                  ><template>
                    <el-option
                      v-for="item in optionsOne"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </template
                ></LSelectWithTitle>
                <LSelectWithTitle
                  class="input-con"
                  :title="titlevenenation"
                  :value="valuevenenation"
                >
                  <template>
                    <el-option
                      v-for="item in optionsTwo"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </template></LSelectWithTitle
              ></el-row>
              <el-row class="width100 mt10"
                ><LSelectWithTitle
                  :title="titleoxygenUptake"
                  :value="valueoxygenUptake"
                  ><template>
                    <el-option
                      v-for="item in optionsThree"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </template></LSelectWithTitle
              ></el-row>
              <el-row class="width100 mt10">
                <div class="painLevel">
                  疼痛分级
                  <span class="chooseLevel" @click="openPainLevel">{{
                    level === "" ? "选择评分" : level
                  }}</span>
                </div>
                <div class="painLevel ml20">
                  格拉斯哥昏迷评分
                  <span class="chooseLevel" @click="openSpeclModel">{{
                    score ? score + "分" : "选择评分"
                  }}</span>
                </div>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttom-down height-button-bottom">
      <el-button
        type="primary"
        plain
        @click="handleClearData"
        class="float-right mar-top-20 mar-right-20"
        >清屏</el-button
      >

      <el-button
        type="primary"
        plain
        class="float-right mar-top-20 mar-right-10"
        @click="handleKeepUp"
        v-hotKey="{ func: 'func_save' }"
        >暂存</el-button
      >
      <el-button
        class="float-right mar-top-20 mar-right-10"
        type="primary"
        @click="handleCompleteCheck"
        v-hotKey="{ func: 'func_submit' }"
        >完成预检</el-button
      >
    </div>
    <gradedDiagle
      :show="gragedShowFlag"
      @closeModel="handleCloseModel"
      @getGrade="handleGetGrade"
    ></gradedDiagle>
    <painLevel
      :show="painShowFlag"
      @closeModel="handlePainCloseModel"
      @choosePainLevel="handleChoosePainLevel"
    ></painLevel>
  </div>
</template>

<script>
import gradedDiagle from "./gradedDiagle.vue";
import painLevel from "./painLevel.vue";

export default {
  name: "",
  data() {
    return {
      radioOne: "",
      score: 0, // 分数
      gragedShowFlag: false,
      painShowFlag: false,
      level: "", // 疼痛级别
      radioList: [
        { radioName: "老人", radioKey: "oldman" },
        { radioName: "小孩", radioKey: "child" },
        { radioName: "孕妇", radioKey: "pregnant" },
        { radioName: "海外人员", radioKey: "returnee" },
        { radioName: "公众人物", radioKey: "character" }
      ],
      radioTwo: "",
      radioListTwo: [
        { radioName: "市内", radioKey: "incity" },
        { radioName: "市外", radioKey: "outcity" },
        { radioName: "省内", radioKey: "inpro" },
        { radioName: "省外", radioKey: "outpro" }
      ],
      radioThree: "",
      radioListThree: [
        { radioName: "糖尿病", radioKey: "diabetes" },
        { radioName: "高血压", radioKey: "hypertension" },
        { radioName: "心脏病", radioKey: "cardiopathy" },
        { radioName: "哮喘", radioKey: "asthma" },
        { radioName: "无", radioKey: "none" }
      ],
      radioFour: "",
      radioListFour: [
        { radioName: "推入", radioKey: "push" },
        { radioName: "抬入", radioKey: "raise" },
        { radioName: "扶入", radioKey: "help" },
        { radioName: "步行", radioKey: "walk" }
      ],
      titleBody: "身高",
      unitOne: "(cm)",
      valueBody: "", // 身高
      titleWeight: "体重",
      unitTwo: "(kg)",
      valueWeight: "", // 体重
      titleHeat: "体温",
      unitThree: "(℃)",
      valueHeat: "", // 体温
      titleBreathe: "呼吸",
      unitFour: "(次/分)",
      valueBreathe: "", // 呼吸
      titleHeartRate: "心率",
      unitFive: "(次/分)",
      valueHeartRate: "", //心率
      titleBloodPressure: "血压",
      unitSix: "(mmHg)",
      valueBloodPressure: "",
      titleOxyhemoglobin: "血氧饱和度",
      unitSeven: "(%)",
      valueOxyhemoglobin: "", // 血氧饱和度
      titleStatus: "状态意识",
      valueStatus: "", // 状态意思
      optionsOne: [
        {
          value: "1",
          label: "清醒"
        },
        {
          value: "2",
          label: "昏迷"
        }
      ],
      titlevenenation: "中毒",
      valuevenenation: "", // 状态意思
      optionsTwo: [
        {
          value: "1",
          label: "否"
        },
        {
          value: "2",
          label: "是"
        }
      ],
      titleoxygenUptake: "吸氧",
      valueoxygenUptake: "", // 状态意思
      optionsThree: [
        {
          value: "1",
          label: "否"
        },
        {
          value: "2",
          label: "是"
        }
      ]
    };
  },
  methods: {
    // 打开格拉斯哥昏迷评分
    openSpeclModel() {
      this.gragedShowFlag = true;
    },
    // 打开疼痛分级
    openPainLevel() {
      this.painShowFlag = true;
    },
    // 完成预检
    handleCompleteCheck() {
      try {
      } catch (error) {}
    },
    // 暂存
    handleKeepUp() {
      try {
      } catch (error) {}
    },
    handleClearData() {
      this.radioOne = "";
      this.radioTwo = "";
      this.radioThree = "";
      this.radioFour = "";
      this.valueBody = "";
      this.valueWeight = "";
      this.valueHeat = "";
      this.valueBreathe = "";
      this.valueHeartRate = "";
      this.valueBloodPressure = "";
      this.valueOxyhemoglobin = "";
      this.valueStatus = "";
      this.valuevenenation = "";
      this.valueoxygenUptake = "";
    },
    // 关闭弹窗
    handleCloseModel() {
      this.gragedShowFlag = false;
    },
    handlePainCloseModel() {
      this.painShowFlag = false;
    },
    // 获取分数
    handleGetGrade(data) {
      this.score = data.gradeLevel;
    },
    // 获取疼痛等级
    handleChoosePainLevel(data) {
      this.level = data.text;
    }
  },
  components: { gradedDiagle, painLevel }
};
</script>

<style lang="scss" scoped>
.div-cont {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  .mar-top-20 {
    margin-top: 20px;
  }
  .mar-right-10 {
    margin-right: 10px;
  }
  .mar-right-20 {
    margin-right: 20px;
  }

  .buttom-down {
    border-top: 1px solid #e4e4e4;
  }
  .middle {
    padding-right: 20px;
    flex-direction: row;
    height: 100%;
    .middle-left {
      .middle-con {
        padding: 0 20px;
        .visit-msg-con {
          margin-bottom: 20px;
          font-size: 0;
          .visit-msg {
            .img {
              width: 80px;
              height: 102px;
              background: rgba(245, 245, 245, 1);
              border-radius: 2px;
              border: 1px solid rgba(228, 228, 228, 1);
            }
            .col-style {
              width: 60px;
              margin-left: 20px;
            }
            .colOne {
              display: inline-block;
              vertical-align: bottom;
            }
            .col-style-sp {
              margin-left: 20px;
            }
            .col-style-special {
              width: 60px;
            }
            .text-title {
              font-size: 14px;
              font-weight: 400;
              color: rgba(46, 50, 58, 1);
              line-height: 20px;
            }
            .con-right-text {
              font-size: 14px;
              font-weight: 400;
              color: rgba(46, 50, 58, 1);
              line-height: 20px;
            }
            .con-left-text {
              font-size: 14px;
              font-weight: 400;
              color: rgba(148, 157, 163, 1);
              line-height: 20px;
            }
            .top-distance {
              margin-top: 20px;
            }
            .special-color {
              color: $l-color-primary;
            }
            .ml10 {
              margin-left: 10px;
            }
            .col-left-two {
              margin-left: 80px;
            }
          }
        }
      }
      .middle-center {
        padding: 0 20px;
        padding-bottom: 30px;
        font-size: 0;
        .body-con {
          .mt10 {
            margin-top: 10px;
            .input-con {
              font-size: 14px;
              margin-left: 20px;
            }
          }
          .input-con {
            font-size: 14px;
            margin-left: 20px;
          }
          .painLevel {
            display: inline-block;
            padding: 10px 0;
            width: 240px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(148, 157, 163, 1);
            .chooseLevel {
              text-decoration: underline;
              color: #3d7dfb;
              cursor: pointer;
            }
          }
          .ml20 {
            margin-left: 20px;
          }
        }
      }
      .button-con {
        margin-top: 20px;
        text-align: right;
        .button-footer {
          margin-right: 40px;
          font-size: 14px;
        }
      }
    }
  }

  /deep/ .el-radio {
    margin-right: 15px;
  }
  .oxyhemoglobin /deep/ .el-input--medium {
    width: 130px;
  }
}
</style>
