<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="3">
                <l-formt-title label="医保类别">
                  <!-- <l-value-domain
                    :value.sync="searchParams.medicareType"
                    remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                    remoteShowKey="dictName"
                    remoteValueKey="dictCode"
                    placeholder="请选择"
                  ></l-value-domain> -->
                  <el-select
                    v-model="searchParams.medicareType"
                    @change="search"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in medicareTypeList"
                      :key="index"
                      :value="index"
                      :label="item"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="疾病编码">
                  <el-input
                    v-model="searchParams.aka120"
                    placeholder="请输入内容"
                    @keyup.native.enter="search"
                  ></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="疾病名称">
                  <el-input
                    v-model="searchParams.aka121"
                    placeholder="请输入内容"
                    @keyup.native.enter="search"
                  ></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="疾病分类">
                  <el-select
                    clearable
                    v-model="searchParams.aka122"
                    @change="search"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in diseaseTypeList"
                      :key="index"
                      :value="index"
                      :label="item"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="大病类别">
                  <el-select
                    v-model="searchParams.cka303"
                    @change="search"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in bigDiseaseTypeList"
                      :key="index"
                      :value="index"
                      :label="item"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="转诊病种类型">
                  <el-select
                    v-model="searchParams.bkm070"
                    @change="search"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in transDigDiseaseTypeList"
                      :key="index"
                      :value="index"
                      :label="item"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>

              <el-col :span="6">
                <div class="search-btn align-right" style="margin-left: 20px">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button type="primary" plain @click="reset"
                    >重置</el-button
                  >
                </div>
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
                v-for="(item, index) in tableHeader"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                header-align="center"
                :align="item.align || 'left'"
                :min-width="item.width"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'medicareType'">
                    <span>{{ medicareTypeList[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop == 'aka122'">
                    <span>{{ diseaseTypeList[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop == 'cka303'">
                    <span>{{ bigDiseaseTypeList[scope.row[item.prop]] }}</span>
                  </template>
                  <template v-else-if="item.prop == 'bkm070'">
                    <span>{{
                      transDigDiseaseTypeList[scope.row[item.prop]]
                    }}</span>
                  </template>
                  <template v-else-if="item.prop == 'aae569'">
                    <span v-if="scope.row[item.prop] == 0">不启用</span>
                    <span v-else-if="scope.row[item.prop] == 1">启用</span>
                  </template>
                  <template v-else-if="item.prop == 'bkm072'">
                    <span>{{ bkm072Lists[scope.row[item.prop]] }}</span>
                  </template>
                  <span v-else class="overflow-point">{{
                    scope.row[item.prop]
                  }}</span>
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
import {
  getPageDiseaseList,
  getPagemd,
  getDiseaseType,
  getBigDiseaseType,
  getTransDiseaseType
} from "@/api/medicalInsurance/index.js";

export default {
  name: "diseaseInfo",
  components: {
    FlowMenu
  },
  data() {
    return {
      // 查询条件
      searchParams: {
        medicareType: "",
        aka120: "",
        aka121: ""
      },
      medicareTypeList: {},
      diseaseTypeList: {},
      bigDiseaseTypeList: {},
      transDigDiseaseTypeList: {},
      //偿付周期
      bkm072Lists: {
        "1": "天",
        "2": "周",
        "3": "月",
        "4": "季度",
        "5": "半年",
        "6": "年",
        "7": "例数"
      },
      // 医保中心下拉
      careCenterList: [],
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
        /* {
          prop: "medicareType",
          label: "医保类别",
          width: 120
        }, */
        {
          prop: "aka120",
          label: "疾病编码"
        },
        {
          prop: "aka121",
          label: "中文名称"
        },
        {
          prop: "aka062",
          label: "英文名称"
        },
        {
          prop: "aka020",
          label: "拼音简码"
        },
        {
          prop: "aka122",
          label: "疾病分类"
        },
        {
          prop: "cka303",
          label: "大病类别"
        },
        {
          prop: "bkm070",
          label: "转诊病种类型"
        },
        {
          prop: "bkf199",
          label: "分组序号"
        },
        {
          prop: "bkm071",
          label: "偿付标准"
        },
        {
          prop: "bkm072",
          label: "偿付周期"
        },
        {
          prop: "aae569",
          label: "启用标志"
        },
        {
          prop: "aae030",
          label: "启用日期"
        },
        {
          prop: "aae031",
          label: "终止日期"
        },
        {
          prop: "aae396",
          label: "更新日期"
        },
        {
          prop: "aae013",
          label: "备注"
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  async created() {
    await this.getMedicareType();
    await this.getDiseaseType();
    await this.getBigDiseaseType();
    await this.getTransDiseaseType();
    await this.search();
  },
  methods: {
    async getMedicareType() {
      await getPagemd().then(res => {
        if (res.code === 1 && res.data.length) {
          this.searchParams.medicareType = res.data[0].dictCode;
          res.data.forEach(item => {
            this.medicareTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    async getDiseaseType() {
      await getDiseaseType().then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.diseaseTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    async getBigDiseaseType() {
      await getBigDiseaseType().then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.bigDiseaseTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    async getTransDiseaseType() {
      await getTransDiseaseType().then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.transDigDiseaseTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    // 查询
    search() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    // 重置查询条件
    reset() {
      let medicareType = this.searchParams.medicareType;
      this.searchParams = {
        ...this.$options.data().searchParams,
        medicareType
      };
      this.search();
    },
    // 加载表格数据
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      this.loading = true;
      getPageDiseaseList(params)
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
