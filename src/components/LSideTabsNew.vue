<template>
  <div class="sidebar height100 sidebarPadding">
    <l-sidebar-left>
      <template #top>
        <el-col :span="24" v-show="hiddenStyle1"
          ><el-button
            type="primary"
            @click="addnew"
            style="width: 100%; margin-bottom: 8px"
            >新建档案</el-button
          ></el-col
        >
        <el-col class="patientquery">
          <l-card-title>
            <template #left>就诊患者查询</template>
          </l-card-title>
        </el-col>

        <el-col :span="24" class="marginB">
          <div class="search-con">
            <l-formt-title>
              <el-input
                v-model="inputnum"
                placeholder="姓名/手机/身份证/患者编号"
                @keyup.enter.native="queryFun"
                @change="inputChange($event)"
                clearable
              >
              </el-input>
              <el-button
                plain
                type="primary"
                size="mini"
                shortbutton
                @click="readCard"
                v-show="hiddenStyle1"
                >读卡</el-button
              >
              <el-button
                plain
                type="primary"
                size="mini"
                shortbutton
                @click="queryFun"
                v-show="!hiddenStyle1"
                >查询</el-button
              >
            </l-formt-title>
            <div class="search-buttons">
              <el-button
                plain
                type="primary"
                v-show="hiddenStyle1"
                @click="queryFun"
                >查询</el-button
              >
              <el-button v-show="hiddenStyle1" @click="reset">重置</el-button>
            </div>
          </div>
        </el-col>
      </template>

      <template #bottom>
        <l-table
          :showTotal="true"
          :pageSize="pageParams.pageSize"
          :page="sizedata.pageNo"
          :total="totalData"
          :background="false"
          :paginationSmall="true"
          layout="prev,pager,next"
          paginationAlign="center"
          @changeSize="sizeChangePatientList"
        >
          <div class="patient-penetrate-container">
            <div class="patient-penetrate-box">
              <l-patient-info-item
                v-for="(item, index) in patientList"
                :key="'click' + index"
                :class="{
                  'l-c-penetrate': true,
                  'is-active': currentRowIndex === index,
                  'l-patient-info-item': true,
                }"
                @click.native="patientListFun(item, index)"
              >
                <template #top>
                  <span
                    class="nameStyle name-text fontSizeStyle patientNameStyle"
                    >{{
                      fontNumber(item.patientArchiveInfoVO.patientName)
                    }}</span
                  >
                  <!-- <span class="nameStyle fontSizeStyle">{{
                    item.patientArchiveInfoVO.patientGender == "1"
                      ? "男"
                      : item.patientArchiveInfoVO.patientGender == "2"
                      ? "女"
                      : "未知"
                  }}</span> -->
                  <span
                    class="nameStyle fontSizeStyle"
                    :val="item.patientArchiveInfoVO.patientGender"
                    code="GENDER_CODE"
                    v-codeTransform
                  ></span>
                  <span class="nameStyle fontSizeStyle" style="border: 0px">{{
                    item.patientArchiveInfoVO.patientAge
                  }}</span>
                </template>
                <template #bottom>
                  <span class="fontSize">证件号</span>
                  <span class="fontSize fontSizeStyle">
                    {{ item.patientArchiveInfoVO.identificationNum }}
                  </span>
                </template>
              </l-patient-info-item>
            </div>
          </div>
        </l-table>
      </template>
    </l-sidebar-left>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import LRadio from "@/components/LSideRadio.vue";
import { getPatientArchInfo } from "@/api/filingAndChange/arch";
import readCardMixin from "@/mixins/readCard.js";
export default {
  name: "LSideTabsNew",
  mixins: [readCardMixin],
  props: {
    hiddenStyle: {
      type: Boolean,
      default: false
    },
    // 隐藏搜索框的ICON
    hideIcon: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String
    },
    formList: {
      type: Array
    },

    labelType: {
      type: String,
      default: "2"
    },
    hospState: {
      //住院状态栏
      type: Boolean,
      default: false
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
    },
    returnCharge: {
      type: Boolean,
      default: false
    },
    // 门急诊-结算-收费：如果vuex中有患者信息则自动带入患者卡号(目前只是收费页面传入患者卡号，搜索功能收费页面实现)
    cardNum: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 新添加字段
      currentRowIndex: "",
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 200
      },
      // 判断按钮显示隐藏
      hiddenStyle1: true,
      activeNames: ["1"],
      // 判断是否读卡
      cardReading: "1",
      // 判断点击当前的改变的背景
      activebg: "",
      // 是否显示基本信息

      // 患者基本信息显示隐藏
      headImg: require("@/assets/pojehjdz.jpeg"),
      showStyle: false,
      showStyle1: false,
      showStyle2: false,
      activeName: "first",
      inputnum: "",
      activeName1: "first",
      tableNum: "1",
      patientList: [],
      patientListData: {
        patientArchiveInfoVO: {
          patientName: "",
          patientGender: "",
          age: "",
          birthDate: "",
          identificationNum: "",
          mobileNum: ""
        },
        patientEmpiInfoAddrssVO: {
          currentProvinceName: "",
          currentCityName: "",
          currentRegionName: "",
          currentDetail: ""
        }
      },
      // 分页
      sizedata: {
        pageNo: 1,
        pageSize: 10
      },
      totalData: 0,
      // 新添加字段
      bottomHeight: 50,
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.getPatientArchInfo(this.sizedata);
    this.hiddenStyle1 = this.hiddenStyle;
  },
  methods: {
    ...mapActions({
      seteHrData: "ehr/seteHrData"
    }),
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.inputnum = obj.patientCode;
      this.getPatientArchInfo({
        pageNo: 1,
        pageSize: 10,
        patientId: obj.patientId,
        patientCode: obj.patientCode
      });
    },
    // 截取 字符串
    //多余显示省略号
    fontNumber(date) {
      const length = date.length;
      if (length > 5) {
        var str = "";
        str = date.substring(0, 5) + "...";
        return str;
      } else {
        return date;
      }
    },
    reset() {
      this.inputnum = "";
    },
    // 列表分页
    sizeChangePatientList(a) {
      this.sizedata.pageNo = a.page;
      let sizedata = {
        pageNo: this.sizedata.pageNo,
        pageSize: this.pageParams.pageSize,
        condition: this.inputnum
      };
      this.getPatientArchInfo(sizedata);
      this.$emit("patientListFun", "empty", true);
    },
    //element组件input无法输入问题
    inputChange(e) {
      this.$forceUpdate();
    },
    // 新建档案
    addnew() {
      this.$emit("addnew", this.inputnum, this.cardReading);
      this.currentRowIndex = "";
    },
    // 查询
    queryFun() {
      this.patientList = [];
      this.cardReading = "1";
      this.sizedata.pageNo = 1;
      let condition = this.inputnum ? this.inputnum.replace(/\s*/g,"") : "";
      this.sizedata.condition = condition;
      this.getPatientArchInfo(this.sizedata);
    },
    // 点击获取
    patientListFun(item, a) {
      this.currentRowIndex = a;
      // index赋值给
      this.activebg = a;
      // 判断是否有基本信息
      this.$emit("patientListFun", item, true);
      this.seteHrData(item);
      if (item.patientArchiveInfoVO) {
        this.patientListData.patientArchiveInfoVO = item.patientArchiveInfoVO;
        if (item.patientEmpiInfoAddrssVO) {
          this.patientListData.patientEmpiInfoAddrssVO =
            item.patientEmpiInfoAddrssVO;
        }
        this.showStyle = true;
      } else {
        this.showStyle = false;
      }
    },
    // 获取患者列表
    async getPatientArchInfo(obj) {
      try {
        let res = await getPatientArchInfo(obj);
        this.patientList = res.data;
        this.totalData = res.total;

        if (this.patientList.length > 0) {
          this.$nextTick(() => {
            document.getElementsByClassName("l-patient-info-item")[0].click();
          });

          if (this.sizedata.pageNo == 1) {
            this.seteHrData(res.data[0]);
          }
          for (let i = 0; i < this.patientList.length; i++) {
            let cardNumber = "";
            for (let j = 0; j < this.patientList[i].archCardList.length; j++) {
              cardNumber += this.patientList[i].archCardList[j].cardData + ",";
            }
            this.patientList[i].patientArchiveInfoVO.cardNumber = cardNumber;
          }
          this.currentRowIndex = "";
          this.$emit("patientListFun", "empty", true);
        }
        if (res.data[0].patientArchiveInfoVO) {
          if (this.sizedata.pageNo == 1) {
            this.patientListData.patientArchiveInfoVO =
              res.data[0].patientArchiveInfoVO;
            if (res.data[0].patientEmpiInfoAddrssVO) {
              this.patientListData.patientEmpiInfoAddrssVO =
                res.data[0].patientEmpiInfoAddrssVO;
            }
          }
          this.showStyle = true;
        } else {
          this.showStyle = false;
        }
      } catch (error) {}
    },
    tableTopFun(a) {
      this.tableNum = a;
    },
    // 新组件js
    calcHeight() {
      let sideTabs =
        this.$refs.sideTabs && this.$refs.sideTabs.$el.clientHeight;
      let formHeight = null;
      if (this.$refs.sideTabs) {
        if (Array.isArray(this.$refs.formReceipt)) {
          formHeight = this.$refs.formReceipt[0].$el.clientHeight;
        } else {
          formHeight = this.$refs.formReceipt.$el.clientHeight;
        }
      }
      let tabsHeaderHeight = 45;
      this.bottomHeight = sideTabs - formHeight - tabsHeaderHeight;
    },
    search() {
      this.$emit("query", this.lRadioTextToKey());
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
    hiddenStyle: function() {
      this.hiddenStyle1 = this.hiddenStyle;
    }
  },
  computed: {
    ...mapGetters("user", ["role"]),
    ...mapGetters("base", ["searchAgainKey"]),
    sideTabsCls() {
      return {
        height100: true,
        sideTabs: true,
        singleTabCls: this.tabsName.length === 1
      };
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
  },
  update() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.calcHeight();
      }, 10);
    });
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  .box-wrap {
    padding: 0px 10px;
  }
  .patientquery {
    padding: 8px 0px;
  }
  .marginB {
    margin-bottom: 9px;
  }
  .is-active .nameStyle {
    color: #ffffff;
  }
  .sidebarPadding {
    padding: 8px;
    box-sizing: border-box;
  }
  padding-top: 6px;
  .search-con {
    /deep/ .el-input {
      width: calc(100% - 50px) !important;
    }

    /deep/ input::-webkit-input-placeholder {
      /* placeholder颜色 */
      color: #aab2bd;
      /* placeholder字体大小 */
      font-size: 12px;
    }
    /deep/ .el-button--mini {
      margin-left: $l-margin-default-1;
    }
    .search-buttons {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      /deep/ button {
        width: calc(50% - 4px);
      }
    }
  }
  .btnStyle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .LSideList {
    background-color: #ffffff;
    height: 100%;
  }
  .marginTop {
    // margin-top: 15px;
  }

  .marginTop1 {
    margin-top: 8px;
  }

  .jiban-img {
    width: 45px;
    height: 45px;
    background: rgba(241, 244, 246, 1);
    border-radius: 2px;
  }

  .jiban-text {
    font-size: 16px;
    font-weight: bold;
    color: rgba(46, 50, 58, 1);
    line-height: 24px;
  }

  .jiban-text1 {
    font-size: 14px;
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    line-height: 18px;
  }

  .jiban-left {
    font-size: 14px;
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 20px;
  }

  .jiban-right {
    font-size: 14px;
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    line-height: 20px;
  }

  .el-button {
    padding: 5px 13px;
  }

  // 有档案
  .withFiles {
    padding-bottom: 20px;
    height: calc(100% - 50px) !important;
  }
  .withFiles-style {
    height: calc(100% - 107px);
  }
  .withFiles-style34 {
    height: calc(100% - 34px);
  }
  .withFiles-icon {
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 30px;
    color: rgba(44, 69, 131, 1);
    background: rgba(242, 245, 247, 1);
    border-radius: 12px;
  }

  .numText {
    font-size: 20px;
    font-weight: bold;
    color: rgba(46, 50, 58, 1);
    line-height: 25px;
  }

  .numTop {
    font-size: 12px;
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    line-height: 17px;
  }

  .collapseStyle-color {
    font-size: 12px;
    font-weight: 400;
    color: rgba(61, 125, 251, 1);
    line-height: 17px;
  }

  .collapseStyle-text {
    font-size: 12px;
    font-weight: 500;
    color: rgba(44, 69, 131, 1);
    line-height: 17px;
  }

  .collapseStyle {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /deep/ .el-collapse-item__header {
    background-color: transparent;
  }

  .table-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
  }

  .tableTop-list {
    width: 50%;
    height: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 24px;
  }

  .tableTop-lista {
    font-size: 16px;
    font-weight: bold;
    color: rgba(43, 69, 130, 1);
    line-height: 24px;
    border-bottom: 1px solid #2b4582;
  }

  .infinite-list-item {
    margin-bottom: 10px;
    overflow: auto;
    width: 90%;
  }
  .infinite-list {
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none;
    /*火狐下隐藏滚动条*/
    overflow: -moz-scrollbars-none;
  }
  //谷歌适用
  ::-webkit-scrollbar {
    display: none;
  }
  .listItem-top-stylew {
    width: 100%;
  }
  .listItem-top-stylew .listItem {
    border-radius: 4px 0px 0px 4px;
  }
  .listItem {
    width: 100%;
    height: auto;
    background: #f1f4f6;
    border-radius: 4px;
    box-sizing: border-box;
    // padding: 15px;
    cursor: pointer;
    overflow: auto;
    border: 1px solid #f1f4f6;
    position: relative;
  }
  .listItem:hover {
    border-color: #2b4583;
  }
  .marginStyle {
    padding: 5px 8px;
    width: 100%;
    height: 24px;
    background-color: #ffffff;
  }

  .listItem-top {
    padding: 5px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
  }
  .listItem-top-style {
    background-color: #2b4583;
  }
  .listItem-top-style .fontSizeStyle {
    color: #ffffff;
  }
  .name-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .name-text {
    height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(46, 50, 58, 1);
    line-height: 20px;
  }

  .border-r {
    height: 16px;
    border-radius: 3px;
    // border: 1px solid rgba(43, 69, 130, 1);
    margin-left: 5px;
    font-size: 12px;
    font-weight: 400;
    // color: rgba(43, 69, 130, 1);
    line-height: 15px;
  }

  .name-text-r {
    font-size: 14px;
    color: rgba(46, 50, 58, 1);
    line-height: 18px;
  }

  .fontSize {
    text-align: left;
    color: #949da3;
    font-size: 10px;
  }
  .fontSizeStyle {
    overflow: hidden; /*设置超出的部分进行影藏*/
    text-overflow: ellipsis; /*设置超出部分使用省略号*/
    white-space: nowrap;
    text-align: left;
    color: #666c70;
    font-size: 12px;
  }
  .patientNameStyle {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    color: #2e323a;
    font-size: 14px;
  }
  .cancellation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .cancellationStyle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .imgStyle2 {
    width: 56px;
    height: 56px;
    background: rgba(235, 238, 240, 1);
    border-radius: 28px;
  }

  .nameTextstyle {
    font-size: 17px;
    font-weight: 500;
    color: rgba(46, 50, 58, 1);
    line-height: 25px;
  }

  .nameTextstyle1 {
    font-size: 14px;
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    line-height: 20px;
  }

  .nameTextstyle2 {
    height: 160px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 20px;
  }
  /deep/ .el-tabs__item {
    width: 50%;
    text-align: center;
  }
  /deep/ .el-tabs__nav {
    width: 100%;
  }
  .basicWrap /deep/ .el-collapse-item__header {
    line-height: 0px;
    padding-top: 8px;
    padding-bottom: 8px;
    min-height: 65px;
    height: auto;
  }
  .basicWrap /deep/ .el-collapse-item__content {
    padding: 8px 5px;
  }
}
</style>
