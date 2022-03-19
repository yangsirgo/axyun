<template>
  <el-card class="reportList height100">
    <div class="nav-bars clearfix">
      <el-row :gutter="20">
        <el-col :span="6">
          <LFormtTitle label="时间">
            <el-date-picker
              v-model="searchData.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </LFormtTitle>
        </el-col>
        <el-col :span="6">
          <LFormtTitle label="科室">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="searchData.ouptDeptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择科室"
              style="width:100%"
              defaultFirst
            ></l-value-domain>
          </LFormtTitle>
        </el-col>
        <!--<el-col :span="6">
          <LFormtTitle label="收费类型">
            &lt;!&ndash;<l-value-domain
              code=""
              type="select"
              :value.sync="searchData.chargeType"
              clearable
            ></l-value-domain>&ndash;&gt;
          </LFormtTitle>
        </el-col>-->
        <el-col :span="12">
          <el-button class="float-right" type="primary" plain @click="reset">重置</el-button>
          <el-button class="float-right" type="primary" @click="search" style="margin-right: 10px">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-cont">
      <el-table
        :data="eleData"
        width="100%"
        height="100%"
        stripe
        border
        v-loadmore="load"
        v-loading="tlm_isLoading"
        :element-loading-text="$t('retreat.loadInfo')"
      >
        <el-table-column
          v-for="(item, index) in eleParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <template v-if="item.prop=='ouptDeptId'">
              <span tableName="sys_org"
                    :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row[item.prop]
                          }"
                    columns="org_nm"
                    v-tableTransform></span>
            </template>
            <template v-else>{{scope.row[item.prop]}}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>

</template>

<script>
  import {getDetailList} from "@/api/cis/report/registerReport";

  export default {
    name: "reportList",
    components: {},
    data() {
      return {
        searchData: {
          date: [],
          ouptDeptId: '',
          chargeType: ''
        },
        /*分页信息*/
        pageParams: {
          pageSize: 20,
          pageNo: 1
        },
        tlm_isLoading: false,
        total: 0,
        eleParams: [
          {
            prop: "chargeTime",
            label: "时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "110"
          },
          {
            prop: "ouptDeptId",
            label: "科室",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "orderName",
            label: "收费项目",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "totalMoney",
            label: "金额",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "doctorName",
            label: "操作人",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "patientName",
            label: "患者名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }
        ],
        eleData: [],
        eleDataUnit: []
      };
    },
    computed: {
      totalPage() {
        return Math.ceil(this.total / this.pageParams.pageSize);
      }
    },
    async created() {
      // await this.search();
    },
    methods: {
      resetPageParams() {
        this.pageParams.pageNo = 1;
        this.pageParams.pageSize = 20;
      },
      /*搜索*/
      async search() {
        this.resetPageParams();
        await this.getEleData();
        this.eleData = this.eleDataUnit;
      },
      /*重置*/
      reset() {
        this.searchData = {
          date: [],
          ouptDeptId: '',
          chargeType: ''
        };
      },
      /*查询所有元素*/
      async getEleData() {
        this.tlm_isLoading = true;
        try {
          let params = {
            startDate: this.searchData.date && this.searchData.date.length ? this.searchData.date[0] + ' 00:00:00' : '',
            stopDate: this.searchData.date && this.searchData.date.length ? this.searchData.date[1] + ' 23:59:59' : '',
            ouptDeptId: this.searchData.ouptDeptId,
            // chargeType: this.searchData.chargeType,
            ...this.pageParams
          };
          let {code, data, total} = await getDetailList(params);
          if (code === 1) {
            this.total = total;
            this.eleDataUnit = data;
          } else {
            this.$message.error(data.msg || "获取失败");
          }
          this.tlm_isLoading = false;
        } catch (error) {
          this.tlm_isLoading = false;
          this.$message.error(error.msg || "获取失败");
        }
      },
      load() {
        const _this = this;
        this.pageParams.pageNo++;
        setTimeout(async () => {
          let eleData = [..._this.eleData];
          if (_this.pageParams.pageNo > _this.totalPage) {
            _this.pageParams.pageNo = _this.totalPage;
          } else {
            await _this.getEleData();
            _this.eleData = [...eleData.concat(_this.eleDataUnit)];
          }
          _this.tlm_isLoading = false;
        }, 2000);
      }
    }
  };
</script>

<style scoped lang="scss">
  .reportList {
    padding: 20px 0 20px 0;

    .nav-bars {
      margin: 0 20px 20px 20px;
    }

    .table-cont {
      height: calc(100% - 58px);
      padding: 0 20px;
    }
  }
</style>
