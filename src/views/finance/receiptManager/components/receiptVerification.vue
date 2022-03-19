<template>
  <div class="width100 height100 padding20">
    <l-card-title>
      <span slot="left">票据核销记录</span>
    </l-card-title>
    <el-form class="search-area" :model="form" ref="form">
      <el-row :gutter="10">
        <el-col :span="5">
          <el-form-item prop="receiptType">
            <el-radio-group v-model="form.recordStatus">
              <el-radio :label="3">待核销</el-radio>
              <el-radio :label="6">已核销</el-radio>
              <el-radio :label="9">全部</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <LFormtTitle label="上缴时间">
            <el-form-item prop="receiptType">
              <el-date-picker
                class="datetimerange"
                clearable
                v-model="form.value3"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="5">
          <LFormtTitle label="票据类型">
            <el-form-item prop="receiptType">
              <l-value-domain code="RECEIPT_TYPE" :value.sync="form.receiptType" clearable />
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="5">
          <LFormtTitle label="领用人员">
            <el-form-item prop="outUserId">
              <l-value-domain
                :value.sync="form.outUserId"
                remoteUrl="/wadmin/dept-user/119/2"
                :remoteParams="''"
                remoteShowKey="uname"
                remoteValueKey="uid"
                placeholder="请选择"
                @change="setUser"
                clearable
              />
            </el-form-item>
          </LFormtTitle>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="margin-top-20">
        <el-col :span="24">
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="cancel">重置</el-button>
            <el-button type="primary" @click="cancel">确认核销</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="table-cont">
      <el-table
        :data="tableData"
        width="100%"
        height="calc(100% - 38px)"
        stripe
        border
        v-loadmore="load"
        v-loading="loading"
        :element-loading-text="$t('retreat.loadInfo')"
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
            <template v-if="item.prop == 'receiptType'">
              <span :val="scope.row['receiptType']" code="RECEIPT_TYPE" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'abortStatus'">
              <span>{{scope.row['abortStatus'] == '1'?'停用':'启用'}}</span>
            </template>
            <template v-else-if="item.prop == 'divisionCode'">
              <span :val="scope.row['divisionCode']" code="DIVISION_CODE" v-codeTransform></span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import service from "@/api/systemManagement/receipt/receipt";
export default {
  name: "receiptVerification",
  data() {
    return {
      // loading
      loading: false,
      // 查询表单
      form: {},
      // 表格数据
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "recordStatus",
          label: "核销状态",
          align: "left",
          width: "100"
        },
        {
          prop: "receiptType",
          label: "票据类型",
          align: "left",
          width: "70"
        },
        {
          prop: "receiveUserName",
          label: "上缴类型",
          align: "left",
          width: "70"
        },
        {
          prop: "receiptStartNum",
          label: "起始票据号",
          align: "left",
          width: "70"
        },
        {
          prop: "receiptStopNum",
          label: "终止票据号",
          align: "left",
          width: "70"
        },
        {
          prop: "receiptUsedNum",
          label: "总张数",
          align: "left",
          width: "70"
        },
        {
          prop: "receiveUserName",
          label: "领用人员",
          align: "left",
          width: "70"
        },
        {
          prop: "outTime",
          label: "领用时间",
          align: "left",
          width: "60"
        },
        {
          prop: "outUserName",
          label: "上缴人员",
          align: "left",
          width: "70"
        },
        {
          prop: "outTime",
          label: "上缴时间",
          align: "left",
          width: "120"
        },
        {
          prop: "outTime",
          label: "核销人员",
          align: "left",
          width: "120"
        },
        {
          prop: "outTime",
          label: "核销时间",
          align: "left",
          width: "120"
        },
        {
          prop: "divisionCode",
          label: "院区",
          align: "left",
          width: "120"
        }
      ],
      // 状态列表
      abortStatusList: [
        {
          label: "启用",
          value: "0"
        },
        {
          label: "停用",
          value: "1"
        }
      ]
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    load() {},
    // 取消
    cancel() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    // 查询
    async search() {
      try {
        // 当前选中入库票据
        this.loading = true;
        let obj = {
          pageSize: 20,
          pageNo: 1,
          ...this.form
        };
        let res = await service.getReceiptOutList(obj);
        this.tableData = res.data;
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "获取出库列表失败");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.search-area {
  padding: 20px;
  background-color: $l-color-bgcolor-18;
}
.table-cont {
  height: calc(100% - 155px);
  margin-top: 20px;
}
.datetimerange {
  width: 100%;
}
.margin-top-20 {
  margin-top: 20px;
}
</style>