<template>
  <div style=" height:380px!important">
    <div v-if="id">
      <div v-if="imgUrl">
        <div>
          <el-image style=" height: 100%;" fit="fill" :src="imgUrl" :preview-src-list="[imgUrl]"></el-image>
        </div>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDelete">删除图片</el-button>
        </div>
      </div>
      <div class="block" v-else>
          <div slot="error" class="image-slot">
            <el-upload
              action="#"
              :auto-upload="false"
              list-type="picture-card"
              :class="{hide:hideUpload}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :file-list="fileList"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </div>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleOk">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { deletSign, addSign } from "@/api/admin/user";
export default {
  data() {
    return {
      hideUpload: false,
      limitCount: 1,
      file: {},
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  props: {
    imgUrl: {
      type: String,
      default() {
        return "";
      }
    },
    id: {
      type: String,
      default() {
        return "";
      }
    }
  },
  mounted() {},
  methods: {
    handleChange(file, fileList) {
      console.log("file", file);
      let isPNG = file.raw.type === "image/png";
      let isLt2M = file.raw.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$message.error("上传图片只能是 png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      if (isLt2M && isPNG) {
        this.hideUpload = fileList.length >= this.limitCount;
        if (fileList) {
          this.file = fileList[0];
        }
      } else {
        this.fileList = [];
        this.hideUpload = false;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
      //   this.fileList=fileList
      if (fileList) {
        this.file = fileList[0];
      }
    },
    handleOk() {
      if (!this.file.raw) {
        this.$message("图片不能为空");
        return;
      }
      let reqForm = new FormData(); //清空reqFrom
      reqForm.append("userId", this.id);
      reqForm.append("file", this.file.raw);
      console.log("file", this.file);

      this.handleAdd(reqForm);
    },
    handleCancel() {
      this.fileList = [];
      this.file={}
      this.hideUpload = false;
      this.$emit("handleupload");
    },
    handleDelete() {
      deletSign({ id: this.id }).then(res => {
        if (res.code === 1) {
          this.$message("删除签名成功");
          this.fileList = [];
          this.hideUpload = false;
          this.file = {};
          this.$emit("handleupload", "delSuccess");
        } else {
          this.$message("删除签名失败");
        }
      });
    },
    handleAdd(obj) {
      addSign(obj).then(res => {
        if (res.code === 1) {
          this.$message("添加签名成功");
          this.$emit("handleupload", "success");
        } else {
          this.$message("添加签名失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hide {
  /deep/.el-upload--picture-card {
    display: none;
  }
}
/deep/.el-upload-list__item {
  width: 250px;
  height: 250px !important;
}
/deep/.el-upload {
  width: 250px;
  height: 250px;
  line-height: 250px;
}
.dialog-footer {
  margin: 20px;
  text-align: right;
}
/deep/.el-image {
  width: 250px;
  height: 250px;
}
</style>