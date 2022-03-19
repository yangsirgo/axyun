<template>
  <el-card class="departInfo height100">
    <div class="form-area">
      <el-row :gutter="10">
        <el-col :span="6">
          <LFormtTitle label="医院科室编码">
            <el-input
              v-model="form.hospDeptCodg"
              placeholder="医院科室编码"
            ></el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="6">
          <LFormtTitle label="医院科室名称">
            <el-input
              v-model="form.hospDeptName"
              placeholder="医院科室名称"
            ></el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="12">
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="add">登记</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-cont">
      <el-table :data="tableData" border width="100%" height="100%">
        <el-table-column
          v-for="(item, index) in departInfoColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'operate'">
              <el-button type="text" @click="editReg(scope.row)"
              :disabled="scope.row.recordStatus == '2'"
                >修改</el-button
              >
              <el-button type="text" @click="cancelReg(scope.row)"
              :disabled="scope.row.recordStatus == '2'"
                >撤销</el-button
              >
            </template>
            <template v-else-if="item.prop === 'recordStatus'">
              <template v-if="scope.row.recordStatus == '2'">撤销登记</template>
              <template v-else>已登记</template>
            </template>
            <template v-else-if="item.hasOwnProperty('code')">
              <span>{{ transformNew(item.code, scope.row[item.prop]) }}</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="登记"
      :visible.sync="centerDialogVisible"
      width="60%"
      center
    >
      <addForm
        ref="addForm"
        v-if="centerDialogVisible"
        :formEdit="formEdit"
        @addCloseFuc="addCloseFuc"
      ></addForm>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFuc">确定</el-button>
        <el-button type="primary" plain @click="centerDialogVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="撤销"
      :visible.sync="cancelDialogVisible"
      width="60%"
      center
    >
      <l-formt-title label="原因" :isMultiRow="true">
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 2, maxRows: 3 }"
          v-model="begntime"
          maxlength="150"
        ></el-input>
      </l-formt-title>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelRegSure">确定</el-button>
        <el-button type="primary" plain @click="cancelDialogVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog> -->
  </el-card>
</template>
<script>
import addForm from "./addForm.vue";
import { departInfoColumns } from "../common/departInfo.js";
import service from "@/api/medicalInsuranceNew/departInfo.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

export default {
  name: "departInfo",
  mixins: [getDictInfoNew],
  components: {
    addForm,
  },
  data() {
    return {
      form: {},
      tableData: [],
      centerDialogVisible: false,
      formEdit: {},
      // cancelDialogVisible: false,
      // begntime: "",
    };
  },
  computed: {
    departInfoColumns() {
      return departInfoColumns;
    },
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.loadTable();
    },
    async loadTable() {
      this.tableData = [];
      this.$showLoading();
      let params = {
        ...this.form,
      };
      try {
        let res = await service.sdeptInfoFind(params);
        if (res.code == 1) {
          this.tableData = res.data;
        }
      } catch (error) {
      } finally {
        this.$hideLoading();
      }
    },
    add() {
      this.formEdit = {};
      this.centerDialogVisible = true;
    },
    editReg(data) {
      this.formEdit = { ...data };
      this.centerDialogVisible = true;
    },
    cancelReg(data) {
      this.formEdit = { ...data };
      // this.begntime = "";
      // this.cancelDialogVisible = true;
      this.$confirm("是否确认进行撤销操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.cancelRegSure();
      });
    },
    // 撤销
    async cancelRegSure() {
      /* if (!this.begntime) {
        this.$message.warning("请输入开始时间再进行撤销！");
        return;
      } */
      this.$showLoading();
      try {
        let params = {
          hospDeptCodg: this.formEdit.hospDeptCodg,
          hospDeptName: this.formEdit.hospDeptName,
          begntime: this.formEdit.begntime,
        };
        let res = await service.sdeptInfoCancel(params);
        if (res.code === 1) {
          this.$message.success("撤销成功！");
          // this.cancelDialogVisible = false;
          this.search();
        }
      } catch (error) {
      } finally {
        this.$hideLoading();
      }
    },
    addFuc() {
      this.$refs.addForm && this.$refs.addForm.addFuc();
    },
    addCloseFuc() {
      this.centerDialogVisible = false;
      this.search();
    },
  },
};
</script>
<style lang="scss" scoped>
.departInfo {
  padding: 10px;
  .form-area {
    margin-bottom: 10px;
  }
  .table-cont {
    height: calc(100% - 44px);
  }
  /deep/.el-button--text {
    padding: 8px;
  }
}
</style>