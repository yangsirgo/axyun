<template>
  <div
    class="box_container clearfix"
    :class="curComponent ? 'shr' : ''"
    ref="page"
    style="height:100%"
    v-loading="cardLoading"
  >
    <div
      :class="show ? 'box_codntent' : 'box_content1'"
      style="height:100%"
    >
      <div
        class="msg_bottom"
        style="height:100%"
      >
        <div class="zdlb_box">
          <div class="operation_button">
            <!-- <el-button type="text" @click="curComponent=diaAdd">
              <i class="iconfont iconxinzeng"></i>添加诊断
            </el-button>
            <el-button type="text" @click="curComponent=diaEdit">
              <i class="iconfont iconbianjimoshi"></i>编辑诊断
            </el-button>
            <el-button type="text" @click="copyTable">
              <i class="iconfont iconfuzhidaochangqi"></i>复制
            </el-button>
            <el-button type="text" @click="saveAs">
              <i class="iconfont iconlingcunmoshi"></i>另存为
            </el-button>
            <el-button type="text" @click="deleteTable">
              <i class="iconfont iconshanchu"></i>删除
            </el-button>-->
            <el-button
              type="text"
              @click="addConfirm"
              icon="iconfont iconxinzeng"
              v-hotKey="{ func: 'func_add1' }"
            >添加诊断</el-button>
            <el-button
              type="text"
              icon="iconfont iconshanchu"
              @click="deleteTable"
              v-hotKey="{ func: 'func_delete' }"
            >删除</el-button>
            <div class="separator"></div>
            <!-- <el-button>编辑</el-button> -->
            <el-button
              type="text"
              icon="iconfont iconfuzhidaochangqi"
              @click="setDiagMain"
            >设置主诊断</el-button>
            <!-- <el-button type="primary" plain @click="copyTable">复制</el-button> -->
            <!-- <el-button
              type="text"
              icon="iconfont iconfuzhidaochangqi"
              @click="saveAs"
              v-hotKey="{ func: 'func_add2' }"
            >存为常用诊断</el-button> -->
          </div>
          <div class="out_box">
            <el-table
              :data="diagAdd"
              stripe
              width="100%"
              height="100%"
              highlight-current-row
              v-loading="tableLoading"
              @selection-change="handleSelectionChange"
              ref="multipleTable"
              @row-click="editTableRow"
              v-loadmore="{
                noMoreVar: tlm_noMore,
                loadingVar: tlm_isLoading,
                value: loadNextPage
              }"
              v-hotKey="{
                func: ['table_row', 'table_checkbox', 'table_choose'],
                deClass: 'el-table__row',
                curClass: 'current-row'
              }"
            >
              <!-- <el-table-column label="单选" width="55" align="center" fixed="left">
                <template slot-scope="scope">
                    <el-radio  v-model="tableRadio" :label="scope.row" @change="radioChange"><i></i></el-radio>
                </template>
              </el-table-column> -->
              <el-table-column
                prop="m"
                type="selection"
                 width="32"
                align="center"
                fixed="left"
              ></el-table-column>

              <el-table-column
                v-for="(item, index) in mainTableHead"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                header-align="left"
                :fixed="item.fixed"
                show-overflow-tooltip
              >
                <template slot-scope="scope0">
                  <template v-if="item.prop == 'diagCode'">
                    <span class="blue-color">{{ scope0.row[item.prop] }}</span>
                  </template>
                  <template v-else-if="item.prop == 'diagType'">
                    <span
                      code="DiseaseDiagnosisCategoryCode"
                      v-codeTransform
                      :val="scope0.row[item.prop]"
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'cwFlag'">
                    <span
                      code="CWM"
                      v-codeTransform
                      :val="scope0.row[item.prop]"
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'diagMain'">
                    <span
                      code="YesOrNo"
                      v-codeTransform
                      :val="scope0.row[item.prop]"
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'diagName'">
                    <span class="blue-color">{{ scope0.row[item.prop] }}</span>
                  </template>
                  <template v-else-if="item.prop == 'isFirst'">
                    <span
                      code="FirstOrNo"
                      v-codeTransform
                      :val="scope0.row[item.prop]"
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'status'">
                    <span
                      code="DiagStatus"
                      v-codeTransform
                      :val="scope0.row[item.prop]"
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'diagResults'">
                    <span
                      code="EntranceCode"
                      v-codeTransform
                      :val="scope0.row[item.prop]"
                    ></span>
                  </template>
                  <template v-else>{{ scope0.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="componentsPart">
            <component
              :is="curComponent"
              :aOrE="aOrE"
              :asd="asd"
              :patientId="receivePatientData.patientId"
              :inpCode="receivePatientData.treatNo"
              :visitCode="receivePatientData.visitCode"
              :patientSex="receivePatientData.patientGender"
              :patientBirthday="receivePatientData.birthDate"
              :patientName="receivePatientData.patientName"
              :diagDoctorId="role.userId"
              :diagDoctorName="name"
              :deptId="role.deptId"
              :deptName="role.deptName"
              :clinicType="clinicType"
              :selectArr="multipleSelection"
              :hdm="hasDiagMain"
              :table="diagAdd"
              :hosType="hosType"
              @dialogVisibleFalse="dialogVisibleFalse"
              @rechargeConfirm="rechargeConfirmAdd"
              @rechargeCancel="rechargeCancelAdd"
              @card-loading="cardLoadChange"
              class="com-box"
            ></component>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="报卡"
      :visible.sync="dialogVisibleBK"
      width="80%"
      :before-close="handleClose"
    >
      <infectious-card
        :baokaData="baokaData"
        @submitBK="submitBK"
        ref="infectiousCard"
      ></infectious-card>
      <!-- <span>这是一段信息</span> -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button  @click="dialogVisibleBK = false">取 消</el-button> -->
        <!-- <el-button type="primary"  @click="submitBK">提 交</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getHistoryDiagList,
  getCurrentDiagList,
  addDiag,
  updateDiag,
  deleteDiag,
  listCopy,
  setDiagMian
} from "@/api/common/diagnosis";
import diagnosisEdit from "./components/diagnosisEdit";
import diagnosisAdd from "./components/diagnosisAdd";
import { getUId, getUN } from "@/utils/crypto";
import diaAdd from "./components/add";
import diaEdit from "./components/edit";
import diaAddEdit from "./components/addEdit";
import saveTem from "./components/saveTem";
import { mapGetters, mapActions } from "vuex";

import infectiousCard from "@/views/public/infectious/dialogMain.vue"; //报卡弹窗

var diagPo;
var diag = 5;
var patientId = 9;
var diagPo1;
export default {
  components: {
    diagnosisEdit,
    diagnosisAdd,
    diaAdd,
    diaAddEdit,
    diaEdit,
    saveTem,
    infectiousCard
  },
  props: {
    patientId: String,
    inpCode: String,
    visitCode: String,
    diagReloadData: Boolean,
    // 1：门诊 2：急诊 3：住院
    hosType: {
      type: String,
      default (){
        return "3"
      }
    }
  },
  data() {
    let tableP = [
      {
        prop: "diagType",
        label: "诊断类型",
        align: "left",
        fixed: "left",
        width: 80
      },
      {
        prop: "cwFlag",
        label: "中/西医",
        align: "left",
        fixed: false,
        width: 80
      },
      {
        prop: "diagCode",
        label: "诊断编码",
        align: "left",
        fixed: false,
        width: 90
      },
      {
        prop: "diagName",
        label: "诊断名称",
        align: "left",
        fixed: false,
        width: 90
      },
      {
        prop: "diagIcd",
        label: "诊断描述",
        align: "left",
        fixed: false,
        width: 90
      },
      {
        prop: "diagMain",
        label: "主诊断",
        align: "left",
        fixed: false,
        width: 76
      },
      {
        prop: "diagResults",
        label: "病情",
        align: "left",
        fixed: false,
        width: 150
      },
      /*{
            prop: "isFirst",
            label: "初/复诊",
            align: "left",
            fixed: false,
            width: 90
          },*/
      {
        prop: "startTime",
        label: "发病日期",
        align: "left",
        fixed: false,
        width: 200
      },
      {
        prop: "diagDoctorName",
        label: "诊断医生",
        align: "left",
        fixed: false,
        width: 90
      },
      {
        prop: "diagTime",
        label: "诊断日期",
        align: "left",
        fixed: false,
        width: 200
      }
      /*{
            prop: "patientsAdmitied",
            label: "入院病情",
            align: "left",
            fixed: false,
            width: 150
          }*/
    ];
    return {
      // tableRadio: '',

      dialogVisibleBK: false, // 报卡dialog
      baokaData: {},

      isEdit: true, //是否可以编辑
      diagPo1: { patientId: patientId }, //？
      diagPo: { inpCode: diag }, //？
      asd: {}, //编辑表格数据
      aOrE: true, // 判断新增or编辑
      diagAdd: [], //当前诊断表格数据
      // 表格loading
      tableLoading: false,
      diagHistory: [],
      /*diagHistory: [
          {
            clinicType: "门诊",
            diagType: "门诊诊断",
            diagTime: "2019-01-01",
            diagName: "咽喉炎",
            deptName: "内科",
            diagDoctorName: "张三"
          },
          {
            clinicType: "门诊",
            diagType: "门诊诊断",
            diagTime: "2019-02-03",
            diagName: "肺结核",
            deptName: "呼吸科",
            diagDoctorName: "李四"
          },
          {
            clinicType: "住院",
            diagType: "住院诊断",
            diagTime: "2019-06-08",
            diagName: "骨折",
            deptName: "骨科",
            diagDoctorName: "赵二"
          }

        ],*/
      //历史诊断表格数据
      dialogVisible: false,
      editTableFlag: false,
      //分页信息
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 表格loading
      tlm_isLoading: false,
      // 表格数据
      tableParams: tableP,
      // 历次诊断表格
      tableParamsZ: [
        {
          prop: "diagTime",
          label: "诊断日期",
          width: 150,
          align: "left",
          fixed: false
        },
        {
          prop: "clinicType",
          label: "就诊类型",
          width: 80,
          align: "left",
          fixed: false
        },
        {
          prop: "diagType",
          label: "诊断类型",
          width: 90,
          align: "left",
          fixed: false
        },
        {
          prop: "diagName",
          label: "诊断名称",
          width: 80,
          align: "left",
          fixed: false
        },
        {
          prop: "deptName",
          label: "诊断科室",
          width: 80,
          align: "left",
          fixed: false
        },
        {
          prop: "diagDoctorName",
          label: "诊断医生",
          width: 80,
          align: "left",
          fixed: false
        }
      ],
      multipleSelection: [], //当且选中项数量为1时可以编辑
      activeName: "first",
      clientHeight: "",
      show: true,
      // tlm_isLoading: false, // 请求数据中
      isVisited: false, //判断是门诊还是住院
      diagDoctorId: "",
      diagDoctorName: "",
      deptId: "",
      deptName: "",

      // 添加诊断组件
      // diaAdd: diaAdd,
      // diaAdd: diaAddEdit,
      diaAddEdit: diaAddEdit,
      // 编辑诊断组件
      diaEdit: diaEdit,
      // 另存为-保存模板
      saveTem: saveTem,
      // 显示的组件
      curComponent: diaAddEdit,
      cardLoading: false
    };
  },
  computed: {
    // 获取患者信息
    ...mapGetters("homeSickbeds", ["receivePatientData"]),
    // 获取登录用户信息
    ...mapGetters("user", ["name", "role"]),
    // 就诊类型 1:门诊；2:急症； 3:住院。
    clinicType() {
      return this.hosType;
    },
    // 控制是否还可以继续加载
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageSize) <=
        this.pageParams.pageNo
      );
    },
    // 根据就诊类型显示不同的表头
    mainTableHead() {
      const tableHead1 = [
        {
          prop: "diagType",
          label: "诊断类型",
          align: "left",
          fixed: "left",
          width: 80
        },
        {
          prop: "cwFlag",
          label: "中/西医",
          align: "left",
          fixed: false,
          width: 80
        },
        {
          prop: "diagCode",
          label: "诊断编码",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagName",
          label: "诊断名称",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagIcd",
          label: "诊断描述",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "tcmSyndrome",
          label: "中医证型",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagMain",
          label: "主诊断",
          align: "left",
          fixed: false,
          width: 76
        },
        {
          prop: "startTime",
          label: "发病日期",
          align: "left",
          fixed: false,
          width: 200
        },
        {
          prop: "diagDoctorName",
          label: "诊断医生",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagTime",
          label: "诊断日期",
          align: "left",
          fixed: false,
          width: 200
        },
        {
          prop: "isFirst",
          label: "初复诊",
          align: "left",
          fixed: false,
          width: 80
        },
        {
          prop: "status",
          label: "状态",
          align: "left",
          fixed: false,
          width: 80
        }
      ];
      const tableHead2 = [
        {
          prop: "diagType",
          label: "诊断类型",
          align: "left",
          fixed: "left",
          width: 80
        },
        {
          prop: "cwFlag",
          label: "中/西医",
          align: "left",
          fixed: false,
          width: 80
        },
        {
          prop: "diagCode",
          label: "诊断编码",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagName",
          label: "诊断名称",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagIcd",
          label: "诊断描述",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "tcmSyndrome",
          label: "中医证型",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagMain",
          label: "主诊断",
          align: "left",
          fixed: false,
          width: 76
        },
        {
          prop: "diagResults",
          label: "病情",
          align: "left",
          fixed: false,
          width: 150
        },
        {
          prop: "startTime",
          label: "发病日期",
          align: "left",
          fixed: false,
          width: 200
        },
        {
          prop: "diagDoctorName",
          label: "诊断医生",
          align: "left",
          fixed: false,
          width: 90
        },
        {
          prop: "diagTime",
          label: "诊断日期",
          align: "left",
          fixed: false,
          width: 200
        },
        {
          prop: "isFirst",
          label: "初复诊",
          align: "left",
          fixed: false,
          width: 80
        },
        {
          prop: "status",
          label: "状态",
          align: "left",
          fixed: false,
          width: 80
        }
      ];
      return this.clinicType === "1" ? tableHead1 : tableHead2;
    },
    // 是否有主诊断
    hasDiagMain() {
      return this.diagAdd.some(item => {
        return item.diagMain === "1";
      });
    },
    reloadDataFlag() {
      return this.diagReloadData;
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.aOrE = "1";
        // this.tableRadio = ''
        // this.radioChange('')
        if (val && val.patientId) {
          console.log("reloadData");
          this.reLoadData();
        }
      }
    },
    reloadDataFlag() {
      this.reLoadData();
    }
  },
  mounted() {
    this.diagDoctorId = getUId();
    this.diagDoctorName = getUN();
    this.deptId = this.$store.state.user.role.deptId;
    this.deptName = this.$store.state.user.role.deptName;
  },
  methods: {
    ...mapActions({
      changeRef: "diagnosis/changeRef",
      changeRecPatientData: "base/changeRecPatientData",
      setDiaName: "cis/setDiaName"
    }),
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.isEdit = val.length == 1 ? false : true;
    },
    //获取历史诊断
    async queryHistoryDiag() {
      // debugger;
      let res = await getHistoryDiagList({
        ...this.pageParams,
        patientId: this.patientId
      });
      if (res.data) {
        this.diagHistory = res.data;
        this.total = res.total;
      } else {
        this.diagHistory = [];
        this.total = 0;
      }
    },
    //获取当前诊断
    async queryCurrentDiag() {
      this.curComponent = "diaAddEdit";
      this.tableLoading = true;
      let res = await getCurrentDiagList({
        ...this.pageParams,
        patientId: this.receivePatientData.patientId,
        inpCode: this.receivePatientData.treatNo,
        visitCode: this.receivePatientData.visitCode
      });
      if (res.pageParams.pageNo === 1) {
        this.diagAdd = res.data;
      } else {
        this.diagAdd = this.diagAdd.concat(res.data);
      }
      this.$refs.multipleTable.setCurrentRow(this.diagAdd[0]);
      this.setDiaName({
        ...this.diagAdd[0]
      });
      console.log(this.diagAdd, "this.diagAdd");
      this.pageParams = { ...res.pageParams };

      //顶部患者卡片更新主诊断信息
      this.diagAdd.forEach(item => {
        if (item.diagMain === "1") {
          let patientData = this.receivePatientData;
          patientData.diagName = item.diagName;
          //更新初诊/复诊
          patientData.rediagStatus = item.isFirst;
          this.changeRecPatientData(patientData);
        }
      });

      this.tableLoading = false;
    },
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.queryCurrentDiag();
    },
    //编辑
    editTable() {
      let length = this.multipleSelection.length;
      this.asd = this.multipleSelection[0];

      this.editTableFlag = true;
    },
    //复制
    copyTable() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择一条诊断!");
        return;
      }
      const dataList = this.multipleSelection.map(item => {
        return {
          ...item,
          diagMain: "0"
        };
      });
      listCopy(dataList)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("复制成功");
            this.changeRef();
            this.reLoadData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    dialogVisibleFalse() {
      this.curComponent = "diaAddEdit";
    },
    // 报卡dialog
    dialogVisibleBKShow(data) {
      console.log("dialogVisibleBKShow", data);
      this.baokaData = data;
      this.dialogVisibleBK = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 提交报卡
    submitBK(data) {
      console.log("dialogVisibleBKShow", data);
      // this.$refs.infectiousCard.submitForm('ruleForm')
      // this.baokaData = data
      this.dialogVisibleBK = false;
    },
    //添加诊断确认方法
    rechargeConfirmAdd(data) {
      this.reLoadData();
      this.dialogVisible = false;
      this.curComponent = "";
    },
    //取消添加
    rechargeCancelAdd() {
      this.curComponent = false;
    },
    //编辑诊断确认方法
    async rechargeConfirmEdit(data) {
      this.diagAdd = [];
      this.pageParams.pageNo = 1;
      await this.queryCurrentDiag();
      this.editTableFlag = data;
    },
    rechargeCancelEdit() {
      this.editTableFlag = false;
    },
    // 编辑当前列
    editTableRow(row) {
      // this.curComponent = this.diaEdit;
      this.curComponent = this.diaAddEdit;
      this.asd = row;
      console.log(this.asd, "this.asd,row");
      this.aOrE = false;
      this.$refs.multipleTable.setCurrentRow(row);
      this.setDiaName({
        ...row
      });
    },
    // radioChange(row) {
    //   // this.curComponent = this.diaEdit;
    //   if(row){
    //     this.curComponent = this.diaAddEdit;
    //     this.asd = row;
    //     console.log(this.asd, "this.asd,row");
    //     this.aOrE = false;
    //     this.$refs.multipleTable.setCurrentRow(row);
    //     this.setDiaName({
    //       ...row
    //     });
    //     this.multipleSelection = [row];
    //     this.isEdit = this.multipleSelection.length == 1 ? false : true;
    //   } else {
    //     this.curComponent = this.diaAddEdit;
    //     this.asd = '';
    //     this.aOrE = false;
    //     this.$refs.multipleTable.setCurrentRow('');
    //     this.multipleSelection = []
    //   }
    // },
    // 添加诊断
    addConfirm() {
      console.log("添加");
      this.curComponent = this.diaAddEdit;
      this.aOrE = true;
    },
    //删除诊断
    deleteTable() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要删除的诊断");
        return;
      }
      const flag = this.multipleSelection.some(item => item.diagMain === "1");
      // if (flag) {
      //   this.$message.warning("主诊断不能删除");
      //   return;
      // }
      let arr = [];
      this.$confirm("是否删除所选诊断？", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDiag(this.multipleSelection)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("删除成功!");
                this.changeRef();
                // this.tableRadio = ''
                // this.radioChange('')
                this.$refs.multipleTable.clearSelection();
                this.reLoadData();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleShow() {
      this.show = !this.show;
    },
    //点击引用方法
    async handleClick(row) {
      console.log("handleClick", row);
      row.id = "";
      // row.inpCode = "5";
      row.diagDoctorId = this.diagDoctorId;
      row.diagDoctorName = this.diagDoctorName;
      row.deptId = this.deptId;
      row.deptName = this.deptName;
      row.clinicType = this.clinicType;
      row.visitCode = this.receivePatientData.visitCode;
      row.inpCode = this.receivePatientData.treatNo;
      row.status = "1";
      console.log("handleClick", row);
      let res = await addDiag(row);
      await this.queryCurrentDiag();
    },
    //滑动加载更多信息
    /* load() {
      const _this = this;
      this.currentPage++;
      setTimeout(function() {
        let diagHistory = [..._this.diagHistory];
        //获取分页列表
        this.queryHistoryDiag();
        //模拟返回数据
        let newDiagHistory = [];
        if (_this.currentPage >= _this.total) {
          _this.tlm_noMore = true;
        }
        _this.proData = [...diagHistory.concat(newDiagHistory)];
        _this.tlm_isLoading = false;
      }, 2000);
    }, */
    // 另存为-模板
    saveAs() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请最少选择一条诊断!");
        return;
      }

      if (this.multipleSelection.length !== 1) {
        this.$message.warning("请选择一条诊断!");
        return;
      }
      this.curComponent = saveTem;
    },
    // 重新请求表格数据
    reLoadData() {
      this.pageParams.pageNo = 1;
      this.queryCurrentDiag();
    },
    // 设置主诊断
    setDiagMain() {
      if (this.multipleSelection.length !== 1) {
        this.$message.warning("请选择一条诊断!");
        return;
      }
      if (this.multipleSelection[0].diagMain === "1") {
        this.$message.warning("此诊断已是主诊断!");
        return;
      }
      this.$showLoading();
      setDiagMian(this.multipleSelection[0])
        .then(res => {
          if (res.code === 1) {
            this.$refs.multipleTable.clearSelection();

            // this.tableRadio = ''
            // this.radioChange('')
            this.reLoadData();
            this.changeRef();
            this.$message.success("设置成功!");
          } else {
            this.$message.error(res.msg);
          }
          this.$hideLoading();
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err);
        });
    },
    cardLoadChange(val) {
      this.cardLoading = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.contain {
  height: auto;
}
.blue-color {
  color: $l-color-fontcolor-2;
}

.box_container {
  overflow: hidden;
  &.shr {
    .out_box {
      height: calc(100% - 297px);
    }
  }
}

.zdlb_box {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: $l-color-white;
  overflow: hidden;
  overflow-y: auto;
      display: flex;
    flex-direction: column;
}

/deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}

/deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}

/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: none;
}

.operation_button {
  text-align: left;
  display: flex;
  align-items: center;
  font-size: 0px;
  .el-button:first-of-type {
    padding-left: 0 !important;
  }

  .el-button {
    padding: 8px;
  }
  .el-button--text,
  .el-button--text:hover {
    font-size: 14px;
    font-weight: 400;
    color: #2e323a;
  }

  .separator {
    width: 2px;
    height: 18px;
    margin: 0 8px;
    background: #e4e4e4;
    display: inline-block;
  }
  /deep/ .el-button {
    & > i {
      font-size: 18px;
      vertical-align: middle;
      padding: 3px;
    }

    & > span {
      margin-left: 5px;
    }
  }

  .el-button + .el-button {
    margin-left: 5px;
  }
}

.componentsPart {
  height: 178px;
  border: 1px solid #e4e4e4;
  border-radius: 2px;
}

.msg_bottom {
  overflow: hidden;
  height: 100%;
}

.box_tabs {
  background-color: $l-color-white;
  width: 34.7%;
  height: 100%;
  padding: 0 20px;
  float: left;
}

.pagination {
  position: relative;
  right: 0;
}

/deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}

.out_box {
  width: 100%;
  // height: calc(100% - 57px);
  margin: 8px 0;
  flex: 1;
}
.consultation-tabs {
  position: relative;
  .el-tabs__header {
    height: 40px;
    margin-bottom: 15px;
    background-color: transparent;
  }
  /deep/ .el-tabs__content {
    height: auto;
  }
  .el-tab-pane {
    overflow: hidden;
    overflow-y: auto;
  }
  .allergy-form-btn {
    text-align: right;
  }
  /deep/ .el-form-item {
    margin-bottom: 18px;
  }
  /deep/ .el-form-item--medium .el-form-item__content {
    height: 36px;
    .el-form-item__error {
      padding-top: 3px;
    }
  }
}
.com-box {
  overflow: hidden;
  overflow-y: auto;
}
</style>
