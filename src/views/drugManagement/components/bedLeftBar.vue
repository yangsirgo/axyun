<template>
  <l-sidebar-left class="bar-cont">
    <template slot="top">
      <div class="bar-top">
        <l-card-title>
          <template slot="left">患者列表</template>
        </l-card-title>
        <l-formt-title class="search-input l-input-wrap-new">
          <el-input
            v-model="form.search"
            :maxlength="100"
            placeholder="姓名/身份证号/家床号"
            @keyup.enter.native="query"
          >
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="query"
            >
            </i>
          </el-input>
        </l-formt-title>
        <div class="btns-contain">
          <el-button type="primary" plain class="btn" @click="query"
            >查询</el-button
          >
          <el-button plain class="btn" @click="reset">重置</el-button>
        </div>
      </div>
    </template>
    <template slot="bottom">
      <l-table
        class="patientsList"
        :pageSize="pageParams.pageSize"
        :page="pageParams.pageNo"
        :total="pageParams.total"
        :background="false"
        :paginationSmall="true"
        :showTotal="true"
        layout="prev,pager,next"
        paginationAlign="center"
        @changeSize="sizeChangePatientList"
        v-loading="patientsLoading"
      >
        <div class="patient-penetrate-container">
          <div class="patient-penetrate-box">
            <div v-if="patientsList.length === 0" class="emptyList">
              未找到相关患者
            </div>
            <l-patient-info-item
              v-else
              v-for="(item, index) in patientsList"
              :key="'click' + index"
              :class="{
                'l-c-penetrate': true,
                'is-active': currentRowIndex === index,
              }"
              @click.native="patientListFun(item, index)"
            >
              <template #top>
                <div class="patient-top-wrapper">
                  <div class="patient-top">
                    <span
                      :title="item.patientName"
                      class="overflowEllipsis maxWidth42 nameStyle name-text fontSizeStyle patientNameStyle"
                      >{{ item.patientName }}</span
                    >
                    <span
                      class="overflowEllipsis maxWidth32 nameStyle code-text fontSizeStyle"
                    >
                      <span
                        :val="item.patientGender"
                        code="GENDER_CODE"
                        v-codeTransform
                        v-if="item.patientGender"
                      ></span>
                    </span>
                    <span
                      v-if="item.patientAge"
                      class="overflowEllipsis maxWidth32 nameStyle fontSizeStyle"
                    >
                      {{ item.patientAge || "--" }}
                    </span>
                  </div>
                  <div
                    :title="item.bedCode"
                    class="bedNo maxWidth42 overflowEllipsis"
                  >
                    {{ item.bedCode }}
                  </div>
                </div>
              </template>
              <template #bottom>
                <div>
                  <span class="fontSize">家床号</span>
                  <span class="fontSize fontSizeStyle">
                    {{ item.inpCode }}
                  </span>
                </div>
                <div class="show-patient-detail">
                  <span>建床时间</span>
                  <span class="margin-left-4">{{
                    item.admissionTime || "--"
                  }}</span>
                </div>
              </template>
            </l-patient-info-item>
          </div>
        </div>
      </l-table>
    </template>
  </l-sidebar-left>
</template>

<script>
import { getPatients } from "@/api/homeSickbeds/hsDiagTreat/hsDiagTreat.js";
import { mapActions } from "vuex";
import ipha from "@/api/hmm/ipha.js";

export default {
  name: "bedMLeftBar",
  props: {
    sign: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: { search: "" },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      patientsLoading: false,
      patientsList: [],
      currentRowIndex: null,
      currentPatientId: null
    };
  },
  created() {
    this.query();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "homeSickbeds/changeRecPatientData"
    }),
    query() {
      this.pageParams.pageNo = 1;
      this.getList();
    },
    reset() {
      this.form = this.$options.data().form;
    },
    getList() {
      this.patientsLoading = true;
      let condition = this.form.search ? this.form.search.replace(/\s*/g,"") : "";
      
      ipha
        .getAllInpPatientInfo({
          ...this.pageParams,
          searchValue: condition,
          sign: this.sign
        })
        .then(res => {
          this.patientsLoading = false;
          if (res.code === 1) {
            this.patientsList = res.data;
            this.pageParams.total = res.total;
            if (res.data.length) {
              let index = 0;
              let search = res.data.map((item,i) => {
                if(item.patientId === this.currentPatientId) index = i;
                return item.patientId === this.currentPatientId
              });
              if(search.length) {
                this.patientListFun(res.data[index], index);
              }else{
                this.patientListFun(res.data[0], 0);
              }
            }
          } else {
            this.$message.error(msg || "药房获取患者列表失败");
          }
        })
        .catch(err => {
          this.patientsLoading = false;
          this.$message.error("药房获取患者列表报错");
        });
    },
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.getList();
    },
    patientListFun(item, index) {
      this.currentRowIndex = index;
      this.currentPatientId = item.patientId;
      this.changeRecPatientData({
        ...item
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bar-cont {
  padding-bottom: $l-padding-default-4;
  .bar-top {
    padding: $l-padding-default-4;
  }
  .search-input {
    margin: $l-margin-default-2 0;
  }

  .btns-contain {
    display: flex;
    justify-content: space-between;
    .btn {
      width: 100px;
    }
  }
}
.is-active .nameStyle {
  color: #ffffff;
}

.listItem-top-style .fontSizeStyle {
  color: #ffffff;
}

.fontSizeStyle {
  overflow: hidden; /*设置超出的部分进行影藏*/
  text-overflow: ellipsis; /*设置超出部分使用省略号*/
  white-space: nowrap;
  text-align: left;
  color: #666c70;
  font-size: 12px;
}

.fontSize {
  text-align: left;
  color: #949da3;
  font-size: 10px;
}

.show-patient-detail {
  font-size: 12px;
  color: #949da3;
}

.name-text {
  max-width: 42px;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #2e323a;
  line-height: 20px;
}

.code-text {
  max-width: 24px;
}

.emptyList {
  width: calc(100% - 24px);
  margin-top: 30vh;
  font-size: 12px;
  font-weight: 400;
  color: #b9c4cc;
  text-align: center;
}

.overflowEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.maxWidth42 {
  max-width: 42px;
}
.maxWidth32 {
  max-width: 42px;
}
.patientsList {
  padding: 0 8px;
}
.patient-top-wrapper {
  font-size: 0px;
  display: flex;
  align-items: center;
  .patient-top {
    display: inline-block;
    flex: 1;
    display: flex;
    align-items: center;
    > span {
      display: inline-block;
    }
    > span + span {
      margin-left: 4px;
    }
  }
  .bedNo {
    display: inline-block;
    font-weight: 700;
    text-align: center;
    color: #f05a23;
    font-size: 14px;
  }
}
</style>
