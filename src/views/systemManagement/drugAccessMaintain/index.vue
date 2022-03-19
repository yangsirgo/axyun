<template>
  <div class="cls height100">
    <el-card class="cls-left height100">
      <left-tree @itemClick="loadData"></left-tree>
    </el-card>
    <div class="cls-right height100">
      <el-card class="cls-right-right height100">
        <item-right @save="save" ref="details"></item-right>
      </el-card>
      <el-card class="cls-right-center height100">
        <item-center  @rowClick="centerRowClick" ref="itemCenter" :type="type"></item-center>
      </el-card>
    </div>
  </div>
</template>

<script>
  import leftTree from "./module/leftTree.vue"
  import itemCenter from "./module/centerModule/itemCenter.vue"
  import itemRight from "./module/rightModule/itemRight.vue"

  export default {
    name: "index.vue",
    components: {leftTree, itemCenter, itemRight},
    data() {
      return {
        type: 'item'// 分 子类 和大类,医嘱项目三种类型
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      loadData(index) {
          setTimeout(() => {
            this.$refs.itemCenter.search();
          }, 0)

      },
      save(data) {
        this.loadData();
      },
      search() {

      },
      centerRowClick(row) {
        console.log('点击了row', row);
        setTimeout(() => {
          this.$refs.details.loadData(row);
        }, 0)
        // 得到数据后 通过 this.$refs.details.tableData 赋值
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .cls {
    .cls-left {
      width: 350px;
      float: left;
    }

    .cls-right {
      margin-left: 360px;

      .cls-right-center {
        margin-right: 590px;
      }

      .cls-right-right {
        width: 580px;
        float: right;
      }
    }

  }
</style>
