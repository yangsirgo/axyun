<template>
  <el-card class="height100 position-relative width100">
    <div class="height-button-main">
      <div class="apply-info">
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">
            <span class="label">申请单号：</span>
            {{ applyInfo_main.applyNum || "--" }}
          </el-col>
        </el-row>
        <el-row :gutter="6">
          <el-col :span="6">
            <!-- <span v-if="!applyInfo_main.isEditing" class="label">申请类型：{{applyInfo_main.applyType}}</span> -->
            <l-formt-title :disabled="!!applyInfo_main.status" required class="form-item" label="申请类型" labelWidth="64">
              <el-select v-model="applyInfo_main.applyType" :disabled="!!applyInfo_main.status" placeholder="请选择"
                @change="applyTypeChange">
                <el-option v-for="item in applyTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <!-- <span v-if="!applyInfo_main.isEditing" class="label">申请药库：{{applyInfo_main.storageCode}}</span> -->
            <l-formt-title class="form-item" required :disabled="
                hideStorage ||
                !applyInfo_main.applyType ||
                !!applyInfo_main.status
              "
              label="目标药库" labelWidth="64">
              <el-select v-model="applyInfo_main.storageCode" :disabled="
                  hideStorage ||
                  !applyInfo_main.applyType ||
                  !!applyInfo_main.status
                "
                placeholder="请选择" @change="storageCodeChange">
                <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="申请药房" :disabled="true">
              <el-select :disabled="true" v-model="pharmacyData" placeholder="请选择">
                <el-option v-for="item in drugStorageListS" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row :gutter="6">
          <el-col :span="6" class="item">
            <span class="label">录入人员：</span>
            {{ applyInfo_main.entryPersonName || "--" }}
          </el-col>
          <el-col :span="6" class="item">
            <span class="label">录入时间：</span>
            {{ applyInfo_main.entryTime || "--" }}
          </el-col>
          <el-col :span="6" class="item" v-if="applyInfo_main.status !== '0'">
            <span class="label">提交人员：</span>
            {{ applyInfo_main.submitPersonName || "--" }}
          </el-col>
          <el-col :span="6" class="item" v-if="applyInfo_main.status !== '0'">
            <span class="label">提交时间：</span>
            {{ applyInfo_main.submitPersonTime || "--" }}
          </el-col>
        </el-row>
      </div>

      <div class="table-btn" v-if="
          applyInfo_main.status !== '1' &&
          applyInfo_main.status !== '2' &&
          applyInfo_main.status !== '3'
        ">
        <el-button :disabled="!isShadow" type="text" class="float-left cursor-pointer margin-right-10" @click="addDrug"
          v-hotKey="{ func: 'func_add2' }">
          <i class="filter-item iconfont iconxinzeng"></i> 新增药品
        </el-button>
        <el-button type="text" :disabled="!isShadow" class="float-left cursor-pointer margin-right-10" @click="editBatch"
          v-if="applyInfo_main.applyType === '1'">
          <i class="filter-item iconfont iconbianjidangan"></i> 修改批次
        </el-button>
        <el-button :disabled="!isShadow" type="text" v-if="applyInfo_main.applyType == '0'" class="float-left cursor-pointer margin-right-10"
          @click="addDrugs">
          <i class="filter-item iconfont iconyiriqingdan"></i> 批量申请
        </el-button>
        <el-button :disabled="!isShadow" type="text" class="float-left cursor-pointer margin-right-10" @click="del"
          v-hotKey="{ func: 'func_delete' }">
          <i class="filter-item iconfont iconshanchu"></i>删除
        </el-button>
      </div>

      <div class="position-absolute" style="bottom: 80px; left: 20px; right: 20px" :style="
          applyInfo_main.status !== '1' &&
          applyInfo_main.status !== '2' &&
          applyInfo_main.status !== '3'
            ? 'top:140px'
            : 'top:110px'
        ">
        <l-tab-change class="height100" :tableData="tableData" @cb="tablast">
          <el-table :data="tableData" border stripe v-if="applyInfo_main.applyType == '0'" v-loading="tableLoading"
            height="100%" ref="singleTable" highlight-current-row @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange" style="width: 100%" key="table1">
            <el-table-column v-if="
                applyInfo_main.status !== '1' &&
                applyInfo_main.status !== '2' &&
                applyInfo_main.status !== '3'
              "
              key="checkbox1" type="selection" width="40"></el-table-column>
            <el-table-column width="200" label="药品名称" show-overflow-tooltip>
              <template slot-scope="{ row, $index }">
                <span v-if="row.drugName">{{ row.drugName }}</span>
                <drug-info-list v-else suffix-icon="el-icon-search" @send-data="getSearchData($event, $index)"
                  :storageCode="applyInfo_main.storageCode"></drug-info-list>
              </template>
            </el-table-column>
            <el-table-column prop="spec" show-overflow-tooltip width="200" label="规格"></el-table-column>
            <el-table-column prop="drugStock" show-overflow-tooltip label="库存数" width="140">
              <template slot-scope="scope">
                <span>{{ scope.row.outfit }}</span>
                <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                <template v-if="scope.row.bluk !== 0">
                  {{ scope.row.bluk }}
                  <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" align="right" show-overflow-tooltip width="130" label="参考进价(元)">
              <template slot-scope="scope">
                <span>{{ scope.row.purchasePrice }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" align="right" show-overflow-tooltip width="130" label="参考售价(元)">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="申领数" width="150">
              <template slot-scope="{ row, $index }">
                <template v-if="
                    applyInfo_main.status == '1' ||
                    applyInfo_main.status == '2' ||
                    applyInfo_main.status == '3'
                  ">
                  <span>{{ row.apOut }}</span>
                  <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                </template>
                <template v-else>
                  <div class="noWrap">
                    <el-input @keyup.native="textValue($event, $index)" v-model="row.apOut" placeholder></el-input>
                    <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column min-width="150" show-overflow-tooltip label="备注">
              <template slot-scope="{ row }">
                <span v-if="
                    applyInfo_main.status == '1' ||
                    applyInfo_main.status == '2' ||
                    applyInfo_main.status == '3'
                  ">{{ row.recordRemark }}</span>
                <el-input v-else v-model="row.recordRemark" maxlength="200" show-word-limit placeholder></el-input>
              </template>
            </el-table-column>
          </el-table>

          <el-table :data="tableData" border stripe v-else v-loading="tableLoading" height="100%" ref="singleTable"
            highlight-current-row @current-change="handleCurrentChange" @selection-change="handleSelectionChange" style="width: 100%"
            @cell-dblclick="dblclick" key="table2">
            <el-table-column v-if="
                applyInfo_main.status !== '1' &&
                applyInfo_main.status !== '2' &&
                applyInfo_main.status !== '3'
              "
              :key="Math.random()" type="selection" width="40"></el-table-column>
            <el-table-column width="200" label="药品名称" show-overflow-tooltip>
              <template slot-scope="{ row, $index }">
                <span v-if="row.drugName">{{ row.drugName }}</span>
                <drug-info-list v-else suffix-icon="el-icon-search" @send-data="getSearchData2($event, $index)"
                  :storageCode="pharmacyData"></drug-info-list>
              </template>
            </el-table-column>
            <el-table-column prop="spec" show-overflow-tooltip label="规格"></el-table-column>
            <el-table-column prop="drugStock" show-overflow-tooltip label="库存数" width="140">
              <template slot-scope="scope">
                <span>{{ scope.row.outfit }}</span>
                <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                <template v-if="scope.row.bluk !== 0">
                  {{ scope.row.bluk }}
                  <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" show-overflow-tooltip label="参考进价"></el-table-column>
            <el-table-column prop="price" show-overflow-tooltip label="参考售价"></el-table-column>
            <el-table-column label="退还数量" width="140">
              <template slot-scope="{ row, $index }">
                <template v-if="
                    applyInfo_main.status == '1' ||
                    applyInfo_main.status == '2' ||
                    applyInfo_main.status == '3'
                  ">
                  <span>{{ row.apOut }}</span>
                  <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                </template>
                <template v-else>
                  <div class="noWrap">
                    <el-input @keyup.native="textValue($event, $index)" v-model="row.apOut" placeholder></el-input>
                    <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="150" label="备注">
              <template slot-scope="{ row }">
                <span v-if="
                    applyInfo_main.status == '1' ||
                    applyInfo_main.status == '2' ||
                    applyInfo_main.status == '3'
                  ">{{ row.recordRemark }}</span>
                <el-input v-else v-model="row.recordRemark" maxlength="200" show-word-limit placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="供应商" show-overflow-tooltip>
              <template slot-scope="scope">
                <span :val="scope.row.supplierCode" code="DrugSupplier" v-codeTransform></span>
              </template>
            </el-table-column>
            <el-table-column prop="inId" label="生产批次" show-overflow-tooltip width="200"></el-table-column>
          </el-table>
        </l-tab-change>
        <div v-if="!isShadow" @click="validateTips" class="position-absolute height100 width100 shadow"></div>
      </div>
    </div>

    <div class="bottom-btn height-button-bottom">
      <el-button :disabled="!tableData.length" class="less-btn float-left" type="primary" plain @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
      <el-button class="less-btn float-left" type="primary" plain :disabled="!tableData.length" @click="exportExcel">导出</el-button>
      <el-button v-if="applyInfo_main.status == '0'" class="less-btn float-right" type="primary" @click="submitData"
        v-hotKey="{ func: 'func_submit' }">提交</el-button>
      <el-button v-if="
          applyInfo_main.status !== '1' &&
          applyInfo_main.status !== '2' &&
          applyInfo_main.status !== '3'
        "
        class="less-btn float-right" type="primary" plain @click="save" v-hotKey="{ func: 'func_save' }">保存</el-button>
    </div>
    <!-- 药品批次 弹窗 -->
    <l-dialog :visible.sync="drugVisible" :title="this.drugTitleName" width="950px" @confirm="conserve" @cancel="drugClose">
      <template #content>
        <el-form class="drug-batch-form padding20" label-position="top" inline>
          <el-table ref="diagTable" :data="searchTable" border stripe v-loading="tableLoading" element-loading-text="列表正在加载中"
            width="100%" height="100%">
            <el-table-column show-overflow-tooltip prop="drugName" label="药品名称" width="140"></el-table-column>
            <el-table-column show-overflow-tooltip label="进价" prop="purchasePrice">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="售价" prop="price">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="库存量" prop="drugStock">
              <template slot-scope="scope">
                <span>{{ scope.row.outfit }}</span>
                <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                <template v-if="scope.row.bluk !== 0">
                  {{ scope.row.bluk }}
                  <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="退还数量" width="140">
              <template slot-scope="scope">
                <div class="noWrap">
                  <el-input class="number-input" @keyup.native="textValueDia($event, scope.$index)" v-model="scope.row.apOut"></el-input>
                  <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="生产批次" prop="inId" width="120"></el-table-column>
            <el-table-column show-overflow-tooltip label="生产厂商" width="150">
              <template slot-scope="scope">
                <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </l-dialog>
    <!--批量申请弹框-->
    <l-dialog title="批量申请" :visible.sync="addsDialogVisible" width="800px" @confirm="batchAddDrugs" @cancel="addsDialogVisible = false">
      <template #content>
        <div class="batch-add">
          <el-radio v-model="dialog.type" label="max">未达到高储数量的药品进行申请[申请数量=高储数量-当前库存]</el-radio>
          <el-radio v-model="dialog.type" label="avg" style="margin-top: 10px">
            申请数量=
            <el-input v-model="dialog.pastDays" style="width: 45px" placeholder></el-input>天当前的药房平均使用量X
            <el-input v-model="dialog.days" style="width: 45px" placeholder></el-input>天[拟申请天数]-当前药房库存量
          </el-radio>
        </div>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
  import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
  import stock from "@/api/hmm/stock";
  import hmmBaseApi from "@/api/hmm/base";
  import mixin from "@/mixins/drugManagement.js";
  import {
    print,
    preview,
    onPreview
  } from "@/utils/print";
  import {
    jsonToExcel
  } from "@/utils/excel/excel";
  import {
    blukToOutfit,
    outfitToBluk
  } from "@/utils/drugManagement.js";
  import formatNum from "@/utils/formatPrice.js";
  import {
    refToArr
  } from "@/utils/util.js";

  export default {
    mixins: [mixin],
    props: {
      applyInfo: {
        type: Object,
      },
      recordStatusList: {
        type: Array,
      },
      applyTypeList: {
        type: Array,
      },
    },
    components: {
      drugInfoList,
    },
    data() {
      return {
        tableLoading: false,
        addsDialogVisible: false, // 批量新增
        dialog: {
          type: "",
          pastDays: 0,
          days: 0,
        }, // 批量新增
        maxHeight: "", // table 最大高度
        newstatus: "",
        selectDrop: {
          // 输入药品名称显示的下拉table
          dropColumn: [{
              prop: "drugName",
              label: "药品名称",
              width: 150,
            },
            {
              prop: "spec",
              label: "规格",
              width: 150,
            },
          ],
          selectOptions: [],
        },
        selectlist: [], //药品快速选择
        applyInfo_main: {
          // 申请单头部详情
          id: "",
          status: "",
          applyNum: "", // 单号
          storageCode: "", // 药库
          applyType: "", //申请类型
          entryPersonName: "", // 录入人员
          entryTime: "", // 录入时间
          submitPersonName: "", //提交人员
          submitPersonTime: "", //提交时间
          isEditing: true, // 是否为编辑状态
        },
        tableData: [], // 申请表格详情
        curSelectEdTabList: [], // 当前已经选中的item
        //是否修改过table
        newTable: [],
        //提交table
        applyDPOList: [],
        drugVisible: false,
        drugTitleName: "",
        // 联想搜索数据源
        curTableIndex: "", //新增当前行
        searchTable: [],
        selectedSearchTableList: [], //弹窗选中的table 列
        curSelectedTableList: [], // 当前已经选中的item
        applyId: "", //申请单Id
        curPharmacy: "",
        drugStorageList: [],
        drugStorageListS: [],
        allDrugStorage: {
          0: [],
          1: [],
        },
        hideStorage: false,
      };
    },
    computed: {
      isShadow() {
        return (
          this.applyInfo_main.storageCode !== "" &&
          this.applyInfo_main.applyType !== ""
        );
      },
      pharmacyData() {
        return this.applyInfo_main.applyNum ?
          this.applyInfo_main.deptCode :
          this.curPharmacy;
      },
    },
    created() {
      this.getStorageListForApply("0");
      this.getStorageListForApply("1");
      this.drugStorageListFunc();
      this.getPharmacy();
    },
    watch: {
      applyInfo: {
        handler(val) {
          if (val && val.id) {
            this.applyInfo_main = { ...val
            };
            this.getApplyD(val.id, val.applyType);
            this.applyTypeChange(val.applyType);
          } else {
            this.applyInfo_main = this.$options.data().applyInfo_main;
            this.tableData = [];
            this.handleCurrentChange({});
          }
        },
        deep: true,
      },
    },
    methods: {
      formatNum(num) {
        return formatNum(num);
      },
      validateTips() {
        this.$message({
          message: "申请药库和申请类型不可为空",
          type: "warning",
        });
      },
      refreshList() {
        this.fullReset();
        this.$emit("search");
      },
      //查询明细
      getApplyD(applyId, applyType) {
        this.tableLoading = true;
        stock
          .getApplyDetailList(applyId, applyType)
          .then((res) => {
            this.tableLoading = false;
            if (res.code == 1) {
              let list = res.data.map((item) => {
                // 库存数
                let {
                  out,
                  bl
                } = blukToOutfit(item.drugStock, item.packQuantity);
                // 申领数or退还数
                let apOut = blukToOutfit(item.applyQuantity, item.packQuantity)
                  .out;
                return {
                  ...item,
                  outfit: out,
                  bluk: bl,
                  apOut: apOut,
                };
              });
              this.tableData = list;
              this.$nextTick(() => {
                this.$refs.singleTable &&
                  this.$refs.singleTable.setCurrentRow(list[0]);
              });
            } else {
              this.$message.error(res.msg || "获取申请单明细数据失败");
            }
          })
          .catch((res) => {
            this.tableLoading = false;
            this.$message.error(res.msg || "获取申请单明细数据失败");
          });
      },
      //获取联想搜索结果
      getDrugList(params) {
        hmmBaseApi
          .getAssociation(params)
          .then((res) => {
            if (res.code != 1) {
              this.$message.error(res.msg || "药品查询失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药品数据");
              return;
            }
            let list = res.data.map((drugWapper) => ({
              ...drugWapper,
              price: drugWapper.price || 0,
              applyQuantity: "",
              drugStock: typeof drugWapper.drugStock === "number" ?
                drugWapper.drugStock :
                0,
              isEditing: true,
            }));
            this.selectDrop.selectOptions = list;
          })
          .catch((res) => {
            this.$message.error(res.msg || "药品查询失败");
          });
      },
      //获取联想搜索结果
      getDrugBatchList(params) {
        hmmBaseApi
          .getAssociationBatch(params)
          .then((res) => {
            if (res.code != 1) {
              this.$message.error(res.msg || "药品批次查询失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药品批次数据");
              return;
            }
            let list = res.data.map((drugWapper) => {
              let {
                out,
                bl
              } = blukToOutfit(
                drugWapper.drugStock,
                drugWapper.packQuantity
              );
              return {
                ...drugWapper,
                outfit: out,
                bluk: bl,
                apOut: "",
                purchasePrice: drugWapper.purchasePrice || 0,
                applyQuantity: "",
                price: drugWapper.price || 0,
                drugStock: drugWapper.drugStock || 0,
                status: "",
                isEditing: true,
              };
            });
            this.searchTable = list;
            this.searchTable.forEach((item, index) => {
              const ele = this.tableData.find((it) => it.inId === item.inId);
              if (ele) {
                this.$set(this.searchTable, index, {
                  ...this.searchTable[index],
                  apOut: ele.apOut,
                  applyQuantity: ele.applyQuantity,
                });
              }
            });
            const curItemIndex = this.searchTable.findIndex(
              (item) =>
              this.tableData[this.curTableIndex].inId &&
              item.inId === this.tableData[this.curTableIndex].inId
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
          })
          .catch((res) => {
            this.$message.error(res.msg || "药品批次查询失败");
          });
      },
      drugClose() {
        this.drugVisible = false;
      },
      conserve() {
        this.selectedSearchTableList = [];
        this.searchTable.forEach((item) => {
          if (item.applyQuantity !== "") {
            this.selectedSearchTableList.push(item);
          }
        });

        if (this.selectedSearchTableList.length == 0) {
          this.$message.warning("请输入退还数量");
          return;
        }
        let idx = this.searchTable.findIndex((item) => {
          return item.applyQuantity > item.drugStock;
        });
        if (idx > -1) {
          this.$message.warning("退还数量不能大于库存量");
          return;
        }

        this.tableData = this.tableData.filter((item) => {
          return Boolean(item.drugId);
        });

        for (let i = 0; i < this.selectedSearchTableList.length; i++) {
          if (this.tableData.length > 0) {
            const len = this.tableData.length - 1;
            for (let j = len; j > -1; j--) {
              if (
                this.selectedSearchTableList[i].inId == this.tableData[j].inId
              ) {
                this.tableData.splice(j, 1);
              }
            }
          }
        }
        this.tableData = this.tableData.concat(this.selectedSearchTableList);
        this.drugVisible = false;
      },
      handleSelectionChange(list) {
        // 选中表格
        this.curSelectEdTabList = list;
      },
      exportExcel() {
        let excelData = {
          title: ["申请单", "", "", "", ""],
          where: ["申请单号:" + this.applyInfo_main.applyNum, "", "", "", ""],
          tHeader: ["药品名称", "规格", "进价", "售价", "数量"],
          filterVal: [
            "drugName",
            "spec",
            "purchasePrice",
            "price",
            "applyQuantity",
          ],
          listDate: this.tableData,
          fileName: "申请单",
          merges: ["A1:E1"],
        };
        jsonToExcel(excelData);
      },
      print() {
        let data = {};
        data.title = "申请单";
        data.num = this.applyInfo_main.applyNum;
        let tableArr = refToArr(this.$refs.singleTable);
        let detailList = this.tableData.map((data, index) => {
          return {
            ...data,
            qty: tableArr[index][5],
          };
        });
        data.detailList = detailList;
        onPreview(data, "药库药房单据");
      },
      // 提交
      submitData() {
        this.tableData = this.tableData.filter((item) => {
          return item.drugId;
        });
        if (this.tableData.length == 0) {
          this.$message.error("申请单明细不可为空");
          return;
        }
        let isChekc = this.checkSumNum();
        if (isChekc) {
          return;
        }
        let saveData = {
          ...this.applyInfo_main,
          applyDPOList: this.tableData || [],
        };

        delete saveData.entryTime;
        delete saveData.entryPersonName;
        delete saveData.submitPersonName;
        delete saveData.submitPersonTime;

        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否提交当前申请单?",
          confirm: async (action, instance, done) => {
            try {
              this.$showLoading();
              let res = await stock.addApply(saveData);
              if (res.code === 1) {
                this.applyInfo_main = res.data;
                this.tableData = res.data.applyDPOList || [];
                let id = this.applyInfo_main.id;

                let result = await stock.submitApply(id);
                this.refreshList();
                if (result.code === 1) {
                  this.$message.success(result.msg || "申请单提交成功!");
                } else {
                  this.$message.error(result.msg || "申请单提交失败");
                }
              } else {
                this.$message.error(res.msg || "申请单提交失败");
              }
              done();
              this.$hideLoading();
            } catch (e) {
              done();
              this.$hideLoading();
              this.$message.error(e.msg || "申请单提交失败");
            }
          },
        });
      },
      textValue(e, index) {
        this.validateResult = new RegExp("^[1-9][0-9]*$").test(e.target.value);
        if (!this.validateResult) {
          this.$message.warning("请输入正整数");
          e.target.value = "";
          this.$set(this.tableData[index], "applyQuantity", "");
        } else {
          let item = this.tableData[index];
          if (typeof index !== "undefined") {
            let bluk = outfitToBluk(e.target.value, 0, item.packQuantity);
            this.$set(this.tableData[index], "applyQuantity", bluk);
          }
        }
      },
      textValueDia(e, index) {
        this.validateResult = new RegExp("^[1-9][0-9]*$").test(e.target.value);
        if (!this.validateResult) {
          this.$message.warning("请输入正整数");
          e.target.value = "";
        }
        let item = this.searchTable[index];
        if (typeof index !== "undefined") {
          let bluk = outfitToBluk(e.target.value, 0, item.packQuantity);
          this.$set(this.searchTable[index], "applyQuantity", bluk);
        }
      },
      save() {
        //过滤调空白行
        this.tableData = this.tableData.filter((item) => {
          return item.drugId;
        });
        if (this.tableData.length == 0) {
          this.$message.error("申请单明细不可为空");
          return;
        }
        let isZero = this.tableData.find(
          (item) => item.applyQuantity !== undefined && item.applyQuantity == 0
        );
        if (isZero) {
          this.$message.warning("申领数量不能为空或者为0");
          return;
        }
        let isChekc = this.checkSumNum();
        if (isChekc) {
          return;
        }

        let saveData = {
          ...this.applyInfo_main,
          applyDPOList: this.tableData || [],
        };

        delete saveData.entryTime;
        delete saveData.entryPersonName;
        delete saveData.submitPersonName;
        delete saveData.submitPersonTime;

        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否保存当前申请单?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            stock
              .addApply(saveData)
              .then((res) => {
                done();
                this.$hideLoading();
                if (res.code === 1) {
                  this.applyInfo_main = res.data;
                  this.tableData = res.data.applyDPOList || [];
                  this.refreshList();
                  this.$message.success(res.msg || "保存成功!");
                } else {
                  this.$message.error(res.msg || "保存失败");
                }
              })
              .catch((res) => {
                done();
                this.$hideLoading();
                this.$message.error(res.msg || "保存失败");
              });
          },
        });
      },
      checkSumNum() {
        if (this.applyInfo_main.applyType !== "0") {
          let idx = this.tableData.findIndex(
            (item) => item.applyQuantity > item.drugStock
          );
          if (idx > -1) {
            this.$message.warning("退还数量不能大于库存数");
            this.$refs.singleTable.setCurrentRow(this.tableData[idx]);
            return true;
          }
        }
        return false;
      },
      //删除明细
      del() {
        if (this.curSelectEdTabList.length > 0) {
          this.$confirmFunc({
            titleText: "提示",
            contentText: "是否删除当前选中的申请单明细?",
            confirm: (action, instance, done) => {
              let add = this.tableData.filter(
                (item) =>
                !this.curSelectEdTabList.some((ele) => {
                  if (ele.inId) {
                    return ele.inId === item.inId && ele.drugId === item.drugId;
                  }
                  return ele.drugId === item.drugId;
                })
              );
              this.tableData = add;
              done();
              this.$message.success("删除成功");
            },
          });
        } else {
          this.$message.warning("请选择一条或者多条数据");
        }
      },
      //批量新增弹窗
      addDrugs() {
        // 批量新增
        this.addsDialogVisible = true;
      },
      //批量新增确定
      batchAddDrugs() {
        let params = {};
        if (this.dialog.type === "max") {
          params.type = "max";
        } else {
          params = { ...this.dialog
          };
        }
        stock
          .batchApplyList(params)
          .then((res) => {
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
            res.data.forEach((drugWapper) => {
              // 库存数
              let {
                out,
                bl
              } = blukToOutfit(
                drugWapper.drugStock,
                drugWapper.packQuantity
              );
              // 申领数or退还数
              let apOut = blukToOutfit(drugWapper.qty, drugWapper.packQuantity)
                .out;
              let itemData = {
                ...drugWapper,
                drugStock: drugWapper.drugStock || 0,
                applyQuantity: drugWapper.qty,
                outfit: out,
                bluk: bl,
                apOut: apOut,
                isEditing: false,
              };
              let flag = true;
              if (this.tableData.length == 0) {
                this.tableData.push(itemData);
              } else {
                this.tableData.map((item, index) => {
                  if (item.drugId === drugWapper.drugId) {
                    this.tableData[index] = { ...itemData
                    };
                    flag = false;
                  }
                });
                if (flag) {
                  this.tableData.push(itemData);
                }
              }
            });
          })
          .catch((res) => {
            this.$message.error(res.msg || "批量新增失败");
          });
        this.addsDialogVisible = false;
      },
      filterTableDataEmpty() {
        this.tableData = this.tableData.filter((item) => {
          return item.drugId;
        });
      }, //过滤调空白行
      // 新增药品
      addDrug() {
        this.filterTableDataEmpty();
        this.tableData.push({
          drugId: "", // 药品ID
          drugName: "", // 药品名称
          spec: "", // 规格
          supplierCode: "",
          outfit: "",
          bluk: "",
          inId: "", //,
          packUnit: "", // 包装单位
          drugUnit: "", // 剂型单位
          purchasePrice: "", // 参考进价
          price: "", // 参考售价
          applyQuantity: "", //申领数
          drugStock: "", // 库存
          recordRemark: "", // 备注
          isEditing: true, // 是否为编辑状态
        });
      },
      // 新建申请单
      newAdd() {
        this.fullReset();
      },
      //快捷键
      tablast() {
        this.tableData.map((item) => {
          item.isEditing = false;
        });
        // 键盘Tab 到最后一个 触发回调事件
        this.tableData.push({
          drugId: "", // 药品ID
          drugName: "", // 药品名称
          spec: "", // 规格
          supplierCode: "",
          outfit: "",
          bluk: "",
          inId: "",
          packUnit: "", // 包装单位
          drugUnit: "", // 剂型单位
          purchasePrice: "", // 参考进价
          price: "", // 参考售价
          applyQuantity: "", //申领数
          drugStock: "", // 库存
          recordRemark: "", // 备注
          isEditing: true,
        });
        // this.applyInfo_main.isEditing = false;
      },
      // 重置采购明细单
      fullReset() {
        this.applyInfo_main = this.$options.data().applyInfo_main;
        this.tableData = this.$options.data().tableData;
      },
      // 获取当前药房
      getPharmacy() {
        stock
          .isOpenDialog()
          .then((res) => {
            if (res.code === 1) {
              this.curPharmacy = res.data.storageCode;
            }
          })
          .catch();
      },
      //获取药库数据
      drugStorageListFunc() {
        hmmBaseApi
          .getDrugStorage("0,1")
          .then((res) => {
            if (res.code == 1) {
              this.drugStorageListS = res.data;
            } else {
              this.$message.error(res.msg || "获取药库数据失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药库数据");
            }
          })
          .catch((res) => {
            this.$message.error(res.msg || "获取药库数据失败");
          });
      },
      getStorageListForApply(params) {
        if (params === "") {
          return;
        }
        this.hideStorage = true;
        hmmBaseApi
          .getDropDown(params)
          .then((res) => {
            if (res.code == 1) {
              this.allDrugStorage[params] = res.data || [];
              if (this.applyInfo_main && this.applyInfo_main.applyType) {
                this.drugStorageList = this.allDrugStorage[
                  this.applyInfo_main.applyType
                ];
              }
            } else {
              this.$message.error(res.msg || "获取药库数据失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药库数据");
            }
            this.hideStorage = false;
          })
          .catch((res) => {
            this.hideStorage = false;
            this.$message.error(res.msg || "获取药库数据失败");
          });
      },
      applyTypeChange(val) {
        this.tableData = [];
        this.drugStorageList = this.allDrugStorage[val];
      },
      storageCodeChange() {
        this.tableData = [];
      },
      // 获取药品输入查询组件传过来的药品数据
      getSearchData(row, index) {
        this.curTableIndex = index;
        let idx = this.tableData.findIndex((item) => {
          return Boolean(item.drugId) && item.drugId === row.drugId;
        });
        if (idx > -1) {
          this.$message.warning("已有相同药品");
          this.$refs.singleTable.setCurrentRow(this.tableData[idx]);
          return;
        }
        let {
          out,
          bl
        } = blukToOutfit(row.drugStock, row.packQuantity);
        let newData = {
          ...row,
          outfit: out,
          bluk: bl,
        };
        this.$set(this.tableData, this.curTableIndex, newData);
      },
      getSearchData2(row, index) {
        this.curTableIndex = index;
        this.drugTitleName = row.drugName + row.spec;
        this.drugVisible = true; //打开药品批次列表弹框

        let searchParams = {
          ...this.pageParams,
          drugId: row.drugId,
          storageCode: this.pharmacyData,
        };
        this.searchTable = [];

        this.getDrugBatchList(searchParams);
      },
      dblclick(row) {
        this.curTableIndex = this.tableData.findIndex(
          (item, index) => item.inId === row.inId && item.drugId === row.drugId
        );
        if (this.curTableIndex === -1) {
          return;
        }
        if (!row.drugId) {
          return;
        }
        if (this.applyInfo_main.status !== "0") {
          return;
        }
        this.drugTitleName = row.drugName + row.spec;
        this.drugVisible = true;
        let searchParams = {};
        searchParams = {
          ...this.pageParams,
          drugId: row.drugId,
          // storageCode: this.applyInfo_main.storageCode
          storageCode: this.pharmacyData,
        };
        this.searchTable = [];
        this.getDrugBatchList(searchParams);
      },
      editBatch() {
        if (this.mixinsCurrentDrugItem) {
          this.dblclick(this.mixinsCurrentDrugItem);
        } else {
          this.$message.warning("请先保存!");
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cancel-btn {
    border-radius: 2px;
    border-color: $l-color-primary;
    color: $l-color-primary;
  }

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
      padding: 10px 0;
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
      overflow: hidden;

      .label {
        color: $l-color-fontcolor-4;
      }

      &>div {
        margin-top: 10px;
        overflow: hidden;

        .item {
          min-width: 135px;
          float: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .disabled {
          background: $l-color-bgcolor-18;
        }

        .form-item {
          margin-right: 6px;
        }

        .form-item:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .noWrap {
    white-space: nowrap;

    .el-input {
      width: 80px;
    }
  }

  .table-btn {
    .el-button {
      padding: 0;
      color: $l-color-black;
      font-weight: normal;
    }
  }

  .batch-add {
    padding: 45px 50px;
  }

  .drug-batch-form {
    height: 300px;
  }
</style>
