<template>
  <!-- <el-card class="box-card"> -->
  <!-- <div class="header">
      <span class="title">我的消息</span>
      <el-button class="button inactive" type="text">制度规范</el-button>
      <el-button class="button active" round>通知</el-button>
  </div>-->
  <portlet :title="title" :buttons="buttons" @buttonclick="buttonChange">
    <el-table :data="tableData" :show-header="false" :border="true" style="width: 100%">
      <el-table-column prop="content" label="日期"></el-table-column>
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
      title: {
        id: 5,
        name: "通知公告"
      },
      buttons: [
        {
          id: 2,
          name: "制度规范"
        },
        {
          id: 1,
          name: "通知"
        }
      ],
      tableData: [
        {
          content: "三级医院绩效考核通知"
        },
        {
          content: "昆华医院成功上线"
        },
        {
          content: "全体员工集体涨工资每天一万"
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
