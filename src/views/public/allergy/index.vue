<template>
  <div class="allergy width100 height100">
    <allergy-list ref="allergyList" @send-data="getInfo" :hosType="hosType" />
    <allergy-form :ainfo="aInfo" @load-list="loadListData" :hosType="hosType" />
  </div>
</template>
<script>
import allergyList from "./component/allergyList";
import allergyForm from "./component/allergyForm";

export default {
  components: { allergyList, allergyForm },
  // patientId:病患id
  props: ["patientId", "hosType"],
  data() {
    return {
      aInfo: {
        type: "",
        data: {}
      }
    };
  },
  methods: {
    getInfo(data) {
      this.aInfo = data;
    },
    // 重新加载左侧列表数据
    loadListData() {
      this.$refs.allergyList.loadData();
    }
  }
};
</script>
<style lang="scss" scoped>
.allergy {
  background-color: $l-color-white;
  overflow: hidden;
}
</style>