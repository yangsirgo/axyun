<template>
    <div class="height100">
      <div class="patient-penetrate-container" v-loading="loading">
        <div class="patient-penetrate-box">
          <l-patient-info-item
            v-for="(item,index) in showData"
            :key="'click' + index"
            :class="{
                            'l-c-penetrate': true,
                            'is-active': currentPenetrate === index,
                          }"
            @click.native="recPatientHandler(item,index)"
          >
            <template #top>
              <span class="name">{{item.patientName}}</span>
              <span class="name">{{item.patientGender==1?'男':(item.patientGender==2?'女':'未知')}}</span>
              <span class="name">{{item.patientAge}}</span>
            </template>
            <template #bottom>
              <div class="grey">
                <span>就诊科室  </span>
                <span
                  tableName="sys_org"
                  :conditionMap="{org_type: '_DEPT_',id: item['ouptDeptId']}"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </div>
              <div class="grey">就诊医生  <span>{{item.doctorName || '--'}}</span></div>
              <div class="grey">就诊时间  <span>{{item.attendTime || '--'}}</span></div>
            </template>
          </l-patient-info-item>
        </div>
      </div>
      <div class="noData" v-if="!showData.length">暂无数据</div>
    </div>
</template>

<script>
import { saveSign, updateSign, findByPatientId } from "@/api/cis/order/order";
import { getIMUserID } from "@/api/admin/synUser";
import {
  getPatients,
  receive,
  findAllergy,
  selectPatientBySth,
  getCisNewPatients
} from "@/api/cis/visit/visit";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["params"],
  data() {
    return {
      loading: false,
      activeName: "second",
      showData: [],
      currentPenetrate: "",
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    async loadData() {
      // this.showData = [];

      let form = this.params;
      let startDate = "";
      let stopDate = "";

      if (form.timeRange) {
        startDate =
          form.timeRange && form.timeRange.length ? form.timeRange[0] + ' 00:00:00' : "";
        stopDate =
          form.timeRange && form.timeRange.length ? form.timeRange[1] + ' 23:59:59' : "";
      }

      let params = {
        // type: "third",
        // pricedChecked: form.pricedChecked,
        // patientIds: form.searchReasult,
        // startDate: startDate,
        // stopDate: stopDate,
        // visitCode: form.search,


        pricedChecked: form.pricedChecked,
        flag: 4,
        patientName: form.search,
        startDate: startDate,
        stopDate: stopDate
      };
      try {
        this.loading = true;
        let res = await getCisNewPatients(params);
        if (res.code == 1) {
          this.showData = res.data;
        } else {
          this.$message.error("获取数据失败");
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error("获取数据失败");
      }
    },
    recPatientHandler(row, index) {
      this.changeRecPatientData(row);
      this.currentPenetrate = index;
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .headerCls {
  height: 30px;
  background: rgba(246, 246, 246, 1);
  font-size: 14px;

  font-weight: 400;
  color: rgba(46, 50, 58, 1);
  padding: 0;
}

/deep/ .rowStyleCls {
  height: 40px;
  font-size: 14px;

  font-weight: 400;
  color: rgba(46, 50, 58, 1);

  > td {
    padding: 0;
  }
}

/deep/ .disabledRowStyleCls {
  /*background-color: #1f2d3d;*/
  color: #565656;
  background-color: #f5f7fa;
}

.pa {
  width: 32px;
  height: 21px;
  border-radius: 2px;
  border: 1px solid rgba(228, 228, 228, 1);
  font-size: 12px;

  font-weight: 500;
  color: $l-color-primary;
  line-height: 17px;
}

.wz {
  width: 32px;
  height: 21px;
  border-radius: 2px;
  border: 1px solid rgba(228, 228, 228, 1);
  font-size: 12px;

  font-weight: 500;
  color: rgba(19, 71, 150, 1);
  line-height: 17px;
}

.other {
  width: 32px;
  height: 21px;
  border-radius: 2px;
  border: 1px solid rgba(228, 228, 228, 1);
  font-size: 12px;

  font-weight: 500;
  color: rgba(225, 20, 10, 1);
  line-height: 15px;
}

.pricedCheckbox {
  height: 40px;
  line-height: 40px;
  text-align: center;
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
    justify-content: space-between;
  }

  .three {
    line-height: 2;
  }
}

.noData {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.table-wrap {
  height: 100%;
}

.listContent {
  height: 100%;
  overflow: auto;
  margin-top: 10px;
  border: 1px solid #e4e4e4;
}
.l-c-penetrate {
  &.is-active {
    .name {
      color: $l-color-white;
    }
  }
}
.grey{
  // color: #949da3;
}
</style>
