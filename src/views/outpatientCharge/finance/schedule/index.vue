<template>
  <div class="container" ref="page">
    <div class="height100 width100 div-base position-relative">
      <div class="div-top">
        <el-row class="height100 width100">
          <el-col :span="12">
            <el-button type="primary" class="margin-left-10">复制上周</el-button>
            <el-button type="primary">复制指定周次</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" class="float-right margin-right-10">保存排班</el-button>
            <el-button type="primary" class="float-right margin-right-10">发布排班</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="div-body">
        <!-- 头部 -->
        <div class="table-title">
          <div class="table-title-left">
            <div class="block-top">
              <el-dropdown @command="handleCommand" placement="bottom-start">
                <span class="el-dropdown-link">
                  {{dropTitle}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in dropDowns"
                    :key="item.id"
                    :command="item"
                  >{{item.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="block-bottom">
              <el-checkbox v-model="outDoctor" class="margin-left-10">出诊医生</el-checkbox>
            </div>
          </div>
          <div class="table-title-right">
            <div class="block-top">
              <el-button
                class="float-left"
                size="small"
                icon="el-icon-arrow-left"
                @click="lastWeekM()"
                v-if="currentWeek===1?false:true"
              >第{{currentWeek-1}}周</el-button>
              <span style="height:18px;color:#E4E4E4;" class="margin-right-6 font">|</span>
              <span>第{{currentWeek}}周</span>
              <span style="height:18px;color:#E4E4E4;" class="margin-left-6 font">|</span>
              <el-button class="float-right" size="small" @click="nextWeekM()">
                第{{currentWeek+1}}周
                <i class="el-icon-arrow-right el-icon--right"></i>
              </el-button>
            </div>
            <div class="block-bottom">
              <div
                class="block"
                style="border-bottom: 1px solid #e4e4e4;"
                v-for="item in dateList"
                :key="item.index"
              >{{item.nowDate+' '+item.week}}</div>
            </div>
          </div>
          <!-- 数据列表 -->
          <el-checkbox-group v-model="checkList">
            <div class="table-block" v-for="item in doctorList" :key="item.id">
              <!-- 医生列表 -->
              <div class="table-title-left block-left">
                <el-row class="width100 height100">
                  <el-col :span="19">
                    <el-checkbox :label="item.id" class="margin-left-10">
                      <span>{{item.name+'-['+item.workCode+']'}}</span>
                    </el-checkbox>
                  </el-col>
                  <el-col :span="5" class="height100">
                    <div class="font-class">
                      <span>上午</span>
                    </div>
                    <div class="font-class">
                      <span>下午</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <!-- 班次列表 -->
              <div class="table-block-right">
                <!-- 周一 -->
                <div class="block">
                  <el-row class="width100">
                    <el-select v-model="item.am.mon" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[0].nowDate+';am;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="width100 mar-top-5">
                    <el-select v-model="item.pm.mon" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[0].nowDate+';pm;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                </div>
                <!-- 周二 -->
                <div class="block">
                  <el-row class="width100">
                    <el-select v-model="item.am.tue" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[1].nowDate+';am;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="width100 mar-top-5">
                    <el-select v-model="item.pm.tue" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[1].nowDate+';pm;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                </div>
                <!-- 周三 -->
                <div class="block">
                  <el-row class="width100">
                    <el-select v-model="item.am.wed" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[2].nowDate+';am;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="width100 mar-top-5">
                    <el-select v-model="item.pm.wed" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[2].nowDate+';pm;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                </div>
                <!-- 周四 -->
                <div class="block">
                  <el-row class="width100">
                    <el-select v-model="item.am.thu" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[3].nowDate+';am;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="width100 mar-top-5">
                    <el-select v-model="item.pm.thu" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[3].nowDate+';pm;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                </div>
                <!-- 周五 -->
                <div class="block">
                  <el-row class="width100">
                    <el-select v-model="item.am.fri" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[4].nowDate+';am;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="width100 mar-top-5">
                    <el-select v-model="item.pm.fri" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[4].nowDate+';pm;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                </div>
                <!-- 周六 -->
                <div class="block">
                  <el-row class="width100">
                    <el-select v-model="item.am.sat" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[5].nowDate+';am;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="width100 mar-top-5">
                    <el-select v-model="item.pm.sat" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[5].nowDate+';pm;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                </div>
                <!-- 周日 -->
                <div class="block">
                  <el-row class="width100">
                    <el-select v-model="item.am.sun" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[6].nowDate+';am;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                  <el-row class="width100 mar-top-5">
                    <el-select v-model="item.pm.sun" placeholder="请选择门诊类型" class="select-width" @change="setSchedule">
                      <el-option
                        v-for="opt in options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value+';'+dateList[6].nowDate+';pm;'+item.id"
                      ></el-option>
                    </el-select>
                  </el-row>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adHeight from "@/mixins/adHeight";
Date.prototype.toLocaleString = function() {
  return this.getMonth() + 1 + "-" + this.getDate();
};
export default {
  mixins: [adHeight],
  data() {
    return {
      // 科室集合
      dropDowns: [
        {
          id: "212",
          name: "泌尿外科"
        },
        {
          id: "232",
          name: "普外科"
        }
      ],
      // 下拉菜单标题
      dropTitle: "选择科室",
      // 出诊医生
      outDoctor: false,
      // 当前周
      currentWeek: "35",
      // 日期数组
      dateList: [
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        },
        {
          nowDate: "",
          week: ""
        }
      ],
      // 当前时间
      currentDate: new Date(),
      // 医生集合
      doctorList: [
        {
          id: "123",
          name: "李楠",
          workCode: "主治医师",
          am: {
            mon: "测试门诊",
            tue:'',
            wed:'',
            thu:'',
            fri:'',
            sat:'',
            sun:''
          },
          pm: {
            mon: "测试门诊",
            tue:'',
            wed:'',
            thu:'',
            fri:'',
            sat:'',
            sun:''
          }
        },
        {
          id: "1223",
          name: "李晓楠",
          workCode: "主任医师",
          am: {
            mon: "测试门诊",
            tue:'',
            wed:'',
            thu:'',
            fri:'',
            sat:'',
            sun:''
          },
          pm: {
            mon: "测试门诊",
            tue:'',
            wed:'',
            thu:'',
            fri:'',
            sat:'',
            sun:''
          }
        }
      ],
      checkList: [],
      // 门诊类型
      options: [
        {
          label: "普通门诊",
          value: "1"
        },
        {
          label: "专家门诊",
          value: "2"
        },
        {
          label: "特需门诊",
          value: "3"
        }
      ]
    };
  },
  mounted() {
    this.getDate();
    this.getYearWeek();
  },
  methods: {
    handleCommand(item) {
      this.dropTitle = item.name;
    },
    // 日期
    getDate(dateFlag) {
      var currentDate = this.currentDate;
      const weeks = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      if (dateFlag) {
        currentDate = dateFlag;
      }
      let a = new Date(currentDate).getDay();
      for (let i = 0; i < 7; i++) {
        // 周一的时间
        let date = currentDate - a * 60 * 60 * 24 * 1000;
        this.dateList[i].week = weeks[i];
        let b = date + 60 * 60 * 24 * 1000 * (i + 1);
        this.dateList[i].nowDate = new Date(b).toLocaleString();
      }
    },
    lastWeekM() {
      // 上周时间
      this.currentDate = this.currentDate - 7 * 60 * 60 * 24 * 1000;
      this.getDate();
      this.getYearWeek();
    },
    nowWeekM() {
      // 本周
      this.currentDate = new Date();
      this.getDate();
    },
    nextWeekM() {
      // 下周时间
      this.currentDate = this.currentDate.valueOf() + 7 * 60 * 60 * 24 * 1000;
      this.getDate();
      this.getYearWeek();
    },
    // 拿到当前的第几周
    getYearWeek() {
      var date1 = this.currentDate;
      var date2 = new Date(new Date().getFullYear(), 0, 1);
      var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
      this.currentWeek = Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
    },
    // 选中挂号类型
    setSchedule(item){
      console.info(item)
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  overflow: hidden;
  margin-top: 30px;
  padding: 0 20px;
  min-width: 1024px;

  .div-base {
    background: rgba(255, 255, 255, 1);
    box-shadow: 4px 0px 6px 0px rgba(0, 0, 0, 0.15);
  }
  .div-top {
    width: 100%;
    height: 60px;
    padding-top: 10px;
  }
  .div-body {
    width: 100%;

    position: absolute;
    height: auto;
    top: 60px;
    bottom: 0px;
    .table-title {
      width: 100%;
      height: 139px;
      background: rgba(246, 246, 246, 1);
    }
    .table-title-left {
      float: left;
      width: 277px;
      height: 100%;
      background: rgba(255, 255, 255, 1);
      box-shadow: 4px 0px 6px 0px rgba(0, 0, 0, 0.15);
    }
    .table-title-right {
      margin-left: 277px;
      height: 100%;
    }
    .block-top {
      height: 76px;
      width: 100%;
      border-top: 1px solid #e4e4e4;
      text-align: center;
      line-height: 30px;
      padding: 20px 10px 0px 10px;
      font-size: 18px;
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
    }
    .block-bottom {
      height: 62px;
      width: 100%;
      border-top: 1px solid #e4e4e4;
      line-height: 60px;
    }
    .block {
      float: left;
      width: 14.25%;
      height: 100%;
      border-right: 1px solid #e4e4e4;
      // border-bottom: 1px solid #e4e4e4;
      padding-top: 5px;
      text-align: center;
      color: #2e323a;
    }
    .table-block {
      height: 100px;
      width: 100%;
      // border-top: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      .table-block-right {
        margin-left: 277px;
        height: 100%;
      }
    }
    .block-left {
      span {
        font-size: 14px;
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        line-height: 90px;
      }
    }
    .select-width {
      width: 90%;
      height: 45px !important;
    }
    .font-class {
      width: 100%;
      height: 50%;
      text-align: center;
      span {
        font-weight: 400;
        color: rgba(212, 212, 212, 1);
        line-height: 45px;
      }
    }
  }
  .blueBg {
    font-weight: bold;
    color: rgba(61, 125, 251, 1);
    background: rgba(213, 232, 255, 1);
  }
  .yellowBg {
    font-weight: bold;
    color: rgba(247, 168, 32, 1);
    background: rgba(255, 237, 205, 1);
  }
  .redBg {
    font-weight: bold;
    color: $l-color-primary;
    background: rgba(255, 225, 213, 1);
  }
  .defaultBg {
    color: rgba(212, 212, 212, 1);
    background: rgba(246, 246, 246, 1);
  }
}
</style>