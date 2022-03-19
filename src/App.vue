<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { getQueryString } from "@/utils/util";
import { mapGetters, mapActions } from "vuex";
import hmmBaseApi from "@/api/hmm/base";
import cnfDictionaryService from "@/api/wconf/cnfDictionary.js";

export default {
  name: "App",
  data(){
    return{
      docTimeout:'',
      timeoutPatients:'',
      timer:null,
      notice:null,
      enable:''
    }
  },
  computed: {
    // 快捷键列表
    ...mapGetters("hotKey", ["hotKeyList"]),
    // 角色数据
    ...mapGetters("user", ["role"]),
  },
  watch: {
    /**
     * 药房药库获取当前登录的库房code
     * 监听角色变化重新获取当前角色的库房code
     * 只有角色所在库房是药房药库请求会成功
     * 不是药房药库请求会失败（不用理会）
     */
    role: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.roleName) {
          this.getUserStorage();
        }
      },
    },
    $route: {
      deep: true,
      immediate: true,
      handler(val, old) {
        let oldPath = "";
        if(old && old.hasOwnProperty("path")){
          oldPath = old.path;
        }
        if(val && val.hasOwnProperty("path") && val.path != oldPath) {
          if(val.path.indexOf('cisOne') != -1 && old.path.indexOf('cisOne') == -1){
            this.getDocTimeout().then(()=>{
              if(this.enable === '1')this.setInT('getTimeoutPatients',this.docTimeout)
            })
          }else if(val.path.indexOf('finance_outp') != -1 && old.path.indexOf('finance_outp') == -1){
            this.getDocTimeout().then(()=>{
              if(this.enable === '1')this.setInT('getTimeoutDepPatients',this.docTimeout)
            })
          }else if((val.path.indexOf('finance_outp') != -1 && val.path.indexOf('finance_outp') != -1)){
            return
          }else if(val.path.indexOf('cisOne') != -1 && val.path.indexOf('cisOne') != -1){
            return;
          }
          else{
            this.close()
            this.clearGetTimeoutPatients()
          }
          setTimeout(() => {
            this.changeRecPatientData({});
            this.changeHBRecPatientData({});
          }, 1000)
        }
      }
    }
  },

  created() {
    this.imIsOpen();
    this.clearGetTimeoutPatients()
  },
  mounted() {
    window.addEventListener("keydown", this.keyCodeChange, true);
    this.$nextTick(() => {
      window.parent.postMessage(
        {
          type: "loaded",
        },
        "*"
      );
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyCodeChange, true);
    this.$root.eventHub.$off();
    this.clearGetTimeoutPatients()

  },
  methods: {
    ...mapActions({
      changeBatchManagement: "drugManagement/changeBatchManagement",
      changeStorageCode: "drugManagement/changeStorageCode",
      changeRecPatientData: "base/changeRecPatientData",
      changeHBRecPatientData: "homeSickbeds/changeRecPatientData"
    }),
    //挂号收费-获取部门患者
    getTimeoutDepPatients(){
      this.close()
      let param = {
        docTimeout:this.docTimeout,
      }
      hmmBaseApi.getTimeoutPatientsToCashier(param).then((res) => {
        if (res.code == '1' && res.data && Object.keys(res.data).length > 0) {
          this.openDepNotice(res.data)
        }
      })
    },
    //医生站-获取等待患者个数
    getTimeoutPatients(){
      this.close()
      let param = {
        docTimeout:this.docTimeout,
        Flag:'1'
      }
      hmmBaseApi.getTimeoutPatients(param).then((res) => {
        if(res.code == '1'){
          if(res.data && res.data != '0'){
            this.timeoutPatients = res.data
            this.openNotice()
          }
        }
      });
    },


    //弹窗公用方法
    setInT(fn,time){
      clearInterval(this.timer);
        this[fn]()
      this.timer = setInterval(()=>{
        this[fn]()
      },time)
    },
    //清定时任务
    clearGetTimeoutPatients(){
      if(this.timer)clearInterval(this.timer)
      this.timer = null;
    },

    //挂号收费-弹框
    openDepNotice(obj){
      let html = '';
      let titTime = Math.floor(this.docTimeout / 1000 / 60)
      for (let key in obj) {
        html += '<div class="remind"><strong class="el-icon-warning"></strong>【' + key + '】 当前有<span class="remark">' + obj[key] + '</span>位超时患者</div>'
      }
      html = '<div class="notify">' + html + '</div>'
      this.$notify({
        title: '患者等候超' + titTime  + '分钟提醒',
        duration:'0',
        dangerouslyUseHTMLString: true,
        position: 'bottom-right',
        message: html
      });
    },

    //医生站-弹框
    openNotice() {
      const h = this.$createElement
      let titTime = Math.floor(this.docTimeout / 1000 / 60)
      this.notice = this.$notify({
        title: '患者等候提醒',
        customClass:'notify',
        message: h('div', {
          attrs: {
            class: 'remind'
          }
        }, [h('div',null,[
          h('strong', {attrs: {
              class: 'el-icon-warning'
            }}),
          h('span', null,'当前有'),
          h('span', {attrs: {
              class: 'remark'
            }},this.timeoutPatients),
          h('span', null,'位患者等候超过'),
          h('span', {attrs: {
              class: 'remark'
            }},titTime),
          h('span', null,'分钟,请及时处理。'),
          h('div', {attrs: {
              class: 'border'
            }},'一起加油哦~'),
          h('el-button', {
            attrs: {
              class: 'btn',
            },
            on:{
              click:this.close
            }
          }, "知道了")
        ])]),
       // message: '<div  class="remind"><div><strong class="el-icon-warning"></strong>当前有<span></span>位患者等候超过<span>10</span>分钟</div><div class="border">一起加油哦~</div><div class="btn" @click="close">知道了</div></div>',
        duration:'0',
        dangerouslyUseHTMLString: true,
        position: 'bottom-right'
      });
    },
    //关闭所有弹框
    close() {
        this.$notify.closeAll()
    },

    //
    autoLogin() {
      let params = getQueryString("params", window.location.href);
      if (params) {
        try {
          let data = JSON.parse(decodeURIComponent(params));
          this.$store.dispatch("user/autoLogin", data);
        } catch (error) {
          console.log("初始化失败", error);
        }
      }
    },
    imIsOpen() {
      // 获取药房药库精确批次管理
      hmmBaseApi.getIsOpen().then((res) => {
        if (res.code === 1) {
          if (res.data[0].paramValue === "0") {
            // 非精确批次管理
            this.changeBatchManagement(false);
          } else {
            // 精确批次管理
            this.changeBatchManagement(true);
          }
        }
      });
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi.getCurDrugStorage().then((res) => {
        if (res.code === 1) {
          this.changeStorageCode(res.data.storageCode);
        }
      });
    },
    // 快捷键监听
    keyCodeChange(e) {
      const event = e || window.event; //在ff下event会做为参数传进来，ie下会在window下
      const keyCode = event.which || event.keyCode;
      const { ctrlKey, altKey, shiftKey } = event;

      // 过滤当前所按的快捷键
      let curKey = this.hotKeyList.find((item) => {
        return (
          typeof item.keyCode[keyCode] !== "undefined" &&
          item.ctrlKey === ctrlKey &&
          item.altKey === altKey &&
          item.shiftKey === shiftKey
        );
      });
      if (curKey) {
        event.preventDefault();
        this.$root.eventHub.$emit(curKey.func, {
          funcname: curKey.func,
          ev: event,
          keyCode: keyCode,
          keyValue: curKey.keyCode[keyCode],
        });
      }
    },
    //获取docTimeout
    async getDocTimeout() {
      try {
        let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum || "";
        let res = await cnfDictionaryService.getDictionaryInfo({
          catalogCode: "CIS_OUTAPTIENT_PARAMS",
          dicCode: "CIS_OUTAPTIENT_CIS_OUTAPTIENT_CIS_TIMEOUT",
          hosId
        });
        if(res.code === 1) {
          this.docTimeout = res.data.dictionaryValue;
          this.enable = res.data.recordStatus
        }
      } catch (error) {

      }
    }
  },
};
</script>
<style lang="scss">
#app {
  min-width: 1280px;
  overflow-y: hidden;
  overflow-x: auto;

}

.el-notification{
  width: 410px !important;
  background: floralwhite !important;
}
.el-notification__content{
  width: 380px !important;
}

.notify{
  padding-bottom: 10px;
  .remind{
    font-size: 16px !important;
    margin-top: 20px !important;
    div{
      line-height: 38px;
    }
    span.remark{
      font-size: 20px;
      color: #0000FF;
    }
    .el-icon-warning:before{
      font-size: 20px;
      margin-right: 2px;
    }
    .border{
      border-bottom: 1px solid #ddd;
    }
    .btn{
      text-align: center;
      width: 100px;
      height: 34px;
      margin:15px auto;
      display: block;
      line-height: 34px;
      border-radius: 4px;
      border: 1px solid #ccc;
      cursor: pointer;
    }

  }
}

</style>
