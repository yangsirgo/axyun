<template>
  <div class="infusion-main width100 height100">
    <div class="treatment-box" v-loading="loading">
      <div class="treatment-item" v-for="(item, index) in list" :key="index">
        <el-row class="treatment-item-title">
          <div class="ti-info">
            <span>医嘱名称</span>
            <em>{{ item.itemName || "--" }}</em>
          </div>
          <div class="ti-info">
            <span>项目名称</span>
            <em>{{ item.itemChargeName || "--" }}</em>
          </div>
        </el-row>
        <el-row>
          <div class="ti-info">
            <span>门诊号</span>
            <em>{{ item.visitCode || "--" }}</em>
          </div>
          <div class="ti-info">
            <span>就诊科室</span>
            <em>{{ item.deptName || "--" }}</em>
          </div>
          <div class="ti-info">
            <span>就诊医生</span>
            <em>{{ item.createdByName || "--" }}</em>
          </div>
          <div class="ti-info">
            <span>状态</span>
            <em>{{ status[item.listStatus] || "--" }}</em>
          </div>
          <div class="ti-info">
            <span>备注</span>
            <em>{{ item.remark || "--" }}</em>
          </div>
        </el-row>
        <el-steps :active="item.listStatus" finish-status="success">
          <el-step title="治疗申请" icon="filter-item iconfont icon-dianziyizhujiaohu1">
            <template slot="description" v-if="item.createdByName">
              <p>申请人员 {{ item.createdByName }}</p>
              <p>申请日期 {{ item.createTime }}</p>
            </template>
          </el-step>
          <el-step title="缴费" icon="filter-item iconfont icon-dianziyizhujiaohu1">
            <template slot="description" v-if="item.chargeUserName">
              <p>收费人员：{{ item.chargeUserName }}</p>
              <p>收费日期：{{ item.chargeTime }}</p>
            </template>
          </el-step>
          <el-step title="医疗执行" icon="filter-item iconfont icon-dianziyizhujiaohu1">
            <template slot="description" v-if="item.execDoctorName">
              <p>执行人员 {{ item.execDoctorName }}</p>
              <p>执行日期 {{ item.execTime }}</p>
            </template>
          </el-step>
          <el-step title="结束" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>
        </el-steps>
        <div class="handler-box">
          <el-button
            type="primary"
            v-show="item.listStatus !== 4"
            :disabled="item.listStatus !== 2"
            @click="execute(item.examApplyId)"
          >确认执行</el-button>
          <el-button type="primary" v-show="item.listStatus === 4" disabled>
            {{
            item.status === 6 ? "已取消" : "已执行"
            }}
          </el-button>
        </div>
      </div>
      <p class="align-center" v-if="!loading && list.length === 0">暂无数据</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getApplyListUsing, examApply } from "@/api/cis/treatment/infusion.js";

export default {
  data() {
    return {
      status: {
        1: "已申请",
        2: "已缴费",
        3: "已执行",
        4: "已结束"
      },
      list: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("user", ["role"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.loadData();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadData() {
      this.list = [];
      if (!this.receivePatientData.patientId) {
        return;
      }
      this.loading = true;
      getApplyListUsing({
        patientId: this.receivePatientData.patientId
      })
        .then(res => {
          if (res.code === 1) {
            // status 申请状态(暂存 = 0,已提交 = 1,已审核 = 2,已执行 = 3,退回 = 4,已预约 = 5,
            // 取消预约 = 6,已登记 = 8,已检查 = 9,已出报告 = 10,医技科室取消 = 11,作废 = 99)
            // 确认执行后就就表示已结束
            // chargeStatus 费用状态(未收费 = 1,已计费 = 2, 已收费 = 3) 已收费表示已缴费

            // 已申请
            const apply = [1, 2];
            const newList = res.data.map(item => {
              let status;
              if (apply.includes(item.status)) {
                if (item.chargeStatus === 3) {
                  status = 2;
                } else {
                  status = 1;
                }
              } else if (item.status !== 0) {
                status = 4;
              }
              return {
                ...item,
                listStatus: status
              };
            });
            this.list = newList;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    execute(id) {
      this.loading = true;
      examApply(id)
        .then(res => {
          if (res.code === 1) {
            this.loadData();
            this.$message({
              type: "success",
              message: "执行成功"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg || "执行失败"
            });
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            type: "error",
            message: err || "执行失败"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.treatment-box {
  height: 100%;
  padding: 20px;
  padding-bottom: 0;
  overflow-y: auto;
}
.infusion-main {
  background-color: #fafafa;
}
.treatment-item {
  padding: 20px;
  padding-top: 10px;
  margin-bottom: 20px;
  background-color: #f2f2f2;
  .el-col {
    margin-bottom: 10px;
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-step__description {
    font-size: $l-font-size;
  }
  span {
    display: inline-block;
    width: 68px;
    color: $l-color-fontcolor-4;
  }
  em {
    color: $l-color-fontcolor-3;
    font-style: normal;
  }
}

.treatment-item-title {
  line-height: 30px;
  border-bottom: 1px solid $l-color-bgcolor-11;
  padding-bottom: 5px;
  margin-bottom: 20px;
  em {
    font-weight: bold;
  }
}
.handler-box {
  text-align: right;
}
/deep/ .el-step__icon {
  width: 16px;
  background: #f2f2f2;
}
.el-steps {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
}

/deep/ .el-step__head.is-success {
  border-color: $l-color-primary;

  .el-step__line {
    background-color: $l-color-primary;
  }

  .el-step__icon-inner.is-status {
    background-color: $l-color-primary;
    border-radius: 12px;
    padding: 2px;
    color: $l-color-white;
  }
}

/deep/ .el-step__title {
  color: $l-color-fontcolor-3;
  font-size: $l-font-size;
}

/deep/ .el-step__description {
  color: $l-color-fontcolor-4;
  font-size: $l-font-size;
}

/deep/ .el-step__head.is-process {
  color: $l-color-primary;
}
.ti-info {
  display: inline-block;
  margin-right: 40px;
  span {
    width: auto;
    margin-right: 5px;
  }
}
.align-center {
  text-align: center;
  padding: 5px 0;
}
</style>
