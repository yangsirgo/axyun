<template>
  <div class="big-box">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="title"
      :visible.sync="isShow"
    >
      <div class="choose-main">
        <l-formt-title class="com-class" label="诊断类型" labelWidth="64">
          <el-select clearable v-model="addInfo.diagType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.type"
            ></el-option>
          </el-select>
        </l-formt-title>

        <l-formt-title class="com-class" label="中/西医" labelWidth="64">
          <el-select clearable v-model="addInfo.cwFlag" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.type"
            ></el-option>
          </el-select>
        </l-formt-title>

        <l-formt-title style="margin-top:0" class="com-class" label="诊断名称" labelWidth="64">
          <el-input v-model="addInfo.diagName"></el-input>
        </l-formt-title>

        <l-formt-title style="margin-top:0" class="com-class" label="诊断描述" labelWidth="64">
          <el-input v-model="addInfo.diagIcd"></el-input>
        </l-formt-title>

        <l-formt-title style="margin-bottom:0" class="com-class" label="主诊断" labelWidth="48">
          <el-select clearable v-model="addInfo.diagMain" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.type"
          ></el-option>
          </el-select>
        </l-formt-title>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="sure-button" type="primary" @click="sureClick">确定</el-button>
        <el-button class="cancle-button" @click="cancleClick">取消</el-button>
      </div>
    </el-dialog>
    <success-message ref="success" :message="message" />
  </div>
</template>

<script>
import successMessage from "@/views/systemManagement/components/SuccessMessage";
import warningMessage from "@/views/systemManagement/components/WarningMessage";
import diagnosisTemplateAPI from "@/api/systemManagement/templateSystem/diagnosisTemplate";
export default {
  name: "publicDialog",
  components: {
    successMessage,
    warningMessage
  },
  props: {
    title: {
      type: String,
      default: "新增诊断"
    },
    dialogType: {
      type: String,
      default: "add"
    },
    rowId: {
      type: String
    },
    indexGlobal: {
      type: Number
    },
    rowData: {
    },


  },
  data() {
    return {
      isShow: false,
      message: "模版新增成功",
      addInfo: {
        diagType: "1",
        cwFlag: "1",
        diagName: "",
        diagIcd: "",
        diagMain: ""
      },
      options: [
        {
          label: "中医",
          type: "1"
        },
        {
          label: "西医",
          type: "2"
        }
      ]
    };
  },
  watch: {
    rowData() {
      this.addInfo = this.rowData;
    }
  },

  methods: {
    sureClick() {
      this.isShow = false;
      if (this.dialogType === "add") {
        this.$confirm("新增完成, 是否提交新增明细?", "提示", {
          confirmButtonText: "提交",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // this.$message({
            //   type: 'success',
            //   message: '提交修改成功!'
            // });
            this.addInfo.tempId=this.rowId;
            diagnosisTemplateAPI.addTempDoctorDiag(this.addInfo).then(res => {
              this.$emit('showDetail', this.indexGlobal);
            });
            this.message = "明细新增成功";
            this.dealDialog();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消提交新增明细"
            });
          });
      } else if (this.dialogType === "change") {
        this.$confirm("修改完成, 是否提交修改?", "提示", {
          confirmButtonText: "提交",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // this.$message({
            //   type: 'success',
            //   message: '提交修改成功!'
            // });
            diagnosisTemplateAPI.updateTempDoctorDiag(this.addInfo).then(res => {
              this.$emit('showDetail', this.indexGlobal);
            });
            this.message = "诊断修改成功";
            this.dealDialog();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消提交修改"
            });
          });
      }
    },
    dealDialog() {
      this.$refs.success.isOpen = true;
      setTimeout(() => {
        this.$refs.success.isOpen = false;
      }, 1000);
    },
    cancleClick() {
      this.$confirm("确认取消,数据将不会保存?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.isShow = false;
        // this.$message({
        //   type: 'success',
        //   message: '提交修改成功!'
        // });
      });
    },
    sureAdd() {},
    cancleAdd() {},
    sureModify() {},
    cancleModify() {}
  }
};
</script>
<style lang='scss' scoped>
/deep/.big-box {
  .el-dialog {
    width: 470px;
    border-radius: 4px;
    .el-dialog__body {
      padding: 20px;
      .choose-main {
        .com-class{
          width: 300px;
          display: block;
          margin: 0 auto 10px;
          border-radius: 2px;
        }
      }
    }
    .el-dialog__footer {
      border-top: 1px solid $l-color-bgcolor-11;
      height: 76px;
      padding: 20px;
      .dialog-footer {
        .sure-button,
        .cancle-button {
          width: 80px;
          height: 36px;
          border-radius: 2px;
          font-size: $l-font-size;
          border: 1px solid $l-color-primary;
          color: $l-color-primary;
        }
        .sure-button {
          color: #fff;
          padding: 0;
        }
      }
    }
  }
}
</style>
