/* eslint-disable complexity */
<template>
  <div class="temp">
    <div class="top-container">
      <el-radio-group
        v-model="cateogry"
        class="align-center"
        @change="typeChange"
      >
        <el-radio
          :label="item.code"
          v-for="item in classification"
          :key="item.code"
        >{{item.name}}</el-radio>
      </el-radio-group>
      <el-input
        placeholder="请输入检索条件"
        v-model="keyword"
        @change="keywordUpdate"
        style="margin-top:8px;"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="keywordUpdate"
        ></el-button>
      </el-input>
    </div>
    <div class="content overflow-scroll-vertical">
      <div
        class="list"
        v-infinite-scroll="loadNextPage"
        infinite-scroll-disabled="tlm_noMore"
      >
        <el-collapse v-model="activeNames">
          <l-collapse-item
            sty="2"
            v-for="(item, index) in showData"
            :key="'list' + index"
            :name="index"
          >
            <template slot="title">
              <div class="width100 height100">
                <span
                  class="templetName"
                  :title="item.firstCategoryName"
                >{{item.firstCategoryName}}</span>
              </div>
            </template>
            <template slot="content">
              <div v-for="(v,k) in item.children"
              :key="k"
              :class="{'list-item':true,'activiti-state':activeNameIndex==index && currentIndex==k}"
              :title="v.templetName"
              @click.stop="quoteFunc(v, k, index)">{{ v.templetName }}</div>
            </template>
          </l-collapse-item>
          <p
            v-if="tlm_isLoading"
            class="load-list-bottom"
          >{{$t('base.loading')}}</p>
          <p
            v-if="!tlm_isLoading && tlm_noMore"
            class="load-list-bottom"
          >{{$t('base.noMore')}}</p>
        </el-collapse>
      </div>
    </div>
    <el-dialog
      :title="templeteName"
      :visible.sync="dialogVisible"
      width="70%"
      append-to-body
    >
      <div style="padding:5px; min-height: 300px">
        <el-table
          ref="templeteTableData"
          :data="templeteTableData"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            v-for="(item,index) in templeteTableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <template v-if="item.prop=='dosageUnit'">
                <span
                  :val="scope.row.dosageUnit"
                  code="DrugDoseUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop=='groupNoCls'">
                <div :class="scope.row.groupNoCls"></div>
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="quoteBtnLoading"
          @click="quoteConfirmWrapper"
        >引 用</el-button>
      </span>
    </el-dialog>
    <!-- 校验弹框 -->
    <l-dialog
      :visible.sync="deliveryVisible"
      title="校验结果"
      width="70%"
      append-to-body
      @confirm="quoteConfirmFally"
      @cancel="cancelQuote">
        <template slot="content">
        <analysisResults
          :mType="psRegorActiveTabName"
          ref="analysisResults"
          :data="analysisResultsData"
          v-loading="quoteBtnLoading"></analysisResults>
        </template>
    </l-dialog>
  </div>
</template>

<script>
import { quoteHerbalAdviceItem } from "@/api/systemManagement/dataMaintain/adviceItem";
import { getByTypeAndName } from "@/api/cis/toolBox/toolBox";
// import analysisResults from "@/components/adviceCommon/modules/analysisResults.vue";
import analysisResults from "@/components/adviceCommon/modules/analysisModule/multAnalysis.vue";
import {
  getRecipeCode,
  saveOrdersByTemp,
  batchSaveOrders,
  cisTempSave,
  outpatientNonDrugPageList,
  quoteAdviceItem,
  selectTemplateDetails,
  getClassification
} from "@/api/cis/order/order";
import service from "@/api/wconf/cnfDictionary.js"
import { mapActions, mapGetters } from "vuex";
import { deepClone, Throttle } from "@/utils/index.js";
import getFirstCategoryCodeOptionsMinxin from "@/views/cis/prescriptionRecor/newPatientsManage/order/templateMaintenance/getFirstCategoryCodeOptions.js";

export default {
  name: "prescriptionTemp",
  mixins: [getFirstCategoryCodeOptionsMinxin],
  data() {
    return {
      deliveryVisible: false,
      analysisResultsData: [],
      quoteBtnLoading: false,
      showOrderCat: false,
      // 检索关键词
      keyword: "",
      // 类型值
      cateogry: "2",

      // 列表数据
      tableData: [],
      // 列表展示数据
      showData: [],
      // 分页控制参数
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 100 // 每页数据条数
      },
      // table 分页加载必须定义字段
      tlm_isLoading: false,
      // 模板数据
      templeteName: "",
      templeteTableData: [
        {
          name: "阿莫西林胶囊",
          spec: "一盒24粒",
          formCode: "5",
          drugUnit: "g"
        }
      ],
      // 表格数据
      templeteTableParams: [
        {
          prop: "itemName",
          label: "名称",
          width: "100"
        },
        {
          prop: "groupNoCls",
          label: "组",
          width: "80"
        },
        {
          prop: "spec",
          label: "规格",
          width: "80"
        },
        {
          prop: "oneDosage",
          label: "一次用量",
          width: "50"
        },
        {
          prop: "dosageUnit",
          label: "剂量单位",
          width: "50"
        }
      ],
      dialogVisible: false,
      activeNames: [],
      classification: [],
      //西药选中的药品数据列表
      westPharmacyArr: [],
      activeNameIndex: -1,
      currentIndex: -1
    };
  },
  components: {
    analysisResults
  },
  computed: {
    ...mapGetters("cis", ["leaveAppLoadKey", "psRegorActiveTabName"]),
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("adviceCommon", ["westPharmacyObject"]),
    ...mapGetters("adviceCommon", ["chmPharmacyObject"]),
    ...mapGetters("cis", ["RpTableData", "chmDispgMethCode"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    pharmacDeptId (){
      let a = "";
      switch (this.psRegorActiveTabName) {
        case "adviceTable":
        a = this.westPharmacyObject.selected.deptId;
          break;
        case "chmMedicine":
        a = this.chmPharmacyObject.selected.deptId;
          break;
        case "treatMedicine":
        a = "";
        break;
      }
      return a;
    }
  },
  async created() {
    let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum;
    this.getFirstCategoryCodeOptions({
      catalogCode: "CIS_OUTAPTIENT_MB",
      hosId
    }, () => {
      this.getClassificationAjax();
      this.loadTable();
    })
  },
  methods: {
    ...mapActions({
      setLeaveAppLoadKey: "cis/changeAdditionalOrderLoadKey",
      changeTemplateQuoteKey: "cis/changeTemplateQuoteKey",
      changeChmMedicineQuote: "cis/changeChmMedicineQuote"
    }),
    quoteFunc: Throttle(function(item, k, index) {
      this.activeNameIndex = index;
      this.currentIndex = k;
      //console.log(this.psRegorActiveTabName);
      if (this.psRegorActiveTabName === "adviceTable") {
        this.quote(item);
      } else if (this.psRegorActiveTabName === "treatMedicine") {
        //药品医嘱模板引用
        // this.treatMedicineQuote(item);
        let { patientGender,identificationNum, patientId, visitCode} = this.receivePatientData;
        let { selected } = this.westPharmacyObject;

        if(!visitCode){
          this.$message.warning("请选择患者");
          return;
        }

        // this.chmMedicineQuote(item);
        let ajaxData = {
          identificationNum,
          patientId,
          // receiveDept: selected.deptId,
          patientGender,
          visitCode, 
          dispendingMethod: this.chmDispgMethCode,
          adviceList: item.templetDetail.map((sItem)=>{ return { id: sItem.templetDetailId } })
        }

        this.batchVerification(ajaxData);

      } else if (this.psRegorActiveTabName === "chmMedicine") {

        let { patientGender,identificationNum, patientId, visitCode} = this.receivePatientData;
        let { selected } = this.westPharmacyObject;

        if(!visitCode){
          this.$message.warning("请选择患者");
          return;
        }

        // this.chmMedicineQuote(item);
        let ajaxData = {
          identificationNum,
          patientId,
          receiveDept: selected.deptId,
          patientGender,
          visitCode, 
          dispendingMethod: this.chmDispgMethCode,
          adviceList: item.templetDetail.map((sItem)=>{ return { id: sItem.templetDetailId } })
        }

        this.batchVerification(ajaxData);
      }
    }, 1000),
    grouping(list1) {
      // table 数据 成组操作
      // 将list 分组
      // return new Promise((resolve, reject) => {
      let list = [];
      let groupList = [];
      let filterList = [];
      let tableList = [];
      groupList = list1.map(item => {
        // 获取所有组
        return item.groupNo;
      });
      groupList = Array.from(new Set(groupList));
      groupList = groupList.filter((item, index) => {
        // 数组去undefind
        return item !== undefined && item != "";
      });
      groupList.forEach((item, index) => {
        //遍历 成map结构 分组
        // list = [];
        filterList = list1.filter((sonItem, sonIde) => {
          return item === sonItem.groupNo;
        });
        list.push({
          key: item,
          value: filterList
        });
      });
      list.forEach(item => {
        // 将有组item添加class
        let itemList = item.value;
        if (itemList.length == 1) return;
        itemList.map((sonItem, sonIndex) => {
          if (sonIndex === 0) {
            sonItem.groupNoCls = "bunchingUp";
          } else if (sonIndex === itemList.length - 1) {
            sonItem.groupNoCls = "bunchingDown";
          } else {
            sonItem.groupNoCls = "bunchingCenter";
          }
        });
      });
      list.map(item => {
        // 更改list格式
        item.value.map(val => {
          tableList.push(val);
        });
      });
      list1.map(item => {
        // 补充未成组项
        if (!item.groupNo) {
          tableList.push(item);
        }
      });
      return tableList
      // resolve(tableList);
      // });
    },
    // eslint-disable-next-line complexity
    // 废弃
    // async chmMedicineQuote(item) {
    //   let patient = this.receivePatientData;
    //   let detailData = [];
    //   let { selected } = this.chmPharmacyObject;
    //   let detailWrapperObj = {
    //     patientId: patient.patientId,
    //     identificationNum: patient.identificationNum,
    //     patientGender: patient.patientGender,
    //     receiveDept: selected.deptId,
    //     visitCode: patient.visitCode
    //   };

    //   if (
    //     typeof patient === "undefined" ||
    //     typeof patient.visitCode === "undefined" ||
    //     patient.visitCode === ""
    //   ) {
    //     this.$message.warning("请选择患者后才能引用医嘱模板！");
    //     return false;
    //   }


    //   // let ajaxData = { 
    //   //   adviceList: this.westPharmacyArr.map((item)=>{ return { id: item.templetDetailId } }), 
    //   //   ...detailWrapperObj,
    //   //   ...{// 中草药校验需要增加配送方式
    //   //     dispendingMethod: this.chmDispgMethCode
    //   //   }
    //   // };


    //   // try {
    //   //   await this.chmBatchVerification(ajaxData);
    //   // } catch (error) {
    //   //   return false;
    //   // }



    //   for (let i = 0; i < item.templetDetail.length; i++) {
    //     let data = item.templetDetail;
    //     if (data[i].itemId === null || data[i].itemId === "") {
    //       this.$message.error("模板有误！引用失败");
    //       return false;
    //     }
    //     detailData.push({
    //       patientId: patient.patientId,
    //       patientName: patient.patientName,
    //       visitCode: patient.visitCode,
    //       diagnosisTime: data[i].diagnosisTime || "",
    //       useWay: data[i].useWay || "", //用法
    //       quantity: data[i].quantity || "", //数量
    //       frequencyCode: data[i].frequencyCode || "", //频率
    //       frequencyTimes: data[i].frequencyTimes || "",
    //       frequencyUnit: data[i].frequencyUnit || "",
    //       onceDosage: data[i].oneDosage || "", //单次计量
    //       skinTest: data[i].skinTest || "", //皮试
    //       dropRate: data[i].dropRate || "", //滴速
    //       administrationTimeCode: data[i].administrationTimeCode || "", // 给药时间
    //       orderItemName: data[i].itemName || "",
    //       spec: data[i].spec || "",
    //       orderCat: data[i].itemCat,
    //       price: data[i].price,
    //       dosage: data[i].dosage,
    //       packQuantity: data[i].packQuantity,
    //       dosageUnit: data[i].dosageUnit,
    //       orderItemId: data[i].itemId,
    //       orderItemCat: data[i].itemCat,
    //       classCode: data[i].classCode,
    //       // receiveDept: data[i].executeDepartmentId,
    //       receiveDept: selected.deptId,
    //       manageType: data[i].manageType,
    //       formCode: data[i].formCode,
    //       unitSaleFlg: data[i].unitSaleFlg,
    //       unit: data[i].unit,
    //       unitKey: data[i].unit,
    //       unitFlag: data[i].unitFlag,
    //       limitUnit: data[i].unit,
    //       packUnit: data[i].packageUnit,
    //       stClassCode: data[i].stClassCode || "",
    //       amt: data[i].amt,
    //       day: data[i].day || "",
    //       useDay: data[i].useDay || "",
    //       isMajor: data[i].isMajor,
    //       groupNo: data[i].groupNo || "",
    //       remark: data[i].remark || "",
    //       excessReason: data[i].excessReason || "",
    //       execDeptId: data[i].executeDepartmentId,
    //       useQty: 1,// 默认一剂
    //       dispendingMethod: this.chmDispgMethCode,
    //       execDeptName: data[i].executeDepartmentName
    //     });
        
    //   }





      

    //   // this.changeChmMedicineQuote(detailData);
    //   return null;
    // },
    // eslint-disable-next-line complexity
    async treatQuoteConfirm (detailData){
      // 获取引用历次处方
      let patient = this.receivePatientData;

      if (
        typeof patient === "undefined" ||
        typeof patient.visitCode === "undefined" ||
        patient.visitCode === ""
      ) {
        this.$message.warning("请选择患者后才能引用医嘱模板！");
        return;
      }
      if (this.quoteBtnLoading) return;
 
      try {
        await this.$refs.analysisResults.validateSubmit();
      } catch (error) {
        return;
      }

      // let detailData = item;

      if(!detailData.length) {
          this.quoteBtnLoading = false;
          this.$message.warning("请勾选可以引用的医嘱项！");
          return;
      }

      console.log("detailData", detailData);

      // 引用到医嘱列表中
      try {
        let reps = await batchSaveOrders(detailData);
        if (reps.code === 1) {
          // this.dialogVisible = false;
          this.deliveryVisible = false;
          this.$message.success(reps.msg ? reps.msg : "医嘱模板引用成功");
          this.changeTemplateQuoteKey(+new Date());
        } else {
          this.$message.error(reps.msg ? reps.msg : "医嘱模板引用失败");
        }
        this.quoteBtnLoading = false;
      } catch (error) {
        this.quoteBtnLoading = false;
      }

    },
    //获取当前患者医嘱列表
    // async getTreatMedicine() {
    //   return new Promise(async (resolve, reject) => {
    //     let visitCode =
    //       typeof this.receivePatientData["visitCode"] !== "undefined"
    //         ? this.receivePatientData["visitCode"]
    //         : "all"; //获取患者就诊ID
    //     let ajaxData = {
    //       ...{
    //         pageNo: 1,
    //         pageSize: 99999,
    //         visitCode: visitCode,
    //         types: "2", //医嘱类别   如果有多个类别，用“,”拼接。
    //         itemType: 2
    //       }
    //     };
    //     try {
    //       let result = await outpatientNonDrugPageList(ajaxData, true);
    //       if (result.code === 1) {
    //         let { data } = result;
    //         resolve(data);
    //       } else {
    //         reject(result.msg || "治疗医嘱列表获取失败");
    //       }
    //     } catch (error) {
    //       reject("治疗医嘱列表获取失败");
    //     }
    //   });
    // },

    // checkDupFunc(val, dataList) {
    //   // 判断是否添加相同医嘱
    //   let haveDup = dataList.find(item => item.orderItemId === val.itemId);
    //   return new Promise((resolve, reject) => {
    //     if (haveDup) {
    //       this.$confirm("已有相同医嘱, 是否继续?", "提示", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning"
    //       })
    //         .then(() => {
    //           resolve(true);
    //         })
    //         .catch(() => {
    //           reject(false);
    //         });
    //     } else {
    //       resolve(true);
    //     }
    //   });
    // },
    // eslint-disable-next-line complexity
    // async treatMedicineQuote(item) {
    //   let patient = this.receivePatientData;
    //   let detailData = [];
    //   if (
    //     typeof patient === "undefined" ||
    //     typeof patient.visitCode === "undefined" ||
    //     patient.visitCode === ""
    //   ) {
    //     this.$message.warning("请选择患者后才能引用医嘱模板！");
    //     return false;
    //   }
    //   let treatMedicineList = [];
    //   //获取医嘱列表
    //   try {
    //     treatMedicineList = await this.getTreatMedicine();
    //   } catch (error) {
    //     return false;
    //   }
    //   //判断是否为重复的医嘱
    //   try {
    //     await this.checkDupFunc(item.templetDetail[0], treatMedicineList);
    //   } catch (error) {
    //     return false;
    //   }

    //   for (let i = 0; i < item.templetDetail.length; i++) {
    //     let data = item.templetDetail;
    //     if (data[i].itemId === null || data[i].itemId === "") {
    //       this.$message.error("模板有误！引用失败");
    //       return false;
    //     }

    //     detailData.push({
    //       patientId: patient.patientId,
    //       patientName: patient.patientName,
    //       visitCode: patient.visitCode,
    //       diagnosisTime: data[i].diagnosisTime || "",
    //       useWay: data[i].useWay || "", //用法
    //       quantity: data[i].quantity || "", //数量
    //       frequencyCode: data[i].frequencyCode || "", //频率
    //       frequencyTimes: data[i].frequencyTimes || "",
    //       frequencyUnit: data[i].frequencyUmit || "",
    //       onceDosage: data[i].oneDosage || "", //单次计量
    //       skinTest: data[i].skinTest || "", //皮试
    //       dropRate: data[i].dropRate || "", //滴速
    //       administrationTimeCode: data[i].administrationTimeCode || "", // 给药时间
    //       orderItemName: data[i].itemName || "",
    //       spec: data[i].spec || "",
    //       orderCat: data[i].itemCat,
    //       price: data[i].price,
    //       dosage: data[i].dosage,
    //       packQuantity: data[i].packQuantity,
    //       dosageUnit: data[i].dosageUnit,
    //       orderItemId: data[i].itemId,
    //       orderItemCat: data[i].itemCat,
    //       classCode: data[i].classCode,
    //       receiveDept: data[i].executeDepartmentId,
    //       manageType: data[i].manageType,
    //       formCode: data[i].formCode,
    //       unitSaleFlg: data[i].unitSaleFlg,
    //       unit: data[i].unit,
    //       packUnit: data[i].packageUnit,
    //       stClassCode: data[i].stClassCode || "",
    //       amt: data[i].amt,
    //       day: data[i].day || "",
    //       useDay: data[i].useDay || "",
    //       isMajor: data[i].isMajor,
    //       groupNo: data[i].groupNo || "",
    //       remark: data[i].remark || "",
    //       excessReason: data[i].excessReason || "",
    //       execDeptId: data[i].executeDepartmentId,
    //       execDeptName: data[i].executeDepartmentName
    //     });
    //   }
    //   // 引用到医嘱列表中
    //   let reps = await cisTempSave(detailData);
    //   if (reps.code === 1) {
    //     this.dialogVisible = false;
    //     this.changeTemplateQuoteKey(+new Date());
    //     this.$message.success(reps.msg ? reps.msg : "医嘱模板引用成功");
    //   } else {
    //     this.$message.error(reps.msg ? reps.msg : "医嘱模板引用失败");
    //   }
    //   return null;
    // },
    getClassificationAjax() {
      getClassification().then(data => {
        if (data.code === 1) {
          this.classification = data.data;
        }
      });
    },
    // table加载下一页
    async loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }

      this.pageParams.pageNo++;
      await this.loadTable();
    },
    // 加载table数据
    async loadTable() {
      try {
        this.tlm_isLoading = true;
        let params = {
          type: this.cateogry,
          name: this.keyword,
          pageNum: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize
        };
        switch (this.psRegorActiveTabName) {
          case "adviceTable":
            params.itemCat = 10;
            this.showOrderCat = false;
            break;
          case "chmMedicine":
            params.itemCat = 11;
            this.showOrderCat = false;
            break;
          case "treatMedicine":
            params.itemCat = 2;
            this.showOrderCat = true;
            break;
        }
        let response = await getByTypeAndName(params);
        if(response.code === 1) {
          this.pageParams = {
            pageNo: this.pageParams.pageNo,
            pageSize: response.pageSize,
            total: response.total
          };
          this.tlm_isLoading = false;
          if (this.pageParams.pageNo === 1) {
            this.tableData = response.data;
            this.activeNameIndex = -1;
            this.currentIndex = -1;
          } else {
            this.tableData = this.tableData.concat(response.data);
          }
          let arr = this.groupBy(deepClone(this.tableData));
          this.showData = arr;
          console.log("新组成的数据：",arr)
          if(this.keyword === "") {
            this.activeNames = [0];
          } else {
            for(let i in this.showData) {
              if(this.activeNames.indexOf(Number(i) < -1)) {
                this.activeNames.push(Number(i));
              }
            }
          }
        }
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    // 搜索关键词
    keywordUpdate() {
      console.log("keywordUpdate", this.keyword);
      this.loadTable();
    },
    // 分类切换
    typeChange() {
      this.pageParams = {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 100 // 每页数据条数
      };
      this.activeNames = [];
      this.loadTable();
    },
    // 显示诊断详情
    quote(data) {
      this.templeteName = data.templetName;
      this.dialogVisible = true;
      //成组处理
      this.templeteTableData = this.grouping(data.templetDetail);
      //初始化所有项目勾选
      this.$nextTick(()=>{
        for(let j in this.templeteTableData) {
          this.$refs.templeteTableData.toggleRowSelection(this.templeteTableData[j],true);
        }
      })
    },
    // 中草药批量校验
    async chmBatchVerification (list) {
      this.quoteBtnLoading = true;
      return new Promise(async (resolve, reject)=>{
        try {
          let { code, msg, data } = await selectTemplateDetails(list);
          if (code === 1) {
            // console.log("visitCode:::::", this.visitCode);
            this.dialogVisible = false;//关闭 弹窗按钮
            // let { adviceList } = list[0];
            // console.log("adviceList", adviceList);
            this.changeChmMedicineQuote(data);
            resolve(true);
          } else if (code == 20001005) {
            console.log(data,data);
            // 弹出校验情况
            this.analysisResultsData = data;
            this.dialogVisible = false;//关闭 弹窗按钮
            this.deliveryVisible = true;
            resolve(true);
          } else {
            this.$message.error(msg || "引用失败");
            reject(false);
          }
          this.quoteBtnLoading = false;
         } catch (error) {
           this.$message.error(error.message || "引用失败");
           this.quoteBtnLoading = false;
          reject(false);
        }
      })
    },
    // 批量校验
    batchVerification (ajaxData){
      this.quoteBtnLoading = true;
      return new Promise(async (resolve, reject) => {
        try {
          let { code, msg, data } = await selectTemplateDetails(ajaxData);
          if (code === 1 || code === 20001005) {
            // this.addHerbalOrder(data);
            this.analysisResultsData = data;
            this.dialogVisible = false;//关闭 弹窗按钮
            this.deliveryVisible = true;
          } else {
            this.$message.error(msg || "批量校验失败");
          }
          this.quoteBtnLoading = false;
        } catch (error) {
          // this.$message.error(error.message || "批量校验失败");
          this.quoteBtnLoading = false;
        }
        // console.log("analysisResultsData", this.list);
        // this.analysisResultsData = this.list[0].adviceList;
        // this.analysisVisible = true;
      });
    },
    quoteConfirmWrapper (){
      let checkedIds = this.westPharmacyArr.map((item)=>{ return { id: item.templetDetailId } });
      // let checkedIds = this.handleData(null, null);
      // let checkedIds = this.westPharmacyArr.filter(item=> item.templetDetailId);
      console.log("checkedIds", checkedIds);
      if (checkedIds.length == 0) {
        this.$message.warning("未选中处方记录，无法引用");
        return;
      }

      let { patientGender,identificationNum, patientId, visitCode} = this.receivePatientData;
      let { selected } = this.westPharmacyObject;
      
      if(!visitCode){
        this.$message.warning("请选择患者！");
        return;
      }

      let ajaxData = {
        identificationNum,
        patientId,
        receiveDept: selected.deptId,
        patientGender,
        visitCode, 
        adviceList: checkedIds
      }

      this.batchVerification(ajaxData);
    },
    cancelQuote (){
      this.deliveryVisible = false;
    },
    // quoteConfirmWrapper (item){
    //   switch (this.psRegorActiveTabName) {
    //     case "adviceTable":
    //       this.quoteConfirm (item); 
    //       break;
    //     case "chmMedicine":
          
    //       break;
    //     case "treatMedicine":
          
    //       break;
    //   }

    // },

    quoteConfirmFally: Throttle(async function (item){
      let selectList = this.$refs.analysisResults.getMultipleSelection();
      // console.log("selectList", selectList);
      if (selectList.length == 0) {
        this.$message.warning("暂无可引用的数据！");
        return;
      }
      
      switch (this.psRegorActiveTabName) {
        case "adviceTable":
          this.quoteConfirm (selectList); 
          break;
        case "chmMedicine":
          // eslint-disable-next-line no-case-declarations
          // let nSelectList = this.chmMedicineDataTrans(selectList);
          // console.log("selectList::::", nSelectList);
          
          try {
            await this.$refs.analysisResults.validateSubmit();
          } catch (error) {
            return;
          }
          
          await this.changeChmMedicineQuote(selectList);
          this.deliveryVisible = false;
          break;
        case "treatMedicine":
          this.treatQuoteConfirm (selectList); 
          break;
      }
    }, 2000),

    // 中药的字段转换
    chmMedicineDataTrans (dataList = []){
      let detailData = [];
      let patient = this.receivePatientData;
      let { selected } = this.chmPharmacyObject;
      
      for (let i = 0; i < dataList.length; i++) {
        let data = dataList;
        if (data[i].itemId === null || data[i].itemId === "") {
          this.$message.error("模板有误！引用失败");
          return false;
        }
        detailData.push({
          patientId: patient.patientId,
          patientName: patient.patientName,
          visitCode: patient.visitCode,
          diagnosisTime: data[i].diagnosisTime || "",
          useWay: data[i].useWay || "", //用法
          quantity: data[i].quantity || "", //数量
          frequencyCode: data[i].frequencyCode || "", //频率
          frequencyTimes: data[i].frequencyTimes || "",
          frequencyUnit: data[i].frequencyUnit || "",
          onceDosage: data[i].oneDosage || "", //单次计量
          skinTest: data[i].skinTest || "", //皮试
          dropRate: data[i].dropRate || "", //滴速
          administrationTimeCode: data[i].administrationTimeCode || "", // 给药时间
          orderItemName: data[i].itemName || "",
          spec: data[i].spec || "",
          orderCat: data[i].itemCat,
          price: data[i].price,
          dosage: data[i].dosage,
          packQuantity: data[i].packQuantity,
          dosageUnit: data[i].dosageUnit,
          orderItemId: data[i].itemId,
          orderItemCat: data[i].itemCat,
          classCode: data[i].classCode,
          // receiveDept: data[i].executeDepartmentId,
          receiveDept: selected.deptId,
          manageType: data[i].manageType,
          formCode: data[i].formCode,
          unitSaleFlg: data[i].unitSaleFlg,
          unit: data[i].unit,
          unitKey: data[i].unit,
          unitFlag: data[i].unitFlag,
          limitUnit: data[i].unit,
          packUnit: data[i].packageUnit,
          stClassCode: data[i].stClassCode || "",
          amt: data[i].amt,
          day: data[i].day || "",
          useDay: data[i].useDay || "",
          isMajor: data[i].isMajor,
          groupNo: data[i].groupNo || "",
          remark: data[i].remark || "",
          excessReason: data[i].excessReason || "",
          execDeptId: data[i].executeDepartmentId,
          useQty: 1,// 默认一剂
          dispendingMethod: this.chmDispgMethCode,
          execDeptName: data[i].executeDepartmentName
        });
        
      }
      return detailData;
    },
    // 引用
    // eslint-disable-next-line complexity
    async quoteConfirm (item) {
      // 获取引用历次处方
      let patient = this.receivePatientData;
      let rpData = this.$store.state.cis.RpTableData;
      if (
        typeof patient === "undefined" ||
        typeof patient.visitCode === "undefined" ||
        patient.visitCode === ""
      ) {
        this.$message.warning("请选择患者后才能引用医嘱模板！");
        return;
      }
      if (this.quoteBtnLoading) return;
      // let rpNo = "";
      // try {
      //   rpNo = await this.getRecipeCode();

      // } catch (error) {
      //   return;
      // }


      // this.quoteBtnLoading = true;

      // let rpNo = "";

      // // 获取处方号
      // try {
      //   let rep = await getRecipeCode({ visitCode: patient.visitCode });

      //   if (rep.code === 1) {
      //     rpNo = rep.data;
      //   } else {
      //     this.quoteBtnLoading = false;
      //     this.$message.error(rep.msg || " 获取处方号失败！");
      //     return;
      //   }
      // } catch (error) {
      //   this.quoteBtnLoading = false;
      //   return;
      // }


      // let detailData = [];
      // this.analysisResultsData.forEach((item)=>{
      //   item.recipeCode = rpNo;
      // });

      try {
        await this.$refs.analysisResults.validateSubmit();
      } catch (error) {
        return;
      }


      // let detailData = this.analysisResultsData;
      let detailData = item;
      // try {
      //   let valRes = await this.valWestArr(rpNo);
      //   // debugger
      //   console.log("zhengyawen保存的医嘱数据",valRes)
      //   if(valRes.length) {
      //     detailData = valRes;
      //   } else {
      //     this.quoteBtnLoading = false;
      //     return;
      //   }
      // } catch(e){
      //   console.log(e);
      //   this.quoteBtnLoading = false;
      //   return;
      // }

      if(!detailData.length) {
          this.quoteBtnLoading = false;
          this.$message.warning("请勾选可以引用的医嘱项！");
          return;
      }

      console.log("detailData", detailData);

      // 引用到医嘱列表中
      try {
        let reps = await batchSaveOrders(detailData);
        if (reps.code === 1) {
          // this.dialogVisible = false;
          this.deliveryVisible = false;
          this.$message.success(reps.msg ? reps.msg : "医嘱模板引用成功");
          this.$emit("message");
          this.$emit("save");
        } else {
          this.$message.error(reps.msg ? reps.msg : "医嘱模板引用失败");
        }
        this.quoteBtnLoading = false;
      } catch (error) {
        this.quoteBtnLoading = false;
      }

    },
    //获取处方号
    getRecipeCode () {
      return new Promise(async (resolve, reject)=>{
        let patient = this.receivePatientData;
        let rpNo = "";
        // 获取处方号
        try {
          this.quoteBtnLoading = true;
          let rep = await getRecipeCode({ visitCode: patient.visitCode });

          if (rep.code === 1) {
            rpNo = rep.data;
            resolve(rpNo);
          } else {
            this.quoteBtnLoading = false;
            this.$message.error(rep.msg || " 获取处方号失败！");
            reject(false);
            return;
          }
        } catch (error) {
          this.quoteBtnLoading = false;
          reject(false);
          return;
        }
      });
    },
    //zhengyawen
    handleSelectionChange(selection) {
      this.westPharmacyArr = selection;
    },
    //zhengyawen  校验西药处方引用
    async valWestArr(rpNo) {
      let data = this.westPharmacyArr;
      let patient = this.receivePatientData;
      let rpData = this.RpTableData;
      let detailData = [];

      // eslint-disable-next-line complexity
      return new Promise(async(resolve, reject) => {
        if(!data.length) {
          this.$message.warning("请先选择药品！");
          reject(false);
        }
        let sameDrug = [];
        let oldDrug = [];
        for (let i in data) {
          if (data[i].itemId === null || data[i].itemId === "" || data[i].itemId === undefined) {
            this.$message.error("处方模板有误！引用失败");
            reject(false);
          }
          for(let j in rpData) {
            if(data[i].itemId == rpData[j].orderItemId) {
              sameDrug.push(data[i].itemId);
            }
          }
          oldDrug.push(data[i].itemId);
        }

        for(let i in data) {
          let count = oldDrug.filter((a)=> {
            return a === data[i].itemId;
          });
          if(count.length >= 2) {
              sameDrug.push(count[0])
          }
        }

        // console.log("sameDrug",sameDrug);

        if(sameDrug.length) {
          this.$confirm("已有相同医嘱, 是否继续引用?", "提示", {
            confirmButtonText: "引用",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning"
          })
          .then(async () => {
            sameDrug = [];
            let detailData = await this.handleData(sameDrug,rpNo);
            resolve(detailData);
          }).catch(async ()=>{
            for(let j in this.templeteTableData) {
              if(sameDrug.indexOf(this.templeteTableData[j].itemId) > -1) {
                console.log("this.templeteTableData[j].itemId",this.templeteTableData[j].itemId)
                this.$refs.templeteTableData.toggleRowSelection(this.templeteTableData[j],false);
              }
            }
            reject(false);
          })
        } else {
          sameDrug = [];
          let detailData = await this.handleData(sameDrug,rpNo);
          resolve(detailData);
        }
      });
    },
    //zhengyawen  处理西药数据
    // eslint-disable-next-line complexity
    handleData(sameDrug,rpNo) {
      let data = this.westPharmacyArr;
      let patient = this.receivePatientData;
      let rpData = this.RpTableData;
      let detailData = [];
      for (let i in data) {
        // if(!(sameDrug.length && sameDrug.indexOf(data[i].itemId) > -1)) {
        detailData.push({
              medicalInsuranceCat: data[i].expenseLevel,
              recipeCode: rpNo,
              patientId: patient.patientId,
              patientName: patient.patientName,
              visitCode: patient.visitCode,
              diagnosisTime: data[i].diagnosisTime || "",
              useWay: data[i].useWay || "", //用法
              quantity: data[i].quantity || "", //数量
              frequencyCode: data[i].frequencyCode || "", //频率
              frequencyTimes: data[i].frequencyTimes || "",
              frequencyUnit: data[i].frequencyUnit || "",
              onceDosage: data[i].oneDosage || "", //单次计量
              skinTest: data[i].skinTest || "", //皮试
              stSolutionType: data[i].stSolutionType || "", //皮试
              dropRate: data[i].dropRate || "", //滴速
              administrationTimeCode: data[i].administrationTimeCode || "", // 给药时间
              orderItemName: data[i].itemName || "",
              spec: data[i].spec || "",
              orderCat: data[i].itemCat,
              price: data[i].price,
              dosage: data[i].dosage,
              packQuantity: data[i].packQuantity,
              dosageUnit: data[i].dosageUnit,
              orderItemId: data[i].itemId,
              orderItemCat: data[i].itemCat,
              classCode: data[i].classCode,
              manageType: data[i].manageType,
              formCode: data[i].formCode,
              unitSaleFlg: data[i].unitSaleFlg,
              unit: data[i].unit,
              packUnit: data[i].packageUnit,
              unitFlag: data[i].unitFlag,
              stClassCode: data[i].stClassCode || "",
              amt: data[i].amt,
              day: data[i].day || "",
              useDay: data[i].useDay || "",
              isMajor: data[i].isMajor,
              groupNo: data[i].groupNo || "",
              remark: data[i].remark || "",
              excessReason: data[i].excessReason || "",
              execDeptName: data[i].executeDepartmentName,
              receiveDept: this.pharmacDeptId,
              execDeptCode: this.pharmacDeptId,
              execDeptId: this.pharmacDeptId
              // data[i].executeDepartmentId
        });
        // }
      }
      return detailData;
    },
    // 模板分组
    groupBy(array) {
      let groups = {
        "未分类模板": {
          firstCategoryCode: "未分类模板",
          firstCategoryName: "未分类模板",
          sortNum: -1,
          children: []
        }
      };
      let firstCategoryCodeOptions = this.firstCategoryCodeOptions;
      for(let i in firstCategoryCodeOptions) {
        let item = firstCategoryCodeOptions[i];
        if(item.dictionaryValue !== "") {
          groups[item.dictionaryValue] = {
            firstCategoryCode: item.dictionaryValue,
            firstCategoryName: item.dictionaryName,
            sortNum: item.sortNum,
            children: []
          }
        }
      }
      array.forEach(o => {
        const firstCategoryCode = o.firstCategoryCode === undefined || o.firstCategoryCode === "" ? "未分类模板" : o.firstCategoryCode;
        groups[firstCategoryCode]["children"] = groups[firstCategoryCode]["children"] || [];
        groups[firstCategoryCode]["children"].push(o);
      });
      let gropsNew = {};
      for(let i in groups) {
        if(groups[i].children && groups[i].children.length) {
          gropsNew[i] = groups[i];
        }
      }
      let arr = [];
      arr = Object.keys(gropsNew).map(function (firstCategoryCode) {
        return {
          firstCategoryCode: firstCategoryCode,
          firstCategoryName: gropsNew[firstCategoryCode].firstCategoryName,
          sortNum: gropsNew[firstCategoryCode].sortNum,
          children: gropsNew[firstCategoryCode]["children"]
        };
      });
      arr.sort( (a, b) => {
        return a.sortNum - b.sortNum
      })
      return arr;
    } 
  },
  watch: {
    receivePatientData: {
      deep: true,
      handler (){
        this.pageParams.pageNo = 1;
        this.loadTable();
      }
    },
    psRegorActiveTabName() {
      this.pageParams.pageNo = 1;
      this.loadTable();
      this.analysisResultsData = [];
    },
    leaveAppLoadKey(n) {
      if (String(n).indexOf("CHANGEFORM") > -1) {
        let formObj = {};
        let urlString = n.substring(n.indexOf("?") + 1);
        let urlArray = urlString.split("&");
        for (let i = 0, len = urlArray.length; i < len; i++) {
          let urlItem = urlArray[i];
          let item = urlItem.split("=");
          if (item[0] === "radio") {
            this.cateogry = item[1];
          }
        }
      }
      this.loadTable();
    }
  }
};
</script>
<style lang='scss' scoped>
.temp {
  // width: 298px;
  // height: 500px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .top-container {
    height: 80px;
    padding: 10px 0;
    // text-align: center;
  }
  .content {
    width: 100%;
    height: calc(100% - 80px);

    .templetName {
      max-width: 126px;
      height: 30px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
    }
    .list-item{
      width: 100%;
      height: 40px;
      padding: 5px 5px 5px 40px;
      line-height: 30px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .list-item.activiti-state{
      background-color: #2B4583;
      color: #fff;
    }
    /deep/.el-collapse-item .el-collapse-item__content {
      padding-left: 0;
    }
  }
  .act-word {
    color: $l-color-fontcolor-2;
  }
  .quote-button {
    margin-top: 8px;
  }
  /deep/.el-collapse-item .el-collapse-item__header {
    font-size: 14px;
    font-weight: normal;
    color: #2e323a;
    height: 30px;
    line-height: 30px;
    border-bottom: none;
    padding-left: 40px;
  }
}


    .bunchingUp {
      display: inline-block;
      color: $l-color-primary1;

      &::after {
        content: "┓";
      }
    }

    .bunchingCenter {
      display: inline-block;
      color: $l-color-primary1;

      &::after {
        content: "┫";
      }
    }

    .bunchingDown {
      color: $l-color-primary1;
      display: inline-block;

      &::after {
        content: "┛";
      }
    }
</style>
