<template>
  <div class="wrapper height100">
    <el-tabs
      ref="sideTabs"
      class="height100 sideTabs singleTabCls"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="患者列表" name="first">
        <el-form ref="formReceipt" :model="form" class="receipt_form_">
          <div class="form-content">
            <span class="hos" v-if="hospState">
              <l-radio
                :class="radioWrapperCls()"
                :radioCode.sync="form.hospState"
                :selectDatas="statesList"
                @radioChange="radioChange"
              ></l-radio>
            </span>
            <div style="padding:8px;margin-top:10px;width:98%;border-top:1px solid #e4e4e4;" v-if="illnessState"></div>

            <span class="hos" v-if="illnessState">
              <l-radio
                :class="radioWrapperCls()"
                :radioCode.sync="form.illnessState"
                :selectDatas="illnessStatusList"
                @radioChange="radioChange2"
              ></l-radio>
            </span>
            <span class="hos hosRev" v-if="patientMaster.show">
              <el-checkbox true-label="1" false-label="0" v-model="patientMaster.reservation">当日预约</el-checkbox>
            </span>
            <el-form-item
              v-for="(item, index) in formParams"
              :key="index"
              :prop="item.prop"
              label
              class="receipt-form-item"
              :style="{'width': item.width || '100%','padding': '3px 0'}"
            ><!--'margin-top':'10px',-->
              <template v-if="item.type === 'select'">
                <!--//院区-->
                <l-value-domain
                  clearable
                  v-if="item.prop === 'CourtyardArea'"
                  :value.sync="form[item.prop]"
                  remoteUrl="/wadmin/ward-hos"
                  remoteShowKey="dictionaryName"
                  remoteValueKey="icd10Encoding"
                  :placeholder="'请选择' + item.label"
                ></l-value-domain>
                <!--科室-->
                <l-value-domain
                  clearable
                  v-else-if="item.prop === 'technicalOffices'"
                  remoteUrl="/wadmin/hos/dept"
                  type="select"
                  :value.sync="form[item.prop]"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  :placeholder="'请选择' + item.label"
                ></l-value-domain>

                <!--病区-->
                <l-value-domain
                  clearable
                  v-else-if="item.prop === 'illnessArea'"
                  :remoteUrl="illnessAreaUrl"
                  type="select"
                  :value.sync="form[item.prop]"
                  remoteShowKey="wardPatientCount"
                  remoteValueKey="wardCode"
                  :placeholder="'请选择' + item.label"
                  @change="search"
                ></l-value-domain>

                <!--危急值类型-->
                <l-value-domain
                  clearable
                  v-else-if="item.prop === 'checkType'"
                  code="CrisisType"
                  style="width: 100%"
                  :value.sync="form[item.prop]"
                  :placeholder="'请选择' + item.label"
                ></l-value-domain>

                <!--危急值处理状态-->
                <l-value-domain
                  clearable
                  v-else-if="item.prop === 'docState'"
                  code="CrisisStatus"
                  style="width: 100%"
                  :value.sync="form[item.prop]"
                  :placeholder="'请选择' + item.label"
                ></l-value-domain>

                <!--档案状态-->
                <l-value-domain
                  clearable
                  v-else-if="item.prop === 'recordStatus'"
                  code="ARCH_STATUS"
                  style="width: 100%"
                  :value.sync="form[item.prop]"
                  :placeholder="'请选择' + item.label"
                ></l-value-domain>

                <!--渠道-->
                <l-value-domain
                  clearable
                  v-else-if="item.prop === 'channelWay'"
                  style="width: 100%"
                  :value.sync="form[item.prop]"
                  :remoteParams="item.params"
                  remoteUrl="/appointment/numPercentageDict/selectNumPercentageDict"
                  type="select"
                  remoteShowKey="channelName"
                  remoteValueKey="channelCode"
                  :placeholder="'请选择' + item.label"
                ></l-value-domain>

                <el-select
                  v-else
                  clearable
                  v-model="form[item.prop]"
                  :class="item.prop"
                  :placeholder="'请选择' + item.label"
                  style="width: 100%"
                >
                  <el-option
                    v-for="sItem in item.options"
                    :key="sItem.value"
                    :label="sItem.label"
                    :value="sItem.value"
                  ></el-option>
                </el-select>
              </template>
              <template v-if="item.type === 'time'">
                <el-date-picker
                  style="width: 100%"
                  v-model="form[item.prop]"
                  type="daterange"
                  range-separator="至"
                  :default-time="['00:00:00', '23:59:59']"
                  :start-placeholder="datePicker.startPlaceholder"
                  :end-placeholder="datePicker.endPlaceholder"
                ></el-date-picker>
              </template>
              <template v-if="item.type === 'input'">
                <el-input
                  @keyup.native.enter="search"
                  v-model="form[item.prop]"
                  :placeholder="placeholder"
                  style="width: 100%"
                >
                  <!--<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>-->
                  <el-button slot="append" @click="search">搜索</el-button>
                </el-input>
              </template>
            </el-form-item>
          </div>
          <el-form-item class="button-part" v-if="readcardState">
            <el-button type="primary" class="duka-button" @click="readCard">
              <i class="iconfont iconduka"></i>读卡
            </el-button>
            <div
              class="bottom-button"
              v-if="!hideBtn"
              style="text-align: justify;margin-top: 6px;line-height: 0;font-size: 0"
            >
              <el-button type="primary" plain class="reset-button button" @click="reset">重置</el-button>
              <el-button type="primary" class="check-btn button" @click="search">查询</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="bottom_Card_" :style="{'height':bottomHeight + 'px'}">
          <slot name="firstBottom"></slot>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="待办事项" name="second">
        <slot name="second"></slot>
      </el-tab-pane>
      <el-tab-pane label="个人备忘" name="third">
        <slot name="third"></slot>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import LRadio from "@/components/LSideRadio.vue";
import { mapActions, mapGetters } from "vuex";

const allHospitalState = [
  {
    code: 1,
    name: "本人",
    admissionStatus: 1
  },
  {
    code: 2,
    name: "本科",
    admissionStatus: 2
  },
  {
    code: 3,
    name: "转出",
    admissionStatus: 3
  },
  {
    code: 4,
    name: "预撤床",
    admissionStatus: 7
  }
];

const allIlnessStatus = [
  {
    code: 1,
    name: "新",
    illnessStatus: 1
  },
  {
    code: 2,
    name: "危",
    illnessStatus: 2
  },
  {
    code: 3,
    name: "重",
    illnessStatus: 3
  }
];

export default {
  name: "LLeftTabs",
  props: {
    mode: {
      type: String
    },
    formList: {
      type: Array
    },
    // label-type 的属性值是0 是 ['入院申请','待入院', '转科待入']
    // label-type 的属性值是1 值是['待入院', '转科待入']
    // label-type 的属性值是2 值是 新入院 在院 预撤床 撤床 默认是
    labelType: {
      type: String,
      default: "2"
    },
    hospState: {
      //住院状态栏
      type: Boolean,
      default: false
    },
    illnessState: {
      //住院状态栏
      type: Boolean,
      default: false
    },
    readcardState: {
      //读卡功能
      type: Boolean,
      default: true
    },
    value: {
      type: Object
    },
    searchPlaceholder: {
      type: String
    },
    //用户自定义 tabs 名称
    tabsName: {
      type: Array,
      default: function() {
        return [];
      }
    },
    hideBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      datePicker: {
        //datepicker 的 placeholder
        startPlaceholder: "预约开始日期",
        endPlaceholder: "预约结束日期"
      },
      //患者住索引 相关数据
      patientMaster: {
        show: false, // patientMaster 页面 专有
        reservation: "0" // checkbox
      },
      activeName: "first",
      form: {
        //表单的值
      },
      bottomHeight: 50,
      statesList: [],
      illnessStatusList: [],
      originParams: [
        {
          label: "院区",
          width: "100%",
          prop: "CourtyardArea", //form 表单中的字段
          type: "select", //显示的类型 目前可选select time input
          options: [
            {
              value: "0",
              label: "院区"
            },
            {
              value: "1",
              label: "病区"
            }
          ]
        },
        {
          label: "科室",
          width: this.formList.indexOf("illnessArea") > -1 ? "65%" : "100%", // 动态控制 科室 的宽度 如果有 病区 宽度是 65%
          prop: "technicalOffices",
          type: "select",
          options: [
            {
              value: "0",
              label: "内科"
            },
            {
              value: "1",
              label: "外科"
            },
            {
              value: "2",
              label: "神经科"
            }
          ]
        },
        {
          label: "病区", //病区
          width:
            this.formList.indexOf("technicalOffices") > -1 ? "35%" : "100%", // 动态控制 病区 的宽度 如果有 科室 宽度是 35%
          prop: "illnessArea",
          type: "select",
          options: [
            {
              value: "0",
              label: "内科"
            },
            {
              value: "1",
              label: "外科"
            },
            {
              value: "2",
              label: "神经科"
            }
          ]
        },
        {
          label: "诊区",
          prop: "diagnosisArea",
          type: "select",
          width: "calc(50% - 5px)",
          marginRight: "10px",
          options: [],
          params: { dataType: 1 }
        },
        {
          label: "诊室",
          prop: "diagnosisRoom",
          width: "calc(50% - 5px)",
          type: "select",
          options: [],
          params: { dataType: 3 }
        },
        {
          label: "患者类型",
          prop: "patientsType",
          type: "select",
          width: "50%",
          options: [
            {
              value: "0",
              label: "我的患者"
            },
            {
              value: "1",
              label: "本科患者"
            }
          ]
        },
        {
          label: "患者状态",
          prop: "patientsState",
          width: "50%",
          type: "select",
          options: [
            {
              value: "0",
              label: "全部"
            },
            {
              value: "1",
              label: "本科患者"
            },
            {
              value: "2",
              label: "转科患者"
            }
          ]
        },{
          label: "登记状态",
          prop: "isRegister",
          width: "100%",
          type: "select",
          options: [
            {
              value: "0",
              label: "全部"
            },
            {
              value: "1",
              label: "未登记"
            },
            {
              value: "2",
              label: "已登记"
            }
          ]
        },
        {
          label: "预约渠道",
          prop: "channelWay",
          type: "select",
          width: "100%",
          options: [
            {
              value: "0",
              label: "平安"
            },
            {
              value: "1",
              label: "微医"
            }
          ]
        },
        {
          label: "档案状态",
          prop: "recordStatus",
          type: "select",
          width: "100%"
        },
        {
          label: "类型",
          prop: "checkType",
          type: "select",
          width: "100%",
          options: [
            {
              value: "0",
              label: "检验"
            },
            {
              value: "1",
              label: "检查"
            }
          ]
        },
        {
          label: "状态",
          prop: "docState",
          type: "select",
          width: "100%",
          options: [
            {
              value: "0",
              label: "全部"
            },
            {
              value: "1",
              label: "未读"
            },
            {
              value: "2",
              label: "已读"
            },
            {
              value: "3",
              label: "已处理"
            }
          ]
        },
        {
          label: "时间",
          prop: "timeRange",
          type: "time"
        },
        {
          label: "搜索",
          prop: "search",
          type: "input"
        }
      ],
      formParams: [] //刷选的form 片段
    };
  },
  methods: {
    /*点击入院情况radio*/
    radioChange(data) {
      this.form.allHospState = data;
      this.search();
    },
    radioChange2(data) {
      this.form.illnessStatus = data;
      this.search();
    },
    calcHeight() {
      let sideTabs =
        this.$refs.sideTabs && this.$refs.sideTabs.$el.clientHeight;
      let formHeight = null;
      if (this.$refs.sideTabs) {
        //this.$refs.formReceipt 是否是数组
        if (Array.isArray(this.$refs.formReceipt)) {
          formHeight = this.$refs.formReceipt[0].$el.clientHeight;
        } else {
          formHeight = this.$refs.formReceipt.$el.clientHeight;
        }
      }
      let tabsHeaderHeight = 45;
      this.bottomHeight = sideTabs - formHeight - tabsHeaderHeight;
    },
    handleClick() {
      this.$emit("tabs-change", { activeName: this.activeName });
    },
    search() {
      //console.log('this.lRadioTextToKey():',this.lRadioTextToKey());
      this.$emit("query", this.lRadioTextToKey());
      //console.log('this.lRadioTextToKey()',this.lRadioTextToKey());
    },
    readCard() {
      let readCardForm = this.lRadioTextToKey();
      for (let key in readCardForm) {
        if (key !== "search") {
          //读卡 传递参数 只是 传递搜索框的值 如果在住院状态下
          readCardForm[key] = "";
        }
      }
      this.$emit("read-card", readCardForm);
    },
    reset() {
      for (let key in this.form) {
        if (key !== "hospState") {
          this.form[key] = "";
        } else {
          this.form[key] = this.defaultCode();
        }
      }
      // 重置表单之后搜索
      this.search();
    },
    // 将 form.hospState 四种状态 变成 1 2 3 4  key值
    lRadioTextToKey(oldForm) {
      oldForm = oldForm || this.form;
      this.modeFormHandle(); //处理 专有模式 页面
      /*if (oldForm.hospState === undefined) {//门诊 部分 不作处理
          return this.form;
        }*/
      let cloneForm = { ...oldForm };
      if (
        cloneForm.allHospState === undefined ||
        cloneForm.allHospState === ""
      ) {
        // 初始加载 没有 allHospState 的字段
        cloneForm.allHospState = this.statesList.find(item => {
          return item.code === Number(cloneForm.hospState);
        });
      }
      cloneForm = { ...cloneForm, ...cloneForm.allHospState };

      delete cloneForm.name;
      delete cloneForm.allHospState;
      delete cloneForm.hospState;
      return cloneForm;
    },
    //LRadio 组件 设置class
    radioWrapperCls() {
      return {
        radioWrapper: true,
        hideFirst: this.labelType === "1" //增加 hideFirst class
      };
    },
    //住院状态栏 默认的字段
    defaultCode() {
      let defaultCode =
        this.labelType === undefined || this.labelType === "2"
          ? allHospitalState[1].code
          : allHospitalStateOther[0].code;
      if (this.labelType === "1") {
        // labelType 为 1 时 默认选择 待入院
        defaultCode = allHospitalStateOther[1].code;
      } else if (this.labelType === "3") {
        defaultCode = zhHospitalState[0].code;
      }
      return defaultCode;
    },
    //专有页面 表单处理
    modeFormHandle() {
      if (this.mode === undefined) return;
      switch (this.mode) {
        case "patientMaster":
          this.form.reservation = this.patientMaster.reservation;
      }
    },
    //专有页面 字段处理
    modeState() {
      if (this.mode === undefined) return;
      switch (this.mode) {
        case "patientMaster":
          this.datePicker = {
            startPlaceholder: "创建开始日期",
            endPlaceholder: "创建结束日期"
          };
          this.patientMaster.show = true;
      }
    },
    //格式化日期
    getFormatDate(d) {
      d = d || new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      return year + "-" + month + "-" + day;
    }
  },
  watch: {
    form: {
      handler(n) {
        this.$emit("input", this.lRadioTextToKey());
      },
      deep: true
    },
    value: {
      handler(val) {
        // 传值 默认选中病区
        this.form.illnessArea = val.illnessArea;
        this.$store.commit()
      },
      deep: true
    },
    //重新搜索
    searchAgainKey: {
      handler(n) {
        // 重置表单
        if (String(n).indexOf("RESETFORM") > -1) {
          this.reset();
          this.$emit("input", this.lRadioTextToKey());
          return;
        }

        // 有更改查询条件的 需求 所以 需要 在n 中 做一些特殊字符处理，将查询条件带入
        // 更改表单 格式 时间戳 + CHANGEFORM?key=value
        if (String(n).indexOf("CHANGEFORM?") > -1) {
          let formObj = {};
          let urlString = n.substring(n.indexOf("?") + 1);
          let urlArray = urlString.split("&");
          for (let i = 0, len = urlArray.length; i < len; i++) {
            let urlItem = urlArray[i];
            let item = urlItem.split("=");
            this.form[item[0]] = item[1];
          }

          this.$emit("input", this.lRadioTextToKey());
        }

        this.search();
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters("user", ["role"]),
    ...mapGetters("base", ["searchAgainKey"]),
    placeholder() {
      return this.searchPlaceholder
        ? this.searchPlaceholder
        : this.hospState
        ? "住院号/床号/姓名"
        : "患者关键信息";
    },
    sideTabsCls() {
      return {
        height100: true,
        sideTabs: true,
        singleTabCls: this.tabsName.length === 1
      };
    },
    illnessAreaUrl() {
      let deptId = this.role.deptId;
      return "/bedInfo/getWardCount?deptId=" + deptId;
    }
  },
  components: {
    LRadio
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.calcHeight();
      }, 10);
    });
    if (this.hospState) {
      // 住院部分 自动触发查询
      this.search();
    }
    if (this.illnessState) {
      // 住院部分 自动触发查询
      this.search();
    }
  },
  update() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.calcHeight();
      }, 10);
    });
  },
  created() {
    let me = this;
    let parentSetFormValue = this.value || {};

    if (this.hospState) {
      //住院状态栏 默认选中在院 两种类型判断

      // 用户传递的值是code 直接用 hospState
      me.$set(
        me.form,
        "hospState",
        parentSetFormValue["hospState"] || this.defaultCode()
      );
    }

    this.formParams = this.originParams.filter(item => {
      if (this.formList.indexOf(item.prop) > -1) {
        if (item.prop === "patientsType" || item.prop === "patientsState") {
          me.$set(me.form, item.prop, parentSetFormValue[item.prop] || "0"); //如果 用户 传入 初始化用户传入值
        } else {
          me.$set(me.form, item.prop, parentSetFormValue[item.prop] || ""); //如果 用户 传入 初始化用户传入值
        }
        return true;
      } else {
        return false;
      }
    });

    this.modeState();

    this.$emit("input", this.lRadioTextToKey());
    /*zyw*/
    // let state,illnessStatus;
    if (this.labelType === undefined || this.labelType === "2") {
      this.statesList = allHospitalState;
      this.illnessStatusList = allIlnessStatus;
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  padding-top: 6px;

  .sideTabs {
    // 高度不可随意更改 影响 button-part 的高度计算
    /deep/ .el-tabs__header {
      padding: 0 10px;
      margin-bottom: 5px;
    }

    > /deep/ .el-tabs__content {
      height: calc(100% - 45px);
    }

    .receipt_form_ {
      //overflow: auto;
      //max-height: 290px;
      margin-top: 10px;
      //border-bottom: 1px solid #ccc;
      > .form-content {
        padding: 0 20px 5px;
        max-height: 235px;
        overflow: auto;
        overflow-x: hidden; // 避免下拉 出现横向滚动条
        > /deep/ .el-form-item {
          display: inline-block;
          padding: 3px 0;
          margin-bottom: 0; //覆盖默认的10px
          // 非正常 100% 的select 的百分比调整
          .el-select.illnessArea {
            padding-left: 5px;
          }

          .el-select.patientsType {
            padding-right: 2.5px;
          }

          .el-select.patientsState {
            padding-left: 2.5px;
          }

          .el-select.diagnosisArea {
            padding-right: 2.5px;
          }

          .el-select.diagnosisRoom {
            padding-left: 2.5px;
          }

          /deep/.el-date-editor .el-range__close-icon {
            position: unset;
          }
        }

        > .hos {
          padding-bottom: 5px;
          /*display: inline-block;*/
          padding-top: 5px;
          display: table-cell;
          width: 274px;
          text-align: center;
          .radioWrapper {
            display: inline-block !important;
          }

          .hideFirst {
            > /deep/.el-radio-group {
              /*font-size: 200px;*/
              /deep/.el-radio-button:first-child {
                display: none;
              }
            }
          }
          span {
            width: 42px;
            height: 30px;
            margin-right: 15px;
            font-size: 12px;
            display: inline-block;
          }

          /deep/ .el-radio-button {
            margin-right: 5px;
          }

          .l-radio-button {
            /deep/ .el-radio-button__inner {
              width: auto;
              background: rgba(246, 246, 246, 1);
              border-radius: 12px;
              line-height: 24px;
              padding: 0 12px;
            }

            /deep/
              .el-radio-button__orig-radio:checked
              + .el-radio-button__inner {
              background: rgba(255, 225, 213, 1);
              font-weight: bold;
              color: rgba(240, 90, 35, 1);
            }
          }
        }
        > .hosRev {
          text-align: left;
        }
      }

      // 底部 button 的样式
      > .button-part {
        width: 100%;
        padding: 0 20px 6px;

        .button {
          width: 116px;
          display: inline-block;
          margin: 0 !important;
        }

        .duka-button {
          width: 247px;
          float: unset !important;
        }

        .bottom-button:after {
          content: "";
          width: 100%;
          height: 0;
          display: inline-block;
        }
        > /deep/ .el-form-item__content {
          height: auto;
        }
      }
    }

    .bottom_Card_ {
      //height: calc(100% - 297px);
    }
  }

  //单个 tabs 样式 需要做成card title 的样式
  .singleTabCls {
    > /deep/ .el-tabs__header {
      margin-top: 8px !important;
      > .el-tabs__nav-wrap {
        > .el-tabs__nav-scroll {
          > .el-tabs__nav {
            &::before {
              content: "";
              float: left;
              width: 4px;
              height: 20px;
              background: $l-color-primary;
              margin-right: 10px;
              margin-top: 0px;
            }
            > .el-tabs__active-bar {
              display: none;
            }
            > .el-tabs__item.is-active {
              color: #2e323a !important;
              line-height: inherit !important;
              height: auto !important;
              cursor: default !important;
            }
          }
        }
      }
    }
  }
}
</style>
