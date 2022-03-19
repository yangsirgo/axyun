<template>
  <div class="interprete">
    <div class="inner">
      <div class="top-title">
        <p>
          <span>白细胞计数</span>指标解读
        </p>
      </div>
      <div class="content">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="临床意义" name="1">
            <p>白细胞总数升高，是被非常关注的问题，这种升高既有生理性因素也有病理性因素。白细胞数量升高和减少往往有以下情况：</p>
            <p>1.生理性增高</p>
            <p>新生儿、妊娠末期、分娩期、剧烈运动后等</p>
            <p>2.病理性增高</p>
            <p>化脓性细菌性炎症、尿毒症、白血病、组织损伤、手术创伤等</p>
            <p>3.减少</p>
            <p>病毒性感染、伤寒、副伤寒、黑热病、疟疾、再生障碍性贫血、化疗和放疗后等</p>
          </el-collapse-item>
          <el-collapse-item title="治疗措施" name="2">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "indexInterpretation",
  data() {
    return {
      activeNames: ["1"]
    };
  },

  methods: {}
};
</script>
<style lang='scss' scoped>
.interprete {
  // width: 298px;
  // height: 500px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
  .inner {
    width: 100%;
    height: 100%;
    border: 1px solid $l-color-border-1;
    .top-title {
      width: 100%;
      height: 36px;
      line-height: 36px;
      padding-left: 20px;
      border-bottom: 1px solid $l-color-border-1;
      span {
        color: $l-color-primary1;
      }
    }
    .content {
      width: 100%;
      height: calc(100% - 36px);
      overflow-y: auto;
    }
  }
}
</style>
