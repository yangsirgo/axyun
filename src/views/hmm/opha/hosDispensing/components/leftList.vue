<template>
  <div class="height100">
    <el-card class="height100">
      <div class="top">
        <l-card-title>
          <span slot="left">病区</span>
          <el-button slot="right" class="button refresh" @click="refresh">刷新</el-button>
        </l-card-title>
        <div v-if="!timer">
          <el-input
            placeholder="请输入病区名查询定位"
            suffix-icon="el-icon-search"
            v-model="keyWord">
          </el-input>
        </div>
        <div v-else>
          <el-checkbox class="float-left" style="margin-right: 5px;margin-top: 8px;" v-model="open">开启定时刷新</el-checkbox>
          <el-input-number v-model="countdown" class="countdown float-left" controls-position="right" :disabled="!open" @change="handleChange" :min="1"></el-input-number>
        </div>
      </div>
      <div class="area-list">
        <div class="title">
          病区名称
        </div>
        <ul>
          <li>
            <i class="dot"></i>
            内科
          </li>
          <li>内科</li>
          <li>内科</li>
          <li>内科</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "leftList",
    props: {
      timer: {
        default: false
      }
    },
    data (){
      return {
        keyWord: '', // 搜索关键字
        countdown: '', // 计数器
        open: false, // 是否开启定时器刷新
      }
    },
    methods: {
      refresh (){
        console.log("刷新");
        // 再次调用列表接口
      }
    }
  }
</script>

<style scoped lang="scss">
  .top{
    padding: 20px;
    padding-top: 0;
    .refresh {
      border-radius: 2px;
      background-color: $l-color-bgcolor-11;
      color: $l-color-fontcolor-3;
      position: relative;
      right: -10px;
      width: 76px;
      height: 28px;
    }
    .countdown{
      width: 132px;
      height: 36px;
      border-radius: 2px;
    }
    &>div{
      overflow: hidden;
    }
  }
  .area-list{
    text-align: left;
    .title{
      background-color: $l-color-bgcolor-18;
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
    }
    ul{
      li{
        padding-left: 20px;
        height: 44px;
        line-height: 44px;
        color: $l-color-fontcolor-3;
        position: relative;
        .dot{
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: $l-color-primary;
          position: absolute;
          left: 10px;
          top: calc(50% - 3px);
        }
      }
      li:nth-child(even){
        background: $l-color-bgcolor-18;
      }
    }
  }
</style>
