<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="default"
      @message="messageHandler"
    >
      <template #list>
        <l-side-tabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          :form-list="formParams">
          <template #firstBottom>
            <!--填入 第一个 tabs 的 搜索条件下部 内容-->
            <patients-table ref="list" :params="params"></patients-table>
          </template>
          <template #second>
            <!--填入 第二个 tabs 的  内容-->
            第二卡片内容
          </template>
          <template #third>
            <!--填入 第三个 tabs 的 内容-->
            第三卡片内容
          </template>
        </l-side-tabs>
      </template>
      <template #content>
        <div class="height100">
          <test-report1></test-report1>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>

  //备注： hosp-state  属性 增加住院的人员状态包括 新入院 在院 预撤床 撤床 。 目前默认选择在院状态
  // 目前form 表单有
  //院区：CourtyardArea
  // 科室：technicalOffices
  // 渠道：channelWay
  // 时间：timeRange
  // 搜索：search

  import LSideTabs from "@/components/LSideTabs.vue";

  //console.log(leftTabs);
  import testReport from "./component/testReport.vue"
  import patientsTable from "@/views/cis/prescriptionRecor/newPatientsManage/components/patientsTable.vue"
  import testReport1 from "@/views/public/reportCenter/insReport.vue"
  import {getPatients, receive, findAllergy,cardReading} from "@/api/cis/visit/visit";
  import visit from "@/api/cis/visit/visit";
  import { mapGetters,mapActions } from 'vuex'

  export default {
    name: "leftBar",
    data() {
      return {
        formParams: ['technicalOffices','timeRange', 'search'],
        toolBoxs: ["reportExplain"],
        params: {
          searchValue: '',
          searchReasult: '',
          startDate: '',
          stopDate: ''
        }
      }
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData'
      }),
      handleClick() {// tab 的切换方法

      },
      async search(form) {// 查询方法
        console.log('form:',form);
        let data = {
          searchValue: form.search
        }
        this.params.searchValue = form.search;
        this.params.searchReasult = '';
        if(form.search != '' && form.search != null){
          let res = await visit.selectPatientBySth(data);
          for (let i = 0; i < res.length; i++) {
            this.params.searchReasult += res[i] + ","
          }
          if(this.params.searchReasult == ''){
            this.$refs.list.showData.all = [];
            this.$refs.list.showData.received = [];
            this.$refs.list.showData.wait = [];
            return;
          }
        }
        if(form.timeRange != null){
          this.params.startDate = form.timeRange[0];
          this.params.stopDate = form.timeRange[1];
        }else{
          this.params.startDate = null;
          this.params.stopDate = null;
        }
        if(form.technicalOffices != null){
          this.params.technicalOffices = form.technicalOffices;
        }
        this.$refs.list.loadData();
        // this.params = form;
      },
      readCard(form) {// 读卡方法
        let data = {
          cardData: form.search
        }
        cardReading(data).then(res =>{
          this.$refs.list.showData.received = [];
          if(res.data != null && res.data.length > 0){
            if (res.data[0].recordStatus == 4) {
              //今天，编辑
              if(res.data[0].hasOwnProperty('rediagStatus') && res.data[0].rediagStatus == 1){
                res.data[0].optStr = '回诊';
                this.$refs.list.showData.received.push(res.data[0]);
              }else {
                res.data[0].optStr = '编辑';
                this.$refs.list.showData.received.push(res.data[0]);
              }
            }else if(res.data[0].recordStatus == 5){
              res.data[0].optStr = '查看';
            }
            //生日转年龄
            //res.data[0].age = res.data[0].hasOwnProperty('birthDate') && res.data[0].birthDate != '' && res.data[0].birthDate != null ? this.jsGetAge(res.data[0].birthDate.substring(0, 10)) : '';
            this.changeRecPatientData(res.data[0]);
          }
          this.$refs.list.showData.all = res.data;
          this.$refs.list.showData.wait = [];
          this.$message.success("读卡成功！");
        }).catch(()=>{
          this.$message.error("读卡失败");
        })
      },
      messageHandler(){

      }
    },
    components: {
      testReport,
      patientsTable,
      testReport1,
      LSideTabs
    },
  }
</script>

<style scoped lang="scss">

</style>
