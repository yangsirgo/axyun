<template>
  <div style="height:80%;margin-top:5px">
    <el-steps
      direction="vertical"
      :active="currentLeftItem.applyId ? +info.status : +info.status-1"
    >
      <el-step icon="iconfont icon-dianziyizhujiaohu1" v-if="currentLeftItem.applyId">
        <p class="title" slot="title">药房申请</p>
        <div slot="description">
          <el-row>
            <el-col :span="8">
              <div>申请人员</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.applyName || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>申请时间</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.applyTime || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>申请单号</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.applyNum || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>申请状态</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ applyS[info.applyStatus] || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <el-step icon="iconfont icon-dianziyizhujiaohu1">
        <p class="title" slot="title">药库出库</p>
        <div slot="description">
          <el-row>
            <el-col :span="8">
              <div>出库人员</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.outInventoryName || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>出库时间</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.outInventoryTime || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>出库单号</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.outInventoryNum || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>出库状态</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ outS[info.outInventoryStatus] || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>出库种类</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.outInventoryQty || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>采购种类</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.purchaseQty || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <el-step icon="iconfont icon-dianziyizhujiaohu1">
        <p class="title" slot="title">药房入库确认</p>
        <div slot="description">
          <el-row>
            <el-col :span="8">
              <div>确认人员</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.confirmName || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>确认时间</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.confirmTime || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <el-step icon="iconfont icon-dianziyizhujiaohu1">
        <p class="title" slot="title">流程结束</p>
        <div slot="description"></div>
      </el-step>
    </el-steps>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";

export default {
  name: "applyProcess",
  data() {
    return {
      loading: false,
      info: {
        status: "1"
      },
      applyS: {
        "0": "已保存",
        "1": "已提交",
        "2": "药库已保存",
        "3": "药库已提交"
      },
      outS: {
        "0": "已保存",
        "1": "已提交",
        "2": "已确认"
      }
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["currentLeftItem"])
  },
  watch: {
    currentLeftItem: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.id) {
          val.id && this.loadData(val.id);
        } else {
          this.info = this.$options.data().info;
        }
      }
    }
  },
  methods: {
    loadData(id) {
      this.loading = true;
      this.info = this.$options.data().info;
      stockApi
        .getDrugApplyFlow(id)
        .then(res => {
          if (res.code === 1) {
            this.info = res.data || this.$options.data().info;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-steps {
  /deep/ .el-step__icon-inner.iconfont {
    font-size: 20px !important;
  }
}
.el-step {
  .title {
    font-size: 16px;
    
    font-weight: bold;
    color: $l-color-fontcolor-3;
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
  }
  /deep/ .el-step__description {
    padding-right: 0;
  }
}
</style>
