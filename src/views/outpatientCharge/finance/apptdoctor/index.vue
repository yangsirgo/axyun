<template>
  <div class="height-width width100 height100" ref="page">
    <!-- 右侧预约列表 -->
    <el-card class="box-card-right height100">
      <div style="margin-left:20px">
        <l-card-title>
          <!--<template slot="left">今日预约列表</template>-->
          <template slot="left">已预约</template>
        </l-card-title>
      </div>
      <div style="margin:0 20px;">
        <el-date-picker
          v-model="hisDateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="width100"
        ></el-date-picker>
      </div>
      <div class="mar-top-10 width100 height100">
        <el-table :data="apptList" width="100%" height="calc(100%-110px)" border>
          <el-table-column
            v-for="(item,index) in apptParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="left"
            :align="item.align || 'left'"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'options'">
                <span class="blue-color" style="cursor: pointer">取消</span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 左侧挂号 -->
    <el-card class="box-card-left padding10" style="overflow-y: auto;">
      <el-row class="width100 mar-top-10 clearfix" style="padding-left: 24px">
        <div style="float:left;width:260px">
          <el-input v-model="cardNum" placeholder="请读取医保卡/身份证/就诊卡" suffix-icon="el-icon-search"></el-input>
        </div>
        <div style="float:left">
          <!--<el-button type="primary" @click="readCard" class="">读卡</el-button>-->
          <el-button type="primary" class="duka-button" @click="readCard"><i class="iconfont iconduka"></i>读卡
          </el-button>
        </div>
      </el-row>
      <hr style="border:1px dashed #E4E4E4;margin-left: 24px" width="100%" class="mar-top-10" color="#E4E4E4" size="1"/>

      <el-row>
        <el-col :span="12">
          <!--<l-divider title="患者信息" class="mar-top-20"></l-divider>-->
          <div style="margin-left:20px">
            <l-card-title>
              <template slot="left">患者信息</template>
            </l-card-title>
          </div>
        </el-col>
        <el-col :span="12">
          <el-button class="float-right mar-top-20" size="mini" @click="showPatient">患者档案信息</el-button>
        </el-col>
      </el-row>


      <el-row class="width100 mar-top-10" :gutter="10">
        <el-col :span="2">
          <div class="img"></div>
        </el-col>
        <el-col :span="18">
          <el-row :gutter="10" class="mar-top-10">
            <el-col :span="4">
              <!-- <l-inputwith-title :title="'姓名'" v-model="patientInfo.patientName"
                                  class="input-width"></l-inputwith-title>-->
              <LFormtTitle label="姓名" labelWidth="48">
                <el-input v-model="patientInfo.patientName" style="line-height: 34px;"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <!--<l-inputwith-title :title="'真实姓名'" v-model="patientInfo.patientFullName"
                                 class="input-width"></l-inputwith-title>-->
              <LFormtTitle label="真实姓名" labelWidth="76">
                <el-input v-model="patientInfo.patientFullName" style="line-height: 34px;"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <!-- <l-select-with-title :title="'性别'" v-model="patientInfo.patientGender"
                                    class="input-width"></l-select-with-title>-->
              <LFormtTitle label="性别" labelWidth="48">
                <el-select v-model="patientInfo.patientGender" placeholder="请选择">
                  <el-option
                    label="男"
                    value="0">
                  </el-option>
                  <el-option
                    label="女"
                    value="1">
                  </el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <!--<l-inputwith-title :title="'联系方式'" v-model="patientInfo.mobileNum"
                                 class="input-width"></l-inputwith-title>-->
              <LFormtTitle label="联系方式" labelWidth="76">
                <el-input v-model="patientInfo.mobileNum" style="line-height: 34px;"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="7">
              <!--<l-select-with-title :title="'身份证'" v-model="patientInfo.identificationNum"
                                   class="input-width"></l-select-with-title>-->
              <LFormtTitle label="身份证" labelWidth="76">
                <el-input v-model="patientInfo.identificationNum" style="line-height: 34px;"></el-input>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="mar-top-10">
            <el-col :span="4">
              <!-- <l-inputwith-title :title="'出生日期'" v-model="patientInfo.birthDate"
                                  class="input-width"></l-inputwith-title>-->
              <LFormtTitle label="出生日期" labelWidth="76">
                <el-date-picker
                  v-model="patientInfo.birthDate"
                  type="date"
                  placeholder="">
                </el-date-picker>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <!--<l-inputwith-title :title="'时间'" v-model="patientInfo.birthTime" class="input-width"></l-inputwith-title>-->
              <LFormtTitle label="出生时间" labelWidth="76">
                <el-time-select
                  v-model="patientInfo.birthTime"
                  :picker-options="{
                              start: '08:30',
                              step: '00:15',
                              end: '18:30'
                            }"
                  placeholder="">
                </el-time-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <!--<l-inputwith-title :title="'年龄'" v-model="patientInfo.age" class="input-width"></l-inputwith-title>-->
              <LFormtTitle label="年龄" labelWidth="48">
                <el-input v-model="patientInfo.age" style="line-height: 34px;"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="12">
              <!--<l-inputwith-title :title="'联系地址'" class="input-width"></l-inputwith-title>-->
              <LFormtTitle label="联系地址" labelWidth="76">
                <el-input style="line-height: 34px;"></el-input>
              </LFormtTitle>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <div class="account">
            <div style="margin-bottom: 10px">账户余额</div>
            <span class="font">222234.33
              <el-button size="mini" style="height:22px;line-height: 22px;padding:0 13px;text-align: center">充值
              </el-button>
            </span>
          </div>
        </el-col>
      </el-row>
      <!--<l-divider title="预约信息" class="mar-top-20"></l-divider>-->
      <div style="margin-left:20px">
        <l-card-title>
          <template slot="left">预约信息</template>
        </l-card-title>
      </div>
      <el-row class="mar-top-10" style="padding-left: 24px">
        <el-form ref="searchForm" :model="searchForm">
          <el-row :gutter="10" class="width100">
            <el-col :span="5">
              <LFormtTitle label="挂号科室" labelWidth="76">
                <el-select v-model="searchForm.ouptDeptId" placeholder="请选择">
                  <el-option
                    v-for="item in ouptDeptIds"
                    :key="item.scheduleId"
                    :label="item.deptName"
                    :value="item.ouptDeptId"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="挂号类别" labelWidth="76">
                <el-select v-model="searchForm.type"
                           :disabled="searchForm.ouptDeptId?false:true"
                           placeholder="请选择">
                  <el-option
                    v-for="item in docTypes"
                    :key="item.scheduleId"
                    :label="item.diagTreatType"
                    :value="item.diagTreatType"
                    v-if="item.ouptDeptId ==searchForm.ouptDeptId?true:false"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <!-- <l-select-with-title
                 :title="'医生级别'"
                 v-model="searchForm.docClass"
                 :disabled="searchForm.type?false:true"
                 class="input-width"
               >
                 <el-option
                   v-for="item in docTypes"
                   :key="item.scheduleId"
                   :label="item.diagTreatType"
                   :value="item.diagTreatType"
                 ></el-option>
               </l-select-with-title>-->
              <LFormtTitle label="医生级别" labelWidth="76">
                <el-select v-model="searchForm.docClass"
                           :disabled="searchForm.type?false:true">
                  <el-option
                    v-for="item in docTypes"
                    :key="item.scheduleId"
                    :label="item.diagTreatType"
                    :value="item.diagTreatType"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <!--<l-select-with-title
                :title="'挂号医生'"
                v-model="searchForm.doctorId"
                :disabled="searchForm.docClass?false:true"
                class="input-width"
              >
                <el-option
                  v-for="item in doctors"
                  :key="item.scheduleId"
                  :label="item.doctorName"
                  :value="item.doctorId"
                ></el-option>
              </l-select-with-title>-->
              <LFormtTitle label="挂号医生" labelWidth="76">
                <el-select v-model="searchForm.doctorId"
                           :disabled="searchForm.docClass?false:true"
                           @change="getChargesItem">
                  <el-option
                    v-for="item in doctors"
                    :key="item.scheduleId"
                    :label="item.doctorName"
                    :value="item.doctorId"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <div style="height:150px" class="width100 mar-top-10">
          <apptdoctor :searchForm="searchForm" @selectTime="pushTableData"></apptdoctor>
        </div>
      </el-row>
      <!--<l-divider title="确认预约信息" class="mar-top-20"></l-divider>-->
      <div style="margin-left:20px">
        <l-card-title>
          <template slot="left">确认预约信息</template>
        </l-card-title>
      </div>
      <div style="margin: 0 0 20px 24px;">
        <el-row class="mar-top-10">
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column
              v-for="(item,index) in tableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              :align="item.align || 'left'"
            >
              <template slot-scope="scope">
                <template v-if="item.porp == 'headImg'">
                  <!-- 预留，图片路径或base64... -->
                  <!-- <img :src="scope.row[item.prop].path" /> -->
                </template>
                <template v-else>
                  <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="mar-top-10">
            <el-button type="text">请确认本次预约信息无误！</el-button>
            <el-button type="primary" class="float-right">确认预约</el-button>
            <el-button class="float-right mar-right-10">刷新</el-button>
          </el-row>
        </el-row>
      </div>

    </el-card>
    <!-- 患者档案抽屉 -->
    <l-drawer
      v-model="showpatientInfo"
      title="患者档案信息"
      placement="right"
      :mask-closable="false"
      width="800"
    >
      <el-form
        label-position="right"
        label-width="100px"
        ref="formElem"
        :model="patientRecord"
        :disabled="true"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系地址">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
            <el-form-item label="账户余额">
              <el-input v-model="patientForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </l-drawer>
  </div>
</template>
<script>
  import apptdoctor from "./components/ApptDoctor.vue";
  import lDrawer from "@/components/LDrawer.vue";
  import adHeight from "@/mixins/adHeight";
  import apService from "@/api/appointment/appointment";

  export default {
    components: {
      apptdoctor,
      lDrawer
    },
    mixins: [adHeight],
    data() {
      return {
        // 显示抽屉
        showpatientInfo: false,
        // 卡号
        cardNum: "0000444555",
        // 患者信息表单对象
        patientForm: {},
        // 患者信息
        patientInfo: {},
        // 性别列表
        genders: [
          {
            key: 1,
            value: "男"
          },
          {
            key: 2,
            value: "女"
          },
          {
            key: 3,
            value: "第三种"
          }
        ],
        // 证件类型集合
        identificationTypes: [
          {
            key: 1,
            value: "身份证"
          },
          {
            key: 2,
            value: "护照"
          },
          {
            key: 3,
            value: "..."
          }
        ],
        // 证件类型
        identificationType: 1,
        // 搜索表单
        searchForm: {},
        // 挂号科室集合
        ouptDeptIds: [],
        // 医师级别集合
        docClasses: [
          {
            key: 1,
            value: "主任医师"
          },
          {
            key: 2,
            value: "医师"
          }
        ],
        // 挂号类别
        docTypes: [],
        // 医生集合（后期搜索到）
        doctors: [],
        // 排班列表
        scheduleList: [],
        // 预约信息表格数据
        tableData: [],
        // 表格表头
        tableParams: [
          {
            prop: "headImg",
            label: "头像",
            width: "100",
            align: "center"
          },
          {
            prop: "doctorInfo",
            label: "医生信息",
            width: "200",
            align: "center"
          },
          {
            prop: "docTypes",
            label: "挂号类别",
            width: "200",
            align: "center"
          },
          {
            prop: "appointmentCode",
            label: "预约序号",
            width: "80",
            align: "left"
          },
          {
            prop: "diagTime",
            label: "就诊时间",
            width: "100",
            align: "left"
          },
          {
            prop: "doctorInfo",
            label: "挂号费",
            width: "100",
            align: "right"
          }
        ],
        // 预约列表数据
        apptList: [
          {
            appointmentCode: "000120001",
            patient: "张强(男，32岁)",
            appointmentTime: "08:00-09:00",
            sDept: "普外科",
            doctorName: "张轩"
          },
          {
            appointmentCode: "000120001",
            patient: "张强(男，32岁)",
            appointmentTime: "08:00-09:00",
            sDept: "普外科",
            doctorName: "张轩"
          },
          {
            appointmentCode: "000120001",
            patient: "张强(男，32岁)",
            appointmentTime: "08:00-09:00",
            sDept: "普外科",
            doctorName: "张轩"
          },
          {
            appointmentCode: "000120001",
            patient: "张强(男，32岁)",
            appointmentTime: "08:00-09:00",
            sDept: "普外科",
            doctorName: "张轩"
          },
          {
            appointmentCode: "000120001",
            patient: "张强(男，32岁)",
            appointmentTime: "08:00-09:00",
            sDept: "普外科",
            doctorName: "张轩"
          },
          {
            appointmentCode: "000120001",
            patient: "张强(男，32岁)",
            appointmentTime: "08:00-09:00",
            sDept: "普外科",
            doctorName: "张轩"
          }
        ],
        // 表头
        apptParams: [
          {
            prop: "options",
            label: "操作",
            width: "80",
            align: "left"
          }, {
            prop: "appointmentCode",
            label: "门诊号",
            width: "100",
            align: "left"
          },
          {
            prop: "patient",
            label: "患者",
            width: "120",
            align: "left"
          },
          {
            prop: "appointmentTime",
            label: "预约时间段",
            width: "100",
            align: "left"
          },
          {
            prop: "sDept",
            label: "科室",
            width: "100",
            align: "left"
          },
          {
            prop: "doctorName",
            label: "医生",
            width: "80",
            align: "left"
          }
        ],
        // 患者档案信息
        patientRecord: {},
        //时间选择器
        hisDateTime:''
      };
    },
    mounted() {
      this.getSchedule();
    },
    methods: {
      // 显示抽屉
      showPatient() {
        this.showpatientInfo = true;
      },
      // 确认信息表格
      pushTableData(item) {
        const data = {
          ...this.searchForm,
          diagTime: item.command,
          docTypes: "sada"
        };
        this.tableData = [];
        this.tableData.push(data);
      },
      // 读卡
      async readCard() {
        const response = await apService.getPatientInfo({cardNum: this.cardNum});
        this.patientInfo = {...response.data};
      },
      // 拿到本周排班
      async getSchedule() {
        // 本周一周日
        let a = new Date().getDay();
        let monday = new Date() - (a - 1) * 60 * 60 * 24 * 1000;
        let sunday = monday + 6 * 60 * 60 * 24 * 1000;
        let startDate = new Date().getFullYear() + "-" + new Date(monday).toLocaleString() + " 00:00:00";
        let stopDate = new Date().getFullYear() + "-" + new Date(sunday).toLocaleString() + " 23:59:59";
        // 请求排班列表
        const response = await apService.getScheduleList({
          // startDate:startDate,
          // stopDate:stopDate
          // 为了有数据 暂时写死
          startDate: "2018-09-09 00:00:00",
          stopDate: "2020-09-09 00:00:00"
        });
        this.scheduleList = response.data;
        // 去重 拿到所有科室
        let obj = {};
        let aaa = {};
        let bbb = {};
        let ccc = {};
        for (let i = 0; i < response.data.length; i++) {
          if (!obj[response.data[i].ouptDeptId]) {
            this.ouptDeptIds.push(response.data[i]);
            obj[response.data[i].ouptDeptId] = true;
          }
          if (!aaa[response.data[i].diagTreatType]) {
            this.docTypes.push(response.data[i]);
            aaa[response.data[i].diagTreatType] = true;
          }
          // 医师级别 无字段，暂无
          // if(!bbb[response.data[i].diagTreatType]){
          //   this.docTypes.push(response.data[i]);
          //   bbb[response.data[i].diagTreatType] = true;
          // }
          if (!ccc[response.data[i].doctorId]) {
            this.doctors.push(response.data[i]);
            ccc[response.data[i].doctorId] = true;
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .blue-color {
    color: $l-color-fontcolor-2;
  }

  .height-width {
    /*min-width: 1920px;*/
    /*margin-top: 30px;*/
    /*padding: 0 20px;*/
    .float-left-30 {
      margin-left: 30px;
    }

    .mar-top-10 {
      margin-top: 10px;
    }

    .form-height {
      height: 40px;
    }

    .form-width {
      width: 162px;
    }

    .input-width {
      width: 100%;
    }

    .float-right {
      float: right;
    }

    .mar-right-10 {
      margin-right: 10px;
    }

    .mar-top-20 {
      margin-top: 20px;
    }

    .box-card-left {
      height: 100%;
    }

    .box-card-right {
      float: right;
      margin-left: 10px;
      width: 500px;
      height: 100%;
    }

    .img {
      width: 80px;
      height: 102px;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
      margin-left: 20px;
    }

    .account {
      width: 100%;
      height: 82px;
      margin-top: 10px;
      text-align: center;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
      padding-top: 10px;

      span:not(.font)  {
        line-height: 20px;
      }

      .font {
        color: $l-color-primary;
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
      }
    }
  }

  .duka-button {
    width: 200px;
    height: 38px;
    margin-left: 10px;
    border: none;
    border-radius: 2px;
    float: left;

    i {
      display: inline-block;
      margin-right: 10px;
    }
  }
</style>
