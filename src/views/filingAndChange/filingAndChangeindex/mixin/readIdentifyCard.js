export default {
  data() {
    return {
      readCardIdentifycommandInfo: '{"name":"idcardread","model":"hd100","file":"c:/11.bmp","dev":"USB1"}'
    }
  },
  methods: {
    // 读卡。与硬件交互
    readIdentifyCardFuc() {
      let cardInfoIdentify = {};
      let nodeEnv = process.env.NODE_ENV;
      if (nodeEnv === "development") {
        cardInfoIdentify = {
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
        this.asyncForm(cardInfoIdentify);
        return;
      }
      // 读取硬件，获取卡号
      try {
        this.$common.sendMsgRest2(this.readCardIdentifycommandInfo, (res0) => {
          if (res0.data.code == 1) {
            cardInfoIdentify = res0.data.data;
            this.asyncForm(cardInfoIdentify);
          } else {
            this.$message.error(res0.msg || "未获取有效卡信息！");
          }
        });
      } catch (error) {
        this.$message.error(error.msg || "未获取有效卡信息！");
      }
    },
    // 同步档案
    asyncForm(data) {
      /* 姓名等的替换 */
      if ((this.recordForm.patientName && (this.recordForm.patientName !== data.name)) && (this.recordForm.identificationNum && (this.recordForm.identificationNum !== data.certNo))) {
        this.$message.error("读取的卡片患者与档案信息不一致！");
        return;
      }
      let birth = data.birth.length >= 8 ? data.birth.substring(0, 4) + "-" + data.birth.substring(4, 6) + "-" + data.birth.substring(6, 8) : ""
      this.recordForm.patientName = data.name;
      this.recordForm.patientGender = data.sex == "男" ? "1" : "2";
      // this.recordForm.nationCode = data.nation;
      this.recordForm.birthDate = birth;
      this.recordForm.birthTime = "00:00:00";
      this.recordForm.identificationNum = data.certNo;
      this.recordForm.identificationType = "1";
      // 带入户籍地址
      this.patientEmpiInfoAddrssVO.houseHoldDetail = data.address;
      // 联系地址默认深圳长岭
      this.patientEmpiInfoAddrssVO.currentAddress = [157613, 157637, 157638, 157734, 157741];

      this.getAgeByBirthDate();

      /* 验证卡列表 */
      let identificationType = "1";
      let cardList = this.cardList; //cardType
      let cardIndex = -1;
      // 证件类型是身份证号，identificationType 的值是1
      if (cardList.length > 0) {
        // 获取卡片管理的身份证信息
        let identiNo = cardList.find((item, index) => {
          if (item.cardType == identificationType) {
            cardIndex = index;
          }
          return item.cardType == identificationType;
        });
        if (identiNo) {
          let {
            cardData
          } = identiNo;
          // 绑卡的身份证 与 输入的身份证号不一样
          if (cardData != data.certNo) {
            this.$set(this.cardList, cardIndex, {
              cardData: data.certNo,
              // cardId: "959b055773cb491396783fa22dea00e6",
              cardStatus: "1",
              cardTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              cardType: "1",
              dataVersion: 0,
              patientId: this.recordForm.patientId
            });
          }
        } else {
          this.$set(this.cardList, this.cardList.length, {
            cardData: data.certNo,
            // cardId: "959b055773cb491396783fa22dea00e6",
            cardStatus: "1",
            cardTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            cardType: "1",
            dataVersion: 0,
            patientId: this.recordForm.patientId
          });
        }
      } else {
        this.$set(this.cardList, this.cardList.length, {
          cardData: data.certNo,
          // cardId: "959b055773cb491396783fa22dea00e6",
          cardStatus: "1",
          cardTime: this.dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          cardType: "1",
          dataVersion: 0,
          patientId: this.recordForm.patientId
        });
      }
    }
  }
}
