<template>
  <div v-loading="loading">
    <div v-if="currentDrug.outType === '3'">
      <div class="head width100">{{ currentDrug.deptName || '' }}</div>
      <div class="drugName">{{ currentDrug.drugName }}</div>
      <div class="spec">{{ currentDrug.spec }}</div>
      <el-row>
        <el-col :span="7">
          <div>可用库存</div>
        </el-col>
        <el-col :span="17">
          <div class="row-data">
            {{ parseInt(info.availableQuantity / info.packQuantity) }}
            <span
              :val="info.drugUnit"
              code="DrugUnit"
              v-codeTransform
            ></span>
            <span v-show="info.availableQuantity % info.packQuantity !== 0">
              {{ info.availableQuantity % info.packQuantity
              }}
              <span
                :val="info.packUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-card shadow="hover">
        <el-row>
          <el-col :span="11">
            <div>退药剩余库存</div>
          </el-col>
          <el-col :span="13">
            <div class="row-data">
              0
              <span :val="info.drugUnit" code="DrugUnit" v-codeTransform></span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <div>正常库存</div>
          </el-col>
          <el-col :span="13">
            <div class="row-data">
              <div class="row-data">
                {{ parseInt(info.availableQuantity / info.packQuantity)
                }}
                <span
                  :val="info.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <span v-show="info.availableQuantity % info.packQuantity !== 0">
                  {{ info.availableQuantity % info.packQuantity
                  }}
                  <span
                    :val="info.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-row style="margin-bottom:20px">
        <el-col :span="7">
          <div>应急库存</div>
        </el-col>
        <el-col :span="17">
          <div class="row-data">
            0
            <span :val="info.drugUnit" code="DrugUnit" v-codeTransform></span>
          </div>
        </el-col>
      </el-row>
      <div class="total">
        <el-row>
          <el-col :span="7">
            <div>总库存</div>
          </el-col>
          <el-col :span="17">
            <div class="row-data2">
              {{ parseInt(info.drugStock / info.packQuantity)
              }}
              <span
                :val="info.drugUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <span v-show="info.drugStock % info.packQuantity !== 0">
                {{ info.drugStock % info.packQuantity
                }}
                <span
                  :val="info.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="no-data" v-else>当前科室无库存数据</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";

export default {
  name: "drugStoreStock",
  data() {
    return {
      info: {
        availableQuantity: 0,
        drugEmergencyQuantity: 0,
        drugRefundQuantity: 0,
        drugStock: 0,
        packQuantity: 1
      },
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
        if (val && val.drugId) {
          this.loadData(val);
        } else {
          this.info = this.$options.data().info;
        }
      }
    }
  },
  methods: {
    loadData(data) {
      let params = {
        drugId: data.drugId
      };
      if (data.deptCode) {
        params.storageCode = data.deptCode;
      }
      this.loading = true;
      stockApi
        .getDrugStockInfo(params)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.info = { ...this.info, ...res.data };
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
    margin-bottom: 27px;
  }
}
.el-row {
  margin-bottom: 10px;
  div {
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-4;
  }
  .row-data {
    color: $l-color-fontcolor-3;
  }
  .row-data2 {
    font-weight: bold;
    color: $l-color-fontcolor-3;
  }
}
.el-card {
  padding: 10px;
  background-color: $l-color-bgcolor-18;
  margin-bottom: 20px;
}
.total {
  padding-top: 20px;
  border-top: 1px solid $l-color-bgcolor-11;
}
.no-data {
  text-align: center;
  line-height: 30px;
}
</style>
