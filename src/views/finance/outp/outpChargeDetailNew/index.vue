<template>
  <div class="catalogue1 width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <l-read-card
            style="width: 250px; display: inline-block"
            ref="readCard"
            @readCard="getReadCard"
          ></l-read-card>

          <LFormtTitle label="患者编码" style="width: 250px">
            <el-input
              v-model="patientCode"
              placeholder="请输入患者编码"
              clearable
            ></el-input>
          </LFormtTitle>

          <LFormtTitle label="患者姓名" style="width: 250px">
            <el-input
              v-model="patientName"
              placeholder="请输入患者姓名"
              clearable
            ></el-input>
          </LFormtTitle>

          <LFormtTitle label="收费项目名称" style="width: 250px">
            <el-input
              v-model="chargeItemName"
              placeholder="请输入收费项目名称"
              clearable
            ></el-input>
          </LFormtTitle>

          <LFormtTitle label="收费时间" style="width: 440px">
            <el-date-picker
              v-model="date"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
            ></el-date-picker>
          </LFormtTitle>
          <l-formt-title label="收费员" style="width: 250px">
            <l-value-domain
              clearable
              type="select"
              :value.sync="searchValue.chargeUserId"
              remoteUrl="/user/page"
              :remoteParams="remoteParams"
              remoteShowKey="name"
              remoteValueKey="id"
              placeholder="请选择收费员"
              @change="roleChange"
            >
            </l-value-domain>
          </l-formt-title>

          <l-formt-title label="收费类型" style="width: 250px">
            <l-value-domain
              clearable
              filterable
              type="select"
              :value.sync="searchValue.finClassCode"
              remoteUrl="/finance-pub/classCode/getClassCodePO"
              remoteShowKey="classCodeName"
              remoteValueKey="finClassCode"
              placeholder="请选择收类型"
            >
            </l-value-domain>
          </l-formt-title>

          <el-button
            type="primary"
            plain
            style="margin-left: 16px"
            @click="setOut"
            >导出</el-button
          >
          <!--暂时隐藏掉-->
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="resetHandler">重置</el-button>
        </div>
      </div>
      <div class="table-cont">
        <el-table
          ref="tableData"
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          show-summary
          :summary-method="getSummaries"
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            sortable
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width || item.label.length * 18 + 24"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'recordStatus'">
                <!-- <span v-if="scope.row[item.prop] == '1'">收费</span>
                <span v-else-if="scope.row[item.prop] == '2'">已退费</span>
                <span v-else-if="scope.row[item.prop] == '9'">退费</span>
                <span v-else>{{ scope.row[item.prop] }}</span> -->
                <span>{{recordStatusList[scope.row[item.prop]] || scope.row[item.prop]}}</span>
              </template>
              <template v-else-if="item.prop == 'chargeApprove'">
                <span v-if="scope.row[item.prop] == '0'">无需审批</span>
                <span v-else-if="scope.row[item.prop] == '1'">审批成公费</span>
                <span v-else-if="scope.row[item.prop] == '2'">审批成自费</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'willingSelfPay'">
                <span v-if="scope.row[item.prop] == '0'">否</span>
                <span v-else-if="scope.row[item.prop] == '1'">是</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop == 'chargeType'">
                <span
                  :val="scope.row['chargeType']"
                  code="charge_type"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'classCode'">
                <span
                  tableName="fin_class_code"
                  :conditionMap="{
                    fin_class_code: scope.row[item.prop] || '',
                  }"
                  columns="class_code_name"
                  v-tableTransform
                  class="units classCode"
                ></span>
              </template>
              <template v-else-if="item.prop == 'drugApproach'">
                <span
                  :val="scope.row['drugApproach']"
                  code="MedicationRouteCode"
                  v-codeTransform
                ></span>
              </template>
              <template
                v-else-if="
                  item.prop == 'dosageUnit' || item.prop == 'useLevelUnit'
                "
              >
                <span
                  :val="scope.row[item.prop]"
                  code="DrugDoseUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'dosageType'">
                <span
                  :val="scope.row['dosageType']"
                  code="DrugFormulationCode"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'skinTest'">
                <span
                  :val="scope.row['skinTest']"
                  code="SkinTestWay"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'drugUsage'">
                <span
                  :val="scope.row['drugUsage']"
                  code="MedicationRouteCode"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'chargeUnit'">
                <span
                  v-if="!isChinese(scope.row[item.prop])"
                  :val="scope.row[item.prop]"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
              <template v-else-if="item.prop == 'chargeQuantity'">
                <span v-if="scope.row[item.prop]">{{
                  formatNumber(scope.row[item.prop])
                }}</span>
                <span v-if="!scope.row[item.prop]">0.00</span>
              </template>
              <span v-else class="overflow-point">{{
                scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[50, 100, 200]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/financeManagement/outpChargeDetailNew";
import services from "@/api/cis/receiptPrint/receiptPrint";
import { onExcel } from "@/utils/excel/excel";
export default {
  components: {},
  data() {
    return {
      finClassCodeList: {},
      searchValue: {
        chargeUserId: "",
        finClassCode: ""
      },
      remoteParams: {
        pageSize: 210,
        page: 1,
        orderBy: "updated_at desc"
      },
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      addStatus: false,
      loading: false,
      chargeDetailId: "",
      orderChargeDetailId: "",
      orderId: "",
      tradeId: "",
      deptList: {},
      patientName: "",
      patientId: "",
      chargeItemName: "",
      patientCode: "",
      prestoreCodeShow: {},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "patientCode",
          label: "患者编码",
          align: "left",
          headerAlign: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "orderName",
          label: "医嘱名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "classCode",
          label: "收费项目类型",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "chargePrice",
          label: "收费单价",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "chargeQuantity",
          label: "收费数量",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "chargeUnit",
          label: "收费单位",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "derateAmount",
          label: "减免总额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        // {
        //   prop: "chargeDetailId",
        //   label: "收费明细ID",
        //   align: "left",
        //   headerAlign: "left",
        //   width: "290",
        //   fixed: false
        // },
        // {
        //   prop: "oldChargeDetailId",
        //   label: "原收费明细ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "290",
        //   fixed: false
        // },
        // {
        //   prop: "orderChargeDetailId",
        //   label: "医嘱收费明细ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "290"
        // },
        // {
        //   prop: "orderId",
        //   label: "医嘱ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "290"
        // },
        // {
        //   prop: "tradeId",
        //   label: "交易ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "290"
        // },
        // {
        //   prop: "chargeItemId",
        //   label: "收费项目ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },{
        //   prop: "chargeItemCode",
        //   label: "收费项目编号",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },

        // {
        //   prop: "freePayMoney",
        //   label: "记账金额",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },

        // {
        //   prop: "discountSchemeId",
        //   label: "折扣方案ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "chargeApprove",
        //   label: "审批标志",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "groupNum",
        //   label: "组号",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "thirdPartyChargeTradeSerialNum",
        //   label: "第三方费用明细ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "290"
        // },
        // {
        //   prop: "orderChargeItemQuantity",
        //   label: "医嘱收费项目数量",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "orderDay",
        //   label: "医嘱天数",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "170"
        // },
        // {
        //   prop: "willingSelfPay",
        //   label: "是否自愿自费",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "controlLevel",
        //   label: "控制级别",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "classCode",
        //   label: "财务分类",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "statisticsCode",
        //   label: "统计码",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "medicalRecordClassCode",
        //   label: "病案分类码",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        {
          prop: "doctorName",
          label: "开单医生",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "orderTime",
          label: "开单日期",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "130"
        },
        {
          prop: "recordStatus",
          label: "状态标志",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "chargeUserName",
          label: "收费人",
          align: "left",
          headerAlign: "center",
          width: "90"
        }
        // {
        //   prop: "producePlaceId",
        //   label: "产地ID",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "producePlaceCode",
        //   label: "产地代码",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "spec",
        //   label: "规格",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "packQuantity",
        //   label: "包装量",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "packUnit",
        //   label: "包装单位",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "drugFrequency",
        //   label: "频次",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "drugApproach",
        //   label: "途径",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "drugDosage",
        //   label: "剂量",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "dosageUnit",
        //   label: "剂量单位",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "useLevel",
        //   label: "用量",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "useLevelUnit",
        //   label: "用量单位",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "dosageType",
        //   label: "剂型",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "drugUsage",
        //   label: "用法",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "skinTest",
        //   label: "皮试",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "enableDay",
        //   label: "可用天数",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "150"
        // },
        // {
        //   prop: "unitSaleFlg",
        //   label: "药品是否可拆分",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        chargeDetailId: "",
        oldChargeDetailId: "",
        orderChargeDetailId: "",
        orderId: "",
        tradeId: "",
        chargeItemId: "",
        chargeItemCode: "",
        chargeItemName: "",
        chargeUnit: "",
        chargePrice: "",
        chargeQuantity: "",
        totalMoney: "",
        freePayMoney: "",
        derateAmount: "",
        discountSchemeId: "",
        chargeApprove: "",
        groupNum: "",
        thirdPartyChargeTradeSerialNum: "",
        orderChargeItemQuantity: "",
        orderDay: "",
        willingSelfPay: "",
        controlLevel: "",
        classCode: "",
        statisticsCode: "",
        medicalRecordClassCode: "",
        recordStatus: "1",
        producePlaceId: "",
        producePlaceCode: "",
        spec: "",
        packQuantity: "",
        packUnit: "",
        drugFrequency: "",
        drugApproach: "",
        drugDosage: "",
        dosageUnit: "",
        useLevel: "",
        useLevelUnit: "",
        dosageType: "",
        drugUsage: "",
        skinTest: "",
        enableDay: "",
        unitSaleFlg: ""
      },
      cardInfo: {},
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 100,
        total: 0
      },
      // 状态标识list
      recordStatusList: {
        "1": "收费",
        "2": "已退费",
        "9": "退费",
      }
    };
  },

  updated() {
    this.$nextTick(() => {
      this.$refs.tableData.doLayout();
    });
  },
  mounted() {
    this.getListPageOutpChargeDetailNew();
    // this.getClassCodePO();
  },
  methods: {
    resetHandler() {
      this.$refs.readCard.cardData = "";
      this.patientCode = "";
      this.patientName = "";
      this.chargeItemName = "";
      this.date = [];
      this.searchValue.chargeUserId = "";
      this.searchValue.finClassCode = "";
    },
    async getClassCodePO() {
      let res = await service.getClassCodePO();
      if (res.code === 1) {
        res.data.forEach(item => {
          this.finClassCode[item.finClassCode] = item.classCodeName;
        });
      }
    },
    roleChange(data, obj) {
      console.info(obj);
      console.info(data);
      if (obj) {
        this.searchValue.chargeUserId = obj.id;
      } else {
        this.searchValue.chargeUserId = "";
      }
    },
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.pageParams.pageNo = 1;
      this.getListPageOutpChargeDetailNew();
    },
    async getListPageOutpChargeDetailNew() {
      this.loading = true;
      let obj = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        chargeDetailId: this.chargeDetailId || "",
        orderChargeDetailId: this.orderChargeDetailId || "",
        orderId: this.orderId || "",
        tradeId: this.tradeId || "",
        patientId: this.cardInfo.patientId || "",
        patientName: this.patientName || "",
        patientCode: this.patientCode || "",
        chargeItemName: this.chargeItemName || "",
        chargeUserId: this.searchValue.chargeUserId || "",
        finClassCode: this.searchValue.finClassCode || ""
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.dayjs(this.date[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        obj.endChargeTime = this.dayjs(this.date[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.$message.error("收费时间不能为空！");
        this.loading = false;
        return;
      }
      let res = await service.getListPageOutpChargeDetailNew(obj);

      this.loading = false;
      this.tableData = res.data.map(item => {
        item.totalMoney = item.totalMoney.toFixed(2);
        item.freePayMoney = item.freePayMoney.toFixed(2);
        item.derateAmount = item.derateAmount.toFixed(2);
        item.chargePrice = item.chargePrice.toFixed(4);
        return item;
      });
      this.pageParams.total = res.total;
      if (typeof tableData !== "undefined") {
        this.currentData = this.tableData[0];
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
      } else {
        this.currentData = [];
      }
    },
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 表格总价设置方法
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            }
            return prev;
          }, 0.0);
          if (index === 6) {
            sums[index] = this.formatNumber(sums[index]);
          } else if (index === 9 || index === 8) {
            sums[index] = "￥" + this.formatNumber(sums[index]);
          } else {
            sums[index] = "";
          }
        } else {
          if (index === 1) {
            sums[index] = data.length + "人次";
          } else {
            sums[index] = "";
          }
        }
      });
      return sums;
    },
    search() {
      this.cardInfo = {};
      if (this.$refs.readCard.cardData !== "") {
        this.$refs.readCard.getPatient();
      } else {
        this.pageParams.pageNo = 1;
        this.getListPageOutpChargeDetailNew();
      }
    },
    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
      this.form = { ...this.currentData };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        chargeDetailId: "",
        oldChargeDetailId: "",
        orderChargeDetailId: "",
        orderId: "",
        tradeId: "",
        chargeItemId: "",
        chargeItemCode: "",
        chargeItemName: "",
        chargeUnit: "",
        chargePrice: "",
        chargeQuantity: "",
        totalMoney: "",
        freePayMoney: "",
        derateAmount: "",
        discountSchemeId: "",
        chargeApprove: "",
        groupNum: "",
        thirdPartyChargeTradeSerialNum: "",
        orderChargeItemQuantity: "",
        orderDay: "",
        willingSelfPay: "",
        controlLevel: "",
        classCode: "",
        statisticsCode: "",
        medicalRecordClassCode: "",
        recordStatus: "1",
        producePlaceId: "",
        producePlaceCode: "",
        spec: "",
        packQuantity: "",
        packUnit: "",
        drugFrequency: "",
        drugApproach: "",
        drugDosage: "",
        dosageUnit: "",
        useLevel: "",
        useLevelUnit: "",
        dosageType: "",
        drugUsage: "",
        skinTest: "",
        enableDay: "",
        unitSaleFlg: ""
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.OnlinePaySettlementDetailId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delOnlinePaySettlementDetailById(
          this.form.OnlinePaySettlementDetailId
        );
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.getListPageOutpChargeDetailNew();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    async save() {
      if (this.addStatus) {
        try {
          this.$showLoading();
          console.log(this.form);
          let res = await service.addOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          if (res.code === 1) {
            this.$message({ type: "success", message: "新增成功" });
            this.getListPageOutpChargeDetailNew();
          } else {
            this.$message({ type: "flag", message: "新增失败" });
          }
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "新增失败");
        }
      } else {
        try {
          this.$showLoading();
          let res = await service.updateOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          this.$message({ type: "success", message: "保存成功" });
          this.getListPageOutpChargeDetailNew();
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "保存失败");
        }
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getListPageOutpChargeDetailNew();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPageOutpChargeDetailNew();
    },
    async setOut() {
      let obj = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        chargeDetailId: this.chargeDetailId || "",
        orderChargeDetailId: this.orderChargeDetailId || "",
        orderId: this.orderId || "",
        tradeId: this.tradeId || "",
        patientId: this.cardInfo.patientId || "",
        patientName: this.patientName || "",
        patientCode: this.patientCode || "",
        chargeItemName: this.chargeItemName || "",
        chargeUserId: this.searchValue.chargeUserId || "",
        finClassCode: this.searchValue.finClassCode || "",
        exportType: 3
      };
      if (this.date && this.date.length > 1) {
        obj.startChargeTime = this.dayjs(this.date[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        obj.endChargeTime = this.dayjs(this.date[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.$message.error("收费时间不能为空！");
        return;
      }
      let res = await services.exportChargeExcel(obj);
      var blob = res;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("catalogue1")[0];

        var a = document.createElement('a');
        a.setAttribute("id","billHref");
        a.download = '门诊项目费用明细.xls';
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      }
      return;
      let tHeader = this.tableParams.map(item => {
        return item.label;
      });
      let filterVal = this.tableParams.map(item => {
        return item.prop;
      });
      let elTableRow = this.$refs.tableData.bodyWrapper.querySelectorAll(
        ".el-table__row"
      );
      let tableData = [];
      for(let i in this.tableData) {
        let obj = {};
        let item = this.tableData[i];
        let elTableRowItem = elTableRow[i];
        let units = elTableRowItem.querySelectorAll(
          ".units"
        );
        for(let j in units) {
          let items = units[j];
          if(items.className && items.className.indexOf(" ") > -1) {
            obj[items.className.split(" ")[1]] = items.innerText;
          }
        }
        obj = {
          ...item,
          recordStatus: this.recordStatusList[item.recordStatus] || item.recordStatus,
          ...obj
        }
        tableData.push({...obj});
      }
      let excelData = {
        title: "门诊项目费用明细报表",
        tHeader,
        filterVal,
        listDate: tableData,
        fileName: "门诊项目费用明细报表",
        merges: ["A1:N1"]
      };
      onExcel(excelData);
    }
  }
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.catalogue1 {
  background-color: #fff;
  padding: 10px;
  .catalogue-left {
    width: 100%;

    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      height: calc(100% - 160px);
      margin: 20px 0;
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
  }
  .catalogue-right {
    width: 300px;
    padding: 10px;
    overflow-y: scroll;
    .catalogue-right-form {
      // height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
    .catalogue-right-btn {
      // margin-top: 10px;
    }
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
