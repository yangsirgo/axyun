<template>
  <div class="wrapper height100" ref="page">
    <div class="fl height100 leftPatientsPart padding-right-10" :style="{'width': Number(toggleBtn.left) + 'px'}">
      <div class="trigger" ref="triggerBtn" @click="toggle">
        <i :class="toggleBtn.buttonIcon"></i>
      </div>
      <el-card class="box-card" style="height: 100%">
        <el-tabs v-model="activeName" @tab-click="handleClick" v-show="showTabs">
          <el-tab-pane v-for="(item ,i) in Locations" :label="item.label" :name="item.name" :key="i">
            <el-table
              ref="tableElem"
              :data="tableData"
              tooltip-effect="dark"
              height="100%"
              v-loadmore="{noMoreVar:'tlm_noMore', loadingVar: 'tlm_isLoading', value: loadNextPage}"
              element-loading-text="加载中..."
              @row-click="tableRowsClick"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                v-for="item in tableParams"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                header-align="center"
                :key="item.label"
                :align="item.align || 'left'"
                :fixed="item.fixed"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div class="leftBar" v-show="!showTabs">
          <el-select v-model="activeName" placeholder="请选择">
            <el-option
              v-for="item in Locations"
              :key="item.name"
              :label="item.label"
              :value="item.name">
            </el-option>
          </el-select>
          <div class="list">
            <ul>
              <li
                v-for="(item,index) in tableData"
                :class="index == currentPatient?'li active':'li'"
                @click="handle_selectPatient(index,item)">{{item.patientName}}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

    <div class="center height100 padding-left-10" :style="{'margin-left': Number(toggleBtn.left) + 'px'}">
      <div class="top">
        <top :patient-details="patientDetails"></top>
      </div>
      <div class="bottom">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import adHeight from "@/mixins/adHeight";
  import top from "../components/patientDetails.vue";
  import { mapActions } from 'vuex'
  import { getPatients } from "@/api/cis/resident/resident";


  export default {
    mixins: [adHeight],
    components: {
      top
    },
    data() {
      return {
        showTabs: true,
        Locations: [{
          label: '我的患者',
          name: 'first'
        }, {
          label: '本组患者',
          name: 'second'
        }, {
          label: '本科患者',
          name: 'three'
        }],
        patientDetails: { // 患者基本信息

          patientName: '' // 患者姓名

        },
        tableParams: [{
          prop: 'bedCode',
          label: '床号',
          align: 'center'
        }, {
          prop: 'inpCode',
          label: '住院号',
          align: 'center'
        }, {
          prop: 'patientName',
          label: '姓名',
          align: 'center'
        }],
        tableData: [

        ],
        toggleBtn: {
          left: "297",
          buttonIcon: "el-icon-arrow-left",
        },
        activeName: 'first',
        currentPatient: 0, // 当前选择的患者下标
      }
    },
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
      }),
      async getPatientList(){
        let data = {
          admissionStatus: 1
        }

        let result = await getPatients(data);
        if(result.code == 1){
          this.tableData = result.data;
          this.changeRecPatientData(result.data[0]);
        }
      },
      toggle() {
        this.toggleBtn.left = this.toggleBtn.left === "297" ? "104" : "297";
        this.toggleBtn.buttonIcon = this.toggleBtn.buttonIcon === "el-icon-arrow-left" ? "el-icon-arrow-right" : "el-icon-arrow-left";
        this.showTabs = !this.showTabs;
      },
      handleClick() {

      },
      tableRowsClick (row, column, event){
        this.currentPatient = row.index;

        this.changeRecPatientData(row);
      },
      loadNextPage() {

      },
      handle_selectPatient(index, row) { // 选择患者
        this.currentPatient = index;

        this.changeRecPatientData(row).then(() => {

        });
      },
      tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
        if (this.currentPatient == rowIndex) {

          return "selected-row"
        }
        return ''
      }

    },
    mounted() {
      this.getPatientList();
    }
  };
</script>
<style scoped lang="scss">
  .wrapper {

    .trigger {
      position: absolute;
      top: calc(50% - 25px);
      height: 50px;
      right: 9px;
      width: 18px;
      z-index: 1000;
      border: 1px solid #ccc;
      background-color: #fff;
      border-radius: 4px;
      cursor: pointer;

      > i {
        position: relative;
        top: 35%;
        left: 1px;
      }
    }

    .leftPatientsPart {
      width: 297px;
      position: relative;
      .box-card {
        /deep/.el-table .selected-row {
          background:rgba(255,234,226,1);
        }
      }
    }

    .center {
      margin-left: 297px;
      position: relative;
      padding-left: 10px;

      .top {
        position: absolute;
        height: 65px;
        top: 0;
        width: calc(100% - 10px);
      }

      .bottom {
        top: 85px;
        bottom: 0;
        width: calc(100% - 10px);
        position: absolute;
      }
    }
  }

  /deep/ .el-table--group, .el-table--border {
    border: 0;
  }

  .leftBar {
    /deep/ .el-select {
      line-height: 64px;

      /deep/ .el-input__inner {
        border: 0;
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-primary;
      }

      /deep/ .el-input__suffix {
        top: -2px;
        right: -2px;
      }
    }

    .list {
      .li {
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        background: rgba(246, 246, 246, 1);
      }

      .li:nth-of-type(odd) {
        background: #fff;
      }

      .li:nth-of-type(even) {
        background: rgba(246, 246, 246, 1);
      }

      .li.active {
        background: rgba(255, 234, 226, 1) !important;
        font-size: 14px;
        
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
      }
    }

  }
</style>
