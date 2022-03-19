<template>
    <div>
      <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%">
        <el-table-column prop="groupName" label="组合名称" width="185"></el-table-column>
        <el-table-column label="选择" prop="select" type="selection" width="55"></el-table-column>
        <el-table-column prop="chargeItemName" label="医嘱名称" width="220"></el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
        name: "applyItem",
        data() {
            return {
                tableData: [],
                spanArr: []

            }
        },
        created() {
            this.tableData = [
                {
                    "groupId": '1',
                    "groupName": '血常规',
                    "chargeItemName": '血常规'
                },
                {
                    "groupId": '1',
                    "groupName": '血常规',
                    "chargeItemName": '超敏C反应蛋白'
                }, {
                    "groupId": '1',
                    "groupName": '血常规',
                    "chargeItemName": '嗜酸性粒细胞直接计数'
                },
                {
                    "groupId": '1',
                    "groupName": '血常规',
                    "chargeItemName": '异常细胞形态检测'
                },
                {
                    "groupId": '2',
                    "groupName": '入院三大常规',
                    "chargeItemName": '血常规'
                },
                {
                    "groupId": '2',
                    "groupName": '入院三大常规',
                    "chargeItemName": '尿常规'
                },
                {
                    "groupId": '2',
                    "groupName": '入院三大常规',
                    "chargeItemName": '大便常规'
                }

            ];
            this.getSpanArr(this.tableData, "groupId")
        },
        methods: {
            // eslint-disable-next-line consistent-return
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                var self = this;
                if (columnIndex === 0) {
                    const _row = self.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },

            getSpanArr(data, colName) {
                var self = this;
                self.spanArr = [];
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        self.spanArr.push(1);
                        this.pos = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i][colName] === data[i - 1][colName]) {
                            self.spanArr[this.pos] += 1;
                            self.spanArr.push(0);
                        } else {
                            self.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            },
            getLabItem(type){
                console.log('getLabItem:', type);
            }
        }
    }
</script>

<style scoped>

</style>
