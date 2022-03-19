


<!--- 
  旧版界面 准备删掉
  2020/06/05
  shaokang
 ----->


<template>
  <div class="scheduling-main width100 height100">
    <el-card class="scheduling float-left height100"
             :style="{'width': toolBoxExpanded ? 'calc(100% - 307px)' : 'calc(100% - 66px)'}">
      <div class="navBar clearfix">
        <div class="float-left">
          <LFormtTitle label="选择科室">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="searchData.deptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder=""
              style="width:100%"
              @change="deptChange"
            ></l-value-domain>
          </LFormtTitle>
        </div>
        <div class="float-left margin-left-20" style="margin-top: 8px">
          <el-radio-group v-model="radio" @change="methodChange">
            <el-radio :label="0">按日期排班</el-radio>
            <el-radio :label="1">按医生查看排班表</el-radio>
          </el-radio-group>
        </div>

        <div class="float-right margin-left-20">
          <el-button type="primary" plain @click="saveStage">暂存</el-button>
        </div>
        <div class="float-right margin-left-20">
          <el-button type="primary" @click="publishSchel">发布排班</el-button>
        </div>
        <div class="float-right margin-left-20">
          <el-button type="text" @click="deleteAll"><i class="iconfont iconqingjieliulanqi"></i> 清空所有</el-button>
        </div>

        <div class="line float-right margin-left-20"></div>
        <div class="float-right">
          <el-button type="text" @click="dialogVisible = true"><i class="iconfont iconzancun"></i> 存为本科室周排班模版
          </el-button>
        </div>
      </div>

      <div class="table-cont height100" v-if="radio=='0'">
        <div class="table-title width100">
          <div class="table-title-cont">
            <div class="left" @click="getLastWeekSchedul">< 第{{Number(currentWeek)-1}}周</div>
            <div class="line margin-left-20"></div>
            <div class="center">第 {{currentWeek}} 周 {{dateList[0].date}} 至 {{dateList[6].date}}</div>
            <div class="line"></div>
            <div class="right margin-left-20" @click="getNextWeekSchedul">第{{Number(currentWeek)+1}}周 ></div>
          </div>
        </div>
        <el-table
          ref="scheduleTable"
          :data="schedulingData"
          width="100%"
          height="calc(100% - 118px)"
          border
          v-loading="loading"
          :span-method="objectSpanMethod"
        >
          <el-table-column
            v-for="(item, index) in schedulingParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="scope.row['operate']=='0'">
                <template v-if="item.prop == 'date'">
                  <span class="dateFont">{{strSplit(scope.row[item.prop],'-')[1]}}-{{strSplit(scope.row[item.prop],'-')[2]}}</span>
                  <el-button type="primary" plain @click="add(scope.row,scope.$index)" class="addSchedul">添加排班
                  </el-button>
                </template>
                <template v-else-if="item.prop == 'operate'">
                  <el-button type="text" @click="editItem(scope.row,scope.$index)">编辑</el-button>
                  <el-button type="text" @click="delteItem(scope.row,scope.$index)">删除</el-button>
                  <!--<el-button type="text" @click="editItem(scope.row,scope.$index)">停诊</el-button>-->
                </template>
                <template v-else-if="item.prop == 'recordStatus'">
                  <span v-if="scope.row[item.prop]=='1'">发布</span>
                  <span v-else-if="scope.row[item.prop]=='2'">暂存</span>
                  <span v-else-if="scope.row[item.prop]=='9'">停诊</span>
                </template>
                <template v-else-if="item.prop == 'doctorId'">
                   <span
                     tableName="sys_user"
                     :conditionMap="{ID: scope.row[item.prop] || ''}"
                     columns="NAME"
                     v-tableTransform
                   ></span>
                </template>
                <template v-else-if="item.prop == 'diagTreatType'">
                 <span
                   tableName="appt_diag_treat_type"
                   :conditionMap="{DIAG_TREAT_TYPE_CODE: scope.row[item.prop] || ''}"
                   columns="DIAG_TREAT_TYPE_NAME"
                   v-tableTransform
                 ></span>
                </template>
                <template v-else-if="item.prop == 'classesId'">
                  <span
                    tableName="appt_class"
                    :conditionMap="{CLASS_ID: scope.row[item.prop] || ''}"
                    columns="CLASS_NAME"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else-if="item.prop=='dutyStartTime'||item.prop=='dutyStopTime'">
                  <span>{{strSplit(scope.row[item.prop], ' ')[1]}}</span>
                </template>
                <template v-else-if="item.prop == 'roomId'">
                  <span
                    tableName="appt_room_station"
                    :conditionMap="{ID: scope.row[item.prop] || ''}"
                    columns="DATA_NAME"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else-if="item.prop=='unifyPool'">
                  <span v-if="scope.row[item.prop]=='1'">是</span>
                  <span v-if="scope.row[item.prop]=='2'">否</span>
                </template>
                <!-- 已加号数量 -->
                <template v-else-if="item.prop == 'appendNum'">
                  {{scope.row[item.prop]}}
                </template>
                <!-- 加号数量 -->
                <template v-else-if="item.prop == 'addNum'">
                  <el-input-number v-model="scope.row[item.prop]" :min="0"
                                   :controls=false
                                   :disabled="!scope.row.scheduleId"
                                   style="width: 100%"></el-input-number>
                </template>
                <!-- 确认加号 -->
                <template v-else-if="item.prop == 'submitAdd'">
                  <el-button type="text" :disabled="!scope.row.scheduleId" @click="submitAdd(scope.row)">加号</el-button>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>

              <template v-if="scope.row['operate']=='1'">
                <template v-if="item.prop == 'date'">
                  <span class="dateFont">{{strSplit(scope.row[item.prop],'-')[1]}}-{{strSplit(scope.row[item.prop],'-')[2]}}</span>
                  <el-button type="primary" plain @click="add(scope.row,scope.$index)" class="addSchedul">添加排班
                  </el-button>
                </template>
                <template v-else-if="item.prop == 'operate'">
                  <el-button type="text" @click="editCommit(scope.row,scope.$index)">完成</el-button>
                  <!--<el-button type="text" @click="cancelItem(scope.row,scope.$index)">取消</el-button>-->
                </template>
                <template v-else-if="item.prop == 'recordStatus'">
                  <template v-if="scope.row[item.prop]=='1'">
                    <el-radio-group v-model="scope.row[item.prop]">
                      <el-radio label="9">停诊</el-radio>
                    </el-radio-group>
                  </template>
                  <!--<template v-else>{{scope.row[item.prop]}}</template>-->
                  <template v-else></template>
                </template>
                <template v-else-if="item.prop == 'doctorId'">
                  <l-value-domain
                    clearable
                    :remoteUrl="'/wadmin/dept-doctor/'+searchData.deptId"
                    type="select"
                    :value.sync="scope.row[item.prop]"
                    remoteShowKey="uname"
                    remoteValueKey="uid"
                    placeholder=""
                    style="width:100%"
                    @change="docChange"
                  ></l-value-domain>
                </template>
                <template v-else-if="item.prop == 'workCode'">
                  {{scope.row[item.prop]}}
                </template>
                <!-- 已加号数量 -->
                <template v-else-if="item.prop == 'appendNum'">
                  {{scope.row[item.prop]}}
                </template>
                <!-- 加号数量 -->
                <template v-else-if="item.prop == 'addNum'">
                  <el-input-number v-model="scope.row[item.prop]" :min="0"
                                   :controls=false
                                   :disabled="!scope.row.scheduleId"
                                   style="width: 100%"></el-input-number>
                </template>
                <!-- 确认加号 -->
                <template v-else-if="item.prop == 'submitAdd'">
                  <el-button type="text" :disabled="!scope.row.scheduleId" @click="submitAdd(scope.row)">加号</el-button>
                </template>
                <template v-else-if="item.prop == 'diagTreatType'">
                  <l-value-domain
                    clearable
                    style="width: 100%"
                    :value.sync="scope.row[item.prop]"
                    remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO"
                    type="select"
                    remoteShowKey="diagTreatTypeName"
                    remoteValueKey="diagTreatTypeCode"
                    placeholder=""
                    @change="diagTreatTypeChange(scope.row,scope.$index)"
                  ></l-value-domain>
                </template>
                <template v-else-if="item.prop == 'classesId'">
                  <l-value-domain
                    clearable
                    style="width: 100%"
                    :value.sync="scope.row[item.prop]"
                    remoteUrl="/appointment/class/selectCalss"
                    type="select"
                    remoteShowKey="className"
                    remoteValueKey="classId"
                    placeholder=""
                    @change="classesIdChange(scope.row,scope.$index)"
                  ></l-value-domain>
                </template>
                <template v-else-if="item.prop=='dutyStartTime'||item.prop=='dutyStopTime'">
                  <el-time-picker
                    v-model="scope.row[item.prop]"
                    :clearable="false"
                    format="HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder=""
                    style="width:100%;"
                  >
                  </el-time-picker>
                </template>
                <template v-else-if="item.prop == 'roomId'">
                  <l-value-domain
                    clearable
                    style="width: 100%"
                    :value.sync="scope.row[item.prop]"
                    :remoteParams="roomIdParams"
                    remoteUrl="/appointment/roomStation/params"
                    type="select"
                    remoteShowKey="dataName"
                    remoteValueKey="id"
                    placeholder=""
                  ></l-value-domain>
                </template>
                <template v-else-if="item.prop=='unifyPool'">
                  <el-radio-group v-model="scope.row[item.prop]"
                                  @change="unifyPoolChange(scope.row,scope.$index)"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                  </el-radio-group>
                </template>
                <template v-else-if="item.prop == 'sdeptLimitNum'">
                  <el-input-number v-model="scope.row[item.prop]" :min="0"
                                   style="width: 100%"
                                   :controls=false
                                   @blur="sdeptLimitNumBlur(scope.row,scope.$index)"></el-input-number>
                </template>
                <template v-else-if="item.prop == 'allowAppendNum'">
                  <el-input-number v-model="scope.row[item.prop]" :min="0"
                                   :controls=false
                                   style="width: 100%"></el-input-number>
                </template>
                <template v-else-if="item.prop=='recordStatus'">{{ scope.row[item.prop] }}</template>
                <template v-else-if="item.prop=='reserveNum'">
                  <el-input-number v-model="scope.row[item.prop]" :min="0"
                                   :controls=false
                                   style="width: 100%"
                  ></el-input-number>
                </template>
                <template v-else>
                  <el-input-number v-model="scope.row[item.prop]" :min="0"
                                   :controls=false
                                   style="width: 100%"
                                   :disabled="scope.row['unifyPool'] == '1'"
                  ></el-input-number>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--弹框-->
      <el-dialog
        title="模板"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="300px"
        @open="openTemp"
      >
        <div class="temp-cont">
          <el-row style="margin-bottom: 10px">
            <LFormtTitle label="模板名称">
              <el-input v-model="temp.scheduleTemplateName" placeholder="请输入模板名称"></el-input>
            </LFormtTitle>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <LFormtTitle label="模板备注">
              <el-input v-model="temp.recordRemark" placeholder="请输入模板备注"></el-input>
            </LFormtTitle>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" plain @click="cancelTemp">取消</el-button>
            <el-button type="primary" @click="saveTemp">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <div class="tool-box float-right height100"
         :style="{'width': toolBoxExpanded ? '287px' : '46px'}">
      <tool-box
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        :boxName="defaultBoxName"
        :modules="boxs"
      />
    </div>
  </div>
</template>

<script>
  import ToolBox from "@/views/public/tools";
  import scheManagement from "@/api/schedule/scheduleManagement.js";
  import {mapActions, mapGetters} from 'vuex';
import { type } from 'os';

  export default {
    name: "indexNew2",
    components: {ToolBox},
    data() {
      return {
        radio: 0,
        searchData: {
          deptId: 92
        },
        loading: false,
        currentWeek: '',//当前第几周
        currentWeekList: [],//当前周日期
        dateList: [],//日期
        sourceData: [],//后台返回数据
        dateListSec: [],//表格合并数据
        schedulingData: [],//表格数据
        schedulingParams: [
          {
            prop: "date",
            label: "时间",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "130"
          },
          {
            prop: "recordStatus",
            label: "状态",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "50"
          },
          {
            prop: "operate",
            label: "操作",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "doctorId",
            label: "医生姓名",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "workCode",
            label: "职称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "diagTreatType",
            label: "诊疗类型",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "classesId",
            label: "出诊班次",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "dutyStartTime",
            label: "开诊时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "dutyStopTime",
            label: "结束时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "roomId",
            label: "坐诊诊室",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "reserveNum",
            label: "预留号源",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "sdeptLimitNum",
            label: "总号源数",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },{
            prop: "allowAppendNum",
            label: "允许加号数量",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },{
            prop: "appendNum",
            label: "已加号数量",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },{
            prop: "addNum",
            label: "加号数量",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },{
            prop: "submitAdd",
            label: "确认加号",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          },
          {
            prop: "unifyPool",
            label: "是否统一号源池",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "100"
          } 
        ],
        //workCode: '1737',//由医生名字默认带出的职称
        roomIdParams: {dataType: 3},
        weekIndex: 0,//周时间序列
        // isNewScheduling: '1',//是否新增排班:1新增；0编辑
        channelData: [],//渠道列表
        dialogVisible: false,//弹框显示
        temp: {
          scheduleTemplateName: '',
          recordRemark: ''
        },
        isUpdateTemp: '0',
        scheduleTemplateId: '',
        deleteArr: [],
        //工具箱
        boxs: ['scheTemps', 'schePublish'],
        defaultBoxName: "scheTemps",
        toolBoxExpanded: false
      }
    },
    watch: {
      scheTemplate: {
        async handler(n) {
          if (n) {
            if (n.operate === '1') {
              //引用
              let params1 = {
                templateId: n.templateId
              };
              this.quoteTemp(params1);
            } else if (n.operate === '2') {
              //修改
              this.scheduleTemplate = {
                templateId: n.templateId,
                dataVersion: n.dataVersion
              };
              let params2 = {
                templateId: n.templateId
              };
              await this.editTemp(params2);
              this.isUpdateTemp = '1';
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      ...mapGetters("base", ["scheTemplate"])
    },
    async created() {
      await this.getDateList(this.weekIndex);
      await this.changeSdept({
        deptId: this.searchData.deptId,
        startDate: this.dateList[0].date,
        stopDate: this.dateList[6].date,
        isGet: new Date()
      });
      this.currentWeek = this.whichWeek(this.dateList[0].date);
      await this.getChannel();
      await this.getSchedulingData();
    },
    methods: {
      // 确认加号
      async submitAdd(val){
        try {
          if(!val.scheduleId || (val.scheduleId && val.recordStatus == "2")){
            this.$message("该排班未发布，不能加号");
          }
          this.$showLoading();
          let obj = {...val}
          obj.appendNum = obj.appendNum + obj.addNum;
          let res = await scheManagement.addNum(obj);
          this.$hideLoading();
          if(res.code == '1'){
            this.$message({message: '加号成功',type: 'success'})
            // val.addNum = 0;
            this.getSchedulingData();
          }
        } catch (error) {
          this.$message.error(error.msg || "加号失败");
        }
      },
      //引用模板
      async quoteTemp(data) {
        this.$showLoading();
        try {
          let params = {
            ...data,
            sDate: this.dateList[0].date + ' 00:00:00',
            eDate: this.dateList[6].date + ' 23:59:59'
          };
          let res = await scheManagement.getScheDetail(params);
          if (res.code == '1') {
            this.sourceData = [...res.data.scheduleTemplateDetailPOs];
            await this.handleChannel();
            this.$nextTick(() => {
              this.$refs.scheduleTable.doLayout();
            });
          } else {
            this.$message.error(res.msg || "引用排班模板失败");
          }
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
          this.$message.error(e.msg || "引用排班模板失败");
        }
      },
      //修改模板
      async editTemp(data) {
        this.$showLoading();
        try {
          let params = {
            ...data,
            sDate: this.dateList[0].date + ' 00:00:00',
            eDate: this.dateList[6].date + ' 23:59:59'
          };
          let res = await scheManagement.getScheDetail(params);
          if (res.code == '1') {
            this.sourceData = [...res.data.scheduleTemplateDetailPOs];
            await this.handleChannel();
            this.$nextTick(() => {
              this.$refs.scheduleTable.doLayout();
            });
          } else {
            this.$message.error(res.msg || "引用排班模板失败");
          }
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
          this.$message.error(e.msg || "引用排班模板失败");
        }
      },
      ...mapActions({
        changeSdept: 'base/changeSdept'
      }),
      //查询渠道列表
      async getChannel() {
        this.$showLoading();
        try {
          let data = await scheManagement.getSelectNumPercentageDict();
          if (data.code == "1") {
            this.channelData = [...data.data];
            await this.handleChannelParams();
          } else {
            this.$message.error(data.msg || "获取渠道列表失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取渠道列表失败");
        }
      },
      //处理渠道表头
      handleChannelParams() {
        let data = [...this.channelData];
        let params = [];
        for (let i in data) {
          params.push({
            prop: data[i].channelId,
            label: data[i].channelName,
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "55"
          });
        }
        let schedulingParams = JSON.parse(JSON.stringify(this.schedulingParams));
        schedulingParams = schedulingParams.concat(params);
        this.schedulingParams = schedulingParams;
        // console.log(schedulingParams);
      },
      //算每周日期
      makeDate(n) {
        var now = new Date();
        var year = now.getFullYear();
        //因为月份是从0开始的,所以获取这个月的月份数要加1才行
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var day = now.getDay();
        //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
        if (day !== 0) {
          n = n + (day - 1);
        } else {
          n = n + day;
        }
        if (day) {
          //这个判断是为了解决跨年的问题
          if (month <= 1) {
            //这个判断是为了解决跨年的问题,月份是从0开始的
            year = year - 1;
            month = 12;
          }
          /*else {
            month = month;
          }*/
        }
        now.setDate(now.getDate() - n);
        year = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
        var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
        // console.log(s);
        return s;
      },
      //算某天为本年第几周
      whichWeek(n) {
        let arr = this.strSplit(n, '-');
        var now = new Date(arr[0], arr[1] - 1, arr[2]),
          year = now.getFullYear(),
          month = now.getMonth(),
          days = now.getDate();
        //那一天是那一年中的第多少天
        for (var i = 0; i < month; i++) {
          days += this.getMonthDays(year, i);
        }
        //那一年第一天是星期几
        var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

        var week = null;
        if (yearFirstDay == 1) {
          week = Math.ceil(days / yearFirstDay);
        } else {
          days -= (7 - yearFirstDay + 1);
          week = Math.ceil(days / 7) + 1;
        }
        console.log(week);
        return week;
      },
      getMonthDays(year, month) {
        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (this.isLeapYear(year) ? 29 : 28);
      },
      isLeapYear(year) {
        return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
      },
      //切割字符串
      strSplit(data, sym) {
        if (data) {
          let arr = data.split(sym);
          return arr;
        }
        return [];
      },
      //当前需要的日期列表
      getDateList(num) {
        let arr = [];
        for (let i = 0; i < 7; i++) {
          let week = '';
          if (i == 0) {
            week = '周一';
          } else if (i == 1) {
            week = '周二';
          } else if (i == 2) {
            week = '周三';
          } else if (i == 3) {
            week = '周四';
          } else if (i == 4) {
            week = '周五';
          } else if (i == 5) {
            week = '周六';
          } else if (i == 6) {
            week = '周日';
          }
          arr.push({
            date: this.makeDate(num - i),
            week: week,
            dataList: []
          });
        }
        this.dateList = [...arr];
      },
      //科室改变
      deptChange() {
        this.changeSdept({
          deptId: this.searchData.deptId,
          startDate: this.dateList[0].date,
          stopDate: this.dateList[6].date,
          isGet: new Date()
        });
        this.getSchedulingData();
      },
      //排版方式改变
      methodChange(value) {
        if (value == '1') {
          this.$router.push('/example/schedule/scheduleManagement');
        }
      },
      //展示排班列表
      async getSchedulingData() {
        this.sourceData = [];
        this.dateListSec = [];
        this.schedulingData = [];
        this.deleteArr = [];
        this.$showLoading();
        try {
          let params = {
            ouptDeptId: this.searchData.deptId,
            startDate: this.dateList[0].date + ' 00:00:00',
            stopDate: this.dateList[6].date + ' 23:59:59'
          };
          let data = await scheManagement.getScheduleAndPercentage(params);
          if (data.code == "1") {
            /*if (data.data.length <= 0) {
              this.isNewScheduling = '1';//新增
            } else {
              this.isNewScheduling = '0';//编辑
            }*/
            this.sourceData = [...data.data];
            await this.handleChannel();
            this.$nextTick(() => {
              this.$refs.scheduleTable.doLayout();
            });
          } else {
            this.$message.error(data.msg || "获取排班列表失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取排班列表失败");
        }
      },
      //合并方法
      // eslint-disable-next-line consistent-return
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          return {
            rowspan: row.mergeIndex,
            colspan: row.mergeIndex > 0 ? 1 : 0
          };
        }
      },
      //处理渠道数据与表格数据
      // eslint-disable-next-line complexity
      handleChannel() {
        let tableData = [...this.sourceData];
        for (let i in tableData) {
          let item = tableData[i];
          if (item.numPercentageDetailPOs && item.numPercentageDetailPOs.length > 0) {
            for (let j in item.numPercentageDetailPOs) {
              let channelId = item.numPercentageDetailPOs[j].channelId;
              let channelNum = item.numPercentageDetailPOs[j].channelNum;
              item[channelId] = Number(channelNum);
            }
          }
        }
        let dateList = JSON.parse(JSON.stringify(this.dateList));
        for (let i in tableData) {
          for (let j in dateList) {
            if (this.strSplit(tableData[i].dutyStartTime, ' ')[0] == dateList[j].date) {
              dateList[j].dataList.push({...tableData[i]});
            }
          }
        }
        for (let i in dateList) {
          let item = dateList[i];
          if (item.dataList.length > 0) {
            for (let j in item.dataList) {
              let val = item.dataList[j];
              val.date = item.date;
              val.operate = '0';
              val.isNew = '0';
              val.index = j;
              if (j == 0) {
                val.mergeIndex = item.dataList.length;
              } else {
                val.mergeIndex = 0;
              }
            }
          } else {
            item.dataList.push({
              date: item.date,
              mergeIndex: 1,
              operate: '1',
              isNew: '1',
              index: 1,
              dutyStartTime: item.date + ' 00:00:00',
              dutyStopTime: item.date + ' 23:59:59',
              /*dutyStartTime: item.date,
              dutyStopTime: item.date,*/
              deptId: this.searchData.deptId,
              ouptDeptId: this.searchData.deptId,
              recordStatus: '',
              workCode: '1737'
            })
          }
        }
        this.dateListSec = dateList;
        console.log(dateList);
        // debugger
        this.handleChannel1(dateList);
      },
      handleChannel1(dateList) {
        let newArr = [];
        for (let i in dateList) {
          newArr = newArr.concat(dateList[i].dataList);
        }
        for (let i in newArr) {
          if (!newArr[i]['operate']) {
            newArr[i]['operate'] = '0';
          }
        }
        console.log(newArr);
        this.schedulingData = JSON.parse(JSON.stringify(newArr));
      },
      //schedulingData => dateListSec转化
      unMergeData() {
        for (let i in this.dateListSec) {
          this.dateListSec[i].dataList = [];
          for (let j in this.schedulingData) {
            if (this.schedulingData[j].date == this.dateListSec[i].date) {
              this.dateListSec[i].dataList.push(this.schedulingData[j]);
            }
          }
        }
        // console.log('解開的', this.dateListSec);
      },
      //增加排班
      async add(row, index) {
        await this.unMergeData();
        this.schedulingData = [];
        for (let i in this.dateListSec) {
          if (row.date == this.dateListSec[i].date) {
            await this.$set(this.dateListSec[i].dataList, this.dateListSec[i].dataList.length, {
              mergeIndex: this.dateListSec[i].dataList.length > 0 ? 0 : 1,
              date: row.date,
              operate: '1',
              isNew: '1',
              index: this.dateListSec[i].dataList.length,
              dutyStartTime: row.date + ' 00:00:00',
              dutyStopTime: row.date + ' 23:59:59',
              deptId: this.searchData.deptId,
              ouptDeptId: this.searchData.deptId,
              recordStatus: '',
              workCode: '1737'
            });
            await this.$set(this.dateListSec[i].dataList, 0, {
              ...this.dateListSec[i].dataList[0],
              mergeIndex: this.dateListSec[i].dataList[0].mergeIndex += 1
            });
          }
        }
        console.log(this.dateListSec);
        await this.handleChannel1(this.dateListSec);
      },
      //编辑
      editItem(row, index) {
        // this.editRow = {...row};
        this.$set(this.schedulingData, index, {
          ...this.schedulingData[index],
          operate: '1'
        });
      },
      //完成
      editCommit(row, index) {
        this.$set(this.schedulingData, index, {
          ...row,
          /*dutyStartTime: row.date + ' ' + row.dutyStartTime,
          dutyStopTime: row.date + ' ' + row.dutyStopTime,*/
          operate: '0'
        });
      },
      //删除
      async delteItem(row, index) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.unMergeData();
          for (let i in this.dateListSec) {
            let item = this.dateListSec[i].dataList;
            if (row.date == this.dateListSec[i].date) {
              if (item.length == 1) {
                await this.$set(item, 0, {
                  mergeIndex: 1,
                  date: row.date,
                  operate: '1',
                  isNew: '1',
                  index: 0
                });
              } else {
                await this.$delete(item, row.index);
                for (let j in item) {
                  if (j == 0) {
                    await this.$set(item, j, {
                      ...item[j],
                      mergeIndex: item.length,
                      index: j
                    });
                  } else {
                    await this.$set(item, j, {
                      ...item[j],
                      mergeIndex: 0,
                      index: j
                    });
                  }
                }
              }
            }
          }
          await this.handleChannel1(this.dateListSec);
          if (row.scheduleId != '' && row.scheduleId != null && row.scheduleId != undefined) {
            this.deleteArr.push({
              ...row,
              deletedStatus: '1'
            });
          }
        });
      },
      /*cancelItem(row, index) {
        this.$set(this.schedulingData, index, {
          ...this.editRow,
          operate: '0'
        });
      },*/
      //编辑改变医生
      docChange(value, item) {
        //to do职称带出
      },
      //通过诊疗类型获得号源比例
      diagTreatTypeChange(row, index) {
        if (row.diagTreatType) {
          let params = {
            diagTreatTypeCode: row.diagTreatType
          };
          scheManagement.getNumPercentage(params).then((res) => {
            if (res.code == '1') {
              let data = res.data;
              let arr = [];
              for (let i in data) {
                for (let j in this.channelData) {
                  if (data[i].channelId == this.channelData[j].channelId) {
                    arr.push({
                      channelId: data[i].channelId,
                      channelPercentage: data[i].channelPercentage
                    });
                  }
                }
              }
              this.$set(this.schedulingData[index], 'numPercentage', arr);
              if (Number(row['sdeptLimitNum']) > 0) {
                this.sdeptLimitNumBlur(row, index);
              }
            }
          });
          if (row.classId) {
            this.diaTypeChange(row, index);
          }
        }
      },
      //渠道按比例分配
      sdeptLimitNumBlur(row, index) {
        for (let i in this.channelData) {
          for (let j in row['numPercentage']) {
            if (this.channelData[i].channelId == row['numPercentage'][j].channelId) {
              if (row.unifyPool == '1') {
                row[this.channelData[i].channelId] = Number(row.sdeptLimitNum);
              } else {
                row[this.channelData[i].channelId] = Math.floor(Number(row.sdeptLimitNum) * Number(row['numPercentage'][j].channelPercentage));
              }
            }
          }
        }
      },
      //根据班次查询开诊时间
      classesIdChange(row, index) {
        if (row.classesId) {
          let params = {
            classId: row.classesId
          };
          scheManagement.getTimeByclassId(params).then((res) => {
            if (res.code == '1') {
              row.dutyStartTime = row.date + ' ' + res.data.dutyStartTime;
              row.dutyStopTime = row.date + ' ' + res.data.dutyStopTime;
            }
          });
          if (row.diagTreatType) {
            this.diaTypeChange(row, index);
          }
        }
      },
      //根据班次与诊疗类型查询号源数
      diaTypeChange(row, index) {
        let params = {
          diagTreatTypeCode: row.diagTreatType,
          classId: row.classesId
        };
        scheManagement.getNumByclassIdTypeCode(params).then((res) => {
          if (res.code == '1') {
            row.allowAppendNum = res.data[0].appendNumLimit;
            row.sdeptLimitNum = res.data[0].classNum;
            this.sdeptLimitNumBlur(row, index);
          }
        });
      },
      //统一号源池渠道值为总号源数
      unifyPoolChange(row, index) {
        if (row.unifyPool == '1') {
          let data = [...this.channelData];
          for (let i in data) {
            row[data[i]['channelId']] = row.sdeptLimitNum
          }
        } else {
          this.sdeptLimitNumBlur(row, index);
        }
      },
      //获取上一周排班
      async getLastWeekSchedul() {
        this.weekIndex += 7;
        await this.getDateList(this.weekIndex);
        this.currentWeek = this.whichWeek(this.dateList[0].date);
        await this.changeSdept({
          deptId: this.searchData.deptId,
          startDate: this.dateList[0].date,
          stopDate: this.dateList[6].date,
          isGet: new Date()
        });
        await this.getSchedulingData();
      },
      //获取下一周排班
      async getNextWeekSchedul() {
        this.weekIndex -= 7;
        await this.getDateList(this.weekIndex);
        this.currentWeek = this.whichWeek(this.dateList[0].date);
        await this.changeSdept({
          deptId: this.searchData.deptId,
          startDate: this.dateList[0].date,
          stopDate: this.dateList[6].date,
          isGet: new Date()
        });
        await this.getSchedulingData();
      },
      //更新排班数据处理
      handelSchedulingEnd(flag) {
        let data;
        if (flag == '0') {
          //存为模板
          data = JSON.parse(JSON.stringify(this.schedulingData));
        } else if (flag == '1') {
          //暂存
          data = JSON.parse(JSON.stringify(this.schedulingData.concat(this.deleteArr)));
        }
        let newArr = [];
        for (let i in data) {
          let item = data[i];
          if (!(!item.doctorId && !item.diagTreatType && !item.classesId && !item.roomId && !item.sdeptLimitNum && !item.unifyPool && !item.allowAppendNum)) {
            let newItem = JSON.parse(JSON.stringify(item));
            let numPercentageDetailPOs = [];
            for (let k in this.channelData) {
              for (let v in newItem) {
                if (this.channelData[k].channelId == v) {
                  numPercentageDetailPOs.push({
                    channelId: v,
                    channelNum: newItem[v]
                  });
                  this.$delete(newItem, v);
                }
              }
            }
            newItem['numPercentageDetailPOs'] = numPercentageDetailPOs;
            this.$delete(newItem, 'date');
            this.$delete(newItem, 'index');
            this.$delete(newItem, 'isNew');
            this.$delete(newItem, 'mergeIndex');
            this.$delete(newItem, 'operate');
            this.$delete(newItem, 'numPercentage');
            newArr.push(newItem);
          }
        }
        console.log(newArr);
        return newArr;
      },
      //存为模板
      async saveConfirm() {
        this.$showLoading();
        if (this.isUpdateTemp == '0') {
          try {
            let flag = '0';
            let arr = await this.handelSchedulingEnd(flag);
            let params = {
              ...this.temp,
              sdeptId: this.searchData.deptId,
              templateType: '1',
              recordStatus: '1',
              scheduleTemplateDetailPOs: arr
            };
            let data = await scheManagement.saveSchhedulingTemp(params);
            if (data.code == "1") {
              this.$message("模板存储成功");
              this.getSchedulingData();
            } else {
              this.$message.error(data.msg || "模板存储失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "模板存储失败");
          }
        } else if (this.isUpdateTemp == '1') {
          try {
            let flag = '0';
            let arr = await this.handelSchedulingEnd(flag);
            let params = {
              ...this.temp,
              ...this.scheduleTemplate,
              sdeptId: this.searchData.deptId,
              templateType: '1',
              recordStatus: '1',
              scheduleTemplateDetailPOs: arr
            };
            let data = await scheManagement.updateSche(params);
            if (data.code == "1") {
              this.$message("模板存储成功");
              this.editTemp({
                templateId: this.scheduleTemplate.templateId
              });
              this.changeSdept({
                deptId: this.searchData.deptId,
                startDate: this.dateList[0].date,
                stopDate: this.dateList[6].date,
                isGet: new Date()
              });
            } else {
              this.$message.error(data.msg || "模板存储失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "模板存储失败");
          }
        }
      },
      //清空所有
      async deleteAll() {
        this.$showLoading();
        try {
          let params = {
            ouptDeptId: this.searchData.deptId,
            startDate: this.dateList[0].date + ' 00:00:00',
            stopDate: this.dateList[6].date + ' 23:59:59'
          };
          let data = await scheManagement.removeSchheduling(params);
          if (data.code == "1") {
            this.$message("清空成功");
            this.getSchedulingData();
          } else {
            this.$message.error(data.msg || "清空失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "清空失败");
        }
      },
      //发布排班
      async publishSchel() {
        this.$showLoading();
        try {
          let params = {
            ouptDeptId: this.searchData.deptId,
            startDate: this.dateList[0].date + ' 00:00:00',
            stopDate: this.dateList[6].date + ' 23:59:59'
          };
          let data = await scheManagement.releaseSchheduling(params);
          if (data.code == "1") {
            this.$message("发布排班成功");
            this.getSchedulingData();
          } else {
            this.$message.error(data.msg || "发布排班失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "发布排班失败");
        }
      },
      //暂存
      async saveStage() {
        this.$showLoading();
        try {
          let flag = '1';
          let arr = await this.handelSchedulingEnd(flag);
          let data = await scheManagement.saveSchheduling(arr);
          if (data.code == "1") {
            this.$message("暂存成功");
            this.getSchedulingData();
          } else {
            this.$message.error(data.msg || "暂存失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "暂存失败");
        }
      },
      openTemp() {
        for (let i in this.temp) {
          this.temp[i] = '';
        }
      },
      cancelTemp() {
        this.dialogVisible = false;
      },
      async saveTemp() {
        await this.saveConfirm();
        this.dialogVisible = false;
      },
      //监听工具箱
      toolBoxMessage() {
      }
    }
  }
</script>

<style scoped lang="scss">
  .scheduling-main {
    .scheduling {
      padding: 20px;
      margin-right: 20px;

      .navBar {
        margin-bottom: 20px;
      }

      .table-cont {
        .table-title {
          height: 60px;
          padding: 12px 0;
          background-color: $l-color-bgcolor-18;
          border: 1px splid $l-color-bgcolor-11;
          border-bottom: none;

          .table-title-cont {
            width: 555px;
            margin: 0 auto;

            .left,
            .right {
              width: 80px;
              height: 36px;
              border: 1px solid $l-color-bgcolor-11;
              display: inline-block;
              font-size: 14px;
              
              font-weight: 400;
              color: $l-color-fontcolor-3;
              line-height: 36px;
              text-align: center;
              cursor: pointer;
            }

            .center {
              width: 335px;
              height: 36px;
              display: inline-block;
              text-align: center;
              font-size: 18px;
              
              font-weight: bold;
              color: $l-color-fontcolor-3;
              line-height: 36px;
              /*vertical-align: top;*/
            }

            .line {
              height: 20px;
              padding: 8px 0;
              margin-top: 0;
              display: inline-block;
              /*vertical-align: super;*/
            }
          }
        }

        .dateFont {
          font-size: 16px;
          
          font-weight: bold;
          color: $l-color-fontcolor-3;
        }

        .addSchedul {
          width: 76px;
          height: 30px !important;
          margin-left: 10px;
        }
      }

      .temp-cont {
        padding: 20px;
      }

      .margin-left-20 {
        margin-left: 20px;
      }

      .margin-right-20 {
        margin-right: 20px;
      }

      .line {
        width: 2px;
        height: 20px;
        margin-top: 8px;
        background-color: $l-color-bgcolor-11;
      }
    }
  }
</style>
