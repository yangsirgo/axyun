<template>
  <div class="contain">
    <div class="dialog-header">
      <el-form :model="accountRechargeForm" :rules="rules" ref="formElem">
        <div class="detail">

          <div class="inputs clearFix">
            <el-col :span="12">
              <el-form-item label="诊断类型" label-width="80px" prop="diagType">
                <el-select v-model="accountRechargeForm.diagType" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="中/西医" label-width="80px" prop="cwFlag">
                <el-select v-model="accountRechargeForm.cwFlag" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="诊断描述" label-width="80px" prop="diagIcd">
                <el-select v-model="accountRechargeForm.diagIcd" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主诊断" label-width="80px" prop="diagMain">
                <el-select v-model="accountRechargeForm.diagMain" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初复诊" label-width="80px" prop="isFirst">
                <el-select v-model="accountRechargeForm.isFirst" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发病日期" prop="startTime">
                <el-date-picker
                  v-model="accountRechargeForm.startTime"
                  type="datetime"
                  format="yyyy-MM-dd hh:mm"
                  value-format="yyyy-MM-dd hh:mm"
                  placeholder="选择发病日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </div>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer clearFix" slot="footer">
      <div style="float:right">
        <el-button type="primary" @click="confirm">确认登记</el-button>
        <el-button @click="cancel">关闭</el-button>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    name: "diagnosisEdit",
    props: ['asd'],
    data() {
      return {
        options1: [{
          value: '0',
          label: '家床'
        }, {
          value: '1',
          label: '门诊'
        }],
        options2: [{
          value: '0',
          label: '中医'
        }, {
          value: '1',
          label: '西医'
        }],
        options3: [{
          value: '0',
          label: '主诊断'
        }, {
          value: '1',
          label: '次诊断'
        }],
        options4: [{
          value: '0',
          label: '初诊'
        }, {
          value: '1',
          label: '复诊'
        }],
        options5: [{
          value: '0',
          label: '未定'
        }],
        accountRechargeForm: {
          diagType: '',
          cwFlag: '',
          diagIcd: '',
          diagMain: '',
          isFirst: '',
          startTime: '',
          elementId: '',
          id: ''
        },
        rules: {
          diagType: [
            {required: true, message: "请选择诊断类型", trigger: "change"}
          ],
          cwFlag: [
            {required: true, message: "请选择中/西医", trigger: "change"}
          ],
          diagIcd: [
            {required: true, message: "请选择诊断描述", trigger: "change"}
          ],
          diagMain: [
            {required: true, message: "请选择主诊断", trigger: "change"}
          ],
          isFirst: [
            {required: true, message: "请选择初复诊", trigger: "change"}
          ],
          startTime: [
            {required: true, message: "请选择发病日期", trigger: "change"}
          ]
        },
        radio: '1'
      }
    },

    methods: {
      confirm() {
        this.$refs["formElem"].validate( async (valid) => {
          console.log(this.accountRechargeForm);
          this.accountRechargeForm.patientCode = 5;
          if (valid) {
            let res = await addDiag(this.accountRechargeForm);
            this.$refs["formElem"].resetFields();
            this.$emit('rechargeConfirm', false);

          }
          else {
            this.$message.error(error.msg || "标准错误提示");
          }
        });
      },
      rest(){
        self.$refs["formElem"].resetFields();
      },
      cancel() {
        this.$emit('rechargeCancel');
        this.$refs["formElem"].resetFields();
      }
    }
  }
</script>

<style scoped lang="scss">
  .clearFix:after {
    content: "";
    display: block;
    clear: both;
  }

  .contain {
    width: 100%;
  }

  .dialog-header {
    width: 100%;
    margin-bottom: 30px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }

  .detail {
    margin-top: 20px;
    margin-bottom: 18px;
  }

  .dialog-footer {
    height: 36px;
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }


</style>
