<template>
  <div class="height100 width100" style="padding:20px">
    <div style="width: 100%;overflow-x: auto;text-align: center;">
      <div v-if="showSort" style="margin-bottom: 10px">
        <span>排序:</span>
        <el-radio v-model="sortType" label="0">按时间</el-radio>
        <el-radio v-model="sortType" label="1">按分类</el-radio>
      </div>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 200px;"
        @change="more=false"
        :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <div v-if="sortType==='0'" class="year-detail" style="height: 95%" ref="list">
      <div
        class="detail-item position-relative"
        v-for="(it, i) in filterDate"
        :key="i"
      >
        <div class="line"></div>
        <div class="text">
          <p>{{ it.date.format("MM月dd日") }}</p>
          <p style="margin-left: 1em">{{it.date.format("yyyy年")}}</p>
        </div>
        <span :class="it.value?'sel-dot':'dot'">
        </span>
        <div :class="it.value?'main-context-sel':'main-context'" @click="select(it)">
          <p style="font-size: 16px;font-weight: bold">{{ it.project }}</p>
          <p>{{ it.detail }}</p>
        </div>
      </div>
      <div class="detail-item position-relative">
        <div class="line" style="height: 10px;"></div>
        <span class="dot"></span>
        <div class="main-context">
          <p style="font-size: 16px;font-weight: bold">历史报告</p>
          <p class="more" @click="more=true">更多>></p>
        </div>
      </div>
    </div>
    <div v-else>
      <el-tree
        :data="classification"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree2">
      </el-tree>
    </div>
  </div>
</template>

<script>
  export default {
    name: "timeLine",
    data() {
      return {
        detailList: [
          {
            date: new Date("2019-9-23"),
            project: '头部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: true
          },
          {
            date: new Date("2019-9-12"),
            project: '腹部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: false
          },
          {
            date: new Date("2019-8-18"),
            project: '头部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: false
          },
          {
            date: new Date("2019-8-5"),
            project: '腹部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: false
          },{
            date: new Date("2019-7-27"),
            project: '头部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: false
          },
          {
            date: new Date("2019-7-9"),
            project: '腹部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: false
          },
          {
            date: new Date("2019-6-14"),
            project: '头部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: false
          },
          {
            date: new Date("2019-6-1"),
            project: '腹部CT（CR/DR)',
            detail: 'XM001，CT室，已发布',
            value: false
          }
        ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateRange: '',
        sortType: '0',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        more:false
      };
    },
    props: {
      showSort: Boolean
    },
    methods: {
      select(val){
        this.detailList.forEach(item=>{
          item.value = false
        })
        val.value = true
      },
      filterNode(value,data){
        console.log(value)
        console.log(data)
        return true
      },
      containEx(arr,val){
        for (let index = 0;index < arr.length;index++){
          if (arr[index].label == val.project){
            return arr[index]
          }
        }
        return null
      }
    },
    computed: {
      filterDate(){
        if (this.dateRange === ''){
          return this.detailList
        }
        let arr = []
        this.detailList.forEach(item=>{
          if (!this.more) {
            if (item.date.getTime() >= this.dateRange[0].getTime() &&
              item.date.getTime() <= this.dateRange[1].getTime()){
              arr.push(item)
            }
          }else{
            if (item.date.getTime() <= this.dateRange[1].getTime()) {
              arr.push(item)
            }
          }
        })
        return arr
      },
      classification(){
        let tree = []
        this.detailList.forEach(item=>{
          let node = this.containEx(tree,item)
          if (node){
            node.children.push({...item,label: item.date.format("yyyy年MM月dd日") + ' ' + item.detail})
          }else {
            tree.push({label: item.project,children: [{...item,label: item.date.format("yyyy年MM月dd日") + ' ' + item.detail}]})
          }
        })
        return tree
      }
    }
  };
</script>

<style lang="scss" scoped>
  .year-detail {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 20px;
    position: relative;
    font-size: 14px;
    padding-bottom: 40px;
    scroll-behavior: smooth;
    .detail-item {
      padding: 10px;
      padding-left: 90px;
      padding-right: 5px;
      .main-context {
        background: $l-color-bgcolor-18;
        padding-left: 5px;
        font-size: 13px;
      }
      .main-context-sel {
        background: $l-color-bgcolor-1;
        padding-left: 5px;
        font-size: 13px;
      }
      .line {
        position: absolute;
        left: 77px;
        height: 100%;
        border-right: 2px solid $l-color-border-1;
      }
      .text {
        position: absolute;
        left: 10px;
        top: 14px;
        color: $l-color-fontcolor-4;
        font-size: 14px;
      }
      p {
        line-height: 22px;
      }
      .dot {
        position: absolute;
        left: 74px;
        top: 18px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: $l-color-border-1;
      }
      .sel-dot {
        position: absolute;
        left: 72px;
        top: 10px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: $l-color-border-1;
      }
      .more:hover{
        color: blue;
      }
    }
  }
</style>
