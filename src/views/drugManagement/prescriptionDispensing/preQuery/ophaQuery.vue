<template>
  <el-card class="height100 position-relative">
    <el-form label-width="90px" :model="recipeForm" class="height-button-main">
      <!-- 处方信息 -->
      <div class="cftitle no-wrap">
        <el-row>
          <el-col>
            <span class="label">处方号：</span>
            <span class="title">{{ recipeForm.recipeCode }}</span>
            <span class="pre" v-if="recipeForm.companyCode">
              (
              <span
                tableName="fin_company"
                :conditionMap="{ company_code: recipeForm.companyCode }"
                columns="company_name"
                v-tableTransform
              ></span>
              )
            </span>
            <span class="pre" v-if="recipeForm.isFree === '1'">
              (
              <span v-if="recipeForm.isFree">免费处方</span>)
            </span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <span class="label">患者姓名：</span>
            <span>{{ recipeForm.patientName }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">性别：</span>
            <span
              :val="recipeForm.patientGender"
              code="GENDER_CODE"
              v-codeTransform
            ></span>
          </el-col>
          <el-col :span="6">
            <span class="label">年龄：</span>
            <span :title="recipeForm.patientAge">{{
              recipeForm.patientAge
            }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">门诊号:</span>
            <span :title="recipeForm.visitCode">{{
              recipeForm.visitCode
            }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <span class="label">科室：</span>
            <span :title="recipeForm.deptName">{{ recipeForm.deptName }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">开单医生：</span>
            <span :title="recipeForm.doctorUserName">{{
              recipeForm.doctorUserName
            }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">医嘱时间：</span>
            <span :title="recipeForm.orderTime">{{
              recipeForm.orderTime
            }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <span class="label">门诊诊断：</span>
            <span :title="recipeForm.clinicDiag">{{
              recipeForm.clinicDiag
            }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <span class="label">总金额：</span>
            <span>{{ formatNum(recipeForm.prescriptionAmt) }}元</span>
          </el-col>
          <el-col :span="6">
            <span class="label">联系方式：</span>
            <span :title="recipeForm.phoneNum">{{ recipeForm.phoneNum }}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">地址：</span>
            <span :title="recipeForm.patientAddr">{{
              recipeForm.patientAddr
            }}</span>
          </el-col>
        </el-row>
      </div>

      <!-- 状态信息 -->
      <div class="cftitle no-wrap" style="border:0;">
        <el-row :gutter="20">
          <el-col :span="6">
            <span class="label">收费状态：</span>
            <span>{{
              recipeForm.chargeState
                ? recipeForm.chargeState == 0
                  ? "未收费"
                  : "已收费"
                : ""
            }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">收费人员：</span>
            <span :title="recipeForm.chargeUserName">{{
              recipeForm.chargeUserName
            }}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">收费时间：</span>
            <span :title="recipeForm.chargeTime">{{
              recipeForm.chargeTime
            }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <span class="label">配方状态：</span>
            <span>{{
              recipeForm.dispenseState
                ? recipeForm.dispenseState == 0
                  ? "未配药"
                  : "已配药"
                : ""
            }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">配方人员：</span>
            <span :title="recipeForm.dispenseUserName">{{
              recipeForm.dispenseUserName
            }}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">配方时间：</span>
            <span :title="recipeForm.dispenseTime">{{
              recipeForm.dispenseTime
            }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <span class="label">发药状态：</span>
            <span>{{
              recipeForm.deliveryState
                ? recipeForm.deliveryState == 0
                  ? "未发药"
                  : "已发药"
                : ""
            }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">发药药房：</span>
            <span
              :title="codeToText(recipeForm.deliveryPhCode, drugStorageList)"
              >{{
                codeToText(recipeForm.deliveryPhCode, drugStorageList)
              }}</span
            >
          </el-col>
          <el-col :span="6">
            <span class="label">发药窗口：</span>
            <!--
            <span :title="codeToText(recipeForm.deliveryWindowCode,pharWindowList)">{{codeToText(recipeForm.deliveryWindowCode, pharWindowList)}}</span>
-->
            <span :title="recipeForm.deliveryWindowName">{{
              recipeForm.deliveryWindowName
            }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <span class="label">发药人员：</span>
            <span :title="recipeForm.deliveryUserName">{{
              recipeForm.deliveryUserName
            }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">发药时间：</span>
            <span :title="recipeForm.deliveryTime">{{
              recipeForm.deliveryTime
            }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">处方味数：</span>
            <span :title="recipeForm.drugVarietyQuantity">{{
              recipeForm.drugVarietyQuantity
            }}</span>
          </el-col>
        </el-row>
        <el-row
          style="padding: 5px 0"
          :gutter="20"
          v-if="recipeForm.orderType === '11'"
        >
          <el-col :span="24"
            ><span style="font-weight: 600;">中草药处方概要</span></el-col
          >
          <el-col :span="24">
            <el-col :span="6">
              <span class="label">用药剂数：</span>
              <span :title="recipeForm.useQty">{{ recipeForm.useQty }}</span>
            </el-col>
            <el-col :span="6">
              <span class="label">用药频次：</span>
              <span
                columns="FREQUENCY_NAME"
                :conditionMap="{ FREQUENCY_CODE: recipeForm.frequencyCode }"
                tableName="hrp_frequency"
                v-tableTransform
              ></span>
            </el-col>
            <el-col :span="6">
              <span class="label">用法：</span>
              <span
                :val="recipeForm.useage"
                code="usage"
                v-codeTransform
              ></span>
            </el-col>
            <el-col :span="6">
              <span class="label">制药方法：</span>
              <span
                :val="recipeForm.pharmaMethods"
                code="productionMethod"
                v-codeTransform
              ></span>
              <!-- <el-button class="filter-item float-right" type="primary" @click="dialogVisible = true">改为配送</el-button> -->
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <span class="label">配送方法：</span>
              <span class="label">{{
                recipeForm.dispendingMethod == "1"
                  ? "自取"
                  : deliveryForm.shipmentType == "0"
                  ? "配送到家"
                  : "配送到社康"
              }}</span>
              <!-- <el-button
                @click="seeAdrss"
                v-if="recipeForm.dispendingMethod !== '1'"
                >查看地址</el-button
              > -->
            </el-col>
            <el-col :span="6">
              <span class="label">配送状态：</span>
              <span v-if="recipeForm.dispensingState == '0'">配送成功</span>
              <span v-if="recipeForm.dispensingState == '1'">审核成功</span>
              <span v-if="recipeForm.dispensingState == '2'">审核失败</span>
              <span v-if="recipeForm.dispensingState == '9'">配送失败</span>
              <el-button
                @click="sendToThird"
                v-if="recipeForm.dispensingState == '9'"
                >配送处方</el-button
              >
            </el-col>
            <el-col :span="6">
              <span class="label">联系电话：</span>
              <span>{{ deliveryForm.phoneNumber }}</span>
            </el-col>
            <el-col :span="6">
              <span class="label">备注：</span>
              <span class="label">{{ recipeForm.recordRemark }}</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="6" style="line-height: 32px;">
              <span class="label">收货人姓名：</span>
              <span>{{ deliveryForm.recipients }}</span>
            </el-col>
            <el-col :span="6">
              <span class="label">联系地址：</span>
              <l-value-domain
                style="width:200px"
                type="cascader"
                code="AdministrativDivision"
                disabled
                :value.sync="deliveryForm.address"
                remoteValueKey="id"
                remoteShowKey="label"
                :multiple="false"
                :relation="true"
                :maxNum="3"
                placeholder="联系地址"
              ></l-value-domain>
            </el-col>
            <el-col :span="12" style="line-height: 32px;">
              <span class="label">详细地址：</span>
              <span>{{ deliveryForm.detail }}</span>
            </el-col>
          </el-col>
        </el-row>
      </div>

      <el-row
        class="position-absolute"
        style="padding:0px 20px;left: 0;right: 0;top:340px;bottom: 65px;"
      >
        <!-- 详细药品表格 -->
        <el-table :data="orderTable" height="100%" stripe border>
          <el-table-column
            prop="drugName"
            label="药品名称"
            min-width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="spec"
            label="规格"
            min-width="150"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="price"
            align="right"
            label="单价(元)"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ formatNum(scope.row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="originCode"
            label="生产厂家"
            min-width="180"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                :val="scope.row.originCode"
                code="Manufacturer"
                v-codeTransform
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            v-if="recipeForm.orderType === '11'"
            label="单剂用量"
            min-width="80"
          >
            <template slot-scope="scope">
              <span class="overflow-point">{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="displayQuantity"
            label="数量"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="displayUnit"
            label="单位"
            min-width="80"
          >
            <template slot-scope="scope">
              <span
                :val="scope.row.displayUnit"
                code="DrugUnit"
                v-codeTransform
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="medicationCode"
            label="用法"
            min-width="180"
          >
            <template slot-scope="scope">
              <span
                v-if="recipeForm.orderType != '11'"
                :val="scope.row.medicationCode"
                code="MedicationRouteCode"
                v-codeTransform
              ></span>
              <span
                v-if="recipeForm.orderType === '11'"
                :val="scope.row.medicationCode"
                code="fryingRemark"
                v-codeTransform
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="specialUsage"
            label="备注"
            min-width="120"
          ></el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <printNameseter
      v-if="printNameseterVisible"
      title="打印机设置"
      width="800px"
      :visible.sync="printNameseterVisible"
      :requiredName="requiredName"
      @closePrintSeterFuc="closePrintSeterFuc"
    ></printNameseter>
    <div class="height-button-bottom bottominpt">
      <el-row>
        <el-col style="text-align: right;font-size:0;">
          <el-button type="primary" @click="printRecipe">处方打印</el-button>
          <el-button class="filter-item" @click="printLabelValied"
            >打印标签贴</el-button
          >
          <!--          <el-button class="filter-item" @click="exportExcel">导出</el-button>-->
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      title="配送地址"
      width="450px"
      @cancel="dialogVisible = false"
    >
      <div class="delivery-box">
        <el-radio-group
          v-model="deliveryForm.shipmentType"
          disabled
          class="mgb8"
        >
          <el-radio label="0">配送到家</el-radio>
          <el-radio label="1">配送到社康</el-radio>
        </el-radio-group>
        <el-form :model="deliveryForm" ref="deliveryForm" class="demo-ruleForm">
          <el-row :gutter="8" class="mgb8">
            <el-col :span="12">
              <el-form-item prop="recipients">
                <l-formt-title required label="收货人姓名">
                  <el-input
                    v-model="deliveryForm.recipients"
                    disabled
                    placeholder="请输入"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="phoneNumber">
                <l-formt-title required label="联系电话">
                  <el-input
                    v-model="deliveryForm.phoneNumber"
                    disabled
                    placeholder="请输入"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="address">
              <l-formt-title required label="联系地址">
                <!-- <el-input v-model="deliveryForm.shippingAddress" placeholder="请输入"></el-input> -->
                <l-value-domain
                  type="cascader"
                  code="AdministrativDivision"
                  disabled
                  :value.sync="deliveryForm.address"
                  remoteValueKey="id"
                  remoteShowKey="label"
                  :multiple="false"
                  :relation="true"
                  :maxNum="3"
                  placeholder="联系地址"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item prop="detail">
              <l-formt-title required label="详细地址">
                <el-input
                  v-model="deliveryForm.detail"
                  disabled
                  placeholder="请输入"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  drugsTpl,
  diagNameTpl,
  diagnoseTplChm,
  chmContenTpl
} from "@/components/adviceCommon/printTpl/tpl.js";
import { PrintLabel } from "@/printTemplete/module/printLabel.js";
import { compile, westOrderItemPrintHandle, chmOrderItemPrintHandle } from "@/components/adviceCommon/adviceUtils.js";
import { chmLodopTpl } from "@/printTemplete/module/chmLodopTpl.js";
import { westLodopTpl } from "@/printTemplete/module/westLodopTpl.js";
import opha from "@/api/hmm/opha";
import { getPrescriptionAddress } from "@/api/cis/order/order";
import { localCodeTransform } from "@/utils/util";
import { onPreviewData } from "@/utils/print";
import { print } from "@/utils/print_new.js";
import { deepClone } from "@/utils/index.js";
import {
  transformCode,
  transformCodeList
} from "@/api/directive/directiveRequest";
import { jsonToExcel } from "@/utils/excel/excel";
import formatNum from "@/utils/formatPrice.js";
import { outpatientOrderPrint } from "@/api/cis/report/cisPrints.js";



export default {
  props: {
    recipeFormid: {
      type: String
    },
    drugStorageList: {
      type: Array
    },
    pharWindowList: {
      type: Array
    }
  },
  data() {
    return {
      printerName:'',
      printNameseterVisible: false,
      recipeTable: [],
      //右侧列表数据源
      orderTable: [],
      recipeForm: {},
      // 地址数据  start
      dialogVisible: false,
      deliveryForm: {
        shipmentType: "0", //配送方式/类型
        recipients: "", //收货人姓名
        phoneNumber: "", //联系电话
        address: "", //联系地址
        detail: "", //详细地址
        recipeId: "", //处方号id
        provinceCode: "", //户籍省
        cityCode: "", //户籍市
        regionCode: "", //户籍区
        dataVersion: "",
        id: ""
      },
      // 地址数据  end
      //反显数据
      codeTransformList: {}
    };
  },
  watch: {
    recipeFormid: {
      handler(val) {}
    }
  },
  methods: {
    //点击左侧的  立即刷新界面
    autoSendDrugFun() {
      let val = this.recipeFormid;
      console.log(val);
      if (val) {
        console.log(val);
        this.findDetail(val);
      } else {
        this.recipeForm = this.$options.data().recipeForm;
        this.orderTable = [];
      }
    },
    // 查看地址  start
    async getDefaultAddressInit() {
      console.log(`查看地址`);
      this.deliveryFormInit = {};
      let params = {
        visitCode: this.recipeForm.visitCode,
        recipeId: this.recipeForm.recipeId
      };
      console.log("查询地址的", params);
      try {
        let res = await getPrescriptionAddress(params);
        if (res.code == 1) {
          let datas = res.data;
          console.log(datas, "打印地址信息");
          this.deliveryForm.recipeId = datas.recipeId || "";
          this.deliveryForm.visitCode = datas.visitCode || "";
          this.deliveryForm.id = datas.id || "";
          this.deliveryForm.dataVersion = datas.dataVersion || "";
          this.deliveryForm.recipients = datas.recipients || "";
          this.deliveryForm.phoneNumber = datas.phoneNumber || "";
          this.deliveryForm.detail = datas.detail || "";
          this.deliveryForm.shipmentType = datas.shipmentType || "0";
          this.deliveryForm.dispendingMethod = "2";
          if (datas.currentAddress) {
            this.deliveryForm.address =
              datas.currentAddress && datas.currentAddress.indexOf(",]") > -1
                ? JSON.parse(datas.currentAddress.split(",]")[0] + "]")
                : Array.isArray(JSON.parse(datas.currentAddress))
                ? JSON.parse(datas.currentAddress)
                : [];
            for (let i = 0; i < address.length; i++) {
              this.deliveryForm.address.push(Number(address[i]));
            }
          } else {
            this.deliveryForm.address = [];
          }
          this.deliveryForm.provinceCode = this.deliveryForm.address[0] || "";
          this.deliveryForm.cityCode = this.deliveryForm.address[1] || "";
          this.deliveryForm.regionCode = this.deliveryForm.address[2] || "";
        }
      } catch (e) {
        console.log(e);
      }
    },
    seeAdrss() {
      this.dialogVisible = true;
      //  this.getDefaultAddressInit();
    },
    // 查看地址  end
    formatNum(num) {
      return formatNum(num);
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    //根据传递过来的id 初始化右侧列表信息
    async findDetail() {
      this.orderTable = [];
      try {
        this.$showLoading();
        let response = await opha.get(this.recipeFormid);
        let { data } = response;
        this.recipeForm = data;
        data["recipeDVOList"].forEach(element => {
          element.orderType = data.orderType;
        });
        this.orderTable = [...data["recipeDVOList"]];
        this.getDefaultAddressInit();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async sendToThird() {
      try {
        this.$showLoading();
        let res = await opha.sendToThird([
          {
            id: this.recipeForm.id
          }
        ]);
        if (res.code === 1) {
          this.$message.success(res.msg || "发送成功!");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async printRecipe() {
      let res = await outpatientOrderPrint({
        visitCode: this.recipeForm.visitCode,
        recipeId: this.recipeForm.recipeId,
        patientId: this.recipeForm.patientId,
        type:
          this.recipeForm.orderType === "11" ? "chineseAdvice" : "westAdvice"
      });
      if (res.code === 1) {
        let data = res.data;
        if (res.data.recipeCode === "" || res.data.recipeCode === undefined) {
          this.$delete(data, "recipeCode");
        }
        if (this.recipeForm.orderType === "11") {
          console.log(`data111`, data);
            chmOrderItemPrintHandle(data, {printTpl: chmLodopTpl, chmContenTpl, diagnoseTplChm} );
          // chmLodopTpl
          // const printData = data;
          // let { diagList, part3 } = printData;
          // let rDiagList = diagList[0].diagList;
          // // onPreview(data, "门诊处方(草药)");
          // // let aParse = eval(compile(diagNameTpl));
          // // printData.Diagnosis = aParse(rDiagList);

          // let bParse = eval(compile(chmContenTpl));
          // printData.RecipeDetails = bParse(printData);

          // //体重 weight
          // printData.weight = printData.weight ? printData.weight : "";
          // //处方类型 diseaseRecipeType
          // printData.diseaseRecipeType = printData.diseaseRecipeType
          //   ? printData.diseaseRecipeType
          //   : "";
          // //社康中心  处方笺
          // printData.hosName = printData.hosName + "处方笺";
          // // 姓名截取前八位
          // printData.patientName = printData.patientName
          //   ? printData.patientName.substring(0, 8)
          //   : "";

          // // 体重 加 单位 KG
          // printData.weight = printData.weight ? printData.weight + "kg" : "";
          // // onPreview(data, "门诊处方(草药)");
          // print(null, chmLodopTpl, {}, printData, false);
        } else {
           westOrderItemPrintHandle(data, { printTpl: westLodopTpl, drugsTpl, diagnoseTplChm }, false);
        }
      }
    },
    // printWestFunc(data) {
    //   console.log(`data222`, data);
    //   // westLodopTpl
    //   let printData = data;

    //   let { diagList, part3, settlemetnType } = printData;
    //   let rDiagList = diagList[0].diagList;

    //   let aParse = eval(compile(drugsTpl));
    //   printData.RecipeDetails = aParse(printData);

    //   // let bParse = eval(compile(diagNameTpl));
    //   // printData.Diagnosis = bParse(rDiagList);

    //   //体重 weight
    //   printData.weight = printData.weight ? printData.weight : "";
    //   //处方类型 diseaseRecipeType
    //   printData.diseaseRecipeType = printData.diseaseRecipeType
    //     ? printData.diseaseRecipeType
    //     : "";
    //   //社康中心  处方笺
    //   printData.hosName = printData.hosName + "处方笺";

    //   // 姓名截取前八位
    //   printData.patientName = printData.patientName
    //     ? printData.patientName.substring(0, 8)
    //     : "";

    //   // 体重 加 单位 KG
    //   printData.weight = printData.weight ? printData.weight + "kg" : "";
    //   print(null, westLodopTpl, {}, printData, false);
    //   // onPreview(data, "门诊处方西成药11");
    // },

    //关闭打印设置弹窗
    closePrintSeterFuc(name) {
      this.printNameseterVisible = false;
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      let arr = tableData.filter((item) => {
        return item.name === "用药标签";
      });
      if(arr.length) {
       this.printLabel(this.printerName)
      }else{
        return
      }
    },

    //检测是否设置默认打印
    printLabelValied (){
      let printerName = "";
      // 选择标签打印机
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      let arr = tableData.filter((item) => {
        return item.name === "用药标签";
      });
      if(arr.length) {
        printerName = arr[0].printerName;
        this.printerName = arr[0].printerName;
        this.printLabel(printerName)
        return;
      }
      this.printNameseterVisible = true;
      this.requiredName = "用药标签";
    },

    async printLabel(printerName) {
      if (!this.recipeForm.id) {
        this.$message.warning("请选择处方");
        return;
      }
      if (this.recipeForm.orderType === "11") {
        this.$message.warning("不支持打印中草药标签贴");
        return;
      }
      this.$showLoading();
          //热敏打印
      await opha
        .printLabel(this.recipeForm.id)
        .then(res => {
          this.$hideLoading();
          this.checked = true;
          if (res.code === 1) {
            res.data.forEach(_ => {
              print(null, PrintLabel, {printerName},_ , this.checked);
            });
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });

      /*await opha
        .printLabel(this.recipeForm.id)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            onPreviewData(res.data, "莲塘社康门诊");
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });*/
    },
    //code transform
    async codeTransform(params) {
      let codeList = this.codeTransformList[params[0].code];
      if (codeList !== undefined && codeList[params[0].val] !== undefined) {
        return;
      } else {
        try {
          let res = await transformCode(params);
          if (!codeList) {
            this.codeTransformList[params[0].code] = {};
          }
          this.codeTransformList[params[0].code][params[0].val] =
            res.data[params[0].code] || undefined;
        } catch (e) {
          return;
        }
      }
    },
    exportExcel() {
      let excelData = {
        title: ["处方签", "", "", "", ""],
        where: ["处方号:" + this.recipeForm.recipeCode, "", "", "", ""],
        tHeader: ["药品名称", "规格", "单价", "数量"],
        filterVal: ["drugName", "spec", "price", "drugQuantity"],
        listDate: this.orderTable,
        fileName: "处方签",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  padding: 0 20px;

  .rightinput {
    padding-right: 20px;
    border-bottom: 1px solid $l-color-bgcolor-18;
  }

  .el-row {
    .disabled {
      background: $l-color-bgcolor-18;
    }
  }

  .cftitle {
    overflow: hidden;
    padding: 10px 0;
    border-bottom: 1px solid $l-color-bgcolor-11;

    .title {
      font-size: 20px;
      font-weight: bold;
      color: $l-color-fontcolor-3;
    }

    .label {
      color: $l-color-fontcolor-4;
      margin-right: 10px;
    }

    .pre {
      font-size: 16px;
      color: $l-color-fontcolor-3;
    }
  }
  .delivery-box {
    padding: 20px;
  }
  .bottominpt {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .filter-item {
    border-radius: 2px;
    border-color: $l-color-primary;
    color: $l-color-primary;
  }

  .top {
    padding: 10px;
  }

  .bottom {
    padding: 10px;
  }

  .base-info {
    color: $l-color-fontcolor-3;
    margin-bottom: 10px;
    overflow: hidden;

    & > div {
      float: left;
      width: 200px;
    }

    .label {
      min-width: 42px;
      display: inline-block;
      color: $l-color-fontcolor-4;
      margin-right: 10px;
    }
  }

  .address-box {
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid $l-color-bgcolor-11;

    & > div {
      width: 100%;
    }
  }
}

.no-wrap {
  .el-col {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
