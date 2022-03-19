<template>
  <div class="width100 height100 useSelect">
    <l-card-title>
      <span slot="left">出库记录查询</span>
    </l-card-title>
    <div class="search-area">
      <el-form class="form-area" :model="form" ref="form" :rules="rulesInit">
        <el-row :gutter="20" class="width100">
          <el-col :span="5">
            <LFormtTitle label="出库类型">
              <el-form-item prop="outType">
                <l-value-domain :value.sync="form.outType" code="OUT_TYPE" clearable />
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <LFormtTitle label="票据类型">
              <el-form-item prop="receiptType">
                <l-value-domain code="RECEIPT_TYPE" :value.sync="form.receiptType" clearable />
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <LFormtTitle label="终止标识">
              <el-form-item prop="abortStatus">
                <el-select v-model="form.abortStatus" placeholder="请选择" clearable class="width100">
                  <el-option
                    v-for="item in abortStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="4">
            <LFormtTitle label="票据号">
              <el-form-item prop="receiptNum">
                <el-input
                  type="text"
                  v-model="form.receiptNum"
                  placeholder="请输入"
                  style="width:100%"
                  clearable
                ></el-input>
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <LFormtTitle label="出库时间" :required="false">
              <el-form-item prop="date">
                <el-date-picker
                  style="width:100%"
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getDate"
                  clearable
                ></el-date-picker>
              </el-form-item>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="margin-top-20 width100">
          <el-col :span="5">
            <LFormtTitle label="院区">
              <el-form-item prop="divisionCode">
                <l-value-domain
                  code="DIVISION_CODE"
                  :value.sync="form.divisionCode"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <LFormtTitle label="领用人员">
              <el-form-item prop="receiveUserId">
                <!-- <l-value-domain
                :value.sync="form.receiveUserId"
                remoteUrl="/wadmin/dept-user/119/2"
                :remoteParams="''"
                remoteShowKey="uname"
                remoteValueKey="uid"
                placeholder="请选择"
                clearable
                />-->
                <el-select
                  v-model="form.receiveUserId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="姓名/拼音/五笔"
                  :remote-method="selectAllUser"
                  :loading="selLoading"
                  clearable
                  class="width100"
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
          <el-col :span="5">
            <LFormtTitle label="出库人员">
              <el-form-item prop="outUserId">
                <!-- <l-value-domain
                :value.sync="form.outUserId"
                remoteUrl="/wadmin/dept-user/119/2"
                :remoteParams="''"
                remoteShowKey="uname"
                remoteValueKey="uid"
                placeholder="请选择"
                clearable
                />-->
                <el-select
                  v-model="form.outUserId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="姓名/拼音/五笔"
                  :remote-method="selectAllUser"
                  :loading="selLoading"
                  clearable
                  class="width100"
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
          <el-col :span="4">
            <LFormtTitle label="使用人员">
              <el-form-item prop="useUserId">
                <!-- <l-value-domain
                :value.sync="form.outUserId"
                remoteUrl="/wadmin/dept-user/119/2"
                :remoteParams="''"
                remoteShowKey="uname"
                remoteValueKey="uid"
                placeholder="请选择"
                clearable
                />-->
                <el-select
                  v-model="form.useUserId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="姓名/拼音/五笔"
                  :remote-method="selectAllUser"
                  :loading="selLoading"
                  clearable
                  class="width100"
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
          <el-col :span="5">
            <LFormtTitle label="使用状态">
              <el-form-item prop="recordStatus">
                <el-select v-model="form.recordStatus" placeholder="请选择" clearable class="width100">
                  <el-option
                    v-for="item in recordStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </LFormtTitle>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-cont float-right">
        <el-button type="primary" @click="selectList">查询</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>

    <div class="table-cont">
      <el-table
        :data="tableData"
        width="100%"
        height="calc(100% - 58px)"
        stripe
        border
        v-loading="loading"
        :element-loading-text="$t('retreat.loadInfo')"
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
            <template v-else-if="item.prop == 'outType'">
              <span :val="scope.row['outType']" code="OUT_TYPE" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'abortStatus'">
              <span>{{scope.row[item.prop] == '1'?'已终止':'未终止'}}</span>
            </template>
            <template v-else-if="item.prop == 'divisionCode'">
              <span :val="scope.row['divisionCode']" code="DIVISION_CODE" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'abortStatus'">
              <span>{{scope.row['abortStatus'] == '1'?'停用':'启用'}}</span>
            </template>
            <!-- <template v-else-if="item.prop == 'operate'">
              <el-button type="text" @click="openDialog(scope.row,scope.$index,'1')">作废</el-button>
              <el-button type="text" @click="openDialog(scope.row,scope.$index,'2')">退回来源地</el-button>
            </template>-->
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
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
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
      append-to-body>
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
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};
import { getMacLoaction } from "@/utils/print";

export default {
  data() {

     var valNumber = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };

    return {
      // loading
      loading: false,
      date: [],
      // 查询表单
      form: {
        outType: "",
        receiptType: "",
        abortStatus: "",
        receiptNum: "",
        divisionCode: "",
        receiveUserId: "",
        recordStatus: ""
      },
      // 表格数据
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "operate",
          label: "快捷操作",
          align: "left",
          headerAlign: "center",
          width: "80"
        },
        {
          prop: "divisionCode",
          label: "院区",
          align: "left",
          width: "100"
        },
        {
          prop: "receiptType",
          label: "票据类型",
          align: "left",
          width: "80"
        },
        {
          prop: "outType",
          label: "出库类型",
          align: "left",
          width: "80"
        },
        {
          prop: "abortStatus",
          label: "终止标志",
          align: "left",
          width: "80"
        },
        {
          prop: "receiveUserName",
          label: "领用人员",
          align: "left",
          width: "100"
        },
        {
          prop: "useUserName",
          label: "使用人员",
          align: "left",
          width: "80"
        },
        {
          prop: "useMacLoaction",
          label: "设备mac",
          align: "left",
          width: "150"
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
          width: "100"
        },
        {
          prop: "receiptStopNum",
          label: "终止票据号",
          align: "left",
          width: "100"
        },
        {
          prop: "receiptUsedNum",
          label: "已用票据号",
          align: "left",
          width: "100"
        },
        {
          prop: "useQuantity",
          label: "剩余可用张数",
          align: "left",
          width: "120"
        },
        {
          prop: "abortStatus",
          label: "使用状态",
          align: "left",
          width: "80"
        },
        {
          prop: "outUserName",
          label: "出库人员",
          align: "left",
          width: "100"
        },
        {
          prop: "outTime",
          label: "领用出库时间",
          align: "left",
          width: "165"
        }
      ],
      // 状态列表
      abortStatusList: [
        {
          label: "未终止",
          value: "0"
        },
        {
          label: "已终止",
          value: "1"
        }
      ],
      recordStatus: [
        {
          label: "启用",
          value: "1"
        },
        {
          label: "停用",
          value: "2"
        }
      ],
      // 收费员列表
      userList: [],
      // 分页in
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0
      },
      // 人员集合
      options: [],
      selLoading: false,
      // 使用人信息
      useUserInfo: {},
      openUseUserInfo: false,
      openDataInfo: {},
      rulesInit: {
        receiptNum: [{ validator: valNumber, trigger: "blur" }]
      },
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
  props: ["inBillForm"],
  watch: {
    inBillForm: {
      handler(val) {
        this.form = {
          ...this.form,
          ...val
        };
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.search();
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
    // 选选择日期
    getDate() {},
    load() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.search();
    },
    // 取消
    cancel() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        this.date = [];
      });
      this.selectList();
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

    // 得到出库列表
    async search() {
      try {
        // 当前选中入库票据
        this.loading = true;
        let obj = {
          ...this.pageParams,
          ...this.form
        };
        if (this.date && this.date.length > 1) {
          obj.startDate = this.date[0].toLocaleStr() + " 00:00:00";
          obj.stopDate = this.date[1].toLocaleStr() + " 23:59:59";
        }
        let res = await service.getReceiptOutList(obj);
        // this.tableData.push(...res.data);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "获取出库列表失败");
      }
    },
    // 查询
    async selectList() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.pageParams.pageNo = 1;
          this.tableData = [];
          this.search();
        } else {
          return false;
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
    // 启用停用
    async updateReceipt(row, status) {
      try {
        this.$showLoading();
        let res = await service.updateReceiptOut({
          outId: row.outId,
          recordStatus: status,
          useUserName: this.useUserInfo.useUserName || undefined,
          useUserId: this.useUserInfo.useUserId || undefined,
          useTime: new Date(),
          useMacLoaction:this.currentMac
        });
        this.$message({ type: "success", message: "操作成功" });
        this.selectList();
        this.macHandleClose();
        this.openUseUserInfo = false;
        this.useUserInfo = {};
        this.$hideLoading();
      } catch (error) {
        this.useUserInfo = {};
        this.openUseUserInfo = false;
        this.$hideLoading();
        this.$message.error(error.msg || "操作失败");
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.search();
    }
  }
};
</script>
<style lang="scss" scoped>
.useSelect {
  padding: 0 10px 10px 10px;
}
.search-area {
  // padding: 20px;
  display: flex;
  // background-color: $l-color-bgcolor-18;
  .form-area {
    margin-right: 20px;
    flex: 1;
  }
}
.table-cont {
  height: calc(100% - 168px);
  margin-top: 20px;
}
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
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
