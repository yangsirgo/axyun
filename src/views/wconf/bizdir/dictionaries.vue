<template>
  <div class="dictionaries height100 clearfix">
    <div class="dictionaries-left float-left height100">
      <div class="table-cont">
        <el-table
          style="margin-top: 10px"
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="rowClick"
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
              <!-- <template v-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '0'">已申请</span>
                <span v-if="scope.row[item.prop] == '1'">已授权</span>
                <span v-if="scope.row[item.prop] == '2'">已撤销</span>
              </template>
              <template v-else-if="item.prop == 'applyReason'">
                <span :val="scope.row['applyReason']" code="grantAppyReason" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop == 'applyMoney'">
                <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                <span v-if="!scope.row[item.prop]">0.00</span>
              </template>
              <template v-else-if="item.prop == 'grantMoney'">
                <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                <span v-if="!scope.row[item.prop]">0.00</span>
              </template>-->
              <template v-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '0'">未启用</span>
                <span v-else-if="scope.row[item.prop] == '1'">启用</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page">
        <!-- <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination> -->
        <pagination
          v-show="pageParams.total > 0"
          :total="pageParams.total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          @pagination="changeSize"
          :refresh="true"
        />
      </div>
    </div>
    <div class="dictionaries-right float-right height100">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        class="dictionaries-right-form"
      >
        <LFormtTitle
          label="目录代码"
          :required="true"
          class="margin-top-10"
          disabled
        >
          <el-form-item>
            <el-input
              v-model="form.cataCode"
              placeholder="请输入目录代码"
              clearable
              disabled
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <!-- <LFormtTitle label="目录名称" :required="true" class="margin-top-10">
            <el-form-item prop="cataName">
              <el-input v-model="form.cataName" placeholder="目录名称" clearable></el-input>
            </el-form-item>
        </LFormtTitle>-->
        <!--       :disabled="!addStatus" -->
        <LFormtTitle label="字典代码" :required="true" class="margin-top-20">
          <el-form-item prop="dictionaryCode">
            <el-input
              v-model="form.dictionaryCode"
              placeholder="请输入字典代码"
              clearable
              @change="cataNameBlur"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="字典名称" :required="true" class="margin-top-20">
          <el-form-item prop="dictionaryName">
            <el-input
              v-model="form.dictionaryName"
              @change="cataNameBlur"
              placeholder="请输入字典名称"
              clearable
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="字典值" :required="false" class="margin-top-20">
          <el-form-item>
            <el-input
              v-model="form.dictionaryValue"
              placeholder="请输入字典值"
              clearable
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="拼音" class="margin-top-20" :disabled="addStatus">
          <el-form-item prop="namePy">
            <el-input
              v-model="form.namePy"
              placeholder="请输入拼音"
              clearable
              :disabled="addStatus"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="五笔" class="margin-top-20" disabled>
          <el-form-item prop="nameWb">
            <el-input
              v-model="form.nameWb"
              placeholder="请输入五笔"
              clearable
              disabled
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="排序" :required="true" class="margin-top-20">
          <el-form-item prop="sortNum">
            <el-input
              v-model="form.sortNum"
              placeholder="请输入排序"
              clearable
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="状态标志" :required="false" class="margin-top-20">
          <el-form-item prop="recordStatus">
            <el-radio v-model="form.recordStatus" label="1">启用</el-radio>
            <el-radio v-model="form.recordStatus" label="0">未启用</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="备注" :required="false" class="margin-top-20">
          <el-form-item prop="recordRemark">
            <el-input
              v-model="form.recordRemark"
              placeholder="请输入备注"
              clearable
            ></el-input>
          </el-form-item>
        </LFormtTitle>
      </el-form>
      <div class="width100 margin-top-10 clearfix">
        <el-button
          type="primary"
          class="float-right"
          style="margin-left: 10px"
          @click="save"
          >保存</el-button
        >
        <el-button type="primary" class="float-right" plain @click="add"
          >新增</el-button
        >
        <el-button
          type="primary"
          class="float-right"
          plain
          @click="dele"
          v-if="!addStatus"
          >删除</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/wconf/cnfDictionary";
import encodeUtil from "@/utils/encodeUtil.js";
export default {
  components: {},
  props: {
    currentCataData: {
      type: Object,
    },
  },
  data() {
    // 数字校验
    let num = (rule, value, callback) => {
      const numRule = /^[0-9]*$/;
      if (!numRule.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    // 汉字校验
    let chinese = (rule, value, callback) => {
      const chineseRule = /^[\u4e00-\u9fa5]{0,}$/;
      if (!chineseRule.test(value)) {
        callback(new Error("只能输入汉字"));
      } else {
        callback();
      }
    };
    return {
      addStatus: false,
      loading: false,
      cataCode: "",
      cataName: "",
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "dictionaryCode",
          label: "字典代码",
          align: "center",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "dictionaryName",
          label: "字典名称",
          align: "center",
          headerAlign: "center",
          width: "200",
          fixed: false,
        },
        {
          prop: "dictionaryValue",
          label: "字典值",
          align: "center",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "namePy",
          label: "拼音",
          align: "center",
          headerAlign: "center",
          width: "200",
        },
        {
          prop: "nameWb",
          label: "五笔",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "sortNum",
          label: "排序",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "recordRemark",
          label: "备注",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        id: "",
        cataCode: this.currentCataData.cataCode,
        dictionaryCode: "",
        dictionaryName: "",
        dictionaryValue: "",
        namePy: "",
        nameWb: "",
        sortNum: "99",
        recordStatus: "1",
        recordRemark: "",
      },
      rules: {
        cataCode: [
          { required: true, message: "请输入目录代码", trigger: "blur" },
        ],
        cataName: [
          { required: true, message: "请输入目录名称", trigger: "blur" },
        ],
        dictionaryCode: [
          { required: true, message: "请输入字典代码", trigger: "blur" },
        ],
        dictionaryName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
          // { validator: chinese, trigger: "blur" }   // 可以非汉字
        ],
        dictionaryValue: [
          { required: true, message: "请输入字典值", trigger: "blur" },
        ],
        // namePy: [{ required: true, message: "请输入拼音", trigger: "blur" }],
        // nameWb: [{ required: true, message: "请输入五笔", trigger: "blur" }],
        sortNum: [
          { required: true, message: "请输入排序", trigger: "blur" },
          { validator: num, trigger: "blur" },
        ],
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100,
      },
    };
  },
  mounted() {
    this.getDictionaryPOsByPage();
  },
  methods: {
    async getDictionaryPOsByPage() {
      this.loading = true;
      await service
        .getDictionaryPOsByPage({
          id: this.currentCataData.id,
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
          cataCode: this.currentCataData.cataCode,
          cataLogId: this.currentCataData.id,
          moduleId: this.currentCataData.moduleId,
        })
        .then((res) => {
          if (res.code == "1") {
            this.loading = false;
            this.tableData = res.data;
            // if (this.tableData.length) {
            //   this.form = { ...this.tableData[0] };
            //   this.form.cataCode = this.currentCataData.cataCode;
            // } else {
            this.addStatus = true;
            this.form = {
              cataCode: this.currentCataData.cataCode,
              dictionaryCode: "",
              dictionaryName: "",
              dictionaryValue: "",
              namePy: "",
              nameWb: "",
              sortNum: "99",
              recordStatus: "1",
              recordRemark: "",
              // };
            };
            this.pageParams.total = res.total;
          } else {
            this.loading = false;
            this.$message({ type: "error", message: "查询失败" });
          }
        })
        .catch((error) => {
          this.$message({ type: "error", message: error || "查询失败" });
        });
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getDictionaryPOsByPage();
    },
    rowClick(row) {
      this.currentData = row;
      this.form = { ...row };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        cataCode: this.currentCataData.cataCode,
        dictionaryCode: "",
        dictionaryName: "",
        dictionaryValue: "",
        namePy: "",
        nameWb: "",
        sortNum: "99",
        recordStatus: "1",
        recordRemark: "",
      };
      this.addStatus = true;
    },

    dele() {
      if (!this.form.id) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },

    async delete() {
      // this.$showLoading;
      await service
        .delDictionaryPO({
          id: this.form.id,
        })
        .then((res) => {
          if (res.code == 1) {
            this.$message({ type: "success", message: "删除成功" });
            this.getDictionaryPOsByPage();
          } else {
            this.$message({ type: "error", message: res.msg || "删除失败" });
          }
          this.$hideLoading();
        })
        .catch((error) => {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "删除失败");
        });
      // this.$hideLoading;
    },

    async save() {
      // this.form.cataId=this.form.cataCode;
      this.form.moduleId = this.currentCataData.moduleId;
      if (this.addStatus) {
        this.form.cataLogId = this.currentCataData.id;
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            this.$showLoading();
            this.form.id = "";
            await service
              .addDictionaryPO(this.form)
              .then((res) => {
                if (res.code == "1") {
                  this.$hideLoading();
                  this.$message({ type: "success", message: "新增成功" });
                  this.getDictionaryPOsByPage();
                } else {
                  this.$hideLoading();
                  this.$message.error(res.msg || "新增失败");
                }
              })
              .catch((error) => {
                this.$message.error(error || "新增失败");
              });
          }
        });
      } else {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            this.$showLoading();
            await service
              .updateDictionaryPO(this.form)
              .then((res) => {
                if (res.code == "1") {
                  this.$hideLoading();
                  this.$message({ type: "success", message: "保存成功" });
                  this.getDictionaryPOsByPage();
                } else {
                  this.$hideLoading();
                  this.$message({
                    type: "error",
                    message: "保存失败" + res.msg || "保存失败",
                  });
                }
              })
              .catch((error) => {
                console.info(error);
                this.$hideLoading();
                this.$message.error(error.msg || "保存失败");
              });
          }
        });
      }
    },
    // // 分页
    // handleSizeChange(val) {
    //   this.pageParams.pageSize = val;
    //   this.getDictionaryPOsByPage();
    // },
    // handleCurrentChange(val) {
    //   this.pageParams.pageNo = val;
    //   this.getDictionaryPOsByPage();
    // },
    changeSize(val) {
      if (val.page) {
        this.pageParams.pageNo = val.page;
      }
      if (val.pageSize) {
        this.pageParams.pageSize = val.pageSize;
      }
     this.getDictionaryPOsByPage();
    },
    cataNameBlur() {
      // this.$set(
      //   this.form,
      //   "nameWb",
      //   encodeUtil.makeWb(this.form.dictionaryName)
      // );
      // this.$set(
      //   this.form,
      //   "namePy",
      //   encodeUtil.makePy(this.form.dictionaryName)
      // );
    },
  },
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.dictionaries {
  .dictionaries-left {
    width: calc(100% - 300px);
    padding: 10px;
    border-right: 1px solid $l-color-bgcolor-11;
    .table-cont {
      height: calc(100% - 72px);
      margin: 20px 0;
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
  .dictionaries-right {
    width: 300px;
    padding: 10px;
    .dictionaries-right-form {
      height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
      overflow-y: auto;
    }
  }
}
.l-input-wrap {
  overflow: hidden;
}
.l-input-wrap + .l-input-wrap[data-v-fbd70dc8] {
  margin-left: 0px;
}
</style>