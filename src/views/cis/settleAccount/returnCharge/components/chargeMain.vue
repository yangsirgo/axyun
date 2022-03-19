<template>
  <div class="height100" ref="page">
    <div class="recharge-main height-button-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="可申请" name="first">
          <el-table
            :data="tableDataTwo"
            border
            stripe
            @selection-change="getRowsIdx"
            class="table-bottom"
            :span-method="doctorObjectSpanMethod"
          >
            <el-table-column type="selection" width="32" align="center"></el-table-column>
            <el-table-column
              v-for="(item, index) in tableParamsTwo"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="left"
              show-overflow-tooltip
              :align="item.align || 'left'"
              :fixed="item.fixed === true"
            >
              <template slot-scope="scope">
                <!--操作部分自定义-->
                <template v-if="item.prop == 'refundQuantity'">
                  <el-input-number
                    style="width: 80px;"
                    size="mini"
                    v-model="scope.row.refundQuantity"
                    controls-position="right"
                    :min="0"
                    :max="scope.row['division']"
                  ></el-input-number>
                  <span
                    v-if="scope.row['unitSaleFlg'] && scope.row['unitSaleFlg'] =='1'"
                    :val="scope.row['chargeUnit']"
                    code="DrugUnit"
                    v-codeTransform
                    class="special-color"
                  ></span>
                  <span
                    v-else-if="scope.row['unitSaleFlg'] && scope.row['unitSaleFlg'] =='0'"
                    :val="scope.row['packUnit']"
                    code="DrugUnit"
                    v-codeTransform
                    class="special-color"
                  ></span>
                  <span v-else class="special-color">{{scope.row['chargeUnit']}}</span>
                </template>

                <!-- 收费数量 （小单位 需要换算）-->
                <template v-else-if="item.prop == 'division' && scope.row['orderSource'] == '1'">
                  <span>{{scope.row["bigUnitNum"]}}</span>
                  <span
                    :val="scope.row['packUnit']"
                    code="DrugUnit"
                    v-codeTransform
                    class="special-color"
                  ></span>
                  <span>{{scope.row["minUnitNum"]}}</span>
                  <span
                    :val="scope.row['chargeUnit']"
                    code="DrugUnit"
                    v-codeTransform
                    class="special-color"
                  ></span>
                </template>
                <template v-else-if="item.prop == 'division' && scope.row['orderSource'] != '1'">
                  <span>{{scope.row["itemQuantity"]}}</span>
                  <span class="special-color">{{scope.row['chargeUnit']}}</span>
                </template>
                <template v-else-if="item.prop == 'executeQuantity'">
                  <!-- 药品 -->
                  <span
                    class="overflow-point font"
                    v-if="scope.row['orderSource'] == '1'"
                  >{{ scope.row[item.prop] > 0 ? "已发药" : "未发药" }}</span>
                  <!-- 挂号 -->
                  <span
                    class="overflow-point font"
                    v-if="scope.row['orderItemCat'] == '85' || scope.row['orderItemCat'] == '86'"
                  >{{ '已预约' }}</span>
                  <!-- 如果是申请单 -->
                  <span
                    class="overflow-point font"
                    v-if="scope.row['orderSource'] == '4'"
                  >{{ scope.row[item.prop] > 0 ? "已执行" : "未执行" }}</span>
                </template>
                <template v-else-if="item.prop == 'applyRecordStatus' && activeName == 'second'">
                  <span :val="scope.row[item.prop]" code="RECHARGE_STATUS" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'applyRecordStatus' && activeName == 'first'">
                  <span class="overflow-point">
                    {{
                    '未申请'
                    }}
                  </span>
                </template>
                <template v-else-if="item.prop == 'totalMoney'">
                  <span class="overflow-point">
                    {{
                    scope.row[item.prop].toFixed(2) || "0.00"
                    }}
                  </span>
                </template>
                <template v-else-if="item.prop == 'chargePrice'">
                  <span class="overflow-point">
                    {{
                    scope.row[item.prop].toFixed(2) || "0.00"
                    }}
                  </span>
                </template>
                <template v-else-if="item.prop == 'orderType'">
                  <span :val="scope.row[item.prop]" code="order_type" v-codeTransform></span>
                </template>
                <template v-else>
                  <span class="overflow-point font">{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <el-row v-if="activeName === 'first'" :gutter="20" class="margin-top-20">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="height:80px;">
              <el-col :span="6">
                <el-form-item prop="refundReason">
                  <LFormtTitle label="退费原因" required>
                    <el-select v-model="ruleForm.refundReason" placeholder="请选择">
                      <el-option
                        v-for="item in remarkOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="已申请" name="second">
          <el-collapse v-model="activeNames">
            <l-collapse-item v-for="(applyItem, $index) in groupApply" :name="$index" :key="$index">
              <el-radio slot="title" v-model="checked" :label="$index">申请时间：{{applyItem.applyTime}}</el-radio>
              <div slot="content">
                <div class="table-wrapper">
                  <el-table
                    header-cell-class-name="headerCls"
                    row-class-name="rowStyleCls"
                    ref="singleTable"
                    :data="applyItem.list"
                    highlight-current-row
                    style="width: 100%"
                    stripe
                    border
                    element-loading-text="加载中..."
                  >
                    <el-table-column
                      v-for="item in collapseTableColumn"
                      :key="item.label"
                      :label="item.label"
                      :prop="item.prop"
                      :align="item.align || 'left'"
                      show-overflow-tooltip
                      header-align="center"
                      :min-width="item.width"
                    >
                      <template slot-scope="scope">
                        <!--操作部分自定义-->
                        <!-- 药品 -->
                        <template v-if="item.prop == 'refundQuantity' && scope.row['orderSource'] != '4'">
                          <!-- 不可拆分 -->
                          <span v-if="scope.row['unitSaleFlg'] && scope.row['unitSaleFlg'] == '0'">{{ scope.row[item.prop] / scope.row['packQuantity']}}</span>
                          <span v-if="scope.row['unitSaleFlg'] && scope.row['unitSaleFlg'] == '0'" :val="scope.row['packUnit']" code="DrugUnit" v-codeTransform></span>
                          <!-- 可拆分 -->
                          <span v-else>{{scope.row[item.prop]}}
                            <span v-if="scope.row['unitSaleFlg']" :val="scope.row['chargeUnit']" code="DrugUnit" v-codeTransform></span>
                          </span>
                        </template>
                        <!-- 电子申请 -->
                        <template v-else-if="item.prop == 'refundQuantity' && scope.row['orderSource'] == '4'">
                          <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                          <span class="overflow-point">{{ scope.row['chargeUnit']}}</span>
                        </template>
                        <!-- 收费数量 （小单位 需要换算）-->
                        <template v-else-if="item.prop == 'division' && scope.row['orderSource'] == '1'">
                          <span>{{scope.row["bigUnitNum"]}}</span>
                          <span
                            :val="scope.row['packUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                          <span>{{scope.row["minUnitNum"]}}</span>
                          <span
                            :val="scope.row['chargeUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                        </template>
                        <template v-else-if="item.prop == 'division' && scope.row['orderSource'] != '1'">
                          <span>{{scope.row["itemQuantity"]}}</span>
                          <span class="special-color">{{scope.row['chargeUnit']}}</span>
                        </template>
                        <!-- 实退数量 （小单位 需要换算）-->
                        <template v-else-if="item.prop == 'actualQuantity' && scope.row['orderSource'] == '1'">
                          <span v-if="scope.row['actualQuantity']">{{scope.row["bigUnitNuma"]}}</span>
                          <span
                            v-if="scope.row['actualQuantity']"
                            :val="scope.row['packUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                          <span v-if="scope.row['actualQuantity']">{{scope.row["minUnitNuma"]}}</span>
                          <span
                            v-if="scope.row['actualQuantity']"
                            :val="scope.row['chargeUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                        </template>
                          <!-- 电子申请不需换算 -->
                        <template v-else-if="item.prop == 'actualQuantity' && scope.row['orderSource'] != '1'">
                          <span v-if="scope.row['actualQuantity']">{{scope.row["actualQuantity"]}}</span>
                          <span v-if="scope.row['actualQuantity']" class="special-color">{{scope.row['chargeUnit']}}</span>
                        </template>
                        <!-- 执行状态 -->
                        <template v-else-if="item.prop == 'executeQuantity'">
                          <!-- 药品 -->
                          <span
                            class="overflow-point"
                            v-if="scope.row['orderSource'] == '1'"
                          >{{ scope.row[item.prop] > 0 ? "已发药" : "未发药" }}</span>
                          <!-- 挂号 -->
                          <span
                            class="overflow-point"
                            v-if="scope.row['orderItemCat'] == '85' || scope.row['orderItemCat'] == '86'"
                          >{{ '已预约' }}</span>
                          <!-- 如果是申请单 -->
                          <span
                            class="overflow-point"
                            v-if="scope.row['orderSource'] == '4'"
                          >{{ scope.row[item.prop] > 0 ? "已执行" : "未执行" }}</span>
                        </template>
                        <template v-else-if="item.prop == 'applyRecordStatus'">
                          <span
                            v-if="scope.row['orderSource'] == '1'"
                            :val="scope.row[item.prop]"
                            code="RECHARGE_STATUS"
                            v-codeTransform
                          ></span>
                          <span
                            v-if="scope.row['orderSource'] == '4'"
                          >{{getStatus(scope.row[item.prop])}}</span>
                        </template>
                        <template v-else-if="item.prop == 'totalMoney'">
                          <span class="overflow-point">
                            {{
                            scope.row[item.prop].toFixed(2) || "0.00"
                            }}
                          </span>
                        </template>
                        <template v-else-if="item.prop == 'chargePrice'">
                          <span class="overflow-point">
                            {{
                            scope.row[item.prop].toFixed(2) || "0.00"
                            }}
                          </span>
                        </template>
                        <template v-else-if="item.prop == 'orderType'">
                          <span :val="scope.row[item.prop]" code="order_type" v-codeTransform></span>
                        </template>
                        <template v-else>
                          <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </l-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="recharge-bottom height-button-bottom">
      <el-button
        type="primary"
        v-if="activeName == 'second'"
        @click="submitRefund"
        class="float-right"
      >确认退费</el-button>
      <el-button
        type="primary"
        v-if="activeName == 'second'"
        @click="callBackApply"
        class="float-right margin-right-10"
      >撤回申请</el-button>
      <div style="display:flex;justify-content: flex-end;align-items: baseline;">
        <div v-if="activeName == 'first'" style="margin-right: 20px;font-size: 20px;font-weight: 600;">退费总金额：200元</div>
        <el-button
          v-hotKey="{ func: 'func_submit' }"
          type="primary"
          v-if="activeName == 'first'"
          @click="apply"
          :disabled="rechargeBtnDisable"
        >确认申请</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import service from "@/api/appointment/retreat";
import appointment from "@/api/appointment/appointment";
import { blukToOutfit } from "@/utils/drugManagement";
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
  data() {
    return {
      //
      activeNames: "first",
      // 按钮可用
      rechargeBtnDisable: true,
      // 默认卡片
      activeName: "first",
      tableParamsTwo: [
        {
          label: "状态",
          prop: "executeQuantity",
          width: "100",
          align: "left"
        },
        {
          label: "医嘱类型",
          prop: "orderType",
          width: "100",
          align: "left"
        },
        {
          label: "医嘱名称",
          prop: "itemName",
          width: "200",
          align: "left"
        },
        {
          label: "组",
          prop: "group",
          width: "50",
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
          label: "总收费数量",
          prop: "division",
          width: "100",
          align: "left"
        },
        {
          label: "可退数量",
          prop: "division",
          width: "100",
          align: "left"
        },
        {
          label: "申请退费数量",
          prop: "refundQuantity",
          width: "130",
          align: "left"
        },
        {
          label: "退费金额",
          prop: "totalMoney",
          width: "100",
          align: "right"
        },
        {
          label: "发药药房",
          prop: "totalMoney",
          width: "100",
          align: "right"
        },
        {
          label: "执行科室",
          prop: "totalMoney",
          width: "100",
          align: "right"
        }
      ],
      remarkOptions: [
        {
          value: "1",
          label: "已有药"
        }
      ],
      rechargeInfo: {
        ids: [],
        remark: ""
      },
      tableDataTwo: [],
      // 患者对象
      patientInfo: {},
      // 待申请明细
      applyList: [],
      // 已申请
      appliedList: [],
      // 当前交易数据
      currentCharge: {},
      // 退费明细集合(传后台用)
      reChargeList: [],
      // 申请单分组
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
      checked: 0,
      // 医技 分组
      doctorOrderIndexArr: [],
      ruleForm: {
        refundReason: ""
      },
      // 退费原因验证
      rules: {
        refundReason: [
          { required: true, message: "退费原因不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    currentCharge(val) {
      this.currentCharge = val;
    },
    receivePatientData: {
      handler(value) {
        value.tradeId && this.getRechargeInfo(value);
        if (!value.tradeId) {
          this.resetAll();
          this.$message("此患者暂无退费信息");
        }
      },
      deep: true,
      immediate: true
    },
    checked(val) {
      this.setChargeData(this.groupApply[val]); // 传入当前选中的申请单
    }
  },
  methods: {
    ...mapActions({
      setChargeData: "cis/setChargeData"
    }),
    // 得到申请单状态
    getStatus(val) {
      if (val == "0") {
        return "已申请";
      }
      if (val == "1") {
        return "审批成功";
      }
      if (val == "2") {
        return "审批不成功";
      }
      if (val == "3") {
        return "已取消";
      }
      if (val == "4") {
        return "已退费";
      }
      if (val == "5") {
        return "退费确认待补收";
      }
      if (val == "9") {
        return "已撤销";
      }
      return "--";
    },
    // 单位计算
    division(a, b) {
      if (!b || b == 0) {
        return a;
      }
      return a / b;
    },
    // 申请退费
    async apply() {
      // eslint-disable-next-line consistent-return
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          try {
            if (!this.ruleForm.refundReason) {
              this.$message.error("退费原因不能为空");
              return;
            }
            this.$showLoading();
            this.getReChargeList(); // 筛选退费明细
            this.getApplyData(); // 拼装退费申请对象
            if (!this.reChargeList || this.reChargeList.length < 1) {
              this.$message.error("请选择退费数量");
              this.$hideLoading();
              return;
            }
            const response = await service.reChargeApply({
              ...this.currentCharge,
              refundReasonCode: "1",
              recordStatus: "0"
            });
            this.getRechargeInfo(this.currentCharge);
            this.resetAll();
            this.$hideLoading();
            if (response.code == "1") {
              this.$message({ message: "退费申请成功", type: "success" });
            }
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || error.message || "标准错误提示");
          }
        } else {
          console.log("error submit!!");
          // eslint-disable-next-line consistent-return
          return false;
        }
      });
    },
    // 点击左侧列表，获取退费信息
    async getRechargeInfo(row) {
      var _this = this;
      if (row.recordStatus == "9") {
        return;
      }
      // this.$showLoading();
      this.currentCharge = { ...row };
      // 未申请
      await service
        .getReChargeInfo({
          tradeId: row.tradeId
        })
        .then(res => {
          res.data.forEach(function(item, index) {
            let division = _this.division(item.itemQuantity, item.packQuantity);
            if (item.unitSaleFlg && item.unitSaleFlg == "0") {
              _this.$set(item, "division", division); // 不允许拆分 换算大单位
            } else {
              _this.$set(item, "division", item.itemQuantity); // 允许拆分用小单位
            }
            if (item.orderSource == "1") {
              let unitInfo = blukToOutfit(item.itemQuantity, item.packQuantity);
              _this.$set(item, "bigUnitNum", unitInfo.out); // bigUnitNum  大单位数量
              _this.$set(item, "minUnitNum", unitInfo.bl); // minUnitNum  小单位数量
            }
          });
          this.applyList = [...res.data];
          this.tableDataTwo = [...this.applyList];
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "标准错误提示");
        });
      this.getDoctorOrderNumber();
      // 查询已申请
      await service
        .getRefundInfo({
          patientId: row.patientId
        })
        .then(res => {
          res.data.forEach(function(item, index) {
            // 用于收费数量
            let division = _this.division(item.itemQuantity, item.packQuantity);
            if (item.unitSaleFlg && item.unitSaleFlg == "0") {
              _this.$set(item, "division", division); // 不允许拆分 换算大单位
            } else {
              _this.$set(item, "division", item.itemQuantity); // 允许拆分用小单位
            }
            if (item.orderSource == "1") {
              let unitInfo = blukToOutfit(item.itemQuantity, item.packQuantity);
              _this.$set(item, "bigUnitNum", unitInfo.out); // bigUnitNum  大单位数量
              _this.$set(item, "minUnitNum", unitInfo.bl); // minUnitNum  小单位数量
            }
            // 确认退费数量
            if(item.actualQuantity){
              // let division = _this.division(item.actualQuantity, item.packQuantity);
              // if (item.unitSaleFlg && item.unitSaleFlg == "0") {
              //   _this.$set(item, "divisiona", division); // 不允许拆分 换算大单位
              // } else {
              //   _this.$set(item, "divisiona", item.actualQuantity); // 允许拆分用小单位
              // }
              if (item.orderSource == "1") {
                let unitInfo = blukToOutfit(item.actualQuantity, item.packQuantity);
                _this.$set(item, "bigUnitNuma", unitInfo.out); // bigUnitNuma  大单位数量
                _this.$set(item, "minUnitNuma", unitInfo.bl); // minUnitNuma  小单位数量
              }
            }
          });
          this.appliedList = [...res.data];
          this.groupByApply();
          this.$hideLoading();
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        });
    },
    // 筛选退费明细
    getReChargeList() {
      this.reChargeList = [];
      let list = this.rechargeInfo.ids;
      for (let i = 0; i < list.length; i++) {
        let rule = /^(\d*)(\d*)(\.[0]{1,3})?$/;
        if (!list[i].refundQuantity || list[i].refundQuantity <= 0) {
          throw new Error("[" + list[i].itemName + "] 请选择申请退费数量");
        } else if (
          !list[i].refundQuantity ||
          !rule.test(list[i].refundQuantity)
        ) {
          throw new Error("[" + list[i].itemName + "] 申请退费数量只能为整数");
        } else if (list[i].refundQuantity && list[i].refundQuantity > 0) {
          let num = 0;
          if (list[i].unitSaleFlg && list[i].unitSaleFlg == "0") {
            num = list[i].packQuantity * list[i].refundQuantity;
          } else {
            num = list[i].refundQuantity;
          }
          let obj = {
            chargeDetailId: list[i].chargeDetailId,
            groupId: list[i].groupId,
            chargeItemId: list[i].chargeItemId,
            chargeQuantity: list[i].chargeQuantity,
            refundQuantity: num, // 数量单位转换
            recordStatus: "0"
          };
          this.reChargeList.push(obj);
        }
      }
    },
    getRowsIdx(rows) {
      let ids = [];
      rows.forEach(item => {
        if (item.orderSource == "4") {
          // 表格中分组的第一条数据
          let recipeData = this.tableDataTwo.find(
            obj => obj.rpId == item.rpId && obj.orderSource == "4"
          );
          // 选中集合中 是否存在 分组的第一条数据
          let first = rows.find(
            obj => obj.chargeDetailId == recipeData.chargeDetailId
          );
          if (first) {
            ids.push(item);
          }
        } else {
          ids.push(item);
        }
      });
      let arr = [...ids];
      // // 赋值明细
      arr.forEach(item => {
        this.tableDataTwo.forEach(val => {
          if (val.orderSource == "4") {
            if (item.rpId == val.rpId && arr.indexOf(val) < 0) {
              ids.push(val);
            }
          }
        });
      });
      this.rechargeInfo.ids = ids;
      this.rechargeBtnDisable = rows.length <= 0;
    },
    // 拼装退费申请对象
    getApplyData() {
      this.$delete(this.currentCharge, "recordStatus");
      this.$set(this.currentCharge, "refundApplyDetailList", this.reChargeList);
      this.$set(this.currentCharge, "refundReason", this.ruleForm.refundReason);
    },
    // 确认退费
    async submitRefund() {
      try {
        if (this.groupApply[this.checked].applyRecordStatus == "4") {
          this.$message("此申请单已退费");
          return;
        } else if (this.groupApply[this.checked].applyRecordStatus == "5") {
          this.$message("此申请单已退费,请勿重复退费");
          return;
        } else if (this.groupApply[this.checked].applyRecordStatus == "1") {
          this.$message("请到药房退药");
          return;
        } else if (this.groupApply[this.checked].applyRecordStatus == "0") {
          this.$message("此申请单医生未审批");
          return;
        } else if (this.groupApply[this.checked].applyRecordStatus == "2") {
          this.$message("此申请单审核未通过");
          return;
        } else if (this.groupApply[this.checked].applyRecordStatus == "9") {
          this.$message("此申请单已撤销");
          return;
        }
        this.$showLoading();
        const res = await service.refundCharge({
          applyDataVersion: this.groupApply[this.checked].applyDataVersion,
          refundApplyId: this.groupApply[this.checked].refundApplyId
        });
        this.$hideLoading();
        if (res.code == "1") {
          this.$message({ message: "退费成功", type: "success" });
        }
        this.getRechargeInfo(this.currentCharge);
        this.resetAll();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 撤回申请
    async callBackApply() {
      try {
        if (this.groupApply[this.checked].applyRecordStatus != "0") {
          this.$message("此申请单已审批，不能撤回");
          return;
        }
        this.$showLoading();
        const res = await service.callBackApply({
          dataVersion: this.groupApply[this.checked].applyDataVersion,
          refundApplyId: this.groupApply[this.checked].refundApplyId,
          recordStatus: this.groupApply[this.checked].applyRecordStatus
        });
        this.$hideLoading();
        if (res.code == "1") {
          this.$message({ message: "撤销成功", type: "success" });
        }
        this.getRechargeInfo(this.currentCharge);
        this.resetAll();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 重置
    resetAll() {
      // this.currentCharge = {};
      this.tableDataTwo = [];
      this.reChargeList = [];
      this.applyList = [];
      this.appliedList = [];
      this.ruleForm.refundReason = "";
      this.$nextTick(function() {
        if (this.$refs["ruleForm"].resetFields()) {
          this.$refs["ruleForm"].resetFields();
        }
      });

      this.groupApply = [];
      this.checked = 0;
    },
    // 已申请明细分组
    groupByApply() {
      let obj = {};
      // 根据 refundApplyId 分组
      this.groupApply = [];
      this.appliedList.forEach(data => {
        if (!obj[data.refundApplyId]) {
          this.groupApply.push({
            ...data,
            list: []
          });
          obj[data.refundApplyId] = true;
        }
      });
      // push 明细
      this.groupApply.forEach(val => {
        this.appliedList.forEach(item => {
          if (val.refundApplyId == item.refundApplyId) {
            val.list.push(item);
          }
        });
      });
      this.checked = 0;
      this.setChargeData(this.groupApply[0]);
      if (this.groupApply == null || this.groupApply.length < 1) {
        this.setChargeData({ list: [] });
      }
    },
    // 合并单元格 医技
    doctorObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        for (let i = 0; i < this.doctorOrderIndexArr.length; i++) {
          let element = this.doctorOrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    // 获取相同编号的数组 医技
    getDoctorOrderNumber() {
      let OrderObj = [];
      let arr = [];
      this.tableDataTwo.forEach((element, index) => {
        element.rowIndex = index;
        // 加 classCode 判断
        if (element.orderSource == "4") {
          if (OrderObj[element.rpId]) {
            OrderObj[element.rpId].push(index);
          } else {
            OrderObj[element.rpId] = [];
            OrderObj[element.rpId].push(index);
          }
        }
      });
      this.doctorOrderIndexArr = [];
      // 将数组长度大于1的值 存储到this.doctorOrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.doctorOrderIndexArr.push(OrderObj[k]);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.recharge-main {
  background: #fff;
  padding: 20px;
}
.special-col {
  padding: 20px;
  border: 1px solid #e4e4e4;
}

.el-tabs__content {
  height: 0px !important;
}
.margin-top-20 {
  margin-top: 20px;
}
.recharge-bottom {
  padding: 20px;
  text-align: right;
  background: #fff;
  border-top: 1px solid $l-color-border-3;
  border-radius: 0 0 4px 4px;
}
</style>
