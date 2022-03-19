import { getListByAdviceCategoryDetai } from "@/api/systemManagement/dataMaintain/adviceItem";
import { getByTypeAndName } from "@/api/cis/toolBox/toolBox";
import { mapActions } from "vuex";

export default {
  created() {
    this.loadGeRenTable();
    this.loadTable();
  },
  /**
   * getDetails (获取当前已选检查申请的数据)
   *
   * getNowFormatDate （获取当前格式化后的时间）
   *
   * forCircleDataInit （递归处理函数，处理目录树数据）
   *  loadGeRenTable （加载个人数据模板）
   *
   * loadTable （加载模板数据）
   */
  methods: {
    ...mapActions("cdss", ["setCheckList"]),
    //zhengyawen 请求详细数据
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
        let { code, data } = await getListByAdviceCategoryDetai({
          itemIds: items
        });
        if (code === 1 && data.length) {
          for (let i in res) {
            if (res[i].hasOwnProperty("itemId")) {
              this.$set(res, i, {
                ...res[i],
                adviceItemJson: data[i]
              });
              await this.forCircleData(this.treedata, res[i].itemId, item => {
                item = {
                  ...item,
                  adviceItemJson: {
                    ...data[i]
                  }
                };
              });
            }
          }
          return res;
        }
      } finally {
        console.log("res1111111111111111", res);
        this.setCheckList(res);
        return res;
      }
    },
    //获取默认当前时间
    getNowFormatDate() {
      return this.dayjs().format("YYYY-MM-DD HH:mm:ss");
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
    // 加载geren模板数据
    async loadGeRenTable() {
      try {
        let params = {
          type: 2, // 1科室 2个人
          itemCat: 5,
          name: "",
          pageNum: 1,
          pageSize: 200
        };
        let { pageNo, data } = await getByTypeAndName(params);
        data.forEach(item => {
          item.itemName = item.templetName;
        });
        if (pageNo === 1) {
          this.gerenTemList = data;
          console.log("加载科室模板数据", data);
        } else {
          this.gerenTemList = this.gerenTemList.concat(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 加载科室模板数据
    async loadTable() {
      try {
        let params = {
          type: 1, // 1科室 2个人
          itemCat: 5,
          name: "",
          pageNum: 1,
          pageSize: 200
        };
        let { data, pageNo } = await getByTypeAndName(params);
        data.forEach(item => {
          item.itemName = item.templetName;
        });
        if (pageNo === 1) {
          this.keshiTemList = data;
          console.log("加载科室模板数据", data);
        } else {
          this.keshiTemList = this.keshiTemList.concat(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
