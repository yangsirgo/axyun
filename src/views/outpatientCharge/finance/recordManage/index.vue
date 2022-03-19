<template>
  <div class="record width100 height100">
    <div class="top">
      <el-card class="width100 height100">
        <top :patientDetail="patientDetail"></top>
      </el-card>
    </div>
    <div class="middle">
      <el-card class="width100 height100">
        <middle :patientDetail="patientDetail"></middle>
      </el-card>
    </div>
  </div>
</template>

<script>
  import top from './components/top';
  import middle from './components/middle';

  export default {
    name: "index.vue",
    components: {
      top,
      middle

    },
    data() {
      return {
        patientDetail: {}
      }
    },
    created() {
      this.getPatientInfo();
    },
    methods: {
      getPatientInfo() {
        this.$showLoading();
        try {
          /*let param = {
            ...searchData,
            page: 1,
            limit: 1
          };*/
          //获取数据接口
          // let res = await getPatientList(param);
          //假数据填充
          let res = [
            {
              patientName: '夏立燕',
              patientFullName: '夏立燕',
              patientGender: 0,
              patientAge: '19岁',
              mobileNum: 15965487892,
              otherMobileNum: 159968878968,
              email: 'liyan@163.com',
              birthDate: '2000-05-06',
              birthTime: '17:35',
              identificationNum: '156485200005061459',
              insuranceType: '城镇居民保险',//医保类型
              nativePlaceCode: '上海市松江区',//籍贯
              EMPId: '5442',//EMPId
              illNess: '糖尿病',
              SINCardNo: '4322121313213213213123',//社保卡号
              bloodType: 'O型',
              nationCode: '汉族',
              maritalStatus: '未婚',
              domicile: '上海市松江区谷阳北路2399弄',//户籍地址
              domicilePostCode: '025410',//户籍地址邮编
              address: '上海市松江区谷阳北路2399弄',//联系地址
              addressPostCode: '035241',//联系地址
              careerCode: '学生',
              company: '**学校',
              officeTel: '',//单位电话
              archFiduciaryList: {
                fiduciaryName: '夏伟',
                relationShip: '父亲',
                identityNumber: '153548197012164512',
                contactAddress: '上海市闵行区七宝镇'
              },
              archGuarantorList: {
                guarantorName: '夏伟',
                guarantorPhone: '15658719700615',
                guarantorIdentificationNum: '153548197012164512',
                guaranteeRelation: '',
                guaranteeAddress: '上海市闵行区七宝镇'
              },
              settlementType: '自费',//结算类型
              settlementCompany: '自费单位',//结算单位
              socialSecurity: '',//社保类型
              bookbuildingType: '个人',//建档类型
              cardAssociated: '无',//关联卡
              fileLoading: '可用'//档案装填
            }
          ];
          this.patientDetail = res[0];
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .record {
    .top {
      height: 150px;
      margin-bottom: 20px;
    }

    .middle {
      height: calc(100% - 170px);
    }
  }
</style>
