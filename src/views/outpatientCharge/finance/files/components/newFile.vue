<template>
  <div ref="page" class="contain width100 height100">
    <el-card style="background: #fff">
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
          <!--上边-->
          <el-row class="top">
            <el-col :span="10" style="margin-top: 9px">
              <el-radio v-model="radio" label="1">实名制</el-radio>
              <el-radio v-model="radio" label="0">非实名</el-radio>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!--左边-->
            <el-col :span="12" style="padding-right: 20px">
              <div class="grid-content bg-purple">
                <!--个人信息-->
                <el-row style="margin-bottom: 20px">
                  <div class="form-title">
                    <l-card-title>
                      <template slot="left">个人信息</template>
                    </l-card-title>
                  </div>
                  <div style="margin-left: 14px">
                    <el-row :gutter="10">
                      <el-col :span="3">
                        <div class="header-img"></div>
                      </el-col>
                      <el-col :span="21">
                        <el-row :gutter="10">
                          <el-col style="margin-bottom: 10px" :span="9">
                            <LFormtTitle label="姓名" labelWidth="48" style="width:100%">
                              <el-form-item label="" label-width="" prop="patientName">
                                <el-input v-model="form.basicInformation.patientName"
                                          style="line-height: 34px;width:100%"
                                          placeholder="请输入">
                                </el-input>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col style="margin-bottom: 10px" :span="9">
                            <LFormtTitle label="真实姓名" labelWidth="76" style="width:100%">
                              <el-form-item label="" label-width="" prop="patientFullName">
                                <el-input v-model="form.basicInformation.patientFullName"
                                          style="line-height: 34px;width:100%"
                                          placeholder="请输入">
                                </el-input>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col style="margin-bottom: 10px" :span="6">
                            <LFormtTitle label="性别" labelWidth="48" style="width:100%">
                              <el-form-item label="" label-width="" prop="patientGender">
                                <el-select v-model="form.basicInformation.patientGender"
                                           style="line-height: 34px;width:100%"
                                           placeholder="请选择">
                                  <el-option label="男" value="1"></el-option>
                                  <el-option label="女" value="0"></el-option>
                                </el-select>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                        </el-row>

                        <el-row :gutter="10">
                          <el-col style="margin-bottom: 10px" :span="9">
                            <LFormtTitle label="出生日期" labelWidth="76" style="width:100%">
                              <el-form-item label="" label-width="" prop="birthDate">
                                <el-date-picker
                                  v-model="form.basicInformation.birthDate"
                                  type="date"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请选择">
                                </el-date-picker>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col style="margin-bottom: 10px" :span="9">
                            <LFormtTitle label="时间" labelWidth="48" style="width:100%">
                              <el-form-item label="" label-width="" prop="time">
                                <el-time-select
                                  v-model="form.basicInformation.time"
                                  :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30'
                                  }"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请选择">
                                </el-time-select>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col style="margin-bottom: 10px" :span="6">
                            <LFormtTitle label="年龄" labelWidth="48" style="width:100%">
                              <el-form-item label="" label-width="" prop="age">
                                <el-input v-model="form.basicInformation.age"
                                          style="line-height: 34px;width:100%"
                                          placeholder="请输入">
                                </el-input>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                        </el-row>

                      </el-col>
                    </el-row>

                    <el-row :gutter="10">
                      <el-col :span="7" style="margin-bottom: 10px">
                        <LFormtTitle label="籍贯" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="" prop="nativePlaceCode">
                            <el-select v-model="form.basicInformation.nativePlaceCode"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                label="天津"
                                value="1">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>

                      <el-col :span="6">
                        <LFormtTitle label="民族" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="" prop="nationCode">
                            <el-select v-model="form.basicInformation.nationCode"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                label="汉族"
                                value="1">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>

                      <el-col :span="6">
                        <LFormtTitle label="婚姻" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="" prop="maritalStatus">
                            <el-select v-model="form.basicInformation.maritalStatus"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
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
                        </LFormtTitle>
                      </el-col>

                      <el-col :span="5">
                        <LFormtTitle label="血型" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="" prop="bloodType">
                            <el-select v-model="form.basicInformation.bloodType"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
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
                        </LFormtTitle>
                      </el-col>

                    </el-row>

                    <el-row :gutter="10">
                      <el-col :span="7">
                        <LFormtTitle label="职业" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="" prop="careerCode">
                            <el-input v-model="form.basicInformation.careerCode"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="17">
                        <LFormtTitle label="证件" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="" prop="identificationNum">
                            <el-input v-model="form.basicInformation.identificationNum"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                  </div>
                </el-row>
                <!--监护人-->
                <el-row style="margin-bottom: 20px">
                  <div class="form-title">
                    <l-card-title>
                      <template slot="left">监护人信息</template>
                    </l-card-title>
                  </div>
                  <div v-for="(item,index) in form.guardianInformation" :key="index">
                    <el-row style="margin-bottom: 10px" :gutter="10">
                      <el-col :span="9">
                        <LFormtTitle label="监护人" labelWidth="62" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.guardian"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="15">
                        <LFormtTitle label="证件" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.guardianCardId"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <LFormtTitle label="联系地址" labelWidth="76" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.guardianAddress"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="7">
                        <LFormtTitle label="详细地址" labelWidth="76" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.guardianDetailAddress"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="5">
                        <LFormtTitle label="邮编" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.guardianPostCode"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                  </div>

                </el-row>
                <!--联系人-->
                <el-row style="margin-bottom: 20px">
                  <el-row>
                    <div class="form-title">
                      <l-card-title>
                        <template slot="left">联系人</template>
                      </l-card-title>
                    </div>
                  </el-row>

                  <div v-for="(item,index) in form.contactForm" :key="index">
                    <el-row style="margin-bottom: 10px" :gutter="10">
                      <el-col :span="6">
                        <LFormtTitle label="联系人" labelWidth="62" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.contactName"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="6">
                        <LFormtTitle label="关系" labelWidth="48" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="item.relation"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
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
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="10">
                        <LFormtTitle label="联系电话" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.contactTel"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="2">
                        <el-button type="danger" icon="el-icon-delete" circle @click="delContact(index)"
                                   class="delete-button"></el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <el-row>
                    <el-col :span="22">
                      <div class="get-detail-button" @click="addContact">+ 添加联系人</div>
                    </el-col>
                  </el-row>


                </el-row>
                <!--备注信息-->
                <el-row style="margin-bottom: 20px">
                  <div class="form-title">
                    <l-card-title>
                      <template slot="left">备注信息</template>
                    </l-card-title>
                  </div>
                  <el-row>
                    <el-form-item label="" label-width="80px">
                      <el-input
                        type="textarea"
                        class="width100"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入备注内容"
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
                <el-row style="margin-bottom: 20px">
                  <div class="form-title">
                    <l-card-title>
                      <template slot="left">联系信息</template>
                    </l-card-title>
                  </div>
                  <el-row :gutter="10" style="margin-bottom: 10px">
                    <el-col :span="9">
                      <LFormtTitle label="联系方式" labelWidth="78" style="width:100%">
                        <el-form-item label="" label-width="" prop="mobileNum">
                          <el-input v-model="form.basicInformation.mobileNum"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="9">
                      <LFormtTitle label="邮箱" labelWidth="48" style="width:100%">
                        <el-form-item label="" label-width="" prop="email">
                          <el-input v-model="form.basicInformation.email"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>

                  </el-row>

                  <el-row :gutter="10">
                    <el-col :span="12">
                      <LFormtTitle label="联系地址" labelWidth="78" style="width:100%">
                        <el-form-item label="" label-width="" prop="contactAddress">
                          <el-input v-model="form.basicInformation.contactAddress"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="7">
                      <LFormtTitle label="详细地址" labelWidth="78" style="width:100%">
                        <el-form-item label="" label-width="" prop="detailAddress">
                          <el-input v-model="form.basicInformation.detailAddress"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="5">
                      <LFormtTitle label="邮编" labelWidth="48" style="width:100%">
                        <el-form-item label="" label-width="" prop="postCode">
                          <el-input v-model="form.basicInformation.postCode"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>

                </el-row>
                <!--其他信息-->
                <el-row style="margin-bottom: 20px">
                  <!--其他信息-->
                  <el-col>
                    <el-row>
                      <div class="form-title">
                        <l-card-title>
                          <template slot="left">其他信息</template>
                        </l-card-title>
                      </div>
                    </el-row>
                    <el-row>

                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 10px">
                      <el-col :span="8">
                        <LFormtTitle label="职退情况" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.postBack"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['postBack']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="镇保计划" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.town"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['town']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="医疗项目" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.medicalPro"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['medicalPro']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 10px">
                      <el-col :span="8">
                        <LFormtTitle label="医保办法" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.healthCare"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['healthCare']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="外地病人" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.nonlocalPatient"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['nonlocalPatient']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="是否外籍" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.isForeign"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['isForeign']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 10px">
                      <el-col :span="8">
                        <LFormtTitle label="伤残情况" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.maim"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['maim']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="大病标识" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.seriousIllness"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['seriousIllness']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="病人分类" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.patientClassific"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['patientClassific']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 10px">
                      <el-col :span="8">
                        <LFormtTitle label="保健情况" labelWidth="78" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="form.moreForm.healthFitness"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请选择">
                              <el-option
                                v-for="(item,index) in moreList['healthFitness']"
                                :key="index"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>

                  </el-col>
                </el-row>
                <!--担保人-->
                <el-row :gutter="10" style="margin-bottom: 20px">
                  <el-row>
                    <div class="form-title">
                      <l-card-title>
                        <template slot="left">添加担保人</template>
                      </l-card-title>
                    </div>
                  </el-row>
                  <div v-for="(item,index) in form.surety" :key="index">
                    <el-row :gutter="10" style="margin-bottom: 10px">
                      <el-col :span="10">
                        <LFormtTitle label="担保人" labelWidth="62" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.suretyName"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="14">
                        <LFormtTitle label="身份证" labelWidth="62" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.suretyCardId"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 10px">
                      <el-col :span="10">
                        <LFormtTitle label="关系" labelWidth="62" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-select v-model="item.suretyRelation"
                                       style="line-height: 34px;width:100%"
                                       placeholder="请输入">
                              <el-option
                                label="父女"
                                value="1">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="14">
                        <LFormtTitle label="联系电话" labelWidth="62" style="width:100%">
                          <el-form-item label="" label-width="">
                            <el-input v-model="item.suretyTel"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                  </div>

                  <el-row>
                    <div class="get-detail-button"><i class="iconfont iconduka"></i> 读取身份证信息</div>
                  </el-row>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-form>

      </el-main>
      <el-footer class="button-cont clearfix">
        <el-button class="button plain-button" @click="cancel">取消</el-button>
        <el-button class="button" type="primary" @click="confirm">确认</el-button>
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
    </el-card>
  </div>
</template>

<script>
  import adHeight from "@/mixins/adHeight";
  import {addArchive} from '@/api/arch/arch.js';

  export default {
    name: "newFile",
    mixins: [adHeight],
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
            bloodType: '',//血型
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
      confirm() {
        /*保存档案信息*/
        let archiveData = {};
        /* 卡*/
        archiveData["archCardList"] = [];
        console.log(this.$route.query.cardCode);

        archiveData.archCardList[0] = {
          "cardData": this.$route.query.cardCode
        };

        /* 地址*/


        if (this.form.basicInformation.detailAddress != '' || this.form.basicInformation.contactAddress != '' || this.form.basicInformation.postCode != '') {
          archiveData["archAddrList"] = [];
          archiveData.archAddrList[0] = {
            "detailAddr": this.form.basicInformation.detailAddress,
            'contactAddress': this.form.basicInformation.contactAddress,
            "postCode": this.form.basicInformation.postCode
          }
        }

        /* 担保人*/
        archiveData["archGuarantorList"] = [];

        if (this.form.surety[0].suretyName != '') {

          archiveData.archGuarantorList[0] = {
            "guarantorPhone": this.form.surety[0].suretyTel,
            "guarantorName": this.form.surety[0].suretyName,
            "guarantorIdentificationNum": this.form.surety[0].suretyCardId,
            "guaranteeRelation": this.form.surety[0].suretyRelation
          }
        }


        archiveData["archExtendList"] = [];
        for (let key in this.moreList) {
          archiveData["archExtendList"].push({
            "extendValue": this.form.moreForm[key],
            "extendAttr": key
          });


        }


        /* 联系人*/
        let archContactList = [];
        this.form.contactForm.forEach(function (item) {
          if (item.contactName != '' || item.contactTel != '' || item.relation != '') {
            archContactList.push({
              "contactName": item.contactName,
              "contactTel": item.contactTel,
              "relation": item.relation
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
          "address": this.form.guardianInformation[0].guardianDetailAddress
        };
        if (archFiduciaryData != {}) {
          if (this.form.guardianInformation[0].guardian != '') {
            archiveData["archFiduciaryList"] = [archFiduciaryData];

          }


        }


        /* 患者基本信息*/
        archiveData["archInfo"] = {
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
          "nationCode": this.form.nationCode,
          "nationalityCode": '',//国籍代码  this.form.nationCode,
          "nativePlaceCode": this.form.basicInformation.nativePlaceCode,
          "otherPhoneNum": '',
          "patientFullName": this.form.basicInformation.patientFullName,
          "patientGender": this.form.basicInformation.patientGender,
          "patientName": this.form.basicInformation.patientName,
          "patientType": '', /*todo 病人类型是什么*/
          "pauseReason": '',
          "phoneNumEnable": '0',
          "relationStatus": "1",
          "settlementCompanyCode": '',
          "settlementType": '',
          "siTypeCode": '',
          "smsCaptcha": '',
          "bloodType": this.form.basicInformation.bloodType,
          "remarks": this.form.basicInformation.note,
          "realNameStatus": this.radio

        }

        addArchive(archiveData).then(res => {
          if (res.code === 1) {
            this.$message('建档成功')
            this.$router.push('/files');
          } else {
            this.$message('建档失败')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .contain {
    .el-form-item__content {
      margin-left: 0 !important;
    }

    .el-form-item {
      margin-bottom: 0 !important;
    }

    .edit-form .el-row {
      height: auto;
    }

    .header-img {
      width: 100%;
      margin-bottom: 10px;
      height: 120px;
      border: 1px solid #ccc;
    }

    .decoration {
      text-decoration: underline;
    }


    .top {
      height: 78px !important;
      padding: 20px;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
    }

    .get-detail-button {
      width: 100%;
      height: 36px;
      border-radius: 2px;
      border: 1px dashed rgba(207, 207, 207, 1);
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(61, 125, 251, 1);
      line-height: 36px;
    }

    .button-cont {
      margin-top: 100px;
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;
      .button{
        width: 80px;
        height: 36px;
        margin: 0 0 20px 10px;
        float: right;
      }
      .plain-button {
        width: 80px;
        height: 36px;
        background: $l-color-white;
        border-radius: 2px;
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-primary;
        border: 1px solid $l-color-primary;
      }
    }
  }


</style>
