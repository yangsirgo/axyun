<template>
  <el-container style="background: #fff">
    <el-main>
      <!--基本form-->
      <el-form
        label-position="right"
        label-width="100px"
        class="edit-form"
        ref="formElem"
        :rules="rules"
        :model="form"
      >
        <el-row>
          <!--上边-->
          <el-row class="top">
            <el-col :span="10" style="margin-top: 9px">
              <el-radio v-model="radio" label="1">实名制</el-radio>
              <el-radio v-model="radio" label="0">非实名</el-radio>
            </el-col>
          </el-row>

          <!--左边-->
          <el-col :span="12" style="padding-right: 20px">
            <div class="grid-content bg-purple">

              <!--个人信息-->
              <el-row>
                <div class="form-title">
                  <div>个人信息</div>
                  <div class="head-before"></div>
                </div>

                <el-row>
                  <el-col :span="5">
                    <div class="header-img"></div>
                  </el-col>
                  <el-col :span="19">
                    <el-row>
                      <el-col :span="9">
                        <el-form-item label="姓名">
                          <el-input class="inputWidth" v-model="form.basicInformation.patientName"
                                    placeholder="姓名"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="9">
                        <el-form-item label="真实姓名">
                          <el-input class="inputWidth" v-model="form.basicInformation.patientFullName"
                                    placeholder="真实姓名"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="性别" label-width="80px">
                          <el-select class="width100" v-model="form.basicInformation.patientGender" placeholder="请选择">
                            <el-option
                              label="男"
                              value="1">
                            </el-option>
                            <el-option
                              label="女"
                              value="0">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="9">
                        <el-form-item label="出生日期" label-width="80px">
                          <el-date-picker
                            class="width100"
                            v-model="form.basicInformation.birthDate"
                            type="date"
                            placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="9">
                        <el-form-item label="时间" label-width="80px">
                          <el-time-select
                            class="width100"
                            v-model="form.basicInformation.time"
                            :picker-options="{
                           start: '08:30',
                           step: '00:15',
                           end: '18:30'
                      }"
                            placeholder="选择时间">
                          </el-time-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="年龄" label-width="80px">
                          <el-input class="width100" v-model="form.basicInformation.age" placeholder="22"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="7">
                    <el-form-item label="籍贯" label-width="80px">
                      <el-select v-model="form.basicInformation.nativePlaceCode" placeholder="请选择">
                        <el-option
                          label="天津"
                          value="1">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="民族" label-width="80px">
                      <el-select v-model="form.basicInformation.nationCode" placeholder="请选择">
                        <el-option
                          label="汉族"
                          value="1">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="婚姻" label-width="80px">
                      <el-select v-model="form.basicInformation.maritalStatus" placeholder="请选择">
                        <el-option
                          label="未婚"
                          value="0">
                        </el-option>
                        <el-option
                          label="已婚"
                          value="1">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="5">
                    <el-form-item label="血型" label-width="80px">
                      <el-select class="width100" v-model="form.basicInformation.bloodType" placeholder="请选择">
                        <el-option
                          label="A"
                          value="A">
                        </el-option>
                        <el-option
                          label="B"
                          value="B">
                        </el-option>
                        <el-option
                          label="AB"
                          value="AB">
                        </el-option>
                        <el-option
                          label="O"
                          value="O">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-row>

                <el-row>
                  <el-col :span="7">
                    <el-form-item label="职业" label-width="80px">
                      <el-select class="width100" v-model="form.basicInformation.careerCode" placeholder="请选择">
                        <el-option
                          label="天津"
                          value="111">
                        </el-option>
                        <el-option
                          label="北京"
                          value="123">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="17">
                    <el-form-item label="证件" label-width="80px">
                      <el-input class="inputWidth" placeholder="请输入" v-model="form.basicInformation.identificationNum">
                        <template slot="prepend">身份证</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>

              <!--监护人-->
              <el-row>
                <div class="form-title">
                  <div>监护人信息</div>
                  <div class="head-before"></div>
                </div>
                <div v-for="(item,index) in form.guardianInformation" :key="index">
                  <el-row>
                    <el-col :span="9">
                      <el-form-item label="监护人" label-width="80px">
                        <el-input class="width100" placeholder="请输入"
                                  v-model="item.guardian"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="15">
                      <el-form-item label="证件" label-width="80px">
                        <el-input class="width100" placeholder="请输入" v-model="item.guardianCardId">
                          <template slot="prepend">身份证</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="联系地址" label-width="80px">
                        <el-input class="width100" v-model="item.guardianAddress"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="详细地址" label-width="80px">
                        <el-input class="width100" v-model="item.guardianDetailAddress"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="邮编" label-width="80px">
                        <el-input class="width100" v-model="item.guardianPostCode"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
                </div>

              </el-row>

              <!--联系人-->
              <el-row>
                <el-row>
                  <div class="form-title">
                    <div>联系人</div>
                    <div class="head-before"></div>
                  </div>
                </el-row>

                <div v-for="(item,index) in form.contactForm" :key="index">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="联系人" label-width="80px">
                        <el-input class="width100" v-model="item.contactName" autocomplete="off"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="关系" label-width="80px">
                        <el-select class="width100" v-model="item.relation" placeholder="请选择">
                          <el-option
                            label="父女"
                            value="1">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="联系电话" label-width="80px">
                        <el-input class="width100" v-model="item.contactTel" autocomplete="off"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-button @click="delContact(index)">删除</el-button>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <div class="get-detail-button" @click="addContact">添加联系人</div>
                </el-row>


              </el-row>
              <!--备注信息-->
              <el-row>
                <div class="form-title">
                  <div>备注信息</div>
                  <div class="head-before"></div>
                </div>
                <el-row>
                  <el-form-item label="备注" label-width="80px">
                    <el-input
                      type="textarea"
                      class="width100"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入"
                      v-model="form.basicInformation.note">
                    </el-input>
                  </el-form-item>
                </el-row>

              </el-row>
            </div>
          </el-col>
          <!--右边-->
          <el-col :span="12" style="padding-left: 20px">
            <div class="grid-content bg-purple-light">
              <!--联系信息-->
              <el-row>
                <div class="form-title">
                  <div>联系信息</div>
                  <div class="head-before"></div>
                </div>
                <el-row>
                  <el-col :span="9">
                    <el-form-item label="联系方式" label-width="80px">
                      <el-input class="width100" v-model="form.basicInformation.mobileNum" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="邮箱" label-width="80px">
                      <el-input class="width100" v-model="form.basicInformation.email" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="联系地址" label-width="80px">
                      <el-input class="width100" v-model="form.basicInformation.contactAddress"
                                placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="详细地址" label-width="80px">
                      <el-input class="width100" v-model="form.basicInformation.detailAddress"
                                placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="邮编" label-width="80px">
                      <el-input class="width100" v-model="form.basicInformation.postCode" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-row>

              <el-row>
                <!--其他信息-->
                <el-col>
                  <el-row>
                    <div class="form-title">
                      <div>其他信息</div>
                      <div class="head-before"></div>
                    </div>
                  </el-row>
                  <el-row>
                    <!--<div v-for="(k,v) in moreList" :key="v">
                      <el-col :span="8">
                        <el-form-item :label="k.label" label-width="80px">
                          <el-select placeholder="请选择">
                            <el-option
                              v-for="(i,item) in k.value"
                              :key="i"
                              :label="item"
                              :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </div>-->

                  </el-row>
                  <el-col :span="8">
                    <el-form-item label="职退情况" label-width="80px">
                      <el-select v-model="form.moreForm.postBack" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['postBack']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="镇保计划" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.town" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['town']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="医疗项目" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.medicalPro" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['medicalPro']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="医保办法" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.healthCare" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['healthCare']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="外地病人" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.nonlocalPatient" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['nonlocalPatient']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="是否外籍" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.isForeign" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['isForeign']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="伤残情况" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.maim" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['maim']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="大病标识" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.seriousIllness" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['seriousIllness']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="病人分类" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.patientClassific" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['patientClassific']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="保健情况" label-width="80px">
                      <el-select class="width100" v-model="form.moreForm.healthFitness" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in moreList['healthFitness']"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-row>

              <!--担保人-->
              <el-row>
                <el-row>
                  <div class="form-title">
                    <div>添加担保人</div>
                    <div class="head-before"></div>
                  </div>
                </el-row>
                <div v-for="(item,index) in form.surety" :key="index">
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="担保人" label-width="80px">
                        <el-input class="width100" v-model="item.suretyName" autocomplete="off"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="身份证" label-width="80px">
                        <el-input class="width100" v-model="item.suretyCardId" autocomplete="off"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="关系" label-width="80px">
                        <el-select class="width100" v-model="item.suretyRelation" placeholder="请选择">
                          <el-option
                            label="父女"
                            value="1">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="联系电话" label-width="80px">
                        <el-input class="width100" v-model="item.suretyTel" autocomplete="off"
                                  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

                <el-row>
                  <div class="get-detail-button">读取身份信息</div>
                </el-row>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-form>

    </el-main>
    <el-footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </el-footer>
    <!--卡片信息-->
    <!-- <el-col>
       <el-row>
         <span class="form-title">卡片信息<el-button @click="creatCard" style="margin-left: 20px">新建</el-button></span>
       </el-row>
       <el-table
         :data="cardData"
         stripe
         border
         style="width: 100%">
         <el-table-column
           v-for="(item,index) in cardDataParams"
           :key="index"
           :prop="item.prop"
           :label="item.label"
           :min-width="item.width"
           class="overflow-point"
           header-align="center"
           :align="item.align || 'left'"
         >
           <template slot-scope="cardScope">
             <template v-if="item.prop == 'operate'">
               <span class="decoration" @click="cardBind" v-if="cardScope.row.status == 0">绑定</span>
               <span class="decoration" @click="cardUnbind" v-if="cardScope.row.status == 1">解绑</span>
             </template>
             <template v-else-if="item.prop == 'status'">
               <span v-if="cardScope.row.status == 0">无效</span>
               <span v-if="cardScope.row.status == 1">有效</span>
             </template>
             <template v-else>
               <span>{{ cardScope.row[item.prop]}}</span>
             </template>
           </template>
         </el-table-column>
       </el-table>
     </el-col>-->
  </el-container>
</template>

<script>
    import {addArchive, getArchive} from '@/api/arch/arch.js';

    export default {
        name: "editFile",
        props: ['fileDisable'],
        data() {
            return {
                radio: '1',
                input: '',
                moreList: {
                    postBack: ['职退1', '职退2'],//职退
                    town: ['镇保1', '镇保2'],//镇保
                    medicalPro: ['医疗项目1', '医疗项目2'],//医疗项目
                    healthCare: ['医保办法1', '医保办法2'],//医保办法
                    nonlocalPatient: ['是', '否'],//外地病人
                    isForeign: ['是', '否'],//是否外籍
                    maim: ['是', '否'],//伤残情况
                    seriousIllness: ['大病标识1', '大病标识2'],//大病标识
                    patientClassific: ['病人分类1', '病人分类2'],//病人分类
                    healthFitness: ['保健情况1', '保健情况2']//保健情况
                },
                form: {
                    //基本信息
                    basicInformation: {
                        patientName: '',
                        patientFullName: '',
                        patientGender: '',//性别
                        birthDate: '',
                        time: '',//出生时间
                        age: '',
                        bloodType: 'O',//血型
                        maritalStatus: '',//婚姻
                        nativePlaceCode: '',
                        nationCode: '',//民族
                        careerCode: '',//职业
                        identificationNum: '',//身份证
                        mobileNum: '',//联系方式
                        email: '',//邮箱
                        postCode: '',//邮编
                        contactAddress: '',//联系地址
                        detailAddress: '',//详细地址
                        note: ''//备注
                    },
                    //监护人信息
                    guardianInformation: [{
                        guardian: '',//监护人姓名
                        guardianCardId: '',//监护人身份证
                        guardianAddress: '',//监护人联系地址
                        guardianDetailAddress: '',//监护人详细地址
                        guardianPostCode: ''//监护人邮编
                    }],
                    //联系人信息
                    contactForm: [
                        {
                            contactName: '',
                            relation: '',
                            contactTel: ''
                        }
                    ],
                    //担保人信息
                    surety: [{
                        suretyName: '',
                        suretyCardId: '',
                        suretyRelation: '',
                        suretyTel: ''
                    }],
                    //更多信息
                    moreForm: {
                        postBack: '',//职退情况
                        town: '',//镇保
                        medicalPro: '',//医疗项目
                        healthCare: '',//医保办法
                        nonlocalPatient: '',//外地病人
                        isForeign: '',//是否外籍
                        maim: '',//伤残情况
                        seriousIllness: '',//大病标识
                        patientClassific: '',//病人分类
                        healthFitness: ''//保健情况
                    }
                },
                cardDataParams: [
                    {
                        prop: "operate",
                        label: "操作",
                        align: "center",
                        width: "30"
                    },
                    {
                        prop: "cardNum",
                        label: "卡号",
                        align: "center",
                        width: "30"
                    }, {
                        prop: "cardType",
                        label: "卡类型",
                        align: "center",
                        width: "80"
                    }, {
                        prop: "clearingForm",
                        label: "结算方式",
                        align: "center",
                        width: "80"
                    },
                    {
                        prop: "validity",
                        label: "有效期至",
                        align: "center",
                        width: "120"
                    },
                    {
                        prop: "status",
                        label: "状态",
                        align: "center",
                        width: "80"
                    }
                ],
                cardData: [
                    {
                        cardNum: '1201520',
                        cardType: '院内就诊卡',
                        clearingForm: '本地自费',
                        validity: '2020-12-20',
                        status: 0
                    },
                    {
                        cardNum: '1201520',
                        cardType: '院内就诊卡',
                        clearingForm: '本地自费',
                        validity: '2020-12-20',
                        status: 1
                    }
                ],//卡片表格
                rules: {
                    name: [
                        {required: true, message: "请输入姓名", trigger: "blur"},
                        {max: 50, message: "姓名不能超过50个汉字", trigger: "blur"}
                    ],
                    gender: [{required: true, message: "请选择性别", trigger: "blur"}],
                    idNo: [
                        {required: true, message: "请输入身份证号", trigger: "blur"}
                    ]
                },
                cardDisable: false
            }
        },
        created() {
            getArchive(this.$route.query.id).then(res => {
                if (res.code === 1) {
                    let res_data = res.data;
                    this.form.basicInformation["dataVersion"] = res_data.archInfo.dataVersion;
                    this.form.basicInformation["patientNum"] = res_data.archInfo.patientNum;
                    this.form.basicInformation.patientName = res_data.archInfo.patientName;
                    this.form.basicInformation.patientFullName = res_data.archInfo.patientFullName;
                    this.form.basicInformation.patientGender = res_data.archInfo.patientGender;
                    this.form.basicInformation.birthDate = res_data.archInfo.birthDate;
                    this.form.basicInformation.time = res_data.archInfo.birthTime;
                    this.form.basicInformation.age = res_data.archInfo.patientAge;
                    this.form.basicInformation.bloodType = res_data.archInfo.bloodType;
                    this.form.basicInformation.maritalStatus = res_data.archInfo.maritalStatus;
                    this.form.basicInformation.nativePlaceCode = res_data.archInfo.nativePlaceCode;
                    this.form.basicInformation.nationCode = res_data.archInfo.nationCode;
                    this.form.basicInformation.careerCode = res_data.archInfo.careerCode;
                    this.form.basicInformation.identificationNum = res_data.archInfo.identificationNum;
                    this.form.basicInformation.mobileNum = res_data.archInfo.mobileNum;
                    this.form.basicInformation.email = res_data.archInfo.email;
                    this.form.basicInformation.postCode = res_data.archInfo.postCode;
                    this.form.basicInformation.contactAddress = res_data.archInfo.contactAddress;
                    this.form.basicInformation.detailAddress = res_data.archInfo.detailAddress;
                    this.form.basicInformation.note = res_data.archInfo.remarks;
                    this.radio = res_data.archInfo.realNameStatus;
                    if (res_data.archAddrList.length > 0) {
                        this.form.basicInformation["addr_dataVersion"] = res_data.archAddrList[0].dataVersion;
                        this.form.basicInformation["addrId"] = res_data.archAddrList[0].id;
                        this.form.basicInformation.postCode = res_data.archAddrList[0].postCode;
                        this.form.basicInformation.contactAddress = res_data.archAddrList[0].contactAddress;
                        this.form.basicInformation.detailAddress = res_data.archAddrList[0].detailAddr;

                    }
                    if (res_data.archGuarantorList.length > 0) {
                        this.form.surety[0] = {
                            "patientNum": res_data.archInfo.patientNum,
                            "id": res_data.archGuarantorList[0].id,
                            "dataVersion": res_data.archGuarantorList[0].dataVersion,
                            suretyName: res_data.archGuarantorList[0].guarantorName,
                            suretyCardId: res_data.archGuarantorList[0].guarantorIdentificationNum,
                            suretyRelation: res_data.archGuarantorList[0].guaranteeRelation,
                            suretyTel: res_data.archGuarantorList[0].guarantorPhone
                        }
                    }


                    if (res_data.archFiduciaryList.length > 0) {
                        this.form.guardianInformation[0] = {
                            "patientNum": res_data.archInfo.patientNum,
                            "id": res_data.archFiduciaryList[0].id,
                            "dataVersion": res_data.archAddrList[0].dataVersion,
                            guardian: res_data.archFiduciaryList[0].fiduciaryName,//监护人姓名
                            guardianCardId: res_data.archFiduciaryList[0].identityNumber,//监护人身份证
                            guardianAddress: res_data.archFiduciaryList[0].contactAddress,//监护人联系地址
                            guardianDetailAddress: res_data.archFiduciaryList[0].address,//监护人详细地址
                            guardianPostCode: res_data.archFiduciaryList[0].zipCode//监护人邮编
                        }
                    }


                    if (res_data.archContactList.length > 0) {

                        var contactForm = [];
                        res_data.archContactList.forEach(function (item) {
                            contactForm.push({
                                "patientNum": res_data.archInfo.patientNum,
                                "id": item.id,
                                "dataVersion": item.dataVersion,
                                contactName: item.contactName,
                                relation: item.relation,
                                contactTel: item.contactTel
                            });
                        });
                        this.form.contactForm=contactForm;


                    }


                    var self = this;
                    if (res_data.archExtendList.length > 0) {

                        res_data.archExtendList.forEach(function (item) {

                            self.form.moreForm[item.extendAttr] = item.extendValue;
                            self.form.moreForm["id"] = item.id;
                            self.form.moreForm["patientNum"] = item.patientNum;
                        });
                    }

                } else {
                    this.$message('获取档案失败')
                }
            })
        },
        methods: {
            /*添加联系人*/
            addContact() {
                var contactForm = [...this.form.contactForm];
                contactForm.push({
                    contactName: '',
                    relation: '',
                    contactTel: ''
                });
                this.form.contactForm = contactForm;
            },
            /*删除联系人*/
            delContact(index) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var contactForm = [...this.form.contactForm];
                    this.$delete(contactForm, index);
                    this.form.contactForm = contactForm;

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /*新建卡片*/
            creatCard() {
                this.cardDisable = true;
            },
            /*卡片解绑*/
            cardUnbind() {
                this.$confirm('解除绑定后，此卡将不能使用，你还要继续吗？', '解除绑定', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    /*卡片绑定接口？*/
                    this.$message({
                        type: 'success',
                        // 获取卡号进行信息提示？
                        message: '【卡号：00100】解绑成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消解绑'
                    });
                });
            },
            /*卡片绑定*/
            cardBind() {
                this.$confirm('恢复此卡前，请先对其他卡解除绑定', '恢复绑定', {
                    confirmButtonText: '我知道了',
                    // cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    /*卡片解绑接口？*/
                    this.$message({
                        type: 'success',
                        // 获取卡号进行信息提示？
                        message: '【卡号：00100】恢复绑定成功!'
                    });
                }).catch(() => {
                    /*this.$message({
              type: 'info',
              message: '已取消解绑'
            });*/
                });
            },
            changeCardDisable(data) {
                this.cardDisable = data;
            },
            cardSave(data) {
                let cardData = [...this.cardData];
                cardData.push(data);
                this.cardData = cardData;
                this.cardDisable = false;
            },
            cancel() {
                // this.$emit('changeFileDisable', false);
                this.$router.push('/files');
            },
            confirm() { /*保存档案信息*/
                let archiveData = {};

                /* 地址*/
                if (this.form.basicInformation.detailAddress != '' || this.form.basicInformation.contactAddress != '' || this.form.basicInformation.postCode != '') {
                    archiveData["archAddrList"] = [];
                    archiveData.archAddrList[0] = {
                        "detailAddr": this.form.basicInformation.detailAddress,
                        'contactAddress': this.form.basicInformation.contactAddress,
                        "postCode": this.form.basicInformation.postCode,
                        "id": this.form.basicInformation["addrId"],
                        "patientNum": this.form.basicInformation.patientNum,
                        "dataVersion": this.form.basicInformation["addr_dataVersion"]
                    }
                }

                /* 担保人*/
                archiveData["archGuarantorList"] = [];
                archiveData.archGuarantorList[0] = {
                    "guarantorPhone": this.form.surety[0].suretyTel,
                    "guarantorName": this.form.surety[0].suretyName,
                    "guarantorIdentificationNum": this.form.surety[0].suretyCardId,
                    "guaranteeRelation": this.form.surety[0].suretyRelation,
                    "id": this.form.surety[0]["id"],
                    "dataVersion": this.form.surety[0]["dataVersion"],
                    "patientNum": this.form.basicInformation.patientNum
                }

                archiveData["archExtendList"] = [];
                for (let key in this.moreList) {
                    archiveData["archExtendList"].push({
                        "extendValue": this.form.moreForm[key],
                        "extendAttr": key,
                        "id": key.id,
                        "patientNum": this.form.basicInformation.patientNum
                    });


                }


                /* 联系人*/
                let archContactList = [];
                this.form.contactForm.forEach(function (item) {
                    if (item.contactName != '' || item.contactTel != '' || item.relation != '') {
                        archContactList.push({
                            "contactName": item.contactName,
                            "contactTel": item.contactTel,
                            "relation": item.relation,
                            "id": item["id"],
                            "patientNum": item.patientNum,
                            "dataVersion": item["dataVersion"]
                        });
                    }
                });
                if (archContactList.length > 0) {
                    archiveData["archContactList"] = archContactList;
                }
                let archFiduciaryData = {
                    "fiduciaryName": this.form.guardianInformation[0].guardian,
                    "identityNumber": this.form.guardianInformation[0].guardianCardId,
                    "contactAddress": this.form.guardianInformation[0].guardianAddress,
                    "zipCode": this.form.guardianInformation[0].guardianPostCode,
                    "address": this.form.guardianInformation[0].guardianDetailAddress,
                    "id": this.form.guardianInformation[0]["id"],
                    "patientNum": this.form.basicInformation.patientNum,
                    "dataVersion": this.form.guardianInformation[0]["dataVersion"]
                };
                if (archFiduciaryData != {}) {
                    if (this.form.guardianInformation[0].guardian != '') {
                        archiveData["archFiduciaryList"] = [archFiduciaryData];

                    }


                }


                /* 患者基本信息*/
                archiveData["archInfo"] = {
                    "dataVersion": this.form.basicInformation["dataVersion"],
                    "email": this.form.basicInformation.email,
                    "appCode": "",
                    "appType": "",
                    "birthDate": this.form.basicInformation.birthDate,
                    "birthTime": this.form.basicInformation.time,
                    "careerCode": this.form.basicInformation.careerCode,
                    "enableType": '',
                    "firstCategory": '',
                    "firstDiagTime": '',
                    "guarantorEnable": '0',
                    "idNumEnable": '0',
                    "identificationNum": this.form.basicInformation.identificationNum,
                    "identificationType": '', /*todo 证件类型来源*/
                    "lastCategory": '', /*todo 末次诊疗类型*/
                    "lastDate": '',/*todo 末次诊疗时间*/
                    "maritalStatus": this.form.basicInformation.maritalStatus,
                    "mobileNum": this.form.basicInformation.mobileNum,
                    "namePy": '',/*todo 后台处理*/
                    "nameWb": '',/*todo 后台处理*/
                    "nationCode": this.form.basicInformation.nationCode,
                    "nationalityCode": '',//国籍代码  this.form.nationCode,
                    "nativePlaceCode": this.form.basicInformation.nativePlaceCode,
                    "otherPhoneNum": '',
                    "patientFullName": this.form.basicInformation.patientFullName,
                    "patientGender": this.form.basicInformation.patientGender,
                    "patientName": this.form.basicInformation.patientName,
                    "patientNum": this.form.basicInformation.patientNum,
                    "patientType": '', /*todo 病人类型是什么*/
                    "pauseReason": '',
                    "phoneNumEnable": '0',
                    "relationStatus": "1",
                    "settlementCompanyCode": '',
                    "settlementType": '',
                    "siTypeCode": '',
                    "smsCaptcha": '',
                    "remarks": this.form.basicInformation.note,
                    "bloodType": this.form.basicInformation.bloodType,
                    "realNameStatus":this.radio

                }

                addArchive(archiveData).then(res => {
                    if (res.code === 1) {
                        this.$message('建档成功')
                        this.$router.push('/files');
                    } else {
                        this.$message('建档失败')
                    }
                })
            },
          /*年龄计算*/
          getAge(str) {
            if (str) {
              var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
              if (r == null) {
                return false;
              }
              var d = new Date(r[1], r[3] - 1, r[4]);
              if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
                var Y = new Date().getFullYear();
                var M = new Date().getMonth();
                var D = new Date().getDate();
                var T = new Date().getTime();
                // debugger
                if (Math.ceil((T - d.getTime()) / 86400000) <= 28) {
                  return Math.ceil((T - d.getTime()) / 86400000) + '天';
                }
                if (M + 1 < r[3]) {
                  if (Y - r[1] - 1 > 3) {
                    return Y - r[1] - 1 + '岁';
                  }
                  return Y - r[1] - 1 + '岁' + (M + 13 - r[3]) + '个月';

                }
                if (Y - r[1] - 1 > 3) {
                  return Y - r[1] + '岁';
                }
                return Y - r[1] + '岁' + (M + 1 - r[3]) + '个月';

              }
              return '';
            }
            return ('');
          },
          /*切割字符串*/
          strSplit(data, sym) {
            if (data) {
              let str = data.split(sym)[0];
              return str;
            }
            return "";
          }
        }


    }
</script>

<style lang="scss" scoped>
  .edit-form .el-row{
    height: auto;
  }
  .header-img {
    width: 100%;
    height: 150px;
    border: 1px solid #ccc;
  }

  .decoration {
    text-decoration: underline;
  }

  .form-title {
    font-size: 16px;
    font-weight: bold;
    display: block;
    padding: 5px;
    margin-bottom: 10px;
    position: relative;

    .head-before {
      width: 4px;
      height: 20px;
      background: $l-color-primary;
      position: absolute;
      left: -10px;
      top: 0;
    }
  }

  .width100 {
    width: 100% !important;
  }

  .top {
    height: 78px;
    padding: 20px;
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
  }

  .get-detail-button {
    width: 100%;
    height: 36px;
    border-radius: 2px;
    border: 1px solid rgba(207, 207, 207, 1);
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: rgba(61, 125, 251, 1);
    line-height: 36px;
  }

</style>
