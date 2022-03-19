<template>
  <div class="pop-table">
    <el-popover
      placement="bottom"
      :width="popoverWidth"
      trigger="click"
      :value="showTableFlag"
    >
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        v-loading="tableLoading"
        element-loading-text="列表正在加载中"
        height="300"
      >
        <el-table-column
          class="overflow-point"
          header-align="center"
          v-for="(item, index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :fixed="item.fixed === true"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'operate'">
              <span class="return-cost" @click="returnCost()">撤销</span>
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <span slot="reference" class="return-num">{{ value }}</span>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    popoverWidth: {
      type: Number,
      default: 400
    },
    value: {
      type: Number,
      default: 0,
      required: true
    },
    tableData: {
      type: Array,
      default: [],
      required: true
    },
    tableParams: {
      type: Array,
      default: [],
      required: true
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    showTableFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchTimer: null
    };
  },
  methods: {
    returnCost() {}
  }
};
</script>
<style lang="scss" scoped>
.pop-table {
  .return-cost {
    color: $l-color-primary;
    cursor: pointer;
  }
  .return-num {
    color: #3d7dfb;
    cursor: pointer;
  }
}
</style>
