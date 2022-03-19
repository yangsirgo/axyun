<template>
  <div class="bar">
    <el-card class="bar-cont overflow-scroll-vertical">
      <div class="overview">
        <div class="head">
          <div>概况</div>
          <div class="head-before"></div>
        </div>
        <el-collapse v-model="activeNames1" @change="handleChange1">
          <el-collapse-item name="1" class="aaa">
            <template slot="title">
              <i :class="activeNames1.includes('1')?'head-icon-active el-icon-caret-bottom head-icon':'el-icon-caret-bottom head-icon'"></i>患者变动
            </template>
            <span class="collapse-list">新入院 <i style="margin-left: 10px;">{{patientsIn}}</i>人</span>
            <span class="collapse-list">今日出院 <i style="margin-left: 10px;">{{patientsOut}}</i>人</span>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <i :class="activeNames1.includes('2')?'head-icon-active el-icon-caret-bottom head-icon':'el-icon-caret-bottom head-icon'"></i>危急值 <div class="icon-num">{{criticalList.length}}</div>
            </template>
            <span class="collapse-list collapse-list2"
                v-for="(item,index) in criticalList"
                :key="index"
            >
              <i>{{item.patientNo}}</i> 床 {{item.patientName}}，{{item.checkRes}} （{{item.checkPro}}）
            </span>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <i :class="activeNames1.includes('3')?'head-icon-active el-icon-caret-bottom head-icon':'el-icon-caret-bottom head-icon'"></i>体征异常 <div class="icon-num">{{physicalSign.length}}</div>
            </template>
            <span class="collapse-list collapse-list3"
                v-for="(item,index) in physicalSign"
                :key="index"
            ><i>{{item.patientNo}}</i> 床 {{item.patientName}},{{item.checkRes}}({{item.checkPro}}){{item.date}}
              {{item.time}}
            </span>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="backlog">
        <div class="head" style="margin-top: 20px">
          <div>待办事宜</div>
          <div class="head-before"></div>
        </div>
        <el-collapse v-model="activeNames2" @change="handleChange2">
          <el-collapse-item title="待接收会诊" name="1">
            <template slot="title">
              <i :class="activeNames2.includes('1')?'head-icon-active el-icon-caret-bottom head-icon':'el-icon-caret-bottom head-icon'"></i>待接收会诊 <div class="icon-num">{{consultations.length}}</div>
            </template>
            <span class="collapse-list"
                v-for="(item,index) in consultations"
                :key="index">{{item.depart}}（{{item.patientName}}）{{item.date}} {{item.time}}
            </span>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getPatientChange } from "@/api/cis/resident/resident";

  export default {
    name: "left",
    data() {
      return {
        activeNames1: ['1', '2', '3'],
        activeNames2: ['1'],
        patientsIn: 0,//入院人数
        patientsOut: 0,//出院人数
        //危急值
        criticalList: [{
          patientNo: '01',//床号
          patientName: '李小芬',//病人姓名
          checkRes: '白细胞↑↑',//检查结果
          checkPro: '血常规'//检查类型
        }],
        //体征异常
        physicalSign: [{
          patientNo: '01',//床号
          patientName: '李小芬',//病人姓名
          checkRes: '39.8℃',//检查结果
          checkPro: '体温',//检查类型
          date: '06-19',//日期
          time: '18:00'//时间
        }],
        //待接收会诊
        consultations: [{
          depart: '泌尿外科',//科室
          patientName: '李小芬',//患者姓名
          date: '2019-6-19',//日期
          time: '18:00'//时间
        }]
      }
    },
    methods: {
      handleChange1(val) {
        this.activeNames1 = val
        console.log(val)
      },
      handleChange2(val) {
        this.activeNames2 = val
      },
      async getPatientChanges(){
        let datas = {
          admissionStatus: 1
        }
        let result = await getPatientChange(datas);
        if(result.code == 1){
            this.patientsIn = result.data.patientsIn;
            this.patientsOut = result.data.patientsOut;
        }
      }

    },
    mounted() {
      this.getPatientChanges();
    }
  }
</script>

<style scoped lang="scss">
  /deep/ .el-collapse-item__content{
    padding-right: 10px;
  }
  /deep/ .el-collapse-item__arrow{
    display: none;
  }
  li {
    list-style: none;
  }

  .icon-num {
    width: 18px;
    height: 18px;
    background: $l-color-primary;
    border-radius: 50%;
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: $l-font-size-min;
    
    font-weight: $l-font-weight;
    color: $l-color-white;
    text-align: center;
    line-height: 18px;
  }

  .head {
    height: 24px;
    margin-bottom: 20px;
    font-size: 16px;
    
    font-weight: 500;
    color: rgba(46, 50, 58, 1);
    line-height: 24px;
    position: relative;
    padding-left: 30px;
    .head-before {
      width: 4px;
      height: 20px;
      background: $l-color-primary;
      position: absolute;
      left: 20px;
      top: 2px;
    }
  }

  .bar {
    width: 100%;
    height: 100%;
    .bar-cont {
      width: 100%;
      height: 100%;
      padding: 20px 0;

      .overview {

      }

      .collapse-list {
        font-size: 14px;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        line-height: 25px;

        i {
          display: inline-block;
          font-style: normal;
          font-size: 20px;
          
          font-weight: bold;
          line-height: 26px;
        }
      }

      .collapse-list2, .collapse-list3 {
        i {
          font-size: 20px;
          
          font-weight: 400;
        }
      }
    }
  }
  .head-icon{
    transition: all .5s;
    transform: rotate(-90deg);
  }
  .head-icon-active{
    transform: rotate(0deg);
  }
</style>
