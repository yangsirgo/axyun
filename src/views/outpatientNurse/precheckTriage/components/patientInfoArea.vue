<template>
  <div class="patient-info-area">
    <div class="top-con">
      <el-input
        class="card-input"
        placeholder="请读取医保卡、身份证、就诊卡"
        suffix-icon="el-icon-search"
        v-model="searchValue"
        style="width: 280px; height:38px"
        v-on:keyup.native.enter="selectPatientBySth"
      >
      </el-input>
      <span class="readCard" @click="readPatientInfo"
        ><i class="icon iconfont iconduka"></i>读卡</span
      >
    </div>
    <div class="middle">
      <div class="middle-left">
        <div class="middle-con">
          <l-card-title class="clearfix card-header" ref="header">
            <span slot="left">患者信息</span>
          </l-card-title>
          <div class="visit-msg-con">
            <div class="visit-msg">
              <el-row class="width100">
                <div class="colOne">
                  <img class="img" :src="srcUrl" alt=""/>
                </div>
                <div class="colOne col-style-sp">
                  <el-row class="width50 con-left-text">
                    门诊号
                  </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    姓名
                  </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    年龄
                  </el-row>
                </div>
                <div class="colOne">
                  <el-row class="width100 con-right-text">
                    {{ patientInfo.outPNum }}
                  </el-row>
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.patientName }}
                  </el-row>
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.age }}岁
                  </el-row>
                </div>
                <div class="colOne col-style ml10">
                  <el-row class="width50 con-left-text top-distance"> </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    真实姓名
                  </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    出生日期
                  </el-row>
                </div>
                <div class="colOne">
                  <el-row class="width100 con-right-text top-distance">
                  </el-row>
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.realName }}
                  </el-row>
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.brithdayDate }}
                  </el-row>
                </div>
                <div class="colOne col-style">
                  <el-row class="width50 con-left-text top-distance"> </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    性别
                  </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    账户余额
                  </el-row>
                </div>
                <div class="colOne">
                  <el-row class="width100 con-right-text top-distance">
                  </el-row>
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.sex === 1 ? "男" : "女" }}
                  </el-row>
                  <el-row
                    class="width100 con-right-text special-color top-distance"
                  >
                    {{ patientInfo.account }}元
                  </el-row>
                </div>
              </el-row>
              <el-row class="width100">
                <div class="colOne col-style-special">
                  <el-row class="width50 con-left-text"> </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    联系电话
                  </el-row>
                </div>
                <div class="colOne">
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.phoneNum }}</el-row
                  >
                </div>
                <div class="colOne col-style col-left-two">
                  <el-row class="width50 con-left-text"> </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    身份证
                  </el-row>
                </div>
                <div class="colOne">
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.idCard }}</el-row
                  >
                </div>
                <div class="colOne col-style ">
                  <el-row class="width50 con-left-text"> </el-row>
                  <el-row class="width50 con-left-text top-distance">
                    联系地址
                  </el-row>
                </div>
                <div class="colOne">
                  <el-row class="width100 con-right-text top-distance">
                    {{ patientInfo.address }}</el-row
                  >
                </div>
              </el-row>

              <div class="width100">
                <div class="colOne col-style-special">
                  <el-row class="width50 con-left-text top-distance"
                    >特殊人群</el-row
                  >
                  <el-row class="width50 con-left-text top-distance">
                    病人来源
                  </el-row>
                </div>
                <div class="colOne">
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
                  <el-row class="con-left-text top-distance">既往史</el-row>
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
                </div>
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
        <div class="button-con">
          <span class="button-footer">
            <el-button type="primary" @click="handleCompleteCheck"
              >完成预检</el-button
            >
            <el-button @click="handleKeepUp">暂存</el-button>
            <el-button @click="handleClearData">清屏</el-button>
          </span>
        </div>
      </div>
      <div class="middle-right">
        <l-card-title
          style="background-color:#F5F5F5"
          class="clearfix card-header"
          ref="header"
        >
          <span slot="left">{{ patientInfo.patientName }}的预检记录</span>
        </l-card-title>
        <el-table
          ref="singleTable"
          :data="tabsList"
          highlight-current-row
          style="width: 100%"
          height="100%"
          stripe
          border
          v-loading="isLoading"
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
            <template slot-scope="scope">
              <template v-if="item.prop === 'checkTime'">
                <span class="time-date-con">{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
import LInputwithTitle from "@/components/LInputwithTitle.vue";
import LSelectWithTitle from "@/components/LSelectWithTitle.vue";
import gradedDiagle from "./gradedDiagle.vue";
import painLevel from "./painLevel.vue";
export default {
  name: "patientInfoArea",
  methods: {
    // 个人预检记录列表  异步获取
    initPatientDataList() {
      try {
      } catch (error) {}
    },
    // 回车查询  TODO: 异步查询
    selectPatientBySth() {
      try {
        // 查询到患者id后 调用预检记录接口展示
        this.initPatientDataList();
      } catch (error) {}
    },
    // 读卡 按钮点击操作
    readPatientInfo() {
      try {
      } catch (error) {}
    },
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
    // 清屏 方法
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
  components: {
    LInputwithTitle,
    gradedDiagle,
    painLevel
  },
  data() {
    return {
      srcUrl: "", // 图片路径
      searchValue: "", // 搜索的变量
      radioOne: "oldman",
      isLoading: false,
      score: 0, // 分数
      gragedShowFlag: false,
      painShowFlag: false,
      level: "", // 疼痛级别
      tableColumn: [
        {
          prop: "checkNum",
          label: "预检次数",
          width: "40"
        },
        {
          prop: "checkTime",
          label: "预检时间",
          width: "80"
        },
        {
          prop: "checkHum",
          label: "预检人",
          width: "40"
        }
      ],
      // 数据源
      tabsList: [
        {
          checkNum: "第一次",
          checkTime: "2019-08-12 18:22",
          checkHum: "张三"
        },
        {
          checkNum: "第二次",
          checkTime: "2019-08-12 18:22",
          checkHum: "张三"
        }
      ],
      // 患者信息
      patientInfo: {
        patientName: "刘明海",
        realName: "刘明海1",
        sex: 1,
        age: 49,
        phoneNum: "15311884811",
        idCard: "410108198898762121",
        brithdayDate: "1997-11-11",
        address: "上海市闵行区华中路大坪商厦",
        outPNum: "00256543",
        account: "10"
      },
      radioList: [
        { radioName: "老人", radioKey: "oldman" },
        { radioName: "小孩", radioKey: "child" },
        { radioName: "孕妇", radioKey: "pregnant" },
        { radioName: "海外人员", radioKey: "returnee" },
        { radioName: "公众人物", radioKey: "character" }
      ],
      radioTwo: "incity",
      radioListTwo: [
        { radioName: "市内", radioKey: "incity" },
        { radioName: "市外", radioKey: "outcity" },
        { radioName: "省内", radioKey: "inpro" },
        { radioName: "省外", radioKey: "outpro" }
      ],
      radioThree: "diabetes",
      radioListThree: [
        { radioName: "糖尿病", radioKey: "diabetes" },
        { radioName: "高血压", radioKey: "hypertension" },
        { radioName: "心脏病", radioKey: "cardiopathy" },
        { radioName: "哮喘", radioKey: "asthma" },
        { radioName: "无", radioKey: "none" }
      ],
      radioFour: "push",
      radioListFour: [
        { radioName: "推入", radioKey: "push" },
        { radioName: "抬入", radioKey: "raise" },
        { radioName: "扶入", radioKey: "help" },
        { radioName: "步行", radioKey: "walk" }
      ],
      titleBody: "身高",
      unitOne: "(cm)",
      valueBody: "180", // 身高
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
      titleBloodPressure: "心率",
      unitSix: "(mmHg)",
      valueBloodPressure: "",
      titleOxyhemoglobin: "血氧饱和度",
      unitSeven: "(%)",
      valueOxyhemoglobin: "", // 血氧饱和度
      titleStatus: "状态意识",
      valueStatus: "清醒", // 状态意思
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
      valuevenenation: "1", // 状态意思
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
      valueoxygenUptake: "2", // 状态意思
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
  }
};
</script>

<style  lang="scss" scoped>
.patient-info-area {
  height: 100%;
  .top-con {
    padding: 20px;
    border-bottom: 1px solid #e4e4e4;
    .readCard {
      display: inline-block;
      margin-left: 10px;
      width: 170px;
      height: 38px;
      background: rgba(19, 71, 150, 1);
      border-radius: 2px;
      cursor: pointer;
      color: #fff;
      line-height: 38px;
      text-align: center;
      font-size: 14px;
      
      font-weight: 500;
    }
  }
  .middle {
    display: flex;
    padding-top: 20px;
    padding-right: 20px;
    flex-direction: row;
    height: 100%;
    .middle-left {
      flex: 1;
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
        border-bottom: 1px solid #e4e4e4;
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
    .middle-right {
      width: 406px;
      height: 100%;
      padding: 0 20px;
      background: rgba(245, 245, 245, 1);
      .time-date-con {
        color: #3d7dfb;
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
