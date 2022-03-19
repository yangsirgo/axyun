<template>
  <div class="cls height100">
    <div class="utilCls">
      <l-formt-title
        label="状态"
        style="width: calc(25% - 6px); margin-top: 5px"
      >
        <el-select
          v-model="itemFilter.status"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="激活" :value="0"></el-option>
          <el-option label="禁用" :value="1"></el-option>
        </el-select>
      </l-formt-title>
      <l-formt-title
        label="医嘱大类"
        style="width: calc(25% - 6px); margin-top: 5px"
      >
        <!--<el-select v-model="itemFilter.majorOrders" placeholder="请选择" style="width: 100px">
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
          :value.sync="itemFilter.majorOrders"
          remoteShowKey="doctorsAdviceName"
          remoteValueKey="doctorsAdviceCode"
        ></l-value-domain>
      </l-formt-title>
      <l-formt-title
        label="医嘱项目"
        style="width: calc(25% - 6px); margin-top: 5px"
      >
        <el-input
          v-model="itemFilter.adviceItemName"
          @keyup.enter.native="search"
          placeholder="医嘱名称/别名"
          style="width: 100%"
        ></el-input>
      </l-formt-title>
      <span style="float: right; margin: 5px 0">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="handleAdd">新增</el-button>
      </span>
    </div>
    <div
      style="height: calc(100% - 105px); padding: 0 10px 10px 10px"
      v-loading="loading"
    >
      <el-table
        ref="singleTable"
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
            <span v-if="item.prop == 'unit'">
              <span
                code="DrugUnit"
                :val="scope.row[item.prop]"
                v-codeTransform
              ></span>
            </span>
            <span v-else-if="item.prop == 'amt'">
              <span>{{ scope.row[item.prop].rewToFixed() }}</span>
            </span>
            <span v-else>{{ scope.row[item.prop] || "--" }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      style="padding: 0 10px 10px 10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    ></el-pagination>
  </div>
</template>

<script>
import { adviceItemListPage } from "@/api/systemManagement/dataMaintain/adviceItem";
import { getDoctorsAdviceList } from "@/api/systemManagement/dataMaintain/doctorsAdvice";
export default {
  name: "itemCenter",
  components: {},
  data() {
    return {
      remoteParams: { pageSize: 10, parentId: "0" }, // 分页参数,医嘱大类参数
      bigDoctorsAdviceList: [],
      itemFilter: {
        status: "",
        majorOrders: "",
        adviceItemName: ""
      },
      tableData: [],
      tableParams: [
        {
          prop: "mdoctorsAdviceName",
          label: "医嘱大类"
        },
        {
          prop: "sdoctorsAdviceName",
          label: "医嘱子类"
        },
        {
          prop: "adviceItemName",
          label: "医嘱名称"
        },
        {
          prop: "adviceItemCode",
          label: "项目代码"
        },
        {
          prop: "unit",
          label: "单位"
        },
        {
          prop: "amt",
          label: "价格"
        },
        {
          prop: "status",
          label: "状态"
        },
        /* {
          prop: "createdByName",
          label: "操作人"
        }, */
        {
          prop: "operator",
          label: "操作人"
        },
        {
          prop: "createdAt",
          label: "操作时间"
        }
      ],
      pageSize: 10,
      totalPage: 50,
      currentPage: 1,
      loading: false
    };
  },
  created() {},
  mounted() {
    // this.getBigDoctorsAdviceList();
    this.search();
  },
  methods: {
    /* getBigDoctorsAdviceList(){
        let obj = {
          parentId: '0'
        };
        getDoctorsAdviceList(obj)
          .then(res => {
            if(res.code === 1) {
              let bigDAList = res.data;
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
            }
          });
      },*/
    getParams() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      return { ...obj, ...this.itemFilter };
    },
    rowClick(row) {
      console.log(row, "rowClickrowClickrowClickrowClickrowClickrowClick");
      this.$emit("rowClick", row);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.search();
    },
    search() {
      this.getAdviceItemFun(this.getParams());
    },
    reset() {
      this.itemFilter = {
        status: "",
        majorOrders: "",
        adviceItemName: ""
      };
      this.getAdviceItemFun(this.getParams());
    },
    getAdviceItemFun(obj) {
      adviceItemListPage(obj).then(res => {
        if (res.code === 1) {
          // this.tableData = resData;
          this.tableData = res.data;
          for (let i = 0; i < this.tableData.length; i++) {
            let row = this.tableData[i];
            this.tableData[i].status = row.status == "0" ? "激活" : "禁用";
          }
          this.totalPage = res.total;
          this.pageNo = res.pageNo;
          this.pageSize = res.pageSize;
        } else {
          this.$message("查询失败");
        }
      });
    },
    // 新增 按钮 回调函数
    handleAdd() {
      // 重置 右侧数据
      let row = {};
      row.status = "0";
      row.checked = false;
      this.$emit("rowClick", row);
      this.$refs.singleTable.setCurrentRow(null);
    }
  },
  filters: {
    rounding(value) {
      value = value !== "" ? new Number(value) : 0;
      return value.rewToFixed(4);
    }
  },
  watch: {},
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
