<template>
  <div class="height100">
    <!-- <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="formValue"

      :searchPlaceholder="dataType == 1?'卡号/住院号/姓名':'卡号/住院号/床号/姓名'"
      :label-type="labelType"
      :form-list="isRegist?formParams2:formParams"
      :readcard-state="false"
    >
      <template #firstBottom>
        <patientsbed ref="patients" :isMultiple="Multiple" :type="dataType" :labelType="labelType" :new-column="true"
                     v-if="patientListFlag"></patientsbed>
        <patients ref="patients" :isMultiple="Multiple" :type="dataType" :labelType="labelType" :new-column="true"
                  v-else></patients>
      </template>
      <template #second>第二卡片内容</template>
      <template #third>第三卡片内容</template>
    </leftTabs>-->
    <LSideList @sideEvent="sideEvent">
      <template #formList>
        <div class="margin-bottom-6">
          <l-value-domain
            clearable
            :remoteUrl="'/wadmin/ward-dept?deptId='+role.deptId"
            type="select"
            :value.sync="formValue.illnessArea"
            remoteShowKey="wardName"
            remoteValueKey="wardCode"
            placeholder="请选择病区"
            @change="search"
          ></l-value-domain>
        </div>
        <div class="margin-bottom-6">
          <el-input
            @keyup.native.enter="sideEvent('query')"
            v-model="formValue.search"
            placeholder="卡号/住院号/姓名"
            style="width: 100%"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="sideEvent('query')"></i>
          </el-input>
        </div>
      </template>
      <template #mainCont>
        <patientsbed
          ref="patients"
          :isMultiple="Multiple"
          :type="dataType"
          :labelType="labelType"
          :new-column="true"
          v-if="patientListFlag"
        ></patientsbed>
        <patients
          ref="patients"
          :isMultiple="Multiple"
          :type="dataType"
          :labelType="labelType"
          :new-column="true"
          v-else
        ></patients>
      </template>
    </LSideList>
  </div>
</template>

<script>
import leftTabs from "@/components/LSideTabsDoctor.vue";
import patients from "./PatientList";
import patientsbed from "./PatientListBed";
import LSideList from "@/views/components/LSideList";
import { mapGetters, mapActions } from "vuex";
import { getWardByDept } from "@/api/ipnw/leaveHos";

export default {
  components: {
    patients,
    patientsbed,
    // leftTabs,
    LSideList
  },
  props: {
    Multiple: {},
    type: {},
    code: {},
    hospState: {
      default: true
    },
    isRegist: {
      default: false
    },
    getPatientList: {
      default: false
    }
  },
  provide() {
    return {
      getIsCreatRecordBtn: () => 0 // 是否建档按钮:1为有;0为无
    };
  },
  data() {
    return {
      patientListFlag: false,
      formParams: [
        // "technicalOffices",
        "illnessArea",
        "search"
      ],
      formParams2: [
        // "technicalOffices",
        "illnessArea",
        "search",
        "isRegister"
      ],
      dataType: 1, // 入院及排床
      labelType: "1",
      formValue: {
        illnessArea: "",
        search: ""
      }
    };
  },
  computed: {
    ...mapGetters(["illnessArea"]),
    ...mapGetters("user", ["role"])
  },
  watch: {
    getPatientList: {
      handler(val) {
        if (val) {
          // this.search(this.formValue);
          if (!this.hospState) {
            // 处理默认显示某种类型患者列表
            this.formValue.code = this.code;
            this.formValue.admissionStatus =
              this.formValue.code == 2 ? "2" : "7";
          }
          this.$emit("updateForm", this.formValue);
          this.$refs.patients.search2(this.formValue);
          this.$emit("updatePatientList", false);
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    console.log("选中的是住院护士的什么功能type", this.type);
    this.selectIllnessArea();
    if (this.illnessArea) {
      this.formValue.illnessArea = this.illnessArea;
    }
    // this.formValue.illnessArea = this.illnessArea
    if (this.type === "entry") {
      // 区分 排床
      this.dataType = 1;
      this.labelType = "1";
    } else if (this.type === "hos") {
      // 区分 转床、包床
      this.dataType = 2;
      this.labelType = "2";
    } else if (this.type === "hosTransferBedNew") {
      this.dataType = 2;
      this.labelType = "2";
      this.patientListFlag = true;
    } else if (this.type === "apply") {
      // 入院申请
      this.dataType = 1;
      this.labelType = "0";
    } else if (this.type === "recall") {
      // 召回
      this.dataType = 2;
      this.labelType = "3";
    }
  },
  updated() {
    if (!this.hospState) {
      // 处理默认显示某种类型患者列表
      this.search({ illnessArea: this.illnessArea });
    }
  },
  mounted() {
    this.search({ illnessArea: this.illnessArea });
  },
  methods: {
    ...mapActions({
      // 保存病区
      changeIllnessArea: "ipnw/changeIllnessArea"
    }),
    //子组件抛出的方法
    sideEvent(sideEvent) {
      let obj = {
        query: "search",
        readCard: "readCard"
      };
      this[obj[sideEvent]](this.formValue);
    },
    search(form) {
      // 查询方法
      // this.code = form.code
      this.changeIllnessArea(form.illnessArea);
      if (!this.hospState) {
        // 处理默认显示某种类型患者列表
        form.code = this.code;
        form.admissionStatus = form.code == 2 ? "2" : "7";
      }
      this.$emit("updateForm", form);
      this.$refs.patients.search(form);
    },
    // handleClick() {},
    readCard() {
      this.$refs.patients.getCardReading(this.formValue.search);
    },
    // 查询所有病区 返回第一个
    async selectIllnessArea() {
      let res = await getWardByDept({
        deptId: this.role.deptId
      });
      this.formValue.illnessArea = res.data[0].wardCode;
      this.changeIllnessArea(res.data[0].wardCode);
      this.search(this.formValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.margin-bottom-6 {
  margin-bottom: 6px;
}
</style>
