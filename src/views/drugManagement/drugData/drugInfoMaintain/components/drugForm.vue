<template>
  <div class="drugForm width100 height100" v-loading="mainLoading">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom: 1px solid #e4e4e4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">药品信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <el-tabs class="tabs width100" v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="drugFormDeail" :model="drugFormDeail" :rules="rules">
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="drugName">
                  <l-formt-title
                    label="药品名称"
                    labelWidth="76"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <!-- <el-input v-model="drugFormDeail.drugName" style="line-height: 34px" :disabled="!drugFormDeail.update"></el-input> -->
                    <span
                      style="display: inline-block; height: 32; color: #000000"
                    >
                      <span>{{ drugFormDeail.drugNameA }}</span>
                      <span
                        v-if="
                          drugFormDeail.commonNameVO.tradeName &&
                            drugFormDeail.commonNameVO.tradeName != ''
                        "
                        >({{ drugFormDeail.commonNameVO.tradeName }})</span
                      >
                    </span>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="drugName">
                  <l-formt-title
                    label="药品通用名"
                    labelWidth="76"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <el-input
                      v-model="drugFormDeail.generalName"
                      style="line-height: 34px"
                      @keyup.native="generalNameFun"
                      :disabled="!drugFormDeail.update"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="spec">
                  <l-formt-title
                    label="规格"
                    labelWidth="48"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <el-input
                      v-model="drugFormDeail.spec"
                      style="line-height: 34px"
                      :disabled="!drugFormDeail.update"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="phoneticCode">
                  <l-formt-title
                    label="拼音码"
                    labelWidth="62"
                    :disabled="true"
                  >
                    <el-input
                      v-model="drugFormDeail.phoneticCode"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="fiveStrokeCode">
                  <l-formt-title
                    label="五笔码"
                    labelWidth="62"
                    :disabled="true"
                  >
                    <el-input
                      v-model="drugFormDeail.fiveStrokeCode"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="cwType">
                  <l-formt-title label="药品类型" labelWidth="76" required>
                    <l-shotcut-input
                      component="el-select"
                      v-model="drugFormDeail.cwType"
                      placeholder="请选择"
                      @change="changCwType"
                    >
                      <el-option
                        v-for="item in cwTypelist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </l-shotcut-input>
                  </l-formt-title>
                  <!-- <l-value-domain code="DrugManaType" :value.sync="drugFormDeail.cwType" /> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="classCode">
                  <l-formt-title label="分类码" labelWidth="62" required>
                    <!-- <l-shotcut-input component="l-value-domain" code="DrugTypeCode" :value.sync="drugFormDeail.classCode"
                      placeholder="请选择">
                    </l-shotcut-input> -->
                    <l-shotcut-input
                      component="l-select-comp"
                      code="DrugTypeCode"
                      :existKey="drugFormDeail.classCode"
                      :value.sync="drugFormDeail.classCode"
                      placeholder="请选择"
                    >
                    </l-shotcut-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="formCode">
                  <l-formt-title label="剂型" labelWidth="76" required>
                    <el-select
                      v-model="drugFormDeail.formCode"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="DosageFormRemoteMethod"
                      :focus="DosageFormRemoteMethod"
                      :loading="DosageFormLoading"
                    >
                      <el-option
                        v-for="item in DosageFormOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                    <!-- <l-value-domain
                      :key="formCodeKey"
                      :value.sync="drugFormDeail.formCode"
                      :remoteUrl="`/hmm-stock/form/listForDropDown?cwType=${formCodeParams}`"
                      remoteShowKey="name"
                      remoteValueKey="code"
                      placeholder="请选择"
                      :localFilterKeys="['keyword']"
                    ></l-value-domain> -->
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="manageType">
                  <l-formt-title label="管理类型" labelWidth="76" required>
                    <l-value-domain
                      code="DrugManaType"
                      :value.sync="drugFormDeail.manageType"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="price">
                  <l-formt-title
                    label="售价"
                    labelWidth="76"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <el-input
                      v-model="drugFormDeail.price"
                      :disabled="!drugFormDeail.update"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="dosageValue" required>
                  <l-formt-title
                    label="剂量值"
                    labelWidth="62"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <el-input
                      v-model="drugFormDeail.dosageValue"
                      style="line-height: 34px; width: 100%"
                      :disabled="!drugFormDeail.update"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="dosageUnit">
                  <l-formt-title
                    label="剂量单位"
                    labelWidth="76"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <!-- <l-value-domain
                      code="DrugDoseUnit"
                      :disabled="!drugFormDeail.update"
                      :value.sync="drugFormDeail.dosageUnit"
                    /> -->

                    <l-select-comp
                      code="DrugDoseUnit"
                      :existKey="drugFormDeail.dosageUnit"
                      :disabled="!drugFormDeail.update"
                      :value.sync="drugFormDeail.dosageUnit"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="packQuantity">
                  <l-formt-title
                    label="包装量"
                    labelWidth="62"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <el-input
                      v-model="drugFormDeail.packQuantity"
                      style="line-height: 34px; width: 100%"
                      :disabled="!drugFormDeail.update"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="packUnit">
                  <l-formt-title
                    label="最小单位"
                    labelWidth="76"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <!-- <l-value-domain
                      code="DrugUnit"
                      :disabled="!drugFormDeail.update"
                      :value.sync="drugFormDeail.packUnit"
                    /> -->
                    <l-select-comp
                      code="DrugUnit"
                      :existKey="drugFormDeail.packUnit"
                      :disabled="!drugFormDeail.update"
                      :value.sync="drugFormDeail.packUnit"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="entPackQuantity">
                  <l-formt-title label="采购包装量" labelWidth="62">
                    <el-input
                      v-model="drugFormDeail.entPackQuantity"
                      style="line-height: 34px; width: 100%"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label label-width prop="entUnit">
                  <l-formt-title label=" 采购单位" labelWidth="76">
                    <!-- <l-value-domain
                      code="DrugUnit"
                      :value.sync="drugFormDeail.entUnit"
                    /> -->
                    <l-select-comp
                      code="DrugUnit"
                      :existKey="drugFormDeail.entUnit"
                      :value.sync="drugFormDeail.entUnit"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="drugUnit">
                  <l-formt-title
                    label="包装单位"
                    labelWidth="48"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <!-- <l-value-domain
                      code="DrugUnit"
                      :value.sync="drugFormDeail.drugUnit"
                      :disabled="!drugFormDeail.update"
                    /> -->

                    <l-select-comp
                      code="DrugUnit"
                      :existKey="drugFormDeail.drugUnit"
                      :disabled="!drugFormDeail.update"
                      :value.sync="drugFormDeail.drugUnit"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="baseCode">
                  <l-formt-title label="本位码维护" labelWidth="62">
                    <el-input
                      v-model="drugFormDeail.baseCode"
                      maxlength="20"
                      style="line-height: 34px; width: 100%"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="originCode">
                  <l-formt-title
                    label="生产厂商"
                    labelWidth="76"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <!-- <l-value-domain
                      code="Manufacturer"
                      :disabled="!drugFormDeail.update"
                      :value.sync="drugFormDeail.originCode"
                    /> -->

                    <l-select-comp
                      code="Manufacturer"
                      :existKey="drugFormDeail.originCode"
                      :disabled="!drugFormDeail.update"
                      :value.sync="drugFormDeail.originCode"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="originIdentificationCode">
                  <l-formt-title
                    label="生产厂商标识"
                    labelWidth="104"
                    required
                    :disabled="!drugFormDeail.update"
                  >
                    <l-value-domain
                      code="DrugManufacturerFlag"
                      :value.sync="drugFormDeail.originIdentificationCode"
                      :disabled="!drugFormDeail.update"
                    />
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="originManufacturerCode">
                  <l-formt-title label="源产地" labelWidth="62">
                    <el-input
                      v-model="drugFormDeail.originManufacturerCode"
                      maxlength="8"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="approveNum">
                  <l-formt-title label="国药准字号" labelWidth="90" required>
                    <el-input
                      v-model="drugFormDeail.approveNum"
                      :maxlength="36"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="controlLevel">
                  <l-formt-title label="药品报销类型" labelWidth="90" required>
                    <l-value-domain
                      code="DrugReimbursementType"
                      :value.sync="drugFormDeail.controlLevel"
                    ></l-value-domain>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label
                  label-width
                  prop="basicType"
                  style="width: 100%"
                >
                  <l-formt-title label="基本药品类型" labelWidth="76" required>
                    <l-value-domain
                      code="BasicDrugType"
                      :value.sync="drugFormDeail.basicType"
                    ></l-value-domain>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label
                  label-width
                  prop="frequencyCode"
                  style="width: 100%"
                >
                  <l-formt-title label="默认频次" labelWidth="76">
                    <cis-value-domain
                      :remoteParams="remoteParams"
                      clearable
                      remoteUrl="/frequency/pageList"
                      :value.sync="drugFormDeail.frequencyCode"
                      placeholder="请选择频次"
                      remoteShowKey="frequencyName"
                      remoteValueKey="frequencyCode"
                      @change="changFreCode"
                    ></cis-value-domain>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="majorOrders">
                  <l-formt-title label="医嘱大类" labelWidth="76" required>
                    <el-select
                      v-model="drugFormDeail.majorOrders"
                      @change="doctorsAdviceChange"
                    >
                      <el-option label="西药" value="10"></el-option>
                      <el-option label="中成药" value="12"></el-option>
                      <el-option label="中草药" value="11"></el-option>
                    </el-select>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label label-width prop="subclassOrders">
                  <l-formt-title
                    label="医嘱子类"
                    :disabled="!drugFormDeail.majorOrders"
                    v-if="remoteSonParamsStyle"
                    labelWidth="76"
                    required
                  >
                    <l-value-domain
                      :disabled="!drugFormDeail.majorOrders"
                      clearable
                      :remoteUrl="
                        '/doctorsAdvice/list?pageSize=10&parentCode=' +
                          remoteSonParams.parentId
                      "
                      type="select"
                      :value.sync="drugFormDeail.subclassOrders"
                      remoteShowKey="doctorsAdviceName"
                      remoteValueKey="doctorsAdviceCode"
                    ></l-value-domain>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label
                  label-width
                  prop="useWay"
                  style="width: 100%"
                >
                  <l-formt-title label="默认用法" :key="activeName">
                    <template v-if="drugFormDeail.majorOrders === '11'">
                      <l-value-domain
                        code="usage"
                        :value.sync="drugFormDeail.useWay"
                        clearable
                        key="usage"
                      ></l-value-domain>
                    </template>
                    <template v-else>
                      <l-value-domain
                        code="MedicationRouteCode"
                        :value.sync="drugFormDeail.useWay"
                        clearable
                        key="MedicationRouteCode"
                      ></l-value-domain>
                    </template>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label
                  label-width
                  prop="oneDosage"
                  style="width: 100%"
                >
                  <l-formt-title label="默认用量" :key="activeName">
                    <el-input-number
                      v-model="drugFormDeail.oneDosage"
                      controls-position="right"
                      clearable
                      :min="0"
                      :max="999999"
                    ></el-input-number>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :spna="24">
                <l-formt-title label="注意事项">
                  <el-input v-model="drugFormDeail.recordRemark"></el-input>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="roundingMode">
                  <l-formt-title label="取整方式" labelWidth="76">
                    <el-select
                      v-model="drugFormDeail.roundingMode"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in wholeWayList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="8" style="display: none">
                <el-form-item label label-width prop="halfUseFlg">
                  <el-checkbox v-model="drugFormDeail.halfUseFlg"
                    >是否可剥半</el-checkbox
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label label-width prop="unitSaleFlg">
                  <el-checkbox v-model="drugFormDeail.unitSaleFlg"
                    >是否可拆零</el-checkbox
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label label-width prop="isOtc">
                  <el-checkbox v-model="drugFormDeail.isOtc">OTC</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="antibioticDdd">
                  <l-formt-title
                    :disabled="true"
                    label="社保目录编码"
                    labelWidth="90"
                  >
                    <el-input
                      v-model="drugFormDeail.siItemCode"
                      disabled
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label label-width prop="status">
                  <l-formt-title
                    :disabled="true"
                    label="限制性说明"
                    labelWidth="90"
                  >
                    <el-input
                      v-model="drugFormDeail.siRestricDsp"
                      disabled
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="antibioticDdd">
                  <l-formt-title
                    :disabled="true"
                    label="医保支付上限"
                    labelWidth="90"
                  >
                    <el-input
                      v-model="drugFormDeail.siPayUpLimit"
                      disabled
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label label-width prop="status">
                  <l-formt-title
                    :disabled="true"
                    label="记账标志"
                    labelWidth="90"
                  >
                    <el-input
                      v-model="drugFormDeail.siPayFlagName"
                      disabled
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 4px" :gutter="10">
              <el-col :span="12">
                <el-form-item label label-width prop="antibioticDdd">
                  <l-formt-title label="DDD值" labelWidth="90">
                    <el-input
                      v-model="drugFormDeail.antibioticDdd"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label label-width prop="status">
                  <l-formt-title label="启用状态" labelWidth="76" required>
                    <el-select
                      v-model="drugFormDeail.status"
                      style="line-height: 34px"
                    >
                      <el-option
                        v-for="item in statuslist"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              style="margin-top: 4px"
              :gutter="10"
              v-if="!drugFormDeail.isnew"
            >
              <el-col :span="24">
                <el-form-item label label-width prop="createdByName">
                  <l-formt-title
                    label="创建人"
                    labelWidth="62"
                    :disabled="true"
                  >
                    <el-input
                      v-model="drugFormDeail.createdByName"
                      style="line-height: 34px"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              style="margin-top: 4px"
              :gutter="10"
              v-if="!drugFormDeail.isnew"
            >
              <el-col :span="24">
                <el-form-item label label-width prop="createdAt">
                  <l-formt-title
                    label="创建时间"
                    labelWidth="76"
                    :disabled="true"
                  >
                    <el-input
                      v-model="drugFormDeail.createdAt"
                      style="line-height: 34px"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              style="margin-top: 4px"
              :gutter="10"
              v-if="!drugFormDeail.isnew"
            >
              <el-col :span="24">
                <el-form-item label label-width prop="updatedByName">
                  <l-formt-title
                    label="修改人"
                    labelWidth="62"
                    :disabled="true"
                  >
                    <el-input
                      v-model="drugFormDeail.updatedByName"
                      style="line-height: 34px"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              style="margin-top: 4px"
              :gutter="10"
              v-if="!drugFormDeail.isnew"
            >
              <el-col :span="24">
                <el-form-item label label-width prop="updatedAt">
                  <l-formt-title
                    label="修改时间"
                    labelWidth="76"
                    :disabled="true"
                  >
                    <el-input
                      v-model="drugFormDeail.updatedAt"
                      style="line-height: 34px"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="名称维护" name="second">
          <el-form ref="drugForm" :model="this.drugFormDeail">
            <el-row style="margin-top: 10px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="drugName">
                  <l-formt-title
                    label="药品通用名"
                    labelWidth="90"
                    :disabled="true"
                  >
                    <el-input
                      v-model="drugFormDeail.generalName"
                      style="line-height: 34px"
                      :disabled="true"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="tradeName">
                  <l-formt-title label="药品商品名" labelWidth="90">
                    <el-input
                      v-model="drugFormDeail.commonNameVO.tradeName"
                      style="line-height: 34px"
                      :disabled="
                        drugFormDeail.markStyle || !drugFormDeail.update
                      "
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px" :gutter="10">
              <el-col :span="24">
                <el-form-item label label-width prop="englishName">
                  <l-formt-title label="药品英文名" labelWidth="90">
                    <el-input
                      v-model="drugFormDeail.commonNameVO.englishName"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              style="margin-top: 10px"
              :gutter="10"
              v-for="(item, index) in drugFormDeail.commonNameVO
                .anotherNameList"
              :key="index"
            >
              <el-col :span="20">
                <el-form-item label label-width prop="anotherName">
                  <l-formt-title label="药品别名" labelWidth="76">
                    <el-input
                      v-model="item.anotherName"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <span class="remove-button" @click="deleteAnoName(index)">
                  <svg
                    t="1568190829279"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="13492"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z"
                      fill="#FFE3E2"
                      p-id="13493"
                    />
                    <path
                      d="M284.444444 455.111111h455.111112v113.777778H284.444444z"
                      fill="#E1140A"
                      p-id="13494"
                    />
                  </svg>
                </span>
                <span
                  class="add-button"
                  @click="addAnoName(item)"
                  v-if="
                    index ==
                      drugFormDeail.commonNameVO.anotherNameList.length - 1
                  "
                >
                  <svg
                    t="1568190873204"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="13604"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 56.888889a455.111111 455.111111 0 1 0 0 910.222222A455.111111 455.111111 0 0 0 512 56.888889z"
                      fill="#E4E4E4"
                      p-id="13605"
                    />
                    <path
                      d="M227.555556 455.111111h568.888888v113.777778H227.555556z"
                      fill="#2E323A"
                      p-id="13606"
                    />
                    <path
                      d="M455.111111 227.555556h113.777778v568.888888H455.111111z"
                      fill="#2E323A"
                      p-id="13607"
                    />
                  </svg>
                </span>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="附加属性" name="third">
          <el-form ref="drugForm" :model="this.drugFormDeail">
            <el-row
              style="margin-top: 10px"
              :gutter="10"
              v-for="(item, index) in drugFormDeail.drugAttrPOList"
              :key="index"
            >
              <el-col :span="10">
                <el-select
                  @change="selectlist($event, index)"
                  v-model="item.attributeCode"
                  placeholder="请选择"
                  :disabled="item.isSave"
                >
                  <el-option
                    v-for="i in favorites"
                    :key="i.code"
                    :label="i.name"
                    :value="i.code"
                  />
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-select
                  v-model="item.attributeValue"
                  v-loading="item.selLoad"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="i in item.localFavorites"
                    :key="i.id"
                    :label="i.attributeValueName"
                    :value="i.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="4">
                <span class="remove-button" @click="deleteAppend(index)">
                  <svg
                    t="1568190829279"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="13492"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z"
                      fill="#FFE3E2"
                      p-id="13493"
                    />
                    <path
                      d="M284.444444 455.111111h455.111112v113.777778H284.444444z"
                      fill="#E1140A"
                      p-id="13494"
                    />
                  </svg>
                </span>
                <span
                  class="add-button"
                  @click="addAppend(item)"
                  v-if="index === drugFormDeail.drugAttrPOList.length - 1"
                >
                  <svg
                    t="1568190873204"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="13604"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 56.888889a455.111111 455.111111 0 1 0 0 910.222222A455.111111 455.111111 0 0 0 512 56.888889z"
                      fill="#E4E4E4"
                      p-id="13605"
                    />
                    <path
                      d="M227.555556 455.111111h568.888888v113.777778H227.555556z"
                      fill="#2E323A"
                      p-id="13606"
                    />
                    <path
                      d="M455.111111 227.555556h113.777778v568.888888H455.111111z"
                      fill="#2E323A"
                      p-id="13607"
                    />
                  </svg>
                </span>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="button-cont">
        <!-- :disabled="drugFormDeail.update == false"-->
        <el-button
          type="primary"
          @click="confirm"
          v-hotKey="{ func: 'func_save' }"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import base from "@/api/hmm/base";
import CisValueDomain from "@/views/cis/components/CisValueDomain.vue";
import localForage from "localforage";
import { getPamars, setPamars } from "@/utils/auth";
import cloneDeep from "lodash/cloneDeep";
import { deltaImportQuery } from "@/api/admin/role.js";

export default {
  props: ["drugForm"],
  components: {
    CisValueDomain
  },
  data() {
    var isnumber = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        var reg = /^-?\d{1,16}(?:\.\d{1,4})?$/; //小数点左边最高16位，小数点右边最多4位
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("输入正确的数字,小数点后可1到4位"));
        }
      }
    };

    return {
      activeName: "first",
      remoteSonParamsStyle: true,
      cwTypelist: [
        {
          id: "1",
          name: "西药"
        },
        {
          id: "2",
          name: "中成药"
        },
        {
          id: "3",
          name: "中草药"
        }
      ], //药品类型
      statuslist: [
        {
          code: "0",
          name: "暂停"
        },
        {
          code: "1",
          name: "正常"
        }
      ], //状态标识数据源
      // 取整方式
      wholeWayList: [
        {
          value: "1",
          label: "总量取整" //通常为口服药品，即按照单次用量、频次、用药天数来计算数量（包装单位的数量）；
        },
        {
          value: "2",
          label: "单次取整" //通常为针剂，即一次用药若用量不满1支（最小单位）的，按1支计，之后再按照频次、用药天数计算使用用药数量；
        },
        {
          value: "3",
          label: "不取整(剥半)" //原口服药品剥半；
        }
      ],

      remoteParams: {
        pageSize: 50,
        status: "1"
      },
      drugFormright: {},
      drugFormDeail: {
        isnew: true,
        approveNum: "",
        basicType: "",
        classCode: "",
        controlLevel: "",
        cwType: "",
        dataVersion: 0,
        deletedStatus: "",
        dosageUnit: "",
        dosageValue: "",
        drugName: "",
        drugNameA: "",
        generalName: "",
        drugUnit: "",
        formCode: "",
        hosCode: "",
        hosId: "",
        id: "",
        manageType: "",
        maxPrice: "",
        orgCode: "",
        orgId: "",
        originCode: "",
        roundingMode: "1", //取整方式
        originIdentificationCode: "",
        originManufacturerCode: "",
        isOtc: false,
        unitSaleFlg: false,
        halfUseFlg: false,
        packQuantity: "",
        packUnit: "",
        phoneticCode: "",
        price: "",
        recordRemark: "",
        spec: "",
        antibioticDdd: "",
        status: "1",
        entPackQuantity: "",
        baseCode: "", //本位码维护
        entUnit: "",
        commonNameVO: {
          anotherNameList: [
            {
              anotherName: ""
            }
          ],
          commonName: "",
          englishName: "",
          tradeName: ""
        },
        drugAttrPOList: [
          {
            attributeCode: "",
            attributeValue: "",
            selLoad: false,
            isSave: false,
            localFavorites: [] //右侧侧下拉框数据
          }
        ],
        update: true
      },
      favorites: [], //左侧下拉框数据
      rules: {
        drugName: [
          {
            required: true,
            message: "请输入药品名称",
            trigger: "blur"
          }
        ],
        spec: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          }
        ],
        cwType: [
          {
            required: true,
            message: "请选择药品类型",
            trigger: "change"
          }
        ],
        classCode: [
          {
            required: true,
            message: "请选择药品分类码",
            trigger: "change"
          }
        ],
        formCode: [
          {
            required: true,
            message: "请选择药品剂型",
            trigger: "change"
          }
        ],
        manageType: [
          {
            required: true,
            message: "请选择药品管理类型",
            trigger: "change"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入药品售价",
            trigger: "blur"
          }
        ],
        dosageValue: [
          {
            required: true,
            message: "请输入药品剂量值",
            trigger: "blur",
            validator: isnumber
          }
        ],
        dosageUnit: [
          {
            required: true,
            message: "请选择药品剂量单位",
            trigger: "change"
          }
        ],
        packQuantity: [
          {
            required: true,
            message: "请输入药品包装量",
            trigger: "blur"
          }
        ],
        packUnit: [
          {
            required: true,
            message: "请选择药品包装单位",
            trigger: "change"
          }
        ],
        drugUnit: [
          {
            required: true,
            message: "请选择药品单位",
            trigger: "change"
          }
        ],
        originCode: [
          {
            required: true,
            message: "请选择药品生产厂商",
            trigger: "change"
          }
        ],
        originIdentificationCode: [
          {
            required: true,
            message: "请选择药品生产厂商标识",
            trigger: "change"
          }
        ],
        approveNum: [
          {
            required: true,
            message: "请输入药品国药准字号",
            trigger: "blur"
          }
        ],
        controlLevel: [
          {
            required: true,
            message: "请选择药品报销类型",
            trigger: "change"
          }
        ],
        basicType: [
          {
            required: true,
            message: "请选择基本药品类型",
            trigger: "change"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择启用状态",
            trigger: "change"
          }
        ],
        majorOrders: [
          {
            required: true,
            message: "请选择医嘱大类",
            trigger: "change"
          }
        ],
        subclassOrders: [
          {
            required: true,
            message: "请选择医嘱小类",
            trigger: "change"
          }
        ]
      },
      mainLoading: false,
      remoteParams: {
        pageSize: 10,
        parentId: "0"
      }, // 分页参数
      remoteSonParams: {
        pageSize: 10,
        parentId: "-1"
      }, // 分页参数
      formCodeKey: new Date().getTime(),
      formCodeParams: "",
      // 2021 05 08 剂型bug
      DosageFormOptions: [],
      DosageFormLoading: false,
      DosageFormCode: 1
    };
  },
  watch: {
    drugForm(val) {
      if (val && val.id) {
        this.remoteSonParamsStyle = false;
        this.$refs.drugFormDeail.resetFields();
        this.drugFormright = { ...val };
        this.drugDeail(this.drugFormright.id);
        this.remoteSonParams.parentId = val.majorOrders;
        this.$nextTick(function() {
          this.remoteSonParamsStyle = true;
        });
      }
    },
    drugFormDeail(val) {
      // debugger
      // if(this.drugFormDeail && this.drugFormDeail.id.length == 0){
      //     window.sessionStorage.setItem("drugFormDeailStyle",true);
      // }else{
      //     window.sessionStorage.setItem("drugFormDeailStyle",false);
      // }
    }
  },
  mounted() {
    this.favorfun();
    window.sessionStorage.setItem("drugFormDeailStyle", false);
    /* window.addEventListener('keydown',function(e){
        console.log(e);
      },false) */
    this.DosageFormRemoteMethod("");
  },
  methods: {
    // 2021 05 08 剂型bug
    async DosageFormRemoteMethod(query) {
      this.DosageFormLoading = true;
      try {
        const res = await get(
          `/hmm-stock/form/listForDropDown?cwType=${this.formCodeParams}&keyword=${query}`
        );
        this.DosageFormOptions = res.data;
        this.DosageFormLoading = false;
      } catch (err) {
        console.error("err", err);
        this.DosageFormLoading = false;
      }
    },
    theQueryFun(a) {
      let num = a.indexOf("(");
      let objList = "";
      if (num !== -1) {
        objList = a.split("(")[0];
      } else {
        objList = a;
      }
      return objList;
    },
    //商品名称拼接到商品名称后面
    generalNameFun() {
      this.drugFormDeail.drugName = this.drugFormDeail.generalName;
      this.drugFormDeail.drugNameA = this.drugFormDeail.generalName;
    },
    // 药品类型切换
    changCwType() {
      this.$set(this.drugFormDeail, "formCode", "");
      this.DosageFormOptions = [];
      // const codeList = {
      //   1: "1",
      //   2: "1",
      //   3: "2"
      // };
      // this.DosageFormCode = codeList[this.drugFormDeail.cwType] || "";
      this.refreshFormCodeList();
      this.DosageFormRemoteMethod("");
    },
    refreshFormCodeList() {
      const codeList = {
        1: "1",
        2: "1",
        3: "2"
      };
      const code = codeList[this.drugFormDeail.cwType] || "";
      if (this.formCodeParams !== code) {
        this.formCodeParams = code;
        this.formCodeKey += 1;
      }
    },
    //获取右侧数据
    drugDeail(id) {
      this.mainLoading = true;
      base
        .getDrugId(id)
        .then(res => {
          this.drugFormDeail = res.data;
          this.refreshFormCodeList();
          this.DosageFormRemoteMethod("");
          if (this.drugFormDeail.drugAttrPOList.length > 0) {
            this.drugFormDeail.drugAttrPOList.forEach((item, index) => {
              this.$set(this.drugFormDeail.drugAttrPOList, index, {
                ...this.drugFormDeail.drugAttrPOList[index],
                // 附加属性已保存的左侧不允许切换，右侧可以，如果附加属性为空则不锁定
                isSave: item.attributeCode === "" ? false : true,
                // 附加属性右侧值select的v-loading
                selLoad: true
              });
              // 获取附加属性右侧的值拉下数据
              this.selectlist(item.attributeCode, index, true);
            });
          }
          this.mainLoading = false;
        })
        .catch(err => {
          this.mainLoading = false;
        });
    },

    //删除别名
    deleteAnoName(index) {
      if (this.drugFormDeail.commonNameVO.anotherNameList.length <= 1) {
        this.$delete(this.drugFormDeail.commonNameVO.anotherNameList, index);
        this.drugFormDeail.commonNameVO.anotherNameList.push({
          anotherName: ""
        });
      } else {
        this.$delete(this.drugFormDeail.commonNameVO.anotherNameList, index);
      }
    },
    //新增别名
    addAnoName(item) {
      if (item.anotherName == "") {
        this.$message.error("不能为空");
      } else {
        this.drugFormDeail.commonNameVO.anotherNameList.push({
          anotherName: ""
        });
      }
    },

    //获取左侧下拉框数据
    async favorfun() {
      try {
        let data = await base.attributeType();
        let tableData = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          tableData.push(item);
        }
        this.favorites = tableData;
      } catch (error) {
        this.$message.error(error.msg || "获取附加属性失败");
      }
    },

    //左侧选择框选择后渲染右侧选择框数据
    async selectlist(val, index, flag) {
      //根据左侧选择框id 请求右侧框数据
      try {
        /*  手动切换附加属性，清空右侧的值
         *  不传flag的是手动切换
         *  传flag的是根据接口传过来的附加属性列表获取右侧的值
         */
        if (!flag) {
          // 附加属性去重，不允许添加相同的属性
          const data = this.drugFormDeail.drugAttrPOList.filter(
            item => item.attributeCode === val
          );

          if (data.length > 1) {
            this.$set(this.drugFormDeail.drugAttrPOList, index, {
              ...this.drugFormDeail.drugAttrPOList[index],
              attributeCode: "",
              attributeValue: ""
            });
            console.log(
              this.drugFormDeail.drugAttrPOList,
              "打印编辑数据的结构1"
            );
            return;
          }
          // 清空右侧的值
          this.$set(this.drugFormDeail.drugAttrPOList, index, {
            ...this.drugFormDeail.drugAttrPOList[index],
            attributeValue: "",
            selLoad: true
          });
        }

        let data = await base.attributeTyperight({
          attributeCode: val
        });
        let tableData = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          tableData.push(item);
        }
        // 判断商品名是否可以编辑 如果是头 商品名称就可以编辑，如果没有就可以让编辑 start
        let markStyle = false;
        if (!this.drugFormDeail.commonNameVO.tradeName) {
          markStyle = false;
        } else {
          markStyle = true;
        }
        // 判断商品名是否可以编辑 如果是头 商品名称就可以编辑，如果没有就可以让编辑 end
        this.$set(this.drugFormDeail.drugAttrPOList, index, {
          ...this.drugFormDeail.drugAttrPOList[index],
          localFavorites: tableData,
          selLoad: false
        });
        this.drugFormDeail.generalName = this.theQueryFun(
          this.drugFormDeail.drugName
        );
        this.drugFormDeail.drugNameA = this.theQueryFun(
          this.drugFormDeail.drugName
        );
        this.drugFormDeail.markStyle = markStyle;
        console.log(this.drugFormDeail, "打印编辑数据的结构2");
      } catch (error) {
        console.log(error);
        this.$set(this.drugFormDeail.drugAttrPOList, index, {
          ...this.drugFormDeail.drugAttrPOList[index],
          selLoad: false
        });
        this.$message.error(error.msg || "附加属性查询失败");
      }
    },

    //删除附加属性
    deleteAppend(index) {
      // 如果是删除最后一个，则把最后一个数据清空
      if (this.drugFormDeail.drugAttrPOList.length <= 1) {
        this.$set(this.drugFormDeail.drugAttrPOList, index, {
          ...this.drugFormDeail.drugAttrPOList[index],
          isSave: false,
          attributeCode: "",
          attributeValue: ""
        });
      } else {
        this.$delete(this.drugFormDeail.drugAttrPOList, index);
      }
    },
    //新增
    addAppend(item) {
      if (item.attributeCode == "" || item.attributeValue == "") {
        this.$message.error("不能为空");
      } else {
        this.drugFormDeail.drugAttrPOList.push({
          attributeCode: "",
          attributeValue: "",
          selLoad: false,
          isSave: false,
          localFavorites: []
        });
      }
    },

    //新增
    newadd() {
      window.sessionStorage.setItem("drugFormDeailStyle", true);
      this.activeName = "first";
      this.$refs.drugFormDeail.resetFields();
      drugName: "",
        (this.drugFormDeail = {
          isnew: true,
          approveNum: "",
          basicType: "",
          classCode: "",
          controlLevel: "",
          cwType: "",
          dataVersion: 0,
          deletedStatus: "",
          dosageUnit: "",
          dosageValue: "",
          drugName: "",
          drugNameA: "",
          generalName: "",
          drugUnit: "",
          formCode: "",
          hosCode: "",
          hosId: "",
          id: "",
          manageType: "",
          maxPrice: "",
          orgCode: "",
          orgId: "",
          originCode: "",
          roundingMode: "1", //取整方式
          originIdentificationCode: "",
          originManufacturerCode: "",
          isOtc: false,
          unitSaleFlg: false,
          halfUseFlg: false,
          packQuantity: "",
          packUnit: "",
          phoneticCode: "",
          price: "",
          recordRemark: "",
          spec: "",
          antibioticDdd: "",
          status: "1",
          entPackQuantity: "",
          entUnit: "",
          update: true,
          commonNameVO: {
            anotherNameList: [
              {
                anotherName: ""
              }
            ],
            commonName: "",
            englishName: "",
            tradeName: ""
          },
          drugAttrPOList: [
            {
              attributeCode: "",
              attributeValue: "",
              selLoad: false,
              isSave: false,
              localFavorites: []
            }
          ]
        });
      this.$emit("newadd");
    },
    //修改某一条药品数据
    confirm() {
      this.$refs.drugFormDeail.validate(valid => {
        if (valid) {
          let anotherNameList = [];
          let drugAttrPOList = [];
          if (Array.isArray(this.drugFormDeail.commonNameVO.anotherNameList)) {
            this.drugFormDeail.commonNameVO.anotherNameList.forEach(item => {
              let anotherName = item.anotherName;
              anotherNameList.push({
                anotherName
              });
            });
          }
          if (Array.isArray(this.drugFormDeail.drugAttrPOList)) {
            this.drugFormDeail.drugAttrPOList.forEach(item => {
              let attributeCode = item.attributeCode;
              let attributeValue = item.attributeValue;
              if (attributeCode) {
                drugAttrPOList.push({
                  attributeCode,
                  attributeValue
                });
              }
            });
          }
          let commonNameVO = {
            commonName: this.drugFormDeail.drugName,
            englishName: this.drugFormDeail.commonNameVO.englishName,
            tradeName: this.drugFormDeail.commonNameVO.tradeName,
            anotherNameList: anotherNameList
          };

          let params = {
            ...this.drugFormDeail,
            commonNameVO,
            drugAttrPOList
          };
          if (
            this.drugFormDeail.commonNameVO.tradeName &&
            this.drugFormDeail.commonNameVO.tradeName != ""
          ) {
            params.drugName =
              this.drugFormDeail.drugNameA +
              "(" +
              this.drugFormDeail.commonNameVO.tradeName +
              ")";
          }
          if (this.drugFormDeail.id.length == 0) {
            params.dataVersion = 0;
          }
          base
            .adddrug(params)
            .then(res => {
              if (res.code === 1) {
                window.sessionStorage.setItem("drugFormDeailStyle", false);
                this.$message.success("保存成功");
                this.loading = false;
                this.$emit("getRefreshList", this.drugFormDeail);
                this.$hideLoading();
                this.UpdateMedicineCache();
              } else {
                this.$message.error(res.msg || "保存失败");
              }
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存失败");
            });
        }
      });
    },
    // 更新药品缓存
    async UpdateMedicineCache() {
      // 获取药品数据
      try {
        let tempUpdateTime = "";
        console.log(`tempUpdateTime`, tempUpdateTime);
        const res = await deltaImportQuery({ updateTime: "" });

        if (tempUpdateTime === "") {
          console.log(`GetDrugData 新增--------`, res.data);
          this.setLocalForage("AllDrugData", res.data);
        }
        this.setLocalForage(
          "drugUpdateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
      } catch (err) {
        console.log("GetDrugData失败", err);
        console.log(err);
      }
    },
    setLocalForage(name, data) {
      localForage
        .setItem(name, data)
        .then(function(value) {
          console.log("setLocalForage成功", value);
        })
        .catch(function(err) {
          console.log("setLocalForage失败", err);
        });
    },
    doctorsAdviceChange(value) {
      this.remoteSonParamsStyle = false;
      this.$set(this.drugFormDeail, "subclassOrders", "");
      this.$set(this.drugFormDeail, "useWay", "");
      this.remoteSonParams = {
        pageSize: 10,
        parentId: value
      };
      this.remoteSonParams.parentId = value;
      this.$set(this.remoteSonParams, "parentId", value);
      console.log(this.remoteSonParams, "医嘱子类查询返回数据");
      this.$nextTick(function() {
        this.remoteSonParamsStyle = true;
      });
    },
    // 频次切换
    changFreCode(val, item) {
      this.drugFormDeail.frequencyUnit = item.cycleUnit;
      this.drugFormDeail.frequencyTimes = item.frequencyTimes;
    }
  }
};
</script>

<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;

    .el-form-item {
      margin-bottom: 0;

      /deep/ .el-form-item__content {
        height: 36px;
      }
    }

    .cardTitleStyle {
      padding: 8px 0px;
    }

    .tabs {
      height: calc(100% - 130px);

      /deep/ .el-tabs__content {
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
      }

      .remove-button,
      .add-button {
        width: 18px;
        height: 18px;
        margin-top: 8px;
        display: inline-block;
      }

      .remove-button {
        margin-right: 10px;
      }
    }

    .button-cont {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;
      text-align: right;

      .confirm-button {
        width: 80px;
        height: 36px;
        padding: 0;
        text-align: center;
        line-height: 36px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;

        font-weight: 400;
        color: $l-color-white;
        float: right;
      }
    }
  }
}
</style>
