<template>
  <div class="width100 height100 container" ref="page">
    <l-table
      :pagination="pagination"
      hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="width100 height100 padding10"
    >
      <template slot="table-top-bar">
        <div class="width100">
          <el-row class="width100">
            <el-col :span="22">
              <el-row :gutter="10">
                <el-col :span="4">
                  <l-select-with-title :title="'科室'" class="input-width"></l-select-with-title>
                </el-col>
                <el-col :span="4">
                  <l-select-with-title :title="'医生'" class="input-width"></l-select-with-title>
                </el-col>
                <el-col :span="4">
                  <l-select-with-title :title="'状态'" class="input-width"></l-select-with-title>
                </el-col>
                <el-col :span="6">
                  <el-date-picker
                    v-model="searchForm.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="input-width"
                  ></el-date-picker>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" @click="select">查询</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <el-button class="float-right" type="primary" @click="openDialog">停诊</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <template slot="table-body">
        <el-table :data="tableData" stripe @selection-change="getRowsIdx" border>
          <el-table-column type="selection" width="35px" header-align="center" align="center"></el-table-column>
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed === true"
          >
            <template slot-scope="scope">
              <!--操作部分自定义-->
              <template v-if="item.prop == 'operate'">
                <el-button>出诊</el-button>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </l-table>
    <!-- 停诊弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="dialog-div">
        <span>停诊操作</span>
        <br />
        <span class="span-two">{{"泌尿外科，王鑫安，2019-08-05，周二，上午"}}</span>
        <br />
        <span class="span-three">停诊后挂号暂时无法选择此班次</span>
        <br />
        <span>你要继续吗？</span>
        <br />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">停诊</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import adHeight from "@/mixins/adHeight";
export default {
  mixins: [adHeight],
  data() {
    return {
      // 表格数据
      tableData: [
        {
          classesId: "321231",
          sDept: "泌尿外科",
          doctor: "罗恒",
          diagTreattype: "专家号",
          outTime: "2019-06-08",
          status: "停诊",
          addTime: "2019-08-07 13:00",
          addUser: "刘明"
        },
        {
          classesId: "321231",
          sDept: "泌尿外科",
          doctor: "罗恒",
          diagTreattype: "专家号",
          outTime: "2019-06-08",
          status: "停诊",
          addTime: "2019-08-07 13:00",
          addUser: "刘明"
        },
        {
          classesId: "321231",
          sDept: "泌尿外科",
          doctor: "罗恒",
          diagTreattype: "专家号",
          outTime: "2019-06-08",
          status: "停诊",
          addTime: "2019-08-07 13:00",
          addUser: "刘明"
        }
      ],
      // 表格列
      tableParams: [
        {
          label: "班次ID",
          prop: "classesId",
          width: "100",
          align: "left"
        },
        {
          label: "科室",
          prop: "sDept",
          width: "120",
          align: "left"
        },
        {
          label: "医生",
          prop: "doctor",
          width: "120",
          align: "left"
        },
        {
          label: "出诊级别",
          prop: "diagTreattype",
          width: "100",
          align: "left"
        },
        {
          label: "出诊时间",
          prop: "outTime",
          width: "100",
          align: "left"
        },
        {
          label: "状态",
          prop: "status",
          width: "100",
          align: "left"
        },
        {
          label: "添加时间",
          prop: "addTime",
          width: "100",
          align: "left"
        },
        {
          label: "添加人",
          prop: "addUser",
          width: "100",
          align: "left"
        },
        {
          label: "操作",
          prop: "operate",
          width: "100",
          align: "center"
        }
      ],
      searchForm: {},
      // 弹窗
      dialogVisible: false,
      // 选中集合
      selectedIds: [],
      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 1,
        layout: "sizes,prev,pager,next,jumper,total"
      }
    };
  },
  methods: {
    // 选中
    getRowsIdx() {
      let ids = [];
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        ids.push(item.id);
      }
      this.selectedIds = ids;
    },
    // 查询
    select() {},
    // 打开
    openDialog() {
      this.dialogVisible = true;
    },
    // 关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 切换到某页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.loadTableData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.loadTableData();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 30px;
  padding: 0 20px;
  min-width: 1024px;
}
.dialog-div {
  width: 100%;
  height: 150px;
  span {
    line-height: 30px;
  }
  .span-two {
    font-weight: bold !important;
    font-size: 16px !important;
  }
  .span-three {
    color: #3d7dfb !important;
  }
}
.input-width {
  width: 100%;
}
</style>