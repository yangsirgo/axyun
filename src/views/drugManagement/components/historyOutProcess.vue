<template>
  <div v-loading="loading">
    <tools-head></tools-head>
    <el-button v-if="show" @click="showInfo" class="width100"
      >历史出库情况</el-button
    >
    <div v-else class="width100">
      <el-card shadow="hover" v-for="(item, index) in list" :key="index">
        <el-row class="date">{{ item.date }}</el-row>
        <el-row>
          <el-col :span="8">
            <div>出库数量</div>
          </el-col>
          <el-col :span="16">
            <div class="row-data">
              {{ parseInt(item.outQuantity / item.packQuantity) }}
              <span :val="item.drugUnit" code="DrugUnit" v-codeTransform></span>
              <span v-if="item.outQuantity % item.packQuantity !== 0">
                {{ item.outQuantity % item.packQuantity }}
                <span
                  :val="item.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>退回数量</div>
          </el-col>
          <el-col :span="16">
            <div class="row-data">
              {{ parseInt(item.backQuantity / item.packQuantity) }}
              <span :val="item.drugUnit" code="DrugUnit" v-codeTransform></span>
              <span v-if="item.backQuantity % item.packQuantity !== 0">
                {{ item.backQuantity % item.packQuantity }}
                <span
                  :val="item.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>报废数量</div>
          </el-col>
          <el-col :span="16">
            <div class="row-data">
              {{ parseInt(item.scrapQuantity / item.packQuantity) }}
              <span :val="item.drugUnit" code="DrugUnit" v-codeTransform></span>
              <span v-if="item.scrapQuantity % item.packQuantity !== 0">
                {{ item.scrapQuantity % item.packQuantity }}
                <span
                  :val="item.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <div
        v-if="!show && !loading && list.length === 0"
        class="load-more width100"
      >
        暂无历史出库情况数据
      </div>
    </div>
  </div>
</template>
<script>
import toolsHead from "./toolsHead";
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";

export default {
  components: { toolsHead },
  data() {
    return {
      show: true,
      loading: false,
      list: []
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
        this.show = true;
      }
    }
  },
  methods: {
    showInfo() {
      this.show = false;
      this.currentDrug.drugId && this.loadData(this.currentDrug.drugId);
    },
    loadData(id) {
      this.loading = true;
      stockApi
        .getDrugOutStorageHistory(id)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.list = res.data;
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
.head {
  padding-bottom: 10px;
  font-size: 14px;
  
  font-weight: 400;
  color: $l-color-fontcolor-3;
  border-bottom: 1px solid $l-color-bgcolor-11;
  margin-bottom: 10px;
}
.drug-info {
  font-size: 14px;
  
  font-weight: 400;
  color: $l-color-fontcolor-3;
  .drug-name {
    font-size: 16px;
    font-weight: bold;
    color: $l-color-fontcolor-3;
    margin-bottom: 5px;
  }
  .spec {
    color: $l-color-fontcolor-3;
    margin-bottom: 20px;
  }
}

.el-card {
  padding: 10px;
  background-color: $l-color-bgcolor-18;
  margin-bottom: 20px;
  .el-row {
    margin-bottom: 15px;
    div {
      font-size: 14px;
      
      font-weight: 400;
      color: $l-color-fontcolor-4;
    }
    .row-data {
      color: $l-color-fontcolor-3;
    }
  }
  .date {
    font-size: 14px;
    
    font-weight: bold;
    color: $l-color-fontcolor-3;
  }
}
.load-more {
  text-align: center;
  font-size: 14px;
  
  font-weight: 400;
  color: $l-color-fontcolor-4;
}
</style>
