<template>
  <div>
    <el-collapse v-loading="loading">
      <el-collapse-item :title="item.depart" v-for="(item,index) in dataList" :key="index">
        <el-row v-for="(it,index2) in item.departList" :key="index2">
          <el-col :span="3">{{index2 + 1}}.</el-col>
          <el-col :span="21">{{it.content}}</el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [
        {
          depart: "健康促进",
          departList: [
            { content: "老年综合征 " },
            { content: "有老年综合征的危险" },
            { content: "健康管理无效 " },
            { content: "有健康管理改善的趋势" },
            { content: "家庭健康管理无效" },
            { content: "不依从行为" },
            { content: "缺乏娱乐活动" },
            { content: "久坐的生活方式" },
            { content: "缺乏社区保健" },
            { content: "有健康行为改善的趋势" },
            { content: "健康维持无效" },
            { content: "防护无效" }
          ]
        },
        {
          depart: "营养",
          departList: [
            { content: "肥胖" },
            { content: "超重" },
            { content: "有超重的危险" },
            { content: "母乳喂养无效" },
            { content: "母乳喂养中断" },
            { content: "有母乳喂养改善的趋势" },
            { content: "乳汁不足" },
            { content: "无效性婴儿喂养型态" },
            { content: "营养失调：低于机体需要量" },
            { content: "有营养改善的趋势" },
            { content: "吞咽障碍" },
            { content: "有血糖不稳定的危险" },
            { content: "新生儿黄疸" },
            { content: "有新生儿黄疸的危险" },
            { content: "有肝功能受损的危险" },
            { content: "有电解质失衡的危险 " },
            { content: "有体液平衡改善的趋势" },
            { content: "体液不足 " },
            { content: "有体液不足的危险" },
            { content: "体液过多" },
            { content: "有体液失衡的危险" }
          ]
        },
        {
          depart: "排泄",
          departList: [
            { content: "慢性功能性便秘" },
            { content: "有慢性功能性便秘的危险" },
            { content: "排尿障碍" },
            { content: "有排尿功能改善的趋势" },
            { content: "功能性尿失禁" },
            { content: "溢出性尿失禁" },
            { content: "反射性尿失禁" },
            { content: "压力性尿失禁" },
            { content: "急迫性尿失禁" },
            { content: "有急迫性尿失禁的危险" },
            { content: "尿潴留" },
            { content: "便秘" },
            { content: "有便秘的危险" },
            { content: "感知性便秘" },
            { content: "腹泻" },
            { content: "胃肠动力失调" },
            { content: "有胃肠动力失调的危险" },
            { content: "排便失禁" },
            { content: "气体交换障碍" }
          ]
        },
        {
          depart: "活动/休息",
          departList: [
            { content: "坐起障碍" },
            { content: "站立障碍" },
            { content: "有心输出量减少的危险" },
            { content: "有心血管功能受损的危险" },
            { content: "失眠" },
            { content: "睡眠剥夺" },
            { content: "有睡眠改善的趋势" },
            { content: "睡眠型态紊乱 " },
            { content: "有失用综合征的危险" },
            { content: "床上活动障碍" },
            { content: "躯体活动障碍" },
            { content: "借助轮椅活动障碍" },
            { content: "移动能力障碍" },
            { content: "行走障碍" },
            { content: "疲乏" },
            { content: "漫游状态" },
            { content: "活动无耐力" },
            { content: "有活动无耐力的危险 " },
            { content: "低效性呼吸型态" },
            { content: "心输出量减少" },
            { content: "有胃肠道灌注无效的危险" },
            { content: "有肾脏灌注无效的危险" },
            { content: "自主呼吸障碍" },
            { content: "有心脏组织灌注不足的危险" },
            { content: "有脑组织灌注无效的危险" },
            { content: "外周组织灌注无效" },
            { content: "有外周组织灌注无效的危险" },
            { content: "呼吸机依赖" },
            { content: "持家能力障碍" },
            { content: "沐浴自理缺陷" },
            { content: "穿着自理缺陷" },
            { content: "进食自理缺陷" },
            { content: "如厕自理缺陷" },
            { content: "有自理能力改善的趋势" },
            { content: "自我忽视" }
          ]
        },
        {
          depart: "感知/认知",
          departList: [
            { content: "情绪控制失调" },
            { content: "单侧身体忽视" },
            { content: "急性意识障碍" },
            { content: "有急性意识障碍的危险" },
            { content: "慢性意识障碍" },
            { content: "冲动控制无效" },
            { content: "知识缺乏" },
            { content: "有知识增进的趋势" },
            { content: "记忆功能障碍" },
            { content: "有沟通增进的趋势" },
            { content: "语言沟通障碍" }
          ]
        },
        {
          depart: "自我感知",
          departList: [
            { content: "有希望增强的趋势" },
            { content: "无望感" },
            { content: "有个人尊严受损的危险" },
            { content: "自我认同紊乱" },
            { content: "有自我认同紊乱的危险" },
            { content: "有自控能力增强的趋势" },
            { content: "长期低自尊" },
            { content: "有长期低自尊的危险" },
            { content: "有情境性低自尊的危险" },
            { content: "情境性低自尊" },
            { content: "体像紊乱" }
          ]
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
.el-collapse-item {
  /deep/ .el-collapse-item__content {
    padding: 15px 5px 15px 5px;
  }
}
.el-row {
  font-size: 14px;
  
  font-weight: 400;
  color: rgb(68, 70, 75);
}
</style>