<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="dialogClose"
    width="500px"
  >
    <div style="margin: 15px 40px">
      <el-row style="margin-top: 12px">
        <el-col :span="5">
          <span class="form-control">敏感词编码</span>
        </el-col>
        <el-col :span="19">
          <el-input v-model="myTemplate.sensitiveWordCode" disabled></el-input>
        </el-col>
      </el-row>
      <el-row v-if="showAge" style="margin-top: 12px">
        <el-col :span="5">
          <span>年龄范围</span>
        </el-col>
        <el-col :span="19">
          <el-select
            style="width: 180px"
            v-model="myTemplate.sensitiveTypeEx"
            placeholder="请选择"
            :disabled="vDisabled"
          >
            <el-option
              v-for="item in ageCharOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            @change="checkNumber(myTemplate.ageParam1)"
            v-model.number="myTemplate.ageParam1"
            :style="{
              width: myTemplate.sensitiveTypeEx < 6 ? 70 + 'px' : 70 + 'px',
            }"
            :disabled="vDisabled"
          ></el-input>
          <el-input
            v-if="myTemplate.sensitiveTypeEx > 5"
            v-model.number="myTemplate.ageParam2"
            @change="checkNumber(myTemplate.ageParam2)"
            style="width: 70px"
            :disabled="vDisabled"
          ></el-input>
        </el-col>
      </el-row>
      <el-row v-if="showAge" style="margin-top: 12px">
        <el-col :span="5">
          <span>年龄单位</span>
        </el-col>
        <el-col :span="19">
          <l-value-domain-emr
            :disabled="vDisabled"
            code="AgeUnit"
            :value.sync="myTemplate.ageUnit"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="5">
          <span class="form-control">提示类型</span>
        </el-col>
        <el-col :span="19">
          <l-value-domain-emr
            :disabled="vDisabled"
            code="promptLevel"
            :value.sync="myTemplate.prompt"
          >
          </l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px; height: 50px">
        <el-col :span="5">
          <span>敏感词</span>
        </el-col>
        <el-col :span="19">
          <el-input
            type="textarea"
            :disabled="vDisabled"
            v-model="myTemplate.sensitiveWord"
          />
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

import {
  getParagraphTypeOpt,
  getTypeByCode,
  getIcd10DictionaryByKey
} from "@/api/emrRecord/emr/paragraphType";
import { getOrgDeptList } from "@/api/emrRecord/admin/user";

import { insert, update, getCd } from "@/api/emrRecord/emr/sensitiveWord";
export default {
  props: {
    template: Object,
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    vDisabled() {
      if (this.myTemplate.enabled == "1") {
        return true;
      }
      return false;
    }
  },
  watch: {
    template(obj) {
      console.log("obj========", obj);
      this.showAge = false;
      this.myTemplate = { ...obj };
      this.title = "敏感词维护";
      if (obj.sensitiveType == "2") {
        this.showAge = true;
        this.title = "年龄的敏感词";
      }
      if (obj.sensitiveWordCode === "") {
        getCd()
          .then(res => {
            this.myTemplate.sensitiveWordCode = res.data;
          })
          .catch(res => {
            this.$message({
              type: "error",
              message: res.msg
            });
          });
      }
    },

    isShow() {
      this.dialogVisible = this.isShow;
    }
  },
  data() {
    return {
      title: "",
      showAge: false,
      loading: false,
      myTemplate: {
        ageParam1: 0,
        ageParam2: 0,
        ageUnit: "3",
        customCode: "",
        description: "",
        enabled: "0",
        prompt: "",
        sensitiveType: "",
        sensitiveTypeEx: "1",
        sensitiveTypeEx2: "",
        sensitiveWord: "",
        sensitiveWordCode: "",
        sensitiveWordId: "",
        dataVersion: "0",
        pinyinCode: "",
        wubiCode: "",
        hosCode: "",
        hosId: "",
        orgCode: "",
        orgId: "",
        sortNo: 0
      },
      dialogVisible: this.isShow,
      units: [
        { value: "1", label: "天" },
        { value: "2", label: "月" },
        { value: "3", label: "岁" }
      ],
      ageCharOpt: [
        { value: "1", label: "小于#1" },
        { value: "2", label: "小于等于#1" },
        { value: "3", label: "等于#1" },
        { value: "4", label: "大于#1" },
        { value: "5", label: "大于等于#1" },
        { value: "6", label: "大于#1并且小于#2" },
        { value: "7", label: "大于等于#1并且小于#2" },
        { value: "8", label: "大于#1并且小于等于#2" },
        { value: "9", label: "大于等于#1并且小于等于#2" }
      ]
      // rules:{
      //   sensitiveWordCode:[
      //     {required: true, message: '请输入编码', trigger: 'blur'}
      //   ],
      //   prompt:[
      //     {required: true, message: '请选择提示类型', trigger: 'blur'}
      //   ],
      //   sensitiveWord:[
      //     {required: true, message: '请输入敏感词', trigger: 'blur'}
      //   ],
      //   ageParam1:[
      //     {required: true, message: '请输入年龄', trigger: 'blur'}
      //   ],
      //   ageParam2:[
      //     {required: true, message: '请输入年龄', trigger: 'blur'}
      //   ]
      // }
    };
  },
  methods: {
    checkNumber(value) {
      console.log("checkNumber======", value);

      if (!Number.isInteger(value)) {
        this.$message.error("请输入数字值");
        return false;
      }
      if (value >= 200 || value < 0) {
        this.$message.error("年龄必须大于0小于200");
        return false;
      }
      return true;
    },
    // submitForm() {
    //   this.$refs.ruleForm.validate((valid) => {
    //     if (valid) {
    //       this.handleDetermine()
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
    //   });
    // },
    //对话框关闭
    dialogClose() {
      // this.$refs.ruleForm.clearValidate();
      this.$emit("update:isShow", false);
    },
    //确定
    submitForm() {
      if (
        !this.myTemplate.sensitiveWordCode ||
        this.myTemplate.sensitiveWordCode == ""
      ) {
        this.$message.error("敏感词不可为空！");
        return;
      }

      if (!this.myTemplate.prompt || this.myTemplate.prompt == "") {
        this.$message.error("提示类型不可为空！");
        return;
      }
      if (
        !this.myTemplate.sensitiveWord ||
        this.myTemplate.sensitiveWord == ""
      ) {
        this.$message.error("敏感词不可为空！");
        return;
      }
      let pattern = /^\d+$/g;

      if (
        this.myTemplate.sensitiveWord &&
        this.myTemplate.sensitiveWord.match(pattern)
      ) {
        this.$message.error("敏感词不可为纯数字！");
        return;
      }

      let uId = this.myTemplate.sensitiveWordId;

      if (this.myTemplate.sensitiveWordId == null) {
        this.myTemplate.sensitiveWordId = "";
      }
      if (this.myTemplate.enabled == null || this.myTemplate.enabled == "") {
        this.myTemplate.enabled = "0";
      }

      if (this.myTemplate.sensitiveType == "2") {
        if (
          this.myTemplate.ageParam2 &&
          this.myTemplate.ageParam2 !== 0 &&
          this.myTemplate.ageParam2 !== "0"
        ) {
          if (!this.checkNumber(this.myTemplate.ageParam2)) {
            return;
          }
        }
        if (
          this.myTemplate.ageParam1 &&
          this.myTemplate.ageParam1 !== 0 &&
          this.myTemplate.ageParam1 !== "0"
        ) {
          if (!this.checkNumber(this.myTemplate.ageParam1)) {
            return;
          }
        }
        // this.setAge()
      }
      let data = { ...this.myTemplate };

      if (uId == "" || uId == null || uId == undefined) {
        insert(data)
          .then(res => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-save", res.data);
              this.dialogClose();
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
              this.dialogClose();
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
    },
    handleCancel() {
      this.dialogClose();
    }
  }
};
</script>

<style type="scss" scoped>
.el-input--suffix .el-input__inner {
  padding-right: 10px;
  padding-left: 10px;
}
.myFormItem {
  width: 298px;
  display: inline-block;
}
.myFormItem_small {
  display: inline-block;
  width: 70px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
/deep/.el-form-item__content {
  margin-left: 0px !important;
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
</style>
