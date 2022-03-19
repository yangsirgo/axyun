<template>
  <div
    class="page"
    :class="pageCls()"
    @click="goHref"
  >
    <!-- "组件" -->
    <!-- {{ aStatus }}
    {{ aType }} -->
    <span
      code="EasApplyStatus"
      v-codeTransform
      :val="aStatus"
    ></span>
    <span
      style="display:none;"
      code="ASSAYREPORTURL"
      v-codeTransform
      val="URL"
      id="urlId"
    ></span>
  </div>
</template>

<script type="text/ecmascript-6">
// let url = "http://171.168.60.78/lis4ward/query/form_clinctreportquery.htm?PatientID=";
export default {
  props: ["patientObj", "aStatus", "aType"],
  data() {
    return {
    
    };
  },
  components: {},
  methods: {
    getPacsCommandInfo (){
      let { visitCode } = this.patientObj;
      let command = {
        name: "exe_runner",
        model: "pacs",
        // exePath:"C:/Users/yangsirgo/Desktop/yaoguai/yaoguai/ServiceWcf1.exe",
        args:"H" + visitCode
      };

      let commandClone = '{"name":"exe_runner","model":"pacs","args":"H' + visitCode + '"}'


    //  let commandClone = { "command": JSON.stringify(command).replace(/\"/g,'\\"') };
    //  let commandClone = JSON.stringify(command);
    //  let commandClone = JSON.stringify(command).replace(/\"/g,'\\"');
    //  let commandClone = JSON.stringify(command);
    //  console.log("commandClone", commandClone);                     
    //  console.log("commandClone", JSON.stringify(command).replace(/\"/g,'\\"'));                     
    //  console.log("commandClone", JSON.stringify(commandClone));                     
     return commandClone;
    },
    pageCls() {
      return {
        pointerCls: this.isPacsGo() || this.isLisGo()
      };
    },
    //pacs 跳转 检查
    isPacsGo (){
      //如果是检查，需要大于11且不等于99   如果是检验，23即可
      return this.aType == "检查" && this.aStatus >= 11 &&  this.aStatus != 99;
    },
    //lis 跳转 检验
    isLisGo (){
      //如果是检查，需要大于11且不等于99   如果是检验，23即可
      return this.aType == "检验" && this.aStatus == 23;
    },
    goHref() {
      // console.log(this.getPacsCommandInfo());
      // 门诊
      // 检查 pacs  11  已出报告 exe
      // 检验 lis 23 检验报告

      //家床 与 门诊 共用一套
      // 以上可跳转
      if (this.isLisGo()) {
        let { patientCode } = this.patientObj;
        let url = document.querySelector("#urlId").innerText;
        window.open(url + patientCode);
      } else if (this.isPacsGo ()) {
        //调用 exe
        this.$common.sendMsgRest2(this.getPacsCommandInfo(), res => {
          if (res.data.code == 1) {
          } else {
            this.$message.error(res.msg || "调用exe 失败！");
          }
        });
      }

      return false;
    }
  }
};
</script>

<style scoped lang="scss">
// .page {

// }
.pointerCls {
  cursor: pointer;
  color: #4f80ff !important;
}
</style>
