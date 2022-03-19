<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true" top="5vh" @before-close="closePrintSeterFuc">
    <div class="dialog-content">
      <div class="printNameseter">
        <div class="printNameseter-form">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
          >
            <el-form-item prop="name">
              <LFormtTitle label="单据名称" required>
                <el-select v-model="ruleForm.name" clearable>
                  <el-option
                    v-for="(item, index) in nameOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-form-item>
            <el-form-item prop="printerName">
              <LFormtTitle label="打印机" required>
                <el-input v-model="ruleForm.printerName" clearable></el-input>
              </LFormtTitle>
            </el-form-item>
            <div class="float-right button-cont">
              <el-button type="primary" @click="save">保 存</el-button>
              <el-button type="primary" @click="cancel">取 消</el-button>
            </div>
          </el-form>
        </div>
        <LCardTitle>
          <template #left>设置记录</template>
        </LCardTitle>
        <div class="printNameseter-table">
          <el-table
            ref="recordTable"
            :data="tableData"
            border
            stripe
            width="100%"
            height="100%"
          >
            <el-table-column
              v-for="(item, index) in tableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'center'"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'operate'">
                  <el-button type="text" @click="deletePrinterName(scope.row)"
                    >删除</el-button
                  >
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closePrintSeterFuc">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { deepClone } from "@/utils/index.js";

export default {
  name: "printNameseter",
  props: {
    requiredName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      nameOptions: [
        {
          label: "收费发票",
          value: "收费发票",
        },
        {
          label: "用药标签",
          value: "用药标签",
        },
        {
          label: "热敏凭证",
          value: "热敏凭证",
        },
      ],
      rules: {
        name: [
          { required: true, message: "请选择单据名称", trigger: "change" },
        ],
        printerName: [
          { required: true, message: "请输入打印机名称", trigger: "blur" },
        ],
      },
      tableParams: [
        {
          prop: "name",
          label: "单据名称",
          width: 120,
        },
        {
          prop: "printerName",
          label: "打印机",
          width: 120,
        },
        {
          prop: "operate",
          label: "操作",
          width: 80,
        },
      ],
      ruleForm: {
        name: "",
        printerName: "",
      },
      tableData: [],
    };
  },
  created() {
    this.tableData = deepClone(
      JSON.parse(localStorage.getItem("printerNameData")) || []
    );
  },
  methods: {
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let tableData = this.tableData;
          let arr = tableData.filter((item) => {
            return item.name === this.ruleForm.name;
          });
          if (arr.length) {
            this.$message.warning(
              "列表中已有" + this.ruleForm.name + "打印机，请先删除再进行添加！"
            );
            return;
          }
          this.$set(this.tableData, this.tableData.length, {
            ...this.ruleForm,
          });
          this.updateLocal();
        }
      });
    },
    cancel() {
      this.$refs.ruleForm.resetFields();
    },
    closePrintSeterFuc() {
        console.log("closePrintSeterFuc")
      this.$emit("closePrintSeterFuc", this.requiredName);
    },
    deletePrinterName(row) {
      let id = this.tableData.findIndex((item) => {
        if (item.name === row.name) {
          return true;
        }
      });
      this.tableData.splice(id, 1);
      this.updateLocal();
    },
    updateLocal() {
      localStorage.setItem(
        "printerNameData",
        JSON.stringify(deepClone(this.tableData))
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.printNameseter {
  padding: 6px;

  .printNameseter-form {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    .demo-ruleForm {
      width: 400px;
    }
    .button-cont {
      margin-top: 6px;
    }
  }
  .printNameseter-table {
    height: 250px;
    margin-top: 6px;
  }
}
</style>