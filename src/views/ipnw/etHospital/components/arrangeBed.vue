<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      patientCardType="hospital"
      pageName="arrangeBed"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="entry" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card
          class="height100 padding20 position-relative"
          :style="{paddingTop: '0px', paddingBottom: baseInfo.finAdId ? '20px' : '20px'}"
          v-loading="isLoading"
        >
          <div class="height100">
            <div :style="{height: baseInfo.finAdId ? '100%' : '100%'}">
              <!-- <l-card-title>
                <span slot="left">床位分配</span>
              </l-card-title>-->
              <div class="bed-num-show">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <div class="bed-num-item">
                      <div class="bed-num-title">床位</div>
                      <div class="bed-num-box">
                        <el-row :gutter="5">
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.useStatus===''}"
                                  @click="searchBedList('useStatus',-1)"
                            >全院 {{bedAllNumber.allBed}}</span>
                          </el-col>
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.useStatus===1}"
                                  @click="searchBedList('useStatus',1)">在院 {{bedAllNumber.inBed}}</span>
                          </el-col>
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.useStatus===0}"
                                  @click="searchBedList('useStatus',0)">空床 {{bedAllNumber.nullBed}}</span>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div class="bed-num-item">
                      <div class="bed-num-title">病情</div>
                      <div class="bed-num-box">
                        <el-row :gutter="5">
                          <el-col :span="6">
                            <span class="spanItem" :class="{'spanActive':bedListParams.admissionSituation==='1'}"
                                  @click="searchBedList('admissionSituation','1')">危重 {{bedAllNumber.wzCount}}</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="spanItem" :class="{'spanActive':bedListParams.admissionSituation==='2'}"
                                  @click="searchBedList('admissionSituation','2')">急诊 {{bedAllNumber.jzCount}}</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="spanItem" :class="{'spanActive':bedListParams.admissionSituation==='3'}"
                                  @click="searchBedList('admissionSituation','3')">一般 {{bedAllNumber.ybCount}}</span>
                          </el-col>
                          <el-col :span="6">
                            <span class="spanItem" :class="{'spanActive':bedListParams.admissionSituation==='9'}"
                                  @click="searchBedList('admissionSituation','9')">其他 {{bedAllNumber.qtCount}}</span>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="bed-num-item">
                      <div class="bed-num-title">护理</div>
                      <div class="bed-num-box">
                        <el-row :gutter="5">
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.nursingLevel==='0'}"
                                  @click="searchBedList('nursingLevel','0')">特 {{bedAllNumber.level}}</span>
                          </el-col>
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.nursingLevel==='1'}"
                                  @click="searchBedList('nursingLevel','1')">Ⅰ {{bedAllNumber.level1}}</span>
                          </el-col>
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.nursingLevel==='2'}"
                                  @click="searchBedList('nursingLevel','2')">Ⅱ {{bedAllNumber.level2}}</span>
                          </el-col>
                          <!--<el-col :span="6">
                            <span class="spanItem" :class="{'spanActive':bedListParams.nursingLevel==='3'}"
                                  @click="searchBedList('nursingLevel','3')">Ⅲ {{bedAllNumber.level3}}</span>
                          </el-col>-->
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div class="bed-num-item">
                      <div class="bed-num-title">其它</div>
                      <div class="bed-num-box">
                        <el-row :gutter="5">
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.recordStatus==='7'}"
                                  @click="searchBedList('recordStatus','7')">出 {{bedAllNumber.outHospitalCount}}</span>
                          </el-col>
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.recordStatus==='1'}"
                                  @click="searchBedList('recordStatus','1')">转 {{bedAllNumber.qq}}</span>
                          </el-col>
                          <el-col :span="8">
                            <span class="spanItem" :class="{'spanActive':bedListParams.prepayBalance===-1}"
                                  @click="searchBedList('prepayBalance',-1)">欠 {{bedAllNumber.arrearageCount}}</span>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="list-card clearfix overflow-hidden" style="padding-top: 10px;">
                <el-col
                  class="float-left margin-left-20"
                  style="width: 287px;cursor:pointer"
                  v-for="(item, index) in bedList"
                  :key="index"
                >
                  <el-card
                    :class="(index == currentBed && currentBed !== '')?'list-card-item active':`list-card-item 1${index}`"
                    v-if="itemShow(item)"
                    @click.native="selected_bedInfoDetail(index,item)"
                  >
                    <span class="label" v-if="item.isNew">新入</span>
                    <span class="label" v-if="item.adNum==''">空床</span>
                    <span class="label" v-if="item.recordStatus=='7'">预出</span>
                    <div class="title clearfix">
                      <i class="item-color1">{{item.bedCode}}</i>床
                      <i class="item-color2">{{item.adNum}}</i>
                      <div class="float-right" v-if="!item.adNum" style="padding-right: 10px">
                        <el-button type="text" @click.stop="contractBed(item)">{{item.inpCode ? '撤销包床': '包床'}}
                        </el-button>
                      </div>
                    </div>
                    <template v-if="item.adNum!=''&&item.adNum">
                      <div class="info">
                        <span>
                          {{item.name}}
                          <i style="font-style: normal;margin-left: 15px">
                            <span :val="item.gender" code="GENDER_CODE" v-codeTransform></span>
                          </i>
                          <i style="font-style: normal;margin-left: 15px">{{item.age}}</i>
                        </span>
                        <span style="display: block;">
                          <i class="item-color">主治医生</i>
                          {{item.doctorName}}
                        </span>
                        <span>
                          <i class="item-color">诊断信息</i>
                          {{item.diagName}}
                        </span>
                      </div>
                      <div class="icons clearfix">
                        <span class="te float-left">
                          <span :val="item.nursingLevel" code="nursingLevelShort" v-codeTransform>-</span>
                        </span>
                        <span class="pushi float-left">
                          <span :val="item.dietType" code="food" v-codeTransform>-</span>
                        </span>
                        <span class="babyicon float-left" v-if="item.childrenNum > 0">
                          <i
                            class="iconfont iconyinger"
                            style="margin-right: 5px;"
                            v-for="i in item.childrenNum"
                            :key="i"
                          ></i>
                        </span>
                        <span class="button-icon float-right">
                          <el-button type="text" @click.stop="changeBed(item,index)">换床</el-button>
                        </span>
                      </div>
                    </template>
                  </el-card>
                </el-col>
              </div>
            </div>
            <el-dialog title="病人住院信息"
                       :visible.sync="dialogFormVisible"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       :before-close="handleClose"
                       width="960px"
            >
              <el-form class="pt-info" :model="form" :rules="rules" ref="ruleForm">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <span class="pt-info-key">住院号：</span>
                    {{baseInfo.inpCode || '-'}}
                  </el-col>
                  <el-col :span="8">
                    <span class="pt-info-key">入院时间：</span>
                    {{baseInfo.wdeptAdmissionTime || '-'}}
                  </el-col>
                  <el-col :span="8">
                    <span class="pt-info-key">费别：</span>
                    {{baseInfo.medicalType || '-'}}
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <span class="pt-info-key">姓名：</span>
                    {{baseInfo.patientName || '-'}}
                  </el-col>
                  <el-col :span="8">
                    <span class="pt-info-key">科室：</span>
                    {{role.deptName || '-'}}
                  </el-col>
                  <el-col :span="8">
                    <span class="pt-info-key">预缴金：</span>
                    {{baseInfo.selfPayPrepay || '0.00'}}
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <span class="pt-info-key">性别：</span>
                    <span :val="baseInfo.patientGender" code="GENDER_CODE" v-codeTransform>-</span>
                  </el-col>
                  <el-col :span="8">
                    <template v-if="!isChangeBed">
                      <span class="pt-info-key">床号：</span>
                      {{form.bedCode || '-'}}
                    </template>
                    <template v-else>
                      <!--<LFormtTitle label="床号">
                     <el-select v-model="form.bedId" placeholder="请选择" class="width100" style="line-height: 30px">
                       <el-option
                         v-for="item in bedList"
                         :key="item.bedId"
                         :label="item.bedCode"
                         :value="item.bedId"
                         :disabled="baseInfo.bedId==item.bedId">
                       </el-option>
                     </el-select>
                      </LFormtTitle>-->
                      <span class="pt-info-key">床号：</span>
                      <span class="pt-info-item">
                         <el-select v-model="form.bedId" placeholder="请选择" class="width100"
                                    style="line-height: 30px;width:100%">
                        <el-option
                          v-for="item in bedList"
                          :key="item.bedId"
                          :label="item.bedCode"
                          :value="item.bedId"
                          :disabled="baseInfo.bedId==item.bedId">
                        </el-option>
                      </el-select>
                      </span>
                    </template>
                  </el-col>
                  <el-col :span="8">
                    <span class="pt-info-key">总费用：</span>
                    {{baseInfo.freeSum || '0.00'}}
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <span class="pt-info-key">年龄：</span>
                    {{baseInfo.patientAge || '-'}}
                  </el-col>
                  <el-col :span="8">
                    <span class="pt-info-key">
                      <em class="pt-info-require">*</em>主管医生：
                    </span>
                    <span class="pt-info-item">
                      <el-form-item prop="manageDoctorId" class="manage-doc-form">
                        <el-select
                          v-model="form.manageDoctorId"
                          @change="changeDocInfo"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in doctorList"
                            :key="item.manageDoctorId"
                            :label="item.manageDoctorName"
                            :disabled="item.disabled"
                            :value="item.manageDoctorId"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </span>
                  </el-col>
                  <el-col :span="8"></el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <span class="pt-info-key">身份证号：</span>
                    {{baseInfo.identificationNum || '-'}}
                  </el-col>
                  <el-col :span="16">
                    <span class="pt-info-key">责任护士：</span>
                    <span class="pt-info-item">
                      <el-select
                        v-model="form.manageNurseId"
                        @change="changeNurInfo"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in nurseList"
                          :key="item.manageNurseId"
                          :label="item.manageNurseName"
                          :disabled="item.disabled"
                          :value="item.manageNurseId"
                        ></el-option>
                      </el-select>
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <span class="pt-info-key">联系电话：</span>
                    {{baseInfo.contactPhone || '-'}}
                  </el-col>
                  <el-col :span="16">
                    <span class="pt-info-key">护理等级：</span>
                    <span class="pt-info-item">
                      <l-value-domain
                        :code="selectCode.nursingLevel"
                        @change="changeNursingInfo"
                        :value.sync="form.nursingLevel"
                      ></l-value-domain>
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <span class="pt-info-key">联系人：</span>
                    {{baseInfo.contactName || '-'}}
                  </el-col>
                  <el-col :span="16">
                    <span class="pt-info-key">饮食：</span>
                    <span class="pt-info-item">
                      <l-value-domain
                        :code="selectCode.food"
                        @change="changeFoodInfo"
                        :value.sync="form.food"
                      ></l-value-domain>
                    </span>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-checkbox-group
                  style="display:inline-block;margin-right:30px;"
                  v-model="printCheck"
                >
                  <el-checkbox label="0">成人腕带</el-checkbox>
                  <el-checkbox label="1">儿童腕带</el-checkbox>
                  <el-checkbox label="2">床头卡</el-checkbox>
                </el-checkbox-group>
                <el-button @click="diaPrint">打印</el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button
                  type="primary"
                  @click="assingnConfirm('ruleForm')"
                  v-hotKey="{func:'func_submit',flag: 'isLoading'}"
                >保存
                </el-button>
              </div>
            </el-dialog>
            <el-dialog :title="contractBedMsg"
                       :visible.sync="contractBedVisible"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       :before-close="handleCloseContractBed"
                       width="960px"
            >
              <el-form class="pt-info" :model="contractBedForm" :rules="rulesContractBed" ref="ruleFormContractBed">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <span class="pt-info-key">目标患者：</span>
                    {{baseInfo.patientName || '-'}}
                  </el-col>
                  <el-col :span="6">
                    <span class="pt-info-key">床位：</span>
                    {{baseInfo.bedCode || '-'}}
                  </el-col>
                  <el-col :span="6">
                    <span class="pt-info-key">性别：</span>
                    <span :val="baseInfo.patientGender" code="GENDER_CODE" v-codeTransform>-</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="pt-info-key">年龄：</span>
                    {{baseInfo.patientAge || '-'}}
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <span class="pt-info-key">包床：</span>
                    {{contractBedItem.bedCode || '-'}}
                  </el-col>
                  <el-col :span="12">
                    <LFormtTitle label="包床时间">
                      <el-form-item prop="date">
                        <el-date-picker
                          v-model="contractBedForm.date"
                          style="line-height: 34px;width:100%;"
                          clearable
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="contractBedVisible = false">取消</el-button>
                <el-button
                  type="primary"
                  @click="contractBedConfirm"
                >确定
                </el-button>
              </div>
            </el-dialog>
            <div v-if="false" style="height: 40%;">
              <div class="box-bg">
                <h3 style="margin-top: 20px;">分配信息</h3>
                <el-form label-width="0px">
                  <div style="margin-top: 20px;height: 36px;">
                    <!-- <div class="float-left" style="width: 240px">
                  <el-form-item prop="bedId">
                    <l-formt-title label="选择床位">
                      <el-select v-model="form.bedId" @change="changeBed" placeholder="请选择">
                        <el-option
                          v-for="item in bedList"
                          :key="item.value"
                          :label="`${item.bedCode}床`"
                          :disabled="item.disabled"
                          :value="item.bedId"
                    >-->
                    <!--<div class="list-item">-->
                    <!--<div class="head">-->
                    <!--<span>{{item.code}}</span><span>{{item.doctor}}</span><span style="width: 34%;">{{item.nurse}}</span>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!-- </el-option>
                      </el-select>
                    </l-formt-title>
                  </el-form-item>
                    </div>-->
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <el-form-item prop="manageDoctorId">
                        <l-formt-title label="主治医生">
                          <el-select
                            v-model="form.manageDoctorId"
                            @change="changeDocInfo"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in doctorList"
                              :key="item.manageDoctorId"
                              :label="item.manageDoctorName"
                              :disabled="item.disabled"
                              :value="item.manageDoctorId"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <el-form-item prop="manageNurseId">
                        <l-formt-title label="主管护士">
                          <el-select
                            v-model="form.manageNurseId"
                            @change="changeNurInfo"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in nurseList"
                              :key="item.manageNurseId"
                              :label="item.manageNurseName"
                              :disabled="item.disabled"
                              :value="item.manageNurseId"
                            ></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <!--<el-form-item prop="food">
                        <l-formt-title label="饮食1">
                          <l-value-domain
                            :code="selectCode.food"
                            @change="changeFoodInfo"
                            :value.sync="form.food"
                          ></l-value-domain>
                        </l-formt-title>
                      </el-form-item>-->
                    </div>
                    <div class="float-left margin-left-10" style="width: 240px;">
                      <!-- <el-form-item prop="nursingLevel">
                        <l-formt-title label="护理级别">
                          <l-value-domain
                            :code="selectCode.nursingLevel"
                            @change="changeNursingInfo"
                            :value.sync="form.nursingLevel"
                          ></l-value-domain>
                        </l-formt-title>
                      </el-form-item>-->
                    </div>
                  </div>
                  <div class="overflow-hidden" style="margin-top: 20px;">
                    <div class="padding20" style="width: 50%;float: left;padding-left:0">
                      <div class="title">
                        <el-checkbox v-model="isHasWristband">分配后打印腕带</el-checkbox>
                      </div>
                      <div class="info" style="height: 70px;">
                        <p>
                          <span class="black em">{{baseInfo.bedCode || '-'}}床</span>
                          <span class="black em">{{baseInfo.patientName || '-'}}</span>
                          <span
                            class="black em"
                            :val="baseInfo.patientGender"
                            code="GENDER_CODE"
                            v-codeTransform
                          ></span>
                          <span class="black em">{{baseInfo.patientAge || '-'}}</span>
                          <span class="gray">科室</span>
                          <span class="black">{{role.deptName || '-'}}</span>
                          <span class="gray">住院号</span>
                          <span class="black">{{baseInfo.inpCode || '-'}}</span>
                        </p>
                        <p>
                          <img src alt=""/>
                        </p>
                      </div>
                    </div>
                    <div class="padding20" style="width: 50%;float: right;padding-right: 0;">
                      <div class="title">
                        <el-checkbox v-model="isHasBedCard">分配后打印床头卡</el-checkbox>
                      </div>
                      <div class="info" style="border: none">
                        <table cellspacing="0" class="table-box">
                                        <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
                          <tr>
                            <td colspan="4">
                              <span>{{baseInfo.bedCode || '-'}}床</span>
                              <span>{{baseInfo.patientName || '-'}}</span>
                              <span
                                :val="baseInfo.patientGender"
                                code="GENDER_CODE"
                                v-codeTransform
                              >-</span>
                              <span>{{baseInfo.ageInfo || '-'}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>入院时间</td>
                            <td>{{baseInfo.wdeptAdmissionTime || '-'}}</td>
                            <td>科室</td>
                            <td>{{role.deptName || '-'}}</td>
                          </tr>
                          <tr>
                            <td>住院号</td>
                            <td>{{baseInfo.inpCode || '-'}}</td>
                            <td>饮食</td>
                            <td>
                              <span :val="baseInfo.dietType" code="food" v-codeTransform>-</span>
                            </td>
                          </tr>
                          <tr>
                            <td>过敏史</td>
                            <td>{{baseInfo.allergyName || '-'}}</td>
                            <td>护理级别</td>
                            <td>
                              <span
                                :val="baseInfo.nursingLevel"
                                code="nursingLevel"
                                v-codeTransform
                              >-</span>
                            </td>
                          </tr>
                          <tr>
                            <td>主治医生</td>
                            <td>{{baseInfo.manageDoctorName || '-'}}</td>
                            <td>主管护士</td>
                            <td>{{baseInfo.manageNurseName || '-'}}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="position-absolute padding20 bottom-box">
                    <!-- <el-button
                      class="float-right margin-left-10"
                      style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
                    >取 消
                    </el-button>-->
                    <el-button
                      type="primary"
                      class="float-right"
                      @click="assingnConfirm('ruleForm')"
                      v-hotKey="{func:'func_submit',flag: 'isLoading'}"
                      style="border-radius: 2px;"
                    >确认分配
                    </el-button>
                    <el-button
                      type="primary"
                      class="float-right margin-right-20"
                      @click="rePrintCtk()"
                      v-hotKey="{func:'func_submit',flag: 'isLoading'}"
                      style="border-radius: 2px;"
                    >补打床头卡
                    </el-button>
                    <el-button
                      type="primary"
                      class="float-right margin-right-20"
                      @click="rePrintWd()"
                      v-hotKey="{func:'func_submit',flag: 'isLoading'}"
                      style="border-radius: 2px;"
                    >补打腕带
                    </el-button>
                    <!-- <el-button
                      type="primary"
                      class="float-right"
                      v-else
                      @click="assingnConfirm('ruleForm')"
                      style="border-radius: 2px;"
                    >确认转床
                    </el-button>-->
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import store from "@/store";
  import {
    fetchEmptyBedInfo,
    fetchUserByDept,
    assingnBed,
    getBedInfList,
    doctorList,
    nurseList,
    getCount,
    rotating
  } from "@/api/ipnw/etHospital";
  import LeftBar from "../../components/nursingLeftBar";
  import {onPreview, onPrint} from "@/utils/print";
  import {dateFtt} from "@/utils/index";

  export default {
    name: "arrangeBed",
    components: {
      LeftBar
    },
    data() {
      return {
        isLoading: false,
        activePatients: "first", // 左侧tab列表
        formParams: [
          "CourtyardArea",
          "technicalOffices",
          "illnessArea",
          "patientsType",
          "patientsState",
          "search"
        ], // 左侧搜索条件
        form: {
          // 分配床位form
          bedId: "",
          manageNurseId: "",
          manageDoctorId: "",
          food: "",
          nursingLevel: ""
        },
        rules: {
          /*  manageNurseId: [
            { required: true, message: "请选择主管护士", trigger: "change" }
          ], */
          manageDoctorId: [
            {required: true, message: "请选择主管医生", trigger: "change"}
          ]
          /* food: [{required: true, message: "请选择饮食", trigger: "change"}],
            nursingLevel: [
              {required: true, message: "请选择护理等级", trigger: "change"}
            ]*/
        },
        rulesContractBed: {
          date: [{required: true, message: "请选择包床时间", trigger: "change"}]
        },
        //l-value-domin组件code码
        selectCode: {
          food: "food",
          nursingLevel: "nursingLevel"
        },
        currentBed_green: "",
        currentBed: "",
        baseInfo: {
          // 患者基本信息 用于打印床头卡、腕带
          nursingLevel: "", // 护理级别
          food: "", // 饮食
          admissionMode: "",
          admissionSdeptId: "",
          admissionSituation: "",
          ageInfo: "-",
          bedId: "",
          birthDate: "-",
          finAdId: "",
          finAdmissionTime: "-",
          inpCount: 0,
          medicalInsuranceType: "",
          medicalType: "",
          patientGender: "-",
          patientName: "-",
          deptName: "-"
        },
        isHasWristband: false, // 是否打印腕带
        isHasBedCard: false, // 是否打印床头卡
        toolBoxs: ["historyHosi", "Hotkey"],
        bedListParams: {
          useStatus: '',
          nursingLevel: '',
          admissionSituation: '',
          recordStatus: '',
          prepayBalance: ''
        },
        bedList: [],
        doctorList: [],
        nurseList: [],
        dialogFormVisible: false,
        printCheck: [],
        bedAllNumber: {
          allBed: 0,
          inBed: 0,
          nullBed: 0,
          level: 0,
          level1: 0,
          level2: 0,
          level3: 0,
          wzCount: 0,
          jzCount: 0,
          ybCount: 0,
          qtCount: 0,
          outHospitalCount: 0,
          arrearageCount: 0,
          qq: 0
        },
        isChangeBed: false,
        contractBedItem: {},
        contractBedMsg: '包床',
        contractBedVisible: false,
        contractBedForm: {
          date: []
        }
        // bedListParams.useStatus===Number(item.useStatus) && bedListParams.admissionSituation===Number(item.admissionSituation)
      };
    },
    computed: {
      ...mapGetters(["receivePatientData", "role"]),
      ...mapGetters(["illnessArea"])
    },
    created() {
      this.getDoctorList();
      this.getNurseList();
      this.getBedList();
      this.queryCount();
    },
    methods: {
      ...mapActions({
        setReloadKey: "base/changeSearchAgainKey",
        changeRecPatientData: "base/changeRecPatientData"
      }),
      // 包床
      contractBed(item) {
        this.contractBedItem = item;
        this.contractBedMsg = item.inpCode ? '撤销包床' : '包床';
        if (!item.inpCode) {
          this.contractBedVisible = true;
        }
      },
      changeBed(item, index) {
        this.isChangeBed = true;
        this.currentBed = index;
        this.baseInfo.bedCode = this.bedList[index].bedCode;
        this.baseInfo.bedId = this.bedList[index].bedId;
        this.form.bedId = this.bedList[index].bedId;
        this.form.bedCode = this.bedList[index].bedCode;
        this.form.nursingLevel = this.bedList[index].nursingLevel;
        this.form.food = this.bedList[index].dietType;
        this.form.manageNurseId = this.bedList[index].manageNurseId;
        this.form.manageDoctorId = this.bedList[index].manageDoctorId;
        this.baseInfo = {
          ...this.baseInfo,
          ...item,
          finAdId: this.bedList[index].finAdId,
          wdeptAdmissionTime: this.bedList[index].wdeptAdmissionTime,
          patientName: this.bedList[index].name,
          inpCode: this.bedList[index].adNum,
          patientGender: this.bedList[index].gender,
          patientAge: this.bedList[index].age,
          manageDoctorName: this.bedList[index].doctorName,
          manageNurseName: this.bedList[index].responsibilityNurse,
          manageNurseId: this.bedList[index].manageNurseId,
          manageDoctorId: this.bedList[index].manageDoctorId,
          nursingLevel: this.bedList[index].nursingLevel,
          dietType: this.bedList[index].dietType,
          allergyName: this.bedList[index].allergyName,
          patientId: this.bedList[index].patientId,
          admissionDiag: this.bedList[index].admissionDiag,
          recordStatus: this.bedList[index].recordStatus,
          finAdmissionTime: this.bedList[index].finAdmissionTime
        };
        this.changeRecPatientData(this.baseInfo);
        this.dialogFormVisible = true;
      },
      handleClose(done) {
        this.isChangeBed = false;
        done();
      },
      handleCloseContractBed(done) {
        this.contractBedForm.date = [];
        done();
      },
      searchBedList(name, value) {
        if (name === 'useStatus') {
          if (Number(value) >= 0 && this.bedListParams[name] !== value) {
            this.$set(this.bedListParams, name, value);
          } else {
            this.$set(this.bedListParams, name, '');
          }
        }
        if (name === 'nursingLevel' || name === 'admissionSituation' || name === 'recordStatus' || name === 'prepayBalance') {
          if (this.bedListParams[name] !== value) {
            this.$set(this.bedListParams, name, value);
          } else {
            this.$set(this.bedListParams, name, '');
          }
        }
        // console.log(this.bedListParams);
      },
      itemShow(item) {
        let params = this.bedListParams;
        let useStatus = params.useStatus === '' || (params.useStatus === 0 && item.useStatus === '0') || (params.useStatus === 1 && item.useStatus && item.useStatus != '0');
        let nursingLevel = params.nursingLevel === '' || (params.nursingLevel === item.nursingLevel);
        let admissionSituation = params.admissionSituation === '' || (params.admissionSituation === item.admissionSituation);
        let recordStatus = params.recordStatus === '' || (params.recordStatus === item.recordStatus);
        let prepayBalance = params.prepayBalance === '' || (Number(params.prepayBalance) < 0 && Number(item.prepayBalance) < 0);
        if (useStatus && nursingLevel && admissionSituation && recordStatus && prepayBalance) {
          return true;
        } else {
          return false;
        }
      },
      queryCount() {
        this.bedAllNumber = {
          allBed: 0,
          inBed: 0,
          nullBed: 0,
          level: 0,
          level1: 0,
          level2: 0,
          level3: 0,
          wzCount: 0,
          jzCount: 0,
          ybCount: 0,
          qtCount: 0,
          outHospitalCount: 0,
          arrearageCount: 0,
          qq: 0
        };
        getCount({
          wardId: this.illnessArea
        }).then(res => {
          if (res.code === 1) {
            let arr = res.data;
            this.bedAllNumber = {
              ...this.bedAllNumber,
              ...arr
            }
          }
        });
      },
      handle_selectPatient(index) {
        if (this.baseInfo.patientId) {
          this.currentBed = index;
          // this.baseInfo.bedCode = this.bedList[index].bedCode;
          this.form.bedCode = this.bedList[index].bedCode;
          this.form.bedId = this.bedList[index].bedId;
          // this.form.nursingLevel = this.bedList[index].nursingLevel;
          // this.form.food = this.bedList[index].dietType;
          this.form.nursingLevel = this.baseInfo.nursingLevel;
          this.form.food = this.baseInfo.dietType;
        } else {
          this.$message.info('请先选择一位患者');
        }
      },

      //打印腕带
      printWristStrap() {
        console.log("baseInfo腕带:", this.baseInfo);
        this.$set(this.baseInfo, "deptName", this.role.deptName);
        onPreview(this.baseInfo, "住院排床腕带");
      },

      //打印床头卡
      printBedCard() {
        console.log("baseInfo床头卡:", this.baseInfo);
        this.$set(this.baseInfo, "deptName", this.role.deptName);
        onPreview(this.baseInfo, "床头卡");
      },

      selected_bedInfoDetail(index, item) {
        if (this.bedList[index].patientId) {
          if (this.baseInfo.patientId && this.bedList[index].patientId == this.baseInfo.patientId) {
            this.currentBed = '';
            this.baseInfo = {};
            this.form.bedId = '';
            this.form.bedCode = '';
            this.form.nursingLevel = '';
            this.form.food = '';
            this.form.manageNurseId = '';
            this.form.manageDoctorId = '';
          } else {
            this.currentBed = index;
            this.baseInfo.bedCode = this.bedList[index].bedCode;
            this.baseInfo.bedId = this.bedList[index].bedId;
            this.form.bedId = this.bedList[index].bedId;
            this.form.bedCode = this.bedList[index].bedCode;
            this.form.nursingLevel = this.bedList[index].nursingLevel;
            this.form.food = this.bedList[index].dietType;
            this.form.manageNurseId = this.bedList[index].manageNurseId;
            this.form.manageDoctorId = this.bedList[index].manageDoctorId;
            this.baseInfo = {
              ...this.baseInfo,
              ...item,
              finAdId: this.bedList[index].finAdId,
              wdeptAdmissionTime: this.bedList[index].wdeptAdmissionTime,
              patientName: this.bedList[index].name,
              inpCode: this.bedList[index].adNum,
              patientGender: this.bedList[index].gender,
              patientAge: this.bedList[index].age,
              manageDoctorName: this.bedList[index].doctorName,
              manageNurseName: this.bedList[index].responsibilityNurse,
              manageNurseId: this.bedList[index].manageNurseId,
              manageDoctorId: this.bedList[index].manageDoctorId,
              nursingLevel: this.bedList[index].nursingLevel,
              dietType: this.bedList[index].dietType,
              allergyName: this.bedList[index].allergyName,
              patientId: this.bedList[index].patientId,
              admissionDiag: this.bedList[index].admissionDiag,
              recordStatus: this.bedList[index].recordStatus,
              finAdmissionTime: this.bedList[index].finAdmissionTime
            };
          }
          this.changeRecPatientData(this.baseInfo);
        } else {
          this.handle_selectPatient(index);
        }
        if (!item.adNum && this.baseInfo.patientId) {
          this.dialogFormVisible = true;
        }
      },

      // 判断患者是否有床位，有床位默认选中，没有分配为第一个空床
       
      checkPatientBed() {
        if (this.receivePatientData.patientId) {
          if (!this.receivePatientData.bedCode) {
            this.currentBed = '';
            this.bedList.map((item, index) => {
              if (item.adNum == "" || !item.adNum) {
                this.currentBed = this.currentBed !== '' ? this.currentBed : index;
              }
            });
          } else {
            this.bedList.map((item, index) => {
              if (item.bedCode == this.receivePatientData.bedCode) {
                this.baseInfo = {
                  ...this.baseInfo,
                  ...item,
                  bedCode: this.bedList[index].bedCode,
                  bedId: this.bedList[index].bedId,
                  finAdId: this.bedList[index].finAdId,
                  wdeptAdmissionTime: this.bedList[index].wdeptAdmissionTime,
                  patientName: this.bedList[index].name,
                  inpCode: this.bedList[index].adNum,
                  patientGender: this.bedList[index].gender,
                  patientAge: this.bedList[index].age,
                  manageDoctorName: this.bedList[index].doctorName,
                  manageNurseName: this.bedList[index].responsibilityNurse,
                  manageNurseId: this.bedList[index].manageNurseId,
                  manageDoctorId: this.bedList[index].manageDoctorId,
                  nursingLevel: this.bedList[index].nursingLevel,
                  dietType: this.bedList[index].dietType,
                  allergyName: this.bedList[index].allergyName,
                  patientId: this.bedList[index].patientId,
                  admissionDiag: this.bedList[index].admissionDiag,
                  recordStatus: this.bedList[index].recordStatus,
                  finAdmissionTime: this.bedList[index].finAdmissionTime
                };
                this.handle_selectPatient(index);
                this.currentBed_green = index;
              }
            });
          }
        }
      },
      /*
       * 当前科室的护士*/

      async getNurseList() {
        let _self = this;
        _self.nurseList = [];
        if (store.user.state.role.deptId) {
          let result = await nurseList(store.user.state.role.deptId);
          if (result.code == "1") {
            result.data.forEach(function (item) {
              _self.nurseList.push({
                manageNurseId: item.uid,
                manageNurseName: item.uname
              });
            });

            if (_self.nurseList.length > 0) {
              _self.form.manageNurseId = _self.nurseList[0].manageNurseId;
            }
          }
        }
      },
      /*
       * 获取当前科室下的医生
       */
      async getDoctorList() {
        let _self = this;
        _self.doctorList = [];
        if (store.user.state.role.deptId) {
          let result = await doctorList(store.user.state.role.deptId);
          if (result.code == "1") {
            result.data.forEach(function (item) {
              _self.doctorList.push({
                manageDoctorId: item.uid,
                manageDoctorName: item.uname
              });
            });
            if (this.doctorList.length > 0) {
              _self.form.manageDoctorId = this.doctorList[0].manageDoctorId;
            }
          }
        }
      },
      /*
       *  请求数据
       * */
      async getBedList() {
        this.$showLoading();
        try {
          let params = {
            wardCode: this.illnessArea
          };
          let result = await getBedInfList(params);
          let _self = this;
          this.bedList = [];
          if (result.code == "1") {
            result.data.forEach(function (item) {
              _self.bedList.push({
                ...item,
                isNew: item.wdeptAdmissionTime == 0 ? true : false, // 是否为新入院
                collection: false, // 收藏状态
                adNum: item.inpCode, // 住院号
                name: item.patientName, // 云医院
                gender: item.patientGender, // 性别
                age: item.patientAge, // 年龄
                doctorName: item.manageDoctorName, // 主治医生
                executiveNurse: "", // 主管护师
                responsibilityNurse: item.manageNurseName, // 责任护师
                inDate: item.wdeptAdmissionTime, // 入院时间
                dayNum: item.inpDays, // 入院天数
                childrenNum: 0 // 婴儿数
              });
            });
            this.checkPatientBed();
          }
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
        }
      },
      /*
       *   组件func
       * */
      handleClick() {
        // tab 的切换方法
      },
      search(form) {
        // 查询方法
        let refs = "";
        if (this.activePatients == "first") {
          refs = "patients1";
        } else if (this.activePatients == "second") {
          refs = "patients2";
        } else {
          refs = "patients3";
        }
        this.$refs[refs].search(form);
      },
      readCard() {
        // 读卡方法
      },
      handleClickTabChange() {
        // 左侧列表tab切换
      },
      /*
       *   页面操作
       * */
      assingnConfirm(formName) {
        // 确认分配
        this.isLoading = true;
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            if (!this.baseInfo.finAdId) {
              this.$message.warning("请选择一名患者!");
              this.isLoading = false;
              return false;
            }
            if (!this.baseInfo.bedId) {
              try {
                let params = {
                  actionType: "1",
                  allergyName: "",
                  bedId: this.bedList[this.currentBed].bedId,
                  finAdId: this.baseInfo.finAdId,
                  manageNurseName: this.form.manageNurseName,
                  manageDoctorName: this.form.manageDoctorName,
                  manageDoctorId: this.form.manageDoctorId || 1,
                  manageNurseId: this.form.manageNurseId || 1,
                  nursingLevel: this.form.nursingLevel,
                  dietType: this.form.food,
                  patientId: this.baseInfo.patientId || 1,
                  turnType: 3,
                  wdeptAdmissionTime: dateFtt(new Date(), "yyyy-MM-dd hh:mm:ss") //入院时间
                };
                let {code, data, msg} = await assingnBed(params);
                if (code === 1) {
                  this.$message.success("分配成功!");
                  this.getBedList();
                  this.setReloadKey(+new Date());
                  //分配成功后打印腕带
                  this.diaPrint();
                  this.queryCount();
                  /* if (this.isHasWristband) {
                    this.$set(this.baseInfo, "deptName", this.role.deptName);
                    onPrint(this.baseInfo, "住院排床腕带");
                  }
                  //打印床头卡
                  if (this.isHasBedCard) {
                    this.$set(this.baseInfo, "deptName", this.role.deptName);
                    onPrint(this.baseInfo, "床头卡");
                  } */
                } else {
                  this.$message.error(msg);
                }
                this.isLoading = false;
              } catch (e) {
                this.isLoading = false;
              }
            } else {
              try {
                let params = {
                  inpCode: this.baseInfo.inpCode,
                  sourceBedId: this.baseInfo.bedId
                };

                params.manageNurseName = this.form.manageNurseName || '';
                params.manageDoctorName = this.form.manageDoctorName || '';
                params.manageDoctorId = this.form.manageDoctorId || '';
                params.manageNurseId = this.form.manageNurseId || '';
                params.nursingLevel = this.form.nursingLevel || '';
                params.dietType = this.form.food || ''

                if (this.isChangeBed) {
                  params.targetBedId = this.form.bedId;
                } else {
                  params.targetBedId = this.bedList[this.currentBed].bedId
                }
                let {code, data, msg} = await rotating(params);
                if (code === 1) {
                  this.$message.success("换床成功!");
                  this.getBedList();
                  this.setReloadKey(+new Date());
                  //分配成功后打印腕带
                  this.diaPrint();
                  this.queryCount();
                } else {
                  this.$message.error(msg);
                }
                this.isLoading = false;
              } catch (e) {
                this.isLoading = false;
              }
            }
          } else {
            this.isLoading = false;
            return false;
          }
        });
      },
      //包床or撤销包床
      contractBedConfirm() {
        // this.contractBedItem
      },
      //      //打印按钮
      //      rePrint(){
      //          if(this.baseInfo==null){
      //            this.$message("患者信息为空！");
      //            return;
      //          }
      //          if(this.baseInfo.recordStatus!='2'){
      //            this.$message("请分配床位后进行打印！");
      //            return;
      //          }
      //        if(!this.isHasWristband && !this.isHasBedCard){
      //          this.$message("请选择需要打印的内容！");
      //          return;
      //          };
      //        this.$set(this.baseInfo,'deptName',this.role.deptName);
      //        if(this.isHasWristband && this.isHasBedCard){
      //          onPrint(this.baseInfo,'住院排床腕带');
      //          onPrint(this.baseInfo,'床头卡');
      //        }else {
      //          //分配成功后打印腕带
      //          if (this.isHasWristband) {
      //            onPreview(this.baseInfo, '住院排床腕带');
      //          }
      //          ;
      //          //打印床头卡
      //          if (this.isHasBedCard) {
      //            onPreview(this.baseInfo, '床头卡');
      //          }
      //        }
      //      },
      //补打床头卡
      rePrintCtk() {
        if (null == this.baseInfo) {
          this.$message("患者信息为空！");
          return;
        }
        if ("2" != this.baseInfo.recordStatus) {
          this.$message("请分配床位后进行打印！");
          return;
        }
        this.$set(this.baseInfo, "deptName", this.role.deptName);
        onPrint(this.baseInfo, "床头卡");
      },
      //补打腕带
      rePrintWd() {
        if (null == this.baseInfo) {
          this.$message("患者信息为空！");
          return;
        }
        if ("2" != this.baseInfo.recordStatus) {
          this.$message("请分配床位后进行打印！");
          return;
        }
        this.$set(this.baseInfo, "deptName", this.role.deptName);
        onPrint(this.baseInfo, "住院排床腕带");
      },
      changeDocInfo(val) {
        // 主治医生变更
        let current = this.doctorList.filter(item => item.manageDoctorId == val);
        this.form.manageDoctorName = current[0].manageDoctorName;
      },
      changeNurInfo(val) {
        // 护士变更
        let current = this.nurseList.filter(item => item.manageNurseId == val);
        this.form.manageNurseName = current[0].manageNurseName;
      },
      changeFoodInfo(item, val) {
        // 饮食变更
        this.baseInfo.dietType = item;
      },
      changeNursingInfo(item, val) {
        // 护理级别变更
        this.baseInfo.nursingLevel = item;
      },
      changeUserInfo(info = {}) {
        // 患者信息变更func
        this.baseInfo = {
          // ...this.baseInfo,
          ...info
        };
        console.log(info);
        this.form.manageDoctorId = info.manageDoctorId || "";
        this.form.manageNurseId = info.manageNurseId || "";

        this.form.nursingLevel = info.nursingLevel;
        this.form.food = info.dietType;
      },
      messageHandler() {
        console.log("工具箱消息");
      },
      diaPrint() {
        let flag1 = this.printCheck.indexOf("0") > -1;
        let flag2 = this.printCheck.indexOf("1") > -1;
        let flag3 = this.printCheck.indexOf("2") > -1;
        if (flag1 || flag2) {
          this.rePrintWd();
        }
        if (flag3) {
          this.rePrintCtk();
        }
        this.dialogFormVisible = false;
      }
    },
    watch: {
      receivePatientData: {
        //深度监听，可监听到对象、数组的变化
        handler(val) {
          // 监听 患者 ID 变化 触发事件
          this.changeUserInfo(val);
          this.checkPatientBed();
        },
        immediate: true,
        deep: true
      },
      illnessArea: {
        //深度监听，可监听到对象、数组的变化
        handler(val) {
          this.bedList = [];
          if (val) {
            this.getBedList();
            this.queryCount();
          }
        },
        immediate: true,
        deep: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .box-bg {
    height: 100%;
    overflow-y: auto;
    background: $l-color-white;
  }

  .table-box {
    width: 440px;
    border-color: $l-color-bgcolor-11;
    height: 204px;
  }

  .bottom-box {
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid $l-color-bgcolor-11;
  }

  .list-item {
    width: 220px;
    height: 34px;
    border-left: 1px solid $l-color-border-4;

    .head {
      span {
        width: 33%;
        display: inline-block;
        height: 34px;
        text-align: left;
        border-right: 1px solid $l-color-border-4;
        border-bottom: 1px solid $l-color-border-4;
      }
    }

    span {
      padding-left: 5px;
      width: 33%;
      display: inline-block;
      height: 34px;
      text-align: left;
      border-right: 1px solid $l-color-border-4;
      border-bottom: 1px solid $l-color-border-4;
    }
  }

  .el-select-dropdown__item:first-child .list-item {
    border-top: 1px solid $l-color-border-4;
  }

  .info {
    border: 1px solid $l-color-bgcolor-11;
    margin-top: 10px;

    table {
      border: 1px solid $l-color-bgcolor-11;

      tr {
        td {
          border-top: 1px solid $l-color-bgcolor-11;
          border-right: 1px solid $l-color-bgcolor-11;
          padding: 0 10px;
          font-size: 14px;
        }

        td:last-child {
          border-right: none;
        }

        td:first-child,
        td:nth-child(3) {
          width: 86px;
          color: $l-color-fontcolor-4;
        }

        td:nth-child(2),
        td:nth-child(4) {
          width: 148px;
          color: $l-color-fontcolor-3;
        }
      }

      tr:first-child td {
        font-weight: 600;
        text-align: center;
        color: $l-color-fontcolor-3;
        border: none;
      }
    }

    p {
      margin: 0;
      padding-left: 20px;
      line-height: 70px;

      span {
        padding: 0 5px;
      }

      .black {
        color: $l-color-fontcolor-3;
      }

      .gray {
        color: $l-color-fontcolor-4;
      }

      .em {
        font-weight: 600;
      }

      img {
        width: 60px;
      }
    }

    p:first-child {
      float: left;
      min-width: 60%;
    }

    p:last-child {
      float: right;
    }
  }

  .list-card {
    overflow-y: auto;
    height: calc(100% - 48px);

    .list-card-item {
      border: 2px solid transparent;
      position: relative;
      width: 287px;
      height: 253px;
      border-radius: 4px;
      padding: 47px 0 0 20px;
      font-size: 16px;
      
      font-weight: bold;
      color: $l-color-fontcolor-3;
      margin-bottom: 20px;
      /*line-height: 24px;*/
      .label {
        position: absolute;
        left: 0;
        top: 0;
        width: 44px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: $l-color-bgcolor-18;
        font-size: 12px;
        
        font-weight: 500;
        color: $l-color-primary1;
      }

      .collection {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .title {
        margin-bottom: 20px;

        .item-color1 {
          font-style: normal;
          font-size: 24px;
          
          font-weight: bold;
        }

        .item-color2 {
          padding-left: 5px;
          margin-right: 25px;
          border-left: 1px solid $l-color-bgcolor-11;
          display: inline-block;
          font-size: 18px;
          
          font-weight: bold;
          color: $l-color-fontcolor-2;
          font-style: normal;
          /*line-height:23px;*/
        }

        .item-color3 {
          height: 18px;
          font-size: 18px;
          
          font-weight: bold;
          color: $l-color-primary;
          font-style: normal;
          /*line-height:23px;*/
        }
      }

      .info {
        margin-bottom: 30px;
        font-size: 16px;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        border: none;
        /*line-height:24px;*/
        span {
          // display: block;
          margin-top: 10px;

          i {
            font-style: normal;
          }

          .item-color {
            color: $l-color-fontcolor-4;
          }
        }
      }

      .icons {
        font-size: 12px;
        
        font-weight: 400;
        color: $l-color-white;

        .te {
          width: 20px;
          height: 20px;
          display: inline-block;
          background-color: $l-color-bgcolor-15;
          text-align: center;
          line-height: 20px;
        }

        .pushi {
          width: 40px;
          height: 20px;
          margin-right: 10px;
          display: inline-block;
          background-color: $l-color-bgcolor-16;
          text-align: center;
          line-height: 20px;
        }

        .babyicon {
          border-left: 1px solid $l-color-bgcolor-11;
          color: $l-color-border-6;
          padding-left: 10px;
        }

        .button-icon {
          /deep/ .el-button--medium {
            padding: 0 25px 0 10px;
          }
        }
      }
    }

    .active {
      border: 2px solid $l-color-primary !important;
    }
  }

  .pt-info {
    padding: 20px;
    font-size: 14px;
    line-height: 40px;

    .pt-info-key {
      display: inline-block;
      width: 90px;
      text-align: right;

      .pt-info-require {
        
        padding-left: 5px;
        vertical-align: middle;
        color: #ef0f0f;
      }
    }

    .pt-info-item {
      display: inline-block;
      width: 160px;
    }
  }

  .manage-doc-form {
    /deep/ .el-form-item__error {
      line-height: 30px;
      left: 105%;
      top: 0;
      white-space: nowrap;
    }
  }

  .bed-num-show {
    padding-top: 10px;
  }

  .bed-num-item {
    overflow: hidden;
    background-color: $l-color-bgcolor-18;
    padding: 5px;

    .bed-num-title {
      float: left;
      line-height: 28px;
    }

    .bed-num-box {
      margin-left: 40px;

      span {
        width: 100%;
        display: inline-block;
        padding: 5px;
        border: 1px solid $l-color-primary;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
      }

      .spanItem {
        width: 100%;
        display: inline-block;
        padding: 5px;
        border: 1px solid $l-color-primary;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
      }

      .spanActive {
        border: 1px solid transparent;
        background-color: $l-color-primary;
        color: $l-color-white;
      }
    }
  }

  .el-select-dropdown__item.is-disabled {
    padding: 0 20px !important;
  }
</style>
