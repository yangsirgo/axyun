<template>
  <div class="familyInfo width100 height100">
    <el-card class="width100 height100 card-cont">
      <div class="title">
        <l-card-title>
          <template slot="left">家庭信息</template>
        </l-card-title>
      </div>
      <div class="content clearfix">
        <div class="card-item" v-for="(item, index) in patientDetail.familyInfoList" :key="index">
          <div class="item relation">{{item.relation}}</div>
          <div class="item infos">{{item.name}} {{item.gender==1?'男':'女'}} {{item.age}}</div>
          <div class="item hisIll">既往疾病：{{item.hisIll}}</div>
          <div class="item recordHis">最近随访：{{item.recordHis}}</div>
        </div>
        <div class="card-item gray-color">
          <div class="item relation">本人</div>
          <div class="item infos">{{patientDetail.patientName}} {{patientDetail.patientGender==1?'男':'女'}}
            {{patientDetail.patientAge}}
          </div>
          <div class="item hisIll">既往疾病：{{patientDetail.hisIll}}</div>
          <div class="item recordHis">最近随访：{{patientDetail.recordHis}}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "familyInfo",
    props: ['patientInfo'],
    data() {
      return {
        patientDetail: {}
      }
    },
    watch: {
      patientInfo() {
        this.patientDetail = JSON.parse(this.patientInfo);
      }
    }
  }
</script>

<style scoped lang="scss">
  .familyInfo {
    .card-cont {
      padding: 0 0 10px 20px;
    }

    .content {
      .card-item {
        width: 260px;
        height: 100px;
        margin: 0 20px 10px 0;
        padding: 10px;
        border-radius: 2px;
        background: $l-color-bgcolor-17;
        float: left;

        .item {
          margin-bottom: 5px;
        }

        .relation {
          font-size: 18px;
          font-weight: $l-font-weight;
        }
      }

      .gray-color {
        background-color: $l-color-bgcolor-18;
      }
    }
  }
</style>
