<template>
  <l-table
    :pageSize="pageParams.pageSize"
    :page="pageParams.pageNo"
    :total="pageParams.total"
    :background="false"
    :paginationSmall="true"
    layout="prev,pager,next"
    paginationAlign="center"
    :showTotal="true"
    @changeSize="sizeChangePatientList"
  >
    <div class="patient-penetrate-container">
      <div class="patient-penetrate-box">
        <div v-if="data.length === 0" class="emptyList">未找到相关患者</div>
        <l-patient-info-item
          v-else
          v-for="(item, index) in data"
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
                    :val="item.gender"
                    code="GENDER_CODE"
                    v-codeTransform
                    v-if="item.gender"
                  ></span>
                </span>
                <span
                  v-if="item.age"
                  class="overflowEllipsis maxWidth32 nameStyle fontSizeStyle"
                >
                  {{ isNaN(item.age) ? item.age : item.age + "岁" }}
                </span>
              </div>
              <div
                :title="item.bedNo"
                class="bedNo maxWidth42 overflowEllipsis"
              >
                {{ item.bedNo }}
              </div>
            </div>
          </template>
          <template #bottom>
            <div>
              <span class="fontSize">家床号</span>
              <span class="fontSize fontSizeStyle">
                {{ item.treatNo || "--" }}
              </span>
            </div>
            <div class="show-patient-detail">
              <span>建床时间</span>
              <span class="margin-left-4">{{
                item.treatStartTime || "--"
              }}</span>
            </div>
          </template>
        </l-patient-info-item>
      </div>
    </div>
  </l-table>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      //   patientList: [],
      currentRowIndex: ""
    };
  },
  mounted() {
    this.resetPageParams();
  },
  computed: {
    // 获取患者信息
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "homeSickbeds/changeRecPatientData"
    }),
    // 列表分页
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.$emit("sizeChangePatientList", a);
    },
    // 点击获取
    patientListFun(item, a) {
      this.currentRowIndex = a;
      console.log("item", item);
      // 判断是否有基本信息
      this.$emit("patientListFun", item);

      this.changeRecPatientData({
        ...item,
        ...{
          patientAge: String(item.age || ""),
          patientGender: item.gender
        }
      });
    },
    resetPageParams() {
      this.pageParams = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
    },
    resetActiveItem() {
      this.currentRowIndex = "";
    },
    setActiveItem() {
      this.resetActiveItem();
      this.$nextTick(() => {
        this.currentRowIndex = this.data.findIndex(item => {
          return item.id === this.receivePatientData.id;
        });
        if(this.currentRowIndex !== "" && this.currentRowIndex > -1) {
          this.patientListFun(this.data[this.currentRowIndex], this.currentRowIndex);
        } else {
          this.patientListFun(this.data[0], 0);
        }
      });
    },
    setpageParams(pageParams) {
      this.pageParams = pageParams;
    }
  },
  components: {},
  watch: {
    data: {
      deep: true,
      handler(val) {
        //   if (val.length > 0){
        //       this.
        //   }
      }
    }
  }
};
</script>

<style scoped lang="scss">
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
