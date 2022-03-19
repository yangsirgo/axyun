<template>
  <el-tabs class="height100 tabsWrapper" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in datas" :key="item.index" lazy v-hasButton="item.resources">
      <span slot="label" style="position:relitive;">{{item.label}}<el-badge style="position:absolute;" :class="{'indexStyleBg': index != indexStyle}" :value="item.value" type="primary" v-if="item.value > 0" /></span>
      <keep-alive>
          <div style="height:calc(100% - 0px)" v-if="item.name === activeName">
              <component :is="item.component" ref="component" :name="item.name" :class="item.name"
                      @changeTabNum="changeTabNum"></component>
          </div>
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import infusionExecution from "@/views/cis/treatment/outpatientNurse/infusionExecution/module/main.vue";//输液
  import InjectionExecution from "@/views/cis/treatment/outpatientNurse/InjectionExecution/module/main.vue";//肌注
  import skinTestExecution from "@/views/cis/treatment/outpatientNurse/skinTestExecution/module/main.vue";//皮试
  import treatExecution from "@/views/cis/treatment/outpatientNurse/treatExecution/module/main.vue";//治疗
  import InspectionSampling from "@/views/cis/treatment/outpatientNurse/InspectionSampling/module/main.vue";//采样

  import {
    outpatientTypeCount, findHisStoryCount
  } from "@/api/cis/visit/visit";
  import { mapActions, mapGetters } from "vuex";

  export default {
    name: "tabWrapper",
    components: {
      infusionExecution,
      InjectionExecution,
      skinTestExecution,
      treatExecution,
      InspectionSampling
    },
    data() {
      return {
        activeName: "skinTestExecution",
        indexStyle:'0',
        datas: [{
          name:"skinTestExecution",
          label:"皮试执行",
          component: "skinTestExecution",
          resources:[],
          value: ''
        },{
          name:"infusionExecution",
          label:"输液执行",
          component: "infusionExecution",
          resources:[],
          value: ''
        },{
          name:"InjectionExecution",
          label:"肌注执行",
          component: "InjectionExecution",
          resources:[],
          value: ''
        },{
          name:"treatExecution",
          // label:"治疗执行",
          label:"其它执行",
          component: "treatExecution",
          resources:[],
          value: ''
        },
        // {
        //   name:"InspectionSampling",
        //   label:"检验采样",
        //   component: "InspectionSampling",
        //   resources:[],
        //   value: ''
        // },// 暂时去掉
        ],
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      messageHandler (val){//工具箱的透传数据
        // console.log("子组件 messageHandler");
        switch (this.activeName) {
          case "order":
            this.$nextTick(()=>{
              // console.log("子组件 执行了");
              // console.log(this.$refs.component);
              try {
                this.$refs.component[0].saveHandle();
              } catch (e) {

              }
            });
            break;
        }
      },
      handleClick(tab){
        console.log(tab,'tab');
        this.indexStyle = tab.index;
        this.$emit("tab-change",tab);
      },
      outpatientTypeCount(val){
        console.log('outpatientTypeCount',val)
        outpatientTypeCount({visitCode:val.visitCode}).then(res => {
          if (res.code === 1) {
            console.log("res.data",res.data)
            this.datas[0].value = res.data.skinCount
            this.datas[1].value = res.data.infusionCount
            this.datas[2].value = res.data.injectionCount
            this.datas[3].value = res.data.treatmentCount
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
      },
      findHisStoryCount(val){
        console.log('findHisStoryCount',val)
        findHisStoryCount({visitCode:val.visitCode}).then(res => {
          if (res.code === 1) {
            console.log("res.data",res.data)
            this.datas[0].value = res.data.skinCount
            this.datas[1].value = res.data.infusionCount
            this.datas[2].value = res.data.injectionCount
            this.datas[3].value = res.data.treatmentCount

            //已完成不显示tab待执行数量
            let val = this.receivePatientData
            if(val.patientId && val.visitCode && val.execType=='1'){
              this.datas[0].value = 0
              this.datas[1].value = 0
              this.datas[2].value = 0
              this.datas[3].value = 0
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
      },
      changeTabNum(){
        let val = this.receivePatientData
        if(val.patientId&&val.visitCode&&val.execType=='0'){
          this.outpatientTypeCount(val)
        }
        if(val.patientId&&val.visitCode&&val.execType=='1'){
          this.findHisStoryCount(val)
        }
      }
    },
    watch: {
      receivePatientData: {
        deep: true,
        immediate: true,
        handler(val) {
          if(val.patientId&&val.visitCode&&val.execType=='0'){
            this.outpatientTypeCount(val)
          }
          if(val.patientId&&val.visitCode&&val.execType=='1'){
            this.findHisStoryCount(val)
          }

        }
      },
      activeTabName:{
        deep: true,
        immediate: true,
        handler(val) {
          if(val == "second"){
            this.datas[0].value = 0
            this.datas[1].value = 0
            this.datas[2].value = 0
            this.datas[3].value = 0
          }
        }
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      ...mapGetters("cis", ["activeTabName"])
    }
  }
</script>

<style scoped lang="scss">
  .tabsWrapper {
    > /deep/.el-tabs__header{
      padding-left:8px;
      // padding-left: 16px;
      // border-bottom: 1px solid #f0f0f0;
      > .el-tabs__nav-wrap {
        > .el-tabs__nav-scroll {
          > .el-tabs__nav {
            > .el-tabs__item {
              padding: 0 12px!important;
            }
          }
        }

      }
    }

     .indexStyleBg /deep/ .el-badge__content--primary{
        background-color: #737f9a !important;
    }


  }
</style>
