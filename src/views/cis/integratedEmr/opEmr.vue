<template>
  <div ref="page" style="height: 100%" class="op-emr-contain">
    <el-tabs v-model="activeTab" @tab-click="clickTab" style="height: 100%;">
      <el-tab-pane label="概览" name="overview">
        <div style="height: 100%;width: 49%;float: left;">
          <el-card style="width: 100%;height:40%;">
            <div style="width: 100%;height: 40px;border-bottom: 1px solid #E4E4E4">
              <div style="margin-left:10px;margin-top:10px;width: 5px;height: 20px;background-color: #FF5300;float: left"></div>
              <span style="line-height: 40px;margin-left: 5px">文书记录</span>
            </div>
          </el-card>
          <el-card style="width: 100%;height:60%;margin-top: 15px" id="report">
            <div style="width: 100%;height: 40px;border-bottom: 1px solid #E4E4E4">
              <div style="margin-left:10px;margin-top:10px;width: 5px;height: 20px;background-color: #FF5300;float: left"></div>
              <el-select v-model="reportType" style="width: 80px;margin-left: 5px">
                <el-option
                  v-for="item in reportTypeOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span style="line-height: 40px;margin-left: 5px">报告</span>
            </div>
            <div style="width: 400px;height: 360px;float: left;">
              <time-line></time-line>
            </div>
            <div style="height: 360px;margin: 20px 20px 20px 410px;padding-left:20px;overflow: auto;border-left: 1px solid #E4E4E4">
              <div v-if="reportType==='0'" >
                 <img src="1.png" alt=""/>
              </div>
              <div v-else>
                <el-table
                  :data="testReport"
                  border
                  :height="testRecTableHeight"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="project"
                    label="检验项目"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="testResult"
                    label="测定结果"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="unit"
                    label="单位"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    label="结果"
                    width="100">
                    <template slot-scope="scope">
                      <i :class="resIcon(scope.row.result)" ></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="scope"
                    label="参考范围"
                    width="100">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
        <div style="height: 100%;margin-left: 50%">
          <el-card style="width: 100%;height: 30%;" id="diagnosticRec">
            <div style="width: 100%;height: 40px;border-bottom: 1px solid #E4E4E4">
              <div style="margin-left:10px;margin-top:10px;width: 5px;height: 20px;background-color: #FF5300;float: left"></div>
              <span style="line-height: 40px;margin-left: 5px">诊断记录</span>
            </div>
            <el-table
              :data="diagnosticRec"
              border
              :height="diagnosticRecHeight"
              style="width: 100%">
              <el-table-column
                prop="date"
                label="时间"
                width="200">
              </el-table-column>
              <el-table-column
                prop="diagnosticType"
                label="诊断类型"
                width="300">
              </el-table-column>
              <el-table-column
                prop="diagnosticName"
                label="诊断名称">
              </el-table-column>
            </el-table>
          </el-card>
          <el-card style="width: 100%;height: 70%;margin-top: 15px" id="prescriptionRec">
            <div style="width: 100%;height: 40px;border-bottom: 1px solid #E4E4E4">
              <div style="margin-left:10px;margin-top:10px;width: 5px;height: 20px;background-color: #FF5300;float: left"></div>
              <span style="line-height: 40px;margin-left: 5px">处方记录</span>
            </div>
            <el-table
              :data="prescriptionRec"
              border
              :height="prescriptionRecTableHeight"
              :span-method="rowSpanMethod"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="date"
                label="时间"
                width="150">
              </el-table-column>
              <el-table-column
                prop="drugName"
                label="药品名称"
                width="200">
              </el-table-column>
              <el-table-column
                prop="dose"
                label="规格剂量"
                width="150">
              </el-table-column>
              <el-table-column
                prop="dosage"
                label="用量"
                width="150">
              </el-table-column>
              <el-table-column
                width="50">
                <template slot-scope="scope">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="frequency"
                label="用法频次">
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="病历文书" name="emr"></el-tab-pane>
      <el-tab-pane label="检查报告" name="examReport">
        <el-card style="height: 100%;width: 100%;">
          <div style="width: 30%;height: 100%;float: left;">
            <time-line :showSort="true"></time-line>
          </div>
          <div style="height: 100%;margin-left: 30%;padding: 20px;border-left: 1px solid #E4E4E4">
            <el-button>报告</el-button>
            <div style="text-align: right;float: right">
              <el-checkbox v-model="onlyDangerVal">仅看危急值</el-checkbox>
              <el-checkbox v-model="onlyIrregularVal">仅看异常值</el-checkbox>
            </div>
            <table border="1" cellpadding="8px" cellspacing="0" style="margin-top: 20px">
                            <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
              <tr>
                <td>申请单号</td>
                <td>tNo818291</td>
                <td>申请人</td>
                <td>王雪</td>
                <td>申请科室</td>
                <td>泌尿外科</td>
                <td>申请时间</td>
                <td>2019-06-10 10:12</td>
              </tr>
              <tr>
                <td>送检标本</td>
                <td>血液</td>
                <td>送检科室</td>
                <td>泌尿外科</td>
                <td>送检时间</td>
                <td>2019-06-10 18:12</td>
                <td>检出时间</td>
                <td>2019-06-10 17:12</td>
              </tr>
            </table>
            <el-table
              :data="examList"
              border
              style="width: 100%;margin-top: 20px">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="project"
                label="检验项目"
                width="200">
              </el-table-column>
              <el-table-column
                prop="testResult"
                label="测定结果"
                width="120">
              </el-table-column>
              <el-table-column
                prop="unit"
                label="单位"
                width="120">
              </el-table-column>
              <el-table-column
                label="结果"
                width="120">
                <template slot-scope="scope">
                  <i :class="resIcon(scope.row.result)" ></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="scope"
                label="参考范围"
                width="120">
              </el-table-column>
              <el-table-column
                label="解读"
                width="120">
                <template slot-scope="scope">
                  <el-button size="mini"><i class="iconfont icon-dianzibingli2"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="margin-top: 20px">
              <el-col :span="6">
                <span>检验医师：张三</span>
              </el-col>
              <el-col :span="6">
                <span>审核医师：李四</span>
              </el-col>
              <el-col :span="6">
                <span>核收日期：2019-06-01 16:00:00</span>
              </el-col>
              <el-col :span="6">
                <span>报告日期：2019-06-01 18:00:00</span>
              </el-col>
            </el-row>
            <span style="margin-top: 20px">#本报告仅对本标本负责</span>
            <div id="myChart" style="width: 1000px;height: 300px;margin-top: 20px"></div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="检验报告" name="testReport"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import adHeight from '@/mixins/adHeight'
    import echarts from 'echarts/lib/echarts'
    import timeLine from './component/timeLine'
    // 引入折线图
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/title');
    // 引入提示框和title组件，图例
    require('echarts/lib/component/tooltip')

    export default {
      name: "index",
      mixins: [adHeight],
      components: {
        timeLine
      },
      data(){
        return {
          activeTab: 'overview',
          reportType: '0',
          reportTypeOpts: [
            {
              label: '检查',
              value: '0'
            },
            {
              label: '检验',
              value: '1'
            }
          ],
          diagnosticRec: [],
          prescriptionRec: [
            {
              date: '2019-09-12',
              drugName: '葡萄糖注射液',
              dose: '5%  500.0ml/袋',
              dosage: '1.0袋',
              groupNoCls: 'bunchingUp',
              frequency: '静滴 qd x 1天'
            },
            {
              date: '2019-09-12',
              drugName: '丹参注射液',
              dose: '10ml/支',
              dosage: '1.0支',
              groupNoCls: 'bunchingCenter',
              frequency: '静滴 qd x 1天'
            },
            {
              date: '2019-09-12',
              drugName: '乳糖酸阿奇霉素注射液',
              dose: '0.125g 2.5ml/支',
              dosage: '2.5ml/支',
              groupNoCls: 'bunchingDown',
              frequency: '静滴 qd x 1天'
            }
          ],
          testReport: [
            {
              project: '白细胞计数',
              testResult: '13.00',
              unit: '10^9/L',
              result: 'up',
              scope: '4.00~10.0'
            },
            {
              project: '中性粒细胞百分比',
              testResult: '62.4',
              unit: '%',
              result: 'flat',
              scope: '50.0~70.0'
            },
            {
              project: '淋巴细胞百分比',
              testResult: '10',
              unit: '%',
              result: 'down',
              scope: '20.0~40'
            }
          ],
          onlyDangerVal: false,
          onlyIrregularVal: false,
          examList: [
            {
              project: '白细胞计数',
              testResult: '13.00',
              unit: '10^9/L',
              result: 'up',
              scope: '4.00~10.0'
            },
            {
              project: '中性粒细胞百分比',
              testResult: '62.4',
              unit: '%',
              result: 'flat',
              scope: '50.0~70.0'
            },
            {
              project: '淋巴细胞百分比',
              testResult: '10',
              unit: '%',
              result: 'down',
              scope: '20.0~40'
            }
          ],
          diagnosticRecHeight: 100,
          testRecTableHeight: 100,
          prescriptionRecTableHeight: 100
        }
      },
      methods: {
        clickTab(){

        },
        rowSpanMethod({ row, column, rowIndex, columnIndex }){
          if (columnIndex === 0 || columnIndex === 6){
            if (rowIndex === 0) {
              return [3,1]
            }
              return [0,0]
          }
          return [1,1]
        },
        resIcon(result){
          switch (result) {
            case 'up':
              return 'iconfont iconshangsheng'
            case 'down':
              return 'iconfont iconxiajiang'
            case 'flat':
              return 'flat'
          }
          return ''
        },
        drawLines(){
          let myChart = echarts.init(document.getElementById('myChart'));
          let option = {
            title: {
              text: '白细胞计数结果趋势'
            },
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line'
            }]
          };
          myChart.setOption(option)
        }
      },
      computed: {

      },
      mounted(){
        this.drawLines()
        setTimeout(()=>{
          this.diagnosticRecHeight = document.getElementById("diagnosticRec").offsetHeight - 40
          this.testRecTableHeight = document.getElementById("report").offsetHeight - 90
          this.prescriptionRecTableHeight = document.getElementById("prescriptionRec").offsetHeight - 40
        })
      }
    }
</script>

<style lang="scss" scoped>
  .op-emr-contain{
    /deep/.el-tabs__content {
      height: 100%;
    }
    /deep/.el-tab-pane {
      height: 90%;
    }
    .bunchingUp {
      display: inline-block;
      color: $l-color-primary;

      &::after {
        content: '┓';
      }
    }

    .bunchingCenter {
      display: inline-block;
      color: $l-color-primary;

      &::after {
        content: '┫';
      }
    }

    .bunchingDown {
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: '┛';
      }
    }

    .flat{
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: '-';
      }
    }

    .bunchingSingle {
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: '】';
      }
    }

    .el-row::after{
      clear: none;
    }
  }
</style>
