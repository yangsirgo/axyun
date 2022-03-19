<template>
  <l-layout
    :boxExpanded="false"
    :isToolBox="false"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
  >
    <template #list>
      <el-card class="height100">
        <div class="left-box">
          <div class="left-form">
            <div :style="{ display: 'flex' }">
              <l-formt-title class="mb5" label="患者卡号">
                <el-input
                  v-model="searchParams.cardData"
                  placeholder="请输入"
                ></el-input>
              </l-formt-title>
              <el-button
                :style="{ marginLeft: '5px' }"
                type="primary"
                @click="readCard"
                >读卡</el-button
              >
            </div>
            <l-formt-title class="mb5" label="患者编号">
              <el-input
                v-model="searchParams.patientCode"
                placeholder="请输入"
              ></el-input>
            </l-formt-title>
            <l-formt-title class="mb5" label="医保类别">
              <l-value-domain
                :value.sync="searchParams.medicareType"
                remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                remoteShowKey="dictName"
                remoteValueKey="dictCode"
                placeholder="请选择"
              ></l-value-domain>
            </l-formt-title>
            <l-formt-title class="mb5" label="门诊号">
              <el-input
                v-model="searchParams.visitCode"
                placeholder="请输入"
              ></el-input>
            </l-formt-title>
            <l-formt-title class="mb5" label="收费开始时间">
              <el-date-picker
                v-model="searchParams.startChargeTime"
                type="datetime"
                default-time="00:00:00"
                placeholder="选择日期时间"
              ></el-date-picker>
            </l-formt-title>
            <l-formt-title class="mb5" label="收费结束时间">
              <el-date-picker
                v-model="searchParams.endChargeTime"
                type="datetime"
                default-time="23:59:59"
                placeholder="选择日期时间"
              ></el-date-picker>
            </l-formt-title>
            <div class="buttonArea">
              <el-button
                style="width: 120px"
                type="primary"
                plain
                @click="search"
                >查询</el-button
              >
              <el-button style="width: 120px" type="primary" @click="reSet"
                >重置</el-button
              >
            </div>
          </div>
          <div class="left-table">
            <l-table
              :paginationSmall="true"
              :total="pageParams.total"
              :pageSize.sync="pageParams.pageSize"
              :page.sync="pageParams.pageNo"
              layout="pager"
              :pagerCount="5"
              paginationAlign="center"
              :singlePageShow="true"
              @changeSize="handleSizeChange"
            >
              <el-table
                ref="listTable"
                :data="tableData"
                stripe
                border
                width="100%"
                height="100%"
                highlight-current-row
                @row-click="rowClick"
                @header-dragend="headerDragend"
              >
                <el-table-column
                  v-for="item in tableHeader"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width || item.label.length * 20 + 20"
                  :fixed="item.fixed"
                  header-align="center"
                  :align="item.align || 'left'"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span
                      v-if="item.prop === 'settlementType'"
                      :val="scope.row.settlementType"
                      code="MEDICAL_INSURANCE_CODE"
                      v-codeTransform
                    ></span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </l-table>
          </div>
        </div>
      </el-card>
    </template>
    <template #content>
      <el-card class="height100 padding10">
        <div class="detail-table">
          <el-table
            :data="detailsData"
            v-loading="detailLoad"
            stripe
            border
            width="100%"
            height="100%"
          >
            <el-table-column
              v-for="item in detailsHeader"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :width="item.width || item.label.length * 20 + 20"
              :fixed="item.fixed"
              header-align="center"
              :align="item.align || 'left'"
            >
              <template slot-scope="scope">
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <el-pagination
            background
            @size-change="changeSizeRight"
            @current-change="changePageRight"
            :current-page="detailPageParams.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="detailPageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailPageParams.total"
          ></el-pagination>
        </div>
      </el-card>
    </template>
  </l-layout>
</template>

<script>
import {
  tardeDetailList,
  getPageTradeChargeDetailList
} from "@/api/medicalInsurance/index.js";
import { getArchInfoByCardNum } from "@/api/arch/arch.js";

export default {
  name: "outPatient",
  data() {
    return {
      searchParams: {
        cardData: "",
        patientCode: "",
        visitCode: "",
        medicareType: "",
        startChargeTime: "",
        endChargeTime: ""
      },
      patientInfo: {},
      // 缓存查询数据
      cacheSearchParams: {},
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tableHeader: [
        {
          prop: "patientName",
          label: "姓名",
          fixed: "left",
          width: 100
        },
        {
          prop: "patientCode",
          label: "患者编号",
          width: 140
        },
        {
          prop: "visitCode",
          label: "门诊号",
          width: 140
        },
        {
          prop: "settlementType",
          label: "结算类型",
          width: 140
        },
        {
          prop: "ouptDeptName",
          label: "科室",
          width: 140
        },
        {
          prop: "doctorName",
          label: "医生",
          width: 140
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          width: 100
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          width: 170
        }
      ],
      tableData: [],
      detailsHeader: [
        {
          prop: "recipeNum",
          label: "处方号",
          width: 120
        },
        {
          prop: "recipeTime",
          label: "处方时间",
          width: 170
        },
        {
          prop: "chargeItemType",
          label: "收费项目种类"
        },
        {
          prop: "chargeType",
          label: "收费类别"
        },
        {
          prop: "hisChargeItemCode",
          label: "HIS收费项目编码"
        },
        {
          prop: "hisChargeItemName",
          label: "HIS收费项目名称"
        },
        {
          prop: "siChargeItemCode",
          label: "医保收费项目编码"
        },
        {
          prop: "siChargeItemName",
          label: "医保收费项目名称"
        },
        {
          prop: "price",
          label: "单价"
        },
        {
          prop: "hisChargeUnit",
          label: "HIS收费单位"
        },
        {
          prop: "siChargeUnit",
          label: "医保收费单位"
        },
        {
          prop: "chargeQuantity",
          label: "数量"
        },
        {
          prop: "orderQuantity",
          label: "贴数"
        },
        {
          prop: "totalAmt",
          label: "金额"
        },
        {
          prop: "selfPayPercent",
          label: "自付比例"
        },
        {
          prop: "hisDosageType",
          label: "HIS剂型"
        },
        {
          prop: "siDosageType",
          label: "医保剂型"
        },
        {
          prop: "hisDosageUnit",
          label: "HIS剂量单位"
        },
        {
          prop: "siDosageUnit",
          label: "医保剂量单位"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "useLevel",
          label: "用量"
        },
        {
          prop: "hisDrugUsage",
          label: "HIS用法"
        },
        {
          prop: "siDrugUsage",
          label: "医保用法"
        },
        {
          prop: "siDrugFrequency",
          label: "医保频次"
        },
        {
          prop: "hisDrugFrequency",
          label: "HIS频次"
        },
        {
          prop: "chargeTime",
          label: "费用发生时间",
          width: 170
        },
        {
          prop: "useObject",
          label: "使用对象"
        },
        {
          prop: "bedNum",
          label: "床号"
        },
        {
          prop: "doctorCode",
          label: "医生编码"
        },
        {
          prop: "doctorName",
          label: "医生姓名"
        },
        {
          prop: "sdeptName",
          label: "科室名称"
        },
        {
          prop: "orderDay",
          label: "医嘱天数"
        },
        {
          prop: "herbCompoundPreparationFlag",
          label: "草药复方标志"
        },
        {
          prop: "selfPayFlag",
          label: "全额自费标志"
        },
        {
          prop: "refundDrugFlag",
          label: "退药标记"
        },
        {
          prop: "useDrugFlag",
          label: "用药标志"
        },
        {
          prop: "preInHosFlag",
          label: "预住院标志"
        },
        {
          prop: "operatorCode",
          label: "经办人编码"
        },
        {
          prop: "operatorName",
          label: "经办人名称"
        },
        {
          prop: "recordNum",
          label: "备案号"
        },
        {
          prop: "recordStatus",
          label: "状态"
        },
        {
          prop: "returnAmt",
          label: "返回金额"
        },
        {
          prop: "returnPartSelfPayAmt",
          label: "返回自理金额"
        },
        {
          prop: "returnExceedLimitAmtSelfPayAmt",
          label: "返回超限价自付金额"
        },
        {
          prop: "returnWithinMedicareFundAmt",
          label: "返回进入基金金额"
        },
        {
          prop: "returnCharegItemLevel",
          label: "返回收费项目等级"
        },
        {
          prop: "returnAllSelfPayFlag",
          label: "返回全额自费标志"
        },
        {
          prop: "returnSelfPayPercent",
          label: "返回自付比例"
        },
        {
          prop: "createdByName",
          label: "创建者"
        },
        {
          prop: "createdAt",
          label: "创建时间"
        },
        {
          prop: "updatedByName",
          label: "最后修改者"
        },
        {
          prop: "updatedAt",
          label: "最后修改时间"
        }
      ],
      detailsData: [],
      currentRow: null,
      detailLoad: false,
      detailPageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  methods: {
    readCard() {
      this.$message.error("没有外接设备");
    },
    search() {
      this.pageParams.pageNo = 1;
      // 如果输入了患者卡号，先根据卡号获取患者id
      this.cacheSearchParams = { ...this.searchParams };
      if (this.searchParams.cardData !== "") {
        getArchInfoByCardNum({ cardNum: this.searchParams.cardData })
          .then(res => {
            if (res.code === 1) {
              this.$message.success(res.msg || "读卡成功!");
              this.patientInfo = res.data;
              this.loadLeftTable();
            } else {
              this.$message.error(res.msg || "读卡失败!");
            }
          })
          .catch(err => {
            this.$message.error(err.msg || "读卡失败!");
          });
      } else {
        this.loadLeftTable();
      }
    },
    reSet() {
      this.searchParams = this.$options.data().searchParams;
    },
    loadLeftTable() {
      this.loading = true;
      this.searchParams = { ...this.cacheSearchParams };
      const params = {
        ...this.searchParams,
        ...this.pageParams,
        patientId: this.patientInfo.patientId || ""
      };
      tardeDetailList(params)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
            if (this.tableData.length > 0) {
              this.rowClick(this.tableData[0]);
            } else {
              this.rowClick();
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.loadLeftTable();
    },
    headerDragend() {
      this.$refs.listTable.doLayout();
    },
    rowClick(row) {
      this.currentRow = row;
      this.$refs.listTable.setCurrentRow(row);
      this.detailPageParams.pageNo = 1;
      if (row) {
        this.loadRightTable();
      } else {
        this.detailsData = [];
        this.detailPageParams.total = 0;
      }
    },
    loadRightTable() {
      if (!this.currentRow.tradeId) {
        return;
      }
      this.detailLoad = true;
      getPageTradeChargeDetailList({
        siTradeId: this.currentRow.tradeId,
        ...this.detailPageParams
      })
        .then(res => {
          this.detailLoad = false;
          if (res.code === 1) {
            this.detailPageParams.total = res.total;
            this.detailsData = res.data;
          }
        })
        .catch(err => {
          this.detailLoad = false;
        });
    },
    changeSizeRight(val) {
      this.detailPageParams.pageSize = val;
      this.loadRightTable();
    },
    changePageRight(val) {
      this.detailPageParams.pageNo = val;
      this.loadRightTable();
    }
  }
};
</script>

<style lang="scss" scoped>
.left-box {
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .left-form {
    /deep/ .l-input-wrap .l-input-body .l-input-body-main {
      .el-date-editor .el-input__inner {
        padding: 0 30px;
      }
      .el-date-editor .el-input__prefix {
        left: 5px;
        right: auto;
        padding: 0;
      }
      .el-date-editor .el-input__suffix {
        right: 0;
      }
    }
  }
  .left-table {
    flex: 1;
    overflow: hidden;
    margin-top: 10px;
    /deep/ .l-table-content-nottitle {
      height: calc(100% - 36px);
    }
  }
}
.mb5 {
  margin-bottom: 5px;
}
.buttonArea {
  display: flex;
  justify-content: space-between;
}
.detail-table {
  height: calc(100% - 38px);
  margin-bottom: 10px;
}
.page {
  text-align: right;
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
</style>
