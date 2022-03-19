<template>
  <el-card class="box-card height100">
    <div slot="header" class="clearfix">
      <span class="titleBefore"></span>
      <span class="title">病程录</span>
      <div class="fr margin-right-20">
        <el-button type="text" icon="iconfont iconxinzeng">新增病历</el-button>
      </div>
    </div>
    <div>
      <div class="item" v-for="(item, index) in diseaseList">
        <div class="title">
          <span>治医师查房记录 - {{item.doctor}}</span>
          <span>{{item.time}}</span>
        </div>
        <div class="content">
          {{item.content}}
        </div>
      </div>
      <div class="getMore">
        查看更多
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "timer",
    data () {
      return {
        diseaseList : [{
          time : "2019-02-12 18:30",
          doctor : "张伟",
          content : "随方向主治医师查房，患者神志清楚，诉头痛减轻，无胸闷、胸痛及气促；入科后液体+605ml，尿量630ml。心电监护示：HR64bpm，入科后液体+605ml，尿量630ml。心电监护示：HR64bpm。"
        },{
          time : "2019-02-12 18:30",
          doctor : "张伟",
          content : "随方向主治医师查房，患者神志清楚，诉头痛减轻，无胸闷、胸痛及气促；入科后液体+605ml，尿量630ml。心电监护示：HR64bpm，入科后液体+605ml，尿量630ml。心电监护示：HR64bpm。"
        },{
          time : "2019-02-12 18:30",
          doctor : "张伟",
          content : "随方向主治医师查房，患者神志清楚，诉头痛减轻，无胸闷、胸痛及气促；入科后液体+605ml，尿量630ml。心电监护示：HR64bpm，入科后液体+605ml，尿量630ml。心电监护示：HR64bpm。"
        },{
          time : "2019-02-12 18:30",
          doctor : "张伟",
          content : "随方向主治医师查房，患者神志清楚，诉头痛减轻，无胸闷、胸痛及气促；入科后液体+605ml，尿量630ml。心电监护示：HR64bpm，入科后液体+605ml，尿量630ml。心电监护示：HR64bpm。"
        },{
          time : "2019-02-12 18:30",
          doctor : "张伟",
          content : "随方向主治医师查房，患者神志清楚，诉头痛减轻，无胸闷、胸痛及气促；入科后液体+605ml，尿量630ml。心电监护示：HR64bpm，入科后液体+605ml，尿量630ml。心电监护示：HR64bpm。"
        }]
      }
    }
  }
</script>

<style scoped lang="scss">
  .box-card {
    position: relative;
    text-align: left;

    .clearfix {
      line-height: 50px;
    }

    /deep/.el-card__header {
      padding: 0 !important;

    }

    .titleBefore {
      vertical-align: middle;
      margin-right: 5px;
      height: 20px;
      background: $l-color-primary;
      display: inline-block;
      width: 4px;
      margin-left: 15px;
    }

    .title {
      font-size: 16px;
      
      font-weight: 500;
      color: rgba(46, 50, 58, 1);
      vertical-align: -2px;
    }

    .item {
      height: 90px;
      padding: 10px;
      line-height: 90px;
      border-bottom: 1px solid rgba(228,228,228,1);
      .title {
        font-size:14px;
        
        font-weight:bold;
        color:rgba(46,50,58,1);
        line-height:30px;
      }
      .content {
        font-size:14px;
        
        font-weight:400;
        color:rgba(148,157,163,1);
        line-height:20px;
      }

    }

    .getMore {
      font-size:14px;
      
      font-weight:400;
      color:rgba(148,157,163,1);
      text-align: center;
      line-height: 60px;
      cursor: pointer;
    }
  }
</style>
