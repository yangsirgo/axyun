<template>
  <div class="office width100 height100">
    <div class="top-con">
      <l-card-title>
        <template slot="left"
          >医生列表</template
        >
      </l-card-title>
      <div class="top-office clearfix">
        <l-formt-title label="医生姓名" style="width: 240px; float: left;">
          <el-input v-model="officeValue"></el-input>
        </l-formt-title>
        <div class="btn-con">
          <el-button
            @click="searchDoc"
            style="margin-left: 10px;"
            type="primary"
            >查询</el-button
          >
          <el-button @click="resetDoctorName" style="margin-left: 10px;"
            >重置</el-button
          >
        </div>
      </div>
      <div class="slide-con-office">
        <div
          @click="clickPervItem"
          class="swiper-button-prev common-style btn-prev"
        ></div>
        <swiper class="swiper" :options="swiperOption" ref="mySwiper">
          <swiper-slide
            class="swiper-slide"
            v-for="(slide, index) in swiperSlides"
            :key="index"
            :class="{ active: index === activeIndex }"
          >
            <div class="top">
              <div class="img">
                <img alt="" />
              </div>
              <div class="right">
                <p class="doc-name">{{ slide.uname }}</p>
                <p class="office-com">主任医师/ 教授</p>
              </div>
            </div>
            <div class="body-con">
              <p class="body-office">
                {{ slide.deptName }} <span class="order-number">23/40</span>
              </p>
              <p class="body-content">
                擅长：泌尿系结石微创腔镜手术、前列腺增生切除术、泌尿系肿瘤微创腔镜手术、及相关治疗。前列腺增生切除术、泌尿系肿瘤微创腔镜手术、及相关治疗。前列腺增生切除术、泌尿系肿瘤微创腔镜手术、及相关治疗。前列腺增生切除术、泌尿系肿瘤微创腔镜手术、及相关治疗。
              </p>
            </div>
          </swiper-slide>
          <div
            ref="swiperButtonPrev"
            id="btn-hide-prev"
            class="swiper-button-prev btn-hide"
            slot="button-prev"
          ></div>
          <div
            ref="swiperButtonNext"
            id="btn-hide-next"
            class="swiper-button-next btn-hide"
            slot="button-next"
          ></div>
        </swiper>
        <div
          @click="clickNextItem"
          class="swiper-button-next common-style btn-next"
        ></div>
      </div>
    </div>

    <div class="contain-con">
      <orderTime :deptId="deptId" :doctorId="doctorId" />
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import orderTime from "./orderTime";
import service from "@/api/appointment/appointment.js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "office",
  props: ["deptId"],
  data() {
    return {
      doctorId: "",
      activeIndex: -1,
      officeValue: "",
      swiperOption: {
        slidesPerView: 3,
        height: 300,
        spaceBetween: 30,
        slidesPerGroup: 3,
        notNextTick: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        observeSlideChildren: true,
        on: {
          click: () => {
            let clickedIndex = this.$refs.mySwiper.swiper.clickedIndex;
            if (typeof clickedIndex === "number") {
              this.clickItem(clickedIndex);
              this.setCurrentTitle({
                title: "doctor"
              });
            }
          }
        }
      },
      swiperSlides: []
    };
  },
  watch: {
    deptId: {
      handler: function(val, oldval) {
        if (val) {
          // 已选中医生置为空
          this.doctorId = "";
          this.activeIndex = "";
          this.getDoctorList();
        }
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentTitle: "base/setCurrentTitle"
    }),
    clickItem(index) {
      this.activeIndex = index;
      this.doctorId = this.swiperSlides[index].uid;
    },
    clickNextItem() {
      this.$refs.swiperButtonNext.click();
    },
    clickPervItem() {
      this.$refs.swiperButtonPrev.click();
    },
    searchDoc() {
      let index = this.swiperSlides.findIndex((item, index) => {
        return this.officeValue === item.uname;
      });
      if (index > -1) {
        this.activeIndex = index;
        this.doctorId = this.swiperSlides[index].uid;
        this.swiper.slideTo(this.activeIndex, 1000, false);
      }
    },
    resetDoctorName() {
      this.officeValue = "";
    },
    async getDoctorList() {
      try {
        let resData = await service.getDoctorListByDeptId(this.deptId);
        if (resData.code === 1) {
          if (resData.data.length > 0) {
            this.swiperSlides = resData.data;
          }
        }
      } catch (error) {
        console.log(error);
        this.$message.error(error.msg || "获取医生列表错误");
      }
    }
  },
  mounted() {},
  components: {
    orderTime,
    swiper,
    swiperSlide
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  }
};
</script>

<style lang='scss' scoped>
.office {
  padding-left: 20px;
  background-color: #fff;
  overflow: auto;
  .top-con {
    padding-right: 20px;

    .top-office {
      font-size: 0;
      vertical-align: baseline;
      .btn-con {
        display: inline-block;
        float: left;
      }
    }
    .slide-con-office {
      margin-top: 20px;
      padding-top: 20px;
      position: relative;
      width: 100%;
      height: 332px;
      background-color: $l-color-bgcolor-18;
      .common-style {
        position: absolute;
      }
      .btn-prev {
        left: 10px;
        top: 50%;
      }
      .swiper {
        height: 292px;
        .swiper-slide {
          padding: 15px;
          box-sizing: border-box;
          cursor: pointer;
          background-color: #fff;
          .top {
            display: flex;
            flex-direction: row;
            .img {
              width: 80px;
              height: 102px;
              background-color: $l-color-bgcolor-18;
            }
            .right {
              flex: 1;
              margin-left: 10px;
              .doc-name {
                font-size: 18px;
                font-weight: bold;
                color: rgba(46, 50, 58, 1);
                line-height: 26px;
              }
              .office-com {
                font-size: 14px;
                font-weight: 400;
                color: rgba(148, 157, 163, 1);
                line-height: 20px;
              }
            }
          }
          .body-con {
            margin-top: 15px;
            .body-office {
              background: rgba(255, 255, 255, 1);
              border-radius: 2px;
              .order-number {
                color: #3d7dfb;
              }
            }
            .body-content {
              width: 100%;
              margin-top: 6px;
              font-size: 14px;
              font-weight: 400;
              color: rgba(148, 157, 163, 1);
              line-height: 20px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 6;
              overflow: hidden;
            }
          }
        }
        .active {
          box-sizing: border-box;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          border: 2px solid $l-color-primary;
        }
      }
    }
    /deep/ .swiper-container {
      margin: 0 60px;
    }
    .btn-hide {
      display: none;
    }
  }
  .contain-con {
    margin-top: 20px;
  }
}
</style>
