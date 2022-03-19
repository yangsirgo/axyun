<template>
  <div class="hisRecords height100">
    <div class="nav-bar">
      <!--<el-select clearable
                 v-model="searchData.type"
                 :class="item.prop"
                 :placeholder="'请选择' + item.label"
                 style="width: 100%">
        <el-option
          label="读卡"
          value="1">
        </el-option>
        <el-option
          label="查询"
          value="2">
        </el-option>
      </el-select>-->
      <el-row class="margin-bottom-6">
        <el-date-picker
          v-model="searchParams.startDiagTime"
          type="datetime"
          placeholder="选择就诊时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%">
        </el-date-picker>
      </el-row>
      <el-row class="margin-bottom-6">
        <el-input @keyup.native.enter="search" v-model="searchParams.searchData"
                  placeholder=""
                  style="width: 100%">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </el-row>
      <el-row class="clearfix margin-bottom-6">
        <el-button type="primary" class="duka-button width100" @click="readCard">
          <i class="iconfont iconduka"></i>读卡
        </el-button>
      </el-row>
      <div class="bottom-button margin-bottom-6 clearfix">
        <el-button type="primary" style="width:116px" plain @click="reset">重置</el-button>
        <el-button type="primary" style="width:116px" class="float-right" @click="search">查询</el-button>
      </div>
    </div>
    <div class="table-cont">
      <el-table
        :data="tableData"
        border
        width="100%"
        height="100%"
        v-loadmore="load"
        v-loading="tlm_isLoading"
        element-loading-text="加载中..."
        highlight-current-row
        @row-click="rowClick"
        ref="multipleTable"
      >
        <el-table-column
          v-for="(item,index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'ouptDeptId'">
            <span tableName="sys_org"
                  :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row[item.prop]
                          }"
                  columns="org_nm"
                  v-tableTransform></span>
            </div>
            <div v-else>
              <span>{{scope.row[item.prop]}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {archInfoHistory} from '@/api/arch/arch.js';
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "hisRecords",
    data() {
      return {
        searchParams: {
          searchData: '',
          startDiagTime: ''
        },
        //分页信息
        pageNo: 1,
        pageSize: 20,
        total: 0,
        tableParams: [
          {
            prop: "patientName",
            label: "患者姓名",
            align: "left",
            width: "85",
            fixed: "left",
            sortable: false
          }, {
            prop: "ouptDeptId",
            label: "就诊科室",
            align: "left",
            width: "100",
            fixed: false,
            sortable: true
          }, {
            prop: "diagTime",
            label: "就诊时间",
            align: "left",
            width: "120",
            fixed: false,
            sortable: true
          }, {
            prop: "diagName",
            label: "诊断",
            align: "left",
            width: "200",
            fixed: false,
            sortable: false
          }
        ],
        tableData: [],
        tableDataUnit: [],
        tlm_isLoading: false
      }
    },
    computed: {
      totalPage() {
        return Math.ceil(this.total / this.pageSize);
      },
      ...mapGetters("patientMaster", ["patientListData", "receivePatientData"])
    },
    watch: {
      'receivePatientData': {
        async handler(n) {
          if (JSON.stringify(n) !== "{}") {
          }
        },
        deep: true,
        immediate: true
      },
      'patientListData': {
        async handler(n) {
          if (typeof n.patientList !== 'undefined') {
          }
        },
        deep: true,
        immediate: true
      }
    },
    async mounted() {

    },
    methods: {
      ...mapActions({
        changePatientListData: 'patientMaster/changePatientListData'
      }),
      async getHisRecords() {
        this.tlm_isLoading = true;
        try {
          let params = {
            ...this.searchParams,
            patientId: this.receivePatientData.patientId,
            pageNo: this.pageNo,
            pageSize: this.pageSize
          };
          let res = await archInfoHistory(params);
          if (res.code == '1') {
            this.tableDataUnit = res.data;
          } else {
            this.$message.error(res.msg || "获取患者历史就诊记录失败");
          }
          this.tlm_isLoading = false;
        } catch (e) {
          this.tlm_isLoading = false;
          this.$message.error(e.msg || "获取患者历史就诊记录失败");
        }
      },
      load() {
        const _this = this;
        this.pageNo++;
        setTimeout(async () => {
          let tableData = [..._this.tableData];
          if (_this.pageNo > _this.totalPage) {
            _this.pageNo = _this.totalPage;
          } else {
            await _this.getHisRecords();
            _this.tableData = [...tableData.concat(_this.tableDataUnit)];
          }
          _this.tlm_isLoading = false;
        }, 2000)
      },
      readCard() {
      },
      async search() {
        this.pageNo = 1;
        await this.getHisRecords();
        this.tableData = this.tableDataUnit;
      },
      reset() {
        for (let i in this.searchParams) {
          this.searchParams[i] = '';
        }
      },
      rowClick(row) {

      }
    }
  }
</script>

<style scoped lang="scss">
  .hisRecords {
    .nav-bar {
      margin-top: 10px;
      padding: 0 20px 5px 20px;
    }

    .table-cont {
      height: calc(100% - 185px);
      padding: 0 20px 20px 20px;
    }

    .margin-bottom-6 {
      margin-bottom: 6px;
    }
  }
</style>
