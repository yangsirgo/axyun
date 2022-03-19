/* eslint-disable complexity */
<template>
  <el-card class="rightMedicalOrder overflow-hidden height100">
    <div
      class="position-relative overflow-hidden"
      style=" height: 70%"
    >
      <div class="height100">
        <div class="edit-btn-box">
          <el-button
            type="text"
            class="filter-item"
            @click="addRp"
            icon="iconfont iconxinzeng"
            v-hotKey="{ func: 'func_add1' }"
          >
            新增处方
          </el-button>

          <el-button
            type="text"
            class="filter-item"
            @click="submitForm"
            icon="iconfont iconzancun"
          >
            暂存
          </el-button>

          <el-button
            type="text"
            class="filter-item"
            @click="submitSave"
            icon="iconfont icontijiao1"
            v-hotKey="{ func: 'func_submit' }"
          >
            {{ $t("cis.btn.submit") }}
          </el-button>
          <b class="line"></b>
          <el-button
            @click="saveTemp"
            class="cursor-pointer"
            type="text"
            v-hotKey="{ func: 'func_save_temp' }"
          >
            <i class="iconfont iconfuzhidaochangqi"></i>
            保存模板
          </el-button>
          <el-button
            type="text"
            class="filter-item"
            @click="deleteHandler"
            icon="iconfont iconshanchu"
            v-hotKey="{ func: 'func_delete' }"
          >
            {{ $t("cis.btn.del") }}
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
          <el-button
            type="text"
            class="filter-item"
            icon="iconfont icondayin"
            @click="printChm"
            v-hotKey="{ func: 'func_print' }"
            :loading="batchLoading"
          >
            打印
          </el-button>

          <el-button type="text" class="filter-item" icon="iconfont iconlicichufang" @click="quote">
            历史处方
          </el-button>

          <input
            id="focusInput"
            type="text"
            style="position:absolute;clip:rect(0px,0px,0px,0px);"
          />
        </div>
        <div class="selectGroup">
          <el-form
            :inline="true"
            :model="selectGroup"
            :rules="topRules"
            ref="topForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label=""
              prop="dosageValue"
            >
              <l-formt-title
                label="剂型选择"
                :disabled="formDisabled"
                required
                style="width: 200px"
              >
                <l-value-domain
                  :disabled="formDisabled"
                  defaultFirst
                  code="ClassificationCodeOfChinese"
                  :value.sync="selectGroup.dosageValue"
                  remoteValueKey="code"
                  placeholder="请选择剂型选择"
                  @change="dosageValueChange"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
            <el-form-item
              label=""
              prop="takingRoom"
            >
              <l-formt-title
                label="取药药房"
                :disabled="formDisabled"
                required
                style="width: 200px; margin-left: 10px"
              >
                <el-select
                  @change="takingRoomChange"
                  v-model="selectGroup.takingRoom"
                  :disabled="formDisabled"
                  placeholder="请选择取药药房"
                >
                  <el-option
                    v-for="(item, index) in chmPharmacyObject.list"
                    :key="index"
                    :label="item.pharName"
                    :value="item.deptId"
                  >
                  </el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
            <el-form-item
              label=""
              prop="dispendingMethod"
            >
              <l-formt-title
                label="发药方式"
                style="width: 200px; margin-left: 10px"
                required
                :disabled="dispendingMethodDisabled()"
              >
                <l-value-domain
                  clearable
                  placeholder="请选择发药方式"
                  @change="dispendingMethodChange"
                  code="DISPENSINGMETHOD"
                  :value.sync="selectGroup.dispendingMethod"
                  remoteShowKey="name"
                  remoteValueKey="code"
                  :disabled="dispendingMethodDisabled()"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>

            <el-form-item
              label=""
              prop="contactAddress"
            >
              <l-formt-title
                label="联系地址"
                disabled
                style="min-width: 200px; margin-left: 10px"
                v-if="selectGroup.dispendingMethod == '2' && !dialogVisible"
              >
                <div style="padding:0 8px">
                  <span
                    code="AdministrativDivision"
                    :val="deliveryForm.address || []"
                    break="/"
                    v-codeTransform
                  ></span>
                  <span>{{ deliveryForm.detail }}</span>
                </div>
              </l-formt-title>
            </el-form-item>

            <el-button
              type="primary"
              v-if="editDeliveBtnShow()"
              @click="editDelive"
            >修改</el-button>

          </el-form>
        </div>
        <div class="position-absolute mainTableCls">
          <!-- <div class="title">
            <l-card-title class="margin-top-8 margin-bottom-8">
              <template slot="left">处方明细录入</template>
            </l-card-title>
          </div> -->
          <l-table
            :herMaskShow="herMaskShow"
            v-loading="chmDrugLoading"
            class="mainTableContent"
            ref="mainTable"
            :currentChuFangRow="currentChuFangRow"
            @loadChuFang="loadChuFang"
            :selectGroup="selectGroup"
            :dosageValue="selectGroup.dosageValue"
            :chmForms="chmForms()"
            :tdObjectArray="tableList"
          ></l-table>
          <!-- 遮罩 -->
          <!-- <div
            class="mainTableContent herMask"
            v-if="herMaskShow"
          ></div> -->
        </div>
      </div>
    </div>
    <div
      style="height: 30%"
      class="bottom clearfix"
    >
      <div
        style="width:210px"
        class="float-left height100"
      >
        <chmrp-list
          v-loading="queryLoading"
          ref="chmrpList"
          :rpList="tableData"
          @chmDetails="chmDetails"
          :beforeLeave="beforeLeave"
        ></chmrp-list>
      </div>
      <div
        style="width:calc(100% - 210px); position: relative"
        class="float-right height100"
      >
        <div class="displayDrugInfo">
          <!-- 2020/10/27 13:27  注释掉 start -->
          <!-- <span class="info-title">代煎费用：</span>
          <span class="info-value" id="herFryingAmount">{{
            tabsHeaderData.fryingFee | rounding
          }}</span>
          <span>元</span> -->
          <!-- 2020/10/27 13:27  注释掉 end -->
          <span class="info-title">单剂金额：</span>
          <span
            class="info-value"
            id="herRpSingleAmount"
          >{{
            tabsHeaderData.deceptionCountFee | roundingPrice
          }}</span>
          <span>元</span>
          <span class="info-title">处方总金额：</span>
          <span
            class="info-value"
            id="herTotalAmount"
          >{{
            tabsHeaderData.rpTotal | roundingAmt
          }}</span>
          <span>元</span>
        </div>
        <el-tabs
          class="height100 tabs"
          v-model="activeName"
        >
          <el-tab-pane
            label="处方概要录入"
            name="first"
          >
            <keep-alive>
              <chm-bottom-form
                v-if="activeName === 'first'"
                :currentChuFangRow="currentChuFangRow"
                ref="chmBottomForm"
                @saveChmTable="saveChmTable(arguments)"
                :advicePO="advicePO"
              ></chm-bottom-form>
            </keep-alive>
          </el-tab-pane>
          <!-- <el-tab-pane label="药品模板" style="padding-bottom: 16px;" name="second">
            <save-tpl v-if="activeName === 'second'" :currentChuFangRow="currentChuFangRow"  hosType="3"></save-tpl>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <el-dialog
      title="历史医嘱"
      :visible.sync="copyOrderVisible"
      class="copyOrderCls"
    >
      <copy-order
        v-if="copyOrderVisible"
        adviceType="中草药"
        v-loading="copyLoading"
        @copy="copyOrderCallback"
        style="height: 60vh;"
      ></copy-order>
    </el-dialog>

    <l-dialog
      :visible.sync="dialogVisible"
      title="配送地址"
      width="450px"
      @confirm="saveDelive"
      @cancel="cancelDelive"
    >
      <template slot="content">
        <deliveryDia
          :deliveryFormProp="deliveryFormProp"
          :receivePatientData="receivePatientDataInit"
          ref="deliveryDia"
        ></deliveryDia>
      </template>
    </l-dialog>

    <!-- 保存模板弹窗 -->
    <el-dialog
      title="保存模板"
      :visible.sync="saveTempStyle"
      width="30%"
      :before-close="tempStyleHandleClose"
      :close-on-click-modal=false
    >
      <div>
        <dialogSavetemp
          ref="dialogSavetemp"
          saveType="chm"
          :saveTplSuccesBack="tempStyleHandleClose"
          :multipleSelection="multipleSelection"
          :recipeId="recipeId"
          v-if='saveTempStyle'
        ></dialogSavetemp>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="tempStyleHandleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="tempStyleHandleSave"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 保存模板弹窗 -->
  </el-card>
</template>

<script>
import { drugsTpl, diagNameTpl, chmContenTpl, diagnoseTplChm, hWContentTpl } from "@/components/adviceCommon/printTpl/tpl.js";
import chmBottomForm from "./components/chmRecipeForm.vue";
import deliveryDia from "@/views/cis/prescriptionRecor/newPatientsManage/order/chinaMedicinalHerb/components/deliveryDia.vue";
import {
  singleTdNum,
  totalTdNum,
  dropColumn,
  chmFormKey,
  newStatus,
  zancunStatus
} from "./components/variable.js";
  import filters from "@/components/adviceCommon/adviceFilters.js";
import saveTpl from "@/views/homeSickbeds/hsDiagTreat/order/module/saveTemplate.vue";
import {
  temporary,
  getAdviceItem,
  getAdvice,
  getChmAdvice
} from "@/api/cis/resident/residentAdvice";
import {
  getPharmacyObjectFunc,
    compile,
    getPrintTplFunc,
  compileToHtml,
  chmOrderItemPrintHandleCis,
  setComponentFocusFunc
} from "@/components/adviceCommon/adviceUtils.js";
import { getAdviceItemList } from "@/api/systemManagement/dataMaintain/adviceItem";
import { mapActions, mapGetters } from "vuex";
import { getDataIdDom } from "@/utils/util.js";
import lTable from "./components/cmTable.vue";
import {
  temporaryAdvice,
  submitApply,
  hOrderPrint,
  getChmMessage
} from "@/api/cis/resident/chm";
import { deepClone } from "@/utils/index.js";
import {
  getOrder,
  getPageItemList,
  submitOrders,
  bunching,
  unbunching,
  saveOrdersMould,
  getRecipeCode,
  saveHerbalOrder,
  getRecipeNo,
  submitHerbalOrder,
  getPrescriptionAddress,
  delPrescriptionAddress,
  addOrUpDocPrintTemplate
} from "@/api/cis/order/order";

import {
  herbalPage,
  herbalRecipeCreate,
  herbalItemPage,
  delHerbalOrder,
  herbalRecipeSubmit
} from "@/api/homeSickbeds/hsDiagTreat/hsChmRecipe.js";

import copyOrder from "./components/modules/index.vue";
import { getDiaByClinicType } from "@/api/cis/visit/visit";
import { getArrayList } from "@/api/wconf/wparam";
import { preview, onPreview } from "@/utils/print";
import {
  frequencyCodeToText,
  useWayCodeToText,
  getTextFromCodeFunc,
  sexCodeToText
} from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/orderUtils.js";
import {
  validQuoteHerbalChnDrug,
  convertFieldToSubmit,
  getQtyByUnitFlag,
  getChmUnitFlag,
  convertFieldFromGetList,
  isGreaterThanOne,
  getWholeChmDataStructure,
  getNearNumber,
  getPushNo,
  getDiagnose,
  drugsPushNo,
  computeAmtHandler,
  isCurrentRowChange,
  alertFunc,
  isEmpty,
  getKuaiDiRow,
  organizeData
} from "./components/utils";
import { outpatientOrderPrint } from "@/api/cis/report/cisPrints.js";
import chmrpList from "./components/chmRpList.vue";
import dialogSavetemp from "@/views/homeSickbeds/hsDiagTreat/order/module/saveTpl/dialogSavetemp.vue";
import { print } from "@/utils/print_new.js";
  import codes from "@/printTemplete/code.js";
import { hChmLodopTpl,chmLodopTpl } from "@/printTemplete/module/chmLodopTpl.js";



  const DisMtdDef = "2";// 默认 取药方式 为第三方配送


export default {
  name: "chmMedicine",
  props: {
    moduleType: String,
    default: "cis"
  },
  filters: {
    ...filters
  },
  data() {
    return {
      printTpl: "", // 获取的打印模板
      recipeId:"",
      multipleSelection: [],
      saveTempStyle: false,
      //配送
      dialogVisible: false,
      deliveryForm: {},
      //配送地址默认值
      deliveryFormDefault: {},
      //向弹框传值数据
      deliveryFormProp: {},
      //配送地址档案基本信息
      receivePatientDataInit: {},
      batchLoading: false,
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
      cloneAllTableData: [],
      // 2020/10/13
      dispensingModeObj: {},
      dispensingModeStyle: false,
      // 2020/10/13
      topRules: {
        dosageValue: [
          {
            required: true,
            message: "请选择剂型选择",
            trigger: ["blur"]
          }
        ],
        takingRoom: [
          {
            required: true,
            message: "请选择取药药房",
            trigger: "blur"
          }
        ],
        dispensingMode: [
          {
            required: true,
            message: "请选择发药方式",
            trigger: "blur"
          }
        ],
        dispendingMethod: [
          {
            required: true,
            message: "请选择发药方式",
            trigger: "blur"
          }
        ]
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
      activeName: "first",
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
    dialogSavetemp,
    saveTpl,
    lTable,
    chmrpList,
    copyOrder,
    deliveryDia
  },
  methods: {
    ...mapActions({
      // setMultipleSelections: "cis/setMultipleSelections",
      changeChmPharmacyObject: "adviceCommon/changeChmPharmacyObject",
      changeChmCurrentRow: "homeSickbeds/changeChmCurrentRow"
    }),
    // zhangbaoheng  2020/10/27 14:38 添加 保存模板功能
    saveTemp() {
      let data = this.tableData;
      if (isGreaterThanOne(data)) {
        this.$message.warning("您还有一条处方未编辑完成，请先完成编辑。");
        return;
      }
      let { status } = this.currentChuFangRow;
      if (Object.keys(this.currentChuFangRow).length == 0) {
        this.$message.warning("请选择一条需要保存模板的处方！");
        return;
      }

      // if (status != "1") {
      //   this.$message.warning("只有暂存的处方可以保存模板");
      //   return;
      // }
      this.saveTempStyle = true;
    },
    // useWayChange(value, item) {
    //   this.$set(this.currentChuFangRow, "freqTimes", item.frequencyTimes);
    //   this.$set(this.currentChuFangRow, "freqName", item.frequencyName);
    //   this.$set(this.currentChuFangRow, "freqId", item.id);
    // },
    // 保存
    // eslint-disable-next-line complexity
    async tempStyleHandleSave() {
      try {
        this.$refs.dialogSavetemp.saveTpl();
      } catch (error) {}
    },
    // 取消
    tempStyleHandleClose() {
      this.saveTempStyle = false;
    },
    setHerMaskShow() {
      if (
        this.currentChuFangRow.status == "2" ||
        this.currentChuFangRow.status == "4"
      ) {
        this.herMaskShow = true;
      } else {
        this.herMaskShow = false;
      }
    },
    //zhengyawen在进行暂存提交删除功能之前校验一下处方列表里是否有新处方未保存，更新之后将重新刷新处方列表，是否继续
    async isNewCF() {
      let isNew = false;
      let flag = true;
      let data = this.tableData;
      for (let i in data) {
        if (
          data[i].status === "" &&
          data[i].recipeCode !== this.currentChuFangRow.recipeCode
        ) {
          isNew = true;
          break;
        }
      }
      if (isNew === true) {
        await this.$confirm(
          "处方列表里存在新增未保存的处方,更新之后将重新刷新处方列表, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            flag = true;
          })
          .catch(async () => {
            flag = false;
          });
      }
      return flag;
    },
    //发药方式只读
    dispendingMethodDisabled() {
      // console.log("currentChuFangRow.status", this.currentChuFangRow.status);
      //提交 3
      //暂存 1
      //
      //新增 0
      if (this.currentChuFangRow.status == "0") return false;
      if (this.currentChuFangRow.status == "1") return false;
      if (typeof this.currentChuFangRow.status == "undefined") return true;
      if (this.currentChuFangRow.status == "3") return true;
      return true;
    },
    //修改按钮的显示情况
    editDeliveBtnShow (){
      //console.log("this.currentChuFangRow::::::", this.currentChuFangRow);
      let isKuaiDi = this.selectGroup.dispendingMethod =='2';
      //提交 3
      //暂存 1
      //
      //新增 0
      if (this.currentChuFangRow.status == "0" && isKuaiDi) return true;
      if (this.currentChuFangRow.status == "1" && isKuaiDi) return true;
      // if (typeof this.currentChuFangRow.status == "undefined" && isKuaiDi) return true;
      if (this.currentChuFangRow.status == "3" && isKuaiDi) return true;
      return false;
    },
    //修改配送地址
    dispendingEditDisabled() {
      //收费、退费不可修改
      //暂存 提交 可以修改
      //提交 3
      //暂存 1
      //
      //新增 0
      if (this.currentChuFangRow.status == "0") return false;
      if (this.currentChuFangRow.status == "1") return false;
      if (typeof this.currentChuFangRow.status == "undefined") return true;
      if (this.currentChuFangRow.status == "3") return false;
      return true;
    },
    chmForms() {
      if (this.$refs.chmBottomForm) {
        return this.$refs.chmBottomForm.chmForm;
      }
      return {};
    },
    dispendingMethodChange(val) {
      if (val == "2") {
        // if (
        //   (this.currentChuFangRow &&
        //     this.currentChuFangRow.status === "" &&
        //     this.currentChuFangRow.row_id) ||
        //   this.deliveryForm.shipmentType === "" ||
        //   this.deliveryForm.shipmentType === undefined
        // ) {
        //   //新增处方或者原来是自取状态的处方的地址无默认值，默认选择配送到家，并获取档案
        //   if (this.deliveryFormInit.dispendingMethod != "2") {
        //     this.deliveryForm.shipmentType = "0";
        //     this.shipmentTypeChange("0");
        //   } else {
        //     this.deliveryFormProp = deepClone(this.deliveryFormInit);
        //     this.dialogVisible = true;
        //     return;
        //   }
        // }

        //console.log("打开时 deliveryForm", this.deliveryForm);

        this.deliveryFormProp = deepClone(this.deliveryForm);
        this.dialogVisible = true;
      }
      //配送地址赋值
      if (Object.keys(this.currentChuFangRow).length != 0) {
        this.currentChuFangRow.dispendingMethod = this.selectGroup.dispendingMethod;
      }
    },
    //配送地址方式改变你
    // shipmentTypeChange(val) {
    //   if (val == "0") {
    //     //获取患者档案信息并填充
    //     let datas = {
    //       ...this.deliveryForm,
    //       recipients: this.receivePatientDataInit.patientName,
    //       phoneNumber: this.receivePatientDataInit.phoneNum,
    //       address: this.receivePatientDataInit.addrCode || [],
    //       detail: this.receivePatientDataInit.address || ""
    //     };
    //     this.deliveryForm = datas;
    //   } else if (val == "1") {
    //     //清空配送地址信息
    //     this.resetAddress({});
    //   }
    // },

    //清空配送地址信息
    resetAddress(data = {}) {
      // console.log("重置 resetAddress");
      // console.log("deliveryFormDefault", this.deliveryFormDefault, Object.keys(this.deliveryFormDefault).length > 0);
      if (Object.keys(this.deliveryFormDefault).length > 0) {
        // console.log("");
        this.deliveryForm = {
          // ...this.deliveryForm,
          ...this.deliveryFormDefault
        };
        // delete this.deliveryForm.id;
      } else {
        // this.deliveryForm = {
        //   ...this.deliveryForm,
        //   recipients: "",
        //   phoneNumber: "",
        //   address: [],
        //   detail: "",
        //   ...data
        // };
        // let dangAnAddress = this.getPatientDangAnAddress();
        // console.log("dangAnAddress:::::::", dangAnAddress);
        this.deliveryForm = {
          ...this.deliveryForm,
          ...{
            shipmentType: "0",
            recipients: this.receivePatientDataInit.patientName,
            phoneNumber: this.receivePatientDataInit.phoneNum,
            address: this.receivePatientDataInit.addrCode || [],
            detail: this.PublicHealthPatientAddress.currentDetail || ""
          }
        };
      }

      // console.log("初始化deliveryFormDefault", this.deliveryFormDefault);
      // console.log("初始化deliveryForm", this.deliveryForm);
    },
    getPatientDangAnAddress (){
      let { mobileNum, patientName, addrCode, detail, address } = this.receivePatientData;
//       0:157011
// 1:157050
// 2:157055
      addrCode = addrCode.map(item => Number(item));

      this.receivePatientDataInit = {
        ...this.deliveryForm,
        phoneNum: mobileNum,
        patientName,
        shipmentType: "0",
        // address: addrCode,//取前三位地址
        addrCode: addrCode.slice(0,3),//取前三位地址
        // address: [157011, 157050, 157055],
        address
      };

      // return this.receivePatientDataInit;
      // return deepClone(this.receivePatientData)
    },
    //确认配送
    saveDelive() {
      let deliveryDia = this.$refs.deliveryDia;
      //暂存 1 提交  3
      // 确定直接修改 地址
      if (
        this.currentChuFangRow.status == "0" || this.currentChuFangRow.status == "1"
      ) {
        //新增状态 暂存状态 保存配送地址
        deliveryDia &&
          deliveryDia.$refs.deliveryForm.validate(valid => {
            if (valid) {
              let form = deliveryDia ? deliveryDia.deliveryForm : {};
              this.deliveryForm = deepClone(form);
              deliveryDia.$refs.deliveryForm.resetFields();
              this.dialogVisible = false;
            }
          });
      } else if (this.currentChuFangRow.status == "3") {
        // console.log("暂存提交了");
        //提交状态 调用修改地址接口
        deliveryDia &&
          deliveryDia.$refs.deliveryForm.validate(async valid => {
            if (valid) {
              let form = deliveryDia ? deliveryDia.deliveryForm : {};
              this.deliveryForm = deepClone(form);
              try {
                let result = await this.saveDeliveFunc();
                this.deliveryForm.id = result.id;
                this.deliveryForm.dataVersion = result.dataVersion;
                // console.log("确定存储配送地址", this.deliveryForm);
                deliveryDia.$refs.deliveryForm.resetFields();
                this.dialogVisible = false;
              } catch (error) {
                // this.dialogVisible = false;
              }
            }
          });
      }
    },
    //删除地址
    async delPrescriptionAddress (id = "-1"){
      return new Promise(async (resolve, reject)=>{
        try {
          if (id === "-1") {
            resolve(true);
            return;
          }
          let res = await delPrescriptionAddress(id);
          if (res.code == "1") {
            // this.$message.success("配送地址保存成功");
            // this.dialogVisible = false;
            // this.resetAddress();
            resolve(res.data);
            //保存成功
          } else {
            this.$message.error(res.msg || "配送地址删除失败");
            reject(false);
          }
        } catch (e) {
          this.$message.error(e.msg || "配送地址删除失败");
          reject(false);
        }
      });
    },
    async saveDeliveFunc(recipeId = "-1") {
      if (recipeId == "-1") {
        recipeId = this.currentChuFangRow.id
      }



      let params = this.handleDeliveData(recipeId);
      return new Promise(async (resolve, reject)=>{
        try {
          // 没有地址 入参 不发送请求
          if (Object.keys(this.deliveryForm).length == 0) {
            resolve();
            return;
          }
          let res = await addOrUpDocPrintTemplate(params);
          if (res.code == "1") {
            this.$message.success("配送地址保存成功");
            this.dialogVisible = false;
            resolve(res.data);
            //保存成功
          } else {
            this.$message.error(res.msg || "配送地址保存失败");
            reject(false);
          }
        } catch (e) {
          this.$message.error(e.msg || "配送地址保存失败");
          reject(false);
        }
      });
    },
    //取消配送
    cancelDelive() {
      let deliveryDia = this.$refs.deliveryDia;
      //如果地址弹框为空数据，配送方式也改为自取
      let valiedDeliveryForm = this.valiedDeliveryForm(this.deliveryForm);
      if (!valiedDeliveryForm) {
        // this.selectGroup.dispendingMethod = "1";
        this.selectGroup.dispendingMethod = DisMtdDef;
      }
      this.deliveryFormProp = deepClone(this.deliveryForm);

      deliveryDia.$refs.deliveryForm.resetFields();
      this.dialogVisible = false;
    },
    //校验配送地址表单
    valiedDeliveryForm(form) {
      if (
        !form ||
        form.shipmentType === "" ||
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
    handleDeliveData(recipeId) {
      let curRow = this.currentChuFangRow;
      let data = {
        ...this.deliveryForm,
        ...{
          recipeId,
          visitCode: this.receivePatientData.treatNo
        }
      };
     //console.log("处理过后的 this.deliveryForm", this.deliveryForm, this.deliveryForm.id);
      if (Array.isArray(data.address)) {
        data.provinceCode = data.address[0];
        data.cityCode = data.address[1];
        data.regionCode = data.address[2] || "";
      }
      this.$delete(data, "address");
      // debugger
      // this.$delete(data, "id");
      return data;
    },
    //编辑处方配送地址
    editDelive() {
      // console.log("点击修改配送地址", this.deliveryForm);
      this.deliveryFormProp = deepClone(this.deliveryForm);
      this.dialogVisible = true;
    },
    //选择处方之后请求配送方式以及地址信息
    async getPrescriptionAddress(recipeId) {
      return new Promise(async (resolve,reject) =>{
        let params = {
          visitCode: this.receivePatientData.treatNo,
          recipeId
        };
        try {
          let res = await getPrescriptionAddress(params);
          if (res.code == 1) {
            //配送地址信息赋值
            let datas = res.data;
            // debugger
            if (!datas.hasOwnProperty("recipients")) {
              // this.$message.error("配送地址为空");
              this.deliveryForm = {};
              return;
            }
            // this.resetAddress({
            //   shipmentType: ""
            // });
            datas.address = Array.isArray(datas.currentAddress)
              ? datas.currentAddress
              : [];
            this.deliveryForm = {
              ...datas,
              recipients: datas.recipients,
              phoneNumber: datas.phoneNumber,
              address: Array.isArray(JSON.parse(datas.currentAddress))
                ? JSON.parse(datas.currentAddress)
                : [],
              detail: datas.detail,
              shipmentType: datas.shipmentType
            };
            // console.log("查询配送地址", this.deliveryForm);
            // console.log("this.deliveryForm", this.deliveryForm);
            resolve(this.deliveryForm);
          } else {
            this.$message.error(res.msg || "配送地址为空");
            reject(false);
          }
        } catch (e) {
          // console.log(e);
          reject(false);
          // this.deliveryForm = {};
        }
      });
    },
    //暂存
    async submitForm() {

      if (this.$refs.chmBottomForm) {
        try {
          await this.$refs.chmBottomForm.submitForm();
        } catch (error) {
          return;
        }
      }
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
    // computerAmt() {
    //   // 派发出来用药剂数
    //   this.$nextTick(() => {
    //     this.computeAmtFuncHandler();
    //   });
    // },
    //pharmacyDosage 用药剂数
    //drugs 药品列表
    computeAmtFuncHandler(drugs = [], pharmacyDosage = 0) {
      let { singleTotal, allTotal } = computeAmtHandler(drugs, pharmacyDosage);
      this.tabsHeaderData.deceptionCountFee = singleTotal;
      this.tabsHeaderData.rpTotal = allTotal;
    },
    //计算金额
    // computeAmtFunc() {},
    async validateComon(data) {
      for (let i in data) {
        if (data[i].classCode != this.selectGroup.dosageValue) {
          return false;
        }
      }
      return true;
    },
    async quoteCallBackFunc(c){
        let { id } = c;
        // 引用成功后 需要调取修改地址接口
               //保存 地址信息 新增的时候
        if (this.selectGroup.dispendingMethod == "2"
        &&
        (this.currentChuFangRow.status == "0" || this.currentChuFangRow.status == "1")) {
          try {
            this.chmDrugLoading = true;
            await this.saveDeliveFunc(id);
          } catch (error) {
            this.chmDrugLoading = false;
            return;
          }
        }



        try {
          await this.queryChuFang();
        } catch (error) {
          return;
        }
        // console.log(id,"id");

        //查找相关项
        let filteredRow = this.tableData.find((item)=>{
          return item.id === id;
        })

        let filteredIndex = this.tableData.findIndex((item)=>{
          return item.id === id;
        })

        //聚焦到相应的列
        this.chmDetails(filteredRow);
        this.$nextTick(()=>{
          // 设置高亮
          this.setCurrentRow(filteredIndex);
          this.setTableScollBottom();
          //聚焦form 表单
          this.$refs.chmBottomForm.focusOnceDosageInput();
        });
    },
    async copyOrderCallback(copyData) {
      this.copyOrderVisible = false;
      await this.quoteCallBackFunc(copyData);

    },
    loadChuFang() {
      this.initChmTable();
      this.queryChuFang();
      this.$nextTick(() => {
        document.querySelector("#focusInput").focus(); //让table 失去焦点
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

      let formData = data[0];
      let callBack = data[1];
      let errorBack = data[2];

      //暂存之前检查一下是否有新处方未保存
      // let isNewCFs = await this.isNewCF();
      // if (!isNewCFs) {
      //   errorBack && errorBack();
      //   return;
      // }

      // try {
      //   await this.validateTopRules();
      // } catch (e) {
      //   this.$refs.chmBottomForm.saveBtnLoading = false;
      //   return;
      // }

      let isSubmit = await this.isChildItdSubmit();
      if (!isSubmit) {
        return;
      }

      let submitData = deepClone(this.currentChuFangRow);
      //药房的数据
      submitData.pharmacyId = this.selectGroup.takingRoom;
      //药剂类型
      submitData.drugClassCode = this.selectGroup.dosageValue;
      submitData.amt = this.tabsHeaderData.rpTotal;
      submitData.price = this.tabsHeaderData.deceptionCountFee;
      submitData.dispendingMethod = this.selectGroup.dispendingMethod;

      submitData.drugs = submitData.drugs.filter(item => {
        return typeof item.itemId != "undefined";
      });
      if (submitData.drugs.length === 0) {
        this.$message.warning("请填写药品！");
        errorBack && errorBack();
        return;
      }

      console.log("this.deliveryForm::::", this.deliveryForm);

      // 校验配送地址
      if(Object.keys(this.deliveryForm).length == 0 && this.selectGroup.dispendingMethod == "2") {
        this.$message.error("请填写配送地址!");
        errorBack && errorBack();
        return;
      }

      if (this.chmDrugLoading) return;

      this.chmDrugLoading = true;
      herbalRecipeCreate(submitData)
        // eslint-disable-next-line complexity
        .then(async res => {
          if (res.code === 1) {
            this.$message.success("处方保存成功");
            // this.initChmTable();

            //保存 地址信息 新增的时候
            if (this.selectGroup.dispendingMethod == "2"
            &&
            (this.currentChuFangRow.status == "0" || this.currentChuFangRow.status == "1")) {
              try {
                let { id } = res.data;
                let result = await this.saveDeliveFunc(id);
              } catch (error) {
                this.chmDrugLoading = false;
                errorBack && errorBack();
                return;
              }
            } else {
              // 删除地址接口
              try {
                let { id } = this.deliveryForm;
                // console.log("送货地址id", id);
                let result = await this.delPrescriptionAddress(id);
              } catch (error) {
                this.chmDrugLoading = false;
                errorBack && errorBack();
                return;
              }
            }


            callBack && callBack(res.data);


            this.queryChuFang();
            this.initChmTable();
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
      // console.log("this.tableData", this.tableData);
      let list = this.tableData;
      let number = 0;
      for (var i = 0; i < list.length; i++) {
        // console.log("list[i].row_id", list[i].row_id);
        if (list[i].row_id) {
          number++;
        }
      }
      if (number >= 1) {
        return true;
      }
      return false;
    },

   async addRp(insertData =[]) {
      let data = this.tableData;
      if (isGreaterThanOne(data)) {
        this.$message.warning("您还有一条处方未编辑完成，请先完成编辑。");
        return;
      }
      let treatId = this.receivePatientData["id"];
      if (!treatId) {
        this.$message.warning("请选择患者！");
        return;
      }

      //防止点击两次 生成两条处方列表
      if (this.chmDrugLoading) {
        return;
      }

      this.chmDrugLoading = true;
      try {
        let result = await getDiagnose({
          inpCode: this.receivePatientData.treatNo,
          // diagType: 3,
          cwFlag: 2
        });
      } catch (error) {
        this.chmDrugLoading = false;
        return;
      }

      let { wrapperObject } = this.addNewRpRowFunc(insertData);
      this.chmDetails(wrapperObject);
      this.addRpDomCallBack();
      this.chmDrugLoading = false;
    },
    // 处方列表中有第三方配送， 新增处方默认是第三方配送
    // setSendDrug (){
      // if (Object.keys(this.deliveryFormDefault).length > 0) {

      // }
    // },
    addRpDomCallBack() {
      //清空 配送 dataVersion 和 id
      this.resetAddress();
      // console.log("addRp清空配送地址", this.deliveryForm);
      //焦点定位到医嘱名称
      this.$nextTick(() => {
        this.setCurrentRow();
        this.setTableScollBottom();
        this.$refs["chmBottomForm"].reset();
        this.herMaskShow = false;
        setComponentFocusFunc("mainTableTdCls0");

        // this.selectGroup.dispendingMethod = this.deliveryFormInit.dispendingMethod;
        // this.selectGroup.dispendingMethod = "1";
        //console.log(this.deliveryFormDefault);
        // 处方列表中有第三方配送，需要默认选中配送
        if (Object.keys(this.deliveryFormDefault).length > 0) {
          this.selectGroup.dispendingMethod = "2";
        } else {
          // this.selectGroup.dispendingMethod = "1";
          this.selectGroup.dispendingMethod = DisMtdDef;// 默认是第三方配送
        }

        // this.deliveryForm = {
        //   ...this.deliveryForm,
        //   ...this.deliveryFormInit
        // };
        // delete this.deliveryForm.dispendingMethod;
      });
    },
    setCurrentRow(length = this.tableData.length - 1) {
      this.$refs.chmrpList.setHighLight(length);
    },
    setTableScollBottom() {
      this.$nextTick(() => {
        this.$refs.chmrpList.scrollBottom();
      });
    },
    addNewRpRowFunc(list = []) {
      let data = this.tableData;
      let drugsList = list.length > 0 ? list : this.creatEmptyList();
      let wrapperObject = getWholeChmDataStructure("", 0, drugsList, { dispendingMethod: DisMtdDef });
      wrapperObject.treatId = this.receivePatientData.id;
      //药房的数据 默认
      wrapperObject.pharmacyId = this.selectGroup.takingRoom;
      //药剂类型 默认
      wrapperObject.drugClassCode = this.selectGroup.dosageValue;

      this.tableData.push(wrapperObject);
      this.currentIndex = this.tableData.length - 1;
      return {
        wrapperObject
      };
    },
    creatEmptyList() {
      let list = [];
      for (let i = 0; i < singleTdNum; i++) {
        list.push({
          treatId: this.receivePatientData.id,
          status: 0,
          type: 2 // 默认临时
        });
      }
      // console.log(list);
      return list;
    },
    // eslint-disable-next-line complexity
    // async add(chmTempQuoteData, fn) {
    //   // 20200619 待编辑状态的处方最多只能有一条，不能同时编辑多条处方
    //   if (this.isGreaterThanOne()) {
    //     this.$message.warning("您还有一条处方未编辑完成，请先完成编辑。");
    //     return;
    //   }
    //   let visitCode =
    //     typeof this.receivePatientData["visitCode"] !== "undefined"
    //       ? this.receivePatientData["visitCode"]
    //       : ""; //获取患者就诊ID
    //   if (visitCode === "") {
    //     this.$message.warning("请选择患者！");
    //     // eslint-disable-next-line consistent-return
    //     return false;
    //   }
    //   // 是否有诊断校验
    //   let rep = await getDiaByClinicType({
    //     visitCode: visitCode
    //   });
    //   if (rep.code === 1 && rep.data.length === 0) {
    //     this.$message.warning("当前患者还没有诊断，请开诊断之后才能开处方！");
    //     // eslint-disable-next-line consistent-return
    //     return false;
    //   }

    //   //防止点击两次 生成两条处方列表
    //   if (!this.addFlag) {
    //     return;
    //   }

    //   this.addFlag = false;
    //   let response = await getRecipeCode({
    //     visitCode: visitCode,
    //     cwFlag: "2"
    //   });
    //   if (response.code === 1) {
    //     let addRowEmpty = {};
    //     addRowEmpty["recipeCode"] = response.data;
    //     addRowEmpty["row_id"] = +new Date();
    //     let wrapperObject = {
    //       drugs: this.emptyList(),
    //       recipeCode: addRowEmpty["recipeCode"],
    //       status: "",
    //       row_id: addRowEmpty["row_id"]
    //     };

    //     this.tableData.push(wrapperObject);
    //     this.currentIndex = this.tableData.length - 1;
    //     if (Array.isArray(chmTempQuoteData)) {
    //       //引用中草药处方回调
    //       let drugsData = this.insertArray(chmTempQuoteData);
    //       // 对有药品的项 增加delete_id
    //       drugsData.forEach((item, index) => {
    //         if (item.itemId) {
    //           item.delete_id = String(+new Date() + String(index));
    //           item.row_id = wrapperObject["row_id"];
    //           item.recipeCode = wrapperObject["recipeCode"];
    //           item.status = wrapperObject["status"];

    //           // 应用数据标志放在 wrapperObject 上
    //           if (
    //             item.quoteFlag &&
    //             typeof wrapperObject.quoteFlag === "undefined"
    //           ) {
    //             wrapperObject.quoteFlag = true;
    //           }

    //           // console.log("item::::::::", item);
    //           // 数量单位转换 START
    //           // let qty =
    //           //   item.unitFlag === "0" ?
    //           //   item.quantity :
    //           //   item.quantity / item.packQuantity;

    //           // item.limitUnit = item.unit;
    //           // let unitKey = item.unitFlag === "0" ? item.limitUnit : item.packUnit;
    //           // let qty = getQtyByUnitFlag(
    //           //   item.unitFlag,
    //           //   item.quantity,
    //           //   item.packQuantity,
    //           //   "insert"
    //           // );
    //           // item.qty = qty;
    //           // item.unitKey = unitKey;
    //           convertFieldFromGetList(item);
    //           // let unitFlag = getChmUnitFlag(item.limitUnit, item.packUnit, item.unitKey);
    //           // getQtyByUnitFlag();
    //           // 数量单位转换 END
    //         }
    //       });
    //       wrapperObject.drugs = drugsData;

    //       this.chmDetails(wrapperObject);
    //       fn && fn();
    //     } else {
    //       this.chmDetails(wrapperObject);
    //     }

    //     //焦点定位到医嘱名称
    //     this.$nextTick(() => {
    //       // this.$refs.singleTable.setCurrentRow(
    //       //   this.tableData[this.tableData.length - 1]
    //       // );
    //       this.$refs["chmBottomForm"].reset();
    //       let nodeList = getDataIdDom("div", "data-id", "mainTableTdCls0");
    //       if (nodeList.length > 0) {
    //         nodeList[0].getElementsByClassName("el-input__inner")[0].focus();
    //       }

    //       this.herMaskShow = false;

    //       //处方列表 定位到最底下
    //       // let chuFangTable = this.$refs.singleTable;
    //       // chuFangTable.bodyWrapper.scrollTop =
    //       //   chuFangTable.bodyWrapper.scrollHeight;
    //       if (Array.isArray(chmTempQuoteData)) {
    //         document
    //           .querySelector(".onceDosageInput")
    //           .querySelector(".el-input__inner")
    //           .focus();
    //       }

    //       //zhengyawen 如果新增之前表格处方，并且有配送地址，则初始化配送方式地址
    //       this.deliveryForm = {};
    //       this.selectGroup.dispendingMethod = this.deliveryFormInit.dispendingMethod;
    //       this.deliveryForm = {
    //         ...this.deliveryForm,
    //         ...this.deliveryFormInit
    //       };
    //       delete this.deliveryForm.dispendingMethod;
    //     });
    //   } else {
    //     this.$message.error(response.msg || " 获取处方号失败！");
    //   }
    //   this.addFlag = true;
    // },
    insertArray(quoteData) {
      let tableList = [];
      if (quoteData && quoteData.length > 0) {
        let length = quoteData.length;
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
        //用户存储的药品信息大于24项
        for (let i = 0; i < this.getNearNumber(quoteData.length); i++) {
          if (i < length) {
            tableList.push(quoteData[i]);
          } else {
            tableList.push({});
          }
        }
        // }
      }
      return tableList;
    },
    getNearNumber(n) {
      return n % singleTdNum === 0
        ? n
        : ((n - (n % singleTdNum)) / singleTdNum + 1) * singleTdNum;
    },
    fillDrugs(drugs) {
      if (drugs && drugs.length > 0) {
        //用户存储了药品信息
        let length = drugs.length;
        /* if (length <= totalTdNum) {
            //用户存储的药品信息小于24项
            for (let i = 0; i < totalTdNum; i++) {
              if (i >= length) {
                drugs.push({});
              }
            }
          } else { */
        //用户存储的药品信息大于24项
        let totalTdNum = this.getNearNumber(drugs.length); //取临近singleTdNum的倍数的数
        for (let i = 0; i < totalTdNum; i++) {
          if (i >= length) {
            drugs.push({});
          }
        }
        // }
      }
    },
    //zhengyawen在新处方跳转到其他处方之前：将处方概要录入与剂型、取药药房、发药方式以及配送地址暂存在处方list中
    // putNewChmDetails() {
    //   let row = this.currentChuFangRow;
    //   if (row.status !== "") {
    //     return;
    //   }
    //   let other = {
    //     dosageValue: this.selectGroup.dosageValue,
    //     takingRoom: this.selectGroup.takingRoom,
    //     dispendingMethod: this.selectGroup.dispendingMethod,
    //     chmForm: this.$refs.chmBottomForm.chmForm,
    //     deliveryForm:
    //       this.selectGroup.dispendingMethod === "2" ? this.deliveryForm : {}
    //   };
    //   this.$set(this.tableData, this.currentIndex, {
    //     ...this.tableData[this.currentIndex],
    //     other
    //   });
    // },
    //组织数据
    // 填充到 4 的整数
    organizationData(drugs) {
      let pushNo = getPushNo(drugs.length);
      // console.log("drugs", drugs, pushNo);
      return drugsPushNo(pushNo, drugs);
    },
    beforeLeave() {
      return new Promise(async (resolve, reject) => {
        if (
          isCurrentRowChange(this.currentChuFangRow, this.cloneAllTableData)
        ) {
          try {
            let result = await alertFunc("数据没有保存，确定切换吗？");
            this.tableData = deepClone(this.cloneAllTableData);
            resolve(true);
          } catch (error) {
            reject(false);
          }
        } else {
          resolve(true);
        }
      });
    },
    //处方明细
    async chmDetails(row, column, event) {
      //新处方跳转到其他处方之前前台暂存录入数据
      // this.putNewChmDetails();
      // this.initChmTable();
      // debugger
      if (!row.drugs) {
        this.currentChuFangRow = row;
        return;
      };
      row.drugs.forEach(async (item, index) => {
        await this.getQtyUnitAjax(item).then(res => {
          this.$set(row.drugs[index], "unitOptions", res);
        });
      });
      this.tableList = this.organizationData(row.drugs);
      // this.advicePO = deepClone(row.drugs[0]);
      this.currentChuFangRow = row;
      // 药剂类型 与 药房数据
      if (row.pharmacyId) {
        this.selectGroup.takingRoom = row.pharmacyId;
      }

      if (row.drugClassCode) {
        this.selectGroup.dosageValue = row.drugClassCode;
      }

      // this.changeChmCurrentRow(row);
      // console.log("row.dispendingMethod", row.dispendingMethod);
      this.selectGroup.dispendingMethod = row.dispendingMethod;
      // 不是新增 + 配送
      if (row.status != "0" && row.dispendingMethod == "2") {
        this.getPrescriptionAddress(this.currentChuFangRow.id);
      }

      // 保存克隆数据
      // this.cloneCurrentRow = deepClone(row);
      if (typeof row.trindex !== "undefined") {
        this.currentIndex = row.trindex;
      }
      this.setHerMaskShow();
      // 判断处方是不是已提交的数据
      // console.log(this.currentChuFangRow);
      // 判断处方是不是已提交的的数据
      // this.herMaskShow = false;
      // this.herMaskShow = false;
      // this.setMultipleSelections(this.filterDrugsContainId(row.drugs));
      // if (row.status !== "" && !row.row_id) {
      //   this.selectGroup.dispendingMethod = "";
      //   this.deliveryForm = {};
      //   this.selectGroup.dispendingMethod = row.drugs[0].dispendingMethod;
      //   if (this.selectGroup.dispendingMethod == "2") {
      //     await this.getPrescriptionAddress();
      //   }
      // } else {
      //   //新增的处方
      //   //清空地址表单
      //   this.selectGroup.dispendingMethod = row.other.dispendingMethod || "1";
      //   this.resetAddress({
      //     shipmentType: ""
      //   });
      //   if (this.selectGroup.dispendingMethod === "2") {
      //     //更新新处方地址与属性
      //     this.deliveryFormProp = deepClone(row.other.deliveryForm);
      //     this.deliveryForm = deepClone(row.other.deliveryForm);
      //   }
      //   this.selectGroup.dosageValue = row.other.dosageValue;
      //   this.selectGroup.takingRoom = row.other.takingRoom;
      //   this.$refs.chmBottomForm.chmForm = deepClone(row.other.chmForm);
      // }
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
      let treatId = this.receivePatientData.id;
      if (!treatId) return;
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        treatId
      };
      this.queryLoading = true;
      // eslint-disable-next-line consistent-return
      return new Promise((resolve, reject)=>{
      herbalPage(data, data)
        .then(async res => {
          if (res.code == 1) {
            let dataList = res.data;

            this.tableData = dataList;
            this.cloneAllTableData = deepClone(dataList);
            if (dataList.length > 0) {
              //每次刷新处方列表都将表格最新的配送地址设为默认地址 zhengyawen
              // await this.getDefaultAddress();
            }
            this.currentChuFangRow = {};
            this.changeChmCurrentRow({});
            this.setDeliveryFormDefault();// 设置默认快递地址
            this.resetAddress();
            resolve(true);
          } else {
            this.$message.error(res.msg);
            reject(false);
          }
          this.queryLoading = false;
          this.$nextTick(() => {
            this.$refs.chmrpList.clearCurrent();
          });
        })
        .catch(err => {
          this.$message.error("网络错误!");
          this.queryLoading = false;
          reject(false);
        });

      });
 },
    handleCurrentChange() {},
    handleSelectionChange() {},
    selectRow() {},
    searchAdv() {
      this.addTableList();
    },
    async submitSave() {
      if (Object.keys(this.currentChuFangRow).length === 0) {
        this.$message.warning("请选中需要提交的数据");
        return;
      }

      let status = this.currentChuFangRow.drugs[0].status;
      if (status != zancunStatus) {
        this.$message.warning("仅暂存的数据可以被提交！");
        return;
      }

      let { id } = this.currentChuFangRow;

      // 验证底部表单
      try {
        await this.$refs.chmBottomForm.validateCurForm();
      } catch (error) {
        return;
      }


      if (this.chmDrugLoading) return;
      this.chmDrugLoading = true;
      herbalRecipeSubmit(id).then(async res => {
        if (res.code === 1) {
          this.initChmTable();
          this.queryChuFang();
          this.$message.success("提交成功");
        } else {
          this.$message.error(res.msg ? res.msg : "提交数据失败");
        }
        this.chmDrugLoading = false;
      }).catch(()=>{
        this.$message.error("提交数据失败");
        this.chmDrugLoading = false;
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
      if (recipeData.row_id && recipeData.status == "") {
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

      // 暂存的医嘱不可打印
      if (recipeData.status === "0") {
        this.$message.warning("暂存的处方不能打印！");
        this.batchLoading = false;
        return;
      }

      let { id } = recipeData;
      /*try {
        // console.log("recipeData", recipeData);
        let res = await hOrderPrint(id);
        if(res.code === 1) {
          let data = res.data;
          if(res.data.recipeCode === "" || res.data.recipeCode === undefined){
            this.$delete(data,"recipeCode");
          }

          let printData = data;

          // useMethod 为undefined ,值处理成空
          printData.useMethod = printData.useMethod || "";
          printData.weight = printData.weight || "";

          let { diagList, part3 } = printData;
          let rDiagList = diagList[1].diagList;
          // onPreview(data, "门诊处方(草药)");
          let aParse = eval(compile(hWContentTpl));
          printData.Diagnosis = aParse(rDiagList);

          let bParse = eval(compile(chmContenTpl));
          printData.RecipeDetails = bParse(part3);
          // console.log("printData", printData);
          let printTpl = this.printTpl ? this.printTpl : "hChmLodopTpl";
          print(null, printTpl, {}, printData);
        }
        this.batchLoading = false;
      } catch (error) {
        this.batchLoading = false;
      }*/
      try {
       await this.outpatientOrderPrint(id);
       this.batchLoading = false;
     } catch (error) {
       this.batchLoading = false;
     }

    },

    outpatientOrderPrint (recipeId, printDirect = false){
      return new Promise(async (resolve, reject)=>{
        try {
          let res = await hOrderPrint(recipeId);
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

    dataPrintFunc (printData = {}, printDirect){
      chmOrderItemPrintHandleCis(printData, {printTpl: this.printTpl, chmContenTpl, diagnoseTplChm} );
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

    async deleteHandler() {
      let isNewCFs = await this.isNewCF();
      if (!isNewCFs) {
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
      let { id } = this.currentChuFangRow;

      this.$confirm("删除后不可恢复，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delHerbalOrder(id)
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
      let { patientId } = this.receivePatientData;
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

    async setDeliveryFormDefault (){
      let kdObj = getKuaiDiRow(this.tableData);
      // console.log("kdObj:::::", kdObj);
      if (kdObj) {
        try {
          let defaultValue = await this.getPrescriptionAddress(kdObj.id);
          // console.log("defaultValue", defaultValue);

          // 默认地址 去掉 地址中的id
          this.$delete(defaultValue, "id");

          this.deliveryFormDefault = defaultValue;
        } catch (error) {

        }

      } else {
        this.deliveryFormDefault = {};
      }
    },
    initChmTable() {
      this.emptyTableList();
      this.advicePO = {};
      this.herMaskShow = true;
      this.currentChuFangRow = {};
      this.selectGroup.dispendingMethod = DisMtdDef;//默认配送地址是自取
      //zhengyawen 如果新增之前表格处方，并且有配送地址，则初始化配送方式地址
      // this.deliveryForm = {};
      this.resetAddress();
      // console.log("load清空配送地址", this.deliveryForm);
    },
    takingRoomChange(deptId) {
      let newPharmacyObject = getPharmacyObjectFunc(
        deptId,
        deepClone(this.chmPharmacyObject)
      );
      this.changeChmPharmacyObject(newPharmacyObject);
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
  created() {
    //      this.fetchTableList();

    this.initChmTable();
    this.queryChuFang();
    // this.getTakingRoomList(); //取药药房接口

     this.getPrintTplFunc();
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    ...mapGetters("cis", ["chmMedicineQuote"]),
    ...mapGetters("adviceCommon", ["chmPharmacyObject"]),
    ...mapGetters("base", ["PublicHealthPatientAddress"])
  },
  watch: {

    chmPharmacyObject: {
      deep: true,
      immediate: true,
      handler(c) {
        this.selectGroup.takingRoom = c.selected.deptId;
      }
    },
    receivePatientData: {
      handler(c) {
        this.resetAddress()
        this.getPatientDangAnAddress();// 档案的地址作为默认地址
        this.queryChuFang();
        this.initChmTable();
      },
      immediate: true
    },
    chmMedicineQuote: {
      deep: true,
      async handler(c) {
        this.quoteCallBackFunc(c);
      }
    },

    currentChuFangRow: {
      deep: true,
      handler(row) {

        let { drugs = [], useQty, id } = row;
        // if (drugs) {
          let itemIdList = drugs.filter(item => {
            return !isEmpty(item.itemId);
          });

          //console.log("currentChuFangRow :::: 改变了", itemIdList.length, itemIdList);
          // 处理 药剂类型 与 药房数据的状态
          this.formDisabled = itemIdList.length > 0;

          // 更新模板存储的multipleSelection
          this.multipleSelection = itemIdList;
          this.recipeId = id;
          this.computeAmtFuncHandler(deepClone(itemIdList), useQty);
        // }

        // 共享 row 数据
        this.changeChmCurrentRow(row);
      }
    },
    selectGroup:{
      deep: true,
      handler(a) {
        let currentChuFangRow = this.currentChuFangRow;
        // 同步到 currentChuFangRow
        this.currentChuFangRow = {
          ...currentChuFangRow,
          ...a
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "./components/chmMedicine.scss";
</style>
