<template>
  <el-card class="height100 position-relative width100" style="padding: 16px">
    <!-- 出库单详情 -->
    <div class="details">
      <div class="css_outStockinfo">
        <el-row :gutter="6" class="infotext" style="margin-bottom: 8px">
          <el-col :span="6">
            <span>出库单号：{{ outStockinfo_main.outInventoryNum }}</span>
          </el-col>
          <el-col :span="6">
            <span>总进价金额：{{ formatNum(totalPrice) }}元</span>
          </el-col>
        </el-row>
        <el-row :gutter="6" style="margin-bottom: 8px">
          <el-col :span="6">
            <l-formt-title
              required
              :disabled="!!outStockinfo_main.status"
              label="出库类型"
              labelWidth="64"
            >
              <el-select
                v-model="outStockinfo_main.outType"
                :disabled="!!outStockinfo_main.status"
                @change="changetype"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in outTypeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <!-- <el-col :span="6" v-if="outStockinfo_main.outType != '2'">
            <l-formt-title required label="目标科室" :disabled="!!outStockinfo_main.status">
              <el-select v-model="outStockinfo_main.deptCode" :disabled="!!outStockinfo_main.status" placeholder="请选择">
                <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>-->
          <el-col :span="6">
            <l-formt-title
              :disabled="
                !isNewAddStatus
                  ? outStockinfo_main.status !== '0'
                    ? true
                    : false
                  : false
              "
              label="备注"
              labelWidth="32"
            >
              <el-input
                :disabled="
                  !isNewAddStatus
                    ? outStockinfo_main.status !== '0'
                      ? true
                      : false
                    : false
                "
                v-model="outStockinfo_main.recordRemark"
                maxlength="200"
                show-word-limit
                placeholder
              ></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row
          :gutter="6"
          class="infotext main-info"
          style="margin-bottom: 8px"
        >
          <el-col :span="6">
            <span>状态：{{ statusCodeToText(outStockinfo_main.status) }}</span>
          </el-col>
          <el-col :span="6">
            <span
              >录入人员：{{ outStockinfo_main.entryPersonName || "--" }}</span
            >
          </el-col>
          <el-col :span="6">
            <span>录入时间：{{ outStockinfo_main.entryTime || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>
              出库药房：
              <span
                columns="STORAGE_NAME"
                :conditionMap="{ STORAGE_CODE: outStockinfo_main.storageCode }"
                tableName="hrp_drgstrg"
                v-tableTransform
              ></span>
            </span>
          </el-col>
        </el-row>
        <el-row
          :gutter="6"
          class="infotext main-info"
          style="margin-bottom: 8px"
        >
          <el-col :span="6">
            <span
              >提交人员：{{ outStockinfo_main.submitPersonName || "--" }}</span
            >
          </el-col>
          <el-col :span="6">
            <span
              >提交时间：{{ outStockinfo_main.submitPersonTime || "--" }}</span
            >
          </el-col>
        </el-row>
        <el-row class="table-btn">
          <el-button
            type="text"
            :disabled="isShadow"
            class="float-left cursor-pointer margin-right-10"
            @click="adddrug"
            v-if="
              outStockinfo_main.status !== '1' &&
                outStockinfo_main.status !== '2' &&
                outStockinfo_main.outType !== '1'
            "
            v-hotKey="{ func: 'func_add2' }"
          >
            <i class="filter-item iconfont iconxinzeng"></i> 新增药品
          </el-button>
          <el-button
            type="text"
            :disabled="isShadow"
            class="float-left cursor-pointer margin-right-10"
            v-if="outStockinfo_main.outType === '1'"
            @click="newlist"
          >
            <i class="filter-item iconfont icontijiao"></i> 申请列表
          </el-button>
          <el-button
            type="text"
            :disabled="isShadow"
            class="float-left cursor-pointer margin-right-10"
            @click="editBatch"
            v-if="
              outStockinfo_main.status !== '1' &&
                outStockinfo_main.status !== '2'
            "
          >
            <i class="filter-item iconfont iconbianjidangan"></i> 修改批次
          </el-button>
          <el-button
            type="text"
            :disabled="isShadow"
            class="float-left cursor-pointer margin-right-10"
            @click="del"
            v-if="
              outStockinfo_main.status !== '1' &&
                outStockinfo_main.status !== '2'
            "
            v-hotKey="{ func: 'func_delete' }"
          >
            <i class="filter-item iconfont iconshanchu"></i>删除
          </el-button>
          <!-- <el-button v-if="
              outStockinfo_main.status !== '1' &&
              outStockinfo_main.status !== '2' &&
              outStockinfo_main.outType !== '1'
            "
            type="text" class="float-left cursor-pointer margin-right-10" @click="dialogFormVisible = true" :disabled="isShadow">
            <i class="filter-item iconfont iconshangchuan"></i> 入库单录入
          </el-button>-->
        </el-row>

        <!-- 出库单table -->
        <el-row
          class="tablerow position-absolute"
          :style="outStockinfo_main.status !== '1' ? 'top:175px' : 'top:140px'"
        >
          <l-tab-change :tableData="tableData" class="height100">
            <el-table
              ref="singleTable"
              height="100%"
              :data="tableData"
              v-if="!mainLoading"
              border
              stripe
              style="width: 100%"
              v-loading="mainLoading"
              highlight-current-row
              @current-change="handleCurrentChange"
              @selection-change="handleSelectionChange"
              @cell-dblclick="dblclick"
              @header-dragend="repair"
            >
              <el-table-column
                v-if="
                  outStockinfo_main.status !== '1' &&
                    outStockinfo_main.status !== '2'
                "
                type="selection"
                width="40"
                key="t1"
              ></el-table-column>
              <el-table-column
                key="t2"
                width="200"
                show-overflow-tooltip
                label="药品名称"
              >
                <template slot-scope="{ row, $index }">
                  <span v-if="row.drugName">{{ row.drugName }}</span>
                  <drug-info-list
                    v-else
                    suffix-icon="el-icon-search"
                    @send-data="getSearchData($event, $index)"
                    :storageCode="outStockinfo_main.storageCode"
                  ></drug-info-list>
                </template>
              </el-table-column>
              <el-table-column
                key="t3"
                prop="spec"
                label="规格"
                show-overflow-tooltip
                width="200"
              ></el-table-column>
              <el-table-column
                key="t12"
                label="生产批号"
                prop="batchNum"
                width="140"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                key="t4"
                label="进价(元)"
                width="120"
                align="right"
                prop="purchasePrice"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                key="t5"
                label="售价(元)"
                width="120"
                align="right"
                prop="price"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.price) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                key="t7"
                width="240"
                label="出库数"
                class-name="outfitNum"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div class="noWrap">
                    <template v-if="!scope.row.isEditing">
                      {{ scope.row.kfOut }}
                    </template>
                    <template v-else>
                      <el-input
                        v-model="scope.row.kfOut"
                        min="1"
                        @keyup.native="outFitChange(scope.$index)"
                        placeholder
                      ></el-input>
                    </template>
                    <span
                      :val="scope.row.drugUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                    <template v-if="scope.row.unitSaleFlg == 1">
                      <template v-if="!scope.row.isEditing">
                        {{ scope.row.kfOutBl }}
                      </template>
                      <template v-else>
                        <el-input
                          v-model="scope.row.kfOutBl"
                          min="1"
                          @keyup.native="outFitChange(scope.$index)"
                          placeholder
                        ></el-input>
                      </template>
                      <span
                        :val="scope.row.packUnit"
                        code="DrugUnit"
                        v-codeTransform
                      ></span>
                    </template>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="库损原因" key="t8" width="200" show-overflow-tooltip v-if="outStockinfo_main.outType == '2'">
                <template slot-scope="scope">
                  <span v-if="!scope.row.isEditing">{{
                    scope.row.outReason
                  }}</span>
                  <el-input v-else v-model="scope.row.outReason" maxlength="200" show-word-limit placeholder></el-input>
                </template>
              </el-table-column>-->

              <!-- <el-table-column key="t11" label="批次" prop="inId" width="140" show-overflow-tooltip></el-table-column> -->

              <el-table-column
                key="t13"
                label="进价总额(元)"
                width="120"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>
                    {{
                      formatNum(
                        Math.round(
                          (scope.row.purchasePrice *
                            100 *
                            scope.row.outQuantity) /
                            scope.row.packQuantity
                        ) / 100
                      )
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                key="t14"
                label="售价总额(元)"
                width="120"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>
                    {{
                      formatNum(
                        Math.round(
                          (scope.row.price * 100 * scope.row.outQuantity) /
                            scope.row.packQuantity
                        ) / 100
                      )
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="有效期"
                width="100"
                prop="expDate"
                :formatter="dateFormat"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column key="t10" label="生产厂商" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span
                    :val="scope.row.originCode"
                    code="Manufacturer"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
              <!-- <el-table-column key="t15" label="管理类型" width="120" prop="manageType" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :val="scope.row.manageType" code="DrugManaType" v-codeTransform></span>
                </template>
              </el-table-column>
              <el-table-column key="t17" label="基本药品类型" width="120" prop="basicType" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :val="scope.row.basicType" code="BasicDrugType" v-codeTransform></span>
                </template>
              </el-table-column>
              -->
            </el-table>
          </l-tab-change>
          <div
            v-if="isShadow"
            @click="validateTips"
            style="position: absolute"
            class="width100 height100 shadow"
          ></div>
        </el-row>
      </div>
    </div>

    <div class="bottom-btn height-button-bottom">
      <el-button
        :disabled="!tableData.length"
        class="less-btn float-left"
        type="primary"
        plain
        @click="print"
        v-hotKey="{ func: 'func_print' }"
        >打印</el-button
      >
      <el-button
        :disabled="!tableData.length"
        class="less-btn float-left"
        type="primary"
        plain
        @click="exportExcel"
        >导出</el-button
      >
      <el-button
        v-if="outStockinfo_main.status == '0'"
        class="less-btn float-right"
        type="primary"
        @click="submitData"
        v-hotKey="{ func: 'func_submit' }"
        >提交</el-button
      >
      <el-button
        v-if="
          outStockinfo_main.status !== '1' && outStockinfo_main.status !== '2'
        "
        class="less-btn float-right"
        type="primary"
        plain
        @click="save()"
        v-hotKey="{ func: 'func_save' }"
        >保存</el-button
      >
    </div>

    <!-- 修改批次 弹窗 -->
    <l-dialog
      :visible.sync="drugVisible"
      :title="this.drugTitleName"
      width="1000px"
      @confirm="conserve"
      @cancel="drugClose"
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
            v-loading="tableLoading"
            element-loading-text="列表正在加载中"
            height="300"
          >
            <el-table-column
              prop="drugName"
              label="药品名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="进价(元)"
              prop="purchasePrice"
              width="120"
              align="righr"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="售价(元)"
              prop="price"
              width="120"
              align="righr"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存量" prop="drugStock" width="140">
              <template slot-scope="scope">
                {{ scope.row.outfit }}
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="scope.row.bluk !== 0">
                  {{ scope.row.bluk }}
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="库发数" prop="backQuantity" width="240">
              <template slot-scope="scope">
                <div class="noWrap">
                  <el-input
                    class="number-input"
                    v-model="scope.row.kfOut"
                    placeholder
                    @keydown.enter.native="
                      nextFocus(scope.row, scope.$index, $event)
                    "
                    @keyup.native="textValueDia($event, scope.$index)"
                  ></el-input>
                  <span
                    :val="scope.row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="scope.row.unitSaleFlg == 1">
                    <el-input
                      class="number-input"
                      v-model="scope.row.kfOutBl"
                      placeholder
                      @keydown.enter.native="
                        nextFocus(scope.row, scope.$index, $event)
                      "
                      @keyup.native="textValueDia($event, scope.$index)"
                    ></el-input>
                    <span
                      :val="scope.row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="生产批号"
              prop="batchNum"
              width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="生产厂商" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  :val="scope.row.originCode"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              label="有效期"
              width="100"
              :formatter="dateFormat"
              prop="expDate"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </el-form>
      </template>
    </l-dialog>

    <!-- 申请列表弹窗 -->
    <outlist
      :id="outStockinfo_main.id"
      v-if="modelVisible"
      :modelVisible.sync="modelVisible"
      :status="outStockinfo_main.status"
      :applyId="outStockinfo_main.applyId"
      @emitModel="emitModel"
      @send-data="getListData"
      :isNewAdd="isNewAddStatus"
    ></outlist>

    <!-- 入库单列表 -->
    <l-dialog
      title="入库单列表"
      :visible.sync="dialogFormVisible"
      width="1000px"
      @confirm="determine"
      @cancel="dialogFormVisible = false"
    >
      <template #content>
        <div class="pur-box">
          <div class="pur-list">
            <div
              v-for="(item, index) in purlist"
              :class="['pur-item', curPurItem.id === item.id ? 'active' : '']"
              :key="index"
              @click="choosePur(item, index)"
            >
              <p>{{ item.inInventoryNum }}</p>
              <p>
                供应商：
                <span
                  class="label2 overflow-point"
                  :val="item.supplierCode"
                  code="DrugSupplier"
                  v-codeTransform
                ></span>
              </p>
              <el-row>
                <el-col :span="12">
                  <p>
                    采购药库：
                    <span
                      columns="STORAGE_NAME"
                      :conditionMap="{ STORAGE_CODE: item.storageCode }"
                      tableName="hrp_drgstrg"
                      v-tableTransform
                    ></span>
                  </p>
                </el-col>
                <el-col :span="12">
                  <p>总进价：{{ formatNum(item.totalAmt) }}元</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <p>提交人员：{{ item.submitPersonName }}</p>
                </el-col>
                <el-col :span="12">
                  <p>时间：{{ item.submitPersonTime }}</p>
                </el-col>
              </el-row>
            </div>
            <p class="align-center" v-if="purloading">加载中...</p>
            <p class="align-center" v-if="noMore">没有更多了</p>
          </div>
          <div class="pur-table">
            <el-table
              :data="purTableData"
              v-loading="purTableLoad"
              height="100%"
              border
              stripe
              style="width: 100%"
            >
              <el-table-column
                prop="drugName"
                header-align="center"
                label="药品名称"
              ></el-table-column>
              <el-table-column
                prop="spec"
                header-align="center"
                label="规格"
              ></el-table-column>
              <el-table-column
                prop="purchasePrice"
                label="进价"
                header-align="center"
                align="right"
              >
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="submitQuantity"
                label="数量"
                header-align="center"
              >
                <template slot-scope="{ row }">
                  <span>{{ row.outfit }}</span>
                  <span
                    :val="row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="row.unitSaleFlg === '1' && row.bluk !== 0">
                    <span>{{ row.bluk }}</span>
                    <span
                      :val="row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
import Outlist from "./component/outlist";
import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
import hmmBaseApi from "@/api/hmm/base";
import stock from "@/api/hmm/stock";
import { localCodeTransform } from "@/utils/util";
import { deepClone } from "@/utils/index.js";
import mixin from "@/mixins/drugManagement.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import stockWarehousingAPI from "@/api/drugStorage/stock/warehousing";
import formatNum from "@/utils/formatPrice.js";

export default {
  components: {
    Outlist,
    drugInfoList
  },
  mixins: [mixin],
  props: {
    outStockinfo: {
      type: Object
    },
    drugStorageList: {
      type: Array
    },
    outTypeList: {
      type: Array
    },
    recordStatusList: {
      type: Array
    }
  },
  data() {
    return {
      inputDoms: null,
      outTypeList1: [
        {
          name: "机构间调拨出库",
          code: "9"
        },
        {
          name: "报废出库",
          code: "2"
        },
        {
          name: "盘亏出库",
          code: "7"
        },
        {
          name: "其他出库",
          code: "8"
        }
      ],
      tableLoading: false,
      //申请列表弹窗默认关闭
      modelVisible: false,
      drugVisible: false,
      drugTitleName: "",
      pageParams: {
        pageNo: 0, // 当前页数
        total: 0, // 总共页数
        pageSize: 10 // 每页数据条数
      },
      outStockinfo_main: {
        // 出库单详情
        id: "",
        status: "",
        outInventoryNum: "", // 申请单号
        totalPurchasePrice: "", //总进价金额
        departmentcode: "", //部门
        outType: "", //出库类型
        // deptCode: "", // 药房
        entryPersonName: "", // 录入/提交人员
        entryTime: "", // 录入/提交时间
        submitPersonName: "", // 录入/提交人员
        submitTime: "", // 录入/提交时间
        // 备注
        recordRemark: "",
        storageCode: "",
        isEditing: true // 是否为编辑状态
      },
      tableData: [], // 申请表格详情
      curTableIndex: "", //新增当前行
      //表格编辑输入药品名称联想药品table数据源
      selectOptions: [],
      // 下拉 table 配置表头
      dropColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          width: 120,
          align: "center"
        },
        {
          prop: "spec",
          label: "规格",
          width: 100,
          align: "center"
        }
      ],
      // 联想搜索数据源
      searchTable: [],
      selectedSearchTableList: [], //弹窗选中的table 列
      curSelectedTableList: [], // 当前已经选中的item
      applyId: "", //申请单Id
      outListData: null,
      // 是否是新增
      isNewAddStatus: false,
      loading: false,
      // 总进价金额
      totalPrice: 0,
      // 申请表格loading
      mainLoading: false,
      dialogFormVisible: false,
      // 入库单列表
      purlist: [],
      purTableData: [],
      curPurItem: {},
      warePage: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      purloading: false,
      purTableLoad: false
    };
  },
  computed: {
    isShadow() {
      return !this.outStockinfo_main.outType;
      // && !this.outStockinfo_main.deptCode
    },
    noMore() {
      return (
        Math.ceil(this.warePage.total / this.warePage.pageSize) <=
        this.warePage.pageNo
      );
    },
    disabled() {
      return this.purloading || this.noMore;
    }
  },
  watch: {
    outStockinfo: {
      handler(val) {
        if (val && val.id) {
          this.isNewAddStatus = false;
          this.getOutStockListD(val.id);
          this.outStockinfo_main = { ...val };
        } else {
          this.outStockinfo_main = this.$options.data().outStockinfo_main;
          this.tableData = [];
        }
      },
      deep: true
    },
    tableData: {
      deep: true,
      handler(val) {
        this.$refs.singleTable && this.$refs.singleTable.doLayout();
        this.totalPurchasePrice();
        this.findAddDateFun();
      }
    },
    dialogFormVisible: {
      handler(val) {
        if (val) {
          this.warePage.pageNo = 1;
          this.getWareList();
        }
      }
    }
  },
  methods: {
    // 找出  是否拥有  新建的数据
    findAddDateFun() {
      let findStyle = false;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id) {
          findStyle = false;
        } else {
          findStyle = true;
          break;
        }
      }
      window.sessionStorage.setItem("findStyle", findStyle);
      return findStyle;
    },
    //  格式化日期
    dateFormat(row, column) {
      const date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return new Date(date).format("yyyy-MM-dd");
    },
    formatNum(num) {
      return formatNum(num);
    },
    statusCodeToText(code) {
      if (code == 0) {
        return "未提交";
      } else if (code == 1) {
        return "已提交";
      } else if (code == 2) {
        return "目标库房已确认";
      }
      return "--";
    },
    totalPurchasePrice() {
      let amt = 0;
      this.tableData.forEach(item => {
        if (item.drugId) {
          amt =
            Math.round(
              amt * 100 +
                (item.purchasePrice * 100 * item.outQuantity) /
                  item.packQuantity
            ) / 100;
        }
      });
      this.totalPrice = amt;
      return amt;
    },
    validateTips() {
      this.$message({
        message: "出库类型或药房不可为空",
        type: "warning"
      });
    },
    refreshList() {
      this.outStockinfo_main = this.$options.data().outStockinfo_main;
      this.tableData = this.$options.data().tableData;
      this.$emit("search");
    },
    //查询明细
    getOutStockListD(id) {
      this.mainLoading = true;
      stock
        .getOutStockListDetail(id)
        .then(res => {
          if (res.code == 1) {
            this.tableData = this.changeNum(res.data);
          } else {
            this.$message.error(res.msg || "获取入库单明细数据失败");
          }
          this.mainLoading = false;
        })
        .catch(res => {
          this.mainLoading = false;
          this.$message.error(res.msg || "获取入库单明细数据失败");
        });
    },
    //切换出库方式
    changetype() {
      this.$nextTick(() => {
        this.$refs.singleTable && this.$refs.singleTable.doLayout();
      });
      if (this.outStockinfo_main.outType == "1") {
        this.modelVisible = true;
      }
    },
    handleSelectionChange(list) {
      // 选中表格
      this.curSelectedTableList = list;
    },
    exportExcel() {
      let nums = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".outfitNum"
      );
      let tableData_new = this.tableData.map((item, i) => {
        return Object.assign(item, { _num: nums[i].innerText });
      });
      let excelData = {
        title: ["出库单", "", "", "", ""],
        where: [
          "出库单号:" + this.outStockinfo_main.outInventoryNum,
          "",
          "",
          "",
          ""
        ],
        tHeader: ["药品名称", "规格", "进价(元)", "售价(元)", "数量"],
        filterVal: ["drugName", "spec", "purchasePrice", "price", "_num"],
        listDate: tableData_new,
        fileName: "出库单",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },
    print() {
      let data = {};
      data.title = "出库单";
      data.num = this.outStockinfo_main.outInventoryNum;
      let detailList = this.tableData.map(data => {
        return {
          ...data,
          qty: data.outQuantity
        };
      });
      data.detailList = detailList;
      onPreview(data, "药库药房单据");
    },
    async submitData(params) {
      // 传params表示提交操作，不传为保存
      if (!params) {
        this.$message({
          type: "success",
          message: "保存成功!"
        });
        this.$hideLoading();
        if (this.outStockinfo_main.id) {
          this.getOutStockListD(this.outStockinfo_main.id);
        }
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否提交当前出库单?",
        confirm: async (action, instance, done) => {
          this.$showLoading();
          let submitId = this.outStockinfo_main.id;
          await stock
            .submitOutStockList(submitId)
            .then(res => {
              this.$hideLoading();
              this.refreshList();
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "提交成功!"
                });
              } else {
                this.$message.error(res.msg || "提交失败");
              }
              done();
            })
            .catch(res => {
              done();
              console.log(res, "提交报错");
              this.$hideLoading();
              this.$message.error(res.msg || "提交失败");
            });

          if (this.outStockinfo_main.id) {
            this.getOutStockListD(this.outStockinfo_main.id);
          }
        }
      });
    },
    // 保存出库单
    save(params) {
      //过滤掉空白行
      this.tableData = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      // 传params表示提交操作，不传为保存
      if (this.tableData.length == 0) {
        this.$message.error("出库单明细不可为空");
        return;
      }
      let msgTips, scuMsg;
      if (params) {
        msgTips = "是否提交当前出库单?";
        scuMsg = "提交";
      } else {
        msgTips = "是否保存当前出库单?";
        scuMsg = "保存";
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: msgTips,
        confirm: async (action, instance, done) => {
          this.$showLoading();
          let data;
          // 修改传id
          if (this.isNewAddStatus) {
            data = {
              dataVersion: 0
            };
          } else {
            data = {
              id: this.outStockinfo_main.id,
              dataVersion: this.outStockinfo_main.dataVersion,
              storageCode: this.outStockinfo_main.storageCode
            };
          }
          let saveData = {
            ...data,
            applyId: this.outStockinfo_main.applyId,
            totalAmt: this.totalPurchasePrice(),
            outInventoryNum: this.outStockinfo_main.outInventoryNum,
            departmentcode: this.outStockinfo_main.departmentcode,
            outType: this.outStockinfo_main.outType,
            // deptCode: this.outStockinfo_main.deptCode,
            recordRemark: this.outStockinfo_main.recordRemark,
            outInventoryDPOList: this.tableData || ""
          };

          delete saveData.entryTime;
          delete saveData.entryPersonName;
          delete saveData.submitPersonName;
          delete saveData.submitPersonTime;

          try {
            let res = await stock.saveOutStockList(saveData);
            if (res.code === 1) {
              window.sessionStorage.setItem("findStyle", false);
              this.outStockinfo_main = res.data;
              this.tableData = res.data.outInventoryDPOList || [];
              this.$refs.singleTable &&
                this.$refs.singleTable.setCurrentRow(this.tableData[0]);
              this.refreshList();
            } else {
              this.$message.error(res.msg || scuMsg + "失败!");
            }
            done();
            this.$hideLoading();
          } catch (err) {
            done();
            this.$hideLoading();
            this.$message.error(err.msg || scuMsg + "失败!");
          }
        }
      });
    },
    del() {
      // 删除
      if (this.curSelectedTableList.length == 0) {
        this.$message.warning("请选择！");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前出库明细?",
        confirm: (action, instance, done) => {
          let add = this.tableData.filter(
            item =>
              !this.curSelectedTableList.some(
                ele => ele.drugId === item.drugId && ele.inId === item.inId
              )
          );
          this.tableData = add;
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          done();
        }
      });
    },
    newAdd() {
      // 新建入库
      this.isNewAddStatus = true;
      this.outStockinfo_main = this.$options.data().outStockinfo_main;
      this.tableData = this.$options.data().tableData;
    },
    //出库列表
    newlist() {
      this.modelVisible = true;
    },
    // 监测弹窗是否关闭
    emitModel(res) {
      this.modelVisible = res;
    },
    filterTableDataEmpty() {
      this.tableData = this.tableData.filter(item => {
        return item.drugId;
      });
    }, //过滤调空白行
    //新增药品
    adddrug() {
      if (this.outStockinfo_main.status == "1") {
        this.$message.warning("当前单号已提交不可编辑");
        return;
      }
      if (!this.outStockinfo_main.outType && !this.outStockinfo_main.deptCode) {
        this.validateTips();
        return;
      }
      if (this.outStockinfo_main.status != "1") {
        this.filterTableDataEmpty();
        this.tableData.push({
          drugName: "", // 药品名称
          spec: "", // 规格
          stock: "", // 库存
          purchasePrice: "", // 进价
          price: "", // 售价
          recordRemark: "", // 备注
          scrapnumber: "", //库存量
          outnumber: "", //库发数
          storageType: "", //报废原因
          scrapcause: "", //报废数
          supplier: "", //生产厂商
          inId: "", //批次
          batchNum: "", //生产批号
          totalPurchasePrice: "", //进价总额
          totalPrice: "", //售价总额
          isEditing: true // 是否为编辑状态
        });
        this.outStockinfo_main.isEditing = false;
      }
      this.$nextTick(function() {
        //处方列表 定位到最底下 最左面
        let rpTable = this.$refs.singleTable;
        // console.log(rpTable.bodyWrapper);
        rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
        rpTable.bodyWrapper.scrollLeft = 0;
      });
    },
    //回填，显示批次信息
    select(row, $index) {
      this.selectOptions = [];
      this.drugTitleName = row.drugName + row.spec;
      this.drugVisible = true; //打开药品批次列表弹框

      let searchParams = {
        ...this.pageParams,
        drugId: row.drugId
      };

      this.searchTable = [];

      this.getDrugBatchList(searchParams);
    },
    //获取联想搜索结果
    getDrugBatchList(params) {
      this.tableLoading = true;
      this.searchTable = [];
      hmmBaseApi
        .getAssociationBatch(params)
        .then(res => {
          if (res.code !== 1) {
            this.$message.error(res.msg || "药品批次查询失败");
            this.tableLoading = false;
            return;
          }
          if (res.data.length === 0) {
            this.$message.error("暂无药品批次数据");
            this.tableLoading = false;
            return;
          }
          let list = res.data.map(drugWapper => {
            let { out, bl } = blukToOutfit(
              drugWapper.drugStock,
              drugWapper.packQuantity
            );
            return {
              ...drugWapper,
              drugStock: drugWapper.drugStock || 0,
              outfit: out,
              bluk: bl,
              purchasePrice: drugWapper.purchasePrice || 0,
              price: drugWapper.price || 0,
              outQuantity: "",
              kfOut: "",
              isEditing: true
            };
          });
          this.searchTable = list;
          this.searchTable.forEach((item, index) => {
            const ele = this.tableData.find(it => it.inId === item.inId);
            if (ele && ele.kfOutBl) {
              console.log(`1111`, 1111);
              this.$set(this.searchTable, index, {
                ...this.searchTable[index],
                outQuantity: ele.backQuantity,
                kfOut: ele.kfOut,
                kfOutBl: ele.kfOutBl
              });
            } else if (ele) {
              console.log(`2222`, 2222);
              this.$set(this.searchTable, index, {
                ...this.searchTable[index],
                outQuantity: ele.backQuantity,
                kfOut: ele.kfOut
              });
            }
          });
          const curItemIndex = this.searchTable.findIndex(
            item => item.inId === this.tableData[this.curTableIndex].inId
          );
          this.$nextTick(() => {
            const idx = curItemIndex > -1 ? curItemIndex : 0;
            // 聚焦到指定行的输入框
            this.$refs.diagTable.$el
              .getElementsByClassName("el-table__body-wrapper")[0]
              .getElementsByTagName("tbody")[0]
              .children[idx].getElementsByClassName("number-input")[0]
              .getElementsByTagName("input")[0]
              .focus();
            this.inputDoms = this.initInputDOM();
          });
          this.tableLoading = false;
        })
        .catch(res => {
          this.tableLoading = false;
          this.$message.error(res.msg || "药品批次查询失败");
        });
    },
    //表格双击事件(如果存在历史记录，就显示前端缓存？)
    dblclick(row) {
      // 双击行修改批次
      if (
        this.outStockinfo_main.status === "1" ||
        this.outStockinfo_main.status === "2"
      ) {
        this.$message.error("出库单已提交，不可修改");
        return;
      }
      // 获取选中的表格的index
      this.curTableIndex = this.tableData.findIndex(
        (item, index) => item.inId === row.inId && item.drugId === row.drugId
      );
      if (this.curTableIndex === -1) {
        return;
      }
      this.drugTitleName = row.drugName + row.spec;
      this.drugVisible = true;

      let searchParams = {};
      searchParams = { ...this.pageParams };
      searchParams.drugId = row.drugId;
      this.searchTable = [];
      this.getDrugBatchList(searchParams);
    },
    drugClose() {
      this.drugVisible = false;
    },
    //按批次出库确认
    // eslint-disable-next-line complexity
    async conserve() {
      console.log("保存----------");
      this.selectedSearchTableList = [];
      this.searchTable.forEach(item => {
        // console.group("debugger");
        // console.log(`item.kfOut`, item.kfOut);
        // console.log(`item.kfOutBl`, item.kfOutBl);
        // console.log(`item`, JSON.parse(JSON.stringify(item)));
        // console.groupEnd();
        if (item.kfOut !== "" && item.kfOut != 0) {
          let data = {
            ...item,
            outQuantity: outfitToBluk(
              item.kfOut,
              item.kfOutBl || 0,
              item.packQuantity
            ),
            outInventoryNum: this.outStockinfo_main.outInventoryNum,
            outInventoryId: this.outStockinfo_main.id
          };
          this.selectedSearchTableList.push(data);
        } else {
          if (item.kfOutBl && item.kfOutBl !== "" && item.kfOutBl != 0) {
            let data = {
              ...item,
              outQuantity: outfitToBluk(
                item.kfOut || 0,
                item.kfOutBl,
                item.packQuantity
              ),
              outInventoryNum: this.outStockinfo_main.outInventoryNum,
              outInventoryId: this.outStockinfo_main.id
            };
            this.selectedSearchTableList.push(data);
          }
        }
      });
      if (this.selectedSearchTableList.length == 0) {
        this.$message.warning("请填写库发数");
        return;
      }
      let checkedList = this.selectedSearchTableList.filter(
        item => item.outQuantity > item.drugStock
      );
      if (checkedList.length > 0) {
        this.$message.warning("库发数不能大于库存量");
        return;
      }

      if (this.outStockinfo_main.outType === "1") {
        // 申请出库时，修改批次时候保证申请列表的批次数据跟修改的一样
        this.$showLoading();
        try {
          let res = await stock.saveBatch({
            outInventoryDPOList: this.selectedSearchTableList
          });
          if (res.code === 1) {
            this.$message.success("修改成功");
            this.getOutStockListD(this.outStockinfo_main.id);
          } else {
            this.$message.error(res.msg || "修改失败");
          }
          this.$hideLoading();
        } catch (err) {
          this.$hideLoading();
          this.$message.error(err.msg || "修改失败");
        }
      } else {
        if (!this.tableData[this.curTableIndex].inId) {
          this.tableData.splice(this.curTableIndex, 1);
        }
        this.tableData = this.tableData.filter(item => {
          return Boolean(item.drugId);
        });
        const len = this.tableData.length - 1;
        for (let i = len; i >= 0; i--) {
          for (let j = 0; j < this.selectedSearchTableList.length; j++) {
            if (
              (this.selectedSearchTableList[j].kfOut === "" &&
                this.selectedSearchTableList[j].kfOutBl === "") ||
              (this.selectedSearchTableList[j].kfOut === 0 &&
                this.selectedSearchTableList[j].kfOutBl === 0) ||
              (this.selectedSearchTableList[j].kfOut === undefined &&
                this.selectedSearchTableList[j].kfOutBl === undefined)
            ) {
              this.tableData.splice(i, 1);
              break;
            }
            if (
              this.tableData[i].inId === this.selectedSearchTableList[j].inId
            ) {
              this.tableData.splice(i, 1);
              break;
            }
          }
        }
        this.tableData = this.tableData.concat(this.selectedSearchTableList);
      }
      this.drugVisible = false;
      this.$nextTick(() => {
        this.adddrug();
      });
    },
    //子父组件传值
    getMsgFormSon(data) {
      this.tableData.push(...data.selectApplyList);
      this.applyId = data.applyId;
    },
    tablast() {
      // 键盘Tab 到最后一个 触发回调事件
      this.tableData.map(item => {
        item.isEditing = false;
      });
      this.tableData.push({
        id: "",
        drugName: "", // 药品名称
        spec: "", // 规格
        stock: "", // 库存
        purchasePrice: "", // 进价
        price: "", // 售价
        recordRemark: "", // 备注
        drugStock: "", //库存量
        outQuantity: "", //库发数or报废数
        outReason: "", //报废原因
        supplierCode: "", //生产厂商
        inId: "", //批次
        batchNum: "", //生产批号
        PurchasePriceAmt: "", //进价总额
        totalPrice: "", //售价总额
        isEditing: true // 是否为编辑状态
      });
    },
    // 库发数输入时根据整装数量转换成散装数量
    outFitChange(index) {
      this.validateResult = new RegExp("^[1-9]{1}[0-9]*$").test(
        this.tableData[index].kfOut
      );
      if (!this.validateResult) {
        this.$message.warning("请输入大0自然数");
        this.$set(this.tableData[index], "kfOut", "");
        this.tableData[index].kfOutBl &&
          this.$set(this.tableData[index], "kfOutBl", "");
      }
      let kfOutBl = this.tableData[index].kfOutBl || 0;
      let bluk = outfitToBluk(
        this.tableData[index].kfOut,
        kfOutBl,
        this.tableData[index].packQuantity
      );
      this.$set(this.tableData[index], "outQuantity", bluk);
    },
    initInputDOM() {
      const inputDoms = document.querySelectorAll(
        ".number-input .el-input__inner"
      );
      inputDoms.forEach((item, index) => {
        item.setAttribute("diag-index", index);
      });
      return inputDoms;
    },
    // 弹窗回车
    nextFocus(arr, scope, event) {
      const index = event.target.getAttribute("diag-index");
      const nextIndex = parseInt(index) + 1;
      const length = this.inputDoms.length;
      console.log(`this.inputDoms`, this.inputDoms);
      console.log(`this.inputDoms[nextIndex]`, this.inputDoms[nextIndex]);
      if (nextIndex < length) {
        this.inputDoms[nextIndex].focus();
      } else {
        this.conserve();
      }
    },
    // 弹窗库发数修改
    textValueDia(e, index) {
      // let validateResult = new RegExp("^[1-9]{1}[0-9]*$").test(e.target.value);
      // if (!validateResult) {
      //   this.$message.warning("请输入大0自然数");
      //   e.target.value = "";
      //   return false;
      // }
      let kfOutBl = this.searchTable[index].kfOutBl || 0;
      let bluk = outfitToBluk(
        this.searchTable[index].kfOut,
        kfOutBl,
        this.searchTable[index].packQuantity
      );
      this.$set(this.searchTable[index], "outQuantity", bluk);
    },
    changeNum(data) {
      let list = data.map(item => {
        let kfnum = blukToOutfit(item.outQuantity, item.packQuantity);
        return {
          ...item,
          kfOut: kfnum.out,
          kfOutBl: kfnum.bl
        };
      });
      return list;
    },
    // 左侧列表根据出库单号搜索
    getListData(data) {
      this.$emit("left-refresh", data);
    },
    editBatch() {
      if (this.curSelectedTableList.length == 0) {
        this.$message.warning("请选择！");
        return;
      }
      if (this.curSelectedTableList.length > 1) {
        this.$message.warning("只能选一条记录！");
        return;
      }
      console.log(this.curSelectedTableList[0]);
      console.log(this.mixinsCurrentDrugItem);
      // 从mixins里取当前高亮药品
      this.dblclick(this.curSelectedTableList[0]);
    },
    // 选择左侧入库单
    choosePur(data) {
      this.curPurItem = data;
      if (data.id) {
        this.loadPurItem(data.id);
      }
    },
    // 获取入库单列表
    getWareList() {
      let params = {
        ...this.warePage,
        orderBy: "UPDATED_AT DESC",
        status: "1"
      };
      this.purloading = true;
      stockWarehousingAPI
        .getWarehousingList(params)
        .then(res => {
          if (res.code === 1) {
            this.warePage = res.pageParams;
            if (this.warePage.pageNo === 1) {
              this.purlist = res.data;
              this.purlist[0] && this.choosePur(this.purlist[0]);
            } else {
              this.purlist = this.purlist.concat(res.data);
            }
          }
          this.purloading = false;
        })
        .catch(err => {
          this.purloading = false;
        });
    },
    // 获取当前时间的年月日时分秒
    getNowTime() {
      var date = new Date();
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.date = date.getDate();
      this.hour =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      this.minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      this.second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      this.milliSeconds = date.getMilliseconds();
      var currentTime =
        this.year +
        "-" +
        this.month +
        "-" +
        this.date +
        " " +
        this.hour +
        ":" +
        this.minute +
        ":" +
        this.second +
        "." +
        this.milliSeconds;
      return currentTime;
    },
    loadPurItem(id) {
      this.purTableLoad = true;
      stockWarehousingAPI
        .getInInventoryD(id)
        .then(res => {
          if (res.code === 1) {
            // 通过录入时间（已保存的，未保存的取当前时间）日期来判断这个药是不是快过期了（三个月），过期了标红
            const curTime = this.getNowTime();
            // eslint-disable-next-line complexity
            let list = res.data.map(item => {
              let beginTime = this.outStockinfo_main.entryTime || curTime;
              let endTime = item.expDate;
              let arr1 = beginTime.split("-");
              let arr2 = endTime.split("-");
              arr1[1] = parseInt(arr1[1]);
              arr1[2] = parseInt(arr1[2]);
              arr2[1] = parseInt(arr2[1]);
              arr2[2] = parseInt(arr2[2]);
              let flag = true;
              if (arr1[0] == arr2[0]) {
                //同年
                if (arr2[1] - arr1[1] > 3) {
                  //月间隔超过3个月
                  flag = false;
                } else if (arr2[1] - arr1[1] == 3) {
                  //月相隔3个月，比较日
                  if (arr2[2] > arr1[2]) {
                    //结束日期的日大于开始日期的日
                    flag = false;
                  }
                }
              } else {
                //不同年
                if (arr2[0] - arr1[0] > 1) {
                  flag = false;
                } else if (arr2[0] - arr1[0] == 1) {
                  if (arr1[1] < 10) {
                    //开始年的月份小于10时，不需要跨年
                    flag = false;
                  } else if (arr1[1] + 3 - arr2[1] < 12) {
                    //月相隔大于3个月
                    flag = false;
                  } else if (arr1[1] + 3 - arr2[1] == 12) {
                    //月相隔3个月，比较日
                    if (arr2[2] > arr1[2]) {
                      //结束日期的日大于开始日期的日
                      flag = false;
                    }
                  }
                }
              }
              let { out, bl } = blukToOutfit(
                item.inQuantity,
                item.packQuantity
              );
              return {
                ...item,
                outfit: out,
                bluk: bl,
                flag
              };
            });
            this.purTableData = list;
          }
          this.purTableLoad = false;
        })
        .catch(err => {
          this.purTableLoad = false;
        });
    },
    determine() {
      let list = this.purTableData.map(item => {
        let { out, bl } = blukToOutfit(item.inQuantity, item.packQuantity);
        return {
          ...item,
          outQuantity: item.inQuantity,
          kfOut: out,
          isEditing: true
        };
      });
      this.tableData = list;
      this.dialogFormVisible = false;
    },
    // 获取药品输入查询组件传过来的药品数据
    getSearchData(row, index) {
      this.curTableIndex = index;
      this.drugTitleName = row.drugName + row.spec;
      console.log(row, 1111);
      this.drugVisible = true; //打开药品批次列表弹框

      let searchParams = {
        pageNo: 1,
        pageSize: 10000,
        drugId: row.drugId
      };
      this.getDrugBatchList(searchParams);
    },
    // 表格拖动，重新渲染，防止拖动后表格变形
    repair() {
      this.$refs.singleTable && this.$refs.singleTable.doLayout();
    }
  }
};
</script>

<style lang="scss" scoped>
.shadow {
  left: 0;
  top: 0;
  background: $l-color-black;
  opacity: 0.05;
  transition: all 2s;
  z-index: 999;
}

.el-card {
  padding: 0 20px;

  .top-btn {
    overflow: hidden;
    padding: 10px 0;
    border-bottom: 1px solid $l-color-bgcolor-18;
  }

  .bottom-btn {
    padding: 16px 0px 0px;
  }

  .details {
    height: calc(100% - 64px);
  }

  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .css_outStockinfo {
    .el-row {
      // margin-top: 5px;

      .disabled {
        background: $l-color-bgcolor-18;
      }
    }

    .infotext {
      // line-height: 36px;
    }
  }
}

.noWrap {
  white-space: nowrap;

  .el-input {
    width: 80px;
  }
}

.position-absolute {
  top: 165px;
  left: 16px;
  right: 16px;
  bottom: 76px;
}

.main-info {
  margin-top: 0 !important;
}

.table-btn {
  .el-button {
    padding: 0;
    color: $l-color-black;
    font-weight: normal;
  }
}

.pur-box {
  height: 350px;
  overflow: hidden;

  .pur-list {
    width: 330px;
    height: 100%;
    float: left;
    background-color: #fafafa;
    overflow-y: auto;

    .pur-item {
      padding: 10px;

      &:nth-child(even) {
        background-color: $l-color-bgcolor-14;
      }

      &.active {
        background-color: $l-color-bgcolor-12;
      }

      p {
        line-height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .pur-table {
    padding: 10px;
    margin-left: 330px;
    height: 100%;
    overflow: hidden;
  }
}

.align-center {
  line-height: 30px;
  text-align: center;
}
</style>
