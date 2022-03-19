<template>
  <div style="width: 1142px">
    <div style="height: 100%">
      <div style="margin: 0px 10px 0px 10px">
        <div style="margin-top: 20px">
          <span style="float: left; margin-left: 331px; font-weight: bold"
            >医疗机构</span
          >
          <div class="underline" style="width: 200px">
            {{ info.firstPO ? info.firstPO.orgNm : "-" }}
          </div>
          <span style="float: left; margin-left: 20px">
            (
            <b>组织机构代码</b>:
          </span>
          <div class="underline" style="width: 100px">
            {{ info.firstPO ? info.firstPO.orgCd : "-" }}
          </div>
          <span style="float: left">)</span>
          <div style="clear: both"></div>
        </div>
        <div style="margin-top: 20px; line-height: 29px">
          <span style="float: left">医疗付费方式:</span>
          <div class="select-box" style="margin-top: 5px">
            {{ info.firstPO ? info.firstPO.costPayTp : "-" }}
          </div>
          <span
            style="
              float: left;
              font-size: 22px;
              font-weight: bold;
              margin-left: 345px;
            "
            >住 院 病 案 首 页</span
          >
          <div style="clear: both"></div>
        </div>
        <div style="margin-top: 5px">
          <span
            >健康卡号:{{
              info.firstPO ? info.firstPO.healthCardNumber : "-"
            }}</span
          >
          <span style="margin-left: 443px"
            >第 {{ info.firstPO ? info.firstPO.enCnt : "-" }} 次住院</span
          >
          <span style="margin-left: 307px"
            >病案号:{{ info.firstPO ? info.firstPO.mrCode : "-" }}</span
          >
        </div>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 10px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 20px">
          <el-col :span="6">
            <span style="float: left; font-weight: bold">姓名</span>
            <div class="underline" style="width: 220px">
              {{ info.firstPatientPO ? info.firstPatientPO.name : "-" }}
            </div>
          </el-col>
          <el-col :span="3">
            <span style="float: left; font-weight: bold">性别</span>
            <div class="select-box">
              {{
                info.firstPatientPO
                  ? info.firstPatientPO.sex == "0" || "9"
                    ? "-"
                    : info.firstPatientPO.sex
                  : "-"
              }}
            </div>
            <span style="margin-left: 5px">1.男 2.女</span>
          </el-col>
          <el-col :span="7">
            <span style="float: left; font-weight: bold">出生日期</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPatientPO ? birthDate.getFullYear() : "-" }}
            </div>
            <span style="float: left">年</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPatientPO ? birthDate.getMonth() + 1 : "-" }}
            </div>
            <span style="float: left">月</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPatientPO ? birthDate.getDate() : "-" }}
            </div>
            <span>日</span>
          </el-col>
          <el-col :span="3">
            <span style="float: left; font-weight: bold">年龄</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPatientPO ? info.firstPatientPO.age : "-" }}岁
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">国籍</span>
            <div class="underline" style="width: 190px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.nationality : '-'
                "
                code="WORLD_REGIONAL_NAME_CODE"
                v-codeTransform
              ></span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="9">
            <span style="float: left">
              (年龄不足1周岁的)
              <b>年龄</b>
            </span>
            <div class="underline" style="width: 220px">
              {{ info.firstPatientPO ? info.firstPatientPO.monthsAge : "-" }}
            </div>
            <span>月</span>
          </el-col>
          <el-col :span="8">
            <span style="float: left; font-weight: bold">新生儿出生体重</span>
            <div class="underline" style="width: 220px">
              {{
                info.firstPatientPO ? info.firstPatientPO.neonatalBirthWgt : "-"
              }}
            </div>
            <span>克</span>
          </el-col>
          <el-col :span="7">
            <span style="float: left; font-weight: bold">新生儿入院体重</span>
            <div class="underline" style="width: 195px">
              {{
                info.firstPatientPO ? info.firstPatientPO.neonatalAdmsWgt : "-"
              }}
            </div>
            <span>克</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <span style="float: left; font-weight: bold">出生地</span>
            <div class="underline" style="width: 120px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.birthProvince : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span style="float: left">省(区、市)</span>
            <div class="underline" style="width: 120px">
              <span
                :val="info.firstPatientPO ? info.firstPatientPO.birthCity : '-'"
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span style="float: left">市</span>
            <div class="underline" style="width: 120px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.birthCounty : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span>县</span>
          </el-col>
          <el-col :span="8">
            <span style="float: left; font-weight: bold">籍贯</span>
            <div class="underline" style="width: 120px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.originProvince : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span style="float: left">省(区、市)</span>
            <div class="underline" style="width: 100px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.originCity : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span>市</span>
          </el-col>
          <el-col :span="4">
            <span style="float: left; font-weight: bold">民族</span>
            <div class="underline" style="width: 145px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.ethnicGroup : '-'
                "
                code="NATIONAL_NAME_CODE"
                v-codeTransform
              ></span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <span style="float: left; font-weight: bold">身份证</span>
            <div class="underline" style="width: 450px">
              {{ info.firstPatientPO ? info.firstPatientPO.idCard : "-" }}
            </div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">职业</span>
            <div class="underline" style="width: 228px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.ocpCategoryCd : '-'
                "
                code="OCCUPATIONAL_CLASSIFICATION_CODE"
                v-codeTransform
              ></span>
            </div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">婚姻</span>
            <div class="select-box">
              {{ info.firstPatientPO ? info.firstPatientPO.mrtlSts : "-" }}
            </div>
            <span style="margin-left: 5px"
              >1.未婚 2.已婚 3.丧偶4.离婚 9.其他</span
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="14">
            <span style="float: left; font-weight: bold">现住址</span>
            <div class="underline" style="width: 194px">
              <span
                :val="
                  info.firstPatientPO
                    ? info.firstPatientPO.presAddrProvince
                    : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span style="float: left">省（区、市）</span>
            <div class="underline" style="width: 120px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.presAddrCity : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span style="float: left">市</span>
            <div class="underline" style="width: 120px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.presAddrCounty : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span>县</span>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">电话</span>
            <div class="underline" style="width: 160px">
              {{ info.firstPatientPO ? info.firstPatientPO.patientTel : "-" }}
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">邮编</span>
            <div class="underline" style="width: 150px">
              {{
                info.firstPatientPO ? info.firstPatientPO.presAddrPostalCd : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="19">
            <span style="float: left; font-weight: bold">户口地址</span>
            <div class="underline" style="width: 194px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.regPermRsdtPr : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span style="float: left">省（区、市）</span>
            <div class="underline" style="width: 120px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.regPermRsdtCi : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span style="float: left">市</span>
            <div class="underline" style="width: 120px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.regPermRsdtTo : '-'
                "
                muti="true"
                break
                code="AdministrativDivision"
                v-codeTransform
              ></span>
            </div>
            <span>县</span>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">邮编</span>
            <div class="underline" style="width: 150px">
              {{
                info.firstPatientPO ? info.firstPatientPO.regPermRsdtPo : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="14">
            <span style="float: left; font-weight: bold">工作单位及地址</span>
            <div class="underline" style="width: 530px">
              {{ info.firstPatientPO ? info.firstPatientPO.workUnit : "-" }}
              {{
                info.firstPatientPO ? info.firstPatientPO.workAddrProvince : "-"
              }}
              {{ info.firstPatientPO ? info.firstPatientPO.workAddrCity : "-" }}
              {{
                info.firstPatientPO ? info.firstPatientPO.workAddrCounty : "-"
              }}
              {{ info.firstPatientPO ? info.firstPatientPO.workAddrTown : "-" }}
              {{
                info.firstPatientPO ? info.firstPatientPO.workAddrVillage : "-"
              }}
              {{
                info.firstPatientPO ? info.firstPatientPO.workAddrHouseNo : "-"
              }}
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">单位电话</span>
            <div class="underline" style="width: 160px">
              {{ info.firstPatientPO ? info.firstPatientPO.workAddrTel : "-" }}
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">邮编</span>
            <div class="underline" style="width: 150px">
              {{
                info.firstPatientPO ? info.firstPatientPO.workAddrPostalCd : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="5">
            <span style="float: left; font-weight: bold">联系人姓名</span>
            <div class="underline" style="width: 140px">
              {{ info.firstPatientPO ? info.firstPatientPO.workAddrTel : "-" }}
            </div>
          </el-col>
          <el-col :span="4">
            <span style="float: left; font-weight: bold">关系</span>
            <div class="underline" style="width: 140px">
              <span
                :val="
                  info.firstPatientPO ? info.firstPatientPO.contactPerson : '-'
                "
                code="RELATION_CODE"
                v-codeTransform
              ></span>
            </div>
          </el-col>
          <el-col :span="10">
            <span style="float: left; font-weight: bold">地址</span>
            <div class="underline" style="width: 407px">
              {{
                info.firstPatientPO ? info.firstPatientPO.rlatWithPatient : "-"
              }}
              {{
                info.firstPatientPO ? info.firstPatientPO.ctctPersProvince : "-"
              }}
              {{ info.firstPatientPO ? info.firstPatientPO.ctctPersTown : "-" }}
              {{
                info.firstPatientPO ? info.firstPatientPO.ctctPersCounty : "-"
              }}
              {{
                info.firstPatientPO ? info.firstPatientPO.ctctPersVilage : "-"
              }}
              {{
                info.firstPatientPO ? info.firstPatientPO.ctctPersHouseNo : "-"
              }}
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">电话</span>
            <div class="underline" style="width: 150px">
              {{ info.firstPatientPO ? info.firstPatientPO.ctctPersTel : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col>
            <span style="float: left; font-weight: bold">入院途径</span>
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.admsRoute : "-" }}
            </div>
            <span style="margin-left: 5px"
              >1.急诊 2.门诊 3.其他医疗机构转入 9.其他</span
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="8">
            <span style="float: left; font-weight: bold">入院时间</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? admsDatetime.getFullYear() : "-" }}
            </div>
            <span style="float: left">年</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? admsDatetime.getMonth() + 1 : "-" }}
            </div>
            <span style="float: left">月</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? admsDatetime.getDate() : "-" }}
            </div>
            <span style="float: left">日</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? admsDatetime.getHours() : "-" }}
            </div>
            <span style="float: left">时</span>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">入院科别</span>
            <div class="underline" style="width: 200px">
              <span
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: info.firstPO ? info.firstPO.admsDeptNm : '-',
                }"
                columns="org_nm"
                v-tableTransform
              ></span>
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">病房</span>
            <div class="underline" style="width: 190px">
              {{ info.firstPO ? info.firstPO.admsSickroom : "-" }}
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">转科科别</span>
            <div class="underline" style="width: 145px">
              <span
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: info.firstPO ? info.firstPO.transfDeptNm : '-',
                }"
                columns="org_nm"
                v-tableTransform
              ></span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="8">
            <span style="float: left; font-weight: bold">出院时间</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? dchgDatetime.getFullYear() : "-" }}
            </div>
            <span style="float: left">年</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? dchgDatetime.getMonth() + 1 : "-" }}
            </div>
            <span style="float: left">月</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? dchgDatetime.getDate() : "-" }}
            </div>
            <span style="float: left">日</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? dchgDatetime.getHours() : "-" }}
            </div>
            <span style="float: left">时</span>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">出院科别</span>
            <div class="underline" style="width: 200px">
              <span
                tableName="sys_org"
                :conditionMap="{
                  org_type: '_DEPT_',
                  id: info.firstPO ? info.firstPO.dchgDept : '-',
                }"
                columns="org_nm"
                v-tableTransform
              ></span>
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">病房</span>
            <div class="underline" style="width: 190px">
              {{ info.firstPO ? info.firstPO.dchgSickroom : "-" }}
            </div>
          </el-col>
          <el-col :span="5">
            <span style="float: left; font-weight: bold">实际住院</span>
            <div class="underline" style="width: 126px">
              {{ info.firstPO ? info.firstPO.actHospDays : "-" }}
            </div>
            <span>天</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="14">
            <span style="float: left; font-weight: bold">门（急）诊诊断</span>
            <div class="underline" style="width: 530px">
              <span
                :val="info.firstPO ? info.firstPO.clinicDiag : '-'"
                code="DiseaseDiagnosisContrastCode"
                v-codeTransform
              ></span>
            </div>
          </el-col>
          <el-col :span="10">
            <span style="float: left; font-weight: bold">疾病编码</span>
            <div class="underline" style="width: 363px">
              {{ info.firstPO ? info.firstPO.clinicDiagCd : "-" }}
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="medicalRecord.table1"
        :span-method="arraySpanMethod"
        border
        style="width: 50%; margin-top: 20px; float: left"
      >
        <el-table-column prop="diagNm" label="出院诊断" width="340">
          <template slot-scope="scope">
            <span>{{ medicalRecord.table1[scope.$index].diagF }}</span>
            <span>{{ medicalRecord.table1[scope.$index].diagNm }}</span>
            <!--<span :val="medicalRecord.table1[scope.$index].diagNm" code="DiseaseDiagnosisContrastCode" v-codeTransform></span>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="diagCd"
          label="疾病编码"
          width="136"
        ></el-table-column>
        <el-table-column
          prop="admsCondition"
          label="入院病情"
        ></el-table-column>
      </el-table>
      <el-table
        :data="medicalRecord.table1Ex"
        border
        style="margin-top: 20px; margin-left: 50%; width: 50%"
      >
        <el-table-column prop="diagNm" label="出院诊断" width="340">
          <template slot-scope="scope">
            <span>{{ medicalRecord.table1Ex[scope.$index].diagF }}</span>
            <span>{{ medicalRecord.table1Ex[scope.$index].diagNm }}</span>
            <!--<span :val="medicalRecord.table1Ex[scope.$index].diagNm" code="DiseaseDiagnosisContrastCode" v-codeTransform></span>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="diagCd"
          label="疾病编码"
          width="136"
        ></el-table-column>
        <el-table-column
          prop="admsCondition"
          label="入院病情"
        ></el-table-column>
      </el-table>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col :span="15">
            <span style="float: left; font-weight: bold"
              >损伤、中毒的外部原因</span
            >
            <div class="underline" style="width: 511px">
              <span
                :val="info.firstPO ? info.firstPO.oroiap : '-'"
                code="DiseaseDiagnosisContrastCode"
                v-codeTransform
              ></span>
            </div>
          </el-col>
          <el-col :span="9">
            <span style="float: left; font-weight: bold">疾病编码</span>
            <div class="underline" style="width: 340px">
              {{ info.firstPO ? info.firstPO.oroiapCd : "-" }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col :span="15">
            <span style="float: left; font-weight: bold">病理诊断:</span>
            <div class="underline" style="width: 581px">
              {{ info.firstPO ? info.firstPO.pathDisNm : "-" }}
            </div>
          </el-col>
          <el-col :span="9">
            k;
            <span style="float: left; font-weight: bold">疾病编码</span>
            <div class="underline" style="width: 340px">
              {{ info.firstPO ? info.firstPO.pathDisCd : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="15">
            <div class="underline" style="width: 657px"></div>
          </el-col>
          <el-col :span="9">
            <span style="float: left; font-weight: bold">病理号</span>
            <div class="underline" style="width: 350px">
              {{ info.firstPO ? info.firstPO.pathId : "-" }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col :span="15">
            <span style="float: left; font-weight: bold">药物过敏</span>
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.arDrugF : "-" }}
            </div>
            <span style="float: left; margin-left: 5px"
              >1.无 2.有，过敏药物：</span
            >
            <div class="underline" style="width: 429px">
              {{ info.firstPO ? info.firstPO.arDrug : "-" }}
              <!--<span :val="info.firstPO?info.firstPO.arDrug:'-'" code="AllergenCode" v-codeTransform></span>-->
            </div>
          </el-col>
          <el-col :span="9">
            <span style="float: left; font-weight: bold">死亡患者尸检</span>
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.autopsyF : "-" }}
            </div>
            <span style="margin-left: 5px">1.是 2.否</span>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col :span="12">
            <span style="float: left; font-weight: bold">血型</span>
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.aboBloodCd : "-" }}
            </div>
            <span style="margin-left: 5px">1.A 2.B 3.O 4.AB 5.不详 6.未查</span>
          </el-col>
          <el-col :span="12">
            <span style="float: left; font-weight: bold">Rh</span>
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.rhBloodCd : "-" }}
            </div>
            <span style="margin-left: 5px">1.阴 2.阳 3.不详 4.未查</span>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col :span="5">
            <span style="float: left; font-weight: bold">科主任</span>
            <div class="underline" style="width: 170px"></div>
          </el-col>
          <el-col :span="7">
            <span style="float: left; font-weight: bold"
              >主任（副主任）医师</span
            >
            <div class="underline" style="width: 180px"></div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">主治医师</span>
            <div class="underline" style="width: 180px"></div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">住院医师</span>
            <div class="underline" style="width: 180px"></div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6">
            <span style="float: left; font-weight: bold">责任护士</span>
            <div class="underline" style="width: 166px"></div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">进修医师</span>
            <div class="underline" style="width: 180px"></div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">实习医师</span>
            <div class="underline" style="width: 180px"></div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">编码员</span>
            <div class="underline" style="width: 194px"></div>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col :span="5">
            <span style="float: left; font-weight: bold">病案质量</span>
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.medRecQa : "-" }}
            </div>
            <span style="margin-left: 5px">1.甲 2.乙 3.丙</span>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">质控医师</span>
            <div class="underline" style="width: 200px">
              {{ info.firstPO ? info.firstPO.qaCntlDoc : "-" }}
            </div>
          </el-col>
          <el-col :span="6">
            <span style="float: left; font-weight: bold">质控护士</span>
            <div class="underline" style="width: 200px">
              {{ info.firstPO ? info.firstPO.qaCntlNur : "-" }}
            </div>
          </el-col>
          <el-col :span="7">
            <span style="float: left; font-weight: bold">质控日期</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? qaCntlDate.getFullYear() : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">年</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? qaCntlDate.getMonth() + 1 : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">月</span>
            <div class="underline" style="width: 40px">
              {{ info.firstPO ? qaCntlDate.getDate() : "-" }}
            </div>
            <span style="margin-left: 5px">日</span>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <el-table
        :data="medicalRecord.table2"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          prop="opCd"
          label="手术及操作编码"
          width="106"
        ></el-table-column>
        <el-table-column
          prop="opDate"
          label="手术及操作日期"
          width="114"
        ></el-table-column>
        <el-table-column prop="opLvl" label="手术级别" width="77">
          <template slot-scope="scope">
            <span
              :val="medicalRecord.table2[scope.$index].opLvl"
              code="SurgicalGrade"
              v-codeTransform
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="opNm"
          label="手术及操作名称"
          width="202"
        ></el-table-column>
        <el-table-column label="手术及操作医师" width="288">
          <el-table-column
            prop="opEmpCd"
            width="96px"
            label="术者"
          ></el-table-column>
          <el-table-column
            prop="opAsstOne"
            width="96px"
            label="Ⅰ 助"
          ></el-table-column>
          <el-table-column
            prop="opAsstTwo"
            width="96px"
            label="ⅠⅠ 助"
          ></el-table-column>
        </el-table-column>
        <el-table-column
          prop="incisionHealLvl"
          width="96px"
          label="切口愈合等级"
        >
          <template slot-scope="scope">
            <span
              :val="medicalRecord.table2[scope.$index].incisionHealLvl"
              code="SurgeryIncisionHealGrade"
              v-codeTransform
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="anesthesiaWay"
          width="115px"
          label="麻醉方式"
        ></el-table-column>
        <el-table-column
          prop="anesthesiaEmp"
          label="麻醉医师"
        ></el-table-column>
      </el-table>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col>
            <span style="float: left; font-weight: bold">离院方式</span>
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.leaveHospWay : "-" }}
            </div>
            <span style="float: left; margin-left: 5px"
              >1.医嘱离院 2.医嘱转院，拟接收医疗机构名称:</span
            >
            <div class="underline" style="width: 696px">
              {{
                info.firstPO
                  ? info.firstPO.leaveHospWay == "2"
                    ? info.firstPO.preAcceptHospNm
                    : "-"
                  : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <span style="float: left"
              >3.医嘱转社区卫生服务机构/乡镇卫生院，拟接收医疗机构名称:</span
            >
            <div class="underline" style="width: 399px">
              {{
                info.firstPO
                  ? info.firstPO.leaveHospWay == "3"
                    ? info.firstPO.preAcceptHospNm
                    : "-"
                  : "-"
              }}
            </div>
            <span style="margin-left: 5px">4.非医嘱离院5.死亡9.其他</span>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col>
            <span style="float: left; font-weight: bold"
              >是否有出院31天内再住院计划</span
            >
            <div class="select-box">
              {{ info.firstPO ? info.firstPO.day31InpatientF : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">1.无 2.有，目的:</span>
            <div class="underline" style="width: 744px">
              {{ info.firstPO ? info.firstPO.day31InpatientAim : "-" }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 9px">
          <el-col :span="14">
            <span style="float: left; font-weight: bold"
              >颅脑损伤患者昏迷时间:</span
            >
            <span style="float: left; margin-left: 10px">入院前</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? stuporTimeBefAdms.getDate() : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">天</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? stuporTimeBefAdms.getHours() : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">小时</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? stuporTimeBefAdms.getMinutes() : "-" }}
            </div>
            <span style="margin-left: 5px">分钟</span>
          </el-col>
          <el-col :span="10">
            <span style="float: left; margin-left: 10px">入院后</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? stuporTimeAftAdms.getDate() : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">天</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? stuporTimeAftAdms.getHours() : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">小时</span>
            <div class="underline" style="width: 80px">
              {{ info.firstPO ? stuporTimeAftAdms.getMinutes() : "-" }}
            </div>
            <span style="margin-left: 5px">分钟</span>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: black solid 1px; margin-top: 9px"></div>
      <div style="margin: 0px 10px 0px 10px">
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">住院费用(元):</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left; font-weight: bold">总费用</span>
            <div class="underline" style="width: 200px">
              {{ info.firstCostPO ? info.firstCostPO.totalCost : "-" }}
            </div>
            <span style="float: left; font-weight: bold; margin-left: 5px"
              >(自付金额:</span
            >
            <div class="underline" style="width: 200px">
              {{ info.firstCostPO ? info.firstCostPO.personalCost : "-" }}
            </div>
            <span style="float: left; font-weight: bold; margin-left: 5px"
              >)</span
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">1.综合医疗服务类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(1) 一般医疗服务费:</span>
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.servicesCost : "-" }}
            </div>
            <span style="float: left; margin-left: 20px"
              >(2) 一般治疗操作费:</span
            >
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.commTreatCost : "-" }}
            </div>
            <span style="float: left; margin-left: 20px">(3) 护理费:</span>
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.commNurseCost : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="21">
            <span style="float: left">(4) 其他费用:</span>
            <div class="underline" style="width: 200px">
              {{ info.firstCostPO ? info.firstCostPO.commOtherCost : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">2.诊断类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(5) 病理诊断费:</span>
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.pathDiagCost : "-" }}
            </div>
            <span style="float: left; margin-left: 20px"
              >(6) 实验室诊断费:</span
            >
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.labDiagCost : "-" }}
            </div>
            <span style="float: left; margin-left: 20px"
              >(7) 影像学诊断费:</span
            >
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.imagingDiagCost : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="21">
            <span style="float: left">(8) 临床诊断项目费:</span>
            <div class="underline" style="width: 200px">
              {{ info.firstCostPO ? info.firstCostPO.clinicDiagItemCost : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">3.治疗类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(9) 非手术治疗项目费:</span>
            <div class="underline" style="width: 450px">
              {{ info.firstCostPO ? info.firstCostPO.nonOpTreatItemCost : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">(临床物理治疗费:</span>
            <div class="underline" style="width: 190px">
              {{
                info.firstCostPO
                  ? info.firstCostPO.clinicPhysicalTreatCost
                  : "-"
              }}
            </div>
            <span style="margin-left: 5px">)</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="21">
            <span style="float: left">(10) 手术治疗费:</span>
            <div class="underline" style="width: 362px">
              {{ info.firstCostPO ? info.firstCostPO.opTreatCost : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">(麻醉费:</span>
            <div class="underline" style="width: 150px">
              {{ info.firstCostPO ? info.firstCostPO.anestheticCost : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">手术费:</span>
            <div class="underline" style="width: 150px">
              {{ info.firstCostPO ? info.firstCostPO.opCost : "-" }}
            </div>
            <span style="margin-left: 5px">)</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">4.康复类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(11) 康复费:</span>
            <div class="underline" style="width: 228px">
              {{ info.firstCostPO ? info.firstCostPO.recoveryCost : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">5.中医类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(12) 中医治疗费:</span>
            <div class="underline" style="width: 228px">
              {{
                info.firstCostPO ? info.firstCostPO.chineseMedcTreatCost : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">6.西药类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(13) 西药费:</span>
            <div class="underline" style="width: 254px">
              {{ info.firstCostPO ? info.firstCostPO.westernMedcCost : "-" }}
            </div>
            <span style="float: left; margin-left: 5px">(抗菌药物费用:</span>
            <div class="underline" style="width: 190px">
              {{
                info.firstCostPO ? info.firstCostPO.antibacterialDrugCost : "-"
              }}
            </div>
            <span style="margin-left: 5px">)</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">7.中药类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(14) 中成药费:</span>
            <div class="underline" style="width: 228px">
              {{ info.firstCostPO ? info.firstCostPO.inMedcCost : "-" }}
            </div>
            <span style="float: left; margin-left: 20px">(15) 中草药费:</span>
            <div class="underline" style="width: 228px">
              {{
                info.firstCostPO ? info.firstCostPO.chineseHerbalMedcCost : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">8.血液和血液制品类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(16) 血费:</span>
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.bloodCost : "-" }}
            </div>
            <span style="float: left; margin-left: 20px"
              >(17) 白蛋白类制品费:</span
            >
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.albuminProductCost : "-" }}
            </div>
            <span style="float: left; margin-left: 20px"
              >(18) 球蛋白类制品费:</span
            >
            <div class="underline" style="width: 180px">
              {{
                info.firstCostPO ? info.firstCostPO.globulinsProductCost : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="21">
            <span style="float: left">(19) 凝血因子类制品费:</span>
            <div class="underline" style="width: 190px">
              {{
                info.firstCostPO
                  ? info.firstCostPO.coagulationFactorProductCost
                  : "-"
              }}
            </div>
            <span style="float: left; margin-left: 20px"
              >(20) 细胞因子类制品费:</span
            >
            <div class="underline" style="width: 190px">
              {{
                info.firstCostPO ? info.firstCostPO.cytokineProductsCost : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">9.耗材类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(21) 检查用一次性医用材料费:</span>
            <div class="underline" style="width: 190px">
              {{
                info.firstCostPO ? info.firstCostPO.meterialMedcDisposCost : "-"
              }}
            </div>
            <span style="float: left; margin-left: 20px"
              >(22) 治疗用一次性医用材料费:</span
            >
            <div class="underline" style="width: 190px">
              {{
                info.firstCostPO
                  ? info.firstCostPO.materialsMedcDisposCost
                  : "-"
              }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="21">
            <span style="float: left">(23) 手术用一次性医用材料费:</span>
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.opMedcDisposCost : "-" }}
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="3">
            <span style="font-weight: bold">10.其他类:</span>
          </el-col>
          <el-col :span="21">
            <span style="float: left">(24) 其他费:</span>
            <div class="underline" style="width: 190px">
              {{ info.firstCostPO ? info.firstCostPO.otherCost : "-" }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div
        style="
          margin: 20px 10px 0px 10px;
          border: black solid 1px;
          height: 140px;
        "
      ></div>
      <div style="margin: 20px 10px 0px 10px">
        <el-row style="margin-top: 20px">
          <el-col :span="1">
            <span style="font-weight: bold">说明:</span>
          </el-col>
          <el-col :span="23">
            <span
              >(一) 医疗付费方式 1.城镇职工基本医疗保险 2.城镇居民基本医疗保险
              3.新型农村合作医疗 4.贫困救助 5.商业医疗保险 6.全公费 7.全自费
              8.其他社会保险 9.其他</span
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px; margin-bottom: 20px">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="23">
            <span
              >(二)
              凡可由医院信息系统提供住院费用清单的，住院病案首页中可不填写“住院费用”。</span
            >
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getMrHomePage } from "@/api/emrRecord/emr/instrument.js";
import { mapGetters } from "vuex";

export default {
  name: "mrHomepage",
  data() {
    return {
      info: {},
      medicalRecord: {
        table1: [
          // {
          //   dischargeDiagnosis: "主要诊断:",
          //   diseaseCode: '',
          //   admittedCondition: ''
          // },
          // {
          //   dischargeDiagnosis: "其他诊断:",
          //   diseaseCode: '',
          //   admittedCondition: ''
          // },{},{},{},{},{},{},{},{},{},
          // {
          //   dischargeDi11agnosis: "入院病情：1.有，2.临床未确定，3.情况不明，4.无",
          //   diseaseCode: '',
          //   admittedCondition: ''
          // }
        ],
        table1Ex: [
          // {
          // dischargeDiagnosis: "其他诊断:",
          // diseaseCode: '',
          // admittedCondition: ''
          // },{},{},{},{},{},{},{},{},{},{},{}
        ],
        table2: [],
      },
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["diagnosis"]),
    birthDate() {
      return new Date(
        this.info.firstPatientPO ? this.info.firstPatientPO.birthday : ""
      );
    },
    admsDatetime() {
      return new Date(this.info.firstPO ? this.info.firstPO.admsDatetime : "");
    },
    dchgDatetime() {
      return new Date(this.info.firstPO ? this.info.firstPO.dchgDatetime : "");
    },
    qaCntlDate() {
      return new Date(this.info.firstPO ? this.info.firstPO.qaCntlDate : "");
    },
    stuporTimeBefAdms() {
      return new Date(
        this.info.firstPO ? this.info.firstPO.stuporTimeBefAdms : ""
      );
    },
    stuporTimeAftAdms() {
      return new Date(
        this.info.firstPO ? this.info.firstPO.stuporTimeAftAdms : ""
      );
    },
  },
  watch: {
    receivePatientData: {
      handler(n) {
        // this.getMrHomePage()
      },
      deep: true,
    },
    diagnosis: {
      handler(n) {
        console.log("diagnosis", this.diagnosis);
        this.getMrHomePage();
      },
      deep: true,
    },
  },
  mounted() {
    this.getMrHomePage();
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == this.medicalRecord.table1.length - 1) {
        if (columnIndex === 0) {
          return [1, 3];
        } else if (columnIndex === 1) {
          return [0, 0];
        } else if (columnIndex === 2) {
          return [0, 0];
        }
      }
      return [1, 1];
    },
    getMrHomePage() {
      let param = {
        patientId: this.diagnosis.paId,
        enId: this.diagnosis.enNo,
      };
      getMrHomePage(param).then((res) => {
        if (res.code == 1) {
          this.info = res.data;
          this.medicalRecord.table1 = [];
          this.medicalRecord.table1Ex = [];
          let len = 0;
          if (
            !res.data.firstDiagPOLst ||
            res.data.firstDiagPOLst.length == 0 ||
            res.data.firstDiagPOLst[0].masterF === "1"
          ) {
            len = 11;
          } else {
            //第一条是其他诊断，加一条空
            this.medicalRecord.table1.push({});
            len = 10;
          }
          for (let i = 0; i < len; i++) {
            if (i < res.data.firstDiagPOLst.length) {
              this.medicalRecord.table1.push(res.data.firstDiagPOLst[i]);
            } else {
              this.medicalRecord.table1.push({});
            }
          }
          if (!this.medicalRecord.table1[0].diagNm) {
            this.medicalRecord.table1[0].diagNm = "";
          }
          if (!this.medicalRecord.table1[1].diagNm) {
            this.medicalRecord.table1[1].diagNm = "";
          }
          this.medicalRecord.table1[0].diagF = "主要诊断:";
          this.medicalRecord.table1[1].diagF = "其他诊断:";
          // this.medicalRecord.table1[0].diagNm = "主要诊断:" + this.medicalRecord.table1[0].diagNm
          // this.medicalRecord.table1[1].diagNm = "其他诊断:" + this.medicalRecord.table1[1].diagNm
          this.medicalRecord.table1.push({
            diagF: "入院病情：1.有，2.临床未确定，3.情况不明，4.无",
            diagCd: "",
            admsCondition: "",
          });

          for (let j = len - 1; j < len + 11; j++) {
            if (j < res.data.firstDiagPOLst.length) {
              this.medicalRecord.table1Ex.push(res.data.firstDiagPOLst[j]);
            } else {
              this.medicalRecord.table1Ex.push({});
            }
          }
          console.log("adadsadadaa:", this.medicalRecord.table1Ex);
          if (!this.medicalRecord.table1Ex[0].diagNm) {
            this.medicalRecord.table1Ex[0].diagNm = "";
          }
          this.medicalRecord.table1Ex[0].diagF = "其他诊断:";
          // this.medicalRecord.table1Ex[0].diagNm = "其他诊断:" + this.medicalRecord.table1Ex[0].diagNm

          this.medicalRecord.table2 = res.data.firstOpPOLst;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-table td,
/deep/.el-table th.is-leaf,
/deep/.el-table--border,
/deep/.el-table--group,
/deep/.el-table--border th {
  border-color: black;
}
/deep/.el-table .el-table__body tr {
  height: 40px;
}
/deep/.el-table th > .cell {
  text-align: center;
  line-height: 36px;
  color: #2e323a;
  font-weight: bold;
  background-color: #ffffff;
}
/deep/.el-table thead.is-group th {
  background-color: #ffffff;
}
.select-box {
  height: 20px;
  width: 20px;
  border: black solid 1px;
  float: left;
  margin-left: 5px;
  text-align: center;
  line-height: 20px;
}
.underline {
  border-bottom: #949da3 solid 1px;
  height: 15px;
  margin-left: 10px;
  float: left;
  text-align: center;
}
</style>
