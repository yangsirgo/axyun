<template>
  <div class="SZReadCard">
    <div class="readCard">
      <el-input
        v-if="showCardNum"
        style="width: 200px; margin-right: 8px"
        v-model="cardNum"
        placeholder="卡号"
        clearable
      ></el-input>
      <el-input
        style="width: 100px; margin-right: 8px"
        v-model="passward"
        placeholder="密码"
        clearable
      ></el-input>
      <el-button type="primary" @click="readCard" :loading="btnLoading">{{ readCardText }}</el-button>
    </div>
  </div>
</template>

<script>
import service from "@/api/healthInsurance/index.js";
import axios from "axios";
export default {
  props:{
    showCardNum:{
      type:Boolean,
      default:true
    },
    showPassword:{
      type:Boolean,
      default:true
    },
    readCardText:{
      type: String,
      default: "读卡"
    },
    btnLoading:{
      type:Boolean,
      default:false
    } 
  },
  data() {
    return {
      command:
        '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}',
      cardNum: "",
      passward: "",
    };
  },
  mounted() {
  },
  methods: {
    readCard() {
      let nodeEnv = process.env.NODE_ENV;
      if (nodeEnv === "development") {
        this.$emit("cardInfo", {"areaCode":"440300","siCardPatientCode":"450802198909107878","siCardNum":"B6Z315526","siCardIdentifyCode":"440300D15600000500444A52467262A8","patientName":"陶志悦","siCardResetInfo":"0096544CA08684440300444A52","standardVersion":"2.00","cardIssueDate":"20151223","cardValidPerid":"20251223","terminalNum":"440300907935","terminalDeviceNum":"","psamCardChipNum":"3B7D96000000814D326086439F20908A3736","siPatientCode":"%GAKSJJAGWGUKHDIIKUFU?;07249970605382773515?","encryptionFactor":"ca1c3f5556dd9875e9295971337e42c9","versionNum":"V0.2"});
        return;
      }
      this.$common.sendMsgRest2(this.command, (res) => {
        console.log("读医保卡相关信息", res.data);
        if (res.data.code == 1) {
          res.data.data.passward = this.passward;
          this.$emit("cardInfo", res.data.data);
        }else{
          console.log(res.msg);
        }
      });
    },
    //获取医保患者信息
    async getPatientInfo(param) {
      let res = service.patientInfo(param);
    },
  },
};
</script>

<style lang="scss" scoped>
.SZReadCard {
  .readCard {
    display: flex;
  }
}
</style>