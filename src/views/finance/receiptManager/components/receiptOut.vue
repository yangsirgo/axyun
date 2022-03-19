<template>
  <div class="width100 height100">
    <el-row class="width100 height100 padding20" :gutter="20">
      <el-col :span="7" class="height100">
        <l-card-title>
          <span slot="left">入库记录</span>
        </l-card-title>
        <el-form class="search-area" :model="form" :rules="rulesInit" ref="ruleForm">
          <el-row>
            <LFormtTitle label="票据类型">
              <el-form-item prop="receiptType">
                <l-value-domain
                  code="RECEIPT_TYPE"
                  :value.sync="form.receiptType"
                  clearable
                  @change="selectInList"
                />
              </el-form-item>
            </LFormtTitle>
          </el-row>
          <el-row class="margin-top-10">
            <LFormtTitle label="入库院区">
              <el-form-item prop="divisionCode">
                <l-value-domain
                  code="DIVISION_CODE"
                  :value.sync="form.divisionCode"
                  clearable
                  placeholder="请选择"
                  @change="selectInList"
                />
              </el-form-item>
            </LFormtTitle>
          </el-row>
          <el-row class="margin-top-10">
            <LFormtTitle label="票据号">
              <el-form-item prop="receiptNum">
                <el-input
                  type="text"
                  v-model="form.receiptNum"
                  placeholder="请输入"
                  style="width:100%"
                  clearable
                  @change="selectInList"
                ></el-input>
              </el-form-item>
            </LFormtTitle>
          </el-row>
          <el-row class="margin-top-20">
            <el-checkbox v-model="form.checked" @change="selectInList">只显示未领用完的入库记录</el-checkbox>
          </el-row>
        </el-form>
        <!-- 表格 -->
        <div class="tableDiv">
          <el-table
            :data="tableData"
            width="100%"
            height="90%"
            stripe
            border
            v-loading="loading"
            :element-loading-text="$t('retreat.loadInfo')"
            highlight-current-row
            @row-click="selectOutList"
          >
            <el-table-column
              v-for="(item, index) in tableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'receiptType'">
                  <span :val="scope.row['receiptType']" code="RECEIPT_TYPE" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'operate'">
                  <el-button type="text" @click="openDialog(scope.row,scope.$index,'1')">作废</el-button>
                  <el-button type="text" @click="openDialog(scope.row,scope.$index,'2')">退还</el-button>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
          <div class="page margin-top-20">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageParams.pageNo"
              :page-sizes="[10,20, 30,40]"
              :page-size="pageParams.pageSize"
              layout="total,sizes, prev, pager, next"
              :total="pageParams.total"
            ></el-pagination>
          </div>
          <!-- total, sizes, prev, pager, next, jumper" -->
        </div>
      </el-col>
      <el-col :span="17" class="height100">
        <l-card-title>
          <span slot="left">出库记录</span>
        </l-card-title>
        <el-form class="search-area" :model="formTwo" :rules="rules" ref="formTwo">
          <el-row :gutter="10">
            <el-col :span="8">
              <!-- <LFormtTitle label="领用人员" required>
                <el-form-item prop="userId">
                  <l-value-domain
                    :value.sync="formTwo.userId"
                    remoteUrl="/wadmin/dept-user/119/1"
                    :remoteParams="''"
                    remoteShowKey="uname"
                    remoteValueKey="uid"
                    placeholder="请选择"
                    @change="setUser"
                    clearable
                  />
                </el-form-item>
              </LFormtTitle>-->
              <LFormtTitle label="领用人" required>
                <el-form-item prop="userId">
                <el-select
                  v-model="formTwo.userId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="姓名/拼音/五笔"
                  :remote-method="selectAllUser"
                  :loading="selLoading"
                  @change="setUser"
                  clearable
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="领用张数" required>
                <el-form-item prop="receiptQuantity">
                  <el-input
                    type="text"
                    v-model="formTwo.receiptQuantity"
                    placeholder="请输入"
                    style="width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <div class="float-right">
                <el-button type="primary" @click="save">确认领用</el-button>
                <el-button type="primary" plain @click="cancel">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <!-- 表格 -->
        <div class="tableDivTwo">
          <el-table
            :data="tableDataTwo"
            height="90%"
            stripe
            border
            v-loading="loadingTwo"
            :element-loading-text="$t('retreat.loadInfo')"
          >
            <el-table-column
              v-for="(item, index) in tableParamsTwo"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'receiptType'">
                  <span :val="scope.row['receiptType']" code="RECEIPT_TYPE" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'outType'">
                  <span :val="scope.row['outType']" code="OUT_TYPE" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'operate'">
                  <el-button
                    type="text"
                    @click="recycleReceipt(scope.row)"
                    :disabled="scope.row['outType'] != '1' || scope.row['recordStatus'] == '4'"
                  >回收</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row['recordStatus'] == '1'"
                    @click="updateReceipt(scope.row,'2')"
                  >停用</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row['recordStatus'] != '1'"
                    @click="useReceipt(scope.row,'1')"
                    :disabled="scope.row.abortStatus == '1' || scope.row.outType != '1'"
                  >启用</el-button>
                </template>
                <template v-else-if="item.prop == 'abortStatus'">
                  <span>{{scope.row[item.prop] == '1'?'已终止':'未终止'}}</span>
                </template>
                <template v-else-if="item.prop == 'recordStatus'">
                  <span>{{scope.row[item.prop] == '1'?'启用':''}}</span>
                  <span>{{scope.row[item.prop] == '2'?'停用':''}}</span>
                  <span>{{scope.row[item.prop] == '3'?'在用':''}}</span>
                  <span>{{scope.row[item.prop] == '4'?'已退还':''}}</span>
                </template>

                <template v-else-if="item.prop == 'abortUserName'">
                  <span v-if="scope.row['recordStatus'] == '4' ">{{scope.row[item.prop]}}</span>
                  <span v-if="scope.row['recordStatus'] != '4' "></span>
                </template>
                <template v-else-if="item.prop == 'abortTime'">
                  <span v-if="scope.row['recordStatus'] == '4' ">{{scope.row[item.prop]}}</span>
                  <span v-if="scope.row['recordStatus'] != '4' "></span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
          <div class="page margin-top-20">
            <el-pagination
              background
              @size-change="handleSizeChangeOut"
              @current-change="handleCurrentChangeOut"
              :current-page="outPageParams.pageNo"
              :page-sizes="[10,20, 30,40]"
              :page-size="outPageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="outPageParams.total"
            ></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 退回弹窗 -->
    <el-dialog
      class="padding20"
      :title="diaTitle"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="27%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer padding20">
        <el-form :model="diaForm" :rules="diaFormRules" ref="diaForm">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item prop="receiptStartNum">
                <LFormtTitle label="起始票据号" required>
                  <el-input
                    type="text"
                    v-model="diaForm.receiptStartNum"
                    placeholder="请输入"
                    style="width:100%"
                  ></el-input>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="receiptStopNum">
                <LFormtTitle label="终止票据号" required>
                  <el-input
                    type="text"
                    v-model="diaForm.receiptStopNum"
                    placeholder="请输入"
                    style="width:100%"
                  ></el-input>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="margin-top-20">
            <el-form-item prop="recordRemark">
              <LFormtTitle :label="recordRemark" required>
                <el-input
                  type="text"
                  v-model="diaForm.recordRemark"
                  placeholder="请输入"
                  style="width:100%"
                ></el-input>
              </LFormtTitle>
            </el-form-item>
          </el-row>
        </el-form>
        <el-row class="margin-top-20">
          <el-button @click="cancal">取 消</el-button>
          <el-button type="primary" @click="submitDiaForm">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>

    <el-dialog
      class="padding20"
      title="请选择使用人"
      :visible.sync="openUseUserInfo"
      v-if="openUseUserInfo"
      width="27%"
      :before-close="handleCloseUseUserInfo"
    >
      <LFormtTitle label="使用人" class="width-dialog">
        <el-select
          v-model="useUserInfo.useUserId"
          filterable
          remote
          reserve-keyword
          placeholder="姓名/拼音/五笔"
          :remote-method="selectAllUser"
          :loading="selLoading"
          @change="setUseUserInfo"
          clearable
        >
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </LFormtTitle>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openUseUserInfo = false">取 消</el-button>
        <el-button type="primary" @click="updateReceipt(openDataInfo,'1')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 领用票据绑定mac地址 -->
    <el-dialog
      title="请输入使用票据设备的MAC地址"
      :visible.sync="macDialogVisible"
      width="400px"
      :before-close="macHandleClose"
      >
      <div class="width100 height100 padding10">
        <el-row>
          <el-col :span="14">
            <el-select
              v-loading="dialogLoading"
              v-model="currentMac"
              filterable
              allow-create
              default-first-option
              placeholder="请输入或选择MAC地址">
              <el-option
                v-for="item in macList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-button type="text" @click="getMac">获取本机MAC地址</el-button>
          </el-col>
        </el-row>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="macDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateReceipt(openDataInfo,'1')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api/systemManagement/receipt/receipt";
import { getMacLoaction } from "@/utils/print";

Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};


export default {
  data() {
    // 票据号起始结束校验
    var diaFormReceiptStopNum = (rule, value, callback) => {
      let a = Number(value);
      let b = Number(this.diaForm.receiptStartNum);
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback(new Error("请输入票据结束号"));
        this.$message.error("请输入票据结束号");
      } else if (
        value > this.currentDiagData.receiptStopNum ||
        value < this.currentDiagData.receiptStartNum
      ) {
        callback(new Error("不在当前票据号段内"));
        this.$message.error("不在当前票据号段内");
      } else if (a < b) {
        callback(new Error("结束号不能小于起始号"));
        this.$message.error("结束号不能小于起始号");
      } else if (rules.test(value) === false) {
        callback(new Error("结束号只能为数值型"));
        this.$message.error("结束号只能为数值型");
      } else {
        callback();
      }
    };
    var diaFormReceiptStartpNum = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
       let a = Number(value);
      let b = Number(this.diaForm.receiptStopNum);
      if (value === "") {
        callback(new Error("请输入票据起始号"));
        this.$message.error("请输入票据起始号");
      } else if (
        value > this.currentDiagData.receiptStopNum ||
        value < this.currentDiagData.receiptStartNum
      ) {
        callback(new Error("不在当前票据号段内"));
        this.$message.error("不在当前票据号段内");
      } else if (rules.test(value) === false) {
        callback(new Error("起始号只能为数值型"));
        this.$message.error("起始号只能为数值型");
      } else if (value === 0) {
        callback(new Error("起始号不能为0"));
        this.$message.error("起始号不能为0");
      } else if (a > b) {
        callback(new Error("起始号不能大于结束号"));
        this.$message.error("起始号不能大于结束号");
      } else {
        callback();
      }
    };

    var valNumber = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("只能输入数字"));
        this.$message.error("只能输入数字");
      } else {
        callback();
      }
    };

    var valQuantity = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("只能输入正整数"));
        this.$message.error("只能输入正整数");
      } else if (value <= 0) {
        callback(new Error("只能输入正整数"));
        this.$message.error("只能输入正整数");
      } else {
        callback();
      }
    }

    return {
      // loading
      loading: false,
      loadingTwo: false,
      // 出库搜索表单
      form: {
        receiptType: "",
        divisionCode: "",
        receiptNum: "",
        checked: true
      },
      // 出库表格
      tableParams: [
        {
          prop: "operate",
          label: "操作",
          align: "center",
          headerAlign: "center",
          width: "130",
          fixed: true
        },
        {
          prop: "receiptType",
          label: "票据类型",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
        {
          prop: "receiptStartNum",
          label: "起始号",
          align: "left",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "receiptStopNum",
          label: "终止号",
          align: "left",
          headerAlign: "center",
          width: "70"
        },
        {
          prop: "remainderQuantity",
          label: "可用张数",
          align: "left",
          headerAlign: "center",
          width: "80"
        }
      ],
      // 出库表格数据
      tableData: [],
      // 领用表格
      tableParamsTwo: [
        {
          prop: "operate",
          label: "快捷操作",
          align: "left",
          headerAlign: "center",
          fixed: true,
          width: "158"
        },
        {
          prop: "outType",
          label: "出库类型",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
        {
          prop: "abortStatus",
          label: "终止类型",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
        {
          prop: "recordStatus",
          label: "状态标志",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "receiveUserName",
          label: "领用人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "useUserName",
          label: "使用人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },{
          prop: "useMacLoaction",
          label: "使用设备MAC",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptPrefix",
          label: "票据号前缀",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptSuffix",
          label: "票据号后缀",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNumLength",
          label: "票据号长度",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptStartNum",
          label: "起始票据号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptStopNum",
          label: "终止票据号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptUsedNum",
          label: "已用票据号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "useQuantity",
          label: "剩余可用张数",
          align: "left",
          headerAlign: "center",
          width: "110"
        },
        {
          prop: "outUserName",
          label: "出库人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "outTime",
          label: "领用出库时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "abortUserName",
          label: "回收人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "abortTime",
          label: "回收入库时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        }
      ],
      // 领用表格数据
      tableDataTwo: [],
      // 领用表单
      formTwo: {
        userId: "",
        num: ""
      },
      // 当前选中入库票据
      currentData: {},
      // 选中领用人员
      currentUser: {},
      // 收费员
      userList: [],
      // （查询用）
      rulesInit: {
        receiptNum: [{ validator: valNumber, trigger: "blur" }]
      },
      //
      rules: {
        userId: [
          { required: true, message: "请选择领用人员", trigger: "blur" }
        ],
        receiptQuantity: [
          { required: true, message: "请输入领用张数", trigger: "blur" },
          { validator: valQuantity, trigger: "blur" }
        ]
      },
      // 弹窗显示
      dialogVisible: false,
      //行点击ID
      changeOutInId: "",
      // 弹窗表单数据
      diaForm: {
        receiptStartNum: "",
        receiptStopNum: "",
        recordRemark: ""
      },
      // 弹窗标题
      diaTitle: "",
      // 原因label
      recordRemark: "",
      // 弹窗标志
      diaFlag: "1",
      // 弹窗校验
      diaFormRules: {
        receiptStartNum: [
          { required: true, message: "请输入票据起始号", trigger: "blur" },
          { validator: diaFormReceiptStartpNum, trigger: "blur" }
        ],
        receiptStopNum: [
          { required: true, message: "请输入票据结束号", trigger: "blur" },
          { validator: diaFormReceiptStopNum, trigger: "blur" }
        ],
        recordRemark: [
          { required: true, message: "请输入原因", trigger: "blur" }
        ]
      },
      // 当前弹窗对象
      currentDiagData: {},
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 分页out
      outPageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // 用户集合
      options: [],
      selLoading: false,
      // 使用人信息
      useUserInfo: {},
      openUseUserInfo: false,
      openDataInfo: {},
      // mac地址
      macDialogVisible: false,
      macList: [
        {
          name: "收银台一(测试用)",
          value: "E9:2A:23:32:12:A4"
        }
      ],
      // 当前MAC
      currentMac: '',
      dialogLoading: false
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    tlm_noMore_out() {
      return (
        Math.ceil(this.outPageParams.total / this.outPageParams.pageSize) <=
        this.outPageParams.pageNo
      );
    }
  },
  mounted() {
    // 获取入库列表
    this.getReceiptInList();
    // 获取收费员
    // this.getMoneyUserList();
    
    
  },
  methods: {
    getMac(){
       try {
        this.dialogLoading = true;
        let mac = {value: ''};
         getMacLoaction(mac).then((res)=>{
            this.currentMac = res;
         });
        setTimeout(()=>{
          this.dialogLoading = false;
        },1500)
      } catch (error) {
        this.dialogLoading = false;
        this.$message.error(error.message || '获取本机主MAC地址失败');
      }
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service.getAllUser({
          userName: val || ""
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    macHandleClose(){
      this.macDialogVisible = false;
    },
    handleCloseUseUserInfo() {},
    setUseUserInfo(row) {
      this.options.forEach(val => {
        if (val.id == row) {
          this.useUserInfo.useUserName = val.name;
          this.useUserInfo.useUserId = val.id;
        }
      });
    },
    // 票据启用
    async useReceipt(row, status) {
      // 验证是否需要选择领用人
      let res = await service.getDictionaryPO({
        itemCode: "0000",
        valueCode: "A0001"
      });
      // 查询领用是否使用mac
      let res2 = await service.getDictionaryPO({
        itemCode: "0000",
        valueCode: "A0003"
      });
      if(res2 && res2.data.dictionaryValue == "1"){
        this.macDialogVisible = true;
        this.openDataInfo = row;
      } else if (res.data && res.data.dictionaryValue == "0") {
        this.openDataInfo = row;
        this.openUseUserInfo = true;
      } else {
        this.updateReceipt(row, status);
      }
    },

    // 启用 停用
    async updateReceipt(row, status) {
      try {
        this.$showLoading();
        let res = await service.updateReceiptOut({
          outId: row.outId,
          recordStatus: status,
          useUserName: this.useUserInfo.useUserName || undefined,
          useUserId: this.useUserInfo.useUserId || undefined,
          useTime: new Date(),
          useMacLoaction: this.currentMac || undefined
        });
        this.$message({ type: "success", message: "操作成功" });
        this.selectOutList(this.currentData);
        this.openUseUserInfo = false;
        this.useUserInfo = {};
        this.macHandleClose();
        this.$hideLoading();
      } catch (error) {
        this.useUserInfo = {};
        this.openUseUserInfo = false;
        this.macHandleClose();
        this.$hideLoading();
        this.$message.error(error.msg || "操作失败");
      }
    },
    // 打开弹窗
    openDialog(data, index, flag) {
      this.diaForm = {
        receiptStartNum: "",
        receiptStopNum: "",
        recordRemark: ""
      };
      if (flag == "1") {
        this.diaTitle = "作废区间";
        this.recordRemark = "作废原因";
      } else if (flag == "2") {
        this.diaTitle = "退还区间";
        this.recordRemark = "退还原因";
      }
      this.currentDiagData = {
        ...data
      };
      this.dialogVisible = true;
      this.diaFlag = flag;
    },
    cancal() {
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.$refs["diaForm"] && this.$refs["diaForm"].resetFields();
      });
      this.diaForm = {
        receiptStartNum: "",
        receiptStopNum: "",
        recordRemark: ""
      };
    },
    // 提交弹窗数据
    submitDiaForm() {
      this.$refs["diaForm"].validate(valid => {
        if (valid) {
          if (this.diaFlag == "1") {
            this.verification();
          } else if (this.diaFlag == "2") {
            this.back();
          }
        } else {
          return false;
        }
      });
    },
    // 作废
    async verification() {
      try {
        let obj = {
          receiptStartNum: this.diaForm.receiptStartNum,
          receiptStopNum: this.diaForm.receiptStopNum,
          recordRemark: this.diaForm.recordRemark,
          inId: this.currentDiagData.inId,
          receiptType: this.currentDiagData.receiptType,
          divisionCode: this.currentDiagData.divisionCode,
          outType: "2", // 作废
          abortStatus: "1" //终止
        };
        this.$showLoading();
        let res = await service.receiptback(obj);
        this.$hideLoading();
        this.dialogVisible = false;
        this.$message({ message: "作废成功", type: "success" });
        this.$nextTick(() => {
          this.$refs["diaForm"] && this.$refs["diaForm"].resetFields();
        });
        this.selectInList();
        this.selectOutList(this.currentData);
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "作废失败");
      }
    },
    handleClose(done) {
      this.cancal();
    },
    // 退回来源地
    async back() {
      try {
        let obj = {
          // ...this.currentData,
          receiptStartNum: this.diaForm.receiptStartNum,
          receiptStopNum: this.diaForm.receiptStopNum,
          recordRemark: this.diaForm.recordRemark,
          inId: this.currentDiagData.inId,
          receiptType: this.currentDiagData.receiptType,
          divisionCode: this.currentDiagData.divisionCode,
          outType: "5", // 退回来源地
          abortStatus: "1" //终止
        };
        this.$showLoading();
        let res = await service.receiptback(obj);
        this.$hideLoading();
        this.dialogVisible = false;
        this.$message({ message: "退还成功", type: "success" });
        this.$nextTick(() => {
          this.$refs["diaForm"].resetFields();
        });
        this.selectInList();
        this.selectOutList(this.currentData);
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "退还失败");
      }
    },
    // 点击入库信息 查询出库列表
    async selectOutList(row) {
      this.outPageParams.pageNo = 1;
      this.tableDataTwo = [];
      await this.getReceiptOutList(row);
    },
    // 查询入库列表
    async selectInList() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          this.pageParams.pageNo = 1;
          this.tableData = [];
          await this.getReceiptInList();
        } else {
          return false;
        }
      });
    },
    // 确认领用
    async save() {
      try {
        this.$refs["formTwo"].validate(async valid => {
          if (valid) {
            let obj = {
              receiveUserId: this.formTwo.userId,
              receiveUserName: this.currentUser.name,
              receiptQuantity: this.formTwo.receiptQuantity,
              inId: this.currentData.inId,
              receiptType: this.currentData.receiptType,
              divisionCode: this.currentData.divisionCode,
              outType: "1", // 领用出库
              abortStatus: "0" //未终止
            };
            try {
              this.$showLoading();
              let res = await service.receiptback(obj);
              this.$hideLoading();
              this.$message({ message: "领用成功", type: "success" });
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "领用失败");
            }
            this.$nextTick(() => {
              this.$refs["formTwo"] && this.$refs["formTwo"].resetFields();
            });
            // 更新出库信息
            this.selectOutList(this.currentData);
            // this.getReceiptOutList(this.currentData);
            // 更新入库列表
            this.selectInList();
          } else {
            return false;
          }
        });
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "领用失败");
      }
    },
    // 取消
    cancel() {
      this.$nextTick(() => {
        this.$refs["form"] && this.$refs["form"].resetFields();
      });
      
    },
    // 查询入库票据
    async getReceiptInList() {
      this.changeOutInId = "";
      try {
        this.loading = true;
        if (this.form.checked && this.form.checked == true) {
          this.form.outStatus = "2";
        }
        if (!this.form.checked) {
          this.form.outStatus = "";
        }
        let data = {
          ...this.pageParams,
          ...this.form
        };
        let res = await service.getReceiptList(data);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "获取入库列表失败");
      }
    },
    // 拿到出库列表
    async getReceiptOutList(row) {
      try {
        // 当前选中入库票据
        this.currentData = { ...row };
        this.loadingTwo = true;
        this.changeOutInId = row.inId;
        let obj = {
          inId: row.inId,
          ...this.outPageParams
        };
        let res = await service.getReceiptOutList(obj);
        if (res.pageNo && res.pageNo == 1) {
          this.tableDataTwo = [];
        }
        // this.tableDataTwo.push(...res.data);
        this.tableDataTwo = res.data;
        this.outPageParams.total = res.total;
        this.loadingTwo = false;
      } catch (error) {
        console.info(error);
        this.loadingTwo = false;
        this.$message.error(error.msg || "获取出库列表失败");
      }
    },
    async changeRowOutList() {
      try {
        this.loadingTwo = true;
        let obj = {
          inId: this.changeOutInId,
          ...this.outPageParams
        };
        let res = await service.getReceiptOutList(obj);
        if (res.pageNo && res.pageNo == 1) {
          this.tableDataTwo = [];
        }
        this.tableDataTwo = res.data;
        this.outPageParams.total = res.total;
        this.loadingTwo = false;
      } catch (error) {
        console.info(error);
        this.loadingTwo = false;
        this.$message.error(error.msg || "获取出库列表失败");
      }
    },
    // 回收票据 重新入库
    async recycleReceipt(row) {
      try {
        this.loadingTwo = true;
        // let receiptIn = {
        //   receiptStartNum: parseInt(row.receiptUsedNum) + 1 || row.receiptStartNum,
        //   receiptStopNum: row.receiptStopNum,
        //   receiptType: row.receiptType,
        //   inType: "5",  // 票据退回入库
        //   divisionCode: row.divisionCode || ''
        // };
        let res = await service.receiptBack(row);
        this.$message({ type: "success", message: "回收成功" });
        this.selectInList();
        this.selectOutList(this.currentData);
        this.loadingTwo = false;
      } catch (error) {
        this.loadingTwo = false;
        this.$message.error(error.msg || "回收失败");
      }
    },
    // 选中领用人员
    setUser(item) {
      this.options.forEach(val => {
        if (val.id == this.formTwo.userId) {
          this.currentUser = { ...val };
        }
      });
    },
    // 拿到收费员
    async getMoneyUserList() {
      try {
        let res = await service.getMoneyUserList();
        this.userList = res.data;
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取收费员信息失败");
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getReceiptInList();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getReceiptInList();
    },
    handleSizeChangeOut(val) {
      this.outPageParams.pageSize = val;
      this.changeRowOutList();
    },
    handleCurrentChangeOut(val) {
      this.outPageParams.pageNo = val;
      this.changeRowOutList();
    }
  }
};
</script>
<style lang="scss" scoped>
.search-area {
  padding: 20px;
  background-color: $l-color-bgcolor-18;
}
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.tableDiv {
  width: 100%;
  height: calc(100% - 300px);
  margin-top: 20px;
  /deep/.el-button--medium {
    padding: 8px 5px;
}
}
.tableDivTwo {
  width: 100%;
  height: calc(100% - 173px);
  margin-top: 20px;
}
.width-dialog {
  width: 300px;
  margin-left: 10px;
  margin-top: 10px;
}
.page {
  text-align: right;
  .el-pagination {
    padding: 0;
    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
</style>