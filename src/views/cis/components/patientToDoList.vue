<template>
  <div>
    <div
      class="item"
      v-for="(item, index) in toDoList"
      :key="index"
    >
      <div class="itemInner">
        <span class="el-icon-tickets icon"></span>
        <span class="index">{{index + 1}}.</span>
        <span class="message">{{ item.message }}</span>
        <span v-if="item.exceedDays < 0" class="message red">(超期{{ Math.abs(item.exceedDays)}}天)</span>
        <span v-if="item.exceedDays >= 0" class="message blue">(剩余{{ item.exceedDays}}天)</span>
      </div>

      <el-button
        class="btn"
        @click="goHref(item)"
        v-if="showGoHrefText (item) != '去查看'"
      > {{ showGoHrefText (item) }} </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    toDoList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // tipList: [
      //   {
      //     name: "namenamenamenamename",
      //     url: "www.baidu.com"
      //   }
      // ]
    };
  },
  components: {},
  methods: {
    goHref(item) {
      console.log(`item`, item)
      window.open(item.url);
    },
    showGoHrefText (item) {
      let text = "去查看";
      if (item.message.indexOf("随访") > -1){
        text = "去随访";
      } else if(item.message.indexOf("签约") > -1){
        text = "去签约";
      }
      return text;
    }
  }
};
</script>

<style scoped lang="scss">
.item {
  display: flex;
  text-align: left;
  padding: 8px;
  font-size: 0;
  .itemInner {
    flex: 1;
    justify-items: center;
  }

  .icon {
    font-size: 24px;
    padding-left: 4px;
    vertical-align: bottom;
  }

  .message,
  .index {
    padding-right: 4px;
    font-size: 14px;
  }
  .red{
    color: red;
  }
  .blue{
    color: blue;
  }

  // .btn {
  //   display: inline-block;
  // }
}
</style>
