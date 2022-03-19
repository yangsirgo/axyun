<template>
  <el-dialog
    title="图片维护"
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="dialogClose"
    width="880px"
    append-to-body
  >
    <div style="margin: 15px 40px 15px 40px">
      <el-row>
        <el-col :span="12">
          <span style="margin-left: 2em" class="form-control">编码</span>
          <el-input
            v-model="myTemplate.imageCode"
            disabled
            style="width: 298px"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 2em" class="form-control">名称</span>
          <el-input
            v-model="myTemplate.imageName"
            :disabled="disabledFlag || vDisabled"
            style="width: 298px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span>图片分类</span>
          <el-select
            v-model="myTemplate.imageType"
            style="width: 298px"
            :disabled="disabledFlag || vDisabled"
          >
            <el-option
              v-for="item in imageTypeOpt"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>医护标识</span>
          <l-value-domain-emr
            :disabled="disabledFlag || vDisabled"
            style="width: 298px"
            code="EmployeeMark"
            :value.sync="myTemplate.dnFlag"
            placeholder="请选择"
            @change="changeDnFlag"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span>所属级别</span>
          <!-- <l-value-domain-emr
            ref="ownerType"
            clearable
            :disabled="vDisabled"
            style="width: 298px"
            code="LevelType"
            :value.sync="myTemplate.ownerType"
            placeholder="请选择"
            @change="changeOwner"
          ></l-value-domain-emr> -->
          <el-select
            :disabled="disabledFlag || vDisabled"
            v-model="myTemplate.ownerType"
            @change="changeOwner"
            placeholder="请选择"
            clearable
            style="width: 298px"
          >
            <el-option
              v-for="item in orgOptions"
              :key="item._id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>所属名称</span>
          <el-select
            multiple
            filterable
            collapse-tags
            v-model="ownerId"
            clearable
            :disabled="disabledFlag || vDisabled"
            placeholder="请选择"
            style="width: 298px"
            @change="ownerIdChanged"
          >
            <el-option
              v-for="item in ownNameOpt"
              :key="item.id"
              :label="item.orgNm"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 1em">拼音码</span>
          <el-input
            v-model="myTemplate.pinyinCode"
            :disabled="disabledFlag || vDisabled"
            readonly
            style="width: 298px"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 1em">五笔码</span>
          <el-input
            v-model="myTemplate.wubiCode"
            :disabled="disabledFlag || vDisabled"
            readonly
            style="width: 298px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 1em">助记码</span>
          <el-input
            v-model="myTemplate.customCode"
            :disabled="disabledFlag || vDisabled"
            style="width: 298px"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 1em">顺序号</span>
          <el-input
            v-model="myTemplate.sortNo"
            :disabled="disabledFlag || vDisabled"
            style="width: 298px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="24">
          <span style="margin-left: 2em; vertical-align: top">描述</span>
          <el-input
            type="textarea"
            :disabled="disabledFlag || vDisabled"
            style="width: 700px"
            v-model="myTemplate.description"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="24">
          <span class="form-control">上传图片</span>
          <el-upload
            style="margin-top: 5px; margin-left: 80px"
            ref="upload"
            :multiple="false"
            class="avatar-uploader"
            :action="baseUrl"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleOnChange"
            :on-error="handleUpdateError"
            :on-success="handleAvatarSuccess"
            :disabled="vDisabled"
          >
            <img
              v-if="myTemplate.fileUrl"
              :src="myTemplate.fileUrl"
              class="avatar"
              alt="图片"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button v-if="!vDisabled" type="primary" @click="submitForm"
        >确定</el-button
      >
      <el-button v-if="!vDisabled" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getUId, getUN } from "@/utils/crypto";
import { getPamars } from "@/utils/auth";
import { getServerConfig } from "@/utils/config";
import { getDeptList } from "@/api/admin/role";
import { insert, update, getCd } from "@/api/emrRecord/emr/image";
import hmm from "@/api/hmm/base.js";
import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

export default {
  props: {
    template: Object,
    imageTypeOpt: Array,
    isShow: {
      type: Boolean,
      default: false
    },
    disabledFlag: {
      type: Boolean,
      default: false
    }
  },
  mixins: [commonMixins],
  computed: {
    // 是否可编辑
    vDisabled() {
      if (this.myTemplate.enabled == "1") {
        return true;
      }
      return false;
    }
  },
  watch: {
    template(obj) {
      this.baseUrl = getServerConfig("EMR_BASE_API") + "/ueditor/uploadFile";
      if (
        (Object.keys(obj).length > 0 && obj.imageCode) ||
        obj.isform == "editor"
      ) {
        this.myTemplate = { ...obj };
        if (obj.isform) {
          // 来自编辑器时
          getCd()
            .then(res => {
              this.myTemplate.imageCode = res.data;
            })
            .catch(res => {
              this.$message({
                type: "error",
                message: res.msg
              });
            });
        }
        if (this.disabledFlag) {
          this.swithHandler(
            this.roleRevereMap[this.myTemplate.ownerType],
            this.dictListForCode
          );
        } else {
          this.swithHandler(
            this.getCurrRoleCodeHandler(),
            this.dictListForCode
          );
        }
      } else {
        for (let key in this.myTemplate) {
          this.myTemplate[key] = "";
        }
        this.myTemplate.ownerType = "";

        getCd()
          .then(res => {
            this.myTemplate.imageCode = res.data;
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
          });

        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      }

      this.changeOwner();
      this.needUpload = false;
    },
    isShow() {
      this.dialogVisible = this.isShow;
    }
  },
  data() {
    return {
      ownNameOpt: [],
      ownNameOptCopy: [],
      myTemplate: {
        dataVersion: "",
        deletedStatus: "",
        description: "",
        dnFlag: "",
        enabled: "",
        pinyinCode: "",
        wubiCode: "",
        customCode: "",
        sortNo: "",
        ownerId: "",
        ownerType: "",
        imageCode: "",
        imageType: "",
        imageId: "",
        imageName: "",
        visible: "",
        imageUrlId: "",
        fileUrl: ""
      },
      ownerId: [],
      typeRemoteParams: {},
      dialogVisible: this.isShow,
      needUpload: false,
      baseUrl: getServerConfig("EMR_BASE_API"),
      rules: {
        imageCode: [{ required: true, message: "请输入编码", trigger: "blur" }],
        imageName: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      orgOptions: [],
      dictListForCode: []
    };
  },
  async created() {
    this.getDeptListRequest();
    await this.handlerOrgList();
  },
  methods: {
    async handlerOrgList() {
      try {
        const { code, data, msg } = await hmm.getDictListForCode(
          "AllLevelType"
        );
        this.dictListForCode = data;
        const adminStr = this.getCurrRoleCodeHandler();
        if (code === 1 && data) {
          this.swithHandler(adminStr, data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    swithHandler(adminStr, data) {
      switch (adminStr) {
        case "tenant":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("9");
          });
          break;
        case "org":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("0");
          });
          break;
        case "dept":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("1");
          });
          break;
        case "other":
          this.orgOptions = data.filter(item => {
            return item.opt_lvl.includes("2");
          });
          break;
        default:
          break;
      }
    },
    ownerIdChanged() {
      console.log("ownerId", this.myTemplate.ownerId);
    },
    handleUpdateError(err) {
      console.log("err===");
      console.log(err);
      this.$message.error("上传失败");
    },
    handleAvatarSuccess(res, file) {
      console.log("success", res);
      this.myTemplate.imageUrlId = res.data.fileId;
      this.submitChange();
    },
    handleOnChange(file) {
      if (file) {
        this.needUpload = true;
        this.$set(this.myTemplate, "fileUrl", URL.createObjectURL(file.raw));
        console.log("fileUrl", this.myTemplate.fileUrl);
        console.log("fileUrl", this.baseUrl);
      }
    },
    //对话框关闭
    dialogClose() {
      this.$emit("update:isShow", false);
    },
    //确定
    submitForm() {
      if (
        this.myTemplate.imageCode === "" ||
        this.myTemplate.imageName === ""
      ) {
        this.$message.error("编码和名称不可为空！");
        return;
      }
      console.log("xxxxxxx", this.needUpload);
      // 新增状态 没有选择图片上传，则报错
      if (
        this.myTemplate.imageId === "" &&
        !this.needUpload &&
        !this.myTemplate.isform
      ) {
        this.$message.error("图片维护必须选择图片！");
        return;
      }
      if (this.needUpload && !this.myTemplate.isform) {
        console.log(this.needUpload);
        this.$refs.upload.submit();
      } else {
        this.submitChange();
      }
    },
    submitChange() {
      console.log("xxxxxxx----submitChange");

      let uId = this.myTemplate.imageId;
      console.log("myTemplate", this.myTemplate);

      this.myTemplate.ownerId = this.ownerId.join(",");

      if (uId == "" || uId == null || uId == undefined) {
        //new
        if (this.myTemplate.enabled === "") {
          this.myTemplate.enabled = "0";
        }
        insert(this.myTemplate)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-save", res.data);
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
            this.dialogClose();
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
            this.dialogClose();
          });
      } else {
        console.log("update=======");
        update(this.myTemplate)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-update", this.myTemplate);
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
            this.dialogClose();
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
            this.dialogClose();
          });
      }
    },
    handleCancel() {
      this.dialogClose();
    },
    getDeptListRequest() {
      getDeptList().then(res => {
        if (res.code === 1) {
          this.ownNameOptCopy = res.data;
        } else {
          this.$message("请求数据失败");
        }
      });
    },
    //根据所属级别变更所属名称可选项
    changeOwner(e) {
      this.ownerId = [];
      const orgMsg = JSON.parse(getPamars());
      const ownerType = this.myTemplate.ownerType;
      switch (ownerType) {
        case "0":
          const hosName = orgMsg.hosName;
          const hosId = orgMsg.hosId;
          this.ownNameOpt = [{ id: hosId, orgNm: hosName }];
          this.ownerId = [hosId];
          break;
        case "1":
          this.ownNameOpt = this.ownNameOptCopy;

          if (!e) {
            this.ownerId = this.myTemplate.ownerId
              .split(",")
              .map(item => Number(item));
          } else {
            this.ownerId = [this.ownNameOpt[0].id];
          }

          break;
        case "2":
          this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.ownerId = [getUId()];
          break;
        case "9":
          this.ownNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerId = [orgMsg.orgId];
          break;
      }
    },
    //医护标识下拉事件
    changeDnFlag() {
      if (this.myTemplate.dnFlag != "") {
        this.typeRemoteParams = { dnFlag: this.myTemplate.dnFlag };
      } else {
        this.typeRemoteParams = {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.myFormItem {
  width: 298px;
  display: inline-block;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
/deep/.el-form-item__content {
  margin-left: 0px !important;
}
.avatar-uploader {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.form-control {
  position: relative;
  /*margin-left: 2em;*/
  width: 100px;
}
.form-control:before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  top: 2px;
  left: -6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
