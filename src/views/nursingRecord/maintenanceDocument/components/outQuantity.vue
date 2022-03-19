<template>
  <div class="outQuantityDialog">
    <div class="table-cont">
      <el-table
        ref="multiTable"
        :data="outTableData"
        width="100%"
        stripe
        border
      >
        <el-table-column
          v-for="(item, index) in outTableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          min-width="80"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <template
              v-if="
                item.elementBaseName == '文本元素' ||
                  item.elementBaseName == '数字元素'
              "
            >
              <el-input
                v-model="scope.row[item.prop]"
                class="width100"
              ></el-input>
            </template>
            <template v-else-if="item.elementBaseName == '单选下拉元素' || item.elementBaseName == '多选下拉元素'">
              <el-select
                v-model="scope.row[item.prop]"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(val, key) in item.valueLst"
                  :key="key"
                  :label="val.vMean"
                  :value="val.vMean"
                >
                </el-option>
              </el-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="150"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="addItem(scope.row, scope.$index)"
              >添加</el-button
            >
            <el-button type="text" @click="deleteItem(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="button-cont clearfix">
      <el-button class="float-right" type="primary" @click="confirm"
        >确定</el-button
      >
      <el-button
        class="float-right"
        style="margin-right: 10px"
        type="primary"
        plain
        @click="cancel"
        >取消</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "outQuantity",
  props: ["outTableParams", "outTableDataProp"],
  data() {
    return {
      outTableData: [{}]
    };
  },
  watch: {
    outTableDataProp: {
      handler(n) {
        this.outTableData = [{}];
        if (n && n.length) {
          this.outTableData = [...n];
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // console.log(this.outTableParams, this.outTableData, 245);
  },
  methods: {
    //添加
    addItem(item, index) {
      this.$set(this.outTableData, this.outTableData.length, {});
    },
    //删除
    deleteItem(item, index) {
      this.$delete(this.outTableData, index);
    },
    //确定
    confirm() {
      this.$emit("confirmOut", this.outTableData);
    },
    //取消
    cancel() {
      this.$emit("cancelOut", true);
    }
  }
};
</script>

<style scoped lang="scss">
.outQuantityDialog {
  .table-cont {
    padding: 20px;
  }

  .button-cont {
    padding: 20px;
  }
}
</style>
