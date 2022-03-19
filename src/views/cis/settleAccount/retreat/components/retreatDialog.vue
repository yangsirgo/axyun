<template>
  <div class="retreat-dialog">
    <div class="retreat-main">
      <el-row class="tag">{{$t('retreat.info')}}</el-row>
      <div class="detail clearfix">
        <el-col :span="5" class="detail-item">
          <el-col :span="12">{{$t('retreat.name')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.patientName}}</i></el-col>
        </el-col>
        <el-col :span="6" class="detail-item">
          <el-col :span="12">{{$t('retreat.gender')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.patientGender}}</i></el-col>
        </el-col>
        <el-col :span="6" class="detail-item">
          <el-col :span="12">{{$t('retreat.age')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.patientAge}}</i></el-col>
        </el-col>
        <el-col :span="7" class="detail-item">
          <el-col :span="12">{{$t('retreat.birthDate')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.birthDate}}</i></el-col>
        </el-col>
        <el-col :span="5" class="detail-item">
          <el-col :span="12">{{$t('retreat.depart')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.ouptDeptId}}</i></el-col>
        </el-col>
        <el-col :span="6" class="detail-item">
          <el-col :span="12">{{$t('retreat.type')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.diagTreatType}}</i></el-col>
        </el-col>
        <el-col :span="6" class="detail-item">
          <el-col :span="12">{{$t('retreat.doctor')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.doctorName}}</i></el-col>
        </el-col>
        <el-col :span="7" class="detail-item">
          <el-col :span="12">{{$t('retreat.retreatDate')}}</el-col>
          <el-col :span="12"><i>{{reteatData.patient.reChargeTime}}</i></el-col>
        </el-col>
      </div>
      <div class="pro">
        <el-table
          :data="reteatData.chargeInfo"
          stripe
          border
          style="width: 100%"
          max-height="177"
          ref="singleTable"
          highlight-current-row
          v-loadmore="load"
          v-loading="tlm_isLoading"
          :element-loading-text="$t('retreat.loadInfo')"
          @selection-change="getRowsIdx"
        >
          <el-table-column
            type="selection"
            width="32"
            align="center"
            fixed="left"
          >
          </el-table-column>
          <el-table-column
            v-for="(item,index) in proParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            align="left"
            :fixed="item.fixed"
          ></el-table-column>
        </el-table>
      </div>
      <div class="select">
          <span class="select-item">
              <LFormtTitle label="退号原因" labelWidth="76">
                <!-- <l-value-domain
                  :code="code1"
                  :value="typeVal1"
                  class="inline-block select-container"
                  placeholder="请选择"
                ></l-value-domain> -->
                <el-select v-model="typeVal1" placeholder="请选择">
                  <el-option :key="'1'" label="不治了" value="1"></el-option>
                  <el-option :key="'2'" label="没钱" value="2"></el-option>
                  <el-option :key="'3'" label="就是退" value="3"></el-option>
                </el-select>
            </LFormtTitle>
          </span>
          
        <span class="select-item">
              <LFormtTitle label="退款方式" labelWidth="76">
                <!-- <l-value-domain
                  :code="code2"
                  :value="typeVal2"
                  class="inline-block select-container"
                  placeholder="请选择"
                ></l-value-domain> -->
                <el-select v-model="typeVal2" placeholder="请选择">
                  <el-option :key="'1'" label="账户退款" value="1"></el-option>
                </el-select>
              </LFormtTitle>
            </span>
      </div>
      <span class="rules" v-if="typeVal1 || typeVal2">{{''}}</span>
      <span class="rules" v-if="!typeVal1 || !typeVal2">{{rules}}</span>
    </div>
    <div class="retreat-footer clearfix">
      <el-button type="primary" class="cancel-button"  @click="cancel">{{$t('retreat.cancel')}}</el-button>
      <el-button type="primary" class="confirm-button" @click="confirm">{{$t('retreat.confirm')}}</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name: "retreatDialog",
    props: {
      reteatData:{
        type:Object,
        default:{
          patient:{}, //患者的预约信息
          chargeInfo:[], // 收费明细
          ids:[] // 退费的id集合
        }
      }
    },
    data() {
      return {
        //表格项目数据
        proParams: [
          {
            prop: "statisticsCode",
            label: "项目类型",
            align: "left",
            width: "139",
            fixed: 'left'
          },
          {
            prop: "itemName",
            label: "项目名称",
            align: "left",
            width: "435",
            fixed: false
          },
          {
            prop: "itemQuantity",
            label: "数量",
            align: "left",
            width: "55",
            fixed: false
          },
          {
            prop: "chargePrice",
            label: "单价",
            align: "left",
            width: "131",
            fixed: false
          },
          {
            prop: "totalMoney",
            label: "金额",
            align: "left",
            width: "147",
            fixed: false
          }
        ],
        page: 1,//当前页码
        limit: 5,//每次请求条数
        total: 3,//总页数
        tlm_noMore: false, // 没有更多数据， 禁用加载
        tlm_isLoading: false,// 请求数据中
        code1: "CS00.00.001",//退号原因
        typeVal1: "",
        code2: "CS00.00.001",//退号方式
        typeVal2: "",
        proItem: [] ,//选中的table项目
        rules:'请选择退号原因及退款方式'
      }
    },
    // watch: {
    //   patientId(newpatientId, oldpatientId) {
    //     if (newpatientId) {
    //       //请求数据
    //       this.getInfo();
    //       this.getRetreatList();
    //     }
    //   }
      
    // },
    watch: {
      reteatData(val) {
        this.reteatData = val;
        this.$emit('update:currentPatient', val)
      }
    },
    mounted(){
      this.reteatData.ids = [ ...this.reteatData.chargeInfo];
      this.typeVal1 = '';
      this.typeVal2 = '';
    },
    methods: {
      //滑动加载更多信息
      load() {
        const _this = this;
        this.page++;
        setTimeout(function () {
          let proData = [..._this.proData];
          //获取分页列表
          // this.getRetreatList();
          //模拟返回数据
          let newProList = [
            {
              patientId: '3215648',
              proType: '就诊卡',
              proName: '就诊卡',
              number: 2,
              unitPrice: 3,
              total: 6
            }, {
              patientId: '354261',
              proType: '病历本',
              proName: '病历本',
              number: 2,
              unitPrice: 3,
              total: 6
            }];
          if (_this.page >= _this.total) {
            _this.tlm_noMore = true;
          }
          _this.proData = [...proData.concat(newProList)];
          _this.tlm_isLoading = false;
        }, 2000)
      },
      //选择table某一项
      // getRowsIdx(selection) {
      //   if (selection.length > 0) {
      //     this.reteatData.ids = selection;
      //   } else {
      //     this.reteatData.ids = [];
      //   }
      // },
      // 记录选中行
    getRowsIdx(rows) {
      let ids = [];
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        ids.push(item);
      }
      this.reteatData.ids = ids;
    },
      //确定退号
      confirm() {
        if(!this.typeVal1){
         
        }
        if(!this.typeVal2){
          
        }
        this.$emit('changeRetreatDisable',true);
      },
      //取消退号
      cancel() {
        this.$emit('changeRetreatDisable', false);
      }
    }
  }
</script>

<style scoped lang="scss">
.rules{
  font-size: 10px;
  color: $l-color-primary;
  margin-left: 20px;
  line-height: 20px;
}
  .retreat-dialog {
    padding: 20px;

    .retreat-main {
      .tag {
        height: 38px;
        background: $l-color-bgcolor-19;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-20;
        font-size: $l-font-size;
        
        font-weight: 500;
        color: $l-color-fontcolor-2;
        line-height: 38px;
        text-align: center;
      }

      .detail {
        margin-top: 30px;
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-fontcolor-4;

        .detail-item {
          margin-bottom: 20px;

          i {
            font-style: normal;
            color: $l-color-fontcolor-3;
          }
        }

      }

      .pro {
        margin-top: 10px;
      }

      .select {
        width: 100%;
        height: 76px;
        margin-top: 30px;
        margin-bottom: 10px;
        padding: 20px;
        background: $l-color-bgcolor-18;
        border-radius: 2px;

        .select-item {
          width: 272px;
          display: inline-block;
        }
      }
    }

    .retreat-footer {
      padding: 20px 0 0 20px;
      border-top: 1px solid $l-color-bgcolor-11;

      .confirm-button, .cancel-button {
        width: 80px;
        height: 36px;
        margin-left: 10px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;
        
        font-weight: 500;
        color: $l-color-white;
        text-align: center;
        float: right;
      }

      .confirm-button {
        padding: 0;
      }

      .cancel-button {
        background: $l-color-white;
        border: 1px solid $l-color-primary;
        
        color: $l-color-primary;
      }
    }
  }
</style>
