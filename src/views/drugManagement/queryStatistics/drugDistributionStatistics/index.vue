<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="4">
                <LFormtTitle label="机构列表">
                  <el-input :value="hosName" disabled></el-input>
                </LFormtTitle>
              </el-col>
              <!-- 发药时间（开始时间、结束时间，精确到分）   药品类型（全部、西药、中成药、草药）
                    统计方式（按窗口、按开单医生、按管理类型、按发药人、按病人性质/结算类型、按开单科室）
                    统计范围（门诊、全部、家床）
              -->
              <el-col
                :span="4"
                style="display: flex;justify-content: space-around;align-items: center;"
              >
                <LFormtTitle label="发药日期" labelWidth="76">
                  <el-date-picker
                    v-model="dateObj"
                    type="datetimerange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="dateObjFun"
                  ></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="药品类型">
                  <el-select
                    v-model="searchData.cwType"
                    clearable
                    placeholder="请选择"
                    @change="manageTypeFun"
                  >
                    <el-option
                      v-for="item in storageTypeList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="统计方式" labelWidth="76">
                  <el-select
                    v-model="groupByObj"
                    clearable
                    placeholder="请选择"
                    @change="storageChange"
                  >
                    <el-option
                      v-for="item in statisticalMethods"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="统计范围" labelWidth="76">
                  <el-select
                    v-model="searchData.statisticalRange"
                    clearable
                    placeholder="请选择"
                    @change="storageChange"
                  >
                    <el-option
                      v-for="item in statisticalRangeList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="2">
                <el-checkbox v-model="checked" @change="checkedChange"
                  >是否属于基药</el-checkbox
                >
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top:10px;">
              <el-col :span="18">
                <Linput
                  style="display:inline-block;vertical-align: top;width: 150px;margin-right:8px;"
                  :popoverWidth="800"
                  suffix-icon="el-icon-search"
                  :tableData="selectOptions"
                  @query="elsearch($event)"
                  @select="select"
                  :tableParams="dropColumn"
                  :backDrugName="drugName"
                  placeholder="按药品名称定位药品"
                ></Linput>
                <el-button type="primary" class="vertical" @click="position">
                  定位
                </el-button>
              </el-col>

              <el-col :span="6" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button
                  type="primary"
                  plain
                  @click="print"
                  v-hotKey="{ func: 'func_print' }"
                  >打印</el-button
                >
                <el-button type="primary" plain @click="exportExcel"
                  >导出</el-button
                >
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-col>
              <h2 style="text-align: center;margin: 0px;">{{ listName }}</h2>
            </el-col>
            <el-col class="height100">
              <el-col :span="12" class="height100">
                <el-table
                  ref="singleTable"
                  :data="drugData"
                  border
                  width="100%"
                  height="600px"
                  highlight-current-row
                  v-loading="tlm_isLoading"
                  element-loading-text="加载中..."
                  @header-dragend="headerDragend"
                  @row-click="rowlick"
                  show-summary
                >
                  <el-table-column
                    type="index"
                    width="70"
                    label="序号"
                  ></el-table-column>
                  <el-table-column
                    v-for="(item, index) in tableParams"
                    :key="index"
                    sortable
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :align="item.align || 'left'"
                    header-align="center"
                    :fixed="item.fixed"
                    :type="item.type"
                    show-overflow-tooltip
                  >
                    <!-- span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span> -->
                    <template slot-scope="scope">
                      <template v-if="item.prop == 'groupByName'">
                        <span v-if="scope.row.groupByName == ''">
                          <span v-if="searchData.groupBy == 'd.manage_type'">
                            <span
                              :val="scope.row.groupBy"
                              code="DrugManaType"
                              v-codeTransform
                            ></span>
                          </span>
                          <span v-if="searchData.groupBy == 'company_code'">
                            <span
                              tableName="fin_company"
                              :conditionMap="{
                                company_code: scope.row.groupBy
                              }"
                              columns="company_name"
                              v-tableTransform
                            ></span>
                          </span>
                        </span>
                      </template>
                      <template>
                        <span class="overflow-point">{{
                          scope.row[item.prop]
                        }}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12" class="height100">
                <div class="bottom-table">
                  <el-table
                    ref="singleTable1"
                    v-if="listForDeliveryDStyle"
                    :data="drugData1"
                    border
                    width="100%"
                    height="600px"
                    highlight-current-row
                    v-loading="tlm_isLoading"
                    element-loading-text="加载中..."
                    @header-dragend="headerDragend"
                    @row-dblclick="rowDblclick"
                    :row-style="tableRowClassName"
                    show-summary
                  >
                    <el-table-column
                      type="index"
                      width="70"
                      label="序号"
                    ></el-table-column>
                    <el-table-column
                      v-for="(item, index) in tableParams1"
                      :key="index"
                      sortable
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'left'"
                      header-align="center"
                      :fixed="item.fixed"
                      :type="item.type"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span class="overflow-point">{{
                          scope.row[item.prop]
                        }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-col>
          </div>
        </div>
      </slot>
    </flow-menu>
    <el-dialog
      :append-to-body="true"
      title="发药明细"
      :visible.sync="dispensingDetailsDialogVisible"
      width="1000px"
      :before-close="dispensingDetailsClose"
    >
      <div class="width100 padding10">
        <el-table
          :data="dispensingDetailsTabularData"
          style="width: 100%"
          height="500px"
          border
        >
          <el-table-column prop="recipeCode" label="处方号码"></el-table-column>
          <el-table-column
            prop="deliveryTime"
            label="发药日期"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="patientName"
            label="病人姓名"
          ></el-table-column>
          <el-table-column
            prop="deliveryUserName"
            label="发药人"
          ></el-table-column>
          <el-table-column
            prop="doctorUserName"
            label="开单医生"
          ></el-table-column>
          <el-table-column
            prop="drugQuantityDisplay"
            label="数量"
          ></el-table-column>
          <el-table-column prop="amt" label="金额" align="right">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import base from "@/api/hmm/base";
import FlowMenu from "@/components/FlowMenu";
import hmmBaseApi from "@/api/hmm/base";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import { getRoles, getRole, setRole, getUserName } from "@/utils/auth";
import Base64 from "@/utils/base64";
import Linput from "@/views/drugManagement/prescriptionDispensing/preCheck/component/Linput.vue";
export default {
  name: "inStorageList",
  components: {
    FlowMenu,
    Linput
  },
  data() {
    return {
      // 定位
      selectOptions: [],
      drugName: "",
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
          prop: "originCode",
          label: "生产厂商"
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
      drugArr: [],
      drugTempIndex: -1,
      drugMark: -1,
      // 发药明细弹窗
      dispensingDetailsDialogVisible: false,
      // 发药明细表格数据
      dispensingDetailsTabularData: [],
      // 配置代码  开始
      // 列表名字
      listForDeliveryDStyle: true,
      listName: "药品发药情况统计",
      checked: "", //是否属于基药
      // 配置代码结束
      searchData: {
        hosId: "", //机构列表
        cwType: "", //药品类型T
        groupBy: "", //统计方式
        statisticalRange: "0", //统计范围
        eDeliveryTime: "", //结束时间
        sDeliveryTime: "", //开始时间
        pageNo: 1,
        pageSize: 20,
        basicDrug: ""
      },
      searchData1: {
        hosId: "", //机构列表
        cwType: "", //药品类型T
        groupBy: "", //统计方式
        statisticalRange: "0", //统计范围
        eDeliveryTime: "", //结束时间
        sDeliveryTime: "", //开始时间
        pageNo: 1,
        pageSize: 20,
        basicDrug: ""
      },
      groupByObj: "delivery_user_id",
      total: 0,
      dateObj: [],
      manageTypeName: "",
      curStorage: "",
      myDate: this.getNowFormatDate(),
      drugStorageList: [],
      // 统计方式
      statisticalMethods: [
        {
          code: "delivery_window_code",
          name: "按窗口"
        },
        {
          code: "doctor_user_id",
          name: "按开单医生"
        },
        {
          code: "d.manage_type",
          name: "按管理类型"
        },
        {
          code: "delivery_user_id",
          name: "按发药人"
        },
        {
          code: "company_code",
          name: "按病人性质/结算类型"
        },
        {
          code: "dept_id",
          name: "按开单科室"
        }
      ],
      // 统计范围
      statisticalRangeList: [
        {
          code: "0",
          name: "全部"
        },
        {
          code: "1",
          name: "门诊"
        },
        {
          code: "2",
          name: "家床"
        }
      ],
      storageTypeList: [
        {
          code: "",
          name: "全部"
        },
        {
          code: "1",
          name: "西药"
        },
        {
          code: "2",
          name: "中成药"
        },
        {
          code: "3",
          name: "草药"
        }
      ],
      tlm_isLoading: false,
      drugData: [],
      drugData1: [],
      tableParams1: [
        {
          prop: "drugName",
          label: "药品名称",
          align: "center",
          width: 200
        },
        {
          prop: "spec",
          label: "规格",
          align: "center",
          width: 200
        },
        {
          prop: "drugQuantityDisplay",
          label: "发药数",
          align: "center",
          width: 120
        },
        {
          prop: "amt",
          label: "发药金额",
          align: "right",
          width: 120
        }
      ],

      tableParams: [
        {
          prop: "groupByName",
          label: "项目名称",
          align: "center"
          // width: 160
        },
        {
          prop: "recipeAmt",
          label: "金额",
          align: "center"
          // width: 160
        },
        {
          prop: "recipeAmtPercentage",
          label: "比例",
          align: "center"
          // width: 160
        },
        {
          prop: "recipeCount",
          label: "处方张数",
          align: "center"
        },
        {
          prop: "recipeAvgAmt",
          label: "平均处方额",
          align: "center"
          // width: 160
        }
      ],
      operationOfName: "",
      hosName: "", //机构名称
      currentDrug: ""
    };
  },
  created() {
    this.listForPhaList();
    this.getDrugStorageList("0,1,2");
    this.operationOfName = Base64.decode(getUserName());
    this.hosName = JSON.parse(this.getPamars()).hosName;
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['singleTable'].doLayout();
    })
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
    position() {
      if (this.drugName === "") {
        return;
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
      //   item => item.drugName.indexOf(this.drugName) > -1
      // );
      console.log(`drugIndex`, drugIndex);
      if (typeof drugIndex !== "number") {
        return;
      }
      let drugItem = this.drugData1.find(
        item =>
          item.drugName.indexOf(
            this.drugArr[this.drugTempIndex].item.drugName
          ) > -1
      );
      console.log(`drugItem`, drugItem);
      // 选择高亮定位药品
      // drugItem && this.$refs.singleTable.setCurrentRow(drugItem);

      // 滚动条滚动到定位药品位置
      let dom = document.getElementsByClassName("bottom-table")[0];
      let scrollParent = dom.getElementsByClassName(
        "el-table--scrollable-y"
      )[0];
      if (scrollParent) {
        let scrollDom = scrollParent.getElementsByClassName(
          "el-table__body-wrapper"
        )[0];
        scrollDom && (scrollDom.scrollTop = 40 * drugIndex);
      }
    },
    select(row) {
      this.drugName = row.drugName;
      this.change(row);
    },
    change(row) {
      this.drugArr = [];
      this.drugTempIndex = -1;
      this.drugMark = -1;
      this.drugData1.forEach((item, i) => {
        if (item.drugName === this.drugName) {
          this.drugArr.push({
            i: i,
            item: item
          });
        }
      });
    },
    elsearch(drugName) {
      if (this.drugData1.length === 0) {
        this.$message.error("请选择查询项目");
        return;
      }
      //搜索联想
      let searchParams = {
        drugName: drugName
      };
      this.selectOptions = [];
      this.getDrugList(searchParams);
    },
    getDrugList(params, id) {
      base
        .getAssociation(params)
        .then(res => {
          if (res.code != 1) {
            this.$message.error(res.msg || "药品查询失败");
          }
          // if (res.data.length == 0) {
          //   this.$message.error("暂无药品数据");
          //   return;
          // }
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
    async rowDblclick(row) {
      this.dispensingDetailsDialogVisible = true;
      if (this.dateObj === null) {
        this.searchData.sDeliveryTime = "";
        this.searchData.eDeliveryTime = "";
      } else {
        this.searchData.sDeliveryTime = this.dateObj[0] ? this.dateObj[0] : "";
        this.searchData.eDeliveryTime = this.dateObj[1] ? this.dateObj[1] : "";
      }

      this.searchData.groupBy = this.groupByObj;
      let temp = JSON.parse(JSON.stringify(this.searchData));
      temp.drugId = row.drugId;
      temp.key = this.searchData1.key
      try {
        const res = await hmmBaseApi.listForDeliveryRecipe(temp);
        console.log("res", res);
        this.dispensingDetailsTabularData = res.data;
      } catch (err) {
        console.error("err", err);
      }
    },
    dispensingDetailsClose() {
      this.dispensingDetailsDialogVisible = false;
      this.dispensingDetailsTabularData = [];
    },
    checkedChange() {
      if (this.checked) {
        this.searchData.basicDrug = "1";
        this.searchData1.basicDrug = "1";
      } else {
        this.searchData.basicDrug = "";
        this.searchData1.basicDrug = "";
      }
    },
    getPamars() {
      const Pamars = "pamars";
      return localStorage.getItem(Pamars);
    },
    rowlick(row) {
      this.currentDrug = row;
      this.listForDeliveryD(row.groupBy);
    },
    search() {
      this.drugData1 = [];
      this.listForPhaList();
    },
    reset() {
      this.searchData = {
        hosId: "", //机构列表
        manageType: "", //药品类型
        storageCode: "", //药品名称
        eDate: "", //结束时间
        sDate: "", //开始时间
        pageNo: 1,
        pageSize: 20
      };
    },
    print() {},
    exportExcel() {
      let excelData = {
        title: ["药品发药情况统计", "", "", "", ""],
        where: [
          "项目名称:" + this.currentDrug.groupByName,
          "金额:" + this.currentDrug.recipeAmt,
          "比例:" + this.currentDrug.recipeAmtPercentage,
          "处方张数:" + this.currentDrug.recipeCount
        ],
        tHeader: ["药品名称", "规格", "发药数", "发药金额(元)"],
        filterVal: ["drugName", "spec", "drugQuantityDisplay", "amt"],
        listDate: this.drugData1,
        fileName: "药品发药情况统计",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },
    // 分页
    changeSize(val) {
      this.searchData.pageSize = val;
      this.listForPhaList();
    },
    changePage(val) {
      this.searchData.pageNo = val;
      this.listForPhaList();
    },
    // 分页

    headerDragend() {
      this.$refs.singleTable.doLayout();
    },
    dateObjFun() {
      // if (this.dateObj === undefined || this.dateObj === null) {
      //   this.dateObj = [];
      // }
      console.log(this.dateObj);
    },
    manageTypeFun(val) {
      // console.log(val);
      // for (let i = 0; i < this.storageTypeList.length; i++) {
      //   if (val == this.storageTypeList[i].code) {
      //     this.manageTypeName = this.storageTypeList[i].name;
      //     break
      //   }
      // }
    },
    storageChange(val) {
      let item = this.drugStorageList.find(item => item.code === val);
      this.curStorage = item.name;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentdate;
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = this.drugStorageList.concat(res.data);
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药库数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药库数据失败");
        });
    },
    //获取列表数据
    async listForPhaList() {
      console.log(`this.searchData`, this.searchData);
      if (this.dateObj === null) {
        this.searchData.sDeliveryTime = "";
        this.searchData.eDeliveryTime = "";
      } else {
        this.searchData.sDeliveryTime = this.dateObj[0] ? this.dateObj[0] : "";
        this.searchData.eDeliveryTime = this.dateObj[1] ? this.dateObj[1] : "";
      }
      this.searchData.groupBy = this.groupByObj;
      this.$showLoading();
      hmmBaseApi
        .listForDelivery(this.searchData)
        .then(res => {
          if (res.code == 1) {
            console.log(res.data, "打印报表的数据");
            this.drugData = res.data;
            this.total = res.total;
            this.$hideLoading();
          } else {
            this.$hideLoading();
            this.$message.error(res.msg || "统计数据失败");
          }
          if (res.data.length === 0) {
            this.$message.error("暂无统计数据");
          }
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "统计数据失败");
        });
    },
    async listForDeliveryD(data) {
      this.$showLoading();
      this.listForDeliveryDStyle = false;
      Object.assign(this.searchData1, this.searchData);
      if (this.dateObj === null) {
        this.searchData.sDeliveryTime = "";
        this.searchData.eDeliveryTime = "";
      } else {
        this.searchData.sDeliveryTime = this.dateObj[0] ? this.dateObj[0] : "";
        this.searchData.eDeliveryTime = this.dateObj[1] ? this.dateObj[1] : "";
      }
      // this.searchData1.sDeliveryTime = this.dateObj[0]
      //   ? this.dateObj[0] + " 00:00:00"
      //   : "";
      // this.searchData1.eDeliveryTime = this.dateObj[1]
      //   ? this.dateObj[1] + " 23:59:59"
      //   : "";
      this.searchData1.key = data;
      hmmBaseApi
        .listForDeliveryD(this.searchData1)
        .then(res => {
          if (res.code == 1) {
            console.log(res.data, "打印报表的数据");
            this.drugData1 = res.data;
            this.total = res.total;
            this.listForDeliveryDStyle = true;
            this.$hideLoading();
          } else {
            this.$hideLoading();
            this.listForDeliveryDStyle = true;
            this.$message.error(res.msg || "统计数据失败");
          }
          if (res.data.length === 0) {
            this.$message.error("暂无统计数据");
          }
          this.change();
        })
        .catch(res => {
          this.listForDeliveryDStyle = true;
          this.$hideLoading();
          this.$message.error(res.msg || "统计数据失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}

.main {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: $l-color-white;
}

.align-right {
  text-align: right;
}

.near-input {
  line-height: 32px;
}

.table {
  height: calc(100% - 200px);
  margin: 20px 0;
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}

.page {
  .el-pagination {
    padding: 0;

    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
</style>
