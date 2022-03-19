<template>
  <div class="height100">
    <!-- <l-side-tabs
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
    </l-side-tabs>-->
    <LSideList @sideEvent="sideEvent">
      <template #formList>
        <div class="margin-bottom-6">
          <LFormtTitle label="病区" labelWidth="76">
            <l-value-domain
              clearable
              :remoteUrl="'/wadmin/ward-dept?deptId='+role.deptId"
              type="select"
              :value.sync="formValue.illnessArea"
              remoteShowKey="wardName"
              remoteValueKey="wardCode"
              :placeholder="'请选择病区'"
              @change="sideEvent('query')"
            ></l-value-domain>
          </LFormtTitle>
        </div>
        <div class="margin-bottom-6">
          <el-input
            @keyup.native.enter="sideEvent('query')"
            v-model="formValue.search"
            :placeholder="dataType == 1?'住院号/姓名':'住院号/床号/姓名'"
            class="width100"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="sideEvent('query')"></i>
          </el-input>
        </div>
      </template>
      <template #mainCont>
        <patients ref="patients" :isMultiple="Multiple" :type="dataType"></patients>
      </template>
    </LSideList>
  </div>
</template>

<script>
import patients from "@/views/ipnw/components/PatientList.vue";
import { mapGetters, mapActions } from "vuex";
import { getWardByDept } from "@/api/ipnw/leaveHos";
import LSideList from "@/views/components/LSideList";

export default {
  components: {
    patients,
    LSideList
  },
  props: ["Multiple", "type"],
  provide() {
    return {
      getIsCreatRecordBtn: () => 0 // 是否建档按钮:1为有;0为无
    };
  },
  data() {
    return {
      formParams: [
        // "technicalOffices",
        "illnessArea",
        "search"
      ],
      dataType: 1,
      labelType: "1",
      code: null,
      formValue: {
        illnessArea: ""
      },
      // 病区code
      wardCode: ""
    };
  },
  computed: {
    ...mapGetters(["illnessArea"]),
    ...mapGetters("user", ["role"])
  },
  created() {
    this.selectIllnessArea();
    if (this.illnessArea) {
      this.formValue.illnessArea = this.illnessArea;
    }
    if (this.type === "entry") {
      this.dataType = 1;
      this.labelType = "1";
    } else if (this.type === "hos") {
      this.dataType = 2;
      this.labelType = "2";
    } else if (this.type === "apply") {
      this.dataType = 1;
      this.labelType = "0";
    }
  },
  mounted() {
    // this.search(this.formValue);
  },
  methods: {
    //子组件抛出的方法
    sideEvent(sideEvent) {
      let obj = {
        query: "search",
        readCard: "readCard"
      };
      this[obj[sideEvent]](this.formValue);
    },
    search(form) {
      // 预出院的 值
      form.code = 2;
      form.admissionStatus = 4;
      // form.finance=1;
      // this.changeIllnessArea(form.illnessArea)
      this.$refs.patients.search(form);
    },
    handleClick() {},
    readCard(form) {
      // 预出院的 值
      form.code = 2;
      // form.finance=1;
      form.admissionStatus = 3;
      this.$refs.patients.search(form);
    },
    // 查询所有病区 返回第一个
    async selectIllnessArea() {
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
