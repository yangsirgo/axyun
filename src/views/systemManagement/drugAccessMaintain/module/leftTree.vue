<template>
  <div class="cls">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="抗菌药品用药权限维护" name="1">
        <div @click="divClick(0)" :class="activeCls(0)">抗菌药品权限维护</div>
        <!--<div @click="divClick(1)" :class="activeCls(1)">收费项目维护</div>-->
      </el-collapse-item>
      <!--<el-collapse-item title="医嘱目录维护" name="2">-->
        <!--<div @click="divClick(2)" :class="activeCls(2)">医嘱项目</div>-->
        <!--<div @click="divClick(3)" :class="activeCls(3)">医嘱大类</div>-->
        <!--<div @click="divClick(4)" :class="activeCls(4)">医嘱子类</div>-->
      <!--</el-collapse-item>-->
    </el-collapse>
  </div>
</template>

<script>


  export default {
    name: "leftTree",
    components: {},
    data() {
      return {
        activeNames: ['1','2'],
        current:0
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      divClick (index){
        this.current = index;
        this.$emit('itemClick',index);
      },
      activeCls (index){
        return {
          active:this.current === index,
          divContent:true
        }
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .cls {
    /deep/.el-collapse-item__content {
      padding: 0 !important;
    }
    .active {
      background-color: #c4e3f3;
    }
    .divContent {
      line-height: 36px;
      padding: 0 30px;
    }
  }
</style>
