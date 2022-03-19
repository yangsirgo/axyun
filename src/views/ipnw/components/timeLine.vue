<template>
  <div class="height100 width100">
    <div class="year-list height100">
      <div
        v-for="(item, index) in yearList"
        :key="'year' + index"
        @click="handleSelectYear(index)"
      >
        <p :class="currentYear == index ? 'active' : ''">
          {{ item }}
          <i></i>
        </p>
      </div>
    </div>
    <div class="year-detail height100" ref="list">
      <div v-for="(item, index) in detailList" :key="'detailItem' + index">
        <div class="detail-item position-relative" :ref="item.year">
          <div class="line"></div>
          <div class="title-dot">
            <span>
              <i></i>
            </span>
          </div>
          <i class="color4" style="font-size: 16px;">{{ item.year }}</i>
        </div>
        <div
          class="detail-item position-relative"
          v-for="(it, i) in item.detail"
          :key="i"
        >
          <div class="line"></div>
          <div class="text">
            {{ it.date }}
          </div>
          <span class="dot">
            <i></i>
          </span>
          <div class="main-context">
            <p>{{ it.depart }}</p>
            <p>({{ it.context }}) {{ it.hospital }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "timeLine",
  data() {
    return {
      yearList: [
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
        "2010"
      ],
      currentYear: 0,
      detailList: [
        {
          year: "2019",
          detail: [
            {
              date: "06月11日",
              hospital: "上海龙华医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "复旦大学附属中山医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "上海市第六人民医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2018",
          detail: [
            {
              date: "06月11日",
              hospital: "上海市肿瘤医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2017",
          detail: [
            {
              date: "06月11日",
              hospital: "上海市第八人民医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "中国第一医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "上海455医院骨科中心",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "中国第一医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2016",
          detail: [
            {
              date: "06月11日",
              hospital: "中国第一医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2015",
          detail: [
            {
              date: "06月11日",
              hospital: "上海龙华医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "上海市肿瘤医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "中国第一医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "上海455医院骨科中心",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2014",
          detail: [
            {
              date: "06月11日",
              hospital: "上海市肿瘤医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2013",
          detail: [
            {
              date: "06月11日",
              hospital: "中国第一医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "上海市肿瘤医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "上海市第六人民医院",
              depart: "体检中心",
              context: "体检"
            },
            {
              date: "06月11日",
              hospital: "中国第一医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2012",
          detail: [
            {
              date: "06月11日",
              hospital: "中国第一医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2011",
          detail: [
            {
              date: "06月11日",
              hospital: "上海市第六人民医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        },
        {
          year: "2010",
          detail: [
            {
              date: "06月11日",
              hospital: "上海市肿瘤医院",
              depart: "体检中心",
              context: "体检"
            }
          ]
        }
      ]
    };
  },
  methods: {
    handleSelectYear(index) {
      this.currentYear = index;
      this.$refs.list.scrollTop = this.$refs[
        this.detailList[index].year
      ][0].offsetTop;
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
  margin-top: 20px;
  & > div {
    line-height: 28px;
    cursor: pointer;
    padding: 12px 10px;
    & > p {
      border-radius: 2px;
      position: relative;
    }
    & > p.active {
      background: $l-color-bgcolor-9;
      color: $l-color-white;
      i {
        position: absolute;
        top: calc(50% - 8px);
        right: -16px;
        border: 8px solid transparent;
        border-left: 8px solid $l-color-bgcolor-9;
      }
    }
  }
}
.color4{
  color: $l-color-fontcolor-4;
}
.year-detail {
  height: calc(100% - 25px);
  width: 75%;
  float: right;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 20px;
  position: relative;
  font-size: 14px;
  padding-bottom: 40px;
  scroll-behavior: smooth;
  .detail-item {
    padding: 10px;
    padding-left: 80px;
    padding-right: 5px;
    .main-context {
      background: $l-color-bgcolor-18;
      padding-left: 5px;
      font-size: 13px;
    }
    .line {
      position: absolute;
      left: 62px;
      height: 100%;
      border-right: 2px solid $l-color-border-1;
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
      left: 59px;
      top: 18px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $l-color-border-1;
      i {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        width: 4px;
        height: 4px;
        //background-color: $l-color-primary;
      }
    }
    .title-dot {
      position: absolute;
      left: 57px;
      top: 10px;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: $l-color-border-1;
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
