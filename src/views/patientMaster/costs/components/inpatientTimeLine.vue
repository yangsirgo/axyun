<!--
<template>
  <div class="inpatientTimeLine">
    <time-line :yearList="yearList" :detailList="detailList"></time-line>
  </div>
</template>

<script>
import timeLine from "@/views/ipnw/components/historyInfo.vue";
import { getHistoryHospitalized } from "@/api/patientMaster/ehr";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "inpatientTimeLine",
  components: {
    timeLine
  },
  data() {
    return {
      loading: false,
      yearList: [],
      detailList: []
    };
  },
  watch: {
    receivePatientData: {
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
    //查询历史住院记录
    load() {
      this.loading = true;
      getHistoryHospitalized({
        patientId: this.receivePatientData.patientId
      })
        .then(res => {
          if (res.code == "1") {
            this.convertData(res.data);
            /*console.log("住院yearList:", this.yearList);
            console.log("住院detailList:", this.detailList);*/
          } else {
            this.$message.error(res.msg || "获取历史住院记录失败");
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error.msg || "获取历史住院记录失败");
        });
    },
    //后台获取数据，前台进行数据转换
    convertData(data) {
      let detail = [];
      let jzObject = {};
      let jzsjObject = {};
      for (let i = 0; i < data.length; i++) {
        let date = data[i].visitDt;
        let dateYear = date.substring(0, 4);
        let dateMonth = date.substring(5);
        if (this.yearList.length == 0) {
          this.yearList.push(dateYear);
        }
        if (this.detailList.length == 0) {
          jzObject.date = dateMonth;
          jzObject.depart = data[i].deptName;
          jzObject.context = "";
          detail.push(jzObject);
          jzsjObject.year = dateYear;
          jzsjObject.detail = detail;
          this.detailList.push(jzsjObject);
        }

        for (let j = 0; j < this.yearList.length; j++) {
          if (dateYear != this.yearList[j]) {
            this.yearList.push(dateYear);
          }
        }
        for (let k = 1; k < this.detailList.length; k++) {
          if (dateYear != this.detailList[k].year) {
            jzObject.date = dateMonth;
            jzObject.depart = data[i].deptName;
            jzObject.context = "";
            detail.push(jzObject);
            jzsjObject.year = dateYear;
            jzsjObject.detail = detail;
            this.detailList.push(jzsjObject);
          } else {
            let obj = {};
            obj.date = dateMonth;
            obj.depart = data[i].deptName;
            obj.context = "";
            this.detailList[k].detail.push(obj);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
-->
<template>
  <div class="inpatientTimeLine" v-loading="loading">
    <time-line :yearList="yearList" :detailList="detailList" @changeHisRecord="changeHisRecord"></time-line>
  </div>
</template>

<script>
  import timeLine from '@/views/ipnw/components/historyInfo.vue'
  import {getMryPatient} from "@/api/patientMaster/ehr";
  import { getHistoryHospitalized } from "@/api/patientMaster/ehr";
  import {getTableData} from "@/api/directive/directiveRequest";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "inpatientTimeLine",
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
        changeHisRecordInData: 'patientMaster/changeHisRecordInData'
      }),
      //查询就诊信息
      load() {
        this.loading = true;
        getHistoryHospitalized({
          patientId: this.receivePatientData.patientId
        }).then(async res => {
          if (res.code == '1') {
            if (res.data.length > 0) {
              /*let data = {
                code: 1,
                data: [
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "1霍乱轻型",
                    "visitDt": "2019-11-05 11:04:11",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910250002",
                    "patientId": "2c9180866dffe9fb016e00bcd3c40027",
                    "patientName": "高晓敏",
                    "visitCode": "VC302389282"
                  },
                  {
                    "diagName": "2继发性肺结核(复治,广泛耐药)涂阴培阳",
                    "visitDt": "2019-10-29 18:34:44",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "PC1910300001",
                    "patientId": "2c9180856e185710016e185fd8fb0001",
                    "patientName": "王木森",
                    "visitCode": "VC19102900002"
                  },
                  {
                    "diagName": "3气管支气管巨大症",
                    "visitDt": "2019-10-29 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "4气管支气管巨大症",
                    "visitDt": "2020-10-29 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "5肺结核",
                    "visitDt": "2020-11-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2019-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2019-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  },
                  {
                    "diagName": "7肺结核",
                    "visitDt": "2020-01-30 20:14:30",
                    "doctorId": "2c9180866df7dd21016dfdd6b690036a",
                    "doctorName": "李想",
                    "deptId": "92",
                    "patientCode": "201910245463",
                    "patientId": "2c9180866dfe6e41016dfe80aca5004d",
                    "patientName": "刘磊",
                    "visitCode": "VC19102900006"
                  }
                ]
              };
              await this.convertData(data.data);*/
              await this.convertData(res.data);
              await this.changeHisRecordInData({
                ...this.detailList[0].detail[0].diag
              });
            }else{
              await this.changeHisRecordInData({});
              this.$message('暂无住院记录');
            }
          } else {
            this.$message.error(res.msg || '获取住院记录失败');
          }
          this.loading = false;
        }).catch(error => {
          this.loading = false;
          this.$message.error(error.msg || '获取住院记录失败');
        });
      },
      //后台获取数据，前台进行数据转换
      async convertData(data) {
        for (let i in data) {
          if(!data[i].visitDt){
            continue;
          }
          let date = data[i].visitDt;
          let dateYear = date.substring(0, 4);
          let dateMonth = date.substring(5, 10);
          /*let deptName = await this.transformTable("org_nm", {
            org_type: '_DEPT_',
            id: data[i].deptId
          }, "sys_org");*/
          if (this.yearList.indexOf(dateYear) < 0) {
            this.yearList.push(dateYear);
            this.detailList.push({
              year: dateYear,
              detail: [{
                date: dateMonth,
                depart: data[i].deptName,
                context: '',
                diag: data[i]
              }]
            })
          } else {
            for (let j in this.detailList) {
              if (dateYear == this.detailList[j].year) {
                this.detailList[j].detail.push({
                  date: dateMonth,
                  depart: data[i].deptName,
                  context: '',
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
        this.changeHisRecordInData({
          ...data.diag
        });
      }
      //表数据反显
      /*,async transformTable(columns, conditionMap, tableName) {
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
      }*/
    }
  }

</script>

<style scoped>

</style>

