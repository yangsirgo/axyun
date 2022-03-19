<template>
 <!-- // 健康主题的tabley页面 -->
  <div class="healthTheme">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="生命体征" name="first">
        <div class="healthThemeBox">

              <el-col>
                <span class="healthTheme-line healthTheme-span"></span>
                <span class="healthTheme-text healthTheme-span">血压</span>
              </el-col>

              <el-col>
                    <div id="bloodPressure" class="bloodPressure" style="width: 600px;height:400px;"></div>
              </el-col>

              <el-col>
                <span class="healthTheme-line healthTheme-span"></span>
                <span class="healthTheme-text healthTheme-span">学糖</span>
              </el-col>

              <el-col>
                    <div class="bloodSugar" style="width: 600px;height:400px;"></div>
              </el-col>

        </div>

      </el-tab-pane>
      <el-tab-pane label="用药情况" name="second">
            <vitalSigns></vitalSigns>
      </el-tab-pane>
      <el-tab-pane label="检查报告" name="third">
        <div class="inspect">
            <el-col class="inspectLeft">
                  <inspectLeft></inspectLeft>
            </el-col>
            <el-col class="inspectRight">
                <inspectRight></inspectRight>
            </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane label="检验报告" name="fourth">检验报告</el-tab-pane>
      <el-tab-pane label="病历信息" name="five">病历信息</el-tab-pane>
      <el-tab-pane label="疾病诊断" name="six">疾病诊断</el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

 import inspectLeft from "./inspectionReport/inspectLeft.vue";
 import inspectRight from "./inspectionReport/inspectRight.vue";
 // 生命体征内容组件
 import vitalSigns from "./vitalSigns/vitalSigns.vue";
  export default {
    name: "healthTheme",
    components: {
      inspectLeft,
      inspectRight,
      vitalSigns
    },
    data() {
      return {
        activeName: 'second'
      };
    },
    created() {
      this.$nextTick(() => {
            this.bloodPressureFun();
            this.bloodSugarFun();
       });
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 血压表格
      bloodPressureFun(){
        let myChart = this.$echarts.init(document.getElementsByClassName('bloodPressure')[0]);
       let option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                // data: ['高压', '低压']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                // feature: {
                //     saveAsImage: {}
                // }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '高压',
                    type: 'line',
                    stack: '总量',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '低压',
                    type: 'line',
                    stack: '总量',
                    data: [220, 182, 191, 234, 290, 330, 310]
                }
            ]
        };

        myChart.setOption(option)
      },
      //血糖
      bloodSugarFun(){

          let myChart = this.$echarts.init(document.getElementsByClassName('bloodSugar')[0]);
         let option = {
              title: {
                  text: ''
              },
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data: ['血糖值']
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              toolbox: {
                  // feature: {
                  //     saveAsImage: {}
                  // }
              },
              xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      name: '血糖值',
                      type: 'line',
                      stack: '总量',
                      data: [120, 132, 101, 134, 90, 230, 210]
                  }
              ]
          };
          myChart.setOption(option)
      }
    },
    watch: {}
  };
</script>

<style scoped lang="scss">
  .healthTheme {
    box-sizing: border-box;
    padding-top: 10px;
    padding-left: 15px;
    .healthTheme-span {
      display: inline-block;
    }
    .healthTheme-line{
        width: 4px;
        height: 14px;
        background: rgba(44, 69, 131, 1);
        margin-right: 10px;
    }
    .healthTheme-text{
      font-size:14px;
      font-weight:bold;
      color:rgba(46,50,58,1);
      line-height:20px;
    }
    .healthThemeBox{
        height: 500px;
        overflow: auto;
    }
    .inspectLeft{
      width: 25%;
    }
    .inspectRight{
      width: 74%;
    }
    .inspect{
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
    }







  }
</style>
