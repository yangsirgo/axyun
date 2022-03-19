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
        <div class="height100 width100">
          <!--<el-button @click="isFill=!isFill">[]</el-button>-->
          <medical-order-list></medical-order-list>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>

  import LSideTabs from "@/components/LSideTabs.vue";
  import { mapGetters,mapActions } from 'vuex'
  import medicalOrderList from '@/views/cis/integratedEmr/opEmr/medicalOrder/component/medicalOrderList.vue'
  import {getPatients, receive, findAllergy,cardReading} from "@/api/cis/visit/visit";
  import visit from "@/api/cis/visit/visit";
  import patientsTable from "@/views/cis/prescriptionRecor/newPatientsManage/components/patientsTable.vue"

  export default {
    name: "",
    components: {
      medicalOrderList,
      patientsTable,
      LSideTabs
    },
    data() {
      return {
        formParams: ['technicalOffices','timeRange', 'search'],
        toolBoxs: ['reportExplain','drugInfo'],
        params: {
          searchValue: '',
          searchReasult: '',
          startDate: '',
          stopDate: ''
        }
      };
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData'
      }),
      messageHandler() {
        console.log("工具箱消息")
      },
      handleClick() {// tab 的切换方法

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
      },
    },
    computed : {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      "receivePatientData":{//深度监听，可监听到对象、数组的变化
        handler(val){
          console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
        },
        immediate: true,
        deep:true
      }
    }
  };
</script>

<style lang='scss' scoped>

</style>


