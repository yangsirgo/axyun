<template>
  <div class="residentCharge width100 height100">
    <!--待入院患者列表-->
    <div class="left height100 float-left">
      <el-card class="width100 height100">
        <el-input v-model="pendingSearchData" @click="pendingSearch"
                  style="width:calc(100% - 40px);margin:20px 20px 10px 20px">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="pendingSearch"></i>
        </el-input>
        <el-button type="primary" class="duka-button"><i class="iconfont iconduka"></i>读卡</el-button>
        <div class="width100 height100">
          <el-table
            class="border-none"
            :data="pendingPatientList"
            border
            stripe
            width="100%"
            height="calc(100% - 124px)"
            v-loadmore="load"
            v-loading="tlm_isLoading"
          >
            <el-table-column
              v-for="(item,index) in pendingPatientParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'patientInfo'">
                  {{scope.row['patientName']}} {{scope.row['patientGender']==1?"男":"女"}} {{scope.row['patientAge']}}
                </template>
                <template v-else>
                  <span>{{scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <!--在院出院患者列表-->
    <div class="center height100 float-left">
      <el-card class="width100 height100">
        <div class="button-list">
          <el-button class="plain-button">出院办理</el-button>
          <el-button class="plain-button" @click="outRecallDisable=true">出院召回</el-button>
          <el-button class="plain-button">患者360</el-button>
          <el-button class="plain-button" @click="preMoneyDisable=true">交预交金</el-button>
          <el-button class="plain-button" @click="retreatPreMoneyDisable=true">退预交金</el-button>
          <el-button class="plain-button">无费退院</el-button>
          <el-button class="primary-button float-right"
                     @click="admitRegistrationDisable = true">入院登记
          </el-button>
        </div>
        <div class="search-input-list">
          <el-row :gutter="5">
            <el-col :span="6">
              <LFormtTitle label="病案（住院）号" labelWidth="118">
                <el-input v-model="inSearchData1.patientCode" style="line-height: 34px;" placeholder=""></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="姓名" labelWidth="48">
                <el-input v-model="inSearchData1.patientName" style="line-height: 34px;" placeholder=""></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="3">
              <LFormtTitle label="性别" labelWidth="48">
                <el-select v-model="inSearchData1.patientGender" style="line-height: 34px;" placeholder="">
                  <el-option label="男" value="0"></el-option>
                  <el-option label="女" value="1"></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="年龄" labelWidth="48">
                <el-input v-model="inSearchData1.patientAge" style="line-height: 34px;" placeholder=""></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="7">
              <el-button class="primary-button" @click="inSearch1">查询</el-button>
              <el-button class="plain-button" @click="reset1">重置</el-button>
              <el-popover
                placement="bottom-end"
                width="910"
                v-model="visible">
                <div class="fold-cont">
                  <el-row :gutter="5">
                    <el-col :span="8">
                      <LFormtTitle label="病案（住院）号" labelWidth="118">
                        <el-input v-model="inSearchData2.patientCode" style="line-height: 34px;"
                                  placeholder=""></el-input>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="姓名" labelWidth="48">
                        <el-input v-model="inSearchData2.patientName" style="line-height: 34px;"
                                  placeholder=""></el-input>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4">
                      <LFormtTitle label="性别" labelWidth="48">
                        <el-select v-model="inSearchData2.patientGender" style="line-height: 34px;" placeholder="">
                          <el-option label="男" value="0"></el-option>
                          <el-option label="女" value="1"></el-option>
                        </el-select>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="年龄" labelWidth="48">
                        <el-input v-model="inSearchData2.patientAge" style="line-height: 34px;"></el-input>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5" style="margin-top: 10px">
                    <el-col :span="6">
                      <LFormtTitle label="科室" labelWidth="48">
                        <el-select v-model="inSearchData2.depart" style="line-height: 34px;" placeholder="">
                          <el-option label="泌尿科" value="0"></el-option>
                        </el-select>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="病区" labelWidth="48">
                        <el-select v-model="inSearchData2.inpatientWard" style="line-height: 34px;" placeholder="">
                          <el-option label="病区一" value="0"></el-option>
                        </el-select>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="在院状态" labelWidth="76">
                        <el-select v-model="inSearchData2.inpatientStatus" style="line-height: 34px;" placeholder="">
                          <el-option label="全部" value="0"></el-option>
                        </el-select>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="费别" labelWidth="48">
                        <el-select v-model="inSearchData2.chargeType" style="line-height: 34px;" placeholder="">
                          <el-option label="自费" value="0"></el-option>
                        </el-select>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5" style="margin-top: 10px">
                    <el-col :span="8">
                      <LFormtTitle label="预交金余额" labelWidth="90">

                        <el-select v-model="inSearchData2.balanceCod"
                                   style="line-height: 34px;width:25%!important"
                                   placeholder="">
                          <el-option label=">" value="0"></el-option>
                          <el-option label="=" value="1"></el-option>
                          <el-option label="<" value="2"></el-option>
                        </el-select>
                        <el-input v-model="inSearchData2.balance"
                                  style="line-height: 34px;width:calc(70% - 15px)!important"
                                  placeholder=""></el-input>

                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="入院时间" labelWidth="76">
                        <el-date-picker
                          v-model="inSearchData2.inpatientDate"
                          type="daterange"
                          range-separator="-"
                          start-placeholder=""
                          end-placeholder=""
                          style="line-height: 34px;"
                          placeholder="">
                        </el-date-picker>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="出院时间" labelWidth="76">
                        <el-date-picker
                          v-model="inSearchData2.outpatientDate"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          style="line-height: 34px;"
                          placeholder="">
                        </el-date-picker>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <div class="clearfix" style="padding:20px 0 20px 0">
                    <el-button class="float-right plain-button" style="margin-left: 10px" @click="reset2">重置
                    </el-button>
                    <el-button class="float-right primary-button" @click="inSearch2">查询</el-button>
                  </div>
                </div>
                <span slot="reference" class="reference-icon iconfont iconzhankai"></span>
              </el-popover>
            </el-col>
          </el-row>
        </div>
        <div class="width100 height100">
          <el-table
            :data="inOutPatientList"
            border
            stripe
            highlight-current-row
            width="100%"
            height="calc(100% - 156px)"
            v-loadmore="{noMoreVar:'tl_noMore', loadingVar: 'tl_isLoading', value: load1}"
            v-loading="tl_isLoading"
            @row-click="rowClick"
          >
            <el-table-column
              v-for="(item,index) in inOutPatientParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'patientInfo'">
                  {{scope.row['patientName']}} {{scope.row['patientGender']==1?"男":"女"}} {{scope.row['patientAge']}}
                </template>
                <template v-else>
                  <span>{{scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <!--患者信息-->
    <div class="right height100 float-right">
      <el-card class="width100 height100">
        <div style="margin-left: 20px">
          <l-card-title>
            <template slot="left">患者信息</template>
          </l-card-title>
        </div>
        <div class="patient-info-list">
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" class="info-item">患者姓名</el-col>
            <el-col :span="16"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" class="info-item">联系电话</el-col>
            <el-col :span="16"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" class="info-item">结算类型</el-col>
            <el-col :span="16"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" class="info-item">住址</el-col>
            <el-col :span="16"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" class="info-item">身份证号</el-col>
            <el-col :span="16"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" class="info-item">主管医师</el-col>
            <el-col :span="16"></el-col>
          </el-row>
        </div>
        <div style="margin-left: 20px">
          <l-card-title>
            <template slot="left">预交金明细</template>
          </l-card-title>
        </div>
        <div class="premoney-info-list">
          <el-table
            class="border-none"
            :data="premoneyList"
            border
            stripe
            width="100%"
            height="192px"
            v-loadmore="{noMoreVar:'noMore2', loadingVar: 'isLoading2', value: load2}"
            v-loading="isLoading2"
          >
            <el-table-column
              v-for="(item,index) in ipremoneyParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-left: 20px">
          <l-card-title>
            <template slot="left">费用信息</template>
          </l-card-title>
        </div>
        <div class="charge-info-list">
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" class="info-item">患者姓名</el-col>
            <el-col :span="16"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="10" class="info-item">费用总额</el-col>
            <el-col :span="14"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="10" class="info-item">预交金金额</el-col>
            <el-col :span="14"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="10" class="info-item">医保报销金额</el-col>
            <el-col :span="14"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="10" class="info-item">医院垫付金额</el-col>
            <el-col :span="14"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="10" class="info-item">个人账户支出</el-col>
            <el-col :span="14"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="10" class="info-item">自付金额</el-col>
            <el-col :span="14"></el-col>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-col :span="10" class="info-item">欠费金额</el-col>
            <el-col :span="14"></el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <!--入院登记弹框-->
    <el-dialog title="入院登记"
               width="52%"
               :visible.sync="admitRegistrationDisable"
               :close-on-click-modal="false"
               @close="close1"
               @open="open1"
    >
      <admit-registration :isClose1="isClose1" @changeDialog="changeDialog1(arguments)"></admit-registration>
    </el-dialog>

    <el-dialog title="医保登记"
               width="64%"
               :visible.sync="insuranceRegistrationDisable"
               :close-on-click-modal="false"
               @close="close2"
               @open="open2"
    >
      <insurance-registration :isClose2="isClose2" @changeDialog="changeDialog2(arguments)"></insurance-registration>
    </el-dialog>

    <el-dialog title="预交金缴存"
               width="52%"
               :visible.sync="preMoneyDisable"
               :close-on-click-modal="false"
               @close="close3"
               @open="open3"
    >
      <pre-money :isClose3="isClose3" @changeDialog="changeDialog3"></pre-money>
    </el-dialog>

    <el-dialog title="退预交金"
               width="52%"
               :visible.sync="retreatPreMoneyDisable"
               :close-on-click-modal="false"
               @close="close4"
               @open="open4"
    >
      <retreat-pre-money :isClose4="isClose4" @changeDialog="changeDialog4"></retreat-pre-money>
    </el-dialog>

    <el-dialog title="出院召回"
               width="52%"
               :visible.sync="outRecallDisable"
               :close-on-click-modal="false"
               @close="close5"
               @open="open5"
    >
      <out-recall :isClose5="isClose5" @changeDialog="changeDialog5"></out-recall>
    </el-dialog>
  </div>
</template>

<script>
  import admitRegistration from './components/admitRegistration';
  import insuranceRegistration from './components/insuranceRegistration';
  import preMoney from './components/preMoney';
  import retreatPreMoney from './components/retreatPreMoney';
  import outRecall from './components/outRecall';

  export default {
    name: "index",
    components: {
      admitRegistration,
      insuranceRegistration,
      preMoney,
      retreatPreMoney,
      outRecall
    },
    data() {
      return {
        //待入院查询条件
        pendingSearchData: '',
        //待入院患者表头
        pendingPatientParams: [
          {
            prop: "patientInfo",
            label: "患者姓名",
            align: "left",
            width: "120",
            fixed: "left"
          }, {
            prop: "depart",
            label: "科室",
            align: "left",
            width: "85",
            fixed: false
          }, {
            prop: "doctor",
            label: "医生",
            align: "left",
            width: "78",
            fixed: false
          }
        ],
        //待入院患者列表
        pendingPatientList: [],
        //每次请求的分页表格数据
        pendingPatientListUnit: [],
        //待入院患者列表分页数据
        page: 1,
        limit: 10,
        total: 0,
        tlm_noMore: false,
        tlm_isLoading: false,
        //在院出院查询条件
        inSearchDataIndex: 1,
        //在院出院查询条件1
        inSearchData1: {
          patientCode: '',//住院号
          patientName: '',//病人姓名
          patientGender: '',//病人性别
          patientAge: ''//病人年龄
        },
        //在院出院查询条件2
        inSearchData2: {
          patientCode: '',//住院号
          patientName: '',//病人姓名
          patientGender: '',//病人性别
          patientAge: '',//病人年龄
          depart: '',//科室
          inpatientWard: '',//病区
          inpatientStatus: '',//在院状态
          chargeType: '',//费别
          balanceCod: '',//大于小于等于
          balance: '',//费别
          inpatientDate: '',//入院时间
          outpatientDate: ''//出院时间
        },
        //更多筛选条件
        visible: false,
        //在院出院患者表头
        inOutPatientParams: [
          {
            prop: "patientInfo",
            label: "患者",
            align: "left",
            width: "120",
            fixed: "left"
          }, {
            prop: "caseHistory",
            label: "病案号",
            align: "left",
            width: "70",
            fixed: false
          }, {
            prop: "patientCode",
            label: "住院号",
            align: "left",
            width: "70",
            fixed: false
          }, {
            prop: "admission",
            label: "住院次数",
            align: "left",
            width: "80",
            fixed: false
          }, {
            prop: "admissionDate",
            label: "入院时间",
            align: "left",
            width: "145",
            fixed: false
          }, {
            prop: "admissionDepart",
            label: "入院科室",
            align: "left",
            width: "80",
            fixed: false
          }, {
            prop: "inpatientWard",
            label: "病区",
            align: "left",
            width: "85",
            fixed: false
          }, {
            prop: "bedNum",
            label: "床号",
            align: "left",
            width: "60",
            fixed: false
          }, {
            prop: "dischargeDate",
            label: "出院时间",
            align: "left",
            width: "140",
            fixed: false
          }, {
            prop: "dischargeDepart",
            label: "出院科室",
            align: "left",
            width: "80",
            fixed: false
          }, {
            prop: "chargeType",
            label: "费别",
            align: "left",
            width: "50",
            fixed: false
          }, {
            prop: "inpatientStatus",
            label: "在院状态",
            align: "left",
            width: "80",
            fixed: false
          }, {
            prop: "expensesSum",
            label: "费用总额",
            align: "right",
            width: "100",
            fixed: false
          }, {
            prop: "preMoneySum",
            label: "预交金总额",
            align: "right",
            width: "100",
            fixed: false
          }
        ],
        //在院出院患者数据
        inOutPatientList: [],
        //在院出院患者每次请求的分页表格数据
        inOutPatientListUnit: [],
        //在院出院患者列表分页数据
        page1: 1,
        limit1: 10,
        total1: 0,
        tl_noMore: false,
        tl_isLoading: false,
        //预交金表头
        ipremoneyParams: [
          {
            prop: "chargeDate",
            label: "交费时间",
            align: "left",
            width: "85",
            fixed: "left"
          }, {
            prop: "money",
            label: "金额",
            align: "left",
            width: "55",
            fixed: false
          }, {
            prop: "type",
            label: "方式",
            align: "left",
            width: "55",
            fixed: false
          }, {
            prop: "operation",
            label: "操作人",
            align: "left",
            width: "65",
            fixed: false
          }
        ],
        //预交金表格数据
        premoneyList: [],
        //预交金表格分页数据
        premoneyListUnit: [],
        //预交金分页数据
        page2: 1,
        limit2: 10,
        total2: 0,
        noMore2: false,
        isLoading2: false,
        //入院登记
        admitRegistrationDisable: false,
        isClose1: false,
        //医保登记
        insuranceRegistrationDisable: false,
        isClose2: false,
        //预交金缴存
        preMoneyDisable: false,
        isClose3: false,
        //退预交金
        retreatPreMoneyDisable: false,
        isClose4: false,
        //出院召回
        outRecallDisable: false,
        isClose5: false
      }
    },
    created() {
    },
    methods: {
      //获取待入院查询列表
      getPendingPatientList() {
        this.$showLoading();
        try {
          //获取数据接口
          // let res = await getPendingPatientList({pendingSearchData,page,limit});
          //假数据填充
          let res = [
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }, {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              depart: '泌尿外科',
              doctor: '张杰明'
            }
          ];
          this.pendingPatientListUnit = res;
          this.total = 10;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //搜索待入院查询列表
      pendingSearch() {
        this.page = 1;
        this.getPendingPatientList();
        this.pendingPatientList = this.pendingPatientListUnit;
        if (this.pendingPatientList.length === 1) {
          this.admitRegistrationDisable = true;
        } else {
          this.admitRegistrationDisable = false;
        }
      },
      //滑动加载更多信息
      load() {
        const _this = this;
        this.page++;
        setTimeout(function () {
          let pendingPatientList = [..._this.pendingPatientList];
          //获取分页列表
          _this.getPendingPatientList();
          if (_this.page >= _this.total) {
            _this.tlm_noMore = true;
          }
          _this.pendingPatientList = [...pendingPatientList.concat(_this.pendingPatientListUnit)];
          _this.tlm_isLoading = false;
        }, 2000)
      },
      //获取在、出院查询列表
      getInOutPatientList(inSearchData) {
        this.$showLoading();
        try {
          //获取药品数据接口
          // let res = await getInOutPatientList(inSearchData)
          //假数据填充
          let res = [
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              caseHistory: '',
              patientCode: '',
              admission: '',
              admissionDate: '',
              admissionDepart: '',
              inpatientWard: '',
              bedNum: '',
              dischargeDate: '',
              dischargeDepart: '',
              chargeType: '',
              inpatientStatus: '',
              expensesSum: '',
              preMoneySum: ''
            },
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              caseHistory: '',
              patientCode: '',
              admission: '',
              admissionDate: '',
              admissionDepart: '',
              inpatientWard: '',
              bedNum: '',
              dischargeDate: '',
              dischargeDepart: '',
              chargeType: '',
              inpatientStatus: '',
              expensesSum: '',
              preMoneySum: ''
            },
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              caseHistory: '',
              patientCode: '',
              admission: '',
              admissionDate: '',
              admissionDepart: '',
              inpatientWard: '',
              bedNum: '',
              dischargeDate: '',
              dischargeDepart: '',
              chargeType: '',
              inpatientStatus: '',
              expensesSum: '',
              preMoneySum: ''
            },
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              caseHistory: '',
              patientCode: '',
              admission: '',
              admissionDate: '',
              admissionDepart: '',
              inpatientWard: '',
              bedNum: '',
              dischargeDate: '',
              dischargeDepart: '',
              chargeType: '',
              inpatientStatus: '',
              expensesSum: '',
              preMoneySum: ''
            },
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              caseHistory: '',
              patientCode: '',
              admission: '',
              admissionDate: '',
              admissionDepart: '',
              inpatientWard: '',
              bedNum: '',
              dischargeDate: '',
              dischargeDepart: '',
              chargeType: '',
              inpatientStatus: '',
              expensesSum: '',
              preMoneySum: ''
            },
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              caseHistory: '',
              patientCode: '',
              admission: '',
              admissionDate: '',
              admissionDepart: '',
              inpatientWard: '',
              bedNum: '',
              dischargeDate: '',
              dischargeDepart: '',
              chargeType: '',
              inpatientStatus: '',
              expensesSum: '',
              preMoneySum: ''
            },
            {
              patientName: '夏立燕',
              patientGender: 0,
              patientAge: '63岁',
              caseHistory: '',
              patientCode: '',
              admission: '',
              admissionDate: '',
              admissionDepart: '',
              inpatientWard: '',
              bedNum: '',
              dischargeDate: '',
              dischargeDepart: '',
              chargeType: '',
              inpatientStatus: '',
              expensesSum: '',
              preMoneySum: ''
            }
          ];
          this.inOutPatientListUnit = res;
          this.total1 = 10;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //搜索在、出院查询列表1
      inSearch1() {
        this.inSearchDataIndex = 1;
        this.reset2();
        this.inSearchData1.page = 1;
        this.inSearchData1.limit = 10;
        this.getInOutPatientList(this.inSearchData1);
        this.inOutPatientList = this.inOutPatientListUnit;
      },
      //重置1
      reset1() {
        this.inSearchData1 = {
          patientCode: '',
          patientName: '',
          patientGender: '',
          patientAge: ''
        };
      },
      //搜索在、出院查询列表2
      inSearch2() {
        this.inSearchDataIndex = 2;
        this.reset1();
        this.visible = false;
        this.inSearchData2.page = 1;
        this.inSearchData2.limit = 10;
        this.getInOutPatientList(this.inSearchData2);
        this.inOutPatientList = this.inOutPatientListUnit;
      },
      //重置2
      reset2() {
        this.inSearchData2 = {
          patientCode: '',
          patientName: '',
          patientGender: '',
          patientAge: '',
          depart: '',
          inpatientWard: '',
          inpatientStatus: '',
          chargeType: '',
          balanceCod: '',
          balance: '',
          inpatientDate: '',
          outpatientDate: ''
        };
      },
      //滑动加载更多信息
      load1() {
        const _this = this;
        this.page1++;
        setTimeout(function () {
          let inOutPatientList = [..._this.inOutPatientList];
          let inSearchData = _this.inSearchDataIndex == 1 ? _this.inSearchData1 : _this.inSearchData2;
          //获取分页列表
          _this.getInOutPatientList(inSearchData);
          if (_this.page1 >= _this.total1) {
            _this.tl_noMore = true;
          }
          _this.inOutPatientList = [...inOutPatientList.concat(_this.inOutPatientListUnit)];
          _this.tl_isLoading = false;
        }, 2000)
      },
      //点击某一行患者
      rowClick(row) {
        console.log(row);
      },
      //滑动加载更多信息
      load2() {
        const _this = this;
        this.page2++;
        setTimeout(function () {
          let premoneyList = [..._this.premoneyList];
          //获取分页列表
          _this.getInOutPatientList();
          if (_this.page2 >= _this.total2) {
            _this.noMore2 = true;
          }
          _this.premoneyList = [...premoneyList.concat(_this.premoneyListUnit)];
          _this.isLoading2 = false;
        }, 2000)
      },
      //获取子组件的关闭弹框信息
      changeDialog1(data) {
        this.admitRegistrationDisable = data[0];
        this.insuranceRegistrationDisable = data[1];
        this.preMoneyDisable = data[2];
      },
      changeDialog2(data) {
        this.admitRegistrationDisable = data[0];
        this.insuranceRegistrationDisable = data[1];
      },
      changeDialog3(data) {
        this.preMoneyDisable = data;
      },
      changeDialog4(data) {
        this.retreatPreMoneyDisable = data;
      },
      changeDialog5(data) {
        this.outRecallDisable = data;
      },
      //弹框打开
      open1() {
        this.isClose1 = true;
      },
      open2() {
        this.isClose2 = true;
      },
      open3() {
        this.isClose3 = true;
      },
      open4() {
        this.isClose4 = true;
      },
      open5() {
        this.isClose5 = true;
      },
      //弹框关闭
      close1() {
        this.isClose1 = false;
      },
      close2() {
        this.isClose2 = false;
      },
      close3() {
        this.isClose3 = false;
      },
      close4() {
        this.isClose4 = false;
      },
      close5() {
        this.isClose5 = false;
      }

    }
  }

</script>

<style scoped lang="scss">
  .residentCharge {
    .left {
      width: 287px;

      .duka-button {
        width: calc(100% - 40px);
        height: 38px;
        margin: 0 20px 20px 20px;
        border: none;
        border-radius: 2px;
        float: left;

        i {
          display: inline-block;
          margin-right: 10px;
        }
      }
    }

    .center {
      width: calc(100% - 614px);
      margin-left: 20px;

      .button-list {
        padding: 20px;
        border: 1px solid $l-color-bgcolor-11;
      }

      .search-input-list {
        padding: 20px;

        .reference-icon {
          width: 24px;
          height: 24px;
          margin-left: 20px;
          display: inline-block;
          color: $l-color-primary;
        }
      }
    }

    .right {
      width: 287px;

      .patient-info-list, .charge-info-list {
        margin: 0 20px 10px 20px;
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        line-height: 20px;

        .info-item {
          color: $l-color-fontcolor-4;
        }
      }

      .premoney-info-list {
        margin: 0 10px 10px 10px;
      }
    }
  }

  .fold-cont {
    padding: 8px;
  }

  .plain-button {
    width: 80px;
    height: 36px;
    padding: 0 12px;
    background: $l-color-white;
    border-radius: 2px;
    font-size: $l-font-size;
    
    font-weight: 400;
    color: $l-color-primary;
    border: 1px solid $l-color-primary;
  }

  .primary-button {
    width: 80px;
    height: 36px;
    padding: 0 12px;
    background: $l-color-primary;
    border-radius: 2px;
    font-size: $l-font-size;
    
    font-weight: 400;
    color: $l-color-white;
    border: none;
  }
</style>
