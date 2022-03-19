<template>

  <div class="DocSignpage" ref="refForm" :model="TableForm">
    <el-card class="box-card">
      <el-container>
        <el-aside width="65px" class="elAideStyle" style="margin: 15px;">
          <div class="demo-basic--circle">
            <div class="block" >
              <el-avatar :size="60" :src="circleUrl"></el-avatar>
            </div>
          </div>
        </el-aside>
        <el-main>

          <div class="clearfix">
            <span> <span class="headerText">{{rsdt_name}}</span> <span>{{sex}} {{age}}</span></span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>

          <div class="cardStyle">
            <div class="text item textItemStyle">
              <span>身份证号：</span><span>{{id_no}}</span>
            </div>
            <div class="text item textItemStyle">
              <span>电话号：</span><span>{{telephone}}</span>
            </div>
            <div class="text item textItemStyle">
              <span>当前机构：</span><span>{{create_org_name}}</span>
            </div>
            <div class="text item textItemStyle">
              <span>住址：</span><span>{{current_address}}</span>
            </div>
          </div>


        </el-main>
      </el-container>
    </el-card>

    <el-card class="box-card">
      <el-main>
        <div class="clearfix">
          <span class="displaySpan"></span><span class="headerText">{{rsdt_name}}</span>
        </div>
        <div>
          <el-form label-width="80px">
            <el-row :gutter="20" class="gutterStyle">
              <el-col :span="12" class="flex_cs">
                <l-formt-title label="乙方团队" style="width:80%">
                  <el-input readonly v-model="name"></el-input>
                </l-formt-title>
                <div>
                  <el-button v-if="this.status != 'view'" @click="openDiag()" icon="el-icon-plus" circle></el-button>
                </div>
              </el-col>
              <el-col :span="12">
               <l-formt-title label="乙方团队类型" style="width:80%">
                 <el-input  readonly v-model="groupTypeDesc"></el-input>
               </l-formt-title>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="gutterStyle">
              <el-col :span="12">
                <span class="spanText w160">乙方团队长：</span><span>{{leaderName}}</span>
              </el-col>
              <el-col :span="12">
                <span class="spanText">丙方：</span><span>{{create_org_name}}</span>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="gutterStyle">
              <el-col :span="12">
                <span class="spanText w160">乙方团队成员：</span>
                <span v-for="item in sysSignGroupMemberDTOs">{{item.userName+','}}</span>
              </el-col>
              <el-col :span="12">
                <span class="spanText">电话：</span><span>{{create_org_phone}}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="gutterStyle">
              <el-col :span="24">
                <span class="spanText w160">全科医生团队服务电话：</span><span>{{telephone1}}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="gutterStyle">
              <el-col :span="24">
                <span class="spanText w160">地址：</span><span>{{address}}</span>
              </el-col>
            </el-row>
            <el-row class="gutterStyle">
              <el-col :span="24" class="cardStyle">
                <span class="spanText">协议有效期：</span>
                <el-col :span="20">
                <el-date-picker
                      v-model="TableForm.start_date"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                          v-model="TableForm.end_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          align="right"
                          placeholder="选择日期">
                        </el-date-picker>
                    <!-- <el-date-picker v-model="TableForm.end_date" align="right" type="date" placeholder="选择日期" </el-date-picker> -->
                </el-col>
              </el-col>
            </el-row>

            <!-- 穿梭框 -->
            <div class="shuttleox">
              <el-row>
                <el-col :span="24" class="flexStyle">
                  <el-col :span="8">
                    <div>
                      <l-formt-title label="服务包类型" class="center" style="width: 90%;">
                        <el-select v-model="TableForm.rsdtType" placeholder="请选择" clearable filterable @change="rsdtTypeFun(a)">
                          <el-option v-for="item in crowdCategoryOptions" :key="item.id" :label="item.type_desc" :value="item.type"></el-option>
                        </el-select>
                      </l-formt-title>
                    </div>

                  </el-col>
                  <el-col :span="8">
                    <div>
                      <span class="redColor">需支付金额：</span><span class="fontWehtin">{{TableForm.payment_amount}}元</span>
                    </div>
                  </el-col>
                </el-col>
              </el-row>

              <el-row class='transfer-class'>
                <el-transfer v-model="checked" :data="crowdCategoryOptionsData" @change="getObject" :titles="['医疗服务项目', '已选项目']">
                  <span slot-scope="{ option }">{{ option.label }}
                   <span style="color: #8492a6; font-size: 13px; padding-left: 10px;padding-right: 15px;">({{ option.status_desc }})</span>
                  </span>
                </el-transfer>
              </el-row>
            </div>
            <div class="autographWrap">
              <div style="float: left;width: 45%;">
                <el-row class="autograpTop">
                  <span class="headerText">甲方签字</span>
                  <el-button v-if="this.status != 'view'" @click="canvasClear()">清除</el-button>
                </el-row>
                <el-row>
                  <div class="autographbox">
                    <sign-canvas v-if="!TableForm.showDom" class="sign-canvas" ref="SignCanvas" :options="options" v-model="SignCanvasValue" />
                    <img v-if="TableForm.showDom" style="width: 100%;height: 100%;" :src="TableForm.buyer_sign" alt="">
                  </div>

                </el-row>
              </div>

              <div style="float: right;width: 45%;">
                <el-row class="autograpTop">
                  <span class="headerText">乙方签字</span>
                  <el-button v-if="this.status != 'view'" @click="canvasClear1()" style="">清除</el-button>
                </el-row>
                <el-row>
                  <div class="autographbox">
                    <sign-canvas v-if="!TableForm.showDom1" class="sign-canvas" ref="SignCanvas1" :options="options" v-model="SignCanvasValue1" />
                    <img v-if="TableForm.showDom1" style="width: 100%;height: 100%;" :src="TableForm.seller_sign" alt="">
                  </div>
                </el-row>
              </div>

            </div>
          </el-form>
        </div>
      </el-main>



    </el-card>

    <div class="docdialog">
      <el-dialog title="选择个人信息" :visible.sync="dialogFormVisible1" :append-to-body="true" width="940px" @close="closeDiag">
        <div style="padding: 15px;">
          <el-input v-model="queryinput" placeholder="请输入内容" style="width: 40%;"></el-input>
          <el-button type="primary" @click="queryFun()">查询</el-button>
  <el-button @click="ResetFun()">重置</el-button></div>
        <div style="padding: 15px;">
          <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
            @row-click="showRow">
            <el-table-column label="选择" width="70" center>
              <template slot-scope="scope">
                <el-radio class="radio" v-model="radio" :label="scope.$index" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="团队名称" width="120">
            </el-table-column>
            <el-table-column prop="leaderName" label="组长" width="120">
            </el-table-column>

            <el-table-column prop="summary" label="团队介绍" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createAt" label="创建日期" width="200">
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button type="primary" @click="saveMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>



  </div>
</template>

<script>
  import {
    dateConversion
  } from "@/utils/common";
  import {
    mapGetters,
    mapActions
  } from "vuex";
  import {
    onGet,
    onPost
  } from "@/api/public/public";
  export default {
    name: "DocSignpage",
    comments: {},
    props: {},
    data() {
      return {
        //
        queryinput: '',
        watchData: [],

        rsdt_name: "", //姓名
        sex: "", //性别
        age: "",
        id_no: '', //身份证号
        telephone: '', //电话号
        create_org_name: '', //当前机构
        current_address: '', //住址
        create_org_phone: '',

        value1: ['' ],
        // radio
        radio: '',
        radioData: '',
        // table 列表
        tableData: [],
        sysSignGroupMemberDTOs: [],

        dialogFormVisible1: false,
        // 签名
        SignCanvasValue: null,
        SignCanvasValue1: null,
        options: {
          canvasWidth: 350, //canvas宽高 [Number] 可选
          canvasHeight: 150, //高度  [Number] 可选
          isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
          isShowBorder: false //是否显示边框 [可选]
        },

        tableName: [], //数据表名
        transferData: [], //Transfer 的数据源	array[{ key, label, disabled }]
        checked: [], //穿梭框绑定的数据，选定到右侧框中的数据项的value组成的数组
        value: [],
        // 是否只读
        readonly: false,
        // 状态 新增 查看 编辑  view edit
        status: this.$store.state.table.tableStatus,
        // 清空
        clearFlag: false,
        // 弹窗选择数据
        chooseDate: [],
         //乙方
         name: '',
         address: '',
         groupTypeDesc: "",
         leaderName: "",
         telephone1: '',
        // 图片默认路径
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        crowdCategoryOptions: [],
        crowdCategoryOptionsData: [],
        TableForm: {
              doc_sign_index_id: '',//档案id
              start_date: '',//协议生效日期
              end_date: '',//协议失效日期
              org_id: '',//丙方
              org_name: this.create_org_name,//丙方名称
              buyer_sign_fileid: '',//甲方签字文件
              seller_sign_fileid: '',//乙方签字文件
              buyer_sign: '',//甲方签字
              seller_sign: '',//乙方签字
              sys_sign_group_id: '',//签约团队id
              sys_sign_services: '',//选择的项目
              doc_sign_group: '',//签约团队 用于反显
              doc_sign_service: '',//服务包表 用于反显
              doc_sign_group_member: '',//签约团队成员  用于反显
              doc_sign_project: '',//选择的项目 用于反显
              doc_sign_index: '',//档案数据 用于反显;
              statusData: true,
              showDom: false,
              showDom1: false
        }

      }
    },
    computed: {
      ...mapGetters("table", ['BaseMesData'])
    },
    created() {
      this.init();
      this.allTeamFun();
      this.servicePackFun();
      this.echoFun();
    },
    mounted() {},
    methods: {
      init(){
 this.TableForm = {
              doc_sign_index_id: '',//档案id
              start_date: '',//协议生效日期
              end_date: '',//协议失效日期
              org_id: '',//丙方
              org_name: this.create_org_name,//丙方名称
              buyer_sign_fileid: '',//甲方签字文件
              seller_sign_fileid: '',//乙方签字文件
              buyer_sign: '',//甲方签字
              seller_sign: '',//乙方签字
              sys_sign_group_id: '',//签约团队id
              sys_sign_services: '',//选择的项目
              doc_sign_group: '',//签约团队 用于反显
              doc_sign_service: '',//服务包表 用于反显
              doc_sign_group_member: '',//签约团队成员  用于反显
              doc_sign_project: '',//选择的项目 用于反显
              doc_sign_index: '',//档案数据 用于反显;
              statusData: true,
              showDom: false,
              showDom1: false
        }
      },
      emptyData() {
        for (var obj in this.TableForm) {
          this.TableForm[obj] = ""
        }
        },
     // 开启键盘监听事件
     addEnterListener() {
       if (window.__completeEnterBind__) {
         return;
       }
       window.addEventListener("keydown", this.listenEnterEvent);
       window.__completeEnterBind__ = true;
     },
     // 移除键盘监听事件
     removeEnterListener() {
       console.log("移除键盘监听事件");
       window.removeEventListener("keydown", this.listenEnterEvent);
       window.__completeEnterBind__ = false;
     },
      queryFun(){
        this.allTeamFun(this.queryinput);
      },
      ResetFun(){
        this.queryinput = "";
      },
      // 获取当前一年后的时间，日期格式
      currentDateLater() {
          var date = new Date();
          var y = date.getFullYear() + 1;
          var m = date.getMonth() + 1;
          // m = m < 10 ? ('0' + m) : m;
          var d = date.getDate();
          // d = d < 10 ? ('0' + d) : d;
          var h = date.getHours();
          // h = h < 10 ? ('0' + h) : h;
          var minute = date.getMinutes();
          var second = date.getSeconds();
          minute = minute < 10 ? '1' + minute : minute;
          second = second < 10 ? '0' + second : second;
          return y + '-' + m + '-' + d;
      },
      currentDate() {
          var date = new Date();
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          // m = m < 10 ? ('0' + m) : m;
          var d = date.getDate();
          // d = d < 10 ? ('0' + d) : d;
          var h = date.getHours();
          // h = h < 10 ? ('0' + h) : h;
          var minute = date.getMinutes();
          var second = date.getSeconds();
          minute = minute < 10 ? '1' + minute : minute;
          second = second < 10 ? '0' + second : second;
          return y + '-' + m + '-' + d;
      },
      rsdtTypeFun(){
        console.log(this.TableForm.rsdtType);
         this.servicePackFun(this.TableForm.rsdtType)
      },
      servicePackFun(data){
        onPost({
            url: "/phss/sysSignService/onQuerySysSignService",//查询服务包
            data: {type: data}
          })
          .then(res => {
            console.log("this.tableData",res);
            if (res.code === 1) {
              // this.crowdCategoryOptions = res.data.data;
                    const allData = res.data.data
             				const data = [];
                    let result = [];
                    let obj = {};
             				for(let i = 0; i < allData.length; i++) {
                      if(!obj[allData[i].category]){
                                 result.push(allData[i]);
                                 obj[allData[i].category] = true;
                         }
             					data.push({
             						key: allData[i].id,
             						label: allData[i].name,
                        status_desc: allData[i].status_desc
             					});
             				}
                    this.crowdCategoryOptions = result;
                    this.crowdCategoryOptionsData = data;
                     console.log("22222222222222222",this.crowdCategoryOptionsData)
            } else {
              console.log("error", res);
            }
          })
          .catch(error => {
            console.log(error);
          });

      },
      allTeamFun(data) {
        onPost({
            url: "/phss/sysSignGroup/onQuerySysSignGroup",//查询所有组
            data: {name: data}
          })
          .then(res => {
            this.tableData = [];
            if (res.code === 1) {
              this.tableData = res.data.data;
            } else {
              console.log("error", res);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      echoFun() {
        let that = this;
        console.log(
          "tableConfiguration**************",
          this.$store.state.table.tableConfiguration
        );
        let tableConfiguration = this.$store.state.table.tableConfiguration;
        this.rsdt_name = this.BaseMesData.rsdt_name; //姓名
        this.sex = this.BaseMesData.sex; //性别
        this.age = this.BaseMesData.age;
        this.id_no = this.BaseMesData.id_no; //身份证号
        this.telephone = this.BaseMesData.telephone; //电话号
        this.create_org_name = this.BaseMesData.create_org_name; //性别
        this.current_address = this.BaseMesData.current_address; //性别
        this.create_org_phone = this.BaseMesData.create_org_phone//机构电话
        this.TableForm.org_id = this.BaseMesData.current_org_id;
        this.TableForm.doc_sign_index_id = this.BaseMesData.id;
        if(this.status == "edit" || this.status == "view"){
          if (tableConfiguration.editData.buyer_sign.length > 0){
             this.TableForm.showDom = true;
          }else{
            this.TableForm.showDom = false;
          }
          if(tableConfiguration.editData.seller_sign.length > 0){
            this.TableForm.showDom1 = true;
          }else{
            this.TableForm.showDom1 = false;
          }

          this.TableForm.doc_sign_index_id = tableConfiguration.editData.doc_sign_index_id;
          this.TableForm.sys_sign_group_id = tableConfiguration.editData.sys_sign_group_id;
          this.TableForm.org_id = tableConfiguration.editData.org_id;

          this.name = tableConfiguration.editData.doc_sign_group.name;
          this.address = tableConfiguration.editData.doc_sign_group.address;
          this.groupTypeDesc = tableConfiguration.editData.doc_sign_group.summary;
          this.sysSignGroupMemberDTOs = tableConfiguration.editData.doc_sign_group_member;
          this.telephone1 = tableConfiguration.editData.doc_sign_group.telephone;
          this.leaderName = tableConfiguration.editData.doc_sign_group.leaderName;
          this.checked = tableConfiguration.editData.sys_sign_services;
          this.TableForm.sys_sign_services = this.checked;
          this.TableForm.buyer_sign = tableConfiguration.editData.buyer_sign;
          this.TableForm.seller_sign = tableConfiguration.editData.seller_sign;
          this.TableForm.start_date = tableConfiguration.editData.start_date;
          this.TableForm.end_date = tableConfiguration.editData.end_date;
          this.TableForm.payment_amount = tableConfiguration.editData.payment_amount
        }else{
          this.TableForm.start_date = this.currentDate();
          this.TableForm.end_date = this.currentDateLater();
        }
      },
      showRow(row) {
        //赋值给radio;
        console.log(row);
         this.radioData = row;
        this.radio = this.tableData.indexOf(row);
      },
      saveMethod() {
          this.address = this.radioData.address;
          this.groupTypeDesc = this.radioData.groupTypeDesc;
          this.name = this.radioData.name;
          this.leaderName = this.radioData.leaderName;
          this.telephone1 = this.radioData.telephone;
          this.sysSignGroupMemberDTOs = this.radioData.sysSignGroupMemberDTOs;
          this.TableForm.sys_sign_group_id = this.radioData.id;
          this.dialogFormVisible1 = false;
      },

      getCurrentRow(val) {
        console.log("getCurrentRow", val);
      },
      handleSelectionChange(val) {
        console.log("val", val);
        this.chooseDate = "";
        this.chooseDate = val;
      },
      openDiag() {
        this.radioData = [];
        this.dialogFormVisible1 = true;
      },
      closeDiag() {
        this.dialogFormVisible1 = false;
      },
      getObject() {
        this.TableForm.sys_sign_services = this.checked;
        this.TableForm.payment_amount = "";
        let pricediscount = Number();
        for(var i = 0;i < this.crowdCategoryOptions.length;i++){
            for(var j = 0;j < this.checked.length;j++){
              if(this.crowdCategoryOptions[i].id == this.checked[j]){
                pricediscount += this.crowdCategoryOptions[i].price * this.crowdCategoryOptions[i].discount
              }
            }
        };
        this.TableForm.payment_amount = pricediscount;
      },
      // 清楚
      canvasClear() {
        if(this.TableForm.showDom){
          this.TableForm.showDom = false;
        }else{
            this.$refs.SignCanvas.canvasClear();
        }
      },
      canvasClear1() {
        if(this.TableForm.showDom1){
          this.TableForm.showDom1 = false;
        }else{
            this.$refs.SignCanvas1.canvasClear();
        }

      },
      // 保存图片
      saveAsImg() {
        // 甲
        const img = this.$refs.SignCanvas.saveAsImg();
        this.TableForm.buyer_sign = img;
      },
      // 保存图片
      saveAsImg1() {
        // 乙
        const img = this.$refs.SignCanvas1.saveAsImg();
        this.TableForm.seller_sign = img;
      }
    },
    beforeDestroy(){

    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .DocSignpage {
    .autograpTop {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 30px;
      height: 40px;
    }

    .autographbox {
      width: 100%;
      height: 150px;
      border: 1px solid #CCCCCC;
    }

    .flexStyle {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .fontWehtin {
      font-weight: 500px;
    }

    .redColor {
      color: red;
      font-weight: 600;
    }

    .shuttleox {
      width: 100%;
      height: 400px;
      border: 1px solid #CCCCCC;
      box-sizing: border-box;
      padding: 15px;
      margin-top: 15px;
    }

    .w160 {
      width: 160px;
      display: inline-block;
    }

    .spanText {
      font-size: 14px;
      color: #959ea2;
    }

    .displaySpan {
      height: 10px;
      width: 5px;
      display: inline-block;
      background-color: #001528;
      margin-right: 10px;
    }

    .textItemStyle {
      box-sizing: border-box;
      padding: 10px;

    }

    .cardStyle {
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: wrap;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .headerText {
      font-size: 15px;
      font-weight: 600;
      color: #000000;
    }

    .text {
      font-size: 14px;
    }

    .clearfix {
      padding: 10px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }

    .box-card {
      width: 100%;
      margin-bottom: 15px;
    }

    .elAideStyle {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }

    .el-aside {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }

    .el-transfer-panel {
      width: 300px !important;
    }

    .transfer-class .el-transfer-panel {
      width: 300px !important;
    }

    .gutterStyle {
      padding: 10px;
    }

  }
</style>
