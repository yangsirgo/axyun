<template>
  <el-card class="width100 height100 padding10 prestore-grant-sel">
    <el-row :gutter="10" class="width100">
      <el-col :span="4">
        <l-read-card ref="lReadCard" @readCard="readCard"></l-read-card>
      </el-col>
      <el-col :span="3">
        <LFormtTitle label="患者姓名">
          <el-input v-model="form.patientName" placeholder="请输入" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="6">
        <LFormtTitle label="授权时间">
          <el-date-picker
            width="100%"
            v-model="date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00','23:59:59']"
            clearable
          ></el-date-picker>
        </LFormtTitle>
      </el-col>
      <el-col :span="3">
        <LFormtTitle label="操作类型">
          <el-select v-model="form.grantRecycleType" placeholder="请选择">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="授权" :value="'1'"></el-option>
            <el-option label="手动回收" :value="'2'"></el-option>
            <el-option label="自动回收" :value="'3'"></el-option>
          </el-select>
        </LFormtTitle>
      </el-col>
      <el-col :span="6" class="float-right">
        <!-- <el-button type="primary" plain class="float-right">导出</el-button> -->
        <!--暂时隐藏掉-->
        <el-button type="primary" plain class="float-right margin-right-10" @click="cancel">重置</el-button>
        <el-button type="primary" class="float-right margin-right-10" @click="sel()">查询</el-button>
      </el-col>
    </el-row>

    <el-table
      style="margin-top:10px;"
      :data="tableData"
      width="100%"
      height="calc(100% - 100px)"
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
        :min-width="item.width"
        :align="item.align || 'left'"
        :header-align="item.headerAlign || 'left'"
        :fixed="item.fixed"
      >
        <template slot-scope="scope">
          <template v-if="item.prop == 'recordStatus'">
            <span v-if="scope.row[item.prop] == '0'">已申请</span>
            <span v-if="scope.row[item.prop] == '1'">已授权</span>
            <span v-if="scope.row[item.prop] == '2'">已撤销</span>
          </template>
          <template v-else-if="item.prop == 'grantRecycleType'">
            <span v-if="scope.row[item.prop] == '1'">授权</span>
            <span v-if="scope.row[item.prop] == '2'">手动回收</span>
            <span v-if="scope.row[item.prop] == '3'">自动回收</span>
          </template>
          <template v-else-if="item.prop == 'patientGender'">
            <span
              :val="scope.row[item.prop]"
              code="GENDER_CODE"
              v-codeTransform
              v-if="scope.row[item.prop]"
            ></span>
          </template>
          <template v-else-if="item.prop == 'applyReason'">
            <span :val="scope.row['applyReason']" code="grantAppyReason" v-codeTransform></span>
          </template>
          <template v-else-if="item.prop == 'applyMoney'">
            <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
            <span v-if="!scope.row[item.prop]">0.00</span>
          </template>
          <template v-else-if="item.prop == 'grantMoney'">
            <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
            <span v-if="!scope.row[item.prop]">0.00</span>
          </template>
          <template v-else>
            <span class="overflow-point">{{ scope.row[item.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="paper">
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
  </el-card>
</template>
<script>
import service from "@/api/financeManagement/prestoreGrant";
// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};
export default {
  data() {
    return {
      cardData: "",
      date: [
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format(
          "yyyy-MM-dd"
        ) + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      form: {
        grantRecycleType: "",
        patientName: "",
        startDate: "",
        stopDate: ""
      },
      // 表格数据
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: true
        },
        {
          prop: "patientCode",
          label: "病人编号",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: true
        },
        {
          prop: "patientGender",
          label: "性别",
          align: "left",
          headerAlign: "center",
          width: "70",
          fixed: true
        },
        {
          prop: "grantRecycleType",
          label: "操作类型",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: true
        },
        {
          prop: "grantDepartmentName",
          label: "授权部门",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: true
        },
        {
          prop: "grantUserName",
          label: "授权人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "grantMoney",
          label: "授权金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "grantTime",
          label: "授权时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "applyMoney",
          label: "申请额度",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "applyUserName",
          label: "申请人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "applyTime",
          label: "申请时间",
          align: "right",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "applyReason",
          label: "申请原因",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "validTime",
          label: "有效时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "100"
        }
      ],
      patient: {},
      loading: false,
      // 分页in
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0
      }
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
  mounted() {
    this.sel();
  },
  methods: {
    readCard(data) {
      this.patient = data;
      this.sel();
    },
    // 获取授权透支明细
    async getPrestoreGrantOverdrawPOs() {
      try {
        this.loading = true;
        if (this.date && this.date.length > 1) {
          this.form.startDate = this.date[0];
          this.form.stopDate = this.date[1];
        } else {
          this.form.startDate = "";
          this.form.stopDate = "";
        }
        let res = await service.getPrestoreGrantOverdrawPOs({
          patientId: this.patient.patientId || undefined,
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
          ...this.form
        });
        // this.tableData.push(...res.data);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.mag || "获取患者授权透支列表失败");
      }
    },
    // load
    // load() {
    //   if (this.tlm_noMore) {
    //     return;
    //   }
    //   this.pageParams.pageNo++;
    //   this.getPrestoreGrantOverdrawPOs();
    // },
    sel() {
      this.tableData = [];
      this.pageParams.pageNo = 1;
      this.getPrestoreGrantOverdrawPOs();
    },
    cancel() {
      this.$refs.lReadCard.cancalCardData();
      this.date = [];
      this.form = {
        grantRecycleType: "",
        patientName: ""
      };
      this.patient = {};
      this.sel();
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
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getPrestoreGrantOverdrawPOs();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPrestoreGrantOverdrawPOs();
    }
  }
};
</script>
<style lang="scss" scoped>
.prestore-grant-sel {
  .paper {
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