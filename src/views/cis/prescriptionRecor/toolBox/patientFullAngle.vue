<template>
  <div class="fullAngle">
    <div class="person">
      <l-anthro-pogram :imgWidth="123" :imgHeight="173" :height="173" :weight="72" />
    </div>
    <div class="index">
      <p>
        <span>体重指数</span>
        <span>23.89 Kg/m2</span>
      </p>
      <p>
        <span>尿酸</span>
        <span>392.6 umol/L</span>
      </p>
      <p>
        <span>空腹血糖</span>
        <span>4.02 mmol/L</span>
      </p>
    </div>
    <div class="record">
      <div class="title-box">
        <l-card-title>
          <template #left>
            <div>门诊就诊记录</div>
          </template>
        </l-card-title>
      </div>
      <div class="time-box">
        <el-timeline>
          <el-timeline-item placement="top" v-for="(item, index) in list" :key="index">
            <div class="detail-title">
              <p>
                <span
                  tableName="sys_org"
                  :conditionMap="{org_type: '_DEPT_', id: item.ouptDeptId}"
                  columns="org_nm"
                  v-tableTransform
                >--</span>-
                <span>{{item.doctorName}}</span>
              </p>
            </div>
            <div class="detail-info" v-if="item.diagName">
              <p>{{item.diagName}}</p>
              <p>{{item.diagTime}}</p>
            </div>
          </el-timeline-item>
          <!-- <el-timeline-item timestamp="普外科 - 夏艳" placement="top">
            <div class="detail-info">
              <p>摔伤</p>
              <p>2019-09-10 15:22</p>
            </div>
          </el-timeline-item>-->
        </el-timeline>
        <p class="load-list-bottom">{{$t('base.noMore')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getMedicalRecord } from "@/api/cis/toolBox/toolBox.js";
import { mapGetters } from "vuex";

export default {
  name: "patientFullAngle",
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler() {
        this.loadData();
      }
    }
  },
  methods: {
    loadData() {
      if (!this.receivePatientData.patientId) {
        this.list = [];
        return;
      }
      getMedicalRecord({
        patientId: this.receivePatientData.patientId
      })
        .then(res => {
          if (res.code === 1) {
            this.list = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.fullAngle {
  width: 100%;
  // width: 287px;
  height: 100%;
  // height: 500px;
  background-color: #fff;
  .person {
    width: 130px;
    height: 173px;
    margin: 30px auto;
  }
  .index {
    width: 200px;
    text-align: center;
    padding-bottom: 20px;
    margin: 0 auto;
    border-bottom: 1px solid $l-color-bgcolor-11;
    p {
      margin-bottom: 10px;
      span:first-of-type {
        display: inline-block;
        width: 66px;
        height: 20px;
        text-align: left;
        line-height: 20px;
        color: $l-color-fontcolor-4;
      }
      span {
        color: $l-color-fontcolor-3;
      }
    }
  }
  .record {
    width: 100%;
    height: calc(100% - 343px);
    padding-left: 20px;
    .time-box {
      width: 100%;
      padding-left: 3px;
      padding-top: 5px;
      height: calc(100% - 63px);
      overflow: auto;
      .el-timeline {
        .el-timeline-item {
          /deep/ .el-timeline-item__timestamp {
            display: none;
            font-size: 16px;
            font-weight: 500;
            color: $l-color-fontcolor-3;
          }
          .detail-title {
            font-size: 16px;
            font-weight: 500;
            color: $l-color-fontcolor-3;
            margin-bottom: 8px;
          }
          .detail-info {
            width: 90%;
            padding: 10px;
            border: 1px solid $l-color-bgcolor-11;
            p {
              color: $l-color-fontcolor-3;
              font-size: 14px;
              font-weight: 400;
              line-height: 18px;
            }
            p:first-of-type {
              font-weight: 500;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
