<template>
  <div class="LSideList height100" ref="LSideList">
    <div ref="topCont">
      <div class="form-cont">
        <div class="form-list">
          <slot name="formList"></slot>
        </div>
        <div class="button-list clearfix">
          <el-button class="float-left" :style="{'width':isCreatRecordBtn?'75px':'98px','margin-right':'8px'}"
                     type="primary" @click="readCard">
           读卡
          </el-button>
          <el-button class="float-left"
                     :style="{'width':isCreatRecordBtn?'75px':'98px','margin-right':isCreatRecordBtn?'0px':'0','margin-left':'0'}"
                     type="primary" plain @click="search">查询
          </el-button>
          <el-button class="float-left" :style="{'width':'75px','margin-left':'0'}" type="primary" plain
                     v-if="isCreatRecordBtn" @click="createRecord">新建档案
          </el-button>
        </div>
      </div>
      <div class="border-cont"></div>
    </div>
    <div class="main-cont" ref="mainCont">
      <slot name="mainCont"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LSideList",
    inject: ['getIsCreatRecordBtn'],
    data() {
      return {
        timer: null
      }
    },
    computed: {
      isCreatRecordBtn() {
        return this.getIsCreatRecordBtn() || 0;
      }
    },
    mounted() {
      this.timer = setTimeout(() => {
        this.mainContHeight();
      }, 100)
    },
    updated() {
      this.$nextTick(() => {
        this.mainContHeight();
      });
    },
    destroyed() {
      clearTimeout(this.timer);
    },
    methods: {
      //查询
      search() {
        this.$emit('sideEvent', 'query');
      },
      //读卡
      readCard() {
        this.$emit('sideEvent', 'readCard');
      },
      //建档
      createRecord() {
        this.$emit('sideEvent', 'createRecord');
      },
      //计算mainCont的高度
      mainContHeight() {
        const LSideList = this.$refs.LSideList.offsetHeight;
        const topCont = this.$refs.topCont.offsetHeight;
        this.$refs.mainCont.style.height = LSideList - topCont - 20 + 'px';
      }
    }
  }
</script>

<style scoped lang="scss">
  .LSideList {
    width: 100%;
    background: $l-color-white;

    .form-cont {
      padding:  0 8px;

      .form-list {
        margin-bottom: 8px;
      }

    }

    .border-cont {
      height: 1px;
      margin: 0 16px 16px 16px;
      background-color: $l-color-bgcolor-11;
    }

    .main-cont {
      padding: 0 8px 8px 8px;
    }
  }
</style>
