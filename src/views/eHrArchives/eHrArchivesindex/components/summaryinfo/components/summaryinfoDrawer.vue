<template>
  <div class="summaryinfoDrawer">
    <div class="recordCreate width100 height100">
      <el-card class="card-cont1 width100 height100">
        <el-tabs
          :tab-position="tabPosition"
          style="height: 450x"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="返回" name="-1"> </el-tab-pane>
          <el-tab-pane label="医嘱药方" name="first">
            <el-col class="height100 summaryinfoDrawer-Wrap">
              <el-col :span="4">
                <el-col class="askThat-top">
                  <el-timeline :reverse="reverse">
                    <el-timeline-item @click.native="prescriptionFun('')">
                      全部
                    </el-timeline-item>
                    <el-timeline-item
                      v-for="(activity, index) in prescription.activities"
                      :key="index"
                      @click.native="prescriptionFun(activity.typeCode)"
                    >
                      {{ activity.typeCodeName }}{{ activity.number }}种
                    </el-timeline-item>
                  </el-timeline>
                </el-col>
                <el-col><el-divider></el-divider></el-col>
                <el-col>
                  <el-col class="askThat-text">特殊说明:</el-col>
                  <el-col class="askThat-text1">{{
                    prescription.specialInstructions || "无"
                  }}</el-col>
                </el-col>
              </el-col>
              <el-col :span="20" class="height100">
                <el-col
                  style="
                    background-color: #f6f6f6;
                    padding: 10px;
                    width: 95%;
                    height: calc(100% - 30px);
                  "
                >
                  <el-card class="el-card-style height100">
                    <el-col class="specificStyle">
                      <span>R<sub style="font-weight: 600">P</sub></span>
                    </el-col>
                    <el-col class="doctordviceA-wrap" style="min-height: 500px">
                      <!-- 长期遗嘱 -->
                      <el-col
                        class="doctordviceA-list"
                        v-for="(activitiesRight,
                        index) in prescription.empiLongMedRecord"
                        :key="index + '1'"
                      >
                        <el-col class="doctordviceA-list-top">
                          <span class="doctordviceA-text1">长期医嘱：</span>
                          <span class="doctordviceA-text2">
                            {{
                              activitiesRight.empiLongMedRecordStrateTime || ""
                            }}
                            ——
                            {{
                              activitiesRight.empiLongMedRecordStrateTime || ""
                            }}
                          </span>
                        </el-col>
                        <el-col
                          class="doctordviceA-list-bottom"
                          v-for="(adviceVOList,
                          index) in activitiesRight.adviceVOList"
                          :key="index + '2'"
                        >
                          <el-col class="marginBottom">
                            <el-col :span="10">
                              <span>{{ index + 1 }} 、</span>
                              <!-- 1 辅酶Q10软胶囊(10mg*24粒/盒) -->
                              <span>{{ adviceVOList.name || "" }}</span>
                              (
                              <span>{{ adviceVOList.spec || "" }}</span>
                              )
                            </el-col>
                            <el-col
                              :span="4"
                              style="text-align: center; min-height: 20px"
                            >
                              <div v-show="adviceVOList.useDays">
                                <!-- 8粒 -->
                                {{ adviceVOList.useDays || "" }}天
                                <!-- <span v-if="!judgeFun(adviceVOList.dosageUnit)" :val="adviceVOList.dosageUnit || ''" code="DrugDoseUnit" v-codeTransform></span>
                               <span v-if="judgeFun(adviceVOList.dosageUnit)">{{adviceVOList.dosageUnit}}</span> -->
                              </div>
                            </el-col>

                            <el-col :span="10">
                              <!-- 11.32元/盒 -->
                              {{ adviceVOList.price || "" }}元/
                              <span
                                :val="adviceVOList.packageUnit || ''"
                                code="DrugDoseUnit"
                                v-codeTransform
                              ></span>
                              <!-- {{ interception(adviceVOList.spec || '') }} -->
                            </el-col>
                          </el-col>
                          <el-col>
                            <span>用法:</span>
                            <span>
                              <!-- 每次10mg, 2/日, 口服 -->
                              每次{{ adviceVOList.onceDosage || "" }}
                              <span
                                v-if="!judgeFun(adviceVOList.dosageUnit)"
                                :val="adviceVOList.dosageUnit || ''"
                                code="DrugDoseUnit"
                                v-codeTransform
                              ></span>
                              <span v-if="judgeFun(adviceVOList.dosageUnit)">{{
                                adviceVOList.dosageUnit
                              }}</span>
                              , {{ adviceVOList.cycleNum || ""
                              }}{{ adviceVOList.cycleUnit
                              }}{{ adviceVOList.frequencyTimes || "" }}次,
                              <span
                                :val="adviceVOList.uses || ''"
                                code="MedicationRouteCode"
                                v-codeTransform
                              ></span>
                              ,
                              <!-- {{adviceVOList.uses}} -->
                            </span>
                          </el-col>
                        </el-col>
                      </el-col>

                      <!-- 短期医嘱 -->
                      <el-col
                        class="doctordviceA-list"
                        v-for="(activitiesRight,
                        index) in prescription.empiTempMedRecord"
                        :key="index + '3'"
                      >
                        <el-col class="doctordviceA-list-top">
                          <span class="point-style"></span>
                          <!-- <span class="doctordviceA-text1">长期医嘱：</span> -->
                          <span class="doctordviceA-text2">{{
                            activitiesRight.empiTempMedRecordTime || ""
                          }}</span>
                        </el-col>
                        <el-col
                          class="doctordviceA-list-bottom"
                          v-for="(adviceVOList,
                          index) in activitiesRight.adviceVOList"
                          :key="index + '4'"
                        >
                          <el-col class="marginBottom">
                            <el-col :span="10">
                              <span>{{ index + 1 }}、</span>
                              <!-- 1 辅酶Q10软胶囊(10mg*24粒/盒) -->
                              <span>{{ adviceVOList.name || "" }}</span>
                              (
                              <span>{{ adviceVOList.spec || "" }}</span>
                              )
                            </el-col>
                            <el-col
                              :span="4"
                              style="text-align: center; min-height: 20px"
                            >
                              <div v-show="adviceVOList.useDays">
                                <!-- 8粒 -->
                                {{ adviceVOList.useDays || "" }}天
                                <!-- {{ adviceVOList.count || '' }}
                            <span v-if="!judgeFun(adviceVOList.dosageUnit)" :val="adviceVOList.dosageUnit || ''" code="DrugDoseUnit" v-codeTransform></span>
                            <span v-if="judgeFun(adviceVOList.dosageUnit)">{{adviceVOList.dosageUnit}}</span> -->
                              </div>
                            </el-col>
                            <el-col :span="10">
                              <!-- 11.32元/盒 -->
                              {{ adviceVOList.price || "" }}元 /
                              <span
                                :val="adviceVOList.packageUnit || ''"
                                code="DrugDoseUnit"
                                v-codeTransform
                              ></span>

                              <!-- {{ interception(adviceVOList.spec || '') }} -->
                            </el-col>
                          </el-col>
                          <el-col>
                            <span>用法:</span>
                            <span>
                              <!-- 每次10mg, 2/日, 口服 -->
                              每次{{ adviceVOList.onceDosage || "" }}
                              <span
                                v-if="!judgeFun(adviceVOList.dosageUnit)"
                                :val="adviceVOList.dosageUnit || ''"
                                code="DrugDoseUnit"
                                v-codeTransform
                              ></span>
                              <span v-if="judgeFun(adviceVOList.dosageUnit)">{{
                                adviceVOList.dosageUnit
                              }}</span>

                              , {{ adviceVOList.cycleNum || ""
                              }}{{ adviceVOList.cycleUnit
                              }}{{ adviceVOList.frequencyTimes || "" }}次,
                              <span
                                :val="adviceVOList.uses || ''"
                                code="MedicationRouteCode"
                                v-codeTransform
                              ></span>
                              ,
                            </span>
                          </el-col>
                        </el-col>
                      </el-col>

                      <!-- 门诊遗嘱 -->
                      <el-col
                        class="doctordviceA-list"
                        v-for="(activitiesRight,
                        index) in prescription.recipeVisitList"
                        :key="index + '4'"
                      >
                        <el-col class="doctordviceA-list-top">
                          <span class="point-style"></span>
                          <!-- <span class="doctordviceA-text1">长期医嘱：</span> -->
                          <span class="doctordviceA-text2">{{
                            activitiesRight.recipeCode || ""
                          }}</span>
                        </el-col>
                        <el-col
                          class="doctordviceA-list-bottom"
                          v-for="(adviceVOList,
                          index) in activitiesRight.adviceVOList"
                          :key="index + '4'"
                        >
                          <el-col class="marginBottom">
                            <el-col :span="10">
                              <span>{{ index + 1 }}、</span>
                              <!-- 1 辅酶Q10软胶囊(10mg*24粒/盒) -->
                              <span>{{ adviceVOList.name || "" }}</span>
                              (
                              <span>{{ adviceVOList.spec || "" }}</span>
                              )
                            </el-col>
                            <el-col
                              :span="4"
                              style="text-align: center; min-height: 20px"
                            >
                              <div v-show="adviceVOList.useDays">
                                <!-- 8粒 -->
                                {{ adviceVOList.useDays || "" }}天
                                <!--  {{ adviceVOList.count || '' }}
                                <span v-if="!judgeFun(adviceVOList.dosageUnit)" :val="adviceVOList.dosageUnit || ''" code="DrugDoseUnit" v-codeTransform></span>
                                <span v-if="judgeFun(adviceVOList.dosageUnit)">{{adviceVOList.dosageUnit}}</span> -->
                              </div>
                            </el-col>
                            <el-col :span="10">
                              <!-- 11.32元/盒 -->
                              {{ adviceVOList.price || "" }}元 /
                              <span
                                :val="adviceVOList.packageUnit || ''"
                                code="DrugDoseUnit"
                                v-codeTransform
                              ></span>
                              <!-- {{ interception(adviceVOList.spec || '') }} -->
                            </el-col>
                          </el-col>
                          <el-col>
                            <span>用法:</span>
                            <span>
                              <!-- 每次10mg, 2/日, 口服 -->
                              每次{{ adviceVOList.onceDosage || "" }}
                              <span
                                v-if="!judgeFun(adviceVOList.dosageUnit)"
                                :val="adviceVOList.dosageUnit || ''"
                                code="DrugDoseUnit"
                                v-codeTransform
                              ></span>
                              <span v-if="judgeFun(adviceVOList.dosageUnit)">{{
                                adviceVOList.dosageUnit
                              }}</span>
                              , {{ adviceVOList.cycleNum || ""
                              }}{{ adviceVOList.cycleUnit
                              }}{{ adviceVOList.frequencyTimes || "" }}次,
                              <span
                                :val="adviceVOList.uses || ''"
                                code="MedicationRouteCode"
                                v-codeTransform
                              ></span>
                              ,
                            </span>
                          </el-col>
                        </el-col>
                      </el-col>
                    </el-col>
                    <!-- <el-pagination
                     background
                     layout="prev, pager, next"
                     :total="1000"
                     @current-change="currentChange"
                     >
                   </el-pagination> -->
                  </el-card>
                </el-col>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="检验报告" name="second">
            <div class="inspectionReport">
              <div class="inspectionReport-left">
                <inspectionReportLeft
                  ref="inspectionReportLeft"
                  @inspectionReportLeftObj="inspectionReportLeftObjFun"
                  :visitCode="visitCode"
                ></inspectionReportLeft>
              </div>
              <div class="inspectionReport-right">
                <inspectionReportRight
                  :inspectionReportLeftObj="inspectionReportLeftObj"
                ></inspectionReportRight>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="检查报告" name="third">
            <div class="inspectionReport">
              <div class="inspectionReport-left">
                <checkReportLeft
                  ref="checkReportLeft"
                  @inspectionReportLeftObj="inspectionReportLeftObjFun"
                  :visitCode="visitCode"
                ></checkReportLeft>
              </div>
              <div class="inspectionReport-right">
                <checkReportRight
                  :inspectionReportLeftObj="checkReportRightObj"
                ></checkReportRight>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="执行方案" name="fourth">
            <div
              style="
                width: 100%;
                height: 100%;
                color: #cccccc;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              暂无数据
            </div>
          </el-tab-pane>
          <el-tab-pane label="病历文档" name="five">
            <div v-if="activeName === 'five'" class="width100 height100">
              <recordsTheDocument
                :visitCode="visitCode"
                ref="recordsTheDocument"
              ></recordsTheDocument>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- <el-button type="primary" class="backStyle" @click.native="backFun">返回</el-button> -->
      </el-card>
    </div>
  </div>
</template>
<script>
import elTimeline from "./elTimeline.vue";
// 检验报告   start
import inspectionReportLeft from "./inspectionReportLeft.vue";
import inspectionReportRight from "./inspectionReportRight.vue";
// 检查报告  end
// 检查报告 start
import checkReportLeft from "./checkReportLeft.vue";
import checkReportRight from "./checkReportRight.vue";
// 病历文档  name  recordsTheDocument
import recordsTheDocument from "./recordsTheDocument.vue";

// 检查报告 end
import {
  selectOrderItemDrugTypeDetail,
  selectOrderItemDrugTypeCount,
} from "@/api/eHrArchives/eHrArchives";
export default {
  name: "inspectionReport",
  components: {
    inspectionReportLeft,
    inspectionReportRight,
    checkReportLeft,
    checkReportRight,
    recordsTheDocument,
  },
  props: ["drawerrueData"],
  data() {
    return {
      tabPosition: "left",
      activeName: "first",
      activeNameOld: "",
      reverse: false,

      // 医嘱药方 start
      prescription: {
        activities: [], //左侧的药品列表
        rightData: {
          isAdvice: "",
          visitCode: "",
          typeCode: "",
        },
        // 特出说明
        specialInstructions: "",
        // 长期医嘱
        empiLongMedRecord: [],
        // 短期医嘱
        empiTempMedRecord: [],
        // 门诊的
        recipeVisitList: [],
      },
      visitCode: "",
      // 医嘱药方 end

      // 检验报告 start
      inspectionReport: {},
      inspectionReportLeftObj: {},
      //检验报告 end
      // 检查报告 start
      checkReportRightObj: {},

      // 检查报告 end
    };
  },

  created() {
    this.activeNameOld = this.activeName;
    // console.log(this.drawerrueData, 'this.drawerrueData');
    this.prescription.rightData.isAdvice = this.drawerrueData.treatType;
    this.prescription.rightData.visitCode = this.drawerrueData.code;
    this.visitCode = this.drawerrueData.code;
    this.selectOrderItemDrugTypeCount(this.prescription.rightData);
  },
  methods: {
    // currentChange(){

    // },
    // 判断有无中文
    judgeFun(str) {
      let pattern = new RegExp("[\u4E00-\u9FA5]+");
      var patternStyle = false;
      if (pattern.test(str)) {
        patternStyle = true;
      } else {
        patternStyle = false;
      }
      return patternStyle;
    },
    // 截取
    interception(str) {
      return str.substring(str.length - 2);
    },
    // 获取检验报告左边的并props穿到右边  // 页面标识 mark: '0'// 1是检验0是检查
    inspectionReportLeftObjFun(a, b) {
      if (b == "0") {
        this.checkReportRightObj = a;
      } else if (b == "1") {
        this.inspectionReportLeftObj = a;
      }
    },
    // 点击
    prescriptionFun(a) {
      this.prescription.rightData.typeCode = a;
      this.selectOrderItemDrugTypeDetail(this.prescription.rightData);
    },
    // /ehr/selectOrderItemDrugTypeDetail    医嘱药方每类药品详情
    async selectOrderItemDrugTypeDetail(obj) {
      let result = await selectOrderItemDrugTypeDetail(obj);
      console.log(result, "rightData");
      if (result.code == "1") {
        // 住院
        // 长期医嘱
        this.prescription.empiLongMedRecord = result.data.empiLongMedRecord;
        //短期医嘱
        this.prescription.empiTempMedRecord = result.data.empiTempMedRecord;
        // 门诊
        this.prescription.recipeVisitList = result.data.recipeVisitList;
      }
    },
    // 查询/ehr/selectOrderItemDrugTypeCount
    // //typeCode: 门诊 10西药 11 中药 9中成药   住院：1西药 3 中药 2中成药 isAdvice：0住院 1 门诊
    async selectOrderItemDrugTypeCount(obj) {
      let result = await selectOrderItemDrugTypeCount(obj);
      if (result.code == 1) {
        let resultData = result.data.adviceVOList;
        if (resultData && resultData.length > 0) {
          this.prescription.activities = resultData;
          this.selectOrderItemDrugTypeDetail(this.prescription.rightData);
        } else {
          // this.$message.warning('没有数据');
        }
        if (result.data.hrpDrugDicPOList) {
          this.prescription.specialInstructions =
            result.data.hrpDrugDicPOList.note;
        }
      } else {
        this.$message.error(result.msg || "请求失败???");
      }

      console.log(this.prescription.activities, "selectOrderItemDrugTypeCount");
    },

    handleClick(tab, event) {
      if (tab.paneName == "-1") {
        this.$emit("drawerrue", false);
      }
      if (tab.paneName == this.activeNameOld) {
        this.activeName = "";
        this.$emit("drawerrue", false);
      } else {
        this.activeNameOld = this.activeName;
      }
      if (tab.paneName == "second") {
        this.$refs.inspectionReportLeft.selectEasApplyAssay();
      }
      if (tab.paneName == "third") {
        this.$refs.checkReportLeft.selectEasApplyExam();
      }
      if (tab.paneName == "five") {
        this.$refs.recordsTheDocument.changeCallBack();
      }
    },
    backFun() {
      this.$emit("drawerrue", false);
    },
  },
  watch: {
    drawerrueData: function () {
      console.log(this.drawerrueData);
      this.prescription.rightData.isAdvice = this.drawerrueData.isAdvice;
      this.prescription.rightData.visitCode = this.drawerrueData.code;
      this.selectOrderItemDrugTypeCount(this.prescription.rightData);
      this.$refs.inspectionReportLeft.visitCode = this.drawerrueData.code;
    },
  },
};
</script>

<style scoped lang="scss">
.summaryinfoDrawer {
  .summaryinfoDrawer-Wrap {
    padding: 15px 0 10px 0;
  }
  .recordCreate /deep/ .el-tabs--left {
    height: 100%;
  }
  .backStyle {
    float: right;
  }
  .askThat-top {
    height: auto;
  }
  .askThat-text {
    height: 17px;
    font-size: 12px;
    color: rgba(148, 157, 163, 1);
    line-height: 17px;
  }
  .askThat-text1 {
    height: 56px;
    font-size: 12px;
    color: rgba(46, 50, 58, 1);
    line-height: 30px;
  }
  .specificStyle {
    font-size: 18px;
    color: rgba(96, 93, 90, 1);
    line-height: 22px;
  }
  .doctordviceA-wrap {
    height: 100%;
    padding: 10px;
  }
  .doctordviceA-list-top span {
    display: inline-block;
  }
  .point-style {
    border-radius: 50%;
    border: 3px solid #000000;
  }
  .doctordviceA-text1 {
    height: 20px;
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
  }
  .doctordviceA-text2 {
    height: 20px;
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
  }
  .el-card-style {
    width: 100%;
    // margin: 15px;
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
  }
  .doctordviceA-list-bottom {
    padding: 10px;
    box-sizing: border-box;
  }
  .marginBottom {
    margin-bottom: 10px;
  }
  // 检查报告
  .inspectionReport {
    width: 100%;
    height: 100%;
  }
  .inspectionReport-left {
    width: 30%;
    float: left;
    padding-right: 20px;
  }
  .inspectionReport-right {
    width: 70%;
    float: right;
  }
}
</style>
