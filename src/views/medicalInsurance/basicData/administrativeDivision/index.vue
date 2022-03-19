<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="4">
                <l-formt-title required label="医保类别">
                  <l-value-domain
                    :value.sync="searchParams.medicareType"
                    remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                    remoteShowKey="dictName"
                    remoteValueKey="dictCode"
                    placeholder="请选择"
                  ></l-value-domain>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="编码">
                  <el-input v-model="searchParams.areaCode" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="名称">
                  <el-input v-model="searchParams.areaName" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="12" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" plain @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-table
              :data="tableData"
              v-loading="loading"
              border
              stripe
              style="width: 100%"
              height="100%"
            >
              <el-table-column
                v-for="(item ,index) in tableHeader"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                header-align="center"
                :align="item.align || 'left'"
                :width="item.width"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
              <template v-if="item.prop == 'medicareType'">
                  <span >{{ medicareTypeList[scope.row[item.prop]] }}</span>
                </template>
              <span v-else class="overflow-point">{{ scope.row[item.prop] }}</span>
            </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page align-right">
            <el-pagination
              background
              @size-change="changeSize"
              @current-change="changePage"
              :current-page="pageParams.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total"
            ></el-pagination>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import { getPageAreaList,getPagemd } from "@/api/medicalInsurance/index.js";

export default {
  name: "administrativeDivision",
  components: {
    FlowMenu
  },
  data() {
    return {
      // 查询条件
      searchParams: {
        medicareType: "",
        areaCode: "",
        areaName: ""
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 表格加载loading
      loading: false,
      medicareTypeList:{},
      // 表头
      tableHeader: [
        {
          prop: "medicareType",
          label: "医保类别"
        },
        {
          prop: "fatherAreaCode",
          label: "父级编码"
        },
        {
          prop: "fatherAreaName",
          label: "父级名称"
        },
        {
          prop: "areaCode",
          label: "区域编码"
        },
        {
          prop: "areaName",
          label: "区域名称"
        }
      ],
      // 表格数据
      tableData: []
    };
  },
   created() {
    this.getMedicareType();
  },
  methods: {
  getMedicareType(){
        getPagemd()
      .then(res => {
            if (res.code === 1) {
              res.data.forEach(item => {
              this.medicareTypeList[item.dictCode] = item.dictName;
              });
            }
        });
     },
    // 查询
    search() {
      // 医保类别必填
      if (!this.searchParams.medicareType) {
        this.$message.warning("请选择医保类别!");
        return;
      }
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    // 重置查询条件
    reset() {
      this.searchParams = this.$options.data().searchParams;
    },
    // 加载表格数据
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      this.loading = true;
      getPageAreaList(params)
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 分页回调
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
.main {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: $l-color-white;
}
.align-right {
  text-align: right;
}
.table {
  height: calc(100% - 110px);
  margin: 20px 0;
}
.page {
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
</style>
