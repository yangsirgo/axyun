<template>
  <div class="characterContain height100">
    <div class="character-list"
         v-for="(item,index) in characterData"
         :key="index"
    >
      <div class="list-title">{{recourceData[index]}}</div>
      <div class="list-cont clearfix">
        <div class="list-item float-left"
             v-for="(v,k) in item"
             :key="k">{{v.characterValue}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCharacterList} from "@/api/tools/nursingAssistant";

  export default {
    name: 'characterContain',
    data() {
      return {
        recourceData: {
          0: '序号',
          1: '上标',
          2: '下标',
          3: '单位',
          4: '缩写'
        },
        characterData: {
        }
      }
    },
    mounted() {
      this.loadData();
    },
    methods: {
       loadData() {
        this.loading = true;
        getCharacterList().then(res => {
          if (res.code === 1) {
            this.characterData = res.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .characterContain {
    overflow: auto;
    .character-list {

      .list-title {
        height: 30px;
        background-color: $l-color-bgcolor-12;
        border: 1px solid $l-color-bgcolor-11;
        text-align: center;
        line-height: 30px;
      }

      .list-cont {
        border-left: 1px solid $l-color-bgcolor-11;

        .list-item {
          width: 33.33%;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-right: 1px solid $l-color-bgcolor-11;
          border-bottom: 1px solid $l-color-bgcolor-11;
        }
      }
    }
  }
</style>
