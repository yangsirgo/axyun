<template>
  <div class="height100 width100">
    <l-layout
      :boxExpanded="false"
      :toolBoxShow="true"
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
    >
      <template #list>
        <div class="sidebar height100">
          <l-sidebar-left>
            <template #top>
              <div class="search-area">
                <l-card-title>
                  <template #left>就诊患者查询</template>
                </l-card-title>
                <div class="search-con">
                  <l-formt-title>
                    <el-input
                      v-model="name"
                      placeholder="输入姓名/手机号/身份证/医保卡"
                    ></el-input>
                    <el-button plain type="primary" size="mini" shortbutton
                      >读卡</el-button
                    >
                  </l-formt-title>
                  <div class="search-buttons">
                    <el-button plain type="primary">查询</el-button>
                    <el-button>重置</el-button>
                  </div>
                </div>
              </div>
            </template>
            <template #bottom>
              <div class="no-tabs">
                <l-table
                  :pageSize="pageParams.pageSize"
                  :page="pageParams.pageNo"
                  :total="pageParams.total"
                  :background="false"
                  :paginationSmall="true"
                  layout="prev,pager,next"
                  paginationAlign="center"
                >
                  <div class="patient-penetrate-container">
                    <div class="patient-penetrate-box">
                      <l-patient-info-item
                        v-for="index in listLength"
                        :key="'click' + index"
                        :class="{
                          'l-c-penetrate': true,
                          'is-active': currentRowIndex === index,
                        }"
                        @click.native="choose(index)"
                      >
                        <template #top>
                          <span class="name">张晓阳</span>
                        </template>
                        <template #bottom>
                          <span>身份证号:1201210210120</span>
                        </template>
                      </l-patient-info-item>
                    </div>
                  </div>
                </l-table>
              </div>
              <div class="tabs-cont">
                <el-tabs class="penetrate-tabs height100" v-model="activeName">
                  <el-tab-pane
                    v-for="item in tabsList"
                    :key="item.name"
                    :label="item.label"
                    :name="item.name"
                  >
                    <l-table
                      :pageSize="pageParams.pageSize"
                      :page="pageParams.pageNo"
                      :total="pageParams.total"
                      :background="false"
                      :paginationSmall="true"
                      layout="prev,pager,next"
                      paginationAlign="center"
                    >
                      <div class="patient-penetrate-container">
                        <div class="patient-penetrate-box">
                          <l-patient-info-item
                            v-for="index in listLength"
                            :key="'click' + index"
                            :class="{
                              'l-c-penetrate': true,
                              'is-active':
                                currentRowIndex2 === `${item.name}${index}`,
                            }"
                            @click.native="choose2(item.name, index)"
                          >
                            <template #top>
                              <span class="name">张晓阳</span>
                            </template>
                            <template #bottom>
                              <span>身份证号:1201210210120</span>
                            </template>
                          </l-patient-info-item>
                        </div>
                      </div>
                    </l-table>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </template>
          </l-sidebar-left>
        </div>
      </template>
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <l-patient-card
              patientName="张三"
              patientAge="34岁"
              patientGender="男"
            >
              <patient-basic-info
                :patientInfo="patientInfo"
              ></patient-basic-info>
            </l-patient-card>
          </div>
          <div class="m-contain">
            <div class="top-con height100">
              <div class="top-con-tab height100">
                <el-tabs class="height100" v-model="active">
                  <el-tab-pane label="写病历" name="first">写病历</el-tab-pane>
                  <el-tab-pane label="开医嘱" name="second">开医嘱</el-tab-pane>
                  <el-tab-pane label="入院管理" name="third">
                    <div class="third-con height100">
                      <div class="first-contain">
                        <l-card-title>
                          <template #left>患者基本信息</template>
                        </l-card-title>
                        <div class="first-list">
                          <div>
                            <div class="lay-item">
                              <span class="item-title item-title-01">姓名</span>
                              <span class="item-contain item-contain-01"
                                >王松</span
                              >
                            </div>
                            <div class="lay-item">
                              <span class="item-title item-title-01">性别</span>
                              <span class="item-contain item-contain-02"
                                >男</span
                              >
                            </div>
                            <div class="lay-item">
                              <span class="item-title item-title-02"
                                >出生日期</span
                              >
                              <span class="item-contain item-contain-03"
                                >1988-02-14</span
                              >
                            </div>
                            <div class="lay-item">
                              <span class="item-title item-title-01">年龄</span>
                              <span class="item-contain item-contain-04"
                                >31</span
                              >
                            </div>
                          </div>
                          <div class="margin-top-8">
                            <div class="lay-item">
                              <span class="item-title item-title-01">姓名</span>
                              <span class="item-contain item-contain-01"
                                >王松</span
                              >
                            </div>
                            <div class="lay-item">
                              <span class="item-title item-title-01">性别</span>
                              <span class="item-contain item-contain-02"
                                >男</span
                              >
                            </div>
                            <div class="lay-item">
                              <span class="item-title item-title-02"
                                >出生日期</span
                              >
                              <span class="item-contain item-contain-03"
                                >1988-02-14</span
                              >
                            </div>
                            <div class="lay-item">
                              <span class="item-title item-title-01">年龄</span>
                              <span class="item-contain item-contain-04"
                                >31</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="secord-con margin-top-default"
                        style="width: 855px"
                      >
                        <l-card-title>
                          <template #left>联系人</template>
                        </l-card-title>
                        <div class="secord-con">
                          <div
                            class="margin-right-8"
                            style="width: 208px; display: inline-block"
                          >
                            <l-formt-title label="联系人类型">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 160px; display: inline-block"
                          >
                            <l-formt-title label="姓名">
                              <el-input
                                v-model="name"
                                placeholder="请输入"
                              ></el-input>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 272px; display: inline-block"
                          >
                            <l-formt-title label="身份证号">
                              <div class="input-con">
                                <el-input
                                  v-model="name"
                                  placeholder="请输入"
                                ></el-input>
                                <el-button
                                  plain
                                  type="primary"
                                  size="mini"
                                  shortbutton
                                  >读卡</el-button
                                >
                              </div>
                            </l-formt-title>
                          </div>
                          <div style="width: 190px; display: inline-block">
                            <l-formt-title label="与本人关系">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 208px; display: inline-block"
                          >
                            <l-formt-title label="联系人类型">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 160px; display: inline-block"
                          >
                            <l-formt-title label="姓名">
                              <el-input
                                v-model="name"
                                placeholder="请输入"
                              ></el-input>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 272px; display: inline-block"
                          >
                            <l-formt-title label="身份证号">
                              <div class="input-con">
                                <el-input
                                  v-model="name"
                                  placeholder="请输入"
                                ></el-input>
                                <el-button
                                  plain
                                  type="primary"
                                  size="mini"
                                  shortbutton
                                  >读卡</el-button
                                >
                              </div>
                            </l-formt-title>
                          </div>
                          <div style="width: 190px; display: inline-block">
                            <l-formt-title label="与本人关系">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                        </div>
                      </div>
                      <div
                        class="margin-top-default third-contain"
                        style="width: 855px"
                      >
                        <l-card-title>
                          <template #left>入院申请</template>
                        </l-card-title>
                        <div class="show-con">
                          <span class="text-left">门诊诊断</span>
                          <span class="text-right">冠心病</span>
                          <span class="text-left">申请科室</span>
                          <span class="text-right">消化内科</span>
                          <span class="text-left">申请医生</span>
                          <span class="text-right">李想</span>
                          <span class="text-left">申请时间</span>
                          <span class="text-right">2020-07-03 12:00</span>
                        </div>
                        <div
                          class="third-list"
                          style="width: 854px; margin-top: 8px"
                        >
                          <div
                            class="margin-right-8"
                            style="width: 376px; display: inline-block"
                          >
                            <l-formt-title label="拟入院日期">
                              <el-date-picker
                                v-model="date"
                                type="daterange"
                                range-separator="-"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                              ></el-date-picker>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 254px; display: inline-block"
                          >
                            <l-formt-title label="入院途径">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                          <div style="width: 208px; display: inline-block">
                            <l-formt-title label="入院病情">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 376px; display: inline-block"
                          >
                            <l-formt-title label="拟入院日期">
                              <el-date-picker
                                v-model="date"
                                type="daterange"
                                range-separator="-"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                              ></el-date-picker>
                            </l-formt-title>
                          </div>
                          <div
                            class="margin-right-8"
                            style="width: 254px; display: inline-block"
                          >
                            <l-formt-title label="入院途径">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                          <div style="width: 208px; display: inline-block">
                            <l-formt-title label="入院病情">
                              <el-select
                                v-model="selectOne"
                                placeholder="请选择"
                              >
                                <el-option>12</el-option>
                              </el-select>
                            </l-formt-title>
                          </div>
                          <div class style="height: 96px">
                            <l-formt-title
                              label="多行文本框"
                              :isMultiRow="true"
                            >
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="name"
                                resize="none"
                              ></el-input>
                            </l-formt-title>
                          </div>
                        </div>
                      </div>
                      <div class="bottom-con width100">
                        <div class="btns float-right">
                          <el-button type="primary">提交</el-button>
                          <el-button type="primary" plain>取消</el-button>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      toolBoxs: ["SpecialSymbol", "TreatmentInfoBox"],
      active: "third",
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 200
      },
      listLength: 5,
      currentRowIndex: "",
      date: "",
      name: "",
      selectOne: "",
      showPenetrate: false,
      patientInfo: {
        birthDate: "193-08-24",
        medicareCard: "PC823481000239",
        mobileNum: "13564728736",
        identificationNum: "330392819233219921"
      },
      tabsList: [
        {
          label: "待诊",
          name: "first"
        },
        {
          label: "诊中",
          name: "second"
        },
        {
          label: "已结束",
          name: "third"
        }
      ],
      activeName: "first",
      currentRowIndex2: ""
    };
  },
  watch: {},
  methods: {
    choose(index) {
      this.currentRowIndex = index;
    },
    choose2(name, index) {
      this.currentRowIndex2 = `${name}${index}`;
    }
  }
};
</script>

<style lang='scss' scoped>
.penetrate-tabs {
  /deep/ .el-tabs__content {
    overflow: visible;
  }
}
.patient-penetrate-container {
  width: 100%;
  height: 100%;
  .patient-penetrate-box {
    width: calc(100% + 24px);
    height: 100%;
    overflow: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      display: none;
    }
    .l-c-penetrate {
      width: calc(100% - 24px);
      &.is-active {
        width: 100%;
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        .name {
          color: $l-color-white;
        }
      }
    }
  }
}
.sidebar {
  position: relative;
  padding: 0px $l-padding-default-4 $l-padding-default-6 $l-padding-default-4;
  .tooltip-content {
    line-height: $l-height-common-2;
    font-size: $l-font-size;
  }
}
.no-tabs,
.tabs-cont {
  height: 50%;
}
.search-area {
  margin-bottom: $l-margin-default-4;
  .search-con {
    /deep/ .el-input {
      width: calc(100% - 56px);
    }
    /deep/ .el-button--mini {
      margin-left: $l-margin-default-4;
    }
    .search-buttons {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      /deep/ button {
        width: calc(50% - 4px);
      }
    }
  }
}
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  .m-contain {
    height: calc(100% - 72px);
    box-sizing: border-box;
    .top-con {
      margin-top: 17px;
      .top-con-tab {
        font-size: 12px;
        /deep/ .el-tabs__nav-wrap {
          padding-left: 18px;
          border-bottom: 1px solid $l-color-border-8;
        }

        .first-list {
          width: 854px;
          font-size: 0;
          .lay-item {
            display: inline-block;
            line-height: 17px;
            font-size: 12px;
            .item-title {
              display: inline-block;
              color: #949da3;
            }
            .item-contain {
              margin-left: 8px;
              display: inline-block;
              color: #2e323a;
            }
            .item-title-01 {
              width: 36px;
            }

            .item-title-02 {
              width: 48px;
            }

            .item-contain-01 {
              width: 146px;
            }

            .item-contain-02 {
              width: 101px;
            }
            .item-contain-03 {
              width: 93px;
            }
            .item-contain-04 {
              width: 270px;
            }
          }
        }

        .third-con {
          position: relative;
          font-size: 0;
          padding-left: 17px;
          .input-con {
            /deep/ .el-input {
              width: calc(100% - 56px);
            }
            /deep/ .el-button {
              margin-left: $l-margin-default-4;
            }
          }
          .third-contain {
            .show-con {
              width: 854px;
              padding: 12px $l-padding-default-6;
              line-height: 20px;
              font-size: 14px;
              background: $l-color-bgcolor-18;
              border-radius: $l-bg-radius-bg;
              .text-left {
                color: #666c70;
              }
              .text-right {
                margin-left: $l-margin-default-4;
                margin-right: 32px;
                color: #2e323a;
              }
            }
          }
          .bottom-con {
            padding: 16px;
            position: absolute;
            bottom: 0;
            left: 0;
            height: 63px;
            border-top: 1px solid #e4e4e4;
          }
        }
      }
    }
  }
}
.margin-right-8 {
  margin-right: $l-margin-default-4;
}
.margin-top-default {
  margin-top: $l-margin-default-6;
}

/deep/ .el-input-group__append {
  background-color: rgba(255, 255, 255, 1);
  border-width: 0;
}
</style>
