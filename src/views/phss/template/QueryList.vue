<template>
  <div class="QueryList">
    <header class="QueryList_header" ref="header">
      <p-title-search
        @query-method="queryMethod"
        @reset-method="resetMethod"
        @show="expandCollapse"
        :boxshow="boxshow"
      ></p-title-search>
      <div class="query_conditions">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <l-formt-title label="姓名/简码" style="width: 90%;">
              <el-input placeholder="请输入" v-model="input" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="健康档案编号" class="center" style="width: 90%;">
              <el-input placeholder="请输入" v-model="input" clearable></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="人群类别" class="center" style="width: 90%;">
              <el-select v-model="input" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in crowdCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="出生时间" class="fr" style="width: 90%;">
              <el-date-picker
                v-model="input"
                type="daterange"
                prefix-icon="icon iconfont iconriqi"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-show="boxshow">
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="性别" style="width: 90%;">
                  <el-select v-model="input" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in crowdCategoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="纸质档案编号" class="center" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="input" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="居委会/网络" class="center" style="width: 90%;">
                  <el-select v-model="input" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in crowdCategoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="建档时间" class="fr" style="width: 90%;">
                  <el-date-picker
                    class="fr"
                    v-model="input"
                    type="daterange"
                    prefix-icon="icon iconfont iconriqi"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="电话" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="input" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="个人档案状态" class="center" style="width: 90%;">
                  <el-select v-model="input" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in crowdCategoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="医疗机构" class="center" style="width: 90%;">
                  <el-select v-model="input" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in crowdCategoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="登记录入时间" class="fr" style="width: 90%;">
                  <el-date-picker
                    v-model="input"
                    type="daterange"
                    prefix-icon="icon iconfont iconriqi"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row class="pt-10" type="flex" justify="space-between">
              <el-col :span="6">
                <l-formt-title label="电话" style="width: 90%;">
                  <el-input placeholder="请输入" v-model="input" clearable></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="6">
                <l-formt-title label="家庭档案状态" style="width: 90%;">
                  <el-select v-model="input" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in crowdCategoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
    </header>
    <main
      class="QueryList_main"
      :style="{'max-height':mainHeight + 'px','min-height':mainHeight + 'px'}"
    >
      <p-title-list @new-method="newMethod($index,row)" @refresh-method="refreshMethod"></p-title-list>
      <div>
        <el-table
          :data="tableData"
          @row-dblclick="rowDblclick"
          :height="mainHeight - 153"
          border
          style="width: 100%"
        >
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">档案编号</div>
              <div class="table_header">纸质档案编号</div>
            </template>
            <template slot-scope="scope">
              <div>522526198907090819</div>
              <div>522526198907090819</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">姓名</div>
              <div class="table_header">身份证号</div>
            </template>
            <template slot-scope="scope">
              <div>王忠宁</div>
              <div>4600026198907090819</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="50">
            <template slot="header">
              <div class="table_header">性别</div>
              <div class="table_header">年龄</div>
            </template>
            <template slot-scope="scope">
              <div>女</div>
              <div>39</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="120">
            <template slot="header">
              <div class="table_header">建档日期</div>
              <div class="table_header">登记录入日期</div>
            </template>
            <template slot-scope="scope">
              <div>2015-07-15</div>
              <div>2015-07-15</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" show-overflow-tooltip>
            <template slot="header">
              <div class="table_header">建档机构</div>
              <div class="table_header">当前机构</div>
            </template>
            <template slot-scope="scope">
              <div class="hidden">{{scope.row.address}}</div>
              <div class="hidden">{{scope.row.address}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="date">
            <template slot="header">
              <div class="table_header">责任医生</div>
              <div class="table_header">网格</div>
            </template>
            <template slot-scope="scope">
              <div>遵义中路居委会</div>
              <div>C区十九网格14栋</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="100">
            <template slot="header">
              <div class="table_header">责任医生</div>
              <div class="table_header">建档人</div>
            </template>
            <template slot-scope="scope">
              <div>王淼</div>
              <div>王黎洁</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="100">
            <template slot="header">
              <div class="table_header">档案状态</div>
              <div class="table_header">家庭档案</div>
            </template>
            <template slot-scope="scope">
              <div>暂存</div>
              <div>无</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="120">
            <template slot="header">
              <div class="table_header">人群类别</div>
            </template>
            <template slot-scope="scope">
              <div>普</div>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="280">
            <template slot="header">
              <div class="table_header">操作</div>
            </template>
            <template slot-scope="scope">
              <el-button type="success" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" @click="handleIntegrated(scope.$index, scope.row)">综合管理</el-button>
              <el-dropdown class="ml-10">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="handleReview(scope.$index, scope.row)"
                    icon="el-icon-plus"
                  >复核</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="handleArchive(scope.$index, scope.row)"
                    icon="el-icon-circle-plus"
                  >封存</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="handleDelete(scope.$index, scope.row)"
                    icon="el-icon-circle-plus-outline"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="QueryList_main_page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="reqParams.pageNo"
        :page-sizes="[20, 40, 100, 200]"
        :page-size="reqParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </main>
  </div>
</template>

<script>
import { adaptiveHeight, saveHeaderHeight } from "@/utils/common";
export default {
  name: "QueryList",
  components: {},
  data() {
    return {
      boxshow: false,
      input: "",
      total: 0,
      reqParams: {
        pageNo: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address:
            "上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      //--- Options ---
      // 人群类别选项
      crowdCategoryOptions: [
        {
          value: "1",
          label: "普通人群"
        },
        {
          value: "2",
          label: "高血压"
        },
        {
          value: "3",
          label: "糖尿病"
        },
        {
          value: "4",
          label: "老年人"
        },
        {
          value: "5",
          label: "儿童"
        },
        {
          value: "6",
          label: "孕产妇"
        },
        {
          value: "7",
          label: "结核病"
        },
        {
          value: "8",
          label: "精神病"
        },
        {
          value: "9",
          label: "贫困人群"
        },
        {
          value: "10",
          label: "低收入人群"
        }
      ]
    };
  },
  computed: {
    mainHeight() {
      // console.log("adaptiveHeight()", adaptiveHeight());
      return adaptiveHeight();
    }
  },
  created() {
    saveHeaderHeight(143);
  },
  mounted() {
    saveHeaderHeight(this.$refs.header.offsetHeight);
  },
  methods: {
    expandCollapse() {
      this.boxshow = !this.boxshow;
      this.boxshow ? saveHeaderHeight(290) : saveHeaderHeight(143);
    },
    queryMethod() {
      console.log("查询queryMethod");
    },
    resetMethod() {
      console.log("重置resetMethod");
    },
    newMethod() {
      console.log("新建newMetho");
    },
    refreshMethod() {
      console.log("刷新refreshMethod");
    },
    // --- 操作 ---
    handleView(index, row) {
      console.log("查看---", index, row);
    },
    handleEdit(index, row) {
      console.log("编辑---", index, row);
    },
    handleIntegrated(index, row) {
      console.log("综合管理---", index, row);
    },
    // 当某一行被双击时会触发该事件
    rowDblclick(row) {
      console.log("双击---", row);
    },
    handleReview(index, row) {
      console.log("复核---", index, row);
    },
    handleArchive(index, row) {
      console.log("封存---", index, row);
    },
    handleDelete(index, row) {
      console.log("删除---", index, row);
    },
    // --- 操作 ---
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.QueryList {
}
</style>