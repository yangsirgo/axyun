<template>
  <div class="applicat">
    <el-tabs
      tab-position="left"
      v-model="activeName"
      class="contleft"
      :before-leave="beforeLeave"
    >
    <!-- :before-leave="beforeLeave" -->
    <!-- @tab-click="changeTab" -->
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        :label="item.label"
        :name="item.name"
        :tip="item.tip"
      ></el-tab-pane>
    </el-tabs>
    <div class="applicat-content">
      <testApplyApplicat
        v-if="activeName == 'testApply'"
        ref="applicat"
        :choose="choose"
        :elecType="eleType"
        :hosType="hosType"
      ></testApplyApplicat>
      <inspectApplyApplicat
        v-else-if="activeName == 'inspectApply'"
        ref="inspectApply"
        :choose="choose"
        :elecType="eleType"
        :hosType="hosType"
        :cisCheckApplyData="cisCheckApplyData"
      ></inspectApplyApplicat>
      <Applicat
        v-else
        ref="applicat"
        :choose="choose"
        :elecType="eleType"
        :hosType="hosType"
      ></Applicat>
    </div>
  </div>
</template>
<script>
import testApplyApplicat from "./component/Apply.vue";
import inspectApplyApplicat from "./component/checkApply.vue";
import Applicat from "./component/Apply.vue";
import { mapActions } from "vuex";
import { beforeLeaveConfirm } from "@/views/public/electronApply/component/eleUtils.js";
import cnfDictionaryService from "@/api/wconf/cnfDictionary.js";

export default {
  components: {
    testApplyApplicat,
    inspectApplyApplicat,
    Applicat
  },
  // eleType 门诊1，住院2，全院0,hosTye: 门诊1，住院3
  props: ["choose", "eleType", "hosType"],
  data() {
    return {
      tabs: [
        {
          tip: 4,
          label: "检验申请",
          name: "testApply"
        },
        {
          tip: 1,
          label: "检查申请",
          name: "inspectApply"
        }
      ],
      activeName: "testApply",
      cisCheckApplyData: {}
    };
  },
  /**
   * 1.页签变化，存入全局vx中(changeType){1.代表当前页签是检查还是检验}
   * 
   */
  created() {
    // 发送申请类型
    this.changeType(this.tabs[0].tip);
    this.getDictionaryInfo();
  },
  methods: {
    ...mapActions({
      changeType: "eleApply/changeType"
    }),
    changeTypeWrapper (item){
      try {
        let { tip } = this.tabs.find(sItem => sItem.name == item);
        console.log("tip", tip);
        this.changeType(tip);  
      } catch (error) {
        
      }
    },
    // 有未提交项 提示提交
    beforeLeave(item, a, b) {
      console.log(item, a, b);
      var p = new Promise(async (resolve, reject) => {   
        if (this.activeName == "testApply") {
          let hasDatas = this.getTestApplyApplicatNSlectList().length > 0;
          //有未提交的 项目
          if (hasDatas) {
            try {
              let { action } = await beforeLeaveConfirm();
              if (action == 'confirm') {
                await this.applicationSub();
              } 
              this.changeTypeWrapper(item);
              resolve();
            } catch (error) {
              reject();
            }
          } else {  
            this.changeTypeWrapper(item);
            resolve()
          }
        } else if (this.activeName == "inspectApply") {
          let hasDatas1 = this.getInspectApplyNSlectList().length > 0;
          //有未提交的 项目
          if (hasDatas1) {
            try {
              let { action } = await beforeLeaveConfirm();
              if (action == 'confirm') {
                await this.applicationInspectSub();
              }
              this.changeTypeWrapper(item);
              resolve();
            } catch (error) {
              reject();
            }
          } else {  
            this.changeTypeWrapper(item);
            resolve()
          }
        } else {
          this.changeTypeWrapper(item);
          resolve()
        }
      })  
      return p
    },    
    changeTab(tab, event) {
      console.log(tab, event);
      this.changeType(tab.$attrs.tip);
    },
    // 检验申请 未提交的数据
    getTestApplyApplicatNSlectList (){
      let aaa = [];
      try {
        console.log("执行了2");
        aaa = this.$refs.applicat.getNewSelectedList();
      } catch (error) {
        
      }
      return aaa;
    },
    // 检查申请 未提交的数据
    getInspectApplyNSlectList (){
      let aaa = [];
      try {
        aaa = this.$refs.inspectApply.getNewSelectedList();
      } catch (error) {
        
      }
      console.log("执行了2");
      return aaa;
    },
    // 检查申请提交方法 外部组件使用
    applicationInspectSub (){
      return new Promise(async (resolve, reject) => {
        try {
          await this.$refs.inspectApply.applicationSub();
          resolve(true);
        } catch (error) {
          console.log("报错了2");
          reject (false)
        }
      }) 
    },
    //  检验申请 提交方法 外部组件使用
    applicationSub (){
      return new Promise(async (resolve, reject) => {
        try {
          await this.$refs.applicat.applicationSub();
          resolve(true);
        } catch (error) {
          reject (false)
        }
      }) 
      
    },
    // 获取检查申请打印配置项
    async getDictionaryInfo() {
      try {
        let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum || "";
        let res = await cnfDictionaryService.getDictionaryInfo({
          catalogCode: "CIS_OUTAPTIENT_PARAMS",
          dicCode: "CIS_OUTAPTIENT_CHECKAPPLY",
          hosId
        });
        if(res.code === 1) {
          this.cisCheckApplyData = res.data;
        }
      } catch (error) {
        
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.applicat {
  position: relative;
  display: flex;
  height: 100%;
  background: $l-color-white;
  border-radius: 4px;
  /deep/ .el-tabs__nav-scroll {
    background-color: $l-color-bgcolor-18;
  }

  .el-tabs__content {
    height: 100%;
  }

  .contleft {
    width: 30px;
    height: 100%;

    .el-tab-pane {
      height: 100%;
    }
  }
}
.applicat-content {
  flex: 1;
  width: 0;
}
/deep/.el-table .freeRpRow {
  color: green;
}
</style>
