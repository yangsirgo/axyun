<template>
  <div v-loading="loading">
    <div class="drug-info width100" v-for="item in list" :key="item.id">
      <el-row class="drug-name">{{ item.drugName }}</el-row>
      <el-row class="spec">{{ item.spec }}</el-row>
    </div>
    <div class="little-title">用量审核结果</div>
    <el-card shadow="hover" v-for="item in list" :key="'a' + item.id">
      <el-row class="drug-name2">{{ item.drugName }}</el-row>
      <el-row>
        <span class="left">{{currentDrug.orderType == '11' ? "单次剂量":"一次用量"}}</span>
        <span class="right2" v-if="currentDrug.orderType == '11'">{{ item.displayQuantity }}

          <span :val="item.displayUnit" code="DrugUnit" v-codeTransform></span>
        </span>
        <span class="right2" v-if="currentDrug.orderType !== '11'">{{ item.oneDosage }}

          <span :val="item.dosageUnit" code="DrugDoseUnit" v-codeTransform></span>
        </span>
        <span class="right2">正常</span>
      </el-row>
    </el-card>
    <!-- <div class="little-title">配伍结果</div>
    <div class="result">无</div>
    <div class="little-title">过敏信息</div>
    <div class="info">无</div>
    <div class="button">
      <el-button>提交反馈意见</el-button>
    </div>-->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import opha from "@/api/hmm/opha";

export default {
  name: "drugCheck",
  data() {
    return {
      list: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["currentDrug"])
  },
  watch: {
    currentDrug: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log(val,"传值");
        if (val && val.recipeCode) {
          this.loadData(val.recipeCode);
        } else {
          this.list = [];
        }
      }
    }
  },
  methods: {
    loadData(code) {
      this.loading = true;
      opha
        .listD({
          recipeCode: code
        })
        .then(res => {
          if (res.code === 1) {
            this.list = res.data;
            console.log("药品审方",this.list);
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.drug-info {
  font-size: 14px;

  font-weight: 400;
  color: $l-color-fontcolor-3;
  border-bottom: 1px solid $l-color-bgcolor-11;
  margin-bottom: 10px;
  padding-bottom: 10px;
  .drug-name {
    font-size: 16px;
    font-weight: bold;
    color: $l-color-fontcolor-3;
    margin-bottom: 5px;
  }
  .spec {
    color: $l-color-fontcolor-3;
  }
}
.little-title {
  font-size: 14px;

  font-weight: 400;
  color: $l-color-fontcolor-4;
  margin-top: 20px;
}
.el-card {
  margin-top: 10px;
  padding: 10px;
  background-color: $l-color-bgcolor-18;
  font-size: 14px;
  font-weight: 400;

  .el-row {
    margin-bottom: 5px;
    span {
      margin-right: 5px;
    }
  }
  .drug-name2 {
    color: $l-color-fontcolor-3;
  }
  .left {
    color: $l-color-fontcolor-4;
  }
  .right {
    color: $l-color-fontcolor-5;
  }
  .right2 {
    color: $l-color-fontcolor-2;
  }
}
.result {
  font-size: 14px;

  font-weight: 400;
  color: $l-color-fontcolor-5;
  margin-top: 5px;
}
.info {
  font-size: 14px;

  font-weight: 400;
  color: $l-color-fontcolor-3;
  margin-top: 5px;
  margin-bottom: 20px;
}
.button {
  border-top: 1px solid $l-color-bgcolor-11;
  padding-top: 20px;
  .el-button {
    font-size: 14px;

    font-weight: 400;
    color: $l-color-fontcolor-3;
    width: 100%;
  }
}
</style>
