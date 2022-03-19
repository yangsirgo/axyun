<template>
  <div v-loading="loading">
    <tools-head></tools-head>
    <div v-if="showNo" class="nodata">当前药库暂无此药品</div>
    <div v-else>
      <el-row>
        <el-col :span="11">
          <div>可用库存</div>
        </el-col>
        <el-col :span="13">
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
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <div>应急库存</div>
        </el-col>
        <el-col :span="13">
          <div class="row-data">
            {{ parseInt(info.drugEmergencyQuantity / info.packQuantity)
            }}
            <span
              :val="info.drugUnit"
              code="DrugUnit"
              v-codeTransform
            ></span>
            <span v-show="info.drugEmergencyQuantity % info.packQuantity !== 0">
              {{ info.drugEmergencyQuantity % info.packQuantity
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
      <el-row style="margin-bottom:20px">
        <el-col :span="11">
          <div>退药锁定库存</div>
        </el-col>
        <el-col :span="13">
          <div class="row-data">
            {{ parseInt(info.drugRefundQuantity / info.packQuantity)
            }}
            <span
              :val="info.drugUnit"
              code="DrugUnit"
              v-codeTransform
            ></span>
            <span v-show="info.drugRefundQuantity % info.packQuantity !== 0">
              {{ info.drugRefundQuantity % info.packQuantity
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
      <div class="total">
        <el-row>
          <el-col :span="11">
            <div>总库存</div>
          </el-col>
          <el-col :span="13">
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
  </div>
</template>
<script>
import toolsHead from "./toolsHead";
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
      loading: false,
      showNo: false
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
        if (val.drugId) {
          this.loadData(val);
        }
      }
    }
  },
  methods: {
    loadData(data) {
      this.loading = true;
      stockApi
        .getDrugStockInfo({
          drugId: data.drugId,
          storageCode: data.storageCode
        })
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            if (res.data) {
              this.showNo = false;
              this.info = { ...this.info, ...res.data };
            } else {
              this.showNo = true;
              this.info = this.$options.data().info;
            }
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
.total {
  padding-top: 20px;
  border-top: 1px solid $l-color-bgcolor-11;
}
.nodata {
  line-height: 30px;
  text-align: center;
  font-size: 14px;
}
</style>
