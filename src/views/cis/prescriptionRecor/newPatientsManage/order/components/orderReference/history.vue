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
    <westHistoryShow
      ref="westHistoryShow"
      v-loading="tableLoading"
      :data="list"
      adviceType="west"
      class="content"
    ></westHistoryShow>
    <!-- 校验弹框 -->
    <!-- :modal-append-to-body="false" -->
    <l-dialog 
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="analysisVisible" 
      title="校验结果" 
      width="1000px" 
      @confirm="confirmQuote" 
      @cancel="cancelQuote">
      <template slot="content">
        <analysisResults ref="analysisResults" :data="analysisResultsData" v-loading="quoteBtnLoading"></analysisResults>
      </template>
    </l-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import westHistoryShow from "@/components/adviceCommon/modules/historyAdvice.vue";
import { mapActions, mapGetters } from "vuex";
import { getWestOrdersByVisit } from "@/api/systemManagement/dataMaintain/adviceItem";

import { getRecipeCode, saveOrders, quoteAdviceItem, selectHistoryRecipes, saveOrdersByTemp, batchSaveOrders} from "@/api/cis/order/order";

// import analysisResults from "@/components/adviceCommon/modules/analysisResults.vue";
import analysisResults from "@/components/adviceCommon/modules/analysisModule/multAnalysis.vue";
import { deepClone } from "@/utils/index.js";

export default {
  props: ["visitCode", "hosId"],
  data() {
    return {
      tableLoading: false,
      list: [],
      quoteBtnLoading: false,
      analysisResultsData: [],
      analysisVisible: false,
      parentRow: {}
    };
  },
  components: {
    westHistoryShow,
    analysisResults
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("adviceCommon", ["westPharmacyObject"])
  },
  methods: {
    // 校验过后 确定引用
    async confirmQuote (){
      if (this.quoteBtnLoading) return;

      try {
        await this.$refs.analysisResults.validateSubmit();
      } catch (error) {
        return;
      }

      // 返回的数据
      // this.$emit("copy", this.multipleSelection);
      // 用户选中的引用
      let selectList = this.$refs.analysisResults.getMultipleSelection();
      
      if (selectList.length == 0) {
        this.$message.warning("暂无可引用的数据！");
        return;
      }



      // let rpCode = "";
      // try {
      //   rpCode = await this.getRecipeCode();
      // } catch (error) {
      //   return;
      // }
      // let ajaxData = [];
      let ajaxData = selectList;
      // try {
      //   ajaxData = await this.getRecipeCodeList(selectList);
      // } catch (error) {
      //   return;
      // }

      // let ajaxData = this.setRpCode(rpCode, selectList);
      

      //删除数据里的id
      ajaxData = this.deleteId(ajaxData);
      // console.log("ajaxData:::", ajaxData);
      try {
        await this.saveOrdersByTempFunc(ajaxData);
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
     // 将确定引用的数据保存到服务端
    saveOrdersByTempFunc (detailData = []){

      return new Promise(async (resolve, reject) => {
         this.quoteBtnLoading = true;
        // 引用到医嘱列表中
        try {
          let { code, msg } = await batchSaveOrders(detailData);
          if (code === 1) {
            this.$message.success(msg || "医嘱模板引用成功");
            resolve(true);
          } else {
            this.$message.error(msg || "医嘱模板引用失败");
            reject(false);
          }
          this.quoteBtnLoading = false;
        } catch (error) {
          this.quoteBtnLoading = false;
          reject(false);
        }
      });
    },
    // 增加 recipeCode
    setRpCode (code, selectList){
      selectList.forEach(element => {
        element.recipeCode = code;
      });
      return selectList;
    },
    async getRecipeCodeList (list = []){
      return new Promise(async (resolve, reject) => {
      // let rList = [];
        for (let index = 0; index < list.length; index++) {
          try {
            let rpCode = await this.getRecipeCode();
            // console.log("rpCode", rpCode);
            list[index]["recipeCode"] = rpCode;
            console.log("recipeCode", list[index]["recipeCode"]);
          } catch (error) {
            reject(false);
          }

          // rList.push(rpCode);
        }
        resolve(list);
      });
    },
    getRecipeCode (){
      this.quoteBtnLoading = true;
      let { visitCode} = this.receivePatientData;
      return new Promise(async (resolve, reject) => {
        // 获取处方号
        try {
          let rep = await getRecipeCode({ visitCode });

          if (rep.code === 1) {
            // rpNo = rep.data;
            resolve(rep.data)
          } else {
            this.quoteBtnLoading = false;
            this.$message.error(rep.msg || " 获取处方号失败！");
            reject(false);
          }
        } catch (error) {
          this.quoteBtnLoading = false;
          reject(false);
        }
      });
    },
   
    cancelQuote (){
      this.analysisVisible = false;
    },
    copyHandler() {
      let checkedIds = this.$refs.westHistoryShow.getCheckedIds();
      if (checkedIds.length == 0) {
        this.$message.warning("未选中处方记录，无法引用");
        return;
      }

      console.log("checkList::::", checkedIds);
      console.log("this.receivePatientData::::", this.receivePatientData);
      let { patientGender,identificationNum, patientId, visitCode} = this.receivePatientData;
      let { selected } = this.westPharmacyObject;
      let ajaxData = {
        identificationNum,
        patientId,
        receiveDept: selected.deptId,
        patientGender,
        visitCode,
        adviceList: checkedIds
      }
      this.quoteAdviceItem(ajaxData);
    },

    // 数据里面增加 
    // handleData (list = []){
    //   // let adviceList = list.filter
    //   let convertList = [];
    //   // patientGender  性别
    //   // getIdentificationNum 身份证号
    //   // patientId 当前患者id
    //   console.log("this.receivePatientData:::::", this.receivePatientData);
    //   let { patientGender,identificationNum, patientId} = this.receivePatientData;
    //   let { selected } = this.westPharmacyObject;
    //   list.forEach(element => {
    //     let item = {
    //       ...{ 
    //         identificationNum,
    //         patientId,
    //         receiveDept: selected.deptId,
    //         patientGender
    //        },
    //       ...element
    //     }
    //     convertList.push(item);
    //   });
    //   console.log("convertList:::", convertList);
    //   return convertList;
    // },
    // 批量校验
    async quoteAdviceItem(ajaxData = {}) {
      if (this.tableLoading) return false;
      this.tableLoading = true;
      return new Promise(async (resolve, reject) => {
        try {
          let { code, msg, data } = await selectHistoryRecipes(ajaxData);
          if (code === 1 || code === 20001005) {
            // this.addHerbalOrder(data);
            this.analysisResultsData = data;
            this.analysisVisible = true;
          } else {
            this.$message.error(msg || "批量校验失败");
          }
          this.tableLoading = false;
        } catch (error) {
          this.$message.error(error.message || "批量校验失败");
          this.tableLoading = false;
        }
        // console.log("analysisResultsData", this.list);
        // this.analysisResultsData = this.list[0].adviceList;
        // this.analysisVisible = true;
      });
    },
    async addHerbalOrder(ajaxData) {
      this.tableLoading = true;
      try {
        let { code, msg, data } = await addHerbalOrder(ajaxData);
        if (code === 1) {
          this.$message.success(msg || "引用成功");
          this.$emit("copy", data);
        } else {
          this.$message.error(msg || "引用保存失败");
        }
        this.tableLoading = false;
      } catch (error) {
        this.$message.error(error.message || "引用保存失败");
        this.tableLoading = false;
      }
    },
    reloadTableData(row) {
      this.parentRow = row;
      this.getAdviceItemFun();
    },
    getAdviceItemFun() {
      let obj = this.getParams();
      this.tableLoading = true;
      getWestOrdersByVisit(obj).then(res => {
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
          this.list = this.convertData(res.data);
        } else {
          this.$message("查询失败");
        }
        this.tableLoading = false;
      }).catch(()=>{
        // this.$message.error("查询失败");
      }).finally (()=>{
        this.tableLoading = false;
      });
    },
    // 变化字段， 引用时需要
    convertData (list = []){
      let convertList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let convetItem = {
          ...{
            packUnit: item.unitKey
          },
          ...item
        }
        convertList.push(convetItem);
      }
      return convertList;
    },
    getParams() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        visitCode: this.parentRow.visitCode || "",
        // itemType:this.form.checkedCat === '1' ? this.form.checkedCat : ""
        itemType: "10,12",
        name: "",
        hosId: this.parentRow.hosId
      };
      return { ...obj, ...this.form };
    }
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

  // .fixedZindex {
  //   z-index: 10000;
  // }
}
</style>
