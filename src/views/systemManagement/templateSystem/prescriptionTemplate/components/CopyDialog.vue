<template>
  <div class="big-box">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="模版复制"
      :visible.sync="isShow"
    >
      <div class="choose-main">
        <l-formt-title style="margin-top:0" class="com-class" label="模版名称" labelWidth="64">
          <el-input v-model="copyInfo.templateName"></el-input>
        </l-formt-title>

        <l-formt-title  style="margin-bottom:0" class="com-class" label="复制到" labelWidth="48">
          <el-select clearable v-model="copyInfo.templateType" placeholder="请选择">
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
        <el-button class="sure-button" type="primary" @click="sureCopy">确定</el-button>
        <el-button class="cancle-button" @click="cancleCopy">取消</el-button>
      </div>
    </el-dialog>
    <success-message ref="success" :message="'复制模版成功'" />
  </div>
</template>

<script>
import successMessage from "@/views/systemManagement/components/SuccessMessage";
import warningMessage from "@/views/systemManagement/components/WarningMessage";
import {saveOrdersMould} from "@/api/cis/order/order";
export default {
  name: "publicDialog",
  components: {
    successMessage,
    warningMessage
  },
  props: {
    dialogType: {
      type: String,
      default: "copyTemplate"
    }
  },
  data() {
    return {
      isShow: false,
      data: {
        id: '',
        templetName: '',
        shareLevel: '',
        templetType: '',
        outpatientCisTempDetails: []
      },
      copyInfo: {
        templateName: "",
        templateType: ""
      },
      options: [
        {
          label: "个人模版",
          type: "3"
        },
        {
          label: "科室模版",
          type: "2"
        },
        {
          label: "全院模版",
          type: "1"
        }
      ]
    };
  },
  methods: {
    sureCopy() {
      this.$confirm("是否确定复制模板?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.data.templetName = this.copyInfo.templateName;
        this.data.shareLevel = this.copyInfo.templateType;
        this.data.templetType = this.copyInfo.templateType;
        this.doSave();
        this.isShow = false;
        this.$refs.success.isOpen = true;
        setTimeout(() => {
          this.$refs.success.isOpen = false;
        }, 1000);
      });
    },
    cancleCopy() {
      this.isShow = false;
      this.$message({
        type: "info",
        message: "已取消复制模板"
      });
    },
    doSave(){
      saveOrdersMould(this.data).then((res) => {
        if (res.code === 1) {
          this.$notify({
            title: '成功',
            message: '保存模板成功',
            type: 'success'
          });
        } else {
          this.$notify.error({
            title: '错误',
            message: '保存模板失败'
          });
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '保存模板失败'
        });
      })
    }
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
        .com-class {
          width: 300px;
          display: block;
          border-radius: 2px;
          margin: 10px auto;
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
