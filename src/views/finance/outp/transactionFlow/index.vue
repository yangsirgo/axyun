<template>
  <el-card class="width100 height100 padding10 transaction-flow">
    <el-form class="search-area" :model="form" ref="form">
      <el-row :gutter="10" class="width100 margin-top-10">
        <el-col :span="4">
          <l-read-card ref="readCard" @readCard="getReadCard"></l-read-card>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="结算类型">
            <el-form-item prop="settlementType">
              <!-- <l-value-domain
                :value.sync="form.settlementType"
                code="settlementType"
                placeholder="请选择"
                clearable
              />-->
              <el-select v-model="form.settlementType" placeholder="请选择">
                <el-option
                  v-for="item in settlementTypeInfo"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="科室">
            <el-form-item prop="ouptDeptId">
              <!-- <l-value-domain
                remoteUrl="/appointment/doctorSchedule/getDept"
                :value.sync="form.ouptDeptId"
                remoteShowKey="deptName"
                remoteValueKey="deptId"
                placeholder="请选择"
                clearable
              />-->
              <el-select v-model="form.ouptDeptId" placeholder="请选择">
                <el-option
                  v-for="item in getDeptInfo"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <!-- <LFormtTitle label="医师">
            <el-form-item prop="doctorName">
              <l-value-domain
                remoteUrl="/appointment/doctorSchedule/all-doctor"
                :value.sync="form.doctorId"
                remoteShowKey="uname"
                remoteValueKey="uid"
                placeholder="请选择"
                clearable
              />
              <el-input v-model="form.doctorName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </LFormtTitle> -->
          <LFormtTitle label="医生" >
            <el-form-item prop="doctorName">
              <el-select v-model="form.doctorName" filterable placeholder="请选择">
                <el-option
                  v-for="item in DocOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
        </LFormtTitle>
        </el-col>
        <el-col :span="4">
          <LFormtTitle label="收费人员">
            <el-form-item prop="printUserId">
              <el-select
                v-model="form.chargeUserId"
                filterable
                remote
                reserve-keyword
                placeholder="姓名/拼音/五笔"
                @focus="selectAllUser('')"
                :remote-method="selectAllUser"
                :loading="selLoading"
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <!-- <l-value-domain
                :value.sync="form.chargeUserId"
                remoteUrl="/wadmin/dept-user/119/2"
                :remoteParams="''"
                remoteShowKey="uname"
                remoteValueKey="uid"
                placeholder="请选择"
                clearable
              />-->
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="4">
          <LFormtTitle label="患者姓名">
            <el-form-item prop="">
               <el-input v-model="form.patientName" placeholder="姓名" clearable></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="支付方式">
            <el-form-item prop="">
               <!-- <el-input v-model="form.payTypeName" placeholder="支付方式" clearable></el-input> -->
               <!-- <l-value-domain
                 code="PAY_TYPE"
                 :value.sync="form.payType"
                 @change="paymentMethodFun"
                 placeholder="请选择"
               ></l-value-domain> -->
               <el-select v-model="form.payTypeName" placeholder="请选择" clearable>
                 <el-option v-for="(item,index) in listPayTypeList" :key="index" :label="item.payTypeName" :value="item.payTypeName"></el-option>
               </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <!--<el-col :span="6">-->
          <!--<LFormtTitle label="申请单ID">-->
            <!--<el-form-item prop="refundApplyId">-->
              <!--<el-input v-model="form.refundApplyId" placeholder="请输入" clearable></el-input>-->
            <!--</el-form-item>-->
          <!--</LFormtTitle>-->

          <!-- <LFormtTitle label="收费时间">
            <el-date-picker
              width="100%"
              v-model="date"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
            ></el-date-picker>
          </LFormtTitle>-->
        <!--</el-col>-->
        <!-- <el-col :span="3">
          <LFormtTitle label="应用代码">
            <el-form-item prop="appCode">
              <el-input v-model="form.appCode" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>-->
      </el-row>
      <el-row :gutter="10" class="width100 margin-top-10">
        <el-col :span="4">
          <LFormtTitle label="交易ID">
            <el-form-item prop="tradeId">
              <el-input v-model="form.tradeId" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="4">
          <LFormtTitle label="原交易ID">
            <el-form-item prop="oldTradeId">
              <el-input v-model="form.oldTradeId" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </LFormtTitle>
         </el-col>

        <el-col :span="5">
          <LFormtTitle label="收费时间">
            <el-date-picker
              width="100%"
              v-model="date"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
            ></el-date-picker>
          </LFormtTitle>
        </el-col>

        <el-col :span="11" class="float-right">
          <el-button type="primary" plain class="float-right" @click="repairBill">补开电子票据</el-button>
          <el-button type="primary" plain class="float-right" @click="printElectronicBill" style="margin-right:8px;">打印电子票据</el-button>
          <el-button type="primary" plain class="float-right" @click="repairProof">补打凭证</el-button>
          <el-button type="primary" plain class="float-right" @click="setOut">导出</el-button>
          <el-button type="primary" plain class="float-right" @click="reset">重置</el-button>
          <el-button type="primary" class="float-right" @click="select">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="tableHeight">
      <el-table
        :data="tableData"
        width="100%"
        height="100%"
        stripe
        border
        v-loading="loading"
        :element-loading-text="$t('retreat.loadInfo')"
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width|| (item.label.length * 18 + 24)"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'totalMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'selfPayMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'freePayMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'derateAmount'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'couponPay'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'bxMoney'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'prestorePay'">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'recordStatus'">
              <span v-if="scope.row[item.prop] == '1'">{{'收费'}}</span>
              <span v-if="scope.row[item.prop] == '2'">{{'已退费'}}</span>
              <span v-if="scope.row[item.prop] == '9'">{{'退费'}}</span>
            </template>
            <template v-else-if="item.prop == 'payStatus'">
              <span v-if="scope.row[item.prop] === '0'">未支付</span>
              <span v-else-if="scope.row[item.prop] === '1'">已支付</span>
              <span v-else></span>
            </template>
            <template v-else-if="item.prop == 'settlementType'">
              <span>{{
                this.settlementTypeData[scope.row[item.prop]]}}</span>
            </template>
            <template v-else-if="item.prop == 'oprate'">
              <el-button size="mini" type="text" @click="payRowClick(scope.row)">支付明细</el-button>
              <el-button size="mini" type="text" @click="otherRowClick(scope.row)">费用明细</el-button>
              <el-button size="mini" type="text" :disabled="scope.row.settlementType==1 || scope.row.recordStatus !=1" @click="printDataFuc(scope.row)">医保清单</el-button>
            </template>
            <template v-else-if="item.prop == 'payDetail'">
              <span>{{ scope.row.payDetail}}</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNo"
        :page-sizes="[50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      ></el-pagination>
    </div>

    <el-dialog title="支付明细" :visible.sync="otherDialogVisible" width="50%" class="dialog">
      <div class="tableTwo padding10">
        <el-table
          :data="tableDataTwo"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loadingTwo"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="otherRowClick"
        >
          <el-table-column
            v-for="(item, index) in tableParamsTwo"
            :key="index"
            sortable
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'center'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'classCode'">
              <span>{{
                financeCodeMap[parseInt(scope.row[item.prop])]}}</span>
              </template>
              <template v-else-if="item.prop == 'payAmt'">
                <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
                <span v-if="!scope.row[item.prop]">0.00</span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="医嘱明细-费用明细"  :visible.sync="dialogVisible" width="50%" class="dialog">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane tab-position label="医嘱明细" name="orderDetail">
          <div class="tableThree">
          <el-table
            :data="tableDataOrderDetail"
            width="100%"
            height="100%"
            stripe
            border
            v-loading="loadingOrderDetail"
            :element-loading-text="$t('retreat.loadInfo')"
            highlight-current-row
            @row-click="rowClickOrderDetail"
          >
            <el-table-column
              v-for="(item, index) in tableParamsOrderDetail"
              :key="index"
              sortable
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'center'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'totalMoney'">
                  <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'orderType'">
                  <span
                    columns="doctors_advice_name"
                    :conditionMap="{doctors_advice_code: scope.row.orderType}"
                    tableName="cnf_doctors_advice"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
        <el-tab-pane label="费用明细" name="chargeDetail">
          <div class="tableThree">
          <el-table
            :data="tableDataThree"
            width="100%"
            height="100%"
            stripe
            border
            v-loading="loadingThree"
            :element-loading-text="$t('retreat.loadInfo')"
            highlight-current-row
          >
            <el-table-column
              v-for="(item, index) in tableParamsThree"
              :key="index"
              sortable
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'center'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'classCode'">
              <span>{{
                financeCodeMap[parseInt(scope.row[item.prop])]}}</span>
                </template>
                <template v-else-if="item.prop == 'chargeUnit'">
                  <span v-if="!isChinese(scope.row[item.prop])" :val="scope.row[item.prop]" code="DrugUnit" v-codeTransform></span>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
                <template v-else-if="item.prop == 'chargePrice'">
                  <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],4)}}</span>
                  <span v-if="!scope.row[item.prop]">0.0000</span>
                </template>
                <template v-else-if="item.prop == 'totalMoney'">
                  <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],2)}}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <printNameseter
      v-if="printNameseterVisible"
      title="打印机设置"
      width="800px"
      :visible.sync="printNameseterVisible"
      :requiredName="requiredName"
      @closePrintSeterFuc="closePrintSeterFuc"
    ></printNameseter>
  </el-card>
</template>
<script>
import service from "@/api/cis/receiptPrint/receiptPrint";
import service2 from "@/api/financeManagement/prestoreGrant.js";
import { onPreview, onPrint } from "@/utils/print";
import settleApi from "@/api/cis/settleAccount/index.js";
import baseApi from "@/api/financeManagement/inp.js";
import {
  getFinClassCodeList,
  addFinClassCode,
  updateFinClassCode,
  deleteFinClassCode
} from "@/api/systemManagement/dataMaintain/financeCode.js";
import { onExcel } from "@/utils/excel/excel";
import {
  getDeptDoctorList,
  nurseList,
  bedList,
  canBeUseDoctorAndNurseList,
  getApplyInfo
} from "@/api/ipnw/etHospital.js";
import { getIsTenant, getPamars } from "@/utils/auth";
import { siChargeTpl, handleData } from "@//printTemplete/module/siChargeTpl.js";
import { print } from "@/utils/print_new.js";
import { settleCostFind } from "@/api/medicalInsuranceNew/siChargeTpl.js";
import { thermosensitiveTpl, thermosensitiveErrorTpl, handleThermosensiPrintData } from "@/printTemplete/module/thermosensitiveTpl.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";
import { deepClone } from "@/utils/index.js";

export default {
  name: "transactionFlow",
  mixins: [getDictInfoNew],
  data() {
    return {
      hosId: "",
      getDeptInfo: [], //科室下拉框列表
      loading: false,

      // 表格数据
      tableData: [],
      tableDatas: [],
      // 当前行
      currentRow: {},
      // 表格列
      tableParams: [
        // {
        //   prop: "patientCode",
        //   label: "患者编号",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "100"
        // },

        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        {
          prop: "settlementTypeName",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        // {
        //   prop: "settlementCode",
        //   label: "结算单位",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "ouptDeptName",
          label: "科室",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "doctorName",
          label: "医师",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "billNo",
          label: "电子票据号",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "receiptNum",
          label: "纸质票据号",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "selfPayMoney",
          label: "自付金额",
          align: "right",
          headerAlign: "center",
          width: "110"
        },
        {
          prop: "freePayMoney",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "110"
        },
        {
          prop: "derateAmount",
          label: "减免金额",
          align: "right",
          headerAlign: "center",
          width: "110"
        },
        /* {
          prop: "prestorePay",
          label: "预存支付",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "cashPay",
          label: "非预存支付",
          align: "right",
          headerAlign: "center",
          width: "90"
        }, */
        {
          prop: "couponPay",
          label: "优惠券支付",
          align: "right",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "chargeUserName",
          label: "收费人员",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "payStatus",
          label: "支付状态",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        // {
        //   prop: "payTime",
        //   label: "退费时间",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "160"
        // },
        {
          prop: "payDetail",
          align: "left",
          label: "支付方式",
          width: "220"
        },
        {
          prop: "oprate",
          align: "left",
          headerAlign: "center",
          label: "操作",
          width: "280"
        } ,{
          prop: "tradeId",
          label: "交易ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        },{
          prop: "oldTradeId",
          label: "原交易ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        }
        // ,
        // {
        //   prop: "appCode",
        //   label: "应用代码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // }
      ],
      // 查询表单
      form: {
        ouptDeptId: "",
        settlementType: "",
        doctorId: "",
        chargeUserId: "",
        chargeTime: "",
        doctorName: "全部",
        refundApplyId: "",
        oldTradeId:"",
        tradeId:"",
        patientName:'',
        payTypeName:''
      },
      cardInfo: {},
      // 时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 100,
        total: 0
      },
      // 支付明细
      otherDialogVisible: false,
      tableDataTwo: [],
      tableParamsTwo: [
        {
          prop: "payTypeName",
          label: "支付类型",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "payAmt",
          label: "支付金额",
          align: "right",
          headerAlign: "center",
          width: "140"
        },
        {
          prop: "bankName",
          label: "银行名称",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
        {
          prop: "bankAccount",
          label: "银行账号",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "companyName",
          label: "单位名称",
          align: "right",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "checkNum",
          label: "票号",
          align: "right",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "recordRemark",
          label: "备注",
          align: "right",
          headerAlign: "center",
          width: "90"
        }
      ],
      loadingTwo: false,
      //当前票据对象
      currentData: {},
      dialogVisible: false,
      tableDataThree: [],
      // 收费项目明细列
      tableParamsThree: [
        {
          prop: "classCode",
          label: "财务分类",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          align: "left",
          headerAlign: "center",
          width: "140"
        },
        // {
        //   prop: "spec",
        //   label: "规格",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "80"
        // },
        {
          prop: "chargePrice",
          label: "单价",
          align: "right",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "chargeQuantity",
          label: "数量",
          align: "right",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "chargeUnit",
          label: "单位",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "totalMoney",
          label: "金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        }
      ],
      loadingThree: false,
      selLoading: false,
      loadingOrderDetail:false,
      currentDataOrderDetail:{},
      activeName:'orderDetail',
      tableDataOrderDetail:[],
      tableParamsOrderDetail:[
        {
          prop: "orderType",
          label: "医嘱类型",
          align: "left",
          headerAlign: "center",
          width: "90"
        },{
          prop: "orderName",
          label: "医嘱名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },{
          prop: "orderQuantity",
          label: "数量",
          align: "right",
          headerAlign: "center",
          width: "90"
        },{
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },{
          prop: "orderTime",
          label: "医嘱时间",
          align: "left",
          headerAlign: "center",
          width: "130"
        },{
          prop: "executeDeptName",
          label: "执行科室名称",
          align: "left",
          headerAlign: "center",
          width: "105"
        },{
          prop: "orderBillNum",
          label: "医嘱单号",
          align: "left",
          headerAlign: "center",
          width: "130"
        }
      ],
      settlementTypeData:{},
      DocOptions:[{
        name: "全部",
        id: "全部"
      }],
      options: [
        {
          name: "全部",
          id: ""
        }
      ],
      settlementTypeInfo: [
        {
          code: "",
          name: "全部"
        }
      ], //结算类型
      financeCodeMap:{},
      // 支付方式
      listPayTypeList: [],
      printNameseterVisible: false,
      requiredName: ""
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  created() {
    // const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
    // const end = new Date(
    //   new Date(new Date().toLocaleDateString()).getTime() +
    //     24 * 60 * 60 * 1000 -
    //     1
    // );
    // this.date = [start, end];
    this.getListPayTypeList();
  },
  mounted() {
    this.hosId = JSON.parse(getPamars()).hosId;
    this.settlementType();
    this.selectAllDoc();
    this.getDept();
  },
  methods: {
    async getListPayTypeList() {
      let res = await service.getListPayType();
      if(res.code == 1) {
        this.listPayTypeList = res.data;
      }
    },
    isChinese(temp) {
      let re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
    //查询科室列表--下拉框
    async getDept() {
      try {
        let res = await service2.getDept();
        this.getDeptInfo = [
          {
            deptId: "",
            deptName: "全部"
          }
        ];
        this.getDeptInfo = this.getDeptInfo.concat(res.data);
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取科室列表报错");
      }
    },
    //查询结算类型列表--下拉框
    async settlementType() {
      try {
        let res = await service.settlementType();
        this.settlementTypeInfo = [
          {
            code: "",
            name: "全部"
          }
        ];
        this.settlementTypeInfo = this.settlementTypeInfo.concat(res.data);
        res.data.forEach(item => {
          this.settlementTypeData[item.code] = item.name;
        });
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取结算类型列表报错");
      }
       getFinClassCodeList()
          .then(res => {
            if (res.code === 1) {
              this.financeCodeMap = {"":""};
              res.data.forEach(item => {
                this.financeCodeMap[item.finClassCode] = item.classCodeName;
              });
              console.info(this.financeCodeMap);
            }
         }).catch(err => {
            this.$message.error(err.msg || "获取财务分类码报错");
          });
      this.select();
    },
    // 查询用户
    async selectAllDoc(val) {
      try {
        let res = await canBeUseDoctorAndNurseList({
          hosId: this.hosId,
          utype: "1"
        });
        this.DocOptions = [
          {
            name: "全部",
            id: "全部"
          }
        ];
        this.DocOptions = this.DocOptions.concat(res.data);
      } catch (error) {
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await baseApi.getAllUser({
          userName: val || ""
        });
        this.options = [
          {
            name: "全部",
            id: ""
          }
        ];
        this.options = this.options.concat(res.data);
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.select();
    },
    getDate(data) {},
    // 查询交易信息
    async getDataInfo() {
      try {
        this.loading = true;
        let obj = {
          ...this.pageParams,
          patientId: this.cardInfo.patientId,
          startChargeTime: "",
          ouptDeptId: this.form.ouptDeptId || "",
          settlementType:  this.form.settlementType ||  "",
          doctorId: this.form.doctorId || "",
          chargeUserId: this.form.chargeUserId || "",
          chargeTime: this.form.chargeTime || "",
          doctorName: this.form.doctorName == "全部" ? "" : this.form.doctorName || "",
          refundApplyId: this.form.refundApplyId || "",
          oldTradeId:this.form.oldTradeId || "",
          tradeId:this.form.tradeId || "",
          patientName:this.form.patientName || '',
          payTypeName:this.form.payTypeName || '',
          endChargeTime: ""
        };
        if (this.date && this.date.length > 1) {
          obj.startChargeTime = this.date[0];
          obj.endChargeTime = this.date[1];
        }else{
          this.$message.error('收费时间不能为空！');
          this.loading = false;
          return;
        }
        let res = await service.getTradeListNew(obj);
        let datas = res.data;
        let tableData = [];
        for (let i in datas) {
          console.info(this.settlementTypeData);
          let obj = {
            ...datas[i],
            totalMoney: datas[i]["totalMoney"] || 0,
            freePayMoney: datas[i]["freePayMoney"] || 0,
            derateAmount: datas[i]["derateAmount"] || 0,
            couponPay: datas[i]["couponPay"] || 0,
            prestorePay: datas[i]["prestorePay"] || 0,
            selfPayMoney: datas[i]["selfPayMoney"] || 0,
            settlementTypeName: this.settlementTypeData[datas[i]["settlementType"]] || "未知"
          };
          tableData.push(obj);
        }
        this.tableData = tableData;
        this.pageParams.total = res.total;
        // this.pageParams = res.pageParams;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    // 查询交易信息(all)
    async getDataInfoAll() {
      try {
        this.form.doctorName = this.form.doctorName == "全部" ? "" : this.form.doctorName;
        let obj = {
          ...this.pageParams,
          patientId: this.cardInfo.patientId,
          startChargeTime:  "",
          ouptDeptId: this.form.ouptDeptId || "",
          settlementType:  this.form.settlementType ||  "",
          doctorId: this.form.doctorId || "",
          chargeUserId: this.form.chargeUserId || "",
          chargeTime: this.form.chargeTime || "",
          doctorName: this.form.doctorName == "全部" ? "" : this.form.doctorName || "",
          refundApplyId: this.form.refundApplyId || "",
          oldTradeId:this.form.oldTradeId || "",
          tradeId:this.form.tradeId || "",
          endChargeTime: ""
        };
        if (this.date && this.date.length > 1) {
          obj.startChargeTime = this.date[0];
          obj.endChargeTime = this.date[1];
        }
        let res = await service.getTradeListNewAll(obj);
        let datas = res.data;
        let tableData = [];
        for (let i in datas) {
          let obj = {
            ...datas[i],
            totalMoney: datas[i]["totalMoney"] || 0,
            freePayMoney: datas[i]["freePayMoney"] || 0,
            derateAmount: datas[i]["derateAmount"] || 0,
            couponPay: datas[i]["couponPay"] || 0,
            prestorePay: datas[i]["prestorePay"] || 0,
            selfPayMoney: datas[i]["selfPayMoney"] || 0,
            settlementTypeName:this.settlementTypeData[datas[i]["settlementType"]]
          };
          tableData.push(obj);
        }
        this.tableDatas = tableData;
      } catch (error) {
        this.$message.error(error.msg || "查询失败");
      }
    },
    // 查询医嘱收费明细
    async selectOrderDetail(data) {
      try {
        let params = {
          tradeId: data.tradeId
        };

        this.loadingOrderDetail = true;
        let res = await settleApi.getOrderChargeDetailInfoAll(params);
        if (res.code === 1) {
          this.tableDataOrderDetail = res.data;
        }
        this.loadingOrderDetail = false;
      } catch (error) {
        this.loadingOrderDetail = false;
        this.$message.error(error.msg || "查询医嘱收费明细失败");
      }
    },
    // 查询收费明细
    async selectOutpChargeDetailNew(data) {
      try {
        let params = {
          tradeId: data.tradeId
        };
        this.loadingThree = true;
        let res = await settleApi.listOutpChargeDetailNew(params);
        if (res.code === 1) {
          this.tableDataThree = res.data;
        }
        this.loadingThree = false;
      } catch (error) {
        this.loadingThree = false;
        this.$message.error(error.msg || "查询项目收费明细失败");
      }
    },
    rowClickOrderDetail(row){
      const list = [];
      this.$emit("currentDataOrderDetail", row);
      this.currentDataOrderDetail = row.outpChargeDetailNewVOS;
      console.info(this.currentDataOrderDetail);
    },
    handleClick(){
      console.info(this.currentDataOrderDetail);
      //this.tableDataThree = this.currentDataOrderDetail;
    },
    // load
    load() {
      console.log(this.tlm_noMore, this.pageParams);
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getDataInfo();
    },
    // 查询
    select() {
      this.tableData = [];
      this.pageParams.pageNo = 1;
      this.getDataInfo();
    },
    // 重置
    reset() {
      this.cardInfo = {};
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
      this.$refs.readCard.cancalCardData();
      this.date = [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ];
      this.form.chargeUserId = "";
      this.form.patientName = "";
      this.form.payTypeName = "";
      this.select();
    },
    // 点击行
    rowClick(row) {
      this.currentRow = { ...row };
    },
    payRowClick(row) {
      this.otherDialogVisible = true;
      this.getAccountList(row.tradeId);
    },
    otherRowClick(row) {
      this.dialogVisible = true;
      this.activeName = 'orderDetail';
      this.selectOrderDetail(row);
      this.selectOutpChargeDetailNew(row);
    },
    // 千位分隔
    formatNumber(a, num) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 获取支付明细
    getAccountList(tid) {
      this.loadingTwo = true;
      service
        .getAccountTradeSettleAmtList(tid)
        .then(res => {
          if (res.code === 1) {
            this.tableDataTwo = res.data;
          }
          this.loadingTwo = false;
        })
        .catch(err => {
          this.loadingTwo = false;
        });
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getDataInfo();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getDataInfo();
    },
    // 导出
    async setOut() {
      let obj = {
        patientId: this.cardInfo.patientId,
        startChargeTime: "",
        ouptDeptId: this.form.ouptDeptId || "",
        settlementType:  this.form.settlementType ||  "",
        doctorId: this.form.doctorId || "",
        chargeUserId: this.form.chargeUserId || "",
        chargeTime: this.form.chargeTime || "",
        doctorName: this.form.doctorName == "全部" ? "" : this.form.doctorName || "",
        refundApplyId: this.form.refundApplyId || "",
        oldTradeId:this.form.oldTradeId || "",
        tradeId:this.form.tradeId || "",
        patientName:this.form.patientName || '',
        payTypeName:this.form.payTypeName || '',
        endChargeTime: "",
        exportType: 1,
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.date[0];
        obj.endChargeTime = this.date[1];
      }
      let res = await service.exportChargeExcel(obj);
      var blob = res;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("transaction-flow")[0];

        var a = document.createElement('a');
        a.setAttribute("id","billHref");
        a.download = '交易流水.xls';
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      }
      return;
    },
    paymentMethodFun(a,b){
      console.log(a,b);
      this.form.payTypeName = b.name;
    },
    async printDataFuc(row) {
      try {
        let res = await settleCostFind({
          finAdId: row.tradeId
        });
        if (res.code == 1) {
          let setlinfo = res.data.settle.setlinfo;
          let resData = {
            ...res.data,
            ...setlinfo,
            gend: this.transformNew("gend",setlinfo.gend),
            hosp_lv: this.transformNew("hosp_lv",setlinfo.hosp_lv),
            psn_type: this.transformNew("psn_type",setlinfo.psn_type),
            insutype: this.transformNew("insutype",setlinfo.insutype),
            med_type: this.transformNew("med_type",setlinfo.med_type)
          }
          console.log("resData", resData)
          let obj = handleData(resData);
          print(null, siChargeTpl, {}, obj, false);
        }
      } catch (error) {}
    },
    // 补开凭证
    repairProof(){
      if(!this.currentRow) {
        this.$message.warning("请先选中一条交易记录！");
        return;
      }
      if(this.currentRow.recordStatus != '1') {
        this.$message.warning("该状态的记录不可补开凭证。");
        return;
      }
      if(!this.currentRow.pictureUrl) {
        this.$message.warning("选中记录未开具电子票据，无相关凭证信息。");
        return;
      }
      this.printReceiptValied();
    },
    // 打印电子票据
    printElectronicBill(){
      if(!this.currentRow) {
        this.$message.warning("请先选中一条交易记录！");
        return;
      }
      if(this.currentRow.recordStatus != '1') {
        this.$message.warning("该状态的记录不可打印电子票据。");
        return;
      }
      if(!this.currentRow.pictureUrl) {
        this.$message.warning("选中记录未开具电子票据，无相关凭证信息。");
        return;
      }
      window.open(`${this.currentRow.pictureUrl}`);
    },
    // 补开电子票据
    repairBill(){
      if(!this.currentRow) {
        this.$message.warning("请先选中一条交易记录！");
        return;
      }
      if(this.currentRow.recordStatus != '1') {
        this.$message.warning("该状态的记录不可补开电子票据。");
        return;
      }
      if(this.currentRow.pictureUrl) {
        this.$message.warning("该记录已开具电子票据，不能补开。");
        return;
      }
      this.printReceiptValied();
    },
    // 校验本地是否存储热敏凭条打印机
    async printReceiptValied() {
      let printerName = "";
      // 选择发票打印机
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      let arr = tableData.filter((item) => {
        return item.name === "热敏凭证";
      });
      if(arr.length) {
        printerName = arr[0].printerName;
        await this.printElectronicReceipt(printerName);
        return;
      }
      this.printNameseterVisible = true;
      this.requiredName = "热敏凭证";
      return;
    },
    // 打印电子发票热敏凭条
    async printElectronicReceipt(printerName) {
      try {
        let res = await service.printInvoiceEBill({
          tradeId: this.currentRow.tradeId || ""
          // tradeId: "8ae451047ca594ed017ca67197e100df"
        });
        if (res.code === 1) {
          let obj = handleThermosensiPrintData(res.data);
          print("", thermosensitiveTpl, {printerName}, obj, true);
        } else if (res.code === 1001) {
          this.$message.error(res.msg || "开具电子发票失败！");
          let obj = handleThermosensiPrintData(res.data || {});
          print("", thermosensitiveErrorTpl, {printerName}, obj, true);
        } else {
          this.$message.error(res.msg || "开具电子发票失败！");
        }
      } catch (error) {}
    },
    closePrintSeterFuc(name) {
      this.printNameseterVisible = false;
      if(name === "热敏凭证") {
        this.printElectronicReceipt(name);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.transaction-flow {
  .el-tabs div:hover{
    color:#fff !important;
  }
  .margin-top-10 {
    margin-top: 10px;
  }
  .tableHeight {
    width: 100%;
    height: calc(100% - 172px);
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .tableTwo {
    height: 400px;
  }
  .tableThree {
    height: 300px;
  }
  .page {
    text-align: right;
    margin-top: 20px;
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
