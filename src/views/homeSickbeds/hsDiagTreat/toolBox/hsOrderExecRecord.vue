<template>
  <div class="page">
    <l-card-title class="card-title">
      <template slot="left">家床待办</template>
    </l-card-title>
    <div class="main-box">
      <el-collapse
        v-model="activeNames"
        accordion
        @change="listChange"
      >
        <l-collapse-item
          sty="2"
          v-for="(item, index) in listData"
          :key="'list' + index"
          :name="index"
        >
          <template slot="title">
            <div :title="item.tempName">
              <span>{{ item.tempName }}</span>
            </div>
          </template>
          <template slot="content">
            <div>
              <div class="filter-box">
                <l-formt-title label="执行时间">
                  <el-date-picker
                    style="width:100%"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model="item.filterTime"
                    type="daterange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  ></el-date-picker>
                </l-formt-title>
                <el-button
                  type="primary"
                  plain
                  class="btn"
                  @click="search(item)"
                >查询</el-button>
                <el-button
                  plain
                  class="btn"
                  @click="execute(item)"
                >执行</el-button>
              </div>
              <div class="main-table">
                <el-table
                  :data="item.list"
                  ref="resourceTable"
                  @select-all="handleSelection"
                  @select="handleSelection"
                  :row-key="getRowKeys"
                >
                  <el-table-column
                    type="selection"
                    width="32"
                  ></el-table-column>
                  <el-table-column
                    prop="status"
                    label="状态"
                    width="100px"
                    header-align="center"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="code"
                    label="要求执行时间"
                    width="180"
                  ></el-table-column>
                  <el-table-column
                    prop="execTime"
                    label="执行时间"
                    width="180"
                  ></el-table-column>
                  <el-table-column
                    prop="stopDoctor"
                    label="停止医生"
                    width="180"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </template>
        </l-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      activeNames: 0,
      listData: [
        {
          tempName: 11111,
          list: [
            {
              filterTime: "",
              stopDoctor: "账单"
            }
          ]
        }
      ]
    };
  },
  components: {},
  methods: {
    listChange() {},
    search() {},
    execute() {}
  }
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  min-width: 434px;
  flex-direction: column;
  .main-box {
    flex: 1;
    /deep/.el-collapse-item__content {
      padding-left: 0;
    }
  }
}
</style>
