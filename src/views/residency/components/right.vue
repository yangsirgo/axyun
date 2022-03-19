<template>
  <div class="entry">
    <el-card class="entry-cont">
      <div class="head">
        <l-card-title>
          <template slot="left"><i>04</i>{{$t('residency.bed')}} {{$t('residency.patientOperate')}}</template>
        </l-card-title>
      </div>
      <div class="entry-cards clearfix">
        <el-col :span="6" class="card-item"
                v-for="(item,index) in entryCards"
                :key="index"
                @click="handelClick(item.routerHref)"
        >
          <span :class="'iconfont '+item.icon"></span>
          <i :class="{'gray-color':isDisabled==true}">{{item.info}}</i>
        </el-col>
        <!--<el-col :span="6" class="card-item">
          <span></span>
          <i>看摘要</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span></span>
          <i>看摘要</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span></span>
          <i>看摘要</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span></span>
          <i>看摘要</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span></span>
          <i>看摘要</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span></span>
          <i>看摘要</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span></span>
          <i>看摘要</i>
        </el-col>-->
      </div>
      <div class="info">
        <div class="clearfix">
          <el-col :span="12">
            <div class="label-name">{{$t('residency.bedNum')}} <i>{{patientItem.patientBedNo}} {{$t('residency.bed')}}</i></div>
            <div class="label-name">{{$t('residency.name')}} <i>{{patientItem.patientName}}</i></div>
            <div class="label-name">{{$t('residency.ageName')}} <i>{{patientItem.patientAge}}</i></div>
          </el-col>
          <el-col :span="12">
            <div class="label-name">{{$t('residency.id')}} <i>{{patientItem.id}}</i></div>
            <div class="label-name">{{$t('residency.gender')}} <i>{{patientItem.patientGender}}</i></div>
            <div class="label-name">{{$t('residency.depart')}} <i>{{patientItem.depart}}</i></div>
          </el-col>
        </div>
        <div style="padding-top: 10px">
          <div class="label-name">{{$t('residency.cardId')}} <i>{{patientItem.cardId}}</i></div>
          <div class="label-name">{{$t('residency.phone')}} <i>{{patientItem.phone}}</i></div>
          <div class="label-name">{{$t('residency.checkinDate')}} <i>{{patientItem.CheckinDate}}（{{patientItem.CheckinDays}}{{$t('residency.day')}}）</i></div>
          <div class="label-name">{{$t('residency.illness')}} <i>{{patientItem.illness}}</i></div>
          <div class="label-name">{{$t('residency.visitingStaff')}} <i>{{patientItem.visitingStaff}}</i></div>
          <div class="label-name">{{$t('residency.nursingLevel')}} <i>{{patientItem.nursingLevel}}</i></div>
          <div class="label-name">{{$t('residency.medicalInsurance')}} <i>{{patientItem.medicalInsurance}}</i></div>
        </div>
        <div style="padding-top: 10px">
          <div class="label-name">{{$t('residency.prepay')}} <i>{{account.prepay}}</i></div>
          <div class="label-name">{{$t('residency.totalMoney')}} <i class="main-color">{{account.totalMoney}}</i></div>
          <div class="label-name">{{$t('residency.selfPayMoney')}} <i class="main-color">{{account.selfPayMoney}}</i></div>
          <div class="label-name">{{$t('residency.allergyHistory')}} <i class="main-color">{{patientItem.allergyHistory}}</i></div>
          <div class="label-name">{{$t('residency.other')}} <i>{{patientItem.other}}</i></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "right",
    data() {
      return {
        entryCards: [
          {
            icon: 'iconbingqingzhaiyao',
            info: '看摘要',
            routerHref: ''
          }, {
            icon: 'icondianziyizhu',
            info: '开医嘱',
            routerHref: ''
          }, {
            icon: 'icondianzibingli',
            info: '写病历',
            routerHref: ''
          }, {
            icon: 'iconlicizhenduan',
            info: '下诊断',
            routerHref: ''
          }, {
            icon: 'iconwenshubianji',
            info: '开申请',
            routerHref: ''
          }, {
            icon: 'iconbaogaozhongxin',
            info: '看报告',
            routerHref: ''
          }, {
            icon: 'icontiwendan',
            info: '看体温',
            routerHref: ''
          }, {
            icon: 'iconhuizhenshenqing',
            info: '写会诊',
            routerHref: ''
          }],
        isDisabled: true,
        //患者信息
        patientItem: {
          patientId: '',//患者id
          patientName: '',//姓名
          patientBedNo: '',//患者床号
          patientGender: '',//患者性别
          patientAge: '',//患者年龄
          visitingStaff: '',//主治医师
          visitingNurse: '',//主管护师
          dutyNurse: '',//责任护师
          CheckinDate: '',//入院日期
          CheckinDays: '',//入院天数
          illness: '',//患病
          newBorn: '',//新生儿个数
          attention: '',//收藏
          tag: [],//标识
          cardId: '',//身份证号
          phone: '',//电话
          nursingLevel: '',//护理级别
          medicalInsurance: '',//医保类型
          allergyHistory: '',//过敏史
          other: ''//其他信息
        },
        //患者账户信息
        account: {
          prepay: 500.00,//预交金
          totalMoney: 1000.00,//费用合计
          selfPayMoney: 655.00//自费
        }
      }
    },
    props: ['patientId'],
    watch: {
      patientId(newpatientId, oldpatientId) {
        this.isDisabled = false;
        this.patientItem = {
          id: '1234567',//住院号
          patientId: '123123',//患者id
          patientName: '李小芬',//姓名
          patientBedNo: '04',//患者床号
          patientGender: '女',//患者性别
          patientAge: 20,//患者年龄
          depart: '泌尿科',//科室
          visitingStaff: '张扬',//主治医师
          visitingNurse: '朱芬',//主管护师
          dutyNurse: '刘素芬',//责任护师
          CheckinDate: '2019-04-14',//入院日期
          CheckinDays: 10,//入院天数
          illness: '肾结石',//患病
          newBorn: 2,//新生儿个数
          attention: 1,//收藏
          tag: ['特', '普食'],//标识
          isListClick: false,//是否被点击
          cardId: '123456789',//身份证号
          phone: 1111111,//电话
          nursingLevel: '特级',//护理级别
          medicalInsurance: '本事城镇职工基本医疗保险',//医保类型
          allergyHistory: '无',//过敏史
          other: ''//其他信息
        };
        this.account = {
          prepay: 500.00,//预交金
          totalMoney: 1000.00,//费用合计
          selfPayMoney: 655.00//自费
        };
      }
    },
    methods: {
      handelClick(routerHref) {
        this.$router.push('/' + routerHref);
      }
    }
  }
</script>

<style scoped lang="scss">
  .gray-color {
    color: $l-color-fontcolor-4 !important;
  }

  .entry {
    width: 100%;
    height: 100%;

    .entry-cont {
      width: 100%;
      height: 100%;
      padding: 20px 0;

      .head {
        margin-left: 20px;

        i {
          font-size: 28px;
          
          font-weight: bold;
          font-style: normal;
          vertical-align: top;
          display: inline-block;
          margin-right: 10px;
        }
      }

      .entry-cards {
        padding-left: 6px;

        .card-item {
          width: 56px;
          height: 58px;
          margin-left: 14px;
          margin-bottom: 14px;
          background: $l-color-bgcolor-18;
          border-radius: 4px;
          cursor: pointer;

          span {
            width: 16px;
            height: 16px;
            margin-top: 10px;
            margin-left: 20px;
            color: $l-color-primary;
            display: inline-block;
          }

          i {
            margin-top: 5px;
            margin-left: 10px;
            text-align: center;
            font-style: normal;
            font-size: 12px;
            
            font-weight: 400;
            color: $l-color-fontcolor-3;
            display: inline-block;
          }
        }

      }

      .info {
        margin: 20px;
        padding-top: 10px;
        border-top: 1px solid $l-color-bgcolor-11;

        .label-name {
          margin-top: 10px;
          font-size: 14px;
          
          font-weight: 400;
          color: $l-color-fontcolor-4;

          i {
            font-style: normal;
            
            color: $l-color-fontcolor-3;
          }

          .main-color {
            color: $l-color-primary;
          }
        }
      }
    }
  }
</style>
