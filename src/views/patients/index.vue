<template>
  <div>
    <div>
      <div v-on:click="select" v-bind:patients="list">卡片/列表</div>
      <div style="float: left">
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" size="mini">
          <el-radio-button label="top">当天</el-radio-button>
          <el-radio-button label="right" style="margin-left: 10px">近3天</el-radio-button>
          <el-radio-button label="bottom" style="margin-left: 10px">近7天</el-radio-button>
          <el-radio-button label="left" style="margin-left: 10px">近30天</el-radio-button>
        </el-radio-group>
      </div>
      <div class="block" style="float: left">
        <el-date-picker
          size="mini"
          v-model="value6"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="float: left">
        <el-select v-model="select1" placeholder="全部病人" size="mini" style="width: 100px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="float: left">
        <el-select v-model="select2" placeholder="已到检" size="mini" style="width: 100px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div style="margin-top: 70px">
      <div v-if="show">
        <card></card>
      </div>
      <div v-if="!show">
        <list></list>
      </div>
    </div>
  </div>
</template>
<script>
  import card from './component/card'
  import list from './component/list'

  export default {
    components: {
      card: card,
      list: list
    },
    data(){
      return{
        select1:[],
        select2:[],
        value6: '',
        tabPosition: 'top',
        show: true,
        list: [
          {
            "no": 79,
            "type": 0,
            "pId": "148286",
            "name": "李晓芬",
            "sex": "女",
            "age": "24",
            "visitType": "自费",
            "orderTime": "2019-08-09 14:29:59",
            "registerType": "专家门诊",
            "visitDr": "王玉",
            "status": "未到检",
            "allergic": ""
          },
          {
            "no": 80,
            "type": 1,
            "pId": "148287",
            "name": "蒋欣",
            "sex": "女",
            "age": "24",
            "visitType": "医保",
            "orderTime": "2019-08-09 14:29:59",
            "registerType": "专家门诊",
            "visitDr": "王玉",
            "status": "已到检 2019-08-09 14:29",
            "allergic": "紫外线过敏"
          }
        ]
      }
    },
    methods: {
      select: function () {
        this.show = !this.show;
      }
    }
  }

</script>
