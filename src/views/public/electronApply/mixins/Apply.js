import {
  getListByAdviceCategoryDetai
} from "@/api/systemManagement/dataMaintain/adviceItem";

export default {
  /**
   * 1.请求目录树详细数据(getDetails){请求目录树详细数据并将数据插入目录树中}
   * 2.为目录树数据增加是否懒加载(forCircleDataInit){请为目录树数据增加是否懒加载}
   * 3.为目录树数据增加是否懒加载(forCircleData){请为目录树数据增加是否懒加载}
   */
  methods: {
    //请求详细数据
    async getDetails(res) {
      if (!res.length) {
        return;
      }
      let items = "";
      for (let i in res) {
        if (res[i].itemId === undefined) {
          continue;
        }
        if (!items) {
          items = res[i].itemId || "";
        } else {
          items = items + "," + (res[i].itemId || "");
        }
      }
      if (items === "") {
        return;
      }
      try {
        let detailsRes = await getListByAdviceCategoryDetai({
          itemIds: items
        });
        if (detailsRes.code === 1 && detailsRes.data.length) {
          for (let i in res) {
            if (res[i].hasOwnProperty("itemId")) {
              this.$set(res, i, {
                ...res[i],
                adviceItemJson: detailsRes.data[i]
              });
              await this.forCircleData(this.treedata, res[i].itemId, item => {
                item = {
                  ...item,
                  adviceItemJson: detailsRes.data[i]
                };
              });
            }
          }
          return res;
        }
      } finally {
        return res;
      }
    },
    async forCircleDataInit(list, level) {
      for (let i in list) {
        list[i].level = level;
        if (level <= 2) {
          list[i].leaf = false;
        } else if (level > 2) {
          if (list[i].hasOwnProperty("children") && list[i].children.length) {
            list[i].leaf = false;
          } else {
            list[i].leaf = true;
          }
        }
        if (list[i].hasOwnProperty("children") && list[i].children.length) {
          level++;
          await this.forCircleDataInit(list[i].children, level);
        }
      }
    },
    async forCircleData(list, itemId, fn) {
      for (let i in list) {
        if (list[i].hasOwnProperty("itemId") && list[i].itemId == itemId) {
          fn(list[i]);
        } else if (
          list[i].hasOwnProperty("children") &&
          list[i].children.length
        ) {
          await this.forCircleData(list[i].children, itemId, fn);
        }
      }
    },
    //获取默认当前时间
    getNowFormatDate() {
      return this.dayjs().format("YYYY-MM-DD HH:mm:ss");
    }
  }
}
