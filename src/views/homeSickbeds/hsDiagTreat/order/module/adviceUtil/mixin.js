import lInputNumber from "@/components/adviceCommon/lInputNumber.vue";
import directives from "@/components/adviceCommon/adviceDirectives.js"
import filters from "@/components/adviceCommon/adviceFilters.js"

export let mixins = {
  filters: {
    ...filters,
    ...{
      filterProperty(value) {
        return value == 1 ? "长期" : "临时";
      },
      checkboxShowText(value) {
        return value == 1 ? "是" : "否";
      }
    }
  },
  directives,
  components: {
    lInputNumber
  }
}
