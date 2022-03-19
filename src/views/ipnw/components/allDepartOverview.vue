<template>
  <div>
    <div class="main">
      <el-collapse v-loading="loading">
        <div class="collItem" v-for="(item,index) in dataList" :key="index">
          <div class="badge">{{item.departDetail.length}}</div>
          <el-collapse-item :title="item.depart">
            <div v-for="(item2,index2) in item.departDetail" :key="index2">{{item2.detailContent}}</div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [
        {
          depart: "财务入院",
          departDetail: [
            { detailContent: "病人信息1" },
            { detailContent: "病人信息2" },
            { detailContent: "病人信息3" }
          ]
        },
        {
          depart: "病区入院",
          departDetail: [{ detailContent: "病人信息1" }]
        }
      ],
      loading: false
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.main {
  overflow-y: auto;
  .collItem {
    position: relative;
    .badge {
      position: absolute;
      right: 25px;
      top: 14px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: $l-color-primary;

      font-size: 12px;
     
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 18px;
      text-align: center;
      z-index: 20;
    }
    .el-collapse-item {
      z-index: 10;
    }
  }
}
</style>