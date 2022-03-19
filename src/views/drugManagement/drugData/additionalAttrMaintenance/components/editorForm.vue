<template>
  <div class="drugForm width100 height100">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom: 1px solid #e4e4e4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">属性信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <el-form
        class="tabs width100"
        ref="drugForm"
        :model="drugFormDeail"
        :rules="rules"
      >
        <!-- <el-row style="margin-top: 4px">
          <el-col :span="24">
            <l-formt-title label="所属科室" labelWidth="76" :required="true">
              <el-form-item label label-width prop="deptId">
                <l-value-domain
                  :value.sync="drugFormDeail.deptId"
                  remoteUrl="/wadmin/hos/dept"
                  remoteValueKey="id"
                  remoteShowKey="orgNm"
                  placeholder="请选择"
                ></l-value-domain>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row> -->

        <el-row style="margin-top: 4px">
          <el-col :span="24">
            <l-formt-title label="属性编码" labelWidth="76" :disabled="true">
              <el-input
                v-model="drugFormDeail.attributeCode"
                placeholder="请输入"
                style="line-height: 34px"
              ></el-input>
            </l-formt-title>
          </el-col>
        </el-row>

        <el-row style="margin-top: 4px">
          <el-col :span="24">
            <l-formt-title label="属性名称" labelWidth="76">
              <el-input
                v-model="drugFormDeail.attributeName"
                placeholder="请输入"
                style="line-height: 34px"
              ></el-input>
            </l-formt-title>
          </el-col>
        </el-row>

        <el-row style="margin-top: 4px">
          <el-col :span="24">
            <l-formt-title label="属性值" labelWidth="76">
              <el-input
                v-model="drugFormDeail.attributeValue"
                placeholder="请输入"
                style="line-height: 34px"
              ></el-input>
            </l-formt-title>
          </el-col>
        </el-row>

        <el-row style="margin-top: 4px">
          <l-formt-title label="属性值名称" labelWidth="76">
            <el-input
              v-model="drugFormDeail.attributeValueName"
              placeholder="请输入"
              style="line-height: 34px"
            ></el-input>
          </l-formt-title>
        </el-row>
      </el-form>

      <div class="button-cont">
        <el-button class="confirm-button" @click="confirm">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import base from "@/api/hmm/base";

export default {
  props: ["editorForm"],
  data() {
    return {
      drugFormDeail: {
        attributeCode: "",
        isnew: false
      },
      rules: {
        deptId: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  watch: {
    editorForm() {
      this.$refs.drugForm.resetFields();

      this.drugFormDeail = { ...this.editorForm };
      this.drugFormDeail.deptId =
        typeof this.drugFormDeail.deptId === "undefined"
          ? ""
          : Number(this.drugFormDeail.deptId);
    }
  },
  methods: {
    //修改某一条药品数据
    confirm() {
      this.$refs.drugForm.validate(valid => {
        if (valid) {
          let data = {};
          // 新增数据的处理
          if (!this.drugFormDeail.id) {
            data = {
              dataVersion: 0,
              id: ""
            };
          }
          let params = {
            ...this.drugFormDeail,
            ...data
          };

          this.$showLoading();
          base
            .addOrModifyAttribute(params)
            .then(res => {
              if (res.code == 1) {
                this.$emit("getRefreshList", this.drugFormDeail);
                this.$message.success("保存成功");
              } else {
                this.$message.error(res.msg || "保存失败");
              }
            })
            .catch(err => {
              this.$message.error(err.msg || "保存失败");
            })
            .finally(() => {
              this.$hideLoading();
            });
        }
      });
    },

    //新增
    newadd() {
      this.$refs.drugForm.resetFields();
      this.$nextTick(() => {
        this.drugFormDeail = {
          isnew: true,
          id: "",
          attributeCode: "",
          attributeName: "",
          attributeValue: "",
          attributeValueName: "",
          dataVersion: ""
        };
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;
    .cardTitleStyle {
      padding: 8px 0px;
    }
    .el-form-item {
      margin-bottom: 0;
    }

    .tabs {
      height: calc(100% - 150px);
      overflow-y: hidden;
    }

    .button-cont {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;

      .confirm-button {
        width: 80px;
        height: 36px;
        padding: 0;
        text-align: center;
        line-height: 36px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;

        font-weight: 400;
        color: $l-color-white;
        float: right;
      }
    }
  }
}
</style>
