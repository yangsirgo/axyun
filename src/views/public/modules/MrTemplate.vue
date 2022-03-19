<template>
  <div class="mr-template" v-loading="loading">
    <!-- 所属范围 -->
    <el-checkbox-group class="scopeLevel" v-model="scopeLevel" @change="getTemplate">
      <el-checkbox label="level0">全院</el-checkbox>
      <el-checkbox label="level1">科室</el-checkbox>
      <el-checkbox label="level2">个人</el-checkbox>
    </el-checkbox-group>
    <!-- 检索 -->
    <el-input class="keyword" placeholder="请输入检索条件" v-model="keyword" @keyup.enter.native="getTemplate">
      <el-button slot="append" icon="el-icon-search" @click.native="getTemplate"></el-button>
    </el-input>
    <!-- 检索结果 -->
    <div class="templTable">
      <el-table
        :data="tableData"
        border
        class="tableData"
        @row-dblclick="loadTemplate">
        <el-table-column
          prop="templateName"
          label="模板名称">
        </el-table-column>
        <el-table-column
          prop="diseaseName"
          label="适应病种">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {getUsableList,getContent} from '@/api/emr/template'
import {mapGetters} from 'vuex'
import {getUId} from '@/utils/crypto'

// 历次处方
export default {
  props:{
    editor:{
      type:Object,
      default: null
    },
    visitType:String,
    dnFlag:String
  },
  data() {
    return {
      loading: false,
      tableData: [],
      keyword: '',
      scopeLevel: ['level0']
    };
  },
  computed: {
    ...mapGetters([
        'role'
    ])
  },
  created(){
    if(!this.editor){
      this.$message({
          type: "error",
          message: "请传入正确的编辑器实例！"
      });
      return;
    }
    this.getTemplate();
  },
  methods: {
    //查询病历模板
    getTemplate(){
      //console.log('visitType:'+this.visitType)
      var params={key:this.keyword,visitType:this.visitType,dnFlag:this.dnFlag};
      for(var i=0;i<this.scopeLevel.length;i++){
        params[this.scopeLevel[i]]=this.scopeLevel[i].substring(this.scopeLevel[i].length-1,this.scopeLevel[i].length);
        if(params[this.scopeLevel[i]]==0){
          params.currHos=1;
        }else if(params[this.scopeLevel[i]]==1){
          params.deptIds=this.role.deptId;
        }else if(params[this.scopeLevel[i]]==2){
          params.persId=getUId();
        }
      }
      getUsableList(params).then(res=>{
        if(res.code === 1){
          this.tableData = res.data;
        }else{
          this.$message.error("获取病历模板列表失败!" + res.message);
        }
      })
    },
    //加载模板内容
    loadTemplate(row,column,event){
      let id = row.templateId;
      getContent(id,{}).then(res=>{
        if(res.code === 1){
          let data = row;
          data.content =  res.data.content;
          this.$emit('selectTemplate',data);
        }else{
          this.$message.error("加载病历模板失败!" + res.message);
        }
      });

    }

  }
};
</script>
<style lang="scss">
.mr-template{
  padding: 0!important;
  padding-left: 1px;
  .scopeLevel{
    margin: 10px 10px 10px 10px;
  }
  .keyword{
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
  }
  .templTable{
    padding: 10px;
  }


}
</style>
