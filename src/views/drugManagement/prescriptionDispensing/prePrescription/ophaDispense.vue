<template>
  <div class="height100 three-column">
    <!--center-->
    <div id="center" class="column">
      <el-card class="box height100">
        <div class="position-relative" style="height: 50%">
          <div class="top-card">
            <el-form :inline="true">
              <el-row :gutter="8" style="padding: 0 20px">
                <el-col :span="3">
                  <l-formt-title label="配药人" labelWidth="50">
                    <el-select v-model="dispenseUserId" placeholder="请选择">
                      <el-option
                        v-for="item in userList"
                        :key="item.uid"
                        :label="item.uname"
                        :value="item.uid"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
                <el-col :span="3">
                  <l-formt-title label="窗口设置" labelWidth="64">
                    <el-select
                      v-model="windowCode"
                      @change="windowListChange"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in pharWindowList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
                <el-col :span="5">
                  <l-formt-title label="收费时间" labelWidth="64">
                    <el-date-picker
                      v-model="date"
                      style="width: 100%"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      align="right"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :clearable="false"
                    ></el-date-picker>
                  </l-formt-title>
                </el-col>
                <el-col :span="3">
                  <l-formt-title label="配药类型" labelWidth="64">
                    <el-select v-model="dispenseState" placeholder="请选择">
                      <el-option value="0" label="未配药"></el-option>
                      <el-option value="1" label="已配药"></el-option>
                      <el-option value label="全部"></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
                <el-col :span="3">
                  <l-formt-title label="处方号" labelWidth="50">
                    <el-input
                      v-model="recipeCode"
                      style="line-height: 34px"
                    ></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="7" style="font-size: 0">
                  <el-button @click="search(0)" type="primary">查询</el-button>
                  <el-button @click="reset" type="primary" plain
                    >重置</el-button
                  >
                  <el-button @click="search(1)" type="primary" plain
                    >刷新</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="middle">
            <el-row
              class="tables position-absolute"
              style="padding: 0 20px; top: 70px; width: 100%; bottom: 0"
            >
              <div class="ullist height100">
                <el-table
                  ref="recipeTable"
                  :data="recipeTable"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  style="width: 100%"
                  height="324"
                  max-height="100%"
                  @row-click="findDetail"
                  header-align="center"
                  v-loadmore="{
                    noMoreVar: 'totalAll',
                    loadingVar: 'tlm_isLoading',
                    value: load
                  }"
                  v-loading="tlm_isLoading"
                  border
                  stripe
                >
                  <el-table-column
                    prop="recipeCode"
                    label="处方号"
                    min-width="100"
                  ></el-table-column>
                  <el-table-column
                    prop="visitCode"
                    label="门诊号"
                    min-width="120"
                  ></el-table-column>
                  <el-table-column
                    prop="patientName"
                    label="病人姓名"
                    min-width="100"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="patientGender"
                    label="性别"
                    min-width="60"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span
                        :val="scope.row.patientGender"
                        code="GENDER_CODE"
                        v-codeTransform
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="patientAge"
                    label="年龄"
                    min-width="60"
                  ></el-table-column>
                  <el-table-column
                    prop="deptName"
                    label="科室"
                    min-width="60"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="clinicDiag"
                    label="诊断"
                    min-width="120"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    label="指定窗口"
                    min-width="100"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">{{
                      codeToText(scope.row.preWindowCode, pharWindowList)
                    }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="chargeState"
                    label="收费状态"
                    min-width="100"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.chargeState == '0'">未收费</span>
                      <span v-if="scope.row.chargeState == '1'">已收费</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="chargeTime"
                    label="收费时间"
                    min-width="120"
                  ></el-table-column>
                  <el-table-column
                    prop="dispenseState"
                    min-width="100"
                    label="配方状态"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.dispenseState == '0'">未配药</span>
                      <span v-if="scope.row.dispenseState == '1'">已配药</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="dispenseUserName"
                    min-width="100"
                    label="配方人员"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="dispenseTime"
                    min-width="120"
                    label="配方时间"
                  ></el-table-column>
                  <el-table-column
                    prop="printState"
                    label="是否打印配药单"
                    min-width="140"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.printState == '0'">未打印</span>
                      <span v-if="scope.row.printState == '1'">已打印</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-row>
          </div>
        </div>
        <div
          class="position-relative"
          style="padding: 0 20px; height: calc(50% - 64px)"
        >
          <l-card-title style="padding: 16px 0">
            <div slot="left">处方明细</div>
          </l-card-title>
          <div
            class="bottom position-absolute"
            style="top: 50px; bottom: 0; left: 20px; right: 20px"
          >
            <el-table
              ref="orderTable"
              :data="orderTable"
              v-if="orderTableStyle"
              tooltip-effect="dark"
              height="100%"
              border
              stripe
              style="width: 100%"
              v-loading="bottomLoad"
            >
              <el-table-column
                prop="drugName"
                label="药品名称"
              ></el-table-column>
              <el-table-column prop="spec" label="规格"></el-table-column>
              <el-table-column
                prop="purchasePrice"
                align="right"
                label="进价(元)"
                width="120"
              >
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                align="right"
                label="售价(元)"
                width="120"
              >
                <template slot-scope="scope">
                  <span>{{ formatNum(scope.row.price) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="oneDosage"
                v-if="orderType != '11'"
                align="right"
                label="一次用量"
                min-width="90"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="dosageUnit"
                v-if="orderType != '11'"
                label="剂量单位"
                min-width="90"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    :val="scope.row.dosageUnit"
                    code="DrugDoseUnit"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="displayQuantity"
                v-if="orderType != '11'"
                align="right"
                label="数量"
                min-width="60"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="quantity"
                v-if="orderType == '11'"
                align="right"
                label="数量"
                min-width="60"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="displayUnit"
                label="单位"
                min-width="60"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    :val="scope.row.displayUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="frequencyCode"
                label="频率"
                min-width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    columns="FREQUENCY_NAME"
                    :conditionMap="{ FREQUENCY_CODE: scope.row.frequencyCode }"
                    tableName="hrp_frequency"
                    v-tableTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="medicationCode"
                label="用法"
                min-width="60"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    v-if="orderType != '11'"
                    :val="scope.row.medicationCode"
                    code="MedicationRouteCode"
                    v-codeTransform
                  ></span>
                  <span
                    v-if="orderType === '11'"
                    :val="scope.row.medicationCode"
                    code="fryingRemark"
                    v-codeTransform
                  ></span>
                </template>
              </el-table-column>
              <!--              <el-table-column prop="dropRate" min-width="60" label="滴速" show-overflow-tooltip></el-table-column>-->
              <el-table-column
                prop="specialUsage"
                min-width="60"
                label="备注"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="handleClick(scope.row)"
                    type="text"
                    size="small"
                  >
                    补打
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <el-row
          class="position-relative"
          style="
            height: 64px;
            padding: 0 20px;
            display: flex;
            align-items: center;
          "
        >
          <el-col
            :span="16"
            style="
              text-align: left;
              font-size: 0;
              display: flex;
              align-items: center;
            "
          >
            <el-button
              class="filter-item"
              type="primary"
              plain
              @click="printDispense"
              >打印配药单</el-button
            >
            <!--            <el-button class="filter-item" type="primary" plain @click="printRecipe">处方打印</el-button>
            <el-button class="filter-item" type="primary" plain @click="printDescription">用药说明书打印</el-button>-->
            <el-button
              class="filter-item"
              type="primary"
              plain
              @click="printLabelValied(2)"
              >打印标签贴</el-button
            >
            <el-button
              v-if="isPause === '1'"
              @click="pause"
              class="filter-item"
              type="primary"
              plain
              >窗口启用</el-button
            >
            <el-button
              v-if="isPause === '0'"
              @click="pause"
              class="filter-item"
              type="primary"
              plain
              >窗口暂停</el-button
            >

            <el-checkbox v-model="checked">是否开启静默打印</el-checkbox>
            <el-switch
              style="margin-left: 8px"
              v-model="autoDispense"
              active-text="自动配药"
              @change="changeAuto"
            ></el-switch>
            <!-- <el-input-number v-model="loopTime" controls-position="right" style="width: 100px; margin-left: 8px" :step="1"
              :min="1" :max="300"></el-input-number > -->
            <el-select v-model="loopTime" placeholder="请选择">
              <el-option
                v-for="item in optionsTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span style="font-size: 12px; padding: 0 8px">秒</span>
            <el-button type="primary" plain @click="sendDrug"
              >定时刷新间隔</el-button
            >
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button
              v-if="dispenseStaterow == '0'"
              type="primary"
              @click="dispense"
              v-hotKey="{ func: 'func_submit' }"
              >确认配药</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </div>
    <printNameseter
      v-if="printNameseterVisible"
      title="打印机设置"
      width="800px"
      :visible.sync="printNameseterVisible"
      :requiredName="requiredName"
      @closePrintSeterFuc="closePrintSeterFuc"
    ></printNameseter>
  </div>
</template>

<script>
import { getPamars } from "@/utils/auth";
import { mapGetters } from "vuex";
import store from "@/store";
import { deepClone } from "@/utils/index.js";
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";
import { getCurrentDiagList } from "@/api/common/diagnosis";
import { localCodeTransform } from "@/utils/util";
import mixin from "@/mixins/drugManagement.js";
import { preview, onPreview, onPreviewData } from "@/utils/print";
import { PrintLabel } from "@/printTemplete/module/printLabel.js";
import {
  transformCode,
  transformCodeList
} from "@/api/directive/directiveRequest";
import formatNum from "@/utils/formatPrice.js";
import {
  saveWindowCode,
  getWindowCode,
  loopSendDrug
} from "@/utils/drugManagement.js";
import { print } from "@/utils/print_new.js";
export default {
  mixins: [mixin],
  data() {
    return {
      printType:'',
      printerName:'',
      printNameseterVisible: false,
      requiredName: "",
      checked: true,
      tempRow: {},
      optionsTime: [
        {
          value: 5,
          label: "5秒"
        },
        {
          value: 30,
          label: "30秒"
        },
        {
          value: 60,
          label: "一分钟"
        }
      ],
      orderTableStyle: true, //明细刷新
      orderType: "",
      id: "",
      isActive: false,
      disabled: false,
      options: [],
      userList: [], //发药人数据源
      uname: "", //当前发药人名称
      windowtext: {}, //窗口信息
      isPause: "", //窗口状态
      dispenseUserId: "",
      windowCode: "",
      date: [],
      recipeCode: "",
      dispenseState: "",
      pharWindowList: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      tlm_noMore: false,
      tlm_isLoading: false,
      recipeTable: [],
      recipeUnit: [],
      orderTable: [],
      dispenseStaterow: "",
      bottomLoad: false,
      loop: null,
      loopTime: 30,
      autoDispense: false,
      recipeTypeList: [],
      //反显数据
      codeTransformList: {}
    };
  },
  created() {
    this.getuserList();
    this.loop = loopSendDrug();
    this.$once("hook:beforeDestroy", () => {
      this.loop.clearFun();
    });
    let autoV = localStorage.getItem("autoDispense");
    if (autoV) {
      this.autoDispense = JSON.parse(autoV)[this.role.roleId] || false;
    }
    let loopTime = localStorage.getItem("loopTime");
    if (loopTime) {
      this.loopTime = JSON.parse(loopTime)[this.role.roleId] || 30;
    } else {
      localStorage.setItem(
        "loopTime",
        JSON.stringify({
          [this.role.roleId]: 30
        })
      );
    }
    if (this.autoDispense) {
      this.sendDrug();
    }
  },
  mounted() {
    this.recipeTypeList = [
      {
        code: "1",
        name: "【急诊】",
        value: "急诊"
      },
      {
        code: "2",
        name: "【儿科】",
        value: "儿科"
      },
      {
        code: "3",
        name: "",
        value: "普通"
      },
      {
        code: "4",
        name: "【麻、精一】",
        value: "毒性"
      },
      {
        code: "5",
        name: "【麻、精一】",
        value: "麻醉"
      },
      {
        code: "6",
        name: "【麻、精一】",
        value: "精一"
      },
      {
        code: "0",
        name: "【精二】",
        value: "精二"
      }
    ];
    const wCode = getWindowCode();
    if (wCode && wCode[this.role.roleId]) {
      this.windowCode = wCode[this.role.roleId];
    }
    this.addDate();
    this.listForDropDown();
    this.getCookie();
    this.search(0);
  },
  computed: {
    ...mapGetters("drugManagement", ["currentDrug"]),
    ...mapGetters("user", ["role"]),
    totalAll: function() {
      return Math.ceil(this.total / this.pageSize) <= this.pageNo;
    }
  },
  watch: {
    recipeTable: {
      deep: true,
      handler(val) {
        this.$refs.recipeTable && this.$refs.recipeTable.setCurrentRow(val[0]);
      }
    }
  },
  methods: {
    printLabelValied (type,fn){
      this.printType = type
      let printerName = "";
      // 选择标签打印机
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      let arr = tableData.filter((item) => {
        return item.name === "用药标签";
      });
      console.log(this.printNameseterVisible)
      if(arr.length) {
        printerName = arr[0].printerName;
        this.printerName = arr[0].printerName;
        if(type == 1){
          this.loop.setFun(this.getPrintRep, this.loopTime * 1000);
        }else {
          this.printLabel(printerName)
        }
        return;
      }
      this.printNameseterVisible = true;
      this.requiredName = "用药标签";
    },
    closePrintSeterFuc(name) {
      this.printNameseterVisible = false;
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      let arr = tableData.filter((item) => {
        return item.name === "用药标签";
      });
      if(arr.length) {
        if(this.printType == 1){
          this.loop.setFun(this.getPrintRep, this.loopTime * 1000);
        }else{
          this.printLabel(this.printerName)
        }
      }else{
        let t;
        clearTimeout(t)
        console.log(this.printType)
        if(this.printType == 1){
          t=setTimeout(()=>{
            this.printNameseterVisible = true;
          },this.loopTime * 1000)
        }else{
          clearTimeout(t)
          return
        }

      }
      /*if(this.printType){
        if(this.printType == 1){
          this.loop.setFun(this.getPrintRep, this.loopTime * 1000);
        }else{
          this.printLabel(this.printerName)
        }
      }else{
        return
      }*/
    },

    async sendDrug(fn) {
      if (!this.autoDispense) {
        this.$message.warning("请开启自动配药");
        return;
      }
      localStorage.setItem(
        "loopTime",
        JSON.stringify({
          [this.role.roleId]: this.loopTime
        })
      );
      this.loop.clearFun();
      await this.printLabelValied(1,fn);

    },
    // 获取打印
    async getPrintRep(fn) {
      let printerName = this.printerName
      await opha.recipeDispense().then(res => {
        if(res.data && res.data.label){
          res.data.label.forEach(_ => {
            print(null, PrintLabel, {printerName},_ , this.checked);
          });
        }

        fn();
      });
      this.search(0);
    },
    formatNum(num) {
      return formatNum(num);
    },
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    //获取当前日期
    addDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      this.date = [currentdate, currentdate];
    },

    async listForDropDown() {
      this.pharWindowList = await base.pharWindowForDropDown({});
    },
    // eslint-disable-next-line complexity
    async fetchData(type) {
      this.orderTable = [];
      try {
        let param = {};
        if (!type) {
          param = {
            orderBy: "dispense_state, charge_time desc",
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            dispenseUserId: this.dispenseUserId,
            preWindowCode: this.windowCode,
            sChargeDate: this.date[0] ? this.date[0] + " 00:00:00" : "",
            eChargeDate: this.date[1] ? this.date[1] + " 23:59:59" : "",
            dispenseState: this.dispenseState,
            recipeCode: this.recipeCode,
            currDrugStorage: "1",
            dispendingMethod: "1"
          };
        } else {
          param = {
            orderBy: "dispense_state, charge_time desc",
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            dispenseUserId: this.dispenseUserId,
            preWindowCode: this.windowCode,
            sChargeDate: this.date[0] ? this.date[0] + " 00:00:00" : "",
            eChargeDate: this.date[1] ? this.date[1] + " 23:59:59" : "",
            dispenseState: 0,
            chargeState: 1,
            currDrugStorage: "1",
            dispendingMethod: "1"
          };
        }
        this.tlm_isLoading = true;
        let response = await opha.list(param);
        let { data } = response;
        if (this.pageNo === 1) {
          this.recipeTable = data;
          if (data.length > 0) {
            this.findDetail(this.recipeTable[0] || {});
            this.setCurrent(this.recipeTable[0] || {});
          }
        } else {
          this.recipeTable = this.recipeTable.concat(data);
        }

        this.total = response.total;
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
      }
    },
    search(type) {
      // 搜索
      this.pageNo = 1;
      this.total = 0;
      this.fetchData(type);
    },
    //高亮首行
    setCurrent(row) {
      if (this.recipeTable.length == "0") {
        return;
      }
      this.$refs.recipeTable.setCurrentRow(row);
    },
    refresh() {
      // 刷新操作
    },
    //获取配药人
    async getuserList() {
      let _self = this;
      _self.userList = [];
      if (store.user.state.role.deptId) {
        let result = await base.getuserList(store.user.state.role.deptId);
        if (result.code == "1") {
          result.data.forEach(function(item) {
            _self.userList.push({
              uid: item.uid,
              uname: item.uname
            });
          });
        }
      }
    },

    //窗口切换获取窗口状态
    async windowListChange(val) {
      saveWindowCode({
        [this.role.roleId]: val
      });
      this.$showLoading();
      let id = this.windowCode;
      let result = await base.pharpharWindowtype(id);
      this.$hideLoading();
      this.windowtext = result.data;
      this.isPause = this.windowtext.isPause;
      this.setCookie();
    },
    //设置cookie
    setCookie(windowCode, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "windowCode" +
        "=" +
        this.windowCode +
        ";path=/;expires=" +
        exdate.toGMTString();
    },

    //读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("=");
          //判断查找相对应的值
          if (arr2[0] == "windowCode") {
            this.windowCode = arr2[1];
          }
        }
      }
    },

    async pause() {
      // 窗口暂停
      try {
        this.$showLoading();
        let response = await base.pharWindowchangeStatus({
          windowCode: this.windowCode,
          isPause: this.isPause === "1" ? "0" : "1"
        });

        if (this.isPause === "1") {
          if (response.code == "1") {
            this.$message.success("窗口启用成功");
            this.isPause = "0";
            this.$hideLoading();
          } else {
            this.$message.error("窗口启用失败");
          }
        } else if (this.isPause === "0") {
          if (response.code == "1") {
            this.$message.success("窗口暂停成功");
            this.isPause = "1";
            this.$hideLoading();
          } else {
            this.$message.error("窗口暂停失败");
          }
        }
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },

    async findDetail(row) {
      console.log("row", JSON.parse(JSON.stringify(row)));
      if (!row.recipeCode) {
        return;
      }
      this.tempRow = JSON.parse(JSON.stringify(row));
      this.orderType = row.orderType;
      this.dispenseStaterow = row.dispenseState;
      try {
        this.orderTableStyle = false;
        this.bottomLoad = true;
        let response = await opha.listD({
          recipeCode: row.recipeCode
        });
        let { data } = response;
        let table = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          table.push(item);
        }
        this.orderTable = table;
        this.id = row.id;
        this.orderTableStyle = true;
        this.bottomLoad = false;
      } catch (error) {
        this.orderTableStyle = true;
        this.bottomLoad = false;
      }
    },
    async dispense() {
      if (this.dispenseStaterow == "1") {
        this.$message.error("已完成配药，无需配药");
        return;
      }
      try {
        this.$showLoading();
        if (!this.id) {
          return;
        }
        let { data } = await opha.dispense(this.id);
        this.$message.success(data);
        this.search(0);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async printDispense() {
      if (!this.currentDrug.id) {
        this.$message.warning("请选择处方");
        return;
      }
      this.$showLoading();
      await opha
        .printDispense(this.currentDrug.id)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            onPreview(res.data, "门诊配药单西药成药");
            this.search(0);
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });
    },
    printRecipe() {
      let data = {};
      data.title = "处方签";
      data.patientName = this.currentDrug.patientName;
      data.patientAge = this.currentDrug.patientAge;
      data.deptName = this.currentDrug.deptName;
      data.visitCode = this.currentDrug.visitCode;
      data.detailList = this.orderTable;
      onPreview(data, "处方签");
    },
    printDescription() {
      let data = {};
      data.title = "用药说明书";
      data.patientName = this.currentDrug.patientName;
      data.patientAge = this.currentDrug.patientAge;
      data.deptName = this.currentDrug.deptName;
      data.visitCode = this.currentDrug.visitCode;
      data.detailList = this.orderTable;
      onPreview(data, "处方签");
    },
    async printLabel(printerName) {
      if (this.orderType === "11") {
        this.$message.warning("不支持打印中草药标签贴");
        return;
      }
      if (!this.currentDrug.id) {
        this.$message.warning("请选择处方");
        return;
      }
      this.$showLoading();
      await opha
        .printLabel(this.currentDrug.id)
        .then(res => {
          this.$hideLoading();
          this.checked = true;
          if (res.code === 1) {
            res.data.forEach(_ => {
              print(null, PrintLabel, {printerName},_ , this.checked);
            });
            // onPreviewData(res.data, "莲塘社康门诊");
            // onPreviewData(PrintLabel, "莲塘社康门诊");
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });
    },
    async handleClick(row) {
      console.log(`row`, JSON.parse(JSON.stringify(row)));
      if (this.orderType === "11") {
        this.$message.warning("不支持打印中草药标签贴");
        return;
      }
      this.$showLoading();
      await opha
        .printLabel(this.currentDrug.id)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            console.log(
              `标签打印已通知打印机`,
              JSON.parse(JSON.stringify(res.data))
            );
            res.data.forEach(_ => {
              if (_.drugName === row.drugName) {
                print(null, PrintLabel, {}, _, this.checked);
              }
            });
          } else {
            this.$message.error(res.msg || "打印查询失败!");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "打印查询异常!");
        });
    },
    //重置
    reset() {
      this.dispenseUserId = "";
      this.windowCode = "";
      this.dispenseState = "";
      this.recipeCode = "";
      this.addDate();
    },
    //code transform
    async codeTransform(params) {
      let codeList = this.codeTransformList[params[0].code];
      if (codeList !== undefined && codeList[params[0].val] !== undefined) {
        return;
      } else {
        try {
          let res = await transformCode(params);
          if (!codeList) {
            this.codeTransformList[params[0].code] = {};
          }
          this.codeTransformList[params[0].code][params[0].val] =
            res.data[params[0].code] || undefined;
        } catch (e) {
          return;
        }
      }
    },
    //滑动加载更多信息
    load() {
      if (this.totalAll) {
        return;
      }
      this.pageNo++;
      this.fetchData();
    },
    changeAuto(val) {
      if (val) {
        this.sendDrug();
      } else {
        this.loop.clearFun();
      }
      localStorage.setItem(
        "autoDispense",
        JSON.stringify({
          [this.role.roleId]: val
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
$rightWidth: 287px;

.three-column {
  min-width: 1024px;
  /deep/ .el-table__body {
    overflow: auto;
  }
  .column {
    float: left;
    height: 100%;

    .box {
      height: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      width: 100%;
    }
  }

  #center {
    width: 100%;

    .top-card {
      padding-top: 10px;
      margin-bottom: 10px;

      .filter-item {
        border-color: $l-color-primary;
        color: $l-color-primary;
      }
    }

    .middle {
      margin-bottom: 10px;
      height: calc(100% - 250px - 70px);
      border-top: 1px solid $l-color-bgcolor-11;

      .btn-loadMore {
        padding: 0;
        text-align: center;
      }
    }

    .bottom {
      margin-bottom: 10px;
    }
  }

  #right {
    margin-right: -$rightWidth;
    width: $rightWidth;
    padding-right: 0;
  }
}

.bottom-container {
  text-align: center;
  padding: 20px 0px;
}

.changs {
  background: $l-color-primary;
  border: 1px solid $l-color-primary;
}
</style>
