<template>
  <div class="summaryinfo">
    <el-col class="summaryinfo-bottom-style">
      <el-col class="summaryinfoLeft">
        <el-col class="summaryinfo-l-top">
          <div class="summaryinfoL-img-box">
            <img class="summaryinfoL-img" src="./img/renti.png" ref="conf0" alt="" style="display: none;" />
            <div class="canvasStyle">
              <canvas id="myCanvas" class="myCanvas" width="600" height="450" ref="myCanvas"></canvas>
              <!-- <div class="canvasStyle-h-box" v-html="countDiseaseByPatientHtml"></div> -->
            </div>
          </div>
          <div class="summaryinfoL-img-elTag">
            <el-col class="elTag-style">
             <el-tag type="success" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypeNormal == '1'">普通</el-tag>
             <el-tag type="info" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypeChild == '1'">儿童</el-tag>
             <el-tag type="warning" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypePregnant == '1'">孕产妇</el-tag>
             <el-tag type="danger" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypeOld == '1'">老年人</el-tag>
              <el-tag type="success" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypeDiabetes == '1'">糖尿病</el-tag>
              <el-tag type="info" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypeHypertension == '1'">高血压</el-tag>
              <el-tag type="warning" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypeMental == '1'">精神病</el-tag>
              <el-tag type="danger" style='margin-top: 5px;' v-if="selectPatientDiseaseData.rsdtTypeTuberculosis == '1'">肺结核</el-tag>
              <el-tag type="danger" style='margin-top: 5px;' v-if="overweight">超重</el-tag>
              <el-tag type="danger" style='margin-top: 5px;' v-for="(item,index) in allergyNameList" :key="index">{{item}}</el-tag>
            </el-col>
          </div>
        </el-col>
        <el-col class="summaryinfo-l-bottom">
          <el-col :span="6">
            <el-col class="summaryinfo-l-bottom-text1">身高</el-col>
            <el-col>
              <span class="summaryinfo-l-bottom-text2">{{ patientInfo.height || '--' }}</span>
              <span class="summaryinfo-l-bottom-text3">cm</span>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col class="summaryinfo-l-bottom-text1">体重</el-col>
            <el-col>
              <span class="summaryinfo-l-bottom-text2">{{ patientInfo.weight || '--' }}</span>
              <span class="summaryinfo-l-bottom-text3">kg</span>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col class="summaryinfo-l-bottom-text1">血型</el-col>
            <el-col>
              <span class="summaryinfo-l-bottom-text2" :val="patientInfo.bloodType || '--'" code="BLOOD_TYPE_CODE" v-codeTransform></span>
              <!-- <span class="summaryinfo-l-bottom-text3">型</span> -->
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col class="summaryinfo-l-bottom-text1">BMI</el-col>
            <el-col>
              <span class="summaryinfo-l-bottom-text2">{{ bmiData || '--' }}</span>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col class="summaryinfoRight">
        <el-col class="padding-left-style">
          <el-tabs v-model="activeName" @tab-click="handleClickFirst">
            <el-tab-pane label="按照时间统计" name="first"></el-tab-pane>
            <el-tab-pane label="按照疾病统计" name="second"></el-tab-pane>
            <el-tab-pane label="按照诊疗类型统计" name="third"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col class="summaryinfoRight-top">
          <el-col class="summaryinfoRight-top-box" v-if="activeName == 'first'">
            <el-col class="summaryinfoRightopT-list" v-for="(conutByYear, index) in conutByYear" :key="index">
              <el-col class="summaryinfoRightopT-text">{{ conutByYear.time || '--' }}年</el-col>
              <el-col class="summaryinfoRightopT-text-b">
                <span class="summaryinfoRightopT-text1">{{ conutByYear.cs || '--' }}</span>
                <span class="summaryinfoRightopT-text2"></span>
              </el-col>
            </el-col>
          </el-col>

          <el-col class="summaryinfoRight-top-box" v-if="activeName == 'second'">
            <el-col class="summaryinfoRightopT-list" v-for="(conutByDisease, index) in conutByDisease" :key="index">
              <el-col class="summaryinfoRightopT-text">{{ conutByDisease.diag || '--' }}</el-col>
              <el-col class="summaryinfoRightopT-text-b">
                <span class="summaryinfoRightopT-text1">{{ conutByDisease.cs || '--' }}</span>
                <span class="summaryinfoRightopT-text2"></span>
              </el-col>
            </el-col>
          </el-col>

          <el-col class="summaryinfoRight-top-box" v-if="activeName == 'third'">
            <el-col class="summaryinfoRightopT-list" v-for="(conutByTreat, index) in conutByTreat" :key="index">
              <el-col class="summaryinfoRightopT-text">{{ conutByTreat.treatType == 'O' ? '门诊' : conutByTreat.treatType == 'I' ? '住院' : '急诊' }}</el-col>
              <el-col class="summaryinfoRightopT-text-b">
                <span class="summaryinfoRightopT-text1">{{ conutByTreat.cs || '--' }}</span>
                <span class="summaryinfoRightopT-text2" v-if="conutByTreat.treatType == 'O'">
                  <svg t="1592555302065" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11200" width="200" height="200">
                    <path
                      d="M966.4 940.8c-25.6-140.8-70.4-249.6-147.2-326.4-25.6-32-64-57.6-96-70.4-19.2 12.8-32 25.6-51.2 38.4 38.4 19.2 76.8 44.8 108.8 70.4 64 70.4 108.8 172.8 134.4 307.2H121.6v-6.4c19.2-128 64-230.4 134.4-300.8 32-32 64-57.6 108.8-70.4-32-19.2-44.8-32-64-44.8-38.4 19.2-70.4 44.8-96 76.8-76.8 76.8-121.6 192-147.2 326.4v76.8h915.2V960c-6.4-6.4-6.4-12.8-6.4-19.2z m-160-121.6V768h-70.4v-70.4h-51.2V768H608v51.2h70.4v70.4h51.2v-70.4h76.8z m-25.6-608c6.4 19.2 6.4 38.4 6.4 51.2 0 19.2 0 32-6.4 51.2h25.6c0 12.8 0 25.6-6.4 44.8-6.4 38.4-19.2 70.4-38.4 89.6-25.6 25.6-89.6 70.4-147.2 121.6-44.8 32-83.2 70.4-102.4 121.6-19.2-51.2-57.6-89.6-96-121.6-57.6-51.2-121.6-96-147.2-121.6-19.2-19.2-32-57.6-44.8-96 0-12.8-6.4-32-6.4-44.8h25.6c0-12.8-6.4-25.6-6.4-44.8 0-19.2 0-38.4 6.4-51.2-25.6 0-57.6 25.6-57.6 51.2 0 19.2 0 57.6 6.4 96s19.2 83.2 51.2 108.8c32 32 96 70.4 153.6 121.6 51.2 57.6 96 115.2 96 179.2v44.8c-19.2 6.4-38.4 25.6-38.4 51.2 0 32 25.6 51.2 51.2 51.2 32 0 51.2-25.6 51.2-51.2s-12.8-44.8-38.4-51.2V768c0-64 44.8-121.6 102.4-172.8 57.6-51.2 115.2-89.6 153.6-121.6 25.6-25.6 44.8-70.4 51.2-108.8 6.4-38.4 6.4-76.8 6.4-96 6.4-32-25.6-57.6-51.2-57.6z m-454.4 38.4C326.4 147.2 409.6 64 512 64c102.4 0 185.6 83.2 185.6 185.6 0 102.4-83.2 179.2-185.6 185.6-102.4 0-185.6-83.2-185.6-185.6z m-57.6 0C268.8 384 377.6 492.8 512 492.8c134.4 0 243.2-108.8 243.2-243.2C755.2 115.2 646.4 6.4 512 6.4 377.6 12.8 268.8 115.2 268.8 249.6z"
                      fill=""
                      p-id="11201"
                    ></path>
                  </svg>
                </span>
                <span class="summaryinfoRightopT-text2" v-if="conutByTreat.treatType == 'I'">
                  <svg t="1592554870457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9534" width="200" height="200">
                    <path
                      d="M294.4 512C377.6 512 448 448 448 364.8c0-83.2-70.4-147.2-153.6-147.2-83.2 0-153.6 64-153.6 147.2C140.8 448 204.8 512 294.4 512z m0-38.4c-64 0-115.2-44.8-115.2-108.8S230.4 256 294.4 256s115.2 44.8 115.2 108.8c-6.4 64-57.6 108.8-115.2 108.8zM819.2 256H448v300.8H134.4V166.4h-128V851.2h128v-128h748.8v128h128V448c6.4-108.8-83.2-192-192-192z m0 38.4c83.2 0 160 70.4 160 153.6v371.2h-51.2v-134.4H96v134.4H51.2V211.2h44.8v384h390.4V294.4h332.8z"
                      fill=""
                      p-id="9535"
                    ></path>
                  </svg>
                </span>
                <!-- <span class="summaryinfoRightopT-text2" v-if='conutByTreat.treatType == "O"'></span> -->
              </el-col>
            </el-col>
          </el-col>
        </el-col>

        <el-col class="summaryinfoRight-bottom">
          <el-col class="summaryinfoRight-box">
            <el-col class="summaryinfoRight-box-L">
              <el-tabs tab-position="left" style="min-height: 200px;" v-model="activeNameData" @tab-click="handleClickSecond" v-if="activeName == 'first'">
                <el-tab-pane v-for="(conutByYear, index) in conutByYear" :key="index" :name="conutByYear.index">
                  <span slot="label">
                    <span>{{ conutByYear.time + '年' }}</span>
                    <span class="cs-font">{{ conutByYear.cs + '次就诊' }}</span>
                  </span>
                </el-tab-pane>
              </el-tabs>
              <el-tabs tab-position="left" style="min-height: 200px;" v-model="activeNameData" @tab-click="handleClickSecond" v-if="activeName == 'second'">
                <el-tab-pane v-for="(conutByDisease, index) in conutByDisease" :key="index" :name="conutByDisease.index">
                  <span slot="label">
                    <span>{{ conutByDisease.diag }}</span>
                    <span class="cs-font">{{ conutByDisease.cs + '次就诊' }}</span>
                  </span>
                </el-tab-pane>
              </el-tabs>
              <el-tabs tab-position="left" style="min-height: 200px;" v-model="activeNameData" @tab-click="handleClickSecond" v-if="activeName == 'third'">
                <el-tab-pane :label="conutByTreat.summaryData" v-for="(conutByTreat, index) in conutByTreat" :key="index" :name="conutByTreat.index">
                  <span slot="label">
                    <span>{{ conutByTreat.treatType == 'O' ? '门诊' : conutByTreat.treatType == 'I' ? '住院' : '急诊' }}</span>
                    <span class="cs-font">{{ conutByTreat.cs + '次就诊' }}</span>
                  </span>
                </el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col class="summaryinfoRight-box-R">
              <div class="block">
                <elTimeline :patientItemList="patientItemList" @drawerrue="drawerrue"></elTimeline>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
  </div>
</template>

<script>
import elTimeline from './components/elTimeline.vue';
import { getPatientInformation, selectPatientDisease} from '@/api/eHrArchives/eHrArchives';
export default {
  name: 'summaryinfo',
  components: {
    elTimeline
  },
  data() {
    return {
      activeName: 'first',
      activeNameData: '0',
      drawer: false,
      img: new Image(), // 背景图片缓存
      imageUrl: '/img/renti.png',
      context: {}, // canvas对象
      conutByYear: [], //更具时间统计
      conutByTreat: [], //更具诊疗统计
      conutByDisease: [], //更具疾病统计
      // 右侧数据
      patientItemList: [],
      countDiseaseByPatient: [],
      countDiseaseByPatientHtml: '',
      patientInfo: {},
      bmiData: '',
      kongline: '--',
      selectPatientDiseaseData: {},
      allergyNameList: {},
      overweight: false,
      peoplePartList:[
        {
          diseaseX:120,
          diseaseY:6,
          tcdName:'头部',
          count:'12'
        },
        {
          diseaseX:110,
          diseaseY:20,
          tcdName:'眼部',
          count:'12'
        },
        {
          diseaseX:130,
          diseaseY:40,
          tcdName:'耳部',
          count:'12'
        },
        {
          diseaseX:100,
          diseaseY:100,
          tcdName:'肺部',
          count:'12'
        },
        {
          diseaseX:120,
          diseaseY:100,
          tcdName:'心脏部位',
          count:'12'
        },
        {
          diseaseX:130,
          diseaseY:140,
          tcdName:'胃部',
          count:'12'
        },
        {
          diseaseX:140,
          diseaseY:180,
          tcdName:'肾脏部',
          count:'12'
        },
        {
          diseaseX:120,
          diseaseY:220,
          tcdName:'消化部',
          count:'12'
        },
        {
          diseaseX:100,
          diseaseY:160,
          tcdName:'肝部',
          count:'12'
        },
        {
          diseaseX:20,
          diseaseY:230,
          tcdName:'手部',
          count:'12'
        },
        {
          diseaseX:140,
          diseaseY:280,
          tcdName:'大腿部',
          count:'12'
        },
        {
          diseaseX:90,
          diseaseY:310,
          tcdName:'小腿部',
          count:'12'
        },
        {
          diseaseX:150,
          diseaseY:390,
          tcdName:'脚踝部',
          count:'12'
        },
        {
          diseaseX:90,
          diseaseY:420,
          tcdName:'脚部',
          count:'12'
        }

      ]
    };
  },
  props: ['patientArchiveInfoVO'],
  created() {

  },
  mounted() {},
  methods: {
    // 疾病接口/ehr/selectPatientDisease
      async selectPatientDisease(obj) {
        let result = await selectPatientDisease(obj);
         console.log(result,'selectPatientDiseaseselectPatientDiseaseselectPatientDiseaseselectPatientDisease')
        if(result.code == '1'){
          if(result.data){
            this.selectPatientDiseaseData = result.data;
            this.allergyNameList = result.data.allergyNameList;
          }
        }else{
          this.$message.error(result.msg);
        }

      },
    // Canvas 方法
   async canvasFun() {
      // 获取Canvas 画图
      let myCanvas = document.getElementById('myCanvas');
      var ctx = myCanvas.getContext('2d');
      ctx.clearRect(0, 0, 600, 450);
      // 在Canvas画布 添加图片
      var img = this.$refs.conf0;
      var imgx = 150;
        ctx.drawImage(img, imgx, 0, 240, 450);
       // this.countDiseaseByPatient = this.peoplePartList;
        for(let i=0;i<this.countDiseaseByPatient.length;i++){
          let xround = parseInt(this.countDiseaseByPatient[i].diseaseX)+150
          ctx.fillStyle = "#f71c05";
          ctx.strokeStyle = '#f71c05';
          ctx.beginPath();
          ctx.arc(xround, parseInt(this.countDiseaseByPatient[i].diseaseY), 4, Math.PI * 2, 0, true);
          ctx.fill();
          ctx.closePath();
          ctx.stroke();
          if (parseInt(this.countDiseaseByPatient[i].diseaseX) >= 120){
              ctx.beginPath();
              ctx.moveTo(xround, parseInt(this.countDiseaseByPatient[i].diseaseY));
              ctx.lineTo(xround+120, parseInt(this.countDiseaseByPatient[i].diseaseY)+50);
              ctx.moveTo(xround+120, parseInt(this.countDiseaseByPatient[i].diseaseY)+50);
              ctx.lineTo(xround+140, parseInt(this.countDiseaseByPatient[i].diseaseY)+50);

              ctx.stroke();
              ctx.font = '12px 微软雅黑';
              ctx.fillStyle = "black";
              ctx.textAlign = "start";
              ctx.fillText(this.countDiseaseByPatient[i].tcdName, xround+150, parseInt(this.countDiseaseByPatient[i].diseaseY)+40);
              ctx.fillText(this.countDiseaseByPatient[i].count+'次', xround+150, parseInt(this.countDiseaseByPatient[i].diseaseY)+60);

          }else{
            if(parseInt(this.countDiseaseByPatient[i].diseaseY) >= 400){
                ctx.beginPath();
                ctx.moveTo(xround, parseInt(this.countDiseaseByPatient[i].diseaseY));
                ctx.lineTo(xround-80, parseInt(this.countDiseaseByPatient[i].diseaseY));

                ctx.stroke();
                ctx.font = '12px 微软雅黑';
                ctx.fillStyle = "black";
                ctx.textAlign = "end";
                ctx.fillText(this.countDiseaseByPatient[i].tcdName, xround-130, parseInt(this.countDiseaseByPatient[i].diseaseY));
                ctx.fillText(this.countDiseaseByPatient[i].count+'次', xround-130, parseInt(this.countDiseaseByPatient[i].diseaseY)+20);
            }else{
              ctx.beginPath();
              ctx.moveTo(xround, parseInt(this.countDiseaseByPatient[i].diseaseY));
              ctx.lineTo(xround-120, parseInt(this.countDiseaseByPatient[i].diseaseY)+50);
              ctx.moveTo(xround-120, parseInt(this.countDiseaseByPatient[i].diseaseY)+50);
              ctx.lineTo(xround-140, parseInt(this.countDiseaseByPatient[i].diseaseY)+50);

              ctx.stroke();
              ctx.font = '12px 微软雅黑';
              ctx.fillStyle = "black";
              ctx.textAlign = "end";
              ctx.fillText(this.countDiseaseByPatient[i].tcdName, xround-150, parseInt(this.countDiseaseByPatient[i].diseaseY)+40);
              ctx.fillText(this.countDiseaseByPatient[i].count+'次', xround-150, parseInt(this.countDiseaseByPatient[i].diseaseY)+60);
            }

          }
           ctx.stroke();
        }
    },
    drawerrue(obj) {
      this.drawer = true;
      // 往index 里传参数
      this.$emit('drawerrue', this.drawer, obj);
    },
    // 上面切换
    handleClickFirst(tab, event) {
      this.patientItemList = [];
      this.activeNameData = '0';

      if (this.activeName == 'first') {
        if (this.conutByYear[0]) {
          this.patientItemList = this.conutByYear[0].patientItemList || [];
        }
      } else if (this.activeName == 'second') {
        if (this.conutByDisease[0]) {
          this.patientItemList = this.conutByDisease[0].patientItemList || [];
        }
      } else {
        if (this.conutByDisease[0]) {
          this.patientItemList = this.conutByTreat[0].patientItemList || [];
        }
      }
    },
    // 下面左边切换，
    handleClickSecond(tab) {
      this.patientItemList = [];
      if (this.activeName == 'first') {
        this.patientItemList = this.conutByYear[tab.index].patientItemList;
      } else if (this.activeName == 'second') {
        this.patientItemList = this.conutByDisease[tab.index].patientItemList;
      } else {
        this.patientItemList = this.conutByTreat[tab.index].patientItemList;
      }
    },
    // 查询历次就诊信息  ehr/getPatientInformation
    async getPatientInformation(obj) {
      let result = await getPatientInformation(obj);
      // var countDiseaseByPatientHtml2;
      // var countDiseaseByPatientHtml;
      // console.log(result);
      this.patientItemList = [];
      if (result.code == 1) {
        this.conutByYear = result.data.conutByYear;
        this.conutByDisease = result.data.conutByDisease;
        if (this.conutByYear[0]) {
          this.patientItemList = this.conutByYear[0].patientItemList;
        }
        this.countDiseaseByPatient = result.data.countDiseaseByPatient;
          this.canvasFun();
          this.conutByTreat = result.data.conutByTreat;
      }
    }
  },
  watch: {
    patientArchiveInfoVO: function() {
      this.patientInfo = this.patientArchiveInfoVO;
      this.activeName = 'first';
      this.activeNameData = '0';
      this.getPatientInformation({
        patientId: this.patientInfo.patientId
      });
      this.selectPatientDisease({
        idNo: this.patientArchiveInfoVO.identificationNum,
         patientId: this.patientInfo.patientId
      })
      if (this.patientInfo.height && this.patientInfo.weight) {
        let height = this.patientInfo.height / 100;
        let weight = this.patientInfo.weight;
        let bmiData = '';
        bmiData = weight / Math.pow(height, 2);
        this.bmiData = bmiData.toFixed(1);
        if(this.bmiData > 24.0){
          this.overweight = true;
        }else{
          this.overweight = false;
        }
      } else {
        this.bmiData = '';
         this.overweight = false;
      }
    },
    countDiseaseByPatient:function(){
         this.$nextTick(function () {
             this.canvasFun();
         })
    }
  }
};
</script>

<style scoped lang="scss">
.summaryinfo {
  width: 90%;
  height: 100%;

  .summaryinfoLeft {
    width: 40%;
    border-right: 1px solid rgba(240, 240, 240, 1);
    height: 100%;
  }
  .summaryinfo-l-top {
    width: 100%;
    min-height: 530px;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
  }
  .summaryinfoL-img-box,
  .summaryinfoL-img-elTag,
  .elTag-style {
    display: flex;
    align-items: center;
    justify-content: center;
     flex-wrap: wrap;
    width: 100%;
  }
  .canvasStyle {
    width: 600px;
    height: 452px;
    position: relative;
    // border: 1px dotted #000000;
  }
  .myCanvas {
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .canvasStyle-h-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .canvasStyle-h-box >>> .canvasStyle-h {
    position: absolute;
    height: 17px;
    font-size: 12px;
    color: rgba(148, 157, 163, 1);
    line-height: 17px;
    top: 70px;
    right: -160px;
  }
  .canvasStyle-h-box >>> .canvasStyle-b {
    top: 330px;
  }
  .canvasStyle-h-box >>> .canvasStyle-c {
    display: inline-block;
    height: 21px;
    font-size: 16px;
    color: rgba(46, 50, 58, 1);
    line-height: 21px;
  }
  .elTag-style /deep/ .el-tag {
    margin-left: 8px;
  }
  .summaryinfoRight {
    width: 60%;
    height: 100%;
  }
  .summaryinfoL-img {
    width: 240px;
    height: 450px;
  }
  .elTag-style {
    margin-top: 20px;
  }
  .summaryinfo-l-bottom {
    padding: 20px;
  }
  .summaryinfo-l-bottom-text1 {
    font-size: 12px;
    color: rgba(148, 157, 163, 1);
    line-height: 17px;
    // text-align: center;
  }
  .summaryinfo-l-bottom-text2 {
    font-size: 32px;
    color: rgba(46, 50, 58, 1);
    line-height: 41px;
    text-align: center;
  }
  .summaryinfo-l-bottom-text3 {
    font-size: 14px;
    color: rgba(148, 157, 163, 1);
    line-height: 18px;
    text-align: center;
  }
  .padding-left-style {
    padding-left: 20px;
  }
  .summaryinfoRight-top {
    width: 100%;
    overflow-x: auto;
    padding-left: 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 153px;
    border-bottom: 1px solid rgba(240, 240, 240, 1);
  }
  .summaryinfoRight-top-box {
    height: 100px;
    display: inline-flex;
    width: auto;
  }
  .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  }
  .summaryinfoRightopT-list {
    display: inline-block;
    margin-right: 15px;
    box-sizing: border-box;
    padding: 10px;
    width: 204px;
    height: 93px;
    background: rgba(241, 244, 246, 1);
    border-radius: 4px;
  }
  .summaryinfoRight-box-L /deep/ .el-tabs__item {
    text-align: left !important;
    width: 100% !important;
    // overflow: hidden !important;
    white-space: normal !important;
    word-break: break-all !important;
    // border-bottom: 1px solid #CFCFCF;
  }
  .summaryinfoRight-box-L /deep/ .el-tabs--left .el-tabs__header.is-left,
  .summaryinfoRight-box-L /deep/ .el-tabs--left .el-tabs__nav-wrap.is-left .summaryinfoRight-box-L /deep/ .el-tabs--left .el-tabs__nav-scroll {
    width: 100%;
  }
  .summaryinfoRight-box-L /deep/ .el-tabs--left .el-tabs__item.is-left {
    height: 50px !important;
    margin-bottom: 12px;
    display: flex;
    align-items: center !important;
    justify-content: center;
    // overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  }
  .summaryinfoRight-box-L /deep/ .el-tabs--left .el-tabs__item.is-left::after {
    content: '';
    width: 20px;
    height: 1px;
    background: rgba(228, 228, 228, 1);
    position: absolute;
    right: -30px;
    top: 50%;
  }
  .summaryinfoRightopT-text {
    font-size: 12px;
    color: rgba(46, 50, 58, 1);
    line-height: 17px;
  }
  .summaryinfoRightopT-text-b {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .summaryinfoRightopT-text1 {
    font-size: 48px;
    font-weight: bold;
    color: rgba(185, 196, 204, 1);
    line-height: 62px;
  }
  .summaryinfoRightopT-text2 /deep/ svg {
    width: 32px;
    height: 32px;
    font-size: 48px;
  }
  .summaryinfoRight-box {
    width: 100%;
    height: 400px;
    box-sizing: border-box;
    padding: 20px;
  }
  .summaryinfoRight-box-L {
    width: 30%;
    height: 400px;
    overflow: auto;
    float: left;
    // padding-top: 12px;
  }
  .summaryinfoRight-box-R {
    width: 70%;
    height: 100%;
    float: right;
  }
  .summaryinfo-bottom-style {
    clear: both;
    overflow: auto;
    height: auto;
    width: 100%;
  }
  .block {
    height: 100%;
    overflow: auto;
  }
  /deep/ .el-tabs--left .el-tabs__item.is-left {
    width: 100 !important;
    writing-mode: initial !important;
    padding: 5px 5px !important;
    border-left: 3px solid transparent;
    border-radius: 5px;
  }
  /deep/ .el-tabs__nav.is-left {
    background-color: transparent !important;
  }
  /deep/ .el-tabs__item.is-left.is-active {
    width: 100% !important;
    background-color: #f1f4f6 !important;
    border-left: 4px solid rgba(43, 69, 131, 1);
    color: #000000 !important;
  }
  /deep/ .el-tabs__item.is-active {
    font-weight: 600 !important;
  }
  .cs-font {
    font-size: 12px;
    color: rgba(46, 50, 58, 1);
    line-height: 17px;
  }
}
</style>
