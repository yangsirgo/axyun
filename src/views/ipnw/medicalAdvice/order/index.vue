<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      pageName="hos_order"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <div class="height100">
          <medical-order :ids="ids" ref="medicalOrder"></medical-order>
        </div>
      </template>
    </l-layout>
  </div>

</template>

<script>
  import Tools from "@/views/public/tools/index";
  import medicalOrder from "./components/medicalOrderMain.vue";
  import leftBar from "../components/leftBar.vue";
  import {mapGetters} from 'vuex';
  import { getAdviceFormwork,leadAdviceFormwork2 } from "@/api/cis/resident/residentAdviceFormwork";

  export default {
    name: "diagnosis",
    components: {
      medicalOrder,leftBar
    },
    data() {
      return {
        formParams: ['CourtyardArea', 'technicalOffices', 'illnessArea', 'patientsType', 'patientsState', 'search'],
        toolBoxs: ['drugInfo','templateQuote',"Hotkey"],
        ids:[]
      }
    },
    methods: {
      handleClick() {// tab 的切换方法

      },
      search(form) {// 查询方法
        console.log('form:',form);
      },
      readCard() {// 读卡方法

      },
      messageHandler (m,ml) {
        console.log(m,"index这边接收到了")
        this.messageCallBack (m);
      },
      // 模板引用页面 点击引用后的回调函数
      async messageCallBack (m) {
        let medicalOrder = this.$refs.medicalOrder;
        let data = {
          ids : m,// 引用的工具箱内部数据
          inpCode : this.receivePatientData.inpCode,//患者信息
          bedNo : this.receivePatientData.bedCode,//患者信息
          categoryCode : medicalOrder.searchForm.categoryCode, //用户选择的长短期医嘱
          patientId: this.receivePatientData.patientId
        };

        let reps = await leadAdviceFormwork2(data);
        if (reps.code === 1) {
          this.dialogVisible = false;
          this.$message.success(reps.msg ? reps.msg : "医嘱模板引用成功");
          // 成功后刷新当前数据
          medicalOrder.fetchTableList();
        } else {
          this.$message.error(reps.msg ? reps.msg : "医嘱模板引用失败");
        }
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
    },
    watch: {
      // receivePatientData: {
      //   handler(n) {
      //     console.log("ad:", n);
      //     alert("有数据了");
      //   },
      //   deep: true
      // },
      ids: {
        handler(n) {
          this.ids = n;
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
