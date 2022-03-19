<template>
  <div class="leftTabsWrapper height100">
    <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="form"
      :form-list="formParams">
      <template #firstBottom>
        <!--填入 第一个 tabs 的 搜索条件下部 内容-->
        <patients-tree ref="list" :params="params"></patients-tree>
      </template>
      <template #second>
        <!--填入 第二个 tabs 的  内容-->

        第二卡片内容
      </template>
      <template #third>
        <!--填入 第三个 tabs 的 内容-->
        第三卡片内容
      </template>
    </leftTabs>
  </div>
</template>

<script>

  // 目前form 表单有
  //院区：CourtyardArea
  // 科室：technicalOffices
  // 渠道：channelWay
  // 时间：timeRange
  // 搜索：search

  import leftTabs from "@/components/LSideTabs.vue";
  import patientsTree from "./patientsTable.vue";
  import {getPatients, receive, findAllergy, selectPatientBySth} from "@/api/cis/visit/visit";
  import visit from "@/api/cis/visit/visit";
  //console.log(leftTabs);
  export default {
    name: "leftBar",
    props : ['pSetterForm'],// 左侧的表单 列表
    data() {
      return {
        form : {},
        formParams: ['CourtyardArea', 'technicalOffices', 'channelWay', 'timeRange', 'search'],
        params: {
          searchReasult: '',
          startDate: '',
          stopDate: ''
        }
      }
    },
    methods: {
      handleClick() {// tab 的切换方法

      },
      async search(form) {// 查询方法
        console.log('form:',form);
        let data = {
          searchValue: form.search
        }
        this.params.searchReasult = '';
        if(form.search != '' && form.search != null){
          let res = await visit.selectPatientBySth(data);
          for (let i = 0; i < res.length; i++) {
             this.params.searchReasult += res[i] + ","
          }
        }
        if(form.hasOwnProperty('timeRange') && form.timeRange.length === 2){
          this.params.startDate = form.timeRange[0];
          this.params.stopDate = form.timeRange[1];
        }
        this.$refs.list.loadData();
        // this.params = form;
      },
      // async selectPatientBySth(data){
      //   await selectPatientBySth(data).then(res => {
      //     for (let i = 0; i < res.data.length; i++) {
      //       this.params.searchReasult += res.data[i] + ","
      //     }
      //   })
      // },
      readCard() {// 读卡方法

      }
    },
    components: {
      leftTabs, patientsTree
    },
    created () {
      if (this.pSetterForm != undefined && Array.isArray(this.pSetterForm)) {
        this.formParams = this.pSetterForm;
      }
    }
  }
</script>

<style scoped lang="scss">
  .leftTabsWrapper {
    /*height: calc(100% - 230px);*/
  }
  /deep/ .el-tabs__content {
    overflow: unset !important;
  }
</style>
