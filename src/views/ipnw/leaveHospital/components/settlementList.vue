<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card class="height100">
          <div class="recall-content-box height100">
            <div class="height-button-main">
              <div class="user-info">
                <div style="overflow: hidden;margin-top: 20px">
                  <div class="title fl">
                    <i></i>
                    <b>患者信息</b>
                  </div>
                </div>
                <div class="info">
                  <div>
                    <p v-for="(item, i) in patientInfoKey" :key="i">
                      <span class="babel">{{item.label}}</span>
                      <template v-if="item.key === 'patientGender' ">
                        <span
                          v-if="patientInfo[item.key]"
                          :val="patientInfo[item.key]"
                          code="GENDER_CODE"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else-if="item.key === 'settlementType'">
                        <span
                          v-if="!!patientInfo[item.key]"
                          :val="patientInfo[item.key]"
                          code="MEDICAL_INSURANCE_CODE"
                          v-codeTransform
                        ></span>
                        <span v-else>--</span>
                      </template>
                      <template v-else-if="item.key === 'wardId'">
                        <span
                          v-if="!!patientInfo[item.key]"
                          tableName="sys_ward"
                          :conditionMap="{ward_code:patientInfo[item.key]}"
                          columns="ward_name"
                          v-tableTransform
                        ></span>
                        <span v-else>--</span>
                      </template>
                      <span v-else-if="item.key == 'patientAge'">{{receivePatientData.patientAge}}</span>
                      <template v-else-if="item.key === 'inpSdeptId'">
                        <!-- 暂时用 admissionSdeptId -->
                        <span
                          v-if=" patientInfo['admissionSdeptId']"
                          tableName="sys_org"
                          :conditionMap="{org_type: '_DEPT_', id: patientInfo['admissionSdeptId']}"
                          columns="org_nm"
                          v-tableTransform
                        ></span>
                        <span v-else>--</span>
                      </template>
                      <!-- 天数 -->
                      <template v-else-if="item.key === 'dayNo'">
                        <span v-if="patientInfo['dayNo'] || patientInfo['dayNo'] == 0">{{patientInfo[item.key] }}</span>
                        <span v-else>--</span>
                      </template>
                      <span v-else :style="item.style">{{patientInfo[item.key] || '--'}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="out-info">
                <div style="overflow: hidden;margin-bottom: 16px;">
                  <div class="title">
                    <i></i>
                    <b>费用信息</b>
                  </div>
                </div>
                <!-- <div class="user-info">
                  <div class="info">
                    <div v-if="list">
                      <p v-for="(item, i) in list" :key="i">
                        <span
                          class="babel"
                          :val="item.classCode"
                          code="FinClassCode"
                          v-codeTransform
                        ></span>
                        <span>{{item.totalMoney.toFixed(2) || '0.00'}} 元</span>
                      </p>
                    </div>
                    <div v-if="list.length <= 0">
                      <span class="babel">该患者暂无费用数据</span>
                    </div>
                  </div>
                </div> -->
                <!-- 费用明细表格 -->
                <div>
                  <el-table
                    :data="tableData"
                    border
                    stripe
                  >
                    <el-table-column
                      v-for="(item, index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      header-align="left"
                      :align="item.align || 'left'"
                      show-overflow-tooltip
                      :fixed="item.fixed === true"
                    >
                      <template slot-scope="scope">
                        <!--操作部分自定义-->
                        <template v-if="item.prop == 'controlLevel'">
                          <span :val="scope.row['controlLevel']" code="DrugReimbursementType" v-codeTransform></span>
                        </template>
                        <template  v-else-if="item.prop == 'classCode'">
                          <span :val="scope.row['classCode']" code="FinClassCode" v-codeTransform></span>
                        </template>
                        <template v-else-if="item.prop == 'inpSdeptId'">
                          <span
                            tableName="sys_org"
                            :conditionMap="{
                              org_type: '_DEPT_',
                              id: scope.row[item.prop]
                            }"
                            columns="org_nm"
                            v-tableTransform
                          ></span>
                        </template>
                        <template v-else-if="item.prop == 'chargePrice'">
                          <span>{{scope.row[item.prop].toFixed(2)}}</span>
                        </template>
                        <template v-else-if="item.prop == 'chargeAmount'">
                          <span>{{scope.row[item.prop].toFixed(2)}}</span>
                        </template>
                        <template v-else-if="item.prop == 'itemQuantity' && scope.row['packingUnit'] > 0">
                          <span>{{scope.row["bigUnitNum"]}}</span>
                          <span
                            :val="scope.row['packUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                          <span>{{scope.row["minUnitNum"]}}</span>
                          <span
                            :val="scope.row['chargeUnit']"
                            code="DrugUnit"
                            v-codeTransform
                            class="special-color"
                          ></span>
                        </template>
                        <template v-else-if="item.prop == 'itemQuantity' && scope.row['packingUnit'] <= 0">
                          <span>{{scope.row["itemQuantity"]}}</span>
                          <span>{{scope.row["chargeUnit"]}}</span>
                        </template>
                        <template v-else>
                          <span class="overflow-point">{{ scope.row[item.prop] }}</span>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

              </div>
            </div>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LeftBar from "./settlementListLeftBar.vue";
import { getTotalItemDetails, getItemDetailsKeys, getchargeItemDetail } from "@/api/ipnw/leaveHos";
import { blukToOutfit } from "@/utils/drugManagement";

export default {
  name: "inpatientArea",
  components: {
    LeftBar
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  data() {
    return {
      tableList: [],
      patientInfo: {},
      patientInfoKey: [
        {
          label: "姓名",
          key: "patientName",
          style: {}
        },
        {
          label: "性别",
          key: "patientGender",
          style: {}
        },
        {
          label: "年龄",
          key: "patientAge",
          style: {}
        },
        {
          label: "档案号",
          key: "patientCode",
          style: {
            color: "#3D7DFB"
          }
        },
        {
          label: "住院号",
          key: "inpCode",
          style: {
            color: "#3D7DFB"
          }
        },
        {
          label: "科室",
          key: "inpSdeptId",
          style: {}
        },
        {
          label: "病区",
          key: "wardId",
          style: {}
        },
        {
          label: "入院日期",
          key: "wdeptAdmissionTime",
          style: {}
        },
        {
          label: "天数",
          key: "dayNo",
          style: {}
        },
        {
          label: "结算日期",
          key: "finSettlementTime",
          style: {}
        },
        {
          label: "结算类型",
          key: "settlementType",
          style: {}
        }
      ],
      // 费用明细列表
      list: [],
      toolBoxs: [],
      // 表格表头
      tableParams: [
        {
          label: "计费时间",
          prop: "calculateFeeTime",
          width: "150",
          align: "left"
        },
        {
          label: "费用类型",
          prop: "controlLevel",
          width: "80",
          align: "left"
        },
        {
          label: "项目类型",
          prop: "classCode",
          width: "100",
          align: "left"
        },{
          label: "费用名称",
          prop: "itemName",
          width: "150",
          align: "left"
        },{
          label: "单价",
          prop: "chargePrice",
          width: "100",
          align: "right"
        },{
          label: "数量",
          prop: "itemQuantity",
          width: "60",
          align: "left"
        },{
          label: "金额",
          prop: "chargeAmount",
          width: "100",
          align: "right"
        },{
          label: "计费人员",
          prop: "chargeUserName",
          width: "100",
          align: "left"
        },{
          label: "计费部门",
          prop: "inpSdeptId",
          width: "100",
          align: "left"
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  methods: {
    // 获取收费项 分类及金额
    async getItemDetailsKeys() {
      try {
        let res = await getItemDetailsKeys({
          inpCode: this.receivePatientData.inpCode
        });
        if (res.code === 1) {
          this.list = res.data;
        } else {
          this.$message.error(res.msg || "获取收费项失败");
        }
      } catch (e) {
        this.$message.error(res.msg || "获取收费项失败");
      }
    },
    // 获取收费明细
    async getchargeItemDetailVO() {
      try {
        let res = await getchargeItemDetail({
          inpCode: this.receivePatientData.inpCode
        });
        if (res.code == 1) {
          this.tableData = res.data;
          this.tableData.forEach(item=>{
            if (item.packingUnit > 0) {   // 包装量大于0 是药品
              let unitInfo = blukToOutfit(item.itemQuantity, item.packingUnit);
              this.$set(item, "bigUnitNum", unitInfo.out); // bigUnitNum  大单位数量
              this.$set(item, "minUnitNum", unitInfo.bl); // minUnitNum  小单位数量
            }
          })
        } else {
          this.$message.error(res.msg || "获取收费项失败");
        }
      } catch (e) {
        this.$message.error(res.msg || "获取收费项失败");
      }
    },
    messageHandler() {
      consle.log("工具箱消息");
    },
    // 计算患者入院天数
    getDayNo(patientInfo){
      let nowDate = new Date().getTime();
      let inpDate = new Date(patientInfo.wdeptAdmissionTime).getTime();
      let dayNo = Math.floor((nowDate - inpDate) / (60 * 60 * 24 * 1000)); // 向下取整
      this.$set(patientInfo,"dayNo",dayNo)
   }
  },
  created() {
    this.getItemDetailsKeys();
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        // 监听 患者 ID 变化 触发事件
        this.patientInfo = {...val};
        // 计算天数
        this.getDayNo(this.patientInfo);
        // 获取患者所有费用 分类及金额
        this.getItemDetailsKeys();
        this.getchargeItemDetailVO();
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.recall-content-box {
  // border-top: 1px solid #E4E4E4;
  padding: 0 20px;

  .title {
    font-size: 16px;
    
    font-weight: 500;
    color: rgba(46, 50, 58, 1);

    i {
      display: inline-block;
      width: 4px;
      height: 20px;
      background: $l-color-primary;
      margin-right: 5px;
      position: relative;
      top: 4px;
    }
  }

  ul {
    li {
      height: 60px;
      font-size: 16px;
      
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
      line-height: 24px;

      p {
        margin: 0;
        line-height: 60px;

        span {
          padding: 0 5px;
        }

        .black {
          color: #2e323a;
        }

        .blue {
          color: #3d7dfb;
        }

        .gray {
          color: #949da3;
        }

        .em {
          font-weight: 600;
        }

        img {
          width: 60px;
        }
      }
    }
  }

  .user-info {
    .info {
      margin: 10px 0;

      & > div {
        overflow: hidden;

        p {
          width: 240px;
          font-size: 14px;
          line-height: 20px;
          margin: 10px 0;
          float: left;

          .babel {
            color: #949da3;
            display: inline-block;
            width: 56px;
            margin-right: 10px;
          }
        }
      }
    }
  }

  .out-info {
    .info {
      margin: 20px 0;
      overflow: hidden;

      & > p {
        width: 240px;
        height: 36px;
        line-height: 36px;
        /*border: 1px solid #e4e4e4;*/
        border-radius: 2px;
        margin-right: 10px;
        margin-bottom: 10px;
        float: left;
        color: #2e323a;
        background: rgba(245, 245, 245, 1);

        .babel {
          color: #949da3;
          margin-left: 10px;
          margin-right: 10px;
          padding-right: 10px;
          border-right: 1px solid #e4e4e4;
        }
      }

      & > p:first-child {
        margin-left: 0px;
      }
    }
  }
}

.label {
  font-size: 14px;
  
  font-weight: 400;
  color: rgba(148, 157, 163, 1);
  line-height: 20px;
  vertical-align: middle;
}
.labelContent {
  font-size: 14px;
 
  font-weight: bold;
  color: rgba(46, 50, 58, 1);
  margin-left: 10px;
  vertical-align: middle;
}
.topPart > span {
  vertical-align: 12px;
}

.error {
  color: #e1140a;
}
</style>
