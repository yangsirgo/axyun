<template>
  <div :class="TableDialogClass">
    <el-dialog
      :visible.sync="visible"
      :showDialog="showDialog"
      :title="tableTitle"
      :close-on-click-modal="false"
      top="5vh"
      @close="OnClose()"
    >
      <div id="tableDialog" v-if="loading">
        <PGlobalStep v-if="maxActive != 1" :active="active" />
        <keep-alive>
          <component ref="tableRef" :is="curComponent"></component>
        </keep-alive>
      </div>
      <span v-if="loading" slot="footer" class="dialog-footer">
        <!-- <el-button @click="saveFun">默认值</el-button> -->
        <el-button @click="emptyData">清 空</el-button>
        <el-button @click="OnClose">取 消</el-button>
        <span v-if="maxActive === 1">
          <el-button type="primary" @click="saveFun()">确 定</el-button>
        </span>
        <span v-else>
          <el-button type="primary" @click="Previous()" v-if="active != 0"
            >上一步</el-button
          >
          <el-button type="primary" @click="next()" v-if="active != maxActive"
            >下一步</el-button
          >
          <el-button
            type="primary"
            @click="saveFun()"
            v-if="active === maxActive"
            >确 定</el-button
          >
        </span>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { checkNotNull } from "@/utils/checkUtils";
import { mapGetters, mapActions } from "vuex";
import { onSaveDocCheckup, onQueryOneDocCheckup } from "@/api/phss/checkup/checkup";
import {onSaveDocFlpHpts,onQueryOneDocFlpHpts} from "@/api/phss/docFlpHpts/docFlpHpts";
export default {
  name: "TableDialog",
  props: {
    showDialog: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      visible: this.showDialog,
      active: 0,
      maxActive: 0,
      tableTitle: "",
      curComponent: "",
      tempTableForm: [],
      tempChObject: []
    };
  },
  computed: {
    ...mapGetters("table", ["tableConfiguration", "AllStepData"]),
    TableDialogClass() {
      let tempClass = "TableDialog";
      if (this.tableConfiguration.tableName == "DocCmHlthMngmt") {
        tempClass = "DocCmHlthMngmt";
      }
      return tempClass;
    }
  },
  created() {
    console.log("新增或编辑数据", this.tableConfiguration);
    setTimeout(() => {
      this.maxActive = this.tableConfiguration.maxActive;
      this.tableTitle = this.tableConfiguration.tableTitle;
      this.curComponent = this.tableConfiguration.curComponent;
    }, 10);
    setTimeout(() => {
      this.loading = true;
    }, 10);
  },
  methods: {
    ...mapActions({
      setConfiguration: "table/setConfiguration",
      setAllStepData: "table/setAllStepData"
    }),
    emptyData(){
       this.$refs.tableRef.emptyData();
    },
    // 下一步
    next() {
      // this.$forceUpdate();
      let result = checkNotNull(
        this.$refs.tableRef.TableForm,
        this.tableConfiguration.component + (this.active + 1)
      );
      if (result != "") {
        this.$message.error(result);
        return;
      }
      this.removeEnterListener();
      console.log("================this.$refs.tableRef===============", this.$refs.tableRef);
      this.tempTableForm.push(this.$refs.tableRef.TableForm);
      console.log("??????????", this.$refs.tableRef.chObject);
      this.tempChObject.push(this.$refs.tableRef.chObject);
      console.log("this.tempTableForm", this.tempTableForm);

      this.setAllStepData(this.tempTableForm);
      // console.log("1111111111111111111", this.tempChObject);
      // }
      if (this.active++ > this.maxActive) {
        return;
      }
      this.curComponent = this.tableConfiguration.component + (this.active + 1);

      setTimeout(() => {
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
      this.tempChObject.splice(this.tempChObject.length - 1, 1);
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
      let result = checkNotNull(
        this.$refs.tableRef.TableForm,
        this.tableConfiguration.component + (this.active + 1)
      );
      if (result != "") {
        this.$message.error(result);
        return;
      }
      if(this.$refs.tableRef.TableForm.statusData){
        if(!this.$refs.tableRef.TableForm.showDom){
            this.$refs.tableRef.saveAsImg();
        }
        if(!this.$refs.tableRef.TableForm.showDom1){
            this.$refs.tableRef.saveAsImg1();
        }
        this.$refs.tableRef.canvasClear();
        this.$refs.tableRef.canvasClear1();
      }
      this.tempTableForm.push(this.$refs.tableRef.TableForm);
      this.tempChObject.push(this.$refs.tableRef.chObject);
      // --- 合并数据 ---
      let endObj = {};
      let chObject = {};
      this.tempTableForm.forEach(el => {
        Object.assign(endObj, el);
        console.log(Object.assign(endObj, el));
      });

      console.log("endObj", endObj);
      this.tempChObject.forEach(el => {
        Object.assign(chObject, el);
      });
      console.log("endObj", endObj);
      endObj.chObject = chObject;
      this.$emit("saveMethod", endObj);
      console.log("提交参数", this.tempTableForm);
    },
    // 初始化组件方法
    initInput() {
      this.$refs.tableRef.init();
    },
    // 初始化 并移除组件键盘监听事件
    initialize() {
      this.active = 0;
      this.maxActiv = 0;
      this.tableTitle = "";
      this.curComponent = "";
      this.tempTableForm = [];
      this.tempChObject = [];
      this.removeEnterListener();
    },
    // 移除组件内键盘监听事件
    removeEnterListener() {
      this.$refs.tableRef.removeEnterListener();
    },
    OnClose() {
      this.$emit("update:showDialog", false);
    }
  },
  watch: {
    showDialog: {
      immediate: true,
      handler(showDialog) {
        this.visible = this.showDialog;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.TableDialog {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #fff;
  padding: 10px;
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
}
.DocCmHlthMngmt {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #fff;
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
</style>
