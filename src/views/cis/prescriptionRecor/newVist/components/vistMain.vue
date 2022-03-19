<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      @message="messageHandler"
    >
      <template #list>
        <left-bar></left-bar>
      </template>
      <template #content>
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
          v-loading="tableLoading"
          element-loading-text="列表正在加载中"
          height="100%"
        >
          <el-table-column
            class="overflow-point"
            header-align="center"
            v-for="(item, index) in tableParams"
            :key="index"
            show-overflow-tooltip
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :fixed="item.fixed === true"
          >

            <template slot-scope="scope">
              <template v-if="item.prop === 'settlementType'">
                <span :val="scope.row[item.prop]" code="MedicalPaymentMethod" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop === 'diagTreatType'">
                <span :val="scope.row[item.prop]" code="DIAG_TREAT_TYPE" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop === 'recordStatus'">
                <span :val="scope.row[item.prop]" code="SeeDoctorStatus" v-codeTransform></span>
              </template>
              <template  v-else>
                <span class="overflow-point">{{ scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftBar from "../../../components/leftBar.vue";
  import { mapActions, mapGetters } from 'vuex'
  import {getPatients} from "@/api/cis/visit/visit";
  export default {
    name: "",
    components: {
      leftBar
    },
    data() {
      return {
        tableLoading : false,
        toolBoxs: ["patientInfo"],
        tableData : [],
        tableParams : [{
          prop : 'queueUpNum',
          label : '排队号',
          align : 'center'
        },{
          prop : 'visitCode',
          label : '门诊号',
          width : 140,
          align : 'center'
        },{
          prop : 'patientName',
          label : '患者',
          align : 'center'
        },{
          prop : 'settlementType',
          label : '费用类型',
          align : 'center'
        },{
          prop : 'attendTime',
          label : '挂号时间',
          align : 'center',
          width : 140
        },{
          prop : 'diagTreatType',
          label : '挂号类别',
          align : 'center'
        },{
          prop : 'doctorName',
          label : '就诊医生',
          align : 'center'
        },{
          prop : 'recordStatus',
          label : '就诊状态',
          align : 'center'
        },{
          prop : 'symptomDescription',
          label : '过敏信息',
          align : 'center'
        }
        // ,{
        //   prop : '',
        //   label : '到诊状态',
        //   align : 'center'
        // }
        ]
      };
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData'
      }),
      messageHandler() {
        console.log("工具箱消息")
      },
      loadData(){
        this.tableLoading = true;
        getPatients(null, false).then(res => {
          this.tableData = res.data;
          this.tableLoading = false;
        }).catch(() => {
          this.tableLoading = false;
        })
      },
      handleCurrentChange(row) {
        this.changeRecPatientData(row);
      }
    },
    created() {
      this.loadData();
    },
    computed : {
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      "receivePatientData":{//深度监听，可监听到对象、数组的变化
        handler(val){
          console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
        },
        immediate: true,
        deep:true
      }
    }
  };
</script>

<style lang='scss' scoped>

</style>

