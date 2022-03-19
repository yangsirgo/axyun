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
            出生日期
            <span class="patient-info-detail" v-if="isArchiveShow()">{{
              patientItem[0].patientArchiveInfoVO.birthDate
            }}</span>
            <span v-else>-</span>
          </div>
          <div class="overflow-hidden">
            <!-- <template
              v-if="patientData && patientData.hasOwnProperty('settlementType')"
              >结算类型
              <span
                class="patient-info-detail"
                :val="patientData.settlementType"
                code="settlementType"
                v-codeTransform
              >
              </span>
            </template> -->
            <!-- <template
              v-if="
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
              >
              </span>
            </template>
            <template v-else>
              档案结算类型<span class="patient-info-detail">-</span>
            </template> -->
            <template v-if="patientData && patientData.moduleName == 'cisOne'">费别
              <span class="patient-info-detail">{{settlementCisOne.companyName || ""}}</span>
            </template>
            <template
              v-else-if="
                isArchiveShow() &&
                  patientItem[0].patientArchiveInfoVO.settlementCompanyName !==
                    '' &&
                  patientItem[0].patientArchiveInfoVO.settlementCompanyName !==
                    undefined
              "
              >费别
              <span class="patient-info-detail">{{
                patientItem[0].patientArchiveInfoVO.settlementCompanyName
              }}</span>
            </template>
            <template v-else>
              费别<span class="patient-info-detail">-</span>
            </template>
          </div>
        </div>
        <div class="patient-info-cont">
          <div class="overflow-hidden margin-bottom-1">
            患者编号
            <span class="patient-info-detail" v-if="isArchiveShow()">
              {{ patientItem[0].patientArchiveInfoVO.patientCode }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="overflow-hidden">
            <span
              v-if="
                isArchiveShow() &&
                  patientItem[0].patientArchiveInfoVO.identificationType !==
                    '' &&
                  patientItem[0].patientArchiveInfoVO.identificationType !==
                    undefined
              "
              :val="patientItem[0].patientArchiveInfoVO.identificationType"
              code="MARK_TYPE_CODE"
              v-codeTransform
            >
            </span>
            <span v-else>证件号</span>
            <!-- 身份证号 -->
            <span class="patient-info-detail" v-if="isArchiveShow()"
              >{{ patientItem[0].patientArchiveInfoVO.identificationNum }}
            </span>
            <span v-else>-</span>
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
                    JSON.parse(
                      patientItem[0].patientEmpiInfoAddrssVO.currentAddress ||
                        '[]'
                    ) || ''
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
            <span v-else class="patient-info-detail">-</span>
          </div>
        </div>
        <div class="patient-info-cont" style="margin-right: 0">
          <!-- <div class="overflow-hidden margin-bottom-1">
            绑定社康医院<span
              class="patient-info-detail"
              v-if="isArchiveShow()"
              >{{
                patientItem[0].patientArchiveInfoVO.siBindShHosName || "-"
              }}</span
            >
            <span v-else>-</span>
          </div> -->
          <div class="overflow-hidden">
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
        </div>
      </div>
      <div class="illTitle">
        <span v-for="(item, index) in detailList" :key="index" class="ill-cont">
          <span :style="item.labelStyle" v-if="item.label">{{
            item.label
          }}</span>
          <span :style="item.style">{{ item.name }}</span>
        </span>
      </div>
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
          :thirdData="thirdDataObj"
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
import { getPamars } from "@/utils/auth";
import { getPatientArchInfo } from "@/api/ipnw/etHospital.js";
import { getGroupFlag, getThirdUrl, getPatientSettleByEmrNum } from "@/api/third/third";
import { deepClone } from "@/utils";
import { mapActions } from "vuex";
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
    },
    docType: {
      type: String,
      default() {
        return "0";
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
      thirdDataObj: {},
      urls: "",
      //编辑档案弹框
      hzVisible: false,
      patientItem: [],
      // 医生站下的本次就诊费别
      settlementCisOne: {
        companyName: "",
        companyCode: ""
      }
    };
  },
  watch: {
    patientData: {
      async handler(c, old) {
        let patientId = "";
        let patientIdNew = "";
        if (old && old.hasOwnProperty("patientId")) {
          patientId = old.patientId;
        }
        if (c && c.hasOwnProperty("patientId")) {
          patientIdNew = c.patientId;
        }
        if(!patientIdNew || (patientId == patientIdNew)) {
          return;
        }

        // this.setPublicHealthPatientData({});
        console.log(`patientData ccccc`, c);
        this.patientItem = [];
        this.settlementCisOne = {
          companyName: "",
          companyCode: ""
        };

        await this.resetData();
        this.changePublicHealthData({
          ...deepClone(this.thirdData),
          ...deepClone(c)
        });
        if (c.identificationNum) {
          await this.getCommonData();
        } else {
          this.resetData();
          this.setPublicHealthPatientData({});
        }
        if (c.patientId) {
          this.getArchives();
        } else {
          this.setPublicHealthPatientData({});
        }
        

        // 如果是医生站，请求本次就诊类别
        if (c && c.hasOwnProperty("visitCode") && c.moduleName == "cisOne") {
          this.getPatientSettleByEmrNum();
        }
        /* if (
          !this.thirdData.recordPerfection &&
          this.patientData.identificationNum &&
          this.docType !== "1" &&
          patientId !== patientIdNew
        ) {
          this.$confirm("患者还未建立居民健康档案，是否马上去建档？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.pushPath("archives","");
          });
        } */
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    //获取公卫地址
    let res = await getThirdUrl();
    this.urls = res.data;
    console.log(`this.urls`, this.urls);
  },
  mounted() {},
  methods: {
    ...mapActions({
      changePublicHealthData: "cis/changePublicHealthData",
      setPublicHealthPatientData: "base/setPublicHealthPatientData"
    }),
    resetData() {
      this.thirdData = deepClone(thirdData);
    },
    updateBaseInfo() {
      console.log("医生站updateBaseInfo");
      this.getArchives();
      this.getCommonData();
    },
    // tab 切换到健康档案
    goHealthFile() {
      if (this.patientItem.length === 0) {
        return;
      }
      console.log(`goHealthFile1111`, this.$route.path);
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
    //获取公卫老高糖签数据
    async getCommonData() {
      let params = {
        identificationType: this.patientData.identificationType || "1",
        identificationNum: this.patientData.identificationNum,
        identificationName: ""
      };
      try {
        let res = await getGroupFlag(params);
        if (res.code == "SUCCESS") {
          console.log(`getCommonData --- thirdData`, res);
          this.thirdData = res.data;
          this.setPublicHealthPatientData(res.data);
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
          this.iframeH = 600;
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
    //标签跳转
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
        "&signStatus=1&identificationNum=" +
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
    getArchives: debounce(function() {
      console.log(`gogoogoggogetArchives`);
      this.getArchivesFun();
    }, 500),
    //获取档案
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
          const temp = deepClone(this.patientItem[0]);
          this.setPhPatientData(temp);
          console.log(`this.patientItem`, JSON.parse(JSON.stringify(res.data)));
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
    //档案数据地址显示条件
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
    editArchives() {
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
      this.$emit("returnConfirm", true);
    },
    closeHz() {},
    cancelIframe() {
      console.log(`cancelIframe`);
      this.iframeVisible = false;
    },
    async getPatientSettleByEmrNum() {
      if(!this.patientData.visitCode) {
        return;
      }
      try {
        let res = await getPatientSettleByEmrNum({emrNum: this.patientData.visitCode});
        if(res.code === 1) {
          this.settlementCisOne = res.data;
        }
      } catch (error) {
        
      }
    }
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
        margin-bottom: 5px;
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
      font-size: 16px;
      font-family: SourceHanSansSC-Medium;
      font-weight: 600;
      text-align: center;
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
    .gotoGW {
      background: #e5e744;
      border-color: #e5e744;
      color: #ffffff;
      height: 32px;
      font-size: 14px;
      padding: 8px 16px;
      border-radius: 4px;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
    }
  }
}
</style>
