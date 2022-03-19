<template>
  <div class="height100">
    <l-side-tabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="formValue"
      :searchPlaceholder="dataType == 1?'住院号/姓名':'住院号/床号/姓名'"
      :form-list="formParams"
    >
      <template #firstBottom>
        <patients ref="patients" :isMultiple="Multiple" :type="dataType"></patients>
      </template>
      <template #second>第二卡片内容</template>
      <template #third>第三卡片内容</template>
    </l-side-tabs>
  </div>
</template>

<script>
  import patients from "@/views/ipnw/components/PatientList.vue";
  import { mapGetters, mapActions } from 'vuex';
  import { getWardByDept} from "@/api/ipnw/leaveHos";
  export default {
    components: {
      patients
    },
    props:["Multiple","type"],
    data (){
      return {
        formParams: [
          // "technicalOffices",
          "illnessArea",
          "search"
        ],
        dataType: 1,
        labelType: '1',
        code: null,
        formValue: {
          illnessArea: ''
        },
        // 病区code
        wardCode:''
      }
    },
    computed :{
      ...mapGetters(['illnessArea']),
      ...mapGetters("user", ["role"])
    },
    created (){
      this.selectIllnessArea();
      if(this.illnessArea){
        this.formValue.illnessArea = this.illnessArea
      }
      if(this.type === "entry"){
          this.dataType = 1
          this.labelType = "1"
        }else if(this.type === "hos"){
          this.dataType = 2
          this.labelType = "2"
        }else if(this.type === "apply"){
          this.dataType = 1
          this.labelType = "0"
        }
    },
    mounted () {
      this.search(this.formValue);
    },
    methods: {
      search(form) {
        // 预出院的 值
        form.code = 2;
        form.admissionStatus = 3;
        // form.finance=1;
        // this.changeIllnessArea(form.illnessArea)
        this.$refs.patients.search(form);
      },
      handleClick (){},
      readCard (form){
        // 预出院的 值
        form.code = 2;
        // form.finance=1;
        form.admissionStatus = 3;
        this.$refs.patients.search(form);
      },
      // 查询所有病区 返回第一个
      async selectIllnessArea(){
        let res = await getWardByDept({
          deptId: this.role.deptId
        });
        this.formValue.illnessArea = res.data[0].wardCode;

        this.search(this.formValue);

      }
    }
  };
</script>

<style>
</style>
