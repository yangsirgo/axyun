<template>
  <div class="height100 width100 body-div">
    <div style="margin-left: 20px">
      <l-card-title>
        <template slot="left"
          >日程表</template
        >
      </l-card-title>
    </div>
    <div class="con">
      <div class="width100 l-clearfix:after">
        <div class="block block-left table-title"></div>
        <div
          class="block table-title"
          v-for="item in dateList"
          :key="item.index"
        >
          {{ item.nowDate + "  " + item.week }}
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block block-left">上午</div>
        <div
          class="surplus special"
          v-for="(value, key, index) in am"
          :style="{ backgroundColor: value.bgColor }"
          :key="index"
        >
          <template v-if="value.type === 1">
            <p class="title">{{ value.title }}</p>
            <p class="content">{{ value.content }}</p>
          </template>
          <template v-else-if="value.type === 2">
            <p class="title">{{ value.title }}</p>
            <p class="area">地点 {{ value.area }}</p>
            <p class="time">时间 {{ value.time }}</p>
            <p class="patient">患者 {{ value.patient }}</p>
          </template>
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block block-left">下午</div>
        <div
          class="surplus special"
          v-for="(value, key, index) in pm"
          :style="{ backgroundColor: value.bgColor }"
          :key="index"
        >
          <template v-if="value.type === 1">
            <p class="title">{{ value.title }}</p>
            <p class="content">{{ value.content }}</p>
          </template>
          <template v-else-if="value.type === 2">
            <p class="title">{{ value.title }}</p>
            <p class="area">地点 {{ value.area }}</p>
            <p class="time">时间 {{ value.time }}</p>
            <p class="patient">患者 {{ value.patient }}</p>
          </template>
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block block-left">晚上</div>
        <div
          class="surplus special"
          v-for="(value, key, index) in em"
          :style="{ backgroundColor: value.bgColor }"
          :key="index"
        >
          <template v-if="value.type === 1">
            <p class="title">{{ value.title }}</p>
            <p class="content">{{ value.content }}</p>
          </template>
          <template v-else-if="value.type === 2">
            <p class="title">{{ value.title }}</p>
            <p class="area">地点 {{ value.area }}</p>
            <p class="time">时间 {{ value.time }}</p>
            <p class="patient">患者 {{ value.patient }}</p>
          </template>
        </div>
      </div>
      <div class="width100 l-clearfix:after">
        <div class="block block-left">今日备忘</div>
        <div class="surplus">
          <el-input
            type="textarea"
            :rows="4"
            v-model="textarea.textOne"
            placeholder="点击输入备注内容"
          >
          </el-input>
        </div>
        <div class="surplus">
          <el-input
            type="textarea"
            v-model="textarea.textTwo"
            :rows="4"
            placeholder="点击输入备注内容"
          >
          </el-input>
        </div>
        <div class="surplus">
          <el-input
            type="textarea"
            v-model="textarea.textThree"
            :rows="4"
            placeholder="点击输入备注内容"
          >
          </el-input>
        </div>
        <div class="surplus">
          <el-input
            type="textarea"
            v-model="textarea.textFour"
            :rows="4"
            placeholder="点击输入备注内容"
          >
          </el-input>
        </div>
        <div class="surplus">
          <el-input
            type="textarea"
            v-model="textarea.textFive"
            :rows="4"
            placeholder="点击输入备注内容"
          >
          </el-input>
        </div>
        <div class="surplus">
          <el-input
            type="textarea"
            v-model="textarea.textSix"
            :rows="4"
            placeholder="点击输入备注内容"
          >
          </el-input>
        </div>
        <div class="surplus">
          <el-input
            type="textarea"
            v-model="textarea.textSeven"
            :rows="4"
            placeholder="点击输入备注内容"
          >
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 重写date 格式化方法
Date.prototype.toLocaleStr = function() {
  return this.getMonth() + 1 + "-" + this.getDate();
};
export default {
  data() {
    return {
      // 上
      am: {
        mon: {},
        tue: {
          title: "出诊",
          type: 1,
          bgColor: "#D5E8FF",
          content: "泌尿外科-[普通]"
        },
        wed: {
          title: "出诊",
          type: 1,
          bgColor: $l-color-bgcolor,
          content: "泌尿外科-[专家]"
        },
        thu: {},
        fri: {
          title: "出诊",
          type: 1,
          bgColor: $l-color-bgcolor,
          content: "泌尿外科-[专家]"
        },
        sat: {},
        sun: {}
      },
      // 下
      pm: {
        mon: {
          title: "出诊",
          type: 1,
          bgColor: "#D5E8FF",
          content: "泌尿外科-[普通]"
        },
        tue: {},
        wed: {
          title: "出诊",
          type: 1,
          bgColor: $l-color-bgcolor,
          content: "泌尿外科-[专家]"
        },
        thu: {
          title: "膀胱穿刺术",
          type: 2,
          bgColor: "#FAFFDA",
          area: "第一手术室",
          time: "09:00",
          patient: "张明月"
        },
        fri: {
          title: "科室会诊",
          type: 2,
          bgColor: "#DAF8FF",
          area: "3楼14诊室",
          time: "15:00",
          patient: "王森"
        },
        sat: {},
        sun: {
          title: "出诊",
          type: 1,
          bgColor: "#D5E8FF",
          content: "泌尿外科-[普通]"
        }
      },
      // 晚上
      em: {
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {
          title: "出诊",
          type: 1,
          bgColor: "#FFE4E3",
          content: "泌尿外科-[急诊]"
        },
        sun: {}
      },
      formDate: {
        nowDate: "",
        week: ""
      },
      // 日期数组
      dateList: [
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        }
      ],
      textarea: {
        textOne: "",
        textTwo: "",
        textThree: "",
        textFour: "",
        textFive: "",
        textSix: "",
        textSeven: ""
      },
      // 当前时间
      currentDate: new Date()
    };
  },
  mounted() {
    this.getDate();
  },
  methods: {
    //排班
    // 日期
    getDate(dateFlag) {
      var currentDate = this.currentDate;
      const weeks = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      if (dateFlag) {
        currentDate = dateFlag;
      }
      let a = new Date(currentDate).getDay();
      for (let i = 0; i < 7; i++) {
        // 周一的时间
        let date = currentDate - a * 60 * 60 * 24 * 1000;
        this.dateList[i].week = weeks[i];
        let b = date + 60 * 60 * 24 * 1000 * (i + 1);
        this.dateList[i].nowDate = new Date(b).toLocaleStr();
      }
    },
    // 点击预约时间
    handleCommand(command) {
      this.$emit("selectTime", { command });
    }
  }
};
</script>
<style lang="scss" scoped>
.body-div {
  .con {
    margin: 0 20px;
  }
  .block {
    float: left;
    width: 13.5%;
    height: 100px;
    text-align: center;
    border: 1px solid #ededed;
    line-height: 100px;
  }
  .block-left {
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 5%;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    background-color: $l-color-bgcolor-18;
    line-height: 20px;
  }
  .table-title {
    background: #f7f8fa;
    font-size: 14px;
    color: #2e323a;
    height: 41px;
    line-height: 41px;
  }
  .task {
    height: 80px;
  }
  .title-span {
    font-size: 14px;
    font-weight: bold;
    color: rgba(148, 157, 163, 1);
    line-height: 35px;
  }
  .el-button {
    border: none;
  }
  .surplus {
    float: left;
    width: 13.5%;
    height: 100px;
    font-size: 12px;
    line-height: 18px;
    border: 1px solid #ededed;
    color: rgba(46, 50, 58, 1);
    
    .title {
      font-weight: bold;
    }
    .content {
      font-weight: 400;
    }
  }
  .special {
    padding: 10px;
  }
  /deep/ .el-textarea__inner {
    resize: none;
    color: #2e323a;
    border: 1px solid #fff;
  }
}
</style>
