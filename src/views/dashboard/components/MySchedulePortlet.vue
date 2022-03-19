<template>
  <!-- <el-card class="box-card"> -->
  <!-- <div class="header">
      <span class="title"></span>
      <el-button class="button inactive" type="text">下</el-button>
      <el-button class="button inactive" type="text">今</el-button>
      <el-button class="button active" round>上</el-button>
  </div>-->
  <portlet v-bind:title="title" :buttons="buttons" @buttonclick="buttonChange">
    <div class="table">
      <div>
        <div class="block table-title">日</div>
        <div class="block table-title">一</div>
        <div class="block table-title">二</div>
        <div class="block table-title">三</div>
        <div class="block table-title">四</div>
        <div class="block table-title">五</div>
        <div class="block table-title">六</div>
      </div>
      <div>
        <div class="block">24</div>
        <div class="block">25</div>
        <div class="block">26</div>
        <div class="block">27</div>
        <div class="block">28</div>
        <div class="block">29</div>
        <div class="block">30</div>
      </div>
      <div>
        <div class="block task"></div>
        <div class="block task"></div>
        <div class="block task">
          <el-tag color="#ff6b00">手术</el-tag>
          <el-tag color="#FFB11B">会议</el-tag>
        </div>
        <div class="block task"></div>
        <div class="block task"></div>
        <div class="block task"></div>
        <div class="block task"></div>
      </div>
    </div>
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
          title: "王小虎",
          content: "三级医院绩效考核通知",
          date: "2016-05-03"
        },
        {
          title: "王小虎",
          content: "昆华医院成功上线",
          date: "2016-05-03"
        },
        {
          title: "王小虎",
          content: "全体员工集体涨工资每天一万",
          date: "2016-05-03"
        }
      ],
      title: {
        id: 3,
        name: "我的日程"
      },
      buttons: [
        {
          id: 3,
          name: "上"
        },
        {
          id: 2,
          name: "今"
        },
        {
          id: 1,
          name: "下"
        }
      ]
    };
  },
  mounted() {
    console.info("homepage mounted");
  },
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
.table {
  margin-bottom: 5px;
  overflow: hidden;
}
.block {
  float: left;
  width: 14.285%;
  height: 31px;
  line-height: 31px;
  text-align: center;
  border: 1px solid #ededed;
}
.table-title {
  background: #f7f8fa;
}
.task {
  height: 80px;
  .el-tag{
    margin-top: 7px;
  }
}
</style>
