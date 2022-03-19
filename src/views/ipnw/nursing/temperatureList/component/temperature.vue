<template>
  <div class="container height100">
    <div class="top">
      <span>录入日期：</span>
      <el-date-picker
        v-model="date"
        type="date"
        prefix-icon="null"
        value-format="yyyy-MM-dd"
        placeholder="选择录入日期"
        :picker-options="pickerOptions"
        @change="dateChange"
      ></el-date-picker>
    </div>
    <div class="left overflow-scroll-vertical">
      <div class="input-wrapper">
        <el-radio-group v-model="recordTime" class="item">
          <el-radio label="0200" :disabled="checkTime(2)">2</el-radio>
          <el-radio label="0600" :disabled="checkTime(6)">6</el-radio>
          <el-radio label="1000" :disabled="checkTime(10)">10</el-radio>
          <el-radio label="1400" :disabled="checkTime(14)">14</el-radio>
          <el-radio label="1800" :disabled="checkTime(18)">18</el-radio>
          <el-radio label="2200" :disabled="checkTime(22)">22</el-radio>
        </el-radio-group>
        <l-formt-title label="体温(°C)" class="item">
          <div>
          <el-select v-model="signData[recordTime].gaugeCategory" class="temp-pos">
            <el-option
              v-for="item in tempOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model="signData[recordTime].temperature"
            class="temp-input"
            controls-position="right"
            v-only-number="{max:42,min:34,precision:1}"
          ></el-input>
        </div>
        </l-formt-title>
        <l-formt-title label="脉搏(bpm)" class="item">
          <el-select v-model="signData[recordTime].pulseCategory" class="temp-pos">
            <el-option
              v-for="item in pulseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model.number="signData[recordTime].pulse"
            class="temp-input"
            v-only-number="{max:180,min:30,precision:0}"
          ></el-input>
        </l-formt-title>
        <l-formt-title label="呼吸(bpm)" class="item">
          <el-select v-model="signData[recordTime].breathCategory" class="temp-pos">
            <el-option
              v-for="item in breathOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model.number="signData[recordTime].breath"
            class="temp-input"
            v-only-number="{max:200,min:10,precision:1}"
          ></el-input>
        </l-formt-title>
        <div class="item l-clearfix">
          <el-button class="float-right" @click="saveSign">保存</el-button>
          <el-button class="float-right margin-right-6" @click="delSign">删除</el-button>
        </div>
      </div>
      <div class="input-wrapper">
        <l-formt-title label="大便次数" class="item">
          <!-- <el-input v-model.number="otherData.shit.value" :max="50" :min="0"></el-input> -->
          <el-select v-model="otherData.shit.value">
            <el-option
              v-for="item in shitTimesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </l-formt-title>
        <l-formt-title label="尿量(ml)" class="item">
          <el-input v-model.number="otherData.urine.value" v-only-number="{max:9999,min:0,precision:1}"></el-input>
        </l-formt-title>
        <l-formt-title label="总入量(ml)" class="item">
          <el-input v-model.number="otherData.icount.value" v-only-number="{max:9999,min:0,precision:1}"></el-input>
        </l-formt-title>
        <l-formt-title label="总出量(ml)" class="item">
          <el-input v-model.number="otherData.ocount.value" v-only-number="{max:9999,min:0,precision:1}"></el-input>
        </l-formt-title>
        <l-formt-title label="血压(上午)(mmhg)" class="item">
          <el-input v-model="otherData.blood.value[0]"></el-input>
        </l-formt-title>
        <l-formt-title label="血压(下午)(mmhg)" class="item">
          <el-input v-model="otherData.blood.value[1]"></el-input>
        </l-formt-title>
        <l-formt-title label="体重(kg)" class="item">
          <el-input v-model.number="otherData.weight.value" v-only-number="{max:500,min:0,precision:1}"></el-input>
        </l-formt-title>
        <l-formt-title label="身高(cm)" class="item">
          <el-input v-model.number="otherData.height.value" v-only-number="{max:500,min:0,precision:1}"></el-input>
        </l-formt-title>
        <div class="item l-clearfix">
          <el-button class="float-right" @click="saveOther">保存</el-button>
          <el-button class="float-right margin-right-6" @click="delOther">删除</el-button>
        </div>
      </div>
      <div class="input-wrapper">
        <l-formt-title label="图章" style="width:150px">
          <l-value-domain
            remoteUrl="/temperatureStamp/getStampDic"
            remoteValueKey="serialId"
            :value.sync="stampValue"
            @change="stampChangeHandler"
          ></l-value-domain>
        </l-formt-title>
        <!-- <el-select v-model="stampTime" class="float-right" style="width:100px">
          <el-option
            v-for="item in stampOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->
        <el-time-picker
          v-model="stampTime"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="图章时间"
          class="float-right"
          style="width:120px"
        ></el-time-picker>
        <div style="margin-top:5px;margin-bottom:5px;" class="l-clearfix">
          <el-button class="float-right" @click="saveStamp">保存</el-button>
        </div>
        <div class="width100 l-clearfix" style="height:200px;margin-top:10px;margin-bottom:20px;">
          <el-table
            :data="stampData"
            width="100%"
            height="100%"
            border
            highlight-current-row
            @selection-change="setStampSelectedIdx"
          >
            <el-table-column
              type="selection"
              label="序号"
              width="50px"
              header-align="center"
              align="center"
              fixed
            ></el-table-column>
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
          </el-table>
          <el-button class="float-right" style="margin-top:5px;" @click="delStamp">删除</el-button>
        </div>
      </div>
    </div>
    <div class="right">
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
// http://43.240.130.82:8883/table.html
// http://localhost/work/lenovohit/03.static/chart/table.html
// http://192.168.197.101:8082/table.html
import { mapGetters } from "vuex";
import {
  getWeekData,
  updateSignData,
  delSignData,
  updateOtherData,
  delOtherData,
  updateStampData,
  getStampData,
  delStampData
} from "@/api/ipnw/temperature";
import { getDeptName } from "@/api/admin/role";

const KEY_MAP = {
  // 住院天数
  hosp: { canvas: "d1", db: "" },
  // 术后天数
  oper: { canvas: "d2", db: "" },
  // 脉搏
  pulse: { canvas: "d3", db: "" },
  // 体温
  temp: { canvas: "d4", db: "" },
  // 呼吸
  breath: { canvas: "d5", db: "" },
  // 大便次数
  shit: { canvas: "d6", db: "21689e0e-aa88-42ab-85be-03611ac6fc01" },
  // 尿量
  urine: { canvas: "d7", db: "f4a080bd-0e30-4018-b846-738010d8ca4e" },
  // 总入量
  icount: { canvas: "d8", db: "8381bdf2-84e9-43a2-bb71-de157ad8f702" },
  // 总出量
  ocount: { canvas: "d9", db: "cdd32e30-676a-4d00-9a7c-888a2342488b" },
  // 血压
  blood: { canvas: "d10", db: "0958c3df-fe1a-4088-bb3e-f51c3d7c39b8" },
  // 体重
  weight: { canvas: "d11", db: "bd812af3-65b3-4d66-8207-b2c34bdd66ec" },
  // 身高
  height: { canvas: "d12", db: "e9f0b71d-1c6d-4c41-b903-ec29d1ff71b2" },
  // 皮试
  skin: { canvas: "d13", db: "796e0a06-0025-4852-bf50-5ea0e209d2a1" }
};
let recordTimes = ["0200", "0600", "1000", "1400", "1800", "2200"];

export default {
  data() {
    return {
      date: this.getFormateDate(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      recordTime: "0200",
      recordTimes: recordTimes,
      detpname: "",
      datas: [],
      dataIdx: 0,
      signData: this.getDefaultSignData(),
      otherData: this.getDefaultOtherData(),
      stampData: [],
      tempOptions: [
        {
          label: "口表",
          value: 1
        },
        {
          label: "耳表",
          value: 2
        },
        {
          label: "腋表",
          value: 3
        },
        {
          label: "肛表",
          value: 4
        }
      ],
      pulseOptions: [
        {
          label: "脉搏",
          value: 1
        },
        {
          label: "起搏器",
          value: 2
        }
      ],
      breathOptions: [
        {
          label: "呼吸",
          value: 1
        },
        {
          label: "呼吸机",
          value: 2
        }
      ],
      shitTimesOptions: [
        { label: "*", value: "*" },
        { label: "☆", value: "☆" },
        { label: "※", value: "※" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "0/E", value: "0/E" },
        { label: "1/E", value: "1/E" },
        { label: "2/E", value: "2/E" },
        { label: "3/E", value: "3/E" },
        { label: "4/E", value: "4/E" },
        { label: "5/E", value: "5/E" },
        { label: "6/E", value: "6/E" },
        { label: "7/E", value: "7/E" },
        { label: "8/E", value: "8/E" },
        { label: "9/E", value: "9/E" },
        { label: "10/E", value: "10/E" }
      ],
      stampTableData: [],
      stampTableParams: [
        {
          prop: "stampName",
          label: "图章名称",
          width: "80",
          align: "left",
          fixed: true
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
      stampName: "",
      stampTime: "",
      stampIds: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(pre, next) {
        if (pre == next) {
          return;
        }
        this.date = this.getFormateDate();
        this.updateDatas();
      },
      deep: true
    }
  },
  async mounted() {
    // this.$nextTick(() => {
    //   this.updateDatas()
    // })
  },
  methods: {
    checkTime(t) {
      var ntime = new Date();
      return ntime.getHours() <= t;
    },
    getDefaultSignData() {
      let defaultSignData = {};
      for (let i = 0; i < recordTimes.length; i++) {
        const key = recordTimes[i];
        defaultSignData[key] = {};
      }
      return defaultSignData;
    },
    getDefaultOtherData() {
      return {
        // 大便次数
        shit: { value: undefined },
        // 尿量
        urine: { value: undefined },
        // 总入量
        icount: { value: undefined },
        // 总出量
        ocount: { value: undefined },
        // 血压
        blood: { value: ["/", "/"] },
        // 体重
        weight: { value: undefined },
        // 身高
        height: { value: undefined }
      };
    },
    getDefaultStampData() {
      return [];
    },
    // 年月日
    getFormateDate() {
      let today = new Date();
      let m = today.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = today.getDate();
      d = d < 10 ? "0" + d : d;
      return today.getFullYear() + "-" + m + "-" + d;
    },
    getServerNeedDate(t) {
      let today = new Date(t.replace(/-/g, "/"));
      let m = today.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = today.getDate();
      d = d < 10 ? "0" + d : d;
      return today.getFullYear() + "" + m + "" + d;
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
    convertToServerFormate(str) {
      return str.replace(/\-/g, "");
    },
    dateChange() {
      let has = false;
      let localDate = this.convertToServerFormate(this.date);
      for (let i = 0; i < this.datas.length; i++) {
        let item = this.datas[i];
        if (item.date == localDate) {
          this.dataIdx = i;
          has = true;
          break;
        }
      }
      this.signData = this.getDefaultSignData();
      this.otherData = this.getDefaultOtherData();
      this.stampData = this.getDefaultStampData();
      if (!has) {
        this.updateDatas();
      } else {
        this.updateOneData();
      }
    },
    updateOneData() {
      this.signData = {
        // ...this.signData,
        ...this.getDefaultSignData(),
        ...this.datas[this.dataIdx].signData
      };
      this.otherData = {
        // ...this.otherData,
        ...this.getDefaultOtherData(),
        ...this.datas[this.dataIdx].otherData
      };
      this.stampValue = "";
      this.stampName = "";
      this.stampTime = "";
      this.stampData = [...this.datas[this.dataIdx].stampData];
      this.updateTempData();
    },
    signDefaultItem(recordTime, recordDate) {
      return {
        gaugeCategory: 1,
        pulseCategory: 1,
        breathCategory: 1,
        recordTime,
        recordDate
      };
    },
    signFilter(list, date) {
      let data = {};
      this.recordTimes.forEach(t => {
        data[t] = this.signDefaultItem(t, date);
      });
      if (!list || !list.length) {
        return data;
      }
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        data[item.recordTime] = { ...item };
      }
      return data;
    },
    getKeyByItemId(itemid) {
      for (let key in KEY_MAP) {
        let item = KEY_MAP[key];
        if (item.db == itemid) {
          return key;
        }
      }
      return null;
    },
    otherFilter(list, date) {
      let data = {};
      if (!list || !list.length) {
        return data;
      }
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let key = this.getKeyByItemId(item.itemId);
        // 血压特殊处理
        if (key === "blood") {
          let bdv = item.value.split("|");
          item.value = bdv.length === 2 ? bdv : ["/", "/"];
        }
        data[key] = {
          ...item
        };
      }
      return data;
    },
    async updateDatas() {
      if (
        !this.receivePatientData.inpCode ||
        !this.receivePatientData.finAdmissionTime
      ) {
        return;
      }
      let deptResp = await getDeptName(this.receivePatientData.admissionSdeptId);
      if (deptResp.code === 1 && deptResp.data.length > 0) {
        this.detpname = deptResp.data[0].org_nm;
      } else {
        this.detpname = "";
      }

      try {
        this.$showLoading();
        let serverDate = this.convertToServerFormate(this.date);
        let response = await getWeekData(
          this.receivePatientData.inpCode,
          this.getServerNeedDate(this.receivePatientData.finAdmissionTime),
          serverDate
        );
        console.log("---resp----", response);
        if (response.code === 1) {
          let datas = [];
          for (let i = 0; i < response.data.length; i++) {
            let item = response.data[i];
            datas.push({
              date: item.date,
              signData: this.signFilter(item.vitalSignsPoList, item.date),
              otherData: this.otherFilter(item.vitalOtherPoList, item.date),
              stampData: item.vitalStampPoList
            });
            if (item.date === serverDate) {
              this.dataIdx = i;
            }
          }
          this.datas = datas;
        } else {
          this.$message.error(response.msg || "获取体温单数据失败");
        }
        this.$hideLoading();
      } catch (error) {
        console.error(error);
        this.$hideLoading();
        this.$message.error(error.msg || "获取体温单数据失败");
      }

      this.updateOneData();
    },
    mergeDataToWeekData(type) {
      this.datas[this.dataIdx].signData = { ...this.signData };
      this.datas[this.dataIdx].otherData = { ...this.otherData };
      this.datas[this.dataIdx].stampData = [...this.stampData];
      this.updateTempData();
    },
    async saveSign() {
      if (!this.receivePatientData.inpCode) {
        this.$message.info("请选择患者");
        return;
      }
      try {
        let item = this.signData[this.recordTime];
        if (!item.breath && !item.temperature && !item.pulse) {
          return this.$message.info("请填写数据");
        }
        this.$showLoading();
        let params = { ...this.signData[this.recordTime] };
        params.inpCode = this.receivePatientData.inpCode;
        params.inpDeptCode = this.receivePatientData.admissionSdeptId;
        params.wardCode = this.receivePatientData.admissionWdeptId;
        await updateSignData(params);
        // this.mergeDataToWeekData();
        this.updateDatas();
        this.$hideLoading();
        this.$message("保存成功");
      } catch (error) {
        console.error(error);
        this.$hideLoading();
        this.$message.error(error.msg || "保存失败");
      }
    },
    async delSign() {
      if (!this.receivePatientData.inpCode) {
        this.$message.info("请选择患者");
        return;
      }
      try {
        this.$showLoading();
        let params = { ...this.signData[this.recordTime] };
        params.inpCode = this.receivePatientData.inpCode;
        params.inpDeptCode = this.receivePatientData.admissionSdeptId;
        params.wardCode = this.receivePatientData.admissionWdeptId;
        await delSignData(params);
        this.signData[this.recordTime] = this.signDefaultItem(
          this.recordTime,
          this.datas[this.dataIdx].date
        );
        this.mergeDataToWeekData();
        this.$hideLoading();
        this.$message("删除成功");
      } catch (error) {
        console.error(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    async saveOther() {
      if (!this.receivePatientData.inpCode) {
        this.$message.info("请选择患者");
        return;
      }
      try {
        this.$showLoading();
        let params = [];
        let novalue = true;
        for (const key in this.otherData) {
          const item = this.otherData[key];
          if (!item.value && item.value !== 0) {
            continue;
          }
          novalue = false;
          let itemId = KEY_MAP[key].db;
          let d = {
            inpCode: this.receivePatientData.inpCode,
            inpDeptCode: this.receivePatientData.admissionSdeptId,
            wardCode: this.receivePatientData.admissionWdeptId,
            recordDate: this.datas[this.dataIdx].date,
            itemId,
            ...item
          };
          // 特殊处理血压
          if (key === "blood") {
            d.value = d.value.join("|");
          }
          params.push(d);
        }
        if (novalue) {
          this.$hideLoading();
          return this.$message.info("请填写数据");
        }
        await updateOtherData(params);
        // this.mergeDataToWeekData();
        this.updateDatas();
        this.$hideLoading();
        this.$message("保存成功");
      } catch (error) {
        console.error(error);
        this.$hideLoading();
        this.$message.error(error.msg || "保存失败");
      }
    },
    async delOther() {
      if (!this.receivePatientData.inpCode) {
        this.$message.info("请选择患者");
        return;
      }

      try {
        this.$showLoading();
        let params = [];
        for (const key in this.otherData) {
          const item = this.otherData[key];
          if (key === "blood") {
            this.otherData[key] = { value: ["/", "/"] };
          } else {
            this.otherData[key] = { value: null };
          }
          if (!item.serialId) {
            continue;
          }
          let d = {
            inpCode: this.receivePatientData.inpCode,
            inpDeptCode: this.receivePatientData.admissionSdeptId,
            wardCode: this.receivePatientData.admissionWdeptId,
            recordDate: this.datas[this.dataIdx].date,
            ...item
          };
          params.push(d);
        }
        await delOtherData(params);
        this.mergeDataToWeekData();
        this.$hideLoading();
        this.$message("删除成功");
      } catch (error) {
        console.error(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    toRemote(item) {
      let ret = {};
      for (const key in item) {
        const value = item[key];
        let km = KEY_MAP[key] ? KEY_MAP[key].canvas : key;
        ret[km] = value;
      }
      return ret;
    },
    getTempData() {
      let list = [];
      for (let i = 0; i < this.datas.length; i++) {
        const data = this.datas[i];
        let recordDate = new Date(
          data.date.slice(0, 4) +
            "-" +
            data.date.slice(4, 6) +
            "-" +
            data.date.slice(6)
        ).getTime();
        let signRemoteData = {
          pulse: [],
          temp: [],
          breath: []
        };
        for (let j = 0; j < this.recordTimes.length; j++) {
          const rk = this.recordTimes[j];
          // 合并sign表中的数据
          let item = data.signData[rk];
          if (item.pulse) {
            signRemoteData.pulse[j] = {
              val: item.pulse,
              type: item.pulseCategory
            };
          }
          if (item.temperature) {
            signRemoteData.temp[j] = {
              val: item.temperature,
              type: item.gaugeCategory
            };
          }
          if (item.breath) {
            signRemoteData.breath[j] = item.breath;
          }
        }
        // 合并other表中的数据
        let otherRemoteData = {};
        for (const okey in data.otherData) {
          const oitem = data.otherData[okey];
          if (okey == "blood") {
            otherRemoteData[okey] = {
              high: oitem.value[0] || "/",
              low: oitem.value[1] || "/"
            };
          } else {
            otherRemoteData[okey] = oitem.value;
          }
        }
        let item = {
          st: recordDate,
          ...signRemoteData,
          ...otherRemoteData,
          stamp: [...data.stampData]
        };
        list.push(this.toRemote(item));
      }
      return {
        hosName: "云医院",
        title: "体温单",
        patName: this.receivePatientData.patientName || "",
        inTime: "",
        inpNo: this.receivePatientData.inpCode || "",
        secName: this.detpname,
        datas: list
      };
    },
    updateTempData() {
      let data = this.getTempData();
      if (this.$refs["tempElem"]) {
        this.$refs["tempElem"].contentWindow.postMessage(data, "*");
      }
    },
    setStampSelectedIdx(rows) {
      let ids = [];
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        ids.push(item.serialId);
      }
      this.stampIds = ids;
    },
    async saveStamp() {
      if (!this.receivePatientData.inpCode) {
        this.$message.info("请选择患者");
        return;
      }
      try {
        this.$showLoading();
        let params = {
          inpCode: this.receivePatientData.inpCode,
          inpDeptCode: this.receivePatientData.admissionSdeptId,
          wardCode: this.receivePatientData.admissionWdeptId,
          recordDate: this.datas[this.dataIdx].date,
          recordTime: this.stampTime,
          stampCategory: this.stampValue,
          stampName: this.stampName,
          stampTime: this.stampTime
        };
        let result = await updateStampData(params);
        this.stampData.push(result.data);
        // this.mergeDataToWeekData();
        this.updateDatas();
        this.$hideLoading();
        this.$message("保存成功");
      } catch (error) {
        console.error(error);
        this.$hideLoading();
        this.$message.error(error.msg || "保存失败");
      }
    },
    async delStamp() {
      if (this.stampIds.length == 0) {
        this.$message.info("请选想要删除的图章");
        return;
      }
      try {
        this.$showLoading();
        let result = await delStampData(this.stampIds);
        this.stampData = this.stampData.filter(item => {
          return this.stampIds.indexOf(item.serialId) == -1;
        });
        this.$hideLoading();
        this.$message("删除成功");
      } catch (error) {
        console.error(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    stampChangeHandler(value, item) {
      this.stampName = item.name;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 0 20px;
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
  /deep/.temp-pos {
    width: 100px !important;
  }
  /deep/.temp-input {
    width: 82px !important;
  }
  /deep/.el-radio {
    margin-right: 10px;
  }
  .item {
    margin: 5px 0px;
  }
  .input-wrapper {
    border-bottom: 1px solid $l-color-bgcolor-11;
    margin-bottom: 25px;
    padding-bottom: 25px;
  }
}
.right {
  margin-left: 360px;
  height: calc(100% - 66px);
  border: 1px solid $l-color-border-4;
}
</style>
