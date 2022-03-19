<template>
  <el-card class="width100 height100">
    <div class="shotcut-wrapper" v-show="showShot.length > 0">
      <l-card-title>
        <template #left>
          <div>快捷方式</div>
        </template>
      </l-card-title>
      <div class="shotcut">
        <div class="shotcut-item-box" v-for="(item, index) in showShot" :key="'shotcut' + index">
          <router-link
            :to="item.path"
            class="cursor-pointer shotcut-item"
            :active-class="item.path ? 'router-link-active' : ''"
          >
            <i :class="['iconfont', item.icon]" />
            <p class="shotcut-name">{{ item.name }}</p>
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="multiView" class="multi-view">
      <router-link class="view-enter cursor-pointer" :to="multiPath[0]">
        <i class="iconfont iconpianyu"></i>
        <span>列表视图</span>
      </router-link>
      <router-link class="view-enter cursor-pointer" :to="multiPath[1]">
        <i class="iconfont iconpianyu"></i>
        <span>操作视图</span>
      </router-link>
    </div>
    <div :class="['position-relative', 'width100', mainHeight, 'overflow-hidden']">
      <slot></slot>
    </div>
  </el-card>
</template>
<script>
import { deepClone } from "@/utils/index.js";
import { mapGetters } from "vuex";

export default {
  props: {
    // 面板是否展开状态
    open: {
      type: Boolean,
      default: true
    },
    // 是否有多个视图
    multiPath: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(["permission_routes"]),
    multiView() {
      return this.multiPath.length == 2;
    },
    mainHeight() {
      const hg1 = this.showShot.length > 0 ? 115 : 0;
      const hg2 = this.multiView ? 75 : 0;
      const hg3 = hg1 + hg2;
      return `content-${hg3}`;
    }
  },
  data() {
    return {
      shotcuts: [
        /* {
          icon: "iconyuansuku",
          name: "患者充值",
          path: "",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "apptdoctor",
            "registrationOne",
            "cisOutpCharge",
            "cisRetreat",
            "cisReturnCharge",
            "cis_patientsList",
            "record",
            "groupConsultation",
            "cis_allergy",
            "criticalValue",
            "leaveApplication",
            "refund",
            "infusion"
          ]
        }, */
        /* {
          icon: "iconkaguashi",
          name: "卡挂失",
          path: "",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "apptdoctor",
            "cisOutpCharge",
            "cisRetreat",
            "cisReturnCharge",
            "cis_patientsList",
            "groupConsultation",
            "cis_allergy",
            "criticalValue",
            "leaveApplication",
            "refund",
            "infusion",
            "admApplication"
          ]
        }, */
        /* {
          icon: "iconbukahuanka",
          name: "补卡换卡",
          path: "",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "apptdoctor",
            "registrationOne",
            "cisOutpCharge",
            "cisRetreat",
            "cisReturnCharge",
            "cis_patientsList",
            "groupConsultation",
            "diagnosis",
            "cis_allergy",
            "criticalValue",
            "leaveApplication",
            "refund",
            "infusion",
            "admApplication"
          ]
        }, */
        {
          icon: "iconhuanzheyuyue",
          name: "患者预约",
          path: "/cisOne/appointTriage/apptdoctor",
          res: [
            "cisOutpCharge",
            "cisRetreat",
            "cisReturnCharge",
            "cis_patientsList",
            "record",
            "order",
            "elecApplications",
            "groupConsultation",
            "diagnosis",
            "cis_allergy",
            "criticalValue",
            "leaveApplication",
            "refund",
            "infusion",
            "admApplication"
          ]
        },
        /* {
          icon: "iconyuansuku",
          name: "财务日结",
          path: "",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "registrationOne",
            "cis_patientsList",
            "groupConsultation",
            "cis_allergy",
            "criticalValue",
            "leaveApplication",
            "refund",
            "infusion"
          ]
        }, */
        /* {
          icon: "iconbianjidangan",
          name: "编辑档案",
          path: "/patientMaster/recordCreate",
          res: []
        }, */
        {
          icon: "iconyuansuku",
          name: "患者档案",
          path: "/patientMaster/recordCreate",
          res: [
            "referral",
            "cis_allergy",
            "apptdoctor",
            "registrationOne",
            "cisOutpCharge",
            "cisRetreat",
            "cisReturnCharge",
            "record",
            "order",
            "elecApplications",
            "diagnosis",
            "admApplication",
            "clinicalPath",
            "signIn",
            "refund",
            "criticalValue"
          ]
        },
        {
          icon: "iconyuansuku",
          name: "患者挂号",
          path: "/cisOne/appointTriage/registrationOne",
          res: ["cisOutpCharge"]
        },
        {
          icon: "iconjichengbingli",
          name: "集成病历",
          path: "/cisOne/opIntegratedEmr/opIntroduction",
          res: [
            "record",
            "referral",
            "order",
            "elecApplications",
            "diagnosis",
            "cis_allergy",
            "criticalValue",
            "leaveApplication",
            "refund"
          ]
        },

        /* {
          icon: "iconyuansuku",
          name: "门诊日结",
          path: "",
          res: ["apptdoctor", "cisOutpCharge", "cisRetreat", "cisReturnCharge"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "医生排班",
          path: "",
          res: ["signIn", "precheckTriage", "triage"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "医生诊室关系维护",
          path: "",
          res: ["triage"]
        }, */
        {
          icon: "iconyuansuku",
          name: "病历",
          path: "/cisOne/cisThree/record",
          res: ["referral", "admApplication"]
        },
        {
          icon: "iconbinglichufang",
          name: "处方",
          path: "/cisOne/cisThree/order",
          res: ["referral", "admApplication", "preFeedback"]
        },
        {
          icon: "iconjiesuan",
          name: "结算",
          path: "/cisOne/settleAccount/cisOutpCharge",
          res: [
            "registrationOne",
            "signIn",
            "record",
            "apptdoctor",
            "temperature",
            "nursingdoc",
            "advexamine",
            "advedit",
            "drugapply",
            "drAdvexecute",
            "changeshifts",
            "transferbed",
            "allergy",
            "crisisval",
            "patientrecall",
            "refund",
            "criticalValue",
            "cis_allergy",
            "diagnosis",
            "elecApplications",
            "order"
          ]
        },
        {
          icon: "iconkanbaogao",
          name: "检查报告",
          path: "/cisOne/opIntegratedEmr/opTestReport",
          res: []
        },
        {
          icon: "iconkanbaogao",
          name: "检验报告",
          path: "/cisOne/opIntegratedEmr/opExamReport",
          res: []
        },
        {
          icon: "iconruyuanshenqing",
          name: "入院申请",
          path: "/cisOne/admApplication",
          res: []
        },
        /* {
          icon: "iconyuansuku",
          name: "患者360",
          path: "",
          res: ["referral"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "患者归档",
          path: "",
          res: []
        }, */
        {
          icon: "iconkanbaogao",
          name: "报告中心",
          path: "/cisOne/opIntegratedEmr/opTestReport",
          res: []
        },
        /* {
          icon: "iconyuansuku",
          name: "就诊历史",
          path: "",
          res: ["order", "elecApplications", "diagnosis"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "药品信息",
          path: "",
          res: ["order"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "排班查询",
          path: "",
          res: ["order", "diagnosis"]
        }, */
        /* 门诊-病历文书 */
        {
          icon: "iconyuansuku",
          name: "病历文书",
          path: "/cisOne/opIntegratedEmr/opMedicalRec",
          res: [
            "opIntroduction",
            "opMedicalRec",
            "opTestReport",
            "opExamReport"
          ]
        },
        /* 住院-病历文书 */
        {
          icon: "iconyuansuku",
          name: "病历文书",
          path: "/ipnw/ipIntegratedEmr/ipMedicalRecord",
          res: [
            "ipIntroduction",
            "ipMedicalRecord",
            "ipTestReport",
            "ipExamReport"
          ]
        },
        /* 门诊-电子申请 */
        {
          icon: "iconkaishenqing",
          name: "电子申请",
          path: "/cisOne/cisThree/elecApplications",
          res: [
            "opIntroduction",
            "opMedicalRec",
            "opTestReport",
            "opExamReport"
          ]
        },
        /* 住院-电子申请 */
        {
          icon: "iconkaishenqing",
          name: "电子申请",
          path: "/cisOne/cisThree/elecApplications",
          res: [
            "ipIntroduction",
            "ipMedicalRecord",
            "ipTestReport",
            "ipExamReport"
          ]
        },
        {
          icon: "icontianjiayizhu",
          name: "医嘱录入",
          path: "/ipnw/orderRecord/ipnw_order",
          res: [
            "ipIntroduction",
            "ipMedicalRecord",
            "ipTestReport",
            "ipExamReport"
          ]
        },
        {
          icon: "iconyuansuku",
          name: "处方录入",
          path: "/cisOne/cisThree/order",
          res: [
            "opIntroduction",
            "opMedicalRec",
            "opTestReport",
            "opExamReport"
          ]
        },
        /* 门诊-诊断录入 */
        {
          icon: "iconxiazhenduan",
          name: "诊断录入",
          path: "/cisOne/cisThree/record",
          res: [
            "opIntroduction",
            "opMedicalRec",
            "opTestReport",
            "opExamReport"
          ]
        },
        /* 住院-诊断录入 */
        {
          icon: "iconxiazhenduan",
          name: "诊断录入",
          path: "/ipnw/orderRecord/ipnw_diagnosis",
          res: [
            "ipIntroduction",
            "ipMedicalRecord",
            "ipTestReport",
            "ipExamReport"
          ]
        },
        /* {
          icon: "iconyuansuku",
          name: "诊间结算",
          path: "",
          res: [
            "opIntroduction",
            "opMedicalRec",
            "opTestReport",
            "opExamReport",
            "ipIntroduction",
            "ipMedicalRecord",
            "ipTestReport",
            "ipExamReport"
          ]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "出院召回",
          path: "/ipnw/leavehos/patientrecall",
          res: ["admRegistration"]
        }, */
        {
          icon: "iconyuansuku",
          name: "病区出院",
          path: "/ipnw/leavehos/inpatientarealeave",
          res: ["inpatientarealeave", "admRegistration"]
        },
        /* {
          icon: "iconyuansuku",
          name: "财务出院",
          path: "/ipnw/leavehos/inpatientarealeave",
          res: ["admRegistration"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "打印费用清单",
          path: "",
          res: ["inpatientarealeave","admRegistration"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "打印病历",
          path: "",
          res: ["inpatientarealeave","admRegistration"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "住院日结",
          path: "",
          res: ["inpatientarealeave", "patientrecall","admRegistration"]
        }, */
        {
          icon: "icontiwendan",
          name: "批量录入体温单",
          path: "/ipnw/nursing/temperature",
          res: ["arrangebed", "changeBed", "contractbed"]
        },
        /* {
          icon: "iconyuansuku",
          name: "入院评估",
          path: "",
          res: ["arrangebed", "contractbed"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "生命体征",
          path: "",
          res: [
            "arrangebed",
            "contractbed",
            "temperature",
            "nursingdoc",
            "advexamine",
            "advedit",
            "drugapply",
            "drAdvexecute",
            "changeshifts",
            "transferbed",
            "allergy",
            "crisisval",
            "ipnw_patientList",
            "ipnw_diagnosis",
            "ipnw_order",
            "ipnw_elecAppli",
            "ipnw_record",
            "ipnw_allergy",
            "ipnw_criticalValue",
            "ipnw_groupConsultation"
          ]
        }, */
        {
          icon: "iconyuansuku",
          name: "护理文书",
          path: "/ipnw/nursing/nursingdoc",
          res: [
            "arrangebed",
            "contractbed",
            "changeBed",
            "temperature",
            "nursingdoc",
            "advexamine",
            "advedit",
            "drugapply",
            "drAdvexecute",
            "changeshifts",
            "transferbed",
            "allergy",
            "crisisval"
          ]
        },
        {
          icon: "iconyizhuzhihang",
          name: "医嘱执行",
          path: "/ipnw/nursing/drAdvexecute",
          res: [
            "arrangebed",
            "changeBed",
            "contractbed",
            "temperature",
            "nursingdoc",
            "advexamine",
            "advedit",
            "drugapply",
            "drAdvexecute",
            "changeshifts",
            "transferbed",
            "allergy",
            "crisisval"
          ]
        },
        {
          icon: "iconyuansuku",
          name: "交接班",
          path: "/ipnw/nursing/changeshifts",
          res: [
            "arrangebed",
            "contractbed",
            "changeBed",
            "temperature",
            "nursingdoc",
            "advexamine",
            "advedit",
            "drugapply",
            "drAdvexecute",
            "changeshifts",
            "transferbed",
            "allergy",
            "crisisval"
          ]
        },
        {
          icon: "iconyizhushenhe",
          name: "医嘱审核",
          path: "/ipnw/nursing/advexamine",
          res: [
            "temperature",
            "advexamine",
            "advedit",
            "drugapply",
            "drAdvexecute",
            "changeshifts",
            "transferbed",
            "allergy",
            "crisisval"
          ]
        },
        {
          icon: "iconkanbaogao",
          name: "报告查看",
          path: "/ipnw/ipIntegratedEmr/ipTestReport",
          res: [
            "ipnw_patientList",
            "ipnw_diagnosis",
            "ipnw_order",
            "ipnw_elecAppli",
            "ipnw_record",
            "ipnw_allergy",
            "ipnw_criticalValue",
            "ipnw_groupConsultation"
          ]
        },
        {
          icon: "iconjibenxinxi",
          name: "报卡",
          path: "/cisOne/infectious",
          res: [
            "signIn",
            "referral",
            "record",
            "order",
            "elecApplications",
            "diagnosis",
            "cis_allergy",
            "criticalValue",
            "leaveApplication",
            "refund"
          ]
        },
        {
          icon: "iconzhiliao",
          name: "治疗",
          path: "/cisOne/treatment/infusion",
          res: ["signIn"]
        },
        /* {
          icon: "iconyuansuku",
          name: "费用查询",
          path: "",
          res: [
            "ipnw_patientList",
            "ipnw_diagnosis",
            "ipnw_order",
            "ipnw_elecAppli",
            "ipnw_record",
            "ipnw_allergy",
            "ipnw_criticalValue",
            "ipnw_groupConsultation"
          ]
        }, */
        {
          icon: "iconruyuanguanli",
          name: "入院登记",
          path: "/ipnw/hosMange/admRegistration",
          res: ["inpatientarealeave", "admApplication"]
        },
        /* {
          icon: "iconyuansuku",
          name: "交预交金",
          path: "",
          res: ["inpatientarealeave"]
        }, */
        /* {
          icon: "iconyuansuku",
          name: "停医嘱",
          path: "",
          res: []
        }, */
        {
          icon: "iconyuansuku",
          name: "预出院",
          path: "/ipnw/leavehos/inpatientarealeave",
          res: ["patientrecall"]
        },
        /* {
          icon: "iconzhanghaoxinxi",
          name: "账户信息",
          path: "/patientMaster/account",
          res: []
        }, */
        {
          icon: "iconyuyuefenzhen",
          name: "预约分诊",
          path: "/cisOne/appointTriage/apptdoctor",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "account"
          ]
        },
        {
          icon: "iconbinglichufang",
          name: "病历处方",
          path: "/cisOne/cisThree/record",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "account"
          ]
        },
        {
          icon: "iconruyuanguanli",
          name: "入院管理",
          path: "/ipnw/hosMange/admRegistration",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "account"
          ]
        },
        {
          icon: "iconhuli",
          name: "护理",
          path: "/ipnw/nursing/temperature",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "account"
          ]
        },
        {
          icon: "iconbingliyizhu",
          name: "病历医嘱",
          path: "/ipnw/orderRecord/ipnw_patientList",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "account"
          ]
        },
        {
          icon: "iconchuyuanguanli",
          name: "出院管理",
          path: "/ipnw/leavehos/inpatientarealeave",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "account"
          ]
        },
        {
          icon: "iconyaokukucunqingkuang",
          name: "药房药库",
          path: "/drugManagement/drugstock/drugPurchase",
          res: [
            "recordCreate",
            "treatmentInfo",
            "costs",
            "ehr",
            "cardsRecord",
            "account"
          ]
        },
        {
          icon: "iconyaokukucunqingkuang",
          name: "退费申请",
          path: "/cisOne/cisThree/refund",
          res: ["preFeedback"]
        }
      ],
      showShot: [],
      roleMenu: []
    };
  },
  created() {
    this.reList();
  },
  methods: {
    // 根据当前路由筛选快捷方式
    reList() {
      let menu = deepClone(this.permission_routes);
      // 获取所有路由
      this.roleMap(menu);

      const rpath = this.$route.path.split("/");
      const lpath = rpath[rpath.length - 1];
      const arr = this.shotcuts.filter(item => {
        return item.res.includes(lpath) && this.roleMenu.includes(item.path);
      });
      this.showShot = arr;
    },
    // 递归获取没有子菜单的path
    roleMap(obj) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        if (item.children) {
          this.roleMap(item.children);
        } else {
          this.roleMenu.push(item.path);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// 修改快捷方式title样式
.cardtitle {
  height: 25px;
  line-height: 25px;
  /deep/ .titleleft::before {
    margin-top: 0px;
  }
}

.shotcut-wrapper {
  width: 100%;
  height: 115px;
  border-bottom: 1px solid $l-color-bgcolor-11;
  padding: 10px;
  .shotcut {
    height: 74px;
    padding-top: 10px;
    margin: 0 -2.5px;
    overflow-y: auto;
    .shotcut-item-box {
      float: left;
      width: 25%;
      padding: 2.5px;
    }
    .shotcut-item {
      display: block;
      width: 100%;
      height: 58px;
      border-radius: 4px;
      background: $l-color-bgcolor-18;
      text-align: center;
      color: $l-color-primary;
      padding-top: 12px;
      font-size: 12px;
    }
    .shotcut-name {
      margin-top: 5px;
      color: $l-color-fontcolor-3;
      font-size: 10px;
    }
    .router-link-active {
      color: $l-color-white;
      background: $l-color-primary;
      .shotcut-name {
        color: $l-color-white;
      }
    }
  }
}

.multi-view {
  height: 76px;
  line-height: 76px;
  border-bottom: 1px solid $l-color-bgcolor-11;
  padding: 0 20px;
  .view-enter {
    width: 118px;
    height: 36px;
    border-radius: 4px;
    line-height: 36px;
    text-align: center;
    background: $l-color-bgcolor-11;
    float: left;
    margin-top: 20px;
    &:first-of-type {
      margin-right: 9px;
    }
  }
  .router-link-active {
    color: $l-color-white;
    background: $l-color-primary;
  }
}
.content-190 {
  height: calc(100% - 190px);
}
.content-115 {
  //padding-top: 10px;
  height: calc(100% - 115px);
}
.content-0 {
  height: 100%;
}
</style>
