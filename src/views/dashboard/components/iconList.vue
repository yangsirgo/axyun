<template>
  <div class="icon-list height100">
    <l-card-title>
      <template slot="left"
        >智能提醒</template
      >
    </l-card-title>
    <div class="icon-list-contain">
      <ul class="icon-contain">
        <li
          class="icon-item clearfix"
          v-for="(item, index) in iconList"
          :key="index"
        >
          <div class="left-con" :style="{ backgroundColor: item.bgColor }">
            <i class="iconfont" :class="[item.iconClass]"></i>
          </div>
          <div class="right-con">
            <p class="num">{{ item.num }}</p>
            <p class="tips">{{ item.tips }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "iconList",
  props: {
    iconList: {
      type: Array,
      require: true
    }
  },
  data() {
    return {};
  },
  mounted() {
    
  },
  methods: {
    
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.icon-list {
  padding: 0 20px;
  .icon-list-contain {
    display: flex;
    height: calc(100% - 63px);
    justify-content: center;
    align-items: center;
    .icon-contain {
      width: 350px;

      display: flex;
      flex-wrap: wrap;
      .icon-item {
        width: 50%;
        margin-bottom: 65px;
        .left-con {
          margin-left: 15px;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 46px;
          height: 46px;
          border-radius: 4px;
          .iconfont {
            color: #fff;
          }
        }
        .right-con {
          float: left;
          margin-left: 12px;
          
          .num {
            font-size: 20px;
            font-weight: bold;
            color: rgba(46, 50, 58, 1);
            line-height: 29px;
          }
          .tips {
            font-size: 14px;
            font-weight: 400;
            color: rgba(148, 157, 163, 1);
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>

