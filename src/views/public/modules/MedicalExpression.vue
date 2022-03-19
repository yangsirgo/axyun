<template>
  <div class="medical-expression">
    <p class="title">月经表达式</p>
    <ul class="list">
      <li title="月经表达式1" @click="showExpression('menses1')">
        <img src="@/assets/expression_images/menses1.png" alt="月经表达式1">
      </li>
      <li title="月经表达式1" @click="showExpression('menses2')">
        <img src="@/assets/expression_images/menses2.png" alt="月经表达式2">
      </li>
      <li title="月经表达式1" @click="showExpression('menses3')">
        <img src="@/assets/expression_images/menses3.png" alt="月经表达式3">
      </li>
      <li title="月经表达式1" @click="showExpression('menses4')">
        <img src="@/assets/expression_images/menses4.png" alt="月经表达式4">
      </li>
    </ul>
    <p class="title">瞳孔表达式</p>
    <ul class="list">
      <li title="瞳孔表达式" @click="showExpression('pupil')">
        <img src="@/assets/expression_images/pupil.png" alt="瞳孔表达式">
      </li>
    </ul>
    <p class="title">光定位表达式</p>
    <ul class="list">
      <li title="光定位表达式" @click="showExpression('light')">
        <img src="@/assets/expression_images/lightfix.png" alt="光定位表达式">
      </li>
    </ul>
    <p class="title">胎心表达式</p>
    <ul class="list">
      <li title="胎心表达式" @click="showExpression('fetal')">
        <img src="@/assets/expression_images/fetalheart.png" alt="胎心表达式">
      </li>
    </ul>
    <p class="title">牙科表达式</p>
    <ul class="list">
      <li title="恒牙表达式" @click="showExpression('permanentteeth')">
        <img src="@/assets/expression_images/permanentteeth.png" alt="恒牙表达式">
      </li>
      <li title="乳牙表达式" @click="showExpression('babyteeth')">
        <img src="@/assets/expression_images/milkteeth.png" alt="乳牙表达式">
      </li>
      <li title="混合牙表达式" @click="showExpression('mixteeth')">
        <img src="@/assets/expression_images/mixteeth.png" alt="混合牙表达式">
      </li>
      <li title="牙体表达式" @click="showExpression('mixteeth2')">
        <img src="@/assets/expression_images/teethbody.png" alt="牙体表达式">
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props:{
    editor:{
      type:Object,
      default: null
    }
  },
  data() {
    return {
      
    };
  },
  created(){
    if(!this.editor){
      this.$message({
          type: "error",
          message: "请传入正确的编辑器实例！"
      });
      return;
    }
  },
  methods: {
    showExpression(type){
      if(this.editor.options.editorModel=='pure' || this.editor.options.editorModel=='dirty' || this.editor.options.editorModel=='secret'){
        this.$message({
            type: "warning",
            message: "浏览模式不允许编辑！"
        });
        return;
      }
      this.editor.execCommand(type);
    }
  }
};
</script>
<style lang="scss">
.medical-expression{
  padding: 0 0 0 1px!important;
  .title{
    height: 44px;
    margin-bottom: 4px;
    padding-left: 10px;
    line-height: 44px;
    box-sizing: border-box;
    border-radius:0px 4px 0px 0px;
    font-size:16px;
    font-weight:bold;
    color:#2E323A;
    background: $l-color-bgcolor-18;
  }
  .list{
    padding: 0 10px; 
    li{
      margin-bottom: 4px;
      cursor: pointer;
      img{
        width: 100%;
      }
    }
  }
}
</style>