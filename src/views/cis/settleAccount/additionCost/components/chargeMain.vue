<template>
  <div class="rechargecont height100" ref="page">
    <div class="utils">
      <LFormtTitle label="执行科室" class="input-item">
        <l-value-domain
          clearable
          remoteUrl="/wadmin/hos/dept"
          :value.sync="utils.execDeptId"
          remoteShowKey="orgNm"
          remoteValueKey="id"
          placeholder="请选择执行科室"
        ></l-value-domain>
      </LFormtTitle>
      <LFormtTitle label="结算类型" class="input-item">
        <l-value-domain
          code="MEDICAL_INSURANCE_CODE"
          :value.sync="utils.settlementType"
          placeholder="请选择"
          clearable
        />
      </LFormtTitle>
    </div>
    <div class="recharge-main height-button-main">
      <el-tabs v-model="activeName" class="height100">
        <el-tab-pane label="非药品" name="first">
          <treat-medicine ref="treatRef"  pageType="additionCost"  v-if="activeName === 'first'" :execDept="utils.execDeptId" ></treat-medicine>
        </el-tab-pane>
        <el-tab-pane label="药品" name="second">
          <advice-medicine ref="adviceRef" pageType="additionCost" v-if="activeName === 'second'" :execDept="utils.execDeptId"></advice-medicine>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="recharge-bottom height-button-bottom">
      <el-button
        type="primary"
        @click="goCost"
        class="float-right"
      >结算
      </el-button>
    </div>
    <!-- 预结算弹窗 -->
    <el-dialog
      title="收费"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="700px"
      :before-close="close"
    >
      <l-charge :charge="newLchrage" :isApptointment="false" @close="close"></l-charge>
    </el-dialog>
  </div>
</template>
<script>
  import treatMedicine
    from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/treatModule/treatMedicine.vue";
  import adviceMedicine
    from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/presModule/mainTable.vue";

  import service from "@/api/appointment/outpCharge";
    import {mapActions, mapGetters} from "vuex";
  export default {
    data() {
      return {
        activeName: "first",
        utils: {
          execDeptId: '',
          settlementType: ''
        },
        // 当前患者信息
        patientInfo: {},
        // 弹窗
        dialogVisible: false,
        // 预结算数据
        newLchrage: {
          appointment: {}, // 预约明细
          chargePrescriptions: [], // 待收费明细，
          accountInfo: {} // 账户数据
        }
      };
    },
    components: {
      treatMedicine,
      adviceMedicine
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
      handler(val) {
        this.patientInfo = {
          ...val
        }
      },
      immediate: true,
      deep: true
    }
    },
    methods: {
      async goCost() {
        let list = [];
        let ids = [];
        if(this.activeName == 'first'){
            list = this.$refs.treatRef.multipleSelection;
        }else{
          let selectList = this.$refs.adviceRef.multipleSelection;
          //选中皮试药品，需要附带皮试药品下面的行
          //两个条件判断：1.药品ID，找majorId 相同项，并且 useWay 是901
          let allAdviceList = this.$refs.adviceRef.tableRuleForm.tableData;
          selectList.forEach((item)=>{
            allAdviceList.forEach((adviceItem)=>{
              if (item.id === adviceItem.majorId && adviceItem.useWay === "901"){
                list.push(adviceItem);
              }
            });
          });
          list = selectList.concat(list);//合并选中项与筛选项
        }
        if(list.length <= 0){
          this.$message.error("请勾选要收费的项目");
          return
        }
        // 是否提交
        for(let i = 0;i < list.length;i++){
          let val = list[i]
          if(val.orderStatus == 0){
            this.$message.error("有项目未提交请提交");
            return;
          }else{
            ids.push(val.id);
          }
        }
        // 查询待收费项目 预结算。。
        try {
          let preRes = await service.getlistWaitChargeDetail({
          orderIds: ids,
          patientId: this.patientInfo.patientId || null,
          diagTreatActivityId: this.patientInfo.visitCode || null
          });
          if(!preRes.data || preRes.data.length < 1){
            this.$message.error("未查询到待收费项目，请确认医嘱是否关联收费项目");
            return;
          }
          // 整理数据
          let list = this.getPreData(preRes);
          this.newLchrage.appointment = {...this.patientInfo};
          this.newLchrage.chargePrescriptions = list;
          this.dialogVisible = true;
        } catch (error) {
          console.info(error)
          this.$message.error(error.msg || "查询收费项目报错");
        }
     },
     // 整理待收费数据
     getPreData(obj){
       let list = obj.data[0].outpWaitingSettleOrderVOS;
        list.forEach(val=>{
          val.outpChargeDetailVO2s = val.outpWaitingSettleChargeItemVOS;
        })
       return list;
     },
      close(val) {
        this.dialogVisible = false;
        this.newLchrage = {
          appointment: {}, // 预约明细
          chargePrescriptions: [], // 待收费明细，
          accountInfo: {} // 账户数据
        };
        if(this.activeName == 'first'){
            list = this.$refs.treatRef.getList();
        }else{
          let selectList = this.$refs.adviceRef.getList();
        }
    }
    }
  };
</script>
<style lang="scss" scoped>
  .rechargecont {
    position: relative;
    padding-top:10px;
  }

  .utils {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 100;

    .input-item {
      width: 250px;
    }

    .input-item + .input-item {
      margin-left: 20px;
    }
  }

  .recharge-main {
    background: #fff;
    padding: 0 16px;

    /deep/ .el-tabs__content {
      height: calc(100% - 28px);
    }
  }

  .special-col {
    padding: 20px;
    border: 1px solid #e4e4e4;
  }

  .el-tabs__content {
    height: 0px !important;
  }

  .margin-top-20 {
    margin-top: 20px;
  }

  .recharge-bottom {
    padding: 16px;
    text-align: right;
    background: #fff;
    border-radius: 0 0 4px 4px;
  }


</style>
