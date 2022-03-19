<template>
  <div class="drug-batch" v-loading="loading">
    <l-card-title class="dec-title">
      <span slot="left">住院医嘱汇总批次明细</span>
    </l-card-title>
    <div class="recipe-code">汇总单号：{{ list[0] ? list[0].code : '--' }}</div>
    <el-row :gutter="5" class="title-head">
      <el-col :span="12">生产批号</el-col>
      <el-col :span="6">进价</el-col>
      <el-col :span="6">数量</el-col>
    </el-row>
    <div class="drug-list">
      <div class="drug-item" v-for="item in list" :key="item.drugId">
        <div class="drug-name">{{ item.drugName }}</div>
        <div class="spec">{{ item.spec }}</div>
        <div class="batch-list" v-for="(batch,index) in item.batchVOList" :key="index">
          <el-row :gutter="5">
            <el-col :span="12">{{ batch.batchNum }}</el-col>
            <el-col :span="6">{{ formatNum(batch.purchasePrice) }}</el-col>
            <el-col :span="6">
              {{ parseInt(batch.drugQuantity / batch.packQuantity) }}
              <span
                :val="batch.drugUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <template v-if="batch.drugQuantity % batch.packQuantity !== 0">
                {{ batch.drugQuantity % batch.packQuantity }}
                <span
                  :val="batch.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
      <p class="flag" v-if="list.length === 0">暂无数据</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import opha from "@/api/hmm/opha";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "drugBatch",
  data() {
    return {
      loading: false,
      list: []
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["orderList"])
  },
  watch: {
    orderList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          let list = val.map(item => item.id);
          this.loadData(list);
        } else {
          this.list = [];
        }
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    loadData(code) {
      this.loading = true;
      opha
        .getByDetailId(code)
        .then(res => {
          if (res.code === 1) {
            this.list = res.data;
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
.drug-batch {
  font-size: $l-font-size;
}
.dec-title {
  height: 35px;
  line-height: 35px;
  margin-bottom: 5px;
  /deep/ .titleleft::before {
    margin-top: 8px;
  }
}
.recipe-code {
  line-height: 30px;
  margin-bottom: 5px;
}
.title-head {
  line-height: 30px;
  padding: 0 5px;
  background-color: $l-color-bgcolor-12;
}
.drug-list {
  .drug-item {
    padding: 5px;
    line-height: 24px;
    &:nth-child(even) {
      background-color: $l-color-bgcolor-12;
    }
  }
}
.flag {
  text-align: center;
  line-height: 30px;
}
</style>