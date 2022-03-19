<template>
  <div class="docInfoAdd">
    <div class="cont">
      <el-form :model="docInfoAddForm" :rules="rules" ref="docInfoAddForm">
        <l-card-title>
          <span slot="left">基本属性</span>
        </l-card-title>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="文书编码" disabled>
            <el-form-item prop="docCode">
              <el-input
                v-model="docInfoAddForm.docCode"
                style="line-height: 34px; width: 100%"
                placeholder="自动生成"
                disabled
              >
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="文书名称" required>
            <el-form-item prop="docName">
              <el-input
                v-model="docInfoAddForm.docName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="文书分类">
            <el-form-item prop="classCode">
              <el-select
                v-model="docInfoAddForm.classCode"
                style="line-height: 34px; width: 100%"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in classes"
                  :key="item.id"
                  :label="item.className"
                  :value="item.classCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="文书类型">
            <el-form-item prop="docType">
              <l-value-domain-emr
                code="CareDocType"
                :value.sync="docInfoAddForm.docType"
                placeholder="请选择"
              ></l-value-domain-emr>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="适用类型">
            <el-form-item prop="docUser">
              <l-value-domain-emr
                code="CareUserType"
                :value.sync="docInfoAddForm.docUser"
                placeholder="请选择"
              ></l-value-domain-emr>
            </el-form-item>
          </LFormtTitle>
        </el-row>
        <el-row style="margin-bottom: 10px">文书描述</el-row>
        <el-row class="margin-bottom-20">
          <el-form-item prop="docNote">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8 }"
              placeholder="请输入"
              v-model="docInfoAddForm.docNote"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <l-card-title>
          <span slot="left">附加属性</span>
        </l-card-title>
        <div class="table-cont">
          <el-table :data="tableData" width="100%" :stripe="true" border>
            <el-table-column
              v-for="(item, index) in tableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
            </el-table-column>
          </el-table>
        </div>
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
  import {saveOrUpdateDocInfo} from '@/api/emrRecord/nursingRecord/docInfoMaintain';

  export default {
    name: "docInfoAdd",
    data() {
      return {
        classes: [],
        docInfoAddForm: {},
        rules: {
          docName: [{required: true, message: '请输入文书名称', trigger: 'blur'}]
        },
        tableParams: [
          {
            prop: "name",
            label: "名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "120"
          },
          {
            prop: "value",
            label: "值",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }
        ],
        tableData: [
          {
            name: '允许跨病区修改',
            value: ''
          }
        ]
      }
    },
    props: ['form', 'treeData'],
    watch: {
      'form': {
        handler(n) {
          this.docInfoAddForm = {};
          this.docInfoAddForm = {...n};
        },
        deep: true,
        immediate: true
      },
      'treeData': {
        handler(n) {
          this.classes = [...n[0].children];
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      confirm() {
        this.$refs['docInfoAddForm'].validate(async (valid) => {
          if (valid) {
            this.$showLoading();
            try {
              let form = {
                ...this.docInfoAddForm
              };
              let data = await saveOrUpdateDocInfo(form);
              if (data.code == '1') {
                this.$emit('docInfoAddConfirm', false);
                this.$refs['docInfoAddForm'].resetFields();
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
        this.$emit('docInfoAddCancel', false);
        this.$refs['docInfoAddForm'].resetFields();
      }
    }
  }
</script>

<style scoped lang="scss">
.docInfoAdd {
  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  .cont {
    padding: 20px 34px 40px 34px;
  }

  .dialog-footer {
    padding: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
}
</style>
