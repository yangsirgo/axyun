<template>
  <div class="leftTabsWrapper height100">
    <!-- <leftTabs
      @tabs-change="handleClick"
      @read-card="readCard"
      @query="search"
      v-model="form"
      hosp-state
      illness-state
      :readcard-state="false"
      label-type="2"
      :form-list="formParams"
    >
      <template #firstBottom>
        <patients ref="patients" :form="form" :new-column="true"></patients>
      </template>
    </leftTabs> -->
    <LSideList @sideEvent="sideEvent">
      <template #formList>
        <div class="margin-bottom-6">
          <l-radio
            class="radioWrapper"
            style="padding: 0 2px"
            :radioCode.sync="form.admissionStatus"
            :selectDatas="allHospitalState"
            @radioChange="sideEvent('query')"
          ></l-radio>
        </div>
        <div class="border-style"></div>
        <div class="margin-bottom-6">
          <l-radio
            class="radioWrapper"
            style="padding: 0 59px;"
            :radioCode.sync="form.illnessState"
            :selectDatas="allIlnessStatus"
            @radioChange="sideEvent('query')"
          ></l-radio>
        </div>
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
        <patients ref="patients" :form="form" :new-column="true"></patients>
      </template>
    </LSideList>
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

// import leftTabs from "@/components/LSideTabs.vue";
// 20200401改造住院医生的患者列表
import leftTabs from "@/components/LSideTabsDoctor.vue";
import patients from "../../components/Patient";
import LSideList from "@/views/components/LSideList";
import LRadio from "@/components/LSideRadio.vue";

//console.log(leftTabs);
export default {
  name: "leftBar",
  components: {
    // leftTabs,
    patients,
    LSideList,
    LRadio
  },
  provide() {
    return {
      getIsCreatRecordBtn: () => 0 // 是否建档按钮:1为有;0为无
    };
  },
  data() {
    return {
      form: {
        admissionStatus: 2
      },
      formParams: [
        // "technicalOffices",
        // "illnessArea",
        /* "patientsType",
        "patientsState",*/
        "search"
      ],
      allHospitalState: [
        {
          code: 1,
          name: "本人",
          admissionStatus: 1
        },
        {
          code: 2,
          name: "本科",
          admissionStatus: 2
        },
        {
          code: 3,
          name: "转出",
          admissionStatus: 3
        },
        {
          code: 4,
          name: "预撤床",
          admissionStatus: 7
        }
      ],
      allIlnessStatus: [
        {
          code: 1,
          name: "新",
          illnessStatus: 1
        },
        {
          code: 2,
          name: "危",
          illnessStatus: 2
        },
        {
          code: 3,
          name: "重",
          illnessStatus: 3
        }
      ]
    };
  },
  mounted(){
    this.search(this.form);
  },
  methods: {
    handleClick() {
      // tab 的切换方法
    },
    //子组件抛出的方法
    sideEvent(sideEvent) {
      let obj = {
        query: "search",
        readCard: "readCard"
      };
      this[obj[sideEvent]](this.form);
    },
    search(form) {
      /* console.log(form);
      debugger */
      let data = form;
      let codeItem = this.allHospitalState.find((item,index)=>{
        return form.admissionStatus === item.code
      });
      data.code = codeItem.code;
      this.$refs.patients.getPatientList(data);
    },
    readCard(val) {
      this.$refs.patients.getCardReading(val);
    }
  }
};
</script>

<style scoped lang="scss">
.leftTabsWrapper {
  .radioWrapper {
    display: inline-block !important;
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
  .border-style {
    padding: 8px;
    margin-top: 16px;
    width: 98%;
    border-top: 1px solid $l-color-bgcolor-11;
  }
}
.margin-bottom-6 {
  margin-bottom: 6px;
}
</style>
