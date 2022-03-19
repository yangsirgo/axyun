<template>
  <div class="history-out-stock width100" v-loading="loading">
    <tools-head></tools-head>
    <el-button v-if="show" @click="showInfo" class="width100">历史出库明细</el-button>
    <div v-else class="width100">
      <el-card shadow="hover" v-for="(item, index) in list" :key="index">
        <el-row>
          <el-col :span="7">
            <div>出库单号</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>{{ item.num }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>出库时间</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>{{ item.time }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>供应商</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>
              <span :val="item.obj" code="Manufacturer" v-codeTransform></span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>出库数量</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>
              {{item.outfit}}
              <span :val="item.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="item.bluk !== 0">
                {{item.bluk}}
                <span :val="item.packUnit" code="DrugUnit" v-codeTransform></span>
              </template>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>出库人员</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>{{ item.name }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>出库方式</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>{{ wayShowObj[item.type] }}</div>
          </el-col>
        </el-row>
      </el-card>
      <div v-if="!show && !loading && list.length === 0" class="load-more width100">暂无历史出库明细数据</div>
    </div>
  </div>
</template>
<script>
import toolsHead from "./toolsHead";
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";
import hmmBaseApi from "@/api/hmm/base";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";

export default {
  name: "historyOutStock",
  data() {
    return {
      show: true,
      loading: false,
      list: [],
      wayShowObj: {}
    };
  },
  components: { toolsHead },
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
  created() {
    this.getWayShow();
  },
  methods: {
    showInfo() {
      this.show = false;
      this.currentDrug.drugId && this.loadData(this.currentDrug.drugId);
    },
    loadData(id) {
      this.loading = true;
      stockApi
        .getDrugOutInventoryHistory(id)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            let list = res.data.map(item => {
              let { out, bl } = blukToOutfit(
                item.quantity,
                item.packQuantity
              );
              return {
                ...item,
                outfit: out,
                bluk: bl
              };
            });

            this.list = list;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getWayShow() {
      hmmBaseApi.getlistForDropDown().then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            for (let i in item) {
              this.wayShowObj[i] = item[i];
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.history-out-stock {
  padding: 10px;
  position: relative;
  .head {
    padding-bottom: 10px;
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-3;
    border-bottom: 1px solid $l-color-bgcolor-11;
    margin-bottom: 10px;
  }
  .drugName {
    font-size: 16px;
    
    font-weight: bold;
    color: $l-color-fontcolor-3;
    margin-bottom: 10px;
  }
  .spec {
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-3;
    margin-bottom: 20px;
  }
  .el-button {
    height: 36px;
    background: #f6f6f6;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;

    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-3;
    margin-bottom: 20px;
  }
  .el-card {
    min-height: 190px;
    background: #f6f6f6;
    border-radius: 2px;
    margin-bottom: 10px;
    padding: 10px;
    .el-row {
      margin-bottom: 10px;
      font-size: 14px;
      
      font-weight: 400;
      color: $l-color-fontcolor-4;
      line-height: 20px;
      .row-data {
        font-size: 14px;
        
        color: $l-color-fontcolor-3;
      }
    }
  }
  .load-more {
    text-align: center;
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-4;
  }
}
</style>
