<template>
  <div class="page">
    <!-- 简洁版 -->
    <el-button
      v-if="simple"
      :disabled="disabled"
      @click.stop.prevent="setVisitType"
      class="ellipsis bigBtn"
    > {{ showText }} </el-button>
    <!-- 正常版 -->
    <LFormtTitle v-else label="就诊类别" :disabled="disabled">
      <el-button
        :disabled="disabled"
        type="text"
        @click.stop.prevent="setVisitType"
        class="ellipsis"
      > {{ showText }} </el-button>
    </LFormtTitle>
    <doctorPsReview
      :info="info"
      :visitCode="visitCode"
      :show.sync="alertShow"
      @setShowText="setShowText"
      @isOk="isOk"
    ></doctorPsReview>
  </div>
</template>

<script type="text/ecmascript-6">
import doctorPsReview from "./diseaseSelectAlert";
export default {
  props: {
    simple: {
      type: Boolean
    },
    visitCode: {
      type: String
    },
    info:{},
    disabled:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      alertShow: false,
      showText: ""
    };
  },
  methods: {
    setVisitType() {
      if (this.disabled) return;
      this.alertShow = true;
      console.log("点击弹窗！！", this.alertShow);
    },
    isOk(data) {
      console.log("接收到的data", data);
      this.showText = data.diseaseTypeLabel;
      this.$emit("update:info", data);
      this.$emit("comfirm", data);
      this.alertShow = false;
    },
    setShowText (data){
      console.log("接收到的data22222", data);
      this.showText = data.diseaseTypeLabel;
    }
  },
  components: {
    doctorPsReview
  }
};
</script>

<style scoped lang="scss">
.page {
  display: inline-block;
  vertical-align: bottom;
  padding: 0 5px;
  font-size: 0;
}

.ellipsis {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  max-width: 300px;
}

.bigBtn {
  height: 34px !important;
}
</style>
