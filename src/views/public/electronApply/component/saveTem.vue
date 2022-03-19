<template>
  <div class="save-template-box">
    <l-card-title>
      <div slot="left">保存模板</div>
    </l-card-title>
    <el-form
      :model="modeldata"
      :rules="rules"
      ref="ruleForm"
      label-width="0"
      class="demo-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item>
            <l-formt-title label="名称" :required="true">
              <el-input
                v-model="modeldata.modelname"
                placeholder="请输入内容"
              ></el-input>
            </l-formt-title>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <div class="overflow-point">
              <span class="allergy-form-title">已选</span>
              <span>粪便检测，血常规，疟原虫</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <l-formt-title label="备注" :required="true">
            <el-input
              v-model="modeldata.modelbz"
              placeholder="请输入内容"
              maxlength="100"
              show-word-limit
            ></el-input>
          </l-formt-title>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="allergy-form-btn">
      <el-button type="primary" @click="conserve">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "eleSaveTem",
  data() {
    return {
      // 保存模板 表单数据
      modeldata: {
        modelname: "",
        modelbz: ""
      },
      // 保存模板 校验规则
      rules: {}
    };
  },
  methods: {
    async conserve() {
      let templateData = {};
      templateData["templateName"] = this.modeldata.modelname;
      templateData["remark"] = this.modeldata.modelbz;
      templateData["templateType"] = this.templateType;
      templateData["groupList"] = [];
      let paramData = {};
      this.checkedList.forEach(function(item) {
        if (typeof paramData["m" + item.id] == "undefined") {
          paramData["m" + item.id] = {};
          paramData["m" + item.id]["groupId"] = item.id;
          paramData["m" + item.id]["chargePackageDlist"] = [
            {
              Id: item.yzid,
              itemType: 2
            }
          ];
        } else {
          paramData["m" + item.id]["chargePackageDlist"].push({
            Id: item.yzid,
            itemType: 2
          });
        }
      });

      let submitData = [];
      for (var key in paramData) {
        let packageItemName = paramData[key]["packageItemName"];

        submitData.push(paramData[key]);
      }
      templateData["groupList"] = submitData;
      try {
        let result = await saveTemplate(templateData);
        if (result.code == 1) {
          this.$message.success("模板保存成功");
          this.modelVisible = false;
          this.Forgroups();
        } else {
          this.$message.error(result.msg || "模板保存失败");
        }
      } catch (err) {
        this.$message.error(err.msg || "模板保存失败");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.save-template-box {
  position: relative;
  padding-right: 10px;
  .allergy-form-col {
    .allergy-form-item {
      float: left;
      width: 49%;

      .el-form-item {
        margin-bottom: 18px;
      }
      /deep/ .el-form-item--medium .el-form-item__content {
        height: 36px;
      }
      &:first-child {
        margin-right: 2%;
      }

      &.long {
        width: 100%;
        margin-right: 0;
      }
      .allergy-form-title {
        display: inline-block;
        margin-right: 10px;
        color: $l-color-fontcolor-4;
      }
    }
  }
  .allergy-form-btn {
    width: 100%;
    text-align: right;
  }
}
</style>
