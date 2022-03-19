<template>
    <div style="width: 100%;height: 100%;">
      <el-card style="width: 100%;height: 100%;">
        <div style="width: 30%;height: 100%;float: left;">
          <time-line :showSort="true" ref="timeLine"></time-line>
        </div>
        <div style="height: 100%;margin-left: 30%;padding: 20px;border-left: 1px solid #E4E4E4">
          <el-button>报告</el-button>
          <table border="1" cellpadding="8px" cellspacing="0" style="margin-top: 10px;border-color: #E9EDF0">
                          <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
            <tr>
              <td width="100" style="background-color: #F6F6F6">影像号</td>
              <td>tNo818291</td>
              <td style="background-color: #F6F6F6">申请医师</td>
              <td>王雪</td>
              <td style="background-color: #F6F6F6">申请科室</td>
              <td>泌尿外科</td>
              <td style="background-color:#F6F6F6">申请时间</td>
              <td>2019-09-24 10:12</td>
            </tr>
            <tr>
              <td style="background-color:#F6F6F6">病人</td>
              <td>李小芬</td>
              <td style="background-color:#F6F6F6">检查类型</td>
              <td>CT</td>
              <td style="background-color:#F6F6F6">检查部位</td>
              <td>头颅</td>
              <td style="background-color:#F6F6F6"> 检查时间</td>
              <td>2019-09-24 17:12</td>
            </tr>
            <tr>
              <td style="background-color:#F6F6F6">影像表现</td>
              <td colspan="7">脑实质密度正常，未见异常密度影及占位病变。脑室、脑池及脑沟的大小、形态和位置未见异常，中线结构无移位。顶部皮下可见软组织增厚影，枕骨右侧局限性可见多发条带透亮影。</td>
            </tr>
            <tr>
              <td style="background-color:#F6F6F6">影像诊断</td>
              <td colspan="7">1.顶部皮下血肿；
                2.枕骨右侧局限性多发条带透亮影，建议动态复查，除外骨折。</td>
            </tr>
          </table>
          <div style="margin-top: 10px;margin-bottom: 10px">
            <span>检验医师：张三</span>
            <span>审核医师：李四</span>
          </div>
          <span>影像资料：</span>
          <div style="height:340px;width: 100%;overflow: auto;margin-top: 10px">
            <img src="@/views/cis/integratedEmr/2.png"  alt=""/>
          </div>
        </div>
      </el-card>
    </div>
</template>

<script>
    import timeLine from '@/views/cis/integratedEmr/component/timeLine.vue'
    export default {
        name: "testReport",
        components:{
          timeLine
        },
        data(){
          return{
            detailList: [
              {
                date: new Date("2019-9-24"),
                project: '头部CT（CR/DR)',
                detail: 'XM001，CT室，已发布',
                value: true
              },
              {
                date: new Date("2019-9-20"),
                project: '腹部CT（CR/DR)',
                detail: 'XM001，CT室，已发布',
                value: false
              }
            ]
          }
        },
        methods:{

        },
        mounted(){
          this.$refs.timeLine.detailList = this.detailList
        }
    }
</script>

<style lang="scss" scoped>

</style>
