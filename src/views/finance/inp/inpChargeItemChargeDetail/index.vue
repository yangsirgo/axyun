<template>
   <div class="catalogue width100 height100 clearfix padding10">
      <div class="catalogue-left height100 float-left">
      <div class="search-area">
          <el-form class="search-input" :model="form" ref="form">
            <el-row :gutter="10" class="width100 margin-top-10">
              <el-col :span="4">
                <l-read-card ref="readCard" @readCard="getReadCard"></l-read-card>
              </el-col>
              <el-col :span="4">
                <LFormtTitle label="医嘱项目名称">
                  <el-form-item prop="orderItemName">
                    <el-input v-model="form.orderItemName" placeholder="请输入医嘱项目名称" clearable></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="4">
                <LFormtTitle label="医嘱单号">
                  <el-form-item prop="orderBillNum">
                    <el-input v-model="form.orderBillNum" placeholder="请输入医嘱单号" clearable></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="4">
                <LFormtTitle label="开单医生">
                  <el-form-item prop="doctorName">
                    <el-input v-model="form.doctorName" placeholder="请输入开单医生" clearable></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="4">
                <LFormtTitle label="病案号">
                  <el-form-item prop="mrCode">
                    <el-input v-model="form.mrCode" placeholder="请输入病案号" clearable></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="4">
                <LFormtTitle label="住院号">
                  <el-form-item prop="inpCode">
                    <el-input v-model="form.inpCode" placeholder="请输入住院号" clearable></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <!--<el-col :span="6">-->
              <!--<LFormtTitle label="收费项目收费明细ID">-->
                <!--<el-form-item prop="chargeItemChargeDetailId">-->
                  <!--<el-input v-model="form.chargeItemChargeDetailId" placeholder="请输入项目收费明细ID" clearable></el-input>-->
                <!--</el-form-item>-->
              <!--</LFormtTitle>-->
            <!--</el-col>-->
            <!--<el-col :span="6">-->
              <!--<LFormtTitle label="医嘱收费明细ID">-->
                <!--<el-form-item prop="orderItemChargeDetailId">-->
                  <!--<el-input v-model="form.orderItemChargeDetailId" placeholder="请输入医嘱收费明细ID" clearable></el-input>-->
                <!--</el-form-item>-->
              <!--</LFormtTitle>-->
            <!--</el-col>-->
            <!--<el-col :span="6">-->
              <!--<LFormtTitle label="交易ID">-->
                <!--<el-form-item prop="tradeId">-->
                  <!--<el-input v-model="form.tradeId" placeholder="请输入交易ID" clearable></el-input>-->
                <!--</el-form-item>-->
              <!--</LFormtTitle>-->
            <!--</el-col>-->

            <!--<el-col :span="6">-->
              <!--<LFormtTitle label="财务住院ID">-->
                <!--<el-form-item prop="finAdId">-->
                  <!--<el-input v-model="form.finAdId" placeholder="请输入财务住院ID" clearable></el-input>-->
                <!--</el-form-item>-->
              <!--</LFormtTitle>-->
            <!--</el-col>-->
            </el-row>
          <el-row :gutter="10" class="width100 margin-top-10">
              
              <el-col :span="4">
                <LFormtTitle label="病人姓名">
                  <el-form-item prop="patientName">
                    <el-input v-model="form.patientName" placeholder="请输入病人姓名" clearable></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="6">
                <LFormtTitle label="收费时间">
                  <el-date-picker
                    v-model="date"
                    type="datetimerange"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable = "false"
                  ></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="14" class="float-right">
                <el-button type="primary" plain class="float-right" @click="exportExcel">导出</el-button>
                <el-button
                  type="primary"
                  plain
                  class="float-right"
                  style="margin-right:10px;"
                  @click="reset"
                >重置</el-button>
                <el-button
                  type="primary"
                  class="float-right"
                  style="margin-right:10px;"
                  @click="search"
                >查询</el-button>
              </el-col>
            </el-row>
        </el-form>
      </div>

      <div class="table-cont">
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width|| (item.label.length * 18 + 24)"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if=" item.prop == 'selfPayAmt' || item.prop == 'totalAmt' || item.prop == 'derateAmt' || item.prop == 'freePayAmt' || item.prop == 'chargeQuantity'
             || item.prop == 'packingNum' || item.prop == 'refundOrderQuantiye'|| item.prop == 'useLevel'|| item.prop == 'drugDosage' ">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
              <template v-else-if="item.prop == 'chargeUnit'">
                <span v-if="!isChinese(scope.row[item.prop])" :val="scope.row[item.prop]" code="DrugUnit" v-codeTransform></span>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
              <template v-else-if="item.prop == 'chargePrice' ">
                <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],4)}}</span>
                <span v-if="!scope.row[item.prop]">0.0000</span>
              </template>
            <template v-else-if="item.prop == 'chargeMode'">
              <span v-if="scope.row[item.prop] == '0'">{{'普通收费'}}</span>
              <span v-if="scope.row[item.prop] == '1'">{{'补费'}}</span>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
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
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
   </div>
  </div>
</template>
<script>
import service from "@/api/financeManagement/inp.js";
import formatNum from "@/utils/formatPrice.js";
import { jsonToExcel } from "@/utils/excel/excel";
export default {
  components: {},
  data() {
    return {
      cardInfo:{},
      tableDatas:[],
      loading: false,
      tableData: [],
       // 时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      // 查询表单
      form: {
        // orderItemChargeDetailId: "",
        // chargeItemChargeDetailId: "",
        orderItemName: "",
        orderBillNum: "",
        doctorName: "",
        mrCode: "",
        inpCode: "",
        //finAdId: "",
        patientName: ""

      },
      // 表格列
      tableParams: [
        {
          prop: "mrCode",
          label: "病案号",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "inpCode",
          label: "住院号",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "patientName",
          label: "病人姓名",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "orderItemName",
          label: "医嘱项目名称",
          align: "left",
          headerAlign: "center",
          width: "210"
        },
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          align: "left",
          headerAlign: "center",
          width: "210"
        },
        {
          prop: "finClassName",
          label: "财务分类码名称",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "chargePrice",
          label: "单价",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "chargeQuantity",
          label: "收费数量",
          align: "right",
          headerAlign: "center"
        },
        {
          prop: "chargeUnit",
          label: "收费单位",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "totalAmt",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "doctorName",
          label: "开单医生",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "chargeUserName",
          label: "收费人员名称",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        } ,
        {
          prop: "orderBillNum",
          label: "医嘱单号",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "originName",
          label: "产地名称",
          align: "left",
          headerAlign: "center",
          width: "210"
        },
        {
          prop: "packingNum",
          label: "包装量",
          align: "right",
          headerAlign: "center"
        },
        {
          prop: "packingUnit",
          label: "包装单位",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "dosageTypeName",
          label: "剂型名称",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "drugDosage",
          label: "剂量",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "dosageUnit",
          label: "剂量单位",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "useLevel",
          label: "用量",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "useLevelUnit",
          label: "用量单位",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "chargeItemChargeDetailId",
          label: "收费项目收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        },
        {
          prop: "oldChargeItemChargeDetailId",
          label: "原收费项目收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        },
        {
          prop: "orderItemChargeDetailId",
          label: "医嘱收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        },
         {
          prop: "finAdId",
          label: "财务住院ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        }
        // {
        //   prop: "sdeptCode",
        //   label: "所属科室编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "sdeptName",
        //   label: "所属科室名称",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "120"
        //},
        // {
        //   prop: "wdeptId",
        //   label: "所属病区ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "wdeptCode",
        //   label: "所属病区CODE",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "wdeptName",
        //   label: "所属病区名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "billSdeptId",
        //   label: "开单科室ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "billSdeptCode",
        //   label: "开单科室CODE",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "billSdeptName",
        //   label: "开单科室名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "billWdeptId",
        //   label: "开单病区ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "billWdeptCode",
        //   label: "开单病区编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "billWdeptName",
        //   label: "开单病区名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "curSdeptId",
        //   label: "当前科室ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "curSdeptCode",
        //   label: "当前科室编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "curSdeptName",
        //   label: "当前科室名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "curWdeptId",
        //   label: "当前病区ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "curWdeptCode",
        //   label: "当前病区编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "curWdeptName",
        //   label: "当前病区名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "mainOrderId",
        //   label: "主医嘱ID",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "orderId",
        //   label: "医嘱ID",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "orderItemId",
        //   label: "医嘱项目ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "orderItemCode",
        //   label: "医嘱项目编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },

        // {
        //   prop: "orderTime",
        //   label: "医嘱时间",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "160"
        // },

        // {
        //   prop: "orderBillId",
        //   label: "医嘱单据ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        //
        // {
        //   prop: "chargeItemId",
        //   label: "收费项目ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "chargeItemCode",
        //   label: "收费项目编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },

        // {
        //   prop: "finClassCode",
        //   label: "财务分类码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "mrClassCode",
        //   label: "病案分类码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "mrClassName",
        //   label: "病案分类码名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "controlLevel",
        //   label: "控制级别",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        //
        // {
        //   prop: "pharmacyMedicareFlag",
        //   label: "药房药品标志",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "selfPayAmt",
        //   label: "自付金额",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "freePayAmt",
        //   label: "记账金额",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "derateAmt",
        //   label: "减免金额",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // },
        //
        // {
        //   prop: "derateDetailId",
        //   label: "减免明细ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "300"
        // },
        // {
        //   prop: "orderChargeItemQuantity",
        //   label: "医嘱项目数量",
        //   align: "right",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "voluntarySelfPayFlag",
        //   label: "自愿自费标志",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "refundQuantity",
        //   label: "已退数量",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "doctorId",
        //   label: "医师ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "doctorCode",
        //   label: "医师编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        //
        // {
        //   prop: "manageDoctorId",
        //   label: "主管医师ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "manageDoctorCode",
        //   label: "主管医师编码",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "manageDoctorName",
        //   label: "主管医师名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "chargeUserId",
        //   label: "收费人员ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "chargeUserCode",
        //   label: "收费人员编码",
        //   align: "left",
        //   headerAlign: "center"
        // },
        //
        // {
        //   prop: "chargeMode",//0 普通收费 1 补费
        //   label: "收费方式",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "originId",
        //   label: "产地ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "originCode",
        //   label: "产地编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "drugFrequencyId",
        //   label: "频次ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "drugFrequencyCode",
        //   label: "频次编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "drugFrequencyName",
        //   label: "频次名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "drugApproachId",
        //   label: "途径ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "drugApproachCode",
        //   label: "途径CODE",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "drugApproachName",
        //   label: "途径名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        //
        // {
        //   prop: "chargeBatchNum",
        //   label: "批次号",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "100"
        // },
        // {
        //   prop: "dosageTypeId",
        //   label: "剂型ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "dosageTypeCode",
        //   label: "剂型编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },

        // {
        //   prop: "drugUsageId",
        //   label: "用法ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "durgUsageCode",
        //   label: "用法编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "durgUsageName",
        //   label: "用法名称",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "120"
        // },


      ],
      // 当前对象
      currentData: {},

      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100
      }
    };
  },

  mounted() {
    //this.search();
  },
  methods: {
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.search();
    },
    // 千位分隔
    formatNumber(a,b) {
      if (!a) {
        return "0.00";
      }
      if(!b){
        b = 2;
      }
      let res = a
        .toFixed(b)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    async getListPageInpChargeItemChargeDetail() {
      this.loading = true;
      let obj = {
          ...this.form,
          ...this.pageParams,
        patientCode:this.cardInfo.patientCode || "",
        startChargeTime: "",
         endChargeTime: ""
        };
        if (this.date && this.date.length > 1) {
          obj.startChargeTime = this.dayjs(this.date[0]).format("YYYY-MM-DD HH:mm:ss");
          obj.endChargeTime = this.dayjs(this.date[1]).format("YYYY-MM-DD HH:mm:ss");
        }else{
          this.$message.error('收费时间不能为空！');
          this.loading = false;
          return;
        }
      let res = await service.getListPageInpChargeItemChargeDetail(obj);
      this.loading = false;
      let datas = res.data;
      let tableData = [];
        for (let i in datas) {
          let obj = {
            ...datas[i]
           // // orderPrice: datas[i]["orderPrice"] || 0,
           //  selfPayAmt: datas[i]["selfPayAmt"] || 0,
           //  freePayAmt: datas[i]["freePayAmt"] || 0,
           //  derateAmt: datas[i]["derateAmt"] || 0,
           //  totalAmt: datas[i]["totalAmt"] || 0,
          };
          tableData.push(obj);
        }
      this.tableData = tableData;
      this.pageParams.total = res.total;
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getListPageInpChargeItemChargeDetail();
    },
     // 重置
    reset() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
      this.date = [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ];
      // 清空读卡组件卡号
      this.$refs.readCard.cancalCardData();
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getListPageInpChargeItemChargeDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getListPageInpChargeItemChargeDetail();
    },
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },

    // 查询交易信息(all)
    async getDataInfoAll() {
      try {
        let obj = {
          ...this.form,
          ...this.pageParams,
          patientCode:this.cardInfo.patientCode || "",
          startChargeTime: "",
          endChargeTime: ""
        };
        if (this.date && this.date.length > 1) {
          obj.startChargeTime = this.dayjs(this.date[0]).format("YYYY-MM-DD HH:mm:ss");
          obj.endChargeTime = this.dayjs(this.date[1]).format("YYYY-MM-DD HH:mm:ss");
        }else{
          this.$message.error('收费时间不能为空！');
          this.loading = false;
          return;
        }
        let res = await service.getListInpChargeItemChargeDetail(obj);
        let datas = res.data;
        let tableData = [];
        for (let i in datas) {
          let obj = {
            ...datas[i]
          };
          tableData.push(obj);
        }
        this.tableDatas = tableData;
      } catch (error) {
        this.$message.error(error.msg || "查询失败");
      }
    },
    // 导出
    async exportExcel() {
      await this.getDataInfoAll();

      let tableDatas = this.tableDatas;
      if (tableDatas.length === 0) {
        this.$message.warning("暂无要导出数据!");
        return;
      }
      const data = tableDatas.map(item => {
        const dataItem = {};
        for (let i in item) {
          if (
            i === "selfPayAmt" ||
            i === "packingNum" ||
            i === "totalAmt" ||
            i === "useLevel" ||
            i === "derateAmt" ||
            i === "drugDosage" ||
            i === "chargeQuantity" ||
            i === "freePayAmt"
          ) {
            dataItem[i] = !item[i]
              ? "0.00"
              : this.formatNumber(item[i]).toString();
          } else if (
            i === "chargePrice"
          ) {
            dataItem[i] = !item[i]
              ? "0.0000"
              : this.formatNumber(item[i],4).toString();
          } else {
            dataItem[i] = item[i].toString();
          }
        }
        return dataItem;
      });

      let excelData = {
        title: ["住院收费项目收费明细", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        tHeader: [
          "病案号",
          "住院号",
          "病人姓名",
          "医嘱项目名称",
          "收费项目名称",
          "财务分类码名称",
          "单价",
          "收费数量",
          "收费单位",
          "总金额",
          "开单医生",
          "收费人员名称",
          "收费时间",
          "产地名称",
          "包装量",
          "包装单位",
          "剂型名称",
          "剂量",
          "剂量单位",
          "用量",
          "用量单位",
          "规格",
          "收费项目收费明细ID",
          "原收费项目收费明细ID",
          "医嘱收费明细ID",
          "财务住院ID"
        ],
        filterVal: [
          "mrCode",
          "inpCode",
          "patientName",
          "orderItemName",
          "chargeItemName",
          "finClassName",
          "chargePrice",
          "chargeQuantity",
          "chargeUnit",
          "totalAmt",
          "doctorName",
          "chargeUserName",
          "chargeTime",
          "originName",
          "packingNum",
          "packingUnit",
          "dosageTypeName",
          "drugDosage",
          "dosageUnit",
          "useLevel",
          "useLevelUnit",
          "spec",
          "chargeItemChargeDetailId",
          "oldChargeItemChargeDetailId",
          "orderItemChargeDetailId",
          "finAdId"
        ],
        listDate: data,
        fileName: "住院收费项目收费明细",
        merges: ["A1:N1"]
      };
      jsonToExcel(excelData);
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
.catalogue {
  background-color:#fff;
.catalogue-left {
    width: 100%;

    // border-right: 1px solid $l-color-bgcolor-11;
  .search-area {
      display: flex;
    .search-input {
        flex: 1;
      }
    }
  .table-cont {
      height: calc(100% - 150px);
      margin: 10px 0;
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
    overflow-y:scroll;
  .catalogue-right-form {
      // height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
  .catalogue-right-btn {
      margin-top: 10px;
    }
  }
}
</style>
