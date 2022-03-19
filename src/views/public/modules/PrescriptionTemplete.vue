<template>
  <div class="width100 height100">
    <div class="top-container">
      <el-radio-group v-model="cateogry" class="align-center" @change="typeChange">
        <el-radio :label="0">全院</el-radio>
        <el-radio :label="1">科室</el-radio>
        <el-radio :label="2">个人</el-radio>
      </el-radio-group>
      <el-input
        placeholder="请输入检索条件"
        v-model="keyword"
        @change="keywordUpdate"
        style="margin-top:8px;"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="content">
      <el-table
        ref="tableElem"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%;"
        height="100%"
        v-loadmore="loadNextPage"
        element-loading-text="加载中..."
      >
        <el-table-column prop="name" label="模板名" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="act-word cursor-pointer"
              @click="showDetail(scope.row)"
            >{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="备注" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="templeteName" :visible="dialogVisible" width="600px">
      <div style="padding:5px;">
        <el-table :data="templeteTableData" border>
          <el-table-column
            v-for="(item,index) in templeteTableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="quote">引 用</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 处方模板
export default {
  data() {
    return {
      // 检索关键词
      keyword: "",
      // 类型值
      cateogry: "1",

      // 列表数据
      tableData: [],
      // 分页控制参数
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },

      // table 分页加载必须定义字段
      tlm_isLoading: false,

      // 模板数据
      templeteName: "",
      templeteTableData: [],
      // 表格数据
      templeteTableParams: [
        {
          prop: "name",
          label: "名称",
          width: "100",
          align: "center"
        },
        {
          prop: "key1",
          label: "规格",
          width: "100"
        },
        {
          prop: "key2",
          label: "一次剂量",
          width: "50"
        },
        {
          prop: "key3",
          label: "剂量单位",
          width: "50",
          align: "center"
        },
        {
          prop: "key4",
          label: "频次",
          width: "50"
        }
      ],
      dialogVisible: false
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
    this.loadTable();
  },
  methods: {
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 加载table数据
    async loadTable() {
      console.log("loadTable");
      try {
        this.tlm_isLoading = true;
        // TODO await request
        let tableData = [...this.tableData];
        tableData.push({
          name: "名称",
          remark: "备注"
        });
        this.tableData = tableData;
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    // 搜索关键词
    keywordUpdate() {
      console.log("keywordUpdate", this.keyword);
      this.loadTable();
    },
    // 分类切换
    typeChange() {
      console.log("typeChange", this.cateogry);
      this.loadTable();
    },
    // 显示诊断详情
    showDetail(data) {
      this.templeteName = "";
      this.templeteTableData = [
        {
          name: "name",
          key1: "key1",
          key2: "key2",
          key3: "key3",
          key4: "key4"
        }
      ];
      this.dialogVisible = true;
    },
    quote() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.top-container {
  height: 60;
}

.select-container {
  width: 80px;
}

.content {
  position: absolute;
  top: 80px;
  bottom: 0px;
  left: 10px;
  right: 10px;
  overflow: hidden;
}

.act-word {
  color: $l-color-fontcolor-2;
}
</style>
