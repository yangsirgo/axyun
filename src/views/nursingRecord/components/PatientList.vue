<template>
  <div class="height100 position-relative">
    <div class="height100" style="padding-top: 20px">
      <el-table
        class="patients-list"
        ref="singleTable"
        :data="patientsList"
        @row-click="handleSelectPatient"
        border
        highlight-current-row
        v-loading="tl_isLoading"
        stripe
        height="100%"
      >
        <el-table-column
          v-for="(item, index) in apply_column"
          :key="index"
          :prop="item.prop"
          :min-width="item.width"
          :label="item.label"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'bedNum'">
              <div v-if="scope.row[item.prop]">
                <span>{{ scope.row.bedNum }}</span> 床
              </div>
              <div v-else>-</div>
            </div>
            <div v-else-if="item.prop === 'patientGender'">
              <span
                :val="scope.row[item.prop]"
                code="GENDER_CODE"
                v-codeTransformEmr
              ></span>
            </div>
            <div v-else>{{ scope.row[item.prop] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from "vuex";
  import {
    fetchPatientsList,
    fetchApplyPatientsList,
    getCardReading
  } from "@/api/emrRecord/ipnw/etHospital";

  export default {
    components: {
      // LLoadMoreTable
    },
    props: {
      isMultiple: {
        default: false
      },
      title_position: {
        default: "top"
      },
      isHave: {
        default: true
      },
      type: {
        default: 1
      },
      labelType: {}
    },
    data() {
      return {
        keyWord: "", // 搜索用户关键词
        tl_isLoading: false, // 患者列表请求状态
        patientsList: [],
        apply_column: [
          {
            prop: "patientName",
            label: "姓名",
            fixed: false,
            width: "100"
          },
          {
            prop: "patientGender",
            label: "性别",
            fixed: false,
            width: "120"
          }
        ]
      };
    },
    computed: {
      ...mapGetters(["receivePatientData", "receivePatientDatas", "entryHosId"])
    },
    created() {
    },
    mounted() {
      let formCopy = {
        illnessArea: 'BQ0001',
        code: 2,
        admissionStatus: '2',
        search: '',
        isNurse: 1
      };
      this.search(formCopy);
    },
    methods: {
      ...mapActions({
        changeRecPatientData: "base/changeRecPatientData",
        changeRecPatientDatas: "base/changeRecPatientDatas",
        changeEntryHosId: "ipnw/changeEntryHosId"
      }),
      search(searchParams) {
        // 点击搜索按钮触发事件
        this.tl_isLoading = true;
        this.searchParams = searchParams;
        this.fetchPatientsList(searchParams);
      },
      async fetchPatientsList(searchParams = {}) {
        try {
          let params = {
            isNurse: 1,
            ...searchParams,
            keyword: searchParams.search
          };
          let {code, data} = await fetchPatientsList(params);
          if (code == 1) {
            this.patientsList = data;
          }
          this.tl_isLoading = false;
        } catch (e) {
          this.tl_isLoading = false;
        }
      },
      handleSelectPatient(row, index) {
        this.changeRecPatientData(row);
      }
    }
  };
</script>
<style lang="scss" scoped></style>
