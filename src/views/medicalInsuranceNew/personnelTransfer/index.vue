<template>
  <el-card class="personnelTransfer height100">
    <div class="form-area">
      <el-row :gutter="10">
        <el-col :span="5">
          <SZReadCard
            @cardInfo="cardInfoHandler"
            @patientInsurenceData="patientInsurenceData"
          ></SZReadCard>
        </el-col>
        <el-col :span="6">
          <LFormtTitle label="登记时间">
            <el-date-picker
              v-model="form.date"
              type="daterange"
              value-format="yyyyMMdd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-date-picker>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="联系电话">
            <el-input v-model="form.tel"></el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="登记状态">
            <el-select v-model="form.recordStatus">
              <el-option
                v-for="(item, index) in recordStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="转院名称">
            <el-input v-model="form.rmName"></el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="4">
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="add">登记</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-cont">
      <l-table
        :showTotal="false"
        :pageSize="pagination.pageSize"
        :page="pagination.pageNo"
        :total="pagination.totalData"
        :background="false"
        layout="sizes,prev,pager,next,jumper,total"
        paginationAlign="right"
        @changeSize="changeSize"
      >
        <el-table :data="tableData" border width="100%" height="100%">
          <el-table-column
            v-for="(item, index) in personnelTransferColumns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'operate'">
                <el-button type="text" @click="editReg(scope.row)"
                  >修改</el-button
                >
                <el-button type="text" @click="cancelReg(scope.row)"
                  >撤销</el-button
                >
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </l-table>
    </div>
    <el-dialog
      title="登记"
      :visible.sync="centerDialogVisible"
      width="60%"
      center
    >
      <addForm
        ref="addForm"
        v-if="centerDialogVisible"
        :formEdit="formEdit"
        @addCloseFuc="addCloseFuc"
      ></addForm>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFuc">确定</el-button>
        <el-button type="primary" plain @click="centerDialogVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="撤销"
      :visible.sync="cancelDialogVisible"
      width="60%"
      center
    >
      <l-formt-title label="原因" :isMultiRow="true">
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 2, maxRows: 3 }"
          v-model="memo"
          maxlength="150"
        ></el-input>
      </l-formt-title>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelRegSure">确定</el-button>
        <el-button type="primary" plain @click="cancelDialogVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import SZReadCard from "../components/SZReadCard.vue";
import addForm from "./addForm.vue";
import { personnelTransferColumns } from "../common/personnelTransfer.js";
import service from "@/api/medicalInsuranceNew/personnelTransfer.js";

export default {
  name: "personnelTransfer",
  components: {
    SZReadCard,
    addForm,
  },
  data() {
    return {
      patientInsurenceInfo: {
        siPatientDto: {},
      },
      recordStatusList: [
        {
          label: "未登记",
          value: "0",
        },
        {
          label: "已登记",
          value: "1",
        },
      ],
      form: {
        date: [
          this.dayjs(new Date()).format("YYYYMMDD"),
          this.dayjs(new Date()).format("YYYYMMDD"),
        ],
      },
      pagination: {
        pageSize: 20,
        pageNo: 1,
        totalData: 0,
      },
      tableData: [],
      centerDialogVisible: false,
      formEdit: {},
      cancelDialogVisible: false,
      memo: "",
    };
  },
  computed: {
    personnelTransferColumns() {
      return personnelTransferColumns;
    },
  },
  created() {
    this.search();
  },
  methods: {
    cardInfoHandler(data) {},
    patientInsurenceData(data) {
      this.patientInsurenceInfo = {
        siPatientDto: {},
      };
      if (data.hasOwnProperty("siPatientDto")) {
        this.patientInsurenceInfo = { ...data };
      }
    },
    search() {
      this.pagination.pageNo = 1;
      this.loadTable();
    },
    async loadTable() {
      this.tableData = [];
      this.pagination.totalData = 0;
      this.$showLoading();
      let params = {
        psnNo: this.patientInsurenceInfo.siPatientDto.patientCode || "",
        psnName: this.patientInsurenceInfo.siPatientDto.patientName || "",
        tel: this.form.tel,
        recordStatus: this.form.recordStatus,
        rmName: this.form.rmName,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      if (this.form.date && this.form.date.length) {
        params.beginTime = this.form.date[0] + "000000";
        params.endTime = this.form.date[1] + "235959";
      }
      try {
        let res = await service.changeHosFind(params);
        if (res.code == 1) {
          this.tableData = res.data;
          this.pagination.totalData = res.total;
        }
      } catch (error) {
      } finally {
        this.$hideLoading();
      }
    },
    changeSize(val) {
      this.pagination.pageNo = val.page;
      this.pagination.pageSize = val.pageSize;
      this.loadTable();
    },
    add() {
      this.formEdit = {};
      this.centerDialogVisible = true;
    },
    editReg(data) {
      this.formEdit = { ...data };
      this.centerDialogVisible = true;
    },
    cancelReg(data) {
      this.formEdit = { ...data };
      this.memo = "";
      this.cancelDialogVisible = true;
    },
    // 撤销
    async cancelRegSure() {
      if (!this.memo) {
        this.$message.warning("请输入撤销原因再进行撤销！");
        return;
      }
      this.$showLoading();
      try {
        let params = {
          memo: this.memo,
          trtDclaDetlSn: this.formEdit.trtDclaDetlSn,
          psnNo: this.formEdit.psnNo,
        };
        let res = await service.cancalChangeRecord(params);
        if (res.code === 1) {
          this.$message.success("撤销成功！");
          this.cancelDialogVisible = false;
          this.search();
        }
      } catch (error) {
      } finally {
        this.$hideLoading();
      }
    },
    addFuc() {
      this.$refs.addForm && this.$refs.addForm.addFuc();
    },
    addCloseFuc() {
      this.centerDialogVisible = false;
      this.search();
    },
    dataooo() {
      let data = ``
    }
  },
};
</script>
<style lang="scss" scoped>
.personnelTransfer {
  padding: 10px;
  .form-area {
    margin-bottom: 10px;
  }
  .table-cont {
    height: calc(100% - 44px);
  }
}
</style>