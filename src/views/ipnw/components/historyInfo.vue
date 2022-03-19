<template>
  <div class="height100 width100">
    <div v-if="detailListInit.length>0" class="height100 width100">
      <div class="year-list height100">
        <div
          v-for="(item, index) in yearList"
          :key="'year' + index"
          @click="handleSelectYear(index)"
        >
          <p :class="currentYear == index ? 'active' : ''">{{ item }}</p>
        </div>
      </div>
      <div class="year-detail height100" ref="list">
        <div v-for="(item, index) in detailListInit" :key="'detailItem' + index">
          <div class="detail-item position-relative" :ref="item.year">
            <div class="line"></div>
            <div class="detail-year">{{ item.year }}</div>
            <div class="title-dot">
              <span>
                <i></i>
              </span>
            </div>
            <!-- <i style="font-size: 16px;color: #949da3;">{{ item.year }}</i> -->
          </div>
          <div class="detail-item position-relative" v-for="(it, i) in item.detail" :key="i">
            <div class="line"></div>
            <div class="text">{{ it.date }}</div>
            <span class="dot">
              <i></i>
            </span>
            <div :class="{'main-context': true,'is-click': it.isClick}" @click="changeHisRecord(it,i,index)">
              <p class="depart">{{ it.depart }}</p>
              <p class="cont">{{ it.hospital }} {{ it.context }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="font-size:16px;color:#909399;text-align:center;margin-top:20px">暂无就诊记录</div>
  </div>
</template>

<script>
  export default {
    name: "timeLine",
    props: ["yearList", "detailList"],
    data() {
      return {
        // yearList: ["2019", "2018", "2017", "2016", "2015"],
        currentYear: 0,
        detailListInit: []
        /*detailListInit: [
          {
            year: "2019",
            detail: [
              {
                date: "04-21",
                hospital: "张家港卫生院",
                depart: "1病区感染科",
                context: "家床"
              },
              {
                date: "03-18",
                hospital: "张家港卫生院",
                depart: "呼吸科",
                context: "家床"
              }
            ]
          },
          {
            year: "2018",
            detail: [
              {
                date: "11-04",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              },
              {
                date: "05-26",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              }
            ]
          },
          {
            year: "2017",
            detail: [
              {
                date: "11-04",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              },
              {
                date: "05-26",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              }
            ]
          },
          {
            year: "2016",
            detail: [
              {
                date: "11-04",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              },
              {
                date: "05-26",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              }
            ]
          },
          {
            year: "2015",
            detail: [
              {
                date: "11-04",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              },
              {
                date: "05-26",
                hospital: "上海市一医院",
                depart: "外科",
                context: "家床"
              }
            ]
          }
        ]*/
      };
    },
    watch: {
      detailList: {
        handler(val) {
          this.currentYear = 0;
          this.detailListInit = [];
          if (val && val.length > 0) {
            let detailListInit = JSON.parse(JSON.stringify(val));
            for (let i in detailListInit) {
              let item = detailListInit[i].detail;
              for (let j in item) {
                if (i == 0 && j == 0) {
                  item[j].isClick = true;
                } else {
                  item[j].isClick = false;
                }
              }
            }
            this.detailListInit = JSON.parse(JSON.stringify(detailListInit));
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {

    },
    methods: {
      handleSelectYear(index) {
        this.currentYear = index;
        this.$refs.list.scrollTop = this.$refs[
          this.detailListInit[index].year
          ][0].offsetTop;
      },
      changeHisRecord(it, ii, index) {
        this.currentYear = index;
        let detailListInit = JSON.parse(JSON.stringify(this.detailListInit));
        for (let i in detailListInit) {
          let item = detailListInit[i].detail;
          for (let j in item) {
            if (i == index && j == ii) {
              item[j].isClick = true;
            } else {
              item[j].isClick = false;
            }
          }
        }
        this.detailListInit = JSON.parse(JSON.stringify(detailListInit));
        this.$emit('changeHisRecord', it);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .year-list {
    width: 25%;
    height: calc(100% - 25px);
    float: left;
    text-align: center;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 1px;
    /*position: fixed;*/
    & > div {
      line-height: 28px;
      cursor: pointer;
      padding: 11px 10px;

      & > p {
        font-size: 14px;

        font-weight: bold;
        color: rgba(212, 212, 212, 1);
        position: relative;
      }

      & > p.active {
        font-size: 14px;

        font-weight: bold;
        color: rgba(46, 50, 58, 1);
      }
    }
  }

  .year-detail {
    width: 75%;
    height: calc(100% - 25px);
    float: right;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 4px;
    position: relative;
    font-size: 14px;
    padding-bottom: 40px;
    scroll-behavior: smooth;

    .detail-item {
      padding: 10px;
      padding-left: 70px;
      padding-right: 5px;

      .detail-year {
        position: absolute;
        left: 0px;
        top: 14px;

        font-size: 14px;

        font-weight: bold;
        color: rgba(46, 50, 58, 1);
      }

      .main-context {
        background: $l-color-bgcolor-18;
        padding-left: 5px;
        font-size: 13px;
        cursor: pointer;

        .depart {
          font-size: 12px;

          font-weight: 400;
          color: rgba(46, 50, 58, 1);
        }

        .cont {
          font-size: 12px;

          font-weight: 400;
          color: rgba(148, 157, 163, 1);
        }
      }

      .is-click {
        background: $l-color-bgcolor-12;
      }

      .line {
        position: absolute;
        // left: 62px;
        left: 52px;
        height: 100%;
        border-right: 1px solid #e4e4e4;
      }

      .text {
        position: absolute;
        left: 0px;
        top: 14px;
        color: $l-color-fontcolor-4;
        font-size: 14px;
      }

      p {
        line-height: 22px;
      }

      .dot {
        position: absolute;
        // left: 59px;
        left: 49px;
        top: 18px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        border: 1px solid #e4e4e4;
        background-color: rgba(255, 255, 255, 1);

        i {
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          width: 4px;
          height: 4px;
        }
      }

      .title-dot {
        position: absolute;
        // left: 57px;
        left: 49px;
        top: 16px;

        span {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #2e323a;
          position: relative;
          text-align: center;

          i {
            display: inline-block;
            width: 6px;
            height: 6px;
            //background-color: $l-color-primary;
          }
        }
      }
    }
  }
</style>
