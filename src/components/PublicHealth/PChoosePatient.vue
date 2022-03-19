<template>
  <div class="PChoosePatient">
    <div>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-input
            style="width:90%;"
            placeholder="姓名或简码"
            v-model="reqParams.rsdtName"
            class="search"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-select
            style="width:90%;"
            v-model="reqParams.grid"
            placeholder="---请选择网格---"
            clearable
            filterable
          >
            <el-option
              v-for="item in gridOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-input style="width:90%;" placeholder="身份证号" v-model="reqParams.idNo" class="search"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button @click="getSysPatinfo" style="margin-left: 10px;">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="mt-10" type="flex" justify="space-between">
        <el-col :span="7">
          <el-input
            style="width:90%;"
            placeholder="健康档案编号"
            v-model="reqParams.digDocNo"
            class="search"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-select
            style="width:90%;"
            v-model="reqParams.cmntCmtId"
            placeholder="---请选择居委会---"
            clearable
            filterable
            @change="onChangeRegion"
          >
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <!-- :disabled="popupStatus=='view'" -->
          <el-select

            v-model="reqParams.responsibleDrId"
            placeholder="---请选择责任医生---"
            clearable
            filterable
          >
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button @click="queryList" style="margin-left: 10px;">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main_table">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        @row-click="showRow"
        max-height="360"
        border
        stripe
      >
        <el-table-column label="选择" width="70" center>
          <template slot-scope="scope">
            <!-- &nbsp; 为空，不加这个radio的label会显示index数字，注意从0开始的；radio会全选的问题是label相同导致的 -->
            <el-radio
              class="radio"
              v-model="radio"
              :label="scope.$index"
              @change.native="getCurrentRow(scope.$index)"
            >&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="dig_doc_no" label="健康档案编号" width="130"></el-table-column>
        <el-table-column prop="rsdt_name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="sex" label="性别" width="120"></el-table-column>
        <el-table-column prop="id_no" label="身份证号" width="120"></el-table-column>
        <el-table-column prop="doc_status_desc" label="当前状态" width="80"></el-table-column>
        <el-table-column prop="responsible_dr_name" label="责任医生姓名" width="100"></el-table-column>
        <el-table-column prop="create_doc_date" label="建档日期" width></el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        :total="total"
        :pageSize.sync="reqParams.pageSize"
        :page.sync="reqParams.pageNo"
        @pagination="changeSize"
      />
    </div>
  </div>
</template>

<script>
// import {
//   getSysPatinfoList,
//   getNewVisRecord,
//   getSysPatinfoVisDtoList
// } from "../../api/tumor/mdt";
// import { regionDataPlus, CodeToText } from "element-china-area-data";
import { onQueryDocIndex } from "@/api/phss/docIndex/docIndex";
import { queryRegionAndGridByHospitalId } from "@/api/phss/region/grid_information";
import { onGet, onPost } from "@/api/public/public";
export default {
  name: "PChoosePatient",
  props: {},
  data() {
    return {
      radio: null,
      gridOptions: [],
      regionOptions: [],
      userOptions: [],
      reqParams: {
        pageNo: 1,
        pageSize: 10,
        grid: "",
        rsdtName: "",
        idNo: "",
        digDocNo: "",
        responsibleDrId: "",
        cmntCmtId: "",
        docStatus: "01"
      },
      tableData: [],
      // 选中数据
      chooseDate: "",
      // 分页总数
      total: 0
      // 查询参数
    };
  },
  created() {
    this.getSysPatinfo();
    this.getRegionAndGridByHospitalId();
  },
  mounted() {},
  methods: {
    getRegionAndGridByHospitalId() {
      queryRegionAndGridByHospitalId({
        hospitalId: null
      })
        .then(res => {
          console.log(res);
          if (res.code === 1) {
            this.regionOptions = res.data;
          } else {
            this.regionOptions = [];
          }
        })
        .catch(error => {
          console.log(error);
        });
      onPost({
        url: "/phss/sysPublic/onQueryUsersByHosId",
        data: { hosId: null }
      })
        .then(res => {
          console.log(res);
          if (res.code === 1) {
            this.userOptions = res.data;
          } else {
            this.userOptions = [];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onChangeRegion() {
      for (var i = 0; i < this.regionOptions.length; i++) {
        if (this.reqParams.cmntCmtId == this.regionOptions[i].value) {
          this.gridOptions = this.regionOptions[i].children;
          break;
        }
      }
    },
    // 查询接口
    getSysPatinfo() {
      onQueryDocIndex(this.reqParams)
        .then(res => {
          console.log(res);
          if (res.code === 1) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.$message("获取数据失败");
            this.total = 0;
            this.tableData = [];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 返回选中数据
    returnChoosePatient() {
      return this.chooseDate;
    },
    //分页查询
    changeSize(value) {
      console.info("changeSize", value);
      this.getSysPatinfo();
    },
    // 单选
    //row-click    当某一行被点击时会触发该事件 row, event, column
    showRow(row) {
      //赋值给radio;
      this.radio = this.tableData.indexOf(row);
    },
    // 单选表格
    /* urrent-change    当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性    currentRow, oldCurrentRow */
    handleCurrentChange(val) {
      console.log("val", val);
      this.chooseDate = "";
      this.chooseDate = val;
    },

    getCurrentRow(val) {
      console.log("getCurrentRow", val);
    },
    queryList() {
      this.reqParams = {
        pageNo: 1,
        pageSize: 10,
        grid: "",
        rsdtName: "",
        idNo: "",
        digDocNo: "",
        responsibleDrId: "",
        cmntCmtId: "",
        docStatus: "01"
      };
      this.getSysPatinfo(this.reqParams);
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.PChoosePatient {
  .search {
    width: 336px;
  }
  .main_table {
    margin-top: 10px;
  }
  .page {
    margin-bottom: 20px;
    text-align: right;
    height: 28px;
    padding: 0;
    /deep/ .el-input__inner {
      line-height: 28px !important;
      height: 28px !important;
    }
  }
  /deep/.has-gutter {
    height: 30px;
    line-height: 30px;

    .cell {
      // padding: 10px;
      padding-left: 10px;
    }

    th {
      background: #f5f8fa;
      background-color: #f5f8fa;
    }

    th:nth-last-child(2) {
      border-right: none;
    }
  }
}
</style>
