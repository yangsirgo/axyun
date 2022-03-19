<template>
  <div class="hd-tree height100" id="mainTree" v-loading="recordTreeLoading">
    <div v-if="!showMrHomepage" class="top-btn">
      <!-- 暂时隐藏 -->
      <!-- <div class="lit-div">
        <el-tooltip effect="light" content="新建" placement="bottom">
          <el-button
            icon="iconfont iconxinzeng"
            class="little-button"
            @click="create"
            :disabled="disableTimeControl"
          ></el-button>
        </el-tooltip>
      </div> -->
      <div class="lit-div">
        <el-tooltip effect="light" content="复制" placement="bottom">
          <el-button
            icon="iconfont iconfuzhidaochangqi"
            class="little-button"
            @click="copy"
            :disabled="disableTimeControl"
          ></el-button>
        </el-tooltip>
      </div>
      <div class="lit-div">
        <el-tooltip effect="light" content="删除" placement="bottom">
          <el-button
            icon="iconfont iconshanchu"
            class="little-button"
            @click="del"
            :disabled="disableTimeControl"
          ></el-button>
        </el-tooltip>
      </div>
      <div class="lit-div">
        <el-tooltip effect="light" content="属性" placement="bottom">
          <el-button
            icon="iconfont iconshuxing"
            class="little-button"
            @click="showProp"
            :disabled="disableTimeControl"
          ></el-button>
        </el-tooltip>
      </div>
      <div class="lit-div">
        <el-tooltip effect="light" content="刷新" placement="bottom">
          <el-button
            icon="iconfont iconshuaxin"
            class="little-button"
            @click="refresh"
            :disabled="disableTimeControl"
          ></el-button>
        </el-tooltip>
      </div>

      <!-- <div style="clear: both"></div> -->
      <div class="lit-div">
        <el-tooltip effect="light" content="收起" placement="bottom">
          <el-button
            icon="iconfont el-icon-arrow-left"
            class="little-button"
            @click="pickUp"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <div style="margin: 10px" :style="{ height: autoHeight }">
      <div style="height: 100%; overflow: auto">
        <el-switch
          style="display: block"
          v-model="activeName"
          @change="switchChange"
          active-color="#409eff"
          inactive-color="#13ce66"
          inactive-text="分类"
          active-text="时间"
        />

        <div v-show="!activeName" class="" style="margin-top: 10px">
          <el-tree
            id="insTree"
            ref="docTree"
            node-key="mrId"
            default-expand-all
            :data="tree"
            :props="defaultProps"
            :highlight-current="true"
            :render-content="renderContent"
            @node-click="handleNodeClick"
          >
          </el-tree>
        </div>
        <div v-show="activeName" style="margin-top: 10px">
          <div
            v-if="showMrHomepage"
            style="width: 100%; height: 100%; cursor: pointer; padding: 0 10px"
            :class="{ activeClass: mrItemClickFlag }"
            @click="handleTimeFirstClick"
          >
            <div style="font-size: 16px; line-height: 28px; font-weight: 700">
              {{ this.diagnosis.enTpCd == "04" ? mrTitle : "" }}
            </div>
          </div>
          <el-timeline>
            <el-timeline-item
              placement="top"
              v-for="(activity, index) in newdataList"
              :key="index"
              :color="activity.color"
              :timestamp="activity.timestamp"
            >
              <div
                style="
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                  padding: 0 10px;
                "
                :class="{
                  activeClass: activity.node.mrId == currentTimeline,
                }"
                @click="handleTimeLineClick(activity)"
              >
                <div
                  style="font-size: 16px; line-height: 28px; font-weight: 700"
                >
                  {{ activity.content }}
                </div>
                <div style="line-height: 24px">{{ activity.writeName }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
    <div
      style="
        position: absolute;
        bottom: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
      "
    >
      <div>
        <span class="status-span"
          ><div style="background-color: #44c264" class="dot"></div>
          <p>编辑</p></span
        >
      </div>
      <div>
        <span class="status-span"
          ><div style="background-color: #f7a820" class="dot"></div>
          <p>维护</p></span
        >
      </div>
      <div>
        <span class="status-span"
          ><div style="background-color: #134796" class="dot"></div>
          <p>提交</p></span
        >
      </div>
      <div>
        <span class="status-span"
          ><div style="background-color: #e1140a" class="dot"></div>
          <p>审签</p></span
        >
      </div>
      <div>
        <span class="status-span"
          ><div style="background-color: #a6a6a6" class="dot"></div>
          <p>质控</p></span
        >
      </div>
    </div>
    <el-dialog
      title="新建病历"
      append-to-body
      :visible.sync="dialogVisible"
      width="1134px"
    >
      <div style="height: 520px; border-top: #e4e4e4 solid 1px">
        <create-emr
          ref="createEmr"
          v-if="dialogVisible"
          :isHome="isHome"
          :visitType="modeType === 'zhuyuan' ? '04' : '01'"
          :dnFlag="dnFlag"
          :classValMsg="classValMsg"
          @rowDbClick="handleRowDbClick"
        ></create-emr>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="myBtn" type="primary" @click="handleDetermine"
          >确定</el-button
        >
        <el-button class="myBtn" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="属性" :visible.sync="propVisible" width="711px">
      <div style="height: 180px; margin: 10px 10px 0px 10px">
        <el-row>
          <span>病历名称</span>
          <el-input
            v-model="emrName"
            style="width: 560px"
            :disabled="pDisable"
          ></el-input>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <span>文书类型</span>
            <el-input
              v-model="insType"
              style="width: 240px"
              :disabled="true"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <span>业务时间</span>
            <el-date-picker
              v-model="businessTime"
              :clearable="false"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              style="width: 240px"
              placeholder="选择日期时间"
              :disabled="pDisable"
            >
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <span>提交时间</span>
            <el-date-picker
              v-model="submitTime"
              :clearable="false"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              style="width: 240px"
              :disabled="true"
            ></el-date-picker>
          </el-col>
          <el-col :span="12">
            <span style="margin-left: 1em">提交人</span>
            <el-input
              v-model="submitor"
              style="width: 240px"
              :disabled="true"
            ></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <span>模板名称</span>
            <el-input
              v-model="tempType"
              style="width: 240px"
              :disabled="true"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <span>所属科室</span>
            <el-input
              v-model="dept"
              style="width: 240px"
              :disabled="true"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="myBtn" type="primary" @click="propDetermine"
          >确定</el-button
        >
        <el-button class="myBtn" @click="propVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import createEmr from "./createEmr";
import { receiveVisitRecord } from "@/api/cis/visit/visit.js";

import {
  getTree,
  attributeQuery,
  modifyAttribute
} from "@/api/emrRecord/emr/instrument";
import { checkQcDepend } from "@/api/emrRecord/qc";

import { getUId, getUN } from "@/utils/crypto";
import { getRole, getPamars } from "@/utils/auth";
export default {
  components: {
    createEmr
  },
  name: "insTree",
  props: {
    dnFlag: String,
    showMrHomepage: Boolean, //集成病历
    modeType: {
      type: String,
      default: ""
    },
    disableTimeControl: {
      type: Boolean,
      default: false
    },
    isHome: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      activities: [],
      dialogVisible: false,
      recordTreeLoading: false,
      tree: [],
      colorObj: {
        "01": "#44c264",
        "02": "#134796",
        "03": "#E1140A",
        "04": "#E1140A",
        "05": "#A6A6A6",
        "07": "#E1140A",
        "08": "#E1140A",
        "09": "#E1140A",
        // "11": "#006E4A"
        11: "#F7A820"
      },
      defaultProps: {
        children: "children",
        label: "text"
      },
      curNode: {},
      propVisible: false,
      emrName: "",
      insType: "",
      businessTime: "",
      submitTime: "",
      submitor: "",
      tempType: "",
      dept: "",
      pDisable: false,
      mrProp: {},
      activeName: false,
      currentTimeline: "",
      mrTitle: "病案首页",
      mrItemClickFlag: false,
      timeFirstClick: false,
      switchType: false,
      classValMsg: ""
    };
  },
  inject: {
    mrTpCdMsg: {
      default: () => {
        return () => "";
      }
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData", "patientEmr"]),
    ...mapGetters("cis", ["diagnosis"]),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    autoHeight() {
      if (this.showMrHomepage) {
        return `calc(100% - ${50}px)`;
      }
      return `calc(100% - ${100}px)`;
    },
    modeNumCode() {
      if (this.showMrHomepage) {
        return this.diagnosis.enNo;
      }
      return this.modeType === "zhuyuan" && this.isHome === "1"
        ? this.homeSickbedsPatient.treatNo
        : this.receivePatientData.visitCode;
    },
    newdataList: function() {
      return this.sortKey(this.activities, "timestamp");
    },
    mrTpCd() {
      let mrTpCd = this.mrTpCdMsg();
      return mrTpCd;
    },
    patientId() {
      let patientId =
        this.modeType === "zhuyuan" && this.isHome === "1"
          ? this.homeSickbedsPatient.patientId
          : this.receivePatientData.patientId;
      return patientId;
    }
  },
  watch: {
    receivePatientData: {
      handler(val, old) {
        if (val.patientId !== old.patientId) {
          this.tree = [];
        }
        if (val.patientId) {
          if (this.$route.path !== "/mrIntegrated/mrDocBrowse") {
            // this.initTree();
          }
        }
      },
      deep: true,
      immediate: true
    },
    diagnosis: {
      deep: true,
      handler(val) {
        if (this.diagnosis && this.diagnosis.enNo) {
          if (this.$route.path === "/mrIntegrated/mrDocBrowse") {
            // this.initTree();
          }
        }
      }
    },
    mrTpCd: {
      handler(val) {
        let mrTpCd = this.mrTpCdMsg();

        if (mrTpCd) {
          this.create();
          this.classValMsg = mrTpCd;
        }
      }
    }
  },
  methods: {
    ...mapActions({
      setDocTypeCode: "cis/setDocTypeCode"
    }),
    handleTimeFirstClick() {
      this.currentTimeline = "";
      this.firstNodeClick();
    },
    // 设置当前树分支被点击
    setCurrentKey(id) {
      this.$refs.docTree.setCurrentKey(id);
    },
    switchChange(data) {
      this.switchType = data;

      if (data) {
        // 时间下模式
        if (this.curNode.exts && this.curNode.exts.mrId) {
          this.currentTimeline = this.curNode.exts.mrId;
        } else if (this.curNode.text === this.mrTitle) {
          this.mrItemClickFlag = true;
        }
      } else {
        // 文书树模式
        this.setCurrentKey(this.currentTimeline);
      }
    },
    // 展开收起
    pickUp() {
      this.$emit("closeTree");
    },
    clearRowData() {
      this.curNode = {};
    },
    // 判断是否调用接诊接口
    async judgeCallVisitInteFace() {
      if (
        this.modeType === "menzhen" &&
        this.receivePatientData.recordStatus === "2"
      ) {
        let { hosId = "", orgId = "" } = JSON.parse(getPamars());
        let { deptId = "", deptName = "" } = JSON.parse(getRole());
        let doctorIdStr = getUId();
        let params = {
          visitCode: this.receivePatientData.visitCode,
          patientId: this.patientId,
          patientName: this.receivePatientData.patientName,
          visitType: "1",
          outpDeptId: deptId,
          outpDeptName: deptName,
          diagTime: this.dayjs().format(""),
          doctorId: doctorIdStr,
          doctorName: getUN(),
          isRtnVisit: "1",
          hosId: hosId,
          orgId: orgId,
          freeCode: this.receivePatientData.freeCode,
          haveMoney: this.receivePatientData.haveMoney,
          appointmentId: this.receivePatientData.appointmentId
        };

        try {
          const { code, data, msg = "" } = await receiveVisitRecord(params);
          // 刷新左侧待诊患者列表
          this.$root.eventHub.$emit("refresh-wait-patientList", 'third');
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return true;
      }
    },
    async handleRowDbClick() {
      this.clearRowData();

      // 如果被其他医生接诊 则不创建文书
      const flag = await this.judgeCallVisitInteFace();
      if (!flag) return;

      let { param = {} } = this.$refs.createEmr.createInsAndEmr();

      let paramCheck = {
        docType: param.typeCode,
        enNo: this.modeNumCode
      };

      this.checkQcDependHandle(paramCheck).then(res => {
        if (res) {
          this.dialogVisible = false;
          this.$emit("updateEditor", { param: param });
        }
      });
    },
    //弹出属性窗口
    showProp() {
      if (!this.curNode.exts || !this.curNode.exts.mrId) {
        this.$message({
          message: "请选择具体文书!",
          type: "warnning"
        });
        return;
      }

      this.pDisable = this.curNode.exts.mrStaCd === "01" ? false : true;

      this.propVisible = true;

      attributeQuery({ mrId: this.curNode.exts.mrId }).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "属性查询成功!",
            type: "success"
          });
          this.mrProp = res.data;
          this.emrName = res.data.mrName;
          this.insType = res.data.typeName;
          this.businessTime = res.data.bizTime;
          this.submitTime = res.data.submitDate;
          this.submitor = res.data.submitName;
          this.tempType = res.data.templateName;
          this.dept = res.data.deptName;
        } else {
          this.$message.error("属性查询失败!");
          return;
        }
      });
    },
    propDetermine() {
      this.propVisible = false;
      // 没有修改
      if (
        this.mrProp.mrName == this.emrName &&
        this.businessTime == this.mrProp.bizTime
      ) {
        return;
      }

      if (this.curNode.exts.mrStaCd != "01") {
        return;
      }
      var param = {
        nm: this.emrName,
        dataVersion: this.mrProp.dataVersion,
        bizTime: this.businessTime,
        mrId: this.curNode.exts.mrId,
        mrStaCd: this.curNode.exts.mrStaCd,
        opTp: "03"
      };
      modifyAttribute(param).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "修改属性成功!",
            type: "success"
          });
          this.initTree();
        } else {
          this.$message.error("修改属性失败!");
          return;
        }
      });
    },
    //复制操作
    copy() {
      if (!this.curNode.exts) {
        return;
      }
      //判断文书状态  编辑状态不可复制，提交状态可复制
      // if (this.curNode.exts.mrStaCd === "01") {
      //   this.$message.warning("当前文书为编辑状态不可复制，提交后可复制");
      //   return;
      // }

      let param = {
        typeCode: this.curNode.exts.typeCode,
        templateCode: this.curNode.exts.templateCode,
        mrName: this.curNode.exts.mrName + "-copy",
        mrId: this.curNode.exts.mrId,
        signLvlCd: this.curNode.exts.signLvlCd,
        templateVersion: this.curNode.exts.templateVersion,
        createType: "copy"
      };
      this.$emit("copyByTree", param);
    },
    del() {
      this.$emit("delete");
    },
    //刷新
    refresh() {
      let key = this.switchType ? this.curNode.exts.mrId : this.currentTimeline;

      this.initTree(key);
    },
    handleNodeClick(data) {
      this.curNode = data;

      this.mrItemClickFlag = false;
      if (data.text === this.mrTitle) {
        this.currentTimeline = "";
        this.mrItemClickFlag = true;
      }

      this.setDocTypeCode(data.exts.typeCode);
      this.$emit("node-click", data);
    },
    handleTimeLineClick(data) {
      this.timeFirstClick = false;
      this.currentTimeline = data.node.exts.mrId;
      this.handleNodeClick(data.node);
    },
    create() {
      this.dialogVisible = true;
    },
    async handleDetermine() {
      let {
        param = {},
        activeTab = ""
      } = this.$refs.createEmr.createInsAndEmr();

      if (!param.typeCode) {
        this.$message.warning("请选择模板");
        return;
      }

      if (!this.patientId) {
        this.$message.warning("请选择患者");
        return;
      }

      // 如果被其他医生接诊 则不创建文书
      const flag = await this.judgeCallVisitInteFace();
      if (!flag) return;

      let paramCheck = {
        docType: param.typeCode,
        enNo: this.modeNumCode
      };

      this.checkQcDependHandle(paramCheck).then(res => {
        if (res) {
          this.dialogVisible = false;
          this.$emit("updateEditor", { param, activeTab });
        }
      });
    },
    checkQcDependHandle(paramCheck) {
      // 检验当前选中文书是否有依赖的文书 先写另外一个
      return checkQcDepend(paramCheck, true)
        .then(res => {
          if (res.code === 1) {
            return true;
          } else if (res.code === 0) {
            // 取toDocTypes 进行查询选择重新选择文书
            if (res.data.continus) {
              return true;
            }
            this.$confirm(`${res.msg}`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                let typeCode = res.data.toDocTypes[0];
                this.$refs.createEmr.classVal = typeCode;
                this.$refs.createEmr.tempVal = "";
                this.$refs.createEmr.queryTemplate();
              })
              .catch(() => {});
          } else {
            this.$message.error(res.msg || "有依赖文书未完成！");
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error.msg || "检查文书依赖接口异常");
        });
    },
    sortKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    initTree(key = "", isClickFirst = false) {
      // key 代码具体文书的mrId

      if (!this.patientId) {
        return;
      }

      if (this.modeType !== "menzhen" && !this.modeNumCode) {
        return;
      }

      // 判断是否有就诊号
      if (this.modeType === "menzhen" && !this.modeNumCode) {
        return;
      }

      let data = {
        patientId: this.patientId,
        enId: this.modeNumCode,
        dnFlag: this.dnFlag,
        isHome: this.isHome,
        visitType: this.modeType === "zhuyuan" ? "04" : "01"
      };

      this.recordTreeLoading = true;

      getTree(data, false)
        // eslint-disable-next-line complexity
        .then(res => {
          if (res.code === 1) {
            res.data.forEach(item => {
              this.addTextAttr(item);
            });
            let sourceData = [];
            if (
              this.showMrHomepage &&
              this.diagnosis.hasOwnProperty("enTpCd") &&
              this.diagnosis.enTpCd === "04"
            ) {
              sourceData = [
                {
                  children: [],
                  text: this.mrTitle
                },
                ...res.data
              ];
            } else {
              sourceData = res.data;
            }
            //showMrHomepage仅作为病历浏览

            this.tree = sourceData.map(item => {
              if (item.hasOwnProperty("children")) {
                item.children.forEach(it => {
                  it.mrId = it.exts.mrId;
                });
              } else {
                item.mrId = item.exts.mrId;
              }

              return item;
            });

            this.activities = [];

            this.tree.forEach(item => {
              if (item.hasOwnProperty("children")) {
                item.children.forEach(it => {
                  this.activities.push({
                    content: it.exts.mrName,
                    timestamp: this.dayjs(it.exts.bizTime).format(
                      "YYYY-MM-DD HH:mm"
                    ),
                    writeName: it.exts.writeName,
                    color: this.colorObj[it.exts.mrStaCd] || "",
                    node: it
                  });
                });
              } else {
                this.activities.push({
                  content: item.exts.mrName,
                  timestamp: this.dayjs(it.exts.bizTime).format(
                    "YYYY-MM-DD HH:mm"
                  ),
                  writeName: item.exts.writeName,
                  color: this.colorObj[item.exts.mrStaCd] || "",
                  node: item
                });
              }
            });

            //  如果有传递的key
            if (key) {
              this.currentTimeline = key;
              this.tree.forEach(item => {
                if (item.hasOwnProperty("children")) {
                  item.children.forEach(it => {
                    if (it.mrId === key) {
                      this.curNode = it;
                      this.setDocTypeCode(it.exts.typeCode);
                    }
                  });
                }
              });
            }
            // 触发文书自动点击更新文书相关数据
            if (isClickFirst) {
              this.firstNodeClick();
            }

            // 刷新情况下 保存住原有选中状态
            if (this.curNode.exts) {
              this.$nextTick(() => {
                this.setCurrentKey(this.curNode.exts.mrId);
                // 更新数据
                console.log(this.curNode, "this.curNode");
                this.updateCurrent(this.curNode.exts.mrId);
              });

              return;
            }
            if (this.currentTimeline) {
              this.$nextTick(() => {
                this.setCurrentKey(this.currentTimeline);
              });

              return;
            }

            if (this.activities.length) {
              if (!this.showMrHomepage) {
                this.currentTimeline = this.activities[0].node.mrId;
              }
              this.setCurrentKey(this.currentTimeline);
            }

            // 外部指定文书打开
            // if (!this.patientEmr.hasOwnProperty("patientId")) {

            // this.firstNodeClick();
            // }
          } else {
            this.$message.error("获取接口失败!");
            return;
          }
        })
        .catch(error => {
          this.$message.error(error.msg || "获取文书树失败");
        })
        .finally(() => {
          this.recordTreeLoading = false;
        });
    },
    updateCurrent(mrId) {
      let current = {};
      for (let i = 0; i < this.tree.length; i++) {
        let item = this.tree[i];
        if (item.hasOwnProperty("children") && Array.isArray(item.children)) {
          for (let j = 0; j < item.children.length; j++) {
            let it = item.children[j];
            if (it.mrId === mrId) {
              current = it;
              break;
            }
          }
        } else {
          if (item.mrId === mrId) {
            current = item;
            break;
          }
        }
      }

      this.curNode = current;
    },
    firstNodeClick() {
      this.$nextTick(() => {
        let aaa = document.getElementById("insTree").querySelector(".is-leaf");
        if (aaa) {
          let firstNode = aaa.parentNode.parentNode;
          firstNode.click();
          this.currentTimeline = "";
        }
      });
    },
    //添加text属性，方便树加载
    addTextAttr(data) {
      data.text = data.label
        ? data.label
        : data.exts.mrName
      if (data.children) {
        data.children.forEach(item => {
          this.addTextAttr(item);
        });
      }
    },
    clearTree() {
      this.tree = [];
    },
    //自定义树样式
    renderContent(h, { node, data, store }) {
      if (!data.exts) {
        return <p>{node.label}</p>;
      }

      if (data.exts.mrStaCd) {
        let bgColor = `background-color: ${this.colorObj[data.exts.mrStaCd]}`;
        return (
          <div class="el-tree-node__content">
            <div style={bgColor} class="dot" />
            <p>{node.label}</p>
          </div>
        );
      }

      return <p>{node.label}</p>;
    }
  }
};
</script>

<style lang="scss" >
.hd-tree {
  width: 270px;
  height: 100%;
  background-color: #ffffff;
  position: relative;
  .el-tree-node {
    white-space: normal;
    min-width: 100%;
    display: inline-block;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: $l-color-bgcolor-12;
  }
  .el-tree-node__content:hover {
    background-color: $l-color-bgcolor-12;
  }
  .el-tree-node__content {
    white-space: nowrap;
  }
  .el-tabs__nav {
    margin-left: 10px;
  }
  .el-input--medium .el-input__inner {
    height: 30px !important;
  }
  .top-btn {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px 0px 10px 0px;
    border-bottom: 1px solid #e4e4e4;
    .el-button {
      border-color: rgba(255, 255, 255, 0.5);
    }
    .little-button:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  /deep/ .el-timeline-item__tail {
    left: 5px;
  }
  /deep/ .el-timeline-item__node--normal {
    left: 0;
  }
  .little-button {
    width: 24px;
    height: 24px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
    margin-left: 0px;
    .el-button--default {
      padding: 5px 20px 5px 14px;
    }
  }

  .lit-div {
    // width: 45px;
    height: 24px;
    border-left: 1px solid #e4e4e4;
    // float: left;
    padding-left: 10px;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    float: left;
    margin: 4px;
  }
  p {
    float: left;
  }
  .el-icon-time:before {
    content: "";
  }
  .activeClass {
    font-weight: 800;
    // background-color: rgba(43, 69, 131, 0.5);
    background: #eaedf3;
  }

  .create-emr-class {
    /deep/ .el-dialog__body {
      padding: 12px;
    }
    /deep/ .el-dialog__footer {
      padding: 12px !important;
    }
  }
}
</style>
