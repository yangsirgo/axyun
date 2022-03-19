<template>
  <div>
    <div class="form">
      <el-row>
        <el-col :span="1" style="min-width:130px">
          <div>是否为行数据</div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-switch v-model="value" active-color="#2B4583FF" inactive-color="#909399"></el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1" style="min-width:130px">
          <div>报表名称</div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-input v-model="input" placeholder="请输入报表名称"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1" style="min-width:130px">
          <div>类型维护</div>
        </el-col>
        <el-col :span="22">
          <div>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column
                v-for="(item, index) in tableParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="handleAdd" type="text" size="small">新增</el-button>
                  <el-button
                    @click.native.prevent="handleEdit(scope.row)"
                    type="text"
                    size="small"
                  >编辑</el-button>
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="text-align:right">
      <button data-v-94e7db6c type="button" class="el-button el-button--primary el-button--mini">
        <span>保存</span>
      </button>
    </div>
    <!-- 新增编辑弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑类型':'新增类型'"
      :before-close="handleClose1"
    >
      <el-form
        :model="dialogFormData"
        label-width="90px"
        label-position="right"
        :rules="rules"
        style="height:360px;overflow-y:auto"
      >
        <el-form-item label="编码" prop="code">
          <el-input v-model="dialogFormData.code" placeholder="请输入编码" style="width:360px;" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialogFormData.name" placeholder="请输入名称" style="width:360px;" />
        </el-form-item>
        <el-form-item label="文书类型" prop="type">
          <el-input v-model="dialogFormData.type" placeholder="请输入文书类型" style="width:360px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" type="primary" @click="handleOk1">确 定</el-button>
        <el-button round size="mini" @click="handleClose1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: true,
      input: "",
      tableData: [// 主页面表格数据
        { code: "dwew", name: "测试组", type: "住院医生" },
        { code: "dwew2", name: "测试组", type: "门诊医生" },
        { code: "dwew3", name: "测试组", type: "住院医生" }
      ],
      tableParams: [// 主页面表格label
        { prop: "code", label: "编码" },
        { prop: "name", label: "名称" },
        { prop: "type", label: "文书类型" }
      ],
      dialogVisible: false,// 控制新增编辑弹框显示
      dialogType: "add",// 弹框类型
      rules: {// 弹框表单验证
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请输入文书类型", trigger: "blur" }]
      },
      dialogFormData: {}// 弹框表单数据
    };
  },
  methods: {
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 新增
    handleAdd() {
      this.dialogFormData = {};
      this.dialogVisible = true;
      this.dialogType = "add";
    },
    // 编辑
    handleEdit(row) {
      console.log(row);
      this.dialogVisible = true;
      this.dialogType = "edit";
      this.dialogFormData = { ...row };
    },
    // 新增编辑弹框 取消按钮
    handleClose1() {
      this.dialogVisible = false;
    },
    // 新增编辑框 确认按钮
    handleOk1() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  min-height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
}
.form {
  height: calc(100% - 36px);
  overflow-y: auto;
}
.el-dialog {
  .el-form {
    padding: 20px;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-button--mini {
    border-radius: 0;
  }
}
</style>