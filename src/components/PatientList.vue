<template>
  <div class="PatientList">
    <l-formt-title class="mb10" label="患者姓名">
      <el-input v-model="patientName" placeholder="请输入"></el-input>
    </l-formt-title>
    <l-formt-title class="mb10" label="手机号码">
      <el-input v-model="mobile" placeholder="请输入"></el-input>
    </l-formt-title>
    <div :style="{ display: 'flex' }">
      <l-formt-title class="mb10" label="证件号">
        <el-input v-model="identificationNum" placeholder="请输入"></el-input>
      </l-formt-title>
      <el-button :style="{ marginLeft: '5px' }" type="primary" @click="readCard"
        >读证</el-button
      >
    </div>
    <div :style="{ display: 'flex' }">
      <l-formt-title class="mb10" label="患者卡号">
        <el-input v-model="cardData" placeholder="请输入"></el-input>
      </l-formt-title>
      <el-button :style="{ marginLeft: '5px' }" type="primary" @click="readCard"
        >读卡</el-button
      >
    </div>
    <l-formt-title class="mb10" label="患者编号">
      <el-input v-model="patientCode" placeholder="请输入"></el-input>
    </l-formt-title>
    <div class="buttonArea">
      <el-button style="width: 120px" type="primary" plain @click="search"
        >查询</el-button
      >
      <el-button style="width: 120px" type="primary" @click="reSet"
        >重置</el-button
      >
      <!-- <el-button style="width:90px" type="primary" @click="reSet">新建档案</el-button> -->
    </div>
    <div class="listContent">
      <l-table
        :paginationSmall="true"
        :total="pageParams.total"
        :pageSize.sync="pageParams.pageSize"
        :page.sync="pageParams.pageNo"
        layout="pager"
        :pagerCount="5"
        paginationAlign="center"
        :singlePageShow="true"
        @changeSize="handleSizeChange"
      >
        <div class="table-wrap">
          <el-card v-for="(item, index) in listData" :key="index">
            <div
              class="listItem"
              @click="listItemClick(item)"
              :class="{ currentClass: item.patientId == currentItem.patientId }"
            >
              <div class="one">
                <div>{{ item.patientName }}</div>
                <div class="patientCode">{{ item.patientCode }}</div>
              </div>
              <div class="two">
                <div style="margin-right: 25px">
                  {{ item.patientGender == "1" ? "男" : "女" }}
                </div>
                <div style="margin-right: 25px">{{ item.birthDate }}</div>
                <div>{{ item.mobileNum }}</div>
              </div>
              <div class="three">证件号：{{ item.identificationNum }}</div>
            </div>
            <div class="noData" v-if="!listData.length">暂无数据</div>
          </el-card>
        </div>
      </l-table>
    </div>
  </div>
</template>

<script>
import { post, get, put, del } from "@/utils/request";
export default {
  data() {
    return {
      name: "sadf",
      cardData: "", //卡号
      patientName: "", //患者姓名
      mobile: "", //手机号
      patientCode: "", //患者编号
      identificationNum: "", //身份证号
      listData: [],
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      currentItem: {}
    };
  },
  mounted() {
    // this.patientListByExample()
  },
  methods: {
    search() {
      if (
        !this.patientName &&
        !this.patientCode &&
        !this.mobile &&
        !this.cardData &&
        !this.identificationNum
      ) {
        this.$message.error("请至少输入一个查询项");
        return;
      }
      this.patientListByExample();
    },
    //获取门诊患者列表
    async patientListByExample() {
      let res = await get("/archInfo/patientListByExample", {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        cardData: this.cardData, //卡号
        patientName: this.patientName, //患者姓名
        mobile: this.mobile, //手机号
        patientCode: this.patientCode, //患者编号
        identificationNum: this.identificationNum //身份证号
      });
      this.listData = res.data;
      if (res.data.length == 1) {
        this.currentItem = data;
        this.$emit("listItemClick", res.data[0]);
      }
      this.pageParams.total = res.total;
    },
    listItemClick(data) {
      console.log(222);
      this.currentItem = data;
      this.$emit("listItemClick", data);
    },
    readCard() {
      this.$message.error("没有外接设备");
    },
    reSet() {
      this.cardData = ""; //卡号
      this.patientName = ""; //患者姓名
      this.mobile = ""; //手机号
      this.patientCode = ""; //患者编号
      this.identificationNum = ""; //身份证号
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.patientListByExample();
    }
  }
};
</script>

<style lang="scss">
.PatientList {
  height: 100%;
  padding-bottom: 40px;
  .mb10 {
    margin-bottom: 5px;
  }
  .buttonArea {
    display: flex;
    justify-content: space-between;
  }
  .listContent {
    height: calc(100% - 250px);
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #e4e4e4;
    .noData {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #909399;
    }
    .listItem {
      padding: 10px;
      .one {
        line-height: 2;
        display: flex;
        justify-content: space-between;
        .patientCode {
          color: #0000ff;
          text-decoration: underline;
        }
      }
      .two {
        line-height: 2;
        display: flex;
        justify-content: flex-start;
      }
      .three {
        line-height: 2;
      }
    }
  }
  .pagination {
    position: fixed;
    bottom: 10px;
  }
  .currentClass {
    background: #81d3f8;
  }
}
.table-wrap {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>
