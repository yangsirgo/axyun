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
        <item-center
          @addGroup="addGroup"
          @editGroup="editGroup"
          @saveGroup="saveGroup"
          @stopGroup="stopGroup"
          @rowClick="centerRowClick" ref="loadData" :type="type"></item-center>
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
        if (index === 2) {
          this.type = 'item'
          setTimeout(() => {
            this.$refs.itemCenter.loadData();
          }, 0)

        }

      },
      save(data) {
        this.loadData();
      },
      search() {

      },
      centerRowClick(row) {
        console.log('点击了row', row);

        setTimeout(() => {
          this.$refs.details && this.$refs.details.setReadonly();
          this.$refs.details && this.$refs.details.loadData(row);
        }, 0)
        // 得到数据后 通过 this.$refs.details.tableData 赋值
      },
      addGroup (){
        this.$refs.details && this.$refs.details.setEditable();
        this.$refs.details && this.$refs.details.resetForm();
      },
      editGroup (){
        this.$refs.details && this.$refs.details.setEditable();
      },
      saveGroup (){

      },
      stopGroup (){

      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .cls {
    .cls-left {
      width: 380px;
      float: left;
    }

    .cls-right {
      margin-left: 390px;

      .cls-right-center {
        margin-right: 650px;
      }

      .cls-right-right {
        width: 640px;
        float: right;
      }
    }

  }
</style>
