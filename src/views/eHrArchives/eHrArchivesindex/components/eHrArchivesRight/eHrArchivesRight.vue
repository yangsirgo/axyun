<template>
  <div class="eHrArchivesRight">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClickWrap">
      <el-tab-pane label="集成视图" name="first">集成视图</el-tab-pane>
      <el-tab-pane label="病历" name="second">病历</el-tab-pane>
      <el-tab-pane label="诊断" name="third">
        <div class="diagnosisBox">
          <h3 class="diagnosish3">诊断</h3>
          <el-col :span="24" class="attributeBox">
            <el-col class="attributeelCol">
              <span class="attributeSpan">姓名:</span>
              <span class="valueSpan">{{ basicData.patientName }}</span>
            </el-col>
            <el-col class="attributeelCol">
              <span class="attributeSpan">性别:</span>
              <span class="valueSpan">{{ basicData.patientSex }}</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">年龄:</span>
              <span class="valueSpan">{{ basicData.patientAge }}</span>
            </el-col>
            <el-col class="attributeelCol">
              <span class="attributeSpan">科别:</span>
              <span class="valueSpan">{{ basicData.deptName }}</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">病区:</span>
              <span class="valueSpan">{{ basicData.wardId }}</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">床位:</span>
              <span class="valueSpan">{{ basicData.bedCode }}</span>
            </el-col>

            <el-col class="attributeelCol">
              <span class="attributeSpan">住院号:</span>
              <span class="valueSpan">{{ basicData.inpCode }}</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-table :data="inspectTableData" height="500" border style="width: 100%">
              <el-table-column label="诊断类型">
                <template slot-scope="scope">
                  <span style="text-align: center;">{{ scope.row.diagType == 1 ? '出院诊断' : scope.row.diagType == 2 ? '门诊诊断' : '入院诊断' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="中/西医">
                <template slot-scope="scope">
                  {{ scope.row.cwFlag == 1 ? '西医' : '中医' }}
                </template>
              </el-table-column>
              <el-table-column prop="diagCode" label="诊断编码"></el-table-column>
              <el-table-column prop="diagName" label="诊断名称"></el-table-column>
              <el-table-column prop="diagIcd" label="诊断描述"></el-table-column>
              <el-table-column prop="tcmSyndrome" label="中医证型"></el-table-column>
              <el-table-column prop="address" label="发病日期"></el-table-column>
              <el-table-column label="初复诊">
                <template slot-scope="scope">
                  <span style="text-align: center;">{{ scope.row.isFirst == 1 ? '初诊' : scope.row.isFirst == 2 ? '复诊' : '预留' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="diagDoctorName" label="诊断医生"></el-table-column>
              <el-table-column prop="diagTime" label="诊断日期"></el-table-column>
            </el-table>
          </el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane label="医嘱" name="fourth">
        <el-tabs type="border-card" v-model="ordersActiveName" :tab-position="tabPosition" @tab-click="ordersClickWrap" style="height: auto;width:auto;">
          <el-tab-pane :label="ordersueryDataQ.diagType == 3 ? '长期医嘱' : '医嘱'" name="1">
            <div class="diagnosisBox">
              <h3 class="diagnosish3">{{ ordersueryDataQ.diagType == 3 ? '长期医嘱' : '医嘱' }}</h3>
              <el-col :span="24" class="attributeBox" v-if="tableDataStyle">
                <el-col class="attributeelCol">
                  <span class="attributeSpan">姓名:</span>
                  <span class="valueSpan">{{ basicData.patientName }}</span>
                </el-col>
                <el-col class="attributeelCol">
                  <span class="attributeSpan">性别:</span>
                  <span class="valueSpan">{{ basicData.patientSex }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">年龄:</span>
                  <span class="valueSpan">{{ basicData.patientAge }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">科别:</span>
                  <span class="valueSpan">{{ basicData.deptName }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">病区:</span>
                  <span class="valueSpan">{{ basicData.wardId }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">床位:</span>
                  <span class="valueSpan">{{ basicData.bedCode }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">住院号:</span>
                  <span class="valueSpan">{{ basicData.inpCode }}</span>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-table :data="orderTableData" height="400" style="width: 100;min-height: 400px;" v-if="ordersueryDataQ.diagType != 2">
                  <el-table-column prop="date" label="起时" align="center">
                    <el-table-column prop="adviceDate" label="日期"></el-table-column>
                    <el-table-column prop="advice" label="时间"></el-table-column>
                    <el-table-column label="医嘱">
                      <template slot-scope="scope">
                        <span style="text-align: center;display: inline-block;">{{ scope.row.name }}</span>
                        <span style="text-align: center;display: inline-block;" :class="[scope.row.status == 4 ? 'fontRed' : '']">{{ scope.row.status == 4 ? '停止' : '' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="doctorName" label="医生签字"></el-table-column>
                    <el-table-column prop="executeName" label="护士签字"></el-table-column>
                  </el-table-column>
                  <el-table-column label="停止" align="center">
                    <el-table-column prop="stopDoctorDate" label="日期"></el-table-column>
                    <el-table-column prop="stopDoctor" label="时间"></el-table-column>
                    <el-table-column prop="stopDoctorName" label="医生签字"></el-table-column>
                    <el-table-column prop="executeName" label="护士签字"></el-table-column>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col>
                <el-table :data="orderTableData" height="400" border style="width: 100;min-height: 400px;" v-if="ordersueryDataQ.diagType == 2">
                  <el-table-column prop="diagnosisDate" label="日期"></el-table-column>
                  <el-table-column prop="diagnosis" label="时间"></el-table-column>
                  <el-table-column label="医嘱">
                    <template slot-scope="scope">
                      <span style="text-align: center;display: inline-block;">{{ scope.row.orderItemName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="doctorName" label="医生签字"></el-table-column>
                  <el-table-column prop="executeName" label="护士签字"></el-table-column>
                </el-table>
              </el-col>
            </div>
          </el-tab-pane>
          <el-tab-pane label="临时医嘱" name="2" v-if="ordersueryDataQ.diagType == 3">
            <div class="diagnosisBox">
              <h3 class="diagnosish3">临时医嘱</h3>
              <el-col :span="24" class="attributeBox" v-if="tableDataStyle">
                <el-col class="attributeelCol">
                  <span class="attributeSpan">姓名:</span>
                  <span class="valueSpan">{{ basicData.patientName }}</span>
                </el-col>
                <el-col class="attributeelCol">
                  <span class="attributeSpan">性别:</span>
                  <span class="valueSpan">{{ basicData.patientSex }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">年龄:</span>
                  <span class="valueSpan">{{ basicData.patientAge }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">科别:</span>
                  <span class="valueSpan">{{ basicData.deptName }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">病区:</span>
                  <span class="valueSpan">{{ basicData.wardId }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">床位:</span>
                  <span class="valueSpan">{{ basicData.bedCode }}</span>
                </el-col>

                <el-col class="attributeelCol">
                  <span class="attributeSpan">住院号:</span>
                  <span class="valueSpan">{{ basicData.inpCode }}</span>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-table :data="shortrorderTableData" height="400" style="width: 100;min-height: 400px;">
                  <el-table-column prop="date" label="起时" align="center">
                    <el-table-column prop="adviceDate" label="日期"></el-table-column>
                    <el-table-column prop="advice" label="时间"></el-table-column>
                    <el-table-column prop="name" label="医嘱"></el-table-column>
                    <el-table-column prop="doctorName" label="医生签字"></el-table-column>
                    <el-table-column prop="executeName" label="护士签字"></el-table-column>
                  </el-table-column>
                </el-table>
              </el-col>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="检查" name="five">
        <el-col :span="4">
          <div class="inspectFiveLeft">
            <el-col
              class="inspectFiveLeftList"
              v-for="(item, index) in inspectFiveLeftList"
              :key="index"
              @click.native="inspectFiveLeftListChange(index)"
              :class="{ inspectFiveLeftListChange: inspectFiveLeftListindex == index }"
            >
              <el-col class="inspectFiveLeftList-top">
                <span class="inspectFiveLeftList-textA">{{ item.name }}</span>
                <span class="inspectFiveLeftList-textB">{{ item.time }}</span>
              </el-col>
              <el-col class="inspectFiveLeftList-textC">{{ item.inspect }}</el-col>
            </el-col>
          </div>
        </el-col>

        <el-col :span="20">
          <div class="inspectFiveRight">
            <div class="diagnosisBox">
              <h3 class="diagnosish3">检验报告单</h3>
              <el-col :span="24" class="attributeBox">
                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">姓名</span>
                  <span class="valueSpan">张三</span>
                </el-col>
                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">性别</span>
                  <span class="valueSpan">男</span>
                </el-col>

                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">年龄</span>
                  <span class="valueSpan">23</span>
                </el-col>

                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">档案号</span>
                  <span class="valueSpan">25454875</span>
                </el-col>
              </el-col>

              <el-col :span="24">
                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">送检科室</span>
                  <span class="valueSpan">内科</span>
                </el-col>

                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">送检医生</span>
                  <span class="valueSpan">里斯</span>
                </el-col>

                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">标本类型</span>
                  <span class="valueSpan">03</span>
                </el-col>

                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">床号</span>
                  <span class="valueSpan">12312</span>
                </el-col>
              </el-col>

              <el-col :span="24">
                <el-table :data="tableData" max-height="400px" border style="width: 100%">
                  <el-table-column prop="date" label="代码"></el-table-column>
                  <el-table-column prop="name" label="中文名称"></el-table-column>
                  <el-table-column prop="address" label="结果"></el-table-column>
                  <el-table-column prop="address" label="单位"></el-table-column>
                  <el-table-column prop="address" label="异常显示"></el-table-column>
                  <el-table-column prop="address" label="参考值"></el-table-column>

                  <el-table-column prop="address" label="药敏结果"></el-table-column>
                  <el-table-column prop="address" label="危机提示"></el-table-column>
                  <el-table-column prop="address" label="诊断医生"></el-table-column>
                  <el-table-column prop="address" label="诊断日期"></el-table-column>
                </el-table>
              </el-col>
              <el-col :span="24">
                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">修改日期：</span>
                  <span class="valueSpan">20200202</span>
                </el-col>
                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">报告日期：</span>
                  <span class="valueSpan">男</span>
                </el-col>

                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">检验者：</span>
                  <span class="valueSpan">23</span>
                </el-col>

                <el-col class="attributeelCol attributeelColwidth">
                  <span class="attributeSpan">审核人：</span>
                  <span class="valueSpan">内科</span>
                </el-col>
                <el-col :span="24">
                  <el-col class="attributeelCol attributeelColwidth"><span class="attributeSpan">#本次报告仅对本标本负责#</span></el-col>
                </el-col>
              </el-col>
            </div>
          </div>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="检验" name="six">检验</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { selectAdviceByHospitalNo } from '@/api/eHrArchives/eHrArchives';
export default {
  data() {
    return {
      // 检查的左侧的for 数据
      // 添加样式
      inspectFiveLeftListindex: 0,
      inspectFiveLeftList: [
        {
          name: '血常规',
          time: '2020-05-05',
          inspect: '检验科已发布'
        },
        {
          name: '血常规',
          time: '2020-05-05',
          inspect: '检验科已发布'
        }
      ],
      //start （历次就诊的诊断）
      // 基本数据包
      basicData: {
        patientName: '', //姓名
        patientAge: '', //年龄
        patientSex: '', //性别
        deptName: '', //科别
        inpCode: '' //住院号
      },
      inspectTableData: [],
      // end   （历次就诊的诊断）

      // start (历次就诊的医嘱)
      // 查询没有数据
      tableDataStyle: true,
      // 查询数据
      ordersueryDataQ: {
        inpCode: '', //住院号
        visitCode: '', //就诊ID(门诊ID)
        diagType: '', //医嘱类型
        categoryCode: '' //1:长期 2:临时*/
      },
      orderTableData: [],
      shortrorderTableData: [],

      // end (历次就诊的医嘱)

      // 左侧传回来的值
      eHrArchivesRightData: {},
      // 医嘱的table
      tabPosition: 'left',
      activeName: 'fourth',
      ordersActiveName: '1',
      // 表格假数据

      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    };
  },

  created() {},
  methods: {
    //start 遗嘱
    ordersClickWrap(tab, event) {
      this.orderTableData = [];
      this.shortrorderTableData = [];
      this.ordersueryDataQ.categoryCode = this.ordersActiveName;
      this.selectAdviceByHospitalNo(this.ordersueryDataQ);
    },
    // 列表接口
    async selectAdviceByHospitalNo(obj) {
      let result = await selectAdviceByHospitalNo(obj);
      if (result.success) {
        this.orderTableData = result.data;
        if (this.ordersActiveName == 1) {
          this.orderTableData = result.data.outpatientAdviceVOList;
        } else {
          this.shortrorderTableData = result.data.adviceVOList;
        }
        // console.log(this.orderTableData, 'this.orderTableData');
        if (result.data.length <= 0) {
          this.tableDataStyle = false;
        } else {
          this.tableDataStyle = true;
        }
      }
    },

    //end 遗嘱
    //上侧 table切换
    handleClickWrap(tab, event) {
      // console.log(tab, event);
    },
    // 左侧切换
    inspectFiveLeftListChange(index) {
      this.inspectFiveLeftListindex = index;
    }
  },
  watch: {
    //父组件传过来的值
    eHrArchivesRightData: {
      handler(newVal) {
        this.inspectTableData = [];
        if (this.eHrArchivesRightData) {
          this.inspectTableData.push(this.eHrArchivesRightData);
          // 左侧传值的过来获取医嘱查询条件字段值
          // console.log(this.eHrArchivesRightData, 'this.eHrArchivesRightData');
          this.ordersueryDataQ.inpCode = this.eHrArchivesRightData.inpCode;
          this.ordersueryDataQ.visitCode = this.eHrArchivesRightData.visitCode;
          this.ordersueryDataQ.diagType = this.eHrArchivesRightData.diagType;
          if (this.ordersueryDataQ.diagType == 3) {
            this.ordersueryDataQ.categoryCode = 1;
          } else {
            this.ordersueryDataQ.categoryCode = '';
            this.ordersActiveName = '1';
          }
          // 查询遗嘱
          this.selectAdviceByHospitalNo(this.ordersueryDataQ);
          //
          for (let obj in this.eHrArchivesRightData) {
            if (this.eHrArchivesRightData[obj].length < 1) {
              this.basicData[obj] = '--';
            } else {
              this.basicData[obj] = this.eHrArchivesRightData[obj];
            }
          }
        }
        // console.log(this.basicData, '获取父组件的值');
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.eHrArchivesRight {
  width: 100%;
  height: 100%;
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .fontRed {
    font-size: 14px;
    color: red;
    margin-left: 8px;
  }
  .inspectFiveLeftList-top {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .inspectFiveLeft {
    overflow: auto;
    height: 100%;
    border-right: 1px solid rgba(228, 228, 228, 1);
  }
  .inspectFiveLeftList {
    cursor: pointer;
    box-sizing: border-box;
    padding: 5px;
  }
  .inspectFiveLeftListChange {
    border-left: 2px solid rgba(44, 69, 131, 1);
    background: rgba(241, 244, 246, 1);
  }
  .inspectFiveLeftList-textA {
    font-size: 12px;
    color: rgba(46, 50, 58, 1);
    line-height: 17px;
  }
  .inspectFiveLeftList-textB {
    font-size: 12px;
    color: rgba(46, 50, 58, 1);
    line-height: 16px;
  }
  .inspectFiveLeftList-textC {
    font-size: 12px;
    color: rgba(148, 157, 163, 1);
    line-height: 17px;
  }
  .diagnosisBox {
    min-height: 400px;
  }
  .diagnosish3 {
    text-align: center;
  }

  .attributeBox {
    height: auto;
    overflow: auto;
  }

  .attributeelCol {
    width: auto;
    display: inline-block;
    padding: 3px;
    margin-right: 10px;
    box-sizing: border-box;
    float: left;
  }
  .attributeelColwidth {
    width: 25%;
  }
  .attributeSpan {
    display: inline-block;
    font-size: 14px;
    color: rgba(148, 157, 163, 1);
    line-height: 20px;
  }

  .valueSpan {
    display: inline-block;
    font-size: 14px;
    color: rgba(46, 50, 58, 1);
    line-height: 20px;
  }
}
</style>
