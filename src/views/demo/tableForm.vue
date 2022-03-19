<template>
  <l-layout
    :toolBoxs="toolBoxs"
    :defaultToolName="toolBoxs[0]"
    :boxExpanded="false"
    :isToolBox="false"
    :hasThreeRouterFlag="false"
    :patientListShow="false"
    displayMode="expand"
    @message="messageHandler"
  >
    <template #content>
      <div class="wrapper-content width100 height100">
        <div class="content-right height100 padding20">
          <l-card-title class="card-title">
            <span slot="left">药品信息</span>
          </l-card-title>
          <div class="form-content">
            <el-form ref="drugFormDeail" :model="drugFormDeail">
              <el-form-item label label-width prop="drugName">
                <l-formt-title label="药品名称" labelWidth="76" required>
                  <el-input v-model="drugFormDeail.drugName"></el-input>
                </l-formt-title>
              </el-form-item>
              <el-form-item label label-width prop="drugName">
                <l-formt-title label="药品名称" labelWidth="76" required>
                  <el-input v-model="drugFormDeail.drugName"></el-input>
                </l-formt-title>
              </el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label label-width prop="drugName">
                    <l-formt-title label="药品名称" labelWidth="76" required>
                      <el-input v-model="drugFormDeail.drugName"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label label-width prop="drugName">
                    <l-formt-title label="药品名称" labelWidth="76" required>
                      <el-input v-model="drugFormDeail.drugName"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label label-width prop="drugName">
                    <l-formt-title label="药品名称" labelWidth="76" required>
                      <el-input v-model="drugFormDeail.drugName"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label label-width prop="drugName">
                    <l-formt-title label="药品名称" labelWidth="76" required>
                      <el-input v-model="drugFormDeail.drugName"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="button-cont">
            <el-button type="primary">保存</el-button>
          </div>
        </div>
        <div class="content-left height100 padding20">
          <div class="search">
            <div class="search-input">
              <el-row :gutter="10" class="card-space-bottom">
                <el-col :span="6">
                  <LFormtTitle label="搜索药品" labelWidth="76">
                    <el-input
                      v-model="searchData.name"
                      style="line-height: 34px;"
                      placeholder="拼音/五笔"
                    ></el-input>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="药品类型" labelWidth="76">
                    <!-- <l-value-domain code="DrugManaType" :value.sync="searchData.cwType" /> -->
                    <el-select v-model="searchData.cwType" placeholder="请选择">
                      <el-option
                        v-for="item in cwTypelist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="分类码" labelWidth="62">
                    <l-value-domain code="DrugTypeCode" :value.sync="searchData.classCode" />
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="分类码" labelWidth="62">
                    <l-value-domain code="DrugTypeCode" :value.sync="searchData.classCode" />
                  </LFormtTitle>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="6">
                  <LFormtTitle label="搜索药品" labelWidth="76">
                    <el-input
                      v-model="searchData.name"
                      style="line-height: 34px;"
                      placeholder="拼音/五笔"
                    ></el-input>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="药品类型" labelWidth="76">
                    <!-- <l-value-domain code="DrugManaType" :value.sync="searchData.cwType" /> -->
                    <el-select v-model="searchData.cwType" placeholder="请选择">
                      <el-option
                        v-for="item in cwTypelist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="分类码" labelWidth="62">
                    <l-value-domain code="DrugTypeCode" :value.sync="searchData.classCode" />
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="分类码" labelWidth="62">
                    <l-value-domain code="DrugTypeCode" :value.sync="searchData.classCode" />
                  </LFormtTitle>
                </el-col>
              </el-row>
            </div>
            <div class="search-btn">
              <el-button type="primary">查询</el-button>
              <el-button type="primary" plain>重置</el-button>
              <el-button type="primary" plain>新增</el-button>
            </div>
          </div>
          <div class="table">
            <el-table
              ref="singleTable"
              :data="drugData"
              border
              width="100%"
              height="100%"
              highlight-current-row
              v-loading="tlm_isLoading"
              element-loading-text="加载中..."
            >
              <el-table-column
                v-for="(item,index) in drugParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                :fixed="item.fixed"
                header-align
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page">
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
      </div>
    </template>
  </l-layout>
</template>

<script>
export default {
  data() {
    return {
      toolBoxs: [],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      searchData: {},
      cwTypelist: [],
      //表头数据
      drugParams: [
        {
          prop: "drugName",
          label: "药品名称",
          align: "left",
          width: "213",
          fixed: "left"
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: "120",
          fixed: false
        },

        {
          prop: "phoneticCode",
          label: "拼音码",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "fiveStrokeCode",
          label: "五笔码",
          align: "left",
          width: "70",
          fixed: false
        }
      ],
      drugData: [],
      tlm_isLoading: false,
      drugFormDeail: {}
    };
  },
  methods: {
    messageHandler() {},
    changeSize() {},
    changePage() {}
  }
};
</script>

<style lang="scss" scoped>
.wrapper-content {
  overflow: hidden;
  .content-left,
  .content-right {
    overflow: hidden;
    background-color: $l-color-white;
  }
  .content-left {
    display: flex;
    flex-direction: column;
    margin-right: 450px;
  }

  .content-right {
    width: 440px;
    float: right;
  }
  .card-title {
    line-height: 20px;
    height: 20px;
    margin-bottom: 20px;
    /deep/ .titleleft::before {
      margin-top: 0;
    }
  }
  .table {
    flex: 1;
    margin: 20px 0;
    overflow: hidden;
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
  .search {
    display: flex;
    .search-input {
      flex: 1;
      overflow: hidden;
      margin-right: 20px;
    }
  }
  /deep/ .l-input-wrap {
    vertical-align: top;
  }
  .content-right {
    display: flex;
    flex-direction: column;
  }
  .form-content {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
  }
  .button-cont {
    text-align: right;
    padding-top: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
  .el-form-item {
    margin-bottom: 20px;
    /deep/ .el-form-item__content {
      height: 36px;
    }
  }
}
</style>