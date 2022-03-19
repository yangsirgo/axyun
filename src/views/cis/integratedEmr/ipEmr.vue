<template>
  <div ref="page" style="border: 1px solid red;height: 100%">
    <el-tabs v-model="activeTab" @tab-click="clickTab" style="height: 100%;">
      <el-tab-pane label="概览" name="overview" style="border: 1px solid red">
        <div style="height: 100%;width: 700px;float: left;">
          <el-card style="width: 100%;height: 50%;">
            <div style="width: 100%;height: 50px;border: 1px solid red;background-color: #888888">
              <span style="line-height: 50px">病案首页</span>
            </div>
            <div style="width: 100%;height: 82%;border: 1px solid red;overflow-y: auto;overflow-x: hidden">
              <mr-homepage style="transform: scale(0.6);transform-origin: 0 0"></mr-homepage>
            </div>
          </el-card>
          <el-card style="width: 100%;height: 50%;margin-top: 10px">
            <div style="width: 100%;height: 50px;border: 1px solid red;background-color: #888888">
              <el-select v-model="reportType" style="width: 50px;">
                <el-option
                  v-for="item in reportTypeOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span style="line-height: 50px">报告</span>
            </div>
          </el-card>
        </div>
        <div style="height: 100%;margin-left: 710px">
          <el-card style="width: 100%;height: 30%;">
            <div style="width: 100%;height: 50px;border: 1px solid red;background-color: #888888">
              <span style="line-height: 50px">诊断记录</span>
              <el-select v-model="diagnosticType" style="width: 100px;">
                <el-option
                  v-for="item in diagnosticTypeOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-card>
          <el-card style="width: 100%;height: 40%;margin-top: 5px">
            <div style="width: 100%;height: 50px;border: 1px solid red;background-color: #888888">
              <span style="line-height: 50px">医嘱记录</span>
              <el-checkbox v-model="long">长期</el-checkbox>
              <el-checkbox v-model="temporary">临时</el-checkbox>
              <el-checkbox v-model="dischange">出院带药</el-checkbox>
            </div>
          </el-card>
          <el-card style="width: 100%;height: 30%;margin-top: 5px">
            <div style="width: 100%;height: 50px;border: 1px solid red;background-color: #888888">
              <span style="line-height: 50px">文书记录</span>
            </div>
            <div style="overflow: auto;height: 65%">
              <div style="border: 1px solid black;" v-for="(item,index) in insRecList" :key="index">
                <p style="display: inline">{{item.title}}</p><p style="display: inline;margin-left: 10px">{{item.date.format('yyyy-MM-dd hh:mm')}}</p>
                <p>{{item.content}}</p>
              </div>
            </div>

          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="病历文书" name="emr" style="border: 1px solid red">
      </el-tab-pane>
      <el-tab-pane label="检查报告" name="examRep" style="border: 1px solid red">
        <div style="width: 400px;height: 100%;float: left;border: 1px solid red">
          <time-line :showSort="true"></time-line>
        </div>
        <div style="height: 100%;margin-left: 410px;border: 1px solid red;padding: 10px;">
          <el-button>报告</el-button>
          <table border="1" cellpadding="8px" cellspacing="0">
                          <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
            <tr>
              <td>影像号</td>
              <td>tNo818291</td>
              <td>申请医师</td>
              <td>王雪</td>
              <td>申请科室</td>
              <td>泌尿外科</td>
              <td>申请时间</td>
              <td>2019-06-10 10:12</td>
            </tr>
            <tr>
              <td>病人</td>
              <td>血液</td>
              <td>检查类型</td>
              <td>泌尿外科</td>
              <td>检查部位</td>
              <td>2019-06-10 18:12</td>
              <td>检查时间</td>
              <td>2019-06-10 17:12</td>
            </tr>
            <tr>
              <td>影像表现</td>
              <td colspan="7">脑实质密度正常，未见异常密度影及占位病变。脑室、脑池及脑沟的大小、形态和位置未见异常，中线结构无移位。顶部皮下可见软组织增厚影，枕骨右侧局限性可见多发条带透亮影。</td>
            </tr>
            <tr>
              <td>影像诊断</td>
              <td colspan="7">1.顶部皮下血肿；
                2.枕骨右侧局限性多发条带透亮影，建议动态复查，除外骨折。</td>
            </tr>
          </table>
          <div>
            <span>检验医师：张三</span>
            <span>审核医师：李四</span>
          </div>
          <span>影像资料：</span>
          <div style="height:340px;width: 100%;border: 1px solid red;overflow: auto">
            <img src="1.png" alt=""/>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="检验报告" name="testRep" style="border: 1px solid red">
      </el-tab-pane>
      <el-tab-pane label="医嘱列表" name="orderList" style="border: 1px solid red">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import adHeight from '@/mixins/adHeight'
    import timeLine from './component/timeLine'
    import mrHomepage from '../../ipnw/IntegratedEmr/component/mrHomepage'
    export default {
        name: "ipEmr",
        mixins:[adHeight],
        components:{
          timeLine,
          mrHomepage
        },
        data(){
          return {
            activeTab:'overview',
            reportType:'0',
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
            diagnosticType:'0',
            diagnosticTypeOpts:[
              {
                value:'0',
                label:'家床诊断'
              }
            ],
            long:false,
            temporary:false,
            dischange:false,
            insRecList:[
              {
                date:new Date('2019-06-19 10:01'),
                title:'主治医师查房记录 王大锤 ',
                content:'随方向主治医师查房，患者神志清楚，诉头痛减轻，无胸闷、胸痛及气促；入科后液体+605ml，尿量630ml。心电监护示：HR64bpm，=.....'
              },
              {
                date:new Date('2019-06-18 10:01'),
                title:'主治医师查房记录 王大锤 ',
                content:'患者持续镇静镇痛下RASS评分-2分，心室率较前减慢，波动在50次/分左右，血压126/56mmHg，SPO298%，考虑患者心电动态演变...'
              },
              {
                date:new Date('2019-06-17 10:01'),
                title:'主治医师查房记录 王大锤 ',
                content:'患者持续喷他左辛镇痛，神志清楚，利尿后尿量100ml/h，白班结果回报：血常规：白细胞数目9.4X10^9/L;红细胞'
              }
            ]
          }
        },
        methods:{
          clickTab(){

          },
        }
    }
</script>

<style lang="scss" scoped>
  /deep/.el-tab-pane {
    height: 90%;
  }
</style>
