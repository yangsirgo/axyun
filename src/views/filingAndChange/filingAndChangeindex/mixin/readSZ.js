import {
  getPagemd
} from "@/api/medicalInsurance/index.js";

export default {
  data() {
    return {
      oldInsurence: false, //是否显示旧组件
      newInsurence: false, //是否显示新组件
      synchNewLoading: false, //按钮loading
    }
  },
  created() {
    this.getPagemd()
  },
  methods: {
    async getPagemd() {
      try {
        let res = await getPagemd();
        if (res.code === 1) {
          for (let i in res.data) {
            if (res.data[i].dictCode == "01") {
              this.oldInsurence = true;
            } else if (res.data[i].dictCode == "02") {
              this.newInsurence = true;
            }
          }
        }

      } catch (error) {}
    },
    async cardInfoNewHandler(data) {},
    async patientInsurenceData(data) {
      if (!data.hasOwnProperty("siPatientDto")) return;
      if (this.synchNewLoading) return;
      this.synchNewLoading = true;
      try {
        let submitData = this.formatSubmitteData();
        await this.getInitSiPatientInfo({
            ...submitData,
            siPatientDto: data.siPatientDto
        });
      } catch (error) {} finally {
        this.synchNewLoading = false;
      }
    }
  }
}
