<template>
  <div class="FastStatistics">
    <div class="fast_statistic">
      <article>
        <div class="fs_l">
          <el-progress
            :width="44"
            type="circle"
            :percentage="percentage.percentage"
            :stroke-width="6"
            :text-inside="true"
            :stroke-linecap="'butt'"
            color="#2C4583"
          ></el-progress>
        </div>
        <div class="fs_r">
          <div class="fs_r_title">{{percentage.title}}</div>
          <div class="fs_r_percentage">{{percentage.percentage}}%</div>
        </div>
      </article>
      <div class="fast_statistic_line"></div>
      <section>
        <div class="fs_up">
          <div class="fs_up1"></div>
          <div class="fs_up2">{{percentage.name1}}</div>
          <div class="fs_up3">{{percentage.num1}}</div>
        </div>
        <div class="fs_down">
          <div class="fs_down1"></div>
          <div class="fs_down2">{{percentage.name2}}</div>
          <div class="fs_down3">{{percentage.num2}}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "FastStatistics",
  components: {},
  props: {
    percentage: {
      type: Object
    }
  },
  data() {
    return {};
  },
  created() {
    // console.log("this.percentage", this.percentage);
    this.percentage.percentage = parseInt(this.percentage.percentage);
  },
  mounted() {},
  methods: {},
  watch: {
    'percentage': {
      handler(a,b){
        this.percentage.percentage = parseInt(this.percentage.percentage);
         // console.log(123123)
      },
      deep: true

    }


  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.FastStatistics {
  //   background: #fff;
  .fast_statistic {
    width: 187px;
    height: 181px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    padding: 20px 15px 20px 20px;
    article {
      display: flex;
      // align-items: center;
      height: 92px;
      .fs_r {
        padding-left: 15px;
        .fs_r_title {
          font-size: 14px;
          color: rgba(50, 53, 59, 1);
        }
        .fs_r_percentage {
          font-size: 28px;
          font-weight: bold;
          color: rgba(50, 53, 59, 1);
        }
      }
    }
    .fast_statistic_line {
      margin: 0 auto;
      width: 148px;
      height: 1px;
      background: rgba(240, 240, 240, 1);
      border-radius: 1px;
      // margin-bottom: 12px;
    }
    section {
      .fs_up {
        margin-top: 10px;
        display: flex;
        align-items: center;
        .fs_up1 {
          border-radius: 30px;
          width: 8px;
          height: 8px;
          background: #2c4583;
        }
        .fs_up2 {
          margin-left: 10px;
          font-size: 12px;
          color: rgba(151, 160, 165, 1);
        }
        .fs_up3 {
          margin-left: 5px;
          font-size: 12px;
          color: rgba(50, 53, 59, 1);
        }
      }
      .fs_down {
        margin-top: 5px;
        display: flex;
        align-items: center;
        .fs_down1 {
          border-radius: 30px;
          width: 8px;
          height: 8px;
          background: #e6e6e6;
        }
        .fs_down2 {
          margin-left: 10px;
          font-size: 12px;
          color: rgba(151, 160, 165, 1);
        }
        .fs_down3 {
          margin-left: 5px;
          font-size: 12px;
          color: rgba(50, 53, 59, 1);
        }
      }
    }
  }
}
</style>
