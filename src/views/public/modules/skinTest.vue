<template>
  <div class="skin-box">
    <div class="drug-box" v-for="item in list" :key="item.id">
      <div class="drug-name">{{item.drugName}}</div>
      <div class="spec">
        <p>{{item.spec}}</p>
        <p>{{stShow[item.stSolutionType]}}</p>
        <p>{{item.stType}}</p>
      </div>
      <div class="skin-result">
        <p>皮试结果：{{resultShow[item.registerResult]}}</p>
        <p>皮试症状：{{item.symptomDescription}}</p>
        <p>皮试执行人：{{item.executorName}}</p>
        <p>皮试执行时间：{{item.executeTime}}</p>
      </div>
    </div>
    <p class="align-center" v-if="list.length === 0">无皮试药品</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import opha from "@/api/hmm/opha";

export default {
  name: "skinTest",
  data() {
    return {
      list: [],
      loading: false,
      resultShow: {
        1: "阳性",
        2: "阴性"
      },
      stShow: {
        "0": "原液皮试",
        "1": "皮试液皮试"
      }
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
        if (val && val.recipeCode) {
          this.loadData(val.recipeCode);
        }
      }
    }
  },
  methods: {
    loadData(code) {
      this.loading = true;
      opha
        .listForSkin({
          recipeCode: code // "Rp201910290001"
        })
        .then(res => {
          if (res.code === 1) {
            console.log(res.data, "--------------------------皮试结果------------------------------------")
            this.list = res.data;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err, "---------------------------------皮试结果错误----------------------------")
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.skin-box {
  height: 100%;
  overflow-y: auto;
}
.drug-name {
  font-size: $l-font-size-max;
  font-weight: bold;
  color: $l-color-fontcolor-3;
  margin-bottom: 5px;
}
.spec {
  font-weight: bold;
  line-height: 28px;
  font-size: $l-font-size;
  margin-bottom: 10px;
}
.skin-result {
  line-height: 30px;
  font-size: $l-font-size;
}
.align-center {
  line-height: 30px;
  text-align: center;
}
</style>