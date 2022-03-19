<template>
  <el-card class="width100 height100 padding10 transaction-flow">
    <el-form class="search-area" :model="form" ref="form">
      <el-row :gutter="10" class="width100 margin-top-10">
        <el-col :span="6">
          <l-read-card ref="readCard" @readCard="getReadCard"></l-read-card>
        </el-col>
        <el-col :span="5">
          <LFormtTitle label="医嘱项目名称">
            <el-form-item prop="orderItemName">
              <el-input v-model="form.orderItemName" placeholder="请输入医嘱项目名称" clearable></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="5">
          <LFormtTitle label="医嘱单号">
            <el-form-item prop="orderBillNum">
              <el-input v-model="form.orderBillNum" placeholder="请输入医嘱单号" clearable></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="5">
          <LFormtTitle label="开单医生">
            <el-form-item prop="doctorName">
              <el-input v-model="form.doctorName" placeholder="请输入开单医生" clearable></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
          <!--<LFormtTitle label="医嘱收费明细ID">-->
            <!--<el-form-item prop="orderItemChargeDetailId">-->
              <!--<el-input v-model="form.orderItemChargeDetailId" placeholder="请输入医嘱收费明细ID" clearable></el-input>-->
            <!--</el-form-item>-->
          <!--</LFormtTitle>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
          <!--<LFormtTitle label="原医嘱收费明细ID">-->
            <!--<el-form-item prop="oldOrderItemChargeDetailId">-->
              <!--<el-input v-model="form.oldOrderItemChargeDetailId" placeholder="请输入原医嘱收费明细ID" clearable></el-input>-->
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
              width="100%"
              v-model="date"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable ="false"
            ></el-date-picker>
          </LFormtTitle>
        </el-col>
        <el-col :span="5" class="float-right">
          <el-button type="primary" plain class="float-right" @click="exportExcel">导出</el-button>
          <el-button
            type="primary"
            plain
            class="float-right"
            style="margin-right:20px;"
            @click="reset"
          >重置</el-button>
         <el-button
            type="primary"
            class="float-right"
            style="margin-right:20px;"
            @click="select"
          >查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="tableHeight">
      <el-table
        :data="tableData"
        @row-dblclick="rowDblclick"
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
            <template v-if="item.prop == 'selfPayAmt' || item.prop == 'totalAmt' || item.prop == 'derateAmt' || item.prop == 'freePayAmt' || item.prop == 'orderQuantity'
             || item.prop == 'packingNum' || item.prop == 'refundOrderQuantiye'|| item.prop == 'useLevel'|| item.prop == 'drugDosage' ">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'orderPrice' ">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop],4)}}</span>
              <span v-if="!scope.row[item.prop]">0.0000</span>
            </template>
            <!--<template v-else-if="item.prop == 'orderUnit' || item.prop == 'packingUnit'">-->
                <!--<span-->
                  <!--:val="scope.row[item.prop]"-->
                  <!--code="DrugUnit"-->
                  <!--v-codeTransform-->
                <!--&gt;</span>-->
            <!--</template>-->
            <!--<template v-else-if="item.prop == 'dosageUnit' || item.prop == 'useLevelUnit'">-->
                <!--<span-->
                  <!--:val="scope.row[item.prop]"-->
                  <!--code="DrugDoseUnit"-->
                  <!--v-codeTransform-->
                <!--&gt;</span>-->
            <!--</template>-->
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

    <el-dialog title="住院收费项目收费明细" :visible.sync="otherDialogVisible" width="80%" class="dialog">
      <div class="tableTwo padding10">
        <el-table
          :data="tableDataTwo"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loadingTwo"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
        >
          <el-table-column
            v-for="(item, index) in tableParamsTwo"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width|| (item.label.length * 18 + 24)"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
            <template v-if=" item.prop == 'selfPayAmt' || item.prop == 'totalAmt' || item.prop == 'derateAmt' || item.prop == 'freePayAmt' ">
              <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'orderPrice' ">
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
    </el-dialog>
  </el-card>
</template>
<script>
import baseApi from "@/api/financeManagement/inp.js";
import { jsonToExcel } from "@/utils/excel/excel";
export default {
  data() {
    return {
      cardInfo:{},
      getDeptInfo: [], //科室下拉框列表
      loading: false,
      // 表格数据
      tableData: [],
      tableDatas: [],
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
          headerAlign: "center"
        },
        {
          prop: "majorOrderName",
          label: "医嘱大类名称",
          align: "left",
          headerAlign: "center"
        } ,
        {
          prop: "orderItemName",
          label: "医嘱项目名称",
          align: "left",
          headerAlign: "center",
          width: "210"
        } ,
        {
          prop: "orderPrice",
          label: "单价",
          align: "right",
          headerAlign: "center",
          width: "90"
        } ,
        {
          prop: "orderUnit",
          label: "单位",
          align: "left",
          headerAlign: "center"
        } ,
        {
          prop: "orderQuantity",
          label: "医嘱数量",
          align: "right",
          headerAlign: "center",
          width: "90"
        } ,
        {
          prop: "totalAmt",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        } ,
        {
          prop: "refundOrderQuantiye",
          label: "已退数量",
          align: "right",
          headerAlign: "center",
          width: "90"
        } ,
        {
          prop: "orderBillNum",
          label: "医嘱单号",
          align: "left",
          headerAlign: "center"
        } ,
        {
          prop: "orderTime",
          label: "医嘱时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        } ,
        {
          prop: "doctorName",
          label: "开单医生",
          align: "left",
          headerAlign: "center",
          width: "120"
        } ,
        {
          prop: "chargeUserName",
          label: "收费人员名称",
          align: "left",
          headerAlign: "center"
        } ,
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        } ,
        {
          prop: "chargeChannelName",
          label: "收费渠道",
          align: "left",
          headerAlign: "center"
        } ,
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
          prop: "orderItemChargeDetailId",
          label: "医嘱收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        },
        {
          prop: "oldOrderItemChargeDetailId",
          label: "原医嘱收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "280"
        },
        {
          prop: "tradeId",
          label: "交易ID",
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
        //   prop: "sdeptId",
        //   label: "所属科室ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "sdeptCode",
        //   label: "所属科室编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "sdeptName",
        //   label: "所属科室名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "wdeptId",
        //   label: "所属病区ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // },
        //  {
        //   prop: "wdeptCode",
        //   label: "所属病区CODE",
        //   align: "right",
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
        //   align: "right",
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
        //   width: "100"
        // },
        // {
        //   prop: "billWdeptCode",
        //   label: "开单病区编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "160"
        // },
        // {
        //   prop: "billWdeptName",
        //   label: "开单病区名称",
        //   headerAlign: "center",
        //   align: "left"
        // }
        // ,
        // {
        //   prop: "curSdeptId",
        //   label: "当前科室ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "curSdeptCode",
        //   label: "当前科室编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "curSdeptName",
        //   label: "当前科室名称",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "curWdeptId",
        //   label: "当前病区ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "curWdeptCode",
        //   label: "当前病区编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "curWdeptName",
        //   label: "当前病区名称",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "mainOrderId",
        //   label: "主医嘱ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "280"
        // } ,
        // {
        //   prop: "orderId",
        //   label: "医嘱ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "280"
        // } ,
        // {
        //   prop: "orderItemId",
        //   label: "医嘱项目ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "orderItemCode",
        //   label: "医嘱项目编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,

        // {
        //   prop: "majorOrderId",
        //   label: "医嘱大类ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "majorOrderCode",
        //   label: "医嘱大类编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,

        // {
        //   prop: "subclassOrderId",
        //   label: "医嘱子类ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "subclassOrderCode",
        //   label: "医嘱子类编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "subclassOrderName",
        //   label: "医嘱子类名称",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        //
        // {
        //   prop: "orderBillId",
        //   label: "医嘱单据ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "280"
        // } ,
        // {
        //   prop: "medicalGroupLeaderName",
        //   label: "医疗组组长名称",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        //
        //
        // {
        //   prop: "voluntarySelfPayFlag",
        //   label: "自愿自费标志",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "selfPayAmt",
        //   label: "自付金额",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "freePayAmt",
        //   label: "记账金额",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "derateAmt",
        //   label: "减免金额",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "derateDetailId",
        //   label: "减免明细ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "280"
        // } ,
        // {
        //   prop: "doctorId",
        //   label: "医师ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "doctorCode",
        //   label: "医师编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        //
        // {
        //   prop: "siApproveFlag",
        //   label: "医保用药审批标志",
        //   align: "left",
        //   headerAlign: "center"
        // } ,

        // {
        //   prop: "chargeChannelId",
        //   label: "收费渠道ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "chargeChannelCode",
        //   label: "收费渠道编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,

        // {
        //   prop: "externalSerialNum",
        //   label: "外部流水号",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // } ,
        // {
        //   prop: "oldExternalSerialNum",
        //   label: "原外部流水号",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150"
        // } ,
        // {
        //   prop: "manageDoctorId",
        //   label: "主管医师ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "manageDoctorCode",
        //   label: "主管医师编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "manageDoctorName",
        //   label: "主管医师名称",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "chargeUserId",
        //   label: "收费人员ID",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,
        // {
        //   prop: "chargeUserCode",
        //   label: "收费人员编码",
        //   align: "right",
        //   headerAlign: "center",
        //   width: "90"
        // } ,

        // {
        //   prop: "chargeMode",
        //   label: "收费方式",//0 普通收费 1 补费（补费用于事后收费，不校验可用余额）
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "costTime",
        //   label: "费用发生时间",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "160"
        // } ,
        // {
        //   prop: "actualOrderChargeFinAdId",
        //   label: "实际发生费用患者财务住院ID",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "actualOrderChargeAdNum",
        //   label: "实际发生费用患者住院号",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "actualOrderChargeEmrId",
        //   label: "实际发生费用患者档案号",
        //   align: "left",
        //   headerAlign: "center"
        // } ,
        // {
        //   prop: "bedId",
        //   label: "床位ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "bedNum",
        //   label: "床位号",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "medicalGroupId",
        //   label: "医疗组ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "medicalGroupCode",
        //   label: "医疗组编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "medicalGroupName",
        //   label: "医疗组名称",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "120"
        // },
        // {
        //   prop: "executeDeptId",
        //   label: "执行部门ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "executeDeptCode",
        //   label: "执行部门编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "executeDeptName",
        //   label: "执行部门名称",
        //   align: "left",
        //   headerAlign: "center"
        // },
        // {
        //   prop: "medicalGroupLeaderId",
        //   label: "医疗组组长ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        // {
        //   prop: "medicalGroupLeaderCode",
        //   label: "医疗组组长编码",
        //   align: "left",
        //   headerAlign: "center"
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
        // }
      ],
      // 查询表单
      form: {
        // orderItemChargeDetailId: "",
        // oldOrderItemChargeDetailId: "",
        // tradeId: "",
        orderItemName: "",
        orderBillNum: "",
        doctorName: "",
        mrCode: "",
        inpCode: "",
        //finAdId: "",
        patientName: ""
      },

      // 时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 项目费用明细
      otherDialogVisible: false,
      tableDataTwo: [],
      tableParamsTwo: [
        {
          prop: "chargeItemChargeDetailId",
          label: "收费项目收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "190"
        },
        {
          prop: "oldChargeItemChargeDetailId",
          label: "原收费项目收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "190"
        },
        {
          prop: "orderItemChargeDetailId",
          label: "医嘱收费明细ID",
          align: "left",
          headerAlign: "center",
          width: "190"
        },
         {
          prop: "finAdId",
          label: "财务住院ID",
          align: "left",
          headerAlign: "center",
          width: "190"
        },
        {
          prop: "mrCode",
          label: "病案号",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "inpCode",
          label: "住院号",
          align: "left",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "patientName",
          label: "病人姓名",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        // {
        //   prop: "sdeptCode",
        //   label: "所属科室编码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "sdeptName",
          label: "所属科室名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
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
        {
          prop: "wdeptName",
          label: "所属病区名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
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
        {
          prop: "billSdeptName",
          label: "开单科室名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
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
        {
          prop: "billWdeptName",
          label: "开单病区名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
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
        {
          prop: "curSdeptName",
          label: "当前科室名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
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
        {
          prop: "curWdeptName",
          label: "当前病区名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "mainOrderId",
          label: "主医嘱ID",
          align: "left",
          headerAlign: "center",
          width: "190"
        },
        {
          prop: "orderId",
          label: "医嘱ID",
          align: "left",
          headerAlign: "center",
          width: "190"
        },
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
        {
          prop: "orderItemName",
          label: "医嘱项目名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "orderTime",
          label: "医嘱时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
         {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        } ,
        // {
        //   prop: "orderBillId",
        //   label: "医嘱单据ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "orderBillNum",
          label: "医嘱单据号",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
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
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        // {
        //   prop: "finClassCode",
        //   label: "财务分类码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "finClassName",
          label: "财务分类码名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        // {
        //   prop: "mrClassCode",
        //   label: "病案分类码",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "mrClassName",
          label: "病案分类码名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "controlLevel",
          label: "控制级别",
          align: "left",
          headerAlign: "center",
          width: "90"
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
          prop: "pharmacyMedicareFlag",
          label: "药房药品标志",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "selfPayAmt",
          label: "自付金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "freePayAmt",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "derateAmt",
          label: "减免金额",
          align: "right",
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
          prop: "derateDetailId",
          label: "减免明细ID",
          align: "left",
          headerAlign: "center",
          width: "190"
        },
        {
          prop: "orderChargeItemQuantity",
          label: "医嘱项目数量",
          align: "right",
          headerAlign: "center"
        },
        {
          prop: "voluntarySelfPayFlag",
          label: "自愿自费标志",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "refundQuantity",
          label: "已退数量",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        // {
        //   prop: "doctorId",
        //   label: "医师ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "doctorCode",
          label: "医师编码",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "doctorName",
          label: "医师名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        // {
        //   prop: "manageDoctorId",
        //   label: "主管医师ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "manageDoctorCode",
          label: "主管医师编码",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "manageDoctorName",
          label: "主管医师名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        // {
        //   prop: "chargeUserId",
        //   label: "收费人员ID",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "chargeUserCode",
          label: "收费人员编码",
          align: "left",
          headerAlign: "center"
        },
        {
          prop: "chargeUserName",
          label: "收费人员名称",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "chargeMode",//0 普通收费 1 补费
          label: "收费方式",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
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
        {
          prop: "originName",
          label: "产地名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
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
        {
          prop: "drugFrequencyName",
          label: "频次名称",
          align: "left",
          headerAlign: "center"
        },
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
        {
          prop: "drugApproachName",
          label: "途径名称",
          align: "left",
          headerAlign: "center"
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
          prop: "chargeBatchNum",
          label: "批次号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
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
        {
          prop: "dosageTypeName",
          label: "剂型名称",
          align: "left",
          headerAlign: "center"
        },
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
        {
          prop: "durgUsageName",
          label: "用法名称",
          align: "left",
          headerAlign: "center",
          width: "120"
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
          width: "90"
        }
      ],
      loadingTwo: false,
      //当前票据对象
      currentData: {}

    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  created() {
    // const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
    // const end = new Date(
    //   new Date(new Date().toLocaleDateString()).getTime() +
    //     24 * 60 * 60 * 1000 -
    //     1
    // );
    // this.date = [start, end];
  },
  mounted() {
    this.select();

  },
  methods: {
    getReadCard(data) {
      //获取读卡信息
      this.cardInfo = data;
      this.select();
    },


    // 查询医嘱交易信息
    async getDataInfo() {
      try {
        this.loading = true;
        let obj = {
          ...this.form,
          ...this.pageParams,
          patientCode:this.cardInfo.patientCode || "",
          startChargeTime: "",
          endChargeTime: ""
        };
        if (this.date && this.date.length > 1) {
          obj.startChargeTime = this.date[0];
          obj.endChargeTime = this.date[1];
        }else{
          this.$message.error('收费时间不能为空！');
          this.loading = false;
          return;
        }
        let res = await baseApi.getListPageInpOrderItemChargeDetail(obj);
        let datas = res.data;
        let tableData = [];
        for (let i in datas) {
          let obj = {
            ...datas[i],
            orderPrice: datas[i]["orderPrice"] || 0,
            selfPayAmt: datas[i]["selfPayAmt"] || 0,
            freePayAmt: datas[i]["freePayAmt"] || 0,
            derateAmt: datas[i]["derateAmt"] || 0,
            totalAmt: datas[i]["totalAmt"] || 0
          };
          tableData.push(obj);
        }
        this.tableData = tableData;
        this.pageParams.total = res.total;
        // this.pageParams = res.pageParams;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },

    handleClick(){
      console.info(this.currentDataOrderDetail);
      this.tableDataThree = this.currentDataOrderDetail;
    },
    // load
    load() {
      console.log(this.tlm_noMore, this.pageParams);
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getDataInfo();
    },
    // 查询
    select() {
      this.pageParams.pageNo = 1;
      this.getDataInfo();
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
    // 获取项目费用明细
   async getListInpChargeItemChargeDetail(tid) {
       try {
            this.loadingTwo = true;
            let params = {
              'chargeItemChargeDetailId': tid
             };
           let res = await baseApi.getListInpChargeItemChargeDetail(params)
            if (res.code === 1) {
              this.tableDataTwo = res.data;
            }
            this.loadingTwo = false;
        } catch (error) {
            this.loadingTwo = false;
            this.$message.error(error.msg || "查询失败");
        }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getDataInfo();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getDataInfo();
    },
    rowDblclick(row) {
      this.otherDialogVisible = true;
      this.getListInpChargeItemChargeDetail(row.orderItemChargeDetailId);
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
          obj.startChargeTime = this.date[0];
          obj.endChargeTime = this.date[1];
        }else{
          this.$message.error('收费时间不能为空！');
          this.loading = false;
          return;
        }
        let res = await baseApi.getListInpOrderItemChargeDetail(obj);
        let datas = res.data;
        let tableData = [];
        for (let i in datas) {
          let obj = {
            ...datas[i],
            orderPrice: datas[i]["orderPrice"] || 0,
            selfPayAmt: datas[i]["selfPayAmt"] || 0,
            freePayAmt: datas[i]["freePayAmt"] || 0,
            derateAmt: datas[i]["derateAmt"] || 0,
            totalAmt: datas[i]["totalAmt"] || 0
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
            i === "refundOrderQuantiye" ||
            i === "useLevel" ||
            i === "derateAmt" ||
            i === "drugDosage" ||
            i === "orderQuantity" ||
            i === "freePayAmt"
          ) {
            dataItem[i] = !item[i]
              ? "0.00"
              : this.formatNumber(item[i]).toString();
          } else if (
            i === "orderPrice"
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
        title: ["住院医嘱项目收费明细", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        tHeader: [
          "病案号",
          "住院号",
          "病人姓名",
          "医嘱大类名称",
          "医嘱项目名称",
          "单价",
          "单位",
          "医嘱数量",
          "总金额",
          "已退数量",
          "医嘱单号",
          "医嘱时间",
          "开单医生",
          "收费人员名称",
          "收费时间",
          "收费渠道",
          "产地名称",
          "包装量",
          "包装单位",
          "剂型名称",
          "剂量",
          "剂量单位",
          "用量",
          "用量单位",
          "规格",
          "医嘱收费明细ID",
          "原医嘱收费明细ID",
          "交易ID",
          "财务住院ID"
        ],
        filterVal: [
          "mrCode",
          "inpCode",
          "patientName",
          "majorOrderName",
          "orderItemName",
          "orderPrice",
          "orderUnit",
          "orderQuantity",
          "totalAmt",
          "refundOrderQuantiye",
          "orderBillNum",
          "orderTime",
          "doctorName",
          "chargeUserName",
          "chargeTime",
          "chargeChannelName",
          "originName",
          "packingNum",
          "packingUnit",
          "dosageTypeName",
          "drugDosage",
          "dosageUnit",
          "useLevel",
          "useLevelUnit",
          "spec",
          "orderItemChargeDetailId",
          "oldOrderItemChargeDetailId",
          "tradeId",
          "finAdId"
        ],
        listDate: data,
        fileName: "住院医嘱项目收费明细",
        merges: ["A1:N1"]
      };
      jsonToExcel(excelData);
    }
  }
};
</script>
<style lang="scss" scoped>

.transaction-flow {
  .el-tabs div:hover{
    color:#fff !important;
  }
  .margin-top-10 {
    margin-top: 10px;
  }
  .tableHeight {
    width: 100%;
    height: calc(100% - 162px);
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .tableTwo {
    height: 400px;
  }
  .tableThree {
    height: 300px;
  }
  .page {
    text-align: right;
    margin-top: 20px;
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
}
</style>
