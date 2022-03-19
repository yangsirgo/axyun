<template>
    <div style="width: 100%;height: 100%;">
      <el-card style="height: 100%;width: 100%;">
        <div style="width: 30%;height: 100%;float: left;">
          <time-line :showSort="true" ref="timeLine"></time-line>
        </div>
        <div style="height: 100%;margin-left: 30%;padding: 20px;border-left: 1px solid #E4E4E4">
          <el-button>报告</el-button>
          <div style="text-align: right;float: right">
            <el-checkbox v-model="onlyDangerVal">仅看危急值</el-checkbox>
            <el-checkbox v-model="onlyIrregularVal">仅看异常值</el-checkbox>
          </div>
          <table border="1" cellpadding="8px" cellspacing="0" style="margin-top: 20px;border-color: #E9EDF0">
                          <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
            <tr>
              <td style="background-color:#F6F6F6">申请单号</td>
              <td>tNo818291</td>
              <td style="background-color:#F6F6F6">申请人</td>
              <td>王雪</td>
              <td style="background-color:#F6F6F6">申请科室</td>
              <td>泌尿外科</td>
              <td style="background-color:#F6F6F6">申请时间</td>
              <td>2019-09-24 10:12</td>
            </tr>
            <tr>
              <td style="background-color:#F6F6F6">送检标本</td>
              <td>血液</td>
              <td style="background-color:#F6F6F6">送检科室</td>
              <td>泌尿外科</td>
              <td style="background-color:#F6F6F6">送检时间</td>
              <td>2019-09-24 18:12</td>
              <td style="background-color:#F6F6F6">检出时间</td>
              <td>2019-09-24 17:12</td>
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
              <template slot-scope="scope">
                <span :class="warnFlag(scope.row.testResult)" >{{scope.row.testResult}}</span>
              </template>
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
              <span>核收日期：2019-09-25 16:00:00</span>
            </el-col>
            <el-col :span="6">
              <span>报告日期：2019-09-25 18:00:00</span>
            </el-col>
          </el-row>
          <p style="margin-top: 25px;font-size: 10px">#本报告仅对本标本负责</p>
          <p style="font-weight: bold;margin-top: 20px">危&nbsp;&nbsp;险&nbsp;&nbsp;性：<span style="color: red;">急性白血病可能</span></p>
          <p style="margin-top: 5px"><span style="font-weight: bold">处理方式：</span><span style="color: red;">进行白细胞分类，观察外周血涂片和进行骨髓检查。</span></p>
          <p style="margin-top: 5px"><span style="font-weight: bold">处理结果：</span><span style="color: red;">确诊急性白血病。</span></p>
          <div id="myChart" style="width: 900px;height: 190px;margin-top: 10px"></div>
        </div>
      </el-card>
    </div>
</template>

<script>
    import timeLine from '@/views/cis/integratedEmr/component/timeLine.vue'
    import echarts from 'echarts/lib/echarts'
    // 引入折线图
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/title');
    // 引入提示框和title组件，图例
    require('echarts/lib/component/tooltip')
    export default {
        name: "examReport",
        components: {
          timeLine
        },
        data(){
          return{
            onlyDangerVal: false,
            onlyIrregularVal: false,
            examList: [
              {
                project: '白细胞计数',
                testResult: '63.0',
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
            detailList: [
              {
                date: new Date("2019-9-24"),
                project: '血常规',
                detail: 'XM001，检验科，已发布',
                value: true
              },
              {
                date: new Date("2019-9-20"),
                project: '血常规',
                detail: 'XM001，检验科，已发布',
                value: false
              },
              {
                date: new Date("2019-9-15"),
                project: '血常规',
                detail: 'XM001，检验科，已发布',
                value: false
              }
            ]
          }
        },
        methods: {
          drawLines(){
            let myChart = echarts.init(document.getElementById('myChart'));
            let option = {
              title: {
                text: '白细胞计数结果趋势',
                textStyle: {
                  fontSize: 14
                },
                padding:0
              },
              grid: {
                top:30
              },
              xAxis: {
                type: 'category',
                data: ['2019-9-15','2019-9-20', '2019-9-24']
              },
              yAxis: {
                type: 'value',
                max:100
              },
              series: [{
                data: [3,8,63],
                type: 'line'
              }]
            };
            myChart.setOption(option)
          },
          resIcon(result){
            switch (result) {
              case 'up':
                return 'iconfont iconshangsheng red'
              case 'down':
                return 'iconfont iconxiajiang blue'
              case 'flat':
                return 'flat'
            }
            return ''
          },
          warnFlag(val){
            if (val >= 63) {
              return 'warn-text'
            }
            return ''
          }
        },
      mounted(){
        this.drawLines()
        this.$refs.timeLine.detailList = this.detailList
      }
    }
</script>

<style lang="scss" scoped>
  .el-row::after{
    clear: none;
  }
  .warn-text{
    color: red;
    font-size: 18px;
    font-weight: bold;
  }
  .red{
    color: red;
  }
  .blue{
    color:blue;
  }
</style>
