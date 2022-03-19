<template>
  <div class="treatRegionMaintain width100 height100 clearfix">
    <div class="left-cont height100 float-left">
      <div class="search-area">
        <div class="search-area-left">
          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="8">
              <LFormtTitle label="渠道名称">
                <el-input
                  type="text"
                  v-model="searchValue.channelName"
                  placeholder="请输入"
                  style="width: 100%"
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="渠道代码">
                <el-input
                  type="text"
                  v-model="searchValue.channelCode"
                  placeholder="请输入"
                  style="width: 100%"
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <!-- <LFormtTitle label="备注说明">
                <el-input
                  type="text"
                  v-model="searchValue.recordRemark"
                  placeholder="请输入"
                  style="width:100%"
                ></el-input>
              </LFormtTitle> -->
              <el-radio-group
                v-model="searchValue.recordStatus"
                style="line-height: 40px"
              >
                <el-radio label="1">开放使用</el-radio>
                <el-radio label="2">暂停使用</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-radio-group v-model="searchValue.recordStatus">
              <el-radio label="1">开放使用</el-radio>
              <el-radio label="2">暂停使用</el-radio>
            </el-radio-group>
          </el-row> -->
        </div>
        <div class="search-area-right clearfix">
          <el-button
            type="primary"
            class="float-right"
            style="margin-left: 10px"
            plain
            @click="add"
            >新增</el-button
          >
          <el-button type="primary" class="float-right" plain @click="cancel"
            >重置</el-button
          >
          <el-button type="primary" class="float-right" @click="search"
            >查询</el-button
          >
        </div>
      </div>
      <div class="table-cont">
        <el-table
          ref="tableRefs"
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          @header-dragend="headerDragEndFunction"
          v-loading="loading"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'operate'">
                <el-button
                  type="text"
                  class="button-style"
                  @click="edit(scope.row, scope.$index)"
                  >编辑</el-button
                >
                <!--<el-button type="text" @click="deleted(scope.row,scope.$index)">删除</el-button>-->
                <el-button
                  type="text"
                  class="button-style"
                  @click="isUsed(scope.row, scope.$index)"
                >
                  <span v-if="scope.row['recordStatus'] == '1'">暂停使用</span>
                  <span v-else-if="scope.row['recordStatus'] == '2'"
                    >开放使用</span
                  >
                </el-button>
              </template>
              <template v-else-if="item.prop == 'recordStatus'">
                <span v-if="scope.row['recordStatus'] == '1'">开放使用</span>
                <span v-else-if="scope.row['recordStatus'] == '2'"
                  >暂停使用</span
                >
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right-cont height100 float-right">
      <l-card-title>
        <span slot="left">渠道维护</span>
      </l-card-title>
      <el-form
        class="search-area-form"
        :model="form"
        :rules="rules"
        ref="ruleForm"
      >
        <el-row style="margin-bottom: 20px">
          <el-form-item prop="channelName">
            <LFormtTitle label="渠道名称" required>
              <el-input
                type="text"
                v-model="form.channelName"
                placeholder="请输入"
                style="width: 100%"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item prop="channelCode">
            <LFormtTitle label="渠道代码" required>
              <el-input
                type="text"
                v-model="form.channelCode"
                placeholder="请输入"
                style="width: 100%"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-form-item prop="recordRemark">
            <LFormtTitle label="备注说明">
              <el-input
                type="text"
                v-model="form.recordRemark"
                placeholder="请输入"
                style="width: 100%"
              ></el-input>
            </LFormtTitle>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="recordStatus">
            <LFormtTitle label="状态" required>
              <el-radio-group v-model="form.recordStatus">
                <el-radio label="1">开放使用</el-radio>
                <el-radio label="2">暂停使用</el-radio>
              </el-radio-group>
            </LFormtTitle>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="clearfix">
        <el-button class="float-right" type="primary" @click="save"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import scheManagement from "@/api/schedule/scheduleManagement.js";

export default {
  name: "treatRegionMaintain",
  data() {
    return {
      searchValue: {
        channelName: "",
        recordStatus: "",
        recordRemark: "",
        createdByName: "",
        createdAt: ""
      },
      form: {
        channelName: "",
        recordStatus: "",
        recordRemark: "",
        createdByName: "",
        createdAt: ""
      },
      rules: {
        channelName: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        channelCode: [
          { required: true, message: "请输入渠道代码", trigger: "blur" }
          // { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        recordStatus: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      },
      loading: false,
      tableParams: [
        {
          prop: "channelName",
          label: "渠道名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "90"
        },
        {
          prop: "channelCode",
          label: "渠道代码",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "90"
        },
        {
          prop: "recordRemark",
          label: "备注",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "operate",
          label: "快捷操作",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "updatedByName",
          label: "操作人",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        }
      ],
      tableData: [],
      isEdit: false
    };
  },
  created() {
    this.search();
  },
  methods: {
    headerDragEndFunction(newWidth, oldWidth, column, event) {
      this.$refs.tableRefs.doLayout();
    },
    async getSelectRoomStation() {
      this.$showLoading();
      try {
        let params = {
          ...this.searchValue
        };
        let data = await scheManagement.getSelectNumPercentageDict(params);
        if (data.code == "1") {
          this.tableData = [...data.data];
        } else {
          this.$message.error(data.msg || "获取列表失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取列表失败");
      }
    },
    //查询
    async search() {
      await this.getSelectRoomStation();
    },
    //保存
    async save() {
      this.$nextTick(() => {
        this.$refs["ruleForm"].validate(async valid => {
          if (valid) {
            this.$showLoading();
            try {
              let form = { ...this.form };
              let data = {};
              if (this.isEdit) {
                //修改
                data = await scheManagement.updateNumPercentageDict(form);
              } else {
                //新增
                data = await scheManagement.addNumPercentageDict(form);
              }
              if (data.code == "1") {
                this.$refs["ruleForm"].resetFields();
                this.search();
                this.$message("保存成功");
              } else {
                this.$message.error(data.msg || "保存失败");
              }
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              // this.$message.error(error.msg || "保存失败");
            }
          }
        });
      });
    },
    //取消
    cancel() {
      this.searchValue = {
        channelName: "",
        recordStatus: "",
        recordRemark: "",
        createdByName: "",
        createdAt: ""
      };
    },
    //新增
    add() {
      this.isEdit = false;
      this.$nextTick(() => {
        this.form = {};
        this.$refs["ruleForm"].resetFields();
      });
    },
    //导出
    printTable() {},
    //编辑
    edit(row, index) {
      this.isEdit = true;
      this.form = { ...row };
    },
    //删除
    deleted(row, index) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$showLoading();
          try {
            let params = row.channelId;
            let data = await scheManagement.delNumPercentageDict(params);
            if (data.code == "1") {
              this.search();
              this.$message("删除成功");
            } else {
              this.$message.error(data.msg || "删除失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //是否使用
    async isUsed(row, index) {
      this.$showLoading();
      try {
        let params = {
          ...row,
          recordStatus: row.recordStatus == "1" ? "2" : "1"
        };
        let data = await scheManagement.updateNumPercentageDict(params);
        if (data.code == "1") {
          this.search();
          this.$message("操作成功");
        } else {
          this.$message.error(data.msg || "操作失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "操作失败");
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .button-style {
  padding: 4px 2px;
}
.treatRegionMaintain {
  .left-cont {
    width: calc(100% - 300px);
    padding: 10px;
    .search-area {
      display: flex;
      .search-area-left {
        flex: 1;
      }
    }

    .table-cont {
      height: calc(100% - 84px);
      margin: 20px 0;
    }
  }
  .right-cont {
    width: 300px;
    padding: 0 10px 10px 10px;
    border-left: 1px solid $l-color-bgcolor-11;
    .search-area-form {
      height: calc(100% - 109px);
      margin-bottom: 10px;
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
  }
}
</style>
