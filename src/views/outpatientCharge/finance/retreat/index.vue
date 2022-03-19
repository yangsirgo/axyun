<template>
  <div class="height100" ref="page">
    <el-card class="Outpatient-retreat height100">
      <div class="top clearfix">
        <el-input
          class="search-input"
          placeholder="请读取医保卡、身份证、就诊卡"
          v-model="searchForm.searchValue">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="selectp"></i>
        </el-input>
        <el-button type="primary" class="duka-button"><i class="iconfont iconduka"></i>读卡</el-button>
        <el-button class="reset-button" @click="reset">重置</el-button>
        <el-button class="search-button" @click="search">查询</el-button>
        <span class="name-input">
        <LFormtTitle label="姓名">
        <el-input v-model="searchForm.searchName" style="line-height: 34px;"></el-input>
      </LFormtTitle>
      </span>
        <el-date-picker
          v-model="searchForm.searchDate"
          type="monthrange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          class="search-date"
        >
        </el-date-picker>
      </div>
      <div class="center">
        <el-button type="text" class="tuihao-button" :disabled="isThDisabled" @click="thClick"><i
          class="iconfont icontuihao"></i>退号
        </el-button>
        <el-button type="text" class="fapiao-button" :disabled="isFpDisabled" @click="fpClick"><i
          class="iconfont iconwandaidayin"></i>重打发票
        </el-button>
      </div>
      <div class="bottom">
        <el-table
          :data="tableData"
          stripe
          border
          style="width: 100%"
          max-height="400"
          ref="singleTable"
          highlight-current-row
          v-loadmore="load"
          v-loading="tlm_isLoading"
          :element-loading-text="$t('retreat.loadInfo')"
          @current-change="currentChange"
        >
          <el-table-column
            type="selection"
            width="36"
            align="center"
            fixed="left"
          >
          </el-table-column>
          <el-table-column
            v-for="(item,index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            align="left"
            :fixed="item.fixed"
          >
            <template slot-scope="fileScope">
              <template v-if="item.prop == 'patientNo'">
                <span class="font-color-blue">{{ fileScope.row[item.prop]}}</span>
              </template>
              <template v-else-if="item.prop == 'patientName'">
                <span class="font-color-blue">{{ fileScope.row['patientName']}} {{ fileScope.row['patientGender']==1?'男':'女'}} {{fileScope.row['patientAge']}}</span>
              </template>
              <template v-else>
                <span>{{ fileScope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="门诊退号"
               width="51.2%"
               :visible.sync="retreatDisable"
               :close-on-click-modal="false"
    >
      <retreat-dialog :reteatData.sync="currentPatient" @changeRetreatDisable="changeRetreatDisable"></retreat-dialog>
    </el-dialog>
  </div>

</template>

<script>
  import adHeight from "@/mixins/adHeight";
  import retreatDialog from "./components/retreatDialog.vue";
  import service from '@/api/appointment/retreat';
  import appointment from '@/api/appointment/appointment';
  export default {
    name: "index",
    mixins: [adHeight],
    components: {
      retreatDialog
    },
    data() {
      return {
        //搜索form
        searchForm: {
          searchValue: '0000444555',//搜索内容
          searchDate: '',//搜索时间
          searchName: '',//搜索姓名
          page: 1,//当前页码
          limit: 10//每次请求条数
        },
        //表格项目数据
        tableParams: [
          {
            prop: "patientCode",
            label: "门诊号",
            align: "left",
            width: "120",
            fixed: 'left'
          },
          {
            prop: "patientName",
            label: "患者",
            align: "left",
            width: "206",
            fixed: false
          },
          {
            prop: "ouptDeptId",
            label: "挂号科室",
            align: "left",
            width: "166",
            fixed: false
          },
          {
            prop: "diagTreatType",
            label: "挂号类型",
            align: "left",
            width: "112",
            fixed: false
          },
          {
            prop: "doctorName",
            label: "医生",
            align: "left",
            width: "112",
            fixed: false
          },
          {
            prop: "date",
            label: "时间",
            align: "left",
            width: "55",
            fixed: false
          },
          {
            prop: "appointmentTime",
            label: "预约时间",
            align: "left",
            width: "171",
            fixed: false
          },
          {
            prop: "chargeTime",
            label: "挂号时间",
            align: "left",
            width: "171",
            fixed: false
          },
          {
            prop: "chargeUserName",
            label: "挂号人",
            align: "left",
            width: "87",
            fixed: false
          },
          {
            prop: "recordStatus",
            label: "状态",
            align: "left",
            width: "55",
            fixed: false
          },
          {
            prop: "recordRemark",
            label: "退号原因",
            align: "left",
            width: "326",
            fixed: false
          },
          {
            prop: "reChargeTime",
            label: "退号时间",
            align: "left",
            width: "171",
            fixed: false
          },
          {
            prop: "reChargeUserName",
            label: "退号人",
            align: "left",
            width: "106",
            fixed: false
          }
        ],
        //表格内容数据
        tableData: [
          {
            patientId: '12345678',//患者id
            patientNo: '0003948525',//患者门诊号
            patientName: '张少华',//患者姓名
            patientGender: 1,//性别
            patientAge: 20,//年龄
            depart: '泌尿科',//科室
            type: '普通',//挂号类型
            doctor: '赵磊',//医生
            date: '上午',//时间
            orderDate: '2019-05-02 08:56',//预约时间
            registrateDate: '2019-05-03 09:31',//挂号时间
            registrateMan: '李海',//挂号人
            status: '失效',//状态
            backReason: '挂错科室',//退号原因
            backDate: '2019-05-09 09:21',//退号时间
            backMan: '李海'//退号人
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          },
          {
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '李海'
          }
        ],
        isThDisabled: true,
        isFpDisabled: true,
        //当前选中患者及收费信息
        currentPatient: {
          patient:{}, //患者的预约信息
          chargeInfo:[], // 收费明细
          ids:[] // 退费的id集合
        },
        retreatDisable: false,//控制弹框开关
        total: 3,//总页数
        tlm_noMore: false, // 没有更多数据， 禁用加载
        tlm_isLoading: false,// 请求数据中
        patientInfo:{}, //患者数据
      }
    },
    watch: {
      currentPatient(val) {
        this.currentPatient = val;
      }
    },
    mounted(){
      this.search();
    },
    methods: {
      //搜索列表
      async search() {
        this.$showLoading();
        try {
          let sDate = '';
          let eDate = ''; 
          if(this.searchForm.searchDate && this.searchForm.searchDate.length > 1){
            sDate = this.searchForm.searchDate[0].toLocaleString();
            eDate = this.searchForm.searchDate[1].toLocaleString();
          }
          this.$set(this.searchForm,'sDate',sDate);
          this.$set(this.searchForm,'eDate',eDate);
          //获取table数据接口
          let data = {...this.searchForm}
          this.$delete(data,"searchDate")
          const response = await service.getList(data);
          this.tableData = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //重置输入框搜索信息
      reset() {
        this.searchForm = {
          searchValue: '',
          searchDate: '',
          searchName: '',
          page: 1,
          limit: 10
        };
        this.search();
      },
      //选中表格某一项
      async currentChange(row) {
        this.currentPatient.patient ={...row};
        if(this.currentPatient.patient){
          this.isThDisabled = false;
          this.isFpDisabled = false;
        }
      },
      //点击退号
      async thClick() {
        try {
          this.$showLoading();
          if(this.currentPatient.patient.tradeId){
            const response = await service.getTradeDetail({
              tradeId:this.currentPatient.patient.tradeId
            });
            this.currentPatient.chargeInfo = response.data;
          }
          this.$hideLoading();
          this.retreatDisable = true;
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //打印发票
      fpClick() {

      },
      //确认退号
      async changeRetreatDisable(data) {
        if(data == false){
          this.retreatDisable = data;
        }else{
          try {
            this.$showLoading();
            const response = await service.outpRefund({
              tradeId: this.currentPatient.patient.tradeId,
              dataVersion: this.currentPatient.patient.dataVersion,
              outpChargeDetailList: this.currentPatient.ids
            });
            this.retreatDisable = false;
            this.$hideLoading();
            this.resetPatient();
            this.reset();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "标准错误提示");
          }
        }        
      },
      //滑动加载更多信息
      load() {
        const _this = this;
        this.searchForm.page++;
        setTimeout(function () {
          let proData = [..._this.tableData];
          //获取分页列表
          // this.search();
          //模拟返回数据
          let newProList = [{
            patientId: '12345678',
            patientNo: '0003948525',
            patientName: '张少华',
            patientGender: 1,
            patientAge: 20,
            depart: '泌尿科',
            type: '普通',
            doctor: '赵磊',
            date: '上午',
            orderDate: '2019-05-02 08:56',
            registrateDate: '2019-05-03 09:31',
            registrateMan: '李海',
            status: '失效',
            backReason: '挂错科室',
            backDate: '2019-05-09 09:21',
            backMan: '111'
          }];
          if (_this.page >= _this.total) {
            _this.tlm_noMore = true;
          }
          _this.tableData = [...proData.concat(newProList)];
          _this.tlm_isLoading = false;
        }, 2000)
      },
      // 搜索患者
      async selectp(){
        try {
          this.$showLoading();
          const response = await appointment.getPatientInfo({
            cardNum:this.searchForm.searchValue
          });
          this.patientInfo = response.data;
          this.searchForm.searchName = '';
          this.searchForm.searchDate = [];
          this.searchForm.searchValue = this.patientInfo.patientId;
          this.search();
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      // 清空数据
      resetPatient(){
        this.currentPatient = {
          patient:{}, //患者的预约信息
          chargeInfo:[], // 收费明细
          ids:[] // 退费的id集合
        }
      }
    }
  }
</script>

<style lang="scss">
  .font-color-blue {
    color: $l-color-fontcolor-2;
  }

  .Outpatient-retreat {
    width: 100%;
    height: 100%;
    background: $l-color-white;

    .top {
      width: calc(100% - 40px);
      margin: 20px;

      .search-input {
        width: 260px;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-11;
        float: left;
      }

      .duka-button {
        width: 200px;
        height: 38px;
        margin-left: 10px;
        border: none;
        border-radius: 2px;
        float: left;

        i {
          display: inline-block;
          margin-right: 10px;
        }
      }

      .search-date {
        width: 221px;
        height: 36px;
        margin-right: 10px;
        float: right;
      }

      .search-button, .reset-button {
        width: 80px;
        height: 36px;
        margin-left: 10px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;
        
        font-weight: 500;
        color: $l-color-white;
        float: right;
      }

      .reset-button {
        background: $l-color-white;
        border: 1px solid $l-color-primary;
        
        color: $l-color-primary;
      }

      .name-input {
        width: 200px;
        float: right;
      }
    }

    .center {
      width: calc(100% - 40px);
      margin: 20px;

      .tuihao-button, .fapiao-button {
        margin-right: 32px;
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;

        i {
          display: inline-block;
          margin-right: 8px;
        }
      }

      .fapiao-button {
        margin: 0;
      }

      .tuihao-button:disabled {
        color: $l-color-fontcolor-4;
      }

      .fapiao-button:disabled {
        color: $l-color-fontcolor-4;
      }
    }

    .bottom {

    }
  }
</style>
