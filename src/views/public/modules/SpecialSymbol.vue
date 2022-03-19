<template>
  <div class="special-symbol">
    <!-- <div class="search">
      <LFormtTitle label="选择类别" labelWidth="64">
        <el-select v-model="category">
          <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </LFormtTitle>
    </div> -->
    <ul class="symbols">
      <li v-for="(symbol,index) in symbols" @dblclick="addSymbol(symbol)">
          {{symbol}}
      </li>
    </ul>
  </div>
</template>
<script>

// 历次处方
export default {
  components: {
    
  },
  props:{
    editor:{
      type:Object,
      default: null
    }
  },
  data() {
    return {
      category: 0,
      categories: [
        {
          label:'单位',
          value:0
        },{
          label:'符号',
          value:1
        }
      ],
      symbols: "㎏/㎡,mmHg,mmol/L,μmol/L,pmol/L,nmol/L,μg/mL,μg/L,mg/24h,U/L,mU/L,℃,℉,‰,％,%,㎎,㎏,㎜,㎝,㎞,㎡,㏄,㏎,Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ,Ⅵ,Ⅶ,Ⅷ,Ⅸ,Ⅹ,Ⅺ,Ⅻ,⑴,⑵,⑶,⑷,⑸,⑹,⑺,⑻,⑼,⑽,⑾,⑿,⒀,⒁,⒂,⒃,⒄,⒅,⒆,⒇,①,②,③,④,⑤,⑥,⑦,⑧,⑨,⑩".split(',')
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
    addSymbol(symbol){
      if(this.editor.options.editorModel=='pure' || this.editor.options.editorModel=='dirty' || this.editor.options.editorModel=='secret'){
        this.$message({
            type: "warning",
            message: "浏览模式不允许编辑！"
        });
        return;
      }
      this.editor.execCommand('inserthtml',symbol);
    }
  }
};
</script>
<style lang="scss">
.special-symbol{
  padding: 0!important;
  .search{
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #C5CBCF;
  }
  .symbols{
    overflow: hidden;
    border-left: 1px solid #C5CBCF;
    li{
      float: left;
      width: 79px;
      padding: 20px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #C5CBCF;
      border-right: 1px solid #C5CBCF;
      color: #161723;
      text-align: center;
      user-select:none;
      cursor: pointer;
      &:hover{
        background: $l-color-bgcolor-1;
      }
    }
  }
}
</style>