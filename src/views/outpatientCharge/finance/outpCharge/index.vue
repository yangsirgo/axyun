<template>
  <div class="div-body" ref="page">
    <el-row :gutter="10" class="height100 width100">
      <el-col :span="4" class="height100">
        <el-card class="width100 height100 padding10">
          <!--<l-divider title="待收费列表"></l-divider>-->
          <div style="margin-left:20px">
            <l-card-title>
              <template slot="left">待收费列表</template>
            </l-card-title>
          </div>
          <el-date-picker
            v-model="dateTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getToCharge"
            class="width100"
          ></el-date-picker>
          <el-table :data="toChargeList" width="100%" height="650px" border class="mar-top-10" @row-click="getChargeInfo">
            <el-table-column
              v-for="(item,index) in toChargeParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              :align="item.align || 'left'"
              :fixed="item.fixed"
              @click="getPatientInfo(item)"
            >
              <template slot-scope="scope">
                <template>
                  <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16" class="height100">
        <el-card class="height100 width100 padding10">
          <div slot="header" class="clearfix">
            <el-row class="width100">
              <el-col :span="12">
                <!--<el-input
                  v-model="cardNum"
                  placeholder="请读取医保卡、身份证、就诊卡"
                  suffix-icon="el-icon-search"
                ></el-input>-->
                <div style="float:left;width:260px">
                  <el-input v-model="cardNum" placeholder="请读取医保卡/身份证/就诊卡">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="readCard"></i>
                  </el-input>
                </div>
                <div style="float:left">
                  <el-button type="primary" class="duka-button"><i class="iconfont iconduka"></i>读卡</el-button>
                </div>
              </el-col>
              <!--<el-col :span="4">
                <el-button class="margin-left-40" type="primary" @click="readCard">读卡</el-button>
              </el-col>-->
              <el-col :span="12" class="topClock">
                <span class="float-right">
                  <span class="font">{{windowNum}}</span>
                </span>
                <span class="float-right margin-right-10">|</span>
                <span class="float-right margin-right-10">{{nowTime}}</span>
              </el-col>
            </el-row>
          </div>
          <!--<l-divider title="就诊信息"></l-divider>-->
          <div style="margin-left:20px">
            <l-card-title>
              <template slot="left">就诊信息</template>
            </l-card-title>
          </div>
          <div class="width100 div-info">
            <el-row class="width100 height100">
              <el-col :span="2">
                <div class="img"></div>
              </el-col>
              <el-col :span="22">
                <el-row class="info-row">
                  <el-col :span="4">
                    卡片类型
                    <span>{{'院内就诊卡'}}</span>
                  </el-col>
                  <el-col :span="4">
                    结算类型
                    <span>{{patientInfo.settlementType || ""}}</span>
                  </el-col>
                  <el-col :span="6">
                    <div class="div-recharge">
                      账户余额
                      <span>{{balanceMoney}}</span>
                      <!--<el-button
                        type="text"
                        plain
                        size="mini"
                        class="float-right l-center-vertical"
                      >充值
                      </el-button>-->
                      <el-button size="mini" class="float-right l-center-vertical"
                                 style="height:22px;line-height: 22px;padding:0 13px;text-align: center"
                                 @click="openRecharge">充值
                      </el-button>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="info-row">
                <el-col :span="4">
                    门诊号
                    <span>{{patientInfo.patientCode}}</span>
                  </el-col>
                  <el-col :span="4">
                    姓名
                    <span>{{outpInfo.patientName}}</span>
                  </el-col>
                  <el-col :span="2">
                    年龄
                    <span>{{patientInfo.patientAge}}</span>
                  </el-col>
                  <el-col :span="2">
                    性别
                    <span>{{outpInfo.patientGender}}</span>
                  </el-col>
                  <el-col :span="4" class="overflow-point">
                    就诊科室
                    <span>{{outpInfo.ouptDeptId}}</span>
                  </el-col>
                  <el-col :span="4">
                    就诊医生
                    <span>{{outpInfo.doctorName}}</span>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" class="float-right">患者档案信息</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>

          <div class="width100 div-table">
            <el-row class="table-title">
              <el-col :span="12">
                <!--<l-divider title="费用明细"></l-divider>-->
                <div style="margin-left:20px">
                  <l-card-title>
                    <template slot="left">费用明细</template>
                  </l-card-title>
                </div>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" class="float-right plain-button" style="width:80px">跳号</el-button>
                <!--<l-inputwith-title :title="'下张发票'" class="float-right margin-right-10"></l-inputwith-title>-->
                <span style="display: inline-block;width:294px" class="float-right margin-right-10">
                   <LFormtTitle label="下张发票" labelWidth="76">
                  <el-input style="line-height: 34px;"></el-input>
                </LFormtTitle>
                </span>
                <span class="float-right margin-right-10">
                  余数
                  <span class="font">{{'23'}}</span>
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-table :data="tableData" @selection-change="getRowsIdx" border show-summary class="table" height="450px">
                <el-table-column type="selection" width="40px" header-align="center" align="center"></el-table-column>
                <el-table-column
                  v-for="(item, index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed === true"
                >
                  <template slot-scope="scope">
                    <!--操作部分自定义-->
                    <template v-if="item.prop == 'operate'">
                      <el-button>删除</el-button>
                    </template>
                    <template v-else>
                      <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <!-- <el-row>
              <el-col :span="18">
                <span>合计</span>
              </el-col>
              <el-col :span="3">
                <span>{{totalNum}}</span>
              </el-col>
              <el-col :span="3">
                <span>{{totalMoney}}</span>
              </el-col>
            </el-row> -->
            <hr style="border:1 dashed #E4E4E4" width="100%" color="#E4E4E4" size="1"/>
            <el-row>
              <el-col :span="12">
                <el-button type="primary" class="float-left plain-button" style="width:80px">补费</el-button>
                <el-button type="primary" class="float-left plain-button" style="width: 80px">暂存</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" class="float-right" style="width: 80px" @click="openSubmitCharge">收费</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" class="height100">
        <el-card class="width100 height100 padding10">
          <!--<l-divider title="历史收费记录"></l-divider>-->
          <div style="margin-left:20px">
            <l-card-title>
              <template slot="left"><span v-if="patientInfo.patientName">{{patientInfo.patientName+'，'}}</span>历史收费记录</template>
            </l-card-title>
          </div>
          <el-date-picker
            v-model="hisDateTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="width100"
            @change="getHisList"
          ></el-date-picker>
          <el-table :data="hisChargeList" style="width: 100%" border class="mar-top-10">
            <el-table-column
              v-for="(item,index) in hisChargeParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template>
                  <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预结算弹窗 -->
    <el-dialog title="收费" :visible.sync="dialogVisible" width="35%" :before-close="handleClose">
      <charge :charge.sync="charge"></charge>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="this.charge.warning != ''" @click="submitCharge">确定收费</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 充值弹窗 -->
    <el-dialog title="账户充值" :visible.sync="showRecharge" width="28%">
      <recharge class="width100" :patient.sync="info"></recharge>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRecharge">确定充值</el-button>
        <el-button @click="showRecharge = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import adHeight from "@/mixins/adHeight";
import service from "@/api/appointment/outpCharge";
import appointment from "@/api/appointment/appointment";
import charge from "@/views/outpatientCharge/finance/registration/components/Charge";
import recharge from "@/views/outpatientCharge/finance/registration/components/Recharge";
// 重写date 格式化方法
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};

export default {
  mixins: [adHeight],
  components: {
      recharge,
      charge
    },
  data() {
    return {
      // // 总数量
      // totalNum:0,
      // // 总额
      // totalMoney:0,
      // 历史收费
      hisDateTime:[],
      // 预结算弹窗
      dialogVisible:false,
      // 充值组件
      showRecharge:false,
      // 账户余额
      balanceMoney:0,
      // 日期时间数组
      dateTime:[],
      // 卡号
      cardNum: "0000444555",
      // 当前时间
      nowTime: "2019-08-12 周二 下午03:00",
      // 窗口号
      windowNum: "1号窗口",
      // 收费信息
      chargeInfo:{},
      // 患者信息
      patientInfo:{},
      // 就诊信息
      outpInfo:{},
      // 表格列
      tableParams: [
        {
          label: "处方",
          prop: "no",
          width: "50",
          align: "left"
        },
        {
          label: "项目类型",
          prop: "orderItemCat",
          width: "120",
          align: "left"
        },
        {
          label: "项目名称",
          prop: "orderItemName",
          width: "200",
          align: "left"
        },
        {
          label: "组套名",
          prop: "orderName",
          width: "140",
          align: "left"
        },
        {
          label: "规格",
          prop: "spec",
          width: "100",
          align: "left"
        },
        {
          label: "单位",
          prop: "unit",
          width: "80",
          align: "left"
        },
        {
          label: "单价",
          prop: "price",
          width: "70",
          align: "right"
        },
        {
          label: "数量",
          prop: "quantity",
          width: "50",
          align: "left"
        },
        {
          label: "金额",
          prop: "amt",
          width: "70",
          align: "right"
        },
        {
          label: "执行科室",
          prop: "receiveDept",
          width: "100",
          align: "right"
        },
        {
          label: "操作",
          prop: "operate",
          width: "80",
          align: "center"
        }
      ],
      // tableData
      tableData: [],
      // 待收费
      toChargeParams:[
        {
          label: "姓名",
          prop: "patientName",
          width: "100",
          align: "left",
          fixed: "left"
        },
        {
          label: "科室",
          prop: "ouptDeptId",
          width: "120",
          align: "left"
        },
        {
          label: "时间",
          prop: "appointmentTime",
          width: "180",
          align: "left"
        }
      ],
      toChargeList:[],
      // 历史收费
      hisChargeParams:[
        {
          prop:'date',
          label:'时间',
          width:'105',
          align:'left'
        },{
          prop:'dept',
          label:'科室',
          width:'110',
          align:'left'
        },{
          prop:'account',
          label:'金额',
          width:'80',
          align:'right'
        },
      ],
      hisChargeList:[
        {
          date:'03-23 13:00',
          dept:'泌尿外科',
          account:'1.00'
        },{
          date:'03-23 13:00',
          dept:'泌尿外科',
          account:'23.00'
        },{
          date:'03-23 13:00',
          dept:'泌尿外科',
          account:'12.00'
        },{
          date:'03-23 13:00',
          dept:'泌尿外科',
          account:'13.00'
        },
      ],
      // 预结算数据
      charge: {
          // 支付方式
          payType: "1",
          // 实收
          realGet: 0,
          // 找零
          backMoney: 0,
          chargeObj: {},
          // 提示数据
          warning: ""
      },
      // 患者充值相关数据
      info: {},
    };
  },
  mounted() {
    // 时钟
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.nowTime = new Date().toLocaleString(); // 修改数据date
    }, 1000);

    // 拿到待收费数据
    this.getToCharge();


  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  watch: {
      charge(val) {
        this.charge = val;
      }
    },
  methods: {
    getRowsIdx() {},
    // 拿到待收费数据
    async getToCharge(){
      try {
        this.$showLoading();
        let sDate = '';
        let eDate = ''; 
        if(this.dateTime && this.dateTime.length > 1){
          sDate = this.dateTime[0].toLocaleString();
          eDate = this.dateTime[1].toLocaleString();
        }
        const response = await service.getToCharge({
          sDate:sDate,
          eDate:eDate
        });
        this.toChargeList = response.data;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 读卡
    async readCard(){
      try {
        this.$showLoading();
        this.getPatientInfo();
        // 查询待收费
        const response = await service.getToCharge({
          patientId:this.patientInfo.patientId
        });
        if(response.data.length < 1){
          this.$hideLoading();
          this.$message('未找到该患者的待收费信息');
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 拿到患者信息 及账户余额
    async getPatientInfo(){
       try {
        this.$showLoading();
        const { data } = await appointment.getPatientInfo({ cardNum: this.cardNum });
        this.patientInfo = { ...data };
        if (data) {
          const accountInfo = await appointment.getAccountInfo(data.patientId);
          this.balanceMoney = accountInfo.data.balanceMoney;
          this.info = {
            ...data,
            ...accountInfo.data
          }
        }else{
          this.$hideLoading();
          this.$message('未找到该患者');
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 拿到患者就诊信息 及待收费数据
    async getChargeInfo(item){
      try {
        this.$showLoading();
        this.outpInfo = {...item};
        // 拿到患者档案 及账户余额
        const patient = await service.getPatientInfoById(item.patientId);
        if (patient.data) {
          this.patientInfo = patient.data;
          const accountInfo = await appointment.getAccountInfo(item.patientId);
          this.balanceMoney = accountInfo.data.balanceMoney;
          this.info = {
            ...patient.data,
            ...accountInfo.data
          }
        }
        // 查询待收费数据 默认向前查三天（暂时五天为了数据）
        let startTime = new Date() - 3 * 60 * 60 * 24 * 1000;
        startTime = new Date(startTime).toLocaleString();
        const response = await service.getChargeInfo(item.patientId,startTime);
        this.tableData = response.data;
        // 查询历史收费
        this.getHisList();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 打开预结算弹窗
    async openSubmitCharge(){
      try {
        this.$showLoading();
        const { data } = await appointment.preSettlement({
          ...this.outpInfo,
          diagTreatActivityId: this.outpInfo.appointmentId,
          chargePrescriptions:this.tableData
        });
        this.charge.chargeObj = {
          ...data,
          chargePrescriptions:this.tableData
          };
        this.dialogVisible = true;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
      
    },
    // 确认收费
    async submitCharge() {
      this.$showLoading();
      this.$set(this.charge.chargeObj,'chargeType','2')
        if (this.charge.chargeObj.cashPay == 0) {
          try {
            const response = await appointment.settlement(this.charge.chargeObj);
            if (response.code == "1") {
              this.$message({
                message: response.msg,
                type: "success"
              });
              this.resetAll();
            }
            this.resetAll();
            this.dialogVisible = false;
            this.$hideLoading();
            return ;
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "标准错误提示");
          }
        } else if (this.charge.chargeObj.cashPay > 0) {
          let prestore = "";
          try {
            // 充值
            const response = await appointment.prestore({
              prestoreMoney: this.charge.chargeObj.cashPay,
              patientId: this.patientInfo.patientId,
              patientName: this.patientInfo.patientName,
              prestoreCode: "01",
              businessType: "1",
              payTypeId: "1"
            });
            prestore = response.data.prestoreDetailId;
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "标准错误提示");
          }
          try {
            // 结算  （充完值，预结算对象 的值 要不要变）
            const res = await appointment.settlement({
              ...this.charge.chargeObj,
              prestoreDetailId: prestore
            });
            if (res.code == "1") {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.resetAll();
            }
            this.dialogVisible = false;
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "标准错误提示");
          }
        }
      this.dialogVisible = false;
      this.$hideLoading();
    },
    // 弹窗提示
    handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          }).catch(_ => {
          });
    },
    // 打开充值弹窗
    openRecharge(){
      this.showRecharge = true;
    },
    // 确认充值
    async submitRecharge(){
      try {
        this.$showLoading();
        const {data} = await appointment.prestore(this.info);
        // 刷新余额
        const accountInfo = await appointment.getAccountInfo(
          this.patientInfo.patientId
        );
        this.balanceMoney = accountInfo.data.balanceMoney;
        this.showRecharge = false;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 重置数据
    resetAll(){
      this.tableData = [];
      this.patientInfo = {};
      this.outpInfo = {};
      this.balanceMoney = 0;
    },
    // 历史收费记录
    async getHisList(){
      try {
          this.$showLoading();
          let sDate = '';
          let eDate = ''; 
          if(this.hisDateTime && this.hisDateTime.length > 1){
            sDate = this.hisDateTime[0].toLocaleString();
            eDate = this.hisDateTime[1].toLocaleString();
          }
            const response = await service.getHisList({
              sDate:sDate,
              eDate:eDate,
              patientId:this.patientInfo.patientId
            });
          this.hisChargeList = response.data;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
    }
  }
};
</script>
<style lang="scss" scoped>
  .div-body {
    min-width: 1024px;
    /*padding: 0 20px;*/
  }

  .mar-top-10 {
    margin-top: 10px;
  }

  .mar-top-20 {
    margin-top: 20px;
  }

  .topClock {
    span:not(.font)  {
      color: #949da3;
      font-size: 14px;
      line-height: 20px;

      .font {
        font-weight: $l-font-weight;
        color: #2e323a;
        font-size: 20px;
      }
    }
  }

  .div-info {
    height: 105px;
    width: 100%;
    padding-left: 10px;
    line-height: 50px;
    color: rgba(148, 157, 163, 1);
    clear: both;

    .img {
      width: 80px;
      height: 102px;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
    }

    .info-row {
      height: 50px;
      width: 100%;
    }

    span {
      margin-left: 20px;
      color: rgba(46, 50, 58, 1);
    }

    .div-recharge {
      width: 260px;
      height: 40px;
      background: rgba(245, 245, 245, 1);
      border-radius: 2px;
      padding-left: 10px;
      padding-right: 10px;
      line-height: 40px;

      span {
        font-size: 20px;
        font-weight: bold;
        color: $l-color-primary;
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
.div-table {
  margin-top: 10px;
  span {
    line-height: 34px;
  }
  .table {
    margin-top: 10px;

    span {
      line-height: 34px;
    }

    .table {
      height: 250px;
      margin-top: 10px;
    }

    .table-title {
      span:not(.font)  {
        color: #949da3;
        font-size: $l-font-size;
      }

      .font {
        color: #2e323a;
        font-size: $l-font-size-max;
        margin-left: 5px;
      }
    }
  }
  .plain-button {
    height: 36px;
    border-radius: 2px;
    background-color: $l-color-white;
    border: 1px solid $l-color-primary;
    font-size: $l-font-size;
    
    font-weight: 500;
    color: $l-color-primary;
  }
}
</style>