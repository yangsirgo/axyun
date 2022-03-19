<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search-input">
        <el-row :gutter="10">
          <el-col :span="4">
            <l-formt-title label="药房" labelWidth="36">
              <el-select v-model="searchData.pharCode" placeholder="请选择">
                <el-option
                  v-for="item in drugStorageList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="4">
            <l-formt-title label="日期" labelWidth="40">
              <el-select v-model="searchData.weekDay" placeholder="请选择">
                <el-option v-for="item in days" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </l-formt-title>
          </el-col>
          <el-col :span="16" style="text-align:right;">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
            <el-button type="primary" plain @click="del">删除</el-button>
            <el-button type="primary" plain @click="newadd">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <div
        class="drug-list-cont position-absolute"
        style="top: 45px;bottom:20px;left: 20px;right: 20px;"
      >
        <el-table
          ref="singleTable"
          :data="drugData"
          border
          width="100%"
          height="100%"
          highlight-current-row
          @current-change="rowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            v-for="(item,index) in drugParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'pharCode'">
                <span
                  columns="STORAGE_NAME"
                  :conditionMap="{STORAGE_CODE:scope.row.pharCode}"
                  tableName="hrp_drgstrg"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'weekDay'">
                <span v-if="scope.row.weekDay=='1'">星期一</span>
                <span v-if="scope.row.weekDay=='2'">星期二</span>
                <span v-if="scope.row.weekDay=='3'">星期三</span>
                <span v-if="scope.row.weekDay=='4'">星期四</span>
                <span v-if="scope.row.weekDay=='5'">星期五</span>
                <span v-if="scope.row.weekDay=='6'">星期六</span>
                <span v-if="scope.row.weekDay=='7'">星期日</span>
              </template>
              <template v-else-if="item.prop == 'startTime'">
                <span>{{ scope.row[item.prop] | formatTime('hh:mm')}}</span>
              </template>
              <template v-else-if="item.prop == 'endTime'">
                <span>{{ scope.row[item.prop] | formatTime('hh:mm')}}</span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import stock from "@/api/hmm/stock";
export default {
  name: "drugList",
  props: ["refreshList", "drugStorageList"],
  mounted() {
    this.search();
  },
  data() {
    return {
      //搜索条件
      searchData: {
        pharCode: "",
        weekDay: ""
      },
      days: [
        { id: 1, name: "星期一" },
        { id: 2, name: "星期二" },
        { id: 3, name: "星期三" },
        { id: 4, name: "星期四" },
        { id: 5, name: "星期五" },
        { id: 6, name: "星期六" },
        { id: 7, name: "星期日" }
      ], //日期

      //表头数据
      drugParams: [
        {
          prop: "pharCode",
          label: "药房名称",
          align: "left",
          width: "100",
          fixed: "left"
        },
        {
          prop: "weekDay",
          label: "日期",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "startTime",
          label: "开始时间",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "endTime",
          label: "结束时间",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "workCoefficient",
          label: "工作系数",
          align: "left",
          width: "90",
          fixed: false
        },

        {
          prop: "createdByName",
          label: "创建人",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "createdAt",
          label: "创建时间",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "updatedByName",
          label: "修改人",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "updatedAt",
          label: "修改时间",
          align: "left",
          width: "120",
          fixed: false
        }
      ],
      //表格数据
      drugData: [],
      chacklist: [], //删除选中的数据
      //分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 1000,
        total: 0
      },
      tlm_isLoading: false
    };
  },
  filters: {
    formatTime(date, fmt) {
      date = new Date(date);
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          var str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
          );
        }
      }
      return fmt;
    }
  },
  watch: {
    refreshList() {
      this.getDrugList();
    }
  },
  methods: {
    //获取药品表格数据
    getDrugList() {
      this.$showLoading();
      let workTimeQueryVO = {};
      workTimeQueryVO.pharCode = this.searchData.pharCode;
      workTimeQueryVO.weekDay = this.searchData.weekDay;
      workTimeQueryVO.pageNo = this.pageParams.pageNo;
      workTimeQueryVO.pageSize = this.pageParams.pageSize;
      stock
        .getWorkTimeList(workTimeQueryVO)
        .then(res => {
          if (res.code == 1) {
            this.$hideLoading();
            this.drugData = res.data;
            // this.setCurrent(this.drugData[0]);
            // this.$emit("getIsDrug", this.drugData[0]);
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg);
        });
    },
    //高亮首行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    //搜索
    async search() {
      this.getDrugList();
    },
    //重置
    reset() {
      this.searchData.pharCode = "";
      this.searchData.weekDay = "";
      this.pageParams.pageNo = 1;
      this.pageParams.total = 0;
      this.search();
    },
    //点击某一行药品
    rowClick(row) {
      this.$emit("getIsDrug", row);
    },

    //勾选行
    handleSelectionChange(val) {
      this.chacklist = val;
    },
    //删除行
    del() {
      if (this.chacklist.length == 0) {
        this.$message.warning("请选择一条或者多条数据");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "是否删除选中条目?",
        confirm: (action, instance, done) => {
          let ids = this.chacklist.map(item => item.id);
          this.$showLoading();
          stock
            .delWorkTime(ids)
            .then(res => {
              done();
              this.$hideLoading();
              if (res.code === 1) {
                this.$message.success(res.msg || "删除成功!");
                this.search();
              } else {
                this.$message.error(res.msg || "删除失败!");
              }
            })
            .catch(err => {
              done();
              this.$hideLoading();
              this.$message.error(err.msg || "删除失败!");
            });
        }
      });
    },
    newadd() {
      this.$emit("newadd");
    }
  }
};
</script>

<style lang="scss" scoped>
.drugList {
  .card-cont {
    padding: 16px;

    .search-button {
      width: 80px;
      height: 36px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;

      font-weight: 400;
      color: $l-color-white;
    }

    .drug-list-cont {
      margin-top: 16px;
    }
  }
}
</style>
