<template>
  <div class="old-sys-contain">
    <div class="old-item-con">
      <div class="left">主诉:</div>
      <div class="right">{{ oldSysData.zsxx }}</div>
    </div>
    <div class="old-item-con">
      <div class="left">现病史:</div>
      <div class="right">{{ oldSysData.xbs }}</div>
    </div>
    <div class="old-item-con">
      <div class="left">既往史:</div>
      <div class="right">
        <ul v-if="jwsList.length > 0">
          <li v-for="(item, index) in jwsList" :key="item">
            {{ `${index + 1}. ${item};` }}
          </li>
        </ul>
      </div>
    </div>
    <div class="old-item-con">
      <div class="left">体格检查:</div>
      <div class="right">
        <p>
          <span v-if="oldSysData.h">身高: {{ oldSysData.h }}cm</span>
          <span v-if="oldSysData.w">体重: {{ oldSysData.w }}kg</span>
        </p>
        {{ oldSysData.tgjc }}
      </div>
    </div>
    <div class="old-item-con">
      <div class="left">实验室和器材检查:</div>
      <div class="right"></div>
    </div>
    <div class="old-item-con">
      <div class="left">检验结果:</div>
      <div class="right"></div>
    </div>
    <div class="old-item-con">
      <div class="left">检查结果:</div>
      <div class="right"></div>
    </div>
    <div class="old-item-con">
      <div class="left">初步诊断:</div>
      <div class="right">
        {{ oldSysData.zyzd }}
      </div>
    </div>
    <div class="old-item-con">
      <div class="left">目前用药:</div>
      <div class="right"></div>
    </div>
    <div class="old-item-con">
      <div class="left">处理措施:</div>
      <div class="right">
        <ul v-if="ypmcList.length > 0">
          <li v-for="(item, index) in ypmcList" :key="item">
            {{ `${index + 1}. ${item};` }}
          </li>
        </ul>
      </div>
    </div>
    <div class="old-item-con">
      <div class="left">管理计划:</div>
      <div class="right">
        <ul v-if="manageList.length > 0">
          <li v-for="(item, index) in manageList" :key="item">
            {{ `${index + 1}. ${item};` }}
          </li>
        </ul>
      </div>
    </div>
    <div class="old-item-con">
      <div class="left">健康教育:</div>
      <div class="right">
        <ul v-if="healthteachList.length > 0">
          <li v-for="(item, index) in healthteachList" :key="item">
            {{ `${item};` }}
          </li>
        </ul>
      </div>
    </div>
    <div class="old-item-con">
      <div class="left">下次随访时间:</div>
      <div class="right"></div>
    </div>
    <div class="old-item-con">
      <div class="left">转诊:</div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    oldSysData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    jwsList() {
      let str = this.oldSysData.jws || "";
      return str.split("/r/n").filter(item => item != "");
    },
    ypmcList() {
      let str = this.oldSysData.ypmc || "";
      let strMed = this.oldSysData.fymc || "";
      return str
        .split("/r/n")
        .filter(item => item != "")
        .concat(strMed.split("/r/n").filter(item => item != ""));
    },
    manageList() {
      let str = this.oldSysData.gljh || "";
      return str.split("/r/n").filter(item => item != "");
    },
    healthteachList() {
      let str = this.oldSysData.healthteach || "";
      return str.split("/r/n").filter(item => item != "");
    }
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.old-sys-contain {
  .old-item-con {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #e4e4e4;
    font-size: 14px;
    line-height: 18px;
    .left {
      width: 200px;
      padding: 5px 10px;
      text-align: right;
      border-right: 2px solid #e4e4e4;
      background-color: #dfe6f0;
    }
    .right {
      flex: 1;
      padding: 5px 10px;
      text-align: left;
      background-color: #fff;
    }
  }
}
</style>
