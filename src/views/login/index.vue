<template>
  <div class="login-container">
    <img class="topLeft" src="@/assets/login_images/topLeft.png" alt />
    <img class="topRight" src="@/assets/login_images/topRight.png" alt />
    <img class="bottomLeft" src="@/assets/login_images/bottomLeft.png" alt />
    <img class="bottomRight" src="@/assets/login_images/bottomRight.png" alt />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <img class="height100" src="@/assets/login_images/login.png" alt />
      <div class="form-container height100">
        <div class="main-content">
          <img
            class="login-logo width100"
            src="@/assets/login_images/logo.png"
            alt
          />
          <div :style="{ height: shrinkHeight + 'px' }">
            <div v-if="show" class="userInfo">
              {{ bname + " - " + this.params.orgName }}
            </div>
          </div>
          <el-form-item class="first-item" prop="username">
            <span class="icon-container">
              <i class="iconfont icondanganguanli"></i>
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              :disabled="uDisabled"
            />
            <!-- @blur="handleRole" -->

            <span class="closeicon" v-if="uDisabled" @click="handleReLogin">
              <i class="iconfont el-icon-circle-close"></i>
            </span>
          </el-form-item>
          <el-form-item prop="password">
            <span class="icon-container">
              <i class="iconfont iconbaomiliulan-copy"></i>
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              :disabled="pDisabled"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleRole"
            />
            <!-- @blur="handleRole" -->
            <span class="show-pwd" @click="showPwd"></span>
          </el-form-item>
          <LFormtTitle v-if="hosVisible" label="医院">
            <el-select
              v-model="hosvalue"
              placeholder="请选择"
              @change="handleChange"
            >
              <el-option
                v-for="(item, index) in hosList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle v-if="visible" label="科室角色">
            <el-select
              @change="roleChange"
              v-model="value"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </LFormtTitle>
          <el-button
            :loading="loading"
            @click="handleRole(roles[value])"
            type="primary"
            style="width: 100%; height: 60px"
            class="loginBtn"
            >{{ $t("login.login") }}</el-button
          >
        </div>
        <lang-select class="set-language l-center-horizontal" />
      </div>
    </el-form>
    <el-dialog
      title="初始化系统数据"
      custom-class="innerDialog"
      width="30%"
      top="30vh"
      :visible.sync="innerVisible"
      append-to-body
    >
      <div class="innerLoading">
        <div class="loading">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20"></circle>
          </svg>
          <div style="margin-top:10px">
            正在初始化系统数据，请耐心等待...
          </div>
          <div style="margin-top:10px">
            {{ loadingText }}
            <span v-if="loadingText === '西医诊断'">
              （{{ tempTotal }} / {{ WesternTotal }}）
            </span>
            <span v-if="loadingText === '中医诊断'">
              （{{ tempTotal }} / {{ ChineseTotal }}）
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import localForage from "localforage";
import LangSelect from "@/components/LangSelect";
import { validUsername } from "@/utils/validate";
import {
  setRole,
  setRoles,
  getRole,
  getUserId,
  setPamars,
  getPamars
} from "@/utils/auth";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import {
  getDRole,
  getTadmin,
  patTcmDiag,
  icd10Dictionary,
  deltaImportQuery
} from "@/api/admin/role.js";
import Base64 from "@/utils/base64.js";
import { urlConfig } from "@/utils";
import { getAllDictInfo } from "@/api/medicalInsurance/index.js";
import { getMacLoaction } from "@/utils/print";
import settlementChartVue from "../dashboard/components/charts/settlementChart.vue";
import cloneDeep from "lodash/cloneDeep";
const shrinkHeight = "30";
export default {
  name: "Login",
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      innerVisible: false,
      shrinkHeight: shrinkHeight,
      loginForm: {
        username: "",
        password: ""
      },
      isLogin: false,
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      visible: false,
      roleList: [],
      hosList: [],
      value: "",
      result: {},
      show: false,
      show2: false,
      hosVisible: false,
      hosvalue: "",
      isOne: false,
      userId: "",
      pamars: {},
      isTenant: false, //判断是否是租户管理员角色，默认不是
      uDisabled: false,
      pDisabled: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      icd10DictionaryData: [],
      patTcmDiagData: [],
      updateTime: "",
      WesternTotal: 0,
      ChineseTotal: 0,
      tempTotal: 0,
      loadingText: "西医诊断"
    };
  },
  computed: {
    //hos登录返回的医院
    ...mapGetters(["roles", "avatar", "name"]),
    bname() {
      return Base64.decode(this.name);
    },
    permission_routes() {
      return this.$store.state.permission.addRoutes;
    },
    mainPage() {
      return this.$store.state.permission.mainPage;
    }
  },
  watch: {
    show(n) {
      this.shrinkHeight = n ? "70" : shrinkHeight;
    },
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions({
      changeDictInfoNew: "medicalInsuranceNew/changeDictInfoNew",
      setDiagnosisData: "diagnosis/setDiagnosisData",
      setDiagnosisDataType: "diagnosis/setDiagnosisDataType"
    }),
    handleReLogin() {
      this.loginForm = {
        username: "",
        password: ""
      };
      this.visible = false;
      this.hosVisible = false;
      this.hosList = [];
      this.roleList = [];
      this.isLogin = false;
      this.uDisabled = false;
      this.pDisabled = false;
      this.hosvalue = "";
      this.value = "";
    },
    async roleChange(value) {
      let command = this.roleList[value].roleId;

      // await this.$store.dispatch("user/changeRolesNew", {roleId: command});
      // console.log(this.mainPage,'this.mainPage')
    },
    getroleData(data) {
      getDRole(data).then(res => {
        this.roleList = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = {};
          let _row = res.data[i];
          item = _row;
          item.value = i;
          item.label = _row.roleName + " / " + _row.deptName;
          this.roleList.push(item);
        }
        if (this.roleList.length === 1) {
          this.visible = false;

          this.pamars.workType = JSON.parse(getPamars()).workType;
          setPamars(this.pamars);
          setRole(this.roleList[0]);
          setRoles(this.roleList);
          let r = this.tmpRoute();

          this.routerHandlerJump(3);

          // this.getSocketData();
          // this.getInitInfoData();

          // this.$store.dispatch("user/setRole", this.roleList[0]);
        } else if (this.roleList.length == 0) {
          if (this.hosList.length == 1) {
            this.isLogin = false;
            this.hosList = [];
            this.uDisabled = false;
            this.pDisabled = false;
          }
          this.$message({
            message: "该医院下没有所属科室",
            type: "warning"
          });
        } else {
          this.visible = true;
        }
      });
    },
    changeHosData(res) {
      //如果isTenant为false时，需请求科室信息
      this.hosList = [];

      for (let i = 0; i < res.data.length; i++) {
        let item = {};
        let row = res.data[i];
        item = row;
        item.value = i;
        item.label = row.hosNm;
        /* item.hosId = row.hosId;
          item.hosNm = row.hosNm;
          item.sHosId = row.sHosId;
          item.orgNm = row.orgNm;
          item.orgId = row.orgId;
          item.label = row.hosNm;
          */
        this.hosList.push(item);
      }
      //当只有一个医院时，不显示医院下拉框
      if (this.hosList.length == 1) {
        //显示科室框
        // this.visible = true;
        this.isOne = true;
        this.getroleData({
          userId: this.userId,
          hosId: res.data[0].hosId
        });

        this.hos = res.data[0];
        this.pamars = {
          hosId: this.hos.sHosId,
          hosIdNum: this.hos.hosId,
          hosName: this.hos.hosNm,
          orgId: this.hos.orgId,
          orgName: this.hos.orgNm
        };
      } else if (this.hosList.length == 0) {
        this.isLogin = false;
        this.uDisabled = false;
        this.pDisabled = false;
      } else {
        //显示医院下拉框
        this.hosVisible = true;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    //登录
    handleLogin() {
      let addurl = "/admin/user/login";
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", { ...this.loginForm, url: addurl })
            .then(res => {
              console.log("res==================", res);
              if (res.code === 1) {
                //登录成功
                this.isLogin = true;
                let userId = Base64.decode(getUserId());
                this.userId = userId;
                this.isTenant = res.data.hoss.isTenant;

                if (res.data.hoss.isTenant) {
                  this.hosVisible = false;
                  this.visible = false;
                  let obj = {
                    label: "租户管理员"
                  };
                  setRole(obj);

                  this.routerHandlerJump(2);

                  // this.$store.dispatch("user/setRole", obj);
                } else {
                  this.uDisabled = true;
                  this.pDisabled = true;
                  this.changeHosData(res.data.hoss);
                }
              }
              this.loading = false;
              return true;
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
              return false;
            });
        } else {
          this.show = false;
          this.visible = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    tmpRoute() {
      // 门诊护士
      if (this.loginForm.username == "dongchangbing") {
        return "/cisOne/appointTriage/signIn";
        // 门诊医生
      } else if (this.loginForm.username == "lianglu") {
        return "/cisOne/cisThree/record";
        // 住院护士
      } else if (this.loginForm.username == "weipeng") {
        return "/ipnw/nursing/temperature";
        // 住院医生
      } else if (this.loginForm.username == "fangyitong") {
        return "/ipnw/orderRecord/ipnw_patientList";
      } else {
        return "/patientMaster/recordCreate";
      }
    },
    //点击登录按钮和失去焦点时
    handleRole(item) {
      this.$refs.loginForm.validate(valid => {
        //有表单
        if (valid) {
          //判断是否登录
          if (this.isLogin) {
            if (!this.isOne) {
              console.log("this.hosvalue", this.hosvalue);
              if (this.hosvalue == "" && this.hosvalue !== 0) {
                this.$message({
                  message: "请选择医院",
                  type: "warning"
                });
              } else {
                // 已经选中医院
                console.log("#############", 55555555555555555555);
                if (this.value == "" && this.value !== 0) {
                  this.$message({
                    message: "请选择科室",
                    type: "warning"
                  });
                } else {
                  this.pamars.workType = JSON.parse(getPamars()).workType;
                  setPamars(this.pamars);
                  setRole(this.roleList[this.value]);
                  setRoles(this.roleList);

                  this.routerHandlerJump(1);
                  // this.$store.dispatch(
                  //   "user/setRole",
                  //   this.roleList[this.value]
                  // );

                  // getAllDictInfo({
                  //   medicareType: "01"
                  // }).then(res => {
                  //   localStorage.setItem("dictInfo", JSON.stringify(res.data));
                  // });
                  // getAllDictInfo({
                  //   medicareType: "02"
                  // }).then(res => {
                  //   this.changeDictInfoNew(res.data);
                  // });
                }
              }
            } else {
              //单个医院科室多个
              if (this.visible) {
                if (this.value !== "") {
                  console.log("this.value", this.value);
                  this.pamars.workType = JSON.parse(getPamars()).workType;
                  console.log("this.pamars@@@@@@@@@@@@@@S", this.pamars);
                  setPamars(this.pamars);
                  console.log("this.roleList", this.roleList);
                  setRole(this.roleList[this.value]);
                  setRoles(this.roleList);

                  this.routerHandlerJump(1);

                  // this.$store.dispatch(
                  //   "user/setRole",
                  //   this.roleList[this.value]
                  // );

                  // getAllDictInfo({
                  //   medicareType: "01"
                  // }).then(res => {
                  //   localStorage.setItem("dictInfo", JSON.stringify(res.data));
                  // });
                  // getAllDictInfo({
                  //   medicareType: "02"
                  // }).then(res => {
                  //   this.changeDictInfoNew(res.data);
                  // });
                } else {
                  this.$message({
                    message: "请选择科室角色",
                    type: "warning"
                  });
                }
              }
            }
          } else {
            // 未登录
            this.handleLogin();
          }

          this.getMacLoaction();
        }
      });
    },
    getMacLoaction() {
      // 获取 mac 主机地址
      getMacLoaction({ value: "" })
        .then(async res2 => {
          console.log("具体存进去的 currentMacNo ", res2);
          localStorage.setItem("currentMacNo", res2);
        })
        .catch(() => {
          localStorage.setItem("currentMacNo", null);
        });
    },
    handleChange(val) {
      console.log("@@@@@@@@@@@@@@@@@@1111", val);
      this.getroleData({
        userId: this.userId,
        hosId: this.hosList[this.hosvalue].hosId
      });

      this.hos = this.hosList[this.hosvalue];
      this.pamars = {
        hosId: this.hos.sHosId,
        hosIdNum: this.hos.hosId,
        hosName: this.hos.hosNm,
        orgId: this.hos.orgId,
        orgName: this.hos.orgNm
      };
      console.log("this.pamars", this.pamars);
    },
    async routerHandlerJump(type) {
      console.log(`Data().now`, new Date());
      await this.initIndexDB();
      console.log(`Data().now`, new Date());

      this.$router.push({ path: "/dashboard" });
      if (type === 1) {
        this.$store.dispatch("user/setRole", this.roleList[this.value]);

        getAllDictInfo({
          medicareType: "01"
        }).then(res => {
          localStorage.setItem("dictInfo", JSON.stringify(res.data));
        });
        getAllDictInfo({
          medicareType: "02"
        }).then(res => {
          this.changeDictInfoNew(res.data);
        });
      }
      if (type === 2) {
        let obj = {
          label: "租户管理员"
        };
        this.$store.dispatch("user/setRole", obj);
      }
      if (type === 3) {
        this.$store.dispatch("user/setRole", this.roleList[0]);
      }
    },
    // initIndexDB **********************************************************************
    async initIndexDB() {
      console.log(`initIndexDB`);
      let tempUpdateTime = await localForage.getItem("updateTime");
      console.log(`获取缓存时间--------`, tempUpdateTime);
      if (tempUpdateTime === null) {
        this.updateTime = "";
      } else {
        this.updateTime = tempUpdateTime;
      }
      const { total1, total2 } = await this.getTotal();
      this.WesternTotal = total1;
      this.ChineseTotal = total2;
      if (this.updateTime === "") {
        this.innerVisible = true;
        // 获取西医
        await this.implementIcd10Dictionary(1, 3000);
        this.loadingText = "缓存西医诊断中...";
        // 缓存西医
        await this.setWesternLocalForage();
        this.loadingText = "西医诊断缓存成功！";
        setTimeout(() => {
          this.loadingText = "中医诊断";
          this.tempTotal = 0;
        }, 100);
        // 获取中医
        await this.getChineseDiag();
        this.loadingText = "缓存中医诊断中...";
        // 缓存中医
        await this.setChineseLocalForage();
        // 设置vuex
        this.setDiagnosisData({
          WesternMedicine: this.icd10DictionaryData.sort(
            this.compare("dictionaryName")
          ),
          ChineseMedicine: this.patTcmDiagData.sort(this.compare("tcdName"))
        });
        // 缓存时间
        await this.setLocalForage(
          "updateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
        // 关闭弹窗
        this.innerVisible = false;
      } else {
        if (this.WesternTotal === 0 && this.WesternTotal === 0) {
          const WesternMedicineDiagnosis = await localForage.getItem(
            "WesternMedicineDiagnosis"
          );
          const ChineseMedicineDiagnosis = await localForage.getItem(
            "ChineseMedicineDiagnosis"
          );
          // 设置vuex
          this.setDiagnosisData({
            WesternMedicine: WesternMedicineDiagnosis,
            ChineseMedicine: ChineseMedicineDiagnosis
          });
          this.innerVisible = false;
        } else {
          this.innerVisible = true;
        }
        if (this.WesternTotal !== 0) {
          // 获取西医
          await this.implementIcd10Dictionary(1, 3000);
          this.loadingText = "缓存西医诊断中...";
          await this.updateWesternData(this.icd10DictionaryData);
          this.loadingText = "西医诊断缓存成功！";
        } else {
          const WesternMedicineDiagnosis = await localForage.getItem(
            "WesternMedicineDiagnosis"
          );
          // 设置vuex
          this.setDiagnosisDataType({
            type: "WesternMedicine",
            val: WesternMedicineDiagnosis
          });
        }
        this.tempTotal = 0;
        if (this.ChineseTotal !== 0) {
          this.loadingText = "中医诊断";
          this.getChineseDiag();
          this.loadingText = "缓存中医诊断中...";
          this.updateChineseData(this.patTcmDiagData);
          this.loadingText = "中医诊断缓存成功！";
        }else {
          const ChineseMedicineDiagnosis = await localForage.getItem(
            "ChineseMedicineDiagnosis"
          );
          // 设置vuex
          this.setDiagnosisDataType({
            type: "ChineseMedicine",
            val: ChineseMedicineDiagnosis
          });
        }
        // 缓存时间
        await this.setLocalForage(
          "updateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
        // 关闭弹窗
        this.innerVisible = false;
      }
    },
    // 获取西医诊断总数
    async getTotal() {
      try {
        const res = await icd10Dictionary(
          {
            hosId: this.hos.hosId,
            updateTime: this.updateTime
          },
          {
            pageNo: this.pageNo,
            pageSize: 1
          }
        );
        const res2 = await patTcmDiag(
          {
            hosId: this.hos.hosId,
            updateTime: this.updateTime
          },
          {
            pageNo: this.pageNo,
            pageSize: 1
          }
        );
        console.log(`getTotal`, res.total, res2.total);
        return {
          total1: res.total,
          total2: res2.total
        };
      } catch (error) {}
    },
    // 递归获取西医诊断
    async implementIcd10Dictionary(pageNo, pageSize) {
      return new Promise((resolve, reject) => {
        const icd10 = (pageNo, pageSize) => {
          icd10Dictionary(
            {
              hosId: this.hos.hosId,
              updateTime: this.updateTime
            },
            {
              pageNo: pageNo,
              pageSize: pageSize
            }
          )
            .then(res => {
              this.icd10DictionaryData = this.icd10DictionaryData.concat(
                res.data
              );
              this.tempTotal = this.icd10DictionaryData.length;
              if (pageNo === Math.ceil(this.WesternTotal / pageSize)) {
                console.log(
                  `this.icd10DictionaryData`,
                  this.icd10DictionaryData
                );
                resolve();
                return;
              }
              icd10(pageNo + 1, pageSize);
            })
            .catch(error => {
              console.log(`error`, error);
            });
        };
        icd10(pageNo, pageSize);
      });
    },
    // 缓存西医诊断
    async setWesternLocalForage() {
      try {
        await this.setLocalForage(
          "WesternMedicineDiagnosis",
          this.icd10DictionaryData.sort(this.compare("dictionaryName"))
        );
      } catch (error) {}
    },
    // 获取中医诊断
    async getChineseDiag() {
      const res = await patTcmDiag(
        {
          hosId: this.hos.hosId,
          updateTime: this.updateTime
        },
        {
          pageNo: 1,
          pageSize: 99999
        }
      );
      this.patTcmDiagData = res.data;
      this.tempTotal = this.patTcmDiagData.length;
    }, // 缓存中医诊断
    async setChineseLocalForage() {
      try {
        await this.setLocalForage(
          "ChineseMedicineDiagnosis",
          this.patTcmDiagData.sort(this.compare("tcdName"))
        );
      } catch (error) {}
    },
    // 更新西医诊断
    async updateWesternData(newWesternMedicine) {
      try {
        const WesternMedicineDiagnosis = await localForage.getItem(
          "WesternMedicineDiagnosis"
        );
        const b = this.updateLogicReuse(
          newWesternMedicine,
          WesternMedicineDiagnosis,
          "icd10DictionaryId"
        );
        await this.setLocalForage(
          "WesternMedicineDiagnosis",
          b.sort(this.compare("dictionaryName"))
        );
        // 设置vuex
        this.setDiagnosisDataType({
          type: "WesternMedicine",
          val: b.sort(this.compare("dictionaryName"))
        });
        console.log(`西医诊断`, b.length);
      } catch (err) {
        console.log("err", err);
      }
    },
    // 更新中医诊断
    async updateChineseData(newChineseMedicine) {
      try {
        const ChineseMedicineDiagnosis = await localForage.getItem(
          "ChineseMedicineDiagnosis"
        );
        const a = this.updateLogicReuse(
          newChineseMedicine,
          ChineseMedicineDiagnosis,
          "id"
        );
        await this.setLocalForage(
          "ChineseMedicineDiagnosis",
          a.sort(this.compare("tcdName"))
        );
        // 设置vuex
        this.setDiagnosisDataType({
          type: "ChineseMedicine",
          val: a.sort(this.compare("tcdName"))
        });
        console.log(`中医诊断`, a.length);
      } catch (err) {
        console.log("err", err);
      }
    },
    // 排序
    compare(property) {
      return function(a, b) {
        var value1 = a[property].length;
        var value2 = b[property].length;
        return value1 - value2;
      };
    },
    async setLocalForage(name, data) {
      try {
        const value = await localForage.setItem(name, data);
        console.log("setLocalForage成功", value.length);
      } catch (error) {
        onsole.log("setLocalForage失败", err);
      }
    },
    updateLogicReuse(newData, oldData, property) {
      let n = cloneDeep(newData);
      let o = cloneDeep(oldData);
      o.forEach((_, index) => {
        for (let i = n.length - 1; i >= 0; i--) {
          const item = n[i];
          if (_[property] === item[property]) {
            o[index] = item;
            n.splice(i, 1);
          }
        }
      });
      console.log(`n*---***`, n);
      if (n.length !== 0) {
        n.forEach(el => {
          o.push(el);
        });
      }
      return o;
    }
  }
};
</script>

<style lang="scss">
.login-container {
  input:-webkit-autofill {
    // 背景颜色
    background-color: transparent;
    // 背景图片
    background-image: none;
    // 过渡
    transition: background-color 50000s ease-in-out 0s;
  }
}
</style>
<style lang="scss" scoped>
$bg: #ffffff;
$cursor: rgb(148, 144, 144);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    height: 42px;
    width: 85%;
    /deep/ .el-input__inner {
      height: 42px !important;
      font-size: 20px;
      border: 0;
    }

    input {
      border: none;
      -webkit-appearance: none;
      color: rgba(148, 157, 163, 1);
      height: 42px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
$dark_gray: #889aa4;

.login-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #e5edf9;
  .topLeft {
    position: absolute;
    top: 0;
    left: 0;
    height: 25%;
  }
  .topRight {
    position: absolute;
    top: 0;
    right: 0;
    height: 17%;
  }
  .bottomLeft {
    position: absolute;
    bottom: 14px;
    left: 15px;
    height: 11%;
  }
  .bottomRight {
    position: absolute;
    bottom: 5%;
    right: 7%;
    height: 7%;
  }
  /deep/ .el-form-item__error {
    padding-top: 0;
  }

  /deep/ .l-input-title {
    padding: 13px 20px !important;
    font-size: 20px !important;
  }
  /deep/ .el-input__inner {
    font-size: 20px !important;
  }
  /deep/ .l-input-gap::before {
    top: calc(50% - 14px) !important;
    height: 30px !important;
  }
  /deep/ .l-input-body-main {
    padding-top: 3px !important;
    padding-left: 20px !important;
  }
  .iconfont {
    font-size: 20px;
  }
  .login-form {
    width: 1090px;
    height: 713px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 2px 40px 0px rgba(142, 22, 0, 0.05);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    .form-container {
      position: relative;
      float: right;
      width: 647px;
      .set-language {
        // position: absolute;
        // bottom: 40px;
        margin-top: 20px;
      }
      .main-content {
        width: 440px;
        position: relative;
        margin: 0 auto;
        margin-top: 90px;
        .loginBtn {
          border-radius: 4px;
        }
        .login-logo {
          margin-bottom: 40px;
        }
        .userInfo {
          height: 35px;
          font-size: 24px;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          line-height: 35px;
          text-align: center;
        }
        .icon-container {
          display: inline-block;
          padding-left: 15px;
        }
        .el-form-item {
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid rgba(228, 228, 228, 1);
          font-size: 20px;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: rgba(148, 157, 163, 1);
          margin-bottom: 20px;
          padding-top: 1px;
          height: 60px;
          line-height: 60px;
        }
        /deep/ .el-form-item--medium {
          .el-form-item__content {
            height: 60px;
            line-height: 57px;
          }
        }
        .first-item {
          margin-bottom: 20px;
          span {
            padding-left: 17px;
            padding-right: 3px;
          }
        }
        .l-input-wrap {
          margin-bottom: 20px;
          height: 60px;
          line-height: 60px;
        }
        .l-input-body-left {
          height: 60px;
          line-height: 60px;
        }

        .el-button {
          height: 50px;
          font-size: 24px;
          font-family: SourceHanSansSC-Bold, SourceHanSansSC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .dialog-box {
    height: 500px;
    .list-item {
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #ff6a00;
      cursor: pointer;
    }
  }
}
.l-input-wrap + .l-input-wrap[data-v-fbd70dc8] {
  margin-left: 0px;
}
.closeicon {
  position: absolute;
  top: 2px;
  right: 30px;
  color: #ddd;
}
.innerLoading {
  padding: 20px;
  text-align: center;
  svg {
    width: 3.75em;
  }
  .loading {
    svg {
      width: 3.75em;
      transform-origin: center;
      animation: rotate 2s linear infinite;
    }

    circle {
      fill: none;
      stroke: #2b4583;
      stroke-width: 2;
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -35px;
      }
      100% {
        stroke-dashoffset: -125px;
      }
    }
  }
}
</style>
