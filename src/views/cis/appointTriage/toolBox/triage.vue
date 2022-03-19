<template>
  <div class="triage">
    <div class="button-box mar-top-10 mar-left-10">
      <span @click="next" class="mar-right-10 com-style" title="下一位">
        <svg
          t="1569565859830"
          class="icon"
          viewBox="0 0 1181 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5497"
          width="30"
          height="30"
        >
          <path
            d="M157.538462 748.307692v196.923077a78.769231 78.769231 0 0 0 78.76923 78.769231h118.153846a78.769231 78.769231 0 0 0 78.769231-78.769231V393.846154H78.769231a78.769231 78.769231 0 0 0-78.769231 78.769231v196.923077a78.769231 78.769231 0 0 0 78.769231 78.76923h78.769231zM275.692308 315.076923a157.538462 157.538462 0 1 0 0-315.076923 157.538462 157.538462 0 0 0 0 315.076923z"
            fill="#E4E4E4"
            p-id="5498"
          ></path>
          <path
            d="M748.307692 945.230769c239.261538 0 433.230769-193.969231 433.23077-433.230769S987.569231 78.769231 748.307692 78.769231 315.076923 272.738462 315.076923 512s193.969231 433.230769 433.230769 433.230769zM612.627692 316.494769l244.066462 162.737231a39.384615 39.384615 0 0 1 0 65.536l-244.066462 162.737231A39.384615 39.384615 0 0 1 551.384615 674.658462V349.341538a39.384615 39.384615 0 0 1 61.243077-32.807384zM945.230769 315.076923a39.384615 39.384615 0 0 1 39.384616 39.384615v315.076924a39.384615 39.384615 0 0 1-78.769231 0V354.461538a39.384615 39.384615 0 0 1 39.384615-39.384615z"
            fill="#F09E23"
            p-id="5499"
          ></path>
        </svg>
      </span>
      <span @click="repeatCall" class="mar-right-10 com-style" title="重呼">
        <svg
          t="1569566221987"
          class="icon"
          viewBox="0 0 1675 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5609"
          width="30"
          height="30"
        >
          <path
            d="M1104.058182 291.607273l169.425454-141.172364A46.545455 46.545455 0 0 1 1349.818182 186.181818v639.069091a46.545455 46.545455 0 0 1-76.334546 35.746909l-169.425454-141.172363a93.090909 93.090909 0 0 1-33.512727-71.540364V363.147636a93.090909 93.090909 0 0 1 33.512727-71.540363z m385.396363 167.563636h139.636364a46.545455 46.545455 0 0 1 0 93.090909h-139.636364a46.545455 46.545455 0 0 1 0-93.090909z m-19.269818-232.727273L1536 160.628364a46.545455 46.545455 0 0 1 65.815273 65.815272L1536 292.258909a46.545455 46.545455 0 0 1-65.815273-65.815273zM1536 719.173818l65.815273 65.815273A46.545455 46.545455 0 1 1 1536 850.804364l-65.815273-65.815273A46.545455 46.545455 0 0 1 1536 719.173818z"
            fill="#E4E4E4"
            p-id="5610"
          ></path>
          <path
            d="M512 1024C229.236364 1024 0 794.763636 0 512S229.236364 0 512 0s512 229.236364 512 512-229.236364 512-512 512z m413.556364-539.089455c7.68-7.121455 13.172364-13.405091 5.352727-20.619636h-72.890182c-24.296727-161.605818-169.611636-285.882182-345.832727-285.882182-136.098909 0-253.765818 74.286545-311.575273 182.597818l93.789091 34.397091c42.821818-72.610909 124.183273-121.716364 217.832727-121.716363 120.785455 0 221.556364 81.92 244.782546 190.603636h-97.28c-8.098909 0-13.917091 11.822545 0 17.035636l126.277818 97.373091a20.852364 20.852364 0 0 0 27.973818 0l111.569455-93.789091zM360.541091 559.476364L238.778182 469.085091a20.945455 20.945455 0 0 0-27.880727 0l-113.012364 90.437818c-4.794182 11.776-4.794182 16.570182 0 23.970909h69.632c27.089455 141.405091 170.868364 262.097455 344.762182 262.097455 127.301818 0 238.312727-64.977455 299.52-161.885091l-94.580364-35.607273c-45.149091 61.719273-120.040727 102.213818-204.939636 102.213818-111.895273 0-206.568727-70.190545-238.359273-166.818909h86.621091c7.726545-7.214545 7.726545-16.756364 0-23.970909z"
            fill="#F05A23"
            p-id="5611"
          ></path>
        </svg>
      </span>
      <!-- <span @click="recover" title="过号恢复" class="com-style mar-right-10"
        ><svg
          t="1569566247235"
          class="icon"
          viewBox="0 0 1675 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5721"
          width="30"
          height="30"
        >
          <path
            d="M1104.058182 291.607273l169.425454-141.172364A46.545455 46.545455 0 0 1 1349.818182 186.181818v639.069091a46.545455 46.545455 0 0 1-76.334546 35.746909l-169.425454-141.172363a93.090909 93.090909 0 0 1-33.512727-71.540364V363.147636a93.090909 93.090909 0 0 1 33.512727-71.540363z m385.396363 167.563636h139.636364a46.545455 46.545455 0 0 1 0 93.090909h-139.636364a46.545455 46.545455 0 0 1 0-93.090909z m-19.269818-232.727273L1536 160.628364a46.545455 46.545455 0 0 1 65.815273 65.815272L1536 292.258909a46.545455 46.545455 0 0 1-65.815273-65.815273zM1536 719.173818l65.815273 65.815273A46.545455 46.545455 0 1 1 1536 850.804364l-65.815273-65.815273A46.545455 46.545455 0 0 1 1536 719.173818z"
            fill="#E4E4E4"
            p-id="5722"
          ></path>
          <path
            d="M512 1024C229.236364 1024 0 794.763636 0 512S229.236364 0 512 0s512 229.236364 512 512-229.236364 512-512 512z m357.096727-337.454545c6.702545 6.702545 20.200727 0 13.405091-6.795637-33.605818-100.910545-134.516364-336.384-410.391273-336.384V262.609455c-6.702545-26.949818-33.605818-40.308364-53.85309-20.154182L196.235636 437.527273c-13.405091 13.451636-13.405091 40.401455 0 53.853091l222.068364 174.871272c20.200727 20.247273 53.853091 0 53.853091-26.903272v-100.910546c174.917818 0 296.029091 13.498182 396.893091 148.014546h0.046545z"
            fill="#F05A23"
            p-id="5723"
          ></path></svg
      ></span>
      <span @click="jumpQueue" title="插队" class="com-style"
        ><svg
          t="1569566269553"
          class="icon"
          viewBox="0 0 1181 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5833"
          width="30"
          height="30"
        >
          <path
            d="M1024 748.307692v196.923077a78.769231 78.769231 0 0 1-78.769231 78.769231h-118.153846a78.769231 78.769231 0 0 1-78.769231-78.769231V393.846154h354.461539a78.769231 78.769231 0 0 1 78.769231 78.769231v196.923077a78.769231 78.769231 0 0 1-78.769231 78.76923h-78.769231zM905.846154 315.076923a157.538462 157.538462 0 1 1 0-315.076923 157.538462 157.538462 0 0 1 0 315.076923z"
            fill="#E4E4E4"
            p-id="5834"
          ></path>
          <path
            d="M433.230769 945.230769C193.969231 945.230769 0 751.261538 0 512S193.969231 78.769231 433.230769 78.769231s433.230769 193.969231 433.230769 433.230769-193.969231 433.230769-433.230769 433.230769zM350.798769 497.979077l-42.496 10.24v-80.384h41.984v-56.32H308.302769V275.771077H249.422769v95.744H201.806769v56.32h47.616v95.232c-22.016 5.12-41.472 9.728-58.368 13.312l12.8 58.88 45.568-12.8v103.424c0 6.144-1.536 8.192-7.168 8.192s-19.968 0-34.816-0.512c7.68 15.872 14.336 40.448 15.872 56.32 29.696 0 50.176-2.048 65.536-11.776 15.36-9.728 19.456-24.576 19.456-52.224v-119.808l49.664-13.824-7.168-54.272z m192 179.712v-229.376h123.904V393.531077h-123.904V345.403077a795.411692 795.411692 0 0 0 106.496-19.456l-29.696-49.664c-61.44 16.896-157.696 28.672-240.64 33.28a208.738462 208.738462 0 0 1 14.848 48.128c29.184-1.024 61.44-3.072 93.184-6.144v41.984H364.622769v54.784h122.368v229.376h-56.832v-49.664h41.472v-50.176h-41.472v-47.104c16.896-4.096 34.304-9.728 51.2-15.36l-26.112-50.688c-22.016 11.776-52.736 24.576-78.336 33.28v254.976h53.248v-21.504h165.888v23.04h54.272v-271.872h-93.184v51.2h38.912v43.52h-39.424v50.176h39.424v50.176h-53.248z"
            fill="#F09E23"
            p-id="5835"
          ></path></svg
      ></span> -->
    </div>
    <el-tabs tab-position="left" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        :label="'诊室'+item.roomNum "
        v-for="(item, index) in roomList"
        :key="index"
      >
        <div class="doctor">
          <h3>诊室接诊医生</h3>
          <p>
            {{ item.doctorInfo.docName }}
            <span class="level">{{ item.doctorInfo.level }}</span>
          </p>

          <p>{{ item.doctorInfo.good }}</p>
          <p>{{ item.visitTime }}</p>
        </div>
        <div class="patient">
          <h3>就诊患者</h3>
          <p>上一位:{{ item.patientInfo.lastPatient }}</p>
          <p>当前就诊:{{ item.patientInfo.nowPatient }}</p>
          <p>下一位:{{ item.patientInfo.nextPatient }}</p>
          <p>等待:{{ item.patientInfo.waitPatient }}</p>
          <p style="margin-top: 20px;">
            已就诊:{{ item.patientInfo.doneTreated }}位
          </p>
          <p>待就诊:{{ item.patientInfo.waitTreat }}位</p>
          <p>待回诊:{{ item.patientInfo.returnTreat }}位</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "triage",
  data() {
    return {
      roomList: [
        {
          roomNum: "05",
          doctorInfo: {
            docName: "林浩然",
            level: "主任医师",
            good: "中国内分泌协会委员。著有《XXXX》，发表著作3篇。擅长XXX的治疗"
          },
          visitTime: "周一上午、周三下午",
          patientInfo: {
            lastPatient: "31号，张佳佳",
            nowPatient: "32号，岑铃兰",
            nextPatient: "33号，张海军",
            waitPatient: "33号，张海军",
            doneTreated: "12",
            waitTreat: "3",
            returnTreat: "2"
          }
        },
        {
          roomNum: "06",
          doctorInfo: {
            docName: "林浩然",
            level: "主任医师2",
            good: "中国内分泌协会委员。著有《XXXX》，发表著作3篇。擅长XXX的治疗"
          },
          visitTime: "周一上午、周三下午",
          patientInfo: {
            lastPatient: "31号，张佳佳",
            nowPatient: "32号，岑铃兰",
            nextPatient: "33号，张海军",
            doneTreated: "12",
            waitTreat: "3",
            returnTreat: "2"
          }
        },
        {
          roomNum: "10",
          doctorInfo: {
            docName: "林浩然",
            level: "主任医师3",
            good: "中国内分泌协会委员。著有《XXXX》，发表著作3篇。擅长XXX的治疗"
          },
          visitTime: "周一上午、周三下午",
          patientInfo: {
            lastPatient: "31号，张佳佳",
            nowPatient: "32号，岑铃兰",
            nextPatient: "33号，张海军",
            doneTreated: "12",
            waitTreat: "3",
            returnTreat: "2"
          }
        }
      ]
    };
  },
  methods: {
    handleClick(activeitem) {},
    //下一位
    next() {},
    //重复叫号
    repeatCall() {},
    //过号恢复
    recover() {},
    //插队
    jumpQueue() {}
  }
};
</script>

<style lang='scss' scoped>
.triage {
  width: 287px;
  height: 100%;
  padding: 0px;
  background-color: #fff;
  .button-box {
    padding-bottom: 10px;
    font-size: 0;
    .com-style {
      display: inline-block;
      width: 58px;
      height: 36px;
      line-height: 36px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
      cursor: pointer;
      .icon {
        margin: 3px 14px;
      }
    }
  }
  .el-tabs {
    height: calc(100% - 47px);
    font-size: 14px;
  }
  .el-tab-pane {
    overflow-x: hidden;
    overflow-y: auto;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 10px 20px;
  }
  /deep/ .el-tabs--border-card > .el-tabs__header {
    background-color: #fff !important;
    /deep/ .el-tabs__item.is-left {
      position: relative;
      width: 48px !important;
      padding: 10px 6px !important;
      background-color: #fff !important;
      color: $l-color-fontcolor-3 !important;
      writing-mode: horizontal-tb !important;
      line-height: 14px !important;
      white-space: pre-wrap;
      letter-spacing: 0 !important;
      box-sizing: border-box !important;
      border-top: none !important;
      border-bottom: none !important;
      border-right: 1px solid #dfe4ed !important;
      margin: 0 !important;
      font-weight: $l-font-weight !important;
      font-size: $l-font-size-min !important;
      &::after{
        content:'';
        position: absolute;
        left: 50%;
        margin-left: -14px;
        bottom: 0;
        width: 28px;
        height: 1px;
        background-color: $l-color-bgcolor-11;
      }
    }
    /deep/ .el-tabs__item.is-left.is-active {
      background-color: #fff !important;
      color: $l-color-primary !important;
    }
  }
  /deep/ .el-tabs__header.is-left {
    margin-right: 0 !important;
  }
  .doctor {
    width: 100%;
    border-bottom: 1px solid $l-color-bgcolor-11;
    p {
      margin: 10px 0;
      .level {
        display: inline-block;
        padding: 2px;
        background-color: $l-color-bgcolor-18;
      }
    }
  }
  .mar-right-10 {
    margin-right: 10px;
  }
  .mar-top-10 {
    margin-top: 10px;
  }
  .mar-left-10 {
    margin-left: 10px;
  }
  .patient {
    padding: 10px 0;
    p {
      line-height: 24px;
      &:nth-of-type(2) {
        color: $l-color-primary;
        line-height: 30px;
      }
    }
  }
}
</style>
