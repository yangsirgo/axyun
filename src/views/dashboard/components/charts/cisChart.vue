<template>
  <div id="charts" class="height100 cis">

  </div>
</template>

<script>

  import echarts from 'echarts'

  export default {
    name: "cisChart",
    props: ["date-data"],
    data() {
      return {
        date_Data: this.dateData
      }
    },
    components: {},
    methods: {
      drawChart() {
        let me = this;
        let myChart = echarts.init(document.getElementById('charts'));
        let echartsData = [{
            name: '科室门诊人数',
            value: 60
          },
          {
            name: '我的门诊人数',
            value: 40

          }
        ];
        let color = ["#F05A23", "#134796"];
        let xdata = ['科室门诊人数','我的门诊人数'];

        let option = {
          backgroundColor: "rgba(255,255,255,1)",
          color: color,
          grid: {
            bottom: '0%'
          },
          legend: {
            top: 0,
            left: 0,
            data: xdata,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            formatter: function (name) {
              let legendStr = '';
              echartsData.forEach((item)=>{
                if (item.name == name) {
                  legendStr = name;
                }
              });
              return legendStr;
            }
          },
          series: [{
            name: '违规次数',
            type: 'pie',
            clockwise: false, //饼图的扇区是否是顺时针排布
            minAngle: 20, //最小的扇区角度（0 ~ 360）
            radius: ["30%", "58%"],
            center: ["35%", "65%"],
            avoidLabelOverlap: false,
            itemStyle: { //图形样式
              normal: {
                borderColor: '#ffffff',
                borderWidth: 10,
              },
            },
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{value|{d}%}\n{text|{b}}',
                rich: {
                  text: {
                    color: "#4A90E2",
                    fontSize: 12,
                    align: 'center',
                    verticalAlign: 'middle',
                    padding: 5
                  },
                  value: {
                    color: "#666",
                    fontSize: 12,
                    align: 'center',
                    verticalAlign: 'middle',
                  },
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: 46,
                }
              }
            },
            data: echartsData
          }]
        };
        console.log(option);
        myChart.setOption(option);

        setTimeout(function () {
          myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 0
          });

          myChart.on('mouseover', function (params) {
            if (params.name == echartsData[0].name) {
              myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: 0
              });
            } else {
              myChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: 0
              });
            }
          });

          myChart.on('mouseout', function (params) {
            myChart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: 0
            });
          });
        }, 1000);
      }
    },
    mounted() {
      let me = this;
      this.$nextTick(() => {
        setTimeout(()=>{
          me.drawChart();
        },100);
      });
    }
  }
</script>

<style scoped>

</style>
