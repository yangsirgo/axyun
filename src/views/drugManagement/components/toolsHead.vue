<template>
  <div>
    <div class="head width100">
     <!-- {{
      currentDrug.storageCode && drugStorageData[currentDrug.storageCode]
      ? drugStorageData[currentDrug.storageCode]
      : "药库"
      }} -->
      {{curPharmacy}}
    </div>
    <div class="drugName">{{ currentDrug.drugName }}</div>
    <div class="spec">{{ currentDrug.spec }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import stockApi from "@/api/hmm/stock.js";
import mixin from "@/mixins/drugTools.js";
import stock from "@/api/hmm/stock";
export default {
  name: "drugToolsHead",
  mixins: [mixin],
  data(){
    return{
      curPharmacy:'',
    }
  },
  computed: {
    ...mapGetters("drugManagement", ["currentDrug"])
  },
  created() {
    this.getPharmacy();
  },
  methods:{
    // 获取当前药房
    getPharmacy() {
      stock
        .isOpenDialog()
        .then((res) => {
          if (res.code === 1) {
            this.curPharmacy = res.data.storageName;
          }
        })
        .catch();
    },
  }
};
</script>

<style lang="scss" scoped>
.head {
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 400;
  color: $l-color-fontcolor-3;
  border-bottom: 1px solid $l-color-bgcolor-11;
  margin-bottom: 10px;
  min-height: 27px;
}
.drugName {
  font-size: 16px;
  font-weight: bold;
  color: $l-color-fontcolor-3;
  margin-bottom: 10px;
}
.spec {
  font-size: 14px;
  font-weight: 400;
  color: $l-color-fontcolor-3;
  margin-bottom: 20px;
}
</style>
