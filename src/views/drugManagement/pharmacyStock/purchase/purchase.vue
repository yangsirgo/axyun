<template>
  <el-card class="height100 position-relative width100" style="padding: 16px">
    <!-- 采购单详情 -->
    <div class="details" v-loading="tableLoad">
      <div class="css_purchaseinfo width100 height100">
        <el-row :gutter="6" class="infotext" style="margin-bottom: 8px">
          <el-col :span="6">
            <span>采购单号：{{ purchaseInfo_main.purchaseNum || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>
              总进价金额：{{
                shStatus.includes(purchaseInfo_main.status)
                  ? formatNum(shTotalPrice)
                  : formatNum(cgTotalPrice)
              }}元
            </span>
          </el-col>
        </el-row>
        <el-row :gutter="6" style="margin-bottom: 8px">
          <!-- <el-col :span="6">
            <l-formt-title required :disabled="purchaseInfo_main.status==1||purchaseInfo_main.status==2" label="供应商"
              labelWidth="54">
              <Supplier :disabled="purchaseInfo_main.status==1||purchaseInfo_main.status==2" :value.sync="purchaseInfo_main.supplierCode"
                @change="clearTable" />
            </l-formt-title>
          </el-col> -->
          <el-col :span="6">
            <l-formt-title
              :disabled="
                purchaseInfo_main.status == 1 || purchaseInfo_main.status == 2
              "
              required
              class="form-item"
              label="采购药房"
              labelWidth="64"
            >
              <el-input
                v-model="purchaseInfo_main.storageCodeName"
                disabled
              ></el-input>
              <!-- <el-input v-model="purchaseInfo_main.storageCode" disabled></el-input> -->
              <!-- <el-select :disabled="purchaseInfo_main.status==1||purchaseInfo_main.status==2" v-model="purchaseInfo_main.storageCode"
                placeholder="请选择" @change="clearTable">
                <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select> -->
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title
              :disabled="
                purchaseInfo_main.status === '1' ||
                  purchaseInfo_main.status === '2'
              "
              label="备注"
              labelWidth="32"
            >
              <el-input
                :disabled="
                  purchaseInfo_main.status === '1' ||
                    purchaseInfo_main.status === '2'
                "
                v-model="purchaseInfo_main.recordRemark"
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
            <span
              >状态：{{
                typeof statusShow[purchaseInfo_main.status] !== "undefined"
                  ? statusShow[purchaseInfo_main.status]
                  : "--"
              }}</span
            >
          </el-col>
          <el-col :span="6">
            <span
              >录入人员：{{ purchaseInfo_main.entryPersonName || "--" }}</span
            >
          </el-col>
          <el-col :span="6">
            <span>录入时间：{{ purchaseInfo_main.entryTime || "--" }}</span>
          </el-col>
        </el-row>
        <el-row
          :gutter="6"
          class="infotext main-info"
          style="margin-bottom: 8px"
        >
          <el-col :span="6">
            <span
              >提交人员：{{ purchaseInfo_main.submitPersonName || "--" }}</span
            >
          </el-col>
          <el-col :span="6">
            <span
              >提交时间：{{ purchaseInfo_main.submitPersonTime || "--" }}</span
            >
          </el-col>
          <!-- <el-col :span="6">
            <span>审核人员：{{ purchaseInfo_main.reviewPersonName || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>审核时间：{{ purchaseInfo_main.reviewTime || "--" }}</span>
          </el-col> -->
        </el-row>
        <el-row
          class="table-btn"
          v-if="
            purchaseInfo_main.status !== '1' && purchaseInfo_main.status !== '2'
          "
        >
          <el-button
            type="text"
            class="float-left cursor-pointer margin-right-16"
            @click="adddrug"
            v-hotKey="{ func: 'func_add2' }"
            :disabled="!isShadow"
          >
            <i class="filter-item iconfont iconxinzeng"></i> 新增药品
          </el-button>
          <el-button
            type="text"
            class="float-left cursor-pointer margin-right-16"
            @click="adds"
            :disabled="!isShadow"
          >
            <i class="filter-item iconfont iconyiriqingdan"></i> 批量申请
          </el-button>
          <el-button
            type="text"
            class="float-left cursor-pointer margin-right-16"
            v-hotKey="{ func: 'func_delete' }"
            @click="del"
            :disabled="!isShadow"
          >
            <i class="filter-item iconfont iconshanchu"></i> 删除
          </el-button>
        </el-row>

        <!-- 采购单table -->
        <div
          class="tablerow position-absolute"
          style="bottom: 0; left: 0; right: 0"
          :style="
            purchaseInfo_main.status !== '1' && purchaseInfo_main.status !== '2'
              ? 'top:160px'
              : 'top:122px'
          "
        >
          <el-table
            ref="singleTable"
            id="single-table"
            :data="tableData"
            v-if="!tableLoading"
            v-loading="tableLoading"
            height="100%"
            style="width: 100%"
            border
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            @header-dragend="repair"
            @row-click="rowClick"
          >
            <el-table-column
              v-if="
                purchaseInfo_main.status !== '1' &&
                  purchaseInfo_main.status !== '2'
              "
              type="selection"
              width="40"
              key="t1"
            ></el-table-column>
            <el-table-column
              key="t2"
              header-align="center"
              prop="drugName"
              show-overflow-tooltip
              label="药品名称"
            >
              <template slot-scope="{ row, $index }">
                <span v-if="row.drugName">{{ row.drugName }}</span>
                <drugInfoList
                  v-else
                  suffix-icon="el-icon-search"
                  @keydown.enter.stop="nextFocus(row, $index, $event)"
                  @send-data="getSearchData($event, $index)"
                  :storageCode="purchaseInfo_main.storageCode"
                ></drugInfoList>
              </template>
            </el-table-column>
            <el-table-column
              key="t3"
              header-align="center"
              prop="spec"
              show-overflow-tooltip
              label="规格"
            ></el-table-column>
            <el-table-column
              key="t4"
              header-align="center"
              prop="formCode"
              show-overflow-tooltip
              label="剂型"
            >
              <template slot-scope="{ row }">
                <span
                  tableName="hrp_form"
                  :conditionMap="{ form_code: row.formCode }"
                  columns="form_name"
                  v-tableTransform
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              key="t5"
              header-align="center"
              prop="purchasePrice"
              width="100"
              align="right"
              label="进价(元)"
            >
              <template slot-scope="{ row, $index }">
                <template v-if="!shStatus.includes(purchaseInfo_main.status)">
                  <el-input
                    @keydown.enter.native="nextFocus(row, $index, $event)"
                    @blur="formatPrice(row.purchasePrice, $index)"
                    v-model="row.purchasePrice"
                  ></el-input>
                </template>
                <template v-else>
                  <span>{{ formatNum(row.purchasePrice) }}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              key="t6"
              header-align="center"
              prop="price"
              width="100"
              label="售价(元)"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              key="t7"
              header-align="center"
              prop="drugStock"
              width="150"
              label="当前库存量"
            >
              <template slot-scope="{ row }">
                <span>{{ row.kcOut }}</span>
                <span
                  :val="row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="row.kcBl !== 0">
                  <span>{{ row.kcBl }}</span>
                  <span
                    :val="row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="生产厂商" min-width="230">
              <template slot-scope="scope">
                <span
                  :val="scope.row.originCode"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              key="t9"
              header-align="center"
              width="200"
              prop="saveQuantity"
              class-name="outfitNum"
              label="采购数量"
            >
              <template slot-scope="{ row, $index }">
                <div class="noWrap">
                  <template v-if="!shStatus.includes(purchaseInfo_main.status)">
                    <el-input
                      @keydown.enter.native="
                        nextFocus(row, $index, $event, true)
                      "
                      @keyup.native="textValue($event, $index)"
                      v-model.number="row.cgOut"
                    ></el-input>
                    <span
                      :val="row.drugUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else>
                    <span>{{ row.cgOut }}</span>
                    <span
                      :val="row.drugUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                    <template v-if="row.unitSaleFlg === '1' && row.cgBl !== 0">
                      <span>{{ row.cgBl }}</span>
                      <span
                        :val="row.packUnit"
                        code="DrugUnit"
                        v-codeTransform
                      ></span>
                    </template>
                  </template>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="!isShadow"
            @click="validateTips"
            class="position-absolute height100 width100 shadow"
          ></div>
        </div>
      </div>
    </div>

    <div class="bottom-btn">
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
      <!-- <el-button class="less-btn float-right" type="primary" v-if="purchaseInfo_main.status == '1'" size="small" plain
        @click="examine">审核</el-button> -->
      <el-button
        v-if="purchaseInfo_main.status == '0'"
        class="less-btn float-right"
        type="primary"
        @click="submitData"
        v-hotKey="{ func: 'func_submit' }"
        >提交</el-button
      >
      <el-button
        v-if="purchaseInfo_main.status == '' || purchaseInfo_main.status == '0'"
        class="less-btn float-right"
        type="primary"
        plain
        v-hotKey="{ func: 'func_save' }"
        @click="save"
        >保存</el-button
      >
    </div>

    <!--批量采购弹窗  -->
    <l-dialog
      :visible.sync="modelVisible"
      width="600px"
      title="批量新增"
      @confirm="conserve"
      @cancel="huidanClose"
    >
      <template #content>
        <el-form label-position="top" inline style="padding: 20px 0">
          <el-radio-group v-model="modeldata.type">
            <el-row>
              <el-col :offset="2" :span="16">
                <el-radio label="max"
                  >未达到高储数量的药品进行申请[申请数量=高储数量-当前库存]</el-radio
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="2" :span="16">
                <!-- <el-radio label="2">
                  采购数量=药库
                  <el-input v-model="modeldata.pastDays" style="line-height: 34px;width: 45px;"></el-input>天出库量 - 当前库存

                </el-radio> -->
                <el-radio label="avg" style="margin-top: 10px">
                  申请数量=
                  <el-input
                    v-model="modeldata.pastDays"
                    style="width: 45px"
                    placeholder
                  ></el-input
                  >天当前的药房平均使用量X
                  <el-input
                    v-model="modeldata.days"
                    style="width: 45px"
                    placeholder
                  ></el-input
                  >天[拟申请天数]-当前药房库存量
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
import LEnterChange from "./component/LEnterChange";
import drugInfoList from "@/views/drugManagement/components/drugInfoListNew.vue";
import stockPurchaseAPI from "@/api/drugStorage/stock/purchase";
import hmmBaseApi from "@/api/hmm/base";
import mixin from "@/mixins/drugManagement.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import Supplier from "./component/supplier";
import formatNum from "@/utils/formatPrice.js";
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/index.js";
import { refToArr } from "@/utils/util.js";

export default {
  props: {
    purchaseInfo: {
      type: Object,
      default: () => ({})
    },
    // 患者卡片类型
    drugStorageList: {
      type: Array
    },
    // 工具箱默认是否展开状态
    supplierList: {
      type: Array
    }
  },
  mixins: [mixin],
  components: {
    LEnterChange,
    drugInfoList,
    Supplier
  },
  data() {
    return {
      statusShow: {
        "0": "未提交",
        "1": "已提交",
        "2": "已审核"
      },
      rules: {
        saveQuantity: [
          {
            required: true,
            message: "采购数量不能为空"
          },
          {
            type: "number",
            message: "采购数量必须为数字值"
          }
        ]
      },
      //批量新增弹窗默认关闭
      modelVisible: false,
      //弹窗数据源
      modeldata: {
        type: "max",
        pastDays: 0,
        days: 0
      },
      tableData: [], // 申请表格详情
      curSelectTableList: [], // 当前已经选中的item
      tableindex: "", //当前编辑index
      purchaseInfo_main: {
        purchaserNum: "",
        status: "",
        totalAmount: "",
        // supplierCode: "",
        storageCode: "",
        storageCodeName: "",
        enteyPersonName: "",
        entryTime: "",
        submitPersonName: "",
        submitPersonTime: "",
        recordRemark: ""
      },
      validateResult: null,
      tableCur: "",
      // 显示审核数量的状态
      shStatus: ["1", "2"],
      // 总进价金额-采购
      cgTotalPrice: 0,
      // 总进价金额-审核
      shTotalPrice: 0,
      tableLoad: false,
      tableLoading: false,
      inputDomsLength: 0,
      inputDoms: ""
    };
  },
  computed: {
    ...mapGetters("drugPurchase", ["newPurchaseData"]),
    isShadow() {
      return (
        // this.purchaseInfo_main.supplierCode !== "" &&
        this.purchaseInfo_main.storageCode !== ""
      );
    }
  },
  created() {
    this.getUserStorage();
  },
  watch: {
    purchaseInfo: {
      deep: true,
      handler(val, oldvalue) {
        if (val && val.id) {
          this.purchaseInfo_main = deepClone(val);
          this.getPurchaserD(val.id);
          this.getUserStorage();
        } else {
          this.tableData = [];
          this.purchaseInfo_main = this.$options.data().purchaseInfo_main;
        }
      }
    },
    tableData: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.totalPurchasePrice();
          this.getUserStorage();
        });
      }
    },
    newPurchaseData: {
      deep: true,
      handler(val) {
        this.purchaseInfo_main = this.$options.data().purchaseInfo_main;
        if (val.info) {
          for (let i in this.purchaseInfo_main) {
            if (val.info[i]) {
              this.$set(this.purchaseInfo_main, i, val.info[i]);
            }
          }
        }
        if (val.list) {
          let list = val.list.map(item => {
            let kcnum = blukToOutfit(item.drugStock, item.packQuantity);
            let cgnum = blukToOutfit(item.purchaseQuantity, item.packQuantity);

            return {
              ...item,
              saveQuantity: item.purchaseQuantity,
              kcOut: kcnum.out,
              kcBl: kcnum.bl,
              cgOut: cgnum.out,
              cgBl: cgnum.bl,
              shOut: 0,
              shBl: 0
            };
          });
          this.tableData = list;
          this.$nextTick(() => {
            this.$refs.singleTable &&
              this.$refs.singleTable.setCurrentRow(list[0]);
          });
        }
        this.getUserStorage();
      }
    }
  },
  methods: {
    initInputDOM() {
      const inputDoms = document.querySelectorAll(
        "#single-table .el-input__inner"
      );
      inputDoms.forEach((item, index) => {
        item.setAttribute("data-index", index);
      });
      console.log(`inputDoms`, inputDoms);
      console.log(`inputDoms`, inputDoms.length);
      return inputDoms;
    },
    nextFocus(arr, scope, event, flag) {
      if (flag) {
        this.adddrug();
        return;
      }
      const index = event.target.getAttribute("data-index");
      const nextIndex = parseInt(index) + 1;
      const length = this.inputDoms.length;
      if (nextIndex < length) {
        this.inputDoms[nextIndex].focus();
      } else {
        this.inputDoms[0].focus();
      }
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            this.purchaseInfo_main.storageCode = res.data.storageCode;
            this.purchaseInfo_main.storageCodeName = res.data.storageName;
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch(err => {
          this.$message.error("获取当前库房失败");
        });
    },
    toDecimal2(x = "") {
      //格式化函数
      if (x.split(".").length > 2) {
        x = x
          .split(".")
          .slice(0, 2)
          .join(".");
      }
      var f = parseFloat(x);
      if (isNaN(f)) {
        return "0.00";
      }
      f = Math.round(x * 100) / 100;

      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
    formatPrice(value, index) {
      let val = this.toDecimal2(value);
      this.$set(this.tableData[index], "purchasePrice", val > 0 ? val : "");
    },
    formatNum(num) {
      return formatNum(num);
    },
    //计算总进价
    totalPurchasePrice() {
      const list = this.tableData.filter(item => item.drugId);
      let cgprice = list.reduce((item, next) => {
        let qty = next.saveQuantity ? next.saveQuantity : 0;
        let price = next.purchasePrice ? next.purchasePrice : 0;
        item =
          Math.round(item * 100 + (price * 100 * qty) / next.packQuantity) /
          100;
        return item;
      }, 0);
      this.cgTotalPrice = cgprice;
      let shprice = list.reduce((item, next) => {
        let qty = next.submitQuantity ? next.submitQuantity : 0;
        let price = next.purchasePrice ? next.purchasePrice : 0;
        item =
          Math.round(item * 100 + (price * 100 * qty) / next.packQuantity) /
          100;
        return item;
      }, 0);
      this.shTotalPrice = shprice;
      let flag = this.shStatus.includes(this.purchaseInfo_main.status);
      if (flag) {
        return shprice;
      }
      return cgprice;
    },

    textValue(e, index) {
      let item = this.tableData[index];
      let cgnum = 0;
      let shnum = 0;
      this.validateResult = new RegExp("^[1-9][0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入正整数");
        e.target.value = "";
      }
      cgnum = outfitToBluk(item.cgOut, 0, item.packQuantity);
      shnum = outfitToBluk(item.shOut, 0, item.packQuantity);
      this.$set(
        this.tableData[index],
        "saveQuantity",
        cgnum === 0 ? "" : cgnum
      );
      this.$set(
        this.tableData[index],
        "submitQuantity",
        shnum === 0 ? "" : shnum
      );
      this.$nextTick(() => {
        this.totalPurchasePrice();
      });
    },
    validateTips() {
      this.$message({
        message: "供应商或采购药库不可为空",
        type: "warning"
      });
    },
    refreshList() {
      this.fullReset();
      this.$emit("search");
    },
    //查询明细
    getPurchaserD(purchaserId) {
      if (purchaserId) {
        this.tableLoad = true;
        stockPurchaseAPI
          .getPurchaserDetail(purchaserId)
          .then(res => {
            if (res.code === 1) {
              let list = res.data.map(item => {
                let kcnum = blukToOutfit(item.drugStock, item.packQuantity);
                let cgnum = blukToOutfit(item.saveQuantity, item.packQuantity);
                let shnum = blukToOutfit(
                  item.submitQuantity,
                  item.packQuantity
                );
                let amount = {};

                if (this.purchaseInfo_main.status === "1") {
                  amount.submitQuantity = item.saveQuantity;
                  amount.shOut = blukToOutfit(
                    item.saveQuantity,
                    item.packQuantity
                  ).out;
                  amount.shBl = blukToOutfit(
                    item.saveQuantity,
                    item.packQuantity
                  ).bl;
                }

                return {
                  ...item,
                  kcOut: kcnum.out,
                  kcBl: kcnum.bl,
                  cgOut: cgnum.out,
                  cgBl: cgnum.bl,
                  shOut: shnum.out,
                  shBl: shnum.bl,
                  ...amount
                };
              });
              this.tableData = list;
              console.log(list, "list");
              this.$refs.singleTable &&
                this.$refs.singleTable.setCurrentRow(list[0]);

              this.totalPurchasePrice();
            } else {
              this.$message.error(res.msg || "获取采购单明细数据失败");
            }
            this.tableLoad = false;
          })
          .catch(res => {
            this.tableLoad = false;
            this.$message.error(res.msg || "获取采购单明细数据失败");
          });
      }
    },
    // 中间模块操作
    handleSelectionChange(list) {
      this.curSelectTableList = list;
    },
    //导出
    exportExcel() {
      let nums = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".outfitNum"
      );
      let tableData_new = this.tableData.map((item, i) => {
        return Object.assign(item, { _num: nums[i].innerText });
      });
      let excelData = {
        title: ["采购单", "", "", "", ""],
        where: [
          "采购单号:" + this.purchaseInfo_main.purchaseNum,
          "",
          "",
          "",
          ""
        ],
        tHeader: ["药品名称", "规格", "进价(元)", "售价(元)", "数量"],
        filterVal: ["drugName", "spec", "purchasePrice", "price", "_num"],
        listDate: tableData_new,
        fileName: "采购单",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },
    print() {
      let data = {};
      data.title = "采购单";
      data.num = this.purchaseInfo_main.purchaseNum;
      let tableArr = refToArr(this.$refs.singleTable);
      let detailList = this.tableData.map((data, index) => {
        return {
          ...data,
          qty: tableArr[index][6]
        };
      });
      data.detailList = detailList;
      onPreview(data, "药库药房单据");
    },
    // 提交
    submitData() {
      //过滤掉空白行
      this.tableData = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      if (this.tableData.length === 0) {
        this.$message.error("申请单明细不可为空");
        return;
      }
      let isRe = this.tableData.find(item => item.saveQuantity === "");
      let isPurPrice = this.tableData.find(item => item.purchasePrice == "");
      if (isRe) {
        this.$message.warning("请填写采购数量");
        return;
      }

      if (isPurPrice) {
        this.$message.warning("请填写进价");
        return;
      }

      let dataList = this.tableData.map(item => {
        return {
          ...item,
          saveQuantity: outfitToBluk(
            item.cgOut,
            item.cgBl === "" ? 0 : item.cgBl,
            item.packQuantity
          ),
          submitQuantity: outfitToBluk(
            item.shOut,
            item.shBl === "" ? 0 : item.shBl,
            item.packQuantity
          )
        };
      });
      let saveData = {
        ...this.purchaseInfo_main,
        purchaseDPOList: dataList
      };

      delete saveData.entryTime;
      delete saveData.entryPersonName;
      delete saveData.submitPersonName;
      delete saveData.submitPersonTime;

      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否提交当前采购单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stockPurchaseAPI
            .savePurchaseList(saveData)
            .then(res => {
              if (res.code === 1) {
                this.purchaseInfo_main = res.data;
                this.tableData = res.data.purchaseDPOList || [];
                let submitId = this.purchaseInfo_main.id;
                stockPurchaseAPI
                  .submitPurchaseList(submitId)
                  .then(resp => {
                    done();
                    this.$hideLoading();
                    this.refreshList();
                    if (resp.code === 1) {
                      this.$message({
                        type: "success",
                        message: resp.msg || "提交成功!"
                      });
                    } else {
                      this.$message.error(resp.msg || "提交失败");
                    }
                  })
                  .catch(error => {
                    done();
                    this.$hideLoading();
                    this.$message.error(error.msg || "提交失败");
                  });
              } else {
                done();
                this.$hideLoading();
                this.$message.error(res.msg || "提交失败");
              }
            })
            .catch(res => {
              done();
              this.$hideLoading();
              this.$message.error(res.msg || "提交失败");
            });
        }
      });
    },
    // 保存采购单
    save() {
      //过滤掉空白行
      this.tableData = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      if (this.tableData.length === 0) {
        this.$message.error("申请单明细不可为空");
        return;
      }
      let isRe = this.tableData.find(item => item.saveQuantity === "");
      if (isRe) {
        this.$message.warning("请填写采购数量");
        return;
      }
      let dataList = this.tableData.map(item => {
        return {
          ...item,
          saveQuantity: outfitToBluk(
            item.cgOut,
            item.cgBl === "" ? 0 : item.cgBl,
            item.packQuantity
          ),
          submitQuantity: outfitToBluk(
            item.shOut,
            item.shBl === "" ? 0 : item.shBl,
            item.packQuantity
          )
        };
      });
      this.purchaseInfo_main.totalAmount = this.totalPurchasePrice();
      let saveData = {
        ...this.purchaseInfo_main,
        entryTime: "",
        purchaseDPOList: dataList
      };

      delete saveData.entryTime;
      delete saveData.entryPersonName;
      delete saveData.submitPersonName;
      delete saveData.submitPersonTime;

      console.log(saveData, "saveData");
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否保存当前采购单?",
        confirm: (action, instance, done) => {
          this.$showLoading();

          stockPurchaseAPI
            .savePurchaseList(saveData)
            .then(res => {
              if (res.code === 1) {
                this.purchaseInfo_main = res.data;
                this.tableData = res.data.purchaseDPOList || [];
                this.refreshList();
                this.$message.success(res.msg || "保存成功!");
              } else {
                this.$message.error(res.msg || "保存失败");
              }
            })
            .catch(res => {
              this.$message.error(res.msg || "保存失败");
            })
            .finally(() => {
              done();
              this.$hideLoading();
            });
        }
      });
    },
    // 删除
    del() {
      if (this.curSelectTableList.length === 0) {
        this.$message.warning("请选择！");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前采购明细?",
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
          this.$nextTick(() => {
            console.log(`this.initInputDOM()`, this.initInputDOM().length);
            this.inputDomsLength = this.initInputDOM().length;
            console.log(`inputDomsLength`, this.inputDomsLength);
          });
        }
      });
    },
    // 批量新增弹窗打开
    adds() {
      this.modelVisible = true;
    },
    // 关闭批量采购弹窗
    huidanClose() {
      this.modelVisible = false;
    },
    //批量新增保存
    conserve() {
      let params = {};
      if (this.modeldata.type == "max") {
        params.type = this.modeldata.type;
      } else {
        params.type = this.modeldata.type;
        params.pastDays = this.modeldata.pastDays;
        params.days = this.modeldata.days;
      }
      stockPurchaseAPI
        .batchApplyList(params)
        .then(res => {
          if (res.code == 1) {
            this.filterTableDataEmpty();
          }
          if (res.code != 1) {
            this.$message.error(res.msg || "批量新增失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无批量药品数据");
            return;
          }
          res.data.forEach(drugWapper => {
            let { out, bl } = blukToOutfit(
              drugWapper.drugStock,
              drugWapper.packQuantity
            );
            let textOut = blukToOutfit(drugWapper.qty, drugWapper.packQuantity)
              .out;
            let itemData = {
              ...drugWapper,
              purchasePrice: drugWapper.purchasePrice || 0,
              price: drugWapper.price || 0,
              saveQuantity: drugWapper.qty,
              submitQuantity: drugWapper.qty,
              drugStock: drugWapper.drugStock || 0,
              isEditing: false,
              kcOut: out,
              kcBl: bl,
              cgOut: textOut,
              shOut: textOut
            };

            let flag = true;
            if (this.tableData.length == 0) {
              this.tableData.push(itemData);
            } else {
              this.tableData.map((item, index) => {
                if (item.drugId === drugWapper.drugId) {
                  this.tableData[index] = { ...itemData };
                  flag = false;
                }
              });
              if (flag) {
                this.tableData.push(itemData);
              }
            }
          });
        })
        .catch(res => {
          this.$message.error(res.msg || "批量新增失败");
        });
      this.modelVisible = false;
    },
    // 新建采购单
    newAdd() {
      this.tableLoading = false;
      this.fullReset();
    },
    filterTableDataEmpty() {
      this.tableData = this.tableData.filter(item => {
        return item.drugId;
      });
    }, //过滤调空白行
    //新增药品
    adddrug() {
      this.filterTableDataEmpty();
      this.tableData.push({
        id: "",
        drugName: "", // 药品名称
        spec: "", // 规格
        drugStock: "", // 库存
        purchasePrice: "", // 参考进价
        price: "", // 参考售价
        packUnit: "", // 包装单位
        formCode: "", // 剂型
        auditsNumber: "", //审核数量
        remark: "", // 备注
        isEditing: true // 是否为编辑状态
      });
      this.$nextTick(function() {
        //处方列表 定位到最底下 最左面
        let rpTable = this.$refs.singleTable;
        // console.log(rpTable.bodyWrapper);
        rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
        rpTable.bodyWrapper.scrollLeft = 0;
        this.inputDoms = this.initInputDOM();
        if (this.tableData.length !== 0 && this.inputDomsLength === 0) {
          this.inputDomsLength = this.initInputDOM().length - 3;
        }
        this.inputDoms[this.inputDoms.length - 3].focus();
      });
    },
    //审核
    examine() {
      let list = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      if (list.length === 0) {
        this.$message.warning("请添加药品");
        return;
      }
      let isRe = this.tableData.find(item => item.submitQuantity === "");
      if (isRe) {
        this.$message.warning("申领数量填写错误");
        return;
      }
      //过滤掉空白行
      this.tableData = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      let saveData = {};
      this.purchaseInfo_main.totalAmount = this.totalPurchasePrice();
      saveData = {
        ...saveData,
        ...this.purchaseInfo_main
      };
      let dataList = this.tableData.map(item => {
        return {
          ...item,
          saveQuantity: outfitToBluk(
            item.cgOut,
            item.cgBl === "" ? 0 : item.cgBl,
            item.packQuantity
          ),
          submitQuantity: outfitToBluk(
            item.shOut,
            item.shBl === "" ? 0 : item.shBl,
            item.packQuantity
          )
        };
      });
      saveData.purchaseDPOList = dataList;

      // 审核采购单
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否审核当前采购单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stockPurchaseAPI
            .checkPurchaseList(saveData)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.refreshList();
                this.$message.success(res.msg || "审核成功!");
              } else {
                this.$message.error(res.msg || "审核失败!");
              }
            })
            .catch(err => {
              done();
              this.$hideLoading();
              this.$message.error(err.msg || "审核失败!");
            });
        }
      });
    },
    // 键盘Tab 到最后一个 触发回调事件
    enterlast() {
      this.tableData.map(item => {
        item.isEditing = false;
      });
      this.tableData.push({
        drugName: "", // 药品名称
        spec: "", // 规格
        drugStock: "", // 库存
        purchasePrice: "", // 参考进价
        price: "", // 参考售价
        formCode: "", // 剂型
        saveQuantity: "1", //采购数量
        auditQuantity: "", //审核数量
        isEditing: true // 是否为编辑状态
      });
    },
    // 重置采购明细单
    fullReset() {
      this.purchaseInfo_main = this.$options.data().purchaseInfo_main;
      this.tableData = this.$options.data().tableData;
      this.tableLoading = false;
    },
    rowClick(row) {
      this.tableCur = this.tableData.findIndex(item => item === row);
    },
    // 获取药品输入查询组件传过来的药品数据
    getSearchData(row, index) {
      const itemData = this.tableData.find(item => {
        return item.id === row.id;
      });
      if (itemData) {
        this.$message.warning("已有相同药品");
        return;
      }
      row.drugId = row.id;
      row.id = "";
      // 进价默认为售价
      row.purchasePrice = row.price;
      let { out, bl } = blukToOutfit(row.drugStock, row.packQuantity);
      this.$set(this.tableData, index, {
        ...row,
        kcOut: out,
        kcBl: bl,
        cgOut: "",
        saveQuantity: ""
      });
      this.$nextTick(() => {
        // 输入药品后光标计算位置逻辑
        this.inputDoms = this.initInputDOM();
        console.log(`this.inputDoms----------`, this.inputDoms.length);
        console.log(`this.inputDomsLength`, this.inputDomsLength);
        if (this.tableData.length === 0 && this.inputDomsLength === 0) {
          this.inputDoms[0].focus();
        } else {
          this.inputDoms[this.inputDoms.length - 2].focus();
        }
        this.inputDomsLength = this.inputDoms.length;
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
/deep/.el-input-number {
  width: 100%;

  .el-input-number__increase,
  .el-input-number__decrease {
    width: 20px;
  }

  .el-input {
    .el-input__inner {
      padding-left: 10px;
      padding-right: 0;
      text-align: left;
    }
  }
}

/deep/ .el-input__inner {
  padding: 0 0 0 5px !important;
}

.shadow {
  left: 0;
  top: 0;
  background: $l-color-black;
  opacity: 0.05;
  transition: all 2s;
  z-index: 999;
}

.details {
  height: calc(100% - 48px);
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
    overflow: hidden;
  }

  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .css_purchaseinfo {
    position: relative;
    overflow: hidden;

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
    width: 60px;
  }
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
</style>
