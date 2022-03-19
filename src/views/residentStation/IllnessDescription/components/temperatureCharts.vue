<template>
  <div id="charts" class="height100"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'

  // 引入折线图
  require('echarts/lib/chart/line');
  // 引入提示框和标题组件
  require('echarts/lib/component/title');
  // 引入提示框和title组件，图例
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')


  export default {
    name: "temperatureCharts",
    props : ["temp-data","date-data"],
    data() {
      return {
        temperatureData : this.tempData,
        date_Data : this.dateData
      }
    },
    components: {},
    methods: {
      drawLine () {
        let me = this;
        let myChart = echarts.init(document.getElementById('charts'));
        let option = {
          backgroundColor:'#fff',
          grid: {
            top: '8px',
            bottom: '30px',
            left: '6%',
            right: '6%'
          },
          tooltip: {
            backgroundColor : 'rgba(240,90,35,1)',
            trigger: 'axis',
            textStyle : {
              color: '#fff',
            },
            label: {
              show: false
            },
            formatter: function (value){
              return value[0].value;
            }
          },
          xAxis: {
            boundaryGap: true, //默认，坐标轴留白策略
            axisLine: {
              show: true,
              lineStyle : {
                type : 'solid',
                color : '#949DA3',
              }
            },
            "splitLine": {
              "show": true,
              lineStyle: {
                color: '#C5CBCF',
                type: 'dashed'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            data: me.date_Data
          },
          yAxis: {
            axisLine: {
              show: true,
              lineStyle : {
                type : 'solid',
                color : '#949DA3',
              }
            },
            type: 'value',
            max: 42,
            min: 35,
            interval:1,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#C5CBCF',
                type: 'dashed'
              }
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: 'rgba(245,245,245,1)'
              }
            }
          },
          series: [{
            type: 'line',
            symbol: 'circle',
            symbolSize: 9,
            lineStyle: {
              color: 'rgba(240,90,35,1)',
              shadowBlur: 12,
              shadowColor: 'rgba(240,90,35,1)',
              shadowOffsetX: 1,
              shadowOffsetY: 1
            },
            itemStyle: {
              normal: {
                color: "rgba(240,90,35,1)",
                barBorderRadius: 0,
              }
            },
            label: {
              show: false,
              distance: 1,
              emphasis: {
                show: true,
                offset: [25, -2],
                color: '#FFF',
                padding: [8, 20, 8, 6],
                //width:60,
                height: 36,
                formatter: function(params) {
                  var name = params.name;
                  var value = params.data;
                  var str = value;
                  return str;
                },
                rich: {
                  bg: {
                    width: 78,
                    color: '#FFF',
                    padding: [20, 0, 20, 10]
                  },
                  br: {
                    width: '100%',
                    height: '100%'
                  }

                }
              }
            },
            data: me.temperatureData
          }]
        };
        myChart.setOption(option);
      }
    },
    mounted () {
      let me = this;
      this.$nextTick (()=> {
        me.drawLine();
      });
    }
  }
</script>

<style scoped>

</style>
