<template>
  <div class="applycontent width100 height100">
    <el-row class="arearowall" :gutter="10">
      <!--左侧  -->
      <el-col :span="11" class="arearowleft">
        <el-tabs v-model="activeName" class="apply-content-tabs">
          <el-tab-pane label="检验科" name="first">
            <el-row :gutter="10" class="topseach">
              <el-col :span="6">
                <el-select
                  v-model="formSearch.group"
                  placeholder="组套"
                  @change="search(1)"
                >
                  <el-option
                    v-for="item in groups"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="18">
                <el-input
                  placeholder="项目名称或简拼查询"
                  v-model="formSearch.inputop"
                  @keydown.native="enterSearch($event)"
                ></el-input>
              </el-col>
              <!-- <el-col :span="8">
                <el-button @click="search(2)" type="primary" size="small">查询</el-button>
              </el-col>-->
            </el-row>
            <div class="handle-btn-box">
              <el-button
                class="filter-item iconfont icontijiao1"
                type="text"
                @click="sent"
                v-hotKey="{ func: 'func_submit', flag: 'submitLoad' }"
                >&nbsp;提交申请</el-button
              >
              <el-button
                class="filter-item iconfont iconcunweimoban"
                type="text"
                @click="showRelList"
                v-hotKey="{ func: 'func_add1' }"
                >&nbsp;存为模板</el-button
              >
              <el-button
                class="filter-item iconfont icondayin"
                type="text"
                v-hotKey="{ func: 'func_print' }"
                >&nbsp;打印</el-button
              >
            </div>
            <!-- <div class="table-type">
              <span
                v-for="item in tableDataType"
                :key="item.id"
                :class="{'is-active':activeType === item.id}"
                @click="changTableType(item.id)"
              >{{item.title}}</span>
            </div>-->
            <el-row :class="['navall', modelVisible ? 'shrink' : '']">
              <el-col :span="24" style="height: 100%">
                <el-table
                  height="100%"
                  :data="orderTable"
                  row-key="yzid"
                  border
                  ref="orderTable"
                  :span-method="objectSpanMethod"
                  @selection-change="handleSelectionChange"
                  v-loading="leftLoading"
                >
                  <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    align="center"
                    width="55"
                  ></el-table-column>
                  <el-table-column
                    prop="name"
                    label="医嘱名称"
                  ></el-table-column>
                  <el-table-column
                    prop="yzname"
                    label="项目名称"
                    show-overflow-tooltip
                  ></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <div class="save-template-box" v-if="modelVisible">
              <l-card-title>
                <div slot="left">
                  保存模板
                  <el-select
                    class="save-template-sel"
                    v-model="saveType"
                    placeholder="请选择"
                  >
                    <el-option value="1" label="科室"></el-option>
                    <el-option value="2" label="个人"></el-option>
                  </el-select>
                </div>
                <div slot="right">
                  <i
                    class="el-icon-close cursor-pointer"
                    title="关闭"
                    @click="closeSaveTem"
                  ></i>
                </div>
              </l-card-title>
              <el-form
                :model="modeldata"
                :rules="rules"
                ref="ruleForm"
                label-width="0"
                class="demo-ruleForm"
              >
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="modelname">
                      <l-formt-title label="名称" :required="true">
                        <el-input
                          v-model="modeldata.modelname"
                          placeholder="请输入内容"
                        ></el-input>
                      </l-formt-title>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <div class="overflow-point">
                        <span class="allergy-form-title">已选</span>
                        <span>{{ checkTxt }}</span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item prop="modelbz">
                    <l-formt-title label="备注">
                      <el-input
                        v-model="modeldata.modelbz"
                        placeholder="请输入内容"
                        maxlength="100"
                        show-word-limit
                      ></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-row>
              </el-form>
              <div class="allergy-form-btn">
                <el-button
                  type="primary"
                  @click="conserve"
                  v-hotKey="{ func: 'func_save', flag: 'saveTemLoad' }"
                  v-loading="saveTemLoad"
                  >保存</el-button
                >
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="细菌室" name="second"></el-tab-pane>
          <el-tab-pane v-if="eleTemType === 1" label="床旁检验" name="third"></el-tab-pane>-->
        </el-tabs>
      </el-col>

      <!-- 右侧列表 -->
      <el-col :span="13" class="righttable">
        <el-row class="rightrow">
          <!-- 右侧title -->
          <el-row>
            <el-col :span="24">
              <l-card-title>
                <div slot="left">历史申请</div>
              </l-card-title>
            </el-col>
          </el-row>

          <!-- 右侧搜索条件 -->
          <el-row :gutter="6" style="margin-bottom: 10px">
            <div class="right-search-right float-right">
              <el-checkbox
                v-model="rightdata.rightseach.checkedstat"
                @change="rightseach"
                >仅看我的申请</el-checkbox
              >
              <el-button @click="cancel()" type="primary" size="small" plain
                >撤销申请</el-button
              >
            </div>
            <div class="right-search-left">
              <el-date-picker
                style="width: 220px"
                v-model="rightdata.rightseach.timepicker"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              ></el-date-picker>
              <el-select
                style="width: 130px"
                v-model="rightdata.rightseach.statechack"
              >
                <el-option
                  v-for="item in rightdata.stategroup"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button @click="rightseach()" type="primary" size="small"
                >查询</el-button
              >
            </div>
          </el-row>

          <!-- table -->
          <el-row class="rigmidtable">
            <el-table
              ref="rigTable"
              :data="rightdata.rightable"
              row-key="assayApplyId"
              border
              stripe
              height="100%"
              highlight-current-row
              @selection-change="selectCancelApply"
              @row-click="rowClick"
              v-loading="rightTableLoad"
              v-hotKey="{
                func: ['table_row', 'table_checkbox', 'table_choose'],
                deClass: 'el-table__row',
                curClass: 'current-row',
              }"
            >
              <el-table-column
                fixed
                type="selection"
                :reserve-selection="true"
                align="center"
                width="55"
              ></el-table-column>
              <el-table-column fixed label="进度" min-width="80">
                <template slot-scope="scope">
                  <div class="his-apply">
                    <div
                      class="his-apply-bar"
                      :style="{ width: scope.row.progre + '%' }"
                    >
                      <div class="his-apply-circle"></div>
                    </div>
                  </div>
                  <!-- <Lprogress :barwhid="scope.row.progre"></Lprogress> -->
                  <!-- <el-progress :percentage="scope.row.progre"></el-progress> -->
                </template>
              </el-table-column>
              <el-table-column
                prop="begaintime"
                label="申请日期"
                min-width="120"
              ></el-table-column>
              <el-table-column
                prop="project"
                label="项目"
                min-width="120"
              ></el-table-column>
              <el-table-column prop="state" label="状态" min-width="120">
                <template slot-scope="scope">
                  <span class="state-color">{{
                    rightdata.stageInvert[scope.row.state]
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="备注"
                min-width="120"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="specimen"
                label="标本"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="coststatus"
                label="费用状态"
                min-width="80"
              >
                <template slot-scope="scope">
                  <span class="state-color">{{
                    rightdata.chargeStatusTrans[scope.row.coststatus]
                  }}</span>
                </template></el-table-column
              >
              <el-table-column
                prop="AppSection"
                label="申请科室"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.AppSection,
                    }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="appDoctor"
                label="申请医生"
                min-width="80"
              ></el-table-column>
            </el-table>
          </el-row>

          <el-row class="bottomtext">
            <el-col :span="24">
              <el-steps
                class="consultation-step"
                :active="rightdata.active"
                finish-status="success"
                style="padding: 20px"
              >
                <!--<el-step title="申请" icon="filter-item iconfont icon-dianziyizhujiaohu1">
                  <template slot="description">
                    <p>夏艳</p>
                    <p>2019-05-02 10:00</p>
                  </template>
                </el-step>
                <el-step title="采集" icon="filter-item iconfont icon-dianziyizhujiaohu1">
                  <template slot="description">
                    <p>席胜军</p>
                    <p>2019-05-03 11:00</p>
                  </template>
                </el-step>
                <el-step title="签收" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>
                <el-step title="审核发布" icon="filter-item iconfont icon-dianziyizhujiaohu1"></el-step>-->
                <el-step
                  v-for="(value, key) in rightdata.activeStepList"
                  :key="key"
                  :title="value.title"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                >
                  <template slot="description">
                    <p>{{ value.data.name }}</p>
                    <p>{{ value.data.time }}</p>
                  </template>
                </el-step>
              </el-steps>
              <!-- <el-steps :active="rightdata.active" finish-status="success" style="padding:20px;">
                <el-step
                  title="申请"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.qsteplist.docname + rightdata.qsteplist.steptime"
                ></el-step>
                <el-step
                  title="采集"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.caijiteplist.docname + rightdata.caijiteplist.steptime"
                ></el-step>
                <el-step
                  title="签收"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.jcteplist.docname + rightdata.jcteplist.steptime"
                ></el-step>
                <el-step
                  title="审核发布"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.fbteplist.docname + rightdata.fbteplist.steptime"
                ></el-step>
              </el-steps>-->
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>

    <!-- 保存模板弹窗 -->
    <!-- <el-dialog :visible.sync="modelVisible" title="保存至个人诊断模板" width="470px" @close="huidanClose">
      <el-form label-position="top" inline style="padding:20px 0;">
        <el-row>
          <el-col :offset="4" :span="16">
            <LFormtTitle label="名称" labelWidth="50">
              <el-input v-model="modeldata.modelname" style="line-height: 34px;" placeholder="请输入"></el-input>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="4" :span="16">
            <LFormtTitle label="备注" labelWidth="50">
              <el-input
                v-model="modeldata.modelbz"
                style="line-height: 34px;"
                placeholder="请输入至少5个字"
              ></el-input>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row style="border-top:1px solid #E4E4E4;margin-top:20px; padding-top:20px;">
          <el-col :offset="6" :span="18">
            <div style="float:right;padding-right:30px;">
              <el-button type="primary" @click="conserve">确认</el-button>
              <el-button type="primary" plain @click="huidanClose">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>-->
  </div>
</template>
<script>
// import adHeight from "@/mixins/adHeight";
import {
  getChargeTemplateList,
  getHistoryApplyList,
  saveTemplate,
  getAilItems
} from "@/api/electronApply/chargeTemplate";
import { submitApply, cancelApply } from "@/api/electronApply/inspectionApply";
import saveTem from "./saveTem";
import { mapGetters } from "vuex";
import mixin from "@/mixins/electronApply.js";

export default {
  data() {
    return {
      // 保存模板弹窗默认关闭
      modelVisible: false,
      // 模板类型
      templateType: 4,
      // 默认显示tabs
      activeName: "first",
      // 保存模板数据源
      saveType: "1",
      modeldata: {
        modelname: "",
        modelbz: ""
      },
      // 保存模板校验
      rules: {
        modelname: [{ required: true, message: "请输入", trigger: "blur" }],
        modelbz: [{ required: false, message: "请输入", trigger: "blur" }]
      },
      // 搜索
      formSearch: {
        group: "1",
        inputop: ""
      },
      //组套下拉
      groups: [],

      patientParam: {},
      //选中模板id
      chacakid: "",
      //菜单导航数据源
      activeIndex: "10",
      //科室模板
      setmeal: [],
      //个人模板
      persmeal: [],
      //常用模板
      usedmeal: [],

      //检查项表格数据源
      orderTable: [],
      spanArr: [],
      //检验明细选中数据源
      checkedList: [],
      //检验申请选中记录
      applyList: [],
      rowIndex: "-1",
      OrderIndexArr: [],

      //右侧表单数据源
      rightdata: {
        //右侧搜索数据源
        rightseach: {
          statechack: "0", //搜索范围
          timepicker: [], //搜索时间
          checkedstat: false //是否只看自己
        },
        stategroup: [
          {
            id: "0",
            name: "全部"
          },
          {
            id: "1",
            name: "已提交"
          },
          {
            id: "2",
            name: "已审核"
          },
          {
            id: "3",
            name: "已执行"
          },
          {
            id: "4",
            name: "退回"
          },
          {
            id: "5",
            name: "已预约"
          },
          {
            id: "6",
            name: "取消预约"
          },
          {
            id: "8",
            name: "已登记"
          },
          {
            id: "9",
            name: "已检查"
          },
          {
            id: "10",
            name: "已出报告"
          },
          {
            id: "11",
            name: "医技科室取消"
          },
          {
            id: "99",
            name: "作废"
          }
        ],
        stageInvert: {
          0: "全部",
          1: "已提交",
          2: "已审核",
          3: "已执行",
          4: "退回",
          5: "已预约",
          6: "取消预约",
          8: "已登记",
          9: "已检查",
          10: "已出报告",
          11: "医技科室取消",
          99: "作废"
        },
        chargeStatusTrans: {
          1: "未收费",
          2: "已计费",
          3: "已收费",
          4: "部分退费",
          5: "全部退费"
        },
        //右侧表格数据源
        rightable: [],

        //步骤图数据源
        active: 0,
        // jyStep:[{title:"申请",data:{name:"ceshi1",time:"2019-10-6 11:11"}},{title:"采集",data:{name:"ceshi1",time:"2019-10-7 11:11"}},
        //   {title:"报告审核",data:{name:"ceshi1",time:"2019-10-8 11:11"}},{title:"结束",data:{name:"",time:""}}],
        //
        // jcStep:[{title:"申请",data:{name:"ceshi1",time:"2019-10-6 11:11"}},{title:"预约登记",data:{name:"ceshi1",time:"2019-10-7 11:11"}},
        //   {title:"报告审核",data:{name:"ceshi1",time:"2019-10-8 11:11"}},{title:"报告打印",data:{name:"",time:""}}],
        //
        // zlStep:[{title:"申请",data:{name:"ceshi1",time:"2019-10-6 11:11"}},{title:"执行",data:{name:"ceshi1",time:"2019-10-7 11:11"}}],
        activeStepList: [
          { title: "申请", data: { name: "", time: "" } },
          { title: "采集", data: { name: "", time: "" } },
          { title: "报告审核", data: { name: "", time: "" } },
          { title: "结束", data: { name: "", time: "" } }
        ],
        qsteplist: {
          docname: "", //人员
          steptime: " " //时间
        },
        caijiteplist: { docname: "", steptime: " " },
        jcteplist: { docname: "", steptime: " " },
        fbteplist: { docname: "", steptime: " " },

        //右侧当前选中行
        currentRow: ""
      },
      // 保存模板组件
      saveTem: saveTem,
      // 当前显示的组件
      curComponent: "",
      // 左侧table数据类型
      tableDataType: [
        {
          id: "1",
          title: "检验科"
        },
        {
          id: "2",
          title: "细菌室"
        },
        {
          id: "3",
          title: "床旁检验"
        }
      ],
      // 当前显示的类型
      activeType: "1",
      // 输入搜索防抖
      searchDebounced: null,
      leftLoading: false,
      // 提交申请loading标示
      submitLoad: false,
      // 保存模板loading
      saveTemLoad: false,
      // 历史申请表格loading
      rightTableLoad: false
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    checkTxt() {
      return this.checkedList
        .map(item => {
          return item.name;
        })
        .join(",");
    },
    chooseData() {
      return this.$attrs.choose;
    },
    eleTemType() {
      return this.$attrs.elecType;
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        let cType = "";
        if (this.$attrs.hosType == "1") {
          cType = val.visitCode;
        } else if (this.$attrs.hosType == "3") {
          cType = val.inpCode;
        }
        this.setPatientInfo("testApply", {
          patientId: val.patientId,
          type: this.eleTemType,
          id: cType
        });
      }
    },
    chooseData: {
      deep: true,
      handler(val) {
        if (val) {
          this.handleSelect(val);
        }
      }
    }
  },
  created() {
    this.search(2);
  },
  methods: {
    rowClick(row) {
      if (row != null) {
        //显示第一项
        this.rightdata.active = 1;
        this.rightdata.activeStepList[0].data.time = row.begaintime;
        this.rightdata.activeStepList[0].data.name = row.appDoctor;
      } else {
        this.clearStepList();
      }
    },
    clearStepList() {
      this.rightdata.active = 0;
      this.rightdata.activeStepList[0].data.time = "";
      this.rightdata.activeStepList[0].data.name = "";
    },
    //获取组套下拉接口
    listForgroups() {
      // let data =await base.listForgroups({});
      this.groups = [
        {
          id: "1",
          label: "医嘱"
        },
        {
          id: "2",
          label: "项目"
        }
      ];
    },
    //获取组套菜单接口
    async Forgroups() {
      let reslut = await getChargeTemplateList({
        itemType: "1",
        templateType: this.templateType,
        level: "1",
        outOrInpEnable: "1",
        tempType: "0",
        loadUseRange: parseInt(this.patientParam.patientSource)
      });

      let setmealData = [];

      let persmealData = [];
      if (reslut.code == 1) {
        reslut.data.deptList.forEach(function(item) {
          setmealData.push({
            id: item.templateId,
            name: item.templateName
          });
        });
        reslut.data.personalList.forEach(function(item) {
          persmealData.push({
            id: item.templateId,
            name: item.templateName
          });
        });
      }
      this.setmeal = setmealData;
      //个人套餐
      this.persmeal = persmealData;
    },
    //顶部搜索接口
    async search(type) {
      try {
        this.orderTable = [];
        let _self = this;
        _self.leftLoading = true;
        let reslut = await getAilItems({
          tempType: "2",
          templateType: this.templateType,
          loadUseRange: parseInt(_self.patientParam.patientSource),
          queryType: this.formSearch.group,
          searchData: this.formSearch.inputop
        });

        if (reslut.code == "1") {
          reslut.data.allList.forEach(function(item) {
            _self.orderTable.push({
              name: item.groupName,
              yzid: item.id,
              chargeItemId: item.chargeItemId,
              yzname: item.chargeItemName,
              id: item.groupId
            });
          });
          _self.leftLoading = false;
          this.getOrderNumber();
        }
      } catch (error) {
        // this.$hideLoading();
        this.leftLoading = false;
        // this.$message.error(error.msg || "查询失败");
      }
    },
    //菜单搜索接口
    async handleSelect(key) {
      this.chacakid = key;

      this.toggleSelection(this.checkedList);
      this.checkedList = [];
      try {
        // this.$showLoading();

        let reslut = [];
        let _self = this;
        let selectedDataIndex = [];
        _self.orderTable = [];
        if (key == 40) {
          reslut = await getAilItems({
            tempType: "2",
            templateType: this.templateType,
            loadUseRange: parseInt(_self.patientParam.patientSource)
          });

          if (reslut.code == "1") {
            reslut.data.allList.forEach(function(item) {
              _self.orderTable.push({
                name: item.groupName,
                yzid: item.id,
                chargeItemId: item.chargeItemId,
                yzname: item.chargeItemName,
                id: item.groupId
              });
            });
            this.getOrderNumber();
          }
        } else {
          //点击具体模板事件
          let index = 0;
          reslut = await getChargeTemplateList({
            id: key,
            level: "2",
            outOrInpEnable: "1",
            tempType: "0",
            templateType: this.templateType,
            loadUseRange: parseInt(_self.patientParam.patientSource)
          });

          if (reslut.code == "1") {
            reslut.data.groupList.forEach(function(item) {
              _self.orderTable.push({
                name: item.groupName,
                yzid: item.id,
                chargeItemId: item.chargeItemId,
                yzname: item.chargeItemName,
                id: item.groupId
              });
              if (item.checkStatus == 1) {
                selectedDataIndex.push(index);
              }
              index++;
            });
            this.getOrderNumber();

            this.$nextTick(() => {
              selectedDataIndex.forEach(function(item) {
                _self.$refs.orderTable.toggleRowSelection(
                  _self.orderTable[item],
                  true
                );
              });
            });
          }
        }

        // this.$hideLoading();
      } catch (error) {
        // this.$hideLoading();
        // this.$message.error(error.msg || "查询失败");
      }
    },
    // 获取相同编号的数组
    getOrderNumber() {
      let OrderObj = {};
      this.orderTable.forEach((element, index) => {
        element.rowIndex = index;
        if (OrderObj[element.id]) {
          OrderObj[element.id].push(index);
        } else {
          OrderObj[element.id] = [];
          OrderObj[element.id].push(index);
        }
      });
      this.OrderIndexArr = [];
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k]);
        }
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.orderTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.orderTable.clearSelection();
      }
    },
    //检验明细项选中
    handleSelectionChange(val) {
      this.checkedList = this.formatCheckList(val);
    },
    //检验申请单
    selectCancelApply(val) {
      this.applyList = val;
    },
    //提交申请
    async sent() {
      if (!this.patientParam.patientId) {
        this.$message.warning("请先选择患者，再开申请单!");
        return false;
      }
      if (this.checkedList.length === 0) {
        this.$message.warning("请选择要申请的医嘱!");
        return false;
      }
      let _self = this;

      let applyParamData = {};
      this.checkedList.forEach(function(item) {
        if (typeof applyParamData["m" + item.id] == "undefined") {
          applyParamData["m" + item.id] = {};
          applyParamData["m" + item.id]["packageId"] = item.id;
          applyParamData["m" + item.id]["applyType"] = 4;
          applyParamData["m" + item.id]["packageName"] = item.name;
          applyParamData["m" + item.id]["patientId"] =
            _self.patientParam.patientId;
          applyParamData["m" + item.id]["patientType"] =
            _self.patientParam.patientSource;
          if (_self.$attrs.hosType == "1") {
            applyParamData["m" + item.id]["visitId"] =
              _self.receivePatientData.appointmentId;
            applyParamData["m" + item.id]["visitCode"] = _self.patientParam.id;
          } else if (_self.$attrs.hosType == "3") {
            applyParamData["m" + item.id]["inpCode"] = _self.patientParam.id;
          }
          applyParamData["m" + item.id]["packageItemName"] = item.yzname;
          applyParamData["m" + item.id]["applyChargeItemList"] = [
            {
              chargeItemId: item.chargeItemId,
              chargeItemName: item.yzname
            }
          ];
        } else {
          applyParamData["m" + item.id]["packageItemName"] =
            applyParamData["m" + item.id]["packageItemName"] +
            "," +
            item.yzname;
          applyParamData["m" + item.id]["applyChargeItemList"].push({
            chargeItemId: item.chargeItemId,
            chargeItemName: item.yzname
          });
        }
      });
      let submitData = [];
      for (var key in applyParamData) {
        let packageItemName = applyParamData[key]["packageItemName"];
        applyParamData[key]["packageItemName"] =
          applyParamData[key]["packageName"] + "(" + packageItemName + ")";
        submitData.push(applyParamData[key]);
      }
      let newSubmitData = [];
      submitData.forEach(elem => {
        let narr = this.orderTable
          .filter(it => {
            return it.id === elem.packageId;
          })
          .map(itm => {
            return {
              chargeItemId: itm.chargeItemId,
              chargeItemName: itm.yzname
            };
          });
        newSubmitData.push({
          ...elem,
          applyChargeItemList: narr
        });
      });
      this.submitLoad = true;
      try {
        let result = await submitApply(newSubmitData);

        if (result.code == 1) {
          this.$message.success("提交申请成功");
          this.rightseach(this.patientParam);
        } else {
          this.$message.error(result.msg || "提交申请失败");
        }
        this.submitLoad = false;
      } catch (error) {
        this.$message.error(error.msg || "提交申请失败");
        this.submitLoad = false;
      }
    },
    //存为模板弹窗
    showRelList() {
      if (this.checkedList.length > 0) {
        this.modelVisible = true;
      } else {
        this.$message.warning("请选择一条或者多条数据");
      }
    },
    // 关闭模板弹窗
    huidanClose() {
      this.modelVisible = false;
    },
    //存为模板
    conserve() {
      /* templateData["templateName"] = this.modeldata.modelname;
                templateData["remark"] = this.modeldata.modelbz;
                templateData["templateType"] = this.templateType;
                templateData["groupList"] = []; */
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let paramData = {};
          let submitData = [];
          this.checkedList.forEach(function(item) {
            /* if (typeof paramData["m" + item.id] == "undefined") {
              paramData["m" + item.id] = {};
              paramData["m" + item.id]["groupId"] = item.id;
              paramData["m" + item.id]["chargePackageDlist"] = [
                {
                  Id: item.yzid,
                  itemType: 2
                }
              ];
            } else {
              paramData["m" + item.id]["chargePackageDlist"].push({
                Id: item.yzid,
                itemType: 2
              });
            }*/
            const arr = that.orderTable
              .filter(ele => {
                return ele.id === item.id;
              })
              .map(it => {
                return {
                  Id: it.yzid,
                  itemType: 2
                };
              });
            submitData.push({
              groupId: item.id,
              chargePackageDlist: arr
            });
          });

          /*for (var key in paramData) {
            let packageItemName = paramData[key]["packageItemName"];

            submitData.push(paramData[key]);
          }*/
          let templateData = {
            templateName: this.modeldata.modelname,
            remark: this.modeldata.modelbz,
            templateType: this.templateType,
            groupList: submitData,
            deptOrPerson: this.saveType
          };
          this.saveTemLoad = true;
          saveTemplate(templateData)
            .then(res => {
              if (res.code == 1) {
                this.$message.success("模板保存成功");
                this.modelVisible = false;
                this.Forgroups();
                this.$refs.ruleForm.resetFields();
                this.$store.dispatch("eleApply/changeRef");
              } else {
                this.$message.error(res.msg || "模板保存失败");
              }
              this.saveTemLoad = false;
            })
            .catch(err => {
              this.saveTemLoad = false;
              this.$message.error(err.msg || "模板保存失败");
            });
        }
      });
    },
    // 右侧表格方法
    // 搜索方法
    async rightseach() {
      this.rightdata.rightable = [];
      if (typeof this.patientParam.patientId == "undefined") {
        return;
      }
      let _self = this;
      try {
        _self.rightTableLoad = true;
        let params = {};
        if (this.rightdata.rightseach.checkedstat) {
          params["seeType"] = "1";
        } else {
          params["seeType"] = "0";
        }

        params["beginTime"] =
          this.rightdata.rightseach.timepicker &&
          this.rightdata.rightseach.timepicker[0] &&
          this.rightdata.rightseach.timepicker[0] + " 00:00:00";
        params["endTime"] =
          this.rightdata.rightseach.timepicker &&
          this.rightdata.rightseach.timepicker[1] &&
          this.rightdata.rightseach.timepicker[1] + " 23:59:59";

        delete params.state;
        if (this.rightdata.rightseach.statechack != 0) {
          params["state"] = this.rightdata.rightseach.statechack;
        }
        params["queryApplyType"] = this.templateType;
        params["patientId"] = this.patientParam.patientId;
        let result = {};
        result = await getHistoryApplyList(params);
        const newData = [];
        if (result.code == "1") {
          result.data.forEach(function(item) {
            newData.push({
              progre: "25", //进度
              begaintime: item.createTime, //申请时间
              project: item.itemName, //项目
              state: item.status, //状态
              remarks: "", //备注
              specimen: "", //标本
              coststatus: item.chargeStatus, //费用状态
              AppSection: item.deptCode, //申请科室
              appDoctor: item.createName, //申请医生
              id: item.assayApplyId //id
            });
          });
          _self.rightdata.rightable = newData;
          _self.rightTableLoad = false;
        }
      } catch (error) {
        _self.rightTableLoad = false;
        // this.$message.error(error.msg || "查询失败");
      }
    },

    //右侧表格单选
    handleCurrentChange(val) {
      this.rightdata.currentRow = val;
      try {
        let param = this.rightdata.currentRow.id;
        // let response = await opha.handleSelecttext(param);
        this.rightdata.active = 1;

        this.rightdata.qsteplist = {
          docname: "夏邑",
          steptime: " 2019-08-21 16:00:00 "
        };
        this.rightdata.caijiteplist = {
          docname: "夏邑",
          steptime: " 2019-08-21 16:00:00 "
        };
        this.rightdata.jcteplist = {
          docname: "",
          steptime: ""
        };
        this.rightdata.fbteplist = {
          docname: "",
          steptime: ""
        };
      } catch (error) {
        // this.$hideLoading();
      }
    },
    //撤销申请
    cancel() {
      let _self = this;

      if (this.applyList.length < 1) {
        this.$message.warning("请选择一条数据");
      } else {
        this.$confirm("", "", {
          showClose: "false",
          confirmButtonText: "撤销",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: "true",
          message:
            "<div>撤销申请</div><p><span>撤销申请无法重复编辑,</span>你要继续吗？</p>",
          type: "warning"
        })
          .then(async () => {
            let ids = "";
            _self.applyList.forEach(function(item) {
              ids = ids + item.id + ",";
            });
            let params = {
              type: _self.templateType,
              ids: ids.substring(0, ids.length - 1)
            };
            let result = await cancelApply(params);
            if (result.code == 1) {
              this.$message({
                type: "success",
                message: "申请撤销成功!"
              });
              _self.rightseach();
              _self.applyList = [];
              this.$refs.rigTable.clearSelection();
            } else {
              this.$message.error(result.msg || "申请撤销失败");
            }
          })
          .catch(err => {
            this.$message.error("申请撤销失败");
          });
      }
    },
    initComponent(type, params) {
      this.patientParam = {
        patientId: params.patientId, // 患者id
        patientSource: params.type, //患者来源 0门诊 1住院
        id: params.id, //门诊号or住院号
        type: type //申请检验检查类型
      };

      this.Forgroups();
    },
    async setPatientInfo(type, params) {
      this.patientParam = {
        patientId: params.patientId, // 患者id
        patientSource: params.type, //患者来源 0门诊 1住院
        id: params.id, //门诊号or住院号
        type: type //申请检验检查类型
      };
      this.$refs.orderTable && this.$refs.orderTable.clearSelection();
      await this.rightseach();
      this.rowClick(this.rightdata.rightable[0]);
    },
    // 关闭保存模板
    closeSaveTem() {
      this.modelVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    // 切换左侧表格数据源类型
    changTableType(id) {
      this.activeType = id;
      this.checkedList.splice(0);
    },
    // 项目名称或简拼输入搜索
    enterSearch(val) {
      this.searchDebounced && clearTimeout(this.searchDebounced);
      this.searchDebounced = setTimeout(() => {
        this.search(2);
      }, 600);
    }
  },
  mounted() {
    // this.getOrderNumber();//合并单元格
    // this.Forgroups();
    this.listForgroups();
  }
};
</script>
<style lang="scss" scoped>
.applycontent {
  overflow: hidden;

  .apply-content-tabs {
    height: 100%;

    /deep/ .el-tabs__header {
      padding: 0 5px;
    }

    /deep/ .el-tabs__nav-scroll {
      background-color: transparent;
    }

    /deep/ .el-tabs__content {
      height: calc(100% - 55px);
    }
  }

  .arearowall {
    height: 100%;

    .el-menu-vertical-demo {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .el-menu-item-group {
        .el-menu-item {
          width: 100%;
          white-space: normal;
          word-break: break-all;
          word-wrap: break-word;
        }

        li {
          width: 100%;
          height: auto;
          line-height: 30px;
        }
      }
    }

    .arearowleft {
      height: 100%;
      padding-top: 10px;
      padding-bottom: 20px;
      border-right: 1px solid $l-color-bgcolor-11;
      overflow: hidden;
      overflow-y: auto;

      .topseach {
        padding: 0 10px;
        padding-bottom: 10px;

        .el-button--text {
          color: $l-color-fontcolor-3;
        }
      }

      .table-type {
        padding: 0 10px;
        height: 30px;
        font-size: 0;

        span {
          display: inline-block;
          line-height: 30px;
          padding: 0 20px;
          background-color: $l-color-bgcolor-18;
          color: $l-color-fontcolor-4;
          font-size: $l-font-size;
          cursor: pointer;

          &.is-active {
            background-color: $l-color-primary;
            color: $l-color-white;
          }
        }
      }

      .navall {
        width: 100%;
        height: calc(100% - 82px);
        padding: 0 10px;
        overflow: hidden;

        &.shrink {
          height: calc(100% - 290px);
        }

        .navmenu {
          height: 100%;
          border-right: 0;

          .el-menu {
            border-right: 0;
          }

          .el-menu--inline {
            border-bottom: 1px solid $l-color-white;
            background-color: $l-color-bgcolor-18;
          }

          .el-submenu {
            border-bottom: 1px solid $l-color-white;
            background-color: $l-color-bgcolor-18;

            .el-menu-item.is-active {
              background-color: $l-color-bgcolor-12;
              color: $l-color-fontcolor-3;
            }
          }

          .el-menu-item {
            background-color: $l-color-bgcolor-18;
          }

          .el-submenu__icon-arrow {
            display: none;
          }

          .filter-item {
            font-size: 12px;
            display: inline-block;
            -webkit-transition: -webkit-transform 0.3s;
            transition: -webkit-transform 0.3s;
            transition: transform 0.3s;
            transition: transform 0.3s, -webkit-transform 0.3s;
          }

          .el-submenu.is-opened > .el-submenu__title .filter-item {
            transform: rotateZ(90deg);
            -ms-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
          }
        }

        .el-table-column--selection .cell {
          padding-left: 10px;
        }
      }

      .handle-btn-box {
        padding: 0 10px;
        .el-button + .el-button {
          margin-left: 20px;
        }
        .filter-item {
          color: $l-color-fontcolor-3;
        }
      }
    }
  }

  .righttable {
    height: 100%;

    .rightrow {
      height: 100%;
      padding: 0 10px;

      .rigmidtable {
        height: calc(100% - 45px - 63px - 190px);

        .el-table {
          height: 100%;
        }

        // height: 300px;
        margin-bottom: 20px;
      }

      .bottomtext {
        width: 100%;
        height: 150px;
        background: $l-color-bgcolor-14;

        /deep/ .el-step__icon.is-icon {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background: $l-color-bgcolor-14;

          .is-status {
            background: $l-color-primary1;
            color: $l-color-white;
            padding: 2px;
            border-radius: 12px;
          }
        }

        .el-step__head.is-process {
          color: $l-color-primary1;
        }

        .el-step.is-horizontal .is-success .el-step__line {
          background: $l-color-primary1;
        }

        .el-step__title.is-success {
          font-weight: bold;
          color: $l-color-fontcolor-3;
        }
      }
    }
  }
}

.save-template-box {
  position: relative;
  padding-right: 10px;

  /deep/ .el-form-item {
    margin-bottom: 18px;

    .el-form-item__content {
      height: 36px;
    }
  }

  .allergy-form-btn {
    width: 100%;
    text-align: right;
  }
}

.consultation-step {
  .el-steps {
    padding-left: 20px;
    padding-right: 20px;
  }

  /deep/ .el-step__head.is-success {
    border-color: $l-color-primary;

    .el-step__line {
      background-color: $l-color-primary;
    }

    .el-step__icon-inner.is-status {
      background-color: $l-color-primary;
      border-radius: 12px;
      padding: 2px;
      color: $l-color-white;
    }
  }

  /deep/ .el-step__title {
    color: $l-color-fontcolor-3;
    font-size: $l-font-size;
  }

  /deep/ .el-step__description {
    color: $l-color-fontcolor-4;
    font-size: $l-font-size;
  }

  /deep/ .el-step__head.is-process {
    color: $l-color-primary;
  }
}

.right-search-left {
  margin-right: 200px;

  .el-date-editor {
    margin-right: 7px;
  }

  .el-select {
    margin-right: 7px;
  }
}

.right-search-right {
  .el-checkbox {
    margin-right: 7px;
  }
}
.state-color {
  color: $l-color-primary;
}
/deep/ .el-date-editor .el-range__close-icon {
  position: static;
}
.his-apply {
  width: 60px;
  height: 4px;
  background-color: $l-color-bgcolor-17;
  margin: 7px 0;
  .his-apply-bar {
    position: relative;
    width: 0;
    height: 100%;
    background-color: $l-color-bgcolor-9;
    .his-apply-circle {
      position: absolute;
      right: -5px;
      top: -3px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: $l-color-bgcolor-9;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    }
  }
}
.save-template-sel {
  float: none !important;
  margin-left: 20px;
  width: 100px;
  height: 36px;
}
</style>
