<template>
  <!-- <el-card class="box-card"> -->
  <!-- <div class="header">
      <span class="title">我的代办</span>
      <el-button class="button inactive" type="text">审</el-button>
      <el-button class="button active" round>申</el-button>
  </div>-->
  <portlet :title="title" :buttons="buttons" @buttonclick="buttonChange">
    <el-table
      :data="tableData"
      :show-header="true"
      :border="true"
      style="width: 100%"
      :header-cell-style="{background:'rgba(247,248,250,1)'}"
    >
      <el-table-column prop="title" label="事项"></el-table-column>
      <el-table-column prop="content" label="待办"></el-table-column>
      <el-table-column prop="date" label="开始时间"></el-table-column>
    </el-table>
  </portlet>

  <!-- </el-card> -->
</template>
<script>
import portlet from './Portlet.vue';
export default {
  components: {
    portlet
  },
  data() {
    return {
      tableData: [
        {
          title: "公出申请",
          content: "待审批",
          date: "2016-05-03"
        },
        {
          title: "公出申请",
          content: "待审批",
          date: "2016-05-03"
        }
      ],
      title: {
        id: 4,
        name: "我的待办"
      },
      buttons: [
        {
          id: 2,
          name: "申"
        },
        {
          id: 1,
          name: "审"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    buttonChange() {}
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
.header {
  height: 60px;
  line-height: 26px;
  padding-top: 6px;
  padding-bottom: 28px;
}
.title {
  font-size: 14px;
  
  font-weight: bold;
  color: rgba(119, 119, 119, 1);
}
.button {
  float: right;
  height: 30px;
  border-radius: 30px;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  font-size: 14px;
  margin-right: 10px;
  
}
.active {
  background: rgba(255, 106, 0, 1);
  color: rgba(255, 255, 255, 1);
}
.inactive {
  color: #9c9c9c;
}
</style>
