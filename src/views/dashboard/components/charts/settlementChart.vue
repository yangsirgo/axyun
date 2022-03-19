<template>
  <div id="settlementChart" class="height100 cis">

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
        let myChart = echarts.init(document.getElementById('settlementChart'));

        let xdata = ['我的均值','科室均值','最高结算率','最低结算率'];
        let time = ['13%', '10%', '18%', '6%'];


        let option = {
          // title : {
          //   text : '科室均值对比'
          // },
          grid: {
            bottom: '0%',
            top:75
          },
          legend: {
            data:xdata,
            left: 0,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
          },
          xAxis: {
            show : false,
            data: []
          },
          yAxis: {
            show : false,
          },
          series: [{
            name: '我的均值',
            // label : '我的均值',
            type: 'bar',
            barWidth : 30,//柱图宽度
            barGap:'50%',//柱图间距
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#134796', '#949DA3', '#F05A23', '#26AAE6'];
                  return colorList[0]
                },
                label: {
                  color: '#949DA3',
                  fontSize: 14,
                  show: true,
                  position: 'top',
                  formatter: function (name,a){
                    return name.value + '%';
                  }
                }
              }
            },
            data:[24]
          },{
            name: '科室均值',
            type: 'bar',
            barWidth : 30,//柱图宽度
            barGap:'50%',//柱图间距
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#134796', '#949DA3', '#F05A23', '#26AAE6'];
                  return colorList[1]
                },
                label: {
                  color: '#949DA3',
                  show: true,
                  position: 'top',
                  formatter: function (name,a){
                    return name.value + '%';
                  }
                }
              }
            },
            data:[46]
          },{
            name: '最高结算率',
            type: 'bar',
            barWidth : 30,//柱图宽度
            barGap:'50%',//柱图间距
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#134796', '#949DA3', '#F05A23', '#26AAE6'];
                  return colorList[2]
                },
                label: {
                  show: true,
                  color: '#949DA3',
                  position: 'top',
                  formatter: function (name,a){
                    return name.value + '%';
                  }
                }
              }
            },
            data:[71]
          },{
            name: '最低结算率',
            type: 'bar',
            barWidth : 30,//柱图宽度
            barGap:'50%',//柱图间距
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#134796', '#949DA3', '#F05A23', '#26AAE6'];
                  return colorList[3]
                },
                label: {
                  show: true,
                  color: '#949DA3',
                  position: 'top',
                  formatter: function (name,a){
                    return name.value + '%';
                  }
                }
              }
            },
            data:[12]
          }]
        };

        myChart.setOption(option);
      }
    },
    mounted() {
      let me = this;
      this.$nextTick(() => {
        setTimeout(()=>{
          me.drawChart();
        },100);
      });

      // window.resize
    }
  }
</script>

<style scoped>

</style>
