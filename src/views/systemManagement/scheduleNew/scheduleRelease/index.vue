<template>
  <div class="height100">
    <el-card
      class="main-box float-left height100"
      :style="{'width': toolBoxExpanded ? 'calc(100% - 307px)' : 'calc(100% - 66px)'}"
    >
      <!-- <div class="dept-box">
        <l-card-title>
          <span slot="left">选择科室</span>
        </l-card-title>
        <div class="dept-search">
          <el-input placeholder="科室名称" v-model="query">
            <el-button slot="append" @click="queryDept">查询</el-button>
          </el-input>
        </div>
        <div class="dept-list">
          <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%"
            height="100%"
            v-loading="deptLoading"
            @selection-change="getRowsIdx"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="deptId" label="科室">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>-->
      <div class="content">
        <div class="search-form">
          <div class="search-form-right">
            <el-button type="primary" @click="search">查询</el-button>
          </div>
          <div class="search-form-left">
            <el-row :gutter="10">
              <el-col :span="3">
                <l-formt-title label="选择科室">
                  <el-select v-model="searchParams.ouptDeptId" placeholder="请选择">
                    <el-option
                      v-for="item in departmentInfo"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="5">
                <l-formt-title label="排班时间">
                  <el-date-picker
                    v-model="date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getDate"
                  ></el-date-picker>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="出诊形式">
                  <el-select v-model="searchParams.isOnline" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="班次">
                  <!-- <l-value-domain
                    clearable
                    style="width: 100%"
                    :value.sync="searchParams.classesId"
                    remoteUrl="/appointment/class/selectCalss"
                    type="select"
                    remoteShowKey="className"
                    remoteValueKey="classId"
                    placeholder
                  ></l-value-domain>-->
                  <el-select v-model="searchParams.classesId" placeholder="请选择">
                    <el-option
                      v-for="item in selectCalssInfo"
                      :key="item.classId"
                      :label="item.className"
                      :value="item.classId"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="诊疗类型">
                  <!-- <l-value-domain
                    clearable
                    style="width: 100%"
                    :value.sync="searchParams.diagTreatType"
                    remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO"
                    type="select"
                    remoteShowKey="diagTreatTypeName"
                    remoteValueKey="diagTreatTypeCode"
                    placeholder
                  ></l-value-domain>-->
                  <el-select v-model="searchParams.diagTreatType" placeholder="请选择">
                    <el-option
                      v-for="item in selectDiagTreatTypePOInfo"
                      :key="item.diagTreatTypeCode"
                      :label="item.diagTreatTypeName"
                      :value="item.diagTreatTypeCode"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="状态">
                  <el-select v-model="searchParams.recordStatus" placeholder="请选择">
                    <el-option label="全部" value></el-option>
                    <el-option label="暂存" value="2"></el-option>
                    <el-option label="发布" value="1"></el-option>
                    <el-option label="驳回" value="3"></el-option>
                    <el-option label="审核" value="4"></el-option>
                    <el-option label="停诊" value="5"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="3">
                <l-formt-title label="医生姓名">
                  <el-input v-model="searchParams.doctorName" placeholder="请输入"></el-input>
                </l-formt-title>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="table-box">
          <el-table
            :data="listData"
            stripe
            border
            style="width: 100%"
            height="100%"
            @sort-change="sortChange"
            :default-sort="{prop: 'date', order: 'descending'}"
            v-loadmore="{noMoreVar:'tlm_noMore', loadingVar: 'schedeluLoading', value: load}"
            v-loading="schedeluLoading"
            @selection-change="getRowsIdxTwo"
          >
            <el-table-column type="selection" width="55"></el-table-column>
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
                <!-- <template v-if="scope.row['operate']=='0'"> -->
                <template v-if="true">
                  <template v-if="item.prop == 'operate'">
                    <el-button type="text" @click="editItem(scope.row,scope.$index)">编辑</el-button>
                    <el-button
                      type="text"
                      v-if="scope.row.recordStatus != '1'"
                      @click="delteItem(scope.row,scope.$index)"
                    >删除</el-button>
                  </template>
                  <template v-else-if="item.prop == 'recordStatus'">
                    <span v-if="scope.row[item.prop]=='1'">发布</span>
                    <span v-else-if="scope.row[item.prop]=='2'">暂存</span>
                    <span v-else-if="scope.row[item.prop]=='3'">驳回</span>
                    <span v-else-if="scope.row[item.prop]=='4'">审核</span>
                    <span v-else-if="scope.row[item.prop]=='5'">停诊</span>
                  </template>
                  <template v-else-if="item.prop == 'apptDept'">
                    <span
                      tableName="appt_dict_value"
                      :conditionMap="{
                          dict_item_code: 'A0003',
                          dict_code: scope.row[item.prop]
                        }"
                      columns="dict_name"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'scheduleType'">
                    <span v-if="scope.row[item.prop]=='1'">医生</span>
                    <span v-else-if="scope.row[item.prop]=='2'">科室</span>
                  </template>
                  <template v-else-if="item.prop == 'workCode'">
                    <span
                      v-if="scope.row[item.prop]"
                      :val="scope.row[item.prop]"
                      code="doctorProfessionalTitle"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'ouptDeptId'">
                    <span
                      class="deptName"
                      tableName="sys_org"
                      :conditionMap="{
                          org_type: '_DEPT_',
                          id: scope.row[item.prop]
                        }"
                      columns="org_nm"
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
                  <!-- <template v-else-if="item.prop=='dutyStartTime'||item.prop=='dutyStopTime'">
                    <span>{{strSplit(scope.row[item.prop], ' ')[1]}}</span>
                  </template>-->
                  <template v-else-if="item.prop == 'roomId'">
                    <span
                      tableName="appt_room"
                      :conditionMap="{ROOM_ID: scope.row[item.prop] || ''}"
                      columns="ROOM_NAME"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop=='isOnline'">
                    <span v-if="scope.row[item.prop]=='1'">互联网</span>
                    <span v-if="scope.row[item.prop]=='2'">现场</span>
                  </template>
                  <!-- 已加号数量 -->
                  <template v-else-if="item.prop == 'appendNum'">{{scope.row[item.prop]}}</template>
                  <!-- 加号数量 -->
                  <template v-else-if="item.prop == 'addNum'">
                    <el-input-number
                      v-model="scope.row[item.prop]"
                      :min="0"
                      :controls="false"
                      :disabled="!scope.row.scheduleId"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="btn-box">
          <!-- <el-button plain>编辑</el-button> -->
          <!-- <el-button plain @click="updateSchedule(4)">审核</el-button> -->
          <el-button plain @click="updateSchedule(3)">驳回</el-button>
          <el-button plain @click="stopSchedule">停诊</el-button>
          <el-button plain @click="releaseScheduleNew">发布排班</el-button>
        </div>
      </div>
    </el-card>
    <div
      class="tool-box float-right height100"
      :style="{'width': toolBoxExpanded ? '287px' : '46px'}"
    >
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

// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};
export default {
  name: "scheduleRelease",
  components: { ToolBox },
  data() {
    return {
      // 工具箱
      boxs: [],
      toolBoxExpanded: false,
      defaultBoxName: "scheTemps",
      query: "",
      tableData: [
        {
          id: "1",
          dept: "呼吸内科"
        }
      ],
      date: [],
      searchParams: {
        ouptDeptId: "",
        sDate: "",
        eDate: "",
        isOnline: "",
        classesId: "",
        diagTreatType: "",
        recordStatus: "",
        doctorName: ""
      },
      departmentInfo: [],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "互联网"
        },
        {
          value: "2",
          label: "现场"
        }
      ],
      listData: [],
      deptLoading: false,
      schedeluLoading: false,
      // 选中科室集合
      deptList: "",
      // 表格
      schedulingParams: [
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "50"
        },
        {
          prop: "ouptDeptId",
          label: "科室",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "70"
        },
        {
          prop: "apptDept",
          label: "门诊部门",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "90"
        },
        {
          prop: "scheduleType",
          label: "排班类型",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "70"
        },
        {
          prop: "doctorName",
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
          prop: "isOnline",
          label: "出诊形式",
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
          width: "150"
        },
        {
          prop: "dutyStopTime",
          label: "结束时间",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "150"
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
          prop: "sdeptLimitNum",
          label: "挂号号源数",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "70"
        },
        {
          prop: "apptLimitNum",
          label: "预约号源数",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "70"
        },
        // {
        //   prop: "allowAppendNum",
        //   label: "允许加号数",
        //   align: "left",
        //   headerAlign: "left",
        //   fixed: false,
        //   width: "70"
        // },
        // {
        //   prop: "numDate",
        //   label: "放号时间",
        //   align: "left",
        //   headerAlign: "left",
        //   fixed: false,
        //   width: "70"
        // },
        {
          prop: "updatedByName",
          label: "操作者",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "90"
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "90"
        }
      ],
      selectCalssInfo: [],
      selectDiagTreatTypePOInfo: [],
      // 选中排班id集合
      scheduleIds: [],
      // 选中排班集合
      schedules: [],
      // 分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.queryDept();
    this.getScheduleList();
    this.selectCalss();
    this.selectDiagTreatTypePO();
  },
  methods: {
    //查询班次列表
    async selectCalss() {
      try {
        this.deptLoading = true;
        let res = await scheManagement.selectCalss();
        this.deptLoading = false;
        this.selectCalssInfo = [
          {
            classId: "",
            className: "全部"
          }
        ];
        this.selectCalssInfo = this.selectCalssInfo.concat(res.data);
      } catch (error) {
        console.info(error);
        this.deptLoading = false;
        this.$message.error(error.msg || "获取班次列表报错");
      }
    },
    //查询诊疗类型列表
    async selectDiagTreatTypePO() {
      try {
        this.deptLoading = true;
        let res = await scheManagement.selectDiagTreatTypePO();
        this.deptLoading = false;
        this.selectDiagTreatTypePOInfo = [
          {
            diagTreatTypeCode: "",
            diagTreatTypeName: "全部"
          }
        ];
        this.selectDiagTreatTypePOInfo = this.selectDiagTreatTypePOInfo.concat(
          res.data
        );
      } catch (error) {
        console.info(error);
        this.deptLoading = false;
        this.$message.error(error.msg || "获取诊疗类型列表报错");
      }
    },
    //监听工具箱
    toolBoxMessage() {},
    // 表格排序
    sortChange(val) {},
    getStatus(row, index) {
      if (row.recordStatus && row.recordStatus == "1") {
        return false;
      } else {
        return true;
      }
    },
    // 选选择日期
    getDate() {
      if (this.date && this.date.length > 1) {
        this.searchParams.startDate = this.date[0].toLocaleStr() + " 00:00:00";
        this.searchParams.stopDate = this.date[1].toLocaleStr() + " 23:59:59";
      }
    },
    // 选择科室
    getRowsIdx(rows) {
      this.deptList = [];
      rows.forEach(element => {
        this.deptList.push(element.deptId);
      });
      this.getScheduleList();
    },
    // 选择排班
    getRowsIdxTwo(rows) {
      this.schedules = rows;
      this.scheduleIds = [];
      rows.forEach(val => {
        this.scheduleIds.push(val.scheduleId);
      });
    },
    // 查询科室
    async queryDept() {
      try {
        this.deptLoading = true;
        let res = await scheManagement.queryDept({
          deptName: this.query
        });
        this.departmentInfo = [
          {
            deptId: "",
            deptName: "全部"
          }
        ];
        this.departmentInfo = this.departmentInfo.concat(res.data);
        this.tableData = res.data;
        this.deptLoading = false;
      } catch (error) {
        console.info(error);
        this.deptLoading = false;
        this.$message.error(error.msg || "查询科室报错");
      }
    },
    // 获取排班数据
    async getScheduleList() {
      try {
        this.schedeluLoading = true;
        if (this.searchParams.isOnline == "0") {
          // this.searchParams.isOnline = undefined;
        }
        let res = await scheManagement.getScheduleByPage({
          ...this.searchParams,
          ...this.pageParams
          // deptList: this.deptList
        });
        if (this.pageParams.pageNo === 1) {
          this.listData = res.data;
        } else {
          this.listData = res.data.concat(this.listData);
        }
        this.pageParams.total = res.total;
        // this.listData = res.data;
        this.schedeluLoading = false;
      } catch (error) {
        this.schedeluLoading = false;
        this.$message.error(error.msg || "查询排班失败");
      }
    },
    // load
    load() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getScheduleList();
    },
    // 查询排班
    search() {
      this.pageParams.pageNo = 1;
      this.getScheduleList();
    },
    // 驳回排班
    async updateSchedule(recordStatus) {
      try {
        if (this.scheduleIds.length < 1) {
          this.$message.error("请选择要操作的排班");
          return;
        }
          for (let i = 0; i < this.schedules.length; i++) {
            let val = this.schedules[i];
            if (val.recordStatus != "2") {
              // eslint-disable-next-line no-useless-concat
              this.$message.error(
                val.doctorName +
                  " [ " +
                  val.dutyStartTime +
                  " - " +
                  val.dutyStopTime +
                  " ] " +
                  "非暂存的排班不能驳回"
              );
              return;
            }
          }
        this.$showLoading();
        let res = await scheManagement.updateScheduleByIds({
          recordStatus: recordStatus,
          ids: [...this.scheduleIds]
        });
        this.$message({ type: "success", message: "操作成功" });
        this.$hideLoading();
        this.getScheduleList();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "操作失败");
      }
    },
    // 发布排班 新
    async releaseScheduleNew() {
      try {
        if (this.scheduleIds.length < 1) {
          this.$message.error("请选择要操作的排班");
          return;
        }
        for (let i = 0; i < this.schedules.length; i++) {
          let val = this.schedules[i];
          if (val.recordStatus != "2" && val.recordStatus != "4" ) {
            // eslint-disable-next-line no-useless-concat
            this.$message.error(
              val.doctorName +
                " [ " +
                val.dutyStartTime +
                " - " +
                val.dutyStopTime +
                " ] " +
                "非暂存和审核通过的排班不能发布"
            );
            return;
          }
        }
        this.$showLoading();
        let res = await scheManagement.releaseScheduleNew(this.schedules);
        this.$message({ type: "success", message: "操作成功" });
        this.$hideLoading();
        this.getScheduleList();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "发布排班失败");
      }
    },
    // 停诊
    async stopSchedule(){
      try {
         if (this.scheduleIds.length < 1) {
          this.$message.error("请选择要操作的排班");
          return;
        }
        for (let i = 0; i < this.schedules.length; i++) {
          let val = this.schedules[i];
          if (val.recordStatus != "1") {
            // eslint-disable-next-line no-useless-concat
            this.$message.error(
              val.doctorName +
                " [ " +
                val.dutyStartTime +
                " - " +
                val.dutyStopTime +
                " ] " +
                "未发布的排班不能停诊"
            );
            return;
          }
        }
        this.$showLoading();
        let res = await scheManagement.stopSchedule(this.schedules);
        this.$message({ type: "success", message: "操作成功" });
        this.$hideLoading();
        this.getScheduleList();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "停诊失败");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-box {
  overflow: hidden;
  padding: 0 20px;
}
.dept-box {
  float: left;
  width: 240px;
  height: 100%;
}
.content {
  // margin-left: 260px;
  height: 100%;
  overflow: hidden;
}
.dept-list {
  height: calc(100% - 139px);
  margin-top: 20px;
}
.search-form {
  overflow: hidden;
  padding: 20px 0;
  .search-form-left {
    margin-right: 80px;
  }
  .search-form-right {
    float: right;
    text-align: right;
  }
}
.btn-box {
  text-align: right;
  margin-top: 20px;
}
.table-box {
  height: calc(100% - 154px);
}
</style>