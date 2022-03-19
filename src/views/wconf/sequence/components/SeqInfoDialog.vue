<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="closeDialog"
    :title="title"
    width="500px">
    <el-form
      ref="formSeq"
      :rules="rules"
      :model="form"
      label-width="80px"
      class="seq-form">
      <el-form-item
        v-for="(item, index) in formParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        class="seq-form-item">
        <el-input placeholder="请输入" v-model="form[item.prop]" :maxlength="item.maxlength"></el-input>
      </el-form-item>
       <el-form-item
       label="类型"
        class="seq-form-item">
         <el-select v-model="form.dType" placeholder="请选择">
          <el-option
            v-for="item in dtypeData"
            :key="item.val"
            :label="item.label"
            :value="item.val"
          >
          </el-option>
         </el-select>
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm">确 认</el-button>
      <el-button type="primary" @click="dialogVisible = false" plain>取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    seqData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dtypeData:{
      type: Array,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: this.isShow,
      form: {},
      formParams: [
        {
          label: '描述',
          prop: 'bName',
          maxlength: 100
        },
        {
          label: '流水号名',
          prop: 'seqName',
          maxlength: 100
        },
        {
          label: '初始值',
          prop: 'initVal'
        },

        {
          label: '格式',
          prop: 'bFormat',
          maxlength: 200
        }
      ],
      rules: {
        bName: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
        seqName: [
          { required: true, message: '请输入流水号名', trigger: 'blur' },
        ],
        initVal: [
          { required: true, message: '请输入初始值', trigger: 'blur' },
          { pattern: /^[0-9]\d*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        bFormat: [
          { required: true, message: '请输入格式', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleConfirm() {
      console.log(this.form)
      this.$refs.formSeq.validate((valid) => {
        if (!valid) return;
        this.$emit('submit', this.form)
      })
    },
    closeDialog() {
      this.clearValidate()
      this.$emit('update:isShow', false)
    },
    clearValidate() {
      this.$refs.formSeq.clearValidate()
    }
  },
  watch: {
    isShow() {
      this.dialogVisible = this.isShow
    },
    seqData(newVal, oldVal) {
      this.form = { ...newVal }
    }
  }
};
</script>

<style lang="scss" scoped>
.seq-form {
  padding: 30px 85px 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e4e4e4;
}
.seq-form-item {
  margin-bottom: 20px;
}
.seq-form-item /deep/ .el-form-item__content {
  height: 36px;
}
/deep/.el-input{
  width: 250px;
}
</style>
