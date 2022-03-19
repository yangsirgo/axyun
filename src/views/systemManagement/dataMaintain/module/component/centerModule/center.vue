<template>
  <div class="cls height100">
    <div class="utilCls">
      <!--<span>-->
      <template v-if="isBig">
        <l-formt-title label="状态" style="width: 46%; margin-right: 3px">
          <el-select
            v-model="bigFilter.status"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="激活" :value="0"> </el-option>
            <el-option label="禁用" :value="1"> </el-option>
          </el-select>
        </l-formt-title>
      </template>

      <template v-if="!isBig">
        <l-formt-title label="状态" style="width: 46%; margin-right: 3px">
          <el-select
            v-model="sonFilter.status"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="激活" :value="0"> </el-option>
            <el-option label="禁用" :value="1"> </el-option>
          </el-select>
        </l-formt-title>
      </template>
      <!--</span>-->
      <template v-if="isBig">
        <l-formt-title label="大类名称" style="width: 46%">
          <el-input
            v-model="bigFilter.doctorsAdviceName"
            placeholder="请输入内容"
            style="width: 100%"
          ></el-input>
        </l-formt-title>
      </template>
      <!--医嘱子类-->
      <template v-else-if="isSon">
        <!--填写子类的独有的选项-->
        <l-formt-title label="子类名称" style="width: 46%; margin-top: 5px">
          <el-input
            v-model="sonFilter.doctorsAdviceName"
            placeholder="请输入内容"
            style="width: 100%"
          ></el-input>
        </l-formt-title>
        <l-formt-title label="医嘱大类" style="width: 46%; margin-top: 5px">
          <!--<el-select v-model="sonFilter.parentId" placeholder="请选择" style="width: 100px">
            <el-option
              v-for="item in bigDoctorsAdviceList"
              :key="item.doctorsAdviceId"
              :label="item.doctorsAdviceName"
              :value="item.doctorsAdviceId"></el-option>
          </el-select>-->
          <l-value-domain
            clearable
            remoteUrl="/doctorsAdvice/getListOn"
            type="select"
            :remoteParams="remoteParams"
            :value.sync="sonFilter.parentId"
            remoteShowKey="doctorsAdviceName"
            remoteValueKey="doctorsAdviceCode"
            @change="changeBigDA"
          ></l-value-domain>
        </l-formt-title>
      </template>
      <span style="float: right; margin: 5px 0">
        <el-button type="primary" @click="search">查询</el-button>
        <!--<el-button @click="handleAdd">新增</el-button>-->
        <el-button @click="reset">重置</el-button>
      </span>
    </div>
    <div style="height: calc(100% - 160px)" v-loading="loading">
      <el-table
        v-show="isBig"
        highlight-current-row
        @row-click="rowClick"
        :data="tableData"
        border
        height="100%"
      >
        <!-- 需要列 -->
        <el-table-column
          type="index"
          label="序号"
          width="50px"
          header-align="center"
          align="center"
        ></el-table-column>
        <!-- 业务列 -->
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'center'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <span>{{ scope.row[item.prop] || "--" }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-show="isSon"
        highlight-current-row
        @row-click="rowClick"
        :data="tableData"
        border
        height="100%"
      >
        <!-- 需要列 -->
        <el-table-column
          type="index"
          label="序号"
          width="50px"
          header-align="center"
          align="center"
        ></el-table-column>
        <!-- 业务列 -->
        <el-table-column
          v-for="(item, index) in tableParamsOther"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <span>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getDoctorsAdvicePage,
  getDoctorsAdviceList
} from "@/api/systemManagement/dataMaintain/doctorsAdvice";

const tableParamsOther = [
  /* {
    prop: 'select',
    label: '选择'
  }, */ {
    prop: "doctorsAdviceCode",
    label: "医嘱代码"
  },
  {
    prop: "doctorsAdviceName",
    label: "医嘱子类"
  },
  {
    prop: "parentName",
    label: "大类"
  },
  {
    prop: "status",
    label: "状态"
  } /* , {
    prop: 'createdByName',
    label: '操作人'
  } */,
  {
    prop: "operator",
    label: "操作人"
  },
  {
    prop: "createdAt",
    label: "操作时间"
  }
];

const tableParam = [
  /* {
    prop: 'select',
    label: '选择'
  }, */ {
    prop: "doctorsAdviceCode",
    label: "医嘱代码"
  },
  {
    prop: "doctorsAdviceName",
    label: "医嘱大类"
  },
  {
    prop: "status",
    label: "状态"
  } /* , {
    prop: 'createdByName',
    label: '操作人'
  } */,
  {
    prop: "operator",
    label: "操作人"
  },
  {
    prop: "createdAt",
    label: "操作时间"
  }
];

export default {
  name: "center",
  components: {},
  props: ["type"],
  data() {
    return {
      loading: false,
      isBig: true, // 判断table 的列
      isSon: false, // 判断table 的列
      // remoteParams: { pageSize: 10 }, // 分页参数,
      remoteParams: { pageSize: 10, parentId: "0" }, // 分页参数
      remoteSonParams: { pageSize: 10, parentCode: "-1" }, // 分页参数
      bigFilter: {
        doctorsAdviceName: "",
        status: "",
        parentId: "0"
      },
      sonFilter: {
        status: "",
        doctorsAdviceName: "",
        parentId: ""
      },
      bigDoctorsAdviceList: [],
      pageSize: 10,
      totalPage: 50,
      pageNo: 1,
      status: "",
      tableData: [],
      tableParams: tableParam,
      tableParamsOther: tableParamsOther
    };
  },
  created() {
    // this.loadData();
  },
  mounted() {
    // this.search();
    // this.loadData();
    // console.info("isSon", this.isSon);
    // if(this.isSon) {
    //   this.getBigDoctorsAdviceList();
    // }
  },
  methods: {
    /*getBigDoctorsAdviceList(){
        // console.info("进入getBigDoctorsAdviceList");
        let obj = {
          parentId: '0'
        };
        getDoctorsAdviceList(obj)
          .then(res => {
            if(res.code === 1) {
              let bigDAList = res.data;
              // console.info("bigDAList", bigDAList);
              // debugger;
              this.bigDoctorsAdviceList = [];
              this.bigDoctorsAdviceList.push({'-1': "请选择"});
              for(let i = 0; i < bigDAList.length; i++) {
                let bigDA = bigDAList[i];
                let row = {
                  doctorsAdviceId: bigDA.doctorsAdviceId,
                  doctorsAdviceName: bigDA.doctorsAdviceName
                };
                this.bigDoctorsAdviceList.push(row);
              }
              // console.info("bigDoctorsAdviceList", this.bigDoctorsAdviceList);
            }
          });
      },*/
    changeBigDA() {
      // this.dInfoForm.sonDoctorAdvice = null;
      // this.remoteSonParams = {...this.remoteSonParams, ...{parentId: this.dInfoForm.bigDoctorAdvice}};
    },
    reset() {
      this.bigFilter.doctorsAdviceName = "";
      this.bigFilter.status = "";
      this.sonFilter.parentId = "";
      this.sonFilter.doctorsAdviceName = "";
      this.sonFilter.status = "";
      this.getDoctorsAdvicePageFun(this.getParams());
    },
    getParams() {
      let params = {};
      let pagination = {
        // totalPage:this.totalPage,
        parentId: "0",
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      if (this.type === "big") {
        params = { ...pagination, ...this.bigFilter };
      } else if (this.type === "son") {
        params = { ...pagination, ...this.sonFilter };
      }

      return params;
    },
    search() {
      // console.log('写入查询接口', this.getParams());
      this.getDoctorsAdvicePageFun(this.getParams());
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // console.log('写入查询接口', this.getParams());
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNo = val;
      // console.log('写入查询接口', this.getParams());
      this.search();
    },
    getDoctorsAdvicePageFun(obj) {
      if (
        !this.isBig &&
        (null == obj.parentId || "" == obj.parentId || "0" == obj.parentId)
      ) {
        obj.parentId = -1;
      }
      getDoctorsAdvicePage(obj).then(res => {
        // console.log("param",obj);
        if (res.code === 1) {
          let resData = res.data;
          // this.tableData = resData;
          this.tableData = [];
          for (let i = 0; i < resData.length; i++) {
            let doctorsAdviceRow = resData[i].doctorsAdvicePO;
            doctorsAdviceRow.status =
              doctorsAdviceRow.status == "0" ? "激活" : "禁用";
            doctorsAdviceRow.parentName = resData[i].parentName;
            this.tableData.push(doctorsAdviceRow);
            // this.tableData[i].status = resData[i].doctorsAdvicePO.status == "0" ? "激活" : "禁用";
          }
          this.totalPage = res.total;
          this.pageNo = res.pageNo;
          this.pageSize = res.pageSize;
        } else {
          this.$message("查询失败");
        }
      });
    },
    rowClick(row) {
      // console.log('点击了row', row);
      this.$emit("rowClick", row);
    },
    loadData() {
      // console.info("isSon", this.isSon);
      this.loading = true;
      /*if(this.isSon){
          this.getBigDoctorsAdviceList();
        }*/
      setTimeout(() => {
        this.loading = false;
        // console.log('ajax当前列表数据');
        this.search();
      }, 200);
    },
    // 新增 按钮 回调函数
    handleAdd() {
      // 重置 右侧数据
      this.$emit("rowClick", {});
    },
    resetPaganation() {
      this.pageSize = 10;
      this.totalPage = 50;
      this.pageNo = 1;
    }
  },
  watch: {
    type: {
      immediate: true,
      handler() {
        if (this.type === "son") {
          this.isBig = false;
          this.isSon = true;
        } else if (this.type === "big") {
          this.isBig = true;
          this.isSon = false;
        } else {
          this.isBig = false;
          this.isSon = false;
        }
        this.loading = false;
        this.resetPaganation();
      }
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.cls {
  .utilCls {
    padding: 10px;

    > span {
      display: inline-block;
    }

    > span + span {
      margin-left: 10px;
    }
  }
}
</style>
