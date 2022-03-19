<template>
  <el-card class="height100 position-relative width100" style="padding:16px;">
    <!-- 退货单详情 -->
    <div class="details">
      <!-- 顶部按钮 -->
      <div class="returninfo">
        <el-row :gutter="6" class="infotext" style="margin-bottom: 8px;">
          <el-col :span="6">
            <span>退货单号：{{ returninfo_main.outInventoryNum || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>退货来源：</span>
            <span
              columns="STORAGE_NAME"
              :conditionMap="{ STORAGE_CODE: returninfo_main.deptCode }"
              tableName="hrp_drgstrg"
              v-tableTransform
            ></span>
          </el-col>
          <el-col :span="6">
            <span>药库：</span>
            <span
              columns="STORAGE_NAME"
              :conditionMap="{ STORAGE_CODE: returninfo_main.storageCode }"
              tableName="hrp_drgstrg"
              v-tableTransform
            ></span>
          </el-col>
          <el-col :span="6">
            <span>总进价金额：{{ formatNum(totalPrice) }}元</span>
          </el-col>
        </el-row>
        <el-row :gutter="6" class="infotext" style="margin-bottom: 16px;">
          <el-col :span="6">
            <span>录入人员：{{ returninfo_main.entryPersonName || "--" }}</span>
          </el-col>
          <el-col :span="6">
            <span>录入时间：{{ returninfo_main.entryTime || "--" }}</span>
          </el-col>
          <el-col :span="6" v-if="returninfo_main.status !== '0'">
            <span>提交人员：{{ returninfo_main.submitPersonName || "--" }}</span>
          </el-col>
          <el-col :span="6" v-if="returninfo_main.status !== '0'">
            <span>提交时间：{{ returninfo_main.submitPersonTime || "--" }}</span>
          </el-col>
        </el-row>
        <el-row  style="margin-bottom: 0px;">
          <el-col :span="12">
            <span
              class="float-left cursor-pointer margin-right-10"
              @click="changelist"
              v-if="returninfo_main.status !== '1'"
              v-hotKey="{ func: 'func_add2' }"
            >
              <i class="filter-item iconfont icontijiao"></i> 退货申请明细
            </span>
          </el-col>
        </el-row>
        <!-- 退货单table -->
        <el-row
          class="tablerow position-absolute"
          style="bottom: 76px;left: 16px;right: 16px;"
          :style="
            returninfo_main.status !== '1' && returninfo_main.status !== '2'
              ? 'top:103px'
              : 'top:70px'
          "
        >
          <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            @current-change="handleCurrentChange"
            border
            stripe
            v-loading="tableLoading"
            style="width: 100%"
            height="100%"
          >
            <el-table-column prop="drugName" min-width="230" label="药品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spec" label="规格" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="purchasePrice" align="right" label="进价(元)" width="120">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="售价(元)" align="right" width="120">
              <template slot-scope="scope">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="drugStock" label="库存量" width="150">
              <template slot-scope="{row}">
                <span>
                  {{ row.outfit }}
                  <span :val="row.drugUnit" code="DrugUnit" v-codeTransform></span>
                </span>
                <span v-if="row.bluk !== 0">
                  {{ row.bluk }}
                  <span :val="row.packUnit" code="DrugUnit" v-codeTransform></span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="outQuantity" label="退还数量" width="240">
              <template slot-scope="scope">
                <!-- 先改为不用输入框 v-if="true|| -->
                <template v-if="true||returninfo_main.status === '1'">
                  <span>
                    {{ scope.row.thOut }}
                    <span
                      :val="scope.row.drugUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </span>
                  <span v-if="scope.row.thBl !== 0">
                    {{ scope.row.thBl }}
                    <span
                      :val="scope.row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </span>
                </template>
                <div v-else class="noWrap">
                  <el-input
                    v-model="scope.row.thOut"
                    @keyup.native="textValueDia($event,scope.$index,'thOut')"
                  ></el-input>
                  <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  <template v-if="scope.row.unitSaleFlg === '1'">
                    <el-input
                      v-model="scope.row.thBl"
                      @keyup.native="textValueDia($event,scope.$index,'thBl')"
                    ></el-input>
                    <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="recordRemark" label="退还原因" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="处置意见" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-show="scope.row.status == '0'">拒绝申请</span>
                <span v-show="scope.row.status == '1'">退回药库</span>
                <span v-show="scope.row.status == '2'">退还供应商</span>
              </template>
            </el-table-column>
            <el-table-column label="供应商" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <span :val="scope.row.supplierCode" code="DrugSupplier" v-codeTransform></span>
              </template>
            </el-table-column>
            <el-table-column prop="batchNum" label="生产批号" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="进价总额(元)" align="right" width="140">
              <template slot-scope="scope">
                <span>{{ formatNum(Math.round(scope.row.purchasePrice * 100 * scope.row.outQuantity / scope.row.packQuantity) / 100) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="售价总额(元)" align="right" width="140">
              <template slot-scope="scope">
                <span>{{ formatNum(Math.round(scope.row.price * 100 * scope.row.outQuantity / scope.row.packQuantity) / 100) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </div>
    <div class="bottom-btn height-button-bottom">
      <el-button
      :disabled="!tableData.length"
        class="less-btn float-left"
        type="primary"
        plain
        @click="print"
        v-hotKey="{ func: 'func_print' }"
      >打印</el-button>
      <el-button :disabled="!tableData.length" class="less-btn float-left" type="primary" plain @click="exportExcel">导出</el-button>
      <el-button
        class="less-btn float-right"
        type="primary"
        @click="submitData"
        v-if="returninfo_main.status == '0'"
        v-hotKey="{ func: 'func_submit' }"
      >提交</el-button>
      <el-button
        class="less-btn float-right"
        type="primary"
        plain
        @click="save"
        v-if="returninfo_main.status !== '1' && returninfo_main.status !== '2'"
        v-hotKey="{ func: 'func_save' }"
      >保存</el-button>
    </div>
    <!-- 申请列表弹窗 -->
    <renturnlist
      v-if="modelVisible"
      :fromType="renturnListType"
      :returninfoMain="returninfo_main"
      :modelVisible="modelVisible"
      @emitModel="emitModel"
      @func="getMsgFormSon"
    ></renturnlist>
  </el-card>
</template>

<script>
import Renturnlist from "./component/renturnlist";
import stock from "@/api/hmm/stock";
import { localCodeTransform } from "@/utils/util";
import { deepClone } from "@/utils/index.js";
import mixin from "@/mixins/drugManagement.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  components: {
    Renturnlist
  },
  props: {
    // 患者卡片类型
    returninfo: {
      type: Object
    }
  },
  mixins: [mixin],
  data() {
    return {
      tableLoading: false,
      //申请列表弹窗默认关闭
      modelVisible: false,
      //renturnList 组件 新增状态
      renturnListType: "1",
      status: "",
      recordStatusList: [
        // 筛选状态列表
        {
          label: "未提交",
          value: "1"
        },
        {
          label: "已提交",
          value: "2"
        },
        {
          label: "全部",
          value: "0"
        }
      ],
      returninfo_main: {
        status: "",
        applyId: "",
        deptCode: "",
        id: "",
        outInventoryNum: "",
        outType: "",
        storageCode: "",
        storageId: "",
        submitPersonName: "",
        submitPersonTime: "",
        entryPersonName: "",
        entryTime: "",
        totalAmt: "",
        isEditing: true // 是否为编辑状态
      },
      totalPrice: 0,
      tableData: [], // 申请表格详情
      curSelectTableList: [] // 当前已经选中的item
    };
  },
  computed: {
    isShadow() {
      if (this.returninfo_main.outType !== "2") {
        return (
          this.returninfo_main.outType !== "" &&
          this.returninfo_main.deptCode !== ""
        );
      }
      return this.returninfo_main.outType !== "";
    }
  },
  watch: {
    returninfo: {
      handler(val) {
        if (val && val.id) {
          this.returninfo_main = { ...val };
          this.getOutStockListD(val.id);
        } else {
          this.returninfo_main = this.$options.data().returninfo_main;
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
  methods: {
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
    refreshList() {
      this.returninfo_main = this.$options.data().returninfo_main;
      this.tableData = this.$options.data().tableData;
      this.$refs.singleTable && this.$refs.singleTable.setCurrentRow({});
      this.$emit("search");
    },
    //查询明细
    getOutStockListD(id) {
      this.tableLoading = true;
      stock
        .getOutStockListDetail(id)
        .then(res => {
          if (res.code == 1) {
            let list = res.data.map(item => {
              let { out, bl } = blukToOutfit(item.drugStock, item.packQuantity);
              let thnum = blukToOutfit(item.outQuantity, item.packQuantity);
              return {
                ...item,
                outfit: out,
                bluk: bl,
                thOut: thnum.out,
                thBl: thnum.bl
              };
            });
            this.tableData = list;
            this.$refs.singleTable &&
              this.$refs.singleTable.setCurrentRow(list[0]);
          } else {
            this.$message.error(res.msg || "获取入库单明细数据失败");
          }
          this.tableLoading = false;
        })
        .catch(res => {
          this.tableLoading = false;
          this.$message.error(res.msg || "获取入库单明细数据失败");
        });
    },

    handleSelectionChange(list) {
      // 选中表格
      this.curSelectTableList = list;
    },

    //修改退货明细
    changelist() {
      if (this.returninfo_main.status == 1) {
        this.$message.warning("当前单号已提交不可修改明细");
        return;
      }
      if (this.returninfo_main.status == 0) {
        this.modelVisible = true;
      }

      this.renturnListType = "2";// 编辑模式
    },

    // 退货列表
    applYlist() {
      this.returninfo_main = this.$options.data().returninfo_main;
      this.tableData = this.$options.data().tableData;
      this.modelVisible = true;
      this.renturnListType = "1";// 新增状态
    },
    // 监测弹窗是否关闭
    emitModel(res) {
      this.modelVisible = res;
    },
    exportExcel() {
      let excelData = {
        title: ["退货单", "", "", "", ""],
        where: [
          "退货单号:" + this.returninfo_main.outInventoryNum,
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
        fileName: "退货单",
        merges: ["A1:E1"]
      };
      jsonToExcel(excelData);
    },
    print() {
      let data = {};
      data.title = "退货单";
      data.num = this.returninfo_main.outInventoryNum;
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
      this.tableData = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      if (this.tableData.length == 0) {
        this.$message.error("申请单明细不可为空");
        return;
      }
      const zeroIndex = this.tableData.findIndex(item => {
        return !item.outQuantity;
      });
      if (zeroIndex > -1) {
        this.$refs.singleTable.setCurrentRow(this.tableData[zeroIndex]);
        this.$message.warning("请输入正确的退还数量!");
        return;
      }
      let saveData = {
        ...this.returninfo_main,
        outType: "6",
        totalAmt: this.totalPurchasePrice(),
        outInventoryDPOList: this.tableData || ""
      };

      delete saveData.entryTime;
      delete saveData.entryPersonName;
      delete saveData.submitPersonName;
      delete saveData.submitPersonTime;

      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否提交当前退货单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stock
            .addrenDis(saveData)
            .then(res => {
              if (res.code === 1) {
                let submitId = this.returninfo_main.id;
                stock
                  .submitrenDis(submitId)
                  .then(resp => {
                    done();
                    this.$hideLoading();
                    this.refreshList();
                    if (resp.code === 1) {
                      this.$message.success(resp.msg || "提交成功!");
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
      // 保存
      this.tableData = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      if (this.tableData.length == 0) {
        this.$message.error("申请单明细不可为空");
        return;
      }
      //
      this.tableData.filter(item => {
        return item.status != '0'
      })
      this.tableData.forEach(item => {
        item.applyDId = item.id;
      })
      //
      let saveData = {
        ...this.returninfo_main,
        totalAmt: this.totalPurchasePrice(),
        outInventoryDPOList: this.tableData || "",
        outType: "6",
        applyId: this.returninfo_main && this.tableData[0].applyId
      };

      delete saveData.entryTime;
      delete saveData.entryPersonName;
      delete saveData.submitPersonName;
      delete saveData.submitPersonTime;

      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否保存当前退货单?",
        confirm: (action, instance, done) => {
          this.$showLoading();
          stock
            .addrenDis(saveData)
            .then(res => {
              if (res.code === 1) {
                done();
                this.$hideLoading();
                this.returninfo_main = res.data;
                this.tableData = res.data.outInventoryDPOList || [];
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
              done();
              this.$hideLoading();
              this.$message.error(res.msg || "保存失败");
            });
        }
      });
    },
    //子父组件传值
    getMsgFormSon(data) {
      this.tableData = [];
      let _data = data.tableData.map(item => {
        let { out, bl } = blukToOutfit(item.drugStock, item.packQuantity);
        let thnum = blukToOutfit(item.applyQuantity, item.packQuantity);
        return {
          ...item,
          outfit: out,
          bluk: bl,
          thOut: thnum.out,
          thBl: thnum.bl,
          outQuantity: item.applyQuantity
        };
      });
      this.tableData.push(..._data);
      this.returninfo_main.deptCode = data.returninfo_main.deptCode;
      this.returninfo_main.storageCode = data.returninfo_main.storageCode;
      if (
        this.returninfo_main.outInventoryNum &&
        this.returninfo_main.outInventoryNum.length === 0
      ) {
        this.returninfo_main.storageCode = data.returninfo_main.storageCode;
        this.returninfo_main.deptCode = data.returninfo_main.deptCode;
        this.returninfo_main.applyId = data.returninfo_main.id;
        this.returninfo_main.dataVersion = 0;
      }
    },
    textValueDia(e, index, key) {
      let validValue = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!validValue) {
        e.target.value = "";
        this.$set(this.tableData[index], key, "");
      }
      let num = outfitToBluk(
        this.tableData[index].thOut,
        this.tableData[index].thBl,
        this.tableData[index].packQuantity
      );
      num = num === 0 ? "" : num;
      this.$set(this.tableData[index], "outQuantity", num);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
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
  }

  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .returninfo {
    & > .el-row {
      // margin-top: 10px;

      .disabled {
        background: $l-color-bgcolor-18;
      }
    }

    .infotext {
      // line-height: 36px;
    }
  }
  .noWrap {
    white-space: nowrap;
    .el-input {
      width: 80px;
    }
  }
}
</style>
