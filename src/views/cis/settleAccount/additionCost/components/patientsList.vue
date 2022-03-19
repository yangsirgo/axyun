<template>
  <div class="sidebar height100">
    <l-sidebar-left>
      <template #top>
        <div class="search-area">
          <l-card-title style="padding: 8px 0">
            <template #left>患者列表</template>
          </l-card-title>
          <div class="search-con">
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              style="width: 100%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="预约开始日期"
              end-placeholder="预约结束日期"
              @change="search"
            ></el-date-picker>
            <l-formt-title>
              <el-input
                class="rightButton"
                v-model="condition"
                placeholder="请输入姓名/手机号/身份证/医保卡"
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
                }"
                @click.native="choosePenetrateItem(index)"
              >
                <template #top>
                  <span class="name">{{ item.patientName }}</span>
                </template>
                <template #bottom>
                  <span>身份证号:{{ item.identificationNum }}</span>
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
export default {
  data() {
    return {
      listData: [],
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      timeRange: [],
      condition: "",
      currentPenetrate: ""
    };
  },
  methods: {
    choosePenetrateItem(index) {
      this.currentPenetrate = index;
      this.$emit("listItemClick", this.listData[index]);
    },
    search() {
      this.patientListByExample();
    },
    readCard() {
      this.$message.error("没有外接设备");
    },
    reSet() {
      this.condition = "";
    },
    //获取门诊患者列表
    async patientListByExample() {
      let res = await post("/patient/archInfo/getPatientArchInfo", {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        condition: this.condition
      });
      this.listData = [];
      res.data.forEach((item, index) => {
        this.listData.push(item.patientArchiveInfoVO);
      });
      if (res.data.length == 1) {
        this.currentPenetrate = 0;
        this.$emit("listItemClick", res.data[0].patientArchiveInfoVO);
      }
      this.pageParams.total = res.total;
    },
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.patientListByExample();
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
        width: calc(100% - 56px);
      }
      /deep/ .el-button--mini {
        margin-left: $l-margin-default-4;
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
}
</style>
