<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      pageName="advEditing"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card class="right1 overflow-hidden">
          <div
            class="position-relative overflow-hidden height-main"
            v-loading="isLoading"
          >
            <div>
              <div ref="SearchForm" class="search-box">
                <el-radio-group
                  class="radio-group"
                  @change="timeTypeChange"
                  v-model="searchForm.timeType"
                >
                  <el-radio :label="1">长期</el-radio>
                  <el-radio :label="2">临时</el-radio>
                  <el-radio :label="3">出院带药</el-radio>
                </el-radio-group>
                <el-date-picker
                  class="datePicker"
                  v-model="searchForm.dateRange"
                  style="float: left; width: 230px;"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  prefix-icon="iconfont iconriqi"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
                <el-select
                  class="select-item"
                  v-model="searchForm.value1"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!-- <el-select class="select-item" v-model="searchForm.value2" placeholder="请选择">
                  <el-option
                    v-for="item in adviceType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select class="select-item" v-model="searchForm.value3" placeholder="请选择">
                  <el-option
                    v-for="item in type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>-->
                <el-input
                  class="select-item"
                  style="width: 193px;"
                  placeholder="医嘱名称/关键词"
                  suffix-icon="el-icon-search"
                  v-model="searchForm.keyWord"
                ></el-input>
                <el-button
                  style="margin-left: 10px;float: left;margin-top: 12px;"
                  @click="searchAdv"
                  type="primary"
                  >查询</el-button
                >
              </div>
              <div ref="btnGroup" class="edit-btn-box">
                <span
                  class="cursor-pointer"
                  v-hotKey="{ func: 'func_add1' }"
                  @click="add"
                >
                  <i class="iconfont iconxinzeng"></i>新增
                </span>
                <span
                  class="cursor-pointer"
                  v-hotKey="{ func: 'func_add2', flag: 'isLoading' }"
                  @click="temporarySave"
                >
                  <i class="iconfont iconzancun"></i>暂存
                </span>
                <span
                  class="cursor-pointer"
                  v-hotKey="{ func: 'func_submit', flag: 'isLoading' }"
                  @click="submitSave"
                >
                  <i class="iconfont icontijiao1"></i>提交
                </span>
                <b class="line"></b>
                <!-- <span class="cursor-pointer" @click="backSpace">
                  <i class="iconfont iconchexiao" style="font-size: 8px"></i>撤销
                  <b class="el-icon-arrow-down"></b>
                </span>-->
                <span
                  class="cursor-pointer"
                  v-hotKey="{ func: 'func_delete', flag: 'isLoading' }"
                  @click="del"
                >
                  <i class="iconfont iconshanchu"></i>删除
                </span>
                <b class="line"></b>
                <span
                  class="cursor-pointer"
                  v-hotKey="{ func: 'func_print' }"
                  @click="print()"
                >
                  <i class="iconfont icondayin"></i>打印
                </span>
              </div>
              <div
                class="position-absolute"
                :style="{
                  top: tableTop + 'px',
                  bottom: 260 + Number(bottom) + 'px',
                  width: '100%',
                  transition: 'all 0.5s'
                }"
              >
                <el-table
                  :data="tableList"
                  ref="multipleTable"
                  stripe
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  @selection-change="handleSelectionChange"
                  @select="selectRow"
                  @row-click="selectItem"
                  border
                  v-loading="mainTableLoading"
                  v-hotKey="{
                    func: ['table_row', 'table_checkbox'],
                    deClass: 'el-table__row',
                    curClass: 'current-row'
                  }"
                  height="100%"
                  style="width: 100%"
                >
                  <el-table-column
                    type="selection"
                    width="45"
                  ></el-table-column>
                  <el-table-column
                    label="状态"
                    show-overflow-tooltip
                    min-width="80"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.isNew">新增</span>
                      <span v-else>{{ statusArr[scope.row.status_a] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="日期"
                    prop="beginTime"
                    show-overflow-tooltip
                    min-width="150"
                  ></el-table-column>
                  <el-table-column
                    label="名称"
                    show-overflow-tooltip
                    min-width="220"
                  >
                    <template slot-scope="scope">
                      <l-input-table
                        v-if="scope.row.isNew"
                        id="bottomFormInputTable"
                        :popoverWidth="800"
                        valueKey="itemName"
                        suffix-icon="el-icon-search"
                        style="width:100%;text-align: center;"
                        :tableData="selectDrop.selectOptions"
                        :tableLoading="searchResLoading"
                        @query="searchLike"
                        @select="select"
                        :tableParams="selectDrop.dropColumn"
                        placeholder="请输入项目名称关键字"
                      ></l-input-table>
                      <div v-else>{{ scope.row.name }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="组" min-width="40">
                    <template slot-scope="scope">
                      <span :class="scope.row.groupNoCls"></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="规格"
                    prop="spec"
                    show-overflow-tooltip
                    min-width="120"
                  ></el-table-column>
                  <el-table-column
                    label="用量"
                    show-overflow-tooltip
                    min-width="180"
                  >
                    <template slot-scope="scope">
                      <div v-if="scope.row.isEditingNum">
                        <el-input-number
                          style="width: 100%;"
                          v-model="scope.row.oneDosage"
                          controls-position="right"
                        ></el-input-number>
                      </div>
                      <div v-else>{{ scope.row.oneDosage }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="用法"
                    prop="uses"
                    show-overflow-tooltip
                    min-width="150"
                  >
                    <template slot-scope="scope">
                    <div v-if="scope.row.isEditingNum">
                    <l-value-domain
                    code="MedicationRouteCode"
                    remoteShowKey="name"
                    remoteValueKey="code"
                    :value.sync="scope.row.uses"
                    placeholder=""
                    ></l-value-domain>
                    </div>
                    <div v-else>
                      <span
                        :val="scope.row.uses"
                        code="MedicationRouteCode"
                        v-codeTransform
                      ></span>
                    </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="频次"
                    show-overflow-tooltip
                    min-width="150"
                  >
                    <template slot-scope="scope">
                    <div v-if="scope.row.isEditingNum">
                    <l-value-domain
                    code="dd"
                    remoteUrl="/frequency/pageList"
                    :value.sync="scope.row.frequency"
                    placeholder=""
                    @change="handleFreq"
                    remoteShowKey="frequencyName"
                    remoteValueKey="frequencyCode"
                    clearable
                    ></l-value-domain>
                    </div>
                    <div v-else>
                    <span
                    columns="FREQUENCY_NAME"
                    :conditionMap="{ FREQUENCY_CODE: scope.row.frequency }"
                    tableName="hrp_frequency"
                    v-tableTransform
                    ></span>
                    </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="常规时间"
                    prop="normalDate"
                    show-overflow-tooltip
                    min-width="150"
                  >
                    <!--<template slot-scope="scope">-->
                    <!--<div v-if="scope.row.isEditingNum">-->
                    <!--<el-date-picker-->
                    <!--v-model="scope.row.normalDate"-->
                    <!--type="date"-->
                    <!--placeholder=""-->
                    <!--style="width:100%;"-->
                    <!--&gt;-->
                    <!--</el-date-picker>-->
                    <!--</div>-->
                    <!--<div v-else>{{scope.row.normalDate}}</div>-->
                    <!--</template>-->
                  </el-table-column>
                  <el-table-column
                    label="开嘱人"
                    prop="doctorName"
                    show-overflow-tooltip
                    min-width="80"
                  ></el-table-column>
                  <el-table-column
                    label="开嘱科室"
                    prop="adv_depart"
                    show-overflow-tooltip
                    min-width="80"
                  >
                    <template slot-scope="scope">
                      <span
                        tableName="sys_org"
                        :conditionMap="{
                          org_type: '_DEPT_',
                          id: scope.row.deptCode
                        }"
                        columns="org_nm"
                        v-tableTransform
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="停嘱时间"
                    prop="stopDoctorTime"
                    show-overflow-tooltip
                    min-width="150"
                  >
                    <template slot-scope="scope">
                    <div v-if="scope.row.isEditingNum">
                    <el-date-picker
                    v-model="scope.row.stopDoctorTime"
                    type="date"
                    placeholder=""
                    style="width:100%;"
                    >
                    </el-date-picker>
                    </div>
                    <div v-else>{{scope.row.stopDoctorTime}}</div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    label="停嘱医生"
                    prop="stopDoctorName"
                    show-overflow-tooltip
                    min-width="100"
                  ></el-table-column>
                  <el-table-column
                    label="停嘱护士"
                    prop="end_nurse"
                    show-overflow-tooltip
                    min-width="100"
                  ></el-table-column>-->
                  <el-table-column
                    label="执行科室"
                    show-overflow-tooltip
                    min-width="100"
                  >
                    <template slot-scope="scope">
                      <span
                        tableName="sys_org"
                        :conditionMap="{
                          org_type: '_DEPT_',
                          id: scope.row.deptCode
                        }"
                        columns="org_nm"
                        v-tableTransform
                      ></span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <el-card class="height-bottom" :style="{ bottom: bottom + 'px' }">
            <!-- <bottom-form @cancel="bottom = -260"></bottom-form> -->
            <div class="overflow-hidden padding20 advDetailBox">
              <el-table
                :data="advDetailList"
                @select="handlerSelectDetail"
                @select-all="handlerSelectDetailAll"
                v-loading="AdvListItemLoading"
                height="100%"
                border
                style="width: 100%"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                  prop="itemName"
                  label="项目名称"
                  width="380"
                ></el-table-column>
                <el-table-column
                  prop="price"
                  label="单价"
                  width="180"
                ></el-table-column>
                <el-table-column prop="spec" label="规格"></el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">
                    <div v-if="!globalStatus">
                      <el-input-number
                        style="width: 100%;"
                        v-model="scope.row.basicDosage"
                        controls-position="right"
                      ></el-input-number>
                    </div>
                    <div v-else>{{ scope.row.basicDosage }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="padding20" style="padding-top: 0;">
              <el-button
                type="primary"
                @click="saveAdv"
                v-hotKey="{ func: 'func_add2', flag: 'isLoading' }"
                v-show="!globalStatus"
                class="button"
                >保存</el-button
              >
              <el-button @click="cancelAdv" class="button">取消</el-button>
            </div>
          </el-card>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Base64 from "@/utils/base64";
import BottomForm from "../../components/bottomForm";
import { onPreview, onPrint } from "@/utils/print";
import LeftBar from "../../components/nursingLeftBar";
import {
  fetchAdviceList,
  addAdvice,
  querySelectAdvName,
  fetchAdvDetailItem,
  fetchAdvDetail,
  upDataAdvice
} from "@/api/ipnw/nursing";
export default {
  name: "advEditing",
  components: {
    LeftBar,
    BottomForm
  },
  computed: {
    isEditing() {
      // 判断当前是否有正在新增的医嘱
      let status = false;
      this.tableList.map(item => {
        if (item.isNew) {
          status = true;
        }
      });
      return status;
    },
    ...mapGetters(["receivePatientData", "role", "name"])
  },
  data() {
    return {
      isLoading: false, //
      globalStatus: false, // true : 查看详情状态  false：新增状态
      mainTableLoading: false, // 医嘱列表 loading
      searchResLoading: false, // 模糊查询列表 loading
      AdvListItemLoading: false, // 医嘱附加项列表 loading
      formParams: [
        "technicalOffices",
        "illnessArea",
        "patientsType",
        "patientsState",
        "search"
      ], // 左侧搜索条件
      toolBoxs: ["implementDetail", "Hotkey"],
      autoComIpt: "", // 模糊查询Value
      bottomFormHeight: "", // 底部form的高度
      tableTop: "120", // table定位距离上面距离
      bottom: "-260", // 底部详情列表位置
      bottomHidden: false, // 底部详情列表显示隐藏
      // 患者列表查询条件
      patientsSearchForm: {},
      //  医嘱查询条件
      searchForm: {
        timeType: 1,
        dateRange: "",
        keyWord: "", // 医嘱查询关键词
        value1: "", //
        value2: "", //
        value3: "" //
      },
      printList: [],
      statusArr: {
        0: "暂存",
        1: "提交",
        2: "删除",
        3: "审核",
        4: "停止",
        5: "作废",
        9: "打回",
        10: "审核停止",
        11: "审核停止通过",
        12: "审核停止打回",
        13: "已审核",
        14: "已审核"
      },
      status: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "暂存"
        },
        {
          value: "1",
          label: "提交"
        },
        {
          value: "3",
          label: "审核"
        },
        {
          value: "4",
          label: "停止"
        },
        {
          value: "5",
          label: "作废"
        },
        {
          value: "9",
          label: "打回"
        },
        {
          value: "10",
          label: "审核停止"
        },
        {
          value: "11",
          label: "审核停止通过"
        },
        {
          value: "12",
          label: "审核停止打回"
        },
        {
          value: "13",
          label: "未执行"
        },
        {
          value: "14",
          label: "执行中"
        }
      ],
      adviceType: [
        {
          value: "0",
          label: "本科医嘱"
        },
        {
          value: "1",
          label: "其他科室医嘱"
        }
      ],
      type: [
        {
          value: "0",
          label: "全部类型"
        },
        {
          value: "1",
          label: "医嘱单"
        },
        {
          value: "2",
          label: "护理记录"
        },
        {
          value: "3",
          label: "耗材单"
        }
      ],
      //  医嘱列表
      tableList: [],
      tableData: [], // 检索结果
      advDetailList: [], // 医嘱内容详细列表
      selectAdvDetailList: [], // 已选医嘱内容详细列表
      // 医嘱列表已选中
      selectedList: [],
      selectDrop: {
        // 输入药品名称显示的下拉table
        dropColumn: [
          {
            prop: "type",
            label: "类别",
            width: 80
          },
          {
            prop: "reimbursement",
            label: "报销",
            width: 80
          },
          {
            prop: "itemName",
            label: "名称",
            width: 180
          },
          {
            prop: "spec",
            label: "规格",
            width: 80
          },
          {
            prop: "price",
            label: "单价",
            width: 80
          },
          {
            prop: "factoryAddress",
            label: "产地",
            width: 80
          },
          {
            prop: "pharmacy",
            label: "药房名称",
            width: 80
          }
        ],
        selectOptions: []
      }
    };
  },
  created() {
    // this.fetchPatientsList()
    this.fetchTableList();
  },
  updated() {
    this.tableTop =
      this.$refs.SearchForm.clientHeight + this.$refs.btnGroup.clientHeight;
  },
  methods: {
    ...mapActions({
      changePrescription: "ipnw/changePrescription"
    }),
    handleClick() {
      // tab 的切换方法
    },
    /**
     * 点击单项医嘱查看详情
     */
    selectItem(row, column, event) {
      if (row.isNew) {
        return;
      }
      this.globalStatus = true;
      fetchAdvDetail({
        adviceId: row.adviceId
      })
        .then(res => {
          let { code, data, msg } = res;
          if (code == 1) {
            this.bottom = 0;
            this.advDetailList = data;
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          this.$message.error("网络错误!");
        });
    },
    /*
     * 新增医嘱时,医嘱名称模糊查询
     */

    searchLike(keyWord) {
      this.searchResLoading = true;
      querySelectAdvName({
        keyWord: keyWord
      })
        .then(res => {
          let { code, data, msg } = res;
          if (code == 1) {
            data.map(item => {
              // if(item.type == 'ITEM'){
              //   item.type = '诊疗'
              // }else if(item.type == 'DRUG'){
              //   item.type = '药品'
              // }else{
              //   item.type = '套餐'
              // }
            });
            this.selectDrop.selectOptions = data;
            //选中项目后，联动规格
            let itemName='';
            let itemSpec='';
            let index=0;
            for(let i=0;i<this.tableList.length;i++){
              if(this.tableList[i].isEditingNum){
                itemName = this.tableList[i].name;
                index = i;
              }
            }
            data.forEach(itemData=>{
              if(itemData.name == itemName){
                itemSpec=itemData.spec;
              }
            });
            this.tableList[index].spec= itemSpec;
          } else {
            this.$message.error(msg);
          }
          this.searchResLoading = false;
        })
        .catch(e => {
          this.$message.error(msg);
          this.searchResLoading = false;
        });
    },
    // 医嘱类型 改变
    timeTypeChange(val) {
      this.tableList = [];
      this.fetchTableList(this.receivePatientData);
    },
    // 选中频次处理方法
    handleFreq(value, item) {
      console.info("====frequency", value, item);
      console.log("dsdsds:",item);
//      this.selectDrop.ruleForm.normalDate = item.cycleTimePoint;
    this.tableList.forEach(it=>{
      if(it.isEditingNum ){
          it.normalDate =item.cycleTimePoint;
      }
    })
    },
    /**
     * 选择医嘱项目
     **/

    select(v) {
      if (v.itemType == "GROUP") {
        this.bottom = 0;
        this.AdvListItemLoading = true;
        fetchAdvDetailItem({
          groupId: v.itemId
        })
          .then(res => {
            let { code, data, msg } = res;
            if (code == 1) {
              data.map(item => {
                item.basicDosage = 1;
              });
              this.advDetailList = data;
              console.log("this.advDetailList:",this.advDetailList);
            }
            this.AdvListItemLoading = false;
          })
          .catch(e => {
            this.AdvListItemLoading = false;
          });
      };
      //adviceType:医嘱类型,默认17
      let adviceType = '17';
      if (v.itemType == "DRUG") {
          if(v.orderType == '1'){
            adviceType = '1'
          }else if(v.orderType == '2'){
            adviceType = '2'
          }else if(v.orderType == '3'){
            adviceType = '3'
          }

      };

      this.tableList.map((item, index) => {
        if (item.isNew) {
          item = {
            ...item,
            ...v,
            name: v.itemName,
            price: v.price,
            adviceType: adviceType
          };
          this.tableList.splice(index, 1, item);
          this.$refs.multipleTable.toggleRowSelection(item, true);
        }
      });
    },
    /**
     * 双击修改医嘱数量 (暂时弃用)
     */
    handlerDbChangeNum(row, column, cell, event) {
      if (row.isNew) {
        // row.isEditingNum = true
      }
    },
    search(form) {
      // 查询方法
      // this.patientsSearchForm = form
      this.$refs.patients.search(form);
    },
    readCard() {
      // 读卡方法
    },
    bottomFormSave(data) {
      // 保存新医嘱
    },
    /**
     * 保存新增医嘱接口
     */
    saveAdv() {
      let curItem = this.selectedList.filter(item => item.isNew);
      if (curItem.length == 0 || this.selectedList.length > 1) {
        this.$message.warning("只能暂存新增医嘱！");
        return;
      } else if (!curItem[0].itemName) {
        this.$message.warning("新增医嘱名称不能为空！");
        return;
      }
      this.isLoading = true;
      let params = {
        advicePO: {
          ...curItem[0],
          patientId: this.receivePatientData.patientId,
          inpCode: this.receivePatientData.inpCode,
          bedNo: this.receivePatientData.bedCode,
          status: 0,
          inputSystem: 1,
          categoryCode: this.searchForm.timeType,
          doctorId: this.role.userId,
          doctorName: Base64.decode(this.name),
          deptCode: this.role.deptId,
          onceDosage: curItem[0].oneDosage,
          basicDosageUnit: curItem[0].unit,
          originId : 1
        },
        adviceExtraItemPO: this.selectAdvDetailList.map(i => {
          i.itemCode = i.itemId;
          i.basicDosageUnit = i.unit;
          i.unitPrice = i.price;
          return i;
        })
      };
      addAdvice(params)
        .then(res => {
          let { code, data, msg } = res;
          if (code == 1) {
            this.$message.success(msg);
            this.isLoading = false;
            this.fetchTableList(this.receivePatientData);
            this.bottom = -260;
          } else {
            this.isLoading = false;
            this.$message.error(msg);
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error("网络错误！");
        });
    },
    handlerSelectDetail(selection, row) {
      this.selectAdvDetailList = selection;
    },
    handlerSelectDetailAll(selection) {
      this.selectAdvDetailList = selection;
    },
    /**
     * 取消选择医嘱项目详情
     */
    cancelAdv() {
      this.bottom = -260;
    },
    messageHandler() {
      consle.log("工具箱消息");
    },
    // 查询医嘱按钮
    searchAdv() {
      this.fetchTableList(this.receivePatientData);
    },
    // 医嘱编辑操作按钮
    add() {
      // 新增
      // this.bottom = 0;
      if (this.isEditing) {
        return;
      }
      if (!this.receivePatientData.hasOwnProperty("patientId")) {
        this.$message.warning("请选择患者!");
        return;
      }
      this.globalStatus = false;
      let currentTime = new Date();
      let obj = {
        id: 4,
        _primary_id: 3,
        isNew: true,
        state: 1, // 0 已审核 1 已提交 2 暂存
        beginTime:
          new Date().toISOString().split("T")[0] +
          ` ${currentTime.getHours()}:${
            currentTime.getMinutes() < 10
              ? "0" + currentTime.getMinutes()
              : currentTime.getMinutes()
          }`, // 开始日期
        name: "", // 名称
        spec: "", // 规格
        oneDosage: 1, // 用量
        uses: "", // 用法
        frequency: "", // 频次
        normal_time: "", // 常规时间
        adv_people: "", // 开嘱人
        adv_depart: "", // 开嘱科室
        end_date: "", // 停止日期
        end_time: "", // 结束时间
        end_doctor: "", // 结束医生
        end_nurse: "", // 结束护士
        execute_depart: "", // 执行科室
        group_num: "", // 分组号
        isEditingNum: true
      };
      this.tableList.push(obj);
      this.$refs.multipleTable.toggleRowSelection(obj, true);
    },
    temporarySave() {
      // 暂存
      this.saveAdv();
    },
    submitSave() {
      // 提交
      this.isLoading = true;
      if (
        this.selectedList.filter(item => item.status_a == 0).length !=
        this.selectedList.length
      ) {
        this.$message.warning("只能提交暂存医嘱！");
        this.isLoading = false;
        return;
      }
      this.selectedList.forEach(item => {
        item.bedNo = item.bedCode;
        item.adviceTime = item.beginTime;
        // eslint-disable-next-line no-unused-expressions
        item.uses = item.way
        item.status = 1;
      });
      upDataAdvice(this.selectedList)
        .then(res => {
          let { code, data, msg } = res;
          if (code == 1) {
            this.$message.success(msg);
            this.isLoading = false;
            this.fetchTableList(this.receivePatientData);
          } else {
            this.isLoading = false;
            this.$message.error(msg);
          }
        })
        .catch(err => {
          this.$message.error("网络错误！");
          this.isLoading = false;
        });
    },
    backSpace() {
      // 撤销
    },
    del() {
      // 删除
      if (this.selectedList.length == 0) {
        this.$message.warning("请选择医嘱！");
        return;
      }
      if (
//        this.selectedList.filter(item => item.status_a == 0  || item.isNew)
        this.selectedList.filter(item =>  item.isNew)
//          .length != this.selectedList.length
          .length >0
      ) {
        this.$message.warning("新增时不能删除！");
        return;
      }

      for(let i=0;i<this.selectedList.length;i++){
          if(this.selectedList[i].status!=0 && this.selectedList[i].status!=1){
            this.$message.warning("此状态下不能删除！");
            return;
          }
      }
      this.isLoading = true;
      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message: "<div>删除</div><p><span>确认删除吗？</p>",
        type: "warning"
      })
        .then(() => {
          let list = this.selectedList;
          list.map(item => {
            item.bedNo = item.bedCode;
            item.adviceTime = item.beginTime;
            item.uses = item.way; 
            item.status = 2;
          });
          upDataAdvice(this.selectedList)
            .then(res => {
              let { code, data, msg } = res;
              if (code == 1) {
                this.$message.success(msg);
                this.isLoading = false;
                this.fetchTableList(this.receivePatientData);
              } else {
                this.$message.error(msg);
                this.isLoading = false;
              }
            })
            .catch(err => {
              this.isLoading = false;
              this.$message.error("网络错误！");
            });
        })
        .catch(() => {
          // 取消操作
          this.isLoading = false;
        });
    },
    print() {
      // 打印
      let printData = {};
      this.$set(printData, "a", this.printList);
      this.$set(printData, "patientName", this.receivePatientData.patientName);
      this.$set(printData, "bedCode", this.receivePatientData.bedCode);
      this.$set(printData, "inpCode", this.receivePatientData.inpCode);
      onPreview(printData, "住院医嘱");
    },
    selectRow(list, row) {
      // 选择表格 成组全选
      // list.forEach(row => {
      this.tableList.map(item => {
        if (
          row.group_num === item.group_num &&
          item._primary_id !== row._primary_id
        ) {
          setTimeout(() => {
            this.$refs.multipleTable.toggleRowSelection(item);
          }, 10);
        }
      });
      // });
      this.selectedList = list;
    },
    handleSelectionChange(val) {
      // 表格发生变化是
      this.selectedList = val;
      this.printList = val;
    },
    async fetchTableList(patientInfo = {}) {
      if (!patientInfo.hasOwnProperty("patientId")) {
        return;
      }
      let params = {
        status: this.searchForm.value1,
        // inpCode: patientInfo.inpCode, // 住院号
        categoryCode: this.searchForm.timeType, // 医嘱状态
        beginTime: this.searchForm.dateRange
          ? this.searchForm.dateRange[0]
          : "", // 开始时间
        stopDoctorTime: this.searchForm.dateRange
          ? this.searchForm.dateRange[1]
          : "", // 结束时间
        name: this.searchForm.keyWord, // 医嘱名称
        patientId: patientInfo.patientId // 患者ID
      };
      // 请求医嘱方法
      this.mainTableLoading = true;
      fetchAdviceList(params)
        .then(async res => {
          let { code, data, msg } = res;
          if (code == 1) {
            data.forEach(item=>{
              this.$set(item,'uses',item.way);
            });
            let table = await this.grouping(data);
            this.tableList = table;
          } else {
            thsi.$message.success(msg);
          }
          this.mainTableLoading = false;
        })
        .catch(e => {
          this.$message.error("网络错误!");
          this.mainTableLoading = false;
        });
    },
    grouping(list1) {
      // 将list 分组
      return new Promise((resolve, reject) => {
        let list = [];
        let groupList = [];
        let filterList = [];
        let tableList = [];
        groupList = list1.map(item => {
          // 获取所有组
          return item.group_num;
        });

        groupList = Array.from(new Set(groupList));
        groupList = groupList.filter((item, index) => {
          // 数组去undefind
          return item !== undefined;
        });

        groupList.forEach((item, index) => {
          //遍历 成map结构 分组
          // list = [];
          filterList = list1.filter((sonItem, sonIde) => {
            return item === sonItem.group_num;
          });
          list.push({
            key: item,
            value: filterList
          });
        });
        list.forEach(item => {
          // 将有组item添加class
          let itemList = item.value;
          itemList.forEach((sonItem, sonIndex) => {
            if (sonIndex === 0) {
              sonItem.groupNoCls = "bunchingUp";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = "bunchingDown";
            } else {
              sonItem.groupNoCls = "bunchingCenter";
            }
          });
        });
        list.map(item => {
          // 更改list格式
          item.value.map(val => {
            tableList.push(val);
          });
        });
        list1.map(item => {
          // 补充未成组项
          item.status_a = item.status;
          if (!item.group_num) {
            tableList.push(item);
          }
        });
        resolve(tableList);
      });
    },
    searchDrugName() {
      // 新增状态下 输入药品名称检索请求
    },
    handleCurrentChange(row) {
      // 医嘱单项选中后更改医嘱详情
      // 请求单项详情
      // this.changePrescription(row.adviceId);
    },
    hiddenBottom() {
      // 底边栏显示隐藏
      this.bottomHidden = !this.bottomHidden;
      this.bottom = this.bottomHidden ? -90 : 0;
    }
  },
  watch: {
    receivePatientData: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.fetchTableList(val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .search-box {
  .el-radio {
    margin-right: 10px;
  }
  .el-radio__label {
    padding-left: 6px;
  }
}
.right1 {
  height: 100%;
  width: 100%;
  float: left;
  .search-box {
    overflow: hidden;
    line-height: 60px;
    padding-left: 20px;
    .radio-group {
      float: left;
      margin-top: 20px;
    }
    .datePicker {
      margin: 12px 0 0 10px;
    }
    .select-item {
      float: left;
      width: 120px;
      margin-left: 10px;
    }
  }
  .edit-btn-box {
    line-height: 60px;
    padding-left: 20px;
    span {
      margin-right: 23px;
      i {
        font-size: 14px;
        margin-right: 10px;
      }
    }
    .line {
      display: inline-block;
      border-right: 2px solid $l-color-bgcolor-11;
      margin-left: 7px;
      margin-right: 23px;
      height: 18px;
      position: relative;
      top: 5px;
    }
  }
  .disabled {
    color: $l-color-fontcolor-4;
  }
  .detail-table {
    left: 0;
    width: 100%;
    transition: all 0.5s;
    .title {
      background-color: $l-color-bgcolor-18;
      padding-left: 10px;
      line-height: 30px;
      color: $l-color-fontcolor-3;
      font-size: 14px;
      span {
        width: 80px;
        height: 20px;
        text-align: center;
        left: 50%;
        top: 1px;
        transform: translateX(-50%);
        background-color: $l-color-white;
        cursor: pointer;
        border: 1px solid $l-color-bgcolor-11;
        border-radius: 0px 2px 2px 0px;
        i {
          position: relative;
          top: -5px;
          transition: all 0.5s;
        }
        i.active {
          transform: rotate(-180deg);
        }
      }
    }
  }
}
.advDetailBox {
  height: calc(100% - 56px);
}
.height-main {
  height: 100%;
}
.height-bottom {
  background: $l-color-white;
  position: absolute;
  left: 0px;
  width: 100%;
  transition: all 0.5s;
}
.bunchingUp {
  display: inline-block;
  color: $l-color-primary1;

  &::after {
    content: "┓";
  }
}

.bunchingCenter {
  display: inline-block;
  color: $l-color-primary1;

  &::after {
    content: "┫";
  }
}

.bunchingDown {
  color: $l-color-primary1;
  display: inline-block;

  &::after {
    content: "┛";
  }
}
</style>
