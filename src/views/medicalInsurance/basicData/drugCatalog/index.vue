<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="4">
                <l-formt-title label="医保类别">
                  <l-value-domain
                    :value.sync="searchParams.medicareType"
                    remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                    remoteShowKey="dictName"
                    remoteValueKey="dictCode"
                    placeholder="请选择医保类别"
                  ></l-value-domain>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="项目类型">
                  <el-select v-model="searchParams.project" placeholder="请选择">
                    <el-option
                      v-for="item in projectList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="项目编码">
                  <el-input v-model="searchParams.no" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="项目名称">
                  <el-input v-model="searchParams.name" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="8" class="align-right">
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
              ></el-table-column>
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

export default {
  name: "drugCatalog",
  components: {
    FlowMenu
  },
  data() {
    return {
      // 查询条件
      searchParams: {
        medicareType: "",
        project: "",
        no: "",
        name: ""
      },
      // 医保中心下拉
      careCenterList: [],
      // 项目类型下拉
      projectList: [],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 表格加载loading
      loading: false,
      // 表头
      tableHeader: [
        {
          prop: "no1",
          label: "项目编码"
        },
        {
          prop: "no2",
          label: "项目名称"
        },
        {
          prop: "no3",
          label: "最高跟价"
        },
        {
          prop: "no4",
          label: "开始时间"
        },
        {
          prop: "no5",
          label: "终止时间"
        },
        {
          prop: "no6",
          label: "收费类别"
        },
        {
          prop: "no7",
          label: "项目等级"
        },
        {
          prop: "no8",
          label: "有效标识"
        },
        {
          prop: "no9",
          label: "自付比例"
        },
        {
          prop: "no10",
          label: "工伤项目等级",
          width: 120
        },
        {
          prop: "no11",
          label: "生育项目等级",
          width: 120
        },
        {
          prop: "no12",
          label: "中心流水号",
          width: 120
        },
        {
          prop: "flag",
          label: "删除标志"
        },
        {
          prop: "uploaddate",
          label: "更新时间"
        },
        {
          prop: "jbdate",
          label: "经办日期"
        },
        {
          prop: "jbr",
          label: "经办人"
        },
        {
          prop: "gys",
          label: "供应商"
        },
        {
          prop: "flno",
          label: "分类编码"
        },
        {
          prop: "cfflag",
          label: "处方药标志",
          width: 120
        },
        {
          prop: "synocont",
          label: "适应医疗服务项目编码对应内容",
          width: 240
        },
        {
          prop: "syno",
          label: "适应医疗服务项目编码",
          width: 180
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  created() {
    this.search();
  },
  methods: {
    // 查询
    search() {
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
