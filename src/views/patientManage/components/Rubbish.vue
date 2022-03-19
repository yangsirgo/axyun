<template>
  <div class="rubbish">
    <el-card shadow="never">
      <div class="top-box">
        <span>选择日期:</span>
        <el-date-picker
          v-model="form.datePick"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="住院" value="1"></el-option>
          <el-option label="门诊" value="0"></el-option>
        </el-select>
      </div>

      <el-table
        height="400"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in tableHead"
          :key="index"
          :property="item.key"
          min-width="280"
          :label="item.label"
        >
          <template v-slot="scope">
            <capsule v-if="scope.row[scope.column.property]">
              <template #icon></template>
              <template #detail>{{
                scope.row[scope.column.property]
              }}</template>
            </capsule>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer-box">
        <el-steps :active="2" align-center>
          <el-step title="申请项目" description="曲丽丽留置倒尿"></el-step>
          <el-step title="采集标本" description="周毛毛"></el-step>
          <el-step title="签收标本" description></el-step>
          <el-step title="审核发布" description></el-step>
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script>
import capsule from "./Capsule";
export default {
  name: "rubbish",
  components: {
    capsule
  },
  data() {
    return {
      form: {
        datePick: "",
        type: ""
      },
      tableHead: [
        {
          label: "2019/9/9",
          key: "day1"
        },
        {
          label: "2019/9/10",
          key: "day2"
        },
        {
          label: "2019/9/11",
          key: "day3"
        },
        {
          label: "2019/9/12",
          key: "day4"
        },
        {
          label: "2019/9/13",
          key: "day5"
        },
        {
          label: "2019/9/14",
          key: "day6"
        },
        {
          label: "2019/9/15",
          key: "day7"
        }
      ],
      tableData: [
        {
          day1: "阿莫西林胶囊 3粒/tid",
          day2: "尿常规(机器法)",
          day3: "左输尿管镜检+活体法",
          day4: "肾积液查因(诊断)",
          day5: "肝功能常规检测",
          day6: "I 级护理",
          day7: "混合糖电解质注射液"
        },
        {
          day1: "注射用头孢拉丁 3粒/tid",
          day2: "乙肝三对检查",
          day3: "心电监测",
          day4: "马蹄肾(诊断)",
          day5: "血压检测",
          day6: "尿常规",
          day7: "心电监测"
        },
        {
          day1: "留置导尿 qd",
          day4: "高血压I(诊断)",
          day5: "高血压I(诊断)",
          day6: "心电监测",
          day7: "胸片B超"
        },
        {
          day4: "常规心电图检查-十二通道",
          day5: "心脏彩超",
          day6: "高血压I(诊断)",
          day7: "马蹄肾(诊断)"
        },
        {
          day4: "支气管舒张试验",
          day5: "腰部卧位",
          day6: "尿常规"
        },
        {
          day4: "I 级护理",
          day5: "血压检测"
        },
        {
          day4: "混合糖电解质注射液"
        },
        {
          day4: "尿流率检测"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.el-card {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .top-box {
    margin-bottom: 20px;
  }
  .el-table {
  }
  .footer-box {
    position: absolute;
    left: 20px;
    bottom: 20px;
    width: 100%;
    height: 120px;
    background-color: #f7f7f7;
    padding: 5px;
  }
}
</style>
