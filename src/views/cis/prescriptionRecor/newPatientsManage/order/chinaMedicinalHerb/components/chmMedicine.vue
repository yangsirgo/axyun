/* eslint-disable complexity */
<template>
  <el-card class="rightMedicalOrder overflow-hidden height100">
    <div class="position-relative overflow-hidden" style=" height: 70%">
      <div class="height100">
        <div class="edit-btn-box">
          <el-button :loading="!addFlag" type="text" class="filter-item" @click="add" icon="iconfont iconxinzengchufang" v-hotKey="{ func: 'func_add1' }">
            新增处方
          </el-button>
<!-- @loading="addRpLoading" -->
          <el-button type="text" class="filter-item" @click="submitForm" icon="iconfont iconzancun">
            暂存
          </el-button>

          <el-button type="text" class="filter-item" @click="submitSave" icon="iconfont icontijiao1" v-hotKey="{ func: 'func_submit' }">
            {{ $t("cis.btn.submit") }}
          </el-button>
          <b class="line"></b>
          <el-button type="text" :loading="cclSubtLoading" class="filter-item chexiaoCls" @click="cancelSubmit" icon="iconfont iconchexiao">
            撤销提交
          </el-button>
          <el-button type="text" class="filter-item" @click="deleteHandler" icon="iconfont iconshanchu" v-hotKey="{ func: 'func_delete' }">
            <!-- {{ $t("cis.btn.del") }} -->
            删除处方
          </el-button>

          <!-- <el-button
            type="text"
            class="filter-item"
            @click="printChm"
            v-hotKey="{ func: 'func_print' }"
            icon="iconfont icondayin"
          >
            单张打印
          </el-button> -->

          <b class="line"></b>
          <el-button type="text" class="filter-item" icon="iconfont icondayin" @click="printChm" v-hotKey="{ func: 'func_print' }"
            :loading="batchLoading">
            打印
          </el-button>
          <el-button type="text" class="filter-item" 
            icon="iconfont icondayin" 
            @click="printChmAll"
            :loading="batchsLoading">
            全部打印
          </el-button>
           <!-- @click="printChmList -->
          <el-button type="text" class="filter-item" icon="iconfont iconlicichufang" @click="quote">
            历史处方
          </el-button>
          <input id="focusInput" type="text" style="position:absolute;clip:rect(0px,0px,0px,0px);" />
        </div>
        <div class="selectGroup">
          <el-form :inline="true" :model="selectGroup" :rules="topRules" ref="topForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="" prop="dosageValue">
              <l-formt-title label="剂型选择" :disabled="formDisabled" required style="width: 200px">
                <l-value-domain :disabled="formDisabled" defaultFirst code="ClassificationCodeOfChinese" :value.sync="selectGroup.dosageValue"
                  remoteValueKey="code" placeholder="请选择剂型选择" @change="dosageValueChange"></l-value-domain>
              </l-formt-title>
            </el-form-item>
            <el-form-item label="" prop="takingRoom">
              <l-formt-title label="取药药房" :disabled="formDisabled" required style="width: 200px; margin-left: 10px">
                <el-select @change="takingRoomChange" v-model="selectGroup.takingRoom" :disabled="formDisabled" placeholder="请选择取药药房">
                  <el-option v-for="(item, index) in chmPharmacyObject.list" :key="index" :label="item.pharName" :value="item.deptId">
                  </el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
            <!-- <disSelectShow 
              class="disSelectShowCls"
   
              :disabled="disSelectShowDisabled()"
              @comfirm="disSelectConfirm"
              :visitCode="receivePatientData.visitCode"
              :info.sync="disSelectInfo" ></disSelectShow> -->
            <!-- v-if="receivePatientData.settlementType == '3'" -->
            <el-form-item label="" prop="dispendingMethod">
              <l-formt-title label="发药方式" style="width: 200px; margin-left: 10px" required :disabled="dispendingMethodDisabled()">
                <l-value-domain clearable placeholder="请选择发药方式" @change="dispendingMethodChange" code="DISPENSINGMETHOD"
                  :value.sync="selectGroup.dispendingMethod" remoteShowKey="name" remoteValueKey="code" :disabled="dispendingMethodDisabled()"></l-value-domain>
              </l-formt-title>
            </el-form-item>

            <el-form-item label="" prop="contactAddress">
              <l-formt-title label="联系地址" disabled style="min-width: 200px; margin-left: 10px" v-if="selectGroup.dispendingMethod == '2' && !dialogVisible">
                <div style="padding:0 8px">
                  <span code="AdministrativDivision" :val="deliveryForm.address || []" break="/" v-codeTransform></span>
                  <span>{{ deliveryForm.detail }}</span>
                </div>
              </l-formt-title>
            </el-form-item>

            <el-button type="primary" v-if="selectGroup.dispendingMethod=='2'&& dispendingEditDisabled()" @click="editDelive">修改</el-button>

          </el-form>
        </div>
        <div class="position-absolute mainTableCls">
          <!-- <div class="title">
            <l-card-title class="margin-top-8 margin-bottom-8">
              <template slot="left">处方明细录入</template>
            </l-card-title>
          </div> -->
          <l-table v-loading="chmDrugLoading" class="mainTableContent" ref="mainTable" :currentChuFangRow="currentChuFangRow"
            @loadChuFang="loadChuFang" :selectGroup="selectGroup" :dosageValue="selectGroup.dosageValue"
            :chmForms="chmForms()"
            :herMaskShow="herMaskShow"
            :tableList="tableList"></l-table>
          <!-- 遮罩 -->
          <!-- <div class="mainTableContent herMask" v-if="herMaskShow"></div> -->
        </div>
      </div>
    </div>
    <div style="height: 30%" class="bottom clearfix">
      <div style="width:210px" class="float-left height100">
        <el-table :data="tableData" ref="singleTable" v-loading="queryLoading" width="100%" height="100%"
          highlight-current-row @row-click="chmDetails" border>
          <el-table-column prop="recipeCode" label="处方列表" min-width="120" align="center" header-align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.recipeStatus === '2' || scope.row.recipeStatus === '3'">
                <span
                  :val="scope.row.recipeStatus"
                  code="ChargeStatus"
                  v-codeTransform
                ></span>
                <span>&nbsp;&nbsp;</span>
                <span>{{ scope.row.recipeCode }}</span>
              </template>
              <template v-else>
                <template v-if="scope.row.orderStatus === '4'">
                  <span>已收费</span>
                  <span>&nbsp;&nbsp;</span>
                  <span>{{ scope.row.recipeCode }}</span>
                </template>
                <template v-else-if="scope.row.orderStatus !== '4'">
                  <span :val="scope.row.orderStatus" code="MedicalStatus" v-codeTransform></span>
                  <span>&nbsp;&nbsp;</span>
                  <span>{{ scope.row.recipeCode }}</span>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width:calc(100% - 210px); position: relative" class="float-right height100">
        <div class="displayDrugInfo">
           <!-- 2020/10/27 13:27  注释掉 start -->
         <!-- <span class="info-title">代煎费用：</span>
          <span class="info-value" id="herFryingAmount">{{
            tabsHeaderData.fryingFee | rounding
          }}</span>
          <span>元</span> -->
          <!-- 2020/10/27 13:27  注释掉 end -->
          <span class="info-title">单剂金额：</span>
          <span class="info-value" id="herRpSingleAmount">{{
            tabsHeaderData.deceptionCountFee | rounding
          }}</span>
          <span>元</span>
          <span class="info-title">处方总金额：</span>
          <span class="info-value" id="herTotalAmount">{{
            tabsHeaderData.rpTotal | rounding
          }}</span>
          <span>元</span>
        </div>
        <el-tabs class="height100 tabs" v-model="activeName">
          <el-tab-pane label="处方概要录入" name="first">
            <keep-alive>
              <chm-bottom-form :currentChuFangRow="currentChuFangRow" ref="chmBottomForm" :selectGroup="selectGroup"
                @saveChmTable="saveChmTable(arguments)" @computerAmt="computerAmt" :advicePO="advicePO"></chm-bottom-form>
            </keep-alive>
             <!-- v-if="activeName === 'first'" -->
          </el-tab-pane>
          <el-tab-pane label="药品模板" style="padding-bottom: 16px;" name="second">
            <save-tpl :currentChuFangRow="currentChuFangRow" hosType="1"></save-tpl>
          </el-tab-pane>
           <!-- v-if="activeName === 'second'" -->
        </el-tabs>
      </div>
    </div>
    <el-dialog title="历史医嘱" :visible.sync="copyOrderVisible" class="copyOrderCls">
      <copy-order v-if="copyOrderVisible" adviceType="中草药" v-loading="copyLoading" @copy="copyOrderCallback" style="height: 60vh;"></copy-order>
    </el-dialog>

    <l-dialog :visible.sync="dialogVisible" title="配送地址" width="450px" @confirm="saveDelive" @cancel="cancelDelive">
      <template slot="content">
        <deliveryDia 
          :deliveryFormProp="deliveryFormProp" 
          :receivePatientData="receivePatientDataInit" 
          ref="deliveryDia"></deliveryDia>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
  import { drugsTpl, diagnoseTplChm, chmContenTpl } from "@/components/adviceCommon/printTpl/tpl.js";
  import chmBottomForm from "./chmBottomForm";
  import deliveryDia from "./deliveryDia";
  import saveTpl from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/saveTemplate.vue";
  import {
    temporary,
    getAdviceItem,
    getAdvice,
    getChmAdvice
  } from "@/api/cis/resident/residentAdvice";
  import {
  getPharmacyObjectFunc,
  setLInputTableShotReady,
  compile,
  getPrintTplFunc,
  compileToHtml,
  isCStStatusPass,
  cancelSubmitByRecipe,
  confirmProFunc,
  setComponentFocusFunc,
  chmOrderItemPrintHandle,
  diagPrintChmParams
} from "@/components/adviceCommon/adviceUtils.js";
  import {
    getAdviceItemList
  } from "@/api/systemManagement/dataMaintain/adviceItem";
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    getDataIdDom
  } from "@/utils/util.js";
  import Linput from "./Linput";
  import lTable from "@/views/cis/prescriptionRecor/newPatientsManage/order/chinaMedicinalHerb/components/cmTable.vue";
  import {
    temporaryAdvice,
    submitApply,
    getChmMessage
  } from "@/api/cis/resident/chm";
  import {
    deepClone
  } from "@/utils/index.js";
  import {
    getOrder,
    getPageItemList,
    submitOrders,
    bunching,
    unbunching,
    delHerbalOrder,
    saveOrdersMould,
    getRecipeCode,
    saveHerbalOrder,
    getRecipeNo,
    submitHerbalOrder,
    addAndSubmitHerbalOrder,
    getPrescriptionAddress,
    addOrUpDocPrintTemplate
  } from "@/api/cis/order/order";
  import copyOrder from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/orderReference/index.vue";
  import {
    getDiaByClinicType
  } from "@/api/cis/visit/visit";
  import {
    getArrayList
  } from "@/api/wconf/wparam";
  import {
    preview,
    onPreview,
    onPreviewData
  } from "@/utils/print";
  import {
    frequencyCodeToText,
    useWayCodeToText,
    getTextFromCodeFunc,
    sexCodeToText
  } from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/orderUtils.js";
  import { getPushNo, drugsPushNo, validQuoteHerbalChnDrug, convertFieldToSubmit, getQtyByUnitFlag, getChmUnitFlag, convertFieldFromGetList, organizeData, getRecipeIdByCode } from "./utils";
  import { outpatientOrderPrint, outpatientOrderListPrint } from "@/api/cis/report/cisPrints.js"
  // import disSelectShow from "@/components/adviceCommon/modules/diseaseSelect/disSelectShow.vue";
  import { print } from "@/utils/print_new.js";
  import codes from "@/printTemplete/code.js";
  import { chmLodopTpl } from "@/printTemplete/module/chmLodopTpl.js";
  import { defaultFreq } from "@/views/cis/prescriptionRecor/newPatientsManage/order/chinaMedicinalHerb/components/variable.js";
  // import { diagnoseTpl } from "@/printTemplete/module/prescriptionLodopTpl.js"


  const DisMtdDef = "2";// 默认 取药方式 为第三方配送

  let totalTdNum = 4;
  let singleTdNum = 4;

  export default {
    name: "chmMedicine",
    props: {
      moduleType: String,
      default: "cis"
    },
    filters: {
      rounding(value) {
        value = value !== "" ? new Number(value) : 0;
        return value.rewToFixed(4);
      }
    },
    data() {
      return {
        cclSubtLoading: false,
        printTpl: "",// 打印模板
        disSelectInfo: {}, // 废弃，不在使用 病种选择在医嘱项目中维护。
        //配送
        dialogVisible: false,
        deliveryForm: {},
        //配送地址默认值
        deliveryFormInit: {},
        //向弹框传值数据
        deliveryFormProp: {},
        // deliveryRules: {
        //   recipients: [{
        //     required: true,
        //     message: "请输入",
        //     trigger: "blur"
        //   }],
        //   phoneNumber: [{
        //     required: true,
        //     message: "请输入",
        //     trigger: "blur"
        //   }],
        //   address: [{
        //     required: true,
        //     message: "请输入",
        //     trigger: "blur"
        //   }],
        //   detail: [{
        //     required: true,
        //     message: "请输入",
        //     trigger: "blur"
        //   }]
        // },
        //配送地址档案基本信息
        receivePatientDataInit: {},
        batchLoading: false,
        batchsLoading: false,
        chmDrugLoading: false,
        copyOrderVisible: false,
        formDisabled: false,
        addFlag: true,
        takingRoomList: [],
        remoteParams: {
          wmedicinePermit: "1"
          // cmedicinePermit:"1"
        },
        herMaskShow: true,
        currentChuFangRow: {},
        currentIndex: 0,
        selectGroup: {
          takingRoom: "",
          dosageValue: "",
          dispensingMode: "1",
          address: "",
          dispendingMethod: DisMtdDef
        },
        // 2020/10/13
        dispensingModeObj: {},
        dispensingModeList: [{
            id: "1",
            name: "本院发药"
          },
          {
            id: "2",
            name: "第三方配送"
          }
        ],
        dispensingModeStyle: false,
        // 2020/10/13
        topRules: {
          dosageValue: [{
            required: true,
            message: "请选择剂型选择",
            trigger: ["blur"]
          }],
          takingRoom: [{
            required: true,
            message: "请选择取药药房",
            trigger: "blur"
          }],
          dispensingMode: [{
            required: true,
            message: "请选择发药方式",
            trigger: "blur"
          }],
          dispendingMethod: [{
            required: true,
            message: "请选择发药方式",
            trigger: "blur"
          }]
        },
        tabsHeaderData: {
          fryingFee: "0",
          deceptionCountFee: "0",
          rpTotal: "0"
        },
        copyLoading: false,
        queryLoading: false,
        tableData: [],
        selectOptions: [],
        // dropColumn: [
        //   // 下拉 table 配置表头
        //   // {
        //   //   prop: "expenseLevel",
        //   //   label: "报销",
        //   //   width: 60,
        //   //   codeTransform: true,
        //   //   codeTransformCode: "DrugReimbursementType"
        //   // },
        //   {
        //     prop: "name",
        //     label: "名称",
        //     align: "center",
        //     width: 100
        //   },
        //   {
        //     prop: "spec",
        //     align: "center",
        //     label: "规格"
        //   },
        //   {
        //     prop: "price",
        //     align: "center",
        //     label: "单价",
        //     width: 100
        //   },
        //   // {
        //   //   prop: "execDeptName",
        //   //   label: "药房",
        //   // align: 'center',
        //   //   width: 100
        //   // },
        //   {
        //     prop: "itemTypeName",
        //     label: "项目类别",
        //     align: "center",
        //     width: 100
        //     // codeTransform: true,
        //     // codeTransformCode: "category_Code"
        //   }
        //   // {
        //   //   prop: "stockNum",
        //   //   label: "库存",
        //   //   width: 100
        //   // },
        //   // {
        //   //   prop: "basicType",
        //   //   label: "基药",
        //   //   width: 110,
        //   //   codeTransform: true,
        //   //   codeTransformCode: "BasicDrugType"
        //   // }
        // ],
        basicDocAgeUnitList: [{
            value: 1,
            label: "钱"
          },
          {
            value: 2,
            label: "克"
          }
        ],
        activeName: "first",
        fryingRemarkList: [{
            value: 1,
            label: "先煎"
          },
          {
            value: 2,
            label: "后下"
          },
          {
            value: 3,
            label: "包煎"
          },
          {
            value: 4,
            label: "另炖或另煎"
          },
          {
            value: 5,
            label: "熔化"
          },
          {
            value: 6,
            label: "泡服"
          },
          {
            value: 7,
            label: "冲服"
          }
        ],
        tableColumn: [{
            label: "草药名称",
            prop: "name1",
            width: 150,
            colIndex: 0
          },
          {
            prop: "basicDosage1",
            label: "数量",
            width: 70,
            colIndex: 1
          },
          {
            prop: "basicDocAgeUnit1",
            label: "单位",
            width: 80,
            colIndex: 2
          },
          {
            prop: "fryingRemark1",
            label: "煎服法",
            width: 80,
            colIndex: 3
          },
          {
            label: "草药名称",
            prop: "name2",
            width: 150,
            colIndex: 4
          },
          {
            prop: "basicDosage2",
            label: "数量",
            width: 70,
            colIndex: 5
          },
          {
            prop: "basicDocAgeUnit2",
            label: "单位",
            width: 70,
            colIndex: 6
          },
          {
            prop: "fryingRemark2",
            label: "煎服法",
            width: 80,
            colIndex: 7
          },
          {
            label: "草药名称",
            prop: "name3",
            width: 150,
            colIndex: 8
          },
          {
            prop: "basicDosage3",
            label: "数量",
            width: 70,
            colIndex: 9
          },
          {
            prop: "basicDocAgeUnit3",
            label: "单位",
            width: 70,
            colIndex: 10
          },
          {
            prop: "fryingRemark3",
            label: "煎服法",
            width: 80,
            colIndex: 11
          },
          {
            label: "草药名称",
            prop: "name4",
            width: 150,
            colIndex: 12
          },
          {
            prop: "basicDosage4",
            label: "数量",
            width: 70,
            colIndex: 13
          },
          {
            prop: "basicDocAgeUnit4",
            label: "单位",

            width: 70,
            colIndex: 14
          },
          {
            prop: "fryingRemark4",
            label: "煎服法",
            width: 80,
            colIndex: 15
          }
        ],
        tableList: [],
        advicePO: {},
        // 分页数据
        currentPage: 1,
        pageSize: 9999999,
        total: 1,
        queryName: "",
        //  查询条件
        searchForm: {
          visitCode: "", //门诊处方患者列表 门诊号
          categoryCode: 2,
          inpCode: "",
          dateRange: [],
          patientId: "",
          wardId: "",
          bedNo: "",
          name: "", // 医嘱查询关键词
          status: "", //
          //    deptType: "1", //
          adviceType: "3",
          today: "",
          patientName: "",
          property: "",
          attribute: ""
        }
      };
    },
    components: {
      chmBottomForm,
      // disSelectShow,
      saveTpl,
      lTable,
      Linput,
      copyOrder,
      deliveryDia
    },
    methods: {
      ...mapActions({
        setMultipleSelections: "cis/setMultipleSelections",
        changeChmDispgMethCode: "cis/changeChmDispgMethCode",
        changeChmPharmacyObject: "adviceCommon/changeChmPharmacyObject"
      }),
      // 撤销提交
      async cancelSubmit (){
        if (!isCStStatusPass([this.currentChuFangRow], ["", "0"], "orderStatus")) {
          this.$message.error("选择正确的可撤销医嘱！");
          return;
        }

        if (this.cclSubtLoading) return;
       
        let { recipeCode } = this.currentChuFangRow;
        //console.log("recipeCode", recipeCode);
        let recipeId = getRecipeIdByCode(this.tableList, recipeCode);
        this.cclSubtLoading = true;
        console.log(recipeId);
        try {
          await confirmProFunc("撤销" + recipeCode + "处方提交,是否继续?");
          
          try {
            await cancelSubmitByRecipe([recipeId]);
            this.cclSubtLoading = false;
            // await this.loadChuFang();
            try {
              await this.loadChuFang();
            } catch (error) {
              return;
            }
            
           // console.log(recipeCode);

            let targetIndex = this.tableData.findIndex ((item)=>{
              return item.recipeCode == recipeCode;
            });       
            
            let firstRow = this.tableData[this.tableData.findIndex (item=> item.recipeCode == recipeCode)];
            console.log(firstRow, "recipeCode", recipeCode);
            this.chmDetailsCopy(firstRow);

            this.$nextTick(()=>{
              this.$refs.singleTable.setCurrentRow(
                this.tableData[targetIndex]
              );
              this.formDisabled = true;
            });
          } catch (error) {
            this.cclSubtLoading = false;
          }
        } catch (error) {
          this.cclSubtLoading = false;
        }
      },
      disSelectConfirm (info){
        let { orderStatus } = this.currentChuFangRow;
        //暂存状态下 直接暂存
        // 提交状态下 不许可修改
        if ( orderStatus === "0"){
          this.submitForm();
        }
      },
      //zhengyawen在进行暂存提交删除功能之前校验一下处方列表里是否有新处方未保存，更新之后将重新刷新处方列表，是否继续
      async isNewCF(){
        let isNew = false;
        let flag = true;
        let data = this.tableData;
        for(let i in data){
          if(data[i].orderStatus === "" && data[i].recipeCode !== this.currentChuFangRow.recipeCode){
            isNew = true;
            break;
          }
        }
        if(isNew === true){
          await this.$confirm("处方列表里存在新增未保存的处方,更新之后将重新刷新处方列表, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              flag = true;
            })
            .catch(async() => {
              flag = false;
            });
        }
        return flag;
      },
      //发药方式只读
      dispendingMethodDisabled(){
        //提交、收费、退费只读
        let flag = this.currentChuFangRow.orderStatus !== "" && this.currentChuFangRow.orderStatus !== "0";
        return flag;
      },
      //病种选择只读
       disSelectShowDisabled(){
        //提交、收费、退费只读
        let flag = this.currentChuFangRow.orderStatus !== "" && this.currentChuFangRow.orderStatus !== "0";
        return flag;
      },
      setShotReady(list = []){
        list.forEach(item =>{
          setLInputTableShotReady(
            "on",
            item,
            this
          );
        });
        return list;
      },
      //修改配送地址
      dispendingEditDisabled(){
        //收费、退费不可修改
        // 收费的可以修改配送地址
        let isShouFei = "4";
        let flag = this.currentChuFangRow.orderStatus == isShouFei || this.currentChuFangRow.orderStatus === "" || this.currentChuFangRow.orderStatus === "0" || this.currentChuFangRow.orderStatus === "2";
        return flag;
      },
      chmForms(){
        if(this.$refs.chmBottomForm) {
          return this.$refs.chmBottomForm.chmForm;
        }
        return {}
      },
      dispendingMethodChange(val) {
        if (val == "2") {
          if (
            this.currentChuFangRow &&
            (this.currentChuFangRow.orderStatus === "" &&
            this.currentChuFangRow.row_id) ||
            (this.deliveryForm.shipmentType === "" ||
            this.deliveryForm.shipmentType === undefined)
          ) {
            //新增处方或者原来是自取状态的处方的地址无默认值，默认选择配送到家，并获取档案
            if (this.deliveryFormInit.dispendingMethod != "2") {
              //this.deliveryForm.shipmentType = "0";
              //this.shipmentTypeChange("0");
              this.setDisMtdSanFang();
            } else {
              this.deliveryFormProp = deepClone(this.deliveryFormInit);
              this.dialogVisible = true;
              return;
            }
          }
          this.deliveryFormProp = deepClone(this.deliveryForm);
          this.dialogVisible = true;
        }

        // 发药方式 数据共享， 引用模板使用
        this.changeChmDispgMethCode(this.selectGroup.dispendingMethod);
      },
      // 第三方配送地址 默认 配送家庭 shipmentType 0 
      setDisMtdSanFang (){
        this.deliveryForm.shipmentType = "0";
        this.shipmentTypeChange("0");
      },
      //配送地址方式改变你
      shipmentTypeChange(val) {
        if (val == "0") {
          console.log("shipmentTypeChange ::::: this.deliveryForm", this.deliveryForm);
          //获取患者档案信息并填充
          let datas = {
            ...this.deliveryForm,
            recipients: this.receivePatientDataInit.patientName,
            phoneNumber: this.receivePatientDataInit.phoneNum,
            address: this.receivePatientDataInit.addrCode || [],
            detail: this.receivePatientDataInit.address || ""
          };
          this.deliveryForm = datas;
          this.deliveryFormInit = datas;
          console.log("this.deliveryForm表单的地址", this.deliveryForm);
          console.log("deliveryFormInit默认档案地址", this.deliveryFormInit);
         
        } else if (val == "1") {
          //清空配送地址信息
          this.resetAddress({});
        }
      },
      //清空配送地址信息
      resetAddress(data) {
        
        this.deliveryForm = {
          ...this.deliveryForm,
          recipients: "",
          phoneNumber: "",
          address: [],
          detail: "",
          ...data
        };
        console.log("清空配送地址 resetAddress", this.deliveryForm);
      },
      //确认配送
      saveDelive() {
        let deliveryDia = this.$refs.deliveryDia;
        let isShouFeiStatus = '4';//已收费的药品 也可以 修改地址
        if(this.currentChuFangRow.orderStatus === "" 
          || this.currentChuFangRow.orderStatus === "0"){
          //新增状态或者暂存状态，保存处方的时候保存配送地址
          deliveryDia && deliveryDia.$refs.deliveryForm.validate(valid => {
            if (valid) {
              let form = deliveryDia ? deliveryDia.deliveryForm : {};
              this.deliveryForm = deepClone(form);
              deliveryDia.$refs.deliveryForm.resetFields();
              this.dialogVisible = false;
            }
          });
          
        } else if (this.currentChuFangRow.orderStatus === "2" 
          || this.currentChuFangRow.orderStatus == isShouFeiStatus){
          //提交状态，调用修改地址接口
          deliveryDia && deliveryDia.$refs.deliveryForm.validate(async valid => {
            if (valid) {
              let form = deliveryDia ? deliveryDia.deliveryForm : {};
              this.deliveryForm = deepClone(form);
              await this.saveDeliveFunc();
              // 取地址 赋值
              await this.getPrescriptionAddress();
              deliveryDia.$refs.deliveryForm.resetFields();
              this.dialogVisible = false;
            }
          });
        }
      },
      async saveDeliveFunc(extraParams = {}) {
        let params = this.handleDeliveData();
        params = {
          ...params,
          ...extraParams
        }
        try{
          let res = await addOrUpDocPrintTemplate(params);
          if (res.code == "1") {
            this.$message.success("保存成功");
            this.dialogVisible = false;
            // this.getPrescriptionAddress();
            //保存成功 
          } else {
            this.$message.error(res.msg || "保存失败");
          }
        }catch(e){
          this.$message.error(e.msg || "保存失败");
        }
      },      
      //取消配送
      cancelDelive() {
        let deliveryDia = this.$refs.deliveryDia;
        //如果地址弹框为空数据，配送方式也改为自取
        let valiedDeliveryForm = this.valiedDeliveryForm(this.deliveryFormInit);
        if(!valiedDeliveryForm){
          // this.selectGroup.dispendingMethod = "1";
          this.setDispendingMethod("1");
        }
        this.deliveryFormProp = deepClone(this.deliveryForm);
        
        deliveryDia.$refs.deliveryForm.resetFields();
        this.dialogVisible = false;
      },
      //校验配送地址表单
      valiedDeliveryForm(form) {
        if(!form || form.shipmentType === "" ||
        form.shipmentType === undefined ||
        form.recipients === "" ||
        form.recipients === undefined ||
        form.phoneNumber === "" ||
        form.phoneNumber === undefined ||
        form.address === "" ||
        form.address === undefined ||
        (Array.isArray(form.address) && !form.address.length) ||
        form.detail === "" ||
        form.detail === undefined
        ) {
          return false;
        }
        return true;
      },
      //暂存以及提交地址的入参处理
      handleDeliveData() {
        let curRow = this.currentChuFangRow;
        console.log("this.deliveryForm:::::::::提交前", this.deliveryForm);
        let data = {
          ...this.deliveryForm
        };
        if (Array.isArray(data.address) && data.address.length >= 1 && data.address.length <= 3) {
          data.provinceCode = data.address[0];
          data.cityCode = data.address.length >= 2 ? data.address[1] : "";
          data.regionCode = data.address.length >= 3 ? data.address[2] : "";
        }
        this.$delete(data, "address");
        return data;
      },
      //编辑处方配送地址
      editDelive() {
        this.deliveryFormProp = deepClone(this.deliveryForm);
        this.dialogVisible = true;
      },
      //选择处方之后请求配送方式以及地址信息
      // eslint-disable-next-line complexity
      async getPrescriptionAddress() {
        let params = {
          visitCode: this.receivePatientData.visitCode,
          recipeId: this.currentChuFangRow.drugList &&
            this.currentChuFangRow.drugList.length &&
            this.currentChuFangRow.drugList[0].recipeId ?
            this.currentChuFangRow.drugList[0].recipeId :
            ""
        };
        try {
          let res = await getPrescriptionAddress(params);
          if (res.code == 1) {
            //配送地址信息赋值
            let datas = res.data;
            if(!datas.hasOwnProperty("recipients")) {
              // this.$message.error("配送地址为空");
              this.$message.warning("配送地址为空，请填写配送地址");
              this.deliveryForm = {};
              return;
            }
            this.resetAddress({
              shipmentType: ""
            });
            let address = datas.currentAddress && datas.currentAddress.indexOf(",]") > -1 ?
            JSON.parse(datas.currentAddress.split(",]")[0] + "]") : 
            Array.isArray(JSON.parse(datas.currentAddress)) ? JSON.parse(datas.currentAddress) : []
            this.deliveryForm = {
              ...datas,
              recipients: datas.recipients,
              phoneNumber: datas.phoneNumber,
              address,
              detail: datas.detail,
              shipmentType: datas.shipmentType
            };
            console.log("选择单条处方时的deliveryForm", this.deliveryForm);
          } else {
            this.$message.error(res.msg || "配送地址为空");
          }
          
        } catch (e) {
          console.log(e);
        }
      },
      //暂存
      submitForm() {
        this.$refs.chmBottomForm && this.$refs.chmBottomForm.submitForm();
      },
      // 2020/10/13 start
      //element组件input无法输入问题
      inputChange(e) {
        this.$forceUpdate();
      },
      dispensingModeListFun() {
        if (this.selectGroup.dispensingMode != "1") {
          this.dispensingModeStyle = true;
        } else {
          this.dispensingModeStyle = false;
        }
      },
      dispensingModeCancel() {
        //取消
        this.dispensingModeStyle = false;
      },
      dispensingModeSave() {
        //确定
        this.dispensingModeStyle = false;
      },

      // 2020/10/13 end

      //更改药品剂数 重新计算总额
      computerAmt() {
        this.$nextTick(() => {
          this.$refs.mainTable.computeAmtFunc();
        });
      },
      async validateComon(data){
        for(let i in data){
          if(data[i].classCode != this.selectGroup.dosageValue){
            return false;
          }
        }
        return true;
      },
      async copyOrderCallback(copyData) {
        this.copyOrderVisible = false;
        let target = copyData[0];
        // 历史处方引用 默认是本地发药
        // this.selectGroup.dispendingMethod = 1;
        if (target.dispendingMethod == "2") {
          try {
            await this.saveDeliveFunc({ 
              recipeId: target.recipeId, 
              visitCode: target.visitCode, 
              id: null  
            });
          } catch (error) {
            return;
          }
        }
        

        try {
          await this.loadChuFang();
        } catch (error) {
          return;
        }

        console.log("copyData:::::", copyData);




        let targetIndex = this.tableData.findIndex ((item)=>{
          return item.recipeCode == target.recipeCode;
        });
        
        // console.log("targetIndex", targetIndex, this.tableData);
        let firstRow = this.tableData[targetIndex];
        this.chmDetailsCopy(firstRow);
        let { drugList = [{}] } = firstRow;
        let { dispendingMethod } = drugList[0];
        // if (dispendingMethod == "2") {
        //   this.$message.warning("请填写配送地址");
          // console.log("deliveryForm", this.deliveryForm);
          // console.log("deliveryFormInit", this.deliveryFormInit);
          // console.log("deliveryFormProp", this.deliveryFormProp);
        // }

        this.$nextTick(()=>{
           this.$refs.singleTable.setCurrentRow(
             this.tableData[targetIndex]
           );
           this.formDisabled = true;
        });



      //获取聚焦到复制的节点
        //如果没有选中当前处方 提示用户选择处方
        // if (Object.keys(this.currentChuFangRow).length === 0){
        //   this.$message.warning("请选中或者新增中草药处方");
        //   return;
        // }
        // let cloneData = deepClone(copyData);

        // if(cloneData.length){
        //   //校验引用处方的剂型与主界面一致
        //   let flag = await this.validateComon(cloneData);
        //   if(!flag){
        //     this.$message.error("历史处方与当前剂型不一致，请选择其他处方进行引用!");
        //     this.formDisabled = false;
        //     this.copyLoading = false;
        //     this.copyOrderVisible = false;
        //     return;
        //   }

        //   let params = [];
        //   for(let i in copyData){
        //     let item = copyData[i];
        //     params.push({
        //       quantity: item.quantity,
        //       useQty: this.chmForms().useQty || 1,
        //       orderItemId: item.orderItemId,
        //       orderItemName: item.orderItemName,
        //       packUnit: item.packUnit,
        //       unit: item.unit,
        //       unitKey: item.unit,
        //       dispendingMethod: this.selectGroup.dispendingMethod,
        //       receiveDept: this.selectGroup.takingRoom
        //     })
        //   }
        //   let flag0 = await validQuoteHerbalChnDrug(params, "引用失败");
        //   if(!flag0){
        //     this.formDisabled = false;
        //     this.copyLoading = false;
        //     this.copyOrderVisible = false;
        //     return;
        //   }
        // }

        // this.copyLoading = true;

        // let {
        //   patientCode,
        //   patientId,
        //   visitCode,
        //   patientName
        // } = this.$store.state.base.receivePatientData; //获取患者信息

        // for (let i = 0; i < cloneData.length; i++) {
        //   let item = cloneData[i];
        //   item.qty = item.quantity;
        //   item.orderItemName = item.oderItemName;
        //   item.delete_id = +new Date();
        //   item.unitKey = item.unit;
        //   item.row_id = this.currentChuFangRow.row_id;
        //   item.recipeCode = this.currentChuFangRow.recipeCode;
        //   item.orderStatus = this.currentChuFangRow.orderStatus;
        //   item.patientName = patientName;
        //   item.visitCode = visitCode;
        //   item.patientCode = patientCode;
        //   item.patientId = patientId;
        //   delete item.id;
        //   delete item.recipeId;
        //   //清空频次信息
        //   item.frequencyCode = "";
        //   item.frequencyTimes = "";
        //   item.frequencyUnit = "";

        //   // try {
        //   //   await this.getQtyUnitAjax(item).then(res => {
        //   //     this.$set(cloneData[i], "unitOptions", res);
        //   //   });
        //   // } catch (e) {}
        // }

        // try {
        //   // await this.$refs.mainTable.insertChnRpDetails(cloneData);
        //   await this.add(cloneData, ()=>{
        //     this.$message.success("处方引用成功！");
        //   });
        //   //剂型选择 和 取药药房 取消禁用
        //   this.formDisabled = false;
        //   this.copyLoading = false;
        //   this.copyOrderVisible = false;
        // } catch (e) {
        //   this.copyLoading = false;
        //   // this.$message.error("处方引用失败！");
        // }
      },
    async loadChuFang() {
      return new Promise(async (resolve, reject) => {
        this.initChmTable();
        try {
          await this.queryChuFang();
        } catch (error) {
          reject(false);
          return;
        }

        this.$nextTick(() => {
          document.querySelector("#focusInput").focus(); //让table 失去焦点
          resolve(true);
        });
      });
    },
      // 取药药房
      // getTakingRoomList() {
      //   let data = {
      //     wmedicinePermit: "1",
      //     status: "1",
      //     pageNo: "1",
      //     pageSize: "100",
      //     cmedicinePermit: "1"
      //   };
      //   getTakingRoomList(data)
      //     .then(res => {
      //       if (res.code === 1) {
      //         this.takingRoomList = res.data;
      //         this.selectGroup.takingRoom = res.data[0].deptId;
      //       } else {
      //         this.$message.error(res.msg || "取药药房接口错误");
      //       }
      //     })
      //     .catch(error => {
      //       this.$message.error(error || "取药药房接口错误");
      //     });
      // },
      dosageValueChange(value, item) {},
      async validateChildItd() {
        let isSubmit = true;
        let childes = this.$refs.mainTable.$children;
        for (let i = 0; i < childes.length; i++) {
          let child = childes[i];
          if (child.$options.name === "lTd") {
            try {
              let result = await child.validateTdForm();
              if (result) continue;
            } catch (e) {
              this.$refs.chmBottomForm.saveBtnLoading = false; //关闭 button loading
              isSubmit = false;
              break;
            }
          }
        }
        return isSubmit;
      },
      async isChildItdSubmit() {
        try {
          let result = await this.validateChildItd();
          return result;
        } catch (e) {
          return false;
        }
      },
      showErrorMsg(errorObj) {
        let self = this;
        for (let key in errorObj) {
          setTimeout(function() {
            if (document.getElementsByClassName("el-message").length === 0) {
              //message 弹窗一次错误
              self.$message.error(errorObj[key][0]);
            }
          }, 0);
        }
      },
      validateTopRules() {
        return new Promise((resolve, reject) => {
          this.$refs["topForm"].validate((valid, error) => {
            if (valid) {
              resolve(true);
            } else {
              this.showErrorMsg(error);
              reject(error);
              return false;
            }
          });
        });
      },
      // eslint-disable-next-line complexity
      async saveChmTable(data) {
        if (this.chmDrugLoading) return;

        let formData = data[0];
        let callBack = data[1];
        let errorBack = data[2];

        //暂存之前检查一下是否有新处方未保存
        let isNewCFs = await this.isNewCF();
        if(!isNewCFs){
          errorBack && errorBack();
          return;
        }

        try {
          await this.validateTopRules();
        } catch (e) {
          this.$refs.chmBottomForm.saveBtnLoading = false;
           errorBack && errorBack();
          return;
        }

        let isSubmit = await this.isChildItdSubmit();
        if (!isSubmit) {
          errorBack && errorBack();
          return;
        }

        // console.log("formData::::", formData);
        // let tdObjectArray = this.$refs.mainTable.tdObjectArray;
        //console.log("tdObjectArray", tdObjectArray);
        /* let drugs = tdObjectArray.filter(item => {
            return item.orderItemName;
          }
        }); */
        // let drugs = [];
        // for(let i in tdObjectArray){
        //   let item = tdObjectArray[i];
        //   if(item.orderItemName) {
        //       drugs.push({...item});
        //   } else if (!item.orderItemName && item.id) {
        //       drugs.push({
        //         id: item.id,
        //         dataVersion: item.dataVersion
        //       });
        //   }
        // }



        //转换字段
        // drugs.forEach(item => {
        //   if(item.orderItemName) {
        //     let unitFlag = getChmUnitFlag(item.limitUnit, item.packUnit, item.unitKey);
        //     //数量换算
            // 换算最小单位数量
            // let qty =
            //   unitFlag == "1" ?
            //   item.qty * 1 * item.packQuantity :
            //   item.qty;
            // // 医生选择单位标识 0-小包装单位  1-大包装单位
            // // let flag = item.unitKey === item.packUnit ? "1" : "0";
            // item.quantity = qty;
            // // console.log(item.limitUnit, item.packUnit, item.unitKey);
            // item.unitFlag = unitFlag;
            // item.unit = item.limitUnit;
        //     convertFieldToSubmit(item);
        //   }
        // });
        // console.log(formData.pharmaMethods);
        // console.log(formData.useMethod);
        // 修复 el-number 组件 值是空是 返回 undefined
        // formData.panFriedQuantity = typeof formData.panFriedQuantity == "undefined" ? "" : formData.panFriedQuantity;
        //console.log("formData.panFriedQuantity", formData.panFriedQuantity);

        // let peiSongAddr = this.selectGroup.dispendingMethod == "2" ?
        //         this.handleDeliveData() :
        //         {}; //配送地址信息

        let peiSongAddr = {};//配送地址信息

        if (this.selectGroup.dispendingMethod == "2") {
          peiSongAddr = this.handleDeliveData();
          let { detail } = peiSongAddr;
          if (detail == "") {
            this.$message.error("请填写详细地址");
            errorBack && errorBack();
            return; 
          }
        }
        let drugs = this.zanCunDataHandler(formData);

        if (drugs.length === 0) {
          this.$message.warning("请填写药品！");
          errorBack && errorBack();
          return;
        }

       // debugger
        // for (let i = 0; i < drugs.length; i++) {
        //   if(drugs[i].orderItemName) {
        //     drugs[i] = {
        //       ...drugs[i],
        //       ...formData,
        //       ...this.disSelectInfoParams(),//病种选择
        //       dispendingMethod: this.selectGroup.dispendingMethod, //配送方式
        //       receiveDept: this.selectGroup.takingRoom, //取药药房
        //       prescriptionAdress: peiSongAddr
        //     };
        //   }
        // }
        this.chmDrugLoading = true;
        saveHerbalOrder(drugs)
          .then(async res => {
            let { data, code, msg } = res;
            if (code === 1) {
              this.$message.success("保存成功");
              // this.initChmTable();
              callBack && callBack();
              // this.queryChuFang();
              try {
                await this.queryChuFang();
              } catch (error) {
                return;
              }

              // 暂存后，保留暂存的数据界面
              this.chmDetails(this.tableData.find (item=> item.recipeCode == data[0].recipeCode));
              // this.initChmTable();

              
              this.$nextTick(()=>{// 暂存后 active 行
                this.$refs.singleTable.setCurrentRow(
                  this.tableData.find (item=> item.recipeCode == data[0].recipeCode)
                );
              });
            } else {
              this.$message.error(res.msg || "保存失败！");
              errorBack && errorBack();
            }
            this.chmDrugLoading = false;
          })
          .catch(error => {
            //取消操作
            errorBack && errorBack();
            this.chmDrugLoading = false;
            this.$message.error(error || "保存失败！");
          });
      },
      // 20200619 待编辑状态的处方最多只能有一条，不能同时编辑多条处方
      isGreaterThanOne() {
        console.log("this.tableData", this.tableData);
        let list = this.tableData;
        let number = 0;
        for (var i = 0; i < list.length; i++) {
          console.log("list[i].row_id", list[i].row_id);
          if (list[i].row_id) {
            number++;
          }
        }
        if (number >= 1) {
          return true;
        }
        return false;
      },
      filterDrugsContainId(data) {
        return data.filter(item => {
          return item.id;
        });
      },
      // eslint-disable-next-line complexity
      async add(chmTempQuoteData, fn) {

        // 20200619 待编辑状态的处方最多只能有一条，不能同时编辑多条处方
        if (this.isGreaterThanOne()) {
          this.$message.warning("您还有一条处方未编辑完成，请先完成编辑。");
          return;
        }
        let visitCode =
          typeof this.receivePatientData["visitCode"] !== "undefined" ?
          this.receivePatientData["visitCode"] :
          ""; //获取患者就诊ID
        if (visitCode === "") {
          this.$message.warning("请选择患者！");
          // eslint-disable-next-line consistent-return
          return false;
        }

        //防止点击两次 生成两条处方列表
        if (!this.addFlag) {
          return;
        }
        this.addFlag = false;


        try {
          // 是否有诊断校验
          let rep = await getDiaByClinicType({
            visitCode: visitCode
          });
          if (rep.code === 1 && rep.data.length === 0) {
            this.$message.warning("当前患者还没有中医诊断，请开诊断之后才能开处方！");
            this.addFlag = true;
            // eslint-disable-next-line consistent-return
            return false;
          } 
        } catch (error) {
          this.addFlag = true;
          this.$message.warning("获取诊断信息失败！");
          return;
        }

        try {
          let response = await getRecipeCode({
            visitCode: visitCode,
            cwFlag: "2"
          });

          if (response.code === 1) {
            let addRowEmpty = {};
            addRowEmpty["recipeCode"] = response.data;
            addRowEmpty["row_id"] = +new Date();
            let wrapperObject = {
              drugList: this.emptyList(),
              recipeCode: addRowEmpty["recipeCode"],
              orderStatus: "",
              row_id: addRowEmpty["row_id"]
            };

            this.tableData.push(wrapperObject);
            this.currentIndex = this.tableData.length - 1;
            if (Array.isArray(chmTempQuoteData)) {
              //引用中草药处方回调
              let drugsData = this.insertArray(chmTempQuoteData);
              // 对有药品的项 增加delete_id
              drugsData.forEach((item, index) => {
                if (item.orderItemId) {
                  item.delete_id = String(+new Date() + String(index));
                  item.row_id = wrapperObject["row_id"];
                  item.recipeCode = wrapperObject["recipeCode"];
                  item.orderStatus = wrapperObject["orderStatus"];

                  // 应用数据标志放在 wrapperObject 上
                  if (item.quoteFlag && typeof wrapperObject.quoteFlag === "undefined") {
                    wrapperObject.quoteFlag = true;
                  }

                

                  // console.log("item::::::::", item);
                  // 数量单位转换 START
                  // let qty =
                  //   item.unitFlag === "0" ?
                  //   item.quantity :
                  //   item.quantity / item.packQuantity;

                  // item.limitUnit = item.unit;
                  // let unitKey = item.unitFlag === "0" ? item.limitUnit : item.packUnit;
                  // let qty = getQtyByUnitFlag(
                  //   item.unitFlag,
                  //   item.quantity,
                  //   item.packQuantity,
                  //   "insert"
                  // );
                  // item.qty = qty;
                  // item.unitKey = unitKey;
                  convertFieldFromGetList(item);
                  // let unitFlag = getChmUnitFlag(item.limitUnit, item.packUnit, item.unitKey);
                  // getQtyByUnitFlag();
                  // 数量单位转换 END
                }
              });
              wrapperObject.drugList = drugsData;

              this.chmDetails(wrapperObject);
              fn && fn();
            } else {
              this.chmDetails(wrapperObject);
              this.formDisabled = false;
            }

            //焦点定位到医嘱名称
            this.$nextTick(() => {
              this.$refs.singleTable.setCurrentRow(
                this.tableData[this.tableData.length - 1]
              );
              this.$refs["chmBottomForm"].reset();

              // console.log("第一个表单聚焦了啊啊啊啊啊");
              // let nodeList = getDataIdDom("div", "data-id", "mainTableTdCls0");
              // if (nodeList.length > 0) {
              //   nodeList[0].getElementsByClassName("el-input__inner")[0].focus();
              // }
              setComponentFocusFunc("", "mainTableTdCls0");
              this.herMaskShow = false;

              //处方列表 定位到最底下
              let chuFangTable = this.$refs.singleTable;
              chuFangTable.bodyWrapper.scrollTop =
                chuFangTable.bodyWrapper.scrollHeight;
              if (Array.isArray(chmTempQuoteData)) {
                document
                  .querySelector(".onceDosageInput")
                  .querySelector(".el-input__inner")
                  .focus();
              }

              

              //zhengyawen 如果新增之前表格处方，并且有配送地址，则初始化配送方式地址
              this.deliveryForm = {};

              console.log("this.deliveryForm清空了：：：：", this.deliveryForm);

              // this.selectGroup.dispendingMethod = this.deliveryFormInit.dispendingMethod;
              // this.setDispendingMethod(this.deliveryFormInit.dispendingMethod);
              this.setDispendingMethod(DisMtdDef);
              this.deliveryForm = {
                ...this.deliveryForm,
                ...this.deliveryFormInit
              };

              console.log("this.deliveryForm有值了：：：：", this.deliveryForm);
              console.log("this.deliveryFormInit：：：", this.deliveryFormInit);

              delete this.deliveryForm.dispendingMethod;
              this.addFlag = true;
            });
          } else {
            this.$message.error(response.msg || "获取处方号失败！");
            this.addFlag = true;
          }
          
        } catch (error) {
          this.addFlag = true;
          this.$message.error("获取处方号失败！");
          return;
        }

      },
      insertArray(quoteData = []) {
        // let tableList = [];
        if (quoteData && quoteData.length > 0) {
          // let length = quoteData.length;
          /* if (length <= totalTdNum) {
            //用户存储的药品信息小于24项
            for (let i = 0; i < totalTdNum; i++) {
              if (i < length) {
                tableList.push(quoteData[i]);
              } else {
                // this.tdObjectArray.push({});
                tableList.push({});
              }
            }
          } else { */
            let pushNo = getPushNo(quoteData.length);
            return drugsPushNo(pushNo, quoteData);
            //用户存储的药品信息大于24项
            // for (let i = 0; i < this.getNearNumber(quoteData.length); i++) {
            //   if (i < length) {
            //     tableList.push(quoteData[i]);
            //   } else {
            //     tableList.push({});
            //   }
            // }
          // }
        }
        return quoteData;
      },
      // getNearNumber(n) {
      //   return n % singleTdNum === 0 ?
      //     n :
      //     ((n - (n % singleTdNum)) / singleTdNum + 1) * singleTdNum;
      // },
      //设置 配送方式的值
      setDispendingMethod (nValue){
        this.selectGroup.dispendingMethod = nValue;
        // 发药方式 数据共享， 引用模板使用
        this.changeChmDispgMethCode(nValue);
      },
      fillDrugs(drugList = []) {
        if (drugList.length > 0) {
          //用户存储了药品信息
          let length = drugList.length;
          /* if (length <= totalTdNum) {
            //用户存储的药品信息小于24项
            for (let i = 0; i < totalTdNum; i++) {
              if (i >= length) {
                drugList.push({});
              }
            }
          } else { */
            
            //用户存储的药品信息大于24项
            let pushNo = getPushNo(drugList.length); //取临近singleTdNum的倍数的数
            // for (let i = 0; i < pushNo; i++) {
            //   // if (i >= length) {
            //     drugList.push({});
            //   // }
            // }
            // debugger
            // console.log("pushNo, drugList",pushNo, drugList);
            return drugsPushNo(pushNo, drugList);
          // }
        }
        return drugList;
      },
      //zhengyawen在新处方跳转到其他处方之前：将处方概要录入与剂型、取药药房、发药方式以及配送地址暂存在处方list中
      putNewChmDetails(){
        let row = this.currentChuFangRow;
        if(row.orderStatus !== ""){
          return;
        }
        let other = {
          dosageValue: this.selectGroup.dosageValue,
          formDisabled: this.formDisabled,
          takingRoom: this.selectGroup.takingRoom,
          dispendingMethod: this.selectGroup.dispendingMethod,
          chmForm: this.$refs.chmBottomForm.chmForm,
          deliveryForm: this.selectGroup.dispendingMethod === "2" ? this.deliveryForm : {}
        }
        this.$set(this.tableData,this.currentIndex,{
          ...this.tableData[this.currentIndex],
          other,
          ...this.disSelectInfoParams()//病种选择
        })
      },
      //chmDetailsWrapper  处方明细处理外围函数， 历史医嘱引用，无需获取配送地址
      chmDetailsCopy (row, isGetPeiSong = false){
        // this.chmDetails(row, null, null, isGetPeiSong);
        this.chmDetails(row, null, null, true);
      },
      //处方明细
      // eslint-disable-next-line complexity
      async chmDetails(row = { other: {}}, column, event, isGetPeiSong = true) {

        console.log("row:::::: 当前选中", row);

        if (typeof row.trindex !== "undefined") {
          this.currentIndex = row.trindex;
        }
        //新处方跳转到其他处方之前前台暂存录入数据
        this.putNewChmDetails();
        // this.initChmTable();
        row.drugList.forEach(async (item, index) => {
          await this.getQtyUnitAjax(item).then(res => {
            this.$set(row.drugList[index], "unitOptions", res);
          });
        });
        this.tableList = row.drugList;
       // debugger
        this.advicePO = deepClone(row.drugList[0]);
        this.currentChuFangRow = row;

        if(this.currentChuFangRow.orderStatus == '2' || this.currentChuFangRow.orderStatus == '4'){
          this.herMaskShow = true;
        }else{
          this.herMaskShow = false;
        }
        // 判断处方是不是已提交的数据
        console.log(this.currentChuFangRow);
        // 判断处方是不是已提交的的数据
        // this.herMaskShow = false;
        // this.herMaskShow = false;
        this.setMultipleSelections(this.filterDrugsContainId(row.drugList));
        
        // 判断条件是 处方的不是新增的

        if (row.orderStatus !== "" && !row.row_id) {
          this.selectGroup.dispendingMethod = "";
          this.deliveryForm = {};
          // this.selectGroup.dispendingMethod = row.drugList[0].dispendingMethod;
          this.setDispendingMethod(row.drugList[0].dispendingMethod);
          console.log("row::::", row);
          //剂型选择赋值
          this.selectGroup.dosageValue = row.drugList[0].classCode;
          //取药药房赋值
          this.selectGroup.takingRoom = row.drugList[0].receiveDept;
          this.formDisabled = true;// 取药药房 剂型选择禁用
          // 病种选择赋值
          this.disSelectInfo = row.disSelectInfo;
          console.log("病种选择赋值", this.disSelectInfo);
          if(this.selectGroup.dispendingMethod == "2") {
            // 获取配送地址 默认获取
            if (isGetPeiSong) {
              await this.getPrescriptionAddress();
            } 
          }
        } else {
          let { other } = row;
          if(other) {
            //新处方跳转到其他处方之前 再跳回 前台录入数据
            this.setNewChmDetails(row);
          }
          
        }
      },
      //记录 
      setNewChmDetails (row){
        //新增的处方
        //清空地址表单
        try {
          // this.selectGroup.dispendingMethod = row.other.dispendingMethod || "1";
          this.setDispendingMethod (row.other.dispendingMethod || DisMtdDef);
        } catch (error) {
          // this.selectGroup.dispendingMethod = "1";
        }
        
        this.resetAddress({
          shipmentType: ""
        });
        
        if(this.selectGroup.dispendingMethod === "2"){
          //更新新处方地址与属性
          this.deliveryFormProp = deepClone(row.other.deliveryForm);
          this.deliveryForm = deepClone(row.other.deliveryForm);
        }
        
        if (row.other) {
          console.log("赋值操作", row.other.dosageValue);
          this.selectGroup.dosageValue = row.other.dosageValue;
          this.selectGroup.takingRoom = row.other.takingRoom;
          this.$refs.chmBottomForm.chmForm = deepClone(row.other.chmForm);
          //取药药房 剂型选择可选
          this.formDisabled = row.other.formDisabled;
        }

      },
      // code 获取数量单位 中文
      async getQtyUnitAjax(data) {
        this.chmDrugLoading = true;
        // 获取单位数据
        let param = [];
        let shows = [];
        let unitOptions = [];
        shows.push(data.unit);
        shows.push(data.packUnit);
        param.push({
          code: "DrugUnit",
          field: "code",
          shows: shows
        });

        return new Promise((resolve, reject) => {
          getArrayList(param)
            .then(async res => {
              //继续选中操作
              if (res.code === 1) {
                for (let i = 0; i < res.data.DrugUnit.length; i++) {
                  if (res.data.DrugUnit[i].name) {
                    unitOptions.push({
                      label: res.data.DrugUnit[i].name,
                      value: res.data.DrugUnit[i].code
                    });
                  }
                }
                this.chmDrugLoading = false;
                resolve(unitOptions);
              } else {
                this.$message.error(
                  res.msg ? res.msg : "获取药品单位有误，请确认无误后再选择！"
                );
                this.chmDrugLoading = false;
                resolve(false);
              }
            })
            .catch(() => {
              this.chmDrugLoading = false;
              reject(false);
            });
        });
      },
      //查询处方列表
    async queryChuFang() {
      let visitCode =
        typeof this.$store.state.base.receivePatientData["visitCode"] !==
        "undefined"
          ? this.$store.state.base.receivePatientData["visitCode"]
          : "all"; //获取患者就诊ID
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        visitCode: visitCode,
        types: "11"
      };
      this.queryLoading = true;
      return new Promise((resolve, reject) => {
        getOrder(data)
          .then(async res => {
            if (res.code == 1) {
              let dataList = res.data;
              let tableChuFangList = [];
              if (dataList.length > 0) {
                // let recipeCodeList = dataList.map(item => {
                //   // 数量单位转换
                //   // let qty =
                //   //   item.unitFlag == "0" ?
                //   //   item.quantity :
                //   //   item.quantity / item.packQuantity;
                //   // item.limitUnit = item.unit;

                //   //unitFlag 0 小单位 1 大单位
                //   // let unitKey = item.unitFlag == "0" ? item.limitUnit : item.packUnit;
                //   // item.qty = qty;
                //   // item.unitKey = unitKey;

                //   convertFieldFromGetList(item);

                //   item.unitOptions = [];
                //   return item.recipeCode;
                // });
                // recipeCodeList = Array.from(new Set(recipeCodeList));
                // recipeCodeList.forEach(recipeCode => {
                //   let obj = {
                //     recipeCode: recipeCode,
                //     orderStatus: "",
                //     recipeStatus: "",
                //     drugList: []
                //   };
                //   dataList.forEach(sonItem => {
                //     if (sonItem.recipeCode === recipeCode) {
                //       obj.drugList.push(sonItem);
                //       obj.orderStatus = sonItem.orderStatus;
                //       obj.recipeStatus = sonItem.recipeStatus;
                //     }
                //   });
                //   tableChuFangList.push(obj);
                // });
                console.log("dataList::::日志", dataList);
                let tableChuFangList = organizeData(dataList);
                tableChuFangList.forEach(item => {
                  // 增加 enter 跳转 锚点
                  item.drugList = this.setShotReady(item.drugList);
                  item.drugList = this.fillDrugs(item.drugList);
                });

                this.tableData = tableChuFangList;
                //每次刷新处方列表都将表格最新的配送地址设为默认地址 zhengyawen
                // await this.getDefaultAddress();
              } else {
                this.tableData = tableChuFangList;
              }

              this.currentChuFangRow = {};
              
              this.deliveryForm = {};

              //每次刷新处方列表都将表格最新的配送地址设为默认地址 zhengyawen
              await this.getDefaultAddress();
              console.log("this.deliveryForm:::的地址", this.deliveryForm);
              console.log("this.deliveryFormInit:::删除后的默认地址", this.deliveryFormInit);
              
              resolve(true);

            } else {
              this.$message.error(res.msg);
              reject(false);
            }
            this.queryLoading = false;
          })
          .catch(err => {
            this.$message.error("网络错误!");
            this.queryLoading = false;
            reject(false);
          });
      });
    },
      //每次刷新处方列表都将表格最新的配送地址设为默认地址 zhengyawen
      async getDefaultAddress() {
        
        let data = this.tableData;
        // 处方列表为空， 默认患者的档案地址
        if (data.length == 0) {
          this.setDisMtdSanFang();
        } else {
          data = deepClone(data).reverse();
          
          let findItem = data.find(async (item)=>{
            return item.hasOwnProperty("drugList") && item.drugList.length && item.drugList[0].dispendingMethod == "2";
          })

          await this.getDefaultAddressInit(findItem);

          // for (let i in data) {
            // if (data[i].hasOwnProperty("drugList") && data[i].drugList.length) {
            //   let recipeId = data[i].drugList[0].recipeId;
            //   let dispendingMethod = data[i].drugList[0].dispendingMethod;
            //   if (recipeId && dispendingMethod == "2") {
            //     let res = await this.getDefaultAddressInit(data[i]);
            //     if (
            //       this.deliveryFormInit.hasOwnProperty("shipmentType") &&
            //       this.deliveryFormInit.shipmentType
            //     ) {
            //       break;
            //     }
            //   }
            // }
          // }
        }
      },
      
      //每次刷新处方列表都将表格最新的配送地址设为默认地址 zhengyawen
      async getDefaultAddressInit(row) {
        this.deliveryFormInit = {};
        let params = {
          visitCode: this.receivePatientData.visitCode,
          recipeId: row.drugList[0].recipeId
        };
        try {
          let res = await getPrescriptionAddress(params);
          if(res.code == 1) {
            let datas = res.data;
            if(!datas.hasOwnProperty("recipients")) {
              return;
            }
            this.deliveryFormInit = {
              recipients: datas.recipients,
              phoneNumber: datas.phoneNumber,
              address: Array.isArray(JSON.parse(datas.currentAddress)) ?
                JSON.parse(datas.currentAddress) :
                [],
              detail: datas.detail,
              shipmentType: datas.shipmentType,
              dispendingMethod: "2"
            };
            this.deliveryForm = this.deliveryFormInit;
          }
        } catch (e) {
          console.log(e);
        }
      },
      handleCurrentChange() {},
      handleSelectionChange() {},
      selectRow() {},
      searchAdv() {
        this.addTableList();
      },
      // 暂存前的数据处理 
      // eslint-disable-next-line complexity
      zanCunDataHandler (formData){
        let tdObjectArray = this.$refs.mainTable.tdObjectArray;
        let drugs = [];
        for(let i in tdObjectArray){
          let item = tdObjectArray[i];
          if(item.orderItemName) {
              drugs.push({...item});
          } else if (!item.orderItemName && item.id) {
              drugs.push({
                id: item.id,
                dataVersion: item.dataVersion
              });
          }
        }

        // if (drugs.length === 0) {
        //   this.$message.warning("请填写药品！");
        //   return;
        // }

        //转换字段
        drugs.forEach(item => {
          if(item.orderItemName) {
            let unitFlag = getChmUnitFlag(item.limitUnit, item.packUnit, item.unitKey);
            convertFieldToSubmit(item);
          }
        });

        formData.panFriedQuantity = typeof formData.panFriedQuantity == "undefined" ? "" : formData.panFriedQuantity;

        let peiSongAddr = {};//配送地址信息

        // if (this.selectGroup.dispendingMethod == "2") {
          peiSongAddr = this.handleDeliveData();

        //   let { detail } = peiSongAddr;
        //   if (detail == "") {
        //     this.$message.error("请填写详细地址");
        //     return; 
        //   }
        // }

       // debugger
        for (let i = 0; i < drugs.length; i++) {
          if(drugs[i].orderItemName) {
            drugs[i] = {
              ...drugs[i],
              ...formData,
              ...this.disSelectInfoParams(),//病种选择
              dispendingMethod: this.selectGroup.dispendingMethod, //配送方式
              receiveDept: this.selectGroup.takingRoom, //取药药房
              prescriptionAdress: peiSongAddr
            };
          }
        }

        return drugs;
      },
      // eslint-disable-next-line complexity
      async submitSave() {
        
        let isNewCFs = await this.isNewCF();
        if(!isNewCFs){
          return;
        }

        if (Object.keys(this.currentChuFangRow).length === 0) {
          this.$message.warning("请选中需要提交的数据");
          return;
        }

        let orderStatus = this.currentChuFangRow.drugList[0].orderStatus;
        console.log("orderStatus", orderStatus);
        if (orderStatus !== "0" && typeof orderStatus !== "undefined"  && orderStatus !== "") {
          this.$message.warning("仅暂存或新增的数据可以被提交！");
          return;
        }


        try {
          await this.validateTopRules();
        } catch (e) {
          return;
        }

        let isSubmit = await this.isChildItdSubmit();
        if (!isSubmit) {
          return;
        }

        let formData = null;

        try {
          formData = await this.$refs.chmBottomForm.validateForm();
        } catch (error) {
          return;
        }

        let handleDeliveData = this.handleDeliveData();
        // debugger
        if (this.selectGroup.dispendingMethod == "2") {
          //console.log("handleDeliveData:::", handleDeliveData);
          let { provinceCode, cityCode, regionCode } = handleDeliveData;
          if (!provinceCode || !cityCode) {
            this.$message.error("请填写第三方配送地址");
            return;
          }
        }

        let submitData = this.zanCunDataHandler(formData);

        if (submitData.length === 0) {
          this.$message.warning("请填写药品！");
          return;
        }
          

        addAndSubmitHerbalOrder(submitData).then(async res => {
          let { code, msg, data } = res;
          if (code === 1) {
            this.$message.success("提交成功");

            this.initChmTable();
            // this.queryChuFang();

            try {
              await this.queryChuFang();
            } catch (error) {
              return;
            }

            // 暂存后，保留暂存的数据界面
            this.chmDetails(this.tableData.find (item=> item.recipeCode == data[0].recipeCode));
            // this.initChmTable();

            
            this.$nextTick(()=>{// 暂存后 active 行
              this.$refs.singleTable.setCurrentRow(
                this.tableData.find (item=> item.recipeCode == data[0].recipeCode)
              );
            });

            
          } else {
            this.$message.error(msg ? msg : "提交数据失败");
          }
        });
      },
      // 废弃
      async submitSaveOld() {
        let isNewCFs = await this.isNewCF();
        if(!isNewCFs){
          return;
        }

        if (Object.keys(this.currentChuFangRow).length === 0) {
          this.$message.warning("请选中需要提交的数据");
          return;
        }

        let orderStatus = this.currentChuFangRow.drugList[0].orderStatus;
        if (orderStatus !== "0") {
          this.$message.warning("仅暂存的数据可以被提交！");
          return;
        }

        let tdObjectArray = this.$refs.mainTable.tdObjectArray;


        let submitData = this.filterDrugsContainId(
          // this.currentChuFangRow.drugList
          tdObjectArray
        );

        let handleDeliveData = this.handleDeliveData();
        // debugger
        if (this.selectGroup.dispendingMethod == "2") {
          //console.log("handleDeliveData:::", handleDeliveData);
          let { provinceCode, cityCode, regionCode } = handleDeliveData;
          if (!provinceCode || !cityCode) {
            this.$message.error("请填写第三方配送地址");
            return;
          }
        }

        //提交项新增配送信息 zhengyawen
        for (let i = 0; i < submitData.length; i++) {
          submitData[i] = {
            ...submitData[i],
            ...this.disSelectInfoParams(),//病种选择
            dispendingMethod: this.selectGroup.dispendingMethod, //配送方式
            receiveDept: this.selectGroup.takingRoom, //取药药房
            prescriptionAdress: this.selectGroup.dispendingMethod == "2" ?
              handleDeliveData :
              {} //配送地址信息
          };
        }

        submitHerbalOrder(submitData).then(res => {
          if (res.code === 1) {
            this.initChmTable();
            this.queryChuFang();
            this.$message.success("提交成功");
          } else {
            this.$message.error(res.msg ? res.msg : "提交数据失败");
          }
        });
      },
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line complexity
      async printChm() {
        if (this.batchLoading) {
          return;
        }
        this.batchLoading = true;
        let recipeData = { ...this.currentChuFangRow};

        //  处方为新增状态不可以打印
        if (recipeData.row_id && recipeData.orderStatus == "") {
          this.$message.warning("新增的处方不能打印！");
          this.batchLoading = false;
          return;
        }

        // 单处方打印
        if (Object.keys(recipeData).length === 0) {
          this.$message.warning("请选择处方打印！");
          this.batchLoading = false;
          return;
        }

        let drugList = recipeData.drugList.filter(item => {
          return item.orderItemName;
        });
        // 暂存的医嘱不可打印
        if (recipeData.orderStatus === "0") {
          this.$message.warning("暂存的处方不能打印！");
          this.batchLoading = false;
          return;
        }

        try {
          await this.outpatientOrderPrint(drugList[0].recipeId);
          this.batchLoading = false;
        } catch (error) {
          this.batchLoading = false;
        }
        // let res = await outpatientOrderPrint({
        //   visitCode: this.receivePatientData.visitCode,
        //   recipeId: drugList[0].recipeId,
        //   patientId: this.receivePatientData.patientId,
        //   type: "chineseAdvice"
        // });
        // if(res.code === 1) {
        //   let data = res.data;
        //   if(res.data.recipeCode === "" || res.data.recipeCode === undefined){
        //     this.$delete(data,"recipeCode");
        //   }

        //   let printData = data;

        //   // useMethod 为undefined ,值处理成空
        //   printData.useMethod = printData.useMethod || "";

        //   let { diagList, part3 } = printData;
        //   let rDiagList = diagList[0].diagList;
        //   // onPreview(data, "门诊处方(草药)");
        //   let aParse = eval(compile(diagNameTpl));
        //   printData.Diagnosis = aParse(rDiagList);

        //   let bParse = eval(compile(chmContenTpl));
        //   printData.RecipeDetails = bParse(part3);
        //   console.log("printData", printData);
        //   print(null, this.printTpl, {}, printData);
        // }
        // this.batchLoading = false;
      },
      // 获取 除 暂存 和 新增以外的处方
      getNotZanCunList (){
        // 0 暂存
        // 3 退费  

        let notZanCunList = this.tableData.filter(item => {
          let { orderStatus, recipeStatus } = item;
          // 3 退费  
          let isReturnFee = recipeStatus == 3;
          return item.orderStatus != 0 && 
                 item.orderStatus != "" && 
                 item.recipeCode && 
                 !isReturnFee // 不包含退费
        });
        return notZanCunList;
      },
      validatePrintChmList () {
        let flag = false;
        for (let i in this.tableData) {
          let item = this.tableData[i];
          if(item.row_id && item.orderStatus == "") {
            this.$message.warning("新增的处方不能打印！");
            flag = true;
            break;
          }
          if(item.orderStatus === "0") {
            this.$message.warning("暂存的处方不能打印！");
            flag = true;
            break;
          }
        }
        return flag;
      },
      outpatientOrderPrint (recipeId, printDirect = false){
        return new Promise(async (resolve, reject)=>{
          try {
            let res = await outpatientOrderPrint({
              visitCode: this.receivePatientData.visitCode,
              recipeId,
              patientId: this.receivePatientData.patientId,
              type: "chineseAdvice"
            });
            if(res.code === 1) {
              let data = res.data;
              if(res.data.recipeCode === "" || res.data.recipeCode === undefined){
                this.$delete(data,"recipeCode");
              }

              let printData = { ...data };

              // useMethod 为undefined ,值处理成空
              // printData.useMethod = printData.useMethod || "";

              let { diagList, part3 } = printData;
              // 切割数组， 10个单位，返回数据格式[[1,2],[3,4]]
              let newParts3 = this.cutArrFunc(part3);
              // console.log("newParts3", newParts3);
              // 药品少于 20个的 一页内打印。多于 20个的，打印多个页
              for (let index = 0; index < newParts3.length; index ++) {
                printData.part3 = newParts3[index];
                // 一个处方 打印多个页面，除最后一个页面有 以下处方空白 其他页面没有
                if (index < newParts3.length - 1 && newParts3.length > 1){// newParts3 多于 1个
                  for (let j = 0; j < printData.part3.length; j++) {
                    printData.part3[j]["hideKongBai"] = true;
                  }
                }

                // console.log(deepClone(printData));
                // 打印函数
                this.dataPrintFunc(deepClone(printData), true);
              }
              // let rDiagList = diagList[0].diagList;
              // onPreview(data, "门诊处方(草药)");
              // let aParse = eval(compile(diagNameTpl));
              // printData.Diagnosis = aParse(rDiagList);

              // let bParse = eval(compile(chmContenTpl));
              // printData.RecipeDetails = bParse(part3);
              // console.log("printData", printData, chmLodopTpl);
              // print(null, this.printTpl, {}, printData, printDirect);
              
              //print(null, chmLodopTpl, {}, printData, printDirect);
              resolve(true);
            } else {
              reject(false);
            }
          } catch (error) {
            reject(false);
          }

        });
      },
      // 数组分割 10个一组  20位中草药打印在一张处方单
      cutArrFunc (data = []){
        let result = [];
        for(var i=0, len=data.length; i<len; i+=1000){
          result.push(data.slice(i,i+1000));
        }
        return result;
      },
      // 20个 药品一页  超出 打印第二页
      dataPrintFunc (printData = {}, printDirect){
        chmOrderItemPrintHandle(printData, {printTpl: this.printTpl, chmContenTpl, diagnoseTplChm} );
      //   let diagNameParams = {
      //     maxLineNum: 3 // 诊断的最大行数
      //   }

      //   let obj = {
      //     diagHtmlHeight: "14pt",// 诊断模块 高度 
      //     cHtmlLineTop: "169pt",// 诊断 与 药品中间的线的绝对 top 
      //     dispendingMethTop: "175pt", // 发药方式绝对 top 
      //     contentHtmlTop: "177pt", // 中草药模块的 绝对 top 
      //     MIS_ID: "",
      //     settlemetnType: "",
      //     patientNum: "",
      //     patientGender: "",
      //     age: "",
      //     deptId: "",
      //     outpDeptName: "",
      //     doctorName: "",
      //     diagTime: "",
      //     relateAddress: "",
      //     relateNum: "",
      //     applyNum: "",
      //     chargpeople: "",
      //     visitCode: "",
      //     relateCode: "",
      //     weight: "",
      //     diagList: [ { diagList: [{}] }]
      //   };
        
      //   printData = {
      //     ...obj,
      //     ...printData
      //   }  
      // // 获取打印诊断 相关参数
      // let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj, dispendingMethTop } = diagPrintChmParams(printData.diagList[0].diagList, diagNameParams);
 
      //   obj = {
      //     ...obj,
      //     ...{
      //       diagHtmlTop, dispendingMethTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
      //     }
      //   }



      //   // useMethod 为undefined ,值处理成空
      //   printData.useMethod = printData.useMethod || "";

      //   let { diagList, part3 } = printData;
      //   let rDiagList = diagList[0].diagList;
      //   // onPreview(data, "门诊处方(草药)");
      //   let aParse = eval(compile(diagnoseTplChm));
      //   printData.Diagnosis = aParse(diagNameObj);

      //   let bParse = eval(compile(chmContenTpl));
      //   printData.RecipeDetails = bParse(part3);

      //   //体重 weight
      //   printData.weight = printData.weight ? printData.weight : "";
      //   //处方类型 diseaseRecipeType
      //   printData.diseaseRecipeType = printData.diseaseRecipeType ? printData.diseaseRecipeType : "";
      //   //社康中心  处方笺
      //   printData.hosName = printData.hosName + "处方笺";
      //   // 姓名截取前八位
      //   printData.patientName = printData.patientName ? printData.patientName.substring(0,8) : "";
        
      //   // 体重 加 单位 KG
      //   printData.weight = printData.weight ? printData.weight + "kg" : "";



      //   // console.log("printData", printData, chmLodopTpl);
      //   // print(null, this.printTpl, {}, printData, printDirect);
      //   print(null, this.printTpl, {}, printData, false);
      },
      async printChmAll (){
        if (this.batchsLoading) {
          return;
        }
        if (!this.tableData.length) {
          this.$message.warning("暂无处方可以打印！");
          return;
        }

        let recipeIdsList = [];
        try {
          recipeIdsList = this.getNotZanCunList().map(item => item.drugList[0].recipeId);
        } catch (error) {
          
        }
        console.log("recipeIdsList:::", recipeIdsList);
        for (let index = 0; index < recipeIdsList.length; index++) {
          const recipeIdItem = recipeIdsList[index];
          try {
            this.batchsLoading = true;
            await this.outpatientOrderPrint(recipeIdItem, true);
            this.batchsLoading = false;
            continue;
          } catch (error) {
            this.batchsLoading = false;
            break;
          }
        }
      },
      async printChmList() {
       if (this.batchsLoading) {
          return;
        }
        if (!this.tableData.length) {
          this.$message.warning("暂无处方可以打印！");
          return;
        }
        this.batchsLoading = true;
        if(this.validatePrintChmList()) {
          this.batchsLoading = false;
          return;
        }
        let recipeIds = "";
        this.tableData.forEach((item,index)=>{
          if (index != 0) {
            recipeIds = recipeIds + "," + item.drugList[0].recipeId; 
          } else {
            recipeIds = item.drugList[0].recipeId;
          }
        });
        
        try{
          let res = await outpatientOrderListPrint({
            visitCode: this.receivePatientData.visitCode,
            recipeIds,
            patientId: this.receivePatientData.patientId,
            type: "chineseAdvice"
          });
          if(res.code === 1) {
            let data = res.data;
            let printData = data;

            // useMethod 为undefined ,值处理成空
            printData.useMethod = printData.useMethod || "";

            let { diagList, part3 } = printData;
            let rDiagList = diagList[0].diagList;
            // onPreview(data, "门诊处方(草药)");
            let aParse = eval(compile(diagNameTpl));
            printData.Diagnosis = aParse(rDiagList);

            let bParse = eval(compile(chmContenTpl));
            printData.RecipeDetails = bParse(part3);
            console.log("printData", printData);
            print(null, "t2", {}, printData);
          }
          this.batchsLoading = false;
        }catch(e){
          this.batchsLoading = false;
        }
      },  
      async deleteHandler() {
        let isNewCFs = await this.isNewCF();
        if(!isNewCFs){
          return;
        }
        let row_id = this.currentChuFangRow.row_id;
        if (row_id) {
          this.tableData = this.tableData.filter(item => {
            return row_id !== item.row_id;
          });
          this.initChmTable();
          return;
        }
        if (Object.keys(this.currentChuFangRow).length === 0) {
          this.$message.info("请选中需要删除的数据");
          return;
        }

        this.$refs.topForm.clearValidate(); //清除顶部的校验
        //过滤 包含Id的药品
        let deleteData = this.filterDrugsContainId(
          this.currentChuFangRow.drugList
        );

        this.$confirm("删除后不可恢复，是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            delHerbalOrder(deleteData)
              .then(res => {
                if (res.code === 1) {
                  this.initChmTable();
                  this.queryChuFang();
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: res.msg || "删除失败"
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: "error",
                  message: "删除失败"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      quote() {
        let {
          patientId
        } = this.receivePatientData;
        if (patientId) {
          this.copyOrderVisible = true;
        } else {
          this.$message.info("请选择一名患者");
        }
      },
      emptyTableList() {
        // let listLength = this.tableList.length;
        // listLength = length > totalTdNum ? length : totalTdNum;
        this.tableList = [];
        for (let i = 0; i < totalTdNum; i++) {
          // this.tdObjectArray.push({});
          this.tableList.push({});
          //LInput 组件重置值
          this.$nextTick(() => {
            let nodeList = getDataIdDom("div", "data-id", "mainTableTdCls" + i);
            if (nodeList.length > 0) {
              nodeList[0].getElementsByClassName("el-input__inner")[0].value = "";
            }
          });
        }
      },
      emptyList() {
        let list = [];
        for (let i = 0; i < totalTdNum; i++) {
          list.push({});
        }
        return list;
      },
      initChmTable() {
        this.emptyTableList();
        this.advicePO = {};
        this.herMaskShow = true;
        this.currentChuFangRow = {};
      },
      takingRoomChange (deptId){
        let newPharmacyObject = getPharmacyObjectFunc(deptId, deepClone(this.chmPharmacyObject));
        this.changeChmPharmacyObject(newPharmacyObject);
      },
      //病种选择 插入函数
      disSelectInfoParams (){
      //  let params = {
      //    chronicDisease: this.disSelectInfo.ChronicDisease,
      //    chronicDiseaseName: this.disSelectInfo.ChronicDiseaseName
      //  };
       return this.disSelectInfo;
      },
      async getPrintTplFunc (){
        try {
          // this.printTpl = await getPrintTplFunc(codes.t2);
          this.printTpl = chmLodopTpl;
        } catch (error) {
          
        }
        console.log("printTpl", this.printTpl);
      }
    },
    async created() {
      //      this.fetchTableList();

      this.initChmTable();
      this.queryChuFang();

      this.getPrintTplFunc();
      
      // this.getTakingRoomList(); //取药药房接口
    },
    mounted (){
      // 进入页面 新增处方
      this.add();
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      ...mapGetters("cis", ["chmMedicineQuote"]),
      ...mapGetters("adviceCommon", ["chmPharmacyObject"])
    },
    watch: {
      chmPharmacyObject:{
        deep: true,
        immediate: true,
        handler(c) {
          this.selectGroup.takingRoom = c.selected.deptId
        }
      },
      receivePatientData: {
        handler(c) {
          let addrCode = [];
          if(c.currentProvinceCode) {
              addrCode[0] = Number(c.currentProvinceCode);
          };
          if(c.currentCityCode) {
              addrCode[1] = Number(c.currentCityCode);
          };
          if(c.currentRegionCode) {
              addrCode[2] = Number(c.currentRegionCode);
          };
          this.receivePatientDataInit = {
            ...c,
            address: c.currentDetail,
            addrCode
          }
          this.searchForm.inpCode = c.inpCode;
          this.searchForm.patientId = c.patientId;
          this.searchForm.wardId = c.wardId;
          this.searchForm.bedNo = c.bedCode;
          this.searchForm.patientName = c.patientName;
          if (this.moduleType === "cis") {
            //门诊号
            this.searchForm.visitCode = c.visitCode;
          }

          //          this.fetchTableList();
          //zhengyawen
          // this.selectGroup.dispendingMethod = "1";
          this.setDispendingMethod(DisMtdDef);
          this.deliveryForm = {};
          // this.deliveryFormInit = {
          //   dispendingMethod: DisMtdDef
          // };
          this.deliveryFormInit = {};
          this.queryChuFang();
          this.initChmTable();
          // 发药方式 数据共享， 引用模板使用
          this.changeChmDispgMethCode(this.selectGroup.dispendingMethod);
        },
        immediate: true
      },
      // tableList: {
      //   deep: true,
      //   handler(list) {
      //     for (let index = 0; index < list.length; index++) {
      //       const item = list[index];
      //       // if (item.id || item.row_id || item.delete) {
      //       if (item.id) {// 在
      //          console.log("赋值操作tableList", item.classCode, item);
      //         // this.selectGroup.dosageValue = item.classCode;
      //         // this.selectGroup.takingRoom = item.receiveDept || this.takingRoomList[0].deptId;
      //         // this.selectGroup.takingRoom = item.receiveDept || this.selectGroup.takingRoom;
      //         // this.formDisabled = true;
      //         break;
      //       } else {
      //         // this.formDisabled = false;
      //       }
      //     }
      //   }
      // },
      chmMedicineQuote: {
        deep: true,
        async handler(c) {
          let cloneData = deepClone(c);
          let params = [];
          // 清空频次数据
          cloneData.forEach(item => {
            let { frequencyUnit, frequencyTimes, frequencyCode } = defaultFreq;
            item.frequencyCode = frequencyCode;
            item.frequencyTimes = frequencyTimes;
            item.frequencyUnit = frequencyUnit;

            //增加引用数据 标志 quoteFlag
            item.quoteFlag = true;
            
            params.push({
              quantity: item.quantity,
              useQty: this.chmForms().useQty || 1,
              orderItemId: item.orderItemId,
              packUnit: item.packUnit,
              unit: item.limitUnit,
              unitKey: item.unitKey,
              orderItemName: item.orderItemName,
              dispendingMethod: this.selectGroup.dispendingMethod,
              receiveDept: this.selectGroup.takingRoom
            })
          });
          // console.log("cloneData:::", cloneData);
          this.formDisabled = false;

          //校验药品是否有库存 zhengyawen
          // if(cloneData.length){
          //   let flag = await validQuoteHerbalChnDrug(params, "引用失败");
          //   if(!flag){
          //     return;
          //   }
          // }


          // if(Object.keys(this.currentChuFangRow).length > 0 && this.currentChuFangRow.orderStatus == "") {
            // // 校验药品的剂型跟主界面是否一致zhengyawen
            // let isSameJX = cloneData.some(sItem => {
            //   return sItem.classCode != this.selectGroup.dosageValue;
            // });
            
            // if (isSameJX) {
            //   this.$message.warning("当前处方模板剂型不符，请重新选择模板进行引用！");
            //   return;
            // }
          // } else {
            // 新增处方 会默认模板的 剂型选择
            // this.selectGroup.dosageValue = cloneData[0].classCode;
          // }

          // debugger

          // if (
          //   Object.keys(this.currentChuFangRow).length > 0 &&
          //   this.currentChuFangRow.quoteFlag
          // ) {

          //新增的处方 可以引用模板。 暂存的处方，需要新增一条处方处理
          if (
            Object.keys(this.currentChuFangRow).length > 0 && this.currentChuFangRow.orderStatus == ""
          ) {

            // // 校验药品的剂型跟主界面是否一致zhengyawen
            let isSameJX = cloneData.some(sItem => {
              return sItem.classCode != this.selectGroup.dosageValue;
            });
            
            if (isSameJX) {
              this.$message.warning("当前处方模板剂型不符，请重新选择模板进行引用！");
              return;
            }

            let currentRowData = this.tableData[this.currentIndex];
            // 校验 是否 有相同的中草药
            let isSame = currentRowData.drugList.some(item => {
              return cloneData.some(sItem => {
                return sItem.orderItemId === item.orderItemId;
              });
            });

            if (isSame) {
              this.$message.warning("有相同的中草药，请选择其他的处方！");
              return;
            }


            


            // 对有药品的项 增加delete_id
            cloneData.forEach((item, index) => {
              if (item.orderItemId) {
                item.delete_id = String(+new Date() + String(index));
                item.row_id = currentRowData["row_id"];
                item.recipeCode = currentRowData["recipeCode"];
                item.orderStatus = currentRowData["orderStatus"];

                // 数量单位转换 START
                // let qty =
                //   item.unitFlag === "0" ?
                //   item.quantity :
                //   item.quantity / item.packQuantity;

                // let unitKey = item.unitFlag === "0" ? item.unit : item.packUnit;

                // item.qty = qty;
                // item.unitKey = unitKey;
                convertFieldFromGetList(item);
                // 数量单位转换 END

                
                if(currentRowData.drugList && currentRowData.drugList.length > 0){
                  //后来追加的处方 需要剂型选择和取药药房一致 START
                  // item.classCode = currentRowData.drugList[0].classCode;
                  item.receiveDept = currentRowData.drugList[0].receiveDept || this.selectGroup.takingRoom;
                  this.selectGroup.takingRoom = item.receiveDept;
                  //后来追加的处方 需要剂型选择和取药药房一致 END
                }

              }
            });

            //拼接数据 START
            let realDrugList = currentRowData.drugList.filter((item, index) => {
              return typeof item.orderItemId !== "undefined";
            });
            realDrugList = [...realDrugList, ...cloneData];
            console.log("realDrugList::::", realDrugList);
            currentRowData.drugList = this.insertArray(realDrugList);
            //拼接数据 END
            this.chmDetails(currentRowData);
            
            this.$nextTick(() => {
              this.$refs.singleTable.setCurrentRow(
                this.tableData[this.tableData.length - 1]
              );
              // 剂型选择 和 取药药房 禁用
              this.formDisabled = true; 
            })

          } else {
            // 新增处方 会默认模板的 剂型选择
            this.selectGroup.dosageValue = cloneData[0].classCode;
            await this.add(cloneData);
            // 剂型选择 和 取药药房 禁用
            this.formDisabled = true;
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">
@import "./chmMedicine.scss";
</style>
