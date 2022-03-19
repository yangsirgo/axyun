<template>
  <div class="width100 height100">
    <!-- <el-popover placement="bottom" width="400" trigger="manual" :value="showPopover">
      <el-table
        ref="singleTable"
        :data="tableData1"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="date" label="日期" width="120"></el-table-column>
        <el-table-column property="name" label="姓名" width="120"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
      <el-input
        slot="reference"
        v-model="input"
        placeholder="请输入内容"
        @change="showPopover = true"
        @keyup.native="showPopover = true"
      ></el-input>
    </el-popover>-->

    <l-input-table :tableData="tableData1" :tableParams="tableParams1" @query="test" @select="test1"></l-input-table>
    <el-table :data="tableData" border>
      <el-table-column type="selection" width="35px" header-align="center" align="center"></el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50px"
        header-align="center"
        align="center"
        fixed="left"
      ></el-table-column>
      <el-table-column
        v-for="(item,index) in tableParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        class="overflow-point"
        :min-width="item.width"
        header-align="center"
        :align="item.align || 'left'"
      >
        <template slot-scope="scope">
          <template v-if="item.prop == 'operate'">
            <i
              class="el-icon-edit cursor-pointer operate-btn"
              @click="editItemPlus(scope.$index, scope.row)"
            ></i>
          </template>
          <template v-else>
            <l-editable-cell
              v-model="form[item.prop]"
              :editable="!!scope.row.editable"
              :stopTab="item.prop == 'address'"
              @stopTab="confirmHandler"
              @blur="blurHandler(scope, item.prop == 'address')"
            >
              <span
                slot="content"
                class="overflow-point display-inherit"
              >{{formatData(scope.row.editable ? form : scope.row, item)}}</span>
            </l-editable-cell>
            <!-- <l-editable-cell
              v-else
              v-model="form[item.prop]"
              :editable="!!scope.row.editable"
              :stopTab="item.prop == 'address'"
              @stopTab="confirmHandler"
              @blur="blurHandler(scope, item.prop == 'address')"
              editableComponent="l-input-table"
              :tableData="tableData1" 
              :tableParams="tableParams1" 
              @query="test" 
              @select="test1"
            >
              <span
                slot="content"
                class="overflow-point display-inherit"
              >{{formatData(scope.row.editable ? form : scope.row, item)}}</span>
            </l-editable-cell> -->
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格数据
      tableParams: [
        {
          prop: "code",
          label: "编码",
          align: "center",
          width: "100"
        },
        {
          prop: "type",
          label: "科室类型",
          align: "left",
          width: "150"
        },
        {
          prop: "address",
          label: "地址",
          align: "left",
          width: "300"
        },
        {
          prop: "operate",
          label: "操作",
          align: "center",
          width: "100"
        }
      ],
      tableData: [
        {
          code: "CS001",
          type: "1",
          address: "天津"
        },
        {
          code: "CS002",
          type: "1",
          address: "天津"
        },
        {
          code: "CS003",
          type: "1",
          address: "天津"
        }
      ],
      form: {},
      options: [],
      optionParams: [
        {
          prop: "key1",
          width: ""
        }
      ],
      selVal: "",
      loading: false,
      tableData1: [],
      tableParams1: [
        {
          prop: "name",
          label: "名称",
          width: "60"
        },
        {
          prop: "date",
          label: "日期",
          width: "60"
        },
        {
          prop: "address",
          label: "地址",
          width: "60"
        }
      ],
      input: "",
      showPopover: false
    };
  },
  methods: {
    blurHandler(data, islast) {
      console.log("----", this.form);
      console.log(data, islast);
    },
    confirmHandler() {
      console.log("----", this.form);
      this.$message("这是最后一格，可以做表单确认提交处理");
    },
    editItemPlus(index, row) {
      this.form = { ...row };
      this.tableData[index].editable = true;
    },
    formatData(row, item) {
      return row[item.prop];
    },
    remoteMethod() {
      this.options = [
        {
          value: "选项1",
          label: "黄金糕",
          disabled: true
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ];
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    inputChange() {
      this.showPopover = true;
      console.log("=======");
    },
    inputBlur() {
      this.showPopover = false;
    },
    test(str) {
      console.log("查询", str);
      this.tableData1 = [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    },
    test1(data) {
      console.log("选中", data);
    }
  }
};
</script>