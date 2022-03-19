import opha from "@/api/hmm/opha";
import services from "@/api/appointment/appointment";
export default {
  data() {
    return {
      // 医保卡
      readCardcommandInfo:
        '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}',
      // 身份证
      readCardIdentifycommandInfo:
        '{"name":"idcardread","model":"hd100","file":"c:/11.bmp","dev":"USB1"}'
    };
  },
  methods: {
    // 读卡。与硬件交互
    async readCard(cb) {
      let cardInfo = {};
      let cardInfoIdentify = {};
      let nodeEnv = process.env.NODE_ENV;

      // 读取硬件，获取卡号
      try {
        this.$common.sendMsgRest2(this.readCardcommandInfo, async res => {
          if (res.data.code == 1) {
            cardInfo = res.data.data;
            // 1代表医保卡
            await this.getPatientCodeFuc(cardInfo, "1");
            cb(this.readCardData);
          } else {
            this.readCardIdentifyCard();
          }
        });
      } catch (e) {
        this.readCardIdentifyCard();
      }
    },
    readCardIdentifyCard() {
      let cardInfoIdentify = {};
      try {
        this.$common.sendMsgRest2(
          this.readCardIdentifycommandInfo,
          async res0 => {
            if (res0.data.code == 1) {
              cardInfoIdentify = res0.data.data;
              // 2代表身份证
              await this.getPatientCodeFuc(cardInfoIdentify, "2");
            } else {
              this.$message.error(res0.msg || "未获取有效卡信息！");
            }
          }
        );
      } catch (error) {
        this.$message.error(error.msg || "未获取有效卡信息！");
      }
    },
    // 获取患者编号
    async getPatientCodeFuc(cardInfo, flag) {
      this.readCardData = {};
      this.$showLoading();
      try {
        let siCardPatientCode =
          flag === "1"
            ? cardInfo.siCardPatientCode
            : flag === "2"
            ? cardInfo.certNo
            : "";
        let res = await services.getCardDetailInfo({
          cardNum: siCardPatientCode || ""
        });
        if (res.code === 1 && res.data.patientId) {
          this.readCardData = {
            ...res.data,
            cardNum: siCardPatientCode
          };
          return;
        }
        this.$message.error(res.msg || "未获取有效档案信息！");
      } catch (e) {
        this.$message.error(e.msg || "未获取有效档案信息！");
      } finally {
        this.$hideLoading();
      }
    }
  }
};
