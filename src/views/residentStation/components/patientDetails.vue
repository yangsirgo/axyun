<template>
  <div class="msg_header clearfix">
    <div class="person fl">
      <span>
        <span class="person_num">{{patientInfo.bedNum}}</span>
        <span class="person_number">{{patientInfo.adNum}}</span>
        <span>{{patientInfo.patientName}}</span>
        <span class="pad20">{{patientInfo.IDNumber}}</span>
        <span>{{patientInfo.age}}</span></span>
    </div>
    <div class="docter fl">
      <div class="docter_box">
        <div class="box_item">
          <span class="label">主治医师：</span><span class="margin-right-20">{{patientInfo.doctor}}</span>
          <span class="label">入院日期：</span><span>{{patientInfo.finAdmissionTime}}({{patientInfo.days}})</span>
        </div>
        <div class="box_item">
          <span class="error margin-right-20">{{patientInfo.allergyHistory}}</span>
          <span>{{patientInfo.finAdmissionDiagnosis}}</span>
        </div>
      </div>
    </div>
    <div class="fr right">
      <span class="te">特</span>
      <span class="pu">普食</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "patientDetails",
    props : ["patientDetails"],
    data() {
      return {
        patientInfo: this.patientDetails// 患者基本信息
      }
    },
    methods: {

    }
  }
</script>

<style scoped lang="scss">
  .msg_header {
    height: 65px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    margin-bottom: 10px;

    .person {
      line-height: 65px;

      & > span {
        display: flex;
        align-items: center;
      }

      .person_num {
        font-size: 36px;
        color: #F7A820;
        width: 82px;
        text-align: center;
        background-color: #FEF6E8;
        display: inline-block;
        /deep/ .el-select  {
          vertical-align: bottom;
        }
        /deep/ .el-input__inner {
          border: 0;
          background-color: #FEF6E8;
          font-size: 36px;
          color: #F7A820;
          height: 100%;
          /* line-height: 79px; */
          vertical-align: -8px;
        }
        /deep/ .el-select-dropdown__item:nth-child(even) {
          background:rgba(245,245,245,1);
        }

      }

      .person_number {
        font-size: 18px;
        color: #3D7DFB;
        padding: 0 20px;
        display: inline-block;

      }

      .pad20 {
        padding: 0 20px;
      }
    }

    .docter {
      padding: 12px 20px;

      .docter_box {
        height: 100%;
        border-left: 1px solid #C5CBCF;
        padding-left: 20px;
        font-size: 12px;

        .box_item {
          line-height: 20px;

          .label {
            font-size: 12px;
            
            font-weight: 400;
            color: rgba(148, 157, 163, 1);
          }

          .error {
            font-size: 12px;
            
            font-weight: 400;
            color: rgba(225, 20, 10, 1);
          }
        }
      }
    }

    .right {
      line-height: 65px;
      margin-right: 20px;

      > span {
        display: inline-block;
        line-height: 20px;
        text-align: center;
        color: #fff;
      }

      .te {
        width: 20px;
        height: 20px;

        background: rgba(225, 20, 10, 1);
        border-radius: 2px;
      }

      .pu {
        width: 32px;
        height: 20px;
        background: rgba(189, 193, 195, 1);
        border-radius: 2px;
      }
    }
  }
</style>
