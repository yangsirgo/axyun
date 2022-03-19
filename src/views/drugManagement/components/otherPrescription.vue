<template>
  <div class="height100">
    <div class="infinite-list-wrapper height100" style="overflow:auto">
      <ul class="list" v-infinite-scroll="loadData" infinite-scroll-disabled="disabled">
        <li v-for="(item, index) in list" :key="index" class="list-item">
          <el-card shadow="hover" class="card width100">
            <div class="show">
              <div class="left">
                <el-row class="number">{{ item.recipeCode }}</el-row>
                <el-row>
                  {{ status[item.deliveryState] }}
                  <span class="vertical-line">|</span>
                  <span class="value">{{ formatNum(item.prescriptionAmt) }}元</span>
                </el-row>
              </div>
              <div
                class="right"
                @click="shrinkHandler(item, index)"
              >{{ index === curIndex ? "收起" : "展开" }}</div>
            </div>
            <div class="no-show" v-show="index === curIndex">
              <el-row>
                <el-col :span="7">
                  <div>诊断</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.clinicDiag || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>开单科室</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.deptName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>开单医生</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.doctorUserName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>收费人员</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.chargeUserName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>收费时间</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.chargeTime || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>配方人员</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.dispenseUserName || "--" }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <div>发药人员</div>
                </el-col>
                <el-col :span="17">
                  <div class="row-data">{{ curInfo.deliveryUserName || "--" }}</div>
                </el-col>
              </el-row>
              <div class="drug-list" v-for="drug in curInfo.recipeDVOList" :key="drug.id">
                <el-row class="row-data">{{ drug.drugName }}</el-row>
                <el-row class="row-data">
                  <div style="float:left">{{ drug.spec }}</div>
                  <div style="float:right">
                    {{drug.displayQuantity}}
                    <span :val="drug.displayUnit" code="DrugUnit" v-codeTransform></span>
                  </div>
                </el-row>
              </div>
            </div>
          </el-card>
        </li>
      </ul>
      <p class="text-align-center" v-if="loading">加载中...</p>
      <p class="text-align-center" v-if="!loading && noMore">没有更多了</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import opha from "@/api/hmm/opha";
import formatNum from "@/utils/formatPrice.js";

export default {
  data() {
    return {
      list: [],
      pageParams: {
        pageNo: 0,
        total: 0,
        pageSize: 20
      },
      loading: false,
      status: {
        "0": "未发药",
        "1": "已发药"
      },
      curIndex: null,
      curInfo: {}
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["currentPre"]),
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
    currentPre: {
      immediate: true,
      deep: true,
      handler(val) {
        this.list = [];
        if (val && val.patientId && val.id) {
          this.curIndex = null;
          this.pageParams.pageNo = 0;
          this.loadData(val);
        }
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    loadData(data) {
      this.loading = true;
      this.pageParams.pageNo++;
      opha
        .list({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          patientId: data.patientId,
          notEqualToId: data.id
        })
        .then(res => {
          if (res.code === 1) {
            if (this.pageParams.pageNo === 1) {
              this.list = res.data;
            } else {
              this.list = this.list.concat(res.data);
            }
            this.pageParams = res.pageParams;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    shrinkHandler(item, index) {
      if (this.curIndex === index) {
        this.curIndex = null;
        return;
      }
      this.curIndex = index;
      this.curInfo = this.$options.data().curInfo;
      opha
        .get(item.id)
        .then(res => {
          if (res.code === 1) {
            this.curInfo = res.data;
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  position: relative;
  // height: 63px;
  padding: 10px;
  font-size: 14px;
  
  font-weight: 400;
  color: $l-color-fontcolor-4;
  margin-bottom: 20px;
  background: #f6f6f6;
  .row-data {
    
    color: $l-color-fontcolor-3;
  }
  .show {
    position: relative;
    height: 51px;
    .left {
      float: left;
      color: $l-color-fontcolor-3;
      .number {
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        margin-bottom: 7px;
      }
      .vertical-line {
        color: $l-color-bgcolor-11;
      }
      .value {
        color: $l-color-primary;
      }
    }
    .right {
      cursor: pointer;
      margin-top: 1px;
      float: right;
      color: $l-color-fontcolor-2;
    }
  }
  .no-show {
    position: relative;
    padding-top: 10px;
    border-top: 1px solid $l-color-bgcolor-11;
    .el-row {
      margin-bottom: 10px;
    }
  }
}

.text-align-center {
  text-align: center;
}
</style>
