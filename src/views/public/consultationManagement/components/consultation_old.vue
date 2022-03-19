<template>
  <div class="consultation padding20">
    <el-form class="search-form" :inline="true">
      <el-date-picker
        v-model="date"
        format-value="yyyy-MM-dd"
        class="search-item search-date"
        type="daterange"
        prefix-icon="icon iconfont iconriqi"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <LFormtTitle label="会诊状态" class="search-item search-sel">
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in statusSel"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </LFormtTitle>
      <LFormtTitle label="会诊类型" class="search-item search-sel">
        <el-select v-model="type" placeholder="请选择">
          <el-option
            v-for="item in typeSel"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </LFormtTitle>
      <el-input
        class="search-item search-input"
        placeholder="搜索病人"
        suffix-icon="el-icon-search"
        v-model="patient"
      ></el-input>
      <el-button class="search-item search-last" @click="search" type="primary" size="small">查询</el-button>
    </el-form>
    <!-- <div class="consultation-handle" v-if="comtype === 'sq'">
      <button @click="dialogVisible = true">
        <i class="iconfont iconxinzeng"></i>新增申请
      </button>
      <button @click="cancelCon = true">
        <i class="iconfont iconchexiao" style="font-size:12px;"></i>取消申请
      </button>
      <button @click="submitApply">
        <i class="iconfont icontijiao"></i>提交
      </button>
      <button>
        <i class="iconfont icondagou"></i>完成
      </button>
    </div>
    <div class="consultation-handle" v-else-if="comtype === 'cy'">
      <button>
        <i class="iconfont icondagou"></i>接受邀请
      </button>
      <button>
        <i class="iconfont iconmenzhenbingli"></i>会诊意见
      </button>
    </div>-->
    <div class="consultation-bottom">
      <div class="consultation-table">
        <el-table
          :data="tableData"
          border
          height="100%"
          v-loadmore="{noMoreVar:'tlm_noMore', loadingVar: 'tlm_isLoading', value: loadNextPage}"
          v-loading="tlm_isLoading"
          element-loading-text="加载中..."
          @row-click="capplyform = true"
        >
          <!-- 单选框列 -->
          <el-table-column type="selection" width="47px" header-align="center" align="center"></el-table-column>
          <!-- 业务列 -->
          <el-table-column
            v-for="(item,index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-tabs class="consultation-tabs" v-model="activeName">
        <el-tab-pane label="新增申请" name="first">
          <add-new-apply />
        </el-tab-pane>
        <el-tab-pane label="提交" name="second">
          <layout>
            <div slot="top">
              <div class="submit-apply-cont">
                <i class="el-icon-warning"></i>提交后，将提醒会诊科室处理此申请。
              </div>
            </div>
            <div slot="bottom">
              <el-button type="primary">提交</el-button>
              <el-button class="plain-button">取消</el-button>
            </div>
          </layout>
        </el-tab-pane>
        <el-tab-pane label="完成" name="third"></el-tab-pane>
        <el-tab-pane label="取消申请" name="fourth">
          <layout>
            <div slot="top">
              <p class="red-hint">取消后，无法进行编辑和提交。</p>
              <el-input
                type="textarea"
                :rows="4"
                resize="none"
                placeholder="请输入取消原因（必填）"
                v-model="cancelReson"
              ></el-input>
            </div>
            <div slot="bottom">
              <el-button type="primary" @click="cancelCon = false">再看看</el-button>
              <el-button class="plain-button" @click="cancelCt">取消会诊</el-button>
            </div>
          </layout>
        </el-tab-pane>
        <el-tab-pane label="进度查看" name="five">
          <div class="consultation-progress bdr">
            <div class="consultation-receive">
              <div class="con-re-item">
                <p class="con-re-title">科室</p>
                <div class="receive-txt">
                  <span v-text="this.office.sum - this.office.num"></span>个科室未接收
                </div>
                <el-progress
                  :percentage="this.office.num / this.office.sum * 100"
                  :color="customColor"
                  :format="clearPer"
                  :stroke-width="10"
                ></el-progress>
              </div>
              <div class="con-re-item">
                <p class="con-re-title">医生</p>
                <div class="receive-txt">
                  <span v-text="this.doctor.sum - this.doctor.num"></span>个医生未接收
                </div>
                <el-progress
                  :percentage="this.doctor.num / this.doctor.sum * 100"
                  :color="customColor"
                  :format="clearPer"
                  :stroke-width="10"
                ></el-progress>
              </div>
            </div>
            <div class="consultation-step">
              <l-card-title>
                <div slot="left" class="report-cont-title">会诊进度</div>
              </l-card-title>
              <el-steps :active="2" finish-status="success">
                <el-step
                  v-for="(item, index) in progress"
                  :key="index"
                  :title="item.title"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                >
                  <template slot="description">
                    <p>{{item.personnel}}</p>
                    <p>{{item.date}}</p>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </div>
          <div class="consultation-info-box">
            <div class="consultation-info bdr">
              <l-card-title>
                <div slot="left" class="report-cont-title">会诊信息</div>
              </l-card-title>
              <div class="consultation-info-scroll">
                <div class="consultation-info-item">
                  <p class="item-title">简要病情</p>
                  <p>患者病情复杂，继续会诊。</p>
                </div>
                <div class="consultation-info-item">
                  <p class="item-title">会诊目的</p>
                  <p>通过会诊，治愈病人病情，降低患者病情恶化风险！</p>
                </div>
              </div>
            </div>
            <div class="consultation-opinion bdr">
              <l-card-title>
                <div slot="left" class="report-cont-title">会诊意见</div>
              </l-card-title>
              <div class="opinion-info">
                会诊医生
                <span v-text="3"></span>人，
                <span v-text="1"></span>人未填写会诊意见
              </div>
              <div class="opinion-table">
                <el-table
                  :data="tableData2"
                  border
                  height="100%"
                  style="width:100%;"
                  v-loadmore="{noMoreVar:'tl_noMore', loadingVar: 'tl_isLoading', value: loadNextPage2}"
                  v-loading="tl_isLoading"
                  element-loading-text="加载中..."
                >
                  <el-table-column
                    v-for="(item,index) in tableParams2"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    header-align="center"
                    :align="item.align || 'left'"
                    :fixed="item.fixed"
                  >
                    <template slot-scope="scope">
                      <!-- 可自定义内容 -->
                      <span>{{ scope.row[item.prop]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="会诊申请单" :visible.sync="capplyform" :append-to-body="true" width="811px">
      <apply-form />
    </el-dialog>
  </div>
</template>

<script>
import LFormtTitle from "@/components/LFormtTitle";
import addNewApply from "./dialog/addNewApply";
import applyForm from "./dialog/applyForm";
import layout from "./dialog/layout";
import LCardTitle from "@/components/LCardTitle";

export default {
  name: "consultation",
  components: { LFormtTitle, addNewApply, applyForm, layout, LCardTitle },
  props: {
    // 会诊类型（sq申请，cy参与）
    comtype: String
  },
  data() {
    return {
      // 开始结束日期
      date: [],
      // 会诊状态
      status: "",
      // 会诊类型
      type: "",
      // 会诊状态下拉
      statusSel: [
        {
          label: "全部",
          value: "1"
        }
      ],
      // 会诊类型下拉
      typeSel: [
        {
          label: "全部",
          value: "1"
        }
      ],
      // 搜索病人
      patient: "",
      tlm_noMore: false, // 没有更多数据， 禁用加载
      // 表格加载loading
      tlm_isLoading: false,
      // 分页控制参数
      pageParams: {
        pageNo: 1, // 当前页数
        total: 40, // 总共条数
        pageSize: 20 // 每页数据条数
      },
      // 表头
      tableParams: [
        {
          prop: "t1",
          label: "状态",
          width: "82"
        },
        {
          prop: "t2",
          label: "会诊时间"
        },
        {
          prop: "t3",
          label: "会诊类型"
        },
        {
          prop: "t4",
          label: "病案号",
          width: "89"
        },
        {
          prop: "t5",
          label: "患者"
        },
        {
          prop: "t6",
          label: "主诊断",
          width: ""
        },
        {
          prop: "t7",
          label: "会诊范围",
          width: ""
        },
        {
          prop: "t8",
          label: "会诊地点"
        },
        {
          prop: "t9",
          label: "申请科室",
          width: ""
        },
        {
          prop: "t10",
          label: "申请医生",
          width: ""
        },
        {
          prop: "t11",
          label: "申请时间",
          width: ""
        }
      ],
      // 表格数据
      tableData: [],
      // 会诊进度
      progress: [
        {
          title: "提交",
          personnel: "王阳",
          date: "2019-04-11 12:02"
        },
        {
          title: "审核",
          personnel: "张健",
          date: "2019-04-11 13:04"
        },
        {
          title: "接收",
          personnel: "",
          date: ""
        },
        {
          title: "完成并评价",
          personnel: "",
          date: ""
        }
      ],
      // 进度条颜色
      customColor: $l-color-primary,
      // 科室
      office: {
        sum: 10,
        num: 9
      },
      // 医生
      doctor: {
        sum: 10,
        num: 3
      },
      // 会诊意见表格
      tableParams2: [
        {
          prop: "t1",
          label: "状态"
        },
        {
          prop: "t2",
          label: "科室编码"
        },
        {
          prop: "t3",
          label: "科室名称"
        },
        {
          prop: "t4",
          label: "会诊医生"
        },
        {
          prop: "t5",
          label: "会诊意见"
        },
        {
          prop: "t6",
          label: "会诊计划"
        },
        {
          prop: "t7",
          label: "接收时间"
        },
        {
          prop: "t8",
          label: "处理时间"
        },
        {
          prop: "t9",
          label: "完成时间"
        }
      ],
      // 会诊意见表格数据
      tableData2: [],
      tl_noMore: false, // 没有更多数据， 禁用加载
      // 表格加载loading
      tl_isLoading: false,
      // 分页控制参数
      pageParams2: {
        pageNo: 1, // 当前页数
        total: 40, // 总共条数
        pageSize: 20 // 每页数据条数
      },
      // 新增会诊申请
      dialogVisible: false,
      capplyform: false,
      cancelCon: false,
      // 取消原因
      cancelReson: "",
      // 默认显示的tabs页
      activeName: "first"
    };
  },
  computed: {
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    noMore2() {
      return (
        Math.ceil(this.pageParams2.total / this.pageParams2.pageSize) <=
        this.pageParams2.pageNo
      );
    }
  },
  created() {
    this.loadTable();
    this.loadTable2();
  },
  methods: {
    // 搜索
    search() {},
    // 加载会议表格
    loadTable() {
      let that = this;
      try {
        this.tlm_isLoading = true;
        let arr = [];
        for (let i = 0; i < this.pageParams.pageSize; ++i) {
          let num = (i + 1) * this.pageParams.pageNo;
          arr.push({
            t1: "暂存",
            t2: "2019-05-05 09:00",
            t3: "DMT",
            t4: "000044854",
            t5: "张钧甯 女32岁",
            t6: "腰肌劳损",
            t7: "院内",
            t8: "泌尿外科医生办公室",
            t9: "泌尿外科",
            t10: "王阳",
            t11: "2019-04-11 12:02"
          });
        }
        setTimeout(function() {
          that.tlm_isLoading = false;
          that.tableData = that.tableData.concat(arr);
        }, 2000);
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    // 加载表格下一页
    loadNextPage() {
      if (this.noMore) {
        this.tlm_isLoading = false;
        this.tlm_noMore = true;
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 清除进度条的百分比
    clearPer() {
      return "";
    },
    // 加载会议意见表格
    loadTable2() {
      let that = this;
      try {
        this.tl_isLoading = true;
        let arr = [];
        for (let i = 0; i < this.pageParams.pageSize; ++i) {
          let num = (i + 1) * this.pageParams.pageNo;
          arr.push({
            t1: "暂存",
            t2: "2019-05-05 09:00",
            t3: "1",
            t4: "000044854",
            t5: "张钧甯 女32岁",
            t6: "腰肌劳损",
            t7: "院内",
            t8: "泌尿外科医生办公室",
            t9: "泌尿外科",
            t10: "王阳",
            t11: "2019-04-11 12:02"
          });
        }
        setTimeout(function() {
          that.tl_isLoading = false;
          that.tableData2 = that.tableData2.concat(arr);
        }, 2000);
      } catch (error) {
        this.tl_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    // 加载会议意见表格下一页
    loadNextPage2() {
      if (this.noMore2) {
        this.tl_isLoading = false;
        this.tl_noMore = true;
        return;
      }
      this.pageParams2.pageNo++;
      this.loadTable2();
    },
    // 取消会诊
    cancelCt() {
      this.$message.success("取消会诊成功");
      this.cancelCon = false;
    },
    // 提交
    submitApply() {
      this.$confirm("提交后，将提醒会诊科室处理此申请。", "", {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.consultation {
  position: relative;
  height: 100%;
  .bdr {
    border: 1px solid $l-color-bgcolor-11;
  }
  .search-form {
    font-size: 0;
    .search-item {
      vertical-align: top;
      margin-right: 10px;
      margin-bottom: 20px;
    }
    .search-date {
      width: 230px;
      /deep/ .el-range-input {
        font-size: 14px;
      }
    }
    .search-sel {
      width: 170px;
      /deep/ .l-input-body {
        padding-left: 76px !important;
      }
    }
    .search-input {
      width: 190px;
    }
    .search-last {
      margin-right: 0;
    }
  }
  .link-word {
    color: $l-color-fontcolor-2;
  }
  .consultation-handle {
    margin-bottom: 20px;
    button {
      height: 20px;
      line-height: 20px;
      padding: 0;
      margin-right: 20px;
      border: 0;
      background-color: transparent;
      cursor: pointer;
      outline: medium;

      i {
        margin-right: 5px;
      }
    }
  }
  .consultation-table {
    height: 40%;
  }
  .consultation-bottom {
    position: absolute;
    top: 76px;
    bottom: 20px;
    left: 20px;
    right: 20px;
    /deep/ .consultation-tabs {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      padding-top: 20px;
      .el-tabs__header {
        height: 40px;
        margin-bottom: 15px;
        background-color: transparent;
      }
      .el-tabs__content {
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;
        height: auto;
      }
      .el-tab-pane {
        overflow: hidden;
        overflow-y: auto;
      }
    }
    .consultation-progress {
      height: 178px;
      padding: 20px;
      overflow: hidden;
      .consultation-step {
        margin-right: 568px;
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
      .consultation-receive {
        width: 568px;
        height: 100%;
        padding: 0 89px;
        border-left: 1px solid #e4e4e4;
        float: right;
        overflow: hidden;
        .con-re-item {
          float: left;
          width: 50%;
          .con-re-title {
            margin-bottom: 40px;
            font-weight: bold;
          }
          .receive-txt {
            margin-bottom: 18px;
            span {
              font-size: 24px;
            }
          }
        }
      }
    }
  }
  .cardtitle {
    height: 14px;
    line-height: 14px;
    margin-bottom: 20px;
    overflow: hidden;
    /deep/ .titleleft {
      .report-cont-title {
        font-weight: bold;
        font-size: $l-font-size;
      }
      &::before {
        height: 14px;
        margin-top: 0;
      }
    }
  }
  .consultation-info-box {
    margin-top: 20px;
    overflow: hidden;
    .consultation-info,
    .consultation-opinion {
      position: relative;
      height: 253px;
      padding: 20px;
    }
    .consultation-info {
      width: 457px;
      float: left;
      .consultation-info-scroll {
        position: absolute;
        top: 60px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        overflow: hidden;
        overflow-y: auto;

        .consultation-info-item {
          margin-top: 18px;
          color: $l-color-fontcolor-3;
          &:first-child {
            margin-top: 0;
          }
          .item-title {
            margin-bottom: 3px;
            color: $l-color-fontcolor-4;
          }
        }
      }
    }
    .consultation-opinion {
      margin-left: 477px;
      .opinion-info {
        color: $l-color-fontcolor-4;
      }
      .opinion-table {
        position: absolute;
        top: 91px;
        left: -1px;
        right: -1px;
        bottom: -1px;
      }
    }
  }
}
.submit-apply {
  /deep/ .el-dialog__header {
    display: none;
  }
  /deep/ .dialog-header {
    height: 114px;
  }
  /deep/ .dialog-footer {
    border-top: 0;
  }
}
.receive-apply {
  /deep/ .dialog-header {
    height: 180px;
  }
}
.red-hint {
  padding: 20px 0;
  color: #e1140a;
}
.submit-apply-cont {
  padding-top: 60px;
  line-height: 24px;
  font-size: $l-font-size-max;
  color: $l-color-fontcolor-3;
  i {
    margin-right: 10px;
    color: #f7a820;
    font-size: 24px;
    vertical-align: top;
  }
}
</style>
