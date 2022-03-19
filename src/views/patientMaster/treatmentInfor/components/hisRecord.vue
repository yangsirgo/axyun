<template>
  <div class="hisRecord height100">
    <div class="nav-bar">
      <el-row class="margin-bottom-6">
        <el-date-picker
          v-model="searchParams.startDiagTime"
          type="date"
          placeholder="选择就诊时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
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
      <div class="bottom-button margin-bottom-6 clearfix">
        <el-button type="primary" style="width:calc(50% - 5px)" class="float-left" plain @click="reset">重置</el-button>
        <el-button type="primary" style="width:calc(50% - 5px)" class="float-right" @click="search">查询</el-button>
      </div>
    </div>
    <div class="table-cont">
      <el-table
        :data="tableData"
        border
        width="100%"
        height="100%"
        v-loading="tlm_isLoading"
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
    name: "hisRecord",
    data() {
      return {
        searchParams: {
          searchData: '',
          startDiagTime: ''
        },
        //分页信息
        // pageNo: 1,
        // pageSize: 20,
        // total: 0,
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
        // tableDataUnit: [],
        tlm_isLoading: false
      }
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData", "patientListData"])
    },
    watch: {
      "receivePatientData": {
        async handler(n) {
          if (JSON.stringify(n) !== "{}") {
            if (n.patientId) {
              await this.search();
            } else {
              await this.changeHisRecordData({});
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      ...mapActions({
        changeHisRecordData: 'patientMaster/changeHisRecordData'
      }),
      //获取历史诊疗记录
      async getHisRecords() {
        this.tlm_isLoading = true;
        try {
          let startDiagtime = this.searchParams.startDiagTime ? this.searchParams.startDiagTime + ' 00:00:00' : '';
          let endDiagtime = this.searchParams.startDiagTime ? this.searchParams.startDiagTime + ' 23:59:59' : '';
          let params = {
            searchData: this.searchParams.searchData,
            startDiagtime: startDiagtime,
            endDiagtime: endDiagtime,
            patientId: this.receivePatientData.patientId,
            // pageNo: this.pageNo,
            pageNo: -1,
            // pageSize: this.pageSize
            pageSize: 20
          };
          let res = await archInfoHistory(params);
          if (res.code == '1') {
            // this.tableDataUnit = res.data;
            this.tableData = res.data;
          } else {
            this.$message.error(res.msg || "获取患者历史就诊记录失败");
          }
          this.tlm_isLoading = false;
        } catch (e) {
          this.tlm_isLoading = false;
          this.$message.error(e.msg || "获取患者历史就诊记录失败");
        }
      },
      /*load() {
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
      },*/
      reset() {
        for (let i in this.searchParams) {
          this.searchParams[i] = ''
        }
      },
      async search() {
        // this.pageNo = 1;
        await this.getHisRecords();
        // this.tableData = this.tableDataUnit;
        await this.changeHisRecordData({
          ...this.tableData[0]
        });
        await this.$refs.multipleTable.setCurrentRow(this.tableData[0]);
      },
      async rowClick(row) {
        await this.changeHisRecordData({
          ...row
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .hisRecord {
    .nav-bar {

    }

    .table-cont {
      height: calc(100% - 126px);
    }

    .margin-bottom-6 {
      margin-bottom: 6px;
    }
  }
</style>
