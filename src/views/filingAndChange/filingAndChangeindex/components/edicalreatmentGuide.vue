<template>
  <!-- 相似档案工具栏 -->
  <div class="assist-container width100 height100" v-loading="loading">
    <div v-if="silimarRecordList.length>0">
      <el-card class="archives-card" v-for="(item,index) in silimarRecordList" :key="index">
        <div class="assist-title width100">
          <div class="title-left">档案{{index+1}}</div>
          <div class="title-right">
            <div class="similarity">相似度12312</div>
            <div class="similarity-data" :class="{on:item.similarity<50}">{{item.similarity}}%</div>
          </div>
        </div>
        <el-row>
          <div class="row-title">创建时间</div>
          <div class="row-data">{{item.time|| "--"}}</div>
        </el-row>
        <el-row>
          <div class="row-title">姓名</div>
          <div class="row-data">{{item.name|| "--"}}</div>
        </el-row>
        <el-row>
          <div class="row-title">性别</div>
          <div class="row-data">
            <span :val="item.sex" code="GENDER_CODE" v-codeTransform></span>
          </div>
        </el-row>
        <el-row v-if="item.identificationType">
          <div class="row-title"><span :val="item.identificationType" code="MARK_TYPE_CODE" v-codeTransform></span>
          </div>
          <div class="row-data">{{item.idNum|| "--"}}</div>
        </el-row>
        <el-row>
          <div class="row-title">手机</div>
          <div class="row-data">{{item.phoneNum|| "--"}}</div>
        </el-row>
        <!-- <el-row>
           <div class="row-title">医保卡</div>
           <div class="row-data">{{item.card || "&#45;&#45;"}}</div>
         </el-row>-->
        <el-row>
          <div class="row-title">是否慢病</div>
          <div class="row-data">{{item.chronicStatus==1?'是':'否'}}</div>
        </el-row>
        <!--<el-button @click="checkDetail(item)">查看详情</el-button>-->
      </el-card>
    </div>
    <div v-else style="font-size:16px;color:#909399;text-align:center">123123暂无相似档案</div>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from "vuex";
  import {patientSilimarList} from "@/api/arch/arch";

  export default {
    data() {
      return {
        loading: false,
        silimarRecordList: [],
        similarityData: ""
        /*similaritParames: {

              patientId:"",
              patientName:"",
              birthDate:"",
              identificationNum:"",
              mobileNum:""

          }*/
      };
    },
    computed: {
      ...mapGetters("base", ["receivePatientData", "similarRecordData"])
    },
    watch: {
      receivePatientData: {
        async handler(n) {
          this.silimarRecordList = [];
          if (typeof n != "undefined" && JSON.stringify(n) !== "{}") {
            let similaritParames = {
              patientId: n.patientId || "",
              patientName: n.patientName || "",
              birthDate: n.birthDate || "",
              identificationNum: n.identificationNum || "",
              mobileNum: n.mobileNum || ""
            };
            this.getSilimarRecordList(similaritParames);
          } else {
            this.silimarRecordList = [];
          }
        },
        immediate: true,
        deep: true
      },
      similarRecordData: {
        async handler(n) {
          console.log(n);
          this.silimarRecordList = [];
          if (JSON.stringify(n) !== "{}") {
            let similaritParames = {
              patientId: n.patientId || "",
              patientName: n.patientName || "",
              birthDate: n.birthDate || "",
              identificationNum: n.identificationNum || "",
              mobileNum: n.mobileNum || ""
            };
            this.getSilimarRecordList(similaritParames);
          } else {
            this.silimarRecordList = [];
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
    },
    methods: {
      ...mapActions({
        changeRecPatientData: "base/changeRecPatientData"
      }),
      //获取相似档案
      async getSilimarRecordList(param) {
        this.loading = true;
        let _self = this;
        this.silimarRecordList = [];
        try {
          //获取相似档案接口
          let result = await patientSilimarList(param);
          console.log(result);

          if (result.code == 1) {
            result.data.forEach(function (item) {
              _self.silimarRecordList.push({
                patientId: item.patientId,
                similarity: item.similarity,
                time: item.createdAt,
                name: item.patientName,
                sex: item.patientGender,
                idNum: item.identificationNum,
                chronicStatus: item.chronicStatus,
                phoneNum: item.mobileNum,
                birthDate: item.birthDate,

                card: "",
                identificationType: item.identificationType || ''
              });
            });
          } else {
            this.$message.error(result.message || "获取相似档案失败");
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "获取相似档案失败");
        }
      },
      //查看详情
      async checkDetail(item) {
        await this.changeRecPatientData(item);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .assist-container {
    overflow-y: auto;

    .is-always-shadow {
      box-shadow: 0 0 0 0 transparent;
    }

    .archives-card {
      padding: 20px 10px 20px 10px;
      margin-bottom: 10px;
      background-color: $l-color-bgcolor-18;
      min-width: 212px;

      .el-row {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 14px;

        div {
          float: left;
        }

        .row-title {
          min-width: 56px;
          margin-right: 10px;
          color: #949da3;
        }

        .row-data {
          color: #2e323a;
        }
      }

      .assist-title {
        border-bottom: 1px solid #e4e4e4;
        height: 30px;
        padding-bottom: 5px;

        .title-left {
          height: 20px;
          line-height: 20px;
          float: left;
          color: #2e323a;
          font-size: 16px;
          font-weight: bold;
        }

        .title-right {
          float: right;
          height: 20px;
          line-height: 20px;

          .similarity {
            color: #949da3;
            margin-right: 5px;
            font-size: 14px;
          }

          .similarity-data {
            font-size: 18px;
            color: #e55d5d;
            font-weight: bold;

            &.on {
              color: #6bc649;
            }
          }

          div {
            float: left;
          }
        }
      }

      .el-button {
        @include l-center-horizontal;
        margin-top: 10px;
      }
    }
  }
</style>
