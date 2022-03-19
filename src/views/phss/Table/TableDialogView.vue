<template >
  <div :class="TableDialogClass">
    <el-dialog
      :visible.sync="visible"
      :showDialog1="showDialog1"
      :title="tableTitle"
      :close-on-click-modal="false"
      top="5vh"
      @close="OnClose()"
    >
      <div id="tableDialog" v-if="loading">
        <div class="TableDialogViewMask"></div>
        <PGlobalStep v-if="maxActive!=1" :active="active" />
        <keep-alive>
          <component ref="tableRef" :is="curComponent"></component>
        </keep-alive>
      </div>
      <span v-if="loading" slot="footer" class="dialog-footer">
        <!-- <el-button @click="saveFun">默认值</el-button>
        <el-button @click="saveFun">清 空</el-button>-->
        <el-button @click="OnClose">取 消</el-button>
        <span v-if="maxActive===1">
          <!-- <el-button type="primary" @click="saveFun()">确 定</el-button> -->
        </span>
        <span v-else>
          <el-button type="primary" @click="Previous()" v-if="active!=0">上一步</el-button>
          <el-button type="primary" @click="next()" v-if="active!=maxActive">下一步</el-button>
          <!-- <el-button type="primary" @click="saveFun()" v-if="active===maxActive">确 定</el-button> -->
        </span>
      </span>
    </el-dialog>
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
  name: "TableDialogView",
  props: {
    showDialog1: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      visible: this.showDialog1,
      active: 0,
      maxActive: 0,
      status: "",
      tableTitle: "",
      curComponent: "",
      tempTableForm: [],
      tempChObject: []
    };
  },
  computed: {
    ...mapGetters("table", ["tableConfiguration", "viewTableConfiguration"]),
    TableDialogClass() {
      let tempClass = "TableDialog";
      console.log(
        "this.viewTableConfiguration.tableName",
        this.viewTableConfiguration.tableName
      );
      if (this.viewTableConfiguration.tableName == "DocCmHlthMngmt") {
        tempClass = "DocCmHlthMngmt";
      }
      return tempClass;
    }
  },
  created() {
    console.log("查看表格", this.viewTableConfiguration);
    setTimeout(() => {
      this.maxActive = this.viewTableConfiguration.maxActive;
      this.tableTitle = this.viewTableConfiguration.tableTitle;
      this.curComponent = this.viewTableConfiguration.curComponent;
      this.status = this.viewTableConfiguration.status;
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
    next() {
      this.removeEnterListener();
      this.tempTableForm.push(this.$refs.tableRef.TableForm);
      this.tempChObject.push(this.$refs.tableRef.chObject);
      this.setAllStepData(this.tempTableForm);
      // }
      if (this.active++ > this.maxActive) {
        return;
      }
      this.curComponent =
        this.viewTableConfiguration.component + (this.active + 1);

      setTimeout(() => {
        // this.initInput();
        this.removeEnterListener();
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
      this.curComponent =
        this.viewTableConfiguration.component + (this.active + 1);
      setTimeout(() => {
        console.log("执行");
        // this.initInput();
        this.removeEnterListener();
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
      console.log("chObject********************", JSON.stringify(endObj));
      console.log("chObject******************", JSON.stringify(chObject));
      endObj.chObject = chObject;
      // onSaveDocCheckup(endObj);
      onSaveDocFlpHpts(endObj)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
      // --- 合并数据 ---
      this.initialize();
      this.OnClose();
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
      console.log("111", 111);
      this.$emit("update:showDialog1", false);
    }
  },
  watch: {
    viewTableConfiguration(n, o) {
      console.log("n", n);
      this.maxActive = this.viewTableConfiguration.maxActive;
      this.tableTitle = this.viewTableConfiguration.tableTitle;
      this.curComponent = this.viewTableConfiguration.curComponent;
      this.status = this.tableConfiguration.status;
    },
    showDialog1: {
      immediate: true,
      handler(showDialog1) {
        this.visible = this.showDialog1;
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
#tableDialog {
  position: relative;
  .TableDialogViewMask {
    position: absolute;
    // background-color: #9d9d9d;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
}
</style>
