<template>
  <div>
    <div class="title">
      <span class="red">{{indexData.assayName || pathogenyDescribes.illness}}</span> 指标解读
    </div>
    <div class="main">
      <el-collapse>
        <el-collapse-item title="临床意义">
          <div class="infoContent">
            <el-row class="pathogenyDescribe">{{pathogenyDescribes.pathogenyDescribe}}</el-row>
            <el-row v-for="(item,index) in pathogenyDescribes.pathogenyDescribeList" :key="index">
              <el-col :span="2">{{index + 1}}.</el-col>
              <el-col :span="22">
                {{item.pathogenyDescribeName}}
                <br />
                {{item.pathogenyDescribeContent}}
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="治疗措施">
          <div class="infoContent">
            <el-row v-for="(item,index) in treatmentPlans" :key="index">
              <el-col :span="2">{{index + 1}}.</el-col>
              <el-col :span="22">{{item.treatmentPlan}}</el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      pathogenyDescribes: {
        illness: "顶部皮下血肿",
        pathogenyDescribe:
          "顶部皮下血肿，是被非常关注的问题，这种升高既有生理性因素也有病理性因素。白细胞数量升高和减少往往有以下情况：",
        pathogenyDescribeList: [
          {
            pathogenyDescribeName: "生理性增高",
            pathogenyDescribeContent: "新生儿、妊娠末期、分娩期、剧烈运动后等"
          },
          {
            pathogenyDescribeName: "病理性增高",
            pathogenyDescribeContent:
              "化脓性细菌性炎症、尿毒症、白血病、组织损伤、手术创伤等"
          },
          {
            pathogenyDescribeName: "减少",
            pathogenyDescribeContent:
              "病毒性感染、伤寒、副伤寒、黑热病、疟疾、再生障碍性贫血、化疗和放疗后等"
          }
        ]
      },
      treatmentPlans: [
        { treatmentPlan: "强调早期治疗和个体化控制目标与综合治疗；" },
        {
          treatmentPlan:
            "强调由内分泌医师和护士、营养师、糖尿病教育者、心理学家等组成的团队治疗；"
        },
        {
          treatmentPlan: "纠正代谢紊乱，维持良好的生活质量，保障儿童正常发育；"
        },
        {
          treatmentPlan: "防止急性代谢紊乱并发症；"
        },
        {
          treatmentPlan: "预防和延缓慢性并发症。"
        }
      ],
      loading: false
    };
  },
  computed: {
    // 监听检验报告传过来的解读指标
    ...mapGetters("report", ["indexData"])
  },
  watch: {
    indexData: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val);
      }
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.title {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 14px;
  
  font-weight: bold;
  color: rgba(46, 50, 58, 1);
  border-bottom: 1px solid rgb(218, 214, 214);
  margin-bottom: 10px;
  .red {
    color: red;
  }
}
.main {
  overflow-y: auto;
}
.infoContent {
  font-size: 14px;
  
  font-weight: 400;
  color: rgba(148, 157, 163, 1);
  margin-bottom: 10px;
  .pathogenyDescribe {
    margin-bottom: 10px;
  }
  .el-row {
    margin-bottom: 10px;
    line-height: 20px;
  }
  .medicine {
    margin-bottom: 10px;
  }
}
</style>