<template>
  <div class="editor-tools" v-loading="loading">
    <el-radio-group v-model="actionType" class="align-center">
      <el-radio :label="0">插入</el-radio>
      <el-radio :label="1">替换</el-radio>
    </el-radio-group>
    <el-input placeholder="请输入检索条件" v-model="keyword">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-radio-group v-model="cateogry" class="align-center">
      <el-radio :label="0">全院</el-radio>
      <el-radio :label="1">科室</el-radio>
      <el-radio :label="2">个人</el-radio>
    </el-radio-group>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item,index) in paragraphs" :key="'pt'+index" :title="item.name" :name="index+1">
        <ul class="list">
          <li v-for="(child,cindex) in item.children" :key="'detail'+cindex" @dblclick="addParagraph(item.type,child.template)">{{child.name}}</li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import TimeTab from "../component/TimeTab";
import InfiniteList from "../component/InfiniteList";

// 历次处方
export default {
  components: {
    
  },
  data() {
    return {
      loading: false,
      actionType: 0,
      keyword: '',
      cateogry: 0,
      activeNames: [1,2,3],
      paragraphs: [
        {
          name: '主诉',
          type: '00000000000000000000000000000001',
          children:[
            {
              name: '通用主诉',
              template: '我是通用主诉模板'
            },
            {
              name: '发热主诉',
              template: '我是发热主诉模板'
            }
          ]
        },
        {
          name: '现病史',
          type: '00000000000000000000000000000002',
          children:[
            {
              name: '通用现病史',
              template: '我是通用现病史模板'
            },
            {
              name: '发热现病史',
              template: '我是发热现病史模板'
            }
          ]
        },
        {
          name: '既往史',
          type: '00000000000000000000000000000003',
          children:[
            {
              name: '通用既往史',
              template: '我是通用既往史模板'
            },
            {
              name: '发热既往史',
              template: '我是发热既往史模板'
            }
          ]
        }
      ]
    };
  },
  methods: {
    addParagraph(type,template){
      this.$emit('addParagraph',{type:type,template:template});
    }
  }
};
</script>
<style lang="scss">
.editor-tools{
  .align-center{
    display: block;
    margin: 10px 0;
    text-align: center;
  }
  .el-collapse-item__header{
    height: 32px;
    line-height: 32px;
    font-size: 13px;
  }
  .list li{
    cursor: pointer;
  }
}
</style>