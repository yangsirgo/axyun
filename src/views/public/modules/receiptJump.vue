<template>
  <div class="height100 width100">
    <div class="width100" v-loading="loading">
    <l-card-title>
      <span slot="left">票据跳号</span>
    </l-card-title>
    <LFormtTitle label="票据类型">
      <l-value-domain
        code="RECEIPT_TYPE"
        :value.sync="form.receiptType"
        clearable
        @change="getReceiptByType"
      />
    </LFormtTitle>
    <LFormtTitle label="下张发票号" class="margin-top-10">
      <el-input disabled v-model="form.nextReceiptNum"></el-input>
    </LFormtTitle>
    <LFormtTitle label="跳至发票号" class="margin-top-10">
      <el-input v-model="form.jumpReceiptNum" placeholder="请输入"></el-input>
    </LFormtTitle>
    <LFormtTitle label="跳号原因" class="margin-top-10">
      <l-value-domain code="JUMP_REASON" :value.sync="form.jumpReason" clearable />
    </LFormtTitle>
    </div>
    <div class="width100 margin-top-10">
      <el-button type="primary" plain class="float-right" @click="cancal">取消</el-button>
      <el-button type="primary" class="float-right margin-right-10" @click="jumpReceipt">确认</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import service from "@/api/systemManagement/receipt/receipt";
export default {
  data() {
    return {
      form: {
        // 下张发票号
        nextReceiptNum: "",
        // 跳至发票号
        jumpReceiptNum: "",
        // 跳号原因
        jumpReason: ""
      },
      // vuex 启用票据集合
      receiptList: [],
      loading: false
    };
  },
  watch: {
    currentReceipt: {
      handler(obj) {
        console.info(obj.list[0].receiptUsedNum,"ddd")
        this.receiptList = obj.list;
        let val = obj.list[0];
        this.getReceiptByType(val.receiptType);
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters("settleAccount", ["currentReceipt"])
  },
  methods: {
    ...mapActions({
      currentReceiptFunc: "settleAccount/currentReceiptData"
    }),
    // 跳号
    async jumpReceipt() {
      // 验证
      if (this.form.jumpReceiptNum > this.currentReceipt.receiptStopNum) {
        this.$message.error("跳号不能超过票据终止号");
      }
      try {
        this.loading = true;
        let data = {
          outId: this.form.outId,
          inId: this.form.inId,
          receiptType: this.form.receiptType,
          divisionCode: this.form.divisionCode,
          jumpNumReason: this.form.jumpNumReason,
          receiptStartNum: this.form.nextReceiptNum,
          receiptStopNum: this.form.jumpReceiptNum,
        };
        let res = await service.jumpNum(data);
        let receipts = {
          list: []
        };
        this.receiptList.forEach(obj => {
          if (obj.outId == res.data.outId) {
            receipts.list.push(res.data);
          }else{
            receipts.list.push(obj);
          }
        });
        this.currentReceiptFunc(receipts)
        this.$message({type: 'success',message: '跳号成功'})
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.info(error)
        this.$message.error(error.msg || "跳号失败")
      }
    },
    // 取消
    cancal() {
      this.jumpReceiptNum = "";
    },
    // 获取当前类型下启用票据
    getReceiptByType(item) {
      let val = null;
      this.receiptList.forEach(obj => {
        if (obj.receiptType == item) {
          val = { ...obj };
        }
      });
      if (!val || val == null) {
        this.$message('该票据类型没有已启用的票据');
        this.form = {
          receiptType: this.form.receiptType,
          // 下张发票号
          nextReceiptNum: "",
          // 跳至发票号
          jumpReceiptNum: "",
          // 跳号原因
          jumpReason: ""
        };
      } else {
        this.form = {
          ...val
        };
        if (!val.receiptUsedNum) {
          this.form.nextReceiptNum = val.receiptStartNum;
        } else if (
          val.receiptUsedNum &&
          val.receiptUsedNum < val.receiptStopNum
        ) {
          this.form.nextReceiptNum = parseInt(val.receiptUsedNum) + 1;
        } else {
          this.form.nextReceiptNum = "";
        }
      }
      console.info(this.form.receiptUsedNum,"sss")
    }
  }
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>