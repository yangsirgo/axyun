<template>
  <div class="cls height100">
    <div class="utilCls">
      <l-formt-title label="所属社康">
        <el-input
          v-model="itemFilter.sheKang"
          style="width: 100%"
        ></el-input>
      </l-formt-title>
      <l-formt-title label="所属科室">
        <el-input
          v-model="itemFilter.depart"
          style="width: 100%"
        ></el-input>
      </l-formt-title>
      <l-formt-title label="医生">
        <el-input
          v-model="itemFilter.doctor"
          style="width: 100%"
        ></el-input>
      </l-formt-title>
      <l-formt-title label="权限类型">
        <el-input v-model="itemFilter.anthType"></el-input>
      </l-formt-title>
      <el-select
        v-model="itemFilter.anthTypeTrue"
        placeholder="请选择"
        style="width: 50px"
      >
        <el-option
          label="是"
          value="1"
        ></el-option>
        <el-option
          label="否"
          value="0"
        ></el-option>
      </el-select>
      <span style="float: right;margin: 5px 0;">
        <el-button
          type="primary"
          @click="search"
        >查询</el-button>
        <el-button @click="reset">重置</el-button>
      </span>
    </div>
    <div
      class="maintable"
      v-loading="loading"
    >
      <el-table
        highlight-current-row
        @row-click="rowClick"
        :data="tableData"
        border
        height="100%"
      >
        <!-- 业务列 -->
        <el-table-column
          v-for="(item,index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'center'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <span>{{ scope.row[item.prop] || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getAntibacterialAuthPage } from "@/api/systemManagement/drugAccessMaintain/antibacterialAuth";
export default {
  name: "itemCenter",
  components: {},
  data() {
    return {
      itemFilter: {
        sheKang: "",
        depart: "",
        doctor: "",
        anthType: "",
        anthTypeTrue: "是"
      },
      tableData: [],
      tableParams: [
        {
          prop: "yGno",
          label: "员工编号"
        },
        {
          prop: "doctorName",
          label: "医生姓名"
        },
        {
          prop: "status",
          label: "状态"
        },
        {
          prop: "westQuan",
          label: "西方处方权"
        },
        {
          prop: "westQuan2",
          label: "中成药处方权"
        },
        {
          prop: "chmQuan",
          label: "中草药处方权"
        },
        {
          prop: "yBQuan",
          label: "医保处方权"
        },
        {
          prop: "mzypQuan",
          label: "麻醉药品处方权"
        },
        {
          prop: "dxypQuan",
          label: "毒品药品处方权"
        },
        {
          prop: "jsypQuan",
          label: "精神药品处方权"
        },
        {
          prop: "kjypQuan",
          label: "抗菌药品处方权"
        },
        {
          prop: "sszdQuan",
          label: "手术主刀权"
        }
      ],
      pageSize: 10,
      totalPage: 50,
      currentPage: 1,
      loading: false
    };
  },
  created() {},
  mounted() {
    this.search();
  },
  methods: {
    reset() {},
    getParams() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      return { ...obj, ...this.itemFilter };
    },
    rowClick(row) {
      //测试数据
      // row.antimicrobialRanges = "1";
      // row.title = "1";
      // row.status = "1";
      // row.level = "1";
      // row.way = "1";
      this.$emit("rowClick", row);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search();
    },
    search() {
      this.getAdviceItemFun(this.getParams());
    },
    getAdviceItemFun(obj) {
      getAntibacterialAuthPage(obj).then(res => {
        if (res.code === 1) {
          // this.tableData = resData;
          this.tableData = res.data;
          for (let i = 0; i < this.tableData.length; i++) {
            let row = this.tableData[i];
            this.tableData[i].status = row.status == "0" ? "激活" : "禁用";
          }
          this.totalPage = res.total;
          this.pageNo = res.pageNo;
          this.pageSize = res.pageSize;
        } else {
          this.$message("查询失败");
        }
      });
    },
    // 新增 按钮 回调函数
    handleAdd() {
      // 重置 右侧数据
      let row = {};
      this.$emit("rowClick", row);
    }
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang="scss">
.cls {
  display: flex;
  flex-direction: column;
  .utilCls {
    padding: 10px;

    > span {
      display: inline-block;
    }

    > span + span {
      margin-left: 10px;
    }

    > div {
      width: 250px;
    }
  }
  .maintable {
    flex: 1;
    padding: 0 10px;
  }
}
</style>

