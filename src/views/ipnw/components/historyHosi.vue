<template>
  <div class="visitTimeLine" v-loading="loading">
    <time-line :yearList="yearList" :detailList="detailList"></time-line>
  </div>
</template>

<script>
  import timeLine from '@/views/ipnw/components/historyInfo.vue'
  import {getMryPatient} from "@/api/patientMaster/ehr";
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
          if (JSON.stringify(n) !== "{}") {
            this.load();
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"])
    },
    methods: {
      //查询就诊信息
      load() {
        this.loading = true;
        getMryPatient({
          // patientId: '190816133569'
          // patientId: '402845926d707b61016d707c1a42000e'
          patientId: this.receivePatientData.patientId
        }).then(res => {
          console.log("jz:", res);
          if (res.code === 1) {
            this.convertData(res.data);
            console.log("yearList:", this.yearList);
            console.log("detailList:", this.detailList);
          }
          this.loading = false;
        }).catch(error => {
          this.loading = false;
          this.$message.error(error.msg);
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
  }

</script>

<style scoped>

</style>
