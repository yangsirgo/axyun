<template>
  <div class="seq-container">
    <el-form :inline="true" :model="form" ref="form" class="seq-form">
      <el-form-item v-if="false">
        <el-input
          v-model="form.seqType"
          placeholder="请输入流水号名"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="false">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="handleSeqReset"
          plain
          >重置</el-button
        >
      </el-form-item>

      <el-form-item label="" class="seq-form-item">
        <el-select
          v-model="form.dType"
          placeholder="请选择类型"
          @change="handleSeqQuery"
        >
          <el-option
            v-for="item in dType"
            :key="item.val"
            :label="item.label"
            :value="item.val"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.seqName"
          placeholder="请输入流水号名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.bName" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSeqQuery"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleSeqReset"
          >重置</el-button
        >
      </el-form-item>

      <el-tooltip
        style="float: right"
        effect="dark"
        content="注意-会覆盖之前的 [缓存数据库] 数据"
        placement="top-start"
      >
        <el-form-item>
          <el-button type="primary" icon="el-icon-upload2" @click="doUploadRDB"
            >上传元数据</el-button
          >
        </el-form-item>
      </el-tooltip>
      <!-- -->
      <el-tooltip
        style="float: right"
        effect="dark"
        content="注意-会覆盖现有的 [关系数据库] 数据"
        placement="top-start"
      >
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="doSyncDB"
            >同步本地库</el-button
          >
        </el-form-item>
      </el-tooltip>
      <el-form-item style="float: right">
        <el-button type="primary" icon="el-icon-plus" @click="handleSeqAdd"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      ref="seqTable"
      :data="seqLists"
      height="450"
      border
      stripe
      :highlight-current-row="false"
      class="seq-table"
      element-loading-text="加载中"
    >
      <el-table-column
        v-for="(item, index) in seqParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
      >
      </el-table-column>

      <el-table-column label=" " width="150">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="获取本流水号最大值"
            placement="top-start"
          >
            <el-button type="text" @click="handleSeqShow(scope.row)"
              >当前值</el-button
            >
          </el-tooltip>

          <el-tooltip
            effect="dark"
            content="修改本流水号最大值"
            placement="top-start"
          >
            <el-button type="text" @click="handleEditSeq(scope.row)"
              >改值</el-button
            >
          </el-tooltip>

          <el-tooltip
            effect="dark"
            content="强制解除本流水号锁"
            placement="top-start"
          >
            <el-button type="text" @click="handleDelLock(scope.row)"
              >解锁</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="text" v-if="false" @click="handleSeqEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" @click="handleSeqRemove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="seq-pagination">
      <pagination
        v-show="total > 0"
        :total="total"
        :pageSize.sync="form.pageSize"
        :page.sync="form.page"
        @pagination="changePageSize"
        :refresh="true"
      />
    </div>

    <seq-info-dialog
      :isShow.sync="dialogVisible"
      :seqData="seqData"
      title="新建流水号"
      @submit="handleSubmit"
      :dtypeData="dType"
    />
    <el-dialog
      :before-close="handleClose"
      :visible="sqeVisible"
      title="删除元数据流水号"
      class="dialogStyle"
    >
      <div style="height: 50px; margin-top: 10px">
        <el-col :span="5" style="text-align: right">
          <div class="titleStyle">流水号名:</div>
        </el-col>
        <el-col :span="14">
          <el-input v-model="seqType" placeholder="请输入流水号名"></el-input>
        </el-col>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSqeSave">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :before-close="handleCloseCur"
      :visible="sqeCurVisible"
      :title="'修改当前值-' + CurData.seqName"
      class="dialogStyle"
    >
      <div style="height: 50px; margin-top: 10px">
        <el-col :span="5" style="text-align: right">
          <div class="titleStyle">当前值:</div>
        </el-col>
        <el-col :span="14">
          <el-input v-model="currentData" placeholder=""></el-input>
        </el-col>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSqeCruSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog class="alert" :visible.sync="alertVisibile" width="30%">
      <i class="el-icon-close" @click="handleCloseAlert"></i>
      <div class="curData">
        <i class="el-icon-info"></i>
        <span>{{CurData.seqName}} - 当前值:{{ currentData }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import seqInfoDialog from "./components/SeqInfoDialog";
import {
  getSeqPageList,
  addPageSeq,
  deletePageSeq,
  syncDB,
  uploadRDB,
  getCurr,
  deleteMetas,
  saveCurr,
  delLock,
} from "@/api/wconf/sequence";

export default {
  data() {
    return {
      alertVisibile: false,
      CurData: {},
      currentData: null,
      sqeCurVisible: false,
      seqType: "",
      form: {
        page: 1,
        pageSize: 10,
        orderBy: "id desc",
      },
      seqParams: [
        {
          prop: "bName",
          label: "描述",
        },
        {
          prop: "seqName",
          label: "流水号名",
        },
        {
          prop: "dType",
          label: "类型",
        },
        {
          prop: "initVal",
          label: "初始值",
        },
        {
          prop: "bFormat",
          label: "格式",
          width: 200,
        },
      ],
      dType: [
        {
          val: "",
          label: "请选择",
        },
        {
          val: "day",
          label: "按天",
        },
        {
          val: "week",
          label: "按周",
        },
        {
          val: "month",
          label: "按月",
        },
      ],
      seqData: {},
      seqList: [],
      seqLists: [],
      total: 0,
      sqeVisible: false,
      dialogVisible: false,
    };
  },
  components: {
    seqInfoDialog,
  },
  mounted() {
    this.getSeqPageList();
  },
  methods: {
    getSeqPageList() {
      getSeqPageList(this.form)
        .then((res) => {
          console.log(res.data);
          this.seqList = res.data;
          for (var i = 0; i < this.seqList.length; i++) {
            for (var j = 0; j < this.dType.length; j++) {
              if (
                this.seqList[i].dType == "" ||
                this.seqList[i].dType == "无"
              ) {
                this.seqList[i].dType = "无";
              } else if (this.seqList[i].dType == this.dType[j].val) {
                this.seqList[i].dType = this.dType[j].label;
              }
            }
          }
          this.seqLists = this.seqList;
          this.total = res.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSeqQuery() {
      /*
        let obj = {
          pageSize: 10,
          page: 1
        }

        this.form = { ...this.form, ...obj }
        */
      this.getSeqPageList();
    },
    handleSeqAdd() {
      this.seqData = {
        seqType: "",
        currVal: "",
        formate: "",
      };
      this.dialogVisible = true;
    },
    handleSeqReset() {
      this.$refs.form.resetFields();
      let obj = {
        // seqType: "",
        seqName: "",
        bName: "",
        dType: "",
        pageSize: 10,
        page: 1,
      };
      this.form = { ...this.form, ...obj };
      this.getSeqPageList();
    },
    handleMultiSeqRemove() {},
    handleSeqRemove(row) {
      this.$confirm("您确定删除吗?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePageSeq(row)
            .then((res) => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "删除流水号成功",
                });
                this.getSeqPageList();
              } else {
                this.$message({
                  type: "error",
                  message: "删除流水号失败",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSeqEdit(row) {
      //
      return;
      // this.seqData = { ...row }
      // this.dialogVisible = true
    },
    handleSubmit(data) {
      this.dialogVisible = false;

      addPageSeq(data)
        .then((res) => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "添加流水号成功",
            });
            this.getSeqPageList();
          } else {
            this.$message({
              type: "error",
              message: "添加流水号失败",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changePageSize(obj) {
      this.form = { ...this.form, ...obj };
      this.getSeqPageList();
    },

    ///
    doSyncDB() {
      this.$confirm("您确定同步吗?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          syncDB()
            .then((res) => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "同步成功",
                });
                this.getSeqPageList();
              } else {
                this.$message({
                  type: "error",
                  message: "同步失败",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          /*
          this.$message({
            type: 'info',
            message: '已取消'
          })
          */
        });
    },
    doUploadRDB() {
      this.$confirm("您确定上传吗?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          uploadRDB()
            .then((res) => {
              if (res.code === 1) {
                this.$message({
                  type: "success",
                  message: "上传成功",
                });
              } else {
                this.$message({
                  type: "error",
                  message: "上传失败",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          /*
          this.$message({
            type: 'info',
            message: '已取消'
          })
          */
        });
    },

    handleDelete() {
      this.sqeVisible = true;
      this.seqType = "";
    },

    handleSqeSave() {
      if (this.sqeType == "") {
        this.$message("流水号名称不能为空");
        return;
      }
      this.sqeVisible = false;
      this.deleteMetas();
    },

    handleSqeCruSave() {
      if (!this.currentData) {
        this.$message("当前值不能为空");
        return;
      }
      this.sqeCurVisible = false;
      this.handleSaveSqeCru();
    },

    // 修改当前值保存
    handleSaveSqeCru() {
      let obj = {
        initVal: this.currentData,
        seqName: this.CurData.seqName,
      };
      if (obj.initVal % 1 != 0) {
        this.$message({ type: "error", message: "当前值只能为整数!" });
        this.sqeCurVisible = true;
        return;
      }

      saveCurr(obj)
        .then((res) => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg || "修改失败",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleClose() {
      this.sqeVisible = false;
    },

    handleCloseCur() {
      this.sqeCurVisible = false;
    },

    deleteMetas() {
      deleteMetas({ seqType: this.seqType })
        .then((res) => {
          if (res.code == 1) {
            this.$message({ type: "success", message: "删除成功" });
          } else {
            this.$message({ type: "error", message: "删除失败" });
          }
        })
        .catch((error) => {
          this.$message({ type: "error", message: "删除失败" + error.msg });
        });
    },

    handleSeqShow(data) {
      let obj = { seqName: data.seqName };
      this.CurData=data;
      getCurr(obj)
        .then((res) => {
          if (res.code === 1) {
            // this.$alert("当前值:" + res.data, {
            //   showConfirmButton: false,
            //   closeOnClickModal: true,
            //   type: "warning",
            // })
            //   .then((res) => {
            //     console.log("resresres", res);
            //   })
            //   .catch((err) => {
            //     console.log("error", err);
            //   });
            this.currentData = res.data;
            this.alertVisibile = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleCloseAlert() {
      this.alertVisibile = false;
    },

    // // 修改当前值
    handleEditSeq(data) {
      console.log("data", data);
      this.CurData = data;
      let obj = { seqName: data.seqName };
      getCurr(obj)
        .then((res) => {
          if (res.code === 1) {
            this.currentData = res.data;
            this.sqeCurVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 解锁
    handleDelLock(data) {
      let obj = { seqName: data.seqName };
      delLock(obj)
        .then((res) => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "解锁成功",
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg || "操作失败",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.seq-container {
  background-color: #fff;
  height: 100%;
  padding: 20px;
  overflow: hidden;
}
.seq-form {
  overflow: hidden;

  .btns {
    float: right;
  }
}
.seq-table {
  margin: 20px 0;
}
.pagination-container {
  text-align: right;
}

.dialogStyle {
  /deep/.el-dialog {
    width: 430px;
  }
}
.titleStyle {
  height: 40px;
  line-height: 30px;
  font-weight: 600;
  padding-right: 5px;
}
.seq-table {
  /deep/.el-button--medium {
    font-size: 12px;
    padding: 1px;
  }
}
.alert {
  /deep/.el-dialog__header {
    display: none;
  }
  /deep/.el-dialog__body {
    padding: 35px 20px 25px;
    text-align: center;
  }
}
.el-icon-info {
  font-size: 17px;
  padding-right: 10px;
  padding-top: 8px;
  color: #ff9a0096;
}
.el-icon-close {
  float: right;
  margin-top: -20px;
  font-size: 20px;
  z-index: 9999;
}
.el-dialog__header {
  font-weight:600;
}
</style>
