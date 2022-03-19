<template>
  <div>
    <l-dialog :visible="true" title="申请列表" class="body-main" width="90%" @close="Close" :close-on-click-modal="false"
      :destroy-on-close="true" @confirm="saveData" @cancel="Close" :showConfirmButton="isNewAdd">
      <template #content>
        <div class="three-column">
          <!--left-->
          <div id="left" class="column" ref="left">
            <div class="box">
              <el-card class="height100" shadow="never">
                <!-- 搜索条件 -->
                <!--排序-->
                <div class="sorttitle">
                  <l-sort-label class="inline-block" label="申请单号" state="2" @click="listsort('APPLY_NUM')"></l-sort-label>
                  <l-sort-label class="inline-block" label="提交时间" state="2" @click="listsort('SUBMIT_PERSON_TIME')"></l-sort-label>
                </div>
                <!--左侧表单-->
                <div class="infinite-list-wrapper">
                  <div class="list-container" v-infinite-scroll="loadNextPage" :infinite-scroll-disabled="listDisabled">
                    <div :class="curSelectedIndex == i?'list-item active':'list-item'" v-for="(item, i) in outStocklist"
                      :key="i" @click="handleSelectedItem(i,item)">
                      <!--申请单状态-->

                      <el-row class="item-label">
                        <el-col :span="24">
                          <span style="font-weight: bold;">{{item.applyNum}}</span>
                        </el-col>
                      </el-row>

                      <el-row class="item-label">
                        <el-col :span="12">
                          <span class="label margin-right-6">药库部门:</span>
                          <span columns="STORAGE_NAME" :conditionMap="{STORAGE_CODE: item.storageCode}" tableName="hrp_drgstrg"
                            v-tableTransform></span>
                        </el-col>
                      </el-row>
                      <el-row class="item-label">
                        <el-col :span="12">
                          <span class="label margin-right-6">录入人员:</span>
                          <span class="margin-right-10">{{item.entryPersonName}}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="label margin-right-6">提交人员:</span>
                          <span class="margin-right-10">{{item.submitPersonName}}</span>
                        </el-col>
                      </el-row>
                      <el-row class="item-label">
                        <el-col :span="24">
                          <span class="label margin-right-6">录入时间:</span>
                          <span>{{item.entryTime}}</span>
                        </el-col>
                      </el-row>
                      <el-row class="item-label">
                        <el-col :span="24">
                          <span class="label margin-right-6">提交时间:</span>
                          <span>{{item.submitPersonTime}}</span>
                        </el-col>
                      </el-row>
                    </div>
                    <p v-if="loading" class="load-list-bottom">{{$t('base.loading')}}</p>
                    <p v-if="!loading && noMore" class="load-list-bottom">{{$t('base.noMore')}}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
          <!--center-->
          <div id="center" class="column">
            <div class="box">
              <el-card class="height100" shadow="never">
                <!-- 顶部按钮 -->
                <el-row class="top-btn" :gutter="5">
                  <el-col :span="4">
                    <el-select v-model="rightSeach.inventory" placeholder="库存状态" style="width:100%;">
                      <el-option v-for="item in inventorylist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3">
                    <el-button type="primary" size="small" plain @click="rightseach()">标记</el-button>
                  </el-col>
                  <el-col :span="17">
                    <el-checkbox v-model="rightSeach.checkedstat" @change="onlynone()">只标记未处理记录</el-checkbox>
                  </el-col>
                </el-row>
                <div class="padding20 tablediv">
                  <el-row style="margin-bottom:20px;" :gutter="10">
                    <el-col :span="6">
                      <el-select clearable v-model="rightSeach.storageType" placeholder="请选择出库方式" style="width:100%;">
                        <el-option v-for="item in storageTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="2">
                      <el-button type="primary" size="small" plain @click="outStocktype">确定</el-button>
                    </el-col>
                  </el-row>
                  <el-row class="tablerow">
                    <l-tab-change :tableData="tableData" style=" height:100%;">
                      <el-table ref="tableData" :data="tableData" border stripe style="width: 100%;" height="100%"
                        @selection-change="handleSelectionChange" v-loading="tableListLoading">
                        <el-table-column align="center" type="selection" width="40"></el-table-column>
                        <el-table-column prop="drugName" label="药品名称" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="spec" label="规格" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="purchasePrice" label="进价" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="price" label="售价" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="drugStock" label="库存数" min-width="100">
                          <template slot-scope="scope">
                            <span>{{scope.row.outfit}}</span>
                            <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                            <template v-if="scope.row.bluk !== 0">
                              {{scope.row.bluk}}
                              <span :val="scope.row.packUnit" code="DrugUnit" v-codeTransform></span>
                            </template>
                          </template>
                        </el-table-column>
                        <el-table-column prop="applyQuantity" label="请领数" min-width="100">
                          <template slot-scope="scope">
                            <span>{{scope.row.qlOut}}</span>
                            <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                          </template>
                        </el-table-column>
                        <el-table-column label="库发数" min-width="120">
                          <template slot-scope="scope">
                            <div class="noWrap">
                              <el-input v-model="scope.row.kfOut" @keyup.native="textValue($event,scope.$index)"></el-input>
                              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="采购数" min-width="120">
                          <template slot-scope="scope">
                            <div class="noWrap">
                              <el-input v-model="scope.row.cgOut" @keyup.native="textValue($event,scope.$index)"></el-input>
                              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="备注" min-width="200" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.recordRemark"></el-input>
                          </template>
                        </el-table-column>
                      </el-table>
                    </l-tab-change>
                  </el-row>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </template>
    </l-dialog>
  </div>
</template>

<script>
  import stock from "@/api/hmm/stock";
  import hmmBaseApi from "@/api/hmm/base";
  import itemMixin from "@/mixins/drugLeftChange.js";
  import {
    watch
  } from "fs";
  import {
    blukToOutfit,
    outfitToBluk
  } from "@/utils/drugManagement.js";
  import {
    mapGetters
  } from "vuex";

  export default {
    mixins: [itemMixin],
    props: ["modelVisible", "id", "state", "applyId", "isNewAdd"],
    data() {
      return {
        inventorylist: [{
            label: "取消标记",
            value: "0"
          },
          {
            label: "库存充足",
            value: "1"
          },
          {
            label: "库存不足",
            value: "2"
          }
        ],
        storageTypelist: [
          // "充足部分库发，不足不处理"包括了"全部出库"情况，所以暂时先屏蔽
          // {
          //   label: "全部出库",
          //   value: "0"
          // },
          {
            label: "全部采购",
            value: "1"
          },
          {
            label: "充足部分库发，不足不处理",
            value: "2"
          },
          {
            label: "充足部分库发，不足进行采购",
            value: "3"
          }
        ], //出库类型数据源

        drugVisible: false,
        tableLoading: false,
        //搜索条件
        formSearch: {
          formSearch: "" //提示文字
        },

        rightSeach: {
          inventory: "", //库存状态
          storageType: "", //出库方式
          checkedstat: false //只显示未处理记录
        },
        curSelectedIndex: 0,
        outStocklist: [], // 申请列表
        loading: false, //左侧申请列表滑动加载状态
        tableData: [], // 申请表格详情
        curSelectTableList: [], // 当前已经选中的item

        selectApplyData: {},
        pageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共页数
          pageSize: 10 // 每页数据条数
        },
        orderBy: "SUBMIT_PERSON_TIME DESC",
        sloading: false,
        tableListLoading: false
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
      }
    },
    created() {
      this.search();
    },
    methods: {
      //左侧菜单搜索方法
      //左侧菜单默认点选中状态
      //如果id为空 则渲染全部申请单，，如果有id 则只渲染该条
      //页面初始化搜索
      search() {
        let ndata;
        if (this.applyId) {
          ndata = {
            id: this.applyId
          };
        } else {
          ndata = {
            type: "0",
            status: "1"
          };
        }
        let queryData = {
          ...this.pageParams,
          orderBy: this.orderBy,
          ...ndata,
          storageCode: this.currentStorageCode
        };
        this.loading = true;
        stock
          .getApplyList(queryData)
          .then(res => {
            if (res.code == 1) {
              if (this.pageParams.pageNo === 1) {
                this.outStocklist = res.data;
                this.handleSelectedItem(0, this.outStocklist[0] || {});
              } else {
                this.outStocklist = this.outStocklist.concat(res.data);
              }
              this.pageParams = res.pageParams;
            } else {
              this.$message.error(res.msg || "获取申请单数据失败");
            }
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.msg || "获取申请单数据失败");
          });
      },
      // 加载下一页
      loadNextPage() {
        if (this.noMore) {
          return;
        }
        this.pageParams.pageNo++;
        this.search();
      },
      handleSelectedItem(index, item) {
        this.selectApplyData = item;
        this.curSelectedIndex = index;
        this.getApplyListDetail(item.id);
      },
      textValue(e, index) {
        let validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
        if (!validateResult) {
          e.target.value = "";
        }
        this.drugOutToBl(index);
      },
      resetTableSelection() {
        /**
         * 表格内数据发生变化后勾选状态会取消
         * 用selectList存储一下上一次勾选的行
         * 然后跟tableData对比重新勾选上
         */
        const selectList = [...this.curSelectTableList];
        this.$nextTick(() => {
          this.tableData.forEach(it => {
            const chooseItemIndex = selectList.findIndex(
              ele => ele.drugId === it.drugId
            );
            if (chooseItemIndex > -1) {
              this.$refs.tableData.toggleRowSelection(it, true);
            }
          });
        });
      },
      // 整装数量转散装数量
      drugOutToBl(index) {
        const item = this.tableData[index];
        let kfBl = outfitToBluk(item.kfOut, 0, item.packQuantity);
        let cgBl = outfitToBluk(item.cgOut, 0, item.packQuantity);
        this.$set(this.tableData, index, {
          ...this.tableData[index],
          outQuantity: kfBl,
          purchaseQuantity: cgBl
        });
        this.resetTableSelection();
      },
      // 散装数量整转装数量
      drugBlToOut() {
        this.tableData.forEach((item, index) => {
          let kfOut = blukToOutfit(item.outQuantity, item.packQuantity).out;
          let cgOut = blukToOutfit(item.purchaseQuantity, item.packQuantity).out;
          this.$set(this.tableData, index, {
            ...this.tableData[index],
            kfOut: kfOut,
            cgOut: cgOut
          });
        });
        this.resetTableSelection();
      },
      //获取申请单明细
      getApplyListDetail(id) {
        this.tableListLoading = true;
        stock
          .getApplyDetail(id)
          .then(res => {
            if (res.code == 1) {
              let list = res.data.map(drugWapper => {
                // 库存数
                let {
                  out,
                  bl
                } = blukToOutfit(
                  drugWapper.drugStock,
                  drugWapper.packQuantity
                );
                // 请领数
                let qlOut = blukToOutfit(
                  drugWapper.applyQuantity,
                  drugWapper.packQuantity
                ).out;
                // 库发数
                let kfOut = blukToOutfit(
                  drugWapper.outQuantity,
                  drugWapper.packQuantity
                ).out;
                // 采购数
                let cgOut = blukToOutfit(
                  drugWapper.purchaseQuantity,
                  drugWapper.packQuantity
                ).out;
                return {
                  ...drugWapper,
                  drugStock: drugWapper.drugStock || 0,
                  purchasePrice: drugWapper.purchasePrice || 0,
                  price: drugWapper.price || 0,
                  outfit: out,
                  bluk: bl,
                  qlOut: qlOut,
                  kfOut: kfOut,
                  cgOut: cgOut,
                  outQuantity: drugWapper.outQuantity || 0,
                  purchaseQuantity: drugWapper.purchaseQuantity || 0
                };
              });
              this.tableData = list;
              this.tableListLoading = false;
            } else {
              this.tableListLoading = false;
              this.$message.error(res.msg || "获取申请单明细数据失败");
            }
          })
          .catch(res => {
            this.$message.error(res.msg || "获取申请单明细数据失败");
          });
      },
      // 右侧边栏根据库存状态勾选事件
      rightseach() {
        let _this = this;
        let inventory = _this.rightSeach.inventory;
        // this.$refs.tableData.clearSelection();
        if (inventory == "1") {
          this.$refs.tableData.clearSelection();
          _this.tableData.forEach((item, index) => {
            if (parseInt(item.drugStock) >= parseInt(item.applyQuantity)) {
              _this.$refs.tableData.toggleRowSelection(_this.tableData[index]);
              let returnTop = _this.tableData[index];
              _this.tableData.splice(index, 1);
              _this.tableData.unshift(returnTop);
            }
          });
        }
        if (inventory == "2") {
          this.$refs.tableData.clearSelection();
          _this.tableData.forEach((item, index) => {
            if (parseInt(item.drugStock) < parseInt(item.applyQuantity)) {
              _this.$refs.tableData.toggleRowSelection(_this.tableData[index]);
              let returnTop = _this.tableData[index];
              _this.tableData.splice(index, 1);
              _this.tableData.unshift(returnTop);
            }
          });
        }
        if (inventory == "0") {
          this.$refs.tableData.clearSelection();
        }
      },
      //只显示未处理记录
      onlynone() {
        let _this = this;
        if (_this.rightSeach.checkedstat == false) {
          this.$refs.tableData.clearSelection();
        } else {
          this.$refs.tableData.clearSelection();
          _this.tableData.forEach((item, index) => {
            if (
              item.outQuantity == 0 &&
              item.purchaseQuantity == 0 &&
              !item.recordRemark
            ) {
              _this.$refs.tableData.toggleRowSelection(_this.tableData[index]);
              let returnTop = _this.tableData[index];
              _this.tableData.splice(index, 1);
              _this.tableData.unshift(returnTop);
            }
          });
        }
      },
      //出库方式
      outStocktype() {
        let _this = this;
        let storageType = _this.rightSeach.storageType;
        //全部出库
        if (storageType == "0") {
          _this.curSelectTableList.forEach(item => {
            item.outQuantity = item.applyQuantity;
            item.purchaseQuantity = "0";
            item.recordRemark = "全部出库";
          });
        }
        //全部采购
        if (storageType == "1") {
          _this.curSelectTableList.forEach(item => {
            item.outQuantity = "0";
            // item.recordRemark = "";
            item.purchaseQuantity = "0";
            item.purchaseQuantity = item.applyQuantity;
            item.recordRemark = "全部采购";
          });
        }
        //充足部分库发，不足不处理
        if (storageType == "2") {
          _this.curSelectTableList.forEach(item => {
            item.outQuantity = "0";
            item.recordRemark = "";
            item.purchaseQuantity = "0";
            if (item.applyQuantity >= item.drugStock) {
              item.outQuantity = item.drugStock;
            } else {
              item.outQuantity = item.applyQuantity;
            }
            item.recordRemark = "充足部分库发，不足不处理";
          });
        }
        //充足部分库发，不足进行采购
        if (storageType == "3") {
          _this.curSelectTableList.forEach(item => {
            if (item.applyQuantity >= item.drugStock) {
              item.outQuantity = item.drugStock;
            } else {
              item.outQuantity = item.applyQuantity;
            }
            item.purchaseQuantity = (item.applyQuantity - item.drugStock >= 0) ? (item.applyQuantity - item.drugStock) :
              0;
            // item.purchaseQuantity = item.applyQuantity - item.drugStock
            console.log(item.purchaseQuantity)
            item.recordRemark = "充足部分库发，不足进行采购";
          });
        }
        this.drugBlToOut();
      },

      // 中间模块操作
      handleSelectionChange(list) {
        this.curSelectTableList = list;
      },
      Close() {
        this.$emit("emitModel", false);
      },
      // 提交
      saveData() {
        let _this = this;
        let applyPO = {};
        Object.assign(applyPO, this.selectApplyData);
        applyPO.applyDPOList = this.tableData || "";
        this.sloading = true;
        console.log(applyPO,"保存提交时候的数据");
        stock
          .outApplySubmit(applyPO)
          .then(res => {
            this.sloading = false;
            if (res.code == 1) {
              // if (
              //   res.data.outInventoryDPOList &&
              //   res.data.outInventoryDPOList.length > 0
              // ) {
               
              // } else {
              //   this.$message.warning("该药品暂无批次");
              // }
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              this.$emit("send-data", res.data);
              this.$emit("emitModel", false);
            } else {
              this.$message.error(res.msg || "保存失败");
            }
          })
          .catch(err => {
            this.sloading = false;
            this.$message.error(err.msg || "保存失败");
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .body-main {
    /deep/ .el-dialog {
      height: 70%;

      .el-dialog__body {
        height: calc(100% - 136px);
      }

      .dialog-content {
        height: 100%;
      }
    }
  }

  /deep/.el-input-number {
    width: 100%;

    .el-input-number__increase,
    .el-input-number__decrease {
      width: 20px;
    }

    .el-input {
      .el-input__inner {
        padding-left: 10px;
        padding-right: 0;
        text-align: left;
      }
    }
  }

  $leftWidth: 440px;
  $rightWidth: 287px;

  .three-column {
    min-width: 1024px;
    height: 100%;
    padding: 20px;
    clear: both;

    .column {
      height: 100%;

      .box {
        height: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        width: 100%;

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
          top: 34px;
          bottom: 0;
          width: 100%;
        }
      }
    }

    #center {
      margin-left: $leftWidth;
    }

    #right {
      margin-right: -$rightWidth;
      width: $rightWidth;
      padding-right: 0;
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

          .state {
            position: absolute;
            right: 10px;
            top: 10px;
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

  .el-input__suffix {
    top: 10px;
    right: 10px;

    i {
      font-style: normal;
    }
  }

  .noWrap {
    white-space: nowrap;

    .el-input {
      width: 80px;
    }
  }
</style>
