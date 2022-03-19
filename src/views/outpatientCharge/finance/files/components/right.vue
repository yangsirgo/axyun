<template>
  <el-card class="card-cont width100 height100">
    <div class="width100 height100" v-if="accountDisable">
      <div class="title">
        <l-card-title>
          <template slot="left">张少华 男 29岁</template>
        </l-card-title>
        <el-button class="button">合并档案</el-button>
      </div>
      <div class="info">系统识别出{{similarityFiles.length}}位相似档案、如下</div>
      <div class="cards">
        <el-card class="card-item" v-for="(item,index) in similarityFiles" :key="index">
          <div class="top clearfix">
            <el-col :span="20">{{item.patientName}} {{item.patientGender==1?'男':'女'}} {{item.patientAge}}</el-col>
            <el-col :span="4" class="high-color" v-if="item.similarity>='80%'">{{item.similarity}}</el-col>
            <el-col :span="4" class="center-color" v-else-if="item.similarity>='50%'">{{item.similarity}}</el-col>
            <el-col :span="4" class="low-color" v-else>{{item.similarity}}</el-col>
          </div>
          <div class="bottom">
            <div class="bottom-item">联系方式<span>{{item.mobileNum}}</span></div>
            <div class="bottom-item">身份证号<span>{{item.identificationNum}}</span></div>
          </div>
        </el-card>
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "right",
    props: ['patientInfo', 'accountDisable'],
    data() {
      return {
        //相似档案列表
        similarityFiles: [
          {
            patientNum: '123456',
            patientName: '张少明',
            patientGender: 1,
            patientAge: '29岁',
            mobileNum: '189 0934 0231',
            identificationNum: '340293894783275',
            similarity: '80%'
          }, {
            patientNum: '123456',
            patientName: '张少明',
            patientGender: 1,
            patientAge: '29岁',
            mobileNum: '189 0934 0231',
            identificationNum: '340293894783275',
            similarity: '50%'
          }, {
            patientNum: '123456',
            patientName: '张少明',
            patientGender: 1,
            patientAge: '29岁',
            mobileNum: '189 0934 0231',
            identificationNum: '340293894783275',
            similarity: '20%'
          }]
      }
    },
    watch: {
      async patientInfo(newPatientInfo, oldPatientInfo) {

      }
    },
    async created() {
      if (this.patientInfo) {
      }
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .card-cont {
    padding: 0 10px;

    .title {
      position: relative;

      .button {
        width: 76px;
        height: 28px;
        padding: 0;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-11;
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        text-align: center;
        line-height: 28px;
        position: absolute;
        top: 15px;
        right: 0;
      }
    }

    .info {
      height: 38px;
      border-radius: 2px;
      border: 1px solid $l-color-bgcolor-20;
      font-size: $l-font-size;
      
      font-weight: 500;
      color: $l-color-fontcolor-2;
      line-height: 38px;
      text-align: center;
    }

    .cards {
      margin-top: 20px;

      .el-card.is-always-shadow {
        box-shadow: none;
      }

      .card-item {
        width: 100%;
        min-height: 120px;
        margin-top: 10px;
        padding: 10px 10px 15px 10px;
        background: $l-color-bgcolor-18;
        border-radius: 2px;

        .top {
          height: 34px;
          padding-top: 5px;
          border-bottom: 1px solid $l-color-bgcolor-11;

          .high-color {
            font-weight: $l-font-weight;
            color: $l-color-fontcolor-5;
          }

          .center-color {
            font-weight: $l-font-weight;
            color: $l-color-border-6;
          }

          .low-color {
            font-weight: $l-font-weight;
            color: $l-color-fontcolor-5;
          }
        }

        .bottom {
          .bottom-item {
            min-height: 20px;
            margin-top: 10px;
            font-size: $l-font-size;
            
            font-weight: 400;
            color: $l-color-fontcolor-4;
            line-height: 20px;

            span {
              margin-left: 10px;
              display: inline-block;
              
              color: $l-color-fontcolor-3;
            }
          }
        }
      }
    }
  }
</style>
