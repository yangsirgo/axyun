<template>
  <el-dialog
    title="知识库维护"
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="dialogClose"
    width="850px"
  >
    <div class="edit-section" style="margin: 15px 50px">
      <el-row>
        <el-col :span="12">
          <span class="form-control">知识库编码</span>
          <el-input
            v-model="myTemplate.kLibCd"
            maxlength="50"
            placeholder="字数最多不超过50字！"
            disabled
            class="form-item"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span class="form-control">知识库名称</span>
          <el-input
            maxlength="100"
            placeholder="字数最多不超过100字！"
            v-model="myTemplate.kLibNm"
            :disabled="disabledFlag || vDisabled"
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span class="form-control">知识库分类</span>
          <l-value-domain-emr
            clearable
            ref="kLibTpCd"
            class="form-item"
            :disabled="disabledFlag || vDisabled"
            remoteUrl="/knowledgeLibTp/all"
            :remoteParams="typeRemoteParams"
            remoteShowKey="kLibTpNm"
            remoteValueKey="mdKLibTpId"
            :value.sync="myTemplate.kLibTpCd"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
        <el-col :span="12">
          <span class="form-control" style="margin-left: 1em">医护标识</span>
          <l-value-domain-emr
            :disabled="disabledFlag || vDisabled"
            class="form-item"
            code="EmployeeMark"
            :value.sync="myTemplate.dnFlag"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span class="form-control" style="margin-left: 1em">所属级别</span>
          <!-- <l-value-domain-emr
            ref="ownerCd"
            clearable
            :disabled="vDisabled || disFlag"
            class="form-item"
            code="LevelType"
            :value.sync="myTemplate.ownerTp"
            placeholder="请选择"
            @change="changeOwner(false)"
          ></l-value-domain-emr> -->
          <el-select
            :disabled="disabledFlag || vDisabled || disFlag"
            v-model="myTemplate.ownerTp"
            @change="changeOwner"
            placeholder="请选择"
            clearable
            class="form-item"
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
          <span class="form-control" style="margin-left: 1em">所属名称</span>
          <el-select
            v-model="ownerCd"
            clearable
            multiple
            filterable
            :disabled="disabledFlag || vDisabled || disFlag"
            placeholder="请选择"
            class="form-item"
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
          <span class="form-control" style="margin-left: 1em">是否系统</span>
          <l-value-domain-emr
            :disabled="disabledFlag || vDisabled"
            class="form-item"
            code="systemF"
            :value.sync="myTemplate.systemF"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
        <el-col :span="12">
          <span class="form-control">采用编辑器</span>
          <el-select
            v-model="myTemplate.editor"
            clearable
            :disabled="disabledFlag || vDisabled"
            placeholder="请选择"
            class="form-item"
          >
            <el-option
              v-for="item in editorOpt"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span class="form-control" style="margin-left: 1em">启用标识</span>
          <l-value-domain-emr
            disabled
            class="form-item"
            code="ModelStatus"
            :value.sync="myTemplate.enableF"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 2em">拼音码</span>
          <el-input
            v-model="myTemplate.pinyinCd"
            :disabled="true"
            readonly
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 2em">五笔码</span>
          <el-input
            v-model="myTemplate.wubiCd"
            :disabled="true"
            class="form-item"
            readonly
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 2em">助记码</span>
          <el-input
            v-model="myTemplate.customCd"
            :disabled="disabledFlag || vDisabled"
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="margin-left: 2em">顺序码</span>
          <el-input
            maxlength="100"
            placeholder="字数最多不超过100字！"
            v-model="myTemplate.sortNo"
            :disabled="disabledFlag || vDisabled"
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px; height: 60px">
        <span class="form-control">知识库内容</span>
        <el-input
          maxlength="100"
          placeholder="字数最多不超过100字！"
          type="textarea"
          :disabled="disabledFlag || vDisabled"
          style="width: 600px"
          v-model="myTemplate.kLibContent"
        />
      </el-row>
      <el-row style="margin-top: 12px; height: 60px">
        <span style="margin-left: 3em">备注</span>
        <el-input
          maxlength="100"
          placeholder="字数最多不超过100字！"
          type="textarea"
          :disabled="disabledFlag || vDisabled"
          style="width: 600px"
          v-model="myTemplate.comm"
        />
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editModel" type="primary" @click="handleDetermine"
        >确定
      </el-button>
      <el-button v-if="editModel" @click="handleCancel">取消</el-button>
      <el-button
        v-if="viewModel"
        @click="handleCancel"
        style="margin-right: 18px"
        >关闭
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getUId, getUN } from "@/utils/crypto";

import { getPamars } from "@/utils/auth";
import { get } from "@/utils/requestEmr";

import {
  save,
  update,
  knowledgeLibTpSeq,
  updateVersion
} from "@/api/emrRecord/emr/knowledge";
import hmm from "@/api/hmm/base.js";
import { getDeptList } from "@/api/admin/role";

import commonMixins from "@/views/emrRecord/DocTempMaintenance/mixins/common.js";

export default {
  props: {
    template: Object,
    //模板内容
    innerHtml: String,
    isShow: {
      type: Boolean,
      default: false
    },
    //是否保存模板内容
    saveContent: {
      type: Boolean,
      default: false
    },
    disabledFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    vDisabled() {
      if (this.myTemplate.enableF == "2" || this.myTemplate.enableF == "1") {
        return true;
      }
      return false;
    },
    editModel() {
      return !this.vDisabled;
    },
    viewModel() {
      return this.vDisabled;
    },
    disFlag() {
      let path = this.$route.path;
      if (
        path === "/outMr/outMrWrt" ||
        path === "/inMr/inMrWrt/inMrWrtRecord"
      ) {
        return true;
      }

      return false;
    }
  },

  watch: {
    template(obj) {
      console.log("obj=======.", obj);
      this.getEdit();
      //复制
      if (Object.keys(obj).length > 0 && obj.kLibCd != "") {
        this.myTemplate = { ...obj };
        this.isFirst = false;
        if (this.disabledFlag) {
          this.swithHandler(
            this.roleRevereMap[this.myTemplate.scopeLevel],
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
        this.myTemplate.enableF = "0";
        if (this.myTemplate.kLibCd == "") {
          this.getCodeSeq();
        }
        this.ownerCd = [];
        this.isFirst = true;
        this.swithHandler(this.getCurrRoleCodeHandler(), this.dictListForCode);
      }

      this.changeOwner();
    },
    isShow() {
      this.dialogVisible = this.isShow;
    }
  },
  mixins: [commonMixins],
  data() {
    return {
      isFirst: false,
      loading: false,
      editorOpt: [],
      rules: {
        kLibCd: [{ required: true, message: "请输入编码", trigger: "blur" }],
        kLibNm: [
          { required: true, message: "请输入知识库名称", trigger: "blur" }
        ],
        kLibTpCd: [
          { required: true, message: "请输入知识库父类", trigger: "blur" }
        ],
        dnFlag: [
          { required: true, message: "请选择医护标识", trigger: "blur" }
        ],
        editor: [
          { required: true, message: "请选择所用的编辑器", trigger: "blur" }
        ],
        systemF: [
          { required: true, message: "请选择是否系统", trigger: "blur" }
        ],
        enableF: [
          { required: true, message: "请选择是否启用", trigger: "blur" }
        ],
        kLibContent: [
          { required: true, message: "请选择知识库内容", trigger: "blur" }
        ]
      },
      myTemplate: {
        kLibId: "",
        kLibCd: "",
        kLibNm: "",
        kLibContent: "",
        kLibTpCd: "",
        dnFlag: "",
        ownerCd: "0",
        ownerTp: "",
        pinyinCd: "",
        wubiCd: "",
        customCd: "",
        sortNo: "",
        dataVersion: "",
        comm: "",
        editor: "",
        enableF: "0",
        systemF: ""
      },
      ownNameOpt: [],
      ownNameOptCopy: [],
      ownerCd: [],
      typeRemoteParams: {},
      dialogVisible: this.isShow,
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
    //调用接口
    getEdit() {
      this.editorOpt = [
        {
          code: "00",
          name: "无编辑器",
          _id: "00"
        }
      ];
      this.loading = true;
      let url = "/wdata/dic/single/EditorType";
      get(url)
        .then(res => {
          if (res.code === 1) {
            for (let i = 0; i < res.data.length; i++) {
              this.editorOpt.push({
                code: res.data[i].code,
                name: res.data[i].name,
                _id: res.data[i].code
              });
            }
          } else {
            this.$message.error(res.msg || "获取数据失败");
            return;
          }
          this.loading = false;
        })
        .catch(error => {
          this.treeData = [];
          this.loading = false;
          console.log(error);
        });
    },

    // 生成编码
    getCodeSeq() {
      let data = {};
      knowledgeLibTpSeq(data)
        .then(res => {
          if (res.code === 1) {
            this.myTemplate.kLibCd = res.data;
          } else {
            this.$message.error(res.msg);
            return;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("自动生成编码失败");
        });
    },
    //对话框关闭
    dialogClose() {
      this.$emit("update:isShow", false);
    },

    //确定
    handleDetermine() {
      if (!this.myTemplate.kLibCd || this.myTemplate.kLibCd === "") {
        this.$message.error("编码不可为空！");
        return;
      }
      if (!this.myTemplate.kLibNm || this.myTemplate.kLibNm === "") {
        this.$message.error("名称不可为空！");
        return;
      }
      if (!this.myTemplate.kLibTpCd || this.myTemplate.kLibTpCd === "") {
        this.$message.error("知识库父类不可为空！");
        return;
      }
      if (!this.myTemplate.dnFlag || this.myTemplate.dnFlag === "") {
        this.$message.error("医护标识不可为空！");
        return;
      }
      if (!this.myTemplate.ownerTp || this.myTemplate.ownerTp === "") {
        this.$message.error("所属级别不可为空！");
        return;
      }
      if (!this.myTemplate.systemF || this.myTemplate.systemF === "") {
        this.$message.error("是否系统不可为空！");
        return;
      }
      if (!this.myTemplate.editor || this.myTemplate.editor === "") {
        this.$message.error("编辑器不可为空！");
        return;
      }
      if (!this.myTemplate.enableF || this.myTemplate.enableF === "") {
        this.$message.error("是否启用不可为空！");
        return;
      }
      if (!this.myTemplate.kLibContent || this.myTemplate.kLibContent === "") {
        this.$message.error("内容不可为空！");
        return;
      }

      let uId = this.myTemplate.kLibId;
      if (this.saveContent) {
        this.myTemplate.content = this.innerHtml;
      }
      let data = {
        ...this.myTemplate,
        ownerCd: this.myTemplate.ownerTp == "1" ? this.ownerCd.join(",") : ""
      };
      if (uId == "" || uId == null || uId == undefined) {
        save(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-save", res.data);
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
          });
      } else {
        update(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-update", this.myTemplate);
            } else if (res.code === 50101) {
              // 已经有新建的 code相同的新版本数据，是否覆盖
              this.$confirm(res.msg + ", 是否覆盖?", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  updateVersion(data)
                    .then(res => {
                      if (res.code == "1") {
                        this.$message({
                          type: "info",
                          message: "更新成功！"
                        });
                        this.$emit("handle-update", this.myTemplate);
                      } else {
                        this.$message({
                          type: "info",
                          message: "更新失败！" || res.msg
                        });
                      }
                    })
                    .catch(() => {
                      this.$message({
                        type: "info",
                        message: "已取消删除"
                      });
                    });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消删除"
                  });
                });
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
          });
      }
      this.dialogClose();
    },
    handleCancel() {
      this.dialogClose();
    },
    getDeptListRequest() {
      getDeptList().then(res => {
        const { code, data, msg } = res;
        if (code === 1) {
          this.ownNameOptCopy = data;
        } else {
          this.$message.error(msg || "请求数据失败");
          return;
        }
      });
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
    //根据所属级别变更所属名称可选项
    changeOwner(sLevel = "") {
      const orgMsg = JSON.parse(getPamars());
      const ownerTp = this.myTemplate.ownerTp;

      switch (ownerTp) {
        case "0":
          let hosId = orgMsg.hosId;
          let hosName = orgMsg.hosName;
          this.ownNameOpt = [{ id: hosId, orgNm: hosName }];
          this.ownerCd = this.ownNameOpt[0].id.split(",");
          break;
        case "1":
          this.ownNameOpt = this.ownNameOptCopy;
          if (!this.isFirst) {
            this.ownerCd = this.myTemplate.ownerCd
              .split(",")
              .map(item => Number(item));
          } else {
            this.ownerCd = [this.ownNameOpt[0].id];
          }
          break;
        case "2":
          this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
          // 去掉默认所属名称
          this.ownerCd = [getUId()];
          break;
        case "9":
          this.ownNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.ownerCd = [orgMsg.orgId];
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.edit-section {
  .form-control {
    position: relative;
    width: 100px;
  }

  .form-control:before {
    content: "*";
    color: #f56c6c;
    position: absolute;
    top: 2px;
    left: -6px;
  }
  .form-item {
    width: 278px;
  }
}
</style>
