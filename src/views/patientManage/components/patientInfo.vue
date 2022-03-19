<template>
  <div class="patientInfo width100 height100">
    <el-card class="width100 height100 card-cont">
      <div class="left">
        <div class="first">{{ patientDetail.patientName }}</div>
        <div>
          {{ patientDetail.patientAge }}
          {{ patientDetail.patientGender == 1 ? "男" : "女" }} 出生：{{
            patientDetail.birthDate
          }}
          联系电话：{{ patientDetail.phone }}
        </div>
      </div>
      <div class="center">
        <el-col :span="16">
          <div style="margin-bottom: 8px">
            身份证号：{{ patientDetail.identityNum }}
          </div>
          <div>医保类型：{{ patientDetail.townType }}</div>
        </el-col>
        <el-col :span="8">
          <div style="margin-bottom: 8px">EMPIID：{{ patientDetail.empiId }}</div>
          <div>籍贯：{{ patientDetail.nativePlace }}</div>
        </el-col>
      </div>
      <div class="right">
        <img width="45" height="45" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2385323722,2917599006&fm=26&gp=0.jpg" alt="" />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "patientInfo",
  props: ["patientInfo"],
  data() {
    return {
      patientDetail: {}
    };
  },
  created() {
    console.log(11);
    this.patientDetail = JSON.parse(this.patientInfo);
  },
  watch: {
    patientInfo() {
      console.log(JSON.parse(this.patientInfo));
      this.patientDetail = JSON.parse(this.patientInfo);
    }
  }
};
</script>

<style scoped lang="scss">
.patientInfo {
  .card-cont {
    padding: 20px;

    .left {
      padding-right: 20px;
      border-right: 1px solid $l-color-bgcolor-11;
      float: left;

      .first {
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 18px;
      }
    }

    .center {
      width: 40%;
      padding-left: 20px;
      float: left;
    }

    .right {
      width: 45px;
      height: 45px;
      overflow: hidden;
      border: 1px solid $l-color-bgcolor-11;
      float: right;
    }
  }
}
</style>
