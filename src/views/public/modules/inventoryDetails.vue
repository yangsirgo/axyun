<template>
  <div class="main-box height100" v-loading="loading">
    <p class="no-data" v-show="!currentDrug.drugId">暂无数据</p>
    <div v-show="currentDrug.drugId">
      <div class="drug-name">{{currentDrug.drugName}}</div>
      <div class="spec">{{currentDrug.spec}}</div>
      <div class="spec">售价: {{currentDrug.price}}元</div>
      <l-card-title class="inv-title">
        <span slot="left">窗口盘存明细</span>
      </l-card-title>
      <div class="inv-info" v-for="(item,index) in ckList" :key="index">
        <el-row>
          <el-col :span="10">盘存{{windowShow[item.windowCode]}}</el-col>
          <el-col :span="14">录入人员：{{item.createdByName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="10">货位:{{item.locationSortNo}}</el-col>
          <el-col :span="24">
            数量：{{parseInt((item.takeStock || 0) / item.packQuantity)}}
            <span
              :val="item.drugUnit"
              code="DrugUnit"
              v-codeTransform
            ></span>
            <template v-if="(item.takeStock || 0) % item.packQuantity > 0">
              {{(item.takeStock || 0) % item.packQuantity}}
              <span
                :val="item.packUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
            </template>
          </el-col>
        </el-row>
      </div>
      <l-card-title class="inv-title">
        <span slot="left">批次盘存明细</span>
      </l-card-title>
      <div class="inv-info-box">
        <div class="inv-info" v-for="(item, index) in list" :key="index">
          <el-row>
            <el-col :span="24">批次号：{{ item.inId }}</el-col>
            <el-col :span="24">进价：{{ formatNum(item.purchasePrice) }}元</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              库存数：{{parseInt((item.drugStock || 0) / item.packQuantity)}}
              <span
                :val="item.drugUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <template v-if="(item.drugStock || 0) % item.packQuantity > 0">
                {{(item.drugStock || 0) % item.packQuantity}}
                <span
                  :val="item.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </el-col>
            <el-col :span="24">
              盘存数：{{parseInt((item.takeStock || 0) / item.packQuantity)}}
              <span
                :val="item.drugUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <template v-if="(item.takeStock || 0) % item.packQuantity > 0">
                {{(item.takeStock || 0) % item.packQuantity}}
                <span
                  :val="item.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
      <p class="inv-bottom-info">
        合计盈亏数量：
        <span>{{parseInt((currentDrug.takeStock - currentDrug.drugStock) / currentDrug.packQuantity)}}</span>
        <span :val="currentDrug.drugUnit" code="DrugUnit" v-codeTransform></span>
        <span
          v-if="(currentDrug.takeStock - currentDrug.drugStock) % currentDrug.packQuantity !== 0"
        >
          {{(currentDrug.takeStock - currentDrug.drugStock) % currentDrug.packQuantity}}
          <span
            :val="currentDrug.packUnit"
            code="DrugUnit"
            v-codeTransform
          ></span>
        </span>
      </p>
      <p class="inv-bottom-info">
        盈亏进价金额：{{
        formatNum(Math.round(currentDrug.purchasePrice * 100 * (currentDrug.takeStock - currentDrug.drugStock) /currentDrug.packQuantity)/100)
        }}元
      </p>
      <p class="inv-bottom-info">
        盈亏售价金额：{{
        formatNum(Math.round(currentDrug.price * 100*(currentDrug.takeStock - currentDrug.drugStock) / currentDrug.packQuantity)/100)
        }}元
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "inventoryDetails",
  data() {
    return {
      loading: false,
      ckList: [],
      list: [],
      windowShow: {}
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
        if (val && val.drugId) {
          this.loadData(val);
        } else {
          this.ckList = [];
          this.list = [];
        }
      }
    }
  },
  created() {
    this.getAllWindow();
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    loadData(data) {
      this.loading = true;
      stockApi
        .getTakeStockDetail({
          drugId: data.drugId,
          takeStockId: data.takeStockId
        })
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.ckList = res.data.takeStockWindowDPOList;
            this.list = res.data.takeStockBatchDPOList;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //获取所有窗口
    getAllWindow() {
      stockApi
        .getAllWindow()
        .then(res => {
          if (res.code == 1) {
            res.data.forEach(item => {
              this.windowShow[item.windowCode] = item.windowName;
            });
          } else {
            this.$message.error(res.msg || "获取窗口数据失败");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取窗口数据失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-box {
  overflow-y: auto;
}
.drug-name {
  font-size: 16px;
  font-weight: bold;
  color: rgba(46, 50, 58, 1);
  margin-bottom: 10px;
}
.spec {
  font-size: 14px;
  font-weight: 400;
  color: rgba(46, 50, 58, 1);
  margin-bottom: 10px;
}
.inv-title {
  height: 40px;
  line-height: 40px;
  /deep/ .titleleft::before {
    margin-top: 10px;
  }
}
.inv-info {
  line-height: 28px;
  font-size: 14px;
  background-color: $l-color-bgcolor-18;
  padding: 5px;
  margin-bottom: 10px;
  .el-col {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:nth-child(even) {
    background-color: $l-color-bgcolor-12;
  }
}
.inv-bottom-info {
  font-size: 14px;
  margin-top: 10px;
  &:first-child {
    margin-top: 20px;
  }
}
.no-data {
  text-align: center;
  line-height: 30px;
}
</style>
