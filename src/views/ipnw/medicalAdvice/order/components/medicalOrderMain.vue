<template>
  <div class="applicat">
    <el-tabs
      tab-position="left"
      v-model="activeName"
      class="contleft"

    >
      <el-tab-pane
        label="医嘱"
        name="westernMedicine"
        tip="1"
        key="westernMedicine"
      >
        <western-medicine v-if="activeName === 'westernMedicine'"></western-medicine>
      </el-tab-pane>
      <el-tab-pane
        label="中草药"
        name="chmMedicine"
        tip="2"
        key="chmMedicine"
      >
        <chm-medicine v-if="activeName === 'chmMedicine'"></chm-medicine>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import westernMedicine from "./westernMedicine2";
  import chmMedicine from "./chmMedicine";

  export default {
    components: {
      westernMedicine,
      chmMedicine
    },
    data() {
      return {
        activeName: "westernMedicine"

      };
    },
    created() {

    },
    methods: {

    }
  };
</script>
<style lang="scss" scoped>
  .applicat {
    position: relative;
    height: 100%;
    padding: 0 0px;
    background: $l-color-white;
    border-radius: 4px;
    /deep/ .el-tabs__nav-scroll {
      background-color: $l-color-bgcolor-18;
    }

    .el-tabs__content {
      height: 100%;
    }

    .contleft {
      height: 100%;

      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .applicat-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 39px;
  }
</style>
