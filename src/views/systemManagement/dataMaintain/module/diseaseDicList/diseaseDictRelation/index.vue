<template>
  <div class="diseaseCls height100">
    <el-card class="diseaseCenter  height100">
      <div class="utilCls">
        <el-row :gutter="5">
          <el-col :span="6">
            <l-formt-title label="状态">
              <el-select
                v-model="form.recordStatus"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  label="全部"
                  :value="2"
                >
                </el-option>
                <el-option
                  label="激活"
                  :value="0"
                >
                </el-option>
                <el-option
                  label="禁用"
                  :value="1"
                >
                </el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="分类">
              <l-value-domain
                code="CWM"
                :disabled="true"
                :value.sync="form.isWesternMedicine"
                placeholder="请选择"
              ></l-value-domain>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="项目信息">
              <el-input
                v-model="form.dictionaryNameOrAlias"
                placeholder="项目名称/别名"
                @keydown.enter.native="search"
                style="width: 100%"
              ></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <span style="float: right;">
              <el-button
                type="primary"
                @click="search"
              >查询</el-button>
               <el-button @click="reset">重置</el-button>
              <el-button @click="handleAdd">新增</el-button>
            </span>
          </el-col>
        </el-row>
      </div>
      <div
        style="height:calc(100% - 95px);overflow-x: auto;"
        v-loading="loading"
      >
        <div
          class="height100"
          style="min-width: 700px;"
        >
          <div style="height:calc(100% - 42px);">
            <el-table
              ref="mainTable"
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
                  <template v-if="item.prop === 'recordStatus'">
                    <span>{{ scope.row[item.prop] === '1'?"禁用" : "激活"}}</span>
                  </template>
                  <!-- 可自定义内容 -->
                  <template v-else-if="item.prop === 'orgId'">
                    <span
                      tableName="sys_org"
                      :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.orgId
                    }"
                      columns="org_nm"
                      v-tableTransform
                    >--</span>
                  </template>
                  <template v-else-if="item.prop === 'hosId'">
                    <span
                      tableName="sys_org"
                      :conditionMap="{
                            org_type: '_HOS_',
                            id: scope.row[item.prop],
                          }"
                      columns="org_nm"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop === 'category'">
                    <span
                      code="CWM"
                      v-codeTransform
                      :val="scope.row[item.prop]"
                    ></span>
                  </template>
                  <template v-else>
                    <span>{{ scope.row[item.prop] || '--'}}</span>
                  </template>
                  <!-- 可自定义内容 -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- v-if="this.totalPage > this.pageSize" -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNo"
            :page-sizes="[15, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage"
          >
          </el-pagination>
        </div>

      </div>
    </el-card>
    <div class="diseaseRight height100">
      <el-card class="diseaseRightCard height100">
        <right-form
          ref="rightForm"
          :currentRow="currentRow"
          @loadTable="loadTable"
        ></right-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import rightForm from "./rightForm.vue";
import { getXiYiList } from "@/api/systemManagement/dataMaintain/diseaseDicList.js";

export default {
  name: "index",
  components: { rightForm },
  data() {
    return {
      currentRow: {},
      form: {
        recordStatus: 2,
        isWesternMedicine: "2",
        dictionaryNameOrAlias: ""
      },
      pageSize: 15,
      totalPage: 50,
      pageNo: 1,
      loading: false,
      tableData: [],
      tableParams: [
        {
          prop: "recordStatus",
          label: "状态"
        },
        {
          prop: "category",
          label: "类别"
        },
        {
          prop: "diseaseCode",
          label: "疾病编码"
        },
        {
          prop: "dictionaryName",
          label: "疾病名称"
        },
        {
          prop: "diseaseSuborder",
          label: "疾病版本"
        },
        {
          prop: "diseaseEdition",
          label: "疾病亚目"
        },
        {
          prop: "chronicDiseaseIdent",
          label: "慢病标识"
        },
        {
          prop: "remarks",
          label: "备注"
        },
        {
          prop: "operatorName",
          label: "最近操作人"
        },
        {
          prop: "operateTime",
          label: "操作时间"
        },
        {
          prop: "hosId",
          label: "所在机构"
        }
      ]
    };
  },
  created() {
    this.search();
  },
  mounted() {},
  methods: {
    loadTable() {
      this.pageNo = 1;
      this.pageSize = 15;
      this.form = {
        recordStatus: 2,
        isWesternMedicine: "2",
        dictionaryName: ""
      };
      this.getXiYiList(this.getParams());
    },
    async getXiYiList(params) {
      this.loading = true;
      try {
        let result = await getXiYiList(params);
        if (result.code === 1) {
          this.tableData = result.data;
          this.loading = false;
          this.pageSize = result.pageSize;
          this.totalPage = result.total;
          this.pageNo = result.pageNo;
        } else {
          this.loading = false;
          this.$message.error(result.msg || "获取列表失败");
        }
      } catch (e) {
        this.loading = false;
        this.$message.error("获取列表失败");
      }
    },
    rowClick(row) {
      this.currentRow = row;
    },
    handleAdd() {
      this.currentRow = {};
      this.$refs.mainTable.setCurrentRow(null);
      this.$refs.rightForm.resetForm();
    },
    reset() {
      this.form = {
        recordStatus: 2,
        isWesternMedicine: "2",
        dictionaryNameOrAlias: ""
      };
      this.getXiYiList(this.getParams());
    },
    search() {
      this.pageNo = 1;
      this.getXiYiList(this.getParams());
    },
    getParams() {
      let params = {};
      let pagination = {
        // totalPage:this.totalPage,
        // parentId: '0',
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      params = {
        ...pagination,
        ...{
          ...this.form,
          ...{
            isWesternMedicine: "D" //针对接口 特殊处理
          }
        }
      };
      return params;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // console.log('写入查询接口', this.getParams());
      this.pageSize = val;
      this.getXiYiList(this.getParams());
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNo = val;
      // console.log('写入查询接口', this.getParams());
      this.getXiYiList(this.getParams());
    }
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang="scss">
.diseaseCls {
  .diseaseCenter {
    width: 68%;
    float: left;
    /*background-color: green;*/
    .utilCls {
      padding: 10px;

      > span {
        display: inline-block;
      }

      > span + span {
        margin-left: 10px;
      }
    }
  }

  .diseaseRight {
    width: 32%;
    padding-left: 10px;
    float: left;
    overflow-x: auto;

    .diseaseRightCard {
      min-width: 380px;
    }
  }
}
</style>
