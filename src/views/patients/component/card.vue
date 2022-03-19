<template>
  <div id="card">
    <el-div class="card" v-for="(item) in list" :key="item.pId">
      <el-row type="flex" justify="space-between" style="margin-left: 10px">
        <el-col><div :style="{color: item.type==0?'#409EFF':'#E6A23C'}" style="margin-top: 15px;font-size: 30px">{{item.no}}</div></el-col>
          <el-col><div style="text-align: right;margin-right: 10px;margin-top: 15px;line-height:30px;vertical-align: bottom;
          border: black 1px solid;position: relative;
          ">{{item.pId}}</div></el-col>
      </el-row>
      <el-row type="flex" style="margin-top: 15px;margin-left: 10px">
        <el-col :span="8"><div class="patientFont">{{item.name}}</div></el-col>
        <el-col :span="4"><div class="patientFont">{{item.sex}}</div></el-col>
        <el-col :span="8"><div class="patientFont">{{item.age}}岁</div></el-col>
        <el-col :span="8"><div class="patientFont">{{item.visitType}}</div></el-col>
      </el-row>
      <el-row type="flex" style="margin-top: 17px;margin-left: 10px">
        <el-col :span="8"><div class="keyFont">预约时间</div></el-col>
        <el-col :span="20"><div class="keyValue">{{item.orderTime}}</div></el-col>
      </el-row>
      <el-row type="flex" style="margin-top: 17px;margin-left: 10px">
        <el-col :span="8"><div class="keyFont">挂号类别</div></el-col>
        <el-col :span="20"><div class="keyValue">{{item.registerType}}</div></el-col>
      </el-row>
      <el-row type="flex" style="margin-top: 17px;margin-left: 10px">
        <el-col :span="8"><div class="keyFont">就诊医生</div></el-col>
        <el-col :span="20"><div class="keyValue">{{item.visitDr}}</div></el-col>
      </el-row>
      <el-row type="flex" style="margin-top: 17px;margin-left: 10px">
        <el-col :span="8"><div class="keyFont">到检状态</div></el-col>
        <el-col :span="20"><div class="keyValue">{{item.status}}</div></el-col>
      </el-row>
      <el-row type="flex" style="margin-top: 17px;margin-left: 10px">
        <el-col><div class="allergic">{{item.allergic}}</div></el-col>
      </el-row>
      <el-row style="margin-top: 10px;text-align: center">
        <el-button  v-if="item.type==0" size="mini" type="success" icon="el-icon-menu" plain>接诊</el-button>
        <el-button  v-else size="mini" type="warning" icon="el-icon-menu" plain>回诊</el-button>
        <el-button size="mini" type="danger" icon="el-icon-menu" plain>预约</el-button>
      </el-row>
      <el-row style="margin-top: 20px"></el-row>
    </el-div>
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
    props: {
      patients: {
        type: Array,
        required: true
      }
    }
  }
</script>
<style scoped>

  .card{
    width: 220px;
    background-color: white;
  }
  .patientFont{
    font-size: 10px;
  }
  .keyFont{
    font-size: 8px;
    color: #8c939d;
  }
  .keyValue{
    font-size: 8px;
    color: black;
  }
  .allergic{
    font-size: 10px;
    color: red;
  }
  .noColorBlue{
    color: #409EFF;
  }
  .noColorOrange{
    color: #E6A23C;
  }

  /*.jiezhen{*/
  /*  background-color: #409EFF;*/
  /*}*/
  /*.yuyue{*/
  /*  background-color: #E6A23C;*/
  /*}*/
  /*.huizhen{*/
  /*  background-color: #F56C6C;*/
  /*}*/
</style>
