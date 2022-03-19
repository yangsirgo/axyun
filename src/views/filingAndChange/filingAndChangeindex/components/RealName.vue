<template>
  <!-- 实名认证工具栏 -->
  <div class="assist-container width100 height100 " v-loading="loading">
    <el-col :span="24" class="RealName">实名认证说明</el-col>
    <el-col :span="24" class="RealName1">
      1.非实名建档只需要填写姓
      名、年龄以及手机号即可完
      成建档操作。
    </el-col>
    <el-col :span="24" class="RealName1">
      2.实名建档除了非实名建档
      必填项目外，需要填写身份
      证号并通过身份证号规则验
      证，以及手机验证码填写进
      实名认证。
    </el-col>
    <el-col :span="24" class="RealNameProcess">
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in activities" :key="index" :color="activity.color">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>

    </el-col>
  </div>
</template>
<script>
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    patientSilimarList
  } from "@/api/arch/arch";

  export default {
    //
    inject: ['stepStyleobj'],
    data() {
      return {
        loading: false,
        silimarRecordList: [],
        similarityData: "",
        reverse: true,
        stepStyleobj: this.stepStyleobj,
        activities: [{
            content: '结束',
            color: ""
          },
          {
            content: '实名认证',
            color: ""
          },
          {
            content: '填入手机号并获取验证码',
            color: ""
          },
          {
            content: '填入正确身份证号',
            color: ""
          },
          {
            content: '填入必填信息',
            color: ""
          },
          {
            content: '开始',
            color: "#0bbd87"
          }
        ]
      };
    },

    computed: {
      ...mapGetters("base", ["receivePatientData", "similarRecordData"])
    },
    watch: {
      "stepStyleobj": {
        handler(newVal) {
          for (let i = 0;i < this.activities.length;i++){
            if(newVal.stepStyle <= i){
               this.activities[i].color = "#0bbd87";
            }
          }
          console.log(this.activities);
        },
        deep: true
      }
    },
    created() {
      console.log("====stepStyleobj=======", this.stepStyleobj);
    },
    methods: {
      ...mapActions({
        changeRecPatientData: "base/changeRecPatientData"
      })

    }
  };
</script>
<style lang="scss" scoped>
  .assist-container {
    overflow-y: auto;

    .is-always-shadow {
      box-shadow: 0 0 0 0 transparent;
    }

    .RealName {
      height: 20px;
      font-size: 14px;
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
      line-height: 20px;
      text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    .RealName1 {
      width: 168px;
      height: auto;
      font-size: 14px;
      color: rgba(148, 157, 163, 1);
      line-height: 20px;
      text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    .RealNameProcess {
      margin-top: 15px;
    }
  }
</style>
