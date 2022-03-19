<template>
  <div class="dict-box width100 height100">
    <!-- <div class="dict-right float-right height100" v-loading="formLoad">
      <div class="form-btn align-right">
        <el-button type="primary" plain @click="del" v-show="!isNewAdd">删除</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div> -->
    <div class="dict-left height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="10">
            <el-col :span="6">
              <l-formt-title label="医保类别" required>
                <el-select
                  v-model="searchParams.medicareType"
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option
                    v-for="item in mtList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="医师信息">
                <el-select
                  v-model="searchParams.workCode"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="姓名/拼音/五笔"
                  :remote-method="selectUser1"
                  :loading="selLoading"
                  @change="search"
                >
                  <el-option
                    v-for="item in options1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.userNo"
                  >
                  </el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="登记状态">
                <el-select
                  v-model="searchParams.regStatus"
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="上传状态">
                <el-select
                  v-model="searchParams.uploadFlag"
                  placeholder="请选择"
                  @change="search"
                >
                  <el-option
                    v-for="item in uploadList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
          <el-button type="primary" @click="newAdd">新增</el-button>
          <el-button type="primary" @click="edit" :disabled="isUpdateDisabled"
            >编辑</el-button
          >
          <el-button
            type="primary"
            @click="uploadDoctorReg"
            :disabled="!multipleSelection.length"
            >上传</el-button
          >

          <!-- <el-button type="primary" @click="changeDoctorRegSi" :disabled="false"
            >变更</el-button
          > -->
        </div>
      </div>
      <div class="table">
        <el-table
          ref="singleTable"
          highlight-current-row
          @row-click="rowClick"
          :data="tableData"
          border
          width="100%"
          height="100%"
          @selection-change="handleSelectionChange"
          :element-loading-text="$t('retreat.loadInfo')"
          v-loading="loading"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <div class="oprate-button">
                <el-button
                  type="text"
                  @click="changeDoctorReg(scope.row, 1)"
                  :disabled="scope.row.regStatus !== '1'"
                  >注销</el-button
                >
                <el-button
                  type="text"
                  @click="changeDoctorReg(scope.row, 2)"
                  :disabled="scope.row.regStatus !== '1'"
                  >暂停</el-button
                >
                <el-button
                  type="text"
                  @click="deleteDoctor(scope.row)"
                  :disabled="scope.row.regStatus !== '0'"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
          <!-- 业务列 -->
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.width || item.label.length * 18 + 24"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            :header-align="item.headerAlign || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <template v-if="item.prop === 'medicareType'">
                <span>{{ mtShow[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'recordStatus'">
                <span>{{ statusShow[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'regStatus'">
                <span>{{ statusMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'uploadFlag'">
                <span>{{ uploadMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'doctorCategory'">
                <span>{{ doctorCategoryMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'identificationType'">
                <span>{{ identificationTypeList[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'nation'">
                <span>{{ nationMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'education'">
                <span>{{ educationMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'practiceRange'">
                <span>{{ practiceRangeMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'physicianLevel'">
                <span>{{ physicianLevelMap[scope.row[item.prop]] }}</span>
              </template>
              <template
                v-else-if="
                  item.prop === 'morePractice' ||
                    item.prop === 'siServiceQualification' ||
                    item.prop === 'monitoringLevel' ||
                    item.prop === 'dmjsypQuan' ||
                    item.prop === 'rxFlag' ||
                    item.prop === 'illnessFlag'
                "
              >
                <span>{{ isTrue[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'sex'">
                <span>{{ sexMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'pharmacistPracticeType'">
                <span>{{
                  pharmacistPracticeTypeMap[scope.row[item.prop]]
                }}</span>
              </template>
              <template v-else-if="item.prop === 'pharmacistPracticeRange'">
                <span>{{
                  pharmacistPracticeRangeMap[scope.row[item.prop]]
                }}</span>
              </template>
              <template v-else-if="item.prop === 'pharmacistType'">
                <span>{{ pharmacistTypeMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'deptCode'">
                <span>{{ deptCodeMap[scope.row[item.prop]] }}</span>
              </template>

              <template v-else-if="item.prop === 'jobLevelCode'">
                <span>{{ jobLevelMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'isWorking'">
                <span>{{ workingMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'practiceType'">
                <span>{{ practiceTypeMap[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'seriousIllnessType'">
                <span>{{ seriousIllnessTypeMap[scope.row[item.prop]] }}</span>
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="changeSize"
          @current-change="changePage"
          :current-page="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>

    <l-dialog
      :visible.sync="modelVisible"
      width="1200px"
      title="医师信息"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @confirm="save"
      @cancel="huidanClose"
    >
      <template #content>
        <!-- <l-card-title class="card-title">
          <span slot="left">医师信息</span>
        </l-card-title> -->
        <div class="form">
          <el-form :model="form" :rules="rules" ref="form" label-width="0">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item prop="medicareType">
                  <l-formt-title label="医保类别" required disabled>
                    <el-select
                      v-model="form.medicareType"
                      placeholder="请选择"
                      disabled
                    >
                      <el-option
                        v-for="item in mtList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <!-- <el-col :span="6"
                ><el-form-item prop="siDoctorCode" v-if="!isNewAdd">
                  <l-formt-title label="医护人员编码" disabled>
                    <el-input v-model="form.siDoctorCode" disabled></el-input>
                  </l-formt-title> </el-form-item
              ></el-col> -->
              <el-col :span="6">
                <el-form-item prop="doctorCategory">
                  <l-formt-title label="医护人员类别" required>
                    <el-radio-group
                      v-model="form.doctorCategory"
                      @change="doctorCategoryChange"
                    >
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(
                            form.doctorCategory,
                            'doctorCategory',
                            $event
                          )
                        "
                        >医师</el-radio
                      >
                      <el-radio
                        label="2"
                        @click.native="
                          handlerRadioClick(
                            form.doctorCategory,
                            'doctorCategory',
                            $event
                          )
                        "
                        >药师</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="doctorName">
                  <l-formt-title label="医护姓名" required :disabled="!isNewAdd">
                    <el-select
                      v-model="form.workCode"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="姓名/拼音/五笔"
                      :disabled="!isNewAdd"
                      :remote-method="selectUser2"
                      @change="changeDoctor"
                      :loading="selLoading"
                    >
                      <el-option
                        v-for="item in options2"
                        :key="item.userNo"
                        :label="item.name"
                        :value="item.userNo"
                      >
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="workCode">
                  <l-formt-title label="工号" required>
                    {{ form.workCode }}
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="sex">
                  <l-formt-title label="性别" required>
                    <el-radio-group v-model="form.sex">
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(form.sex, 'sex', $event)
                        "
                        >男</el-radio
                      >
                      <el-radio
                        label="2"
                        @click.native="
                          handlerRadioClick(form.sex, 'sex', $event)
                        "
                        >女</el-radio
                      >
                      <el-radio
                        label="9"
                        @click.native="
                          handlerRadioClick(form.sex, 'sex', $event)
                        "
                        >不明</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="identificationType">
                  <l-formt-title label="证件类型" required>
                    <el-select
                      v-model="form.identificationType"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in idTypeList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="identificationNum">
                  <l-formt-title label="证件号码" required>
                    <el-input v-model="form.identificationNum"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="mobile">
                  <l-formt-title label="联系电话" required>
                    <el-input v-model="form.mobile"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="professial">
                  <l-formt-title label="现从事专业" required>
                    <el-input v-model="form.professial"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6">
                <el-form-item prop="major">
                  <l-formt-title label="所学专业" required>
                    <el-input v-model="form.major"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="nation">
                  <l-formt-title label="民族" required>
                    <el-select
                      v-model="form.nation"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in nationList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="birthdayDate">
                  <l-formt-title label="出生日期">
                    <!-- <el-input v-model="form.birthdayDate" ></el-input> -->
                    <el-date-picker
                      value-format="yyyyMMdd"
                      format="yyyyMMdd"
                      v-model="form.birthdayDate"
                      type="date"
                      placeholder="选择日期"
                      class="width100"
                    >
                    </el-date-picker>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="workDate">
                  <l-formt-title label="参加工作日期">
                    <!-- <el-input v-model="form.workDate" ></el-input> -->
                    <el-date-picker
                      value-format="yyyyMMdd"
                      format="yyyyMMdd"
                      v-model="form.workDate"
                      type="date"
                      placeholder="选择日期"
                      class="width100"
                    >
                    </el-date-picker>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="education">
                  <l-formt-title label="学历" required>
                    <el-select
                      v-model="form.education"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in educationList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="practiceNumber">
                  <l-formt-title label="执业证书编码" required>
                    <el-input v-model="form.practiceNumber"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="certificationNumber">
                  <l-formt-title label="资格证书编码" required>
                    <el-input v-model="form.certificationNumber"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6">
                <el-form-item
                  prop="practiceRange"
                  v-if="form.doctorCategory === '1'"
                >
                  <l-formt-title label="医师执业范围代码" required>
                    <el-select
                      v-model="form.practiceRange"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in practiceRangeList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>

              <el-col :span="6"
                ><el-form-item
                  prop="physicianLevel"
                  v-if="form.doctorCategory === '1'"
                >
                  <l-formt-title label="医生执业资格证中的医师级别" required>
                    <el-select
                      v-model="form.physicianLevel"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in physicianLevelList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item
                  prop="practiceType"
                  v-if="form.doctorCategory === '1'"
                >
                  <l-formt-title label="医生执业资格证中的执业类别" required>
                    <el-select
                      v-model="form.practiceType"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="(item, index) in practiceTypeMap"
                        :key="index"
                        :label="item"
                        :value="index"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6">
                <el-form-item prop="siDoctorCode">
                  <l-formt-title label="医保医师编号" disabled>
                    <el-input v-model="form.siDoctorCode" disabled></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="morePractice">
                  <l-formt-title label="多点执业标志" required>
                    <el-radio-group v-model="form.morePractice">
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(
                            form.morePractice,
                            'morePractice',
                            $event
                          )
                        "
                        >是</el-radio
                      >
                      <el-radio
                        label="0"
                        @click.native="
                          handlerRadioClick(
                            form.morePractice,
                            'morePractice',
                            $event
                          )
                        "
                        >否</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item></el-col
              >

              <el-col :span="6"
                ><el-form-item prop="siServiceQualification">
                  <l-formt-title label="医师医保服务资格状态">
                    <el-radio-group v-model="form.siServiceQualification">
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(
                            form.siServiceQualification,
                            'siServiceQualification',
                            $event
                          )
                        "
                        >是</el-radio
                      >
                      <el-radio
                        label="0"
                        @click.native="
                          handlerRadioClick(
                            form.siServiceQualification,
                            'siServiceQualification',
                            $event
                          )
                        "
                        >否</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item></el-col
              >
              <el-col :span="6"
                ><el-form-item prop="monitoringLevel">
                  <l-formt-title label="监控等级">
                    <el-radio-group v-model="form.monitoringLevel">
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(
                            form.monitoringLevel,
                            'monitoringLevel',
                            $event
                          )
                        "
                        >是</el-radio
                      >
                      <el-radio
                        label="0"
                        @click.native="
                          handlerRadioClick(
                            form.monitoringLevel,
                            'monitoringLevel',
                            $event
                          )
                        "
                        >否</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item></el-col
              >
              <el-col :span="6"
                ><el-form-item prop="dmjsypQuan">
                  <l-formt-title label="毒麻精神药品资格">
                    <el-radio-group v-model="form.dmjsypQuan">
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(
                            form.dmjsypQuan,
                            'dmjsypQuan',
                            $event
                          )
                        "
                        >是</el-radio
                      >
                      <el-radio
                        label="0"
                        @click.native="
                          handlerRadioClick(
                            form.dmjsypQuan,
                            'dmjsypQuan',
                            $event
                          )
                        "
                        >否</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item></el-col
              >
              <el-col :span="6"
                ><el-form-item prop="rxFlag">
                  <l-formt-title label="处方资格标识" required>
                    <el-radio-group v-model="form.rxFlag">
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(form.rxFlag, 'rxFlag', $event)
                        "
                        >是</el-radio
                      >
                      <el-radio
                        label="0"
                        @click.native="
                          handlerRadioClick(form.rxFlag, 'rxFlag', $event)
                        "
                        >否</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item></el-col
              >
              <el-col :span="6"
                ><el-form-item prop="mybjCertificationNumber">
                  <l-formt-title label="母婴保健技术证书编号">
                    <el-input v-model="form.mybjCertificationNumber"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="jhsyCertificationNumber">
                  <l-formt-title label="计划生育技术证书编号">
                    <el-input v-model="form.jhsyCertificationNumber"></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>

              <el-col :span="6"
                ><el-form-item
                  prop="pharmacistType"
                  v-if="form.doctorCategory === '2'"
                >
                  <l-formt-title label="药师类别" required>
                    <el-select
                      v-model="form.pharmacistType"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in pharmacistTypeList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item
                  prop="pharmacistPracticeType"
                  v-if="form.doctorCategory === '2'"
                >
                  <l-formt-title label="药师执业类别" required>
                    <el-select
                      v-model="form.pharmacistPracticeType"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in pharmacistPracticeTypeList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item
                  prop="pharmacistPracticeRange"
                  v-if="form.doctorCategory === '2'"
                >
                  <l-formt-title label="药师执业范围" required>
                    <el-select
                      v-model="form.pharmacistPracticeRange"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in pharmacistPracticeRangeList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item
                  prop="pharmacistRegCertificationNumber"
                  v-if="form.doctorCategory === '2'"
                >
                  <l-formt-title label="执业药师注册证编号" required>
                    <el-input
                      v-model="form.pharmacistRegCertificationNumber"
                    ></el-input>
                  </l-formt-title> </el-form-item
              ></el-col>

              <el-col :span="6"
                ><el-form-item
                  prop="deptCode"
                  v-if="form.doctorCategory === '1'"
                >
                  <l-formt-title label="所属科室" required>
                    <el-select
                      v-model="form.deptCode"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in deptCodeList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </el-form-item>
              </el-col>

              <el-col :span="6"
                ><el-form-item prop="title">
                  <l-formt-title label="职务名称">
                    <l-value-domain
                      code="doctorProfessionalTitle"
                      :value.sync="form.title"
                      remoteShowKey="name"
                      remoteValueKey="name"
                    />
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="jobLevelCode">
                  <l-formt-title label="专业技术职务级别编码">
                    <el-select
                      v-model="form.jobLevelCode"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in jobLevelList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="isWorking">
                  <l-formt-title label="在职与否" required>
                    <el-select
                      v-model="form.isWorking"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in workingList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>

              <el-col :span="6">
                <el-form-item prop="illnessFlag">
                  <l-formt-title label="门诊大病医师标识" required>
                    <el-radio-group v-model="form.illnessFlag">
                      <el-radio
                        label="1"
                        @click.native="
                          handlerRadioClick(
                            form.illnessFlag,
                            'illnessFlag',
                            $event
                          )
                        "
                        >是</el-radio
                      >
                      <el-radio
                        label="0"
                        @click.native="
                          handlerRadioClick(
                            form.illnessFlag,
                            'illnessFlag',
                            $event
                          )
                        "
                        >否</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="6"
                ><el-form-item prop="seriousIllnessType">
                  <l-formt-title label="门诊大病类别" 
                  :required="form.illnessFlag == '1'"
                  :disabled="form.illnessFlag != '1'"
                  >
                    <el-select
                      v-model="form.seriousIllnessTypeText"
                      collapse-tags
                      multiple
                      filterable
                      placeholder="请选择"
                      :disabled="form.illnessFlag != '1'"
                      @change="seriousIllnessTypeTextChange"
                    >
                      <el-option
                        v-for="item in seriousIllnessTypeList"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      >
                      <span>{{`${item.dictName}(${item.dictCode})`}}</span>
                      </el-option>
                    </el-select>
                  </l-formt-title> </el-form-item
              ></el-col>
              <!-- <el-col :span="6" v-show="!isNewAdd"
              ><el-form-item prop="date">
                <l-formt-title label="登记时间" required>
                  <el-date-picker
                    v-model="date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyyMMdd"
                    format="yyyyMMdd"
                    clearable
                    class="width100"
                  ></el-date-picker>
                </l-formt-title> </el-form-item
            ></el-col> -->
              <el-col :span="6"
                ><el-form-item prop="startDate">
                  <l-formt-title label="开始时间" required>
                    <el-date-picker
                      v-model="form.startDate"
                      type="date"
                      value-format="yyyyMMdd"
                      format="yyyyMMdd"
                      placeholder="开始日期"
                      class="width100"
                    >
                    </el-date-picker>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6" v-show="!isNewAdd"
                ><el-form-item prop="endDate">
                  <l-formt-title label="结束时间" required>
                    <el-date-picker
                      v-model="form.endDate"
                      type="date"
                      value-format="yyyyMMdd"
                      format="yyyyMMdd"
                      placeholder="结束日期"
                      class="width100"
                    >
                    </el-date-picker>
                  </l-formt-title> </el-form-item
              ></el-col>
              <el-col :span="6"
                ><el-form-item prop="regStatus">
                  <l-formt-title label="登记状态" required>
                    <el-radio-group v-model="form.regStatus">
                      <el-radio
                        label="1"
                        disabled
                        @click.native="
                          handlerRadioClick(form.regStatus, 'regStatus', $event)
                        "
                        >登记</el-radio
                      >
                      <el-radio
                        label="3"
                        disabled
                        @click.native="
                          handlerRadioClick(form.regStatus, 'regStatus', $event)
                        "
                        >注销</el-radio
                      >
                      <el-radio
                        label="4"
                        disabled
                        @click.native="
                          handlerRadioClick(form.regStatus, 'regStatus', $event)
                        "
                        >暂停</el-radio
                      >
                    </el-radio-group>
                  </l-formt-title>
                </el-form-item></el-col
              >
            </el-row>
          </el-form>
        </div>
      </template>
    </l-dialog>
  </div>
</template>

<script>
import {
  getPagemd,
  changeDoctorRegSi,
  updateDoctorReg,
  updateDoctorRegSi,
  getIdentificationType,
  getNationCode,
  getEducation,
  getPracticeRange,
  getPhysicianLevel,
  getJobLevel,
  getSeriousIllnessType,
  getPharmacistType,
  addDoctorReg,
  getDeptCode,
  getPharmacistPracticeRange,
  getPharmacistPracticeType,
  getPageDoctorRegList,
  getPracticeType,
  uploadDoctorRegList,
  getDoctors,
  deleteDoctor
} from "@/api/medicalInsurance/doctor.js";
import { getBigDiseaseType } from "@/api/medicalInsurance/index.js";

export default {
  name: "physicianInfoUpload",

  data() {
    let startDateValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入"));
      } else if (
        this.form.endDate &&
        new Date(value).getTime() > new Date(this.form.endDate).getTime()
      ) {
        callback(new Error("开始日期不能大于结束日期"));
      } else {
        callback();
      }
    };
    let endDateValidate = (rule, value, callback) => {
      if (this.isNewAdd) {
        callback();
      } else if (!value) {
        callback(new Error("请输入"));
      } else if (
        this.form.startDate &&
        new Date(this.form.startDate).getTime() > new Date(value).getTime()
      ) {
        callback(new Error("开始日期不能大于结束日期"));
      } else {
        callback();
      }
    };

    let practiceRangeValidate = (rule, value, callback) => {
      if (this.form.doctorCategory !== "1") {
        callback();
      } else if (!value) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    };
    let pharmacistTypeValidate = (rule, value, callback) => {
      if (this.form.doctorCategory !== "2") {
        callback();
      } else if (!value) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    };
    let seriousIllnessTypeValidate = (rule, value, callback) => {
      if (this.form.illnessFlag !== "1") {
        callback();
      } else if (!value) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    };

    return {
      modelVisible: false,
      date: [
        this.dayjs(new Date())
          .format("YYYYMMDD")
          .toString(),
        this.dayjs(new Date())
          .format("YYYYMMDD")
          .toString()
      ],
      isTrue: {
        "0": "否",
        "1": "是"
      },
      sexMap: {
        "1": "男",
        "2": "女",
        "9": "不明"
      },
      doctorCategoryMap: {
        "1": "医师",
        "2": "药师"
      },
      statusMap: {
        "0": "未登记",
        "1": "登记",
        "3": "注销",
        "4": "暂停"
      },
      statusList: [
        {
          code: "",
          name: "全部"
        },
        {
          code: "0",
          name: "未登记"
        },
        {
          code: "1",
          name: "已登记"
        },
        {
          code: "3",
          name: "注销"
        },
        {
          code: "4",
          name: "暂停"
        }
      ],
      uploadMap: {
        "0": "未上传",
        "1": "已上传"
      },
      uploadList: [
        {
          code: "",
          name: "全部"
        },
        {
          code: "0",
          name: "未上传"
        },
        {
          code: "1",
          name: "已上传"
        }
      ],
      identificationTypeList: {},
      // 下拉框loading
      selLoading: false,
      // 下拉选项
      options: [],
      searchParams: {
        medicareType: "",
        uploadFlag: "",
        regStatus: "",
        workCode: ""
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      statusShow: {
        "0": "未启用",
        "1": "启用"
      },
      workingMap: {
        "0": "不在职",
        "1": "在职",
        "2": "返聘",
        "3": "临聘",
        "4": "返聘不满半年",
        "5": "临聘不满半年"
      },
      workingList: [
        {
          code: "0",
          name: "不在职"
        },
        {
          code: "1",
          name: "在职"
        },
        {
          code: "2",
          name: "返聘"
        },
        {
          code: "3",
          name: "临聘"
        },
        {
          code: "4",
          name: "返聘不满半年"
        },
        {
          code: "5",
          name: "临聘不满半年"
        }
      ],
      tableParams: [
        /* {
          prop: "medicareType",
          label: "医保类别"
        }, */
        {
          prop: "regStatus",
          label: "登记状态"
        },
        {
          prop: "uploadFlag",
          label: "上传状态"
        },
        {
          prop: "siDoctorCode",
          label: "医护人员编码"
        },
        {
          prop: "doctorName",
          label: "医护人员姓名"
        },
        {
          prop: "doctorCategory",
          label: "医护人员类别"
        },
        {
          prop: "sex",
          label: "性别"
        },
        {
          prop: "identificationType",
          label: "证件类型",
          width: 160
        },
        {
          prop: "identificationNum",
          label: "证件号码",
          width: 220
        },
        {
          prop: "mobile",
          label: "联系电话",
          width: 150
        },
        {
          prop: "professial",
          label: "现从事专业"
        },
        {
          prop: "major",
          label: "所学专业"
        },
        {
          prop: "nation",
          label: "民族"
        },
        {
          prop: "birthdayDate",
          label: "出生日期"
        },
        {
          prop: "workDate",
          label: "参加工作日期"
        },
        {
          prop: "education",
          label: "学历",
          width: 120
        },
        {
          prop: "practiceNumber",
          label: "职业证书编码"
        },
        {
          prop: "certificationNumber",
          label: "资格证书编码"
        },
        {
          prop: "practiceRange",
          label: "执业范围",
          width: 150
        },
        {
          prop: "physicianLevel",
          label: "医师级别",
          width: 150
        },
        {
          prop: "practiceType",
          label: "执业类别",
          width: 150
        },
        {
          prop: "siDoctorCode",
          label: "医保医师编号"
        },
        {
          prop: "morePractice",
          label: "多点执业标志"
        },
        {
          prop: "siServiceQualification",
          label: "医师医保服务资格状态"
        },
        {
          prop: "monitoringLevel",
          label: "监控等级"
        },
        {
          prop: "dmjsypQuan",
          label: "毒麻精神药品资格"
        },
        {
          prop: "rxFlag",
          label: "处方资格标识"
        },
        {
          prop: "illnessFlag",
          label: "门诊大病医师标识"
        },
        {
          prop: "seriousIllnessType",
          label: "门诊大病类别"
        },
        {
          prop: "mybjCertificationNumber",
          label: "母婴保健技术考核合格证书编号"
        },
        {
          prop: "jhsyCertificationNumber",
          label: "计划生育技术服务人员合格证编号"
        },
        {
          prop: "pharmacistType",
          label: "药师类别",
          width: 150
        },
        {
          prop: "pharmacistPracticeType",
          label: "药师执业类别",
          width: 150
        },
        {
          prop: "pharmacistPracticeRange",
          label: "药师执业范围",
          width: 150
        },
        {
          prop: "pharmacistRegCertificationNumber",
          label: "执业药师注册证编号"
        },
        {
          prop: "deptCode",
          label: "所属科室",
          width: 150
        },
        {
          prop: "workCode",
          label: "工号",
          width: 120
        },
        {
          prop: "title",
          label: "职务名称"
        },
        {
          prop: "jobLevelCode",
          label: "专业技术职务级别编码"
        },
        {
          prop: "isWorking",
          label: "在职与否"
        },
        {
          prop: "startDate",
          label: "开始日期"
        },
        {
          prop: "endDate",
          label: "结束日期"
        }
      ],
      tableData: [],
      loading: false,
      mtList: [],
      idTypeList: [],
      mtShow: {},
      form: {},
      formInit: {
        doctorRegId: "",
        medicareType: "",
        doctorCode: "",
        deptCode: "",
        doctorName: "",
        major: "",
        education: "",
        isWorking: "",
        doctorCategory: "1",
        sex: "1",
        identificationType: "01",
        professial: "",
        mobile: "",
        practiceType: "",
        physicianLevel: "",
        siDoctorCode: "",
        practiceRange: "",
        morePractice: "0",
        siServiceQualification: "",
        monitoringLevel: "",
        practiceNumber: "",
        certificationNumber: "",
        rxFlag: "",
        illnessFlag: "",
        seriousIllnessType: "",
        pharmacistRegCertificationNumber: "",
        mybjCertificationNumber: "",
        jhsyCertificationNumber: "",
        pharmacistType: "",
        regStatus: "1",
        pharmacistPracticeType: "",
        pharmacistPracticeRange: "",
        nation: "01",
        birthdayDate: "",
        startDate: this.dayjs(new Date())
          .format("YYYYMMDD")
          .toString(),
        endDate: this.dayjs(new Date())
          .format("YYYYMMDD")
          .toString(),
        workDate: "",
        workCode: "",
        jobLevelCode: "",
        title: "",
        dmjsypQuan: "",
        identificationNum: ""
      },
      rules: {
        medicareType: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        doctorName: [{ required: true, message: "请选择", trigger: "change" }],
        doctorCategory: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        sex: [{ required: true, message: "请选择", trigger: "change" }],
        identificationType: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        identificationNum: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请选择", trigger: "blur" }],

        professial: [{ required: true, message: "请选择", trigger: "blur" }],
        major: [{ required: true, message: "请选择", trigger: "blur" }],
        nation: [{ required: true, message: "请选择", trigger: "change" }],
        education: [{ required: true, message: "请选择", trigger: "change" }],
        practiceNumber: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        certificationNumber: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        morePractice: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        rxFlag: [{ required: true, message: "请选择", trigger: "change" }],
        workCode: [{ required: true, message: "请选择", trigger: "blur" }],
        isWorking: [{ required: true, message: "请选择", trigger: "change" }],
        illnessFlag: [{ required: true, message: "请选择", trigger: "change" }],
        startDate: [{ validator: startDateValidate, trigger: "change" }],
        endDate: [{ validator: endDateValidate, trigger: "change" }],

        siDictCatalogCode: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        siDictCatalogName: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        recordStatus: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        sort: [{ required: true, message: "请输入", trigger: "blur" }],

        practiceRange: [
          { validator: practiceRangeValidate, trigger: "change" }
        ],
        physicianLevel: [
          { validator: practiceRangeValidate, trigger: "change" }
        ],
        practiceType: [{ validator: practiceRangeValidate, trigger: "change" }],
        deptCode: [{ validator: practiceRangeValidate, trigger: "change" }],

        pharmacistType: [
          { validator: pharmacistTypeValidate, trigger: "change" }
        ],
        pharmacistPracticeType: [
          { validator: pharmacistTypeValidate, trigger: "change" }
        ],
        pharmacistPracticeRange: [
          { validator: pharmacistTypeValidate, trigger: "change" }
        ],
        pharmacistRegCertificationNumber: [
          { validator: pharmacistTypeValidate, trigger: "change" }
        ],
        seriousIllnessType: [
          { validator: seriousIllnessTypeValidate, trigger: "change" }
        ]
      },
      isNewAdd: false,
      curSearchParams: {},
      currentRow: {},
      nationList: [],
      educationList: [],
      practiceRangeList: [],
      physicianLevelList: [],
      practiceTypeList: [],
      pharmacistTypeList: [],
      pharmacistPracticeTypeList: [],
      pharmacistPracticeRangeList: [],
      jobLevelList: [],
      deptCodeList: [],
      seriousIllnessTypeList: [],
      deptCodeMap: {},
      jobLevelMap: {},
      educationMap: {},
      pharmacistPracticeTypeMap: {},
      pharmacistPracticeRangeMap: {},
      pharmacistTypeMap: {},
      physicianLevelMap: {},
      practiceTypeMap: {},
      seriousIllnessTypeMap: {},
      practiceRangeMap: {},
      nationMap: {},
      multipleSelection: [],
      formLoad: false,
      options1: [],
      options2: []
    };
  },
  computed: {
    isUpdateDisabled() {
      return (
        !this.currentRow ||
        (this.currentRow &&
          this.currentRow.hasOwnProperty("doctorRegId") &&
          this.currentRow.uploadFlag != "0" &&
          this.currentRow.uploadFlag != "1")
      );
    }
  },
  async created() {
    await this.getSeriousIllnessType();
    await this.getMedicareType();
    this.getIdentificationType();
    this.selectAllUser();
    this.getNationCode();
    this.getJobLevel();
    this.getEducation();
    this.getPracticeRange();
    this.getPhysicianLevel();
    this.getPracticeType();
    this.getPharmacistPracticeType();
    this.getPharmacistType();
    this.getDeptCode();
    await this.search();
    this.getPharmacistPracticeRange();
  },
  methods: {
    handlerRadioClick(value, key, e) {
      if (e.target.tagName !== "INPUT") {
        return;
      }

      if (value !== "") {
        this.$set(this.form, key, "");
      }
    },
    seriousIllnessTypeTextChange(val) {
      this.form.seriousIllnessType = val.join(",");
    },
    async getSeriousIllnessType() {
      await getSeriousIllnessType().then(res => {
        if (res.code === 1) {
          this.seriousIllnessTypeList = res.data;
          res.data.forEach(item => {
            this.seriousIllnessTypeMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getDeptCode() {
      getDeptCode().then(res => {
        if (res.code === 1) {
          this.deptCodeList = res.data;
          res.data.forEach(item => {
            this.deptCodeMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getJobLevel() {
      getJobLevel().then(res => {
        if (res.code === 1) {
          this.jobLevelList = res.data;
          res.data.forEach(item => {
            this.jobLevelMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getPharmacistPracticeRange() {
      getPharmacistPracticeRange().then(res => {
        if (res.code === 1) {
          this.pharmacistPracticeRangeList = res.data;
          res.data.forEach(item => {
            this.pharmacistPracticeRangeMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getPharmacistPracticeType() {
      getPharmacistPracticeType().then(res => {
        if (res.code === 1) {
          this.pharmacistPracticeTypeList = res.data;
          res.data.forEach(item => {
            this.pharmacistPracticeTypeMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getPharmacistType() {
      getPracticeType().then(res => {
        if (res.code === 1) {
          this.pharmacistTypeList = res.data;
          res.data.forEach(item => {
            this.pharmacistTypeMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getPracticeType() {
      getPracticeType().then(res => {
        if (res.code === 1) {
          this.practiceTypeList = res.data;
          res.data.forEach(item => {
            this.practiceTypeMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getPhysicianLevel() {
      getPhysicianLevel().then(res => {
        if (res.code === 1) {
          this.physicianLevelList = res.data;
          res.data.forEach(item => {
            this.physicianLevelMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getPracticeRange() {
      getPracticeRange().then(res => {
        if (res.code === 1) {
          this.practiceRangeList = res.data;
          res.data.forEach(item => {
            this.practiceRangeMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getEducation() {
      getEducation().then(res => {
        if (res.code === 1) {
          this.educationList = res.data;
          res.data.forEach(item => {
            this.educationMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getIdentificationType() {
      getIdentificationType().then(res => {
        if (res.code === 1) {
          this.idTypeList = res.data;
          res.data.forEach(item => {
            this.identificationTypeList[item.dictCode] = item.dictName;
          });
        }
      });
    },
    getNationCode() {
      getNationCode().then(res => {
        if (res.code === 1) {
          this.nationList = res.data;
          res.data.forEach(item => {
            this.nationMap[item.dictCode] = item.dictName;
          });
        }
      });
    },
    changeDoctor(code) {
      console.info(code);
      this.options.map(item => {
        if (item.userNo == code) {
          console.log(item)
          this.form.doctorName = item.name; //传值
          this.form.workCode = item.userNo; //传值
          this.form.siDoctorCode = item.userNo; //传值
          let sex = item.gender === "M" ? "1" : item.gender === "W" ? "2" : "9";
          this.form.sex = sex; //传值
          this.form.mobile = item.mobile; //传值
        }
      });
    },
    async selectAllUser() {
      try {
        let res = await getDoctors({
          // hosId:this.hosId,
          userSearchValue: ""
        });
        this.options = res.data;
        this.options1 = res.data;
      } catch (error) {
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    //前台检索医护人员
    selectUserCommon(val, doctorCategory) {
      let arr = [];
      for (let i in this.options) {
        let item = this.options[i];
        if (
          !val ||
          (item.name.indexOf(val) > -1 ||
            (item.pinyin && item.pinyin.indexOf(val) > -1) ||
            (item.pinyinfirst && item.pinyinfirst.indexOf(val) > -1))
        ) {
          if (!doctorCategory) {
            arr.push({ ...item });
          } else {
            if (doctorCategory && item.workType == doctorCategory) {
              arr.push({ ...item });
            }
          }
        }
      }
      return arr;
    },
    selectUser1(val) {
      if (val === "") {
        this.options1 = this.options;
        return;
      }
      let arr = this.selectUserCommon(val);
      this.options1 = arr;
    },
    selectUser2(val) {
      let doctorCategory =
        this.form.doctorCategory == "1"
          ? "1"
          : this.form.doctorCategory == "2"
          ? "3"
          : "";
      let arr = this.selectUserCommon(val, doctorCategory);
      this.options2 = arr;
    },
    // 切换医护人员类别
    doctorCategoryChange() {
      this.selectUser2();
      this.form.doctorName = "";
      this.form.workCode = "";
    },
    // 获取医保类别
    async getMedicareType() {
      await getPagemd().then(res => {
        if (res.code === 1) {
          /* let medicareType = [{
              "dictCode" : "",
              "dictName" : "全部"
          }]; */
          let medicareType = [];
          this.mtList = medicareType.concat(res.data);
          this.searchParams.medicareType = res.data[0].dictCode;
          res.data.forEach(item => {
            this.mtShow[item.dictCode] = item.dictName;
          });
        }
      });
    },
    updateDoctorRegSi() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error("请选择要更新的数据！");
        return;
      }
      let updateData = [];
      this.multipleSelection.forEach(row => {
        if (row.uploadFlag !== "1") {
          updateData.push(row);
          return;
        }
        this.$refs.singleTable.toggleRowSelection(row);
      });
      if (updateData.length <= 0) {
        this.$message.error("已过滤未上传的数据！剩余可更新数据为0！");
        return;
      }
      updateDoctorRegSi(updateData)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.search();
            this.$message.success(res.msg || "更新成功");
          } else {
            this.$message.error(res.msg || "更新失败");
          }
        })
        .catch(err => {
          this.formLoad = false;
          this.$message.error(err.msg || "更新失败");
        });
    },
    changeDoctorRegSi() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error("请选择要变更的数据！");
        return;
      }
      let changeData = [];
      this.multipleSelection.forEach(row => {
        if (row.uploadFlag !== "1") {
          changeData.push(row);
          return;
        }
        this.$refs.singleTable.toggleRowSelection(row);
      });
      if (changeData.length <= 0) {
        this.$message.error("已过滤未上传的数据！剩余可变更数据为0！");
        return;
      }
      changeDoctorRegSi(changeData)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.search();
            this.$message.success(res.msg || "变更成功");
          } else {
            this.$message.error(res.msg || "变更失败");
          }
        })
        .catch(err => {
          this.formLoad = false;
          this.$message.error(err.msg || "变更失败");
        });
    },
    uploadDoctorReg() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error("请选择要上传的数据！");
        return;
      }
      let uploadData = [];
      this.multipleSelection.forEach(row => {
        if (row.uploadFlag === "1") {
          this.$refs.singleTable.toggleRowSelection(row);
          return;
        }
        uploadData.push(row);
      });
      if (uploadData.length <= 0) {
        this.$message.error("已过滤已上传的数据！剩余可上传数据为0！");
        return;
      }
      uploadDoctorRegList(uploadData)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.search();
            this.$message.success(res.msg || "上传成功");
          } else {
            this.$message.error(res.msg || "上传失败");
          }
        })
        .catch(err => {
          this.formLoad = false;
          this.$message.error(err.msg || "上传失败");
        });
    },
    handleSelectionChange(val) {
      console.info(val);
      this.multipleSelection = val;
    },
    search() {
      this.pageParams.pageNo = 1;
      this.curSearchParams = {
        ...this.searchParams
      };
      this.loadTable();
    },
    reset() {
      // this.searchParams = this.$options.data().searchParams;
      this.searchParams = {
        medicareType: "",
        uploadFlag: "",
        regStatus: "",
        workCode: ""
      };
      this.options1 = this.options;
      this.search();
    },
    async loadTable() {
      this.tableData = [];
      this.pageParams.total = 0;
      this.multipleSelection = [];
      this.currentRow = {};
      this.loading = true;
      this.searchParams = {
        ...this.curSearchParams
      };
      const params = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        ...this.curSearchParams
      };
      await getPageDoctorRegList(params)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.tableData = res.data;
            this.pageParams.total = res.total;
            if (this.tableData.length > 0) {
              this.rowClick(this.tableData[0]);
              this.$refs.singleTable.setCurrentRow(this.tableData[0]);
            } else {
              // this.newAdd();
              this.$refs.singleTable.setCurrentRow();
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    rowClick(row) {
      this.$emit("getCatalog", row);
      this.currentRow = { ...row };
    },
    newAdd() {
      this.isNewAdd = true;
      this.form = {
        ...this.formInit,
        medicareType: this.searchParams.medicareType
      };
      this.selectUser2();
      this.modelVisible = true;
      console.log(this.options2);
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
    },
    edit() {
      this.isNewAdd = false;
      this.modelVisible = true;
      this.form = {
        ...this.currentRow,
        birthdayDate: this.currentRow.birthdayDate
          ? this.currentRow.birthdayDate.toString()
          : "",
        workDate: this.currentRow.workDate
          ? this.currentRow.workDate.toString()
          : "",
        startDate: this.currentRow.startDate
          ? this.currentRow.startDate.toString()
          : "",
        endDate: this.currentRow.endDate
          ? this.currentRow.endDate.toString()
          : ""
      };
      this.form.seriousIllnessTypeText = this.form.seriousIllnessType
          ? this.form.seriousIllnessType.indexOf(",") > -1
            ? this.form.seriousIllnessType.split(",")
            : [this.form.seriousIllnessType]
          : []
      this.selectUser2();
    },
    // 删除
    deleteDoctor(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteDoctor({ id: row.doctorRegId }).then(res => {
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.search();
          }
        });
      });
    },
    // 注销、暂停
    changeDoctorReg(row, flag) {
      let msgInfo = flag === 1 ? "注销" : "暂停";
      this.$confirm("是否确认" + msgInfo + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          ...row,
          updateType: flag === 1 ? "3" : "4"
          // siDoctorCode
        };
        changeDoctorRegSi(params).then(res => {
          if (res.code === 1) {
            this.search();
            this.$message.success(res.msg || msgInfo + "成功");
          } else {
            this.$message.error(res.msg || msgInfo + "失败");
          }
        });
      });
    },
    huidanClose() {
      this.modelVisible = false;
      this.$refs.form.resetFields();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoad = true;
          if (this.isNewAdd && this.form.doctorRegId === "") {
            /* if (this.date && this.date.length > 1) {
              this.form.startDate = this.date[0];
              this.form.endDate = this.date[1];
            } */
            addDoctorReg(this.form)
              .then(res => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.search();
                  this.modelVisible = false;
                  this.$refs.form.resetFields();
                  this.$message.success(res.msg || "新增成功");
                } else {
                  this.$message.error(res.msg || "新增失败");
                }
              })
              .catch(err => {
                this.formLoad = false;
                this.$message.error(err.msg || "新增失败");
              });
          } else {
            if (this.date && this.date.length > 1) {
              this.form.startDate = this.date[0];
              this.form.endDate = this.date[1];
            }
            updateDoctorReg(this.form)
              .then(res => {
                this.formLoad = false;
                if (res.code === 1) {
                  this.search();
                  this.modelVisible = false;
                  this.$refs.form.resetFields();
                  this.$message.success(res.msg || "修改成功");
                } else {
                  this.$message.error(res.msg || "修改失败");
                }
              })
              .catch(err => {
                this.formLoad = false;
                this.$message.error(err.msg || "修改失败");
              });
          }
        }
      });
    },
    del() {
      if (!this.currentRow.siDictCatalogId) {
        this.$message.warning("请选择要删除的医保字典目录!");
        return;
      }
      this.$confirmFunc({
        titleText: "提示",
        contentText: "此操作将永久删除该医保字典目录!",
        confirm: (action, instance, done) => {
          this.$showLoading();
          deleteDictCatalogById(this.currentRow.siDictCatalogId)
            .then(res => {
              this.$hideLoading();
              done();
              if (res.code === 1) {
                this.search();
                this.$message.success(res.msg || "删除成功!");
              } else {
                this.$message.error(res.msg || "删除失败!");
              }
            })
            .catch(err => {
              this.$hideLoading();
              done();
              this.$message.error(err.msg || "删除失败!");
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dict-box {
  overflow: hidden;
  background-color: $l-color-white;
  .dict-left {
    display: flex;
    flex-direction: column;
    // margin-right: 300px;
    padding: 10px;
    overflow: hidden;
    .search {
      display: flex;
      .search-input {
        flex: 1;
        overflow: hidden;
      }
      .search-btn {
        margin-left: 10px;
      }
    }
    .table {
      flex: 1;
      overflow: hidden;
      height: calc(100% - 180px);
      margin: 20px 0;
    }
  }
  .dict-right {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px;
    border-left: 1px solid $l-color-bgcolor-11;
  }
  .page {
    text-align: right;
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
  .card-title {
    height: 20px;
    line-height: 20px;
    margin-bottom: 10px;
    /deep/ .titleleft::before {
      margin-top: 0;
    }
  }
  .form {
    flex: 1;
    margin-bottom: 10px;
    padding: 10px;
    overflow: hidden;
    overflow-y: auto;
    /deep/ .el-form-item__content {
      height: 36px;
      margin-bottom: 20px;
    }
  }
  .form-btn {
    text-align: right;
    padding-top: 10px;
    border-top: 1px solid $l-color-bgcolor-11;
  }

  .oprate-button {
    /deep/ .el-button--medium {
      padding: 4px 4px !important;
    }
    /deep/ .el-button.is-disabled {
      color: #949191;
    }
  }
}
</style>
