<template>
  <el-card class="height100 position-relative width100">
    <!-- 出库单详情 -->
    <div class="details height-button-main">
      <div class="css_outStockinfo">
        <el-row :gutter="6" class="infotext">
          <el-col :span="6">
            <span>出库单号：{{ outStockinfo_main.outInventoryNum }}</span>
          </el-col>
          <el-col :span="6" v-show="outStockinfo_main.outType !== '2'">
            <span>
              出库药房：{{
              codeToText(
              outStockinfo_main.storageCode || "--",
              drugStorageList
              )
              }}
            </span>
          </el-col>
          <el-col :span="6">
            <span>总进价金额：{{ formatNum(totalPrice) }}元</span>
            <!-- <span>总进价金额：{{totalPurchasePrice||outStockinfo_main.totalAmt|| '--'}}</span> -->
          </el-col>
        </el-row>
        <el-row :gutter="6">
          <el-col :span="6">
            <l-formt-title required :disabled="!!outStockinfo_main.status" label="出库类型" labelWidth="64">
              <el-select v-model="outStockinfo_main.outType" :disabled="!!outStockinfo_main.status" @change="changetype"
                placeholder="请选择">
                <el-option v-for="item in outTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col v-if="outStockinfo_main.outType !== '2'&&outStockinfo_main.outType !== '5'" :span="6">

            <l-formt-title required :disabled="!!outStockinfo_main.status" label="药房" labelWidth="54">
              <el-select :disabled="!!outStockinfo_main.status" v-model="outStockinfo_main.deptCode" @change="drugStorageChange"
                placeholder="请选择">
                <el-option v-for="item in dBstorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col v-if="outStockinfo_main.outType === '5'" :span="6">
            <l-formt-title required :disabled="!!outStockinfo_main.status" label="科室" labelWidth="54">
              <l-value-domain :value.sync="outStockinfo_main.deptId" :disabled="!!outStockinfo_main.status" remoteUrl="/wadmin/hos/dept"
                remoteShowKey="orgNm" remoteValueKey="id" placeholder="请选择" @change="deptIdChange"></l-value-domain>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row :gutter="6" class="infotext">
          <el-col :span="6">
            <span>录入人员：{{ outStockinfo_main.entryPersonName }}</span>
          </el-col>
          <el-col :span="6">
            <span>录入时间：{{ outStockinfo_main.entryTime }}</span>
          </el-col>
          <el-col :span="6" v-if="outStockinfo_main.status !== '0'">
            <span>提交人员：{{ outStockinfo_main.submitPersonName }}</span>
          </el-col>
          <el-col :span="6" v-if="outStockinfo_main.status !== '0'">
            <span>提交时间：{{ outStockinfo_main.submitPersonTime }}</span>
          </el-col>
        </el-row>
        <el-row class="table-btn" style="margin-top:0;">
          <el-col :span="12">
            <el-button type="text" :disabled="!isShadow" class="float-left cursor-pointer margin-right-10" @click="adddrug"
              v-if="
                outStockinfo_main.status !== '1' &&
                  outStockinfo_main.status !== '2' &&
                  outStockinfo_main.outType !== '1'
              "
              v-hotKey="{ func: 'func_add2' }">
              <i class="filter-item iconfont iconxinzeng"></i> 新增药品
            </el-button>
            <el-button type="text" :disabled="!isShadow" class="float-left cursor-pointer margin-right-10" @click="newlist"
              v-if="outStockinfo_main.outType == '1'">
              <i class="filter-item iconfont icontijiao"></i> 申请列表
            </el-button>
            <el-button type="text" :disabled="!isShadow" class="float-left cursor-pointer margin-right-10" @click="del"
              v-if="
                outStockinfo_main.status !== '1' &&
                  outStockinfo_main.status !== '2'
              "
              v-hotKey="{ func: 'func_delete' }">
              <i class="filter-item iconfont iconshanchu"></i>删除
            </el-button>
          </el-col>
        </el-row>

        <!-- 出库单table -->
        <el-row class="tablerow position-absolute" style="bottom: 80px;left: 20px;right: 20px;" :style="
            outStockinfo_main.status !== '1' && outStockinfo_main.status !== '2'
              ? 'top:160px'
              : 'top:130px'
          ">
          <l-tab-change :tableData="tableData" class="height100">
            <el-table ref="singleTable" height="100%" :data="tableData" border stripe style="width: 100%"
              highlight-current-row @current-change="handleCurrentChange" @selection-change="handleSelectionChange"
              @cell-dblclick="dblclick" v-loading="loading">
              <el-table-column v-if="
                  outStockinfo_main.status !== '1' &&
                    outStockinfo_main.status !== '2'
                "
                type="selection" width="40"></el-table-column>
              <el-table-column show-overflow-tooltip min-width="200" label="药品名称">
                <template slot-scope="{ row, $index }">
                  <span v-if="row.drugName">{{ row.drugName }}</span>
                  <drug-info-list v-else suffix-icon="el-icon-search" @send-data="getSearchData($event,$index)"
                    :storageCode="outStockinfo_main.storageCode"></drug-info-list>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="spec" label="规格" min-width="200"></el-table-column>
              <el-table-column show-overflow-tooltip label="进价(元)" width="100" align="right" prop="purchasePrice">
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="售价(元)" width="100" align="right" prop="price">
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.price) }}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="库发数" width="240" v-if="outStockinfo_main.outType !== '2'">
                <template slot-scope="scope">
                  <template v-if="!scope.row.isEditing">
                    <span>{{scope.row.outfit}}</span>
                    <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                    <template v-if="scope.row.bluk !== 0">
                      <span>{{scope.row.bluk}}</span>
                      <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                    </template>
                  </template>
                  <template v-else>
                    <div class="noWrap">
                      <el-input v-model="scope.row.outfit" @keyup.native="textValue($event,scope.$index,'outfit')"></el-input>
                      <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                      <template v-if="scope.row.unitSaleFlg === '1'">
                        <el-input v-model="scope.row.bluk" @keyup.native="textValue($event,scope.$index,'bluk')"></el-input>
                        <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                      </template>
                    </div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="库损数" width="240" v-else-if="outStockinfo_main.outType == '2'">
                <template slot-scope="scope">
                  <template v-if="!scope.row.isEditing">
                    <span>{{scope.row.outfit}}</span>
                    <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                    <template v-if="scope.row.bluk !== 0">
                      <span>{{scope.row.bluk}}</span>
                      <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                    </template>
                  </template>
                  <template v-else>
                    <div class="noWrap">
                      <el-input v-model="scope.row.outfit" placeholder @keyup.native="textValue($event,scope.$index,'outfit')"></el-input>
                      <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                      <template v-if="scope.row.unitSaleFlg === '1'">
                        <el-input v-model="scope.row.bluk" placeholder @keyup.native="textValue($event,scope.$index,'bluk')"></el-input>
                        <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                      </template>
                    </div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="库损原因" show-overflow-tooltip min-width="200" v-else-if="outStockinfo_main.outType == '2'">
                <template slot-scope="scope">
                  <span v-if="!scope.row.isEditing">
                    {{
                    scope.row.outReason
                    }}
                  </span>
                  <el-input v-else v-model="scope.row.outReason" placeholder></el-input>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="生产厂商" min-width="200">
                <template slot-scope="scope">
                  <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="批次" prop="inId" min-width="200"></el-table-column>
              <el-table-column show-overflow-tooltip label="生产批号" prop="batchNum" min-width="200"></el-table-column>
              <el-table-column show-overflow-tooltip label="进价总额(元)" align="right" width="140">
                <template slot-scope="scope">
                  <span>{{ formatNum(Math.round( scope.row.purchasePrice * 100 * scope.row.outQuantity / scope.row.packQuantity) / 100) }}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="售价总额(元)" align="right" width="140">
                <template slot-scope="scope">
                  <span>{{ formatNum(Math.round(scope.row.price * 100 * scope.row.outQuantity / scope.row.packQuantity) / 100) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </l-tab-change>
          <div v-if="!isShadow" @click="validateTips" class="position-absolute height100 width100 shadow"></div>
        </el-row>
      </div>
    </div>

    <div class="bottom-btn height-button-bottom">
      <el-button class="less-btn float-left" type="primary" plain @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
      <el-button class="less-btn float-left" type="primary" plain @click="exportExcel">导出</el-button>
      <el-button v-if="outStockinfo_main.status == '0'" class="less-btn float-right" type="primary" @click="submitData"
        v-hotKey="{ func: 'func_submit' }">提交</el-button>
      <el-button v-if="
          outStockinfo_main.status !== '1' && outStockinfo_main.status !== '2'
        " class="less-btn float-right"
        type="primary" plain @click="save" v-hotKey="{ func: 'func_save' }">保存</el-button>
    </div>

    <!-- 药品批次 弹窗 -->
    <l-dialog :visible.sync="drugVisible" :title="this.drugTitleName" width="950px" @confirm="conserve" @cancel="drugClose">
      <template #content>
        <el-form class="batch-list padding20" label-position="top" inline>
          <el-table ref="diagTable" :data="searchTable" border stripe v-loading="tableLoading" element-loading-text="列表正在加载中"
            width="100%" height="100%">
            <el-table-column show-overflow-tooltip prop="drugName" label="药品名称" min-width="140"></el-table-column>
            <el-table-column show-overflow-tooltip label="进价(元)" align="right" width="120" prop="purchasePrice">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="售价(元)" align="right" width="120" prop="price">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="库存量" prop="drugStock" width="120">
              <template slot-scope="{row}">
                <span>
                  {{ row.kcOut }}
                  <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                </span>
                <span v-if="row.kcBl !== 0">
                  {{ row.kcBl }}
                  <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="库发数" width="240">
              <template slot-scope="scope">
                <div class="noWrap">
                  <el-input v-model="scope.row.outfit" class="number-input" placeholder @keyup.native="textValueDia($event,scope.$index,'outfit')"></el-input>
                  <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  <template v-if="scope.row.unitSaleFlg === '1'">
                    <el-input v-model="scope.row.bluk" placeholder @keyup.native="textValueDia($event,scope.$index,'bluk')"></el-input>
                    <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="生产批号" prop="batchNum" min-width="120"></el-table-column>
            <el-table-column show-overflow-tooltip label="生产厂商" min-width="150">
              <template slot-scope="scope">
                <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
  import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
  import hmmBaseApi from "@/api/hmm/base";
  import stock from "@/api/hmm/stock";
  import {
    localCodeTransform
  } from "@/utils/util";
  import {
    deepClone
  } from "@/utils/index.js";
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
    mapActions
  } from "vuex";

  export default {
    components: {
      drugInfoList
    },
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
          // 采购单详情
          status: "",
          outInventoryNum: "", // 申请单号
          totalPurchasePrice: "", //总进价金额
          departmentcode: "", //部门
          outType: "", //出库类型
          deptCode: "", // 药房
          deptId: "", //科室
          entryPersonName: "", // 录入/提交人员
          entryTime: "", // 录入/提交时间
          submitPersonName: "", // 录入/提交人员
          submitTime: "", // 录入/提交时间
          isEditing: true // 是否为编辑状态
        },
        tableData: [], // 申请表格详情
        curTableIndex: "", //新增当前行
        //表格编辑输入药品名称联想药品table数据源
        selectOptions: [],
        // 下拉 table 配置表头
        dropColumn: [{
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
        loading: false,
        totalPrice: 0,
        mixinsCurrentDrugItem: {},
        // 库房调拨科室
        dBstorageList: []
      };
    },
    computed: {
      isShadow() {
        if (this.outStockinfo_main.outType === "3") {
          // 库房调拨，需要传deptCode跟deptName
          return (
            this.outStockinfo_main.outType !== "" &&
            this.outStockinfo_main.deptCode !== ""
          );
        } else if (this.outStockinfo_main.outType === "5") {
          // 科室消耗品出库，需要穿deptId跟deptName
          return (
            this.outStockinfo_main.outType !== "" &&
            this.outStockinfo_main.deptId !== ""
          );
        }
        return this.outStockinfo_main.outType !== "";
      }
    },
    watch: {
      outStockinfo: {
        handler(val) {
          if (val && val.id) {
            let data = {};
            if (val.deptId) {
              data.deptId = +val.deptId;
            }
            this.outStockinfo_main = {
              ...this.outStockinfo_main,
              ...val,
              ...data
            };
            this.getOutStockListD(val.id);
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
          this.totalPurchasePrice();
        }
      }
    },
    created() {
      this.getDBstorageList();
    },
    methods: {
      ...mapActions({
        changeCurDrug: "drugManagement/changeDrug",
        changeCurPre: "drugManagement/changePre"
      }),
      // 修改当前选中的药品信息
      handleCurrentChange(val = {}) {
        this.mixinsCurrentDrugItem = val;
        this.changeCurDrug({
          ...this.outStockinfo_main,
          ...val
        });
      },
      formatNum(num) {
        return formatNum(num);
      },
      totalPurchasePrice() {
        let amt = 0;
        this.tableData.forEach(item => {
          if (item.drugId) {
            amt =
              Math.round(
                amt * 100 +
                item.purchasePrice * 100 * item.outQuantity /
                item.packQuantity
              ) / 100;
          }
        });
        this.totalPrice = amt;
        return amt;
      },
      codeToText(code, list) {
        return localCodeTransform(code, list);
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
        this.loading = true;
        stock
          .getOutStockListDetail(id)
          .then(res => {
            if (res.code == 1) {
              let list = res.data.map(item => {
                let {
                  out,
                  bl
                } = blukToOutfit(
                  item.outQuantity,
                  item.packQuantity
                );
                return {
                  ...item,
                  outfit: out,
                  bluk: bl
                };
              });
              this.tableData = list;
              this.$refs.singleTable &&
                this.$refs.singleTable.setCurrentRow(list[0]);
            } else {
              this.$message.error(res.msg || "获取入库单明细数据失败");
            }
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.msg || "获取入库单明细数据失败");
          });
      },
      //切换出库方式
      changetype() {
        this.outStockinfo_main.deptId = "";
        this.outStockinfo_main.deptName = "";
        this.outStockinfo_main.deptCode = "";
        if (this.outStockinfo_main.outType == "1") {
          this.modelVisible = true;
        }
      },
      handleSelectionChange(list) {
        // 选中表格
        this.curSelectedTableList = list;
      },
      exportExcel() {
        let excelData = {
          title: ["出库单", "", "", "", ""],
          where: [
            "出库单:" + this.outStockinfo_main.outInventoryNum,
            "",
            "",
            "",
            ""
          ],
          tHeader: ["药品名称", "规格", "进价", "售价", "数量"],
          filterVal: [
            "drugName",
            "spec",
            "purchasePrice",
            "price",
            "outQuantity"
          ],
          listDate: this.tableData,
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
      submitData() {
        //过滤掉空白行
        this.tableData = this.tableData.filter(item => {
          return Boolean(item.drugId);
        });
        if (this.tableData.length === 0) {
          this.$message.error("出库单明细不可为空");
          return;
        }

        let saveData = {
          ...this.outStockinfo_main,
          applyId: this.applyId,
          totalAmt: this.totalPurchasePrice(),
          outInventoryDPOList: this.tableData || []
        };

        delete saveData.entryTime;
        delete saveData.entryPersonName;
        delete saveData.submitPersonName;
        delete saveData.submitPersonTime;

        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否提交当前出库单?",
          confirm: async (action, instance, done) => {
            this.$showLoading();
            try {
              let res = await stock.saveOutStockList(saveData);
              if (res.code === 1) {
                this.outStockinfo_main = res.data;
                this.tableData = res.data.outInventoryDPOList || [];
                let submitId = this.outStockinfo_main.id;
                let result = await stock.submitOutStockList(submitId);
                this.refreshList();
                if (result.code === 1) {
                  this.$message.success(result.msg || "提交成功!");
                } else {
                  this.$message.error(result.msg || "提交失败");
                }
                this.$emit("refresh-list");
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
          }
        });
      },
      // 保存
      save() {
        //过滤掉空白行
        this.tableData = this.tableData.filter(item => {
          return Boolean(item.drugId);
        });
        if (this.tableData.length === 0) {
          this.$message.error("出库单明细不可为空");
          return;
        }

        let saveData = {
          ...this.outStockinfo_main,
          applyId: this.applyId,
          totalAmt: this.totalPurchasePrice(),
          outInventoryDPOList: this.tableData || ""
        };

        delete saveData.entryTime;
        delete saveData.entryPersonName;
        delete saveData.submitPersonName;
        delete saveData.submitPersonTime;

        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否保存当前出库单?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            stock
              .saveOutStockList(saveData)
              .then(res => {
                done();
                this.$hideLoading();
                if (res.code === 1) {
                  this.outStockinfo_main = res.data;
                  this.tableData = res.data.outInventoryDPOList || [];
                  this.refreshList();
                  this.$emit("refresh-list");
                  this.$message.success(res.msg || "保存成功");
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
      del() {
        // 删除
        if (this.curSelectedTableList.length === 0) {
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
            this.$message.success("删除成功!");
            done();
          }
        });
      },
      newAdd() {
        // 新建入库
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
      //新增药品
      adddrug() {
        if (this.outStockinfo_main.status == "1") {
          this.$message.warning("当前单号已提交不可编辑");
          return;
        }
        if (this.outStockinfo_main.status != "1") {
          this.tableData.push({
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
          this.outStockinfo_main.isEditing = false;
        }
      },
      //获取联想搜索结果
      getDrugBatchList(params) {
        hmmBaseApi
          .getAssociationBatch(params)
          .then(res => {
            if (res.code != 1) {
              this.$message.error(res.msg || "药品批次查询失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药品批次数据");
              return;
            }
            let list = res.data.map(drugWapper => {
              let {
                out,
                bl
              } = blukToOutfit(
                drugWapper.drugStock,
                drugWapper.packQuantity
              );
              return {
                ...drugWapper,
                outQuantity: "",
                purchasePrice: drugWapper.purchasePrice || 0,
                price: drugWapper.price || 0,
                drugStock: drugWapper.drugStock || 0,
                kcOut: out,
                kcBl: bl,
                outfit: "",
                bluk: "",
                isEditing: true
              };
            });
            this.searchTable = list;
            this.searchTable.forEach((item, index) => {
              const ele = this.tableData.find(it => it.inId === item.inId);
              if (ele) {
                this.$set(this.searchTable, index, {
                  ...this.searchTable[index],
                  outfit: ele.outfit,
                  bluk: ele.bluk,
                  outQuantity: ele.outQuantity
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
            });
          })
          .catch(res => {
            this.$message.error(res.msg || "药品批次查询失败");
          });
      },
      //表格双击事件(如果存在历史记录，就显示前端缓存？)
      dblclick(row) {
        if (
          this.outStockinfo_main.status == "1" ||
          this.outStockinfo_main.status == "2"
        ) {
          this.$message.error("出库单已提交，不可修改");
          return;
        }
        this.tableData.find((item, index) => {
          if (item.inId === row.inId || item.drugId === row.drugId) {
            this.curTableIndex = index;
          }
        });
        if (!this.tableData[this.curTableIndex].inId) {
          return;
        }
        this.drugTitleName = row.drugName + row.spec;
        this.drugVisible = true;
        let searchParams = { ...this.pageParams
        };
        searchParams.drugId = row.drugId;
        this.searchTable = [];
        this.getDrugBatchList(searchParams);
      },
      drugClose() {
        this.drugVisible = false;
      },
      //按批次出库确认
      conserve() {
        this.selectedSearchTableList = [];
        this.searchTable.map(item => {
          if (item.outQuantity !== "") {
            this.selectedSearchTableList.push(item);
          }
        });
        if (this.selectedSearchTableList.length === 0) {
          this.$message.warning("至少输入一个库发数");
          return;
        }
        if (!this.tableData[this.curTableIndex].inId) {
          this.tableData.splice(this.curTableIndex, 1);
        }

        this.tableData = this.tableData.filter(item => {
          return Boolean(item.drugId);
        });

        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < this.selectedSearchTableList.length; j++) {
            if (this.tableData[i].inId == this.selectedSearchTableList[j].inId) {
              this.tableData.splice(i, 1);
              break;
            }
          }
        }
        this.tableData = this.tableData.concat(this.selectedSearchTableList);
        this.drugVisible = false;
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
      drugStorageChange(val) {
        let item = this.drugStorageList.find(item => item.code === val);
        this.$set(this.outStockinfo_main, "deptId", "");
        this.outStockinfo_main.deptName = item.name;
      },
      deptIdChange(item, curItem) {
        this.$set(this.outStockinfo_main, "deptCode", "");
        this.outStockinfo_main.deptName = curItem.orgNm;
      },
      textValue(e, index, key) {
        let item = this.tableData[index];
        this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
        if (!this.validateResult) {
          this.$message.warning("请输入0或正整数");
          e.target.value = "";
          this.$set(this.tableData[index], key, "");
        }
        let num = outfitToBluk(item.outfit, item.bluk, item.packQuantity);
        num = num ? num : "";
        this.$set(this.tableData[index], "outQuantity", num);
        this.totalPurchasePrice();
      },
      textValueDia(e, index, key) {
        let item = this.searchTable[index];
        this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
        if (!this.validateResult) {
          this.$message.warning("请输入0或正整数");
          e.target.value = "";
          this.$set(this.searchTable[index], key, "");
        }
        let num = outfitToBluk(item.outfit, item.bluk, item.packQuantity);
        num = num ? num : "";
        this.$set(this.searchTable[index], "outQuantity", num);
        this.totalPurchasePrice();
      },
      // 获取药品输入查询组件传过来的药品数据
      getSearchData(row, index) {
        this.curTableIndex = index;
        this.drugTitleName = row.drugName + row.spec;
        this.drugVisible = true; //打开药品批次列表弹框

        let searchParams = {
          ...this.pageParams,
          drugId: row.drugId
        };

        this.searchTable = [];

        this.getDrugBatchList(searchParams);
      },
      // 获取库房调拨的药房
      getDBstorageList() {
        hmmBaseApi
          .getDBstorageListApi({
            notCurrStorage: "1"
          })
          .then(res => {
            if (res.code === 1) {
              this.dBstorageList = res.data;
            } else {
              this.$message.error(res.msg || "获取库房调拨药房失败!");
            }
          })
          .catch(err => {
            this.$message.error(err.msg || "获取库房调拨药房失败!");
          });
      }
    },
    beforeDestroy() {
      // 销毁时清空数据
      this.changeCurDrug("");
      this.changeCurPre("");
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
      padding: 20px 0;
    }

    .title {
      text-align: center;
      font-weight: $l-font-weight;
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .css_outStockinfo {
      overflow: hidden;
      .el-row {
        margin-top: 10px;

        .disabled {
          background: $l-color-bgcolor-18;
        }
      }

      .infotext {
        line-height: 36px;
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

  .batch-list {
    height: 300px;
  }
</style>
