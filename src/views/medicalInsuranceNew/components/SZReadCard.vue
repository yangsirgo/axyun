<template>
  <div class="SZReadCard height100">
    <el-row :gutter="10" class="width100 height100">
      <el-col :span="12" class="height100">
        <el-input
          v-model="cardData"
          placeholder="证件号"
          class="width100"
          clearable
          :disabled="SZReadCardDisabled"
          @input="changeCardData"
          @keyup.enter.native="searchEnter"
        ></el-input>
      </el-col>
      <el-col :span="12" class="height100">
        <template v-if="showPopover">
          <el-popover placement="bottom" title="" width="700" trigger="hover">
            <div
              class="patient-detail width100"
              v-if="patientItem.hasOwnProperty('patientCode')"
            >
              <div class="patient-card-left">
                <div class="p-name">
                  {{ patientItem.patientName || "-" }}
                </div>
                <div class="p-age">{{ patientItem.age || "-" }}岁</div>
                <div class="p-gender">
                  {{ transformNew("gend", patientItem.gender) }}
                </div>
              </div>
              <div class="patient-card-rights">
                <div class="patient-info">
                  <div class="patient-info-cont">
                    <div class="overflow-hidden margin-bottom-1">
                      人员编号
                      <span class="patient-info-detail">
                        {{ patientItem.patientCode }}
                      </span>
                    </div>
                    <div class="overflow-hidden">
                      <span>{{
                        transformNew(
                          "psn_cert_type",
                          patientItem.identificationType
                        ) || "证件号"
                      }}</span>
                      <!-- 身份证号 -->
                      <span class="patient-info-detail"
                        >{{ patientItem.identificationNum }}
                      </span>
                    </div>
                  </div>
                  <div class="patient-info-cont">
                    <div class="overflow-hidden margin-bottom-1">
                      出生日期
                      <span class="patient-info-detail">
                        {{ patientItem.birthDate }}
                      </span>
                    </div>
                    <div class="overflow-hidden">
                      民族
                      <span class="patient-info-detail">
                        {{ transformNew("naty", patientItem.nation) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="patient-detail width100" v-else>暂无患者医保信息</div>
            <el-button
              slot="reference"
              type="primary"
              :disabled="SZReadCardDisabled"
              :loading="btnLoading"
              @click="readCard"
              style="width: calc(100% - 65px)"
              >{{ readCardText }}</el-button
            >
          </el-popover>
          <el-checkbox v-model="checked">省外</el-checkbox>
        </template>
        <template v-else>
          <el-button
            type="primary"
            :disabled="SZReadCardDisabled"
            :loading="btnLoading"
            @click="readCard"
            style="width: calc(100% - 65px)"
            >{{ readCardText }}</el-button
          >
          <el-checkbox v-model="checked">省外</el-checkbox>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import patientHealthInfoService from "@/api/medicalInsuranceNew/patientHealthInfo.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";
import { testCnIdNo } from "@/utils/validate.js";

// 1.录入的证件号（包括读身份证）：
// 如果 证件号 符合身份证的规则，类型传 02；否则，传 04
// 2.读社保卡：
// 如果 省内，传 02；省外 传 03
// 4.电子社保卡：传01
export default {
  name: "SZreadCardNew",
  mixins: [getDictInfoNew],
  props: {
    readCardText: {
      type: String,
      default: "读卡",
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    SZReadCardDisabled: {
      type: Boolean,
      default: false,
    },
    showPopover: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      command:
        '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}',
      commandNew:
        '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}', //省外医保
      readCardIdentifycommandInfo:
        '{"name":"idcardread","model":"hd100","file":"c:/11.bmp","dev":"USB1"}',
      cardData: "",
      passward: "",
      // 卡信息
      cardInfo: {},
      // 患者医保档案信息
      patientItem: {},
      checked: false,
    };
  },
  mounted() {},
  methods: {
    readCard() {
      let nodeEnv = process.env.NODE_ENV;
      if (nodeEnv === "development") {
        /* if (!this.checked) {
          this.cardInfo = {
             areaCode: "",
            siCardPatientCode: "441522199106240088",
            siCardNum: "B7K334774",
            siCardIdentifyCode: "440300D1560000050050640776EF3192",
            patientName: "庄陆婷",
            siCardResetInfo: "0096544CA08684440300506407",
            standardVersion: "2.00",
            cardIssueDate: "20160919",
            cardValidPerid: "20260919",
            terminalNum: "440300907950",
            terminalDeviceNum: "00041186201603000534440300907950",
            psamCardChipNum: null,
            siPatientCode: null,
            encryptionFactor: null,
            versionNum: null,
            sign: "OplMCIRFroalz8ARIyiuywl1qsGqbK5ggwNnFnQ/NtNNSGyYaT9kg81YOGGYVoa0MKnyPZvhrVpxlVZ2dS7IrucW6I/joSxl1fnM8uNG/sai87hErSaG04UR8AMNV1Pi/OuTd4Eq5aksxbeHJ1h8e/RB6Y/d1r5x6Kr0/eL+qi4xNjI3NDY4MDU4NDEwRUZGMTMxMUI3RkJCNjdFRTk3MEE4OERGQTM2MTg=",
          };
          this.cardInfo = {
            ...this.cardInfo,
            cardType: "02",
            certNo: this.cardInfo.siCardPatientCode,
          };
          this.$emit("cardInfo", {
            ...this.cardInfo,
          });
          this.cardData = this.cardInfo.siCardPatientCode;
          this.getPatientSer();
        } else {
          this.cardInfo = {
            areaCode: "",
            siCardPatientCode: "441522199106240088",
            siCardNum: "B7K334774",
            siCardIdentifyCode: "440300D1560000050050640776EF3192",
            patientName: "庄陆婷",
            siCardResetInfo: "0096544CA08684440300506407",
            standardVersion: "2.00",
            cardIssueDate: "20160919",
            cardValidPerid: "20260919",
            terminalNum: "440300907950",
            terminalDeviceNum: "00041186201603000534440300907950",
            psamCardChipNum: null,
            siPatientCode: null,
            encryptionFactor: null,
            versionNum: null,
            sign: "OplMCIRFroalz8ARIyiuywl1qsGqbK5ggwNnFnQ/NtNNSGyYaT9kg81YOGGYVoa0MKnyPZvhrVpxlVZ2dS7IrucW6I/joSxl1fnM8uNG/sai87hErSaG04UR8AMNV1Pi/OuTd4Eq5aksxbeHJ1h8e/RB6Y/d1r5x6Kr0/eL+qi4xNjI3NDY4MDU4NDEwRUZGMTMxMUI3RkJCNjdFRTk3MEE4OERGQTM2MTg=",
          };
          this.cardInfo = {
            ...this.cardInfo,
            cardType: "03",
            certNo: this.cardInfo.siCardPatientCode,
            outProvince: true,
          };
          this.$emit("cardInfo", {
            ...this.cardInfo,
          });
          this.cardData = this.cardInfo.siCardPatientCode;
          this.getPatientSer();
        } */
        /* this.cardInfo = {
          bmpFile: "c:/11.bmp",
          name: "侯超月",
          sex: "男",
          nation: "汉",
          birth: "19940905",
          address: "安徽省芜湖市无为县襄安镇文思行政村候桥自然村候桥０１１号",
          // "certNo": "342623199409057159",
          certNo: "320503198403140022",
          department: "无为县公安局",
          effectData: "20160725",
          expire: "20260725",
        };
        let isIdentifyTrue = testCnIdNo(this.cardInfo.certNo);
        this.cardInfo = {
          ...this.cardInfo,
          cardType: isIdentifyTrue ? "02" : "04"
        }
        this.$emit("cardInfo", {
          ...this.cardInfo
        });
        this.cardData = this.cardInfo.certNo;
        this.getPatientSer(); */
        // return;
      }

      // 读取硬件，获取卡号
      try {
        // 身份证
        this.$common.sendMsgRest2(this.readCardIdentifycommandInfo, (res) => {
          if (res.data.code == 1) {
            let isIdentifyTrue = testCnIdNo(this.cardInfo.certNo);
            this.cardInfo = {
              ...res.data.data,
              cardType: isIdentifyTrue ? "02" : "04",
            };
            this.$emit("cardInfo", {
              ...this.cardInfo,
            });
            this.cardData = this.cardInfo.certNo;
            this.getPatientSer();
          } else {
            this.readCardIdentifyCard();
          }
        });
      } catch (error) {
        this.readCardIdentifyCard();
      }
    },
    // 读医保卡
    readCardIdentifyCard() {
      try {
        // 医保卡
        if (this.checked) {
          // 省外
          this.$common.sendMsgRest2(this.commandNew, (res) => {
            if (res.data.code == 1) {
              this.cardInfo = {
                ...res.data.data,
                outProvince: true, //省外标识
                cardType: "03",
                certNo: res.data.data.siCardPatientCode,
              };
              this.$emit("cardInfo", {
                ...this.cardInfo,
              });
              this.cardData = this.cardInfo.siCardPatientCode;
              this.getPatientSer();
            } else {
              this.$message.error(res.msg || "未获取有效卡信息！");
            }
          });
        } else {
          // 省内
          this.$common.sendMsgRest2(this.commandNew, (res) => {
            if (res.data.code == 1) {
              this.cardInfo = {
                ...res.data.data,
                cardType: "02",
                certNo: res.data.data.siCardPatientCode,
              };
              this.$emit("cardInfo", {
                ...this.cardInfo,
              });
              this.cardData = this.cardInfo.siCardPatientCode;
              this.getPatientSer();
            } else {
              this.$message.error(res.msg || "未获取有效卡信息！");
            }
          });
        }
      } catch (e) {
        this.$message.error(e.msg || "未获取有效卡信息！");
      }
    },
    // 输入框回车事件
    searchEnter() {
      let isIdentifyTrue = testCnIdNo(this.cardData);
      console.log("isIdentifyTrue", isIdentifyTrue);
      this.cardInfo = {
        cardType: isIdentifyTrue ? "02" : "04",
        certNo: this.cardData,
      };
      this.$emit("cardInfo", {
        cardType: isIdentifyTrue ? "02" : "04",
        certNo: this.cardData,
      });
      this.getPatientSer();
    },
    getPatientSer() {
      if (this.cardData === "") {
        this.$message.warning("请输入查询条件");
        return;
      }
      let params = this.cardInfo.outProvince
        ? {
            medicareType: "02",
            cardSn: this.cardInfo.siCardIdentifyCode,
            siCardNum: this.cardInfo.siCardNum,
            siReadCardDataDto: {
              ...this.cardInfo,
              siCardNum: this.cardInfo.certNo,
              cardType: this.cardInfo.cardType,
            },
          }
        : {
            identificationNum: this.cardData,
            medicareType: "02",
            siReadCardDataDto: {
              ...this.cardInfo,
              siCardNum: this.cardInfo.certNo,
              cardType: this.cardInfo.cardType,
            },
          };
      this.getPatient(params);
    },
    async getPatient(param) {
      try {
        let res = await patientHealthInfoService.patientInfo(param);
        if (res.code === 1) {
          let siPatientInsuranceInfoDtos = res.data.siPatientInsuranceInfoDtos;
          for (let i in siPatientInsuranceInfoDtos) {
            if (
              siPatientInsuranceInfoDtos[i].beginDate &&
              siPatientInsuranceInfoDtos[i].beginDate.indexOf(" ") > -1
            ) {
              siPatientInsuranceInfoDtos[i].beginDate =
                siPatientInsuranceInfoDtos[i].beginDate.split(" ")[0];
            }
          }
          for (let i in siPatientInsuranceInfoDtos) {
            if (
              siPatientInsuranceInfoDtos[i].endDate &&
              siPatientInsuranceInfoDtos[i].endDate.indexOf(" ") > -1
            ) {
              siPatientInsuranceInfoDtos[i].endDate =
                siPatientInsuranceInfoDtos[i].endDate.split(" ")[0];
            }
          }
          this.$emit(
            "patientInsurenceData",
            { ...res.data, siPatientInsuranceInfoDtos } || {}
          );
          this.patientItem = res.data.siPatientDto || {};
        } else {
          this.$emit("patientInsurenceData", {});
          this.patientItem = {};
        }
      } catch (error) {
        this.$emit("patientInsurenceData", {});
        this.patientItem = {};
      }
    },
    // 清除卡号
    cancalCardData() {
      this.cardData = "";
    },
    // 给父组件抛出事件与参数
    changeCardData(data) {
      this.patientItem = {};
      this.cardInfo = {};
      this.$emit("cardInfo", "");
      this.$emit("patientInsurenceData", {});
    },
  },
};
</script>

<style lang="scss" scoped>
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