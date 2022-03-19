<template>
  <div class="temp-container height100">
    <div class="firstTile clearfix">
      <div class="date-cont float-left">
        <LFormtTitle label="日期">
          <el-date-picker
            v-model="date"
            type="date"
            prefix-icon="null"
            value-format="yyyyMMdd"
            placeholder="选择录入日期"
            :picker-options="pickerOptions"
            @change="dateChange"
          ></el-date-picker>
        </LFormtTitle>
      </div>
      <div class=" float-left">
        <el-button class="now-button" @click="nowDate">此刻</el-button>
      </div>
      <div class=" float-right">
        <el-button class="dayin-button">打印</el-button>
      </div>
    </div>
    <div class="left overflow-scroll-vertical">
      <div class="input-wrapper" v-loading="signLoading">
        <div class="projectTitle">体征项目</div>
        <el-radio-group v-model="recordTime" class="item" @change="recordTimeChange">
          <el-radio label="02">2</el-radio>
          <el-radio label="06">6</el-radio>
          <el-radio label="10">10</el-radio>
          <el-radio label="14">14</el-radio>
          <el-radio label="18">18</el-radio>
          <el-radio label="22">22</el-radio>
        </el-radio-group>
        <div v-for="(item,index) in this.collapseData[0].data"
             :key="index" class="clearfix">
          <div class="float-left" style="width:80%;margin-right:8px">
            <l-formt-title
              :label="item.itemName"
              class="item">
              <!--文本框-->
              <template v-if="item.controlType == '0'">
                <el-input v-model="signForm[item.itemCode].itemValue" class="width100 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
                </el-input>
              </template>
              <!--双文本框-->
              <template v-else-if="item.controlType == '1'">
                <el-input v-model="signForm[item.itemCode].itemValue1" class="width50 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
                </el-input>
                <el-input v-model="signForm[item.itemCode].itemValue2" class="width50 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
                </el-input>
              </template>
              <!--下拉选择框-->
              <template v-else-if="item.controlType == '2'">
                <l-value-domain
                  clearable
                  :remoteUrl="'/vitalItemOption/getItemOptionByItemCode/' + item.itemCode"
                  type="select"
                  :value.sync="signForm[item.itemCode].itemValue"
                  remoteShowKey="optionName"
                  remoteValueKey="optionCode"
                  placeholder
                  class="width100"
                ></l-value-domain>
              </template>
              <!--下拉文本框-->
              <template v-else-if="item.controlType == '4'">
                <l-value-domain
                  clearable
                  :remoteUrl="'/vitalItemOption/getItemOptionByItemCode/' + item.itemCode"
                  type="select"
                  :value.sync="signForm[item.itemCode].itemOptionCode"
                  remoteShowKey="optionName"
                  remoteValueKey="optionCode"
                  placeholder
                  class="width50"
                ></l-value-domain>
                <el-input v-model="signForm[item.itemCode].itemValue" class="width50 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
                </el-input>
              </template>
              <!--下拉录入框-->
              <template v-else-if="item.controlType == '3'">
                <el-input v-model="signForm[item.itemCode].itemOptionCode" class="width100 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
                </el-input>
              </template>
            </l-formt-title>
          </div>
          <div class="float-right" style="width:calc(20% - 8px);line-height: 46px" v-if="item.dataType==1">
            <el-checkbox v-model="signForm[item.itemCode].dataType">补录</el-checkbox>
          </div>
          <!--<el-checkbox-group v-model="signForm[item.itemCode].dataType">
            <el-checkbox label="2">复测</el-checkbox>
            <el-checkbox label="3">物理降温</el-checkbox>
            <el-checkbox label="4">药物降温</el-checkbox>
          </el-checkbox-group>-->
        </div>

        <div class="item l-clearfix">
          <el-button class="float-right" @click="saveSignRecords">保存</el-button>
          <el-button class="float-right margin-right-6" @click="deleteSignRecords">删除
          </el-button>
        </div>
      </div>
      <div v-loading="itemLoading">
        <div class="input-wrapper">
          <div class="projectTitle">一般项目</div>
          <l-formt-title
            v-for="(item,index) in this.collapseData[1].data"
            :key="index"
            :label="item.itemName"
            class="item"
          >
            <!--文本框-->
            <template v-if="item.controlType == '0'">
              <el-input v-model="itemForm[item.itemCode].itemValue" class="width100 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
              </el-input>
            </template>
            <!--双文本框-->
            <template v-else-if="item.controlType == '1'">
              <el-input v-model="itemForm[item.itemCode].itemValue1" class="width50 inputSpecial"><span
                v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                slot="suffix"
                v-codeTransform
                code="VitalItemUnit"
                :val="item.itemUnit"
              ></span></el-input>
              <el-input v-model="itemForm[item.itemCode].itemValue2" class="width50 inputSpecial"><span
                v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                slot="suffix"
                v-codeTransform
                code="VitalItemUnit"
                :val="item.itemUnit"
              ></span></el-input>
            </template>
            <!--下拉选择框-->
            <template v-else-if="item.controlType == '2'">
              <l-value-domain
                clearable
                :remoteUrl="'/vitalItemOption/getItemOptionByItemCode/' + item.itemCode"
                type="select"
                :value.sync="itemForm[item.itemCode].itemValue"
                remoteShowKey="optionName"
                remoteValueKey="optionCode"
                placeholder
                class="width100"
              ></l-value-domain>
            </template>
            <!--下拉文本框-->
            <template v-else-if="item.controlType == '4'">
              <l-value-domain
                clearable
                :remoteUrl="'/vitalItemOption/getItemOptionByItemCode/' + item.itemCode"
                type="select"
                :value.sync="itemForm[item.itemCode].itemOptionCode"
                remoteShowKey="optionName"
                remoteValueKey="optionCode"
                placeholder
                class="width50"
              ></l-value-domain>
              <el-input v-model="itemForm[item.itemCode].itemValue" class="width50 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
              </el-input>
            </template>
            <!--下拉录入框-->
            <template v-else-if="item.controlType == '3'">
              <el-input v-model="itemForm[item.itemCode].itemValue" class="width100 inputSpecial">
                  <span
                    v-if="item.itemUnit!= '' && item.itemUnit!=undefined"
                    slot="suffix"
                    v-codeTransform
                    code="VitalItemUnit"
                    :val="item.itemUnit"
                  ></span>
              </el-input>
            </template>
          </l-formt-title>
        </div>
        <div class="input-wrapper">
          <div class="projectTitle">自定义项目</div>
          <div v-for="(v,k) in userDefineForm" :key="k" class="user-define clearfix">
            <div class="lDoubleInput float-left">
              <LDoubleInput class="item" widthRatio="40%">
                <template slot="left">
                  <el-select :filterable="true" v-model="v.itemCode" @change="lDoubleChange(v.itemCode,k)">
                    <el-option
                      v-for="(item,index) in collapseData[2].data"
                      :key="index"
                      :label="item.itemName"
                      :value="item.itemCode"
                    ></el-option>
                  </el-select>
                </template>
                <template slot="right">
                  <template v-if="v.controlType">
                    <!--文本框-->
                    <template v-if="v.controlType == '0'">
                      <el-input v-model="v.itemValue" class="width100 inputSpecial">
                          <span
                            v-if="v.itemUnit!= '' && v.itemUnit!=undefined"
                            slot="suffix"
                            v-codeTransform
                            code="VitalItemUnit"
                            :val="v.itemUnit"
                          ></span>
                      </el-input>
                    </template>
                    <!--双文本框-->
                    <template v-else-if="v.controlType == '1'">
                      <el-input v-model="v.itemValue" class="inputSpecial" style="width:49%"><span
                        v-if="v.itemUnit!= '' && v.itemUnit!=undefined"
                        slot="suffix"
                        v-codeTransform
                        code="VitalItemUnit"
                        :val="v.itemUnit"
                      ></span></el-input>
                      <el-input v-model="v.itemValue" class="inputSpecial" style="width:48%"><span
                        v-if="v.itemUnit!= '' && v.itemUnit!=undefined"
                        slot="suffix"
                        v-codeTransform
                        code="VitalItemUnit"
                        :val="v.itemUnit"
                      ></span></el-input>
                    </template>
                    <!--下拉选择框-->
                    <template v-else-if="v.controlType == '2'">
                      <l-value-domain
                        clearable
                        :remoteUrl="'/vitalItemOption/getItemOptionByItemCode/' + v.itemCode"
                        type="select"
                        :value.sync="v.itemValue"
                        remoteShowKey="optionName"
                        remoteValueKey="optionCode"
                        placeholder
                        class="width100"
                      ></l-value-domain>
                    </template>
                    <!--下拉文本框-->
                    <template v-else-if="v.controlType == '4'">
                      <l-value-domain
                        clearable
                        :remoteUrl="'/vitalItemOption/getItemOptionByItemCode/' + v.itemCode"
                        type="select"
                        :value.sync="v.itemOptionCode"
                        remoteShowKey="optionName"
                        remoteValueKey="optionCode"
                        placeholder
                        style="width:49%"
                      ></l-value-domain>
                      <el-input v-model="v.itemValue" class="inputSpecial" style="width:48%">
                          <span
                            v-if="v.itemUnit!= '' && v.itemUnit!=undefined"
                            slot="suffix"
                            v-codeTransform
                            code="VitalItemUnit"
                            :val="v.itemUnit"
                          ></span>
                      </el-input>
                    </template>
                    <!--下拉录入框-->
                    <template v-else-if="v.controlType == '3'">
                      <el-input v-model="v.itemValue" class="width100 inputSpecial">
                          <span
                            v-if="v.itemUnit!= '' && v.itemUnit!=undefined"
                            slot="suffix"
                            v-codeTransform
                            code="VitalItemUnit"
                            :val="v.itemUnit"
                          ></span>
                      </el-input>
                    </template>
                  </template>
                  <template v-else></template>
                </template>
              </LDoubleInput>
            </div>
            <div class="img float-right"><img src="@/assets/closeIcon.png" alt="" @click="deleteUserDefine(k)"/></div>
          </div>
          <div>
            <el-button @click="addUserDefine" class="width100">添加自定义项目</el-button>
          </div>
          <div class="item l-clearfix">
            <el-button class="float-right" @click="saveItemRecords">保存</el-button>
            <el-button class="float-right margin-right-6" @click="deleteItemRecords">删除
            </el-button>
          </div>
        </div>
      </div>
      <div class="input-wrapper" v-loading="stampLoading">
        <div class="projectTitle">图章</div>
        <div class="seal" style="display:flex;">
          <l-formt-title label="图章" style="width:120px;margin-right:10px;">
            <l-value-domain
              remoteUrl="/vitalStamps/getVitalStampList"
              remoteValueKey="stampName"
              placeholder
              :value.sync="stampValue"
              @change="stampChangeHandler"
            ></l-value-domain>
          </l-formt-title>
          <el-time-picker
            v-model="stampTime"
            format="HH:mm"
            value-format="HHmm"
            placeholder
            class="float-right"
            style="width:102px;margin-right:10px;"
          ></el-time-picker>
          <div style="width:68px;" class="l-clearfix">
            <el-button class="float-right" @click="saveStampsRecords">保存</el-button>
          </div>
        </div>

        <div class="width100 l-clearfix" style="height:200px;margin-top:10px;">
          <el-table
            :data="stampRecords"
            width="100%"
            height="100%"
            border
            highlight-current-row
          >
            <el-table-column
              v-for="(item, index) in stampTableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :fixed="item.fixed"
              header-align="left"
              :align="item.align || 'left'"
            ></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="deleteStampRecords(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="right" v-loading="iframeLoading">
      <iframe
        ref="tempElem"
        src="http://192.168.197.101:8082/table.html"
        style="border:0;"  title="内嵌页面"
        @load="updateTempData"
        class="width100 height100"
      ></iframe>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {getDeptName} from "@/api/admin/role";
  import {
    getVitalItemListByDeptCode,
    selectVitalSignRecords,
    selectVitalItemRecords,
    selectVitalStampsRecords,
    saveVitalSignRecords,
    saveVitalItemRecords,
    saveVitalStampsRecords,
    deleteVitalSignRecords,
    deleteVitalItemRecords,
    deleteVitalItemRecord,
    deleteVitalStampRecords,
    selectDataRecords
  } from "@/api/public/temperature";

  const KEY_MAP = {
    // 住院天数
    hosp: {canvas: "d1", db: ""},
    // 术后天数
    oper: {canvas: "d2", db: ""},
    // 脉搏
    pulse: {canvas: "d3", db: ""},
    // 体温
    temp: {canvas: "d4", db: ""},
    // 呼吸
    breath: {canvas: "d5", db: ""},
    // 大便次数
    shit: {canvas: "d6", db: "21689e0e-aa88-42ab-85be-03611ac6fc01"},
    // 尿量
    urine: {canvas: "d7", db: "f4a080bd-0e30-4018-b846-738010d8ca4e"},
    // 总入量
    icount: {canvas: "d8", db: "8381bdf2-84e9-43a2-bb71-de157ad8f702"},
    // 总出量
    ocount: {canvas: "d9", db: "cdd32e30-676a-4d00-9a7c-888a2342488b"},
    // 血压
    blood: {canvas: "d10", db: "0958c3df-fe1a-4088-bb3e-f51c3d7c39b8"},
    // 体重
    weight: {canvas: "d11", db: "bd812af3-65b3-4d66-8207-b2c34bdd66ec"},
    // 身高
    height: {canvas: "d12", db: "e9f0b71d-1c6d-4c41-b903-ec29d1ff71b2"},
    // 皮试
    skin: {canvas: "d13", db: "796e0a06-0025-4852-bf50-5ea0e209d2a1"}
  };
  let typeOptions = {
    //口表
    vO20022700001: 1,
    // 耳表
    vO20022700002: 2,
    // 腋表
    vO20022700003: 3,
    // 肛表
    vO20022700004: 4,
    // 脉搏
    vO20022700005: 1,
    // 起搏器
    vO20022700006: 2
  };
  let recordTimes = ["02", "06", "10", "14", "18", "22"];

  export default {
    data() {
      return {
        itemList: [],
        collapseData: [
          {
            title: "体征项目",
            data: []
          },
          {
            title: "特殊项目",
            data: []
          },
          {
            title: "自定义项目",
            data: []
          }
        ],
        date: this.getFormateDate(),
        recordTime: "02",
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        detpName: "",
        //loading
        iframeLoading: false,
        signLoading: false,
        itemLoading: false,
        stampLoading: false,
        //体征表单数据
        signFormInit: {},
        signForm: {},
        signRecord: [],
        //一般表单数据
        itemFormInit: {},
        itemForm: {},
        itemRecord: [],
        //自定义表单数据
        userDefineFormInit: {},
        userDefineForm: [],
        userDefineRecord: [],
        //图章
        stampTableParams: [
          {
            prop: "stampName",
            label: "图章名称",
            width: "80",
            align: "left",
            fixed: "left"
          },
          {
            prop: "stampTime",
            label: "图章时间",
            width: "120",
            align: "left",
            fixed: false
          }
        ],
        stampValue: "",
        stampTime: "",
        stampRecords: [],
        currentStampObj: {},
        //近一周日期列表
        dateList: [],
        //近一周记录
        recordData: [],
        datas: []
      };
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        async handler(pre, next) {
          if (pre == next) {
            return;
          }
          if (pre.inpCode) {
            this.handleDateList();
            this.getDeptName();
            this.date = this.getFormateDate();
            await this.getItemList();
            this.getRecordData();
            this.getSignRecords();
            this.getItemRecords();
            this.getStampRecords();
          }
        },
        deep: true,
        immediate: true
      }
    },
    async created() {
    },
    methods: {
      //获取当前日期
      nowDate() {
        this.date = this.getFormateDate();
        this.dateChange();
      },
      //获取当前科室名称
      async getDeptName() {
        let deptResp = await getDeptName(this.receivePatientData.admissionSdeptId);
        if (deptResp.code === 1 && deptResp.data.length > 0) {
          // console.log(deptResp);
          this.detpName = deptResp.data[0].org_nm;
        } else {
          this.detpName = "";
        }
      },
      //获取一周内患者记录
      async getRecordData() {
        this.recordData = [];
        if (!this.dateList.length) {
          return;
        }
        this.iframeLoading = true;
        try {
          let params = {
            inpCode: this.receivePatientData.inpCode,
            startDate: this.dateList[0],
            stopDate: this.dateList[6]
          };
          let res = await selectDataRecords(params);
          /*let res = {
            "code": 1,
            "data": [
              {
                "dataDate": "20200311",
                "inpCode": "INP200313001",
                "stampRecoed": [
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6a7570170e6a757440000",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "orgCode": "TJAXJT",
                    "orgId": "66",
                    "stampCode": "vS20011300001",
                    "stampName": "登记",
                    "stampTime": "1201"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5eceb000d",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "orgCode": "TJAXJT",
                    "orgId": "66",
                    "stampCode": "vS20011300001",
                    "stampName": "登记",
                    "stampTime": "1234"
                  }
                ],
                "itemRecord": [
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5d8680005",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI19112100007",
                    "itemName": "血压",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "78/126",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5d9e60006",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI19112100008",
                    "itemName": "身高",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "175",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5dad70007",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI19111700009",
                    "itemName": "体重",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "65",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5db990008",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI19111700010",
                    "itemName": "大便次数",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "1",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5dc9e0009",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI19111700014",
                    "itemName": "入量",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "500",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5de0c000a",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI19111700015",
                    "itemName": "尿量",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "200",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5dea5000b",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI19111700016",
                    "itemName": "过敏药物",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "无",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  },
                  {
                    "dataDate": "20200317",
                    "dataVersion": 0,
                    "deletedStatus": "0",
                    "hosCode": "KGYY",
                    "hosId": "91",
                    "id": "4028449770e6c5720170e6c5e0d3000c",
                    "inpCode": "INP200313001",
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "测试日志",
                    "itemCode": "VI20011400031",
                    "itemName": "基础代谢率",
                    "itemValue": "vO19110200002",
                    "orgCode": "TJAXJT",
                    "orgId": "66"
                  }
                ],
                "signRecord": {
                  "02": [
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "02",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e6c5720170e6c572ae0000",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100001",
                      "itemName": "体温",
                      "itemOptionCode": "vO20022700001",
                      "itemOptionName": "",
                      "itemValue": 36.8,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "02",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e6c5720170e6c573800001",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100002",
                      "itemName": "呼吸",
                      "itemOptionCode": "vO20022700007",
                      "itemOptionName": "",
                      "itemValue": 85.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "02",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e6c5720170e6c574fa0002",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100003",
                      "itemName": "脉搏",
                      "itemOptionCode": "vO20022700005",
                      "itemOptionName": "",
                      "itemValue": 96.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "02",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e6c5720170e6c575760003",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100004",
                      "itemName": "心率",
                      "itemOptionCode": "",
                      "itemOptionName": "",
                      "itemValue": 102.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "02",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e6c5720170e6c575a10004",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100005",
                      "itemName": "疼痛",
                      "itemOptionCode": "",
                      "itemOptionName": "",
                      "itemValue": 1.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    }
                  ],
                  "06": [
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "06",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e710630170e71063eb0000",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100001",
                      "itemName": "体温",
                      "itemOptionCode": "vO20022700001",
                      "itemOptionName": "",
                      "itemValue": 38.2,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "06",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e710630170e71064f40001",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100002",
                      "itemName": "呼吸",
                      "itemOptionCode": "vO20022700007",
                      "itemOptionName": "",
                      "itemValue": 96.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "06",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e710630170e71065870002",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100003",
                      "itemName": "脉搏",
                      "itemOptionCode": "vO20022700005",
                      "itemOptionName": "",
                      "itemValue": 101.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "06",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e710630170e71065df0003",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100004",
                      "itemName": "心率",
                      "itemOptionCode": "",
                      "itemOptionName": "",
                      "itemValue": 98.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    },
                    {
                      "dataDate": "20200317",
                      "dataSource": "",
                      "dataTime": "06",
                      "dataType": "0",
                      "dataVersion": 0,
                      "deletedStatus": "0",
                      "hosCode": "KGYY",
                      "hosId": "91",
                      "id": "4028449770e710630170e71066e90004",
                      "inpCode": "INP200313001",
                      "inpDeptCode": "N0001",
                      "inpDeptName": "呼吸内科",
                      "inpName": "测试日志",
                      "itemCode": "VI19112100005",
                      "itemName": "疼痛",
                      "itemOptionCode": "",
                      "itemOptionName": "",
                      "itemValue": 1.0,
                      "orgCode": "TJAXJT",
                      "orgId": "66"
                    }
                  ]
                }
              },
              {
                "dataDate": "20200312",
                "inpCode": "INP200313001"
              },
              {
                "dataDate": "20200313",
                "inpCode": "INP200313001"
              },
              {
                "dataDate": "20200314",
                "inpCode": "INP200313001"
              },
              {
                "dataDate": "20200315",
                "inpCode": "INP200313001"
              },
              {
                "dataDate": "20200316",
                "inpCode": "INP200313001"
              },
              {
                "dataDate": "20200317",
                "inpCode": "INP200313001"
              }
            ]
          };*/
          if (res.code == 1) {
            this.recordData = res.data;
            // console.log('一周内体温单数据', res.data);
            await this.updateTempData();
          } else {
            this.$message.error(res.msg || "获取患者一周内记录失败");
          }
          this.iframeLoading = false;
        } catch (error) {
          this.iframeLoading = false;
          this.$message.error(error.msg || "获取患者一周内记录失败");
        }
      },
      //根据获取项目
      async getItemList() {
        this.$showLoading();
        try {
          let params = {
            deptCd: this.receivePatientData.admissionSdeptId,
            patientAge: this.receivePatientData.patientAge
          };
          let res = await getVitalItemListByDeptCode(params);
          if (res.code == 1) {
            this.itemList = res.data;
            await this.pipToCollapseData();
          } else {
            this.$message.error(res.msg || "获取项目失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取项目失败");
        }
      },
      //项目元素数据处理
      pipToCollapseData() {
        let signList = [];
        let otherList = [];
        let customList = [];
        this.itemList.forEach(item => {
          // 根据项目类型分类push
          if (item.itemType == "0") {
            signList.push({...item});
          } else if (item.itemType == "1") {
            otherList.push({...item});
          } else {
            customList.push({...item});
          }
        });
        for (let i  in signList) {
          let itemCode = signList[i].itemCode;
          this.$set(this.signFormInit, itemCode, {
            controlType: signList[i].controlType,
            itemCode: signList[i].itemCode,
            itemName: signList[i].itemName,
            itemOptionCode: '',
            itemOptionName: '',
            itemValue: '',
            dataType: '',
            dataSource: ''
          });
          this.$set(this.signForm, itemCode, {
            controlType: signList[i].controlType,
            itemCode: signList[i].itemCode,
            itemName: signList[i].itemName,
            itemOptionCode: '',
            itemOptionName: '',
            itemValue: '',
            dataType: '',
            dataSource: ''
          });
        }
        for (let i  in otherList) {
          let itemCode = otherList[i].itemCode;
          this.$set(this.itemFormInit, itemCode, {
            controlType: otherList[i].controlType,
            itemCode: otherList[i].itemCode,
            itemName: otherList[i].itemName,
            itemOptionCode: '',
            itemOptionName: '',
            itemValue: '',
            dataType: ''
          });
          this.$set(this.itemForm, itemCode, {
            controlType: otherList[i].controlType,
            itemCode: otherList[i].itemCode,
            itemName: otherList[i].itemName,
            itemOptionCode: '',
            itemOptionName: '',
            itemValue: '',
            dataType: ''
          });
        }
        for (let i  in customList) {
          let itemCode = customList[i].itemCode;
          this.$set(this.userDefineFormInit, itemCode, {
            controlType: customList[i].controlType,
            itemCode: customList[i].itemCode,
            itemName: customList[i].itemName,
            itemOptionCode: '',
            itemOptionName: '',
            itemValue: '',
            dataType: ''
          });
          /*this.$set(this.userDefineForm, itemCode, {
            itemCode: customList[i].itemCode,
            itemName: customList[i].itemName,
            itemOptionCode: '',
            itemOptionName: '',
            itemValue: ''
          });*/
        }
        this.collapseData[0].data = signList;
        this.collapseData[1].data = otherList;
        this.collapseData[2].data = customList;
      },
      //改变日期
      dateChange() {
        this.getSignRecords();
        this.getItemRecords();
        this.getStampRecords();
      },
      //改变体征时间
      recordTimeChange() {
        this.getSignRecords();
      },
      //获取体征项目记录
      async getSignRecords() {
        this.signRecord = [];
        for (let i in this.signFormInit) {
          this.$set(this.signForm, i, {...this.signFormInit[i]});
        }
        this.signLoading = true;
        try {
          let params = {
            inpCode: this.receivePatientData.inpCode,
            recordDate: this.date,
            recordTime: this.recordTime
          };
          let res = await selectVitalSignRecords(params);
          if (res.code == 1) {
            this.signRecord = [...res.data];
            let resData = res.data;
            let colData = this.collapseData[0].data;
            for (let i  in resData) {
              for (let j in colData) {
                if (resData[i].itemCode == colData[j].itemCode) {
                  let itemCode = resData[i].itemCode;
                  if (colData[j].controlType == 1) {
                    this.$set(this.signForm, itemCode, {
                      ...resData[i],
                      dataType: resData[i].dataType == 1 ? true : false,
                      controlType: colData[j].controlType,
                      itemValue1: resData[i].itemValue.split('/')[0],
                      itemValue2: resData[i].itemValue.split('/')[1]
                    });
                  } else {
                    this.$set(this.signForm, itemCode, {
                      ...resData[i],
                      dataType: resData[i].dataType == 1 ? true : false,
                      controlType: colData[j].controlType
                    });
                  }
                }
              }
            }
          } else {
            this.$message.error(res.msg || "获取体征项目记录失败");
          }
          this.signLoading = false;
        } catch (error) {
          this.signLoading = false;
          this.$message.error(error.msg || "获取体征项目记录失败");
        }
      },
      //获取一般、自定义项目记录
      async getItemRecords() {
        this.itemRecord = [];
        this.userDefineRecord = [];
        for (let i in this.itemFormInit) {
          this.$set(this.itemForm, i, {...this.itemFormInit[i]});
        }
        this.userDefineForm = [];
        this.itemLoading = true;
        try {
          let params = {
            inpCode: this.receivePatientData.inpCode,
            recordDate: this.date
          };
          let res = await selectVitalItemRecords(params);
          if (res.code == 1) {
            let resData = res.data;
            let colData1 = this.collapseData[1].data;
            let colData2 = this.collapseData[2].data;
            for (let i in resData) {
              for (let j in colData1) {
                if (resData[i].itemCode == colData1[j].itemCode) {
                  if (colData1[j].controlType == 1) {
                    this.$set(this.itemForm, resData[i].itemCode, {
                      ...res.data[i],
                      dataType: resData[i].dataType == 1 ? true : false,
                      controlType: colData2[j].controlType,
                      itemUnit: colData2[j].itemUnit,
                      itemValue1: resData[i].itemValue.split('/')[0],
                      itemValue2: resData[i].itemValue.split('/')[1]
                    });
                  } else {
                    this.$set(this.itemForm, resData[i].itemCode, {
                      ...res.data[i],
                      dataType: resData[i].dataType == 1 ? true : false,
                      controlType: colData2[j].controlType,
                      itemUnit: colData2[j].itemUnit
                    });
                  }
                }
              }
              for (let j in colData2) {
                if (resData[i].itemCode == colData2[j].itemCode) {
                  this.$set(this.userDefineForm, this.userDefineForm.length, {
                    ...res.data[i],
                    controlType: colData2[j].controlType
                  });
                }
              }
            }
          } else {
            this.$message.error(res.msg || "获取一般、自定义项目记录失败");
          }
          this.itemLoading = false;
        } catch (error) {
          this.itemLoading = false;
          this.$message.error(error.msg || "获取一般、自定义项目记录失败");
        }
      },
      //获取图章项目记录
      async getStampRecords() {
        this.stampLoading = true;
        try {
          let params = {
            inpCode: this.receivePatientData.inpCode,
            recordDate: this.date
          };
          let res = await selectVitalStampsRecords(params);
          if (res.code == 1) {
            this.stampRecords = [...res.data];
          } else {
            this.$message.error(res.msg || "获取图章记录失败");
          }
          this.stampLoading = false;
        } catch (error) {
          this.stampLoading = false;
          this.$message.error(error.msg || "获取图章记录失败");
        }
      },
      //体征项目数据处理
      handleSignRecords() {
        let params = [];
        for (let i in this.signForm) {
          params.push({
            inpCode: this.receivePatientData.inpCode,
            inpName: this.receivePatientData.patientName,
            dataDate: this.date,
            dataTime: this.recordTime,
            itemCode: this.signForm[i].itemCode,
            itemName: this.signForm[i].itemName,
            itemOptionCode: this.signForm[i].itemOptionCode,
            itemOptionName: this.signForm[i].itemOptionName,
            itemValue: this.signForm[i].controlType == '1' ? this.signForm[i].itemValue1 + '/' + this.signForm[i].itemValue2 : this.signForm[i].itemValue,
            dataType: this.signForm[i].dataType ? '1' : '0',
            dataSource: this.signForm[i].dataSource,
            id: this.signForm[i].id || '',
            dataVersion: this.signForm[i].dataVersion,
            deletedStatus: this.signForm[i].deletedStatus,
            hosCode: this.signForm[i].hosCode || '',
            hosId: this.signForm[i].hosId || '',
            orgCode: this.signForm[i].orgCode || '',
            orgId: this.signForm[i].orgId || ''
          });
        }
        return params;
      },
      //保存体征项目记录
      async saveSignRecords() {
        this.signLoading = true;
        try {
          let params = this.handleSignRecords();
          let res = await saveVitalSignRecords(params);
          if (res.code == 1) {
            this.$message.info("保存体征项目记录成功");
            await this.getSignRecords();
            if (this.dateList.indexOf(this.date) > -1) {
              await this.getRecordData();
            }
          } else {
            this.$message.error(res.msg || "保存体征项目记录失败");
          }
          this.signLoading = false;
        } catch (error) {
          this.signLoading = false;
          this.$message.error(error.msg || "保存体征项目记录失败");
        }
      },
      //一般、自定义项目数据处理
      handleItemRecords() {
        let params = [];
        for (let i in this.itemForm) {
          params.push({
            inpCode: this.receivePatientData.inpCode,
            inpName: this.receivePatientData.patientName,
            dataDate: this.date,
            itemCode: this.itemForm[i].itemCode,
            itemName: this.itemForm[i].itemName,
            itemOptionCode: this.itemForm[i].itemOptionCode,
            itemOptionName: this.itemForm[i].itemOptionName,
            itemValue: this.itemForm[i].controlType == '1' ? this.itemForm[i].itemValue1 + '/' + this.itemForm[i].itemValue2 : this.itemForm[i].itemValue,
            dataType: this.itemForm[i].dataType ? '1' : '0',
            dataSource: this.itemForm[i].dataSource,
            id: this.itemForm[i].id || '',
            dataVersion: this.itemForm[i].dataVersion,
            deletedStatus: this.itemForm[i].deletedStatus,
            hosCode: this.itemForm[i].hosCode || '',
            hosId: this.itemForm[i].hosId || '',
            orgCode: this.itemForm[i].orgCode || '',
            orgId: this.itemForm[i].orgId || '',
            controlType: this.itemForm[i].controlType
          });
        }
        for (let i in this.userDefineForm) {
          params.push({
            inpCode: this.receivePatientData.inpCode,
            inpName: this.receivePatientData.patientName,
            dataDate: this.date,
            itemCode: this.userDefineForm[i].itemCode,
            itemName: this.userDefineForm[i].itemName,
            itemOptionCode: this.userDefineForm[i].itemOptionCode,
            itemOptionName: this.userDefineForm[i].itemOptionName,
            itemValue: this.userDefineForm[i].itemValue,
            id: this.userDefineForm[i].id || '',
            dataVersion: this.userDefineForm[i].dataVersion,
            deletedStatus: this.userDefineForm[i].deletedStatus,
            hosCode: this.userDefineForm[i].hosCode || '',
            hosId: this.userDefineForm[i].hosId || '',
            orgCode: this.userDefineForm[i].orgCode || '',
            orgId: this.userDefineForm[i].orgId || ''
          });
        }
        return params;
      },
      //保存一般/自定义项目记录
      async saveItemRecords() {
        this.itemLoading = true;
        try {
          let params = await this.handleItemRecords();
          let res = await saveVitalItemRecords(params);
          if (res.code == 1) {
            this.$message.info("保存一般、自定义项目记录成功");
            await this.getItemRecords();
            if (this.dateList.indexOf(this.date) > -1) {
              await this.getRecordData();
            }
          } else {
            this.$message.error(res.msg || "保存一般、自定义项目记录失败");
          }
          this.itemLoading = false;
        } catch (error) {
          this.itemLoading = false;
          this.$message.error(error.msg || "保存一般、自定义项目记录失败");
        }
      },
      //保存图章记录
      async saveStampsRecords() {
        this.stampLoading = true;
        try {
          let params = [{
            inpCode: this.receivePatientData.inpCode,
            inpName: this.receivePatientData.patientName,
            dataDate: this.date,
            stampTime: this.stampTime,
            stampCode: this.currentStampObj.stampCode,
            stampName: this.currentStampObj.stampName,
            stampSunjection: this.currentStampObj.stampSunjection,
            stampPositon: this.currentStampObj.stampPositon,
            stampColor: this.currentStampObj.stampColor,
            stampSort: this.currentStampObj.stampSort,
            timeStyle: this.currentStampObj.timeStyle
          }];
          let res = await saveVitalStampsRecords(params);
          if (res.code == 1) {
            this.$message.info("保存图章记录成功");
            await this.getStampRecords();
            if (this.dateList.indexOf(this.date) > -1) {
              await this.getRecordData();
            }
          } else {
            this.$message.error(res.msg || "保存图章记录失败");
          }
          this.stampLoading = false;
        } catch (error) {
          this.stampLoading = false;
          this.$message.error(error.msg || "保存图章记录失败");
        }
      },
      //删除体征项目（批量）
      deleteSignRecords() {
        let params = [];
        for (let i in this.signForm) {
          if (this.signForm[i].id) {
            params.push(this.signForm[i].id);
          }
        }
        if (params.length) {
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.signLoading = true;
            try {
              let res = await deleteVitalSignRecords(params);
              if (res.code == 1) {
                this.$message.info('删除成功');
                await this.getSignRecords();
                if (this.dateList.indexOf(this.date) > -1) {
                  await this.getRecordData();
                }
              } else {
                this.$message.error(res.msg || '删除失败');
              }
              this.signLoading = false;
            } catch (error) {
              this.signLoading = false;
              this.$message.error(error.msg || "删除失败");
            }
          });
        } else {
          this.$message.info('记录为空，不需要删除');
          this.getSignRecords();
        }
      },
      //删除一般、自定义项目（批量）
      deleteItemRecords() {
        let params = [];
        for (let i in this.itemForm) {
          if (this.itemForm[i].id) {
            params.push(this.itemForm[i].id);
          }
        }
        for (let i in this.userDefineForm) {
          if (this.userDefineForm[i].id) {
            params.push(this.userDefineForm[i].id);
          }
        }
        if (params.length) {
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.itemLoading = true;
            try {
              let res = await deleteVitalItemRecords(params);
              if (res.code == 1) {
                this.$message.info('删除成功');
                await this.getItemRecords();
                if (this.dateList.indexOf(this.date) > -1) {
                  await this.getRecordData();
                }
              } else {
                this.$message.error(res.msg || '删除失败');
              }
              this.itemLoading = false;
            } catch (error) {
              this.itemLoading = false;
              this.$message.error(error.msg || "删除失败");
            }
          });
        } else {
          this.$message.info('记录为空，不需要删除');
          this.getItemRecords();
        }
      },
      //删除图章记录（单个）
      deleteStampRecords(row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.stampLoading = true;
          try {
            let params = {
              id: row.id
            };
            let res = await deleteVitalStampRecords(params);
            if (res.code == 1) {
              this.$message.info('删除成功');
              await this.getStampRecords();
              if (this.dateList.indexOf(this.date) > -1) {
                await this.getRecordData();
              }
            } else {
              this.$message.error(res.msg || '删除失败');
            }
            this.stampLoading = false;
          } catch (error) {
            this.stampLoading = false;
            this.$message.error(error.msg || "删除失败");
          }
        });
      },
      //添加自定义记录
      addUserDefine() {
        this.$set(this.userDefineForm, this.userDefineForm.length, {
          itemCode: '',
          controlType: ''
        });
      },
      //删除自定义记录（单个）
      deleteUserDefine(k) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          if (this.userDefineForm[k].id) {
            this.itemLoading = true;
            let params = {
              id: this.userDefineForm[k].id
            };
            try {
              let res = await deleteVitalItemRecord(params);
              if (res.code == 1) {
                this.$message.info('删除成功');
                await this.getItemRecords();
                if (this.dateList.indexOf(this.date) > -1) {
                  await this.getRecordData();
                }
              } else {
                this.$message.error(res.msg || '删除失败');
              }
              this.itemLoading = false;
            } catch (error) {
              this.itemLoading = false;
              this.$message.error(error.msg || "删除失败");
            }
          } else {
            this.$delete(this.userDefineForm, k);
          }
        });
      },
      //自定义项目change
      async lDoubleChange(itemCode, k) {
        let obj = this.collapseData[2].data.filter((v) => {
          if (v.itemCode === itemCode) {
            return v;
          }
        });
        await this.$set(this.userDefineForm, k, {
          ...this.userDefineForm[k],
          controlType: obj[0].controlType,
          itemCode: obj[0].itemCode,
          itemName: obj[0].itemName,
          itemOptionCode: obj[0].itemOptionCode,
          itemOptionName: obj[0].itemOptionName,
          itemValue: obj[0].itemValue
        });
      },
      //图章change
      stampChangeHandler(value, item) {
        this.currentStampObj = {...item};
      },
      /*与体温单项目交互*/
      toRemote(item) {
        let ret = {};
        for (const key in item) {
          let km = KEY_MAP[key] ? KEY_MAP[key].canvas : key;
          ret[km] = item[key];
        }
        return ret;
      },
      getTempData() {
        let list = [];
        for (let i in this.recordData) {
          const data = this.recordData[i];
          let recordDate = new Date(data.dataDate.slice(0, 4) + "-" + data.dataDate.slice(4, 6) + "-" + data.dataDate.slice(6)).getTime();
          let signRemoteData = {
            pulse: [],
            temp: [],
            breath: []
          };
          /*体征项目*/
          if (data.signRecord !== undefined) {
            for (let j in recordTimes) {
              const rk = recordTimes[j];
              if (data.signRecord[rk] !== undefined) {
                let item = data.signRecord[rk];
                for (let k in item) {
                  if (item[k].itemCode === 'VI19112100003') {
                    //脉搏
                    signRemoteData.pulse[j] = {
                      val: item[k].itemValue || '',
                      type: item[k].itemOptionCode ? typeOptions[item[k].itemOptionCode] : 1
                      // type: 1
                    };
                  } else if (item[k].itemCode === 'VI19112100001') {
                    //体温
                    signRemoteData.temp[j] = {
                      val: item[k].itemValue || '',
                      type: item[k].itemOptionCode ? typeOptions[item[k].itemOptionCode] : 1
                      // type: 1
                    };
                  } else if (item[k].itemCode === 'VI19112100002') {
                    //呼吸
                    signRemoteData.breath[j] = item[k].itemValue || '';
                  }
                }
              }
            }
          }
          /*一般、自定义项目*/
          let otherRemoteData = {};
          if (data.itemRecord !== undefined) {
            for (let j in data.itemRecord) {
              const oitem = data.itemRecord[j];
              if (oitem.itemCode === 'VI19112100007') {
                //血压
                otherRemoteData['blood'] = {
                  high: oitem.itemValue ? "/" + oitem.itemValue.split('/')[0] : "/",
                  low: oitem.itemValue ? "/" + oitem.itemValue.split('/')[1] : "/"
                };
              } else if (oitem.itemCode === 'VI19112100008') {
                //身高
                otherRemoteData['height'] = oitem.itemValue;
              } else if (oitem.itemCode === 'VI19111700009') {
                //体重
                otherRemoteData['weight'] = oitem.itemValue;
              } else if (oitem.itemCode === 'VI19111700010') {
                //大便次数
                otherRemoteData['shit'] = oitem.itemValue;
              } else if (oitem.itemCode === 'VI19111700014') {
                //入量
                otherRemoteData['icount'] = oitem.itemValue;
              } else if (oitem.itemCode === 'VI19111700015') {
                //尿量
                otherRemoteData['urine'] = oitem.itemValue;
              }
              /*else if (oitem.itemCode === '') {
                //出量（暂无）
                otherRemoteData['ocount'] = oitem.itemValue;
              }else if (oitem.itemCode === '') {
                //皮试（暂无）
                otherRemoteData['skin'] = oitem.itemValue;
              }*/
            }
          }
          /*图章*/
          let stampRecords = [];
          for (let j in data.stampRecoed) {
            let item = data.stampRecoed[j];
            stampRecords.push({
              ...item,
              recordDate: item.dataDate
            });
          }
          let item = {
            st: recordDate,
            ...signRemoteData,
            ...otherRemoteData,
            stamp: stampRecords
          };
          list.push(this.toRemote(item));
        }
        let obj = {
          hosName: "云医院",
          title: "体温单",
          patName: this.receivePatientData.patientName || "",
          inTime: "",
          inpNo: this.receivePatientData.inpCode || "",
          secName: this.detpName,
          datas: list
        };
        console.log('绘制体温单数据', obj);
        return obj;
      },
      updateTempData() {
        let data = this.getTempData();
        if (this.$refs["tempElem"]) {
          this.$refs["tempElem"].contentWindow.postMessage(data, "*");
        }
      },
      /*与体温单项目交互*/
      //获取当前日期
      getFormateDate() {
        let today = new Date();
        let m = today.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = today.getDate();
        d = d < 10 ? "0" + d : d;
        return today.getFullYear() + m + d;
      },
      // 时分秒
      getCurTime() {
        let today = new Date();
        let h = today.getHours();
        h = h < 10 ? "0" + h : h;
        let m = today.getMinutes();
        m = m < 10 ? "0" + m : m;
        let s = today.getSeconds();
        s = s < 10 ? "0" + s : s;
        return h + "" + m + "" + s;
      },
      //计算最近七天日期
      handleDateList() {
        const that = this;
        let numList = [-6, -5, -4, -3, -2, -1, 0];
        let dateList = [];
        numList.forEach(item => {
          let day = that.getDay(item);
          dateList.push(day);
        });
        this.dateList = dateList;
      },
      getDay(day) {
        let today = new Date();
        let targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetdayMilliseconds);
        let tYear = today.getFullYear();
        let tMonth = today.getMonth();
        let tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear + tMonth + tDate;
      },
      doHandleMonth(month) {
        var m = month;
        if (month.toString().length == 1) {
          m = "0" + month;
        }
        return m;
      }
    }
  }
</script>
<style lang="scss">
  .temp-container {
    background: #fff;

    .input-wrapper {
      .inputSpecial {
        .el-input__suffix-inner {
          margin-top: 10px;
          display: inline-block;
        }
      }
    }

    .firstTile {
      /*display: flex;*/
      /*align-item: center;*/
      margin-bottom: 10px;

      .date-cont {
        width: 156px;
        margin-right: 5px;
      }

      .now-button {
        width: 80px;
        display: flex;
        justify-content: center;
      }

      .dayin-button {
        width: 80px;
        height: 36px;
        border-radius: 2px;
        /*border: 1px solid rgba(255, 83, 0, 1);*/
        /*color: rgba(255, 83, 0, 1);*/
        position: absolute;
        right: 0;
      }
    }

    .top {
      width: 100%;
      height: 66px;
      line-height: 66px;
    }

    .left {
      float: left;
      width: 340px;
      height: calc(100% - 66px);
      padding: 20px;
      background: $l-color-bgcolor-18;

      /deep/ .temp-pos {
        width: 100px !important;
      }

      /deep/ .temp-input {
        width: 82px !important;
      }

      /deep/ .el-radio {
        margin-right: 10px;
      }

      .item {
        margin: 5px 0;
      }

      .input-wrapper {
        border-bottom: 1px solid $l-color-bgcolor-11;
        margin-bottom: 25px;
        padding-bottom: 25px;

        .user-define {
          /*position: relative;*/
          .lDoubleInput {
            width: 90%;
          }

          .img {
            width: 10%;
            height: 48px;
            text-align: right;
            line-height: 57px;
            /*position: absolute;
            top: 7px;
            right: -32px;
            margin-left: 5px;*/
            cursor: pointer;
          }
        }
      }
    }

    .right {
      margin-left: 360px;
      height: calc(100% - 66px);
      border: 1px solid $l-color-border-4;
    }
  }


  // .el-input--medium .el-input__inner {
  //   height: 28px !important;
  // }
  .seal .el-input__inner {
    padding-right: 0px !important;
  }

  .firstTile .el-input__inner {
    padding-right: 0px !important;
  }

  .firstTile .el-input__icon {
    position: relative;
    left: 10px;
  }

  .firstTile .el-icon-circle-close {
    position: relative;
    left: 35px;
  }

  .paginaTion .el-input__inner {
    height: 28px !important;
  }

  .projectTitle {
    font-size: 14px;

    font-weight: bold;
    color: rgba(148, 157, 163, 1);
    line-height: 20px;
    margin-bottom: 10px;
  }

  .width50 {
    width: 50% !important;
  }
</style>
