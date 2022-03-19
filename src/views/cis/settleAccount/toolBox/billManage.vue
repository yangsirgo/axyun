<template>
  <div class="charge">
    <l-card-title>
      <span slot="left">票据启用/暂停</span>
    </l-card-title>
    <LFormtTitle label="票据类型">
      <l-value-domain code="RECEIPT_TYPE" :value.sync="receiptType" clearable @change="getReceiptByUser"/>
    </LFormtTitle>
    <el-table :data="tableData" border style="width: 100%;margin-top:10px;"  v-loading="loading">
      <el-table-column
        prop="receiptStartNum"
        label="起始号"
        min-width="70"
      ></el-table-column>
      <el-table-column label="终止号" prop="receiptStopNum" min-width="70"></el-table-column>
      <el-table-column label="操作" prop="operate" min-width="50">
        <template slot-scope="scope">
          <el-button v-if="scope.row['recordStatus'] == '1'" type="text" @click="updateStatus(2,scope.row)">停用</el-button>
          <el-button v-if="scope.row['recordStatus'] == '2'" type="text" @click="updateStatus(1,scope.row)">启用</el-button>
        </template>  
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import service from "@/api/systemManagement/receipt/receipt";
export default {
  name: "charge",
  data() {
    return {
      tableData: [],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // 票据类型
      receiptType: '1',
      // loading
      loading: false
      // // 当前启用的票据号码段
      // currentReceipt: {}
    };
  },
  computed: {
    ...mapGetters("user", ["role"])
  },
  mounted(){
    // 拿到当前登录用户发票记录
    this.getReceiptByUser();
  },
  methods: {
    ...mapActions({
      currentReceipt: "settleAccount/currentReceiptData"
    }),
    handleClick() {},
    doOperation() {},
    // 当前登录收费员所有领用票据
    async getReceiptByUser(){
      try {
        this.loading = true;
        let data = {
          pageSize: 30,
          pageNo: 1,
          receiptType: this.receiptType || undefined,
          receiveUserId: this.role.userId || undefined
        };
        let res = await service.getReceiptOutList(data);
        if(!res.data || res.data.length <= 0){
          this.$message({message: "当前登录人未领用票据"});
        }
        this.tableData = res.data;
        let receiptList = {
          list: []
        }; // 启用票据集合
        this.tableData.forEach(val=>{
          if(val.recordStatus == '1'){
            receiptList.list.push({...val})
          }
        })
        this.currentReceipt(receiptList)
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg || "获取当前登录人领用票据失败");
      }
    },
    // 启用停用
    async updateStatus(flag,row){
      try {
        if(flag == '1'){
          for(let i = 0;i < this.tableData.length;i++){
            let val = this.tableData[i];
            if(val.recordStatus == '1' && row.receiptType == val.receiptType){
              this.$message("一种票据类型一次只能启用一个号段票据");
              return;
            }
          }
          // this.tableData.forEach(val=>{
          //   if(val.recordStatus == '1' && row.receiptType == val.receiptType){
          //     this.$message("一种票据类型一次只能启用一个号段票据");
          //     return;
          //   }
          // })
        }
        let data = {
          ...row
        };
        data.recordStatus = flag;
        let res = await service.updateReceiptOut(data);
        this.$message({message: "操作成功",type: 'success'});
        this.getReceiptByUser();
      } catch (error) {
        this.$message.error(error.msg || "获取当前登录人领用票据失败");
      }

    }
  }
};
</script>
<style lang='scss' scoped>
.charge {
  width: 100%;
  height: 100%;
  background-color: #fff;
  // padding: 10px;
}
.special-col {
  color: $l-color-primary;
}
.special-other {
  color: #3d7dfb;
}
</style>
