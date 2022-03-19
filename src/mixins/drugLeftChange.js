import {
  mapActions
} from 'vuex'

// 混入药房药库更改选中药品信息，和右侧工具箱联动
export default {
  methods: {
    ...mapActions({
      changeItem: "drugManagement/changeItem"
    }),
    // 修改当前选中的信息
    changeLeftItemData(val = {}) {
      this.changeItem(val)
    },
    //列表排序
    listsort(val) {
      let str = this.orderBy.split(" ");
      if (str.length === 1) {
        this.orderBy = val + " DESC";
      } else {
        this.orderBy = val;
      }
      this.search(0);

    }
  }
}
