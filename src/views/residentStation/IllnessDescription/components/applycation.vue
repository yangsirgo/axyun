<template>
  <el-card class="box-card height100">
    <div slot="header" class="clearfix">
      <span class="titleBefore"></span>
      <span class="title">医技报告</span>
      <div class="fr margin-right-20">
        <el-button type="text" icon="iconfont iconxinzeng">新增申请</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="height100 padding20">
      <el-col :span="12" class="height100">
        <el-date-picker
          v-model="value1"
          type="daterange"
          style="margin-bottom: 10px; width: 100%"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="12" class="height100">
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568041431411&di=8f83eba4a16482a387a5e192ecc4af60&imgtype=0&src=http%3A%2F%2F1812.img.pp.sohu.com.cn%2Fimages%2Fblog%2F2012%2F6%2F10%2F0%2F3%2Fu94430753_138944cdb42g215.jpg" style="width: 100%;height: 100%" alt="">
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: "timer",
    data () {
      return {
        value1 : '',
        activities : [{
          content : '头部 CT (CR/DR)',
          timestamp : '2019-06-10'
        },{
          content : '头部 CT (CR/DR)',
          timestamp : '2019-06-11'
        }],
        medicalHistory: [{
          title: '上海复旦医院（2019-09-11）',
          text: '既往否认“糖尿病”等慢性病史，否认“伤寒”、“结核”等病史及其密切接触史，无手术、外伤史，无输血史，无食物及药物过敏史，预防接种史按计划进行。'
        }, {
          title: '上海东华医院（2019-09-11）',
          text: '既往因右输尿管上段结石行右侧经皮肾镜钬激光碎石术，因左肾结石行左侧输尿管軟镜镜检钬激光碎石术。'
        }],
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
  }
</style>
