<template>
  <div class="height100 column">
    <el-card class="height100">
      <div class="top">
        <l-card-title>
          <span slot="left">病区</span>
          <el-button slot="right" class="button refresh" @click="refresh">刷新</el-button>
        </l-card-title>
        <div v-if="!timer">
          <el-input
            placeholder="请输入病区名查询定位"
            suffix-icon="el-icon-search"
            v-model="keyWord"
            v-on:keyup.native.enter="refresh"
          ></el-input>
        </div>
        <div v-else>
          <el-checkbox
            class="float-left"
            style="margin-right: 5px;margin-top: 8px;"
            v-model="open"
          >开启定时刷新</el-checkbox>
          <el-input-number
            v-model="countdown"
            class="countdown float-left"
            controls-position="right"
            :disabled="!open"
            @change="handleChange"
            :min="1"
          ></el-input-number>
        </div>
      </div>
      <div class="area-list">
        <div class="title">病区名称</div>
        <div class="list-container infinite-list-wrapper">
          <ul
            class="overflow-scroll-vertical"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled"
          >
            <li
              :class="curSelectedIndex == i?'list-item active':'list-item'"
              v-for="(item, i) in wardList"
              :key="i"
              @click="handleSelectedItem(curSelectedIndex = i,item)"
            >
              <span>
                <i class="dot" v-show="item.status == 0"></i>
                {{item.wardName}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import ipha from "@/api/hmm/ipha";
import { getPamars } from "@/utils/auth";

export default {
  name: "leftList",
  props: {
    timer: {
      default: false
    }
  },
  data() {
    return {
      loading: false, //左侧申请列表滑动加载状态
      noMore: false, // 左侧申请列表没有更多数据
      curSelectedIndex: 0, //默认选择项
      keyWord: "", // 搜索关键字
      countdown: "", // 计数器
      open: false, // 是否开启定时器刷新
      wardList: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    async listForDropDown() {
      await ipha
        .getWardList({ hosId: JSON.parse(getPamars()).hosId })
        .then(res => {
          let { data } = res;
          this.wardList = [...data];
          this.handleSelectedItem(0, this.wardList[0]);
        });
    },
    async refresh() {
      await ipha.getWardListByName({ name: this.keyWord }).then(res => {
        let { data } = res;
        this.wardList = [...data];
        this.handleSelectedItem(0, this.wardList[0]);
      });
    },
    handleSelectedItem(i, item) {
      this.curSelectedIndex = i;
      this.selectId = item.id;
      this.$emit("selectIdChange", this.selectId);
    },
    //加载更多
    load() {}
  },
  mounted() {
    this.handleSelectedItem(0, this.wardList[0]);
  }
};
</script>

<style scoped lang="scss">
$leftWidth: 287px;
.column {
  width: $leftWidth;
  position: relative;
}
.top {
  padding: 20px;
  padding-top: 0;
  .refresh {
    border-radius: 2px;
    background-color: $l-color-bgcolor-11;
    color: $l-color-fontcolor-3;
    position: relative;
    right: -10px;
    width: 76px;
    height: 28px;
  }
  .countdown {
    width: 132px;
    height: 36px;
    border-radius: 2px;
  }
  & > div {
    overflow: hidden;
  }
}
.area-list {
  text-align: left;
  .title {
    background-color: $l-color-bgcolor-18;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }

  .list-container {
    position: absolute;
    top: 150px;
    left: 0;
    width: 100%;
    bottom: 0;
    .list-item {
      padding-left: 20px;
      height: 44px;
      line-height: 44px;
      color: $l-color-fontcolor-3;
      position: relative;
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: $l-color-primary;
        position: absolute;
        left: 10px;
        top: calc(50% - 3px);
      }
    }
    .list-item:nth-child(even) {
      background: $l-color-bgcolor-18;
    }
    .active {
      background-color: $l-color-bgcolor-12 !important;
    }
  }
}
</style>
