<template>
  <div id="structureTree" class="structure-tree">
    <div id="title" class="title">
      <span class="title-text" :title="recordName">{{recordName}}</span>
      <el-button @click="getTreeData(true)" class="refresh-btn" type="info" size="mini" icon="iconfont iconshuaxin">刷新</el-button>
    </div>
    <div id="treeBox" class="tree-box">
      <el-tree
        :data="treeData"
        node-key="id"
        @node-click="handleNodeClick"
        :default-expanded-keys="[1]"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.name }}</span>
          <span class="ellipse">
            ...
            <div class="opts">
              <!-- <el-button
                type="text"
                size="mini"
                icon="iconfont iconbianji"
                @click.stop="() => updateNode(data)">
                修改
              </el-button> -->
              <el-button
                type="text"
                size="mini"
                icon="iconfont iconshanchu"
                @click.stop="() => delNode(node, data)">
                删除
              </el-button>
            </div>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { listToTree } from "@/utils/util";

export default {
  props:{
    //标题--应为文书标题
    recordName: {
      type: String,
      default: '结构树'
    },
    editor:{
      type:Object,
      default: null
    },
    refrehTree:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: []
    };
  },
  watch:{
    refrehTree: {
      immediate: true,
      handler: function(val) {
        if(val && this.editor){
          this.getTreeData();
          this.$emit("update:refrehTree", !this.refrehTree);
        }
      }
    },
    editor: {
      immediate: true,
      handler: function(val) {
        if(val){
          this.getTreeData();
        }
      }
    }
  },
  created(){
    this.$nextTick(function(){
      this.calcLayout();
      window.onresize=function(){
        this.calcLayout();
      }
    })
    if(this.editor){
      this.getTreeData();
    }
  },
  methods: {
    calcLayout(){
      if(null != document.getElementById('treeBox')){
        document.getElementById('treeBox').style.height = document.getElementById('structureTree').offsetHeight - document.getElementById('title').offsetHeight + 'px';
      }
    },
    getTreeData(isRefresh){
      if(!document.getElementById('treeBox') || parseInt(document.getElementById('treeBox').style.height)=='0'){
        this.calcLayout();
      }
      var treeData = listToTree(this.editor.execCommand('structuretree'),'id','pId').list;
      if(treeData.length > 0){
        this.treeData = treeData[0].children;
      }
      if(isRefresh){
        this.$message({
            type: "success",
            message: "刷新成功！"
        });
      }
    },
    updateNode(data){
      if(this.editor.options.editorModel=='pure' || this.editor.options.editorModel=='dirty' || this.editor.options.editorModel=='secret'){
        this.$message({
            type: "warning",
            message: "浏览模式不允许编辑！"
        });
        return;
      }
      this.editor.execCommand('structuretreeedit',data.id);
    },
    delNode(node,data){
      if(this.editor.options.editorModel=='pure' || this.editor.options.editorModel=='dirty' || this.editor.options.editorModel=='secret'){
        this.$message({
            type: "warning",
            message: "浏览模式不允许编辑！"
        });
        return;
      }
      this.editor.execCommand('structuretreedel',data.id);
      this.getTreeData();
    },
    handleNodeClick(data) {
      // if(this.editor.options.editorModel=='pure' || this.editor.options.editorModel=='dirty' || this.editor.options.editorModel=='secret'){
      //   this.$message({
      //       type: "warning",
      //       message: "浏览模式不允许编辑！"
      //   });
      //   return;
      // }
      this.editor.execCommand('structuretreeclick',data.id);
    }
  }
};
</script>
<style lang="scss">
.structure-tree{
  position: relative;
  padding: 0!important;
  .title{
    height: 44px;
    line-height: 44px;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #E4E4E4;
    .title-text{
      display: inline-block;
      width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .refresh-btn{
      float: right;
      width:69px;
      height:28px;
      margin-right: 10px;
      margin-top: 8px;
      border-radius:2px;
      border:1px solid rgba(228,228,228,1);
      color: #2E323A;
      background: $l-color-bgcolor-18;
      i{
        margin-right: 5px;
        font-size: 14px;
      }
    }
  }
  .tree-box{
    overflow-y: auto;
    .el-tree-node{
      .el-tree-node__children{
        overflow: unset;
      }
    }
    .el-tree-node__content{
      position: relative;
      height: 44px;
      margin-bottom: 1px;
      margin-left: 1px;
      &:hover{
        background-color: $l-color-bgcolor-1;
      }
      .custom-tree-node{
        width: 100%;
        height: 44px;
        line-height: 44px;
        .ellipse{
          display: none;
          float: right;
          margin-right: 10px;
          margin-top: -4px;
          font-weight: bolder;
          font-size: 16px;
          letter-spacing: 2px;
          color: rgba(0,0,0,.2);
          .opts{
            display: none;
            position: absolute;
            right: 0;
            bottom: -86px;
            width: 106px;
            height: 100px;
            padding: 20px;
            line-height: normal;
            box-sizing: border-box;
            border: 1px solid #E4E4E4;
            box-shadow:0px 0px 10px 0px rgba(0,0,0,0.1);
            background: #fff;
            z-index: 999;
            .el-button{
              display: block;
              margin: 0;
              color: #2E323A;
              font-size: 14px;
              .iconshanchu{
                margin-right: 5px;
              }
              &:hover{
                color: $l-color-primary;
              }
            }
          }
          &:hover .opts{
            display: block;
          }
        }
        &:hover .ellipse{
          display: block;
        }
      }
    }
  }
}
</style>
