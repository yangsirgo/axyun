<template>
  <div class="height100 crisis-val">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <!-- <l-side-tabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          hosp-state
          :form-list="formParams"
        >
          <template #firstBottom>
            <patients ref="patients"></patients>
          </template>
        </l-side-tabs>-->
        <LSideList @sideEvent="sideEvent">
          <template #formList>
            <div class="margin-bottom-6">
              <l-radio
                class="radioWrapper"
                :radioCode.sync="form.hospState"
                :selectDatas="stateList"
                @radioChange="search"
              ></l-radio>
            </div>
            <el-row :gutter="5" class="margin-bottom-6">
              <el-col :span="12">
                <l-value-domain
                  clearable
                  remoteUrl="/wadmin/hos/dept"
                  type="select"
                  :value.sync="form.technicalOffices"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  placeholder="请选择科室"
                ></l-value-domain>
              </el-col>
              <el-col :span="12">
                <l-value-domain
                  clearable
                  :remoteUrl="'/wadmin/ward-dept?deptId='+role.deptId"
                  type="select"
                  :value.sync="form.illnessArea"
                  remoteShowKey="wardName"
                  remoteValueKey="wardCode"
                  placeholder="请选择病区"
                  @change="search"
                ></l-value-domain>
              </el-col>
            </el-row>
            <el-row :gutter="5" class="margin-bottom-6">
              <el-col :span="12">
                <el-select
                  clearable
                  v-model="form.patientsType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="sItem in patientsTypeOptions"
                    :key="sItem.value"
                    :label="sItem.label"
                    :value="sItem.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select
                  clearable
                  v-model="form.patientsState"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="sItem in patientsStateOptions"
                    :key="sItem.value"
                    :label="sItem.label"
                    :value="sItem.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <div class="margin-bottom-6">
              <el-input
                @keyup.native.enter="sideEvent('query')"
                v-model="form.search"
                placeholder="住院号/床号/姓名"
                class="width100"
              >
                <i slot="suffix" class="el-input__icon el-icon-search" @click="sideEvent('query')"></i>
              </el-input>
            </div>
          </template>
          <template #mainCont>
            <patients ref="patients"></patients>
          </template>
        </LSideList>
      </template>
      <template #content>
        <div class="height100">
          <crisis hosType="3"></crisis>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import patients from "../../components/Patient";
import Crisis from "@/views/public/criticalValue/index.vue";
import LRadio from "@/components/LSideRadio.vue";
import LSideList from "@/views/components/LSideList";

export default {
  name: "crisisVal", // 危急值
  components: {
    patients,
    Crisis,
    LRadio,
    LSideList
  },
  data() {
    return {
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ],
      toolBoxs: ["templateQuote"],
      stateList: [
        {
          admissionStatus: "2",
          code: 1,
          name: "新入院"
        },
        {
          admissionStatus: "2,7",
          code: 2,
          name: "在院"
        },
        {
          admissionStatus: "7",
          code: 3,
          name: "预出院"
        }
      ],
      patientsTypeOptions: [
        {
          value: "0",
          label: "我的患者"
        },
        {
          value: "1",
          label: "本科患者"
        }
      ],
      patientsStateOptions: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "本科患者"
        },
        {
          value: "2",
          label: "转科患者"
        }
      ],
      form: {}
    };
  },
  provide() {
    return {
      getIsCreatRecordBtn: () => 0 // 是否建档按钮:1为有;0为无
    };
  },
  computed: {
    ...mapGetters("user", ["role"])
  },
  mounted() {
    this.search();
  },
  methods: {
    // handleClick() {},
    //子组件抛出的方法
    sideEvent(sideEvent) {
      let obj = {
        query: "search",
        readCard: "readCard"
      };
      this[obj[sideEvent]]();
    },
    search() {
      // 查询方法
      this.$refs.patients.search(this.form);
    },
    readCard() {
      // 读卡方法
    },
    messageHandler() {},
    toolBoxMessage(moduleName, data) {
      if (moduleName != "PreviousPrescriptions") {
        return;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.crisis-val {
  .radioWrapper {
    display: inline-block !important;
    padding: 0 24px;
  }
  .hideFirst {
    /deep/.el-radio-group {
      /deep/.el-radio-button:first-child {
        display: none;
      }
    }
  }
  /deep/ .el-radio-button {
    margin-right: 5px;
  }
  .l-radio-button {
    /deep/ .el-radio-button__inner {
      width: auto;
      background: rgba(246, 246, 246, 1);
      border-radius: 12px;
      line-height: 24px;
      padding: 0 12px;
    }

    /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: rgba(255, 225, 213, 1);
      
      font-weight: bold;
      color: rgba(240, 90, 35, 1);
    }
  }
}
.margin-bottom-6 {
  margin-bottom: 6px;
}
</style>
