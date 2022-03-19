<template>

  <div class="eHrArchivesLeft">
    <el-input v-model="queryData.queryConditions" placeholder="疾病/科室" @keyup.enter.native="searchFun" suffix-icon="el-icon-search"></el-input>
    <el-col :span="24" class="searchelCol">
      <el-col :span="10">
        <el-select v-model="value" @change="queryFirstFun" placeholder="请时间">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="10">
        <el-select v-model="value" placeholder="类别">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-col>
    <!-- 时间轴的显示 -->
    <div class="timeAxis">
      <el-col :span="24">
        <div class="blackStyleA lifeCycle" v-if="lifeCycleStyle">
              <el-col v-for="(item,index) in blackStyleSvg" :key="index" class="lifeCycleList">
                  <el-col :span="10" class="lifeCycleSvg"  v-bind:style="{'background':item.lifeCyclebg}" v-html="item.svgUrl">
                  </el-col>
                  <el-col :span="12">
                      <el-col class="blackStyle-text">{{item.lifeCycleName}}</el-col>
                      <el-col class="blackStyle-textA">{{item.lifeCycleAge}}</el-col>
                  </el-col>
              </el-col>
        </div>
        <div class="block" :class="{blackStyle:lifeCycleStyle}">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in elTimelineitem" :key="index" :timestamp="item.diagTime.substring(0,9)+' '+item.patientAge" placement="top" @click.native="timeAxisListFun(item)" name="nameStyle">
              <el-card class="elCardStyle" >
                <h5>{{item.diagName}} <span class="redBox">{{item.diagType == 2 ? "门诊":item.diagType == 3 ? "住院":"手术"}}</span></h5>
                <p class="redBoxPStyle">{{item.deptName}}</p>
              </el-card>
            </el-timeline-item>


          </el-timeline>

          <el-button @click="moreFun">更多</el-button>

        </div>
      </el-col>
    </div>

  </div>
</template>

<script>
  import blackStyleSvg from './blackStyleSvg';
   import {selectFinInp } from '@/api/eHrArchives/eHrArchives';
  export default {
    name: "index",
    data() {
      return {
        // 生命周期图表列表
        blackStyleSvg: blackStyleSvg,
        // 判断生命周期显示
        lifeCycleStyle: false,

        // 想其他组件传值字段
        eHrArchivesRightData: {
              eHrArchivesRight: 1
        },
        // 时间轴列表
        elTimelineitem: [],
        // 查询字段
        queryData: {
          queryConditions: '',
          orderBy: 1,//默认按照时间排序
          pageNo: 1,
          pageSize: 10
        },

        // 时间下拉测试字段
        options: [{
          value: '1',
          label: '按照时间'
        }, {
          value: '2',
          label: '按照生命周期'
        }],
        options1: [{
          value: '1',
          label: '按照时间'
        }, {
          value: '2',
          label: '按照生命周期'
        }],
        value: '按照时间'

      }
    },

    computed: {

    },
    watch: {

    },
    created() {
        this.selectFinInpFun(this.queryData);

    },
    methods: {
      // 查询
      searchFun(){
        this.queryData.pageNo = 1;
        this.selectFinInpFun(this.queryData);
      },
      // 更多
      moreFun(){
        this.queryData.pageNo++;
        this.selectFinInpFun(this.queryData);
      },
      // 查询历次就诊信息  ehr/selectFinInp
     async selectFinInpFun(obj){
          let result = await selectFinInp(obj);
          if(result.code == '1'){

              if(this.queryData.pageNo > 1){
                this.elTimelineitem = this.elTimelineitem.concat(result.data);
                console.log(this.elTimelineitem);
              }else{
                this.elTimelineitem = result.data;
                // 默认串第一个显示
                this.timeAxisListFun(this.elTimelineitem[0])
              }
          }
      },
      // 第一个搜索款切换
      queryFirstFun(a){
        this.elTimelineitem = [];
          if(a == 2){
            this.queryData.pageNo = 1;
            this.lifeCycleStyle = true;
            this.queryData.orderBy = 2;
            this.selectFinInpFun(this.queryData);
          }else{
            this.lifeCycleStyle = false;
            this.queryData.pageNo = 1;
            this.queryData.orderBy = 1;
            this.selectFinInpFun(this.queryData);
          }
      },
      // 点击时间轴内容列表传值
      timeAxisListFun(item){
          this.eHrArchivesRightData.eHrArchivesRight = 2;
          this.$emit("eHrArchivesRightDataFun",item)
      }
    }
  }
</script>

<style scoped lang="scss">
  .eHrArchivesLeft {
    box-sizing: border-box;
    padding-top: 15px;
    height: 100%;
    .elCardStyle{
      padding: 5px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .redBoxPStyle{
      height:17px;
      font-size:12px;
      color:rgba(148,157,163,1);
      line-height:17px;
    }
    .redBox {

      font-size: 10px;
      color: red;
      line-height: 15px;
      width: 30px;
      height: 16px;
      background: rgba(241, 89, 36, .2);
      border-radius: 3px;
      border: 1px solid rgba(241, 89, 36, .2);
      padding: 2px;
    }

    .searchelCol {
      height: auto;
      box-sizing: border-box;
      padding-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .timeAxis {
      overflow: auto;
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
      height: calc(100% - 50px);
    }

    .timeAxis .block {
      height: 400px;
      overflow: auto;
      width: 100%;
      padding-left: 5px;
      margin-top: 15px;
    }
    .blackStyleA{
      width: 35%;
    }
    .timeAxis .blackStyle{
      width: 65%;
    }
    .lifeCycleSvg{
        width:40px;
        height:40px;
        border-radius:8px;
        margin-right: 5px;
    }
    .lifeCycleSvg /deep/ svg{
          width: 100%;
          height:100%;
          border-radius:8px;
    }
    .blackStyle-text{
        font-size:14px;
        color:rgba(46,50,58,1);
        line-height:20px;
    }
    .blackStyle-textA{
      font-size:12px;
      color:rgba(148,157,163,1);
      line-height:17px;
    }
    .lifeCycleList{
      margin:8px 0 8px 0;
    }
  }
</style>
