<template>
  <div class="visitTimeLine" v-loading="loading">
    <time-line :yearList="yearList" :detailList="detailList" @changeHisRecord="changeHisRecord"></time-line>
  </div>
</template>

<script>
  import timeLine from '@/views/ipnw/components/historyInfo.vue'
  import {getMryPatient} from "@/api/patientMaster/ehr";
  import {archInfoHistory} from '@/api/arch/arch.js';
  import {getTableData} from "@/api/directive/directiveRequest";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "visitTimeLine",
    data() {
      return {
        loading: false,
        yearList: [],
        detailList: []
      }
    },
    components: {
      timeLine
    },
    watch: {
      "receivePatientData": {
        async handler(n) {
          this.yearList = [];
          this.detailList = [];
          if (JSON.stringify(n) !== "{}" && n.patientId) {
            this.load();
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData"])
    },
    methods: {
      ...mapActions({
        changeHisRecordData: 'patientMaster/changeHisRecordData'
      }),
      //查询就诊信息
      load() {
        this.loading = true;
        archInfoHistory({
          // patientId: '190816133569'
          // patientId: '402845926d707b61016d707c1a42000e'
          patientId: this.receivePatientData.patientId,
          pageNo: -1,
          pageSize: 20
        }).then(async res => {
          if (res.code == '1') {
            if (res.data.length > 0) {
              await this.convertData(res.data);
              if(this.detailList!=null&&this.detailList.length>0){
                await this.changeHisRecordData({
                  ...this.detailList[0].detail[0].diag
                });
              }
              else{
                await this.changeHisRecordData({});
                this.$message('暂无就诊记录');
              }
            }else{
              await this.changeHisRecordData({});
              this.$message('暂无就诊记录');
            }
          } else {
            this.$message.error(res.msg || '获取就诊记录失败');
          }
          this.loading = false;
        }).catch(error => {
          console.info(error)
          this.loading = false;
          this.$message.error(error.msg || '获取就诊记录失败');
        });
      },
      //后台获取数据，前台进行数据转换
      async convertData(data) {
        for (let i in data) {
          // if(!data[i].diagTime){
          //   continue;
          // }
          let date = data[i].diagTime || data[i].appointmentTime;
          // if(!date){
          //   date = new Date() + '';
          // }
          let dateYear =date? date.substring(0, 4):'';
          let dateMonth =date? date.substring(5, 10):'';
          let deptName = await this.transformTable("org_nm", {
            org_type: '_DEPT_',
            id: data[i].ouptDeptId
          }, "sys_org");
          if (this.yearList.indexOf(dateYear) < 0) {
              this.yearList.push(dateYear);
              this.detailList.push({
                year: dateYear,
                detail: [{
                  date: dateMonth,
                  depart: deptName,
                  context: data[i].diagName,
                  diag: data[i]
                }]
              })

          } else {
            for (let j in this.detailList) {
              if (dateYear == this.detailList[j].year) {
                this.detailList[j].detail.push({
                  date: dateMonth,
                  // depart: data[i].ouptDeptId,
                  depart: deptName,
                  context: data[i].diagName,
                  diag: data[i]
                });
              }
            }
          }
        }
        // console.log("yearList:", this.yearList);
        // console.log("detailList:", this.detailList);
      },
      //接收子组件数据
      changeHisRecord(data) {
        this.changeHisRecordData({
          ...data.diag
        });
      },
      //表数据反显
      async transformTable(columns, conditionMap, tableName) {
        try {
          let data = {
            tableName: tableName || '',
            columns: columns || '',
            conditionMap: conditionMap || {}
          };
          let resData = await getTableData(data);
          if (resData.code === 1 && resData.data != []) {
            return Promise.resolve(resData.data[0][columns]);
          } else {
            return '默认';
          }
        } catch (error) {
          return '默认';
        }
      }
    }
  }

</script>

<style scoped>

</style>
