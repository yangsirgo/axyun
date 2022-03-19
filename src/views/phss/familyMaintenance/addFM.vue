<template>
  <div class="addFM">
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <main class="table_main">
        <el-row>
          <el-col :span="2">
            <div class="lh180 center">家庭基本信息</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">
                  <div>户 主</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" readonly v-model="HomeDocVO.houseHolder">
                        <!--<template slot="append">℃</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>网 格*</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="gridStyle">
                    <!-- <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.grid">
                    </el-input> -->
                    <el-cascader v-model="HomeDocVO.grid" :options="neighborhoodGridOptions" clearable></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>固定电话</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.fixedTelephone">
                        <!--<template slot="append">℃</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>移动电话</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.mobilePhone">
                      <!--<template slot="append">次/分钟</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="4">
                  <div>家庭地址</div>
                </el-col>
                <el-col :span="16">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.address">
                        <!--<template slot="append">cm</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div class="lh20">家庭类型</div>
                </el-col>
                <el-col :span="6">
                  <div class="lh28 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="HomeDocVO.familyType">
                        <el-radio label="1">1-集中式</el-radio>
                        <el-radio label="2">2-分布式</el-radio>

                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.familyType"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>邮编</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.postalCode">
                        <!--<template slot="append">cm</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>家庭人口</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.familyPopulation">
                        <!--<template slot="append">℃</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>现住人口</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.currentPopulation">
                      <!--<template slot="append">次/分钟</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>家庭档案编号*</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="this.status == 'add' ? false:true" v-model="HomeDocVO.homeCode">
                        <!--<template slot="append">℃</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>户号</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.familyNum">
                      <!--<template slot="append">次/分钟</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="lh60 center">家庭位置</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">
                  <div class="lh20">离医疗站</div>
                </el-col>
                <el-col :span="6">
                  <div class="lh28 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="HomeDocVO.homeLocationMedicalStation">
                        <el-radio label="1">1-近</el-radio>
                        <el-radio label="2">2-远</el-radio>
                        <!--<el-radio label="3">3-说不清楚</el-radio>-->
                        <!--<el-radio label="4">4-不大满意</el-radio>-->
                        <!--<el-radio label="5">5-不满意</el-radio>-->
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.homeLocationMedicalStation"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="lh20">离公路</div>
                </el-col>
                <el-col :span="6">
                  <div class="lh28 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="HomeDocVO.homeLocationHighway">
                        <el-radio label="1">1-近</el-radio>
                        <el-radio label="2">2-远</el-radio>
                        <!--<el-radio label="3">3-说不清楚</el-radio>-->
                        <!--<el-radio label="4">4-不大满意</el-radio>-->
                        <!--<el-radio label="5">5-不满意</el-radio>-->
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.homeLocationHighway"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div class="lh20">离商店</div>
                </el-col>
                <el-col :span="6">
                  <div class="lh28 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="HomeDocVO.homeLocationShop">
                        <el-radio label="1">1-近</el-radio>
                        <el-radio label="2">2-远</el-radio>
                        <!--<el-radio label="3">3-说不清楚</el-radio>-->
                        <!--<el-radio label="4">4-不大满意</el-radio>-->
                        <!--<el-radio label="5">5-不满意</el-radio>-->
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.homeLocationShop"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="lh20">离派出所</div>
                </el-col>
                <el-col :span="6">
                  <div class="lh28 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="HomeDocVO.homeLocationPoliceStation">
                        <el-radio label="1">1-近</el-radio>
                        <el-radio label="2">2-远</el-radio>
                        <!--<el-radio label="3">3-说不清楚</el-radio>-->
                        <!--<el-radio label="4">4-不大满意</el-radio>-->
                        <!--<el-radio label="5">5-不满意</el-radio>-->
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.homeLocationPoliceStation"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="lh60 center">居住环境</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">
                  <div class="lh20">现住房使用面积(平方米)</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.area">
                      <!--<template slot="append">℃</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <div class="lh20">住房类型</div>
                </el-col>
                <el-col :span="6">
                  <div class="lh28 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="HomeDocVO.homeType">
                        <el-radio label="1">1-公租房</el-radio>
                        <el-radio label="2">2-廉租房</el-radio>
                        <!--<el-radio label="3">3-说不清楚</el-radio>-->
                        <!--<el-radio label="4">4-不大满意</el-radio>-->
                        <!--<el-radio label="5">5-不满意</el-radio>-->
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.homeType"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div class="lh20">通风采光</div>
                </el-col>
                <el-col :span="16">
                  <div class="lh28 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="HomeDocVO.lighting">
                        <el-radio label="1">1-良好</el-radio>
                        <el-radio label="2">2-一般</el-radio>
                        <el-radio label="3">3-差</el-radio>
                        <!--<el-radio label="4">4-不大满意</el-radio>-->
                        <!--<el-radio label="5">5-不满意</el-radio>-->
                      </el-radio-group>
                    </div>

                    <PFormInput class="mr-10">
                      <el-input style="margin-left: 20px" v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.lighting"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="lh60 center">家庭经济状况</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">
                  <div class="lh20">家庭经济收入(元)</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.householdIncome">
                      <!--<template slot="append">℃</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <div class="lh20">家庭设施</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.familyFacilities">
                      <!--<template slot="append">℃</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <div class="lh20">家庭功能评估：最高10分：评估结果</div>
                </el-col>
                <el-col :span="14">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.familyFunctionAssessment">
                      <!--<template slot="append">℃</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #000;">
          <el-col :span="2">
            <div class="lh150 center">建档信息</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">
                  <div>建档医生*</div>
                </el-col>
                <el-col :span="6">
                  <!--<div>-->
                  <!--<el-form-item>-->
                  <!--<el-input-->
                  <!--v-if="!readonly"-->
                  <!--:readonly="readonly"-->
                  <!--v-model="TableForm.temperature"-->
                  <!--&gt;-->
                  <!--&lt;!&ndash;<template slot="append">℃</template>&ndash;&gt;-->
                  <!--</el-input>-->
                  <!--</el-form-item>-->
                  <!--</div>-->
                  <el-select v-model="HomeDocVO.docDoctor" :disabled="this.status == 'add' ? false:true">
                    <el-option v-for="item in docDoctors" :key="item.id" :label="item.label" :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <div>建档日期</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="this.status != 'view' ? true:false"  v-model="HomeDocVO.docTime">
                      <!--<template slot="append">次/分钟</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>建档单位</div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item>
                      <el-input :readonly="true" v-model="HomeDocVO.docHos">
                        <!--<template slot="append">℃</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>当前机构</div>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="this.status == 'add' ? false : this.status == 'modify' ? true : false" v-model="HomeDocVO.docCurrentHos">
                      <!--<template slot="append">次/分钟</template>-->
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="4">
                  <div>补充更新记录</div>
                </el-col>
                <el-col :span="16">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="HomeDocVO.docUpdateRecord">
                        <!--<template slot="append">cm</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>责任医生信息*</div>
                </el-col>
                <el-col :span="16">
                  <!--<div>-->
                  <!--<el-form-item>-->
                  <!--<el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.height">-->
                  <!--&lt;!&ndash;<template slot="append">cm</template>&ndash;&gt;-->
                  <!--</el-input>-->
                  <!--</el-form-item>-->
                  <!--</div>-->
                  <el-select v-model="HomeDocVO.responsibleDoctor" style="width: 100%">
                    <el-option v-for="item in respDoctors" :key="item.id" :label="item.label" :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>登记日期</div>
                </el-col>
                <el-col :span="16">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="this.status == 'add' ? false:true" v-model="HomeDocVO.registrationDate">
                        <!--<template slot="append">cm</template>-->
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <div>
          <div style="text-align: center" class="familyStyle bg-purple-light">家庭成员列表</div>
          <div class="familyStyle-list">


          <el-col :span="14">
            <div class="queryBox">
            <el-row style="border:none !important;">
              <el-col class="paddingBorder" :span="10">
                <el-input class="familyStyleinput" style="height: 40px !important;" placeholder="姓名或简码" v-model="queryData.rsdtName" />
              </el-col>
              <el-col class="paddingBorder" :span="10">
                <l-formt-title label="医疗机构" class="center" style="width: 90%;">
                  <el-select v-model="queryData.currentOrgName" clearable filterable @change="onOrgChange">
                    <el-option v-for="item in hosOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </l-formt-title>
              </el-col>
              <el-col class="paddingBorder borderNone" :span="4">
                <el-button @click="resetData()">重置</el-button>
              </el-col>
            </el-row>
            <el-row style="border:none !important;">
              <el-col class="paddingBorder" :span="10">
                <el-input placeholder="身份证号" v-model="queryData.idNo" />
              </el-col>
              <el-col class="paddingBorder" :span="10">
                <l-formt-title label="迁入网格" class="center" style="width: 90%;">
                  <el-cascader v-model="queryData.grid" :options="gridOptions"></el-cascader>
                </l-formt-title>
              </el-col>
              <el-col class="paddingBorder borderNone" :span="4">
                <el-button type="primary" @click="queryFun">查询</el-button>
              </el-col>
            </el-row>
          </div>
            <el-table :data="data1" border ref="selection" @selection-change="checkAll" style="width: 100%" height="500">
              <el-table-column type="selection" width="30"></el-table-column>
              <el-table-column prop="rsdtName" label="姓名" width="100"></el-table-column>
              <el-table-column prop="sex" label="性别" width="100">
              </el-table-column>
              <el-table-column prop="age" label="年龄"></el-table-column>
              <el-table-column prop="idNo" label="身份证号"></el-table-column>
              <el-table-column prop="currentAddress" label="家庭住址"></el-table-column>
            </el-table>
            <el-pagination class="QueryList_main_page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="reqParams.pageNo" :page-sizes="[20, 40, 100, 200]" :page-size="reqParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="total"></el-pagination>
          </el-col>
          <el-col :span="2" style="border:none !important;">
            <div class="opSetting">
              <div @click="handelSelect">
                <el-button icon="el-icon-arrow-right" :disabled="nowSelectData.length?false:true" :size="buttonSize"
                  type="primary">
                </el-button>
              </div>
              <div class="spacing" @click="handleRemoveSelect">
                <el-button icon="el-icon-arrow-left" :disabled="nowSelectRightData.length?false:true" :size="buttonSize"
                  type="primary">
                </el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="8" style="border:none !important;margin-top: 138px;">
            <el-table :data="selectArr" border ref="selection" @selection-change="checkRightAll" style="width: 100%"
              height="500">
              <el-table-column type="selection" width="30"></el-table-column>
              <el-table-column prop="rsdtName" label="姓名" width="100"></el-table-column>
              <el-table-column prop="sex" label="性别" width="100">
              <!-- <template slot-scope="scope">
                  <label>{{scope.row.gender==1?'未知':(scope.row.gender==2?'男':'女')}}</label>
                </template> -->
              </el-table-column>
              <el-table-column label="与户主的关系">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.householdRealtionStatus" placeholder="请选择" @change="familyHistory(scope.row)">
                    <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id">
                    </el-option>
                  </el-select>
                </template>

              </el-table-column>
            </el-table>
          </el-col>
         </div>
        </div>
      </main>
    </el-form>
  </div>
</template>

<script>
  import {
    dateConversion,
    getCurrentTime_
  } from "@/utils/common";
  import { getUserId, getPamars } from "@/utils/auth";
  import {
    onPost,
    onGet
  } from "@/api/public/public";
  import {
    queryRegionAndGridByHospitalId
  } from "@/api/phss/region/grid_information";
  import {
    getAllDocByAge,
    getBaseHomDoc,
    saveBaseHomDoc,
    viewBaseHomDoc
  } from "@/api/phss/family_maintenance/family_maintenance";

  export default {
    name: "addFM",
    components: {},
    props: ["data"],
    data() {
      return {
        newDate: getCurrentTime_(),
        baseMes: JSON.parse(getPamars()),
        AllStepData: {},
        queryData: {
          rsdtName: "", //姓名
          grid: "", //网络
          idNo: "", //身份证
          currentOrgId: '', //当前机构
          currentOrgName: '' //当前机构名称
        },
        homes: [

        ],
        HomeDocVO: {
          editStatus: '',
          members: [],
          // 家庭档案编号
          homeCode: '',
          //户主
          houseHolder: '',
          // 网格
          grid: '',
          homeNum: '',
          postalCode: '',
          status: '',
          address: '',
          createdBy: '',
          createdByName: '',
          createdAt: '',
          updatedBy: '',
          updatedByName: '',
          updatedAt: '',
          deletedStatus: '',
          fixedTelephone: '',
          mobilePhone: '',
          familyType: '',
          familyPopulation: '',
          currentPopulation: '',
          // 户号
          familyNum: '',
          homeLocationMedicalStation: '',
          homeLocationHighway: '',
          homeLocationShop: '',
          homeLocationPoliceStation: '',
          area: '',
          homeType: '',
          lighting: '',
          // 家庭收入
          householdIncome: '',
          // 家庭设施
          familyFacilities: '',
          familyFunctionAssessment: '',
          docDoctor: '',
          docTime: '',
          docHos: '',
          docCurrentHos: '',
          docUpdateRecord: '',
          responsibleDoctor: '',
          registrationDate: ''
        },
        gridOptions: [],
        hosOptions: [],
        docDoctors: [],
        respDoctors: [],
        household_realtion_status: '',
        /*******/
        total: 0,
        reqParams: {
          pageNo: 1,
          pageSize: 10
        },
        selectArr: [], // 右边列表
        buttonSize: "large",
        options: [],
        value: "",
        data1: [],
        nowSelectData: [], // 左边选中列表数据
        nowSelectRightData: [], // 右边选中列表数据
        /******/
        // 是否只读
        readonly: false,
        // input最大个数
        maxLength: 0,
        // 状态 新增 查看 编辑  view edit
        status: "",
        // 表单数据
        TableForm: {
          checkup_date: "", //体检日期
          responsibility_doctor: "", //责任医生
          symptom: "", //症状
          symptom_other: "", //症状其他
          temperature: "", //体温
          pulse_rate: "", //脉率
          respiratory_rate: "", //呼吸频率(次/分钟)
          blood_pressure_left_L: "", //血压左侧-低
          blood_pressure_left_H: "", //血压左侧-高
          blood_pressure_right_L: "", //血压右侧-低
          blood_pressure_right_H: "", //血压右侧-高
          height: "", //身高
          weight: "", //体重
          waistline: "", //腰围
          BMI: "", //体质指数（BMI）
          health_status: "", //老年人健康状态自我评估
          self_care: "", //老年人生活自理能力自我评估
          cognition: "", //老年人认知功能
          cognition_total_score: "", //老年人认知功能总分
          emotional_state: "", //老年人情感状态
          emotional_total_score: "", //老年人情感状态总分
          exercise_frequency: "", //锻炼频率
          each_exercise_duration: "", //每次锻炼时间
          exercise_duration: "", //坚持锻炼时间
          exercise_type: "", //锻炼方式
          eating_habits: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ], //饮食习惯
          smoking: "", //吸烟状况
          smoking_amount: "", //日吸烟量
          smoking_age: "", //开始吸烟年龄
          quit_smoking_age: "", //戒烟年龄
          drinking_frequency: "", //饮酒频率
          drinking_amount: "", //日饮酒量
          quit_drinking: "", //是否戒酒
          quit_drinking_age: "", //戒酒年龄
          drinking_age: "", //开始饮酒年龄
          drunk_nearly_year: "", //近一年内是否曾醉酒
          drinking_type: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ], //饮酒种类
          drinking_type_other: "", //饮酒种类其他
          occupational_hazards_history: "", //职业病危害因素接触史(有/无)
          work_type: "", //工种
          working_hours: "", //从业时间    年
          dust: "", //毒物种类  粉尘
          dust_protect: "", //毒物种类  粉尘防护措施
          dust_have_protect: "", //毒物种类  粉尘防护措施
          radioactive_material: "", //毒物种类  放射物质
          radioactive_material_protect: "", //毒物种类  放射物质防护措施
          radioactive_material_have_protect: "", //毒物种类  放射物质防护措施
          physical_factor: "", //毒物种类  物理因素
          physical_factor_protect: "", //毒物种类  物理因素防护措施
          physical_factor_have_protect: "", //毒物种类  物理因素防护措施
          chemical_material: "", //毒物种类  化学物质
          chemical_material_protect: "", //毒物种类  化学物质防护措施
          chemical_material_have_protect: "", //毒物种类  化学物质防护措施
          toxic_species_other: "", //毒物种类  其他
          toxic_species_other_protect: "", //毒物种类  其他防护措施
          toxic_species_other_have_protect: "" //毒物种类  其他防护措施
        },
        // 责任医生 选择框数据
        selectOptions: [],
        // 网格
        neighborhoodGridOptions: [],
        // --- checkbox Data ---
        symptomOptions: [{
            id: "1",
            content: "无症状"
          },
          {
            id: "2",
            content: "头痛"
          },
          {
            id: "3",
            content: "头晕"
          },
          {
            id: "4",
            content: "心悸"
          },
          {
            id: "5",
            content: "胸闷"
          },
          {
            id: "6",
            content: "胸痛"
          },
          {
            id: "7",
            content: "慢性咳嗽"
          },
          {
            id: "8",
            content: "咳痰"
          },
          {
            id: "9",
            content: "呼吸困难"
          },
          {
            id: "10",
            content: "多饮"
          },
          {
            id: "11",
            content: "多尿"
          },
          {
            id: "12",
            content: "体重下降"
          },
          {
            id: "13",
            content: "乏力"
          },
          {
            id: "14",
            content: "关节肿痛"
          },
          {
            id: "15",
            content: "视力模糊"
          },
          {
            id: "16",
            content: "手脚麻木"
          },
          {
            id: "17",
            content: "尿急"
          },
          {
            id: "18",
            content: "尿痛"
          },
          {
            id: "19",
            content: "便秘"
          },
          {
            id: "20",
            content: "腹泻"
          },
          {
            id: "21",
            content: "恶心呕吐"
          },
          {
            id: "22",
            content: "眼花"
          },
          {
            id: "23",
            content: "耳鸣"
          },
          {
            id: "24",
            content: "乳房胀痛"
          },
          {
            id: "25",
            content: "其他"
          }
        ],
        EatingHabitsOptions: [{
            id: "1",
            content: "荤素均衡"
          },
          {
            id: "2",
            content: "荤食为主"
          },
          {
            id: "3",
            content: "素食为主"
          },
          {
            id: "4",
            content: "嗜盐"
          },
          {
            id: "5",
            content: "嗜油"
          },
          {
            id: "6",
            content: "嗜糖"
          }
        ],
        DrinkingTypesOptions: [{
            id: "1",
            content: "白酒"
          },
          {
            id: "2",
            content: "啤酒"
          },
          {
            id: "3",
            content: "红酒"
          },
          {
            id: "4",
            content: "黄酒"
          },
          {
            id: "5",
            content: "其他"
          }
        ],
        chObject: {
          symptom: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          eating_habits: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          drinking_type: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ]
        }
        // --- checkbox Data ---
      };
    },
    created() {
      this.status = this.data.status;
      console.info("==========传过来的==========点击",this.status);
      console.info("时间",this.newDate);
      console.log("",this.baseMes);
      this.EchoMethod();
      this.onqueryRegionAndGridByHospitalId(null)
    },
    mounted() {
      if (this.data.status == 'add') {
        this.init();
        this.HomeDocVO.editStatus = this.data.status;
        this.HomeDocVO.docTime = this.newDate;
        this.HomeDocVO.registrationDate = this.newDate;
        this.HomeDocVO.docHos = this.baseMes.hosName;
        this.HomeDocVO.docCurrentHos = this.baseMes.hosName
        this.peopleData({
          "ad": "123"
        });
      }
      // selectArr
      if (this.data.status == 'modify') {
        this.HomeDocVO = this.data.rowData;
        this.HomeDocVO.editStatus = this.data.status;
        this.HomeDocVO.members = [];
        console.info("=========家庭信息传过来的编辑数据============",this.HomeDocVO);
        this.selectArr = this.data.rowData.familyInformationVOList;
        for (let a of this.selectArr) {
          this.HomeDocVO.members.push(a);
        }
        this.peopleData({
          "ad": "123"
        });
      }
      this.baseData({
        "ad": "123"
      });
    },
    methods: {
      load(data) {
        viewBaseHomDoc(data)
          .then(res => {
            // console.info("家庭关系", JSON.stringify(res.data))
          }).catch(error => {
            console.log(error);
          });
      },
      // 网格下拉框
      onqueryRegionAndGridByHospitalId(hospitalId) {
        queryRegionAndGridByHospitalId({
          hospitalId: hospitalId
        })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              // if (flg == "dr") {
              this.neighborhoodGridOptions = res.data;

            } else {
              console.log(res);

            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      familyHistory(data) {
        let oldMembers = this.HomeDocVO.members;
        let newMembers = this.HomeDocVO.members
        newMembers.push(data);
         for (var i = 0;i < oldMembers.length;i++){
           for (var j = i + 1;j < newMembers.length;j++){
                if(oldMembers[i].id == newMembers[j].id){
                  newMembers.splice(j,1);
                  j--;
                }
           };
         }
         for (var i = 0;i < newMembers.length;i++){
            if(data.householdRealtionStatus == '01'){
                  if(newMembers[i].id == data.id){
                    newMembers[i].householdRealtionStatus = '01';
                    this.HomeDocVO.houseHolder = data.rsdtName
                 }else{
                   if(newMembers[i].householdRealtionStatus == '01'){
                     newMembers[i].householdRealtionStatus = '';
                   }
                 }
            }
         };
        this.HomeDocVO.members = newMembers;
        console.log("家庭基本信息===============选择完之后", this.HomeDocVO.members);
      },
      peopleData(data) {
        getAllDocByAge(data).then(res => {
          this.data1 = res.data;
          // for (var i = 0;this.data1.length;i++){
          //   for(var j = 0;this.selectArr.length;j++){
          //     if(this.data1[i].id == this.selectArr[j].id){
          //      this.data1 = this.data1.slice(i);
          //     }
          //   }s
          // }
          console.log(this.data1)
          // console.info("列表数据", JSON.stringify(this.data1))
        }).catch(error => {
          console.log(error);
        })
      },
      baseData(data) {
        getBaseHomDoc(data)
          .then(res => {
            console.log("=========addFM回显的数据===========", res.data);
            this.options = res.data.familyRelationships;
            // this.gridOptions = res.data.basicGrids;
            this.hosOptions = res.data.basicHosps;
            this.docDoctors = res.data.docDoctors;
            this.respDoctors = res.data.responDoctors;

          }).catch(error => {
            console.log(error);
          });
      },
     // 保存
      saveMethod(data) {
         this.$emit("saveMethod",this.HomeDocVO);
      },
      checkAll(val) {
        this.nowSelectData = val;
      },
      checkRightAll(val) {
        this.nowSelectRightData = val;
      },
      // 选中
      handelSelect() {
        this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData);
        let result = [];
        let obj = {};
        for(var i = 0;i < this.selectArr.length;i++){
          if(!obj[this.selectArr[i].id]){
                     result.push(this.selectArr[i]);
                     obj[this.selectArr[i].id] = true;
             }
        }
        this.selectArr = result;
        this.handleRemoveTabList(this.nowSelectData,this.data1);
        this.nowSelectData = [];
        this.HomeDocVO.familyPopulation = this.selectArr.length;
        console.log("=====================this.data1===============",this.data1)
        console.log("==========this.selectArr选中==========",this.selectArr);

        console.log("==============this.HomeDocVO.members===============",this.HomeDocVO.members);

      },
      // 取消
      handleRemoveSelect() {
        this.data1 = this.handleConcatArr(this.data1, this.nowSelectRightData);
        this.handleRemoveTabList(this.nowSelectRightData, this.selectArr);
        this.nowSelectRightData = [];
        this.HomeDocVO.familyPopulation = this.selectArr.length;
        for (let i = 0; i < this.HomeDocVO.members.length; i++) {
          if (this.selectArr.indexOf(this.HomeDocVO.members[i]) == -1) {
            this.HomeDocVO.members.splice(i, 1);
          }
        }
          console.log("this.HomeDocVO.members",this.HomeDocVO.members)
      },
      // 改变数据
      onOrgChange(flg) {
        this.onQueryUsersByHosId(this.queryData.current_org_name, "dr");
        this.getRegionAndGridByHospitalId(null);
      },
      onQueryUsersByHosId(hosId, flg) {
        onPost({
            url: "/sysPublic/onQueryUsersByHosId",
            data: {
              hosId: hosId
            }
          })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              if (flg == "dr") {
                this.drOptions = res.data;
              } else {
                this.userOptions = res.data;
              }
            } else {
              if (flg == "dr") {
                this.drOptions = [];
              } else {
                this.userOptions = [];
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      getRegionAndGridByHospitalId(flg) {
        var hospitalId = "";
        hospitalId = this.queryData.currentOrgName;
        queryRegionAndGridByHospitalId({
            hospitalId: hospitalId
          })
          .then(res => {
            if (res.code === 1) {
              if (flg == "in") {
                this.inGridOptions = res.data;
              } else if (flg == "out") {
                this.outGridOptions = res.data;
              } else {
                this.gridOptions = res.data;
              }
            } else {
              if (flg == "in") {
                this.inGridOptions = [];
              } else if (flg == "out") {
                this.outGridOptions = [];
              } else {
                this.gridOptions = [];
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      // 重置
      resetData() {
        this.queryData = {
          rsdtName: "", //姓名
          grid: "", //网络
          idNo: "", //身份证
          currentOrgId: '', //当前机构
          currentOrgName: '' //当前机构名称
        }
      },
      // 查询
      queryFun() {
        this.peopleData(this.queryData);
      },
      handleConcatArr(selectArr, nowSelectData) {
        let arr = [];
        arr = arr.concat(selectArr, nowSelectData);
        return arr;
      },
      handleRemoveTabList(isNeedArr, originalArr) {
        if (isNeedArr.length && originalArr.length) {
          for (let i = 0; i < isNeedArr.length; i++) {
            for (let k = 0; k < originalArr.length; k++) {
              if (isNeedArr[i]["id"] === originalArr[k]["id"]) {
                originalArr.splice(k, 1);
              }
            }
          }
        }
      },
      /****/

      init() {
        this.HomeDocVO = {

          members: [

          ],

          // 家庭档案编号
          homeCode: '',

          //户主
          houseHolder: '',

          // 网格
          grid: '',

          homeNum: '',

          postalCode: '',

          status: '',

          address: '',

          createdBy: '',

          createdByName: '',

          createdAt: '',

          updatedBy: '',

          updatedByName: '',

          updatedAt: '',

          deletedStatus: '',

          fixedTelephone: '',

          mobilePhone: '',

          familyType: '',

          familyPopulation: '',

          currentPopulation: '',
          // 户号
          familyNum: '',

          homeLocationMedicalStation: '',

          homeLocationHighway: '',

          homeLocationShop: '',

          homeLocationPoliceStation: '',

          area: '',

          homeType: '',

          lighting: '',
          // 家庭收入
          householdIncome: '',
          // 家庭设施
          familyFacilities: '',

          familyFunctionAssessment: '',

          docDoctor: '',

          docTime: '',

          docHos: '',

          docCurrentHos: '',

          docUpdateRecord: '',

          responsibleDoctor: '',

          registrationDate: ''

        };
        setTimeout(() => {
          this.initInput();
          this.addEnterListener();
        }, 10);
      },
      initInput() {
        let val = document.getElementsByClassName("el-input--medium");
        for (var i = 0; i < val.length; i++) {
          // 给每个input添加id
          val[i].children[0].setAttribute("id", "elinput" + (i + 1));
          // 添加唯一index
          val[i].children[0].intpuIndex = i + 1;
        }
        // 获取最大input数   设置最大长度保证回车不会溢出
        this.maxLength = val.length;
        let temp = document.getElementById("elinput1");
        temp.focus();
        // const obj = {};
        // for (const prop in temp) {
        //   obj[prop] = temp[prop];
        // }
        // console.log(obj);
      },
      // 监听回车事件具体方法
      listenEnterEvent(e) {

        let tempIndex = e.target.intpuIndex;
        if (e.keyCode === 13) {

          if (e.shiftKey && e.keyCode == 13) {
            if (tempIndex == 1) {
              return;
            }
            tempIndex--;
          } else {
            if (this.maxLength == tempIndex) {
              return;
            }
            tempIndex++;
          }
          let temp = document.getElementById("elinput" + tempIndex);
          // 设置焦点
          temp.focus();
          // const obj = {};
          // for (const prop in temp) {
          //   obj[prop] = temp[prop];
          // }
          // console.log("huiche", obj);
        }
      },
      // 开启键盘监听事件
      addEnterListener() {
        if (window.__completeEnterBind__) {
          return;
        }
        window.addEventListener("keydown", this.listenEnterEvent);
        window.__completeEnterBind__ = true;
      },
      // 移除键盘监听事件
      removeEnterListener() {
        console.log("移除键盘监听事件");
        window.removeEventListener("keydown", this.listenEnterEvent);
        window.__completeEnterBind__ = false;
      },
      // dateConversion 日期转换
      DateConversion() {
        if (this.TableForm.checkup_date.length == 8) {
          this.TableForm.checkup_date = dateConversion(
            this.TableForm.checkup_date
          );
        }
      },
      // 复选框 input 联动
      childVal(val, key) {
        this.TableForm[key] = "";
        let temp = [];
        val.forEach(el => {
          if (el.value != "") {
            temp.push(el.value);
          }
        });
        temp = temp.join(",");
        this.TableForm[key] = temp;
      },
      otherVal(val, key) {
        console.log("key", key);
        this.TableForm[key] = val;
        console.log(`this.TableForm.${key}`, this.TableForm[key]);
      },
      // 返显方法
      EchoMethod() {
        console.log(
          "tableConfiguration**************",
          this.$store.state.table.tableConfiguration
        );
        if (this.status == "edit" || this.status == "view") {
          let tableConfiguration = this.$store.state.table.tableConfiguration;
          for (let obj in this.TableForm) {
            this.TableForm[obj] = tableConfiguration.editData[obj];
          }
          let editChObject = JSON.parse(tableConfiguration.editChObject);
          console.log("tableConfiguration.editChObject", editChObject);
          for (let obj in this.chObject) {
            this.chObject[obj] = editChObject[obj];
          }
          console.log("this.TableForm", this.TableForm);
          console.log("this.chObject", this.chObject);
        }
      },
      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleDeepData(val){
        this.EchoMethod();
      }
    },
    watch: {
      data: {
        handler: "handleDeepData",
        deep: true
      }
    }
  };
</script>
<style lang="scss" scoped>
  .addFM {
    .opSetting {
      text-align: center;
      margin-top: 180px;
    }
    .spacing {
      margin-top: 10px;
    }
    /******/
    .lh180 {
      height: 180px;
      line-height: 180px;
    }
    .lh150 {
      height: 150px;
      line-height: 150px;
    }
    .familyStyle {
      height: 50px;
      width: 100%;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      background: #EBEEF5;
      font-size: 16px;
      border-radius:10px;
    }
    .paddingBorder {
        padding: 8px;
        box-sizing: border-box;
        border: none !important;
    }
    .borderNone {
        border: none !important;
    }
    .familyStyleinput .el-input__inner{
      height: 40px !important;
    }
    .familyStyleinput {
      height: 40px !important;
    }
    .familyStyle .el-input--medium .el-input__inner {
      height: 40px !important;
    }

    .queryBox {
        border-left:1px solid #e4e4e4;
        border-right:1px solid #e4e4e4;
        box-sizing: border-box;
        padding: 8px;
    }
    .gridStyle .el-cascader--medium{
        line-height: 30px;
    }
  }
</style>
