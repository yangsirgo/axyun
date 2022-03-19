<template>
  <div class="PGlobalStep">
    <el-steps :active="active" finish-status="success" :align-center="true">
      <el-step
        v-for="(v,i) in titleList"
        :title="v.title"
        :key="i"
      ></el-step>
    </el-steps>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "PGlobalStep",
  components: {},
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      titleList: [],
      status: this.$store.state.table.tableStatus,
      tableConfiguration1: "",
      viewTableConfiguration2: ""
    };
  },
  computed: {
    ...mapGetters("table", ["tableConfiguration", "viewTableConfiguration"])
  },
  created() {
    console.log("this.status", this.status);
    this.titleList = this.tableConfiguration.pageList;
  },
  mounted() {},
  methods: {},
  watch: {
    tableConfiguration(n, o) {
      console.log(
        "tableConfiguration*************************************************",
        n
      );
    },
    viewTableConfiguration(n, o) {
      console.log(
        "viewTableConfiguration**********************************************",
        n
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.PGlobalStep {
  /deep/ .el-step__head .is-wait{
      color: #cbc0cc;
  }
  .icondanxuan-xuanzhong:before {
    content: "\e603";
  }
  .el-steps {
    padding-left: 40px;
    padding-right: 20px;
  }
  /deep/.el-icon-check {
    background-color: #2b4583;
    font-size: 14px;
  }

  /deep/ .el-step__head.is-success {
    border-color: #2b4583;

    .el-step__line {
      background-color: #2b4583;
    }

    .el-step__icon-inner.is-status {
      background-color: #2b4583;
      border-radius: 28px;
      padding: 2px;
      color: #ffffff;
    }
  }
  /deep/.el-step__icon.is-icon {
    width: 14px;
  }
  /deep/ .el-step__title {
    font-weight: bold;
    // margin-left: -30px;
    font-size: 14px;
    color: #2e323a;
  }
  /deep/.el-step__title.is-success {
    font-weight: bold;
    color: #2b4583;
  }
  /deep/.el-step__title.is-process {
    font-weight: bold;
    color: #2b4583;
  }
  /deep/ .el-step__description {
    color: #c5cbcf;
    font-size: 14px;
  }

  /deep/ .el-step__head.is-process {
    color: #2b4583;
  }
}
</style>
