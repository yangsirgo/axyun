<template>
  <div
    class="wrapper height100"
    style="background-color:#fff;"
    v-loading="loading"
  >
    <div style="text-align: center">
      <el-button
        @click="addDepartment"
        type="primary"
        icon="el-icon-circle-plus-outline"
        style="margin: 10px"
      >关联证候</el-button>
    </div>
    <div style="text-align: center; height: calc(100% - 118px)">
      <el-form
        :model="tableRuleForm"
        :show-message="false"
        :rules="tableRuleForm.tableRules"
        ref="tableRuleForm"
        label-width="0px"
        class="demo-ruleForm height100"
      >
        <el-table
          highlight-current-row
          @cell-click="cellClick"
          :data="tableRuleForm.tableData"
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
              <template v-if="item.prop === 'tcdName'">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.tcdName'"
                  :rules="tableRuleForm.tableRules.tcdName"
                >
                  <span v-if="scope.row.id">{{ scope.row.tcdName }}</span>
                  <!-- <el-input v-model="scope.row.tcdName"></el-input> -->
                  <LInputTable
                    v-else
                    ref="lInputTable"
                    :data-id="'InputTable' + scope.row.__targetId__"
                    :popoverWidth="500"
                    suffix-icon="el-icon-search"
                    :tableData="selectOptions"
                    @query="search($event, scope.row, scope.$index)"
                    @blur="lInputTableBlur"
                    v-model="scope.row.tcdName"
                    valueKey="tcdName"
                    @select="select"
                    :tableLoading="inputTableLoading"
                    :tableParams="dropColumn"
                    placeholder="请输入关键字"
                  ></LInputTable>
                </el-form-item>
              </template>
              <template v-else-if="item.prop === 'tcdCode'">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.tcdCode'"
                  :rules="tableRuleForm.tableRules.tcdCode"
                >
                  <el-input
                    v-model="scope.row.tcdCode"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </template>
              <template v-else-if="item.prop === 'action'">
                <el-button
                  size="small"
                  type="text"
                  icon="el-icon-delete"
                  @click="del(scope.row)"
                ></el-button>
              </template>
              <span v-else>{{ scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  saveDoctorsAdvice,
  getDoctorsAdviceInfo
} from "@/api/systemManagement/dataMaintain/doctorsAdvice";
import {
  delTcmAndSyndrome,
  selectTcmSyndrome
} from "@/api/systemManagement/dataMaintain/diseaseDicList.js";

export default {
  name: "executiveDepartments",
  props: {
    tableList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {},
  data() {
    return {
      selectOptions: [],
      inputTableLoading: false, //下拉table组件 loading
      currentPage: 0,
      queryName: "",
      pageSize: 10,
      dropColumn: [
        // 下拉 table 配置表头
        {
          prop: "tcdName",
          label: "证候代码",
          textAlign: "center"
        },
        {
          prop: "tcdCode",
          label: "证候名称",
          textAlign: "center"
        }
      ],
      loading: false,
      tableRuleForm: {
        tableData: [],
        tableRules: {
          tcdName: [
            {
              required: true,
              message: "请输入症形症候1",
              trigger: ["blur", "change"]
            }
          ],
          tcdCode: [
            {
              required: true,
              message: "请输入症形症候2",
              trigger: ["blur", "change"]
            }
          ]
        }
      },
      tcdNameList: [],
      currentRow: {},
      tableParams: [
        {
          prop: "tcdName",
          label: "症候名称"
        },
        {
          prop: "tcdCode",
          label: "症候代码"
        },
        {
          prop: "action",
          label: "操作",
          width: 60
        }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    cellClick(a, b, c) {
      this.currentRow = a;
    },
    // 查询 药品
    search(query, row, index) {
      let self = this;
      if (this.inputTableLoading) {
        return;
      }
      //增加loading
      this.inputTableLoading = true;
      let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
      let data = {
        ...{
          pageNo: pageNo,
          pageSize: this.pageSize,
          tcdAlias: query,
          status: 0
        }
      };
      if (this.queryName !== query) {
        this.selectOptions = [];
      }

      selectTcmSyndrome(data)
        .then(res => {
          if (res.code === 1) {
            let tableData = this.currentPage !== 0 ? this.selectOptions : [];
            const { data } = res;
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push(item);
            }
            this.selectOptions = tableData;
            this.currentPage = res.pageNo;
            this.pageSize = res.pageSize;
            this.total = res.total;
            this.queryName = query;
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
          this.inputTableLoading = false; //增加loading
        })
        .catch(res => {
          this.$message.error(res.msg || "获取数据失败");
          this.inputTableLoading = false; //增加loading
        });
    },
    // 选中 药品 或者 项目
    select(row) {
      if (this.isSameItem(row)) {
        this.$message.error("不可添加相同证候");
        this.clearInputTable();
        return;
      }
      // 数量 框 获取焦点
      this.currentRow.tcdCode = row.tcdCode;
      this.currentRow.tcdName = row.tcdName;
      this.$set(this.currentRow, "id", row.id);
      this.$set(this.currentRow, "syndromesSubclass", row.syndromesSubclass);
    },
    isSameItem(row) {
      return this.tableRuleForm.tableData.some(item => {
        return row && item.id === row.id;
      });
    },
    clearInputTable (){
      this.$nextTick(()=>{
        let target = "InputTable" + this.currentRow.__targetId__;
        this.$refs.lInputTable.forEach((item)=>{
          console.log(item.$el.getAttribute("data-id"));
          if (item.$el.getAttribute("data-id") === target){
            item.clear();
          }
        });
      });
    },
    //失去焦点 重置
    lInputTableBlur() {
      this.queryName = "";
      this.currentPage = 0;
    },
    resetTable() {
      this.tableRuleForm.tableData = [];
    },
    addDepartment() {
      let propList = this.tableParams.map(item => {
        return item.prop;
      });
      let obj = {
        __targetId__: +new Date()
      };
      propList.forEach(item => {
        obj[item] = "";
      });
      this.tableRuleForm.tableData.push(obj);
      this.currentRow = this.tableRuleForm.tableData[0];
    },
    async validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs["tableRuleForm"].validate(async valid => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
            return false;
          }
        });
      });
    },
    deleteConfirm(text) {
      return new Promise((resolve, reject) => {
        this.$confirm(text, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            //继续选中操作
            resolve(true);
          })
          .catch(() => {
            //取消操作
            reject(false);
          });
      });
    },
    async del(row) {
      if (row.__targetId__) {
        this.tableRuleForm.tableData = this.tableRuleForm.tableData.filter(
          item => {
            return item.__targetId__ !== row.__targetId__;
          }
        );
        let data = this.tableRuleForm.tableData;
        // this.$emit("handleDel", data);
        return;
      }

      try {
        let result = await this.deleteConfirm("确认删除本条数据吗？");
      } catch (error) {
        return;
      }

      let delAjaxData = {
        diagId: this.$parent.diagId,
        syndromeId: row.id
      };

      try {
        delTcmAndSyndrome(delAjaxData).then(res => {
          console.log(res);
          if (res.code === 1) {
            this.tableRuleForm.tableData = this.tableRuleForm.tableData.filter(
              item => {
                return item.id !== row.id;
              }
            );
            let data = this.tableRuleForm.tableData;
            // this.$emit("handleDel", data);
            this.$message.success(res.msg || "删除成功！");
          } else {
            this.$message.error(res.msg || "删除失败！");
          }
        });
      } catch (e) {}
    }
  },
  computed: {},
  watch: {
    tableList(list) {
      this.tableRuleForm.tableData = list;
    }
  }
};
</script>

<style scoped lang="scss">
.utils-cls {
  padding: 0 10px;
}

.margin5 {
  margin: 5px 0;
}

.mr3 {
  margin-right: 3px;
}

/deep/ .cell {
  padding: 0 !important;
}
</style>
