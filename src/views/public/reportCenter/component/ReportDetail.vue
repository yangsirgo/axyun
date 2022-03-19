<template>
  <div class="report-cont">
    <l-card-title>
      <div slot="left" class="report-cont-title">{{ info && itemdata.no }} 报告</div>
      <div slot="right">
        <el-checkbox-group v-model="checkList" @change="changeTableData">
          <el-checkbox label="0">仅查看危机值</el-checkbox>
          <el-checkbox label="1">仅查看异常值</el-checkbox>
        </el-checkbox-group>
      </div>
    </l-card-title>
    <div class="proposer-info">
      <el-row>
        <el-col :span="5">
          <div class="proposer-info-item">
            <span>申请单号</span>
            <em>{{ itemdata.assayPublishId || "--" }}</em>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="proposer-info-item">
            <span>申请人</span>
            <em>{{ itemdata.applyDoctorName || "--" }}</em>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="proposer-info-item">
            <span>申请科室</span>
            <em>{{ itemdata.deptName || "--" }}</em>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="proposer-info-item">
            <span>申请时间</span>
            <em>{{ itemdata.applyDate || "--" }}</em>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <div class="proposer-info-item">
            <span>送检标本</span>
            <em>{{ itemdata.sampleName || "--" }}</em>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="proposer-info-item">
            <span>送检科室</span>
            <em>{{ itemdata.deptName || "--" }}</em>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="proposer-info-item">
            <span>送检时间</span>
            <em>{{ itemdata.receiveDate || "--" }}</em>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="proposer-info-item">
            <span>检出时间</span>
            <em>{{ itemdata.reportDate || "--" }}</em>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="report-bottom-lr clearfix" :class="{ fold: foldbox }">
      <div class="report-bottom-l">
        <el-table
          :data="tabsList"
          ref="reportInfoTable"
          highlight-current-row
          style="width: 100%"
          height="250"
          border
          v-loading="tlm_isLoading"
          @row-click="clickRow"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <span v-if="item.prop === 'resultHintsHigh'">
                <i v-if="scope.row['resultHintsHigh'] ==='1'" class="iconfont iconshangsheng"></i>
                <i v-else-if="scope.row['resultHintsHigh'] ==='3'" class="iconfont iconxiajiang"></i>
                <i v-else>-</i>
              </span>
              <i
                v-else-if="item.prop === 'handler'"
                class="iconfont iconzhibiaojiedu cursor-pointer"
                title="解读"
                @click="interpretation(scope.row)"
              ></i>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="take-info">
          <div class="take-info-state">#本报告仅对本标本负责#</div>
          <div class="proposer-info">
            <div class="proposer-info-item">
              <span>检验者</span>
              <em>{{ itemdata.checkerName || "--" }}</em>
            </div>
            <div class="proposer-info-item">
              <span>审核人</span>
              <em>{{ itemdata.auditorName || "--" }}</em>
            </div>
            <div class="proposer-info-item">
              <span>核收日期</span>
              <em>{{ itemdata.publishDate || "--" }}</em>
            </div>
            <div class="proposer-info-item">
              <span>报告日期</span>
              <em>{{ itemdata.reportDate || "--" }}</em>
            </div>
          </div>
        </div>
        <!-- <div class="center-line"></div> -->
        <div class="c-description" v-show="itemdata.applyNo">
          <p>
            <span>危险性</span>
            <em>急性白血病可能</em>
          </p>
          <p>
            <span>处理方式</span>
            <em>进行白细胞分类，观察外周血涂片和进行骨髓检查。</em>
          </p>
          <p>
            <span>处理结果</span>
            <em>确诊急性白血病。</em>
          </p>
        </div>
        <l-card-title>
          <div slot="left" class="report-cont-title">趋势图</div>
        </l-card-title>
        <div class="chart-title">
          <span class="chart-title-name" v-text="activeRowInfo.assayName"></span>
          <span class="chart-title-bs">单位</span>
          <span class="chart-title-unit" v-text="activeRowInfo.assayUnit"></span>
        </div>
        <div class="chart-box" v-loading="chartLoad">
          <div id="chart" class="tendency-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { getReportData, getChartData,getAssayChartValue } from "@/api/reportCenter/report";
import { mapGetters } from "vuex";

export default {
  props: {
    // 报告详细信息(报告编号、申请人、检验者的信息)
    itemdata: [String, Object]
  },
  data() {
    return {
      // 仅查看危机值('0')、异常值('1')
      checkList: [],
      // 表格加载loading
      tlm_isLoading: false,
      // 分页控制参数
      // 表头
      tableParams: [
        {
          prop: "assayName",
          label: "检验项目"
        },
        {
          prop: "assayResult",
          label: "测定结果"
        },
        {
          prop: "assayUnit",
          label: "单位"
        },
        {
          prop: "resultHintsHigh",
          label: "结果"
        },
        {
          prop: "referenceValue",
          label: "参考范围"
        },
        {
          prop: "handler",
          label: "解读"
        }
      ],
      // 接口原始表格数据
      /* oriData: [
        {
          assayName: "白细胞计数",
          assayResult: "13.0",
          assayUnit: "10^9/L",
          referenceValue: "4.00-10.0",
          resultHintsLow: "4.00",
          resultHintsHigh: "10.0"
        },
        {
          assayName: "中性粒细胞百分比",
          assayResult: "62.4",
          assayUnit: "%",
          referenceValue: "50.0-70.0",
          resultHintsLow: "50.0",
          resultHintsHigh: "70.0"
        },
        {
          assayName: "淋巴细胞百分比",
          assayResult: "10",
          assayUnit: "%",
          referenceValue: "20.0-40",
          resultHintsLow: "9.0",
          resultHintsHigh: "60.0"
        }
      ], */
      oriData: [],
      // 表格显示数据(重构后的)
      tabsList: [],
      // 危急值数据
      wjList: [],
      // 异常值数据
      ycList: [],
      // 显示选中表格列的数据
      activeRowInfo: {},
      // 默认展开临床意义
      activeNames: ["1"],
      // 临床意义
      clinic: {
        content:
          "白细胞总数升高，是被非常关注的问题，这种升高既有生理性因素也有病理性因素。白细胞数量升高和减少往往有以下情况：",
        list: [
          {
            title: "生理性增高",
            cont: "新生儿、妊娠末期、分娩期、剧烈运动后等；"
          },
          {
            title: "病理性增高",
            cont: "化脓性细菌性炎症、尿毒症、白血病、组织损伤、手术创伤等；"
          },
          {
            title: "减少",
            cont:
              "病毒性感染、伤寒、副伤寒、黑热病、疟疾、再生障碍性贫血、化疗和放疗后等。"
          }
        ]
      },
      // 治疗措施
      measure: {},
      // 展开收起指标解读
      foldbox: false,
      // chart loading
      chartLoad: false,
      info: {},
      devInfo: {
        applyNo: "0870120",
        applyDoctorName: "王雪",
        applyDeptName: "泌尿外科",
        applyDate: "2019-05-01 09:20",
        checkDeptName: "泌尿外科",
        sampleName: "血液",
        checkDate: "2019-05-02 09:20",
        extractDate: "2019-05-02 13:00",
        checkerName: "张启亮",
        auditorName: "李玲",
        auditDate: "2019-05-03 16:00:00",
        reportDate: "2019-05-03 18:00:00"
      }
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    publishId() {
      return this.itemdata.assayPublishId;
    },
    patientNo() {
      return this.$attrs.patien;
    }
  },
  watch: {
    itemdata: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.assayPublishResultPOList) {
          this.tabsList = val.assayPublishResultPOList;
        }
        this.reTableData();
        console.log(val, "详情页拿到的");
      }
    },
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.itemdata = {};
        this.drawChart({});
        this.tabsList = [];
        if (val.patientId) {
          this.reTableData();
          this.activeRowInfo = this.tabsList;
          this.getChartOption(this.tabsList[0]);
        } else {
          this.itemdata = {};
          this.drawChart({});
          this.tabsList = [];
        }
      }
    }
  },
  methods: {
    reTableData() {
      // 危急值列表
      const wjList = [];
      // 异常值列表
      const ycList = [];
      console.log(this.tabsList, "this.tabsList");
      if (!this.tabsList.length > 0) {
        return;
      }
      this.tabsList.forEach(item => {
        if (item.resultHintsHigh === "1") {
          wjList.push(item);
        } else if (item.resultHintsHigh === "3") {
          ycList.push(item);
        }
      });
      this.wjList = wjList;
      this.ycList = ycList;
      console.log(this.wjList, "危急值");
      console.log(this.ycList, "异常值");
      this.changeTableData();
    },
    // 根据查看的值来切换表格数据
    changeTableData() {
      let allList = [];
      const len = this.checkList.length;
      if (len === 2) {
        // 仅查看危急值，异常值
        allList = [...this.wjList, ...this.ycList];
      } else if (len === 1) {
        if (this.checkList.includes("0")) {
          // 仅查看危急值
          allList = this.wjList;
        } else {
          // 仅查看异常值
          allList = this.ycList;
        }
      } else {
        // 显示所有数据
        allList = this.itemdata.assayPublishResultPOList;
      }
      this.tabsList = allList;
      console.log(this.tabsList, "切换");
      // 默认选中第一个
      if (this.tabsList.length > 0) {
        this.$nextTick(() => {
          const item = this.tabsList[0];
          this.activeRowInfo = item;
          if (this.$refs.reportInfoTable.setCurrentRow) {
            this.$refs.reportInfoTable.setCurrentRow(item);
          }
          this.getChartOption(item);
        });
      } else {
        this.getChartOption("");
      }
    },
    // 绘制echarts图表
    getChartOption(data) {
      if (!data) {
        this.drawChart({});
        return;
      }

      // this.chartLoad = true;
      let requestData = [];
      let newData = [];
      getAssayChartValue({
        inpCode: 'INP200110002'
      }).then(res => {
//          let { code, data1, msg } = res;
            requestData = res.data;
        for(let i=0;i<requestData.length;i++){
          if(data.assayName == requestData[i].assayName){
            newData = requestData[i].chartValueList;

            const rangeLine = data.referenceValue.split("-");
            const xAxis = newData.map(item => item.checkDate.split(" ")[0]);
            const seriesData = newData.map(item => +item.assayResult);
            let option = {
              color: ["#F05A23", "#E1140A", "#3D7DFB"],
              tooltip: {
                trigger: "axis"
              },
              grid: {
                top: 10,
                left: 20,
                right: 40,
                bottom: 0,
                containLabel: true
              },
              xAxis: {
                type: "category",
                data: xAxis,
                boundaryGap: false,
                axisLabel: {
                  color: "#949DA3",
                  fontSize: 14
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#C5CBCF",
                    type: "dashed"
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: "#C5CBCF"
                  }
                }
              },
              yAxis: {
                type: "value",
                axisLabel: {
                  color: "#949DA3",
                  fontSize: 14
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#C5CBCF",
                    type: "dashed"
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: "#C5CBCF"
                  }
                }
              },
              series: [
                {
                  name: this.activeRowInfo.assayName,
                  type: "line",
                  data: seriesData,
                  symbol: "circle",
                  symbolSize: 9
                },
                {
                  type: "line",
                  name: "最低参考值",
                  data: new Array(seriesData.length).fill(+rangeLine[0]),
                  symbol: "none",
                  lineStyle: {
                    type: "dashed",
                    color: "#3D7DFB"
                  }
                },
                {
                  type: "line",
                  name: "最高参考值",
                  data: new Array(seriesData.length).fill(+rangeLine[1]),
                  symbol: "none",
                  lineStyle: {
                    type: "dashed",
                    color: "#E1140A"
                  }
                }
              ]
            };
            this.drawChart(option);

          }

        }
        })
        .catch(err => {
          this.$message.error("网络错误!");
        });

//      const newData = [
//        {
//          assayName: data.assayName,
//          assayResult: "3.0",
//          assayUnit: data.assayUnit,
//          referenceValue: data.referenceValue,
//          checkDate: "2019-06-08 18:12"
//        },
//        {
//          assayName: data.assayName,
//          assayResult: "5.0",
//          assayUnit: data.assayUnit,
//          referenceValue: data.referenceValue,
//          checkDate: "2019-06-08 18:12"
//        },
//        {
//          assayName: data.assayName,
//          assayResult: "13.0",
//          assayUnit: data.assayUnit,
//          referenceValue: data.referenceValue,
//          checkDate: "2019-06-08 18:12"
//        },
//        {
//          assayName: data.assayName,
//          assayResult: "7.0",
//          assayUnit: data.assayUnit,
//          referenceValue: data.referenceValue,
//          checkDate: "2019-06-08 18:12"
//        }
//      ];
//      const rangeLine = data.referenceValue.split("-");
//      const xAxis = newData.map(item => item.checkDate.split(" ")[0]);
//      const seriesData = newData.map(item => +item.assayResult);
//      let option = {
//        color: ["#F05A23", "#E1140A", "#3D7DFB"],
//        tooltip: {
//          trigger: "axis"
//        },
//        grid: {
//          top: 10,
//          left: 20,
//          right: 40,
//          bottom: 0,
//          containLabel: true
//        },
//        xAxis: {
//          type: "category",
//          data: xAxis,
//          boundaryGap: false,
//          axisLabel: {
//            color: "#949DA3",
//            fontSize: 14
//          },
//          axisTick: {
//            show: false
//          },
//          splitLine: {
//            show: true,
//            lineStyle: {
//              color: "#C5CBCF",
//              type: "dashed"
//            }
//          },
//          axisLine: {
//            lineStyle: {
//              color: "#C5CBCF"
//            }
//          }
//        },
//        yAxis: {
//          type: "value",
//          axisLabel: {
//            color: "#949DA3",
//            fontSize: 14
//          },
//          axisTick: {
//            show: false
//          },
//          splitLine: {
//            show: true,
//            lineStyle: {
//              color: "#C5CBCF",
//              type: "dashed"
//            }
//          },
//          axisLine: {
//            lineStyle: {
//              color: "#C5CBCF"
//            }
//          }
//        },
//        series: [
//          {
//            name: this.activeRowInfo.assayName,
//            type: "line",
//            data: seriesData,
//            symbol: "circle",
//            symbolSize: 9
//          },
//          {
//            type: "line",
//            name: "最低参考值",
//            data: new Array(seriesData.length).fill(+rangeLine[0]),
//            symbol: "none",
//            lineStyle: {
//              type: "dashed",
//              color: "#3D7DFB"
//            }
//          },
//          {
//            type: "line",
//            name: "最高参考值",
//            data: new Array(seriesData.length).fill(+rangeLine[1]),
//            symbol: "none",
//            lineStyle: {
//              type: "dashed",
//              color: "#E1140A"
//            }
//          }
//        ]
//      };
//      this.drawChart(option);
    },
    drawChart(option) {
      if (document.getElementById("chart")) {
        let chart = echarts.init(document.getElementById("chart"));
        chart.setOption(option, true);
        this.$nextTick(function() {
          chart.resize();
        });
      }
    },
    // 获取临床意义，治疗措施数据
    getClinic(data) {
      this.clinic = data.clinic;
    },
    // echarts图表根据窗口移动自适应尺寸
    resizeChart() {
      let chart = echarts.init(document.getElementById("chart"));
      chart.resize();
    },
    //点击表格行，切换数据
    clickRow(row) {
      this.activeRowInfo = row;
      this.getChartOption(row);
      // this.getClinic(row);
    },
    // 展开收起指标解读
    foldClick() {
      this.foldbox = !this.foldbox;
      this.$nextTick(() => {
        this.resizeChart();
      });
    },
    // 指标解读
    interpretation(data) {
      this.$store.dispatch("report/changeData", data);
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.resizeChart, false);
      this.$root.eventHub.$on("chartResize", () => {
        this.resizeChart();
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    this.$root.eventHub.$off("chartResize");
  }
};
</script>
<style lang="scss" scoped>
.report-cont {
  position: relative;
  height: 100%;
  padding: 20px;
  overflow: hidden;
  overflow-y: auto;
  /deep/ .cardtitle {
    height: auto;
    line-height: 20px;
    background: transparent;
    overflow: hidden;
    .titleleft::before {
      height: 20px;
      margin-top: 0;
    }
    .report-cont-title {
      font-weight: bold;
    }
  }
  .proposer-info {
    margin-top: 10px;
    margin-bottom: 10px;
    overflow: hidden;
    .proposer-info-item {
      display: inline-block;
      margin-right: 30px;
      margin-bottom: 3px;
      font-size: 0;
      span {
        display: inline-block;
        width: 58px;
        margin-right: 5px;
        font-size: $l-font-size;
        color: $l-color-fontcolor-4;
        white-space: nowrap;
      }
      em {
        font-style: normal;
        font-size: $l-font-size;
        color: $l-color-fontcolor-3;
      }
    }
  }
  .report-bottom-lr {
    &.fold {
      .report-bottom-l {
        right: 40px;
      }
      .report-bottom-r {
        left: 270px;
      }
      .trigger {
        right: 0;
        i {
          transform: rotate(180deg);
        }
      }
    }
    .report-bottom-l {
      .iconshangsheng {
        color: $l-color-bgcolor-15;
      }
      .iconxiajiang {
        color: $l-color-fontcolor-2;
      }
      .take-info {
        padding-top: 20px;
        overflow: hidden;
        .take-info-state {
          float: left;
          font-size: 12px;
          color: $l-color-primary;
        }
        .proposer-info {
          margin-top: 0;
          margin-left: 163px;
          text-align: right;
          .proposer-info-item {
            margin-right: 0;
            margin-left: 30px;
          }
        }
      }
      .chart-title {
        margin-top: 12px;
        padding-left: 30px;
      }
      .chart-box {
        height: 360px;
      }
      .tendency-chart {
        width: 100%;
        height: 100%;
      }
    }
    .center-line {
      border-top: 1px solid $l-color-bgcolor-11;
      margin-left: -19px;
      margin-bottom: 14px;
    }
    .report-bottom-r {
      position: relative;
      float: right;
      width: 270px;
      height: 100%;
      background-color: $l-color-white;
      border: 1px solid $l-color-bgcolor-11;

      .active-info-title {
        height: 51px;
        line-height: 51px;
        padding: 0 11px;
        span {
          margin-right: 2px;
          color: $l-color-primary;
          font-weight: bold;
        }
      }
      /deep/ .el-collapse-item__arrow {
        display: none;
      }
      .active-info-box {
        position: absolute;
        top: 51px;
        left: 11px;
        right: 11px;
        bottom: 11px;
        overflow: hidden;
        overflow-y: auto;
        /deep/ .el-collapse {
          border: 0;
        }
        /deep/ .el-collapse-item__header {
          border: 0;
          font-weight: normal;
          .el-icon-caret-bottom {
            transform: rotate(-90deg);
          }
          &.is-active {
            font-weight: bold;
            .el-icon-caret-bottom {
              transform: rotate(0);
            }
          }
        }
        /deep/ .el-collapse-item {
          margin-bottom: 1px;
        }
      }
      .rbr-content {
        color: $l-color-fontcolor-3;
        font-size: $l-font-size;
      }
      .rbr-item {
        margin-top: 12px;
        font-size: $l-font-size;
        .rbr-item-title {
          color: $l-color-fontcolor-3;
        }
        .rbr-item-cont {
          color: $l-color-fontcolor-4;
        }
      }
    }
  }
  .trigger {
    position: absolute;
    top: calc(50% - 25px);
    height: 50px;
    right: 250px;
    width: 18px;
    z-index: 1000;
    border: 1px solid $l-color-text-secondary;
    background-color: $l-color-white;
    border-radius: 4px;
    cursor: pointer;

    i {
      position: relative;
      top: 35%;
      left: 1px;
    }
  }
}
.c-description {
  line-height: 18px;
  background-color: $l-color-bgcolor-18;
  border-radius: 2px;
  padding: 10px;
  margin-bottom: 30px;
  p {
    display: inline-block;
  }
  span {
    margin-right: 8px;
  }
  em {
    font-style: normal;
    color: $l-color-fontcolor-5;
    margin-right: 15px;
  }
}
.chart-title-name {
  margin-right: 10px;
  color: $l-color-primary1;
}
.chart-title-bs {
  color: $l-color-fontcolor-4;
}
.chart-title-unit {
  color: $l-color-fontcolor-3;
}
.iconzhibiaojiedu {
  color: $l-color-fontcolor-2;
}
</style>
