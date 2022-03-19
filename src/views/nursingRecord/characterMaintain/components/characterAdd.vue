<template>
  <div class="characterAdd">
    <div class="cont">
      <el-form :model="characterAddForm" :rules="rules" ref="characterAddForm">
        <el-row class="margin-bottom-20">
          <LFormtTitle label="类型" disabled>
            <el-form-item prop="characterType">
              <l-value-domain
                code="CharacterType"
                :value.sync="characterAddForm.characterType"
                placeholder="请选择"
              />
              <!--<el-input v-model="characterAddForm.characterType"-->
              <!--style="line-height: 34px;width:100%"-->
              <!--&gt;-->
              <!--</el-input>-->
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="符号" required>
            <el-form-item prop="characterValue">
              <el-input
                v-model="characterAddForm.characterValue"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="排序">
            <el-form-item prop="sort">
              <el-input-number
                v-model="characterAddForm.sort"
                controls-position="right"
                :min="1"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              ></el-input-number>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row style="margin-bottom: 10px">描述</el-row>
        <el-row class="margin-bottom-20">
          <el-form-item prop="characterNote">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入"
              v-model="characterAddForm.characterNote"
            >
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer clearfix">
      <div class="float-right">
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {saveOrUpdateCharacter} from '@/api/emrRecord/nursingRecord/characterMaintain';
  export default {
    name: "characterAdd",
    data(){
        return{
          characterAddForm: {},
          rules: {
            characterValue: [{required: true, message: '请输入字符', trigger: 'blur'}]
          }
        }
    },
    props: ['form'],
    watch: {
      'form': {
        handler(n){
          this.characterAddForm = {};
          this.characterAddForm = {...n};
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      confirm() {
        this.$refs['characterAddForm'].validate(async (valid) => {
          if (valid) {
            this.$showLoading();
            try {
              let form = {
                ...this.characterAddForm
              };
              let data = await saveOrUpdateCharacter(form);
              if (data.code == '1') {
                this.$emit('characterAddConfirm', false);
                this.$refs['characterAddForm'].resetFields();
              } else {
                this.$message.error(data.msg || "保存失败");
              }
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
          }
        })
      },
      //取消
      cancel() {
        this.$emit('characterAddCancel', false);
        this.$refs['characterAddForm'].resetFields();
      }
    }
  }
</script>

<style scoped lang="scss">
.characterAdd {
  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  .cont {
    padding: 40px 90px;
  }

  .dialog-footer {
    padding: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
}
</style>
