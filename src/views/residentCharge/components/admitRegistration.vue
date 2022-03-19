<template>
  <div class="admitRegistration">
    <div class="top width100">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="searchData" placeholder="请读取医保卡、身份证、就诊卡">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" class="duka-button"><i class="iconfont iconduka"></i>读卡</el-button>
        </el-col>
        <el-col :span="13">
          <el-button class="plain-button float-right" style="margin-left: 10px" @click="noConstRetreat">无费退院</el-button>
          <el-button class="plain-button float-right" @click="chargePreMoney">交押金</el-button>
        </el-col>
      </el-row>
    </div>
    <el-form ref="pendingPatient" :model="pendingPatient" :rules="rules">
      <div class="patient-info">
        <l-card-title>
          <template slot="left">患者信息</template>
        </l-card-title>
        <div class="patient-info-cont">
          <div class="clearfix">
            <div class="header-img float-left">
              <img src="" alt="">
            </div>
            <div class="right-info float-left">
              <el-row :gutter="10" style="margin-bottom: 10px">
                <el-col :span="5">
                  <LFormtTitle label="姓名" labelWidth="48">
                    <el-form-item label="" label-width="" prop="patientName">
                      <el-input v-model="pendingPatient.patientName" style="line-height: 34px;width:100%"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="性别" labelWidth="48">
                    <el-form-item label="" label-width="" prop="patientGender">
                      <el-select v-model="pendingPatient.patientGender" style="line-height: 34px;">
                        <el-option label="男" value="0"></el-option>
                        <el-option label="女" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="年龄" labelWidth="48">
                    <el-form-item label="" label-width="" prop="patientAge">
                      <el-input v-model="pendingPatient.patientAge" style="line-height: 34px;width:100%"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="出生日期" labelWidth="76">
                    <el-form-item label="" label-width="" prop="birth">
                      <el-date-picker
                        v-model="pendingPatient.birth"
                        type="date"
                        placeholder=""
                        style="line-height: 34px;width:100%">
                      </el-date-picker>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-bottom: 10px">
                <el-col :span="5">
                  <LFormtTitle label="婚姻" labelWidth="48">
                    <el-form-item label="" label-width="" prop="maritalStatus">
                      <el-select v-model="pendingPatient.maritalStatus" style="line-height: 34px;">
                        <el-option label="已婚" value="0"></el-option>
                        <el-option label="未婚" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="5">
                  <LFormtTitle label="血型" labelWidth="48">
                    <el-form-item label="" label-width="" prop="bloodType">
                      <el-select v-model="pendingPatient.bloodType" style="line-height: 34px;">
                        <el-option label="A" value="0"></el-option>
                        <el-option label="B" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="民族" labelWidth="48">
                    <el-form-item label="" label-width="" prop="nationCode">
                      <el-select v-model="pendingPatient.nationCode" style="line-height: 34px;">
                        <el-option label="A" value="0"></el-option>
                        <el-option label="B" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="职业" labelWidth="48">
                    <el-form-item label="" label-width="" prop="careerCode">
                      <el-input v-model="pendingPatient.careerCode" style="line-height: 34px;width:100%"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-row :gutter="10" style="margin: 10px 0 10px 0">
            <el-col :span="10">
             <!-- <LFormtTitle label="身份证" labelWidth="62">
                <el-form-item label="" label-width="" prop="identificationNum">
                  <el-input v-model="pendingPatient.identificationNum" style="line-height: 34px;width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>-->
              <LDoubleInput widthRatio="25%">
                <template slot="left">
                  <el-form-item label="" label-width="" prop="cardType">
                    <el-select v-model="pendingPatient.cardType" style="line-height: 34px;">
                      <el-option label="身份证" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template slot="right">
                  <el-form-item label="" label-width="" prop="identificationNum">
                    <el-input v-model="pendingPatient.identificationNum" style="line-height: 34px;"></el-input>
                  </el-form-item>
                </template>
              </LDoubleInput>
            </el-col>
            <el-col :span="7">
              <LFormtTitle label="联系方式" labelWidth="76">
                <el-form-item label="" label-width="" prop="mobileNum">
                  <el-input v-model="pendingPatient.mobileNum" style="line-height: 34px;width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="7">
              <LFormtTitle label="邮箱" labelWidth="48">
                <el-form-item label="" label-width="" prop="email">
                  <el-input v-model="pendingPatient.email" style="line-height: 34px;width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row>
            <LFormtTitle label="联系地址" labelWidth="48">
              <el-form-item label="" label-width="" prop="contactAddress">
                <el-input v-model="pendingPatient.contactAddress" style="line-height: 34px;width:100%"></el-input>
              </el-form-item>
            </LFormtTitle>
          </el-row>

        </div>
        <l-card-title>
          <template slot="left">联系人信息</template>
        </l-card-title>
        <div class="concat-info-cont">
          <el-row :gutter="10" class="clearfix"
                  style="margin-bottom: 10px"
                  v-for="(item,index) in pendingPatient.contactList"
                  :key="index">
            <el-col :span="7">
              <LDoubleInput widthRatio="30%">
                <template slot="left">
                  <el-form-item label="" label-width="" prop="contactType">
                    <el-select v-model="item.contactType" style="line-height: 34px;">
                      <el-option label="监护人" value="0"></el-option>
                      <el-option label="联系人" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template slot="right">
                  <el-form-item label="" label-width="" prop="contactName">
                    <el-input v-model="item.contactName" style="line-height: 34px;"></el-input>
                  </el-form-item>
                </template>
              </LDoubleInput>
            </el-col>
            <el-col :span="3">
              <LFormtTitle label="关系" labelWidth="48">
                <el-form-item label="" label-width="" prop="relation">
                  <el-select v-model="item.relation" style="line-height: 34px;">
                    <el-option label="父亲" value="0"></el-option>
                    <el-option label="母亲" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="联系方式" labelWidth="76">
                <el-form-item label="" label-width="" prop="contactPhone">
                  <el-input v-model="item.contactPhone" style="line-height: 34px;"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LDoubleInput widthRatio="30%">
                <template slot="left">
                  <el-form-item label="" label-width="" prop="cardType">
                    <el-select v-model="item.cardType" style="line-height: 34px;">
                      <el-option label="身份证" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template slot="right">
                  <el-form-item label="" label-width="" prop="contactIdentificationNum">
                    <el-input v-model="item.contactIdentificationNum" style="line-height: 34px;"></el-input>
                  </el-form-item>
                </template>
              </LDoubleInput>
            </el-col>
            <el-col :span="1" style="padding-top:10px">
              <span @click="contactDelete(index)">
                              <svg t="1568600180299" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                   xmlns="http://www.w3.org/2000/svg" p-id="8251" width="18" height="18"><path
                                d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z" fill="#FFE3E2" p-id="8252"></path><path
                                d="M284.444444 455.111111h455.111112v113.777778H284.444444z" fill="#E1140A"
                                p-id="8253"></path></svg>

              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <div class="get-detail-button" @click="addContact">+ 添加联系人</div>
            </el-col>
          </el-row>
        </div>
        <l-card-title>
          <template slot="left">患者就诊信息</template>
        </l-card-title>
        <div class="visit-info-cont">
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="7">
              <LFormtTitle label="住院号" labelWidth="62">
                <el-form-item label="" label-width="" prop="patientCode">
                  <el-input v-model="pendingPatient.patientCode"
                            style="line-height: 34px;"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="病案号" labelWidth="62">
                <el-form-item label="" label-width="" prop="nedRecNo">
                  <el-input v-model="pendingPatient.nedRecNo"
                            style="line-height: 34px;"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="患者类型" labelWidth="76">
                <el-form-item label="" label-width="" prop="patientType">
                  <el-select v-model="pendingPatient.patientType" style="line-height: 34px;">
                    <el-option label="自费" value="0"></el-option>
                    <el-option label="医保" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="在院状态" labelWidth="76">
                <el-form-item label="" label-width="" prop="inpatientStatus">
                  <el-select v-model="pendingPatient.inpatientStatus" style="line-height: 34px;">
                    <el-option label="财务入院" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="7">
              <LFormtTitle label="在院次数" labelWidth="76">
                <el-form-item label="" label-width="" prop="inpatientNum">
                  <el-input v-model="pendingPatient.inpatientNum" style="line-height: 34px;width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="科室" labelWidth="48">
                <el-form-item label="" label-width="" prop="depart">
                  <el-select v-model="pendingPatient.depart" style="line-height: 34px;">
                    <el-option label="泌尿科" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="病区" labelWidth="48">
                <el-form-item label="" label-width="" prop="inpatientWard">
                  <el-select v-model="pendingPatient.inpatientWard" style="line-height: 34px;">
                    <el-option label="病区一" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="床号" labelWidth="48">
                <el-form-item label="" label-width="" prop="bedNum">
                  <el-select v-model="pendingPatient.bedNum" style="line-height: 34px;">
                    <el-option label="0" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 10px">
            <el-col :span="7">
              <LFormtTitle label="入院时间" labelWidth="76">
                <el-form-item label="" label-width="" prop="inDate">
                  <el-date-picker
                    v-model="pendingPatient.inDate"
                    type="datetime"
                    style="line-height: 34px;"
                    placeholder="">
                  </el-date-picker>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="入院病情" labelWidth="76">
                <el-form-item label="" label-width="" prop="inCondition">
                  <el-select v-model="pendingPatient.inCondition" style="line-height: 34px;">
                    <el-option label="有" value="0"></el-option>
                    <el-option label="无" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="入院医生" labelWidth="76">
                <el-form-item label="" label-width="" prop="doctor">
                  <el-select v-model="pendingPatient.doctor" style="line-height: 34px;">
                    <el-option label="" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="入院诊断" labelWidth="76">
                <el-form-item label="" label-width="" prop="finAdmissionDiagnosis">
                  <el-input v-model="pendingPatient.finAdmissionDiagnosis"
                            style="line-height: 34px;width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-bottom: 30px">
            <el-col :span="7">
              <LFormtTitle label="入院途径" labelWidth="76">
                <el-form-item label="" label-width="" prop="admissionMode">
                  <el-select v-model="pendingPatient.admissionMode" style="line-height: 34px;">
                    <el-option label="" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="是否绿色通道" labelWidth="104">
                <el-form-item label="" label-width="" prop="greenChannel">
                  <el-select v-model="pendingPatient.greenChannel" style="line-height: 34px;">
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="11">
              <LFormtTitle label="备注" labelWidth="48">
                <el-form-item label="" label-width="" prop="note">
                  <el-input v-model="pendingPatient.note"
                            style="line-height: 34px;width:100%"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="buttons clearfix">
        <el-button class="plain-button float-right" style="margin-left: 10px" @click="reset">清屏</el-button>
        <el-button class="primary-button float-right" @click="register">完成登记</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "admitRegistration",
    props: ['isClose1'],
    data() {
      return {
        //查询条件
        searchData: '',
        //待入院患者列表
        pendingPatientList: [],
        //待入院患者总人数
        total: 0,
        //待入院患者（表单）
        pendingPatient: {},
        //校验规则
        rules: {
          patientName: [{required: true, message: '请输入姓名', trigger: 'blur'}],
          patientGender: [{required: true, message: '请选择性别', trigger: 'change'}],
          depart: [{required: true, message: '请选择科室', trigger: 'change'}],
          inpatientWard: [{required: true, message: '请选择病区', trigger: 'change'}],
          inCondition: [{required: true, message: '请选择入院病情', trigger: 'change'}],
          finAdmissionDiagnosis: [{required: true, message: '请输入入院诊断', trigger: 'blur'}],
          admissionMode: [{required: true, message: '请选择入院途径', trigger: 'change'}]
        }
      }
    },
    watch: {
      isClose1() {
        if (this.isClose1 == false) {
          this.reset();
        }
      }
    },
    created() {
      console.log(this.pendingPatient);
      if (this.pendingPatientList.length !== 1) {
        this.pendingPatient = {
          contactList: [{
            contactType: '',
            contactName: '',
            relation: '',
            contactPhone: '',
            contactIdentificationNum: ''
          }]
        }

      }
    },
    methods: {
      //获取待入院查询列表
      async getPendingPatientList() {
        this.$showLoading();
        try {
          //获取数据接口
          // let res = await getPendingPatientList({searchData,page:1,limit:10});
          //假数据填充
          let res = [{
            patientName: '夏立燕',
            patientGender: 0,
            patientAge: '63岁',
            depart: '泌尿外科',
            doctor: '',//入院医生
            birth: '1999-05-25',
            maritalStatus: '0',
            bloodType: '1',
            nationCode: '1',
            cardType: '1',
            identificationNum: '',
            mobileNum: '',
            email: '',
            contactAddress: '',
            //联系人列表
            contactList: [
              {
                contactType: '0',
                contactName: '李健',
                relation: '1',
                contactPhone: '15256987459',
                cardType: '1',
                contactIdentificationNum: '1569874585423657'
              },
              {
                contactType: '1',
                contactName: '李健',
                relation: '1',
                contactPhone: '15256987459',
                cardType: '1',
                contactIdentificationNum: '1569874585423657'
              }
            ],
            patientCode: '',//住院号
            nedRecNo: '',//病案号
            patientType: '',//患者类型
            inpatientStatus: '',//在院状态
            inpatientNum: '',//在院次数
            inpatientWard: '',//病区
            bedNum: '',//床号
            inDate: '2019-06-06', // 入院时间
            inCondition: '0', // 入院病情
            finAdmissionDiagnosis: '',//入院诊断
            admissionMode: '',//入院途径
            greenChannel: 1,//是否绿色通道
            note: ''//备注
          }];
          this.pendingPatientList = res;
          this.total = 1;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //搜索待入院查询列表
      search() {
        this.getPendingPatientList();
        if (this.pendingPatientList.length === 1 && this.total === 1) {
          //表单为有数据状态
          this.pendingPatient = {...this.pendingPatientList[0]};
        } else {
          //表单无数据
          this.pendingPatient = {};
        }
      },
      //删除联系人
      contactDelete(index) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let contactList = this.pendingPatient.contactList;
          this.$delete(contactList, index);
          this.pendingPatient.contactList = contactList;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /*添加联系人*/
      addContact() {
        let contactList = this.pendingPatient.contactList;
        contactList.push({
          contactType: '',
          contactName: '',
          relation: '',
          contactPhone: '',
          contactIdentificationNum: ''
        });
        this.pendingPatient.contactList = contactList;
      },
      //完成登记
      register() {
        this.$refs['pendingPatient'].validate((valid) => {
          if (valid) {
            this.$showLoading();
            try {
              //入院登记接口
              // let res = await register(this.pendingPatient);
              this.$hideLoading();
              if (this.pendingPatient.patientType == 1) {
                this.$emit('changeDialog', true, true, false);
              } else {
                this.reset();
                this.$emit('changeDialog', false, false, false);
              }
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "标准错误提示");
            }
          } else {
            this.$message.error("标准错误提示");
          }
        });
      },
      //清屏
      reset() {
        this.pendingPatient.contactList = [{
          contactType: '',
          contactName: '',
          relation: '',
          contactPhone: '',
          contactIdentificationNum: ''
        }];
        this.$refs['pendingPatient'].resetFields();
      },
      //交押金
      chargePreMoney() {
        this.$confirm('是否为患者缴纳预交金？', '', {
          cancelButtonText: '否',
          confirmButtonText: '是',
          type: 'warning'
        }).then(() => {
          this.$emit('changeDialog', false, false, true);
        });
      },
      //无费退院
      noConstRetreat() {
        this.$confirm('是否为该患者退院？', '', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
          //无费退院接口
          // await noConstRetreat();
          this.$emit('changeDialog', false, false, true);
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .admitRegistration {
    max-height: 700px;
    padding-bottom: 20px;
    overflow-y: auto;

    .top {
      padding: 20px;
      background: $l-color-bgcolor-14;
      border-radius: 2px;

      .duka-button {
        width: calc(100% - 40px);
        height: 38px;
        margin-left: 20px;
        border: none;
        border-radius: 2px;
        float: left;

        i {
          display: inline-block;
          margin-right: 10px;
        }
      }
    }

    .patient-info {
      padding: 20px;

      .patient-info-cont {
        margin: 0 30px 20px 14px;

        .header-img {
          width: 80px;
          height: 102px;
          margin-right: 10px;
          background: $l-color-bgcolor-14;
          border-radius: 2px;
          border: $l-color-bgcolor-11;
        }

        .right-info {
          width: calc(100% - 100px);
        }
      }

      .concat-info-cont {
        margin-bottom: 20px;

        .get-detail-button {
          height: 36px;
          border-radius: 2px;
          border: 1px dashed rgba(207, 207, 207, 1);
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: rgba(61, 125, 251, 1);
          line-height: 36px;
        }

      }
    }

    .buttons {
      padding: 20px 20px 0 0;
      border-top: 1px solid $l-color-bgcolor-11;
    }
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
</style>
