<template>
  <div id="main" ref="page" class="height100">
    <el-card class="height100" ref="card_main" v-loading="loading">
      <div class="filter" ref="filter">
        <div class="filter-inner clearfix">
          <div class="float-left leftDiv">
            <el-button v-if="false" class="button primary" type="primary"
              >机器数量导入</el-button
            >
          </div>
          <div class="float-right inline-block" style="font-size: 0">
            <el-button
              v-if="recordStatus === '0'"
              class="less-btn"
              type="primary"
              @click="inventoryLock"
              >盘存锁定</el-button
            >
            <el-button
              v-if="recordStatus === '1'"
              class="less-btn"
              type="primary"
              @click="inventoryUnlock"
              >盘存解锁</el-button
            >
            <el-button
              v-show="canOpenDialog !== null"
              :disabled="recordStatus === '0'"
              class="less-btn"
              type="primary"
              plain
              @click="inventoryCort"
              >盘存校正</el-button
            >
            <el-button
              :disabled="recordStatus === '0'"
              class="less-btn"
              type="primary"
              plain
              @click="inventoryEnd"
              >盘存结束</el-button
            >
            <el-button
              class="less-btn"
              type="primary"
              plain
              @click="inventoryInvalid"
              :disabled="tableData.length === 0"
              >盘存作废</el-button
            >
          </div>
        </div>
      </div>
      <div
        class="tableBody"
        style="height: calc(100% - 128px); padding: 0 16px"
      >
        <el-table
          ref="singleTable"
          :data="tableData"
          :summary-method="getSummaries"
          :row-class-name="tableRowClassName"
          height="100%"
          show-summary
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          @row-dblclick="correction"
        >
          <!-- 业务列 -->
          <el-table-column
            v-for="(item, index) in tableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'left'"
            :width="item.width"
            header-align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row, $index }">
              <!-- 可自定义内容 -->

              <span v-if="item.prop === 'profferNo'">
                <el-input-number
                  style="display: inline-block; width: 60px"
                  size="mini"
                  v-model="boxNum"
                  @change="handleChange"
                  step-strictly
                  :controls="false"
                  :min="0"
                ></el-input-number
                >盒
                <el-input-number
                  style="display: inline-block; width: 60px"
                  size="mini"
                  v-model="piuNum"
                  @change="handleChange"
                  step-strictly
                  :controls="false"
                  :min="0"
                ></el-input-number
                >片
              </span>
              <template v-else-if="item.prop === 'isCorrect'">
                <span
                  v-if="
                    row.takeStock === row.drugStock && row.isCorrect !== '1'
                  "
                  >无需校正</span
                >
                <span
                  v-else-if="
                    row.takeStock !== row.drugStock && row.isCorrect === '0'
                  "
                  style="color: red"
                  >未校正</span
                >
                <span v-else-if="row.isCorrect === '1'" style="color: #67c23a"
                  >已校正</span
                >
                <div class="outfitNum" style="display: none;">
                  <span>{{ row.pcOut }}</span>
                  <span
                    :val="row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="row.pcBl !== 0">
                    <span>{{ row.pcBl }}</span>
                    <span
                      :val="row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
              </template>
              <template v-else-if="item.prop === 'drugStock'">
                <div class="drugStock">
                  <span>{{ row.outfit }}</span>
                  <span
                    :val="row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="row.bluk !== 0">
                    <span>{{ row.bluk }}</span>
                    <span
                      :val="row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
              </template>
              <template v-else-if="item.prop === 'preQuantity'">
                <div class="noWrap">
                  <el-input
                    :disabled="recordStatus === '1'"
                    @keyup.native="textValue($event, $index, 'preOut')"
                    v-model="row.preOut"
                  ></el-input>
                  <span
                    :val="row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="row.unitSaleFlg === '1'">
                    <el-input
                      :disabled="recordStatus === '1'"
                      v-model="row.preBl"
                      style="line-height: 34px"
                      @keyup.native="textValue($event, $index, 'preBl')"
                    ></el-input>
                    <span
                      :val="row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
              </template>
              <template v-else-if="item.prop === 'entryQuantity'">
                <span>{{ row.lrOut }}</span>
                <span
                  :val="row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="row.lrBl !== 0">
                  <span>{{ row.lrBl }}</span>
                  <span
                    :val="row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
              <template v-else-if="item.prop === 'takeStock'">
                <span>{{ row.pcOut }}</span>
                <span
                  :val="row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="row.pcBl !== 0">
                  <span>{{ row.pcBl }}</span>
                  <span
                    :val="row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
              <template v-else-if="item.prop === 'purchasePrice'">
                <span>{{ formatNum(row.purchasePrice) }}</span>
              </template>
              <template v-else-if="item.prop === 'price'">
                <span>{{ formatNum(row.price) }}</span>
              </template>
              <template v-else-if="item.prop === 'takeImportMoney'">
                <span>{{ formatNum(row.takeImportMoney) }}</span>
              </template>
              <template v-else-if="item.prop === 'takeExportMoney'">
                <span>{{ formatNum(row.takeExportMoney) }}</span>
              </template>
              <span v-else>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom-button bottom-btn height-button-bottom">
        <el-button
          class="less-btn float-left"
          type="primary"
          plain
          @click="exportExcel"
          >导出</el-button
        >
        <el-button
          @click="print"
          class="less-btn float-left"
          type="primary"
          plain
          >打印</el-button
        >
        <el-button
          v-if="recordStatus == 0"
          @click="saveList"
          class="less-btn float-right"
          type="primary"
          >保存</el-button
        >
        <p class="explain float-right">盘存数量 = 录入数量 + 预盘数量</p>
      </div>
    </el-card>
    <!-- 盘存校正弹窗 -->
    <l-dialog
      :visible.sync="drugVisible"
      title="盘存校正"
      width="1100px"
      :customBottom="true"
    >
      <template #content>
        <el-form label-position="top" inline style="padding: 20px">
          <el-table
            :data="correctionTable"
            border
            style="width: 100%"
            v-loading="tableLoading"
            element-loading-text="列表正在加载中"
            height="300"
            :class="[warnCorTr ? 'warn-tr' : '']"
          >
            <el-table-column
              show-overflow-tooltip
              prop="drugName"
              label="药品名称"
            ></el-table-column>
            <el-table-column
              label="进价(元)"
              width="100"
              align="right"
              prop="purchasePrice"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="售价(元)"
              width="100"
              align="right"
              prop="price"
            >
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存量" prop="drugStock" width="160">
              <template slot-scope="{ row }">
                <span>{{ row.outfit }}</span>
                <span
                  :val="row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="row.bluk !== 0">
                  <span>{{ row.bluk }}</span>
                  <span
                    :val="row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
            </el-table-column>
            <!-- <el-table-column label="盘存量" prop="pcStock">
            <template slot-scope="{row}">
              <span>{{row.pcOut}}</span>
              <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="row.pcBl!==0">
                <span>{{row.pcBl}}</span>
                <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
              </template>
            </template>
            </el-table-column>-->
            <el-table-column label="校正数量" width="240">
              <template slot-scope="{ row, $index }">
                <div class="noWrap">
                  <el-input
                    @keyup.native="textValueDia($event, $index, 'takeOut')"
                    @blur="checkCorData"
                    v-model.number="row.takeOut"
                  ></el-input>
                  <span
                    :val="row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="row.unitSaleFlg === '1'">
                    <el-input
                      v-model="row.takeBl"
                      style="line-height: 34px"
                      @blur="checkCorData"
                      @keyup.native="textValueDia($event, $index, 'takeBl')"
                    ></el-input>
                    <span
                      :val="row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
                <!-- <el-input
                type="number"
                v-model="scope.row.takeStock"
                @keyup.native="textValue($event)"
                placeholder
                @blur="checkCorData"
                ></el-input>-->
              </template>
            </el-table-column>
            <!-- <el-table-column label="单位">
            <template slot-scope="scope">
              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
            </template>
            </el-table-column>-->
            <el-table-column
              show-overflow-tooltip
              label="生产批号"
              prop="batchNum"
            ></el-table-column>
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
      <template #footerContent>
        <el-row class="dia-bottom">
          <el-col :span="12">
            <span>
              盘存数量:{{ diagPcTextOut }}
              <span
                :val="
                  tableData[curTakeIndex]
                    ? tableData[curTakeIndex]['drugUnit']
                    : ''
                "
                code="DrugUnit"
                v-codeTransform
              ></span>
              <template
                v-if="
                  tableData[curTakeIndex] &&
                    tableData[curTakeIndex]['unitSaleFlg'] === '1'
                "
              >
                {{ diagPcTextBl }}
                <span
                  :val="
                    tableData[curTakeIndex]
                      ? tableData[curTakeIndex]['packUnit']
                      : ''
                  "
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </span>
          </el-col>
          <el-col :span="12">
            <div class="float-right">
              <el-button type="primary" @click="conserve" :loading="corSaveLoad"
                >确认</el-button
              >
              <el-button type="primary" plain @click="drugVisible = false"
                >关闭</el-button
              >
            </div>
          </el-col>
        </el-row>
      </template>
    </l-dialog>
  </div>
</template>

<script>
import stockApi from "@/api/hmm/stock";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "windowInput",
  data() {
    return {
      boxNum: 0,
      piuNum: 0,
      tableColumn: [],
      tableColumnLock: [
        {
          prop: "drugName",
          label: "药品名称",
          type: "selectTable"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "drugLocations",
          label: "相关货位号"
        },
        {
          prop: "isCorrect",
          label: "是否校正"
        },
        {
          prop: "purchasePrice",
          label: "参考进价(元)",
          align: "right",
          width: 120
        },
        {
          prop: "price",
          label: "参考售价(元)",
          align: "right",
          width: 120
        },
        {
          prop: "preQuantity",
          label: "预盘数量",
          width: 240
        },
        /* {
          prop : 'machinesNo',
          label : '机器数量'
        },*/
        {
          prop: "entryQuantity",
          label: "录入数量"
        },
        {
          prop: "takeStock",
          label: "盘存数量"
        },
        {
          prop: "drugStock",
          label: "当前库存"
        },
        {
          prop: "takeImportMoney",
          label: "盘亏进价金额(元)",
          align: "right",
          width: 200
        },
        {
          prop: "takeExportMoney",
          label: "盘亏售价金额(元)",
          align: "right",
          width: 200
        }
      ],
      tableColumnUnlock: [
        {
          prop: "drugName",
          label: "药品名称",
          type: "selectTable"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "drugLocations",
          label: "相关货位号"
        },
        {
          prop: "isCorrect",
          label: "是否校正"
        },
        {
          prop: "purchasePrice",
          label: "参考进价(元)",
          align: "right",
          width: 120
        },
        {
          prop: "price",
          label: "参考售价(元)",
          align: "right",
          width: 120
        },
        {
          prop: "preQuantity",
          label: "预盘数量",
          width: 240
        },
        /* {
          prop : 'machinesNo',
          label : '机器数量'
        },*/
        {
          prop: "entryQuantity",
          label: "录入数量"
        },
        {
          prop: "drugStock",
          label: "当前库存"
        }
      ],
      tableData: [],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 0, // 总共页数
        pageSize: 10 // 每页数据条数
      },
      recordStatus: "",
      loading: false,
      // 盘存校正
      // 是否是精细盘存
      canOpenDialog: null,
      drugVisible: false,
      tableLoading: false,
      correctionTable: [],
      currentRow: null,
      corSaveLoad: false,
      warnCorTr: false,
      // 当前选择校正的盘存量
      curTakeIndex: 0,
      diagPcTextOut: 0,
      diagPcTextBl: 0
    };
  },
  created() {
    this.getAllData();
  },
  mounted() {},
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    getAllData() {
      this.loading = true;
      this.tableData = [];
      stockApi
        .sumData()
        .then(res => {
          this.loading = false;
          if (!res.data) {
            this.tableData = [];
            return;
          }
          if (res.code == 1) {
            this.recordStatus = res.data.recordStatus;
            if (this.recordStatus === "1") {
              this.tableColumn = this.tableColumnLock;
            } else {
              this.tableColumn = this.tableColumnUnlock;
            }
            let list = res.data.takeStockDVOList.map(item => {
              let dstock =
                typeof item.drugStock === "number" ? item.drugStock : 0;
              let { out, bl } = blukToOutfit(dstock, item.packQuantity);
              let pcnum = blukToOutfit(item.takeStock, item.packQuantity);
              let prenum = blukToOutfit(item.preQuantity, item.packQuantity);
              let lrnum = blukToOutfit(item.entryQuantity, item.packQuantity);
              return {
                ...item,
                drugStock: dstock,
                outfit: out,
                bluk: bl,
                pcOut: pcnum.out,
                pcBl: pcnum.bl,
                preOut: prenum.out,
                preBl: prenum.bl,
                lrOut: lrnum.out,
                lrBl: lrnum.bl,
                takeImportMoney:
                  Math.round(
                    ((item.takeStock - dstock) * (item.purchasePrice * 100)) /
                      item.packQuantity
                  ) / 100,
                takeExportMoney:
                  Math.round(
                    ((item.takeStock - dstock) * (item.price * 100)) /
                      item.packQuantity
                  ) / 100
              };
            });
            this.tableData = list;
            this.$nextTick(() => {
              this.$refs.singleTable.doLayout();
            });
            list = null;
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
        })
        .catch(res => {
          this.loading = false;
          this.$message.error(res.msg || "获取数据失败");
        });
      stockApi
        .isOpenDialog()
        .then(res => {
          if (res.code === 1) {
            let flag;
            if (res.data.preciseBatch === "1") {
              flag = true;
            } else {
              flag = false;
            }
            this.canOpenDialog = flag;
          }
        })
        .catch();
    },
    iLockFunc() {
      //盘存锁定
      this.$showLoading();
      stockApi
        .inventoryLock()
        .then(res => {
          this.$hideLoading();
          if (res.code == 1) {
            this.getAllData();
            this.$message({
              type: "success",
              message: "盘存锁定成功!"
            });
          } else {
            this.$message.error(res.msg || "盘存锁定失败");
          }
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "盘存锁定失败");
        });
    },
    inventoryLock() {
      this.operationTips("盘存锁定", this.iLockFunc);
    },
    iUnlockFunc() {
      //盘存解锁
      this.$showLoading();
      stockApi
        .inventoryUnlock()
        .then(res => {
          this.$hideLoading();
          if (res.code == 1) {
            this.getAllData();
            this.$message({
              type: "success",
              message: "盘存解锁成功!"
            });
          } else {
            this.$message.error(res.msg || "盘存解锁失败");
          }
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "盘存解锁失败");
        });
    },
    inventoryUnlock() {
      this.operationTips("盘存解锁", this.iUnlockFunc);
    },
    iToryCortFunc() {
      //盘存校正
      this.$showLoading();
      stockApi
        .inventoryCort([])
        .then(res => {
          this.$hideLoading();
          if (res.code == 1) {
            this.getAllData();
            this.$message({
              type: "success",
              message: "盘存校正成功!"
            });
          } else {
            this.$message.error(res.msg || "盘存校正失败");
          }
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "盘存校正失败");
        });
    },
    inventoryCort() {
      this.operationTips("盘存校正", this.iToryCortFunc);
    },
    iToryEndFunc() {
      //盘存结束
      this.$showLoading();
      stockApi
        .inventoryEnd()
        .then(res => {
          this.$hideLoading();
          if (res.code == 1) {
            this.tableData.splice(0);
            this.$message({
              type: "success",
              message: res.msg
            });
          } else {
            this.$message.error(res.msg || "盘存结束失败");
          }
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "盘存结束失败");
        });
    },
    inventoryEnd() {
      this.operationTips("盘存结束", this.iToryEndFunc);
    },
    iToryInvalidFunc() {
      //盘存作废
      this.$showLoading();
      stockApi
        .inventoryInvalid()
        .then(res => {
          this.$hideLoading();
          if (res.code == 1) {
            this.getAllData();
            this.$message({
              type: "success",
              message: "盘存作废成功!"
            });
          } else {
            this.$message.error(res.msg || "盘存作废失败");
          }
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "盘存作废失败");
        });
    },
    inventoryInvalid() {
      this.operationTips("盘存作废", this.iToryInvalidFunc);
    },
    exportExcel() {
      let nums = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".outfitNum"
      );
      let drugStock = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".drugStock"
      );
      let tableData_new = this.tableData.map((item, i) => {
        return {
          ...item,
          _num: nums[i].innerText,
          _drugStock: drugStock[i].innerText
        };
      });
      let excelData = {
        title: ["盘存表", "", "", "", "", "", ""],
        where: [],
        tHeader: [
          "药品名称",
          "规格",
          "生产厂商",
          "进价",
          "售价",
          "盘存数量",
          "当前库存"
        ],
        filterVal: [
          "drugName",
          "spec",
          "originName",
          "purchasePrice",
          "price",
          "_num",
          "_drugStock"
        ],
        listDate: tableData_new,
        fileName: "盘存表",
        merges: ["A1:G1"]
      };
      jsonToExcel(excelData);
    },
    print() {
      let nums = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".outfitNum"
      );
      let drugStock = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".drugStock"
      );

      let data = {};
      data.title = "盘存表";
      data.num = "";
      let detailList = this.tableData.map((item, i) => {
        return {
          ...item,
          _num: nums[i].innerText,
          _drugStock: drugStock[i].innerText
        };
      });
      data.detailList = detailList;
      onPreview(data, "盘存表");
    },
    submitAddMore() {},
    AddDataChange() {},
    handleChange(value) {},
    // 表尾合计行
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index < 10) {
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev * 10000 + curr * 10000) / 10000;
            }
            return prev;
          }, 0);
          sums[index] = this.formatNum(sums[index]) + "元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    // 操作提示
    operationTips(msg, cb) {
      this.$confirmFunc({
        titleText: "提示",
        contentText: `您确定要${msg}?`,
        confirm: async (action, instance, done) => {
          await cb();
          done();
        },
        cancel: () => {
          this.$message({
            type: "info",
            message: "已取消" + msg
          });
        }
      });
    },
    textValue(e, index, key) {
      this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入0或正整数");
        e.target.value = "";
        this.$set(this.tableData[index], key, "");
      }
      let item = this.tableData[index];
      let num = outfitToBluk(item.preOut, item.preBl, item.packQuantity);

      this.$set(this.tableData[index], "preQuantity", num);
      let takenum = num + item.entryQuantity;
      let takeim =
        Math.round(
          ((takenum - item.drugStock) * (item.purchasePrice * 100)) /
            item.packQuantity
        ) / 100;
      let takeem =
        Math.round(
          ((takenum - item.drugStock) * (item.price * 100)) / item.packQuantity
        ) / 100;
      this.$set(this.tableData, index, {
        ...item,
        preQuantity: num,
        pcOut: +item.preOut + +item.lrOut,
        pcBl: +item.preBl + +item.lrBl,
        takeStock: takenum,
        takeImportMoney: takeim,
        takeExportMoney: takeem
      });
    },
    textValueDia(e, index, key) {
      this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入0或正整数");
        e.target.value = "";
        this.$set(this.correctionTable[index], key, "");
      }
      let num = outfitToBluk(
        this.correctionTable[index].takeOut,
        this.correctionTable[index].takeBl,
        this.correctionTable[index].packQuantity
      );
      this.$set(this.correctionTable[index], "takeStock", num);
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 双击精细盘存弹窗
    correction(row, col, ev) {
      if (this.recordStatus === "1" && this.canOpenDialog) {
        this.curTakeIndex = this.tableData.findIndex(
          item => item.id === row.id
        );

        this.diagPcTextOut =
          parseInt(this.tableData[this.curTakeIndex].preOut) +
          parseInt(this.tableData[this.curTakeIndex].lrOut);
        this.diagPcTextBl =
          parseInt(this.tableData[this.curTakeIndex].preBl) +
          parseInt(this.tableData[this.curTakeIndex].lrBl);
        this.getCorList();
        this.drugVisible = true;
      }
    },
    // 获取校正弹窗列表
    getCorList() {
      this.tableLoading = true;
      this.correctionTable.splice(0);
      stockApi
        .listByDrugId({
          drugId: this.currentRow.drugId
        })
        .then(res => {
          if (res.code === 1) {
            let list = res.data.map(item => {
              let kcnum = blukToOutfit(item.drugStock, item.packQuantity);
              let pcnum = blukToOutfit(
                this.currentRow.takeStock,
                item.packQuantity
              );
              let takenum = blukToOutfit(item.takeStock, item.packQuantity);
              return {
                ...item,
                outfit: kcnum.out,
                bluk: kcnum.bl,
                pcOut: pcnum.out,
                pcBl: pcnum.bl,
                takeOut: takenum.out,
                takeBl: takenum.bl,
                pcStock: this.currentRow.takeStock
              };
            });
            this.correctionTable = list;
            list = null;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 盘存校正弹窗确认操作
    conserve() {
      let isSure = this.checkCorData();
      if (isSure) {
        this.$message({
          type: "warning",
          message: "校正数据有误，请检查"
        });
        return;
      }
      this.corSaveLoad = true;
      stockApi
        .saveCor(this.correctionTable)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "校正成功"
            });
            this.drugVisible = false;
            let pnum =
              res.data - this.tableData[this.currentRow.index].entryQuantity;
            let bluk = blukToOutfit(
              pnum,
              this.tableData[this.currentRow.index].packQuantity
            );
            this.$set(this.tableData, this.currentRow.index, {
              ...this.tableData[this.currentRow.index],
              isCorrect: 1,
              takeStock: res.data,
              preOut: bluk.out,
              preBl: bluk.bl
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg || "校正失败"
            });
          }
          this.corSaveLoad = false;
        })
        .catch(err => {
          this.corSaveLoad = false;
          this.$message({
            type: "error",
            message: err || "校正失败"
          });
        });
    },
    // 检查校正数据是否正确
    checkCorData() {
      let sum = this.correctionTable.reduce((item, next) => {
        let num = parseInt(next.takeStock);
        return item + num;
      }, 0);
      let kcSum =
        parseInt(this.currentRow.preQuantity) +
        parseInt(this.currentRow.entryQuantity);
      let flag;
      if (sum !== kcSum) {
        flag = true;
      } else {
        flag = false;
      }
      this.warnCorTr = flag;
      return flag;
    },
    saveList() {
      // 保存
      let params = this.tableData.map(item => {
        return {
          id: item.id,
          drugId: item.drugId,
          dataVersion: item.dataVersion,
          entryQuantity: item.entryQuantity,
          preQuantity: item.preQuantity
        };
      });
      this.$showLoading();
      stockApi
        .saveEntry(params)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            this.getAllData();
            this.$message.success("保存成功");
          } else {
            this.$message.error(res.msg || "保存失败");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "保存失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.vertical {
  vertical-align: top;
}
.filter-inner {
  margin: 16px;
}

.bottom-button {
  width: 100%;
  height: 100%;
  padding: 16px;
}
.warn-tr /deep/ tbody tr {
  background-color: $l-color-error;
}
.noWrap {
  white-space: nowrap;
  .el-input {
    width: 80px;
  }
}
.explain {
  line-height: 36px;
  margin-right: 20px;
}
.dia-bottom {
  text-align: left;
  line-height: 36px;
}
</style>
