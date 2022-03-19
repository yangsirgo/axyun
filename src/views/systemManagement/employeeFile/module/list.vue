<template>
  <div class="page height100">
    <div class="top">
      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="机构">
            <el-input v-model="filter.orgName"></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="人员类别">
            <el-select
              v-model="filter.person"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="状态">
            <el-select
              v-model="filter.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sTatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>

      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="科室">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.dept"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择科室"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="职称">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.title"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择职称"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="档案完善">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.filePerfection"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择档案完善"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12">
          <l-formt-title label="检索">
            <el-input
              v-model="filter.search"
              placeholder="员工编号/姓名"
            ></el-input>
          </l-formt-title>
        </el-col>
        <el-col
          :span="12"
          style="text-align: end;"
        >
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
          <el-button>导出</el-button>
        </el-col>
      </el-row>

    </div>
    <div class="bottom">
      <div
        v-loading="loading"
        class="tablePart"
      >
        <el-table
          highlight-current-row
          @row-click="rowClick"
          :data="tableData"
          border
          height="100%"
        >
          <!-- 需要列 -->
          <el-table-column
            type="index"
            label="序号"
            width="50px"
            header-align="center"
            align="center"
          ></el-table-column>
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
              <span v-if="item.prop=='unit'">
                <span
                  code="DrugUnit"
                  :val="scope.row[item.prop]"
                  v-codeTransform
                ></span>
              </span>
              <span v-else>{{ scope.row[item.prop] || '--'}}</span>
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
      ></el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      options: [
        {
          value: 1,
          label: "全部"
        }
      ],
      sTatusOptions: [
        {
          value: 1,
          label: "全部"
        }
      ],
      filter: {
        orgName: "",
        person: "",
        status: "",
        title: "",
        filePerfection: "",
        dept: "",
        search: ""
      },
      loading: false,
      tableData: [],
      tableParams: [
        {
          prop: "status",
          label: "状态"
        },
        {
          prop: "personNo",
          label: "员工编号"
        },
        {
          prop: "personName",
          label: "姓名"
        },
        {
          prop: "type",
          label: "证件类型"
        }
      ],
      pageSize: 10,
      totalPage: 50,
      currentPage: 1
    };
  },
  components: {},
  methods: {
    rowClick(row) {
      this.$emit("rowClick", row);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.search();
    },
    search() {
      this.getAdviceItemFun(this.getParams());
    },
    getAdviceItemFun(obj) {
      adviceItemListPage(obj).then(res => {
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
    getParams() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      return { ...obj, ...this.filter };
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  // padding: 8px;
  .top {
    .el-row {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .bottom {
    padding-top: 10px;
    .tablePart {
      flex: 1;
    }
    flex: 1;
    display: flex;
    flex-direction: column;
    .el-pagination {
      height: 60px;
    }
  }
}
</style>
