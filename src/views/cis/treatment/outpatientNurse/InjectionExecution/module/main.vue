<template>
  <div class="height100">
    <div v-if="activeTabName === 'second'" class="height100">
      <history-infusion></history-infusion>
    </div>
    <div class="height100 wrapperCls" v-else>
      <await-execution @changeTabNum="changeTabNum"></await-execution>
    </div>
  </div>
</template>

<script>
  import historyInfusion from "./historyInfusion.vue"
  import awaitExecution from "./awaitExecution.vue"
  import { mapActions, mapGetters } from "vuex";

  export default {
    name: "mainPart",
    components: { historyInfusion, awaitExecution },
    data() {
      return {

      };
    },
    created() {

    },
    mounted() {

    },
    methods: {

      changeTabNum() {
        this.$emit("changeTabNum"); // 刷新tab未完成数量
      }
    },
    watch: {

    },
    computed: {
      ...mapGetters("cis", ["activeTabName"])
    }
  }
</script>

<style scoped lang="scss">
  .wrapperCls {
    .topPart {
      height: calc(100% - 350px);

      .tablePart {
        height: calc(100% - 60px);

        .tablePartUtils {
          height: 60px;

          .date-icon {
            top: 10px;
            right: 10px;
            color: #949da3;
          }
        }

        .tablePartMain {
          height: calc(100% - 60px);
        }
      }

      .skinTestSwitch {
        height: 60px;
        /*line-height: 60px;*/
        padding: 10px;
        overflow: visible;
        white-space: nowrap;
      }
    }

    .bottomForm {
      height: 350px;
      overflow: auto;
      .bottomForm {
        height: calc(100% - 50px);
        border-bottom: 1px solid #e4e4e4;
      }

      .buttonsPart {
        height: 50px;
        padding-right: 20px;
      }
    }

    .skinTestResult {
      height: 300px;

      .top {
        height: 50%;
        position: relative;

        .title {
          position: absolute;
          top: 0px;
          padding: 0 20px;
        }

        .content {
          position: absolute;
          top: 50px;
          padding: 0 20px;
        }
      }

      .bottom {
        height: 50%;
        position: relative;

        .title {
          position: absolute;
          top: 0px;
          padding: 0 20px;

        }

        .content {
          position: absolute;
          top: 50px;
          padding: 0 20px;
        }
      }
    }

    .rightBox {
      .title {
        padding: 0 20px;
      }

      .content {
        padding: 0 20px;
      }

    }
  }
</style>
