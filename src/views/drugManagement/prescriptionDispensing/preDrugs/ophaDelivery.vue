<template>
  <el-card class="height100 position-relative stock">
    <el-form :model="recipeForm" class="main-form">
      <div class="cftitle no-wrap">
        <el-row style="padding: 5px 0">
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
            <span class="pre free-color" v-if="recipeForm.isFree === '1'" >
              (
              <span v-if="recipeForm.isFree" >免费处方</span>)
            </span>
          </el-col>
        </el-row>
        <el-row style="padding: 5px 0" :gutter="20">
          <el-col :span="6">
            <span class="label">患者姓名：</span>
            <span>{{ recipeForm.patientName }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">性别：</span>
            <span
              v-if="recipeForm.patientGender"
              :val="recipeForm.patientGender"
              code="GENDER_CODE"
              v-codeTransform
            ></span>
          </el-col>
          <el-col :span="6">
            <span class="label">年龄：</span>
            <span :title="recipeForm.patientAge">
              {{ recipeForm.patientAge }}
            </span>
          </el-col>
          <el-col :span="6">
            <span class="label">门诊号:</span>
            <span :title="recipeForm.visitCode">
              {{ recipeForm.visitCode }}
            </span>
          </el-col>
        </el-row>

        <el-row style="padding: 5px 0" :gutter="20">
          <el-col :span="6">
            <span class="label">开单科室：</span>
            <span :title="recipeForm.deptName">{{ recipeForm.deptName }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">总金额：</span>
            <span>{{ formatNum(recipeForm.prescriptionAmt, 2) }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">门诊诊断：</span>
            <span :title="recipeForm.clinicDiag">
              {{ recipeForm.clinicDiag }}
            </span>
          </el-col>
          <el-col :span="6">
            <span class="label">医嘱时间：</span>
            <span :title="recipeForm.orderTime">
              {{ recipeForm.orderTime }}
            </span>
          </el-col>
        </el-row>
        <el-row style="padding: 5px 0" :gutter="20">
          <el-col :span="6">
            <span class="label">联系方式：</span>
            <span :title="recipeForm.phoneNum">{{ recipeForm.phoneNum }}</span>
          </el-col>
          <el-col :span="18">
            <span class="label">地址：</span>
            <span :title="recipeForm.patientAddr">
              {{ recipeForm.patientAddr }}
            </span>
          </el-col>
        </el-row>
        <el-row
          style="padding: 5px 0"
          :gutter="20"
          v-if="recipeForm.orderType === '11'"
        >
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
            <span :val="recipeForm.useage" code="usage" v-codeTransform></span>
          </el-col>
          <el-col :span="6">
            <span class="label">制药方法：</span>
            <span
              :val="recipeForm.pharmaMethods"
              code="productionMethod"
              v-codeTransform
            ></span>
            <el-button
              class="filter-item float-right"
              type="primary"
              v-if="recipeForm.dispendingMethod == '1'"
              @click="dialogVisibleFun"
              >改为配送</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="table-box">
        <!-- 详细药品表格 -->
        <el-table
          :data="orderTable"
          v-if="isRouterAlive"
          border
          height="100%"
          style="width: 100%"
        >
          <el-table-column
            prop="drugName"
            label="药品名称"
            min-width="100"
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="spec"
            label="规格"
            min-width="150"
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="price"
            align="right"
            label="单价(元)"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ formatNum(scope.row.price, 4) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="originCode"
            :label="recipeForm.orderType === '10' ? '生产厂商' : '产地'"
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
            min-width="50"
          >
            <template slot-scope="scope">
              <span class="overflow-point">{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="drugQuantity"
            :label="recipeForm.orderType !== '11' ? '数量' : '总数量'"
            min-width="50"
          >
            <template slot-scope="scope">
              <span class="overflow-point">{{
                scope.row.displayQuantity
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="drugQuantity" v-else label="单剂用量" min-width="50">
            <template slot-scope="scope">
              <span class="overflow-point">{{ scope.row.displayQuantity }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="displayUnit"
            label="单位"
            min-width="60"
            show-overflow-tooltip
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
            min-width="150"
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
          <el-table-column prop="manageType " label="管理类型" min-width="100">
            <template slot-scope="scope">
              <span
                class="overflow-point"
                v-codeTransform
                :val="scope.row.manageType"
                code="DrugManaType"
              ></span>
            </template>
          </el-table-column>
          <el-table-column prop="basicType" label="是否基药" min-width="100">
            <template slot-scope="scope">
              <span
                class="overflow-point"
                v-codeTransform
                :val="scope.row.basicType"
                code="BasicDrugType"
              ></span>
            </template>
          </el-table-column>
          <el-table-column prop="controlLevel" label="报销类型" min-width="100">
            <template slot-scope="scope">
              <span
                class="overflow-point"
                v-codeTransform
                :val="scope.row.controlLevel"
                code="DrugReimbursementType"
              ></span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
              >
                补打
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom-info no-wrap">
        <el-row class="bottom-div" :gutter="6" style="padding: 0 5px">
          <el-col :span="4">
            <span class="label">开单医生：</span>
            <span :title="recipeForm.doctorUserName">
              {{ recipeForm.doctorUserName }}
            </span>
          </el-col>
          <el-col :span="4">
            <span class="label">收费人员：</span>
            <span :title="recipeForm.chargeUserName">
              {{ recipeForm.chargeUserName }}
            </span>
          </el-col>
          <el-col :span="4">
            <span class="label">配方人员：</span>
            <span :title="recipeForm.dispenseUserName">
              {{ recipeForm.dispenseUserName }}
            </span>
          </el-col>
          <el-col :span="4">
            <span class="label">发药人员：</span>
            <span :title="recipeForm.deliveryUserName">
              {{ recipeForm.deliveryUserName }}
            </span>
          </el-col>
          <el-col :span="4">
            <span class="label">该处方分配至：</span>
            <span
              columns="storage_name"
              :conditionMap="{ storage_code: recipeForm.billPharCode }"
              tableName="hrp_drgstrg"
              v-tableTransform
            ></span>
            <span
              columns="window_name"
              :conditionMap="{ window_code: recipeForm.preWindowCode }"
              tableName="hrp_phar_window"
              v-tableTransform
            ></span>
          </el-col>
          <el-col :span="3" :offset="1">
            <span class="label">配药状态：</span>
            <span v-if="recipeForm.dispenseState == '0'">未配药</span>
            <span v-if="recipeForm.dispenseState == '1'">已配药</span>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <div class="bottominpt">
      <el-row class="width100">
        <el-col :span="16" style="font-size: 0">
          <el-button
            class="filter-item"
            type="primary"
            plain
            @click="printRecipe"
            >处方打印</el-button
          >
          <!--           <el-button class="filter-item" type="primary" plain @click="printDescription">用药说明书打印</el-button>-->
          <el-button
            class="filter-item"
            type="primary"
            plain
            @click="printLabel"
            >打印标签贴</el-button
          >
          <el-checkbox v-model="checked">是否开启静默打印</el-checkbox>

          <el-button
            v-if="leftcont.isPause == '1'"
            @click="pause"
            class="filter-item"
            type="primary"
            plain
            >窗口启用</el-button
          >
          <el-button
            v-if="leftcont.isPause == '0'"
            @click="pause"
            class="filter-item"
            type="primary"
            plain
            >窗口暂停</el-button
          >
        </el-col>
        <el-col :span="8" style="text-align: right; font-size: 0">
          <el-button
            v-if="recipeForm.dispenseState !== '1'"
            class="filter-item"
            type="primary"
            @click="dispense"
            >确认配药</el-button
          >
          <el-button
            v-if="recipeForm.deliveryState !== '1'"
            @click="delivery"
            class="filter-item"
            type="primary"
            v-hotKey="{ func: 'func_submit' }"
            >确认发药</el-button
          >
          <!-- <el-button
            v-if="recipeForm.deliveryState !== '1'"
            @click="quit"
            class="filter-item"
            type="primary"
            plain
          >取消发药</el-button>-->
          <!-- <el-button
            v-if="recipeForm.deliveryState == '1'"
            @click="cancelDelivery"
            class="filter-item"
            type="primary"
            plain
          >撤销发药</el-button>-->
        </el-col>
      </el-row>
    </div>
    <l-dialog
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      title="配送地址"
      width="450px"
      @confirm="saveDelive"
      @cancel="dialogVisible = false"
    >
      <template slot="content">
        <div class="delivery-box">
          <el-radio-group
            v-model="deliveryForm.shipmentType"
            class="mgb8"
            @change="shipmentTypeFun"
          >
            <el-radio label="0">配送到家</el-radio>
            <el-radio label="1">配送到社康</el-radio>
          </el-radio-group>
          <el-form
            :model="deliveryForm"
            :rules="deliveryRules"
            ref="deliveryForm"
            class="demo-ruleForm"
          >
            <el-row :gutter="8" class="mgb8">
              <el-col :span="12">
                <el-form-item prop="recipients">
                  <l-formt-title required label="收货人姓名">
                    <el-input
                      v-model="deliveryForm.recipients"
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
                    :value.sync="deliveryForm.address"
                    @change="address"
                    remoteValueKey="id"
                    remoteShowKey="label"
                    :maxNum="3"
                    :multiple="false"
                    :relation="true"
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
                    placeholder="请输入"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </template>
    </l-dialog>
    <!-- 低储 弹窗 -->
    <l-dialog
      :visible.sync="drugVisible"
      title="发药药品低储提醒"
      width="1000px"
      :customBottom="true"
    >
      <template #content>
        <el-form
          v-if="drugVisible"
          label-position="top"
          inline
          class="padding20"
        >
          <el-table
            id="diag-table"
            ref="diagTable"
            :data="searchTable"
            border
            stripe
            width="100%"
            v-loading="d_isLoading"
            element-loading-text="列表正在加载中"
            height="300"
          >
            <el-table-column
              prop="cwTypeName"
              label="药品类型"
            ></el-table-column>
            <el-table-column
              prop="drugName"
              label="药品名称"
              width="213"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="spec"
              label="药品规格"
            ></el-table-column>
            <el-table-column
              prop="originName"
              label="药品厂家"
              width="213"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="formName"
              label="药品剂型"
            ></el-table-column>
            <el-table-column
              prop="drugUnitName"
              label="包装单位"
            ></el-table-column>
            <el-table-column
              label="药品售价"
              prop="price"
              width="120"
            ><template  slot-scope="scope">
              <span>{{ formatNum(scope.row.price) }}</span>
            </template>
            </el-table-column>
            <el-table-column
              label="低储值"
              prop="minStockDisplay"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="药品库存"
              prop="drugStockDisplay"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="生产厂商标识"
              prop="originIdentificationName"
              width="160"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="管理类型"
              prop="manageTypeName"
              width="120"
            ></el-table-column>
            <el-table-column
              label="基药类型"
              prop="basicType"
              width="120"
            ><template  slot-scope="scope">
                        <span
                          :val="scope.row.basicType"
                          code="BasicDrugType"
                          v-codeTransform
                        ></span>
            </template></el-table-column>
          </el-table>
        </el-form>
      </template>
      <span slot="footerContent">
        <template >
          <el-button class="footer-btn" type="primary" @click="exportExcel"
          >导出</el-button
          >
          <el-button class="footer-btn" type="primary" @click="drugVisible = false"
          >取消</el-button
          >
        </template>
      </span>
    </l-dialog>
  </el-card>
</template>

<script>
import {
  drugsTpl,
  diagNameTpl,
  diagnoseTplChm,
  chmContenTpl
} from "@/components/adviceCommon/printTpl/tpl.js";
import { compile, westOrderItemPrintHandle, chmOrderItemPrintHandle } from "@/components/adviceCommon/adviceUtils.js";
import { chmLodopTpl } from "@/printTemplete/module/chmLodopTpl.js";
import { westLodopTpl } from "@/printTemplete/module/westLodopTpl.js";
import { PrintLabel } from "@/printTemplete/module/printLabel.js";
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";
import {
  getPrescriptionAddress,
  addOrUpDocPrintTemplate
} from "@/api/cis/order/order";
import { preview, onPreview, onPreviewData } from "@/utils/print";
import { print } from "@/utils/print_new.js";
import {
  transformCode,
  transformCodeList
} from "@/api/directive/directiveRequest";
import formatNum from "@/utils/formatPrice.js";
import { outpatientOrderPrint } from "@/api/cis/report/cisPrints.js";
import { getPatientArchInfo } from "@/api/common/report";
// orderType 10西药,11草药,12中成药

export default {
  props: {
    // selectId: {
    //   type: String
    // },
    leftTextObj: {
      type: Object
    },
    leftText: {
      type: Object
    }
  },
  data() {
    return {
      ids:'',
      drugVisible:false,
      d_isLoading:false,
      searchTable:[],
      checked: true,
      maxHeight: "", // 计算表格最大高度
      searchType: "", // 查询条件类型
      leftcont: {}, //左侧传递信息
      dispenseUserId: "",
      windowCode: "",
      date: "",
      queryValue: "",
      dateShow: false,
      inputShow: true,
      icShow: true,
      deliveryState: "",
      pharWindowList: [],
      recipeForm: {
        billPharCode: "",
        preWindowCode: ""
      },
      btnType: "", // 按钮查询类型
      loading: false, //左侧申请列表滑动加载状态
      noMore: false, // 左侧申请列表没有更多数据
      recipeTable: [],
      orderTable: [],
      // 表格分页数据
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: 1
      },
      dialogVisible: false,
      deliveryFormInit: {},
      deliveryForm: {
        shipmentType: "0", //配送方式/类型
        recipients: "", //收货人姓名
        phoneNumber: "", //联系电话
        address: [], //联系地址
        detail: "", //详细地址
        recipeId: "", //处方号id
        provinceCode: "", //户籍省
        cityCode: "", //户籍市
        regionCode: "", //户籍区
        dataVersion: "",
        id: ""
      },
      deliveryFormOld: {},
      deliveryRules: {
        recipients: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        detail: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
      autoSendDrugStyle: false,
      isRouterAlive: true,
      //反显数据
      codeTransformList: {}
    };
  },
  watch: {
    leftText: {
      handler(val) {},
      deep: true
    },
    leftTextObj: {
      deep: true,
      handler(val) {
        console.log(this.leftTextObj, "你好左侧数据列表");
        this.deliveryForm.recipeId = this.leftTextObj.recipeId; //处方号
        this.deliveryForm.visitCode = this.leftTextObj.visitCode;
        this.patientInfo(this.leftTextObj.patientId);
      }
    }
  },
  created() {
    this.patientInfo(this.leftTextObj.patientId);
  },
  mounted() {
    this.searchType = "1";
    this.listForDropDown();
    // this.getDefaultAddressInit();
  },
  methods: {
    async exportExcel() {
      try {
        let param = {
          name:'',
          compareToStock:'min',
          ids:this.ids,
        };

        let res = await base
          .exportStockExcel(param);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName("stock")[0];
          var a = document.createElement('a');
          a.setAttribute("id","billHref");
          a.download = '低储报表.xls';
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
        }
      } catch (error) {}
    },
    loadTable(ids) {
      this.d_isLoading = true;
      let params = {
        //...this.searchData,
        ids:ids,
        pageNo: '1',
        pageSize: '20000',
        currDrugStorage:'1'
      };
      base
        .getStockMaxMINForPage(params)
        .then(res => {
          if (res.code === 1) {
            this.searchTable = res.data
          }
          this.d_isLoading = false;
        })
        .catch(err => {
          this.d_isLoading = false;
        });
    },
    // 改为配送地址
    dialogVisibleFun() {
      this.dialogVisible = true;
      this.patientInfo(this.leftTextObj.patientId);
    },
    shipmentTypeFun() {
      this.patientInfo(this.leftTextObj.patientId);
    },
    //点击左侧传值
    autoSendDrugFun() {
      this.autoSendDrugStyle = true;
      if (this.leftText && this.leftText.selectId) {
        console.log("左侧传值的", this.leftText);
        Object.assign(this.leftcont, this.leftText);
        this.findDetail();
      } else {
        this.recipeForm = this.$options.data().recipeForm;
        this.orderTable = this.$options.data().orderTable;
      }
    },

    // 2020-11-05  start
    // 返现配送地址
    //每次刷新处方列表都将表格最新的配送地址设为默认地址
    address(val) {
      this.deliveryForm.provinceCode = val[0];
      this.deliveryForm.cityCode = val[1];
      this.deliveryForm.regionCode = val[2];
    },
    async patientInfo(id) {
      if (id === undefined) {
        return;
      }
      try {
        let { code, data, msg } = await getPatientArchInfo({
          patientId: id
        });
        if (code === 1) {
          this.deliveryForm.address = [];
          this.deliveryForm.detail =
            data[0].patientEmpiInfoAddrssVO.currentDetail; //具体联系地址
          let address =
            data[0].patientEmpiInfoAddrssVO &&
            data[0].patientEmpiInfoAddrssVO.currentAddress.indexOf(",]") > -1
              ? JSON.parse(
                  data[0].patientEmpiInfoAddrssVO.currentAddress.split(
                    ",]"
                  )[0] + "]"
                )
              : Array.isArray(
                  JSON.parse(data[0].patientEmpiInfoAddrssVO.currentAddress)
                )
              ? JSON.parse(data[0].patientEmpiInfoAddrssVO.currentAddress)
              : [];
          let num = address.length < 3 ? address.length : 3;
          for (let i = 0; i < num; i++) {
            this.deliveryForm.address.push(Number(address[i]));
          }
          this.deliveryForm.provinceCode = this.deliveryForm.address[0];
          this.deliveryForm.cityCode = this.deliveryForm.address[1];
          this.deliveryForm.regionCode = this.deliveryForm.address[2];
          this.getDefaultAddressInit();
          console.log(this.deliveryForm.address);
        } else {
          this.$message.error(msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getDefaultAddressInit() {
      this.deliveryFormInit = {};
      let params = {
        visitCode: this.leftTextObj.visitCode,
        recipeId: this.leftTextObj.recipeId
      };
      try {
        let res = await getPrescriptionAddress(params);
        if (res.code == 1) {
          this.deliveryForm.recipients = this.recipeForm.patientName;
          this.deliveryForm.phoneNumber = this.recipeForm.phoneNum;
          let datas = res.data;
          console.log(datas, "打印地址信息");
          if (Object.keys(datas).length !== 0) {
            this.deliveryForm.recipeId = datas.recipeId;
            this.deliveryForm.visitCode = datas.visitCode;
            this.deliveryForm.id = datas.id;
            this.deliveryForm.dataVersion = datas.dataVersion;
            this.deliveryForm.recipients = datas.recipients;
            this.deliveryForm.phoneNumber = datas.phoneNumber;
            this.deliveryForm.address =
              datas.currentAddress && datas.currentAddress.indexOf(",]") > -1
                ? JSON.parse(datas.currentAddress.split(",]")[0] + "]")
                : Array.isArray(JSON.parse(datas.currentAddress))
                ? JSON.parse(datas.currentAddress)
                : [];
            this.deliveryForm.provinceCode = this.deliveryForm.address[0];
            this.deliveryForm.cityCode = this.deliveryForm.address[1];
            this.deliveryForm.regionCode = this.deliveryForm.address[2];
            this.deliveryForm.detail = datas.detail;
            this.deliveryForm.shipmentType = datas.shipmentType;
            this.deliveryForm.dispendingMethod = "2";
          } else {
            if (this.deliveryForm.shipmentType == "1") {
              this.deliveryForm = {
                ...this.deliveryForm,
                shipmentType: "1",
                recipients: "", //收货人姓名
                phoneNumber: "", //联系电话
                address: [], //联系地址
                detail: "", //详细地址
                provinceCode: "", //户籍省
                cityCode: "", //户籍市
                regionCode: "" //户籍区
              };
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    formatNum(num, decleng) {
      return formatNum(num, decleng);
    },
    async listForDropDown() {
      this.pharWindowList = await base.pharWindowForDropDown({});
    },
    async findDetail() {
      this.isRouterAlive = false;
      try {
        this.$showLoading();
        let response = await opha.get(this.leftText.selectId);
        let { data } = response;
        // 此种赋值方法不能引起vue 的渲染
        this.recipeForm = {
          ...data
        };
        data["recipeDVOList"].forEach(element => {
          element.orderType = data.orderType;
        });
        // 自动发药
        if (this.leftcont.autoSendDrug && this.autoSendDrugStyle) {
          this.delivery();
        }
        this.orderTable = [...data["recipeDVOList"]];
        this.$nextTick(() => (this.isRouterAlive = true));
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    // 撤销发药
    async cancelDelivery() {
      try {
        this.$showLoading();
        if (!this.recipeForm.id) {
          this.$message.warning("请选择处方");
          this.$hideLoading();
          return;
        }
        let { data } = await opha.cancelDelivery(this.recipeForm.id);
        this.$message.success(data);
        // this.findDetail();
        this.$emit("searchCB", new Date().getTime());
        // this.search(0);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    // 确认发药
    delivery() {
      this.autoSendDrugStyle = false;
      if (!this.recipeForm.id) {
        this.$message.warning("请选择处方");
        return;
      }
      if (!this.leftcont.windowCode) {
        this.$message.warning("请选择窗口");
        return;
      }
      if (this.recipeForm && this.recipeForm.dispenseState == "0") {
        if (!this.leftcont.dispenseUserId) {
          this.$message.warning("该患者暂未配药，请先选择配药人");
          return;
        }
      }

      let param = {
        deliveryWindowCode: this.leftcont.windowCode,
        dispenseUserName: this.leftcont.uname,
        dispenseUserId: this.leftcont.dispenseUserId
      };

      this.$showLoading();
      opha
        .delivery(this.recipeForm.id, param)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            if (res.data.warn && res.data.warn.length > 0) {
              this.drugVisible = true;
              let ids = res.data.warn.join(",")
              this.ids = res.data.warn.join(",")
              this.loadTable(ids)
              this.recipeForm = this.$options.data().recipeForm;
              this.orderTable = this.$options.data().orderTable;
              this.$emit("searchCB", "0");
            }else{
              this.$message.success(res.msg || "发药成功");
              this.$emit("searchCB", "0");
              // this.findDetail();
              this.recipeForm = this.$options.data().recipeForm;
              this.orderTable = this.$options.data().orderTable;
            }


          } else {
            this.$message.error(res.msg || "发药失败");
            this.recipeForm = this.$options.data().recipeForm;
            this.orderTable = this.$options.data().orderTable;
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "发药失败");
          this.recipeForm = this.$options.data().recipeForm;
          this.orderTable = this.$options.data().orderTable;
        });
    },
    async pause() {
      try {
        this.$showLoading();
        let response = await base.pharWindowchangeStatus({
          windowCode: this.leftcont.windowCode,
          isPause: this.leftcont.isPause == "1" ? "0" : "1"
        });
        if (this.leftcont.isPause == "1") {
          if (response.code == "1") {
            this.$message.success("窗口启用成功");
            this.leftcont.isPause = "0";
            this.$hideLoading();
          } else {
            this.$message.error("窗口启用失败");
          }
        }
        if (this.leftcont.isPause == "0") {
          if (response.code == "1") {
            this.$message.success("窗口暂停成功");
            this.leftcont.isPause = "1";
            this.$hideLoading();
          } else {
            this.$message.error("窗口暂停失败");
          }
        }
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
          // 单独函数处理
          // this.printWestFunc(data);
          // }
        }
      }
    },
    // printWestFunc (data){
    //       console.log(`data222`, JSON.stringify(data));
    //       // let dataList = data;

    //       // for (let index = 0; index < dataList.length; index++) {
    //       let printData = data;

    //       let { diagList, part3, settlemetnType } = printData;
    //       let rDiagList = diagList[0].diagList

    //       let cParse = eval(compile(drugsTpl));
    //       printData.RecipeDetails = cParse(printData);

    //       // let dParse = eval(compile(diagNameTpl));
    //       // printData.Diagnosis = dParse(rDiagList);

    //       //体重 weight
    //       printData.weight = printData.weight ? printData.weight : "";
    //       //处方类型 diseaseRecipeType
    //       printData.diseaseRecipeType = printData.diseaseRecipeType
    //         ? printData.diseaseRecipeType
    //         : "";
    //       //社康中心  处方笺
    //       printData.hosName = printData.hosName + "处方笺";

    //       // 姓名截取前八位
    //       printData.patientName = printData.patientName
    //         ? printData.patientName.substring(0, 8)
    //         : "";

    //       // 体重 加 单位 KG
    //       printData.weight = printData.weight ? printData.weight + "kg" : "";

    //       print(null, westLodopTpl, {}, printData, false);
    // },
    printDescription() {
      let data = {};
      data.title = "用药说明书";
      data.patientName = this.recipeForm.patientName;
      data.patientAge = this.recipeForm.patientAge;
      data.deptName = this.recipeForm.deptName;
      data.visitCode = this.recipeForm.visitCode;
      data.detailList = this.orderTable;
      onPreview(data, "处方签");
    },
    async printLabel() {
      if (this.recipeForm.orderType === "11") {
        this.$message.warning("不支持打印中草药标签贴");
        return;
      }

      if (!this.recipeForm.id) {
        this.$message.warning("请选择处方");
        return;
      }
      this.$showLoading();
      await opha
        .printLabel(this.recipeForm.id)
        .then(res => {
          this.$hideLoading();
          this.checked = true;
          if (res.code === 1) {
            console.log(`标签打印已通知打印机`, res);
            res.data.forEach(_ => {
              print(null, PrintLabel, {}, _, this.checked);
            });
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });
    },
    async handleClick(row) {
      if (this.recipeForm.orderType === "11") {
        this.$message.warning("不支持打印中草药标签贴");
        return;
      }

      if (!this.recipeForm.id) {
        this.$message.warning("请选择处方");
        return;
      }
      this.$showLoading();
      await opha
        .printLabel(this.recipeForm.id)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            console.log(`res`, res);
            res.data.forEach(_ => {
              if (_.drugName === row.drugName) {
                print(null, PrintLabel, {}, _, this.checked);
              }
            });
            return;
            onPreviewData(res.data, "莲塘社康门诊");
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });
    },
    // 取消发药
    quit() {
      this.$message.info("已取消发药");
      this.$emit("unlock");
    },
    // 确认配送地址
    saveDelive() {
      if (!this.recipeForm.id) {
        this.$message.warning("请选择处方");
        return;
      }
      console.log(this.deliveryForm, "确认配送地址");
      this.$refs.deliveryForm.validate(valid => {
        if (valid) {
          this.$showLoading();
          opha
            .addOrUpDocPrintTemplate(this.deliveryForm)
            .then(res => {
              this.$hideLoading();
              if (res.code === 1) {
                this.dialogVisible = false;
                this.$emit("searchCB");
                this.$message.success(res.msg || "保存配送地址成功!");
                this.getDefaultAddressInit();
                this.recipeForm = this.$options.data().recipeForm;
                this.orderTable = this.$options.data().orderTable;
              } else {
                this.$message.error(res.msg || "保存配送地址失败!");
              }
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存配送地址失败!");
            });
        }
      });
    },
    dispense() {
      if (this.recipeForm.dispenseState == "1") {
        this.$message.error("已完成配药，无需配药");
        return;
      }
      if (!this.recipeForm.id) {
        this.$message.error("请选择处方");
        return;
      }
      this.$showLoading();
      let param = {
        dispenseUserId: this.leftcont.dispenseUserId,
        dispenseUserName: this.leftcont.uname
      };
      opha
        .dispenseWithParam(this.recipeForm.id, param)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            this.$emit("searchCB");
            this.$message.success(res.msg || "配药成功!");
            this.findDetail();
          } else {
            this.$message.err(res.msg || "配药失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.err(err.msg || "配药失败!");
        });
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
    }
  }
};
</script>

<style lang="scss" scoped>
.main-form {
  height: calc(100% - 53px);
  display: flex;
  flex-direction: column;

  .table-box {
    flex: 1;
    overflow: hidden;
    padding: 10px;
  }

  .bottom-info {
    padding: 0 10px;
    margin-bottom: 10px;
  }
}

.el-card {
  position: relative;

  /deep/.el-table__empty-block{
    overflow-y: auto;
  }

  /deep/ .el-form-item {
    margin-bottom: 15px;
  }

  /deep/ .el-form-item--medium .el-form-item__label {
    line-height: 20px;
  }

  /deep/ .el-form-item__content {
    line-height: 20px;
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
      width: 240px;
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
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid $l-color-bgcolor-11;

    & > div {
      width: 100%;
    }
  }

  .titleinput {
    margin-bottom: 10px;
    border-bottom: 1px solid $l-color-bgcolor-11;

    .filter-item {
      border-color: $l-color-primary;
      color: $l-color-primary;
      float: left;
      margin-right: 10px;
      padding: 8px 20px;
      border-radius: 2px;
    }

    .filter-item:last-child {
      margin-right: 0px;
    }
  }

  .el-row {
    .disabled {
      background: $l-color-bgcolor-18;
    }
  }

  .bottom-div {
    background: $l-color-bgcolor-18;
    line-height: 60px;
  }

  .bottom-div {
    padding: 20px;
    height: 60px;

    .el-row {
      background: $l-color-bgcolor-18;
    }
  }

  .bottominpt {
    padding: 10px;
    border-top: 1px solid $l-color-bgcolor-11;
    display: flex;
    align-items: center;
  }
}

.no-wrap {
  .el-col {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.cftitle {
  padding: 10px 20px;
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
  .pre.free-color{
    color: #0000ff;
    font-size: 20px;
  }
}

.delivery-box {
  padding: 20px;
}

.mgb8 {
  margin-bottom: 8px;
}

.demo-ruleForm {
  .el-form-item {
    margin-bottom: 0;
  }
}

</style>
