<template>
  <!-- <el-card class="box-card"> -->
  <!-- <div class="header">
      <span class="title">关键绩效</span>
      <el-button class="button inactive" type="text">本月</el-button>
      <el-button class="button inactive" type="text">本周</el-button>
      <el-button class="button inactive" type="text">今日</el-button>
      <el-button class="button active" round>昨日</el-button>
  </div>-->
  <portlet :title="title" :buttons="buttons" @buttonclick="buttonChange">
    <el-row class="statistics">
      <el-col :span="6">门诊人次：</el-col>
      <el-col :span="6">新收入院：</el-col>
      <el-col :span="6">手术：</el-col>
      <el-col :span="6">会诊：</el-col>
    </el-row>
    <el-row class="progress">
      <el-col :span="12" class="indicators">
        <div class="label l-center-vertical">
          <span>门诊指标</span>
        </div>
        <div class="content">
          <div class="progress-box" v-for="(outpatient,index) in outpatients" :key="index">
            <div class="indicator-name">{{outpatient.name}}<span class="progress-value">{{outpatient.value}}%</span></div>
            <el-progress
              :text-inside="true"
              :show-text="false"
              class="item"
              color="#FF6B00"
              :stroke-width="8"
              :percentage="outpatient.value"
            ></el-progress>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="indicators">
        <div class="label l-center-vertical">
          <span>住院指标</span>
        </div>
        <div class="content">
          <div class="progress-box" v-for="(outpatient,index) in outpatients" :key="index">
            <div class="indicator-name">{{outpatient.name}}<span class="progress-value">{{outpatient.value}}%</span></div>
            <el-progress
              :text-inside="true"
              :show-text="false"
              class="item"
              color="#FF6B00"
              :stroke-width="8"
              :percentage="outpatient.value"
            ></el-progress>
          </div>
        </div>
      </el-col>
    </el-row>
  </portlet>

  <!-- </el-card> -->
</template>
<script>
import portlet from './Portlet.vue';
export default {
  components: {
    portlet
  },
  data: function() {
    return {
      outpatients: [
        {
          name: '药品',
          value: 69
        },
        {
          name: '基药',
          value: 88
        },
        {
          name: '抗菌药',
          value: 69
        },
        {
          name: '预约率',
          value: 50
        }
      ],
      title: {
        id: 2,
        name: "关键绩效"
      },
      buttons: [
        {
          id: 4,
          name: "昨日"
        },
        {
          id: 3,
          name: "今日"
        },
        {
          id: 2,
          name: "本周"
        },
        {
          id: 1,
          name: "本月"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    buttonChange() {}
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.header {
  height: 60px;
  line-height: 26px;
  padding-top: 6px;
  padding-bottom: 24px;
}
.title {
  font-size: 14px;
  
  font-weight: bold;
  color: rgba(119, 119, 119, 1);
}
.button {
  float: right;
  height: 30px;
  border-radius: 30px;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  font-size: 14px;
  margin-right: 10px;
  
}
.active {
  background: rgba(255, 106, 0, 1);
  color: rgba(255, 255, 255, 1);
}
.inactive {
  color: #9c9c9c;
}
.progress {
  .indicators{
    height: 208px;
  }
  .label {
    float: left;
    width: 50px;
    padding: 18px;
    line-height: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
    span {
      color: #ff6b00;
      display: flex;
      align-items: center;
    }
  }
  .content {
    float: left;
    padding-right: 100px;
    margin-left: -50px;
    padding-left: 50px;
    width: 100%;
    .progress-box{
      margin-top: 20px;
      .indicator-name{
        margin-bottom: 10px;
        .progress-value{
          float: right;
          color:#ff6a00;
        }
        .item {
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>
