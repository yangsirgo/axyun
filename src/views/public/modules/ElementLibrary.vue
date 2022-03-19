<template>
  <div id="elementLibrary" class="element-library">
    <div id="searchBox" class="search-box">
      <!-- 操作类型 -->
      <el-select v-model="type" class="type-select">
        <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.baseElementName"
            :value="item.id">
        </el-option>
      </el-select>
      <!-- 检索 -->
      <el-input class="keyword" placeholder="请输入检索条件" v-model="keyword" @keyup.enter.native="searchEles">
        <el-button slot="append" icon="el-icon-search" @click="searchEles"></el-button>
      </el-input>
    </div>
    <!-- 检索结果 -->
    <el-table
      id="resultTable"
      ref="elementTable"
      :data="tableData"
      highlight-current-row
      :height="maxHeight"
      v-loadmore="load"
      v-loading="tlm_isLoading"
      @row-dblclick="insertElement"
      element-loading-text="加载中..."
    >
      <el-table-column label="元素名称" show-overflow-tooltip prop="elementName"></el-table-column>
      <el-table-column label="类型" show-overflow-tooltip prop="elementBaseName"></el-table-column>
      <el-table-column label="数据元" show-overflow-tooltip prop="dataElementName">
        <template slot-scope="scope">
          {{scope.row.dataElementName?scope.row.dataElementName:'无'}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {getLibraryPageByCondition,getPageByCondition,detailQuery,getAll} from '@/api/emr/element'
import { getPamars } from "@/utils/auth";

export default {
  props:{
    editor:{
      type:Object,
      default: null
    }
  },
  data() {
    return {
      page: 0,
      pageSize: 15,
      tlm_isLoading: false,
      tlm_noMore: false,
      tableData: [],
      maxHeight: 250,
      type: '',
      types: [],
      keyword: ''
    };
  },
  mounted(){
    this.$nextTick(function(){
      this.maxHeight=document.getElementById('elementLibrary').offsetHeight-document.getElementById('searchBox').offsetHeight;
      window.onresize=function(){
        this.maxHeight=document.getElementById('elementLibrary').offsetHeight-document.getElementById('searchBox').offsetHeight;
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
    this.getTypes();
  },
  methods: {
    async getTypes(){
      try{
        let response=await getAll();
        if(response.code==1){
          this.types=response.data.filter((item)=>{
            return item.baseElementCode!='00'
          });
        }else{
          this.$message({
              type: "error",
              message: "网络繁忙，请重试！"
          });
        }
      }catch(e){
        console.log(e);
        this.$message({
            type: "error",
            message: "网络繁忙，请重试！"
        });
      }
    },
    //加载元素列表
    async load(){
      try{
        this.page++;
        this.tlm_isLoading=true;
        let response=await getLibraryPageByCondition({pageNo:this.page,pageSize:this.pageSize,baseElementId:this.type,elementName:this.keyword,hospitalId:JSON.parse(getPamars()).hosId});
        // let response=await getPageByCondition({pageNo:this.page,pageSize:this.pageSize,baseElementId:this.type,elementName:this.keyword,hospitalId:JSON.parse(getPamars()).hosId});
        this.tlm_isLoading=false;
        let newTableData=[];
        if(response.code==1){
          if(response.data){
            newTableData=response.data.elementLibraryPageContentDto;
          }
        }else{
          this.$message({
              type: "error",
              message: "网络繁忙，请重试！"
          });
        }
        if(newTableData.length==0){
          this.tlm_noMore=true;
        }else{
          this.tableData=this.tableData.concat(newTableData);
        }
      }catch(e){
        this.tlm_isLoading=false;
        console.log(e);
        this.$message({
            type: "error",
            message: "网络繁忙，请重试！"
        });
      }
    },
    //查询元素列表
    searchEles(){
      this.page=0;
      this.tableData=[];
      this.load();
    },
    //双击插入元素
    async insertElement(row,column,event){
      if(this.editor.options.editorModel=='pure' || this.editor.options.editorModel=='dirty' || this.editor.options.editorModel=='secret'){
        this.$message({
            type: "warning",
            message: "浏览模式不允许编辑！"
        });
        return;
      }
      try{
        let details= await detailQuery({id:row.elementId});
        if(details.code==1){
          let attrs=details.data;          
          this.editor.execCommand('insertelement',{type:row.elementBaseCode,data:this.remakeData(attrs)});
        }else{
          this.$message({
              type: "error",
              message: "网络繁忙，请重试！"
          });
        }
      }catch(e){
        console.log(e);
        this.$message({
            type: "error",
            message: "网络繁忙，请重试！"
        });
      }
    },
    //重新构造元素数据
    remakeData(data){
      var newData={};
      // 基本属性转换
      newData.id=data.elementCode;
      newData.name=data.elementName;

      // 通用属性转换
      newData.isDel=data.commonAttributeDto.checkDeletable;
      newData.showBorder=data.commonAttributeDto.checkDisplay;
      newData.isFreeEdit=data.commonAttributeDto.checkEdit;
      newData.isEmpty=data.commonAttributeDto.checkEmpty;
      newData.isHide=data.commonAttributeDto.checkHidden;
      newData.isPrint=data.commonAttributeDto.checkPrintable;
      newData.readonly=data.commonAttributeDto.checkReadonly;
      newData.quot=data.commonAttributeDto.checkReference;
      newData.isSecret=data.commonAttributeDto.checkSecret;
      newData.source=data.commonAttributeDto.checkSource;
      newData.placeholderText=data.commonAttributeDto.placeholderText;
      newData.tipText=data.commonAttributeDto.tooltipText;
      newData.defaultVal=data.commonAttributeDto.defaultValues;

      // 专有属性转换
      data.proprietaryAttributeVoLst.map((item)=>{
        if(item.proprietaryCode=='0101'){
          newData.minLen=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0100'){
          newData.maxLen=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0300'){
          newData.elemUnit=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0301'){
          newData.eleUnitContr=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0302'){
          newData.numAccuracy=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0303'){
          newData.valMin=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0304'){
          newData.valMax=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0305'){
          newData.normalMin=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0306'){
          newData.normalMax=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0400'){
          newData.isRange=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0401'){
          newData.transferRadio=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0700'){
          newData.inserCurDate=item.proprietaryContent;
        }
        if(item.proprietaryCode=='0701'){
          newData.dateFormat=item.proprietaryContent;
        }
        if(item.proprietaryCode=='1101'){
          newData.isCurrDoctor=item.proprietaryContent;
        }
      })
      
      //单复选、下拉选项转换
      var valList=data.valueLst;
      newData.options=valList.map((item,index)=>{
        if(item.defaultSelection==1){
          if(!newData.userDefault){
            newData.userDefault=[item.vCode];
          }else{
            newData.userDefault.push(item.vCode);
          }
        }else{
          newData.userDefault=[];
        }
        return {index: index,key: item.vCode,value: item.vMean};
      })

      return newData;
    }
  }
};
</script>
<style lang="scss">
.element-library{
  padding: 0!important;
  padding-left: 1px;
  .search-box{
    padding: 10px;
    .type-select{
      margin-bottom: 10px;
    }
  }
  .el-table--scrollable-x .el-table__body-wrapper{
    overflow: hidden;
    overflow-y: auto!important;
  }
}
</style>