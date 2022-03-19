<template>
  <div class="width100 height100" ref="page" v-loading="listLoad">
    <div class="outpcharge-main width100 height100">
      <!-- <el-tabs class="height100" v-model="activeName" @tab-click="tabHandler">
        <el-tab-pane label="可申请" name="first"> -->
      <div class="height100" v-if="sendData.recordStatus == '1'">
        <p class="no-data" v-show="tradeDetailList.length === 0">暂无数据</p>
        <l-collapse v-model="activeNames2" class="cols">
          <l-collapse-item
            v-for="(tradeItem, index) in tradeDetailList"
            :name="index"
            :key="index"
          >
            <!-- 交易信息列-->
            <div class="width100" slot="title" @click.stop="clickTitle0(tradeItem)">
              <el-row class="over-txt" :gutter="20">
                <el-col :span="6">
                  <div @click.native.stop>
                  <el-radio v-model="applyChecked" :label="tradeItem.tradeId" @click.native="clickRadio(tradeItem, $event)">
                    门诊号：
                    <span>{{ tradeItem.diagTreatActivityId }}</span>
                  </el-radio>
                  </div>
                </el-col>
                <el-col :span="8">
                  <template v-if="tradeItem.receiptNum">票据号：{{tradeItem.receiptNum}}</template>
                </el-col>
                <el-col :span="10">
                  操作员：
                  <span class="margin-right10">{{
                    tradeItem.chargeUserName
                  }}</span>
                  交易时间：
                  <span>{{ tradeItem.chargeTime }}</span>
                </el-col>
              </el-row>
            </div>
            <!-- 收费医嘱明细 循环 -->
            <div slot="content">
              <div class="margin-top-10">
                <l-collapse v-model="orderActiveNames[index]">
                  <l-collapse-item
                    v-for="(
                      orderItem, index2
                    ) in tradeItem.outpOrderChargeDetailInfoVOs"
                    :name="index2"
                    :key="index2"
                  >
                    <!-- 医嘱明细表头 -->
                    <div class="width100" slot="title" @click.stop="clickCkildTitle(orderItem, tradeItem, index, index2)">
                      <el-row class="row-h">
                        <el-col :span="5" class="row-h-h">
                          <el-checkbox
                            :disabled="applyChecked !== tradeItem.tradeId"
                            v-model="orderItem.checked"
                            @click.native.stop
                            @change="
                              orderChange(
                                $event,
                                orderItem.orderChargeDetailId,
                                index,
                                index2
                              )
                            "
                          >
                            <span :title="orderItem.orderName">{{
                              orderItem.orderName
                            }}</span>
                          </el-checkbox>
                        </el-col>
                        <el-col
                          :span="6"
                          v-if="['1', '4'].includes(orderItem.orderSource)"
                        >
                          <span>{{
                            orderSourceShow[orderItem.orderSource]
                          }}{{ orderItem.orderBillNum }}</span>
                          
                        </el-col>
                        <el-col :span="6" v-else></el-col>
                        <el-col :span="3"
                          >收费数量：{{ orderItem.orderQuantity }}项</el-col
                        >
                        <el-col
                          @click.native.stop
                          :span="5"
                          v-if="orderItem.partRefundFlag === '0'"
                        >
                          申请数量：
                          <el-input-number
                            style="width: 100px"
                            v-model="orderItem.refundOrderQuantity"
                            controls-position="right"
                            :min="0"
                            :max="orderItem.orderQuantity"
                            :step="1"
                            :controls="false"
                            @change="qtyValidate($event, index, index2)"
                          ></el-input-number
                          >&nbsp;&nbsp;项
                        </el-col>
                        <el-col :span="5" v-else></el-col>
                        <el-col :span="5"
                          >总金额：{{
                            formatNumber(orderItem.actualMoney)
                          }}元</el-col
                        >
                      </el-row>
                    </div>
                    <!-- 收费项目明细表格 -->
                    <div slot="content">
                      <el-table
                        :data="orderItem.outpChargeDetailNewVOS"
                        border
                        style="width: 100%"
                      >
                        <el-table-column width="45px">
                          <template slot-scope="scope">
                            <el-checkbox
                            :disabled="(applyChecked !== tradeItem.tradeId) || !orderItem.checked"
                              v-if="orderItem.partRefundFlag === '1'"
                              v-model="scope.row.checked"
                              @change="
                                orderItemChange(
                                  $event,
                                  orderItem.orderChargeDetailId,
                                  index,
                                  index2
                                )
                              "
                            ></el-checkbox>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column prop="execStatus" label="执行状态" header-align="center">
                            <template slot-scope="scope">{{ scope.row[item.prop] > 0 ? "已执行" : "未执行" }}</template>
                          </el-table-column>-->
                        <el-table-column
                          prop="chargeItemName"
                          label="项目名称"
                          header-align="center"
                        ></el-table-column>
                        <el-table-column
                          show-overflow-tooltip
                          width="200"
                          prop="spec"
                          label="规格"
                          header-align="center"
                        ></el-table-column>
                        <el-table-column
                          show-overflow-tooltip
                          width="100"
                          prop="chargePrice"
                          label="单价"
                          header-align="center"
                          align="right"
                        >
                          <template slot-scope="scope">{{
                            formatNumber(scope.row.chargePrice, 4)
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          prop="chargeQuantity"
                          label="收费数量"
                          header-align="center"
                          align="right"
                          show-overflow-tooltip
                          width="100"
                        >
                          <template slot-scope="scope">
                            <span>
                              {{ scope.row.chargeQuantity }}
                              <span
                                v-if="orderItem.orderSource === '1'"
                                :val="scope.row.chargeUnit"
                                code="DrugUnit"
                                v-codeTransform
                              ></span>
                              <span v-else>{{ scope.row.chargeUnit }}</span>
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="refundQuantity"
                          label="申请数量"
                          show-overflow-tooltip
                          width="180p"
                          header-align="center"
                          align="right"
                        >
                          <template slot-scope="scope">
                            <span
                              class="no-wrap"
                              v-if="orderItem.partRefundFlag === '1'"
                            >
                              <el-input-number
                                style="width: 100px"
                                v-model="scope.row.refundQuantity"
                                controls-position="right"
                                :min="0"
                                @change="
                                  refQtyValidate(
                                    $event,
                                    index,
                                    index2,
                                    scope.$index
                                  )
                                "
                                :max="scope.row.chargeQuantity"
                                :controls="false"
                                :step="1"
                              ></el-input-number>
                              <span
                                v-if="orderItem.orderSource === '1'"
                                :val="scope.row.chargeUnit"
                                code="DrugUnit"
                                v-codeTransform
                              ></span>
                              <span v-else>{{ scope.row.chargeUnit }}</span>
                            </span>
                            <span v-else>
                              {{
                                formatNumber(
                                  orderItem.refundOrderQuantity
                                    ? orderItem.refundOrderQuantity *
                                        scope.row.orderChargeItemQuantity
                                    : 0
                                )
                              }}
                              <span
                                v-if="orderItem.orderSource === '1'"
                                :val="scope.row.chargeUnit"
                                code="DrugUnit"
                                v-codeTransform
                              ></span>
                              <span v-else>{{ scope.row.chargeUnit }}</span>
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          show-overflow-tooltip
                          width="100"
                          prop="derateAmount"
                          label="减免金额"
                          header-align="center"
                          align="right"
                        >
                          <template slot-scope="scope">{{
                            formatNumber(scope.row.derateAmount)
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          show-overflow-tooltip
                          width="100"
                          prop="totalMoney"
                          label="总金额"
                          header-align="center"
                          align="right"
                        >
                          <template slot-scope="scope">{{
                            formatNumber(scope.row.totalMoney)
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          show-overflow-tooltip
                          width="100"
                          prop="remark"
                          label="备注"
                          header-align="center"
                        ></el-table-column>
                      </el-table>
                    </div>
                  </l-collapse-item>
                </l-collapse>
              </div>
            </div>
          </l-collapse-item>
        </l-collapse>
        <div class="page align-right">
          <el-pagination
            background
            @size-change="applyChangeSize"
            @current-change="applyChangePage"
            :current-page="applyPageParams.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="applyPageParams.pageSize"
            :total="applyPageParams.total"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div class="bottom-con">
          <!-- 退费原因 -->
          <div style="display: flex">
            <LFormtTitle label="退费原因" style="margin-right: 8px">
              <!-- <el-select v-model="refundReasonCode" placeholder="请选择">
                  <el-option
                    v-for="item in remarkOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
              <l-value-domain
                :code="'refundReason'"
                :value.sync="refundReasonCode"
                clearable
              ></l-value-domain>
            </LFormtTitle>
            <el-input
              v-if="refundReasonCode === '99'"
              v-model="refundReason"
              placeholder="请输入其他原因"
            ></el-input>
          </div>

          <div>
            <el-button
              type="primary"
              v-hotKey="{ func: 'func_submit' }"
              @click="openSubmitCharge"
              >确认申请</el-button
            >
            <el-button
              style="width:0;height:0;display:none"
              class="isRefundButton"
              v-hasButton="['cw_001']"
              >隐藏按钮</el-button
            >
          </div>
        </div>
      </div>

      <!-- </el-tab-pane>
        <el-tab-pane label="已申请" name="second"> -->
      <div class="height100" v-if="sendData.recordStatus == '2'">
        <p class="no-data" v-show="appliedList.length === 0">暂无数据</p>
        <l-collapse v-model="activeNamesEd2" class="cols">
          <l-collapse-item
            v-for="(parentItem, index) in appliedList"
            :name="index"
            :key="index"
          >
            <div class="width100" slot="title" @click.stop="clickTitle1(parentItem)">
              <el-row class="over-txt" :gutter="20">
                <el-col :span="6">
                  <div class="width100" @click.stop>
                  <el-radio
                    v-model="checked"
                    :label="parentItem.refundApplyId"
                  >
                    门诊号：
                    <span :title="parentItem.diagTreatActivityId">{{ parentItem.diagTreatActivityId }}</span>
                  </el-radio>
                  </div>
                </el-col>
                <!-- <el-col :span="6"
                  >申请单ID：<span :title="parentItem.refundApplyId">{{ parentItem.refundApplyId }}</span></el-col
                > -->
                
                <el-col :span="4" v-if="parentItem.receiptNum">
                  <template>票据号：<span :title="parentItem.receiptNum">{{parentItem.receiptNum}}</span></template>
                </el-col>
                <el-col :span="parentItem.receiptNum ? 14 : 18">
                  <div style="text-align:right;padding-right:5px">
                    申请：
                    <span class="margin-right10">{{
                      parentItem.applyUserName
                    }}</span>
                    <span>{{ parentItem.applyTime }}</span>
                    <span class="status-box">
                      状态：
                      <span
                        v-codeTransform
                        code="RECHARGE_STATUS"
                        :val="parentItem.recordStatus"
                      ></span>
                    </span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div slot="content">
              <div class="margin-top-10">
                <l-collapse v-model="orderActiveNames2[index]">
                  <l-collapse-item
                    v-for="(
                      orderItem, index2
                    ) in parentItem.outpRefundApplyOrderChargeDetailVOs"
                    :name="index2"
                    :key="index2"
                    @click.native="setRefundData(orderItem)"
                  >
                    <!-- 医嘱明细表头 -->
                    <div class="width100" slot="title">
                      <el-row class="row-h">
                        <el-col :span="5">{{ orderItem.orderName }}</el-col>
                        <el-col
                          :span="6"
                          v-if="['1', '4'].includes(orderItem.orderSource)"
                        >
                          <span class="source-tit">{{
                            orderSourceShow[orderItem.orderSource]
                          }}</span>
                          {{ orderItem.orderBillNum }}
                        </el-col>
                        <el-col :span="6" v-else></el-col>
                        <el-col :span="4"
                          >收费数量：{{ orderItem.orderQuantity }}项</el-col
                        >
                        <el-col :span="4"
                          >退费总金额：{{
                            formatNumber(orderItem.refundOrderMoney)
                          }}元</el-col
                        >
                      </el-row>
                    </div>
                    <!-- 收费项目明细表格 -->
                    <div slot="content">
                      <el-table
                        :data="orderItem.refundApplyDetailNewPOs"
                        v-show="orderItem.refundApplyDetailNewPOs.length > 0"
                        border
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="chargeItemName"
                          show-overflow-tooltip
                          label="项目名称"
                          header-align="center"
                          min-width="150"
                        ></el-table-column>
                        <el-table-column
                          prop="spec"
                          show-overflow-tooltip
                          label="规格"
                          header-align="center"
                          min-width="120"
                        ></el-table-column>
                        <el-table-column
                          prop="chargePrice"
                          label="单价"
                          header-align="center"
                          align="right"
                          show-overflow-tooltip
                          min-width="70"
                        >
                          <template slot-scope="scope">{{
                            formatNumber(scope.row.chargePrice, 4)
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          prop="chargeQuantity"
                          label="收费数量"
                          header-align="center"
                          align="right"
                          show-overflow-tooltip
                          min-width="80"
                        >
                          <template slot-scope="scope">
                            <span>
                              {{ scope.row.chargeQuantity }}
                              <span
                                v-if="orderItem.orderSource === '1'"
                                :val="scope.row.chargeUnit"
                                code="DrugUnit"
                                v-codeTransform
                              ></span>
                              <span v-else>{{ scope.row.chargeUnit }}</span>
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="totalMoney"
                          label="总金额"
                          header-align="center"
                          align="right"
                          show-overflow-tooltip
                          min-width="70"
                        >
                          <template slot-scope="scope">{{
                            formatNumber(scope.row.totalMoney)
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          prop="refundQuantity"
                          label="申请数量"
                          header-align="center"
                          align="right"
                          show-overflow-tooltip
                          min-width="80"
                        >
                          <template slot-scope="scope">
                            <span>
                              {{ scope.row.refundQuantity }}
                              <span
                                v-if="orderItem.orderSource === '1'"
                                :val="scope.row.chargeUnit"
                                code="DrugUnit"
                                v-codeTransform
                              ></span>
                              <span v-else>{{ scope.row.chargeUnit }}</span>
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="actualRefundQuantity"
                          label="药房实退数量"
                          header-align="center"
                          align="right"
                          show-overflow-tooltip
                          min-width="120"
                        >
                          <template slot-scope="scope">
                            <span
                              v-if="
                                typeof scope.row.actualRefundQuantity ===
                                'number'
                              "
                            >
                              {{ scope.row.actualRefundQuantity }}
                              <span
                                v-if="orderItem.orderSource === '1'"
                                :val="scope.row.chargeUnit"
                                code="DrugUnit"
                                v-codeTransform
                              ></span>
                              <span v-else>{{ scope.row.chargeUnit }}</span>
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="totalMoney"
                          label="退费金额"
                          header-align="center"
                          align="right"
                          show-overflow-tooltip
                          min-width="100"
                        >
                          <template slot-scope="scope">{{
                            formatNumber(scope.row.actualRefundMoney)
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          prop="address"
                          label="备注"
                          header-align="center"
                          show-overflow-tooltip
                          min-width="100"
                        ></el-table-column>
                      </el-table>
                    </div>
                  </l-collapse-item>
                </l-collapse>
              </div>
            </div>
          </l-collapse-item>
        </l-collapse>
        <div class="page align-right">
          <el-pagination
            background
            @size-change="applyedChangeSize"
            @current-change="applyedChangePage"
            :current-page="applyedPageParams.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="applyedPageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="applyedPageParams.total"
          ></el-pagination>
        </div>
        <div class="bottom-cons">
          <el-button
            type="primary"
            @click="returnRefund"
            :disabled="!(currentRadio.recordStatus == '0'||currentRadio.recordStatus == '1'||currentRadio.recordStatus == '2')"
            class="float-right"
            >撤销申请</el-button
          >
          <el-button
            type="primary"
            @click="submitRefund"
            :disabled="!(currentRadio.recordStatus == '1'||currentRadio.recordStatus == '3')"
            class="float-right isRefundButton"
            
            >确认退费</el-button
          >
          <!-- v-hasButton="['cw_001']" -->
        </div>
      </div>
    </div>
    <!-- <el-dialog title="退费结算" :visible.sync="returnVis">
      <ReturnPreDialog
        v-if="returnVis"
        :refundApplyData="checked"
        @close="returnClose"
      />
    </el-dialog> -->
    <ReturnPreDialog
      title="退费结算"
      width="1200px"
      :visible.sync="returnVis"
      v-if="returnVis"
      :refundApplyData="currentRadio.tradeId"
      @close="returnClose"
    ></ReturnPreDialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { blukToOutfit } from "@/utils/drugManagement";
import mainApi from "@/api/cis/settleAccount/index.js";
import service from "@/api/appointment/retreat";
import ReturnPreDialog from "./returnPreDialogNew";

export default {
  name: "returnDetails",
  components: { ReturnPreDialog },
  props: {
    sendData: {
      type: Object,
    },
  },
  data() {
    return {
      isRefundButton: false,
      activeName: "first",
      activeNames: "",
      activeNamesEd2: "",
      tableParamsTwo: [
        {
          label: "执行状态",
          prop: "executeQuantity",
          width: "100",
          align: "left",
        },
        {
          label: "项目类型",
          prop: "orderType",
          width: "100",
          align: "left",
        },
        {
          label: "项目名称",
          prop: "itemName",
          width: "200",
          align: "left",
        },
        {
          label: "规格",
          prop: "spec",
          width: "100",
          align: "left",
        },
        {
          label: "单价",
          prop: "chargePrice",
          width: "80",
          align: "left",
        },
        {
          label: "单位",
          prop: "chargeUnit",
          width: "80",
          align: "left",
        },
        {
          label: "收费数量",
          prop: "division",
          width: "100",
          align: "left",
        },
        {
          label: "申请数量",
          prop: "refundQuantity",
          width: "100",
          align: "left",
        },
        {
          label: "药房实退数量",
          prop: "actualQuantity",
          width: "120",
          align: "left",
        },
        {
          label: "金额",
          prop: "totalMoney",
          width: "100",
          align: "right",
        },
        {
          label: "申请状态",
          prop: "applyRecordStatus",
          width: "100",
          align: "center",
        },
      ],
      // 医嘱来源返显
      orderSourceShow: {
        1: "处方号：",
        2: "手工划价：",
        4: "电子申请单号：",
      },
      nameShow: {
        1: "药品",
        5: "挂号",
      },
      // tableData
      tableData: [],
      // 退费原因
      remarkOptions: [
        {
          value: "1",
          label: "已有药",
        },
        {
          value: "99",
          label: "其他",
        },
      ],
      refundReasonCode: "6",
      refundReason: "",
      listLoad: false,
      tableDataTwo: [],
      appliedList: [],
      groupApply: [],
      // 已申请表头
      collapseTableColumn: [
        {
          label: "执行状态",
          prop: "executeQuantity",
          width: "100",
          align: "left",
        },
        {
          label: "项目类型",
          prop: "orderType",
          width: "100",
          align: "left",
        },
        {
          label: "项目名称",
          prop: "chargeItemName",
          width: "200",
          align: "left",
        },
        {
          label: "规格",
          prop: "spec",
          width: "100",
          align: "left",
        },
        {
          label: "单价（元）",
          prop: "chargePrice",
          width: "90",
          align: "right",
        },
        {
          label: "收费数量",
          prop: "chargeQuantity",
          width: "100",
          align: "right",
        },
        {
          label: "申请数量",
          prop: "refundQuantity",
          width: "100",
          align: "right",
        },
        {
          label: "药房实退数量",
          prop: "actualQuantity",
          width: "120",
          align: "right",
        },
        {
          label: "金额（元）",
          prop: "totalMoney",
          width: "100",
          align: "right",
        },
        {
          label: "申请状态",
          prop: "applyRecordStatus",
          width: "100",
          align: "center",
        },
      ],
      // 选中的申请单
      checked: "",
      returnVis: false,
      activeNames2: [],

      // 可申请数据结合
      tradeDetailList: [],
      // 医嘱明细折叠面板
      orderActiveNames: {},
      orderActiveNames2: {},
      // 可申请交易选中
      applyChecked: "",
      // 可申请分页
      applyPageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      // 已申请分页
      applyedPageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      currentRadio: {},//当前选中radio
    };
  },
  watch: {
    sendData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.orderActiveNames = {};
        this.orderActiveNames2 = {};
        this.activeNames2 = "";
        this.activeNamesEd2 = "";
        if (val && val.patientId) {
          this.getTradeDetailListByPatient();
          this.getAppled();
        } else {
          this.tradeDetailList = [];
          this.appliedList = [];
        }
      }
    },
    //zhengyawen
    "sendData.recordStatus": {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(()=>{
          this.isRefundButton = document.getElementsByClassName("isRefundButton").length > 0 ? true : false;
          console.log("this.isRefundButton:", this.isRefundButton);
        })
      }
    },
    applyChecked: {
      handler(val) {
        // 1.清空所有收费项目的选中状态
        this.tradeDetailList.forEach((item1) => {
          item1.outpOrderChargeDetailInfoVOs.forEach((item2) => {
            item2.checked = false;
            if (
              item2.outpChargeDetailNewVOS &&
              item2.outpChargeDetailNewVOS.length
            ) {
              item2.outpChargeDetailNewVOS.forEach((item3) => {
                item3.checked = false;
              });
            }
          });
        });
        // 2.当前选中条目下所有项目默认选中
        console.log(
          this.tradeDetailList.filter((item) => item.tradeId === val)
        );
        this.tradeDetailList.forEach((item) => {
          if (item.tradeId === val) {
            item.outpOrderChargeDetailInfoVOs.forEach((item2) => {
              item2.checked = true;
              if (
                item2.outpChargeDetailNewVOS &&
                item2.outpChargeDetailNewVOS.length
              ) {
                item2.outpChargeDetailNewVOS.forEach((item3) => {
                  item3.checked = true;
                });
              }
            });
          }
        });
        this.$forceUpdate();
        // this.tradeDetailList
        //   .filter(item => item.tradeId === val)[0]
        //   .outpOrderChargeDetailInfoVOs.forEach(item => {

        //     item.checked = true;
        //     if (
        //       item.outpChargeDetailNewVOS &&
        //       item.outpChargeDetailNewVOS.length
        //     ) {
        //       item.outpChargeDetailNewVOS.forEach(item2 => {
        //         item2.checked = true;
        //       });
        //     }
        //   });
      },
    },
    checked:{
      handler(val){
        for(let i in this.appliedList){
          if(this.appliedList[i].refundApplyId === val){
            this.currentRadio = this.appliedList[i];
            return;
          }
        }
      }
    }
  },
  methods: {
    clickTitle0(tradeItem) {
      if(this.applyChecked != tradeItem.tradeId) {
        this.applyChecked = tradeItem.tradeId;
      } else {
        this.applyChecked = "";
      }
    },
    clickRadio(tradeItem, e) {
      if (e.target.tagName !== "INPUT") {
        return;
      }
      if (this.applyChecked !== "") {
        this.applyChecked = "";
      } else {
        this.applyChecked = tradeItem.tradeId;
      }
    },
    clickTitle1(parentItem) {
      if(this.checked != parentItem.refundApplyId) {
        this.checked = parentItem.refundApplyId;
      }
    },
    clickCkildTitle(orderItem, tradeItem, index, index2) {
      if(this.applyChecked !== tradeItem.tradeId) {return;}
      this.$forceUpdate();
      this.$set(orderItem, "checked", !orderItem.checked);
      this.orderChange(orderItem.checked,orderItem.orderChargeDetailId,index,index2);
    },
    ...mapActions({
      setChargeData: "cis/setChargeData",
    }),
    
    // 金额格式化，千位分割，小数点2位
    formatNumber(a, num = 2) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 收费项checkbox
    orderChange(e, id, index, index2) {
      this.$forceUpdate();
      // 如果收费项是药品挂号，收费项明细的选中效果跟收费项选中效果一样
      const item = this.tradeDetailList[index].outpOrderChargeDetailInfoVOs[
        index2
      ];
      if (item.orderSource === "4" || item.orderSource === "2") {
        return;
      }
      const list = item.outpChargeDetailNewVOS.map((it) => {
        return {
          ...it,
          checked: e,
        };
      });
      this.$set(
        this.tradeDetailList[index].outpOrderChargeDetailInfoVOs,
        index2,
        {
          ...this.tradeDetailList[index].outpOrderChargeDetailInfoVOs[index2],
          outpChargeDetailNewVOS: list,
        }
      );
    },
    orderItemChange(e, id, index, index2) {
      // 如果收费项明细全部选中则收费项被勾选，反之亦然
      const list = this.tradeDetailList[index].outpOrderChargeDetailInfoVOs[
        index2
      ].outpChargeDetailNewVOS;
      const checkedList = list.filter((item) => item.checked);
      let flag = false;
      if (checkedList.length !== 0 && checkedList.length === list.length) {
        flag = true;
      }
      this.$set(
        this.tradeDetailList[index].outpOrderChargeDetailInfoVOs,
        index2,
        {
          ...this.tradeDetailList[index].outpOrderChargeDetailInfoVOs[index2],
          checked: flag,
        }
      );
    },
    // 确认申请
    openSubmitCharge() {
      let list = [];
      const item = this.tradeDetailList.find(
        (it) => it.tradeId === this.applyChecked
      );
      if (!item) {
        this.$message.warning("请选择要申请的交易!");
        return;
      }
      item.outpOrderChargeDetailInfoVOs.forEach((item) => {
        /**
         * 不可拆分
         */
        if (item.partRefundFlag === "0") {
          /**
           * 被选中，申请数量大于0不小于收费数量
           */
          if (
            item.checked &&
            item.refundOrderQuantity > 0 &&
            item.refundOrderQuantity <= item.orderQuantity
          ) {
            // 不可拆分 退费医嘱数量（编辑） * 医嘱项目数量（费用明细里有返回） = 费用明细退费数量
            const itemList = item.outpChargeDetailNewVOS.map((it) => ({
              ...it,
              refundQuantity:
                it.orderChargeItemQuantity * item.refundOrderQuantity,
            }));
            list.push({
              ...item,
              refundApplyDetailNewPOs: itemList,
            });
          }
        } else {
          // 可拆分
          const itemList = item.outpChargeDetailNewVOS.filter(
            (it) =>
              it.checked &&
              it.refundQuantity > 0 &&
              it.refundQuantity <= it.chargeQuantity
          );
          if (itemList.length > 0) {
            list.push({
              ...item,
              refundApplyDetailNewPOs: itemList,
            });
          }
        }
      });
      if (list.length === 0) {
        this.$message.warning("选择退费项目并填写正确的申请数量");
        return;
      }
      /* if (!this.refundReasonCode) {
        this.$message.warning("请选择退费原因");
        return;
      } */
      if (this.refundReasonCode === "99" && this.refundReason === "") {
        this.$message.warning("请填写其他退费原因");
        return;
      }
      let reason = {};
      if (this.refundReasonCode === "99") {
        reason.refundReason = this.refundReason;
      } else {
        reason.refundReasonCode = this.refundReasonCode;
      }
      const params = {
        ...reason,
        tradeId: this.applyChecked,
        patientId: this.sendData.patientId,
        outpRefundApplyOrderChargeDetailVOs: list,
      };
      this.$showLoading();
      mainApi
        .applyRefundCharge(params)
        .then((res) => {
          if (res.code === 1) {
            let a = this.applyChecked;
            this.applyChecked = "";
            this.refundReasonCode = "6";
            this.refundReason = "";
            this.getTradeDetailListByPatient();
            this.getAppled();
            this.$message.success(res.msg || "退费申请成功");
            //zhengyawen  待申请的交易id匹配的已申请的申请id可能有多个
            // this.checked = a;
            this.currentRadio.tradeId = a;
            if(this.isRefundButton) {
              this.returnVis = true;
            }
          } else {
            this.$message.error(res.msg || "退费申请失败");
          }
          this.$hideLoading();
        })
        .catch((err) => {
          this.$hideLoading();
          this.$message.error(err.msg || "退费申请失败");
        });
    },
    // 单位计算
    division(a, b) {
      if (!b || b == 0) {
        return a;
      }
      return a / b;
    },
    // 查询已申请
    getAppled() {
      if (!this.sendData.patientId) {
        this.$message.warning("请选择一个患者!");
        return;
      }
      let allAlPrice = 0;
      this.checked = "";
      this.listLoad = true;
      this.activeNamesEd2 = "";
      this.orderActiveNames2 = {};
      this.appliedList = [];
      this.currentRadio = {};
      service
        .getApplyListByPage({
          ...this.applyedPageParams,
          patientId: this.sendData.patientId,
          diagStartDate:this.sendData.date[0]+" 00:00:00",
          diagEndDate:this.sendData.date[1]+" 23:59:59"
        })
        .then((res) => {
          if (res.code === 1) {
            this.applyedPageParams.total = res.pageParams.total;
            this.appliedList = res.data;
            this.activeNamesEd2 = [];
            this.orderActiveNames2 = [];
            this.appliedList.forEach((item, index) => {
              this.activeNamesEd2.push(index);
              this.orderActiveNames2.push([]);
              item.outpOrderChargeDetailInfoVOs &&
                item.outpOrderChargeDetailInfoVOs.forEach((item2, index2) => {
                  allAlPrice += item2.totalMoney;
                  if (item2.pharmacyExecFlag == "1") {
                    this.orderActiveNames2[index].push(index2);
                  }
                });
            });
            this.$emit("allAlPrice", allAlPrice);
          } else {
            this.$message.error(res.msg || "获取已申请退费明细失败!");
          }
          this.listLoad = false;
        })
        .catch((err) => {
          this.listLoad = false;
          this.$message.error(err.msg || "获取已申请退费明细失败!");
        });
    },
    submitRefund() {
      const item = this.appliedList.find(
        (item) => item.refundApplyId === this.checked && item.recordStatus !== "9"
      );
      if (item.recordStatus === "1" || item.recordStatus === "3" && this.isRefundButton) {
        this.returnVis = true;
      } else {
        this.$message.warning("请选择可以退费的申请单!");
      }
    },
    //撤销退费
    async returnRefund() {
      this.$confirm("确认撤销退费申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const item = this.appliedList.find(
          (item) =>
            item.refundApplyId === this.checked &&
            (item.recordStatus === "0" ||
              item.recordStatus === "1" ||
              item.recordStatus === "2")
        );
        if (
          item.recordStatus === "0" ||
          item.recordStatus === "1" ||
          item.recordStatus === "2"
        ) {
          try {
            let res = await mainApi.cancalRefundApply({
              refundApplyId: item.refundApplyId,
            });
            if (res.code === 1) {
              this.$message.success("撤销退费成功!");
              this.getTradeDetailListByPatient();
              this.getAppled();
            } else {
              this.$message.error(res.msg || "撤销退费失败!");
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          this.$message.warning("请选择可以退费的申请单!");
        }
      });
    },
    returnClose(val) {
      if (val && val.refresh) {
        this.getAppled();
      }
      this.returnVis = false;
      this.getTradeDetailListByPatient();
    },
    setRefundData(data) {
      this.setChargeData(data);
    },
    // 查询可申请
    async getTradeDetailListByPatient() {
      if (!this.sendData.patientId) {
        this.$message.warning("请选择一个患者!");
        return;
      }
      try {
        let allWaitPrice = 0;
        this.applyChecked = "";
        this.listLoad = true;
        this.activeNames2 = "";
        this.orderActiveNames = {};
        this.tradeDetailList = [];
        let res = await mainApi.getTradeDetailNewInfo({
          ...this.applyPageParams,
          patientId: this.sendData.patientId,
          diagStartDate:this.sendData.date[0]+" 00:00:00",
          diagEndDate:this.sendData.date[1]+" 23:59:59"
        });
        if (res.code === 1) {
          this.applyPageParams.total = res.pageParams.total;
          const list = res.data.map((item) => {
            const childList = item.outpOrderChargeDetailInfoVOs.map((ele) => {
              const itemList = ele.outpChargeDetailNewVOS.map((it) => {
                let newItemPre = {};
                // 如果不是处方，设置退费数量为收费数量
                if (ele.orderSource === "1") {
                  newItemPre.refundQuantity = 0;
                } else {
                  newItemPre.refundQuantity = it.chargeQuantity;
                }
                return {
                  ...it,
                  ...newItemPre,
                  orderSource: item.orderSource,
                };
              });
              let newPre = {};
              // 如果是手工划价或者电子申请单，医嘱退费数量为0
              if (ele.orderSource === "4" || ele.orderSource === "2") {
                newPre.refundOrderQuantity = 0;
              }
              return {
                ...ele,
                ...newPre,
                checked: false,
                outpChargeDetailNewVOS: itemList,
              };
            });
            return {
              ...item,
              outpOrderChargeDetailInfoVOs: childList,
            };
          });

          this.activeNames2 = [];
          this.orderActiveNames = [];
          list.forEach((item, index) => {
            this.activeNames2.push(index);
            this.orderActiveNames.push([]);
            item.outpOrderChargeDetailInfoVOs &&
              item.outpOrderChargeDetailInfoVOs.forEach((item2, index2) => {
                if (item2.pharmacyExecFlag == "1") {
                  this.orderActiveNames[index].push(index2);
                }
              });
          });
          list.forEach((item1) => {
            item1.outpOrderChargeDetailInfoVOs.forEach((item2) => {
              item2.checked = false;
              item2.refundOrderQuantity = item2.orderQuantity;
              allWaitPrice += item2.totalMoney;
              item2.outpChargeDetailNewVOS.forEach((item3) => {
                item3.checked = false;
                item3.refundQuantity = item3.chargeQuantity;
              });
            });
          });
          this.tradeDetailList = list;
          this.$emit("allWaitPrice", allWaitPrice);
        }
        this.listLoad = false;
      } catch (error) {
        this.listLoad = false;
      }
    },
    applyChangeSize(val) {
      this.applyPageParams.pageSize = val;
      this.getTradeDetailListByPatient();
    },
    applyChangePage(val) {
      this.applyPageParams.pageNo = val;
      this.getTradeDetailListByPatient();
    },
    applyedChangeSize(val) {
      this.applyedPageParams.pageSize = val;
      this.getAppled();
    },
    applyedChangePage(val) {
      this.applyedPageParams.pageNo = val;
      this.getAppled();
    },
    qtyValidate(val, index, idx) {
      const reg = /^\d+(\.\d{0,2})?$/;
      if (!reg.test(val)) {
        this.$message.error(
          "请输入大于0小于等于收费数量的数字，小数点后不超过两位!"
        );
        this.tradeDetailList[index].outpOrderChargeDetailInfoVOs[
          idx
        ].refundOrderQuantity = "";
      }
    },
    refQtyValidate(val, index, idx, i) {
      const reg = /^\d+(\.\d{0,2})?$/;
      if (!reg.test(val)) {
        this.$message.error(
          "请输入大于0小于等于收费数量的数字，小数点后不超过两位!"
        );
        this.tradeDetailList[index].outpOrderChargeDetailInfoVOs[
          idx
        ].outpChargeDetailNewVOS[i].refundQuantity = "";
      }
    },
    tabHandler(e) {
      this.getTradeDetailListByPatient();
      this.getAppled();
      this.$emit("activeIndex", e.index);
    },
  }
};
</script>
<style lang="scss" scoped>
.outpcharge-main {
  background: #fff;
  padding: 10px 20px 0;
  /deep/.el-radio__label {
    color: #2e323a;
    font-weight: 700;
  }
  /deep/.el-checkbox__label {
    color: #2e323a;
    font-weight: 700;
  }
  /deep/.el-radio__input.is-checked + .el-radio__label {
    color: #2B4583;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #2B4583;
  }
  /deep/ .el-tabs__content {
    // height: calc(100% - 30px);
    height: 1%00;
    padding-top: 10px;
  }
  .charge-box {
    height: calc(100% - 58px);
    overflow-y: auto;
  }
  .row-h-h {
    /deep/ .el-checkbox {
      width: 100%;
    }
    /deep/ .el-checkbox__input {
      vertical-align: inherit;
    }
    /deep/ .el-checkbox__label {
      width: calc(100% - 35px);
      display: inline-block;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      cursor: pointer;
    }
    /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #767779;
    }
  }
}
.special-color {
  color: $l-color-primary;
}
.receipt-text {
  color: $l-color-primary;
}
.receipt-amount {
  font-weight: 700;
}
.table-title {
  margin: 20px 0 10px;
  font-weight: 700;
}
.first-title {
  margin-top: 0px;
}
.charge-bottom {
  padding: 20px;
  text-align: right;
  background: #fff;
  border-top: 1px solid $l-color-border-3;
  border-radius: 0 0 4px 4px;
  /deep/ .el-col {
    height: 38px;
  }
}
.charge-top {
  line-height: 32px;
  font-size: 14px;
  padding: 5px 10px;
  background-color: $l-color-primary1;
  color: #fff;
  /deep/ .el-checkbox__inner {
    border-color: #fff;
  }
  /deep/ .el-checkbox__label {
    color: #fff;
  }
}
.price-amt {
  text-align: right;
  line-height: 40px;
}
.margin-top-20 {
  margin-top: 20px;
}
.no-wrap {
  white-space: nowrap;
}
.radio-style {
  border-color: #dcdfe6;
}
.over-txt {
  padding-left: 10px;
  .el-col,
  .el-radio {
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
  }
  .el-radio {
    width: 100%;
  }
}
.align-center {
  text-align: center;
}
.align-right {
  text-align: right;
}
.cols {
  height: calc(100% - 134px);
  overflow-y: auto;

  /deep/ .collapse-transition {
    -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
    transition: 0s height, 0s padding-top, 0s padding-bottom;
  }

  /deep/ .horizontal-collapse-transition {
    -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
    transition: 0s width, 0s padding-left, 0s padding-right;
  }

  /deep/
    .horizontal-collapse-transition
    .el-submenu__title
    .el-submenu__icon-arrow {
    -webkit-transition: 0s;
    transition: 0s;
    opacity: 0;
  }
}
.page {
  text-align: right;
  padding: 20px 0;
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
.no-data {
  position: absolute;
  top: 0;
  width: 100%;
  line-height: 30px;
  text-align: center;
}
.margin-top-10 {
  margin-top: 10px;
}
.status-box {
  margin-left: 10px;
  // width: 160px;
  display: inline-block;
  text-align: left;
}
.margin-right10 {
  margin-right: 10px;
}
.row-h {
  /deep/ .el-col {
    height: 40px;
  }
}
.source-tit {
  display: inline-block;
  width: 115px;
}
.bottom-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 63px;
  border-top: 1px solid #e4e4e4;
}
.bottom-cons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 63px;
  border-top: 1px solid #e4e4e4;
}
/deep/ .el-collapse.cols {
  overflow-x: hidden;
}
</style>
