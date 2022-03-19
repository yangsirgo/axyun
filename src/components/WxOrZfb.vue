<template>
  <a href="weixin://wxpay/bizpayurl?pr=1lWfhNB00">11111</a>
</template>

<script>
import { post, get, put, del } from "@/utils/request";
export default {
  data() {
    return {};
  },
  mounted() {
    if (/MicroMessenger/.test(window.navigator.userAgent)) {
      this.prePay(4);
    } else if (/AlipayClient/.test(window.navigator.userAgent)) {
      alert("请用微信扫码");
      // this.prePay(3);
    } else {
      alert("请用微信扫码");
    }
  },
  methods: {
    async prePay(payTypeId) {
      let params = this.getHashParameters();
      let res = await post("/pay/pay-trade/prePay", {
        payTypeId,
        outTradeNo:params.outTradeNo,
      });
      if(res.code == 1&&res.data.variables){
        window.location.href = res.data.variables.qrCode;
        // window.location.href = "https://www.baidu.com/";
      }else{
        alert("系统错误，请重试！");
      }
    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    getHashParameters() {
      console.log(window.location.hash.split('?'));
      if(window.location.hash.split('?').length<=1){
        return false;
      }
      var arr = window.location.hash.split('?')[1].split('&')
      var params = {}
      for (var i = 0; i < arr.length; i++) {
        var data = arr[i].split('=')
        if (data.length === 2) {
          params[data[0]] = data[1]
        }
      }
      return params
    }
  },
};
</script>

<style>
</style>