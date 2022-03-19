<template>
  <div class="height100 width100 body-div">
    <div style="margin-left: 24px">
      <el-row class="width100">
        <el-col :span=12>
          <span class="float-left title-span" type="text">预约时间</span>
        </el-col>
        <el-col :span=12>
          <el-button class="float-right" @click="nextWeek">下一周</el-button>
          <el-button class="float-right" autofocus @click="nowWeek">本周</el-button>
          <el-button class="float-right" @click="lastWeek">上一周</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-left: 24px" class="width100 l-clearfix:after">
      <div class="block table-title">
        <el-button type="text">时间</el-button>
      </div>
      <div class="block table-title" v-for="item in dateList" :key="item.index">
        {{item.nowDate+'  '+item.week}}
      </div>
    </div>
    <div style="margin-left: 24px" class="width100 l-clearfix:after">
      <div class="block">上</div>
      <div :class="am.mon.flag?'full':'surplus'">
        <el-row>
          <span>{{am.mon.flag?'已满':am.mon.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{am.mon.num}}</span>
        </el-row>
      </div>
      <div :class="am.tue.flag?'full':'surplus'">
        <el-row>
          <span>{{am.tue.flag?'已满':am.tue.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{am.tue.num}}</span>
        </el-row>
      </div>
      <div :class="am.wed.flag?'full':'surplus'">
        <el-row>
          <span>{{am.wed.flag?'已满':am.wed.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{am.wed.num}}</span>
        </el-row>
      </div>
      <div :class="am.thu.flag?'full':'surplus'">
        <el-row>
          <span>{{am.thu.flag?'已满':am.thu.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{am.thu.num}}</span>
        </el-row>
      </div>
      <div :class="am.fri.flag?'full':'surplus'">
        <el-row>
          <span>{{am.fri.flag?'已满':am.fri.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{am.fri.num}}</span>
        </el-row>
      </div>
      <div :class="am.sat.flag?'full':'surplus'">
        <el-row>
          <span>{{am.sat.flag?'已满':am.sat.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{am.sat.num}}</span>
        </el-row>
      </div>
      <div :class="am.sun.flag?'full':'surplus'">
        <el-row>
          <span>{{am.sun.flag?'已满':'预约'}}</span>
        </el-row>
        <el-row>
          <span>{{am.sun.num}}</span>
        </el-row>
      </div>
    </div>
    <div style="margin-left: 24px" class="width100 l-clearfix:after">
      <div class="block">下</div>
      <div :class="pm.mon.flag?'full':'surplus'">

          <el-row>
            <el-dropdown placement="bottom-start" @command="handleCommand">
              <span>{{pm.mon.flag?'已满':pm.mon.num?'预约':''}}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled>挂号费：25元</el-dropdown-item>
                <el-dropdown-item command="09:00-10:00">09:00-10:00</el-dropdown-item>
                <el-dropdown-item command="10:00-11:00">10:00-11:00</el-dropdown-item>
                <el-dropdown-item>12:00-12:00</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
          <el-row>
            <span>{{pm.mon.num}}</span>
          </el-row>

      </div>
      <div :class="pm.tue.flag?'full':'surplus'">
        <el-row>
          <span>{{pm.tue.flag?'已满':pm.tue.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{pm.tue.num}}</span>
        </el-row>
      </div>
      <div :class="pm.wed.flag?'full':'surplus'">
        <el-row>
          <span>{{pm.wed.flag?'已满':pm.wed.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{pm.wed.num}}</span>
        </el-row>
      </div>
      <div :class="pm.thu.flag?'full':'surplus'">
        <el-row>
          <span>{{pm.thu.flag?'已满':pm.thu.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{pm.thu.num}}</span>
        </el-row>
      </div>
      <div :class="pm.fri.flag?'full':'surplus'">
        <el-row>
          <span>{{pm.fri.flag?'已满':pm.fri.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{pm.fri.num}}</span>
        </el-row>
      </div>
      <div :class="pm.sat.flag?'full':'surplus'">
        <el-row>
          <span>{{pm.sat.flag?'已满':pm.sat.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{pm.sat.num}}</span>
        </el-row>
      </div>
      <div :class="pm.sun.flag?'full':'surplus'">
        <el-row>
          <span>{{pm.sun.flag?'已满':pm.sun.num?'预约':''}}</span>
        </el-row>
        <el-row>
          <span>{{pm.sun.num}}</span>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
// 重写date 格式化方法
Date.prototype.toLocaleString = function() {
  return (
    (this.getMonth() + 1) +
    "-" +
    this.getDate()
  );
};
export default {
  props: ["searchForm"],
  data() {
    return {
      // 上
      am: {
        mon:{
          num:'12/20'
        },
        tue:{},
        wed:{},
        thu:{},
        fri:{
          flag:'1',
          num:'20/20'
        },
        sat:{},
        sun:{
          flag:'1',
          num:'20/20'
        },

      },
      // 下
      pm: {
        mon:{
          num:'12/20'
        },
        tue:{
          num:'12/20'
        },
        wed:{},
        thu:{
          flag:'1',
          num:'20/20'
        },
        fri:{},
        sat:{},
        sun:{}
      },
      formDate:{
        nowDate:'',
        week:'',
      },
      // 日期数组
      dateList:[
        {
          nowDate:'',
          week:'',
        },{
          nowDate:'',
          week:'',
        },{
          nowDate:'',
          week:'',
        },{
          nowDate:'',
          week:'',
        },{
          nowDate:'',
          week:'',
        },{
          nowDate:'',
          week:'',
        },{
          nowDate:'',
          week:'',
        }
      ],
      // 当前时间
      currentDate:new Date(),
    };
  },
  mounted() {
    this.getDate();
  },
  methods: {
    //排班
    // 日期
    getDate(dateFlag) {
      var currentDate = this.currentDate;
      const weeks = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
      if(dateFlag){
        currentDate = dateFlag;
      }
      let a = new Date(currentDate).getDay();
      for(let i=0;i<7;i++){
        // 周一的时间
        let date = currentDate-a*60*60*24*1000;
        this.dateList[i].week = weeks[i];
        let b = date + 60*60*24*1000 * (i+1);
        this.dateList[i].nowDate = new Date(b).toLocaleString();
      }
    },
    lastWeek(){
      // 上周时间
      this.currentDate = this.currentDate-7*60*60*24*1000;
      this.getDate();
    },
    nowWeek(){
      // 本周
      this.currentDate = new Date();
      this.getDate();
    },
    nextWeek(){
      // 下周时间
      this.currentDate = this.currentDate.valueOf() + 7*60*60*24*1000;
      this.getDate();
    },
    // 点击预约时间
    handleCommand(command) {
      this.$emit("selectTime",{command})
    }

  }

};
</script>
<style lang="scss" scoped>
.body-div {
  .block {
    float: left;
    width: 12.4%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    line-height: 68px;
  }
  .table-title {
    background: #f7f8fa;
    font-size:14px;
    color: #2E323A;
    height: 41px;
    line-height: 41px;
  }
  .task {
    height: 80px;
  }
  .title-span{
    font-size:14px;
    font-weight:bold;
    color:rgba(148,157,163,1);
    line-height:35px;
  }
  .el-button{
    border: none;
  }
  .full{
    float: left;
    width: 12.4%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    padding-top: 15px;
    span{
      font-size:14px;
      color:rgba(208,208,208,1);
    }
    background:rgba(245,245,245,1);
  }
  .surplus{
    float: left;
    width: 12.4%;
    height: 68px;
    text-align: center;
    border: 1px solid #ededed;
    padding-top: 15px;
    span{
      font-size:14px;
      color:rgba(61,125,251,1);
    }
  }
}
</style>
