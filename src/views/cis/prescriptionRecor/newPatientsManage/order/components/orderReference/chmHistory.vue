<template>
  <div class="page">
    <l-card-title class="title">
      <template slot="left">处方信息</template>
    </l-card-title>
    <div class="utils">
      <el-button
        type="primary"
        size="mini"
        :loading="copyBtnLoading"
        @click="copyHandler"
      >引用</el-button>
    </div>
    <chmHistoryShow
      ref="chmHistoryShow"
      v-loading="tableLoading"
      :data="list"
      class="content"
    ></chmHistoryShow>
    <l-dialog 
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="analysisVisible" 
      title="校验结果" 
      width="1000px" 
      @confirm="confirmQuote" 
      @cancel="cancelQuote">
      <template slot="content">
        <analysisResults 
          ref="analysisResults" 
          :data="analysisResultsData" 
          v-loading="quoteBtnLoading"></analysisResults>
      </template>
    </l-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import chmHistoryShow from "@/components/adviceCommon/modules/historyAdvice.vue";
import { getOrdersByVisit, addHerbalOrder, quoteHerbalAdviceItem } from "@/api/systemManagement/dataMaintain/adviceItem";
import { selectHistoryRecipes, batchSaveOrders} from "@/api/cis/order/order";
import { mapActions, mapGetters } from "vuex";
// import analysisResults from "@/components/adviceCommon/modules/analysisResults.vue";
import analysisResults from "@/components/adviceCommon/modules/analysisModule/multAnalysis.vue";
import { deepClone } from "@/utils/index.js";

export default {
  props: ["visitCode", "hosId"],
  data() {
    return {
      copyBtnLoading: false,
      analysisVisible: false,
      tableLoading: false,
      quoteBtnLoading: false,
      analysisResultsData: [],
      list: [],
      parentRow: {}
    };
  },
  components: {
    analysisResults,
    chmHistoryShow
  },
  methods: {
        // 校验过后 确定引用
    async confirmQuote (){
      if (this.quoteBtnLoading) return;
      // 返回的数据
      // this.$emit("copy", this.multipleSelection);
      
      try {
        await this.$refs.analysisResults.validateSubmit();
      } catch (error) {
        return;
      }

      // 用户选中的引用
      let selectList = this.$refs.analysisResults.getMultipleSelection();

      if (selectList.length == 0) {
        this.$message.warning("暂无可引用的数据！");
        return;
      }

      let rpCode = "";
      // try {
      //   rpCode = await this.getRecipeCode();
      // } catch (error) {
      //   return;
      // }
      let ajaxData = selectList;
      // try {
      //   ajaxData = await this.getRecipeCodeList(selectList);
      // } catch (error) {
      //   return;
      // }
      // let ajaxData = this.setRpCode(rpCode, selectList);
      

      //删除数据里的id
      // ajaxData = this.deleteId(ajaxData);
      // console.log("ajaxData:::", ajaxData);

      try {
        await this.addHerbalOrder(ajaxData);
        this.analysisVisible = false;
        this.$emit("copy");
      } catch (error) {
        
      }
      
    },
    deleteId (selectList){
      let cloneList = deepClone(selectList);
      cloneList.forEach(element => {
        delete element.id;
      });
      return cloneList;
    },
    async copyHandler() {
      let checkList = this.$refs.chmHistoryShow.getCheckedIds();
      console.log("checkList", checkList);
      if (checkList.length == 0) {
        this.$message.warning("未选中处方记录，无法引用");
        return;
      }
      // let ajaxList = this.list.filter(item => {
      //   return checkList.indexOf(item.recipeCode) > -1
      // });
    
      // console.log("visitCode:::::", this.visitCode);
      // 增加 visicode, 校验患者就诊时效 是否开诊断
      // checkList.forEach((item)=>{
      //   item.visitCode = this.visitCode;
      // });

      let { patientGender,identificationNum, patientId, visitCode} = this.receivePatientData;
      let { selected } = this.chmPharmacyObject;
      let ajaxData = {
        identificationNum,
        patientId,
        receiveDept: selected.deptId,
        patientGender,
        visitCode,
        adviceList: checkList
      }

      // 函数节流
      if (this.copyBtnLoading) return;

      try {
        this.copyBtnLoading = true;
        await this.quoteHerbalAdviceItem(ajaxData);
      } catch (error) {} finally {
        this.copyBtnLoading = false;
      }
      
    },
    cancelQuote (){
      this.analysisVisible = false;
    },
    async quoteHerbalAdviceItem(list = []) {
      this.tableLoading = true;
      return new Promise(async (resolve, reject) => {
        try {
          let { code, msg, data } = await selectHistoryRecipes(list);
          if (code === 1) {
          //   console.log("visitCode:::::", this.visitCode);
          //   data.forEach((item)=>{
          //     item.visitCode = this.visitCode;
          //   });
          //   try {
          //     await this.batchSaveOrders(data);
          //     resolve(true);
          //   } catch (error) {
          //     reject(false);
          //   }
            
          // } else if (code == 20001005) {
            console.log(data,data);
            // 弹出校验情况
            this.analysisResultsData = data;
            this.analysisVisible = true;
            resolve(true);
          } else {
            this.$message.error(msg || "引用失败");
            reject(false);
          }
          this.tableLoading = false;
        } catch (error) {
          this.$message.error(error.message || "引用失败");
          this.tableLoading = false;
          reject(false);
        }
      });
    },
    async addHerbalOrder(ajaxData) {
      this.tableLoading = true;
      let { visitCode} = this.receivePatientData;
      //替换 visitCode
      ajaxData.forEach((item)=>{
        item.visitCode = visitCode;
      });

      return new Promise(async (resolve, reject) => {
        try {
          let { code, msg, data } = await batchSaveOrders(ajaxData);
          if (code === 1) {
            this.$message.success(msg || "引用成功");

            this.$emit("copy", data);
            resolve(true);
          } else {
            this.$message.error(msg || "引用保存失败");
            reject(false);
          }
          this.tableLoading = false;
        } catch (error) {
          this.$message.error(error.message || "引用保存失败");
          this.tableLoading = false;
          reject(false);
        }
      });
    },
    reloadTableData(row) {
      this.parentRow = row;
      this.getAdviceItemFun();
    },
    getAdviceItemFun() {
      let obj = this.getParams();
      this.tableLoading = true;
      getOrdersByVisit(obj).then(res => {
        if (res.code === 1) {
          //   let list = [];
          //   console.log(res.data);
          // res.data.forEach((item)=>{
          //   if (Array.isArray(item)) {
          //     item.forEach((sonItem)=>{
          //       list.push(sonItem);
          //     })
          //   }
          // });
          // this.tableData = this.convertData(list);
          // console.log(list);
          //   this.setSomeDrugsTargetFunc(res.data);
          this.list = res.data;
        } else {
          this.$message("查询失败");
        }
        this.tableLoading = false;
      });
    },
    discribeData (list = []){
      // list.forEach((item)=>{
      //   item.orderItemName = item.orderItemName
      // });
    },
    getParams() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        visitCode: this.parentRow.visitCode || "",
        // itemType:this.form.checkedCat === '1' ? this.form.checkedCat : ""
        itemType: 11,
        hosId: this.parentRow.hosId
      };
      return { ...obj, ...this.form };
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("adviceCommon", ["chmPharmacyObject"])
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
