<template>
  <div class="refund">
    <div class="patient-box">
      <l-card-title>
        <template #left>
          <div class="overflow-point">
            <!-- <span class="outpatientNum">0000801354</span> -->
            <span>{{ patientInfo.patientName }}</span>
          </div>
        </template>
      </l-card-title>
    </div>

    <div class="info-box">
      <p class="info-title">退费进度</p>
      <!-- <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column
          prop="chargeItemName"
          align="left"
          label="项目"
          show-overflow-tooltip
          class="overflow-point"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="refundQuantity"
          align="right"
          show-overflow-tooltip
          header-align="center"
          label="申请数量"
          width="100"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.refundQuantity }}
              <span
                v-if="chargeData.orderSource === '1'"
                :val="scope.row.chargeUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
              <span v-else>{{scope.row.chargeUnit }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>-->
      <el-steps direction="vertical" :active="progressList.length" v-loading="loading">
        <el-step
          :icon="`iconfont ${['1','3','4','5'].includes(item.refundStepStatus) ? 'icon-dianziyizhujiaohu' : 'icon-dianziyizhujiaohu1'}`"
          v-for="(item, index) in progressList"
          :key="index"
        >
          <p slot="title">
            {{item.refundStepName}}
            <span
              v-if="item.refundStepStatusName"
            >（{{item.refundStepStatusName}}）</span>
          </p>
          <div style="padding-bottom:10px;" slot="description">
            <p>
              <span class="date">{{ item.operatorName }}</span>
            </p>
            <p>
              <span class="date">{{ item.operateTime }}</span>
            </p>
          </div>
        </el-step>
        <!-- <el-step icon="iconfont icon-dianziyizhujiaohu1">
          <p slot="title">
            医生审核
            <span v-if="progress <2">（进行中）</span>
            <span v-if="this.status == '1' && progress >=2">（已通过）</span>
            <span v-if="this.status == '2' && progress >=2">（未通过）</span>
          </p>
          <div slot="description"></div>
        </el-step>
        <el-step icon="iconfont icon-dianziyizhujiaohu1">
          <p slot="title">
            退还药品
            <span v-if="progress <3">（待完成）</span>
            <span v-if="progress >=3">（已完成）</span>
          </p>
          <div slot="description"></div>
        </el-step>
        <el-step icon="iconfont icon-dianziyizhujiaohu1">
          <p slot="title">
            退费完成
            <span v-if="progress != 4">（待完成）</span>
            <span v-if="progress == 4">（已完成）</span>
          </p>
          <div slot="description"></div>
        </el-step>-->
      </el-steps>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import service from "@/api/cis/settleAccount/index.js";

export default {
  name: "refund",
  data() {
    return {
      patientInfo: {
        patientName: ""
      },
      tableData: [],
      applyData: {}, // 申请单对象
      progress: 1, // 进度
      status: "0", //状态
      progressList: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["chargeData"])
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        // 监听 患者 ID 变化 触发事件 reload table 数据
        this.patientInfo = val;
      },
      immediate: true,
      deep: true
    },
    chargeData: {
      handler(val) {
        if (val && val.refundApplyOrderChargeDetailId) {
          this.getProgress(val.refundApplyOrderChargeDetailId);
        } else {
          this.progressList = [];
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getProgress(val) {
      this.loading = true;
      this.progressList = [];
      service
        .getRefundStepInfo(val)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.progressList = res.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
    /* getProgress(val) {
      if (val.applyRecordStatus == "0") {
        this.progress = 1;
      }
      switch (val.applyRecordStatus) {
        case "0":
          this.progress = 1;
          break;
        case "1":
          this.progress = 2;
          this.status = "1";
          break;
        case "2":
          this.progress = 2;
          this.status = "2";
          break;
        case "3":
          this.progress = 3;
          this.status = "1";
          break;
        case "4":
          this.progress = 4;
          this.status = "1";
          break;
      }
      console.info(this.progress);
      console.info(this.status);
    } */
  }
};
</script>
<style lang='scss' scoped>
.refund {
  width: 100%;
  height: 100%;
  // width: 287px;
  // height: 500px;
  background-color: #fff;
  padding: 0px;
  .patient-box {
    width: 100%;
    height: 64px;
    padding-left: 20px;
    border-bottom: 1px solid $l-color-bgcolor-11;
    span {
      font-size: 18px;
      line-height: 23px;
      font-weight: $l-font-weight;
      color: $l-color-fontcolor-3;
    }
    .outpatientNum {
      color: $l-color-fontcolor-2;
      margin-right: 8px;
    }
  }
  .info-box {
    width: 100%;
    height: calc(100% - 63px);
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px 10px 0;
    .info-title {
      font-size: $l-font-size;
      font-weight: $l-font-weight;
      line-height: 20px;
      margin-bottom: 10px;
    }
    .el-steps {
      height: 50%;
      padding: 20px 0;
      /deep/ .el-step__icon-inner.iconfont {
        font-size: 20px !important;
      }
    }
    .el-step {
      p {
        font-size: $l-font-size-max;
        line-height: 24px;
        font-weight: 500;
        color: $l-color-fontcolor-3;
        span {
          font-size: 14px;
          line-height: 20px;
          color: $l-color-primary;
        }
      }
      div {
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
        color: $l-color-fontcolor-3;
        .date {
          line-height: 18px;
          font-weight: 400;
          color: $l-color-fontcolor-4;
        }
      }
    }
  }
}
</style>
