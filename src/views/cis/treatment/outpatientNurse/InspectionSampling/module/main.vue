<template>
  <div class="height100">
    <div class="height100 wrapperCls">
      <sample-execution></sample-execution>
    </div>
  </div>
</template>

<script>
  import sampleExecution from "./sampleExecution.vue"

  export default {
    name: "mainPart",
    components: { sampleExecution },
    data() {
      return {

      };
    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
    watch: {

    },
    computed: {

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
