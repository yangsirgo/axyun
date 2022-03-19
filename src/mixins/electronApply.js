export default {
  methods: {
    formatCheckList(row) {
      // el-table 合并单元格，checkbox勾选有问题，需要重新整理数据
      let list = JSON.parse(JSON.stringify(row));
      let arr = [];
      row.forEach(item => {
        // 对相同id不触发
        if (arr.indexOf(item.id) === -1) {
          arr.push(item.id);
          // 获取当前id在table里的第一条
          let tableItem = this.orderTable.find(ele => ele.id === item.id);
          let listIdArr = row.map(ele => ele.chargeItemId);
          // 清空当前同组项
          list = list.filter(ele => ele.id !== item.id);
          // 选中的列表里没有第一个，则表示取消
          if (listIdArr.indexOf(tableItem.chargeItemId) !== -1) {
            // 获取表格中相同的id项
            let data = this.orderTable.filter(ele => ele.id === item.id);
            list = list.concat(data);
          }
        }
      });
      return list;
    }
  }
}
