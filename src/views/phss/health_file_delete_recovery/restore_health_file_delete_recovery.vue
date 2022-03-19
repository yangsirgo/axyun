<template>
  <div class="restore">
    <el-form class="FunctionPopup" ref="refForm">
      <main class="table_main center">
        <label
          style="font-size: 20px"
          v-text="this.status=='restore'?'档案恢复':(this.status=='delete'?'档案删除':'')"
        ></label>
        <el-row>
          <el-col :span="3">
            <div class="FunctionPopup_title center lh196">基本信息</div>
          </el-col>
          <el-col :span="21">
            <div class="FunctionPopup_main padding-30">
              <el-row :gutter="20">
                <el-col :span="12" class="flex_cs">
                  <l-formt-title label="姓名" style="width:80%">
                    <el-input v-model="docIndexPO.rsdtName" readonly></el-input>
                  </l-formt-title>
                  <div>
                    <el-button @click="openDiag()" icon="el-icon-plus" circle></el-button>
                  </div>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="性别" class="center">
                   <!-- <el-input
                      v-text="(docIndexPO.gender=='1'?'未知':(docIndexPO.gender=='2'?'男':(docIndexPO.gender=='3'?'女':'')))"
                    /> -->
                    <el-input v-model="docIndexPO.gender" readonly></el-input>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <l-formt-title label="身份证">
                    <el-input v-text="docIndexPO.idNo" />
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="民族" class="center">
                    <el-input v-text="docIndexPO.nation" />
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <l-formt-title label="地址">
                    <el-input v-text="docIndexPO.currentAddress" />
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="档案状态">
                    <el-input
                      v-text="docIndexPO.delFlg=='0'?'正常':(docIndexPO.delFlg=='1'?'删除':'')"
                    />
                  </l-formt-title>
                </el-col>
              </el-row>
            </div>
            <!-- <div class="rowChildren center">
              <el-row>
                <el-col :span="5">
                  <div class="lh20 center">姓名</div>
                </el-col>
                <el-col :span="5">
                  <el-input style="width: 150px" v-text="docIndexPO.rsdtName" />
                  <i class="el-icon-plus" @click="openDiag()"></i>
                </el-col>
                <el-col :span="5">
                  <div class="lh20 center">性别</div>
                </el-col>
                <el-col :span="5">
                  <el-input
                    v-text="(docIndexPO.gender=='1'?'未知':(docIndexPO.gender=='2'?'男':(docIndexPO.gender=='3'?'女':'')))"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="lh20 center">身份证号</div>
                </el-col>
                <el-col :span="5">
                  <el-input v-text="docIndexPO.idNo" />
                </el-col>
                <el-col :span="5">
                  <div class="lh20 center">民族</div>
                </el-col>
                <el-col :span="5">
                  <el-input v-text="docIndexPO.nation" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="lh20 center">地址</div>
                </el-col>
                <el-col :span="5">
                  <el-input v-text="docIndexPO.currentAddress" />
                </el-col>
                <el-col :span="5">
                  <div class="lh20 center">档案状态</div>
                </el-col>
                <el-col :span="5">
                  <el-input v-text="docIndexPO.delFlg=='0'?'正常':(docIndexPO.delFlg=='1'?'删除':'')" />
                </el-col>
              </el-row>
            </div>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="FunctionPopup_title center lh167">操作信息</div>
          </el-col>
          <el-col :span="21">
            <div class="FunctionPopup_main padding-30">
              <el-row :gutter="20">
                <el-col :span="24">
                  <l-formt-title label="档案操作原因说明">
                    <el-input v-model="docIndexPO.optDesc"></el-input>
                  </l-formt-title>
                </el-col>
                <!-- <el-col :span="5">
                  <div class="lh20 center">档案操作原因说明:</div>
                </el-col>
                <el-col :span="15">
                  <el-input v-model="docIndexPO.optDesc" />
                </el-col>-->
              </el-row>
              <el-row>
                <el-col :span="12">
                  <p-lable-input name="操作医生" :val="docIndexPO.optUserName" />
                </el-col>
                <!-- <el-col :span="5">
                  <el-input v-text="docIndexPO.optUserName" />
                </el-col>-->
                <el-col :span="12">
                  <p-lable-input name="操作日期" :val="docIndexPO.optDate" />
                </el-col>
                <!-- <el-col :span="5">
                  <div class="lh20">操作日期</div>
                </el-col>
                <el-col :span="5">
                  <el-input v-text="docIndexPO.optDate" />
                </el-col>-->
              </el-row>
              <el-row>
                <el-col :span="12">
                  <p-lable-input name="操作机构" :val="docIndexPO.optOrg" />
                </el-col>
                <!-- <el-col :span="5">
                  <div class="lh20">操作机构</div>
                </el-col>
                <el-col :span="15">
                  <el-input v-text="docIndexPO.optOrg" />
                </el-col>-->
              </el-row>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
    <div class="docdialog">
      <el-dialog
        title="选择个人信息"
        :visible.sync="this.dialogFormVisible1"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="940px"
        @close="closeDiag"
      >
        <member ref="member" :data="this.status" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDiag">取 消</el-button>
          <el-button type="primary" @click="saveMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import member from "./health_file_delete_member";
import {
  docIndexAllByPage,
  docDeleteRestoreList,
  deleteOrRecover
} from "@/api/phss/health_file_delete_recovery/health_file_delete_recovery";
import { getBasicDetail, getCurrentTime_ } from "@/utils/common";
import { mapGetters } from "vuex";

export default {
  name: "restore",
  components: { member },
  props: ["data"],
  data() {
    return {
      docIndexPO: {
        birthday: "",
        cmntCmtId: "",
        createDocDate: "",
        createDocUserName: "",
        createOrgId: "",
        currentAddress: "",
        delFlg: "",
        digDocNo: "",
        gender: "",
        grid: "",
        id: "",
        idNo: "",
        papDocNo: "",
        responsibleDrId: "",
        responsibleDrName: "",
        rsdtName: "",
        rsdtTypeNormal: "",
        telephone: "",
        nation: "",
        // 档案操作原因
        optDesc: "",
        // 操作医生
        optUserName: "",
        // 操作机构
        optOrg: "",
        // 操作时间
        optDate: "",

        status: ""
      },

      title: "",
      dialogFormVisible1: false
    };
  },
  computed: {
    ...mapGetters("home_doc_status", ["status"])
  },
  created() {
    console.log("恢复this.status", this.status);
    let status = this.status;
    if (status == "restore") {
      this.title = "档案恢复";
    }
    if (status == "delete") {
      this.title = "档案删除";
    }
  },

  mounted() {
    this.docIndexPO = {
      birthday: "",
      cmntCmtId: "",
      createDocDate: "",
      createDocUserName: "",
      createOrgId: "",
      currentAddress: "",
      delFlg: "",
      digDocNo: "",
      gender: "",
      grid: "",
      id: "",
      idNo: "",
      papDocNo: "",
      responsibleDrId: "",
      responsibleDrName: "",
      rsdtName: "",
      rsdtTypeNormal: "",
      telephone: "",
      nation: "",
      // 档案操作原因
      optDesc: "",
      // 操作医生
      optUserName: "",
      // 操作机构
      optOrg: "",
      // 操作时间
      optDate: ""
    };
    let json = getBasicDetail();
    console.info("json", JSON.stringify(json));

    let hos = JSON.parse(json.hos);
    let role = JSON.parse(json.role);
    let userName = json.userName;
    this.docIndexPO.optDate = getCurrentTime_();
    this.docIndexPO.optUserName = userName;
    this.docIndexPO.optOrg = hos.hosName;
  },
  methods: {
    // 返回选中数据
    returnChoosePatient() {
      return this.docIndexPO;
    },

    // val 从子组件中获取到的值
    onChildValue(val) {
      this.index = val;
      console.info("子组件给父组件的值", val);
    },
    saveMethod() {
        let val = this.$refs.member.returnChoosePatient();
        console.info("子组件的val值", JSON.stringify(val));
        this.docIndexPO = val;
        let json = getBasicDetail();
        console.info("json", JSON.stringify(json));

        let hos = JSON.parse(json.hos);
        let role = JSON.parse(json.role);
        let userName = json.userName;
        this.docIndexPO.optDate = getCurrentTime_();
        this.docIndexPO.optUserName = userName;
        this.docIndexPO.optOrg = hos.hosName;
        this.docIndexPO.status = this.status;
        this.dialogFormVisible1 = false;
    },
    openDiag() {
      this.dialogFormVisible1 = true;
      console.info("diagssss", this.status);
    },
    closeDiag() {
      this.dialogFormVisible1 = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.restore {
  .FMListdialog {
    /deep/ .el-dialog {
      width: 100%;
      width: 1200px;
      position: relative;
      margin: 0 auto 0px;
      background: #fff;
      box-sizing: border-box;
      height: 90vh;

      /deep/ .el-dialog__body {
        border-bottom: 1px solid #dcdfe6;
        height: calc(100% - 120px);
        overflow: scroll;
        padding: 30px 60px 0 60px;
      }

      /deep/ .el-dialog__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // padding: 20px;
        text-align: right;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
  .docdialog {
    /deep/.el-dialog {
      width: 100%;
      // width: 1440px;
      position: relative;
      margin: 0 auto 0px;
      background: #fff;
      box-sizing: border-box;
      // height: 80vh;

      /deep/.el-dialog__body {
        border-bottom: 1px solid #dcdfe6;
        background: #000;
        // height: calc(100% - 120px);
        height: 100%;
        overflow: scroll;
        padding: 30px 30px;
      }
      /deep/.el-dialog__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // padding: 20px;
        text-align: right;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
  .opSetting {
    text-align: center;
    margin-top: 30px;
  }

  .spacing {
    margin-top: 10px;
  }

  /******/
  .lh180 {
    height: 180px;
    line-height: 180px;
  }

  .lh60 {
    height: 60px;
    line-height: 60px;
  }

  .lh150 {
    height: 150px;
    line-height: 150px;
  }
}
</style>
