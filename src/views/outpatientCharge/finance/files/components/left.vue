<template>
  <el-card class="card-cont width100 height100">
    <div class="width100 height100" v-if="accountDisable">
      <div class="human-body">
        <l-anthro-pogram :height="humanData.humanHeight" :weight="humanData.humanWeight" :position="'bottom'">
          <div class="human-cont">
            <div class="exponent height-exponent clearfix">
              <el-col :span="12">体重指数</el-col>
              <el-col :span="12"><span class="cont">{{humanData.heightExponent}}</span></el-col>
            </div>
            <div class="exponent ua-exponent clearfix">
              <el-col :span="12">尿酸</el-col>
              <el-col :span="12"><span class="cont">{{humanData.uaExponent}}</span></el-col>
            </div>
            <div class="exponent bloodglucose-exponent clearfix">
              <el-col :span="12">空腹血糖</el-col>
              <el-col :span="12"><span class="cont">{{humanData.bloodglucoseExponent}}</span></el-col>
            </div>
          </div>
        </l-anthro-pogram>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName">
          <el-tab-pane label="家床" name="his">家床</el-tab-pane>
          <el-tab-pane label="门诊" name="visit">
            <div class="visit-cont">
              <el-timeline>
                <el-timeline-item
                  v-for="(item,index) in visitTimeLine"
                  :key="index"
                  :timestamp="item.timestamp"
                  :color="index===0?'#2E323A':'#C5CBCF'"
                  size="normal"
                  placement="top">
                  <div :class="{'visit-cont-card':true,'border-primary-color':index===0}">
                    <div :class="{'item':true,'ill':true,'primary-color':index===0}">{{item.illness}}</div>
                    <div :class="{'item':true,'main-font-color':index===0}">家床{{item.duration}}</div>
                    <div :class="{'item':true,'main-font-color':index===0}">{{item.dateSection}}</div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>
</template>

<script>
  import LAnthroPogram from '@/components/LAnthroPogram.vue'

  export default {
    name: "left",
    components: {
      LAnthroPogram
    },
    props: ['patientInfo', 'accountDisable'],
    data() {
      return {
        activeName: 'visit',
        //人体数据
        humanData: {},
        //门诊时间线数据
        visitTimeLine: []
      }
    },
    watch: {
      async patientInfo(newPatientInfo, oldPatientInfo) {
        this.activeName = "visit";
        await this.getHumanData();
        await this.getVisitTimeLine();
      }
    },
    async created() {
      if (this.patientInfo) {
        await this.getHumanData();
        await this.getVisitTimeLine();
      }
    },
    methods: {
      //获取患者人体数据
      getHumanData() {
        this.$showLoading();
        try {
          //接口
          //传入参数患者id：JSON.parse(this.patientInfo).patientNum
          this.humanData = {
            humanHeight: '173',//身高
            humanWeight: '56',//体重
            heightExponent: '444',//体重指数
            uaExponent: '555',//尿酸指数
            bloodglucoseExponent: '666'//血糖指数
          };
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //获取患者门诊时间线
      getVisitTimeLine() {
        this.$showLoading();
        try {
          //接口
          //传入参数患者id：JSON.parse(this.patientInfo).patientNum
          this.visitTimeLine = [
            {
              timestamp: '泌尿外科 - 张磊',
              illness: '泌尿道感染',
              duration: '13天',
              dateSection: '2019-04-01'
            }, {
              timestamp: '呼吸内科 - 李华',
              illness: '肺炎',
              duration: '23天',
              dateSection: '2019-04-03~ 2019-04-06'
            }, {
              timestamp: '呼吸内科 - 李华',
              illness: '肺炎',
              duration: '23天',
              dateSection: '2019-04-03~ 2019-04-06'
            }];
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      }
      //获取患者家床时间线
    }
  }
</script>

<style lang="scss">
  .card-cont {
    overflow-y: auto;

    .human-body {
      height: 293px;
      padding-top: 30px;

      .human-cont {
        width: calc(100% - 120px);
        margin: 30px 60px 0 60px;
        text-align: left;
        font-size: $l-font-size;

        font-weight: 400;
        color: $l-color-fontcolor-4;
        line-height: 20px;

        .exponent {
          height: 20px;
          margin-bottom: 10px;

          .cont {
            color: $l-color-fontcolor-3;
          }
        }

        .height-exponent {

        }

        .ua-exponent {

        }

        .bloodglucose-exponent {

        }


      }
    }

    .tabs {
      width: 100%;
      height: calc(100% - 353px);
      margin-top: 30px;

      .el-tabs__nav.is-top {
        width: 50%;
        margin-left: 73px;
      }

      .el-tabs__nav-wrap::after {
        height: 1px !important;
      }

      .el-tabs.el-tabs--top {
        height: 100% !important;
      }

      .el-tabs__content {
        height: calc(100% - 25px);
        overflow-y: auto;
      }

      .visit-cont {
        padding: 20px;

        .el-timeline-item__wrapper {
          padding-left: 18px;
        }

        .visit-cont-card {
          width: 232px;
          min-height: 83px;
          padding: 10px;
          border-radius: 2px;
          border: 1px solid $l-color-bgcolor-11;
          font-size: 14px;

          font-weight: 500;
          color: $l-color-fontcolor-4;
          line-height: 20px;

          .item {
            height: 20px;
          }

          .ill {
            color: $l-color-fontcolor-3;
          }

          .primary-color {
            color: $l-color-primary;
          }

          .main-font-color {
            color: $l-color-fontcolor-3;
          }

          .other-font-color {
            color: $l-color-fontcolor-4;
          }

          .border-color {
            color: $l-color-bgcolor-11;
          }
        }

        .border-primary-color {
          border: 1px solid $l-color-primary;
        }
      }
    }
  }
</style>
