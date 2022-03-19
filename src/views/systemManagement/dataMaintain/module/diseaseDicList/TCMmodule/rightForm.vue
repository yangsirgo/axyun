<template>
  <div class="position-relative height100">
    <l-card-title style="margin-left: 8px; padding: 8px 0">
      <span slot="left">中医症候</span>
    </l-card-title>
    <!--医嘱大类搜索项-->
    <div class="utils-cls">
      <el-form
        :model="utilsFilter"
        :rules="Rules"
        ref="ruleForm"
        label-width="0"
        class="big-ruleForm"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label=""
              prop="tcdCode"
              class="width50 fl"
            >
              <l-formt-title
                label="症候代码"
                :required="true"
              >
                <el-input
                  size="medium"
                  v-model="utilsFilter.tcdCode"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label=""
              prop="status"
            >
              <el-switch
                class="margin-left-10"
                style="vertical-align: 12px;"
                v-model="utilsFilter.status"
                active-text="激活"
                active-value="0"
                inactive-text="禁用"
                inactive-value="1"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item
              label=""
              prop="tcdName"
            >
              <l-formt-title
                label="症候名称"
                :required="true"
              >
                <el-input
                  size="medium"
                  v-model="utilsFilter.tcdName"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item
              label=""
              prop="syndromesSubclass"
            >
              <l-formt-title label="症候子类目">
                <!-- <el-select
                  v-model="utilsFilter.syndromesSubclass"
                  placeholder="请选择症候子类目"
                  style="width: 100%"
                >
                  <el-option
                    label="症候子类目1"
                    value="0"
                  >
                  </el-option>
                  <el-option
                    label="症候子类2"
                    value="1"
                  >
                  </el-option>
                  <el-option
                    label="症候子类目3"
                    value="2"
                  >
                  </el-option>
                </el-select> -->
                <l-value-domain
                  defaultFirst
                  clearable
                  code="SyndromeSubcategory"
                  :value.sync="utilsFilter.syndromesSubclass"
                  remoteValueKey="code"
                  placeholder="请选择症候子类目"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="position: absolute;right: 10px;bottom: 10px;">
      <el-button
        type="primary"
        :loading="saveBtnLoading"
        @click="save"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import { savePatTcmSyndrome } from "@/api/systemManagement/dataMaintain/diseaseDicList.js";

export default {
  name: "rightForm",
  props: ["currentRow"],
  components: {},
  data() {
    return {
      saveBtnLoading: false,
      utilsFilter: {
        status: "",
        tcdCode: "",
        tcdName: "",
        syndromesSubclass: ""
      },
      Rules: {
        tcdCode: [
          {
            required: true,
            message: "疾病编码不能为空",
            trigger: "blur"
          }
        ],
        tcdName: [
          {
            required: true,
            message: "疾病名称不能为空",
            trigger: "blur"
          }
        ]
      },
      editDataVersion: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    //表单的error 信息
    showErrorMsg(errorObj) {
      let self = this;
      for (let key in errorObj) {
        setTimeout(function() {
          if (document.getElementsByClassName("el-message").length === 0) {
            //message 弹窗一次错误
            self.$message.error(errorObj[key][0]);
          }
        }, 0);
      }
    },
    save() {
      this.saveBtnLoading = true;
      this.$refs["ruleForm"].validate(async (valid, error) => {
        if (valid) {
          try {
            let data = {
              ...this.utilsFilter,
              orgId: "66",
              ...{
                id: this.currentRow.id,
                dataVersion: this.currentRow.dataVersion
              }
            };
            // let ajaxData = {
            //   patTcmSyndromeVOList: data
            // };
            let result = await savePatTcmSyndrome(data);
            if (result.code === 1) {
              this.$message.success(result.msg || "保存成功");
              this.saveBtnLoading = false;
              this.resetForm();
              this.$emit("loadTable");
            } else {
              this.saveBtnLoading = false;
              this.$message.error(result.msg || "保存失败");
            }
          } catch (e) {
            this.saveBtnLoading = false;
            this.$message.error("保存失败");
          }
        } else {
          this.showErrorMsg(error);
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    }
  },
  watch: {
    currentRow: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          if (Object.keys(val).length > 0) {
            for (let key in this.utilsFilter) {
              this.utilsFilter[key] = val[key];
            }
          }
        });
      }
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.utils-cls {
  padding: 0 10px;
}
</style>
