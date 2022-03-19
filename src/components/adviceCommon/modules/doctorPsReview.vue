<template>
  <div class="page">
      <el-dialog
        :visible.sync="visible"
        :show="show"
        title="医生审核"
        width="30%"
        center>
        <span>{{ alertText }}</span>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="isOk">是（审批通过）</el-button>
            <el-button type="primary" @click="isNo">否（自费使用）</el-button>
            <el-button @click="OnClose">取 消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    show: { 
        type: Boolean, 
        default: false 
    },
    alertText: {
        type: String, 
        default: "" 
    }
  },
  data() {
    return {
      visible: this.show
    }
  },
  components: {

  },
  watch: {
    show: {
      immediate: true,
      handler(show) {
        this.visible = this.show
      }
    }
  },
  methods: {
    OnClose() {
      this.$emit('update:show', false);
    },
    isOk (){
      this.$emit('isOk');
    },
    isNo (){
      this.$emit('isNo');
    }
  }
}
</script>

<style scoped lang="scss">

.dialog-footer {
    text-align: right;
}

</style>
