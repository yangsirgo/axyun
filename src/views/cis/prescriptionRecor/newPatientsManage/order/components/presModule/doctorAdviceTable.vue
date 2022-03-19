<template>
  <div class="height100 Rp_wrapper">
    <div :class="topCls">
      <main-table v-if="tabsName === 'adviceTable'" ref="mainTable"></main-table>
      <treat-medicine v-else-if="tabsName === 'treatMedicine'"></treat-medicine>
    </div>
    <div :class="bottomCls" class="elTabsStyle" :style="heightA">
      <el-tabs class="height100 tabs" v-model="activeName">
        <el-tab-pane label="附加医嘱" name="first"  v-if="tabsName === 'adviceTable'">

          <div class="additionalOrderCls height100">
            <additional-order></additional-order>
          </div>
        </el-tab-pane>
        <el-tab-pane label="保存模板" name="second">
          <save-tpl v-if="activeName === 'second'" hosType="1"></save-tpl>
        </el-tab-pane>
      </el-tabs>
      <el-button class="pullup" @click="pullup">{{heightA ? "收起" : "拉起"}}</el-button>
      <!--<div class="rp-mask" v-if="isMask"></div>-->
    </div>
  </div>
</template>

<script>
  import saveTpl from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/saveTemplate.vue";
  import mainTable from './mainTable.vue';
  import treatMedicine from '../treatModule/treatMedicine.vue';
  import additionalOrder from './additionalOrder.vue';
  import { mapActions, mapGetters } from "vuex";

  export default {
    name: "doctorAdviceTable",
    props : {
      tabsName :{
        default:"adviceTable",
      }
    },
    components: {  saveTpl, additionalOrder, mainTable, treatMedicine },
    data() {
      return {
        activeName: "first",
        isMask: false,
        classStyle:false,
        heightA:false,

      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      saveHandle (){
        this.$refs.mainTable && this.$refs.mainTable.getList(true);
      },
      pullup(){
         this.heightA = !this.heightA;
        //  try {
        //   if (this.heightA) {
        //     this.$refs.mainTable.setTableAtuoHeight();
        //   } else {
        //     this.$refs.mainTable.setTableAtuoHeight("100%");
        //   }
        //  } catch (error) {
           
        //  }

      },
    },
    watch: {
      receivePatientData: {
        //深度监听，可监听到对象、数组的变化
        handler(n) {
          this.isMask = n.recordStatus === "5";
        },
        immediate: true,
        deep: true
      },
      tabsName: {
        immediate: true,
        handler(n) {
          if (n === 'treatMedicine') {
            this.activeName = "second";
          } else {
            this.activeName = "first";
          }
        }
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      topCls (){
        return {
          "top":this.tabsName === 'adviceTable' || this.tabsName === 'treatMedicine',
          // "top70":this.tabsName === 'treatMedicine',
          "heightATop":this.heightA
        }
      },
      bottomCls (){
        return {
          "bottom":this.tabsName === 'adviceTable' || this.tabsName === 'treatMedicine',
          // "bottom30":this.tabsName === 'treatMedicine'
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  .Rp_wrapper {
    .top {
      height: 93%;
      /*background-color: red;*/
    }

    .elTabsStyle{
      position: relative;
    }
    .pullup{
      position: absolute;
      right: 10px;
      top: 6px;
      border: none;
    }
    .bottom {
      /*background-color: green;*/
      height: 40%;
      //position: relative;
      //left: -30px;

      > .rp-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 500;
        background-color: #b0aeae;
        opacity: 0.1;
      }
      .tabs {
        padding: 8px 16px 16px 0px;
        // > /deep/.el-tabs__header {
        //   padding-left: 16px;
        // }
        // /deep/ .el-tabs__content {
        //   height: calc(100% - 50px);
        //   /*overflow: auto;*/
        // }

        /deep/ .el-tabs__content {
          height: calc(100% - 30px) ;
        }
      }
    }

    .tabs {
      > /deep/.el-tabs__header {
        padding-left: 16px;
      }
      .additionalOrderCls {
        padding-top: 16px;
        padding-left: 16px;

      }
    }

    .bottom30 {
      height: 30% !important;
      .tabs {
        padding: 8px 16px 16px 0px;
        // /deep/ .el-tabs__content {
        //   height: calc(100% - 50px);
        //   /*overflow: auto;*/
        // }
         /deep/ .el-tabs__content {
          height: calc(100% - 30px) ;
        }
      }
    }
    .top70 {
      height: 90% !important;
    }
    .heightATop{
      height: 60% !important;
    }
  }
</style>
