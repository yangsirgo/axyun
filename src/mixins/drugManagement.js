import {
  mapActions
} from 'vuex'

// 混入药房药库更改选中药品信息，和右侧工具箱联动
export default {
  data() {
    return {
      mixinsCurrentDrugItem: {}
    }
  },
  methods: {
    ...mapActions({
      changeCurDrug: "drugManagement/changeDrug",
      changeCurPre: "drugManagement/changePre"
    }),
    // 修改当前选中的药品信息
    handleCurrentChange(val = {}) {
      this.mixinsCurrentDrugItem = val;
      // 中间页面带入科室名称
      let obj = {};
      if (this.recipeForm && this.recipeForm.deptName) {
        obj.deptName = this.recipeForm.deptName
      }
      this.changeCurDrug({
        ...val,
        ...obj
      });
      // 获取其他处方时需要患者id
      if (val && val.patientId) {
        this.changeCurPre({
          ...val,
          ...obj
        })
      }
    }
  },
  beforeDestroy() {
    // 销毁时清空数据
    this.changeCurDrug('');
    this.changeCurPre('');
  }
}
