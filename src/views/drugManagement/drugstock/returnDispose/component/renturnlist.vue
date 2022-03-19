<template>
  <l-dialog
    :visible="modelVisible"
    title="申请列表"
    width="80%"
    @close="Close"
    :close-on-click-modal="false"
    :customBottom="true"
  >
    <template #content>
      <div class="three-column">
        <!--left-->
        <div id="left" class="column" ref="left">
          <div class="box" style="width: auto">
            <el-card class="height100" shadow="never">
              <!-- 搜索条件 -->
              <div
                class="searchdiv"
                v-if="returninfo_dig.status !== '0'"
                style="padding: 20px 20px 0 10px; margin-bottom: 10px"
              >
                <el-row style="margin-bottom: 10px">
                  <el-col :span="24">
                    <!-- 录入日期 -->
                    <l-formt-title label="提交时间" labelWidth="64">
                      <el-date-picker
                        style="width: 100%"
                        :clearable="false"
                        v-model="formSearch.entryTime"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </l-formt-title>
                  </el-col>
                </el-row>
                <el-row :gutter="6" style="margin-bottom: 10px">
                  <el-col :span="12">
                    <!--出库部门  -->
                    <l-formt-title label="申请部门" labelWidth="64">
                      <el-select
                        clearable
                        v-model="formSearch.storageCode"
                        placeholder
                      >
                        <el-option
                          v-for="item in drugStorageList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </l-formt-title>
                  </el-col>
                  <el-col :span="12">
                    <!-- 单号 -->
                    <l-formt-title label="单号" labelWidth="64">
                      <el-input v-model="formSearch.applyNum"></el-input>
                    </l-formt-title>
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: 10px">
                  <el-col style="text-align: right">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" plain @click="reast"
                      >重置</el-button
                    >
                  </el-col>
                </el-row>
              </div>
              <!--排序-->
              <div class="sorttitle" v-if="returninfo_dig.status !== '0'">
                <l-sort-label
                  class="inline-block"
                  label="退药单号"
                  state="2"
                  @click="listsort('APPLY_NUM')"
                ></l-sort-label>
                <l-sort-label
                  class="inline-block"
                  label="出库部门"
                  state="2"
                  @click="listsort('DEPT_CODE')"
                ></l-sort-label>
                <l-sort-label
                  class="inline-block"
                  label="提交时间"
                  state="2"
                  @click="listsort('SUBMIT_PERSON_TIME')"
                ></l-sort-label>
              </div>
              <!--左侧表单-->
              <div
                class="infinite-list-wrapper"
                :style="
                  returninfo_dig.status === '0' ? 'top:10px' : 'top:200px'
                "
              >
                <div
                  class="list-container"
                  v-infinite-scroll="loadNextPage"
                  infinite-scroll-disabled="listDisabled"
                >
                  <div
                    :class="
                      curSelectedIndex == i ? 'list-item active' : 'list-item'
                    "
                    v-for="(item, i) in outStocklist"
                    :key="i"
                    @click="handleSelectedItem(i, item)"
                  >
                    <div class="status-active" v-if="item.status == '1'">
                      在处理
                    </div>
                    <div class="status-active" v-if="item.status == '2'">
                      目标库房已保存
                    </div>

                    <!--申请单状态-->

                    <el-row class="item-label">
                      <el-col :span="24">
                        <span style="font-weight: bold">{{
                          item.applyNum
                        }}</span>
                      </el-col>
                    </el-row>

                    <el-row class="item-label">
                      <el-col :span="24">
                        <span class="label margin-right-6">申请部门:</span>
                        <span
                          columns="STORAGE_NAME"
                          :conditionMap="{ STORAGE_CODE: item.deptCode }"
                          tableName="hrp_drgstrg"
                          v-tableTransform
                        ></span>
                      </el-col>
                    </el-row>

                    <el-row class="item-label">
                      <el-col :span="10">
                        <span class="label margin-right-6">录入人员:</span>
                        <span class="margin-right-10">{{
                          item.entryPersonName
                        }}</span>
                      </el-col>
                      <el-col :span="14">
                        <span class="label margin-right-6">录入时间:</span>
                        <span>{{ item.entryTime }}</span>
                      </el-col>
                    </el-row>

                    <el-row class="item-label">
                      <el-col :span="10">
                        <span class="label margin-right-6">提交人员:</span>
                        <span class="margin-right-10">{{
                          item.submitPersonName
                        }}</span>
                      </el-col>
                      <el-col :span="14">
                        <span class="label margin-right-6">提交时间:</span>
                        <span>{{ item.submitPersonTime }}</span>
                      </el-col>
                    </el-row>
                  </div>
                  <p v-if="loading" class="load-list-bottom">
                    {{ $t("base.loading") }}
                  </p>
                  <p v-if="noMore" class="load-list-bottom">
                    {{ $t("base.noMore") }}
                  </p>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        <!--center-->
        <div id="center" class="column">
          <div class="box height100" style="width: auto">
            <el-card class="height100" shadow="never">
              <!-- 顶部按钮 -->
              <el-row class="top-btn" :gutter="20">
                <el-col :span="6">
                  <el-select
                    v-model="rightSeach.inventory"
                    placeholder="请选择处理状态"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in inventorylist"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="primary"
                    size="small"
                    plain
                    @click="rightseach()"
                    >筛选</el-button
                  >
                </el-col>
              </el-row>
              <!--  -->
              <div class="padding20 tablediv height100">
                <el-row style="margin-bottom: 20px" :gutter="20">
                  <el-col :span="6">
                    <el-select
                      v-model="rightSeach.storageType"
                      placeholder="请选择处理方式"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in storageTypelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="primary"
                      size="small"
                      plain
                      @click="outStocktype"
                      >确定</el-button
                    >
                  </el-col>
                </el-row>
                <el-row class="tablerow">
                  <el-table
                    ref="tableData"
                    :data="selectApplyData.tableData"
                    max-height="480px"
                    border
                    stripe
                    style="width: 100%"
                    height="100%"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column
                      type="selection"
                      width="40"
                      align="center"
                    ></el-table-column>
                    <el-table-column min-width="150" label="操作类型">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.status"
                          placeholder="请选择处理方式"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in storageTypelist"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                        <!-- <span v-if="scope.row.status=='0'">拒绝申请</span>
                      <span v-if="scope.row.status=='1'">退回药库</span>
                        <span v-if="scope.row.status=='2'">退回供应商</span>-->
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="drugName"
                      min-width="150"
                      label="药品名称"
                    ></el-table-column>
                    <el-table-column
                      prop="spec"
                      label="规格"
                      min-width="200"
                    ></el-table-column>
                    <el-table-column
                      prop="purchasePrice"
                      label="进价"
                      min-width="80"
                    ></el-table-column>
                    <el-table-column
                      prop="price"
                      label="售价"
                      min-width="80"
                    ></el-table-column>
                    <el-table-column
                      prop="applyQuantity"
                      label="退还数量"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.thOut }}</span>
                        <span
                          :val="scope.row.drugUnit"
                          code="DrugUnit"
                          v-codeTransform
                        ></span>
                        <template
                          v-if="
                            scope.row.unitSaleFlg === '1' &&
                            scope.row.thBl !== 0
                          "
                        >
                          <span>{{ scope.row.thBl }}</span>
                          <span
                            :val="scope.row.packUnit"
                            code="DrugUnit"
                            v-codeTransform
                          ></span>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="recordRemark"
                      label="退还原因"
                      min-width="200"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                      label="供应商"
                      min-width="200"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span
                          :val="scope.row.supplierCode"
                          code="DrugSupplier"
                          v-codeTransform
                        ></span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="batchNum"
                      label="生产批号"
                      min-width="160"
                    ></el-table-column>
                  </el-table>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </template>
    <template #footerContent>
      <el-button type="primary" size="small" plain @click="saveData"
        >暂存</el-button
      >
      <el-button type="primary" size="small" @click="submitData"
        >生成退货单</el-button
      >
      <el-button type="primary" size="small" plain @click="Close"
        >取消</el-button
      >
    </template>
  </l-dialog>
</template>

<script>
import hmmBaseApi from "@/api/hmm/base";
import stock from "@/api/hmm/stock";
import { localCodeTransform } from "@/utils/util";
import itemMixin from "@/mixins/drugLeftChange.js";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import { mapGetters } from "vuex";

export default {
  mixins: [itemMixin],
  props: {
    fromType: {
      type: String, // 1 新增 2 编辑
      default: () => {
        return "1";
      },
    },
    modelVisible: {
      type: Boolean,
    },
    returninfoMain: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      inventorylist: [
        {
          label: "全部",
          value: "0",
        },
        {
          label: "已处理",
          value: "1",
        },
        {
          label: "未处理",
          value: "2",
        },
      ], //处理状态数据源
      storageTypelist: [
        {
          label: "退还供应商",
          value: "2",
        },
        {
          label: "退回药库",
          value: "1",
        },
        {
          label: "拒绝申请",
          value: "0",
        },
      ], //处理方式数据源
      returninfo_dig: {
        status: "",
        id: "",
      },
      drugStorageList: [], //出库部门数据源
      //搜索条件
      formSearch: {
        entryTime: [], //日期
        storageCode: "", //部门
        applyNum: "", //单号
      },
      loading: false, //左侧申请列表滑动加载状态
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共条数
        pageSize: 20, // 每页数据条数
      },
      rightSeach: {
        inventory: "", //处理状态
        storageType: "", //处理方式
      },
      curSelectedIndex: 0,
      curSelecteitem: {}, //左侧当前选择数据
      outStocklist: [], // 申请列表
      // tableData: [], // 申请表格详情
      selectApplyData: {
        tableData: [],
        returninfo_main: {},
      }, //从申请单到出库单的药品批次信息
      curSelectTableList: [], // 当前已经选中的item
      orderBy: "SUBMIT_PERSON_TIME DESC",
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["currentStorageCode"]),
    listDisabled() {
      return this.loading || this.noMore;
    },
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
  },
  watch: {
    modelVisible: {
      handler(val) {
        console.log(val);
        if (val) {
          this.returninfo_dig = {
            ...this.returninfoMain,
          };
          this.getDrugStorageList();
          this.search();
        }
      },
      immediate: true,
    },
  },
  methods: {
    //获取药库数据
    getDrugStorageList() {
      hmmBaseApi
        .getCurDrugStorage()
        .then((res) => {
          if (res.code == 1) {
            let list = res.data.children.map((item) => ({
              ...item,
              code: item.pharCode,
              name: item.pharName,
            }));
            this.drugStorageList = list;
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
        })
        .catch((res) => {
          this.$message.error(res.msg || "获取药库数据失败");
        });
    },

    //获取左侧列表
    getleftlist(params) {
      let queryData = { ...this.pageParams };
      queryData.orderBy = this.orderBy; //按时间倒序
      queryData.sSubmitPersonTime =
        this.formSearch.entryTime && this.formSearch.entryTime[0]
          ? this.formSearch.entryTime[0] + " 00:00:00"
          : ""; //开始日期
      queryData.eSubmitPersonTime =
        this.formSearch.entryTime && this.formSearch.entryTime[1]
          ? this.formSearch.entryTime[1] + " 23:59:59"
          : ""; //结束日期
      queryData.deptCode = this.formSearch.storageCode;
      queryData.num = this.formSearch.applyNum;
      queryData.id = this.returninfo_dig.applyId;
      queryData.type = "1";
      queryData.statuses = this.fromType;
      queryData.storageCode = this.currentStorageCode;

      stock
        .getApplyList(queryData)
        .then((res) => {
          if (res.code == 1) {
            this.pageParams = { ...res.pageParams };
            if (this.pageParams.pageNo === 1) {
              this.outStocklist = res.data;
              if (res.data.length > 0) {
                this.handleSelectedItem(0, this.outStocklist[0] || {});
              }
            } else {
              this.outStocklist = this.outStocklist.concat(res.data);
            }
            this.loading = false;
          }
        })
        .catch((res) => {
          this.$message.error(res.msg || "申请单查询失败");
        });
    },
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getleftlist();
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getleftlist();
    },
    reast() {
      this.formSearch = this.$options.data().formSearch;
    },
    handleSelectedItem(i, item) {
      this.curSelectedIndex = i;
      this.selectApplyData.returninfo_main = item;
      this.getApplyD(item.id);
    },

    //right
    getApplyD(applyId) {
      stock
        .getApplyDetails(applyId)
        .then((res) => {
          if (res.code == 1) {
            this.selectApplyData.tableData = [];
            let list = res.data.map((drugWapper) => {
              let { out, bl } = blukToOutfit(
                drugWapper.applyQuantity,
                drugWapper.packQuantity
              );
              return {
                ...drugWapper,
                purchasePrice: drugWapper.purchasePrice || 0,
                price: drugWapper.price || 0,
                supplierCode: drugWapper.supplierCode || "--",
                thOut: out,
                thBl: bl,
              };
            });
            this.selectApplyData.tableData = list;
          } else {
            this.$message.error(res.msg || "获取申请单明细数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无申请单明细数据");
          }
        })
        .catch((res) => {
          this.$message.error(res.msg || "获取申请单明细数据失败");
        });
    },
    // 右侧边栏根据库存状态勾选事件
    rightseach() {
      let _this = this;
      let inventory = _this.rightSeach.inventory;
      if (inventory == "1") {
        this.$refs.tableData.clearSelection();
        _this.selectApplyData.tableData.forEach((item, index) => {
          if (item.status.length > 0) {
            _this.$refs.tableData.toggleRowSelection(
              _this.selectApplyData.tableData[index]
            );
            let returnTop = _this.selectApplyData.tableData[index];
            _this.selectApplyData.tableData.splice(index, 1);
            _this.selectApplyData.tableData.unshift(returnTop);
          }
        });
      }
      if (inventory == "2") {
        this.$refs.tableData.clearSelection();
        _this.selectApplyData.tableData.forEach((item, index) => {
          if (item.status == "") {
            _this.$refs.tableData.toggleRowSelection(
              _this.selectApplyData.tableData[index]
            );
            let returnTop = _this.selectApplyData.tableData[index];
            _this.selectApplyData.tableData.splice(index, 1);
            _this.selectApplyData.tableData.unshift(returnTop);
          }
        });
      }
      if (inventory == "0") {
        this.$refs.tableData.clearSelection();
        _this.selectApplyData.tableData.forEach((item, index) => {
          _this.$refs.tableData.toggleRowSelection(
            _this.selectApplyData.tableData[index]
          );
        });
      }
    },

    //只显示未处理记录
    onlynone() {},

    //选择处理方式
    outStocktype() {
      // 选择处理方式
      let _this = this;
      let storageType = _this.rightSeach.storageType;
      if (storageType == "0") {
        _this.curSelectTableList.forEach((item) => {
          item.status = "0";
        });
      }
      if (storageType == "1") {
        _this.curSelectTableList.forEach((item) => {
          item.status = "1";
        });
      }
      if (storageType == "2") {
        _this.curSelectTableList.forEach((item) => {
          item.status = "2";
        });
      }
    },

    // 中间模块操作
    handleSelectionChange(list) {
      this.curSelectTableList = list;
    },

    //保存
    saveData() {
      stock
        .postapplyDSave(this.selectApplyData.tableData)
        .then((res) => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            this.getleftlist(this.returninfo_dig.id);
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err.msg || "保存失败!",
          });
        });
    },
    // 提交
    submitData() {
      let data = [];
      this.selectApplyData.tableData.forEach((item) => {
        if (item.status != "0") {
          data.push(item);
        }
      });
      if (data.length === 0) {
        this.$message.warning("无退货单可生成!");
        return;
      }
      this.$emit("func", { ...this.selectApplyData, tableData: data });
      this.$emit("emitModel", false);
    },

    // 关闭弹窗
    Close() {
      this.$emit("emitModel", false);
    },
  },
};
</script>

<style lang="scss" scoped>
$leftWidth: 440px;
$rightWidth: 287px;
.three-column {
  height: 400px;
  padding: 20px;
  clear: both;
  overflow: hidden;
  .column {
    height: 100%;
    .box {
      height: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      .top {
        padding: 10px;
      }
      .bottom {
        padding: 10px;
      }
    }
  }
  #left {
    width: $leftWidth;
    position: relative;
    float: left;
    /deep/ .el-card__body {
      position: relative;
      .infinite-list-wrapper {
        position: absolute;
        top: 200px;
        bottom: 0;
        width: 100%;
      }
    }
  }
  #center {
    margin-left: $leftWidth;
  }
}
#left {
  position: relative;
  .el-card {
    .padding20 {
      padding: 10px 20px;
    }

    .sorttitle {
      background: $l-color-bgcolor-18;
      padding: 0 16px;
      .inline-block {
        margin-right: 5px;
      }
    }
    .list-container {
      height: 100%;
      overflow: hidden;
      overflow-y: auto;

      .list-item {
        padding: 6px 14px;
        position: relative;
        .status {
          position: absolute;
          right: 10px;
          top: 10px;
          z-index: 999;
        }

        .status-active {
          position: absolute;
          right: 10px;
          top: 10px;
          z-index: 999;
          color: $l-color-primary;
        }
        .item-label {
          line-height: 28px;
          color: $l-color-fontcolor-3;
          .label {
            display: inline-block;
            color: $l-color-fontcolor-4;
            font-size: $l-font-size;
          }
          .minwidth {
            min-width: 80px;
            display: inline-block;
          }
        }
      }
      .list-item:nth-child(even) {
        background: $l-color-bgcolor-18;
      }
      .active {
        background-color: $l-color-bgcolor-12 !important;
      }
    }
  }
}
#center {
  padding-left: 20px;
  .tablediv {
    height: calc(100% - 68px);
  }
  .tablerow {
    height: calc(100% - 56px);
  }
  .top-btn {
    height: 68px;
    line-height: 68px;
    overflow: hidden;
    padding-right: 20px;
    padding-left: 20px;
    border-bottom: 1px solid $l-color-bgcolor-11;
    .el-button--text,
    .el-button--text:hover {
      font-size: $l-font-size;
      color: $l-color-fontcolor-3;
    }
  }
  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
.bottom-container {
  text-align: center;
  padding: 20px 0px;
}
.footerrow {
  padding: 20px;
  padding-bottom: 0;
  border-top: 1px solid $l-color-bgcolor-11;
}
</style>
