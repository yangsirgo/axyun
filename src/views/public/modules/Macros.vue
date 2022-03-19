<template>
  <div id="macrosLibrary" class="macros-library">
    <div id="searchBox" class="search-box">
      <!-- 检索 -->
      <el-input class="keyword" placeholder="请输入检索条件" v-model="keyword" @keyup.enter.native="load">
        <el-button slot="append" icon="el-icon-search" @click.native="load"></el-button>
      </el-input>
    </div>
    <!-- 检索结果 -->
    <div id="results">
      <ul class="macro-list">
        <li v-for="(macro,index) in macros" @dblclick="addMacro(macro)">
          {{macro.mrShareEleNm}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {getMacros} from '@/api/emr/element'

export default {
  props:{
    editor:{
      type:Object,
      default: null
    }
  },
  data() {
    return {
      macros: [],
      keyword: ''
    };
  },
  mounted(){
    this.$nextTick(function(){
      document.getElementById('results').style.height=document.getElementById('macrosLibrary').offsetHeight-document.getElementById('searchBox').offsetHeight+'px';
      window.onresize=function(){
        document.getElementById('results').style.height=document.getElementById('macrosLibrary').offsetHeight-document.getElementById('searchBox').offsetHeight+'px';
      }
      this.load();
    })
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
    async load(){
      try{
        let response=await getMacros({mrShareEleNm:this.keyword});
        if(response.code==1){
          this.macros=response.data;
        }
      }catch(e){
        console.log(e);
        this.$message({
            type: "error",
            message: "加载失败，请重试！"
        });
      }
    },
    async addMacro(macro){
      var model=this.editor.options.editorModel;
      if(model=='pure' || model=='dirty' || model=='secret'){
        this.$message({
            type: "warning",
            message: "浏览模式不允许编辑！"
        });
        return;
      }
      this.editor.execCommand('insertmacros', {id:macro.mrShareEleId,code:macro.mrShareEleCd,name:macro.mrShareEleNm,isSecret:macro.securityF == 1});
    }
  }
};
</script>
<style lang="scss">
.macros-library{
  padding: 0!important;
  padding-left: 1px;
  .search-box{
    padding: 10px;
    border-bottom: 1px solid #C5CBCF;
  }
  #results{
    overflow-y: auto;
    .macro-list{
      overflow: hidden;
      margin-bottom: 10px;
      border-left: 1px solid #C5CBCF;
      li{
        float: left;
        width: 50%;
        padding: 15px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #C5CBCF;
        border-right: 1px solid #C5CBCF;
        text-align: center;
        font-size: 14px;
        color: #2E323A;
        cursor: pointer;
        user-select:none;
        &:hover{
          background: $l-color-bgcolor-1;
        }
      }
    }
  }
}
</style>