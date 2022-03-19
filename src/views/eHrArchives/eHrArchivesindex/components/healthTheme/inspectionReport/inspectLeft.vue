<template>

  <div class="eHrArchivesLeft">
    <!-- <el-input v-model="searchnput" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input> -->
    <el-col :span="24" class="searchelCol">
    <!--  <el-col :span="10">
        <el-select v-model="value" @change="queryFirstFun" placeholder="请时间">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
      </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="10">
        <el-select v-model="value" placeholder="请时间">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-col>
    <!-- 时间轴的显示 -->
    <div class="timeAxis">
      <el-col :span="24">
        <div class="block" :class="{blackStyle:lifeCycleStyle}">
          <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top" @click.native="timeAxisListFun()" name="nameStyle">
              <el-card class="elCardStyle" >
                <h5>吉祥呼吸道感染 <span class="redBox">门诊</span></h5>
                <p class="redBoxPStyle">内科</p>
              </el-card>
            </el-timeline-item>

            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card class="elCardStyle">
                <h5>吉祥呼吸道感染 <span class="redBox">门诊</span></h5>
                <p class="redBoxPStyle">内科</p>
              </el-card>
            </el-timeline-item>

            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card class="elCardStyle">
                <h5>吉祥呼吸道感染 <span class="redBox">门诊</span></h5>
                <p class="redBoxPStyle">内科</p>
              </el-card>
            </el-timeline-item>

            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card class="elCardStyle">
                <h5>吉祥呼吸道感染 <span class="redBox">门诊</span></h5>
                <p class="redBoxPStyle">内科</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <el-button>更多</el-button>

        </div>
      </el-col>
    </div>

  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        // 生命周期图表列表
        blackStyleSvg: "",
        // 判断生命周期显示
        lifeCycleStyle: false,

        // 想其他组件传值字段
        eHrArchivesRightData: {
              eHrArchivesRight: 1
        },
        // 查询字段
        searchnput: '',
        // 时间下拉测试字段
        options: [{
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

    },
    methods: {
      // 第一个搜索款切换
      queryFirstFun(a){
          if(a == 2){
            this.lifeCycleStyle = true;
          }else{
            this.lifeCycleStyle = false;
          }
      },
      // 点击时间轴内容列表传值
      timeAxisListFun(){
          this.eHrArchivesRightData.eHrArchivesRight = 2;
          this.$emit("eHrArchivesRightDataFun",this.eHrArchivesRightData)
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
