<template>
  <!-- 物资出库 -->
  <el-card
    class="height100 warelcard position-relative width100"
    style="padding:16px;"
  >
    <!-- 出库单详情 -->
    <div class="details">
      <div class="css_wareinfo">
        <el-row :gutter="6" style="margin-bottom: 8px;">
          <el-col :span="6">
            <l-formt-title
              required
              :disabled="!!wareinfo_main.status"
              label="出库类型"
              labelWidth="64"
            >
              <el-select
                :disabled="!!wareinfo_main.status"
                v-model="wareinfo_main.outboundType"
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
          <el-col :span="6">
            <l-formt-title
              :required="wareinfo_main.outboundType == '21'"
              :disabled="!!wareinfo_main.status"
              label="领用科室"
              labelWidth="64"
            >
              <el-select
                :required="wareinfo_main.outboundType == '21'"
                :disabled="!!wareinfo_main.status"
                v-model="wareinfo_main.deptId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.orgNm"
                  :value="item.id"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title
              :disabled="!!wareinfo_main.status"
              label="领用人"
              labelWidth="64"
            >
              <el-select v-model="wareinfo_main.receiver"  :disabled="!!wareinfo_main.status" filterable placeholder="请选择">
                <el-option
                  v-for="item in receiverList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title
              :disabled="!!wareinfo_main.status"
              label="备注"
              labelWidth="62"
            >
              <el-input
                :disabled="!!wareinfo_main.status"
                v-model="wareinfo_main.recordRemark"
                style="line-height: 34px"
              ></el-input>
            </l-formt-title>
          </el-col>
          <!-- <el-col :span="8">
            <l-formt-title required :disabled="!!wareinfo_main.status" label="供应商" labelWidth="54">
              <Supplier :disabled="!!wareinfo_main.status" :value.sync="wareinfo_main.supplierCode" @change="clearTable" />
            </l-formt-title>
          </el-col>-->
        </el-row>
        <el-row
          :gutter="6"
          class="infotext main-info"
          style="margin-bottom: 8px;"
        >
          <el-col :span="6">
            <span>出库单号：{{ wareinfo_main.outboundNum || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>状态：</span>
            {{
              typeof statusShow[wareinfo_main.status] !== "undefined"
                ? statusShow[wareinfo_main.status]
                : "--"
            }}
          </el-col>
          <el-col :span="6">
            <span>出库库房：</span>
            <span
              columns="STORAGE_NAME"
              tableName="hrp_drgstrg"
              v-tableTransform
            ></span>
          </el-col>

        </el-row>
        <el-row
          :gutter="6"
          class="infotext main-info"
          style="margin-bottom: 8px;"
        >
          <el-col :span="6">
            <span>录入人：{{ wareinfo_main.entryPersonName || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>录入时间：{{ wareinfo_main.entryTime || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>提交人：{{ wareinfo_main.submitPersonName || "--" }}</span>
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
            <i class="filter-item iconfont iconxinzeng"></i> 新增明细
          </el-button>
          <el-button
            type="text"
            class="float-left cursor-pointer margin-right-10"
            @click="del"
            v-hotKey="{ func: 'func_delete' }"
            :disabled="!isShadow"
          >
            <i class="filter-item iconfont iconshanchu"></i> 删除明细
          </el-button>
        </el-row>

        <!-- 入库单列表 -->
        <el-row class="tablerow">
          <!-- <lenterChange
            :tableData="tableData"
            @eq="enterlast"
            class="height100"
          >-->
          <l-tab-change :tableData="tableData" class="height100">
            <el-table
              ref="singleTable"
              id="single-table"
              height="100%"
              :data="tableData"
              v-if="!tableLoading"
              v-loading="tableLoading"
              @cell-dblclick="dblclick"
              border
              stripe
              style="width: 100%"
              highlight-current-row
              @current-change="handleCurrentChange"
              @selection-change="handleSelectionChange"
              @header-dragend="repair"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                v-if="wareinfo_main.status !== '1'"
                type="selection"
                width="40"
              ></el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                label="物资名称"
                prop="goodsName"
                width="220"
              >
                <template slot-scope="{ row, $index }">
                  <span v-if="row.goodsName">{{ row.goodsName }}</span>
                  <goods-info-list
                    v-else
                    suffix-icon="el-icon-search"
                    @send-data="getSearchData($event, $index)"
                  ></goods-info-list>
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
                prop="outboundQty"
                class-name="outfitNum"
                label="出库数量"
                width="240"
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
                      :val="scope.row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                    <template v-if="scope.row.packQuantity != 1">
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
                        :val="scope.row.minUnit"
                        code="DrugUnit"
                        v-codeTransform
                      ></span>
                    </template>
                  </div>
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
                <template slot-scope="{ row }">
                <span
                >{{ formatNum(row.purchasePrice) }}</span></template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                align="right"
                prop
                label="售价(元)"
                width="100"
              >
                <template slot-scope="{ row}">
                  <span>{{ formatNum(row.price) }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
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
              </el-table-column> -->
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="batchNum"
                label="批号"
                width="100"
              >
                <template slot-scope="{ row}">
                  <span>{{ row.batchNum }}</span>
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
                  <span>{{ row.expDate }}</span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                prop="barCode"
                label="条码"
              >
                <template slot-scope="{ row }">
                  <span>{{ row.barCode }}</span>
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
                <span
                  :val="row.originCode"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                align="right"
                prop="purchaseAmt"
                label="进价金额(元)"
                width="130"
              >
                <template slot-scope="{ row }">
                <span>
                  {{
                    formatNum(
                      Math.round(
                        (row.purchasePrice * 100 * row.outboundQty) /
                        row.packQuantity
                      ) / 100
                    )
                  }}
                </span>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                show-overflow-tooltip
                align="right"
                prop="amt"
                label="售价金额(元)"
                width="130"
              >
                <template slot-scope="{ row }">
                <span>
                  {{
                    formatNum(
                      Math.round(
                        (row.price * 100 * row.outboundQty) / row.packQuantity
                      ) / 100
                    )
                  }}
                </span>
                </template>
              </el-table-column>
            </el-table>
          </l-tab-change>

          <!-- </lenterChange> -->
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
            @click="printFuc()"
          >打印</el-button
          >
          <el-button
            :disabled="!tableData.length"
            class="less-btn float-left"
            type="primary"
            plain
          >导出</el-button
          >
          <el-button
            v-if="wareinfo_main.status == '0'"
            class="less-btn float-right"
            type="primary"
            @click="submitData"
            v-hotKey="{ func: 'func_submit' }"
          >提交</el-button
          >
          <el-button
            v-if="wareinfo_main.status !== '1'"
            class="less-btn float-right"
            type="primary"
            plain
            @click="save"
            v-hotKey="{ func: 'func_save' }"
          >保存</el-button
          >
        </div>
      </div>
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
              prop="goodsName"
              label="物资名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="spec"
              label="规格"
            ></el-table-column>
            <el-table-column
              label="进价(元)"
              prop="purchasePrice"
              width="120"
              align="right"
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
            <el-table-column label="库存量" prop="stockQty" width="140">
              <template slot-scope="scope">
                {{ scope.row.stockQtyDisplay }}
<!--                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>-->
<!--                <template v-if="scope.row.bluk !== 0">
                  {{ scope.row.bluk }}
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>-->
              </template>
            </el-table-column>
            <el-table-column label="库发数" prop="backQuantity" width="320">
              <template slot-scope="scope">
                <div class="noWrap">
                  <el-input
                    class="number-input"
                    v-model="scope.row.kfOut"
                    placeholder
                    @keydown.enter.native="
                      nextFocus(scope.row, scope.$index, $event)
                    "
                  oninput="value=value.replace(/[^\d]/g,'')"
                    @keyup.native="textValueDia($event, scope.$index)"
                  ></el-input>
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template  v-if="scope.row.packQuantity != 1">
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
                      :val="scope.row.minUnit"
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
            <el-table-column
              label="有效期"
              prop="expDate"
              width="110"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="生产厂商" width="180" show-overflow-tooltip>
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
  </el-card>
</template>

<script>
import goodsInfoList from "./components/goodsInfoList";
import LocalDrugSelector from "@/components/LocalGoodsSelector/index.vue";
import batchList from "./components/batchList";
import { localCodeTransform } from "@/utils/util";
import warehousingAPI from "@/api/materielStorage/warehousing.js";
import mixin from "@/mixins/drugManagement.js";
//import { print, preview, onPreview } from "@/utils/print";
import { print } from "@/utils/print_new";
import {
  sumOutpChargeDetailNewA4,
  handlePrintData,
} from "@/printTemplete/module/goodsPrint.js";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { deepClone } from "@/utils/index.js";
import Supplier from "@/views/drugManagement/drugstock/purchase/component/supplier.vue";
import { mapGetters } from "vuex";


export default {
  mixins: [mixin],
  components: {
    LocalDrugSelector,
    goodsInfoList,
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
    },
  },
  data() {
    return {
      statusShow: {
        "0": "未提交",
        "1": "已提交"
      },
      drugVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      drugTitleName: "",
      deptList:[],
      receiverList:[],
      wareinfo_main: {
        // 入库单详情
        recordRemark: "",
        deptId:'',
        inInventoryId: "",
        inInventoryNum: "", // 申请单号
        totalAmt: "", //总进价金额
        supplierCode: "", //供应商
        outboundType: "", //入库类型code
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
          width: 80
        },
        {
          prop: "price",
          label: "售价(元)",
          width: 80
        },
        {
          prop: "expDate",
          label: "有效期",
          width: 120
        }
      ],
      storageTypeList: [
        {
          name: "科室领用",
          code: "21"
        },
        {
          name: "机构间调拨入库",
          code: "22"
        },
        {
          name: "盘亏出库",
          code: "23"
        },
        {
          name: "其他出库",
          code: "24"
        }
      ],
      batchDataList: [],
      searchParams: {
        goodsName: ""
      },
      curTableIndex: "",
      searchTable: [],
      selectedSearchTableList: [],
      tableindex: "", //当前编辑index
      selectlist: [], //药品快速选择
      curSelectTableList: [], // 当前已经选中的item
      //  backDrugName: "",
      // 总金额
      totalPrice: 0,
      receiverParam:{
        hosId:'',
        name:''
      },
      sureItem: {},
      inputDomsLength: 0
    };
  },
  created(){
    this.receiverParam.hosId = JSON.parse(window.localStorage.getItem('params')).hosId
  },
  mounted() {
    this.getDeptList();
    this.getReceiver();
    this.initInputDOM();

  },
  computed: {
    isShadow() {
      return (
        this.wareinfo_main.outboundType !== ""
        // && this.wareinfo_main.supplierCode !== ""
      );
    },
    detailTime() {
      return this.getNowFormatDate().slice(10, 20);
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
        this.findAddDateFun();
      }
    }
  },
  methods: {
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
      this.$set(this.tableData[index], "outboundQty", bluk);
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
      this.$set(this.searchTable[index], "outboundQty", bluk);
    },
    //  格式化日期
    dateFormat(row, column) {
      const date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return new Date(date).format("yyyy-MM-dd");
    },
    //获取联想搜索结果
    getDrugBatchList(params) {
      console.log(params)
      this.tableLoading = true;
      this.searchTable = [];
      warehousingAPI
        .getAssociationList(params)
        .then(res => {
          if (res.code !== 1) {
            this.$message.error(res.msg || "物资批次查询失败");
            this.tableLoading = false;
            return;
          }
          if (res.data.length === 0) {
            this.$message.error("暂无物资批次数据");
            this.tableLoading = false;
            return;
          }
          let list = res.data.map(drugWapper => {
            console.log('drugWapper',drugWapper)
            let { out, bl } = blukToOutfit(
              drugWapper.stockQty,
              drugWapper.packQuantity
            );
            return {
              ...drugWapper,
              stockQty: drugWapper.stockQty || 0,
              outfit: out,
              bluk: bl,
              purchasePrice: drugWapper.purchasePrice || 0,
              price: drugWapper.price || 0,
              outboundQty:"",
              kfOut: "",
              isEditing: true
            };
          });
          console.log('list')
          this.searchTable = list;
          this.searchTable.forEach((item, index) => {
            const ele = this.tableData.find(it => it.id === item.id);
            const el = this.tableData.find(it => it.inId === item.id);
            console.log('el',el)
            if (ele && ele.kfOutBl) {
              console.log(`1111`, ele);
              this.$set(this.searchTable, index, {
                ...this.searchTable[index],
                outboundQty: ele.backQuantity,
                kfOut: ele.kfOut,
                kfOutBl: ele.kfOutBl
              });
            } else if (ele) {
              console.log(`2222`, ele);
              this.$set(this.searchTable, index, {
                ...this.searchTable[index],
                outboundQty: ele.backQuantity,
                kfOut: ele.kfOut
              });
            }else if(el && el.kfOutBl){
              this.$set(this.searchTable, index, {
                ...this.searchTable[index],
                outboundQty: el.backQuantity,
                kfOut: el.kfOut,
                kfOutBl: el.kfOutBl
              });
            }else if(el){
              this.$set(this.searchTable, index, {
                ...this.searchTable[index],
                outboundQty: el.backQuantity,
                kfOut: el.kfOut
              });
            }
          });
          const curItemIndex = this.searchTable.findIndex(
            item => item.id === this.tableData[this.curTableIndex].inId
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
          this.$message.error(res.msg || "物资批次查询失败");
        });
    },
    drugClose() {
      this.drugVisible = false;
    },
//按批次出库确认
    // eslint-disable-next-line complexity
    async conserve() {
      console.log("原----------",this.tableData);
      console.log("++----------",this.searchTable);
      console.log("wareinfo_main----",this.wareinfo_main);
      this.selectedSearchTableList = [];
      this.searchTable.forEach(item => {
        // console.group("debugger");
        // console.log(`item.kfOut`, item.kfOut);
        // console.log(`item.kfOutBl`, item.kfOutBl);
         console.log(`itemKKK`, JSON.parse(JSON.stringify(item)));
        // console.groupEnd();

        if (item.kfOut !== "" && item.kfOut != 0) {
          console.log(1111111)
          let data = {
            ...item,
            outboundQty: outfitToBluk(
              item.kfOut,
              item.kfOutBl || 0,
              item.packQuantity
            ),
            outInventoryNum: this.wareinfo_main.outboundNum,
            inId: item.id
          };
          console.log('data',data)
          this.selectedSearchTableList.push(data);
        } else {
          console.log(222222)
          if (item.kfOutBl && item.kfOutBl !== "" && item.kfOutBl != 0) {
            let data = {
              ...item,
              outboundQty: outfitToBluk(
                item.kfOut || 0,
                item.kfOutBl,
                item.packQuantity
              ),
              outInventoryNum: this.wareinfo_main.outboundNum,
              inId: item.id
            };
            console.log('data',data)
            this.selectedSearchTableList.push(data);
          }
        }
      });
      if (this.selectedSearchTableList.length == 0) {
        this.$message.warning("请填写库发数");
        return;
      }
      let checkedList = this.selectedSearchTableList.filter(
        item => item.outboundQty > item.stockQty
      );
      if (checkedList.length > 0) {
        this.$message.warning("库发数不能大于库存量");
        return;
      }

        console.log(987,this.curTableIndex)
        if (!this.tableData[this.curTableIndex].id) {
          console.log(123,this.tableData[this.curTableIndex])
          this.tableData.splice(this.curTableIndex, 1);
        }
        this.tableData = this.tableData.filter(item => {
          return Boolean(item.inId);
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
              console.log(233333333333333333333)
              this.tableData.splice(i, 1);
              break;
            }
            console.log('this.tableData[i].inId',this.tableData[i].inId)
            console.log('this.selectedSearchTableList[j].id',this.selectedSearchTableList[j].id)
            if (
              this.tableData[i].id === this.selectedSearchTableList[j].id
            ) {
              console.log(352378647123627834e732)
              this.tableData.splice(i, 1);
              break;
            }
            if (
              this.tableData[i].inId === this.selectedSearchTableList[j].inId
            ) {
              console.log(111111111111,i)
              this.tableData.splice(i, 1);
              break;
            }
          }
        }
        console.log('添加selectedSearchTableList',this.selectedSearchTableList)
      console.log('之后的tableData',this.tableData)
        this.tableData = this.tableData.concat(this.selectedSearchTableList);
      console.log('最终的tableData',this.tableData)
      this.drugVisible = false;

      this.$nextTick(() => {
        this.adddrug();
      });
    },

    async getDeptList() {
      try {
        let res = await warehousingAPI.getDeptList();
        if (res.code === 1) {
         this.deptList = res.data
        }
      } catch (error) {
      } finally {
      }
    },

    async getReceiver() {
      try {
        let res = await warehousingAPI.getReceiver(this.receiverParam);
        if (res.code === 1) {
          this.receiverList = res.data
        }
      } catch (error) {
      } finally {
      }
    },

    /*
        以及方法 1.1处理回车事件  获取焦点



      */
    // 1.1  回车事件获取焦点并填写内容
    // 表格切换焦点方法 渲染后调用（适应input框）需定义table Id:'single-table'
    initInputDOM() {
      const inputDoms = document.querySelectorAll(
        "#single-table .el-input__inner"
      );
      inputDoms.forEach((item, index) => {
        item.setAttribute("data-index", index);
      });
      // console.log(`this.inputDomsLength`, this.inputDomsLength);
      // this.inputDomsLength =
      //   this.inputDomsLength === 0
      //     ? 0
      //     : inputDoms.length - this.inputDomsLength;
      // console.group("initInputDOM");
      // console.log(`inputDoms.length`, inputDoms.length);
      // console.log(`this.inputDomsLength`, this.inputDomsLength);
      // console.groupEnd();
      return inputDoms;
    },
    // 光标离开时 如果没有填写内容 默认为0
    outfitBlur(e, index) {
      console.log(`index`, index);
      console.log(`e.target`, e);
      if (e.target.value === "") {
        this.tableData[index].outfit = 0;
        console.log(`this.tableData`, this.tableData);
      }
    },
    blukBlur(e, index) {
      if (e.target.value === "") {
        // e.target.value = 0;
        this.$set(this.tableData[index], "bluk", 0);
        console.log(`this.tableData`, this.tableData);
      }
    },
    dateNextFocus(row, index, event) {
      // 1. 必须为8位数

      if (this.isDate8(row.expDate)) {
        if (this.timeChange(this.isDate8(row.expDate), index)) {
          row.flag = true;
          this.$message.error("药品有效期小于三个月，请确认有效期");
          this.adddrug();
        } else {
          this.adddrug();
          row.flag = false;
        }
      } else if (this.isDate10(row.expDate)) {
        if (this.timeChange(this.isDate10(row.expDate), index)) {
          row.flag = true;
          this.$message.error("药品有效期小于三个月，请确认有效期");
          this.adddrug();
        } else {
          this.adddrug();
          row.flag = false;
        }
      } else {
        this.$message.error("请输入正确的日期格式");
      }
    },
    //选择有效期
    // eslint-disable-next-line complexity
    timeChange(expDate, index) {
      console.log(expDate, "有效期");
      const curTime = this.getNowTime();
      let beginTime = this.wareinfo_main.entryTime || curTime;
      // let endTime = this.dayJs(expDate).format("YYYY-MM-DD HH:mm:ss") || "";
      let endTime = expDate;
      console.log(endTime);
      this.tableData[index].expDate = endTime;
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
      return flag;
    },
    // eslint-disable-next-line complexity
    isDate8(sDate) {
      if (!/^\d{4}(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])$/.test(sDate)) {
        return false;
      }
      var year, month, day;
      year = sDate.substring(0, 4);
      month = sDate.substring(4, 6);
      day = sDate.substring(6, 8);
      var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year < 1700 || year > 2500) return false;
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        iaMonthDays[1] = 29;
      if (month < 1 || month > 12) {
        return false;
      }
      if (day < 1 || day > iaMonthDays[month - 1]) {
        return false;
      }
      return `${year}-${month}-${day}`;
    },
    // eslint-disable-next-line complexity
    isDate10(sDate) {
      if (!/^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$/.test(sDate)) {
        return false;
      }
      var year, month, day;
      year = sDate.substring(0, 4);
      month = sDate.substring(5, 7);
      day = sDate.substring(8, 10);
      var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year < 1700 || year > 2500) return false;
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        iaMonthDays[1] = 29;
      if (month < 1 || month > 12) {
        return false;
      }
      if (day < 1 || day > iaMonthDays[month - 1]) {
        return false;
      }
      console.log(`1241241`, `${year}-${month}-${day}`);
      return `${year}-${month}-${day}`;
    },
    nextFocus(arr, scope, event) {

      // 定义：class-name="addColumn"
      console.group("nextFocus");
      console.log(`arr`, arr);
      console.log(`scope`, scope);
      console.groupEnd();
      // if (arr.length === scope.$index + 1) {
      //   if (scope.column.className === "addColumn") {
      //     this.adddrug(); //定义添加行通用方法
      //     return;
      //   }
      // }
      const index = event.target.getAttribute("data-index");
      const nextIndex = parseInt(index) + 1;
      const length = this.inputDoms.length;
      console.log(`length-------------`, length)
      if (nextIndex < length) {
        console.log(123)
        this.inputDoms[nextIndex].focus();
      } else {
        console.log(321)
        this.inputDoms[0].focus();
      }
    },
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
    formatNum(num) {
      return formatNum(num);
    },
    //计算总进价
    totalPurchasePrice() {
      let fullPrice = 0;
      this.tableData.forEach(item => {
        if (item.goodsCode) {
          fullPrice =
            Math.round(
              fullPrice * 100 +
              (item.purchasePrice * 100 * item.outboundQty) / item.packQuantity
            ) / 100;
        }
      });
      this.totalPrice = fullPrice;
      return fullPrice;
    },
    textValue(e, index) {
      let item = this.tableData[index];
      this.validateResult = new RegExp("^[1-9]{1}[0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入1或正整数");
        e.target.value = "";
        this.$set(this.tableData[index], "outfit", "");
        this.$set(this.tableData[index], "outboundQty", "");
      } else {
        let num = outfitToBluk(item.outfit, 0, item.packQuantity);
        this.$set(this.tableData[index], "outboundQty", num);
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
      warehousingAPI
        .getOutboundMulti(id)
        .then(res => {
          if (res.code == 1) {
            this.tableData = this.changeNum(res.data.outboundDPOList);
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
    // 添加索引
    tableRowClassName(row, index) {
      // 给每条数据添加一个索引
      row.row.index = row.rowIndex;
    },

    /*exportExcel() {
      let nums = this.$refs.singleTable.bodyWrapper.querySelectorAll(
        ".outfitNum"
      );
      let tableData_new = this.tableData.map((item, i) => {
        return Object.assign(item, { _num: nums[i].innerText });
      });
      let excelData = {
        title: ["入库单", "", "", "", ""],
        where: [
          "入库单号:" + this.wareinfo_main.inInventoryNum,
          "",
          "",
          "",
          ""
        ],
        tHeader: ["物资名称", "规格", "生产厂商", "单价(元)"],
        filterVal: ["drugName", "spec", "purchasePrice", "price", "_num"],
        listDate: tableData_new,
        fileName: "入库单",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },*/
    changeNum(data) {
      let list = data.map(item => {
        let kfnum = blukToOutfit(item.outboundQty, item.packQuantity);
        return {
          ...item,
          kfOut: kfnum.out,
          kfOutBl: kfnum.bl
        };
      });
      return list;
    },

    dblclick(row) {
      console.log(9999,this.tableData)
      // 双击行修改批次
      if (
        this.wareinfo_main.status === "1" ||
        this.wareinfo_main.status === "2"
      ) {
        this.$message.error("出库单已提交，不可修改");
        return;
      }
      // 获取选中的表格的index
      this.curTableIndex = this.tableData.findIndex(
        (item, index) => item.inId === row.inId && item.goodsCode === row.goodsCode
      );
      if (this.curTableIndex === -1) {
        return;
      }
      this.drugTitleName = row.goodsName + row.spec;
      this.drugVisible = true;

      let searchParams = {};
      searchParams = { ...this.pageParams };
      searchParams.goodsCode = row.goodsCode;
      this.searchTable = [];
      this.getDrugBatchList(searchParams);
    },

    async printFuc() {
      this.tableDataInit = [];
      let printData = handlePrintData(
        {
          tableData: this.tableData,
          hosName: "物资出库单",
          boundNum:"出库单号：",
          entryPersonName:this.wareinfo_main.entryPersonName,
          entryTime:this.wareinfo_main.entryTime,
          outboundNum:this.wareinfo_main.outboundNum
        },
      );
      let sumOutpChargeDetailNew = sumOutpChargeDetailNewA4 ;
      print("", sumOutpChargeDetailNew, {}, printData);
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
        this.$message.error("出库单明细不可为空");
        return;
      }
     /* if (!this.InboundQuantity()) {
        console.log('InboundQuantity')
        return;
      }*/
      let isRequire = this.fillInComplete();
      if (isRequire) {
        this.$message.error("请全部填写,且进价金额不小于0");
        return;
      }
      this.validity();

      let  warnMsg = "是否提交当前出库单?";


      this.$confirmFunc({
        titleText: "提示",
        contentText: warnMsg,
        confirm: async (action, instance, done) => {
          this.$showLoading();
          this.wareinfo_main.totalAmt = this.totalPurchasePrice();
          let saveData = {
            ...this.wareinfo_main,
            status: 1
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
              inId:item.inId,
            };
          });
          saveData.outboundDPOList = dataList;
          try {
            let res = await warehousingAPI.saveOutWarehousingList(saveData);
            if (res.code === 1) {
              this.refreshList();
              this.tableDataflag = "";
              this.$message({
                type: "success",
                message: "提交成功!"
              });
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
          title: "批号"
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
          (item.packUnit == 0
            ? item.outfit === ""
            : item.outfit === "" && item.bluk === "") ||
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
    // 校验入库数量是否为0
    // eslint-disable-next-line complexity
    InboundQuantity() {
      let flag = false;
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        console.log(`item`, item);
        console.log(`item.outfit`, item.outfit);
        console.log(`item.bluk`, item.bluk);
        if (item.outfit !== undefined && item.bluk !== undefined) {
          console.log(`两个参数都存在`);
          if (
            (item.outfit === 0 && item.bluk === "") ||
            (item.outfit === 0 && Number(item.bluk) === 0)
          ) {
            this.$message.error(item.goodsName + "入库数量不符合规范");
            flag = false;
            return flag;
          }
          flag = true;
          return flag;
        } else if (item.outfit !== undefined && item.bluk === undefined) {
          console.log("只存在outfit");
          if (item.outfit === 0) {
            this.$message.error(item.goodsName + "入库数量不符合规范");
            flag = false;
            return flag;
          }
          flag = true;
          return flag;
        }
      }
    },
    // 保存入库单
    save() {
      this.filterTableDataEmpty();
      if (this.tableData.length == 0) {
        this.$message.error("出库单明细不可为空");
        return;
      }

      let isRequire = this.fillInComplete();
      if (isRequire) {
        this.$message.error("请全部填写,且出库数不小于0");
        return;
      }

      this.wareinfo_main.totalAmt = this.totalPurchasePrice();
      let saveData = {
        ...this.wareinfo_main,
        status:0,
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
          inId:item.inId,
        };
      });
      saveData.outboundDPOList = dataList;
      this.validity();
      this.$confirmFunc({
        titleText: "提示",
        contentText:'是否保存当前出库单',
        confirm: (action, instance, done) => {
          this.$showLoading();
          warehousingAPI
            .saveOutWarehousingList(saveData)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                window.sessionStorage.setItem("findStyle", false);
                this.wareinfo_main = res.data;
                this.tableData = res.data.outboundDPOList || [];
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
      console.log(this.tableData, "显示的数据列表");
      if (this.curSelectTableList.length == 0) {
        this.$message.warning("请选择！");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除当前出库明细?",
        confirm: (action, instance, done) => {
          let add = this.tableData.filter(
            item =>
              !this.curSelectTableList.some(ele => ele.index === item.index)
          );
          this.tableData = add;
          // console.log(`this.initInputDOM()----`, this.initInputDOM());

          this.$nextTick(() => {
            console.log(`this.initInputDOM()`, this.initInputDOM().length);
            this.inputDomsLength = this.initInputDOM().length;
          });
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
      console.log('aassdd',this.tableData)
      this.tableData = this.tableData.filter(item => {
        return item.inId;
      });
    }, //过滤调空白行

    //新增药品
    adddrug() {
      if (this.wareinfo_main.status == "1") {
        this.$message.warning("当前单号已提交不可编辑");
        return;
      }
      if (this.wareinfo_main.outboundType == '21' && !this.wareinfo_main.deptId) {
        this.$message.warning("请选择领用科室");
        return;
      }
      if (this.wareinfo_main.status != "1") {
        this.filterTableDataEmpty();
        this.tableData.push({
          id:'',
          goodsName: "", // 药品名称
          spec: "", // 规格
          packUnit: "", //剂量
          minUnit: "", // 单位
          outboundQty: "", //入库数量
          purchasePrice: "", // 当前进价
          price: "", // 当前售价
          purchaseAmt: "", //进价金额
          amt: "", //售价金额
          batchNum: "", //生产批号
          expDate: "", //有效期
          originCode: "", //产地
          originIdentificationCode: "", //产地标识码
          barCode: "", // 条码
          purchaseDate: this.getNowFormatDate(), //购入时间
          flag: false,
          isEditing: true // 是否为编辑状态
        });
        this.wareinfo_main.isEditing = false;
      }
      this.$nextTick(function() {
        let rpTable = this.$refs.singleTable;
        rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
        rpTable.bodyWrapper.scrollLeft = 0;
      });

    },
    enterlast() {
      // 键盘Tab 到最后一个 触发回调事件
      // this.backDrugName = "";
      this.tableData.map(item => {
        item.isEditing = false;
      });
      this.tableData.push({
         id:'',
        goodsName: "", // 药品名称
        spec: "", // 规格
        packUnit: "", //剂量
        minUnit: "", // 单位
        outboundQty: "", //入库数量
        purchasePrice: "", // 当前进价
        price: "", // 当前售价
        purchaseAmt: "", //进价金额
        amt: "", //售价金额
        batchNum: "", //生产批号
        expDate: "", //有效期
        originCode: "", //产地
        originIdentificationCode: "", //产地标识码
        barCode: "", // 条码
        purchaseDate: this.getNowFormatDate(), //购入时间
        isEditing: true // 是否为编辑状态
      });
    },
    // 重置入库明细单
    fullReset() {
      // 重置计算光标位置信息
      this.inputDomsLength = 0;
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

    // 获取药品输入查询组件传过来的药品数据
    getSearchData(row, index) {
      this.curTableIndex = index;
      this.drugTitleName = row.goodsName + row.spec;
      this.drugVisible = true; //打开药品批次列表弹框

      let searchParams = {
        pageNo: 1,
        pageSize: 10000,
        goodsCode: row.goodsCode,
        currDrugStorage:'1'
      };
      this.getDrugBatchList(searchParams);
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
