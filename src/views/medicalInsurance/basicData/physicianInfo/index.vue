<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="4">
                <l-formt-title required label="医保类别">
                  <l-value-domain
                    :value.sync="searchParams.medicalType"
                    remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                    remoteShowKey="dictName"
                    remoteValueKey="dictCode"
                    placeholder="请选择"
                  ></l-value-domain>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="编码">
                  <el-input v-model="searchParams.itemCode" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="4">
                <l-formt-title label="名称">
                  <el-input v-model="searchParams.itemName" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </el-col>
              <el-col :span="12" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" plain @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-table
              :data="tableData"
              v-loading="loading"
              border
              stripe
              style="width: 100%"
              height="100%"
            >
              <el-table-column
                v-for="(item ,index) in tableHeader"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width|| (item.label.length * 18 + 24)"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
                :fixed="item.fixed"
              >
               <template slot-scope="scope">
                <template v-if="item.prop == 'medicareType'">
                    <span >{{ medicareTypeList[scope.row[item.prop]] }}</span>
                  </template>
                <span v-else class="overflow-point">{{ scope.row[item.prop] }}</span>
               </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page align-right">
            <el-pagination
              background
              @size-change="changeSize"
              @current-change="changePage"
              :current-page="pageParams.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total"
            ></el-pagination>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import { getPageDoctorList ,getPagemd} from "@/api/medicalInsurance/index.js";

export default {
  name: "physicianInfo",
  components: {
    FlowMenu
  },
  data() {
    return {
      // 查询条件
      searchParams: {
        medicalType: "",
        itemCode: "",
        itemName: ""
      },
      medicareTypeList:{},
      // 医保中心下拉
      careCenterList: [],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 表格加载loading
      loading: false,
      // 表头
      tableHeader: [
        {
          prop: "medicareType",
          label: "医保类别"
        },
        {
          prop: "doctorCode",
          label: "医生编码"
        },
        {
          prop: "doctorName",
          label: "医生名称"
        },
        {
          prop: "siDoctorCode",
          label: "医保医生编码",
          width: 120
        },
        {
          prop: "siDoctorName",
          label: "医保医生名称",
          width: 120
        },
        {
          prop: "rxFlag",
          label: "处方仅标志",
          width: 120
        },
        {
          prop: "sex",
          label: "性别"
        },
        {
          prop: "deptName",
          label: "科室名称"
        },
        {
          prop: "title",
          label: "职称"
        },
        {
          prop: "illegalBehaviorTimes",
          label: "违规次数"
        },
        {
          prop: "duty",
          label: "行政职务"
        },
        {
          prop: "phone",
          label: "联系电话"
        },
        {
          prop: "schoolName",
          label: "毕业院校"
        },
        {
          prop: "identifyNum",
          label: "身份证号"
        },
        {
          prop: "practiceType",
          label: "执业类别"
        },
        {
          prop: "practiceNumber",
          label: "执业证书/编号",
          width: 120
        },
        {
          prop: "practiceRange",
          label: "执业范围"
        },
        {
          prop: "practiceDate",
          label: "执业证书注册日期",
          width: 140
        },
        {
          prop: "remark",
          label: "备注"
        },
        {
          prop: "operator",
          label: "经办人"
        },
        {
          prop: "operationDate",
          label: "经办日期"
        },
        {
          prop: "siUpdateDate",
          label: "医保更新时间",
          width: 120
        },
        {
          prop: "siDeleteFlag",
          label: "医保删除标志",
          width: 120
        }
      ],
      // 表格数据
      tableData: []
    };
  },
   created() {
    this.getMedicareType();
  },
  methods: {
     getMedicareType(){
       getPagemd()
     .then(res => {
          if (res.code === 1) {
            res.data.forEach(item => {
            this.medicareTypeList[item.dictCode] = item.dictName;
            });
          }
         
        });
     },
    // 查询
    search() {
      // 医保类别必填
      if (!this.searchParams.medicalType) {
        this.$message.warning("请选择医保类别!");
        return;
      }
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    // 重置查询条件
    reset() {
      this.searchParams = this.$options.data().searchParams;
    },
    // 加载表格数据
    loadTable() {
      const params = {
        ...this.searchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      this.loading = true;
      getPageDoctorList(params)
        .then(res => {
          if (res.code === 1) {
            this.tableData = res.data;
            this.pageParams.total = res.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 分页回调
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
.main {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: $l-color-white;
}
.align-right {
  text-align: right;
}
.table {
  height: calc(100% - 110px);
  margin: 20px 0;
}
.page {
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
</style>
