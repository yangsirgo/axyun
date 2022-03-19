<template>
  <div class="bar">
    <el-card class="bar-cont">
      <div class="overview">
        <div class="head">
          <l-card-title>
            <template slot="left">{{$t('residency.overView')}}</template>
          </l-card-title>
        </div>

        <el-collapse v-model="activeNames1" @change="handleChange1">
          <el-collapse-item :title="$t('residency.patientChange')" name="1">
            <div class="collapse-list">{{$t('residency.newInhis')}} <i>{{patientsIn}}</i>{{$t('residency.man')}}</div>
            <div class="collapse-list">{{$t('residency.newOuthis')}} <i>{{patientsOut}}</i>{{$t('residency.man')}}</div>
          </el-collapse-item>
          <div class="icon-num">{{criticalList.length}}</div>
          <el-collapse-item :title="$t('residency.criticalList')" name="2">
            <div class="collapse-list collapse-list2"
                v-for="(item,index) in criticalList"
                :key="index"
            >
              <i>{{item.patientNo}}</i> {{$t('residency.bed')}} {{item.patientName}}，{{item.checkRes}} （{{item.checkPro}}）
            </div>
          </el-collapse-item>
          <div class="icon-num">{{physicalSign.length}}</div>
          <el-collapse-item :title="$t('residency.physicalSign')" name="3">
            <div class="collapse-list collapse-list3"
                v-for="(item,index) in physicalSign"
                :key="index"
            ><i>{{item.patientNo}}</i> {{$t('residency.bed')}} {{item.patientName}}，{{item.checkRes}}（{{item.checkPro}}） {{item.date}}
              {{item.time}}
            </div>
          </el-collapse-item>
        </el-collapse>

      </div>
      <div class="backlog">
        <div class="head" style="margin: 20px 0 0 20px">
          <l-card-title>
            <template slot="left">{{$t('residency.backlog')}}</template>
          </l-card-title>
        </div>
        <el-collapse v-model="activeNames2" @change="handleChange2">
          <div class="icon-num">{{consultations.length}}</div>
          <el-collapse-item :title="$t('residency.waitConsultation')" name="1">
            <div class="collapse-list"
                v-for="(item,index) in consultations"
                :key="index">{{item.depart}}（{{item.patientName}}）{{item.date}} {{item.time}}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
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
          date: '6-19',//日期
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
      handleChange1() {
      },
      handleChange2() {
      }
    }
  }
</script>

<style lang="scss">
  li {
    list-style: none;
  }

  .icon-num {
    width: 18px;
    height: 18px;
    background: $l-color-primary;
    border-radius: 50%;
    position: relative;
    top: 32px;
    left: 270px;
    font-size: $l-font-size-min;
    
    font-weight: $l-font-weight;
    color: $l-color-white;
    text-align: center;
    line-height: 18px;
    z-index: 10000;
  }

  .bar {
    width: 100%;
    height: 100%;

    .bar-cont {
      width: 100%;
      height: 100%;
      padding: 20px 0;
      .el-icon-arrow-right:before {
        content: "";
      }
      .overview {
        .head {
          margin-left: 20px;
        }
      }

      .collapse-list {
        font-size: 14px;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        line-height: 25px;

        i {
          display: inline-block;
          margin-left: 10px;
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
</style>
