<template>
  <div class="sidebar height100">
    <l-sidebar-left>
      <template #top>
        <div class="search-area">
          <l-card-title style="padding: 8px 0">
            <template #left>患者列表 </template>
            <template #right>
              <el-button
                v-if="user == 'appointmentOrder'"
                type="primary"
                @click="newRecord"
                >新建档案</el-button
              >
            </template>
          </l-card-title>
          <div class="search-con">
            <l-formt-title>
              <el-input
                class="rightButton"
                v-model="condition"
                placeholder="姓名/手机/证件号/患者编号"
                @keyup.enter.native="search"
              ></el-input>
              <el-button
                @click="readCard"
                plain
                type="primary"
                size="mini"
                shortbutton
                >读卡</el-button
              >
            </l-formt-title>
            <div class="search-buttons">
              <el-button @click="search" plain type="primary">查询</el-button>
              <el-button @click="reSet">重置</el-button>
            </div>
          </div>
        </div>
      </template>
      <template #bottom>
        <l-table
          :showTotal="true"
          :pageSize="pageParams.pageSize"
          :page="pageParams.pageNo"
          :total="pageParams.total"
          :paginationSmall="true"
          :background="false"
          layout="prev,pager,next"
          paginationAlign="center"
          @changeSize="sizeChangePatientList"
        >
          <div class="patient-penetrate-container">
            <div class="patient-penetrate-box">
              <l-patient-info-item
                v-for="(item, index) in listData"
                :key="'click' + index"
                :class="{
                  'l-c-penetrate': true,
                  'is-active': currentPenetrate === index,
                  'l-patient-info-item': true,
                }"
                @click.native="choosePenetrateItem(index)"
              >
                <template #top>
                  <span class="name name-specal" :title="item.patientName">{{
                    item.patientName | handlerName
                  }}</span>
                  <!-- <span class="name">{{
                    item.patientGender == 1
                      ? "男"
                      : item.patientGender == 2
                      ? "女"
                      : "未知"
                  }}</span> -->
                  <span
                    class="name"
                    :val="item.patientGender"
                    code="GENDER_CODE"
                    v-codeTransform
                  ></span>
                  <span class="name">{{ item.patientAge }}</span>
                </template>
                <template #bottom>
                  <span>证件号:{{ item.identificationNum }}</span>
                </template>
              </l-patient-info-item>
            </div>
          </div>
        </l-table>
      </template>
    </l-sidebar-left>
    <el-dialog
      title="新建档案"
      width="80%"
      height="95%"
      top="7vh"
      :visible.sync="addarchivesStyle"
      v-if="addarchivesStyle"
    >
      <addarchives @cancelstyle="cancelstyle" @refsChild="refsChild" :isAppointmentOrder="isAppointmentOrder" :readCardData="readCardData">
      </addarchives>
    </el-dialog>
  </div>
</template>

<script>
import { post, get, put, del } from "@/utils/request";
import addarchives from "@/views/filingAndChange/filingAndChangeindex/components/addarchives.vue";
import readCardMixin from "@/mixins/readCard.js";
import { mapActions } from "vuex";

export default {
  mixins: [readCardMixin],
  components: { addarchives },
  props: {
    user: {
      type: String,
      default: ""
    },
    // isAppointmentOrder表示是否是挂号界面的患者列表组件
    isAppointmentOrder: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    readCardData: {
      handler(n) {
        if(n.type && this.isAppointmentOrder) {
          this.addarchivesStyle = true;
        }
      },
      immediate: true,
      deep: true
    },
    addarchivesStyle: {
      handler(n) {
        if(!n) {
          this.readCardData = {
            type: "",
            data: {}
          };
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      condition: "",
      cardData: "", //卡号
      patientName: "", //患者姓名
      mobile: "", //手机号
      patientCode: "", //患者编号
      identificationNum: "", //身份证号
      currentPenetrate: "",
      addarchivesStyle: false
    };
  },
  methods: {
    ...mapActions({
      setPublicHealthPatientData: "base/setPublicHealthPatientData"
    }),
    jump() {
      this.$router.push({ path: "/finance_outp/recordCreate" });
    },
    choosePenetrateItem(index) {
      this.currentPenetrate = index;
      console.log(this.listData);
      this.setPublicHealthPatientData(this.listData[index]);
      this.$emit("listItemClick", {
        ...this.listData[index],
        date: new Date()
      });
    },
    search() {
      this.pageParams.pageNo = 1;
      this.patientListByExample();
    },
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.condition = obj.patientCode;
      this.pageParams.pageNo = 1;
      this.patientListByExample({
        patientId: obj.patientId,
        patientCode: obj.patientCode
      });
    },
    reSet() {
      this.condition = "";
    },
    //获取门诊患者列表
    async patientListByExample(obj) {
      let condition = this.condition ? this.condition.replace(/\s*/g,"") : "";
      let res = await post("/patient/archInfo/getPatientArchInfo", {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        condition,
        ...obj
      });
      this.listData = [];
      res.data.forEach((item, index) => {
        this.listData.push({
          ...item.patientArchiveInfoVO,
          patientEmpiInfoAdditionalVOS: item.patientEmpiInfoAdditionalVOS,
          addressInfo: item.patientEmpiInfoAddrssVO
        });
      });

      if (res.data.length) {
        this.$nextTick(() => {
          document.getElementsByClassName("l-patient-info-item")[0].click();
        });
      } else {
        this.currentPenetrate = "";
        this.$emit("listItemClick", {});
      }
      /* if (res.data.length == 1) {
        this.currentPenetrate = 0;
        this.$emit("listItemClick", {
          ...res.data[0].patientArchiveInfoVO,
          patientEmpiInfoAdditionalVOS:
            res.data[0].patientEmpiInfoAdditionalVOS,
          addressInfo: res.data[0].patientEmpiInfoAddrssVO
        });
      } else {
        this.currentPenetrate = "";
        this.$emit("listItemClick", {});
      } */
      this.pageParams.total = res.total;
    },
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.patientListByExample();
    },
    newRecord() {
      this.addarchivesStyle = true;
    },
    cancelstyle() {
      this.addarchivesStyle = false;
    },
    refsChild(data) {
      this.addarchivesStyle = false;
      //重新查询患者列表
      console.log(data);
      this.condition = data.patientArchiveInfoVO.patientCode;
      this.search();
    }
  }
};
</script>

<style lang='scss' scoped>
.sidebar {
  padding: $l-padding-default-4;
  padding-top: 0;
  padding-bottom: $l-padding-default-6;
  .search-area {
    margin-bottom: $l-margin-default-4;
    .search-con {
      /deep/ .rightButton.el-input {
        width: calc(100% - 47px);
      }
      /deep/ .el-button--mini {
        margin-left: $l-margin-default-1;
      }
      /deep/ input::-webkit-input-placeholder {
        /* placeholder颜色 */
        color: #aab2bd;
        /* placeholder字体大小 */
        font-size: 12px;
      }
      /deep/ .l-input-wrap {
        margin-left: 0;
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
  .l-c-penetrate {
    &.is-active {
      .name {
        color: $l-color-white;
      }
    }

    .name-specal {
      cursor: pointer;
    }
  }
  /deep/ .bottom {
    font-size: 12px;
  }
}
</style>
