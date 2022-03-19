<template>
  <div class="detailsUpload height100 padding16">
    <div class="top">
      <div style="font-size: 16px; font-weight: bold">上传患者信息查询</div>
      <div
        style="display: flex; margin-top: 8px; justify-content: space-between"
      >
        <div>
          <LFormtTitle style="width: 250px" label="住院号">
            <el-input v-model="inpCode" clearable></el-input>
          </LFormtTitle>
          <LFormtTitle
            style="width: 250px; margin-right: 16px"
            label="患者姓名"
          >
            <el-input v-model="patientName" clearable></el-input>
          </LFormtTitle>
          <el-button type="primary" @click="inpPatientInfo">查询</el-button>
        </div>
        <div style="">
          <el-button
            type="primary"
            @click="upload"
            :disabled="!multipleSelection.length"
            >明细上传</el-button
          >
          <el-button
            type="primary"
            @click="reUpload"
            :disabled="!multipleSelection.length"
            >重新上传</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData1"
        highlight-current-row
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        border
        style="margin-top: 8px; flex: 1"
        width="100%"
        height="30%"
        v-loading="loading1"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="40"
        >
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns1"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
        >
          <template slot-scope="scope">
            <template v-if="item.align === 'right'">{{
              (scope.row[item.prop] || 0).toFixed(2)
            }}</template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 8px; text-align: right"
        background
        @size-change="changeSize1"
        @current-change="handleCurrentChange1"
        :current-page="pageParams1.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageParams1.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams1.total"
      ></el-pagination>
    </div>
    <div class="bottom">
      <el-radio-group v-model="tableType" style="margin-top: -32px">
        <el-radio-button label="2">待上传明细</el-radio-button>
        <el-radio-button label="3">已上传明细</el-radio-button>
        <el-radio-button label="4">未对照</el-radio-button>
      </el-radio-group>
      <el-table
        v-show="tableType == 2"
        :data="tableData2"
        border
        style="margin-top: 8px; flex: 1"
        width="100%"
        height="30%"
        v-loading="loading2"
      >
        <el-table-column
          v-for="(item, index) in columns2"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.align === 'right'">{{
              (scope.row[item.prop] || 0).toFixed(2)
            }}</template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableType == 2"
        style="margin-top: 8px; text-align: right"
        background
        @size-change="changeSize2"
        @current-change="handleCurrentChange2"
        :current-page="pageParams2.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageParams2.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams2.total"
      ></el-pagination>
      <el-table
        v-show="tableType == 3"
        :data="tableData3"
        border
        style="margin-top: 8px"
        width="100%"
        height="30%"
        v-loading="loading3"
      >
        <el-table-column
          v-for="(item, index) in columns3"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.align === 'right'">{{
              (scope.row[item.prop] || 0).toFixed(2)
            }}</template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableType == 3"
        style="margin-top: 8px; text-align: right"
        background
        @size-change="changeSize3"
        @current-change="handleCurrentChange3"
        :current-page="pageParams3.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageParams3.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams3.total"
      ></el-pagination>
      <el-table
        v-show="tableType == 4"
        :data="tableData4"
        border
        style="margin-top: 8px"
        width="100%"
        height="30%"
        v-loading="loading4"
      >
        <el-table-column
          v-for="(item, index) in columns4"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.align === 'right'">{{
              (scope.row[item.prop] || 0).toFixed(2)
            }}</template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableType == 4"
        style="margin-top: 8px; text-align: right"
        background
        @size-change="changeSize4"
        @current-change="handleCurrentChange4"
        :current-page="pageParams4.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageParams4.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams4.total"
      ></el-pagination>
    </div>
    <el-dialog title="上传进度" :visible.sync="dialogVisible" width="60%">
      <el-table :data="multipleSelection" style="width: 100%">
              <el-table-column
          type="index"
          label="序号"
          align="center"
          min-idth="50"
        >
                </el-table-column
        >
                <el-table-column
          prop="patientName"
          label="患者姓名"
          align="center"
          min-width="180"
        >
                  </el-table-column
        >
                <el-table-column
          prop="inpCode"
          label="住院号"
          align="center"
          min-width="180"
        >
                  </el-table-column
        >
                <el-table-column
          prop="total"
          label="待上传次数"
          align="center"
          min-width="180"
        >
                  </el-table-column
        >
                <el-table-column
          prop="percentage"
          label="进度"
          align="center"
          min-width="180"
        >
                    <template slot-scope="scope">
                        <el-progress
              :width="45"
              type="circle"
              :percentage="scope.row.percentage"
            ></el-progress>
                      </template
          >           </el-table-column
        >
              </el-table
      >
    </el-dialog>
  </div>
</template>

<script>
import detailsUploadService from "@/api/medicalInsurance/detailsUpload";
import { param } from "jquery";
export default {
  data() {
    return {
      dialogVisible: false,
      pageParams1: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      pageParams2: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      pageParams3: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      pageParams4: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      multipleSelection: [],
      currentRow: null,
      patientName: "", //患者名称
      inpCode: "", //住院号
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      columns1: [
        {
          prop: "inpCode",
          label: "住院号",
          width: "150",
        },
        {
          prop: "patientName",
          label: "姓名",
          width: "180",
        },
        {
          prop: "hisTotalAmt",
          label: "费用总金额",
          width: "120",
          align: "right",
        },
        {
          prop: "uploadTotalAmt",
          label: "上传总金额",
          width: "120",
          align: "right",
        },
        {
          prop: "totalAmtBalance",
          label: "差额",
          width: "120",
          align: "right",
        },
        {
          prop: "freeAmt",
          label: "记账金额",
          width: "120",
          align: "right",
        },
        {
          prop: "selfPayAmt",
          label: "自付金额",
          width: "120",
          align: "right",
        },
        {
          prop: "totalPrepayAmt",
          label: "预交余额",
          width: "120",
          align: "right",
        },
        {
          prop: "fundPayAmount",
          label: "医保报销金额",
          width: "120",
          align: "right",
        },
        {
          prop: "personalAccountPayAmount",
          label: "个人账户支付金额",
          width: "150",
          align: "right",
        },
        {
          prop: "errorMessage",
          label: "错误信息",
          width: "120",
        },
      ],
      columns2: [
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          width: "180",
        },
        {
          prop: "chargeItemCode",
          label: "收费项目编码",
          width: "150",
        },
        {
          prop: "chargePrice",
          label: "单价",
          width: "80",
          align: "right",
        },
        {
          prop: "chargeQuantity",
          label: "数量",
          width: "80",
        },
        {
          prop: "totalAmt",
          label: "金额",
          width: "80",
          align: "right",
        },
        {
          prop: "doctorCode",
          label: "医生编码",
          width: "90",
        },
        {
          prop: "doctorName",
          label: "医生名称",
          width: "90",
        },
        {
          prop: "chargeTime",
          label: "费用时间",
          width: "180",
        },
        {
          prop: "chargeItemChargeDetailId",
          label: "费用明细ID",
          width: "300",
        },
        {
          prop: "oldChargeItemChargeDetailId",
          label: "原费用明细ID",
          width: "300",
        },
      ],
      columns3: [
        {
          prop: "hisChargeItemName",
          label: "HIS收费项目名称",
          width: "180",
        },
        {
          prop: "hisChargeItemCode",
          label: "HIS收费项目编码",
          width: "150",
        },
        {
          prop: "siChargeItemName",
          label: "医保收费项目名称",
          width: "150",
        },
        {
          prop: "siChargeItemCode",
          label: "医保收费项目编码",
          width: "150",
        },
        {
          prop: "price",
          label: "单价",
          width: "80",
          align: "right",
        },
        {
          prop: "chargeQuantity",
          label: "数量",
          width: "80",
        },
        {
          prop: "totalAmt",
          label: "金额",
          width: "80",
          align: "right",
        },
        {
          prop: "doctorCode",
          label: "医生编码",
          width: "100",
        },
        {
          prop: "doctorName",
          label: "医生名称",
          width: "90",
        },
        {
          prop: "hisChargeDetailId",
          label: "HIS费用明细ID",
          width: "300",
        },
        {
          prop: "siTradeChargeDetailId",
          label: "上传明细ID",
          width: "300",
        },
      ],
      columns4: [
        {
          prop: "chargeItemName",
          label: "HIS项目名称",
          width: "180",
        },
        {
          prop: "chargeItemCode",
          label: "HIS项目编码",
          width: "150",
        },
        {
          prop: "chargePrice",
          label: "单价",
          width: "80",
          align: "right",
        },
        {
          prop: "chargeQuantity",
          label: "数量",
          width: "80",
        },
        {
          prop: "totalAmt",
          label: "金额",
          width: "80",
          align: "right",
        },
        {
          prop: "doctorCode",
          label: "医生编码",
          width: "100",
        },
        {
          prop: "doctorName",
          label: "医生名称",
          width: "90",
        },
        {
          prop: "chargeTime",
          label: "费用时间",
          width: "180",
        },
        {
          prop: "chargeItemChargeDetailId",
          label: "费用明细ID",
          width: "300",
        },
        {
          prop: "oldChargeItemChargeDetailId",
          label: "原费用明细ID",
          width: "300",
        },
      ],
      tableType: 2,
    };
  },
  mounted() {
    this.inpPatientInfo();
  },
  methods: {
    //获取住院医保患者列表
    async inpPatientInfo() {
      this.loading1 = true;
      try {
        let res = await detailsUploadService.inpPatientInfo({
          // pageNo:this.pageParams1.pageNo,
          // pageSize:this.pageParams1.pageSize,
          patientName: this.patientName, //患者姓名
          inpCode: this.inpCode, //住院号'
        });
        if (res.code == 1) {
          this.tableData1 = res.data;
          this.pageParams1.total = res.total;
        }
        this.loading1 = false;
      } catch (error) {
        this.loading1 = false;
      }
    },
    //获取待上传明细列表
    async waitUpoladChargeDetail() {
      this.loading2 = true;
      try {
        let res = await detailsUploadService.waitUpoladChargeDetail({
          pageNo: this.pageParams2.pageNo,
          pageSize: this.pageParams2.pageSize,
          finAdId: this.currentRow.finAdId,
        });
        if (res.code == 1) {
          this.tableData2 = res.data;
          this.pageParams2.total = res.total;
        }
        this.loading2 = false;
      } catch (error) {
        this.loading2 = false;
      }
    },
    // 获取已上传明细列表
    async getPageTradeChargeDetailList() {
      this.loading3 = true;
      try {
        let res = await detailsUploadService.getPageTradeChargeDetailList({
          pageNo: this.pageParams3.pageNo,
          pageSize: this.pageParams3.pageSize,
          /**医保交易ID**/
          // siTradeId:'',
          hisTradeId: this.currentRow.finAdId,
        });
        if (res.code == 1) {
          this.tableData3 = res.data;
          this.pageParams3.total = res.total;
        }
        this.loading3 = false;
      } catch (error) {
        this.loading3 = false;
      }
    },
    // 获取未对照明细列表
    async stepByunSiItemMapChargeDetailStep() {
      this.loading4 = true;
      try {
        let res = await detailsUploadService.unSiItemMapChargeDetail({
          pageNo: this.pageParams4.pageNo,
          pageSize: this.pageParams4.pageSize,
          /**医保交易ID**/
          // siTradeId:'',
          finAdId: this.currentRow.finAdId,
        });
        if (res.code == 1) {
          this.tableData4 = res.data;
          this.pageParams4.total = res.total;
        }
        this.loading4 = false;
      } catch (error) {
        this.loading4 = false;
      }
    },
    // 费用明细上传
    async stepByStep(reUploadFlag, item) {
      item.total = 0;
      let res = await detailsUploadService.stepByStep({
        reUploadFlag,
        finAdId: item.finAdId,
      });
      if (res.code == 1) {
        if (item.total == 0 && res.data.remainUploadedTimes) {
          item.total = res.data.remainUploadedTimes + 1;
        }
        if (item.total === 0 && res.data.remainUploadedTimes === 0) {
          this.$set(item, "percentage", 100);
          return;
        }
        let percentage = Number(
          (
            ((item.total - res.data.remainUploadedTimes) / item.total) *
            100
          ).toFixed(0)
        );
        this.$set(item, "percentage", percentage);
      }
      if (
        (res.code != 1 || res.data.remainUploadedTimes > 0) &&
        this.dialogVisible
      ) {
        await this.stepByStep(reUploadFlag, item);
      }
    },
    // 费用明细重新上传
    async cancelStepByStep(reUploadFlag, item, num) {
      item.total = 0;
      let res = await detailsUploadService.stepByStep({
        reUploadFlag,
        finAdId: item.finAdId,
      });
      if (res.code == 1) {
        if (item.total == 0 && res.data.remainUploadedTimes) {
          item.total = res.data.remainUploadedTimes + 1;
        }
        if (item.total === 0 && res.data.remainUploadedTimes === 0) {
          this.$set(item, "percentage", 100);
          return;
        }
        // item.percentage = (item.total - res.data.remainUploadedTimes)/item.total*100;
        let percentage = Number(
          (
            ((item.total - res.data.remainUploadedTimes) / item.total) *
            100
          ).toFixed(0)
        );
        this.$set(item, "percentage", percentage);
        if (res.data.remainUploadedTimes > 0 && this.dialogVisible) {
          await this.cancelStepByStep(0, item);
        }
      }
      if (res.code != 1 && this.dialogVisible) {
        await this.cancelStepByStep(reUploadFlag, item);
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.waitUpoladChargeDetail();
      this.getPageTradeChargeDetailList();
      this.stepByunSiItemMapChargeDetailStep();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeSize1(val) {
      this.pageParams1.pageSize = val;
      this.inpPatientInfo();
    },
    handleCurrentChange1(val) {
      this.pageParams1.pageNo = val;
      this.inpPatientInfo();
    },
    changeSize2(val) {
      this.pageParams2.pageSize = val;
      this.waitUpoladChargeDetail();
    },
    handleCurrentChange2(val) {
      this.pageParams2.pageNo = val;
      this.waitUpoladChargeDetail();
    },
    changeSize3(val) {
      this.pageParams3.pageSize = val;
      this.getPageTradeChargeDetailList();
    },
    handleCurrentChange3(val) {
      this.pageParams3.pageNo = val;
      this.getPageTradeChargeDetailList();
    },
    changeSize4(val) {
      this.pageParams4.pageSize = val;
      this.stepByunSiItemMapChargeDetailStep();
    },
    handleCurrentChange4(val) {
      this.pageParams4.pageNo = val;
      this.stepByunSiItemMapChargeDetailStep();
    },
    upload() {
      this.dialogVisible = true;
      this.multipleSelection.forEach(async (item) => {
        await this.stepByStep(0, item);
        this.dialogVisible && (await this.perSettle(item));
      });
    },
    reUpload() {
      this.dialogVisible = true;
      this.multipleSelection.forEach(async (item) => {
        this.$set(item, "percentage", 0);
        await this.cancelStepByStep(1, item);
        this.dialogVisible && (await this.perSettle(item));
      });
    },
    // 医保结算接口
    async perSettle(item) {
      let params = {
        finAdId: item.finAdId,
        patientCode: item.inpCode,
        patientName: item.patientName,
        midwayPreSettle: "1",
      };
      await detailsUploadService.preSettle(params).then(async (res) => {
        if (res.code == 1) {
          await this.inpPatientInfo();
          // 上传完成+结算完成之后关闭弹窗
          this.dialogVisible = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detailsUpload {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  >>> .el-dialog__body {
    min-height: 400px;
  }

  .top {
    height: 50%;
    display: flex;
    flex-direction: column;
  }

  .bottom {
    height: 50%;
    display: flex;
    flex-direction: column;
  }
}
</style>
