<template>
  <portlet :title="title" :buttons="buttons" @buttonclick="buttonChange">
    <div id="div1">
      <div id="card">
        <div id="dleft">
          <el-tabs :items="leftItems" v-model="leftIndex" @change="leftTabChange"></el-tabs>
        </div>
        <div id="dright">
          <el-tabs :items="rightItems" v-model="rightIndex" @change="rightTabChange"></el-tabs>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" class="table" v-loading="loading">
        <el-table-column prop="badnum" label="床号" align="center" min-width="8%"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" min-width="8%"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center" min-width="8%"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center" min-width="8%"></el-table-column>
        <el-table-column prop="money" label="费用" align="center" min-width="8%"></el-table-column>
        <el-table-column prop="disease" label="入院诊疗" align="center" min-width="13%"></el-table-column>
        <el-table-column prop="state" label="状态" align="center" min-width="22%">
          <template>
            <div class="tag">特</div>
            <div class="tag tag2">危</div>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" min-width="25%" align="center">
          <el-tag color="#6478D3">医嘱</el-tag>
          <el-tag color="#FFB11B">患者360</el-tag>
        </el-table-column>
      </el-table>
    </div>
  </portlet>
</template>
<script>
import portlet from './Portlet.vue'
export default {
  components: {
    portlet
  },
  data() {
    return {
      loading: false,

      leftItems: [
        {
          key: "1",
          name: "本人患者"
        },
        {
          key: "2",
          name: "本组"
        },
        {
          key: "3",
          name: "本科"
        }
      ],
      leftIndex: 0,
      rightItems: [
        {
          key: "1",
          name: "全部护理"
        },
        {
          key: "2",
          name: "特级"
        },
        {
          key: "3",
          name: "1级"
        },
        {
          key: "4",
          name: "2级"
        },
        {
          key: "5",
          name: "3级"
        }
      ],
      rightIndex: 0,

      tableData: [
        {
          "badnum": 1310,
          "name": "张三",
          "sex": "男",
          "age": 21,
          "money": "公费",
          "disease": "寒气反噬"
        },
        {
          "badnum": 1310,
          "name": "张三",
          "sex": "男",
          "age": 24,
          "money": "公费",
          "disease": "寒气反噬"
        },
        {
          "badnum": 1305,
          "name": "张三",
          "sex": "男",
          "age": 23,
          "money": "公费",
          "disease": "寒气反噬"
        }
      ],

      title: {
        id: 1,
        name: ""
      },
      buttons: [
        {
          id: 7,
          name: "撤床"
        },
        {
          id: 6,
          name: "会诊"
        },
        {
          id: 5,
          name: "转科"
        },
        {
          id: 4,
          name: "手术"
        },
        {
          id: 3,
          name: "危重"
        },
        {
          id: 2,
          name: "在院"
        },
        {
          id: 1,
          name: "门诊"
        }
      ]
    };
  },
  async created() {
    await this.updateTableData();
  },
  async mounted() {
    // 这里可以操作 $el
  },
  methods: {
    async updateTableData() {

    },
    async leftTabChange() {
      await this.updateTableData();
    },
    async rightTabChange() {
      await this.updateTableData();
    },
    async buttonChange(data) {
      // 根据卡片名字，右侧按钮名字请求获得卡片数据

    }
  }
};
</script>
<style lang="scss" scoped>
// 按钮div盒子
#dleft {
  float: left;
}
#dright {
  float: right;
  margin-right: 0px;
}

//状态标签
.tag {
  display: inline-block;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background: rgba(255, 107, 0, 1);
  border: none;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 26px;
}
.tag2 {
  margin-left: 3px;
}
.table{
  border: 1px solid #ff6a00;
  .el-tag{
    margin: 0 3px;
    font-size: 14px;
  }
}
</style>
