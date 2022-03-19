<template>
  <div class="div height100">
    <el-row :gutter="10" class="width100 height100">
      <el-col :span="18" class="height100">
        <l-formt-title label="卡号">
          <el-input
            v-model="cardData"
            placeholder="卡号"
            class="width100"
            clearable
            @change="changeCardData"
            @keyup.enter.native="getPatientSer"
          ></el-input>
        </l-formt-title>
      </el-col>
      <el-col :span="6" class="height100">
        <el-popover placement="bottom" title="" width="800" trigger="hover">
          <div class="patient-detail width100" v-if="patientItem.length">
            <div class="patient-card-left">
              <div class="p-name" v-if="isArchiveShow()">
                {{ patientItem[0].patientArchiveInfoVO.patientName || "-" }}
              </div>
              <div class="p-gender" v-if="isArchiveShow()">
                {{ patientItem[0].patientArchiveInfoVO.patientAge || "-" }}
              </div>
              <div
                class="p-age"
                v-if="
                  isArchiveShow() &&
                    patientItem[0].patientArchiveInfoVO.patientGender !== '' &&
                    patientItem[0].patientArchiveInfoVO.patientGender !==
                      undefined
                "
                :val="patientItem[0].patientArchiveInfoVO.patientGender"
                code="GENDER_CODE"
                v-codeTransform
              ></div>
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
                    <template
                      v-if="
                        isArchiveShow() &&
                          patientItem[0].patientArchiveInfoVO.settlementType !==
                            '' &&
                          patientItem[0].patientArchiveInfoVO.settlementType !==
                            undefined
                      "
                      >档案结算类型
                      <span
                        class="patient-info-detail"
                        :val="
                          patientItem[0].patientArchiveInfoVO.settlementType
                        "
                        code="settlementType"
                        v-codeTransform
                      >
                      </span>
                    </template>
                    <template v-else>
                      档案结算类型<span class="patient-info-detail">-</span>
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
                          patientItem[0].patientArchiveInfoVO
                            .identificationType !== '' &&
                          patientItem[0].patientArchiveInfoVO
                            .identificationType !== undefined
                      "
                      :val="
                        patientItem[0].patientArchiveInfoVO.identificationType
                      "
                      code="MARK_TYPE_CODE"
                      v-codeTransform
                    >
                    </span>
                    <span v-else>证件号</span>
                    <!-- 身份证号 -->
                    <span class="patient-info-detail" v-if="isArchiveShow()"
                      >{{
                        patientItem[0].patientArchiveInfoVO.identificationNum
                      }}
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
                    <span
                      class="patient-info-detail patient-info-detail-address"
                    >
                      <span v-if="isArchiveAttrShow()">
                        <span
                          code="AdministrativDivision"
                          :val="
                            JSON.parse(
                              patientItem[0].patientEmpiInfoAddrssVO
                                .currentAddress || '[]'
                            ) || ''
                          "
                          break="/"
                          v-codeTransform
                        ></span>
                      </span>
                      <span v-else>-</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="patient-detail width100" v-else>暂无患者信息</div>
          <el-button
            slot="reference"
            type="primary"
            @click="readCard"
            class="width100 btu"
            >读卡</el-button
          >
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import service from "@/api/appointment/appointment";
import { getPatientArchInfo } from "@/api/ipnw/etHospital.js";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      command:
        '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}',
      readCardIdentifycommandInfo: '{"name":"idcardread","model":"hd100","file":"c:/11.bmp","dev":"USB1"}',
      // 卡号
      cardData: "",
      // 卡信息
      cardInfo: {},
      // 患者档案信息
      patientItem: []
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    // 点击读卡事件
    readCard() {
      let nodeEnv = process.env.NODE_ENV;
      if (nodeEnv === "development") {
        this.cardInfo = {
          areaCode: "440300",
          siCardPatientCode: "450802198909107878",
          siCardNum: "450802198909107878",
          siCardIdentifyCode: "440300D15600000500444A52467262A8",
          patientName: "陶志悦",
          siCardResetInfo: "0096544CA08684440300444A52",
          standardVersion: "2.00",
          cardIssueDate: "20151223",
          cardValidPerid: "20251223",
          terminalNum: "440300907935",
          terminalDeviceNum: "",
          psamCardChipNum: "3B7D96000000814D326086439F20908A3736",
          siPatientCode: "%GAKSJJAGWGUKHDIIKUFU?;07249970605382773515?",
          encryptionFactor: "ca1c3f5556dd9875e9295971337e42c9",
          versionNum: "V0.2"
        };
        this.cardData = this.cardInfo.siCardPatientCode;
        this.getPatientSer();
        return;
      }
      // 读取硬件，获取卡号
      try {
        // 医保卡
        this.$common.sendMsgRest2(this.command, (res) => {
          if (res.data.code == 1) {
            this.cardInfo = res.data.data;
            this.cardData = this.cardInfo.siCardPatientCode;
            this.getPatientSer();
          } else {
            this.readCardIdentifyCard();
          }
        });
      } catch (e) {
        this.readCardIdentifyCard();
      }
    },
    readCardIdentifyCard() {
      try {
          // 身份证
          this.$common.sendMsgRest2(this.readCardIdentifycommandInfo, (res0) => {
            if (res0.data.code == 1) {
              this.cardInfo = res0.data.data;
              this.cardData = this.cardInfo.certNo;
              this.getPatientSer();
            } else {
              this.$message.error(res0.msg || "未获取有效卡信息！");
            }
          });
        } catch (error) {
          this.$message.error(error.msg || "未获取有效卡信息！");
        }
    },
    // 输入框回车事件
    getPatientSer() {
      if (this.cardData === "") {
        this.$message.warning("请输入查询条件");
        return;
      }
      this.getPatient();
    },
    // 通过卡号获取患者id
    async getPatient() {
      if (this.cardData === "") {
        return;
      }
      try {
        this.$showLoading();
        let res = await service.getCardDetailInfo({
          cardNum: this.cardData || ""
        });
        if (!res.data.patientId) {
          this.$message.error("未获取有效档案信息！");
        } else {
          this.$emit("readCard", res.data);
          this.getArchives(res.data.patientId);
        }
        // this.changeRecPatientData(res.data);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
         this.$message.error("未获取有效档案信息！");
      }
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
    // 通过患者id获取患者档案信息
    async getArchives(patientId) {
      this.patientItem = [];
      try {
        let res = await getPatientArchInfo({
          patientId
        });
        if (res.code === 1 && res.data.length === 1) {
          this.patientItem = res.data;
        } else {
          this.$message.error("未获取有效档案信息！");
        }
      } catch (e) {
        this.$message.error("未获取有效档案信息！");
      }
    },
    // 清除卡号
    cancalCardData() {
      this.cardData = "";
    },
    // 给父组件抛出事件与参数
    changeCardData(data) {
      this.patientItem = [];
      this.$emit("readCard", {});
    }
  }
};
</script>
<style lang="scss" scoped>
.btu {
  text-align: center;
}
.div {
  height: 36px;
}
.patient-detail {
  display: flex;
  height: 56px;
  // background-color: #f1f4f6;
  border-radius: 8px;
  padding: 8px 16px;
  overflow-y: hidden;
  overflow-x: auto;
  .patient-card-left {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #2e323a;
    font-size: 16px;
    border-right: 1px solid #e4e4e4;
    padding-right: 16px;
    .p-name {
      font-size: 20px;
      margin-right: 6px;
      font-weight: 800;
      cursor: pointer;
    }
    .p-gender {
      margin-right: 4px;
    }
    .p-age {
      margin-right: 4px;
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
      // border-right: 1px solid #e4e4e4;
      .patient-info-cont {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 16px;
        color: #949da3;
        .patient-info-detail {
          color: #2e323a;
          margin-left: 4px;
          display: inline-block;
        }
        .patient-info-detail-address {
          color: #2e323a;
          margin-left: 4px;
          display: inline-block;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .overflow-hidden {
        overflow: hidden;
      }
      .margin-bottom-1 {
        margin-bottom: 1px;
      }
    }
  }
}
</style>
