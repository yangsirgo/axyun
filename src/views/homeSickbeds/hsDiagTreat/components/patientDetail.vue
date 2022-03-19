<template>
  <div class="patient-detail">
    <div class="patient-card-left">
      <div class="pic-box"></div>
      <div class="patient-card-left-info">
        <div class="patient-card-left-top">
          <div class="p-name" @click="editArchives" v-if="isArchiveShow()">
            {{ patientItem[0].patientArchiveInfoVO.patientName || "-" }}
          </div>
          <div
            class="p-ge"
            @click="goHealthFile()"
            v-if="thirdData.recordPerfection"
          >
            个
          </div>
          <div
            class="p-old"
            @click="pushPathDialog('老年人档案')"
            v-if="thirdData.oldFlag === 1"
          >
            老
          </div>
          <div
            class="p-high"
            @click="pushPathDialog('高血压专案')"
            v-if="thirdData.hypertensionFlag === 1"
          >
            高
          </div>
          <div
            class="p-sweet"
            @click="pushPathDialog('糖尿病专案')"
            v-if="thirdData.diabetesFlag === 1"
          >
            糖
          </div>
          <div
            class="p-check"
            @click="pushPathDialog('签约详情')"
            v-if="thirdData.signFlag === 1"
          >
            签
          </div>
        </div>
        <div class="patient-card-left-top p-gender-age" v-if="isArchiveShow()">
          <span>(</span>
          <div
            v-if="
              isArchiveShow() &&
                patientItem[0].patientArchiveInfoVO.patientGender !== '' &&
                patientItem[0].patientArchiveInfoVO.patientGender !== undefined
            "
            :val="patientItem[0].patientArchiveInfoVO.patientGender"
            code="GENDER_CODE"
            v-codeTransform
          ></div>
          <span>/</span>
          <div v-if="isArchiveShow()">
            {{ patientItem[0].patientArchiveInfoVO.patientAge || "-" }}
          </div>
          <span>)</span>
        </div>
      </div>
    </div>
    <div class="patient-card-rights">
      <div class="patient-info">
        <div class="patient-info-cont">
          <div class="overflow-hidden margin-bottom-1">
            医生/护士<span class="patient-info-detail">
              {{
                patientData.doctorName || patientData.manageDoctorName || "-"
              }}/{{ patientData.nurseName || "-" }}
            </span>
          </div>
          <div class="overflow-hidden">
            <template
              v-if="patientData && patientData.hasOwnProperty('settlementType')"
              >结算类型
              <span
                class="patient-info-detail"
                :val="patientData.settlementType"
                code="settlementType"
                v-codeTransform
              >
              </span>
            </template>
            <template
              v-else-if="
                isArchiveShow() &&
                  patientItem[0].patientArchiveInfoVO.settlementType !== '' &&
                  patientItem[0].patientArchiveInfoVO.settlementType !==
                    undefined
              "
              >档案结算类型
              <span
                class="patient-info-detail"
                :val="patientItem[0].patientArchiveInfoVO.settlementType"
                code="settlementType"
                v-codeTransform
              ></span>
            </template>
            <template v-else
              >档案结算类型<span class="patient-info-detail">-</span></template
            >
          </div>
        </div>
        <div class="patient-info-cont">
          <div class="overflow-hidden margin-bottom-1">
            建床周期<span class="patient-info-detail">
              {{ patientData.predictTreatStartTime || "-" }} ~
              {{ patientData.predictTreatEndTime || "-" }}
              <span
                v-if="
                  patientData.predictTreatStartTime &&
                  patientData.predictTreatEndTime
                "
                :style="
                  `font-size:14px;color:${
                    getDays(
                      patientData.predictTreatStartTime || '',
                      patientData.predictTreatEndTime || ''
                    ) >= 0
                      ? '#4F80FF'
                      : '#EF0F0F'
                  }`
                "
              >
                （{{
                  getDays(
                    patientData.predictTreatStartTime || "",
                    patientData.predictTreatEndTime || ""
                  ) >= 0
                    ? "余" +
                      getDays(
                        patientData.predictTreatStartTime || "",
                        patientData.predictTreatEndTime || ""
                      )
                    : "超" +
                      Math.abs(
                        getDays(
                          patientData.predictTreatStartTime || "",
                          patientData.predictTreatEndTime || ""
                        )
                      )
                }}
                天）
              </span>
            </span>
          </div>
          <div class="overflow-hidden">
            余额/预交
            <span class="patient-info-detail" style="color: #ef0f0f"
              >{{
                patientData.prepayBalance
                  ? patientData.prepayBalance.toFixed(2)
                  : "0.00"
              }}
              /
              {{
                patientData.selfPayPrepay
                  ? patientData.selfPayPrepay.toFixed(2)
                  : "0.00"
              }}
            </span>
          </div>
        </div>
        <div class="patient-info-cont">
          <div class="overflow-hidden margin-bottom-1">
            电话
            <span class="patient-info-detail" v-if="isArchiveShow()">
              {{ patientItem[0].patientArchiveInfoVO.mobileNum }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="overflow-hidden">
            地址
            <span class="patient-info-detail">
              <span v-if="isArchiveAttrShow()">
                <!-- <span
                  code="AdministrativDivision"
                  :val="
                    patientItem[0].patientEmpiInfoAddrssVO.currentAddress
                      ? JSON.parse(
                          patientItem[0].patientEmpiInfoAddrssVO.currentAddress
                        ) || ''
                      : ''
                  "
                  break="/"
                  v-codeTransform
                ></span> -->
                <span>{{
                  patientItem[0].patientEmpiInfoAddrssVO.currentDetail || "-"
                }}</span>
              </span>
              <span v-else>-</span>
            </span>
          </div>
        </div>
        <div class="patient-info-cont">
          <div class="overflow-hidden margin-bottom-1">
            联系人
            <span class="patient-info-detail" v-if="isArchiveGuanShow()">
              {{ patientItem[0].patientEmpiInfoAdditionalVOS[0].patientName }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="overflow-hidden">
            联系人电话
            <span class="patient-info-detail">
              <span v-if="isArchiveGuanShow()">
                <span>{{
                  patientItem[0].patientEmpiInfoAdditionalVOS[0].mobileNum ||
                    "-"
                }}</span>
              </span>
              <span v-else>-</span>
            </span>
          </div>
        </div>
        <div class="patient-info-cont">
          <div class="overflow-hidden margin-bottom-1">
            档案完善度<span
              class="patient-info-detail records"
              @click="goHealthFile()"
              >{{ thirdData.recordPerfection || "0" }}%</span
            >
          </div>
          <div class="overflow-hidden">
            签约医生
            <span class="patient-info-detail" v-if="thirdData.signFlag === 1"
              >{{ thirdData.signDoctorName || "-" }}/{{
                thirdData.signOrgName || "-"
              }}
            </span>
            <span class="patient-info-detail" v-else>-</span>
          </div>
        </div>
        <div class="patient-info-cont" style="margin-right: 0">
          <div class="overflow-hidden margin-bottom-1">
            <span class="patient-info-detail records"
              ><span
                class="buildText"
                v-if="
                  !this.thirdData.recordPerfection &&
                    this.patientData.identificationNum
                "
                @click="goHealthFile()"
                >去建档</span
              ></span
            >
          </div>
          <div class="overflow-hidden">
            <!-- 绑定社康医院<span
              class="patient-info-detail"
              v-if="isArchiveShow()"
              >{{
                patientItem[0].patientArchiveInfoVO.siBindShHosName || "-"
              }}</span
            >
            <span v-else>-</span> -->
          </div>
        </div>
      </div>
      <div class="illTitle">
        <span v-for="(item, index) in detailList" :key="index" class="ill-cont">
          <span :style="item.labelStyle" v-if="item.label">{{
            item.label
          }}</span>
          <span v-if="!item.code" :style="item.style">{{
            item.name || "--"
          }}</span>
          <span
            v-if="item.code"
            :style="item.style"
            :val="item.name"
            :code="item.code"
            v-codeTransform
          ></span>
        </span>
      </div>
      <slot name="rightSlot"></slot>
    </div>
    <!-- 老 高 糖 -->
    <el-dialog
      :title="iframeTitle"
      :visible.sync="iframeVisible"
      :width="`${iframeW + 64}px`"
      top="5vh"
    >
      <div style="padding: 16px 32px 16px 32px;">
        <HealthFIleIframe
          v-if="iframeVisible"
          :iframeType="iframeType"
          @cancelIframe="cancelIframe"
          @updateBaseInfo="updateBaseInfo"
          :style="`height: ${iframeH}px;width:${iframeW}px`"
        />
      </div>
    </el-dialog>
    <l-dialog
      :visible.sync="hzVisible"
      title="编辑档案"
      width="90%"
      height="95%"
      top="7vh"
      @confirm="saveHz"
      @cancel="cancelHz"
      @close="closeHz"
    >
      <template slot="content">
        <div style="padding: 8px" class="thirdTable">
          <editArchives
            ref="editArchives"
            :patientItem="patientItem"
            @submitMessage="confirmHz"
            v-if="hzVisible"
          ></editArchives>
        </div>
      </template>
    </l-dialog>
  </div>
</template>
<script>
import HealthFIleIframe from "@/views/cis/HealthFIleIframe/index.vue";
import { getPatientArchInfo } from "@/api/ipnw/etHospital.js";
import { getGroupFlag, getThirdUrl } from "@/api/third/third";
import { deepClone } from "@/utils";
import { mapActions, mapGetters } from "vuex";
import editArchives from "@/views/filingAndChange/filingAndChangeindex/components/editArchives.vue";
import { debounce } from "lodash/function";

let thirdData = {
  signFlag: 0,
  oldFlag: 0,
  identificationName: "",
  signDoctorName: "",
  name: "",
  identificationType: "",
  hypertensionFlag: 0,
  identificationNum: "",
  diabetesFlag: 0,
  signOrg: "",
  recordPerfection: 0
};
export default {
  name: "patientDetail",
  components: { HealthFIleIframe, editArchives },
  props: {
    patientData: {
      type: Object,
      default() {
        return {};
      }
    },
    detailList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      iframeType: "",
      iframeH: 0,
      iframeW: 0,
      iframeTitle: "",
      iframeUrl: "",
      iframeVisible: false,
      thirdData: {},
      urls: "",
      //编辑档案弹框
      hzVisible: false,
      patientItem: []
    };
  },
  watch: {
    patientData: {
      deep: true,
      async handler(c, old) {
        console.log(`patientData ccccc2121212`, JSON.parse(JSON.stringify(c)));
        // debugger
        this.setPublicHealthAddress({});

        this.patientItem = [];
        if (c.patientName) {
          this.getArchives();
        } else {
          this.setPublicHealthPatientData({});
        }
        if (c.identificationNum) {
          await this.resetData();
          await this.changePublicHealthData({
            ...deepClone(this.thirdData),
            ...deepClone(c)
          });
          this.getCommonData();
        } else {
          this.resetData();
          this.setPublicHealthPatientData({});
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    let res = await getThirdUrl();
    this.urls = res.data;
  },
  methods: {
    ...mapActions({
      changePublicHealthData: "homeSickbeds/changePublicHealthData",
      setPublicHealthPatientData: "base/setPublicHealthPatientData",
      setPublicHealthAddress: "base/setPublicHealthAddress"
    }),
    // tab 切换到健康档案
    goHealthFile() {
      if (this.patientItem.length === 0) {
        return;
      }
      console.log(`goHealthFile2222`, this.$route.path);
      if (this.$route.path === "/cisOne/cisThree") {
        this.$emit("changeTabName");
      } else {
        this.iframeType = "healthFile";
        this.iframeW = 1200;
        this.iframeH = 750;
        this.iframeTitle = "健康档案";
        this.iframeVisible = true;
      }
    },
    updateBaseInfo() {
      console.log("家床updateBaseInfo");
      this.getArchives();
      this.getCommonData();
    },
    cancelIframe() {
      console.log(`cancelIframe`);
      this.iframeVisible = false;
    },
    // 弹窗
    pushPathDialog(title) {
      if (!this.patientData.identificationNum) {
        this.$message.warning("该患者档案缺少证件号，不支持跳转到公卫系统！");
        return;
      }
      switch (title) {
        case "老年人档案":
          this.iframeType = "older";
          this.iframeW = 700;
          this.iframeH = 500;
          break;
        case "高血压专案":
          this.iframeType = "hypertension";
          this.iframeW = 988;
          this.iframeH = 550;
          break;
        case "糖尿病专案":
          this.iframeType = "diabetics";
          this.iframeW = 988;
          this.iframeH = 580;
          break;
        case "签约详情":
          this.iframeType = "signature";
          this.iframeW = 700;
          this.iframeH = 730;
          break;

        default:
          break;
      }
      this.iframeTitle = title;
      this.iframeVisible = true;
    },
    GetNumberOfDays(date1, date2) {
      console.log(`date1`, date1);
      console.log(`date2`, date2);
      //获得天数
      //date1：开始日期，date2结束日期
      var a1 = Date.parse(new Date(date1));
      var a2 = Date.parse(new Date(date2));
      var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
      return day;
    },
    getDays(strDateStart, strDateEnd) {
      if (strDateStart && strDateEnd) {
        let temp = this.GetNumberOfDays(
          this.dayjs(new Date()).format(),
          strDateEnd
        );
        return temp;
      }
      return "-";
    },
    resetData() {
      this.thirdData = deepClone(thirdData);
    },
    //获取公卫老高糖签数据
    async getCommonData() {
      let params = {
        identificationType: this.patientData.identificationType || "1",
        identificationNum: this.patientData.identificationNum,
        identificationName: ""
      };
      try {
        let res = await getGroupFlag(params);
        console.log(`getCommonData`, res);
        if (res.code == "SUCCESS") {
          this.setPublicHealthPatientData(res.data);
          this.thirdData = res.data;
          this.changePublicHealthData({
            ...deepClone(this.thirdData),
            ...deepClone(this.patientData)
          });
        } else {
          this.resetData();
          console.log(res.msg);
        }
      } catch (e) {
        console.log(e);
      }
    },
    pushPath(type, routeName) {
      if (!this.patientData.identificationNum) {
        this.$message.warning(
          "该患者档案缺少证件号，所以不支持跳转到公卫系统！"
        );
        return;
      }
      let urls =
        this.urls +
        "?type=" +
        type +
        "&identificationNum=" +
        this.patientData.identificationNum +
        "&identificationType=" +
        this.patientData.identificationType +
        routeName;
      console.log(
        "跳转到公卫的accesstoken：",
        localStorage.getItem("accesstoken")
      );
      window.open(urls);
    },
    //签约跳转
    pushPathSign(type) {
      if (!this.patientData.identificationNum) {
        this.$message.warning(
          "该患者档案缺少证件号，所以不支持跳转到公卫系统！"
        );
        return;
      }
      let urls =
        this.urls +
        "?type=" +
        type +
        "&signStatus=1&identificationNum=" +
        this.patientData.identificationNum +
        "&identificationType=" +
        this.patientData.identificationType;
      console.log(
        "跳转到公卫的accesstoken：",
        localStorage.getItem("accesstoken")
      );
      window.open(urls);
    },
    //获取档案
    getArchives: debounce(function() {
      this.getArchivesFun();
    }, 500),
    async getArchivesFun() {
      if (!this.patientData.patientId) {
        return;
      }
      try {
        let res = await getPatientArchInfo({
          patientId: this.patientData.patientId
        });
        if (res.code === 1 && res.data.length) {
          this.patientItem = res.data;
          this.setPublicHealthAddress(
            this.patientItem[0].patientEmpiInfoAddrssVO
          );
          const temp = this.patientItem[0];
          this.setPhPatientData(temp);
        }
      } catch (e) {}
    },
    setPhPatientData(temp) {
      const {
        identificationType = "",
        identificationNum = "",
        patientName = "",
        workUnit = "",
        mobileNum = ""
      } = temp.patientArchiveInfoVO;
      if (!temp.patientEmpiInfoAdditionalVOS.length) {
        temp.patientEmpiInfoAdditionalVOS[0] = {};
      }
      const {
        patientName: contactName = "",
        mobileNum: contactMobileNum = ""
      } = temp.patientEmpiInfoAdditionalVOS[0];

      const {
        houseHoldDetail = "",
        currentAddress = "",
        currentDetail = ""
      } = temp.patientEmpiInfoAddrssVO;

      const phPatientData = {
        identificationType,
        identificationNum,
        patientName,
        workUnit,
        mobileNum,
        contactName,
        contactMobileNum,
        houseHoldDetail,
        currentAddress,
        currentDetail
      };
      console.log(
        `phPatientData----`,
        JSON.parse(JSON.stringify(phPatientData))
      );
      this.setPublicHealthPatientData(phPatientData);
    },
    //档案数据显示条件
    isArchiveShow() {
      return (
        this.patientItem.length === 1 &&
        this.patientItem[0].hasOwnProperty("patientArchiveInfoVO")
      );
    },
    isArchiveAttrShow() {
      return (
        this.patientItem.length === 1 &&
        this.patientItem[0].hasOwnProperty("patientEmpiInfoAddrssVO")
      );
    },
    // 档案联系人显示条件
    isArchiveGuanShow() {
      return (
        this.patientItem.length === 1 &&
        this.patientItem[0].hasOwnProperty("patientEmpiInfoAdditionalVOS") &&
        this.patientItem[0].patientEmpiInfoAdditionalVOS.length
      );
    },
    //修改档案
    async editArchives() {
      if (!this.patientItem.length) {
        return;
      }
      this.hzVisible = true;
    },
    saveHz() {
      this.$refs.editArchives.submit();
    },
    cancelHz() {
      this.hzVisible = false;
    },
    confirmHz() {
      this.hzVisible = false;
      this.getArchives();
      this.$emit("patientDetail");
    },
    closeHz() {}
  }
};
</script>
<style scoped lang="scss">
.patient-detail {
  display: flex;
  height: 56px;
  background-color: #f1f4f6;
  border-radius: 8px;
  padding: 8px 16px;
  overflow: hidden;
  .patient-card-left {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #2e323a;
    font-size: 16px;
    border-right: 1px solid #e4e4e4;
    padding-right: 16px;
    .patient-card-left-top {
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
    .pic-box {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 0;
      border: 1px solid #e3e3e3;
      background-color: #ffffff;
      border-radius: 4px;
      margin-right: 8px;
    }
    .p-name {
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
    }
    .p-gender-age {
      font-size: 12px;
      color: #606266;
    }
    .p-ge {
      background: #efeaff;
      font-size: 14px;
      color: #6236ff;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      font-family: SourceHanSansSC-Regular;
      font-weight: 400;
      text-align: center;
      line-height: 22px;
      margin-left: 14px;
      margin-right: 4px;
      cursor: pointer;
    }
    .p-old {
      background: #d5e4ff;
      font-size: 14px;
      color: #0078ff;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      font-family: SourceHanSansSC-Regular;
      font-weight: 400;
      text-align: center;
      line-height: 22px;
      cursor: pointer;
      margin-right: 4px;
    }
    .p-high {
      width: 22px;
      height: 22px;
      background: #fbe7e7;
      border-radius: 4px;
      font-size: 14px;
      font-family: SourceHanSansSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #df1616;
      line-height: 22px;
      margin-right: 4px;
      cursor: pointer;
    }
    .p-sweet {
      background: #fef2d2;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      font-size: 14px;
      font-family: SourceHanSansSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #f8be1e;
      line-height: 22px;
      margin-right: 4px;
      cursor: pointer;
    }
    .p-check {
      width: 22px;
      height: 22px;
      background: #ecfbf7;
      border-radius: 4px;
      font-size: 14px;
      font-family: SourceHanSansSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #0d8a6e;
      line-height: 22px;
      margin-right: 4px;
      cursor: pointer;
    }
  }
  .patient-card-rights {
    display: flex;
    flex: 1;
    overflow: hidden;
    .patient-info {
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 16px;
      font-size: 12px;
      color: #666c70;
      line-height: 15px;
      border-right: 1px solid #e4e4e4;
      .patient-info-cont {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 16px;
        color: #949da3;
        .patient-info-detail {
          color: #2e323a;
          margin-left: 4px;
        }
      }
      .overflow-hidden {
        overflow: hidden;
      }
      .margin-bottom-1 {
        margin-bottom: 1px;
      }
      .records {
        width: 23px;
        height: 16px;
        font-size: 12px;
        font-family: DINPro-Regular;
        font-weight: 400;
        text-decoration: underline;
        text-align: left;
        color: #4f80ff !important;
        line-height: 15px;
        cursor: pointer;
        .buildText {
          font-size: 16px;
        }
      }
    }
    .illTitle {
      font-family: SourceHanSansSC-Medium;
      font-weight: 600;
      text-align: center;
      font-size: 16px;
      color: #2e323a;
      display: flex;
      align-items: center;
      padding: 0 16px;
      .ill-cont {
        /* background: rgba(241, 47, 47, 0.1);
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        font-family: SourceHanSansSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #ef0f0f; */
        margin-left: 8px;
        padding: 2px 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
