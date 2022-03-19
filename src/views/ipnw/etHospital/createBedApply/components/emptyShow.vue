<template>
  <el-card class="card-cont1 height100">
    <div class="newFileBox">
      <div>
        <div
          class="addnewFile"
          @click="addnewFile"
        >
          <span class="el-icon-circle-plus-outline addnewFilesize"></span>
          <span class="addnewFilesize1">新建档案</span>
        </div>
        <div class="addnewFilesize2">档案信息为空,请选择患者</div>
        <div class="addnewFilesize2">或新建档案</div>
      </div>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {};
  },
  /**
   * 新增档案按钮（addnewFile）：
   * 1. 显示新增档案弹窗
   * 
   * 
  */
  methods: {
      addnewFile (){
        this.$emit("addnewFile");
      }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.card-cont1 {
  .addnewFilesize {
    width: 36px;
    height: 36px;
    font-size: 36px;
    color: rgba(179, 179, 179, 1);
  }

  .addnewFilesize1 {
    height: 52px;
    font-size: 36px;
    color: rgba(179, 179, 179, 1);
    line-height: 52px;
  }

  .addnewFilesize2 {
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #b9c4cc;
  }

  .addnewFile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 381px;
    height: 280px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  .newFileBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
