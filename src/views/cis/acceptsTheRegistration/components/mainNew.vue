<template>
  <div class="width100 height100">
    <div class="outpcharge-main width100 height100 height-button-main">
      <div class="main-wrap">
        <el-form :model="recordForm" ref="recordForm" :rules="rules">
          <el-col style="padding: 10px 0px;">
            <l-card-title><span slot="left">档案信息</span></l-card-title>
          </el-col>
          <el-col>
            <el-col :span='4' class="col6pa">
              <el-form-item prop="">
                <l-formt-title label="姓名" required>
                  <el-input v-model="recordForm.patientName" style="width:100%" placeholder="请输入姓名" @input="inputChange($event)"></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span='6' class="col6pa">
              <el-form-item prop="patientGender">
                <LFormtTitle label="性别" required>
                  <l-value-domain :code="selectCode.patientGender" :value.sync="recordForm.patientGender" class="select-container"
                    @input="inputChange($event)" :placeholder="$t('base.placeholder')"></l-value-domain>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span='6' class="col6pa">
              <el-form-item prop="birthDate">
                <LFormtTitle label="出生日期" required>
                  <el-date-picker v-model="recordForm.birthDate" type="date" style="width:100%" placeholder="选择日期"
                    @input="inputChange($event)" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="expireTimeOption"></el-date-picker>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span='6' class="col6pa">
              <LFormtTitle label="年龄">
                <el-form-item prop="patientAge">
                  <el-input v-model="recordForm.patientAge" style="width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-col>
          <el-col>
            <el-col :span="4" class="col6pa">
              <LFormtTitle label="证件类型">
                <el-form-item prop="relationShip">
                  <l-value-domain :code="selectCode.identificationType" :value.sync="recordForm.identificationType"
                    @change="identifiBlur" class="select-container" :placeholder="$t('base.placeholder')" key="key17"></l-value-domain>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6" class="col6pa">
              <LFormtTitle label="证件号">
                <el-form-item prop="">
                  <el-input v-model="recordForm.identificationNum" onkeyup="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入证件号码" @input="inputChange($event)" @blur="identifiBlur"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6" class="col6pa">
              <el-form-item prop="settlementType">
                <LFormtTitle label="结算类型" required>
                  <l-value-domain :code="selectCode.settlementType" :value.sync="recordForm.settlementType" class="select-container"
                    :placeholder="$t('base.placeholder')" key="key5"></l-value-domain>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="col6pa">
              <el-form-item prop="mobileNum">
                <LFormtTitle label="电话">
                  <div class="input-con">
                    <el-input v-model="recordForm.mobileNum" placeholder="请输入" @input="inputChange($event)"></el-input>

                  </div>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col>
            <el-col :span="4" class="col6pa">
              <el-form-item prop="address">
                <LFormtTitle label="联系地址">
                  <l-value-domain type="cascader" :code="selectCode.address" :value.sync="patientEmpiInfoAddrssVO.currentAddress"
                    class="select-container" remoteValueKey="id" remoteShowKey="label" :multiple="false" :relation="true"
                    :placeholder="$t('base.placeholder')" key="key3"></l-value-domain>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="col6pa">
              <LFormtTitle label="联系具体地址">
                <el-form-item prop="detaiAddress">
                  <el-input maxlength="30" v-model="patientEmpiInfoAddrssVO.currentDetail" style="width:100%" placeholder="请输入" @input="inputChange($event)"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-col>
          <el-col style="padding: 10px 0px;">
            <l-card-title><span slot="left">其他信息</span></l-card-title>
          </el-col>

          <el-col :span="24" v-for="(item,index) in patientEmpiInfoAdditionalVOS" :key="index">
            <el-col>
              <el-col :span='6' class="col6pa">
                <el-form-item prop="patientName">
                  <LFormtTitle label="联系人">
                    <el-input v-model="item.patientName" style="width:100%"></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="col6pa">
                <el-form-item>
                  <LFormtTitle label="联系人电话">
                    <el-input v-model="item.mobileNum" minlength="11" style="width:100%" placeholder="请输入" @input="inputChange($event)"></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span='6' class="col6pa">
                <el-form-item prop="">
                  <LFormtTitle label="工作单位">
                    <el-input v-model="item.workUnit" style="width:100%"></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col>
              <el-col :span="6" class="col6pa">
                <el-form-item prop="">
                  <LFormtTitle label="户籍地址">
                    <l-value-domain type="cascader" :code="selectCode.address" :value.sync="item.address" class="select-container"
                      remoteValueKey="id" remoteShowKey="label" :multiple="false" :relation="true" :placeholder="$t('base.placeholder')"></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="col6pa">
                <el-form-item prop="conDetail">
                  <LFormtTitle label="具体地址">
                    <el-input v-model="item.conDetail" style="width:100%" @input="inputChange($event)" placeholder="请输入"></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
            </el-col>
          </el-col>

          <el-col style="padding: 10px 0px;">
            <l-card-title><span slot="left">挂号信息</span></l-card-title>
          </el-col>
          <el-col>
            <el-col :span="4" class="col6pa">
              <LFormtTitle label="科室">
                <el-form-item>
                  <el-input v-model="ouptDeptName" style="width:100%" @input="inputChange($event)" placeholder="请输入"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="4" class="col6pa">
              <LFormtTitle label="挂号职称">
                <el-form-item>
                  <!-- code   doctorProfessionalTitle -->
                  <l-value-domain :code="selectCode.doctorProfessionalTitle" :value.sync="workName" @change="identifiBlur"
                    class="select-container" :placeholder="$t('base.placeholder')" key="key17"></l-value-domain>
                  <el-input v-model="workName" style="width:100%" @input="inputChange($event)" placeholder="请输入"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="4" class="col6pa">
              <LFormtTitle label="挂号费用">
                <el-form-item>
                  <el-input v-model="apptMoney" style="width:100%" @input="inputChange($event)" placeholder="请输入"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6" class="col6pa" style="position: relative;z-index: 20;display: flex;align-items: center;justify-content: center;">
              <el-checkbox v-model="isFree" class="diagTreatType" @change="diagTreatTypeBlur">免收</el-checkbox>
              <LFormtTitle label="免收原因" :disabled="!isFree">
                <el-form-item>
                  <!-- code   doctorProfessionalTitle -->
                  <l-value-domain code="FreeRecipeReason" :value.sync="freeCode" @change="identifiBlur" :disabled="!isFree"
                    class="select-container" :placeholder="$t('base.placeholder')" key="key17"></l-value-domain>
                  <el-input v-model="freeCode" style="width:100%" @input="inputChange($event)" placeholder="请输入"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-col>
        </el-form>
      </div>
      <div class="outpcharge-main-bg"></div>
    </div>
    <div class="charge-bottom height-button-bottom">
      <el-button type="primary" v-hotKey="{ func: 'func_submit' }" @click="openSubmitCharge">登记</el-button>
    </div>
  </div>
</template>
<script>
  import {
    getFreeDoctor,
    freeAppt,
    regPresettlement,
    settlement2,
    appointTriage,
    selectVisitRoom,
  } from "@/api/cis/order/order";
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    getGroupFlag,
    getThirdUrl
  } from "@/api/third/third";
  import {
    getAgeByBirthDate,
  } from "@/api/filingAndChange/arch";
  export default {
    name: "mainNew",
    components: {},
    props: {
      sendData: {
        type: Object,
      }
    },
    data() {
      return {
        rules: {},
        selectCode: {
          patientGender: 'GENDER_CODE',
          identificationType: "MARK_TYPE_CODE", //卡类型
          settlementType: "settlementType", //结算类型
          address: "AdministrativDivision",
          doctorProfessionalTitle: 'doctorProfessionalTitle', //获取医生职称
        },
        apptMoney: '', //挂号费用
        ouptDeptName: '', //科室
        workName: '', //挂号职称
        isFree: true, //是否收取挂号费
        freeCode:'',
        roomId: '',
        appointmentId: '',
        // address:[301,300,304],
        recordForm: {
          patientName: '', //患者姓名
          patientGender: '', //性别
          birthDate: '', //生日
          patientAge: '', //年龄
          identificationType: '', //卡的类型
          identificationNum: '', //身份证号
          settlementType: '', //结算类型
          mobileNum: '', //手机电话
        },
        // 联系人
        patientEmpiInfoAdditionalVOS: [{
          patientName: '',
          mobileNum: '',
          workUnit: '',
          address: '',
          conDetail: '',
        }],
        patientEmpiInfoAddrssVO: {
          currentAddress: '',
          currentDetail: '',
        },

      };
    },
    computed: {
      ...mapGetters("cis", ["publicHealthData"])
    },
    watch: {
      sendData: {
        deep: true,
        immediate: true,
        handler(val) {
          this.emptyFun();
          if (this.sendData.patientId) {
            console.log(this.sendData, "左侧列表数据的打印1");
            Object.assign(this.recordForm, this.sendData);
            try {
              Object.assign(this.patientEmpiInfoAddrssVO, this.sendData.addressInfo);
              if (this.sendData.addressInfo.currentAddress && this.sendData.addressInfo.currentAddress.length > 0) {
                this.patientEmpiInfoAddrssVO.currentAddress = this.sendData.addressInfo.currentAddress ? eval('(' + this.sendData
                  .addressInfo.currentAddress + ')') : '';
              }
            } catch (error) {
              
            }
            
            this.patientEmpiInfoAdditionalVOS = this.sendData.patientEmpiInfoAdditionalVOS;
            // debugger
            if (this.patientEmpiInfoAdditionalVOS.length > 0) {

              for (let i = 0; i < this.patientEmpiInfoAdditionalVOS.length; i++) {

                this.patientEmpiInfoAdditionalVOS[i].address = eval('(' + this.patientEmpiInfoAdditionalVOS[i].address +
                  ')');
                console.log(this.patientEmpiInfoAdditionalVOS.address)
              }

            } else {
              this.patientEmpiInfoAdditionalVOS = [{
                patientName: '',
                mobileNum: '',
                workUnit: '',
                address: '',
                conDetail: '',
              }]
            }
          }else{
              this.emptyFun();
          }

          console.log(this.sendData, "左侧列表数据的打印2");
        },
      },
    },
    created() {
      this.getFreeDoctorFun();
      this.selectVisitRoom();
    },
    methods: {
      emptyFun(){
         this.recordForm = {
           patientName: '', //患者姓名
           patientGender: '', //性别
           birthDate: '', //生日
           patientAge: '', //年龄
           identificationType: '', //卡的类型
           identificationNum: '', //身份证号
           settlementType: '', //结算类型
           mobileNum: '', //手机电话
         };
         // 联系人
         this.patientEmpiInfoAdditionalVOS = [{
           patientName: '',
           mobileNum: '',
           workUnit: '',
           address: '',
           conDetail: '',
         }];
         this.patientEmpiInfoAddrssVO = {
           currentAddress: '',
           currentDetail: '',
         };
         this.isFree = false;
         this.freeCode = "";
      },
      openSubmitCharge() {
        if (!this.sendData.patientId) {
          this.$message.error("请选择患者");
          return;
        }
        console.log(this.diagTreatType);
        this.freeApptFun();
      },
      async selectVisitRoom() {
        try {
          let res = await selectVisitRoom({});
          console.log(res, "查询之前时候设置过坐诊");
          if (res.code == "1") {
            if (res.data) {
              this.roomId = res.data.roomId;
            }
          }
        } catch (error) {
          this.$message.error(error.msg);
        }
      },
      // 自由诊疗
      async freeApptFun() {
        let obj = {
          patientId: this.sendData.patientId || "",
          appointType: '1',
          diagTreatType: this.diagTreatType,
          channel: '06',
          roomId: this.roomId || "",
          isFree: this.isFree ? 0 : 1,
          // haveMoney:this.isFree ? 0 : 1,
          freeCode:this.freeCode == '' ? '99':this.freeCode,
        };
        try {
          let res = await freeAppt(obj);
          if (res.code == "1") {
            console.log(res, "freeApptFun");
            this.regPresettlementFun(res.data);
            this.appointmentId = res.data.appointmentId;
          } else {
            this.$message.error(res.msg || "自由诊疗失败")
          }
        } catch (error) {}
      },
      // 预结算
      async regPresettlementFun(data) {
        let obj = {
          "patientId": this.sendData.patientId || "",
          // "settlementType": this.sendData.settlementType || "",
          "settlementType": "1",
          "regDiagTreatType": this.diagTreatType || "",
          "regSdeptId": data.ouptDeptId || "",
          "regDoctorId": data.doctorId || "",
          "regWorkCode": data.workCode || '',
          "appointmentId": data.appointmentId || '',
          "companyCode": "",
          "hisPersonType": "",
          "diagTreatActivityId": "",
          "appCode": this.sendData.appCode,
          "medicalType": "",
          "haveMoney": this.isFree ? 0 : 1,
          // haveMoney:this.isFree ? 0 : 1,
          "freeCode": this.freeCode == '' ? '99':this.freeCode,
        }
        try {
          let res = await regPresettlement(obj);
          if (res.code == "1") {
            console.log(res, "regPresettlementFun");
            this.settlement2Fun(res.data);
          } else {
            this.$message.error(res.msg || "预结算失败")
          }
        } catch (error) {}
      },
      // 结算
      async settlement2Fun(data) {
        let obj = {
          "tradeId": data.tradeId,
          "outTradeSettleAmtDetailVO2s": [],
          "channelId": "898a0d3cba3d4f4faeecf113e67a47e9"
        }
        try {
          let res = await settlement2(obj);
          if (res.code == "1") {
            console.log(res, "settlement2Fun");
            this.$message.success("登记成功")
            this.appointTriageFun();
          } else {
            this.$message.error(res.msg || "结算失败")
          }
        } catch (error) {}
      },
      // 分诊
      async appointTriageFun() {
        let obj = {
          "appointmentId": this.appointmentId,
          "scheduleId": ""
        }
        try {
          let res = await appointTriage(obj);
          if (res.code == "1") {
            console.log(res, "appointTriageFun");

          } else {
            this.$message.error(res.msg || "失败")
          }
        } catch (error) {}
      },
      // 获取就诊科室 和  费用   医生
      async getFreeDoctorFun() {
        try {
          let res = await getFreeDoctor({});
          if (res.code == "1") {
            console.log(res, "ziyouzhenliao");
            this.apptMoney = res.data.apptMoney; //挂号费用
            this.ouptDeptName = res.data.ouptDeptName; //科室
            this.workName = res.data.workName; //挂号职称
            this.diagTreatType = res.data.diagTreatType; //是否收取挂号费
          }
        } catch (error) {}
      },
      // 切换地址
      contactChange() {

      },
      //获取年龄接口
      async getAgeByBirthDate() {
        if (this.recordForm.birthDate) {
          if (this.recordForm.birthTime == null) {
            this.recordForm.birthTime = "";
          }
          try {
            let param = {
              birthDate: this.recordForm.birthDate.slice(0, 10) +
                " " +
                this.recordForm.birthTime,
            };
            let res = await getAgeByBirthDate(param);
            if (res.code == "1") {
              this.recordForm.age = res.data;
            }
          } catch (error) {}
        }
      },

      //身份证号码校验
      identifiBlur() {
        if (
          this.recordForm.identificationType == "1" &&
          this.recordForm.identificationNum
        ) {
          if (
            this.recordForm.identificationNum &&
            this.recordForm.identificationNum.length === 18
          ) {
            //获取身份证中的性别
            let isGender =
              parseInt(this.recordForm.identificationNum.substr(16, 1)) % 2;
            if (isGender == 1) {
              this.recordForm.patientGender = "1";
            } else {
              this.recordForm.patientGender = "2";
            }
            //根据出生日期带入年龄
            //根据身份证号带入出生日期与年龄
            let str = this.recordForm.identificationNum.slice(6, 14);
            let birthDate =
              str.slice(0, 4) + "-" + str.slice(4, 6) + "-" + str.slice(6, 8);
            if (Number(str).toString().length == 8) {
              this.recordForm.birthDate = birthDate;
              this.getAgeByBirthDate();
            }
          } else {
            this.$message.error("身份证号不得少于18位");
          }
        }

        // //获取相似档案信息
        // this.patientBlur();
      },
      // 免收
      diagTreatTypeBlur() {
        if(!this.isFree){
          this.freeCode = "";
        }
      },
      // 不得大于当前时间
      expireTimeOption(date) {
        return date.getTime() > Date.now();
      },
      //element组件input无法输入问题
      inputChange(e) {
        this.$forceUpdate();
      },
    }
  };
</script>
<style lang="scss" scoped>
  .outpcharge-main {
    position: relative;
    background: #fff;
    padding: 20px;
  }

  .outpcharge-main-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 10;
  }

  .diagTreatType {
    position: relative;
    z-index: 1000;
  }

  // 新添加信息
  .main-wrap {
    font-size: 14px;
    color: #000000;
  }

  .col6pa {
    margin-left: 8px;
  }

  // 新添加信息


  .special-color {
    color: $l-color-primary;
  }

  .receipt-text {
    color: $l-color-primary;
  }

  .receipt-amount {
    font-weight: 700;
  }

  .table-title {
    margin: 20px 0 10px;
    font-weight: 700;
  }

  .first-title {
    margin-top: 0px;
  }

  .charge-bottom {
    padding: 20px;
    text-align: right;
    background: #fff;
    border-top: 1px solid $l-color-border-3;
    border-radius: 0 0 4px 4px;
  }

  .charge-top {
    line-height: 32px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: $l-color-primary1;
    color: #fff;

    /deep/ .el-checkbox__inner {
      border-color: #fff;
    }

    /deep/ .el-checkbox__label {
      color: #fff;
    }
  }

  .price-amt {
    text-align: right;
    line-height: 40px;
  }

  .align-center {
    text-align: center;
  }

  .align-right {
    text-align: right;
  }

  .cols {
    height: 100%;
    overflow-y: auto;

    /deep/ .collapse-transition {
      -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
      transition: 0s height, 0s padding-top, 0s padding-bottom;
    }

    /deep/ .horizontal-collapse-transition {
      -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
      transition: 0s width, 0s padding-left, 0s padding-right;
    }

    /deep/ .horizontal-collapse-transition .el-submenu__title .el-submenu__icon-arrow {
      -webkit-transition: 0s;
      transition: 0s;
      opacity: 0;
    }
  }

  .no-data {
    position: absolute;
    top: 25px;
    left: 20px;
    right: 20px;
    line-height: 30px;
    text-align: center;
  }

  .page {
    .pagination-container {
      padding: 20px 0;

      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }

  .margin-top-10 {
    margin-top: 10px;
  }

  .over-txt {
    padding-left: 10px;

    .el-col,
    .el-radio {
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
    }

    .el-radio {
      width: 100%;
    }
  }

  .margin-right20 {
    margin-right: 20px;
  }

  .row-h {
    /deep/ .el-col {
      height: 40px;
    }
  }

  .source-tit {
    display: inline-block;
    width: 115px;
  }
</style>
