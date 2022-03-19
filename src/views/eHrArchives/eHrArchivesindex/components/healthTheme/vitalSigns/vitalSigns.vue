<template>
  <div class="vitalSigns">
    <el-col :span="24">

      <el-col :span="4">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="20" class="elMenuBox">
        <div class="elMenuLeft">
          <el-menu :default-active="activeIndexCentent" class="el-menu-demo" mode="horizontal" @select="handleSelectCenter"
            background-color="rgba(242,244,246,1)" text-color="#000000" active-text-color="#ffffff">
            <el-menu-item index="0">全部</el-menu-item>
            <el-menu-item index="1">门诊用药 </el-menu-item>
            <el-menu-item index="2"> 住院用药</el-menu-item>
            <!-- <el-submenu index="4">
              <template slot="title">住院用药 </template>
              <el-menu-item index="4-1">选项1</el-menu-item>
              <el-menu-item index="4-2">选项2</el-menu-item>
              <el-menu-item index="4-3">选项3</el-menu-item>
            </el-submenu> -->
            <el-menu-item index="3">出院带药 </el-menu-item>
          </el-menu>

        </div>

        <div class="elMenuRight">
          <el-menu :default-active="activeIndexRight" class="el-menu-demo" mode="horizontal" @select="handleSelectRight">
            <el-menu-item index="0">
              <template slot="title">
                <span>按用药总数</span>
                <i class="el-icon-sort"></i>
              </template>
            </el-menu-item>
            <el-menu-item index="1">
              <template slot="title">
                <span>按用药次数</span>
                <i class="el-icon-sort"></i>
              </template>
            </el-menu-item>

          </el-menu>
        </div>



      </el-col>

    </el-col>

    <el-col class="vitalSignsList infinite-list" v-infinite-scroll="load" infinite-scroll-immediate='false' infinite-scroll-distance="100px">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item class="infinite-list-item" :name="index" v-for="(item,index) in vitalSignsData" :key="index">
          <template slot="title">
            <span class="vitalSignsTitle-span">西</span>
            <span class="vitalSignsTitle-text">{{!item.orderItemName ? '--':item.orderItemName}}</span>
            <span class="vitalSignsTitle-text">{{!item.spec ? '--':item.spec}}</span>
          </template>
          <el-col class="dosing-style">
            <el-col :span="2">
              <el-col class="dosing-title">用药计量</el-col>
              <el-col>
                <span class="dosing-text1">{{!item.totalDosage ? '--':item.totalDosage}}</span>
                <span class="dosing-text2">毫克</span>
              </el-col>
            </el-col>
            <el-col :span="2">
              <el-col class="dosing-title">用药次数</el-col>
              <el-col>
                <span class="dosing-text1">{{!item.medicationsCount ? '--':item.medicationsCount}}</span>
                <span class="dosing-text2">次</span>
              </el-col>
            </el-col>
            <el-col :span="20" v-if="item.recenMedicationVOS">
              <el-col class="dosing-textbox">
                <el-col class="dosing-text2">最近</el-col>
                <el-col class="dosing-text2">{{item.recentTimesCount>5 ? 5:item.recentTimesCount == ''?'--':item.recentTimesCount}}次</el-col>
              </el-col>

              <el-col :span="4" class="dosing-border" v-for="(itemA,index) in item.recenMedicationVOS" :key="index" v-if="index < 5">
                <el-col class="dosing-ke">总剂量：{{item.TotalDosage}}毫克</el-col>
                <el-col class="dosing-line"></el-col>
                <el-col class="dosing-time">
                  <span>{{itemA.startTime}}</span>
                  <span>{{itemA.endTime}}</span>
                </el-col>
              </el-col>




            </el-col>
          </el-col>

        </el-collapse-item>

      </el-collapse>



    </el-col>





  </div>
</template>

<script>
    import {selectMedication } from '@/api/eHrArchives/eHrArchives';
  export default {
    name: "vitalSignsindex",
    data() {
      return {
        // 查询条件
        queryData: {
            queryConditions: null,
            orderBy: 0,
            orderColumn: '',
            pageNo: 1,
            pageSize: 10
        },
         // 返回的数据列表
        vitalSignsData: [],
        activeNames: ['1'],
        options: [{
          value: '0',
          label: '全部单位'
        }, {
          value: '1',
          label: '个别单位'
        }],
        value: '0',
        activeIndexCentent: '0',
        activeIndexRight: '0'

      }


    },

    computed: {

    },
    watch: {

    },
    created() {
        this.selectMedication(this.queryData)
    },
    methods: {
      // 下拉加载
      load(){
        this.queryData.pageNo++;
        this.selectMedication(this.queryData)
      },
      // 刷选用药情况
      async selectMedication(obj){
           let result = await selectMedication(obj);
           console.log("selectMedication",this.queryData.pageNo)
           if(result.code == '1'){
             if(this.queryData.pageNo == 1){
               this.vitalSignsData = result.data;
             }else{
               this.vitalSignsData = this.vitalSignsData.concat(result.data)
             }
             console.log(this.vitalSignsData);

           }
       },
       // 中间帅选
       handleSelectCenter(key){
         this.vitalSignsData = [];
         this.queryData.pageNo = 1;
         console.log("handleSelectCenter",this.queryData.pageNo)
         this.queryData.queryConditions = key;
         if(this.queryData.queryConditions == '0'){
           this.queryData.queryConditions = null;
         }

         this.selectMedication(this.queryData)
       },
       // right 帅选
       handleSelectRight(key){
         this.vitalSignsData = [];
         this.queryData.pageNo = 1;
         this.queryData.orderColumn = key;
        //  if(key == 0){
        //    if(this.queryData.orderBy == 0){
        //       this.queryData.orderBy = 1;
        //    }else{
        //      this.queryData.orderBy = 0;
        //    }
        //  }else{
           if(this.queryData.orderBy == 0){
              this.queryData.orderBy = 1;
           }else{
             this.queryData.orderBy = 0;
           }
        //  }
         this.selectMedication(this.queryData)
       },
      // 切换table
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped lang="scss">
  .vitalSigns {
    /deep/ .el-collapse-item__header {
      margin-top: 15px;
      height: 35px;
      line-height: 35px;
      padding-left: 0px;
    }

    /deep/ .el-collapse-item__content {
      padding: 0px;
    }

    /deep/ .el-collapse-item__header {
      background-color: transparent;
    }

    .dosing-textbox {
      width: 30px;
      text-align: center;
      line-height: 42px;
    }

    /deep/ .el-menu.el-menu--horizontal {
      border-bottom: 0px;
    }

    .elMenuLeft /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
      height: 36px;
      line-height: 36px;
    }

    .elMenuLeft /deep/ .el-menu--horizontal>.el-menu-item {
      height: 36px;
      line-height: 36px;
    }

    .elMenuLeft /deep/ .el-menu--horizontal>.el-menu-item.is-active {
      color: rgb(255, 255, 255) !important;
      border-bottom-color: transparent !important;
      background-color: rgba(44, 69, 131, 1) !important;
    }

    .elMenuRight /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
      height: 36px;
      line-height: 36px;
    }

    .elMenuRight /deep/ .el-menu--horizontal>.el-menu-item {
      height: 36px;
      line-height: 36px;
    }

    .elMenuRight /deep/ .el-menu--horizontal>.el-menu-item.is-active {
      color: rgba(44, 69, 131, 1) !important;
      border-bottom-color: transparent !important;
      background-color: transparent !important;
    }

    .elMenuRight /deep/ .el-menu--horizontal>.el-menu-item.is-active .el-icon-sort {
      color: rgba(44, 69, 131, 1) !important;
    }

    .vitalSignsTitle-span {
      width: 20px;
      height: 16px;
      background: rgba(44, 69, 131, 1);
      border-radius: 3px;
      display: inline-block;
      font-size: 10px;
      color: rgba(255, 255, 255, 1);
      line-height: 15px;
      text-align: center;
      margin-right: 10px;
    }

    .vitalSignsTitle-text {
      font-size: 14px;
      font-weight: 600;
      color: rgba(46, 50, 58, 1);
      line-height: 20px;
      display: inline-block;
    }

    .dosing-style {
      padding: 10px 0 10px 0;
    }

    .dosing-title {
      font-size: 12px;
      color: rgba(46, 50, 58, 1);
      line-height: 17px;
    }

    .dosing-text1 {
      font-size: 20px;
      font-weight: 500;
      color: rgba(44, 69, 131, 1);
      line-height: 26px;
    }

    .dosing-text2 {
      font-size: 10px;
      color: rgba(46, 50, 58, 1);
      line-height: 15px;
    }

    .dosing-ke {
      height: 15px;
      font-size: 10px;
      color: rgba(46, 50, 58, 1);
      line-height: 15px;
      text-align: center;
    }

    .dosing-line {
      height: 5px;
      background: rgba(44, 69, 131, 1);
      margin: 0px 0 5px 0;
    }

    .dosing-time {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .dosing-time span {
      font-size: 10px;
      color: rgba(149, 158, 164, 1);
      line-height: 12px;
    }

    .dosing-border {
      border-left: 1px solid rgba(240, 240, 240, 1);
      border-right: 1px solid rgba(240, 240, 240, 1);
    }

    .elMenuBox {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .vitalSignsList{
      height: 500px;
      padding-bottom: 50px;
      overflow: auto;
    }
  }
</style>
