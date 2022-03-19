<template>
  <div class="main-contain height100">
    <!-- 门诊诊疗 -->
    <!-- @tab-click="handleClick"  -->
    <el-tabs
      class="tabsWrapper"
      v-model="activeName"
      :before-leave="beforeLeave"
    >
      <el-tab-pane
        :label="item.label"
        :name="item.name"
        :key="index"
        v-for="(item, index) in datas"
        lazy
      >
      </el-tab-pane>
    </el-tabs>
    <div class="com-live">
      <record-card
        ref="recordCard"
        v-show="tabComponent.name === 'record'"
        :name="tabComponent.name"
        :class="tabComponent.name"
        @jumpPrescription="jumpPrescription"
        @jump-to-recordHistory="jumpToRecordHistory"
      ></record-card>
      <record-history
        ref="recordHistory"
        v-show="tabComponent.name === 'recordHistory'"
        :name="tabComponent.name"
        :class="tabComponent.name"
        @createEmrByHistory="createEmrByHistory"
      ></record-history>
      <div
        class="height100"
        v-if="
          tabComponent.name !== 'record' &&
            tabComponent.name !== 'recordHistory'
        "
      >
        <!-- <keep-alive> -->
        <!-- <div class="height100">
          <component
            :is="item.component"
            ref="component"
            :name="item.name"
            @toolBoxsChange="toolBoxsChange"
            :class="item.name"
          ></component>
        </div> -->

        <component
          v-if="tabComponent.name == activeName"
          ref="component"
          :is="tabComponent.component"
          :name="tabComponent.name"
          :class="tabComponent.name"
          @toolBoxsChange="toolBoxsChange"
          @loadPatientData="loadPatientData"
          @updateBaseInfo="updateBaseInfo"
          @goMedicalRecord="goMedicalRecord"
        ></component>
        <!-- </keep-alive> -->
      </div>
    </div>
  </div>
</template>
<script>
// import { mapActions, mapGetters } from "vuex";
import recordHistory from "@/views/cis/prescriptionRecor/newPatientsManage/recordHistory/index.vue";
import allergyCard from "@/views/cis/prescriptionRecor/newPatientsManage/allergy/index.vue"; //过敏
import criticalCard from "@/views/cis/prescriptionRecor/newPatientsManage/criticalValue/index.vue"; //危急值
import diagnosisCard from "@/views/cis/prescriptionRecor/newPatientsManage/diagnosis/index.vue"; //诊断
import electronApplyCard from "@/views/cis/prescriptionRecor/newPatientsManage/elecApplications/index.vue"; //电子申请
import consultationCard from "@/views/cis/prescriptionRecor/newPatientsManage/groupConsultation/index.vue"; // 会诊
import leaveCard from "@/views/cis/prescriptionRecor/newPatientsManage/leaveApplication/components/main.vue"; //请假
import orderCard from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/nPrescriptionModule.vue"; //新版 电子处方
import reportCard from "@/views/cis/prescriptionRecor/newPatientsManage/reportCenter/index.vue"; //审核反馈
import recordCard from "@/views/cis/prescriptionRecor/newPatientsManage/record/components/record.vue"; //诊断（病历）
import rightTreatCard from "@/views/cis/prescriptionRecor/newPatientsManage/baidu/pageMain.vue"; //规范化治疗
import infectiousCard from "@/views/public/infectious/index.vue"; //报卡
import HealthFIleIframe from "@/views/cis/HealthFIleIframe/index.vue";

import { mapActions } from "vuex";

import cnfDictionaryService from "@/api/wconf/cnfDictionary.js";

export default {
  name: "tabWrapper",
  components: {
    recordHistory,
    allergyCard,
    criticalCard,
    diagnosisCard,
    electronApplyCard,
    consultationCard,
    leaveCard,
    orderCard,
    reportCard,
    rightTreatCard,
    infectiousCard,
    recordCard,
    HealthFIleIframe
  },
  data() {
    return {
      // cisPageParam:{},//页面跳转携带的参数
      activeName: "recordHistory",
      tabComponent: {},
      datas: [
        {
          name: "recordHistory",
          label: "就诊历史",
          component: null,
          resources: []
        },
        {
          name: "record",
          label: "门诊病历",
          component: null,
          resources: []
        },
        {
          name: "diagnosis",
          label: "诊断",
          component: "diagnosisCard",
          resources: []
        },
        // {
        //   name: "rightTreat",
        //   label: "规范化治疗",
        //   component: "rightTreatCard",
        //   resources: []
        // },
        {
          name: "order",
          label: "电子处方",
          component: "orderCard",
          resources: []
        },
        {
          name: "electronApply",
          label: "电子申请",
          component: "electronApplyCard",
          resources: []
        },
        // {
        //   name: "consultation",
        //   label: "会诊",
        //   component: "consultationCard",
        //   resources: []
        // },
        {
          name: "allergy",
          label: "过敏",
          component: "allergyCard",
          resources: []
        },
        /* {
          name: "critical",
          label: "危急值",
          component: "criticalCard",
          resources: []
        }, */
        {
          name: "leaveCard",
          label: "病假单",
          component: "leaveCard",
          resources: []
        },
        {
          name: "baoKa",
          label: "报卡",
          component: "infectiousCard",
          resources: []
        },
        {
          name: "HealthFIleIframe",
          label: "健康档案",
          component: "HealthFIleIframe",
          resources: []
        }
      ],
      tabOldName: ""
    };
  },
  created() {
    this.tabComponent = this.datas[0];
    this.getCdssCode();
  },
  mounted() {
    // console.log(`this.$route`, this.$route.query.flag);
    // if (this.$route.query.flag) {
    //   this.datas.push({
    //     name: "HealthFIleIframe",
    //     label: "健康档案",
    //     component: "HealthFIleIframe",
    //     resources: []
    //   });
    //   console.log(`this.datas`, this.datas);
    // }
  },
  provide() {
    return {
      tabName: () => this.tabOldName
    };
  },
  methods: {
    ...mapActions("cdss", ["setTabName", "setCdssCode"]),
    async getCdssCode() {
      console.log(`getCdssCode`);
      try {
        let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum || "";
        let res = await cnfDictionaryService.getDictionaryInfo({
          catalogCode: "CIS_OUTAPTIENT_PARAMS",
          dicCode: "CIS_OUTAPTIENT_CDSS",
          hosId
        });
        console.log(`res******`, res);
        if (res.code === 1) {
          // this.cisCheckApplyData = res.data;
          console.log(`getCdssCode----`, res.data);
          this.setCdssCode(res.data.dictionaryValue);
        }
      } catch (error) {
        console.log(`error12345678`, error);
      }
    },
    changeIframeUrl() {
      console.log(`changeIframeUrl`);
      this.activeName = "HealthFIleIframe";
      this.$nextTick(() => {
        // console.log(`this.$refs.component`, this.$refs.component.reset());
        this.$refs.component.reset();
      });
    },
    toolBoxsChange(boxsList) {
      this.$emit("toolBoxsChange", this.activeName, boxsList);
    },
    goMedicalRecord() {
      this.activeName = "record";
    },
    updateBaseInfo() {
      this.$emit("updateBaseInfo");
    },
    beforeLeave(item, a, b) {
      // console.log("item", item, a, b);
      var p = new Promise((resolve, reject) => {
        //电子申请 提示 跳转保存
        if (this.activeName == "electronApply") {
          let hasDatas = this.$refs.component.hasNewSlectList();
          //有未提交的 项目
          if (hasDatas) {
            this.$confirm(
              "当前页面有未提交项目，不提交将清除，是否提交？",
              "提示",
              {
                confirmButtonText: "是",
                cancelButtonText: "否",
                distinguishCancelAndClose: true,
                type: "warning"
              }
            )
              .then(async () => {
                try {
                  // 未提交的项目进行提交
                  await this.$refs.component.applicationSub();

                  // 你可以在这儿做些操作
                  this.handleClick(
                    this.datas.find(comObj => comObj.name == item)
                  );
                  resolve();
                } catch (error) {
                  reject();
                }
              })
              .catch(action => {
                console.log(action);
                if (action === "cancel") {
                  // 否跳转
                  this.handleClick(
                    this.datas.find(comObj => comObj.name == item)
                  );
                  resolve();
                } else {
                  // 停留在当前页面
                  reject();
                }
              });
          } else {
            this.handleClick(this.datas.find(comObj => comObj.name == item));
            resolve();
          }
        } else {
          this.handleClick(this.datas.find(comObj => comObj.name == item));
          resolve();
        }
      });

      return p;
    },
    jumpPrescription() {
      // 跳转到电子处方
      this.activeName = "order";
      // this.tabComponent = this.datas[2];
      this.handleClick({ name: "order" });
    },
    jumpToRecordHistory() {
      this.activeName = "recordHistory";
    },
    messageHandler(val) {
      //工具箱的透传数据
      // console.log("子组件 messageHandler");
      // console.log("子组件 执行了");
      // console.log(this.$refs.component);
      // debugger
      // let targetRef = this.$refs.component.find(item => {
      //   return item.$attrs.name === this.activeName;
      // });

      let targetRef = this.$refs.component;
      // console.log(targetRef);
      switch (this.activeName) {
        case "order":
          this.$nextTick(() => {
            try {
              targetRef.saveHandle();
            } catch (e) {}
          });
          break;
        case "diagnosis": //诊断页面
          this.$nextTick(() => {
            try {
              targetRef.messageHandler(val);
              this.$emit("loadPatientData");
            } catch (e) {}
          });
          break;
        case "electronApply": //电子申请
          this.$nextTick(() => {
            try {
              targetRef.messageHandler(val);
            } catch (e) {}
          });
          break;
      }
    },
    handleClick(tab) {
      this.tabComponent = this.datas.find(item => {
        return item.name === tab.name;
      });
      // if(tab.name === 'record') {
      //   this.$refs.recordCard.activeName = 'second'
      // }
      this.$emit("tab-change", tab);

      //诊断（病历）页面 tabs 切换需要重置页面
      this.$nextTick(() => {
        this.$refs.recordCard.resetDiagnostic();
      });
    },
    loadPatientData() {
      this.$emit("loadPatientData");
    },
    createEmrByHistory(params) {
      this.activeName = "record";
      this.tabComponent = this.datas[1];
      this.$refs.recordCard.updateEditor(params);
    }
  },
  watch: {
    // cisPageData : {
    //   deep:true,
    //   handler (obj){
    //     this.cisPageParam = obj.pageParams;
    //     this.activeName = obj.toPageName;
    //   }
    // }
    activeName(val, oldVal) {
      this.tabOldName = val;
      this.setTabName(val);
      $(".cdss-prescription-detail-wrap").hide();
      if (val === "record") {
        this.$nextTick(() => {
          document.getElementById("emrToolsToggle").click();
          this.$root.eventHub.$emit("recordResize");
        });
      }
      if (oldVal === "record") {
        console.log(`收起`);
        document.getElementById("emrToolsToggle").click();
      }
      // 向record 中传递
      // if (oldVal) {
      //   this.tabOldName = oldVal;
      // }
    }
  },
  computed: {
    // ...mapGetters("cis", ["cisPageData"]),
  }
};
</script>

<style scoped lang="scss">
.main-contain {
  display: flex;
  flex-direction: column;
  .com-live {
    flex: 1;
    height: 0;
  }
}
.tabsWrapper {
  /deep/.el-tabs__header {
    padding-left: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>
