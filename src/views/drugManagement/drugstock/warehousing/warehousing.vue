<template>
  <el-card class="height100 warelcard position-relative width100" style="padding:16px;">
    <!-- 入库单详情 -->
    <div class="details">
      <div class="css_wareinfo">
        <el-row :gutter="6" class="infotext" style="margin-bottom: 8px;">
          <el-col :span="6">
            <span>入库单号：{{ wareinfo_main.inInventoryNum || "--" }}</span>
          </el-col>
          <el-col :span="5">
            <span>总进价金额：{{ formatNum(totalPrice) }}元</span>
          </el-col>
        </el-row>
        <el-row :gutter="6" style="margin-bottom: 8px;">
          <el-col :span="6">
            <l-formt-title required :disabled="!!wareinfo_main.status" label="入库类型" labelWidth="64">
              <el-select
                :disabled="!!wareinfo_main.status"
                v-model="wareinfo_main.inType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in storageTypeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="8">
            <l-formt-title required :disabled="!!wareinfo_main.status" label="供应商" labelWidth="54">
              <Supplier
                :disabled="!!wareinfo_main.status"
                :value.sync="wareinfo_main.supplierCode"
                @change="clearTable"
              />
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row :gutter="6" class="infotext main-info" style="margin-bottom: 8px;">
          <el-col :span="6">
            <span>状态：</span>
            {{ typeof statusShow[wareinfo_main.status] !== 'undefined' ? statusShow[wareinfo_main.status]: '--' }}
          </el-col>
          <el-col :span="6">
            <span>入库药库：</span>
            <span
              columns="STORAGE_NAME"
              :conditionMap="{ STORAGE_CODE: wareinfo_main.storageCode }"
              tableName="hrp_drgstrg"
              v-tableTransform
            ></span>
          </el-col>
          <el-col :span="6">
            <span>录入人员：{{ wareinfo_main.entryPersonName || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>录入时间：{{ wareinfo_main.entryTime || "--" }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="6" class="infotext main-info" style="margin-bottom: 8px;">
          <el-col :span="6">
            <span>提交人员：{{ wareinfo_main.submitPersonName || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>提交时间：{{ wareinfo_main.submitPersonTime || "--" }}</span>
          </el-col>
        </el-row>
        <el-row class="table-btn" v-if="wareinfo_main.status !== '1'">
          <el-button
            type="text"
            class="float-left cursor-pointer margin-right-10"
            @click="adddrug"
            v-hotKey="{ func: 'func_add2' }"
            :disabled="!isShadow"
          >
            <i class="filter-item iconfont iconxinzeng"></i> 新增药品
          </el-button>
          <el-button
            type="text"
            class="float-left cursor-pointer margin-right-10"
            @click="del"
            v-hotKey="{ func: 'func_delete' }"
            :disabled="!isShadow"
          >
            <i class="filter-item iconfont iconshanchu"></i> 删除
          </el-button>
          <el-button
            type="text"
            class="float-left cursor-pointer margin-right-10"
            @click="dialogFormVisible = true"
            :disabled="!isShadow"
          >
            <i class="filter-item iconfont iconshangchuan"></i> 采购单录入
          </el-button>
        </el-row>
        <!-- 入库单列表 -->
        <el-row class="tablerow">
          <lenterChange :tableData="tableData" @eq="enterlast" class="height100">
            <el-table
              ref="singleTable"
              id="single-table"
              height="100%"
              :data="tableData"
              v-loading="tableLoading"
              border
              stripe
              style="width: 100%"
              highlight-current-row
              @current-change="handleCurrentChange"
              @selection-change="handleSelectionChange"
              @header-dragend="repair"
            >
              <el-table-column
                v-if="wareinfo_main.status !== '1'"
                type="selection"
                width="40"
                fixed
              ></el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                label="药品名称"
                fixed
                prop="drugName"
                width="220"
              >
                <template slot-scope="{ row, $index }">
                  <span
                    v-if="row.drugName"
                    :class="row.flag == true ? 'flagFalse' : 'flagTrue'"
                  >{{ row.drugName }}</span>
                  <drug-info-list
                    v-else
                    suffix-icon="el-icon-search"
                    @send-data="getSearchData($event,$index)"
                    :storageCode="wareinfo_main.storageCode"
                  ></drug-info-list>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="spec"
                label="规格"
                width="180"
              ></el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="inQuantity"
                label="入库数量"
                width="150"
              >
                <template slot-scope="{ row, $index }">
                  <template v-if=" wareinfo_main.status == '1' || wareinfo_main.status == '2'">
                    <span>
                      {{ row.outfit }}
                      <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                    </span>
                    <span v-if="row.bluk !== 0">
                      {{ row.bluk }}
                      <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
                    </span>
                  </template>
                  <template v-else>
                    <div class="noWrap">
                      <span>
                        <el-input v-model="row.outfit" @keyup.native="textValue($event,$index)"></el-input>
                        <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                      </span>
                    </div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                align="right"
                prop
                label="进价(元)"
                width="100"
              >
                <template slot-scope="{ row, $index }">
                  <span
                    v-if="
                      wareinfo_main.status == '1' || wareinfo_main.status == '2'
                    "
                  >{{ formatNum(row.purchasePrice) }}</span>
                  <el-input
                    v-else
                    v-model="row.purchasePrice"
                    @change.native="prcieChange($event,$index)"
                    placeholder
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                align="right"
                prop="price"
                label="售价(元)"
                width="100"
              >
                <template slot-scope="{ row }">
                  <span>{{ formatNum(row.price) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="batchNum"
                label="生产批号"
                width="100"
              >
                <template slot-scope="{ row, $index }">
                  <span
                    v-if="wareinfo_main.status == '1' || wareinfo_main.status == '2'"
                  >{{ row.batchNum }}</span>
                  <batch-list
                    v-else-if="row.drugId"
                    :backDrugName="row.batchNum"
                    :tableData="batchDataList"
                    @query="batchSearch(row, $index)"
                    @select="batchSelect"
                    @send-value="getBatchValue($event, $index)"
                    :tableParams="batchColumn"
                  ></batch-list>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="expDate"
                label="有效期"
                width="220"
              >
                <template slot-scope="{ row }">
                  <span
                    :class="row.flag == true ? 'flagFalse' : 'flagTrue'"
                    v-if=" wareinfo_main.status == '1' || wareinfo_main.status == '2'"
                  >{{ row.expDate }}</span>
                  <el-date-picker
                    :class="row.flag == true ? 'flagFalse' : 'flagTrue'"
                    v-else
                    @change="timeChange(row)"
                    type="datetime"
                    placeholder="选择日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    v-model="row.expDate"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="formCode"
                label="剂型"
                width="150"
              >
                <template slot-scope="{ row }">
                  <span
                    tableName="hrp_form"
                    :conditionMap="{form_code: row.formCode}"
                    columns="form_name"
                    v-tableTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                align="right"
                prop="purchasePriceAmt"
                label="进价金额(元)"
                width="130"
              >
                <template slot-scope="{ row }">
                  <span>{{ formatNum(Math.round(row.purchasePrice * 100 * row.inQuantity / row.packQuantity) / 100) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                align="right"
                prop="priceAmt"
                label="售价金额(元)"
                width="130"
              >
                <template slot-scope="{ row }">
                  <span>{{ formatNum(Math.round(row.price * 100 * row.inQuantity / row.packQuantity) / 100) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="originCode"
                label="生产厂商"
                width="200"
              >
                <template v-slot="{ row }">
                  <span :val="row.originCode" code="Manufacturer" v-codeTransform></span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="originIdentificationCode"
                label="厂商标识"
              >
                <template v-slot="{ row }">
                  <span
                    :val="row.originIdentificationCode"
                    code="DrugManufacturerFlag"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="originManufacturerCode"
                label="源产地"
              >
                <template v-slot="{ row }">
                  <span>{{ row.originManufacturerCode }}</span>
                </template>
              </el-table-column>
            </el-table>
          </lenterChange>
          <div
            v-if="!isShadow"
            @click="validateTips"
            class="position-absolute height100 width100 shadow"
          ></div>
        </el-row>
        <div class="bottom-btn">
          <el-button
            :disabled="!tableData.length"
            class="less-btn float-left"
            type="primary"
            plain
            v-hotKey="{ func: 'func_print' }"
            @click="print"
          >打印</el-button>
          <el-button
            :disabled="!tableData.length"
            class="less-btn float-left"
            type="primary"
            plain
            @click="exportExcel"
          >导出</el-button>
          <el-button
            v-if="wareinfo_main.status == '0'"
            class="less-btn float-right"
            type="primary"
            @click="submitData"
            v-hotKey="{ func: 'func_submit' }"
          >提交</el-button>
          <el-button
            v-if="wareinfo_main.status !== '1'"
            class="less-btn float-right"
            type="primary"
            plain
            @click="save"
            v-hotKey="{ func: 'func_save' }"
          >保存</el-button>
        </div>
      </div>
    </div>
    <!-- 采购单列表 -->
    <l-dialog
      title="采购单列表"
      :visible.sync="dialogFormVisible"
      width="1000px"
      @confirm="determine"
      @cancel="dialogFormVisible = false"
    >
      <template #content>
        <div class="pur-box">
          <div class="pur-list" v-infinite-scroll="loadPurList" infinite-scroll-disabled="disabled">
            <div
              v-for="item in purlist"
              :class="['pur-item', curPurItem.id === item.id ? 'active' : '']"
              :key="item.id"
              @click="choosePur(item)"
            >
              <p>{{item.purchaseNum}}</p>
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
                  <p :title="formatNum(item.totalAmount)">总进价：{{ formatNum(item.totalAmount) }}</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <p :title="item.reviewPersonName">审核人员：{{ item.reviewPersonName }}</p>
                </el-col>
                <el-col :span="12">
                  <p :title="item.reviewTime">时间：{{ item.reviewTime }}</p>
                </el-col>
              </el-row>
            </div>
            <p class="align-center" v-if="purloading">加载中...</p>
            <p class="align-center" v-if="!purloading && noMore">没有更多了</p>
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
              <el-table-column prop="drugName" label="药品名称" header-align="center"></el-table-column>
              <el-table-column prop="spec" label="规格" header-align="center"></el-table-column>
              <el-table-column
                prop="purchasePrice"
                label="进价(元)"
                width="100"
                header-align="center"
                align="right"
              >
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="submitQuantity" label="数量" header-align="center">
                <template slot-scope="{row}">
                  <span>{{ row.shOut }}</span>
                  <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  <template v-if="row.unitSaleFlg === '1' && row.shBl !== 0">
                    <span>{{ row.shBl }}</span>
                    <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
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
import LenterChange from "./component/LEnterChange";
import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
import batchList from "./component/batchList";
import { localCodeTransform } from "@/utils/util";
import hmmBaseApi from "@/api/hmm/base";
import stockWarehousingAPI from "@/api/drugStorage/stock/warehousing";
import mixin from "@/mixins/drugManagement.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import { page } from "@/api/common/allergy";
import stockPurchaseAPI from "@/api/drugStorage/stock/purchase";
import formatNum from "@/utils/formatPrice.js";
import { deepClone } from "@/utils/index.js";
import Supplier from "@/views/drugManagement/drugstock/purchase/component/supplier.vue";
import { mapGetters } from "vuex";

export default {
  mixins: [mixin],
  components: {
    LenterChange,
    drugInfoList,
    batchList,
    Supplier
  },
  props: {
    // 父组件传递的数据
    wareinfo: {
      type: Object
    },
    // 单据状态列表
    recordStatusList: {
      type: Array
    },
    supplierList: {
      type: Array
    }
  },
  data() {
    return {
      statusShow: {
        "0": "未提交",
        "1": "已提交"
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      storageTypeList: [
        {
          name: "直接入库",
          code: "0"
        },
        {
          name: "采购入库",
          code: "1"
        },
        {
          name: "赠送入库",
          code: "2"
        },
        {
          name: "其他入库",
          code: "3"
        }
      ],
      wareinfo_main: {
        // 入库单详情
        inInventoryId: "",
        inInventoryNum: "", // 申请单号
        totalAmt: "", //总进价金额
        supplierCode: "", //供应商
        inType: "", //入库类型code
        storageCode: "", //药库
        entryPersonName: "", // 录入/提交人员
        entryTime: "", // 录入/提交时间
        isEditing: false // 是否为编辑状态
      },
      tableDataflag: "",
      tableData: [], // 申请表格详情
      tableLoading: false,
      batchColumn: [
        {
          prop: "batchNum",
          label: "生产批号",
          width: 120
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          width: 120
        },
        {
          prop: "expDate",
          label: "有效期",
          width: 100
        }
      ],
      batchDataList: [],
      searchParams: {
        drugName: ""
      },
      tableindex: "", //当前编辑index
      selectlist: [], //药品快速选择
      curSelectTableList: [], // 当前已经选中的item
      backDrugName: "",
      // 总金额
      totalPrice: 0,
      dialogFormVisible: false,
      // 采购单列表
      purlist: [],
      purTableData: [],
      curPurItem: {},
      purloading: false,
      purPage: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      purTableLoad: false,
      sureItem: {}
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["currentStorageCode"]),
    isShadow() {
      return (
        this.wareinfo_main.inType !== "" &&
        this.wareinfo_main.supplierCode !== ""
      );
    },
    detailTime() {
      return this.getNowFormatDate().slice(10, 20);
    },
    noMore() {
      return (
        Math.ceil(this.purPage.total / this.purPage.pageSize) <=
        this.purPage.pageNo
      );
    },
    disabled() {
      return this.purloading || this.noMore;
    }
  },
  watch: {
    wareinfo: {
      handler(val) {
        if (val && val.id) {
          this.wareinfo_main = deepClone(val);
          this.getWareD(val.id);
        } else {
          this.wareinfo_main = this.$options.data().wareinfo_main;
          this.tableData = [];
        }
      },
      deep: true
    },
    tableData: {
      deep: true,
      handler(val) {
        this.totalPurchasePrice();
      }
    },
    dialogFormVisible: {
      handler(val) {
        if (val) {
          this.sureItem = {};
          this.purPage.pageNo = 1;
          this.loadPurList();
        }
      }
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    //计算总进价
    totalPurchasePrice() {
      let fullPrice = 0;
      this.tableData.forEach(item => {
        if (item.drugId) {
          fullPrice =
            Math.round(
              fullPrice * 100 +
                (item.purchasePrice * 100 * item.inQuantity) / item.packQuantity
            ) / 100;
        }
      });
      this.totalPrice = fullPrice;
      return fullPrice;
    },
    textValue(e, index) {
      let item = this.tableData[index];
      this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入0或正整数");
        e.target.value = "";
        this.$set(this.tableData[index], "outfit", "");
        this.$set(this.tableData[index], "inQuantity", "");
      } else {
        let num = outfitToBluk(item.outfit, 0, item.packQuantity);
        this.$set(this.tableData[index], "inQuantity", num);
      }
      this.totalPurchasePrice();
    },
    prcieChange(e, index) {
      let re = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,4})?$/;
      let validateResult = re.test(e.target.value);
      if (!validateResult) {
        this.$message.warning("请输入数字");
        e.target.value = "";
        this.$set(this.tableData, index, {
          ...this.tableData[index],
          purchasePrice: ""
        });
      }
    },
    validateTips() {
      this.$message({
        message: "入库类型或供应商不可为空",
        type: "warning"
      });
    },
    refreshList() {
      this.wareinfo_main = this.$options.data().wareinfo_main;
      this.tableData = this.$options.data().tableData;
      this.$emit("search");
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
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
    //初始化根据父组件传递过来wareinfo_main 中的id 查询数据
    getWareD(id) {
      this.tableLoading = true;
      stockWarehousingAPI
        .getInInventoryD(id)
        .then(res => {
          if (res.code == 1) {
            // 通过录入时间（已保存的，未保存的取当前时间）日期来判断这个药是不是快过期了（三个月），过期了标红
            const curTime = this.getNowTime();
            // eslint-disable-next-line complexity
            let list = res.data.map(item => {
              let beginTime = this.wareinfo_main.entryTime || curTime;
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
            this.tableData = list;

            this.$refs.singleTable &&
              this.$refs.singleTable.setCurrentRow(this.tableData[0]);
            list = null;
            this.tableLoading = false;
          }
        })
        .catch(res => {
          this.tableLoading = false;
          this.$message.error(res.msg || "列表数据查询失败");
        });
    },
    handleSelectionChange(list) {
      // 选中表格
      this.curSelectTableList = list;
    },
    //选择有效期
    // eslint-disable-next-line complexity
    timeChange(row) {
      if (row.expDate === null) {
        return;
      }
      const curTime = this.getNowTime();
      let beginTime = this.wareinfo_main.entryTime || curTime;
      let endTime = row.expDate;
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
      if (flag) {
        row.flag = true;
        this.$message.error("药品有效期小于三个月，请确认有效期");
      } else {
        row.flag = false;
      }
    },
    exportExcel() {
      let excelData = {
        title: ["入库单", "", "", "", ""],
        where: [
          "入库单号:" + this.wareinfo_main.inInventoryNum,
          "",
          "",
          "",
          ""
        ],
        tHeader: ["药品名称", "规格", "进价", "售价", "数量"],
        filterVal: ["drugName", "spec", "purchasePrice", "price", "inQuantity"],
        listDate: this.tableData,
        fileName: "入库单",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },
    print() {
      let data = {};
      data.title = "入库单";
      data.num = this.wareinfo_main.inInventoryNum;
      let detailList = this.tableData.map(data => {
        return {
          ...data,
          qty: data.inQuantity
        };
      });
      data.detailList = detailList;
      onPreview(data, "药库药房单据");
    },
    //验证表格时间是否符合规范
    validity() {
      this.tableData.forEach(element => {
        if (element.flag == true) {
          this.tableDataflag = element.flag;
        }
        return;
      });
    },
    // 提交入库单
    submitData() {
      this.filterTableDataEmpty();
      if (this.tableData.length == 0) {
        this.$message.error("入库单明细不可为空");
        return;
      }
      let isRequire = this.fillInComplete();
      if (isRequire) {
        this.$message.error("请全部填写,且进价金额不小于0");
        return;
      }
      this.validity();
      let warnMsg = "";
      if (this.tableDataflag === true) {
        warnMsg = "药品有效期小于三个月，是否继续提交?";
      } else {
        warnMsg = "是否提交当前入库单?";
      }

      this.$confirmFunc({
        titleText: "提示",
        contentText: warnMsg,
        confirm: async (action, instance, done) => {
          this.$showLoading();
          let saveData = {
            ...this.wareinfo_main,
            totalAmt: this.totalPurchasePrice()
          };

          delete saveData.entryTime;
          delete saveData.entryPersonName;
          delete saveData.submitPersonName;
          delete saveData.submitPersonTime;

          let dataList = this.tableData.map(item => {
            return {
              ...item,
              inQuantity: outfitToBluk(
                item.outfit,
                item.bluk,
                item.packQuantity
              )
            };
          });
          saveData.inInventoryDPOList = dataList;
          try {
            let res = await stockWarehousingAPI.saveWarehousingList(saveData);
            if (res.code === 1) {
              this.wareinfo_main = res.data;
              this.tableData = res.data.inInventoryDPOList || [];
              let submitId = this.wareinfo_main.id;
              let result = await stockWarehousingAPI.submitWarehousingList(
                submitId
              );
              if (result.code === 1) {
                this.refreshList();
                this.tableDataflag = "";
                this.$message({
                  type: "success",
                  message: "提交成功!"
                });
              } else {
                this.$message.error(result.msg || "提交失败");
              }
            } else {
              this.$message.error(res.msg || "提交失败");
            }
            done();
            this.$hideLoading();
          } catch (err) {
            done();
            this.$hideLoading();
            this.$message.error(err.msg || "提交失败");
          }
        },
        cancel: () => {
          this.tableDataflag = "";
        }
      });
    },
    // 是否填写完整，没有定位到未填写的第一行
    fillInComplete() {
      // 每个填写项对应单元格的索引
      let focusObj = [
        {
          index: 3,
          name: "outfit",
          title: "入库数量"
        },
        {
          index: 4,
          name: "purchasePrice",
          title: "进价"
        },
        {
          index: 6,
          name: "batchNum",
          title: "生产批号"
        },
        {
          index: 7,
          name: "expDate",
          title: "有效期"
        }
      ];
      let isRequire = this.tableData.findIndex(item => {
        return (
          item.drugName === "" ||
          item.expDate === "" ||
          item.expDate === null ||
          item.batchNum === "" ||
          item.outfit === "" ||
          item.purchasePrice === "" ||
          +item.purchasePrice <= 0
        );
      });
      if (isRequire > -1) {
        this.$refs.singleTable.setCurrentRow(this.tableData[isRequire]);
        for (let i = 0; i < focusObj.length; i++) {
          let item = focusObj[i];
          let idx = item.index;
          // 获取需要聚焦的输入框，如果是进价则转换为数字比较，其他的则判断是否为''，有效期判断增加null(应为清空的时候会变成null)
          let con =
            item.name === "purchasePrice"
              ? this.tableData[isRequire][item.name] === "" ||
                +this.tableData[isRequire][item.name] <= 0
              : this.tableData[isRequire][item.name] === "" ||
                this.tableData[isRequire][item.name] === null;

          if (con) {
            // 聚焦到未输入的输入框
            let dom = document
              .getElementById("single-table")
              .getElementsByClassName("el-table__body-wrapper")[0]
              .getElementsByTagName("tbody")[0]
              .children[isRequire].children[idx].getElementsByTagName(
                "input"
              )[0];
            dom && dom.focus();
            break;
          }
        }
      }
      return !!(isRequire > -1);
    },
    // 保存入库单
    save() {
      this.filterTableDataEmpty();
      if (this.tableData.length == 0) {
        this.$message.error("入库单明细不可为空");
        return;
      }
      let isRequire = this.fillInComplete();
      if (isRequire) {
        this.$message.error("请全部填写,且进价金额不小于0");
        return;
      }

      this.wareinfo_main.totalAmt = this.totalPurchasePrice();
      let saveData = {
        ...this.wareinfo_main
      };

      delete saveData.entryTime;
      delete saveData.entryPersonName;
      delete saveData.submitPersonName;
      delete saveData.submitPersonTime;

      if (this.sureItem && this.sureItem.id) {
        saveData.purchaseId = this.sureItem.id;
      }
      let dataList = this.tableData.map(item => {
        return {
          ...item,
          inQuantity: outfitToBluk(
            item.outfit,
            item.bluk === "" ? 0 : item.bluk,
            item.packQuantity
          )
        };
      });
      saveData.inInventoryDPOList = dataList;
      this.validity();
      let warnMsg = "";
      if (this.tableDataflag === true) {
        warnMsg = "药品有效期小于三个月，是否继续保存?";
      } else {
        warnMsg = "是否保存当前入库单?";
      }

      this.$confirmFunc({
        titleText: "提示",
        contentText: warnMsg,
        confirm: (action, instance, done) => {
          this.$showLoading();
          stockWarehousingAPI
            .saveWarehousingList(saveData)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.wareinfo_main = res.data;
                this.tableData = res.data.inInventoryDPOList || [];
                this.refreshList();
                this.tableDataflag = "";
                this.$message.success(res.msg || "保存成功!");
              } else {
                this.$message.error(res.msg || "保存失败");
              }
            })
            .catch(res => {
              done();
              this.$hideLoading();
              this.$message.error(res.msg || "保存失败");
            });
        },
        cancel: () => {
          this.tableDataflag = "";
        }
      });
    },
    // 删除药品明细
    del() {
      if (this.curSelectTableList.length == 0) {
        this.$message.warning("请选择！");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前入库明细?",
        confirm: (action, instance, done) => {
          let add = this.tableData.filter(
            item =>
              !this.curSelectTableList.some(ele => ele.drugId === item.drugId)
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
    // 新建入库
    newAdd() {
      this.fullReset();
    },
    filterTableDataEmpty() {
      this.tableData = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
    }, //过滤调空白行
    //新增药品
    adddrug() {
      this.backDrugName = "";
      this.filterTableDataEmpty();
      this.tableData.push({
        drugName: "", // 药品名称
        spec: "", // 规格
        dosageValue: "", //剂量
        formCode: "", // 剂型
        drugUnit: "", // 单位
        inQuantity: "", //入库数量
        purchasePrice: "", // 当前进价
        price: "", // 当前售价
        purchasePriceAmt: "", //进价金额
        priceAmt: "", //售价金额
        batchNum: "", //生产批号
        expDate: "", //有效期
        originCode: "", //产地
        originIdentificationCode: "", //产地标识码
        originManuFacturerCode: "", // 源产地
        purchaseDate: this.getNowFormatDate(), //购入时间
        flag: false,
        isEditing: true // 是否为编辑状态
      });
      this.$nextTick(function(){
            //处方列表 定位到最底下 最左面
          let rpTable = this.$refs.singleTable;
          // console.log(rpTable.bodyWrapper);
          rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
          rpTable.bodyWrapper.scrollLeft = 0;
      });

    },
    enterlast() {
      // 键盘Tab 到最后一个 触发回调事件
      this.backDrugName = "";
      this.tableData.map(item => {
        item.isEditing = false;
      });
      this.tableData.push({
        // id: 1,
        drugName: "", // 药品名称
        spec: "", // 规格
        dosageValue: "", //剂量
        formCode: "", // 剂型
        drugUnit: "", // 单位
        inQuantity: "", //入库数量
        purchasePrice: "", // 当前进价
        price: "", // 当前售价
        purchasePriceAmt: "", //进价金额
        priceAmt: "", //售价金额
        batchNum: "", //生产批号
        expDate: "", //有效期
        originCode: "", //产地
        originIdentificationCode: "", //产地标识码
        originManuFacturerCode: "", // 源产地
        purchaseDate: this.getNowFormatDate(), //购入时间
        isEditing: true // 是否为编辑状态
      });
    },
    // 重置入库明细单
    fullReset() {
      this.wareinfo_main = this.$options.data().wareinfo_main;
      this.tableData = this.$options.data().tableData;
    },
    //获取默认当前时间
    getNowFormatDate() {
      var myDate = new Date();
      var year = myDate.getFullYear();
      var month = myDate.getMonth() + 1;
      var date = myDate.getDate();
      var h = myDate.getHours();
      var m = myDate.getMinutes();
      var s = myDate.getSeconds();
      var now =
        year +
        "-" +
        this.getMakeZero(month) +
        "-" +
        this.getMakeZero(date) +
        " " +
        this.getMakeZero(h) +
        ":" +
        this.getMakeZero(m) +
        ":" +
        this.getMakeZero(s);
      return now;
    },
    getMakeZero(s) {
      return s < 10 ? "0" + s : s;
    },
    // 选择左侧采购单
    choosePur(data) {
      this.curPurItem = data;
      if (data.id) {
        this.loadPurItem(data.id);
      }
    },
    loadPurList() {
      let params = {
        ...this.purPage,
        status: "2",
        orderBy: "UPDATED_AT DESC",
        hasInInventoryId: true,
        storageCode: this.currentStorageCode,
        supplierCode: this.wareinfo_main.supplierCode
      };
      this.purloading = true;
      stockPurchaseAPI
        .getPurchaseList(params)
        .then(res => {
          if (res.code === 1) {
            this.purPage = res.pageParams;
            if (this.purPage.pageNo === 1) {
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
    loadPurItem(id) {
      this.purTableLoad = true;
      stockPurchaseAPI
        .getPurchaserDetail(id)
        .then(res => {
          if (res.code === 1) {
            let list = res.data.map(item => {
              let kcnum = blukToOutfit(item.drugStock, item.packQuantity);
              let cgnum = blukToOutfit(item.saveQuantity, item.packQuantity);
              let shnum = blukToOutfit(item.submitQuantity, item.packQuantity);
              return {
                ...item,
                kcOut: kcnum.out,
                kcBl: kcnum.bl,
                cgOut: cgnum.out,
                cgBl: cgnum.bl,
                shOut: shnum.out,
                shBl: shnum.bl
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
    // 采购单录入确定
    determine() {
      let list = this.purTableData.map(item => {
        let { out, bl } = blukToOutfit(item.submitQuantity, item.packQuantity);
        return {
          ...item,
          inQuantity: item.submitQuantity,
          outfit: out,
          bluk: bl,
          expDate: "",
          batchNum: "",
          purchaseDate: this.getNowFormatDate(), //购入时间
          flag: false,
          isEditing: true
        };
      });
      this.tableData = list;
      this.sureItem = { ...this.curPurItem };
      this.dialogFormVisible = false;
    },
    batchSearch(row, index) {
      this.tableindex = index;
      this.getBatchList(row);
    },
    getBatchList(data) {
      let params = {
        drugId: data.drugId,
        hasStock: false,
        supplierCode: this.wareinfo_main.supplierCode,
        storageCode: this.wareinfo_main.storageCode
      };
      hmmBaseApi.getDrugExtBatch(params).then(res => {
        if (res.code === 1) {
          this.batchDataList = res.data;
        }
      });
    },
    batchSelect(row) {
      this.$set(this.tableData, this.tableindex, {
        ...this.tableData[this.tableindex],
        batchNum: row.batchNum,
        expDate: row.expDate,
        purchasePrice: row.purchasePrice
      });
    },
    getBatchValue(val, index) {
      this.$set(this.tableData, this.tableindex, {
        ...this.tableData[this.tableindex],
        batchNum: val
      });
    },
    // 获取药品输入查询组件传过来的药品数据
    getSearchData(row, index) {
      const itemData = this.tableData.find(item => {
        return item.drugId === row.drugId;
      });
      if (itemData) {
        this.$message.warning("已有相同药品");
        return;
      }
      this.$set(this.tableData, index, {
        ...row,
        expDate: "",
        batchNum: "",
        outfit: ""
      });
    },
    // 表格拖动，重新渲染，防止拖动后表格变形
    repair() {
      this.$refs.singleTable && this.$refs.singleTable.doLayout();
    },
    clearTable() {
      this.tableData = [];
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
/deep/.el-date-editor {
  .el-input--medium .el-input__inner {
    padding-left: 36px !important;
  }
}
.warelcard {
  .top-btn {
    overflow: hidden;
    padding: 10px 0;
    border-bottom: 1px solid $l-color-bgcolor-18;
  }

  .bottom-btn {
    padding: 16px 0px 0px;
    // padding: 20px;
  }

  .details {
    height: 100%;
  }

  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .css_wareinfo {
    .el-row {
      // margin-top: 5px;

      .disabled {
        background: $l-color-bgcolor-18;
      }
    }

    .infotext {
      // line-height: 36px;
    }

    .flagFalse {
      color: $l-color-fontcolor-5;
    }
    .flagFalse .el-input__inner {
      border-color: $l-color-fontcolor-5;
      color: $l-color-fontcolor-5;
    }
  }
  .noWrap {
    white-space: nowrap;
    .el-input {
      width: 80px;
    }
  }
}
.main-info {
  margin-top: 0 !important;
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
.table-btn {
  .el-button {
    padding: 0;
    color: $l-color-black;
    font-weight: normal;
    &:hover {
      color: inherit;
    }
  }
}
.align-center {
  line-height: 30px;
  text-align: center;
}
.css_wareinfo {
  height: 100%;
  display: flex;
  flex-direction: column;
  .tablerow {
    position: relative;
    flex: 1;
    overflow: hidden;
  }
}
</style>
