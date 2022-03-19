<template>
  <div class="costCheck height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      patientCardType="hospital"
      pageName="arrangeBed"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="entry" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card class="costCheck-cont height100 clearfix">
          <div class="costCheck-cont-left float-left height100">
            <div class="button-cont">
              <el-row :gutter="20">
                <el-col :span="8">
                  <LFormtTitle label="医嘱时间">
                    <el-date-picker
                      class="width100"
                      v-model="searchData1.date"
                      type="daterange"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="开单科室">
                    <l-value-domain
                      clearable
                      remoteUrl="/wadmin/hos/dept"
                      type="select"
                      :value.sync="searchData1.deptId"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder
                      style="width:100%"
                      @change="deptChange"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="执行科室">
                    <l-value-domain
                      clearable
                      remoteUrl="/wadmin/hos/dept"
                      type="select"
                      :value.sync="searchData1.deptId0"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder
                      style="width:100%"
                      @change="deptChange"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <el-button style="width:90px" type="primary" @click="search1">查询</el-button>
                  <el-button style="width:90px" type="primary" plain @click="reset1">重置</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="table-cont">
              <el-table
                :data="tableData1"
                ref="table1"
                border
                stripe
                width="100%"
                height="100%"
                v-loadmore="load"
                v-loading="tlm_isLoading"
                element-loading-text="加载中..."
                highlight-current-row
                @row-click="rowClick1"
              >
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column
                  v-for="(item,index) in tableParams1"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <template>
                      {{scope.row[item.prop]}}
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="costCheck-cont-right float-right height100">
            <l-card-title>
              <template slot="left">执行记录</template>
            </l-card-title>
            <div class="costCheck-cont-top">
              <div class="button-cont">
                <el-row :gutter="20">
                  <el-col :span="18">
                    <LFormtTitle label="要求执行时间">
                      <el-date-picker
                        clearable
                        class="width100"
                        v-model="searchData2.date"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="6">
                    <el-button style="width:100%" type="primary" @click="search2">查询</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="costCheck-cont-middle">
              <el-table
                :data="tableData2"
                ref="table2"
                border
                stripe
                width="100%"
                height="100%"
                v-loading="loading2"
                @row-click="rowClick2"
                highlight-current-row>
                <el-table-column
                  v-for="(item,index) in tableParams2"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <template>
                      {{scope.row[item.prop]}}
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <l-card-title>
              <template slot="left">收费记录</template>
            </l-card-title>
            <div class="costCheck-cont-bottom">
              <el-table
                :data="tableData3"
                ref="table3"
                border
                stripe
                width="100%"
                height="100%"
                v-loading="loading3"
              >
                <el-table-column
                  v-for="(item,index) in tableParams3"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    {{scope.row[item.prop]}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import LeftBar from "@/views/ipnw/components/nursingLeftBar.vue";
  import {getApplyDrugBackList, addApplyDrugBack, cancelApplyDrugBack} from '@/api/ipnw/retreatMedcine';

  export default {
    name: "costCheck",
    components: {
      LeftBar
    },
    data() {
      return {
        toolBoxs: [],
        searchData1: {
          date: [],
          deptId: '',
          deptId0: ''
        },
        searchData2: {
          date: []
        },
        tableParams1: [
          {
            prop: 'bedCode',
            label: '医嘱日期',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'patientName',
            label: '开单医生',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'sex',
            label: '医嘱名称',
            width: '70',
            align: 'left',
            fixed: false
          }, {
            prop: 'inpCode',
            label: '医嘱状态',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'pharmacyName',
            label: '数量',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'drugName',
            label: '金额',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'dispenseAmount',
            label: '发药数量',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'dispenseAmount',
            label: '未发药数量',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'applyReturnAmount',
            label: '退药数量',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'drugUnit',
            label: '医嘱类型',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'price',
            label: '医嘱大类',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'money',
            label: '执行科室',
            width: '80',
            align: 'left',
            fixed: false
          }
        ],
        tableParams2: [
          {
            prop: 'bedCode',
            label: '计费状态',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'patientName',
            label: '执行状态',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'sex',
            label: '金额',
            width: '70',
            align: 'left',
            fixed: false
          }, {
            prop: 'inpCode',
            label: '发药数量',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'pharmacyName',
            label: '退药数量',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'drugName',
            label: '要求执行时间',
            width: '150',
            align: 'left',
            fixed: false
          }, {
            prop: 'spec',
            label: '执行时间',
            width: '120',
            align: 'left',
            fixed: false
          }, {
            prop: 'dispenseAmount',
            label: '处理人',
            width: '80',
            align: 'left',
            fixed: false
          }, {
            prop: 'applyReturnAmount',
            label: '处理人科室',
            width: '150',
            align: 'left',
            fixed: false
          }
        ],
        tableParams3: [
          {
            prop: 'applyReturnAmount',
            label: '名称',
            width: '80',
            align: 'left',
            fixed: false
          },{
            prop: 'applyReturnAmount',
            label: '单位',
            width: '80',
            align: 'left',
            fixed: false
          },{
            prop: 'applyReturnAmount',
            label: '数量',
            width: '80',
            align: 'left',
            fixed: false
          },{
            prop: 'applyReturnAmount',
            label: '单价',
            width: '80',
            align: 'left',
            fixed: false
          },{
            prop: 'applyReturnAmount',
            label: '金额',
            width: '80',
            align: 'left',
            fixed: false
          },{
            prop: 'applyReturnAmount',
            label: '计费时间',
            width: '80',
            align: 'left',
            fixed: false
          }
        ],
        tlm_isLoading: false,
        loading2: false,
        loading3: false,
        pageParams1: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        tableData1: [],
        tableData2: [],
        tableData3: [],
        currentRow1: {},
        currentRow2: {}
      }
    },
    computed: {
      totalPage1() {
        return Math.ceil(this.pageParams1.total / this.pageParams1.pageSize);
      }
    },
    watch: {
      receivePatientData: {
        handler(val) {
          if (val.inpCode) {
            this.search1();
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      async search1() {
        this.tableData1 = [];
        this.pageParams1.pageNo = 1;
        this.pageParams1.total = 0;
        await this.getList1(params);
        this.currentRow1 = this.tableData1[0];
        this.$refs.table1.setCurrentRow(this.tableData1[0]);
      },
      async getList1() {
        this.tlm_isLoading = true;
        try {
          let params = {
            inpCode: this.receivePatientData.inpCode,
            ...this.pageParams1
          };
          let res = await getApplyDrugBackList(params);
          if (res.code === 1) {
            this.pageParams1.total = res.total;
            this.tableData1.push(...res.data);
          } else {
            this.$message.error(res.msg);
          }
          this.tlm_isLoading = false;
        } catch (e) {
          this.tlm_isLoading = false;
          this.$message.error(e.msg);
        }
      },
      async search2() {
        this.tableData2 = [];
        await this.getList2();
        this.currentRow2 = this.tableData2[0];
        this.$refs.table2.setCurrentRow(this.tableData2[0]);
      },
      async getList2() {
        this.loading2 = true;
        try {
          let params = {
            ...this.pageParams2
          };
          let res = await getApplyDrugBackList(params);
          if (res.code === 1) {
            this.tableData2 = res.data;
          } else {
            this.$message.error(res.msg);
          }
          this.loading2 = false;
        } catch (e) {
          this.loading2 = false;
          this.$message.error(e.msg);
        }
      },
      async search3() {
        this.tableData3 = [];
        await this.getList3();
      },
      async getList3() {
        this.loading3 = true;
        try {
          let params = {
            ...this.pageParams3
          };
          let res = await getApplyDrugBackList(params);
          if (res.code === 1) {
            this.tableData3 = res.data;
          } else {
            this.$message.error(res.msg);
          }
          this.loading3 = false;
        } catch (e) {
          this.loading3 = false;
          this.$message.error(e.msg);
        }
      },
      async load() {
        this.pageParams1.pageNo++;
        if (this.pageParams1.pageNo > this.totalPage1) {
          this.pageParams1.pageNo = this.totalPage1;
        } else {
          await this.getList1();
        }
        this.tlm_isLoading = false;
      },
      rowClick1(row) {
        this.currentRow1 = row;
        this.search2();
      },
      rowClick2(row) {
        this.currentRow2 = row;
        this.search3();
      },
      messageHandler() {
      }
    }
  }
</script>

<style scoped lang="scss">
  .costCheck-cont {

    .table-cont {
      height: calc(100% - 56px);
    }

    .button-cont {
      height: 56px;
      padding-bottom: 20px;
    }

    .costCheck-cont-left {
      width: 70%;
      padding: 20px;
      border-right: 1px solid $l-color-bgcolor-11;
    }

    .costCheck-cont-right {
      width: 30%;
      padding: 0 20px 20px 20px;

      .costCheck-cont-middle, .costCheck-cont-bottom {
        height: calc(50% - 91px);
      }
    }
  }
</style>
