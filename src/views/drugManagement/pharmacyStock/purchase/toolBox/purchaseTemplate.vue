<template>
  <div class="infinite-list-wrapper" v-loading="loading">
    <el-collapse
      v-model="activeNames"
      accordion
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      @change="loadDrug"
    >
      <l-collapse-item sty="2" v-for="item in list" :key="item.id" :name="item.id">
        <template #title>
          <div class="width100 tem-box">
            <div class="item-count">
              <span class="delicon">
                <i class="filter-item iconfont iconzancun" title="新增采购单" @click.stop="addPur(item)"></i>
              </span>
              <span class="delicon" style="margin-left:10px;">
                <i
                  class="filter-item iconfont iconshanchu"
                  title="删除采购模板"
                  @click.stop="delItem(item)"
                ></i>
              </span>
            </div>
            <div class="tem-name" :title="item.templateName">{{ item.templateName }}</div>
          </div>
        </template>
        <template #content>
          <div class="drug-info">
            <p>
              <span class="font-weight">供应商</span>：
              <span :val="item.supplierCode" code="DrugSupplier" v-codeTransform></span>
            </p>
            <p>
              <span class="font-weight">采购药库</span>：
              <span
                columns="STORAGE_NAME"
                :conditionMap="{ STORAGE_CODE: item.storageCode }"
                tableName="hrp_drgstrg"
                v-tableTransform
              ></span>
            </p>
          </div>
          <ul class="drug-list">
            <li v-for="(drug,idx) in drugList" :key="idx">
              <el-row>
                <el-col :span="24">
                  <div class="drug-item-info">{{drug.drugName}}</div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="drug-item-info">
                    <span class="font-weight">数量</span>
                    ：
                    {{parseInt(drug.purchaseQuantity / drug.packQuantity)}}
                    <span
                      :val="drug.drugUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                    <template v-if="drug.purchaseQuantity % drug.packQuantity !== 0">
                      <span>{{ drug.purchaseQuantity % drug.packQuantity }}</span>
                      <span :val="drug.packUnit" code="DrugUnit" v-codeTransform></span>
                    </template>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="drug-item-info">
                    <span class="font-weight">进价</span>
                    ：{{ formatNum(drug.purchasePrice) }}元
                  </div>
                </el-col>
              </el-row>
            </li>
          </ul>
        </template>
      </l-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import stockPurchaseAPI from "@/api/drugStorage/stock/purchase";
import formatNum from "@/utils/formatPrice.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "purchaseTemplate",
  data() {
    return {
      activeNames: "",
      list: [],
      drugList: [],
      pageParams: {
        pageNo: 0,
        pageSize: 30,
        total: 0
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters("drugPurchase", ["loadDrugList"]),
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  watch: {
    loadDrugList() {
      this.pageParams.pageNo = 0;
      this.load();
    }
  },
  created() {
    this.load();
  },
  methods: {
    ...mapActions({
      changeData: "drugPurchase/changeData"
    }),
    formatNum(num) {
      return formatNum(num);
    },
    load() {
      this.loading = true;
      this.pageParams.pageNo++;
      stockPurchaseAPI
        .getPurchaseTemList(this.pageParams)
        .then(res => {
          if (res.code === 1) {
            this.pageParams = res.pageParams;
            if (this.pageParams.pageNo === 1) {
              this.list = res.data;
            } else {
              this.list = this.list.concat(res.data);
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    loadDrug(data) {
      if (data) {
        this.drugList = [];
        stockPurchaseAPI.getPurchaseTemDrugList(data).then(res => {
          if (res.code === 1) {
            this.drugList = res.data.purchaseTemplateDVOList;
          }
        });
      }
    },
    addPur(data) {
      this.$showLoading();
      stockPurchaseAPI
        .getPurchaseTemDrugList(data.id)
        .then(res => {
          if (res.code === 1) {
            const list = res.data.purchaseTemplateDVOList.map(item => ({
              ...item,
              id: ""
            }));
            this.changeData({
              info: data,
              list: list
            });
          }
          this.$hideLoading();
        })
        .catch(err => {
          this.$hideLoading();
        });
    },
    delItem(data) {
      this.$confirmFunc({
        titleText: "提示",
        contentText: "此操作将永久删除该采购模板!",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stockPurchaseAPI
            .deletePurchaseTemplate(data.id)
            .then(res => {
              if (res.code === 1) {
                this.pageParams.pageNo = 0;
                this.load();
                this.$message.success(res.msg || "删除成功!");
              } else {
                this.$message.error(res.msg || "删除失败!");
              }
              this.$hideLoading();
              done();
            })
            .catch(err => {
              this.$hideLoading();
              done();
              this.$message.error(err.msg || "删除失败!");
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-collapse {
  border: none;
  .item-count {
    float: right;
    margin-right: 10px;
    font-weight: normal;
    color: $l-color-fontcolor-4;
    .el-button {
      height: 30px;
      line-height: 30px;
      padding: 0px 5px;
      vertical-align: top;
      margin-top: 5px;
    }
  }
  .collapse-item-2 {
    margin-bottom: 10px;
    /deep/ .el-collapse-item__content {
      padding: 0 10px;
      padding-bottom: 10px;
    }
  }
}

.tem-box {
  overflow: hidden;
  height: 100%;
}

.tem-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 65px;
}

.drug-item-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drug-info {
  margin-bottom: 10px;
}

.font-weight {
  font-weight: bold;
}
</style>