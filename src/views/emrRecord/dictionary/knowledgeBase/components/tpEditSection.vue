<template>
  <el-dialog
    title="知识库分类维护"
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="dialogClose"
    width="850px"
  >
    <div class="edit-section" style="margin: 20px 40px">
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span class="form-control" style="width: 100px">分类编码</span>
          <el-input
            v-model="myTemplate.kLibTpCd"
            maxlength="50"
            placeholder="字数最多不超过50字！"
            :disabled="true"
            class="form-item"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span class="form-control">分类名称</span>
          <el-input
            maxlength="100"
            placeholder="字数最多不超过100字！"
            v-model="myTemplate.kLibTpNm"
            :disabled="vDisabled"
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span class="form-control">上级分类</span>
          <el-select
            v-model="myTemplate.parentKLibTpCd"
            clearable
            :disabled="vDisabled"
            placeholder="请选择"
            class="form-item"
          >
            <el-option
              v-for="item in upData"
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
            :disabled="vDisabled"
            class="form-item"
            code="EmployeeMark"
            :value.sync="myTemplate.dnFlag"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span>所属级别</span>
          <l-value-domain-emr
            ref="scopeLevel"
            clearable
            :disabled="vDisabled"
            class="form-item"
            code="LevelType"
            :value.sync="myTemplate.ownerTp"
            placeholder="请选择"
            @change="changeOwner"
          ></l-value-domain-emr>
        </el-col>
        <el-col :span="12">
          <span>所属名称</span>
          <el-select
            v-model="myTemplate.ownerCd"
            multiple
            clearable
            value-key="id"
            :disabled="vDisabled"
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
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span>是否系统</span>
          <el-radio-group v-model="myTemplate.systemF" style="margin-top: 8px">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 1em">拼音码</span>
          <el-input
            v-model="myTemplate.pinyinCd"
            :disabled="true"
            readonly
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span style="margin-left: 1em">五笔码</span>
          <el-input
            v-model="myTemplate.wubiCd"
            :disabled="true"
            readonly
            class="form-item"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <span style="margin-left: 1em">助记码</span>
          <el-input
            v-model="myTemplate.customCd"
            :disabled="vDisabled"
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span style="margin-left: 1em">顺序码</span>
          <el-input
            v-model="myTemplate.sortNo"
            :disabled="vDisabled"
            class="form-item"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="position: relative; height: 50px; margin-top: 10px">
        <el-col :span="24">
          <span style="margin-left: 2em">描述</span>
          <el-input
            type="textarea"
            :disabled="vDisabled"
            style="width: 680px; top: 0; position: absolute"
            v-model="myTemplate.comm"
          />
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDetermine">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getUId, getUN } from "@/utils/crypto";
import { getPamars } from "@/utils/auth";

import { save, update } from "@/api/emrRecord/emr/knowledge";

import { getDeptList } from "@/api/admin/role";

import {
  getParagraphTypeOpt,
  getTypeByCode,
  getIcd10DictionaryByKey
} from "@/api/emrRecord/emr/paragraphType";
import { getOrgDeptList } from "@/api/emrRecord/admin/user";

import {
  knowledgeLibTpSeq,
  knowledgeLibTpInsert,
  getKnowledgeLibTp,
  updateKnowledgeLibTp
} from "@/api/emrRecord/emr/knowledge";

export default {
  props: {
    template: Object,
    mode: {
      type: String,
      default: "add"
    },
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
    }
  },
  computed: {
    vDisabled() {
      return false;
    }
  },
  watch: {
    template: {
      handler(obj, oldVal) {
        if (Object.keys(obj).length > 0) {
          console.log("obj: ", obj);
          console.log("oldVal: ", oldVal);
          console.log("obl====", obj.id);
          console.log("this.mode====", this.mode);
          //复制
          if (this.mode === "modify") {
            this.getKnowledgeLibTp(obj.id);
          } else {
            this.resetTemplate();
            console.log("this.myTemplate====", this.myTemplate);

            if (obj.id) {
              this.myTemplate.parentKLibTpCd = obj.id;
            }
            this.initUncodeHandle();
          }
        }
      },
      deep: true //true 深度监听
    },
    isShow() {
      this.dialogVisible = this.isShow;
    }
  },
  inject: {
    upData: {
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      loading: false,
      myTemplate: {
        kLibTpCd: "",
        kLibTpNm: "",
        parentKLibTpCd: "",
        dnFlag: "",
        ownerTp: "",
        ownerCd: "",
        systemF: "1",
        pinyinCd: "",
        wubiCd: "",
        customCd: "",
        sortNo: "",
        comm: ""
      },

      ownNameOpt: [],
      ownNameOptCopy: [],
      diseaseOpt: [],
      dialogVisible: this.isShow,
      orgOptions: [],
      dictListForCode: []
    };
  },
  created() {
    this.getDeptListRequest();
  },
  methods: {
    resetTemplate() {
      for (let key in this.myTemplate) {
        this.myTemplate[key] = "";
      }
      this.myTemplate.systemF = "1";
    },
    // 获取具体tree 数据
    getKnowledgeLibTp(id) {
      getKnowledgeLibTp(id, true)
        .then(res => {
          if (res.code === 1) {
            this.myTemplate = res.data;
            this.handleData();
            if (this.myTemplate.ownerCd && this.myTemplate.ownerTp !== "1") {
              this.myTemplate.ownerCd = parseInt(this.myTemplate.ownerCd);
            }
            this.changeOwner();
          } else {
            this.$message.error(res.msg);
            return;
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error);
        });
    },
    // 生成编码
    initUncodeHandle() {
      console.log("initUncodeHandle==========", this.myTemplate.kLibTpCd);
      // 当创建了编码 则不去请求
      if (this.myTemplate.kLibTpCd != "") {
        return;
      }
      let data = {};
      knowledgeLibTpSeq(data)
        .then(res => {
          if (res.code === 1) {
            this.myTemplate.kLibTpCd = res.data;
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
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then(resData => {
        if (resData.code === 1 && resData.data) {
          this.diseaseOpt = resData.data;
        } else {
          this.$message.error(res.msg);
          return;
        }
      });
    },
    //对话框关闭
    dialogClose() {
      this.$emit("update:isShow", false);
    },
    handleData(flag = false) {
      if (flag) {
        if (this.myTemplate.ownerTp === "1") {
          this.myTemplate.ownerCd = this.myTemplate.ownerCd.join(",");
        }
      } else {
        if (this.myTemplate.ownerTp === "1") {
          this.myTemplate.ownerCd = this.myTemplate.ownerCd
            .split(",")
            .map(it => {
              return it - 0;
            });
        }
      }
      console.log(this.myTemplate, "this.myTemplate");

      return this.myTemplate;
    },
    //提交
    handleDetermine() {
      //
      if (this.myTemplate.kLibTpCd === "" || !this.myTemplate.kLibTpCd) {
        this.$message.error("分类编码不可为空！");
        return;
      }
      if (this.myTemplate.kLibTpNm === "" || !this.myTemplate.kLibTpNm) {
        this.$message.error("分类名称不可为空！");
        return;
      }
      if (
        this.myTemplate.parentKLibTpCd === "" ||
        !this.myTemplate.parentKLibTpCd
      ) {
        this.$message.error("上级分类不可为空！");
        return;
      }
      if (this.myTemplate.dnFlag === "" || !this.myTemplate.dnFlag) {
        this.$message.error("医护类别不可为空！");
        return;
      }
      if (this.myTemplate.ownerTp === "" || !this.myTemplate.ownerTp) {
        this.$message.error("所属类型不可为空！");
        return;
      }
      if (this.myTemplate.systemF === "" || !this.myTemplate.systemF) {
        this.$message.error("是否系统不可为空！");
        return;
      }
      // console.log("handleDetermine=============")
      let data = this.handleData(true);
      if (this.mode === "add") {
        knowledgeLibTpInsert(data, true)
          .then(res => {
            if (res.code === 1) {
              let obj = res.data;
              this.$emit("handleSave", obj);
              this.dialogClose();
            } else {
              this.$message.error(res.msg || "新建知识库失败");
              return;
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error(error || "新建知识库失败");
          });
      } else {
        updateKnowledgeLibTp(data)
          .then(res => {
            console.log("handleDetermine====2=========", res);

            if (res.code === 1) {
              let obj = res.data;
              this.$message.success("修改成功");
              this.$emit("handleSave", obj);
              this.dialogClose();
            } else {
              this.$message.error(res.msg);
              return;
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error(error);
          });
      }
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
    //根据所属级别变更所属名称可选项
    changeOwner(sLevel) {
      const orgMsg = JSON.parse(getPamars());
      const ownerTp = this.myTemplate.ownerTp;

      switch (ownerTp) {
        case "0":
          let hosId = orgMsg.hosId;
          let hosName = orgMsg.hosName;
          this.ownNameOpt = [{ id: hosId, orgNm: hosName }];
          this.myTemplate.ownerCd = [this.ownNameOpt[0].id];
          break;
        case "1":
          // 科室情况
          this.ownNameOpt = this.ownNameOptCopy;
          if (this.mode === "add") {
            this.myTemplate.ownerCd = [this.ownNameOpt[0].id];
          }
          break;
        case "2":
          this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
          this.myTemplate.ownerCd = [getUId()];
          break;
        case "9":
          this.ownNameOpt = [{ id: orgMsg.orgId, orgNm: orgMsg.orgName }];
          this.myTemplate.ownerCd = [orgMsg.orgId];
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.form-item {
  width: 248px;
}

.form-control {
  position: relative;
  width: 100px;
}

.form-control:before {
  content: "";
  color: #f56c6c;
  position: absolute;
  top: 2px;
  left: -6px;
}
</style>
