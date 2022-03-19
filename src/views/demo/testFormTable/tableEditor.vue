<template>
  <div class="height100">
    <div class="table-utils" v-if="this.templetType === '10'">
      <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconxinzengmingxi"
        @click.native="addRow"
        v-hotKey="{ func: 'func_add2' }"
      >新增明细</el-button>
      <el-button
        @click="deleteHandler"
        class="filter-item"
        type="text"
        icon="iconfont iconshanchu"
        v-hotKey="{ func: 'func_delete' }"
      >删除</el-button>
      <el-button
        @click="bunchingHandler"
        class="filter-item"
        type="text"
        icon="iconfont iconchengzu"
        v-hotKey="{ func: 'func_grouping' }"
      >成组</el-button>
      <el-button
        @click="cancelBunching"
        class="filter-item"
        type="text"
        icon="iconfont iconquxiaochengzu"
        v-hotKey="{ func: 'cancel_grouping' }"
      >取消成组</el-button>
      <el-button
        type="primary"
        @click="submitCurRow()"
        class="button"
        style="position: absolute;z-index: -1;"
        v-hotKey="{ func: 'func_save' }"
      >保 存</el-button>
    </div>
    <div style="height: calc(100% - 46px)" class="main-table">
      <el-form
        :model="tableRuleForm"
        :rules="tableRuleForm.tableRules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm main-table height100"
      >
        <el-table
          highlight-current-row
          @header-dragend="headerDragend"
          :data="tableRuleForm.tableData"
          border
          stripe
          @row-click="rowClick"
          v-loading="listLoading"
          tooltip-effect="dark"
          header-cell-class-name="headerCls"
          :cell-class-name="cellStyle"
          :row-class-name="rowStyleCls"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          v-hotKey="{
              func: ['table_row', 'table_checkbox', 'table_choose'],
              deClass: 'el-table__row',
              curClass: 'current-row'
            }"
          height="100%"
        >
          <!-- 需要列 -->
          <el-table-column
            show-overflow-tooltip
            :fixed="true"
            align="center"
            type="selection"
            width="40"
          ></el-table-column>
          <!-- 业务列 -->
          <el-table-column
            show-overflow-tooltip
            v-for="item in tableColumn"
            :key="item.prop"
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            v-if="!item.isHide"
          >
            <template slot-scope="scope">
              <!-- 提交状态下 不可编辑  -->
              <template v-if="scope.row.status === '提交'">
                <span>{{ scope.row[item.prop]}}</span>
              </template>
              <!-- 非提交状态下可编辑  -->
              <template v-else>
                <!--医保类别-->
                <template v-if="item.prop === 'medicalInsuranceCat'">
                  <span :val="scope.row.medicalInsuranceCat" code="order_type" v-codeTransform></span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'price' || item.prop == 'amt'">
                  <span>{{ scope.row[item.prop] | rounding }}</span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'recipeCode'">
                  <span>{{ scope.row[item.prop] }}</span>
                  <template v-if="scope.row.unqualifiedComment !== ''">
                    <el-popover trigger="click" placement="left-start" popper-class="popper-class">
                      <div class="hoverContent">
                        <p>
                          <span class="title">审方意见</span>
                          <span class="content">
                            {{
                            scope.row["unqualifiedComment"]
                            }}
                          </span>
                        </p>
                        <p>
                          <span class="title">审方时间</span>
                          <span class="content">
                            {{
                            scope.row["checkTime"]
                            }}
                          </span>
                        </p>
                        <p>
                          <span class="title">审方药师</span>
                          <span class="content">
                            {{
                            scope.row["checkUserName"]
                            }}
                          </span>
                        </p>
                      </div>
                      <i slot="reference" class="el-icon-warning-outline icon"></i>
                    </el-popover>
                  </template>
                </template>
                <!-- 医嘱状态 -->
                <template v-else-if="item.prop == 'orderStatus'">
                  <template v-if="scope.row[item.prop] === '4'">
                    <span>已收费</span>
                  </template>
                  <template v-else-if="scope.row[item.prop] != '4'">
                    <span :val="scope.row[item.prop]" code="MedicalStatus" v-codeTransform></span>
                  </template>
                </template>
                <!--医嘱类型-->
                <template v-else-if="item.prop === 'orderCat'">
                  <span>
                    <span
                      columns="doctors_advice_name"
                      :conditionMap="{doctors_advice_code: scope.row.orderCat}"
                      tableName="cnf_doctors_advice"
                      v-tableTransform
                    ></span>
                  </span>
                </template>
                <!--成组 关联-->
                <template v-else-if="item.prop === 'relation'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.relation'"
                    :rules="tableRuleForm.tableRules.relation"
                  >
                    <el-input-number
                      :data-id="'relation' + scope.row.row_id"
                      v-model.number="scope.row.relation"
                      :min="0"
                      style="width: 100%"
                      step-strictly
                      :controls="false"
                      @change="relateAdvice"
                    ></el-input-number>
                  </el-form-item>
                </template>
                <!--医嘱名称-->
                <template v-else-if="item.prop === 'orderItemName'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.orderItemName'"
                    :rules="tableRuleForm.tableRules.orderItemName"
                    v-if="scope.row.orderStatus === '' "
                  >
                    <LInputTable
                      ref="lInputTable"
                      :data-id="'inputTable' + scope.row.row_id"
                      :popoverWidth="800"
                      suffix-icon="el-icon-search"
                      :tableData="selectOptions"
                      @query="search"
                      v-model="scope.row.orderItemName"
                      @select="selectDropRow"
                      :tableLoading="inputTableLoading"
                      :tableParams="dropColumn"
                      placeholder="请输入关键字"
                      valueKey="orderItemName"
                    ></LInputTable>
                  </el-form-item>
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.orderItemName'"
                    :rules="tableRuleForm.tableRules.orderItemName"
                    v-else
                  >{{ scope.row.orderItemName }}</el-form-item>
                </template>
                <template v-else-if="item.prop === 'bunching'">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
                <!--一次用量-->
                <template v-else-if="item.prop === 'onceDosage'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.onceDosage'"
                    :rules="tableRuleForm.tableRules.onceDosage"
                  >
                    <el-input
                      size="medium"
                      :data-id="'dosage' + scope.row.row_id"
                      v-model.trim="scope.row.onceDosage"
                      :maxlength="inputMaxL"
                      @input="inputHandler"
                    ></el-input>
                  </el-form-item>
                </template>
                <!--剂量单位-->
                <template v-else-if="item.prop === 'dosageUnit'">
                  <span :val="scope.row.dosageUnit" code="DrugDoseUnit" v-codeTransform></span>
                </template>
                <!--频次-->
                <template v-else-if="item.prop === 'frequencyCode'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.frequencyCode'"
                    :rules="tableRuleForm.tableRules.frequencyCode"
                  >
                    <cis-value-domain
                      :data-id="'frequency' + scope.row.row_id"
                      style="width: 100%"
                      :disabled="typeof scope.row.relation !== 'undefined' && relateAdviceDisabled"
                      remoteUrl="/frequency/pageList"
                      :remoteParams="remoteParams"
                      :value.sync="scope.row.frequencyCode"
                      placeholder="频次"
                      remoteShowKey="frequencyName"
                      remoteValueKey="frequencyCode"
                      @change="handleFreq"
                    ></cis-value-domain>
                  </el-form-item>
                </template>
                <!--用法-->
                <template v-else-if="item.prop === 'useWay'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.useWay'"
                    :rules="tableRuleForm.tableRules.useWay"
                  >
                    <l-value-domain
                      v-show="selectRefresh&&scope.row.orderCat==11"
                      :disabled="typeof scope.row.relation !== 'undefined' && relateAdviceDisabled"
                      code="fryingRemark"
                      :value.sync="scope.row.useWay"
                      placeholder="用法"
                      @change="handleUseWay"
                      remoteShowKey="name"
                      remoteValueKey="code"
                    ></l-value-domain>
                    <l-value-domain
                      v-show="selectRefresh&&scope.row.orderCat!=11"
                      :disabled="typeof scope.row.relation !== 'undefined' && relateAdviceDisabled"
                      code="MedicationRouteCode"
                      :value.sync="scope.row.useWay"
                      placeholder="用法"
                      @change="handleUseWay"
                      remoteShowKey="name"
                      remoteValueKey="code"
                    ></l-value-domain>
                  </el-form-item>
                </template>
                <!--数量-->
                <template v-else-if="item.prop === 'qty'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.qty'"
                    :rules="tableRuleForm.tableRules.qty"
                    class="skinTest"
                  >
                    <!--<el-input-->
                    <!--size="medium"-->
                    <!--style="width: 100%"-->
                    <!--v-model.number="scope.row.qty"-->
                    <!--@input="computeAmt"-->
                    <!--@keyup.native="limitNum"-->
                    <!--&gt;</el-input>-->
                    <el-input-number
                      v-model="scope.row.qty"
                      style="width: 100%"
                      :data-id="'qty' + scope.row.row_id"
                      size="medium"
                      :min="scope.row.qtyStep === 0.5 ? 0.5 : 1 "
                      :step="scope.row.qtyStep"
                      :step-strictly="true"
                      :controls="false"
                      @change="computeAmt"
                    ></el-input-number>
                  </el-form-item>
                </template>
                <!--非药品医嘱单位-->
                <template v-else-if="item.prop === 'nonDrugUnitKey'">
                  <span
                    v-if="!isNaN(scope.row.nonDrugUnitKey)"
                    :val="scope.row.nonDrugUnitKey"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <span v-else>{{ scope.row.nonDrugUnitKey }}</span>
                </template>
                <!--单位-->
                <template v-else-if="item.prop === 'unitKey'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.unitKey'"
                    :rules="tableRuleForm.tableRules.unitKey"
                  >
                    <el-select
                      v-model="scope.row.unitKey"
                      placeholder="单位"
                      style="width: 66px; vertical-align: top"
                      @change="unitChange($event, scope.row)"
                    >
                      <el-option
                        v-for="item in scope.row.unitOptions"
                        :label="item.label"
                        :key="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <!--皮试-->
                <template v-else-if="item.prop === 'skinTest'">
                  <el-form-item label prop="skinTest" class="skinTest">
                    <el-checkbox
                      v-model="scope.row.skinTest"
                      @keyup.enter.native="scope.row.skinTest = !scope.row.skinTest"
                      @change="changeSkinTest"
                      true-label="1"
                      false-label="0"
                      :disabled="scope.row.skinTestDisabled"
                    ></el-checkbox>
                  </el-form-item>
                </template>
                <!--备注-->
                <template v-else-if="item.prop === 'remark'">
                  <el-input
                    size="medium"
                    style="width:100%"
                    v-model.trim="scope.row.remark"
                    @keyup.enter.native="submitCurRowWrapper"
                    @keydown.tab.native="submitCurRowWrapper"
                  ></el-input>
                </template>
                <!--滴速-->
                <template v-else-if="item.prop === 'flowRate'">
                  <el-form-item
                    label
                    prop="flowRate"
                    class="flowRate"
                    v-if="scope.row.useWay === '404'"
                  >
                    <el-input-number
                      class="ds-input"
                      size="medium"
                      v-model="scope.row.dropRate1"
                      step-strictly
                      :controls="false"
                    ></el-input-number>～
                    <el-input-number
                      class="ds-input"
                      size="medium"
                      v-model="scope.row.dropRate2"
                      step-strictly
                      :controls="false"
                    ></el-input-number>
                    <span class="ds-unit">滴/分</span>
                  </el-form-item>
                  <span v-else>--</span>
                </template>
                <!--医嘱超量-->
                <!--<template v-else-if="item.prop === 'excessReason'">-->
                <!--<el-form-item-->
                <!--label-->
                <!--:prop="'tableData.' + scope.$index + '.excessReason'"-->
                <!--:rules="tableRuleForm.tableRules.excessReason"-->
                <!--v-if="scope.$index === currentRowIndex && overReasonShow"-->
                <!--&gt;-->
                <!--<el-input v-model.trim="scope.row.excessReason"></el-input>-->
                <!--</el-form-item>-->
                <!--<span class="aaaa" v-else>{{scope.row.excessReason}}</span>-->
                <!--</template>-->
                <template v-else-if="item.prop === 'useDay'">
                  <el-form-item label :prop="'tableData.' + scope.$index + '.useDay'">
                    <el-input
                      :disabled="typeof scope.row.relation !== 'undefined' && relateAdviceDisabled"
                      size="medium"
                      style="width:100%"
                      v-model.number="scope.row.useDay"
                      @keyup.native="limitNum"
                      @input="handleQty"
                    ></el-input>
                  </el-form-item>
                </template>
                <!--加急-->
                <template v-else-if="item.prop === 'urgent'">
                  <el-form-item label prop="urgent">
                    <el-checkbox
                      v-model="scope.row.urgent"
                      @keyup.enter.native="scope.row.urgent = !scope.row.urgent"
                    ></el-checkbox>
                  </el-form-item>
                </template>
                <!--中草药取药药房-->
                <template v-else-if="item.prop === 'execDeptNameChn'">
                  <span>{{codeToText(scope.row.execDeptNameChn, drugStorageList)}}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop]}}</span>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getDataIdDom } from "@/utils/util.js";
import { deepClone } from "@/utils/index.js";
import {
  getOrder,
  selectByTemplateId,
  getPageItemList,
  submitOrders,
  tempDetailBunching,
  tempDetailUngroup,
  batchRemoveOrders,
  saveOrdersMould,
  getRecipeCode,
  saveOrder,
  getRecipeNo,
  deleteTemplateDetails,
  updateDetails,
  getTakingRoomList,
  getAdviceItem
} from "@/api/cis/order/order";
import { getArrayList } from "@/api/wconf/wparam";
import { getAdviceItemList } from "@/api/systemManagement/dataMaintain/adviceItem";
import LInputNumber from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/presModule/modules/LInputNumber.vue";
import { getEffectiveRecord } from "@/api/common/allergy";
import {
  westernShowColumn,
  chmShowColumn,
  nonDrugShowColumn
} from "./tableColumn.js";
import { localCodeTransform } from "@/utils/util";
import CisValueDomain from "@/views/cis/components/CisValueDomain.vue";

export default {
  name: "tableEditor",
  components: { LInputNumber, CisValueDomain },
  props: {
    // data:{
    //   default:[],
    //   type:Array
    // },
    templetType: {
      default: "10",
      type: String
    },
    templetId: {
      default: "8ae40784740eaff301740f1d701a001d",
      type: String
    },
    reloadMainTableKey: {
      default: "",
      type: [String, Number]
    }
  },
  data() {
    return {
      drugStorageList: [], //中草药取药药房列表
      tableColumn: [
        // {
        //   prop: "recipeCode",
        //   label: "处方号",
        //   width: 160,
        //   fixed: true
        // },
        {
          prop: "no",
          label: "序号",
          width: 50,
          fixed: true
        },
        // {
        //   prop: "orderStatus", // 状态
        //   label: "医嘱状态",
        //   width: 120,
        //   fixed: true
        // },
        {
          prop: "orderItemName",
          label: "医嘱名称",
          width: 200,
          fixed: true
        },
        {
          prop: "medicalInsuranceCat",
          label: "医保类别"
        },
        {
          prop: "orderCat",
          label: "医嘱类型"
        },
        {
          prop: "bunching",
          label: "成组",
          align: "center",
          width: 50
        },
        {
          prop: "spec",
          label: "规格",
          width: 120
        },
        {
          prop: "onceDosage",
          label: "一次用量"
        },
        {
          prop: "dosageUnit",
          label: "剂量单位"
        },
        // {
        //   prop: "relation",
        //   label: "关联"
        // },

        {
          prop: "frequencyCode",
          label: "频次",
          width: 150
        },
        {
          prop: "useWay",
          label: "用法",
          width: 150
        },
        {
          prop: "useDay",
          label: "用药天数"
        },
        {
          prop: "price",
          label: "单价（元）",
          width: 100
        },
        {
          prop: "qty",
          label: "数量"
        },
        {
          prop: "unitKey",
          label: "单位",
          width: 80
        },
        {
          prop: "nonDrugUnitKey",
          label: "单位",
          width: 80
        },
        {
          prop: "amt",
          label: "金额（元）",
          width: 120
        },
        {
          prop: "skinTest",
          label: "皮试"
        },
        {
          prop: "urgent",
          label: "加急"
        },
        {
          prop: "flowRate",
          label: "滴速",
          width: 200
        },
        // {
        //   prop: "excessReason",
        //   label: "医嘱超量原因",
        //   width: 140
        // },
        {
          prop: "remark",
          label: "备注"
        },
        {
          prop: "execDeptName",
          label: "接收科室"
        },
        {
          prop: "execDeptNameChn",
          label: "接收科室"
        }
      ],
      submitCurRowFlag: false, //当行数据提交节流
      checked: true,
      currentRow: {}, //选中的当前行
      // 选中的当前行的索引
      currentRowIndex: -1,
      rpPosition: 0,
      isMask: false, // 查看遮罩
      RpRowArr: [],
      rpIndex: 1,
      multipleSelection: [], //选中的 checkbox
      groupNoList: [],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 1,
      listLoading: false,
      tableRuleForm: {
        tableData: [],
        tableRules: {
          orderCat: [
            { required: true, message: "请选择医保分类", trigger: "change" }
          ],
          doctorsAdviceCate: [
            { required: true, message: "请选择医嘱类型", trigger: "change" }
          ],
          relation: [],
          onceDosage: [
            {
              required: true,
              message: "请填写单次剂量",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
              message: "请输入正确的单次计量！"
            }
          ],
          frequencyCode: [
            { required: true, message: "请选择频次", trigger: "blur" }
          ],
          useWay: [{ required: true, message: "请选择用法", trigger: "blur" }],
          qty: [{ required: true, message: "请填写数量", trigger: "blur" }],
          unitKey: [{ required: true, message: "请选择单位", trigger: "blur" }],
          useDay: [
            { required: true, message: "请填写用药天数", trigger: "blur" }
          ],
          excessReason: [
            { required: true, message: "请填写超量原因", trigger: ["blur"] }
          ],
          remark: []
        }
      },
      selectOptions: [],
      dropColumn: [
        // 下拉 table 配置表头
        {
          prop: "reimburseName",
          label: "报销",
          width: 60,
          codeTransform: true,
          codeTransformCode: "DrugReimbursementType"
        },
        {
          prop: "orderItemName",
          label: "名称",
          width: 100
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "price",
          label: "单价",
          width: 100
        },
        {
          prop: "execDeptCode",
          label: "药房",
          width: 100,
          tableTransformType: "sys_org",
          tableTransform: true
        },
        {
          prop: "itemType",
          label: "项目类别",
          width: 100,
          tableTransformType: "cnf_doctors_advice",
          tableTransform: true
        },
        {
          prop: "stockNum",
          label: "库存",
          width: 100
        },
        {
          prop: "basicType",
          label: "基药",
          width: 110,
          codeTransform: true,
          codeTransformCode: "BasicDrugType"
        }
      ],
      inputTableLoading: false, //下拉table组件 loading
      inputMaxL: 10, //单次计量
      freq: {}, // 选中频次信息
      drugItem: {}, // 选中医嘱信息
      skinTestDisabled: true, //皮试勾选是否可选标识
      overReasonShow: false, // 超量原因 表单显示
      relateAdviceDisabled: false, // 关联属性是否只读
      remoteParams: { pageSize: 50, status: "1" }, // 频次分页参数
      showFlowRate: false, //显示滴速输入框
      // 在表格合并单元格之前隐藏用法下拉框，合并完成后显示，消除合并单元格，新增明细后用法下拉有数据显示空白问题
      selectRefresh: true,
      copyOrderVisible: false
    };
  },
  created() {
    this.hideRowByTempletType();
    this.getDrugStorageList(); //获取中草药取药药房
    this.getList(true);
  },
  mounted() {},
  methods: {
    codeToText(code, list) {
      // this.$nextTick(()=>{
      if (typeof code === "undefined") return;
      let filterList = list.find(item => {
        return item.deptId === code;
      });
      console.log(filterList);
      return filterList ? filterList.pharName : "--";
      // });
    },
    //获取勾选中的 已成组 项
    handleBunchingSelect(list, flag) {
      let me = this;
      let bunchingList = [];
      if (me.groupNoList.length > 0) {
        list.forEach(item => {
          me.groupNoList.forEach(row => {
            if (row.key === item.groupNo) {
              row.value.forEach(tableRow => {
                setTimeout(() => {
                  //修复 selection 只有一个的问题
                  me.$refs.multipleTable.toggleRowSelection(tableRow, flag);
                }, 0);
                if (bunchingList.indexOf(tableRow) !== -1) {
                  bunchingList.splice(
                    bunchingList.indexOf(tableRow),
                    1,
                    tableRow
                  ); //替换
                } else {
                  bunchingList.push(tableRow);
                }
              });
              this.$store.dispatch("cis/setMultipleSelections", row);
            }
          });
        });
      } else {
        bunchingList = list;
      }

      // console.info("========handleSelectionChange2", bunchingList)
      this.handleSelectionChange(bunchingList);
    },
    //成组校验
    bunchingValidate() {
      let flag = true;
      if (this.multipleSelection.length > 1) {
        // 成组最少两个成员
        flag = true;
      } else {
        flag = false;
        this.$message.warning("成组最少两个医嘱");
        return false;
      }

      // if (!this.isSameRp()) {
      //   //同一处方
      //   this.$message.warning("请选择同一处方元素成组");
      //   return false;
      // }

      return flag;
    },
    //同一处方
    isSameRp() {
      let rpName = null;
      return this.multipleSelection.every((item, index) => {
        if (index === 0) {
          rpName = item.recipeCode;
        }
        return item.recipeCode === rpName;
      });
    },
    //成组 处理
    bunchingHandler() {
      if (this.bunchingValidate()) {
        this.$confirm("成组药品用法和频次将保持一致，是否继续？")
          .then(_ => {
            let data = this.multipleSelection;
            // 将该组其他医嘱一起勾选
            this.handleBunchingSelect(data, true);
            tempDetailBunching(data)
              .then(res => {
                if (res.code === 1) {
                  this.getList(false);
                } else {
                  this.$message.error(res.msg || " 接口返回错误");
                }
              })
              .catch(() => {
                this.$message.error("成组失败！");
              });
          })
          .catch(_ => {});
      }
    },
    isSameGroup() {
      let groupNo = null;
      return this.multipleSelection.every((item, index) => {
        if (index === 0) {
          groupNo = item.groupNo;
        }
        return item.groupNo === groupNo;
      });
    },
    //取消成组
    cancelBunching() {
      let data = this.multipleSelection;
      if (data.length > 1) {
        // 成组最少两个成员

        // 组号相同
        if (this.isSameGroup) {
          tempDetailUngroup(data).then(res => {
            if (res.code === 1) {
              this.$message.success(res.msg ? res.msg : "取消成组成功！");
              this.getList(false);
            } else {
              this.$message.error(res.msg ? res.msg : "取消成组失败");
            }
          });
        } else {
          this.$message.warning("取消成组组号必须相同");
        }
      } else {
        this.$message.warning("取消成组最少两个医嘱");
      }
    },
    headerDragend() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    isSameChmDrug(val) {
      console.log(val);
      let currentRowIndex = this.currentRowIndex;
      let isSameChmDrug = this.tableRuleForm.tableData.some((item, index) => {
        return item.itemId === val.itemId && currentRowIndex != index; //当前行不做重复药品校验
      });
      return isSameChmDrug;
    },
    async chmDrugSelect(row) {
      if (this.isSameChmDrug(row)) {
        this.$message.error("已有" + row.orderItemName + ",不应重复录入！");
        let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
        currentRow.orderItemName = "";
        return;
      }

      //设置非编辑行
      // let {
      //   visitCode,
      //   patientId,
      //   patientCode,
      //   patientName
      // } = this.$store.state.base.receivePatientData; //获取患者信息
      let curObj = this.currentRow;
      // let recipeCode = curObj ? curObj["recipeCode"] : ""; //获取当前处方号
      // let recipeId = curObj ? curObj["recipeId"] : ""; //获取当前处方号
      let id = curObj ? curObj["id"] : "";
      let qtyStep = 1;
      let data = {
        id: id,
        unitSaleFlg: row.unitSaleFlg, // 1 是可拆分  0 是不可拆分
        qtyStep: qtyStep,
        // visitCode: typeof visitCode === "undefined" ? "" : visitCode,
        // patientId: patientId,
        // patientName: patientName,
        // patientCode: patientCode,
        // recipeCode: recipeCode,
        // recipeId: recipeId,
        orderCat: row.itemType,
        spec: row.spec,
        price: row.price,
        dosage: row.dosage,
        packQuantity: row.packQuantity,
        dosageUnit: row.defaultDosageUnit,
        orderItemName: row.orderItemName,
        orderItemId: row.itemId,
        itemId: row.itemId,
        orderItemCat: row.itemType,
        classCode: row.classCode,
        receiveDept: row.execDeptCode,
        manageType: row.manageType,
        formCode: row.formCode,
        dataVersion: row.dataVersion ? row.dataVersion : 0,
        stockNum: row.stockNum,
        unit: row.limitUnit,
        packUnit: row.unit,
        unitKey: row.unit,
        drugDosage: row.dosage + row.defaultDosageUnit,
        stClassCode: row.stClassCode || "",
        stType: row.stType || "",
        stSolutionType: row.stSolutionType || "",
        stRemindTime: row.stRemindTime || "",
        validTime: row.validTime || "",
        positiveDispense: row.positiveDispense || "",
        applicationRange: row.applicationRange || "",
        execDeptName: row.execDeptName || "",
        execDeptCode: row.execDeptCode,
        executeDepartmentId: row.execDeptCode || ""
      };

      data = {
        ...data,
        ...{
          unitKey: row.limitUnit
        }
      };
      await this.getChMQtyUnitAjax(data).then(res => {
        data.unitOptions = res;
      });

      this.selectOptions = [];
      this.currentPage = 0;

      for (let key in data) {
        this.currentRow[key] = data[key];
      }

      //设置选择药品值
      this.drugItem = data;

      //焦点定位到关联
      setTimeout(() => {
        let nodeList = getDataIdDom(
          "div",
          "data-id",
          "frequency" + this.currentRow["row_id"]
        );
        if (nodeList.length > 0) {
          nodeList[0].querySelector("input").focus();
        }
      }, 10);
    },
    hideRowByTempletType() {
      let showColumn = [];
      switch (this.templetType) {
        case "10": //西药
          showColumn = westernShowColumn;
          break;
        case "11": //中草药
          showColumn = chmShowColumn;
          break;
        default:
          // 非药品
          showColumn = nonDrugShowColumn;
      }
      this.tableColumn.forEach(item => {
        if (showColumn.indexOf(item.prop) < 0) {
          item.isHide = true;
        }
      });
    },
    //行点击
    rowClick(row, column, event) {
      this.currentRow = row;
      this.currentRowIndex = row.trindex;
      this.computeDay();
    },
    //限制用药天数只能输入正整数
    limitNum(e) {
      var license_num = e.target.value;
      license_num = license_num.replace(/[^\.\d]/g, ""); // 清除“数字”和“.”以外的字符
      if (license_num.indexOf(".") < 0 && license_num != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        e.target.value = parseInt(license_num);
      }

      if (license_num == 0) {
        e.target.value = "";
      } else {
        e.target.value = license_num;
      }
    },
    // 计算天数
    computeDay() {
      this.$nextTick(() => {
        let rowData = this.tableRuleForm.tableData[this.currentRowIndex];
        // let { freq, drugItem, ruleForm } = deepClone(this.selectDrop);
        let freq =
          Object.keys(this.freq).length > 0 ? this.freq : this.currentRow;
        let drugItem = this.drugItem;
        let ruleForm = rowData;
        let orderItem = drugItem && drugItem.dosage ? drugItem : rowData;
        let onceDosage = ruleForm.onceDosage ? ruleForm.onceDosage : 0;
        let qty =
          ruleForm.unitKey === orderItem.packUnit
            ? ruleForm.qty * orderItem.packQuantity * 1
            : ruleForm.qty * 1;
        let times = 1;
        let day = 0;
        if (freq.frequencyUnit === "天") {
          times = freq.frequencyTimes;
        } else if (freq.frequencyUnit === "周") {
          times = freq.frequencyTimes / 7;
        } else if (freq.frequencyUnit === "月") {
          times = freq.frequencyTimes / 30;
        }

        if (onceDosage !== 0) {
          day = (qty * orderItem.dosage) / onceDosage / times;
          day = Math.ceil(day); //向上取整  可用天数字段
        }
        try {
          this.currentRow.day = day;
        } catch {}

        // this.selectDrop.displayList.forEach(item => {
        //   if (item.prop === "day") {
        //     item.value = day;
        //   }
        // });

        // this.currentRow.day = Math.round(amt * 100) / 100;

        //显示超量提醒
        if (typeof day != undefined && day > 7) {
          this.overReasonShow = true;
        } else if (typeof day != undefined && day <= 7) {
          this.overReasonShow = false;
          this.currentRow.excessReason = "";
        }
      });
    },
    deleteHandler() {
      let tableData = this.tableRuleForm.tableData;
      // 废数据过滤
      let flag = false;
      if (this.multipleSelection.length > 0) {
        //最少选中一项
        this.$confirm("删除后不可恢复，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let localList = this.multipleSelection.filter(item => {
              return item.row_id;
            });

            if (localList.length > 0) {
              this.tableRuleForm.tableData = tableData.filter(item => {
                if (item.row_id) {
                  return !this.multipleSelection.find(
                    multipleItem => multipleItem.row_id === item.row_id
                  );
                } else {
                  return true;
                }
              });
            }

            let serverList = this.multipleSelection.filter(item => {
              return item.id;
            });

            if (serverList.length > 0) {
              //走服务器
              //处理数据 替换字段
              let ajaxData = serverList.map((item, index) => {
                let obj = {
                  itemCat: item.orderCat,
                  itemName: item.orderItemName,
                  quantity: item.qty,
                  packageUnit: item.packUnit,
                  oneDosage: item.onceDosage,
                  executeDepartmentName: item.execDeptName,
                  executeDepartmentId: item.execDeptCode,
                  unit: item.unitKey
                };
                return { ...obj, ...item };
              });
              console.log("删除的ajaxData", ajaxData);
              deleteTemplateDetails(ajaxData)
                .then(res => {
                  if (res.code === 1) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.getList(true);
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
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("请选择后再删除！");
      }
    },
    submitCurRowWrapper() {
      switch (this.templetType) {
        case "10": //西药
          this.submitCurRow();
          break;
        case "11": //中草药
          this.chmDrugSubmitCurRow();
          break;
        default:
          this.nonDrugSubmitCurRow();
      }
    },

    chmDrugSubmitCurRow() {
      if (this.submitCurRowFlag) return;
      this.submitCurRowFlag = true;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let current = this.currentRow;
          let form = this.tableRuleForm.tableData[this.currentRowIndex];

          let orderItem = { ...current, ...this.drugItem };

          if (!form) {
            this.$message.info("请选中要保存的编辑行");
          }

          //数量换算
          // 换算最小单位数量
          let qty =
            form.unitKey === orderItem.packUnit
              ? form.qty * 1 * orderItem.packQuantity
              : form.qty;

          // 医生选择单位标识 0-小包装单位  1-大包装单位
          let flag = form.unitKey === orderItem.packUnit ? "1" : "0";

          form.quantity = qty;
          form.unit = orderItem.unit;
          form.unitFlag = flag;
          orderItem = { ...orderItem, ...form };

          orderItem.urgent = orderItem.urgent === "" ? "0" : orderItem.urgent;

          orderItem.templetDetailId = orderItem.id;
          orderItem.templetId = this.templetId;

          orderItem.itemCat = orderItem.orderCat;
          orderItem.itemName = orderItem.orderItemName;
          orderItem.quantity = orderItem.qty;
          orderItem.packageUnit = orderItem.packUnit;
          orderItem.oneDosage = orderItem.onceDosage;
          orderItem.executeDepartmentName = orderItem.execDeptName;
          // orderItem.executeDepartmentId = orderItem.execDeptCode || orderItem.executeDepartmentId;

          updateDetails(orderItem)
            .then(res => {
              if (res.code === 1) {
                this.$message.success(res.msg ? res.msg : "医嘱存储成功");
                this.getList(true);
                this.drugItem = {}; //当条数据暂存后，清空drugItem的数据
                this.freq = {}; //当条数据暂存后，清空freq的数据
              } else {
                this.$message.error(res.msg ? res.msg : "医嘱存储失败");
              }
              this.submitCurRowFlag = false;
            })
            .catch(error => {
              this.submitCurRowFlag = false;
            });
        } else {
          // alert("报错了");
          // 错误 表单聚焦
          setTimeout(() => {
            let isError = document.getElementsByClassName("is-error");
            isError[0].querySelector("input").focus();
          }, 10);
          this.submitCurRowFlag = false;
          return false;
        }
      });
    },

    nonDrugSubmitCurRow() {
      if (this.submitCurRowFlag) return;
      this.submitCurRowFlag = true;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let current = this.currentRow;
          // console.info(this.selectDrop.drugItem);
          //debugger;
          let form = this.tableRuleForm.tableData[this.currentRowIndex];
          /* console.log(
                form,
                typeof form.dropRate1,
                typeof form.dropRate2,
                form.dropRate2 < form.dropRate1
              ); */
          // console.log("this.currentRow里面的useWay",current.useWay);
          // console.log("this.drugItem里面的useWay",this.drugItem.useWay);
          // this.selectDrop.drugItem.id =  current ? current.id : "";
          let orderItem = { ...current, ...this.drugItem };
          // console.log("orderItem里面的useWay",orderItem.useWay);
          // console.info("orderItem", orderItem);
          // if (
          //   typeof orderItem.orderItemId === "undefined" ||
          //   orderItem.orderItemId === ""
          // ) {
          //   this.$message.warning("请选择医嘱项目之后再保存！");
          //   return false;
          // }

          //验证关联药品
          // console.info(form, current)
          // debugger
          // if (form.relation > current.no || form.relation <= 0) {
          //   this.$message.warning("关联医嘱序号有误，请核对后再填写！");
          //   return false;
          // }

          // console.log("用药天数有误，请核对后再填写！ form.useDay用药天数：", form.useDay);

          if (!form) {
            this.$message.info("请选中要保存的编辑行");
          }

          //数量换算
          // 换算最小单位数量
          let qty =
            form.unitKey === orderItem.packUnit
              ? form.qty * 1 * orderItem.packQuantity
              : form.qty;

          // 医生选择单位标识 0-小包装单位  1-大包装单位
          // let flag =
          //   form.unitKey === orderItem.packUnit
          //     ? "1" : "0";

          form.quantity = qty;
          form.unit = orderItem.unit;
          // form.unitFlag = flag;
          orderItem = { ...orderItem, ...form };

          // 超7天校验  没有超量原因
          // let hasReason =
          //   typeof orderItem.excessReason === "undefined" ||
          //   orderItem.excessReason === ""
          //     ? false
          //     : true;

          // console.info("orderItem", orderItem);
          orderItem.skinTest =
            orderItem.skinTest === "" ? "0" : orderItem.skinTest;
          orderItem.urgent = orderItem.urgent === "" ? "0" : orderItem.urgent;
          orderItem.no = form.relation === "undefined" ? "" : form.relation;

          orderItem.templetDetailId = orderItem.id;
          orderItem.templetId = this.templetId;

          // orderItem.templetType = orderItem.orderCat;
          orderItem.itemCat = orderItem.orderCat;
          orderItem.itemName = orderItem.orderItemName;
          orderItem.quantity = orderItem.qty;
          orderItem.packageUnit = orderItem.packUnit;
          orderItem.oneDosage = orderItem.onceDosage;
          orderItem.executeDepartmentName = orderItem.execDeptName;
          orderItem.unit = orderItem.unitKey;

          // orderItem.executeDepartmentId = orderItem.execDeptCode;

          // console.log("提交的数据useWay",orderItem.useWay);
          updateDetails(orderItem)
            .then(res => {
              if (res.code === 1) {
                this.$message.success(res.msg ? res.msg : "医嘱存储成功");
                this.getList(true);
                this.drugItem = {}; //当条数据暂存后，清空drugItem的数据
                this.freq = {}; //当条数据暂存后，清空freq的数据
              } else {
                this.$message.error(res.msg ? res.msg : "医嘱存储失败");
              }
              this.submitCurRowFlag = false;
            })
            .catch(error => {
              this.submitCurRowFlag = false;
            });
        } else {
          // alert("报错了");
          // 错误 表单聚焦
          setTimeout(() => {
            let isError = document.getElementsByClassName("is-error");
            isError[0].querySelector("input").focus();
          }, 10);
          this.submitCurRowFlag = false;
          return false;
        }
      });
    },
    // 提交表单 备注 回车 tab 键 提交当前行
    submitCurRow() {
      if (this.submitCurRowFlag) return;
      this.submitCurRowFlag = true;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let current = this.currentRow;
          // console.info(this.selectDrop.drugItem);
          //debugger;
          let form = this.tableRuleForm.tableData[this.currentRowIndex];
          /* console.log(
                form,
                typeof form.dropRate1,
                typeof form.dropRate2,
                form.dropRate2 < form.dropRate1
              ); */
          // console.log("this.currentRow里面的useWay",current.useWay);
          // console.log("this.drugItem里面的useWay",this.drugItem.useWay);
          // this.selectDrop.drugItem.id =  current ? current.id : "";
          let orderItem = { ...current, ...this.drugItem };
          // console.log("orderItem里面的useWay",orderItem.useWay);
          // console.info("orderItem", orderItem);
          // if (
          //   typeof orderItem.orderItemId === "undefined" ||
          //   orderItem.orderItemId === ""
          // ) {
          //   this.$message.warning("请选择医嘱项目之后再保存！");
          //   return false;
          // }

          //验证关联药品
          // console.info(form, current)
          // debugger
          // if (form.relation > current.no || form.relation <= 0) {
          //   this.$message.warning("关联医嘱序号有误，请核对后再填写！");
          //   return false;
          // }

          // console.log("用药天数有误，请核对后再填写！ form.useDay用药天数：", form.useDay);

          if (!form) {
            this.$message.info("请选中要保存的编辑行");
          }

          //用药天数不能小于0
          if (typeof form.useDay === "undefined" || form.useDay <= 0) {
            this.$message.warning("用药天数有误，请核对后再填写！");
            this.submitCurRowFlag = false;
            return false;
          }

          // 滴速
          if (form.useWay === "404") {
            if (
              typeof form.dropRate1 === "undefined" ||
              typeof form.dropRate2 === "undefined" ||
              form.dropRate2 < form.dropRate1
            ) {
              this.$message.warning("滴速填写错误！");
              this.submitCurRowFlag = false;
              return false;
            } else {
              form.dropRate = form.dropRate1 + "~" + form.dropRate2;
            }
          }

          //数量换算
          // 换算最小单位数量
          let qty =
            form.unitKey === orderItem.packUnit
              ? form.qty * 1 * orderItem.packQuantity
              : form.qty;

          // 医生选择单位标识 0-小包装单位  1-大包装单位
          let flag = form.unitKey === orderItem.packUnit ? "1" : "0";

          form.quantity = qty;
          form.unit = orderItem.unit;
          form.unitFlag = flag;
          orderItem = { ...orderItem, ...form };

          // 超7天校验  没有超量原因
          // let hasReason =
          //   typeof orderItem.excessReason === "undefined" ||
          //   orderItem.excessReason === ""
          //     ? false
          //     : true;

          // if (orderItem.day > 7) {
          //   //弹出填写超量原因提示框，并填写提交
          //   this.$message.error("用药天数不可以超过7天");
          //   this.submitCurRowFlag = false;
          //   return;
          // }

          // 天数超量控制三位数
          // if (orderItem.day.toString().length > 2) {
          //   this.$message.warning("可用天数过长，请确认后再保存");
          //   this.submitCurRowFlag = false;
          //   return false;
          // }

          // 滴速
          if (this.showFlowRate) {
            if (
              typeof form.dropRate1 === "undefined" ||
              typeof form.dropRate2 === "undefined" ||
              form.dropRate2 < form.dropRate1
            ) {
              this.$message.warning("滴速填写错误！");
              this.submitCurRowFlag = false;
              return false;
            } else {
              form.dropRate = form.dropRate1 + "~" + form.dropRate2;
            }
          }

          // console.info("orderItem", orderItem);
          orderItem.skinTest =
            orderItem.skinTest === "" ? "0" : orderItem.skinTest;
          orderItem.urgent = orderItem.urgent === "" ? "0" : orderItem.urgent;
          orderItem.no = form.relation === "undefined" ? "" : form.relation;

          orderItem.templetDetailId = "8ae407bc749ef6e201749f100d340019";
          orderItem.templetId = "8ae40784740eaff301740f1d701a001d";

          // orderItem.templetType = orderItem.orderCat;
          orderItem.itemCat = orderItem.orderCat;
          orderItem.itemName = orderItem.orderItemName;
          orderItem.quantity = orderItem.qty;
          orderItem.packageUnit = orderItem.packUnit;
          orderItem.oneDosage = orderItem.onceDosage;
          orderItem.executeDepartmentName = orderItem.execDeptName;
          // orderItem.unit = orderItem.unitKey;

          // orderItem.executeDepartmentId = orderItem.executeDepartmentId;

          // console.log("提交的数据useWay",orderItem.useWay);
          updateDetails(orderItem)
            .then(res => {
              if (res.code === 1) {
                this.$message.success(res.msg ? res.msg : "医嘱存储成功");
                this.getList(true);
                this.drugItem = {}; //当条数据暂存后，清空drugItem的数据
                this.freq = {}; //当条数据暂存后，清空freq的数据
              } else {
                this.$message.error(res.msg ? res.msg : "医嘱存储失败");
              }
              this.submitCurRowFlag = false;
            })
            .catch(error => {
              this.submitCurRowFlag = false;
            });
        } else {
          // alert("报错了");
          // 错误 表单聚焦
          setTimeout(() => {
            let isError = document.getElementsByClassName("is-error");
            isError[0].querySelector("input").focus();
          }, 10);
          this.submitCurRowFlag = false;
          return false;
        }
      });
    },
    getList(flag) {
      let visitCode = "all";
      let data = {
        ...{
          pageNo: this.currentPage,
          pageSize: 99999,
          visitCode: visitCode,
          types: "1" //医嘱类别   如果有多个类别，用“,”拼接。
        }
      };
      if (!this.templetId) {
        return;
      }
      let url =
        "/outpatient/outpatientCisTempDetail/selectByTemplateId/" +
        this.templetId +
        "/1/50";
      this.listLoading = true;
      selectByTemplateId(url, data, flag)
        .then(async res => {
          this.listLoading = false;
          // debugger
          if (res.code === 1) {
            let { data } = res;
            let tableData = [];
            for (let i = 0; i < data.length; i++) {
              let item = data[i];
              // 数量单位转换
              /*              let qty =
                              item.quantity % item.packQuantity !== 0
                                ? item.quantity
                                : item.quantity / item.packQuantity;
                            let unitKey =
                              item.quantity % item.packQuantity !== 0
                                ? item.unit
                                : item.packUnit;*/

              let qty =
                item.unitFlag === "0"
                  ? item.quantity
                  : item.quantity / item.packQuantity;
              let unitKey =
                item.unitFlag === "0" ? item.unit : item.packageUnit;
              //备注：如果不可拆零，数量只能是整数
              // 如果可拆零，选择小单位时只能是整数
              let qtyStep = 1;
              if (item.unitSaleFlg === "0") {
                //单位不可拆零 数量只能是整数
                qtyStep = 1;
              } else if (item.unitSaleFlg === "1") {
                //单位可拆零 选择小单位时只能是整数
                if (item.unitFlag === "0") {
                  qtyStep = 1;
                } else {
                  qtyStep = 0.5;
                }
              }
              // 滴速显示
              let dropRate1 = "";
              let dropRate2 = "";
              if (item.dropRate && item.dropRate.indexOf("~") > -1) {
                let splitStr = item.dropRate.split("~");
                dropRate1 = splitStr[0];
                dropRate2 = splitStr[1];
              }

              //packageUnit 赋值给 packUnit
              item = {
                ...item,
                ...{
                  packUnit: item.packageUnit
                }
              };

              await this.getQtyUnitAjax(item).then(res => {
                item.unitOptions = res;
              });
              tableData.push({
                qtyStep: qtyStep,
                skinTestDisabled: true, //禁止用户编辑
                unitSaleFlg: item.unitSaleFlg,
                visitCode: item.visitCode || "",
                orderItemId: item.orderItemId || "",
                itemId: item.itemId || "",
                category: item.category || "",
                medicalInsuranceCat: item.medicalInsuranceCat || "",
                orgId: item.orgId,
                hosId: item.hosId,
                doctorId: item.doctorId,
                doctorName: item.doctorName,
                patientId: item.patientId,
                patientName: item.patientName,
                ouptDeptId: item.ouptDeptId,
                ouptDeptName: item.ouptDeptName,
                ouptDeptCode: item.ouptDeptCode,
                recipeCode: item.recipeCode || "",
                recipeId: item.recipeId || "",
                orderCat: item.itemCat || "",
                relation: item.relation || undefined,
                spec: item.spec || "",
                price: item.price || "",
                dosage: item.dosage || "",
                dosageUnit: item.dosageUnit || "",
                onceDosage: item.oneDosage || "",
                useWay: item.useWay || "",
                frequencyCode: item.frequencyCode || "",
                frequencyTimes: item.frequencyTimes || "",
                frequencyUnit: item.frequencyUnit || "",
                quantity: item.quantity,
                unit: item.unit || "",
                packUnit: item.packageUnit || "",
                unitFlag: item.unitFlag || "",
                qty: qty,
                packQuantity: item.packQuantity || "",
                unitKey: unitKey || "",
                skinTest: item.skinTest || "",
                urgent: item.urgent,
                amt: item.amt || "",
                day: item.day || "",
                useDay: item.useDay || "",
                remark: item.remark || "",
                orderItemName: item.itemName || "",
                id: item.templetDetailId,
                manageType: item.manageType,
                formCode: item.formCode,
                dropRate: item.dropRate || "",
                dropRate1: dropRate1,
                dropRate2: dropRate2,
                administrationTimeCode: item.administrationTimeCode || "",
                stClassCode: item.a || "",
                excessReason: item.excessReason || "",
                diagnosisTime: item.diagnosisTime,
                isMajor: item.isMajor,
                groupNo: item.groupNo,
                no: item.no || i + 1,
                unqualifiedComment: item.unqualifiedComment || "",
                checkTime: item.checkTime || "",
                checkUserName: item.checkUserName || "",
                groupNoCls: "", //成组样式
                execDeptId: item.receiveDept,
                execDeptName: item.receiveDeptName,
                receiveDept: item.receiveDept,
                chargeStatus: item.chargeStatus || "",
                dataVersion: item.dataVersion || 0,
                rDataVersion: item.rDataVersion || 0,
                unitOptions: item.unitOptions,
                templetDetailId: item.templetDetailId,
                templetId: item.templetId,
                orderStatus: "on",
                execDeptName: item.executeDepartmentName,
                execDeptNameChn: item.executeDepartmentId, //中草药 接收科室字段是  executeDepartmentId
                executeDepartmentId: item.executeDepartmentId,
                execDeptCode: item.execDeptCode
              });
            }

            if (this.templetType !== "10" || this.templetType !== "11") {
              //非药品部分 数量 和 单位字段处理
              for (let i = 0; i < tableData.length; i++) {
                let innerItem = tableData[i];
                innerItem.qty = innerItem.quantity;
                innerItem.nonDrugUnitKey = innerItem.unit;
              }
            }
            // console.log(tableData);

            // 初始化处方状态
            // updateStatus(data, this);
            // this.$root.eventHub.$emit("top-list-change");

            this.tableRuleForm.tableData = [];
            this.tableRuleForm.tableData = tableData;
            // this.replaceField(tableData);
            this.setBunchingCls();
            this.setDataAddType(); //给数据增加type 属性
            this.getRpRowArr(); //处方项相同的合并处理
            this.currentPage = res.pageNo;
            // this.pageSize = res.pageSize;
            this.total = res.total;
            this.$nextTick(() => {
              this.$refs.multipleTable.doLayout();
            });
          } else {
            this.$message.error(res.msg ? res.msg : "获取数据失败");
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    setBunchingCls() {
      var list = [];
      var filterList = [];
      let groupList = this.tableRuleForm.tableData.map(item => {
        return item.groupNo;
      });
      groupList = unique(groupList); //数组去重
      groupList = groupList.filter((item, index) => {
        // 数组去undefind
        return item !== undefined;
      });

      function unique(arr) {
        return Array.from(new Set(arr));
      }

      groupList.forEach((item, index) => {
        //遍历 成map结构
        // list = [];
        filterList = this.tableRuleForm.tableData.filter((sonItem, sonIde) => {
          return item === sonItem.groupNo;
        });
        list.push({
          key: item,
          value: filterList
        });
      });
      this.groupNoList = list;
      list.forEach(item => {
        let itemList = item.value;

        // 只有一条数据的组 groupNoCls 是空
        if (itemList.length === 1) {
          itemList[0].groupNoCls = "";
        } else {
          itemList.forEach((sonItem, sonIndex) => {
            if (sonIndex === 0) {
              sonItem.groupNoCls = "bunchingUp";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = "bunchingDown";
            } else {
              sonItem.groupNoCls = "bunchingCenter";
            }
          });
        }
      });
    },
    // selection 选中 的 函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //用户没有选中，默认最后一条选中，并选择该处方号
    addRow() {
      //空 table 新增明细 提示用户 新增处方
      let addRowEmpty = {};

      let _index = 0;
      let no = this.tableRuleForm.tableData.length;

      this.tableColumn.forEach(item => {
        addRowEmpty[item.prop] = "";
      });
      addRowEmpty["recipeCode"] = ""; // 初始化数据
      addRowEmpty["recipeId"] = "";
      addRowEmpty["price"] = 0;
      addRowEmpty["amt"] = 0;
      addRowEmpty["no"] = no + 1;
      addRowEmpty["orderItemName"] = ""; // 0107
      addRowEmpty["frequencyCode"] = ""; // 0107
      addRowEmpty["orderStatus"] = ""; // 0107
      addRowEmpty["row_id"] = +new Date();
      addRowEmpty["relation"] = undefined;
      addRowEmpty["qty"] = undefined;
      addRowEmpty["skinTestDisabled"] = true;
      // this.clearTypeCurrent();
      let rowindex = this.tableRuleForm.tableData.length;
      this.tableRuleForm.tableData.splice(rowindex, 0, addRowEmpty);
      this.currentRow = addRowEmpty;
      this.currentRowIndex = rowindex;
      this.setCurrentLight(this.tableRuleForm.tableData[rowindex]);
      this.getRpRowArr();

      //焦点定位到医嘱名称
      this.$nextTick(() => {
        let nodeList = getDataIdDom(
          "div",
          "data-id",
          "inputTable" + addRowEmpty["row_id"]
        );
        if (nodeList.length > 0) {
          nodeList[1].getElementsByClassName("el-input__inner")[0].focus();
        }
      });
    },
    //获取处方合并的 list
    getRpRowArr() {
      this.selectRefresh = false;
      let tableData = this.tableRuleForm.tableData;
      this.rpPosition = 0;
      this.RpRowArr = [];
      tableData.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.RpRowArr.push(1);
        } else {
          if (item["recipeCode"] === tableData[index - 1]["recipeCode"]) {
            this.RpRowArr[this.rpPosition] += 1;
            this.RpRowArr.push(0);
          } else {
            this.RpRowArr.push(1);
            this.rpPosition = index;
          }
        }
      });
      this.$nextTick(() => {
        this.selectRefresh = true;
      });
    },
    setCurrentLight(row) {
      this.$refs.multipleTable.setCurrentRow(row);
      // this.changeCurrentRow(row);
    },
    //处理成组样式
    cellStyle(row, column, rowIndex, columnIndex) {
      return "cell-style";
    },
    //处理 row 的样式
    rowStyleCls(a) {
      a.row.trindex = a.rowIndex;
      return {
        rowStyleCls: true
      };
    },
    //处方合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.RpRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    search(query) {
      let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
      let data = {
        // ...{ pageNo: pageNo, pageSize: this.pageSize, name: query, cwType: "1", activeType:['10','12']}
        activeType: this.templetType,
        ...{ pageNo: pageNo, pageSize: this.pageSize, name: query, cwType: "1" } // 20200519 应后端要求放开activeType字段不传了
      };
      // console.info("======this.$store.state.cis", this.$store.state.cis);
      if (this.queryName !== query) {
        this.selectOptions = [];
      }
      this.inputTableLoading = true; //增加loading
      getAdviceItemList(data).then(res => {
        if (res.code === 1) {
          let { data } = res;
          // let tableData = this.currentPage !== 0 ? this.selectOptions : [];
          let tableData = []; //取消药品分页
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            tableData.push({
              itemId: item.itemId || "",
              itemCode: item.itemCode || "",
              orderItemName: item.drugName || "",
              production: item.production || "",
              itemType: item.itemType || "",
              classCode: item.classCode || "",
              itemTypeName: item.itemTypeName || "",
              execDeptCode: item.execDeptCode || "",
              execDeptName: item.execDeptName || "",
              spec: item.spec || "",
              price: new Number(item.price).rewToFixed(4) || "",
              unit: item.unit || "",
              relateUnit: item.relateUnit,
              limitUnit: item.limitUnit || "",
              packQuantity: item.packQty || "",
              defaultDosageUnit: item.defaultDosageUnit || "",
              defaultUsage: item.defaultUsage || "",
              dosage: item.dosage || "",
              stockNum: item.stockNum || "",
              manageType: item.manageType || "",
              formCode: item.formCode || "",
              basicType: item.basicType || "",
              unitSaleFlg: item.unitSaleFlg || "",
              reimburseMark: item.reimburseMark || "",
              reimburseName: item.reimburseName || "",
              clinicMark: item.clinicMark || "", //成组样式
              medicareItemCode: item.medicareItemCode || "",
              medicareItemName: item.medicareItemName || "",
              stClassCode: item.stClassCode || "",
              stType: item.stType || "",
              stSolutionType: item.stSolutionType || "",
              stRemindTime: item.stRemindTime || "",
              validTime: item.validTime || "",
              positiveDispense: item.positiveDispense || "",
              applicationRange: item.applicationRange || "",
              executeDepartmentId: item.execDeptCode || ""
            });
          }
          this.selectOptions = tableData;
          this.currentPage = res.pageNo;
          this.pageSize = res.pageSize;
          this.total = res.total;
          this.queryName = query;
        } else {
          this.$message.error(res.msg ? res.msg : "获取数据失败");
        }
        this.inputTableLoading = false; //增加loading
      });
    },
    skinTestController(data) {
      // 选择的时候 applicationRange  0 是全院  1是家床 2是门诊
      // 不是家床 皮试选中
      // 家床 皮试不选中
      // 此处没有禁用处理
      if (data.applicationRange !== "1") {
        // 全院  门诊

        if (data.stType !== "") {
          // 皮试药品勾选皮试
          data.skinTestDisabled = false;
          data.skinTest = "1";
        } else {
          //暂停状态药品（非皮试药品）
          data.skinTestDisabled = true;
          data.skinTest = "0";
        }
        // data.skinTest = "1";
        // data.skinTestDisabled = false;
      } else {
        //家床
        data.skinTestDisabled = true;
        data.skinTest = "0";
      }
    },
    async select(row) {
      // 如果是新增，通知父组件判断是否有相同医嘱
      if (typeof this.currentRow.id === "undefined") {
        // this.$emit("check-dup", row);
      }

      //设置非编辑行
      let {
        visitCode,
        patientId,
        patientCode,
        patientName
      } = this.$store.state.base.receivePatientData; //获取患者信息
      let curObj = this.currentRow;
      let recipeCode = curObj ? curObj["recipeCode"] : ""; //获取当前处方号
      let recipeId = curObj ? curObj["recipeId"] : ""; //获取当前处方号
      let id = curObj ? curObj["id"] : "";
      let qtyStep = 1;
      let data = {
        id: id,
        unitSaleFlg: row.unitSaleFlg, // 1 是可拆分  0 是不可拆分
        qtyStep: qtyStep,
        visitCode: typeof visitCode === "undefined" ? "" : visitCode,
        patientId: patientId,
        patientName: patientName,
        patientCode: patientCode,
        recipeCode: recipeCode,
        recipeId: recipeId,
        orderCat: row.itemType,
        spec: row.spec,
        price: row.price,
        dosage: row.dosage,
        packQuantity: row.packQuantity,
        dosageUnit: row.defaultDosageUnit,
        orderItemName: row.orderItemName,
        orderItemId: row.itemId,
        itemId: row.itemId,
        orderItemCat: row.itemType,
        classCode: row.classCode,
        receiveDept: row.execDeptCode,
        manageType: row.manageType,
        formCode: row.formCode,
        dataVersion: row.dataVersion ? row.dataVersion : 0,
        stockNum: row.stockNum,
        unit: row.limitUnit,
        packUnit: row.unit,
        unitKey: row.unit,
        drugDosage: row.dosage + row.defaultDosageUnit,
        stClassCode: row.stClassCode || "",
        stType: row.stType || "",
        stSolutionType: row.stSolutionType || "",
        stRemindTime: row.stRemindTime || "",
        validTime: row.validTime || "",
        positiveDispense: row.positiveDispense || "",
        applicationRange: row.applicationRange || "",
        execDeptName: row.execDeptName || "",

        execDeptCode: row.execDeptCode,
        executeDepartmentId: row.execDeptCode || ""
      };

      await this.getQtyUnitAjax(data).then(res => {
        data.unitOptions = res;
      });

      this.selectOptions = [];
      this.currentPage = 0;

      this.skinTestController(data);

      // this.currentRow = Object.assign(this.currentRow, data);
      for (let key in data) {
        this.currentRow[key] = data[key];
      }

      // debugger
      //设置选择药品值
      this.drugItem = data;

      // this.selectDrop.displayList.forEach(item => {
      //   if (row[item.prop] !== undefined) {
      //     item.value = row[item.prop];
      //   }
      // });
      // this.updateTableData_list();

      // this.selectDrop.ruleForm = {
      //   ...this.selectDrop.ruleForm,
      //   ...{ unitKey: data.packUnit, dosageUnit: data.dosageUnit }
      // };
      // this.$refs.lInputTable.clear();

      // 更新药品字典查询条件
      // this.changeDrugName({drugName: row.orderItemName});
      // 光标给到输入框
      // document.getElementById("onceDosageInput").focus();

      /*this.$refs.onceDosage.$el
            .getElementsByClassName("el-input__inner")[0]
            .focus();*/

      //焦点定位到关联
      setTimeout(() => {
        let nodeList = getDataIdDom(
          "input",
          "data-id",
          "dosage" + this.currentRow["row_id"]
        );
        if (nodeList.length > 0) {
          nodeList[0].focus();
        }
      }, 10);
    },
    getLabel(optList, key) {
      let obj = optList.find(item => {
        return item.value === key;
      });
      return obj.label;
    },
    // 中草药模板获取 中文单位
    async getChMQtyUnitAjax(data) {
      // 获取单位数据
      let param = [];
      let shows = [];
      let unitOptions = [];
      shows.push(data.unit);
      shows.push(data.packUnit);
      param.push({ code: "DrugUnit", field: "code", shows: shows });
      this.listLoading = true;
      let rep = await getArrayList(param);
      if (rep.code === 1) {
        for (let i = 0; i < rep.data.DrugUnit.length; i++) {
          if (rep.data.DrugUnit[i].name) {
            unitOptions.push({
              label: rep.data.DrugUnit[i].name,
              value: rep.data.DrugUnit[i].code
            });
          }
        }
        this.listLoading = false;
        return unitOptions;
      } else {
        this.$message.error(
          rep.msg ? rep.msg : "获取药品单位有误，请确认无误后再选择！"
        );
        this.listLoading = false;
        return false;
      }
    },
    // code 获取数量单位 中文
    async getQtyUnitAjax(data) {
      // 获取单位数据
      let param = [];
      let shows = [];
      let unitOptions = [];
      shows.push(data.packUnit);
      // 判断药品是否可拆零
      if (
        data.unitSaleFlg === "1" ||
        (data.unitSaleFlg === undefined && data.unit)
      ) {
        shows.push(data.unit);
      }
      param.push({ code: "DrugUnit", field: "code", shows: shows });
      this.listLoading = true;
      try {
        let rep = await getArrayList(param);
        if (rep.code === 1) {
          for (let i = 0; i < rep.data.DrugUnit.length; i++) {
            if (rep.data.DrugUnit[i].name) {
              unitOptions.push({
                label: rep.data.DrugUnit[i].name,
                value: rep.data.DrugUnit[i].code
              });
            }
          }
          this.listLoading = false;
          return unitOptions;
        } else {
          this.listLoading = false;
          this.$message.error(
            rep.msg ? rep.msg : "获取药品单位有误，请确认无误后再选择！"
          );
          return false;
        }
      } catch (e) {
        this.listLoading = false;
        this.$message.error("获取药品单位有误，请确认无误后再选择！");
      }
    },
    async selectDropRow(row) {
      switch (this.templetType) {
        case "10": //西药
          this.select(row);
          break;
        case "11": //中草药
          this.chmDrugSelect(row);
          break;
        default:
          this.nonDrugSelect(row);
      }
    },
    async nonDrugSelect(row) {
      console.log("row:::::::::::", row);
      // 如果是新增，通知父组件判断是否有相同医嘱
      if (typeof this.currentRow.id === "undefined") {
        // this.$emit("check-dup", row);
      }

      //设置非编辑行
      let {
        visitCode,
        patientId,
        patientCode,
        patientName
      } = this.$store.state.base.receivePatientData; //获取患者信息
      let curObj = this.currentRow;
      let recipeCode = curObj ? curObj["recipeCode"] : ""; //获取当前处方号
      let recipeId = curObj ? curObj["recipeId"] : ""; //获取当前处方号
      let id = curObj ? curObj["id"] : "";
      let qtyStep = 1;
      let data = {
        id: id,
        unitSaleFlg: row.unitSaleFlg, // 1 是可拆分  0 是不可拆分
        qtyStep: qtyStep,
        visitCode: typeof visitCode === "undefined" ? "" : visitCode,
        patientId: patientId,
        patientName: patientName,
        patientCode: patientCode,
        recipeCode: recipeCode,
        recipeId: recipeId,
        orderCat: row.itemType,
        spec: row.spec,
        price: row.price,
        dosage: row.dosage,
        packQuantity: row.packQuantity,
        dosageUnit: row.defaultDosageUnit,
        orderItemName: row.orderItemName,
        orderItemId: row.itemId,
        itemId: row.itemId,
        orderItemCat: row.itemType,
        classCode: row.classCode,
        receiveDept: row.execDeptCode,
        manageType: row.manageType,
        formCode: row.formCode,
        dataVersion: row.dataVersion ? row.dataVersion : 0,
        stockNum: row.stockNum,
        unit: row.relateUnit,
        nonDrugUnitKey: row.relateUnit,
        packUnit: row.unit,
        unitKey: row.relateUnit,
        drugDosage: row.dosage + row.defaultDosageUnit,
        stClassCode: row.stClassCode || "",
        stType: row.stType || "",
        stSolutionType: row.stSolutionType || "",
        stRemindTime: row.stRemindTime || "",
        validTime: row.validTime || "",
        positiveDispense: row.positiveDispense || "",
        applicationRange: row.applicationRange || "",
        execDeptName: row.execDeptName || "",
        execDeptCode: row.execDeptCode,
        executeDepartmentId: row.execDeptCode || ""
      };

      this.selectOptions = [];
      this.currentPage = 0;

      // this.currentRow = Object.assign(this.currentRow, data);
      for (let key in data) {
        this.currentRow[key] = data[key];
      }

      //设置选择药品值
      this.drugItem = data;

      //焦点定位到数量
      setTimeout(() => {
        let nodeList = getDataIdDom(
          "div",
          "data-id",
          "qty" + this.currentRow["row_id"]
        );
        if (nodeList.length > 0) {
          nodeList[0].querySelector("input").focus();
        }
      }, 10);
    },
    //单次计量 控制
    inputHandler() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      //console.log('onceDosage:::::::::',this.selectDrop.ruleForm.onceDosage);
      this.inputMaxL = /^\d+\.?\d{0,1}$/.test(currentRow.onceDosage)
        ? null
        : currentRow.onceDosage.length - 1;
      //console.log('onceDosage:::::::::',this.inputMaxL);
      if (!isNaN(currentRow.onceDosage) && currentRow.onceDosage !== "") {
        this.handleQty();
      }
    },
    // 关联医嘱时。获取所关联医嘱的频次、用药方法、用药天数
    relateAdvice() {
      let curObj = this.tableRuleForm.tableData[this.currentRowIndex];

      if (curObj.relation === "" || typeof curObj.relation === "undefined") {
        this.relateAdviceDisabled = false;
        return false;
      }

      let tableData = this.tableRuleForm.tableData;
      let val = null;
      tableData.forEach(item => {
        if (item.no == curObj.relation) {
          val = item;
        }
      });
      if (val === curObj || val === null || curObj.relation <= 0) {
        this.$message.warning("关联医嘱序号有误，请核对后再填写！");
        curObj.relation = undefined;
        this.$set(this.tableRuleForm.tableData, this.currentRowIndex, curObj);
        this.relateAdviceDisabled = false;
        return false;
      }

      if (val !== null) {
        curObj = {
          ...curObj,
          frequencyCode: val.frequencyCode,
          frequencyTimes: val.frequencyTimes,
          frequencyUnit: val.frequencyUnit,
          useWay: val.useWay,
          useDay: val.useDay
        };
        this.$set(this.tableRuleForm.tableData, this.currentRowIndex, curObj);
        this.relateAdviceDisabled = true;
        this.handleQty(val.useDay + "");
      } else {
        this.$message.warning("关联的医嘱序号不存在！");
      }
    },
    // 选中频次处理方法
    handleFreq(value, item) {
      //频率 cycleUnit 统一成 frequencyUnit
      this.freq = {
        ...item,
        ...{
          frequencyUnit: item.cycleUnit
        }
      };
      this.currentRow = {
        ...this.currentRow,
        ...{
          frequencyTimes: item.frequencyTimes,
          frequencyUnit: item.cycleUnit
        }
      };
      this.handleQty();
    },
    // 输入用药天数时，计算数量
    handleQty(value) {
      if (value !== undefined) {
        if (isNaN(value) || value.indexOf("-") >= 0) return;
      }

      this.$nextTick(() => {
        // debugger
        // let { freq, onceDosage } = deepClone(this.currentRow);
        // let rowData = deepClone(this.currentRow);
        let freq =
          Object.keys(this.freq).length > 0 ? this.freq : this.currentRow;
        // let currentRow = deepClone(this.currentRow);
        let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
        let orderItem =
          this.drugItem && this.drugItem.dosage ? this.drugItem : currentRow;
        let onceDosage = currentRow.onceDosage ? currentRow.onceDosage : 0;
        let times = 1;
        try {
          // 修复 currentRow.useDay 没有及时更新 造成 useDay的计算问题
          currentRow.useDay = this.tableRuleForm.tableData[
            this.currentRowIndex
          ].useDay;
        } catch (e) {}
        let useDay =
          typeof currentRow.useDay !== undefined ? currentRow.useDay : 0;

        // if (currentRow.useDay != value) {// 修复 currentRow.useDay 没有及时更新 造成 useDay的计算问题
        //   useDay = value;
        //   this.currentRow.useDay = value;
        // }

        let qty = 0;
        if (freq.frequencyUnit === "天") {
          times = freq.frequencyTimes;
        } else if (freq.frequencyUnit === "周") {
          times = freq.frequencyTimes / 7;
        } else if (freq.frequencyUnit === "月") {
          times = freq.frequencyTimes / 30;
        }

        // 判断药品是否可拆零
        if (
          orderItem.unitSaleFlg === "1" ||
          (orderItem.unitSaleFlg === undefined && orderItem.unit)
        ) {
          // 可拆零，天数*频次*单次剂量/规格
          qty = (useDay * times * onceDosage) / orderItem.dosage;
          // this.currentRow.unitKey = orderItem.unit;
          currentRow.unitKey = orderItem.unit;
        } else {
          qty =
            (useDay * times * onceDosage) /
            orderItem.dosage /
            orderItem.packQuantity;
        }
        qty = Math.ceil(qty); //向上取整  可用天数字段
        qty = isNaN(qty) ? 0 : qty;
        try {
          this.tableRuleForm.tableData[this.currentRowIndex].qty = qty;
        } catch (e) {}

        try {
          this.currentRow.qty = qty;
        } catch (e) {}
        // 计算可用天数
        this.computeAmt();
      });
    },
    // 计算金额
    computeAmt(value) {
      // debugger
      // if (value !== undefined) {
      if (isNaN(value)) value = 0;
      // }
      this.$nextTick(() => {
        // let curObj = deepClone(this.currentRow);
        let curObj = this.tableRuleForm.tableData[this.currentRowIndex];
        let orderItem = { ...curObj, ...this.drugItem };
        let unitKey = curObj.unitKey;
        let qty = curObj.qty;
        // if (this.currentRow.qty != value) {// 修复 currentRow.useDay 没有及时更新 造成 useDay的计算问题
        //   qty = value;
        // }

        let price =
          typeof orderItem.price !== "undefined" ? orderItem.price : 0;
        let packQty = orderItem.packQuantity ? orderItem.packQuantity * 1 : 1;
        let amt = 0; // 金额
        let num = 0; // 预减库存

        // 先判断选中单位是否为包装单位，单位不同，计算规则不同
        if (unitKey === orderItem.packUnit) {
          amt = (price * 100 * qty) / 100; //计算金额
          num = packQty * qty;
        } else {
          amt = ((price * 100) / packQty / 100) * qty; //计算金额
          num = qty;
        }

        this.drugItem.amt = amt;
        let stockNum = 0;
        /*        this.selectDrop.displayList.forEach(item => {
              if (item.prop === "amt") {
                item.value = Math.round(amt * 100) / 100;
              }
              if (item.prop === 'stockNum') {
                  stockNum = item.value * 1;
                }
                if (item.prop === 'preStockNum') {
                  item.value = stockNum - num;
                }
            });*/

        // this.currentRow.amt = Math.round(amt * 100) / 100;
        try {
          this.tableRuleForm.tableData[this.currentRowIndex].amt =
            Math.round(amt * 100) / 100;
        } catch (e) {}
        this.computeDay();
        // this.updateTableData_list();
      });
    },
    // 数量 后面的单位改变
    unitChange(value, row) {
      // this.currentRow.unit = this.getLabel(this.currentRow.unitOptions, value);
      let currentRow = row;

      //备注：如果不可拆零，数量只能是整数
      // 如果可拆零，选择小单位时只能是整数
      if (currentRow.unitSaleFlg === "0") {
        //单位不可拆零 数量只能是整数
        currentRow.qtyStep = 1;
      } else if (currentRow.unitSaleFlg === "1") {
        //单位可拆零 选择小单位时只能是整数
        if (currentRow.packUnit !== value) {
          //最小单位必须是整数
          currentRow.qtyStep = 1;
        } else {
          currentRow.qtyStep = 0.5;
        }
      }
      // console.log("row.trindex:::", row.trindex);
      this.currentRow = row;
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.multipleTable.setCurrentRow(row);
      // row.unit = this.getLabel(row.unitOptions, value);

      this.computeAmt();
    },
    //取消皮试勾选时
    changeSkinTest() {
      let { patientId } = this.$store.state.base.receivePatientData; //获取患者信息
      let drugItem = this.drugItem;
      // 取消皮试且皮试药品类型为必须皮试
      if (!this.currentRow.skinTest && this.drugItem.stType === "1") {
        // 先判断皮试结果是否有效
        getEffectiveRecord({
          patientId: patientId,
          drugId: drugItem.orderItemId
        }).then(res => {
          if (res.code === 1) {
            if (res.data.length === 0 || res.data[0].registerResult !== "2") {
              // 无皮试结果要进行皮试
              this.currentRow.skinTest = "1";
              this.$message.warning("该皮试药品暂无有效结果，必须进行皮试！");
            }
          } else {
            this.$message.error(res.msg ? res.msg : "获取数据失败");
          }
        });
      }
    },
    setDataAddType() {
      let me = this;
      this.tableRuleForm.tableData.forEach(item => {
        // item.type = '';
        me.$set(item, "type", "");
      });
    },
    // 处理用法 函数
    handleUseWay(value, item) {
      if (item.name.indexOf("滴注") === -1 || item.code !== "404") {
        // 清空滴速
        this.currentRow = {
          ...this.currentRow,
          dropRate: "",
          dropRate1: "",
          dropRate2: ""
        };
        this.$set(this.tableRuleForm.tableData, this.currentRowIndex, {
          ...this.tableRuleForm.tableData[this.currentRowIndex],
          dropRate: "",
          dropRate1: "",
          dropRate2: ""
        });
      }
      // useWay 赋值 currentRow
      this.currentRow = {
        ...this.currentRow,
        useWay: value
      };
    },
    //对字段处理
    replaceField(val) {
      let addRowEmpty = {};
      this.tableColumn.forEach(item => {
        addRowEmpty[item.prop] = "";
      });
      //处理数据
      this.tableRuleForm.tableData = val.map((item, index) => {
        addRowEmpty["orderItemName"] = item.itemName;
        addRowEmpty["templetDetailId"] = item.id;
        addRowEmpty["onceDosage"] = item.oneDosage;
        addRowEmpty["no"] = index + 1;
        addRowEmpty["orderStatus"] = "on"; //控制 医嘱名称 显示 input 还是 span
        // addRowEmpty["orderItemCat"] = item.itemCat;
        addRowEmpty["orderCat"] = item.itemCat;
        addRowEmpty["qty"] = item.quantity;
        addRowEmpty["packUnit"] = item.packageUnit;
        addRowEmpty["onceDosage"] = item.oneDosage;
        return { ...addRowEmpty, ...item };
      });
    },
    //获取药库数据
    getDrugStorageList() {
      let data = {
        wmedicinePermit: "1",
        status: "1",
        pageNo: "1",
        pageSize: "100",
        cmedicinePermit: "1"
      };
      getTakingRoomList(data)
        .then(res => {
          if (res.code === 1) {
            this.drugStorageList = res.data;
          } else {
            this.$message.error(res.msg || "取药药房接口错误");
          }
        })
        .catch(error => {
          this.$message.error(error || "取药药房接口错误");
        });
    }
  },
  filters: {
    rounding(value) {
      value = value !== "" ? new Number(value) : 0;
      return value.rewToFixed(4);
    }
  },
  watch: {
    reloadMainTableKey() {
      this.getList();
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.table-utils {
  padding: 5px 10px;
  height: 46px;

  /deep/ .el-button {
    & > i {
      font-size: 18px;
      vertical-align: middle;
    }

    & > span {
      margin-left: 5px;
    }
  }

  .el-button--text,
  .el-button--text:hover {
    font-size: 14px;

    font-weight: 400;
    color: rgba(46, 50, 58, 1);
  }

  /deep/ .el-button [class*="el-icon-"] + span {
    margin-left: 2px;
    /*font-size: 12px;*/
  }

  /deep/ .el-button + .el-button {
    margin-left: 22px;
  }
}

.main-table {
  //table 单元格 样式
  /deep/ .cell-style > .cell {
    padding: 0px;
  }

  /deep/ .rowStyleCls {
    height: 36px;
  }

  .ds-input {
    width: 60px;
  }

  .bunchingUp {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┓";
    }
  }

  .bunchingCenter {
    display: inline-block;
    color: $l-color-primary;

    &::after {
      content: "┫";
    }
  }

  .bunchingDown {
    color: $l-color-primary;
    display: inline-block;

    &::after {
      content: "┛";
    }
  }

  .icon {
    right: 0;
    width: 15px;
    height: 15px;
    color: #ffd2c2;
    top: 0;
    cursor: pointer;
  }
}
</style>
