<template>
  <div class="docTools">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="交互" name="first">
        <docToolInteraction></docToolInteraction>
      </el-tab-pane>
      <el-tab-pane label="属性" name="second">
        <docToolAttr></docToolAttr>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import docToolAttr from './docToolAttr';
  import docToolInteraction from './docToolInteraction';

  export default {
    name: "docTools",
    components: {
      docToolAttr,
      docToolInteraction
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleClick() {
      },
    }
  }
</script>

<style scoped lang="scss">
  .docTools {
    padding: 0 20px 20px 20px;
  }
</style>
