<template>
  <div class="entry">
    <el-card class="entry-cont overflow-scroll-vertical">
      <div class="head">
        <div>
          <i>04</i>床 患者操作
        </div>
        <div class="head-before"></div>
      </div>
      <div class="entry-cards clearfix">
        <el-col :span="6" class="card-item">
          <span class="iconfont iconyizhuguanli"></span>
          <i>看摘要</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span class="iconfont iconyizhuguanli"></span>
          <i>开医嘱</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span class="iconfont iconwenshubianji"></span>
          <i>写病历</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span class="iconfont iconlicizhenduan"></span>
          <i>下诊断</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span class="iconfont icondianzishenqing"></span>
          <i>开申请</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span class="iconfont iconbaogaozhongxin"></span>
          <i>看报告</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span class="iconfont icontiwendan"></span>
          <i>看体温</i>
        </el-col>
        <el-col :span="6" class="card-item">
          <span class="iconfont iconhuizhenshenqing"></span>
          <i>看会诊</i>
        </el-col>
      </div>
      <div class="info">
        <div class>
          <l-anthro-pogram
            :height="patientInfo.height"
            :weight="patientInfo.weight"
            :position="'right'"
          >
            <div style="padding-left: 20px;">
              <div class="label-name">体重指数</div>
              <div class="label-name">
                <i>{{patientInfo.whIndex}} Kg/m2</i>
              </div>
              <div class="label-name">尿酸</div>
              <div class="label-name">
                <i>{{patientInfo.uricAcid}} Kg/m2</i>
              </div>
              <div class="label-name">空腹血糖</div>
              <div class="label-name">
                <i>{{patientInfo.bloodSugar}} Kg/m2</i>
              </div>
            </div>
          </l-anthro-pogram>
        </div>
        <div class="clearfix">
          <el-col :span="12">
            <div class="label-name">
              床号
              <i>{{patientInfo.bedNum}}床</i>
            </div>
            <div class="label-name">
              姓名
              <i>{{patientInfo.patientName}}</i>
            </div>
            <div class="label-name">
              年龄
              <i>{{patientInfo.patientAge}}</i>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="label-name">
              住院号
              <i>{{patientInfo.adNum}}</i>
            </div>
            <div class="label-name">
              性别
              <i>{{patientInfo.patientGender==1?'男':'女'}}</i>
            </div>
            <div class="label-name">
              科室
              <i>{{patientInfo.deptName}}</i>
            </div>
          </el-col>
        </div>
        <div style="padding-top: 10px">
          <div class="label-name">
            身份证号
            <i>{{patientInfo.identificationNum}}</i>
          </div>
          <div class="label-name">
            电话号码
            <i>{{patientInfo.phoneNum}}</i>
          </div>
          <div class="label-name">
            入院日期
            <i>{{patientInfo.wdeptAdmissionTime}}</i>
          </div>
          <div class="label-name">
            入院诊断
            <i>{{patientInfo.admissionDiag}}</i>
          </div>
          <div class="label-name">
            主治医生
            <i>{{patientInfo.manageDoctorName}}</i>
          </div>
          <div class="label-name">
            护理级别
            <i v-if="patientInfo.nursingLevel == '1' ">Ⅰ级护理</i>
            <i v-if="patientInfo.nursingLevel == '2' ">Ⅱ级护理</i>
            <i v-if="patientInfo.nursingLevel == '3' ">Ⅲ级护理</i>
            <i v-if="patientInfo.nursingLevel == '4' ">特级护理</i>
          </div>
          <div class="label-name">
            医保类型
            <i>{{patientInfo.insuranceType}}</i>
          </div>
        </div>
        <div style="padding-top: 10px">
          <div class="label-name">
            预交金
            <i>{{patientInfo.selfPayPrepay}}</i>
          </div>
          <div class="label-name">
            费用合计
            <i class="main-color">{{patientInfo.freeSum}}</i>
          </div>
          <div class="label-name">
            自费金额
            <i class="main-color">{{patientInfo.selfPayAmount}}</i>
          </div>
          <div class="label-name">
            过敏史
            <i class="main-color">{{patientInfo.allergyName}}</i>
          </div>
          <div class="label-name">
            其他情况
            <i>{{patientInfo.other}}</i>
          </div>
        </div>
      </div>
    </el-card>
    <!--打印腕带-->
    <el-dialog title="打印预览（小腕带）" :visible.sync="printWristbandVisible" width="800px">
      <div class="print-content-box">
        <ul>
          <li v-for="item in wristbandList" :key="item.bedNum">
            <p>
              <span class="black em">{{item.bedNum}}床</span>
              <span class="black em">{{item.patientName}}</span>
              <span class="black em">{{item.patientGender}}</span>
              <span class="black em">{{item.ageInfo}}</span>
              <span class="gray">科室</span>
              <span class="black">{{item.deptName}}</span>
              <span class="gray">住院号</span>
              <span class="black">{{item.adNum}}</span>
            </p>
            <p>
              <img :src="item.qrCode" alt />
            </p>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="border-radius: 2px;" @click="printWristband">打 印</el-button>
        <el-button
          style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
          @click="printWristbandVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!--打印床头卡-->
    <el-dialog title="打印预览（床头卡）" :visible.sync="bedCardDialogVisible" width="800px">
      <div class="bed-card-info">
        <div class="info">
          <table cellspacing="0" style="width: 440px;border-color: #E4E4E4;height: 204px;">
                          <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
            <tr>
              <td colspan="4">08床 黄逸夫 男 32岁</td>
            </tr>
            <tr>
              <td>入院时间</td>
              <td>{{this.bedCardInfo.finAdmissionTime}}</td>
              <td>科室</td>
              <td>{{this.bedCardInfo.deptName}}</td>
            </tr>
            <tr>
              <td>住院号</td>
              <td>{{this.bedCardInfo.adNum}}</td>
              <td>饮食</td>
              <td>普食</td>
            </tr>
            <tr>
              <td>过敏史</td>
              <td></td>
              <!-- TODO 过敏史暂无 -->
              <td>护理级别</td>
              <td>特级</td>
            </tr>
            <tr>
              <td>主治医生</td>
              <td>谢远林</td>
              <td>主管护士</td>
              <td>刘玲</td>
            </tr>
          </table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="border-radius: 2px;" @click="printBedCard()">打 印</el-button>
        <el-button
          style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
          @click="bedCardDialogVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!--转科-->
    <el-dialog title="转科操作" :visible.sync="changeSectionDialogVisible" width="450px">
      <div class="change-section">
        <div class="base-info">
          <span>05床</span>
          <span>刘明海</span>
          <span>男</span>
          <span>22岁</span>
        </div>
        <div>
          <l-formt-title label="选择目标科室" labelWidth="96">
            <el-select v-model="deptTarget" placeholder>
              <el-option
                v-for="item in deptNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </l-formt-title>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="border-radius: 2px;" @click="changeSectionConfirm">确认转科</el-button>
        <el-button
          style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
          @click="changeSectionDialogVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!--转床-->
    <el-dialog title="转床操作" :visible.sync="changeBedDialogVisible" width="450px">
      <div class="change-section">
        <div class="base-info">
          <span>05床</span>
          <span>刘明海</span>
          <span>男</span>
          <span>22岁</span>
        </div>
        <div>
          <l-formt-title label="选择目标床位" labelWidth="96">
            <el-select v-model="deptTarget" placeholder>
              <el-option
                v-for="item in deptNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </l-formt-title>
        </div>
        <div v-if="changeBedTip" style="color: #E1140A;line-height: 60px;">6床有患者，请选择空床！</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="border-radius: 2px;" @click="changeBedConfirm">确认转床</el-button>
        <el-button
          style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
          @click="changeBedDialogVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!--包床-->
    <el-dialog title="7床包床的操作" :visible.sync="bedContractDialogVisible" width="450px">
      <div class="change-section">
        <div style="margin-top: 20px;">
          <l-formt-title label="选择包床患者" labelWidth="96">
            <el-select v-model="deptTarget" placeholder>
              <el-option
                v-for="item in deptNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </l-formt-title>
        </div>
        <h3 style="color: #2E323A;">床位费变化</h3>
        <el-timeline style="margin-top: 20px;margin-bottom: 50px;">
          <el-timeline-item>当前20元/天</el-timeline-item>
          <el-timeline-item>
            包床后40元/天
            <div style="position: absolute;left: 150px;top: -6px;line-height: 24px;color: #3D7DFB;">
              <p>普通床位(20元/天)</p>
              <p>+ 普通床位(20元/天)</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="border-radius: 2px;" @click="bedContractConfirm">确认包床</el-button>
        <el-button
          style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
          @click="bedContractDialogVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!--撤销包床-->
    <el-dialog title="7床包床的操作" :visible.sync="cancelBedContractDialogVisible" width="450px">
      <div class="change-section">
        <div
          style="line-height: 64px;border-bottom: 1px solid #E4E4E4;color: #2E323A;font-size: 14px;"
        >
          <span style="color: #949DA3;">选择包床患者</span> 05床 刘明海 男 22岁
        </div>
        <h3 style="color: #2E323A;">床位费变化</h3>
        <el-timeline style="margin-top: 20px;margin-bottom: 50px;">
          <el-timeline-item>当前20元/天</el-timeline-item>
          <el-timeline-item>
            包床后40元/天
            <div style="position: absolute;left: 150px;top: -6px;line-height: 24px;color: #3D7DFB;">
              <p>普通床位(20元/天)</p>
              <p>+ 普通床位(20元/天)</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="border-radius: 2px;" @click="cancelBedContractConfirm">确认撤销</el-button>
        <el-button
          style="border-radius: 2px;border-color:#F05A23;color:#F05A23;"
          @click="cancelBedContractDialogVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LAnthroPogram from "@/components/LAnthroPogram";
import { getPatientChange } from "@/api/cis/resident/resident";

export default {
  name: "right",
  components: {
    LAnthroPogram
  },
  data() {
    return {
      patientInfo: {
        // 患者基本信息
        height: "1", // 身高
        weight: "1", // 体重
        whIndex: "1", // 体重指数
        uricAcid: 200, // 尿酸值
        bloodSugar: 100, // 空腹血糖
        bedNum: "01", // 床号
        patientName: "1", // 患者姓名
        patientAge: 22, // 年龄
        adNum: "9527", // 住院号
        patientGender: "女", // 性别
        wdeptAdmissionTime: "",
        deptName: "内科", // 科室
        identificationNum: "1203920394747333", // 身份证号
        phoneNum: "19387373390", // 电话号码
        finAdmissionTime: "2019-07-17", // 入院日期
        days: "30", // 入院天数
        admissionDiag: "肾结石", // 入院诊断
        manageDoctorName: "杨阳洋", // 主治医生
        nursingLevel: "普通", // 护理级别
        insuranceType: "本事城镇职工基本医疗保险", // 医保类型
        selfPayPrepay: "500", // 预交金
        freeSum: "1000.00", // 费用合计
        selfPayAmount: "100.00", // 自费
        allergyName: "紫外线过敏", // 过敏史
        other: "无" // 其他情况
      },
      printWristbandVisible: false, // 控制腕带打印diaglog显示
      wristbandList: [
        // 打印腕带列表
        {
          bedNum: "01", // 床位
          patientName: "李二牛", // 患者姓名
          patientGender: "男", // 性别
          ageInfo: "22", // 年龄
          deptName: "内科", // 科室
          adNum: "9527", // 住院号
          qrCode: "" // 腕带二维码地址
        }
      ],
      bedCardDialogVisible: false, // 控制打印床头卡diaglog显示
      bedCardInfo: {
        finAdmissionTime: "2019-06-19", // 入院时间
        deptName: "内科", // 科室
        adNum: "9527" // 住院号
      },
      changeSectionDialogVisible: false, // 控制转科操作diaglog显示
      deptTarget: "", // 目标科室
      deptNameList: [
        // 科室列表
        {
          label: "神经内科",
          value: 1
        },
        {
          label: "耳鼻喉科",
          value: 2
        }
      ],
      changeBedDialogVisible: false,
      changeBedTip: false, // 该床位是否已有患者
      bedContractDialogVisible: false, // 控制包床操作diaglog显示
      cancelBedContractDialogVisible: false // 撤销包床
    };
  },
  /*created() {
      var param = this.$route.query.param;
      this.patientInfo = param;
      alert(this.patientInfo);
    },*/
  methods: {
    printWristband() {
      // 确认打印腕带
    },
    printBedCard() {
      // 确认打印床头卡
    },
    changeSectionConfirm() {
      // 确认转科
      const canChangeSection = false;
      let num = 3;
      /* if (canChangeSection) {
        // 可转科
      } */
      if (!canChangeSection) {
        // 有未处理医嘱
        this.$confirm(
          `<div><p>患者有${num}条未停医嘱</p><p style="color: #3D7DFB">你需要先处理完患者医嘱，才能转科。</p></div>`,
          "",
          {
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: "warning",
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            this.$message({
              type: "success",
              message: "处理!"
            });
            this.changeSectionDialogVisible = false;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消"
            });
            this.changeSectionDialogVisible = false;
          });
      }
    },
    changeBedConfirm() {
      // 确认转床
      this.changeBedTip = true;

      /* if (true) {
        this.changeBedTip = true;
      } else {
        this.$message.success("转床成功");
      } */
    },
    bedContractConfirm() {
      // 确认包床
      this.$alert("请及时对包床费用处理", "包床成功", {
        confirmButtonText: "确定",
        callback: action => {
          this.bedContractDialogVisible = false;
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    },
    cancelBedContractConfirm() {
      // 撤销包床
      this.$alert("请及时对包床费用处理", "撤销包床成功", {
        confirmButtonText: "确定",
        callback: action => {
          this.cancelBedContractDialogVisible = false;
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.head {
  height: 24px;
  margin-bottom: 20px;
  font-size: 16px;
  
  font-weight: 500;
  color: $l-color-fontcolor-3;
  line-height: 24px;
  position: relative;
  left: 35px;

  i {
    font-size: 28px;
    
    font-weight: bold;
    font-style: normal;
  }

  .head-before {
    width: 4px;
    height: 20px;
    background: $l-color-primary;
    position: absolute;
    left: -10px;
    top: 0;
  }
}

.entry {
  width: 100%;
  height: 100%;
  .entry-cont {
    width: 100%;
    height: 100%;
    padding: 20px 0;

    .entry-cards {
      padding-left: 6px;

      .card-item {
        width: 56px;
        height: 58px;
        margin-left: 14px;
        margin-bottom: 14px;
        background: $l-color-bgcolor-18;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        span {
          width: 16px;
          height: 16px;
          font-size: 16px;
          color: $l-color-primary;
          margin-top: 10px;
          display: inline-block;
        }

        i {
          margin-top: 8px;
          text-align: center;
          font-style: normal;
          font-size: 12px;
          
          font-weight: 400;
          color: $l-color-fontcolor-3;
          display: block;
        }
      }
    }

    .info {
      margin: 5px 20px;
      padding-top: 10px;
      border-top: 1px solid $l-color-bgcolor-11;

      .label-name {
        margin-top: 10px;
        font-size: 14px;
        
        font-weight: 400;
        color: $l-color-fontcolor-4;

        i {
          font-style: normal;
          
          color: $l-color-fontcolor-3;
        }

        .main-color {
          color: $l-color-primary;
        }
      }
    }
  }
}
/*
    转科
  */
.change-section {
  padding: 0 20px;
  .base-info {
    line-height: 64px;
    span {
      font-weight: bold;
      color: $l-color-fontcolor-3;
      margin-right: 10px;
      font-size: 16px;
    }
  }
}

/*
    床头卡
  */
.bed-card-info {
  margin-top: 30px;
  margin-left: 20px;
  .info {
    margin-top: 10px;

    table {
      border: 1px solid #e4e4e4;

      tr {
        td {
          border-top: 1px solid #e4e4e4;
          border-right: 1px solid #e4e4e4;
          padding: 0 10px;
          font-size: 14px;
        }

        td:last-child {
          border-right: none;
        }

        td:first-child,
        td:nth-child(3) {
          width: 86px;
          color: #949da3;
        }

        td:nth-child(2),
        td:nth-child(4) {
          width: 148px;
          color: #2e323a;
        }
      }

      tr:first-child td {
        font-weight: 600;
        text-align: center;
        color: #2e323a;
        border: none;
      }
    }
  }
}
/*
    腕带
  */
.print-content-box {
  // border-top: 1px solid #E4E4E4;
  ul {
    li {
      height: 70px;
      border: 1px solid #e4e4e4;

      p {
        margin: 0;
        padding-left: 20px;
        line-height: 70px;
        float: left;
        span {
          padding: 0 5px;
        }

        .black {
          color: #2e323a;
        }

        .gray {
          color: #949da3;
        }

        .em {
          font-weight: 600;
        }

        img {
          width: 60px;
        }
      }
      p:last-child {
        float: right;
      }
    }
  }
}
</style>
