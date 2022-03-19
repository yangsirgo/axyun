<template>
  <div id="main" ref="page" class="height100">
    <el-card class="height100" ref="card_main">
      <div class="filter" ref="filter">
        <div class="filter-inner">
          <div class="leftDiv">
            <l-formt-title
              class="form-item"
              label="盘点窗口"
              labelWidth="64"
              style="width: 200px;margin-right:8px;"
            >
              <el-select v-model="Lvalue" placeholder="请选择">
                <el-option
                  v-for="item in Loptions"
                  :key="item.value"
                  :label="item.windowName"
                  :value="item.windowCode"
                >
                  <span style="float: left">{{ item.windowName }}</span>
                  <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.windowStatus == 0 ? "空闲" : "使用中"
                  }}</span>-->
                </el-option>
              </el-select>
            </l-formt-title>
            <el-button
              v-if="btnStatus == 0"
              type="primary"
              plain
              @click="searchDrugList"
              class="vertical"
              style="margin-right:16px;"
              >确定</el-button
            >
            <l-formt-title
              class="form-item margin-left-10 more-selected"
              label="选择位置大类"
              labelWidth="90"
              style="width: 380px;margin-right:8px;"
              :disabled="isSure"
            >
              <el-select
                clearable
                v-model="Nvalue"
                multiple
                placeholder="请选择"
                :disabled="isSure"
              >
                <el-option
                  v-for="item in locationList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </l-formt-title>
            <el-button
              :disabled="isSure"
              type="primary"
              @click="filterList"
              plain
              class="vertical"
              style="margin-right:16px;"
              >过滤</el-button
            >
            <Linput
              class
              :popoverWidth="800"
              style="display:inline-block;vertical-align: top;width: 150px;margin-right:8px;"
              suffix-icon="el-icon-search"
              :tableData="selectOptions"
              @query="elsearch($event)"
              @select="select"
              :tableParams="dropColumn"
              :backDrugName="Dinput1"
              :disabled="isSure"
              :storageCode="storageCode"
              @sendVal="getdrugName"
              placeholder="搜索并选择药品"
            ></Linput>
            <el-button
              class="button vertical"
              type="primary"
              :disabled="isSure"
              @click="drugPosition"
              >定位</el-button
            >
            <div style="display:flex;flex-direction:column;">
              <el-checkbox
                class="vertical-custom margin-left-20"
                v-model="checked"
                @change="checkedChange"
                :disabled="isSure"
                >显示库存和盈亏金额</el-checkbox
              >
              <span class="vertical-custom remarks"
                >（当前库存为药品库存总量，非对应货位号库存，仅供参考）</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="tableBody">
        <el-table
          ref="singleTable"
          highlight-current-row
          @current-change="handleCurrentChange"
          :data="tableData"
          v-loading="tl_isLoading"
          element-loading-text="加载中..."
          height="100%"
          border
          :row-style="tableRowClassName"
          v-hotKey="{
            func: ['table_row', 'table_checkbox', 'table_choose'],
            deClass: 'el-table__row',
            curClass: 'current-row'
          }"
        >
          <!-- 业务列 -->
          <el-table-column
            v-for="item in tableColumn"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'left'"
            :width="item.width"
            header-align="center"
            :show-overflow-tooltip="item.overflow"
          >
            <template slot-scope="{ row, $index }">
              <!-- 可自定义内容 -->

              <template v-if="item.type === 'selectTable'">
                <span type="drug_part">{{ row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop === 'drugName'">
                <span :style="drugMark === $index ? 'background:yellow' : ''">
                  {{ row.drugName }}
                </span>
              </template>
              <template v-else-if="item.prop === 'takeStock'">
                <div class="noWrap">
                  <el-input
                    @keyup.native="textValue($event, $index, 'pcOut')"
                    v-model.number="row.pcOut"
                    :disabled="canSaveFlag"
                  ></el-input>
                  <span
                    :val="row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="row.unitSaleFlg === '1'">
                    <el-input
                      v-model="row.pcBl"
                      style="line-height: 34px;"
                      @keyup.native="textValue($event, $index, 'pcBl')"
                    ></el-input>
                    <span
                      :val="row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
              </template>
              <template v-else-if="item.prop == 'locationSort'">
                <span
                  v-if="row[item.prop]"
                  tableName="hrp_location_sort"
                  :conditionMap="{
                    STORAGE_CODE: storageCode,
                    LOCATION_SORT: row[item.prop]
                  }"
                  columns="LOCATION_SORT_NAME"
                  v-tableTransform
                ></span>
                <span v-else>--</span>
              </template>
              <template v-else-if="item.prop == 'purchasePrice'">
                <span>{{ formatNum(row.purchasePrice,4) }}</span>
              </template>
              <template v-else-if="item.prop == 'price'">
                <span>{{ formatNum(row.price,4) }}</span>
              </template>
              <template v-else-if="item.prop === 'takeOutNum'">
                <span>{{
                  parseInt((row.takeStock - row.drugStock) / row.packQuantity)
                }}</span>
                <span
                  :val="row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template
                  v-if="
                    row.unitSaleFlg === '1' &&
                      (row.takeStock - row.drugStock) % row.packQuantity !== 0
                  "
                >
                  <span>{{
                    (row.takeStock - row.drugStock) % row.packQuantity
                  }}</span>
                  <span
                    :val="row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
              <template v-else-if="item.prop === 'takeImportMoney'">
                <span>
                  {{
                    formatNum(
                      (((row.takeStock - row.drugStock) / row.packQuantity) *
                        Math.round(row.purchasePrice * 100)) /
                        100
                    )
                  }}
                </span>
              </template>
              <template v-else-if="item.prop === 'takeExportMoney'">
                <span>
                  {{
                    formatNum(
                      (((row.takeStock - row.drugStock) / row.packQuantity) *
                        Math.round(row.price * 100)) /
                        100
                    )
                  }}
                </span>
              </template>
              <template v-else-if="item.prop === 'drugStock'">
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
              <span v-else>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom-button bottom-btn height-button-bottom">
        <el-button
          class="less-btn float-left"
          @click="print"
          type="primary"
          plain
          >打印</el-button
        >
        <el-button
          class="less-btn float-left"
          @click="exportExcel"
          type="primary"
          plain
        >导出</el-button
        >
        <el-button
          class="less-btn float-right"
          @click="cleanNumber"
          type="primary"
          plain
          >数量清空</el-button
        >
        <el-button
          class="less-btn float-right"
          @click="saveList"
          type="primary"
          v-hotKey="{ func: 'func_save', flag: 'saveLoad' }"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import base from "@/api/hmm/base";
import stockApi from "@/api/hmm/stock";
import { deepClone } from "@/utils/index.js";
import { print, preview, onPreview } from "@/utils/print";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement";
import formatNum from "@/utils/formatPrice";
import Linput from "./component/Linput";
import { refToArr } from "@/utils/util.js";
import { jsonToExcel } from "@/utils/excel/excel";

export default {
  name: "windowInput",
  components: {
    Linput
  },
  data() {
    return {
      btnStatus: "",
      tl_isLoading: false,
      checked: true, // 控制 table的列
      mult: [],
      Dinput1: "", //搜索药品名称
      Lvalue: "",
      Nvalue: [],
      Loptions: [], //盘点窗口
      Noptions: [
        { id: "0", name: "A" },
        { id: "1", name: "B" },
        { id: "2", name: "C" }
      ],
      tempName: "",
      NoCheckedTableColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          type: "selectTable",
          overflow: true
        },
        {
          prop: "spec",
          label: "规格",
          overflow: true
        },
        {
          prop: "locationSort",
          label: "位置大类"
        },
        {
          prop: "locationSortNo",
          label: "货位号"
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
          prop: "takeStock",
          label: "盘存输入",
          type: "takeStock",
          width: 240
        }
      ],
      tableColumn: [],
      checkedTableColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          type: "selectTable",
          overflow: true
        },
        {
          prop: "spec",
          label: "规格",
          overflow: true
        },
        {
          prop: "locationSort",
          label: "位置大类"
        },
        {
          prop: "locationSortNo",
          label: "货位号"
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
          prop: "drugStock",
          label: "当前库存"
        },
        {
          prop: "takeStock",
          label: "盘存输入",
          type: "takeStock",
          width: 240
        },
        {
          prop: "takeOutNum",
          label: "盘存盈亏数量",
          type: "takeOutNum"
        },
        {
          prop: "takeImportMoney",
          label: "盘盈盘亏进价金额(元)",
          align: "right",
          width: 200,
          type: "takeImportMoney"
        },
        {
          prop: "takeExportMoney",
          label: "盘盈盘亏售价金额(元)",
          align: "right",
          width: 200,
          type: "takeExportMoney"
        }
      ],
      tableData: [],
      backTableData: [],
      manageType: "0",
      locationNumber: "0",
      drugsType: "0",
      lOptions: [
        {
          value: "0",
          label: "全部"
        }
      ],
      // 锁定过滤查询操作
      isSure: true,
      saveLoad: false,
      // 判断是否可以保存数据
      canSaveFlag: false,
      dropColumn: [
        {
          prop: "drugName",
          label: "药品名称"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "locationSort",
          label: "位置大类"
        },
        {
          prop: "locationSortNo",
          label: "货位号"
        },
        {
          prop: "drugStock",
          label: "库存",
          width: 80
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          width: 100
        },
        {
          prop: "price",
          label: "售价(元)",
          width: 100
        },
        {
          prop: "formCode",
          label: "剂型"
        }
      ],
      selectOptions: [],
      storageCode: "",
      locationList: [],
      chooseItem: {},
      // 定位
      drugArr: [],
      drugTempIndex: -1,
      drugMark: -1
    };
  },
  created() {
    this.tableColumn = this.checkedTableColumn;
    this.getAllWindow();
    this.getUserStorage();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      // console.log(`drugMark`, this.drugMark);
      // console.log(`rowIndex`, rowIndex)
      let styleJson = {};
      if (rowIndex === this.drugMark) {
        styleJson = {
          background: "yellow"
        };
      } else {
        styleJson = {};
      }

      return styleJson; // 返回对象
    },
    formatNum(num,no) {
      return formatNum(num,no);
    },
    filterList() {
      let list;
      if (this.Nvalue.length === 0) {
        list = deepClone(this.backTableData);
      } else {
        list = this.backTableData.filter(item =>
          this.Nvalue.includes(item.locationSort)
        );
      }
      this.tableData = list;
    },
    lockWindow() {
      //锁定窗口
      stockApi
        .lockWindow(this.Lvalue)
        .then(res => {
          if (res.code == 1) {
            this.getAllWindow();
          } else {
            this.$message.error(res.msg || "锁定失败");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "锁定失败");
        });
    },
    textValue(e, index, key) {
      this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入0或正整数");
        e.target.value = "";
        this.$set(this.tableData[index], key, "");
      }
      let num = outfitToBluk(
        this.tableData[index].pcOut,
        this.tableData[index].pcBl,
        this.tableData[index].packQuantity
      );
      this.$set(this.tableData[index], "takeStock", num);
    },
    //获取所有窗口
    getAllWindow() {
      stockApi
        .getAllWindow()
        .then(res => {
          if (res.code == 1) {
            this.Loptions = res.data;
          } else {
            this.$message.error(res.msg || "获取窗口数据失败");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取窗口数据失败");
        });
    },
    //获取药品
    getDrugsList(drugName) {
      this.$showLoading();
      let params = {};
      params.windowCode = this.Lvalue;
      stockApi
        .sumData()
        .then(res => {
          params.takeStockId = res.data.id;
          if (drugName) {
            params.drugName = this.Dinput1;
          }
          stockApi
            .getDrugsList(params)
            .then(res => {
              this.$hideLoading();
              if (res.code == 1) {
                let list = res.data.map(item => {
                  let { out, bl } = blukToOutfit(
                    item.drugStock,
                    item.packQuantity
                  );
                  let stock =
                    typeof item.takeStock === "number"
                      ? item.takeStock
                      : item.drugStoc;
                  let pcnum = blukToOutfit(stock, item.packQuantity);
                  return {
                    ...item,
                    outfit: out,
                    bluk: bl,
                    takeStock: stock,
                    pcOut: pcnum.out,
                    pcBl: pcnum.bl
                  };
                });
                this.tableData = deepClone(list);
                this.backTableData = deepClone(list);
              } else {
                this.$message.error(res.msg || "获取药品数据失败");
              }
            })
            .catch(res => {
              this.$hideLoading();
              this.$message.error(res.msg || "获取药品数据错误");
            });
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "获取药品数据错误");
        });
      // this.$hideLoading();
    },
    print() {
      console.log(this.tableData);
      let data = {};
      data.title = "盘存单";
      data.num = "";
      let tableArr = refToArr(this.$refs.singleTable);
      let detailList = this.tableData.map((data, index) => {
        return {
          ...data,
          qty: tableArr[index][6]
        };
      });
      data.detailList = detailList;
      onPreview(data, "盘存单");
    },
    exportExcel() {
      stockApi
        .listByDrugId()
        .then(res => {
          if (res.code == 1) {
            let excelData = {
              title: ["盘存单", "", "", "", "", "", "", "", "", ""],
              tHeader: [
                "类别",
                "药品名称",
                "规格",
                "产地",
                "进价(元)",
                "售价(元)",
                "当前库存",
                "库存金额(元)",
                "批次",
                "有效期"
              ],
              filterVal: [
                "cwTypeName",
                "drugName",
                "spec",
                "originName",
                "purchasePrice",
                "price",
                "drugStockDisplay",
                "amt",
                "batchNum",
                "expiryDate"
              ],
              listDate: res.data,
              fileName: "盘存单",
              merges: ["A1:J1"]
            };
            jsonToExcel(excelData);
          } else {
            this.$message.error(res.msg || "盘存药品批次查询失败");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "盘存药品批次查询失败");
        });
    },
    cleanNumber() {
      //数量清空
      this.$confirmFunc({
        titleText: "提示",
        contentText: "此操作会还原盘存输入!",
        confirm: (action, instance, done) => {
          this.tableData.forEach((item, index) => {
            let pcnum = blukToOutfit(item.drugStock, item.packQuantity);
            this.$set(this.tableData, index, {
              ...this.tableData[index],
              takeStock: item.drugStock,
              pcOut: pcnum.out,
              pcBl: pcnum.bl
            });
          });
          done();
        }
      });
    },
    saveList() {
      //保存数据
      if (this.canSaveFlag) {
        this.$message.warning("盘存已锁定");
        return;
      } else if (this.tableData.length == 0) {
        this.$message.warning("保存数据不可为空");
        return;
      }
      this.$showLoading();
      this.saveLoad = true;
      let params = this.tableData.map(item => ({
        id: item.id,
        drugId: item.drugId,
        takeStock: item.takeStock,
        dataVersion: item.dataVersion
      }));
      stockApi
        .saveDrugsList(params)
        .then(res => {
          this.$hideLoading();
          if (res.code == 1) {
            this.getWindowDrug(true);
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.$message.error(res.msg || "保存失败");
          }
          this.saveLoad = false;
        })
        .catch(res => {
          this.saveLoad = false;
          this.$hideLoading();
          this.$message.error(res.msg || "保存失败");
        });
    },
    checkedChange(val) {
      if (val) {
        this.tableColumn = this.checkedTableColumn;
      } else {
        this.tableColumn = this.NoCheckedTableColumn;
      }
      this.$nextTick(() => {
        this.$refs.singleTable && this.$refs.singleTable.doLayout();
      });
    },
    getWindowDrug(flag) {
      this.tl_isLoading = true;
      this.tableData = [];
      stockApi
        .lockWindow(this.Lvalue)
        .then(res => {
          if (res.code == 1) {
            if (!flag) {
              this.$message({
                type: "success",
                message: "窗口确定成功"
              });
            }
            const list = res.data.map(item => {
              let dstock =
                typeof item.drugStock === "number" ? item.drugStock : 0;
              let { out, bl } = blukToOutfit(dstock, item.packQuantity);
              let tstock;
              let pcnum;
              // 如果一个药品有多个位置，不默认盘存数量
              const isMulti = res.data.filter(
                mul => mul.drugId === item.drugId
              );
              if (isMulti.length > 1) {
                // 如果接口返回了盘存数量，则直接用，没有为0
                tstock =
                  typeof item.takeStock === "number" ? item.takeStock : 0;
                pcnum = blukToOutfit(tstock, item.packQuantity);
              } else {
                // 如果接口返回了盘存数量，则直接用，没有为库存量
                tstock =
                  typeof item.takeStock === "number" ? item.takeStock : dstock;
                pcnum = blukToOutfit(tstock, item.packQuantity);
              }
              return {
                ...item,
                drugStock: dstock,
                takeStock: tstock,
                outfit: out,
                bluk: bl,
                pcOut: pcnum.out,
                pcBl: pcnum.bl
              };
            });
            this.tableData = deepClone(list);
            this.backTableData = deepClone(list);
            this.$nextTick(() => {
              this.$refs.singleTable && this.$refs.singleTable.doLayout();
            });
            this.isSure = false;
          } else {
            this.$message({
              type: "error",
              message: res.msg || "窗口确定失败"
            });
          }
          this.tl_isLoading = false;
        })
        .catch(err => {
          this.tl_isLoading = false;
          this.$message({
            type: "error",
            message: err || "窗口确定失败"
          });
        });
      stockApi
        .sumData()
        .then(res => {
          if (res.code === 1) {
            let flag;
            if (
              res.data &&
              res.data.recordStatus &&
              res.data.recordStatus === "1"
            ) {
              flag = true;
            } else {
              flag = false;
            }
            this.canSaveFlag = flag;
          }
        })
        .catch();
    },
    searchDrugList() {
      // 根据窗口，获取药品列表跟对应大类
      if (this.Lvalue === "") {
        this.$message({
          type: "warning",
          message: "请选择盘点窗口"
        });
        return;
      }
      this.handlerTips(this.getWindowDrug);
    },
    handlerTips(callback) {
      if (this.tableData.length > 0) {
        this.$confirmFunc({
          titleText: "提示",
          contentText: "此操作会改变药品列表数据!",
          confirm: (action, instance, done) => {
            callback();
            done();
          }
        });
      } else {
        callback();
      }
    },
    // 药品定位
    drugPosition() {
      if (!this.chooseItem.drugId) {
        this.$message.warning("请搜索并选择一个药品!");
        return;
      }
      if (this.chooseItem.drugName !== this.Dinput1) {
        this.Dinput1 = this.chooseItem.drugName;
      }
      this.drugTempIndex++;
      console.log(`this.drugTempIndex`, this.drugTempIndex);
      console.log(`this.drugArr.length`, this.drugArr.length);
      if (this.drugTempIndex === this.drugArr.length) {
        this.drugTempIndex = 0;
      }
      console.log(`this.drugArr`, this.drugArr);
      console.log(
        `this.drugArr[this.drugTempIndex]`,
        this.drugArr[this.drugTempIndex]
      );
      this.drugMark = this.drugArr[this.drugTempIndex].i;
      let drugIndex = this.drugArr[this.drugTempIndex].i;
      // let drugIndex = this.tableData.findIndex(
      //   item => item.drugId === this.chooseItem.drugId
      // );
      if (typeof drugIndex == -1) {
        this.$message.warning("无此药品!");
        return;
      }
      let drugItem = this.tableData.find(
        item =>
          item.drugName.indexOf(
            this.drugArr[this.drugTempIndex].item.drugName
          ) > -1
      );
      // let drugItem = this.tableData.find(
      //   item => item.drugId === this.chooseItem.drugId
      // );
      // 选择高亮定位药品
      console.log(drugItem);
      // this.drugArr[this.drugTempIndex].item &&
      //   this.$refs.singleTable.setCurrentRow(
      //     this.drugArr[this.drugTempIndex].item
      //   );

      // 滚动条滚动到定位药品位置
      let dom = document.getElementsByClassName("tableBody")[0];
      let scrollParent = dom.getElementsByClassName(
        "el-table--scrollable-y"
      )[0];
      if (scrollParent) {
        let scrollDom = scrollParent.getElementsByClassName(
          "el-table__body-wrapper"
        )[0];
        scrollDom && (scrollDom.scrollTop = 33 * drugIndex);
      }
    },
    // 表格选中
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    elsearch(drugName) {
      if (!this.Lvalue) {
        this.$message.error("请选择盘点窗口");
        return;
      }
      //搜索联想
      this.selectOptions = [];
      this.getDrugList(drugName);
    },
    getDrugList(params, id) {
      base
        .getTakeStockWindowDrug(this.Lvalue, params)
        .then(res => {
          if (res.code != 1) {
            this.$message.error(res.msg || "药品查询失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药品数据");
            return;
          }
          let list = res.data.map(drugWapper => {
            // 库存量转化
            const { out, bl } = blukToOutfit(
              drugWapper.drugStock,
              drugWapper.packQuantity
            );
            return {
              ...drugWapper,
              kcOut: out,
              kcBl: bl,
              drugStock: drugWapper.drugStock || 0,
              purchasePrice: drugWapper.purchasePrice || 0,
              price: drugWapper.price || 0
            };
          });
          this.selectOptions = list;
        })
        .catch(res => {
          this.$message.error(res.msg || "药品查询失败");
        });
    },
    select(row) {
      this.Dinput1 = row.drugName;
      this.chooseItem = row;
      this.drugArr = [];
      this.drugTempIndex = -1;
      this.drugMark = -1;
      this.tableData.forEach((item, i) => {
        if (item.drugName === row.drugName) {
          this.drugArr.push({
            i: i,
            item: item
          });
        }
      });
    },
    // 获取当前登录的药房
    getUserStorage() {
      base
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            this.storageCode = res.data.storageCode;
            this.getLocation(this.storageCode);
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch(err => {
          this.$message.error("获取当前库房失败");
        });
    },
    getLocation(code) {
      base
        .getSelectLocation(code)
        .then(res => {
          if (res.code === 1) {
            this.locationList = res.data;
          } else {
            this.$message.error("获取位置大类失败");
          }
        })
        .catch(err => {
          this.$message.error("获取位置大类失败");
        });
    },
    getdrugName(val) {
      this.Dinput1 = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.spec-btn {
  background: $l-color-bgcolor-11;
}
.vertical {
  vertical-align: top;
}
.filter-inner {
  margin: 16px;
}
.filter {
  overflow: hidden;
}
.leftDiv {
  font-size: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.tableBody {
  height: calc(100% - 130px);
  padding: 0 16px;
}
.vertical-custom {
  vertical-align: 12px;
}
.remarks {
  font-size: 14px;

  font-weight: 400;
  color: $l-color-fontcolor-4;
}
.vertical-middle {
  vertical-align: middle;
}

.bottom-button {
  width: 100%;
  padding: 16px;
}
.more-selected {
  /deep/ .el-select__tags {
    height: 33px;
    overflow: hidden;
    overflow-y: auto;
  }
}
.noWrap {
  white-space: nowrap;
  .el-input {
    width: 80px;
  }
}
</style>
