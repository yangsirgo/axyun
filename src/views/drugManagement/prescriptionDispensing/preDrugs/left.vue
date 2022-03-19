<template>
  <el-card class="height100 stock" element-loading-text="发药中...">
    <div class="height100 flex-box">
      <el-row style="padding: 8px 8px 0">
        <el-col :span="24">
          <l-formt-title :required="true" label="窗口">
            <el-select
              v-model="windowCode"
              @change="windcode"
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
      </el-row>
      <el-row style="border-bottom: 1px solid #e4e4e4; padding: 2px 8px 8px">
        <el-col :span="24">
          <l-formt-title label="配药人" labelWidth="50">
            <el-select
              v-model="dispenseUserId"
              @change="UserIdchange"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="item.uid"
                :label="item.uname"
                :value="item.uid"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="24" style="margin-top: 2px">
          <l-formt-title label="发药状态" labelWidth="50">
            <el-select v-model="status" placeholder="请选择" clearable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>
      <div class="table-top" style="padding: 8px">
        <el-switch
          style="margin-bottom: 8px"
          v-model="autoMedicine"
          active-text="自动发药"
          @change="changeAutoM"
        ></el-switch>
        <el-row style="height: 26px">
          <el-radio-group
            v-model="searchType"
            @change="radioChange"
            style="width: 100%"
          >
            <el-col :span="6">
              <el-radio label="3">处方号</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio label="1">读卡</el-radio>
            </el-col>
            <el-col :span="6">
              <el-radio label="2">收据号</el-radio>
            </el-col>
            <el-col :span="7">
              <el-radio label="0">收费日期</el-radio>
            </el-col>
          </el-radio-group>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-date-picker
              @change="changedate"
              v-model="date"
              v-show="dateShow"
              style="width: 100%"
              type="daterange"
              value-format="yyyy-MM-dd"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
            ></el-date-picker>
            <el-input
              ref="queryValue"
              v-model="queryValue"
              v-show="inputShow"
              @keyup.native.enter="search"
              :class="{ cardInput: searchType === '1' }"
            ></el-input>

            <el-button
              style="width: 38%"
              type="primary"
              class="ic"
              v-show="icShow"
              @click="search(3)"
            >
              <i class="iconfont iconduka"></i> 读卡
            </el-button>
          </el-col>
        </el-row>

        <el-row class="search-btn" style="margin-top: 10px" :gutter="8">
          <!-- <el-col :span="9">
          <el-button @click="search(2)" type="primary" plain
            >往日处方查询</el-button
          >
        </el-col>
        <el-col :span="9">
          <el-button @click="search(1)" type="primary" plain
            >本日处方查询</el-button
          >
          </el-col>-->
          <el-col :span="24" class="search-btn-box">
            <el-button @click="search" type="primary">查询</el-button>
            <el-button
              @click="DispensingMedicine"
              type="primary"
              :disabled="recipeTable.length === 0"
            >
              一键发药
            </el-button>
            <el-button plain @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <!--排序-->
      <div class="sort-container">
        <l-sort-label
          class="inline-block"
          label="发药状态"
          state="2"
          @click="listsort('delivery_state')"
        ></l-sort-label>
        <l-sort-label
          class="inline-block"
          label="收费时间"
          state="2"
          @click="listsort('charge_time')"
        ></l-sort-label>
      </div>
      <!--列表-->
      <div class="infinite-list-wrapper" v-loading="tlm_isLoading">
        <div
          class="list-container overflow-scroll-vertical"
          v-infinite-scroll="loadNextPage"
          :infinite-scroll-disabled="listDisabled"
        >
          <div
            :class="curSelectedIndex === i ? 'list-item active' : 'list-item'"
            v-for="(item, i) in recipeTable"
            :key="i"
            @click="handleSelectedItem(i, item)"
          >
            <div class="item-label">
              <span class="rep">{{ item.recipeCode }}</span>
              <div class="rep-status">
                <span v-if="item.deliveryState == '0'">未发药</span>
                <span v-if="item.deliveryState == '1'">已发药</span>
              </div>
            </div>
            <div class="item-label">
              <span
                class="rep-name label margin-right-6"
                :title="item.patientName"
                >{{ item.patientName }}</span
              >
              <span
                class="rep-gender label margin-right-6"
                :val="item.patientGender"
                code="GENDER_CODE"
                v-codeTransform
              ></span>
              <span class="rep-charge label"
                >收费时间：{{ item.chargeTimeShow }}</span
              >
            </div>
          </div>
          <p v-if="!tlm_isLoading && noMore" class="load-list-bottom">
            {{ $t("base.noMore") }}
          </p>
        </div>
      </div>
    </div>
    <!-- <div
      class="shadow-module"
      v-if="!this.windowCode"
      @click="windowCodeValid"
    ></div>-->
    <!-- 低储 弹窗 -->
    <l-dialog
      :visible.sync="drugVisible"
      title="发药药品低储提醒"
      width="1000px"
      :customBottom="true"
    >
      <template #content>
        <el-form
          v-if="drugVisible"
          label-position="top"
          inline
          class="padding20"
        >
          <el-table
            id="diag-table"
            ref="diagTable"
            :data="searchTable"
            border
            stripe
            width="100%"
            v-loading="d_isLoading"
            element-loading-text="列表正在加载中"
            height="300"
          >
            <el-table-column
              prop="cwTypeName"
              label="药品类型"
            ></el-table-column>
            <el-table-column
              prop="drugName"
              label="药品名称"
              width="213"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="spec"
              label="药品规格"
            ></el-table-column>
            <el-table-column
              prop="originName"
              label="药品厂家"
              width="213"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="formName"
              label="药品剂型"
            ></el-table-column>
            <el-table-column
              prop="drugUnitName"
              label="包装单位"
            ></el-table-column>
            <el-table-column
              label="药品售价"
              prop="price"
              width="120"
            >
              <template slot-scope="scope">
                <span>{{formatNum(scope.row.price)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="低储值"
              prop="minStockDisplay"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="药品库存"
              prop="drugStockDisplay"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="生产厂商标识"
              prop="originIdentificationName"
              width="160"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="管理类型"
              prop="manageTypeName"
              width="120"
            ></el-table-column>
            <el-table-column
              label="基药类型"
              prop="basicType"
              width="120"
            >
              <template  slot-scope="scope">
                        <span
                          :val="scope.row.basicType"
                          code="BasicDrugType"
                          v-codeTransform
                        ></span>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </template>
      <span slot="footerContent">
        <template >
          <el-button class="footer-btn" type="primary" @click="exportExcel"
          >导出</el-button
          >
          <el-button class="footer-btn" type="primary" @click="drugVisible = false"
          >取消</el-button
          >
        </template>
      </span>
    </l-dialog>
  </el-card>
</template>
<script>
import store from "@/store";
import formatNum from "@/utils/formatPrice.js";
import opha from "@/api/hmm/opha";
import base from "@/api/hmm/base";
import mixin from "@/mixins/drugManagement.js";
import { saveWindowCode, getWindowCode } from "@/utils/drugManagement.js";
import { mapGetters } from "vuex";
import listSort from "@/mixins/drugLeftChange.js";
import drugReadCard from "@/mixins/drugReadCard.js";

export default {
  mixins: [mixin, listSort, drugReadCard],
  props: {
    searchCBData: {
      type: Number
    },
    refreshIndex: {
      type: String
    }
  },

  data() {
    return {
      ids:'',
      drugVisible:false,
      d_isLoading:false,
      searchTable:[],
      statusList: [
        {
          id: "0",
          name: "未发药"
        },
        {
          id: "1",
          name: "已发药"
        }
      ],
      status: "0",
      maxHeight: "", // 计算表格最大高度
      searchType: "3", // 查询条件类型
      dispenseUserId: "",
      uname: "",
      userList: [], //配药人数据源
      windowCode: "",
      windowtext: {}, //当前窗口信息
      date: [],
      queryValue: "",
      dateShow: false,
      inputShow: true,
      icShow: false,
      deliveryState: "",
      pharWindowList: [],
      recipeForm: {},
      pageNo: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      tlm_noMore: false,
      tlm_isLoading: false,
      recipeTable: [],
      recipeUnit: [], //单页表格数据
      select: {
        selectId: "",
        windowCode: "",
        uname: "",
        dispenseUserId: ""
      },
      orderBy: "delivery_state, charge_time desc",
      curVal: null,
      // 锁定处方，是否允许切换处方
      lockLeftList: false,
      searchParams: {},
      curSelectedIndex: null,
      autoMedicine: false,
      // 读卡返回的数据
      readCardData: {},
      // 一键发药 错误列表
      errorList: [],
      pageLoading: false
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
    totalAll() {
      return Math.ceil(this.total / this.pageSize) <= this.pageNo;
    },
    listDisabled() {
      return this.tlm_isLoading || this.noMore;
    },
    noMore() {
      return Math.ceil(this.total / this.pageSize) <= this.pageNo;
    }
  },
  created() {
    let autoM = localStorage.getItem("autoMedicine");
    if (autoM) {
      this.autoMedicine = JSON.parse(autoM)[this.role.roleId] || false;
    }
  },
  mounted() {
    this.listForDropDown();
    this.getuserList();
    this.$nextTick(() => {
      this.$refs.queryValue && this.$refs.queryValue.focus();
    });
  },
  methods: {
    formatNum(num, decleng) {
      return formatNum(num, decleng);
    },
    async exportExcel() {
      try {
        let param = {
          name:'',
          compareToStock:'min',
          ids:this.ids,
        };

        let res = await base
          .exportStockExcel(param);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName("stock")[0];
          var a = document.createElement('a');
          a.setAttribute("id","billHref");
          a.download = '低储报表.xls';
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
        }
      } catch (error) {}
    },
    loadTable(ids) {
      this.d_isLoading = true;
      let params = {
        //...this.searchData,
        ids:ids,
        pageNo: '1',
        pageSize: '20000',
        currDrugStorage:'1'
      };
      base
        .getStockMaxMINForPage(params)
        .then(res => {
          if (res.code === 1) {
            this.drugVisible = true;
            this.searchTable = res.data
          }
          this.d_isLoading = false;
        })
        .catch(err => {
          this.d_isLoading = false;
        });
    },
    async getListData() {
      try {
        let param = {
          orderBy: this.orderBy,
          deliveryState: this.status,
          currDrugStorage: "1",
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          dispendingMethod: "1"
        };
        let response = await opha.list(param);
        console.log(`response-----------`, response.data);
        if (response.code === 1) {
          const list = response.data.map(item => {
            const date = item.chargeTime.split(" ");
            const time = date[1].substring(0, date[1].length - 3);
            return {
              ...item,
              chargeTimeShow: date[0] + " " + time
            };
          });
          this.recipeTable = list;
        }
        this.tlm_isLoading = false;
      } catch (error) {
        console.log(error);
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    DispensingMedicine() {
      this.$showLoading();
      let param = {
        dispenseUserId: this.select.dispenseUserId,
        dispenseUserName: this.select.uname,
        deliveryWindowCode: this.windowCode
      };
      setTimeout(() => {
        opha
          .batchDelivery(param)
          .then(res => {
            if (res.data.warn && res.data.warn.length > 0) {
              if(res.data.err){
                let html = "";
                res.data.err.forEach(el => {
                  html += `<div style='padding-bottom:5px;'>${el}</div>`;
                });

                this.$message({
                  type: "error",
                  dangerouslyUseHTMLString: true,
                  message: html
                })
              }
              let ids = res.data.warn.join(",")
              this.ids = res.data.warn.join(",")
              this.loadTable(ids)
            }else if(res.data.err){

                let html = "";
                res.data.err.forEach(el => {
                  html += `<div style='padding-bottom:5px;'>${el}</div>`;
                });

                this.$message({
                  type: "error",
                  dangerouslyUseHTMLString: true,
                  message: html
                })
              }else{
                this.$message.success('一键发药成功！')
                return
              }


           /* let html = "";
            res.data.forEach(el => {
              html += `<div style='padding-bottom:5px;'>${el}</div>`;
            });
            this.$message({
              type: "error",
              dangerouslyUseHTMLString: true,
              message: html
            });*/
          })
          .catch(err => {
            console.log(`err---`, err);
          })
          .finally(() => {
            this.$hideLoading();
            this.getListData();
          });
      }, 1000);

      return;
    },
    deliveryFun(i, tempList) {
      let param = {
        dispenseUserId: this.select.dispenseUserId,
        dispenseUserName: this.select.uname,
        deliveryWindowCode: this.windowCode
      };
      if (i === tempList.length - 1) {
        this.getListData();
        return;
      }
      i++;
      const temp = tempList[i];
      console.log(`temp`, temp);
      opha
        .delivery(temp.id, param)
        .then(res => {
          console.log(`res`, res);
          this.deliveryFun(i, tempList);
        })
        .catch(err => {
          this.errorList.push(temp.id);
          this.deliveryFun(i, tempList);
        });
      // .finally(() => {
      //   if (i === tempList.length) {
      //     this.getListData();
      //   }
      // });
    },
    changeAutoM(val) {
      if (this.autoMedicine) {
        this.curSelectedIndex = null;
      }
      localStorage.setItem(
        "autoMedicine",
        JSON.stringify({
          [this.role.roleId]: val
        })
      );
    },
    async listForDropDown() {
      this.pharWindowList = await base.pharWindowForDropDown({});
      const wCode = getWindowCode();
      if (wCode && wCode[this.role.roleId]) {
        this.windowCode = wCode[this.role.roleId];
      } else {
        this.windowCode = this.pharWindowList[0]
          ? this.pharWindowList[0].code
          : "";
        saveWindowCode({
          [this.role.roleId]: this.windowCode
        });
      }
      this.search(0);
    },
    radioChange(val) {
      this.queryValue = "";
      if (val === "0") {
        this.dateShow = true;
        this.inputShow = false;
        this.icShow = false;
      } else if (val === "1") {
        this.dateShow = false;
        this.inputShow = true;
        this.icShow = true;
      } else {
        this.dateShow = false;
        this.inputShow = true;
        this.icShow = false;
      }
      if (val !== "0") {
        this.$refs.queryValue.focus();
      }
    },
    unlockLeftList() {
      this.lockLeftList = false;
      this.curSelectedIndex = null;
    },
    search(val) {
      console.log(`val`, val);
      this.curSelectedIndex = null;
      if (this.lockLeftList) {
        this.$message.warning("请先确定发药或者取消发药");
        return;
      }
      if (val !== "old") {
        this.curVal = val;
      }
      this.pageNo = 1;
      this.total = 0;
      if (this.curVal === 3) {
        this.CardReaderFetchData();
        return;
      }
      this.fetchData(this.curVal);
    },
    changedate(date) {
      this.search();
      if (date == null) {
        this.date = [];
      }
    },
    getNowFormatDate(flag) {
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
      let str = flag ? " 00:00:00" : " 23:59:59";
      return currentdate + str;
    },
    // eslint-disable-next-line complexity
    async fetchData(val) {
      console.log(`val---`, val);
      try {
        this.tlm_isLoading = true;
        let param = {
          orderBy: this.orderBy,
          deliveryState: this.status,
          currDrugStorage: "1",
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          dispendingMethod: "1"
        };
        if (this.searchType === "3") {
          param.recipeCode = this.queryValue;
        } else if (this.searchType === "2") {
          param.receiptNum = this.queryValue;
        } else if (this.searchType === "1") {
          this.CardReaderFetchData();
          return;
        } else if (this.searchType === "0") {
          param.sChargeDate =
            this.date && this.date[0] ? this.date[0] + " 00:00:00" : "";
          param.eChargeDate =
            this.date && this.date[1] ? this.date[1] + " 23:59:59" : "";
        }
        let paramsObj = {
          1: {
            sChargeDate: this.getNowFormatDate(true),
            eChargeDate: this.getNowFormatDate(false)
          },
          2: {
            eChargeDate: this.getNowFormatDate(true)
          }
        };
        if (typeof val === "number") {
          param = {
            ...param,
            ...paramsObj[val]
          };
        }
        let response = await opha.list(param);
        if (response.code === 1) {
          this.setTableData(response);
        }
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
      }
    },
    async CardReaderFetchData() {
      try {
        let param = {
          orderBy: this.orderBy,
          deliveryState: this.status,
          currDrugStorage: "1",
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          dispendingMethod: "1"
        };
        await this.readCard(async res => {
          console.log(`res-----------`, res);
          if (!res.cardNum) {
            return;
          }
          param.patientCode = res.patientCode;
          this.queryValue = res.cardNum;

          let paramsObj = {
            1: {
              sChargeDate: this.getNowFormatDate(true),
              eChargeDate: this.getNowFormatDate(false)
            },
            2: {
              eChargeDate: this.getNowFormatDate(true)
            }
          };
          if (typeof val === "number") {
            param = {
              ...param,
              ...paramsObj[val]
            };
          }
          let response = await opha.list(param);
          console.log(`response-----------`, response);
          if (response.code === 1) {
            this.setTableData(response);
          }
          this.tlm_isLoading = false;
        });
      } catch (error) {
        console.log(error);
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageNo++;
      this.fetchData();
    },
    setTableData(response) {
      this.total = response.total;
      const list = response.data.map(item => {
        const date = item.chargeTime.split(" ");
        const time = date[1].substring(0, date[1].length - 3);
        return {
          ...item,
          chargeTimeShow: date[0] + " " + time
        };
      });
      if (this.pageNo === 1) {
        this.recipeTable = list;
        // 如果是按处方号搜索直接默认选中
        if (
          this.recipeTable.length &&
          this.searchType === "3" &&
          this.queryValue
        ) {
          this.findDetail(this.recipeTable[0], 0);
        }
      } else {
        this.recipeTable = this.recipeTable.concat(list);
      }
    },
    findDetail(row, index) {
      // if(this.refreshIndex == "0"){
      // this.curSelectedIndex = null;
      // }else{
      this.curSelectedIndex = index;
      // }

      this.handleCurrentChange(row);
      this.curTableItem = row;
      this.changeCurDrug(row);
      this.select.selectId = row && row.id ? row.id : "";
      this.select.windowCode = this.windowCode;
      // 是否自动发药
      this.select.autoSendDrug = this.autoMedicine && row.deliveryState === "0";
      this.$emit("selectIdChange", this.select, row);
    },
    handleSelectedItem(index, row) {
      this.findDetail(row, index);
      /* if (this.lockLeftList) {
          this.$message.warning("请先确定发药或者取消发药");
        } else if (row.deliveryState === "0") {
          this.lockLeftList = true;
          this.findDetail(row, index);
        } else {
          this.findDetail(row, index);
        } */
    },
    async windcode(val) {
      saveWindowCode({
        [this.role.roleId]: val
      });
      this.$showLoading();
      let result = await base.pharpharWindowtype(val);
      this.$hideLoading();
      this.windowtext = result.data;
      this.select.isPause = this.windowtext.isPause;
      this.select.windowCode = val;
      this.setCookie();
      this.$emit("selectIdChange", this.select);
    },
    //设置cookie
    setCookie(windowCode, dispenseUserId, uname, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "windowCode=" +
        this.windowCode +
        ";path=/;expires=" +
        exdate.toGMTString();

      window.document.cookie =
        "dispenseUserId=" +
        this.dispenseUserId +
        ";path=/;expires=" +
        exdate.toGMTString();

      window.document.cookie =
        "uname=" + this.uname + ";path=/;expires=" + exdate.toGMTString();
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
            this.select.windowCode = this.windowCode;
          } else if (arr2[0] == "dispenseUserId") {
            this.dispenseUserId = arr2[1];
            this.select.dispenseUserId = this.dispenseUserId;
          } else if (arr2[0] == "uname") {
            this.uname = arr2[1];
            this.select.uname = this.uname;
          }
        }
      }
    },
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
    async UserIdchange() {
      this.userList.map((item, index) => {
        if (this.dispenseUserId === item.uid) {
          this.uname = item.uname;
        }
      });
      this.select.uname = this.uname;
      this.select.dispenseUserId = this.dispenseUserId;
      this.setCookie();
      this.$emit("selectIdChange", this.select);
    },
    async cancelDelivery() {
      try {
        this.$showLoading();
        if (!this.recipeForm.id) {
          this.$message.error("id不能为空");
          this.$hideLoading();
          return;
        }
        let { data } = await opha.cancelDelivery(this.recipeForm.id);
        this.$message.success(data);
        this.search(0);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async delivery() {
      try {
        this.$showLoading();
        if (!this.recipeForm.id) {
          this.$message.error("id不能为空");
          this.$hideLoading();
          return;
        }
        let { data } = await opha.delivery(this.recipeForm.id);
        this.$message.success(data);
        this.search(0);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    // 排序
    sortChange({ column, prop, order }) {
      if (this.lockLeftList) {
        return;
      }
      let ord = order || "ascending";
      let obj = {
        deliveryState: "delivery_state",
        chargeTime: "charge_time",
        ascending: "",
        descending: " desc"
      };
      this.pageNo = 1;
      this.orderBy = obj[prop] + obj[ord];
      this.fetchData();
    },
    windowCodeValid() {
      this.$message.warning("请选择窗口");
    },
    reset() {
      this.date = [];
      this.queryValue = "";
    }
  }
};
</script>
<style scoped lang="scss">
.el-card {
  position: relative;

  /deep/.el-table__empty-block{
    overflow-y: auto;
  }
  .table-top {
    width: 100%;
    /*height: 110px;*/

    .cardInput {
      width: 60%;
    }

    .deliveryState {
      margin-left: 3px;
    }

    .ic {
      background-color: $l-color-fontcolor-1;
      border-color: $l-color-fontcolor-1;
    }

    .search-btn {
      .el-button {
        width: 100%;
      }

      .width150 {
        width: 159px;
        padding-right: 9px;

        .el-button {
          color: $l-color-primary;
          border-color: $l-color-primary;
        }
      }

      .width80 {
        width: 80px;
      }
    }
  }

  .table-page {
    position: absolute;
    top: 270px;
    bottom: 10px;
    left: 0px;
    right: 3px;
  }
}

.shadow-module {
  position: absolute;
  top: 117px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
}

.sort-container {
  background: $l-color-bgcolor-18;
  padding: 0 5px;

  .inline-block {
    margin-right: 2px;
  }
}

.infinite-list-wrapper {
  flex: 1;
  overflow: hidden;
}

.list-container {
  height: 100%;

  .list-item {
    padding: 6px 14px;
    position: relative;
    overflow: hidden;

    .status {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 999;
    }

    .status-active {
      color: $l-color-primary;
    }

    .item-label {
      position: relative;
      line-height: 28px;
      color: $l-color-fontcolor-3;
      overflow: hidden;

      .el-col {
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &.rep {
            width: 100% !important;
            font-weight: bold;
          }
        }

        &:first-child {
          span {
            &:first-child {
              width: 60px;
              text-align-last: justify;
              -moz-text-align-last: justify; //兼容firefox
              text-align: justify;
              text-justify: distribute-all-lines; //兼容ie
              display: block; //ie下需设为block
            }
          }
        }
      }

      .label {
        white-space: nowrap;
        color: $l-color-fontcolor-3;
        font-size: $l-font-size;
      }

      .minwidth {
        min-width: 80px;
        display: inline-block;
      }
    }
  }

  .delicon {
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    color: $l-color-fontcolor-4;

    .el-icon-delete {
      vertical-align: middle;
    }
  }

  .delicon:hover {
    color: $l-color-primary;
  }

  .list-item:nth-child(even) {
    background: $l-color-bgcolor-18;
  }

  .active {
    background-color: $l-color-bgcolor-12 !important;
  }
}

.rep {
  display: block;
  font-weight: bold;
  margin-right: 50px;
}

.rep-status {
  position: absolute;
  right: 0;
  top: 0;
  font-weight: bold;
}

.rep-name {
  display: inline-block;
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rep-gender {
  display: inline-block;
  width: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rep-charge {
  display: block;
  float: right;
}

.search-btn-box {
  display: flex;
  justify-content: space-between;
}

.flex-box {
  display: flex;
  flex-direction: column;
}
</style>
