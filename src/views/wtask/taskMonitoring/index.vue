<template>
  <div class="app-container">
    <el-row :gutter="20" style="height:35%">
      <el-col :span="8" style="height:100%">
        <el-card shadow="never" style="height:100%">
          <!-- <div class="title" style="margin-left:20px">节点列表:</div> -->
          <div slot="header" class="clearfix">
            <span>节点列表</span>
          </div>
          <!-- <el-table ref="table" :data="data" row-key="id" height="90%" border>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="node" label="节点" align="center"></el-table-column>
          </el-table>-->
          <div class="data">
            <div
              v-for="(item,index) in data"
              :key="index"
              class="node"
              @click="handleClick(item,index)"
            >
              <i
                class="el-icon-arrow-left"
                style="margin-right: -9px;font-size: 17px;margin-top: 5px;color:#303133"
              ></i>
              <span>{{index+1}}</span>
              <i
                class="el-icon-arrow-right"
                style="margin-left: -8px;font-size: 17px;margin-top: 5px;color:#303133"
              ></i>
              <span style="padding-left:0px">{{item}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card" shadow="never">
          <div class="title">主节点</div>
          <!-- <div class="titles">{{threadInfo.leader}}</div> -->
          <div class="runStatus">
            <span class="runingStyle" v-if="threadInfo.leader">
              {{threadInfo.leader}}
              <span style="color:#5daf34;padding-left:10px">Running</span>
            </span>
          </div>
          <el-table ref="table" :data="threadData" row-key="id" border :cell-style="tableCellStyle">
            <el-table-column prop="completedTaskCount" label="已完成任务总数" align="center"></el-table-column>
            <el-table-column prop="activeCount" label="正在执行任务数" align="center"></el-table-column>
            <el-table-column prop="poolSize" label="线程数量" align="center"></el-table-column>
            <!-- <el-table-column prop="taskSize" label="任务总数" align="center"></el-table-column> -->
            <el-table-column prop="taskSize" label="任务总数" align="center">
              <template slot-scope="scope">
                <div class="taskSize" @click="handleTask">{{ scope.row.taskSize }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="queue" label="队列任务数" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <div class="tableData">
      <div class="search">
        <el-input v-model="form.tname" placeholder="请输入任务名称"></el-input>
        <span style="padding-left:20px;font-weight:600;color:#303133;">状态:</span>
        <el-select v-model="form.status" placeholder="请选择状态" style="margin-left:5px;width:80px">
          <el-option
            v-for="item in options"
            :key="item.status"
            :label="item.statusName"
            :value="item.status"
          ></el-option>
        </el-select>
        <el-button type="primary" class="searchBtn" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </div>
      <el-table ref="table" :data="tableData" row-key="id" border height="95%">
        >
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column
          prop="time"
          label="任务名称"
          show-overflow-tooltip
          align="center"
          width="220px"
        >
          <template slot-scope="scope">{{ scope.row.tname }}</template>
        </el-table-column>
        <el-table-column prop="logeDails" label="日志描述" align="center" width="220px">
          <template slot-scope="scope">{{ scope.row.message }}</template>
        </el-table-column>
        <el-table-column prop="logeDails" label="日志详情" align="center">
          <template slot-scope="scope">
            <div class="logStyle" @click="handleLogInfo(scope.row)">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="调用时间" align="center" width="90px">
          <template slot-scope="scope">{{ scope.row.duration }}ms</template>
        </el-table-column>
        <el-table-column prop="time" label="执行日期" align="center" width="160px">
          <template slot-scope="scope">{{ scope.row.indate }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="50px">
          <template slot-scope="scope">
            <i class="el-icon-error" v-if="scope.row.status!='1'" style="color:#ff0000" title="异常"></i>
            <span v-else class="el-icon-success" title="正常"></span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="moduleName" label="模块名" align="center"></el-table-column>
        <el-table-column
          prop="logeDails"
          label="日志详情"
          align="center"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="150" align="center">
          <i class="el-icon-warning" v-if></i>
        </el-table-column>-->
      </el-table>
      <pagination
        :total="total"
        :pageSize.sync="form.pageSize"
        :page.sync="form.page"
        @pagination="changeSize"
      />
    </div>
    <el-dialog title="任务列表" :visible.sync="visible" :before-close="handleClose">
      <el-table ref="table" :data="task" row-key="id" height="250px" border>
        <el-table-column type="index" label="序号" width="60px" align="center"></el-table-column>
        <!-- <el-table-column prop="taskCode" label="任务编码" align="center"></el-table-column> -->
        <el-table-column prop="taskCode" label="任务编码" align="center">
          <template slot-scope="scope">
            <span class="taskSize" @click="handleTask">{{ scope.row }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column> -->
      </el-table>
    </el-dialog>

    <el-dialog title="日志详情" :visible.sync="logVisible" :before-close="handleLogClose">
      <div v-html='logInfo'></div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getNodeData,
  getMetricsData,
  getTask,
  getTaskLog
} from "@/api/wtask/taskMonitoring";
export default {
  data() {
    return {
      logVisible: false,
      timeInterval: null,
      total: 0,
      threadData: [],
      threadInfo: {},
      visible: false,
      tableData: [
        // {
        //   moduleName: "模块一dsd",
        //   logeDails: "日志详情日志详情日志详情",
        //   status: "正常"
        // },
        // {
        //   moduleName: "模块一模块模块模块",
        //   logeDails: "日志详情日志详情日志详情",
        //   status: "不正常"
        // },
        // {
        //   moduleName: "模块",
        //   logeDails: "日志详情日志详情日志详情",
        //   status: "正常"
        // },
        // {
        //   moduleName: "模块一",
        //   logeDails: "日志详情日志详情日志详情日志详情日志详情详情日志详情日志详详情日志详情日志详情日志详情详情日志详情日志详详情日志详情日志详情日志详情详情日志详情日志详情日志详情日志详情日志详情日志详情日志详情日志详情日志详情",
        //   status: "正常"
        // }
      ],
      options: [
        {
          status: "",
          statusName: "全部"
        },
        {
          status: "1",
          statusName: "正常"
        },
        {
          status: "0",
          statusName: "异常"
        }
      ],
      logInfo: "",
      data: [],
      form: {
        page: 1,
        pageSize: 10,
        //orderBy: "in_date desc",
        status: "",
        tname: ""
      },
      loading: true,
      task: []
    };
  },
  mounted() {
    // this.form.status = "1";
    this.getNodeData();
    this.getMetricsData();
    this.getTaskLog();
    this.refresh();
    setTimeout(() => {
      this.$refs.table.doLayout();
    }, 1200);
  },
  destroyed() {
    clearInterval(this.timeInterval);
  },
  methods: {
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        return "background: rgb(217, 239, 245)";
      }
      return "";
    },

    handleLogInfo(data) {
      console.log("data", data.content);
      let str = data.content;
      let logContent = str.replace(/\n/g, "<br/>");
      console.log('logContent', logContent)
      this.logVisible = true;
      this.logInfo = logContent;
    },

    handleLogClose() {
      this.logVisible=false;
    },

    refresh() {
      this.loading = false;
      this.timeInterval = setInterval(() => {
        this.getNodeData();
        this.getMetricsData();
      }, 16000);
    },

    getNodeData() {
      getNodeData(this.loading).then(res => {
        if (res.code == 1) {
          console.log("res", res);
          this.data = res.data;
        }
      });
    },

    getMetricsData() {
      getMetricsData(this.loading).then(res => {
        if (res.code == 1) {
          console.log("res", res);
          // this.data=res.data;
          this.threadInfo = res.data;
          this.threadData = [res.data];
          this.task = res.data.tasks;
        }
      });
    },

    getTaskLog() {
      getTaskLog(this.form).then(res => {
        if (res.code === 1) {
          console.log("list", res);
          this.tableData = res.data;
          this.total = res.total;
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    handleQuery() {
      //this.isReset = true;
      let obj = {
        pageSize: 10,
        page: 1
        //orderBy: "in_date desc",
      };
      this.form = { ...this.form, ...obj };
      // console.log("this.form",this.form)
      this.getTaskLog();
    },

    handleRun() {},

    changeSize(val) {
      this.form = {  ...this.form, ...val};
      console.log("val", this.form);
      this.getTaskLog();
    },

    handleClick(item, index) {},

    handleTask() {
      console.log("111", 111);
      this.visible = true;
      //this.getTask();
    },

    handleClose() {
      this.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  background: #fff;
  height: 100%;
  padding: 0;
}
.title {
  height: 30px;
  line-height: 30px;
  font-weight: 600;
}
.titles {
  height: 30px;
  line-height: 30px;
  font-weight: 500;
  font-size: 14px;
}
.el-col-8 {
  width: 38%;
  height: 100%;
  background: #fff;
  padding: 20px 10px 0 !important;
}
.el-col-16 {
  width: 60.7%;
  margin-left: 1.3%;
  height: 100%;
  background: #fff;
  padding: 20px 20px 20px 10px;
}
.box-card {
  padding: 20px;
  margin-bottom: 15px;
  height: 100%;
  overflow-y: auto;
}
.el-row .el-col:first-child {
  padding: 20px !important;
}
.el-row .el-col:last-child {
  padding: 20px !important;
}
.search {
  padding: 0 0 10px;
  .el-input {
    width: 255px;
  }
}
.searchBtn {
  margin-left: 20px;
}
.runStatus {
  height: 50px;
  line-height: 50px;
}
.node {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
}
.node:hover {
  background: #eee;
}
.clearfix {
  height: 10px;
  line-height: 10px;
}
.data {
  height: 75%;
  padding-top: 15px;
  overflow-y: auto;
}
.tableData {
  padding: 0 20px 0;
  height: 45%;
}
/deep/.el-tooltip__popper {
  max-width: 500px;
}
.order {
  border: 1px solid #000;
  color: #000;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
  padding: 0 3px;
  width: 15px;
  height: 15px;
}
.runingStyle {
  height: 35px;
  line-height: 35px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #2b4583;
}
// .pagination-container {
//   margin: -5px !important;
// }

.taskSize:hover {
  color: #5daf34;
  cursor: pointer;
}
/deep/.el-dialog__body {
  padding: 20px;
}
.cell-grey {
  background: #666;
}
.logStyle {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.el-dialog__body {
    padding: 20px;
    height: 400px;
    overflow-y: auto;
}
</style>
