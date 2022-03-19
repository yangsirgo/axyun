<template>
  <!-- 实名认证工具栏 -->
  <div class="assist-container width100 height100 " v-loading="loading">
        <div class="similarFiles-box">
          <div v-for="(item,index) in stepStyleobjObjList">
            <el-col class="similarFiles-wrap" :class="item.similarity > 90 ? 'similarFiles-wrapStyle':''">
                  <span>相似度</span>
                  <span>{{item.similarity}}%</span>
            </el-col>
            <el-col class="similarFiles-b">
                <el-col class="similarFiles-a">
                  <span class="name">{{item.patientName}}</span>
                  <span class="fontbox-style" :val="item.patientGender || ''" code="GENDER_CODE" v-codeTransform>></span>
                  <span class="fontbox-style">{{item.birthDate}}</span>
                </el-col>

                <el-col class="fontbox-style">就诊卡：</el-col>
                <el-col class="fontbox-style fontbox-style-b">{{item.visitCardNumber || '无'}}</el-col>

                <el-col class="fontbox-style">身份证：</el-col>
                <el-col class="fontbox-style fontbox-style-b">{{item.identificationNum || '无'}}</el-col>

                <el-col class="fontbox-style">手机号：</el-col>
                <el-col class="fontbox-style fontbox-style-b">{{item.mobileNum || '无'}}</el-col>

            </el-col>

          </div>

        </div>
  </div>
</template>
<script>
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    similarityIndex
  } from "@/api/filingAndChange/arch";

  export default {
    //
    inject: ["stepStyleobj"],
    data() {
      return {
        loading: false,
        stepStyleobjList:this.stepStyleobj,
        stepStyleobjObjList:[],
      };
    },

    computed: {
      // ...mapGetters("base", ["receivePatientData", "similarRecordData"])
    },
    watch: {
       "stepStyleobjList": {
         handler(newVal) {
             this.similarityIndex(this.stepStyleobjList);
         },
         deep: true
       }
    },
    created() {
      this.similarityIndex(this.stepStyleobjList);
    },
    methods: {
      async similarityIndex(param) {
        let res = await similarityIndex(param);
        console.log(res);
        if(res.code == '1'){
            this.stepStyleobjObjList = res.data;
        }
      },
      // ...mapActions({
      //   changeRecPatientData: "base/changeRecPatientData"
      // });

    }
  };
</script>
<style lang="scss" scoped>
  .assist-container {
    overflow-y: auto;
    width: 100%;
    height: auto;
    .similarFiles-wrap{
       background-color: #f1f4f6;
       display: flex;
       align-items: center;
       justify-content: flex-end;
       padding: 10px;
    }
    .similarFiles-wrap>span{
      color: #000000;
      font-size: 14px;
      line-height: 20px;
      font-weight: 600px;
    }
    .similarFiles-wrapStyle>span{
         color: #f05a23;
    }
    .similarFiles-b{
      border: 1px solid #f1f4f6;
      border-top:0px;
      padding: 10px;
    }
    .name{
      font-size: 14px;
      color: #2e323a;
      font-weight: 600;
    }
    
    .fontbox-style{
        font-size: 12px;
        color: #666c70;
        margin-bottom: 5px;
        display: inline-block;

    }
    .fontbox-style-b{
        margin-bottom: 8px;
    }

  }
</style>
