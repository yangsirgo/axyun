<template>
  <div class="width100 height100" ref="page" v-loading="listLoad">
    <div class="outpcharge-main width100 height-button-main">
      <el-tabs class="height100" v-model="activeName">
        <el-tab-pane label="可申请" name="first">
          <!-- 交易信息表头 -->
          <div class="main-thead">
            <el-row class="over-txt align-center">
              <el-col :span="2">
                <span title="患者姓名">患者姓名</span>
              </el-col>
              <el-col :span="3">
                <span title="患者编号">患者编号</span>
              </el-col>
              <el-col :span="3">
                <span title="收费时间">收费时间</span>
              </el-col>
              <el-col :span="2">
                <span title="开单医生">开单医生</span>
              </el-col>
              <el-col :span="2">
                <span title="开单科室">开单科室</span>
              </el-col>
              <!-- <el-col :span="2">
                <span title="申请人">申请人</span>
              </el-col>
              <el-col :span="3">
                <span title="申请时间">申请时间</span>
              </el-col>
              <el-col :span="2">
                <span title="审核人">审核人</span>
              </el-col>
              <el-col :span="3">
                <span title="审核时间">审核时间</span>
              </el-col>-->
              <!-- <el-col :span="2">
                <span title="状态">状态</span>
              </el-col>-->
            </el-row>
          </div>
          <p class="no-data" v-if="tradeDetailList.length === 0">暂无数据</p>
          <el-collapse v-model="activeNames2" class="cols" v-loading="rightLoading">
            <l-collapse-item
              v-for="(tradeItem, index) in tradeDetailList"
              :name="index"
              :key="index"
            >
              <!-- 交易信息列-->
              <div class="width100" slot="title">
                <el-row class="over-txt align-center">
                  <el-col :span="2">
                    <el-radio v-model="checked" :label="tradeItem.tradeId">
                      <span :title="tradeItem.patientName">{{ tradeItem.patientName }}</span>
                    </el-radio>
                  </el-col>
                  <el-col :span="3">
                    <span :title="tradeItem.patientCode">{{ tradeItem.patientCode }}</span>
                  </el-col>
                  <el-col :span="3">
                    <span :title="tradeItem.chargeTime">{{ tradeItem.chargeTime }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span :title="tradeItem.doctorName">{{ tradeItem.doctorName }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span :title="tradeItem.ouptDeptName">{{ tradeItem.ouptDeptName }}</span>
                  </el-col>
                  <!-- <el-col :span="2">
                    <span :title="tradeItem.applyUserName">{{ tradeItem.applyUserName }}</span>
                  </el-col>
                  <el-col :span="3">
                    <span :title="tradeItem.chargeTime">{{ tradeItem.chargeTime }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span :title="tradeItem.checkUserName">{{ tradeItem.checkUserName }}</span>
                  </el-col>
                  <el-col :span="3">
                    <span :title="tradeItem.checkTime">{{ tradeItem.checkTime }}</span>
                  </el-col>-->
                  <!-- <el-col :span="2">
                    <span v-codeTransform code="RECHARGE_STATUS" :val="tradeItem.recordStatus"></span>
                  </el-col>-->
                </el-row>
              </div>
              <!-- 收费医嘱明细 循环 -->
              <div slot="content">
                <div class="margin-top-10">
                  <el-collapse v-model="orderActiveNames2[index]" v-loading="rightLoading">
                    <l-collapse-item
                      v-for="(orderItem, index2) in tradeItem.outpOrderChargeDetailInfoVOs"
                      :name="index2"
                      :key="index2"
                    >
                      <!-- 医嘱明细表头 -->
                      <div class="width100" slot="title">
                        <el-row>
                          <el-col :span="5">
                            <el-checkbox
                              v-model="orderItem.checked"
                              @change="orderChange($event,orderItem.orderChargeDetailId,index)"
                            >
                              <span>{{orderItem.orderName}}</span>
                            </el-checkbox>
                          </el-col>
                          <el-col :span="3">收费数量：{{ orderItem.orderQuantity }}项</el-col>
                          <el-col
                            :span="5"
                            v-if="orderItem.orderSource === '4' || orderItem.orderSource === '2'"
                          >
                            申请数量：
                            <el-input-number
                              style="width:100px;"
                              v-model="orderItem.refundOrderQuantity"
                              controls-position="right"
                              :min="0"
                              :max="orderItem.orderQuantity"
                              :step="1"
                            ></el-input-number>&nbsp;&nbsp;项
                          </el-col>
                          <el-col :span="3">总金额：{{ formatNumber(orderItem.totalMoney) }}元</el-col>
                        </el-row>
                      </div>
                      <!-- 收费项目明细表格 -->
                      <div slot="content">
                        <el-table
                          :data="orderItem.outpChargeDetailNewVOS"
                          border
                          style="width: 100%;"
                        >
                          <el-table-column width="45px">
                            <template slot-scope="scope">
                              <el-checkbox
                                v-model="scope.row.checked"
                                :disabled="scope.row.orderSource === '4' || scope.row.orderSource === '2' "
                                @change="orderItemChange($event,orderItem.orderChargeDetailId,index)"
                              ></el-checkbox>
                            </template>
                          </el-table-column>
                          <!-- <el-table-column prop="execStatus" label="执行状态" header-align="center">
                            <template slot-scope="scope">{{ scope.row[item.prop] > 0 ? "已执行" : "未执行" }}</template>
                          </el-table-column>-->
                          <el-table-column prop="chargeItemName" label="项目名称" header-align="center"></el-table-column>
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
                            <template slot-scope="scope">{{ formatNumber(scope.row.chargePrice) }}</template>
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
                                <span v-else>{{scope.row.chargeUnit }}</span>
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
                              <span class="no-wrap" v-if="scope.row.orderSource === '1'">
                                <el-input-number
                                  style="width:100px;"
                                  v-model="scope.row.refundQuantity"
                                  controls-position="right"
                                  :min="0"
                                  :max="scope.row.chargeQuantity"
                                  :step="1"
                                ></el-input-number>
                                <span
                                  v-if="orderItem.orderSource === '1'"
                                  :val="scope.row.chargeUnit"
                                  code="DrugUnit"
                                  v-codeTransform
                                ></span>
                                <span v-else>{{scope.row.chargeUnit }}</span>
                              </span>
                              <span v-else>
                                {{ scope.row.refundQuantity }}
                                <span
                                  v-if="orderItem.orderSource === '1'"
                                  :val="scope.row.chargeUnit"
                                  code="DrugUnit"
                                  v-codeTransform
                                ></span>
                                <span v-else>{{scope.row.chargeUnit }}</span>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            show-overflow-tooltip
                            width="100"
                            prop="totalMoney"
                            label="总金额"
                            header-align="center"
                            align="right"
                          >
                            <template slot-scope="scope">{{ formatNumber(scope.row.chargePrice) }}</template>
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
                  </el-collapse>
                </div>
              </div>
            </l-collapse-item>
          </el-collapse>
          <!-- 退费原因 -->
          <el-row class="margin-top-20" :gutter="20">
            <el-col :span="6">
              <LFormtTitle label="退费原因" required>
                <el-select v-model="refundReasonCode" placeholder="请选择">
                  <el-option
                    v-for="item in remarkOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <el-input
                v-if="refundReasonCode === '99'"
                v-model="refundReason"
                placeholder="请输入其他原因"
              ></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="已申请" name="second">
          <div class="main-thead">
            <el-row class="over-txt align-center">
              <el-col :span="2">
                <span title="患者姓名">患者姓名</span>
              </el-col>
              <el-col :span="3">
                <span title="患者编号">患者编号</span>
              </el-col>
              <el-col :span="3">
                <span title="收费时间">收费时间</span>
              </el-col>
              <el-col :span="2">
                <span title="开单医生">开单医生</span>
              </el-col>
              <el-col :span="2">
                <span title="开单科室">开单科室</span>
              </el-col>
              <el-col :span="2">
                <span title="申请人">申请人</span>
              </el-col>
              <el-col :span="3">
                <span title="申请时间">申请时间</span>
              </el-col>
              <el-col :span="2">
                <span title="审核人">审核人</span>
              </el-col>
              <el-col :span="3">
                <span title="审核时间">审核时间</span>
              </el-col>
              <el-col :span="2">
                <span title="状态">状态</span>
              </el-col>
            </el-row>
          </div>
          <p class="no-data" v-if="appliedList.length === 0">暂无数据</p>
          <el-collapse v-model="activeNames2" class="cols" v-loading="rightLoading">
            <l-collapse-item v-for="(parentItem, index) in appliedList" :name="index" :key="index">
              <div class="width100" slot="title">
                <el-row class="over-txt align-center">
                  <el-col :span="2">
                    <el-radio v-model="checked" :label="parentItem.refundApplyId">
                      <span :title="parentItem.patientName">{{ parentItem.patientName }}</span>
                    </el-radio>
                  </el-col>
                  <el-col :span="3">
                    <span :title="parentItem.patientCode">{{ parentItem.patientCode }}</span>
                  </el-col>
                  <el-col :span="3">
                    <span :title="parentItem.chargeTime">{{ parentItem.chargeTime }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span :title="parentItem.doctorName">{{ parentItem.doctorName }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span :title="parentItem.ouptDeptName">{{ parentItem.ouptDeptName }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span :title="parentItem.applyUserName">{{ parentItem.applyUserName }}</span>
                  </el-col>
                  <el-col :span="3">
                    <span :title="parentItem.applyTime">{{ parentItem.applyTime }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span :title="parentItem.checkUserName">{{ parentItem.checkUserName }}</span>
                  </el-col>
                  <el-col :span="3">
                    <span :title="parentItem.checkTime">{{ parentItem.checkTime }}</span>
                  </el-col>
                  <el-col :span="2">
                    <span v-codeTransform code="RECHARGE_STATUS" :val="parentItem.recordStatus"></span>
                  </el-col>
                </el-row>
              </div>
              <div slot="content">
                <div
                  class="charge-item"
                  v-for="(item, index) in parentItem.outpRefundApplyOrderChargeDetailVOs"
                  :key="index"
                  @click="setRefundData(item)"
                >
                  <div class="charge-top">
                    <el-row>
                      <el-col :span="6">{{ item.orderName }}</el-col>
                      <el-col :span="4">收费数量：{{ item.orderQuantity }}项</el-col>
                      <el-col :span="4">总金额：{{ formatNumber(item.totalMoney) }}元</el-col>
                    </el-row>
                  </div>
                  <el-table
                    :data="item.refundApplyDetailNewPOs"
                    v-show="item.refundApplyDetailNewPOs.length > 0"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="chargeItemName"
                      show-overflow-tooltip
                      label="项目名称"
                      header-align="center"
                    ></el-table-column>
                    <el-table-column
                      prop="spec"
                      show-overflow-tooltip
                      label="规格"
                      header-align="center"
                      width="200"
                    ></el-table-column>
                    <el-table-column
                      prop="chargePrice"
                      label="单价"
                      header-align="center"
                      align="right"
                      show-overflow-tooltip
                      width="100"
                    >
                      <template slot-scope="scope">{{ formatNumber(scope.row.chargePrice) }}</template>
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
                            v-if="item.orderSource === '1'"
                            :val="scope.row.chargeUnit"
                            code="DrugUnit"
                            v-codeTransform
                          ></span>
                          <span v-else>{{scope.row.chargeUnit }}</span>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="refundQuantity"
                      label="申请数量"
                      header-align="center"
                      align="right"
                      show-overflow-tooltip
                      width="100"
                    >
                      <template slot-scope="scope">
                        <span>
                          {{ scope.row.refundQuantity }}
                          <span
                            v-if="item.orderSource === '1'"
                            :val="scope.row.chargeUnit"
                            code="DrugUnit"
                            v-codeTransform
                          ></span>
                          <span v-else>{{scope.row.chargeUnit }}</span>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="totalMoney"
                      label="总金额"
                      header-align="center"
                      align="right"
                      show-overflow-tooltip
                      width="100"
                    >
                      <template slot-scope="scope">{{ formatNumber(scope.row.totalMoney) }}</template>
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="备注"
                      header-align="center"
                      show-overflow-tooltip
                      width="100"
                    ></el-table-column>
                  </el-table>
                </div>
              </div>
            </l-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="charge-bottom height-button-bottom">
      <el-row>
        <el-button
          v-if="activeName == 'first'"
          type="primary"
          v-hotKey="{ func: 'func_submit' }"
          @click="openSubmitCharge"
        >确认申请</el-button>
        <el-button
          type="primary"
          v-if="activeName == 'second'"
          @click="submitRefund"
          :disabled="checked === ''"
          class="float-right"
        >确认退费</el-button>
      </el-row>
    </div>
    <el-dialog title="退费结算" :visible.sync="returnVis">
      <ReturnPreDialog v-if="returnVis" :refundApplyData="checked" @close="returnClose" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { blukToOutfit } from "@/utils/drugManagement";
import mainApi from "@/api/cis/settleAccount/index.js";
import service from "@/api/appointment/retreat";
import ReturnPreDialog from "./returnPreDialog";

// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};

export default {
  components: { ReturnPreDialog },
  props: {
    sendData: {
      type: Object
    }
  },
  data() {
    return {
      activeName: "first",
      activeNames: "first",
      tableParamsTwo: [
        {
          label: "执行状态",
          prop: "executeQuantity",
          width: "100",
          align: "left"
        },
        {
          label: "项目类型",
          prop: "orderType",
          width: "100",
          align: "left"
        },
        {
          label: "项目名称",
          prop: "itemName",
          width: "200",
          align: "left"
        },
        {
          label: "规格",
          prop: "spec",
          width: "100",
          align: "left"
        },
        {
          label: "单价",
          prop: "chargePrice",
          width: "80",
          align: "left"
        },
        {
          label: "单位",
          prop: "chargeUnit",
          width: "80",
          align: "left"
        },
        {
          label: "收费数量",
          prop: "division",
          width: "100",
          align: "left"
        },
        {
          label: "申请数量",
          prop: "refundQuantity",
          width: "100",
          align: "left"
        },
        {
          label: "实退数量",
          prop: "actualQuantity",
          width: "100",
          align: "left"
        },
        {
          label: "金额",
          prop: "totalMoney",
          width: "100",
          align: "right"
        },
        {
          label: "申请状态",
          prop: "applyRecordStatus",
          width: "100",
          align: "center"
        }
      ],
      // 医嘱来源返显
      orderSourceShow: {
        "1": "处方号：",
        "2": "手工划价：",
        "4": "电子申请单号："
      },
      nameShow: {
        "1": "药品",
        "5": "挂号"
      },
      // tableData
      tableData: [],
      checkList: [],
      // 退费原因
      remarkOptions: [
        {
          value: "1",
          label: "已有药"
        },
        {
          value: "99",
          label: "其他"
        }
      ],
      refundReasonCode: "",
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
          align: "left"
        },
        {
          label: "项目类型",
          prop: "orderType",
          width: "100",
          align: "left"
        },
        {
          label: "项目名称",
          prop: "chargeItemName",
          width: "200",
          align: "left"
        },
        {
          label: "规格",
          prop: "spec",
          width: "100",
          align: "left"
        },
        {
          label: "单价（元）",
          prop: "chargePrice",
          width: "90",
          align: "right"
        },
        // {
        //   label: "单位",
        //   prop: "chargeUnit",
        //   width: "80",
        //   align: "left"
        // },
        {
          label: "收费数量",
          prop: "chargeQuantity",
          width: "100",
          align: "right"
        },
        {
          label: "申请数量",
          prop: "refundQuantity",
          width: "100",
          align: "right"
        },
        {
          label: "实退数量",
          prop: "actualQuantity",
          width: "100",
          align: "right"
        },
        {
          label: "金额（元）",
          prop: "totalMoney",
          width: "100",
          align: "right"
        },
        {
          label: "申请状态",
          prop: "applyRecordStatus",
          width: "100",
          align: "center"
        }
      ],
      // 选中的申请单
      checked: "",
      returnVis: false,
      activeNames2: "",
      rightLoading: false,

      // 可申请数据结合
      tradeDetailList: [],
      // 医嘱明细折叠面板
      orderActiveNames2: {}
    };
  },
  watch: {
    sendData: {
      deep: true,
      immediate: true,
      handler(val) {
        // this.getTradeDetailListByPatient({patientId: val.patientId});
        if (val && val.patientId) {
          this.getTradeDetailListByPatient();
          this.getAppled();
        } else {
          this.tableData = [];
          this.appliedList = [];
        }
      }
    }
  },
  methods: {
    ...mapActions({
      setChargeData: "cis/setChargeData"
    }),
    // 金额格式化，千位分割，小数点2位
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 收费项checkbox
    orderChange(e, id, index) {
      // 如果收费项是药品挂号，收费项明细的选中效果跟收费项选中效果一样
      const item = this.tableData[index];
      if (item.orderSource === "4" || item.orderSource === "2") {
        return;
      }
      if (item.orderChargeDetailId === id) {
        const list = item.outpChargeDetailNewVOS.map(it => {
          return {
            ...it,
            checked: e
          };
        });
        this.$set(this.tableData, index, {
          ...this.tableData[index],
          outpChargeDetailNewVOS: list
        });
      }
    },
    orderItemChange(e, id, index) {
      // 如果收费项明细全部选中则收费项被勾选，反之亦然
      const list = this.tableData[index].outpChargeDetailNewVOS;
      const checkedList = list.filter(item => item.checked);
      let flag = false;
      if (checkedList.length !== 0 && checkedList.length === list.length) {
        flag = true;
      }
      this.$set(this.tableData, index, {
        ...this.tableData[index],
        checked: flag
      });
    },
    // 查询可申请
    getChargeDetailInfo(data) {
      let params = {
        tradeId: data.tradeId
      };
      this.listLoad = true;
      mainApi
        .getOrderChargeDetailInfo(params)
        .then(res => {
          if (res.code === 1) {
            const list = res.data.map(item => {
              const itemList = item.outpChargeDetailNewVOS.map(it => {
                let newItemPre = {};
                if (item.orderSource === "1") {
                  newItemPre.refundQuantity = 0;
                } else {
                  newItemPre.refundQuantity = it.chargeQuantity;
                }
                return {
                  ...it,
                  ...newItemPre,
                  orderSource: item.orderSource
                };
              });
              let newPre = {};
              if (item.orderSource === "4" || item.orderSource === "2") {
                newPre.refundOrderQuantity = 0;
              }
              return {
                ...item,
                ...newPre,
                checked: false,
                outpChargeDetailNewVOS: itemList
              };
            });
            this.tableData = list;
          }
          this.listLoad = false;
        })
        .catch(err => {
          this.listLoad = false;
          this.$message.error(err.msg || "查询收费明细失败");
        });
    },
    // 打开预结算弹窗
    openSubmitCharge() {
      let list = [];
      this.tableData.forEach(item => {
        if (item.orderSource === "4" || item.orderSource === "2") {
          if (
            item.checked &&
            item.refundOrderQuantity > 0 &&
            item.refundOrderQuantity <= item.orderQuantity
          ) {
            list.push({
              ...item,
              refundApplyDetailNewPOs: item.outpChargeDetailNewVOS
            });
          }
        } else {
          const itemList = item.outpChargeDetailNewVOS.filter(
            it =>
              it.checked &&
              it.refundQuantity > 0 &&
              it.refundQuantity <= it.chargeQuantity
          );
          if (itemList.length > 0) {
            list.push({
              ...item,
              refundApplyDetailNewPOs: itemList
            });
          }
        }
      });
      if (list.length === 0) {
        this.$message.warning("选择退费项目并填写正确的申请数量");
        return;
      }
      if (!this.refundReasonCode) {
        this.$message.warning("请选择退费原因");
        return;
      }
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
        tradeId: this.sendData.tradeId,
        patientId: this.sendData.patientId,
        outpRefundApplyOrderChargeDetailVOs: list
      };
      this.$showLoading();
      mainApi
        .applyRefundCharge(params)
        .then(res => {
          if (res.code === 1) {
            this.getChargeDetailInfo(this.sendData);
            this.getAppled();
            this.$message.success(res.msg || "退费申请成功");
          } else {
            this.$message.error(res.msg || "退费申请失败");
          }
          this.$hideLoading();
        })
        .catch(err => {
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
    async getAppled() {
      this.rightLoading = true;
      // 查询已申请
      await service
        .getRefundInfoNew({
          patientId: this.sendData.patientId
        })
        .then(res => {
          if (res.code === 1) {
            this.appliedList = res.data;
          } else {
            this.$message.error(res.msg || "获取已申请退费明细失败!");
          }
          this.rightLoading = false;
        })
        .catch(err => {
          this.rightLoading = false;
          this.$message.error(err.msg || "获取已申请退费明细失败!");
        });
    },
    submitRefund() {
      const item = this.appliedList.find(
        item => item.refundApplyId === this.checked
      );
      if (item.recordStatus !== "1") {
        this.$message.warning("请选择审批成功的申请单!");
        return;
      }
      this.returnVis = true;
    },
    returnClose() {
      this.returnVis = false;
    },
    setRefundData(data) {
      this.setChargeData(data);
    },
    // 查询可退费申请的交易明细
    async getTradeDetailListByPatient() {
      try {
        let res = await mainApi.getTradeDetailNewInfo({
          patientId: this.sendData.patientId,
          pageNo: 1,
          pageSize: 10
        });
        this.tradeDetailList = res.data;
        console.info(res);
      } catch (error) {
        
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.outpcharge-main {
  background: #fff;
  padding: 20px;
  padding-top: 0;
  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }
  .charge-box {
    height: calc(100% - 58px);
    overflow-y: auto;
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
  .el-col {
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.align-center {
  text-align: center;
}
.main-thead {
  padding-left: 55px;
}
.cols {
  height: calc(100% - 40px);
  overflow-y: auto;
}
.no-data {
  line-height: 30px;
  text-align: center;
}
.margin-top-10 {
  margin-top: 10px;
}
</style>
