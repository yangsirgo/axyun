<template>
  <div class="phrase-tools">
    <div class="anaTitle">
      <span class="redFont">白细胞计数</span
      ><span class="blackFont">指标解读</span>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="临床意义" name="1">
        <div class="mainText">
          <div class="phraseTitle">
            白细胞总数升高，是被非常关注的问题，这种升高既有生理性因素也有病理性因素。白细胞数量升高和减少往往有以下情况：
          </div>
          <div class="phraseTitle">1.生理性增高</div>
          <div class="phraseText">新生儿、妊娠末期、分娩期、剧烈运动后等</div>
          <div class="phraseTitle">2.病理性增高</div>
          <div class="phraseText">
            化脓性细菌性炎症、尿毒症、白血病、组织损伤、手术创伤等
          </div>
          <div class="phraseTitle">3.减少</div>
          <div class="phraseText">
            病毒性感染、伤寒、副伤寒、黑热病、疟疾、再生障碍性贫血、化疗和放疗后等
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="治疗措施" name="2"> </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      activeNames: []
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss">
.phrase-tools {
  padding: 0 !important;
  padding-left: 10px;
  border: 1px solid #dcdfe6;

  .anaTitle {
    margin: 10px 0px 10px 10px;
    font-size: 14px;
    font-weight: bolder;

    .redFont {
      color: #ff0000;
    }

    .blackFont {
      color: #303133;
    }
  }

  .el-collapse-item__header {
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #2e323a;
  }

  .mainText {
    margin: 10px 20px 10px 20px;
    font-size: 14px;
    color: #000000;
  }

  .phraseTitle {
    margin: 10px 0px 0px 0px;
  }

  .phraseText {
    margin: 0px 0px 10px 0px;
  }
}
</style>
