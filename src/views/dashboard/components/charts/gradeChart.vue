<template>
  <div id="gradeChart" class="height100 cis">

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
        let myChart = echarts.init(document.getElementById('gradeChart'));

        let xdata = ['我的均值','科室均值','最高分数','最低分数'];
        let time = ['13min', '10min', '18min', '6min'];


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
            itemGap: 15
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
                  show: true,
                  color: '#949DA3',
                  position: 'top',
                  formatter: function (name,a){
                    return name.value + '分';
                  }
                }
              }
            },
            data:[13]
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
                  show: true,
                  color: '#949DA3',
                  position: 'top',
                  formatter: function (name,a){
                    return name.value + '分';
                  }
                }
              }
            },
            data:[10]
          },{
            name: '最高分数',
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
                    return name.value + '分';
                  }
                }
              }
            },
            data:[ 18]
          },{
            name: '最低分数',
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
                    return name.value + '分';
                  }
                }
              }
            },
            data:[6]
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
    }
  }
</script>

<style scoped>

</style>
