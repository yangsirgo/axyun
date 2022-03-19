<template>
  <div class="top-cont width100 height100">
    <div class="left">
      <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2385323722,2917599006&fm=26&gp=0.jpg" alt=""/>
    </div>
    <div class="center">
      <div class="first">{{ patientDetail.patientName }}</div>
      <div class="second">
        <i>{{ patientDetail.patientAge }}</i>
        <i>{{ patientDetail.patientGender }}</i>
        出生：
        <i>{{patientDetail.birthDate }}</i>
      </div>
      <div>
        联系电话：
        <i>{{ patientDetail.mobileNum }}</i>
      </div>
    </div>
    <div class="right clearfix">
      <div class="float-left" style="margin: 18px 50px 0 0">
        <div class="right-cont">身份证号：<i>{{ patientDetail.identificationNum }}</i></div>
        <div class="right-cont">医保类型：<i>{{ patientDetail.insuranceType }}</i></div>
        <div class="right-cont">籍贯：<i>{{ patientDetail.nativePlaceCode }}</i></div>
      </div>
      <div class="float-left" style="margin-top: 18px">
        <div class="right-cont">EMPIID：<i>{{ patientDetail.EMPId }}</i></div>
        <div>{{ patientDetail.illNess }}</div>
      </div>
    </div>
    <div class="qrcode float-left">
      <img
        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568906640660&di=e943f173442165c72c466a64156d2938&imgtype=0&src=http%3A%2F%2Fimg1.doubanio.com%2Fview%2Fnote%2Flarge%2Fpublic%2Fp46201558.jpg"
        alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "top",
    props: {
      patientDetail: {
        type: Object
      }
    }
  }
</script>

<style scoped lang="scss">
  i {
    font-style: normal;
  }

  .top-cont {
    padding: 20px;
    margin-left: 30px;

    .left {
      padding-right: 20px;
      float: left;

      img {
        width: 90px;
        height: 110px;
      }
    }

    .center {
      margin-right: 30px;
      padding-left: 20px;
      padding-right: 30px;
      border-right: 1px solid $l-color-bgcolor-11;
      float: left;

      .first {
        margin-bottom: 15px;
        font-weight: bold;
        font-size: 20px;
      }

      .second {
        margin-bottom: 10px;

        i {
          margin-right: 10px;
        }

      }
    }

    .right {
      float: left;

      .right-cont {
        margin-bottom: 10px;
      }
    }

    .qrcode {
      margin-left: 80px;

      img {
        width: 110px;
        height: 110px
      }
    }
  }
</style>
