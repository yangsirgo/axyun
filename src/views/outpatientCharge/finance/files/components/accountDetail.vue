<template>
  <div class="width100 height100">
    <el-card class="account-cont">
      <div class="width100 height100" v-if="accountDisable">
        <l-card-title>
          <template slot="left">账户信息</template>
        </l-card-title>
        <div class="title">
          <span class="title-cont title-date">开户时间<i>{{accountDetailInfoData.createdAt}}</i></span>
          <span class="title-cont title-money">账户余额<i>{{accountDetailInfoData.balanceMoney}}</i></span>
          <span class="title-cont title-date">账户状态<i>{{accountDetailInfoData.recordStatus}}</i></span>
        </div>
        <div class="tabs">
          <el-tabs
            tab-position="top"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane label="充退记录" name="first">
              <el-table
                :data="rechargeData"
                width="100%"
                height="160px"
                :stripe="true"
                border
                highlight-current-row
                v-loadmore="load"
                v-loading="tlm_isLoading"
                :element-loading-text="$t('retreat.loadInfo')"
              >
                <el-table-column
                  v-for="(item,index) in rechargeParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="left"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="accountScope">
                    <template v-if="item.prop == 'recordStatus'">{{ accountScope.row['recordStatus']==1?'充值':'退款'}}
                    </template>
                    <template v-else>{{ accountScope.row[item.prop]}}</template>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div class="pagination">
                 <el-pagination
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   @prev-click="prevClick"
                   @next-click="nextClick"
                   :current-page="currentPage"
                   :page-sizes="pageSizes"
                   :page-size="pageSize"
                   :layout="layout"
                   :total="total"
                   :prev-text="prevText"
                   :next-text="nextText"
                   :hide-on-single-page="hideOnSinglePage"
                 ></el-pagination>
               </div>-->
              <div class="tabs-foot">
                <span class="tabs-foot-cont">总计</span>
                <span
                  class="tabs-foot-cont tabs-foot-cont2">退款 <i> -{{accountDetailInfoData.refundPrestoreTotal}}</i></span>
                <span class="tabs-foot-cont tabs-foot-cont1">充值 <i> {{accountDetailInfoData.prestoreTotal}}</i></span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="消费记录" name="second">
              <el-popover
                placement="bottom"
                width="100%"
                v-model="popoverDisabled"
              >
                <div class="consume-details">
                  <el-table
                    :data="consumeDetailsData"
                    :stripe="true"
                    border
                    width="100%"
                    height="200px"
                  >
                    <el-table-column
                      v-for="(item,index) in consumeDetailsParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      header-align="center"
                      :align="item.align || 'left'"
                      :fixed="item.fixed"
                    >
                    </el-table-column>
                  </el-table>
                </div>
                <el-table
                  :data="consumeData"
                  width="100%"
                  height="200px"
                  :stripe="true"
                  border
                  @row-click="consumeClick"
                  @header-click="headerClick"
                  slot="reference"
                  highlight-current-row
                  v-loadmore ="{noMoreVar:'tlm_noMore1', loadingVar: 'tlm_isLoading1', value: load1}"
                  v-loading="tlm_isLoading1"
                  :element-loading-text="$t('retreat.loadInfo')"
                >
                  <!--<el-table-column type="expand">
                    <template slot-scope="props">
                      <span>111</span>
                    </template>
                  </el-table-column>-->
                  <el-table-column
                    v-for="(item,index) in consumeParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    header-align="left"
                    :align="item.align || 'left'"
                    :fixed="item.fixed"
                  >
                    <template slot-scope="consumeScope">
                      <template v-if="item.prop == 'patientName'">
                        {{ consumeScope.row['patientName']}} {{ consumeScope.row['patientGender']==1?'男':'女'}}
                        {{getAge(strSplit(consumeScope.row['birthDate'],' '))}}
                      </template>
                      <template v-else>
                        <span>{{ consumeScope.row[item.prop]}}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>

              </el-popover>
              <!-- <div class="pagination">
                 <el-pagination
                   @size-change="handleSizeChange1"
                   @current-change="handleCurrentChange1"
                   @prev-click="prevClick1"
                   @next-click="nextClick1"
                   :current-page="currentPage1"
                   :page-sizes="pageSizes1"
                   :page-size="pageSize1"
                   :layout="layout1"
                   :total="total1"
                   :prev-text="prevText1"
                   :next-text="nextText1"
                   :hide-on-single-page="hideOnSinglePage1"
                 ></el-pagination>
               </div>-->


              <!--消费记录明细-->
              <!--<div v-show="isConsumeDetails" class="consume-details">
                <el-table
                  :data="consumeDetailsData"
                  :stripe="true"
                  border
                  style="width: 100%">
                  <el-table-column
                    v-for="(item,index) in consumeDetailsParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    header-align="center"
                    :align="item.align || 'left'"
                  >
                  </el-table-column>
                </el-table>
              </div>-->

            </el-tab-pane>
          </el-tabs>
          <div class="buttons">
            <el-button class="button-cont button-cont1" @click="accountRechargeDisable=true">充值</el-button>
            <el-button class="button-cont button-cont2 el-button-cancel" @click="freeze">冻结</el-button>
            <el-button class="button-cont button-cont3 el-button-cancel" @click="accountRefundDisable=true">退款
            </el-button>
          </div>
        </div>
      </div>

    </el-card>

    <el-dialog title="账户充值"
               width="594px"
               :visible.sync="accountRechargeDisable"
               :close-on-click-modal="false"
    >
      <account-recharge
        @rechargeConfirm="rechargeConfirm"
        @rechargeCancel="rechargeCancel"
        :patientInfo="patientInfo"
        :accountDetailInfoData="accountDetailInfoData"
      ></account-recharge>
    </el-dialog>

    <el-dialog title="账户退款"
               width="520px"
               :visible.sync="accountRefundDisable"
               :close-on-click-modal="false"
    >
      <account-refund
        @refundConfirm="refundConfirm"
        @refundCancel="refundCancel"
        :patientInfo="patientInfo"
        :accountDetailInfoData="accountDetailInfoData"
      ></account-refund>
    </el-dialog>
  </div>
</template>

<script>
  import accountRecharge from '../components/accountRecharge.vue';
  import accountRefund from '../components/accountRefund.vue';
  import {freeze, getPrestoreRefundList, getAccountInfo, prestoreConsume, prestoreDetail} from '@/api/arch/arch.js';

  export default {
    name: "accountDetail",
    components: {
      accountRecharge,
      accountRefund
    },
    props: ['patientInfo', 'accountDisable'],
    data() {
      return {
        visible: false,
        popoverDisabled: false,
        accountRechargeDisable: false,
        accountRefundDisable: false,
        activeName: 'first',
        /*充退记录*/
        rechargeParams: [
          {
            prop: "recordStatus",
            label: "类型",
            align: "left",
            fixed: "left",
            width: "30"
          }, {
            prop: "payTypeId",
            label: "方式",
            align: "left",
            fixed: false,
            width: "50"
          }, {
            prop: "prestoreMoney",
            label: "金额",
            align: "left",
            fixed: false,
            width: "60"
          },
          {
            prop: "createdAt",
            label: "操作时间",
            align: "left",
            fixed: false,
            width: "50"
          },
          {
            prop: "createdByName",
            label: "操作人",
            align: "left",
            fixed: false,
            width: "40"
          }
        ],
        rechargeData: [],
        rechargeDataUnit: [],
        /*消费记录*/
        consumeParams: [
          {
            prop: "patientName",
            label: "患者",
            align: "left",
            fixed: "left",
            width: "160"
          }, {
            prop: "depart",
            label: "就诊科室",
            align: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "doctorName",
            label: "就诊医生",
            align: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "consumeMoney",
            label: "金额",
            align: "left",
            fixed: false,
            width: "58"
          }, {
            prop: "prestoreBalance",
            label: "账户余额",
            align: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "createdAt",
            label: "操作时间",
            align: "left",
            fixed: false,
            width: "133"
          }, {
            prop: "createdAtByName",
            label: "操作人",
            align: "left",
            fixed: false,
            width: "80"
          }],
        consumeData: [
          // {
          //   patientName: '',
          //   depart: '',
          //   doctorName: '',
          //   consumeMoney: '',
          //   prestoreBalance: '',
          //   createdAt: '',
          //   createdAtByName: ''
          // }
        ],
        consumeDataUnit: [],
        /*消费记录明细*/
        isConsumeDetails: false,
        consumeDetailsParams: [
          {
            prop: "status",
            label: "状态",
            align: "left",
            fixed: "left",
            width: "76"
          }, {
            prop: "type",
            label: "项目类型",
            align: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "name",
            label: "项目名称",
            align: "left",
            fixed: false,
            width: "202"
          }, {
            prop: "groupName",
            label: "组套名",
            align: "left",
            fixed: false,
            width: "124"
          }, {
            prop: "specification",
            label: "规格",
            align: "left",
            fixed: false,
            width: "100"
          }, {
            prop: "unit",
            label: "单位",
            align: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "unitPrice",
            label: "单价",
            align: "left",
            fixed: false,
            width: "54"
          }, {
            prop: "num",
            label: "数量",
            align: "left",
            fixed: false,
            width: "50"
          }, {
            prop: "price",
            label: "金额",
            align: "left",
            fixed: false,
            width: "74"
          }, {
            prop: "depart",
            label: "执行科室",
            align: "left",
            fixed: false,
            width: "102"
          }
        ],
        consumeDetailsData: [
          // {
          //   status: '已执行',
          //   type: '1',
          //   name: '22',
          //   groupName: '22',
          //   specification: '22',
          //   unit: '33',
          //   unitPrice: '33',
          //   num: '33',
          //   price: '33',
          //   depart: '33'
          // }
        ],
        /*账户信息*/
        accountDetailInfoData: {
          // balanceMoney: 0,
          // consumeMoney: 0,
          // createdAt: "",
          // createdBy: "",
          // createdByName: "",
          // freezeMoney: 0,
          // patientNum: "",
          // prestoreCode: "",
          // prestoreMoney: 0,
          // prestoreTotal: 0,
          // recordStatus: "",
          // refundPrestoreTotal: 0,
          // updatedAt: "",
          // updatedBy: "",
          // updatedByName: ""
        },
        /*分页信息*/
        pageSize: 3,
        currentPage: 1,
        total: 0,
        currentPage1: 1,
        total1: 0,
        // pageSizes: [3, 6, 9],
        // layout: 'sizes,prev,pager,next,jumper,total',
        // prevText: '',
        // nextText: '',
        // hideOnSinglePage: false,
        // pageSizes1: [3, 6, 9],
        // pageSize1: 3,
        // layout1: 'sizes,prev,pager,next,jumper,total',
        // prevText1: '',
        // nextText1: '',
        // hideOnSinglePage1: false,
        // loading: true,
        tlm_noMore: false,
        tlm_isLoading: false,
        tlm_noMore1: false,
        tlm_isLoading1: false,
        tlm_noMore2: false,
        tlm_isLoading2: false
      }
    },
    watch: {
      async patientInfo(newPatientInfo, oldPatientInfo) {
        this.activeName = "first";
        /*获取账户信息，充退列表，消费列表？*/
        await this.getAccountDetailInfo(JSON.parse(this.patientInfo).patientNum);
        this.$emit('getAccountDetail', true);
        await this.getRechargeDataList(JSON.parse(this.patientInfo).patientNum, this.accountDetailInfoData.prestoreCode, this.currentPage, this.pageSize);
        this.rechargeData = this.rechargeDataUnit;
      }
    },
    async created() {
      if (this.patientInfo) {
        //填充基本信息
        // await this.getAccountDetailInfo(JSON.parse(this.patientInfo).patientNum);
        // this.$emit('getAccountDetail', true);
        // await this.getRechargeDataList(JSON.parse(this.patientInfo).patientNum, this.accountDetailInfoData.prestoreCode, this.currentPage, this.pageSize);
        // this.rechargeData = this.rechargeDataUnit;
        // this.loading = false;
      }

    },
    methods: {
      //滑动加载更多信息
      load() {
        const _this = this;
        this.currentPage++;
        setTimeout(function () {
          let rechargeData = [..._this.rechargeData];
          //获取分页列表
          _this.getRechargeDataList(JSON.parse(_this.patientInfo).patientNum, _this.accountDetailInfoData.prestoreCode, _this.currentPage, _this.pageSize);
          if (_this.currentPage >= _this.total) {
            _this.tlm_noMore = true;
          }
          _this.rechargeData = [...rechargeData.concat(_this.rechargeDataUnit)];
          _this.tlm_isLoading = false;
        }, 2000)
      },
      load1() {
        const _this = this;
        this.currentPage1++;
        setTimeout(function () {
          let consumeData = [..._this.consumeData];
          //获取分页列表
          _this.getPrestoreConsume(JSON.parse(_this.patientInfo).patientNum, _this.currentPage1, _this.pageSize);
          if (_this.currentPage1 >= _this.total1) {
            _this.tlm_noMore1 = true;
          }
          _this.consumeData = [...consumeData.concat(_this.consumeDataUnit)];
          _this.tlm_isLoading1 = false;
        }, 2000)
      },
      /*切换tab*/
      async handleClick() {
        // this.loading = true;
        if (this.activeName == "first") {
          //充退记录
          await this.getRechargeDataList(JSON.parse(this.patientInfo).patientNum, this.accountDetailInfoData.prestoreCode, this.currentPage, this.pageSize);
          this.rechargeData = this.rechargeDataUnit;
          // this.loading = false;
        } else if (this.activeName == "second") {
          //消费记录
          await this.getPrestoreConsume(JSON.parse(this.patientInfo).patientNum, this.currentPage1, this.pageSize);
          this.consumeData = this.consumeDataUnit;
          // this.loading = false;
        }
      },
      //获取账户信息信息
      async getAccountDetailInfo(patientNum) {
        let data = await getAccountInfo(patientNum);
        if (data.data) {
          this.accountDetailInfoData = data.data;
        } else {
          this.accountDetailInfoData = {
            balanceMoney: 0,
            consumeMoney: 0,
            createdAt: "",
            createdBy: "",
            createdByName: "",
            freezeMoney: 0,
            patientNum: "",
            prestoreCode: "",
            prestoreMoney: 0,
            prestoreTotal: 0,
            recordStatus: "",
            refundPrestoreTotal: 0,
            updatedAt: "",
            updatedBy: "",
            updatedByName: ""
          }
        }
      },
      //获取充退记录列表信息
      async getRechargeDataList(patientNum, prestoreCode, page, limit) {
        let data = await getPrestoreRefundList({
          patientNum: patientNum,
          prestoreCode: prestoreCode,
          page: page,
          limit: limit
        });
        if (data.data) {
          this.rechargeDataUnit = data.data;
          this.total = data.total;
        } else {
          this.rechargeDataUnit = [];
          this.total = 0;
        }

      },
      //获取消费记录信息
      async getPrestoreConsume(patientNum, page, limit) {
        let data = await prestoreConsume({
          patientNum: patientNum,
          page: page,
          limit: limit
        });
        if (data.data) {
          this.consumeDataUnit = data.data;
          this.total1 = data.total;
        } else {
          this.consumeDataUnit = [];
          this.total1 = 0;
        }

      },
      //获取消费明细信息
      async getPrestoreConsumeDetail(params) {
        let data = await prestoreDetail(params);
        this.consumeDetailsData = data.data;
      },
      //点击某一行消费记录出现明细
      consumeClick(row, column, event) {
        this.popoverDisabled = false;
        /*请求本条消费记录明细接口*/
        this.getPrestoreConsumeDetail({});//待传参
        //this.consumeDetailsData = data;
        // 显示明细表格
        this.isConsumeDetails = true;
      },
      /*表头被点击*/
      headerClick() {
        this.popoverDisabled = true;
        this.consumeDetailsData = [];
        this.isConsumeDetails = false;
      },
      /*冻结*/
      freeze() {
        this.$confirm('账户冻结后，账户余额不能使用，你要冻结吗？', '冻结此账户', {
          confirmButtonText: '冻结',
          cancelButtonText: '再看看',
          type: 'warning'
        }).then(async () => {
          /*卡片冻结接口？*/
          let accountInfo = this.accountDetailInfoData;
          accountInfo.recordStatus = 0;
          let data = freeze(this.accountDetailInfoData);//传状态，1解冻，0 冻结
          if (data.code == 1) {
            this.$message({
              type: 'success',
              message: '账户冻结成功!'
            });
            await this.getAccountDetailInfo(JSON.parse(this.patientInfo).patientNum);
          } else {
            this.$message({
              type: 'warning',
              message: data.msg
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消冻结'
          });
        });
      },
      /*dialog emit*/
      async rechargeConfirm(data) {
        this.accountRechargeDisable = data;
        await this.getAccountDetailInfo(JSON.parse(this.patientInfo).patientNum);
        this.currentPage = 1;
        await this.getRechargeDataList(JSON.parse(this.patientInfo).patientNum, this.accountDetailInfoData.prestoreCode, this.currentPage, this.pageSize);
        this.rechargeData = this.rechargeDataUnit;
        this.currentPage1 = 1;
        await this.getPrestoreConsume(JSON.parse(this.patientInfo).patientNum, this.currentPage1, this.pageSize);
        this.consumeData = this.consumeDataUnit;
      },
      rechargeCancel(data) {
        this.accountRechargeDisable = data;
      },
      async refundConfirm(data) {
        this.accountRefundDisable = data;
        await this.getAccountDetailInfo(JSON.parse(this.patientInfo).patientNum);
        this.currentPage = 1;
        await this.getRechargeDataList(JSON.parse(this.patientInfo).patientNum, this.accountDetailInfoData.prestoreCode, this.currentPage, this.pageSize);
        this.rechargeData = this.rechargeDataUnit;
        this.currentPage1 = 1;
        await this.getPrestoreConsume(JSON.parse(this.patientInfo).patientNum, this.currentPage1, this.pageSize);
        this.consumeData = this.consumeDataUnit;
      },
      refundCancel(data) {
        this.accountRefundDisable = data;
      },
      /*dialog emit*/
      /*年龄计算*/
      getAge(str) {
        if (str) {
          var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
          if (r == null) return false;
          var d = new Date(r[1], r[3] - 1, r[4]);
          if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
            var Y = new Date().getFullYear();
            return (Y - r[1]);
          }
          return '';
        } else {
          return ('');
        }

      },
      /*切割字符串*/
      strSplit(data, sym) {
        if (data) {
          let str = data.split(sym)[0];
          return str;
        } else {
          return "";
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .account-cont {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    position: relative;
    overflow: auto;

    .head {
      width: 64px;
      height: 24px;
      margin-bottom: 8px;
      font-size: 16px;
      
      font-weight: 500;
      color: rgba(46, 50, 58, 1);
      line-height: 24px;
      position: relative;
      left: 10px;

      .head-before {
        width: 4px;
        height: 20px;
        background: $l-color-primary;
        position: absolute;
        left: -10px;
        top: 0;
      }
    }

    .title {
      margin-bottom: 20px;
      padding-left: 15px;

      .title-cont {
        height: 20px;
        margin-right: 40px;
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(148, 157, 163, 1);
        line-height: 20px;
        display: inline-block;

        i {
          height: 18px;
          margin-left: 10px;
          font-style: normal;
          font-size: 14px;
          font-weight: 400;
          color: rgba(46, 50, 58, 1);
          line-height: 18px;
        }
      }
    }

    .tabs {
      height: calc(100% - 103px);
      padding-left: 15px;
      position: relative;

      .buttons {
        position: absolute;
        right: 0;
        top: 0;

        .button-cont {
          width: 80px;
          height: 36px;
          padding: 0;
          background: $l-color-primary;
          border-radius: 2px;
          font-size: 14px;
          
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 36px;
        }

        .button-cont2, .button-cont3 {
          background-color: #fff;
          border: 1px solid $l-color-primary;
          color: $l-color-primary;
        }
      }

      .tabs-foot {
        margin: 20px 0 20px 0;
        padding-bottom: 20px;
        border-bottom: 1px solid $l-color-bgcolor-11;

        .tabs-foot-cont {
          height: 20px;
          display: inline-block;
          font-size: 14px;
          
          font-weight: bold;
          color: $l-color-fontcolor-3;
          line-height: 20px;
        }

        .tabs-foot-cont1 {
          margin-right: 30px;
          font-size: 16px;
          
          font-weight: 400;
          color: $l-color-fontcolor-4;
          float: right;

          i {
            font-style: normal;
            display: inline-block;
            margin-left: 10px;
          }
        }

        .tabs-foot-cont2 {
          float: right;

          i {
            font-style: normal;
            
            font-weight: bold;
            color: $l-color-primary;
            line-height: 21px;
          }
        }
      }
    }

    .consume-details {
      position: absolute;
      top: 200px;
    }
  }
</style>
