
import copyOrder from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/orderReference/index.vue";
import CisValueDomain from "@/views/cis/components/CisValueDomain.vue";
import directives from "@/components/adviceCommon/adviceDirectives.js"
import filters from "@/components/adviceCommon/adviceFilters.js"
import lInputNumber from "@/components/adviceCommon/lInputNumber.vue"
import doctorPsReview from "@/components/adviceCommon/modules/doctorPsReview.vue";
import orderTotalShow from "@/components/adviceCommon/modules/orderTotalShow.vue";
// import disSelectShow from "@/components/adviceCommon/modules/diseaseSelect/disSelectShow.vue";

export let mixins = {
  filters: {
    ...filters,
    ...{
      
    }
  },
  directives,
  components: {
    copyOrder,
    orderTotalShow,
    doctorPsReview,
    lInputNumber,
    // disSelectShow,
    CisValueDomain
  }
}
