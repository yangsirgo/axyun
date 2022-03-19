<template>
  <div class="vxe-table-style width100 height100">
    <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button @click="allAlign = 'left'">居左</vxe-button>
        <vxe-button @click="allAlign = 'center'">居中</vxe-button>
        <vxe-button @click="allAlign = 'right'">居右</vxe-button>
      </template>
    </vxe-toolbar>
    <div class="table-contain">
      <vxe-table
        :align="allAlign"
        :data="recordTableData"
        :loading="loading"
        :seq-config="{ seqMethod: seqMethod }"
        :edit-config="{ trigger: 'click', mode: 'row' }"
        resizable
        height="100%"
        empty-text="没有更多数据了！"
        border
        highlight-hover-row
      >
        <vxe-table-column
          type="seq"
          title="序号"
          width="60"
          fixed="left"
        ></vxe-table-column>
        <vxe-table-column
          field="regTime"
          title="挂号时间"
          width="170"
          :edit-render="{}"
          fixed="left"
          sortable
        >
          <template v-slot:edit="{ row }">
            <el-date-picker
              v-model="row.regTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ row.regTime }}</template>
        </vxe-table-column>
        <vxe-table-column
          field="doctorName"
          title="就诊医生"
          fixed="left"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="patientName"
          title="患者姓名"
          fixed="left"
          width="100"
          :filters="[{ data: '' }]"
          :filter-render="{
            name: 'ElInput',
            props: { placeholder: '请输入名称' },
          }"
        ></vxe-table-column>

        <vxe-table-column
          field="patientGender"
          title="性别"
          width="100"
          :filters="[
            { value: '2', label: '女' },
            { value: '1', label: '男' },
          ]"
          :cell-render="{ name: 'patientGender' }"
        ></vxe-table-column>

        <vxe-table-column
          field="phoneNum"
          title="联系电话"
          :edit-render="{ name: 'input' }"
          width="170"
        ></vxe-table-column>
        <vxe-table-column
          field="patientAge"
          title="年龄"
          width="100"
          :filters="[
            { label: '年龄大于10', value: 10 },
            { label: '年龄大于40', value: 40 },
          ]"
          :filter-method="filterAgeMethod"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="settlementType"
          title="结算类型"
          width="100"
          :cell-render="{ name: 'mySettlementType' }"
        ></vxe-table-column>
        <vxe-table-column
          field="diagName"
          title="病人诊断"
          :edit-render="{ name: 'input' }"
          width="170"
        ></vxe-table-column>
        <vxe-table-column
          field="outpDeptName"
          width="100"
          title="就诊科室"
        ></vxe-table-column>
        <vxe-table-column
          field="drugNum"
          width="100"
          title="药物处方数"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="adviceNum"
          width="100"
          title="非药物处方数"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="amt"
          width="100"
          title="金额"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="diagTime"
          title="开始时间"
          width="170"
          :filters="[{ data: [] }]"
          :filter-render="{
            name: 'ElDatePicker',
            props: {
              type: 'datetimerange',
              rangeSeparator: '至',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              format: 'yyyy-MM-dd HH:mm:ss',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
            },
          }"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="isEndEmr"
          width="100"
          title="是否完善病历"
          :formatter="formatterNum"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="careerCode"
          title="职业代码"
          width="100"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="identificationNum"
          title="身份证号"
          width="170"
          sortable
        ></vxe-table-column>
        <vxe-table-column
          field="relateAddr"
          title="联系地址"
          show-overflow
          width="120"
        ></vxe-table-column>
        <vxe-table-column
          field="triageStatus"
          title="门诊类型"
          width="100"
          :cell-render="{ name: 'triageStatus' }"
        ></vxe-table-column>
        <vxe-table-column
          field="hosId"
          width="200"
          title="就诊机构"
          show-overflow
          :cell-render="{ name: 'hosName' }"
        ></vxe-table-column>
        <vxe-table-column
          field="visitCode"
          title="就诊号码"
          width="170"
          :filters="[{ data: { type: 'has', name: '' } }]"
          :filter-render="{ name: 'FilterComplex' }"
        ></vxe-table-column>
        <vxe-table-column title="操作" width="200" fixed="right">
          <template v-slot="{ row, rowIndex }">
            <el-button type="primary" @click="saveEvent(row)">修改</el-button>
            <el-button @click="deleteEvent(row)">删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>

    <vxe-pager
      perfect
      :current-page.sync="pageParams.pageNo"
      :page-size.sync="pageParams.pageSize"
      :total="total"
      :page-sizes="[
        10,
        20,
        100,
        { label: '大量数据', value: 1000 },
        { label: '全量数据', value: -1 },
      ]"
      :layouts="[
        'PrevJump',
        'PrevPage',
        'Number',
        'NextPage',
        'NextJump',
        'Sizes',
        'FullJump',
        'Total',
      ]"
      @page-change="handlePageChange1"
    >
    </vxe-pager>
  </div>
</template>

<script>
import { getHistoryVisitList } from "@/api/cis/order/order.js";
import XEUtils from "xe-utils";
import VXETable from "vxe-table";

// 创建一个条件的渲染器
VXETable.renderer.add("FilterComplex", {
  // 不显示底部按钮，使用自定义的按钮
  isFooter: false,
  // 筛选模板
  renderFilter(h, renderOpts, params) {
    return [<filter-complex params={params} />];
  },
  // 重置数据方法
  filterResetMethod({ options }) {
    options.forEach(option => {
      option.data = { type: "has", name: "" };
    });
  },
  // 筛选数据方法
  filterMethod({ option, row, column }) {
    const cellValue = XEUtils.get(row, column.property);
    const { name } = option.data;
    if (cellValue) {
      return cellValue.indexOf(name) > -1;
    }
    return false;
  }
});

// 支持结算类型反显
VXETable.renderer.add("mySettlementType", {
  // 默认显示模板
  renderDefault(h, renderOpts, params) {
    let { row, column } = params;
    return [
      <span val={row[column.property]} code="settlementType" v-codeTransform />
    ];
  }
});

// 支持性别反显
VXETable.renderer.add("patientGender", {
  // 默认显示模板
  renderDefault(h, renderOpts, params) {
    let { row, column } = params;
    return [
      <span val={row[column.property]} code="GENDER_CODE" v-codeTransform />
    ];
  }
});

// 支持 门诊类型反显
VXETable.renderer.add("triageStatus", {
  // 默认显示模板
  renderDefault(h, renderOpts, params) {
    let { row, column } = params;
    return [
      <span val={row[column.property]} code="FirstOrNo" v-codeTransform />
    ];
  }
});

// 支持 就诊机构反显
VXETable.renderer.add("hosName", {
  // 默认显示模板
  renderDefault(h, renderOpts, params) {
    let { row, column } = params;
    let mapObj = {
      org_type: "_HOS_",
      id: row[column.property]
    };
    return [
      <span
        tableName="sys_org"
        columns="org_nm"
        conditionMap={mapObj}
        v-tableTransform
      />
    ];
  }
});

export default {
  name: "",
  components: { VXETable },
  data() {
    return {
      allAlign: "center",
      pageParams: {
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      recordTableData: [],
      loading: false
    };
  },
  created() {
    this.query();
  },
  methods: {
    saveEvent(row, field) {
      console.log(row);
    },
    deleteEvent(row, field) {
      console.log(row);
    },
    formatterNum({ cellValue }) {
      return cellValue == 1 ? "是" : "否";
    },
    filterAgeMethod({ value, row }) {
      return parseFloat(row.patientAge) >= value;
    },
    seqMethod({ row, rowIndex, column, columnIndex }) {
      return (
        (this.pageParams.pageNo - 1) * this.pageParams.pageSize + rowIndex + 1
      );
    },
    query() {
      this.loading = true;
      const params = {
        ...this.pageParams
      };
      getHistoryVisitList(params)
        .then(res => {
          const { code, data, msg, pageNo, total } = res;
          if (code === 1) {
            this.recordTableData = data;
            this.pageParams.pageNo = pageNo;
            this.total = total;
          } else {
            this.$message.error(msg || "获取历史就诊操作失败");
          }
        })
        .catch(error => {})
        .finally(() => {
          this.loading = false;
        });
    },
    handlePageChange1({ currentPage, pageSize }) {
      this.pageParams.pageNo = currentPage;
      this.pageParams.pageSize = pageSize;
      this.query();
    }
  }
};
</script>

<style lang='scss' scoped>
.vxe-table-style {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .table-contain {
    flex: 1;
  }
}
</style>
