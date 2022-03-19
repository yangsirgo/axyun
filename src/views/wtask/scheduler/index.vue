<template>
  <div class="content">
    <div class="form-table">
      <el-row :gutter="20" style="height: 100%">
        <el-col
          :span="14"
          style="height: 100%; overflow-y: auto; padding: 20px !important"
        >
          <el-form
            :inline="true"
            :model="form"
            ref="form"
            style="margin: 0 0 10px"
          >
            <el-form-item label>
              <el-input
                v-model="form.bizModuleName"
                placeholder="请输入名称"
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-input v-model="form.code" placeholder="请输入编码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-search"
                @click="handleSearch"
                >查询</el-button
              >
            </el-form-item>
            <!-- <el-form-item>
              <el-button size="mini" icon="el-icon-refresh" type="primary" @click="handleReset">刷新</el-button>
            </el-form-item>-->
            <el-form-item>
              <el-button
                size="mini"
                icon="el-icon-plus"
                type="primary"
                @click="handleAdd"
                >添加</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            :data="list"
            height="300"
            border
            fit
            highlight-current-row
            v-loading="loading"
            @row-dblclick="handleEdit"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="名称" align="center" width="105">
              <template slot-scope="scope">
                <span>{{ scope.row.bizModuleName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="编码" align="center" width="110">
              <template slot-scope="scope">{{ scope.row.code }}</template>
            </el-table-column>
            <el-table-column
              label="回调地址"
              align="center"
              width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">{{ scope.row.execUrl }}</template>
            </el-table-column>
            <el-table-column
              label="表达式"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.expression }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="表达式备注"
              align="center"
              :show-overflow-tooltip="true"
              width="110"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.ename }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="模块备注"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否启用" align="center" width="80">
              <template slot-scope="scope">
                <!-- <span @click="handleSwitchChange(scope.row)">{{scope.row.status=='0'?'启用':'停用'}}</span> -->
                <el-switch
                  v-model="scope.row.status"
                  active-value="1"
                  inactive-value="0"
                  disabled
                  @click.native="handleSwitchChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="handleEdit(scope.row)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
                <el-button
                  @click.native.prevent="handleRemove(scope.row)"
                  type="text"
                  size="small"
                  >删除</el-button
                >
                <el-button
                  @click.native.prevent="handleTest(scope.row)"
                  type="text"
                  size="small"
                  >测试</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :pageSize.sync="form.pageSize"
            :page.sync="form.page"
            @pagination="changeSize"
          />
          <div class="box-card" :style="total > 0 ? '' : 'margin-top:52px'">
            <div class="taskTitle">
              {{ type != "edit" ? "新增定时任务" : "编辑定时任务" }}
            </div>
            <el-form
              :model="bizModule"
              :label-position="labelPosition"
              label-width="85px"
              ref="bizModule"
              :rules="rules"
              class="form"
            >
              <el-form-item
                label="备注"
                prop="remark"
                class="remark"
                style="top: 35px"
              >
                <el-input
                  v-model="bizModule.remark"
                  type="textarea"
                  :rows="5"
                ></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="bizModuleName">
                <el-input
                  v-model="bizModule.bizModuleName"
                  placeholder="请输入业务模块名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="编码" prop="code">
                <el-input
                  v-model="bizModule.code"
                  placeholder="请输入编码"
                  :disabled="type == 'edit'"
                ></el-input>
              </el-form-item>
              <el-form-item label="回调地址" prop="execUrl">
                <el-input
                  v-model="bizModule.execUrl"
                  placeholder="请输入回调地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="表达式">
                <el-input
                  v-model="bizModule.expression"
                  disabled
                  placeholder="请配置表达式"
                ></el-input>
              </el-form-item>
              <el-form-item label class="remark" style="top: 180px">
                <el-button type="primary" size="mini" @click="handleOk"
                  >保存</el-button
                >
                <el-button type="primary" size="mini" @click="handleCancel"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="10" style="height: 100%; padding: 20px !important">
          <div>
            <cron
              @handleExpress="handleExpress"
              @ename="ename"
              :value.sync="expression"
            ></cron>
            <div>
              <span class="express">表达式：</span>
              <span style="margin-left: 10px">{{ bizModule.expression }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  getDataList,
  getAddTasks,
  getEditTasks,
  getDeleteTasks,
  changeStatus,
  usableTest
} from "@/api/wtask/scheduler";
export default {
  data() {
    return {
      loading: false,
      visible: false,
      total: 0,
      labelPosition: "center",
      cronPopover: false,
      cron: "",
      list: [],
      form: {
        bizModuleName: "",
        code: "",
        page: 1,
        pageSize: 10,
        orderBy: "updated_at desc",
      },
      expression: "* * * ? * *",
      bizModule: {
        expression: "",
      },

      type: "add",
      rules: {
        bizModuleName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        execUrl: [
          { required: true, message: "请输入回调地址", trigger: "blur" },
        ],
        // expression: [{ required: true, message: "请配置表达式" }]
      },
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    ename(val) {
      // this.bizModule.ename = val;
    },
    handleExpress(val) {
      if (val) {
        this.bizModule.expression = val;
        this.expression = this.bizModule.expression;
      }
    },
    handleExpression() {
      this.visible = true;
    },
    handleSearch() {
      this.getDataList();
      this.bizModule = {};
      this.type = "add";
      this.$refs.bizModule.resetFields();
      this.expression = "* * * ? * *";
    },
    handleReset() {
      this.form = { bizModuleName: "", code: "", page: 1, pageSize: 10 };
      this.getDataList();
    },
    handleAdd() {
      this.type = "add";
      this.bizModule = {
        status: "0",
      };
      this.expression = "* * * ? * *";
    },
    getDataList() {
      this.loading = true;
      getDataList(this.form)
        .then((res) => {
          if (res.code == 1) {
            this.list = res.data;
            // this.list.map((val) => {
            //   val.switch = val.status == "0" ? false : true;
            // });
            this.total = res.total;
            this.loading = false;
          } else {
            this.$message({ message: "请求失败" + res.msg, type: "error" });
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    handleEdit(data) {
      console.log("data####s", data);
      let datas = JSON.parse(JSON.stringify(data));
      console.log("data", data);
      datas.status = datas.status ? "1" : "0";
      this.bizModule = datas;
      this.expression = this.bizModule.expression;

      this.type = "edit";
    },
    handleRemove(data) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.handleDelete(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleDelete(data) {
      getDeleteTasks(data).then((res) => {
        if (res.code == 1) {
          this.$message({ message: "删除成功", type: "success" });
          this.getDataList();
          this.handleCancel();
        } else {
          this.$message({ message: "删除失败" + res.msg, type: "error" });
        }
      });
    },
    handleCancel() {
      this.$refs.bizModule.resetFields();
      this.type = "add";
      this.bizModule.expression = "";
      this.expression = "* * * ? * *";
    },
    handleOk() {
      if (!this.bizModule.expression) {
        this.$message({ type: "warning", message: "请配置表达式" });
        return;
      }
      console.log("this.bizModule", this.bizModule);
      let arr = this.bizModule.expression.split(" ");

      if (
        (arr[3] == "?" && arr[5] == "?") ||
        (arr[3] != "?" && arr[5] != "?")
      ) {
        this.$message({
          type: "error",
          message: "日和星期有且只能有一个为不指定!",
        });
        return;
      }

      this.$refs["bizModule"].validate((valid) => {
        if (!valid) return;
        if (this.type == "add") {
          // console.log('this.bizModulethis.bizModule1111111111', this.bizModule)
          this.getAddTasks();
        } else if (this.type == "edit") {
          this.getEditTasks();
        }
      });
    },
    getAddTasks() {
      console.log("this.bizModulethis.bizModule", this.bizModule);
      // delete this.bizModule.ename;
      getAddTasks(this.bizModule).then((res) => {
        if (res.code == 1) {
          this.$message({ message: "添加成功", type: "success" });
          this.getDataList();
          this.handleCancel();
        } else {
          this.$message({ message: "添加失败" + res.msg, type: "error" });
        }
      });
    },
    getEditTasks() {
      getEditTasks(this.bizModule).then((res) => {
        if (res.code == 1) {
          this.$message({ message: "修改成功", type: "success" });
          this.getDataList();
          this.handleCancel();
        } else {
          this.$message({ message: "修改失败" + res.msg, type: "error" });
        }
      });
    },
    changeSize(obj) {
      this.form = { ...this.form, ...obj };
      this.getDataList();
    },
    handleSwitchChange(data) {
      this.$confirm(
        data.status == 0 ? "此操作将启用该任务?" : "此操作将停用该任务?",
        "提示",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {

          let obj = {
            code: data.code,
            id: data.id,
            status: data.status,
          };
          this.changeStatus(obj);
        })
        .catch(() => {
          this.$message("已取消操作");
        });
      // console.log("data", data);
    },
    handleTest(data) {
      let obj = {
        code: data.code,
        id: data.id,
        status: data.status,
      };
      this.usableTest(obj)

    },

    changeStatus(data) {
      changeStatus(data).then((res) => {
        if (res.code == 1) {
          console.log("res", res);
          this.getDataList();
        }
      });
    },
    usableTest(data) {
      usableTest(data).then((res) => {
        if (res.code == 1) {
          console.log("res", res);
          this.$message({type:"success",message:"操作成功,请查看任务监控"})
          // this.getDataList();
        }else{
          this.$message({type:"error",message:res.msg||"测试失败"})
        }
      }).catch(error=>{
         this.$message({type:"error",message:error.msg||"测试失败"})
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
}
.el-col-14 {
  background: #fff;
  width: 58%;
  margin-right: 1.5%;
  padding: 20px;
  height: 100%;
}
.el-col-10 {
  background: #fff;
  width: 40.5%;
  padding: 20px !important;
}
.form-table {
  height: 100%;
}

.form {
  margin: 0 0 10px;
  .el-form-item {
    // float: left;
  }
}
.box-card {
  position: relative;
  // padding: 20px;
  // margin: 0 0 20px;
  margin-top: -20px;
  width: 100%;
  /deep/.el-input {
    margin-bottom: 10px;
    width: 255px;
  }
  /deep/.el-textarea {
    margin: 5px 0;
    width: 255px;
  }
}
.remark {
  position: absolute;
  right: 20px;
  top: 30px;
  width: 50%;
  z-index: 999;
}
.taskTitle {
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  font-weight: 600;
  margin: 10px 0;
}
/deep/.el-form-item__error {
  position: static;
  padding-top: 0;
}
/deep/.pagination-container {
  position: relative;
  margin: 0;
  padding: 0;
}
.express {
  height: 36px;
  line-height: 36px;
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
  margin-bottom: 10px;
}
.el-switch.is-disabled {
  opacity: 1;
}
/deep/.el-switch.is-disabled .el-switch__core,
/deep/.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.el-button+.el-button {
    margin-left: 3px;
}
</style>
