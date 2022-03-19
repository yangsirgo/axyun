<template>
  <div class="line-process-list">
    <ul class="line-process-con">
      <li
        class="line-process-item clearfix"
        v-for="(renderItem, index) in renderData"
        :key="index"
      >
        <div class="left">

          <p class="process-title">
             <span
               :val=renderItem.nodeName
               code="diagnosisnode"
               v-codeTransform
             ></span></p>
          <!--<div class="process-circle">
             <div class="process-circle-con"></div>
           </div>-->
          <div class="process-circle">
            <div
              :class="{'iconfont':true ,'icon-dianziyizhujiaohu':true,'last-color':index==renderData.length-1}"></div>
            <div class="line" v-if="index!=renderData.length-1"></div>
          </div>
          <p class="office special">{{ renderItem.ouptDeptName }}</p>
          <p class="date special">{{ renderItem.visitTime }}</p>
          <!--<p class="time special">{{ renderItem.time }}</p>-->
          <p class="name">{{ renderItem.doctorName }}</p>
        </div>
        <!--begin 屏蔽子节点-->
        <!--<div style="height:75px" v-if="!renderItem.status">-->
          <!--<div class="tips-show">-->
            <!--<div class="line1"></div>-->
            <!--<div class="line2"></div>-->
            <!--&lt;!&ndash;<i class=" icon-right el-icon-right"></i>&ndash;&gt;-->
            <!--<div class="show">-->
              <!--<p class="process-title">{{ renderItem.reason }}</p>-->
              <!--<div class="process-circle">-->
                <!--&lt;!&ndash;<div class="process-circle-con"></div>&ndash;&gt;-->
                <!--<div class="iconfont icon-dianziyizhujiaohu1"></div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--end -->
        <!--<i class="right icon-right el-icon-right"></i>-->
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {getVisitLog} from '@/api/cost/cost.js';
  export default {
    name: "",
    methods: {
      async getLineProcessData(param) {
        // debugger;
        let data = await getVisitLog({"visitCode":param});
        if(data.code==1){
          this.renderData = data.data;
        }
      },
    },
    computed: {
      ...mapGetters("patientMaster", ["hisRecordData"])
    },
    watch:{
      "hisRecordData": {
        async handler(n) {
          if(n!=null){
            this.getLineProcessData(n.visitCode);
          }
        },
        immediate: true,
        deep: true
      }
    },
    components: {},
    data() {
      return {
        renderData: [
          // {
          //   nodeName: "1",
          //   ouptDeptName: "检验科",
          //   visitTime: "2019-09-23 09:50:02",
          //   doctorName: "王迪",
          //   status: true//,控制子流程的显示
          //   //reason: "申请单被退回"
          // },
          // {
          //   nodeName: "2",
          //   ouptDeptName: "检验科",
          //   visitTime: "2019-09-23 09:50:02",
          //   doctorName: "王迪22",
          //   status: true//,控制子流程的显示
          //   //reason: "申请单被退回"
          // }
          //, {
          //   title: "病历处方",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "09:51",
          //   docName: "王倩",
          //   status: false//,
          //   // reason: "申请单被退回"
          // },
          // {
          //   title: "结算",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "09:59",
          //   docName: "王倩",
          //   status: true
          // },
          // {
          //   title: "治疗",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "10:59",
          //   docName: "刘翔",
          //   status: false//,
          //   //reason: "患者取消登记"
          // },
          // {
          //   title: "集成病历",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "11:20",
          //   docName: "刘伟",
          //   status: true
          // },
          // {
          //   title: "入院申请",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "12:40",
          //   docName: "李伟",
          //   status: true
          // }
          //,
          // {
          //   title: "初步报告",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "15:40",
          //   docName: "明浩",
          //   status: true
          // },
          // {
          //   title: "审核报告",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "16:40",
          //   docName: "刘翔",
          //   status: true
          // },
          // {
          //   title: "报告发布",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "17:40",
          //   docName: "刘翔",
          //   status: true
          // },
          // {
          //   title: "报告已打印",
          //   office: "检验科",
          //   date: "2019-09-23",
          //   time: "18:40",
          //   docName: "李大奔",
          //   status: true
          // }
        ]
      };
    }
  };
</script>

<style lang='scss' scoped>
  .line-process-list {
    width: calc(100% - 40px);
    margin: 0 20px 20px 20px;
    padding: 20px;
    background-color: $l-color-bgcolor-18;

    .line-process-item {
      position: relative;
      width: 134px;
      display: inline-block;
      line-height: 24px;
      color: #2e323a;

      .left {
        text-align: center;
        width: 84px;
        font-size: 14px;
        display: inline-block;
        vertical-align: baseline;

        .special {
          line-height: 20px;
          color: rgba(148, 157, 163, 1);
        }

        .process-circle {
          color: $l-color-primary;
          font-size: 20px;
          position: relative;
          /*display: inline-block;
          padding: 10px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #ff6a00;

          .process-circle-con {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #fff;
          }*/
          .line {
            width: 120px;
            height: 2px;
            background-color: $l-color-primary;
            position: absolute;
            top: 10px;
            left: 50px;
          }

          .last-color {
            color: $l-color-fontcolor-2;
          }
        }
      }

      .right {
        width: 30px;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
        height: 175px;
        font-size: 30px;
      }

      .tips-show {
        display: inline-block;
        position: absolute;
        left: 40px;
        top: 135px;

        .line1 {
          width: 2px;
          height: 40px;
          background-color: $l-color-bgcolor-11;
          position: absolute;
        }

        .line2 {
          width: 50px;
          height: 2px;
          background-color: $l-color-bgcolor-11;
          position: absolute;
          top: 40px;
        }

        .icon-right {
          display: inline-block;
          position: absolute;
          left: 30px;
          top: 20px;
          font-size: 20px;
          vertical-align: top;
        }

        .show {
          display: inline-block;
          margin-left: 40px;
          width: 120px;
          text-align: center;
          vertical-align: top;

          .process-circle {
            color: $l-color-bgcolor-11;
            font-size: 20px;
            position: absolute;
            top: 30px;
            /*display: inline-block;

            padding: 5px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #e4e4e4;

            .process-circle-con {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background-color: #fff;
            }*/
          }
        }
      }
    }

    .line-process-item:nth-last-child(1) {
      .right {
        display: none;
      }
    }
  }
</style>
