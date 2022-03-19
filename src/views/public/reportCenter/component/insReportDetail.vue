<template>
  <div class="report-cont">
    <el-tabs class="report-cont-tabs" v-model="activeName">
      <el-tab-pane label="报告" name="first">
        <div class="report-card" v-loading="tlm_isLoading">
          <h4>天津第三医院</h4>
          <h5>CT诊断报告单</h5>
          <div class="report-patient-itemdata">
            <table>
              <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
              <tr>
                <td width="66px">姓名</td>
                <td>
                  <span v-text="receivePatientData.patientName || '--'"></span>
                </td>
                <td width="66px">性别</td>
                <td>
                  <span
                    code="GENDER_CODE"
                    :val="receivePatientData.patientGender"
                    v-codeTransform
                  >--</span>
                </td>
                <td width="66px">年龄</td>
                <td>
                  <span v-if="receivePatientData.age">
                    {{
                    receivePatientData.age + "岁"
                    }}
                  </span>
                  <span v-else-if="receivePatientData.patientAge">
                    {{
                    receivePatientData.patientAge
                    }}
                  </span>
                  <span v-else>--</span>
                </td>
                <td width="66px">影像号</td>
                <td>
                  <span v-text="itemdata.studyUid || '--'"></span>
                </td>
                <td width="66px">科室</td>
                <td>
                  <span>{{itemdata.examDeptName || '--'}}</span>
                </td>
              </tr>
              <tr>
                <template v-if="receivePatientData.visitCode">
                  <td>门诊号</td>
                  <td>
                    <span v-text="receivePatientData.visitCode || '--'"></span>
                  </td>
                </template>
                <template v-else-if="receivePatientData.inpCode || '--'">
                  <td>住院号</td>
                  <td>
                    <span v-text="receivePatientData.inpCode || '--'"></span>
                  </td>
                  <td>床号</td>
                  <td>
                    <span v-text="receivePatientData.bedCode || '--'"></span>
                  </td>
                </template>
                <td>检查类型</td>
                <td>
                  <span v-text="itemdata.examClassName || '--'"></span>
                </td>
                <td>检查时间</td>
                <td>
                  <span v-text="itemdata.examDate || '--'"></span>
                </td>
                <td>检查部位</td>
                <td>
                  <span v-text="itemdata.checkpoint || '--'"></span>
                </td>
              </tr>
            </table>
          </div>
          <div class="report-patient-dia">
            <div class="rpd-title">影像表现</div>
            <p>{{ itemdata.examDescription }}</p>
            <div class="rpd-title">影像诊断</div>
            <p v-if="itemdata.examResult">{{itemdata.examResult}}</p>
            <p v-else>--</p>
          </div>
          <div class="report-patient-bottom">
            <div class="report-patient-itemdata">
              <el-row>
                <el-col :span="5">
                  <span>报告医师</span>
                  {{ itemdata.reporterName || "--" }}
                </el-col>
                <el-col :span="5">
                  <span>审核医师</span>
                  {{ itemdata.auditorName || "--" }}
                </el-col>
                <el-col :span="14">
                  <span>报告时间</span>
                  {{ itemdata.reportDate || "--" }}
                </el-col>
              </el-row>
            </div>
            <div class="report-caveat">
              注意：本报告经医师亲笔签名有效
              <div class="float-right">本报告仅供医师参考，不做证明之用</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图像" name="second">
        <div class="report-image">
          <div class="report-image-itemdata">
            <table>
              <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
              <tr>
                <td class="bg-td">影像号</td>
                <td>
                  <span v-text="itemdata.studyUid || '--'"></span>
                </td>
                <td class="bg-td">申请医师</td>
                <td>
                  <span v-text="itemdata.applyDoctorName || '--'"></span>
                </td>
                <td class="bg-td">申请科室</td>
                <td>
                  <span v-text="itemdata.deptName || '--'"></span>
                </td>
                <td class="bg-td">申请时间</td>
                <td>
                  <span v-text="itemdata.applyDate || '--'"></span>
                </td>
              </tr>
              <tr>
                <td class="bg-td">病人</td>
                <td>
                  <span v-text="receivePatientData.patientName || '--'"></span>
                </td>
                <td class="bg-td">检查类型</td>
                <td>
                  <span v-text="itemdata.examClassName || '--'"></span>
                </td>
                <td class="bg-td">检查部位</td>
                <td>
                  <span v-text="itemdata.checkpoint || '--'"></span>
                </td>
                <td class="bg-td">检查时间</td>
                <td>
                  <span v-text="itemdata.examDate || '--'"></span>
                </td>
              </tr>
              <tr>
                <td class="bg-td">影像表现</td>
                <td colspan="7">
                  <span v-text="itemdata.examDescription"></span>
                </td>
              </tr>
              <tr>
                <td class="bg-td">影像诊断</td>
                <td colspan="7">
                  <p>{{ itemdata.examResult}}</p>
                </td>
              </tr>
            </table>
          </div>
          <div class="report-image-doctor">
            <div class="report-patient-itemdata">
              <el-row>
                <el-col :span="12">
                  <span>检验医师</span>
                  {{ itemdata.examDoctorName || "--" }}
                </el-col>
                <el-col :span="12">
                  <span>审核医师</span>
                  {{ itemdata.auditorName || "--" }}
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="report-image-title">影像资料</div>
          <div class="report-image-box">
            <img v-show="receivePatientData.patientName" :src="require('@/assets/'+ paths)" alt=""/>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getExamData } from "@/api/reportCenter/report.js";

export default {
  props: {
    itemdata: [String, Object]
  },

  data() {
    return {
      paths: "report_ct.png",
      activeName: "first",
      tlm_isLoading: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    // 报告详细信息(报告编号、申请人、检验者的信息)
    infoData() {
      return this.itemdata;
    },
    publishId() {
      return this.itemdata.examPublishId;
    },
    patientNo() {
      return this.$attrs.patien;
    }
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('天津第三医院', val)
        this.itemdata = {};
        this.paths = "report_ct.png";
        if (val.patientName) {
          // this.imgPath = require("@/assets/report_ct.png");
        }
      }
    },
    itemdata: {
      immediate: true,
      deep: true,
      handler(val) {
        this.paths = "report_ct.png";
        if (val.imageAddress) {
          this.paths = val.imageAddress;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.report-cont {
  position: relative;
  height: 100%;
  padding: 20px;
  padding-top: 5px;

  .report-cont-tabs {
    height: 100%;

    /deep/ .el-tabs__content {
      height: calc(100% - 55px);
      padding-right: 20px;
      margin-right: -20px;
      overflow: hidden;
      overflow-y: auto;
    }
  }

  .report-card {
    position: relative;
    height: 100%;
    padding: 20px;
    border: 1px solid $l-color-bgcolor-11;
    color: $l-color-fontcolor-3;

    h4,
    h5 {
      text-align: center;
      margin: 0;
    }

    h4 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    h5 {
      font-size: 18px;
      margin-bottom: 20px;
    }
  }

  .report-patient-itemdata {
    padding: 10px 0;
    margin-bottom: 10px;
    border-top: 1px solid $l-color-bgcolor-11;
    border-bottom: 1px solid $l-color-bgcolor-11;

    table {
      width: 100%;
    }

    td,
    .el-col {
      line-height: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span {
      display: inline-block;
      margin-right: 10px;
      color: $l-color-fontcolor-4;
    }

    em {
      font-style: normal;
    }
  }

  .report-patient-bottom {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .report-patient-dia {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 189px;
    bottom: 148px;
    overflow: hidden;
    overflow-y: auto;

    p {
      line-height: 20px;
    }
  }

  .rpd-title {
    line-height: 30px;
    font-size: $l-font-size;
    font-weight: bold;
  }

  .report-caveat {
    padding-top: 10px;
    overflow: hidden;
  }

  .rpi-zw {
    display: inline-block;
    width: 10px;
  }

  .report-image-itemdata {
    table {
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;

      td {
        line-height: 20px;
        padding: 10px;
        border: 1px solid $l-color-bgcolor-11;
        word-break: break-all;
      }

      .bg-td {
        min-width: 86px;
        width: 86px;
        max-width: 86px;
        background-color: $l-color-bgcolor-18;
      }
    }
  }

  .report-image-doctor {
    .report-patient-itemdata {
      border-top: 0;
    }
  }

  .report-image-title {
    margin-bottom: 10px;
    color: $l-color-fontcolor-4;
  }

  .report-image-box {
    img {
      width: 100%;
    }
  }
}

/deep/ .el-tabs__item {
  padding: 0 15px;
}
</style>
