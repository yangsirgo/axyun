<template>
  <el-card class="height100 position-relative width100" style="padding:16px;">
    <!-- 退货单详情 -->
    <div class="details">
      <div class="returninfo">
        <el-row :gutter="6" class="infotext" style="margin-bottom: 8px;">
          <el-col :span="6">
            <span>退货单号：{{returninfo_main.backNum || '--'}}</span>
          </el-col>
          <el-col :span="6">
            <span>总金额：{{ formatNum(totalPrice) }}元</span>
          </el-col>
        </el-row>
        <el-row :gutter="6" style="margin-bottom: 8px;">
          <el-col :span="8">
            <l-formt-title required :disabled="!!returninfo_main.status" label="供应商" labelWidth="54">
              <Supplier :disabled="!!returninfo_main.status" :value.sync="returninfo_main.supplierCode" @change="supChange" />
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row :gutter="6" class="infotext" style="margin-bottom: 8px;">
          <el-col :span="6">
            <span>录入人员：{{returninfo_main.entryPersonName || '--'}}</span>
          </el-col>
          <el-col :span="6">
            <span>录入时间：{{returninfo_main.entryTime || '--'}}</span>
          </el-col>
          <el-col :span="6" v-if="returninfo_main.status!=='0'">
            <span>提交人员：{{returninfo_main.submitPersonName || '--'}}</span>
          </el-col>
          <el-col :span="6" v-if="returninfo_main.status!=='0'">
            <span>提交时间：{{returninfo_main.submitPersonTime || '--'}}</span>
          </el-col>
        </el-row>
        <el-row class="table-btn">
          <el-col :span="12">
            <el-button type="text" class="float-left cursor-pointer margin-right-10" v-if="returninfo_main.status!=='1'"
              @click="adddrug" :disabled="!isShadow" v-hotKey="{func:'func_add2'}">
              <i class="filter-item iconfont iconxinzeng"></i> 新增药品
            </el-button>
            <el-button type="text" :disabled="!isShadow" class="float-left cursor-pointer margin-right-10" @click="editBatch"
              v-if="returninfo_main.status !== '1'">
              <i class="filter-item iconfont iconbianjidangan"></i> 修改批次
            </el-button>
            <el-button type="text" class="float-left cursor-pointer margin-right-10" v-if="returninfo_main.status!=='1'"
              @click="del" :disabled="!isShadow" v-hotKey="{func:'func_delete'}">
              <i class="filter-item iconfont iconshanchu"></i>删除
            </el-button>
          </el-col>
        </el-row>
        <!-- 退货单table -->
        <div class="tablerow position-absolute" style="bottom: 76px;left: 16px;right: 16px;" :style="returninfo_main.status!=='1'?'top:142px':'top:109px'">
          <l-tab-change :tableData="tableData" class="height100">
            <el-table ref="singleTable" height="100%" :data="tableData" border stripe style="width: 100%" v-loading="loading"
              @selection-change="handleSelectionChange" highlight-current-row @current-change="handleCurrentChange"
              @cell-dblclick="dblclick">
              <el-table-column v-if="returninfo_main.status!=='1'" type="selection" width="40" key="t1" fixed></el-table-column>
              <el-table-column key="drugName" prop="drugName" :resizable="false" show-overflow-tooltip label="药品名称" fixed width="140">
                <template slot-scope="{row,$index}">
                  <span v-if="row.drugName">{{ row.drugName }}</span>
                  <drug-info-list v-else suffix-icon="el-icon-search" @send-data="getSearchData($event,$index)"
                    :storageCode="returninfo_main.storageCode" :supplierCode="returninfo_main.supplierCode"></drug-info-list>
                </template>
              </el-table-column>
              <el-table-column label="规格" key="spec" prop="spec" show-overflow-tooltip width="120"></el-table-column>
              <el-table-column align="right" label="进价(元)" width="100px" prop="purchasePrice">
                <template slot-scope="scope">{{ formatNum(scope.row.purchasePrice) }}</template>
              </el-table-column>
              <el-table-column align="right" label="售价(元)" width="100px" key="price" prop="price">
                <template slot-scope="scope">{{ formatNum(scope.row.price) }}</template>
              </el-table-column>
              <el-table-column label="库存量" key="drugStock" prop="drugStock" width="140">
                <template slot-scope="{ row }">
                  <template>
                    <span>{{ row.kcOut }}</span>
                    <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  </template>
                  <template v-if="row.kcBl !== 0">
                    <span>{{ row.kcBl }}</span>
                    <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="退还数量" width="200">
                <template slot-scope="{ row, $index }">
                  <div class="noWrap">
                    <template v-if="returninfo_main.status=='1'">
                      <span>{{ row.thOut }}</span>
                      <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                      <template v-if="row.unitSaleFlg === '1' && row.thBl !== 0">
                        <span>{{ row.thBl }}</span>
                        <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
                      </template>
                    </template>
                    <template v-else>
                      <el-input @keyup.native="textValue($event, $index)" v-model.number="row.thOut"></el-input>
                      <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                      <template v-if="row.unitSaleFlg === '1'">
                        <el-input @keyup.native="textValue($event,$index)" v-model.number="row.thBl"></el-input>
                        <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
                      </template>
                    </template>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="退还原因" width="140">
                <template slot-scope="scope">
                  <span v-if="returninfo_main.status=='1'">{{scope.row.backCause }}</span>
                  <el-input v-else v-model="scope.row.backCause " placeholder></el-input>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="生产批号" prop="batchNum"></el-table-column>
            </el-table>
          </l-tab-change>
          <div v-if="!isShadow" @click="validateTips" class="position-absolute height100 width100 shadow"></div>
        </div>
      </div>
    </div>

    <div class="bottom-btn height-button-bottom">
      <el-button :disabled="!tableData.length" class="less-btn float-left" type="primary" plain @click="print" v-hotKey="{func:'func_print'}">打印</el-button>
      <el-button :disabled="!tableData.length" class="less-btn float-left" type="primary" plain @click="exportExcel">导出</el-button>
      <el-button class="less-btn float-right" v-if="returninfo_main.status=='0'" type="primary" @click="submitData"
        v-hotKey="{func:'func_submit'}">提交</el-button>
      <el-button v-if="returninfo_main.status!=='1'&&returninfo_main.status!=='2'" class="less-btn float-right" type="primary"
        plain @click="save" v-hotKey="{func:'func_save'}">保存</el-button>
    </div>

    <!-- 修改批次 弹窗 -->
    <l-dialog :visible.sync="drugVisible" :title="this.drugTitleName" width="950px" @close="drugClose" @confirm="conserve"
      @cancel="drugClose">
      <template #content>
        <el-form label-position="top" inline class="padding20">
          <el-table :data="searchTable" border stripe style="width: 100%" v-loading="tableLoading" element-loading-text="列表正在加载中"
            height="300" ref="diagTable" highlight-current-row>
            <el-table-column show-overflow-tooltip label="药品批次" prop="inId"></el-table-column>
            <el-table-column label="进价(元)" prop="purchasePrice" align="right" width="100">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="售价(元)" prop="price" align="right" width="100">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期" prop="expDate" width="200"></el-table-column>
            <el-table-column label="库存量" prop="drugStock" width="140">
              <template slot-scope="scope">
                {{scope.row.outfit}}
                <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                <template v-if="scope.row.bluk !== 0">
                  {{scope.row.bluk}}
                  <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="退回数量" width="200">
              <template slot-scope="scope">
                <div class="noWrap">
                  <el-input v-model="scope.row.thOut" class="number-input" @keyup.native="textValueDia($event,scope.$index)"></el-input>
                  <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  <template v-if="scope.row.unitSaleFlg === '1'">
                    <el-input v-model="scope.row.thBl" @keyup.native="textValueDia($event,scope.$index)"></el-input>
                    <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="生产厂商">
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
  import drugInfoList from "./component/Linput";
  import stockReturn from "@/api/drugStorage/stock/renturn";
  import hmmBaseApi from "@/api/hmm/base";
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
  import Supplier from "@/views/drugManagement/drugstock/purchase/component/supplier.vue";

  export default {
    components: {
      drugInfoList,
      Supplier
    },
    props: {
      returninfo: {
        type: Object
      },
      supplierList: {
        type: Array
      }
    },
    data() {
      return {
        drugTitleName: "",
        tableLoading: false,
        returninfo_main: {
          applyId: "",
          backNum: "",
          status: "",
          dataVersion: 0,
          storageCode: "",
          storageId: "",
          supplierCode: "",
          totalAmount: "",
          entryPersonName: "",
          entryTime: "",
          submitPersonName: "",
          submitPersonTime: "",
          recordRemark: ""
        },
        tableData: [], // 申请表格详情
        curSelectTableList: [], // 当前已经选中的item
        pageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共页数
          pageSize: 10 // 每页数据条数
        },
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
        drugVisible: false,
        validateResult: null,
        //弹窗选中的table 列
        secttablelist: [],
        // 总金额
        totalPrice: 0,
        loading: false,
        currentRow: null,
        currentRowMain: null
      };
    },
    computed: {
      isShadow() {
        return this.returninfo_main.supplierCode !== "";
      },
      totalAmount() {
        let amt = 0;
        this.tableData.forEach(item => {
          amt = (amt * 100 + item.purchasePrice * 100 * item.backQuantity) / 100;
        });
        return amt;
      }
    },
    watch: {
      returninfo: {
        handler(val) {
          if (val) {
            this.returninfo_main = { ...val
            };
            this.getrenturnD(val.id);
          } else {
            this.returninfo_main = this.$options.data().returninfo_main;
            this.tableData = [];
          }
        },
        deep: true
      },
      tableData: {
        deep: true,
        handler() {
          this.$nextTick(() => {
            this.totalPurchasePrice();
          });
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
                item.purchasePrice * 100 * item.backQuantity /
                item.packQuantity
              ) / 100;
          }
        });
        this.totalPrice = fullPrice;
        return fullPrice;
      },
      validateTips() {
        this.$message({
          message: "供应商不可为空",
          type: "warning"
        });
      },
      refreshList() {
        this.returninfo_main = this.$options.data().returninfo_main;
        this.tableData = this.$options.data().tableData;
        this.$emit("search");
      },
      //查询明细
      getrenturnD(id) {
        if (id) {
          this.loading = true;
          stockReturn
            .getBackStocDetail(id)
            .then(res => {
              if (res.code == 1) {
                let list = res.data.map(item => {
                  let kcnum = blukToOutfit(item.drugStock, item.packQuantity);
                  let thnum = blukToOutfit(item.backQuantity, item.packQuantity);
                  return {
                    ...item,
                    kcOut: kcnum.out,
                    kcBl: kcnum.bl,
                    thOut: thnum.out,
                    thBl: thnum.bl
                  };
                });
                this.tableData = list;
                this.loading = false;
              } else {
                this.loading = false;
                this.$message.error(res.msg || "获取退回单明细数据失败");
              }
            })
            .catch(res => {
              this.$message.error(res.msg || "获取退回单明细数据失败");
            });
        }
      },
      handleCurrentChange(val) {
        // 高亮选中
        this.currentRowMain = val;
      },
      handleSelectionChange(list) {
        // checkbox选中表格
        this.curSelectedTableList = list;
      },
      //获取联想搜索结果
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
            } else {
              this.$message.error(res.msg || "药品批次查询失败");
            }
            this.tableLoading = false;
          })
          .catch(res => {
            this.tableLoading = false;
            this.$message.error(res.msg || "药品批次查询失败");
          });
      },
      //弹窗关闭
      drugClose() {
        this.drugVisible = false;
      },
      //弹窗保存
      conserve() {
        this.selectedSearchTableList = [];
        this.searchTable.forEach(item => {
          if (item.backQuantity !== 0 && item.backQuantity !== "") {
            this.selectedSearchTableList.push({
              ...item,
              kcOut: item.outfit,
              kcBl: item.bluk,
              thOut: item.thOut || 0,
              thBl: item.thBl || 0
            });
          }
        });
        if (this.selectedSearchTableList.length === 0) {
          this.$message.warning("请填写退回数量");
          return;
        }

        this.tableData = this.tableData.filter(item => {
          return Boolean(item.drugId);
        });
        for (let i = 0; i < this.selectedSearchTableList.length; i++) {
          if (this.tableData.length > 0) {
            const len = this.tableData.length - 1;
            for (let j = len; j > -1; j--) {
              if (
                this.selectedSearchTableList[i].drugId ===
                this.tableData[j].drugId
              ) {
                this.tableData.splice(j, 1);
              }
            }
          }
        }
        this.tableData = this.tableData.concat(this.selectedSearchTableList);
        this.$refs.singleTable.doLayout();
        this.drugVisible = false;
      },
      //表格双击事件(如果存在历史记录，就显示前端缓存？)
      dblclick(row) {
        if (this.returninfo_main.status === "1") {
          return;
        }
        this.curTableIndex = this.tableData.findIndex(
          (item, index) => item.inId === row.inId && item.drugId === row.drugId
        );
        if (this.curTableIndex === -1) {
          return;
        }
        if (!row.drugId) {
          return;
        }
        this.drugTitleName = row.drugName + row.spec;
        this.drugVisible = true;
        let searchParams = {};
        searchParams = { ...this.pageParams
        };
        searchParams.drugId = row.drugId;
        searchParams.supplierCode = this.returninfo_main.supplierCode;
        this.searchTable = [];
        this.getDrugBatchList(searchParams);
      },
      // 新建采购单
      newAdd() {
        this.fullReset();
      },
      //过滤调空白行
      filterTableDataEmpty() {
        this.tableData = this.tableData.filter(item => {
          return item.drugId;
        });
      },
      // 重置采购明细单
      fullReset() {
        this.returninfo_main = this.$options.data().returninfo_main;
        this.tableData = this.$options.data().tableData;
      },
      //新增药品
      adddrug() {
        // debugger;
        this.filterTableDataEmpty();
        this.tableData.push({
          backQuantity: "",
          inNum: "",
          drugId: "",
          drugName: "",
          drugStock: "",
          drugUnit: "",
          expDate: "",
          inId: "",
          originCode: "",
          price: "",
          purchasePrice: "",
          spec: "",
          supplierCode: ""
        });
      },
      exportExcel() {
        let excelData = {
          title: ["退货单", "", "", "", ""],
          where: ["退货单号:" + this.returninfo_main.backNum, "", "", "", ""],
          tHeader: ["药品名称", "规格", "进价", "售价", "数量"],
          filterVal: [
            "drugName",
            "spec",
            "purchasePrice",
            "price",
            "backQuantity"
          ],
          listDate: this.tableData,
          fileName: "退货单",
          merges: ["A1:E1"]
        };
        jsonToExcel(excelData);
      },
      print() {
        let data = {};
        data.title = "退货单";
        data.num = this.returninfo_main.backNum;
        let detailList = this.tableData.map(data => {
          return {
            ...data,
            qty: data.backQuantity
          };
        });
        data.detailList = detailList;
        onPreview(data, "药库药房单据");
      },
      submitData() {
        // 提交
        this.tableData = this.tableData.filter(item => {
          return Boolean(item.drugId);
        });
        if (this.tableData.length == 0) {
          this.$message.error("申请单明细不可为空");
          return;
        }
        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否提交当前退回单?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            let saveData = {
              ...this.returninfo_main,
              totalAmt: this.totalPurchasePrice(),
              backStockDPOList: this.tableData || ""
            };

            delete saveData.entryTime;
            delete saveData.entryPersonName;
            delete saveData.submitPersonName;
            delete saveData.submitPersonTime;

            stockReturn
              .saveBackStockList(saveData)
              .then(res => {
                if (res.code == 1) {
                  this.returninfo_main = res.data;
                  this.tableData = res.data.backStockDPOList || [];
                } else {
                  this.$message.error(res.msg || "提交失败");
                }
              })
              .then(() => {
                let backId = this.returninfo_main.id;
                stockReturn
                  .submitBackStockList(backId)
                  .then(res => {
                    this.$hideLoading();
                    done();
                    this.refreshList();
                    if (res.code === 1) {
                      this.$message({
                        type: "success",
                        message: "提交成功!"
                      });
                    } else {
                      this.$message.error(res.msg || "提交失败");
                    }
                  })
                  .catch(res => {
                    this.$hideLoading();
                    done();
                    this.$message.error(res.msg || "提交失败");
                  });
              })
              .catch(res => {
                this.$hideLoading();
                done();
                this.$message.error(res.msg || "提交失败");
              });
          }
        });
      },
      //保存退回单
      save() {
        //过滤掉空白行
        this.tableData = this.tableData.filter(item => {
          return Boolean(item.drugId);
        });
        if (this.tableData.length == 0) {
          this.$message.error("申请单明细不可为空");
          return;
        }
        let saveData = {
          ...this.returninfo_main,
          totalAmt: this.totalPurchasePrice(),
          backStockDPOList: this.tableData || ""
        };

        delete saveData.entryTime;
        delete saveData.entryPersonName;
        delete saveData.submitPersonName;
        delete saveData.submitPersonTime;
        this.$confirmFunc({
          titleText: "提示",
          contentText: "是否保存当前退回单?",
          confirm: (action, instance, done) => {
            this.$showLoading();
            stockReturn
              .saveBackStockList(saveData)
              .then(res => {
                this.$hideLoading();
                done();
                if (res.code === 1) {
                  this.returninfo_main = res.data;
                  this.tableData = res.data.backStockDPOList || [];
                  this.refreshList();
                  this.$message({
                    type: "success",
                    message: "保存成功!"
                  });
                } else {
                  this.$message.error(res.msg || "保存失败");
                }
              })
              .catch(res => {
                this.$hideLoading();
                done();
                this.$message.error(res.msg || "保存失败");
              });
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
          contentText: "是否删除当前退回明细?",
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
      textValue(e, index) {
        let item = this.tableData[index];
        this.validateResult = new RegExp("^[1-9][0-9]*$").test(e.target.value);
        if (!this.validateResult) {
          this.$message.warning("请输入正整数");
          e.target.value = "";
        }
        let thnum = outfitToBluk(item.thOut, item.thBl, item.packQuantity);
        console.log(this.tableData[index].drugStock);
        if(thnum > this.tableData[index].drugStock){
            this.$message.error("退还数量不得大于库存量");
            e.target.value = "";
        }else{
          this.$set(this.tableData[index], "backQuantity", thnum);
        }

        this.$nextTick(() => {
          this.totalPurchasePrice();
        });
      },
      // 弹窗输入校验
      textValueDia(e, index) {
        this.validateResult = new RegExp("^[1-9][0-9]*$").test(e.target.value);
        if (!this.validateResult) {
          this.$message.warning("请输入正整数");
          e.target.value = "";
        }
        let bluk = outfitToBluk(
          this.searchTable[index].thOut,
          this.searchTable[index].thBl,
          this.searchTable[index].packQuantity
        );
        if(bluk > this.searchTable[index].drugStock){
            this.$message.error("退还数量不得大于库存量");
            e.target.value = "";
        }else{
          this.$set(this.searchTable[index], "backQuantity", bluk);
        }
        
      },
      // 修改批次
      editBatch() {
        if (this.currentRowMain) {
          this.dblclick(this.currentRowMain);
        } else {
          this.$message.warning("请选择要修改的批次!");
        }
      },
      // 获取药品输入查询组件传过来的药品数据
      getSearchData(row, index) {
        this.curTableIndex = index;
        this.drugTitleName = row.drugName + row.spec;
        this.drugVisible = true; //打开药品批次列表弹框
        let searchParams = {
          ...this.pageParams,
          drugId: row.drugId,
          supplierCode: this.returninfo_main.supplierCode
        };
        this.searchTable = [];
        this.getDrugBatchList(searchParams);
      },
      supChange(val) {
        this.tableData = [];
      }
    }
  };
</script>
<style lang="scss" scoped>
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

    .shadow {
      left: 0;
      top: 0;
      background: $l-color-black;
      opacity: 0.05;
      transition: all 2s;
      z-index: 999;
    }

    .title {
      text-align: center;
      font-weight: $l-font-weight;
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .returninfo {
      &>.el-row {
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

  .table-btn {
    .el-button {
      padding: 0;
      color: $l-color-black;
      font-weight: normal;
    }
  }
</style>
