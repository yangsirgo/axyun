import services from "@/api/appointment/appointment";
export default {
  data() {
    return {
      readCardcommandInfo: '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}',
      commandNew: '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}', //省外医保
      readCardIdentifycommandInfo: '{"name":"idcardread","model":"hd100","file":"c:/11.bmp","dev":"USB1"}'
    }
  },
  methods: {
    // 读卡。与硬件交互
    readCard() {
      let cardInfo = {}; //省内医保
      let cardInfoNew = {}; //省外医保
      let cardInfoIdentify = {}; //身份证
      let nodeEnv = process.env.NODE_ENV;
      if (nodeEnv === "development") {
        /* cardInfo = {
          "areaCode": "440300",
          "siCardPatientCode": "450802198909107878",
          "siCardNum": "450802198909107878",
          "siCardIdentifyCode": "440300D15600000500444A52467262A8",
          "patientName": "陶志悦",
          "siCardResetInfo": "0096544CA08684440300444A52",
          "standardVersion": "2.00",
          "cardIssueDate": "20151223",
          "cardValidPerid": "20251223",
          "terminalNum": "440300907935",
          "terminalDeviceNum": "",
          "psamCardChipNum": "3B7D96000000814D326086439F20908A3736",
          "siPatientCode": "%GAKSJJAGWGUKHDIIKUFU?;07249970605382773515?",
          "encryptionFactor": "ca1c3f5556dd9875e9295971337e42c9",
          "versionNum": "V0.2"
        };
        this.getPatientCodeFuc(cardInfo, "1"); */
        /* cardInfoNew = {
          "areaCode": "",
          "siCardPatientCode": "441522199106240088",
          "siCardNum": "B7K334774",
          "siCardIdentifyCode": "440300D1560000050050640776EF3192",
          "patientName": "庄陆婷",
          "siCardResetInfo": "0096544CA08684440300506407",
          "standardVersion": "2.00",
          "cardIssueDate": "20160919",
          "cardValidPerid": "20260919",
          "terminalNum": "440300907950",
          "terminalDeviceNum": "00041186201603000534440300907950",
          "psamCardChipNum": null,
          "siPatientCode": null,
          "encryptionFactor": null,
          "versionNum": null,
          "sign": "OplMCIRFroalz8ARIyiuywl1qsGqbK5ggwNnFnQ/NtNNSGyYaT9kg81YOGGYVoa0MKnyPZvhrVpxlVZ2dS7IrucW6I/joSxl1fnM8uNG/sai87hErSaG04UR8AMNV1Pi/OuTd4Eq5aksxbeHJ1h8e/RB6Y/d1r5x6Kr0/eL+qi4xNjI3NDY4MDU4NDEwRUZGMTMxMUI3RkJCNjdFRTk3MEE4OERGQTM2MTg="
        }
        this.getPatientCodeFuc(cardInfoNew, "1"); */
        /* cardInfoIdentify = {
          "bmpFile": "c:/11.bmp",
          "name": "侯超月",
          "sex": "男",
          "nation": "汉",
          "birth": "19940905",
          "address": "安徽省芜湖市无为县襄安镇文思行政村候桥自然村候桥０１１号",
          // "certNo": "342623199409057159",
          "certNo": "451301198206257922",
          "department": "无为县公安局",
          "effectData": "20160725",
          "expire": "20260725"
        }
        this.getPatientCodeFuc(cardInfoIdentify, "2"); */
        // return;
      }
      // 读取硬件，获取卡号
      // 省内医保卡
      try {
        this.$common.sendMsgRest2(this.commandNew, (res) => {
          if (res.data.code == 1) {
            cardInfo = res.data.data;
            // 1代表医保卡
            this.getPatientCodeFuc(cardInfo, "1");
          } else {
            this.readCardIdentifyCard();
          }
        });
      } catch (e) {
        this.readCardIdentifyCard();
      }
    },
    // 省外医保卡
    /* readSiCardNew() {
      let cardInfoNew = {};
      try {
        this.$common.sendMsgRest2(this.commandNew, (res) => {
          if (res.data.code == 1) {
            cardInfoNew = res.data.data;
            // 1代表医保卡
            this.getPatientCodeFuc(cardInfoNew, "1");
          } else {
            this.readCardIdentifyCard();
          }
        });
      } catch (e) {
        this.readCardIdentifyCard();
      }
    }, */
    // 身份证
    readCardIdentifyCard() {
      let cardInfoIdentify = {};
      try {
        this.$common.sendMsgRest2(this.readCardIdentifycommandInfo, (res0) => {
          if (res0.data.code == 1) {
            cardInfoIdentify = res0.data.data;
            // 2代表身份证
            this.getPatientCodeFuc(cardInfoIdentify, "2");
          } else {
            this.$message.error(res0.msg || "未获取有效卡信息！");
          }
        });
      } catch (error) {
        this.$message.error(error.msg || "未获取有效卡信息！");
      }
    },
    // 获取患者编号
    async getPatientCodeFuc(cardInfo, flag) {
      this.$showLoading();
      try {
        let siCardPatientCode = flag === "1" ? cardInfo.siCardPatientCode : flag === "2" ? cardInfo.certNo : "";
        let res = await services.getCardDetailInfo({
          cardNum: siCardPatientCode || ""
        });
        if (res.code === 1 && res.data.patientId) {
          // 查询患者列表
          this.getPatientCodeListFuc({
            ...cardInfo,
            ...res.data
          });
        } else {
          this.$message.error(res.msg || "未获取有效档案信息！");
        }
      } catch (e) {
        this.$message.error(e.msg || "未获取有效档案信息！");
      } finally {
        this.$hideLoading();
      }
    }
  }
}
