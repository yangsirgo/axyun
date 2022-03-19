<template>
  <div class="record-message-con width100  clearfix" ref="page">
    <div class="patient-info width100">
      <patient-info :patientInfo="JSON.stringify(patientMsg)"></patient-info>
    </div>
    <div class="record-list-con">
      <div class="card-list">
        <div class="record-list">
          <div class="record-detail">
            <div class="name">
              <p class="record-title">档案1</p>
              <p class="record-title-type">
                <el-radio v-model="radio" label="1">主档</el-radio>
                <el-radio v-model="radio" label="2">副档</el-radio>
              </p>
            </div>
            <div class="label-mini">
              <span>相似标签:</span>
            </div>
            <div class="label-mini none-border">
              <span>姓名: 李明</span>
              <span class="label-ridao-com">
                <el-radio v-model="radioOne" label="1">已选</el-radio>
                <el-radio v-model="radioOne" label="2">不选</el-radio>
              </span>
            </div>
            <div class="label-mini none-border">
              <span>联系方式: 15116343405</span>
              <span class="label-ridao-com">
                <el-radio v-model="radioTwo" label="1">已选</el-radio>
                <el-radio v-model="radioTwo" label="2">不选</el-radio>
              </span>
            </div>
            <div class="label-mini none-border">
              <span>身份证号: 320926195511175276</span>
              <span class="label-ridao-com">
                <el-radio v-model="radioThree" label="1">已选</el-radio>
                <el-radio v-model="radioThree" label="2">不选</el-radio>
              </span>
            </div>
            <div class="button-con">
              <el-button type="primary">查看档案</el-button>
            </div>
          </div>
          <div class="record-detail mr20">
            <div class="name">
              <p class="record-title">档案2</p>
              <p class="record-title-type">
                <el-radio v-model="radio" label="1">主档</el-radio>
                <el-radio v-model="radio" label="2">副档</el-radio>
              </p>
            </div>
            <div class="label-mini">
              <span>相似标签:</span>
            </div>
            <div class="label-mini none-border">
              <span>姓名: 张轩</span>
              <span class="label-ridao-com">
                <el-radio v-model="radioone" label="1">已选</el-radio>
                <el-radio v-model="radioone" label="2">不选</el-radio>
              </span>
            </div>
            <div class="label-mini none-border">
              <span>联系方式: 15116343465</span>
              <span class="label-ridao-com">
                <el-radio v-model="radiotwo" label="1">已选</el-radio>
                <el-radio v-model="radiotwo" label="2">不选</el-radio>
              </span>
            </div>
            <div class="label-mini none-border">
              <span>身份证号: 320926195511175276</span>
              <span class="label-ridao-com">
                <el-radio v-model="radiothree" label="1">已选</el-radio>
                <el-radio v-model="radiothree" label="2">不选</el-radio>
              </span>
            </div>
            <div class="button-con">
              <el-button type="primary">查看档案</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="button-list">
        <el-button>取消</el-button>
        <el-button type="primary">确认合并</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import adHeight from "@/mixins/adHeight";
import patientInfo from "./components/patientInfo";
export default {
  name: "recordMessage",
  components: {
    patientInfo
  },
  mixins: [adHeight],
  data() {
    return {
      // 患者信息
      patientMsg: {
        patientName: "张大伟",
        patientAge: 31,
        patientGender: 1,
        birthDate: "1989-09-01",
        phone: 15111636785,
        nativePlace: "上海市松江区",
        townType: "城镇居民保险",
        identityNum: "4320822198912110912",
        empiId: "3123456564"
      },
      radio: "1",
      radioOne: "1",
      radioTwo: "1",
      radioThree: "1",
      radioone: "1",
      radiotwo: "1",
      radiothree: "1"
    };
  }
};
</script>

<style lang="scss" scoped>
.record-message-con {
  height: 100%;
  .record-list-con {
    margin-top: 20px;
    padding: 20px;
    height: calc(100% - 105px);
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .record-list {
      .record-detail {
        display: inline-block;
        width: 400px;
        height: 400px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        .name {
          padding-bottom: 10px;
          .record-title {
            line-height: 40px;
            font-size: 18px;
            text-align: center;
          }
          .record-title-type {
            text-align: right;
            margin-right: 10px;
          }
        }

        .label-mini {
          padding-left: 20px;
          border-top: 1px solid #e4e4e4;
          line-height: 40px;
          .label-ridao-com {
            margin-right: 10px;
            float: right;
          }
        }
        .button-con {
          margin-top: 50px;
          text-align: center;
        }
      }
      .mr20 {
        margin-left: 20px;
      }
    }
    .button-list {
      margin-top: 100px;
      text-align: center;
    }
  }
}
</style>
