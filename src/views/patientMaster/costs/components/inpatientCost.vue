<template>
  <div class="inpatientCost" v-loading="loading">
    <div class="title">
      <l-card-title>
        <span slot="left">总费用</span>
      </l-card-title>
      <div class="title-cont">
        <el-row style="margin-bottom:10px">
          <el-col :span="3" v-for="(value,key) in inpatientCosts.itemChargeDetails" :key="key">
            <el-col :span="12">
              <span
                :val=key
                code="FinClassCode"
                v-codeTransform
              ></span>:
            </el-col>
            <el-col :span="12">
              {{value.chargeAmount==null||value.chargeAmount==''?'--':parseFloat(value.chargeAmount).toFixed(2)}}
            </el-col>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10px">
          <el-col :span="3">
            <el-col :span="12">合计:</el-col>
            <el-col :span="12">
              {{inpatientCosts.totalCost==null||inpatientCosts.totalCost==''?'--':parseFloat(inpatientCosts.totalCost).toFixed(2)}}
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col :span="12">已收:</el-col>
            <el-col :span="12">
              {{inpatientCosts.alreadyCharged==null||inpatientCosts.alreadyCharged==''?'--':parseFloat(inpatientCosts.alreadyCharged).toFixed(2)}}
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col :span="12">待收:</el-col>
            <el-col :span="12">
              {{inpatientCosts.notCharge==null||inpatientCosts.notCharge==''?'--':parseFloat(inpatientCosts.notCharge).toFixed(2)}}
            </el-col>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="detailed-list">
      <l-card-title>
        <span slot="left">每日清单</span>
      </l-card-title>
      <div class="search-list">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-date-picker
              style="width:100%"
              v-model="searchData.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="datePickerChange">
            </el-date-picker>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
          <el-col :span="5" style="margin-top: 10px">
            <el-radio-group v-model="searchData.radio" @change="radioChange">
              <el-radio label="1">按照日期</el-radio>
              <el-radio label="2">按照类别</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="table1" v-if="searchData.radio=='1'">
        <div class="total" style="margin-top: 10px">当天合计： <i style="font-style: normal">{{costDate.total==null||costDate.total==''?'--':parseFloat(costDate.total).toFixed(2)}}</i>
        </div>
        <div class="options clearfix" style="margin-top: 10px">
          <div class="float-left">账单日期：<span>{{currentDay}}</span></div>
          <div class="float-right">
            <el-button type="text" :disabled="dayBeforeDisabled" @click="getDayBefore">上一天</el-button>
            <!--<el-button type="text" :disabled="currentDate?false:true" @click="getCurrentDate">当天</el-button>-->
            <el-button type="text" :disabled="dayAfterDisabled" @click="getDayAfter">下一天</el-button>
          </div>
        </div>
        <div class="table-cont" style="margin-top: 10px">
          <el-table
            :data="costList"
            border
            stripe
            width="100%"
          >
            <el-table-column
              v-for="(item,index) in costParams1"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'itemType'">
                  <span v-if="scope.row[item.prop]!='小计'"
                        :val=scope.row[item.prop]
                        code="FinClassCode"
                        v-codeTransform
                  ></span>
                  <span v-else>
                    <span class="overflow-point">{{
                      scope.row[item.prop]
                    }}</span>
                  </span>
                </template>
                <template v-else-if="item.prop == 'unitPrice'  || item.prop == 'amount' || item.prop == 'chargeAmount'">
                  <span v-if="scope.row[item.prop]!=null" class="overflow-point">{{parseFloat(scope.row[item.prop]).toFixed(2)}}</span>
                  <span v-else class="overflow-point">{{scope.row[item.prop]}}</span>
                </template>
                <template v-else>
                    <span class="overflow-point">{{
                      scope.row[item.prop]
                    }}</span>
                </template>
              </template>

            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="table2" v-else-if="searchData.radio=='2'">
        <div class="total" style="margin-top: 10px">合计：<i>{{costType.total==null||costType.total==''?'--':parseFloat(costType.total).toFixed(2)}}</i>
        </div>
        <div class="info" style="margin-top: 10px">
          <!--床位费({{costType.bedCost}}) 护理费({{costType.nursingCost}})-->
          <!--西药({{costType.wesMedicine}})-->
          <el-row style="margin-bottom:10px">
            <el-col :span="3" v-for="(value,key) in this.itemList" :key="key">
              <el-col>
                <span
                  :val=key
                  code="FinClassCode"
                  v-codeTransform
                ></span>({{value==null||value==''?'--':parseFloat(value).toFixed(2)}})
              </el-col>
            </el-col>
          </el-row>
        </div>
        <div class="table-cont" style="margin-top: 10px">
          <el-table
            :data="costList"
            border
            stripe
            width="100%"
          >
            <el-table-column
              v-for="(item,index) in costParams2"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!-- 可自定义内容 -->
                <template v-if="item.prop == 'unitPrice'  || item.prop == 'amount' || item.prop == 'chargeAmount'">
                  <span v-if="scope.row[item.prop]!=null" class="overflow-point">{{parseFloat(scope.row[item.prop]).toFixed(2)}}</span>
                  <span v-else class="overflow-point">{{scope.row[item.prop]}}</span>
                </template>
                <template v-else>
                  <span class="overflow-point">{{scope.row[item.prop]}}</span>
                </template>
              </template>

            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {dailyDetails, itemDetails, totalItemDetails} from '@/api/cost/cost.js';

  export default {
    name: "inpatientCost",
    data() {
      return {
        loading: false,
        //搜索条件
        searchData: {
          dates: ['', ''],
          radio: '1'
        },
        dateRecord: '',//当前查询信息date
        dayBefore: '',
        dayAfter: '',
        dayBeforeDisabled: true,
        dayAfterDisabled: true,
        currentDay: '--',
        //入院花费概况
        inpatientCosts: {
          /* wesMedicine: '',
           treatment: '',
           bed: '',
           check: '',
           nursing: '',
           allCost: ''*/
        },
        //时间类型的表格表头
        costParams1: [
          {
            prop: "itemType",
            label: "项目类别",
            align: "left",
            headerAlign: "left",
            width: "100",
            fixed: "left"
          }, {
            prop: "itemCode",
            label: "项目代码",
            align: "left",
            headerAlign: "left",
            width: "100",
            fixed: false
          }, {
            prop: "itemName",
            label: "项目名称",
            align: "left",
            headerAlign: "left",
            width: "100",
            fixed: false
          }, {
            prop: "spec",
            label: "规格",
            align: "left",
            headerAlign: "left",
            width: "70",
            fixed: false
          }, {
            prop: "unitPrice",
            label: "单价",
            align: "left",
            headerAlign: "left",
            width: "70",
            fixed: false
          }, {
            prop: "amount",
            label: "数量",
            align: "left",
            headerAlign: "left",
            width: "50",
            fixed: false
          }, {
            prop: "chargeAmount",
            label: "金额",
            align: "left",
            headerAlign: "left",
            width: "70",
            fixed: false
          }, {
            prop: "fillerTimePoint",
            label: "执行时间",
            align: "left",
            headerAlign: "left",
            width: "120",
            fixed: false
          }
        ],
        costList: [],
        //类型的表格表头
        costParams2: [
          {
            prop: "itemCode",
            label: "项目代码",
            align: "left",
            headerAlign: "left",
            width: "110",
            fixed: "left"
          }, {
            prop: "itemName",
            label: "项目名称",
            align: "left",
            headerAlign: "left",
            width: "100",
            fixed: false
          }, {
            prop: "spec",
            label: "规格",
            align: "left",
            headerAlign: "left",
            width: "70",
            fixed: false
          }, {
            prop: "unitPrice",
            label: "单价",
            align: "left",
            headerAlign: "left",
            width: "70",
            fixed: false
          }, {
            prop: "amount",
            label: "数量",
            align: "left",
            headerAlign: "left",
            width: "50",
            fixed: false
          }, {
            prop: "chargeAmount",
            label: "金额",
            align: "left",
            headerAlign: "left",
            width: "70",
            fixed: false
          }, {
            prop: "fillerTimePoint",
            label: "计费时间",
            align: "left",
            headerAlign: "left",
            width: "120",
            fixed: false
          }
        ],
        //时间类型的花费概况
        costDate: {
          total: ''
        },
        //类型的花费概况
        costType: {
          total: '',
          bedCost: '',
          nursingCost: '',
          wesMedicine: ''
        },
        itemList: {}
      }
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData", "hisRecordInData"]),
      //当天
      currentDate() {
        return this.searchData.dates[0];
      }
    },
    watch: {
      "hisRecordInData": {
        async handler(n) {
          this.clearData();
          if (JSON.stringify(n) !== "{}" && n.inpCode) {
            await this.getInpatientInfo();
            let param = {
              type: this.searchData.radio,
              startDate: this.searchData.dates[0] == "" ? '' : this.searchData.dates[0] + " 00:00:00",
              endDate: this.searchData.dates[1] == "" ? '' : this.searchData.dates[1] + " 23:59:59"
            };
            if (param.startDate.length > 0 && param.endDate.length > 0) {
              await this.getInpatientInfoDetail(param);
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    beforeDestroy(){
      this.changeHisRecordInData({});
    },
    methods: {
      ...mapActions({
        changeHisRecordInData: 'patientMaster/changeHisRecordInData'
      }),
      //获取住院收费信息
      async getInpatientInfo() {
        this.loading = true;
        try {
          let param = this.hisRecordInData.inpCode || '';
          if (param == '') {
            this.$message('非住院患者，未获取到住院号！');
            return;
          }
          let resTotal = await totalItemDetails(param);
          //总费用
          if (resTotal.code == '1') {
            this.inpatientCosts = resTotal.data;
          } else {
            this.$message.error(resTotal.msg || '获取住院收费总费用信息失败');
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          // this.$message.error(error.msg || '获取住院收费总费用信息失败');
        }
      },
      // eslint-disable-next-line complexity
      async getInpatientInfoDetail(data) {
        this.loading = true;
        if (data.startDate == "") {
          this.loading = false;
          this.$message('开始日期不能为空');
          return;
        }
        if (data.endDate == "") {
          this.loading = false;
          this.$message('结束日期不能为空');
          return;
        }
        if (!this.hisRecordInData.inpCode || this.hisRecordInData.inpCode == "") {
          this.loading = false;
          this.$message('非住院患者，未获取到住院号！');
          return;
        }
        try {
          let dateParam = {
            startDate: data.startDate,
            endDate: data.endDate,
            inpCode: this.hisRecordInData.inpCode || '',
            patientId: this.hisRecordInData.patientId || ''
          };
          if (data.type == 1) {

            let resdate = await dailyDetails(dateParam);
            //日期
            if (resdate.code == '1') {
              this.costList = resdate.data.chargeDetailList;
              this.costDate.total = resdate.data.total;
            } else {
              this.$message.error(resdate.msg || '获取住院收费信息失败');
            }
          } else if (data.type == 2) {
            let restype = await itemDetails(dateParam);
            //类
            if (restype.code == '1') {
              this.costType.total = restype.data.total;
              this.costList = restype.data.chargeDetailList;
              // this.itemList = {
              //   "additionalProp1": 0,
              //     "additionalProp2": 0,
              //     "additionalProp3": 0
              // };//
              this.itemList = restype.data.itemChargeDetails;
            } else {
              this.$message.error(restype.msg || '获取住院收费每日清单信息失败');
            }
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || '获取住院收费每日清单信息失败');
        }
      },
      clearData() {
        this.inpatientCosts = {};
        this.costList = [];
        this.costDate.total = '';
        //类型的花费概况
        this.costType.total = '';
        this.itemList = {};
        this.currentDay = '--';
        //this.searchData ="";
      },
      //查询
      async search() {
        let param = {
          type: this.searchData.radio,
          startDate: this.searchData.dates[0] == "" ? "" : this.searchData.dates[0] + " 00:00:00",
          endDate: this.searchData.dates[1] == "" ? "" : this.searchData.dates[1] + " 23:59:59"
        };
        this.currentDay = this.searchData.dates[0];
        if (this.hisRecordInData.inpCode == '') {
          this.$message('非住院患者，未获取到住院号！');
          return;
        } else {
          await this.getInpatientInfo();
          await this.getInpatientInfoDetail(param);
        }
      },
      //改变查询方式
      async radioChange() {
        let param = {
          type: this.searchData.radio,
          startDate: this.searchData.dates[0] == "" ? "" : this.searchData.dates[0] + " 00:00:00",
          endDate: this.searchData.dates[1] == "" ? "" : this.searchData.dates[1] + " 23:59:59"
        };
        // await this.getInpatientInfo();
        await this.getInpatientInfoDetail(param);
      },
      //选择日期区间
      datePickerChange(date) {
        this.dateRecord = date[0] + " 00:00:00";
        this.dayBefore = this.getDate(this.dateRecord, -1);
        this.dayAfter = this.getDate(this.dateRecord, 1);
        this.dayAfterDisabled = false;
      },
      //算前一天后一天
      getDate(date, day) {
        let dd = new Date(date);
        dd.setDate(dd.getDate() + day);
        let limitDate0 = new Date(this.searchData.dates[0]).getTime();
        let limitDate1 = new Date(this.searchData.dates[1]).getTime();
        if (dd.getTime() <= limitDate0) {
          return this.searchData.dates[0];
        } else if (dd.getTime() >= limitDate1) {
          return this.searchData.dates[1];
        } else {
          let y = dd.getFullYear();
          let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
          let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
          return y + "-" + m + "-" + d;
        }

      },
      //当天
      async getCurrentDate() {
        this.clearData();
        // this.dateRecord = this.searchData.dates[0];
        // this.dayBefore = this.getDate(this.searchData.dates[0], -1);
        // this.dayAfter = this.getDate(this.searchData.dates[0], 1);
        //今天的时间
        let day2 = new Date();
        day2.setTime(day2.getTime());
        let s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
        this.dayBeforeDisabled = false;
        this.dayAfterDisabled = false;
        this.currentDay = s2;
        let param = {
          type: this.searchData.radio,
          startDate: s2 + " 00:00:00",
          endDate: s2 + " 23:59:59"
        };
        await this.getInpatientInfo();
        await this.getInpatientInfoDetail(param);
      },
      //前一天
      async getDayBefore() {
        this.clearData();
        this.dateRecord = this.dayBefore;
        this.dayBefore = this.getDate(this.dateRecord, -1);
        this.dayAfter = this.getDate(this.dateRecord, 1);
        this.dayAfterDisabled = false;
        this.dayBeforeDisabled = this.dateRecord == this.currentDate ? true : false;
        let param = {
          type: this.searchData.radio,
          startDate: this.dateRecord == "" ? "" : this.dateRecord + " 00:00:00",
          endDate: this.dateRecord == "" ? "" : this.dateRecord + " 23:59:59"
          //endDate: this.searchData.dates[1]
        };
        this.currentDay = this.dateRecord;
        await this.getInpatientInfo();
        await this.getInpatientInfoDetail(param);
      },
      //后一天
      async getDayAfter() {
        this.clearData();
        this.dateRecord = this.dayAfter;
        this.dayBefore = this.getDate(this.dateRecord, -1);
        this.dayAfter = this.getDate(this.dateRecord, 1);
        this.dayBeforeDisabled = false;
        this.dayAfterDisabled = this.dateRecord == this.searchData.dates[1] ? true : false;
        let param = {
          type: this.searchData.radio,
          startDate: this.dateRecord == "" ? "" : this.dateRecord + " 00:00:00",
          endDate: this.dateRecord == "" ? "" : this.dateRecord + " 23:59:59"
          //endDate: this.searchData.dates[1]
        };
        this.currentDay = this.dateRecord;
        await this.getInpatientInfo();
        await this.getInpatientInfoDetail(param);
      }
    }
  }
</script>

<style scoped lang="scss">
  .inpatientCost {
    .title {
      .title-cont {
        margin-left: 14px;
      }
    }
  }
</style>
