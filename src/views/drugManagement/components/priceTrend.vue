<template>
  <div class="price-trend" v-loading="loading">
    <p v-if="JSON.stringify(info) === '{}'" class="no-data">暂无数据</p>
    <div v-else>
      <tools-head></tools-head>
      <el-row class="outside">
        <el-col :span="10">
          <div>当前库房售价</div>
        </el-col>
        <el-col :span="14">
          <div class="row-data2">{{ formatNum(info.currPrice) }}</div>
        </el-col>
      </el-row>
      <el-row class="outside">
        <el-col :span="10">
          <div>历史最高售价</div>
        </el-col>
        <el-col :span="14">
          <div class="row-data2">{{ formatNum(info.ceilPrice) }}</div>
        </el-col>
      </el-row>
      <el-row class="outside">
        <el-col :span="10">
          <div>历史最低售价</div>
        </el-col>
        <el-col :span="14">
          <div class="row-data2">{{ formatNum(info.floorPrice) }}</div>
        </el-col>
      </el-row>
      <el-card shadow="hover" v-for="(item, index) in info.adjustPriceDVOList" :key="index">
        <el-row>
          <el-col :span="7">
            <div>调价时间</div>
          </el-col>
          <el-col :span="17">
            <div class="row-data">{{ item.adjustPriceTime }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>调前售价</div>
          </el-col>
          <el-col :span="17">
            <div class="row-data">{{ formatNum(item.oldPrice) }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>调后售价</div>
          </el-col>
          <el-col :span="17">
            <div class="row-data3" v-if="item.newPrice > item.oldPrice">
              {{ formatNum(item.newPrice) }}
              <i class="iconfont iconshangsheng"></i>
            </div>
            <div class="row-data2" v-else-if="item.newPrice < item.oldPrice">
              {{ formatNum(item.newPrice) }}
              <i class="iconfont iconxiajiang"></i>
            </div>
            <div v-else>{{ formatNum(item.newPrice) }}</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import toolsHead from "./toolsHead";
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "priceTrend",
  components: { toolsHead },
  data() {
    return {
      info: {},
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
        if (val.drugId) {
          this.loadData(val.drugId);
        } else {
          this.info = {};
        }
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    loadData(id) {
      this.loading = true;
      stockApi
        .getDrugPriceHistory(id)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.info = res.data;
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
.price-trend {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
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
.little-title {
  font-size: 14px;
  
  font-weight: 400;
  color: $l-color-fontcolor-4;
  margin-top: 20px;
}
.el-row {
  margin-bottom: 15px;
  div {
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-4;
    height: 18px;
    line-height: 18px;
  }
  .row-data {
    color: $l-color-fontcolor-3;
  }
  .row-data2 {
    color: $l-color-fontcolor-5;
  }
  .row-data3 {
    color: $l-color-fontcolor-2;
  }
}
.outside {
  margin-top: 5px;
  margin-bottom: 0px;
}
.el-card {
  padding: 10px;
  background-color: $l-color-bgcolor-18;
  margin-top: 20px;
}
.no-data {
  text-align: center;
  font-size: 16px;
  line-height: 36px;
}
</style>
