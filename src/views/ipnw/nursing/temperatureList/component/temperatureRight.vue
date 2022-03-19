<template>
  <div class="temperatureRight height100">
    <div class="nav-bar">
      <el-row :gutter="10">
        <el-col :span="3">
          <l-formt-title label="日期" require>
            <el-date-picker
              v-model="searchData.dataDate"
              type="date"
              prefix-icon="null"
              value-format="yyyyMMdd"
              format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </l-formt-title>
        </el-col>
        <el-col :span="3">
          <l-formt-title label="时间" require>
            <el-time-select
              v-model="searchData.dataTime"
              :picker-options="pickerOptionsTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="选择时间"
            >
            </el-time-select>
          </l-formt-title>
        </el-col>
        <el-col :span="3">
          <l-formt-title label="入院天数">
            <el-input v-model="searchData.inpDay" class="width100"></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="3">
          <l-formt-title label="术后天数">
            <el-input
              v-model="searchData.operaDays"
              class="width100"
            ></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="3">
          <l-formt-title label="护理等级">
            <el-select
              v-model="searchData.nursingLevel"
              class="width100"
              placeholder="请选择"
            >
              <el-option label="Ⅰ级" value="1"></el-option>
              <el-option label="Ⅱ级" value="2"></el-option>
              <el-option label="Ⅲ级" value="3"></el-option>
              <el-option label="特级" value="4"></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="5">
          <l-formt-title label="高热病人">
            <el-input
              v-model="searchData.rangeHour"
              class="inputSpecial"
              style="width: 35%;"
              ><span slot="suffix">小时内</span></el-input
            >
            <el-input v-model="searchData.minC" style="width: 26%;"></el-input>
            <span style="width: 5%;">-</span>
            <el-input
              v-model="searchData.maxC"
              class="inputSpecial"
              style="width: 29%;"
              ><span slot="suffix">℃</span>
            </el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="4" class="clearfix">
          <el-button type="text" @click="searchVitalRecords">查询</el-button>
          <el-button type="text" @click="reset">重置</el-button>
          <el-button type="text" class="float-right">打印</el-button>
          <el-button
            type="text"
            class="float-right"
            style="margin-right: 5px;"
            @click="deleteRecords"
            >删除</el-button
          >
          <el-button
            type="text"
            class="float-right"
            style="margin-right: 5px;"
            @click="saveRecords"
            >保存</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div class="table-conts">
      <el-table
        ref="multiTable"
        :data="tableDatas"
        border
        stripe
        width="100%"
        height="100%"
        highlight-current-row
        @row-click="multiRowClick"
        @selection-change="multiSelectChange"
      >
        <el-table-column type="selection" fixed="left" width="55">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="left"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="multiEdit(scope.row, scope.$index)"
              >{{ scope.row.isEdit ? "完成" : "编辑" }}</el-button
            >
            <el-button type="text" @click="multiReset(scope.row, scope.$index)"
              >清空</el-button
            >
          </template>
        </el-table-column>
        <template v-for="(item, index) in tableDatasParams">
          <template v-if="item.children && item.children.length">
            <el-table-column
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :fixed="item.fixed"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
            >
              <el-table-column
                v-for="(v, k) in item.children"
                :key="k"
                :prop="v.prop"
                :label="v.label"
                :min-width="v.width"
                :fixed="v.fixed"
                :align="v.align || 'left'"
                :header-align="v.headerAlign || 'left'"
              >
                <template slot-scope="scope">
                  <template v-if="scope.row.isEdit">
                    <template v-if="v.prop.indexOf('type') > -1">
                      <l-value-domain
                        clearable
                        :remoteUrl="
                          '/vitalItemOption/getItemOptionByItemCode/' +
                          item.prop
                        "
                        type="select"
                        :value.sync="scope.row[v.prop].itemOptionCode"
                        remoteShowKey="optionName"
                        remoteValueKey="optionCode"
                        placeholder
                        class="width100"
                      ></l-value-domain>
                    </template>
                    <template v-else-if="v.prop.indexOf('value') > -1">
                      <el-input
                        v-model="scope.row[v.prop].itemValue"
                        class="width100 inputSpecial"
                      >
                        <span
                          v-if="
                            item.itemUnit != '' && item.itemUnit != undefined
                          "
                          slot="suffix"
                          v-codeTransform
                          code="VitalItemUnit"
                          :val="item.itemUnit"
                        ></span>
                      </el-input>
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="v.prop.indexOf('type') > -1">{{
                      scope.row[v.prop].itemOptionCode
                    }}</template>
                    <template v-if="v.prop.indexOf('value') > -1">{{
                      scope.row[v.prop].itemValue
                    }}</template>
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :fixed="item.fixed"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
            >
              <template slot-scope="scope">
                <!--不可编辑-->
                <template v-if="item.editDisabled">
                  <template v-if="item.prop == 'dataTime'"
                    >{{ scope.row[item.prop] }}:00</template
                  >
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
                <!--编辑项目-->
                <template v-else>
                  <template v-if="scope.row.isEdit">
                    <!--文本框-->
                    <template v-if="item.controlType == '0'">
                      <el-input
                        v-model="scope.row[item.prop].itemValue"
                        class="width100 inputSpecial"
                      >
                        <span
                          v-if="
                            item.itemUnit != '' && item.itemUnit != undefined
                          "
                          slot="suffix"
                          v-codeTransform
                          code="VitalItemUnit"
                          :val="item.itemUnit"
                        ></span>
                      </el-input>
                    </template>
                    <!--双文本框-->
                    <template v-else-if="item.controlType == '1'">
                      <el-input
                        v-model="scope.row[item.prop].itemValue1"
                        class="width50 inputSpecial"
                      >
                        <span
                          v-if="
                            item.itemUnit != '' && item.itemUnit != undefined
                          "
                          slot="suffix"
                          v-codeTransform
                          code="VitalItemUnit"
                          :val="item.itemUnit"
                        ></span>
                      </el-input>
                      <el-input
                        v-model="scope.row[item.prop].itemValue2"
                        class="width50 inputSpecial"
                      >
                        <span
                          v-if="
                            item.itemUnit != '' && item.itemUnit != undefined
                          "
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
                        :remoteUrl="
                          '/vitalItemOption/getItemOptionByItemCode/' +
                          item.prop
                        "
                        type="select"
                        :value.sync="scope.row[item.prop].itemValue"
                        remoteShowKey="optionName"
                        remoteValueKey="optionCode"
                        placeholder
                        class="width100"
                      ></l-value-domain>
                    </template>
                    <!--下拉录入框-->
                    <template v-else-if="item.controlType == '3'">
                      <el-input
                        v-model="scope.row[item.prop].itemValue"
                        class="width100 inputSpecial"
                      >
                        <span
                          v-if="
                            item.itemUnit != '' && item.itemUnit != undefined
                          "
                          slot="suffix"
                          v-codeTransform
                          code="VitalItemUnit"
                          :val="item.itemUnit"
                        ></span>
                      </el-input>
                    </template>
                  </template>
                  <template v-else>{{
                    scope.row[item.prop].itemValue
                  }}</template>
                </template>
              </template>
            </el-table-column>
          </template>
        </template>
      </el-table>
    </div>
    <div class="table-cont clearfix">
      <div class="left-cont float-left height100" v-loading="singleLoading">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          stripe
          width="50%"
          height="100%"
        >
          <el-table-column
            label="操作"
            min-width="100"
            fixed="left"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="singleEdit(scope.row, scope.$index)"
              >
                {{ scope.row.isEdit ? "完成" : "编辑" }}
              </el-button>
              <el-button
                v-if="!scope.row.isEdit"
                type="text"
                @click="singleDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                v-else-if="scope.row.isEdit"
                type="text"
                @click="singleCancel()"
                >取消</el-button
              >
            </template>
          </el-table-column>
          <template v-for="(item, index) in tableDataParams">
            <template v-if="item.children && item.children.length">
              <el-table-column
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fixed"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
              >
                <el-table-column
                  v-for="(v, k) in item.children"
                  :key="k"
                  :prop="v.prop"
                  :label="v.label"
                  :min-width="v.width"
                  :fixed="v.fixed"
                  :align="v.align || 'left'"
                  :header-align="v.headerAlign || 'left'"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.isEdit">
                      <template v-if="v.prop.indexOf('type') > -1">
                        <l-value-domain
                          clearable
                          :remoteUrl="
                            '/vitalItemOption/getItemOptionByItemCode/' +
                            item.prop
                          "
                          type="select"
                          :value.sync="scope.row[v.prop].itemOptionCode"
                          remoteShowKey="optionName"
                          remoteValueKey="optionCode"
                          placeholder
                          class="width100"
                        ></l-value-domain>
                      </template>
                      <template v-else-if="v.prop.indexOf('value') > -1">
                        <el-input
                          v-model="scope.row[v.prop].itemValue"
                          class="width100 inputSpecial"
                        >
                          <span
                            v-if="
                              item.itemUnit != '' && item.itemUnit != undefined
                            "
                            slot="suffix"
                            v-codeTransform
                            code="VitalItemUnit"
                            :val="item.itemUnit"
                          ></span>
                        </el-input>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="v.prop.indexOf('type') > -1">{{
                        scope.row[v.prop].itemOptionCode
                      }}</template>
                      <template v-if="v.prop.indexOf('value') > -1">{{
                        scope.row[v.prop].itemValue
                      }}</template>
                    </template>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fixed"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
              >
                <template slot-scope="scope">
                  <!--不可编辑-->
                  <template v-if="item.editDisabled"
                    >{{ scope.row[item.prop] }}:00</template
                  >
                  <!--编辑项目-->
                  <template v-else>
                    <template v-if="scope.row.isEdit">
                      <!--文本框-->
                      <template v-if="item.controlType == '0'">
                        <el-input
                          v-model="scope.row[item.prop].itemValue"
                          class="width100 inputSpecial"
                        >
                          <span
                            v-if="
                              item.itemUnit != '' && item.itemUnit != undefined
                            "
                            slot="suffix"
                            v-codeTransform
                            code="VitalItemUnit"
                            :val="item.itemUnit"
                          ></span>
                        </el-input>
                      </template>
                      <!--双文本框-->
                      <template v-else-if="item.controlType == '1'">
                        <el-input
                          v-model="scope.row[item.prop].itemValue"
                          class="width50 inputSpecial"
                        >
                          <span
                            v-if="
                              item.itemUnit != '' && item.itemUnit != undefined
                            "
                            slot="suffix"
                            v-codeTransform
                            code="VitalItemUnit"
                            :val="item.itemUnit"
                          ></span>
                        </el-input>
                        <el-input
                          v-model="scope.row[item.prop].itemValue"
                          class="width50 inputSpecial"
                        >
                          <span
                            v-if="
                              item.itemUnit != '' && item.itemUnit != undefined
                            "
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
                          :remoteUrl="
                            '/vitalItemOption/getItemOptionByItemCode/' +
                            item.prop
                          "
                          type="select"
                          :value.sync="scope.row[item.prop].itemValue"
                          remoteShowKey="optionName"
                          remoteValueKey="optionCode"
                          placeholder
                          class="width100"
                        ></l-value-domain>
                      </template>
                      <!--下拉录入框-->
                      <template v-else-if="item.controlType == '3'">
                        <el-input
                          v-model="scope.row[item.prop].itemValue"
                          class="width100 inputSpecial"
                        >
                          <span
                            v-if="
                              item.itemUnit != '' && item.itemUnit != undefined
                            "
                            slot="suffix"
                            v-codeTransform
                            code="VitalItemUnit"
                            :val="item.itemUnit"
                          ></span>
                        </el-input>
                      </template>
                    </template>
                    <template v-else>
                      {{ scope.row[item.prop].itemValue }}
                    </template>
                  </template>
                </template>
              </el-table-column>
            </template>
          </template>
        </el-table>
      </div>
      <div class="right-cont float-right height100">
        <div id="echart" class="width100 height100"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getVitalItemListByDeptCode,
    getVitalSignRecords,
    selectVitalSignRecords,
    getSignRecords,
    saveVitalSignRecords,
    deleteVitalSignRecords,
    saveRecords,
    deleteRecords
  } from "@/api/public/temperature";
  import {mapGetters} from "vuex";
  import { localGet } from "@/utils/auth.js"

  const timeList = ['02', '06', '10', '14', '18', '22'];
  export default {
    name: "temperatureRight",
    props: ['form'],
    data() {
      return {
        searchData: {
          dataDate: '',//日期
          dataTime: '',//时刻
          inpDay: '',//入院天数
          nursingLevel: '',//护理等级
          rangeHour: '',//高热病人 小时内
          minC: '',//小温度
          maxC: '',//大温度
          operaDays: ''//手术天数
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptionsTime: {
          start: '02:00',
          step: '04:00',
          end: '22:00'
        },
        itemList: [],
        //批量表格
        tableDatasParams: [],
        tableDatas: [],
        tableDatasItem: {},
        currentRow: {},
        selections: [],
        //单个录入表格
        signRecords: {},
        tableDataParams: [],
        tableDataInit: [],
        tableData: [],
        tableDataItem: {},
        singleLoading: false,
        //echarts数据
        dateList: [],
        dateTimeList: [],
        echartsList: {},
        tempValue: [],
        pulseValue: []
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      ...mapGetters(["illnessArea"])
    },
    async created() {
      await this.handleDateList();
      await this.resetEchartsList();
      await this.handleEchartsValue();
      const _this = this;
      await this.$nextTick(async () => {
        await _this.drawChart();
      });
      await this.getItemList();
      await this.handleItemList(this.itemList);
      this.$refs.multiTable.doLayout();
      this.$refs.singleTable.doLayout();
    },
    mounted() {
      // console.log('formform', this.form);
    },
    methods: {
      handleDateList() {
        const that = this;
        let numList = [-2, -1, 0];
        let dateList = [];
        let dateTimeList = [];
        numList.forEach(item => {
          let day = that.getDay(item);
          dateList.push(day);
          timeList.forEach(v => {
            let name = day + ' ' + v;
            dateTimeList.push(name);
          });
        });
        this.dateList = dateList;
        this.dateTimeList = dateTimeList;
      },
      resetEchartsList() {
        const that = this;
        let numList = [-2, -1, 0];
        let echartsList = {};
        numList.forEach(item => {
          let day = that.getDay(item);
          echartsList[day] = {};
          timeList.forEach(v => {
            echartsList[day][v] = {
              temp: 0,
              pulse: 0
            }
          });
        });
        this.echartsList = echartsList;
      },
      //计算最近三天日期
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
      },
      //重置
      reset() {
        this.searchData = {
          dataDate: '',
          dataTime: '',
          inpDay: '',
          nursingLevel: '',
          rangeHour: '',
          minC: '',
          maxC: '',
          operaDays: ''
        }
      },
      //根据获取项目
      async getItemList() {
        let role =
          typeof localGet("role") !== "undefined"
            ? JSON.parse(localGet("role"))
            : false;
        this.$showLoading();
        try {
          let params = {
            // deptCd: this.receivePatientData.admissionSdeptId,
            deptCd: role.deptId,
            patientAge: ''
          };
          let res = await getVitalItemListByDeptCode(params);
          /*let res = {
            code: 1,
            data: [
              {
                "controlType": "0",
                "dataType": "0",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "2c9180866e88050b016e8be33a2e000d",
                "itemCode": "VI19112100004",
                "itemFix": "1",
                "itemName": "心率",
                "itemType": "0",
                "itemUnit": "1",
                "orgId": "66"
              },
              {
                "controlType": "0",
                "dataType": "0",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "2c9180866e88050b016e8be36696000e",
                "itemCode": "VI19112100005",
                "itemFix": "1",
                "itemName": "疼痛",
                "itemType": "0",
                "itemUnit": "",
                "orgId": "66"
              },
              {
                "controlType": "0",
                "dataType": "2",
                "dataVersion": 2,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "2c9180866e88050b016e8be2a168000a",
                "itemCode": "VI19112100001",
                "itemExpression": "",
                "itemFix": "1",
                "itemName": "体温",
                "itemType": "0",
                "itemUnit": "0",
                "orgId": "66"
              },
              {
                "controlType": "0",
                "dataType": "1",
                "dataVersion": 1,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "2c9180866e88050b016e8be2d163000b",
                "itemCode": "VI19112100002",
                "itemExpression": "",
                "itemFix": "1",
                "itemName": "呼吸",
                "itemType": "0",
                "itemUnit": "1",
                "orgId": "66"
              },
              {
                "controlType": "0",
                "dataType": "0",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "2c9180866e88050b016e8be2fe2f000c",
                "itemCode": "VI19112100003",
                "itemFix": "1",
                "itemName": "脉搏",
                "itemType": "0",
                "itemUnit": "1",
                "orgId": "66"
              },
              {
                "controlType": "0",
                "dataType": "0",
                "dataVersion": 1,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "2c9180866e88050b016e8be3b6950010",
                "itemCode": "VI19112100007",
                "itemFix": "1",
                "itemName": "血压",
                "itemType": "1",
                "itemUnit": "5",
                "orgId": "66"
              },
              {
                "controlType": "0",
                "dataType": "0",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "2c9180866e88050b016e8be3e8ff0011",
                "itemCode": "VI19112100008",
                "itemFix": "1",
                "itemName": "身高",
                "itemType": "1",
                "itemUnit": "4",
                "orgId": "66"
              },
              {
                "controlType": "4",
                "dataType": "1",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "402844806f9ff287016fa1aec3500021",
                "itemCode": "VI20011400036",
                "itemFix": "1",
                "itemName": "呕吐 ",
                "itemType": "2",
                "itemUnit": "2",
                "orgId": "66"
              },
              {
                "controlType": "4",
                "dataType": "1",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "402844806f9ff287016fa1ae936e0020",
                "itemCode": "VI20011400035",
                "itemFix": "1",
                "itemName": "胸水",
                "itemType": "2",
                "itemUnit": "2",
                "orgId": "66"
              },
              {
                "controlType": "4",
                "dataType": "1",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "402844806f9ff287016fa1ae4fe0001f",
                "itemCode": "VI20011400034",
                "itemFix": "1",
                "itemName": "引流液",
                "itemType": "2",
                "itemUnit": "2",
                "orgId": "66"
              },
              {
                "controlType": "4",
                "dataType": "1",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "402844806f9ff287016fa1af3dd20023",
                "itemCode": "VI20011400038",
                "itemFix": "1",
                "itemName": "腹腔引流",
                "itemType": "2",
                "itemUnit": "2",
                "orgId": "66"
              },
              {
                "controlType": "2",
                "dataType": "0",
                "dataVersion": 0,
                "deletedStatus": "0",
                "hosId": "91",
                "id": "402844806f9ff287016fa1a451330019",
                "itemCode": "VI20011400031",
                "itemFix": "1",
                "itemName": "基础代谢率",
                "itemType": "2",
                "itemUnit": "2",
                "orgId": "66"
              }
            ]
          };*/
          if (res.code == 1) {
            this.itemList = res.data;
          } else {
            this.$message.error(res.msg || "获取项目失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取项目失败");
        }
      },
      handleItemList(list) {
        let tableDatasParams = [
          {
            prop: "dataDate",
            label: "记录日期",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "90",
            editDisabled: true
          },
          {
            prop: "dataTime",
            label: "记录时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "90",
            editDisabled: true
          }, {
            prop: "wdeptAdmissionTime",
            label: "入院日期",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "200",
            editDisabled: true
          }, {
            prop: "inpDay",
            label: "住院天数",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80",
            editDisabled: true
          }, {
            prop: "bedCode",
            label: "床号",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80",
            editDisabled: true
          }, {
            prop: "inpName",
            label: "姓名",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80",
            editDisabled: true
          }
        ];
        let tableDataParams = [
          {
            prop: "dataTime",
            label: "记录时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "90",
            editDisabled: true
          }
        ];
        for (let i in list) {
          if (list[i].controlType != '4') {
            this.$set(tableDatasParams, tableDatasParams.length, {
              prop: list[i].itemCode,
              label: list[i].itemName,
              align: 'left',
              headerAlign: 'left',
              fixed: false,
              width: '180',
              editDisabled: false,
              controlType: list[i].controlType,
              itemUnit: list[i].itemUnit,
              itemType: list[i].itemType,
              itemFix: list[i].itemFix
            });
            this.$set(this.tableDatasItem, list[i].itemCode, {
              itemCode: list[i].itemCode,
              itemName: list[i].itemName,
              itemType: list[i].itemType,
              controlType: list[i].controlType,
              bedCode: "",
              dataDate: "",
              dataSource: "",
              dataTime: "",
              dataType: "",
              id: "",
              inpCode: "",
              inpDay: "",
              inpDeptCode: "",
              inpDeptName: "",
              inpName: "",
              itemOptionCode: "",
              itemOptionName: "",
              itemValue: "",
              nursingLevel: "",
              wdeptAdmissionTime: ""
            });
            if (list[i].itemType == '0') {
              this.$set(tableDataParams, tableDataParams.length, {
                prop: list[i].itemCode,
                label: list[i].itemName,
                align: 'left',
                headerAlign: 'left',
                fixed: false,
                width: '180',
                editDisabled: false,
                controlType: list[i].controlType,
                itemUnit: list[i].itemUnit,
                itemType: list[i].itemType,
                itemFix: list[i].itemFix
              });
              this.$set(this.tableDataItem, list[i].itemCode, {
                itemCode: list[i].itemCode,
                itemName: list[i].itemName,
                bedCode: "",
                dataDate: "",
                dataSource: "",
                dataTime: "",
                dataType: "",
                id: "",
                inpCode: "",
                inpDay: "",
                inpDeptCode: "",
                inpDeptName: "",
                inpName: "",
                itemOptionCode: "",
                itemOptionName: "",
                itemValue: "",
                nursingLevel: "",
                wdeptAdmissionTime: ""
              });
            }
          } else {
            this.$set(tableDatasParams, tableDatasParams.length, {
              prop: list[i].itemCode,
              label: list[i].itemName,
              align: 'center',
              headerAlign: 'center',
              // fixed: false,
              // width: '180',
              // editDisabled: false,
              controlType: list[i].controlType,
              itemUnit: list[i].itemUnit,
              itemType: list[i].itemType,
              itemFix: list[i].itemFix,
              children: [
                {
                  prop: list[i].itemCode + 'type',
                  label: '类型',
                  align: 'center',
                  headerAlign: 'center',
                  fixed: false,
                  width: '180',
                  editDisabled: false,
                  controlType: list[i].controlType,
                  itemUnit: list[i].itemUnit,
                  itemType: list[i].itemType,
                  itemFix: list[i].itemFix
                }, {
                  prop: list[i].itemCode + 'value',
                  label: '值',
                  align: 'center',
                  headerAlign: 'center',
                  fixed: false,
                  width: '180',
                  editDisabled: false,
                  controlType: list[i].controlType,
                  itemUnit: list[i].itemUnit,
                  itemType: list[i].itemType,
                  itemFix: list[i].itemFix
                }
              ]
            });
            this.$set(this.tableDatasItem, list[i].itemCode + 'type', {
              itemCode: list[i].itemCode,
              itemName: list[i].itemName,
              itemType: list[i].itemType,
              controlType: list[i].controlType,
              bedCode: "",
              dataDate: "",
              dataSource: "",
              dataTime: "",
              dataType: "",
              id: "",
              inpCode: "",
              inpDay: "",
              inpDeptCode: "",
              inpDeptName: "",
              inpName: "",
              itemOptionCode: "",
              itemOptionName: "",
              itemValue: "",
              nursingLevel: "",
              wdeptAdmissionTime: ""
            });
            this.$set(this.tableDatasItem, list[i].itemCode + 'value', {
              itemCode: list[i].itemCode,
              itemName: list[i].itemName,
              itemType: list[i].itemType,
              controlType: list[i].controlType,
              bedCode: "",
              dataDate: "",
              dataSource: "",
              dataTime: "",
              dataType: "",
              id: "",
              inpCode: "",
              inpDay: "",
              inpDeptCode: "",
              inpDeptName: "",
              inpName: "",
              itemOptionCode: "",
              itemOptionName: "",
              itemValue: "",
              nursingLevel: "",
              wdeptAdmissionTime: ""
            });
            if (list[i].itemType == '0') {
              this.$set(tableDataParams, tableDataParams.length, {
                prop: list[i].itemCode,
                label: list[i].itemName,
                align: 'center',
                headerAlign: 'center',
                // fixed: false,
                // width: '180',
                // editDisabled: false,
                controlType: list[i].controlType,
                itemUnit: list[i].itemUnit,
                itemType: list[i].itemType,
                itemFix: list[i].itemFix,
                children: [
                  {
                    prop: list[i].itemCode + 'type',
                    label: '类型',
                    align: 'center',
                    headerAlign: 'center',
                    fixed: false,
                    width: '180',
                    editDisabled: false,
                    controlType: list[i].controlType,
                    itemUnit: list[i].itemUnit,
                    itemType: list[i].itemType,
                    itemFix: list[i].itemFix
                  }, {
                    prop: list[i].itemCode + 'value',
                    label: '值',
                    align: 'center',
                    headerAlign: 'center',
                    fixed: false,
                    width: '180',
                    editDisabled: false,
                    controlType: list[i].controlType,
                    itemUnit: list[i].itemUnit,
                    itemType: list[i].itemType,
                    itemFix: list[i].itemFix
                  }
                ]
              });
              this.$set(this.tableDataItem, list[i].itemCode + 'type', {
                itemCode: list[i].itemCode,
                itemName: list[i].itemName,
                bedCode: "",
                dataDate: "",
                dataSource: "",
                dataTime: "",
                dataType: "",
                id: "",
                inpCode: "",
                inpDay: "",
                inpDeptCode: "",
                inpDeptName: "",
                inpName: "",
                itemOptionCode: "",
                itemOptionName: "",
                itemValue: "",
                nursingLevel: "",
                wdeptAdmissionTime: ""
              });
              this.$set(this.tableDataItem, list[i].itemCode + 'value', {
                itemCode: list[i].itemCode,
                itemName: list[i].itemName,
                bedCode: "",
                dataDate: "",
                dataSource: "",
                dataTime: "",
                dataType: "",
                id: "",
                inpCode: "",
                inpDay: "",
                inpDeptCode: "",
                inpDeptName: "",
                inpName: "",
                itemOptionCode: "",
                itemOptionName: "",
                itemValue: "",
                nursingLevel: "",
                wdeptAdmissionTime: ""
              });
            }
          }
        }
        this.tableDatasParams = tableDatasParams;
        this.tableDataParams = tableDataParams;

        let tableDataInit = [];
        let dataList = this.tableDataItem;
        for (let i in timeList) {
          let obj = {
            dataTime: timeList[i],
            isEdit: false
          };
          for (let j in dataList) {
            obj[j] = {};
            for (let k in dataList[j]) {
              obj[j][k] = dataList[j][k]
            }
          }
          tableDataInit.push({...obj});
        }
        this.tableDataInit = tableDataInit;
        // console.log('this.tableDataInit', this.tableDataInit);
      },
      //获取批量体温单列表
      async searchVitalRecords() {
        await this.getVitalRecords();
        if (this.tableDatas.length) {
          this.$refs.multiTable.setCurrentRow(this.tableDatas[0]);
          this.currentRow = {...this.tableDatas[0]};
          await this.getSignRecords(this.currentRow.dataDate);
          await this.handleSignRecords(this.signRecords);
          await this.getTempPulse();
        }
      },
      async getVitalRecords() {
        if (this.searchData.dataDate && this.searchData.dataTime) {
          this.$showLoading();
          try {
            let params = {
              isNurse: 1,
              ...this.form,
              ...this.searchData,
              dataTime: this.searchData.dataTime.split(':')[0],
              itemCode: 'VI19112100001'//体温code，查询条件有温度必传
            };
            let res = await getVitalSignRecords(params);
            /*let res = {
              "code": 1,
              "data": {
                "INP191113001": [
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "dataSource": "",
                    "dataTime": "02",
                    "dataType": "0",
                    "id": "2c91808870a076920170a07692ee0000",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19112100001",
                    "itemName": "体温",
                    "itemOptionCode": "vO20022700001",
                    "itemOptionName": "",
                    "itemValue": "36.5",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "dataSource": "",
                    "dataTime": "02",
                    "dataType": "0",
                    "id": "2c91808870a076920170a07692f90001",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19112100002",
                    "itemName": "呼吸",
                    "itemOptionCode": "vO20022700007",
                    "itemOptionName": "",
                    "itemValue": "85.0",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "dataSource": "",
                    "dataTime": "02",
                    "dataType": "0",
                    "id": "2c91808870a076920170a07692fb0002",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19112100003",
                    "itemName": "脉搏",
                    "itemOptionCode": "vO20022700005",
                    "itemOptionName": "",
                    "itemValue": "72.0",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "dataSource": "",
                    "dataTime": "02",
                    "dataType": "0",
                    "id": "2c91808870a076920170a07692fd0003",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19112100004",
                    "itemName": "心率",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "75.0",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "dataSource": "",
                    "dataTime": "02",
                    "dataType": "0",
                    "id": "2c91808870a076920170a07692ff0004",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19112100005",
                    "itemName": "疼痛",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "100.0",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a1280005",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19112100007",
                    "itemName": "血压",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "73/142",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a12b0006",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19112100008",
                    "itemName": "身高",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "175",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a12d0007",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19111700009",
                    "itemName": "体重",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "56",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a1300008",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19111700010",
                    "itemName": "大便次数",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "2",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a1330009",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19111700014",
                    "itemName": "入量",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "1080",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a135000a",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19111700015",
                    "itemName": "尿量",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "801",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a13d000b",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI19111700016",
                    "itemName": "过敏药物",
                    "itemOptionCode": "",
                    "itemOptionName": "",
                    "itemValue": "无.",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a13e000c",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI20011400031",
                    "itemName": "基础代谢率",
                    "itemValue": "vO19110200003",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a076a140000d",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI20011400032",
                    "itemName": "胆汁",
                    "itemValue": "胆汁值1",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  },
                  {
                    "bedCode": "08+03",
                    "dataDate": "20200303",
                    "id": "2c91808870a076920170a0791e99000e",
                    "inpCode": "INP191113001",
                    "inpDay": 110,
                    "inpDeptCode": "N0001",
                    "inpDeptName": "呼吸内科",
                    "inpName": "董宗飞",
                    "itemCode": "VI20011400033",
                    "itemName": "胃液",
                    "itemValue": "胃液值",
                    "nursingLevel": 1,
                    "wdeptAdmissionTime": "2019-11-14 13:46:42"
                  }
                ]
              }
            };*/
            if (res.code == 1) {
              await this.handleRecords(res.data);
            } else {
              this.$message.error(res.msg || "获取项目失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "获取项目失败");
          }
        } else {
          this.$message.error('请选择日期与时间');
        }
      },
      //处理记录数据
      async handleRecords(data) {
        let tableData = [];
        let _this = this;
        for (let i in data) {
          let obj = {};
          await data[i].forEach(async item => {
            await _this.findControlType(item.itemCode, function (itemValue) {
              // console.log('controlType', controlType);
              if (itemValue.controlType == '4') {
                obj[item.itemCode + 'type'] = {
                  ...item,
                  itemType: itemValue.itemType,
                  controlType: itemValue.controlType
                };
                obj[item.itemCode + 'value'] = {
                  ...item,
                  itemType: itemValue.itemType,
                  controlType: itemValue.controlType
                };
              } else {
                obj[item.itemCode] = {
                  ...item,
                  itemType: itemValue.itemType,
                  controlType: itemValue.controlType
                };
              }
            });
          });
          tableData.push({
            ...this.tableDatasItem,
            ...obj,
            inpCode: data[i][0].inpCode,
            dataTime: data[i][0].dataTime || this.searchData.dataTime.split(':')[0],
            dataDate: data[i][0].dataDate || this.searchData.dataDate,
            bedCode: data[i][0].bedCode,
            inpName: data[i][0].inpName,
            inpDay: data[i][0].inpDay,
            wdeptAdmissionTime: data[i][0].wdeptAdmissionTime,
            inpDeptCode: data[i][0].inpDeptCode,
            inpDeptName: data[i][0].inpDeptName,
            isEdit: false
          });
        }
        this.tableDatas = tableData;
      },
      //查找controlType
      findControlType(itemCode, fn) {
        this.itemList.forEach(item => {
          if (item.itemCode == itemCode) {
            fn(item);
          }
        });
      },
      //编辑or完成
      multiEdit(row, index) {
        if (row.isEdit) {
          this.$set(this.tableDatas[index], 'isEdit', false);
        } else {
          this.$set(this.tableDatas[index], 'isEdit', true);
        }
      },
      //清空
      multiReset(row, index) {
        // this.$set(this.tableDatas[index], 'isEdit', false);
        for (let i in this.tableDatas[index]) {
          if (this.tableDatas[index][i].itemCode) {
            this.$set(this.tableDatas[index], i, {
              ...this.tableDatas[index][i],
              itemValue: '',
              itemOptionCode: '',
              itemOptionName: ''
            });
          }
        }
      },
      //点击某一行
      async multiRowClick(row, coloum) {
        this.currentRow = {...row};
        if (!row.isEdit) {
          await this.getSignRecords(this.currentRow.dataDate);
          await this.handleSignRecords(this.signRecords);
          await this.getTempPulse();
        }
      },
      multiSelectChange(selections) {
        this.selections = selections;
      },
      //处理保存的数据
      handleSaveRecords() {
        let selections = [...this.selections];
        let _this = this;
        let arr = [];
        selections.forEach(item => {
          let obj = {
            signRecordsList: [],
            itemsRecordsList: []
          };
          let yinshe = {
            '0': 'signRecordsList',
            '1': 'itemsRecordsList',
            '2': 'itemsRecordsList'
          };
          let moren = {};
          for (let i in item) {
            if (item[i].itemCode && item[i].inpCode) {
              moren = {
                inpCode: item[i].inpCode,
                bedCode: item[i].bedCode,
                dataDate: item[i].dataDate,
                dataTime: item.dataTime || _this.searchData.dataTime.split(':')[0],
                inpDay: item[i].inpDay,
                inpDeptCode: item[i].inpDeptCode,
                inpDeptName: item[i].inpDeptName,
                inpName: item[i].inpName,
                nursingLevel: item[i].nursingLevel,
                wdeptAdmissionTime: item[i].wdeptAdmissionTime
              }
            }
          }
          for (let i in item) {
            if (item[i].itemCode) {
              if (i.indexOf('type') > -1) {
                let code = i.split('type')[0];
                let itemObbj = {
                  ...item[i],
                  ...moren,
                  itemValue: item[code + 'value'].itemValue
                };
                _this.$delete(itemObbj, 'controlType');
                _this.$delete(itemObbj, 'itemType');
                if (item[i].itemType != '0') {
                  _this.$delete(itemObbj, 'dataTime');
                }
                obj[yinshe[item[i].itemType]].push(itemObbj);
              } else if (i.indexOf('value') < 0) {
                let itemObbj = {
                  ...item[i],
                  ...moren
                };
                _this.$delete(itemObbj, 'controlType');
                _this.$delete(itemObbj, 'itemType');
                if (item[i].itemType != '0') {
                  _this.$delete(itemObbj, 'dataTime');
                }
                obj[yinshe[item[i].itemType]].push(itemObbj);
              }
            }
          }
          arr.push(obj);
        });
        // console.log(arr);
        return arr;
      },
      //保存
      async saveRecords() {
        if (this.selections.length) {
          this.$showLoading();
          try {
            let params = await this.handleSaveRecords();
            let res = await saveRecords(params);
            if (res.code == 1) {
              this.$message.info("保存成功");
              await this.searchVitalRecords();
            } else {
              this.$message.error(res.msg || "保存失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "保存失败");
          }
        } else {
          this.$message.info("请先选择要保存的纪录");
        }
      },
      //处理删除的数据
      handleDeleteRecords() {
        let selections = [...this.selections];
        let arr = [];
        selections.forEach(item => {
          let obj = {
            signList: [],
            itemList: []
          };
          let yinshe = {
            '0': 'signList',
            '1': 'itemList',
            '2': 'itemList'
          };
          for (let i in item) {
            if (item[i].id) {
              if (obj[yinshe[item[i].itemType]].indexOf(item[i].id) < 0) {
                obj[yinshe[item[i].itemType]].push(item[i].id);
              }
            }
          }
          arr.push(obj);
        });
        // console.log(arr);
        return arr;
      },
      //删除
      async deleteRecords() {
        if (this.selections.length) {
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$showLoading();
            try {
              let params = await this.handleDeleteRecords();
              let res = await deleteRecords(params);
              if (res.code == 1) {
                this.$message.info("删除成功");
                await this.searchVitalRecords();
              } else {
                this.$message.error(res.msg || "删除失败");
              }
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "删除失败");
            }
          });
        } else {
          this.$message.info("请先选择要删除的纪录");
        }
      },
      /*体征项目*/
      //获取某患者体征项目记录
      async getSignRecords(dataDate) {
        this.tableData = [];
        this.singleLoading = true;
        try {
          let params = {
            inpCode: this.currentRow.inpCode,
            recordDate: dataDate
          };
          let res = await getSignRecords(params);
          /*let res = {
            "code": 1,
            "data": {
              "02": [
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "02",
                  "dataType": "0",
                  "dataVersion": 1,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "2c91808870a076920170a07692ee0000",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100001",
                  "itemName": "体温",
                  "itemOptionCode": "vO20022700001",
                  "itemOptionName": "",
                  "itemValue": 36.5,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "02",
                  "dataType": "0",
                  "dataVersion": 1,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "2c91808870a076920170a07692f90001",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100002",
                  "itemName": "呼吸",
                  "itemOptionCode": "vO20022700007",
                  "itemOptionName": "",
                  "itemValue": 85.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "02",
                  "dataType": "0",
                  "dataVersion": 1,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "2c91808870a076920170a07692fb0002",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100003",
                  "itemName": "脉搏",
                  "itemOptionCode": "vO20022700005",
                  "itemOptionName": "",
                  "itemValue": 72.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "02",
                  "dataType": "0",
                  "dataVersion": 1,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "2c91808870a076920170a07692fd0003",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100004",
                  "itemName": "心率",
                  "itemOptionCode": "",
                  "itemOptionName": "",
                  "itemValue": 75.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "02",
                  "dataType": "0",
                  "dataVersion": 1,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "2c91808870a076920170a07692ff0004",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100005",
                  "itemName": "疼痛",
                  "itemOptionCode": "",
                  "itemOptionName": "",
                  "itemValue": 100.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                }
              ],
              "06": [
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "06",
                  "dataType": "0",
                  "dataVersion": 0,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "4028449370a48b570170a48b57020000",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100001",
                  "itemName": "体温",
                  "itemOptionCode": "vO20022700002",
                  "itemOptionName": "",
                  "itemValue": 38.9,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "06",
                  "dataType": "0",
                  "dataVersion": 0,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "4028449370a48b570170a48b57b30001",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100002",
                  "itemName": "呼吸",
                  "itemOptionCode": "vO20022700007",
                  "itemOptionName": "",
                  "itemValue": 10.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "06",
                  "dataType": "0",
                  "dataVersion": 0,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "4028449370a48b570170a48b59460002",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100003",
                  "itemName": "脉搏",
                  "itemOptionCode": "vO20022700006",
                  "itemOptionName": "",
                  "itemValue": 96.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "06",
                  "dataType": "0",
                  "dataVersion": 0,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "4028449370a48b570170a48b5bb60003",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100004",
                  "itemName": "心率",
                  "itemOptionCode": "",
                  "itemOptionName": "",
                  "itemValue": 425.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                },
                {
                  "dataDate": "20200303",
                  "dataSource": "",
                  "dataTime": "06",
                  "dataType": "0",
                  "dataVersion": 0,
                  "deletedStatus": "0",
                  "hosCode": "KGYY",
                  "hosId": "91",
                  "id": "4028449370a48b570170a48b5c1c0004",
                  "inpCode": "INP191113001",
                  "inpDeptCode": "N0001",
                  "inpDeptName": "呼吸内科",
                  "inpName": "董宗飞",
                  "itemCode": "VI19112100005",
                  "itemName": "疼痛",
                  "itemOptionCode": "",
                  "itemOptionName": "",
                  "itemValue": 27.0,
                  "orgCode": "TJAXJT",
                  "orgId": "66"
                }
              ]
            }
          };*/
          if (res.code == 1) {
            this.signRecords = res.data;
          } else {
            this.$message.error(res.msg || "获取体征项目记录失败");
          }
          this.singleLoading = false;
        } catch (error) {
          this.singleLoading = false;
          this.$message.error(error.msg || "获取体征项目记录失败");
        }
      },
      async getSignRecordsE(dataDate) {
        try {
          let params = {
            inpCode: this.currentRow.inpCode,
            recordDate: dataDate
          };
          let res = await getSignRecords(params);
          if (res.code == 1) {
            return res.data;
          } else {
            return {};
          }
        } catch (error) {
          return {};
        }
      },
      //处理体征项目记录数据(获取之后)
      async handleSignRecords(data) {
        let tableData = [];
        let _this = this;
        let obj = {};
        for (let i in data) {
          await data[i].forEach(async item => {
            await _this.findControlType(item.itemCode, function (itemValue) {
              if (itemValue.controlType == '4') {
                obj[item.itemCode + 'type'] = {...item};
                obj[item.itemCode + 'value'] = {...item};
              } else {
                obj[item.itemCode] = {...item};
              }
            });
          });
          await tableData.push({
            ...this.tableDataItem,
            ...obj,
            dataTime: data[i][0].dataTime,
            isEdit: false
          });
        }
        let tableDataInit = [];
        for (let i in this.tableDataInit) {
          let obj = {};
          for (let j in this.tableDataInit[i]) {
            let dataTime = this.tableDataInit[i][j].dataTime;
            if (dataTime) {
              obj[j] = {...this.tableDataInit[i][j]};
            } else {
              obj[j] = this.tableDataInit[i][j];
            }
          }
          tableDataInit.push(obj);
        }
        for (let i in tableDataInit) {
          for (let j in tableData) {
            if (tableDataInit[i].dataTime == tableData[j].dataTime) {
              await this.$set(tableDataInit, i, {...tableData[j]})
            }
          }
        }
        this.tableData = [...tableDataInit];
        // console.log(tableData);
      },
      //处理体征项目记录数据(保存之前)
      handleSignRecordsAfter(index) {
        let dataInit = this.tableData[index];
        let params = [];
        let data = {};
        for (let i in dataInit) {
          if (dataInit[i].itemCode) {
            if (i.indexOf('type') > -1) {
              let code = i.split('type')[0];
              data[code] = data[code] || {...dataInit[i], itemValue: dataInit[code + 'value'].itemValue}
            } else if (i.indexOf('value') > -1) {
              let code = i.split('value')[0];
              data[code] = data[code] || {
                ...dataInit[i],
                itemOptionCode: dataInit[code + 'type'].itemOptionCode,
                itemOptionName: dataInit[code + 'type'].itemOptionName
              }
            } else {
              data[i] = {...dataInit[i]};
            }
          }
        }
        for (let i in data) {
          if (data[i].itemCode) {
            params.push({
              dataDate: data[i].dataDate || this.currentRow.dataDate,
              dataTime: dataInit.dataTime,
              dataType: data[i].dataType,
              dataSource: data[i].dataSource,
              dataVersion: data[i].dataVersion,
              deletedStatus: data[i].deletedStatus,
              id: data[i].id,
              inpCode: data[i].inpCode || this.currentRow.inpCode,
              inpDeptCode: data[i].inpDeptCode || this.currentRow.inpDeptCode,
              inpDeptName: data[i].inpDeptName || this.currentRow.inpDeptName,
              inpName: data[i].inpName || this.currentRow.inpName,
              itemCode: data[i].itemCode,
              itemName: data[i].itemName,
              itemOptionCode: data[i].itemOptionCode,
              itemOptionName: data[i].itemOptionName,
              itemValue: data[i].itemValue,
              hosCode: data[i].hosCode,
              hosId: data[i].hosId,
              orgCode: data[i].orgCode,
              orgId: data[i].orgId
            })
          }
        }
        // console.log(params);
        return params;
      },
      //编辑or完成体征
      async singleEdit(row, index) {
        if (row.isEdit) {
          //保存体征项目
          // let params = this.handleSignRecordsAfter(index);
          this.singleLoading = true;
          try {
            let params = this.handleSignRecordsAfter(index);
            let res = await saveVitalSignRecords(params);
            if (res.code == 1) {
              this.$message.info("保存体征项目记录成功");
              await this.getSignRecords(this.currentRow.dataDate);
              await this.handleSignRecords(this.signRecords);
              if (row.dataTime == this.currentRow.dataTime) {
                await this.searchVitalRecords();
              }
            } else {
              this.$message.error(res.msg || "保存体征项目记录失败");
            }
            this.singleLoading = false;
          } catch (error) {
            this.singleLoading = false;
            this.$message.error(error.msg || "保存体征项目记录失败");
          }
        } else {
          this.$set(this.tableData[index], 'isEdit', true);
        }
      },
      //删除体征
      singleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.singleLoading = true;
          let params = [];
          for (let i in row) {
            if (row[i].id && (params.indexOf(row[i].id) < 0)) {
              params.push(row[i].id);
            }
          }
          try {
            let res = await deleteVitalSignRecords(params);
            if (res.code == 1) {
              this.$message.info('删除成功');
              await this.getSignRecords(this.currentRow.dataDate);
              await this.handleSignRecords(this.signRecords);
              if (row.dataTime == this.currentRow.dataTime) {
                await this.searchVitalRecords();
              }
            } else {
              this.$message.error(res.msg || '删除失败');
            }
            this.singleLoading = false;
          } catch (error) {
            this.singleLoading = false;
            this.$message.error(error.msg || "删除失败");
          }
        });
      },
      //取消
      async singleCancel() {
        await this.getSignRecords(this.currentRow.dataDate);
        await this.handleSignRecords(this.signRecords);
      },
      //获取趋势图数据
      async getTempPulse() {
        const _this = this;
        await _this.resetEchartsList();
        for (let j in _this.dateList) {
          let item = _this.dateList[j];
          let signRecords = await _this.getSignRecordsE(item);
          for (let i in signRecords) {
            await signRecords[i].forEach(async v => {
              if (v.itemCode == 'VI19112100001') {
                await _this.$set(_this.echartsList[item][i], 'temp', v.itemValue || 0);
              } else if (v.itemCode == 'VI19112100003') {
                await _this.$set(_this.echartsList[item][i], 'pulse', v.itemValue || 0);
              }
            });
          }
        }
        await _this.handleEchartsValue();
        await _this.$nextTick(async () => {
          await _this.drawChart();
        });
      },
      async handleEchartsValue() {
        let echartsList = this.echartsList;
        let dateTimeList = this.dateTimeList;
        let tempArr = [];
        let pulseArr = [];
        for (let i in dateTimeList) {
          let ii = dateTimeList[i].split(' ');
          await tempArr.push(echartsList[ii[0]][ii[1]]['temp']);
          await pulseArr.push(echartsList[ii[0]][ii[1]]['pulse']);
        }
        // console.log(tempArr);
        this.tempValue = tempArr;
        this.pulseValue = pulseArr;
      },
      //绘制echarts
      drawChart() {
        let me = this;
        let dom = document.getElementById("echart");
        let myChart = this.$echarts.init(dom);
        let option = {
          /*title: {
            text: '2018年管线数据利用统计',
            top: 10,
            left: 10
          },*/
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
          },
          /*toolbox: {
            show: true,
            top: 10,
            right: 10,
            feature: {
              mark: {show: true},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },*/
          grid: {
            top: 60,
            right: 70,
            bottom: 30,
            left: 60,
            show: false
          },
          legend: {
            top: 32,
            left: 'center',
            data: ['温度', '脉搏']
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: me.dateTimeList
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: "温\n度\n︵\n℃\n︶",
              nameLocation: "center",
              nameGap: 35,
              nameRotate: 0,
              min: 30,
              max: 50,
              nameTextStyle: {
                fontSize: 16
              },
              //默认以千分位显示，不想用的可以在这加一段
              axisLabel: {   //调整左侧Y轴刻度， 直接按对应数据显示
                show: true,
                showMinLabel: true,
                showMaxLabel: true,
                formatter: function (value) {
                  return value;
                }
              }
            },
            {
              type: 'value',
              name: "脉\n搏\n︵\n次\n/\n分\n︶",
              nameLocation: "center",
              nameGap: 35,
              nameRotate: 0,
              min: 0,
              max: 200,
              nameTextStyle: {
                fontSize: 16
              },
              //默认以千分位显示，不想用的可以在这加一段
              axisLabel: {   //调整左侧Y轴刻度， 直接按对应数据显示
                show: true,
                showMinLabel: true,
                showMaxLabel: true,
                formatter: function (value) {
                  return value;
                }
              }
            }
          ],
          series: [
            {
              name: '温度',
              type: 'line',
              smooth: true,
              yAxisIndex: 0,
              // data: [36.5, 37.3, 38.2, 39.4, 36.4, 36.3, 36.2, 36.4, 36.5, 36.4, 36.6, 36.4],
              data: me.tempValue,
              itemStyle: {normal: {label: {show: true}}}
            },
            {
              name: '脉搏',
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
              // data: [85, 93, 75, 76, 76, 75, 80, 79, 82, 79, 78, 110],
              data: me.pulseValue,
              itemStyle: {normal: {label: {show: true}}}
            }
          ]
        };
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style scoped lang="scss">
.temperatureRight {
  .inputSpecial {
    /deep/ .el-input__suffix-inner {
      margin-top: 7px;
      display: inline-block;
    }
  }

  .table-conts {
    height: calc(50% - 39px);
    margin-top: 10px;
  }

  .table-cont {
    height: calc(50% - 39px);
    margin-top: 10px;

    .left-cont {
      width: calc(50% - 5px);
      margin-right: 10px;
    }

    .right-cont {
      width: calc(50% - 5px);
    }
  }

  .width50 {
    width: 50%;
  }
}
</style>
