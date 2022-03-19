<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
    >
      <template #topSlot>
        <top></top>
      </template>
      <template #list>
        <!--<leftTabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          v-model="leftTabsValue"
          :tabs-name="tabsName"
          :form-list="formParams"
          mode='patientMaster'>
          <template #first>
            <left-list :param="param" :searchType="searchType" @getPatientInfo="getPatientInfoP"></left-list>
          </template>
          &lt;!&ndash;<template #second>
            第二卡片内容
          </template>
          <template #third>
            第三卡片内容
          </template>&ndash;&gt;
        </leftTabs>-->
        <LSideTab
          @tabClick="handleClick"
          @sideEvent="sideEvent"
        >
          <template #formList>
            <div class="margin-bottom-6">
              <el-checkbox true-label="1" false-label="0" v-model="form.reservation">当日预约</el-checkbox>
            </div>
            <div class="margin-bottom-6">
              <l-value-domain
                clearable
                code="ARCH_STATUS"
                style="width: 100%"
                :value.sync="form.recordStatus"
                placeholder="请选择档案状态"
              ></l-value-domain>
            </div>
            <div class="margin-bottom-6">
              <el-date-picker
                v-model="form.timeRange"
                type="daterange"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
              ></el-date-picker>
            </div>
            <el-input @keyup.native.enter="sideEvent('query')"
                      v-model="form.search"
                      placeholder="姓名/身份证号/患者编号"
                      style="width: 100%"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="('query')"></i>
            </el-input>
          </template>
          <template #mainCont>
            <left-list :param="form" ref="leftList"></left-list>
          </template>
          <template #sideOperation></template>
        </LSideTab>
      </template>
      <template #content>
        <div class="cont-list">
          <div class="cont-middle">
            <el-row class="clearfix">
              <div class="anthro-data-con">
                <l-anthro-pogram-svg>
                </l-anthro-pogram-svg>
              </div>
            </el-row>
            <el-row class="clearfix">
              <div style="width:calc(100% - 400px);" class="card-con common con-style float-left">
                <div class="card-top-con">
                  <l-card-title>
                    <span slot="left">就诊记录</span>
                  </l-card-title>
                </div>
                <ul
                  class="infinite-list"
                  v-infinite-scroll="loadNextPage"
                  infinite-scroll-immediate="true"
                  infinite-scroll-distance="10"
                  infinite-scroll-disabled="listDisabled"
                  style="overflow:auto"
                >
                  <li
                    v-for="(item, index) in recordList"
                    :key="index"
                  >
                    <!--class="infinite-list-item"-->
                    <span class="record-title-con">
                      {{localCodeTransform(item.ouptDeptId)}}：
                      <!--<span
                        class="deptName"
                        tableName="sys_org"
                        :conditionMap="{
                          org_type: '_DEPT_',
                          id: item.ouptDeptId
                        }"
                        columns="org_nm"
                        v-tableTransform
                      ></span>-->
                      <!--{{ `${item.deptName}(${item.visitDt})` }}-->
                    </span>
                    <span class="record-cont-con">
                      {{item.diagName || '无'}}
                      <!--{{ getDocMsg(item.docMsg) }}-->
                    </span>
                  </li>
                </ul>
                <!--<p class="loading-tips" v-if="loading">加载中...</p>-->
                <!--<p class="loading-tips no-more" v-if="noMore">没有更多了</p>-->
              </div>
              <div style="margin-left: 10px;margin-top: 10px" class="table-con common">
                <div class="table-top-con">
                  <!--<p class="title-con">
                    <span style="margin-right: 10px">过敏记录</span>
                    &lt;!&ndash;<el-checkbox v-model="checked" @change="handleCheckChange">仅看有效</el-checkbox>&ndash;&gt;
                  </p>-->
                  <l-card-title>
                    <span slot="left">过敏记录</span>
                  </l-card-title>
                </div>

                <!--<div class="table-contain">
                  <el-table
                    ref="singleTable"
                    :data="tabelAllergyList"
                    highlight-current-row
                    style="width: 100%"
                    height="260"
                    stripe
                    border
                    v-loading="isTableLoading"
                    v-loadmore="{noMoreVar:'gmNoMore', loadingVar: 'gmLoading', value: loadGm}"
                    element-loading-text="加载中..."
                  >
                    <el-table-column
                      v-for="item in tabelAllergyColumn"
                      :key="item.label"
                      :label="item.label"
                      :prop="item.prop"
                      align="left"
                      show-overflow-tooltip
                      header-align="left"
                      :min-width="item.width"
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop == 'source' ">
                          <span v-if="scope.row['orderId']">手动录入</span>
                          <span v-else>皮试</span>
                        </template>
                        <template v-else-if="item.prop == 'deptName'">
                          <span>{{scope.row['ouptDeptName'] ? scope.row['ouptDeptName'] : scope.row['inpDeptName']}}</span>
                        </template>
                        <template v-else-if="item.prop == 'status'">
                          <span v-if="scope.row['status'] == '0'">待执行</span>
                          <span v-else-if="scope.row['status'] == '1'">执行中</span>
                          <span v-else-if="scope.row['status'] == '2'">有效</span>
                          <span v-else-if="scope.row['status'] == '3'">过期</span>
                        </template>
                        <template v-else-if="item.prop == 'allergyCategory'">
                          <span v-if="scope.row['allergyCategory'] == '0'">药物过敏</span>
                          <span v-else-if="scope.row['allergyCategory'] == '1'">食物过敏</span>
                          <span v-else-if="scope.row['allergyCategory'] == '2'">造影剂过敏</span>
                        </template>
                        <template v-else>
                          <span>{{scope.row[item.prop]}}</span>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>-->
                <div class="table-contain clearfix">
                  <!--<el-checkbox-group v-model="guominList">-->
                  <div class="float-left table-item" v-for="(item,index) in guominList" :key="index">
                    <el-checkbox v-model="allergyName" disabled>{{item.allergyName}}</el-checkbox>
                  </div>
                  <!--</el-checkbox-group>-->
                </div>
              </div>
              <!--<div style="width:calc(100% - 400px);margin-top: 20px" class="table-con common">
                <div class="table-top-con">
                  <p class="title-con">
                    <span>手术记录</span>
                  </p>
                </div>
                <div class="table-contain">
                  <el-table
                    ref="singleTable"
                    :data="tabelSurgeryList"
                    highlight-current-row
                    style="width: 100%"
                    height="260"
                    v-loadmore="loadSurgeryTable"
                    stripe
                    border
                    v-loading="isTableLoading"
                    element-loading-text="加载中..."
                  >
                    <el-table-column
                      v-for="item in tabelSurgeryColumn"
                      :key="item.label"
                      :label="item.label"
                      :prop="item.prop"
                      align="left"
                      show-overflow-tooltip
                      header-align="left"
                      :min-width="item.width"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>-->
            </el-row>
            <el-row style="margin-top: 10px" class="clearfix">
              <div class="half-width float-left" style="margin-right: 10px">
                <div class="table-con common border-two">
                  <div class="table-top-con border-left">
                    <l-card-title>
                      <span slot="left">
                        <span class="float-left" style="margin-right: 10px">诊断记录</span>
                        <span class="float-left">
                          <l-value-domain
                            code="DiseaseDiagnosisCategoryCode"
                            :value.sync="value"
                            class="select-container"
                            :placeholder="$t('base.placeholder')"
                            @change="currentSel"
                          ></l-value-domain>
                        </span>
                      </span>
                    </l-card-title>
                  </div>
                  <div class="table-contain border-top-none">
                    <el-table
                      ref="singleTable"
                      :data="tabelDiagnoseList"
                      highlight-current-row
                      style="width: 100%"
                      height="260"
                      v-loadmore="{noMoreVar:'zdNoMore', loadingVar: 'zdLoading', value: loadZd}"
                      stripe
                      border
                      v-loading="isTableLoading"
                      element-loading-text="加载中..."
                    >
                      <el-table-column
                        v-for="item in tabelDiagnoseColumn"
                        :key="item.label"
                        :label="item.label"
                        :prop="item.prop"
                        align="left"
                        show-overflow-tooltip
                        header-align="left"
                        :min-width="item.width"
                      >
                        <template slot-scope="scope">
                          <span v-if="item.prop == 'diagType'" :val="scope.row[item.prop]"
                                code="DiseaseDiagnosisCategoryCode" v-codeTransform></span>
                          <span v-else>{{ scope.row[item.prop]}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
              <div class="half-width float-left">
                <div class="table-con common border-two">
                  <div class="table-top-con border-left">
                    <!--<p class="title-con">
                      <span>慢病记录</span>
                    </p>-->
                    <l-card-title>
                      <span slot="left">慢病记录</span>
                    </l-card-title>
                  </div>
                  <div class="table-contain border-top-none">
                    <el-table
                      ref="singleTable"
                      :data="tabelChroniceList"
                      highlight-current-row
                      style="width: 100%"
                      height="260"
                      v-loadmore="{noMoreVar:'mbNoMore', loadingVar: 'mbLoading', value: loadMb}"
                      stripe
                      border
                      v-loading="isTableLoading"
                      element-loading-text="加载中..."
                    >
                      <el-table-column
                        v-for="item in tabelChronicColumn"
                        :key="item.label"
                        :label="item.label"
                        :prop="item.prop"
                        align="left"
                        show-overflow-tooltip
                        header-align="left"
                        :min-width="item.width"
                      >
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-row>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftTabs from "@/components/LSideTabs.vue";
  // import leftList from "@/views/patientMaster/cardsRecord/components/leftList.vue";
  import leftList from "@/views/patientMaster/cardsRecord/components/leftList.vue";
  import top from "../recordManage/recordShow/components/top";
  import {
    getDiaByParam,
    getAllergyPatientInfo,
    getMryPatient,
    getDistinctEffectiveRecord
  } from "@/api/patientMaster/ehr";
  import {getParagraphContent} from '@/utils/axeditor';
  import {getDepList} from '@/api/nursingRecord/authorityMaintain';
  import {mapActions, mapGetters} from 'vuex';
  import LSideTab from "@/views/components/LSideTab";

  export default {
    name: "",
    components: {
      top,
      leftTabs,
      leftList,
      LSideTab
    },
    data() {
      return {
        depList: [],
        toolBoxs: ["TreatmentInfoBox"],
        formParams: ['timeRange', 'recordStatus', 'search'],
        leftTabsValue: {},
        tabsName: [{
          label: '患者列表',
          value: 'first'
        }],
        patientDetail: {},
        loading: false,
        count: 10,
        checked: false,
        isTableLoading: false,
        value: "",
        options: [
          {
            value: "1",
            label: "门诊诊断"
          },
          {
            value: "2",
            label: "入院诊断"
          }
        ],
        // 分页控制参数
        pageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        recordList: [],
        tabelAllergyColumn: [
          {
            prop: "deptName",
            label: "科室",
            width: "30"
          },
          {
            prop: "status",
            label: "状态",
            width: "30"
          },
          {
            prop: "allergyCategory",
            label: "过敏类型",
            width: "30"
          },
          {
            prop: "allergyName",
            label: "过敏原",
            width: "40"
          },
          {
            prop: "symptomDescription",
            label: "症状",
            width: "50"
          },
          {
            prop: "remark",
            label: "备注",
            width: "30"
          },
          {
            prop: "source",
            label: "来源",
            width: "40"
          }
        ],
        // 过敏分页数据
        gmPageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        //诊断分页数据
        zdPageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        //慢病分页数据
        mbPageParams: {
          pageNo: 1, // 当前页数
          total: 0, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        gmLoading: false,
        zdLoading: false,
        mbLoading: false,
        // 过敏记录数据源
        tabelAllergyList: [],
        tabelSurgeryColumn: [
          {
            prop: "organization",
            label: "机构",
            width: "60"
          },
          {
            prop: "date",
            label: "时间",
            width: "40"
          },
          {
            prop: "surgery",
            label: "手术名",
            width: "60"
          },
          {
            prop: "incision",
            label: "切口",
            width: "30"
          }
        ],
        tabelSurgeryList: [
          {
            id: 1,
            organization: "上海复旦医院",
            date: "2019-09-12",
            surgery: "膀胱镜镜检+左侧D-J管拔除术",
            incision: "一类切口"
          },
          {
            id: 1,
            organization: "上海东华医院",
            date: "2019-09-08",
            surgery: "膀胱镜检+左侧D-J管拔除术",
            incision: "一类切口"
          },
          {
            id: 1,
            organization: "松江区医院",
            date: "2019-08-04",
            surgery: " 电切镜镜检+前列腺电切术",
            incision: "一类切口"
          },
          {
            id: 1,
            organization: "闵行区医院",
            date: "2019-09-29",
            surgery: "前列腺电切术",
            incision: "一类切口"
          }
        ],
        // diagnose  诊断
        tabelDiagnoseColumn: [
          {
            prop: "deptName",
            label: "科室",
            width: "30"
          },
          {
            prop: "diagTime",
            label: "时间",
            width: "45"
          },
          {
            prop: "diagType",
            label: "诊断类型",
            width: "40"
          },
          {
            prop: "diagName",
            label: "诊断名称",
            width: "60"
          }
        ],
        tabelDiagnoseList: [],
        // chronic  慢病
        tabelChronicColumn: [
          {
            prop: "deptName",
            label: "科室",
            width: "30"
          },
          {
            prop: "diagName",
            label: "慢病信息",
            width: "60"
          }
        ],
        tabelChroniceList: [],
        patientInfo: {},
        param: {},
        searchType: '',
        guominList: [],
        allergyName: true,

        form: {
          reservation: 0,
          recordStatus: '',
          timeRange: []
        }
      };
    },
    provide() {
      return {
        getIsCreatRecordBtn: () => 0// 是否建档按钮:1为有;0为无
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData", "patientListData"]),
      listDisabled() {
        return this.loading || this.noMore;
      },
      noMore() {
        return Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo;
      },
      /*gmNoMore() {
        return Math.ceil(this.gmPageParams.total / this.gmPageParams.pageSize) <=
          this.gmPageParams.pageNo;
      },*/
      zdNoMore() {
        return Math.ceil(this.zdPageParams.total / this.zdPageParams.pageSize) <=
          this.zdPageParams.pageNo;
      },
      mbNoMore() {
        return Math.ceil(this.mbPageParams.total / this.mbPageParams.pageSize) <=
          this.mbPageParams.pageNo;
      }
    },
    watch: {
      "receivePatientData": {
        async handler(n) {
          this.tabelDiagnoseList = [];
          this.tabelChroniceList = [];
          this.tabelAllergyList = [];
          this.recordList = [];
          if (JSON.stringify(n) !== "{}") {
            if (n.patientId) {
              //数据变化 回调
              await this.loadZd();
              await this.loadMb();
              // await this.loadGm();
              await this.loadGuom();
              await this.load();
            } else {
              this.$message("该患者未建档，请开始建档");
              this.$router.push('/patientMaster/recordCreate');
            }
          }
        },
        immediate: true,
        deep: true
      },
      'patientListData': {
        async handler(n) {
          this.leftTabsValue = [];
          if (typeof n.patientList !== 'undefined') {
            this.leftTabsValue = n.leftTabsValue
          } else {
            this.leftTabsValue = {}
          }
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      this.getDep();
      // this.sideEvent('query');
    },
    methods: {
      //子组件抛出的方法
      sideEvent(sideEvent) {
        let obj = {
          query: 'getPatientList',
          readCard: 'readCard',
          createRecord: 'createRecord'
        };
        this.$nextTick(() => {
          this.$refs.leftList[obj[sideEvent]](this.form);
        });
      },
      //工具箱
      messageHandler() {
        console.log('工具箱');
      },
      //左侧列表转换tab
      handleClick(tabs) {
      },
      /*获取科室列表*/
      async getDep() {
        try {
          let data = await getDepList();
          if (data.code == '1') {
            this.depList = data.data;
          }
        } catch (error) {
          console.log(error);
        }
      },
      localCodeTransform(id) {
        let list = this.depList;
        for (let item in list) {
          if (list[item].id == id) {
            return list[item].orgNm;
          }
        }
        return '';
      },
      //获取patientInfo
      getPatientInfoP(data) {
        this.patientInfo = data;
        console.log(data)
      },
      //获取诊断主述信息
      getDocMsg(docMsg) {
        console.log("docMsg：", docMsg)
        console.log("主述：", getParagraphContent(docMsg, 'zs').zs.content
        );
        if (docMsg) {
          return getParagraphContent(docMsg, 'zs').zs.content;
        }
          return "";


      },
      // 查询方法
      search(form) {

        delete form["startTimeRange"];
        delete form["endTimeRange"];
        if (form.timeRange != null && form.timeRange.length > 1) {
          form["startTimeRange"] = form.timeRange[0];
          form["endTimeRange"] = form.timeRange[1];
        }
        this.param = {
          ...form,
          date: new Date()
        };
        this.searchType = 'searchButton';
      },
      // 读卡方法
      readCard(form) {
        let clearData = '1';
        if (this.patientListData.patientList.length > 0 && this.patientListData.clear == '2') {
          clearData = '2';//不清
        }
        this.param = {
          cardId: form.search,
          date: new Date(),
          clearData: clearData
        };
        this.searchType = 'readCard';
      },
      //查询就诊信息
      load() {
        this.recordList = [];
        this.loading = true;
        getMryPatient({
          patientIds: this.receivePatientData.patientId
          // isMe: false
          // ...this.pageParams
        }).then(res => {
          // console.log("jiuzhen1:", res);
          if (res.code === 1) {
            // this.pageParams = {...res.pageParams};
            // this.recordList = this.recordList.concat(res.data);
            this.recordList = res.data;
          }
          // console.log('ajax', this.noMore, this.pageParams);
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$message.error(err.msg);
        });
      },
      // 加载下一页
      loadNextPage() {
        console.log(this.noMore);
        if (this.noMore) {
          return;
        }
        this.pageParams.pageNo++;
        this.load();
      },
      // 过敏记录
      /*loadGm() {
        let status;
        this.gmLoading = true;
        if (this.checked) {
          status = 2;
        }else{
          status = '';
        }
        getAllergyPatientInfo({
          patientId: this.receivePatientData.patientId,
          status: status,
          ...this.pageParams
        }).then(res => {
          console.log("guomin1:", res);
          if (res.code === 1) {
            this.gmPageParams = {...res.pageParams};
            this.tabelAllergyList = this.tabelAllergyList.concat(res.data);
          }
          this.gmLoading = false;
        }).catch(err => {
          this.gmLoading = false;
          this.$message.error(err)
        });
      },*/
      loadGuom() {
        this.gmLoading = true;
        getDistinctEffectiveRecord({
          patientId: this.receivePatientData.patientId
          // patientId: '2c9180856e185710016e185fd8fb0001'
        }).then(res => {
          if (res.code === 1) {
            this.guominList = res.data;
          } else {
            this.$message.error(res.msg || '获取过敏源信息失败');
          }
          this.gmLoading = false;
        }).catch(err => {
          this.gmLoading = false;
          this.$message.error(err.msg)
        });
      },
      // 加载手术列表数据
      loadSurgeryTable() {
      },
      // 加载诊断记录
      loadZd() {
        this.zdLoading = true;
        getDiaByParam({
          patientId: this.receivePatientData.patientId,
          diagType: this.value,
          ...this.pageParams
        }).then(res => {
          console.log("zhenduan2:", res.data);
          if (res.code === 1) {
            this.zdPageParams = {...res.pageParams};
            this.tabelDiagnoseList = this.tabelDiagnoseList.concat(res.data);
            console.log('zd', this.tabelDiagnoseList)
          }
          this.zdLoading = false;
        }).catch(err => {
          this.zdLoading = false;
          this.$message.error(err)
        });

      },
      //诊断记录选中诊断类型下拉框事件
      currentSel() {
        this.tabelDiagnoseList.splice(0);
        this.loadZd();
      },
      // 加载慢病记录
      loadMb() {
        getDiaByParam({
          patientId: this.receivePatientData.patientId,
          isChronicDisease: '1',
          ...this.pageParams
        }).then(res => {
          console.log("manbing2:", res.data);
          if (res.code === 1) {
            this.mbpageParams = {...res.pageParams};
            this.tabelChroniceList = this.tabelChroniceList.concat(res.data);
          }
          this.mbLoading = false;
        }).catch(err => {
            this.mbLoading = false;
            this.$message.error(err)
          }
        );
      },
      // 处理选中后事件
      handleCheckChange() {
        //清空数组
        this.tabelAllergyList.splice(0);
        this.loadGm();
      }
    }
  };
</script>

<style lang='scss' scoped>
  .left-list {
    margin-top: 20px;
    height: calc(100% - 250px);
    overflow-y: auto;
  }

  .cont-list {
    width: 100%;
    height: 100%;
    overflow: auto;

    .half-width {
      width: calc(50% - 5px);
    }

    .cont-middle {
      padding: 20px;
      height: 100%;
      background-color: $l-color-white;
      font-size: 0;
      overflow-y: auto;

      .anthro-data-con {
        /* // background-color: #5cc68a; */
        background: linear-gradient(to top, #5cc68a 0%, #314aa0 100%);

        .right-con {
          margin-left: 70px;
          margin-top: 50px;
          font-size: 14px;

          .label-name {
            position: relative;
            margin-top: 6px;
            margin-bottom: 15px;
            line-height: 20px;
            color: #fff;
          }

          .label-name:before {
            content: "";
            position: absolute;
            left: -25px;
            top: 3px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: #7cd283;
          }

          .warning:before {
            background-color: #e06560;
          }
        }
      }

      .common {
        background: $l-color-white;
        /*box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);*/
        border: 1px solid $l-color-bgcolor-11;
        border-radius: 2px;
      }

      .con-style {
        margin-right: 10px;
        margin-top: 10px;
      }

      .card-con {
        display: inline-block;
        width: 380px;
        height: 320px;
        overflow: hidden;
        background-color: $l-color-white;
        font-size: 14px;

        .card-top-con {
          /*display: inline-block;
          width: 100%;
          height: 60px;
          background-color: $l-color-bgcolor-18;*/
          padding-left: 20px;

          .title-con {
            padding-left: 20px;
            height: 100%;
            font-size: 16px;
            line-height: 60px;
            border-left: 4px solid $l-color-primary;
          }
        }

        .infinite-list {
          padding: 20px;
          height: 230px;
          overflow: auto;
          border-top: 1px solid $l-color-bgcolor-11;

          .infinite-list-item {
            margin-bottom: 10px;
            color: $l-color-fontcolor-3;

            .title-con {
              font-size: 16px;
              line-height: 28px;
              font-weight: 600;
            }

            .cont-con {
              font-size: 14px;
              line-height: 20px;
              word-break: break-all;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
            }
          }
        }

        .loading-tips {
          text-align: center;
          line-height: 24px;
          color: $l-color-primary;
        }

        .no-more {
          color: #949da3;
        }

        .record-title-con {
          height: 40px;
          font-size: 16px;
          line-height: 40px;
          font-weight: 600;
        }

        .record-cont-con {
          height: 40px;
          font-size: 14px;
          line-height: 40px;
          font-weight: 600;
          color: $l-color-fontcolor-4;
        }
      }

      .table-con {
        height: 320px;
        overflow: hidden;

        .table-top-con {
          /*display: inline-block;
          width: 100%;
          height: 60px;
          background-color: $l-color-bgcolor-18;*/
          padding-left: 20px;

          .title-con {
            padding-left: 20px;
            height: 100%;
            font-size: 16px;
            line-height: 60px;
            border-left: 4px solid $l-color-primary;
          }
        }
      }

      .table-contain {
        border-top: 1px solid $l-color-bgcolor-11;

        .table-item {
          margin: 15px;
        }
      }
    }
  }

  /deep/ .img {
    margin-top: 10px;
    margin-left: 10px;
  }

  .border-left {
    border: none !important;
    border-left: 1px solid $l-color-bgcolor-11 !important;
    border-right: 1px solid $l-color-bgcolor-11 !important;
  }

  .border-two {
    border: none !important;
    border-top: 1px solid $l-color-bgcolor-11 !important;
    border-bottom: 1px solid $l-color-bgcolor-11 !important;
  }

  .border-top-none {
    border-top: none !important;
  }

  .margin-bottom-6 {
    margin-bottom: 6px;
  }
</style>
