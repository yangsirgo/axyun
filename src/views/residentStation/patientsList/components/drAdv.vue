<template>
  <div class="containers height100 position-relative" ref="page1">
    <div class="aside-hidden-btn cursor-pointer" :style="{left: Number(asideWidth) - 20 + 'px'}" @click="handleHiddenAside">
      <i class="el-icon-arrow-left" :style="{ transform: asideHidden?'rotate(180deg)':''}"></i>
    </div>
    <el-card class="left height100" :style="{width: asideWidth + 'px'}">
      <div style="padding: 0 20px">
        <l-card-title>
          <span slot="left">患者列表</span>
        </l-card-title>
        <el-input
          placeholder="搜索"
          v-model="keyWord">
          <i slot="suffix" class="el-icon-search cursor-pointer" @click="search" style="margin-top: 10px;"></i>
        </el-input>
      </div>
      <el-table
        class="patients-list"
        :data="patientsList"
        @row-click="handleSelectPatient"
        highlight-current-row
        v-loading="tl_isLoading"
        v-loadmore ="{noMoreVar:'tl_noMore', loadingVar: 'tl_isLoading', value: loadPatientsNext}"
        stripe
        :max-height="maxHeight"
        style="width: 100%">
        <el-table-column
          width="70"
          label="床号">
          <template slot-scope="scope">
            <span>{{scope.row.bedNum}}</span> 床
          </template>
        </el-table-column>
        <el-table-column
          width="75"
          prop="patientName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="patientGender"
          width="70"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="patientAge"
          width="70"
          label="年龄">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="right Height100" :style="{'margin-left': Number(asideWidth) + 20 + 'px'}">
      <div>
        234
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        asideHidden: false, // 侧边栏显示隐藏
        asideWidth: '287', // 侧边栏宽度
        maxHeight: '', // 左侧患者列表最大高度
        keyWord: '',
        tl_noMore: false, // 患者列表没有更多状态
        tl_isLoading: false, // 患者列表请求状态
        patientsList: [
          {
            bedNum: '01',
            patientName: '张三',
            patientGender: '男',
            patientAge: '22'
          },
          {
            bedNum: '01',
            patientName: '张三',
            patientGender: '男',
            patientAge: '22'
          },
          {
            bedNum: '01',
            patientName: '张三',
            patientGender: '男',
            patientAge: '22'
          },
          {
            bedNum: '01',
            patientName: '张三',
            patientGender: '男',
            patientAge: '22'
          },
          {
            bedNum: '01',
            patientName: '张三',
            patientGender: '男',
            patientAge: '22'
          }
        ]
      }
    },
    created (){
      this.fetchPatientsList()
    },
    updated (){
      this.maxHeight = this.$refs.page1.clientHeight - 120;
    },
    methods: {
      search (){
        // 搜索方法
        console.log(1);
      },
      handleSelectPatient (row, index){ // 患者列表选择
        console.log(row, index);
      },
      async fetchPatientsList (){ // 请求 患者列表
        try {
          const _this = this
          setTimeout(function () {
            _this.patientsList.push({
              bedNum: '01',
              patientName: '张三',
              patientGender: '男',
              patientAge: '22'
            })
            _this.tl_isLoading = false
          }, 2000)
        }catch (e) {
          console.log('报错了。。')
        }
      },
      loadPatientsNext (){
        console.log('加载下一页')
        this.fetchPatientsList()
      },
      handleHiddenAside (){ // 侧边栏显示隐藏
        if(this.asideHidden){
          this.asideWidth = 287;
          this.asideHidden = false
        }else{
          this.asideWidth = 0;
          this.asideHidden = true
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .containers{
    overflow:hidden;
    .aside-hidden-btn{
      position: absolute;
      top: calc(50% - 40px);
      line-height: 80px;
      text-align: center;
      z-index: 10000;
      border: 1px solid $l-color-bgcolor-11;
      border-radius: 2px;
      i{transition: transform 0.5s;}
    }
    .left{
      float: left;
      height: 100%;
      .patients-list{
        color: $l-color-fontcolor-3;
        margin-top: 20px;
      }
    }
    .right{
      height:100%;
    }
  }

</style>
