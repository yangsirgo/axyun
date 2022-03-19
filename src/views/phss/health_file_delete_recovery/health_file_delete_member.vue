<template>
  <div class="PChoosePatient">
    <div>
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-input placeholder="姓名或简码" v-model="reqParams.rsdtName" class="search" style="width:90%;"></el-input>
        </el-col>
        <el-col :span="7">
          <el-select style="width:90%;" @change="gridFun" v-model="reqParams.cmntCmtId" placeholder="---请选择居委会---" clearable filterable>

            <el-option v-for="item in gridOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>

        <el-col :span="7">
          <el-input style="width:90%;" placeholder="身份证号" v-model="reqParams.idNo" class="search"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button @click="queryList" style="margin-left: 10px;">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="mt-10" type="flex" justify="space-between">
        <el-col :span="7">
          <el-input style="width:90%;" placeholder="健康档案编号" v-model="reqParams.digDocNo" class="search"></el-input>
        </el-col>
        <el-col :span="7">
          <el-select v-model="reqParams.grid" placeholder="---请选择网格---" style="width:90%;" clearable filterable>
            <el-option v-for="item in gridOptions1" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>

        <el-col :span="7">
          <el-select style="width:90%;" v-model="reqParams.responsibleDrId" placeholder="---请选择责任医生---" clearable filterable>
            <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button style="margin-left: 10px;" @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main_table">
      <el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" @row-click="showRow" max-height="360" border stripe>
        <el-table-column label="选择" width="70" center>
          <template slot-scope="scope">
            <!-- &nbsp; 为空，不加这个radio的label会显示index数字，注意从0开始的；radio会全选的问题是label相同导致的 -->
            <el-radio class="radio" v-model="radio" :label="scope.$index" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="digDocNo" label="健康档案编号" width="130"></el-table-column>
        <el-table-column prop="rsdtName" label="姓名" width="80"></el-table-column>
        <el-table-column prop="gender" label="性别" width="120">
          <!-- <template slot-scope="scope">
            <div>{{scope.row.sex=='1'?'未知':(scope.row.sex=='2'?'男':'女')}}</div>
          </template> -->
        </el-table-column>
        <el-table-column prop="idNo" label="身份证号" width="120"></el-table-column>
        <el-table-column prop="doc_status_desc" label="当前状态" width="80">
          <template slot-scope="scope">
            <div>{{scope.row.delFlg=='0'?'正常':(scope.row.delFlg=='1'?'删除':'')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="responsibleDrName" label="责任医生姓名" width="100"></el-table-column>
        <el-table-column prop="createDocDate" label="建档日期" width></el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination :total="total" :pageSize.sync="reqParams.pageSize" :page.sync="reqParams.pageNo" @current-change="changeSize" />
      <!-- current-change -->
    </div>
  </div>
</template>

<script>
  import { onGet, onPost } from "@/api/public/public";
  import { queryRegionAndGridByHospitalId } from "@/api/phss/region/grid_information";
  import { docIndexAllByPage, onQueryDocIndex } from "@/api/phss/docIndex/docIndex";
  import { mapActions, mapGetters } from "vuex";

  export default {
    name: "PChoosePatient",
    props: ["data"],
    data() {
      return {
        radio: null,

        reqParams: {
          pageNo: 1,
          pageSize: 10,
          grid: "",
          rsdtName: "",
          idNo: "",
          digDocNo: "",
          responsibleDrId: "",
          cmntCmtId: "",
          status: ""
        },
        // 责任医生
        userOptions: [],
        // 居委会和网格
        gridOptions: [],
        gridOptions1: [],
        //列表信息
        tableData: [],
        // 选中数据
        chooseDate: "",
        // 分页总数
        total: 0
        // 查询参数
      };
    },
    created() {

      this.onQueryUsersByHosId(null, "user");
      this.onqueryRegionAndGridByHospitalId(null);
    },

    computed: {
      ...mapGetters("home_doc_status", ["status"])
    },

    mounted() {
      setTimeout(() => {
        this.reqParams.status = this.status;
      }, 10);
      console.info("个人信息data", JSON.stringify(this.status));
      // this.reqParams.status = this.status;
      // this.reqParams.status = this.status;
      setTimeout(() => {
        this.getSysPatinfo(this.reqParams);
      }, 10);
    },
    methods: {
      ...mapActions({
        setChoose: "home_doc_status/setChoose"
      }),
      saveMethod() {
        //this.$refs.member.saveMethod();
      },
      gridFun(val) {
        console.log("改变的值", val);
        for (var i = 0; i < this.gridOptions.length; i++) {
          if (val == this.gridOptions[i].value) {
            this.gridOptions1 = this.gridOptions[i].children;
          }
        }
        console.log(this.gridOptions1)
      },
      onqueryRegionAndGridByHospitalId(hospitalId) {
        queryRegionAndGridByHospitalId({
            hospitalId: hospitalId
          })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              console.log("居民档案和网格", res.data);
              this.gridOptions = res.data;
            } else {
              console.log(res);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      // 获取责任医生
      onQueryUsersByHosId(hosId, flg) {
        onPost({
            url: "/phss/sysPublic/onQueryUsersByHosId",
            data: { hosId: hosId }
          })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.userOptions = res.data;
            } else {
              console.log("error", res);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      resetFun() {
        this.reqParams = {
          pageNo: 1,
          pageSize: 10,
          grid: "",
          rsdtName: "",
          idNo: "",
          digDocNo: "",
          responsibleDrId: "",
          cmntCmtId: "",
          status: this.status
        }
      },
      // 查询接口
      getSysPatinfo(reqParams) {
        docIndexAllByPage(this.reqParams)
          .then(res => {
            console.log(JSON.stringify(res));
            if (res.code === 1) {
              this.tableData = res.data;
              this.total = res.total;
            } else {
              this.$message.error("获取数据失败");
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
        this.reqParams.pageNo = value;
        this.getSysPatinfo(this.reqParams);
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
        this.setChoose(val);
        this.$emit("onChange", val);
      },

      getCurrentRow(val) {
        console.log("getCurrentRow", val);
        //使用$emit想父组件进行传值
        this.$emit("onChange", val);
      },
      queryList() {
        this.reqParams.pageNo = 1;
        this.getSysPatinfo(this.reqParams);
      }
    },
    watch: {
      status(val, oldVal) {
        console.info("val", val);
        console.info("oldVal", oldVal);
        this.reqParams.status = val;
        this.getSysPatinfo(this.reqParams);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .PChoosePatient {
    padding: 30px;

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
