<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="7">
              <LFormtTitle label="目录代码">
                <el-input v-model="cataCode" placeholder="请输入目录代码" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="7">
              <LFormtTitle label="目录名称">
                <el-input v-model="cataName" placeholder="请输入目录名称" clearable></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="7">
              <LFormtTitle label="模块" :required="false" placeholder="请选择模块">
                <select-tree
                  :data.sync="selectData"
                  :selectValue.sync="selectVal"
                  :treeValue.sync="moduleId"
                  :keyValue.sync="keyValue"
                  @handleSelect="handleSelect1"
                />
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn" style="margin-left:20px">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="add">新增</el-button>
          <!--暂时隐藏掉-->
          <!-- <el-button type="primary" plain @click="cancel">重置</el-button>
          <el-button type="primary" plain>导出</el-button>-->
        </div>
      </div>

      <div class="table-cont">
        <el-table
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
                <span v-else>{{scope.row[item.prop]}}</span>
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
          :page-sizes="[20, 40, 60, 100,300,500,1000,3000,5000,10000]"
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
    <div class="catalogue-right height100 float-right">
      <el-form :model="form" :rules="rules" ref="form" class="catalogue-right-form">
        <LFormtTitle label="目录代码" :required="true" :disabled="!addStatus">
          <el-form-item prop="cataCode">
            <el-input
              v-model="form.cataCode"
              placeholder="请输入目录代码"
              clearable
              :disabled="!addStatus"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="目录名称" :required="true" class="margin-top-20"   :disabled="!addStatus">
          <el-form-item prop="cataName">
            <el-input
              v-model="form.cataName"
              @change="cataNameBlur"
              placeholder="请输入目录名称"
              clearable
              :disabled="!addStatus"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="拼音" class="margin-top-20" :disabled="addStatus">
          <el-form-item prop="namePy">
            <el-input v-model="form.namePy" placeholder="请输入拼音" clearable  :disabled="addStatus"></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="五笔" class="margin-top-20" disabled>
          <el-form-item prop="nameWb">
            <el-input v-model="form.nameWb" placeholder="请输入五笔" clearable disabled></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="状态" :required="false" class="margin-top-20">
          <el-form-item>
            <el-radio v-model="form.recordStatus" label="1">启用</el-radio>
            <el-radio v-model="form.recordStatus" label="0">未启用</el-radio>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="模块" :required="true" class="margin-top-20" :disabled="disableds">
          <select-tree
            :data.sync="selectData"
            :selectValue.sync="selectValue"
            :treeValue.sync="form.moduleId"
            :keyValue.sync="keyValue"
            :validateSelect.sync="validateSelect"
            :isRequest.sync="isRequest"
            :validateContent.sync="validateContent"
            :disableSelect.sync="disableds"
            @handleSelect="handleSelect"
          />
        </LFormtTitle>
        <LFormtTitle label="备注" :required="false" class="margin-top-20">
          <el-form-item>
            <el-input v-model="form.recordRemark" placeholder="请输入备注" clearable :disabled="false"></el-input>
          </el-form-item>
        </LFormtTitle>
      </el-form>
      <div class="width100 clearfix catalogue-right-btn">
        
        <el-button class="float-right" type="primary" @click="save" style="margin-left:10px">保存</el-button>
        <el-button
          class="float-right"
          v-if="!addStatus"
          type="primary"
          plain
          @click="dele"
        >删除</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/wconf/cnfDictionary";
import {serchMoudle} from "@/api/wconf/wparam.js";
import encodeUtil from "@/utils/encodeUtil.js";
export default {
  components: {},
  data() {
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
      disableds: false,
      isRequest: true,
      validateSelect: true,
      validateContent: "请选择模块",
      selectVal: "",
      moduleId: null,
      treeValue: null,
      selectValue: "",
      keyValue: "id",
      addStatus: false,
      loading: false,
      cataCode: "",
      cataName: "",
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "moduleName",
          label: "模块名",
          align: "center",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "cataCode",
          label: "目录代码",
          align: "center",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "cataName",
          label: "目录名称",
          align: "center",
          headerAlign: "center",
          width: "100",
          fixed: false,
        },
        {
          prop: "namePy",
          label: "拼音",
          align: "center",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "nameWb",
          label: "五笔",
          align: "center",
          headerAlign: "center",
          width: "120",
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "center",
          headerAlign: "center",
          width: "120",
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
        cataCode: "",
        cataName: "",
        namePy: "",
        nameWb: "",
        recordStatus: "1",
        recordRemark: "",
        moduleId: null,
      },
      selectData: [],
      rules: {
        cataCode: [
          { required: true, message: "请输入目录代码", trigger: "blur" },
        ],
        cataName: [
          { required: true, message: "请输入目录名称", trigger: "blur" },
          { validator: chinese, trigger: "blur" },
        ],
        // namePy: [{ required: true, message: "请输入拼音", trigger: "blur" }],
        // nameWb: [{ required: true, message: "请输入五笔", trigger: "blur" }]
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
    this.getDictionaryCatalogPOsByPage();
    this.serchMoudle();
  },
  methods: {
    serchMoudle() {
      let obj = {
        val: "MODULE_VAL",
      };
        serchMoudle(obj)
        .then((res) => {
          if (res.code == 1) {
            this.selectData = res.data;
          } else {
            this.$message({ type: "error", message: res.msg });
          }
        })
        .catch((error) => {
          this.$message({ type: "error", message: error || "查询失败" });
        });
    },

    handleSelect(data) {
      if (data.id) {
        this.selectValue = data.label;
        this.form.moduleVal = data.exts.paramValue;
        this.form.moduleId = data.id;
      } else {
        this.form.moduleVal = "";
        this.form.moduleId = null;
        this.selectValue = "";
      }
    },
    handleSelect1(data) {
      if (data.id) {
        this.moduleId = data.id;
        this.selectVal = data.label;
      } else {
        this.moduleId = null;
        this.selectVal = "";
      }
    },

    async getDictionaryCatalogPOsByPage() {
      this.loading = true;
      await service
        .getDictionaryCatalogPOsByPage({
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
          cataCode: this.cataCode, // 目录代码
          cataName: this.cataName, // 目录名称
          moduleId: this.moduleId,
        })
        .then((res) => {
          if (res.code == 1) {
            this.loading = false;
            this.tableData = res.data;
            this.pageParams.total = res.total;
            this.validateSelect = true;
            if (res.data.length == 0) {
              this.addStatus = true;
              this.disableds = false;
              this.form = {
                cataCode: "",
                cataName: "",
                namePy: "",
                nameWb: "",
                recordStatus: "1",
                recordRemark: "",
                moduleId: null,
                moduleVal: "",
              };
              this.selectValue = "";
            } else {
              this.currentData = this.tableData[0];
              this.$emit("currentData", this.currentData);
              this.form = { ...this.tableData[0] };
              this.selectValue = this.tableData[0].moduleName;
              this.addStatus = false;
              this.disableds = true;
            }
          } else {
            this.loading = false;
            this.$message({ type: "error", message: "查询失败" });
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message({ type: "error", message: "查询失败" });
        });
    },

    search() {
      this.pageParams.pageNo = 1;
      this.getDictionaryCatalogPOsByPage();
    },

    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
      this.addStatus = false;
      this.disableds = true;
      this.form = { ...row };
      this.form.moduleId = row.moduleId;
      this.selectValue = row.moduleName;
      this.validateSelect = true;
    },

    async add() {
      this.form = {
        cataCode: "",
        cataName: "",
        namePy: "",
        nameWb: "",
        recordStatus: "1",
        recordRemark: "",
        moduleId: null,
        moduleVal: "",
      };
      this.selectValue = "";
      this.addStatus = true;
      this.disableds = false;
      this.validateSelect = true;
    },

    dele() {
      if (!this.form.cataCode) {
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
          this.validateSelect = true;
          // this.getDictionaryPOsByPage();
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },

    async delete() {
      // try {
      // this.$showLoading;
      await service
        .delDictionaryCatalogPO({
          cataLogId: this.form.id,
        })
        .then((res) => {
          if (res.code == "1") {
            this.$message({ type: "success", message: "删除成功" });
            this.getDictionaryCatalogPOsByPage();
          } else {
            this.$message({
              type: "error",
              message: "删除失败" + res.msg || "删除失败",
            });
          }
        })
        .catch((error) => {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "删除失败");
        });
      // this.$hideLoading;
      // } catch (error) {
      // }
    },

    async save() {
      if (!this.form.moduleId) {
        this.validateSelect = false;
        this.$message({type:"error",message:"请选择模块"})
        return;
      } else {
        this.validateSelect = true;
      }

      if (this.addStatus) {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // try {
            this.$showLoading();
            await service
              .addDictionaryCatalogPO(this.form)
              .then((res) => {
                console.log("res", res);
                if (res.code == 1) {
                  this.$message({ type: "success", message: "新增成功" });
                  this.getDictionaryCatalogPOsByPage();
                  this.$hideLoading();
                } else {
                  this.$message({ type: "error", message: res.msg });
                  this.$hideLoading();
                }
              })
              .catch((error) => {
                console.info(error);
                this.$hideLoading();
                this.$message.error(error.msg || "新增失败");
              });

            // } catch (error) {
            // console.info(error);
            // this.$hideLoading();
            // this.$message.error(error.msg || "新增失败");
            // }
          }
        });
      } else {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            try {
              this.$showLoading();
              await service.updateDictionaryCatalogPO(this.form).then((res) => {
                if (res.code == "1") {
                  this.$hideLoading();
                  this.$message({ type: "success", message: "保存成功" });
                  this.getDictionaryCatalogPOsByPage();
                } else {
                  this.$hideLoading();
                  this.$message({
                    type: "error",
                    message: res.msg || "保存失败",
                  });
                }
              });
            } catch (error) {
              console.info(error);
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
          }
        });
      }
    },
    // 分页
    // handleSizeChange(val) {
    //   this.pageParams.pageSize = val;
    //   this.getDictionaryCatalogPOsByPage();
    // },
    // handleCurrentChange(val) {
    //   this.pageParams.pageNo = val;
    //   this.getDictionaryCatalogPOsByPage();
    // },
     changeSize(val) {
      if (val.page) {
        this.pageParams.pageNo = val.page;
      }
      if (val.pageSize) {
        this.pageParams.pageSize = val.pageSize;
      }
     this.getDictionaryCatalogPOsByPage();
     },
    cataNameBlur() {
      // this.form.nameWb = encodeUtil.makeWb(this.form.cataName);
      // this.form.namePy = encodeUtil.makePy(this.form.cataName);
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
.catalogue {
  .catalogue-left {
    width: calc(100% - 300px);
    padding: 10px;
    border-right: 1px solid $l-color-bgcolor-11;
    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      height: calc(100% - 106px);
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
  .catalogue-right {
    width: 300px;
    padding: 10px;
    .catalogue-right-form {
      height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
      overflow-y: auto;
    }
    .catalogue-right-btn {
      margin-top: 10px;
    }
  }
}
.l-input-wrap {
  overflow: hidden;
}
.l-input-wrap+.l-input-wrap[data-v-fbd70dc8] {
    margin-left: 0px;
}
</style>