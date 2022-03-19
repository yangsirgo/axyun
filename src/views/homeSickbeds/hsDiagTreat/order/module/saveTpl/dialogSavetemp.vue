<template>
  <div class="width100 height100">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="共享等级"
        prop="shareLevel"
      >
        <el-radio-group
          v-model="ruleForm.shareLevel"
          @change="resourceFun"
        >
          <el-radio label="2">个人</el-radio>
          <el-radio label="1">科室</el-radio>
          <el-radio label="0">全院</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="" prop="templetRange">
        <l-formt-title label="使用范围">
          <l-value-domain
            code="AntimicrobialRanges"
            multiple
            :value.sync="ruleForm.templetRange"
            placeholder="请选择使用范围"
            @change="recordTypeChange"
          ></l-value-domain>
        </l-formt-title>
      </el-form-item> -->
      <el-form-item
        label="模板名称"
        prop="templateName"
      >
        <el-input
          style="width: 188px;"
          maxlength="30"
          v-model="ruleForm.templateName"
        ></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters } from "vuex";
import { saveTotemplate } from "@/api/homeSickbeds/hsPatientManagement/hsPatientManagement";
export default {
  props:{
    saveTplSuccesBack: Function,
    recipeId:  {
      type: String
    }, 
    saveType: {
      type: String,
      default (){
        return "west"
      }
    }, 
    multipleSelection: {
      type: Array,
      default (){
        return []
      }
    }
  },
  data() {
    return {
      ruleForm: {
        shareLevel: "2",
        // templetRange: [],
        templateName: "",
        deptId: ""
      },
      options: [
        {
          value: "0",
          label: "门诊"
        },
        {
          value: "1",
          label: "急诊"
        },
        {
          value: "2",
          label: "住院"
        },
        {
          value: "3",
          label: "全院"
        }
      ],
      rules: {
        shareLevel: [
          {
            required: true,
            message: "请选择共享级别",
            trigger: "change"
          }
        ],
        // templetRange: [{
        //   required: true,
        //   message: '请选择适用范围',
        //   trigger: 'change'
        // }],
        templateName: [
          {
            required: true,
            message: "请填写模板名称",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {},
  components: {},
  computed: {
    ...mapGetters("adviceCommon", ["westPharmacyObject"])
  },
  watch: {
    pharmacyObject: {
      deep: true,
      immediate: true,
      handler() {
        console.log(this.westPharmacyObject);
      }
    }
  },
  components: {},
  methods: {
    recordTypeChange() {},
    resourceFun() {
      console.log(this.ruleForm.resource);
    },
    checkFun() {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    // eslint-disable-next-line complexity
    async saveTpl() {
      try {
        let dataObj = await this.checkFun();
      } catch (error) {
        return;
      }

      let adviceIds = [];
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条医嘱？？");
        return false;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        adviceIds.push(this.multipleSelection[i].id);
      }
      // dataObj.adviceIds = adviceIds;
      // console.log(dataObj, "multipleSelection");
      let ajaxData = {
        ...this.ruleForm,
        ...{
          adviceIds
          // recipeId: this.recipeId
        }
      }

      switch (this.saveType) {
        case "chm":
          ajaxData.templetType = "9998"
          ajaxData.recipeId = this.recipeId;
          break;
        default:
          break;
      }
      try {
        let res = await saveTotemplate(ajaxData);
        // console.log(res, "打印返回数据");
        if (res.code == "1") {
          this.$message.success(res.msg || "保存成功");
          this.saveTplSuccesBack && this.saveTplSuccesBack();
        }
        this.saveTempStyle = false;
      } catch (error) {
        this.$message.error(error.msg || "保存失败");
        this.saveTempStyle = false;
      }
      
      // this.saveTempStyle = false;
    }
  }
};
</script>
<style>
</style>
