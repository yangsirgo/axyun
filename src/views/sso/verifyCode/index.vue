<template>
  <div>
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
// import { uclogin } from "@/api/sso/sso";
// import { urlConfig } from "@/utils";
import { getPamars, setPamars } from "@/utils/auth";
import { routerHandlerJump, jumpMainPage } from "axcommon/src/utils/util";
import { urlConfig } from "axcommon/src/utils/index.js";
import { asyncRoutes } from "@/router";
import localForage from "localforage";
import cloneDeep from "lodash/cloneDeep";
import { mapGetters, mapActions } from "vuex";
import {
  getDRole,
  getTadmin,
  patTcmDiag,
  icd10Dictionary,
  deltaImportQuery
} from "@/api/admin/role.js";

export default {
  data() {
    return {
      innerVisible: false,
      hosId: "",
      icd10DictionaryData: [],
      patTcmDiagData: [],
      updateTime: "",
      pageNo: 1,
      pageSize: 10,
      WesternTotal: 0,
      ChineseTotal: 0,
      tempTotal: 0,
      loadingText: "西医诊断"
    };
  },
  mounted() {
    this.verifyMount();
  },
  watch: {
    $route: {
      handler(val) {
        this.verifyMount();
      }
    }
  },
  methods: {
    ...mapActions({
      setDiagnosisData: "diagnosis/setDiagnosisData"
    }),
    handleLogin(loginData) {
      this.$store
        .dispatch("sso/getSSOInfo", loginData)
        .then(res => {
          if (res.code == 1) {
            // let toPath = "/cisOne/cisThree"; // 跳转到 医生站接诊页面
            console.log(`res`, res);
            let { data } = res;
            let { menuTree } = data;
            let assginRoutes = urlConfig(menuTree, asyncRoutes);
            let accessedRoutes = assginRoutes || [];
            this.$router.addRoutes(accessedRoutes);
            // 跳转到第一个一级路由下的 第一个路由 以此类推
            let toPath = routerHandlerJump(accessedRoutes);
            console.log("toPath::::: 平安跳转", toPath);
            let pamars = JSON.parse(getPamars());
            pamars.orgId = "T0000000000000000000000000000066";
            this.hosId = data._current.hosId;
            setPamars(pamars);

            this.$router.push({ path: toPath });
          }
        })
        .catch(err => {
          console.log(err);
          return false;
        });
    },
    async verifyMount() {
      await this.$store.dispatch("user/resetToken");
      if (!this.$route.query.verifyCode) {
        this.$message({
          type: "error",
          message: "参数错误"
        });
      } else {
        this.handleLogin({ verifyCode: this.$route.query.verifyCode });
      }
    },
    // index db
    async updateDiagnosisData(newChineseMedicine, newWesternMedicine) {
      try {
        const ChineseMedicineDiagnosis = await localForage.getItem(
          "ChineseMedicineDiagnosis"
        );
        const WesternMedicineDiagnosis = await localForage.getItem(
          "WesternMedicineDiagnosis"
        );
        const a = this.updateLogicReuse(
          newChineseMedicine,
          ChineseMedicineDiagnosis,
          "id"
        );
        const b = this.updateLogicReuse(
          newWesternMedicine,
          WesternMedicineDiagnosis,
          "icd10DictionaryId"
        );
        await this.setLocalForage(
          "ChineseMedicineDiagnosis",
          a.sort(this.compare("tcdName"))
        );
        await this.setLocalForage(
          "WesternMedicineDiagnosis",
          b.sort(this.compare("dictionaryName"))
        );
        console.log(`中医诊断`, a);
        console.log(`西医诊断`, b);
      } catch (err) {
        console.log("err", err);
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
    },
    // 初始化获取诊断逻辑
    async InitDiagnosis() {
      console.log(`this.hos`, this.hos);
      if (!this.hosId) {
        return;
      }
      try {
        const tempUpdateTime = await localForage.getItem("updateTime");
        console.log(`获取缓存时间--------`, tempUpdateTime);
        if (tempUpdateTime === null) {
          this.updateTime = "";
        } else {
          this.updateTime = tempUpdateTime;
        }
        await this.getIcd10DictionaryTotal();
      } catch (err) {
        console.log("InitDiagnosis失败", err);
        console.log(err);
      }
    },
    async setLocalForage(name, data) {
      try {
        const value = await localForage.setItem(name, data);
        console.log("setLocalForage成功", value);
      } catch (error) {
        console.log("setLocalForage失败", err);
      }
    },
    // 获取中医诊断
    getPatTcmDiag() {
      return patTcmDiag(
        {
          hosId: this.hosId,
          updateTime: this.updateTime
        },
        {
          pageNo: 1,
          pageSize: 99999
        }
      )
        .then(res => {
          this.patTcmDiagData = res.data;
        })
        .catch(error => {
          console.log(`error`, error);
        });
    },
    // 获取诊断
    getIcd10Dictionary(pageNo, pageSize) {
      return icd10Dictionary(
        {
          hosId: this.hosId,
          updateTime: this.updateTime
        },
        {
          pageNo: pageNo,
          pageSize: pageSize
        }
      )
        .then(res => {
          this.icd10DictionaryData = this.icd10DictionaryData.concat(res.data);
        })
        .catch(error => {
          console.log(`error`, error);
        });
    },
    // 获取诊断
    async getIcd10DictionaryTotal() {
      try {
        var beginTime = new Date();
        const res = await icd10Dictionary(
          {
            hosId: this.hosId,
            updateTime: this.updateTime
          },
          {
            pageNo: this.pageNo,
            pageSize: this.pageSize
          }
        );
        console.log(`getIcd10DictionaryTotal --- res`, res);
        let len = Math.ceil(res.total / 3600);
        console.log(`len`, len);
        let runArr = [];
        for (let i = 1; i < len + 1; i++) {
          runArr.push(this.getIcd10Dictionary(i, 3600));
        }
        runArr.push(this.getPatTcmDiag());
        console.log(`runArr`, runArr);
        const results = await Promise.all(runArr);
        console.log(`results`, results);
        var endTime = new Date();
        if (this.updateTime === "") {
          // 中医诊断
          await this.setLocalForage(
            "ChineseMedicineDiagnosis",
            this.patTcmDiagData.sort(this.compare("tcdName"))
          );
          //西医诊断
          await this.setLocalForage(
            "WesternMedicineDiagnosis",
            this.icd10DictionaryData.sort(this.compare("dictionaryName"))
          );
          console.log(`中医诊断`, this.patTcmDiagData);
          console.log(`西医诊断`, this.icd10DictionaryData);
        } else {
          this.updateDiagnosisData(
            this.patTcmDiagData,
            this.icd10DictionaryData
          );
        }
        // 保存时间
        await this.setLocalForage(
          "updateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
        console.log("获取诊断用时" + (endTime - beginTime) / 1000 + "s");
      } catch (error) {}
    },
    // 获取药品数据
    async GetDrugData() {
      try {
        const drugUpdateTime = await localForage.getItem("drugUpdateTime");
        let tempUpdateTime = "";
        if (drugUpdateTime === null) {
          tempUpdateTime = "";
        } else {
          tempUpdateTime = drugUpdateTime;
        }
        console.log(`tempUpdateTime`, tempUpdateTime);
        const res = await deltaImportQuery({ updateTime: "" });

        if (tempUpdateTime === "") {
          console.log(`GetDrugData 新增--------`, res.data);
          await this.setLocalForage("AllDrugData", res.data);
        } else {
          console.log(`GetDrugData 更新--------`, res.data);
          if (res.data === undefined) {
            return;
          }
          const AllDrugData = await localForage.getItem("AllDrugData");
          const a = this.updateLogicReuse(res.data, AllDrugData, "drugCode");
          await this.setLocalForage("AllDrugData", a);
        }
        await this.setLocalForage(
          "drugUpdateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
      } catch (err) {
        console.log("GetDrugData失败", err);
        console.log(err);
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
    // new indexDB -------------------------------------------------------------
    async initIndexDB(callback) {
      console.log(`initIndexDB`);
      const tempUpdateTime = await localForage.getItem("updateTime");
      // const tempUpdateTime = "2021-09-17";
      console.log(`获取缓存时间--------`, tempUpdateTime);
      if (tempUpdateTime === null) {
        this.updateTime = "";
      } else {
        this.updateTime = tempUpdateTime;
      }
      console.log(`this.updateTime`, this.updateTime);
      const { total1, total2 } = await this.getTotal();
      this.WesternTotal = total1;
      this.ChineseTotal = total2;
      if (this.WesternTotal !== 0) {
        this.innerVisible = true;
        this.implementIcd10Dictionary(1, 3000, callback);
      } else if (this.WesternTotal === 0 && this.ChineseTotal !== 0) {
        this.innerVisible = true;
        this.getChineseDiag(callback);
      } else {
        callback();
      }
    },
    // 获取西医诊断总数
    async getTotal() {
      try {
        const res = await icd10Dictionary(
          {
            hosId: this.hosId,
            updateTime: this.updateTime
          },
          {
            pageNo: this.pageNo,
            pageSize: 1
          }
        );
        const res2 = await patTcmDiag(
          {
            hosId: this.hosId,
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
    implementIcd10Dictionary(pageNo, pageSize, callback) {
      icd10Dictionary(
        {
          hosId: this.hosId,
          updateTime: this.updateTime
        },
        {
          pageNo: pageNo,
          pageSize: pageSize
        }
      )
        .then(res => {
          this.icd10DictionaryData = this.icd10DictionaryData.concat(res.data);
          this.tempTotal = this.icd10DictionaryData.length;
          if (pageNo === Math.ceil(this.WesternTotal / pageSize)) {
            console.log(`this.icd10DictionaryData`, this.icd10DictionaryData);
            this.loadingText = "缓存西医诊断中...";
            if (this.updateTime === "") {
              this.setWesternLocalForage(callback);
            } else {
              this.updateWesternData(this.icd10DictionaryData, callback);
            }
            return;
          }
          this.implementIcd10Dictionary(pageNo + 1, pageSize, callback);
        })
        .catch(error => {
          console.log(`error`, error);
        });
    },
    // 缓存西医诊断
    async setWesternLocalForage(callback) {
      try {
        await this.setLocalForage(
          "WesternMedicineDiagnosis",
          this.icd10DictionaryData.sort(this.compare("dictionaryName"))
        );
        this.loadingText = "西医诊断缓存成功！";
        setTimeout(() => {
          this.loadingText = "中医诊断";
          this.tempTotal = 0;
          this.getChineseDiag(callback);
        }, 100);
      } catch (error) {}
    },
    // 获取中医诊断
    getChineseDiag(callback) {
      patTcmDiag(
        {
          hosId: this.hosId,
          updateTime: this.updateTime
        },
        {
          pageNo: 1,
          pageSize: 99999
        }
      )
        .then(res => {
          this.patTcmDiagData = res.data;
          this.tempTotal = this.patTcmDiagData.length;
          this.loadingText = "缓存中医诊断中...";
          if (this.updateTime === "") {
            this.setChineseLocalForage(callback);
          } else {
            this.updateChineseData(this.patTcmDiagData, callback);
          }
        })
        .catch(error => {
          console.log(`error`, error);
        });
    }, // 缓存中医诊断
    async setChineseLocalForage(callback) {
      try {
        await this.setLocalForage(
          "ChineseMedicineDiagnosis",
          this.patTcmDiagData.sort(this.compare("tcdName"))
        );
        this.loadingText = "中医诊断缓存成功！";
        await this.setLocalForage(
          "updateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
        this.setDiagnosisData({
          WesternMedicine: this.icd10DictionaryData,
          ChineseMedicine: this.patTcmDiagData
        });
        this.innerVisible = false;
        callback();
      } catch (error) {}
    },
    // 更新西医诊断
    async updateWesternData(newWesternMedicine, callback) {
      try {
        const WesternMedicineDiagnosis = await localForage.getItem(
          "WesternMedicineDiagnosis"
        );
        const b = this.updateLogicReuse(
          newWesternMedicine,
          WesternMedicineDiagnosis,
          "icd10DictionaryId"
        );
        const bEnd = b.sort(this.compare("dictionaryName"));
        await this.setLocalForage("WesternMedicineDiagnosis", bEnd);
        this.icd10DictionaryData = bEnd;
        this.loadingText = "西医诊断缓存成功！";
        if (this.ChineseTotal === 0) {
          await this.setLocalForage(
            "updateTime",
            this.dayjs(new Date()).format("YYYY-MM-DD")
          );
          this.innerVisible = false;
          callback();
        } else {
          setTimeout(() => {
            this.loadingText = "中医诊断";
            this.tempTotal = 0;
            this.getChineseDiag(callback);
          }, 100);
        }
        console.log(`西医诊断`, b);
      } catch (err) {
        console.log("err", err);
      }
    },
    // 更新中医诊断
    async updateChineseData(newChineseMedicine, callback) {
      try {
        const ChineseMedicineDiagnosis = await localForage.getItem(
          "ChineseMedicineDiagnosis"
        );
        const a = this.updateLogicReuse(
          newChineseMedicine,
          ChineseMedicineDiagnosis,
          "id"
        );
        const aEnd = a.sort(this.compare("tcdName"));
        await this.setLocalForage("ChineseMedicineDiagnosis", aEnd);
        this.loadingText = "中医诊断缓存成功！";
        await this.setLocalForage(
          "updateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
        this.setDiagnosisData({
          WesternMedicine: this.icd10DictionaryData,
          ChineseMedicine: aEnd
        });
        this.innerVisible = false;
        callback();
        console.log(`中医诊断`, a);
      } catch (err) {
        console.log("err", err);
      }
    }
  },
  async beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave");
    this.initIndexDB(next);
  }
  // async beforeRouteLeave(to, from, next) {
  //   this.innerVisible = true;
  //   await this.InitDiagnosis();
  //   await this.GetDrugData();
  //   this.innerVisible = false;
  //   console.log("beforeRouteLeave");
  //   next();
  // }
};
</script>
<style lang="scss" scoped>
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
