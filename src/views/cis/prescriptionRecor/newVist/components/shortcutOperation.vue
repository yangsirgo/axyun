<template>
  <div class="entry-cards clearfix">
    <el-col :span="6" class="card-item" v-for="(item, i) in labelList" :key="i">
      <span :class="item.icon"></span>
      <i>{{item.name}}</i>
    </el-col>
  </div>
</template>

<script>
  export default {
    name: "ShortcutOperation",
    data() {
      return {
        labelList: [
          {
            icon: 'iconfont iconlicizhenduan',
            name: '下诊断'
          },
          {
            icon: 'iconfont icondianzibingli',
            name: '写病历'
          },
          {
            icon: 'iconfont iconmenzhenchufang',
            name: '开处方'
          },
          {
            icon: 'iconfont icondianzishenqing',
            name: '开申请'
          },
          {
            icon: 'iconfont iconyuyueguahao',
            name: '诊间结算'
          },
          {
            icon: 'iconfont iconyuyueguahao',
            name: '看报告'
          },
          {
            icon: 'iconfont iconyuyueguahao',
            name: '入院申请'
          },
          {
            icon: 'iconfont iconyuyueguahao',
            name: '请假条'
          },
          {
            icon: 'iconfont iconyuyueguahao',
            name: '预约'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  .entry-cards {
    /*padding-left: 6px;*/

    .card-item {
      width: 56px;
      height: 58px;
      margin-left: 14px;
      margin-bottom: 14px;
      background: $l-color-bgcolor-18;
      border-radius: 4px;
      text-align: center;

      span {
        width: 16px;
        height: 16px;
        margin-top: 10px;
        color: $l-color-primary;
        display: inline-block;
      }

      i {
        margin-top: 5px;
        text-align: center;
        font-style: normal;
        font-size: 12px;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        display: block;
      }
    }

  }
</style>
