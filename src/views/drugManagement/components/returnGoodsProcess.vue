<template>
  <div v-loading="loading">
    <el-steps style="height: 85%;" direction="vertical" :active="+info.status">
      <el-step icon="iconfont icon-dianziyizhujiaohu">
        <p class="title" slot="title">药房退货申请</p>
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
              <div class="row-data">{{ applyStatus[info.applyStatus] || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <el-step icon="iconfont icon-dianziyizhujiaohu">
        <p class="title" slot="title">药库处理申请</p>
        <div slot="description">
          <el-row>
            <el-col :span="8">
              <div>处理人员</div>
            </el-col>
            <el-col :span="16">
              <div class="row-data">{{ info.outInventoryName || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>处理时间</div>
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
              <div class="row-data">{{ outStatus[info.outInventoryStatus] || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <div>拒绝药品种类</div>
            </el-col>
            <el-col :span="11">
              <div class="row-data">{{ info.qty1 || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <div>退回药库种类</div>
            </el-col>
            <el-col :span="11">
              <div class="row-data">{{ info.qty2 || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <div>退回供应商种类</div>
            </el-col>
            <el-col :span="11">
              <div class="row-data">{{ info.qty3 || "--" }}</div>
            </el-col>
          </el-row>
        </div>
      </el-step>
      <!--  <el-step icon="iconfont icon-dianziyizhujiaohu">
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
      </el-step>-->
      <el-step icon="iconfont icon-dianziyizhujiaohu">
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
  name: "returnGoodsProcess",
  data() {
    return {
      loading: false,
      info: {
        status: "1",
        applyName: "",
        applyTime: "",
        applyNum: "",
        applyStatus: "",
        outInventoryName: "",
        outInventoryTime: "",
        outInventoryNum: "",
        outInventoryStatus: "",
        qty1: "",
        qty2: "",
        qty3: "",
        confirmName: "",
        confirmTime: ""
      },
      applyStatus: {
        "0": "未提交",
        "1": "已提交",
        "2": "药库已保存",
        "3": "药库已提交"
      },
      outStatus: {
        "0": "未提交",
        "1": "已提交",
        "2": "目标库房已确认"
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
        if (val && val.applyId) {
          this.loadData(val.applyId);
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
        .getDrugReturnFlow(id) // 2c9180866ea54952016ea55362750008
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
  /deep/ .el-step__head.is-process {
    color: $l-color-border-7;
  }
}
</style>
