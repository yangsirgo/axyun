<template>
  <div class="PublicHealth">
    <div>
      <h1 class="pb-10">新增</h1>
      <el-button type="primary" @click="open001">健康体检表</el-button>
      <el-button type="primary" @click="open002">老年人中医药健康管理服务记录表</el-button>
      <el-button type="primary" @click="open003">高血压患者随访服务记录表</el-button>
      <el-button type="primary" @click="open004">居民健康档案</el-button>
      <el-button type="primary" @click="open005">老年人生活自理能力评估表</el-button>
      <el-button type="primary" @click="open006">2型糖尿病患者随访服务记录表</el-button>
      <el-button type="primary" @click="open007">肺结核患者第一次入户随访记录表</el-button>
      <!-- <el-button type="primary" @click="open">健康体检表</el-button>
      <el-button type="primary" @click="open2">健康体检表2020</el-button>
      <el-button type="primary" @click="open000">老年人中医药健康管理服务记录表</el-button>
      <el-button type="primary" @click="open3">高血压患者随访服务记录表</el-button>-->
    </div>
    <div>
      <h1 class="pt-10 pb-10">编辑</h1>
      <el-button type="primary" @click="onQuery">健康体检表编辑</el-button>
      <el-button type="primary" @click="Echo001">高血压患者随访服务记录表---返显</el-button>
    </div>
    <div>
      <h1 class="pt-10 pb-10">TO DO</h1>
      <el-button type="primary" @click="open4">抽离组件</el-button>
      <TableDialog v-if="showDialog" :showDialog.sync="showDialog"></TableDialog>
    </div>
    <div>
      <el-dialog v-if="dialogVisible" :title="componentTitle" :visible.sync="dialogVisible" :before-close="childCloes" :close-on-click-modal="false" top="5vh">
        <PGlobalStep :active="active" />
        <keep-alive>
          <component ref="tableRef" :is="curComponent"></component>
        </keep-alive>
        <span slot="footer">
          <el-button @click="saveFun">默认值</el-button>
          <el-button @click="saveFun">清 空</el-button>
          <el-button @click="childCloes">取 消</el-button>
          <el-button type="primary" @click="Previous" v-if="active!=0">上一步</el-button>
          <el-button type="primary" @click="next" v-if="active!=maxActive">下一步</el-button>
          <el-button type="primary" @click="saveFun" v-if="active===maxActive">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="DocCmHlthMngmt">
      <el-dialog v-if="DocCmHlthMngmtVisible" :title="componentTitle" :visible.sync="DocCmHlthMngmtVisible" :before-close="childCloes" :close-on-click-modal="false" top="5vh">
        <PGlobalStep :active="active" />
        <keep-alive>
          <component ref="tableRef" :is="curComponent"></component>
        </keep-alive>
        <span slot="footer">
          <el-button @click="saveFun">默认值</el-button>
          <el-button @click="saveFun">清 空</el-button>
          <el-button @click="childCloes">取 消</el-button>
          <el-button type="primary" @click="Previous" v-if="active!=0">上一步</el-button>
          <el-button type="primary" @click="next" v-if="active!=maxActive">下一步</el-button>
          <el-button type="primary" @click="saveFun" v-if="active===maxActive">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
  import { onSaveDocCheckup, onQueryOneDocCheckup } from "@/api/phss/checkup/checkup";
  import {
    onSaveDocFlpHpts,
    onQueryOneDocFlpHpts
  } from "@/api/phss/docFlpHpts/docFlpHpts";
  export default {
    name: "PublicHealth",
    components: {},
    data() {
      return {
        showDialog: false,
        loading: false,
        active: 0,
        maxActive: 0,
        componentTitle: "",
        dialogVisible: false,
        DocCmHlthMngmtVisible: false,
        curComponent: "",
        tempTableForm: [],
        tempChObject: []
      };
    },
    computed: { ...mapGetters("table", ["tableConfiguration"]) },
    created() {},
    mounted() {},
    methods: {
      ...mapActions({
        setConfiguration: "table/setConfiguration",
        setAllStepData: "table/setAllStepData"
      }),
      onQuery() {
        onQueryOneDocCheckup({ id: "c1017a5d-33ae-4ae7-b904-90e6ff8af8d7" })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              // this.setConfiguration({
              //   tableName: "HealthChecklist",
              //   dataYear: "twentySeventeen",
              //   tableTitle: "健康体检表",
              //   editData: res.data,
              //   editChObject: res.data.chObject
              // });
              this.open5(res.data, res.data.chObject);
            } else {
              this.$message.error("获取数据失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      open001() {
        this.setConfiguration({
          tableName: "HealthChecklist",
          dataYear: "twentySeventeen",
          tableTitle: "健康体检表"
        });
        this.showDialog = true;
      },
      open002() {
        this.setConfiguration({
          tableName: "DocCmHlthMngmt",
          dataYear: "twentySeventeen",
          tableTitle: "老年人中医药健康管理服务记录表"
        });
        this.showDialog = true;
      },
      open003() {
        this.setConfiguration({
          tableName: "HypertensionFlp",
          dataYear: "twentySeventeen",
          tableTitle: "高血压患者随访服务记录表"
        });
        this.showDialog = true;
      },
      open004() {
        this.setConfiguration({
          tableName: "ResidentHealthRecord",
          dataYear: "twentySeventeen",
          tableTitle: "居民健康档案"
        });
        this.showDialog = true;
      },
      open005() {
        this.setConfiguration({
          tableName: "DocSelfcare",
          dataYear: "twentySeventeen",
          tableTitle: "老年人生活自理能力评估表"
        });
        this.showDialog = true;
      },
      open006() {
        this.setConfiguration({
          tableName: "DocFlpDiabetes",
          dataYear: "twentySeventeen",
          tableTitle: "2型糖尿病患者随访服务记录表"
        });
        this.showDialog = true;
      },
      open007() {
        this.setConfiguration({
          tableName: "tuberculosis",
          dataYear: "twentySeventeen",
          tableTitle: "肺结核患者第一次入户随访记录表1"
        });
        this.showDialog = true;
      },
      Echo001(a, b) {
        onQueryOneDocFlpHpts({ id: "6674e344-d062-4798-bb82-bef21213b245" })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.setConfiguration({
                tableName: "HypertensionFlp",
                dataYear: "twentySeventeen",
                tableTitle: "高血压患者随访服务记录表",
                status: "edit",
                editData: res.data,
                editChObject: res.data.chObject
              });
              this.showDialog = true;
            } else {
              this.$message.error("获取数据失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      open() {
        this.setConfiguration({
          tableName: "HealthChecklist",
          dataYear: "twentySeventeen",
          tableTitle: "健康体检表"
        });
        this.curComponent = this.tableConfiguration.pageList[0].menuKey;
        this.componentTitle = this.tableConfiguration.tableTitle;
        this.maxActive = this.tableConfiguration.maxActive;
        this.dialogVisible = true;
      },
      open000() {
        this.setConfiguration({
          tableName: "DocCmHlthMngmt",
          dataYear: "twentySeventeen",
          tableTitle: "老年人中医药健康管理服务记录表"
        });
        this.curComponent = this.tableConfiguration.pageList[0].menuKey;
        this.componentTitle = this.tableConfiguration.tableTitle;
        this.maxActive = this.tableConfiguration.maxActive;
        this.DocCmHlthMngmtVisible = true;
      },
      open2() {
        this.setConfiguration({
          tableName: "HealthChecklist",
          dataYear: "twentyTwenty",
          tableTitle: "健康体检表"
        });
        this.curComponent = this.tableConfiguration.pageList[0].menuKey;
        this.componentTitle = this.tableConfiguration.tableTitle;
        this.maxActive = this.tableConfiguration.maxActive;
        this.dialogVisible = true;
      },
      open3() {
        this.setConfiguration({
          tableName: "HypertensionFlp",
          dataYear: "twentySeventeen",
          tableTitle: "高血压患者随访服务记录表"
        });
        console.log("this.tableConfiguration", this.tableConfiguration);
        this.componentTitle = this.tableConfiguration.tableTitle;
        this.curComponent = this.tableConfiguration.pageList[0].menuKey;
        this.maxActive = this.tableConfiguration.maxActive;
        this.dialogVisible = true;
      },
      open4() {
        this.setConfiguration({
          tableName: "ComponentExtraction",
          dataYear: "twentySeventeen",
          tableTitle: "组件抽离"
        });
        console.log("this.tableConfiguration", this.tableConfiguration);
        this.componentTitle = this.tableConfiguration.tableTitle;
        this.curComponent = this.tableConfiguration.pageList[0].menuKey;
        this.maxActive = this.tableConfiguration.maxActive;
        this.dialogVisible = true;
      },

      open5(a, b) {
        this.setConfiguration({
          tableName: "HealthChecklist",
          dataYear: "twentySeventeen",
          tableTitle: "健康体检表编辑",
          status: "edit",
          editData: a,
          editChObject: b
        });
        console.log("this.tableConfiguration", this.tableConfiguration);
        this.componentTitle = this.tableConfiguration.tableTitle;
        this.curComponent = this.tableConfiguration.pageList[0].menuKey;
        this.maxActive = this.tableConfiguration.maxActive;
        this.dialogVisible = true;
      },
      // 下一步
      next() {
        this.removeEnterListener();
        this.tempTableForm.push(this.$refs.tableRef.TableForm);
        this.tempChObject.push(this.$refs.tableRef.chObject);
        // 储存上一步的所有数据
        this.setAllStepData(this.tempTableForm);
        if (this.active++ > this.maxActive) {
          return;
        }
        this.curComponent = this.tableConfiguration.component + (this.active + 1);

        setTimeout(() => {
          console.log("执行");
          this.initInput();
        }, 10);
        console.log("页数---", this.active + 1);
      },
      // 上一步
      Previous() {
        this.removeEnterListener();
        if (this.active-- > this.maxActive) {
          return;
        }
        console.log("this.temp.length", this.tempTableForm.length);
        this.tempTableForm.splice(this.tempTableForm.length - 1, 1);
        console.log(this.tempTableForm);
        this.curComponent = this.tableConfiguration.component + (this.active + 1);
        setTimeout(() => {
          console.log("执行");
          this.initInput();
        }, 10);
        console.log("页数---", this.active + 1);
      },
      // 确定保存
      saveFun() {
        console.log("saveFun");
        this.tempTableForm.push(this.$refs.tableRef.TableForm);
        this.tempChObject.push(this.$refs.tableRef.chObject);
        console.log(this.tempTableForm);
        // --- 合并数据 ---
        let endObj = {};
        let chObject = {};
        this.tempTableForm.forEach(el => {
          Object.assign(endObj, el);
        });
        this.tempChObject.forEach(el => {
          Object.assign(chObject, el);
        });
        console.log("endObj", endObj);
        console.log("chObject", chObject);
        endObj.chObject = chObject;
        console.log(JSON.stringify(endObj));
        onSaveDocCheckup(endObj);
        // onSaveDocFlpHpts(endObj)
        //   .then(res => {
        //     console.log(res);
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
        // --- 合并数据 ---
        this.initialize();
      },
      // 取消关闭按钮
      childCloes() {
        this.initialize();
      },
      // 初始化 并移除组件键盘监听事件
      initialize() {
        this.active = 0;
        this.maxActiv = 0;
        this.dialogVisible = false;
        this.DocCmHlthMngmtVisible = false;
        this.curComponent = "";
        this.tempTableForm = [];
        this.tempChObject = [];
        this.removeEnterListener();
      },
      // 初始化组件方法
      initInput() {
        this.$refs.tableRef.init();
      },
      // 移除组件内键盘监听事件
      removeEnterListener() {
        this.$refs.tableRef.removeEnterListener();
      }
    },
    watch: {}
  };
</script>

<style lang="scss" scoped>
  .PublicHealth {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #fff;
    padding: 30px;

    /deep/.el-dialog {
      width: 100%;
      width: 1035px;
      position: relative;
      margin: 0 auto 0px;
      background: #fff;
      box-sizing: border-box;
      height: 90vh;

      /deep/.el-dialog__body {
        border-bottom: 1px solid #dcdfe6;
        height: calc(100% - 120px);
        overflow: scroll;
        padding: 30px 105px;
      }

      /deep/.el-dialog__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // padding: 20px;
        text-align: right;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }

    .DocCmHlthMngmt {
      /deep/.el-dialog {
        width: 100%;
        width: 1440px;
        position: relative;
        margin: 0 auto 0px;
        background: #fff;
        box-sizing: border-box;
        height: 90vh;

        /deep/.el-dialog__body {
          border-bottom: 1px solid #dcdfe6;
          height: calc(100% - 120px);
          overflow: scroll;
          padding: 30px 105px;
        }

        /deep/.el-dialog__footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          // padding: 20px;
          text-align: right;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
      }
    }
  }
</style>