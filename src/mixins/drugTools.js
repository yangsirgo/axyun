import hmmBaseApi from "@/api/hmm/base";

export default {
  data() {
    return {
      drugStorageList: [],
      drugStorageData: {}
    }
  },
  created() {
    this.getDrugStarage();
  },
  methods: {
    getDrugStarage() {
      hmmBaseApi
        .getDrugStorage('0,1')
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = res.data;
            let obj = {};
            res.data.forEach(element => {
              obj[element.code] = element.name
            });
            this.drugStorageData = obj;
            obj = null;
          }
        })
        .catch();
    }
  }
}
