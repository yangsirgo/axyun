<template>
  <div class="height100">
    <div class="choose-con clearfix width100">
      <div class="search-con">
        <div class="common-item large-width">
          <l-formt-title>
            <el-date-picker
              v-model="searchForm.timeRange"
              type="datetimerange"
              align="right"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </l-formt-title>
        </div>
        <div class="common-item">
          <l-formt-title label="患者姓名">
            <el-input
              v-model="searchForm.paNm"
              clearable
              style="width: 200px"
              placeholder="请输入患者姓名"
            ></el-input>
          </l-formt-title>
        </div>
      </div>
      <div class="search-btns">
        <el-button type="primary" @click="queryFirstPage">查询</el-button>
        <el-button type="primary" plain @click="reset">重置</el-button>
      </div>
    </div>
    <div class="table-con">
      <l-table
        :total="pageParams.total"
        :pageSize.sync="pageParams.pageSize"
        :page.sync="pageParams.pageNo"
        :layout="layout"
        :singlePageShow="true"
        @changeSize="changeSize"
      >
        <el-table
          :data="eleData"
          width="100%"
          height="100%"
          :stripe="true"
          border
          v-loading="tlm_isLoading"
          element-loading-text="加载中..."
          @row-click="rowClickHandle"
        >
          <el-table-column
            fixed="left"
            type="index"
            :index="indexMethod"
            width="50"
            label="序号"
          ></el-table-column>
          <el-table-column fixed="left" type="index" width="230" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleJump(scope.row)"
                >去处理</el-button
              >
              <el-button size="mini" @click="handleDone(scope.row)"
                >完成</el-button
              >
              <el-button
                size="mini"
                v-if="scope.row.qcFltF == '1'"
                @click="handleApply(scope.row)"
                >申请超时</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in eleParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'dateLeft'">
                <span :class="applyOverTime(scope.row.qcFltF)">
                  {{ scope.row[item.prop] }}
                </span>
              </div>

              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </l-table>
    </div>
    <el-dialog title="关联已书写文书" :visible.sync="dialogDoneDoc">
      <el-form :model="formOne" style="margin: 20px 100px 0 0">
        <el-form-item
          style="width: 40%; display: inline-block"
          label="患者姓名"
          label-width="120px"
        >
          <el-input
            v-model="mr.patientNm"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          style="width: 40%; display: inline-block"
          label="病历名称"
          label-width="120px"
        >
          <el-input
            v-model="mr.mrTpName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          style="width: 40%; display: inline-block"
          label="住院号"
          label-width="120px"
        >
          <el-input
            v-model="mr.hospitalizationNumber"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          style="width: 40%; display: inline-block"
          label="床号"
          label-width="120px"
        >
          <el-input
            v-model="mr.curBedCd"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <!--        <el-form-item label="床号" label-width="120px">-->
        <!--          <el-input-->
        <!--            style="width: 40%"-->
        <!--            v-model="formOne.IndoctorNumber"-->
        <!--            autocomplete="off"-->
        <!--          ></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="病历类型" label-width="120px">
          <el-input
            style="width: 40%"
            v-model="mr.mrTpName"
            autocomplete="off"
            disabled
          >
          </el-input>
        </el-form-item>
        <el-form-item label="病历名称" label-width="120px">
          <el-select
            v-model="selectedMr"
            placeholder="请选择病历"
            multiple
            clearable
          >
            <el-option
              v-for="(item, index) in mr.mrs"
              :key="index"
              :label="item.nm"
              :value="item.mrId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDoneDoc = false">取 消</el-button>
        <el-button type="primary" @click="handleSave()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="申请超时" :visible.sync="dialogApply">
      <el-form :model="form" style="margin: 20px 100px 0 0">
        <el-form-item label="超时原因" label-width="120px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.reason"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogApply = false">取 消</el-button>
        <el-button type="primary" @click="dialogApply = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWaitWriteDocList,
  getTaskMr,
  relationMr
} from "@/api/emrRecord/qc/index.js";

export default {
  name: "waitWriteDocList",
  components: {},
  data() {
    return {
      searchForm: {
        timeRange: [],
        paNm: ""
      },
      selectedMr: [], //完成的时候选择的病历编号
      tlm_isLoading: false,
      total: 0,
      pageParams: {
        pageSize: 20,
        pageNo: 1,
        total: 0
      },
      layout: "total,prev,pager,next,jumper",
      currentRow: {},
      eleParams: [
        {
          prop: "apllyFLabel",
          label: "申请状态",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "mrTpName",
          label: "任务名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "100"
        },
        {
          prop: "paNm",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "60"
        },
        {
          prop: "bedNo",
          label: "床号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "60"
        },
        {
          prop: "taskBeginTime",
          label: "开始时间",
          align: "left",
          headerAlign: "left",
          width: "100"
        },
        {
          prop: "taskEndlineTime",
          label: "结束时间",
          align: "left",
          headerAlign: "left",
          width: "100"
        },
        {
          prop: "dateLeft",
          label: "剩余时间",
          align: "left",
          headerAlign: "left",
          width: "80"
        },
        {
          prop: "taskStsLabel",
          label: "任务状态",
          align: "left",
          headerAlign: "left",
          width: "60"
        },
        {
          prop: "taskDesc",
          label: "任务描述",
          align: "left",
          headerAlign: "left",
          width: "120"
        }
      ],
      eleData: [],
      patientId: "",
      dialogDoneDoc: false,
      dialogApply: false,
      mr: {},
      formOne: {
        name: "",
        bedNumber: "",
        IndoctorNumber: "",
        bingliType: "",
        bingliName: ""
      },
      form: {
        reason: ""
      }
    };
  },
  created() {
    const query = this.$route.query;
    if (query.enId && query.patientName) {
      this.searchForm.paNm = query.patientName;
    }
    this.queryTableList();
  },
  methods: {
    handleJump(row) {
      console.log("row");
      this.$router.push({
        path: "/hsDiagTreat/homeBedRecord/homeBedRecordPage",
        query: {
          enId: row.enId,
          mrTpCd: row.mrTpCd,
          startDt: row.taskBeginTime,
          endDt: row.taskEndlineTime
        }
      });
    },
    applyOverTime(qcFltF) {
      if (qcFltF === "1") {
        return "red-color";
      }
      return "";
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    handleSave() {
      let mrids = this.selectedMr.map(item => {
        return { mrid: item };
      });
      console.log("this.mrids======", mrids);
      this.relationMr({
        taskId: this.currentRow.qcTaskId,
        dataVersion: this.currentRow.dataVersion
      });
    },
    handleDone(row) {
      console.log("row======", row);
      this.currentRow = row;
      this.selectedMr = [];
      this.getTaskMr({ taskId: row.qcTaskId, isHome: "1" });
      this.dialogDoneDoc = true;
    },
    getTaskMr(data) {
      console.log("data======", data);

      // taskId 任务id
      getTaskMr(data)
        .then(resData => {
          console.log(resData, "resData");
          if (resData.code === 1 && resData.data) {
            this.mr = resData.data;
          } else {
            this.$message(resData.msg || "待本人审签接口报错");
          }
          this.tlm_isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.tlm_isLoading = false;
          this.$message(error || error.msg || "待本人审签接口报错");
        });
    },
    relationMr(data) {
      // taskId 任务id
      relationMr(data)
        .then(resData => {
          console.log(resData, "resData");
          if (resData.code === 1 && resData.data) {
            // this.mr = resData.data;
            this.$message.success("文书完成成功！");
            this.queryTableList();
            this.dialogDoneDoc = false;
          } else {
            this.$message(resData.msg || "待书写文书完成接口报错");
          }
          this.tlm_isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.tlm_isLoading = false;
          this.dialogDoneDoc = false;
          this.$message(error || error.msg || "待书写文书完成接口报错");
        });
    },
    handleApply() {
      // this.$router.push({
      //   path: "/inMr/inRecordMaintenanceApply"
      // });
    },
    rowClickHandle(row) {
      console.log(row);
      this.patientId = row.patientId;
    },
    reset() {
      for (let key in this.searchForm) {
        if (key === "timeRange") {
          this.searchForm[key] = [];
        } else {
          this.searchForm[key] = "";
        }
      }
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.queryTableList();
    },
    queryFirstPage() {
      this.pageParams.pageNo = 1;
      this.queryTableList();
    },
    queryTableList() {
      // 拼接请求参数
      let data = {
        paNm: this.searchForm.paNm,
        startTime:
          this.searchForm.timeRange && this.searchForm.timeRange[0]
            ? this.searchForm.timeRange[0]
            : "",
        endTime:
          this.searchForm.timeRange && this.searchForm.timeRange[1]
            ? this.searchForm.timeRange[1]
            : "",
        ...this.pageParams,
        isHome: "1"
      };
      this.tlm_isLoading = true;
      getWaitWriteDocList(data)
        .then(resData => {
          if (resData.code === 1 && resData.data) {
            this.eleData = resData.data;
            this.pageParams.total = resData.total;
          } else {
            this.$message(resData.msg || "待本人审签接口报错");
          }
          this.tlm_isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.tlm_isLoading = false;
          this.$message(error || error.msg || "待本人审签接口报错");
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.choose-con {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .search-con {
    flex: 1;
    display: flex;
    .common-item {
      margin-right: 10px;
      margin-top: 10px;
      width: 260px;
    }
    .large-width {
      width: 360px;
    }
  }

  .search-btns {
    margin-top: 10px;
    width: auto;
    float: right;
  }
}

.table-con {
  margin-top: 20px;
  height: calc(100% - 60px);
}

/deep/ .el-button--mini {
  margin-left: 5px;
  height: 26px;
  font-size: 12px;
  padding: 3px 10px;
}

/deep/ .red-color {
  color: red;
}

/deep/ .el-form-item {
  margin-bottom: 20px;
}
</style>
