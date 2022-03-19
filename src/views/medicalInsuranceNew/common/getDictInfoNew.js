import {
  getAllDictInfo
} from "@/api/medicalInsurance/index.js";
import {
  getDataFrom
} from "@/api/medicalInsuranceNew/index.js";
import healthInsuranceService from "@/api/healthInsurance/index.js";

import {
  deepClone
} from "@/utils";

import {
  mapGetters,
  mapActions
} from "vuex";
export default {
  data() {
    return {
      isGetAllDictInfo: false,
      currentDictInfoNew: [],
      outpSpecialOptions: [],
      outpSpecialQuickOptions: [],
      payperDiseOptions: [],
      daySurgeryFindOptions: []
    }
  },
  watch: {
    dictInfoNew: {
      async handler(val) {
        if ((!val || !val.length) && !this.isGetAllDictInfo) {
          await this.getAllDictInfo("watch");
        }
      },
      deep: true,
      immediate: true
    },
    outpSpecialOptions: {
      async handler(val) {
        if (val && val.length) {
          this.getQuikDiseaseCode();
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters("medicalInsuranceNew", ["dictInfoNew", "commonData"]),
  },
  methods: {
    ...mapActions({
      changeDictInfoNew: "medicalInsuranceNew/changeDictInfoNew",
      changeCommonData: "medicalInsuranceNew/changeCommonData",
    }),
    async getAllDictInfo(a) {
      await getAllDictInfo({
        medicareType: "02"
      }).then(res => {
        this.isGetAllDictInfo = true;
        this.currentDictInfoNew = res.data;

        if (res.data && res.data.length) {
          this.changeDictInfoNew(res.data);
        }
      });
    },
    getDictNew(code) {
      let dictInfo = this.getDataFromFuc(code);
      return dictInfo;
    },
    transformNew(code, val) {
      let dictInfo = this.dictInfoNew;
      let currDictInfo = [];
      for (let i in dictInfo) {
        if (dictInfo[i].dictCatalogCode === code) {
          currDictInfo = dictInfo[i].dictVOS;
          break;
        }
      }
      for (let j in currDictInfo) {
        if (currDictInfo[j].dictCode == val) {
          return currDictInfo[j].dictName;
        }
      }
      return val;
    },
    async getDataFromFuc(code) {
      return await new Promise(async (resolve, reject) => {
        if (this.dictInfoNew.length) {
          let dictInfo = this.dictInfoNew;
          let arr = [];
          dictInfo.map(item => {
            if (item.dictCatalogCode == code) {
              arr = item.dictVOS;
              return;
            }
          });
          resolve([...arr]);
        } else {
          let res = await getDataFrom(code);
          resolve(res.data);
        }
      });
    },
    /* 医保的一些基础数据 */
    // 获取特慢病数据
    async getOutpSpecial() {
      if (this.commonData.hasOwnProperty("outpSpecialOptions") && this.commonData.outpSpecialOptions.length) {
        this.outpSpecialOptions = deepClone(this.commonData.outpSpecialOptions);
        return;
      }
      try {
        let params = {
          // cateNum: "1309",
          cateName: "",
          pageNo: "1",
          pageSize: "999"
        };
        let res = await healthInsuranceService.getOutpSpecial(params);
        if (res.code === 1) {
          this.outpSpecialOptions = res.data;
          this.changeCommonData({
            ...this.commonData,
            outpSpecialOptions: deepClone(res.data)
          });
        }
      } catch (error) {}
    },
    // 获取高血压跟糖尿病数据
    getQuikDiseaseCode() {
      let ylOption = this.outpSpecialOptions;
      let arr = ylOption.filter(item => {
        return item.mmmtbzmc == "高血压病" || item.mmmtbzmc == "糖尿病";
      });
      this.outpSpecialQuickOptions = arr;
    },
    // 结算病种数据
    async getPayperDise(fn) {
      if (this.commonData.hasOwnProperty("payperDiseOptions") && this.commonData.payperDiseOptions.length) {
        this.payperDiseOptions = deepClone(this.commonData.payperDiseOptions);
        fn && fn(deepClone(this.commonData.payperDiseOptions));
        return;
      }
      try {
        let params = {
          // cateNum: "1310",
          cateName: "",
          pageNo: "1",
          pageSize: "999"
        };
        let res = await healthInsuranceService.getPayperDise(params);
        if (res.code === 1) {
          this.changeCommonData({
            ...this.commonData,
            payperDiseOptions: deepClone(res.data)
          })
          this.payperDiseOptions = res.data;
          fn && fn(res.data);
        }
      } catch (error) {}
    },
    // 日间手术病种
    async daySurgeryFind(fn) {
      if (this.commonData.hasOwnProperty("daySurgeryFindOptions") && this.commonData.daySurgeryFindOptions.length) {
        fn && fn(deepClone(this.commonData.daySurgeryFindOptions));
        return;
      }
      try {
        let params = {
          pageNo: "1",
          pageSize: "999",
        };
        let res = await healthInsuranceService.daySurgeryFind(params);
        if (res.code === 1) {
          this.changeCommonData({
            ...this.commonData,
            daySurgeryFindOptions: deepClone(res.data)
          })
          this.daySurgeryFindOptions = res.data;
          fn && fn(res.data);
        }
      } catch (error) {}
    },
    // 手术类别
    async operationFind(fn) {
      if (this.commonData.hasOwnProperty("operationFindOptions") && this.commonData.operationFindOptions.length) {
        fn && fn(deepClone(this.commonData.operationFindOptions));
        return;
      }
      try {
        let params = {
          pageNo: "1",
          pageSize: "20000",
          // pageSize: "999",
        };
        let res = await healthInsuranceService.operationFind(params);
        if (res.code === 1) {
          this.changeCommonData({
            ...this.commonData,
            operationFindOptions: deepClone(res.data)
          })
          fn(res.data);
        }
      } catch (error) {}
    },
    // 诊断
    async diseandDiagFind(fn) {
      if (this.commonData.hasOwnProperty("diseandDiagFindOptions") && this.commonData.diseandDiagFindOptions.length) {
        fn && fn(deepClone(this.commonData.diseandDiagFindOptions));
        return;
      }
      try {
        let params = {
          pageNo: "1",
          pageSize: "40000",
          // pageSize: "999",
        };
        let res = await healthInsuranceService.diseandDiagFind(params);
        if (res.code === 1) {
          this.changeCommonData({
            ...this.commonData,
            diseandDiagFindOptions: deepClone(res.data)
          })
          fn && fn(res.data);
        }
      } catch (error) {}
    },
  }
}
