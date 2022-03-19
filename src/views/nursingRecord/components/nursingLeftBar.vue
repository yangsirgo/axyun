<!--
<template lang="scss">
<div class="leftTabsWrapper height100">
    <leftTabs @tabs-change="handleClick" @read-card="readCard" @query="search" v-model="formValue" :hosp-state="hospState" :searchPlaceholder="dataType == 1?'卡号/住院号/姓名':'卡号/住院号/床号/姓名'" :label-type="labelType" :form-list="isRegist?formParams2:formParams">
        <template #firstBottom>
            <patients ref="patients" :isMultiple="Multiple" :type="dataType" :labelType="labelType"></patients>
        </template>
        <template #second>第二卡片内容</template>
        <template #third>第三卡片内容</template>
    </leftTabs>
</div>
</template>

<script>
    import leftTabs from "@/components/LSidePatient.vue";
    import patients from "@/views/nursingRecord/components/PatientList";
    import {
        mapGetters,
        mapActions
    } from "vuex";
    import {
        getWardByDept
    } from "@/api/ipnw/leaveHos";

    export default {
        components: {
            leftTabs,
            patients
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
            }
        },
        data() {
            return {
                formParams: [
                    // "technicalOffices",
                    "illnessArea",
                    "search",
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
                    illnessArea: ""
                }
            };
        },
        computed: {
            ...mapGetters(["illnessArea"]),
            ...mapGetters("user", ["role"])
        },
        created() {
            // this.selectIllnessArea();
            if (this.illnessArea) {
                this.formValue.illnessArea = this.illnessArea;
            }
            // this.formValue.illnessArea = this.illnessArea
            if (this.type === "entry") {
                // 区分 排床
                this.dataType = 1;
                this.labelType = "1";
            } else if (this.type === "hos") {
                this.dataType = 2;
                this.labelType = "2";
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
                this.search({
                    illnessArea: this.illnessArea
                });
            }
        },
        mounted() {
            this.search({
                illnessArea: this.illnessArea
            });
        },
        methods: {
            ...mapActions({
                // 保存病区
                changeIllnessArea: "ipnw/changeIllnessArea"
            }),
            search(form) {
                // 查询方法
                // this.code = form.code
                this.changeIllnessArea(form.illnessArea);
                if (!this.hospState) {
                    // 处理默认显示某种类型患者列表
                    form.code = this.code;
                    form.admissionStatus = form.code == 2 ? "2" : "7";
                }
                this.$emit('updateForm', form);
                this.$refs.patients.search(form);
            },
            handleClick() {},
            readCard(val) {
                this.$refs.patients.getCardReading(val);
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

<style scoped lang="scss">
    .leftTabsWrapper {
        /*height: calc(100% - 230px);*/
    }

    /deep/ .el-tabs__content {
        overflow: unset !important;
    }
</style>

-->
<template>
  <div class="leftTabsWrapper height100">
    <leftTabs
      @tabs-change="handleClick"
      @query="search"
      :isLargeWidth="isLargeWidth"
      v-model="formValue"
      :tabs-name="tabsName"
      :form-list="formParams"
    >
      <template #first>
        <patients
          ref="patients"
          :isMultiple="Multiple"
          :type="dataType"
          :labelType="labelType"
        ></patients>
      </template>
    </leftTabs>
  </div>
</template>

<script>
 import {mapGetters, mapActions} from "vuex";

  import leftTabs from "@/components/LSidePatient.vue";
  import patients from "@/views/nursingRecord/components/PatientList";

  import {getWardByDept} from "@/api/emrRecord/ipnw/leaveHos";

  export default {
    components: {
      leftTabs,
      patients
    },
    props: ["pSetterForm", "isLargeWidth","Multiple","type","code","hospState","isRegist"],
    data() {
      return {
        tabsName: [
          {
            label: "患者列表",
            value: "first"
          }
        ],
        formParams: [
          // "technicalOffices",
          "patientName",
          // "inDocNumber",
          // "illnessArea",
          // "search",
        ],
        dataType: 1, // 入院及排床
        labelType: "1",
        formValue: {
          illnessArea: ""
        }
      };
    },
    computed: {
      ...mapGetters('ipnw',["illnessArea"]),
      ...mapGetters("user", ["role"])
    },
    created() {
      if (this.pSetterForm != undefined && Array.isArray(this.pSetterForm)) {
        this.formParams = this.pSetterForm;
      }

      if (this.illnessArea) {
        this.formValue.illnessArea = this.illnessArea;
      }
      // this.formValue.illnessArea = this.illnessArea
      if (this.type === "entry") {
        // 区分 排床
        this.dataType = 1;
        this.labelType = "1";
      } else if (this.type === "hos") {
        this.dataType = 2;
        this.labelType = "2";
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
    methods: {
      ...mapActions({
        // 保存病区
        changeIllnessArea: "ipnw/changeIllnessArea"
      }),
      search(form) {
        // 查询方法
        // this.code = form.code
        this.changeIllnessArea(form.illnessArea);
        if (!this.hospState) {
          // 处理默认显示某种类型患者列表
          form.search = form.patientName;
          form.illnessArea = '';
          form.code = this.code;
          form.admissionStatus = form.code == 2 ? "2" : "7";
          /*isNurse: 1
          pageNo: 1
          pageSize: 20
          illnessArea:
            search:
              code: 2
          admissionStatus: 2*/
        }
        let formCopy = {
          illnessArea: 'BQ0001',
          code: 2,
          admissionStatus: '2',
          search: form.patientName,
          isNurse: 1
        };
        this.$refs.patients.search(formCopy);
      },
      handleClick() {
      },
      readCard(val) {
        // this.$refs.patients.getCardReading(val);
      },
      // 查询所有病区 返回第一个
      async selectIllnessArea() {
        let res = await getWardByDept({
          deptId: this.role.deptId
        });
        this.formValue.illnessArea = res.data[0].wardCode;
        this.changeIllnessArea(res.data[0].wardCode);
        // this.search(this.formValue);
      }
    }
  };
</script>

<style scoped lang="scss">
.leftTabsWrapper {
  /*height: calc(100% - 230px);*/
}

/deep/ .el-tabs__content {
  overflow: unset !important;
}
</style>
