<template>
  <div class="page">
    <l-card-title class="title">
      <template slot="left">处方信息</template>
    </l-card-title>
    <div class="utils">
      <el-button
        type="primary"
        size="mini"
        @click="copyHandler"
      >引用</el-button>
    </div>
    <chmHistoryShow
      ref="chmHistoryShow"
      v-loading="tableLoading"
      :data="list"
      class="content"
    ></chmHistoryShow>
  </div>
</template>

<script type="text/ecmascript-6">
import chmHistoryShow from "@/components/adviceCommon/modules/historyAdvice.vue";
// import { addHerbalOrder, quoteHerbalAdviceItem } from "@/api/systemManagement/dataMaintain/adviceItem";
import { getOrdersByVisit, quoteHerbalAdviceItem } from "@/api/homeSickbeds/hsDiagTreat/hsChmRecipe.js";
import { mapActions, mapGetters } from "vuex";
import { getWholeChmDataStructure, getDiagnose } from "@/views/homeSickbeds/hsDiagTreat/chmTreat/components/utils.js"
import { showTipAlert } from "@/views/homeSickbeds/hsDiagTreat/order/module/adviceUtil/util.js";

export default {
  props: ["visitCode"],
  data() {
    return {
      tableLoading: false,
      list: [],
      parentRow: {}
    };
  },
  components: {
    chmHistoryShow
  },
  methods: {
    copyHandler() {
      let checkList = this.$refs.chmHistoryShow.getCheckedIds("recipeId");
      if (checkList.length == 0) {
        this.$message.warning("未选中处方记录，无法引用");
        return;
      }

      console.log("checkList", checkList);

      let ajaxList = [];
      let cache = {};
      checkList.map(item => {//去重
        if(!cache[item.id])ajaxList.push(item.id);
        cache[item.id] = item.id;
      });

      console.log("ajaxList", ajaxList);

      let ajaxData = getWholeChmDataStructure("", 0, []);
      let { id } = this.receivePatientData;
      let { selected } = this.chmPharmacyObject;
      ajaxData = {
        ...ajaxData,
        ...{
          treatId: id,
          pharmacyId: selected.deptId,
          recipeIds: ajaxList
          // recipeIds: ["8ae40d867848485d017849ce07ae0017"]
        }
      }


      console.log("ajaxData::::", ajaxData);
      

      this.quoteHerbalAdviceItem(ajaxData);
    },

    async quoteHerbalAdviceItem(list = []) {
      this.tableLoading = true;
      try {
        let { code, msg, data, tips } = await quoteHerbalAdviceItem(list);
        if (code === 1) {

          try {
            await showTipAlert(tips);
          // eslint-disable-next-line no-empty
          } catch (error) {

          }

          this.$emit("copy", data);
        } else {
          this.$message.error(msg || "引用失败");
        }
        this.tableLoading = false;
      } catch (error) {
        this.$message.error(error.message || "引用失败");
        this.tableLoading = false;
      }
    },
    reloadTableData(row = {}) {
      if (Object.keys(row).length == 0) {
        this.list = [];
        return;
      }
      this.parentRow = row;
      this.getAdviceItemFun();
    },
    //转换成处方需要的字段
    convertData (rpList = []){
      // debugger
      let returnList = [];
          for (let i = 0; i < rpList.length; i++) {
            let item = rpList[i];
            let drugs = item.drugs;
            let newDrugs = [];
            for (let j = 0; j < drugs.length; j++) {
              let drugsItem = drugs[j];
              let newDrugsItem = {
                ...drugsItem,
                ...{
                  orderItemName: drugsItem.itemName,
                  unitKey: drugsItem.unit,
                  spec: drugsItem.item.spec
                }
              }
              newDrugs.push(newDrugsItem);
            }
            let newItem = {
              ...item,
              ...{
                recipeCode: item.no,
                adviceList: newDrugs
              }
            };
            returnList.push(newItem);
          }
          console.log("returnList::::::",  rpList, returnList);
          return returnList;
    },
    //获取历史诊断 处方列表
    getAdviceItemFun() {
      let obj = this.getParams();
      this.tableLoading = true;
      getOrdersByVisit(obj).then(res => {
        if (res.code === 1) {
          let serverData = this.convertData(res.data);
          this.list = serverData;
        } else {
          this.$message("查询失败");
        }
        this.tableLoading = false;
      });
    },
    getParams() {
      let obj = {
        pageNo: 1,
        pageSize: 1000,
        treatId: this.parentRow.id || "",
        // itemType:this.form.checkedCat === '1' ? this.form.checkedCat : ""
        // itemType: 11
      };
      return { ...obj, ...this.form };
    }
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("adviceCommon", [ "chmPharmacyObject"]),
  }
};
</script>

<style scoped lang="scss">
.page {
  padding: 10px;
  display: flex;
  flex-direction: column;
  .utils {
    display: flex;
    justify-content: flex-end;
  }
  .content {
    flex: 1;
  }
}
</style>
