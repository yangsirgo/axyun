<template>
  <div class="history-warehousing width100" v-loading="loading">
    <tools-head></tools-head>
    <el-button v-if="show" @click="showInfo" class="width100">历史入库明细</el-button>
    <div v-else class="width100">
      <el-card shadow="hover" v-for="(item, index) in list" :key="index">
        <div class="row-box">
          <div class="row-left">入库单号</div>
          <div class="row-data" :title="item.num">{{ item.num }}</div>
        </div>
        <div class="row-box">
          <div class="row-left">入库时间</div>
          <div class="row-data" :title="item.time">{{ item.time }}</div>
        </div>
        <div class="row-box">
          <div class="row-left">供应商</div>
          <div class="row-data">
            <span :val="item.obj" code="DrugSupplier" v-codeTransform></span>
          </div>
        </div>
        <div class="row-box">
          <div class="row-left">入库数量</div>
          <div class="row-data">
            {{ parseInt(item.quantity / item.packQuantity)
            }}
            <span
              :val="item.drugUnit"
              code="DrugUnit"
              v-codeTransform
            ></span>
            <span v-if="item.quantity % item.packQuantity !== 0">
              {{ item.quantity % item.packQuantity
              }}
              <span
                :val="item.packUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
            </span>
          </div>
        </div>
        <div class="row-box">
          <div class="row-left">入库人员</div>
          <div class="row-data">{{ item.name }}</div>
        </div>
        <div class="row-box">
          <div class="row-left">入库方式</div>
          <div class="row-data">{{ storageTypeList[item.type] || "全部" }}</div>
        </div>
        <!-- 
        <el-row>
          <el-col :span="7">
            <div>入库时间</div>
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
            <span :val="item.obj" code="DrugSupplier" v-codeTransform></span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>入库数量</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>
              {{ parseInt(item.quantity / item.packQuantity)
              }}
              <span
                :val="item.drugUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <span v-if="item.quantity % item.packQuantity !== 0">
                {{ item.quantity % item.packQuantity
                }}
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
          <el-col :span="7">
            <div>入库人员</div>
          </el-col>
          <el-col class="row-data" :span="17">
            <div>{{ item.name }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <div>入库方式</div>
          </el-col>
          <el-col class="row-data" :span="17">{{ storageTypeList[item.type] || "全部" }}</el-col>
        </el-row>-->
      </el-card>
      <div v-if="!show && !loading && list.length === 0" class="load-more width100">暂无历史入库数据</div>
    </div>
  </div>
</template>
<script>
import toolsHead from "./toolsHead";
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";

export default {
  data() {
    return {
      show: true,
      loading: false,
      list: [],
      storageTypeList: {
        "0": "直接入库",
        "1": "采购入库",
        "2": "赠送入库",
        "3": "其他入库"
      }
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
  methods: {
    showInfo() {
      this.show = false;
      this.currentDrug.drugId && this.loadData(this.currentDrug.drugId);
    },
    loadData(id) {
      this.loading = true;
      stockApi
        .getDrugInInventoryHistory(id)
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
.history-warehousing {
  padding: 10px;
  .head {
    padding-bottom: 10px;
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-3;
    border-bottom: 1px solid $l-color-bgcolor-11;
    margin-bottom: 10px;
    min-height: 27px;
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
    height: 190px;
    background: #f6f6f6;
    border-radius: 2px;
    margin-bottom: 15px;
    padding: 10px;
  }
  .load-more {
    text-align: center;
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-4;
  }
  .row-data {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 60px;
    font-size: 14px;
    
    color: $l-color-fontcolor-3;
  }
  .row-box {
    overflow: hidden;
    margin-bottom: 10px;
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-4;
    line-height: 20px;
    .row-left {
      float: left;
      width: 65px;
    }
  }
}
</style>
