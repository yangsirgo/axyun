<template>
  <div class="layout-history">
    <div class="head">
      <div>历史信息</div>
      <div class="head-before"></div>
    </div>
    <div class="history_table_class">
      <el-table :data="tableData" stripe border @row-click="listRowClick"  height="250" style="width: 100%">
        <el-table-column
          v-for="(item,index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          class="overflow-point"
          header-align="center">
          <template slot-scope="fileScope">
            <template v-if="item.prop == 'patientName'">
              <!-- getAge(strSplit(fileScope.row['birthDate'],' '))-->
              <span style="color:#3D7DFB;cursor: pointer" @click="fileDetail(fileScope.row['patientNum'])">{{ fileScope.row['patientName']}} {{ fileScope.row['patientGender']==1?'男':'女'}} {{fileScope.row['patientAge']}}</span>
            </template>
            <template v-else>
              <span>{{ fileScope.row[item.prop]}}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-steps :active="2" align-center>
        <el-step title="步骤1" description=""></el-step>
        <el-step title="步骤2" description=""></el-step>
        <el-step title="步骤3" description=""></el-step>
        <el-step title="步骤4" description=""></el-step>
      </el-steps>
    </div>

  </div>
</template>

<script>
    export default {
        name: "labHistory",
        data() {
            return {
                tableData: [],
                tableParams: [
                    {
                        prop: "patientName",
                        label: "进度",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "patientName",
                        label: "申请日期",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "patientName",
                        label: "项目",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "patientName",
                        label: "状态",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "patientName",
                        label: "备注",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "patientName",
                        label: "费用状态",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "patientName",
                        label: "申请科室",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "patientName",
                        label: "申请医生",
                        align: "center",
                        width: "30"
                    }
                ]
            }

        },
        methods:{
            listRowClick(){

            }
        }
    }
</script>

<style scoped lang="scss">
  .layout-history {
    float: left;
    width: 50%;
    padding-top: 10px;
  }

  .history_table_class {
    margin-left: 10px;
  }

  .head {
    height: 24px;
    margin-bottom: 20px;
    font-size: 16px;
    
    font-weight: 500;
    color: $l-color-fontcolor-3;
    line-height: 24px;
    position: relative;
    left: 35px;

    .head-before {
      width: 4px;
      height: 20px;
      background: $l-color-primary;
      position: absolute;
      left: -22px;
      top: 0;
    }
  }

</style>
