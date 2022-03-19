<template>
  <div class="container height100">
    <div v-if="show">
      <div class="patientInfo width100">{{patientInfoList[0].diagName}} 患者</div>
      <div class="infoList" v-for="(value,key) in patientInfoList" :key="key">
        <div class="infoTitle">{{value.infName}}</div>
        <div class="infoContent">
          <div v-if="value.orderNum=='1'">
            <div
              class="medicine"
              v-for="(item,index) in value.relationInfs"
              :key="index"
            >{{item.infContent}}
            </div>
          </div>
          <!--<div v-else-if="value.orderNum=='2'">
            <el-row v-for="(item,index) in value.relationInfs" :key="index">
              <el-col :span="2">{{item.infTitle}}</el-col>
              <el-col :span="22">{{item.infContent}}</el-col>
            </el-row>
          </div>-->
          <div v-else>
            <el-row>{{value.infContent}}</el-row>
            <div
              v-for="(item,index) in value.relationInfs"
              :key="index"
            >
              <el-row>{{item.infTitle}}</el-row>
              <el-row>{{item.infContent}}</el-row>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="infoList">
        <div class="infoTitle">治疗方案</div>
        <div class="infoContent">
          <el-row v-for="(item,index) in patientInfoList.treatmentPlans" :key="index">
            <el-col :span="2">{{index + 1}}.</el-col>
            <el-col :span="22">{{item.treatmentPlan}}</el-col>
          </el-row>
        </div>
      </div>
      <div class="infoList">
        <div class="infoTitle">病因</div>
        <div class="infoContent">
          <el-row class="pathogenyDescribe">{{patientInfoList.pathogenyDescribes.pathogenyDescribe}}</el-row>
          <el-row
            v-for="(item,index) in patientInfoList.pathogenyDescribes.pathogenyDescribeList"
            :key="index"
          >
            <el-col :span="2">{{index + 1}}.</el-col>
            <el-col :span="22">
              {{item.pathogenyDescribeName}}
              <br/>
              {{item.pathogenyDescribeContent}}
            </el-col>
          </el-row>
        </div>
      </div>-->
    </div>
    <div class="height100" v-else style="font-size:16px;color:#909399;text-align:center">暂无患者诊疗信息</div>
  </div>
</template>
<script>
  import {patDiagAuxiliaryInf} from '@/api/arch/arch.js';
  import {mapActions, mapGetters} from 'vuex';

  export default {
    data() {
      return {
        patientInfoList: [],
        loading: false,
        show: false
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["hisRecordData"])
    },
    watch: {
      "hisRecordData": {
        async handler(n) {
          this.patientInfoList = [];
          if (JSON.stringify(n) !== "{}") {
            if (n.visitCode) {
              await this.getInfo();
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      this.getInfo();
    },
    methods: {
      //搜索
      async getInfo() {
        this.loading = true;
        try {
          /*await searchHospital();
           this.patientInfoList = {
             patientKind: "2型糖尿病",
             medicines: [
               {medicineName: "盐酸二甲双胍片"},
               {medicineName: "门冬胰岛素注射液"},
               {medicineName: "阿卡波糖片"}
             ],
             treatmentPlans: [
               {treatmentPlan: "强调早期治疗和个体化控制目标与综合治疗；"},
               {
                 treatmentPlan:
                   "强调由内分泌医师和护士、营养师、糖尿病教育者、心理学家等组成的团队治疗；"
               },
               {
                 treatmentPlan:
                   "纠正代谢紊乱，维持良好的生活质量，保障儿童正常发育；"
               },
               {
                 treatmentPlan: "防止急性代谢紊乱并发症；"
               },
               {
                 treatmentPlan: "预防和延缓慢性并发症。"
               }
             ],
             pathogenyDescribes: {
               pathogenyDescribe:
                 "2型糖尿病的病因目前尚不明确。2型糖尿病的病因不是十分明确，现多认为是遗传或为多基因遗传异质性疾病，其危险因素包括老龄化、现代社会西方生活方式，如体力活动减少、超级市场高热量方便食品、可口可乐化以及肥胖等。 2型糖尿病的危险因素：",
               pathogenyDescribeList: [
                 {
                   pathogenyDescribeName: "家族史",
                   pathogenyDescribeContent:
                     "糖尿病患者的一级亲属即父母、兄弟姐妹等。糖尿病，尤其是占90%以上的2型糖尿病，是一种遗传倾向性疾病，常表现为家族聚集性。"
                 },
                 {
                   pathogenyDescribeName: "肥胖",
                   pathogenyDescribeContent:
                     "肥胖是发生2型糖尿病的一种重要危险因素，糖尿病的发生与肥胖的持续时间和最高肥胖程度密切相关。肥胖与糖尿病家族史合并存在则进一步协同增加2型糖尿病的危险性，在肥胖患者中，有的糖尿病家族史者2型糖尿病的风险高于糖尿病家族史者。"
                 },
                 {
                   pathogenyDescribeName: "能量摄入增加和体力活动减少",
                   pathogenyDescribeContent: ""
                 }
               ]
             }
           };
           this.patientInfoList = {};*/
          let params = {
            visitCode: this.hisRecordData.visitCode,
            patientType: 1
          };
          let res = await patDiagAuxiliaryInf(params);
          /*let res = {
            code: 1,
            data: [
              {
                "diagCode": "E11.900",
                "id": "3c91808465184975016e24a7b2c400ba",
                "infContent": "",
                "infName": "常用药物",
                "orderNum": 1,
                "relationInfs": [
                  {
                    "auxiliaryInfId": "3c91808465184975016e24a7b2c400ba",
                    "id": "3211808465184975016e24a7b2c400ba",
                    "infContent": "盐酸二甲双胍片",
                    "infTitle": "",
                    "orderNum": 1
                  },
                  {
                    "auxiliaryInfId": "3c91808465184975016e24a7b2c400ba",
                    "id": "3213808465184975016e24a7b2c400ba",
                    "infContent": "门冬胰岛素注射液",
                    "infTitle": "",
                    "orderNum": 2
                  },
                  {
                    "auxiliaryInfId": "3c91808465184975016e24a7b2c400ba",
                    "id": "3212808465184975016e24a7b2c400ba",
                    "infContent": "阿卡波糖片",
                    "infTitle": "",
                    "orderNum": 3
                  }
                ]
              },
              {
                "diagCode": "E11.900",
                "id": "3bn91808465184975016e24a7b2c400ba",
                "infContent": "",
                "infName": "治疗方案",
                "orderNum": 2,
                "relationInfs": [
                  {
                    "auxiliaryInfId": "3bn91808465184975016e24a7b2c400ba",
                    "id": "3442808412184975016e24a7b2c400ba",
                    "infContent": "强调早期治疗和个体化控制目标与综合治疗；",
                    "infTitle": "1.",
                    "orderNum": 1
                  },
                  {
                    "auxiliaryInfId": "3bn91808465184975016e24a7b2c400ba",
                    "id": "3442808413184975016e24a7b2c400ba",
                    "infContent": "强调由内分泌医师和护士、营养师、糖尿病教育者、心理学家等组成的团队治疗；",
                    "infTitle": "2.",
                    "orderNum": 2
                  },
                  {
                    "auxiliaryInfId": "3bn91808465184975016e24a7b2c400ba",
                    "id": "3442808414184975016e24a7b2c400ba",
                    "infContent": "纠正代谢紊乱，维持良好的生活质量，保障儿童正常发育；",
                    "infTitle": "3.",
                    "orderNum": 3
                  },
                  {
                    "auxiliaryInfId": "3bn91808465184975016e24a7b2c400ba",
                    "id": "3442808415184975016e24a7b2c400ba",
                    "infContent": "防止急性代谢紊乱并发症；",
                    "infTitle": "4.",
                    "orderNum": 4
                  },
                  {
                    "auxiliaryInfId": "3bn91808465184975016e24a7b2c400ba",
                    "id": "3442808416184975016e24a7b2c400ba",
                    "infContent": "预防和延缓慢性并发症。",
                    "infTitle": "5.",
                    "orderNum": 5
                  }
                ]
              },
              {
                "diagCode": "E11.900",
                "id": "3bn91818463184975016e24a7b2c400ba",
                "infContent": "2型糖尿病的病因目前尚不明确。2型糖尿病的病因不是十分明确，现多认为是遗传或为多基因遗传异质性疾病，其危险因素包括老龄化、现代社会西方生活方式，如体力活动减少、超级市场高热量方便食品、可口可乐化以及肥胖等。 2型糖尿病的危险因素：",
                "infName": "病因",
                "orderNum": 3,
                "relationInfs": [
                  {
                    "auxiliaryInfId": "3bn91818463184975016e24a7b2c400ba",
                    "id": "3442808416184972116e24a7b2c400ba",
                    "infContent": "糖尿病患者的一级亲属即父母、兄弟姐妹等。糖尿病，尤其是占90%以上的2型糖尿病，是一种遗传倾向性疾病，常表现为家族聚集性。",
                    "infTitle": "1.家族史",
                    "orderNum": 1
                  },
                  {
                    "auxiliaryInfId": "3bn91818463184975016e24a7b2c400ba",
                    "id": "3442808416184972216e24a7b2c400ba",
                    "infContent": "肥胖是发生2型糖尿病的一种重要危险因素，糖尿病的发生与肥胖的持续时间和最高肥胖程度密切相关。肥胖与糖尿病家族史合并存在则进一步协同增加2型糖尿病的危险性，在肥胖患者中，有的糖尿病家族史者2型糖尿病的风险高于糖尿病家族史者",
                    "infTitle": "2.肥胖",
                    "orderNum": 2
                  },
                  {
                    "auxiliaryInfId": "3bn91818463184975016e24a7b2c400ba",
                    "id": "3442808416184972316e24a7b2c400ba",
                    "infContent": "能量摄入增加和体力活动减少",
                    "infTitle": "3.",
                    "orderNum": 3
                  }
                ]
              }
            ]
          };*/
          if (res.code == '1') {
            this.patientInfoList = [...res.data];
          } else {
            this.$message.error(res.msg || "获取患者诊疗信息失败");
          }
          if (!this.patientInfoList || this.patientInfoList.length <= 0) {
            this.show = false;
          } else {
            this.show = true;
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "获取患者诊疗信息失败");
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .container {
    overflow-y: auto;

    .patientInfo {
      height: 40px;
      background: rgba(255, 241, 241, 1);
      border-radius: 2px;
      text-align: center;
      font-size: 14px;
      color: rgba(239, 15, 15, 1);
      line-height: 40px;
      margin-bottom: 20px;
    }

    .infoList {
      border-bottom: 1px solid #e4e4e4;
      margin-bottom: 20px;

      .infoTitle {
        font-size: 14px;
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        margin-bottom: 15px;
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
    }
  }
</style>
