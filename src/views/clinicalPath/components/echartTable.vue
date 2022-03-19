<template>
  <div id="echart" class="cis height100" style="margin-top: 20px;"></div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "",
  methods: {
    drawChart() {
      let me = this;
      let dom = document.getElementById("echart");
      let myChart = echarts.init(dom);
      let option = {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          align: "left",
          data: ["入径人数", "退出人数", "路径人数", "完成人数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["03-10", "03-11", "03-12", "03-13", "03-14", "03-15", "03-16"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "入径人数",
            type: "line",
            stack: "总量",
            data: [90, 123, 101, 134, 102, 130, 89]
          },
          {
            name: "退出人数",
            type: "line",
            stack: "总量",
            data: [80, 112, 71, 89, 120, 110, 120]
          },
          {
            name: "路径人数",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "完成人数",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      };
      myChart.setOption(option, true);
    }
  },
  mounted() {
    let me = this;
    this.$nextTick(() => {
      setTimeout(() => {
        me.drawChart();
      }, 100);
    });
  },
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang='scss' scoped>
</style>
