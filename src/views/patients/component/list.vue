<template>
  <div id="line">
    <div style="width: 100%;background-color: white;vertical-align: center;border-bottom: #9c9c9c 1px solid;line-height: 50px" v-for="(item) in list" :key="item.pId">
      <el-row :gutter="10" type="flex" justify="space-between">
        <el-col :span="18">
          <el-row type="flex" justify="start">
            <el-col :span="1" :class="{'unRecived': item.type==0,'recived': item.type==1}">{{item.no}}</el-col>
            <el-col :span="2" style="margin-left: 10px"><strong>{{item.pId}}</strong></el-col>
            <el-col :span="2">{{item.name}}</el-col>
            <el-col :span="1">{{item.sex}}</el-col>
            <el-col :span="1">{{item.age}}</el-col>
            <el-col :span="2">{{item.visitType}}</el-col>
            <el-col :span="1" style="color: #9c9c9c">|</el-col>
            <el-col :span="2" style="color: #9c9c9c">预约时间</el-col>
            <el-col :span="4">{{item.orderTime}}</el-col>
            <el-col :span="2" style="color: #9c9c9c">挂号类别</el-col>
            <el-col :span="2">{{item.registerType}}</el-col>
            <el-col :span="2" style="color: #9c9c9c">挂号医生</el-col>
            <el-col :span="1">{{item.visitDr}}</el-col>
            <el-col :span="2" style="color: #9c9c9c">到检状态</el-col>
            <el-col :span="6">{{item.status}}</el-col>
            <el-col :span="3" style="color: red">{{item.allergic}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="4" style="text-align: center;">
          <el-row type="flex" justify="end" style="text-align: center">
            <div style="line-height: 50px">
            <el-button  v-if="item.type==0" size="mini" type="success" icon="el-icon-menu" plain>接诊</el-button>
            <el-button  v-else size="mini" type="warning" icon="el-icon-menu" plain>回诊</el-button>
            <el-button size="mini" type="danger" icon="el-icon-menu" plain>预约</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        list:[
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
    props: ['patients']
  }
</script>
<style scoped>

  .unRecived{
    background-color: #EEF4FF;
    color: #409EFF;
    font-size: 30px;
  }
  .recived{
    background-color: #FFF0E3;
    color: #E6A23C;
    font-size: 30px;
  }
</style>
