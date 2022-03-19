<template>
  <div class="three-column" ref="page" id="main">
    <div id="center" class="column">
      <div class="center height100">
        <div class="patient-info width100">
          <patient-info
            :patientInfo="JSON.stringify(patientMsg)"
          ></patient-info>
        </div>
        <div class="rubbish">
          <Rubbish></Rubbish>
        </div>
      </div>
    </div>
    <div id="left" class="column" ref="left">
      <el-card class="width100 height100">
        <time-line></time-line>
      </el-card>
    </div>
  </div>
</template>

<script>
import adHeight from "@/mixins/adHeight";
import patientInfo from "./components/patientInfo";
import timeLine from "./components/timeLine";
import Rubbish from "./components/Rubbish";
export default {
  name: "treatClosedLoop",
  mixins: [adHeight],
  components: {
    patientInfo,
    timeLine,
    Rubbish
  },
  mounted() {
    this.Height = this.$refs.page.clientHeight - 80;
  },
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
      }
    };
  }
};
</script>

<style lang="scss" scoped>
$leftWidth: 310px;
$leftPartRight: 320px;
$rightWidth: 0px;
.three-column {
  min-width: 1024px;
  padding-left: $leftPartRight;
  padding-right: 0;
  overflow: hidden;
  .column {
    position: relative;
    float: left;
    height: 100%;
    padding: 0 0 0 10px;
  }

  #left {
    width: $leftWidth;
    margin-left: -100%;
    position: relative;
    right: $leftPartRight;
    padding-left: 0;
    display: block;
    box-sizing: content-box;
  }

  #center {
    width: 100%;
    height: 100%;
    .rubbish {
      margin-top: 20px;
      width: 100%;
      height: calc(100% - 50px);
    }
  }
}
</style>
