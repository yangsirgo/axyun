import service from "@/api/wconf/cnfDictionary.js"

export default {
  data() {
    return {
      // 医嘱分类数据
      firstCategoryCodeOptions: [{
        dictionaryValue: "",
        dictionaryName: "未分类"
      }]
    }
  },
  methods: {
    async getFirstCategoryCodeOptions(params, fn) {
      try {
        let res = await service.getDictionaryPOs(params);
        if (res.code === 1) {
          this.firstCategoryCodeOptions = res.data;
          fn && fn();
        }
      } catch (error) {}
    }
  }
}
