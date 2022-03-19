<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search-input">
        <el-row :gutter="10">
          <el-col :span="5">
            <LFormtTitle label="属性名称" labelWidth="76">
              <el-input
                v-model="attrName"
                style="line-height: 34px"
                placeholder="属性名称"
                clearable
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="19" style="text-align: right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
            <!-- <el-button type="primary" plain @click="del">删除</el-button> -->
            <el-button type="primary" plain @click="newadd">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="drug-list-cont">
        <l-table
          :singlePageShow="true"
          :total="pageParams.total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          @changeSize="changeSize"
        >
          <el-table
            ref="singleTable"
            :data="leftData"
            border
            width="100%"
            height="100%"
            highlight-current-row
            element-loading-text="加载中..."
            v-loading="tlm_isLoading"
            @current-change="rowClick"
            @selection-change="handleSelectionChange"
            @header-dragend="headerDragend"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column
              v-for="(item, index) in drugParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <!-- <template slot-scope="scope">
                <template v-if="item.prop == 'deptId'">
                  <span
                    tableName="sys_org"
                    :conditionMap="{ org_type: '_DEPT_', id: scope.row.deptId }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </template>

                <template v-else>
                  <span class="overflow-point">{{ scope.row[item.prop] }}</span>
                </template>
              </template> -->
            </el-table-column>
          </el-table>
        </l-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import base from "@/api/hmm/base";
export default {
  props: ["refreshList"],
  data() {
    return {
      //搜索条件
      attrName: "",
      chacklist: [], //删除选中的数据
      //表头数据
      drugParams: [
        {
          prop: "attributeCode",
          label: "属性编码",
          align: "left",
          width: "80",
          fixed: "left"
        },
        {
          prop: "attributeName",
          label: "属性名称",
          align: "left",
          width: "90",
          fixed: "left"
        },

        {
          prop: "attributeValue",
          label: "属性值",
          align: "left",
          width: "150",
          fixed: false
        },

        {
          prop: "attributeValueName",
          label: "属性值名称",
          align: "left",
          width: "150",
          fixed: false
        }
      ],
      //表格数据
      leftData: [],
      //分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tlm_isLoading: false
    };
  },
  watch: {
    refreshList() {
      this.getDrugList();
    }
  },
  mounted() {
    this.search();
  },
  methods: {
    //获取药品表格数据
    async getDrugList() {
      if (this.tlm_isLoading) return;
      this.tlm_isLoading = true;

      try {
        const { code, data, total } = await base.getAttrList({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          name: this.attrName
        });

        if (code === 1) {
          this.pageParams.total = total;
          this.leftData = data;
          console.log(this.leftData, "this.leftData");
          let firstData = this.leftData[0];
          this.setCurrent(firstData || {});
        }
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.tlm_isLoading = false;
      }
    },
    //高亮首行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    //搜索
    async search() {
      this.pageParams.page = 1;
      this.pageParams.total = 0;
      await this.getDrugList();

      this.$emit("getIsDrug", this.leftData[0]);
    },
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row);
    },
    //重置
    reset() {
      this.attrName = "";
      this.pageParams.pageNo = 1;
      this.pageParams.total = 0;
      this.search();
    },
    changeSize({ page, pageSize }) {
      this.pageParams.pageSize = pageSize;
      this.pageParams.pageNo = page;
      this.getDrugList();
    },
    //勾选行
    handleSelectionChange(val) {
      this.chacklist = val;
    },
    // 取消高亮
    clearHightCur() {
      this.$refs.singleTable.setCurrentRow();
      this.$emit("getIsDrug", {});
    },
    newadd() {
      this.$emit("newadd");
    },
    //删除行
    del() {
      if (this.chacklist.length == 0) {
        this.$message.warning("请选择一条或者多条数据");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除选中条目?",
        confirm: (action, instance, done) => {
          let ids = [];
          this.chacklist.map(item => ids.push(item.id));
          ids = ids.join(",");
          // this.$showLoading();
        }
      });
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    }
  }
};
</script>

<style scoped lang="scss">
.drugList {
  .card-cont {
    padding: 20px;

    .search-button {
      width: 80px;
      height: 36px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;

      font-weight: 400;
      color: $l-color-white;
    }

    .drug-list-cont {
      height: calc(100% - 50px);
      margin: 16px 0;
    }
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
}
</style>
