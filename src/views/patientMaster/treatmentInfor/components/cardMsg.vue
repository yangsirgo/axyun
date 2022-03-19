<template>
  <div class="card-msg-con">
    <div class="card-top-con">
      <!--<p class="title-con">
        <span>{{ renderData.cardTitle }}</span>
        <el-button class="button-position" type="primary" @click="handleClick">{{renderData.buttonName}}</el-button>
      </p>-->
      <div class="title-con">
        <l-card-title>
          <span slot="left">{{ renderData.cardTitle }}</span>
          <span slot="right">
              <el-button type="text" @click="handleClick" class="button-position">{{renderData.buttonName}}</el-button>
            </span>
        </l-card-title>
      </div>
    </div>
    <div class="con-body">
      <!--<LTimeLineLoadMore-->
      <!--@handleLoadMore="load"-->
      <!--:tL_isLoading="isLoading"-->
      <!--:tL_noMore="noMore"-->
      <!--&gt;-->
      <ul class="infinite-list" style="overflow:auto">
        <li
          class="infinite-list-item"
          @click="clickShowDetail(itemProject.id)"
          v-for="(itemProject, index) in renderData.detailData"
          :key="index"
        >
          <el-row>
            <el-col :span="15">
              <p class="title">{{ itemProject.title }}</p>
            </el-col>
            <el-col :span="9">
              <p class="title status">{{ itemProject.status }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <p
                v-for="(item, idx) in itemProject.detail"
                :key="idx"
                v-if="idx % 2 === 0"
              >
                <span class="text-title">{{ item.tagsTitle }}</span>
                <span class="text-contain">{{ item.tagsValue }}</span>
              </p>
            </el-col>
            <el-col :span="9">
              <p
                v-for="(item, idx) in itemProject.detail"
                :key="idx"
                v-if="idx % 2 === 1"
              >
                <span class="text-title">{{ item.tagsTitle }}</span>
                <span class="text-contain">{{ item.tagsValue }}</span>
              </p>
            </el-col>
          </el-row>
        </li>
      </ul>
      <!--</LTimeLineLoadMore>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    props: {
      renderData: {
        type: Object,
        require: true
      }
    },
    data() {
      return {
        count: 1,
        noMore: false, // 是否展示没有更多提示
        isLoading: false // 正在加载的状态
      };
    },
    methods: {
      handleClick() {
        this.$router.push(this.renderData.router);
      },
      // 异步加载更多
      load() {
        this.$emit("updateOrderData", {
          page: 1
        });
      },
      // 点击触发事件
      clickShowDetail(id) {
        this.$emit("clickShowDetail", {
          id
        });
      }
    },
    components: {}
  };
</script>

<style lang='scss' scoped>
  .card-msg-con {
    display: inline-block;
    width: 390px;
    height: 300px;
    background-color: $l-color-white;
    /*box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);*/
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;

    .card-top-con {
      width: 100%;
      height: 60px;
      overflow: hidden;
      /*background-color: $l-color-bgcolor-18;*/

      .title-con {
        padding-left: 20px;
        /*height: 100%;
        font-size: 16px;
        line-height: 60px;
        border-left: 4px solid $l-color-primary;*/

        .button-position {
          /*margin-top: 12px;
          margin-right: 10px;
          float: right;*/
          color: $l-color-fontcolor-2;
        }
      }
    }

    .con-body {
      font-size: 14px;
      width: 100%;
      height: 240px;
      padding: 0 10px 10px 10px;
      overflow: auto;
      line-height: 24px;
      border-top: 1px solid $l-color-bgcolor-11;

      .infinite-list {
        .infinite-list-item {
          margin-top: 10px;
          cursor: pointer;

          .title {
            line-height: 30px;
            font-weight: 600;
            text-align: left;
          }

          .status {
            text-align: right;
          }

          .text-title {
            color: rgba(148, 157, 163, 1);
          }

          .text-contain {
            color: #2e323a;
          }
        }

        .infinite-list-item:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
</style>
