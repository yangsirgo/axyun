<template>
  <div class="wrapper" @click="reviewsFlag = false">
    <div class="float-left main">
      <div class="main_wrap" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <el-card class="height100 pre-main">
              <!-- 处方信息 -->
              <div class="cftitle no-wrap">
                <el-form :model="mainSearch" ref="ruleForm" label-width="0" :inline="true" class="demo-ruleForm">
                  <div style="display:flex;">
                    <div>
                      <el-form-item prop="inspectionType" :rules="[{ required: true, message: '请选择抽查类型', trigger: 'change' }]">
                        <l-formt-title label="抽查类型">
                          <el-select v-model="mainSearch.inspectionType" placeholder="请选择">
                            <el-option v-for="item in cclx" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div v-if="mainSearch.inspectionType !== '0'">
                      <el-form-item prop="doctorUserId" :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                        v-if="mainSearch.inspectionType === '1'">
                        <l-formt-title label="医生选择">
                          <el-select v-model="mainSearch.doctorUserId" placeholder="请选择" @change="doctorChange">
                            <el-option v-for="item in doctorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item prop="backDrugName" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]"
                        v-if="mainSearch.inspectionType === '2'">
                        <l-formt-title label="药品选择">
                          <Linput class="drug-box" :popoverWidth="800" suffix-icon="el-icon-search" :tableData="selectOptions"
                            @query="elsearch($event)" @select="select" :tableParams="dropColumn" :backDrugName="mainSearch.backDrugName"
                            @sendVal="getdrugName" placeholder="请选择药品"></Linput>
                        </l-formt-title>
                      </el-form-item>
                      <el-form-item prop="deptId" v-else-if="mainSearch.inspectionType === '3'" :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                        <l-formt-title label="科室选择">
                          <l-value-domain :value.sync="mainSearch.deptId" remoteUrl="/wadmin/hos/dept" remoteShowKey="orgNm"
                            remoteValueKey="id" placeholder="请选择" @change="deptChange"></l-value-domain>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item prop="orderType" :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                        <l-formt-title label="医嘱类型">
                          <el-select v-model="mainSearch.orderType" placeholder="请选择">
                            <el-option v-for="item in cflx" :key="item.id" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                  </div>
                  <div style="display:flex;">
                    <div>
                      <el-form-item prop="date" :rules="[{ required: true, message: '请选择发药日期', trigger: 'change' }]">
                        <l-formt-title label="发药日期" labelWidth="64" style="width:300px;">
                          <div>
                            <el-date-picker v-model="mainSearch.date" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                              start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                          </div>
                        </l-formt-title>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item prop="inspectionMode" :rules="[{ required: true, message: '请选择抽查模型', trigger: 'change' }]">
                        <el-radio-group v-model="mainSearch.inspectionMode">
                          <el-radio label="0">按数量抽查</el-radio>
                          <el-radio label="1">按比例抽查</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item v-if="mainSearch.inspectionMode === '0'" prop="inspectionQuantity" :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                        <el-input-number style="width:170px;" max="9999999" min="1" :controls="false" v-model="mainSearch.inspectionQuantity"
                          @change="qtyValid($event,'inspectionQuantity')" placeholder="请输入数量"></el-input-number>
                      </el-form-item>
                      <el-form-item v-else prop="inspectionRate" :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                        <el-input style="width:170px;" @change="rateValid($event,'inspectionRate')" v-model="mainSearch.inspectionRate"
                          placeholder="请输入数字,10%写作0.1"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <el-row>
                    <el-col style="text-align: right;font-size:0;">
                      <el-button type="primary" @click="loadTable">抽查</el-button>
                      <el-button type="primary" plain @click="save" :disabled="typeof curItem.inspectionStatus !== 'undefined'">保存</el-button>
                      <el-button type="primary" plain @click.stop="reviews" :disabled="inspectionStatusStyle">点评</el-button>
                      <el-button type="primary" plain @click="finishReviews" :disabled="inspectionStatusStyle">完成点评</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="pre-main-table">
                <el-table :data="tableData" stripe border style="width: 100%" height="100%" v-loading="rightLoad" highlight-current-row @current-change="handleCurrentChange"
                   @row-dblclick="rowDbclick">
                  <el-table-column prop="commentStatus" label="状态" sortable  :sort-orders="['ascending','descending']"
                    header-align="center" show-overflow-tooltip>
                    <template slot-scope="scope">{{commentStatusShow[scope.row.commentStatus]}}</template>
                  </el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="recipeCode" label="处方号" width="160"></el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="patientName" label="病人姓名"></el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="patientGender" label="性别">
                    <template slot-scope="scope">
                      <span :val="scope.row.patientGender" code="GENDER_CODE" v-codeTransform></span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="patientBirthDate" label="出生日期"
                    width="180">
                    <template slot-scope="scope">
                      <span>{{interception(scope.row.patientBirthDate)}}</span>
                    </template></el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="clinicDiag" label="临床诊断"></el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="drugVarietyQuantity" label="处方味数"></el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="recipeAmt" width="120" align="right"
                    label="总金额(元)">
                    <template slot-scope="scope">
                      <span>{{ formatNum(scope.row.recipeAmt) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="doctorUserName" label="开单医生"></el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="deptId" label="科室">
                    <template slot-scope="scope">
                      <span tableName="sys_org" :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row['deptId']
                          }"
                        columns="org_nm" v-tableTransform></span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="orderTime" label="医嘱时间" width="180"></el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="deliveryPhCode" label="发药药房">
                    <template slot-scope="scope">{{codeToText(scope.row.deliveryPhCode, drugStorageList)}}</template>
                  </el-table-column>
                  <el-table-column header-align="center" show-overflow-tooltip prop="deliveryTime" label="发药时间" width="180"></el-table-column>
                </el-table>
              </div>
              <div class="pre-bottom">
                <el-row>
                  <el-col style="font-size:0;">
                    <el-button type="primary" plain @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
                    <el-button type="primary" plain @click="exportExcel">导出</el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-show="reviewsFlag" :class="['pre-re-info', reviewsFlag ? 'active' : '']" @click.stop>
                <el-card class="height100 pre-main" v-loading="deLoading">
                  <div class="other-div">
                    <div class="cftitle no-wrap">
                      <el-row style="padding:5px 0">
                        <el-col :span="14">
                          <span class="label">处方号：</span>
                          <span class="title">{{recipeForm.recipeCode}}</span>
                          <span class="pre">
                            (
                            <span :val="recipeForm.feeType" code="MedicalPaymentMethod" v-codeTransform></span>)
                          </span>
                        </el-col>
                        <el-col :span="10">
                          <div class="float-right">
                            <span class="label">审方状态：</span>
                            <span>{{showStatus[recipeForm.checkState]}}</span>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="6">
                          <span class="label">患者姓名：</span>
                          <span>{{recipeForm.patientName}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">性别：</span>
                          <span :val="recipeForm.patientGender" code="GENDER_CODE" v-codeTransform></span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">年龄：</span>
                          <span :title="recipeForm.patientAge">{{recipeForm.patientAge}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">门诊号:</span>
                          <span :title="recipeForm.visitCode">{{recipeForm.visitCode}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="6">
                          <span class="label">开单科室：</span>
                          <span :title="recipeForm.deptName">{{recipeForm.deptName}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">开单医生：</span>
                          <span :title="recipeForm.doctorUserName">{{recipeForm.doctorUserName}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">总金额：</span>
                          <span>
                            {{ formatNum(recipeForm.prescriptionAmt) }}
                            <span>元</span>
                          </span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">医嘱时间：</span>
                          <span :title="recipeForm.orderTime">{{recipeForm.orderTime}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="6">
                          <span class="label">取药药房：</span>
                          <span>{{codeToText(recipeForm.billPharCode, drugStorageList)}}</span>
                        </el-col>
                        <el-col :span="18">
                          <span class="label">临床诊断：</span>
                          <span :title="recipeForm.clinicDiag">{{recipeForm.clinicDiag}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="12">
                          <span class="label">联系方式：</span>
                          <span :title="recipeForm.phoneNum">{{recipeForm.phoneNum}}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="label">地址：</span>
                          <span :title="recipeForm.patientAddr">{{recipeForm.patientAddr}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="6">
                          <span class="label">收费状态：</span>
                          <span>{{recipeForm.chargeState == 0 ? "未收费" : "已收费"}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">收费人员：</span>
                          <span :title="recipeForm.chargeUserName">{{recipeForm.chargeUserName}}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="label">收费时间：</span>
                          <span :title="recipeForm.chargeTime">{{recipeForm.chargeTime}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="6">
                          <span class="label">配方状态：</span>
                          <span>{{recipeForm.dispenseState == 0 ? "未配药" : "已配药" }}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">配方人员：</span>
                          <span :title="recipeForm.dispenseUserName">{{recipeForm.dispenseUserName}}</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="label">配方时间：</span>
                          <span :title="recipeForm.dispenseTime">{{recipeForm.dispenseTime}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="6">
                          <span class="label">发药状态：</span>
                          <span>{{recipeForm.deliveryState == 0 ? "未发药" : "已发药"}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">发药药房：</span>
                          <span :title="codeToText(recipeForm.deliveryPhCode,drugStorageList)">{{codeToText(recipeForm.deliveryPhCode,drugStorageList)}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">发药窗口：</span>
                          <span :title="codeToText(recipeForm.preWindowCode,pharWindowList)">{{codeToText(recipeForm.preWindowCode,pharWindowList)}}</span>
                          <span :title="recipeForm.deliveryWindowCode">{{recipeForm.deliveryWindowCode}}</span>
                        </el-col>
                      </el-row>
                      <el-row style="padding:5px 0" :gutter="20">
                        <el-col :span="6">
                          <span class="label">发药人员：</span>
                          <span :title="recipeForm.deliveryUserName">{{recipeForm.deliveryUserName}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">发药时间：</span>
                          <span :title="recipeForm.deliveryTime">{{recipeForm.deliveryTime}}</span>
                        </el-col>
                        <el-col :span="6">
                          <span class="label">处方味数：</span>
                          <span :title="recipeForm.drugVarietyQuantity">{{recipeForm.drugVarietyQuantity}}</span>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="pre-main-table2">
                      <el-table :data="rpTableData" stripe border style="width: 100%" height="100%">
                        <el-table-column prop="drugName" header-align="center" show-overflow-tooltip label="药品名称"></el-table-column>
                        <el-table-column prop="spec" header-align="center" show-overflow-tooltip label="规格"></el-table-column>
                        <el-table-column prop="price" header-align="center" show-overflow-tooltip label="单价(元)" width="100"
                          align="right">
                          <template slot-scope="scope">
                            <span>{{ formatNum(scope.row.price, 4) }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="originCode" header-align="center" show-overflow-tooltip label="生产厂家">
                          <template slot-scope="scope">
                            <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="drugQuantity" header-align="center" show-overflow-tooltip label="数量"></el-table-column>
                        <el-table-column prop="frequencyCode" header-align="center" show-overflow-tooltip label="频率">
                          <template slot-scope="scope">
                            <span columns="FREQUENCY_NAME" :conditionMap="{ FREQUENCY_CODE: scope.row.frequencyCode }"
                              tableName="hrp_frequency" v-tableTransform></span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="medicationCode" header-align="center" show-overflow-tooltip label="用法">
                          <template slot-scope="scope">
                            <span :val="scope.row.medicationCode" code="MedicationRouteCode" v-codeTransform></span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="oneDosage" header-align="center" show-overflow-tooltip label="用量"></el-table-column>
                      </el-table>
                    </div>
                    <div class="pre-drug-list margin-bottom2">
                      <el-row>
                        <el-col :span="12">
                          <div class="pre-drug-box" v-show="drugList.antibacterialDrug.length > 0">
                            <div class="pre-drug-item" v-for="(item,index) in drugList.antibacterialDrug" :key="'kg'+index">
                              <span class="title-name">{{ index === 0 ? '抗菌药品:' : '' }}</span>
                              <span class="drug-name">{{item.drugName}}</span>
                              <span>{{item.value}}</span>
                            </div>
                            <div class="pre-drug-num">共: {{drugList.antibacterialDrug.length}}种</div>
                          </div>
                          <div class="pre-drug-box" v-show="drugList.injectionDrug.length > 0">
                            <div class="pre-drug-item" v-for="(item,index) in drugList.injectionDrug" :key="'zs'+index">
                              <span class="title-name">{{ index === 0 ? '注射药品:' : '' }}</span>
                              <span class="drug-name">{{item.drugName}}</span>
                            </div>
                            <div class="pre-drug-num">共: {{drugList.injectionDrug.length}}种</div>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="pre-drug-box" v-show="drugList.basicDrug.length > 0">
                            <div class="pre-drug-item" v-for="(item,index) in drugList.basicDrug" :key="'jb'+index" s>
                              <span class="title-name">{{ index === 0 ? '基本药品:' : '' }}</span>
                              <span class="drug-name">{{item.drugName}}</span>
                              <span>{{item.value}}</span>
                            </div>
                            <div class="pre-drug-num">共: {{drugList.basicDrug.length}}种</div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="pre-state">
                      <el-radio-group v-model="reviewData.checkState">
                        <el-radio label="1">合格处方</el-radio>
                        <el-radio label="2">不合格处方</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="pre-check-box" v-show="reviewData.checkState === '2'">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <l-card-title>
                            <span slot="left">用药不适宜处方存在问题</span>
                          </l-card-title>
                          <el-checkbox-group v-model="checkList1">
                            <el-checkbox v-for="res in cList1" :key="res.resultCode" :label="res.resultCode">{{res.resultContent}}</el-checkbox>
                          </el-checkbox-group>
                        </el-col>
                        <el-col :span="12">
                          <l-card-title>
                            <span slot="left">超常处方存在问题</span>
                          </l-card-title>
                          <el-checkbox-group v-model="checkList2">
                            <el-checkbox v-for="res in cList2" :key="res.resultCode" :label="res.resultCode">{{res.resultContent}}</el-checkbox>
                          </el-checkbox-group>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <!-- 处方信息 -->
                  <div class="pre-bottom" style="margin-top:16px;">
                    <el-row>
                      <el-col style="text-align: right;">
                        <el-button type="primary" @click="reviewsSave" :disabled="inspectionStatusStyle">保存</el-button>
                        <el-button class="filter-item" plain type="primary" @click="reviewsFlag = false">取消</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </div>
            </el-card>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left" :style="{'width': toolBarExpanded ? '340px' : '46px'}">
      <el-card class="height100">
        <div class="table-top">
          <div class="clearFloat">
            <l-card-title style="padding:8px 0;">
              <span slot="left">抽查列表</span>
            </l-card-title>
            <l-formt-title class="margin-bottom2" label="抽查类型">
              <el-select v-model="searchParam.inspectionType" placeholder="请选择">
                <el-option v-for="item in cclx" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </l-formt-title>
            <l-formt-title class="margin-bottom2" label="详细信息">
              <el-input v-model="searchParam.inspectionTypeValue" placeholder="医生姓名/科室名称/药品名称"></el-input>
            </l-formt-title>
            <l-formt-title class="margin-bottom2" label="抽查日期" labelWidth="64">
              <div>
                <el-date-picker v-model="searchParam.chargeTime" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                  start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
              </div>
            </l-formt-title>
            <l-formt-title class="margin-bottom2" label="点评状态">
              <el-select v-model="searchParam.inspectionStatus" placeholder="请选择">
                <el-option v-for="item in dpStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </l-formt-title>
            <l-formt-title class="margin-bottom2" style="margin-bottom:8px;" label="抽查单号">
              <el-input v-model="searchParam.inspectionNum" placeholder></el-input>
            </l-formt-title>
            <div class="clearFloat">
              <!--查询按钮-->
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-button class="width100" type="primary" @click="search">查询</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button class="width100" @click="reset">重置</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button class="width100" @click="newAdd">新增抽查单</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="table-list">
            <div class="infinite-list-wrapper height100" v-loading="tlm_isLoading">
              <div class="list-container height100" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                <div ref="recipeTable" :class="curSelect === i ? 'list-item active' : 'list-item'" v-for="(item, i) in recipeTable"
                  :key="i" @click="handleSelectedItem(i, item)">
                  <el-row>
                    <el-col :span="24">
                      <span>抽查单号</span>
                      {{item.inspectionNum}}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <span>点评状态</span>
                      {{dpShow[item.inspectionStatus]}}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span>抽查维度</span>
                      {{sfShow[item.inspectionType]}}
                    </el-col>
                    <el-col :span="12">
                      <template v-if="item.inspectionType !== '0'">
                        <span v-if="item.inspectionType === '1'">抽查医生</span>
                        <span v-else-if="item.inspectionType === '2'">抽查药品</span>
                        <span v-else-if="item.inspectionType === '3'">抽查科室</span>
                        <span :title="item.inspectionTypeValue">{{item.inspectionTypeValue}}</span>
                      </template>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span>抽查处方数</span>
                      {{item.inspectionQuantity}}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span>抽查时间</span>
                      {{item.createdAt}}
                    </el-col>
                  </el-row>
                </div>
                <p class="align-center" v-if="!tlm_isLoading && noMore">没有更多了</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="float-left right" :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}">
      <tool-box @message="toolBoxMessage" :open.sync="toolBoxExpanded" :boxName="defaultBoxName" :modules="boxs" />
    </div>
  </div>
</template>
<script>
  import base from "@/api/hmm/base";
  import opha from "@/api/hmm/opha";
  import FlowMenu from "@/components/FlowMenu";
  import ToolBox from "@/views/public/tools";
  import {
    page
  } from "@/api/common/allergy";
  import {
    mapGetters,
    mapActions
  } from "vuex";
  import Linput from "./component/Linput.vue";
  import {
    localCodeTransform
  } from "@/utils/util";
  import formatNum from "@/utils/formatPrice.js";
  import {
    blukToOutfit,
    outfitToBluk
  } from "@/utils/drugManagement.js";
  import {
    print,
    preview,
    onPreview
  } from "@/utils/print";
  import {
    jsonToExcel
  } from "@/utils/excel/excel";
  import {
    getIsTenant,
    getPamars
  } from "@/utils/auth";

  export default {
    components: {
      FlowMenu,
      ToolBox,
      Linput
    },
    props: {
      // 患者卡片类型
      patientCardType: {
        type: String,
      },
      // 工具箱默认是否展开状态
      boxExpanded: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        boxs: ["otherPrescription", "drugCheck"], //工具箱
        defaultBoxName: "drugCheck",
        // 控制
        inspectionStatusStyle:false,

        toolBoxExpanded: false,
        toolBarExpanded: true,
        sfShow: {
          "0": "随机抽查",
          "1": "按医生抽查",
          "2": "按药品抽查",
          "3": "按科室抽查",
        },
        dpStatus: [{
            value: "0",
            label: "未点评结束",
          },
          {
            value: "1",
            label: "已点评结束",
          },
        ],
        dpShow: {
          "0": "未点评结束",
          "1": "已点评结束",
        },
        searchParam: {
          inspectionType: "",
          chargeTime: [],
          inspectionTypeValue: "",
          inspectionNum: "",
          inspectionStatus: "",
          orderBy: "CREATED_AT DESC",
        },
        listData: [],
        tableData: [],
        radio: 1,
        recipeTable: [],
        tlm_isLoading: false,
        curSelect: null,
        curItem: {},
        page: {
          total: 0,
          pageSize: 10,
          pageNo: 1,
        },
        cclx: [{
            value: "0",
            label: "随机抽查",
          },
          {
            value: "1",
            label: "按医生抽查",
          },
          {
            value: "2",
            label: "按药品抽查",
          },
          {
            value: "3",
            label: "按科室抽查",
          },
        ],
        cflx: [{
            id: "10",
            name: "西药"
          },
          {
            id: "12",
            name: "中成药"
          },
          {
            id: "11",
            name: "中草药"
          },
        ],
        mainSearch: {
          inspectionType: "",
          doctorUserId: "",
          doctorUserName: "",
          deptId: "",
          deptName: "",
          date: [],
          orderType: "",
          inspectionMode: "",
          inspectionQuantity: "",
          inspectionRate: "",
          backDrugName: "",
          inspectionStatus:'',
        },
        doctorList: [],
        dropColumn: [{
            prop: "drugName",
            label: "药品名称",
          },
          {
            prop: "spec",
            label: "规格",
          },
          {
            prop: "drugStock",
            label: "库存",
            width: 80,
          },
          {
            prop: "purchasePrice",
            label: "进价(元)",
            width: 100,
          },
          {
            prop: "price",
            label: "售价(元)",
            width: 100,
          },
          {
            prop: "formCode",
            label: "剂型",
          },
        ],
        selectOptions: [],
        currentDrug: {},
        rightLoad: false,
        drugStorageList: [],
        saveData: {},
        currentRow: {},
        reviewsFlag: false,
        commentStatusShow: {
          "0": "未点评",
          "1": "合格",
          "2": "不合格",
        },
        recipeForm: {},
        rpTableData: [],
        reviewData: {
          checkState: "1",
          unqualifiedComment: "",
        },
        drugList: {
          // 抗菌
          antibacterialDrug: [],
          // 注射
          injectionDrug: [],
          // 基本
          basicDrug: [],
        },
        deLoading: false,
        showStatus: {
          "0": "未审方",
          "1": "通过",
          "2": "不通过",
        },
        cList1: [{
            resultCode: "001",
            resultContent: "适应证不适宜",
          },
          {
            resultCode: "002",
            resultContent: "遴选的药品不适宜",
          },
          {
            resultCode: "003",
            resultContent: "无正当理由不首选国家基本药物",
          },
          {
            resultCode: "004",
            resultContent: "用法、用量不适宜",
          },
          {
            resultCode: "005",
            resultContent: "联合用药不适宜",
          },
          {
            resultCode: "006",
            resultContent: "重复给药",
          },
          {
            resultCode: "007",
            resultContent: "有配伍禁忌或者不良相互作用",
          },
        ],
        cList2: [{
            resultCode: "008",
            resultContent: "无适应证用药",
          },
          {
            resultCode: "009",
            resultContent: "无正当理由开具高价药",
          },
          {
            resultCode: "010",
            resultContent: "无正当理由超说明书用药",
          },
          {
            resultCode: "011",
            resultContent: "无正当理由为同一患者同时开具2种以上药理作用相同药物",
          },
        ],
        checkList1: [],
        checkList2: [],
        pharWindowList: [],
        mainOrderBy: "COMMENT_STATUS",
      };
    },
    computed: {
      ...mapGetters("user", ["role"]),
      noMore() {
        return (
          Math.ceil(this.page.total / this.page.pageSize) <= this.page.pageNo
        );
      },
      disabled() {
        return this.tlm_isLoading || this.noMore;
      },
    },
    watch: {
      boxExpanded: {
        handler(v) {
          this.toolBoxExpanded = v;
        },
        immediate: true,
      },
      reviewsFlag(val) {
        if (!val) {
          this.checkList1 = [];
          this.checkList2 = [];
        }
      },
    },
    created() {
      this.load();
      this.loadDoctor();
      this.getDrugStorageList("0,1");
    },
    methods: {
      ...mapActions({
        changeCurDrug: "drugManagement/changeDrug",
        changeCurPre: "drugManagement/changePre",
      }),

      formatNum(num, l) {
        return formatNum(num, l);
      },
      // 截取字符串
      interception(a) {
        let b = '--'
        if (a) {
          b = a.substring(0, 11);
        }
        return b
      },
      newAdd() {
        this.$refs.ruleForm.resetFields();
        this.mainSearch = this.$options.data().mainSearch;
        this.saveData = {};
        this.tableData = [];
        this.curItem = {};
        this.currentDrug = {};
        this.currentRow = {};
        this.curSelect = null;
      },
      async listForDropDown() {
        this.pharWindowList = await base.pharWindowForDropDown({});
      },
      toolBoxMessage(data) {
        this.$emit("message", data);
      },
      search() {
        this.page.pageNo = 1;
        this.load();
      },
      reset() {
        this.searchParam = this.$options.data().searchParam;
      },
      handleSelectedItem(index, data) {
        if (index === null) {
          this.$refs.ruleForm.resetFields();
          this.tableData = [];
          return;
        }
        let obj = {
          "1": "doctorUserId",
          "3": "deptId",
        };
        this.curSelect = index;
        this.curItem = data;
        for (let i in this.mainSearch) {
          this.mainSearch[i] = data[i];
        }
        // 判断  按钮时候可点击
        if(this.mainSearch.inspectionStatus == '1'){
            this.inspectionStatusStyle = true;
        }else{
            this.inspectionStatusStyle = false;
        }
        this.mainSearch.orderType = data.recipeOrderType;
        if (obj[data.inspectionType]) {
          let key = obj[data.inspectionType];
          this.mainSearch[key] = data.inspectionTypeId;
        }
        if (data.inspectionType === "2") {
          this.$set(this.mainSearch, "backDrugName", data.inspectionTypeValue);
          this.elsearch(data.inspectionTypeValue, data.inspectionTypeId);
        }
        if (data.startDate && data.endDate) {
          this.mainSearch.date = [data.startDate, data.endDate];
        }
        // 科室转number类型，要不反显失败
        this.mainSearch.deptId = Number(this.mainSearch.deptId);
        this.loadRightData();
      },
      load() {
        let params = {
          ...this.searchParam,
          ...this.page,
          startDate: this.searchParam.chargeTime && this.searchParam.chargeTime[0] ?
            this.searchParam.chargeTime[0] + " 00:00:00" : "",
          endDate: this.searchParam.chargeTime && this.searchParam.chargeTime[1] ?
            this.searchParam.chargeTime[1] + " 23:59:59" : "",
        };
        this.tlm_isLoading = true;
        opha
          .recipeInspection(params)
          .then((res) => {
            if (res.code === 1) {
              this.page = res.pageParams;
              if (this.page.pageNo === 1) {
                this.recipeTable = res.data;
                if (this.recipeTable.length > 0) {
                  this.handleSelectedItem(0, this.recipeTable[0]);
                } else {
                  this.handleSelectedItem(null, {});
                }
              } else {
                this.recipeTable = this.recipeTable.concat(res.data);
              }
            }
            this.tlm_isLoading = false;
          })
          .catch((err) => {
            this.tlm_isLoading = false;
          });
      },
      loadRightData() {
        this.rightLoad = true;
        opha
          .recipeRightData({
            inspectionId: this.curItem.id,
            orderBy: this.mainOrderBy,
          })
          .then((res) => {
            if (res.code === 1) {
              this.tableData = res.data;
            }
            this.rightLoad = false;
          })
          .catch((err) => {
            this.rightLoad = false;
          });
      },
      loadTable() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.mainSearch.inspectionType === "2") {
              if (!this.currentDrug.drugId) {
                this.$message.warning("请选择要抽查的药品!");
                return;
              }
              if (this.mainSearch.backDrugName !== this.currentDrug.drugName) {
                this.$message.warning("没选择药品，自动替换上一个!");
                this.mainSearch.backDrugName = this.currentDrug.drugName;
              }
            }

            let insType = {
              "1": {
                doctorUserId: this.mainSearch.doctorUserId,
                inspectionTypeValue: this.mainSearch.doctorUserName,
              },
              "2": {
                drugId: this.currentDrug.drugId,
                inspectionTypeValue: this.currentDrug.drugName,
              },
              "3": {
                deptId: this.mainSearch.deptId,
                inspectionTypeValue: this.mainSearch.deptName,
              },
            };
            let insMode = {
              "0": {
                inspectionQuantity: +this.mainSearch.inspectionQuantity,
              },
              "1": {
                inspectionRate: +this.mainSearch.inspectionRate
              },
            };
            let params = {
              inspectionType: this.mainSearch.inspectionType,
              startDate: this.mainSearch.date && this.mainSearch.date[0] ?
                this.mainSearch.date[0] + " 00:00:00" : "",
              endDate: this.mainSearch.date && this.mainSearch.date[1] ?
                this.mainSearch.date[1] + " 23:59:59" : "",
              orderType: this.mainSearch.orderType,
              inspectionMode: this.mainSearch.inspectionMode,
              orderBy: this.mainOrderBy,
              ...insType[this.mainSearch.inspectionType],
              ...insMode[this.mainSearch.inspectionMode],
            };
            this.rightLoad = true;
            this.saveData = {};
            opha
              .recipeIn(params)
              .then((res) => {
                if (res.code === 1) {
                  this.curSelect = null;
                  this.curItem = {};
                  this.saveData = res.data;
                  this.tableData = res.data.recipeCommentVOList;
                } else {
                  this.$message.error(res.msg || "获取抽查数据失败");
                }
                this.rightLoad = false;
              })
              .catch((err) => {
                this.$message.error(err.msg || "获取抽查数据失败");
                this.rightLoad = false;
              });
          }
        });
      },
      loadDoctor() {
        let params = {
          'hosId': JSON.parse(getPamars()).hosId
        };
        base.getDoctorList(params).then((res) => {
          if (res.code === 1) {
            this.doctorList = res.data;
          }
        });
      },
      elsearch(drugName, id) {
        //搜索联想
        let searchParams = {
          drugName: drugName,
        };
        this.selectOptions = [];
        this.getDrugList(searchParams, id);
      },
      getDrugList(params, id) {
        base
          .getAssociation(params)
          .then((res) => {
            if (res.code != 1) {
              this.$message.error(res.msg || "药品查询失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药品数据");
              return;
            }
            let list = res.data.map((drugWapper) => {
              // 库存量转化
              const {
                out,
                bl
              } = blukToOutfit(
                drugWapper.drugStock,
                drugWapper.packQuantity
              );
              return {
                ...drugWapper,
                kcOut: out,
                kcBl: bl,
                drugStock: drugWapper.drugStock || 0,
                purchasePrice: drugWapper.purchasePrice || 0,
                price: drugWapper.price || 0,
              };
            });
            this.selectOptions = list;
            if (id) {
              let item = this.selectOptions.find((item) => item.drugId === id);
              this.select(item);
            }
          })
          .catch((res) => {
            this.$message.error(res.msg || "药品查询失败");
          });
      },
      select(row) {
        this.currentDrug = row;
        this.mainSearch.backDrugName = row.drugName;
        this.mainSearch.orderType = row.majorOrders;
      },
      // 医生变更
      doctorChange(val) {
        let item = this.doctorList.find((item) => item.id === val);
        this.mainSearch.doctorUserName = item.name;
      },
      // 科室变更
      deptChange(val, item) {
        this.mainSearch.deptName = item.orgNm;
      },
      codeToText(code, list) {
        return localCodeTransform(code, list);
      },
      //获取药库数据
      getDrugStorageList(params) {
        base
          .getDrugStorage(params)
          .then((res) => {
            if (res.code == 1) {
              this.drugStorageList = res.data;
            } else {
              this.$message.error(res.msg || "获取药库数据失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无药库数据");
            }
          })
          .catch((res) => {
            this.$message.error(res.msg || "获取药库数据失败");
          });
      },
      save() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.saveData) === "{}") {
              this.$message.warning("请先抽查");
              return;
            }
            this.$showLoading();
            opha
              .saveMulti(this.saveData)
              .then((res) => {
                if (res.code === 1) {
                  this.$message.success("保存成功");
                  this.search();
                } else {
                  this.$message.error(res.msg || "保存失败");
                }
                this.$hideLoading();
              })
              .catch((err) => {
                this.$hideLoading();
                this.$message.error(err.msg || "保存失败");
              });
          }
        });
      },
      handleCurrentChange(val) {
        this.currentRow = val;
        this.changeCurDrug(val);
        this.changeCurPre({
          ...val,
          id: val.recipeId,
        });
      },
      rowDbclick(row) {
        this.currentRow = row;
        this.changeCurDrug(row);
        this.reviews();
      },
      reviews() {
        if (!this.curItem.id) {
          this.$message.warning("保存后的抽查单才允许点评");
          return;
        }
        if (JSON.stringify(this.currentRow) === "{}") {
          this.$message.warning("请选择要点评的处方");
          return;
        }
        this.reviewsFlag = true;
        this.getDetails(this.currentRow.recipeId);
      },
      getDetails(params) {
        this.deLoading = true;
        opha
          .recipeRightDetail(params)
          .then((res) => {
            if (res.code === 1) {
              this.recipeForm = res.data;
              this.rpTableData = res.data.recipeDVOList;
              this.drugList = res.data.drugVO;
              this.reviewData.checkState = this.currentRow.commentStatus ?
                this.currentRow.commentStatus === "0" ?
                "1" :
                this.currentRow.commentStatus :
                "1";
              res.data.recipeCommentVO.recipeCommentResultPOList.forEach(
                (item) => {
                  let resCodeItem = this.cList1.find(
                    (ele) => ele.resultCode === item.resultCode
                  );
                  if (resCodeItem) {
                    this.checkList1.push(item.resultCode);
                  }
                  let resCodeItem2 = this.cList2.find(
                    (ele) => ele.resultCode === item.resultCode
                  );
                  if (resCodeItem2) {
                    this.checkList2.push(item.resultCode);
                  }
                }
              );
            }
            this.deLoading = false;
          })
          .catch((err) => {
            this.deLoading = false;
          });
      },
      reviewsSave() {
        let rc = {};
        if (this.reviewData.checkState === "2") {
          let list = [];
          this.checkList1.forEach((item) => {
            let ele = this.cList1.find((it) => it.resultCode === item);
            if (ele) {
              list.push(ele);
            }
          });
          this.checkList2.forEach((item) => {
            let ele = this.cList2.find((it) => it.resultCode === item);
            if (ele) {
              list.push(ele);
            }
          });
          if (list.length === 0) {
            this.$message.warning("请选择不合格原因!");
            return;
          }
          rc.recipeCommentResultPOList = list;
        }
        let params = {
          commentStatus: this.reviewData.checkState,
          ...rc,
        };
        this.$showLoading();
        opha
          .recipeComment(this.currentRow.id, params)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success("点评成功");
              this.reviewsFlag = false;
              this.loadRightData();
            } else {
              this.$message.error(res.msg || "点评失败");
            }
            this.$hideLoading();
          })
          .catch((err) => {
            this.$hideLoading();
            this.$message.error(err.msg || "点评失败");
          });
      },
      sortChange({
        column,
        prop,
        order
      }) {
        // if (order === "descending") {
        //   this.mainOrderBy = "COMMENT_STATUS";
        // } else {
        //   this.mainOrderBy = "COMMENT_STATUS DESC";
        // }
        // // this.loadTable();
        // this.loadRightData();
      },
      finishReviews() {
        if (!this.curItem.id) {
          this.$message.warning("保存后的抽查单才允许点评");
          return;
        }
        this.$showLoading();
        opha
          .recipeInsEnd(this.curItem.id)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success("完成点评成功");
              this.search();
            } else {
              this.$message.error(res.msg || "完成点评失败");
            }
            this.$hideLoading();
          })
          .catch((err) => {
            this.$hideLoading();
            this.$message.error(err.msg || "完成点评失败");
          });
      },
      getdrugName(val) {
        this.mainSearch.backDrugName = val;
      },
      qtyValid(val, key) {

        const reg = /^\+?[1-9]\d*$/;
        console.log(val);
        const valid = reg.test(val);
        console.log(valid);
        if (!valid) {
          this.$message.warning("请输入正整数");
          this.$set(this.mainSearch, key, "");
        }
      },
      rateValid(val, key) {
        const valid = new RegExp(
          "^(([0-9]+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*))$"
        ).test(val);
        if (val > 1 || !valid) {
          this.$message.warning("请输入大于0小于等于1的数字");
          this.$set(this.mainSearch, key, "");
        }
      },
      // 导出
      exportExcel() {
        if (this.tableData.length === 0) {
          this.$message.warning("暂无要导出数据!");
          return;
        }
        let excelData = {
          title: ["抽查单", "", "", "", "", "", "", ""],
          where: [
            "抽查单号:" + this.curItem.inspectionNum,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          tHeader: [
            "处方号",
            "病人姓名",
            "出生日期",
            "处方味数",
            "总金额(元)",
            "开单医生",
            "医嘱时间",
            "发药时间",
          ],
          filterVal: [
            "recipeCode",
            "patientName",
            "patientBirthDate",
            "drugVarietyQuantity",
            "recipeAmt",
            "doctorUserName",
            "orderTime",
            "deliveryTime",
          ],
          listDate: this.tableData,
          fileName: "抽查单",
          merges: ["A1:H1"],
        };
        jsonToExcel(excelData);
      },
      // 打印
      print() {
        if (this.tableData.length === 0) {
          this.$message.warning("暂无要打印数据!");
          return;
        }
        let data = {};
        data.title = "抽查单";
        data.num = this.curItem.inspectionNum;
        let detailList = this.tableData.map((data) => {
          return {
            ...data,
          };
        });
        data.detailList = detailList;
        onPreview(data, "处方抽查单");
      },
    },
    beforeDestroy() {
      // 销毁时清空数据
      this.changeCurDrug("");
      this.changeCurPre("");
    },
  };
</script>
<style lang="scss" scoped>
  .patient-card-container {
    margin-bottom: 20px;
    height: 66px;
    width: 100%;
  }

  .wrapper {
    padding: 0;
    height: 100%;
    overflow: hidden;

    .main {
      width: 100%;
      height: 100%;

      .main_wrap {
        margin: 0 297px 0 350px;
        height: 100%;

        .pre-main {
          position: relative;
          padding: 16px;
        }

        .cftitle {
          .title {
            font-size: 20px;
            font-weight: bold;
            color: $l-color-fontcolor-3;
          }

          .label {
            color: $l-color-fontcolor-4;
            margin-right: 10px;
          }

          .pre {
            font-size: 16px;
            color: $l-color-fontcolor-3;
          }
        }

        .pre-bottom {}
      }
    }

    .left {
      width: 340px;
      height: 100%;
      margin-left: -100%;

      .table-top {
        position: relative;
        height: 100%;
        padding: 0 8px 16px;
        display: flex;
        flex-direction: column;
      }

      .table-list {
        flex: 1;
        margin-top: 8px;
        overflow: auto;
      }
    }

    .right {
      width: 287px;
      height: 100%;
      margin-left: -287px;
    }
  }

  .margin-bottom2 {
    margin-bottom: 2px;
  }

  .list-container {
    overflow-y: auto;
  }

  .list-item {
    padding: 6px 14px;

    &:nth-child(even) {
      background: $l-color-bgcolor-18;
    }

    &.active {
      background-color: $l-color-bgcolor-12 !important;
    }

    .el-col {
      line-height: 28px;
      color: $l-color-fontcolor-3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        color: $l-color-fontcolor-4;
        font-size: $l-font-size;
        margin-right: 5px;
      }
    }
  }

  /deep/ .el-card__body {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .align-center {
    line-height: 30px;
    text-align: center;
  }

  .pre-main-table {
    flex: 1;
    margin: 16px 0;
  }

  .drug-box {
    /deep/ .l-input-body-main>div {
      width: 100% !important;
    }
  }

  .pre-re-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: $l-color-white;
    transform: translateY(100%);
    transition: all 0.3s linear;

    &.active {
      transform: translateY(0);
    }
  }

  .pre-main-table2 {
    height: 300px;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .cftitle {
    .title {
      font-size: 20px;
      font-weight: bold;
      color: $l-color-fontcolor-3;
    }

    .label {
      color: $l-color-fontcolor-4;
      margin-right: 10px;
    }

    .pre {
      font-size: 16px;
      color: $l-color-fontcolor-3;
    }
  }

  .other-div {
    height: calc(100% - 54px);
    overflow: auto;
  }

  .pre-check-box {
    /deep/ .el-checkbox {
      display: block;
      line-height: 25px;
    }
  }

  .demo-ruleForm {
    /deep/ .l-input-wrap .l-input-body {
      vertical-align: top;
    }

    .el-form-item {
      margin-bottom: 2px;
      margin-right: 8px;
    }
  }
</style>
