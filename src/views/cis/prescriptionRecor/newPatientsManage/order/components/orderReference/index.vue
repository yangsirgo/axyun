<template>
  <div class="wrapper height100" >
    <div class="fl left height100">
      <historyVisitRecords 
        v-loading="loading"
        ref="historyVisitRecords"
        :tableData="tableData" 
        @isMeClick="onSubmit" 
        @rowClick="rowClick" 
        @pageChange="search"></historyVisitRecords>
    </div>
    <western-history ref="history" :currentPrescriptionData="currentPrescriptionData" v-if="adviceType === '西药'" class="fr right height100" @copy="copyHandler"></western-history>
    <chm-history ref="history" :visitCode="receivePatientData.visitCode" :currentPrescriptionData="currentPrescriptionData" v-if="adviceType === '中草药'" class="fr right height100" @copy="copyHandler"></chm-history>
    <treat-history ref="history" :visitCode="receivePatientData.visitCode" :currentPrescriptionData="currentPrescriptionData" v-if="adviceType === '治疗'" class="fr right height100" @copy="copyHandler"></treat-history>
  </div>
</template>

<script>
  import westernHistory from "./history.vue"
  import chmHistory from "./chmHistory.vue"
  import treatHistory from "./treatHistory.vue"
  import { visitHistoryList } from '@/api/systemManagement/dataMaintain/adviceItem'
  import historyVisitRecords from '@/components/adviceCommon/modules/historyVisitRecords.vue'
  import { mapActions, mapGetters } from "vuex";

  
  export default {
    name: "index",
    components: { westernHistory, chmHistory, treatHistory, historyVisitRecords },
    props: {
      adviceType: {
        default: "西药"
      },
      currentPrescriptionData: {
        type: Array,
        default: function (){
          return [];
        }
      }
    },
    data() {
      return {
        loading: false,
        form: {
          name: '',
          isMe: false,
          value2: []
        },
        currentRow: {},
        tableData: [],
        tableParams: [{
          prop: 'visitCode',
          label: '诊疗号'
        }, {
          prop: 'patientName',
          label: '患者姓名'
        },{
          prop: 'diagName',
          label: '诊断'
        }, {
          prop: 'outpDeptName',
          label: '就诊科室'
        }, {
          prop: 'hosId',
          label: '所属社康'
        }],
        //不允许选择今天之后的日期
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pageSize: 10,
        totalPage: 50,
        currentPage: 1,
        loading: false
      };
    },
    // created() {
    //   this.getAdviceItemFun();
    // },
    mounted() {

    },
    methods: {
      copyHandler (mult){
        this.$emit("copy", mult);
      },
      datepickerChange (value){
        this.getAdviceItemFun();
      },
      onSubmit (pageData, value){
        this.getAdviceItemFun( pageData, value);
      },
      rowClick(row) {
        this.currentRow = row;
        this.$refs.history && this.$refs.history.reloadTableData (row);
      },
      handleCurrentChange(val) {
        this.search();
      },
      search(pageData, formData) {
        this.getAdviceItemFun(pageData, formData);
      },
      getParams ({ currentPage, pageSize, totalPage }, formData){
        let obj = {
          pageNo: currentPage,
          pageSize: pageSize
        };

        let datePicker = {
          startDate: '',
          stopDate: ''
        };
        if (formData.value2) {
          datePicker = {
            startDate: formData.value2[0]+' 00:00:00',
            stopDate: formData.value2[1]+' 23:59:59'
          };
        }


        return { ...obj, ...formData, ...datePicker };
      },
      handleSizeChange(val) {
        this.search();
      },
      getAdviceItemFun(pageData, formData) {
        let obj = this.getParams(pageData, formData);
        let {
          patientId,
          visitCode
        } = this.receivePatientData;
        if (!patientId) {return;}
        obj = {...obj, patientIds: patientId, visitCode};

        switch (this.adviceType) {
          case '西药':
            obj.adviceType = "10,12";
            break;
          case '中草药':
            obj.adviceType = "11";
            break;
          case '治疗':
            obj.adviceType = "1,2,3,4,7,8,9,13";
            break;
        }
        this.loading = true;
        visitHistoryList(obj)
          .then(res => {
            if (res.code === 1) {
              // this.tableData = resData;
              this.tableData = res.data;
              this.$refs.historyVisitRecords.setCurrentRow(this.tableData[0]);
              try {
                this.rowClick(this.tableData[0])
              } catch (error) {
                
              }
              
              // for(let i = 0; i < this.tableData.length; i++) {
              //   let row = this.tableData[i];
              //   this.tableData[i].status = row.status == "0" ? "激活" : "禁用";
              // }
              // this.totalPage = res.total;
              // this.pageNo = res.pageNo;
              // this.pageSize = res.pageSize;
            } else {
              this.$message.error('查询失败')
            }
             this.loading = false;
          })
          .catch((e)=>{
            this.$message.error('查询失败')
            this.loading = false;
          })
      }
    },
    watch: {},
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    padding: 10px;
    .left {
      width: 40%;
      padding-right: 10px;
      .main {
        display: flex;
        flex-direction: column;
      }
      .main-table {
        flex:1;  
      }
    }

    .right {
      width: 60%;
    }

  }
</style>
