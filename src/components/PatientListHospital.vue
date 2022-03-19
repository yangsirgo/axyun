<template>
  <div class="sidebar height100">
    <l-sidebar-left>
      <template #top>
        <div class="search-area">
          <l-card-title style="padding: 8px 0">
            <template #left>患者列表</template>
          </l-card-title>
          <div class="search-con">
            <l-formt-title>
              <el-input
                class="rightButton"
                v-model="condition"
                placeholder="姓名/编号/床位号/住院号"
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
                  <span class="name">{{ item.patientName }}</span>
                  <span class="patientGender c999">{{
                    item.patientGender == 1
                      ? "男"
                      : item.patientGender == 2
                      ? "女"
                      : "未知"
                  }}</span>
                  <span class="age c999">{{ item.patientAge }}</span>
                  <!-- <span class="inpCode c999">{{item.inpCode}}</span> -->
                </template>
                <template #bottom>
                  <div style="font-size: 12px; color: #999; line-height: 1.5">
                    <div>患者编号：{{ item.patientCode }}</div>
                    <div>证件号：{{ item.identificationNum }}</div>
                    <div>建床时间：{{ item.finAdmissionTime }}</div>
                    <div>住院号：{{ item.inpCode }}</div>
                    <div>床号：{{ item.bedCode }}</div>
                  </div>
                </template>
              </l-patient-info-item>
            </div>
          </div>
        </l-table>
      </template>
    </l-sidebar-left>
  </div>
</template>

<script>
import { post, get, put, del } from "@/utils/request";
import readCardMixin from "@/mixins/readCard.js";
export default {
  mixins: [readCardMixin],
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
      currentPenetrate: ""
    };
  },
  mounted() {
    this.$root.$on("PatientListHospitalRefresh", this.refresh);
  },
  methods: {
    choosePenetrateItem(index) {
      this.currentPenetrate = index;
      this.$emit("listItemClick", this.listData[index]);
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
    /* readCard() {
      this.$message.error("没有外接设备");
    }, */
    reSet() {
      this.condition = "";
    },
    //刷新患者列表
    async refresh() {
      await this.patientListByExample();
      this.$emit("listItemClick", this.listData[this.currentPenetrate]);
    },
    //获取在院患者列表
    async patientListByExample(obj) {
      let condition = this.condition ? this.condition.replace(/\s*/g,"") : "";
      let res = await get("/finance-inp/inp/getInpPatientInfo", {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        searchValue: condition,
        ...obj
      });
      // let list = [];
      // res.data.forEach((item, index) => {
      //   list.push(item);
      // });
      this.listData = res.data;
      if (res.data.length) {
        /* this.currentPenetrate = 0;
        this.$emit("listItemClick", res.data[0]); */
        this.$nextTick(() => {
          document.getElementsByClassName("l-patient-info-item")[0].click();
        });
      } else {
        this.currentPenetrate = "";
        this.$emit("listItemClick", {});
      }
      this.pageParams.total = res.total;
    },
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.patientListByExample();
    }
  },
  beforeDestroy() {
    this.$root.$off("PatientListHospitalRefresh");
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
  }
  .name {
    font-weight: bold;
  }
  .inpCode {
    float: right;
  }
  .c999 {
    color: #aaa;
  }
}
</style>
