<template>
  <div class="container height100" v-loading="loading">
    <div class="reg-form">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-position="left" label-width="0" class="demo-ruleForm">
        <div class="patient-box clearfix">
          <div class="patient-info">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="patientName">
                  <l-formt-title label="患者姓名" :required="true" :disabled="status =='1'">
                    <el-input placeholder v-model="ruleForm.patientName" :disabled="status =='1'"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <LFormtTitle label="证件类型" :disabled="status =='1'">
                  <el-form-item prop="identificationType">
                    <l-value-domain
                      :disabled="status =='1'"
                      :code="selectCode.identificationType"
                      :value.sync="ruleForm.identificationType"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key17"
                      @change="identifiBlur"
                    ></l-value-domain>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="identificationNum">
                  <l-formt-title label="证件号码" :disabled="status =='1'">
                    <el-input placeholder="请填写有效证件号码" :disabled="status =='1'"  v-model="ruleForm.identificationNum"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin: 8px 0">
              <el-form-item prop="guardianEnable" :disabled="status =='1'">
                <el-checkbox v-model="ruleForm.guardianEnable" :disabled="status =='1'">儿童无身份证需填监护人信息</el-checkbox>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="guardianName" >
                  <l-formt-title  label="监护人姓名" :disabled="!ruleForm.guardianName || status =='1'">
                    <el-input  placeholder v-model="ruleForm.guardianName" :disabled="!ruleForm.guardianEnable || status =='1'"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <LFormtTitle label="监护人证件类型" :disabled="!ruleForm.guardianEnable  || status =='1'">
                  <el-form-item prop="guardianIdentificationType">
                    <l-value-domain
                      :disabled="!ruleForm.guardianEnable  || status =='1'"
                      :code="selectCode.identificationType"
                      :value.sync="ruleForm.guardianIdentificationType"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key17"
                      @change="identifiBlur"
                    ></l-value-domain>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="guardianIdentificationNum">
                  <l-formt-title label="监护人证件号码" :disabled="!ruleForm.guardianEnable  || status =='1'">
                    <el-input :disabled="!ruleForm.guardianEnable  || status =='1'" placeholder="请填写有效证件号码"  v-model="ruleForm.guardianIdentificationNum"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="temperature">
                  <l-formt-title label="患者体温" :required="true" :disabled="status =='1'">
                    <el-input placeholder :disabled="status =='1'" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" v-model="ruleForm.temperature"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="mobileNum">
                  <l-formt-title label="患者手机号" required :disabled="status =='1'">
                    <el-input placeholder="请填写联系电话" :disabled="status =='1'" oninput="value=value.replace(/[^\d]/g,'')" v-model="ruleForm.mobileNum"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="currentAddress">
                  <l-formt-title label="居住住址" :required="true" :disabled="status =='1'">
                    <l-value-domain type="cascader" :disabled="status =='1'" code="AdministrativDivision" :value.sync="ruleForm.currentAddress" class="select-container"
                      remoteValueKey="id" remoteShowKey="label" :multiple="false" :relation="true" :placeholder="$t('base.placeholder')"
                      key="key3"></l-value-domain>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="currentDetail">
                  <l-formt-title label="详细住址" required :disabled="status =='1'">
                    <el-input placeholder="请填写详细住址" :disabled="status =='1'" v-model="ruleForm.currentDetail"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item class="required" prop="haveBeen"  >
                  <span>1.21天内您或共同居住的家属有到过以下地方吗？</span>
                  <el-checkbox-group v-model="ruleForm.haveBeen" style="display:inline-block" :disabled="status =='1'">
                    <el-checkbox v-for="item in haveBeenArea" :key="item.id" :label="item.id"  @change="(r,o)=>handleChange(r,o, ruleForm.haveBeen)">{{item.name}}</el-checkbox>
                    <el-checkbox  :label="0"  @change="(r,o)=>handleChange(r,o, ruleForm.haveBeen)">没有</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item prop="offshoreAddress" >
                  <l-formt-title  label="境外(具体国家/地区名称):" :disabled="status =='1'">
                    <el-input  v-model="ruleForm.offshoreAddress" :disabled="status =='1'"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item prop="onshoreAddress" >
                  <l-formt-title label="国内高、中风险地区(具体地区名称):" :disabled="status =='1'">
                    <el-input  v-model="ruleForm.onshoreAddress" :disabled="status =='1'"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item class="required" prop="haveRisk" >
                  <span>2.21天内您或共同居住的家属接触过境外或高中风险地区的发热或有呼吸道症状的患者吗？</span>
                  <el-checkbox-group v-model="ruleForm.haveRisk" style="display:inline-block" :disabled="status =='1'">
                    <el-checkbox :label="1"   @change="(r,o)=>handleChange(r,o, ruleForm.haveRisk)">有</el-checkbox>
                    <el-checkbox  :label="0"  @change="(r,o)=>handleChange(r,o, ruleForm.haveRisk)">没有</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item class="required" prop="haveFever"  >
                  <span>3.21天内您周边是否出现2例以上发热或（和）呼吸道症状的病例（如家庭、办公室、学校等场所）？</span>
                  <el-checkbox-group v-model="ruleForm.haveFever" style="display:inline-block" :disabled="status =='1'">
                    <el-checkbox :label="1"   @change="(r,o)=>handleChange(r,o, ruleForm.haveFever)">有</el-checkbox>
                    <el-checkbox  :label="0"  @change="(r,o)=>handleChange(r,o, ruleForm.haveFever)">没有</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item class="required" prop="haveDisease"  >
                  <span>4.21天内您是否出现以下症状？</span>
                  <el-checkbox-group v-model="ruleForm.haveDisease" style="display:inline-block" :disabled="status =='1'">
                    <el-checkbox v-for="item in haveSymptoms" :key="item.id"  :label="item.id" @change="(r,o)=>handleChange(r,o, ruleForm.haveDisease,3)">{{item.name}}</el-checkbox>
                    <el-checkbox  :label="0"  @change="(r,o)=>handleChange(r,o, ruleForm.haveDisease,3)">没有</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item class="required" prop="havePatients"  >
                  <span>5.21天内您或共同居住的家属接触过以下患者吗？</span>
                  <el-checkbox-group v-model="ruleForm.havePatients" style="display:inline-block" :disabled="status =='1'">
                    <el-checkbox v-for="item in havePatientsList" :key="item.id"  :label="item.id" @change="(r,o)=>handleChange(r,o, ruleForm.havePatients)">{{item.name}}</el-checkbox>
                    <el-checkbox  :label="0"  @change="(r,o)=>handleChange(r,o, ruleForm.havePatients)">没有</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="登记时间" disabled>
                    <span>{{!time?dateFormat(defaultTime):time }}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="登记机构" disabled>
                    <span>{{hosName}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="登记人姓名" disabled>
                    <span>{{userName}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="entryMobileNum">
                  <l-formt-title label="登记人手机" :disabled="status =='1'">
                    <el-input oninput="value=value.replace(/[^\d]/g,'')" :disabled="status =='1'" v-model="ruleForm.entryMobileNum"></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="数据来源" disabled>
                    <span>{{ source?source:'社康' }}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="状态" disabled>
                    <span>{{!status?'':status=='1'?'提交':'暂存'}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="exception">
                 <LFormtTitle label="是否异常" disabled
                  ><el-select disabled  v-model="ruleForm.exception"><el-option
                    v-for="item in ifUnusualList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option></el-select></LFormtTitle
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="提交机构" disabled>
                    <span>{{submitOrg}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="提交人" disabled>
                    <span>{{submitPersonName}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="提交时间" disabled>
                    <span>{{submitPersonTime}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="最后修改机构" disabled>
                    <span>{{hosName}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="最后修改时间" disabled>
                    <span>{{dateFormat(defaultTime)}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item >
                  <l-formt-title label="最后提交人" disabled>
                    <span>{{userName}}</span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div class="handler-box">
      <el-button  type="primary" @click="submitForm('ruleForm')" v-if="status!='1'">提交</el-button>
      <el-button  type="" @click="save" v-if="status!='1'">暂存</el-button>
      <el-button  type="" @click.native="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>

import { saveTemperature,getTemperatureDetail } from "@/api/ipnw/temperatureMeasure.js";
import Base64 from "@/utils/base64";

  export default {
    components: {

    },
    props: {
      baokaData: String
    },
    data() {
      return {
        remoteParams: {
          pageSize: 10
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        defaultTime:new Date(),
        status:'',
        time:'',
        ruleForm: {
          dataSource:'1',
          identificationType:"1",
          identificationNum:'',
          guardianName:'',
          patientName:'',
          guardianEnable:false,
          guardianIdentificationNum:'',
          guardianIdentificationType:'',
          temperature:'',
          mobileNum:'',
          haveBeen:[],
          offshoreAddress:'',
          onshoreAddress:'',
          haveRisk:[],
          haveFever:[],
          haveDisease:[],
          havePatients:[],
          entryMobileNum:'',
          currentAddress: [], // 现住址
          currentDetail: "",
          exception:'',

        },
        //l-value-domin组件code码
        selectCode: {
          countryCode: "WORLD_REGIONAL_NAME_CODE", //国家
          patientGender: "GENDER_CODE", // 性别
          identificationType: "MARK_TYPE_CODE", //卡类型
          bloodType: "BLOOD_TYPE_CODE", //血型
          maritalStatus: "MARITAL_STATUS_CODE",
          nativePlaceCode: "AdministrativDivision",
          nationCode: "NATIONAL_NAME_CODE",
          domicile: "AdministrativDivision",
          address: "AdministrativDivision",
          careerCode: "OCCUPATIONAL_CLASSIFICATION_CODE",
          // settlementType: 'MEDICAL_INSURANCE_CODE',
          settlementType: "settlementType",
          settlementCompany: "settlementCompany",
          socialSecurity: "socialSecurity",
          bookbuildingType: "bookbuildingType",
          cardAssociated: "clinictype",
          fileLoading: "ARCH_STATUS",
          type: "contactType",
          relationShip: "RELATION_CODE"
        },
        ifUnusualList:[
          {
            value: '1',
            label: '是'
          },
          {
            value: '0',
            label: '否'
          }
        ],
        haveBeenArea:[{
          id:1,
          name:'境外'
        },{
          id:2,
          name:'国内高、中风险地区'
        },{
          id:3,
          name:'其他有病例报告的社区'
        },],
        haveSymptoms:[{
          id:1,
          name:'发热'
        },{
          id:2,
          name:'咳嗽'
        },{
          id:3,
          name:'腹泻'
        },{
          id:4,
          name:'咽痛'
        },{
          id:5,
          name:'呼吸困难'
        },{
          id:6,
          name:'味觉减退（丧失）'
        },{
          id:7,
          name:'嗅觉减退（丧失）'
        }],
        havePatientsList:[{
          id:1,
          name:'确诊病例'
        },{
          id:2,
          name:'疑似病例'
        },{
          id:3,
          name:'无症状感染者'
        }],
        rules: {
          patientName: [{
            required: true,
            message: "请填写患者姓名",
            trigger: ["blur", "change"]
          }],
          /*paperwork: [{
              pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
              message: "身份证格式错误",
              trigger: ["blur", "change"]
            },
            {
              required: true,
              message: "请填写有效身份证号码",
              trigger: ["blur", "change"]
            }
          ],*/
          mobileNum: [
            {
              pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,
              message: "手机号码格式错误",
              trigger: ["blur", "change"]
            },
            {
              required: true,
              message: "请填写患者手机号",
              trigger: ["blur", "change"]
            }
          ],
          entryMobileNum: [
            {
              pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,
              message: "手机号码格式错误",
              trigger: ["blur", "change"]
            }
          ],
          temperature: [
            {
              required: true,
              message: "请填写患者体温",
              trigger: ["blur", "change"]
            }
          ],
          currentAddress: [{
            required: true,
            message: "请选择现住址",
            trigger: ["change"]
          }],
          currentDetail: [{
            required: true,
            message: "请填写详细地址",
            trigger: ["blur", "change"]
          }],

        },
        loading: false,
        userName:'',
        hosName:'',
        dataSource:'',
        source:'',
        submitPersonName:'',
        submitPersonTime:'',
        submitOrg:'',
      };
    },
    computed: {

    },
    created() {
      this.init()
    },
    methods: {
      init(){
        this.hosName = JSON.parse(
          localStorage.getItem("pamars")
        ).hosName;
        this.userName = Base64.decode(localStorage.getItem("userName"))

        if(this.baokaData){
          this.search()
        }
      },

      //
      dateFormat(time) {
        var date=new Date(time);
        var year=date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        // 拼接
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
      },
      //暂存
      async save() {
        if (!this.ruleForm.patientName) {
          this.$message({message:'患者姓名',type:'error',customClass:'new_z_index'})
          return false;
        }
        try {
          this.loading = true;
          let param = {
            ...this.ruleForm
          };
          param.guardianEnable = this.ruleForm.guardianEnable == false ? '0' : '1'
          param.status = '0'
          if(this.baokaData){
            param.id = this.baokaData
          }
          let res = await saveTemperature(param);
          if (res.code === 1) {
            this.$message.success("保存成功");
            // this.$parent.dialogVisibleBK = false;
            this.$emit("submitBK");
          }
          this.loading = false;

        } catch (error) {
        } finally {
          this.loading = false;
        }
      },

      //查看
      async search() {
        try {
          this.loading = true;
          let res = await getTemperatureDetail(this.baokaData);
          if (res.code === 1) {
            this.ruleForm.patientName = res.data.patientName
            this.ruleForm.onshoreAddress = res.data.onshoreAddress
            this.ruleForm.offshoreAddress = res.data.offshoreAddress
            this.ruleForm.temperature = res.data.temperature
            this.ruleForm.mobileNum = res.data.mobileNum
            this.ruleForm.identificationType = res.data.identificationType
            this.ruleForm.identificationNum = res.data.identificationNum
            this.ruleForm.dataVersion = res.data.dataVersion
            this.ruleForm.currentAddress = res.data.currentAddress
            this.ruleForm.currentDetail = res.data.currentDetail
            this.ruleForm.haveBeen = res.data.haveBeen
            this.ruleForm.haveDisease = res.data.haveDisease
            this.ruleForm.haveFever = res.data.haveFever
            this.ruleForm.havePatients = res.data.havePatients
            this.ruleForm.haveRisk = res.data.haveRisk
            this.status = res.data.status
            this.ruleForm.exception = res.data.exception
            this.ruleForm.guardianEnable = res.data.guardianEnable == '1'? true:false
            this.ruleForm.guardianIdentificationNum = res.data.guardianIdentificationNum
            this.ruleForm.guardianName = res.data.guardianName
            this.ruleForm.guardianIdentificationType = res.data.guardianIdentificationType
            this.ruleForm.entryMobileNum = res.data.entryMobileNum
            this.hosName = res.data.hosNm
            this.userName = res.data.entryPersonName
            this.time =  res.data.entryTime
            this.source = res.data.dataSource == '1'?'社康':'社康APP'
            if(res.data.status == '1'){
              this.submitPersonName = res.data.submitPersonName
              this.submitPersonTime = res.data.submitPersonTime
              this.submitOrg = res.data.hosNm
            }
          }
        } catch (error) {
        } finally {
          this.loading = false;
        }
      },
      //互斥
      handleChange(r,o,list,type){
        if(r == true){
          if(o.target.defaultValue == 0){
            list.length = 0
            list.push(0)
            if(!type){
              if(!this.ruleForm.haveFever.includes(1) && (!this.ruleForm.havePatients.includes(1) && !this.ruleForm.havePatients.includes(2) && !this.ruleForm.havePatients.includes(3) ) &&
                !this.ruleForm.haveRisk.includes(1) &&  (!this.ruleForm.haveBeen.includes(1) && !this.ruleForm.haveBeen.includes(2) && !this.ruleForm.haveBeen.includes(3))
              ){
                this.ruleForm.exception = '0'
              }

            }
          }else{
            let n = list.indexOf(0)
            if(n > -1){
              list.splice(n,1)
            }
            if(!type){
              this.ruleForm.exception  = '1'
            }
          }
        }
      },
      // 取消
      cancel() {
        this.$emit("cancelstyle", false);
      },
      //身份证号码校验
      identifiBlur() {

      },
      getPamars() {
        const Pamars = "pamars";
        return localStorage.getItem(Pamars);
      },


      //提交
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let testStr = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            if ((!this.ruleForm.identificationNum &&  !this.ruleForm.guardianEnable)  ||
              (this.ruleForm.guardianEnable && (!this.ruleForm.guardianName || !this.ruleForm.guardianIdentificationNum || !this.ruleForm.guardianIdentificationType ) )
            ) {
              this.$message({message:'请输入证件号码；如勾选儿童身份证需要填写完整监护人信息！',type:'error',customClass:'new_z_index'})
              return false;
            }
            if (
              this.ruleForm.identificationType == "1" &&
              this.ruleForm.identificationNum
            )  {
              if (!testStr.test(this.ruleForm.identificationNum)) {
                this.$message({message:'身份证号码格式不正确',type:'error',customClass:'new_z_index'})
                return false;
              }
            }

            if (
              this.ruleForm.guardianIdentificationType == "1" &&
              this.ruleForm.guardianIdentificationNum
            )  {
              if (!testStr.test(this.ruleForm.guardianIdentificationNum)) {
                this.$message({message:'监护人身份证号码格式不正确',type:'error',customClass:'new_z_index'})
                return false;
              }
            }
            if (this.ruleForm.haveBeen.length == '0') {
              this.$message.error("请选择问题1.21天内您或共同居住的家属有到过以下地方吗？");
              return false;
            }
            if (this.ruleForm.haveRisk.length == '0') {
              this.$message.error("请选择问题2.1天内您或共同居住的家属接触过境外或高中风险地区的发热或有呼吸道症状的患者吗？");
              return false;
            }
            if (this.ruleForm.haveFever.length == '0') {
              this.$message.error("请选择问题3.21天内您周边是否出现2例以上发热或（和）呼吸道症状的病例（如家庭、办公室、学校等场所）？");
              return false;
            }
            if (this.ruleForm.haveDisease.length == '0') {
              this.$message.error("请选择问题4.21天内您是否出现以下症状？");
              return false;
            }
            if (this.ruleForm.havePatients.length == '0') {
              this.$message.error("请选择问题5.21天内您或共同居住的家属接触过以下患者吗？");
              return false;
            }
            this.loading = true;
            let param = {
              ...this.ruleForm,
              status:'1'
            };
            param.guardianEnable = this.ruleForm.guardianEnable == false ? '0' : '1'

            if(this.baokaData){
              param.id = this.baokaData
            }
            let res = await saveTemperature(param);
            if (res.code == 1) {
              this.$message.success("保存成功");
              // this.$parent.dialogVisibleBK = false;
              this.$emit("submitBK");
            }
            this.loading = false;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      diagNameChange(val, item) {

        this.ruleForm.diagName = item.dictionaryName;
        this.ruleForm.icd10Encoding = item.icd10Encoding;
      },

    },
    watch: {

      baokaData: {
        //深度监听,可监听到对象、数组的变化
        handler(val) {
           this.$refs["ruleForm"].resetFields();
          this.init()
        },
        deep: true
      }
    }
  };
</script>


<style lang="scss" scoped>
  .container {
    background-color: #fff;
  }

  .reg-form {
    height: calc(100% - 77px);
    padding: 0 20px;
    overflow: hidden;
    overflow-y: auto;
  }

  /deep/ .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before {
    content: "";
    margin-right: 0;
  }

  .handler-box {
    padding: 20px;
    border-top: 1px solid $l-color-bgcolor-11;
    text-align: right;
    margin-right: 50px;
  }

  .patient-box {
    margin-bottom: 15px;
  }

  .patient-photo {
    img {
      width: 120px;
      height: 120px;
    }
  }

  .patient-info {
    padding-top: 20px;
    overflow: hidden;
  }

  .demo-ruleForm {
    padding-right: 60px;

    /deep/ .el-form-item__content {
      line-height: 36px;
      // margin-bottom: 20px;
    }
  }

  .add-contacts {
    line-height: 36px;
    color: $l-color-fontcolor-2;
    border: 1px dashed $l-color-bgcolor-11;
    cursor: pointer;
    text-align: center;
    margin-bottom: 20px;
  }

  .contacts-box {
    position: relative;
  }

  .remove-contact {
    position: absolute;
    right: -66px;
    top: 0;
  }

  .age-box {
    .el-input {
      width: 30px;
      margin-right: 10px;

      /deep/ .el-input__inner {
        padding: 0 5px;
      }
    }

    .age-item {
      display: inline-block;
    }
  }

  .contain {
    width: 100%;
    padding: 0 20px;

    .dialog-header {
      width: 100%;
      margin-bottom: 30px;

      .detail {
        margin-top: 20px;
        margin-bottom: 18px;

        .title {
          height: 24px;
          margin-bottom: 20px;
          font-size: 16px;

          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          line-height: 24px;

          span {
            display: inline-block;
            min-width: 35px;
            margin-right: 10px;
          }
        }

        .detail-cont {
          width: 100%;
          height: 20px;
          margin-bottom: 20px;

          .detail-cont-item {
            width: 30%;
            height: 20px;
            font-size: 14px;

            font-weight: 400;
            color: rgba(148, 157, 163, 1);
            line-height: 20px;
            float: left;

            i {
              margin-left: 10px;
              font-style: normal;
              color: rgba(46, 50, 58, 1);
            }
          }

          .balance-sum {
            i {
              height: 14px;
              font-size: 14px;

              font-weight: bold;
              color: $l-color-primary;
              line-height: 18px;
            }
          }
        }
      }

      .rechargeMethod {
        .title {
          height: 24px;
          margin-bottom: 15px;
          font-size: 16px;

          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          line-height: 24px;
        }

        .sum {
          width: 100%;
          height: 76px;
          padding: 20px;
          background: $l-color-bgcolor-18;
          border-radius: 2px;
        }

        .radio-item {
          height: 48px;
          padding: 0 20px;
          border-radius: 2px;
          border: 1px solid $l-color-bgcolor-11;
          line-height: 48px;

          .balance {
            font-style: normal;
            font-size: $l-font-size;

            font-weight: 400;
            color: $l-color-fontcolor-4;
          }

          .el-radio__label {
            display: none;
          }
        }
      }
    }
  }

  .required {
    span:after {
      content: "*";
      width: 7px;
      height: 14px;
      font-size: 14px;

      padding-left: 5px;
      vertical-align: middle;
      font-weight: bolder;
      color: rgba(239, 15, 15, 1);
    }
  }

  /deep/ .el-dialog__footer {
    /*height: 36px;*/
    padding: 20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
  }

  .ft0 {
    /deep/ .el-radio__label {
      font-size: 0;
    }
  }

  /deep/ .l-input-wrap {
    display: block;
  }
  /deep/.l-input-body-main>span{
    margin-left: 10px;
  }
  /deep/.new_z_index {
    z-index:9000 !important;
  }
</style>
