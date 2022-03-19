<template>
    <div style="width: 100%;height: 100%;" class="hd-ins-div">
      <div style="height: 100%;width: 55%;float: left;">
        <el-card style="width: 100%;height:40%;" id="insRec">
          <div style="width: 100%;height: 40px;">
            <div class="fangkuai"></div>
            <span style="line-height: 40px;margin-left: 5px;font-weight: bold;font-size: 16px">文书记录</span>
            <el-button class="detail" @click="$router.push({path:'/cisOne/opIntegratedEmr/opMedicalRec'})">详情</el-button>
          </div>
          <div :style="{height:insRecHeight}" style="overflow: auto" v-loading="insRecLoading">
            <div style="padding: 10px;border-bottom: 1px solid #E4E4E4"><span class="ins-text">{{insInfo.nm}}</span><span class="ins-text">{{insInfo.name}}</span><span class="ins-text">{{insInfo.bizTime}}</span></div>
            <div style="width: 100%;margin-top: 15px;" v-for="(value,key,index) in insRecList" :key="index">
              <p style="padding: 5px 10px;color: #949DA3;font-weight: bold">{{value.title}}</p>
              <p style="padding: 5px 10px">{{value.content}}</p>
            </div>
          </div>
        </el-card>
        <el-card style="width: 100%;height:calc(60% - 15px);margin-top:15px" id="report">
          <div style="width: 100%;height: 40px;" class="aaa">
            <div class="fangkuai"></div>
            <el-select v-model="reportType" style="width: 110px;margin-left: 5px;" @change="changeReportType">
              <el-option
                v-for="item in reportTypeOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button class="detail" @click="reportDetail">详情</el-button>
          </div>
          <div style="height: 85%;float: left;overflow: auto;padding: 0px 20px">
            <component :patien="receivePatientData.patientId" ref="timeLine" @detail="showDetail" :is="timeLine"></component>
          </div>
          <div style="height: 80%;margin: 20px 20px 20px 368px;padding-left:20px;overflow: auto;border-left: 1px solid #E4E4E4">
            <div v-if="reportType==='0'" >
              <img src="@/views/cis/integratedEmr/3.png" style="zoom: 0.7;"  alt=""/>
            </div>
            <div v-else>
              <!--<el-table-->
                <!--:data="testReport"-->
                <!--border-->
                <!--:height="testRecTableHeight"-->
                <!--style="width: 100%">-->
                <!--<el-table-column-->
                  <!--type="index"-->
                  <!--label="序号"-->
                  <!--width="50">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="project"-->
                  <!--label="检验项目"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="testResult"-->
                  <!--label="测定结果"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="unit"-->
                  <!--label="单位"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--label="结果"-->
                  <!--width="100">-->
                  <!--<template slot-scope="scope">-->
                    <!--<i :class="resIcon(scope.row.result)" ></i>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="scope"-->
                  <!--label="参考范围"-->
                  <!--width="100">-->
                <!--</el-table-column>-->
              <!--</el-table>-->
              <el-table
                :data="tabsList"
                highlight-current-row
                style="width: 100%"
                :height="testRecTableHeight"
                border
                v-loading="tlm_isLoading"
              >
                <el-table-column
                  v-for="(item,index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <span v-if="item.prop === 'result'">
                      <i
                        v-if="scope.row['assayResult'] > scope.row['referenceValue'].split('-')[1]"
                        class="iconfont iconshangsheng"
                      ></i>
                      <i
                        v-else-if="scope.row['assayResult'] < scope.row['referenceValue'].split('-')[0]"
                        class="iconfont iconxiajiang"
                      ></i>
                    </span>
                    <span v-else>{{ scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </div>
      <div style="height: 100%;margin-left: 56%">
        <el-card style="width: 100%;height: 30%;" id="diagnosticRec">
          <div style="width: 100%;height: 40px;">
            <div class="fangkuai"></div>
            <span style="line-height: 40px;margin-left: 5px;font-weight: bold;font-size: 16px">诊断记录</span>
            <el-button class="detail" @click="$router.push({path:'/cisOne/cisThree/diagnosis'})">详情</el-button>
          </div>
          <el-table
            :data="diagnosticRec"
            border
            :height="diagnosticRecHeight"
            v-loading="diagnosticRecTableLoading"
            style="width: 100%">
            <el-table-column
              prop="createdAt"
              label="时间"
              width="200">
            </el-table-column>
            <el-table-column
              prop="diagTypeName"
              label="诊断类型"
              width="200">
            </el-table-column>
            <el-table-column
              prop="diagName"
              label="诊断名称">
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="width: 100%;height: calc(70% - 15px);margin-top: 15px" id="prescriptionRec">
          <div style="width: 100%;height: 40px;">
            <div class="fangkuai"></div>
            <span style="line-height: 40px;margin-left: 5px;font-weight: bold;font-size: 16px">处方记录</span>
            <el-button class="detail"  @click="$router.push({path:'/cisOne/opIntegratedEmr/opMedicalOrder'})">详情</el-button>
          </div>
          <div style="width: 100%;overflow: auto">
            <el-table
              :data="prescriptionRec"
              border
              :height="prescriptionRecTableHeight"
              :span-method="rowSpanMethod"
              v-loading="prescriptionRecTableLoading"
              style="width: 100%">
              <el-table-column
                prop="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="date"
                label="时间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="drugName"
                label="药品名称"
                width="200">
              </el-table-column>
              <el-table-column
                prop="dose"
                label="规格剂量"
                width="150">
              </el-table-column>
              <el-table-column
                prop="dosage"
                label="用量"
                width="150">
              </el-table-column>
              <el-table-column
                label="组"
                width="50">
                <template slot-scope="scope">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
              </el-table-column>
              <el-table-column
                label="用法频次">
                <template slot-scope="scope">
                  <span :val="scope.row.useWay" code="MedicationRouteCode" v-codeTransform></span>x
                  <span columns="FREQUENCY_NAME" :conditionMap="{FREQUENCY_CODE: scope.row.frequencyCode}" tableName="hrp_frequency" v-tableTransform></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
</template>

<script>
    import timeLine from '@/views/cis/integratedEmr/component/timeLine.vue'
    import timeLine1 from '@/views/public/reportCenter/component/List.vue'
    import timeLine2 from '@/views/public/reportCenter/component/insList.vue'

    import {mapGetters } from 'vuex'
    import {
      getCurrentDiagList
    } from "@/api/common/diagnosis.js"
    import {getTree,contentQuery,contentQueryByCondition} from '@/api/emr/instrument'

    import {
      getOrdersByVisit
    } from "@/api/cis/order/order.js"

    import {getParagraphContent} from '@/utils/axeditor'
    import { getReportData } from "@/api/reportCenter/report";
    import { getTableDatas,transformCode,transformCodeList } from "@/api/directive/directiveRequest";

    export default {
        name: "introduction",
        data(){
          return{
            tableParams: [
              {
                prop: "assayName",
                label: "检验项目"
              },
              {
                prop: "assayResult",
                label: "测定结果"
              },
              {
                prop: "assayUnit",
                label: "单位"
              },
              {
                prop: "result",
                label: "结果"
              },
              {
                prop: "referenceValue",
                label: "参考范围"
              }
            ],
            tabsList: [],
            tlm_isLoading: false,
            reportType: '0',
            reportTypeOpts: [
              {
                label: '检查报告',
                value: '0'
              },
              {
                label: '检验报告',
                value: '1'
              }
            ],
            diagnosticRec: [],
            prescriptionRec: [
              // {
              //   date: '2019-09-12',
              //   drugName: '葡萄糖注射液',
              //   dose: '5%  500.0ml/袋',
              //   dosage: '1.0袋',
              //   groupNoCls: 'bunchingUp',
              //   frequency: '静滴 qd x 1天'
              // },
              // {
              //   date: '2019-09-12',
              //   drugName: '丹参注射液',
              //   dose: '10ml/支',
              //   dosage: '1.0支',
              //   groupNoCls: 'bunchingCenter',
              //   frequency: '静滴 qd x 1天'
              // },
              // {
              //   date: '2019-09-12',
              //   drugName: '乳糖酸阿奇霉素注射液',
              //   dose: '0.125g 2.5ml/支',
              //   dosage: '2.5ml/支',
              //   groupNoCls: 'bunchingDown',
              //   frequency: '静滴 qd x 1天'
              // }
            ],
            testReport: [
              {
                project: '白细胞计数',
                testResult: '13.00',
                unit: '10^9/L',
                result: 'up',
                scope: '4.00~10.0'
              },
              {
                project: '中性粒细胞百分比',
                testResult: '62.4',
                unit: '%',
                result: 'flat',
                scope: '50.0~70.0'
              },
              {
                project: '淋巴细胞百分比',
                testResult: '10',
                unit: '%',
                result: 'down',
                scope: '20.0~40'
              }
            ],
            diagnosticRecHeight: 100,
            testRecTableHeight: 100,
            prescriptionRecTableHeight: 100,
            insRecHeight: 100,
            diagnosticRecTableLoading: false,
            prescriptionRecTableLoading: false,
            insRecLoading: false,
            detailList1: [
              {
                date: new Date("2019-9-24"),
                project: '血常规',
                detail: 'XM001，检验科，已发布',
                value: true
              },
              {
                date: new Date("2019-9-20"),
                project: '血常规',
                detail: 'XM001，检验科，已发布',
                value: false
              }
            ],
            detailList2: [
              {
                date: new Date("2019-9-24"),
                project: '头部CT（CR/DR)',
                detail: 'XM001，CT室，已发布',
                value: true
              },
              {
                date: new Date("2019-9-15"),
                project: '腹部CT（CR/DR)',
                detail: 'XM001，CT室，已发布',
                value: false
              }
            ],
            // insNum: 0,
            insRecList: {},
            insInfo: {},
            detail: '',
            timeLine: 'timeLine2'
          }
        },
        components: {
          timeLine,
          timeLine1,
          timeLine2
        },
        computed: {
          ...mapGetters("base", ["receivePatientData"]),
          publishId() {
            return this.detail.assayPublishId;
          }
        },
        watch: {
          receivePatientData: {
            handler(n){
              if (!this.receivePatientData.visitCode){
                // this.$message.warning('请选择患者')
                return
              }
              this.loadDiagnosticRecTable()
              this.loadPrescriptionRecTable()
              this.loadInsRec()
            },
            deep: true,
            immediate: true
          },
          publishId: {
            handler(n){
              this.loadData()
            },
            immediate: true
          }
        },
        methods: {
          showDetail(data){
            this.detail = data
          },
          loadData() {
            this.tlm_isLoading = true;
            getReportData({
              assayPublishId: this.publishId
            })
              .then(res => {
                if (res.code === 1) {
                  this.tabsList = res.data;
                }
                this.tlm_isLoading = false;
              })
              .catch(err => {
                this.tlm_isLoading = false;
                //this.$message.error(err);
              });
          },
          rowSpanMethod({ row, column, rowIndex, columnIndex }){
            if (columnIndex === 0 || columnIndex === 6){
              if (row.groupNoCls == 'bunchingUp') {
                let length = 1
                do {
                  length++
                }while (this.prescriptionRec[++rowIndex].groupNoCls == 'bunchingCenter')
                return [length,1]
              }else if (row.groupNoCls === ''){
                return [1,1]
              } 
              return [0,0]
            }
            return [1,1]
          },
          resIcon(result){
            switch (result) {
              case 'up':
                return 'iconfont iconshangsheng'
              case 'down':
                return 'iconfont iconxiajiang'
              case 'flat':
                return 'flat'
            }
            return ''
          },
          loadDiagnosticRecTable(){
            this.diagnosticRecTableLoading = true
            getCurrentDiagList({visitCode: this.receivePatientData.visitCode}).then(res=>{
              if (res.code == 1){
                let arr = []
                res.data.forEach(item=>{
                  if (arr.indexOf(item.diagType) < 0) {
                    arr.push(item.diagType)
                  }
                })
                let params = []
                arr.forEach(xxx=>{
                  let param = {
                    field: 'name',
                    code: 'DiseaseDiagnosisCategoryCode',
                    val: xxx,
                    key: xxx
                  }
                  params.push(param)
                })
                transformCodeList(params).then(yyy=>{
                  if (yyy.code == 1){
                    res.data.forEach(sss=>{
                      sss.diagTypeName = yyy.data[sss.diagType]
                    })
                    this.diagnosticRec = res.data
                  }
                })
                this.diagnosticRecTableLoading = false
              }
            }).catch(res=>{
              this.$message.error(res.msg)
              this.diagnosticRecTableLoading = false
            })
          },
          loadPrescriptionRecTable(){
            this.prescriptionRec = []
            this.prescriptionRecTableLoading = true
            let index = 0
            getOrdersByVisit({visitCode: this.receivePatientData.visitCode}).then(res=>{
              if (res.code == 1){
                res.data.forEach(item=>{
                  if (!item){
                    return false
                  }
                    if (Array.isArray(item) && item.length != 1){
                      let firstIndex = this.prescriptionRec.length == 0 ? 0 : this.prescriptionRec.length
                      index++
                      for (let i = 0;i < item.length;i++){
                        let x = item[i]
                        let row = {
                          index: index,
                          date: x.createdAt,
                          drugName: x.oderItemName,
                          dose: x.spec,
                          dosage: x.onceDosage + x.dosageUnit,
                          groupNoCls: '',
                          frequency: x.useWay + ' x ' + x.frequencyCode,
                          useWay: x.useWay,
                          frequencyCode: x.frequencyCode
                        }
                        if (x.isMajor === '0'){
                          row.groupNoCls = 'bunchingUp'
                          this.prescriptionRec.splice(firstIndex,0,row)
                        }else {
                          row.groupNoCls = 'bunchingCenter'
                          this.prescriptionRec.push(row)
                        }
                      }
                      this.prescriptionRec[this.prescriptionRec.length - 1].groupNoCls = 'bunchingDown'
                    }else {
                      let row = {
                        index: ++index,
                        date: item.createdAt,
                        drugName: item.oderItemName,
                        dose: item.spec,
                        dosage: item.onceDosage + item.dosageUnit,
                        groupNoCls: '',
                        frequency: item.useWay + ' x ' + item.frequencyCode,
                        useWay: item.useWay,
                        frequencyCode: item.frequencyCode
                      }
                      this.prescriptionRec.push(row)
                    }
                  // let firstIndex = this.prescriptionRec.length == 0 ? 0 : this.prescriptionRec.length - 1
                  // for (let i = 0;i < item.orderGroup.length;i++){
                  //   let x = item.orderGroup[i]
                  //   let row = {
                  //     date: x.createdAt,
                  //     drugName: x.oderItemName,
                  //     dose: x.spec,
                  //     dosage: x.onceDosage + x.dosageUnit,
                  //     groupNoCls: '',
                  //     frequency: x.useWay + ' x ' + x.frequencyCode
                  //   }
                  //   if (x.isMajor === '0'){
                  //     row.groupNoCls = 'bunchingUp'
                  //     this.prescriptionRec.splice(firstIndex,0,row)
                  //   }else {
                  //     row.groupNoCls = 'bunchingCenter'
                  //     this.prescriptionRec.push(row)
                  //   }
                  // }
                  // if (item.orderGroup.length == 1){
                  //   this.prescriptionRec[this.prescriptionRec.length - 1].groupNoCls = ''
                  // } else{
                  //   this.prescriptionRec[this.prescriptionRec.length - 1].groupNoCls = 'bunchingDown'
                  // }
                   return true
                })
                this.prescriptionRecTableLoading = false
              }
            }).catch(res=>{
              this.$message.error(res.msg)
              this.prescriptionRecTableLoading = false
            })
          },
          changeReportType(){

            if (this.reportType === "0"){
              //this.$refs.timeLine.detailList = this.detailList2
              this.timeLine = 'timeLine2'
            } else{
              this.timeLine = 'timeLine1'
              //this.$refs.timeLine.detailList = this.detailList1
            }
          },
          reportDetail(){
            if (this.reportType === "0") {
              this.$router.push({path: '/cisOne/opIntegratedEmr/opTestReport'})
            }else {
              this.$router.push({path: '/cisOne/opIntegratedEmr/opExamReport'})
            }
          },
          // countIns(data){
          //   if (data.exts.mrName) {this.insNum++}
          //   if (data.children) {
          //     data.children.forEach(item=>{
          //       this.countIns(item);
          //     })
          //   }
          // },
          loadInsRec(){
            // this.insNum = 0;
            var data = {
              "patientId": this.receivePatientData.patientId,
              "enId": this.receivePatientData.visitCode
            };
            this.insRecLoading = true
            contentQueryByCondition(data).then(res=>{
              if (res.code == 1) {
                this.insRecList = getParagraphContent(res.data.docMongoContent)
                console.log('sssssssss:',this.insRecList)
                this.insInfo = res.data
                this.insRecLoading = false
              }else{
                this.$message.error(res.msg)
                this.insRecLoading = false
              }
            }).catch(res=>{
              this.$message.error(res.msg)
              this.insRecLoading = false
            })
            // getTree(data).then(res=> {
            //   if (res.code == 1) {
            //     res.data.forEach(item => {
            //       this.countIns(item);
            //     })
            //     if (this.insNum >= 1) {
            //       var param = {
            //         "mrId": res.data[0].exts.mrName ? res.data[0].exts.mrId : res.data[0].children[0].exts.mrId,
            //         "mrStaCd": res.data[0].exts.mrName ? res.data[0].exts.mrStaCd : res.data[0].children[0].exts.mrStaCd
            //       }
            //       contentQuery(param).then(res => {
            //         if (res.code == 1) {
            //
            //           this.insRecList = getParagraphContent(res.data.docMongoContent)
            //           console.log('aaaaaaaaaaaaaaa:' + JSON.stringify(getParagraphContent(res.data.docMongoContent)))
            //           this.$message({
            //             message: "查询成功!",
            //             type: "success"
            //           });
            //         } else {
            //           this.$message.error("查询失败!");
            //         }
            //       })
            //     }
            //   }
            // })
          }
        },
        mounted(){
          setTimeout(()=>{
            this.diagnosticRecHeight = document.getElementById("diagnosticRec").offsetHeight - 40
            this.testRecTableHeight = document.getElementById("report").offsetHeight - 90
            this.prescriptionRecTableHeight = document.getElementById("prescriptionRec").offsetHeight - 40
            this.insRecHeight = document.getElementById("insRec").offsetHeight - 45 + 'px'
          })
          this.$refs.timeLine.detailList = this.detailList2
        }
    }
</script>

<style lang="scss" scoped>
  .hd-ins-div{
    .bunchingUp {
      display: inline-block;
      color: $l-color-primary;

      &::after {
        content: '┓';
      }
    }

    .bunchingCenter {
      display: inline-block;
      color: $l-color-primary;

      &::after {
        content: '┫';
      }
    }

    .bunchingDown {
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: '┛';
      }
    }

    .flat{
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: '-';
      }
    }

    .bunchingSingle {
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: '】';
      }
    }

    .ins-text{
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px
    }

    .iconshangsheng {
      color: #e1140a;
    }
    .iconxiajiang {
      color: #3d7dfb;
    }

    .aaa{
      /deep/.el-input--medium .el-input__inner{
        border: 0px;
        font-weight: bold;
        font-size: 16px;
      }
    }
    .detail{
      width: 44px;
      height: 24px;
      padding: 5px;
      float: right;
      margin-top: 10px;
      margin-right: 20px;
    }

    .fangkuai{
      margin-left:10px;
      margin-top:10px;
      width: 5px;
      height: 20px;
      background-color: $l-color-primary;
      float: left
    }
  }

</style>
