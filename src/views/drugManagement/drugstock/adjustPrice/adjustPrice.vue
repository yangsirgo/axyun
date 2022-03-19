<template>
  <el-card class="height100 position-relative width100" style="padding: 16px">
    <div class="details">
      <div class="apply-info">
        <el-row style="margin-bottom: 8px">
          <el-col :span="6">
            <span class="label">申请单号：</span>
            {{ adjustPriceInfo_main.adjustPriceNum || "--" }}
          </el-col>
        </el-row>
        <el-row :gutter="6" style="margin-bottom: 8px">
          <el-col :span="6">
            <!-- disabled 加true条件为了不可选，后期开放多条件可删除 -->
            <l-formt-title
              required
              :disabled="
                adjustPriceInfo_main.status === '1' ||
                  adjustPriceInfo_main.status === '2' ||
                  true
              "
              label="调价方式"
              labelWidth="54"
            >
              <el-select
                class="overflow-point"
                filterable
                :disabled="
                  adjustPriceInfo_main.status === '1' ||
                    adjustPriceInfo_main.status === '2' ||
                    true
                "
                v-model="adjustPriceInfo_main.adjustPriceType"
                placeholder="请选择"
                @change="adjustChange"
              >
                <el-option
                  v-for="item in adjustPriceTypeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6" v-if="adjustPriceInfo_main.adjustPriceType == '0'">
            <l-formt-title
              required
              :disabled="
                adjustPriceInfo_main.status === '1' ||
                  adjustPriceInfo_main.status === '2'
              "
              label="调价时间"
              labelWidth="54"
            >
              <el-date-picker
                :disabled="
                  adjustPriceInfo_main.status === '1' ||
                    adjustPriceInfo_main.status === '2'
                "
                v-model="adjustPriceInfo_main.preAdjustPriceDate"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                @change="adjTimeChange"
              ></el-date-picker>
            </l-formt-title>
          </el-col>

          <el-col :span="6">
            <l-formt-title
              required
              :disabled="!!adjustPriceInfo_main.status || true"
              label="调价类型"
              labelWidth="54"
            >
              <el-select
                class="overflow-point"
                filterable
                :disabled="!!adjustPriceInfo_main.status || true"
                v-model="adjustPriceInfo_main.adjustPriceMode"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in adjustPriceModeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <!-- <el-col :span="6">
            <l-formt-title
              required
              :disabled="!!adjustPriceInfo_main.status"
              label="调价范围"
              labelWidth="54"
            >
              <el-select
                class="overflow-point"
                filterable
                :disabled="!!adjustPriceInfo_main.status"
                v-model="adjustPriceInfo_main.adjustPriceMode"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in adjustPriceRangeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col> -->
        </el-row>
        <el-row :gutter="6" style="margin-bottom: 8px">
          <el-col :span="6" class="item">
            <span class="label">录入人员：</span>
            {{ adjustPriceInfo_main.entryPersonName || "--" }}
          </el-col>
          <el-col :span="6" class="item">
            <span class="label">录入时间：</span>
            {{ adjustPriceInfo_main.entryTime || "--" }}
          </el-col>
          <el-col
            :span="6"
            class="item"
            v-if="adjustPriceInfo_main.status !== '0'"
          >
            <span class="label">提交人员：</span>
            {{ adjustPriceInfo_main.submitPersonName || "--" }}
          </el-col>
          <el-col
            :span="6"
            class="item"
            v-if="adjustPriceInfo_main.status !== '0'"
          >
            <span class="label">提交时间：</span>
            {{ adjustPriceInfo_main.submitPersonTime || "--" }}
          </el-col>
        </el-row>
      </div>

      <div
        class="table-btn"
        style="margin-top: 0px"
        v-if="
          adjustPriceInfo_main.status !== '1' &&
            adjustPriceInfo_main.status !== '2' &&
            adjustPriceInfo_main.status !== '3'
        "
      >
        <el-button
          type="text"
          :disabled="!isShadow"
          class="float-left cursor-pointer margin-right-10"
          @click="addDrug"
          v-hotKey="{ func: 'func_add2' }"
        >
          <i class="filter-item iconfont iconxinzeng"></i> 新增药品
        </el-button>
        <el-button
          type="text"
          :disabled="!isShadow"
          class="float-left cursor-pointer margin-right-10"
          @click="del"
          v-hotKey="{ func: 'func_delete' }"
        >
          <i class="filter-item iconfont iconshanchu"></i>删除
        </el-button>
      </div>

      <div
        class="position-absolute"
        style="bottom: 76px; left: 16px; right: 16px"
        :style="
          adjustPriceInfo_main.status !== '1' &&
          adjustPriceInfo_main.status !== '2' &&
          adjustPriceInfo_main.status !== '3'
            ? 'top:150px'
            : 'top:115px'
        "
      >
        <l-tab-change class="height100" :tableData="tableData" @cb="tablast">
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            stripe
            v-loading="tableLoading"
            height="100%"
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <el-table-column
              v-if="
                adjustPriceInfo_main.status !== '1' &&
                  adjustPriceInfo_main.status !== '2' &&
                  adjustPriceInfo_main.status !== '3'
              "
              type="selection"
              width="40"
            ></el-table-column>
            <el-table-column
              min-width="200"
              :resizable="false"
              label="药品名称"
              fixed
            >
              <template slot-scope="{ row, $index }">
                <span v-if="row.drugName">{{ row.drugName }}</span>
                <drug-info-list
                  v-else
                  suffix-icon="el-icon-search"
                  @send-data="getSearchData($event, $index)"
                  :storageCode="adjustPriceInfo_main.storageCode"
                ></drug-info-list>
              </template>
            </el-table-column>
            <el-table-column
              prop="spec"
              label="规格"
              :resizable="false"
              min-width="180"
              fixed
            ></el-table-column>
            <el-table-column
              label="调前进价(元)"
              align="right"
              width="120"
              show-overflow-tooltip
              prop="oldPurchasePrice"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.oldPurchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="调后进价(元)" align="right" min-width="140">
              <template slot-scope="scope">
                <el-input
                  type="number"
                  v-if="
                    adjustPriceInfo_main.status !== '1' &&
                      adjustPriceInfo_main.status !== '2' &&
                      adjustPriceInfo_main.status !== '3'
                  "
                  v-model="scope.row.newPurchasePrice"
                  @change="priceChange($event, scope.$index)"
                  placeholder
                ></el-input>
                <span v-else>{{ formatNum(scope.row.newPurchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="调前售价(元)"
              align="right"
              width="140"
              prop="oldPrice"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.oldPrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="调后售价(元)" align="right" min-width="140">
              <template slot-scope="scope">
                <el-input
                  type="number"
                  v-if="
                    adjustPriceInfo_main.status !== '1' &&
                      adjustPriceInfo_main.status !== '2' &&
                      adjustPriceInfo_main.status !== '3'
                  "
                  v-model="scope.row.newPrice"
                  @change="priceChange($event, scope.$index)"
                  placeholder
                ></el-input>
                <span v-else>{{ formatNum(scope.row.newPrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="调价原因"
              min-width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input
                  v-if="
                    adjustPriceInfo_main.status !== '1' &&
                      adjustPriceInfo_main.status !== '2' &&
                      adjustPriceInfo_main.status !== '3'
                  "
                  maxlength="100"
                  v-model="scope.row.recordRemark"
                  placeholder
                ></el-input>
                <span v-else>{{ scope.row.recordRemark }}</span>
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
              prop="inId"
              label="批次"
              :resizable="false"
              min-width="120"
            ></el-table-column>
            <el-table-column width="140"
              show-overflow-tooltip
              label="药品批号"
              prop="batchNum"
            ></el-table-column>
            <el-table-column label="有效期" width="100">
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.expDate) }}</span>
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
            <!-- <el-table-column prop="drugStockH" label="库存数" min-width="100"></el-table-column>
            <el-table-column label="调前售价总额" align="right" min-width="150">
              <template slot-scope="scope">
                <span>{{scope.row.oldPrice * scope.row.drugStockH }}</span>
              </template>
            </el-table-column>
            <el-table-column label="调后售价总额" align="right" min-width="150">
              <template slot-scope="scope">
                <span>{{scope.row.newPrice * scope.row.drugStockH}}</span>
              </template>
            </el-table-column>-->
          </el-table>
        </l-tab-change>
        <div
          v-if="!isShadow"
          @click="validateTips"
          class="position-absolute height100 width100 shadow"
        ></div>
      </div>
    </div>
    <!-- 调价修改批次 弹窗 -->
    <l-dialog
      :visible.sync="drugVisible"
      :title="this.drugTitleName"
      width="950px"
      @close="drugClose"
      @confirm="conserve"
      @cancel="drugClose"
    >
      <template #content>
        <el-form label-position="top" inline class="padding20">
          <el-table
            :data="searchTable"
            border
            stripe
            style="width: 100%"
            v-loading="tableLoading"
            element-loading-text="列表正在加载中"
            height="300"
            ref="diagTable"
            @select="searchChange"
            @select-all="searchChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="药品批次"
              prop="inId"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="药品批号"
              prop="batchNum"
            ></el-table-column>
            <el-table-column
              label="进价(元)"
              prop="purchasePrice"
              align="right"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="售价(元)"
              prop="price"
              align="right"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期" width="100">
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.expDate) }}</span>
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
            <el-table-column show-overflow-tooltip label="生产厂商">
              <template slot-scope="scope">
                <span
                  :val="scope.row.originCode"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </l-dialog>
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
        v-if="adjustPriceInfo_main.status == '0'"
        class="less-btn float-right"
        type="primary"
        @click="submitData"
        v-hotKey="{ func: 'func_submit' }"
        >提交</el-button
      >
      <el-button
        v-if="
          adjustPriceInfo_main.status !== '1' &&
            adjustPriceInfo_main.status !== '2' &&
            adjustPriceInfo_main.status !== '3'
        "
        class="less-btn float-right"
        type="primary"
        plain
        @click="save"
        v-hotKey="{ func: 'func_save' }"
        >保存</el-button
      >
    </div>
  </el-card>
</template>

<script>
import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
import { localCodeTransform } from "@/utils/util";
import stock from "@/api/hmm/stock";
import hmmBaseApi from "@/api/hmm/base";
import mixin from "@/mixins/drugManagement.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import formatNum from "@/utils/formatPrice.js";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
export default {
  props: {
    adjustPriceInfo: {
      type: Object
    },
    recordStatusList: {
      type: Array
    },
    adjustPriceTypeList: {
      type: Array
    },
    adjustPriceModeList: {
      type: Array
    }
  },
  mixins: [mixin],
  components: {
    drugInfoList
  },
  data() {
    return {
      drugVisible: false, // 药品批次弹框
      drugTitleName: "", // 弹框标题
      searchTable: [], // 药品批次集合
      selectedSearchTable: [], // 药品批次已选集合
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 10 // 每页数据条数
      },
      tableLoading: false,
      selectlist: [], //药品快速选择
      adjustPriceInfo_main: {
        // 申请单头部详情
        adjustPriceMode: "1",
        adjustPriceNum: "",
        adjustPriceType: "1",
        adjustReason: "",
        dataVersion: "0",
        entryPersonName: "",
        entryTime: "",
        submitPersonName: "",
        submitPersonTime: "",
        id: "",
        preAdjustPriceDate: "",
        recordRemark: "",
        status: "",
        storageCode: ""
      },
      tableindex: "", //当前编辑index
      tableData: [], // 申请表格详情
      curSelectEdTabList: [], // 当前已经选中的item
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  computed: {
    isShadow() {
      if (this.adjustPriceInfo_main.adjustPriceType !== "") {
        if (this.adjustPriceInfo_main.adjustPriceType == "0") {
          return (
            this.adjustPriceInfo_main.adjustPriceType !== "" &&
            this.adjustPriceInfo_main.preAdjustPriceDate !== ""
          );
        } else if (this.adjustPriceInfo_main.adjustPriceType == "1") {
          return this.adjustPriceInfo_main.adjustPriceType !== "";
        }
      }
      return false;
    }
  },
  watch: {
    adjustPriceInfo: {
      handler(val) {
        if (val && val.id) {
          this.adjustPriceInfo_main = { ...val };
          this.getAdjustPriceD(val.id);
        } else {
          this.adjustPriceInfo_main = this.$options.data().adjustPriceInfo_main;
          this.tableData = [];
        }
      },
      deep: true
    }
  },
  methods: {
    //弹窗关闭
    drugClose() {
      this.drugVisible = false;
    },
    // 弹框确认
    conserve() {
      let selectedList = this.selectedSearchTable;
      let tableData = this.tableData;
      let res = [];
      for (let i = 0; i < selectedList.length; i++) {
        let flag = true;
        let item1 = selectedList[i];
        for (let j = 0; j < tableData.length; j++) {
          let item2 = tableData[j];
          if (item1.drugId === item2.drugId && item1.inId === item2.inId) {
            flag = false;
          }
        }
        if (flag) {
          res.push({
            ...item1,
            oldPurchasePrice: item1.purchasePrice,
            newPurchasePrice: item1.purchasePrice,
            oldPrice: item1.price,
            newPrice: item1.price
          });
        }
      }
      this.tableData.splice(this.tableindex, 1, ...res);
      this.drugVisible = false;
      this.selectedSearchTable = [];
    },
    searchChange(selection) {
      this.selectedSearchTable = selection;
    },
    formatNum(num) {
      return formatNum(num);
    },
    formatDate(date) {
      return this.dayjs(date).format("YYYY-MM-DD");
    },
    validateTips() {
      this.$message({
        message: "调价方式跟调价时间不可为空",
        type: "warning"
      });
    },
    refreshList() {
      this.fullReset();
      this.$emit("search");
    },
    //查询明细
    getAdjustPriceD(id) {
      this.tableLoading = true;
      stock
        .getAdjustPriceDetail(id)
        .then(res => {
          if (res.code == 1) {
            let list = res.data.map(drugWapper => {
              let { out, bl } = blukToOutfit(
                drugWapper.drugStock,
                drugWapper.packQuantity
              );
              return {
                ...drugWapper,
                outfit: out,
                bluk: bl,
                thOut: "",
                thBl: "",
                backQuantity: "",
                purchasePrice: drugWapper.purchasePrice || 0,
                price: drugWapper.price || 0,
                drugStock: drugWapper.drugStock || 0,
                isEditing: true
              };
            });
            this.tableData = list;
            this.$refs.singleTable &&
              this.$refs.singleTable.setCurrentRow(res.data[0]);
          } else {
            this.$message.error(res.msg || "获取申请单明细数据失败");
          }
          this.tableLoading = false;
        })
        .catch(res => {
          this.tableLoading = false;
          this.$message.error(res.msg || "获取申请单明细数据失败");
        });
    },
    handleSelectionChange(list) {
      // 选中表格
      this.curSelectEdTabList = list;
    },
    //删除明细
    del() {
      if (this.curSelectEdTabList.length > 0) {
        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否删除当前调价单明细?",
          confirm: (action, instance, done) => {
            let add = this.tableData.filter(
              item =>
                !this.curSelectEdTabList.some(
                  ele => ele.drugId === item.drugId && ele.inId === item.inId
                )
            );
            this.tableData = add;
            done();
            this.$message.success("删除成功!");
          }
        });
      } else {
        this.$message.warning("请选择一条或者多条数据");
        return;
      }
    },
    //过滤调空白行
    filterTableDataEmpty() {
      this.tableData = this.tableData.filter(item => {
        return item.drugId;
      });
    },
    // 新增药品
    addDrug() {
      this.filterTableDataEmpty();
      this.tableData.push({
        drugName: "",
        dataVersion: 0,
        originCode: "",
        dosageUnit: "",
        dosageValue: "",
        drugId: "",
        drugStock: "",
        formCode: "",
        // drugStockH: "",
        drugUnit: "",
        oldPurchasePrice: "",
        newPurchasePrice: "",
        newPrice: "",
        oldPrice: "",
        packQuantity: "",
        packUnit: "",
        recordRemark: "",
        spec: "",
        isEditing: true
      });
    },
    // 新建申请单
    newAdd() {
      this.fullReset();
    },

    //快捷键
    tablast() {
      this.backDrugName = "";
      this.tableData.map(item => {
        item.isEditing = false;
      });
      // 键盘Tab 到最后一个 触发回调事件
      this.tableData.push({
        drugName: "",
        dataVersion: 0,
        originCode: "",
        dosageUnit: "",
        dosageValue: "",
        drugId: "",
        drugStock: "",
        formCode: "",
        // drugStockH: "",
        drugUnit: "",
        oldPurchasePrice: "",
        newPrice: "",
        oldPrice: "",
        packQuantity: "",
        packUnit: "",
        recordRemark: "",
        spec: "",
        isEditing: true
      });
      // this.adjustPriceInfo_main.isEditing = false;
    },

    // 重置采购明细单
    fullReset() {
      this.adjustPriceInfo_main = this.$options.data().adjustPriceInfo_main;
      this.tableData = this.$options.data().tableData;
      this.addDrug();
    },
    exportExcel() {
      let excelData = {
        title: ["调价单", "", "", "", ""],
        where: [
          "调价单号:" + this.adjustPriceInfo_main.adjustPriceNum,
          "",
          "",
          "",
          ""
        ],
        tHeader: [
          "药品名称",
          "规格",
          "进价(元)",
          "调前售价(元)",
          "调后售价(元)"
        ],
        filterVal: [
          "drugName",
          "spec",
          "oldPurchasePrice",
          "oldPrice",
          "newPrice"
        ],
        listDate: this.tableData,
        fileName: "调价单",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },
    print() {
      let data = {};
      data.title = "调价单";
      data.num = this.adjustPriceInfo_main.adjustPriceNum;
      data.detailList = this.tableData;
      onPreview(data, "调价单");
    },
    // 提交
    submitData() {
      if (this.adjustPriceInfo_main.preAdjustPriceDate) {
        const adTime = new Date(
          Date.parse(
            this.adjustPriceInfo_main.preAdjustPriceDate.replace(/-/g, "/")
          )
        ).getTime();
        const now = new Date().getTime();
        if (adTime < now) {
          this.$message.warning("调价时间不能小于当前时间");
          return;
        }
      }

      this.tableData = this.tableData.filter(item => {
        return item.drugId;
      });
      if (this.tableData.length == 0) {
        this.$message.error("调价单明细不可为空");
        return;
      }

      const list = this.tableData.find(
        item => !item.newPrice || item.newPrice === ""
      );
      if (typeof list !== "undefined") {
        this.$message.warning("请输入调后售价");
        return;
      }
      const listbf = this.tableData.find(
        item => !item.newPurchasePrice || item.newPurchasePrice === ""
      );
      if (typeof listbf !== "undefined") {
        this.$message.warning("请输入调后进价");
        return;
      }
      //调前售价和调后售价不能相等
      const list2 = this.tableData.find(item => item.newPrice == item.oldPrice);
      if (typeof list2 !== "undefined") {
        this.$message.warning("调前售价和调后售价不能相等");
        return;
      }

      let saveData = {
        ...this.adjustPriceInfo_main,
        adjustPriceDPOList: this.tableData || "",
        priceType: this.adjustPriceInfo_main.adjustPriceType
      };

      delete saveData.entryTime;
      delete saveData.entryPersonName;
      delete saveData.submitPersonName;
      delete saveData.submitPersonTime;

      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否提交当前调价单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stock
            .addadjustPrice(saveData)
            .then(res => {
              if (res.code === 1) {
                this.adjustPriceInfo_main = res.data;
                this.tableData = res.data.applyDPOList || [];
                let id = this.adjustPriceInfo_main.id;
                stock
                  .submitAdjustPrice(id)
                  .then(resp => {
                    done();
                    this.$hideLoading();
                    if (resp.code === 1) {
                      this.refreshList();
                      this.$message.success(resp.msg || "提交成功");
                    } else {
                      this.$message.error(resp.msg || "提交失败");
                    }
                  })
                  .catch(err => {
                    done();
                    this.$hideLoading();
                    this.$message.error(err.msg || "提交失败");
                  });
              } else {
                done();
                this.$hideLoading();
                this.$message.error(res.msg || "提交失败");
              }
            })
            .catch(err => {
              done();
              this.$hideLoading();
              this.$message.error(err.msg || "提交失败");
            });
        }
      });
    },
    save() {
      if (this.adjustPriceInfo_main.preAdjustPriceDate) {
        const adTime = new Date(
          Date.parse(
            this.adjustPriceInfo_main.preAdjustPriceDate.replace(/-/g, "/")
          )
        ).getTime();
        const now = new Date().getTime();
        if (adTime < now) {
          this.$message.warning("调价时间不能小于当前时间");
          return;
        }
      }

      //过滤调空白行
      this.tableData = this.tableData.filter(item => {
        return item.drugId;
      });
      if (this.tableData.length == 0) {
        this.$message.warning("调价单明细不可为空");
        return;
      }

      const list = this.tableData.find(
        item => !item.newPrice || item.newPrice === ""
      );

      if (typeof list !== "undefined") {
        this.$message.warning("请输入调后售价");
        return;
      }

      let saveData = {
        ...this.adjustPriceInfo_main,
        adjustPriceDPOList: this.tableData || "",
        priceType: this.adjustPriceInfo_main.adjustPriceType
      };

      delete saveData.entryTime;
      delete saveData.entryPersonName;
      delete saveData.submitPersonName;
      delete saveData.submitPersonTime;

      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否保存当前调价单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stock
            .addadjustPrice(saveData)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.$message.success("保存成功!");
                this.adjustPriceInfo_main = res.data;
                this.tableData = res.data.applyDPOList || [];
                this.refreshList();
              } else {
                this.$message.error(res.msg || "保存失败");
              }
            })
            .catch(res => {
              done();
              this.$hideLoading();
              this.$message.error(res.msg || "保存失败");
            });
        }
      });
    },
    adjTimeChange(val) {
      if (val) {
        let time = new Date(val.replace(/-/g, "/")).getTime();
        let nowTime = new Date().getTime();
        if (time < nowTime) {
          this.$message.warning("调价时间不应可选在当前时间之前!");
          this.$set(this.adjustPriceInfo_main, "preAdjustPriceDate", "");
        }
      }
    },
    getSearchData(row, index) {
      this.tableindex = index;
      // this.tableData = this.tableData.filter((item) => {
      //   return item.drugId !== row.drugId && Boolean(item.drugId);
      // });

      this.drugVisible = true;
      this.drugTitleName = row.drugName + row.spec;
      let searchParams = {
        ...this.pageParams,
        drugId: row.drugId
        // supplierCode: this.returninfo_main.supplierCode,
      };
      this.searchTable = [];
      this.getDrugBatchList(searchParams);
      return;
      this.$set(this.tableData, index, {
        ...row,
        oldPurchasePrice: row.purchasePrice,
        oldPrice: row.price,
        newPrice: ""
      });
    },
    //获取药品批次结果
    getDrugBatchList(params) {
      this.tableLoading = true;
      hmmBaseApi
        .getAssociationBatch(params)
        .then(res => {
          this.tableLoading = false;
          if (res.code === 1) {
            if (res.data.length == 0) {
              this.$message.error("暂无药品批次数据");
              return;
            }
            let list = res.data.map(drugWapper => {
              let { out, bl } = blukToOutfit(
                drugWapper.drugStock,
                drugWapper.packQuantity
              );
              return {
                ...drugWapper,
                outfit: out,
                bluk: bl,
                thOut: "",
                thBl: "",
                backQuantity: "",
                purchasePrice: drugWapper.purchasePrice || 0,
                price: drugWapper.price || 0,
                drugStock: drugWapper.drugStock || 0,
                isEditing: true
              };
            });
            this.searchTable = list;
            this.searchTable.forEach((item, index) => {
              const ele = this.tableData.find(it => it.inId === item.inId);
              if (ele) {
                this.$set(this.searchTable, index, {
                  ...this.searchTable[index],
                  thOut: ele.thOut,
                  thBl: ele.thBl,
                  backQuantity: ele.backQuantity
                });
              }
            });
            const curItemIndex = this.searchTable.findIndex(
              item =>
                this.tableData[this.tableindex].inId &&
                item.inId === this.tableData[this.tableindex].inId
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
            });
          } else {
            this.$message.error(res.msg || "药品批次查询失败");
          }
          this.tableLoading = false;
        })
        .catch(res => {
          console.log(res);
          this.tableLoading = false;
          this.$message.error(res.msg || "药品批次查询失败");
        });
    },
    // 调后售价输入变动
    priceChange(val, index) {
      const valid = new RegExp(
        "^(([0-9]+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*))$"
      ).test(val);
      if (!valid) {
        this.$message.warning("请输入大于0的数字");
        this.$set(this.tableData[index], "newPrice", "");
      }
    },
    adjustChange() {
      this.$set(this.adjustPriceInfo_main, "preAdjustPriceDate", "");
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
    // padding: 0 20px;
  }

  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .apply-info {
    color: $l-color-fontcolor-3;

    .label {
      color: $l-color-fontcolor-4;
    }

    & > div {
      // margin-top: 10px;
      overflow: hidden;

      .item {
        min-width: 135px;
        float: left;
      }

      .disabled {
        background: $l-color-bgcolor-18;
      }

      .form-item {
        width: 260px;
        margin-right: 6px;
      }

      .form-item:last-child {
        margin-right: 0;
      }
    }
  }
}
.table-btn {
  .el-button {
    padding: 0;
    color: $l-color-black;
    font-weight: normal;
  }
}
</style>
